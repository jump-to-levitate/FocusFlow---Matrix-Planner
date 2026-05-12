import { FC, useEffect, useState } from 'react';
import { useTasksStore } from '../store/useTasksStore';
import TaskCard from '../components/TaskCard';
import { CONTAINER, colors } from '../constants/colors';

const parseDateFromHash = (): string => {
  const m = window.location.hash.match(/[?&]date=([^&]+)/);
  if (m) return decodeURIComponent(m[1]);
  return new Date().toISOString().split('T')[0];
};

export const AktywnoscDnia: FC = () => {
  const { tasks } = useTasksStore();
  const [date, setDate] = useState<string>(parseDateFromHash);

  useEffect(() => {
    const onHash = () => setDate(parseDateFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const completed = tasks.filter(t => t.completedAt && t.completedAt.startsWith(date));
  const scheduled = tasks.filter(t => t.scheduledDate === date && !t.isDone);

  return (
    <div className={CONTAINER}>
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Aktywnosc dnia</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-slate800 text-white text-sm rounded-pill px-3 py-1.5 border border-panelBorder"
        />
      </header>
      <section className="space-y-2">
        <h3 className="text-[10px] font-black uppercase tracking-qlabel" style={{ color: colors.q2 }}>Ukonczone</h3>
        {completed.length === 0 ? (
          <p className="text-textSecondary text-xs">brak</p>
        ) : (
          <ul className="space-y-2">{completed.map(t => <li key={t.id}><TaskCard task={t} variant="card" /></li>)}</ul>
        )}
      </section>
      <section className="space-y-2">
        <h3 className="text-[10px] font-black uppercase tracking-qlabel" style={{ color: colors.neonPurple }}>Zaplanowane</h3>
        {scheduled.length === 0 ? (
          <p className="text-textSecondary text-xs">brak</p>
        ) : (
          <ul className="space-y-2">{scheduled.map(t => <li key={t.id}><TaskCard task={t} variant="card" /></li>)}</ul>
        )}
      </section>
    </div>
  );
};

export default AktywnoscDnia;
