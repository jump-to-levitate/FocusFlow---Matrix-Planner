// ============================================================================
// FocusFlow 2.0 - Brain Dump Screen (Start Quiz / Friction Design)
// Entry point: "Start Quiz" CTA with hidden "Archiwum myśli" link
// PDF Reference: ADHD friction design pattern
// ============================================================================

import { Brain, Archive } from 'lucide-react';
import { useState } from 'react';

export const BrainDumpScreen = () => {
  const [showArchive, setShowArchive] = useState(false);

  if (showArchive) {
    return (
      <div className="pt-6">
        <header className="mb-6">
          <h1 className="text-xl font-black text-white uppercase tracking-wide mb-2">
            Archiwum Myśli
          </h1>
          <p className="text-sm text-white/50">Twoje poprzednie brain dumpy</p>
        </header>

        <div className="glass-card p-6 text-center border border-white/[0.08]">
          <p className="text-white/30 text-sm py-8">Brak zapisanych myśli</p>
        </div>

        <button
          onClick={() => setShowArchive(false)}
          className="mt-4 w-full py-2 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          ← Wróć do Brain Dump
        </button>
      </div>
    );
  }

  return (
    <div className="pt-6 flex flex-col items-center justify-center min-h-[60vh]">
      {/* Brain Icon with glow */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-[#D000FF]/20 blur-3xl rounded-full" />
        <Brain 
          size={80} 
          strokeWidth={1.5}
          className="text-[#D000FF] relative z-10 drop-shadow-[0_0_20px_rgba(208,0,255,0.5)]" 
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-2 text-center">
        Brain Dump
      </h1>
      <p className="text-sm text-white/50 mb-10 text-center max-w-[280px]">
        Wyrzuć wszystko z głowy. Bez oceniania, bez kategorii.
      </p>

      {/* CTA Button - neon purple with strong glow */}
      <button className="w-full max-w-[300px] py-4 px-6 bg-[#D000FF]/15 border-2 border-[#D000FF] rounded-2xl text-[#D000FF] font-bold uppercase tracking-wider hover:bg-[#D000FF]/25 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(208,0,255,0.5),0_0_60px_rgba(208,0,255,0.15)]">
        <Brain size={22} strokeWidth={2.5} />
        Start Quiz
      </button>

      {/* Friction: hidden archive link (intentionally low contrast) */}
      <button
        onClick={() => setShowArchive(true)}
        className="mt-8 flex items-center gap-2 text-xs text-white/25 hover:text-white/40 transition-colors"
      >
        <Archive size={14} />
        Archiwum myśli
      </button>
    </div>
  );
};

export default BrainDumpScreen;
