import { TimerSession, TimerState, TimerDerivedState } from '../types/timer.types';

interface EngineSnapshot {
  session: TimerSession;
  state: TimerState;
}

/**
 * Deterministyczny algorytm wyliczania pozostałego czasu (Delta Timestamp API)
 * Bezpieczny dla background throttlingu - bazuje na fizycznym zegarze systemowym.
 */
export function calculateRemainingMs(snapshot: EngineSnapshot): number {
  const { session, state } = snapshot;
  const now = Date.now();

  // Jeśli timer w ogóle nie wystartował
  if (state === 'idle') return 0;

  // 🚨 POPRAWKA ARCHITEKTONICZNA: W stanie pauzy pozostały czas jest idealnie zamrożony
  if (state === 'paused' && session.pausedAt !== null) {
    const adjustedEndTime = session.expectedEndAt + session.totalPausedMs;
    return Math.max(0, adjustedEndTime - session.pausedAt);
  }

  // W stanie działania (running) lub zakończenia (completed) liczymy deltę na żywo
  const adjustedEndTime = session.expectedEndAt + session.totalPausedMs;
  return Math.max(0, adjustedEndTime - now);
}

/**
 * Oblicza postęp procentowy sesji (0 do 100)
 */
export function calculateProgress(remainingMs: number, totalDurationMs: number): number {
  if (totalDurationMs <= 0) return 0;
  const elapsed = totalDurationMs - remainingMs;
  return Math.min(100, Math.max(0, (elapsed / totalDurationMs) * 100));
}

/**
 * Funkcja mapująca aktualny surowy stan systemowy na pełny obiekt derived state dla UI.
 * Wywoływana w useMemo bez generowania efektów ubocznych (Side-Effects).
 */
export function computeTimerDerivedState(session: TimerSession | null, state: TimerState, totalDurationMs: number): TimerDerivedState {
  // Fallback dla stanu bezaktywnego
  if (!session || state === 'idle') {
    return {
      remainingMs: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      progressPercent: 0,
      elapsedMs: 0,
      isOverdue: false,
    };
  }

  const remainingMs = calculateRemainingMs({ session, state });
  const progressPercent = calculateProgress( remainingMs, totalDurationMs);
  const elapsedMs = Math.max(0, totalDurationMs - remainingMs);

  return {
    remainingMs,
    remainingMinutes: Math.floor(remainingMs / 60000),
    remainingSeconds: Math.floor((remainingMs % 60000) / 1000),
    progressPercent,
    elapsedMs,
    isOverdue: remainingMs === 0 && state === 'running',
  };
}
