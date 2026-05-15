// ============================================================================
// FocusFlow 2.0 - Bottom Navigation Component
// 5-item navigation: Pulpit, Macierz, Dzisiaj, Notes, Timer
// Fixed position with 480px constraint and safe area support
// ============================================================================

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Grid2x2, Calendar, StickyNote, Clock } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Pulpit', icon: LayoutDashboard },
  { to: '/matrix', label: 'Macierz', icon: Grid2x2 },
  { to: '/today', label: 'Dzisiaj', icon: Calendar },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/timer', label: 'Timer', icon: Clock },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[480px]">
      {/* Padding container - dynamic safe area for gesture bars */}
      <div className="px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {/* Glassmorphism background */}
        <div className="rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] px-2 py-3">
          <div className="flex items-center justify-around">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'text-[#C084FC] drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]'
                      : 'text-white/50 hover:text-white/70'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Icon: thicker stroke + light fill when active */}
                    <Icon 
                      size={24} 
                      strokeWidth={isActive ? 2.5 : 1.5}
                      className={isActive 
                        ? 'fill-[rgba(192,132,252,0.25)] transition-all duration-150' 
                        : 'transition-all duration-150'
                      }
                    />
                    <span className={`text-[10px] font-medium transition-all duration-150 ${
                      isActive ? 'font-semibold' : ''
                    }`}>
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
