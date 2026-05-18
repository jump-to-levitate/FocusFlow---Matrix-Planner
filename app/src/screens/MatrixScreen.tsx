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
  const [viewMode, setViewMode] = useState<'grid' | 'q2' | 'q3' | 'q4'>('grid');

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
      {/* Header - hidden in sub-views */}
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
            subtitle="Proza życia"
            color="orange"
            tasks={q3}
            onComplete={completeTask}
            onAdd={() => openQuiz(3)}
            headerAction={
              <button
                onClick={() => setViewMode('q3')}
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
            subtitle="Nie teraz"
            color="slate"
            tasks={q4}
            onComplete={completeTask}
            onAdd={() => openQuiz(4)}
            headerAction={
              <button
                onClick={() => setViewMode('q4')}
                className="hover:shadow-[0_0_15px_rgba(156,163,175,0.4)] text-[#9CA3AF] text-xs font-semibold px-2 py-1 rounded border border-[#9CA3AF]/30 transition-all cursor-pointer"
                title="Archiwum"
              >
                Archiwum ↗
              </button>
            }
          />
        </div>
      )}

      {/* VIEW: Q3 Hub Logistyki - Sub-screen with 2x2 Layout */}
      {viewMode === 'q3' && (() => {
        // Group Q3 tasks by subcategory - null/undefined/empty treated as 'inne'
        const groupQ3BySubcategory = (tasks: Task[]) => {
          const groups: Record<string, Task[]> = {
            zrob_teraz: [],
            zaplanuj: [],
            w_przerwie: [],
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

        const groups = groupQ3BySubcategory(q3);

        // Subcategory configuration with Orange & Blue Cyberpunk theme
        // Row 1: ZRÓB TERAZ (orange), ZAPLANUJ (cyan)
        // Row 2: ZRÓB W PRZERWIE (cyan), INNE (orange)
        const subcategoryConfig: Record<string, {
          label: string;
          labelSmall?: boolean;
          icon: string;
          color: string;
          glowColor: string;
        }> = {
          zrob_teraz: {
            label: 'ZRÓB TERAZ',
            icon: '🚀',
            color: '#FF8C00',
            glowColor: 'rgba(255, 140, 0, 0.3)',
          },
          zaplanuj: {
            label: 'ZAPLANUJ',
            icon: '📁',
            color: '#00E5FF',
            glowColor: 'rgba(0, 229, 255, 0.3)',
          },
          w_przerwie: {
            label: 'W PRZERWIE',
            labelSmall: true,
            icon: '🔄',
            color: '#00E5FF',
            glowColor: 'rgba(0, 229, 255, 0.3)',
          },
          inne: {
            label: 'INNE',
            icon: '💼',
            color: '#FF8C00',
            glowColor: 'rgba(255, 140, 0, 0.3)',
          },
        };

        // Define the 2x2 grid order
        const gridOrder = ['zrob_teraz', 'zaplanuj', 'w_przerwie', 'inne'] as const;

        // Helper to get exact Matrix border/shadow classes for Q3 (Orange & Cyan)
        const getBoxClasses = (isOrange: boolean) => {
          if (isOrange) {
            return {
              border: 'border-[#FF8C00]',
              shadow: 'shadow-[0_0_30px_rgba(255,140,0,0.7),0_0_60px_rgba(255,140,0,0.2)]',
              bg: 'bg-[rgba(255,140,0,0.10)]',
              headerBg: 'bg-[rgba(255,140,0,0.15)]',
            };
          }
          return {
            border: 'border-[#00E5FF]',
            shadow: 'shadow-[0_0_20px_rgba(0,229,255,0.6),0_0_50px_rgba(0,229,255,0.15)]',
            bg: 'bg-[rgba(0,229,255,0.08)]',
            headerBg: 'bg-[rgba(0,229,255,0.12)]',
          };
        };

        const renderTaskBox = (key: typeof gridOrder[number]) => {
          const tasks = groups[key] || [];
          const config = subcategoryConfig[key];
          const isOrange = config.color === '#FF8C00';
          const classes = getBoxClasses(isOrange);

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
                    <h3
                      className="text-[11px] sm:text-xs font-black tracking-wider uppercase leading-none"
                      style={{ color: config.color }}
                    >
                      ZRÓB<br />W PRZERWIE
                    </h3>
                  ) : (
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
                    backgroundColor: isOrange ? 'rgba(255,140,0,0.2)' : 'rgba(0,229,255,0.2)',
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
                        border: `1px solid ${isOrange ? 'rgba(255,140,0,0.2)' : 'rgba(0,229,255,0.2)'}`,
                      }}
                    >
                      <button
                        onClick={() => task.id && completeTask(task.id)}
                        className="shrink-0 transition-all duration-200 hover:scale-110"
                        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = isOrange ? '#FF8C00' : '#00E5FF')}
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
            {/* Q3 Navigation Bar - 3 Column Grid Layout */}
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
                <span
                  className="text-sm sm:text-base font-black tracking-widest uppercase whitespace-nowrap"
                  style={{
                    color: '#FF8C00',
                    textShadow: '0 0 15px rgba(255, 140, 0, 0.6), 0 0 30px rgba(255, 140, 0, 0.4)',
                  }}
                >
                  Hub
                </span>
                <span
                  className="text-[11px] sm:text-xs font-black tracking-normal uppercase whitespace-nowrap mt-1"
                  style={{
                    color: '#FF8C00',
                    textShadow: '0 0 10px rgba(255, 140, 0, 0.5), 0 0 20px rgba(255, 140, 0, 0.3)',
                  }}
                >
                  Logistyki
                </span>
                <span
                  className="text-[10px] sm:text-xs font-bold tracking-wider mt-1"
                  style={{ color: 'rgba(255, 140, 0, 0.7)' }}
                >
                  (Q3)
                </span>
              </div>

              {/* Right Column: Add Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => openQuiz(3)}
                  className="px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 w-full max-w-[80px]"
                  style={{
                    backgroundColor: 'rgba(255, 140, 0, 0.15)',
                    border: '1px solid rgba(255, 140, 0, 0.6)',
                    color: '#FF8C00',
                    boxShadow: '0 0 15px rgba(255, 140, 0, 0.4), inset 0 0 8px rgba(255, 140, 0, 0.1)',
                  }}
                >
                  + Dodaj
                </button>
              </div>
            </div>

            {/* Q3 2x2 Quadrant Grid */}
            <div className="flex-1 min-h-0">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
                {gridOrder.map(key => renderTaskBox(key))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* VIEW: Q4 Archiwum - Sub-screen with 2x2 Layout */}
      {viewMode === 'q4' && (
        <Q4ArchiwumView
          tasks={q4}
          onBack={() => setViewMode('grid')}
          onAdd={() => openQuiz(4)}
        />
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
}

// Group Q4 tasks by subcategory - null/undefined/empty treated as 'side_questy'
const groupQ4BySubcategory = (tasks: Task[]) => {
  const groups: Record<string, Task[]> = {
    rozrywka: [],
    hobby: [],
    optymalizacja: [],
    side_questy: [],
  };
  tasks.forEach(task => {
    const sub = task.subcategory;
    // Treat null, undefined, or empty string as 'side_questy' (fallback for Q4)
    const normalizedSub = !sub || sub === '' ? 'side_questy' : sub;
    if (groups[normalizedSub]) {
      groups[normalizedSub].push(task);
    } else {
      groups.side_questy.push(task);
    }
  });
  return groups;
};

// VIEW: Q4 Archiwum - Sub-screen with 2x2 Layout
function Q4ArchiwumView({ tasks, onBack, onAdd }: { tasks: Task[]; onBack: () => void; onAdd: () => void }) {
  const groups = groupQ4BySubcategory(tasks);

  // Subcategory configuration with NEON CHROME/SILVER-WHITE theme
  // All quadrants illuminated - bright cyberpunk glow
  const subcategoryConfig: Record<string, {
    label: string;
    labelSmall?: boolean;
    icon: string;
    color: string;
    glowColor: string;
  }> = {
    rozrywka: {
      label: 'ROZRYWKA',
      icon: '🎮',
      color: '#FFFFFF',
      glowColor: 'rgba(255, 255, 255, 0.4)',
    },
    hobby: {
      label: 'HOBBY',
      icon: '🎨',
      color: '#FFFFFF',
      glowColor: 'rgba(255, 255, 255, 0.4)',
    },
    optymalizacja: {
      label: 'OPTYMALIZACJA',
      labelSmall: true,
      icon: '⚙️',
      color: '#FFFFFF',
      glowColor: 'rgba(255, 255, 255, 0.4)',
    },
    side_questy: {
      label: 'SIDE-QUESTY',
      labelSmall: true,
      icon: '🗺️',
      color: '#FFFFFF',
      glowColor: 'rgba(255, 255, 255, 0.4)',
    },
  };

  const gridOrder = ['rozrywka', 'hobby', 'optymalizacja', 'side_questy'] as const;

  const completeTask = async (taskId: number) => {
    await db.tasks.update(taskId, { completed: true });
  };

  const renderTaskBox = (key: typeof gridOrder[number]) => {
    const config = subcategoryConfig[key];
    const subTasks = groups[key];
    const isGrey = config.color === '#4B5563';

    return (
      <div
        key={key}
        className="flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        style={{
          backgroundColor: 'rgba(30, 30, 40, 0.6)',
          border: `2px solid ${config.color}40`,
          boxShadow: `0 0 15px ${config.glowColor}`,
        }}
      >
        {/* Subcategory Header */}
        <div
          className="p-3 border-b shrink-0"
          style={{
            backgroundColor: `${config.color}15`,
            borderColor: `${config.color}30`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{config.icon}</span>
              <h3
                className={`font-black uppercase tracking-wider ${config.labelSmall ? 'text-[10px]' : 'text-xs'}`}
                style={{ color: config.color }}
              >
                {config.label}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-white/40">{subTasks.length}</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {subTasks.length > 0 ? (
            subTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isGrey ? 'rgba(75,85,99,0.2)' : 'rgba(243,244,246,0.2)'}`,
                }}
              >
                <button
                  onClick={() => task.id && completeTask(task.id)}
                  className="shrink-0 transition-all duration-200 hover:scale-110"
                  style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = isGrey ? '#4B5563' : '#F3F4F6')}
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
      {/* Q4 Navigation Bar - 3 Column Grid Layout */}
      <div className="grid grid-cols-3 items-center w-full gap-2 mb-6 px-2 shrink-0">
        {/* Left Column: Back Button */}
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all text-xs font-medium"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">← Powrót do Macierzy</span>
            <span className="sm:hidden">←</span>
          </button>
        </div>

        {/* Center Column: Title with Neon Glow */}
        <div className="flex flex-col items-center justify-center leading-none select-none">
          <span
            className="text-sm sm:text-base font-black tracking-widest uppercase whitespace-nowrap"
            style={{
              color: '#4B5563',
              textShadow: '0 0 15px rgba(75, 85, 99, 0.6), 0 0 30px rgba(75, 85, 99, 0.4)',
            }}
          >
            Archiwum
          </span>
          <span
            className="text-[10px] sm:text-xs font-bold tracking-wider mt-1"
            style={{ color: 'rgba(243, 244, 246, 0.7)' }}
          >
            (Q4)
          </span>
        </div>

        {/* Right Column: Add Button */}
        <div className="flex justify-end">
          <button
            onClick={onAdd}
            className="px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 w-full max-w-[80px]"
            style={{
              backgroundColor: 'rgba(75, 85, 99, 0.15)',
              border: '1px solid rgba(75, 85, 99, 0.6)',
              color: '#F3F4F6',
              boxShadow: '0 0 15px rgba(75, 85, 99, 0.4), inset 0 0 8px rgba(75, 85, 99, 0.1)',
            }}
          >
            + Dodaj
          </button>
        </div>
      </div>

      {/* Q4 2x2 Quadrant Grid */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
          {gridOrder.map(key => renderTaskBox(key))}
        </div>
      </div>
    </div>
  );
}

export default MatrixScreen;

