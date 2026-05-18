# ADR 004: Synchronous Derived State for Form State Machines

> Status: ✅ Accepted  
> Data: Maj 2026  
> Autor: FocusFlow Team

---

## Context

Quiz w FocusFlow to **maszyna stanów** (state machine) z krokami:
1. `title` - wprowadzenie tytułu zadania
2. `quiz` - 3 pytania o ważność/pilność
3. `subcategory` - wybór podkategorii (dla Q2)
4. `confirm` - ekran potwierdzenia

### Problem: Race Condition z useEffect

Stara implementacja używała `useEffect` do obliczania `predictedQuadrant`:

```typescript
// ❌ BŁĘDNA implementacja
const [predictedQuadrant, setPredictedQuadrant] = useState<QuadrantNumber | null>(null);

useEffect(() => {
  const quadrant = classifyFromScores(importanceAnswers, urgencyAnswers);
  setPredictedQuadrant(quadrant);
}, [importanceAnswers, urgencyAnswers]);

const nextStep = () => {
  // Problem: predictedQuadrant może być null!
  if (predictedQuadrant === 2) {
    setCurrentStep('subcategory');  // Czasem nie działało!
  }
};
```

**Race condition:**
1. Użytkownik odpowiada na ostatnie pytanie
2. `nextStep()` wywoływane natychmiast
3. `predictedQuadrant` wciąż `null` (useEffect nie zdążył uruchomić się i zaktualizować stanu)
4. Logika przechodzi do złego kroku (np. `confirm` zamiast `subcategory`)

---

## Decision

Zastosuj **Synchronous Derived State** - obliczaj stan pochodny synchronicznie podczas renderu.

### Implementacja

```typescript
const useQuizForm = (options?: QuizOptions) => {
  // Stan źródłowy (source of truth)
  const [importanceAnswers, setImportanceAnswers] = useState<TriAnswer>([null, null, null]);
  const [urgencyAnswers, setUrgencyAnswers] = useState<TriAnswer>([null, null, null]);
  const [manualQuadrant, setManualQuadrant] = useState<QuadrantNumber | null>(null);
  const [bypass] = useState<QuadrantNumber | null>(options?.bypass ?? null);
  
  // ✅ SYNCHRONICZNY stan pochodny (computed on every render)
  const predictedQuadrant: QuadrantNumber | null = 
    bypass ??           // 1. Bypass z options (np. z Q2)
    manualQuadrant ??   // 2. Ręczna zmiana przez użytkownika
    classifyFromScores(importanceAnswers, urgencyAnswers);  // 3. Auto-klasyfikacja
  
  // Użycie - zawsze aktualne, nigdy null (chyba że brak odpowiedzi)
  const nextStep = () => {
    // Można użyć predictedQuadrant lub przeliczyć na nowo
    const computed = bypass ?? manualQuadrant ?? classifyFromScores(importanceAnswers, urgencyAnswers);
    
    if (computed === 2) {
      setCurrentStep('subcategory');  // Zawsze działa!
    } else if (computed !== null) {
      setCurrentStep('confirm');
    }
  };
};
```

---

## Consequences

### Positive

1. **Eliminacja race conditions** - stan zawsze aktualny
2. **Brak stale data** - nigdy nie używasz starej wartości
3. **Mniej re-renderów** - brak dodatkowych setState
4. **Łatwiejsze debugowanie** - synchroniczny flow
5. **Testowanie** - prostsze unit testy (bez async/await)

### Negative

1. **Obliczanie przy każdym renderze** - może być kosztowne (ale classifyFromScores to O(1))
2. **Złożoność mentalna** - rozróżnienie source vs derived
3. **Potencjalny overhead** - jeśli funkcja klasyfikacji byłaby ciężka

### Mitigations

- Memoizacja przez `useMemo` jeśli klasyfikacja byłaby kosztowna
- `classifyFromScores` to prosta operacja matematyczna (9 case'ów) - O(1)

---

## Analysis: Porównanie Async vs Sync

### Async useEffect (Zawodny)

```
Render 1: answers = [null, null, null]
  → predictedQuadrant = null (initial)
  → useEffect zaplanowany

Zmiana: answers = [2, 1, 2]

Render 2: predictedQuadrant = null (stale!)
  → nextStep() wywołane
  → ❌ BŁĄD: predictedQuadrant jest null!
  → useEffect dopiero teraz uruchomiony

Render 3: predictedQuadrant = 2 (z opóźnieniem)
  → Ale nextStep już wykonało się z błędną logiką
```

### Sync Derived State (Niezawodny)

```
Render 1: answers = [null, null, null]
  → predictedQuadrant = null (poprawne, brak danych)

Zmiana: answers = [2, 1, 2]

Render 2: predictedQuadrant = classifyFromScores([2,1,2]) = 2
  → nextStep() wywołane
  → ✅ POPRAWNE: predictedQuadrant === 2
  → setCurrentStep('subcategory')
```

---

## Prioritety Obliczania

```typescript
// Kolejność priorytetów (od najwyższego do najniższego):
const predictedQuadrant = 
  bypass ??           // 1. Opcja z góry (np. z Centrum Planowania Q2)
  manualQuadrant ??   // 2. Użytkownik ręcznie zmienił w UI
  autoComputed;       // 3. Algorytm na podstawie odpowiedzi

// Przykłady użycia:
// Case 1: Wywołanie z Centrum Planowania
// bypass=2, manual=null, auto=3 → wynik: 2 (Q2)

// Case 2: Użytkownik nadpisał auto-klasyfikację
// bypass=null, manual=1, auto=3 → wynik: 1 (Q1)

// Case 3: Pełna klasyfikacja przez algorytm
// bypass=null, manual=null, auto=4 → wynik: 4 (Q4)
```

---

## Integration: Quiz Flow

```
Użytkownik odpowiada na pytanie 3
    ↓
setUrgencyAnswers([...])  // Update stanu źródłowego
    ↓
React re-render
    ↓
SYNC: const predictedQuadrant = classifyFromScores(...)  // Obliczona natychmiast
    ↓
Auto-advance timer (setTimeout 800ms)
    ↓
nextStep() wywołane
    ↓
if (predictedQuadrant === 2) {
  setCurrentStep('subcategory');  // ✅ Zawsze poprawne!
} else {
  setCurrentStep('confirm');
}
```

---

## Type Safety

```typescript
// Typowanie stanu źródłowego
const [importanceAnswers, setImportanceAnswers] = useState<TriAnswer>([null, null, null]);
const [urgencyAnswers, setUrgencyAnswers] = useState<TriAnswer>([null, null, null]);

// Typowanie stanu pochodnego (readonly)
const predictedQuadrant: QuadrantNumber | null = 
  bypass ?? manualQuadrant ?? classifyFromScores(importanceAnswers, urgencyAnswers);

// Funkcja klasyfikacji
const classifyFromScores = (
  imp: TriAnswer, 
  urg: TriAnswer
): QuadrantNumber => {
  // Algorytm decyzyjny (9 case'ów)
  // Zwraca 1, 2, 3, lub 4
};
```

---

## Testing

```typescript
// Unit test - synchroniczny
it('should classify Q2 correctly', () => {
  const importance: TriAnswer = [2, 2, 1];  // High
  const urgency: TriAnswer = [1, 1, 1];     // Low
  
  const result = classifyFromScores(importance, urgency);
  
  expect(result).toBe(2);  // Q2: Ważne, Niepilne ✅
});

// Hook test - synchroniczny
it('should show subcategory step for Q2', () => {
  const { result } = renderHook(() => useQuizForm());
  
  // Symulacja odpowiedzi
  act(() => {
    result.current.setImportanceAnswer(0, 2);
    result.current.setImportanceAnswer(1, 2);
    result.current.setImportanceAnswer(2, 1);
    result.current.setUrgencyAnswer(0, 1);
    result.current.setUrgencyAnswer(1, 1);
    result.current.setUrgencyAnswer(2, 1);
  });
  
  // predictedQuadrant aktualizuje się SYNCHRONICZNIE
  expect(result.current.predictedQuadrant).toBe(2);
  
  act(() => {
    result.current.nextStep();
  });
  
  expect(result.current.currentStep).toBe('subcategory'); ✅
});
```

---

## Alternatives Considered

| Rozwiązanie | Dlaczego odrzucono |
|-------------|-------------------|
| useEffect + useCallback | Race condition nadal możliwy |
| Redux/Observables | Overkill dla tego use case |
| useReducer | Możliwy, ale złożony dla async side effects |
| XState | Idealny, ale dodatkowa zależność i learning curve |
| Computed signals (Solid.js style) | Niedostępne w React bez zewnętrznych lib |

---

## Related Decisions

- ADR 001: Initial Stack (React hooks)
- ADR 002: Q0 Isolation (Quiz do kwalifikacji)
- ADR 003: Timer Delta (podobna filozofia - unikanie async drift)

---

## References

- [React Docs: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Derived State in React](https://react.dev/learn/thinking-in-react#step-5-add-inverse-data-flow-optional)
- [Race Conditions in React](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)
