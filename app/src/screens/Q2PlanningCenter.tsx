import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Target, Repeat, MoreHorizontal, Plus } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Q2Tile } from '../components/Q2Tile';
import { QuizModal } from '../components/quiz/QuizModal';
import { db, type Task, type Q2Subcategory } from '../db/dexie';

export const Q2PlanningCenter = () => {
  const navigate = useNavigate();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];

  const q2Grouped = useMemo<Record<Q2Subcategory, Task[]>>(() => {
    const groups: Record<Q2Subcategory, Task[]> = {
      rutyna: [],
      projekt: [],
      ogolny_cel: [],
      inne: [],
    };
    for (const task of tasks) {
      if (task.quadrant !== 2 || task.completed) continue;
      const sub = task.subcategory;
      const key: Q2Subcategory =
        sub === 'rutyna' || sub === 'projekt' || sub === 'ogolny_cel'
          ? sub
          : 'inne';
      groups[key].push(task);
    }
    return groups;
  }, [tasks]);

  const totalActive =
    q2Grouped.rutyna.length +
    q2Grouped.projekt.length +
    q2Grouped.ogolny_cel.length +
    q2Grouped.inne.length;

  const handleTaskClick = (task: Task) => {
    navigate(`/timer?taskId=${task.id}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0512] text-white flex flex-col justify-between font-sans selection:bg-[#D000FF]/30">
      <header className="h-14 w-full border-b border-[#1F192F] px-4 flex items-center justify-between bg-[#0E081B]/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-[#9CA3AF] hover:text-white transition-colors text-sm flex items-center gap-1 whitespace-nowrap"
        >
          <span>←</span>
          <span className="whitespace-nowrap">Matryca</span>
        </button>
        <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A78BFA] tracking-wide uppercase whitespace-nowrap">
          Centrum Planowania
        </h1>
        <button
          onClick={() => setIsQuizOpen(true)}
          className="w-8 h-8 flex items-center justify-center bg-[#D000FF] hover:bg-[#B800E6] rounded-lg transition-colors shrink-0"
          aria-label="Dodaj zadanie Q2"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </header>

      <main className="flex-1 p-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <Q2Tile
            title="Rutyny"
            subcategory="rutyna"
            tasks={q2Grouped.rutyna}
            color="#D000FF"
            onTaskClick={handleTaskClick}
            icon={<Repeat className="w-5 h-5" />}
          />
          <Q2Tile
            title="Projekty"
            subcategory="projekt"
            tasks={q2Grouped.projekt}
            color="#00FF66"
            onTaskClick={handleTaskClick}
            icon={<Folder className="w-5 h-5" />}
          />
          <Q2Tile
            title="Ogólne cele"
            subcategory="ogolny_cel"
            tasks={q2Grouped.ogolny_cel}
            color="#00FF66"
            onTaskClick={handleTaskClick}
            icon={<Target className="w-5 h-5" />}
          />
          <Q2Tile
            title="Inne"
            subcategory="inne"
            tasks={q2Grouped.inne}
            color="#D000FF"
            onTaskClick={handleTaskClick}
            icon={<MoreHorizontal className="w-5 h-5" />}
          />
        </div>

        <div className="mt-4 p-3 bg-[#130B24] border border-[#1F192F] rounded-xl">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span className="whitespace-nowrap">Aktywne zadania Q2:</span>
            <span className="font-mono font-bold text-white whitespace-nowrap">
              {totalActive}
            </span>
          </div>
        </div>
      </main>

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        initialQuadrant={2}
        bypassMode={true}
      />
    </div>
  );
};
