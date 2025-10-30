// SM-2 Algorithm implementation for spaced repetition

// SRS Card interface
export interface SRSCard {
  id: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  dueDate: number;
  lastReviewed: number;
}

export enum Grade {
  Again = 0,  // Complete failure
  Hard = 1,   // Incorrect but remembered with difficulty
  Good = 2,   // Correct with some difficulty
  Easy = 3    // Perfect recall
}

export function calculateNextReview(card: SRSCard, grade: Grade): SRSCard {
  const now = Date.now();
  
  // If grade is 0 (Again), reset the card
  if (grade === Grade.Again) {
    return {
      ...card,
      interval: 1,
      repetition: 0,
      easeFactor: Math.max(1.3, card.easeFactor - 0.2),
      dueDate: now + (1 * 24 * 60 * 60 * 1000), // 1 day
      lastReviewed: now
    };
  }

  // Calculate new ease factor
  let newEaseFactor = card.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor);

  // Calculate new interval
  let newInterval: number;
  if (card.repetition === 0) {
    newInterval = 1;
  } else if (card.repetition === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(card.interval * newEaseFactor);
  }

  // Adjust interval based on grade
  if (grade === Grade.Hard) {
    newInterval = Math.max(1, Math.round(newInterval * 0.8));
  } else if (grade === Grade.Easy) {
    newInterval = Math.round(newInterval * 1.3);
  }

  return {
    ...card,
    interval: newInterval,
    repetition: card.repetition + 1,
    easeFactor: newEaseFactor,
    dueDate: now + (newInterval * 24 * 60 * 60 * 1000),
    lastReviewed: now
  };
}

export function createNewSRSCard(id: string): SRSCard {
  return {
    id,
    interval: 1,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: Date.now(),
    lastReviewed: 0
  };
}

export function getDailyNewCardLimit(): number {
  return 20;
}

export function getDailyReviewLimit(): number {
  return 100;
}

export function shouldShowCard(card: SRSCard): boolean {
  return card.dueDate <= Date.now();
}

export function getCardPriority(card: SRSCard): number {
  const daysSinceReview = (Date.now() - card.lastReviewed) / (24 * 60 * 60 * 1000);
  const overdueDays = Math.max(0, daysSinceReview - card.interval);
  return overdueDays * card.easeFactor;
}