// Core data types for the Construction CFO Learning App

import type { ErrorCategory } from "./errorClassify";

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  q: string;
  choices: string[];
  answer: number;
  explain?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Week {
  id: string;           // w1, w2, w3, w4
  order: number;        // 1, 2, 3, 4
  title: string;
  lessonHtml: string;   // sanitized HTML content
  flashcards: Flashcard[];
  quiz: Quiz;
  /**
   * Skill tags from docs/SKILL_TAXONOMY.md. Present on ISC/TCP CPA weeks and
   * all Finance weeks; CMA weeks get them merged from the
   * data/curriculum/cma-skills.json sidecar by the week API route.
   */
  skills?: string[];
}

export interface Month {
  id: string;
  title: string;
  description?: string;
  weeks: Week[];
}

export interface Curriculum {
  [monthId: string]: Month;  // m1 through m12
}

// UI State types
export interface UserProgress {
  xp: number;
  hearts: number;
  streak: number;
  completedQuizzes: string[]; // monthId:weekId format
  currentTheme: 'light' | 'dark';
}

export interface QuizResult {
  monthId: string;
  weekId: string;
  score: number;
  totalQuestions: number;
  completedAt: number;
}

// ============================================================================
// Attempt Ledger (FABLE5_ANALYSIS §4a) — one persisted event per answered
// thing, across every practice surface. This is the substrate the readiness,
// SRS, and error-pattern engines consume.
// ============================================================================

export type AttemptSource = "quiz" | "workflow-task" | "flashcard" | "parametric";

export type AttemptTrack = "cma" | "cpa" | "finance" | "apply";

export interface AttemptEvent {
  /** unique id (crypto.randomUUID where available) */
  id: string;
  source: AttemptSource;
  /** e.g. "cma:m4:w1:q3", "mbg:wip-schedule:t2" */
  itemId: string;
  track: AttemptTrack;
  /** skill tags from item tags, week tags, or the cma-skills sidecar */
  skills: string[];
  correct: boolean;
  /** what the learner entered/selected (choice index, numeric input, ...) */
  answer: unknown;
  /** one-tap self-report: 0 = low, 1 = med, 2 = high */
  confidence?: 0 | 1 | 2;
  timeSec?: number;
  /** why the miss happened (lib/errorClassify) — captured post-hoc on wrong answers */
  errorCategory?: ErrorCategory;
  /** epoch ms */
  ts: number;
}