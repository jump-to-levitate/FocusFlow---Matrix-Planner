import { FC, useEffect, useState } from 'react';
import { useTasksStore } from '../store/useTasksStore';
import { Task } from '../types';
import { CONTAINER } from '../constants/colors';

export const Notatnik: FC = () => {
  const store = useTasksStore();
  const [task, setTask] = useState<Task | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const match = window.location.hash.match(/[?&]taskId=([^&]+)/);
    if (match) {
      const found = store.tasks.find(t => t.id === match[1]);
      if (found) {
        setTask(found);
        setNote(found.noteContent || '');
      }
    }
  }, [store.tasks]);

  const save = async () => {
    if (!task) return;
    await store.updateTask(task.id, { noteContent: note });
  };

  if (!task) {
    return (
      <div className={CONTAINER}>
        <p className="text-textSecondary text-sm">Nie wybrano zadania.</p>
      </div>
    );
  }

  return (
    <div className={CONTAINER}>
      <h2 className="text-xl font-black uppercase tracking-qlabel text-white">Notatnik: {task.title}</h2>
      <textarea
        className="w-full h-40 p-3 rounded-card text-white bg-panel border border-panelBorder focus:outline-none focus:border-neonPurple"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <button
        onClick={save}
        className="px-4 py-2 rounded-pill text-midnight font-black uppercase tracking-qlabel bg-neonGreen"
      >
        Zapisz
      </button>
    </div>
  );
};

export default Notatnik;
