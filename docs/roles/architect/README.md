# Rola: Architect (Architekt) - FocusFlow

> **Odpowiedzialność:** Projektowanie architektury technicznej eliminującej opóźnienia sieciowe, zapewnienie offline-first functionality i decyzje dotyczące local-first storage.
> **Misja:** Zero latency, maximum reliability, privacy by design.

---

## 1. Decyzje Techniczne (Technical Decisions)

### 1.1 Wybór Stacku Technologicznego

**Architektura: React + Vite + Dexie.js + PWA**

| Komponent | Technologia | Uzasadnienie (ADHD/Biznes) |
|-----------|-------------|---------------------------|
| **Frontend Framework** | React 18 | Komponentowy model, reużywalność, ecosystem |
| **Build Tool** | Vite | Instant dev server, fast HMR, optimal production builds |
| **Styling** | Tailwind CSS | Utility-first, 480px constraint enforcement, design system consistency |
| **Database** | Dexie.js (IndexedDB wrapper) | **Zero network latency**, offline-first, local-only |
| **PWA** | Service Worker + Manifest | Offline functionality, "Add to Home Screen", no app store friction |
| **State Management** | React Context + Hooks | **Synchroniczny derived state**, brak async race conditions |

### 1.2 Uzasadnienie: Local-First + Dexie.js

**Problem:** Standardowe aplikacje webowe wymagają:
- Serwera backend
- API calls (latency 100-500ms)
- Autentykacji (bariera wejścia)
- Internetu (nie działa offline)

**Solution - Dexie.js IndexedDB:**

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURA FOCUSFLOW                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   BROWSER                                                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  REACT APP (Vite)                                   │   │
│   │  ┌────────────┐ ┌────────────┐ ┌────────────┐     │   │
│   │  │  Matrix    │ │   Timer    │ │   Quiz     │     │   │
│   │  │  Screen    │ │   Screen   │ │   Modal    │     │   │
│   │  └────────────┘ └────────────┘ └────────────┘     │   │
│   │                                                    │   │
│   │  ┌─────────────────────────────────────────────┐   │   │
│   │  │        GLOBAL TimerContext                  │   │   │
│   │  │  (Singleton, Unix Delta Timestamp)         │   │   │
│   │  └─────────────────────────────────────────────┘   │   │
│   │                                                    │   │
│   └──────────────────────┬─────────────────────────────┘   │
│                          │                                  │
│   SERVICE WORKER (PWA)   │                                  │
│   ┌──────────────────────┴─────────────────────────────┐     │
│   │  • Cache-first strategy                          │     │
│   │  • Offline fallbacks                             │     │
│   │  • Background sync (future)                    │     │
│   └──────────────────────────────────────────────────┘     │
│                          │                                  │
│   INDEXEDDB (Dexie.js)   │                                  │
│   ┌──────────────────────┴─────────────────────────────┐     │
│   │  Table: tasks (id, title, quadrant, subcategory)   │     │
│   │  Table: notes (id, content, taskId)              │     │
│   │  • No server, no API, no auth                    │     │
│   │  • Zero network latency                          │     │
│   └──────────────────────────────────────────────────┘     │
│                                                             │
│   [NO BACKEND] [NO API CALLS] [NO AUTHENTICATION]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Kluczowe Zalety:**
- **Zero network latency** - dane natychmiast dostępne (brak loading spinnerów)
- **Offline-first** - działa w metro, samolocie, bez internetu
- **Zero barrier entry** - brak rejestracji = 70% mniej drop-off
- **Privacy by design** - dane nigdy nie opuszczają urządzenia
- **Reliability** - brak single point of failure (serwer)

### 1.3 Decyzja: React Context vs Redux/Zustand

**Wybrane: React Context + useReducer (dla TimerContext)**

| Kryterium | Redux/Zustand | React Context | Zwycięzca |
|-----------|---------------|---------------|-----------|
| **Bundle size** | +10-20KB | 0KB (built-in) | Context |
| **Learning curve** | Wymaga znajomości | Native React | Context |
| **Timer precision** | Async dispatch | Synchroniczny update | Context |
| **Race conditions** | Możliwe | Eliminowane | Context |
| **Debuggowanie** | DevTools | Console.log | Redux |

**Uzasadnienie:** Timer wymaga **synchronicznych, deterministycznych update'ów**. Context zapewnia natychmiastową propagację stanu bez middleware.

---

## 2. Modele Systemu (System Models)

### 2.1 Struktura Danych IndexedDB (Dexie.js)

```typescript
// Schema wersji 1.0 (obecna)
interface DatabaseSchema {
  tasks: {
    id?: number;              // auto-increment
    title: string;            // max 200 chars
    quadrant: 0 | 1 | 2 | 3 | 4;  // Q0=Q0, 1-4=Matrix
    subcategory?: string;     // Q2/Q3/Q4 only
    completed: boolean;     // default: false
    createdAt: Date;          // timestamp
    updatedAt: Date;          // timestamp
  };
  
  notes: {
    id?: number;
    content: string;          // markdown/text
    taskId?: number;          // FK do tasks (linked note)
    isLinked: boolean;        // true = linked, false = free
    createdAt: Date;
  };
  
  settings: {
    id: 1;                    // singleton
    audioEnabled: boolean;    // PWA audio
    theme: 'dark' | 'light';  // default: dark
    lastSyncAt?: Date;        // Faza 2
  };
}
```

### 2.2 Globalny Stan Czasu (TimerContext)

**Architektura Singleton:**

```typescript
interface TimerContextValue {
  // Stan timera
  timeLeft: number;                    // sekundy (synchroniczny)
  timerState: 'idle' | 'running' | 'paused' | 'break';
  activeTaskId: number | null;         // powiązane zadanie
  selectedPreset: TimerPreset | null;  // aktywny preset
  showCompletionModal: boolean;        // globalny stan modalu
  
  // Audio state
  audioUnlocked: boolean;              // PWA gesture unlock
  
  // Actions
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  setActiveTask: (taskId: number | null) => void;
  setShowCompletionModal: (show: boolean) => void;
  unlockAudio: () => void;             // PWA audio unlock
}
```

**Algorytm Delta Timestamp:**

```typescript
// Inicjalizacja przy starcie
const expectedEndTime = Date.now() + (durationMinutes * 60 * 1000);

// Update co sekundę (nawet przy throttlingu)
const updateTimer = () => {
  const now = Date.now();
  const remaining = Math.max(0, expectedEndTime - now);
  setTimeLeft(remaining);  // Synchroniczny update!
  
  if (remaining === 0) {
    completeTimer();
    setShowCompletionModal(true);  // Globalny trigger
  }
};
```

**Zalety Delta Timestamp:**
- **Odporność na throttling** - `Date.now()` zawsze aktualny
- **Precyzja** - błąd max 1s (nie 10-30s jak setInterval w tle)
- **Efektywność** - brak ciągłego dekrementowania

### 2.3 Reaktywne Subskrypcje Bazodanowe (useLiveQuery)

```typescript
// Dexie.js useLiveQuery - automatyczne re-render przy zmianie danych
const tasks = useLiveQuery(
  () => db.tasks
    .where('completed').equals(0)
    .and(t => t.quadrant !== 0)  // Wyklucz Q0
    .toArray(),
  []  // dependencies
);

// Automatycznie re-renderuje komponent gdy:
// - Dodano nowe zadanie
// - Zmieniono quadrant
// - Oznaczono jako completed
```

**Flow Reaktywności:**
```
User Action → Dexie Transaction → IndexedDB Update
                                      ↓
                            useLiveQuery Subscription
                                      ↓
                            React Re-render (automatic)
```

---

## 3. Strategia Integracji (Browser Native APIs)

### 3.1 Audio Context API (PWA Audio Gesture Unlock)

**Problem:** Przeglądarki blokują `AudioContext` do momentu interakcji użytkownika (Autoplay Policy).

**Solution:** Explicit unlock przy starcie timera:

```typescript
const unlockAudio = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      setAudioUnlocked(true);
      console.log('[Audio] Context unlocked by user gesture');
    });
  } else {
    setAudioUnlocked(true);
  }
};

// Wywołanie przy kliknięciu START
<button onClick={() => {
  unlockAudio();        // 🔓 Odblokowanie!
  startTimer(preset);
}}>
  START
</button>
```

### 3.2 Web Audio API (Oscillator-based Sounds)

**Brak Zależności Zewnętrznych:** Generowanie dźwięków w locie (nie wymaga plików MP3/WAV).

```typescript
const playNotification = (
  frequency = 440,      // A4
  duration = 500,       // ms
  type: OscillatorType = 'sine'
): void => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Konfiguracja
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  // Routing
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // ADSR Envelope (Attack-Decay)
  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);  // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.00001, now + duration / 1000);
  
  // Playback
  oscillator.start(now);
  oscillator.stop(now + duration / 1000);
};

// Cyberpunk double-beep
const playTimerComplete = () => {
  playNotification(440, 200);   // A4
  setTimeout(() => playNotification(880, 300), 150);  // A5
};
```

### 3.3 Service Worker (PWA Offline-First)

**Cache-First Strategy:**

```typescript
// sw.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache wszystkich assetów z buildu
precacheAndRoute(self.__WB_MANIFEST);

// Strategia dla dokumentów (SPA fallback)
registerRoute(
  ({ request }) => request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'pages-cache',
  })
);
```

**Flow Offline:**
```
User Request → Service Worker
                    ↓
           Cache Hit? → YES → Return cached
                    ↓ NO
           Fetch from network → Cache → Return
                    ↓
           Network Error? → Return cached (offline fallback)
```

---

## 4. ADR (Architecture Decision Records)

### 4.1 Lista Aktualnych ADR

| ADR | Tytuł | Status | Kluczowa Decyzja |
|-----|-------|--------|------------------|
| [ADR 001](../../architecture/adr/adr_001_initial_stack.md) | Initial Technology Stack | ✅ Accepted | React + Vite + Dexie.js |
| [ADR 002](../../architecture/adr/adr_002_q0_isolation.md) | Q0 Isolation as Inbox | ✅ Accepted | Fizyczna separacja Q0 od Matrix |
| [ADR 003](../../architecture/adr/adr_003_timer_timestamp_delta.md) | Timer Delta Timestamp | ✅ Accepted | Unix delta zamiast setInterval |
| [ADR 004](../../architecture/adr/adr_004_synchronous_derived_state.md) | Synchronous Derived State | ✅ Accepted | useMemo zamiast useEffect |
| [ADR 005](../../architecture/adr/adr_005_pwa_offline_first.md) | PWA Offline-First | ✅ Accepted | Local-first, IndexedDB, no backend |

### 4.2 Proces Tworzenia ADR

```
Nowa Decyzja Architektoniczna
         ↓
    Draft ADR (template)
         ↓
    Review z zespołem
         ↓
    Status: Proposed → Accepted
         ↑
    Status: Proposed → Rejected (z uzasadnieniem)
```

---

## 5. Key Documents & Deliverables

### 5.1 Kluczowe Dokumenty

| Dokument | Cel | Częstotliwość Aktualizacji |
|----------|-----|---------------------------|
| [`docs/plans/master_implementation_plan.md`](../../plans/master_implementation_plan.md) | Task Pipeline, moduły | Co kwartał |
| [`docs/architecture/adr/`](../../architecture/adr/) | Decyzje architektoniczne | Na bieżąco |
| [`docs/plans/03_technical/01_database_schema.md`](../../plans/03_technical/01_database_schema.md) | Dexie.js schema | Na zmianę schema |
| [`docs/plans/03_technical/02_timer_engine.md`](../../plans/03_technical/02_timer_engine.md) | Unix Delta Timestamp | Na zmianę logiki |

### 5.2 Deliverables

- **ADR** - dla każdej istotnej decyzji architektonicznej
- **Schema Updates** - dokumentacja zmian w strukturze IndexedDB
- **Architecture Review** - w PR (czy kod jest zgodny z architekturą?)
- **Performance Audits** - czy nie ma regressji (bundle size, render times)

---

## 6. Workflow Architekta

```
1. REQUIREMENTS ANALYSIS
   └── Analiza planu funkcjonalności (FEAT_*)
   └── Identyfikacja decyzji architektonicznych
                    ↓
2. ARCHITECTURE DESIGN
   └── Wybór technologii (Trade-off Analysis)
   └── Modelowanie danych (Dexie schema)
   └── Definicja interfejsów (API komponentów)
                    ↓
3. ADR CREATION
   └── Sporządzenie ADR (Context/Decision/Consequences)
   └── Review z deweloperami
   └── Finalizacja (Accepted/Rejected)
                    ↓
4. IMPLEMENTATION SUPPORT
   └── Code review (czy zgodne z ADR?)
   └── Mentoring deweloperów
   └── Rozwiązywanie problemów architektonicznych
                    ↓
5. EVOLUTION
   └── Monitoring decyzji (czy się sprawdziły?)
   └── Aktualizacja ADR (superseded/deprecated)
   └── Refactoring plan (jeśli potrzebny)
```

---

## 7. Wzorce Architektoniczne (Patterns)

### 7.1 Direct Argument Passing (Eliminacja Race Condition)

**Problem:** Asynchroniczny wyścig stanów Reacta przy zapisie podkategorii - `useState` nie gwarantuje atomowości zapisu do IndexedDB.

**Rozwiązanie:** Bezpośrednie przekazanie wartości podkategorii jako argument funkcji zapisu:

```typescript
// Anti-pattern: Odczyt ze stanu = race condition
const submitTask = async () => {
  await db.tasks.add({ subcategory: state.subcategory }); // ❌ Stara wartość!
};

// Pattern: Direct Argument Passing
const submitTaskWithSubcategory = async (subcategory: string) => {
  await db.tasks.add({ subcategory }); // ✅ Gwarantowana wartość
};
```

**Lokalizacja:** `useQuizForm.ts` - funkcja `submitTaskWithSubcategory`

### 7.2 Manual Override State (Priorytet Predykcji)

**Problem:** Algorytm wylicza ćwiartkę, ale użytkownik chce ją nadpisać ręcznie na ekranie confirm.

**Architektura:** Trójstopniowy priorytet wyboru ćwiartki:

```typescript
const predictedQuadrant: QuadrantNumber | null = 
  manualQuadrant ??      // 1. Ręczny override (najwyższy priorytet)
  bypass ??              // 2. Bypass z pod-widoku
  computed;               // 3. Wyliczenie algorytmu (najniższy priorytet)
```

**Stan:** `const [manualQuadrant, setManualQuadrant] = useState<QuadrantNumber | null>(null)`

**Integracja:** `QuizModal.tsx` - kafelki Q1-Q4 na ekranie confirm wywołują `setManualQuadrant()`

### 7.3 Normalizacja Danych (Reaktywne Fallbacki)

**Problem:** Pola `subcategory` mogą być `null`, `undefined` lub `''`, co powoduje crash grupowania w `useLiveQuery`.

**Rozwiązanie:** Automatyczna normalizacja w zapytaniach reaktywnych:

```typescript
// Q2 Normalization
const normalizedSub = !sub || sub === '' ? 'inne' : sub;

// Q4 Normalization  
const normalizedSub = !sub || sub === '' ? 'side_questy' : sub;
```

**Lokalizacja:** `MatrixScreen.tsx` - funkcje `groupQ2BySubcategory`, `groupQ4BySubcategory`

### 7.4 Architektura Bazy Danych (Dexie.js)

**Schema IndexedDB:**
```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 0 | 1 | 2 | 3 | 4;
  subcategory?: string; // Deep context dla Q2/Q3/Q4
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}
```

**Reaktywność:** `useLiveQuery()` z Dexie.js zapewnia natychmiastowe odświeżanie UI po zmianach CRUD.

**Offline-First:** Cała aplikacja działa bez połączenia z siecią - dane przechowywane lokalnie w IndexedDB.

---

**Zasada:** "Architektura nie jest abstrakcją. Architektura to zbiór decyzji, które ułatwiają lub utrudniają zmiany w przyszłości. Decydujemy o tym, co jest łatwe, a co trudne."

