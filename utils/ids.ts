export function generateQuestionId(monthId: string, weekId: string, index: number): string {
  return `m${monthId.padStart(2, "0")}-${weekId}-q${index.toString().padStart(3, "0")}`;
}

export function generateFlashcardId(monthId: string, index: number): string {
  return `m${monthId.padStart(2, "0")}-fc-${index.toString().padStart(3, "0")}`;
}

export function parseMonthId(monthId: string): number {
  return parseInt(monthId, 10);
}

export function formatMonthId(monthNum: number): string {
  return monthNum.toString();
}
