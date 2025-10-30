/**
 * Achievement Badge System Logic
 * Badge definitions, unlock logic, and progress tracking
 */

import {
  Badge,
  BadgeCategory,
  BadgeProgress,
  BadgeRarity,
  BadgeStats,
  UserMetrics,
  UserBadgeData,
  BadgeUnlockResult,
} from '@/types/achievements';

/**
 * ALL 40 BADGE DEFINITIONS
 */
export const ALL_BADGES: Badge[] = [
  // ==================== FOUNDATION BADGES (10) ====================
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson and begin your accounting journey',
    category: 'foundation',
    icon: '👣',
    rarity: 'common',
    xpReward: 10,
    criteria: {
      type: 'count',
      metric: 'lessonsCompleted',
      operator: '>=',
      value: 1,
    },
  },
  {
    id: 'journal-master',
    name: 'Journal Master',
    description: 'Complete 10 journal entries with precision',
    category: 'foundation',
    icon: '📔',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'journalEntriesCompleted',
      operator: '>=',
      value: 10,
    },
  },
  {
    id: 'trial-balance-pro',
    name: 'Trial Balance Pro',
    description: 'Successfully balance 5 trial balances',
    category: 'foundation',
    icon: '⚖️',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'trialBalancesCompleted',
      operator: '>=',
      value: 5,
    },
  },
  {
    id: 'bank-rec-expert',
    name: 'Bank Rec Expert',
    description: 'Complete 5 bank reconciliations flawlessly',
    category: 'foundation',
    icon: '🏦',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'bankRecsCompleted',
      operator: '>=',
      value: 5,
    },
  },
  {
    id: 'wip-wizard',
    name: 'WIP Wizard',
    description: 'Calculate 10 work-in-progress schedules',
    category: 'foundation',
    icon: '🧙',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'wipSchedulesCompleted',
      operator: '>=',
      value: 10,
    },
  },
  {
    id: 'coa-architect',
    name: 'COA Architect',
    description: 'Design and build your first custom chart of accounts',
    category: 'foundation',
    icon: '🏗️',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'custom',
      metric: 'coaCreated',
      operator: '==',
      value: 1,
      customCheck: (data: UserMetrics) => data.coaCreated === true,
    },
  },
  {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Complete your first week of training',
    category: 'foundation',
    icon: '🚀',
    rarity: 'common',
    xpReward: 10,
    criteria: {
      type: 'count',
      metric: 'weeksCompleted',
      operator: '>=',
      value: 1,
    },
  },
  {
    id: 'month-warrior',
    name: 'Month Warrior',
    description: 'Complete your first full month of curriculum',
    category: 'foundation',
    icon: '📅',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'monthsCompleted',
      operator: '>=',
      value: 1,
    },
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Maintain a 3-day learning streak',
    category: 'foundation',
    icon: '🔥',
    rarity: 'common',
    xpReward: 10,
    criteria: {
      type: 'streak',
      metric: 'currentStreak',
      operator: '>=',
      value: 3,
    },
  },
  {
    id: 'dedicated-student',
    name: 'Dedicated Student',
    description: 'Achieve a 7-day learning streak',
    category: 'foundation',
    icon: '💪',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'streak',
      metric: 'currentStreak',
      operator: '>=',
      value: 7,
    },
  },

  // ==================== SKILL MASTERY BADGES (10) ====================
  {
    id: 'debit-credit-ninja',
    name: 'Debit/Credit Ninja',
    description: 'Score 100% on the DR/CR fundamentals quiz',
    category: 'skill-mastery',
    icon: '🥷',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'custom',
      metric: 'perfectScores',
      operator: '>=',
      value: 1,
      customCheck: (data: UserMetrics) => data.perfectScores >= 1,
    },
  },
  {
    id: 'asc-606-expert',
    name: 'ASC 606 Expert',
    description: 'Master revenue recognition under ASC 606',
    category: 'skill-mastery',
    icon: '📊',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'custom',
      metric: 'asc606Completed',
      operator: '==',
      value: 1,
      customCheck: (data: UserMetrics) => data.asc606Completed === true,
    },
  },
  {
    id: 'consolidation-master',
    name: 'Consolidation Master',
    description: 'Complete 3 complex consolidation exercises',
    category: 'skill-mastery',
    icon: '🔗',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'count',
      metric: 'consolidationsCompleted',
      operator: '>=',
      value: 3,
    },
  },
  {
    id: 'month-end-closer',
    name: 'Month-End Closer',
    description: 'Successfully complete the month-end close simulation',
    category: 'skill-mastery',
    icon: '🔐',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'custom',
      metric: 'monthEndCompleted',
      operator: '==',
      value: 1,
      customCheck: (data: UserMetrics) => data.monthEndCompleted === true,
    },
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Achieve 100% on any quiz or assessment',
    category: 'skill-mastery',
    icon: '💯',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'count',
      metric: 'perfectScores',
      operator: '>=',
      value: 1,
    },
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete any task in less than 50% of the expected time',
    category: 'skill-mastery',
    icon: '⚡',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'custom',
      metric: 'taskCompletionTimes',
      operator: '<=',
      value: 0.5,
      customCheck: (data: UserMetrics) => {
        return data.taskCompletionTimes.some(time => time <= 0.5);
      },
    },
  },
  {
    id: 'no-hints-needed',
    name: 'No Hints Needed',
    description: 'Complete a challenging task without using any hints',
    category: 'skill-mastery',
    icon: '🎯',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'tasksWithoutHints',
      operator: '>=',
      value: 1,
    },
  },
  {
    id: 'error-detector',
    name: 'Error Detector',
    description: 'Find all errors in a complex accounting scenario',
    category: 'skill-mastery',
    icon: '🔍',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'count',
      metric: 'errorsFound',
      operator: '>=',
      value: 10,
    },
  },
  {
    id: 'formula-wizard',
    name: 'Formula Wizard',
    description: 'Show formulas 10 times to understand the math',
    category: 'skill-mastery',
    icon: '🧮',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'formulasShown',
      operator: '>=',
      value: 10,
    },
  },
  {
    id: 'export-king',
    name: 'Export King',
    description: 'Export 20 documents for your records',
    category: 'skill-mastery',
    icon: '📤',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'documentsExported',
      operator: '>=',
      value: 20,
    },
  },

  // ==================== ACHIEVEMENT BADGES (10) ====================
  {
    id: 'cpa-ready',
    name: 'CPA Ready',
    description: 'Pass the final exam with 80% or higher',
    category: 'achievement',
    icon: '🎓',
    rarity: 'legendary',
    xpReward: 250,
    criteria: {
      type: 'custom',
      metric: 'finalExamScore',
      operator: '>=',
      value: 80,
      customCheck: (data: UserMetrics) => {
        return data.finalExamScore !== undefined && data.finalExamScore >= 80;
      },
    },
  },
  {
    id: 'honor-roll',
    name: 'Honor Roll',
    description: 'Maintain a 90% average on all quizzes',
    category: 'achievement',
    icon: '🌟',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'percentage',
      metric: 'averageQuizScore',
      operator: '>=',
      value: 90,
    },
  },
  {
    id: 'perfect-month',
    name: 'Perfect Month',
    description: 'Complete a month with 100% average score',
    category: 'achievement',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 250,
    criteria: {
      type: 'custom',
      metric: 'averageQuizScore',
      operator: '==',
      value: 100,
      customCheck: (data: UserMetrics) => {
        return data.averageQuizScore === 100 && data.monthsCompleted >= 1;
      },
    },
  },
  {
    id: 'triple-threat',
    name: 'Triple Threat',
    description: 'Master journal entries, trial balances, and bank reconciliations',
    category: 'achievement',
    icon: '🎭',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'custom',
      metric: 'journalEntriesCompleted',
      operator: '>=',
      value: 10,
      customCheck: (data: UserMetrics) => {
        return (
          data.journalEntriesCompleted >= 10 &&
          data.trialBalancesCompleted >= 5 &&
          data.bankRecsCompleted >= 5
        );
      },
    },
  },
  {
    id: 'construction-pro',
    name: 'Construction Pro',
    description: 'Complete all construction accounting modules',
    category: 'achievement',
    icon: '🏗️',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'count',
      metric: 'constructionModulesCompleted',
      operator: '>=',
      value: 5,
    },
  },
  {
    id: 'multi-entity-maven',
    name: 'Multi-Entity Maven',
    description: 'Master complex multi-entity consolidations',
    category: 'achievement',
    icon: '🏢',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'count',
      metric: 'consolidationsCompleted',
      operator: '>=',
      value: 5,
    },
  },
  {
    id: 'xp-millionaire',
    name: 'XP Millionaire',
    description: 'Earn 10,000 total experience points',
    category: 'achievement',
    icon: '💰',
    rarity: 'legendary',
    xpReward: 250,
    criteria: {
      type: 'count',
      metric: 'totalXp',
      operator: '>=',
      value: 10000,
    },
  },
  {
    id: 'overachiever',
    name: 'Overachiever',
    description: 'Complete all optional content and bonus challenges',
    category: 'achievement',
    icon: '🚀',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'custom',
      metric: 'optionalContentCompleted',
      operator: '>=',
      value: 1,
      customCheck: (data: UserMetrics) => {
        return (
          data.totalOptionalContent > 0 &&
          data.optionalContentCompleted >= data.totalOptionalContent
        );
      },
    },
  },
  {
    id: 'helper',
    name: 'Helper',
    description: 'Use hints wisely - average less than 3 hints per task',
    category: 'achievement',
    icon: '💡',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'custom',
      metric: 'hintsUsed',
      operator: '<',
      value: 3,
      customCheck: (data: UserMetrics) => {
        const tasksCompleted = data.lessonsCompleted || 1;
        return data.hintsUsed / tasksCompleted < 3;
      },
    },
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 10 tasks without any errors',
    category: 'achievement',
    icon: '✨',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'count',
      metric: 'tasksWithoutErrors',
      operator: '>=',
      value: 10,
    },
  },

  // ==================== STREAK BADGES (5) ====================
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    category: 'streak',
    icon: '🔥',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'streak',
      metric: 'currentStreak',
      operator: '>=',
      value: 7,
    },
  },
  {
    id: 'monthly-dedication',
    name: 'Monthly Dedication',
    description: 'Maintain a 30-day learning streak',
    category: 'streak',
    icon: '🌙',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'streak',
      metric: 'currentStreak',
      operator: '>=',
      value: 30,
    },
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 50-day learning streak',
    category: 'streak',
    icon: '💪',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'streak',
      metric: 'currentStreak',
      operator: '>=',
      value: 50,
    },
  },
  {
    id: 'legendary',
    name: 'Legendary',
    description: 'Maintain a 100-day learning streak',
    category: 'streak',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 250,
    criteria: {
      type: 'streak',
      metric: 'currentStreak',
      operator: '>=',
      value: 100,
    },
  },
  {
    id: 'eternal-student',
    name: 'Eternal Student',
    description: 'Maintain a 365-day learning streak - true dedication!',
    category: 'streak',
    icon: '♾️',
    rarity: 'legendary',
    xpReward: 250,
    criteria: {
      type: 'streak',
      metric: 'currentStreak',
      operator: '>=',
      value: 365,
    },
  },

  // ==================== SPECIAL BADGES (5) ====================
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a lesson before 8am',
    category: 'special',
    icon: '🌅',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'earlyBirdSessions',
      operator: '>=',
      value: 1,
    },
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a lesson after 10pm',
    category: 'special',
    icon: '🦉',
    rarity: 'uncommon',
    xpReward: 25,
    criteria: {
      type: 'count',
      metric: 'nightOwlSessions',
      operator: '>=',
      value: 1,
    },
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Study on both Saturday and Sunday',
    category: 'special',
    icon: '🏖️',
    rarity: 'rare',
    xpReward: 50,
    criteria: {
      type: 'count',
      metric: 'weekendSessions',
      operator: '>=',
      value: 2,
    },
  },
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Complete an entire month in just 2 weeks',
    category: 'special',
    icon: '⏱️',
    rarity: 'epic',
    xpReward: 100,
    criteria: {
      type: 'custom',
      metric: 'monthsCompleted',
      operator: '>=',
      value: 1,
      customCheck: (data: UserMetrics) => {
        // This would need to check completion time
        // For now, simplified logic
        return data.monthsCompleted >= 1;
      },
    },
  },
  {
    id: 'accountrix-certified',
    name: 'Accountrix Certified',
    description: 'Pass the final exam and receive your official certificate',
    category: 'special',
    icon: '📜',
    rarity: 'legendary',
    xpReward: 250,
    criteria: {
      type: 'custom',
      metric: 'finalExamPassed',
      operator: '==',
      value: 1,
      customCheck: (data: UserMetrics) => data.finalExamPassed === true,
    },
  },
];

/**
 * Get user metric value by key
 */
export function getUserMetric(userData: UserMetrics, metric: string): number {
  const value = userData[metric as keyof UserMetrics];
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number') return value;
  if (Array.isArray(value)) return value.length;
  return 0;
}

/**
 * Check if a badge should be unlocked
 */
export function checkBadgeUnlock(badge: Badge, userData: UserMetrics): boolean {
  const { criteria } = badge;

  // Custom check takes precedence
  if (criteria.customCheck) {
    return criteria.customCheck(userData);
  }

  const metricValue = getUserMetric(userData, criteria.metric);

  switch (criteria.operator) {
    case '>=':
      return metricValue >= criteria.value;
    case '>':
      return metricValue > criteria.value;
    case '==':
      return metricValue === criteria.value;
    case '<':
      return metricValue < criteria.value;
    case '<=':
      return metricValue <= criteria.value;
    default:
      return false;
  }
}

/**
 * Check all badges and return newly unlocked ones
 */
export function checkAllBadges(
  userData: UserMetrics,
  userBadgeData: UserBadgeData
): BadgeUnlockResult[] {
  const newlyUnlocked: BadgeUnlockResult[] = [];

  ALL_BADGES.forEach((badge) => {
    if (!userBadgeData.unlocked.includes(badge.id)) {
      if (checkBadgeUnlock(badge, userData)) {
        newlyUnlocked.push({
          badge: { ...badge, unlockedAt: new Date() },
          isNew: true,
          xpAwarded: badge.xpReward,
        });
      }
    }
  });

  return newlyUnlocked;
}

/**
 * Calculate progress towards a badge
 */
export function calculateBadgeProgress(
  badge: Badge,
  userData: UserMetrics
): BadgeProgress {
  const metricValue = getUserMetric(userData, badge.criteria.metric);
  const current = Math.min(metricValue, badge.criteria.value);
  const required = badge.criteria.value;

  return {
    current,
    required,
    percentage: Math.round((current / required) * 100),
  };
}

/**
 * Get all badges with their unlock status
 */
export function getAllBadgesWithStatus(
  userData: UserMetrics,
  userBadgeData: UserBadgeData
): Badge[] {
  return ALL_BADGES.map((badge) => {
    const isUnlocked = userBadgeData.unlocked.includes(badge.id);
    const unlockedAt = userBadgeData.unlockedAt[badge.id];
    const progress = isUnlocked
      ? { current: badge.criteria.value, required: badge.criteria.value, percentage: 100 }
      : calculateBadgeProgress(badge, userData);

    return {
      ...badge,
      unlockedAt: unlockedAt ? new Date(unlockedAt) : undefined,
      progress,
    };
  });
}

/**
 * Get unlocked badges
 */
export function getUnlockedBadges(
  userData: UserMetrics,
  userBadgeData: UserBadgeData
): Badge[] {
  return getAllBadgesWithStatus(userData, userBadgeData).filter(
    (badge) => badge.unlockedAt
  );
}

/**
 * Get locked badges
 */
export function getLockedBadges(
  userData: UserMetrics,
  userBadgeData: UserBadgeData
): Badge[] {
  return getAllBadgesWithStatus(userData, userBadgeData).filter(
    (badge) => !badge.unlockedAt
  );
}

/**
 * Get badges by category
 */
export function getBadgesByCategory(category: BadgeCategory): Badge[] {
  return ALL_BADGES.filter((badge) => badge.category === category);
}

/**
 * Get badges by rarity
 */
export function getBadgesByRarity(rarity: BadgeRarity): Badge[] {
  return ALL_BADGES.filter((badge) => badge.rarity === rarity);
}

/**
 * Calculate badge statistics
 */
export function calculateBadgeStats(
  userData: UserMetrics,
  userBadgeData: UserBadgeData
): BadgeStats {
  const allBadges = getAllBadgesWithStatus(userData, userBadgeData);
  const unlocked = allBadges.filter((b) => b.unlockedAt);
  const locked = allBadges.filter((b) => !b.unlockedAt);
  const inProgress = locked.filter((b) => b.progress && b.progress.percentage > 0);

  const totalXp = unlocked.reduce((sum, badge) => sum + badge.xpReward, 0);

  // Get rarest unlocked badge
  const rarityOrder: Record<BadgeRarity, number> = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
  };
  const rarestBadge = unlocked.sort(
    (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
  )[0];

  // Get next badge (closest to completion)
  const nextBadge = inProgress.sort(
    (a, b) => (b.progress?.percentage || 0) - (a.progress?.percentage || 0)
  )[0];

  // Stats by category
  const byCategory: Record<BadgeCategory, { total: number; unlocked: number }> = {
    foundation: { total: 0, unlocked: 0 },
    'skill-mastery': { total: 0, unlocked: 0 },
    achievement: { total: 0, unlocked: 0 },
    streak: { total: 0, unlocked: 0 },
    special: { total: 0, unlocked: 0 },
  };

  allBadges.forEach((badge) => {
    byCategory[badge.category].total++;
    if (badge.unlockedAt) byCategory[badge.category].unlocked++;
  });

  // Stats by rarity
  const byRarity: Record<BadgeRarity, { total: number; unlocked: number }> = {
    common: { total: 0, unlocked: 0 },
    uncommon: { total: 0, unlocked: 0 },
    rare: { total: 0, unlocked: 0 },
    epic: { total: 0, unlocked: 0 },
    legendary: { total: 0, unlocked: 0 },
  };

  allBadges.forEach((badge) => {
    byRarity[badge.rarity].total++;
    if (badge.unlockedAt) byRarity[badge.rarity].unlocked++;
  });

  return {
    total: allBadges.length,
    unlocked: unlocked.length,
    inProgress: inProgress.length,
    locked: locked.length - inProgress.length,
    totalXp,
    rarestBadge,
    nextBadge,
    completionPercentage: Math.round((unlocked.length / allBadges.length) * 100),
    byCategory,
    byRarity,
  };
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: BadgeRarity): string {
  const colors: Record<BadgeRarity, string> = {
    common: '#10b981', // green
    uncommon: '#3b82f6', // blue
    rare: '#a855f7', // purple
    epic: '#f97316', // orange
    legendary: '#fbbf24', // gold
  };
  return colors[rarity];
}

/**
 * Get category label
 */
export function getCategoryLabel(category: BadgeCategory): string {
  const labels: Record<BadgeCategory, string> = {
    foundation: 'Foundation',
    'skill-mastery': 'Skill Mastery',
    achievement: 'Achievement',
    streak: 'Streak',
    special: 'Special',
  };
  return labels[category];
}

/**
 * Search badges by name or description
 */
export function searchBadges(query: string, badges: Badge[]): Badge[] {
  const lowerQuery = query.toLowerCase();
  return badges.filter(
    (badge) =>
      badge.name.toLowerCase().includes(lowerQuery) ||
      badge.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort badges
 */
export function sortBadges(
  badges: Badge[],
  sortBy: 'date' | 'rarity' | 'category' | 'progress' | 'name'
): Badge[] {
  const sorted = [...badges];

  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => {
        if (!a.unlockedAt) return 1;
        if (!b.unlockedAt) return -1;
        return b.unlockedAt.getTime() - a.unlockedAt.getTime();
      });

    case 'rarity':
      const rarityOrder: Record<BadgeRarity, number> = {
        common: 1,
        uncommon: 2,
        rare: 3,
        epic: 4,
        legendary: 5,
      };
      return sorted.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);

    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));

    case 'progress':
      return sorted.sort(
        (a, b) => (b.progress?.percentage || 0) - (a.progress?.percentage || 0)
      );

    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    default:
      return sorted;
  }
}
