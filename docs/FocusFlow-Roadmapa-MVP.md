# FocusFlow – Roadmapa Wdrożenia MVP

**Wersja:** 1.0
**Data:** 2026-05-11
**Autor:** Senior Lead Developer / System Architect
**Status projektu:** AppShell + Pulpit v2 + szkielet Brain Dump zaimplementowane. Logika rdzenia (`processQuiz`, persystencja, Timer, Overload, widoki list) — do wdrożenia.

---

## Zasady prowadzenia projektu (read first)

| # | Zasada | Implikacja praktyczna |
|---|---|---|
| 1 | **Logika ponad Estetykę** | Sprinty 1–4 = czysta logika. Wizualny overhaul = Sprint 5. Do tego czasu UI ma być **funkcjonalnie kompletny**, ale wystarczy „nieładny minimalizm" (czarne tło + ramki). |
| 2 | **IndexedDB = Single Source of Truth** | Żaden ekran nie trzyma stanu zadań w `useState` lokalnym. Wszystko przechodzi przez `db` + event bus `TaskUpdated`. |
| 3 | **Event-bus reactivity** | Po każdej mutacji w IDB wywołać `emitTaskUpdated()`. Każdy ekran subskrybuje przez `useEffect`. Pattern zastany — kontynuujemy. |
| 4 | **Virtual views** | Ekrany 20, 24, 11 nie mają osobnego store'a. To **selektory** nad `tasks` z IDB (filtry: data, quadrant, isDone). |
| 5 | **Definition of Done (DoD)** dla każdego zadania | Kod kompiluje się bez `any`, typy TS są ścisłe, mutacja w jednym widoku reaguje w drugim w < 200 ms, brak konsolowych warningów. |
| 6 | **Branching strategy (proponowana)** | `main` = stabilne MVP. Każdy sprint = własna gałąź `sprint/N-nazwa`. Merge tylko po zaliczeniu QA. |
| 7 | **Brak konta / chmury w MVP** | Wszystko lokalnie. PWA z offline-first jest opcjonalna w Sprincie 5. |

---

## Mapa Sprintów (overview)

| Sprint | Nazwa | Czas (estymacja Solo-Dev z asystą AI) | Główny deliverable |
|---|---|---|---|
| **S1** | Foundation: Reactive Store + Quiz Engine | 3–5 dni | `useTasksStore` + `processQuiz` + Brain Dump z dynamiczną pigułką |
| **S2** | Brain Dump Pipeline + Overload + Strategic Modals | 4–6 dni | Pełny flow 03→25/26/27→IDB→Pulpit. Blokada 5 zadań w Q1. |
| **S3** | Macierz + Widoki Wirtualne + Context Menu | 5–7 dni | Ekrany 02, 11, 20, 24, 21, 22, 23, 07, 08, 29 czytające z IDB. |
| **S4** | Focus Timer + Auto-escalation + Raporty + Streak | 6–8 dni | Ekran 04 (Pomodoro), 09 (Raporty), automatyzacja eskalacji Q2→Q1. |
| **S5** | Visual Overhaul + Kalendarz + Notatnik + PWA | 7–10 dni | Style Guide v2 dla wszystkich ekranów, ekrany 16/17/28/18, PWA install. |

**Łączny czas do MVP:** ~25–36 dni roboczych Solo-Dev'a + asystencja AI.

---

# SPRINT 1 — Foundation: Reactive Store + Quiz Engine

## Cel

- **Biznesowy:** Każde zadanie/notatka utworzona na jednym ekranie pojawia się natychmiast na pozostałych ekranach (real-time SoT). Pigułka „Trafia do..." na ekranie 03 reaguje na quiz w czasie rzeczywistym.
- **Techniczny:** Wycofać duplikację logiki dostępu do IndexedDB. Stworzyć centralny hook `useTasksStore`, zunifikować emitery `TaskUpdated`, wyciągnąć `processQuiz` do osobnego modułu, dodać `seedDevData` dla testów.

## Zadania

### 1.1. Wyciągnięcie event-busa i emitera do wspólnego modułu
- **Pliki:** `kod/src/store/events.ts` (nowy), refactor `kod/src/pages/BrainDump.tsx` i `kod/src/pages/Pulpit.tsx` (usunąć duplikat `emitTaskUpdated`)
- **Kod:** Eksportować `emitTaskUpdated()`, `subscribeTaskUpdated(handler)`, stałą `TASK_UPDATED_EVENT`.

### 1.2. Hook `useTasksStore`
- **Pliki:** `kod/src/store/useTasksStore.ts` (nowy)
- **API:**
  ```typescript
  const {
    tasks,                   // Task[]
    notes,                   // BrainDumpNote[]
    db,                      // IDBPDatabase<FocusFlowSchema> | null
    isReady,                 // boolean
    addTask: (t: Task) => Promise<void>,
    updateTask: (id, patch) => Promise<void>,
    deleteTask: (id) => Promise<void>,
    addNote: (n: BrainDumpNote) => Promise<void>,
    deleteNote: (id) => Promise<void>,
  } = useTasksStore();
  ```
- **Zachowanie:** Hook inicjalizuje DB raz, ładuje wszystkie taski i notatki, subskrybuje `TASK_UPDATED_EVENT`, przeładowuje po każdym evencie.

### 1.3. Selektory (czyste funkcje)
- **Pliki:** `kod/src/store/selectors.ts` (nowy)
- **Funkcje:**
  - `selectByQuadrant(tasks, 'I' | 'II' | 'III' | 'IV')`
  - `selectOpen(tasks)` — `!isDone && !isRejected`
  - `selectScheduledForDate(tasks, ISODate)` — virtual view dla ekranu 11/20/24
  - `selectQ1Count(tasks)` — dla logiki Overload
  - `selectStreakDays(focusSessions)` — dla licznika dopaminowego

### 1.4. Moduł `processQuiz`
- **Pliki:** `kod/src/logic/processQuiz.ts` (nowy)
- **API:**
  ```typescript
  type QuizAnswers = Partial<Record<'W1'|'W2'|'W3'|'P1'|'P2'|'P3', boolean>>;
  export const processQuiz = (a: QuizAnswers): {
    quadrant: Quadrant | null;   // null jeśli niekompletne
    isImportant: boolean;
    isUrgent: boolean;
    isComplete: boolean;
  } => { ... }
  ```
- **Reguła:** `importantScore = count(W1..W3 == true) >= 2 → isImportant`. Analogicznie dla pilności. Mapowanie → Quadrant.

### 1.5. Refactor BrainDump.tsx — pigułka reaktywna
- **Pliki:** `kod/src/pages/BrainDump.tsx`
- **Zmiana:** Aktualnie pigułka „Trafia do..." pokazuje się tylko jeśli `Object.keys(answers).length > 0` i błędnie nazywa Q1 i Q2 tym samym kolorem. Poprawić tak, by:
  - Pokazywała się od pierwszej odpowiedzi (parsial state).
  - Kolory: Q1 = neonGreen, Q2 = neonPurple, Q3 = orange (`#FB923C`), Q4 = slate-500.
  - Etykiety zgodne ze spec: „PILNE I WAŻNE" / „WAŻNE, NIEPILNE" / „PILNE, NIEWAŻNE" / „NIEPILNE, NIEWAŻNE".

### 1.6. Dev seed
- **Pliki:** `kod/src/store/seed.ts` (nowy), wywoływane warunkowo z `main.tsx` gdy `import.meta.env.DEV`
- **Cel:** Wgrać 8 fixturowych zadań (2 na każdy Q) + 3 notatki, żeby developer nie startował z pustym ekranem.

## Pliki do edycji / utworzenia (S1)
```
kod/src/store/events.ts            [NEW]
kod/src/store/useTasksStore.ts     [NEW]
kod/src/store/selectors.ts         [NEW]
kod/src/store/seed.ts              [NEW]
kod/src/logic/processQuiz.ts       [NEW]
kod/src/pages/BrainDump.tsx        [REFACTOR]
kod/src/pages/Pulpit.tsx           [REFACTOR — usunąć duplikat emitTaskUpdated, użyć hooka]
kod/src/main.tsx                   [EDIT — wywołanie seedDevData() w DEV]
```

## Prompt dla agenta (Cascade/Kilocode) — Sprint 1

```
ROLA: Senior TypeScript Engineer pracujący w projekcie React + Vite + IndexedDB.

KONTEKST: Projekt FocusFlow (kod/src/). Aktualnie BrainDump.tsx i Pulpit.tsx
duplikują logikę emitTaskUpdated. Brak centralnego store'a. Quiz logika jest
zaszyta w BrainDump.tsx (funkcja processQuiz). Trzeba ją wyciągnąć.

ZADANIE: Wykonaj refactor zgodnie z poniższą listą:

1. Utwórz kod/src/store/events.ts eksportujący:
   - TASK_UPDATED_EVENT = 'TaskUpdated'
   - emitTaskUpdated()
   - subscribeTaskUpdated(handler): () => void  // zwraca unsubscribe

2. Utwórz kod/src/logic/processQuiz.ts z funkcją processQuiz(answers) → 
   { quadrant, isImportant, isUrgent, isComplete }. Reguła: >=2 TAK z 3 pytań
   w każdej z osi = TRUE. Mapowanie I/II/III/IV.

3. Utwórz kod/src/store/useTasksStore.ts — React hook ładujący tasks i notes
   z IndexedDB przez initDB() z db/index.ts. Subskrybuj TASK_UPDATED_EVENT
   i przeładuj listy po każdym evencie. Eksponuj API: { tasks, notes, db,
   isReady, addTask, updateTask, deleteTask, addNote, deleteNote }. Każda
   mutacja: zapis do IDB + emitTaskUpdated().

4. Utwórz kod/src/store/selectors.ts z czystymi funkcjami:
   selectByQuadrant, selectOpen, selectScheduledForDate, selectQ1Count.

5. Utwórz kod/src/store/seed.ts z funkcją seedDevData(db) wgrywającą 8 fixture'owych
   zadań (po 2 na quadrant) i 3 notatki Brain Dump. Wywołaj z main.tsx
   warunkowo: if (import.meta.env.DEV) await seedDevData(db).

6. Refactor pages/BrainDump.tsx:
   - usuń lokalne emitTaskUpdated, importuj z store/events
   - usuń lokalną processQuiz, importuj z logic/processQuiz
   - przepisz tak, by używał useTasksStore zamiast bezpośredniego saveTask
   - popraw pigułkę „Trafia do...": ma się pokazywać od pierwszej odpowiedzi,
     z kolorem zależnym od quadrant: I=#39FF14, II=#A020F0, III=#FB923C, IV=#64748B

7. Refactor pages/Pulpit.tsx:
   - przeze useTasksStore zamiast initDB + reload
   - usuń lokalny emitTaskUpdated, importuj z store/events

WYMAGANIA:
- żadnego `any` w typach
- żadnych `console.log` w kodzie produkcyjnym
- importy uporządkowane (react → biblioteki → wewnętrzne)
- pliki istniejące nie tracą żadnej dotychczasowej funkcjonalności

PO ZAKOŃCZENIU: uruchom `npm run build` i upewnij się, że tsc przechodzi
bez błędów. Zgłoś listę zmienionych plików.
```

## Kryteria Akceptacji (QA) — Sprint 1

- [ ] `npm run build` przechodzi bez błędów TypeScript.
- [ ] `npm run dev` startuje, w DEV widać 8 zadań fixture'owych po pierwszym uruchomieniu.
- [ ] **Test reaktywności**: dodanie zadania w BrainDump → natychmiast widoczne w `tasks[]` na Pulpicie (test ręczny: przełącz tab, Hero card pokazuje nowe Q1).
- [ ] **Test pigułki**: w BrainDump odpowiedź TAK na 1 pytanie ważności + TAK na 1 pilności pokazuje pigułkę „PILNE I WAŻNE" w kolorze zielonym; zmiana 2 odpowiedzi na NIE → pigułka zmienia tekst+kolor bez refreshu.
- [ ] `processQuiz({ W1: true, W2: true, P1: true, P2: true })` zwraca `{ quadrant: 'I', isImportant: true, isUrgent: true, isComplete: false }`.
- [ ] `processQuiz({ W1: true, W2: true, W3: true, P1: false, P2: false, P3: false })` zwraca `{ quadrant: 'II', isComplete: true }`.
- [ ] Żaden plik poza `db/index.ts` nie wywołuje bezpośrednio `openDB()`.
- [ ] Grep `emitTaskUpdated` zwraca tylko `store/events.ts` jako miejsce definicji.

---

# SPRINT 2 — Brain Dump Pipeline + Overload + Strategic Modals

## Cel

- **Biznesowy:** Użytkownik może wpisać dowolne zadanie, przejść 6-pytaniowy quiz i otrzymać poprawnie zaklasyfikowaną kartę w odpowiednim quadrancie. System blokuje dodanie 6. zadania do Q1 (Ekran 10 Overload). Dla Q2/Q3/Q4 pop-upy strategiczne wymagają dodatkowych decyzji.
- **Techniczny:** Zamknąć cały flow Brain Dump (Ekran 03 → quiz → Q1/Q2/Q3/Q4 → strategiczne modale → IDB). Doprecyzować pop-upy 25, 26, 27. Dodać licznik `quadrant_I_Count` w `appState`.

## Zadania

### 2.1. Pełny stan quizu (state machine)
- **Pliki:** `kod/src/pages/BrainDump.tsx`
- **Zachowanie:** quiz traktować jako 2 osie po 3 pytania. Slider/strzałki działają tylko gdy pytanie ma odpowiedź lub się porusza wstecz. Auto-advance po odpowiedzi (już jest częściowo).
- **Walidacja:** Przycisk „DODAJ ZADANIE" aktywny dopiero gdy wszystkie 6 odpowiedzi udzielone.

### 2.2. Pipeline klasyfikacji
- **Pliki:** `kod/src/pages/BrainDump.tsx` (lub wyciągnąć do `kod/src/logic/brainDumpPipeline.ts`)
- **Zachowanie:**
  - Q1 → check Overload (selectQ1Count >= 5) → ErrorOverload modal lub `commitTask('I')`.
  - Q2 → otwórz Modal Q2 (już istnieje) → po confirm `commitTask('II', { category, scheduledDate })`.
  - Q3 → otwórz Modal Q3 → po wyborze strategii `commitTask('III', { strategy })`.
  - Q4 → otwórz Modal Q4 → akcja `save` → `commitTask('IV', { category })`, akcja `discard` → utwórz Task z `isRejected: true` (do telemetry) lub pomiń zapis i zwiększ `appState.rejectedTasksThisMonth`.

### 2.3. Licznik Q1 i appState persystencja
- **Pliki:** `kod/src/db/index.ts` (rozszerz `saveAppState`), `kod/src/store/useTasksStore.ts`
- **Zachowanie:** Po każdej mutacji `tasks` przelicz `selectQ1Count(tasks)` i zapisz do `appState`. Czytaj z `appState` przy starcie.

### 2.4. Ekran 10 (Overload modal) jako globalny komponent
- **Pliki:** `kod/src/components/modals/OverloadModal.tsx` (nowy, ekstrakcja z BrainDump)
- **Cel:** Inne ekrany (Macierz, Centrum Planowania) też będą wywoływać overload. Eksportuj jako wielokrotnego użytku.

### 2.5. Sekcja „Dodaj notatkę" (przycisk obok „Dodaj zadanie")
- **Pliki:** `kod/src/pages/BrainDump.tsx`
- **Zachowanie:** Klik → zapisz `BrainDumpNote { type: 'unsorted' }` z aktualnym `title`, wyczyść input, emit `TaskUpdated`, przejdź na Ekran 05.

### 2.6. Ekran 05 (Notatki Brain Dump) — read view
- **Pliki:** `kod/src/pages/Notatki.tsx` (nowy)
- **Zachowanie:** Lista wszystkich `BrainDumpNote` posortowanych malejąco po `createdAt`. Każda notatka: tekst + przycisk „Klasyfikuj" (otwiera modal podobny do 03) + przycisk „Usuń".

## Pliki do edycji / utworzenia (S2)
```
kod/src/logic/brainDumpPipeline.ts          [NEW]
kod/src/components/modals/OverloadModal.tsx [NEW — extract]
kod/src/components/modals/ModalQ2.tsx       [NEW — extract]
kod/src/components/modals/ModalQ3.tsx       [NEW — extract]
kod/src/components/modals/ModalQ4.tsx       [NEW — extract]
kod/src/pages/Notatki.tsx                   [NEW]
kod/src/pages/BrainDump.tsx                 [REFACTOR — chudszy, importuje modale]
kod/src/db/index.ts                         [EDIT — saveAppState pełny]
kod/src/components/AppShell.tsx             [EDIT — route do Notatki]
```

## Prompt dla agenta — Sprint 2

```
ROLA: Senior React Engineer.

KONTEKST: Sprint 1 zakończony. useTasksStore działa. BrainDump.tsx jest zbyt
duży (~320 linii). Modale Q2/Q3/Q4 i ErrorOverload są zaszyte w BrainDump.

ZADANIE:

1. Wyekstrahuj modale do osobnych plików:
   - components/modals/ModalQ2.tsx (Q2 — kategoria + planNow toggle)
   - components/modals/ModalQ3.tsx (Q3 — wybór Strategy)
   - components/modals/ModalQ4.tsx (Q4 — kategoria + save/discard)
   - components/modals/OverloadModal.tsx (Q1 pełne — 5 zadań)
   Każdy modal: typed props (onClose, onConfirm), żadnego stanu globalnego.

2. Utwórz logic/brainDumpPipeline.ts z funkcją:
   commitTaskFromQuiz(store, title, answers, strategicData?) → Promise<Task | 'overload'>
   Pipeline: processQuiz → jeśli Q1 i count>=5 zwróć 'overload'; w przeciwnym
   razie zbuduj Task z domyślnymi polami i wywołaj store.addTask.

3. Refactor pages/BrainDump.tsx: ma być cienkim orchestrationem — input title,
   dwa carousels pytań, pigułka, przyciski. Modale i overload renderowane warunkowo
   na bazie state ('idle' | 'modal:Q2' | 'modal:Q3' | 'modal:Q4' | 'overload').

4. Dodaj utworzenie BrainDumpNote przez przycisk „Dodaj notatkę":
   addNote({ id: crypto.randomUUID(), text: title, type: 'unsorted',
              createdAt: new Date().toISOString(), promotedToTaskId: null }).
   Po dodaniu: wyczyść title, nawiguj do '#notatki'.

5. Utwórz pages/Notatki.tsx — lista BrainDumpNote z store. Każda nota:
   tekst, data, przycisk „Usuń" (store.deleteNote), przycisk „Klasyfikuj"
   (na razie placeholder: alert „Coming in Sprint 3"). Sortuj malejąco po createdAt.

6. Update components/AppShell.tsx: dodaj route 'notatki' do switcha
   activeTab (poza Tab Barem — przejście przez window.location.hash =
   '#notatki' lub przez prop). Najpierw zrób tymczasowy hash-router.

7. Update db/index.ts: pełna implementacja saveAppState — zapisuje wszystkie
   pola AppState w odpowiednich kluczach ('global', 'counts', 'session').

WYMAGANIA TYPÓW: Każdy modal ma typowane props z dyskryminowanym union dla
danych zwrotnych. Brak `any`.

PO ZAKOŃCZENIU: zweryfikuj manualnie 4 ścieżki:
   - Brain Dump → wszystkie TAK → karta Q1 na Pulpicie.
   - Brain Dump → quiz Q2 → ModalQ2 → karta Q2 (test: idź do MacierzView w S3 i sprawdź).
   - Brain Dump → quiz Q1 gdy quadrant_I_Count >= 5 → OverloadModal.
   - „Dodaj notatkę" → nota widoczna w Notatki.tsx.
```

## Kryteria Akceptacji (QA) — Sprint 2

- [ ] BrainDump.tsx ma < 150 linii (orchestration only).
- [ ] Quiz: po 6 odpowiedziach przycisk „DODAJ ZADANIE" się aktywuje; przed tym jest disabled (sprawdzić `disabled={!isComplete}` w DevTools).
- [ ] **Test Overload**: w DEV ustaw seed na 5 zadań Q1, otwórz BrainDump, wymuś quiz → Q1, kliknij DODAJ → pojawia się OverloadModal.
- [ ] **Test Q4 reject**: ModalQ4 → przycisk „Odrzuć/Zapomnij" → task NIE pojawia się w żadnym widoku, ale `appState.rejectedTasksThisMonth` zwiększa się o 1 (sprawdź w IDB DevTools).
- [ ] **Test Q3**: quiz Q3 → ModalQ3 → wybierz „W przerwie" → task w IDB ma `strategy: 'WPrzerwie'`.
- [ ] **Test notatki**: przycisk „Dodaj notatkę" tworzy `BrainDumpNote { type: 'unsorted' }`, widoczną w `pages/Notatki.tsx`.
- [ ] Modale można zamknąć kliknięciem w overlay (test: kliknij obok modala → modal znika, task NIE zostaje zapisany).
- [ ] `quadrant_I_Count` w `appState` jest aktualizowany po każdym add/delete/markDone zadania Q1.

---

# SPRINT 3 — Macierz + Widoki Wirtualne + Context Menu

## Cel

- **Biznesowy:** Użytkownik widzi swoje zadania w 4 układach: macierz (02), listy (07, 08, 21, 22, 23), dzienne (20, 24) i historyczne (11). Każde zadanie ma jednolite Context Menu (29) z akcjami Zrobione/Edytuj/Usuń/Notatka/Start Focus.
- **Techniczny:** Wszystkie ekrany listowe to **selektory** nad `tasks` z `useTasksStore`. Zero duplikatu logiki. Wspólny komponent `<TaskCard />` i `<ContextMenu />`.

## Zadania

### 3.1. Komponent `<TaskCard />` (wielokrotnego użytku)
- **Pliki:** `kod/src/components/TaskCard.tsx` (nowy)
- **Props:** `{ task: Task; variant: 'pill' | 'card' | 'matrix'; onAction?: (action: ContextAction) => void }`
- **Zachowanie:** Renderuje zadanie w 3 wariantach. Long-press 500ms → wywołuje `onAction('openMenu')`. Animacja `slide-out-left + fade-out 200ms` przy akcji Zrobione.

### 3.2. Komponent `<ContextMenu />` (Ekran 29)
- **Pliki:** `kod/src/components/ContextMenu.tsx` (nowy)
- **Props:** `{ task: Task; onClose: () => void; onAction: (action: ContextAction) => void }`
- **Akcje:** `'done' | 'edit' | 'note' | 'startFocus' | 'delete'`. Notatka → nawigacja do Ekranu 28 (placeholder w S3, pełny w S5).

### 3.3. Ekran 02 — Macierz Eisenhowera
- **Pliki:** `kod/src/pages/Macierz.tsx` (nowy)
- **Zachowanie:** 4 ćwiartki w siatce 2×2. Każda ćwiartka pokazuje top 2 zadania z danego Q + pigułka „→ START FOCUS" (Q1), „→ Centrum Planowania" (Q2), „→ Hub Delegowania" (Q3), „→ Archiwum" (Q4). Etykiety osi „PILNE/NIEPILNE" + „WAŻNE/NIEWAŻNE".

### 3.4. Ekran 20 — Do zrobienia dzisiaj
- **Pliki:** `kod/src/pages/DoZrobieniaDzis.tsx` (nowy)
- **Selektor:** `selectScheduledForDate(tasks, today)` filtrowane po `!isDone && !isRejected`.

### 3.5. Ekran 24 — Wszystko na dzisiaj (virtual view)
- **Pliki:** `kod/src/pages/WszystkoNaDzis.tsx` (nowy)
- **Selektor:** Wszystko, co user ma się dziś dotknąć: Q1 otwarte + Q3 ze strategią `ZrobTeraz`/`WPrzerwie` + Habits z `today in recurringDays` + scheduled na dzisiaj. Pogrupowane sekcjami: „Priorytety (Q1)", „Proza życia (Q3)", „Nawyki".

### 3.6. Ekran 11 — Aktywność dnia (historyczna)
- **Pliki:** `kod/src/pages/AktywnoscDnia.tsx` (nowy)
- **Zachowanie:** Date picker u góry → lista zadań zrealizowanych (`isDone` z `completedAt` w tym dniu) + zaplanowanych (`scheduledDate === selectedDate`).

### 3.7. Ekrany list specjalnych
- `pages/Nawyki.tsx` — zadania z `category === 'Habit'`.
- `pages/WielkieProjekty.tsx` — zadania z `category === 'WielkiProjekt'`, sortowane po `sessionsCount` DESC.
- `pages/Inne.tsx` — `category === 'Inne'`.
- `pages/ProzaZycia.tsx` — `quadrant === 'III'`.
- `pages/Archiwum.tsx` — `quadrant === 'IV' && !isDone`.

### 3.8. Tymczasowy hash-router
- **Pliki:** `kod/src/components/AppShell.tsx`
- **Zachowanie:** Mapa hash → komponent (`#macierz` → Macierz, `#today` → WszystkoNaDzis, etc.). React Router wprowadzimy w Sprincie 5 (jeśli potrzebny).

### 3.9. Pulpit.tsx — wpięcie ContextMenu
- **Pliki:** `kod/src/pages/Pulpit.tsx`
- **Zmiana:** Usuń lokalny inline-context-menu, użyj wspólnego `<ContextMenu />`.

## Pliki (S3)
```
kod/src/components/TaskCard.tsx              [NEW]
kod/src/components/ContextMenu.tsx           [NEW]
kod/src/pages/Macierz.tsx                    [NEW]
kod/src/pages/DoZrobieniaDzis.tsx            [NEW]
kod/src/pages/WszystkoNaDzis.tsx             [NEW]
kod/src/pages/AktywnoscDnia.tsx              [NEW]
kod/src/pages/Nawyki.tsx                     [NEW]
kod/src/pages/WielkieProjekty.tsx            [NEW]
kod/src/pages/Inne.tsx                       [NEW]
kod/src/pages/ProzaZycia.tsx                 [NEW]
kod/src/pages/Archiwum.tsx                   [NEW]
kod/src/components/AppShell.tsx              [EDIT — hash router]
kod/src/store/selectors.ts                   [EXTEND — virtual views]
kod/src/pages/Pulpit.tsx                     [REFACTOR — użyj ContextMenu]
```

## Prompt dla agenta — Sprint 3

```
ROLA: Senior React Engineer, focus na separation of concerns.

KONTEKST: Sprint 2 zakończony. Mamy useTasksStore, processQuiz, modale.
Brakuje widoków list. Pulpit.tsx ma inline context menu — do wyciągnięcia.

ZADANIE:

1. components/TaskCard.tsx: komponent dla zadania w 3 wariantach.
   Props: { task, variant: 'pill'|'card'|'matrix', onAction }.
   - 'pill': rounded-[50px], jedna linia tytuł + chevron.
   - 'card': rounded-[18px], tytuł bold + kategoria/quadrant + ewentualnie progress.
   - 'matrix': mini, dla ćwiartki — tytuł + dot oznaczający quadrant.
   Long press (500ms pointerdown) → onAction('openMenu').
   Animacja: gdy task.isCompleting (zewn. state) → opacity-0 -translate-x-full
   transition-all duration-200.

2. components/ContextMenu.tsx: 5 akcji (Zrobione, Start Focus, Edytuj,
   Notatka, Usuń). API: { task, onAction(action: 'done'|'startFocus'|
   'edit'|'note'|'delete'), onClose }. Klik poza menu = onClose.

3. Utwórz pages/Macierz.tsx — siatka 2×2. Każda ćwiartka:
   const tasks = selectByQuadrant(allTasks, 'I').filter(t => !t.isDone).slice(0,5);
   Render TaskCard variant="matrix" + pigułka CTA na dole ćwiartki.
   Pigułka Q1: navigates do timer (#timer). Q2: #centrum-planowania.
   Q3: #proza. Q4: #archiwum.

4. Utwórz selektor selectAllForToday(tasks, today) zwracający:
   {
     priorities: tasks gdzie quadrant=I, isDone=false,
     prozaZycia: tasks gdzie quadrant=III, strategia in [ZrobTeraz, WPrzerwie],
     habits: tasks gdzie category=Habit i today.dayOfWeek in recurringDays,
     scheduled: tasks gdzie scheduledDate=today
   }
   Użyj w pages/WszystkoNaDzis.tsx.

5. Utwórz pages/DoZrobieniaDzis.tsx — prosta lista filtrów scheduledDate=today.

6. Utwórz pages/AktywnoscDnia.tsx — input typu date + 2 sekcje:
   „Zrealizowane" (tasks gdzie completedAt.toISODate() == selectedDate) i
   „Zaplanowane" (tasks gdzie scheduledDate == selectedDate).

7. Utwórz pages/Nawyki, WielkieProjekty, Inne, ProzaZycia, Archiwum.tsx
   — wszystkie czytają z useTasksStore + odpowiedni selektor + TaskCard.

8. Refactor components/AppShell.tsx: dodaj useEffect który czyta
   window.location.hash i ustawia state currentView. Mapa:
     '#pulpit' → Pulpit
     '#macierz' → Macierz
     '#timer' → placeholder „Coming in Sprint 4"
     '#kalendarz' → placeholder „Coming in Sprint 5"
     '#braindump' → BrainDump
     '#notatki' → Notatki
     '#today' → WszystkoNaDzis
     '#do-dzis' → DoZrobieniaDzis
     '#aktywnosc' → AktywnoscDnia
     '#nawyki' → Nawyki
     '#projekty' → WielkieProjekty
     '#inne' → Inne
     '#proza' → ProzaZycia
     '#archiwum' → Archiwum
   Tab Bar tabs ustawiają hash poprzez window.location.hash = '#...'.

9. Refactor Pulpit.tsx — zamiast inline-menu użyj <ContextMenu /> i <TaskCard />.

WYMAGANIA: Każdy ekran < 100 linii. Cała logika filtrów w selectors.ts.
Zero kopiowania kodu.

PO ZAKOŃCZENIU: w dev sprawdź każdą trasę hash i każdą akcję Context Menu
na karcie Pulpitu i Macierzy.
```

## Kryteria Akceptacji (QA) — Sprint 3

- [ ] Hash router działa: zmiana `window.location.hash` ręcznie w DevTools przełącza widoki.
- [ ] **Test virtual view 24**: dodaj zadanie Q1 + nawyk z dzisiejszym dniem tygodnia + Q3 z `strategy=ZrobTeraz` → wszystkie 3 widoczne w sekcjach `WszystkoNaDzis`.
- [ ] **Test Macierzy**: każda ćwiartka pokazuje max 5 zadań, dolna pigułka prowadzi do odpowiedniego hash.
- [ ] **Test ContextMenu**: long-press na karcie w Macierzy otwiera menu z 5 akcjami; klik „Zrobione" animuje slide-out i znika z listy (po 200ms persyst w IDB).
- [ ] **Test multi-screen reactivity**: otwórz dwie zakładki przeglądarki na tym samym `localhost:5173`, oznacz zadanie jako Zrobione w jednej → drugiej (po refreshu, bo brak BroadcastChannel jeszcze) — w MVP wystarcza pojedyncza zakładka. Notatka: BroadcastChannel jako nice-to-have w Sprincie 5.
- [ ] Wszystkie ekrany listowe < 100 linii, logika w selektorach.
- [ ] Brak duplikatu `long-press handlera` poza `TaskCard.tsx`.

---

# SPRINT 4 — Focus Timer + Auto-escalation + Raporty + Streak

## Cel

- **Biznesowy:** Użytkownik uruchamia sesję Focus (Pomodoro 25/5, 50/10, etc.), aplikacja śledzi czas i serie (streak), automatycznie eskaluje zadania Q2 do Q1 na X dni przed deadlinem, pokazuje raporty tygodniowe/miesięczne.
- **Techniczny:** Pełna implementacja `FocusSession` lifecycle. Background tab-aware timer (Page Visibility API). Engine eskalacji uruchamiany przy starcie aplikacji. Wykresy w Recharts (lub czysty SVG).

## Zadania

### 4.1. Ekran 04 — Timer (Pomodoro)
- **Pliki:** `kod/src/pages/Timer.tsx` (nowy), `kod/src/logic/timerMachine.ts` (nowy)
- **Tryby:** `25/5`, `50/10`, `5/0`, `10/5`, `15/5`, `35/5`, `90/15`. Pierwsze 2 = MVP, reszta = picker.
- **Zachowanie:** start/pause/end-early. Po cyklu 25 (work) automatyczna przerwa 5 (break) z możliwością skip. Po 4 cyklach → długa przerwa (jeśli tryb to obsługuje).
- **Stan:** `currentFocusSession: FocusSession | null` w `appState`. Po `endedAt` → zapis do `focusSessions` store.

### 4.2. Page Visibility + Wake Lock
- **Pliki:** `kod/src/logic/timerMachine.ts`
- **Zachowanie:** Timer liczy `(Date.now() - startedAt) - pausedDurationMs`. Przy `visibilitychange === 'hidden'` nie zatrzymuje liczenia (kluczowe dla ADHD: nie karać użytkownika za chwilę dekoncentracji). Opcjonalnie: Screen Wake Lock API gdy timer w trakcie sesji aktywnej.

### 4.3. Engine eskalacji
- **Pliki:** `kod/src/logic/escalationEngine.ts` (nowy)
- **Zachowanie:** Funkcja `runEscalation(tasks, today): Task[]` iteruje po taskach z `autoEscalate && scheduledDate && escalateDaysBefore`. Jeśli `daysUntil(scheduledDate) <= escalateDaysBefore && quadrant !== 'I'` → przesuń do `quadrant: 'I'`, emit `TaskUpdated`. Uruchamiana raz przy `useTasksStore` init + co 60 minut przez `setInterval`.

### 4.4. Streak dopaminowy
- **Pliki:** `kod/src/logic/streakEngine.ts` (nowy)
- **Zachowanie:** Liczy ile dni z rzędu w `focusSessions` jest sesja z `completedCycles > 0`. Update `appState.dopamineStreakCount` po każdym zakończeniu sesji. Reset gdy luka > 1 dzień.

### 4.5. Ekran 09 — Raporty
- **Pliki:** `kod/src/pages/Raporty.tsx` (nowy)
- **Sekcje:**
  - „Streak: 8 dni" (z `dopamineStreakCount`).
  - „Czas w Focusie w tym tygodniu" — sum minut z `focusSessions` ostatnich 7 dni.
  - „Zadania ukończone w Q (week/month)" — `completedTasksByQuadrant` z appState.
  - Wykres słupkowy: minuty Focus dzień po dniu (ostatnie 7 dni). Prosty SVG, bez Recharts w MVP.

### 4.6. Karta Hero na Pulpicie — wpięcie startu Focusa
- **Pliki:** `kod/src/pages/Pulpit.tsx`
- **Zmiana:** Przycisk „START FOCUS" → zapisz `currentFocusSession` z `taskId = heroTask.id`, nawiguj do `#timer`.

### 4.7. Ekran 18 — Dodaj/Edytuj Zadanie (manual)
- **Pliki:** `kod/src/pages/DodajZadanie.tsx` (nowy)
- **Zachowanie:** Manualne dodanie z pominięciem quizu (dla power-userów). Pola: title, quadrant, category, scheduledDate, scheduledTime, recurringDays (gdy Habit), autoEscalate, escalateDaysBefore. Walidacja `HH:MM` (Ekran 19 error).

## Pliki (S4)
```
kod/src/logic/timerMachine.ts          [NEW]
kod/src/logic/escalationEngine.ts      [NEW]
kod/src/logic/streakEngine.ts          [NEW]
kod/src/pages/Timer.tsx                [NEW]
kod/src/pages/Raporty.tsx              [NEW]
kod/src/pages/DodajZadanie.tsx         [NEW]
kod/src/store/useTasksStore.ts         [EDIT — focusSessions API + runEscalation init]
kod/src/pages/Pulpit.tsx               [EDIT — Start Focus]
```

## Prompt dla agenta — Sprint 4

```
ROLA: Senior React + State Machine engineer.

KONTEKST: Sprint 3 zakończony. Wszystkie widoki list działają. Brakuje
timera, eskalacji, raportów.

ZADANIE:

1. logic/timerMachine.ts: czysta funkcja-state-machine.
   State: { mode: '25/5'|'50/10'|..., phase: 'work'|'break', startedAt: number,
            pausedAt: number|null, accumulatedPauseMs: number,
            completedCycles: number }.
   API: createTimer(mode), tick(state, now) → { remainingMs, isPhaseEnd },
        pause(state, now), resume(state, now), end(state, now).
   ZERO odniesień do React.

2. pages/Timer.tsx: użyj useTasksStore + useEffect z setInterval 500ms
   na tick. Wyświetl pozostały czas (MM:SS), big circle progress (SVG
   stroke-dashoffset). Buttony: Pause/Resume, End Early, Skip Phase.
   Na koniec sesji: zapisz do focusSessions store, increment
   sessionsCount na task (jeśli quadrant=I i isWielkiProjekt). Update
   dopamineStreakCount przez streakEngine.

3. logic/escalationEngine.ts: runEscalation(tasks, today): Task[].
   Dla każdego t gdzie t.autoEscalate && t.scheduledDate && !t.isDone:
     daysUntil = (new Date(t.scheduledDate) - today) / DAY_MS;
     if (daysUntil <= t.escalateDaysBefore && t.quadrant !== 'I')
       return { ...t, quadrant: 'I' };
   Zwróć tablicę zmodyfikowanych zadań.
   W useTasksStore: po init wywołaj runEscalation, zapisz zmiany.
   Dodaj setInterval(() => runEscalation, 60_000 * 60) co godzinę.

4. logic/streakEngine.ts: computeStreak(focusSessions, today): number.
   Iteruj wstecz dzień po dniu od today. Jeśli w danym dniu jest sesja
   z completedCycles > 0 → +1. Pierwszy dzień luki = stop. Zwróć licznik.
   Aktualizuj appState.dopamineStreakCount po każdej sesji.

5. pages/Raporty.tsx: 3 karty (streak, czas w focusie, completed per Q)
   + wykres słupkowy (czysty SVG). Daj możliwość przełączenia tydzień/miesiąc.

6. pages/DodajZadanie.tsx: form z polami zgodnymi z Task. Walidacja
   scheduledTime regex `^([01]\d|2[0-3]):[0-5]\d$|^AllDay$`. Jeśli
   niezgodne → komunikat „Format GG:MM" (Ekran 19).

7. Pulpit.tsx: button START FOCUS → store.startFocusSession(heroTask.id)
   → window.location.hash = '#timer'. W useTasksStore dodaj:
     startFocusSession(taskId, mode='25/5'),
     endFocusSession(sessionId, completedCycles, endedEarly).

WYMAGANIA:
- timer NIE zatrzymuje się gdy zakładka w tle (test: setTimeout +
  visibilitychange + sprawdź Date.now()-based liczenie).
- żadne ustawienia timera nie są w localStorage poza appState.
- escalation działa nawet gdy app był wyłączony 3 dni — przy starcie
  policz dla wszystkich tasków.

PO ZAKOŃCZENIU: Test scenariuszy:
  A. Ustaw seed: task Q2 ze scheduledDate=+1 dzień, autoEscalate=true,
     escalateDaysBefore=2 → po restarcie app musi być w Q1.
  B. Uruchom timer 25/5, przełącz tab na 3 min, wróć → licznik zmalał
     o 3 min.
  C. Zakończ sesję, sprawdź dopamineStreakCount === 1.
```

## Kryteria Akceptacji (QA) — Sprint 4

- [ ] **Test eskalacji**: seed task Q2 ze scheduledDate = today + 1 dzień, `autoEscalate=true`, `escalateDaysBefore=2` → restart aplikacji → task ma `quadrant: 'I'`.
- [ ] **Test timera w tle**: uruchom Pomodoro 25 min, przełącz na inną zakładkę na 3 min, wróć → wyświetlany czas ≈ 22 min (±2s tolerancja).
- [ ] **Test streaku**: ukończ 1 sesję dzisiaj → `dopamineStreakCount === 1`. Manualnie cofnij datę systemu o 1 dzień, ukończ sesję, wróć dzień, ukończ sesję → streak === 3.
- [ ] **Test Pulpit→Timer**: klik START FOCUS na Hero → hash zmienia się na `#timer`, `currentFocusSession.taskId === heroTask.id`.
- [ ] **Test Raporty**: po 3 sesjach (różne dni) wykres słupkowy pokazuje 3 słupki o właściwych wysokościach.
- [ ] **Test walidacji godziny (ekran 19)**: w DodajZadanie wpisz „25:99" → czerwony komunikat, submit zablokowany.
- [ ] Timer nie zostawia memory leak: po końcu sesji `setInterval` jest wyczyszczony (test: profiler memory snapshot przed/po).

---

# SPRINT 5 — Visual Overhaul + Kalendarz + Notatnik + PWA

## Cel

- **Biznesowy:** Aplikacja wygląda jak finalny produkt — spójna paleta, glow, radiusy, animacje. Działa offline jako PWA. Pełne wsparcie dla Wielkich Projektów (mikro-kroki + zasoby). Kalendarz z heatmapą.
- **Techniczny:** Mass-apply UI Style Guide v2 do każdego pliku w `pages/`. Service Worker. Lighthouse PWA score ≥ 90.

## Zadania

### 5.1. Visual overhaul — masowy apply Style Guide
- **Pliki:** wszystkie `pages/*.tsx`, `components/*.tsx`
- **Reguły:**
  - Kontener strony: `px-4 py-6 space-y-6`.
  - Karty: `rounded-[18px]`, czarne tło, obrys w kolorze quadrantu, glow `0 0 15px`.
  - Pigułki: `rounded-[50px]`.
  - Tekst drugorzędny: `#B0B0B0`.
  - Tekst główny: `#FFFFFF`.
  - Tło aplikacji: `#000000`.
  - Animacje: `transition-all duration-200`, slide-out left dla complete.

### 5.2. Ekran 17 — Kalendarz pełny z heatmapą
- **Pliki:** `kod/src/pages/Kalendarz.tsx` (nowy)
- **Zachowanie:** Widok miesięczny. Każdy dzień: heatmap intensity = liczba zadań ukończonych (zielony) + liczba zaplanowanych (fioletowy). Klik na dzień → nawiguj do `#aktywnosc?date=YYYY-MM-DD`.

### 5.3. Ekran 16 — Kalendarz plany (forward-looking)
- **Pliki:** ten sam `pages/Kalendarz.tsx`, tryb przełącznika
- **Zachowanie:** Heatmap fioletowy = zadania zaplanowane forward (`scheduledDate >= today`).

### 5.4. Ekran 28 — Notatnik Projektowy
- **Pliki:** `kod/src/pages/Notatnik.tsx` (nowy)
- **Zachowanie:** Dla taska z `category=WielkiProjekt`: lista `microSteps` z checkboxami, lista `resources` z modalem 30 do dodawania, pole `noteContent` (textarea long-form).

### 5.5. Ekran 30 — Modal dodawania zasobów
- **Pliki:** `kod/src/components/modals/ResourceModal.tsx` (nowy)
- **Zachowanie:** Dwie zakładki: „Link" (input URL) / „Plik" (input file → przechowuj File w IndexedDB jako Blob).

### 5.6. Ekran 06 — Centrum Planowania (Hub)
- **Pliki:** `kod/src/pages/CentrumPlanowania.tsx` (nowy)
- **Zachowanie:** Hub z 4–6 pigułkami: „Nawyki", „Wielkie Projekty", „Inne", „Kalendarz", „Dodaj zadanie". Layout Hub & Spoke.

### 5.7. PWA + offline
- **Pliki:** `vite.config.ts` (jeśli istnieje), `public/manifest.webmanifest`, `public/sw.js` (lub przez `vite-plugin-pwa` który już jest w deps).
- **Zachowanie:** Konfiguracja `vite-plugin-pwa` z runtime caching dla assets, fallback do `index.html` dla SPA. `manifest.webmanifest`: name, icon 192/512, theme `#000`, display `standalone`.

### 5.8. Onboarding (3 slajdy)
- **Pliki:** `kod/src/pages/Onboarding.tsx` (nowy)
- **Zachowanie:** Pokazywany przy pierwszym uruchomieniu (`localStorage.onboarded !== 'true'`). 3 ekrany: „Co to FocusFlow", „Brain Dump", „Macierz". Skip button. Po zakończeniu: `localStorage.onboarded = 'true'`.

### 5.9. BroadcastChannel dla multi-tab (nice-to-have)
- **Pliki:** `kod/src/store/events.ts`
- **Zachowanie:** Drugi kanał obok `window.dispatchEvent`: `new BroadcastChannel('FocusFlowSync')`. Emitery wysyłają do obu. Subskrypcje słuchają obu.

## Pliki (S5)
```
kod/src/pages/Kalendarz.tsx               [NEW]
kod/src/pages/Notatnik.tsx                [NEW]
kod/src/pages/CentrumPlanowania.tsx       [NEW]
kod/src/pages/Onboarding.tsx              [NEW]
kod/src/components/modals/ResourceModal.tsx [NEW]
kod/src/store/events.ts                   [EDIT — BroadcastChannel]
vite.config.ts                            [EDIT — PWA plugin config]
public/manifest.webmanifest               [NEW]
public/icons/icon-192.png + icon-512.png  [NEW]
WSZYSTKIE pages/*.tsx                     [EDIT — Style Guide apply]
```

## Prompt dla agenta — Sprint 5

```
ROLA: Senior Frontend Engineer + DesignOps.

KONTEKST: Sprint 4 zakończony. Wszystkie logiki działają. Teraz overhaul UI.

ZADANIE:

1. Dla każdego pliku w kod/src/pages/* (poza Pulpit.tsx i BrainDump.tsx,
   które już mają Style Guide v2) zastosuj reguły:
   - container: className="px-4 py-6 space-y-6 animate-in fade-in
     slide-in-from-bottom-4 duration-700"
   - karty: rounded-[18px], obrys w kolorze quadrantu, glow 0 0 15px
   - pigułki: rounded-[50px]
   - drugorzędny tekst: style={{ color: '#B0B0B0' }}
   - tekst Q-label: tracking-[0.2em] uppercase font-black

2. Utwórz pages/Kalendarz.tsx:
   - widok miesięczny, siatka 7×N
   - dla każdego dnia oblicz intensity zrobionych (green) i planowanych (purple)
   - opacity = min(0.1 + count * 0.15, 1.0)
   - klik dnia → setLocation('#aktywnosc?date=' + iso)

3. Utwórz pages/Notatnik.tsx (dla WielkichProjektów):
   - param ?taskId=... w hashu
   - microSteps z checkboxami (klik → toggle isDone, store.updateTask)
   - resources lista + przycisk „+ Dodaj" → ResourceModal
   - textarea noteContent z auto-save (debounce 500ms)

4. components/modals/ResourceModal.tsx: 2 tabs (Link / Plik).
   Link: input + button Dodaj → resource type='link'.
   Plik: <input type="file" onChange> → odczytaj jako Blob, zapisz do IDB
   w nowym store 'files' (rozszerz db/index.ts).

5. Utwórz pages/CentrumPlanowania.tsx — Hub z 6 pigułkami w siatce 2x3:
   Nawyki, Wielkie Projekty, Inne, Kalendarz, Dodaj zadanie, Macierz.

6. Onboarding.tsx: 3 slajdy z swipe (Touch events), localStorage flag.

7. Konfiguracja vite-plugin-pwa w vite.config.ts:
   registerType: 'autoUpdate',
   includeAssets: ['favicon.ico'],
   manifest: { name: 'FocusFlow', short_name: 'FocusFlow', theme_color:
   '#000000', background_color: '#000000', display: 'standalone', icons: [
   { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
   { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
   ] }

8. store/events.ts: dodaj BroadcastChannel obok window.dispatchEvent.
   emitTaskUpdated emituje do obu. subscribeTaskUpdated nasłuchuje obu.

WYMAGANIA:
- Lighthouse PWA score ≥ 90 (test po build).
- Zero hardcoded rgb/hex w kodzie — wszystko przez colors.ts / GLOW.
- Brak `style={{...}}` poza inline glow box-shadow.

PO ZAKOŃCZENIU: deploy preview do Vercel/Netlify, screenshot każdego
ekranu, audit Lighthouse.
```

## Kryteria Akceptacji (QA) — Sprint 5

- [ ] Lighthouse: Performance ≥ 80, Accessibility ≥ 90, PWA ≥ 90.
- [ ] Aplikacja działa offline: Network → Offline w DevTools → wszystkie widoki nadal renderują dane z IDB.
- [ ] Kalendarz: heatmap pokazuje intensywność dla dni z różną liczbą zadań.
- [ ] Notatnik: toggle microStep → persyst w IDB → re-render bez refresh.
- [ ] Resource modal: upload pliku → plik zapisany w nowym store `files`, widoczny na liście resources.
- [ ] BroadcastChannel: 2 zakładki otwarte → mutacja w jednej widoczna w drugiej w < 1s **bez refreshu**.
- [ ] Onboarding pokazuje się tylko przy pierwszym uruchomieniu (sprawdź: clear `localStorage.onboarded` → reload → pojawia się).
- [ ] Każdy ekran wizualnie zgodny ze Style Guide v2 (manual review na bazie ekranu 01 jako wzorca).
- [ ] PWA install prompt działa: na Chrome Android pojawia się „Add to home screen", po instalacji odpala się w trybie `standalone`.

---

# Dodatki

## A. Macierz odpowiedzialności QA

| Sprint | Manual QA | Automated tests (opcjonalnie) |
|---|---|---|
| S1 | 8 scenariuszy z listy | unit testy dla `processQuiz` (Vitest) |
| S2 | 7 scenariuszy | unit dla `brainDumpPipeline`, integration dla Overload |
| S3 | 6 scenariuszy | unit dla selektorów |
| S4 | 7 scenariuszy | unit dla `escalationEngine`, `streakEngine`, `timerMachine` |
| S5 | 9 scenariuszy + Lighthouse | E2E w Playwright (golden path: onboarding → brain dump → timer → report) |

## B. Ryzyka i mitygacje (cały MVP)

| Ryzyko | Prawdopodobieństwo | Mitygacja |
|---|---|---|
| Czas timera dryfuje przy długich sesjach | Niskie | `Date.now()`-based liczenie, nie `setInterval` count |
| IDB transakcje konfliktują (race) | Średnie | Każda mutacja w 1 transakcji; lock przez kolejkę w `useTasksStore` |
| `BroadcastChannel` brak wsparcia (starsze Safari) | Niskie | feature-detect, fallback do `storage` event |
| Bundle size > 500 KB | Średnie | tree-shake, code-split per route (React.lazy) w Sprincie 5 |
| Eskalacja eskaluje zbyt agresywnie | Średnie | testy edge case'ów (`escalateDaysBefore=2` + zadanie sprzed 1 dnia) |
| Pierwszy seed nadpisuje dane usera | Wysokie | seed tylko gdy IDB pusty (`tasks.count() === 0`) |

## C. Mapowanie Sprint → Ekrany 33

| Ekran # | Nazwa | Sprint |
|---|---|---|
| 01 | Pulpit | **DONE** (v2) |
| 02 | Macierz Eisenhowera | S3 |
| 03 | Brain Dump - formularz | S2 |
| 04 | Timer | S4 |
| 05 | Notatki Brain Dump | S2 |
| 06 | Centrum Planowania | S5 |
| 07 | Proza życia | S3 |
| 08 | Archiwum: Nie Teraz | S3 |
| 09 | Raporty | S4 |
| 10 | Ekran błędu (Overload) | S2 |
| 11 | Aktywność dnia | S3 |
| 12, 13, 14 | Q3 info pop-upy | S3 |
| 16 | Kalendarz - plany | S5 |
| 17 | Kalendarz - widok pełny | S5 |
| 18 | Dodaj Zadanie (manual) | S4 |
| 19 | Błąd wpisywania godziny | S4 |
| 20 | Do zrobienia dzisiaj | S3 |
| 21 | Nawyki | S3 |
| 22 | Wielkie projekty | S3 |
| 23 | Inne | S3 |
| 24 | Wszystko na dzisiaj (virtual) | S3 |
| 25 | Brain Dump pop-up Q3 | S2 |
| 26 | Brain Dump pop-up Q4 | S2 |
| 27 | Brain Dump pop-up Q2 | S2 |
| 28 | Notatnik Projektowy | S5 |
| 29 | Context Menu | S3 |
| 30 | Modal Resources | S5 |

## D. Definition of Done (per Sprint)

Każdy sprint kończy się gdy:
1. Wszystkie zadania zaakceptowane manualnie wg QA list.
2. `npm run build` przechodzi bez błędów ani warningów TS.
3. `npm run lint` przechodzi z 0 warningami.
4. Commit zawiera message `feat(sprint-N): <opis>` + tag `v0.N.0`.
5. Demo screencast (60 sekund) pokazujący kluczowy flow sprintu — wrzucony do `docs/demos/sprint-N.mp4` lub przesłany do menedżera.

## E. Następne kroki (post-MVP, nie w MVP)

- Chmurowa synchronizacja (Supabase / Firebase).
- AI sugestie zadań (Claude API → predicting quadrant z opisu).
- Współdzielenie zadań w zespole.
- Integracja Google Calendar.
- Wersja desktopowa Electron.
- Smartwatch widget (Apple Watch / Wear OS).

---

## Jak Menedżer ma korzystać z tego dokumentu

1. **Wybierz Sprint** do realizacji.
2. **Otwórz Cascade/Kilocode**, skopiuj **dokładny prompt agenta** z odpowiedniej sekcji.
3. **Sprawdź wynik** wg listy QA Kryteriów Akceptacji.
4. **Akceptuj lub odrzuć**: jeśli ≥ 1 kryterium nie spełnione, wróć do agenta z konkretną informacją „kryterium X nie działa, bo Y".
5. **Tag wersji** po zaakceptowaniu sprintu (`git tag v0.N.0`).
6. **Demo** na własny użytek lub do portfolio.

**Sugestia rytmu pracy:** 1 sprint = 1 tydzień kalendarzowy, 1 dzień buforowy między sprintami na QA i refleksję. Nie skracaj QA — gorzej, jeśli Sprint 3 wymaga refaktoru bazy ze Sprintu 1.
