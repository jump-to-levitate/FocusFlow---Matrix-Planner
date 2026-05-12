import { Task, Quadrant } from '../types';
import type { TasksStoreApi } from '../store/useTasksStore';

export type StrategicData =
  | { quadrant: 'II'; plan: string }
  | { quadrant: 'III'; strategy: string }
  | { quadrant: 'IV'; action: unknown };

export async function commitTaskFromQuiz(
  store: TasksStoreApi,
  title: string,
  _answers: import('./processQuiz').QuizAnswers,
  data?: StrategicData
): Promise<{ kind: 'discarded' | 'overload' | 'ok' }> {
  const quadrant = data?.quadrant || 'I';
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    description: '',
    quadrant: quadrant as Quadrant,
    category: 'Inne',
    isImportant: quadrant === 'I' || quadrant === 'II',
    isUrgent: quadrant === 'I' || quadrant === 'III',
    strategy: data && 'strategy' in data ? data.strategy : null,
    terminType: null,
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: null,
    recurringDays: [],
    microSteps: [],
    resources: [],
    noteContent: '',
    autoEscalate: false,
    escalateDaysBefore: 2,
    isDone: false,
    isRejected: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    sessionsCount: 0,
  };
  await store.addTask(task);
  if (quadrant === 'IV') return { kind: 'discarded' };
  return { kind: 'ok' };
}

export function buildNote(title: string): string {
  return `Note: ${title}`;
}
