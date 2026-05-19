// ============================================================================
// FocusFlow 2.0 - Matrix Screen (Macierz Eisenhowera)
// 2×2 grid with 4 quadrants — sub-views moved to dedicated routes /q2 /q3 /q4
// ============================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { QuadrantCard } from '../components/QuadrantCard';
import { QuizModal } from '../components/quiz/QuizModal';
import { db } from '../db/dexie';

export const MatrixScreen = () => {
  const navigate = useNavigate();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<1 | 2 | 3 | 4 | null>(null);

  const allTasks = useLiveQuery(
    () => db.tasks.toArray().catch(err => {
      console.error('[Matrix] Dexie query failed:', err);
      return [];
    })
  );
  const safeTasks = Array.isArray(allTasks) ? allTasks : [];
  const tasks = safeTasks.filter(t => !t.completed && t.quadrant !== 0);
  const q1 = tasks.filter(t => t.quadrant === 1);
  const q2 = tasks.filter(t => t.quadrant === 2);
  const q3 = tasks.filter(t => t.quadrant === 3);
  const q4 = tasks.filter(t => t.quadrant === 4);

  const completeTask = (id: number) => {
    db.tasks.update(id, { completed: true });
  };

  const openQuiz = (q: 1 | 2 | 3 | 4) => {
    setSelectedQuadrant(q);
    setIsQuizOpen(true);
  };

  const closeQuiz = () => {
    setIsQuizOpen(false);
    setSelectedQuadrant(null);
  };

  return (
    <>
      <QuizModal isOpen={isQuizOpen} onClose={closeQuiz} initialQuadrant={selectedQuadrant} />
      <div className="flex flex-col h-full pt-4 pb-4">
        <header className="mb-4 shrink-0">
          <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-1">Macierz</h1>
          <p className="text-sm text-white/50 font-medium">Eisenhower Matrix 2×2</p>
        </header>

        <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1 min-h-0">
          <QuadrantCard
            quadrant={1}
            title="Pilne i Ważne"
            subtitle="Rób teraz"
            color="lime"
            tasks={q1}
            onComplete={completeTask}
            onAdd={() => openQuiz(1)}
          />

          <QuadrantCard
            quadrant={2}
            title="WAŻNE, NIEPILNE"
            subtitle="Zaplanuj"
            color="purple"
            tasks={q2}
            onComplete={completeTask}
            onAdd={() => openQuiz(2)}
            headerAction={
              <button
                onClick={() => navigate('/q2')}
                className="hover:shadow-[0_0_15px_rgba(208,0,255,0.4)] text-[#D000FF] text-xs font-semibold px-2 py-1 rounded border border-[#D000FF]/30 transition-all cursor-pointer whitespace-nowrap"
                title="Centrum Planowania"
              >
                Centrum Planowania ↗
              </button>
            }
          />

          <QuadrantCard
            quadrant={3}
            title="PILNE, NIEWAŻNE"
            subtitle="Proza życia"
            color="orange"
            tasks={q3}
            onComplete={completeTask}
            onAdd={() => openQuiz(3)}
            headerAction={
              <button
                onClick={() => navigate('/q3')}
                className="hover:shadow-[0_0_15px_rgba(255,140,0,0.4)] text-[#FF8C00] text-xs font-semibold px-2 py-1 rounded border border-[#FF8C00]/30 transition-all cursor-pointer whitespace-nowrap"
                title="Hub Logistyki"
              >
                Hub logistyki ↗
              </button>
            }
          />

          <QuadrantCard
            quadrant={4}
            title="NIEWAŻNE, NIEPILNE"
            subtitle="Nie teraz"
            color="slate"
            tasks={q4}
            onComplete={completeTask}
            onAdd={() => openQuiz(4)}
            headerAction={
              <button
                onClick={() => navigate('/q4')}
                className="hover:shadow-[0_0_15px_rgba(156,163,175,0.4)] text-[#9CA3AF] text-xs font-semibold px-2 py-1 rounded border border-[#9CA3AF]/30 transition-all cursor-pointer whitespace-nowrap"
                title="Strefa Redukcji"
              >
                Strefa Redukcji ↗
              </button>
            }
          />
        </div>
      </div>
    </>
  );
};

export default MatrixScreen;
