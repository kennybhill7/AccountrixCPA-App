'use client';

import React, { useState } from 'react';
import AchievementBadges from '@/components/AchievementBadges';
import BadgeShowcase from '@/components/BadgeShowcase';
import BadgeUnlockedNotification from '@/components/BadgeUnlockedNotification';
import { Badge, UserMetrics, UserBadgeData } from '@/types/achievements';
import {
  calculateBadgeStats,
  getAllBadgesWithStatus,
  checkAllBadges,
} from '@/lib/achievements';

// Mock user data for demonstration
const mockUserMetrics: UserMetrics = {
  lessonsCompleted: 5,
  journalEntriesCompleted: 12,
  trialBalancesCompleted: 3,
  bankRecsCompleted: 2,
  wipSchedulesCompleted: 5,
  consolidationsCompleted: 1,
  quizzesCompleted: 8,
  monthsCompleted: 0,
  weeksCompleted: 1,
  perfectScores: 1,
  quizScores: [85, 92, 100, 78, 95, 88, 90, 87],
  averageQuizScore: 89.4,
  tasksWithoutHints: 3,
  tasksWithoutErrors: 2,
  errorsFound: 5,
  hintsUsed: 15,
  documentsExported: 8,
  formulasShown: 12,
  coaCreated: false,
  currentStreak: 5,
  longestStreak: 5,
  totalXp: 1250,
  taskCompletionTimes: [1.2, 0.8, 1.5, 2.1, 0.4, 1.8],
  earlyBirdSessions: 2,
  nightOwlSessions: 1,
  weekendSessions: 1,
  asc606Completed: false,
  constructionModulesCompleted: 0,
  monthEndCompleted: false,
  finalExamScore: undefined,
  finalExamPassed: false,
  optionalContentCompleted: 2,
  totalOptionalContent: 10,
};

const mockUserBadgeData: UserBadgeData = {
  unlocked: [
    'first-steps',
    'journal-master',
    'streak-starter',
    'quick-learner',
    'perfect-score',
    'formula-wizard',
    'export-king',
  ],
  unlockedAt: {
    'first-steps': new Date('2025-10-01'),
    'journal-master': new Date('2025-10-08'),
    'streak-starter': new Date('2025-10-05'),
    'quick-learner': new Date('2025-10-07'),
    'perfect-score': new Date('2025-10-10'),
    'formula-wizard': new Date('2025-10-09'),
    'export-king': new Date('2025-10-11'),
  },
  notifiedAt: {},
  pinnedBadges: ['journal-master', 'perfect-score', 'formula-wizard'],
};

export default function BadgesPage() {
  const [userMetrics] = useState<UserMetrics>(mockUserMetrics);
  const [userBadgeData, setUserBadgeData] = useState<UserBadgeData>(mockUserBadgeData);
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  const [view, setView] = useState<'grid' | 'list' | 'showcase'>('grid');

  // Get all badges with status
  const allBadges = getAllBadgesWithStatus(userMetrics, userBadgeData);

  // Calculate stats
  const stats = calculateBadgeStats(userMetrics, userBadgeData);

  // Simulate unlocking a badge
  const handleSimulateUnlock = () => {
    const lockedBadges = allBadges.filter((b) => !b.unlockedAt);
    if (lockedBadges.length === 0) {
      alert('All badges already unlocked!');
      return;
    }

    const randomBadge = lockedBadges[Math.floor(Math.random() * lockedBadges.length)];

    // Add to unlocked
    setUserBadgeData({
      ...userBadgeData,
      unlocked: [...userBadgeData.unlocked, randomBadge.id],
      unlockedAt: {
        ...userBadgeData.unlockedAt,
        [randomBadge.id]: new Date(),
      },
    });

    // Show notification
    setUnlockedBadge(randomBadge);
  };

  // Handle pin/unpin
  const handlePinBadge = (badgeId: string) => {
    if (userBadgeData.pinnedBadges.length >= 5) {
      alert('You can only pin 5 badges at a time!');
      return;
    }
    setUserBadgeData({
      ...userBadgeData,
      pinnedBadges: [...userBadgeData.pinnedBadges, badgeId],
    });
  };

  const handleUnpinBadge = (badgeId: string) => {
    setUserBadgeData({
      ...userBadgeData,
      pinnedBadges: userBadgeData.pinnedBadges.filter((id) => id !== badgeId),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Achievement Badges
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and unlock badges as you complete lessons and challenges
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Badges"
            value={stats.total}
            icon="🏆"
            color="blue"
          />
          <StatCard
            title="Unlocked"
            value={`${stats.unlocked} (${stats.completionPercentage}%)`}
            icon="✅"
            color="green"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon="⏳"
            color="yellow"
          />
          <StatCard
            title="Total XP"
            value={stats.totalXp}
            icon="✨"
            color="purple"
          />
        </div>

        {/* Badge Showcase */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <BadgeShowcase
            maxBadges={5}
            editable={true}
            badges={allBadges}
            pinnedBadgeIds={userBadgeData.pinnedBadges}
            onPinBadge={handlePinBadge}
            onUnpinBadge={handleUnpinBadge}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* View Toggle */}
          <div className="flex gap-2">
            {(['grid', 'list', 'showcase'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`
                  px-4 py-2 rounded-lg font-medium capitalize transition-all
                  ${
                    view === v
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Simulate Unlock Button */}
          <button
            onClick={handleSimulateUnlock}
            className="ml-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
          >
            🎉 Simulate Badge Unlock
          </button>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(stats.byCategory).map(([category, data]) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
            >
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 capitalize">
                {category.replace('-', ' ')}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.unlocked}/{data.total}
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${data.total > 0 ? (data.unlocked / data.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Next Badge to Unlock */}
        {stats.nextBadge && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{stats.nextBadge.icon}</div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Next Badge: {stats.nextBadge.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {stats.nextBadge.description}
                </p>
                {stats.nextBadge.progress && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {stats.nextBadge.progress.current}/{stats.nextBadge.progress.required}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${stats.nextBadge.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Reward</div>
                <div className="text-xl font-bold text-yellow-600">
                  +{stats.nextBadge.xpReward} XP
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Badge Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <AchievementBadges
            view={view}
            showLocked={true}
            userData={userMetrics}
            userBadgeData={userBadgeData}
          />
        </div>

        {/* Rarity Distribution */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Badges by Rarity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(stats.byRarity).map(([rarity, data]) => {
              const colors = {
                common: '#10b981',
                uncommon: '#3b82f6',
                rare: '#a855f7',
                epic: '#f97316',
                legendary: '#fbbf24',
              };
              const color = colors[rarity as keyof typeof colors];

              return (
                <div
                  key={rarity}
                  className="p-4 rounded-lg border-2"
                  style={{ borderColor: color }}
                >
                  <div
                    className="text-xs font-bold uppercase tracking-wide mb-2"
                    style={{ color }}
                  >
                    {rarity}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {data.unlocked}/{data.total}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {data.total > 0
                      ? Math.round((data.unlocked / data.total) * 100)
                      : 0}
                    % Complete
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badge Unlock Notification */}
      {unlockedBadge && (
        <BadgeUnlockedNotification
          badge={unlockedBadge}
          onClose={() => setUnlockedBadge(null)}
          showConfetti={true}
          playSound={false}
        />
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${colorClasses[color]}`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{icon}</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </span>
        </div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </div>
      </div>
    </div>
  );
}
