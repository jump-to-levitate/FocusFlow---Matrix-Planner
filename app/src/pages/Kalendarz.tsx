import { FC, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasksStore } from '../store/useTasksStore';
import { CONTAINER, GLOW, colors } from '../constants/colors';

const DAY_LABELS = ['Pn', 'Wt', 'Sr', 'Cz', 'Pt', 'So', 'Nd'];

const toIso = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const monthLabel = (d: Date): string => {
  const names = ['Styczen', 'Luty', 'Marzec', 'Kwiecien', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpien', 'Wrzesien', 'Pazdziernik', 'Listopad', 'Grudzien'];
  return `${names[d.getMonth()]} ${d.getFullYear()}`;
};

interface DayCell {
  iso: string;
  date: number;
  inMonth: boolean;
  completed: number;
  scheduled: number;
  isToday: boolean;
}

const intensity = (count: number): number => Math.min(0.1 + count * 0.15, 1.0);

export const Kalendarz: FC = () => {
  const { tasks } = useTasksStore();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(1);
    return d;
  });

  const todayIso = toIso(new Date());

  const days = useMemo<DayCell[]>(() => {
    const firstDay = new Date(cursor);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - startOffset);
    const cells: DayCell[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = toIso(d);
      const completed = tasks.filter(t => t.completedAt && t.completedAt.startsWith(iso)).length;
      const scheduled = tasks.filter(t => !t.isDone && t.scheduledDate === iso).length;
      cells.push({
        iso,
        date: d.getDate(),
        inMonth: d.getMonth() === cursor.getMonth(),
        completed,
        scheduled,
        isToday: iso === todayIso,
      });
    }
    return cells;
  }, [cursor, tasks, todayIso]);

  const prev = () => setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  const next = () => setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  const openDay = (iso: string) => { window.location.hash = `#aktywnosc?date=${iso}`; };

  return (
    <div className={CONTAINER}>
      <header className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Kalendarz</h2>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="w-9 h-9 rounded-pill bg-slate800 text-white flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>
          <span className="text-textSecondary text-sm min-w-[140px] text-center uppercase tracking-qlabel">{monthLabel(cursor)}</span>
          <button onClick={next} className="w-9 h-9 rounded-pill bg-slate800 text-white flex items-center justify-center">
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <section
        className="rounded-card p-4 bg-panel border border-neonPurple"
        style={{ boxShadow: GLOW.ring(colors.neonPurple) }}
      >
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-qlabel text-textSecondary">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((cell) => {
            const greenOpacity = intensity(cell.completed);
            const purpleOpacity = intensity(cell.scheduled);
            return (
              <button
                key={cell.iso}
                onClick={() => openDay(cell.iso)}
                className={`relative aspect-square rounded-card flex items-center justify-center text-xs font-bold ${cell.inMonth ? 'text-white' : 'text-textSecondary opacity-40'} ${cell.isToday ? 'ring-2 ring-q2' : ''}`}
              >
                <span
                  className="absolute inset-0 rounded-card bg-q2"
                  style={{ opacity: cell.completed > 0 ? greenOpacity : 0 }}
                />
                <span
                  className="absolute inset-0 rounded-card bg-neonPurple"
                  style={{ opacity: cell.scheduled > 0 && cell.completed === 0 ? purpleOpacity : 0 }}
                />
                <span className="relative z-10">{cell.date}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] font-black uppercase tracking-qlabel">
          <span className="flex items-center gap-2 text-q2">
            <span className="w-3 h-3 rounded-card bg-q2" /> Zrobione
          </span>
          <span className="flex items-center gap-2 text-neonPurple">
            <span className="w-3 h-3 rounded-card bg-neonPurple" /> Planowane
          </span>
        </div>
      </section>
    </div>
  );
};

export default Kalendarz;
