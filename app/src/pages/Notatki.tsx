import { FC, useState } from 'react';
import { Quadrant, Task } from '../types';
import { useTasksStore } from '../store/useTasksStore';
import { Trash2, Tag } from 'lucide-react';
import { CONTAINER, GLOW, QUADRANT_COLOR, colors } from '../constants/colors';

export const Notatki: FC = () => {
  const store = useTasksStore();
  const notes: Task[] = store.tasks.filter(t => t.category === 'Notatka' && !t.isDone);
  const [classifying, setClassifying] = useState<string | null>(null);

  const onClassify = async (note: Task, q: Quadrant) => {
    await store.updateTask(note.id, {
      quadrant: q,
      category: 'Inne',
      isImportant: q === 'I' || q === 'II',
      isUrgent: q === 'I' || q === 'III',
    });
    setClassifying(null);
  };

  const onDelete = async (id: string) => {
    await store.removeTask(id);
  };

  return (
    <div className={CONTAINER}>
      <header className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Notatki</h2>
        <button
          onClick={() => { window.location.hash = '#braindump'; }}
          className="text-[10px] font-black uppercase tracking-qlabel px-3 py-1.5 rounded-pill bg-neonPurple text-white"
        >Brain Dump</button>
      </header>

      {notes.length === 0 ? (
        <p className="text-textSecondary text-sm">Brak notatek. Dorzuc cos przez Brain Dump.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map(note => (
            <li
              key={note.id}
              className="rounded-card p-4 bg-panel border border-neonPurple"
              style={{ boxShadow: GLOW.ring(colors.neonPurple) }}
            >
              <p className="text-white text-sm font-bold break-words">{note.title}</p>
              {note.noteContent && (
                <p className="text-textSecondary text-xs mt-1 whitespace-pre-wrap line-clamp-3">{note.noteContent}</p>
              )}

              {classifying === note.id ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {(['I', 'II', 'III', 'IV'] as Quadrant[]).map(q => (
                    <button
                      key={q}
                      onClick={() => void onClassify(note, q)}
                      className="px-3 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-qlabel text-midnight"
                      style={{ backgroundColor: QUADRANT_COLOR[q] }}
                    >Q{q}</button>
                  ))}
                  <button
                    onClick={() => setClassifying(null)}
                    className="px-3 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-qlabel border border-panelBorder text-textSecondary"
                  >Anuluj</button>
                </div>
              ) : (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setClassifying(note.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-qlabel text-q2 border border-q2"
                  ><Tag size={12} /> Klasyfikuj</button>
                  <button
                    onClick={() => void onDelete(note.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-qlabel text-q1 border border-q1"
                  ><Trash2 size={12} /> Usun</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notatki;
