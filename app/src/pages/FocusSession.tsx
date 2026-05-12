import { FC, useEffect, useRef, useState } from 'react';
import { Pause, Play, Square, SkipForward } from 'lucide-react';
import { useTasksStore } from '../store/useTasksStore';
import {
  TimerState, tick, pause as pauseFn, resume as resumeFn,
  end as endFn, advancePhase, MODE_CONFIG,
} from '../logic/timerMachine';
import { TimerMode, FocusSession as FocusSessionType } from '../types';
import { computeStreak } from '../logic/streakEngine';
import { colors, GLOW } from '../constants/colors';

const parseTaskId = (): string | null => {
  const m = window.location.hash.match(/[?&]taskId=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};

const parseMode = (): TimerMode => {
  const m = window.location.hash.match(/[?&]mode=([^&]+)/);
  const raw = m ? decodeURIComponent(m[1]) : '25/5';
  return raw in MODE_CONFIG ? (raw as TimerMode) : '25/5';
};

const formatMMSS = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const MAX_CYCLES = 4;

interface WakeLockSentinelLike {
  release: () => Promise<void>;
}
interface WakeLockAPI {
  request: (type: 'screen') => Promise<WakeLockSentinelLike>;
}

const getWakeLock = (): WakeLockAPI | null => {
  const nav = navigator as unknown as { wakeLock?: WakeLockAPI };
  return nav.wakeLock ?? null;
};

const Loading: FC = () => (
  <div className="px-3 py-4 flex flex-col items-center gap-6">
    <h2 className="text-white text-lg font-bold">Inicjalizacja sesji...</h2>
    <div className="w-32 h-32 border-4 border-panelBorder border-t-neonGreen rounded-full animate-spin" />
  </div>
);

export const FocusSession: FC = () => {
  const store = useTasksStore();
  const [taskId, setTaskId] = useState<string | null>(parseTaskId);
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const sessionIdRef = useRef<string>('');
  const sessionStartRef = useRef<number>(0);
  const startedForRef = useRef<string | null>(null);
  const initializedSessionRef = useRef<string | null>(null);
  const finishingRef = useRef<boolean>(false);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);

  const session = store.appState.currentFocusSession;
  const task = store.tasks.find(t => t.id === taskId) ?? null;

  useEffect(() => {
    const onHash = () => setTaskId(parseTaskId());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!taskId) return;
    if (session && session.taskId === taskId) return;
    if (startedForRef.current === taskId) return;
    startedForRef.current = taskId;
    void store.startFocusSession(taskId, parseMode());
  }, [taskId, session, store]);

  useEffect(() => {
    if (!session) {
      initializedSessionRef.current = null;
      return;
    }
    if (initializedSessionRef.current === session.id) return;
    initializedSessionRef.current = session.id;
    console.log('FocusSession: session loaded from store', session.id, session.mode);
    const startedMs = new Date(session.startedAt).getTime();
    sessionIdRef.current = session.id;
    sessionStartRef.current = startedMs;
    setTimerState({
      mode: session.mode,
      phase: 'work',
      startedAt: startedMs,
      pausedAt: null,
      accumulatedPauseMs: session.pausedDurationMs,
      completedCycles: session.completedCycles,
    });
  }, [session]);

  useEffect(() => {
    if (!timerState || timerState.pausedAt !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [timerState]);

  useEffect(() => {
    const api = getWakeLock();
    if (!api) return;
    const isActive = timerState !== null && timerState.pausedAt === null;
    const acquire = async () => {
      if (wakeLockRef.current) return;
      try {
        wakeLockRef.current = await api.request('screen');
      } catch (e) {
        console.warn('WakeLock denied:', e);
      }
    };
    const release = async () => {
      if (!wakeLockRef.current) return;
      try { await wakeLockRef.current.release(); } catch { /* noop */ }
      wakeLockRef.current = null;
    };
    if (isActive && document.visibilityState === 'visible') {
      void acquire();
    } else {
      void release();
    }
    const onVis = () => {
      if (document.visibilityState === 'visible' && isActive) void acquire();
      else void release();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      void release();
    };
  }, [timerState]);

  const finish = async (endedEarly: boolean): Promise<void> => {
    if (!timerState || finishingRef.current) return;
    finishingRef.current = true;
    const settled = endFn(timerState, Date.now());
    const totalElapsedMs = Date.now() - sessionStartRef.current - settled.accumulatedPauseMs;
    const ended: FocusSessionType = {
      id: sessionIdRef.current || crypto.randomUUID(),
      taskId: taskId ?? '',
      mode: settled.mode,
      startedAt: new Date(sessionStartRef.current).toISOString(),
      endedAt: new Date().toISOString(),
      totalElapsedMs,
      isCompleted: !endedEarly,
      pausedDurationMs: settled.accumulatedPauseMs,
      completedCycles: settled.completedCycles,
    };
    await store.addFocusSession(ended);
    await store.setCurrentFocusSession(null);
    if (task && task.quadrant === 'I' && task.category === 'WielkiProjekt') {
      await store.updateTask(task.id, { sessionsCount: task.sessionsCount + 1 });
    }
    const streak = computeStreak([...store.appState.focusSessions, ended], new Date());
    await store.setDopamineStreakCount(streak);
    setTimerState(null);
    startedForRef.current = null;
    window.location.hash = '#pulpit';
  };

  useEffect(() => {
    if (!timerState) return;
    const result = tick(timerState, now);
    if (!result.isPhaseEnd) return;
    const cfg = MODE_CONFIG[timerState.mode];
    if (timerState.phase === 'work') {
      if (cfg.restMs <= 0) {
        void finish(false);
        return;
      }
      setTimerState(advancePhase(timerState, Date.now()));
      return;
    }
    const nextCycles = timerState.completedCycles + 1;
    if (nextCycles >= MAX_CYCLES) {
      void finish(false);
      return;
    }
    setTimerState(advancePhase(timerState, Date.now()));
  }, [timerState, now]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!timerState) return <Loading />;

  const result = tick(timerState, now);
  const progress = 1 - result.remainingMs / result.totalPhaseMs;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const ringColor = result.phase === 'work' ? colors.neonGreen : colors.neonPurple;
  const isPaused = timerState.pausedAt !== null;

  const onPause = () => setTimerState(s => (s ? pauseFn(s, Date.now()) : s));
  const onResume = () => setTimerState(s => (s ? resumeFn(s, Date.now()) : s));
  const onSkip = () => {
    if (result.phase !== 'break') return;
    setTimerState(s => (s ? advancePhase(s, Date.now()) : s));
  };

  return (
    <div className="px-3 py-4 flex flex-col items-center gap-6 animate-in fade-in duration-300">
      <header className="text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-textSecondary">
          Tryb {timerState.mode} &middot; Cykl {timerState.completedCycles + 1}/{MAX_CYCLES}
        </p>
        <h2 className="text-white text-xl font-bold mt-1">{task?.title ?? 'Sesja Focus'}</h2>
      </header>

      <div className="relative w-64 h-64">
        <svg viewBox="0 0 240 240" className="w-full h-full -rotate-90">
          <circle cx="120" cy="120" r={RADIUS} stroke={colors.surface} strokeWidth="10" fill="none" />
          <circle
            cx="120"
            cy="120"
            r={RADIUS}
            stroke={ringColor}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.5s linear', filter: `drop-shadow(${GLOW.soft(ringColor)})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold text-white">{formatMMSS(result.remainingMs)}</span>
          <span className="text-xs uppercase tracking-widest mt-1" style={{ color: ringColor }}>
            {result.phase === 'work' ? 'Praca' : 'Przerwa'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 w-full justify-center">
        {isPaused ? (
          <button
            onClick={onResume}
            className="flex-1 py-3 rounded-pill font-black uppercase tracking-qlabel bg-neonGreen text-midnight flex items-center justify-center gap-2"
          >
            <Play size={16} /> Wznow
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex-1 py-3 rounded-pill font-bold uppercase tracking-qlabel border-2 border-neonPurple text-neonPurple flex items-center justify-center gap-2"
          >
            <Pause size={16} /> Pauza
          </button>
        )}
        {result.phase === 'break' && (
          <button
            onClick={onSkip}
            className="flex-1 py-3 rounded-pill font-bold uppercase tracking-qlabel border-2 border-neonOrange text-neonOrange flex items-center justify-center gap-2"
          >
            <SkipForward size={16} /> Skip
          </button>
        )}
        <button
          onClick={() => void finish(true)}
          className="flex-1 py-3 rounded-pill font-bold uppercase tracking-qlabel border-2 border-neonRed text-neonRed flex items-center justify-center gap-2"
        >
          <Square size={16} /> Zakoncz
        </button>
      </div>
    </div>
  );
};

export default FocusSession;
