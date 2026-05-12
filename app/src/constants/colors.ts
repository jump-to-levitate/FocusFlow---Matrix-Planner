import type { Quadrant } from '../types';

export const colors = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  background: '#0f172a',
  surface: '#1e293b',
  card: '#121212',
  text: '#f1f5f9',
  textSecondary: '#B0B0B0',
  neonGreen: '#39FF14',
  neonPurple: '#A020F0',
  neonOrange: '#FB923C',
  neonRed: '#FF4D4D',
  neonSlate: '#64748B',
  black: '#000000',
  q1: '#FF4D4D',
  q2: '#39FF14',
  q3: '#FB923C',
  q4: '#64748B',
  panel: '#121212',
  panelBorder: '#2A2A2A',
} as const;

export const QUADRANT_COLOR: Record<Quadrant, string> = {
  I: colors.neonRed,
  II: colors.neonGreen,
  III: colors.neonOrange,
  IV: colors.neonSlate,
};

export const QUADRANT_LABEL: Record<Quadrant, string> = {
  I: 'PILNE I WAZNE',
  II: 'WAZNE, NIEPILNE',
  III: 'PILNE, NIEWAZNE',
  IV: 'NIEPILNE, NIEWAZNE',
};

export const GLOW = {
  ring: (hex: string): string => `0 0 15px ${hex}22`,
  soft: (hex: string): string => `0 0 8px ${hex}22`,
  hero: (hex: string): string => `0 0 20px ${hex}33, 0 0 8px ${hex}22`,
};

export interface QuadClasses {
  border: string;
  text: string;
  bg: string;
}

export const QUADRANT_CLASSES: Record<Quadrant, QuadClasses> = {
  I: { border: 'border-q1', text: 'text-q1', bg: 'bg-q1' },
  II: { border: 'border-q2', text: 'text-q2', bg: 'bg-q2' },
  III: { border: 'border-q3', text: 'text-q3', bg: 'bg-q3' },
  IV: { border: 'border-q4', text: 'text-q4', bg: 'bg-q4' },
};

export const CONTAINER = 'px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700';

export const HEADER_OFFSET = 'pt-16';
