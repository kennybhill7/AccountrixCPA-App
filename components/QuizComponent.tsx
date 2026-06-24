"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, X, Trophy, Heart, AlertCircle, CheckCircle } from "lucide-react";
import { useUserProgress, useQuizResults, useCpaProgress } from "@/lib/store";
import type { Quiz } from "@/lib/types";

interface QuizComponentProps {
  quiz: Quiz;
  monthId: string;
  weekId: string;
  onComplete: (score: number, totalQuestions: number) => void;
  onExit: () => void;
  /**
   * Which progress track to record into. "cma" (default) writes to the shared
   * CMA user-progress/quiz-results stores; "cpa" writes to the isolated CPA
   * store so CPA completions never inflate CMA progress or month labels.
   */
  track?: "cma" | "cpa";
}

interface AnswerState {
  selectedAnswer: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
}

export function QuizComponent({ quiz, monthId, weekId, onComplete, onExit, track = "cma" }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(
    quiz.questions.map(() => ({
      selectedAnswer: null,
      isAnswered: false,
      isCorrect: false
    }))
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  
  const { addXP, loseHeart, completeQuiz, canTakeQuiz } = useUserProgress();
  const { addResult } = useQuizResults();
  const cpaProgress = useCpaProgress();
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  // Check if user has enough hearts
  if (!canTakeQuiz()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="card-duolingo">
            <CardContent className="p-8">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-heading font-bold text-blue-900 mb-4">
                Out of Hearts!
              </h2>
              <p className="text-slate-600 mb-6">
                You need at least one heart to take a quiz. Hearts refill over time or you can practice flashcards to continue learning.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={onExit} className="btn-primary">
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
    
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        selectedAnswer: answerIndex,
        isAnswered: true,
        isCorrect
      };
      return newAnswers;
    });
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      loseHeart();
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    // Calculate final score
    const finalScore = answers.filter(answer => answer.isCorrect).length;
    
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
    // CPA writes to the isolated CPA store so it never inflates CMA progress.
    if (track === "cpa") {
      cpaProgress.completeQuiz(monthId, weekId, finalScore, quiz.questions.length);
      cpaProgress.addResult({
        monthId,
        weekId,
        score: finalScore,
        totalQuestions: quiz.questions.length
      });
    } else {
      completeQuiz(monthId, weekId, finalScore, quiz.questions.length);
      addResult({
        monthId,
        weekId,
        score: finalScore,
        totalQuestions: quiz.questions.length
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
    const isPerfect = percentage === 1.0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="card-duolingo">
            <CardContent className="p-8">
              {isPerfect && (
                <div className="mb-6 animate-bounce">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
                  <div className="text-4xl mb-2">🎉</div>
                </div>
              )}
              
              <h2 className="text-2xl font-heading font-bold text-blue-900 mb-4">
                Quiz Complete!
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                    {Math.round(percentage * 100)}%
                  </div>
                  <div className="text-sm text-slate-600">Final Score</div>
                </div>
                
                <p className={`font-medium ${getScoreColor(percentage)}`}>
                  {getScoreMessage(percentage)}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{score}</div>
                    <div className="text-xs text-slate-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-600">{quiz.questions.length}</div>
                    <div className="text-xs text-slate-600">Total</div>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => onComplete(score, quiz.questions.length)} className="btn-primary w-full">
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <Button 
              onClick={onExit}
              variant="ghost" 
              size="sm"
              className="text-slate-600 hover:text-blue-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Quiz
            </Button>
            
            <div className="flex-1 mx-4">
              <Progress value={progress} className="h-3" />
              <div className="text-center mt-1 text-sm text-slate-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
            </div>
            
            <div className="text-sm text-slate-600">
              Score: {score}/{quiz.questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto max-w-2xl p-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-blue-900 mb-2">
            Knowledge Check
          </h1>
          <p className="text-slate-600">
            Test your understanding of the key concepts
          </p>
        </div>

        {/* Question Card */}
        <Card className="card-duolingo mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-blue-900 leading-relaxed">
                {currentQuestion.q}
              </h2>
            </div>
            
            {/* Answer Choices */}
            <div className="space-y-3">
              {currentQuestion.choices.map((choice, index) => {
                let buttonClass = "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ";
                let iconElement = null;
                
                if (currentAnswer.isAnswered) {
                  if (index === currentQuestion.answer) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800";
                    iconElement = <CheckCircle className="h-5 w-5 text-green-600" />;
                  } else if (index === currentAnswer.selectedAnswer) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                    iconElement = <X className="h-5 w-5 text-red-600" />;
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                  }
                } else {
                  buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
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
          <Card className="mb-8 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Explanation</h3>
                  <p className="text-slate-700 leading-relaxed">
                    {currentQuestion.explain}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Button */}
        {currentAnswer.isAnswered && (
          <div className="text-center">
            <Button 
              onClick={handleNext}
              className="btn-primary"
              size="lg"
            >
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