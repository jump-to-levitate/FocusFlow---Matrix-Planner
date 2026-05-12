import { saveTask, getAllTasks, clearTasks, clearAppState } from '../db';
import { IDBPDatabase } from 'idb';
import type { Task } from '../types';

export async function resetDatabase(): Promise<void> {
  await clearTasks();
  await clearAppState();
}

export async function seedDevData(db: IDBPDatabase): Promise<void> {
  const existing = await getAllTasks(db);
  if (existing.length > 0) return;

  const sampleTasks: Task[] = [
    {
      id: crypto.randomUUID(),
      title: 'Plan dnia',
      description: 'Zaplanuj priorytety na dziś',
      quadrant: 'I',
      category: 'Planowanie',
      isImportant: true,
      isUrgent: true,
      strategy: null,
      terminType: null,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
      recurringDays: [],
      microSteps: ['Otwórz kalendarz', 'Zaznacz najważniejsze zadania'],
      resources: [],
      noteContent: '',
      autoEscalate: false,
      escalateDaysBefore: 2,
      isDone: false,
      isRejected: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      sessionsCount: 0,
    },
    {
      id: crypto.randomUUID(),
      title: 'Nauka TypeScript',
      description: 'Przejrzyj dokumentację i napisz przykłady',
      quadrant: 'II',
      category: 'Rozwój',
      isImportant: true,
      isUrgent: false,
      strategy: null,
      terminType: null,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '14:00',
      recurringDays: [],
      microSteps: ['Przeczytaj rozdział o typach', 'Napisz 3 przykłady'],
      resources: [],
      noteContent: '',
      autoEscalate: false,
      escalateDaysBefore: 2,
      isDone: false,
      isRejected: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      sessionsCount: 0,
    },
    {
      id: crypto.randomUUID(),
      title: 'Odcinek serialu',
      description: 'Relaks po pracy',
      quadrant: 'III',
      category: 'Rozrywka',
      isImportant: false,
      isUrgent: false,
      strategy: null,
      terminType: null,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '20:00',
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
    },
    {
      id: crypto.randomUUID(),
      title: 'Rekreacja',
      description: 'Chwila odpoczynku',
      quadrant: 'IV',
      category: 'Inne',
      isImportant: false,
      isUrgent: false,
      strategy: null,
      terminType: null,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '15:00',
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
    },
  ];

  for (const task of sampleTasks) {
    await saveTask(db, task);
  }
}
