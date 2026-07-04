"use client";

import { useEffect, useState } from "react";
import { useAppStore, heartsWithRefill, msUntilNextHeart, MAX_HEARTS } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { Flame, Heart, Star } from "lucide-react";

export function StreakHeartsXp() {
  const hydrated = useHydratedStore();
  const xp = useAppStore((state) => state.xp);
  const rawHearts = useAppStore((state) => state.hearts);
  const lastHeartLossAt = useAppStore((state) => state.lastHeartLossAt);
  const streak = useAppStore((state) => state.streak);

  // Minute tick so time-based heart refill shows up without a reload.
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!hydrated) {
    // Show placeholder while hydrating to prevent flash
    return (
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium">0</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Heart key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-1 text-orange-500">
          <Flame className="h-4 w-4 fill-current" />
          <span className="font-medium">0</span>
        </div>
      </div>
    );
  }

  const heartState = { hearts: rawHearts, lastHeartLossAt };
  const hearts = heartsWithRefill(heartState, nowMs);
  const nextMs = msUntilNextHeart(heartState, nowMs);
  const nextMin = nextMs != null ? Math.max(1, Math.ceil(nextMs / 60_000)) : null;

  return (
    <div className="flex items-center space-x-4 text-sm">
      {/* XP */}
      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
        <Star className="h-4 w-4 fill-current" />
        <span className="font-medium">{xp}</span>
      </div>

      {/* Hearts (time-based refill applied: 1 per 30 min up to 5) */}
      <div
        className="flex items-center space-x-1"
        title={
          hearts < MAX_HEARTS && nextMin != null
            ? `Next heart in ${nextMin}m`
            : "Hearts full"
        }
      >
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Heart
              key={i}
              className={`h-4 w-4 ${
                i < hearts
                  ? "text-red-500 fill-current"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
        </div>
        {hearts < MAX_HEARTS && nextMin != null && (
          <span className="text-xs text-slate-500 dark:text-slate-400">+1 in {nextMin}m</span>
        )}
      </div>

      {/* Streak */}
      <div className="flex items-center space-x-1 text-orange-500">
        <Flame className="h-4 w-4 fill-current" />
        <span className="font-medium">{streak}</span>
      </div>
    </div>
  );
}
