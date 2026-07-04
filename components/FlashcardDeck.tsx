"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Eye, EyeOff, Check, X, Trophy, Heart } from "lucide-react";
import { useAttempts, useSrs, useStudySession, useUserProgress } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import type { Flashcard } from "@/lib/types";

interface FlashcardDeckProps {
  flashcardData?: {
    deck: string;
    cards: Flashcard[];
  };
  flashcard?: {
    deck: string;
    cards: Flashcard[];
  };
  weekId?: string;
  monthId?: string;
  onComplete?: () => void;
  onExit?: () => void;
}

type DifficultyRating = 'again' | 'hard' | 'good' | 'easy';

export function FlashcardDeck({ flashcardData, flashcard, weekId, monthId, onComplete, onExit }: FlashcardDeckProps) {
  // Support both flashcardData and flashcard props for backward compatibility
  const data = flashcardData || flashcard;

  if (!data) {
    throw new Error('FlashcardDeck requires either flashcardData or flashcard prop');
  }
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [sessionComplete, setSessionComplete] = useState(false);

  const { addXP, loseHeart } = useUserProgress();
  const { recordAnswer, sessionScore } = useStudySession();
  const recordAttempt = useAttempts((s) => s.record);
  const upsertMiss = useSrs((s) => s.upsertMiss);
  const reviewItem = useSrs((s) => s.reviewItem);

  const currentCard = data.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / data.cards.length) * 100;
  const remainingCards = data.cards.length - completedCards.size;
  const track = monthId?.startsWith("fin-") ? "finance" : monthId?.startsWith("m") || !monthId ? "cma" : "cpa";

  const itemId = `flashcard:${track}:${data.deck}:${currentCardIndex}:${currentCard.front
    .slice(0, 40)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;

  useEffect(() => {
    if (completedCards.size === data.cards.length && completedCards.size > 0) {
      setSessionComplete(true);
    }
  }, [completedCards.size, data.cards.length]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleDifficultyRating = (rating: DifficultyRating) => {
    const isCorrect = rating === 'good' || rating === 'easy';
    const nowDay = dayNumber(Date.now());
    
    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Record answer in study session store
    recordAnswer(isCorrect);

    recordAttempt({
      source: "flashcard",
      track,
      itemId,
      skills: [],
      correct: isCorrect,
      answer: rating,
    });

    if (rating === "again" || rating === "hard") {
      upsertMiss(
        {
          itemId,
          skills: [],
          track,
          source: "flashcard",
          label: `Flashcard — ${currentCard.front.slice(0, 80)}`,
          href: "/flashcards",
        },
        nowDay
      );
    } else {
      reviewItem(itemId, rating === "easy" ? 5 : 4, nowDay);
    }

    // Award XP based on difficulty
    if (isCorrect) {
      const xpGain = rating === 'easy' ? 15 : 10;
      addXP(xpGain);
    } else {
      loseHeart();
    }

    // Mark card as completed
    setCompletedCards(prev => new Set([...prev, currentCardIndex]));

    // Move to next card or complete session
    if (currentCardIndex < data.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSessionStats({ correct: 0, total: 0 });
    setCompletedCards(new Set());
    setSessionComplete(false);
  };

  const handleNextCard = () => {
    if (currentCardIndex < data.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  if (sessionComplete) {
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    const isPerfect = accuracy === 100;

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
                {isPerfect ? "Perfect Session!" : "Session Complete!"}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                  <div className="text-sm text-slate-600">Accuracy</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{sessionStats.correct}</div>
                    <div className="text-xs text-slate-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-600">{sessionStats.total}</div>
                    <div className="text-xs text-slate-600">Total Cards</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button onClick={handleRestart} className="btn-primary">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Study Again
                </Button>
                <Button onClick={onComplete} variant="outline">
                  Continue Learning
                </Button>
              </div>
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
              Exit
            </Button>
            
            <div className="flex-1 mx-4">
              <Progress value={progress} className="h-3" />
              <div className="text-center mt-1 text-sm text-slate-600">
                {currentCardIndex + 1} of {data.cards.length}
              </div>
            </div>
            
            <div className="text-sm text-slate-600">
              {remainingCards} cards left
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard Content */}
      <div className="container mx-auto max-w-2xl p-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-blue-900 mb-2">
            {data.deck}
          </h1>
          <p className="text-slate-600">
            Rate each card. Again/Hard cards are scheduled for review.
          </p>
        </div>

        {/* Main Flashcard */}
        <Card className="card-duolingo mb-8 min-h-[300px] cursor-pointer" onClick={!showAnswer ? handleShowAnswer : undefined}>
          <CardContent className="p-8 h-full flex flex-col justify-center">
            <div className="text-center">
              {!showAnswer ? (
                <>
                  <div className="mb-6">
                    <div className="text-lg text-blue-600 font-medium mb-4">Question</div>
                    <div className="text-xl text-blue-900 leading-relaxed">
                      {currentCard.front}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-slate-500">
                    <Eye className="h-5 w-5 mr-2" />
                    <span>Tap to reveal answer</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-sm text-slate-600 mb-2">Question</div>
                    <div className="text-lg text-blue-900 mb-6 p-4 bg-blue-50 rounded-lg">
                      {currentCard.front}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-lg text-green-600 font-medium mb-4">Answer</div>
                    <div className="text-xl text-blue-900 leading-relaxed">
                      {currentCard.back}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {!showAnswer ? (
          <div className="text-center">
            <Button onClick={handleShowAnswer} className="btn-primary">
              <Eye className="h-4 w-4 mr-2" />
              Show Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center text-slate-600 mb-4">
              How well did you remember this?
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleDifficultyRating('again')}
                variant="outline"
                className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700"
              >
                <X className="h-4 w-4 mr-2" />
                Again
              </Button>
              <Button
                onClick={() => handleDifficultyRating('hard')}
                variant="outline"
                className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-700"
              >
                <Heart className="h-4 w-4 mr-2" />
                Hard
              </Button>
              <Button
                onClick={() => handleDifficultyRating('good')}
                variant="outline"
                className="border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Good
              </Button>
              <Button
                onClick={() => handleDifficultyRating('easy')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Easy
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePreviousCard}
            variant="ghost"
            disabled={currentCardIndex === 0}
            className="text-slate-600"
          >
            Previous
          </Button>
          <Button
            onClick={handleNextCard}
            variant="ghost"
            disabled={currentCardIndex === data.cards.length - 1}
            className="text-slate-600"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardDeck;
