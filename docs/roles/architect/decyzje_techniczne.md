# Decyzje Techniczne (Technical Decisions)

> Technical Decisions Specification  
> Document ID: ARCH-TECH-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Principal Software Architect

---

## 1. Wybór Stosu Technologicznego

### 1.1 Architektura: React 18 + Vite + TypeScript + Dexie.js + PWA

| Komponent | Technologia | Uzasadnienie (ADHD/Biznes) |
|-----------|-------------|---------------------------|
| **Frontend Framework** | React 18 | Komponentowy model, reużywalność, ecosystem, Concurrent Features |
| **Language** | TypeScript | Type safety, lepsza refaktoryzacja, eliminacja runtime errors |
| **Build Tool** | Vite | Instant dev server (HMR < 50ms), fast production builds, native ESM |
| **Styling** | Tailwind CSS | Utility-first, **430px constraint enforcement**, design system consistency |
| **Database** | Dexie.js (IndexedDB wrapper) | **Zero network latency**, offline-first, local-only, Promise-based API |
| **PWA** | Service Worker + Manifest | Offline functionality, "Add to Home Screen", no app store friction |
| **State Management** | React Context + Hooks | **Synchroniczny derived state**, brak async race conditions |

### 1.2 Uzasadnienie: Zero Network Latency

**Problem:** Standardowe aplikacje webowe wymagają:
- Serwera backend (koszty, maintenance)
- API calls (latency 100-500ms, timeouty)
- Autentykacji (bariera wejścia, 70% drop-off dla ADHD)
- Połączenia internetowego (nie działa w metro/samolocie)

**Solution - Local-First Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL-FIRST ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  REACT APP (Vite + TypeScript)                      │   │
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
│   │  ┌─────────────────────────────────────────────┐   │   │
│   │  │     useLiveQuery (Reactive Subscriptions)     │   │   │
│   │  │     Auto-refresh UI on DB transactions       │   │   │
│   │  └─────────────────────────────────────────────┘   │   │
│   └──────────────────────┬─────────────────────────────┘   │
│                          │                                  │
│   SERVICE WORKER (PWA)   │                                  │
│   ┌──────────────────────┴─────────────────────────────┐     │
│   │  • Cache-first strategy                          │     │
│   │  • Stale-while-revalidate                        │     │
│   │  • Precache static assets                        │     │
│   └──────────────────────────────────────────────────┘     │
│                          │                                  │
│   INDEXEDDB (Dexie.js)   │                                  │
│   ┌──────────────────────┴─────────────────────────────┐     │
│   │  Table: tasks (id, title, quadrant, subcategory)   │     │
│   │  Table: notes (id, content, taskId, createdAt)   │     │
│   │  Table: settings (key, value)                    │     │
│   │  • ACID transactions                             │     │
│   │  • Index-based queries                           │     │
│   │  • Zero network latency                          │     │
│   └──────────────────────────────────────────────────┘     │
│                                                             │
│   [NO BACKEND] [NO API CALLS] [NO AUTHENTICATION]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Uzasadnienie Local-First & Dexie.js

### 2.1 LocalStorage vs Dexie.js / IndexedDB

| Kryterium | LocalStorage | Dexie.js (IndexedDB) | Zwycięzca |
|-----------|--------------|----------------------|-----------|
| **Pojemność** | ~5-10 MB | ~50-250 MB+ | Dexie.js |
| **Asynchroniczność** | Synchroniczny (blokuje UI) | Asynchroniczny (Promise) | Dexie.js |
| **Struktura danych** | Tylko stringi (JSON.parse) | Obiekty, indeksy, relacje | Dexie.js |
| **ACID** | Nie (brak transakcji) | Tak (atomic transactions) | Dexie.js |
| **Performance** | O(n) przy dużych danych | O(1) z indeksami | Dexie.js |
| **API** | Low-level, verbose | High-level, Promise-based | Dexie.js |

### 2.2 Dlaczego Dexie.js (nie czysty IndexedDB)

**Czysty IndexedDB:**
```javascript
// Verbose, callback hell, error-prone
const request = indexedDB.open('mydb', 1);
request.onupgradeneeded = (event) => { /* ... */ };
request.onsuccess = (event) => { /* ... */ };
request.onerror = (event) => { /* ... */ };
```

**Dexie.js:**
```typescript
// Clean, Promise-based, TypeScript-friendly
const db = new Dexie('focusflow') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
};

await db.tasks.add({ title: 'Zadanie', quadrant: 1 });
```

**Kluczowe zalety Dexie.js:**
- **useLiveQuery hook** - reaktywne subskrypcje, UI auto-refresh
- **TypeScript support** - full type safety dla schematu
- **Promise-based API** - async/await zamiast callbacków
- **Compound queries** - complex filters z indeksami

---

## 3. React Context vs Redux/Zustand

### 3.1 Decyzja: Context + useReducer dla TimerContext

**Wybrane:** React Context + useReducer (zamiast Redux/Zustand)

| Kryterium | Redux/Zustand | React Context | Uzasadnienie |
|-----------|---------------|---------------|--------------|
| **Bundle size** | +10-20KB | 0KB (built-in) | Mniejszy payload |
| **Learning curve** | Wymaga znajomości | Native React | Niższy barrier entry |
| **Timer precision** | Async dispatch | **Synchroniczny update** | ⭐ Krytyczne dla timera |
| **Race conditions** | Możliwe (async) | **Eliminowane** | ⭐ Krytyczne dla timera |
| **Dependencies** | External library | Brak | Mniejszy attack surface |
| **Debuggowanie** | Redux DevTools | Console.log + React DevTools | Wystarczające |

### 3.2 Dlaczego Synchroniczny Stan jest Krytyczny dla Timera

**Problem:** Timer wymaga **deterministycznych, synchronicznych aktualizacji**.

**Redux/Zustand (Async):**
```javascript
// Problem: dispatch jest async, mogą wystąpić race conditions
dispatch({ type: 'TICK', payload: newTime });
// UI może nie zaktualizować się natychmiast (batching, throttling)
```

**React Context (Synchroniczny):**
```typescript
// Natychmiastowa propagacja stanu
dispatch({ type: 'TICK' }); // Synchroniczny update
// TimerContext.updateTime() wywołuje się natychmiast
// setInterval(1000) jest deterministyczny
```

**Dodatkowe wymagania timera:**
- Unix Delta Timestamp (odporność na background throttling)
- Globalny singleton (TimerContext)
- Brak middleware delays

---

## 4. Rejestr Rekordów Decyzji Architektonicznych (ADR)

### 4.1 Lista Aktualnych ADR

| ID | Tytuł | Status | Data | Lokalizacja |
|----|-------|--------|------|-------------|
| **ADR-001** | Wybór Dexie.js jako silnika bazy danych offline | APPROVED | 2024-11-27 | [adr_001.md](../../architecture/adr_001.md) |
| **ADR-002** | Implementacja Unix Delta Timestamp dla synchronizacji timera | APPROVED | 2024-11-27 | [adr_002.md](../../architecture/adr_002.md) |
| **ADR-003** | Separacja obsługi dźwięku w Web Audio API | APPROVED | 2024-11-27 | [adr_003.md](../../architecture/adr_003.md) |
| **ADR-004** | Sub-matryce 2x2 dla Q2, Q3, Q4 z h-14 headers | APPROVED | 2024-12-15 | [adr_004.md](../../architecture/adr_004.md) |
| **ADR-005** | Mechanizm "Destructive Hatch" w Q4 | APPROVED | 2024-12-20 | [adr_005.md](../../architecture/adr_005.md) |
| **ADR-006** | Quiz Bypass dla Q2, Q3, Q4 | APPROVED | 2024-12-22 | [adr_006.md](../../architecture/adr_006.md) |
| **ADR-007** | PWA Audio Gesture Unlock | APPROVED | 2025-01-05 | [adr_007.md](../../architecture/adr_007.md) |

### 4.2 Proces Tworzenia ADR

```
1. IDENTYFIKACJA PROBLEMU
   └── Nowa decyzja architektoniczna wymagana
                   ↓
2. ANALIZA OPCJI
   └── Porównanie minimum 2-3 alternatyw
   └── Tabela kryteriów (jak powyżej Context vs Redux)
                   ↓
3. DRAFT ADR
   └── Utworzenie docs/architecture/adr_XXX.md
   └── Format: Context, Decision, Consequences, Alternatives
                   ↓
4. REVIEW
   └── Architect approval
   └── Developer feedback (jeśli dotyczy implementacji)
                   ↓
5. APPROVAL
   └── Status: APPROVED
   └── Aktualizacja rejestru w decyzje_techniczne.md
                   ↓
6. IMPLEMENTACJA
   └── Kod zgodny z ADR
   └── Referencja w komentarzach: "// See ADR-002"
```

### 4.3 Szablon ADR

```markdown
# ADR-XXX: [Tytuł Decyzji]

## Status
PROPOSED | APPROVED | DEPRECATED | SUPERSEDED

## Context
[Opis problemu i kontekstu, który wymusił decyzję]

## Decision
[Konkretna decyzja]

## Consequences
### Positive
- [Zaleta 1]
- [Zaleta 2]

### Negative
- [Wada 1]
- [Wada 2]

## Alternatives Considered
### [Alternatywa 1]
[Opis i dlaczego odrzucona]

### [Alternatywa 2]
[Opis i dlaczego odrzucona]

## References
- [Link do kodu]
- [Link do dokumentacji]

## Date
YYYY-MM-DD
```

---

## 5. Podsumowanie Decyzji Krytycznych

| Decyzja | Wybór | Uzasadnienie Kluczowe |
|---------|-------|----------------------|
| **Database** | Dexie.js | Zero latency, ACID, useLiveQuery |
| **State (Timer)** | Context + useReducer | Synchroniczne, deterministyczne update'y |
| **Viewport** | 430px | Pro Max Standard, thumb ergonomics |
| **Audio** | Web Audio API | No external assets, gesture unlock |
| **Build** | Vite | HMR < 50ms, fast production builds |

---

**Document ID:** ARCH-TECH-001  
**Owner:** Principal Software Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-18
