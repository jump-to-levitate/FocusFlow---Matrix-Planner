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
import { TimerScreen } from './screens/TimerScreen';
import { BrainDumpScreen } from './screens/BrainDumpScreen';

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
      <AppShell>
        {/* Main content - grows to fill available space */}
        <main className="content-area flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/matrix" element={<MatrixScreen />} />
            <Route path="/timer" element={<TimerScreen />} />
            <Route path="/braindump" element={<BrainDumpScreen />} />
          </Routes>
        </main>
        
        {/* Bottom Navigation - sticky at bottom of device frame */}
        <BottomNav />
      </AppShell>
    </BrowserRouter>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default App;
export { AppShell };
export type { AppShellProps };

