# ADR 005: Progressive Web App (PWA) + Offline-First Architecture

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Accepted

---

## 1. Context (Kontekst)

FocusFlow 2.0 jest projektowany jako narzędzie produktywnościowe dla osób z ADHD i executive dysfunction. Kluczowe wymagania kontekstowe:

### 1.1 Natychmiastowy Dostęp (Zero Loading Screens)

Użytkownicy ADHD doświadczają "paraliżu przed rozpoczęciem" - im więcej kroków do rozpoczęcia pracy, tym większa szansa, że nigdy nie zaczną.

- Tradycyjne aplikacje web: "Loading...", "Fetching data...", "Connecting to server..."
- **Problem:** Każdy ekran ładowania to potencjalny moment porzucenia
- **Wymaganie:** Aplikacja musi działać natychmiast po otwarciu

### 1.2 Brak Stabilnego Internetu (Mobile-First)

Docelowi użytkownicy (22-40 lat) często korzystają z aplikacji w:
- Metro/autobusie w drodze do pracy
- Kawiarniach z niestabilnym WiFi
- Podróży (samolot, pociąg)

**Wymaganie:** Pełna funkcjonalność offline - dodawanie, edycja, przeglądanie zadań bez internetu.

### 1.3 Eliminacja Paraliżu Przed Rejestracją

Standardowy flow:
```
Otwórz app → "Zarejestruj się" → Podaj email → Potwierdź email → Utwórz hasło → ... → ZAPOMNIJ O APLIKACJI
```

**Problem:** Bariery wejścia (rejestracja, logowanie, konfiguracja) eliminują użytkowników ADHD przed pierwszym użyciem.

**Wymaganie:** Zero rejestracji - użytkownik zaczyna korzystać w ciągu 2 sekund od otwarcia.

### 1.4 Prywatność i Kontrola

Osoby z ADHD często mają wrażliwość na ocenianie (Rejection Sensitive Dysphoria). Dane osobiste (zadania, cele) powinny być:
- Zapisane lokalnie, nie w chmurze
- Pod pełną kontrolą użytkownika
- Dostępne bez "udostępniania" ich aplikacji

---

## 2. Decision (Decyzja)

### 2.1 Wybrane Rozwiązanie: PWA + Offline-First + IndexedDB

**Stack Technologiczny:**
- **Progressive Web App (PWA)** - dostęp przez przeglądarkę, "Add to Home Screen"
- **Service Worker** - cache-first strategy, offline functionality
- **IndexedDB (Dexie.js)** - local database, bez backendu
- **Local-first Architecture** - dane nigdy nie opuszczają urządzenia (domyślnie)

### 2.2 Architektura

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER / PWA                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  SERVICE WORKER                     │   │
│  │  • Cache-first dla statyków (JS, CSS, HTML)       │   │
│  │  • Background sync (w przyszłości - Faza 2)        │   │
│  │  • Offline fallbacks dla wszystkich routes        │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ▲                                  │
│                          │                                  │
│  ┌───────────────────────┴─────────────────────────────┐    │
│  │                  REACT APP (Vite)                     │    │
│  │                                                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │   Matrix    │  │   Timer     │  │    Quiz     │  │    │
│  │  │   Screen    │  │   Screen    │  │   Modal     │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  │                                                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               INDEXEDDB (Dexie.js)                  │   │
│  │                                                      │   │
│  │  • Table: tasks (id, title, quadrant, completed...) │   │
│  │  • Table: notes (id, content, taskId...)            │   │
│  │  • No server, no API, no auth                       │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Manifest PWA

```json
{
  "name": "FocusFlow - ADHD Matrix Planner",
  "short_name": "FocusFlow",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#D000FF",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512" }
  ]
}
```

---

## 3. Consequences (Konsekwencje)

### 3.1 Pozytywne

| Konsekwencja | Opis |
|--------------|------|
| **Zero kosztów serwerowych** | Brak backendu = brak hostingu, maintenance, monitoringu |
| **Maksymalna prywatność** | Dane nigdy nie opuszczają urządzenia (domyślnie) |
| **Natychmiastowe działanie** | App działa offline, żadnych ekranów ładowania |
| **Zero rejestracji** | Bariery wejścia zredukowane do minimum |
| **Niezniszczalność** | Aplikacja działa nawet jeśli nasza infrastruktura padnie |
| **Mobile-native UX** | 480px constraint, touch-first, thumb-friendly |

### 3.2 Negatywne / Wyzwania

| Konsekwencja | Opis | Mitigation |
|--------------|------|------------|
| **Cykl życia Service Workera** | Aktualizacje wymagają zarządzania cache | `skipWaiting`, `clientsClaim` w SW |
| **Konflikty zapisu w IndexedDB** | Brak server-side validation | Client-side optimistic UI + rollback |
| **Limit storage (~50MB)** | Przeglądarki limitują IndexedDB | Archiwizacja starych zadań, kompresja |
| **Brak natywnych notyfikacji** | iOS ogranicza PWA notifications | Web Notifications API (Android), in-app badges (iOS) |
| **Discoverability** | Brak App Store presence | Landing page SEO, Reddit/Discord communities |

### 3.3 Ograniczenia Techniczne

| Ograniczenie | Obejście |
|--------------|----------|
| **Background sync** | Periodic Sync API (Chrome) / manual sync (Faza 2) |
| **Push notifications** | Web Push (Android), Email digests (iOS fallback) |
| **File system access** | Export/Import JSON (ręczny backup) |
| **Multi-device sync** | CRDT/WebRTC (opcjonalna Faza 2) |

---

## 4. Alternatives Considered (Alternatywy Rozważane)

| Alternatywa | Dlaczego Odrzucona |
|-------------|--------------------|
| **React Native** | Wymaga buildów natywnych, App Store review, zależności platformy |
| **Electron Desktop** | Desktop-only, brak mobile-first, heavy bundle |
| **Tradycyjny Web App (bez PWA)** | Brak offline, brak "Add to Home Screen", ładowanie przy każdym otwarciu |
| **Backend + PostgreSQL** | Serwerowe koszty, latency, single point of failure, wymaga auth |
| **Cloud Sync (Firebase)** | Zależność od zewnętrznego dostawcy, ceny, privacy concerns |

---

## 5. Implementation Notes (Notatki Implementacyjne)

### 5.1 Service Worker Configuration

```typescript
// sw.ts - Vite PWA Plugin
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// API route (fallback to cache)
registerRoute(
  ({ request }) => request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'pages-cache',
  })
);
```

### 5.2 Dexie.js Schema

```typescript
// db/dexie.ts
import Dexie, { Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  quadrant: 0 | 1 | 2 | 3 | 4;
  subcategory?: string;
  completed: boolean;
  createdAt: Date;
}

export class FocusFlowDB extends Dexie {
  tasks!: Table<Task, number>;

  constructor() {
    super('FocusFlowDB');
    this.version(1).stores({
      tasks: '++id, title, quadrant, completed, createdAt',
    });
  }
}
```

### 5.3 Offline-First UX Patterns

| Pattern | Implementacja |
|---------|---------------|
| **Optimistic UI** | Natychmiastowa aktualizacja UI, potem zapis do IndexedDB |
| **Background sync** | Queue changes w Service Worker, sync gdy online |
| **Conflict resolution** | Last-write-wins (simple) lub CRDT (Faza 2) |
| **Fallback states** | "Działasz offline" indicator, nie blocking error |

---

## 6. Success Metrics (Metryki Sukcesu)

| Metryka | Target | Measurement |
|---------|--------|-------------|
| **Time to First Task** | < 2 sekundy | Analytics: open → first interaction |
| **Offline Functionality** | 100% | Lighthouse PWA audit |
| **Bundle Size** | < 500KB | Build output |
| **Lighthouse PWA Score** | > 90 | Lighthouse CI |
| **Install Rate** | > 10% | Users who "Add to Home Screen" |

---

## 7. Related Documents

- `adr_001_choice_of_storage.md` - Wybór IndexedDB/Dexie.js
- `adr_002_mobile_first_constraint.md` - 480px constraint
- `docs/plans/01_strategy/01_mvp_roadmap.md` - Faza 1 (Local-First Core)
- `docs/plans/01_strategy/02_pre_mortem_audit.md` - Risk: "użytkownik traci dane"

---

**Status:** ✅ Accepted  
**Decision Date:** Maj 2026  
**Review Date:** Przed Faza 2 (Multi-Device Sync)
