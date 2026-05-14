// ============================================================================
// FocusFlow 2.0 - Dashboard Screen (Pulpit)
// Landing view with Q1 focus and quick add CTA
// PDF Reference: str. 15
// ============================================================================

import { Plus } from 'lucide-react';

export const DashboardScreen = () => {
  return (
    <div className="content-area">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Twój dzisiejszy cel
        </h1>
        <p className="text-sm text-white/60">Q1 - Pilne i Ważne</p>
      </header>

      {/* Q1 Task Card (Empty State) */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-neon-lime shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
          <span className="text-xs font-semibold text-neon-lime uppercase tracking-wider">
            Q1 Focus
          </span>
        </div>
        
        <p className="text-white/40 text-center py-8">
          Brak aktywnego celu Q1
        </p>
        
        <button className="w-full py-3 px-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl text-neon-cyan font-medium hover:bg-neon-cyan/20 transition-colors flex items-center justify-center gap-2">
          <Plus size={18} />
          Dodaj pierwsze zadanie
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-neon-lime">0</p>
          <p className="text-xs text-white/50">Zadań Q1</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-neon-purple">0</p>
          <p className="text-xs text-white/50">Zadań Q2</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
