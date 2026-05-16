import { X, Brain, ArrowLeft, Check } from 'lucide-react';
import { useQuizForm } from '../../hooks/useQuizForm';
import type { QuadrantNumber } from '../../utils/taskClassifier';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuadrant?: QuadrantNumber | null;
}

const QUADRANT_META: Record<QuadrantNumber, { label: string; color: string; glow: string }> = {
  1: { label: 'Q1 — Pilne i Ważne',      color: '#39FF14', glow: 'rgba(57,255,20,0.4)' },
  2: { label: 'Q2 — Niepilne i Ważne',    color: '#D000FF', glow: 'rgba(208,0,255,0.4)' },
  3: { label: 'Q3 — Pilne i Nieważne',    color: '#FF8C00', glow: 'rgba(255,140,0,0.4)' },
  4: { label: 'Q4 — Niepilne i Nieważne',  color: '#64748B', glow: 'rgba(100,116,139,0.3)' },
};

export const QuizModal = ({ isOpen, onClose, initialQuadrant }: QuizModalProps) => {
  const quiz = useQuizForm({ initialQuadrant: initialQuadrant ?? null });

  if (!isOpen) return null;

  const handleClose = () => {
    quiz.resetQuiz();
    onClose();
  };

  const handleSubmit = async () => {
    const ok = await quiz.submitTask();
    if (ok) onClose();
  };

  const stepNumber = initialQuadrant != null
    ? (quiz.currentStep === 'title' ? 1 : 2)
    : ({ title: 1, importance: 2, urgency: 3, confirm: 4 } as const)[quiz.currentStep];
  const totalSteps = initialQuadrant != null ? 2 : 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal content */}
      <div className="relative w-full max-w-[430px] mx-auto h-full max-h-[932px] bg-[var(--color-bg)] flex flex-col items-center justify-center px-8">
        {/* Close */}
        <button onClick={handleClose} className="absolute top-6 right-6 text-white/40 hover:text-white/70 transition-colors">
          <X size={24} />
        </button>

        {/* Back */}
        {quiz.currentStep !== 'title' && (
          <button onClick={quiz.prevStep} className="absolute top-6 left-6 text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}

        {/* === TITLE STEP === */}
        {quiz.currentStep === 'title' && (
          <div className="flex flex-col items-center gap-6 text-center w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00F0FF]/20 blur-3xl rounded-full" />
              <Brain size={64} strokeWidth={1.5} className="text-[#00F0FF] relative z-10 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Krok {stepNumber} z {totalSteps}</p>
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">Co chcesz zrobić?</h2>
              <p className="text-sm text-white/50 mt-2 max-w-[280px] mx-auto">Wpisz zadanie, które masz w głowie. Bez oceniania.</p>
            </div>
            <input
              type="text"
              value={quiz.taskTitle}
              onChange={e => quiz.setTaskTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && quiz.nextStep()}
              placeholder="Np. Napisać raport, Zadzwonić do klienta..."
              className="w-full max-w-[340px] py-3.5 px-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00F0FF]/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all"
              autoFocus
            />
            <button
              onClick={() => quiz.nextStep()}
              disabled={!quiz.taskTitle.trim()}
              className="w-full max-w-[340px] py-3.5 px-4 bg-[#00F0FF]/15 border-2 border-[#00F0FF] rounded-xl text-[#00F0FF] font-bold uppercase tracking-wider hover:bg-[#00F0FF]/25 active:scale-[0.98] transition-all duration-150 shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Dalej →
            </button>
          </div>
        )}

        {/* === IMPORTANCE STEP === */}
        {quiz.currentStep === 'importance' && (
          <div className="flex flex-col items-center gap-6 text-center w-full">
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Krok {stepNumber} z {totalSteps}</p>
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">Czy to ważne?</h2>
              <p className="text-sm text-white/50 mt-2 max-w-[300px] mx-auto">Czy przybliża Cię to do Twojego głównego celu?</p>
            </div>
            <div className="flex gap-4 w-full max-w-[340px]">
              <button
                onClick={() => quiz.answerImportance(true)}
                className="flex-1 py-4 bg-[#39FF14]/10 border-2 border-[#39FF14] rounded-xl text-[#39FF14] font-black text-lg uppercase tracking-wider hover:bg-[#39FF14]/20 active:scale-[0.97] transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)]"
              >
                Tak
              </button>
              <button
                onClick={() => quiz.answerImportance(false)}
                className="flex-1 py-4 bg-white/[0.04] border-2 border-white/20 rounded-xl text-white/70 font-black text-lg uppercase tracking-wider hover:bg-white/[0.08] active:scale-[0.97] transition-all"
              >
                Nie
              </button>
            </div>
          </div>
        )}

        {/* === URGENCY STEP === */}
        {quiz.currentStep === 'urgency' && (
          <div className="flex flex-col items-center gap-6 text-center w-full">
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Krok {stepNumber} z {totalSteps}</p>
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">Czy to pilne?</h2>
              <p className="text-sm text-white/50 mt-2 max-w-[300px] mx-auto">Czy masz na to twardy termin lub deadline?</p>
            </div>
            <div className="flex gap-4 w-full max-w-[340px]">
              <button
                onClick={() => quiz.answerUrgency(true)}
                className="flex-1 py-4 bg-[#FF8C00]/10 border-2 border-[#FF8C00] rounded-xl text-[#FF8C00] font-black text-lg uppercase tracking-wider hover:bg-[#FF8C00]/20 active:scale-[0.97] transition-all shadow-[0_0_15px_rgba(255,140,0,0.3)]"
              >
                Tak
              </button>
              <button
                onClick={() => quiz.answerUrgency(false)}
                className="flex-1 py-4 bg-white/[0.04] border-2 border-white/20 rounded-xl text-white/70 font-black text-lg uppercase tracking-wider hover:bg-white/[0.08] active:scale-[0.97] transition-all"
              >
                Nie
              </button>
            </div>
          </div>
        )}

        {/* === CONFIRM STEP === */}
        {quiz.currentStep === 'confirm' && quiz.predictedQuadrant !== null && (() => {
          const q = quiz.predictedQuadrant!;
          const meta = QUADRANT_META[q];
          return (
            <div className="flex flex-col items-center gap-6 text-center w-full">
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Krok {stepNumber} z {totalSteps}</p>
                <h2 className="text-2xl font-black text-white uppercase tracking-wide">Potwierdzenie</h2>
              </div>

              <div className="w-full max-w-[340px] p-5 rounded-xl border-2 bg-white/[0.04]" style={{ borderColor: meta.color, boxShadow: `0 0 25px ${meta.glow}` }}>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Zadanie</p>
                <p className="text-white font-bold text-lg mb-4 break-words">{quiz.taskTitle}</p>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Ćwiartka</p>
                <p className="font-black text-lg uppercase tracking-wide" style={{ color: meta.color }}>{meta.label}</p>
              </div>

              {/* Manual override — quadrant selector */}
              <div className="w-full max-w-[340px]">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2 text-center">Zmień ćwiartkę ręcznie</p>
                <div className="grid grid-cols-4 gap-2">
                  {([1, 2, 3, 4] as QuadrantNumber[]).map(n => {
                    const m = QUADRANT_META[n];
                    const active = n === q;
                    return (
                      <button
                        key={n}
                        onClick={() => quiz.setPredictedQuadrant(n)}
                        className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${active ? 'border-2 scale-105' : 'border border-white/10 opacity-50 hover:opacity-80'}`}
                        style={active ? { borderColor: m.color, color: m.color, boxShadow: `0 0 10px ${m.glow}` } : { color: m.color }}
                      >
                        Q{n}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={quiz.isSubmitting}
                className="w-full max-w-[340px] py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: `${meta.color}22`,
                  borderWidth: 2,
                  borderColor: meta.color,
                  color: meta.color,
                  boxShadow: `0 0 20px ${meta.glow}`,
                }}
              >
                <Check size={20} strokeWidth={2.5} />
                {quiz.isSubmitting ? 'Zapisuję...' : 'Zapisz zadanie'}
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default QuizModal;
