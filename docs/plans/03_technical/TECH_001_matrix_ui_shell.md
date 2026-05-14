# TECH_001: Matrix UI Shell Implementation

> Faza 1: Fundamenty i Szkielet (The Shell)  
> AppShell 480px, Bottom Navigation, Empty Matrix View

---

## Metadane

| Pole | Wartość |
|------|---------|
| **ID** | TECH_001 |
| **Tytuł** | Matrix UI Shell Implementation |
| **Faza Roadmap** | Faza 1: The Shell |
| **Status** | Draft - Ready for Implementation |
| **Data** | 2026-05-14 |
| **Priority** | P0 (MUST HAVE - Foundation) |
| **Estimated Effort** | 3 dni (1 developer) |

**Dependencies:**
- ✅ PLAN_000 (Repository Setup) - DONE
- ✅ docs/design-system.md (Visual spec)
- ✅ docs/business/glossary.md (Terminology)

**Powiązane dokumenty:**
- PDF str. 15 (Pulpit/Dashboard)
- PDF str. 16 (Macierz 2×2)
- PDF str. 5, 6, 7 (Bottom navigation pattern)
- docs/design-system.md (480px constraint, glassmorphism)

---

## 1. Executive Summary

### Cel
Zbudowanie **szkieletu aplikacji** - solidnego fundamentu który "trzyma" wszystko razem i wymusza Mobile-First 480px constraint.

### Key Deliverables
1. **AppShell** - Root layout z twardym limitem 480px
2. **Bottom Navigation** - 5-item navigation bar (Pulpit, Macierz, Dzisiaj, Notes, Timer)
3. **Empty Matrix View** - Grid 2×2 z placeholderami dla 4 ćwiartek
4. **Routing** - React Router z 480px constraint
5. **Global Styles** - Tailwind config + custom CSS utilities

### Success Criteria
> Aplikacja otwiera się na telefonie jako wycentrowany 480px viewport, z działającą nawigacją i widoczną Macierzą 2×2.

---

## 2. AppShell Specification (480px Safety Net)

### 2.1 Definicja

AppShell to **"siatka bezpieczeństwa"** - komponent root layoutu który wymusza `max-width: 480px` na wszystkich widokach, niezależnie od urządzenia.

### 2.2 Responsywność

| Viewport | Szerokość | Zachowanie AppShell |
|----------|-----------|---------------------|
| Mobile S | 320px | 100% szerokości, padding 16px |
| Mobile M | 375px | 100% szerokości, padding 16px |
| Mobile L | 414px | 100% szerokości, padding 16px |
| Mobile XL | 480px | 100% szerokości, max-width osiągnięty |
| Tablet/Desktop | >480px | Wycentrowany 480px box, `mx-auto` |
| Desktop XL | >1200px | Wycentrowany 480px box |

### 2.3 Implementacja (TypeScript + Tailwind)

```tsx
// app/src/components/AppShell.tsx
import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* 480px Safety Net Container */}
      <div className="mx-auto w-full max-w-[480px] min-h-screen px-4 py-6">
        {children}
      </div>
    </div>
  );
};
```

### 2.4 CSS Custom Properties

```css
/* app/src/index.css - AppShell styles */

@layer components {
  .app-shell {
    @apply mx-auto w-full max-w-[480px] min-h-screen px-4 py-6;
  }
  
  /* Mobile-first background */
  .app-bg {
    @apply bg-slate-900 min-h-screen;
  }
  
  /* Safe area for bottom nav - leaves breathing room above 80px nav */
  .content-area {
    @apply pb-28; /* 112px = 80px nav + 32px breathing room */
  }
}
```

### 2.5 Acceptance Criteria

- [ ] AppShell renderuje się jako `max-w-[480px]`
- [ ] Na desktopie layout jest wycentrowany (`mx-auto`)
- [ ] Na mobile layout zajmuje 100% szerokości z paddingiem
- [ ] Tło `bg-slate-900` (#0F172A) na całym ekranie
- [ ] Brak poziomych scrollbarów na żadnym urządzeniu

---

## 3. Bottom Navigation Component

### 3.1 Definicja

Bottom Navigation to pasek nawigacyjny na dole ekranu z 5 głównymi sekcjami aplikacji. Zgodnie z **Thumb-First Design** - primary navigation w dolnej 1/3 ekranu (Green Zone).

### 3.2 Struktura Nawigacji

| # | Nazwa PL | Nazwa EN | Ikona (Lucide) | Destination | PDF Ref |
|---|----------|----------|----------------|-------------|---------|
| 1 | **Pulpit** | Dashboard | `LayoutDashboard` | `/` (home) | str. 15 |
| 2 | **Macierz** | Matrix | `Grid2x2` | `/matrix` | str. 16 |
| 3 | **Dzisiaj** | Today | `Calendar` | `/today` | str. 5 |
| 4 | **Notes** | Notes | `StickyNote` | `/notes` | str. 7 |
| 5 | **Timer** | Timer | `Clock` | `/timer` | str. 6 |

### 3.3 UX Specyfikacja

#### Visual Design (z `design-system.md`):
- **Background:** Glassmorphism `bg-white/[0.08]` + `backdrop-blur(12px)`
- **Active Item:** Neon glow (primary color), filled icon
- **Inactive Item:** 50% opacity, outline icon
- **Height:** 80px (z safe area dla iPhone)
- **Touch Target:** 48×48px minimum (Apple HIG)

#### Behavior:
- Active route: neon underline + filled icon
- Tap feedback: scale 0.95 on press
- Transition: 150ms ease-out
- Always visible (sticky bottom)

### 3.4 Implementacja

```tsx
// app/src/components/BottomNav.tsx
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
    {/* Fixed nav constrained to 480px AppShell width, centered */}
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
                      ? 'text-neon-cyan'
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
                        ? 'fill-neon-cyan/20 transition-all duration-150' 
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
```

### 3.5 Tailwind Config Extensions

```js
// app/tailwind.config.js - additions for BottomNav

module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00F0FF',
      },
      animation: {
        'nav-press': 'navPress 150ms ease-out',
      },
      keyframes: {
        navPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
};
```

### 3.6 Acceptance Criteria

- [ ] 5 nawigacyjne items widoczne na dole ekranu
- [ ] Każdy item ma ikonę (Lucide) i label
- [ ] Active item ma neonowy kolor + underline
- [ ] Tap na item zmienia route (React Router)
- [ ] BottomNav jest sticky (zawsze widoczny)
- [ ] Touch targets ≥ 48px
- [ ] Glassmorphism background (blur + transparency)

---

## 4. Empty Matrix View

### 4.1 Definicja

Macierz 2×2 to główny widok aplikacji prezentujący **Eisenhower Matrix** - 4 ćwiartki: Q1 (Pilne/Ważne), Q2 (Ważne/Niepilne), Q3 (Pilne/Nieważne), Q4 (Niepilne/Nieważne).

W fazie "Shell" pokazujemy **pustą Macierz** z placeholderami i CTA do dodania pierwszego zadania.

### 4.2 Layout Grid

```
┌─────────────────────────────────────┐
│          MACIERZ 2×2               │
│    (max-w-[480px], gap-3)         │
├─────────────────┬─────────────────┤
│                 │                 │
│   Q1 (Ważne     │   Q2 (Ważne     │
│    + Pilne)     │    + Niepilne) │
│                 │                 │
│   [Zielony]     │   [Fioletowy]   │
│   neon border   │   neon border   │
│                 │                 │
│   "Dodaj        │   "Zaplanuj    │
│    pierwsze     │    w Q2"        │
│    zadanie"     │                 │
│                 │                 │
├─────────────────┼─────────────────┤
│                 │                 │
│   Q3 (Nie-      │   Q4 (Nie-      │
│    ważne +      │    ważne +      │
│    Pilne)       │    Niepilne)    │
│                 │                 │
│   [Cyjanowy]    │   [Szary]       │
│   neon border   │   neon border   │
│                 │                 │
│   "Proza         │   "Nie teraz"  │
│    życia"       │                 │
│                 │                 │
└─────────────────┴─────────────────┘
```

### 4.3 Quadrant Card Component

```tsx
// app/src/components/QuadrantCard.tsx
import { ReactNode } from 'react';
import { QuadrantNumber } from '@/types/task';

interface QuadrantCardProps {
  quadrant: QuadrantNumber;
  title: string;
  subtitle: string;
  color: 'lime' | 'purple' | 'cyan' | 'slate';
  children?: ReactNode;
}

const colorClasses = {
  lime: 'border-neon-lime/50 shadow-[0_0_20px_rgba(57,255,20,0.3)]',
  purple: 'border-neon-purple/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  cyan: 'border-neon-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  slate: 'border-slate-500/50',
};

const bgClasses = {
  lime: 'bg-neon-lime/5',
  purple: 'bg-neon-purple/5',
  cyan: 'bg-neon-cyan/5',
  slate: 'bg-slate-500/5',
};

export const QuadrantCard = ({ 
  quadrant, 
  title, 
  subtitle, 
  color, 
  children 
}: QuadrantCardProps) => {
  return (
    <div 
      className={`
        relative rounded-xl border backdrop-blur-sm 
        p-2 min-[360px]:p-4   {/* Responsive padding: tight on small screens */}
        ${colorClasses[color]}
        ${bgClasses[color]}
        min-h-[160px] min-[360px]:min-h-[200px]
        transition-all duration-200 hover:scale-[1.02]
      `}
    >
      {/* Header */}
      <div className="mb-2 min-[360px]:mb-3">
        <div className="flex items-center gap-1.5 min-[360px]:gap-2 mb-1">
          <span className="text-[10px] min-[360px]:text-xs font-bold text-white/60">Q{quadrant}</span>
          <h3 className="text-[11px] min-[360px]:text-sm font-semibold text-white leading-tight">
            {title}
          </h3>
        </div>
        {/* hyphens-auto prevents long words from breaking the Matrix layout */}
        <p className="text-[10px] min-[360px]:text-xs text-white/50 hyphens-auto leading-snug">
          {subtitle}
        </p>
      </div>
      
      {/* Content (empty state or tasks) */}
      <div className="flex-1">
        {children || (
          <div className="flex flex-col items-center justify-center h-20 min-[360px]:h-24 text-white/30">
            <p className="text-[10px] min-[360px]:text-xs text-center">Brak zadań</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

### 4.4 Matrix View Component

```tsx
// app/src/screens/MatrixScreen.tsx
import { QuadrantCard } from '@/components/QuadrantCard';
import { Plus } from 'lucide-react';

export const MatrixScreen = () => {
  return (
    <div className="content-area">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-h1 text-gradient-neon mb-2">Macierz</h1>
        <p className="text-small text-white/60">
          Klasyfikuj zadania według pilności i ważności
        </p>
      </header>

      {/* 2×2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Q1 - Do First */}
        <QuadrantCard
          quadrant={1}
          title="Zrób teraz"
          subtitle="Pilne i Ważne"
          color="lime"
        >
          <button className="flex flex-col items-center justify-center w-full h-full py-4 rounded-lg border border-dashed border-white/20 hover:border-neon-lime/50 hover:bg-neon-lime/5 transition-all">
            <Plus size={24} className="text-white/40 mb-2" strokeWidth={1.5} />
            <span className="text-xs text-white/50">Dodaj zadanie</span>
          </button>
        </QuadrantCard>

        {/* Q2 - Schedule */}
        <QuadrantCard
          quadrant={2}
          title="Zaplanuj"
          subtitle="Ważne, Niepilne"
          color="purple"
        >
          <button className="flex flex-col items-center justify-center w-full h-full py-4 rounded-lg border border-dashed border-white/20 hover:border-neon-purple/50 hover:bg-neon-purple/5 transition-all">
            <Plus size={24} className="text-white/40 mb-2" strokeWidth={1.5} />
            <span className="text-xs text-white/50">Dodaj zadanie</span>
          </button>
        </QuadrantCard>

        {/* Q3 - Delegate */}
        <QuadrantCard
          quadrant={3}
          title="Deleguj"
          subtitle="Pilne, Nieważne"
          color="cyan"
        >
          <button className="flex flex-col items-center justify-center w-full h-full py-4 rounded-lg border border-dashed border-white/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all">
            <Plus size={24} className="text-white/40 mb-2" strokeWidth={1.5} />
            <span className="text-xs text-white/50">Dodaj zadanie</span>
          </button>
        </QuadrantCard>

        {/* Q4 - Delete */}
        <QuadrantCard
          quadrant={4}
          title="Nie teraz"
          subtitle="Niepilne, Nieważne"
          color="slate"
        >
          <button className="flex flex-col items-center justify-center w-full h-full py-4 rounded-lg border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
            <Plus size={24} className="text-white/40 mb-2" strokeWidth={1.5} />
            <span className="text-xs text-white/50">Dodaj zadanie</span>
          </button>
        </QuadrantCard>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 rounded-xl bg-white/[0.05] border border-white/[0.1]">
        <p className="text-xs text-white/60 text-center">
          Tip: Użyj <span className="text-neon-cyan">Brain Dump Quiz</span>, aby szybko sklasyfikować zadania
        </p>
      </div>
    </div>
  );
};
```

### 4.5 PDF Reference Mapping

| Element | PDF Strona | Specyfikacja |
|---------|------------|--------------|
| Grid 2×2 | str. 16 | `grid-cols-2`, gap 12px |
| Q1 (Zielony) | str. 16 | Neon lime `#39FF14`, glow effect |
| Q2 (Fioletowy) | str. 16 | Neon purple `#A855F7`, glow effect |
| Q3 (Cyjanowy) | str. 16 | Neon cyan `#00F0FF`, glow effect |
| Q4 (Szary) | str. 16 | Slate gray `#64748B`, no glow |
| "Dodaj zadanie" | str. 16 | Dashed border, + icon, hover state |

### 4.6 Acceptance Criteria

- [ ] Grid 2×2 renderuje się poprawnie w 480px
- [ ] 4 karty ćwiartek z odpowiednimi kolorami neonowymi
- [ ] Q1 ma najmocniejszy glow (priority signal)
- [ ] Każda karta ma: numer Q, tytuł, subtitle
- [ ] "Dodaj zadanie" button w każdej pustej ćwiartce
- [ ] Hover effects działają (scale, border color)
- [ ] Content nie wychodzi poza karty (text overflow)

---

## 5. Routing Setup

### 5.1 Route Structure

```
/                 -> DashboardScreen (Pulpit)
/matrix           -> MatrixScreen (Macierz)
/today            -> TodayScreen (Dzisiaj) - placeholder
/notes            -> NotesScreen (Brain Dump) - placeholder
/timer            -> TimerScreen (Focus Timer) - placeholder
```

### 5.2 Router Configuration

```tsx
// app/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { BottomNav } from '@/components/BottomNav';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { MatrixScreen } from '@/screens/MatrixScreen';
import { TodayScreen } from '@/screens/TodayScreen';
import { NotesScreen } from '@/screens/NotesScreen';
import { TimerScreen } from '@/screens/TimerScreen';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/matrix" element={<MatrixScreen />} />
          <Route path="/today" element={<TodayScreen />} />
          <Route path="/notes" element={<NotesScreen />} />
          <Route path="/timer" element={<TimerScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
```

### 5.3 Placeholder Screens

```tsx
// app/src/screens/TodayScreen.tsx (placeholder)
export const TodayScreen = () => (
  <div className="content-area flex items-center justify-center h-96">
    <p className="text-white/40">Dzisiaj - Faza 2</p>
  </div>
);

// Similar for NotesScreen, TimerScreen
```

### 5.4 Dashboard Screen (Pulpit) - Basic

```tsx
// app/src/screens/DashboardScreen.tsx
import { Plus } from 'lucide-react';

export const DashboardScreen = () => {
  return (
    <div className="content-area">
      <header className="mb-6">
        <h1 className="text-h1 text-white mb-2">Pulpit</h1>
        <p className="text-small text-white/60">Twój dzisiejszy focus</p>
      </header>

      {/* Empty State - Q1 */}
      <div className="rounded-xl bg-white/[0.08] backdrop-blur-sm border border-neon-lime/30 p-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-neon-lime animate-pulse" />
          <h2 className="text-body font-semibold text-white">Aktualny cel Q1</h2>
        </div>
        <p className="text-small text-white/50 mb-4">
          Nie masz jeszcze zadań w Q1. Dodaj swoje pierwsze zadanie!
        </p>
        <button className="w-full py-3 rounded-lg bg-neon-lime/20 border border-neon-lime/50 text-neon-lime font-medium flex items-center justify-center gap-2 hover:bg-neon-lime/30 transition-all">
          <Plus size={20} strokeWidth={1.5} />
          Dodaj zadanie
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Q1', count: 0, color: 'text-neon-lime' },
          { label: 'Q2', count: 0, color: 'text-neon-purple' },
          { label: 'Q3', count: 0, color: 'text-neon-cyan' },
          { label: 'Q4', count: 0, color: 'text-slate-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="text-center p-3 rounded-lg bg-white/[0.05]">
            <span className={`text-lg font-bold ${color}`}>{count}</span>
            <p className="text-[10px] text-white/40 uppercase">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 6. Global Styles & Tailwind Config

### 6.1 Extended Tailwind Config

> **ZASADA:** Brak hardcoded HEX w config. Wszystkie kolory pochodzą z CSS variables (`index.css`), które są SSOT z `colors.ts`.

```js
// app/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neon Palette - z CSS variables (SSOT: index.css ← colors.ts)
        'neon-lime': 'var(--color-neon-lime)',
        'neon-purple': 'var(--color-neon-magenta)',
        'neon-cyan': 'var(--color-neon-cyan)',
        'neon-pink': 'var(--color-neon-magenta)',
        'neon-yellow': 'var(--color-neon-yellow)',
        
        // Quadrant Colors - z CSS variables
        'q1': 'var(--color-q1)',
        'q2': 'var(--color-q2)',
        'q3': 'var(--color-q3)',
        'q4': 'var(--color-q4)',
        
        // Background - z CSS variables
        'app-bg': 'var(--color-bg)',
        'app-bg-elevated': 'var(--color-bg-elevated)',
        
        // Surfaces - z CSS variables
        'surface': {
          DEFAULT: 'var(--glass-light)',
          hover: 'var(--glass-medium)',
          heavy: 'var(--glass-heavy)',
          border: 'var(--glass-border)',
        },
        
        // Text Colors - z CSS variables
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        
        // Status - z CSS variables
        'status-success': 'var(--status-success)',
        'status-danger': 'var(--status-danger)',
        'status-warning': 'var(--status-warning)',
        'status-info': 'var(--status-info)',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'h1': ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'small': ['0.875rem', { lineHeight: '1.4' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      
      maxWidth: {
        'app': '480px',
      },
      
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
```

### 6.2 Global CSS

```css
/* app/src/index.css */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }
  
  body {
    @apply bg-slate-900 text-white font-sans;
    font-feature-settings: 'cv11', 'ss01';
  }
}

@layer components {
  /* AppShell container */
  .app-shell {
    @apply mx-auto w-full max-w-[480px] min-h-screen px-4 py-6;
  }
  
  /* Content area with space for bottom nav - unified pb-28 */
  .content-area {
    @apply pb-28; /* 112px = 80px nav + 32px breathing room */
  }
  
  /* Glassmorphism card */
  .glass-card {
    @apply bg-white/[0.08] backdrop-blur-xl rounded-xl border border-white/[0.15];
    -webkit-backdrop-filter: blur(12px); /* Safari support */
  }
  
  /* Neon text gradient */
  .text-gradient-neon {
    @apply bg-gradient-to-r from-neon-lime via-neon-cyan to-neon-purple bg-clip-text text-transparent;
  }
  
  /* Quadrant neon borders */
  .neon-border-q1 {
    @apply border-neon-lime/50 shadow-[0_0_20px_rgba(57,255,20,0.3)];
  }
  
  .neon-border-q2 {
    @apply border-neon-purple/50 shadow-[0_0_20px_rgba(168,85,247,0.3)];
  }
  
  .neon-border-q3 {
    @apply border-neon-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.3)];
  }
}

@layer utilities {
  /* Hide scrollbar */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

---

## 7. Acceptance Criteria (Definition of Done)

### 7.1 Functional Requirements

- [ ] AppShell wymusza `max-w-[480px]` na wszystkich widokach
- [ ] BottomNav wyświetla 5 items z ikonami Lucide
- [ ] Routing działa - zmiana route aktualizuje widok
- [ ] Macierz pokazuje grid 2×2 z 4 ćwiartkami
- [ ] Każda ćwiartka ma odpowiedni kolor neonowy
- [ ] Dashboard pokazuje empty state dla Q1
- [ ] Wszystkie placeholder screens są dostępne

### 7.2 Visual Requirements

- [ ] 480px constraint działa na desktopie (wycentrowane)
- [ ] Mobile layout działa (375px, 414px)
- [ ] Glassmorphism efekty widoczne (BottomNav)
- [ ] Neon borders działają (Q1, Q2, Q3)
- [ ] Typography zgodna z design-system.md
- [ ] Brak poziomych scrollbarów
- [ ] Touch targets ≥ 48px

### 7.3 UX Requirements

- [ ] BottomNav jest zawsze widoczny (sticky)
- [ ] Active route ma visual indicator
- [ ] Hover/tap feedback działa
- [ ] Transition animations działają (150-300ms)
- [ ] Content nie jest zasłaniany przez BottomNav

### 7.4 Code Quality

- [ ] TypeScript - brak `any`
- [ ] Komponenty są reusable
- [ ] Ścieżki importów używają `@/` aliasów
- [ ] Brak console.log / debug code
- [ ] ESLint / Prettier przechodzi

### 7.5 Testing

- [ ] UX Review (`/WF UX`) - Pass ✅
- [ ] Manual test na 3 rozmiarach: 375px, 480px, 768px
- [ ] Routing test - wszystkie 5 routes działają
- [ ] Touch target test - wszystkie klikalne
- [ ] Regression - nie psuje innych planów (brak)

---

## 8. Implementation Timeline

### Dzień 1: AppShell + Config

| Zadanie | Szacunek | Output |
|---------|----------|--------|
| Tailwind config extensions | 1h | Colors, fonts, animations |
| Global CSS (index.css) | 1h | Utilities, components |
| AppShell component | 1h | 480px constraint |
| Basic routing setup | 1h | React Router, 5 routes |
| **Total** | **4h** | Working skeleton |

### Dzień 2: Bottom Navigation + Placeholders

| Zadanie | Szacunek | Output |
|---------|----------|--------|
| BottomNav component | 2h | 5 items, glassmorphism |
| Placeholder screens | 1h | Today, Notes, Timer |
| Dashboard (basic) | 2h | Q1 empty state, stats |
| Navigation integration | 1h | Routing + active states |
| **Total** | **6h** | Full navigation flow |

### Dzień 3: Matrix View + UX Review

| Zadanie | Szacunek | Output |
|---------|----------|--------|
| QuadrantCard component | 2h | 4 variants, neon borders |
| MatrixScreen | 2h | Grid 2×2, CTA buttons |
| Visual polish | 1h | Spacing, animations |
| `/WF UX` review | 1h | Report + fixes |
| Git commit + push | 0.5h | Clean history |
| **Total** | **6.5h** | Faza 1 Complete |

### Łączny czas: **16.5h** (~2 dni robocze)

---

## 9. Risks & Mitigations

| Risk | Prawdopodobieństwo | Wpływ | Mitigacja |
|------|-------------------|-------|-----------|
| **480px constraint nie działa** | Low | High | Testować od razu na DevTools Mobile |
| **BottomNav zasłania content** | Low | Medium | `pb-28` padding na content-area |
| **Neon colors za jasne** | Low | Low | Sprawdzić kontrast w `/WF UX` |
| **Routing nie działa na mobile** | Low | High | Testować na realnym telefonie |
| **Glassmorphism nie wspierany** | Low | Low | Fallback do solid colors |

---

## 10. Next Steps After TECH_001

Po zakończeniu TECH_001 (The Shell), następny plan do implementacji:

**→ PLAN_002: Brain-Dump Quiz Logic (Faza 2: The Brain)**

Będziemy mogli:
1. Podłączyć "Dodaj zadanie" buttony do Quiz flow
2. Zaimplementować 2-pytaniowy klasyfikator
3. Pokazywać rzeczywiste zadania w Macierzy (zamiast empty state)

---

## 11. References

| Dokument | Zastosowanie w tym planie |
|----------|---------------------------|
| PDF str. 15 | Dashboard layout, Q1 empty state |
| PDF str. 16 | Matrix 2×2 grid, quadrant colors |
| PDF str. 5, 6, 7 | Bottom navigation pattern |
| docs/design-system.md | 480px constraint, colors, typography |
| docs/business/glossary.md | Terminology (Q1-Q4, AppShell) |
| docs/business/roadmap.md | Faza 1 context |

---

**Status:** ✅ Ready for Implementation  
**Next Action:** Rozpocząć Day 1 (AppShell + Tailwind Config)

