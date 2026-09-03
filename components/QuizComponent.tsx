"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, X, Heart, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { TieOutStamp } from "@/components/diagrams/TieOutStamp";
import { openAskAI } from "@/lib/noteActions";
import {
  useUserProgress,
  useQuizResults,
  useCpaProgress,
  useFinanceProgress,
  useAttempts,
  useSrs,
  heartsWithRefill,
  msUntilNextHeart,
} from "@/lib/store";
import { ERROR_CATEGORIES, classify, type ErrorCategory } from "@/lib/errorClassify";
import { dayNumber } from "@/lib/spacedRepetition";
import type { Quiz } from "@/lib/types";

interface QuizComponentProps {
  quiz: Quiz;
  monthId: string;
  weekId: string;
  onComplete: (score: number, totalQuestions: number) => void;
  onExit: () => void;
  /**
   * Which progress track to record into. "cma" (default) writes to the shared
   * CMA user-progress/quiz-results stores; "cpa" and "finance" write to isolated
   * stores so non-CMA completions never inflate CMA progress or month labels.
   */
  track?: "cma" | "cpa" | "finance";
  /** Skill tags stamped onto every AttemptEvent recorded from this quiz. */
  skills?: string[];
  /** Attempt-ledger itemId prefix; defaults to `${track}:${monthId}:${weekId}`. */
  itemIdPrefix?: string;
}

interface AnswerState {
  selectedAnswer: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
}

export function QuizComponent({
  quiz,
  monthId,
  weekId,
  onComplete,
  onExit,
  track = "cma",
  skills,
  itemIdPrefix,
}: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(
    quiz.questions.map(() => ({
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: false,
    }))
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Attempt-ledger capture (FABLE5_ANALYSIS §4a): per-question timing, one
  // AttemptEvent per answered question, plus optional one-tap confidence and
  // "why did I miss it?" tags on the event just recorded.
  const { record, setConfidence, setErrorCategory } = useAttempts();
  const upsertMiss = useSrs((s) => s.upsertMiss);
  const questionShownAtRef = useRef<number>(Date.now());
  const lastAttemptIdRef = useRef<string | null>(null);
  const [confidenceChoice, setConfidenceChoice] = useState<0 | 1 | 2 | null>(null);
  const [missCategory, setMissCategory] = useState<ErrorCategory | null>(null);

  const { addXP, loseHeart, completeQuiz, canTakeQuiz, hearts, lastHeartLossAt } =
    useUserProgress();
  const { addResult } = useQuizResults();
  const cpaProgress = useCpaProgress();
  const financeProgress = useFinanceProgress();

  // Heart gate runs ONCE at quiz start (mount). It must never re-run mid-quiz:
  // losing the 5th heart on a question would otherwise kill the in-flight
  // attempt. An attempt that has started is always finishable.
  const [lockedAtStart, setLockedAtStart] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    // Hearts lockout disabled — every quiz is always accessible (nothing gated).
    void canTakeQuiz;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // While locked out, tick so the "next heart in Xm" countdown stays fresh and
  // the Start button appears once a heart refills.
  useEffect(() => {
    if (!lockedAtStart) return;
    const id = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [lockedAtStart]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Out-of-hearts lockout screen (start-of-quiz only, never mid-quiz).
  if (lockedAtStart) {
    const heartState = { hearts, lastHeartLossAt };
    const heartsNow = heartsWithRefill(heartState, nowMs);
    const nextMs = msUntilNextHeart(heartState, nowMs);
    const nextMin = nextMs != null ? Math.max(1, Math.ceil(nextMs / 60_000)) : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="card-duolingo">
            <CardContent className="p-8">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Out of Hearts!
              </h2>
              <p className="text-muted-foreground mb-2">
                You need at least one heart to start a quiz. Hearts refill automatically — 1 heart
                every 30 minutes — or you can practice flashcards while you wait.
              </p>
              {heartsNow === 0 && nextMin != null && (
                <p className="font-medium text-foreground mb-6">Next heart in {nextMin}m</p>
              )}
              <div className="flex flex-col gap-3">
                {heartsNow > 0 && (
                  <Button onClick={() => setLockedAtStart(false)} className="btn-primary">
                    Start Quiz ({heartsNow} {heartsNow === 1 ? "heart" : "hearts"})
                  </Button>
                )}
                <Button onClick={onExit} className={heartsNow > 0 ? "" : "btn-primary"}>
                  Practice Flashcards
                </Button>
                <Button onClick={onExit} variant="outline">
                  Back to Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (currentAnswer.isAnswered) return;

    const isCorrect = answerIndex === currentQuestion.answer;

    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        selectedAnswer: answerIndex,
        isAnswered: true,
        isCorrect,
      };
      return newAnswers;
    });

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      loseHeart();
    }

    // Record the attempt event (does not touch XP/hearts/streak).
    const timeSec = Math.round((Date.now() - questionShownAtRef.current) / 1000);
    const itemId = `${itemIdPrefix ?? `${track}:${monthId}:${weekId}`}:q${currentQuestionIndex}`;
    lastAttemptIdRef.current = record({
      source: "quiz",
      itemId,
      track,
      skills: skills ?? [],
      correct: isCorrect,
      answer: answerIndex,
      timeSec,
    });

    // Wrong answers seed the SRS queue so they resurface on review surfaces
    // with a route back to this quiz.
    if (!isCorrect) {
      const hrefByTrack: Record<"cma" | "cpa" | "finance", string> = {
        cma: `/learn/${monthId}/${weekId}/quiz`,
        cpa: `/cpa/${monthId}/${weekId}`,
        finance: `/finance/${monthId}/${weekId}`,
      };
      const primarySkill = (skills ?? [])[0];
      upsertMiss(
        {
          itemId,
          skills: skills ?? [],
          track,
          source: "quiz",
          label: `${track.toUpperCase()} ${monthId}-${weekId} Q${currentQuestionIndex + 1}${primarySkill ? ` — ${primarySkill}` : ""}`,
          href: hrefByTrack[track],
        },
        dayNumber(Date.now())
      );
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
      // Reset per-question attempt-capture state and stamp the next display.
      questionShownAtRef.current = Date.now();
      lastAttemptIdRef.current = null;
      setConfidenceChoice(null);
      setMissCategory(null);
    } else {
      handleQuizComplete();
    }
  };

  const handleConfidenceTap = (level: 0 | 1 | 2) => {
    if (!lastAttemptIdRef.current) return;
    setConfidenceChoice(level);
    setConfidence(lastAttemptIdRef.current, level);
  };

  const handleMissCategoryTap = (category: ErrorCategory) => {
    if (!lastAttemptIdRef.current) return;
    setMissCategory(category);
    setErrorCategory(lastAttemptIdRef.current, category);
  };

  const handleQuizComplete = () => {
    // Calculate final score
    const finalScore = answers.filter((answer) => answer.isCorrect).length;

    // Award XP based on performance
    const percentage = finalScore / quiz.questions.length;
    let xpGain = 0;

    if (percentage === 1.0) {
      xpGain = 100; // Perfect score
    } else if (percentage >= 0.8) {
      xpGain = 75; // Excellent
    } else if (percentage >= 0.6) {
      xpGain = 50; // Good
    } else {
      xpGain = 25; // Participation
    }

    addXP(xpGain);

    // Mark quiz as completed + record the result in the appropriate track's store.
    // Non-CMA tracks write to isolated stores so they never inflate CMA progress.
    if (track === "cpa") {
      cpaProgress.completeQuiz(monthId, weekId, finalScore, quiz.questions.length);
      cpaProgress.addResult({
        monthId,
        weekId,
        score: finalScore,
        totalQuestions: quiz.questions.length,
      });
    } else if (track === "finance") {
      financeProgress.completeQuiz(monthId, weekId, finalScore, quiz.questions.length);
      financeProgress.addResult({
        monthId,
        weekId,
        score: finalScore,
        totalQuestions: quiz.questions.length,
      });
    } else {
      completeQuiz(monthId, weekId, finalScore, quiz.questions.length);
      addResult({
        monthId,
        weekId,
        score: finalScore,
        totalQuestions: quiz.questions.length,
      });
    }

    setQuizComplete(true);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 0.8) return "text-green-600";
    if (percentage >= 0.6) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage === 1.0) return "Perfect! Outstanding work!";
    if (percentage >= 0.8) return "Excellent performance!";
    if (percentage >= 0.6) return "Good job! Keep studying!";
    return "Keep practicing - you'll improve!";
  };

  if (quizComplete) {
    const percentage = score / quiz.questions.length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="card-duolingo">
            <CardContent className="p-8">
              <div className="mb-4 flex justify-center">
                <TieOutStamp tone={percentage >= 0.8 ? "good" : "warn"} />
              </div>

              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Quiz Complete!
              </h2>

              <div className="space-y-4 mb-6">
                <div className="bg-accent rounded-2xl p-4">
                  <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                    {Math.round(percentage * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>

                <p className={`font-medium ${getScoreColor(percentage)}`}>
                  {getScoreMessage(percentage)}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{score}</div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-muted-foreground">
                      {quiz.questions.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => onComplete(score, quiz.questions.length)}
                className="btn-primary w-full"
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <Button
              onClick={onExit}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Quiz
            </Button>

            <div className="flex-1 mx-4">
              <Progress value={progress} className="h-3" />
              <div className="text-center mt-1 text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Score: {score}/{quiz.questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto max-w-2xl p-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Knowledge Check</h1>
          <p className="text-muted-foreground">Test your understanding of the key concepts</p>
        </div>

        {/* Question Card */}
        <Card className="card-duolingo mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-foreground leading-relaxed">
                {currentQuestion.q}
              </h2>
            </div>

            {/* Answer Choices */}
            <div className="space-y-3">
              {currentQuestion.choices.map((choice, index) => {
                let buttonClass =
                  "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ";
                let iconElement = null;

                if (currentAnswer.isAnswered) {
                  if (index === currentQuestion.answer) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800";
                    iconElement = <CheckCircle className="h-5 w-5 text-green-600" />;
                  } else if (index === currentAnswer.selectedAnswer) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                    iconElement = <X className="h-5 w-5 text-red-600" />;
                  } else {
                    buttonClass += "border-border bg-gray-50 text-muted-foreground";
                  }
                } else {
                  buttonClass +=
                    "border-border hover:border-primary/40 hover:bg-accent cursor-pointer";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={currentAnswer.isAnswered}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{choice}</span>
                      {iconElement}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        {showExplanation && currentQuestion.explain && (
          <Card className="mb-8 border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground mb-2">Explanation</h3>
                  <p className="text-foreground leading-relaxed">{currentQuestion.explain}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attempt-ledger one-tap self-report — both rows are skippable */}
        {currentAnswer.isAnswered && (
          <div className="mb-6 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="mr-1">How sure were you?</span>
              {(
                [
                  [0, "Low"],
                  [1, "Med"],
                  [2, "High"],
                ] as const
              ).map(([level, label]) => (
                <button
                  key={level}
                  onClick={() => handleConfidenceTap(level)}
                  className={`rounded-full border px-2.5 py-0.5 transition-colors ${
                    confidenceChoice === level
                      ? "border-primary bg-accent text-primary-dark"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {!currentAnswer.isCorrect && (
              <>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="mr-1">Why did you miss it?</span>
                  {ERROR_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleMissCategoryTap(cat)}
                      className={`rounded-full border px-2.5 py-0.5 transition-colors ${
                        missCategory === cat
                          ? "border-red-500 bg-red-100 text-red-800"
                          : "border-border bg-card text-muted-foreground hover:border-red-300"
                      }`}
                    >
                      {classify(cat).label}
                    </button>
                  ))}
                </div>
                {missCategory && (
                  <p className="text-xs text-muted-foreground italic">
                    {classify(missCategory, skills ?? []).advice}
                  </p>
                )}
                <button
                  onClick={() =>
                    openAskAI(
                      `I'm studying and got this quiz question wrong.\n\nQuestion: ${currentQuestion.q}\n${currentQuestion.choices
                        .map((c, i) => `${String.fromCharCode(65 + i)}. ${c}`)
                        .join("\n")}\n\nI chose ${
                        currentAnswer.selectedAnswer != null
                          ? String.fromCharCode(65 + currentAnswer.selectedAnswer)
                          : "(none)"
                      }. The correct answer is ${String.fromCharCode(65 + currentQuestion.answer)}.\n\nIn plain language for someone still learning: what concept this tests, the misconception behind my choice, why the correct answer is right, and the rule to remember so I don't miss this type again.`
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-accent"
                >
                  <Sparkles className="h-3 w-3" /> Explain why I&apos;m wrong (AI)
                </button>
              </>
            )}
          </div>
        )}

        {/* Next Button */}
        {currentAnswer.isAnswered && (
          <div className="text-center">
            <Button onClick={handleNext} className="btn-primary" size="lg">
              {currentQuestionIndex < quiz.questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Default export for backward compatibility
export default QuizComponent;
