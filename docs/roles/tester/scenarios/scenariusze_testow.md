# Scenariusze Testowania (Test Scenarios)

> GIVEN-WHEN-THEN Test Specification  
> Document ID: TEST-SCENARIOS-001  
> Status: APPROVED  
> Date: 2026-05-19  
> Owner: QA Lead / Senior Frontend Architect

---

## 1. Struktura GIVEN-WHEN-THEN

### 1.1 Format Specyfikacji

```
SCENARIO: <ID> - <Tytuł scenariusza>
PRIORITY: <P0/P1/P2/P3>
RELATED AC: <AC-ID z PLAN_*.md>

GIVEN: <Kontekst początkowy - stan systemu przed akcją>
  AND: <Dodatkowy kontekst (opcjonalnie)>
  
WHEN: <Akcja użytkownika lub zdarzenie systemowe>
  AND: <Dodatkowa akcja (opcjonalnie)>
  
THEN: <Oczekiwany rezultat - weryfikowalny outcome>
  AND: <Dodatkowy rezultat (opcjonalnie)>
```

### 1.2 Przykład Struktury

```
SCENARIO: EXAMPLE-001 - Dodanie zadania do Q1
PRIORITY: P0
RELATED AC: AC-1 z PLAN_core_matrix.md

GIVEN: Użytkownik jest na ekranie głównym Matrix
  AND: Quadrant Q1 zawiera mniej niż 5 zadań
  
WHEN: Klika przycisk "+" w sekcji Q1
  AND: Wpisuje tytuł "Napisać raport"
  AND: Klika "Zapisz"
  
THEN: Zadanie pojawia się na liście Q1
  AND: Modal dodawania zamyka się
  AND: Licznik zadań Q1 zwiększa się o 1
```

---

## 2. Scenariusze Krytyczne (P0)

### 2.1 Background Throttling z Delta Timestamp

**SCENARIO: TIMER-001 - Timer Precision During Background Throttling**  
**PRIORITY: P0**  
**RELATED AC:** AC-3 z PLAN_timer.md, ADR-002

**Opis biznesowy:**  
Użytkownik z ADHD często przełącza się między aplikacjami. Timer musi być precyzyjny nawet gdy aplikacja działa w tle i przeglądarka throttle'uje setInterval do 1 ticka na 10-30 sekund.

```
GIVEN: Timer jest uruchomiony z presetem 25 minut (1500s)
  AND: Pozostały czas wynosi 1200 sekund (20 min)
  AND: Aplikacja działa na pierwszym planie
  
WHEN: Użytkownik przełącza się do innej aplikacji (background)
  AND: Mija 5 minut (300s) w czasie rzeczywistym
  AND: Przeglądarka throttle'uje JavaScript do 1 tick/30s
  
THEN: Po powrocie do aplikacji pozostały czas wynosi 900s (15 min)
  AND: Wyświetlany czas jest dokładny (błąd max 1s)
  AND: Timer kontynuuje odliczanie bez przeskoków
  AND: Nie ma "zamrożenia" na starym czasie
```

**Test Implementation Details:**

```typescript
// Technika testowa: Manual + DevTools Throttling
// 1. Chrome DevTools → Performance → CPU Throttling: 6x slowdown
// 2. Otwórz inną kartę na 5 minut
// 3. Wróć do FocusFlow
// 4. Sprawdź: timeLeft = expectedEndTime - Date.now()

// Expected Result:
const expectedTimeLeft = expectedEndTime - Date.now();
// Błąd powinien być < 1s (nie 10-30s jak przy setInterval)
```

**Edge Cases:**

```
SCENARIO: TIMER-002 - Timer Completion in Background
PRIORITY: P0

GIVEN: Timer uruchomiony z 2 minutami (120s)
  AND: Użytkownik przełącza do innej aplikacji
  
WHEN: Mija 2 minuty w tle
  
THEN: Timer automatycznie kończy się
  AND: Powiadomienie dźwiękowe zostaje wywołane (jeśli audio unlocked)
  AND: Przy powrocie modal ukończenia jest widoczny
```

---

### 2.2 Quiz Bypass Flow

**SCENARIO: QUIZ-001 - Direct Quadrant Assignment (Bypass)**  
**PRIORITY: P0**  
**RELATED AC:** AC-5 z PLAN_task_classification.md

**Opis biznesowy:**  
Użytkownik może pominąć quiz kategoryzujący i bezpośrednio przypisać zadanie do Q2, Q3 lub Q4 - redukcja friction dla znanych typów zadań.

```
SCENARIO: QUIZ-001 - Bypass do Q2 (Centrum Planowania)

GIVEN: Użytkownik otwiera modal dodawania zadania
  AND: Quadrant Q2 (Centrum Planowania) jest dostępny z poziomu UI
  
WHEN: Klika przycisk "Dodaj bezpośrednio do Q2"
  AND: Wpisuje tytuł zadania: "Przygotować prezentację"
  AND: Wybiera subkategorię: "projekt"
  
THEN: Zadanie zostaje zapisane w Q2 z subkategorią "projekt"
  AND: Nie wyświetla się quiz (importance/urgency)
  AND: Modal zamyka się natychmiast
  AND: Zadanie jest widoczne w Q2 → Projekty
```

```
SCENARIO: QUIZ-002 - Bypass do Q3 (Hub Logistyki)

GIVEN: Użytkownik otwiera modal dodawania zadania
  
WHEN: Klika przycisk "Dodaj do Q3"
  AND: Wpisuje tytuł: "Zadzwonić do księgowej"
  AND: Wybiera subkategorię: "zrob_teraz"
  
THEN: Zadanie trafia do Q3 z subkategorią "zrob_teraz"
  AND: Pominięty jest etap quizu
  AND: Zadanie pojawia się w Q3 → Zrób teraz
```

```
SCENARIO: QUIZ-003 - Bypass do Q4 z Destructive Hatch

GIVEN: Użytkownik otwiera modal dodawania zadania
  
WHEN: Klika przycisk "Dodaj do Q4 (Archiwum)"
  AND: Wpisuje tytuł: "Nauczyć się ukulele"
  AND: Wybiera subkategorię: "hobby"
  
THEN: Zadanie trafia do Q4 z subkategorią "hobby"
  AND: Na ekranie Q4 dostępny jest przycisk "Zapomnij" (Hatch)
  AND: Przycisk Hatch ma styl destructive (czerwony/srebrny)
```

**Test Implementation Details:**

```typescript
// Weryfikacja w hooku useQuizForm:
const predictedQuadrant: QuadrantNumber | null = 
  manualQuadrant ??      // 1. Ręczny override
  bypass ??              // 2. Bypass z UI (ten scenariusz!)
  computed;               // 3. Wyliczenie algorytmu

// Test: Upewnij się że bypass ma priorytet nad computed
expect(predictedQuadrant).toBe(bypassValue);
expect(quizStep).toBe('subcategory'); // Pominięty quiz
```

---

## 3. Scenariusze UI/UX (P1)

### 3.1 Test Symetrii UI (h-14 + whitespace-nowrap)

**SCENARIO: UI-001 - Uniform Header Height (h-14) Across All Quadrants**  
**PRIORITY: P1**  
**RELATED AC:** AC-2 z PLAN_q2_submatrix.md, AC-2 z PLAN_q3_submatrix.md, AC-2 z PLAN_q4_submatrix.md

**Opis biznesowy:**  
Wszystkie nagłówki sub-matryc (Q2, Q3, Q4) muszą mieć identyczną wysokość 56px (h-14) dla idealnej symetrii osiowej layoutu.

```
SCENARIO: UI-001 - h-14 Height Consistency in Q2 Sub-Matrix

GIVEN: Użytkownik jest w widoku Q2 (Centrum Planowania)
  AND: Wyświetlają się 4 sub-matryce: Rutyny, Projekty, Cele, Inne
  AND: Viewport jest ustawiony na 430px (Pro Max Standard)
  
WHEN: Tester mierzy wysokość nagłówków w DevTools
  
THEN: Wszystkie 4 nagłówki mają wysokość 56px (h-14)
  AND: Nagłówki są wyrównane do góry (top alignment)
  AND: Ikony i teksty są wycentrowane w pionie (items-center)
  AND: Layout nie ma "przeskoków" między sekcjami
```

```
SCENARIO: UI-002 - h-14 Height Consistency in Q3 Sub-Matrix

GIVEN: Użytkownik jest w widoku Q3 (Hub Logistyki)
  AND: Wyświetlają się 4 sub-matryce: Zrób teraz, Zaplanuj, W przerwie, Inne
  
WHEN: Tester sprawdza wymiary w Chrome DevTools
  
THEN: Każdy nagłówek ma klasę `h-14` (56px)
  AND: Wszystkie nagłówki mają identyczną wysokość
  AND: Symetria osiowa jest zachowana (2x2 grid)
```

```
SCENARIO: UI-003 - h-14 Height Consistency in Q4 Sub-Matrix

GIVEN: Użytkownik jest w widoku Q4 (Archiwum)
  AND: Wyświetlają się 4 sub-matryce: Rozrywka, Hobby, Optymalizacja, Side Questy
  AND: Q4 używa matte silver theme (#94A3B8)
  
WHEN: Tester mierzy nagłówki
  
THEN: Wszystkie nagłówki mają h-14 (56px)
  AND: Srebrny (#94A3B8) jest użyty dla Q4 (nie neon fuchsia)
  AND: "Zapomnij" button jest widoczny w odpowiedniej sekcji
```

**Test Implementation Details:**

```typescript
// Test w DevTools Console:
const headers = document.querySelectorAll('.submatrix-header');
headers.forEach(h => {
  const height = h.getBoundingClientRect().height;
  console.assert(height === 56, `Header height is ${height}px, expected 56px`);
});

// Tailwind classes verification:
// <div className="h-14 flex items-center justify-between ...">
```

---

### 3.2 Test whitespace-nowrap

**SCENARIO: UI-004 - Text Overflow Prevention with whitespace-nowrap**  
**PRIORITY: P1**  
**RELATED AC:** AC-3 z PLAN_submatrices.md

**Opis biznesowy:**  
Etykiety w nagłówkach (np. "Zrób teraz", "Side Questy") muszą być chronione przed łamaniem wyrazów na małych ekranach.

```
SCENARIO: UI-004 - No Text Wrapping in Headers

GIVEN: Użytkownik jest w dowolnym widoku sub-matrycy (Q2/Q3/Q4)
  AND: Viewport jest ustawiony na minimalną szerokość 320px (iPhone SE)
  AND: Nagłówki zawierają etykiety tekstowe
  
WHEN: Tester sprawdza zachowanie tekstu w nagłówkach
  
THEN: Tekst nigdy nie łamie się na nową linię
  AND: Klasa `whitespace-nowrap` jest zastosowana do wszystkich etykiet
  AND: Długie teksty są skracane (ellipsis) lub dopasowane
  AND: Layout nie "rozjeżdża się" przy długich nazwach
```

**Test Implementation Details:**

```typescript
// CSS verification:
// <span className="text-xs font-bold uppercase whitespace-nowrap leading-none">
//   Side Questy
// </span>

// DevTools check:
const labels = document.querySelectorAll('.submatrix-header h3');
labels.forEach(l => {
  const styles = window.getComputedStyle(l);
  console.assert(
    styles.whiteSpace === 'nowrap',
    `Label "${l.textContent}" doesn't have whitespace: nowrap`
  );
});
```

---

## 4. Scenariusze Viewport (P0)

### 4.1 430px Pro Max Standard Compliance

**SCENARIO: VIEWPORT-001 - Strict 430px Width Constraint**  
**PRIORITY: P0**  
**RELATED AC:** AC-1 z all PLAN_*.md

```
SCENARIO: VIEWPORT-001 - Content Fits 430px on All Screens

GIVEN: Aplikacja jest uruchomiona w Chrome DevTools
  AND: Device Toolbar jest włączony
  AND: Width ustawiony na 430px (iPhone 14/15 Pro Max)
  AND: Height ustawiony na 932px
  
WHEN: Użytkownik nawiguje przez wszystkie ekrany:
  - Matrix (Q1-Q4)
  - Timer Screen
  - Q2 Sub-Matrix
  - Q3 Sub-Matrix  
  - Q4 Sub-Matrix
  - Quiz Modal
  
THEN: Żaden ekran nie przekracza 430px szerokości
  AND: Brak horizontal scroll na wszystkich ekranach
  AND: Content jest wycentrowany (mx-auto)
  AND: Padding X jest konsystentny (px-4 = 16px)
```

```
SCENARIO: VIEWPORT-002 - Responsive Scale on Smaller Screens

GIVEN: Device width jest ustawiony na 375px (iPhone SE) lub 320px
  
WHEN: Użytkownik otwiera aplikację
  
THEN: Layout dostosowuje się do dostępnej szerokości
  AND: Brak overflow (< 430px = 100% width z padding)
  AND: Touch targets pozostają ≥44px
  AND: Text pozostaje czytelny (no truncation)
```

```
SCENARIO: VIEWPORT-003 - Desktop Device Frame (≥480px)

GIVEN: Viewport width jest ≥480px (desktop)
  
WHEN: Aplikacja renderuje się
  
THEN: Widoczna jest estetyczna ramka urządzenia (min-[480px]:border-x-4)
  AND: AppShell ma sztywne 430px width (nie rozciąga się)
  AND: Ramka jest wycentrowana na ekranie (mx-auto)
  AND: Content wewnątrz pozostaje 430px
```

---

## 5. Scenariusze Integracyjne (P1)

### 5.1 Timer + Task Integration

```
SCENARIO: INTEGRATION-001 - Timer-Task Association

GIVEN: Zadanie "Napisać raport" istnieje w Q1
  AND: Timer jest w stanie 'idle'
  
WHEN: Użytkownik klika zadanie i wybiera preset 25min
  AND: Klika START
  
THEN: Timer jest powiązany z zadaniem (taskId w TimerContext)
  AND: Wyświetlany jest tytuł zadania obok timera
  AND: Po ukończeniu, czas jest logowany do historii zadania
```

### 5.2 Dexie.js + UI Reactivity

```
SCENARIO: INTEGRATION-002 - Live UI Updates on Database Changes

GIVEN: Użytkownik jest na ekranie Matrix
  AND: Q1 zawiera 3 zadania
  
WHEN: W innej zakładce/oknie dodaje nowe zadanie do Q1 (via Dexie)
  
THEN: Zadanie pojawia się natychmiast w Q1 (bez refresh)
  AND: Licznik zadań Q1 aktualizuje się automatycznie
  AND: useLiveQuery triggeruje re-render komponentu
```

---

## 6. Template dla Nowych Scenariuszy

```markdown
## X.X [Kategoria]

**SCENARIO: <ID> - <Tytuł>**  
**PRIORITY:** <P0/P1/P2/P3>  
**RELATED AC:** <AC-ID z PLAN_*.md>

**Opis biznesowy:**  
<Kontekst biznesowy - dlaczego ten scenariusz jest ważny dla użytkownika>

```
GIVEN: <Stan początkowy>
  AND: <Dodatkowy kontekst>
  
WHEN: <Akcja użytkownika>
  AND: <Dodatkowa akcja>
  
THEN: <Rezultat 1 - weryfikowalny>
  AND: <Rezultat 2 - weryfikowalny>
  AND: <Rezultat 3 - weryfikowalny>
```

**Test Implementation Details:**
<Kroki techniczne do wykonania testu, kod, DevTools instructions>

**Edge Cases:**
- <Edge case 1>
- <Edge case 2>
```

---

## 7. Traceability do Planów

| Scenariusz ID | Plan | AC | Priorytet | Status |
|---------------|------|----|-----------|--------|
| TIMER-001 | PLAN_timer.md | AC-3 | P0 | 📝 Draft |
| TIMER-002 | PLAN_timer.md | AC-3 | P0 | 📝 Draft |
| QUIZ-001 | PLAN_task_classification.md | AC-5 | P0 | 📝 Draft |
| QUIZ-002 | PLAN_task_classification.md | AC-5 | P0 | 📝 Draft |
| QUIZ-003 | PLAN_task_classification.md | AC-5 | P0 | 📝 Draft |
| UI-001 | PLAN_q2_submatrix.md | AC-2 | P1 | 📝 Draft |
| UI-002 | PLAN_q3_submatrix.md | AC-2 | P1 | 📝 Draft |
| UI-003 | PLAN_q4_submatrix.md | AC-2 | P1 | 📝 Draft |
| UI-004 | PLAN_submatrices.md | AC-3 | P1 | 📝 Draft |
| VIEWPORT-001 | All Plans | AC-1 | P0 | 📝 Draft |
| VIEWPORT-002 | All Plans | AC-1 | P0 | 📝 Draft |
| VIEWPORT-003 | All Plans | AC-1 | P0 | 📝 Draft |
| INTEGRATION-001 | PLAN_timer.md | AC-4 | P1 | 📝 Draft |
| INTEGRATION-002 | PLAN_core_matrix.md | AC-6 | P1 | 📝 Draft |

---

**Document ID:** TEST-SCENARIOS-001  
**Owner:** QA Lead / Senior Frontend Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-19  
**Viewport:** 430px Pro Max Standard
