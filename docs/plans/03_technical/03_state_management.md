# Technical Specification: State Management Architecture

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Globalny Kontekst dla Modala Zakończenia

### 1.1 Problem: Race Condition przy Local State

Gdy `showCompletionModal` był lokalnym stanem w `TimerScreen`:

```typescript
// ❌ BŁĘDNA implementacja
const TimerScreen = () => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  useEffect(() => {
    if (timeLeft === 0) {
      setShowCompletionModal(true);
    }
  }, [timeLeft]);
  
  // Problem: przy re-renderze TimerScreen, stan się resetował!
};
```

**Konsekwencje:**
- Modal zamykał się samoistnie przy zmianie zadania
- Timer się resetował przy nawigacji
- Użytkownik tracił możliwość wyboru akcji

### 1.2 Rozwiązanie: Global State w TimerContext

```typescript
interface TimerContextValue {
  // Stan globalny (preserved across renders)
  showCompletionModal: boolean;
  setShowCompletionModal: (show: boolean) => void;
  
  // Inne stany globalne
  timeLeft: number;
  timerState: 'idle' | 'running' | 'paused' | 'break';
  activeTaskId: number | null;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export const TimerProvider = ({ children }) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // ... inne stany
  
  return (
    <TimerContext.Provider value={{
      showCompletionModal,
      setShowCompletionModal,
      // ...
    }}>
      {children}
    </TimerContext.Provider>
  );
};
```

### 1.3 Użycie w TimerScreen

```typescript
const TimerScreen = () => {
  const { showCompletionModal, setShowCompletionModal } = useTimer();
  
  return (
    <>
      {/* Timer UI */}
      
      {showCompletionModal && (
        <CompletionModal 
          onComplete={handleComplete}
          onAnotherSession={handleAnotherSession}
          onReturnLater={handleReturnLater}
        />
      )}
    </>
  );
};
```

### 1.4 Flow Stanu Globalnego

```
Timer osiąga 00:00
    ↓
TimerContext.setShowCompletionModal(true)
    ↓
Re-render TimerScreen z modal=true
    ↓
Użytkownik wybiera opcję
    ↓
TimerContext.setShowCompletionModal(false)
    ↓
Stan preserved nawet przy nawigacji
```

---

## 2. Synchroniczny Derived State w Quizie

### 2.1 Problem: Asynchroniczny Lag Reacta

**Stara implementacja (z bugiem):**

```typescript
// ❌ BŁĘDNA implementacja
const [predictedQuadrant, setPredictedQuadrant] = useState<QuadrantNumber | null>(null);

useEffect(() => {
  // Oblicz asynchronicznie
  const quadrant = classifyFromScores(importanceAnswers, urgencyAnswers);
  setPredictedQuadrant(quadrant);
}, [importanceAnswers, urgencyAnswers]);

const nextStep = () => {
  // Problem: predictedQuadrant może być null!
  if (predictedQuadrant === 2) {
    setCurrentStep('subcategory');  // Czasem nie działało
  }
};
```

**Race condition:**
1. Użytkownik odpowiada na ostatnie pytanie
2. `nextStep()` wywoływane natychmiast
3. `predictedQuadrant` wciąż `null` (useEffect nie zdążył)
4. Logika przechodzi do złego kroku!

### 2.2 Rozwiązanie: Synchroniczny Derived State

```typescript
// ✅ POPRAWNA implementacja
const useQuizForm = (options?: QuizOptions) => {
  // Stan źródłowy (source of truth)
  const [importanceAnswers, setImportanceAnswers] = useState<TriAnswer>([null, null, null]);
  const [urgencyAnswers, setUrgencyAnswers] = useState<TriAnswer>([null, null, null]);
  const [manualQuadrant, setManualQuadrant] = useState<QuadrantNumber | null>(null);
  const [bypass] = useState<QuadrantNumber | null>(options?.bypass ?? null);
  
  // SYNCHRONICZNY stan pochodny (computed on render)
  const predictedQuadrant: QuadrantNumber | null = 
    bypass ??           // 1. Bypass z options (np. z Q2)
    manualQuadrant ??   // 2. Ręczna zmiana przez użytkownika
    classifyFromScores(importanceAnswers, urgencyAnswers);  // 3. Auto-klasyfikacja
  
  // Użycie - zawsze aktualne!
  const nextStep = () => {
    const computed = bypass ?? manualQuadrant ?? classifyFromScores(importanceAnswers, urgencyAnswers);
    
    if (computed === 2) {
      setCurrentStep('subcategory');  // Zawsze działa!
    } else {
      setCurrentStep('confirm');
    }
  };
};
```

### 2.3 Diagram Stanu (Maszyna Stanów Quizu)

```
┌─────────┐    setTaskTitle    ┌─────────┐
│  title  │ ─────────────────► │  quiz   │
│ (input) │                    │(pytania)│
└─────────┘                    └────┬────┘
                                    │
              all questions answered │
                                    ▼
                    ┌─────────────────────┐
                    │   SYNCHRONICZNA     │
                    │  KLASYFIKACJA       │
                    │                     │
                    │ predictedQuadrant = │
                    │ classifyFromScores()│
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌─────────┐     ┌─────────┐     ┌─────────┐
        │   Q2    │     │   Q3    │     │Q1, Q4  │
        │ subcat  │     │ subcat  │     │ confirm│
        └────┬────┘     └────┬────┘     └────┬────┘
             │               │               │
             └───────────────┴───────────────┘
                             │
                             ▼
                    ┌─────────────┐
                    │   confirm   │
                    │  (summary)  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   submit    │
                    │  (Dexie)    │
                    └─────────────┘
```

### 2.4 Prioritety Obliczania `predictedQuadrant`

```typescript
// Kolejność priorytetów (od najwyższego):
const predictedQuadrant = 
  bypass ??           // 1. Opcja z góry (np. z Centrum Planowania Q2)
  manualQuadrant ??   // 2. Użytkownik ręcznie zmienił
  autoComputed;       // 3. Algorytm na podstawie odpowiedzi

// Przykłady:
// bypass=2, manual=null, auto=3 → wynik: 2 (Q2 z Centrum Planowania)
// bypass=null, manual=1, auto=3 → wynik: 1 (użytkownik nadpisał)
// bypass=null, manual=null, auto=4 → wynik: 4 (klasyfikacja algorytmu)
```

---

## 3. Porównanie: Derived vs Async State

### 3.1 Tabela Porównawcza

| Cecha | Async useEffect | Sync Derived |
|-------|----------------|--------------|
| **Timing** | Next tick | Immediate |
| **Race condition** | Możliwa | Niemożliwa |
| **Stale data** | Możliwa | Nigdy |
| **Re-rendery** | 2+ (setState) | 1 (compute) |
| **Debugowanie** | Trudne | Łatwe |
| **Testowanie** | Async/await | Synchroniczne |

### 3.2 Przykład Buga (Async)

```typescript
// ❌ Async - zawodne
useEffect(() => {
  setPredictedQuadrant(classifyFromScores(answers));
}, [answers]);

const handleNext = () => {
  console.log(predictedQuadrant);  // null (jeszcze nie updated!)
  if (predictedQuadrant === 2) {   // Fałszywe negative
    setStep('subcategory');
  }
};
```

### 3.3 Przykład Fixa (Sync)

```typescript
// ✅ Sync - niezawodne
const predictedQuadrant = classifyFromScores(answers);

const handleNext = () => {
  const computed = classifyFromScores(answers);  // Immediate
  console.log(computed);  // Zawsze aktualne
  if (computed === 2) {   // Zawsze prawidłowe
    setStep('subcategory');
  }
};
```

---

## 4. Architektura Hooka useQuizForm

### 4.1 Interfejs

```typescript
interface UseQuizFormReturn {
  // Stan
  taskTitle: string;
  currentStep: 'title' | 'quiz' | 'subcategory' | 'confirm';
  importanceAnswers: [Answer, Answer, Answer];
  urgencyAnswers: [Answer, Answer, Answer];
  subcategory: string | null;
  predictedQuadrant: QuadrantNumber | null;
  isSubmitting: boolean;
  
  // Akcje
  setTaskTitle: (title: string) => void;
  setImportanceAnswer: (index: number, value: Answer) => void;
  setUrgencyAnswer: (index: number, value: Answer) => void;
  setSubcategory: (sub: string) => void;
  setManualQuadrant: (q: QuadrantNumber) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitTask: () => Promise<boolean>;
  resetQuiz: () => void;
}
```

### 4.2 Automatyczny Advance

```typescript
const checkAutoAdvance = (
  slide: number,
  impArr: TriAnswer,
  urgArr: TriAnswer,
  wasNull: boolean,
) => {
  if (!wasNull) return;  // Tylko przy pierwszej odpowiedzi
  if (impArr[slide] === null || urgArr[slide] === null) return;
  
  setTimeout(() => {
    if (slide < 2) {
      setCurrentSlide(slide + 1);
    } else {
      // Ostatnie pytanie - synchroniczna klasyfikacja
      const computed = classifyFromScores(impArr, urgArr);
      if (computed === 2) {
        setCurrentStep('subcategory');
      } else {
        setCurrentStep('confirm');
      }
    }
  }, AUTO_ADVANCE_MS);
};
```

---

## 5. Integracja z Komponentami

### 5.1 QuizModal.tsx

```typescript
const QuizModal = ({ isOpen, onClose, initialQuadrant }: QuizModalProps) => {
  const quiz = useQuizForm({ bypass: initialQuadrant });
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {quiz.currentStep === 'title' && <TitleStep ... />}
      {quiz.currentStep === 'quiz' && <QuizStep ... />}
      {quiz.currentStep === 'subcategory' && (
        // Renderuje się natychmiast dzięki sync derived state!
        <SubcategoryStep 
          predictedQuadrant={quiz.predictedQuadrant}  // Zawsze 2
          onSelect={quiz.setSubcategory}
        />
      )}
      {quiz.currentStep === 'confirm' && <ConfirmStep ... />}
    </Modal>
  );
};
```

### 5.2 Flow Maszyny Stanów

```
Użytkownik klika "Dalej"
    ↓
nextStep() wywołane
    ↓
SYNCHRONICZNIE: const computed = classifyFromScores(...)
    ↓
computed === 2 ? 
    ↓ TAK                    ↓ NIE
setStep('subcategory')    setStep('confirm')
    ↓
Re-render z predictedQuadrant=2
    ↓
SubcategoryStep wyświetla się natychmiast!
```

---

## 6. Kryteria Akceptacji

- [x] Globalny TimerContext dla `showCompletionModal`
- [x] Brak race conditions przy timer completion
- [x] Synchroniczny derived state dla `predictedQuadrant`
- [x] Eliminacja useEffect do obliczania quadrant
- [x] Prioritety: bypass > manual > auto-classify
- [x] Auto-advance przy ostatnim pytaniu (z sync check)
- [x] Subcategory step wyświetla się natychmiast dla Q2
- [x] Hook useQuizForm z czystym interfejsem

---

## 7. Decyzje Architektoniczne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Global context** | Singleton modal state, brak resetów |
| **Sync derived** | Eliminacja race conditions |
| **Compute on render** | Zawsze aktualne dane |
| **Source + Derived** | Jasna separacja stanu |
| **Priority chain** | Elastyczność (bypass, manual, auto) |
| **Immutability** | Przewidywalne updates |
