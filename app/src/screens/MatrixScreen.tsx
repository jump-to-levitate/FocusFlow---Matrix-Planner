// ============================================================================
// FocusFlow 2.0 - Matrix Screen (Macierz Eisenhowera)
// 2×2 grid with 4 quadrants
// PDF Reference: str. 16
// ============================================================================

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { QuadrantCard } from '../components/QuadrantCard';
import { QuizModal } from '../components/quiz/QuizModal';
import { db, type Task } from '../db/dexie';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const MatrixScreen = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<1 | 2 | 3 | 4 | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'q2'>('grid');

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

  // Group Q2 tasks by subcategory - null/undefined/empty treated as 'inne'
  const groupQ2BySubcategory = (tasks: Task[]) => {
    const groups: Record<string, Task[]> = {
      rutyna: [],
      projekt: [],
      ogolny_cel: [],
      inne: [],
    };
    tasks.forEach(task => {
      const sub = task.subcategory;
      // Treat null, undefined, or empty string as 'inne'
      const normalizedSub = !sub || sub === '' ? 'inne' : sub;
      if (groups[normalizedSub]) {
        groups[normalizedSub].push(task);
      } else {
        groups.inne.push(task);
      }
    });
    return groups;
  };


  return (
    <>
    <QuizModal isOpen={isQuizOpen} onClose={closeQuiz} initialQuadrant={selectedQuadrant} />
    <div className="flex flex-col h-full pt-4 pb-4">
      {/* Header - hidden in Q2 view */}
      {viewMode === 'grid' && (
        <header className="mb-4 shrink-0">
          <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-1">Macierz</h1>
          <p className="text-sm text-white/50 font-medium">Eisenhower Matrix 2×2</p>
        </header>
      )}

      {/* VIEW: Grid 2×2 - Default Matrix View */}
      {viewMode === 'grid' && (
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

          {/* Q2 - Not Urgent & Important (Growth) - with expand button */}
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
                onClick={() => setViewMode('q2')}
                className="hover:shadow-[0_0_15px_rgba(208,0,255,0.4)] text-[#D000FF] text-xs font-semibold px-2 py-1 rounded border border-[#D000FF]/30 transition-all cursor-pointer"
                title="Centrum Planowania"
              >
                Centrum Planowania ↗
              </button>
            }
          />

          {/* Q3 - Urgent & Not Important (Admin) */}
          <QuadrantCard
            quadrant={3}
            title="PILNE, NIEWAŻNE"
            subtitle="proza życia"
            color="orange"
            tasks={q3}
            onComplete={completeTask}
            onAdd={() => openQuiz(3)}
            headerAction={
              <button
                onClick={() => alert('Hub Logistyki - Coming Soon')}
                className="hover:shadow-[0_0_15px_rgba(255,140,0,0.4)] text-[#FF8C00] text-xs font-semibold px-2 py-1 rounded border border-[#FF8C00]/30 transition-all cursor-pointer"
                title="Hub Logistyki"
              >
                Hub logistyki ↗
              </button>
            }
          />

          {/* Q4 - Not Urgent & Not Important (Waste) */}
          <QuadrantCard
            quadrant={4}
            title="NIEWAŻNE, NIEPILNE"
            subtitle="nie teraz"
            color="slate"
            tasks={q4}
            onComplete={completeTask}
            onAdd={() => openQuiz(4)}
            headerAction={
              <button
                onClick={() => alert('Archiwum - Coming Soon')}
                className="hover:shadow-[0_0_15px_rgba(156,163,175,0.4)] text-[#9CA3AF] text-xs font-semibold px-2 py-1 rounded border border-[#9CA3AF]/30 transition-all cursor-pointer"
                title="Archiwum"
              >
                Archiwum ↗
              </button>
            }
          />
        </div>
      )}

      {/* VIEW: Q2 Centrum Planowania - Sub-screen with 2x2 Layout */}
      {viewMode === 'q2' && (() => {
        const groups = groupQ2BySubcategory(q2);

        // Subcategory configuration with colors for 2x2 layout
        // Row 1: RUTYNY (purple), PROJEKTY (green)
        // Row 2: OGÓLNE CELE (green), INNE (purple)
        const subcategoryConfig: Record<string, {
          label: string;
          labelSmall?: boolean; // true for two-line compact labels
          icon: string;
          color: string;
          glowColor: string;
        }> = {
          rutyna: {
            label: 'RUTYNY',
            icon: '🔄',
            color: '#D000FF',
            glowColor: 'rgba(208, 0, 255, 0.3)',
          },
          projekt: {
            label: 'PROJEKTY',
            icon: '📁',
            color: '#00FF66',
            glowColor: 'rgba(0, 255, 102, 0.3)',
          },
          ogolny_cel: {
            label: 'OGÓLNE CELE',
            labelSmall: true, // Uses compact typography to fit in h-14
            icon: '🎯',
            color: '#00FF66',
            glowColor: 'rgba(0, 255, 102, 0.3)',
          },
          inne: {
            label: 'INNE',
            icon: '💼',
            color: '#D000FF',
            glowColor: 'rgba(208, 0, 255, 0.3)',
          },
        };

        // Define the 2x2 grid order
        const gridOrder = ['rutyna', 'projekt', 'ogolny_cel', 'inne'] as const;

        // Helper to get exact Matrix border/shadow classes
        const getBoxClasses = (isPurple: boolean) => {
          if (isPurple) {
            // Same as main Matrix Q2 (purple)
            return {
              border: 'border-[#D000FF]',
              shadow: 'shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)]',
              bg: 'bg-[rgba(208,0,255,0.10)]',
              headerBg: 'bg-[rgba(208,0,255,0.15)]',
            };
          }
          // Same as main Matrix Q1 (green/lime)
          return {
            border: 'border-[#39FF14]',
            shadow: 'shadow-[0_0_20px_rgba(57,255,20,0.6),0_0_50px_rgba(57,255,20,0.15)]',
            bg: 'bg-[rgba(57,255,20,0.08)]',
            headerBg: 'bg-[rgba(57,255,20,0.12)]',
          };
        };

        const renderTaskBox = (key: typeof gridOrder[number]) => {
          const tasks = groups[key] || [];
          const config = subcategoryConfig[key];
          const isPurple = config.color === '#D000FF';
          const classes = getBoxClasses(isPurple);

          return (
            <div
              key={key}
              className={`rounded-xl border backdrop-blur-sm overflow-hidden flex flex-col h-full transition-all duration-200 hover:scale-[1.02] ${classes.border} ${classes.shadow} ${classes.bg}`}
            >
              {/* Box Header - Fixed height h-14 for uniform alignment */}
              <div className={`h-14 flex items-center justify-between px-3 border-b ${classes.border} ${classes.headerBg}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.icon}</span>
                  {config.labelSmall ? (
                    // Compact two-line label for OGOLNE CELE
                    <h3
                      className="text-[11px] sm:text-xs font-black tracking-wider uppercase leading-none"
                      style={{ color: config.color }}
                    >
                      OGÓLNE<br />CELE
                    </h3>
                  ) : (
                    // Standard single-line label
                    <h3
                      className="text-xs sm:text-sm font-black tracking-wide uppercase"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </h3>
                  )}
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: isPurple ? 'rgba(208,0,255,0.2)' : 'rgba(57,255,20,0.2)',
                    color: config.color,
                  }}
                >
                  {tasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isPurple ? 'rgba(208,0,255,0.2)' : 'rgba(57,255,20,0.2)'}`,
                      }}
                    >
                      <button
                        onClick={() => task.id && completeTask(task.id)}
                        className="shrink-0 transition-all duration-200 hover:scale-110"
                        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#00FF66')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)')}
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <span className="flex-1 text-sm text-white/90 leading-tight font-medium">
                        {task.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center text-white/20">
                    <p className="text-xs">Brak zadań w tej ćwiartce</p>
                  </div>
                )}
              </div>
            </div>
          );
        };

        return (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Q2 Navigation Bar - 3 Column Grid Layout */}
            <div className="grid grid-cols-3 items-center w-full gap-2 mb-6 px-2 shrink-0">
              {/* Left Column: Back Button */}
              <div className="flex justify-start">
                <button
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
                >
                  <ArrowLeft size={14} />
                  <span className="hidden sm:inline">← Powrót do Macierzy</span>
                  <span className="sm:hidden">←</span>
                </button>
              </div>

              {/* Center Column: Title with Neon Glow */}
              <div className="flex flex-col items-center justify-center leading-none select-none">
                {/* Słowo CENTRUM - większe, z mocnym rozstrzeleniem liter */}
                <span
                  className="text-sm sm:text-base font-black tracking-widest uppercase whitespace-nowrap"
                  style={{
                    color: '#D000FF',
                    textShadow: '0 0 15px rgba(208, 0, 255, 0.6), 0 0 30px rgba(208, 0, 255, 0.4)',
                  }}
                >
                  Centrum
                </span>

                {/* Słowo PLANOWANIA - mniejsze, aby przy 10 literach idealnie zrównało się szerokością z "Centrum" */}
                <span
                  className="text-[11px] sm:text-xs font-black tracking-normal uppercase whitespace-nowrap mt-1"
                  style={{
                    color: '#D000FF',
                    textShadow: '0 0 10px rgba(208, 0, 255, 0.5), 0 0 20px rgba(208, 0, 255, 0.3)',
                  }}
                >
                  Planowania
                </span>

                {/* Dopisek (Q2) - subtelny, wyśrodkowany pod spodem */}
                <span
                  className="text-[10px] sm:text-xs font-bold tracking-wider mt-1"
                  style={{ color: 'rgba(208, 0, 255, 0.7)' }}
                >
                  (Q2)
                </span>
              </div>

              {/* Right Column: Add Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => openQuiz(2)}
                  className="px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 w-full max-w-[80px]"
                  style={{
                    backgroundColor: 'rgba(208, 0, 255, 0.15)',
                    border: '1px solid rgba(208, 0, 255, 0.6)',
                    color: '#D000FF',
                    boxShadow: '0 0 15px rgba(208, 0, 255, 0.4), inset 0 0 8px rgba(208, 0, 255, 0.1)',
                  }}
                >
                  + Dodaj
                </button>
              </div>
            </div>

            {/* Q2 2x2 Quadrant Grid */}
            <div className="flex-1 min-h-0">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
                {gridOrder.map(key => renderTaskBox(key))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
    </>
  );
};

export default MatrixScreen;

