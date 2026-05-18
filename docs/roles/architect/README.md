# Rola: Architect (Architekt) - FocusFlow 2.0

> **Odpowiedzialność:** Projektowanie architektury technicznej gwarantującej zero latency, maximum reliability oraz privacy by design.  
> **Misja:** Local-first architecture, synchroniczny stan czasu, offline-first PWA.

---

## 1. Profil i Odpowiedzialność Roli

Architekt w FocusFlow odpowiada za:

- **Zero Network Latency** - Dexie.js/IndexedDB jako jedyna baza danych (brak backend)
- **Timer Precision** - Synchroniczny Context + Unix Delta Timestamp (odporność na throttling)
- **Offline-First** - PWA z Service Worker (Workbox), cache-first strategy
- **Type Safety** - TypeScript dla całego stacku, eliminacja runtime errors
- **Viewport Compliance** - Strict 430px Pro Max Standard (zmienione z 480px)
- **ADR Registry** - Rejestr 7 aktualnych decyzji architektonicznych (ADR-001 do ADR-007)

---

## 2. Mapa Artefaktów Architektonicznych (Single Source of Truth)

| Artefakt | Zawartość | Link |
|----------|-----------|------|
| **Decyzje Techniczne** | Stack (React+Vite+Dexie), ADR registry, Context vs Redux | [decyzje_techniczne.md](./decyzje_techniczne.md) |
| **Modele Systemu** | Dexie Schema, TimerContext, Delta Algorithm, Code Patterns | [modele_systemu.md](./modele_systemu.md) |
| **Integracje** | Web Audio API, AudioContext unlock, PWA Service Worker | [integracje.md](./integracje.md) |
| **Architecture ADRs** | ADR-001 do ADR-007 | [../../architecture/](../../architecture/) |

---

## 3. Diagram Architektury Systemu (Local-First Data Pipeline)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOCAL-FIRST ARCHITECTURE - FOCUSFLOW                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         BROWSER                                      │   │
│   │  ┌─────────────────────────────────────────────────────────────┐   │   │
│   │  │                  REACT 18 + VITE + TS                         │   │   │
│   │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐            │   │   │
│   │  │  │   Matrix   │  │   Timer    │  │   Quiz     │            │   │   │
│   │  │  │   Screen   │  │   Screen   │  │   Modal    │            │   │   │
│   │  │  │   (430px)  │  │   (Focus)  │  │ (2-Step)   │            │   │   │
│   │  │  └────────────┘  └────────────┘  └────────────┘            │   │   │
│   │  │                                                            │   │   │
│   │  │  ┌────────────────────────────────────────────────────────┐│   │   │
│   │  │  │         GLOBAL TimerContext (Singleton)                ││   │   │
│   │  │  │  • Unix Delta Timestamp (throttling-proof)            ││   │   │
│   │  │  │  • Synchroniczne updates (Context + useReducer)       ││   │   │
│   │  │  │  • setInterval(1000ms) + Date.now() delta             ││   │   │
│   │  │  └────────────────────────────────────────────────────────┘│   │   │
│   │  │                                                            │   │   │
│   │  │  ┌────────────────────────────────────────────────────────┐│   │   │
│   │  │  │      useLiveQuery (Dexie React Hooks)                  ││   │   │
│   │  │  │  • Auto-subscription to DB changes                      ││   │   │
│   │  │  │  • Reactive re-render on CRUD                          ││   │   │
│   │  │  └────────────────────────────────────────────────────────┘│   │   │
│   │  └─────────────────────────────────────────────────────────────┘   │   │
│   │                              │                                     │   │
│   │  ┌───────────────────────────┴─────────────────────────────────┐  │   │
│   │  │              WEB AUDIO API (Oscillator-based)                │  │   │
│   │  │  • AudioContext unlock on user gesture (START button)     │  │   │
│   │  │  • playNotification() - cyberpunk double-beep              │  │   │
│   │  │  • Square wave, 880Hz -> 1174Hz, no external files          │  │   │
│   │  └─────────────────────────────────────────────────────────────┘  │   │
│   └──────────────────────────┬────────────────────────────────────────┘   │
│                              │                                            │
│   ┌──────────────────────────┴────────────────────────────────────────┐   │
│   │                    SERVICE WORKER (Workbox)                        │   │
│   │  • precacheAndRoute(__WB_MANIFEST) - static assets              │   │
│   │  • CacheFirst (JS/CSS) - 30 days                               │   │
│   │  • StaleWhileRevalidate (Images) - 7 days                      │   │
│   │  • CacheFirst (Fonts) - 1 year                                 │   │
│   └──────────────────────────┬────────────────────────────────────────┘   │
│                              │                                            │
│   ┌──────────────────────────┴────────────────────────────────────────┐   │
│   │              INDEXEDDB (Dexie.js v4+) - Local-First DB              │   │
│   │  ┌─────────────────────────────────────────────────────────────┐  │   │
│   │  │  Table: tasks                                               │  │   │
│   │  │  • id, title, quadrant (0-4), subcategory, createdAt       │  │   │
│   │  │  • Indexes: quadrant+subcategory, createdAt                │  │   │
│   │  ├─────────────────────────────────────────────────────────────┤  │   │
│   │  │  Table: notes                                               │  │   │
│   │  │  • id, content, taskId (FK), createdAt                     │  │   │
│   │  ├─────────────────────────────────────────────────────────────┤  │   │
│   │  │  Table: settings                                            │  │   │
│   │  │  • key, value, updatedAt                                    │  │   │
│   │  └─────────────────────────────────────────────────────────────┘  │   │
│   │  • ACID transactions                                          │   │
│   │  • 50-250MB storage limit (vs 5-10MB LocalStorage)            │   │
│   │  • Zero network latency - no backend, no API calls          │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   [NO BACKEND] [NO API CALLS] [NO AUTHENTICATION] [NO EXTERNAL DEPS]       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Rejestr Dokumentów Powiązanych

### 4.1 Internal Documentation (SSOT)

| Dokument | Cel | Ścieżka |
|----------|-----|---------|
| **Tech Conventions** | Kodowanie, naming, file structure | [../../tech/conventions.md](../../tech/conventions.md) |
| **Plans Directory** | Specyfikacje PLAN_* dla wdrożenia | [../../plans/](../../plans/) |
| **System Overview** | Wysokopoziomowa architektura | [../../architecture/system_overview.md](../../architecture/system_overview.md) |
| **UX/UI Specs** | 430px constraint, design tokens | [../ux_ui/](../ux_ui/) |

### 4.2 ADR Registry (Flat Structure)

| ADR | Tytuł | Data |
|-----|-------|------|
| [ADR-001](../../architecture/adr_001.md) | Wybór Dexie.js jako silnika bazy danych offline | 2024-11-27 |
| [ADR-002](../../architecture/adr_002.md) | Implementacja Unix Delta Timestamp dla synchronizacji timera | 2024-11-27 |
| [ADR-003](../../architecture/adr_003.md) | Separacja obsługi dźwięku w Web Audio API | 2024-11-27 |
| [ADR-004](../../architecture/adr_004.md) | Sub-matryce 2x2 dla Q2, Q3, Q4 z h-14 headers | 2024-12-15 |
| [ADR-005](../../architecture/adr_005.md) | Mechanizm "Destructive Hatch" w Q4 | 2024-12-20 |
| [ADR-006](../../architecture/adr_006.md) | Quiz Bypass dla Q2, Q3, Q4 | 2024-12-22 |
| [ADR-007](../../architecture/adr_007.md) | PWA Audio Gesture Unlock | 2025-01-05 |

### 4.3 Usunięte Referencje

- ❌ ~~`master_implementation_plan.md`~~ - przestarzały, nieaktualny
- ✅ Zastąpiony przez: [../../plans/](../../plans/) jako jedyny SSOT dla specyfikacji

---

## 5. Kluczowe Decyzje Architektoniczne (Executive Summary)

| Decyzja | Wybór | Uzasadnienie Krytyczne |
|---------|-------|------------------------|
| **Database** | Dexie.js (IndexedDB) | Zero latency, ACID, useLiveQuery, 50-250MB |
| **Timer State** | Context + useReducer | Synchroniczne, deterministyczne - eliminacja race conditions |
| **Timer Algorithm** | Unix Delta Timestamp | Odporność na Safari/Chrome background throttling |
| **Viewport** | 430px | Pro Max Standard (iPhone 14/15 Pro Max) - zmienione z 480px |
| **Audio** | Web Audio API (Oscillator) | No external assets, gesture unlock, cyberpunk aesthetic |
| **PWA** | Workbox (CacheFirst + SWR) | Offline-first, background sync ready |
| **Language** | TypeScript | Type safety, DX, refaktoryzacja bez błędów |

---

**Document ID:** ARCH-README-002  
**Owner:** Principal Software Architect  
**Status:** ACTIVE  
**Last Updated:** 2026-05-18  
**Viewport:** 430px Pro Max Standard
