import { Task } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

export function runEscalation(tasks: Task[], today: Date): Task[] {
  const changed: Task[] = [];
  for (const t of tasks) {
    if (!t.autoEscalate || !t.scheduledDate || t.isDone) continue;
    const scheduled = new Date(t.scheduledDate).getTime();
    const daysUntil = Math.floor((scheduled - today.getTime()) / DAY_MS);
    if (daysUntil <= t.escalateDaysBefore && t.quadrant !== 'I') {
      changed.push({ ...t, quadrant: 'I', isUrgent: true });
    }
  }
  return changed;
}
