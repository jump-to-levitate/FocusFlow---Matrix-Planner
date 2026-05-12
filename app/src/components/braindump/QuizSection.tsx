import React from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

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

export const QuizSection: React.FC<QuizSectionProps> = ({
  label, question, index, maxIndex, currentAnswer, onAnswer, onPrev, onNext,
}) => (
  <section className="space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: '#B0B0B0' }}>{label}</h3>
      <div className="flex items-center space-x-1">
        <button disabled={index === 0} onClick={onPrev} className="p-1 rounded-lg disabled:opacity-10" style={{ backgroundColor: '#121212', color: '#B0B0B0' }}>
          <ChevronLeft size={16} />
        </button>
        <span className="text-[10px] font-bold" style={{ color: '#4A4A4A' }}>{index + 1}/{maxIndex + 1}</span>
        <button disabled={index === maxIndex} onClick={onNext} className="p-1 rounded-lg disabled:opacity-10" style={{ backgroundColor: '#121212', color: '#B0B0B0' }}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
    <div className="rounded-2xl p-4 min-h-[120px] flex flex-col justify-center" style={{ backgroundColor: '#121212', border: '1px solid #1f2937' }}>
      <div key={index} className="animate-in slide-in-from-right-4 fade-in duration-300">
        <p className="text-white font-medium leading-tight mb-3 uppercase tracking-tight" style={{ fontSize: 14 }}>{question}</p>
        <div className="flex gap-2">
          <button onClick={() => onAnswer(true)} className="flex-1 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1 uppercase transition-all"
            style={currentAnswer === true ? { backgroundColor: '#39FF14', color: '#000', border: '2px solid #39FF14', boxShadow: '0 0 15px rgba(57,255,20,0.3)' } : { backgroundColor: 'rgba(15,23,42,0.4)', color: '#64748B', border: '2px solid transparent' }}>
            <Check size={16} /> Tak
          </button>
          <button onClick={() => onAnswer(false)} className="flex-1 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1 uppercase transition-all"
            style={currentAnswer === false ? { backgroundColor: '#A020F0', color: '#FFFFFF', border: '2px solid #A020F0', boxShadow: '0 0 15px rgba(160,32,240,0.3)' } : { backgroundColor: 'rgba(15,23,42,0.4)', color: '#64748B', border: '2px solid transparent' }}>
            <X size={16} /> Nie
          </button>
        </div>
      </div>
    </div>
  </section>
);