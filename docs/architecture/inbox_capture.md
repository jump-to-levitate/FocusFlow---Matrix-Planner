# Inbox Capture Pipeline — Pure ADHD UX Pattern

> Dokumentacja techniczna potoku "zrzuć myśl z głowy" — redukcja paraliżu decyzyjnego przez eliminację tarcia na etapie wprowadzania.

---

## 1. Wizja Systemu

### Problem
Użytkownicy z cechami ADHD często doświadczają **paraliżu decyzyjnego** przy wprowadzaniu nowych zadań — każde zadanie wymaga natychmiastowej decyzji o priorytecie, co blokuje flow i prowadzi do porzucania narzędzia.

### Rozwiązanie: Pure Inbox Capture
Wzorzec **dwufazowego** wprowadzania myśli:
1. **Faza 1 — Silent Capture:** Wyrzucenie myśli z głowy do "pudełka" bez żadnych pytań
2. **Faza 2 — Batch Classification:** Późniejsza klasyfikacja zgromadzonych notatek w dedykowanym widoku

---

## 2. Architektura Danych

### Kontrakt `quadrant: 0`

```typescript
// db/dexie.ts
export interface Task {
  id?: number;
  title: string;
  quadrant: 0 | 1 | 2 | 3 | 4;  // 0 = Inbox Note (unassigned)
  completed: boolean;
  createdAt: Date;
}
```

| Wartość | Semantyka | Widoczność |
|---------|-----------|------------|
| `0` | Unassigned Inbox Note | BrainDumpScreen 'notes' only |
| `1-4` | Q1-Q4 Eisenhower | MatrixScreen + Dashboard stats |

### Zasady Izolacji Q0

```typescript
// MatrixScreen.tsx — bezwzględna izolacja
const tasks = safeTasks.filter(
  t => !t.completed && t.quadrant !== 0  // Q0 nigdy nie trafia do macierzy
);

// Dashboard — licznik Q0 jako osobna metryka
const q0Count = tasks.filter(t => t.quadrant === 0).length;
```

---

## 3. Fazy Potoku

### Faza 1: Silent Capture (Potok Cichy)

**Dashboard Quick-Add:**
```typescript
// DashboardScreen.tsx
const handleQuickAdd = () => {
  db.tasks.add({
    title: quickTitle.trim(),
    quadrant: 0,           // ← Zawsze do poczekalni
    completed: false,
    createdAt: new Date(),
  });
  setQuickTitle('');      // ← Natychmiastowe czyszczenie
  inputRef.current?.focus(); // ← Autofocus recovery
};
```

**Brain Dump Input:**
```typescript
// BrainDumpScreen.tsx — capture view
<input
  ref={inputRef}
  value={dumpText}
  onKeyDown={e => e.key === 'Enter' && handleQuickSave()}
  // Enter = zapis do Q0, modal się nie otwiera
/>
```

**Zasady Silent Capture:**
- ✅ Zapis `quadrant: 0` bez modalu
- ✅ Pole czyści się natychmiast
- ✅ Autofocus wraca do inputa
- ✅ Seria wpisów bez przerwy (flow state)

### Faza 2: Batch Classification

**Maszyna Stanów Widoków w BrainDumpScreen:**

```typescript
type View = 'capture' | 'notes';

const [currentView, setCurrentView] = useState<View>('capture');
```

**Widok 'capture':**
- Input do szybkiego zrzucania
- Przycisk "START QUIZ" (quiz na nowe zadanie)
- Przycisk "TWOJE NOTATKI (X)" (przejście do widoku notes)

**Widok 'notes':**
```typescript
const inboxNotes = safeTasks.filter(
  t => t.quadrant === 0 && !t.completed
);

// Lista z akcjami:
// 🔮 Klasyfikuj — otwiera QuizModal z pre-fill
// 🗑️ Usuń — natychmiastowe usunięcie
```

---

## 4. Sygnalizacja Wizualna

### Live Counter Dashboard

```typescript
const q0Tasks = useLiveQuery(() => db.tasks.where('quadrant').equals(0).count());

// Wyświetlanie:
<p className="text-[#D000FF] animate-pulse">
  📥 Notatki w poczekalni: {q0Tasks.length}
</p>
```

**Cel:** Użytkownik widzi, że notatki "nie zniknęły" — są w poczekalni czekając na klasyfikację.

---

## 5. Rozwiązanie Problemu Zamrożonego Stanu

### Problem
Przekazywanie tekstu z Brain Dump do Quizu wymagało synchronizacji stanu pomiędzy komponentami w różnych momentach lifecycle.

### Rozwiązanie: Snapshot State + Key Re-mount

**Wzorzec w BrainDumpScreen:**
```typescript
const [quizInitialTitle, setQuizInitialTitle] = useState<string>('');

const handleStartQuiz = () => {
  // Snapshot aktualnej wartości z DOM (nie React state!)
  const rawValue = inputRef.current?.value ?? dumpText;
  setQuizInitialTitle(rawValue.trim());
  setIsQuizOpen(true);
};

// Warunkowy render z unikalnym kluczem = forced remount
{isQuizOpen && (
  <QuizModal
    key={`quiz-active-${Date.now()}`}  // ← Klucz timestamp
    isOpen={isQuizOpen}
    initialTitle={quizInitialTitle}
    skipTitleStep={false}  // ← Pokaż krok tytułowy z pre-fill
    onClose={handleQuizClose}
  />
)}

const handleQuizClose = () => {
  setIsQuizOpen(false);
  setQuizInitialTitle('');  // ← Reset stanu
};
```

**Wzorzec w useQuizForm:**
```typescript
// Dynamiczna synchronizacja — hook reaguje na zmiany initialTitle
useEffect(() => {
  if (options?.initialTitle) {
    setTaskTitleRaw(options.initialTitle);
  }
}, [options?.initialTitle]);

// localStorage tylko gdy brak prefill
useEffect(() => {
  if (!options?.initialTitle) {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) setTaskTitleRaw(savedDraft);
  }
}, [options?.initialTitle]);
```

**Efekt:**
- Każde otwarcie quizu = świeży komponent
- Brak konfliktów z poprzednimi stanami
- Brak konfliktów z localStorage
- Prefill działa niezawodnie

---

## 6. Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         INBOX CAPTURE PIPELINE                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [UŻYTKOWNIK WPISUJE MYŚL]                                          │
│         │                                                            │
│         ▼                                                            │
│  ┌────────────────────────────┐    ┌────────────────────────────┐   │
│  │  DASHBOARD (Quick-Add)     │    │  BRAIN DUMP (Capture)      │   │
│  │  Enter → zapisz do Q0      │    │  Enter → zapisz do Q0      │   │
│  │  Pole czyści się           │    │  Lub: START QUIZ (pre-fill)│   │
│  │  Focus wraca               │    │                            │   │
│  └────────┬───────────────────┘    └────────┬───────────────────┘   │
│           │                                 │                      │
│           ▼                                 ▼                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  BAZA DANYCH (IndexedDB)                                │      │
│  │  • Zadania z quadrant: 0 trafiają do "poczekalni"       │      │
│  │  • Niewidoczne w Matrix, widoczne w BrainDump/notes    │      │
│  └────────┬────────────────────────────────────────────────┘      │
│           │                                                          │
│           ▼                                                          │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  BRAIN DUMP — Widok 'notes'                               │      │
│  │  Lista notatek Q0 z akcjami:                              │      │
│  │  🔮 Klasyfikuj → QuizModal (onClassify update-in-place) │      │
│  │  🗑️ Usuń → natychmiastowe usunięcie                      │      │
│  └────────┬────────────────────────────────────────────────┘      │
│           │                                                          │
│           ▼                                                          │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  RE-KLASYFIKACJA                                         │      │
│  │  onClassify(id, quadrant) → db.tasks.update(id, {quadrant})│   │
│  │  Task przechodzi z Q0 → Q1/Q2/Q3/Q4 (widoczny w Matrix) │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. Files & Implementation

| Plik | Odpowiedzialność |
|------|------------------|
| `db/dexie.ts` | Definicja `Task.quadrant: 0 \| 1 \| 2 \| 3 \| 4` |
| `screens/DashboardScreen.tsx` | Silent capture, live Q0 counter |
| `screens/BrainDumpScreen.tsx` | Two-view state machine ('capture' \| 'notes') |
| `screens/MatrixScreen.tsx` | Defensive Q0 filter |
| `hooks/useQuizForm.ts` | Dynamic initialTitle sync |
| `components/quiz/QuizModal.tsx` | Key re-mount pattern |

---

## 8. Podsumowanie Architektoniczne

| Właściwość | Implementacja |
|------------|---------------|
| **State Q0** | `quadrant: 0` jako pierwsza-class citizen w typie |
| **Izolacja** | Hard filter `quadrant !== 0` w Matrix |
| **Capture** | Bezmodalowy, z autofocus recovery |
| **Batch** | Dedykowany widok 'notes' z listą Q0 |
| **Sync** | Snapshot state + key re-mount dla niezawodności |
| **UX** | Live counter, neon glow, micro-transitions |

**Status:** ✅ Production Ready — May 2026
