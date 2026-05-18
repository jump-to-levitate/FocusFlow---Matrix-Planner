# Modele Systemu i Wzorce Architektoniczne

> System Models & Architecture Patterns Specification  
> Document ID: ARCH-MODELS-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Principal Software Architect

---

## 1. Struktura Danych IndexedDB (Dexie.js Schema)

### 1.1 Pełny Interfejs TypeScript

```typescript
// ============================================================================
// DEXIE.JS SCHEMA - FocusFlow Database
// ============================================================================

import Dexie, { type EntityTable } from 'dexie';

// ----------------------------------------------------------------------------
// Enums & Types
// ----------------------------------------------------------------------------
export type QuadrantNumber = 0 | 1 | 2 | 3 | 4;

export type Q2Subcategory = 'rutyna' | 'projekt' | 'cel' | 'inne';
export type Q3Subcategory = 'teraz' | 'blok' | 'przerwa' | 'inne';
export type Q4Subcategory = 'rozrywka' | 'hobby' | 'optymalizacja' | 'side_questy';

export type QuizStep = 'title' | 'quiz' | 'confirm' | 'subcategory' | 'bypass';
export type TimerState = 'idle' | 'running' | 'paused';

// ----------------------------------------------------------------------------
// Core Entity: Task
// ----------------------------------------------------------------------------
export interface Task {
  id: number;                    // Auto-increment primary key
  title: string;                 // Task description
  quadrant: QuadrantNumber;      // 0=Q0, 1=Q1, 2=Q2, 3=Q3, 4=Q4
  subcategory?: Q2Subcategory | Q3Subcategory | Q4Subcategory; // Micro-context
  createdAt: number;             // Unix timestamp (ms)
  completedAt?: number;          // Unix timestamp (ms) - when marked done
  timerSessions?: number;        // Number of focus sessions completed
  totalFocusTime?: number;       // Total seconds in focus mode
}

// ----------------------------------------------------------------------------
// Core Entity: Note (task attachments)
// ----------------------------------------------------------------------------
export interface Note {
  id: number;
  content: string;
  taskId: number;                // Foreign key to tasks
  createdAt: number;
}

// ----------------------------------------------------------------------------
// Core Entity: Settings (user preferences)
// ----------------------------------------------------------------------------
export interface Setting {
  key: string;                   // e.g., 'defaultTimerDuration', 'theme'
  value: string | number | boolean | object;
  updatedAt: number;
}

// ----------------------------------------------------------------------------
// Database Initialization
// ----------------------------------------------------------------------------
export const db = new Dexie('focusflow') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
  notes: EntityTable<Note, 'id'>;
  settings: EntityTable<Setting, 'key'>;
};

// Schema versioning (migrations)
db.version(1).stores({
  tasks: '++id, title, quadrant, subcategory, createdAt, completedAt',
  notes: '++id, taskId, createdAt',
  settings: 'key, updatedAt'
});

// Indexes for fast queries:
// - tasks.by('quadrant') - filter by quadrant
// - tasks.by('subcategory') - filter by micro-context
// - tasks.by('createdAt') - chronological sort
// - notes.by('taskId') - get notes for specific task
```

### 1.2 Mapowanie Quadrant → Subkategoria

| Quadrant | Subcategories | Użycie |
|----------|---------------|--------|
| **Q0** | N/A (bez subkategorii) | Brain dump bez kontekstu |
| **Q1** | N/A (bez subkategorii) | Crunch mode - natychmiastowa akcja |
| **Q2** | `rutyna`, `projekt`, `cel`, `inne` | Centrum Planowania |
| **Q3** | `teraz`, `blok`, `przerwa`, `inne` | Hub Logistyki |
| **Q4** | `rozrywka`, `hobby`, `optymalizacja`, `side_questy` | Archiwum |

---

## 2. Globalny Stan Czasu (TimerContext Singleton)

### 2.1 Interfejs Stanu Timera

```typescript
// ============================================================================
// TIMER CONTEXT - Singleton Global State
// ============================================================================

export interface TimerContextState {
  // Core State
  currentTask: Task | null;
  timeRemaining: number;         // Seconds remaining
  isRunning: boolean;
  isPaused: boolean;
  
  // Unix Delta Timestamp (throttling-proof)
  startTime: number | null;       // Unix timestamp (ms) when started
  pausedAt: number | null;        // Unix timestamp (ms) when paused
  totalPausedTime: number;        // Accumulated paused time (ms)
  
  // Configuration
  originalDuration: number;       // Original session duration (seconds)
}

export interface TimerContextActions {
  start: (task: Task, duration: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: () => void;              // Called by setInterval every 1000ms
}

export type TimerContextType = TimerContextState & TimerContextActions;
```

### 2.2 Algorytm Delta Timestamp (Odporność na Background Throttling)

**Problem:** Safari i Chrome throttle setInterval do 1000ms+ gdy karta jest w tle. Timer "gubi" sekundy.

**Rozwiązanie:** Unix Delta Timestamp

```typescript
// ============================================================================
// DELTA TIMESTAMP ALGORITHM
// Odporność na background throttling w Safari/Chrome
// ============================================================================

function calculateRemainingTime(state: TimerContextState): number {
  if (!state.startTime) return state.timeRemaining;
  if (state.isPaused) return state.timeRemaining;
  
  // Oblicz czas rzeczywisty (niezależny od setInterval)
  const now = Date.now();
  const elapsedSinceStart = now - state.startTime;
  const effectiveElapsed = elapsedSinceStart - state.totalPausedTime;
  
  // Odejmij od oryginalnego czasu
  const remaining = Math.max(0, state.originalDuration * 1000 - effectiveElapsed);
  
  return Math.ceil(remaining / 1000); // Convert to seconds
}

// Użycie w komponencie (odporność na throttling):
useEffect(() => {
  const interval = setInterval(() => {
    // Nawet jeśli setInterval był throttled, delta timestamp
    // zwraca PRAWIDŁOWY pozostały czas
    const remaining = calculateRemainingTime(state);
    
    if (remaining <= 0) {
      dispatch({ type: 'COMPLETE' });
    } else {
      dispatch({ type: 'SET_TIME', payload: remaining });
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, [state.startTime, state.isPaused]);
```

**Zalety Delta Timestamp:**
- **Throttling-proof** - działa poprawnie nawet przy 30s intervalach
- **Battery-friendly** - nie wymaga Wake Lock API
- **Deterministyczny** - zawsze poprawny czas niezależnie od UI thread

---

## 3. Reaktywne Subskrypcje Bazodanowe (useLiveQuery)

### 3.1 Schemat Blokowy Potoku Odświeżania

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              REACTIVE DATABASE SUBSCRIPTIONS PIPELINE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐                                                          │
│   │   USER       │  INSERT / UPDATE / DELETE                               │
│   │   ACTION     │─────────────────┐                                       │
│   └──────────────┘                 │                                       │
│                                    ▼                                       │
│   ┌─────────────────────────────────────────────┐                         │
│   │      DEXIE.JS TRANSACTION                   │                         │
│   │  await db.tasks.add({...})                  │                         │
│   │  await db.tasks.update(id, {...})           │                         │
│   │  await db.tasks.delete(id)                  │                         │
│   └─────────────────────────────────────────────┘                         │
│                                    │                                       │
│                                    ▼                                       │
│   ┌─────────────────────────────────────────────┐                         │
│   │      OBSERVABLE EMITTER                     │                         │
│   │  Dexie tracks table changes                 │                         │
│   │  Emits change events to subscribers       │                         │
│   └─────────────────────────────────────────────┘                         │
│                                    │                                       │
│                                    ▼                                       │
│   ┌─────────────────────────────────────────────┐                         │
│   │      useLiveQuery HOOK                      │                         │
│   │  const tasks = useLiveQuery(...)            │                         │
│   │  Auto-re-executes query on change           │                         │
│   └─────────────────────────────────────────────┘                         │
│                                    │                                       │
│                                    ▼                                       │
│   ┌─────────────────────────────────────────────┐                         │
│   │      REACT RE-RENDER                        │                         │
│   │  Component updates with new data            │                         │
│   │  No manual refresh / useEffect needed       │                         │
│   └─────────────────────────────────────────────┘                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Implementacja useLiveQuery

```typescript
// ============================================================================
// useLiveQuery - Reactive Database Subscriptions
// ============================================================================

import { useLiveQuery } from 'dexie-react-hooks';

// Przykład: Lista zadań Q2 (Centrum Planowania)
function useQ2Tasks(subcategory: Q2Subcategory) {
  return useLiveQuery(
    () => db.tasks
      .where('quadrant')
      .equals(2)
      .and(task => task.subcategory === subcategory)
      .sortBy('createdAt'),
    [subcategory]  // Re-query when subcategory changes
  );
}

// Przykład: Licznik zadań w Q1
function useQ1Count() {
  return useLiveQuery(
    () => db.tasks
      .where('quadrant')
      .equals(1)
      .count(),
    []  // No dependencies - always subscribed
  ) ?? 0;
}

// Przykład: Task z notatkami (relation)
function useTaskWithNotes(taskId: number) {
  return useLiveQuery(
    async () => {
      const task = await db.tasks.get(taskId);
      const notes = await db.notes
        .where('taskId')
        .equals(taskId)
        .sortBy('createdAt');
      return { task, notes };
    },
    [taskId]
  );
}
```

---

## 4. Implementacja Zaawansowanych Wzorców Kodu

### 4.1 Direct Argument Passing (Eliminacja Race Conditions)

**Problem:** Asynchroniczny update stanu Reacta może spowodować race conditions przy szybkich interakcjach.

**Lokalizacja:** `useQuizForm.ts` - zapis subkategorii do bazy

```typescript
// ============================================================================
// PATTERN: Direct Argument Passing
// Eliminates async state race conditions
// ============================================================================

// ❌ ANTI-PATTERN: Async state update (race condition risk)
const handleSaveOld = async () => {
  setSubcategory(selectedSubcategory); // Async - may not complete before save
  await db.tasks.add({
    title,
    quadrant,
    subcategory: selectedSubcategory // May be stale!
  });
};

// ✅ PATTERN: Direct argument passing (deterministic)
const handleSaveNew = async (directSubcategory: Subcategory) => {
  await db.tasks.add({
    title,
    quadrant,
    subcategory: directSubcategory // Passed directly, always current
  });
};

// Użycie w komponencie:
<button onClick={() => handleSaveNew('rutyna')}>
  Zapisz jako Rutynę
</button>
```

**Rezultat:** Zero race conditions przy szybkim klikaniu.

---

### 4.2 Manual Override State (Trójstopniowy Model Priorytetu)

**Lokalizacja:** `QuizModal.tsx` - wybór ćwiartki

```typescript
// ============================================================================
// PATTERN: Three-Tier Priority Selection
// Priority: manual > bypass > computed
// ============================================================================

// Interfejs stanu quizu
interface QuizState {
  // Tier 1: Manual override (użytkownik zmienił na ekranie potwierdzenia)
  manualQuadrant: QuadrantNumber | null;
  
  // Tier 2: Bypass (dodawanie bezpośrednio z pod-widoku Q2/Q3/Q4)
  bypassQuadrant: QuadrantNumber | null;
  
  // Tier 3: Computed (z algorytmu na podstawie odpowiedzi)
  importanceAnswer: boolean | null;  // Tak/Nie
  urgencyAnswer: boolean | null;   // Tak/Nie
}

// Algorytm wyboru końcowego (1:1 z implementacją)
const predictedQuadrant: QuadrantNumber | null = 
  manualQuadrant ??      // Tier 1: User changed their mind
  bypass ??              // Tier 2: Adding from sub-view
  classifyFromScores(importanceAnswers, urgencyAnswers); // Tier 3: Algorithm

// Funkcja klasyfikacji
function classifyFromScores(
  important: boolean, 
  urgent: boolean
): QuadrantNumber {
  if (important && urgent) return 1;      // Q1: Crunch
  if (important && !urgent) return 2;     // Q2: Planning
  if (!important && urgent) return 3;     // Q3: Logistics
  return 4;                               // Q4: Archive
}
```

**Flow decyzyjny:**
```
Użytkownik dodaje zadanie
         ↓
    [Czy z pod-widoku?]
         ↓
    TAK → bypass = Q2/Q3/Q4 → Skip quiz → Direct save
         ↓
    NIE → Quiz (2 pytania) → computedQuadrant
         ↓
    [Czy użytkownik zmienił na ekranie potwierdzenia?]
         ↓
    TAK → manualQuadrant nadpisuje computed
         ↓
    [Czy subkategoria wymagana?]
         ↓
    TAK → Sub-matryca → Direct save z subcategory
         ↓
    NIE → Direct save quadrant only
```

---

### 4.3 Normalizacja Danych (Reaktywne Fallbacki)

**Lokalizacja:** `MatrixScreen.tsx` - mapowanie null/undefined subkategorii

**Problem:** Dane historyczne (przed wprowadzeniem subkategorii) mogą mieć `subcategory: undefined`.

**Rozwiązanie:** Normalizacja przy odczycie (defensive programming)

```typescript
// ============================================================================
// PATTERN: Data Normalization with Reactive Fallbacks
// ============================================================================

// Helper: Normalizacja subkategorii dla Q2
function normalizeQ2Subcategory(
  subcategory: string | undefined
): Q2Subcategory {
  const valid: Q2Subcategory[] = ['rutyna', 'projekt', 'cel', 'inne'];
  return valid.includes(subcategory as Q2Subcategory) 
    ? (subcategory as Q2Subcategory) 
    : 'inne';  // Fallback dla nieznanych wartości
}

// Helper: Normalizacja subkategorii dla Q3
function normalizeQ3Subcategory(
  subcategory: string | undefined
): Q3Subcategory {
  const valid: Q3Subcategory[] = ['teraz', 'blok', 'przerwa', 'inne'];
  return valid.includes(subcategory as Q3Subcategory)
    ? (subcategory as Q3Subcategory)
    : 'inne';
}

// Helper: Normalizacja subkategorii dla Q4
function normalizeQ4Subcategory(
  subcategory: string | undefined
): Q4Subcategory {
  const valid: Q4Subcategory[] = ['rozrywka', 'hobby', 'optymalizacja', 'side_questy'];
  return valid.includes(subcategory as Q4Subcategory)
    ? (subcategory as Q4Subcategory)
    : 'side_questy';  // Najbezpieczniejszy fallback dla Q4
}

// Użycie w komponencie MatrixScreen:
function useNormalizedTasks(quadrant: QuadrantNumber) {
  const tasks = useLiveQuery(
    () => db.tasks.where('quadrant').equals(quadrant).toArray(),
    [quadrant]
  );
  
  // Normalizacja przy odczycie
  return tasks?.map(task => ({
    ...task,
    subcategory: quadrant === 2 ? normalizeQ2Subcategory(task.subcategory)
      : quadrant === 3 ? normalizeQ3Subcategory(task.subcategory)
      : quadrant === 4 ? normalizeQ4Subcategory(task.subcategory)
      : undefined
  })) ?? [];
}
```

**Zalety:**
- Backward compatibility (stare dane działają)
- Type safety (zawsze poprawny typ)
- Reaktywność (useLiveQuery auto-refresh)

---

## 5. Viewport Constraint (430px Pro Max Standard)

### 5.1 Synchronizacja z design-system.md

| Dokument | Viewport | Uzasadnienie |
|----------|----------|--------------|
| `modele_systemu.md` (niniejszy) | **430px** | Pro Max Standard |
| `design-system.md` | **430px** | SSOT dla viewport |
| `makiety.md` (UX/UI) | **430px** | Design tokens |

**Historia zmiany:**
- Stara wartość: 480px (stary standard z design v1)
- Nowa wartość: 430px (Pro Max Standard, iPhone 14/15 Pro Max width)

### 5.2 Implementacja w Kodzie

```tsx
// Root layout constraint (App.tsx lub Layout.tsx)
export function App() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0f] text-white">
      {/* Cała aplikacja mieści się w 430px */}
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

---

**Document ID:** ARCH-MODELS-001  
**Owner:** Principal Software Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-18  
**Viewport:** 430px Pro Max Standard
