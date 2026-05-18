# System Overview - FocusFlow 2.0

> High-Level Architecture Specification  
> Status: STABLE  
> Last Updated: 2026-05-18

---

## 1. Executive Summary

FocusFlow 2.0 to **local-first, offline-first Progressive Web Application (PWA)** zaprojektowana w paradygmacie **Mobile-First** dla osób z ADHD. System eliminuje paraliż decyzyjny poprzez automatyczną klasyfikację zadań opartą na algorytmie Macierzy Eisenhowera (Q0-Q4).

### Stack Technologiczny

| Warstwa | Technologia | Rationale |
|---------|-------------|-----------|
| **Frontend** | React 18 + Vite | Szybkie HMR, tree-shaking, modern ESM |
| **State Management** | React Context + Hooks | Lokalny stan, brak boilerplate Redux |
| **Persistence** | Dexie.js (IndexedDB wrapper) | Transakcyjność, reaktywne zapytania, offline-first |
| **Styling** | Tailwind CSS + CSS Modules | Utility-first, purge unused, dark mode support |
| **Type Safety** | TypeScript 5.x | Strict mode, discriminated unions dla quiz state |

---

## 2. Architectural Principles

### 2.1 Local-First Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FOCUSFLOW 2.0 PWA                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   UI Layer  │  │  Logic Layer│  │   Data Layer       │ │
│  │  (React 18) │  │  (Hooks)    │  │  (Dexie.js + IDB)  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                    │            │
│         └────────────────┴────────────────────┘            │
│                      NO EXTERNAL API                        │
└─────────────────────────────────────────────────────────────┘
```

**Kluczowa decyzja:** Brak backendu, serwera, ani chmury. Wszystkie dane przechowywane lokalnie w IndexedDB przeglądarki.

### 2.2 ADHD-Optimized UX Patterns

| Pattern | Implementacja | Cel |
|---------|---------------|-----|
| **Brain Dump** | Seryjne dodawanie bez kategoryzacji | Redukcja friction przy wprowadzaniu |
| **Quiz AI** | 2 pytania binarne → predykcja Q1-Q4 | Automatyczna klasyfikacja |
| **Timer Singleton** | Globalny TimerContext | Kontekstowa ciągłość skupienia |
| **Sub-Matrices** | 2×2 grid per quadrant | Visual hierarchy bez overwhelm |

---

## 3. Data Flow Architecture (C4 Component Level)

### 3.1 Task Creation Flow (Quiz → Dexie → UI)

```
User Input (QuizModal.tsx)
       │
       ▼
┌──────────────────────────────────────┐
│  Step 1: Title Input                 │
│  - Controlled input                  │
│  - Validation: non-empty             │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Step 2: Quiz State Machine          │
│  - importanceAnswers[3]              │
│  - urgencyAnswers[3]                 │
│  - Algorithm: classifyFromScores()   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Step 3: Confirm / Override          │
│  - predictedQuadrant display         │
│  - Manual override buttons           │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Step 4: Subcategory (Q2/Q3/Q4)      │
│  - Quadrant-specific options         │
│  - Destructive Hatch (Q4 only)       │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  useQuizForm.submitTaskWithSubcategory│
│  - Direct argument passing           │
│  - Atomic Dexie transaction          │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Dexie.js / IndexedDB                │
│  - Table: tasks                      │
│  - Transaction: readwrite            │
│  - Auto-generated ID                 │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  useLiveQuery Subscription             │
│  - Re-render on data change          │
│  - Optimized via useMemo             │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  MatrixScreen.tsx                    │
│  - Quadrant filtering                │
│  - Grouped by subcategory            │
│  - Task cards with actions           │
└──────────────────────────────────────┘
```

### 3.2 Timer Synchronization Flow (Unix Delta)

```
User Action (Start Timer)
       │
       ▼
┌──────────────────────────────────────┐
│  TimerContext.startTimer(minutes)      │
│  - expectedEndTime = Date.now() + ms   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  setInterval(updateTimer, 1000)      │
│  - Throttled in background           │
│  - Date.now() ALWAYS accurate        │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  updateTimer()                       │
│  const now = Date.now()              │
│  const remaining = expectedEnd - now │
│  - Immune to background throttling   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  UI Update (TimerDisplay.tsx)          │
│  - progress = remaining / total      │
│  - SVG circular progress             │
│  - Neon glow animation               │
└──────────────────────────────────────┘
```

---

## 4. Database Schema (Dexie.js)

```typescript
// Database: focusflow_v2
interface Task {
  id?: number;              // Auto-generated primary key
  title: string;            // Task description
  quadrant: 0 | 1 | 2 | 3 | 4;  // Eisenhower quadrant
  subcategory?: string;     // Q2: rutyny/projekt/cele/inne
                            // Q3: delegacja/automatyzacja/oszczednosciowe/grupowe
                            // Q4: rozrywka/hobby/side_questy/optymalizacja
  executionContext?: 'zrob_teraz' | 'zaplanuj_blok' | 'w_przerwie';  // Q3 only
  completed: boolean;       // Task status
  createdAt: Date;          // Timestamp
  updatedAt?: Date;         // Optional update timestamp
}
```

---

## 5. Component Architecture

### 5.1 Screen Hierarchy

```
App (BrowserRouter)
  ├── DashboardScreen ("/")
  │     └── QuadrantSummaryCards (Q0 counter badge)
  │
  ├── MatrixScreen ("/matrix")
  │     ├── Grid View (Q1-Q4 overview)
  │     │     └── QuadrantCard × 4
  │     ├── Q2 Sub-Matrix (rutyny/projekt/cele/inne)
  │     ├── Q3 Hub Logistyki (3 execution contexts)
  │     └── Q4 Archiwum (4 subcategories)
  │
  ├── BrainDumpScreen ("/inbox")
  │     ├── Q0 Task List
  │     └── "Kwalifikuj" → QuizModal
  │
  ├── TimerScreen ("/timer")
  │     ├── TimerContext Provider
  │     ├── PresetSelector (7 presets)
  │     └── TaskAssignmentDropdown
  │
  └── QuizModal (global, route-agnostic)
        ├── useQuizForm hook
        ├── Step: title
        ├── Step: quiz (importance/urgency)
        ├── Step: confirm + manual override
        └── Step: subcategory (Q2/Q3/Q4)
```

### 5.2 Key Custom Hooks

| Hook | Responsibility | File |
|------|----------------|------|
| `useQuizForm` | Quiz state machine, classification algorithm, task submission | `hooks/useQuizForm.ts` |
| `useTimer` | Timer state, Unix Delta calculation, background throttling resistance | `context/TimerContext.tsx` |
| `useTaskOperations` | CRUD operations on Dexie tasks | `hooks/useTaskOperations.ts` |

---

## 6. Security & Privacy

| Aspect | Implementation |
|--------|----------------|
| **Data Storage** | Local IndexedDB only - no cloud sync |
| **Data Ownership** | User retains 100% control over their data |
| **No Authentication** | Zero login, zero passwords, zero friction |
| **Export/Backup** | Future: JSON export/import for user-driven backups |

---

## 7. Performance Targets

| Metric | Target | Implementation |
|--------|--------|----------------|
| **Time to Interactive** | < 2s | Vite optimized build, code splitting |
| **IDB Write Latency** | < 50ms | Dexie.js transactions, bulk operations |
| **UI Re-render** | 60fps | React.memo, useMemo for derived state |
| **Timer Drift** | < 1s | Unix Delta Timestamp (ADR-002) |

---

## 8. Constraints & Limitations

1. **Single Device** - Data does not sync between devices (by design)
2. **No Multi-user** - Single-user application architecture
3. **Browser-dependent** - IndexedDB quotas vary by browser (typically 50MB-2GB)
4. **Mobile-only** - Interface optimized for 480px width, not desktop

---

**Document ID:** ARCH-SYS-001  
**Status:** APPROVED  
**Next Review:** On major feature addition

---

## Model Danych - Technical implementation details

### Główna encja: Task

```typescript
interface Task {
  id: string;              // UUID v4
  title: string;           // Max 100 chars
  description?: string;    // Opcjonalne
  quadrant: 0 | 1 | 2 | 3 | 4; // 0=Inbox, 1-4=Q1-Q4
  subcategory?: Subcategory; // Tylko Q2, Q3, Q4
  completed: boolean;      // Default: false
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;          // Opcjonalne
  priority: 1 | 2 | 3;     // 1=high, 2=medium, 3=low
}

type Subcategory =
  // Q2 (Strona 10, 22): Strefa wzrostu
  | 'routine' | 'project' | 'other'
  // Q3 (Strona 8, 23): Strategie "Prozy Życia"
  | 'do_now' | 'planned_block' | 'on_break'
  // Q4 (Strona 9, 24): Kategorie "Nie teraz"
  | 'entertainment' | 'side_quest' | 'hobby' | 'optimization';
```

### Quadrant 0 — Inbox State (Unassigned Note)

> **Kontrakt techniczny dla stanu "poczekalni"**

| Właściwość | Wartość |
|------------|---------|
| **Wartość** | `0` |
| **Semantyka** | Unassigned Inbox Note (Poczekalnia / Skrzynka odbiorcza) |
| **Widoczność** | Wykluczone z widoku Macierzy (Q1-Q4) i statystyk Dashboard |
| **Destynacja** | `BrainDumpScreen` — widok 'notes' |
| **Przejście** | Re-klasyfikacja przez `onClassify(id, quadrant)` do wartości 1-4 |

**Zasady izolacji:**
- MatrixScreen MUSI filtrować: `tasks.filter(t => !t.completed && t.quadrant !== 0)`
- Dashboard stats (Q1/Q2/Q3) NIE liczą zadań z `quadrant === 0`
- Q0 zadania są widoczne wyłącznie w `BrainDumpScreen` (podzakładka "Twoje Notatki")

### Encja: Note

```typescript
interface Note {
  id: string;          // UUID v4
  content: string;     // Rich text / markdown
  taskId?: string;     // FK do Task (opcjonalne)
  createdAt: Date;
  updatedAt: Date;
}
```

### Encja: QuizResult

```typescript
interface QuizResult {
  id: string;
  answers: Answer[];   // Historia odpowiedzi
  dominantQuadrant: 1 | 2 | 3 | 4;
  createdAt: Date;
}

interface Answer {
  questionId: string;
  choiceId: string;
  timestamp: Date;
}
```

---

## Relacje

```
Task 1--* Note (opcjonalna, linked notes)
Task *--1 Quadrant (enum constraint)
Quadrant 1--* Subcategory (Q2/Q3/Q4 only)
```

---

## IndexedDB Schema (Dexie.js)

```typescript
// db/schema.ts
const db = new Dexie('FocusFlowDB');

db.version(1).stores({
  tasks: '++id, quadrant, subcategory, completed, createdAt',
  notes: '++id, taskId, createdAt',
  quizResults: '++id, dominantQuadrant, createdAt'
});
```

### Indeksy:

| Tabela | Indeks | Cel |
|--------|--------|-----|
| tasks | `quadrant` | Filtrowanie macierzy |
| tasks | `subcategory` | Filtrowanie kategorii |
| tasks | `completed` | Filtrowanie statusu |
| notes | `taskId` | Join z taskami |

---

## Warstwy Architektury

```
┌─────────────────────────────────────┐
│  UI Layer (React Components)         │
├─────────────────────────────────────┤
│  Feature Layer (Matrix, Quiz, etc.)  │
├─────────────────────────────────────┤
│  Data Layer (Dexie.js + Hooks)      │
├─────────────────────────────────────┤
│  Storage (IndexedDB)                │
└─────────────────────────────────────┘
```

---

## Constraints & Walidacja

### Task:

- `title`: required, min 1, max 100 chars
- `quadrant`: required, enum 0-4 (0=Inbox, 1-4=Q1-Q4)
- `subcategory`: opcjonalne, ale jeśli podane - musi pasować do quadrant
- Q1 Capacity Limit: Ćwiartka I (Pilne i Ważne) posiada twardy limit 5 aktywnych zadań. Próba dodania szóstego zadania musi wyzwolić walidację "Przeciążenie Systemu"
  
---

### Walidacja subcategory:

```typescript
const SUBCATEGORIES_BY_QUADRANT = {
  1: [], // Q1 has no subcategories
  2: ['health', 'growth', 'relationships', 'finance', 'career'],
  3: ['admin', 'breaks'],
  4: ['entertainment', 'distractions']
} as const;
```

