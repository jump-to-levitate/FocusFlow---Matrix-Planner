// ============================================================================
// FocusFlow 2.0 - Brain Dump Screen (Inbox Capture)
// Async quick-save to Q2 + live list with reclassification
// PDF Reference: ADHD friction design pattern
// ============================================================================

import { Brain, Wand2, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/dexie';
import { QuizModal } from '../components/quiz/QuizModal';
import type { QuadrantNumber } from '../utils/taskClassifier';

export const BrainDumpScreen = () => {
  const [dumpText, setDumpText] = useState('');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [classifyTask, setClassifyTask] = useState<{ id: number; title: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTasks = useLiveQuery(
    () => db.tasks.toArray().catch(() => [])
  );
  const safeTasks = Array.isArray(allTasks) ? allTasks : [];
  const inboxTasks = safeTasks.filter(t => t.quadrant === 2 && !t.completed);

  const handleQuickSave = async () => {
    const title = dumpText.trim();
    if (!title) return;
    await db.tasks.add({
      title,
      quadrant: 2,
      completed: false,
      createdAt: new Date(),
    });
    setDumpText('');
    inputRef.current?.focus();
  };

  const handleClassify = (taskId: number, taskTitle: string) => {
    setClassifyTask({ id: taskId, title: taskTitle });
    setIsQuizOpen(true);
  };

  const handleClassifyDone = (quadrant: QuadrantNumber) => {
    if (classifyTask) {
      db.tasks.update(classifyTask.id, { quadrant });
    }
  };

  const handleQuizClose = () => {
    setIsQuizOpen(false);
    setClassifyTask(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <>
    <QuizModal
      isOpen={isQuizOpen}
      onClose={handleQuizClose}
      initialTitle={classifyTask?.title}
      onClassify={classifyTask ? handleClassifyDone : undefined}
    />
    <div className="flex flex-col h-full pt-4 pb-4 gap-5">
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
          Brain Dump
        </h1>
        <p className="text-sm text-white/50 max-w-[280px] mx-auto">
          Wyrzuć myśl z głowy. Enter zapisuje do Q2.
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

      {/* Inbox task list (Q2 uncompleted) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {inboxTasks.length > 0 ? (
          <ul className="space-y-2">
            {inboxTasks.map(task => (
              <li
                key={task.id}
                className="glass-card p-3 border border-white/[0.06] flex items-center gap-3"
              >
                <span className="flex-1 text-sm text-white/80 break-words">{task.title}</span>
                <button
                  onClick={() => task.id !== undefined && handleClassify(task.id, task.title)}
                  className="shrink-0 p-2 rounded-lg border border-[#D000FF]/30 text-[#D000FF]/60 hover:text-[#D000FF] hover:border-[#D000FF]/60 hover:bg-[#D000FF]/10 transition-all"
                  title="Klasyfikuj zadanie"
                >
                  <Wand2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-white/20 text-sm">Brak myśli w skrzynce</p>
            <p className="text-white/10 text-xs mt-1">Wpisz coś powyżej i naciśnij Enter</p>
          </div>
        )}
      </div>

      {/* Start Quiz CTA */}
      <button
        onClick={() => { setClassifyTask(null); setIsQuizOpen(true); }}
        className="shrink-0 w-full py-3.5 px-4 bg-[#D000FF]/15 border-2 border-[#D000FF] rounded-xl text-[#D000FF] font-bold uppercase tracking-wider hover:bg-[#D000FF]/25 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(208,0,255,0.4)]"
      >
        <Brain size={20} strokeWidth={2.5} />
        Start Quiz
      </button>
    </div>
    </>
  );
};

export default BrainDumpScreen;
