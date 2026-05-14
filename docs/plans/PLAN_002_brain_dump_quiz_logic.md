# PLAN_002: Brain-Dump Quiz Logic Implementation

> Detailed Implementation Plan for Smart Task Classification  
> Source: system_overview.md + PDF str. 18-19

---

## Metadane

| Pole | Wartość |
|------|---------|
| **ID** | PLAN_002 |
| **Tytuł** | Brain-Dump Quiz Logic Implementation |
| **Status** | Draft |
| **Data** | 2026-05-14 |
| **Autor** | Senior Logic Developer & SDD Specialist |
| **Dependencies** | PLAN_000 (Repo Setup), PLAN_001 (Core Data Layer), ADR_001 (IndexedDB) |
| **Priority** | P0 (MUST HAVE - core differentiator) |

**Powiązane dokumenty:**
- `docs/architecture/system_overview.md` - Model danych Task, relacje
- `docs/architecture/adr/ADR_001_choice_of_storage.md` - IndexedDB + Dexie.js
- `docs/design-system.md` - Neon Glassmorphism, transitions
- `docs/plans/PLAN_RISK_002_icp_persona.md` - ADHD UX requirements
- PDF str. 18 - Brain Dump Quiz flow
- PDF str. 19 - Q1 Overload Protection

---

## 1. Executive Summary

### Cel
Zaimplementować **Smart Quiz** - system klasyfikacji zadań który "myśli za użytkownika", redukując decision paralysis (kluczowy pain point dla ADHD Brain persona).

### Core Value Prop
> "Nie musisz decydować do której ćwiartki - odpowiedz na 2 pytania, a FocusFlow zrobi to za Ciebie"

### Key Features
1. **2-Question Flow** - binarne decyzje (Tak/Nie), żadnych skali 1-5
2. **Auto-classification** - algorytm mapuje odpowiedzi na Q1-Q4
3. **Q1 Overload Guard** - hard limit 5 zadań z "System Przeciążenia"
4. **Friction-less UX** - max 3 kliknięcia od "pomysł" do "sklasyfikowane"

---

## 2. Algorytm Klasyfikacji

### 2.1 Drzewo Decyzyjne

```
                    [START]
                      │
                      ▼
    ┌─────────────────────────────────┐
    │  PYTANIE 1: WAŻNOŚĆ             │
    │  "Czy przybliża Cię to          │
    │   do Twojego celu?"             │
    └─────────────────────────────────┘
              │              │
           TAK │              │ NIE
              ▼              ▼
    ┌─────────────┐    ┌─────────────┐
    │ Ścieżka     │    │ Ścieżka     │
    │ WAŻNE       │    │ NIE-WAŻNE   │
    │ (Q1 lub Q2) │    │ (Q3 lub Q4) │
    └─────────────┘    └─────────────┘
              │              │
              ▼              ▼
    ┌─────────────────────────────────┐
    │  PYTANIE 2: PILNOŚĆ             │
    │  "Czy masz twardy termin        │
    │   lub deadline?"                │
    └─────────────────────────────────┘
              │              │
           TAK │              │ NIE
              ▼              ▼
       ┌──────────┐     ┌──────────┐
       │  PILNE   │     │ NIE-PILNE│
       └──────────┘     └──────────┘
              │              │
              ▼              ▼
```

### 2.2 Mapowanie Odpowiedzi → Quadrant

| Pytanie 1 (Ważność) | Pytanie 2 (Pilność) | Quadrant | Nazwa |
|---------------------|---------------------|----------|-------|
| TAK | TAK | **Q1** | Pilne i Ważne (EMERGENCY) |
| TAK | NIE | **Q2** | Nie-pilne i Ważne (GROWTH) |
| NIE | TAK | **Q3** | Pilne i Nie-ważne (ADMIN) |
| NIE | NIE | **Q4** | Nie-pilne i Nie-ważne (WASTE) |

### 2.3 Typy Danych (TypeScript)

```typescript
// types/quiz.ts

export type QuizAnswer = 'YES' | 'NO';

export type ImportanceAnswer = QuizAnswer;  // Pytanie 1
export type UrgencyAnswer = QuizAnswer;      // Pytanie 2

export interface QuizState {
  step: 'TITLE' | 'IMPORTANCE' | 'URGENCY' | 'CONFIRM' | 'OVERLOAD';
  title: string;
  importance?: ImportanceAnswer;
  urgency?: UrgencyAnswer;
  suggestedQuadrant?: 1 | 2 | 3 | 4;
}

export interface QuizResult {
  title: string;
  quadrant: 1 | 2 | 3 | 4;
  classificationReason: string;  // Human-readable explanation
}

export type QuadrantNumber = 1 | 2 | 3 | 4;

// Mapowanie odpowiedzi na quadrant
export const classifyTask = (
  importance: ImportanceAnswer,
  urgency: UrgencyAnswer
): QuadrantNumber => {
  if (importance === 'YES' && urgency === 'YES') return 1;
  if (importance === 'YES' && urgency === 'NO') return 2;
  if (importance === 'NO' && urgency === 'YES') return 3;
  return 4;  // importance === 'NO' && urgency === 'NO'
};
```

### 2.4 Teksty Pytań (Copy)

| Krok | Pytanie | Opcje | UX Note |
|------|---------|-------|---------|
| **TITLE** | "Co chcesz zrobić?" | Input field | Placeholder: "Np. Napisać raport, Zadzwonić do klienta..." |
| **Q1 (Importance)** | "Czy przybliża Cię to do Twojego głównego celu?" | Tak / Nie | Subtext: "Pomoże Ci to osiągnąć to, co naprawdę ważne?" |
| **Q2 (Urgency)** | "Czy masz na to twardy termin lub deadline?" | Tak / Nie | Subtext: "Czy ktoś czeka / konsekwencje po terminie?" |
| **CONFIRM** | Podsumowanie | "Dodaj do [Quadrant]" | Show quadrant color + name |

---

## 3. Integracja z Przeciążeniem Q1 (Q1 Overload Protection)

### 3.1 Logika Sprawdzania Limitu

**ZASADA:** Q1 może zawierać max 5 aktywnych zadań. Przy próbie dodania 6-go - blokada.

```typescript
// services/q1LimitService.ts

import { db } from '@/db/dexie';

export const Q1_LIMIT = 5;

export interface Q1LimitCheckResult {
  canAdd: boolean;
  currentCount: number;
  remainingSlots: number;
}

export const checkQ1Limit = async (): Promise<Q1LimitCheckResult> => {
  const q1Tasks = await db.tasks
    .where('quadrant')
    .equals(1)
    .and(task => !task.completed)
    .count();
  
  return {
    canAdd: q1Tasks < Q1_LIMIT,
    currentCount: q1Tasks,
    remainingSlots: Math.max(0, Q1_LIMIT - q1Tasks),
  };
};

export const getQ1LimitStatus = async (): Promise<{
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'BLOCKED';
  count: number;
}> => {
  const count = await db.tasks
    .where('quadrant')
    .equals(1)
    .and(task => !task.completed)
    .count();
  
  if (count >= Q1_LIMIT) return { status: 'BLOCKED', count };
  if (count >= 4) return { status: 'CRITICAL', count };
  if (count >= 3) return { status: 'WARNING', count };
  return { status: 'SAFE', count };
};
```

### 3.2 Flow przy Przekroczeniu Limitu

```
[User odpowiada na Quiz]
         │
         ▼
[Algorytm sugeruje Q1]
         │
         ▼
[Sprawdź Q1 count]
         │
    ┌────┴────┐
   <5 │         │ >=5
     │         │
     ▼         ▼
[Zapisz    [Pokaż ekran
 do Q1]     "Przeciążenie"]
                 │
                 ▼
    ┌────────────────────────┐
    │  OPCJE REASIGNACJI:    │
    │                        │
    │  1. Dodaj do Q2        │
    │     (Zaplanuj później) │
    │                        │
    │  2. Dodaj do Q3        │
    │     (Zrób w przerwie) │
    │                        │
    │  3. Brain Dump         │
    │     (Zapisz na później)│
    │                        │
    │  4. Odrzuć             │
    │     (Nie teraz)         │
    └────────────────────────┘
```

### 3.3 Ekran "Przeciążenie Systemu" (System Overload)

**Copy:**
- **Tytuł:** "Przeciążenie Systemu"
- **Subtext:** "Masz już 5 zadań krytycznych (Q1). Dodanie kolejnego = burnout."
- **CTA Options:**
  - "Zaplanuj w Q2" (przenieś do growth zone)
  - "Zrób w przerwie (Q3)" (quick admin task)
  - "Zapisz w Brain Dump" (capture without commitment)
  - "Odrzuć na teraz" (archive to Q4)

**Visual:**
- Red / Orange neon glow (warning aesthetic)
- Progress bar: 5/5 filled
- Shield icon with alert

### 3.4 TypeScript Interfaces

```typescript
// types/q1Overload.ts

export type OverloadOption = 
  | 'MOVE_TO_Q2'      // "Zaplanuj na później"
  | 'MOVE_TO_Q3'      // "Zrób w przerwie"
  | 'BRAIN_DUMP'      // "Zapisz w Brain Dump"
  | 'DISCARD'         // "Odrzuć"
  | 'CANCEL';         // "Anuluj dodawanie"

export interface OverloadResolution {
  option: OverloadOption;
  targetQuadrant?: 2 | 3 | 4;  // Dla MOVE_TO_Q2/3
  shouldSaveToNotes?: boolean; // Dla BRAIN_DUMP
}

export interface Q1OverloadScreenProps {
  taskTitle: string;
  currentQ1Count: number;
  onResolve: (resolution: OverloadResolution) => void;
  onCancel: () => void;
}
```

---

## 4. User Flow & State Management

### 4.1 Stan Quizu (React State)

```typescript
// hooks/useQuiz.ts

import { useState, useCallback } from 'react';
import type { QuizState, QuizAnswer, QuadrantNumber } from '@/types/quiz';

export type QuizStep = 'TITLE' | 'IMPORTANCE' | 'URGENCY' | 'CONFIRM' | 'OVERLOAD';

interface UseQuizReturn {
  state: QuizState;
  setTitle: (title: string) => void;
  answerImportance: (answer: QuizAnswer) => void;
  answerUrgency: (answer: QuizAnswer) => void;
  confirmQuadrant: () => void;
  handleOverload: (option: OverloadOption) => void;
  reset: () => void;
  canProceed: boolean;
  suggestedQuadrant: QuadrantNumber | null;
}

const initialState: QuizState = {
  step: 'TITLE',
  title: '',
  importance: undefined,
  urgency: undefined,
  suggestedQuadrant: undefined,
};

export const useQuiz = (): UseQuizReturn => {
  const [state, setState] = useState<QuizState>(initialState);

  const setTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title: title.trim() }));
  }, []);

  const answerImportance = useCallback((answer: QuizAnswer) => {
    setState(prev => ({
      ...prev,
      importance: answer,
      step: 'URGENCY',
    }));
  }, []);

  const answerUrgency = useCallback((answer: QuizAnswer) => {
    setState(prev => {
      const quadrant = classifyTask(prev.importance!, answer);
      return {
        ...prev,
        urgency: answer,
        suggestedQuadrant: quadrant,
        step: quadrant === 1 ? 'CONFIRM' : 'CONFIRM', // Q1 sprawdzi limit w innym hooku
      };
    });
  }, []);

  // ... pozostałe metody

  return {
    state,
    setTitle,
    answerImportance,
    answerUrgency,
    // ...
  };
};
```

### 4.2 Flow Diagram - State Transitions

```
[TITLE] 
   │ input.length >= 1
   ▼
[IMPORTANCE] ──NO──┐
   │ YES            │
   ▼                ▼
[URGENCY]       [URGENCY]
   │                │
   ▼                ▼
[Check Q1?] <──────┘
   │ suggestedQuadrant === 1
   ├────────┬────────┐
   ▼        ▼        ▼
  YES      NO     Q1 count
   │        │     < 5?
   ▼        ▼        │
[OVERLOAD] [CONFIRM]├─YES→[CONFIRM]
   │        │        │
   │        │        ▼ NO
   │        │     [OVERLOAD]
   │        │        │
   ▼        ▼        ▼
[SAVE]   [SAVE]  [REASSIGN]
```

### 4.3 Final Save do IndexedDB

**ZASADA:** Zapis do IndexedDB (Dexie.js) dopiero po pełnym ukończeniu quizu.

```typescript
// services/taskService.ts

import { db } from '@/db/dexie';
import type { Task, TaskInput } from '@/types/task';
import { checkQ1Limit } from './q1LimitService';

export const saveTaskFromQuiz = async (
  title: string,
  quadrant: QuadrantNumber,
  subcategory?: string
): Promise<Task> => {
  // Walidacja
  if (!title || title.trim().length === 0) {
    throw new Error('Task title is required');
  }

  // Sprawdź limit Q1 (double-check przed zapisem)
  if (quadrant === 1) {
    const q1Check = await checkQ1Limit();
    if (!q1Check.canAdd) {
      throw new Error('Q1_LIMIT_REACHED');
    }
  }

  const task: TaskInput = {
    title: title.trim(),
    quadrant,
    subcategory,
    completed: false,
    priority: quadrant === 1 ? 1 : quadrant === 2 ? 2 : 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const id = await db.tasks.add(task);
  return { ...task, id };
};
```

### 4.4 Optimistic UI & Error Handling

```typescript
// hooks/useSaveTask.ts

import { useState, useCallback } from 'react';
import { saveTaskFromQuiz } from '@/services/taskService';

interface UseSaveTaskReturn {
  save: (title: string, quadrant: QuadrantNumber) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}

export const useSaveTask = (): UseSaveTaskReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (title: string, quadrant: QuadrantNumber) => {
    setIsSaving(true);
    setError(null);

    try {
      await saveTaskFromQuiz(title, quadrant);
      // Success - navigate away or show confirmation
    } catch (err) {
      if (err.message === 'Q1_LIMIT_REACHED') {
        setError('Q1_OVERLOAD');
      } else {
        setError('SAVE_FAILED');
      }
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { save, isSaving, error };
};
```

---

## 5. Walidacja i Edge Cases

### 5.1 Walidacja Tytułu

| Reguła | Wartość | Komunikat błędu |
|--------|---------|-----------------|
| **Wymagane** | `title.length >= 1` | "Dodaj nazwę zadania" |
| **Max length** | `title.length <= 100` | "Max 100 znaków" |
| **Trim** | Usuń whitespace z końców | Auto-trim |
| **Sanity check** | `!title.includes('<script')` | Basic XSS prevention |

```typescript
export const validateTaskTitle = (title: string): { 
  isValid: boolean; 
  error?: string;
  trimmed: string;
} => {
  const trimmed = title.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Dodaj nazwę zadania', trimmed };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Max 100 znaków', trimmed };
  }
  
  return { isValid: true, trimmed };
};
```

### 5.2 Edge Cases

| Scenario | Zachowanie |
|----------|------------|
| **User zamyka app mid-quiz** | Stan zachowany w localStorage (opcjonalnie) |
| **Q1 count zmienia się MID-quiz** | Check ponownie przed zapisem |
| **Network error przy save** | Retry x3, potem error state |
| **DB quota exceeded** | Error + "Export data" suggestion |
| **User spamuje "Dodaj"** | Debounce 500ms + loading state |

### 5.3 LocalStorage Backup (Optional)

```typescript
// hooks/useQuizWithPersistence.ts

const STORAGE_KEY = 'focusflow_quiz_draft';

export const saveQuizDraft = (state: QuizState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadQuizDraft = (): QuizState | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearQuizDraft = () => {
  localStorage.removeItem(STORAGE_KEY);
};
```

---

## 6. Animacje i Transitions (Neon Glassmorphism)

### 6.1 Specyfikacja Animacji

| Transition | Czas | Easing | Opis |
|------------|------|--------|------|
| **Step enter** | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Slide up + fade |
| **Step exit** | 200ms | `ease-in` | Fade out |
| **Button press** | 150ms | `ease-out` | Scale 0.98 |
| **Option select** | 200ms | `ease-in-out` | Background glow |
| **Success save** | 400ms | `ease-out` | Scale out + checkmark |
| **Overload alert** | 500ms | `ease-out` | Shake + red glow |

### 6.2 CSS Animations

```css
/* Quiz step transitions */
.quiz-step-enter {
  animation: slideUpFade 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.quiz-step-exit {
  animation: fadeOut 200ms ease-in forwards;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Option selection glow */
.option-selected {
  animation: neonPulse 2s ease-in-out infinite;
}

@keyframes neonPulse {
  0%, 100% { 
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }
  50% { 
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
}

/* Overload warning shake */
.overload-warning {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
```

### 6.3 React Transition Logic

```tsx
// components/QuizStepTransition.tsx

import { useState, useEffect } from 'react';

interface QuizStepTransitionProps {
  step: QuizStep;
  children: React.ReactNode;
}

export const QuizStepTransition: React.FC<QuizStepTransitionProps> = ({
  step,
  children,
}) => {
  const [displayStep, setDisplayStep] = useState(step);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (step !== displayStep) {
      setIsExiting(true);
      
      // Wait for exit animation
      setTimeout(() => {
        setDisplayStep(step);
        setIsExiting(false);
      }, 200); // Match CSS animation duration
    }
  }, [step, displayStep]);

  return (
    <div className={isExiting ? 'quiz-step-exit' : 'quiz-step-enter'}>
      {children}
    </div>
  );
};
```

---

## 7. Integracja z Design System

### 7.1 Kolory per Step

| Step | Primary Color | Glow Effect |
|------|----------------|-------------|
| **TITLE** | Neon Cyan (`#00F0FF`) | `shadow-neon-cyan` |
| **IMPORTANCE** | Quadrant color (dynamic) | Based on expected result |
| **URGENCY** | Quadrant color (dynamic) | Based on expected result |
| **CONFIRM** | Assigned quadrant color | Q1=lime, Q2=purple, Q3=cyan, Q4=gray |
| **OVERLOAD** | Warning Orange (`#FFA502`) | `shadow-[0_0_30px_rgba(255,165,2,0.5)]` |

### 7.2 Komponenty UI do Wykorzystania

| Komponent | Z `design-system.md` | Usage in Quiz |
|-----------|---------------------|---------------|
| **Glass Card** | `.glass-card` | Container dla pytania |
| **Primary Button** | `.btn-primary` | "Dalej", "Zapisz" |
| **Secondary Button** | `.btn-secondary` | "Anuluj", "Wróć" |
| **Option Button** | Custom variant | Tak / Nie wyboru |
| **Progress Bar** | Custom | 2/3 steps completed |
| **Neon Border** | `.neon-border-qX` | Selected quadrant |

### 7.3 Typography Scale

| Element | Style | Token |
|---------|-------|-------|
| **Question** | H2 | `text-h2 text-white` |
| **Subtext** | Body Small | `text-small text-white/70` |
| **Options** | Button | `text-button font-semibold` |
| **Quadrant name** | H1 + gradient | `text-h1 text-gradient-neon` |

---

## 8. API & Services Contract

### 8.1 Quiz Service Interface

```typescript
// services/quizService.ts

export interface StartQuizInput {
  initialTitle?: string;
}

export interface QuizAnswerInput {
  sessionId: string;
  step: 'IMPORTANCE' | 'URGENCY';
  answer: QuizAnswer;
}

export interface CompleteQuizInput {
  sessionId: string;
  title: string;
  quadrant: QuadrantNumber;
}

export const QuizService = {
  // Start new quiz session
  start: (input?: StartQuizInput): QuizState => {
    return {
      step: 'TITLE',
      title: input?.initialTitle ?? '',
    };
  },

  // Answer importance question
  answerImportance: (state: QuizState, answer: QuizAnswer): QuizState => {
    return {
      ...state,
      importance: answer,
      step: 'URGENCY',
    };
  },

  // Answer urgency question + classify
  answerUrgency: (state: QuizState, answer: QuizAnswer): QuizState => {
    const quadrant = classifyTask(state.importance!, answer);
    return {
      ...state,
      urgency: answer,
      suggestedQuadrant: quadrant,
      step: 'CONFIRM',
    };
  },

  // Check Q1 limit before save
  validateSave: async (quadrant: QuadrantNumber): Promise<{
    canSave: boolean;
    overloadData?: Q1OverloadScreenProps;
  }> => {
    if (quadrant !== 1) return { canSave: true };
    
    const check = await checkQ1Limit();
    if (check.canAdd) return { canSave: true };
    
    return {
      canSave: false,
      overloadData: {
        taskTitle: '', // Filled by caller
        currentQ1Count: check.currentCount,
        onResolve: () => {}, // Filled by caller
        onCancel: () => {}, // Filled by caller
      },
    };
  },

  // Complete and save
  complete: async (input: CompleteQuizInput): Promise<Task> => {
    return saveTaskFromQuiz(input.title, input.quadrant);
  },
};
```

---

## 9. Testing Strategy

### 9.1 Unit Tests (Logic)

```typescript
// __tests__/quizLogic.test.ts

describe('classifyTask', () => {
  it('should return Q1 for YES/YES', () => {
    expect(classifyTask('YES', 'YES')).toBe(1);
  });
  
  it('should return Q2 for YES/NO', () => {
    expect(classifyTask('YES', 'NO')).toBe(2);
  });
  
  it('should return Q3 for NO/YES', () => {
    expect(classifyTask('NO', 'YES')).toBe(3);
  });
  
  it('should return Q4 for NO/NO', () => {
    expect(classifyTask('NO', 'NO')).toBe(4);
  });
});

describe('validateTaskTitle', () => {
  it('should reject empty string', () => {
    const result = validateTaskTitle('');
    expect(result.isValid).toBe(false);
  });
  
  it('should reject whitespace-only', () => {
    const result = validateTaskTitle('   ');
    expect(result.isValid).toBe(false);
  });
  
  it('should trim whitespace', () => {
    const result = validateTaskTitle('  Task name  ');
    expect(result.trimmed).toBe('Task name');
    expect(result.isValid).toBe(true);
  });
  
  it('should reject >100 chars', () => {
    const result = validateTaskTitle('a'.repeat(101));
    expect(result.isValid).toBe(false);
  });
});

describe('Q1 Limit', () => {
  it('should block when count >= 5', async () => {
    // Mock 5 Q1 tasks
    const result = await checkQ1Limit();
    expect(result.canAdd).toBe(false);
  });
  
  it('should allow when count < 5', async () => {
    // Mock 3 Q1 tasks
    const result = await checkQ1Limit();
    expect(result.canAdd).toBe(true);
  });
});
```

### 9.2 E2E Tests (User Flow)

```typescript
// __tests__/quizFlow.e2e.test.ts

describe('Brain Dump Quiz Flow', () => {
  it('complete flow: Q1 task', async () => {
    // Start quiz
    // Enter title
    // Answer YES to importance
    // Answer YES to urgency
    // Expect Q1 confirmation
    // Save
    // Verify in DB
  });
  
  it('Q1 overload scenario', async () => {
    // Pre-populate 5 Q1 tasks
    // Start quiz
    // Try to add Q1 task
    // Expect overload screen
    // Choose reassign to Q2
    // Verify saved in Q2
  });
  
  it('validation: empty title', async () => {
    // Try proceed without title
    // Expect validation error
  });
});
```

---

## 10. Implementation Checklist

### Phase 1: Core Logic ( bez UI)
- [ ] `types/quiz.ts` - TypeScript interfaces
- [ ] `utils/classifyTask.ts` - Algorithm implementation
- [ ] `services/q1LimitService.ts` - Q1 limit checking
- [ ] `services/taskService.ts` - Save task
- [ ] Unit tests for all utility functions

### Phase 2: State Management
- [ ] `hooks/useQuiz.ts` - Quiz state hook
- [ ] `hooks/useSaveTask.ts` - Save with error handling
- [ ] Integration with Dexie.js
- [ ] LocalStorage persistence (optional)

### Phase 3: UI Components
- [ ] `components/quiz/QuizContainer.tsx`
- [ ] `components/quiz/TitleStep.tsx`
- [ ] `components/quiz/ImportanceStep.tsx`
- [ ] `components/quiz/UrgencyStep.tsx`
- [ ] `components/quiz/ConfirmStep.tsx`
- [ ] `components/quiz/Q1OverloadScreen.tsx`
- [ ] `components/quiz/QuizStepTransition.tsx`

### Phase 4: Integration
- [ ] Wire up with routing
- [ ] Integration with Dashboard ("Dodaj zadanie" CTA)
- [ ] E2E tests
- [ ] `/WF UX` audit

### Phase 5: Polish
- [ ] Animation fine-tuning
- [ ] Copy review (ADHD-friendly language)
- [ ] Haptic feedback
- [ ] Error boundaries

---

## 11. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **User confused by 2-question flow** | Medium | High | Clear copy, tooltips, "Why 2 questions?" help |
| **Q1 limit frustrates power users** | Medium | Medium | "Pro Mode" toggle? (future) |
| **Animation performance on old phones** | Low | Medium | `prefers-reduced-motion` support |
| **Quiz abandonment rate high** | Medium | High | Analytics + A/B test simplified flow |
| **Classification accuracy poor** | Low | High | Manual edit available post-quiz |

---

## 12. References

- PDF str. 18 - "Brain Dump i Inteligentny Quiz" flow
- PDF str. 19 - "Mechanizm Ochronny: Przeciążenie Q1"
- `system_overview.md` - Task model, subcategories
- `PLAN_RISK_002` - ADHD UX requirements (Minimal Friction, Decision Support)
- `design-system.md` - Animations, Neon Glassmorphism

---

**Status:** Draft - awaiting approval before implementation
**Next Step:** Review with Product Owner, then create tickets for Phase 1

