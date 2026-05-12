import { FC } from 'react';
import { useTasksStore } from '../store/useTasksStore';
import TaskCard from '../components/TaskCard';
import { CONTAINER } from '../constants/colors';

export const WielkieProjekty: FC = () => {
  const { tasks } = useTasksStore();
  const items = [...tasks.filter(t => t.category === 'WielkiProjekt')]
    .sort((a, b) => b.sessionsCount - a.sessionsCount);

  const openNote = (id: string) => { window.location.hash = `#notatnik?taskId=${id}`; };

  return (
    <div className={CONTAINER}>
      <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Wielkie projekty</h2>
      {items.length === 0 ? (
        <p className="text-textSecondary text-sm">Brak projektow.</p>
      ) : (
        <ul className="space-y-2">{items.map(t => (
          <li key={t.id} className="flex items-center gap-3">
            <div className="flex-1" onClick={() => openNote(t.id)}>
              <TaskCard task={t} variant="card" onClick={() => openNote(t.id)} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-qlabel text-q2 whitespace-nowrap">{t.sessionsCount} sesji</span>
          </li>
        ))}</ul>
      )}
    </div>
  );
};

export default WielkieProjekty;
