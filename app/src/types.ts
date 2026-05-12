export type Quadrant = 'I' | 'II' | 'III' | 'IV';
export type TimerMode = '5/0' | '10/5' | '15/5' | '25/5' | '35/5' | '50/10' | '90/15' | 'custom';

export interface Task {
  id: string;
  title: string;
  description: string;
  quadrant: Quadrant;
  category: string;
  isImportant: boolean;
  isUrgent: boolean;
  strategy: string | null;
  terminType: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  recurringDays: string[];
  microSteps: string[];
  resources: string[];
  noteContent: string;
  autoEscalate: boolean;
  escalateDaysBefore: number;
  isDone: boolean;
  isRejected: boolean;
  createdAt: string;
  completedAt: string | null;
  sessionsCount: number;
  isCompleting?: boolean;
}

export interface FocusSession {
  id: string;
  taskId: string;
  mode: TimerMode;
  startedAt: string;
  endedAt: string | null;
  totalElapsedMs: number;
  isCompleted: boolean;
  pausedDurationMs: number;
  completedCycles: number;
}

export interface AppStateShape {
  currentFocusSession: FocusSession | null;
  quadrant_I_Count: number;
  rejectedTasksThisMonth: number;
  focusSessions: FocusSession[];
  dopamineStreakCount: number;
}

export type ContextAction = 'done' | 'edit' | 'note' | 'delete' | 'startFocus' | 'openMenu';

export interface MicroStep {
  id?: string;
  text: string;
  done: boolean;
}

export interface Resource {
  id?: string;
  type: 'link' | 'file' | 'text';
  label: string;
  value: string;
  createdAt?: string;
}

export interface FileRecord {
  id: string;
  name: string;
  data: string; // base64
  taskId: string;
  createdAt: number;
  type: string;
  size: number;
  blob: Blob;
}
