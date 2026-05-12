import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Quadrant } from '../types';
import { useTasksStore } from '../store/useTasksStore';
import { processQuiz, QuizAnswers } from '../logic/processQuiz';
import { commitTaskFromQuiz, buildNote, StrategicData } from '../logic/brainDumpPipeline';
import { selectQ1Count } from '../store/selectors';
import { QuizSection } from '../components/braindump/QuizSection';
import { StrategicModals } from '../components/braindump/StrategicModals';

type FlowState = 'idle' | { kind: 'modal:Q2' | 'modal:Q3' | 'modal:Q4' | 'overload' };

const qLabels: Record<Quadrant, string> = { I: 'PILNE I WAZNE', II: 'WAZNE, NIEPILNE', III: 'PILNE, NIEWAZNE', IV: 'NIEPILNE, NIEWAZNE' };
const qColors: Record<Quadrant, string> = { I: '#39FF14', II: '#A020F0', III: '#FB923C', IV: '#64748B' };
const questions = {
  wa: [{ id: 'W1' as const, text: 'Czy zadanie przybliża Cię do Twoich celów?' }, { id: 'W2' as const, text: 'Czy buduje fundament pod Twoją przyszłość?' }, { id: 'W3' as const, text: 'Czy za tydzień będziesz żałować, że tego nie zrobiłeś?' }],
  ur: [{ id: 'P1' as const, text: 'Czy masz "twardy" termin (deadline) w najbliższych dniach?' }, { id: 'P2' as const, text: 'Czy zignorowanie tego wywoła natychmiastowy problem?' }, { id: 'P3' as const, text: 'Czy ktoś inny czeka na efekt Twojej pracy?' }],
};

export const BrainDump: React.FC = () => {
  const store = useTasksStore();
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [waIdx, setWaIdx] = useState(0);
  const [urIdx, setUrIdx] = useState(0);
  const [flow, setFlow] = useState<FlowState>({ kind: 'idle' });

  const q1Count = selectQ1Count(store.tasks);
  const quiz = processQuiz(answers);
  const canSubmit = quiz.isComplete && title.trim().length > 0;

  const onAnswer = (id: keyof QuizAnswers, v: boolean, sec: 'wa' | 'ur') => {
    setAnswers(p => ({ ...p, [id]: v }));
    if (sec === 'wa' && waIdx < 2) setTimeout(() => setWaIdx(p => p + 1), 300);
    if (sec === 'ur' && urIdx < 2) setTimeout(() => setUrIdx(p => p + 1), 300);
  };

  const reset = () => { setTitle(''); setAnswers({}); setWaIdx(0); setUrIdx(0); setFlow({ kind: 'idle' }); };

  const addTask = async () => {
    if (!canSubmit || !quiz.quadrant) return;
    if (quiz.quadrant === 'I') {
      if (q1Count >= 5) { setFlow({ kind: 'overload' }); return; }
      const r = await commitTaskFromQuiz(store, title, answers);
      if (r.kind === 'overload') { setFlow({ kind: 'overload' }); return; }
      reset(); window.location.hash = '#pulpit'; return;
    }
    if (quiz.quadrant === 'II') setFlow({ kind: 'modal:Q2' });
    else if (quiz.quadrant === 'III') setFlow({ kind: 'modal:Q3' });
    else if (quiz.quadrant === 'IV') setFlow({ kind: 'modal:Q4' });
  };

  const onConfirm = async (data: StrategicData) => {
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

  return (
    <div className="h-full flex flex-col p-5 space-y-3 animate-in fade-in duration-700 overflow-hidden">
      <header className="pt-2 flex justify-between items-center">
        <h2 className="text-white font-bold uppercase tracking-tight" style={{ fontSize: 24 }}>Brain Dump</h2>
        <button onClick={() => (window.location.hash = '#notatki')} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: '#A020F0', color: '#FFF' }}>Notatki</button>
      </header>
      <section className="space-y-2">
        <label className="text-white text-base font-bold block leading-tight uppercase">Co Ci chodzi po głowie?</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Wpisz cokolwiek..." className="w-full rounded-[18px] p-4 text-white placeholder-[#4A4A4A] focus:outline-none transition-all" style={{ backgroundColor: '#121212', border: '2px solid #A020F0', boxShadow: '0 0 10px rgba(160,32,240,0.3)', fontSize: 16 }} />
      </section>
      {title.length > 0 && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <QuizSection label="Waznosc" question={wq.text} index={waIdx} maxIndex={2} currentAnswer={answers[wq.id]} onAnswer={v => onAnswer(wq.id, v, 'wa')} onPrev={() => setWaIdx(p => p - 1)} onNext={() => setWaIdx(p => p + 1)} />
            <QuizSection label="Pilnosc" question={pq.text} index={urIdx} maxIndex={2} currentAnswer={answers[pq.id]} onAnswer={v => onAnswer(pq.id, v, 'ur')} onPrev={() => setUrIdx(p => p - 1)} onNext={() => setUrIdx(p => p + 1)} />
          </div>
          <div className="space-y-4 pt-2 pb-2">
            {quiz.quadrant && (
              <div className="rounded-full py-2 px-4 flex items-center justify-between" style={{ backgroundColor: '#121212', border: '1px solid #2A2A2A' }}>
                <span className="text-[9px] font-bold uppercase tracking-tight" style={{ color: '#B0B0B0' }}>Trafia do...</span>
                <span className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest" style={{ backgroundColor: `${qColors[quiz.quadrant]}15`, border: `1px solid ${qColors[quiz.quadrant]}`, color: qColors[quiz.quadrant] }}>
                  {qLabels[quiz.quadrant]}<Pencil size={11} />
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={addTask} className="flex-[2] py-4 rounded-full font-extrabold uppercase tracking-widest disabled:opacity-40 transition-all active:scale-95" style={{ backgroundColor: canSubmit ? '#39FF14' : '#1e293b', color: canSubmit ? '#000' : '#475569', fontSize: 14, boxShadow: canSubmit ? '0 0 25px rgba(57,255,20,0.9), 0 0 12px rgba(57,255,20,0.6)' : 'none' }} disabled={!canSubmit}>Dodaj zadanie</button>
              <button onClick={addNote} className="flex-1 py-4 rounded-full font-extrabold uppercase tracking-tight active:scale-95 transition-all" style={{ backgroundColor: 'transparent', color: '#A020F0', border: '2px solid #A020F0', fontSize: 11 }}>Dodaj notatke</button>
            </div>
          </div>
        </div>
      )}
      <StrategicModals flow={flow} title={title} q1Count={q1Count} onClose={() => setFlow({ kind: 'idle' })} onStrategicConfirm={onConfirm} onOverloadAction={overload} />
    </div>
  );
};