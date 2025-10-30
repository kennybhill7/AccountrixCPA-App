import { z } from 'zod';
import { Month, Flashcard, Week, Question, Choice } from '@/types/content';

const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const QuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  choices: z.array(ChoiceSchema),
  correctId: z.string(),
  explanation: z.string(),
});

const WeekSchema = z.object({
  id: z.enum(['w1', 'w2', 'w3', 'w4']),
  title: z.string(),
  html: z.string(),
  quiz: z.object({
    id: z.string(),
    title: z.string(),
    questions: z.array(QuestionSchema),
  }),
});

const MonthSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  weeks: z.array(WeekSchema),
});

const FlashcardSchema = z.object({
  id: z.string(),
  monthId: z.string(),
  q: z.string(),
  a: z.string(),
  ref: z.string().optional(),
});

export class ContentLoader {
  private months: Map<string, Month> = new Map();
  private flashcards: Flashcard[] = [];
  private flashcardsByMonth: Map<string, Flashcard[]> = new Map();
  private weeksByIds: Map<string, Week> = new Map();

  async loadContent(): Promise<void> {
    await this.loadMonths();
    await this.loadFlashcards();
    this.buildIndexes();
  }

  private async loadMonths(): Promise<void> {
    const monthIds = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    
    for (const monthId of monthIds) {
      try {
        const response = await fetch(`/data/months/m${monthId}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load month ${monthId}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const month = MonthSchema.parse(data);
        
        // Store only once with the numeric ID as the primary key
        this.months.set(monthId, month);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Invalid data in /data/months/m${monthId}.json: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
        }
        console.warn(`Month ${monthId} not found, skipping...`);
      }
    }
  }

  private async loadFlashcards(): Promise<void> {
    try {
      const response = await fetch('/data/flashcards.json');
      if (!response.ok) {
        throw new Error(`Failed to load flashcards: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.flashcards = z.array(FlashcardSchema).parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid data in /data/flashcards.json: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      console.warn('Flashcards not found, skipping...');
    }
  }

  private buildIndexes(): void {
    // Build flashcards by month index
    for (const flashcard of this.flashcards) {
      const monthCards = this.flashcardsByMonth.get(flashcard.monthId) || [];
      monthCards.push(flashcard);
      this.flashcardsByMonth.set(flashcard.monthId, monthCards);
    }

    // Build weeks by IDs index
    this.months.forEach((month) => {
      for (const week of month.weeks) {
        this.weeksByIds.set(`${month.id}-${week.id}`, week);
      }
    });
  }

  getMonth(monthId: string): Month | undefined {
    // Normalize monthId - remove 'm' prefix if present
    const normalizedId = monthId.startsWith('m') ? monthId.slice(1) : monthId;
    return this.months.get(normalizedId);
  }

  getAllMonths(): Month[] {
    const months: Month[] = [];
    this.months.forEach((month) => months.push(month));
    return months.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }

  getWeek(monthId: string, weekId: string): Week | undefined {
    // Normalize monthId - remove 'm' prefix if present
    const normalizedMonthId = monthId.startsWith('m') ? monthId.slice(1) : monthId;
    return this.weeksByIds.get(`m${normalizedMonthId}-${weekId}`);
  }

  getFlashcards(monthId?: string): Flashcard[] {
    if (monthId) {
      // Normalize monthId - remove 'm' prefix if present
      const normalizedId = monthId.startsWith('m') ? monthId.slice(1) : monthId;
      return this.flashcardsByMonth.get(normalizedId) || [];
    }
    return this.flashcards;
  }

  getSearchableContent(): Array<{
    id: string;
    title: string;
    content: string;
    type: 'month' | 'week' | 'flashcard';
    monthId: string;
    weekId?: string;
  }> {
    const searchable: Array<{
      id: string;
      title: string;
      content: string;
      type: 'month' | 'week' | 'flashcard';
      monthId: string;
      weekId?: string;
    }> = [];

    // Add months
    this.months.forEach((month) => {
      searchable.push({
        id: month.id,
        title: month.title,
        content: month.subtitle || '',
        type: 'month',
        monthId: month.id,
      });

      // Add weeks
      for (const week of month.weeks) {
        searchable.push({
          id: `${month.id}-${week.id}`,
          title: week.title,
          content: week.html.replace(/<[^>]*>/g, ''), // Strip HTML tags
          type: 'week',
          monthId: month.id,
          weekId: week.id,
        });
      }
    });

    // Add flashcards
    for (const flashcard of this.flashcards) {
      searchable.push({
        id: flashcard.id,
        title: flashcard.q,
        content: flashcard.a,
        type: 'flashcard',
        monthId: flashcard.monthId,
      });
    }

    return searchable;
  }
}

export const contentLoader = new ContentLoader();