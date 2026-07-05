"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  QuizQuestion,
  QuizConfig,
  QuizMode,
  QuizState,
  QuizAnswer,
  QuizScore,
  QuizAttempt,
  QuizReviewData,
  calculateGrade,
  calculateXP,
  POINTS_BY_DIFFICULTY,
  TIME_LIMITS_BY_DIFFICULTY,
  QuestionDifficulty,
} from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Lightbulb,
  Clock,
  Play,
  Pause,
  AlertCircle,
  Award,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { useUserProgress, useAttempts, useSrs } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { ERROR_CATEGORIES, classify, type ErrorCategory } from "@/lib/errorClassify";
import { dayNumber } from "@/lib/spacedRepetition";
import { QuizReview } from "@/components/QuizReview";

interface QuizEngineProps {
  monthId: string;
  weekId: string;
  questions: QuizQuestion[];
  config?: Partial<QuizConfig>;
  /**
   * Attempt-ledger tagging (FABLE5_ANALYSIS §4a). The CMA learn quiz page is
   * served by /api/curriculum/week which merges the cma-skills sidecar, so
   * these arrive on the loaded week data.
   */
  skills?: string[];
  itemIdPrefix?: string;
}

const DEFAULT_CONFIG: QuizConfig = {
  id: "default",
  title: "Quiz",
  mode: "practice",
  passingScore: 70,
  shuffleQuestions: false,
  shuffleOptions: true,
  showHints: true,
  allowSkip: true,
  allowReview: true,
  showExplanations: true,
};

export function QuizEngine({ monthId, weekId, questions, config = {}, skills, itemIdPrefix }: QuizEngineProps) {
  const router = useRouter();
  const hydrated = useHydratedStore();
  const userProgress = useUserProgress();
  const recordAttempt = useAttempts((s) => s.record);
  const setAttemptConfidence = useAttempts((s) => s.setConfidence);
  const setAttemptErrorCategory = useAttempts((s) => s.setErrorCategory);
  const upsertMiss = useSrs((s) => s.upsertMiss);

  const quizConfig: QuizConfig = { ...DEFAULT_CONFIG, ...config };

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    startTime: Date.now(),
    timeElapsed: 0,
    flaggedQuestions: new Set(),
    completedQuestions: new Set(),
    mode: quizConfig.mode,
    paused: false,
  });

  const [currentAnswer, setCurrentAnswer] = useState<string | string[] | number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [reviewData, setReviewData] = useState<QuizReviewData | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Attempt-ledger one-tap self-report (FABLE5_ANALYSIS §4a) — mirrors
  // QuizComponent: confidence on every answered item, "why did I miss it?"
  // error tag on wrong ones. Only live for the attempt just recorded (id kept
  // in state, not restored when navigating back to an old question).
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null);
  const [confidenceChoice, setConfidenceChoice] = useState<0 | 1 | 2 | null>(null);
  const [missCategory, setMissCategory] = useState<ErrorCategory | null>(null);

  const resetSelfReport = () => {
    setLastAttemptId(null);
    setConfidenceChoice(null);
    setMissCategory(null);
  };

  const handleConfidenceTap = (level: 0 | 1 | 2) => {
    if (!lastAttemptId) return;
    setConfidenceChoice(level);
    setAttemptConfidence(lastAttemptId, level);
  };

  const handleMissCategoryTap = (category: ErrorCategory) => {
    if (!lastAttemptId) return;
    setMissCategory(category);
    setAttemptErrorCategory(lastAttemptId, category);
  };

  // Shuffle questions if needed
  const displayQuestions = useMemo(() => {
    if (quizConfig.shuffleQuestions) {
      return [...questions].sort(() => Math.random() - 0.5);
    }
    return questions;
  }, [questions, quizConfig.shuffleQuestions]);

  // Shuffle options for current question
  const currentQuestion = displayQuestions[quizState.currentQuestionIndex];
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion?.options) return [];
    if (quizConfig.shuffleOptions && currentQuestion.type !== 'true-false') {
      return [...currentQuestion.options].sort(() => Math.random() - 0.5);
    }
    return currentQuestion.options;
  }, [currentQuestion, quizConfig.shuffleOptions]);

  // Timer for quiz
  useEffect(() => {
    if (quizState.paused || quizCompleted) return;

    const interval = setInterval(() => {
      setQuizState((prev) => ({
        ...prev,
        timeElapsed: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState.paused, quizCompleted]);

  // Auto-save progress to localStorage
  useEffect(() => {
    if (!quizCompleted && hydrated) {
      const progressKey = `quiz-progress-${monthId}-${weekId}`;
      localStorage.setItem(
        progressKey,
        JSON.stringify({
          state: {
            ...quizState,
            flaggedQuestions: Array.from(quizState.flaggedQuestions),
            completedQuestions: Array.from(quizState.completedQuestions),
          },
          currentAnswer,
          hasSubmittedCurrent,
          hintsRevealed,
          savedAt: Date.now(),
        })
      );
    }
  }, [quizState, currentAnswer, hasSubmittedCurrent, hintsRevealed, monthId, weekId, quizCompleted, hydrated]);

  // Load saved progress
  useEffect(() => {
    if (hydrated) {
      const progressKey = `quiz-progress-${monthId}-${weekId}`;
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const savedAt = parsed.savedAt || 0;
          // Only restore if saved within last 24 hours
          if (Date.now() - savedAt < 24 * 60 * 60 * 1000) {
            setQuizState({
              ...parsed.state,
              flaggedQuestions: new Set(parsed.state.flaggedQuestions),
              completedQuestions: new Set(parsed.state.completedQuestions),
            });
            setCurrentAnswer(parsed.currentAnswer);
            setHasSubmittedCurrent(parsed.hasSubmittedCurrent);
            setHintsRevealed(parsed.hintsRevealed);
          }
        } catch (e) {
          console.error("Failed to restore quiz progress:", e);
        }
      }
    }
  }, [hydrated, monthId, weekId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isAnswerCorrect = useCallback(
    (question: QuizQuestion, userAnswer: string | string[] | number | null): boolean => {
      if (userAnswer === null || userAnswer === undefined) return false;

      switch (question.type) {
        case 'multiple-choice':
        case 'true-false':
          return userAnswer === question.correctAnswer;

        case 'multiple-select':
          if (!Array.isArray(userAnswer) || !Array.isArray(question.correctAnswer)) return false;
          const sortedUser = [...userAnswer].sort();
          const sortedCorrect = [...question.correctAnswer].sort();
          return (
            sortedUser.length === sortedCorrect.length &&
            sortedUser.every((val, idx) => val === sortedCorrect[idx])
          );

        case 'fill-blank':
          if (typeof userAnswer !== 'number' || typeof question.correctAnswer !== 'number')
            return false;
          const tolerance = question.tolerance || 0;
          return Math.abs(userAnswer - question.correctAnswer) <= tolerance;

        case 'matching': {
          if (!Array.isArray(userAnswer) || !Array.isArray(question.correctAnswer)) return false;
          const normalize = (value: string) => value.trim().toLowerCase();
          const sortedUser = userAnswer.map(normalize).sort();
          const sortedCorrect = question.correctAnswer.map(normalize).sort();
          return (
            sortedUser.length === sortedCorrect.length &&
            sortedUser.every((val, idx) => val === sortedCorrect[idx])
          );
        }

        case 'scenario':
          return userAnswer === question.correctAnswer;

        default:
          return false;
      }
    },
    []
  );

  const handleAnswerChange = (value: string | string[] | number) => {
    if (hasSubmittedCurrent) return;
    setCurrentAnswer(value);
  };

  const handleMultipleSelectToggle = (option: string) => {
    if (hasSubmittedCurrent) return;

    setCurrentAnswer((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      if (current.includes(option)) {
        return current.filter((o) => o !== option);
      }
      return [...current, option];
    });
  };

  const handleSubmitAnswer = () => {
    if (hasSubmittedCurrent || !currentQuestion) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = isAnswerCorrect(currentQuestion, currentAnswer);

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      userAnswer: currentAnswer,
      isCorrect,
      timeSpent,
      hintsUsed: hintsRevealed,
      skipped: false,
      flaggedForReview: quizState.flaggedQuestions.has(currentQuestion.id),
    };

    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer,
      },
      completedQuestions: new Set([...prev.completedQuestions, currentQuestion.id]),
    }));

    // Unified attempt ledger (FABLE5_ANALYSIS §4a). The question's own id is
    // used (not the display index) because displayQuestions may be shuffled.
    const itemId = `${itemIdPrefix ?? `cma:${monthId}:${weekId}`}:${currentQuestion.id}`;
    const attemptId = recordAttempt({
      source: "quiz",
      itemId,
      track: "cma",
      skills: skills ?? [],
      correct: isCorrect,
      answer: currentAnswer,
      timeSec: timeSpent,
    });
    setLastAttemptId(attemptId);
    setConfidenceChoice(null);
    setMissCategory(null);

    // Wrong answers seed the SRS queue with a route back to this quiz page.
    if (!isCorrect) {
      const primarySkill = (skills ?? [])[0];
      upsertMiss(
        {
          itemId,
          skills: skills ?? [],
          track: "cma",
          source: "quiz",
          label: `CMA ${monthId}-${weekId} ${currentQuestion.id}${primarySkill ? ` — ${primarySkill}` : ""}`,
          href: `/learn/${monthId}/${weekId}/quiz`,
        },
        dayNumber(Date.now())
      );
    }

    setHasSubmittedCurrent(true);

    if (quizConfig.showExplanations || quizConfig.mode === 'practice') {
      setShowExplanation(true);
    }

    // Lose heart if incorrect (only in practice mode)
    if (!isCorrect && quizConfig.mode === 'practice' && userProgress.hearts > 0) {
      userProgress.loseHeart();
    }
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < displayQuestions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      setCurrentAnswer(null);
      setShowExplanation(false);
      setHasSubmittedCurrent(false);
      setHintsRevealed(0);
      resetSelfReport();
      setQuestionStartTime(Date.now());
    } else {
      handleCompleteQuiz();
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));

      // Restore previous answer
      const prevQuestion = displayQuestions[quizState.currentQuestionIndex - 1];
      const prevAnswer = quizState.answers[prevQuestion.id];
      if (prevAnswer) {
        setCurrentAnswer(prevAnswer.userAnswer);
        setHasSubmittedCurrent(true);
        setShowExplanation(true);
        setHintsRevealed(prevAnswer.hintsUsed);
      } else {
        setCurrentAnswer(null);
        setHasSubmittedCurrent(false);
        setShowExplanation(false);
        setHintsRevealed(0);
      }
      resetSelfReport();
      setQuestionStartTime(Date.now());
    }
  };

  const handleSkip = () => {
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      userAnswer: null,
      isCorrect: false,
      timeSpent: Math.floor((Date.now() - questionStartTime) / 1000),
      hintsUsed: hintsRevealed,
      skipped: true,
      flaggedForReview: true,
    };

    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer,
      },
      flaggedQuestions: new Set([...prev.flaggedQuestions, currentQuestion.id]),
    }));

    handleNext();
  };

  const handleFlagQuestion = () => {
    setQuizState((prev) => {
      const newFlags = new Set(prev.flaggedQuestions);
      if (newFlags.has(currentQuestion.id)) {
        newFlags.delete(currentQuestion.id);
      } else {
        newFlags.add(currentQuestion.id);
      }
      return {
        ...prev,
        flaggedQuestions: newFlags,
      };
    });
  };

  const handleRevealHint = () => {
    if (currentQuestion.hints && hintsRevealed < currentQuestion.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  const calculateQuizScore = (): QuizScore => {
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const byTopic: Record<string, { correct: number; total: number; percentage: number }> = {};
    const byDifficulty: Record<
      QuestionDifficulty,
      { correct: number; total: number; percentage: number }
    > = {
      easy: { correct: 0, total: 0, percentage: 0 },
      medium: { correct: 0, total: 0, percentage: 0 },
      hard: { correct: 0, total: 0, percentage: 0 },
      expert: { correct: 0, total: 0, percentage: 0 },
    };

    displayQuestions.forEach((question) => {
      const answer = quizState.answers[question.id];
      const isCorrect = answer?.isCorrect || false;

      totalPoints += question.points;
      if (isCorrect) {
        correct++;
        earnedPoints += question.points;
      }

      // By topic
      if (!byTopic[question.topic]) {
        byTopic[question.topic] = { correct: 0, total: 0, percentage: 0 };
      }
      byTopic[question.topic].total++;
      if (isCorrect) {
        byTopic[question.topic].correct++;
      }

      // By difficulty
      byDifficulty[question.difficulty].total++;
      if (isCorrect) {
        byDifficulty[question.difficulty].correct++;
      }
    });

    // Calculate percentages
    Object.keys(byTopic).forEach((topic) => {
      byTopic[topic].percentage = (byTopic[topic].correct / byTopic[topic].total) * 100;
    });

    (['easy', 'medium', 'hard', 'expert'] as QuestionDifficulty[]).forEach((diff) => {
      if (byDifficulty[diff].total > 0) {
        byDifficulty[diff].percentage =
          (byDifficulty[diff].correct / byDifficulty[diff].total) * 100;
      }
    });

    const percentage = (correct / displayQuestions.length) * 100;
    const grade = calculateGrade(percentage);
    const { base: xpBase, bonus: xpBonus } = calculateXP(percentage, earnedPoints);

    return {
      correct,
      total: displayQuestions.length,
      percentage,
      grade,
      totalPoints,
      earnedPoints,
      xpEarned: xpBase,
      xpBonus,
      byTopic,
      byDifficulty,
    };
  };

  const handleCompleteQuiz = () => {
    const score = calculateQuizScore();
    const totalTime = Math.floor((Date.now() - quizState.startTime) / 1000);

    const attempt: QuizAttempt = {
      attemptId: `${monthId}-${weekId}-${Date.now()}`,
      quizId: quizConfig.id,
      monthId,
      weekId,
      startedAt: quizState.startTime,
      completedAt: Date.now(),
      timeSpent: totalTime,
      mode: quizConfig.mode,
      answers: Object.values(quizState.answers),
      score,
      passed: score.percentage >= quizConfig.passingScore,
    };

    // Update user progress
    if (hydrated) {
      userProgress.completeQuiz(monthId, weekId, score.correct, score.total);
      userProgress.addXP(score.xpEarned + score.xpBonus);
      userProgress.updateDailyProgress('quiz', score.xpEarned + score.xpBonus);
    }

    // Identify weak topics
    const weakTopics = Object.entries(score.byTopic)
      .filter(([_, stats]) => stats.percentage < 70)
      .map(([topic, stats]) => ({ topic, percentage: stats.percentage }))
      .sort((a, b) => a.percentage - b.percentage);

    // Generate recommendations
    const recommendations: string[] = [];
    if (score.percentage < 70) {
      recommendations.push(
        'Consider reviewing the lesson material before retaking this quiz.'
      );
    }
    if (weakTopics.length > 0) {
      recommendations.push(
        `Focus your study on: ${weakTopics.map((t) => t.topic).join(', ')}`
      );
    }
    if (score.grade === 'A') {
      recommendations.push('Excellent work! You have mastered this material.');
    }

    const reviewData: QuizReviewData = {
      attempt,
      questions: displayQuestions,
      answers: Object.values(quizState.answers),
      score,
      weakTopics,
      recommendations,
    };

    setReviewData(reviewData);
    setQuizCompleted(true);

    // Clear saved progress
    const progressKey = `quiz-progress-${monthId}-${weekId}`;
    localStorage.removeItem(progressKey);
  };

  const handleRetakeQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      startTime: Date.now(),
      timeElapsed: 0,
      flaggedQuestions: new Set(),
      completedQuestions: new Set(),
      mode: quizConfig.mode,
      paused: false,
    });
    setCurrentAnswer(null);
    setShowExplanation(false);
    setHasSubmittedCurrent(false);
    setHintsRevealed(0);
    resetSelfReport();
    setQuizCompleted(false);
    setReviewData(null);
    setQuestionStartTime(Date.now());
  };

  // Loading state
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Safety check
  if (displayQuestions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              No questions are available for this quiz.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show review screen
  if (quizCompleted && reviewData) {
    return <QuizReview reviewData={reviewData} monthId={monthId} weekId={weekId} onRetake={handleRetakeQuiz} />;
  }

  const progressPercentage = ((quizState.currentQuestionIndex + 1) / displayQuestions.length) * 100;
  const currentScore = calculateQuizScore();
  const isFlagged = quizState.flaggedQuestions.has(currentQuestion.id);
  const isLastQuestion = quizState.currentQuestionIndex === displayQuestions.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header with mode indicator */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Quiz
        </Button>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
            {quizConfig.mode === 'practice' && 'Practice Mode'}
            {quizConfig.mode === 'test' && 'Test Mode'}
            {quizConfig.mode === 'cpa-exam' && 'CPA Exam Mode'}
          </div>
        </div>
      </div>

      {/* Progress and Stats Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Question {quizState.currentQuestionIndex + 1} of {displayQuestions.length}
                </span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Time</div>
                  <div className="font-medium">{formatTime(quizState.timeElapsed)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Score</div>
                  <div className="font-medium">
                    {currentScore.correct}/{currentScore.total} ({Math.round(currentScore.percentage)}%)
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Flagged</div>
                  <div className="font-medium">{quizState.flaggedQuestions.size}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">Completed</div>
                  <div className="font-medium">{quizState.completedQuestions.size}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium px-2 py-1 bg-surface-subtle rounded-full">
                {currentQuestion.difficulty}
              </span>
              <span className="text-sm font-medium px-2 py-1 bg-surface-subtle rounded-full">
                {currentQuestion.topic}
              </span>
              <span className="text-sm font-medium px-2 py-1 bg-surface-subtle rounded-full">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              </span>
            </div>
            <Button
              variant={isFlagged ? 'default' : 'outline'}
              size="sm"
              aria-label={isFlagged ? 'Unflag this question' : 'Flag this question for review'}
              aria-pressed={isFlagged}
              onClick={handleFlagQuestion}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          {currentQuestion.scenario && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Scenario
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    {currentQuestion.scenario}
                  </div>
                </div>
              </div>
            </div>
          )}

          <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Question Type: Multiple Choice */}
          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-3">
              {shuffledOptions.map((option, index) => {
                const isSelected = currentAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showCorrectness = hasSubmittedCurrent;

                let buttonClass = 'w-full justify-start text-left h-auto p-4 whitespace-normal border-2';
                let icon = null;

                if (showCorrectness) {
                  if (isCorrect) {
                    buttonClass += ' border-green-500 bg-green-50 dark:bg-green-950/20';
                    icon = <CheckCircle className="h-5 w-5 text-green-600" />;
                  } else if (isSelected) {
                    buttonClass += ' border-red-500 bg-red-50 dark:bg-red-950/20';
                    icon = <XCircle className="h-5 w-5 text-red-600" />;
                  } else {
                    buttonClass += ' border-gray-200 dark:border-gray-700';
                  }
                } else if (isSelected) {
                  buttonClass += ' border-primary bg-primary/5';
                } else {
                  buttonClass += ' border-gray-200 dark:border-gray-700 hover:border-primary/50';
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswerChange(option)}
                    disabled={hasSubmittedCurrent}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        {icon || (
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-primary border-primary'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Type: True/False */}
          {currentQuestion.type === 'true-false' && (
            <div className="space-y-3">
              {['True', 'False'].map((option) => {
                const isSelected = currentAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showCorrectness = hasSubmittedCurrent;

                let buttonClass = 'w-full justify-start text-left h-auto p-4 border-2';
                let icon = null;

                if (showCorrectness) {
                  if (isCorrect) {
                    buttonClass += ' border-green-500 bg-green-50 dark:bg-green-950/20';
                    icon = <CheckCircle className="h-5 w-5 text-green-600" />;
                  } else if (isSelected) {
                    buttonClass += ' border-red-500 bg-red-50 dark:bg-red-950/20';
                    icon = <XCircle className="h-5 w-5 text-red-600" />;
                  } else {
                    buttonClass += ' border-gray-200 dark:border-gray-700';
                  }
                } else if (isSelected) {
                  buttonClass += ' border-primary bg-primary/5';
                } else {
                  buttonClass += ' border-gray-200 dark:border-gray-700 hover:border-primary/50';
                }

                return (
                  <button
                    key={option}
                    className={buttonClass}
                    onClick={() => handleAnswerChange(option)}
                    disabled={hasSubmittedCurrent}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="flex-shrink-0">
                        {icon || (
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-primary border-primary'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        )}
                      </div>
                      <span className="flex-1 font-semibold text-lg">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Type: Multiple Select */}
          {currentQuestion.type === 'multiple-select' && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground italic mb-2">
                Select all that apply
              </div>
              {shuffledOptions.map((option, index) => {
                const userAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
                const correctAnswers = Array.isArray(currentQuestion.correctAnswer)
                  ? currentQuestion.correctAnswer
                  : [];
                const isSelected = userAnswers.includes(option);
                const isCorrect = correctAnswers.includes(option);
                const showCorrectness = hasSubmittedCurrent;

                let buttonClass = 'w-full justify-start text-left h-auto p-4 whitespace-normal border-2';
                let icon = null;

                if (showCorrectness) {
                  if (isCorrect && isSelected) {
                    buttonClass += ' border-green-500 bg-green-50 dark:bg-green-950/20';
                    icon = <CheckCircle className="h-5 w-5 text-green-600" />;
                  } else if (isSelected && !isCorrect) {
                    buttonClass += ' border-red-500 bg-red-50 dark:bg-red-950/20';
                    icon = <XCircle className="h-5 w-5 text-red-600" />;
                  } else if (isCorrect) {
                    buttonClass += ' border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
                    icon = <Lightbulb className="h-5 w-5 text-yellow-600" />;
                  } else {
                    buttonClass += ' border-gray-200 dark:border-gray-700';
                  }
                } else if (isSelected) {
                  buttonClass += ' border-primary bg-primary/5';
                } else {
                  buttonClass += ' border-gray-200 dark:border-gray-700 hover:border-primary/50';
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleMultipleSelectToggle(option)}
                    disabled={hasSubmittedCurrent}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="flex-shrink-0 mt-0.5">
                        {icon || (
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-primary border-primary'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Type: Fill in the Blank */}
          {currentQuestion.type === 'fill-blank' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-lg focus:border-primary focus:outline-none"
                  placeholder="Enter your answer"
                  value={currentAnswer !== null ? currentAnswer.toString() : ''}
                  onChange={(e) => handleAnswerChange(parseFloat(e.target.value) || 0)}
                  disabled={hasSubmittedCurrent}
                  step="any"
                />
                {currentQuestion.unit && (
                  <span className="text-lg font-medium text-muted-foreground">
                    {currentQuestion.unit}
                  </span>
                )}
              </div>
              {hasSubmittedCurrent && (
                <div
                  className={`p-3 rounded-lg border-2 ${
                    isAnswerCorrect(currentQuestion, currentAnswer)
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                  }`}
                >
                  <div className="text-sm text-muted-foreground mb-1">Correct answer:</div>
                  <div className="text-lg font-semibold">
                    {currentQuestion.correctAnswer}
                    {currentQuestion.unit && ` ${currentQuestion.unit}`}
                    {currentQuestion.tolerance && ` (±${currentQuestion.tolerance})`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hints Section */}
          {quizConfig.showHints &&
            currentQuestion.hints &&
            currentQuestion.hints.length > 0 &&
            !hasSubmittedCurrent && (
              <div className="space-y-3">
                {hintsRevealed > 0 && (
                  <div className="space-y-2">
                    {currentQuestion.hints.slice(0, hintsRevealed).map((hint, index) => (
                      <div
                        key={index}
                        className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                      >
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                              Hint {index + 1}
                            </div>
                            <div className="text-sm text-yellow-900 dark:text-yellow-100">
                              {hint}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {hintsRevealed < currentQuestion.hints.length && (
                  <Button variant="outline" size="sm" onClick={handleRevealHint}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Show Hint ({hintsRevealed + 1}/{currentQuestion.hints.length})
                  </Button>
                )}
              </div>
            )}

          {/* Explanation */}
          {showExplanation && hasSubmittedCurrent && (
            <div
              className={`p-4 rounded-lg border-2 ${
                isAnswerCorrect(currentQuestion, currentAnswer)
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                  : 'border-red-500 bg-red-50 dark:bg-red-950/20'
              }`}
            >
              <h4 className="font-semibold mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                {isAnswerCorrect(currentQuestion, currentAnswer)
                  ? 'Why This Answer Is Correct'
                  : 'Why This Answer Is Incorrect'}
              </h4>
              <p className="text-sm leading-relaxed mb-3">
                {isAnswerCorrect(currentQuestion, currentAnswer)
                  ? currentQuestion.explanation
                  : currentQuestion.incorrectExplanation || currentQuestion.explanation}
              </p>
              {currentQuestion.references && currentQuestion.references.length > 0 && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-muted-foreground">
                    <strong>References:</strong> {currentQuestion.references.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attempt-ledger one-tap self-report — both rows are skippable.
              Mirrors QuizComponent; only shown for the attempt just recorded. */}
          {hasSubmittedCurrent && lastAttemptId && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                <span className="mr-1">How sure were you?</span>
                {([
                  [0, "Low"],
                  [1, "Med"],
                  [2, "High"],
                ] as const).map(([level, label]) => (
                  <button
                    key={level}
                    onClick={() => handleConfidenceTap(level)}
                    className={`rounded-full border px-2.5 py-0.5 transition-colors ${
                      confidenceChoice === level
                        ? "border-blue-500 bg-blue-100 text-blue-800"
                        : "border-gray-300 bg-white text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {!isAnswerCorrect(currentQuestion, currentAnswer) && (
                <>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                    <span className="mr-1">Why did you miss it?</span>
                    {ERROR_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleMissCategoryTap(cat)}
                        className={`rounded-full border px-2.5 py-0.5 transition-colors ${
                          missCategory === cat
                            ? "border-red-500 bg-red-100 text-red-800"
                            : "border-gray-300 bg-white text-slate-600 hover:border-red-300"
                        }`}
                      >
                        {classify(cat).label}
                      </button>
                    ))}
                  </div>
                  {missCategory && (
                    <p className="text-xs text-slate-500 italic">
                      {classify(missCategory, skills ?? []).advice}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={quizState.currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              {quizConfig.allowSkip && !hasSubmittedCurrent && (
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              {!hasSubmittedCurrent ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={currentAnswer === null || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
                  size="lg"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext} size="lg">
                  {isLastQuestion ? (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Complete Quiz
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation (optional) */}
      {quizConfig.allowReview && displayQuestions.length <= 20 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-3">Question Navigation</div>
            <div className="flex flex-wrap gap-2">
              {displayQuestions.map((q, index) => {
                const isCompleted = quizState.completedQuestions.has(q.id);
                const isFlagged = quizState.flaggedQuestions.has(q.id);
                const isCurrent = index === quizState.currentQuestionIndex;
                const answer = quizState.answers[q.id];

                let buttonClass = 'w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium';

                if (isCurrent) {
                  buttonClass += ' border-primary bg-primary text-white';
                } else if (isCompleted && answer?.isCorrect) {
                  buttonClass += ' border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700';
                } else if (isCompleted && !answer?.isCorrect) {
                  buttonClass += ' border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700';
                } else if (isFlagged) {
                  buttonClass += ' border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700';
                } else {
                  buttonClass += ' border-gray-200 dark:border-gray-700 hover:border-primary/50';
                }

                return (
                  <button
                    key={q.id}
                    className={buttonClass}
                    onClick={() => {
                      setQuizState((prev) => ({ ...prev, currentQuestionIndex: index }));
                      const prevAnswer = quizState.answers[q.id];
                      if (prevAnswer) {
                        setCurrentAnswer(prevAnswer.userAnswer);
                        setHasSubmittedCurrent(true);
                        setShowExplanation(true);
                        setHintsRevealed(prevAnswer.hintsUsed);
                      } else {
                        setCurrentAnswer(null);
                        setHasSubmittedCurrent(false);
                        setShowExplanation(false);
                        setHintsRevealed(0);
                      }
                      resetSelfReport();
                      setQuestionStartTime(Date.now());
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
