import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import type { FC } from 'react';
import { GLOW, colors } from '../../constants/colors';

interface QuizSectionProps {
  label: string;
  question: string;
  index: number;
  maxIndex: number;
  currentAnswer: boolean | undefined;
  onAnswer: (value: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const QuizSection: FC<QuizSectionProps> = ({
  label, question, index, maxIndex, currentAnswer, onPrev, onNext, onAnswer,
}) => (
  <section className="space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="text-[10px] font-black uppercase tracking-qlabel text-textSecondary">{label}</h3>
      <div className="flex items-center space-x-1">
        <button
          disabled={index === 0}
          onClick={onPrev}
          className="p-1 rounded-lg disabled:opacity-10 bg-panel text-textSecondary"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-[10px] font-bold text-textSecondary opacity-60">{index + 1}/{maxIndex + 1}</span>
        <button
          disabled={index === maxIndex}
          onClick={onNext}
          className="p-1 rounded-lg disabled:opacity-10 bg-panel text-textSecondary"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
    <div className="rounded-card p-4 min-h-[120px] flex flex-col justify-center bg-panel border border-slate800">
      <div key={index} className="animate-in slide-in-from-right-4 fade-in duration-300">
        <p className="text-white text-sm font-medium leading-tight mb-3 uppercase tracking-tight">{question}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onAnswer(true)}
            className={`flex-1 py-3 rounded-card font-black text-xs flex items-center justify-center gap-1 uppercase tracking-qlabel transition-all border-2 ${currentAnswer === true ? 'bg-neonGreen text-midnight border-neonGreen' : 'bg-slate900/40 text-neonSlate border-transparent'}`}
            style={currentAnswer === true ? { boxShadow: GLOW.ring(colors.neonGreen) } : undefined}
          >
            <Check size={16} /> Tak
          </button>
          <button
            onClick={() => onAnswer(false)}
            className={`flex-1 py-3 rounded-card font-black text-xs flex items-center justify-center gap-1 uppercase tracking-qlabel transition-all border-2 ${currentAnswer === false ? 'bg-neonPurple text-white border-neonPurple' : 'bg-slate900/40 text-neonSlate border-transparent'}`}
            style={currentAnswer === false ? { boxShadow: GLOW.ring(colors.neonPurple) } : undefined}
          >
            <X size={16} /> Nie
          </button>
        </div>
      </div>
    </div>
  </section>
);
