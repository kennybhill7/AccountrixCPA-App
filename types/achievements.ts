/**
 * Achievement Badge System Types
 * Complete type definitions for the badge and achievement system
 */

export type BadgeCategory =
  | 'foundation'
  | 'skill-mastery'
  | 'achievement'
  | 'streak'
  | 'special';

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type BadgeCriteriaType = 'count' | 'percentage' | 'streak' | 'score' | 'time' | 'custom';

export type BadgeCriteriaOperator = '>=' | '>' | '==' | '<' | '<=';

export interface UserMetrics {
  // Completion metrics
  lessonsCompleted: number;
  journalEntriesCompleted: number;
  trialBalancesCompleted: number;
  bankRecsCompleted: number;
  wipSchedulesCompleted: number;
  consolidationsCompleted: number;
  quizzesCompleted: number;
  monthsCompleted: number;
  weeksCompleted: number;

  // Performance metrics
  perfectScores: number;
  quizScores: number[];
  averageQuizScore: number;
  tasksWithoutHints: number;
  tasksWithoutErrors: number;
  errorsFound: number;

  // Usage metrics
  hintsUsed: number;
  documentsExported: number;
  formulasShown: number;
  coaCreated: boolean;

  // Streak metrics
  currentStreak: number;
  longestStreak: number;

  // XP metrics
  totalXp: number;

  // Time metrics
  taskCompletionTimes: number[]; // in minutes
  earlyBirdSessions: number; // before 8am
  nightOwlSessions: number; // after 10pm
  weekendSessions: number;

  // Module-specific
  asc606Completed: boolean;
  constructionModulesCompleted: number;
  monthEndCompleted: boolean;
  finalExamScore?: number;
  finalExamPassed: boolean;

  // Optional content
  optionalContentCompleted: number;
  totalOptionalContent: number;
}

export interface BadgeCriteria {
  type: BadgeCriteriaType;
  metric: keyof UserMetrics | string;
  operator: BadgeCriteriaOperator;
  value: number;
  customCheck?: (userData: UserMetrics) => boolean;
}

export interface BadgeProgress {
  current: number;
  required: number;
  percentage: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  rarity: BadgeRarity;
  xpReward: number;
  criteria: BadgeCriteria;
  unlockedAt?: Date;
  progress?: BadgeProgress;
}

export interface UserBadgeData {
  unlocked: string[]; // badge IDs
  unlockedAt: Record<string, Date>;
  notifiedAt: Record<string, Date>;
  pinnedBadges: string[]; // up to 5 badges for showcase
}

export interface BadgeUnlockResult {
  badge: Badge;
  isNew: boolean;
  xpAwarded: number;
}

export interface BadgeStats {
  total: number;
  unlocked: number;
  inProgress: number;
  locked: number;
  totalXp: number;
  rarestBadge?: Badge;
  nextBadge?: Badge;
  completionPercentage: number;
  byCategory: Record<BadgeCategory, {
    total: number;
    unlocked: number;
  }>;
  byRarity: Record<BadgeRarity, {
    total: number;
    unlocked: number;
  }>;
}

export interface AchievementBadgesProps {
  view?: 'grid' | 'list' | 'showcase';
  filter?: BadgeCategory;
  showLocked?: boolean;
  searchQuery?: string;
  sortBy?: 'date' | 'rarity' | 'category' | 'progress' | 'name';
}

export interface BadgeCardProps {
  badge: Badge;
  isLocked: boolean;
  showProgress?: boolean;
  onClick?: (badge: Badge) => void;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export interface BadgeShowcaseProps {
  userId?: string;
  maxBadges?: number;
  editable?: boolean;
  badges?: Badge[];
}

export interface BadgeUnlockedNotificationProps {
  badge: Badge;
  onClose: () => void;
  playSound?: boolean;
  showConfetti?: boolean;
}

export interface BadgeDetailsModalProps {
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
  isLocked: boolean;
  progress?: BadgeProgress;
}
