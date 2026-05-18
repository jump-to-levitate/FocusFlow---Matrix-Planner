# Konwencje Projektowe i Struktura UI

> Project Conventions & UI Structure Specification  
> Document ID: DEV-CONVENTIONS-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Senior Frontend Architect

---

## 1. Ograniczenie AppShell (430px Pro Max Standard)

### 1.1 Podstawowe Wymiary

**WSZYSTKIE ekrany aplikacji muszą pasować do sztywnego limitu 430px:**

```tsx
// App.tsx - Root layout z 430px constraint
export function App() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0f] text-white">
      <Router>
        <Routes>
          <Route path="/" element={<MatrixScreen />} />
          <Route path="/timer/:taskId" element={<TimerScreen />} />
          <Route path="/q2/:subcategory" element={<Q2SubMatrix />} />
          <Route path="/q3/:subcategory" element={<Q3SubMatrix />} />
          <Route path="/q4/:subcategory" element={<Q4SubMatrix />} />
        </Routes>
      </Router>
    </div>
  );
}
```

### 1.2 Breakpoint dla Ramki Desktopowej

**Breakpoint `min-[480px]:` służy WYŁĄCZNIE** do renderowania estetycznej ramki urządzenia na większych ekranach:

```tsx
// Efekt "phone frame" na desktopie
<div className="max-w-[430px] mx-auto min-h-screen 
                min-[480px]:border-x-4 min-[480px]:border-gray-800 
                min-[480px]:shadow-2xl min-[480px]:my-8">
  {/* App content */}
</div>
```

### 1.3 Zakazane Wzorce

**❌ ZABRONIONE:**

```tsx
// Źle - viewport units wewnątrz AppShell
<div className="w-screen min-h-screen">           {/* Zaburza layout */}
<div className="h-[100vh]">                      {/* Mobile browser bars! */}
<div className="max-w-[480px]">                  {/* STARY standard - źle */}
<div className="w-full">                         {/* Overflow risk */}
```

**✅ WYMAGANE:**

```tsx
// Dobrze - sztywny 430px, bez viewport units
<div className="max-w-[430px] mx-auto min-h-screen">
<div className="h-14">                           {/* 56px fixed height */}
<div className="px-3">                           {/* 12px padding */}
<div className="gap-3">                          {/* 12px gap */}
```

### 1.4 Mobile Browser Considerations

**Problem:** `100vh` na mobile obejmuje address bar i bottom navigation, co powoduje cut-off contentu.

**Rozwiązanie:**

```tsx
// Użyj min-h-screen zamiast h-screen
// min-h-screen = min-height: 100vh (ale pozwala na overflow)
// h-screen = height: 100vh (twarde - ucina content!)

<div className="max-w-[430px] mx-auto min-h-screen">
  {/* Content może być dłuższy niż viewport - scroll działa */}
</div>
```

---

## 2. Standardy Tailwind CSS i Design Tokens

### 2.1 Zakaz Hardkodowania Kolorów

**❌ ZABRONIONE - kolory HEX w JSX:**

```tsx
// Źle - kolor zahardkodowany, brak SSOT
<button className="bg-[#39FF14] hover:bg-[#32dd12]">
<div className="border-[#D000FF] shadow-[#D000FF]">
```

**✅ WYMAGANE - kolory z `src/constants/colors.ts`:**

```tsx
// Dobrze - SSOT dla kolorów
import { COLORS } from '@/constants/colors';

<button 
  className="bg-neon-lime hover:bg-neon-lime-dark"
  style={{ backgroundColor: COLORS.neon.lime }}
>
<div 
  className="border-neon-fuchsia"
  style={{ borderColor: COLORS.neon.fuchsia }}
>
```

### 2.2 Definicja Tokenów Kolorów

```typescript
// src/constants/colors.ts - SSOT dla kolorów
export const COLORS = {
  neon: {
    lime: '#39FF14',        // Q1, timer running
    fuchsia: '#D000FF',     // Q2, paused state
    orange: '#FF8C00',      // Q3, logistics
    cyan: '#00E5FF',        // Q4, accents
    silver: '#94A3B8',      // Q4 matte theme
  },
  bg: {
    dark: '#0a0a0f',        // Main background
    card: 'rgba(255,255,255,0.05)', // Card backgrounds
    elevated: 'rgba(255,255,255,0.08)', // Elevated cards
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    muted: 'rgba(255,255,255,0.5)',
  }
} as const;
```

### 2.3 Nagłówki Sub-Matryc: H-14 Uniformity

**WSZYSTKIE nagłówki sekcji sub-matryc muszą mieć identyczną wysokość 56px (h-14):**

```tsx
// Standard dla wszystkich nagłówków Q2/Q3/Q4
<div className="h-14 flex items-center justify-between px-3 
                border-b border-neon-fuchsia 
                bg-[rgba(208,0,255,0.15)]">
  <div className="flex items-center gap-2">
    <span className="text-xl">🔄</span>
    <h3 className="text-xs font-bold uppercase whitespace-nowrap leading-none">
      Rutyny
    </h3>
  </div>
  <span className="px-2.5 py-1 rounded-full text-xs font-bold 
                   bg-neon-fuchsia/20">
    {count}
  </span>
</div>
```

**Reguła H-14:**

| Element | Klasa | Wartość | Uzasadnienie |
|---------|-------|---------|--------------|
| Wysokość | `h-14` | 56px | Uniform alignment |
| Centrowanie pionowe | `items-center` | - | Ikona + tekst aligned |
| Centrowanie poziome | `justify-between` | - | Tytuł vs licznik |
| Overflow tekstu | `whitespace-nowrap` | - | Zapobiega łamaniu |
| Leading | `leading-none` | 0 | Precyzyjne centrowanie |

### 2.4 Ochrona Przed Łamaniem Tekstu

**Wszystkie etykiety muszą używać `whitespace-nowrap`:**

```tsx
// Dobrze - tekst nigdy się nie złamie
<h3 className="text-xs font-bold uppercase whitespace-nowrap">
  Rutyny
</h3>

// Dobrze - przyciski z długim tekstem
<button className="whitespace-nowrap px-4 py-2">
  Zapisz zadanie
</button>
```

---

## 3. Konwencja Nazewnictwa Plików i Symboli

### 3.1 Komponenty React

**Format:** PascalCase + `.tsx`

```
✅ TaskCard.tsx
✅ QuizModal.tsx
✅ TimerScreen.tsx
✅ MatrixScreen.tsx

❌ task-card.tsx
❌ quizmodal.tsx
❌ timer_screen.tsx
```

### 3.2 Hooki Customowe

**Format:** camelCase + `use` prefix + `.ts`

```
✅ useQuizForm.ts
✅ useTimer.ts
✅ useLiveQuery.ts
✅ useKeyboardShortcuts.ts

❌ UseQuizForm.ts          (bez PascalCase)
❌ use-quiz-form.ts        (bez kebab-case)
❌ quizForm.ts             (bez use prefix)
```

### 3.3 Stałe i Enums

**Format:** UPPER_SNAKE_CASE

```typescript
// ✅ Dobrze - stałe globalne
export const MAX_Q1_TASKS = 5;
export const DEFAULT_TIMER_DURATION = 25 * 60; // 25 minutes in seconds
export const DEBOUNCE_DELAY_MS = 300;

// ✅ Dobrze - enumy
export enum TimerState {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  BREAK = 'break',
}

// ✅ Dobrze - const assertions
export const SUBCATEGORIES = {
  Q2: ['rutyny', 'projekt', 'ogolny_cel', 'inne'],
  Q3: ['zrob_teraz', 'zaplanuj', 'w_przerwie', 'inne'],
  Q4: ['rozrywka', 'hobby', 'optymalizacja', 'side_questy'],
} as const;
```

### 3.4 Funkcje Pomocnicze

**Format:** camelCase + opisowe nazwy

```typescript
// ✅ Dobrze - opisowe nazwy funkcji
function calculateQuadrant(importance: boolean, urgency: boolean): QuadrantNumber
function normalizeSubcategory(value: string): Subcategory
function formatDuration(seconds: number): string
function groupTasksBySubcategory(tasks: Task[]): GroupedTasks

// ❌ Źle - niejasne nazwy
function calc(i: boolean, u: boolean): number
function norm(v: string): string
function fmt(s: number): string
function group(t: Task[]): any
```

### 3.5 Typy i Interfejsy

**Format:** PascalCase + deskryptywne

```typescript
// ✅ Dobrze - deskryptywne nazwy typów
interface TaskWithSubcategory extends Task {
  normalizedSubcategory: Subcategory;
}

type QuizMachineState = 
  | { step: 'title' }
  | { step: 'quiz'; title: string }
  | { step: 'subcategory'; title: string; predictedQuadrant: QuadrantNumber }
  | { step: 'confirm'; title: string; predictedQuadrant: QuadrantNumber; subcategory: Subcategory };

type TimerContextState = {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
};

// ❌ Źle - niejasne nazwy
interface TaskData { }
type State = any;
type Props = object;
```

---

## 4. Struktura Katalogów

```
src/
├── components/           # Reużywalne komponenty UI
│   ├── ui/              # Atomowe komponenty (Button, Input, Card)
│   ├── matrix/          # Komponenty macierzy (QuadrantCard, SubMatrix)
│   ├── timer/           # Komponenty timera (TimerDisplay, TimerControls)
│   └── quiz/            # Komponenty quizu (QuizStep, SubcategoryGrid)
├── hooks/               # Custom React hooks
│   ├── useQuizForm.ts
│   ├── useTimer.ts
│   └── useLiveQuery.ts
├── contexts/            # React Context providers
│   └── TimerContext.tsx
├── constants/           # Stałe i SSOT
│   ├── colors.ts
│   ├── subcategories.ts
│   └── settings.ts
├── types/               # Globalne typy TypeScript
│   ├── database.ts
│   ├── quiz.ts
│   └── timer.ts
├── utils/               # Funkcje pomocnicze
│   ├── quadrant.ts
│   ├── formatters.ts
│   └── validators.ts
├── db/                  # Dexie.js database
│   └── index.ts
└── screens/             # Ekrany aplikacji
    ├── MatrixScreen.tsx
    ├── TimerScreen.tsx
    └── SubMatrixScreen.tsx
```

---

**Document ID:** DEV-CONVENTIONS-001  
**Owner:** Senior Frontend Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-18  
**Viewport:** 430px Pro Max Standard
