import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Square } from 'lucide-react';
import { colors } from '../constants/colors';
import { useTasksStore } from '../store/useTasksStore';
import {
  ActiveSession, createSession, pause as pauseS, resume as resumeS,
  tick, toFocusSession, MODE_CONFIG, TimerMode,
} from '../logic/timerMachine';
import { TimerCircle } from '../components/TimerCircle';

const parseTaskId = (): string | null => {
  const m = window.location.hash.match(/[?&]taskId=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};

const LoadingState: React.FC = () => (
  <div className="px-4 pt-10 pb-20 flex flex-col items-center gap-6 animate-in fade-in duration-500">
    <header className="text-center">
      <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textSecondary }}>Tryb &mdash;</p>
      <h2 className="text-white text-xl font-bold mt-1">Ladowanie...</h2>
    </header>
    <div className="w-32 h-32 border-4 border-slate-700 border-t-neonGreen rounded-full animate-spin" />
    <p className="text-sm" style={{ color: colors.textSecondary }}>Oczekiwanie na dane sesji...</p>
  </div>
);

export const Timer: React.FC = () => {
  const { tasks, appState, setCurrentFocusSession, addFocusSession } = useTasksStore();
  const taskId = useMemo(parseTaskId, []);
  const task = tasks.find((t) => t.id === taskId) ?? null;

  const [mode] = useState<TimerMode>('25/5');
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [now, setNow] = useState(Date.now());
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // HOOKS — wywoływane bezwarunkowo (Rules of Hooks)
  useEffect(() => {
    if (appState.currentFocusSession && !session) {
      const persisted = appState.currentFocusSession;
      setSession({
        id: persisted.id,
        taskId: persisted.taskId,
        mode: persisted.mode,
        startedAtMs: new Date(persisted.startedAt).getTime(),
        pausedAtMs: null,
        accumulatedPausedMs: persisted.pausedDurationMs,
      });
    }
  }, [appState.currentFocusSession, session]);

  useEffect(() => {
    if (!session || session.pausedAtMs !== null) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    const onVis = () => document.visibilityState === 'visible' && setNow(Date.now());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [session]);

  useEffect(() => {
    if (!session || session.pausedAtMs !== null) return;
    (async () => {
      try {
        wakeLockRef.current = await (navigator as Navigator & {
          wakeLock?: { request: (t: string) => Promise<WakeLockSentinel> };
        }).wakeLock?.request('screen') ?? null;
      } catch {
        /* best-effort */
      }
    })();
    return () => {
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
    };
  }, [session]);

  const status = session ? tick(session, now) : null;

  // NAPRAWKA: Hard guard PO hookach — session nigdy nie jest null ponizej
  // Poprzedni bug: MODE_CONFIG[session.mode] crash gdy session = null
  if (!session) {
    return <LoadingState />;
  }

  // session jest gwarantowane jako non-null ponizej
  const totalPhaseMs = status?.phase === 'work'
    ? MODE_CONFIG[session.mode].workMs
    : MODE_CONFIG[session.mode].restMs || 1;
  const progress = status ? 1 - status.remainingMs / totalPhaseMs : 0;

  const onStart = async () => {
    if (!taskId) return;
    const s = createSession(taskId, mode);
    setSession(s);
    await setCurrentFocusSession(
      toFocusSession(s, Date.now(), false, {
        phase: 'work',
        remainingMs: 0,
        completedCycles: 0,
        totalElapsedMs: 0,
        isRunning: true,
      })
    );
  };

  const onPause = () => setSession(pauseS(session));
  const onResume = () => setSession(resumeS(session));

  const onEnd = async (endedEarly: boolean) => {
    if (!status) return;
    const ended = Date.now();
    const finalSession = toFocusSession(session, ended, endedEarly, status);
    await addFocusSession(finalSession);
    await setCurrentFocusSession(null);
    setSession(null);
    window.location.hash = '#pulpit';
  };

  return (
    <div className="px-4 pt-10 pb-20 flex flex-col items-center gap-6 animate-in fade-in duration-500">
      <header className="text-center">
        <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: colors.textSecondary }}>
          Tryb {mode}
        </p>
        <h2 className="text-white text-xl font-bold mt-1">{task?.title ?? 'Brak zadania'}</h2>
      </header>
      <TimerCircle
        phase={status?.phase ?? 'work'}
        progress={progress}
        remainingMs={status?.remainingMs ?? MODE_CONFIG[mode].workMs}
      />
      <div className="flex gap-3 w-full max-w-[300px]">
        {!session.pausedAtMs && (
          <button onClick={onPause} className="flex-1 py-3 rounded-full font-bold border border-neonPurple text-neonPurple flex items-center justify-center gap-2">
            <Pause size={16} /> Pauza
          </button>
        )}
        {session.pausedAtMs && (
          <button onClick={onResume} className="flex-1 py-3 rounded-full font-extrabold flex items-center justify-center gap-2" style={{ backgroundColor: colors.neonGreen, color: colors.black }}>
            <Play size={16} /> Wznow
          </button>
        )}
        <button
          onClick={() => onEnd(true)} className="flex-1 py-3 rounded-full font-bold border border-red-500 text-red-500 flex items-center justify-center gap-2">
          <Square size={16} /> Zakoncz
        </button>
      </div>
    </div>
  );
};