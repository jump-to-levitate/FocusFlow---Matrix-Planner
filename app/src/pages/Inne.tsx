import { FC } from 'react';
import { useTasksStore } from '../store/useTasksStore';
import TaskCard from '../components/TaskCard';
import { CONTAINER } from '../constants/colors';

export const Inne: FC = () => {
  const { tasks } = useTasksStore();
  const items = tasks.filter(t => t.category === 'Inne');
  return (
    <div className={CONTAINER}>
      <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Inne</h2>
      {items.length === 0 ? (
        <p className="text-textSecondary text-sm">Brak.</p>
      ) : (
        <ul className="space-y-2">{items.map(t => <li key={t.id}><TaskCard task={t} variant="card" /></li>)}</ul>
      )}
    </div>
  );
};

export default Inne;
