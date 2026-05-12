import { Task, FocusSession, Quadrant } from '../types';

export const selectQ1Count = (tasks: Task[]): number => {
  return tasks.filter(t => t.quadrant === 'I' && !t.isDone && !t.isRejected).length;
};

export const selectByQuadrant = (tasks: Task[], q: Quadrant): Task[] => {
  return tasks.filter(t => t.quadrant === q);
};

export const selectOpen = (tasks: Task[]): Task[] => {
  return tasks.filter(t => !t.isDone && !t.isRejected);
};

export const selectScheduledForDate = (tasks: Task[], date: string): Task[] => {
  return tasks.filter(t => !t.isDone && !t.isRejected && t.scheduledDate === date);
};

const dayKey = (d: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
};

export interface TodaySections {
  priorities: Task[];
  prozaZycia: Task[];
  habits: Task[];
  scheduled: Task[];
}

export const selectAllForToday = (tasks: Task[], today: string): TodaySections => {
  const open = selectOpen(tasks);
  const todayDate = new Date(today);
  const todayDay = dayKey(todayDate);
  return {
    priorities: open.filter(t => t.quadrant === 'I'),
    prozaZycia: open.filter(t => t.quadrant === 'III' && (t.strategy === 'ZrobTeraz' || t.strategy === 'WPrzerwie')),
    habits: open.filter(t => t.category === 'Habit' && t.recurringDays.includes(todayDay)),
    scheduled: open.filter(t => t.scheduledDate === today),
  };
};

export const selectStreakDays = (focusSessions: FocusSession[], today: Date): number => {
  let streak = 0;
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const dayStart = cursor.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
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
};
