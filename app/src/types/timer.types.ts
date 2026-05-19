export type TimerMode = 'focus' | 'break' | 'idle';
export type TimerState = 'running' | 'paused' | 'completed' | 'idle';

export interface TimerPreset {
  id: string;
  label: string;
  focusMinutes: number;
  breakMinutes: number;
  category: 'quick' | 'standard' | 'deep' | 'custom';
}

export interface TimerSession {
  id: string;
  taskId: number | null; // ✅ TUTAJ: typ number zgodny z automatycznym ID w Dexie.js
  presetId: string;
  startedAt: number; // Unix timestamp (ms)
  expectedEndAt: number; // Unix timestamp (ms)
  pausedAt: number | null;
  totalPausedMs: number;
  completedAt: number | null;
}

// Derived state computed via useMemo (NO useEffect!)
export interface TimerDerivedState {
  remainingMs: number;
  remainingMinutes: number;
  remainingSeconds: number;
  progressPercent: number; // 0-100
  elapsedMs: number;
  isOverdue: boolean;
}
