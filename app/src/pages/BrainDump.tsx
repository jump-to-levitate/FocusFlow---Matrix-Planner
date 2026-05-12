import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Pencil } from 'lucide-react';
import { Quadrant } from '../types';
import { useTasksStore } from '../store/useTasksStore';
import { processQuiz, QuizAnswers } from '../logic/processQuiz';
import { commitTaskFromQuiz, buildNote, StrategicData } from '../logic/brainDumpPipeline';
import { selectQ1Count } from '../store/selectors';
import { QuizSection } from '../components/braindump/QuizSection';
import { StrategicModals } from '../components/braindump/StrategicModals';
import { ModalState } from '../components/braindump/FlowState';
import { GLOW, colors } from '../constants/colors';

const qLabels: Record<Quadrant, string> = { I: 'PILNE I WAZNE', II: 'WAZNE, NIEPILNE', III: 'PILNE, NIEWAZNE', IV: 'NIEPILNE, NIEWAZNE' };
const qColors: Record<Quadrant, string> = {
  I: colors.neonGreen,
  II: colors.neonPurple,
  III: colors.neonOrange,
  IV: colors.neonSlate,
};
const questions = {
  wa: [{ id: 'W1' as const, text: 'Czy zadanie przybliża Cię do Twoich celów?' }, { id: 'W2' as const, text: 'Czy buduje fundament pod Twoją przyszłość?' }, { id: 'W3' as const, text: 'Czy za tydzień będziesz żałować, że tego nie zrobiłeś?' }],
  ur: [{ id: 'P1' as const, text: 'Czy masz "twardy" termin (deadline) w najbliższych dniach?' }, { id: 'P2' as const, text: 'Czy zignorowanie tego wywoła natychmiastowy problem?' }, { id: 'P3' as const, text: 'Czy ktoś inny czeka na efekt Twojej pracy?' }],
};

export const BrainDump: FC = () => {
  const store = useTasksStore();
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [waIdx, setWaIdx] = useState(0);
  const [urIdx, setUrIdx] = useState(0);
  const [flow, setFlow] = useState<ModalState>({ kind: 'idle' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const q1Count = selectQ1Count(store.tasks);
  const quiz = processQuiz(answers);
  const canSubmit = quiz.isComplete && title.trim().length > 0;

  useEffect(() => {
    const match = window.location.hash.match(/[?&]taskId=([^&]+)/);
    if (!match) return;
    const taskId = decodeURIComponent(match[1]);
    const task = store.tasks.find(t => t.id === taskId);
    if (!task) return;
    setTitle(task.title);
    setEditingTaskId(taskId);
    setIsEditing(true);
  }, [store.tasks]);

  const onAnswer = (id: keyof QuizAnswers, v: boolean, sec: 'wa' | 'ur') => {
    setAnswers((p: QuizAnswers) => ({ ...p, [id]: v }));
    if (sec === 'wa' && waIdx < 2) setTimeout(() => setWaIdx((p: number) => p + 1), 300);
    if (sec === 'ur' && urIdx < 2) setTimeout(() => setUrIdx((p: number) => p + 1), 300);
  };

  const reset = () => { setTitle(''); setAnswers({}); setWaIdx(0); setUrIdx(0); setFlow({ kind: 'idle' }); setIsEditing(false); setEditingTaskId(null); };

  const applyEditUpdate = async (q: Quadrant, data?: StrategicData): Promise<void> => {
    if (!editingTaskId) return;
    const existing = store.tasks.find(t => t.id === editingTaskId);
    if (!existing) return;
    const todayIso = new Date().toISOString().split('T')[0];
    const strategy = data && 'strategy' in data ? data.strategy : (q === 'III' ? existing.strategy : null);
    const category = existing.category === 'Notatka' ? 'Inne' : existing.category;
    const scheduledDate = existing.scheduledDate ?? todayIso;
    await store.updateTask(editingTaskId, {
      title: title.trim(),
      quadrant: q,
      isImportant: q === 'I' || q === 'II',
      isUrgent: q === 'I' || q === 'III',
      strategy,
      category,
      scheduledDate,
      isRejected: false,
    });
  };

  const addTask = async () => {
    if (!canSubmit || !quiz.quadrant) return;
    const q = quiz.quadrant;

    if (isEditing && editingTaskId) {
      if (q === 'I') {
        await applyEditUpdate(q);
        reset();
        window.location.hash = '#pulpit';
        return;
      }
      if (q === 'II') { setFlow({ kind: 'modal:Q2' }); return; }
      if (q === 'III') { setFlow({ kind: 'modal:Q3' }); return; }
      if (q === 'IV') { setFlow({ kind: 'modal:Q4' }); return; }
    }

    if (q === 'I') {
      if (q1Count >= 5) { setFlow({ kind: 'overload' }); return; }
      const r = await commitTaskFromQuiz(store, title, answers);
      if (r.kind === 'overload') { setFlow({ kind: 'overload' }); return; }
      reset(); window.location.hash = '#pulpit'; return;
    }
    if (q === 'II') setFlow({ kind: 'modal:Q2' });
    else if (q === 'III') setFlow({ kind: 'modal:Q3' });
    else if (q === 'IV') setFlow({ kind: 'modal:Q4' });
  };

  const onConfirm = async (data: StrategicData) => {
    if (isEditing && editingTaskId) {
      await applyEditUpdate(data.quadrant, data);
      reset();
      window.location.hash = '#pulpit';
      return;
    }
    const r = await commitTaskFromQuiz(store, title, answers, data);
    if (r.kind === 'discarded') await store.bumpRejectedCount();
    reset(); window.location.hash = '#pulpit';
  };

  const addNote = async () => { if (!title.trim()) return; await store.addNote(buildNote(title.trim())); reset(); window.location.hash = '#notatki'; };

  const overload = async (a: { kind: 'retry' | 'planQ2' | 'saveAsNote' }) => {
    if (a.kind === 'retry') { setAnswers({}); setWaIdx(0); setUrIdx(0); setFlow({ kind: 'idle' }); return; }
    if (a.kind === 'saveAsNote') { await store.addNote(buildNote(title.trim())); reset(); window.location.hash = '#notatki'; return; }
    setFlow({ kind: 'modal:Q2' });
  };

  const wq = questions.wa[waIdx], pq = questions.ur[urIdx];
  const quadColor = quiz.quadrant ? qColors[quiz.quadrant] : null;

  return (
    <div className="h-full flex flex-col p-5 space-y-3 animate-in fade-in duration-700 overflow-hidden">
      <header className="pt-2 flex justify-between items-center">
        <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Brain Dump</h2>
        <button
          onClick={() => (window.location.hash = '#notatki')}
          className="text-[10px] font-black uppercase tracking-qlabel px-3 py-1.5 rounded-pill bg-neonPurple text-white"
        >Notatki</button>
      </header>
      <section className="space-y-2">
        <label className="text-white text-base font-black block leading-tight uppercase tracking-qlabel">Co Ci chodzi po głowie?</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Wpisz cokolwiek..."
          className="w-full rounded-card p-4 text-white bg-panel border-2 border-neonPurple focus:outline-none transition-all text-base"
          style={{ boxShadow: GLOW.ring(colors.neonPurple) }}
        />
      </section>
      {title.length > 0 && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <QuizSection label="Waznosc" question={wq.text} index={waIdx} maxIndex={2} currentAnswer={answers[wq.id]} onAnswer={v => onAnswer(wq.id, v, 'wa')} onPrev={() => setWaIdx(p => p - 1)} onNext={() => setWaIdx(p => p + 1)} />
            <QuizSection label="Pilnosc" question={pq.text} index={urIdx} maxIndex={2} currentAnswer={answers[pq.id]} onAnswer={v => onAnswer(pq.id, v, 'ur')} onPrev={() => setUrIdx(p => p - 1)} onNext={() => setUrIdx(p => p + 1)} />
          </div>
          <div className="space-y-4 pt-2 pb-2">
            {Object.keys(answers).length > 0 && quiz.quadrant && quadColor && (
              <div className="rounded-pill py-2 px-4 flex items-center justify-between bg-panel border border-panelBorder">
                <span className="text-[9px] font-black uppercase tracking-qlabel text-textSecondary">Trafia do...</span>
                <span
                  className="flex items-center gap-2 px-3 py-1 rounded-pill text-[10px] font-black uppercase tracking-qlabel border"
                  style={{ backgroundColor: `${quadColor}15`, borderColor: quadColor, color: quadColor }}
                >
                  {qLabels[quiz.quadrant]}<Pencil size={11} />
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={addTask}
                disabled={!canSubmit}
                className={`flex-[2] py-4 rounded-pill font-black uppercase tracking-qlabel text-sm disabled:opacity-40 transition-all active:scale-95 ${canSubmit ? 'bg-neonGreen text-midnight' : 'bg-slate800 text-textSecondary'}`}
                style={canSubmit ? { boxShadow: GLOW.hero(colors.neonGreen) } : undefined}
              >Dodaj zadanie</button>
              <button
                onClick={addNote}
                className="flex-1 py-4 rounded-pill font-black uppercase tracking-qlabel text-[11px] bg-transparent text-neonPurple border-2 border-neonPurple active:scale-95 transition-all"
              >Dodaj notatke</button>
            </div>
          </div>
        </div>
      )}
      <StrategicModals flow={flow} title={title} q1Count={q1Count} onClose={() => setFlow({ kind: 'idle' })} onStrategicConfirm={onConfirm} onOverloadAction={overload} />
    </div>
  );
};
