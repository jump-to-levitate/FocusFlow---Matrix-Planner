import { FocusSession } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

export function computeStreak(focusSessions: FocusSession[], today: Date): number {
  let streak = 0;
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const dayStart = cursor.getTime();
    const dayEnd = dayStart + DAY_MS;
    const has = focusSessions.some(s => {
      if (s.completedCycles <= 0) return false;
      const t = new Date(s.startedAt).getTime();
      return t >= dayStart && t < dayEnd;
    });
    if (!has) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
