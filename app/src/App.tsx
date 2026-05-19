// ============================================================================
// FocusFlow 2.0 - Root Application Component
// Mobile-First AppShell with 480px Safety Net + React Router
// TECH_001 Implementation
// ============================================================================

import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './screens/DashboardScreen';
import { MatrixScreen } from './screens/MatrixScreen';
import { Q2PlanningCenter } from './screens/Q2PlanningCenter';
import { TimerScreen } from './screens/TimerScreen';
import { BrainDumpScreen } from './screens/BrainDumpScreen';
import { TimerProvider } from './context/TimerContext';

// ============================================================================
// AppShell Component - "Siatka Bezpieczeństwa 480px"
// ============================================================================

interface AppShellProps {
  children: ReactNode;
}

function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-outer">
      <div className="app-shell">
        {/* Dynamic Island notch - in normal flow, pushes content down naturally */}
        <div className="hidden min-[480px]:flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-[150px] h-[36px] bg-black rounded-full border border-white/[0.06]" />
        </div>
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Main App with Routing
// ============================================================================

function App() {
  return (
    <BrowserRouter>
      <TimerProvider>
        <AppShell>
          {/* Main content - grows to fill available space */}
          <main className="flex-1 overflow-y-auto scrollbar-hide">
            <Routes>
              <Route path="/" element={<DashboardScreen />} />
              <Route path="/matrix" element={<MatrixScreen />} />
              <Route path="/q2" element={<Q2PlanningCenter />} />
              <Route path="/timer" element={<TimerScreen />} />
              <Route path="/braindump" element={<BrainDumpScreen />} />
            </Routes>
          </main>
          
          {/* Bottom Navigation - sticky at bottom of device frame */}
          <BottomNav />
        </AppShell>
      </TimerProvider>
    </BrowserRouter>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default App;
export { AppShell };
export type { AppShellProps };

