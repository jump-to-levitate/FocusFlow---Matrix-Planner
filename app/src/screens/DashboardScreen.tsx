import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Grid2x2, Clock, Truck, Archive } from 'lucide-react';
import { db } from '../db/dexie';
import { useTimer } from '../context/TimerContext';
import type { TimerState } from '../types/timer.types';

interface NavTile {
  to: string;
  label: string;
  icon: typeof Grid2x2;
  color: string;
}

const TILES: readonly NavTile[] = [
  { to: '/matrix', label: 'Matryca',           icon: Grid2x2, color: '#A78BFA' },
  { to: '/timer',  label: 'Strefa Skupienia',  icon: Clock,   color: '#00FF66' },
  { to: '/q3',     label: 'Logistyka',         icon: Truck,   color: '#FF8C00' },
  { to: '/q4',     label: 'Strefa Redukcji',   icon: Archive, color: '#9CA3AF' },
];

const TIMER_STATUS_LABEL: Record<TimerState, string> = {
  idle: 'Bezczynny',
  running: 'Sesja w toku',
  paused: 'Wstrzymany',
  completed: 'Zakończony',
};

const TIMER_STATUS_COLOR: Record<TimerState, string> = {
  idle: '#6B7280',
  running: '#00FF66',
  paused: '#FF8C00',
  completed: '#D000FF',
};

export const DashboardScreen = () => {
  const navigate = useNavigate();
  const { state: timerState } = useTimer();
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];

  const q1Count = useMemo(
    () => tasks.filter(t => t.quadrant === 1 && !t.completed).length,
    [tasks],
  );

  const statusLabel = TIMER_STATUS_LABEL[timerState];
  const statusColor = TIMER_STATUS_COLOR[timerState];

  return (
    <div className="w-full min-h-screen bg-[#0A0512] text-white flex flex-col font-sans">
      <header className="h-14 w-full border-b border-[#1F192F] px-4 flex items-center justify-center bg-[#0E081B]/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A78BFA] tracking-wide uppercase whitespace-nowrap">
          FocusFlow
        </h1>
      </header>

      <main className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        <section className="p-4 bg-[#130B24] border border-[#1F192F] rounded-xl">
          <p className="text-xs font-semibold text-[#7C3AED] uppercase tracking-wider mb-2 whitespace-nowrap">
            Twój fokus
          </p>
          <p className="text-sm text-[#E8D5FF] leading-relaxed">
            Masz dziś{' '}
            <span className="font-bold text-[#00FF66]">{q1Count}</span>{' '}
            {q1Count === 1 ? 'aktywne zadanie' : 'aktywnych zadań'} w Kwadrancie 1.
          </p>
        </section>

        <section
          className="p-4 bg-[#130B24] border border-[#1F192F] rounded-xl flex items-center justify-between gap-2 min-w-0"
          style={{ borderLeftColor: statusColor, borderLeftWidth: '3px' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="w-4 h-4 shrink-0" style={{ color: statusColor }} />
            <span
              className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
              style={{ color: statusColor }}
            >
              Timer
            </span>
          </div>
          <span
            className="text-xs font-mono px-2 py-1 rounded-md border whitespace-nowrap shrink-0"
            style={{
              color: statusColor,
              borderColor: `${statusColor}66`,
              backgroundColor: `${statusColor}1A`,
            }}
          >
            {statusLabel}
          </span>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {TILES.map(({ to, label, icon: Icon, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="bg-[#130B24] border border-[#1F192F] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-[#3B2E54] active:scale-[0.97] transition-all aspect-square min-w-0"
            >
              <Icon className="w-6 h-6 shrink-0" style={{ color }} />
              <span
                className="text-[11px] font-semibold whitespace-nowrap"
                style={{ color }}
              >
                {label}
              </span>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
};
