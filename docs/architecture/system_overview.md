# System Overview - FocusFlow 2.0

> Single Source of Truth dla architektury systemu

## Model Danych

### Główna encja: Task

```typescript
interface Task {
  id: string;              // UUID v4
  title: string;           // Max 100 chars
  description?: string;    // Opcjonalne
  quadrant: 1 | 2 | 3 | 4; // Q1-Q4
  subcategory?: Subcategory; // Tylko Q2, Q3, Q4
  completed: boolean;      // Default: false
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;          // Opcjonalne
  priority: 1 | 2 | 3;     // 1=high, 2=medium, 3=low
}

type Subcategory =
  // Q2 only
  | 'health' | 'growth' | 'relationships' | 'finance' | 'career'
  // Q3 only
  | 'admin' | 'breaks'
  // Q4 only
  | 'entertainment' | 'distractions';
```

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
- `quadrant`: required, enum 1-4
- `subcategory`: opcjonalne, ale jeśli podane - musi pasować do quadrant

### Walidacja subcategory:

```typescript
const SUBCATEGORIES_BY_QUADRANT = {
  1: [], // Q1 has no subcategories
  2: ['health', 'growth', 'relationships', 'finance', 'career'],
  3: ['admin', 'breaks'],
  4: ['entertainment', 'distractions']
} as const;
```

