import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2 } from 'lucide-react';
import { db, type Task } from '../db/dexie';

export const Q4ArchiveScreen = () => {
  const navigate = useNavigate();
  const allTasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];

  const q4Tasks = useMemo<Task[]>(
    () => allTasks.filter(t => t.quadrant === 4 && !t.completed),
    [allTasks],
  );

  const purgeQ4 = async (): Promise<void> => {
    await db.tasks.where('quadrant').equals(4).delete();
  };

  const isEmpty = q4Tasks.length === 0;

  return (
    <div className="w-full min-h-screen bg-[#0A0512] text-white flex flex-col font-sans selection:bg-red-500/30">
      <header className="h-14 w-full border-b border-[#1F192F] px-4 flex items-center justify-between bg-[#0E081B]/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-[#9CA3AF] hover:text-white transition-colors text-sm flex items-center gap-1 whitespace-nowrap"
        >
          <span>←</span>
          <span className="whitespace-nowrap">Matryca</span>
        </button>
        <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FF4444] tracking-wide uppercase whitespace-nowrap">
          Strefa Redukcji Q4
        </h1>
        <div className="w-8 h-8 shrink-0" aria-hidden="true" />
      </header>

      <main className="flex-1 flex flex-col px-3 py-4 min-h-0">
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {isEmpty ? (
            <p className="text-center text-[#6B7280] text-sm italic py-12 whitespace-nowrap">
              Strefa Q4 jest pusta. Cisza Wojownika.
            </p>
          ) : (
            q4Tasks.map(task => (
              <div
                key={task.id}
                className="p-3 bg-[#130B24] border border-[#1F192F] rounded-xl flex items-center gap-2 min-w-0"
              >
                <span className="w-2 h-2 rounded-full bg-[#9CA3AF] shrink-0" aria-hidden="true" />
                <span className="flex-1 text-sm text-[#E8D5FF] truncate min-w-0">
                  {task.title}
                </span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => void purgeQ4()}
          disabled={isEmpty}
          className="mt-4 w-full py-4 px-4 rounded-xl bg-red-600/20 border-2 border-red-600 text-red-300 font-black uppercase tracking-widest text-sm whitespace-nowrap flex items-center justify-center gap-2 hover:bg-red-600/30 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Trash2 className="w-5 h-5 shrink-0" />
          <span className="whitespace-nowrap">Uruchom Właz Destrukcyjny</span>
        </button>
      </main>
    </div>
  );
};
