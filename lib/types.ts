// Core data types for the Construction CFO Learning App

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

export interface MonthIndex {
  id: string;
  order: number;
  title: string;
  weeks: number;
  lessons: number;
}

export interface CurriculumIndex {
  months: MonthIndex[];
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