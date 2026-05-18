import { X, Brain, ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizForm } from '../../hooks/useQuizForm';
import type { QuadrantNumber } from '../../utils/taskClassifier';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuadrant?: QuadrantNumber | null;
  initialTitle?: string;
  classifyTaskId?: number;
  onClassify?: (id: number, quadrant: QuadrantNumber) => void;
  skipTitleStep?: boolean; // default: true if initialTitle provided
}

const QUADRANT_META: Record<QuadrantNumber, { label: string; color: string; glow: string }> = {
  1: { label: 'Q1 — Rób teraz',      color: '#39FF14', glow: 'rgba(57,255,20,0.4)' },
  2: { label: 'Q2 — Centrum planowania',    color: '#D000FF', glow: 'rgba(208,0,255,0.4)' },
  3: { label: 'Q3 — Proza życia',    color: '#FF8C00', glow: 'rgba(255,140,0,0.4)' },
  4: { label: 'Q4 — Archiwum',  color: '#FFFFFF', glow: 'rgba(255,255,255,0.4)' },
};

const IMPORTANCE_QUESTIONS = [
  'Czy wykonanie tego zadania przybliża Cię do Twoich głównych celów na ten miesiąc/rok?',
  'Czy to zadanie buduje fundament pod Twoją przyszłość (np. zdrowie, finanse, oceny, relacje)?',
  'Czy za tydzień będziesz żałować, że nie poświęciłeś/aś czasu na tę konkretną rzecz?',
];

const URGENCY_QUESTIONS = [
  'Czy masz „twardy" termin realizacji (deadline), który upływa w ciągu najbliższych dni?',
  'Czy zignorowanie tego zadania wywoła natychmiastowy, realny problem?',
  'Czy ktoś inny czeka na efekt Twojej pracy, aby móc ruszyć ze swoimi zadaniami?',
];

const IMPORTANCE_LABELS = ['Cel', 'Inwestycja', 'Żal'];
const URGENCY_LABELS = ['Termin', 'Konsekwencje', 'Blokada'];

export const QuizModal = ({ isOpen, onClose, initialQuadrant, initialTitle, classifyTaskId: _classifyTaskId, onClassify: _onClassify, skipTitleStep }: QuizModalProps) => {
  const quiz = useQuizForm({ initialQuadrant: initialQuadrant ?? null, initialTitle, skipTitleStep });

  if (!isOpen) return null;

  const handleClose = () => {
    quiz.resetQuiz();
    onClose();
  };

  const shouldSkipTitle = skipTitleStep ?? (initialTitle ? true : false);
  const hasTitleStep = !shouldSkipTitle && initialQuadrant == null;
  const needsSubcategory = quiz.predictedQuadrant === 2 || quiz.predictedQuadrant === 3 || quiz.predictedQuadrant === 4;

  const getStepNumber = () => {
    const baseMap: Record<string, number> = hasTitleStep
      ? { title: 1, quiz: 2, confirm: 3, subcategory: 4 }
      : { title: 1, quiz: 1, confirm: 2, subcategory: 3 };

    if (initialQuadrant != null && initialTitle) {
      return 1;
    }

    return baseMap[quiz.currentStep] || 1;
  };

  const getTotalSteps = () => {
    if (initialQuadrant != null && initialTitle) return 1;
    if (hasTitleStep) return needsSubcategory ? 4 : 3;
    return needsSubcategory ? 3 : 2;
  };

  const stepNumber = getStepNumber();
  const totalSteps = getTotalSteps();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal content */}
      <div className="relative w-full max-w-[430px] mx-auto h-full max-h-[932px] bg-[var(--color-bg)] flex flex-col items-center justify-center px-6">
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

        {/* === QUIZ CAROUSEL STEP === */}
        {quiz.currentStep === 'quiz' && (() => {
          const slide = quiz.currentSlide;
          const impAnswer = quiz.importanceAnswers[slide];
          const urgAnswer = quiz.urgencyAnswers[slide];

          return (
            <div className="flex flex-col items-center gap-5 w-full">
              <div className="text-center">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Krok {stepNumber} z {totalSteps}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Slajd {slide + 1} / 3</p>
              </div>

              {/* IMPORTANCE SECTION */}
              <div className="w-full max-w-[360px] p-4 rounded-xl border border-[#D000FF]/40 bg-[#D000FF]/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#D000FF] shadow-[0_0_8px_rgba(208,0,255,0.8)]" />
                  <span className="text-[10px] font-black text-[#D000FF] uppercase tracking-widest">Ważność — {IMPORTANCE_LABELS[slide]}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed mb-3">{IMPORTANCE_QUESTIONS[slide]}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => quiz.answerImportance(slide, true)}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.97] ${
                      impAnswer === true
                        ? 'bg-[#D000FF]/20 border-2 border-[#D000FF] text-[#D000FF] shadow-[0_0_12px_rgba(208,0,255,0.4)]'
                        : 'bg-white/[0.04] border border-white/15 text-white/50 hover:bg-white/[0.08]'
                    }`}
                  >
                    Tak
                  </button>
                  <button
                    onClick={() => quiz.answerImportance(slide, false)}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.97] ${
                      impAnswer === false
                        ? 'bg-[#D000FF]/20 border-2 border-[#D000FF]/60 text-[#D000FF]/80 shadow-[0_0_8px_rgba(208,0,255,0.2)]'
                        : 'bg-white/[0.04] border border-white/15 text-white/50 hover:bg-white/[0.08]'
                    }`}
                  >
                    Nie
                  </button>
                </div>
              </div>

              {/* URGENCY SECTION */}
              <div className="w-full max-w-[360px] p-4 rounded-xl border border-[#FF8C00]/40 bg-[#FF8C00]/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF8C00] shadow-[0_0_8px_rgba(255,140,0,0.8)]" />
                  <span className="text-[10px] font-black text-[#FF8C00] uppercase tracking-widest">Pilność — {URGENCY_LABELS[slide]}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed mb-3">{URGENCY_QUESTIONS[slide]}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => quiz.answerUrgency(slide, true)}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.97] ${
                      urgAnswer === true
                        ? 'bg-[#FF8C00]/20 border-2 border-[#FF8C00] text-[#FF8C00] shadow-[0_0_12px_rgba(255,140,0,0.4)]'
                        : 'bg-white/[0.04] border border-white/15 text-white/50 hover:bg-white/[0.08]'
                    }`}
                  >
                    Tak
                  </button>
                  <button
                    onClick={() => quiz.answerUrgency(slide, false)}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.97] ${
                      urgAnswer === false
                        ? 'bg-[#FF8C00]/20 border-2 border-[#FF8C00]/60 text-[#FF8C00]/80 shadow-[0_0_8px_rgba(255,140,0,0.2)]'
                        : 'bg-white/[0.04] border border-white/15 text-white/50 hover:bg-white/[0.08]'
                    }`}
                  >
                    Nie
                  </button>
                </div>
              </div>

              {/* Carousel navigation */}
              <div className="flex items-center justify-center gap-6 mt-2">
                <button
                  onClick={quiz.prevSlide}
                  disabled={slide === 0}
                  className="p-2 text-white/40 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {[0, 1, 2].map(i => {
                    const bothFilled = quiz.importanceAnswers[i] !== null && quiz.urgencyAnswers[i] !== null;
                    return (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                          i === slide
                            ? 'bg-white scale-125 shadow-[0_0_6px_rgba(255,255,255,0.5)]'
                            : bothFilled
                              ? 'bg-white/50'
                              : 'bg-white/15'
                        }`}
                      />
                    );
                  })}
                </div>

                <button onClick={quiz.nextSlide} className="p-2 text-white/40 hover:text-white/70 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          );
        })()}

        {/* === SUBCATEGORY STEP (Q2 - Centrum Planowania) === */}
        {quiz.currentStep === 'subcategory' && quiz.predictedQuadrant === 2 && (
          <div className="flex flex-col items-center gap-4 text-center w-full">
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Krok {stepNumber} z {totalSteps}</p>
              <h2 className="text-2xl font-black uppercase tracking-wide" style={{ color: '#D000FF' }}>Centrum Planowania (Q2)</h2>
              <p className="text-sm text-white/50 mt-2">Zdefiniuj charakter tego zadania</p>
            </div>

            <div className="w-full max-w-[340px] grid grid-cols-2 gap-3">
              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('rutyna');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#D000FF]/50 bg-[#D000FF]/10 text-left hover:border-[#D000FF] hover:shadow-[0_0_25px_rgba(208,0,255,0.5)] hover:scale-[1.02] transition-all min-h-[160px] flex flex-col"
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-black text-[#D000FF] text-sm uppercase tracking-wide">Rutyna</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Czy jest to nawyk, system, który chcesz wdrożyć, by doprowadzić cię do celu?</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('projekt');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#00FF66]/50 bg-[#00FF66]/10 text-left hover:border-[#00FF66] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] hover:scale-[1.02] transition-all min-h-[160px] flex flex-col"
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="font-black text-[#00FF66] text-sm uppercase tracking-wide">Projekt</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Czy jest to konkretny projekt, nad którym będziesz pracować?</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('ogolny_cel');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#00FF66]/50 bg-[#00FF66]/10 text-left hover:border-[#00FF66] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] hover:scale-[1.02] transition-all min-h-[160px] flex flex-col"
              >
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-black text-[#00FF66] text-sm uppercase tracking-wide leading-tight">Ogólny<br />cel</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Czy to ogólny kierunek bez rozplanowanych działań?</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('inne');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#D000FF]/50 bg-[#D000FF]/10 text-left hover:border-[#D000FF] hover:shadow-[0_0_25px_rgba(208,0,255,0.5)] hover:scale-[1.02] transition-all min-h-[160px] flex flex-col"
              >
                <div className="text-2xl mb-2">💼</div>
                <div className="font-black text-[#D000FF] text-sm uppercase tracking-wide">Inne</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Inny charakter działania, niewpisujący się w powyższe ramy.</div>
              </button>
            </div>

            <div className="w-full max-w-[340px] p-3 rounded-lg border border-[#D000FF]/20 bg-[#D000FF]/5 backdrop-blur-sm">
              <p className="text-[11px] text-white/60 leading-relaxed text-left">
                <span className="text-[#D000FF] font-bold">Wskazówka:</span> Kwadrant II to serce Twojego rozwoju. Inwestycja w te zadania redukuje stres w przyszłości.
              </p>
            </div>
          </div>
        )}

        {/* === SUBCATEGORY STEP (Q3 - Hub Logistyki) === */}
        {quiz.currentStep === 'subcategory' && quiz.predictedQuadrant === 3 && (
          <div className="flex flex-col items-center gap-4 text-center w-full">
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Krok {stepNumber} z {totalSteps}</p>
              <h2 className="text-2xl font-black uppercase tracking-wide" style={{ color: '#FF8C00' }}>Hub Logistyki (Q3)</h2>
              <p className="text-sm text-white/50 mt-2">Wybierz strategię dla zadania</p>
            </div>

            <div className="w-full max-w-[340px] grid grid-cols-2 gap-3">
              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('zrob_teraz');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#FF8C00]/50 bg-[#FF8C00]/10 text-left hover:border-[#FF8C00] hover:shadow-[0_0_25px_rgba(255,140,0,0.5)] hover:scale-[1.02] transition-all min-h-[140px] flex flex-col"
              >
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-black text-[#FF8C00] text-sm uppercase tracking-wide">Zrób teraz</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Zajmie mniej niż 10 min? Działaj!</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('zaplanuj');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#00E5FF]/50 bg-[#00E5FF]/10 text-left hover:border-[#00E5FF] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all min-h-[140px] flex flex-col"
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="font-black text-[#00E5FF] text-sm uppercase tracking-wide">Zaplanuj</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Zbierz drobiazgi w jeden sprint logistyczny</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('w_przerwie');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#00E5FF]/50 bg-[#00E5FF]/10 text-left hover:border-[#00E5FF] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:scale-[1.02] transition-all min-h-[140px] flex flex-col"
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-black text-[#00E5FF] text-sm uppercase tracking-wide leading-tight">Zrób<br />w przerwie</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Użyj tego jako mechanicznego resetu dla mózgu</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('inne');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#FF8C00]/50 bg-[#FF8C00]/10 text-left hover:border-[#FF8C00] hover:shadow-[0_0_25px_rgba(255,140,0,0.5)] hover:scale-[1.02] transition-all min-h-[140px] flex flex-col"
              >
                <div className="text-2xl mb-2">💼</div>
                <div className="font-black text-[#FF8C00] text-sm uppercase tracking-wide">Inne</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Pozostałe codzienne obowiązki i dystraktory</div>
              </button>
            </div>

            <div className="w-full max-w-[340px] p-3 rounded-lg border border-[#FF8C00]/20 bg-[#FF8C00]/5 backdrop-blur-sm">
              <p className="text-[11px] text-white/60 leading-relaxed text-left">
                <span className="text-[#FF8C00] font-bold">Wskazówka:</span> Zadania z III ćwiartki często udają ważne. Wybierz strategię, która nie przerwie Twojego stanu Flow.
              </p>
            </div>
          </div>
        )}

        {/* === SUBCATEGORY STEP (Q4 - Archiwum) === */}
        {quiz.currentStep === 'subcategory' && quiz.predictedQuadrant === 4 && (
          <div className="flex flex-col items-center gap-4 w-full text-center">
            <div className="mb-2">
              <h2 className="text-2xl font-black tracking-tight">
                <span className="text-[#9CA3AF]">ARCHIWUM</span>
                <span className="text-[#BDC3C7] ml-2">(Q4)</span>
              </h2>
              <p className="text-sm text-white/50 mt-2">Wybierz typ dystraktora lub odrzuć</p>
            </div>

            <div className="w-full max-w-[340px] grid grid-cols-2 gap-3">
              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('rozrywka');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#9CA3AF]/60 bg-[#9CA3AF]/10 text-left hover:border-[#9CA3AF] hover:shadow-[0_0_25px_rgba(156,163,175,0.5)] hover:scale-[1.02] transition-all min-h-[140px] flex flex-col"
              >
                <div className="text-2xl mb-2">🎮</div>
                <div className="font-black text-[#9CA3AF] text-sm uppercase tracking-wide">Rozrywka</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Pasywny reset czy pożeracz czasu? Odłóż na bezpieczny moment po focusie.</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('hobby');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#9CA3AF]/60 bg-[#9CA3AF]/10 text-left hover:border-[#9CA3AF] hover:shadow-[0_0_25px_rgba(156,163,175,0.5)] hover:scale-[1.02] transition-all min-h-[140px] flex flex-col"
              >
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-black text-[#9CA3AF] text-sm uppercase tracking-wide">Hobby</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Projekty z pasji. Ważne dla dopaminy, ale nie budują teraz wątku głównego.</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('optymalizacja');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#9CA3AF]/60 bg-[#9CA3AF]/10 text-left hover:border-[#9CA3AF] hover:shadow-[0_0_25px_rgba(156,163,175,0.5)] hover:scale-[1.02] transition-all min-h-[140px] flex flex-col"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-black text-[#9CA3AF] text-sm uppercase tracking-wide leading-tight">Optymalizacja</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Ulepszanie systemów i detali. Uważaj na produktywną prokrastynację!</div>
              </button>

              <button
                onClick={async () => {
                  const success = await quiz.submitTaskWithSubcategory('side_questy');
                  if (success) handleClose();
                }}
                className="p-4 rounded-xl border-2 border-[#9CA3AF]/60 bg-[#9CA3AF]/10 text-left hover:border-[#9CA3AF] hover:shadow-[0_0_25px_rgba(156,163,175,0.5)] hover:scale-[1.02] transition-all min-h-[140px] flex flex-col"
              >
                <div className="text-2xl mb-2">🗺️</div>
                <div className="font-black text-[#9CA3AF] text-sm uppercase tracking-wide leading-tight">Side-questy</div>
                <div className="text-[11px] text-white/60 mt-2 leading-tight">Zadania poboczne i luźne pomysły, które nie pasują nigdzie indziej.</div>
              </button>
            </div>

            {/* Destructive Hatch */}
            <div className="w-full max-w-[340px] mt-2 pt-2 border-t border-red-500/20">
              <button
                onClick={() => handleClose()}
                className="w-full py-3 px-4 rounded-xl border-2 border-red-600/50 bg-red-600/10 text-left hover:border-red-600 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center group-hover:bg-red-600/30 transition-colors">
                  <span className="text-sm">🗑️</span>
                </div>
                <div className="flex-1">
                  <div className="font-black text-red-400 text-xs uppercase tracking-wide">Odrzuć / Zapomnij</div>
                  <div className="text-[10px] text-white/50 mt-0.5 leading-tight">Całkowicie skasuj tę myśl. Masz psychologiczne prawo odpuścić ten temat.</div>
                </div>
              </button>
            </div>

            <div className="w-full max-w-[340px] p-2.5 rounded-lg border border-[#9CA3AF]/30 bg-[#9CA3AF]/10 backdrop-blur-sm">
              <p className="text-[11px] text-white/70 leading-relaxed text-left">
                <span className="text-[#9CA3AF] font-bold">Wskazówka:</span> IV ćwiartka to kontrolowane odłożenie tematów, które teraz nie służą Twojemu celowi.
              </p>
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

              {/* Manual overrides */}
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
                onClick={async () => {
                  if (quiz.predictedQuadrant === 2 || quiz.predictedQuadrant === 3 || quiz.predictedQuadrant === 4) {
                    await quiz.nextStep();
                  } else {
                    const success = await quiz.nextStep();
                    if (success) handleClose();
                  }
                }}
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
                {quiz.predictedQuadrant === 2 || quiz.predictedQuadrant === 3 || quiz.predictedQuadrant === 4
                  ? 'Wybierz podkategorię →' 
                  : (quiz.isSubmitting ? 'Zapisuję...' : 'Zapisz zadanie')}
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default QuizModal;