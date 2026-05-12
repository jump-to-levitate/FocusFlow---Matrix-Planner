import { FC } from 'react';
import { useTasksStore } from '../store/useTasksStore';
import { selectAllForToday, TodaySections } from '../store/selectors';
import TaskCard from '../components/TaskCard';
import { Task } from '../types';
import { CONTAINER, colors } from '../constants/colors';

const Section: FC<{ title: string; color: string; items: Task[] }> = ({ title, color, items }) => (
  <section className="space-y-2">
    <h3 className="text-[10px] font-black uppercase tracking-qlabel" style={{ color }}>{title}</h3>
    {items.length === 0 ? (
      <p className="text-textSecondary text-xs">brak</p>
    ) : (
      <ul className="space-y-2">
        {items.map(t => <li key={t.id}><TaskCard task={t} variant="card" /></li>)}
      </ul>
    )}
  </section>
);

export const WszystkoNaDzis: FC = () => {
  const { tasks } = useTasksStore();
  const today = new Date().toISOString().split('T')[0];
  const sections: TodaySections = selectAllForToday(tasks, today);
  return (
    <div className={CONTAINER}>
      <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Wszystko na dzis</h2>
      <Section title="Priorytety" color={colors.q1} items={sections.priorities} />
      <Section title="Proza zycia" color={colors.q3} items={sections.prozaZycia} />
      <Section title="Nawyki" color={colors.q2} items={sections.habits} />
      <Section title="Zaplanowane" color={colors.neonPurple} items={sections.scheduled} />
    </div>
  );
};

export default WszystkoNaDzis;
