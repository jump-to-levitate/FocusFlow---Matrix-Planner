export type TimerMode =
  | 'pogromca_5_0'
  | 'sprint_10_0'
  | 'light_15_5'
  | 'classic_25_5'
  | 'flow_50_10'
  | 'deep_90_15'
  | 'timebox';

export type TimerState = 'idle' | 'running' | 'paused' | 'break';

export interface TimerPreset {
  id: TimerMode;
  label: string;
  workMinutes: number;
  breakMinutes: number;
  description: string;
  color: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  { id: 'pogromca_5_0', label: 'Pogromca', workMinutes: 5, breakMinutes: 0, description: 'Pogromca Paraliżu', color: '#FF2E63' },
  { id: 'sprint_10_0', label: 'Sprint', workMinutes: 10, breakMinutes: 0, description: 'Szybki Sprint', color: '#FFA502' },
  { id: 'light_15_5', label: 'Lekkie', workMinutes: 15, breakMinutes: 5, description: 'Lekkie Pomodoro', color: '#00F0FF' },
  { id: 'classic_25_5', label: 'Klasyczne', workMinutes: 25, breakMinutes: 5, description: 'Klasyczne Pomodoro', color: '#00FF88' },
  { id: 'flow_50_10', label: 'Przepływ', workMinutes: 50, breakMinutes: 10, description: 'Głęboki Przepływ', color: '#7B61FF' },
  { id: 'deep_90_15', label: 'Deep', workMinutes: 90, breakMinutes: 15, description: 'Hyperfocus Deep', color: '#D000FF' },
  { id: 'timebox', label: 'Time Box', workMinutes: 0, breakMinutes: 0, description: 'Time Boxing', color: '#FFD700' },
];

export interface TimerContextValue {
  mode: TimerMode | null;
  timerState: TimerState;
  timeLeft: number;
  activeTaskId: number | null;
  expectedEndTime: number | null;
  showCompletionModal: boolean;
  setShowCompletionModal: (show: boolean) => void;
  startTimer: (mode: TimerMode) => void;
  startTimeBox: (targetTimeStr: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  setActiveTask: (taskId: number | null) => void;
}

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
