# Strategia Testowania (Testing Strategy)

> Spec-Driven Testing Philosophy  
> Document ID: TEST-STRATEGY-001  
> Status: APPROVED  
> Date: 2026-05-19  
> Owner: QA Lead / Senior Frontend Architect

---

## 1. Filozofia: Spec-Driven Testing

### 1.1 Definicja

> **Spec-Driven Testing** - podejście w którym testy są projektowane bezpośrednio na podstawie specyfikacji PLAN_*.md, a Acceptance Criteria (AC) są jedynym źródłem prawdy dla definicji "done".

### 1.2 Zasady Fundamentalne

| # | Zasada | Implementacja |
|---|--------|---------------|
| 1 | **AC jako Definition of Done** | Funkcjonalność jest "gotowa" gdy WSZYSTKIE AC są spełnione i zweryfikowane |
| 2 | **Traceability** | Każdy test case MUSI odnosić się do konkretnego AC z planu |
| 3 | **No Assumptions** | Tester nie zakłada "jak powinno działać" - sprawdza "co jest napisane w spec" |
| 4 | **Spec over Code** | Jeśli kod ≠ spec, kod jest błędny (nie spec) |
| 5 | **Documentation-first** | Bug report bez referencji do AC jest niekompletny |

### 1.3 Flow Spec-Driven Testing

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SPEC-DRIVEN TESTING FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. READ PLAN                                                           │
│     └── Otwórz docs/plans/PLAN_<feature>.md                             │
│     └── Zidentyfikuj sekcję "Kryteria Akceptacji (AC)"                 │
│     └── Zanotuj numerację AC (AC-1, AC-2, ...)                         │
│                       ↓                                                 │
│  2. DESIGN TEST CASES                                                   │
│     └── Dla każdego AC: stwórz 1+ test case                            │
│     └── Test case ID: TEST-<PLAN_ID>-<AC_NUM>-<SEQ>                    │
│     └── Przykład: TEST-ARCH-001-AC3-01                                 │
│                       ↓                                                 │
│  3. EXECUTE TESTS                                                       │
│     └── Uruchom testy manualne/automatyczne                            │
│     └── Zbieraj evidence (screenshots, recordings)                   │
│     └── Zapisz actual vs expected result                               │
│                       ↓                                                 │
│  4. REPORT RESULTS                                                      │
│     └── Pass: Link do AC, evidence, date                              │
│     └── Fail: Link do AC, bug report ID, severity                       │
│                       ↓                                                 │
│  5. TRACEABILITY MATRIX UPDATE                                          │
│     └── Zaktualizuj docs/tester/traceability_matrix.md               │
│     └── AC status: PASS / FAIL / BLOCKED                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Podejście: Constraint-First

### 2.1 Definicja

> **Constraint-First Testing** - priorytetowe testowanie ograniczeń (constraints) technicznych i UX przed testowaniem funkcjonalności.

### 2.2 Hierarchia Priorytetów

```
P0 - CRITICAL (Must Pass)
├── 430px Constraint Check (viewport compliance)
├── TypeScript Strict Mode (zero errors)
├── Build Success (production build)
└── Core Flow Integrity (timer, task creation, quiz)

P1 - HIGH (Should Pass)
├── AC Implementation (Acceptance Criteria)
├── ADHD UX Heuristics (friction, clarity)
└── Mobile-First UI (touch targets, thumb zones)

P2 - MEDIUM (Nice to Have)
├── Edge Cases (empty states, max length)
├── Performance (< 100ms render)
└── Cross-browser (Safari, Firefox)

P3 - LOW (Deferred)
├── Exploratory testing
├── Visual regression
└── Accessibility audit (screen readers)
```

### 2.3 430px Safety Net (Pro Max Standard)

**Twardy limit szerokości layoutu wymuszający Mobile-First UX.**

#### 2.3.1 Wymagania Viewport

| Wymaganie | Wartość | Uzasadnienie |
|-----------|---------|--------------|
| **Max Width** | 430px | iPhone 14/15 Pro Max |
| **Max Height** | 932px | iPhone 14/15 Pro Max |
| **Padding X** | 16px (px-4) | Consistent spacing |
| **Touch Target** | ≥ 44×44px | Apple HIG compliance |

#### 2.3.2 Checklist Viewport Testing

```markdown
## 430px Constraint Verification Checklist

### Setup
- [ ] Chrome DevTools: Device Toolbar ON
- [ ] Dimensions: Responsive
- [ ] Width: 430px
- [ ] Height: 932px (lub 800px dla mniejszych ekranów)
- [ ] DPR: 2.0 (Retina)
- [ ] Touch: Enabled

### Verification Points
- [ ] **Width Check**: `max-w-[430px]` na wszystkich ekranach
- [ ] **Centering Check**: `mx-auto` (content wycentrowany)
- [ ] **Height Check**: `min-h-screen` (brak cut-off)
- [ ] **Overflow Check**: Brak horizontal scroll
- [ ] **Touch Targets**: Wszystkie interactive ≥ 44×44px
- [ ] **Thumb Zones**: Primary actions w dolnej 1/3 ekranu

### Responsive Breakpoints (Desktop Frame)
- [ ] `min-[480px]:` - Ramka urządzenia widoczna
- [ ] `min-[768px]:` - Centered device mockup
- [ ] `< 430px`: Scale down zachowuje proporcje
```

#### 2.3.3 Test Environment Matrix

| Urządzenie | Width | Height | Priority |
|------------|-------|--------|----------|
| iPhone 14/15 Pro Max | 430px | 932px | **P0 - CRITICAL** |
| iPhone SE | 375px | 667px | P1 - HIGH |
| iPhone 12/13/14 | 390px | 844px | P1 - HIGH |
| iPhone 14 Plus | 428px | 926px | P1 - HIGH |
| Desktop Chrome | 430px frame | - | P0 - CRITICAL |

---

## 3. Heurystyki ADHD UX

### 3.1 Definicja

> **ADHD UX Heuristics** - zestada reguł ewaluacji interfejsu pod kątem redukcji poznawczego obciążenia dla użytkowników z ADHD.

### 3.2 Reguły Heurystyczne

| ID | Heurystyka | Opis | Test Method |
|----|-----------|------|-------------|
| H1 | **Friction Reduction** | Minimalna liczba kroków do celu (≤3) | Friction Test |
| H2 | **Visual Persistence** | Stabilne pozycje elementów (nie "skaczą") | Visual Stability Test |
| H3 | **Decision Support** | Jasne wskazówki przy wyborach | Decision Clarity Test |
| H4 | **Immediate Feedback** | Instant response na akcje (<100ms) | Latency Test |
| H5 | **Chunking** | Grupowanie powiązanych elementów | Cognitive Load Test |
| H6 | **Error Prevention** | Undo zamiast confirm | Error Recovery Test |

### 3.3 Friction Test (Licznik Kliknięć)

**Definicja:** Pomiar liczby interakcji (kliknięć/dotknięć) wymaganych do osiągnięcia celu.

**Target:** ≤ 3 kliknięcia dla primary flows

**Test Procedure:**

```markdown
## Friction Test Procedure

### Flow: Dodanie Zadania do Q1
1. Start: Ekran główny (Matrix)
2. Krok 1: Kliknij "+" (Add Task)
3. Krok 2: Wypełnij tytuł + quiz (jeśli bypass) 
4. Krok 3: Potwierdź (Confirm)
5. End: Zadanie widoczne w Q1

**Wynik:** 3 kliknięcia ✅ PASS (target: ≤3)

### Flow: Rozpoczęcie Timera
1. Start: Ekran główny
2. Krok 1: Kliknij zadanie w Q1
3. Krok 2: Wybierz preset (lub start default)
4. Krok 3: Kliknij START
**Wynik:** 3 kliknięcia ✅ PASS

### Flow: Przeniesienie do Q4 (Hatch)
1. Start: Ekran zadania Q4
2. Krok 1: Kliknij "Zapomnij" (Hatch button)
3. Krok 2: Potwierdź destructive action (opcjonalnie)
**Wynik:** 1-2 kliknięcia ✅ PASS
```

### 3.4 Visual Stability Test

**Definicja:** Weryfikacja czy elementy interfejsu pozostają na stabilnych pozycjach podczas interakcji.

**Anti-pattern (Bad):**
```
Kliknięcie przycisku → Elementy "skaczą" (reflow layoutu)
Scroll → Header znika (nie sticky)
Modal otwarty → Tło scrolluje się (double scroll)
```

**Pattern (Good):**
```
Kliknięcie przycisku → Tylko ten element reaguje (lub modal się otwiera)
Scroll → Header sticky na górze
Modal otwarty → Tło frozen (overflow: hidden na body)
```

### 3.5 Decision Clarity Test

**Definicja:** Weryfikacja czy użytkownik ma wystarczająco informacji aby podjąć decyzję bez zastanawiania się.

**Checklist:**
```markdown
## Decision Clarity Checklist

- [ ] **Labels are clear**: "Zapomnij" zamiast "Archive"
- [ ] **Visual hierarchy**: Primary action najbardziej widoczny
- [ ] **Context provided**: Użytkownik wie "gdzie jest" (breadcrumbs/header)
- [ ] **Consequences clear**: Destructive actions mają warning
- [ ] **No ambiguity**: "Tak/Nie" zamiast "OK/Cancel"
- [ ] **Progress indication**: W quizie - widać który krok (1/4)
```

---

## 4. Metody Testowania

### 4.1 Manual Testing (Primary)

**Device Testing:**
- Real devices: iPhone 14/15 Pro Max (430px)
- Emulation: Chrome DevTools (320px - 430px range)
- PWA: Installed app mode (offline capability)

**Exploratory Testing:**
- Session-based: 90-minute sessions
- Charters: "Explore timer feature with interruptions"
- Bug hunts: Focus on edge cases

### 4.2 Automated Testing (Secondary)

**Unit Tests:**
- Business logic: `calculateQuadrant()`, `classifyTask()`
- Utilities: `formatDuration()`, `normalizeSubcategory()`

**Integration Tests:**
- Dexie.js CRUD operations
- Timer Context state transitions
- Quiz state machine

**E2E Tests (Playwright):**
- Critical paths: Add task → Start timer → Complete
- 430px viewport constraint
- Offline mode simulation

### 4.3 Checklist-Based Testing

```markdown
## Pre-Release Testing Checklist

### P0 - CRITICAL (Must Pass)
- [ ] 430px constraint na wszystkich ekranach
- [ ] TypeScript `tsc --noEmit` zero errors
- [ ] Build `npm run build` success
- [ ] Core flows: Task CRUD, Timer, Quiz
- [ ] PWA offline functionality

### P1 - HIGH (Should Pass)
- [ ] All AC from active PLAN_* verified
- [ ] Friction test ≤3 clicks for primary flows
- [ ] Touch targets ≥44px
- [ ] Visual stability (no "jumps")
- [ ] Decision clarity (labels, context)

### P2 - MEDIUM (Nice to Have)
- [ ] Edge cases: Empty states, max length
- [ ] Performance: <100ms render, <50ms HMR
- [ ] Cross-browser: Safari, Firefox
- [ ] Keyboard navigation

### P3 - LOW (Deferred)
- [ ] Screen reader compatibility
- [ ] Color contrast audit
- [ ] Animation smoothness 60fps
```

---

## 5. Definicje i Metryki

### 5.1 Słownik Terminów

| Termin | Definicja |
|--------|-----------|
| **430px Safety Net** | Twardy limit szerokości layoutu wymuszający Mobile-First UX (Pro Max Standard) |
| **Constraint-First Testing** | Priorytetowe testowanie ograniczeń (constraints) nad features |
| **Friction Test** | Weryfikacja liczby kroków wymaganych do wykonania akcji (target: ≤3) |
| **Spec Traceability** | Możliwość powiązania każdego testu z konkretnym wymaganiem z planu |
| **ADHD UX Heuristics** | Reguły ewaluacji UI pod kątem redukcji poznawczego obciążenia |
| **AC (Acceptance Criteria)** | Kryteria akceptacji - definicja "done" dla funkcjonalności |
| **Spec-Driven Testing** | Podejście gdzie testy są projektowane bezpośrednio z specyfikacji |

### 5.2 Metryki Jakości

| Metryka | Target | Measurement |
|---------|--------|-------------|
| **AC Coverage** | 100% | (AC tested / Total AC) × 100% |
| **Pass Rate** | ≥95% | (Tests passed / Total tests) × 100% |
| **Critical Defects** | 0 | P0 bugs before release |
| **Friction Score** | ≤3 | Avg clicks for primary flows |
| **Viewport Compliance** | 100% | Screens with 430px constraint |

---

## 6. Traceability Matrix

### 6.1 Format

```markdown
| Plan | AC ID | Test ID | Status | Evidence | Date |
|------|-------|---------|--------|----------|------|
| PLAN_Q2 | AC-1 | TEST-Q2-001 | ✅ PASS | screenshot_001.png | 2026-05-19 |
| PLAN_Q2 | AC-2 | TEST-Q2-002 | ❌ FAIL | BUG-042 | 2026-05-19 |
```

### 6.2 Aktualizacja

**Trigger:** Każdy test execution
**Responsible:** QA Lead / Tester
**Location:** `docs/tester/traceability_matrix.md`

---

## 7. Workflow Testera

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TESTER WORKFLOW (SDD)                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. PREPARATION                                                         │
│     └── Odczytaj PLAN_*.md (focus na AC)                              │
│     └── Sprawdź 430px constraint w makiety.md                         │
│     └── Przygotuj test environment (Chrome DevTools)                  │
│                       ↓                                                 │
│  2. CONSTRAINT-FIRST CHECK                                              │
│     └── P0: 430px viewport verification                               │
│     └── P0: TypeScript strict mode                                      │
│     └── P0: Build success                                               │
│     └── If any P0 fails → STOP, report critical bug                  │
│                       ↓                                                 │
│  3. AC-BY-AC TESTING                                                    │
│     └── Dla każdego AC: execute test case                               │
│     └── Record: PASS / FAIL / BLOCKED                                 │
│     └── Collect evidence (screenshots)                                  │
│                       ↓                                                 │
│  4. ADHD UX HEURISTICS                                                   │
│     └── Friction test (≤3 clicks)                                     │
│     └── Visual stability check                                          │
│     └── Decision clarity evaluation                                     │
│                       ↓                                                 │
│  5. DOCUMENTATION                                                       │
│     └── Update traceability matrix                                      │
│     └── Create bug reports (link to AC)                               │
│     └── Verification report for feature                               │
│                       ↓                                                 │
│  6. SIGN-OFF                                                            │
│     └── All P0 passed → Proceed to P1/P2                               │
│     └── All AC passed → Feature ready for merge                        │
│     └── Any critical bug → Block merge, escalate                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

**Document ID:** TEST-STRATEGY-001  
**Owner:** QA Lead / Senior Frontend Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-19  
**Viewport:** 430px Pro Max Standard
