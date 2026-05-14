# Testing Strategy - FocusFlow 2.0

> Quality Assurance Framework for Spec Driven Development (SDD)  
> Role: Senior QA Lead & SDD Test Architect

---

## Metadane

| Pole | Wartość |
|------|---------|
| **Dokument** | Testing Strategy |
| **Wersja** | 1.0 |
| **Status** | Active |
| **Data** | 2026-05-14 |
| **Metodologia** | SDD (Spec Driven Development) |
| **Primary Focus** | UX/UI Compliance, Logic Validation, ADHD UX |

---

## 1. Filozofia Testowania (Testing Philosophy)

### 1.1 Testujemy Specyfikację, Nie Tylko Kod

> **"Kod jest poprawny, gdy implementuje specyfikację - nie gdy 'działa'"**

| Podejście Tradycyjne | Podejście SDD |
|---------------------|---------------|
| "Testujemy czy kod działa" | "Testujemy czy kod realizuje PLAN_XXX" |
| Testy pisane ad-hoc | Każdy test odnosi się do konkretnego wymagania z planu |
| Bug = kod nie działa | Bug = kod nie zgadza się ze specyfikacją |
| Coverage = linie kodu | Coverage = wymagania z planów |

### 1.2 Constraint-First Testing

Priorytet testowania:

1. **480px Safety Net** - Layout constraint jest NADRZĘDNY
2. **Mobile-First UI** - Touch targets, thumb zones, scroll behavior
3. **ADHD UX** - Friction reduction, visual persistence, decision support

### 1.3 ADHD-Aware Testing

Tester musi myśleć jak osoba z executive dysfunction:

- Czy ten flow wymaga odemnie myślenia? ❌
- Czy to jest "foolproof" (idiotoodporne)? ✅
- Czy użytkownik może "zablokować się" w tym miejscu? ⚠️

---

## 2. Poziomy Testów (Testing Levels)

### 2.1 Level 1: UX/UI Compliance (Visual Audit)

**Cel:** Weryfikacja zgodności implementacji z dokumentacją wizualną

#### 2.1.1 /WF UX Workflow

**Narzędzie:** `.kilocode/workflows/ux_review.md`

**Proces:**
```
1. Wywołaj /WF UX
2. Wskaż ekran/komponent do audytu
3. Agent porównuje kod z PDF reference
4. Generowany raport: UX_REVIEW_[komponent].md
5. Acceptance: Pass / Needs Fix / Blocker
```

**Checklist UX Review:**
- [ ] **Visual Match** - Kolory z `colors.ts`, nie twarde HEX
- [ ] **480px Constraint** - `max-w-[480px]` na każdym widoku
- [ ] **Thumb-First** - Touch targets ≥44px, primary actions w dolnej 1/3
- [ ] **Glassmorphism** - `backdrop-blur`, `bg-white/[alpha]`, neon glows
- [ ] **Typography** - Inter font, skala z `design-system.md`
- [ ] **Icons** - Lucide React, `strokeWidth={1.5}`

#### 2.1.2 PDF Reference Mapping

| Ekran | PDF Strona | Kluczowe Elementy do Weryfikacji |
|-------|------------|----------------------------------|
| Pulpit | 15 | Aktualny cel Q1, "Kolejne w kolejce", licznik Q1 |
| Macierz | 16 | Grid 2×2, liczniki ćwiartek, neon borders |
| Quiz | 18 | 2 pytania binarne, płynne przejścia |
| Q1 Overload | 19 | Blokada, komunikat, opcje reasignacji |
| Timer | 6 | 25/5 lub 50/10, progress ring, streak |
| Brain Dump | 7 | Quick capture, lista nieposortowanych |
| Today View | 5 | Linearny plan dnia, sekcje Q1/Q2/Q3 |
| Q2/Q3/Q4 | 23, 24 | Subkategorie, opcje decyzyjne |

---

### 2.2 Level 2: Logic & Algorithm Testing

**Cel:** Weryfikacja poprawności algorytmów biznesowych

#### 2.2.1 Brain Dump Quiz Logic

**Spec Reference:** `docs/plans/PLAN_002_brain_dump_quiz_logic.md`

**Test Cases:**

| Test ID | Scenariusz | Wejście | Oczekiwany Wynik | Ref |
|---------|------------|---------|------------------|-----|
| LOG-001 | Q1 classification | YES + YES | Quadrant 1 | PLAN_002, 2.2 |
| LOG-002 | Q2 classification | YES + NO | Quadrant 2 | PLAN_002, 2.2 |
| LOG-003 | Q3 classification | NO + YES | Quadrant 3 | PLAN_002, 2.2 |
| LOG-004 | Q4 classification | NO + NO | Quadrant 4 | PLAN_002, 2.2 |
| LOG-005 | Empty title validation | "" | Error: "Dodaj nazwę zadania" | PLAN_002, 5.1 |
| LOG-006 | Title max length | 101 chars | Error: "Max 100 znaków" | PLAN_002, 5.1 |
| LOG-007 | Title trimming | "  Task  " | Trimmed: "Task" | PLAN_002, 5.1 |

#### 2.2.2 Q1 Overload Protection

**Spec Reference:** `docs/plans/PLAN_002_brain_dump_quiz_logic.md` (3.1)

**Test Cases:**

| Test ID | Scenariusz | Stan Q1 | Oczekiwane Zachowanie |
|---------|------------|---------|----------------------|
| OL-001 | Limit not reached | 4 tasks | Allow save to Q1 |
| OL-002 | Limit reached | 5 tasks | Block, show overload screen |
| OL-003 | Reassign to Q2 | 5 tasks | Save to Q2, preserve task |
| OL-004 | Reassign to Q3 | 5 tasks | Save to Q3, preserve task |
| OL-005 | Brain dump option | 5 tasks | Save to notes, no quadrant |
| OL-006 | Status check | 4 Q1 + 1 Q1 completed | Allow (completed don't count) |

#### 2.2.3 Task Model Validation

**Spec Reference:** `docs/architecture/system_overview.md`

**Test Cases:**

| Test ID | Scenariusz | Weryfikacja |
|---------|------------|-------------|
| DB-001 | Task creation | UUID, timestamps, default values |
| DB-002 | Quadrant update | Zmiana Q2→Q1, cascade effects |
| DB-003 | Subcategory storage | Rutyna/Projekt/Inne w Q2 |
| DB-004 | Completion toggle | completed=true/false, updatedAt |
| DB-005 | IndexedDB persistence | Reload app, data persists |
| DB-006 | Export/Import JSON | Backup i restore działa |

---

### 2.3 Level 3: Regression Testing

**Cel:** Nowe funkcje nie psują istniejących

#### 2.3.1 480px Layout Regression

**Trigger:** Każdy nowy ekran/komponent

**Test:**
```
1. Otwórz ekran X
2. Otwórz DevTools (Chrome)
3. Włącz Device Toolbar (Mobile)
4. Ustaw width: 480px
5. Sprawdź:
   - Czy layout nie rozjeżdża się?
   - Czy wszystkie elementy są widoczne?
   - Czy touch targets są klikalne?
6. Ustaw width: 375px (iPhone SE)
7. Powtórz test
8. Ustaw width: 768px (tablet)
9. Sprawdź czy layout jest wycentrowany (nie rozciągnięty)
```

#### 2.3.2 Cross-Screen Flow Regression

**Critical Paths do Testowania:**

| Flow | Kroki | Co Weryfikujemy |
|------|-------|-----------------|
| **Add → Quiz → Save** | Pulpit → + → Quiz → Q1 | Zadanie pojawia się w Q1 |
| **Matrix → Quadrant** | Macierz → Q2 → Proza Życia | Poprawna nawigacja |
| **Q1 Overload Flow** | 5×Q1 → 6. zadanie → Reassign → Q2 | Limit działa, reasignacja OK |
| **Timer Session** | Timer → Start → 25min → Complete | Streak +1, session saved |
| **Brain Dump Capture** | Brain Dump → Type → Save → Quiz Later | Notatka zapisana, klasyfikacja później |

---

## 3. Specyficzne Kryteria ADHD UX

### 3.1 Test Tarcia (Friction Test)

**Zasada:** Każda akcja MUSI zajmować ≤ 3 kliknięcia

| Akcja | Maksymalne Kroki | Test |
|-------|------------------|------|
| Dodaj zadanie (Quick) | 1 klik + type | Pulpit → FAB → type → save |
| Sklasyfikuj przez Quiz | 2 kliknięcia (2×TAK/NIE) | Start Quiz → Q1 → Q2 → done |
| Zmień ćwiartkę | 2 kliki (task → move → select) | Long-press → Move → Q3 |
| Start Focus Timer | 1 klik | Context menu → Start Focus |

**Metoda Pomiaru:**
```
1. Nagraj ekran (screen recording)
2. Wykonaj akcję
3. Policz kliknięcia/taps
4. Jeśli > 3 → BUG (High Priority)
```

### 3.2 Test Przeciążenia (Overload Test)

**Zasada:** System musi poprawnie blokować 6. zadanie w Q1

**Procedura Testowa:**
```
1. Utwórz 5 zadań w Q1 (przez Quiz, wszystkie YES/YES)
2. Sprawdź licznik Q1: "5/5"
3. Rozpocznij Quiz dla 6. zadania
4. Odpowiedz YES/YES (sugeruje Q1)
5. WERYFIKACJA:
   - Czy pojawił się ekran "Przeciążenie Systemu"?
   - Czy komunikat jest friendly (nie "error")?
   - Czy są 4 opcje reasignacji?
6. Wybierz "Zaplanuj w Q2"
7. WERYFIKACJA:
   - Czy zadanie pojawiło się w Q2?
   - Czy Q1 wciąż ma 5 zadań?
```

### 3.3 Test Czytelności (Readability Test)

**Zasada:** Kontrast neonowych barw na ciemnym tle musi być wystarczający

**Weryfikacja (z `colors.ts`):**

| Element | Kolory | Wymagany Kontrast | Rzeczywisty |
|---------|--------|-------------------|-------------|
| Text primary | #FFF on #0F172A | 4.5:1 | 16.8:1 ✅ |
| Q1 neon | #39FF14 on #0F172A | 3:1 (large) | 12.4:1 ✅ |
| Q2 neon | #A855F7 on #0F172A | 3:1 (large) | 8.2:1 ✅ |
| Q3 neon | #00F0FF on #0F172A | 3:1 (large) | 9.1:1 ✅ |
| Secondary text | 70% white | 4.5:1 | 11.2:1 ✅ |

**Narzędzie:** WebAIM Contrast Checker (webaim.org/resources/contrastchecker/)

---

## 4. Procedura Akceptacji Planu (Plan Acceptance Process)

### 4.1 Flow SDD: Plan → Implementation → Review

```
[PLAN_XXX.md]           [Implementacja]         [Testy]              [Acceptance]
     │                        │                    │                      │
     │ 1. Review              │                    │                      │
     │    (Product Owner)     │                    │                      │
     ▼                        │                    │                      │
[APPROVED] ────────────────► [Kod] ──────────────► [Testy] ────────────► [DONE]
     │                        │                    │                      │
     │ 2. Changes             │                    │                      │
     ◄────────────────────────┘                    │                      │
     │ (jeśli potrzeba)                             │                      │
     │                                             │                      │
     │ 3. Uaktualnij                              │                      │
     │    implemented_plans.md                     │                      │
     │◄────────────────────────────────────────────┘                      │
     │                                                                   │
     │ 4. UX Review (WF UX)                                             │
     │◄─────────────────────────────────────────────────────────────────┘
```

### 4.2 Definition of Ready (DoR)

Plan jest gotowy do implementacji gdy:

- [ ] Wszystkie sekcje wymagane przez template są wypełnione
- [ ] Acceptance Criteria są konkretne i wymierne
- [ ] Zależności od innych planów są zidentyfikowane
- [ ] UX/UI references (PDF strony) są podane
- [ ] Risks & Mitigations są opisane
- [ ] Product Owner zatwierdził (email/comment w PR)

### 4.3 Definition of Done (DoD)

Implementacja jest ukończona gdy:

- [ ] Kod implementuje 100% wymagań z planu
- [ ] Unit tests pokrywają wszystkie ścieżki (happy path + edge cases)
- [ ] UX Review (`/WF UX`) z wynikiem **Pass**
- [ ] Regression test przeszedł (nie psuje innych ekranów)
- [ ] ADHD UX criteria spełnione (friction ≤ 3 kliknięć)
- [ ] Dokumentacja zaktualizowana (`implemented_plans.md`)
- [ ] Code review approved przez Tech Lead

### 4.4 implemented_plans.md

**Lokalizacja:** `docs/plans/implemented_plans.md`

**Format wpisu:**
```markdown
## PLAN_XXX: [Tytuł]

**Status:** ✅ Implemented  
**Data implementacji:** YYYY-MM-DD  
**Zaimplementowane przez:** [Developer]  
**Przetestowane przez:** [Tester]  

**Kluczowe komponenty:**
- `src/features/xxx/Component.tsx`
- `src/services/xxxService.ts`

**Test Results:**
- UX Review: Pass ✅
- Unit Tests: X/Y passing ✅
- Regression: Pass ✅

**Notes:**
- [Dowolne uwagi post-implementacji]
```

---

## 5. Narzędzia (Tools)

### 5.1 Manual Testing

#### 5.1.1 Cascade jako Audytor UX

**Komenda:** `/WF UX`

**Proces:**
1. Cascade analizuje kod komponentu
2. Porównuje z PDF reference
3. Generuje raport w `docs/roles/ux_ui/reviews/`
4. Weryfikuje zgodność z `design-system.md`

#### 5.1.2 Chrome DevTools - Mobile Mode

**Konfiguracja:**
```
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Dimensions: Responsive
3. Width: 480px
4. Height: 800px
5. Device pixel ratio: 2
6. Touch: Enabled
```

**Co testować:**
- Layout w 480px (constraint check)
- Layout w 375px (iPhone SE - smaller screen)
- Touch targets (czy są klikalne palcem, nie myszką)
- Scroll behavior (smooth, no jitter)

### 5.2 Automated Testing

#### 5.2.1 Vitest (Unit Tests)

**Scope:** Logika biznesowa, algorytmy, utilities

**Przykład:**
```typescript
// __tests__/quizLogic.test.ts
import { classifyTask } from '@/utils/quiz';
import { describe, it, expect } from 'vitest';

describe('Brain Dump Quiz Logic', () => {
  it('classifies YES+YES as Q1', () => {
    expect(classifyTask('YES', 'YES')).toBe(1);
  });
  
  it('classifies YES+NO as Q2', () => {
    expect(classifyTask('YES', 'NO')).toBe(2);
  });
  
  it('classifies NO+YES as Q3', () => {
    expect(classifyTask('NO', 'YES')).toBe(3);
  });
  
  it('classifies NO+NO as Q4', () => {
    expect(classifyTask('NO', 'NO')).toBe(4);
  });
});
```

**Run:** `npm run test:unit`

#### 5.2.2 Dexie.js Testing (Database)

**Scope:** Persistence, CRUD, exports/imports

**Przykład:**
```typescript
// __tests__/taskPersistence.test.ts
import { db } from '@/db/dexie';

describe('Task Persistence', () => {
  beforeEach(async () => {
    await db.tasks.clear();
  });
  
  it('saves and retrieves task', async () => {
    const id = await db.tasks.add({
      title: 'Test Task',
      quadrant: 1,
      completed: false,
      createdAt: new Date(),
    });
    
    const task = await db.tasks.get(id);
    expect(task.title).toBe('Test Task');
    expect(task.quadrant).toBe(1);
  });
  
  it('exports to JSON', async () => {
    // Test export functionality
  });
});
```

**Run:** `npm run test:db`

### 5.3 Test Data Management

#### 5.3.1 Fixtures (Sample Data)

**Lokalizacja:** `tests/fixtures/`

**Przykład:** `tasks.json`
```json
{
  "sampleQ1Tasks": [
    { "title": "Wykończ raport", "quadrant": 1, "completed": false },
    { "title": "Zadzwon do klienta", "quadrant": 1, "completed": false },
    { "title": "Przygotuj prezentację", "quadrant": 1, "completed": false },
    { "title": "Odpowiedz na maile", "quadrant": 1, "completed": false },
    { "title": "Review kodu", "quadrant": 1, "completed": false }
  ],
  "sampleQ2Task": {
    "title": "Naucz się React",
    "quadrant": 2,
    "subcategory": "Projekt"
  }
}
```

#### 5.3.2 Test Scenarios

**Lokalizacja:** `docs/roles/tester/scenarios/`

**Format:** `SCENARIO_XXX_[nazwa].md`

```markdown
# SCENARIO_001: Q1 Overload Flow

**Cel:** Weryfikacja mechanizmu blokady 6. zadania w Q1

**Preconditions:**
- 5 aktywnych zadań w Q1

**Steps:**
1. Start Quiz
2. Enter: "Nowe pilne zadanie"
3. Q1: YES
4. Q2: YES
5. EXPECT: Ekran "Przeciążenie Systemu"
6. Select: "Zaplanuj w Q2"
7. EXPECT: Zadanie w Q2

**Expected Result:**
- Q1 wciąż ma 5 zadań
- Nowe zadanie w Q2
- Brak błędów

**Status:** ⬜ Not Tested | 🟡 In Progress | ✅ Pass | ❌ Fail
```

---

## 6. Raportowanie i Traceability

### 6.1 Bug Report Template

```markdown
## BUG-XXX: [Tytuł]

**Severity:** Critical / High / Medium / Low  
**Priority:** P0 / P1 / P2  
**Component:** [Komponent]  
**Plan Reference:** PLAN_XXX [sekcja]  

**Opis:**
[Dokładny opis błędu]

**Steps to Reproduce:**
1. [Krok 1]
2. [Krok 2]
3. [Krok 3]

**Expected Result:**
[Co powinno się stać - zgodnie z planem]

**Actual Result:**
[Co się stało]

**Screenshots:**
[Jeśli UI]

**Environment:**
- Browser: [Chrome/Safari/Firefox]
- Device: [Mobile/Desktop]
- Screen: [480px/375px/etc]
```

### 6.2 Traceability Matrix

| Wymaganie (Plan) | Test Case | Status | Bug |
|------------------|-----------|--------|-----|
| PLAN_002 2.2: Q1 classification | LOG-001 | ✅ Pass | - |
| PLAN_002 2.2: Q2 classification | LOG-002 | ✅ Pass | - |
| PLAN_002 3.1: Q1 Limit 5 | OL-001 | ✅ Pass | - |
| PLAN_002 3.1: Overload block | OL-002 | ❌ Fail | BUG-003 |

---

## 7. Checklist Dla Testera

Przed rozpoczęciem testowania nowego planu:

- [ ] Przeczytaj PLAN_XXX w całości
- [ ] Zidentyfikuj Acceptance Criteria
- [ ] Znajdź odpowiednie strony PDF w glossary
- [ ] Przygotuj test data (fixtures)
- [ ] Upewnij się, że poprzednie plany są oznaczone jako "Implemented"

Podczas testowania:

- [ ] Nagraj screen recording (dla UX tests)
- [ ] Policz kliknięcia (friction test)
- [ ] Sprawdź 480px na 3 rozmiarach (375, 480, 768)
- [ ] Zweryfikuj kolory w DevTools (czy z `colors.ts`)
- [ ] Przetestuj edge cases (pusta lista, max length, etc.)

Po testowaniu:

- [ ] Wypełnij UX Review raport
- [ ] Zaktualizuj traceability matrix
- [ ] Zgłoś bugi zgodnie z template
- [ ] Zaktualizuj `implemented_plans.md` jeśli wszystko OK

---

## 8. Definicje (Definitions)

| Termin | Definicja |
|--------|-----------|
| **480px Safety Net** | Twardy limit szerokości layoutu wymuszający Mobile-First UX |
| **Constraint-First Testing** | Priorytetowe testowanie ograniczeń (constraints) nad features |
| **Friction Test** | Weryfikacja liczby kroków wymaganych do wykonania akcji (target: ≤3) |
| **Spec Traceability** | Możliwość powiązania każdego testu z konkretnym wymaganiem z planu |
| **Visual Persistence** | ADHD UX principle - kluczowe info zawsze widoczne (nie wymaga pamiętania) |

---

## 9. Historia Wersji

| Data | Wersja | Autor | Zmiany |
|------|--------|-------|--------|
| 2026-05-14 | 1.0 | QA Lead | Initial testing strategy |

---

**Powiązane dokumenty:**
- `.kilocode/workflows/ux_review.md` - UX audit process
- `docs/plans/PLAN_002_brain_dump_quiz_logic.md` - Spec do testowania
- `docs/business/glossary.md` - Terminologia
- `docs/design-system.md` - Visual spec

**Next Steps:**
- [ ] Utworzyć `tests/fixtures/sampleData.json`
- [ ] Utworzyć `SCENARIO_001_q1_overload.md`
- [ ] Skonfigurować Vitest
- [ ] Przygotować test plan dla PLAN_002

