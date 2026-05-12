import React, { useEffect } from 'react';
import { initDB, saveTask } from '../db';
import { seedDevData } from '../store/seed';
import { Task } from '../types';
import AppShell from './AppShell';

export const App: React.FC = () => {
  useEffect(() => {
    (async () => {
      try {
        const db = await initDB();
        await seedDevData(db);
        const extra: Task[] = [
          { id: crypto.randomUUID(), title: 'Test Q1 #3', description: 'Test 3', quadrant: 'I', category: 'Inne', isImportant: true, isUrgent: true, strategy: null, terminType: null, scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: 'AllDay', recurringDays: [], microSteps: [], resources: [], noteContent: '', autoEscalate: false, escalateDaysBefore: 2, isDone: false, isRejected: false, createdAt: new Date().toISOString(), completedAt: null, sessionsCount: 0 },
          { id: crypto.randomUUID(), title: 'Test Q1 #4', description: 'Test 4', quadrant: 'I', category: 'Inne', isImportant: true, isUrgent: true, strategy: null, terminType: null, scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: 'AllDay', recurringDays: [], microSteps: [], resources: [], noteContent: '', autoEscalate: false, escalateDaysBefore: 2, isDone: false, isRejected: false, createdAt: new Date().toISOString(), completedAt: null, sessionsCount: 0 },
          { id: crypto.randomUUID(), title: 'Test Q1 #5', description: 'Test 5', quadrant: 'I', category: 'Inne', isImportant: true, isUrgent: true, strategy: null, terminType: null, scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: 'AllDay', recurringDays: [], microSteps: [], resources: [], noteContent: '', autoEscalate: false, escalateDaysBefore: 2, isDone: false, isRejected: false, createdAt: new Date().toISOString(), completedAt: null, sessionsCount: 0 },
          { id: crypto.randomUUID(), title: 'Test Q1 #6', description: 'Test 6', quadrant: 'I', category: 'Inne', isImportant: true, isUrgent: true, strategy: null, terminType: null, scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: 'AllDay', recurringDays: [], microSteps: [], resources: [], noteContent: '', autoEscalate: false, escalateDaysBefore: 2, isDone: false, isRejected: false, createdAt: new Date().toISOString(), completedAt: null, sessionsCount: 0 },
          { id: crypto.randomUUID(), title: 'Test Q1 #7', description: 'Test 7', quadrant: 'I', category: 'Inne', isImportant: true, isUrgent: true, strategy: null, terminType: null, scheduledDate: new Date().toISOString().split('T')[0], scheduledTime: 'AllDay', recurringDays: [], microSteps: [], resources: [], noteContent: '', autoEscalate: false, escalateDaysBefore: 2, isDone: false, isRejected: false, createdAt: new Date().toISOString(), completedAt: null, sessionsCount: 0 },
        ];
        for (const t of extra) await saveTask(db, t);
        const all = await db.getAll('tasks');
        const q1 = all.filter(t => t.quadrant === 'I' && !t.isDone && !t.isRejected);
        console.log('Iniekcja testowa: ' + q1.length + ' zadan Q1 (open). Przeladowanie przy >=5.');
        q1.forEach((t, i) => console.log('  ' + (i + 1) + '. ' + t.title));
      } catch (e) { console.error(e); }
    })();
  }, []);
  return <AppShell />;
};