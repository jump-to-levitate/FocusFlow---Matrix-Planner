import { FC } from 'react';
import { useTasksStore } from '../store/useTasksStore';
import { selectScheduledForDate } from '../store/selectors';
import TaskCard from '../components/TaskCard';
import { CONTAINER } from '../constants/colors';

export const DoZrobieniaDzis: FC = () => {
  const { tasks } = useTasksStore();
  const today = new Date().toISOString().split('T')[0];
  const items = selectScheduledForDate(tasks, today);
  return (
    <div className={CONTAINER}>
      <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Do zrobienia dzis</h2>
      {items.length === 0 ? (
        <p className="text-textSecondary text-sm">Brak zaplanowanych zadan na dzis.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(t => <li key={t.id}><TaskCard task={t} variant="card" /></li>)}
        </ul>
      )}
    </div>
  );
};

export default DoZrobieniaDzis;
