// ============================================================================
// FocusFlow 2.0 - Brain Dump Screen (Pure Inbox Capture)
// quadrant: 0 = Unassigned Inbox Note
// Two-view: capture (input) | notes (list + classify/delete)
// PDF Reference: ADHD friction design pattern
// ============================================================================

import { Brain, Wand2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/dexie';
import { QuizModal } from '../components/quiz/QuizModal';
import type { QuadrantNumber } from '../utils/taskClassifier';

type View = 'capture' | 'notes';

export const BrainDumpScreen = () => {
  const [currentView, setCurrentView] = useState<View>('capture');
  const [dumpText, setDumpText] = useState('');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [classifyTask, setClassifyTask] = useState<{ id: number; title: string } | null>(null);
  const [quizInitialTitle, setQuizInitialTitle] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTasks = useLiveQuery(
    () => db.tasks.toArray().catch(() => [])
  );
  const safeTasks = Array.isArray(allTasks) ? allTasks : [];
  const inboxNotes = safeTasks.filter(t => t.quadrant === 0 && !t.completed);

  const handleQuickSave = async () => {
    const title = dumpText.trim();
    if (!title) return;
    await db.tasks.add({
      title,
      quadrant: 0,
      completed: false,
      createdAt: new Date(),
    });
    setDumpText('');
    inputRef.current?.focus();
  };

  const handleDelete = async (taskId: number) => {
    await db.tasks.delete(taskId);
  };

  const handleClassifyClick = (taskId: number, taskTitle: string) => {
    setClassifyTask({ id: taskId, title: taskTitle });
    setIsQuizOpen(true);
  };

  const handleClassifyDone = (id: number, quadrant: QuadrantNumber) => {
    db.tasks.update(id, { quadrant });
  };

  const handleQuizClose = () => {
    setIsQuizOpen(false);
    setClassifyTask(null);
    setQuizInitialTitle(undefined);
  };

  const handleStartQuiz = () => {
    const title = dumpText.trim() || undefined;
    setQuizInitialTitle(title);
    setIsQuizOpen(true);
  };

  // Autofocus recovery when returning to capture view
  useEffect(() => {
    if (currentView === 'capture') {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // ============ NOTES VIEW ============
  if (currentView === 'notes') {
    return (
      <>
        <QuizModal
          isOpen={isQuizOpen}
          onClose={handleQuizClose}
          initialTitle={classifyTask?.title}
          classifyTaskId={classifyTask?.id}
          onClassify={handleClassifyDone}
        />
        <div className="flex flex-col h-full pt-4 pb-4 gap-4 animate-in fade-in slide-in-from-right-4 duration-300 ease-out">
          {/* Header with back button */}
          <header className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setCurrentView('capture')}
              className="p-2 -ml-2 text-white/40 hover:text-white/70 transition-all duration-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] rounded-lg"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-xl font-black text-white uppercase tracking-wide">
              NOTATKI BRAIN DUMP
            </h1>
          </header>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {inboxNotes.length > 0 ? (
              <ul className="space-y-2">
                {inboxNotes.map(task => (
                  <li
                    key={task.id}
                    className="glass-card p-3 border border-white/[0.06] flex items-center gap-3"
                  >
                    <span className="flex-1 text-sm text-white/80 break-words">{task.title}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => task.id !== undefined && handleClassifyClick(task.id, task.title)}
                        className="p-2 rounded-lg border border-[#D000FF]/30 text-[#D000FF]/60 hover:text-[#D000FF] hover:border-[#D000FF]/60 hover:bg-[#D000FF]/10 hover:shadow-[0_0_10px_rgba(208,0,255,0.4)] transition-all duration-200"
                        title="Klasyfikuj"
                      >
                        <Wand2 size={14} />
                      </button>
                      <button
                        onClick={() => task.id !== undefined && handleDelete(task.id)}
                        className="p-2 rounded-lg border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/10 hover:shadow-[0_0_8px_rgba(248,113,113,0.4)] transition-all duration-200"
                        title="Usuń"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <p className="text-white/40 text-base font-medium">
                  Twój umysł jest całkowicie czysty.
                </p>
                <p className="text-[#D000FF]/70 text-sm mt-2">
                  Brak notatek w poczekalni. Dobra robota! 🧠✨
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ============ CAPTURE VIEW ============
  return (
    <>
      <QuizModal
        isOpen={isQuizOpen}
        onClose={handleQuizClose}
        initialTitle={quizInitialTitle}
        skipTitleStep={false}
      />
      <div className="flex flex-col h-full pt-4 pb-4 gap-5 animate-in fade-in slide-in-from-left-4 duration-300 ease-out">
        {/* Header */}
        <header className="shrink-0 text-center">
          <div className="relative inline-block mb-3">
            <div className="absolute inset-0 bg-[#D000FF]/20 blur-3xl rounded-full" />
            <Brain
              size={48}
              strokeWidth={1.5}
              className="text-[#D000FF] relative z-10 drop-shadow-[0_0_20px_rgba(208,0,255,0.5)]"
            />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-1">
            BRAIN DUMP
          </h1>
          <p className="text-sm text-white/50 max-w-[280px] mx-auto">
            Wyrzuć myśl z głowy. Enter zapisuje do skrzynki.
          </p>
        </header>

        {/* Quick save input */}
        <div className="glass-card p-4 border border-[#D000FF]/20 shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={dumpText}
              onChange={e => setDumpText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuickSave()}
              placeholder="Wpisz myśl i naciśnij Enter..."
              className="flex-1 py-3 px-4 bg-white/[0.04] border border-[#D000FF]/30 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D000FF]/60 focus:shadow-[0_0_12px_rgba(208,0,255,0.2)] transition-all"
              autoFocus
            />
            <button
              onClick={handleQuickSave}
              disabled={!dumpText.trim()}
              className="shrink-0 p-3 bg-[#D000FF]/15 border border-[#D000FF]/40 rounded-xl text-[#D000FF] hover:bg-[#D000FF]/25 active:scale-[0.95] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA Buttons */}
        <div className="shrink-0 flex flex-col gap-3">
          {/* Primary: Start Quiz */}
          <button
            onClick={handleStartQuiz}
            className="w-full py-3.5 px-4 bg-[#D000FF]/15 border-2 border-[#D000FF] rounded-xl text-[#D000FF] font-bold uppercase tracking-wider hover:bg-[#D000FF]/25 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(208,0,255,0.4)]"
          >
            <Brain size={20} strokeWidth={2.5} />
            START QUIZ
          </button>

          {/* Secondary: Your Notes */}
          <button
            onClick={() => setCurrentView('notes')}
            className="w-full py-3 px-4 border border-[#D000FF]/20 rounded-xl text-[#D000FF]/60 text-sm font-medium hover:text-[#D000FF] hover:border-[#D000FF]/40 hover:bg-[#D000FF]/10 transition-all active:scale-[0.98]"
          >
            TWOJE NOTATKI ({inboxNotes.length})
          </button>
        </div>
      </div>
    </>
  );
};

export default BrainDumpScreen;
