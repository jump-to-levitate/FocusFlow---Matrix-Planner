# 02 Strategia Technologiczna i Architektoniczna

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone / Stabilne

---

## 1. Nazwa Dokumentu

**Strategia Technologiczna i Architektoniczna (Technology Strategy)**

---

## 2. Deklaracja Strategiczna

FocusFlow 2.0 celowo rezygnuje z tradycyjnego backendu relacyjnego (PostgreSQL/MySQL + Node.js/Rails) na rzecz **architektury offline-first opartej na IndexedDB**.

**Kluczowa przesłanka:** Eliminacja bariery wejścia - użytkownik może zacząć korzystać z aplikacji w mniej niż 2 sekundy, bez rejestracji, bez logowania, bez zgody na cookies.

---

## 3. PWA (Progressive Web App) jako Podstawa

### 3.1 Dlaczego PWA?

| Aspekt | Tradycyjna Aplikacja Natywna | PWA (Nasz Wybór) |
|--------|------------------------------|------------------|
| **Instalacja** | App Store, review process | Add to Home Screen, instant |
| **Wieloplatformowość** | iOS + Android osobno | Jedna baza kodu |
| **Aktualizacje** | Review (dni/tygodnie) | Immediate (service worker) |
| **Rozmiar** | MBs do pobrania | KBs, lazy loading |
| **Offline** | Wymaga implementacji | Natywne wsparcie (Service Worker) |

### 3.2 Architektura PWA w FocusFlow

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER / PWA                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  SERVICE WORKER                     │   │
│  │  • Cache-first strategy dla statyków                │   │
│  │  • Background sync (w przyszłości)                  │   │
│  │  • Push notifications (opcjonalnie)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ▲                                  │
│                          │                                  │
│  ┌───────────────────────┴─────────────────────────────┐    │
│  │                  REACT APP (Vite)                   │    │
│  │                                                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │    │
│  │  │   Matrix   │  │   Timer     │  │   Quiz    │  │    │
│  │  │   Screen   │  │   Screen    │  │   Modal   │  │    │
│  │  └─────────────┘  └─────────────┘  └───────────┘  │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────────────────┐   │    │
│  │  │         TimerContext (Global State)         │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               INDEXEDDB (Dexie.js)                  │   │
│  │  • Tasks (z subcategory dla Q2)                     │   │
│  │  • Notes (Free + Linked)                            │   │
│  │  • TimerState (opcjonalnie)                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Manifest PWA

```json
{
  "name": "FocusFlow - ADHD Matrix Planner",
  "short_name": "FocusFlow",
  "description": "Cyberpunk productivity system for ADHD minds",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#D000FF",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "categories": ["productivity", "health", "lifestyle"]
}
```

---

## 4. Offline-First Architecture

### 4.1 Zasady Offline-First

1. **Dane są zawsze lokalne** - IndexedDB to źródło prawdy
2. **UI działa zawsze** - brak "Loading..." spinnerów
3. **Sync jest opcjonalny** - jeśli w ogóle występuje
4. **Konflikty rozwiązywane po stronie klienta** - CRDT lub last-write-wins

### 4.2 Dexie.js jako Abstrakcja IndexedDB

```typescript
// db/dexie.ts - jedyny punkt kontaktu z "backendem"
import Dexie, { Table } from 'dexie';

export class FocusFlowDB extends Dexie {
  tasks!: Table<Task, number>;
  notes!: Table<Note, number>;

  constructor() {
    super('FocusFlowDB');
    this.version(1).stores({
      tasks: '++id, title, quadrant, subcategory, completed, createdAt',
      notes: '++id, content, taskId, createdAt, updatedAt'
    });
  }
}

export const db = new FocusFlowDB();
```

### 4.3 Live Queries (Reaktywność)

```typescript
// Automatyczne odświeżanie UI przy zmianie danych
const tasks = useLiveQuery(
  () => db.tasks.where('completed').equals(0).toArray(),
  []
);
// tasks automatycznie aktualizuje się gdy dane w IndexedDB się zmienią
```

---

## 5. Brak Tradycyjnego Backendu

### 5.1 Co Zastąpiliśmy?

| Tradycyjny Stack | Nasze Rozwiązanie | Uzasadnienie |
|------------------|-------------------|--------------|
| PostgreSQL/MySQL | IndexedDB + Dexie.js | Zero setup, zero hosting |
| Node.js/Express | Brak | Nie potrzebujemy server-side logic |
| REST API | Brak | Bezpośredni dostęp do bazy |
| Auth (JWT/OAuth) | Brak | Zero barrier to entry |
| AWS/VPS | GitHub Pages/Netlify | Static hosting wystarczy |

### 5.2 Zalety Podejścia No-Backend

- **Czas do pierwszego zadania < 2 sekundy** - otwórz, zacznij
- **100% prywatności** - dane nigdy nie opuszczają urządzenia (domyślnie)
- **Zero maintenance** - brak server uptime monitoringu
- **Niezniszczalność** - aplikacja działa nawet jeśli nasza infrastruktura padnie
- **Koszt hostingu ≈ $0** - statyczne pliki na CDN

### 5.3 Ograniczenia i Obejścia

| Ograniczenie | Obejście |
|--------------|----------|
| Brak sync między urządzeniami | Faza 2: CRDT/WebRTC (opcjonalna) |
| Brak backup w chmurze | Eksport/import JSON (ręczny) |
| Limit storage (~50MB) | Archiwizacja starych zadań, kompresja |
| Brak "social features" | Celowo - focus na individual productivity |

---

## 6. Delta Timestamp Architecture (Timer)

### 6.1 Problem: Background Throttling

Przeglądarki throttle'ują `setInterval` gdy tab jest w tle. Standardowe odliczanie przestaje działać poprawnie.

### 6.2 Rozwiązanie: Unix Timestamp Delta

```typescript
// Architektura Delta - odporna na throttling
const startTimer = (durationMinutes: number) => {
  const durationMs = durationMinutes * 60 * 1000;
  const expectedEndTime = Date.now() + durationMs;  // 🔑 Kluczowe!
  
  // Zapisz expectedEndTime w stanie (może być w IndexedDB)
  setTimerState({
    mode: 'running',
    expectedEndTime,
    durationMs
  });
};

// Sprawdzenie pozostałego czasu (może być wykonane w dowolnym momencie)
const checkTimeLeft = () => {
  const now = Date.now();
  const remaining = Math.max(0, expectedEndTime - now);
  setTimeLeft(remaining);
  
  if (remaining === 0) {
    completeSession();
  }
};
```

### 6.3 Zalety Delta Architecture

- **Działa w tle** - nawet przy throttlingu do 1s, delta jest prawidłowa
- **Działa po zamknięciu laptopa** - obudzenie = poprawna kalkulacja
- **Nie wymaga Web Worker** - prostsza architektura
- **Dokładność ~1s** - wystarczająca dla Pomodoro

---

## 7. Global State Management (TimerContext)

### 7.1 Problem: Race Conditions przy Re-renderze

Lokalny stan timera w komponencie resetuje się przy re-renderze (np. zmiana route).

### 7.2 Rozwiązanie: Global Context

```typescript
// TimerContext.tsx - singleton dla całej aplikacji
interface TimerContextValue {
  timeLeft: number;
  timerState: 'idle' | 'running' | 'paused' | 'break';
  activeTaskId: number | null;
  showCompletionModal: boolean;
  
  // Actions
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  setShowCompletionModal: (show: boolean) => void;
}

// Wrap whole app in TimerProvider
<App>
  <TimerProvider>
    <Router />
  </TimerProvider>
</App>
```

### 7.3 Zalety Global State

- **Timer działa niezależnie od widoku** - możesz przejść do Macierzy, timer nadal odlicza
- **Modal zakończenia nie znika** - globalny `showCompletionModal` przetrwa re-render
- **Jedna instancja** - brak podwójnych intervalów

---

## 8. Decyzje Architektoniczne (ADRs)

| Decyzja | Wybór | Uzasadnienie |
|---------|-------|--------------|
| **Stack** | React + Vite + Tailwind | Szybki development, mały bundle |
| **Database** | IndexedDB (Dexie.js) | Offline-first, zero backend |
| **State** | Context API + useReducer | Wystarczające bez Redux/Zustand |
| **Styling** | Tailwind + arbitrary values | Szybkość, atomic CSS |
| **Icons** | Lucide React | Consistent, tree-shakeable |
| **Build** | Vite PWA Plugin | Automatyczny Service Worker |
| **Deploy** | Netlify/Vercel | Static hosting, CI/CD |

---

## 9. Kryteria Techniczne Sukcesu

- [x] First Contentful Paint < 1.5s
- [x] Lighthouse PWA score > 90
- [x] Offline functionality 100%
- [x] Bundle size < 500KB (gzipped)
- [x] Mobile-first: działa na 320px szerokości
- [x] Zero runtime errors przy braku internetu
- [x] IndexedDB operations < 100ms

---

## 10. Przyszłość: Optional Sync (Faza 2)

W przyszłości możemy dodać **opcjonalną** synchronizację:

```
┌─────────────────────────────────────────────────────────────┐
│                    FOCUSFLOW 2.0                           │
│                   (Local-First Core)                       │
│                                                             │
│  ┌──────────────┐         ┌──────────────┐               │
│  │   Device A   │◄───────►│   Device B   │               │
│  │  (IndexedDB) │  CRDT   │  (IndexedDB) │               │
│  └──────────────┘         └──────────────┘               │
│         ▲                         ▲                        │
│         │         (opcjonalnie)    │                        │
│         └──────────┬───────────────┘                        │
│                    ▼                                        │
│            ┌──────────────┐                               │
│            │  Sync Node   │                               │
│            │  (WebRTC or  │                               │
│            │   Cloud)     │                               │
│            └──────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

**Klucz:** Sync jest opcjonalny. Aplikacja działa pełnowartościowo bez niego.

---

## 11. Powiązane Dokumenty

- `docs/plans/01_strategy/01_mvp_roadmap.md` - Strategiczne kamienie milowe
- `docs/plans/03_technical/01_database_schema.md` - Schemat Dexie.js
- `docs/plans/03_technical/02_timer_engine.md` - Architektura Delta Timestamp
- `docs/architecture/adr/` - Architecture Decision Records
