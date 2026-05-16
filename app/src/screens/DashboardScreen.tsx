// ============================================================================
// FocusFlow 2.0 - Dashboard Screen (Pulpit)
// Landing view with Q1 focus and quick add CTA
// PDF Reference: str. 15
// ============================================================================

import { Plus, Circle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { QuizModal } from '../components/quiz/QuizModal';
import { db } from '../db/dexie';

export const DashboardScreen = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [completing, setCompleting] = useState<number | null>(null);

  const allTasks = useLiveQuery(() => db.tasks.toArray()) ?? [];
  const tasks = allTasks.filter(t => !t.completed);
  const q1Tasks = tasks.filter(t => t.quadrant === 1);
  const q2Tasks = tasks.filter(t => t.quadrant === 2);
  const q3Tasks = tasks.filter(t => t.quadrant === 3);

  // Focus task: first Q1, fallback first Q2
  const focusTask = q1Tasks[0] ?? q2Tasks[0] ?? null;
  const focusSource = q1Tasks.length > 0 ? 'Q1' : q2Tasks.length > 0 ? 'Q2' : null;
  const focusColor = focusSource === 'Q2' ? '#D000FF' : '#39FF14';

  const handleComplete = (id: number) => {
    setCompleting(id);
    setTimeout(() => {
      db.tasks.update(id, { completed: true });
      setCompleting(null);
    }, 300);
  };

  return (
    <>
    <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    <div className="flex flex-col h-full pt-4 pb-4 gap-6">
      {/* Header */}
      <header className="shrink-0">
        <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-2">
          Twój cel na teraz
        </h1>
        <p className="text-sm text-white/50 font-medium">
          {focusSource ? `${focusSource} - ${focusSource === 'Q1' ? 'Pilne i Ważne' : 'Ważne (Growth)'}` : 'Brak aktywnych zadań'}
        </p>
      </header>

      {/* Focus Task Card */}
      <div className="glass-card p-6 border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full shadow-[0_0_15px_rgba(57,255,20,0.8)]" style={{ backgroundColor: focusColor }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: focusColor }}>
            {focusSource ?? 'Q1'} Focus
          </span>
        </div>
        
        {focusTask ? (
          <div
            className={`flex items-center gap-3 py-6 transition-all duration-300 ${completing === focusTask.id ? 'opacity-0 scale-95' : ''}`}
          >
            <button
              onClick={() => focusTask.id !== undefined && handleComplete(focusTask.id)}
              className="shrink-0 text-white/40 hover:text-white/70 transition-colors"
            >
              {completing === focusTask.id
                ? <CheckCircle2 size={22} style={{ color: focusColor }} />
                : <Circle size={22} />
              }
            </button>
            <p className="text-white font-bold text-lg break-words">{focusTask.title}</p>
          </div>
        ) : (
          <p className="text-white/30 text-center py-8 text-sm">
            Brak aktywnego celu
          </p>
        )}
        
        {/* CTA Button */}
        <button
          onClick={() => setIsQuizOpen(true)}
          className="w-full py-3.5 px-4 bg-[#39FF14]/15 border-2 border-[#39FF14] rounded-xl text-[#39FF14] font-bold uppercase tracking-wider hover:bg-[#39FF14]/25 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(57,255,20,0.5),0_0_70px_rgba(57,255,20,0.12)]"
        >
          <Plus size={20} strokeWidth={2.5} />
          Dodaj zadanie
        </button>
      </div>

      {/* Quick Note Section */}
      <div className="glass-card p-4 border border-white/[0.06]">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Szybka notatka</p>
        <div className="min-h-[80px] rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 flex items-start">
          <p className="text-xs text-white/20 italic">Zapisz myśl...</p>
        </div>
      </div>

      {/* Quick Stats — live counts */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        <div className="glass-card p-4 text-center border border-[#39FF14]/20">
          <p className="text-3xl font-black text-[#39FF14]">{q1Tasks.length}</p>
          <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-1">Q1</p>
        </div>
        <div className="glass-card p-4 text-center border border-[#D000FF]/20">
          <p className="text-3xl font-black text-[#D000FF]">{q2Tasks.length}</p>
          <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-1">Q2</p>
        </div>
        <div className="glass-card p-4 text-center border border-[#FF8C00]/20">
          <p className="text-3xl font-black text-[#FF8C00]">{q3Tasks.length}</p>
          <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-1">Q3</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardScreen;
