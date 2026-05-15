export type QuadrantNumber = 1 | 2 | 3 | 4;

/**
 * Classify a task into a quadrant based on importance and urgency.
 *
 * | importance | urgency | Quadrant |
 * |------------|---------|----------|
 * | true       | true    | Q1 — Pilne i Ważne (EMERGENCY)      |
 * | true       | false   | Q2 — Nie-pilne i Ważne (GROWTH)     |
 * | false      | true    | Q3 — Pilne i Nie-ważne (ADMIN)      |
 * | false      | false   | Q4 — Nie-pilne i Nie-ważne (WASTE)  |
 */
export function classifyTask(importance: boolean, urgency: boolean): QuadrantNumber {
  if (importance && urgency) return 1;
  if (importance && !urgency) return 2;
  if (!importance && urgency) return 3;
  return 4;
}
