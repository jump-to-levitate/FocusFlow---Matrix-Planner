import type { TimerMode } from '../types';

export type { TimerMode };

export interface TimerConfig {
  workMs: number;
  restMs: number;
}

const MIN = 60 * 1000;

export const MODE_CONFIG: Record<TimerMode, TimerConfig> = {
  '5/0': { workMs: 5 * MIN, restMs: 0 },
  '10/5': { workMs: 10 * MIN, restMs: 5 * MIN },
  '15/5': { workMs: 15 * MIN, restMs: 5 * MIN },
  '25/5': { workMs: 25 * MIN, restMs: 5 * MIN },
  '35/5': { workMs: 35 * MIN, restMs: 5 * MIN },
  '50/10': { workMs: 50 * MIN, restMs: 10 * MIN },
  '90/15': { workMs: 90 * MIN, restMs: 15 * MIN },
  custom: { workMs: 25 * MIN, restMs: 5 * MIN },
};

export interface TimerState {
  mode: TimerMode;
  phase: 'work' | 'break';
  startedAt: number;
  pausedAt: number | null;
  accumulatedPauseMs: number;
  completedCycles: number;
}

export interface TickResult {
  remainingMs: number;
  isPhaseEnd: boolean;
  phase: 'work' | 'break';
  totalPhaseMs: number;
}

export function createTimer(mode: TimerMode): TimerState {
  return {
    mode,
    phase: 'work',
    startedAt: Date.now(),
    pausedAt: null,
    accumulatedPauseMs: 0,
    completedCycles: 0,
  };
}

export function tick(state: TimerState, now: number): TickResult {
  const cfg = MODE_CONFIG[state.mode];
  const total = state.phase === 'work' ? cfg.workMs : cfg.restMs;
  const effectiveNow = state.pausedAt ?? now;
  
  // Handle edge case: if now is smaller than startedAt (system clock issues)
  const adjustedNow = Math.max(effectiveNow, state.startedAt);
  const elapsed = adjustedNow - state.startedAt - state.accumulatedPauseMs;
  const remaining = Math.max(total - elapsed, 0);
  
  return {
    remainingMs: remaining,
    isPhaseEnd: total > 0 && remaining <= 0,
    phase: state.phase,
    totalPhaseMs: Math.max(total, 1),
  };
}

export function pause(state: TimerState, now: number): TimerState {
  if (state.pausedAt !== null) return state;
  return { ...state, pausedAt: now };
}

export function resume(state: TimerState, now: number): TimerState {
  if (state.pausedAt === null) return state;
  return {
    ...state,
    pausedAt: null,
    accumulatedPauseMs: state.accumulatedPauseMs + (now - state.pausedAt),
  };
}

export function end(state: TimerState, now: number): TimerState {
  return state.pausedAt === null ? state : resume(state, now);
}

export function advancePhase(state: TimerState, now: number): TimerState {
  const nextPhase: 'work' | 'break' = state.phase === 'work' ? 'break' : 'work';
  const completedCycles = state.phase === 'break' ? state.completedCycles + 1 : state.completedCycles;
  return {
    mode: state.mode,
    phase: nextPhase,
    startedAt: now,
    pausedAt: null,
    accumulatedPauseMs: 0,
    completedCycles,
  };
}
