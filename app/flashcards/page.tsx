"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConsolidatedFlashcard } from "@/lib/content-loader";
import { useStudySession } from "@/lib/store";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Play, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function FlashcardsPage() {
  const [allFlashcards, setAllFlashcards] = useState<ConsolidatedFlashcard[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFlashcards() {
      try {
        setLoading(true);
        const res = await fetch("/api/flashcards");
        if (!res.ok) throw new Error("Failed to load flashcards");
        const flashcards: ConsolidatedFlashcard[] = await res.json();
        setAllFlashcards(flashcards);
      } catch (error) {
        console.error("Failed to load flashcards:", error);
        setError(error instanceof Error ? error.message : "Failed to load flashcards");
      } finally {
        setLoading(false);
      }
    }

    loadFlashcards();
  }, []);

  const resetStudySession = useStudySession((s) => s.resetSession);

  const startSession = () => {
    setSessionActive(true);
  };

  const endSession = () => {
    setSessionActive(false);
  };

  // Option values are "deck-N" (1-based deck index); "all" concatenates every
  // deck's cards into one combined session deck.
  const sessionFlashcard = useMemo<ConsolidatedFlashcard | null>(() => {
    if (allFlashcards.length === 0) return null;
    if (selectedMonth === "all") {
      return {
        deck: `All Decks (${allFlashcards.length} decks)`,
        cards: allFlashcards.flatMap((deck) => deck.cards),
      };
    }
    const deckIndex = Number.parseInt(selectedMonth.replace("deck-", ""), 10) - 1;
    return allFlashcards[deckIndex] ?? null;
  }, [allFlashcards, selectedMonth]);

  // Clears the in-memory study-session tally (score/card position) and returns
  // the picker to its default focus.
  const handleResetProgress = () => {
    resetStudySession();
    setSelectedMonth("all");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <EmptyState icon={Brain} title="Flashcards Loading Error" description={error} />
      </div>
    );
  }

  if (sessionActive && sessionFlashcard) {
    return (
      <FlashcardDeck flashcard={sessionFlashcard} onComplete={endSession} onExit={endSession} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-purple-500 mr-3" />
              <h1 className="text-4xl font-bold">Flashcards</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Master Finance, CMA, and CPA concepts with rated recall. Hard and missed cards
              feed the shared SRS queue, Mistake Bank, and per-skill readiness.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {allFlashcards.length === 0 ? (
            <EmptyState
              icon={Brain}
              title="No Flashcards Available"
              description="Flashcards will be available once curriculum content is loaded."
            />
          ) : (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Study Session</CardTitle>
                <CardDescription>
                  Choose a deck. Ratings are tagged to the source track and skill map when available.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Month Selection */}
                <div className="space-y-2">
                  <label htmlFor="month-select" className="text-sm font-medium">
                    Study Focus
                  </label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month or all content" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Decks ({allFlashcards.length} decks)</SelectItem>
                      {allFlashcards.map((deck, index) => (
                        <SelectItem key={`deck-${index + 1}`} value={`deck-${index + 1}`}>
                          {deck.deck || `Deck ${index + 1}`} ({deck.cards.length} cards)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Session Info */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Session Details</span>
                    <span className="text-sm text-muted-foreground">
                      {sessionFlashcard?.cards.length || 0} cards available
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Study Method</div>
                      <div className="font-medium">Rated recall + SRS</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Daily Target</div>
                      <div className="font-medium">20 cards</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={startSession}
                    disabled={!sessionFlashcard || sessionFlashcard.cards.length === 0}
                    className="flex-1"
                    size="lg"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Study Session
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleResetProgress}
                    disabled={!sessionFlashcard || sessionFlashcard.cards.length === 0}
                    size="lg"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Progress
                  </Button>
                </div>

                {/* Study Tips */}
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Study Tips:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Rate your recall honestly to optimize the algorithm</li>
                    <li>Study regularly for best retention results</li>
                    <li>Review missed cards multiple times</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
