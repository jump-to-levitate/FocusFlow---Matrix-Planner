import { TimerPreset } from '../types/timer.types';

export const TIMER_PRESETS: readonly TimerPreset[] = [
  { id: 'quick5', label: 'Szybkie 5 min (Zacznij cokolwiek)', focusMinutes: 5, breakMinutes: 0, category: 'quick' },
  { id: 'quick10', label: 'Szybkie 10 min (Brain Dump)', focusMinutes: 10, breakMinutes: 0, category: 'quick' },
  { id: 'pomodoro15', label: 'Standard 15/5 (Krótki sprint)', focusMinutes: 15, breakMinutes: 5, category: 'standard' },
  { id: 'pomodoro25', label: 'Klasyczne 25/5 (Pomodoro)', focusMinutes: 25, breakMinutes: 5, category: 'standard' },
  { id: 'deep45', label: 'Głębokie 45/0 (Time Boxing)', focusMinutes: 45, breakMinutes: 0, category: 'custom' },
  { id: 'deep50', label: 'Skupienie 50/10 (Głęboka praca)', focusMinutes: 50, breakMinutes: 10, category: 'deep' },
  { id: 'deep90', label: 'Ekstremalne 90/15 (Hyperfocus)', focusMinutes: 90, breakMinutes: 15, category: 'deep' },
] as const;

export type PresetId = typeof TIMER_PRESETS[number]['id'];
