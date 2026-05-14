// ============================================================================
// FocusFlow 2.0 - Root Application Component
// Mobile-First AppShell with 480px Safety Net
// ============================================================================

import { ReactNode } from 'react';

// ============================================================================
// AppShell Component - "Siatka Bezpieczeństwa 480px"
// Wszystkie widoki aplikacji muszą być wrapowane w ten komponent
// ============================================================================

interface AppShellProps {
  children: ReactNode;
}

function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* 
        SIATKA BEZPIECZEŃSTWA 480px
        - max-w-[480px]: Twardy limit szerokości (Mobile-First constraint)
        - mx-auto: Wycentrowanie na większych ekranach
        - min-h-screen: Pełna wysokość viewportu
        - px-4: Padding boczny 16px (bezpieczna strefa od krawędzi)
        - py-6: Padding górny/dolny 24px
        
        Źródło wymagania: docs/tech/conventions.md (ZASADA KRYTYCZNA)
      */}
      <div className="app-shell">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Main App Component
// ============================================================================

function App() {
  return (
    <AppShell>
      {/* 
        TODO: Tutaj znajdzie się routing (React Router) 
        lub renderowanie aktualnego widoku na podstawie stanu aplikacji
        
        Przykładowa struktura:
        - Dashboard (Pulpit) - str. 15 PDF
        - Matrix (Macierz Eisenhowera) - str. 16 PDF
        - TodayView (Wszystko na dzisiaj) - str. 5 PDF
        - Quiz (Brain Dump Quiz) - str. 18 PDF
        - Notes (Notatki) - str. 7 PDF
        - Timer (Focus Timer) - str. 6 PDF
      */}
      
      {/* Placeholder dla developmentu PLAN_000 */}
      <div className="glass-panel p-8 text-center animate-fade-in">
        {/* Logo / Brand */}
        <h1 className="text-3xl font-bold text-gradient-cyan mb-4">
          FocusFlow 2.0
        </h1>
        
        {/* Tagline */}
        <p className="text-lg text-white/70 mb-2">
          Matrix Planner dla ADHD Brain
        </p>
        
        {/* Status */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
          <span className="text-sm text-white/50">
            AppShell 480px Safety Net: Active
          </span>
        </div>
        
        {/* Constraint Visualization (dev only) */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-white/40 font-mono mb-2">
            DEBUG: Container Constraints
          </p>
          <div className="flex justify-between text-xs font-mono text-white/60">
            <span>max-w: 480px</span>
            <span>centered</span>
            <span>px-4</span>
          </div>
          {/* Visual indicator of max-width */}
          <div className="mt-2 h-1 bg-gradient-to-r from-neon-cyan via-neon-lime to-neon-magenta rounded-full" />
        </div>
        
        {/* Next Steps */}
        <div className="mt-8 text-sm text-white/40">
          <p>Zaimplementowane:</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li className="text-neon-lime">✓ Tailwind Config (colors, 480px)</li>
            <li className="text-neon-lime">✓ Design Tokens (colors.ts)</li>
            <li className="text-neon-lime">✓ Global Styles (index.css)</li>
            <li className="text-neon-lime">✓ AppShell Component</li>
          </ul>
          <p className="mt-4 text-white/30">
            Oczekuje: PLAN_001 (Core Data Layer)
          </p>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default App;
export { AppShell };
export type { AppShellProps };
