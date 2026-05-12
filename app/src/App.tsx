import { useEffect } from 'react';
import type { FC } from 'react';
import { initDB, getAllTasks, getAppState, saveAppState } from './db';
import { seedDevData, resetDatabase } from './store/seed';
import { initStore } from './store/useTasksStore';
import { emitTaskUpdated } from './store/events';
import AppShell from './AppShell';

const DEFAULT_APP_STATE = {
  currentFocusSession: null,
  quadrant_I_Count: 0,
  rejectedTasksThisMonth: 0,
  focusSessions: [],
  dopamineStreakCount: 0,
};

const RESET_FLAG = 'focusflow_db_reset_2026';

export const App: FC = () => {
  useEffect(() => {
    (async () => {
      try {
        const db = await initDB();
        
        // One-time database reset to clear duplicate tasks
        if (!localStorage.getItem(RESET_FLAG)) {
          await resetDatabase();
          localStorage.setItem(RESET_FLAG, 'done');
        }
        
        const tasks = await getAllTasks(db);
        const persisted = await getAppState('appState');
        if (tasks.length === 0 && persisted === null) {
          await seedDevData(db);
          await saveAppState('appState', DEFAULT_APP_STATE);
        }
        await initStore();
        emitTaskUpdated();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return <AppShell />;
};
