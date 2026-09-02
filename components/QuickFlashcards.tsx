"use client";

import { useMemo, useState } from "react";

interface FC {
  front: string;
  back: string;
}

export function QuickFlashcards({ cards, limit = 5 }: { cards: FC[]; limit?: number }) {
  const subset = useMemo(() => (cards || []).slice(0, limit), [cards, limit]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  if (!subset.length) {
    return <div className="text-sm text-muted-foreground">No flashcards for this lesson.</div>;
  }

  return (
    <div className="space-y-2">
      {subset.map((c, i) => {
        const isFlipped = !!flipped[i];
        return (
          <button
            key={i}
            onClick={() => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))}
            className="w-full text-left border rounded p-2 hover:bg-muted"
            title="Click to flip"
          >
            <div className="text-xs text-muted-foreground">Card {i + 1}</div>
            <div className="text-sm whitespace-pre-wrap">{isFlipped ? c.back : c.front}</div>
          </button>
        );
      })}
      <div className="text-xs text-muted-foreground">Click a card to flip.</div>
    </div>
  );
}
