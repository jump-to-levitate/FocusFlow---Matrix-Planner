import { useEffect, useSyncExternalStore } from 'react';
import { Task, FocusSession, TimerMode, AppStateShape } from '../types';
import { initDB, getAllTasks, saveTask, deleteTask, saveAppState, getAppState } from '../db';
import { emitTaskUpdated, subscribeTaskUpdated } from './events';
import { selectQ1Count } from './selectors';
import { runEscalation } from '../logic/escalationEngine';

const HOUR_MS = 60 * 60 * 1000;
let escalationIntervalId: number | null = null;

const DEFAULT_APP_STATE: AppStateShape = {
  currentFocusSession: null,
  quadrant_I_Count: 0,
  rejectedTasksThisMonth: 0,
  focusSessions: [],
  dopamineStreakCount: 0,
};

interface StoreState {
  tasks: Task[];
  appState: AppStateShape;
  ready: boolean;
}

let state: StoreState = {
  tasks: [],
  appState: { ...DEFAULT_APP_STATE },
  ready: false,
};

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach(l => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StoreState {
  return state;
}

async function reloadTasks(): Promise<void> {
  const db = await initDB();
  const tasks = await getAllTasks(db);
  state = {
    ...state,
    tasks,
    appState: { ...state.appState, quadrant_I_Count: selectQ1Count(tasks) },
  };
  await saveAppState('appState', state.appState);
  notify();
}

let initPromise: Promise<void> | null = null;

async function applyEscalation(): Promise<void> {
  const today = new Date();
  const changed = runEscalation(state.tasks, today);
  if (changed.length === 0) return;
  const db = await initDB();
  for (const t of changed) {
    await saveTask(db, t);
  }
  const ids = new Set(changed.map(c => c.id));
  const newTasks = state.tasks.map(t => {
    if (!ids.has(t.id)) return t;
    return changed.find(c => c.id === t.id) ?? t;
  });
  state = {
    ...state,
    tasks: newTasks,
    appState: { ...state.appState, quadrant_I_Count: selectQ1Count(newTasks) },
  };
  await saveAppState('appState', state.appState);
  notify();
  emitTaskUpdated();
}

async function loadInitial(): Promise<void> {
  const db = await initDB();
  const tasks = await getAllTasks(db);
  const persisted = (await getAppState('appState')) as AppStateShape | null;
  const baseState = persisted ?? { ...DEFAULT_APP_STATE };
  state = {
    tasks,
    appState: { ...baseState, quadrant_I_Count: selectQ1Count(tasks) },
    ready: true,
  };
  if (!persisted) {
    await saveAppState('appState', state.appState);
  }
  notify();
  await applyEscalation();
  if (typeof window !== 'undefined' && escalationIntervalId === null) {
    escalationIntervalId = window.setInterval(() => { void applyEscalation(); }, HOUR_MS);
  }
}

export function initStore(): Promise<void> {
  if (!initPromise) initPromise = loadInitial();
  return initPromise;
}

if (typeof window !== 'undefined') {
  subscribeTaskUpdated(() => {
    void reloadTasks();
  });
}

async function persistAppState(patch: Partial<AppStateShape>): Promise<void> {
  state = { ...state, appState: { ...state.appState, ...patch } };
  await saveAppState('appState', state.appState);
  notify();
}

async function addTask(task: Task): Promise<void> {
  const db = await initDB();
  await saveTask(db, task);
  const newTasks = [...state.tasks, task];
  state = {
    ...state,
    tasks: newTasks,
    appState: { ...state.appState, quadrant_I_Count: selectQ1Count(newTasks) },
  };
  await saveAppState('appState', state.appState);
  notify();
  emitTaskUpdated();
}

async function updateTask(taskId: string, patch: Partial<Task>): Promise<void> {
  const existing = state.tasks.find(t => t.id === taskId);
  if (!existing) return;
  const updated: Task = { ...existing, ...patch };
  const db = await initDB();
  await saveTask(db, updated);
  const newTasks = state.tasks.map(t => (t.id === taskId ? updated : t));
  state = {
    ...state,
    tasks: newTasks,
    appState: { ...state.appState, quadrant_I_Count: selectQ1Count(newTasks) },
  };
  await saveAppState('appState', state.appState);
  notify();
  emitTaskUpdated();
}

async function removeTask(taskId: string): Promise<void> {
  const db = await initDB();
  await deleteTask(db, taskId);
  const newTasks = state.tasks.filter(t => t.id !== taskId);
  state = {
    ...state,
    tasks: newTasks,
    appState: { ...state.appState, quadrant_I_Count: selectQ1Count(newTasks) },
  };
  await saveAppState('appState', state.appState);
  notify();
  emitTaskUpdated();
}

async function addNote(note: string): Promise<void> {
  const task: Task = {
    id: crypto.randomUUID(),
    title: note.slice(0, 80),
    description: '',
    quadrant: 'IV',
    category: 'Notatka',
    isImportant: false,
    isUrgent: false,
    strategy: null,
    terminType: null,
    scheduledDate: null,
    scheduledTime: null,
    recurringDays: [],
    microSteps: [],
    resources: [],
    noteContent: note,
    autoEscalate: false,
    escalateDaysBefore: 2,
    isDone: false,
    isRejected: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    sessionsCount: 0,
  };
  await addTask(task);
}

async function bumpRejectedCount(): Promise<void> {
  await persistAppState({ rejectedTasksThisMonth: state.appState.rejectedTasksThisMonth + 1 });
}

async function setCurrentFocusSession(session: FocusSession | null): Promise<void> {
  await persistAppState({ currentFocusSession: session });
}

async function addFocusSession(session: FocusSession): Promise<void> {
  const next = [...state.appState.focusSessions, session];
  await persistAppState({ focusSessions: next });
}

async function startFocusSession(taskId: string, mode: TimerMode): Promise<FocusSession> {
  const session: FocusSession = {
    id: crypto.randomUUID(),
    taskId,
    mode,
    startedAt: new Date().toISOString(),
    endedAt: null,
    totalElapsedMs: 0,
    isCompleted: false,
    pausedDurationMs: 0,
    completedCycles: 0,
  };
  await persistAppState({ currentFocusSession: session });
  return session;
}

async function endFocusSession(sessionId: string, completedCycles: number, isCompleted = true): Promise<void> {
  const current = state.appState.currentFocusSession;
  if (!current || current.id !== sessionId) {
    await persistAppState({ currentFocusSession: null });
    return;
  }
  const ended: FocusSession = {
    ...current,
    endedAt: new Date().toISOString(),
    completedCycles,
    isCompleted,
    totalElapsedMs: Date.now() - new Date(current.startedAt).getTime() - current.pausedDurationMs,
  };
  await persistAppState({
    currentFocusSession: null,
    focusSessions: [...state.appState.focusSessions, ended],
  });
  const targetTask = state.tasks.find(t => t.id === ended.taskId);
  if (targetTask && targetTask.quadrant === 'I' && targetTask.category === 'WielkiProjekt') {
    await updateTask(targetTask.id, { sessionsCount: targetTask.sessionsCount + 1 });
  }
}

async function setDopamineStreakCount(count: number): Promise<void> {
  await persistAppState({ dopamineStreakCount: count });
}

export interface TasksStoreApi {
  tasks: Task[];
  appState: AppStateShape;
  ready: boolean;
  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, patch: Partial<Task>) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  addNote: (note: string) => Promise<void>;
  bumpRejectedCount: () => Promise<void>;
  setCurrentFocusSession: (session: FocusSession | null) => Promise<void>;
  addFocusSession: (session: FocusSession) => Promise<void>;
  startFocusSession: (taskId: string, mode: TimerMode) => Promise<FocusSession>;
  endFocusSession: (sessionId: string, completedCycles: number, isCompleted?: boolean) => Promise<void>;
  setDopamineStreakCount: (count: number) => Promise<void>;
}

export function useTasksStore(): TasksStoreApi {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    void initStore();
  }, []);
  return {
    tasks: snap.tasks,
    appState: snap.appState,
    ready: snap.ready,
    addTask,
    updateTask,
    removeTask,
    addNote,
    bumpRejectedCount,
    setCurrentFocusSession,
    addFocusSession,
    startFocusSession,
    endFocusSession,
    setDopamineStreakCount,
  };
}
