# Przypadki Edge Case i Testowanie Granicy

> Edge Case Testing Specification  
> Document ID: TEST-EDGE-001  
> Status: APPROVED  
> Date: 2026-05-19  
> Owner: QA Lead / Senior Frontend Architect

---

## 1. Normalizacja Null/Undefined w Dexie.js

### 1.1 Kontekst Biznesowy

Pola `subcategory` w bazie Dexie.js mogą przyjmować wartości `null`, `undefined` lub pusty string `''`, co powoduje crash przy grupowaniu w `useLiveQuery`. Normalizacja zapewnia bezpieczne fallbacki.

### 1.2 Scenariusze Testowe

**EDGE-001: Normalizacja Null w Q2**

```
GIVEN: Użytkownik tworzy zadanie w Q2 (Centrum Planowania)
  AND: Nie wybiera subkategorii (pozostawia domyślną)
  AND: Wartość subcategory w bazie to NULL
  
WHEN: Użytkownik otwiera widok Q2 Sub-Matrix
  AND: System grupuje zadania po subkategorii
  
THEN: Zadanie z NULL subcategory trafia do grupy "inne"
  AND: Brak błędu "Cannot read property of null"
  AND: UI renderuje się poprawnie (bez crash)
  AND: Licznik zadań w "inne" jest zwiększony o 1
```

**EDGE-002: Normalizacja Undefined w Q3**

```
GIVEN: Istnieje zadanie w Q3 z undefined subcategory
  (np. migracja z starej wersji aplikacji)
  
WHEN: Użytkownik nawiguje do Q3 Sub-Matrix
  
THEN: Zadanie z undefined trafia do "inne"
  AND: Grupowanie działa bez błędów
  AND: Zadanie jest widoczne i klikalne
```

**EDGE-003: Normalizacja Pustego Stringa w Q4**

```
GIVEN: Zadanie w Q4 ma subcategory = '' (pusty string)
  
WHEN: System normalizuje dane w useLiveQuery
  
THEN: '' jest traktowane jako nieprawidłowa wartość
  AND: Fallback do 'side_questy' (domyślna dla Q4)
  AND: Zadanie pojawia się w sekcji Side Questy
```

**EDGE-004: Normalizacja Przy Zapisie (Proaktywna)**

```
GIVEN: Użytkownik dodaje zadanie przez formularz
  AND: Wartość subcategory jest pusta
  
WHEN: Zadanie jest zapisywane do Dexie.js
  
THEN: Przed zapisem następuje normalizacja
  AND: Do bazy trafia bezpieczna wartość ('inne' dla Q2/Q3, 'side_questy' dla Q4)
  AND: Nie ma potrzeby runtime fallback w UI
```

### 1.3 Implementacja Testowa

```typescript
// Test jednostkowy dla normalizacji
import { normalizeQ2Subcategory, normalizeQ3Subcategory, normalizeQ4Subcategory } from '@/utils/normalizers';

describe('Subcategory Normalization', () => {
  describe('Q2 Normalization', () => {
    it('should convert null to "inne"', () => {
      expect(normalizeQ2Subcategory(null)).toBe('inne');
    });
    
    it('should convert undefined to "inne"', () => {
      expect(normalizeQ2Subcategory(undefined)).toBe('inne');
    });
    
    it('should convert empty string to "inne"', () => {
      expect(normalizeQ2Subcategory('')).toBe('inne');
    });
    
    it('should preserve valid subcategory', () => {
      expect(normalizeQ2Subcategory('rutyny')).toBe('rutyny');
    });
    
    it('should handle invalid strings gracefully', () => {
      expect(normalizeQ2Subcategory('invalid')).toBe('inne');
    });
  });
  
  describe('Q4 Normalization', () => {
    it('should convert null to "side_questy"', () => {
      expect(normalizeQ4Subcategory(null)).toBe('side_questy');
    });
    
    it('should handle whitespace-only strings', () => {
      expect(normalizeQ4Subcategory('   ')).toBe('side_questy');
    });
  });
});
```

### 1.4 Matrix Fallback Values

| Quadrant | Invalid Value | Fallback | Uzasadnienie |
|----------|---------------|----------|--------------|
| Q2 | null/undefined/''/'invalid' | 'inne' | Najbardziej neutralna kategoria |
| Q3 | null/undefined/''/'invalid' | 'inne' | Najbardziej neutralna kategoria |
| Q4 | null/undefined/''/'invalid' | 'side_questy' | Domyślna dla Q4 (lowest priority) |

---

## 2. Spam-Testowanie (Race Conditions)

### 2.1 Kontekst Biznesowy

Użytkownicy z ADHD mogą klikać szybko i impulsywnie. System musi być odporny na "spam clicking" - szybkie, wielokrotne kliknięcia bez oczekiwania na odpowiedź.

### 2.2 Scenariusze Testowe

**EDGE-005: Double-Click na "Dodaj Zadanie"**

```
GIVEN: Użytkownik jest na ekranie Matrix
  AND: Przycisk "+" jest widoczny i aktywny
  
WHEN: Użytkownik klika przycisk "+" dwa razy w szybkim tempie (<100ms)
  
THEN: Modal dodawania otwiera się TYLKO RAZ
  AND: Nie powstają dwa modale nałożone na siebie
  AND: Drugie kliknięcie jest zignorowane lub zdebouncowane
  AND: Brak błędu "Non-unique key" w Dexie.js
```

**EDGE-006: Triple-Click na START Timera**

```
GIVEN: Timer jest w stanie 'idle' (nie uruchomiony)
  AND: Przycisk START jest widoczny
  
WHEN: Użytkownik klika START trzy razy w ciągu 200ms
  
THEN: Timer uruchamia się TYLKO RAZ
  AND: Licznik zaczyna odliczać od poprawnej wartości (1500s)
  AND: Nie ma "podwójnego szybkiego" odliczania
  AND: Brak podwójnych powiadomień audio
```

**EDGE-007: Mashing "Zapisz" w Quizie**

```
GIVEN: Użytkownik wypełnił quiz
  AND: Jest na ekranie potwierdzenia (Confirm)
  AND: Przycisk "Zapisz" jest aktywny
  
WHEN: Użytkownik klika "Zapisz" 5 razy w ciągu 500ms
  
THEN: Zadanie zostaje zapisane TYLKO RAZ do Dexie.js
  AND: Nie powstają duplikaty zadań
  AND: Modal zamyka się po pierwszym udanym zapisie
  AND: Kolejne kliknięcia są disabled/zignorowane
```

**EDGE-008: Szybkie Przełączanie Quadrantów**

```
GIVEN: Użytkownik jest w widoku Q2 Sub-Matrix
  
WHEN: Użytkownik klika "Q3", potem "Q4", potem "Q2" w ciągu 300ms
  
THEN: Wyświetla się ostatecznie Q2 (ostatni wybór)
  AND: Nie ma "zawieszonego" stanu między quadrandami
  AND: React Router poprawnie obsługuje nawigację
  AND: Brak błędów "setState on unmounted component"
```

### 2.3 Implementacja Ochrony

```typescript
// Pattern debounce/throttle dla akcji
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

// W komponencie:
const handleAddTask = useCallback(
  debounce(() => {
    openModal();
  }, 300, { leading: true, trailing: false }), // Execute on first click, ignore rest for 300ms
  []
);

// Lub użycie stanu "isSubmitting"
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSave = async () => {
  if (isSubmitting) return; // Block if already submitting
  
  setIsSubmitting(true);
  try {
    await saveTask();
  } finally {
    setIsSubmitting(false);
  }
};
```

### 2.4 Spam Test Matrix

| Akcja | Spam Rate | Oczekiwane Zachowanie | Test ID |
|-------|-----------|----------------------|---------|
| Add Task | 2 clicks / 100ms | 1 modal opened | EDGE-005 |
| Start Timer | 3 clicks / 200ms | 1 timer started | EDGE-006 |
| Save Quiz | 5 clicks / 500ms | 1 task saved | EDGE-007 |
| Switch Quadrant | 3 switches / 300ms | Final quadrant shown | EDGE-008 |
| Complete Task | 2 clicks / 100ms | 1 completion recorded | EDGE-009 |
| Delete (Hatch) | 2 clicks / 100ms | 1 deletion (confirm once) | EDGE-010 |

---

## 3. Limit Q1 Anti-Burnout

### 3.1 Kontekst Biznesowy

Q1 (Focus Zone) ma limit zadań aby zapobiec burnout - użytkownik z ADHD nie powinien mieć więcej niż `MAX_Q1_TASKS` (domyślnie 5) aktywnych zadań focus.

### 3.2 Scenariusze Testowe

**EDGE-011: Osiągnięcie Limitu Q1**

```
GIVEN: Q1 zawiera już 5 zadań (MAX_Q1_TASKS = 5)
  AND: Wszystkie zadania są aktywne (nie completed)
  
WHEN: Użytkownik próbuje dodać 6. zadanie do Q1
  
THEN: System wyświetla komunikat: "Q1 pełne. Ukończ lub przenieś zadanie."
  AND: Przycisk "Dodaj do Q1" jest disabled
  AND: Zadanie NIE jest dodane do bazy
  AND: Sugerowane są alternatywne quadrandy (Q2, Q3)
```

**EDGE-012: Zwolnienie Miejsca przez Ukończenie**

```
GIVEN: Q1 zawiera 5 zadań (limit osiągnięty)
  AND: Przycisk dodawania jest disabled
  
WHEN: Użytkownik oznacza jedno zadanie jako ukończone
  AND: Zadanie znika z Q1 (przeniesienie do completed/archived)
  
THEN: Licznik aktywnych zadań Q1 spada do 4
  AND: Przycisk "Dodaj do Q1" staje się aktywny
  AND: Można dodać nowe zadanie
```

**EDGE-013: Zwolnienie Miejsca przez Przeniesienie do Innego Quadrantu**

```
GIVEN: Q1 zawiera 5 zadań (limit osiągnięty)
  
WHEN: Użytkownik przenosi zadanie z Q1 do Q2 (zmiana priority)
  
THEN: Q1 ma teraz 4 zadania
  AND: Przycisk dodawania jest aktywny
  AND: Zadanie pojawia się w odpowiedniej subkategorii Q2
```

**EDGE-014: Bypass Limit przez Quiz (Q2/Q3/Q4)**

```
GIVEN: Q1 jest pełne (5 zadań)
  AND: Użytkownik chce dodać zadanie
  
WHEN: Użytkownik używa Bypass do Q2 (nie próbuje dodać do Q1)
  
THEN: Zadanie dodaje się normalnie do Q2
  AND: Limit Q1 nie wpływa na inne quadrandy
  AND: Q2/Q3/Q4 nie mają limitów (lub mają inne, wyższe)
```

**EDGE-015: Edycja Zadania w Pełnym Q1**

```
GIVEN: Q1 zawiera 5 zadań
  AND: Limit jest osiągnięty
  
WHEN: Użytkownik edytuje istniejące zadanie w Q1 (nie dodaje nowego)
  
THEN: Edycja jest dozwolona (zmiana tytułu, itp.)
  AND: Limit dotyczy TYLKO dodawania nowych zadań
  AND: Nie jest wyświetlany komunikat o limicie
```

### 3.3 Implementacja Limitu

```typescript
// Konfiguracja limitu
export const MAX_Q1_TASKS = 5;

// Sprawdzenie przed dodaniem
const canAddToQ1 = async (): Promise<boolean> => {
  const count = await db.tasks
    .where('quadrant')
    .equals(1)
    .and(t => !t.completed)
    .count();
  
  return count < MAX_Q1_TASKS;
};

// W komponencie UI
const [q1Count, setQ1Count] = useState(0);
const isQ1Full = q1Count >= MAX_Q1_TASKS;

// W JSX
<button 
  disabled={isQ1Full}
  className={cn(
    "px-4 py-2 rounded",
    isQ1Full 
      ? "bg-gray-500 cursor-not-allowed" 
      : "bg-neon-lime hover:bg-neon-lime-dark"
  )}
>
  {isQ1Full ? "Q1 Pełne" : "Dodaj do Q1"}
</button>
```

### 3.4 Matrix Limitów

| Quadrant | Limit | Uzasadnienie |
|------------|-------|--------------|
| Q1 | 5 zadań | Anti-burnout, focus protection |
| Q2 | ∞ (no limit) | Planowanie nie wymaga limitu |
| Q3 | ∞ (no limit) | Logistyka nie wymaga limitu |
| Q4 | ∞ (no limit) | Archiwum nie wymaga limitu |

---

## 4. Edge Cases Viewport (430px Pro Max Standard)

### 4.1 Testy Granicy Wymiarów

**EDGE-016: Overflow Content w 430px**

```
GIVEN: Viewport ustawiony na 430px (Pro Max Standard)
  AND: Q1 zawiera zadanie z bardzo długim tytułem (100+ znaków)
  
WHEN: Użytkownik przegląda listę zadań
  
THEN: Tytuł jest skracany z ellipsis (text-overflow: ellipsis)
  AND: Layout nie "rozjeżdża się" poza 430px
  AND: Brak horizontal scroll
  AND: Touch target pozostaje klikalny
```

**EDGE-017: Minimalna Szerokość (320px iPhone SE)**

```
GIVEN: Device width ustawiony na 320px (iPhone SE 1st gen)
  AND: Height 568px
  
WHEN: Użytkownik otwiera wszystkie ekrany aplikacji
  
THEN: Layout dostosowuje się do szerokości (< 430px = fluid)
  AND: Brak overflow poza viewport
  AND: Nagłówki h-14 utrzymują wysokość 56px
  AND: Tekst pozostaje czytelny (font-size nie jest zmniejszony)
```

**EDGE-018: Desktop z Bardzo Dużym Ekranem (4K)**

```
GIVEN: Desktop viewport 3840px × 2160px (4K)
  
WHEN: Aplikacja renderuje się
  
THEN: AppShell pozostaje w sztywnej ramce 430px
  AND: Ramka jest wycentrowana (mx-auto)
  AND: Tło poza ramką ma neutralny kolor (bg-gray-900)
  AND: Content nie rozciąga się na cały ekran
```

**EDGE-019: Orientation Change (Mobile Landscape)**

```
GIVEN: Urządzenie mobilne w orientacji Portrait (430px × 932px)
  AND: Użytkownik obraca urządzenie do Landscape (932px × 430px)
  
WHEN: Aplikacja reaguje na zmianę orientacji
  
THEN: Layout dostosowuje się do nowej szerokości (teraz 932px viewport)
  AND: AppShell pozostaje 430px (sztywny limit)
  AND: Ramka jest wycentrowana w poziomej orientacji
  AND: Brak cut-off contentu
```

### 4.2 Viewport Edge Case Matrix

| Wymiar | Test | Oczekiwany Wynik |
|--------|------|------------------|
| 320px × 568px | iPhone SE | Fluid layout, no overflow |
| 375px × 667px | iPhone 8 | Fluid layout, no overflow |
| 430px × 932px | **Pro Max Standard** | **Target dimensions, 430px constraint** |
| 768px × 1024px | iPad Mini | 430px frame centered |
| 1920px × 1080px | Desktop HD | 430px frame centered |
| 3840px × 2160px | Desktop 4K | 430px frame centered |
| 430px × 430px | Square viewport | 430px width, scroll Y |

---

## 5. Data Edge Cases

### 5.1 Timestamps i Czas

**EDGE-020: Granica Dnia (Midnight)**

```
GIVEN: Jest 23:59:59
  AND: Timer jest uruchomiony z 2 minutami (120s)
  
WHEN: Mija 2 minuty (przekroczenie północy)
  
THEN: Timer kończy się poprawnie
  AND: Timestamp ukończenia jest prawidłowy (nowy dzień)
  AND: Nie ma błędu "negative time"
```

**EDGE-021: Strefa Czasowa (Timezone Change)**

```
GIVEN: Użytkownik podróżuje i zmienia strefę czasową
  AND: Zadania mają timestamps z poprzedniej strefy
  
WHEN: Aplikacja wyświetla historię zadań
  
THEN: Timestamps są wyświetlane w lokalnej strefie użytkownika
  AND: Nie ma "przeskoku" czasu w historii
  AND: Sortowanie zadań pozostaje poprawne
```

### 5.2 IndexedDB Limits

**EDGE-022: Duża Liczba Zadań (10,000+)

```
GIVEN: Baza zawiera 10,000+ zadań (Q1-Q4)
  
WHEN: Użytkownik otwiera Matrix
  
THEN: Aplikacja ładuje się w < 1s
  AND: useLiveQuery nie zawiesza UI
  AND: Dexie.js paginacja działa (jeśli zaimplementowana)
  AND: Brak "out of memory" error
```

**EDGE-023: Długi Tytuł Zadania (Max Length)**

```
GIVEN: Tytuł zadania ma 500 znaków (limit)
  
WHEN: Zadanie jest wyświetlane w liście
  
THEN: UI nie zawiesza się
  AND: Tekst jest skracany lub scrollable
  AND: Baza zapisuje pełną wartość
```

---

## 6. Template dla Nowych Edge Cases

```markdown
## X.X [Kategoria Edge Case]

**EDGE-XXX: <Tytuł>**  
**PRIORITY:** <P0/P1/P2/P3>  
**RELATED AC:** <AC-ID z PLAN_*.md>

**Opis:**  
<Opis granicznego scenariusza i dlaczego jest ważny>

**Preconditions:**  
- <Stan systemu przed testem>
- <Dane w bazie>
- <Konfiguracja>

**Test Steps:**
1. <Krok 1>
2. <Krok 2>
3. <Krok 3>

**Expected Result:**  
- <Rezultat 1>
- <Rezultat 2>

**Actual Result:**  
<Do uzupełnienia podczas testu>

**Status:**  
<PASS/FAIL/BLOCKED>

**Evidence:**  
<Screenshot/Video/Log>
```

---

## 7. Traceability Matrix

| Edge Case ID | Kategoria | Priorytet | Plan | Status |
|--------------|-----------|-----------|------|--------|
| EDGE-001 | Normalizacja | P1 | PLAN_submatrices.md | 📝 Draft |
| EDGE-002 | Normalizacja | P1 | PLAN_submatrices.md | 📝 Draft |
| EDGE-003 | Normalizacja | P1 | PLAN_submatrices.md | 📝 Draft |
| EDGE-004 | Normalizacja | P1 | PLAN_submatrices.md | 📝 Draft |
| EDGE-005 | Race Condition | P0 | PLAN_core_flows.md | 📝 Draft |
| EDGE-006 | Race Condition | P0 | PLAN_timer.md | 📝 Draft |
| EDGE-007 | Race Condition | P0 | PLAN_quiz.md | 📝 Draft |
| EDGE-008 | Race Condition | P1 | PLAN_navigation.md | 📝 Draft |
| EDGE-011 | Q1 Limit | P0 | PLAN_q1_focus.md | 📝 Draft |
| EDGE-012 | Q1 Limit | P1 | PLAN_q1_focus.md | 📝 Draft |
| EDGE-013 | Q1 Limit | P1 | PLAN_q1_focus.md | 📝 Draft |
| EDGE-016 | Viewport | P1 | All Plans | 📝 Draft |
| EDGE-017 | Viewport | P1 | All Plans | 📝 Draft |
| EDGE-020 | Data/Time | P2 | PLAN_timer.md | 📝 Draft |
| EDGE-022 | Performance | P2 | PLAN_performance.md | 📝 Draft |

---

**Document ID:** TEST-EDGE-001  
**Owner:** QA Lead / Senior Frontend Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-19  
**Viewport:** 430px Pro Max Standard
