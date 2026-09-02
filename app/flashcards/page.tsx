"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConsolidatedFlashcard } from "@/lib/content-loader";
import { useCustomCards, useStudySession } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Play, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { GlassCard } from "@/components/glass/GlassCard";

export default function FlashcardsPage() {
  const hydrated = useHydratedStore();
  const customCards = useCustomCards((s) => s.cards);
  const [loadedFlashcards, setLoadedFlashcards] = useState<ConsolidatedFlashcard[]>([]);
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
        setLoadedFlashcards(flashcards);
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

  // Note-converted cards form a client-side "My Notes" deck alongside the
  // curriculum decks; ratings feed the same ledger/SRS via card metadata.
  const allFlashcards = useMemo<ConsolidatedFlashcard[]>(() => {
    if (!hydrated || customCards.length === 0) return loadedFlashcards;
    return [...loadedFlashcards, { deck: "My Notes", cards: customCards }];
  }, [loadedFlashcards, customCards, hydrated]);

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
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <GlassCard className="p-8">
          <EmptyState icon={Brain} title="Flashcards Loading Error" description={error} />
        </GlassCard>
      </div>
    );
  }

  if (sessionActive && sessionFlashcard) {
    return (
      <FlashcardDeck flashcard={sessionFlashcard} onComplete={endSession} onExit={endSession} />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "hsl(var(--primary) / 0.1)" }}
        >
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Flashcards</h1>
          <p className="mt-1 text-muted-foreground">
            Master Finance, CMA, and CPA concepts with rated recall. Hard and missed cards feed the
            shared SRS queue, Mistake Bank, and per-skill readiness.
          </p>
        </div>
      </div>

      {/* Content */}
      {allFlashcards.length === 0 ? (
        <GlassCard className="p-8">
          <EmptyState
            icon={Brain}
            title="No Flashcards Available"
            description="Flashcards will be available once curriculum content is loaded."
          />
        </GlassCard>
      ) : (
        <GlassCard className="mx-auto max-w-2xl p-6 space-y-6">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight">Study Session</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a deck. Ratings are tagged to the source track and skill map when available.
            </p>
          </div>

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
          <div
            className="rounded-xl p-4"
            style={{ background: "hsl(var(--foreground) / 0.04)" }}
          >
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
        </GlassCard>
      )}
    </div>
  );
}
