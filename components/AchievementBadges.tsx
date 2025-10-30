'use client';

import React, { useState, useMemo } from 'react';
import { Badge, BadgeCategory } from '@/types/achievements';
import {
  getAllBadgesWithStatus,
  searchBadges,
  sortBadges,
  getCategoryLabel,
} from '@/lib/achievements';
import BadgeCard from './BadgeCard';
import BadgeDetailsModal from './BadgeDetailsModal';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementBadgesProps {
  view?: 'grid' | 'list' | 'showcase';
  filter?: BadgeCategory;
  showLocked?: boolean;
  searchQuery?: string;
  sortBy?: 'date' | 'rarity' | 'category' | 'progress' | 'name';
  userData: any; // UserMetrics
  userBadgeData: any; // UserBadgeData
}

export default function AchievementBadges({
  view = 'grid',
  filter,
  showLocked = true,
  searchQuery: externalSearchQuery,
  sortBy: externalSortBy = 'date',
  userData,
  userBadgeData,
}: AchievementBadgesProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localFilter, setLocalFilter] = useState<BadgeCategory | 'all'>('all');
  const [localSortBy, setLocalSortBy] = useState<
    'date' | 'rarity' | 'category' | 'progress' | 'name'
  >(externalSortBy);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showLockedBadges, setShowLockedBadges] = useState(showLocked);

  const searchQuery = externalSearchQuery ?? localSearchQuery;
  const currentFilter = filter ?? localFilter;
  const sortByValue = externalSortBy ?? localSortBy;

  // Get all badges with status
  const allBadges = useMemo(
    () => getAllBadgesWithStatus(userData, userBadgeData),
    [userData, userBadgeData]
  );

  // Filter badges
  const filteredBadges = useMemo(() => {
    let badges = allBadges;

    // Filter by category
    if (currentFilter !== 'all') {
      badges = badges.filter((badge) => badge.category === currentFilter);
    }

    // Filter by locked/unlocked
    if (!showLockedBadges) {
      badges = badges.filter((badge) => badge.unlockedAt);
    }

    // Search filter
    if (searchQuery) {
      badges = searchBadges(searchQuery, badges);
    }

    // Sort
    badges = sortBadges(badges, sortByValue);

    return badges;
  }, [allBadges, currentFilter, showLockedBadges, searchQuery, sortByValue]);

  const categories: { value: BadgeCategory | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Badges', icon: '🏆' },
    { value: 'foundation', label: 'Foundation', icon: '👣' },
    { value: 'skill-mastery', label: 'Skill Mastery', icon: '🥷' },
    { value: 'achievement', label: 'Achievement', icon: '🎓' },
    { value: 'streak', label: 'Streak', icon: '🔥' },
    { value: 'special', label: 'Special', icon: '⭐' },
  ];

  const sortOptions: { value: typeof sortByValue; label: string }[] = [
    { value: 'date', label: 'Recently Earned' },
    { value: 'rarity', label: 'Rarity' },
    { value: 'category', label: 'Category' },
    { value: 'progress', label: 'Progress' },
    { value: 'name', label: 'Name' },
  ];

  const unlockedCount = allBadges.filter((b) => b.unlockedAt).length;
  const totalCount = allBadges.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Achievement Badges
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Earn badges by completing lessons, challenges, and milestones
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {completionPercentage}% Complete
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        {!externalSearchQuery && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search badges..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>
        )}

        {/* Category filters */}
        {!filter && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setLocalFilter(category.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    currentFilter === category.value
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              value={sortByValue}
              onChange={(e) =>
                setLocalSortBy(e.target.value as typeof sortByValue)
              }
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show locked toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLockedBadges}
              onChange={(e) => setShowLockedBadges(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show locked badges
            </span>
          </label>

          {/* Results count */}
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredBadges.length} badge{filteredBadges.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Badge Grid/List */}
      <AnimatePresence mode="wait">
        {filteredBadges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No badges found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        ) : view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BadgeCard
                  badge={badge}
                  isLocked={!badge.unlockedAt}
                  showProgress={true}
                  onClick={setSelectedBadge}
                  size="medium"
                  animated={true}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBadge(badge)}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all
                  ${
                    badge.unlockedAt
                      ? 'bg-white dark:bg-gray-800 hover:shadow-lg'
                      : 'bg-gray-50 dark:bg-gray-900 opacity-50'
                  }
                  border-l-4
                `}
                style={{
                  borderLeftColor: badge.unlockedAt
                    ? getRarityColor(badge.rarity)
                    : '#d1d5db',
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{badge.unlockedAt ? badge.icon : '🔒'}</div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {badge.unlockedAt ? badge.name : '???'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {badge.description}
                    </p>
                    {!badge.unlockedAt && badge.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {badge.progress.current}/{badge.progress.required}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${badge.progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-600 mb-1">
                      +{badge.xpReward} XP
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      {badge.rarity}
                    </div>
                    {badge.unlockedAt && (
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(badge.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="showcase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBadges.slice(0, 6).map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <BadgeCard
                  badge={badge}
                  isLocked={!badge.unlockedAt}
                  showProgress={true}
                  onClick={setSelectedBadge}
                  size="large"
                  animated={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <BadgeDetailsModal
          badge={selectedBadge}
          isOpen={true}
          onClose={() => setSelectedBadge(null)}
          isLocked={!selectedBadge.unlockedAt}
          progress={selectedBadge.progress}
        />
      )}
    </div>
  );
}

// Helper function (should be imported from lib/achievements.ts)
function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#10b981',
    uncommon: '#3b82f6',
    rare: '#a855f7',
    epic: '#f97316',
    legendary: '#fbbf24',
  };
  return colors[rarity] || '#10b981';
}
