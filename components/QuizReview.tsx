"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  QuizReviewData,
  QuizQuestion,
  QuizAnswer,
  QuestionDifficulty,
} from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  RotateCcw,
  Download,
  Flag,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";

interface QuizReviewProps {
  reviewData: QuizReviewData;
  monthId: string;
  weekId: string;
  onRetake: () => void;
}

export function QuizReview({ reviewData, monthId, weekId, onRetake }: QuizReviewProps) {
  const router = useRouter();
  const { attempt, questions, answers, score } = reviewData;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 dark:text-green-400';
      case 'B':
        return 'text-blue-600 dark:text-blue-400';
      case 'C':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'D':
        return 'text-orange-600 dark:text-orange-400';
      case 'F':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getGradeMessage = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'Excellent Work!';
      case 'B':
        return 'Good Job!';
      case 'C':
        return 'Satisfactory';
      case 'D':
        return 'Needs Improvement';
      case 'F':
        return 'Failed - Need to Retake';
      default:
        return '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportResultsPDF = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      monthId,
      weekId,
      score,
      answers,
      recommendations: reviewData.recommendations,
      weakTopics: reviewData.weakTopics,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accountrix-quiz-review-${monthId}-${weekId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(`/learn/${monthId}/${weekId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lesson
        </Button>
      </div>

      {/* Results Summary Card */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl mb-2">Quiz Results</CardTitle>
          <CardDescription className="text-lg">
            {attempt.mode === 'practice' && 'Practice Mode'}
            {attempt.mode === 'test' && 'Test Mode'}
            {attempt.mode === 'cpa-exam' && 'CPA Exam Mode'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${getGradeColor(score.grade)}`}>
              {score.percentage}%
            </div>
            <div className="text-2xl font-semibold mb-1">
              Grade: {score.grade}
            </div>
            <div className="text-lg text-muted-foreground mb-4">
              {getGradeMessage(score.grade)}
            </div>
            <div className="text-lg">
              Score: {score.correct} / {score.total} ({score.earnedPoints} / {score.totalPoints} points)
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={score.percentage} className="h-3" />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-surface-subtle rounded-lg">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
                <div className="text-xl font-semibold">{formatTime(attempt.timeSpent)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-surface-subtle rounded-lg">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">XP Earned</div>
                <div className="text-xl font-semibold">
                  +{score.xpEarned + score.xpBonus} XP
                  {score.xpBonus > 0 && (
                    <span className="text-sm text-green-600 dark:text-green-400 ml-1">
                      (+{score.xpBonus} bonus)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-surface-subtle rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Pass Status</div>
                <div className="text-xl font-semibold">
                  {attempt.passed ? (
                    <span className="text-green-600 dark:text-green-400">Passed</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Failed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* By Topic Breakdown */}
          {Object.keys(score.byTopic).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Performance by Topic
              </h3>
              <div className="space-y-2">
                {Object.entries(score.byTopic).map(([topic, stats]) => (
                  <div key={topic} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{topic}</span>
                      <span className="font-medium">
                        {stats.correct}/{stats.total} ({Math.round(stats.percentage)}%)
                      </span>
                    </div>
                    <Progress value={stats.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* By Difficulty Breakdown */}
          {Object.keys(score.byDifficulty).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Performance by Difficulty</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['easy', 'medium', 'hard', 'expert'] as QuestionDifficulty[]).map((diff) => {
                  const stats = score.byDifficulty[diff];
                  if (!stats || stats.total === 0) return null;

                  return (
                    <div key={diff} className="p-3 bg-surface-subtle rounded-lg">
                      <div className="text-sm text-muted-foreground capitalize mb-1">
                        {diff}
                      </div>
                      <div className="text-lg font-semibold">
                        {stats.correct}/{stats.total}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(stats.percentage)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {reviewData.weakTopics.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h3 className="text-lg font-semibold flex items-center mb-2">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                Topics to Review
              </h3>
              <ul className="space-y-1">
                {reviewData.weakTopics.map((topic, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">{topic.topic}</span>
                    <span className="text-muted-foreground ml-2">
                      ({Math.round(topic.percentage)}% correct)
                    </span>
                  </li>
                ))}
              </ul>
              {reviewData.recommendations.length > 0 && (
                <div className="mt-3 space-y-1">
                  {reviewData.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={onRetake} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={exportResultsPDF} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export Review JSON
            </Button>
            <Button
              onClick={() => {
                const reviewSection = document.getElementById('detailed-review');
                reviewSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1"
            >
              Review Answers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Question Review */}
      <div id="detailed-review" className="space-y-4">
        <h2 className="text-2xl font-bold">Detailed Answer Review</h2>

        {questions.map((question, index) => {
          const answer = answers.find((a) => a.questionId === question.id);
          if (!answer) return null;

          const isCorrect = answer.isCorrect;

          return (
            <Card
              key={question.id}
              className={`border-l-4 ${
                isCorrect
                  ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/10'
                  : 'border-l-red-500 bg-red-50/50 dark:bg-red-950/10'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {index + 1}
                      </span>
                      <span className="text-xs px-2 py-1 bg-surface-subtle rounded-full">
                        {question.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 bg-surface-subtle rounded-full">
                        {question.topic}
                      </span>
                      <span className="text-xs px-2 py-1 bg-surface-subtle rounded-full">
                        {question.points} {question.points === 1 ? 'point' : 'points'}
                      </span>
                      {answer.flaggedForReview && (
                        <Flag className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{question.question}</CardTitle>
                    {question.scenario && (
                      <div className="mt-3 p-3 bg-surface-subtle rounded-lg text-sm">
                        <strong>Scenario:</strong> {question.scenario}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {isCorrect ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Show question options and answers */}
                {question.type === 'multiple-choice' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => {
                      const isUserAnswer = answer.userAnswer === option;
                      const isCorrectAnswer = question.correctAnswer === option;

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                              : isUserAnswer
                              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {isCorrectAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>{option}</span>
                            {isUserAnswer && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                (Your answer)
                              </span>
                            )}
                            {isCorrectAnswer && (
                              <span className="text-xs text-green-600 ml-auto">
                                (Correct answer)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === 'true-false' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => {
                      const isUserAnswer = answer.userAnswer === option;
                      const isCorrectAnswer = question.correctAnswer === option;

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                              : isUserAnswer
                              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {isCorrectAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">{option}</span>
                            {isUserAnswer && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                (Your answer)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === 'fill-blank' && (
                  <div className="space-y-2">
                    <div className="p-3 bg-surface-subtle rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Your answer:</div>
                      <div className={`text-lg font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.userAnswer !== null ? answer.userAnswer.toString() : 'No answer'}
                        {question.unit && ` ${question.unit}`}
                      </div>
                    </div>
                    {!isCorrect && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-sm text-muted-foreground mb-1">Correct answer:</div>
                        <div className="text-lg font-medium text-green-600">
                          {question.correctAnswer}
                          {question.unit && ` ${question.unit}`}
                          {question.tolerance && ` (±${question.tolerance})`}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {question.type === 'multiple-select' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => {
                      const userAnswers = Array.isArray(answer.userAnswer) ? answer.userAnswer : [];
                      const correctAnswers = Array.isArray(question.correctAnswer)
                        ? question.correctAnswer
                        : [];
                      const isUserAnswer = userAnswers.includes(option);
                      const isCorrectAnswer = correctAnswers.includes(option);

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrectAnswer && isUserAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                              : isUserAnswer && !isCorrectAnswer
                              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                              : isCorrectAnswer
                              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {isCorrectAnswer && isUserAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            {isCorrectAnswer && !isUserAnswer && (
                              <Lightbulb className="h-4 w-4 text-yellow-600" />
                            )}
                            <span>{option}</span>
                            {isUserAnswer && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                (Selected)
                              </span>
                            )}
                            {isCorrectAnswer && !isUserAnswer && (
                              <span className="text-xs text-yellow-600 ml-auto">
                                (Should be selected)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Time and hints info */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(answer.timeSpent)}</span>
                  </div>
                  {answer.hintsUsed > 0 && (
                    <div className="flex items-center space-x-1">
                      <Lightbulb className="h-4 w-4" />
                      <span>{answer.hintsUsed} hint{answer.hintsUsed > 1 ? 's' : ''} used</span>
                    </div>
                  )}
                  {answer.skipped && (
                    <span className="text-yellow-600">Skipped initially</span>
                  )}
                </div>

                {/* Explanation */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                  }`}
                >
                  <h4 className="font-semibold mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {isCorrect ? 'Why This Answer Is Correct' : 'Why Your Answer Was Incorrect'}
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {isCorrect
                      ? question.explanation
                      : question.incorrectExplanation || question.explanation}
                  </p>
                  {question.references && question.references.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-muted-foreground">
                        <strong>References:</strong> {question.references.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-center pb-8">
        <Button
          size="lg"
          onClick={() => router.push(`/learn/${monthId}/${weekId}`)}
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Back to Lesson
        </Button>
      </div>
    </div>
  );
}
