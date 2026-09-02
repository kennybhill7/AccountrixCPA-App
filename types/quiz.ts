// Enhanced Quiz Types for Accounting Education Platform

export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'multiple-select'
  | 'fill-blank'
  | 'matching'
  | 'scenario';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type QuizMode = 'practice' | 'test' | 'cpa-exam';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  scenario?: string; // For scenario-based questions
  options?: string[]; // For MC, T/F, Multiple Select
  correctAnswer?: string | string[] | number; // Single, multiple, or numeric
  explanation: string; // Why this is the correct answer
  incorrectExplanation?: string; // Additional help when wrong
  difficulty: QuestionDifficulty;
  topic: string; // "Journal Entries", "Trial Balance", etc.
  points: number; // 1 for easy, 2 for medium, 3 for hard, 5 for expert
  timeLimit?: number; // Optional time limit in seconds
  hints?: string[]; // 1-3 hints
  references?: string[]; // "ASC 606-10-25-1", "GAAP Section 2.4"

  // For matching questions
  matchPairs?: Array<{ term: string; definition: string }>;

  // For fill-blank questions
  tolerance?: number; // Acceptable variance for numeric answers
  unit?: string; // e.g., "$", "%", etc.
}

export interface QuizConfig {
  id: string;
  title: string;
  description?: string;
  mode: QuizMode;
  timeLimit?: number; // Total quiz time limit in seconds
  passingScore: number; // Percentage (0-100)
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showHints?: boolean;
  allowSkip?: boolean;
  allowReview?: boolean;
  showExplanations?: boolean; // During quiz or only at end
  questionsPerAttempt?: number; // Subset of questions from bank
}

export interface QuizAttempt {
  attemptId: string;
  quizId: string;
  monthId: string;
  weekId: string;
  startedAt: number;
  completedAt?: number;
  timeSpent: number; // in seconds
  mode: QuizMode;
  answers: QuizAnswer[];
  score: QuizScore;
  passed: boolean;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string | string[] | number | null;
  isCorrect: boolean;
  timeSpent: number; // seconds spent on this question
  hintsUsed: number;
  skipped: boolean;
  flaggedForReview: boolean;
}

export interface QuizScore {
  correct: number;
  total: number;
  percentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  totalPoints: number;
  earnedPoints: number;
  xpEarned: number;
  xpBonus: number;

  // Breakdown by topic
  byTopic: Record<string, { correct: number; total: number; percentage: number }>;

  // Breakdown by difficulty
  byDifficulty: Record<QuestionDifficulty, { correct: number; total: number; percentage: number }>;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, QuizAnswer>;
  startTime: number;
  timeElapsed: number;
  flaggedQuestions: Set<string>;
  completedQuestions: Set<string>;
  mode: QuizMode;
  paused: boolean;
}

export interface QuizReviewData {
  attempt: QuizAttempt;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  score: QuizScore;
  weakTopics: Array<{ topic: string; percentage: number }>;
  recommendations: string[];
}

// Grade calculation helper
export function calculateGrade(percentage: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

// XP calculation based on score
export function calculateXP(percentage: number, totalPoints: number): { base: number; bonus: number } {
  const baseXP = Math.round(totalPoints * 2); // 2 XP per point

  let bonus = 0;
  if (percentage === 100) {
    bonus = 100; // Perfect score bonus
  } else if (percentage >= 90) {
    bonus = 50; // Excellent bonus
  } else if (percentage >= 80) {
    bonus = 25; // Good bonus
  }

  return { base: baseXP, bonus };
}

// Points per difficulty
export const POINTS_BY_DIFFICULTY: Record<QuestionDifficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
  expert: 5,
};

// Time limits per difficulty (in seconds) for Exam Mode
export const TIME_LIMITS_BY_DIFFICULTY: Record<QuestionDifficulty, number> = {
  easy: 60,
  medium: 90,
  hard: 120,
  expert: 180,
};

export interface QuizStatistics {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  questionsAnswered: number;
  questionsCorrect: number;
  topicMastery: Record<string, number>; // topic -> mastery percentage
  difficultyMastery: Record<QuestionDifficulty, number>;
  averageTimePerQuestion: number;
  streakDays: number;
  lastAttemptDate: number;
}

// For localStorage persistence
export interface SavedQuizProgress {
  quizId: string;
  monthId: string;
  weekId: string;
  state: QuizState;
  questions: QuizQuestion[];
  savedAt: number;
}

// Enhanced quiz with full question bank
export interface EnhancedQuiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  config: QuizConfig;
  metadata: {
    createdAt: number;
    updatedAt: number;
    version: string;
    totalPoints: number;
    averageDifficulty: number;
    topics: string[];
  };
}
