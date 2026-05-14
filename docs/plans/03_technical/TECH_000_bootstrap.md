# TECH_000: Bootstrap & Repository Setup & AppShell Base

> Plan implementacji szkieletu aplikacji

## Cel

Przygotowanie szkieletu `/app`, konfiguracja Tailwind CSS z niestandardową paletą kolorów (Neon Glassmorphism) oraz bazowego AppShell (480px).

---

## Zakres

### 1. Inicjalizacja Vite + React + TS

```bash
cd /app
npm create vite@latest . -- --template react-ts
npm install
```

### 2. Instalacja zależności

```bash
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react clsx tailwind-merge dexie
npx tailwindcss init -p
```

### 3. Konfiguracja Tailwind

**tailwind.config.js**:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon Glassmorphism Palette
        neon: {
          cyan: '#00F0FF',
          magenta: '#FF00F0',
          lime: '#39FF14',
          yellow: '#FFF100',
        },
        glass: {
          dark: 'rgba(15, 23, 42, 0.8)',
          light: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
        // Quadrant colors
        q1: '#FF4757', // Red - urgent/important
        q2: '#2ED573', // Green - important
        q3: '#FFA502', // Orange - urgent
        q4: '#747D8C', // Gray - neither
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
```

### 4. Base CSS

**src/index.css**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-900 text-white antialiased;
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer components {
  .glass-panel {
    @apply bg-glass-light backdrop-blur-md border border-glass-border rounded-xl;
  }
}
```

### 5. Constants: colors.ts

**src/constants/colors.ts**:

```typescript
export const COLORS = {
  // Quadrant colors for UI elements
  quadrants: {
    q1: 'bg-q1',
    q2: 'bg-q2',
    q3: 'bg-q3',
    q4: 'bg-q4',
  },
  // Neon accents
  neon: {
    cyan: 'text-neon-cyan',
    magenta: 'text-neon-magenta',
    lime: 'text-neon-lime',
    yellow: 'text-neon-yellow',
  },
  // Glass morphism
  glass: {
    panel: 'glass-panel',
    dark: 'bg-glass-dark',
  },
  // Semantic
  primary: {
    button: 'bg-neon-cyan text-slate-900 hover:bg-neon-cyan/80',
    text: 'text-neon-cyan',
  },
  secondary: {
    button: 'bg-glass-light text-white hover:bg-glass-light/80',
  },
} as const;
```

### 6. AppShell Component

**src/components/AppShell.tsx**:

```tsx
import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-[480px] mx-auto min-h-screen px-4 py-6">
        {children}
      </div>
    </div>
  );
}
```

### 7. Root App.tsx

**src/App.tsx**:

```tsx
import { AppShell } from './components/AppShell';

function App() {
  return (
    <AppShell>
      <div className="glass-panel p-6 text-center">
        <h1 className="text-2xl font-bold text-neon-cyan">
          FocusFlow 2.0
        </h1>
        <p className="mt-2 text-slate-400">
          Matrix Planner - Ready for development
        </p>
      </div>
    </AppShell>
  );
}

export default App;
```

---

## Checklist Weryfikacji

- [ ] Vite projekt działa (`npm run dev`)
- [ ] Tailwind klasy działają
- [ ] AppShell ma max-w-[480px] i jest wycentrowany
- [ ] Kolory neonowe są dostępne
- [ ] `src/constants/colors.ts` istnieje i eksportuje COLORS
- [ ] Brak twardych kolorów w komponentach

---

## Estymacja

**Czas**: 30-45 minut

---

## Dependencies

Brak - to pierwszy plan.

---

## Output

Szkielet aplikacji gotowy do implementacji PLAN_001 (Core Data Layer).

