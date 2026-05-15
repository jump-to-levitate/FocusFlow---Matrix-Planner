// ============================================================================
// FocusFlow 2.0 - Dashboard Screen (Pulpit)
// Landing view with Q1 focus and quick add CTA
// PDF Reference: str. 15
// ============================================================================

import { Plus } from 'lucide-react';

export const DashboardScreen = () => {
  return (
    <div className="flex flex-col h-full pt-4 pb-4 gap-6">
      {/* Header */}
      <header className="shrink-0">
        <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-2">
          Twój cel na teraz
        </h1>
        <p className="text-sm text-white/50 font-medium">Q1 - Pilne i Ważne</p>
      </header>

      {/* Q1 Task Card (Empty State) */}
      <div className="glass-card p-6 border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.8)]" />
          <span className="text-xs font-black text-[#39FF14] uppercase tracking-widest">
            Q1 Focus
          </span>
        </div>
        
        <p className="text-white/30 text-center py-8 text-sm">
          Brak aktywnego celu Q1
        </p>
        
        {/* CTA Button - neon green with strong glow */}
        <button className="w-full py-3.5 px-4 bg-[#39FF14]/15 border-2 border-[#39FF14] rounded-xl text-[#39FF14] font-bold uppercase tracking-wider hover:bg-[#39FF14]/25 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(57,255,20,0.5),0_0_70px_rgba(57,255,20,0.12)]">
          <Plus size={20} strokeWidth={2.5} />
          Start Focus
        </button>
      </div>

      {/* Quick Note Section */}
      <div className="glass-card p-4 border border-white/[0.06]">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Szybka notatka</p>
        <div className="min-h-[80px] rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 flex items-start">
          <p className="text-xs text-white/20 italic">Zapisz myśl...</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        <div className="glass-card p-4 text-center border border-[#39FF14]/20">
          <p className="text-3xl font-black text-[#39FF14]">0</p>
          <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-1">Q1</p>
        </div>
        <div className="glass-card p-4 text-center border border-[#D000FF]/20">
          <p className="text-3xl font-black text-[#D000FF]">0</p>
          <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-1">Q2</p>
        </div>
        <div className="glass-card p-4 text-center border border-[#FF8C00]/20">
          <p className="text-3xl font-black text-[#FF8C00]">0</p>
          <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-1">Q3</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
