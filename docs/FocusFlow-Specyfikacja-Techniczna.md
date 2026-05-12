# FocusFlow – Matrix Planner
## Techniczna Specyfikacja Funkcjonalna i Logiczna — **wersja 2.1**

**Dokument fundament pod development.** Pomija parametry wizualne (padding, font-size, colors). Skupia się wyłącznie na **interakcjach (Triggers)**, **warunkach (Conditions)** i **wynikach (Outputs)**. Spójny z dokumentami źródłowymi: `FocusFlow-Mapa-Nawigacji.md` oraz zedytowaną logiką w `Dokument bez tytułu.md`.

### Changelog v2.1
1. **Ujednolicenie nazewnictwa:** `Category: 'Rutyna'` → `Category: 'Habit'` w całej warstwie kodu/logiki (UI labels „Nawyki/Rutyna" zachowane).
2. **Sekcja 11.2** (nowa) — Logika Agregacji „Wszystko na dzisiaj" (Ekran 24 jako widok wirtualny).
3. **Sekcja 6.4** rozszerzona — `resources` jako tablica, natychmiastowa aktualizacja UI bez refresha.
4. **Sekcja 5.4** (nowa) — Informacja zwrotna i animacja dla akcji Context Menu.
5. **Sekcja 16** (nowa) — User Flow State Diagram dla modułu Brain Dump.

---

## 1. Model Danych i Stany (State Management)

### 1.1. Encja `Task` (Zadanie)

```typescript
type Quadrant = 'I' | 'II' | 'III' | 'IV';
type Category =
  | 'Habit'         // wewn. enum; UI: „Nawyki/Rutyna" (widok 21)
  | 'WielkiProjekt'
  | 'Inne'
  | 'Rozrywka'      // Q4 sub-category
  | 'Hobby'         // Q4
  | 'SideQuest'     // Q4
  | 'Optymalizacja'; // Q4
type Strategy = 'ZrobTeraz' | 'WPrzerwie' | 'ZaplanujBlok'; // Q3 only
type TerminType = 'TerminRealizacji' | 'DoniesienieProjektu';
type DayOfWeek = 'Pn' | 'Wt' | 'Sr' | 'Cz' | 'Pt' | 'Sb' | 'Nd';

interface MicroStep {
  id: string;
  text: string;
  isDone: boolean;
}

interface Resource {
  id: string;
  type: 'link' | 'file';
  name: string;       // np. "Link do Figmy"
  url?: string;       // gdy type=link
  filePath?: string;  // gdy type=file
}

interface Task {
  id: string;
  title: string;
  description: string | null;

  // Klasyfikacja
  quadrant: Quadrant;            // I, II, III, IV
  category: Category | null;     // null dla Q1 (nie wymagana)
  isImportant: boolean;          // wynik quizu (ważność)
  isUrgent: boolean;             // wynik quizu (pilność)

  // Strategia Q3 (tylko gdy quadrant=III)
  strategy: Strategy | null;

  // Termin
  terminType: TerminType | null;   // tylko gdy category=WielkiProjekt|Inne
  scheduledDate: ISODate | null;   // konkretna data z kalendarza
  scheduledTime: 'AllDay' | HHMM;  // "Cały dzień" lub "14:30"
  recurringDays: DayOfWeek[];      // niepusty gdy category=Habit lub TerminType=TerminRealizacji

  // Sub-elementy
  microSteps: MicroStep[];
  resources: Resource[];
  noteContent: string;          // pole NOTATKA z ekranu 28

  // Automatyzacja (Wsparcie ADHD)
  autoEscalate: boolean;        // czy aktywna eskalacja
  escalateDaysBefore: 2 | 3 | 7; // ile dni przed terminem przerzucić do Q1

  // Stan
  isDone: boolean;
  isRejected: boolean;          // z popupu 26 "ODRZUĆ / ZAPOMNIJ"
  createdAt: ISODateTime;
  completedAt: ISODateTime | null;
  sessionsCount: number;        // dla WielkiProjekt — liczba ukończonych sesji Focus
}
```

### 1.2. Encja `BrainDumpNote`

```typescript
interface BrainDumpNote {
  id: string;
  text: string;
  type: 'unsorted' | 'sorted'; // określa kolor ramki (zielony/fioletowy)
  createdAt: ISODateTime;
  promotedToTaskId: string | null; // gdy zostanie sklasyfikowana przez 03
}
```

### 1.3. Encja `FocusSession`

```typescript
interface FocusSession {
  id: string;
  taskId: string;              // bieżące zadanie
  mode: '25/5' | '50/10' | '5/0' | '10/5' | '15/5' | '35/5' | '90/15';
  startedAt: ISODateTime;
  endedAt: ISODateTime | null;
  pausedDurationMs: number;
  completedCycles: number;     // 0–4 (kropki postępu)
  endedEarly: boolean;         // true gdy "Zakończ sesję" < 1/4 czasu trwania
}
```

### 1.4. Stany Globalne (Global State)

```typescript
interface AppState {
  currentDate: ISODate;

  // Liczniki dynamiczne
  dopamineStreakCount: number;          // ekran 01 + 09 hero card
  totalFocusTimeToday: Duration;        // ekran 04 pasek "Dzisiaj"

  // Limit ćwiartki I (TWARDA BLOKADA)
  quadrant_I_Count: number;             // 0–5

  // Sesja Focus
  currentFocusSession: FocusSession | null;

  // Liczniki raportowe
  rejectedTasksThisMonth: number;       // ekran 08 + 11 (counter dla Q4)
  completedTasksByQuadrant: {
    week:  { I: number; II: number; III: number; IV: number };
    month: { I: number; II: number; III: number; IV: number };
  };

  // Repozytoria
  tasks: Task[];
  brainDumpNotes: BrainDumpNote[];
  focusSessionsHistory: FocusSession[];
}
```

### 1.5. System Overload — Blokada Ćwiartki I

**Reguła:** `quadrant_I_Count >= 5` blokuje dodanie kolejnego zadania do Q1.

```pseudocode
function tryAssignToQuadrantI(task: Task): Result {
  if (state.quadrant_I_Count >= 5) {
    return { blocked: true, redirectTo: 'Screen10_ErrorOverload' };
  }
  task.quadrant = 'I';
  state.quadrant_I_Count++;
  return { blocked: false };
}
```

---

## 2. Silnik Decyzyjny Quizu (Logic Engine)

### 2.1. Trigger
Klik strzałki "►" pod każdym z toggle'ów ("Ważność" / "Pilność") na ekranie **03 Brain Dump – formularz**.

### 2.2. Pytania

**Quiz Ważność (3 pytania):**
1. `Q_W1`: "Czy wykonanie tego zadania przybliża Cię do Twoich głównych celów na ten miesiąc/rok?"
2. `Q_W2`: "Czy to zadanie buduje fundament pod Twoją przyszłość (np. zdrowie, finanse, oceny, relacje)?"
3. `Q_W3`: "Czy za tydzień będziesz żałować, że nie poświęciłeś/aś czasu na tę konkretną rzecz?"

**Quiz Pilność (3 pytania):**
1. `Q_P1`: "Czy masz 'twardy' termin realizacji (deadline), który upływa w ciągu najbliższych dni?"
2. `Q_P2`: "Czy zignorowanie tego zadania wywoła natychmiastowy, realny problem (np. kara, konflikt, utrata punktów)?"
3. `Q_P3`: "Czy ktoś inny czeka na efekt Twojej pracy, aby móc ruszyć ze swoimi zadaniami?"

### 2.3. Funkcja `processQuiz`

```pseudocode
function processQuiz(answers: QuizAnswers): { quadrant: Quadrant } {
  // Wagi punktowe: TAK = +1, NIE = 0
  const importantScore = sum(answers.W1, answers.W2, answers.W3); // 0..3
  const urgentScore    = sum(answers.P1, answers.P2, answers.P3); // 0..3

  const isImportant = importantScore >= 2;   // ">1 odpowiedzi TAK"
  const isUrgent    = urgentScore    >= 2;

  if      ( isImportant &&  isUrgent) return { quadrant: 'I'  };
  else if ( isImportant && !isUrgent) return { quadrant: 'II' };
  else if (!isImportant &&  isUrgent) return { quadrant: 'III'};
  else                                return { quadrant: 'IV' };
}
```

### 2.4. Aktualizacja pigułki "Trafia do…"

Pigułka informacyjna na ekranie 03 jest **stanem reaktywnym** — pusta przed quizem, po każdej odpowiedzi przelicza `processQuiz()` i renderuje:

```pseudocode
on each quiz answer change:
  const { quadrant } = processQuiz(state.draftTask.answers);
  pigulkaTrafia.text = `→ Trafia do: ${labelForQuadrant(quadrant)} (Ćwiartka ${quadrant})`;
  state.draftTask.quadrant = quadrant;
```

### 2.5. Procesy Po-Quizowe (CTA "DODAJ ZADANIE")

Klik "DODAJ ZADANIE" na ekranie 03 wykonuje routing zależny od `draftTask.quadrant`:

```pseudocode
function onClickAddTask(draftTask: Task) {
  switch (draftTask.quadrant) {
    case 'I':
      if (state.quadrant_I_Count >= 5)
        navigate('Screen10_ErrorOverload', { task: draftTask });
      else {
        commitTask(draftTask);
        navigate('Screen01_Pulpit');
      }
      break;

    case 'II':
      navigate('Screen27_Categorize2', { task: draftTask });
      break;

    case 'III':
      navigate('Screen25_PickStrategy', { task: draftTask });
      break;

    case 'IV':
      navigate('Screen26_Categorize4', { task: draftTask });
      break;
  }
}
```

### 2.6. Logika Popupu 27 (Q2 — Ważne, Niepilne)

Trigger: wejście z `processQuiz → II` lub z ekranu 10 (przycisk "Przenieś do: Zaplanuj (II)").

```pseudocode
function onScreen27Submit(task: Task, category: 'RUTYNA'|'PROJEKT'|'INNE', planNow: 'TAK'|'NIE') {
  // mapCategoryQ2: UI label 'RUTYNA' → enum 'Habit'; 'PROJEKT' → 'WielkiProjekt'; 'INNE' → 'Inne'
  task.category = mapCategoryQ2(category); // Habit|WielkiProjekt|Inne

  if (planNow === 'TAK') {
    navigate('Screen18_AddTask', { prefilled: task });
  } else {
    // planNow === 'NIE'
    switch (task.category) {
      case 'Habit':
        appendToList('Screen21_Nawyki', task);
        break;
      case 'WielkiProjekt':
        appendToList('Screen22_WielkieProjekty', task);
        break;
      case 'Inne':
        appendToList('Screen23_Inne', task, { sectionId: 'NIEPRZYPISANE' });
        break;
    }
    commitTask(task);
    navigate('Screen01_Pulpit'); // close popup
  }
}
```

### 2.7. Logika Popupu 25 (Q3 — Pilne, Nieważne / Proza Życia)

```pseudocode
function onScreen25Submit(task: Task, strategy: Strategy) {
  task.strategy = strategy;
  task.quadrant = 'III';

  const sectionId = {
    ZrobTeraz:    'Od_razu',
    WPrzerwie:    'W_przerwie',
    ZaplanujBlok: 'W_zaplanowanym_bloku',
  }[strategy];

  appendToList('Screen07_ProzaZycia', task, { sectionId });
  commitTask(task);
  navigate('Screen07_ProzaZycia'); // pokazuje świeżo dodane zadanie
}
```

### 2.8. Logika Popupu 26 (Q4 — Niepilne, Nieważne)

```pseudocode
function onScreen26Submit(task: Task, action: 'Rozrywka'|'Hobby'|'SideQuest'|'Optymalizacja'|'ODRZUC') {
  task.quadrant = 'IV';

  if (action === 'ODRZUC') {
    task.isRejected = true;
    state.rejectedTasksThisMonth++;
    appendToList('Screen11_AktywnoscDnia', task, {
      dayId: today,
      sectionId: 'Niepilne_niewazne',
      subsection: 'Odrzucone',
    });
    navigate('Screen01_Pulpit');
  } else {
    task.category = action; // Rozrywka|Hobby|SideQuest|Optymalizacja
    appendToList('Screen08_Archiwum', task, { sectionId: action });
    commitTask(task);
    navigate('Screen01_Pulpit'); // close popup, brak narysowanej ścieżki — domyślnie Pulpit
  }
}
```

---

## 3. Logika Dynamicznego Formularza (Ekran 18 Dodaj Zadanie)

### 3.1. Warunkowe Renderowanie Sekcji

Stan formularza zależy od kombinacji `category` i `terminType`:

```pseudocode
interface FormState {
  title: string;
  category: 'Habit' | 'WielkiProjekt' | 'Inne' | null;
  terminType: 'TerminRealizacji' | 'DoniesienieProjektu' | null;
  recurringDays: DayOfWeek[];
  scheduledDate: ISODate | null;
  scheduledTime: 'AllDay' | HHMM;
  escalateDaysBefore: 2 | 3 | 7;
}

function renderForm(state: FormState) {
  show(InputTitle);
  show(SegmentCategory); // 3 pigułki (UI: „Rutyna / Wielki Projekt / Inne"; enum: Habit/WielkiProjekt/Inne)

  // --- Sekcja TYP TERMINU ---
  if (state.category === 'Habit') {
    show(SegmentTerminType, { onlyPill: 'TerminRealizacji', locked: true });
    show(WeekdayPicker);        // 7 kółek Pn–Nd
    hide(CalendarLinkButton);
    hide(CalendarBigButton);
  }
  else if (state.category === 'WielkiProjekt' || state.category === 'Inne') {
    show(SegmentTerminType, { pills: ['TerminRealizacji', 'DoniesienieProjektu'] });

    if (state.terminType === 'TerminRealizacji') {
      show(WeekdayPicker);                  // 7 kółek
      show(CalendarLinkButton, { label: '📅 Wybierz konkretną datę w kalendarzu' });
      hide(CalendarBigButton);
    }
    else if (state.terminType === 'DoniesienieProjektu') {
      hide(WeekdayPicker);                  // USUŃ siatkę dni
      hide(CalendarLinkButton);
      show(CalendarBigButton, { label: 'WYBIERZ TERMIN W KALENDARZU ➔' });
    }
  }
  else {
    // category === null — żadna sekcja TYP TERMINU
    hide(SegmentTerminType);
    hide(WeekdayPicker);
    hide(CalendarLinkButton);
    hide(CalendarBigButton);
  }

  show(SegmentCzas);             // "Cały dzień" / time picker
  show(CardSupportADHD);         // 7/3/2 dni eskalacji
  show(CTAZapiszWKalendarzu);
}
```

### 3.2. Tablica Decyzyjna (Variants 31/32/33 z projektu)

| `category`     | `terminType`         | WeekdayPicker | CalendarLinkButton | CalendarBigButton | Wariant |
|---|---|---|---|---|---|
| Habit          | (auto) TerminRealizacji | ✔ | ✘ | ✘ | **31** (V1) |
| WielkiProjekt  | TerminRealizacji     | ✔ | ✔ | ✘ | **32** (V2) |
| Inne           | TerminRealizacji     | ✔ | ✔ | ✘ | **32** (V2) |
| WielkiProjekt  | DoniesienieProjektu  | ✘ | ✘ | ✔ | **33** (V3) |
| Inne           | DoniesienieProjektu  | ✘ | ✘ | ✔ | **33** (V3) |

> **UI note:** segmented control wyświetla „Rutyna" jako etykietę pierwszej pigułki, ale wartość zapisywana w `state.category` to enum `'Habit'`.

### 3.3. Zachowanie Przycisku Kalendarza

```pseudocode
function onClickCalendarButton(context: 'link' | 'big') {
  // Otwiera modal kalendarza (date picker). Po wyborze daty:
  formState.scheduledDate = pickedDate;

  if (context === 'link') {
    // Wariant 2: data dodatkowa do siatki recurringDays
    formState.recurringDays = formState.recurringDays; // pozostawione
  }
  if (context === 'big') {
    // Wariant 3: tylko konkretna data, brak recurringDays
    formState.recurringDays = [];
  }
}
```

### 3.4. Walidacja CTA "ZAPISZ W KALENDARZU"

```pseudocode
function onClickSave(form: FormState): Result {
  if (form.scheduledTime !== 'AllDay' && !isValidHHMM(form.scheduledTime)) {
    showErrorState('Screen19_TimeError');
    return { saved: false };
  }
  if (overlapsExistingRoutine(form)) {
    showErrorState('Screen19_TimeError', { reason: 'overlap' });
    return { saved: false };
  }

  const task = commitTask({
    title:        form.title,
    category:     form.category,
    terminType:   form.terminType,
    recurringDays: form.recurringDays,
    scheduledDate: form.scheduledDate,
    scheduledTime: form.scheduledTime,
    autoEscalate: true,
    escalateDaysBefore: form.escalateDaysBefore,
  });

  // Dodatkowo: planowanie eskalacji
  scheduleEscalation(task);

  navigate('Screen17_KalendarzFull'); // lub Screen16 zależnie od źródła
  return { saved: true, task };
}
```

### 3.5. Automatyzacja Eskalacji (Wsparcie ADHD)

```pseudocode
function scheduleEscalation(task: Task) {
  if (!task.autoEscalate) return;
  const triggerDate = subDays(task.scheduledDate, task.escalateDaysBefore);

  registerDailyJob(triggerDate, () => {
    // Przerzucenie do ćwiartki I
    if (state.quadrant_I_Count < 5) {
      task.quadrant = 'I';
      state.quadrant_I_Count++;
      moveTaskToList(task, 'Screen20_DoZrobieniaDzisiaj', 'PILNE_I_WAZNE');
    } else {
      // Brak miejsca w Q1 — fallback: pokaż powiadomienie / nie eskaluj
      log('Escalation skipped — Q1 full');
    }
  });
}
```

### 3.6. Stan Błędu — Ekran 19

```pseudocode
on screen 19 (ErrorTimeFormat):
  state.formField['Pn-15:00'].borderColor = 'red';
  state.formField['Pn-15:00'].glow = 'red';
  show(ErrorBadgeIcon);   // czerwone kółko z "!"
  show(ErrorNotification, { text: 'Bartosz, zegar nie kłamie...' });
  CTAZapisz.state = 'disabled'; // dark gray, no glow, no nav

on user fixes time (regex match HH:MM, no overlap):
  hide(ErrorBadgeIcon);
  hide(ErrorNotification);
  CTAZapisz.state = 'enabled';
```

---

## 4. Architektura Nawigacji (Navigation Tree)

### 4.1. Tab Bar (Globalny)

```typescript
const tabBar = {
  Pulpit:    { icon: 'home',     target: 'Screen01' },
  Macierz:   { icon: 'grid',     target: 'Screen02' },
  Timer:     { icon: 'clock',    target: 'Screen04' },
  Kalendarz: { icon: 'calendar', target: 'Screen17' },
  BrainDump: { icon: 'brain',    target: 'Screen03' },
};

// Wariant aktywny zmienia się w zależności od bieżącego ekranu (stan dot)
const activeVariants = {
  Default:   'TabBar_Default',
  Pulpit:    'TabBar_pulpit2',
  Macierz:   'TabBar_macierz',
  Timer:     'TabBar_timer',
  Kalendarz: 'TabBar_kalendarz',
};
```

### 4.2. Hub & Spoke (Centrum Planowania)

```pseudocode
Screen06_CentrumPlanowania → 5 nav pills:
  DO ZROBIENIA DZISIAJ → Screen20
  KALENDARZ            → Screen16_KalendarzPlany
  NAWYKI               → Screen21
  WIELKIE PROJEKTY     → Screen22
  INNE                 → Screen23

Każdy z 20–23 ma "< Centrum planowania" → Screen06
```

### 4.3. Mapa Przejść (Pełna)

```pseudocode
// Z Pulpitu
Screen01 → 'START FOCUS'           → Screen04 (Timer)
Screen01 → 'Twoje raporty >>>'     → Screen09
Screen01 → '<<< Wszystko na dzisiaj' → Screen24

// Z Macierzy
Screen02 → '→ START FOCUS'         → Screen04
Screen02 → '→ Centrum Planowania'  → Screen06
Screen02 → '→ Hub Delegowania'     → Screen07
Screen02 → '→ Archiwum'            → Screen08
Screen02 → addTask if Q1 full      → Screen10

// Z Brain Dump
Screen03 → '→ Twoje notatki'       → Screen05
Screen03 → 'DODAJ ZADANIE' → routing zgodnie z processQuiz()

Screen05 → 'Sortuj zadanie'        → Screen03 (klasyfikacja wybranej)

// Z Proza Życia
Screen07 → 'ⓘ Zaplanuj blok'       → Screen12
Screen07 → 'ⓘ Zrób teraz'          → Screen13
Screen07 → 'ⓘ Zrób w przerwie'     → Screen14
Popupy 12/13/14 → '×' lub 'Rozumiem' → Screen07

// Z Archiwum
Screen08 → 'Przywróć'              → Screen03 (re-klasyfikacja)
Screen08 → 'Odrzuć'                → counter++ + Screen11 (append)

// Z Raportów
Screen09 → klik słupka             → Screen11 (wybrany dzień)
Screen09 → karta Zrealizowane      → Screen15

// Kalendarze
Screen15 → klik dnia               → Screen11
Screen15 → '< Raporty'             → Screen09
Screen16 → klik dnia               → Screen11
Screen16 → '< Centrum'             → Screen06
Screen16 → 'Kwadrat z plusem'      → Screen18
Screen17 → klik dnia               → Screen11
Screen17 → klik dnia przyszłego (fioletowy) → Screen24
Screen17 → '< Pulpit'              → Screen01
Screen17 → 'Kwadrat z plusem'      → Screen18

// Z Aktywności dnia
Screen11 → '< Raporty'             → Screen09
Screen11 → '< Kalendarz'           → Screen15

// Z Dodaj Zadanie
Screen18 → ZAPISZ (poprawne)       → Screen17 (kalendarz)
Screen18 → ZAPISZ (błąd godziny)   → Screen19 (inline)
Screen18 → '< Kalendarz'           → Screen17 (lub Screen16)
Screen18 → 'Dodaj notatkę'         → Screen28

// Z Wszystko na dzisiaj
Screen24 → '< Pulpit'              → Screen01

// Z popupów Brain Dump
Screen25 (Q3) → ZRÓB TERAZ / ZAPLANUJ BLOK / W PRZERWIE → Screen07 (append + close)
Screen26 (Q4) → 4 kategorie → Screen08; ODRZUĆ → Screen01 + counter
Screen27 (Q2) → TAK → Screen18; NIE → kategoria + close

// Z Ekranu Błędu
Screen10 → 'Przypisz ponownie'        → reklasyfikacja (Screen03)
Screen10 → 'Przenieś do: Zaplanuj II' → Screen27
Screen10 → 'Dodaj do notatek'         → Screen05

// Notatnik + Timer
Screen22 → 'Notatka / Plan' (per card) → Screen28
Screen04 → 'Notatka do projektu'       → Screen28
Screen28 → '▶ ODPAL TIMER'             → Screen04
Screen28 → '< Wróć'                    → source (Screen04 lub Screen22)
Screen28 → '+ Dodaj' (Zasoby)          → Screen30
Screen30 → '×'                         → Screen28
Screen30 → 'DODAJ DO PROJEKTU'         → Screen28 (commit resource)
```

---

## 5. Context Menu (Long Press)

### 5.1. Trigger

Długie przytrzymanie (≥500ms) na elemencie zadania.

### 5.2. Dostępność per Ekran

| Źródło | START FOCUS | ZROBIONE | EDYTUJ | PRZENIEŚ DO… | NOTATKA | USUŃ |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **02 Macierz** (Q1, Q2) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **02 Macierz** (Q3, Q4) | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **05 notatki BrainDump** | ✘ | ✘ | ✔ (edit text) | ✘ | ✔ | ✔ |
| **07 Proza życia** (Q3) | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **08 Archiwum** (Q4) | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **20 Do zrobienia dzisiaj** | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **21 Nawyki** | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **22 Wielkie projekty** | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **23 Inne** | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ |
| **24 Wszystko na dzisiaj** | ✔ (Q1, Q2) | ✔ | ✔ | ✔ | ✔ | ✔ |

**Reguła ogólna:** `START FOCUS` jest dostępny tylko gdy `task.quadrant ∈ {I, II}` — Q3/Q4 nie kwalifikują się do sesji Deep Work.

### 5.3. Akcje (Outputs)

```pseudocode
function onContextAction(task: Task, action: ContextAction) {
  switch (action) {
    case 'START_FOCUS':
      state.currentFocusSession = createSession(task);
      navigate('Screen04_Timer', { taskId: task.id });
      break;

    case 'ZROBIONE':
      task.isDone = true;
      task.completedAt = now();
      state.completedTasksByQuadrant[period][task.quadrant]++;
      appendToList('Screen11_AktywnoscDnia', task, { dayId: today });
      removeFromCurrentList(task);
      break;

    case 'EDYTUJ':
      // Notatka z 05: inline text editor
      // Zadanie: powrót do flow klasyfikacji
      if (source === 'Screen05_Notatki') {
        openInlineEditor(task.title);
      } else {
        navigate('Screen03_BrainDump', { prefilled: task });
      }
      break;

    case 'PRZENIES_DO':
      openQuadrantSelector();   // submenu do zmiany ćwiartki
      break;

    case 'NOTATKA':
      navigate('Screen28_Notatnik', { taskId: task.id });
      // jeśli notatka jeszcze nie istnieje — utwórz nową
      break;

    case 'USUN':
      removeFromAllLists(task);  // BEZ aktualizacji raportów
      // task.isDone NIE zostaje ustawione na true
      break;
  }
}
```

### 5.4. Informacja Zwrotna i Animacja (Visual Feedback)

Wszystkie akcje Context Menu, które usuwają element z listy (`ZROBIONE`, `USUN`), muszą wykonać natychmiastową animację UI **przed** asynchroniczną aktualizacją bazy. Pattern: **optimistic UI update**.

**Trigger:** klik na pigułkę akcji w Context Menu.

**Conditions:**
- `action ∈ { 'ZROBIONE', 'USUN' }`
- Element zadania jest widoczny w bieżącym viewport.

**Outputs (kolejność wykonania):**

```pseudocode
async function executeContextActionWithFeedback(task: Task, action: ContextAction) {
  // 1. Natychmiastowa animacja UI
  animateFadeOut(taskCardElement, { durationMs: 220, easing: 'ease-out' });

  // 2. Reaktywne usunięcie z bieżącej listy (po zakończeniu animacji)
  await waitForAnimationEnd();
  removeFromCurrentList(task);  // re-render listy bez tego elementu

  // 3. Aktualizacja stanu (asynchroniczna)
  if (action === 'ZROBIONE') {
    task.isDone = true;
    task.completedAt = now();

    // 3a. Inkrementacja liczników raportowych — natychmiastowa
    state.completedTasksByQuadrant.week[task.quadrant]++;
    state.completedTasksByQuadrant.month[task.quadrant]++;

    // 3b. Dopisanie do listy dnia (Screen 11)
    appendToList('Screen11_AktywnoscDnia', task, { dayId: today });

    // 3c. Dla Q1: zwolnij slot
    if (task.quadrant === 'I') state.quadrant_I_Count--;

    // 3d. Streak (jeśli pierwsza ukończona aktywność dziś)
    maybeIncrementDopamineStreak();
  }

  if (action === 'USUN') {
    // USUŃ NIE dotyka raportów (zgodnie z dokumentem .docs)
    // Tylko hard-delete z repozytorium zadań
    state.tasks = state.tasks.filter(t => t.id !== task.id);
  }

  // 4. Asynchroniczna synchronizacja z persistence layer
  await db.commit();

  // 5. Broadcast do innych widoków
  broadcast('TaskUpdated', { taskId: task.id, action });
}
```

**Warunek dodatkowy — `ZROBIONE`:**

System musi natychmiast zinkrementować licznik punktów w module Raportów (Ekran 09):

```pseudocode
on task.isDone = true (transition 'Zrobione'):
  // Re-render Screen 09 — sekcje "KWADRANTY · TYDZIEŃ" / "· MIESIĄC"
  // Wartość kafelka odpowiadającego task.quadrant zwiększa się o 1
  reRender('Screen09_Raporty', {
    affectedTiles: [`Q${task.quadrant}_week`, `Q${task.quadrant}_month`],
  });
  // Heatmap (15, 17) dnia today: re-evaluate heatmapColorForDay(today)
  reRender('Screen15_Kalendarz', { affectedDay: today });
  reRender('Screen17_Kalendarz', { affectedDay: today });
```

**Reguła UX:** animacja `fade-out` jest **opcjonalnie odwracalna** w oknie 4s (toast „Cofnij") tylko dla akcji `USUN`. Akcja `ZROBIONE` jest natychmiastowa, bez undo (zgodnie z zasadą natychmiastowej nagrody dopaminowej).

---

## 6. Integracja Modułów — Deep Work Flow

### 6.1. Przepływ Danych: Notatnik (28) ↔ Timer (04)

```pseudocode
// Z ekranu 28 — klik ODPAL TIMER
function startFocusFromNotebook(task: Task) {
  const session = createSession(task, { mode: '25/5' }); // default
  state.currentFocusSession = session;
  navigate('Screen04_Timer', {
    taskId: task.id,
    inheritedMicroSteps: task.microSteps,   // przekazane do widoku
    inheritedNote: task.noteContent,
  });
}

// Z ekranu 04 — klik "Notatka do projektu"
function openNotebookFromTimer() {
  const task = state.currentFocusSession.task;
  navigate('Screen28_Notatnik', {
    taskId: task.id,
    returnTo: 'Screen04_Timer',
  });
}
```

### 6.2. Synchronizacja microSteps

`microSteps` zadania są źródłem prawdy — wyświetlają się zarówno w 28 jak i (opcjonalnie) w 04 podczas sesji Focus. Zmiana stanu checkboxa na dowolnym z ekranów aktualizuje encję `Task.microSteps[id].isDone`.

```pseudocode
function toggleMicroStep(taskId, stepId) {
  const task = state.tasks.find(t => t.id === taskId);
  const step = task.microSteps.find(s => s.id === stepId);
  step.isDone = !step.isDone;
  // żaden aktywny re-render zależnych widoków
  broadcast('TaskUpdated', { taskId });
}
```

### 6.3. Cykl Życia Sesji Focus

```pseudocode
function tickFocusSession() {
  const s = state.currentFocusSession;
  if (!s) return;
  s.elapsedMs = now() - s.startedAt - s.pausedDurationMs;

  if (s.elapsedMs >= sessionDuration(s.mode)) {
    s.completedCycles++;
    // kolejna kropka na ekranie 04 zapala się na zielono
    if (s.completedCycles >= 4) {
      endSession(s, { reason: 'completed' });
    } else {
      // przerwa
      enterBreakMode(s);
    }
  }
}

function onEndSessionClick() {
  const s = state.currentFocusSession;
  const consumedRatio = s.elapsedMs / sessionDuration(s.mode);
  if (consumedRatio < 0.25) {
    s.endedEarly = true;
    // NIE inkrementuje dopamineStreakCount
  } else {
    s.completedCycles++; // kolejna kropka na zielono
  }
  endSession(s, { reason: 'manual' });
}

function endSession(s, opts) {
  s.endedAt = now();
  state.focusSessionsHistory.push(s);
  state.totalFocusTimeToday += s.elapsedMs;
  if (s.task.category === 'WielkiProjekt') s.task.sessionsCount++;
  state.currentFocusSession = null;
}
```

### 6.4. Resources Flow (Screen 28 ↔ 30)

**Model danych — pole `Task.resources` jest tablicą (`Resource[]`)**, co umożliwia dodanie wielu zasobów (linków + plików) do jednego zadania. Tablica nie ma górnego limitu po stronie modelu (limit miękki UX = 10 widocznych pigułek, dalsze chowane za "+N więcej" — TBD warstwa UI).

```typescript
// Definicja przypomniana (z sekcji 1.1)
interface Task {
  // …
  resources: Resource[];   // tablica — wiele zasobów per zadanie
}

interface Resource {
  id: string;          // uuid()
  type: 'link' | 'file';
  name: string;        // etykieta wyświetlana na pigułce
  url?: string;        // gdy type=link
  filePath?: string;   // gdy type=file
}
```

**Trigger (z ekranu 28):** klik pigułki „+ Dodaj" w sekcji ZASOBY.

**Conditions:**
- Aktywny `Task` (znana wartość `taskId` z routingu)
- Brak walidacji limitu — można dodać dowolną liczbę zasobów.

**Outputs:**

```pseudocode
// Z ekranu 28 — klik "+ Dodaj"
function openResourceDialog(taskId) {
  navigate('Screen30_AddResource', {
    taskId,
    onCancel: () => navigate('Screen28', { taskId }),
    onConfirm: (resource) => {
      const task = getTask(taskId);
      task.resources.push(resource);     // append do tablicy
      navigate('Screen28', { taskId });
    },
  });
}

// Ekran 30 — submit
function onClickDodajDoProjektu(form: ResourceForm, taskId) {
  const resource: Resource = {
    id: uuid(),
    type: form.url ? 'link' : 'file',
    name: form.name,
    url: form.url || null,
    filePath: form.attachedFile || null,
  };
  emitConfirm(resource);
}
```

#### 6.4.1. Natychmiastowa Aktualizacja UI (No-Refresh Append)

Po kliknięciu „DODAJ DO PROJEKTU" na ekranie 30 nowo dodany zasób **musi natychmiast pojawić się na liście pigułek w sekcji ZASOBY ekranu 28** bez przeładowywania strony.

**Reguła:** sekcja `ZASOBY` na ekranie 28 jest **subskrybentem eventu `TaskUpdated`** ograniczonego do filtra `affectedField: 'resources'`. Auto-layout HORIZONTAL z `hug content` automatycznie wstawia nową pigułkę między ostatni zasób a pigułkę „+ Dodaj".

```pseudocode
// Subskrypcja w komponencie ZASOBY na ekranie 28
on broadcast('TaskUpdated', { taskId, affectedField }):
  if (currentScreen === 'Screen28' && currentTaskId === taskId && affectedField === 'resources') {
    const updated = state.tasks.find(t => t.id === taskId);
    rerenderResourcesRow(updated.resources);  // re-render bez navigate
    animateInsertNewPill(updated.resources.last); // np. scale 0→1, 180ms
  }
```

**Reguła UX:**
- Nowa pigułka pojawia się z **animacją wejścia** (scale 0→1, 180ms, ease-out)
- Pozycja: między ostatnim zasobem a pigułką „+ Dodaj"
- Jeśli widoczna lista przekroczy szerokość kontenera, kolejne pigułki są chowane za „… +N" (scroll horizontal opcjonalny)
- Po `emitConfirm` ekran 30 zamyka się automatycznie i wraca do 28 (bez explicit `navigate`)

**Persystencja:** `db.commit()` na warstwie storage jest asynchroniczne i nie blokuje UI — jeśli zapis się nie powiedzie, system pokaże toast „Błąd zapisu zasobu — spróbuj ponownie" i przywróci stan sprzed `push()`.

---

## 7. Raporty i Statystyki — Liczniki Reaktywne

### 7.1. dopamineStreakCount

```pseudocode
on session.endedEarly === false AND session.completedCycles >= 1:
  if (lastSession.endedAt.date < today) {
    state.dopamineStreakCount++; // pierwsza sesja dnia
  }
```

Reset:
```pseudocode
on midnight tick:
  if (no completed session yesterday) {
    state.dopamineStreakCount = 0;
  }
```

### 7.2. Heatmap Kalendarza (Screen 15)

```pseudocode
function heatmapColorForDay(day: ISODate): HeatmapLevel {
  const count = state.completedTasksByDay[day];
  if (count === 0)  return 'cardBg';
  if (count <= 3)   return 'dimGreen';
  if (count <= 7)   return 'mediumGreen';
  if (count <= 11)  return 'brightGreen';
  return 'neonGreen';
}
```

### 7.3. Counter "W tym miesiącu odrzuciłeś"

```pseudocode
on Screen26 'ODRZUĆ' OR Screen08 'Odrzuć':
  state.rejectedTasksThisMonth++;
  // Reset 1. dnia miesiąca o 00:00
```

---

## 8. Warunki Błędu (Error States)

| Kod błędu | Trigger (Conditions) | Wynik (Output) |
|---|---|---|
| `ERR_Q1_OVERLOAD` | `state.quadrant_I_Count === 5` AND `processQuiz() === 'I'` | `navigate('Screen10')` — popup nad 03 BrainDump |
| `ERR_TIME_FORMAT` | regex `^([01]?[0-9]|2[0-3]):[0-5][0-9]$` nie matchuje wpisanej godziny | `navigate('Screen19')` — inline error nad CTA |
| `ERR_TIME_OVERLAP` | nowa sesja kolidu czasowo z istniejącą rutyną (`recurringDays` overlap + zakres czasowy) | `Screen19` — komunikat `reason: overlap` |

### 8.1. Powroty z Error State

```pseudocode
on Screen10:
  user clicks 'Przypisz ponownie' → re-open Screen03 with cleared answers
  user clicks 'Przenieś do: Zaplanuj (II)' → navigate Screen27 (forced Q2)
  user clicks 'Dodaj do notatek Brain Dump' → save as BrainDumpNote + navigate Screen05

on Screen19:
  user fixes input → form re-validates inline → CTA re-enables
  (brak osobnego ekranu — błąd inline)
```

---

## 9. Persystencja Danych

### 9.1. Klucze Storage (rekomendacja — IndexedDB / SQLite)

```
tasks              → Task[]
brainDumpNotes     → BrainDumpNote[]
focusSessions      → FocusSession[]
appState.global    → Pick<AppState, 'dopamineStreakCount' | 'rejectedTasksThisMonth'>
appState.counts    → completedTasksByQuadrant
```

### 9.2. Indeksy

- `tasks` po `quadrant`, po `scheduledDate`, po `isDone`
- `focusSessions` po `taskId`, po `startedAt`

---

## 10. Reguły Spójności Cross-Screen

Każda akcja modyfikująca encję `Task` musi emitować event `TaskUpdated`. Subskrybenci (wszystkie widoki z list zadań) re-renderują się automatycznie:

- **02 Macierz** — przelicza zawartość 4 ćwiartek
- **20 Do zrobienia dzisiaj** — sortuje wg czasu i priorytetu (1. Inne, 2. WielkieProjekty, 3. Habit/Nawyki w obrębie tej samej godziny)
- **09 Raporty** — przelicza KWADRANTY · TYDZIEŃ / · MIESIĄC
- **11 Aktywność dnia** — re-renderuje listy 4 kwadrantów dla wybranego dnia
- **15/16/17 Kalendarze** — przelicza heatmapy
- **17 Widok pełny** — dual heatmap (zielona dla zrobionych < dziś, fioletowa dla planowanych ≥ dziś)

---

## 11. Reguły Sortowania List

### 11.1. Ekran 20 "Do zrobienia dzisiaj"

```pseudocode
section 'PILNE I WAŻNE':
  filter: task.quadrant === 'I' AND task.scheduledDate === today
  sortBy: task.scheduledTime ASC

section 'RESZTA DNIA':
  filter: task.quadrant ∈ ('II', 'III') AND task.scheduledDate === today
  sortBy:
    1. task.scheduledTime ASC
    2. category priority:
       Inne > WielkiProjekt > Habit  (lower index = higher priority within same time)
```

### 11.2. Ekran 24 „Wszystko na dzisiaj" — Logika Agregacji Danych (widok wirtualny)

Ekran **24** **nie posiada własnej bazy danych ani encji**. Jest **widokiem wirtualnym (computed view)**, który filtruje i grupuje globalną listę `state.tasks` według warunku `task.scheduledDate === today` (lub `today ∈ resolveOccurrences(task.recurringDays)` dla nawyków).

**Trigger:** wejście na ekran 24 (z Pulpitu lub klik dnia przyszłego w kalendarzu 17).

**Conditions:**
- Wybrana data = `state.currentDate` (domyślnie dzisiaj) lub data z kontekstu przekazana z 17.
- Tylko zadania, które na ten dzień zostały zaplanowane lub do których odnosi się harmonogram rekurencyjny (Habit).

**Funkcja agregująca:**

```pseudocode
function buildScreen24View(date: ISODate = today): Screen24Model {
  const todayTasks = state.tasks.filter(task => {
    if (task.scheduledDate === date) return true;
    if (task.category === 'Habit' &&
        task.recurringDays.includes(dayOfWeekOf(date))) return true;
    return false;
  });

  // Sekcje renderowania (priorytet wyświetlania od góry):
  return {
    sections: [
      // 1. PILNE I WAŻNE (Q1) — zawsze pierwsza, dominująca wizualnie
      {
        id: 'PILNE_I_WAZNE',
        order: 1,
        items: todayTasks
          .filter(t => t.quadrant === 'I')
          .sort((a, b) => compareTime(a.scheduledTime, b.scheduledTime)),
      },

      // 2. PROZA ŻYCIA (Q3) — strategie III ćwiartki
      {
        id: 'PROZA_ZYCIA',
        order: 2,
        items: todayTasks
          .filter(t => t.quadrant === 'III')
          .sort((a, b) => compareStrategy(a.strategy, b.strategy)),
        // kolejność strategii: ZrobTeraz → WPrzerwie → ZaplanujBlok
      },

      // 3. POZOSTAŁE ZADANIA (Q2 + sortowanie kategorii)
      {
        id: 'POZOSTALE',
        order: 3,
        items: todayTasks
          .filter(t => t.quadrant === 'II')
          .sort((a, b) => {
            // Sortuj wg czasu, potem wg priorytetu kategorii
            const tCmp = compareTime(a.scheduledTime, b.scheduledTime);
            if (tCmp !== 0) return tCmp;
            return categoryPriorityIndex(a.category) -
                   categoryPriorityIndex(b.category);
          }),
      },
    ]
  };
}

// Mapowanie priorytetu kategorii dla sekcji POZOSTAŁE (lower = wyżej):
function categoryPriorityIndex(c: Category): number {
  switch (c) {
    case 'Inne':           return 0; // 1. Inne
    case 'WielkiProjekt':  return 1; // 2. Wielkie Projekty
    case 'Habit':          return 2; // 3. Nawyki/Habit
    default:               return 99;
  }
}
```

**Outputs:**

```pseudocode
on each TaskUpdated event:
  // Ekran 24 nasłuchuje wszystkich zmian zadań na dzisiaj
  if (event.task.scheduledDate === today ||
      (event.task.category === 'Habit' &&
       event.task.recurringDays.includes(dayOfWeekOf(today)))) {
    rerender('Screen24', buildScreen24View(today));
  }
```

**Reguła:** ekran 24 jest read-only widokiem agregującym — wszelkie modyfikacje (Long Press → ZROBIONE / EDYTUJ / USUŃ) wykonywane są na referencji do oryginalnego `Task` w globalnej liście. Po zakończeniu akcji event `TaskUpdated` automatycznie odświeża widok.

**Priorytet wyświetlania (gwarantowany):**

| Pozycja | Sekcja | Filtr | Sort |
|---|---|---|---|
| 1 (góra, najjaśniejszy glow) | PILNE I WAŻNE | `quadrant === 'I'` | `scheduledTime` ASC |
| 2 | PROZA ŻYCIA / LOGISTYKA | `quadrant === 'III'` | strategy: ZrobTeraz → WPrzerwie → ZaplanujBlok |
| 3 (dół, najsubtelniejszy obrys) | POZOSTAŁE ZADANIA | `quadrant === 'II'` | `scheduledTime` ASC → category (Inne > WielkiProjekt > Habit) |

### 11.3. Ekran 21 Nawyki (UI label: „Nawyki/Rutyna")

```pseudocode
filter: task.category === 'Habit'
sortBy: task.recurringDays.length DESC, task.scheduledTime ASC
```

> **UI note:** Tytuł widoku w warstwie prezentacji to „TWOJE NAWYKI"; w kontekstach edycyjnych zadanie typu `Habit` może być etykietowane jako „Rutyna" (np. pigułka kategorii w 18 i 27).

### 11.4. Ekran 22 Wielkie Projekty (UI label: „Wielkie Projekty")

```pseudocode
filter: task.category === 'WielkiProjekt'
sortBy: task.sessionsCount DESC, task.title ASC
```

> **UI note:** Wartość enum `'WielkiProjekt'` mapuje się 1:1 na pigułkę „Wielki Projekt" w segmented control (ekran 18) oraz na badge meta na karcie 28.

### 11.5. Ekran 23 Inne

```pseudocode
filter: task.category === 'Inne' AND task.quadrant !== 'IV'
sortBy: task.createdAt ASC
```

---

## 12. Tryb Klasyfikacji z Notatki (Screen 05 → 03)

```pseudocode
function onClickSortujZadanie(noteId) {
  const note = state.brainDumpNotes.find(n => n.id === noteId);
  navigate('Screen03_BrainDump', {
    prefilledTitle: note.text,
    onSuccess: (task) => {
      note.promotedToTaskId = task.id;
      note.type = 'sorted'; // zmiana koloru obrysu na fioletowy
    }
  });
}
```

---

## 13. Wybór Bieżącego Zadania (Screen 04 Timer — przycisk "PRACUJESZ NAD")

```pseudocode
function onClickWybierzZadanie() {
  // Otwiera flow drążenia w macierz:
  navigate('Screen02_Macierz', { selectionMode: true });
  // Po wybraniu zadania:
  //   - jeśli quadrant ∈ {I, II} → ustaw jako currentFocusTask
  //   - jeśli quadrant ∈ {III, IV} → nie pozwól wybrać (zgodnie z regułą Long Press)
}

// Alternatywne drążenie:
//   Screen02 → Centrum Planowania (06) → Nawyki/WielkieProjekty/Inne → wybierz
// Tylko ekrany z task.quadrant ∈ {I, II} są klikalne (reszta szara, disabled)
```

---

## 14. Glosariusz Skrótów

| Skrót | Znaczenie |
|---|---|
| **Q1–Q4** | Ćwiartki Eisenhowera (I–IV) |
| **DnD** | Day-of-Week (Pn–Nd) |
| **MS** | MicroStep |
| **CTA** | Call-To-Action button |
| **autoEscalate** | Automatyczne przeniesienie zadania do Q1 X dni przed terminem |
| **Streak** | Łańcuch dni z ukończoną co najmniej 1 sesją Focus |

---

## 15. Tabela Endpointów (rekomendacja dla backendu, jeśli aplikacja będzie sieciowa)

| Metoda | Endpoint | Zwraca | Cel |
|---|---|---|---|
| `POST` | `/tasks` | `Task` | Tworzenie zadania z `processQuiz` |
| `PATCH` | `/tasks/:id` | `Task` | Edycja, zmiana quadrant, toggle isDone |
| `DELETE` | `/tasks/:id` | `204` | USUŃ (bez aktualizacji statystyk) |
| `POST` | `/tasks/:id/microsteps/:msId/toggle` | `Task` | Toggle micro-step |
| `POST` | `/tasks/:id/resources` | `Resource` | Dodanie zasobu (z ekranu 30) |
| `POST` | `/sessions` | `FocusSession` | Start sesji Focus |
| `PATCH` | `/sessions/:id/end` | `FocusSession` | Zakończenie sesji |
| `POST` | `/notes` | `BrainDumpNote` | Dodanie notatki z 05 |
| `POST` | `/notes/:id/promote` | `Task` | Sortuj zadanie (note → task) |
| `GET` | `/reports/heatmap?month=YYYY-MM` | `HeatmapData` | Heatmapy 15/16/17 |
| `GET` | `/reports/day/:isoDate` | `DayActivity` | Ekran 11 — zadania dnia |

---

## 16. User Flow State Diagram — Brain Dump (Ścieżka Krytyczna)

Ścieżka krytyczna użytkownika w module Brain Dump od momentu otwarcia ekranu 03 do finalnego umieszczenia zadania na właściwej liście.

### 16.1. Diagram Stanów

```
            ┌──────────────────────────────────────────────────────────┐
            │                                                          │
            ▼                                                          │
        ┌───────┐        ┌───────┐         ┌──────┐        ┌──────┐   │
START → │ START │ ─────▶ │ INPUT │ ─────▶  │ QUIZ │ ─────▶ │DECIS-│   │
        │  03   │        │ Nazwa │         │Karta1│        │ ION  │   │
        └───┬───┘        └───┬───┘         └──┬───┘        └──┬───┘   │
            │ "×"            │ back           │ back          │       │
            │ cancel         │                │               ▼       │
            ▼                ▼                ▼          ┌────────┐   │
       PORZUCONE       PORZUCONE         PORZUCONE   ┌──▶│Pop-up  │   │
       (no save)       lub               lub         │   │25/26/27│   │
                       NOTKA→05          NOTKA→05    │   └──┬─────┘   │
                                                     │      │         │
                                                     │      ▼         │
                                                     │  ┌────────────┐│
                                                     │  │  FINAL_    ││
                                                     │  │ PLACEMENT  ││
                                                     │  └────┬───────┘│
                                                     │       │        │
                                                     │       ▼        │
                                                     │  Kalendarz /   │
                                                     │  Lista / Q1    │
                                                     │  + commitTask  │
                                                     │                │
                                                     │   ↳ "×" anuluj │
                                                     └────────────────┘
```

### 16.2. Stany i Przejścia

| # | Stan | Trigger wejścia | Conditions | Output (przejście dalej) |
|---|---|---|---|---|
| **S0** | `START` (03 Brain Dump otwarte) | Klik ikony Brain Dump w Tab Bar lub klik „Sortuj zadanie" na 05 | brak | przejście do `S1` po pierwszym focusie pola tekstowego |
| **S1** | `INPUT` (wpis nazwy zadania) | Focus pola "Co masz do zrobienia?" | `draft.title.length > 0` | klik strzałki „►" przy Ważność → `S2` |
| **S2** | `QUIZ_WAZNOSC` (3 pytania) | przycisk „►" Ważność | wszystkie 3 odpowiedzi udzielone | auto-przejście do `S3` |
| **S3** | `QUIZ_PILNOSC` (3 pytania) | po S2 | wszystkie 3 odpowiedzi udzielone | auto-renderowanie pigułki „Trafia do…" → `S4` |
| **S4** | `DECISION` (system wagowy) | przeliczone `processQuiz()` | quadrant ∈ {I, II, III, IV} | klik „DODAJ ZADANIE" → `S5_X` (zależnie od quadrant) |
| **S5a** | `POPUP_25` (Q3) | quadrant === 'III' | strategy wybrana | klik strategii → `S6` |
| **S5b** | `POPUP_26` (Q4) | quadrant === 'IV' | kategoria wybrana lub ODRZUĆ | → `S6` |
| **S5c** | `POPUP_27` (Q2) | quadrant === 'II' | typ + decyzja TAK/NIE | TAK → Screen18; NIE → `S6` |
| **S5d** | `Q1_DIRECT` (Q1) | quadrant === 'I' AND Q1<5 | brak overload | bezpośrednio → `S6` |
| **S5e** | `Q1_OVERLOAD` (Q1 full) | Q1===5 | overflow | → Screen10 → fallback (re-klasyfikacja / Brain Dump / popup 27) |
| **S6** | `FINAL_PLACEMENT` | po S5* | task.quadrant + task.category ustalone | `commitTask()` + navigate do widoku docelowego (01/07/08/18/21/22/23) |
| **END** | `COMMITTED` | po S6 | persistence success | broadcast `TaskUpdated` |

### 16.3. Reguła Przerywalności (Cancel Flow)

**Każdy stan S0…S5 jest przerywalny** przyciskiem „×" w prawym górnym rogu popupu lub gestem powrotu (back navigation):

```pseudocode
function onCancel(currentState: FlowState, draftTask: PartialTask) {
  // Conditions
  const hasTitle = draftTask.title?.length > 0;
  const hasAnswers = draftTask.answers?.W1 !== undefined;

  // Outputs (3 ścieżki w zależności od stanu draftu):
  if (!hasTitle) {
    // Stan S0/S1 bez wprowadzonej nazwy — porzuć cicho
    discardDraft();
    navigate(previousScreen);
    return;
  }

  if (hasTitle && !hasAnswers) {
    // Wprowadzono tytuł, ale nie rozpoczęto quizu
    // → zapisz jako BrainDumpNote (typ 'unsorted')
    saveAsBrainDumpNote({
      text: draftTask.title,
      type: 'unsorted',
      createdAt: now(),
      promotedToTaskId: null,
    });
    navigate(previousScreen);
    return;
  }

  if (hasTitle && hasAnswers && currentState !== 'FINAL_PLACEMENT') {
    // Quiz rozpoczęty, ale nie sfinalizowany — opcja zapisu jako "Nieprzypisane"
    showDialog({
      title: 'Porzucić zadanie?',
      options: [
        { label: 'Zapisz jako Nieprzypisane', action: () => saveAsUnassigned(draftTask) },
        { label: 'Porzuć',                    action: () => discardDraft() },
        { label: 'Anuluj',                    action: () => stay() },
      ],
    });
    return;
  }

  if (currentState === 'FINAL_PLACEMENT') {
    // Po commit nie można już anulować — działa tylko USUŃ z listy
    return;
  }
}
```

**Funkcja `saveAsUnassigned`:**

```pseudocode
function saveAsUnassigned(draftTask: PartialTask) {
  const task: Task = {
    ...draftTask,
    id: uuid(),
    quadrant: 'II',                // default — zadanie wymagające planowania
    category: 'Inne',
    isImportant: draftTask.isImportant ?? false,
    isUrgent:    draftTask.isUrgent    ?? false,
    createdAt: now(),
    // brak terminu — pozostaje w sekcji 'NIEPRZYPISANE' na 23
  };
  appendToList('Screen23_Inne', task, { sectionId: 'NIEPRZYPISANE' });
  commitTask(task);
}
```

### 16.4. Tabela Triggers / Conditions / Outputs (skrót)

| Stan | Trigger | Conditions | Outputs |
|---|---|---|---|
| S0 → S1 | focus pola input | brak | aktywacja pola, pokazanie sekcji „Pomogę Ci przypisać…" |
| S1 → S2 | klik „►" Ważność | `title.length > 0` | render Q_W1 |
| S2 → S3 | trzecia odpowiedź Ważność | `W1, W2, W3` udzielone | auto-render Q_P1 |
| S3 → S4 | trzecia odpowiedź Pilność | `P1, P2, P3` udzielone | `processQuiz()` → aktualizacja pigułki „Trafia do…" |
| S4 → S5* | klik „DODAJ ZADANIE" | quadrant ustalony | navigate do popupu 25/26/27 lub bezpośrednio Q1 |
| S5* → S6 | finalna akcja w popupie | wszystkie wymagane pola popupu wypełnione | `commitTask()` + persistence |
| S6 → END | success persistence | `db.commit() === ok` | broadcast `TaskUpdated`, navigate do widoku docelowego |
| ANY → CANCEL | klik „×" / back | (zależnie od stanu draft) | discard / save as note / save as unassigned (patrz 16.3) |

### 16.5. Reguły Spójności Brain Dump

1. **Reaktywność pigułki „Trafia do…"** — zmienia się w czasie rzeczywistym po każdej odpowiedzi quizu (nie wymaga submitu).
2. **Block-state dla Q1** — jeśli `processQuiz() === 'I' AND Q1_Count === 5`, przycisk „DODAJ ZADANIE" pozostaje aktywny, ale klik prowadzi do Screen10 (Overload). System NIE blokuje wpisania — blokuje dopiero finalizację.
3. **Brak walidacji długości tytułu** — pole jest miękkie; każdy niepusty string może być zapisany jako `Task.title` lub `BrainDumpNote.text`.
4. **Idempotencja `commitTask()`** — jeśli użytkownik powtórnie kliknie „DODAJ ZADANIE" w trakcie zapisu, druga akcja jest ignorowana (debounce ~500ms na poziomie UI).

---

*Dokument w wersji 2.1 jest spójny z plikami `Dokument bez tytułu.md`, `FocusFlow-Mapa-Nawigacji.md` oraz projektem Figma „FocusFlow — ADHD Matrix Planner". Zmiany wprowadzone w v2.1 doprecyzowują logikę bez dodawania nowych funkcjonalności — ujednolicenie nazewnictwa (Habit), agregacja widoku 24, instant UI dla zasobów, animacje Context Menu oraz formalny state diagram modułu Brain Dump. Specyfikacja stanowi punkt wyjścia do implementacji w wybranej technologii (React Native / SwiftUI / Kotlin Compose), z naciskiem na warstwę stanu i przepływów logicznych.*
