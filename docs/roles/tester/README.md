# Rola: Tester / QA Engineer - FocusFlow

> **Odpowiedzialność:** Weryfikacja zgodności ze specyfikacją (GIVEN-WHEN-THEN), testowanie ADHD UX requirements, identyfikacja edge cases w local-first środowisku.
> **Zasada:** Kod jest poprawny, gdy implementuje specyfikację - nie gdy "działa".

---

## 1. Strategia Testów (Testing Strategy)

### 1.1 Podejście: Spec-Driven Testing

**Fundamentalna Zasada:**
> "Kod jest poprawny, gdy implementuje specyfikację - nie gdy 'działa'"

Każdy test musi odnosić się do konkretnego **Acceptance Criteria (AC)** w formacie GIVEN-WHEN-THEN:

```
AC-1: Odporność na Background Throttling
GIVEN użytkownik minimalizuje kartę przeglądarki
WHEN odliczanie timera trwa w tle
THEN silnik Delta Timestamp gwarantuje precyzję (błąd ≤ 1s)
         ↓
    TEST CASE
         ↓
[TEST] AC-1: Background Throttling
- Prerequisite: Timer uruchomiony (25 min)
- Action: Zminimalizuj kartę / przełącz na inną aplikację na 5 min
- Expected: Po powrocie timer pokazuje max 24:55 (≤5s błędu)
- Pass/Fail: ___________
```

### 1.2 Hierarchia Priorytetów Testowych

| Priorytet | Co Testujemy | Jak Testujemy |
|-----------|--------------|---------------|
| **P0 - CRITICAL** | 480px Constraint, Core Flows | Manual na urządzeniach (320px-480px) |
| **P1 - HIGH** | AC Implementation | AC-by-AC verification |
| **P2 - MEDIUM** | ADHD UX Principles | Heurystyka (friction check) |
| **P3 - LOW** | Edge Cases, Performance | Unit tests / exploratory |

### 1.3 Środowisko Testowe Local-First

**Specyfika IndexedDB/Dexie.js:**

```
Test Environment Setup:
├── Chrome (desktop) - Primary
├── Chrome (mobile emulation 480px) - Primary
├── Safari (iOS) - Secondary (PWA quirks)
├── Firefox - Secondary
└── Incognito Mode - Required (IndexedDB isolation)
```

**Czyszczenie Stanu (Przed Każdym Testem):**
```javascript
// W DevTools Console
await db.delete();  // Usuń całą bazę
location.reload();  // Refresh z czystym stanem
```

---

## 2. Scenariusze Testowe & Edge Cases

### 2.1 Test Case: Przejście Timera przez Granicę Północy (Time Boxing)

**ID:** TIMER-001-EDGE  
**AC:** Timer działa poprawnie przez północ  
**Priorytet:** P2

```
GIVEN użytkownik uruchamia timer Time Boxing o 23:50 na 20 minut
WHEN zegar przechodzi przez 00:00 (północ)
THEN timer kontynuuje odliczanie poprawnie (końcowy czas: 00:10)
```

**Kroki Testowe:**
1. Ustaw systemowy czas na 23:50
2. Uruchom timer Time Boxing na 20 minut
3. Poczekaj do 00:00 (lub symuluj)
4. Sprawdź czy timer kontynuuje (nie resetuje się)
5. **Expected:** Timer kończy się o 00:10 (nie 23:50 + 20min = błąd!)

**Edge Case Scenarios:**
| Scenariusz | Oczekiwane Zachowanie |
|------------|----------------------|
| Start 23:50, duration 20min | Kończy 00:10 następnego dnia |
| Start 23:59, duration 2min | Kończy 00:01 następnego dnia |
| System time change during timer | Timer oparty na delcie = niezależny |

### 2.2 Test Case: Background Throttling (Usypianie Karty)

**ID:** TIMER-002-EDGE  
**AC:** Unix Delta Timestamp zapewnia precyzję przy throttlingu  
**Priorytet:** P1

```
GIVEN timer uruchomiony na 25 minut
WHEN użytkownik minimalizuje kartę na 5 minut (Chrome throttles setInterval)
THEN po powrocie timer pokazuje max 20:00 (≤1s błędu)
```

**Kroki Testowe:**
1. Uruchom timer na 25 minut (Standard Pomodoro)
2. Zminimalizuj kartę przeglądarki (lub przełącz na inną aplikację)
3. Poczekaj 5 minut
4. Wróć do karty
5. **Expected:** Timer pokazuje ~20:00 (nie 24:30 jak przy setInterval!)

**Mechanizm Weryfikacji:**
```javascript
// W DevTools
// Sprawdź czy timer używa Date.now() delta
// (nie setInterval countdown)
```

### 2.3 Test Case: Zapis Zadania z Pustym Stringiem w Subkategorii

**ID:** Q2-001-EDGE  
**AC:** Normalizacja null/undefined → "Inne"  
**Priorytet:** P1

```
GIVEN zadanie w Q2 bez przypisanej subkategorii (subcategory = null/undefined/"")
WHEN system grupuje zadania do szuflad
THEN zadanie automatycznie trafia do kategorii "Inne"
     bez awarii interfejsu i z widocznym licznikiem
```

**Kroki Testowe:**
1. Dodaj zadanie przez Quiz, wybierz Q2
2. Nie wybieraj subkategorii (lub wybierz, a potem usuń w bazie)
3. Przejdź do Centrum Planowania (Q2)
4. **Expected:** Zadanie widoczne w "Inne", licznik pokazuje 1, brak crashu

**Edge Case Scenarios:**
| Input | Oczekiwane Zachowanie |
|-------|----------------------|
| `subcategory: null` | Trafia do "Inne" |
| `subcategory: undefined` | Trafia do "Inne" |
| `subcategory: ""` | Trafia do "Inne" |
| `subcategory: "  "` | Trafia do "Inne" (trim) |
| Brak pola subcategory w obiekcie | Trafia do "Inne" (default) |

### 2.4 Test Case: Szybkie Klikanie w Maszynie Stanów Quizu

**ID:** QUIZ-001-EDGE  
**AC:** Brak race conditions przy szybkich interakcjach  
**Priorytet:** P1

```
GIVEN użytkownik jest w kroku 'quiz' Quizu
WHEN szybko klika przyciski Tak/Nie (double-click / triple-click)
THEN system prawidłowo rejestruje OSTATNI wybór
     i nie występuje "zombie state" lub pomięnięcie kliknięcia
```

**Kroki Testowe:**
1. Otwórz Quiz dla nowego zadania
2. Wprowadź tytuł, przejdź do pytań
3. Szybko klikaj "Tak" → "Nie" → "Tak" (w ciągu 500ms)
4. Przejdź do podsumowania
5. **Expected:** Wybrany jest OSTATNI stan ("Tak"), brak pustych odpowiedzi

**Edge Case Scenarios:**
| Scenariusz | Oczekiwane Zachowanie |
|------------|----------------------|
| Double-click na Tak | Rejestruje jedno Tak (debounce) |
| Triple-click alternatywny (T/N/T) | Rejestruje ostatnie (T) |
| Click during transition animation | Ignorowany (disabled state) |
| Very rapid navigation (Back/Next) | Zachowuje stan, nie resetuje |

---

## 3. Szczegółowe Scenariusze Testowe (Test Scenarios Catalog)

### 3.1 Timer Test Suite

| ID | Scenario | Priority | Steps | Expected |
|----|----------|----------|-------|----------|
| T-001 | Start timer | P1 | 1. Wybierz preset 25/5<br>2. Klik START | Timer running, zielony glow |
| T-002 | Pause/Resume | P1 | 1. Start timer<br>2. Pause<br>3. Resume | Czas zatrzymany, potem kontynuacja |
| T-003 | Midnight crossing | P2 | Start 23:55 na 10min | Kończy 00:05 |
| T-004 | Background throttling | P1 | Minimize 5min | Precyzyjny czas (≤1s błąd) |
| T-005 | Audio unlock | P1 | 1. Start (bez unlock)<br>2. Minimize<br>3. Wait complete | Dźwięk po unlock, nie przed |
| T-006 | 3-Way Modal | P1 | Wait for timer complete | Modal z 3 opcjami widoczny |
| T-007 | Complete task | P1 | 1. Timer complete<br>2. Click "Ukończ" | Task marked done, timer reset |
| T-008 | Another session | P1 | 1. Timer complete<br>2. Click "Jeszcze jedna" | Timer reset, task preserved |
| T-009 | Return later | P1 | 1. Timer complete<br>2. Click "Wrócę później" | Timer stop, navigate to dashboard |

### 3.2 Quiz Test Suite

| ID | Scenario | Priority | Steps | Expected |
|----|----------|----------|-------|----------|
| Q-001 | Two-question flow | P1 | 1. Enter title<br>2. Answer Q1<br>3. Answer Q2 | Quadrant calculated |
| Q-002 | Q2 subcategory | P1 | 1. Quiz → Q2<br>2. Select subcategory<br>3. Save | Task saved with subcategory |
| Q-003 | Q3 branching | P2 | 1. Quiz → Q3<br>2. Select context<br>3. Save | Task saved with context |
| Q-004 | Q4 with Forget | P2 | 1. Quiz → Q4<br>2. Click "Zapomnij" | Task NOT saved to DB |
| Q-005 | Rapid clicking | P1 | Triple-click answers | Last selection registered |
| Q-006 | Key-based remount | P1 | 1. Open Quiz for Task A<br>2. Close<br>3. Open for Task B | Clean state (no zombie) |
| Q-007 | Pre-fill title | P1 | 1. Create task in Q0<br>2. Click "Kwalifikuj" | Title pre-filled in Quiz |

### 3.3 Q2 Sub-Matrix Test Suite

| ID | Scenario | Priority | Steps | Expected |
|----|----------|----------|-------|----------|
| S-001 | 2x2 layout | P1 | Open Centrum Planowania | 4 boxes visible: Rutyny, Projekty, Cele, Inne |
| S-002 | Uniform h-14 | P1 | Check all 4 headers | All h-14 (56px), uniform alignment |
| S-003 | Null → Inne | P1 | Add task without subcategory | Appears in "Inne" box |
| S-004 | ViewMode switch | P1 | 1. Main Matrix<br>2. Click "Centrum Planowania"<br>3. Click "Powrót" | Smooth switch grid ↔ q2 |
| S-005 | Quiz bypass | P1 | 1. In Q2, click "+ Dodaj"<br>2. Enter title | Skip questions, go to subcategory |
| S-006 | Laser glow | P1 | Check box borders | Sharp neon glow (not blur) |
| S-007 | Counters | P1 | Add tasks to each subcategory | Counters update in headers |

### 3.4 Q0 Inbox Test Suite

| ID | Scenario | Priority | Steps | Expected |
|----|----------|----------|-------|----------|
| I-001 | Serial dump | P1 | 1. Enter text<br>2. Press Enter<br>3. Repeat ×3 | All 3 tasks in Q0, textarea cleared each time |
| I-002 | Q0 isolation | P1 | 1. Add task to Q0<br>2. Check Main Matrix | Task NOT visible in Q1-Q4 |
| I-003 | Badge counter | P1 | Add 3 tasks to Q0 | Badge on Inbox shows "3" |
| I-004 | Pre-fill Quiz | P1 | 1. Create task in Q0<br>2. Click "Kwalifikuj" | Quiz opens with title pre-filled |

---

## 4. ADHD UX Heurystyki (ADHD Testing Heuristics)

### 4.1 Friction Checklist

| Pytanie | Test | Pass Criteria |
|---------|------|---------------|
| Czy ten flow wymaga myślenia? | Dodaj zadanie | Max 3 kliknięcia bez decyzji |
| Czy to jest "idiotoodporne"? | Random clicks | Brak crashu, graceful handling |
| Czy użytkownik może się zablokować? | Quiz flow | Zawsze exit path (wstecz/zamknij) |
| Czy jest visual persistence? | Q1 na pulpicie | Q1 zawsze widoczne (nie schowane) |
| Czy jest instant feedback? | Każda akcja | Visual change w <100ms |

### 4.2 Compassion Checklist

| Pytanie | Test | Pass Criteria |
|---------|------|---------------|
| Brak shame language? | Error messages | "Nie teraz" zamiast "Błąd" |
| Brak guilt-tripping? | Timer modal | 3 opcje, bez „musisz" |
| Reset bez winy? | Streak (Faza 3) | „Nowy start" nie „porażka" |
| Gentle reminders? | Notifications | Bez urgency, bez red badges |

---

## 5. Key Documents & Deliverables

### 5.1 Kluczowe Dokumenty

| Dokument | Cel |
|----------|-----|
| [`docs/plans/02_features/`](../../plans/02_features/) | AC do weryfikacji |
| [`docs/roles/tester/strategy.md`](./strategy.md) | Szczegółowa strategia QA |
| [`docs/roles/tester/reports/`](./reports/) | Verification reports |
| [`implemented_plans.md`](../../../implemented_plans.md) | Rejestr testów |

### 5.2 Deliverables

- **Verification Reports** - dla każdego zakończonego planu
- **Bug Reports** - z referencją do AC (które AC nie przechodzi?)
- **Sign-off** - przed release (QA approval)

### 5.3 Struktura Verification Report

```markdown
# Verification Report: FEAT_003_Centrum_Planowania

## Podsumowanie
- **Plan:** Q2 Sub-Matrix
- **Tester:** [Imię]
- **Data:** 2026-05-17
- **Wynik:** ✅ PASS / ❌ FAIL

## Wyniki AC

| AC | Opis | Status | Uwagi |
|----|------|--------|-------|
| AC-1 | Sub-Matryca 2x2 | ✅ PASS | 4 szuflady widoczne |
| AC-2 | h-14 headers | ✅ PASS | Uniform alignment |
| AC-3 | whitespace-nowrap | ✅ PASS | Brak łamania słów |
| AC-4 | Null → Inne | ✅ PASS | Fallback działa |
| AC-5 | viewMode switching | ✅ PASS | Płynne przejścia |
| AC-6 | Quiz bypass | ✅ PASS | Pomija pytania |

## Edge Cases Testowane

| Case | Wynik | Uwagi |
|------|-------|-------|
| Pusta subkategoria | ✅ PASS | Trafia do "Inne" |
| Szybkie klikanie | ✅ PASS | Debounce działa |
| Resize do 320px | ✅ PASS | Layout responsywny |

## Rekomendacje
- Brak zastrzeżeń / Zastrzeżenia: [opis]
```

---

## 6. Workflow Testera

```
1. RECEIVE PLAN
   └── Otrzymanie planu (FEAT_*) do weryfikacji
   └── Przeczytanie wszystkich AC
                    ↓
2. PREPARATION
   └── Setup test environment (clean IndexedDB)
   └── Przygotowanie test cases (z planu)
   └── Identification of edge cases
                    ↓
3. EXECUTION
   └── Testy manualne (AC-by-AC)
   └── Edge cases testing
   └── 480px constraint verification
   └── ADHD UX heuristics
                    ↓
4. DOCUMENTATION
   └── Verification report
   └── Bug reports (jeśli AC nie przechodzi)
   └── Sign-off lub Reject
                    ↓
5. HANDOVER
   └── Przekazanie wyników do PO/Dev
   └── Retest po fixach (jeśli były bugi)
```

---

**Zasada:** "Testujemy spełnienie specyfikacji, nie 'działanie kodu'. Bug = kod nie zgadza się ze specyfikacją."

