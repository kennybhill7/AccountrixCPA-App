import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProgress, QuizResult, AttemptEvent, AttemptTrack, AttemptSource } from "./types";
import type { ErrorCategory } from "./errorClassify";
import { newItem, review, isDue, type SrsItem, type Quality } from "./spacedRepetition";
import type {
  LearningMode,
  LearningModeConfig,
  ModeSwitchHistoryEntry,
  ModeAnalytics,
} from "@/types/learning-mode";
import {
  STUDENT_MODE_CONFIG,
  getModeConfig,
  createEmptyAnalytics,
  updateAnalyticsOnLessonComplete,
  updateAnalyticsOnQuizComplete,
  calculatePreferredMode,
} from "./learning-mode";

// Achievement types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

// Daily goal types
export interface DailyGoal {
  date: string; // YYYY-MM-DD format
  xpGoal: number;
  xpEarned: number;
  lessonsGoal: number;
  lessonsCompleted: number;
  quizzesGoal: number;
  quizzesCompleted: number;
  completed: boolean;
}

interface UserProgressStore extends UserProgress {
  // Gamification data
  achievements: Achievement[];
  dailyGoals: DailyGoal[];
  lastActivityDate?: string;
  lastVisit?: Date;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  bookmarks?: Array<{ monthId: string; weekId: string; title: string; anchor?: string }>;

  // Learning Mode data
  learningMode: LearningMode;
  modeConfig: LearningModeConfig;
  modeSwitchHistory: ModeSwitchHistoryEntry[];
  modeAnalytics: ModeAnalytics;
  lastModeRecommendationDate?: number;

  // Actions
  addXP: (amount: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  completeQuiz: (monthId: string, weekId: string, score: number, totalQuestions: number) => void;
  completeLesson: (monthId: string, weekId: string) => void;
  toggleTheme: () => void;
  updateStreak: () => void;

  // Gamification actions
  checkDailyGoals: () => void;
  updateDailyProgress: (type: "lesson" | "quiz", xpGained?: number) => void;
  unlockAchievement: (achievementId: string) => void;
  initializeAchievements: () => void;

  // Bookmark actions
  addBookmark: (monthId: string, weekId: string, title: string, anchor?: string) => void;
  removeBookmark: (monthId: string, weekId: string) => void;
  getBookmarks: () => Array<{ monthId: string; weekId: string; title: string; anchor?: string }>;

  // Learning Mode actions
  switchLearningMode: (newMode: LearningMode, reason?: string) => void;
  getLearningMode: () => LearningMode;
  getModeConfig: () => LearningModeConfig;
  isFeatureEnabled: (feature: keyof LearningModeConfig["features"]) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateModeAnalytics: (type: "lesson" | "quiz", data: any) => void;

  // Computed values
  getXPLevel: () => number;
  getXPProgress: () => number;
  canTakeQuiz: () => boolean;
  isQuizCompleted: (monthId: string, weekId: string) => boolean;
  getQuizResult: (monthId: string, weekId: string) => QuizResult | undefined;
  getTodayGoals: () => DailyGoal | null;
  getStreakBonus: () => number;
  getUnlockedAchievements: () => Achievement[];
}

export const useUserProgress = create<UserProgressStore>()(
  persist(
    (set, get) => ({
      // Initial state
      xp: 0,
      hearts: 5,
      streak: 0,
      completedQuizzes: [],
      currentTheme: "light",

      // Gamification state
      achievements: [],
      dailyGoals: [],
      lastActivityDate: undefined,
      lastVisit: undefined,
      longestStreak: 0,
      totalLessonsCompleted: 0,
      totalQuizzesCompleted: 0,
      bookmarks: [],

      // Learning Mode state
      learningMode: "student",
      modeConfig: STUDENT_MODE_CONFIG,
      modeSwitchHistory: [],
      modeAnalytics: createEmptyAnalytics(),
      lastModeRecommendationDate: undefined,

      // Actions
      addXP: (amount: number) => {
        set((state) => ({
          xp: state.xp + amount,
        }));
      },

      loseHeart: () => {
        set((state) => ({
          hearts: Math.max(0, state.hearts - 1),
        }));
      },

      refillHearts: () => {
        set({ hearts: 5 });
      },

      incrementStreak: () => {
        set((state) => ({
          streak: state.streak + 1,
        }));
      },

      resetStreak: () => {
        set({ streak: 0 });
      },

      completeQuiz: (monthId: string, weekId: string, score: number, totalQuestions: number) => {
        const quizId = `${monthId}:${weekId}`;

        set((state) => {
          // Don't add duplicate completions
          if (state.completedQuizzes.includes(quizId)) {
            return state;
          }

          // Calculate XP based on score
          const percentage = score / totalQuestions;
          let xpGain = 0;

          if (percentage === 1.0) {
            xpGain = 50; // Perfect score
          } else if (percentage >= 0.8) {
            xpGain = 30; // Good score
          } else if (percentage >= 0.6) {
            xpGain = 20; // Passing score
          } else {
            xpGain = 10; // Participation points
          }

          return {
            completedQuizzes: [...state.completedQuizzes, quizId],
            xp: state.xp + xpGain,
            streak: percentage >= 0.6 ? state.streak + 1 : 0, // Maintain streak only if passing
          };
        });
      },

      toggleTheme: () => {
        set((state) => ({
          currentTheme: state.currentTheme === "light" ? "dark" : "light",
        }));
      },

      completeLesson: (monthId: string, weekId: string) => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();

        set((prevState) => ({
          totalLessonsCompleted: prevState.totalLessonsCompleted + 1,
          lastActivityDate: today,
          // Update mode analytics
          modeAnalytics: updateAnalyticsOnLessonComplete(
            prevState.modeAnalytics,
            prevState.learningMode,
            0 // TODO: Track actual time spent
          ),
        }));

        get().updateDailyProgress("lesson", 5); // 5 XP for completing lesson

        // Check and update achievements
        const currentState = get();
        const updates: Record<string, Partial<Achievement>> = {};

        currentState.achievements.forEach((achievement) => {
          if (achievement.unlockedAt) return; // Already unlocked

          let newProgress = achievement.progress;

          switch (achievement.id) {
            case "first-lesson":
              newProgress = Math.min(currentState.totalLessonsCompleted, 1);
              break;
            case "streak-warrior":
              newProgress = Math.min(currentState.streak, 7);
              break;
            case "xp-collector":
              newProgress = Math.min(currentState.xp, 1000);
              break;
            case "lesson-champion":
              newProgress = Math.min(currentState.totalLessonsCompleted, 10);
              break;
          }

          if (newProgress !== achievement.progress) {
            updates[achievement.id] = { ...achievement, progress: newProgress };

            if (newProgress >= achievement.maxProgress) {
              get().unlockAchievement(achievement.id);
            }
          }
        });

        if (Object.keys(updates).length > 0) {
          set((state) => ({
            achievements: state.achievements.map((achievement) => {
              const update = updates[achievement.id];
              return update ? { ...achievement, ...update } : achievement;
            }),
          }));
        }
      },

      initializeAchievements: () => {
        const defaultAchievements: Achievement[] = [
          {
            id: "first-lesson",
            title: "Getting Started",
            description: "Complete your first lesson",
            icon: "📚",
            progress: 0,
            maxProgress: 1,
          },
          {
            id: "quiz-master",
            title: "Quiz Master",
            description: "Score 100% on a quiz",
            icon: "🎯",
            progress: 0,
            maxProgress: 1,
          },
          {
            id: "streak-warrior",
            title: "Streak Warrior",
            description: "Maintain a 7-day streak",
            icon: "🔥",
            progress: 0,
            maxProgress: 7,
          },
          {
            id: "xp-collector",
            title: "XP Collector",
            description: "Earn 1000 XP",
            icon: "⭐",
            progress: 0,
            maxProgress: 1000,
          },
          {
            id: "lesson-champion",
            title: "Lesson Champion",
            description: "Complete 10 lessons",
            icon: "🏆",
            progress: 0,
            maxProgress: 10,
          },
        ];

        set((state) => ({
          achievements: state.achievements.length > 0 ? state.achievements : defaultAchievements,
        }));
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === achievementId
              ? { ...achievement, unlockedAt: Date.now() }
              : achievement
          ),
        }));
      },

      checkAchievements: () => {
        const state = get();
        const updates: Partial<Achievement>[] = [];

        state.achievements.forEach((achievement) => {
          if (achievement.unlockedAt) return; // Already unlocked

          let newProgress = achievement.progress;

          switch (achievement.id) {
            case "first-lesson":
              newProgress = Math.min(state.totalLessonsCompleted, 1);
              break;
            case "streak-warrior":
              newProgress = Math.min(state.streak, 7);
              break;
            case "xp-collector":
              newProgress = Math.min(state.xp, 1000);
              break;
            case "lesson-champion":
              newProgress = Math.min(state.totalLessonsCompleted, 10);
              break;
          }

          if (newProgress !== achievement.progress) {
            updates.push({ ...achievement, progress: newProgress });

            if (newProgress >= achievement.maxProgress) {
              get().unlockAchievement(achievement.id);
            }
          }
        });

        if (updates.length > 0) {
          set((state) => ({
            achievements: state.achievements.map((achievement) => {
              const update = updates.find((u) => u.id === achievement.id);
              return update ? { ...achievement, ...update } : achievement;
            }),
          }));
        }
      },

      checkDailyGoals: () => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();

        const todayGoals = state.dailyGoals.find((goal) => goal.date === today);

        if (!todayGoals) {
          const newGoal: DailyGoal = {
            date: today,
            xpGoal: 50,
            xpEarned: 0,
            lessonsGoal: 2,
            lessonsCompleted: 0,
            quizzesGoal: 1,
            quizzesCompleted: 0,
            completed: false,
          };

          set((state) => ({
            dailyGoals: [...state.dailyGoals, newGoal],
          }));
        }
      },

      updateDailyProgress: (type: "lesson" | "quiz", xpGained: number = 0) => {
        const today = new Date().toISOString().split("T")[0];
        get().checkDailyGoals();

        set((state) => ({
          dailyGoals: state.dailyGoals.map((goal) => {
            if (goal.date !== today) return goal;

            const updated = { ...goal };
            updated.xpEarned += xpGained;

            if (type === "lesson") {
              updated.lessonsCompleted += 1;
            } else if (type === "quiz") {
              updated.quizzesCompleted += 1;
            }

            updated.completed =
              updated.xpEarned >= updated.xpGoal &&
              updated.lessonsCompleted >= updated.lessonsGoal &&
              updated.quizzesCompleted >= updated.quizzesGoal;

            return updated;
          }),
        }));
      },

      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const lastVisit = get().lastVisit;

        if (lastVisit) {
          const lastVisitDate = new Date(lastVisit).toISOString().split("T")[0];
          const daysDiff = Math.floor(
            (new Date(today).getTime() - new Date(lastVisitDate).getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff === 1) {
            // Consecutive day - increment streak
            set((state) => ({
              streak: state.streak + 1,
              lastVisit: new Date(),
              longestStreak: Math.max(state.longestStreak, state.streak + 1),
            }));
          } else if (daysDiff > 1) {
            // Streak broken - reset to 1
            set({
              streak: 1,
              lastVisit: new Date(),
            });
          }
        } else {
          // First visit
          set({
            streak: 1,
            lastVisit: new Date(),
          });
        }
      },

      // Bookmark methods
      addBookmark: (monthId: string, weekId: string, title: string, anchor?: string) => {
        set((state) => {
          const existingBookmark = state.bookmarks?.find(
            (b) => b.monthId === monthId && b.weekId === weekId
          );

          if (existingBookmark) {
            return state; // Already bookmarked
          }

          return {
            bookmarks: [...(state.bookmarks || []), { monthId, weekId, title, anchor }],
          };
        });
      },

      removeBookmark: (monthId: string, weekId: string) => {
        set((state) => ({
          bookmarks: (state.bookmarks || []).filter(
            (b) => !(b.monthId === monthId && b.weekId === weekId)
          ),
        }));
      },

      getBookmarks: () => {
        return get().bookmarks || [];
      },

      // Computed values
      getXPLevel: () => {
        const { xp } = get();
        return Math.floor(xp / 100) + 1; // 100 XP per level
      },

      getXPProgress: () => {
        const { xp } = get();
        return xp % 100; // Progress within current level (0-99)
      },

      canTakeQuiz: () => {
        const { hearts } = get();
        return hearts > 0;
      },

      isQuizCompleted: (monthId: string, weekId: string) => {
        const { completedQuizzes } = get();
        return completedQuizzes.includes(`${monthId}:${weekId}`);
      },

      getQuizResult: (monthId: string, weekId: string) => {
        // Try to get result from useQuizResults store
        const quizResultsStore = useQuizResults.getState();
        const results = quizResultsStore.getResultsForWeek(monthId, weekId);

        if (results && results.length > 0) {
          // Return the most recent result
          return results[results.length - 1];
        }

        return undefined;
      },

      getTodayGoals: () => {
        const today = new Date().toISOString().split("T")[0];
        const { dailyGoals } = get();
        return dailyGoals.find((goal) => goal.date === today) || null;
      },

      getStreakBonus: () => {
        const { streak } = get();
        if (streak >= 30) return 3; // 3x multiplier for 30+ days
        if (streak >= 14) return 2; // 2x multiplier for 14+ days
        if (streak >= 7) return 1.5; // 1.5x multiplier for 7+ days
        return 1; // No bonus
      },

      getUnlockedAchievements: () => {
        const { achievements } = get();
        return achievements.filter((achievement) => achievement.unlockedAt);
      },

      // ========================================================================
      // LEARNING MODE ACTIONS
      // ========================================================================

      switchLearningMode: (newMode: LearningMode, reason?: string) => {
        const state = get();
        const previousMode = state.learningMode;

        // Don't switch if already in that mode
        if (previousMode === newMode) {
          return;
        }

        const historyEntry: ModeSwitchHistoryEntry = {
          from: previousMode,
          to: newMode,
          timestamp: Date.now(),
          reason,
        };

        set({
          learningMode: newMode,
          modeConfig: getModeConfig(newMode),
          modeSwitchHistory: [...state.modeSwitchHistory, historyEntry],
          modeAnalytics: {
            ...state.modeAnalytics,
            switchCount: state.modeAnalytics.switchCount + 1,
            preferredMode: calculatePreferredMode(state.modeAnalytics),
          },
        });

        // Persist to localStorage for quick access
        if (typeof window !== "undefined") {
          localStorage.setItem("learningMode", newMode);
        }
      },

      getLearningMode: () => {
        return get().learningMode;
      },

      getModeConfig: () => {
        return get().modeConfig;
      },

      isFeatureEnabled: (feature: keyof LearningModeConfig["features"]) => {
        const { modeConfig } = get();
        return modeConfig.features[feature];
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateModeAnalytics: (type: "lesson" | "quiz", data: any) => {
        const state = get();

        if (type === "quiz") {
          const { score, timeSpent, xpEarned } = data;
          set({
            modeAnalytics: updateAnalyticsOnQuizComplete(
              state.modeAnalytics,
              state.learningMode,
              score,
              timeSpent,
              xpEarned
            ),
          });
        } else if (type === "lesson") {
          const { timeSpent } = data;
          set({
            modeAnalytics: updateAnalyticsOnLessonComplete(
              state.modeAnalytics,
              state.learningMode,
              timeSpent
            ),
          });
        }
      },
    }),
    {
      name: "user-progress", // Storage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface QuizResultsStore {
  results: QuizResult[];
  addResult: (result: Omit<QuizResult, "completedAt">) => void;
  getResultsForWeek: (monthId: string, weekId: string) => QuizResult[];
  getBestScoreForWeek: (monthId: string, weekId: string) => number | null;
  getAllResults: () => QuizResult[];
  clearResults: () => void;
}

export const useQuizResults = create<QuizResultsStore>()(
  persist(
    (set, get) => ({
      results: [],

      addResult: (result) => {
        const newResult: QuizResult = {
          ...result,
          completedAt: Date.now(),
        };

        set((state) => ({
          results: [...state.results, newResult],
        }));
      },

      getResultsForWeek: (monthId: string, weekId: string) => {
        const { results } = get();
        return results.filter((r) => r.monthId === monthId && r.weekId === weekId);
      },

      getBestScoreForWeek: (monthId: string, weekId: string) => {
        const weekResults = get().getResultsForWeek(monthId, weekId);
        if (weekResults.length === 0) return null;

        return Math.max(...weekResults.map((r) => r.score));
      },

      getAllResults: () => {
        return get().results;
      },

      clearResults: () => {
        set({ results: [] });
      },
    }),
    {
      name: "quiz-results",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================================
// CPA progress store — kept SEPARATE from the CMA user-progress/quiz-results
// stores so CPA quiz completions never inflate CMA progress counts and never
// inject non-m{N} ids (e.g. "far-u1:w1") into CMA state, profile labels, or the
// m{N} id schema. Global XP/hearts remain shared (track-agnostic) via
// useUserProgress; only completion + per-week results are namespaced here.
// ============================================================================
interface CpaProgressStore {
  completedQuizzes: string[]; // `${unitId}:${weekId}`, e.g. "far-u1:w1"
  results: QuizResult[]; // QuizResult.monthId field holds the unitId here
  completeQuiz: (unitId: string, weekId: string, score: number, totalQuestions: number) => void;
  addResult: (result: Omit<QuizResult, "completedAt">) => void;
  getResultsForWeek: (unitId: string, weekId: string) => QuizResult[];
  isQuizCompleted: (unitId: string, weekId: string) => boolean;
}

export const useCpaProgress = create<CpaProgressStore>()(
  persist(
    (set, get) => ({
      completedQuizzes: [],
      results: [],

      completeQuiz: (unitId, weekId, score, totalQuestions) => {
        const quizId = `${unitId}:${weekId}`;
        // Mirror CMA completeQuiz: the one-time completion XP bonus is awarded ONLY
        // on the first completion. A retake must not re-award it (Codex b959add).
        if (get().completedQuizzes.includes(quizId)) {
          return;
        }
        // Global XP is track-agnostic — award it through the shared store, mirroring
        // the CMA completeQuiz XP curve, without touching CMA progress/completion state.
        const pct = totalQuestions > 0 ? score / totalQuestions : 0;
        const xpGain = pct === 1 ? 50 : pct >= 0.8 ? 30 : pct >= 0.6 ? 20 : 10;
        useUserProgress.getState().addXP(xpGain);
        set((state) => ({ completedQuizzes: [...state.completedQuizzes, quizId] }));
      },

      addResult: (result) => {
        set((state) => ({
          results: [...state.results, { ...result, completedAt: Date.now() }],
        }));
      },

      getResultsForWeek: (unitId, weekId) =>
        get().results.filter((r) => r.monthId === unitId && r.weekId === weekId),

      isQuizCompleted: (unitId, weekId) => get().completedQuizzes.includes(`${unitId}:${weekId}`),
    }),
    {
      name: "cpa-progress",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================================
// Finance progress store — kept separate from CMA and CPA so finance-u{N}:w{N}
// completions never inflate CMA month progress or CPA lesson metrics. Global XP
// remains shared through useUserProgress.
// ============================================================================
interface FinanceProgressStore {
  completedQuizzes: string[];
  results: QuizResult[];
  completeQuiz: (unitId: string, weekId: string, score: number, totalQuestions: number) => void;
  addResult: (result: Omit<QuizResult, "completedAt">) => void;
  getResultsForWeek: (unitId: string, weekId: string) => QuizResult[];
  isQuizCompleted: (unitId: string, weekId: string) => boolean;
}

export const useFinanceProgress = create<FinanceProgressStore>()(
  persist(
    (set, get) => ({
      completedQuizzes: [],
      results: [],

      completeQuiz: (unitId, weekId, score, totalQuestions) => {
        const quizId = `${unitId}:${weekId}`;
        if (get().completedQuizzes.includes(quizId)) {
          return;
        }

        const pct = totalQuestions > 0 ? score / totalQuestions : 0;
        const xpGain = pct === 1 ? 50 : pct >= 0.8 ? 30 : pct >= 0.6 ? 20 : 10;
        useUserProgress.getState().addXP(xpGain);
        set((state) => ({ completedQuizzes: [...state.completedQuizzes, quizId] }));
      },

      addResult: (result) => {
        set((state) => ({
          results: [...state.results, { ...result, completedAt: Date.now() }],
        }));
      },

      getResultsForWeek: (unitId, weekId) =>
        get().results.filter((r) => r.monthId === unitId && r.weekId === weekId),

      isQuizCompleted: (unitId, weekId) =>
        get().completedQuizzes.includes(`${unitId}:${weekId}`),
    }),
    {
      name: "finance-progress",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================================
// Attempt Ledger store (FABLE5_ANALYSIS §4a) — the unified, persisted stream of
// AttemptEvents from every practice surface (quiz, workflow-task, flashcard,
// parametric). Readiness/SRS/error-pattern engines consume this via
// lib/attemptStats. Kept separate from the progress stores: those own
// XP/completion; this owns raw evidence.
// ============================================================================

/** Soft cap on persisted events (localStorage budget). */
const ATTEMPT_EVENT_CAP = 20_000;
/** How many oldest events to shed once the cap is exceeded. */
const ATTEMPT_EVENT_SHED = 2_000;

function newAttemptId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface AttemptsStore {
  events: AttemptEvent[];
  /** Append an event (id/ts filled in) and return the new event's id. */
  record: (e: Omit<AttemptEvent, "id" | "ts"> & { ts?: number }) => string;
  /** Post-hoc "why did I miss it?" tag on a recorded event. */
  setErrorCategory: (id: string, category: ErrorCategory) => void;
  /** Post-hoc one-tap self-reported confidence (0 low / 1 med / 2 high). */
  setConfidence: (id: string, confidence: 0 | 1 | 2) => void;
  clear: () => void;
  getBySkill: (skill: string) => AttemptEvent[];
  getByTrack: (track: AttemptTrack) => AttemptEvent[];
  /** The n most recent events by ts (newest first). */
  getRecent: (n: number) => AttemptEvent[];
}

export const useAttempts = create<AttemptsStore>()(
  persist(
    (set, get) => ({
      events: [],

      record: (e) => {
        const id = newAttemptId();
        const event: AttemptEvent = { ...e, id, ts: e.ts ?? Date.now() };
        set((state) => {
          let events = [...state.events, event];
          // Soft cap: keep localStorage bounded by shedding the oldest slice.
          if (events.length > ATTEMPT_EVENT_CAP) {
            events = events.slice(ATTEMPT_EVENT_SHED);
          }
          return { events };
        });
        return id;
      },

      setErrorCategory: (id, category) => {
        set((state) => ({
          events: state.events.map((ev) => (ev.id === id ? { ...ev, errorCategory: category } : ev)),
        }));
      },

      setConfidence: (id, confidence) => {
        set((state) => ({
          events: state.events.map((ev) => (ev.id === id ? { ...ev, confidence } : ev)),
        }));
      },

      clear: () => set({ events: [] }),

      getBySkill: (skill) => get().events.filter((ev) => ev.skills.includes(skill)),

      getByTrack: (track) => get().events.filter((ev) => ev.track === track),

      getRecent: (n) => [...get().events].sort((a, b) => b.ts - a.ts).slice(0, Math.max(0, n)),
    }),
    {
      name: "attempt-ledger",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ============================================================================
// SRS queue store (FABLE5_ANALYSIS §5 Week 3) — persisted spaced-repetition
// queue of missed items, scheduled by lib/spacedRepetition (SM-2). Each entry
// carries routing metadata (label/href) so review surfaces (/mission, /profile)
// can send the learner straight back to the source quiz/workflow.
// ============================================================================

export type SrsQueueItem = SrsItem & {
  skills: string[];
  track: AttemptTrack;
  source: AttemptSource;
  /** human label for review surfaces, e.g. "CMA m4-w1 Q3 — wip-schedule" */
  label: string;
  /** where "study this again" routes, e.g. "/learn/m4/w1/quiz" */
  href: string;
};

export interface SrsMissMeta {
  itemId: string;
  skills: string[];
  track: AttemptTrack;
  source: AttemptSource;
  label: string;
  href: string;
}

interface SrsStore {
  items: Record<string, SrsQueueItem>;
  /**
   * Seed/refresh the queue from a wrong answer. New items enter due today;
   * an item missed again is treated as a failed review (quality 0 → relearn).
   */
  upsertMiss: (meta: SrsMissMeta, nowDay: number) => void;
  /** Apply an explicit review outcome (SM-2 quality 0–5). No-op if unknown id. */
  reviewItem: (itemId: string, quality: Quality, nowDay: number) => void;
  dueCount: (nowDay: number) => number;
  /** Items due on/before nowDay, most overdue first, up to `limit`. */
  due: (nowDay: number, limit?: number) => SrsQueueItem[];
  clear: () => void;
}

export const useSrs = create<SrsStore>()(
  persist(
    (set, get) => ({
      items: {},

      upsertMiss: (meta, nowDay) => {
        set((state) => {
          const existing = state.items[meta.itemId];
          const scheduled = existing ? review(existing, 0, nowDay) : newItem(meta.itemId, nowDay);
          return {
            items: {
              ...state.items,
              [meta.itemId]: {
                ...scheduled,
                skills: meta.skills,
                track: meta.track,
                source: meta.source,
                label: meta.label,
                href: meta.href,
              },
            },
          };
        });
      },

      reviewItem: (itemId, quality, nowDay) => {
        set((state) => {
          const existing = state.items[itemId];
          if (!existing) return state;
          const scheduled = review(existing, quality, nowDay);
          return { items: { ...state.items, [itemId]: { ...existing, ...scheduled } } };
        });
      },

      dueCount: (nowDay) => Object.values(get().items).filter((i) => isDue(i, nowDay)).length,

      due: (nowDay, limit = Infinity) => {
        const dueList = Object.values(get().items)
          .filter((i) => isDue(i, nowDay))
          .sort((a, b) => a.dueDay - b.dueDay || a.id.localeCompare(b.id));
        return Number.isFinite(limit) ? dueList.slice(0, Math.max(0, limit)) : dueList;
      },

      clear: () => set({ items: {} }),
    }),
    {
      name: "srs-queue",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Study session store for flashcards
interface StudySessionStore {
  currentDeck: string | null;
  currentCardIndex: number;
  sessionScore: { correct: number; total: number };
  studyMode: "flashcards" | "quiz" | null;

  startFlashcardSession: (deckName: string) => void;
  nextCard: () => void;
  recordAnswer: (correct: boolean) => void;
  endSession: () => void;
  resetSession: () => void;
}

export const useStudySession = create<StudySessionStore>((set) => ({
  currentDeck: null,
  currentCardIndex: 0,
  sessionScore: { correct: 0, total: 0 },
  studyMode: null,

  startFlashcardSession: (deckName: string) => {
    set({
      currentDeck: deckName,
      currentCardIndex: 0,
      sessionScore: { correct: 0, total: 0 },
      studyMode: "flashcards",
    });
  },

  nextCard: () => {
    set((state) => ({
      currentCardIndex: state.currentCardIndex + 1,
    }));
  },

  recordAnswer: (correct: boolean) => {
    set((state) => ({
      sessionScore: {
        correct: state.sessionScore.correct + (correct ? 1 : 0),
        total: state.sessionScore.total + 1,
      },
    }));
  },

  endSession: () => {
    set({
      currentDeck: null,
      currentCardIndex: 0,
      studyMode: null,
    });
  },

  resetSession: () => {
    set({
      currentCardIndex: 0,
      sessionScore: { correct: 0, total: 0 },
    });
  },
}));

// Search store
interface SearchStore {
  query: string;
  isSearching: boolean;
  results: {
    months: Array<{ monthId: string; title: string; relevance: number }>;
    weeks: Array<{ monthId: string; weekId: string; title: string; relevance: number }>;
  };

  setQuery: (query: string) => void;
  setSearching: (searching: boolean) => void;
  setResults: (results: SearchStore["results"]) => void;
  clearSearch: () => void;
}

export const useSearch = create<SearchStore>((set) => ({
  query: "",
  isSearching: false,
  results: { months: [], weeks: [] },

  setQuery: (query: string) => {
    set({ query });
  },

  setSearching: (searching: boolean) => {
    set({ isSearching: searching });
  },

  setResults: (results) => {
    set({ results });
  },

  clearSearch: () => {
    set({
      query: "",
      results: { months: [], weeks: [] },
      isSearching: false,
    });
  },
}));

// Alias for backward compatibility
export const useAppStore = useUserProgress;
