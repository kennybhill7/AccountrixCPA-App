"use client";

import { useAppStore } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { Flame, Heart, Star } from "lucide-react";

export function StreakHeartsXp() {
  const hydrated = useHydratedStore();
  const xp = useAppStore((state) => state.xp);
  const hearts = useAppStore((state) => state.hearts);
  const streak = useAppStore((state) => state.streak);

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

  return (
    <div className="flex items-center space-x-4 text-sm">
      {/* XP */}
      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
        <Star className="h-4 w-4 fill-current" />
        <span className="font-medium">{xp}</span>
      </div>

      {/* Hearts */}
      <div className="flex items-center space-x-1">
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
      </div>

      {/* Streak */}
      <div className="flex items-center space-x-1 text-orange-500">
        <Flame className="h-4 w-4 fill-current" />
        <span className="font-medium">{streak}</span>
      </div>
    </div>
  );
}