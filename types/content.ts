export type Choice = { id: string; text: string };

export type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
  correctId: string;
  explanation: string;
};

export type Week = {
  id: 'w1' | 'w2' | 'w3' | 'w4';
  title: string;
  html: string; // sanitized lesson body
  quiz: { id: string; title: string; questions: Question[] };
};

export type Month = {
  id: string; // "1".."12"
  title: string;
  subtitle?: string;
  weeks: Week[];
};

export type Flashcard = {
  id: string;           // e.g., "m01-fc-001"
  monthId: string;      // "1".."12"
  q: string;
  a: string;
  ref?: string;         // "Month 2 → Week 3 → Retainage"
};