# Standardy Kodu (Coding Standards)

> Coding Standards Specification  
> Document ID: DEV-STANDARDS-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Senior Frontend Architect

---

## 1. TypeScript Strict Mode

### 1.1 Konfiguracja Obowiązkowa

W pliku `tsconfig.json` musi być włączona pełna restrykcja:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 1.2 Zakaz Typu `any`

**❌ ZABRONIONE:**
```typescript
// Źle - any pozbawia TypeScript sensu
function processData(data: any): any {
  return data.value;
}
```

**✅ WYMAGANE - użycie `unknown` z type guards:**
```typescript
// Dobrze - bezpieczne typowanie
function processData(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String((data as Record<string, unknown>).value);
  }
  throw new Error('Invalid data structure');
}
```

### 1.3 Explicit Return Types

Wszystkie funkcje publiczne i hooki muszą mieć jawne typy zwracane:

```typescript
// ✅ Dobrze - explicit return type
export function useQuizForm(initialQuadrant?: QuadrantNumber): QuizFormState {
  // ...
}

// ✅ Dobrze - explicit return type dla hooka
export function useTimer(): TimerContextType {
  // ...
}

// ❌ Źle - brak explicit return type (TypeScript musi inferować)
export function useTimer() {
  // ...
}
```

---

## 2. Rygorystyczne Typowanie Subkategorii

### 2.1 Unie Stringów dla Quadrantów

Aby zapobiec błędom literowym i zapewnić exhaustiveness checking:

```typescript
// ============================================================================
// SUBCATEGORY TYPES - SSOT dla nazw subkategorii
// ============================================================================

/** Q2: Centrum Planowania */
export type Q2Subcategory = 
  | 'rutyny' 
  | 'projekt' 
  | 'ogolny_cel' 
  | 'inne';

/** Q3: Hub Logistyki */
export type Q3Subcategory = 
  | 'zrob_teraz' 
  | 'zaplanuj' 
  | 'w_przerwie' 
  | 'inne';

/** Q4: Archiwum */
export type Q4Subcategory = 
  | 'rozrywka' 
  | 'hobby' 
  | 'optymalizacja' 
  | 'side_questy';

/** Union wszystkich subkategorii */
export type Subcategory = Q2Subcategory | Q3Subcategory | Q4Subcategory;

/** Mapowanie quadrant -> dozwolone subkategorie */
export type QuadrantSubcategories = {
  0: never;              // Q0: brak subkategorii
  1: never;              // Q1: brak subkategorii
  2: Q2Subcategory;      // Q2: 4 opcje
  3: Q3Subcategory;      // Q3: 4 opcje
  4: Q4Subcategory;      // Q4: 4 opcje
};
```

### 2.2 Type Guards dla Subkategorii

```typescript
// Type guards do runtime validation
export function isQ2Subcategory(value: string): value is Q2Subcategory {
  return ['rutyny', 'projekt', 'ogolny_cel', 'inne'].includes(value);
}

export function isQ3Subcategory(value: string): value is Q3Subcategory {
  return ['zrob_teraz', 'zaplanuj', 'w_przerwie', 'inne'].includes(value);
}

export function isQ4Subcategory(value: string): value is Q4Subcategory {
  return ['rozrywka', 'hobby', 'optymalizacja', 'side_questy'].includes(value);
}

// Normalizacja z fallbackiem
export function normalizeQ2Subcategory(value: string | undefined): Q2Subcategory {
  if (isQ2Subcategory(value ?? '')) return value;
  return 'inne'; // fallback
}
```

### 2.3 Exhaustiveness Checking

Użycie `never` do wymuszenia obsługi wszystkich przypadków:

```typescript
function getSubcategoryLabel(sub: Subcategory): string {
  switch (sub) {
    case 'rutyny': return 'Rutyny';
    case 'projekt': return 'Projekty';
    case 'ogolny_cel': return 'Cele';
    case 'inne': return 'Inne';
    case 'zrob_teraz': return 'Zrób teraz';
    case 'zaplanuj': return 'Zaplanuj';
    case 'w_przerwie': return 'W przerwie';
    case 'rozrywka': return 'Rozrywka';
    case 'hobby': return 'Hobby';
    case 'optymalizacja': return 'Optymalizacja';
    case 'side_questy': return 'Side Questy';
    default:
      // TypeScript wymusi obsługę wszystkich przypadków
      const _exhaustiveCheck: never = sub;
      return _exhaustiveCheck;
  }
}
```

---

## 3. Zarządzanie Stanem: Derived State vs useEffect

### 3.1 Zakaz useEffect do Wyliczania Stanów

**❌ ANTI-PATTERN - useEffect do derived state:**
```typescript
// Źle - race conditions, zbędne re-rendery
function QuizComponent() {
  const [answers, setAnswers] = useState<Answers>({ importance: null, urgency: null });
  const [predictedQuadrant, setPredictedQuadrant] = useState<QuadrantNumber | null>(null);
  
  // ❌ Źle - useEffect do wyliczania stanu pochodnego
  useEffect(() => {
    if (answers.importance !== null && answers.urgency !== null) {
      const quadrant = calculateQuadrant(answers.importance, answers.urgency);
      setPredictedQuadrant(quadrant);
    }
  }, [answers]);
}
```

**✅ PATTERN - useMemo do synchronicznego derived state:**
```typescript
// Dobrze - synchroniczne, deterministyczne wyliczenie
function QuizComponent() {
  const [answers, setAnswers] = useState<Answers>({ importance: null, urgency: null });
  
  // ✅ Dobrze - useMemo wylicza pochodny stan
  const predictedQuadrant = useMemo((): QuadrantNumber | null => {
    if (answers.importance === null || answers.urgency === null) {
      return null;
    }
    return calculateQuadrant(answers.importance, answers.urgency);
  }, [answers.importance, answers.urgency]);
}
```

### 3.2 Uzasadnienie: useMemo vs useEffect

| Kryterium | useEffect | useMemo |
|-----------|-----------|---------|
| **Synchroniczność** | Async (po renderze) | Sync (podczas renderu) |
| **Race conditions** | Możliwe | Eliminowane |
| **Re-render count** | Więcej (najpierw stary stan) | Mniej (bezpośrednio nowy) |
| **Debuggowanie** | Trudniejsze (asynchroniczne) | Łatwiejsze (synchroniczne) |
| **Timer precision** | ❌ Nieakceptowalne | ✅ Wymagane |

### 3.3 Przykłady Transformacji Danych

**Grupowanie zadań z useMemo:**
```typescript
function useGroupedTasks(quadrant: QuadrantNumber) {
  const tasks = useLiveQuery(
    () => db.tasks.where('quadrant').equals(quadrant).toArray(),
    [quadrant]
  );
  
  // ✅ useMemo do transformacji - nie useEffect!
  const groupedBySubcategory = useMemo(() => {
    if (!tasks) return {};
    
    return tasks.reduce((acc, task) => {
      const sub = task.subcategory ?? 'inne';
      if (!acc[sub]) acc[sub] = [];
      acc[sub].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);
  
  return groupedBySubcategory;
}
```

**Maszyna stanów quizu:**
```typescript
// Stan maszyny wyliczony synchronicznie
const quizState = useMemo((): QuizMachineState => {
  if (!title) return { step: 'title' };
  if (importance === null || urgency === null) return { step: 'quiz', title };
  if (predictedQuadrant === null) return { step: 'quiz', title };
  if (subcategory === null && predictedQuadrant !== 1) {
    return { step: 'subcategory', title, predictedQuadrant };
  }
  return { step: 'confirm', title, predictedQuadrant, subcategory };
}, [title, importance, urgency, predictedQuadrant, subcategory]);
```

---

## 4. Hooki Customowe: Izolacja Logiki

### 4.1 Zasada: Hooki jako Kontenery Logiki

Komponenty UI powinny być "czyste szablony" - cała logika w hookach:

```typescript
// ✅ Dobrze - logika odseparowana do hooka
export function QuizModal({ task }: QuizModalProps) {
  // Wszystko w hooku - komponent to tylko UI
  const quiz = useQuizForm(task?.quadrant);
  
  return (
    <Modal>
      {quiz.step === 'title' && <TitleStep {...quiz} />}
      {quiz.step === 'quiz' && <QuizStep {...quiz} />}
      {quiz.step === 'subcategory' && <SubcategoryStep {...quiz} />}
      {quiz.step === 'confirm' && <ConfirmStep {...quiz} />}
    </Modal>
  );
}
```

### 4.2 Struktura Hooka

```typescript
// useQuizForm.ts - pełna izolacja logiki
export interface UseQuizFormReturn {
  // State
  title: string;
  importance: boolean | null;
  urgency: boolean | null;
  predictedQuadrant: QuadrantNumber | null;
  subcategory: Subcategory | null;
  
  // Actions
  setTitle: (title: string) => void;
  setImportance: (value: boolean) => void;
  setUrgency: (value: boolean) => void;
  setSubcategory: (sub: Subcategory) => void;
  submit: () => Promise<void>;
  
  // Derived state (via useMemo inside hook)
  step: QuizStep;
  canSubmit: boolean;
}

export function useQuizForm(initialQuadrant?: QuadrantNumber): UseQuizFormReturn {
  // Implementation...
}
```

---

**Document ID:** DEV-STANDARDS-001  
**Owner:** Senior Frontend Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-18
