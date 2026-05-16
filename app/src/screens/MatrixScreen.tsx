// ============================================================================
// FocusFlow 2.0 - Matrix Screen (Macierz Eisenhowera)
// 2×2 grid with 4 quadrants
// PDF Reference: str. 16
// ============================================================================

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { QuadrantCard } from '../components/QuadrantCard';
import { QuizModal } from '../components/quiz/QuizModal';
import { db } from '../db/dexie';

export const MatrixScreen = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<1 | 2 | 3 | 4 | null>(null);

  const tasks = useLiveQuery(() => db.tasks.where('completed').equals(0).toArray()) ?? [];
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
      {/* Header */}
      <header className="mb-4 shrink-0">
        <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-1">Macierz</h1>
        <p className="text-sm text-white/50 font-medium">Eisenhower Matrix 2×2</p>
      </header>

      {/* Matrix Grid 2×2 - fills remaining space */}
      <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1 min-h-0">
        {/* Q1 - Urgent & Important (Fire) */}
        <QuadrantCard
          quadrant={1}
          title="Pilne i Ważne"
          subtitle="Rób teraz"
          color="lime"
          tasks={q1}
          onComplete={completeTask}
          onAdd={() => openQuiz(1)}
        />

        {/* Q2 - Not Urgent & Important (Growth) */}
        <QuadrantCard
          quadrant={2}
          title="Niepilne i Ważne"
          subtitle="Zaplanuj"
          color="purple"
          tasks={q2}
          onComplete={completeTask}
          onAdd={() => openQuiz(2)}
        />

        {/* Q3 - Urgent & Not Important (Admin) */}
        <QuadrantCard
          quadrant={3}
          title="Pilne i Nieważne"
          subtitle="Deleguj"
          color="orange"
          tasks={q3}
          onComplete={completeTask}
          onAdd={() => openQuiz(3)}
        />

        {/* Q4 - Not Urgent & Not Important (Waste) */}
        <QuadrantCard
          quadrant={4}
          title="Niepilne i Nieważne"
          subtitle="Eliminuj"
          color="slate"
          tasks={q4}
          onComplete={completeTask}
          onAdd={() => openQuiz(4)}
        />
      </div>
    </div>
    </>
  );
};

export default MatrixScreen;

