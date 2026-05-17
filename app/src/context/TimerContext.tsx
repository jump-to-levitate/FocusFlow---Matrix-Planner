import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import { type TimerMode, type TimerState, type TimerContextValue, TIMER_PRESETS } from '../types/timer';

const TimerContext = createContext<TimerContextValue | null>(null);

export const useTimer = (): TimerContextValue => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

// Simple beep using Web Audio API for PWA audio unlock
const getAudioContext = (): typeof AudioContext | undefined => {
  return (globalThis as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
    || (globalThis as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
};

const unlockAudioContext = () => {
  try {
    const AC = getAudioContext();
    if (AC) {
      const ctx = new AC();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.01;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.001);
    }
  } catch {
    // Silent fail
  }
};

const playAlarmSound = () => {
  try {
    const AC = getAudioContext();
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.value = 880;
      gain2.gain.value = 0.3;
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.5);
    }, 600);
  } catch (err) {
    console.log('Audio play blocked', err);
  }
};

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<TimerMode | null>(null);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [expectedEndTime, setExpectedEndTime] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    clearTimerInterval();
    playAlarmSound();
    const preset = mode ? TIMER_PRESETS.find(p => p.id === mode) : null;
    if (preset && preset.breakMinutes > 0 && timerState === 'running') {
      // Work completed, start break
      setTimerState('break');
      setTimeLeft(preset.breakMinutes * 60);
      setExpectedEndTime(Date.now() + preset.breakMinutes * 60 * 1000);
    } else if (timerState === 'break') {
      // Break completed, show completion modal
      setShowCompletionModal(true);
    } else {
      // Work completed (no break), show completion modal
      setShowCompletionModal(true);
    }
  }, [clearTimerInterval, mode, timerState]);

  useEffect(() => {
    if (timerState === 'running' || timerState === 'break') {
      intervalRef.current = window.setInterval(() => {
        if (expectedEndTime) {
          const newTimeLeft = Math.max(0, Math.ceil((expectedEndTime - Date.now()) / 1000));
          setTimeLeft(newTimeLeft);
          if (newTimeLeft === 0) {
            handleTimerComplete();
          }
        }
      }, 1000);
    } else {
      clearTimerInterval();
    }
    return () => clearTimerInterval();
  }, [timerState, expectedEndTime, clearTimerInterval, handleTimerComplete]);

  const startTimer = useCallback((newMode: TimerMode) => {
    unlockAudioContext();
    const preset = TIMER_PRESETS.find(p => p.id === newMode);
    if (!preset) return;
    setMode(newMode);
    const seconds = preset.workMinutes * 60;
    setTimeLeft(seconds);
    setExpectedEndTime(Date.now() + seconds * 1000);
    setTimerState('running');
  }, []);

  const startTimeBox = useCallback((targetTimeStr: string) => {
    unlockAudioContext();
    const [hours, minutes] = targetTimeStr.split(':').map(Number);
    const now = new Date();
    let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
    let targetTimestamp = target.getTime();
    if (targetTimestamp < Date.now()) {
      targetTimestamp += 24 * 60 * 60 * 1000;
    }
    const secondsLeft = Math.ceil((targetTimestamp - Date.now()) / 1000);
    setMode('timebox');
    setTimeLeft(secondsLeft);
    setExpectedEndTime(targetTimestamp);
    setTimerState('running');
  }, []);

  const pauseTimer = useCallback(() => {
    clearTimerInterval();
    setTimerState('paused');
    setExpectedEndTime(null);
  }, [clearTimerInterval]);

  const resumeTimer = useCallback(() => {
    unlockAudioContext();
    setExpectedEndTime(Date.now() + timeLeft * 1000);
    setTimerState('running');
  }, [timeLeft]);

  const stopTimer = useCallback(() => {
    clearTimerInterval();
    setTimerState('idle');
    setExpectedEndTime(null);
    setTimeLeft(0);
    setMode(null);
    setShowCompletionModal(false);
  }, [clearTimerInterval]);

  const setActiveTask = useCallback((taskId: number | null) => {
    setActiveTaskId(taskId);
  }, []);

  const value: TimerContextValue = {
    mode,
    timerState,
    timeLeft,
    activeTaskId,
    expectedEndTime,
    showCompletionModal,
    setShowCompletionModal,
    startTimer,
    startTimeBox,
    pauseTimer,
    resumeTimer,
    stopTimer,
    setActiveTask,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
