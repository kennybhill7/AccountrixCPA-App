// Learning Mode Types for Student vs CPA Review Mode System

export type LearningMode = 'student' | 'cpa';

/**
 * Mode Feature Configuration
 * Defines what features are enabled/disabled in each mode
 */
export interface LearningModeFeatures {
  sequentialUnlock: boolean;        // Must complete lessons in order
  hintsEnabled: boolean;            // Show hints in quizzes
  timeLimitsRequired: boolean;      // Enforce time limits on quizzes
  unlimitedRetakes: boolean;        // Allow unlimited quiz retakes
  detailedExplanations: boolean;    // Show detailed vs brief explanations
  heartsSystem: boolean;            // Use hearts/lives system
  skipAllowed: boolean;             // Can skip difficult questions
  fullLessonContent: boolean;       // Show full vs summary content
}

/**
 * Pacing Configuration
 * Recommended pace and completion timeline
 */
export interface LearningModePacing {
  recommendedWeeksPerMonth: number;
  estimatedCompletion: string;
  dailyLessonsGoal: number;
  dailyQuizzesGoal: number;
  dailyXPGoal: number;
}

/**
 * UI Behavior Configuration
 * Controls UI elements and guidance level
 */
export interface LearningModeUI {
  showTooltips: boolean;            // Educational tooltips
  showGuidance: boolean;            // Step-by-step guidance
  emphasizeMode: 'practice' | 'test'; // Practice vs test focus
  showProgressCelebrations: boolean; // Animations and encouragement
  showMascot: boolean;              // Mascot appears with tips
  showRecommendedPath: boolean;     // Highlight suggested next steps
  showPerformanceGraphs: boolean;   // Emphasize performance metrics
  showWeakAreas: boolean;           // Identify areas needing improvement
}

/**
 * Content Configuration
 * How content is presented in each mode
 */
export interface LearningModeContent {
  lessonWordCountTarget: number;    // Target word count for lessons
  explanationDepth: 'brief' | 'detailed' | 'comprehensive';
  exampleCount: 'minimal' | 'moderate' | 'extensive';
  showWhyExplanations: boolean;     // Show "Why?" tooltips
  showResourceLinks: boolean;        // External learning resources
  quizRetakeLimit: number | 'unlimited';
}

/**
 * Complete Learning Mode Configuration
 */
export interface LearningModeConfig {
  mode: LearningMode;
  label: string;
  icon: string;
  description: string;
  bestFor: string;
  features: LearningModeFeatures;
  pacing: LearningModePacing;
  ui: LearningModeUI;
  content: LearningModeContent;
}

/**
 * Mode Switch History Entry
 */
export interface ModeSwitchHistoryEntry {
  from: LearningMode;
  to: LearningMode;
  timestamp: number;
  reason?: string;
}

/**
 * Mode Comparison Feature
 * Used for displaying comparison table
 */
export interface ModeComparisonFeature {
  feature: string;
  category: 'content' | 'quizzes' | 'pacing' | 'support' | 'features';
  studentMode: string | boolean;
  cpaMode: string | boolean;
  icon?: string;
}

/**
 * Mode Analytics
 * Track performance and usage by mode
 */
export interface ModeAnalytics {
  studentMode: {
    timeSpent: number;            // Total seconds
    lessonsCompleted: number;
    quizzesCompleted: number;
    avgQuizScore: number;
    totalXPEarned: number;
  };
  cpaMode: {
    timeSpent: number;
    lessonsCompleted: number;
    quizzesCompleted: number;
    avgQuizScore: number;
    totalXPEarned: number;
  };
  preferredMode: LearningMode;
  switchCount: number;
  lastSwitchDate?: number;
}

/**
 * Mode Recommendation
 * System recommendation for which mode to use
 */
export interface ModeRecommendation {
  recommendedMode: LearningMode;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
  shouldSwitch: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Student Mode Configuration (Default)
 * Focus: Learning fundamentals, building confidence
 */
export const STUDENT_MODE_CONFIG: LearningModeConfig = {
  mode: 'student',
  label: 'Student Mode',
  icon: '🎓',
  description: 'Perfect for beginners and those learning accounting fundamentals',
  bestFor: 'New learners, career changers, students',

  features: {
    sequentialUnlock: true,
    hintsEnabled: true,
    timeLimitsRequired: false,
    unlimitedRetakes: true,
    detailedExplanations: true,
    heartsSystem: true,
    skipAllowed: true,
    fullLessonContent: true,
  },

  pacing: {
    recommendedWeeksPerMonth: 4,
    estimatedCompletion: '6 months',
    dailyLessonsGoal: 1,
    dailyQuizzesGoal: 1,
    dailyXPGoal: 50,
  },

  ui: {
    showTooltips: true,
    showGuidance: true,
    emphasizeMode: 'practice',
    showProgressCelebrations: true,
    showMascot: true,
    showRecommendedPath: true,
    showPerformanceGraphs: false,
    showWeakAreas: false,
  },

  content: {
    lessonWordCountTarget: 2000,
    explanationDepth: 'comprehensive',
    exampleCount: 'extensive',
    showWhyExplanations: true,
    showResourceLinks: true,
    quizRetakeLimit: 'unlimited',
  },
};

/**
 * CPA Review Mode Configuration
 * Focus: Fast-paced exam preparation, performance optimization
 */
export const CPA_MODE_CONFIG: LearningModeConfig = {
  mode: 'cpa',
  label: 'CPA Review Mode',
  icon: '📚',
  description: 'Intensive review for CPA exam preparation with exam simulation',
  bestFor: 'CPA candidates, experienced accountants, quick review',

  features: {
    sequentialUnlock: false,
    hintsEnabled: false,
    timeLimitsRequired: true,
    unlimitedRetakes: false,
    detailedExplanations: false,
    heartsSystem: false,
    skipAllowed: false,
    fullLessonContent: false,
  },

  pacing: {
    recommendedWeeksPerMonth: 8,
    estimatedCompletion: '2-3 months',
    dailyLessonsGoal: 2,
    dailyQuizzesGoal: 3,
    dailyXPGoal: 150,
  },

  ui: {
    showTooltips: false,
    showGuidance: false,
    emphasizeMode: 'test',
    showProgressCelebrations: false,
    showMascot: false,
    showRecommendedPath: false,
    showPerformanceGraphs: true,
    showWeakAreas: true,
  },

  content: {
    lessonWordCountTarget: 500,
    explanationDepth: 'brief',
    exampleCount: 'minimal',
    showWhyExplanations: false,
    showResourceLinks: false,
    quizRetakeLimit: 3,
  },
};

/**
 * Mode Comparison Data
 * Used for side-by-side comparison in UI
 */
export const MODE_COMPARISON: ModeComparisonFeature[] = [
  {
    feature: 'Content Unlock',
    category: 'content',
    studentMode: 'Sequential',
    cpaMode: 'All Unlocked',
    icon: '🔓',
  },
  {
    feature: 'Lesson Length',
    category: 'content',
    studentMode: 'Full (2000+ words)',
    cpaMode: 'Summary (500 words)',
    icon: '📄',
  },
  {
    feature: 'Hints Available',
    category: 'quizzes',
    studentMode: true,
    cpaMode: false,
    icon: '💡',
  },
  {
    feature: 'Time Limits',
    category: 'quizzes',
    studentMode: 'Optional',
    cpaMode: 'Required',
    icon: '⏱️',
  },
  {
    feature: 'Quiz Retakes',
    category: 'quizzes',
    studentMode: 'Unlimited',
    cpaMode: 'Limited (3 max)',
    icon: '🔄',
  },
  {
    feature: 'Explanations',
    category: 'quizzes',
    studentMode: 'Detailed',
    cpaMode: 'Brief',
    icon: '📝',
  },
  {
    feature: 'Progress Pace',
    category: 'pacing',
    studentMode: '6 months',
    cpaMode: '2-3 months',
    icon: '🚀',
  },
  {
    feature: 'Hearts System',
    category: 'features',
    studentMode: true,
    cpaMode: false,
    icon: '❤️',
  },
  {
    feature: 'Skip Questions',
    category: 'quizzes',
    studentMode: 'Allowed',
    cpaMode: 'Not Allowed',
    icon: '⏭️',
  },
  {
    feature: 'Guidance Level',
    category: 'support',
    studentMode: 'High',
    cpaMode: 'Minimal',
    icon: '🧭',
  },
  {
    feature: 'Tooltips & Tips',
    category: 'support',
    studentMode: 'Extensive',
    cpaMode: 'None',
    icon: '💬',
  },
  {
    feature: 'Best For',
    category: 'features',
    studentMode: 'Beginners',
    cpaMode: 'Review/CPA Prep',
    icon: '🎯',
  },
];

/**
 * Mode Switch Reasons
 * Predefined reasons for switching modes
 */
export const MODE_SWITCH_REASONS = {
  studentToCPA: [
    'Ready for faster pace',
    'Need CPA exam preparation',
    'Already have accounting knowledge',
    'Want to challenge myself',
  ],
  cpaToStudent: [
    'Need more detailed explanations',
    'Want to slow down and learn fundamentals',
    'Finding CPA mode too challenging',
    'Prefer guided learning approach',
  ],
};

/**
 * Mode Feature Keys
 * Type-safe feature keys for checking
 */
export type ModeFeatureKey = keyof LearningModeFeatures;
export type ModeUIKey = keyof LearningModeUI;
export type ModeContentKey = keyof LearningModeContent;
