import { X, Brain } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal = ({ isOpen, onClose }: QuizModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content — matches device frame width */}
      <div className="relative w-full max-w-[430px] mx-auto h-full max-h-[932px] bg-[var(--color-bg)] flex flex-col items-center justify-center px-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white/70 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Step 1 placeholder */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00F0FF]/20 blur-3xl rounded-full" />
            <Brain
              size={64}
              strokeWidth={1.5}
              className="text-[#00F0FF] relative z-10 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]"
            />
          </div>

          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
              Krok 1 z 3
            </p>
            <h2 className="text-2xl font-black text-white uppercase tracking-wide">
              Co chcesz zrobić?
            </h2>
            <p className="text-sm text-white/50 mt-2 max-w-[280px]">
              Wpisz zadanie, które masz w głowie. Bez oceniania.
            </p>
          </div>

          <input
            type="text"
            placeholder="Np. Napisać raport, Zadzwonić do klienta..."
            className="w-full max-w-[340px] py-3.5 px-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00F0FF]/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all"
            autoFocus
          />

          <button className="w-full max-w-[340px] py-3.5 px-4 bg-[#00F0FF]/15 border-2 border-[#00F0FF] rounded-xl text-[#00F0FF] font-bold uppercase tracking-wider hover:bg-[#00F0FF]/25 active:scale-[0.98] transition-all duration-150 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            Dalej →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
