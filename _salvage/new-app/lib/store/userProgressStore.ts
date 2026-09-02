import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Competency {
  name: string;
  score: number; // 0-100
  color: string;
  description: string;
}

export interface TopicMastery {
  topic: string;
  weeksTotal: number;
  weeksCompleted: number;
  avgQuizScore: number;
  practiceTasksCompleted: number;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface XPDataPoint {
  date: Date;
  xp: number;
  dailyGain: number;
}

export interface QuizScore {
  date: Date;
  score: number;
  quizName: string;
  topic: string;
}

export interface TimeSpent {
  topic: string;
  hours: number;
}

export interface WeakArea {
  topic: string;
  score: number;
  attempts: number;
  recommendations: string[];
}

export interface Activity {
  id: string;
  timestamp: Date;
  type: 'lesson' | 'quiz' | 'practice' | 'badge' | 'export';
  action: string;
  details: string;
  icon: string;
  color: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  criteria: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline?: Date;
  category: 'xp' | 'lessons' | 'quizzes' | 'badges' | 'custom';
}

export interface CertificateRequirement {
  task: string;
  completed: boolean;
  progress: number;
}

export interface Milestone {
  id: string;
  date: Date;
  type: 'lesson' | 'quiz' | 'badge' | 'exam' | 'certificate';
  title: string;
  description: string;
  icon: string;
}

export interface UserProgressState {
  // User Stats
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  practiceTasksCompleted: number;
  documentsExported: number;
  avgQuizScore: number;
  totalHoursStudied: number;
  overallCompletion: number;

  // Data arrays
  competencies: Competency[];
  topicMastery: TopicMastery[];
  xpHistory: XPDataPoint[];
  quizScores: QuizScore[];
  timeSpent: TimeSpent[];
  weakAreas: WeakArea[];
  activities: Activity[];
  badges: Badge[];
  goals: Goal[];
  certificateRequirements: CertificateRequirement[];
  milestones: Milestone[];

  // Actions
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string, topic: string) => void;
  completeQuiz: (quizName: string, score: number, topic: string) => void;
  completePracticeTask: (taskName: string, topic: string) => void;
  exportDocument: (documentType: string) => void;
  updateCompetency: (name: string, newScore: number) => void;
  unlockBadge: (badgeId: string) => void;
  updateGoal: (goalId: string, progress: number) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  updateStreak: () => void;
  spendHeart: () => void;
  restoreHeart: () => void;
  resetProgress: () => void;
}

// ============================================================================
// Initial Data
// ============================================================================

const INITIAL_COMPETENCIES: Competency[] = [
  {
    name: 'Journal Entries',
    score: 85,
    color: '#3b82f6',
    description: 'DR/CR mastery',
  },
  {
    name: 'Trial Balance',
    score: 78,
    color: '#10b981',
    description: 'Balance & adjustments',
  },
  {
    name: 'Bank Reconciliation',
    score: 92,
    color: '#8b5cf6',
    description: 'Reconciling accounts',
  },
  {
    name: 'WIP Calculations',
    score: 70,
    color: '#f59e0b',
    description: 'Revenue recognition',
  },
  {
    name: 'Chart of Accounts',
    score: 88,
    color: '#ef4444',
    description: 'COA design',
  },
  {
    name: 'Financial Statements',
    score: 82,
    color: '#06b6d4',
    description: 'P&L, BS, Cash Flow',
  },
  {
    name: 'Job Costing',
    score: 65,
    color: '#84cc16',
    description: 'Cost allocation',
  },
  {
    name: 'Consolidations',
    score: 58,
    color: '#f97316',
    description: 'Multi-entity',
  },
  {
    name: 'Payroll & Tax',
    score: 45,
    color: '#ec4899',
    description: 'Compliance',
  },
  {
    name: 'Month-End Close',
    score: 75,
    color: '#6366f1',
    description: 'Closing procedures',
  },
];

const INITIAL_TOPIC_MASTERY: TopicMastery[] = [
  {
    topic: 'Construction CFO',
    weeksTotal: 4,
    weeksCompleted: 4,
    avgQuizScore: 92,
    practiceTasksCompleted: 8,
    masteryLevel: 'advanced',
  },
  {
    topic: 'COA & Statements',
    weeksTotal: 5,
    weeksCompleted: 5,
    avgQuizScore: 88,
    practiceTasksCompleted: 7,
    masteryLevel: 'advanced',
  },
  {
    topic: 'Job Costing',
    weeksTotal: 6,
    weeksCompleted: 5,
    avgQuizScore: 80,
    practiceTasksCompleted: 5,
    masteryLevel: 'intermediate',
  },
  {
    topic: 'Multi-Entity',
    weeksTotal: 4,
    weeksCompleted: 2,
    avgQuizScore: 70,
    practiceTasksCompleted: 3,
    masteryLevel: 'beginner',
  },
  {
    topic: 'Payroll & Tax',
    weeksTotal: 3,
    weeksCompleted: 1,
    avgQuizScore: 65,
    practiceTasksCompleted: 2,
    masteryLevel: 'beginner',
  },
  {
    topic: 'Advanced Topics',
    weeksTotal: 2,
    weeksCompleted: 0,
    avgQuizScore: 0,
    practiceTasksCompleted: 0,
    masteryLevel: 'beginner',
  },
];

const INITIAL_BADGES: Badge[] = [
  {
    id: 'journal-master',
    name: 'Journal Master',
    description: 'Complete 100 journal entries',
    icon: '📖',
    unlockedAt: new Date('2025-09-15'),
    criteria: '100 journal entries',
  },
  {
    id: 'bank-rec-expert',
    name: 'Bank Rec Expert',
    description: 'Complete 50 bank reconciliations',
    icon: '🏦',
    unlockedAt: new Date('2025-09-20'),
    criteria: '50 bank reconciliations',
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score 90%+ on 10 quizzes',
    icon: '🎯',
    unlockedAt: new Date('2025-10-01'),
    criteria: '10 quizzes with 90%+',
  },
  {
    id: 'streak-warrior',
    name: '7-Day Streak',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    unlockedAt: new Date('2025-10-08'),
    criteria: '7-day study streak',
  },
  {
    id: 'wip-wizard',
    name: 'WIP Wizard',
    description: 'Master WIP calculations',
    icon: '🧙',
    unlockedAt: null,
    criteria: 'Complete WIP module with 85%+',
  },
  {
    id: 'consolidation-king',
    name: 'Consolidation King',
    description: 'Complete 10 multi-entity consolidations',
    icon: '👑',
    unlockedAt: null,
    criteria: '10 consolidations',
  },
];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'daily-xp',
    title: 'Earn 100 XP Today',
    target: 100,
    current: 85,
    category: 'xp',
  },
  {
    id: 'weekly-lessons',
    title: 'Complete 4 Lessons This Week',
    target: 4,
    current: 3,
    deadline: new Date('2025-10-19'),
    category: 'lessons',
  },
  {
    id: 'monthly-quizzes',
    title: 'Pass 8 Quizzes This Month',
    target: 8,
    current: 6,
    deadline: new Date('2025-10-31'),
    category: 'quizzes',
  },
];

const INITIAL_CERTIFICATE_REQUIREMENTS: CertificateRequirement[] = [
  { task: 'Complete all 24 weeks', completed: false, progress: 71 },
  { task: 'Average quiz score 80%+', completed: true, progress: 100 },
  { task: 'Pass CPA Final Exam (80%+)', completed: false, progress: 0 },
  { task: 'Complete 20 case studies', completed: true, progress: 100 },
  { task: 'Complete 3 month-end closes', completed: false, progress: 67 },
];

// ============================================================================
// Store
// ============================================================================

export const useUserProgressStore = create<UserProgressState>()(
  persist(
    (set, get) => ({
      // Initial Stats
      xp: 2450,
      level: 12,
      streak: 7,
      hearts: 3,
      maxHearts: 5,
      lessonsCompleted: 17,
      quizzesPassed: 13,
      practiceTasksCompleted: 25,
      documentsExported: 8,
      avgQuizScore: 84,
      totalHoursStudied: 48.5,
      overallCompletion: 71,

      // Initial Data
      competencies: INITIAL_COMPETENCIES,
      topicMastery: INITIAL_TOPIC_MASTERY,
      xpHistory: generateXPHistory(),
      quizScores: generateQuizHistory(),
      timeSpent: generateTimeSpent(),
      weakAreas: calculateWeakAreas(INITIAL_TOPIC_MASTERY, generateQuizHistory()),
      activities: generateRecentActivities(),
      badges: INITIAL_BADGES,
      goals: INITIAL_GOALS,
      certificateRequirements: INITIAL_CERTIFICATE_REQUIREMENTS,
      milestones: generateMilestones(),

      // Actions
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / 200) + 1;
          return { xp: newXP, level: newLevel };
        }),

      completeLesson: (lessonId, topic) =>
        set((state) => {
          const newActivities = [
            {
              id: `activity-${Date.now()}`,
              timestamp: new Date(),
              type: 'lesson' as const,
              action: `Completed lesson: ${lessonId}`,
              details: topic,
              icon: '📚',
              color: 'blue',
            },
            ...state.activities,
          ].slice(0, 50);

          return {
            lessonsCompleted: state.lessonsCompleted + 1,
            activities: newActivities,
            xp: state.xp + 50,
          };
        }),

      completeQuiz: (quizName, score, topic) =>
        set((state) => {
          const newQuizScore: QuizScore = {
            date: new Date(),
            score,
            quizName,
            topic,
          };

          const newActivities = [
            {
              id: `activity-${Date.now()}`,
              timestamp: new Date(),
              type: 'quiz' as const,
              action: `Scored ${score}% on ${quizName}`,
              details: topic,
              icon: '🎯',
              color: score >= 80 ? 'green' : 'yellow',
            },
            ...state.activities,
          ].slice(0, 50);

          const totalQuizzes = state.quizScores.length + 1;
          const totalScore =
            state.quizScores.reduce((sum, q) => sum + q.score, 0) + score;
          const newAvgScore = totalScore / totalQuizzes;

          return {
            quizScores: [...state.quizScores, newQuizScore],
            quizzesPassed: score >= 70 ? state.quizzesPassed + 1 : state.quizzesPassed,
            avgQuizScore: newAvgScore,
            activities: newActivities,
            xp: state.xp + (score >= 80 ? 100 : score >= 70 ? 75 : 50),
          };
        }),

      completePracticeTask: (taskName, topic) =>
        set((state) => {
          const newActivities = [
            {
              id: `activity-${Date.now()}`,
              timestamp: new Date(),
              type: 'practice' as const,
              action: `Completed: ${taskName}`,
              details: topic,
              icon: '💪',
              color: 'purple',
            },
            ...state.activities,
          ].slice(0, 50);

          return {
            practiceTasksCompleted: state.practiceTasksCompleted + 1,
            activities: newActivities,
            xp: state.xp + 30,
          };
        }),

      exportDocument: (documentType) =>
        set((state) => {
          const newActivities = [
            {
              id: `activity-${Date.now()}`,
              timestamp: new Date(),
              type: 'export' as const,
              action: `Exported: ${documentType}`,
              details: 'Document export',
              icon: '📄',
              color: 'gray',
            },
            ...state.activities,
          ].slice(0, 50);

          return {
            documentsExported: state.documentsExported + 1,
            activities: newActivities,
            xp: state.xp + 10,
          };
        }),

      updateCompetency: (name, newScore) =>
        set((state) => ({
          competencies: state.competencies.map((c) =>
            c.name === name ? { ...c, score: newScore } : c
          ),
        })),

      unlockBadge: (badgeId) =>
        set((state) => {
          const newActivities = [
            {
              id: `activity-${Date.now()}`,
              timestamp: new Date(),
              type: 'badge' as const,
              action: 'Unlocked badge',
              details: badgeId,
              icon: '🏆',
              color: 'gold',
            },
            ...state.activities,
          ].slice(0, 50);

          return {
            badges: state.badges.map((b) =>
              b.id === badgeId ? { ...b, unlockedAt: new Date() } : b
            ),
            activities: newActivities,
            xp: state.xp + 200,
          };
        }),

      updateGoal: (goalId, progress) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? { ...g, current: progress } : g
          ),
        })),

      addActivity: (activity) =>
        set((state) => ({
          activities: [
            {
              ...activity,
              id: `activity-${Date.now()}`,
              timestamp: new Date(),
            },
            ...state.activities,
          ].slice(0, 50),
        })),

      updateStreak: () =>
        set((state) => ({
          streak: state.streak + 1,
        })),

      spendHeart: () =>
        set((state) => ({
          hearts: Math.max(0, state.hearts - 1),
        })),

      restoreHeart: () =>
        set((state) => ({
          hearts: Math.min(state.maxHearts, state.hearts + 1),
        })),

      resetProgress: () =>
        set({
          xp: 0,
          level: 1,
          streak: 0,
          hearts: 5,
          lessonsCompleted: 0,
          quizzesPassed: 0,
          practiceTasksCompleted: 0,
          documentsExported: 0,
          avgQuizScore: 0,
          totalHoursStudied: 0,
          overallCompletion: 0,
          competencies: INITIAL_COMPETENCIES.map((c) => ({ ...c, score: 0 })),
          activities: [],
          xpHistory: [],
          quizScores: [],
        }),
    }),
    {
      name: 'user-progress-storage',
    }
  )
);

// ============================================================================
// Helper Functions
// ============================================================================

function generateXPHistory(): XPDataPoint[] {
  const history: XPDataPoint[] = [];
  let totalXP = 0;
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dailyGain = Math.floor(Math.random() * 150) + 50;
    totalXP += dailyGain;

    history.push({
      date,
      xp: totalXP,
      dailyGain,
    });
  }

  return history;
}

function generateQuizHistory(): QuizScore[] {
  const topics = [
    'Journal Entries',
    'Bank Reconciliation',
    'WIP Calculations',
    'Financial Statements',
    'Job Costing',
  ];
  const quizzes: QuizScore[] = [];
  const today = new Date();

  for (let i = 0; i < 13; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 2 + Math.floor(Math.random() * 3)));

    quizzes.push({
      date,
      score: Math.floor(Math.random() * 30) + 70,
      quizName: `Quiz ${13 - i}`,
      topic: topics[Math.floor(Math.random() * topics.length)],
    });
  }

  return quizzes.reverse();
}

function generateTimeSpent(): TimeSpent[] {
  return [
    { topic: 'Construction CFO', hours: 12.5 },
    { topic: 'COA & Statements', hours: 15.0 },
    { topic: 'Job Costing', hours: 10.5 },
    { topic: 'Bank Reconciliation', hours: 8.0 },
    { topic: 'Multi-Entity', hours: 7.5 },
    { topic: 'WIP Calculations', hours: 6.5 },
    { topic: 'Payroll & Tax', hours: 4.0 },
    { topic: 'Month-End Close', hours: 5.5 },
  ];
}

function calculateWeakAreas(
  topicMastery: TopicMastery[],
  quizScores: QuizScore[]
): WeakArea[] {
  const weakAreas: WeakArea[] = [];

  topicMastery.forEach((topic) => {
    if (topic.avgQuizScore < 75 || topic.masteryLevel === 'beginner') {
      const topicQuizzes = quizScores.filter((q) =>
        q.topic.toLowerCase().includes(topic.topic.toLowerCase().split(' ')[0])
      );

      weakAreas.push({
        topic: topic.topic,
        score: topic.avgQuizScore,
        attempts: topicQuizzes.length,
        recommendations: [
          `Review Week ${topic.weeksCompleted + 1} lesson`,
          `Practice ${topic.topic} scenarios`,
          'Watch tutorial videos',
        ],
      });
    }
  });

  return weakAreas;
}

function generateRecentActivities(): Activity[] {
  return [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'quiz',
      action: 'Scored 87% on CPA Practice Exam',
      details: 'Advanced Topics',
      icon: '🎯',
      color: 'green',
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: 'lesson',
      action: 'Completed: Month-End Close',
      details: 'Grade: A',
      icon: '📚',
      color: 'blue',
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      type: 'badge',
      action: 'Unlocked: Bank Rec Expert',
      details: 'Completed 50 reconciliations',
      icon: '🏆',
      color: 'gold',
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: 'practice',
      action: 'Completed: WIP Schedule Practice',
      details: 'Job Costing',
      icon: '💪',
      color: 'purple',
    },
    {
      id: 'act-5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      type: 'export',
      action: 'Exported: Trial Balance to Excel',
      details: 'Financial Statements',
      icon: '📄',
      color: 'gray',
    },
  ];
}

function generateMilestones(): Milestone[] {
  return [
    {
      id: 'milestone-1',
      date: new Date('2025-09-15'),
      type: 'badge',
      title: 'First Badge Unlocked',
      description: 'Earned Journal Master badge',
      icon: '🏆',
    },
    {
      id: 'milestone-2',
      date: new Date('2025-09-22'),
      type: 'lesson',
      title: 'Completed Week 10',
      description: 'Finished Multi-Entity Accounting',
      icon: '📚',
    },
    {
      id: 'milestone-3',
      date: new Date('2025-10-01'),
      type: 'quiz',
      title: 'Perfect Score',
      description: 'Scored 100% on Bank Rec Quiz',
      icon: '🎯',
    },
    {
      id: 'milestone-4',
      date: new Date('2025-10-08'),
      type: 'badge',
      title: '7-Day Streak',
      description: 'Studied for 7 consecutive days',
      icon: '🔥',
    },
  ];
}
