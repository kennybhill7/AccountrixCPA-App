'use client';

import React, { useState } from 'react';
import { Badge } from '@/types/achievements';
import { getRarityColor } from '@/lib/achievements';
import { motion } from 'framer-motion';

interface BadgeShowcaseProps {
  userId?: string;
  maxBadges?: number;
  editable?: boolean;
  badges?: Badge[];
  pinnedBadgeIds?: string[];
  onPinBadge?: (badgeId: string) => void;
  onUnpinBadge?: (badgeId: string) => void;
}

export default function BadgeShowcase({
  userId,
  maxBadges = 5,
  editable = false,
  badges = [],
  pinnedBadgeIds = [],
  onPinBadge,
  onUnpinBadge,
}: BadgeShowcaseProps) {
  const [editMode, setEditMode] = useState(false);

  // Get pinned badges
  const pinnedBadges = badges.filter((badge) => pinnedBadgeIds.includes(badge.id));

  // Get unlocked badges that aren't pinned
  const unlockedBadges = badges.filter(
    (badge) => badge.unlockedAt && !pinnedBadgeIds.includes(badge.id)
  );

  // Sort by rarity for display
  const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
  const sortedPinnedBadges = [...pinnedBadges].sort(
    (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
  );

  const displayBadges = sortedPinnedBadges.slice(0, maxBadges);
  const remainingSlots = maxBadges - displayBadges.length;

  const handlePinToggle = (badgeId: string) => {
    if (pinnedBadgeIds.includes(badgeId)) {
      onUnpinBadge?.(badgeId);
    } else if (pinnedBadgeIds.length < maxBadges) {
      onPinBadge?.(badgeId);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Badge Showcase
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pin your favorite badges to show off your achievements
          </p>
        </div>
        {editable && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${
                editMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        )}
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-5 gap-4">
        {/* Display pinned badges */}
        {displayBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <ShowcaseBadgeCard
              badge={badge}
              editMode={editMode}
              onUnpin={() => handlePinToggle(badge.id)}
            />
          </motion.div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: remainingSlots }).map((_, index) => (
          <motion.div
            key={`empty-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (displayBadges.length + index) * 0.1 }}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center"
          >
            <div className="text-center text-gray-400 dark:text-gray-500">
              <div className="text-3xl mb-1">📌</div>
              <div className="text-xs">Empty Slot</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Mode: Badge Selection */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Select Badges to Pin ({pinnedBadgeIds.length}/{maxBadges})
          </h4>

          {unlockedBadges.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No more unlocked badges available. Unlock more badges to add them to your
              showcase!
            </p>
          ) : (
            <div className="grid grid-cols-6 gap-3 max-h-64 overflow-y-auto">
              {unlockedBadges.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => handlePinToggle(badge.id)}
                  disabled={
                    !pinnedBadgeIds.includes(badge.id) &&
                    pinnedBadgeIds.length >= maxBadges
                  }
                  className={`
                    aspect-square rounded-lg p-2 transition-all
                    ${
                      pinnedBadgeIds.length >= maxBadges &&
                      !pinnedBadgeIds.includes(badge.id)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-110 hover:shadow-lg cursor-pointer'
                    }
                    bg-white dark:bg-gray-700
                  `}
                  style={{
                    border: `2px solid ${getRarityColor(badge.rarity)}`,
                  }}
                >
                  <div className="text-3xl">{badge.icon}</div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Stats */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {badges.filter((b) => b.unlockedAt).length}
          </span>
          <span>Total Badges</span>
        </div>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">
            {pinnedBadgeIds.length}
          </span>
          <span>Pinned</span>
        </div>
      </div>
    </div>
  );
}

interface ShowcaseBadgeCardProps {
  badge: Badge;
  editMode: boolean;
  onUnpin: () => void;
}

function ShowcaseBadgeCard({ badge, editMode, onUnpin }: ShowcaseBadgeCardProps) {
  const rarityColor = getRarityColor(badge.rarity);

  return (
    <div
      className="relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
      style={{
        border: `3px solid ${rarityColor}`,
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${rarityColor}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full">
        <div className="text-5xl mb-2">{badge.icon}</div>
        <div
          className="text-xs font-bold text-center line-clamp-2"
          style={{ color: rarityColor }}
        >
          {badge.name}
        </div>

        {/* Rarity indicator */}
        <div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: rarityColor }}
        />
      </div>

      {/* Unpin button (edit mode) */}
      {editMode && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            onUnpin();
          }}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20"
        >
          ×
        </motion.button>
      )}

      {/* Hover tooltip */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
        <div className="font-semibold">{badge.name}</div>
        <div className="text-gray-300 text-xs">{badge.rarity}</div>
      </div>
    </div>
  );
}
