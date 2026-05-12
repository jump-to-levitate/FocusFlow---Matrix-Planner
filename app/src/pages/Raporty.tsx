import { FC, useMemo, useState } from 'react';
import { useTasksStore } from '../store/useTasksStore';
import { Quadrant } from '../types';
import { CONTAINER, GLOW, colors } from '../constants/colors';

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const formatDay = (d: Date): string => {
  const days = ['Nd', 'Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'So'];
  return days[d.getDay()];
};

export const Raporty: FC = () => {
  const { appState, tasks } = useTasksStore();
  const [range, setRange] = useState<'week' | 'month'>('week');

  const today = startOfDay(new Date());

  const dailyFocusMinutes = useMemo(() => {
    const days: { date: Date; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * DAY_MS);
      const start = d.getTime();
      const end = start + DAY_MS;
      const minutes = appState.focusSessions
        .filter(s => {
          const t = new Date(s.startedAt).getTime();
          return t >= start && t < end;
        })
        .reduce((acc, s) => acc + s.totalElapsedMs / 60000, 0);
      days.push({ date: d, minutes: Math.round(minutes) });
    }
    return days;
  }, [appState.focusSessions, today]);

  const weeklyFocusMinutes = dailyFocusMinutes.reduce((acc, d) => acc + d.minutes, 0);

  const rangeStart = range === 'week' ? today.getTime() - 6 * DAY_MS : today.getTime() - 29 * DAY_MS;
  const completedInRange = tasks.filter(t => t.completedAt && new Date(t.completedAt).getTime() >= rangeStart);
  const perQ: Record<Quadrant, number> = { I: 0, II: 0, III: 0, IV: 0 };
  completedInRange.forEach(t => { perQ[t.quadrant]++; });

  const maxMinutes = Math.max(1, ...dailyFocusMinutes.map(d => d.minutes));

  return (
    <div className={CONTAINER}>
      <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Raporty</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className="rounded-card p-4 border bg-panel"
          style={{ borderColor: colors.neonGreen, boxShadow: GLOW.ring(colors.neonGreen) }}
        >
          <p className="text-[10px] font-black uppercase tracking-qlabel text-neonGreen mb-1">Streak</p>
          <p className="text-white text-3xl font-black">{appState.dopamineStreakCount}</p>
          <p className="text-[11px] text-textSecondary">dni z rzedu</p>
        </div>
        <div
          className="rounded-card p-4 border bg-panel"
          style={{ borderColor: colors.neonPurple, boxShadow: GLOW.ring(colors.neonPurple) }}
        >
          <p className="text-[10px] font-black uppercase tracking-qlabel text-neonPurple mb-1">Tygodniowy Focus</p>
          <p className="text-white text-3xl font-black">{weeklyFocusMinutes}</p>
          <p className="text-[11px] text-textSecondary">minut w 7 dni</p>
        </div>
        <div
          className="rounded-card p-4 border bg-panel"
          style={{ borderColor: colors.neonOrange, boxShadow: GLOW.ring(colors.neonOrange) }}
        >
          <p className="text-[10px] font-black uppercase tracking-qlabel text-neonOrange mb-1">Ukonczone ({range})</p>
          <div className="flex gap-2 text-white text-xs mt-1">
            <span>Q1: <b>{perQ.I}</b></span>
            <span>Q2: <b>{perQ.II}</b></span>
            <span>Q3: <b>{perQ.III}</b></span>
            <span>Q4: <b>{perQ.IV}</b></span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setRange('week')}
          className={`px-3 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-qlabel ${range === 'week' ? 'bg-neonGreen text-midnight' : 'bg-slate800 text-white'}`}
        >Tydzien</button>
        <button
          onClick={() => setRange('month')}
          className={`px-3 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-qlabel ${range === 'month' ? 'bg-neonGreen text-midnight' : 'bg-slate800 text-white'}`}
        >Miesiac</button>
      </div>

      <section className="rounded-card p-4 border border-panelBorder bg-panel">
        <h3 className="text-[10px] font-black uppercase tracking-qlabel text-textSecondary mb-3">Minuty focus &mdash; 7 dni</h3>
        <svg viewBox="0 0 280 120" className="w-full h-32">
          {dailyFocusMinutes.map((d, i) => {
            const h = (d.minutes / maxMinutes) * 90;
            const x = 10 + i * 38;
            return (
              <g key={i}>
                <rect x={x} y={100 - h} width={28} height={h} rx={4} fill={colors.neonGreen} opacity={0.85} />
                <text x={x + 14} y={114} textAnchor="middle" fontSize="9" fill={colors.textSecondary}>{formatDay(d.date)}</text>
                <text x={x + 14} y={100 - h - 3} textAnchor="middle" fontSize="9" fill={colors.text}>{d.minutes}</text>
              </g>
            );
          })}
        </svg>
      </section>
    </div>
  );
};

export default Raporty;
