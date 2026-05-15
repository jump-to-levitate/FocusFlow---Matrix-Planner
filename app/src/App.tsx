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
import { TodayScreen } from './screens/TodayScreen';
import { NotesScreen } from './screens/NotesScreen';
import { TimerScreen } from './screens/TimerScreen';

// ============================================================================
// AppShell Component - "Siatka Bezpieczeństwa 480px"
// ============================================================================

interface AppShellProps {
  children: ReactNode;
}

function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
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
        {/* Main content area with padding for bottom nav */}
        <main className="content-area">
          <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/matrix" element={<MatrixScreen />} />
            <Route path="/today" element={<TodayScreen />} />
            <Route path="/notes" element={<NotesScreen />} />
            <Route path="/timer" element={<TimerScreen />} />
          </Routes>
        </main>
        
        {/* Bottom Navigation - fixed at bottom */}
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

