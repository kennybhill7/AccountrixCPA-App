import { z } from 'zod';

export const FlashcardSchema = z.object({
  front: z.string().min(1, "Flashcard front cannot be empty"),
  back: z.string().min(1, "Flashcard back cannot be empty")
});

export const QuizQuestionSchema = z.object({
  q: z.string().min(1, "Question cannot be empty"),
  choices: z.array(z.string()).min(2, "Must have at least 2 choices").max(5, "Cannot have more than 5 choices"),
  answer: z.number().int().min(0, "Answer index must be non-negative"),
  explain: z.string().optional()
}).refine((data) => data.answer < data.choices.length, {
  message: "Answer index must be less than number of choices",
  path: ["answer"]
});

export const QuizSchema = z.object({
  id: z.string().min(1, "Quiz ID cannot be empty"),
  title: z.string().min(1, "Quiz title cannot be empty"), 
  questions: z.array(QuizQuestionSchema).min(0, "Quiz questions must be an array")
});

export const WeekSchema = z.object({
  id: z.string().regex(/^w[1-4]$/, "Week ID must be in format w1, w2, w3, or w4"),
  order: z.number().int().min(1).max(4),
  title: z.string().min(1, "Week title cannot be empty"),
  lessonHtml: z.string().min(1, "Lesson content cannot be empty"),
  flashcards: z.array(FlashcardSchema),
  quiz: QuizSchema
}).refine((data) => {
  const expectedOrder = parseInt(data.id.slice(1));
  return data.order === expectedOrder;
}, {
  message: "Week order must match ID number",
  path: ["order"]
});

export const MonthSchema = z.object({
  id: z.string().regex(/^m([1-9]|1[0-2])$/, "Month ID must be m1 through m12"),
  title: z.string().min(1, "Month title cannot be empty"),
  description: z.string().optional(),
  weeks: z.array(WeekSchema).length(4, "Each month must have exactly 4 weeks")
});

export const CurriculumSchema = z.record(
  z.string().regex(/^m([1-9]|1[0-2])$/, "Month key must be m1 through m12"),
  MonthSchema
);

export const UserProgressSchema = z.object({
  xp: z.number().int().min(0, "XP cannot be negative"),
  hearts: z.number().int().min(0).max(5, "Hearts must be between 0 and 5"),
  streak: z.number().int().min(0, "Streak cannot be negative"),
  completedQuizzes: z.array(z.string().regex(/^m([1-9]|1[0-2]):w[1-4]$/, "Completed quiz format must be monthId:weekId")),
  currentTheme: z.enum(['light', 'dark'])
});

export const QuizResultSchema = z.object({
  monthId: z.string().regex(/^m([1-9]|1[0-2])$/, "Month ID must be m1 through m12"),
  weekId: z.string().regex(/^w[1-4]$/, "Week ID must be w1, w2, w3, or w4"),
  score: z.number().int().min(0, "Score cannot be negative"),
  totalQuestions: z.number().int().min(1, "Must have at least 1 question"),
  completedAt: z.number().int().positive("Completion timestamp must be positive")
}).refine((data) => data.score <= data.totalQuestions, {
  message: "Score cannot be greater than total questions",
  path: ["score"]
});

export type Flashcard = z.infer<typeof FlashcardSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type Week = z.infer<typeof WeekSchema>;
export type Month = z.infer<typeof MonthSchema>;
export type Curriculum = z.infer<typeof CurriculumSchema>;
export type UserProgress = z.infer<typeof UserProgressSchema>;
export type QuizResult = z.infer<typeof QuizResultSchema>;