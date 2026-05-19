import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { TimerMode, TimerState, TimerSession, TimerDerivedState } from '../types/timer.types';
import { TIMER_PRESETS } from '../constants/timerPresets';
import { computeTimerDerivedState } from '../utils/timerEngine';

export interface TimerContextState {
  session: TimerSession | null;
  mode: TimerMode;
  state: TimerState;
}

export interface TimerContextContent extends TimerContextState {
  derived: TimerDerivedState;
  startTimer: (presetId: string, taskId?: number | null) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  completeTimer: () => void;
}

type TimerAction =
  | { type: 'START'; payload: { presetId: string; taskId: number | null } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'COMPLETE' }
  | { type: 'TICK' };

const initialState: TimerContextState = {
  session: null,
  mode: 'idle',
  state: 'idle',
};

function timerReducer(state: TimerContextState, action: TimerAction): TimerContextState {
  const now = Date.now();
  
  switch (action.type) {
    case 'START': {
      const preset = TIMER_PRESETS.find(p => p.id === action.payload.presetId);
      if (!preset) return state;
      
      const durationMs = preset.focusMinutes * 60 * 1000;
      const newSession: TimerSession = {
        id: `session_${now}_${Math.random().toString(36).substr(2, 9)}`,
        taskId: action.payload.taskId,
        presetId: action.payload.presetId,
        startedAt: now,
        expectedEndAt: now + durationMs,
        pausedAt: null,
        totalPausedMs: 0,
        completedAt: null,
      };
      
      return {
        session: newSession,
        mode: 'focus',
        state: 'running',
      };
    }
    
    case 'PAUSE': {
      if (state.state !== 'running' || !state.session) return state;
      return {
        ...state,
        state: 'paused',
        session: {
          ...state.session,
          pausedAt: now,
        },
      };
    }
    
    case 'RESUME': {
      if (state.state !== 'paused' || !state.session || state.session.pausedAt === null) return state;
      const pauseDuration = now - state.session.pausedAt;
      return {
        ...state,
        state: 'running',
        session: {
          ...state.session,
          pausedAt: null,
          totalPausedMs: state.session.totalPausedMs + pauseDuration,
        },
      };
    }
    
    case 'STOP':
      return initialState;
      
    case 'COMPLETE': {
      if (!state.session) return state;
      return {
        ...state,
        state: 'completed',
        session: {
          ...state.session,
          completedAt: now,
        },
      };
    }
    
    case 'TICK':
      return { ...state };
      
    default:
      return state;
  }
}

const TimerContext = createContext<TimerContextContent | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  const totalDurationMs = useMemo(() => {
    if (!state.session) return 0;
    const preset = TIMER_PRESETS.find(p => p.id === state.session?.presetId);
    return preset ? preset.focusMinutes * 60 * 1000 : 0;
  }, [state.session?.presetId]);

  const derived = useMemo(() => {
    return computeTimerDerivedState(state.session, state.state, totalDurationMs);
  }, [state.session, state.state, totalDurationMs, state]);

  useEffect(() => {
    if (state.state === 'running' && derived.remainingMs === 0) {
      dispatch({ type: 'COMPLETE' });
    }
  }, [derived.remainingMs, state.state]);

  useEffect(() => {
    if (state.state !== 'running') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.state]);

  const startTimer = (presetId: string, taskId: number | null = null) => {
    dispatch({ type: 'START', payload: { presetId, taskId } });
  };
  const pauseTimer = () => dispatch({ type: 'PAUSE' });
  const resumeTimer = () => dispatch({ type: 'RESUME' });
  const stopTimer = () => dispatch({ type: 'STOP' });
  const completeTimer = () => dispatch({ type: 'COMPLETE' });

  return (
    <TimerContext.Provider
      value={{
        ...state,
        derived,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        completeTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextContent => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
