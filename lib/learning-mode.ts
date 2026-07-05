// Learning Mode Utilities and Helper Functions

import {
  LearningMode,
  LearningModeConfig,
  ModeRecommendation,
  ModeAnalytics,
  ModeFeatureKey,
  ModeUIKey,
  ModeContentKey,
} from '@/types/learning-mode';
import {
  STUDENT_MODE_CONFIG,
  CPA_MODE_CONFIG
} from '@/types/learning-mode';
import { UserProgress } from '@/lib/types';

// Re-export the configs for convenience
export { STUDENT_MODE_CONFIG, CPA_MODE_CONFIG };

// ============================================================================
// MODE CONFIGURATION GETTERS
// ============================================================================

/**
 * Get configuration for a specific learning mode
 */
export function getModeConfig(mode: LearningMode): LearningModeConfig {
  return mode === 'student' ? STUDENT_MODE_CONFIG : CPA_MODE_CONFIG;
}

/**
 * Get the opposite mode
 */
export function getOppositeMode(mode: LearningMode): LearningMode {
  return mode === 'student' ? 'cpa' : 'student';
}

/**
 * Get mode label with icon
 */
export function getModeLabel(mode: LearningMode): string {
  const config = getModeConfig(mode);
  return `${config.icon} ${config.label}`;
}

// ============================================================================
// FEATURE CHECKING
// ============================================================================

/**
 * Check if a specific feature is enabled in the given mode
 */
export function isFeatureEnabled(
  mode: LearningMode,
  feature: ModeFeatureKey
): boolean {
  const config = getModeConfig(mode);
  return config.features[feature];
}

/**
 * Check if a UI element should be shown
 */
export function shouldShowUIElement(
  mode: LearningMode,
  element: ModeUIKey
): boolean {
  const config = getModeConfig(mode);
  const value = config.ui[element];
  // All UI values are boolean or string, convert to boolean
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'practice' || value === 'test';
  return Boolean(value);
}

/**
 * Get content setting value
 */
export function getContentSetting<K extends ModeContentKey>(
  mode: LearningMode,
  setting: K
): LearningModeConfig['content'][K] {
  const config = getModeConfig(mode);
  return config.content[setting];
}

// ============================================================================
// MODE RECOMMENDATIONS
// ============================================================================

/**
 * Analyze user progress and recommend appropriate mode
 *
 * Recommendation logic:
 * - Exam Mode: High completion (20+ lessons), high scores (85%+)
 * - Study Mode: Low completion (<5 lessons), lower scores (<70%)
 * - Keep current: Medium progress
 */
export function getRecommendedMode(
  currentMode: LearningMode,
  userProgress: {
    totalLessonsCompleted: number;
    totalQuizzesCompleted: number;
    completedQuizzes: string[];
    xp: number;
  },
  analytics?: Partial<ModeAnalytics>
): ModeRecommendation {
  const lessons = userProgress.totalLessonsCompleted;
  const quizzes = userProgress.totalQuizzesCompleted;
  const xp = userProgress.xp;

  // Calculate average quiz score from analytics or estimate
  let avgScore = 75; // Default estimate
  if (analytics) {
    const modeStats = currentMode === 'student'
      ? analytics.studentMode
      : analytics.cpaMode;

    if (modeStats && modeStats.quizzesCompleted > 0) {
      avgScore = modeStats.avgQuizScore;
    }
  }

  const reasons: string[] = [];
  let recommendedMode = currentMode;
  let confidence: 'low' | 'medium' | 'high' = 'low';

  // Recommend Exam Mode if user is doing well in Study Mode
  if (currentMode === 'student') {
    if (lessons >= 20 && avgScore >= 85) {
      recommendedMode = 'cpa';
      confidence = 'high';
      reasons.push('You have completed many lessons with high scores');
      reasons.push('Exam Mode offers faster-paced learning');
      reasons.push('You are ready for exam-style practice');
    } else if (lessons >= 10 && avgScore >= 80) {
      recommendedMode = 'cpa';
      confidence = 'medium';
      reasons.push('You are progressing well in Study Mode');
      reasons.push('Consider Exam Mode for more challenge');
    }
  }

  // Recommend Study Mode if user is struggling in Exam Mode
  if (currentMode === 'cpa') {
    if (lessons < 5 || avgScore < 70) {
      recommendedMode = 'student';
      confidence = 'high';
      reasons.push('Study Mode offers more detailed explanations');
      reasons.push('Build a stronger foundation before exam prep');
      reasons.push('Take advantage of hints and guided learning');
    } else if (avgScore < 75) {
      recommendedMode = 'student';
      confidence = 'medium';
      reasons.push('Study Mode may help improve understanding');
      reasons.push('More support available for challenging topics');
    }
  }

  // If staying in current mode
  if (recommendedMode === currentMode) {
    confidence = 'low';
    reasons.length = 0;
    reasons.push(`You are making good progress in ${getModeLabel(currentMode)}`);
    reasons.push('Continue at your current pace');
  }

  return {
    recommendedMode,
    confidence,
    reasons,
    shouldSwitch: recommendedMode !== currentMode && confidence !== 'low',
  };
}

/**
 * Check if user should be prompted to switch modes
 */
export function shouldPromptModeSwitch(
  recommendation: ModeRecommendation,
  lastPromptDate?: number
): boolean {
  // Don't prompt if low confidence
  if (recommendation.confidence === 'low') {
    return false;
  }

  // Don't prompt if not recommended to switch
  if (!recommendation.shouldSwitch) {
    return false;
  }

  // Don't prompt more than once per week
  if (lastPromptDate) {
    const daysSinceLastPrompt = (Date.now() - lastPromptDate) / (1000 * 60 * 60 * 24);
    if (daysSinceLastPrompt < 7) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

/**
 * Initialize empty analytics object
 */
export function createEmptyAnalytics(): ModeAnalytics {
  return {
    studentMode: {
      timeSpent: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      avgQuizScore: 0,
      totalXPEarned: 0,
    },
    cpaMode: {
      timeSpent: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      avgQuizScore: 0,
      totalXPEarned: 0,
    },
    preferredMode: 'student',
    switchCount: 0,
  };
}

/**
 * Update analytics when completing a lesson
 */
export function updateAnalyticsOnLessonComplete(
  analytics: ModeAnalytics,
  mode: LearningMode,
  timeSpent: number
): ModeAnalytics {
  const modeKey = mode === 'student' ? 'studentMode' : 'cpaMode';

  return {
    ...analytics,
    [modeKey]: {
      ...analytics[modeKey],
      lessonsCompleted: analytics[modeKey].lessonsCompleted + 1,
      timeSpent: analytics[modeKey].timeSpent + timeSpent,
    },
  };
}

/**
 * Update analytics when completing a quiz
 */
export function updateAnalyticsOnQuizComplete(
  analytics: ModeAnalytics,
  mode: LearningMode,
  score: number,
  timeSpent: number,
  xpEarned: number
): ModeAnalytics {
  const modeKey = mode === 'student' ? 'studentMode' : 'cpaMode';
  const modeStats = analytics[modeKey];

  // Calculate new average score
  const totalQuizzes = modeStats.quizzesCompleted + 1;
  const newAvgScore =
    (modeStats.avgQuizScore * modeStats.quizzesCompleted + score) / totalQuizzes;

  return {
    ...analytics,
    [modeKey]: {
      ...modeStats,
      quizzesCompleted: totalQuizzes,
      avgQuizScore: newAvgScore,
      timeSpent: modeStats.timeSpent + timeSpent,
      totalXPEarned: modeStats.totalXPEarned + xpEarned,
    },
  };
}

/**
 * Determine preferred mode based on usage
 */
export function calculatePreferredMode(analytics: ModeAnalytics): LearningMode {
  const studentTime = analytics.studentMode.timeSpent;
  const cpaTime = analytics.cpaMode.timeSpent;

  // Prefer mode with more time spent
  return studentTime >= cpaTime ? 'student' : 'cpa';
}

// ============================================================================
// QUIZ CONFIGURATION ADAPTERS
// ============================================================================

/**
 * Adapt quiz configuration based on learning mode
 */
export function adaptQuizConfigForMode(
  mode: LearningMode,
  baseConfig: any = {}
): any {
  const modeConfig = getModeConfig(mode);

  if (mode === 'student') {
    return {
      ...baseConfig,
      mode: 'practice',
      showHints: true,
      allowSkip: true,
      allowReview: true,
      showExplanations: true,
      timeLimit: undefined, // No time limit
      shuffleOptions: true,
    };
  } else {
    return {
      ...baseConfig,
      mode: 'cpa-exam',
      showHints: false,
      allowSkip: false,
      allowReview: true,
      showExplanations: false, // Only show at end
      timeLimit: baseConfig.timeLimit || 3600, // Default 1 hour
      shuffleOptions: true,
    };
  }
}

/**
 * Calculate time limit for a question based on mode and difficulty
 */
export function getQuestionTimeLimit(
  mode: LearningMode,
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
): number | undefined {
  if (mode === 'student') {
    return undefined; // No time limit in Study Mode
  }

  // Exam Mode time limits (in seconds)
  const timeLimits = {
    easy: 60,
    medium: 90,
    hard: 120,
    expert: 180,
  };

  return timeLimits[difficulty];
}

// ============================================================================
// LESSON CONTENT ADAPTERS
// ============================================================================

/**
 * Get appropriate lesson content based on mode
 * In Exam Mode, return summary; in Study Mode, return full content
 */
export function getLessonContentForMode(
  mode: LearningMode,
  fullContent: string,
  summaryContent?: string
): string {
  if (mode === 'cpa' && summaryContent) {
    return summaryContent;
  }
  return fullContent;
}

/**
 * Generate summary content from full content (if not provided)
 * This is a simple implementation - could be enhanced with AI/NLP
 */
export function generateSummaryContent(fullContent: string): string {
  // Split into sections
  const sections = fullContent.split('\n\n');

  // Take first paragraph and key points
  const summary = sections
    .slice(0, 3)
    .map(section => {
      // Truncate long sections
      if (section.length > 200) {
        return section.substring(0, 200) + '...';
      }
      return section;
    })
    .join('\n\n');

  return summary + '\n\n📝 Switch to Study Mode for full lesson content.';
}

/**
 * Check if content should be unlocked based on mode
 */
export function isContentUnlocked(
  mode: LearningMode,
  contentId: string,
  completedContent: string[]
): boolean {
  // In Exam Mode, all content is unlocked
  if (mode === 'cpa') {
    return true;
  }

  // In Study Mode, check sequential unlock
  // Extract order from contentId (e.g., "m1:w1" -> order 1)
  const match = contentId.match(/m(\d+):w(\d+)/);
  if (!match) return true;

  const monthNum = parseInt(match[1], 10);
  const weekNum = parseInt(match[2], 10);

  // First lesson is always unlocked
  if (monthNum === 1 && weekNum === 1) {
    return true;
  }

  // Check if previous lesson is completed
  let previousId: string;
  if (weekNum === 1) {
    // First week of month - check last week of previous month
    previousId = `m${monthNum - 1}:w4`;
  } else {
    // Check previous week
    previousId = `m${monthNum}:w${weekNum - 1}`;
  }

  return completedContent.includes(previousId);
}

// ============================================================================
// UI HELPERS
// ============================================================================

/**
 * Get daily goals adjusted for mode
 */
export function getDailyGoalsForMode(mode: LearningMode) {
  const config = getModeConfig(mode);
  return {
    xpGoal: config.pacing.dailyXPGoal,
    lessonsGoal: config.pacing.dailyLessonsGoal,
    quizzesGoal: config.pacing.dailyQuizzesGoal,
  };
}

/**
 * Get color scheme for mode
 */
export function getModeColorScheme(mode: LearningMode) {
  return mode === 'student'
    ? {
        primary: 'blue',
        accent: 'purple',
        gradient: 'from-blue-500 to-purple-600',
      }
    : {
        primary: 'red',
        accent: 'orange',
        gradient: 'from-red-500 to-orange-600',
      };
}

/**
 * Format mode switch confirmation message
 */
export function getModeSwitchConfirmationMessage(
  currentMode: LearningMode,
  targetMode: LearningMode
): {
  title: string;
  description: string;
  bullets: string[];
  warning?: string;
} {
  if (targetMode === 'cpa') {
    return {
      title: 'Switch to Exam Mode?',
      description:
        'You are about to switch to Exam Mode. This mode is designed for intensive exam preparation.',
      bullets: [
        'All content will be unlocked immediately',
        'Hints will be disabled in quizzes',
        'Time limits will be enforced',
        'Focus on fast-paced review and exam simulation',
        'Limited to 3 retakes per quiz',
      ],
      warning:
        'This mode is recommended for those with accounting knowledge who want faster exam-style practice.',
    };
  } else {
    return {
      title: 'Switch to Study Mode?',
      description:
        'You are about to switch to Study Mode. This mode is designed for learning fundamentals.',
      bullets: [
        'Content will unlock sequentially',
        'Hints will be available in quizzes',
        'Unlimited quiz retakes allowed',
        'Focus on building strong foundations',
        'Detailed explanations and guidance',
      ],
      warning:
        'This mode is recommended for beginners or those who want a thorough understanding of accounting.',
    };
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate if mode switch is allowed
 */
export function canSwitchMode(
  currentMode: LearningMode,
  targetMode: LearningMode,
  userProgress: { completedQuizzes: string[] }
): { allowed: boolean; reason?: string } {
  // Always allow switch if no progress
  if (userProgress.completedQuizzes.length === 0) {
    return { allowed: true };
  }

  // Always allow switch
  return { allowed: true };
}

/**
 * Get mode badge configuration
 */
export function getModeBadgeConfig(mode: LearningMode) {
  const config = getModeConfig(mode);
  return {
    label: config.label,
    icon: config.icon,
    variant: mode === 'student' ? 'default' : 'secondary',
    className: mode === 'student'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  };
}
