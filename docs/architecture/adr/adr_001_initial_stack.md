# ADR 001: Initial Technology Stack

> Status: ✅ Accepted  
> Data: Maj 2026  
> Autor: FocusFlow Team

---

## Context

Projekt FocusFlow to aplikacja produktywnościowa dla osób z ADHD. Kluczowe wymagania:

1. **Zero friction** - brak barier wejścia (konta, logowanie, konfiguracja)
2. **Offline-first** - musi działać bez internetu
3. **Responsywność** - mobile-first, touch-friendly
4. **Dopaminowy UI** - cyberpunkowa stylistyka z neonami
5. **Szybkość** - instant load, brak waiting time

---

## Decision

Wybrano stack **React + Vite + Tailwind CSS + Dexie.js**.

### Komponenty Stacku

| Technologia | Rola | Uzasadnienie |
|-------------|------|--------------|
| **React 18** | UI Library | Komponenty, hooks, reaktywność |
| **TypeScript** | Typowanie | Bezpieczeństwo, autocompletion |
| **Vite** | Build Tool | Szybkie HMR, optymalizacja |
| **Tailwind CSS** | Styling | Utility-first, szybki development |
| **Dexie.js** | Database | Wrapper IndexedDB, offline-first |
| **Lucide React** | Icons | Spójny zestaw ikon |
| **Wouter** | Routing | Lightweight (~1KB) |

---

## Consequences

### Positive

1. **Brak backendu** - redukcja złożoności i kosztów infrastruktury
2. **Zero deployment issues** - static hosting (Vercel/Netlify)
3. **Instant startup** - brak autoryzacji, baza lokalna
4. **Privacy by design** - dane nigdy nie opuszczają urządzenia
5. **Single source of truth** - Dexie + React Query (via hooks)

### Negative

1. **Brak sync** - dane nie synchronizują się między urządzeniami
2. **Limit IndexedDB** ~60MB w przeglądarkach mobilnych
3. **Brak wieloużytkownikowości** - single player only
4. **Risk data loss** - bez backupu w chmurze

### Mitigations

- Eksport/Import JSON jako backup
- PWA z service worker dla offline
- Future: opcjonalny export do Google Drive/Dropbox

---

## Alternatives Considered

| Stack | Dlaczego odrzucono |
|-------|-------------------|
| Next.js + Vercel | Zbyt ciężki, niepotrzebny SSR dla SPA |
| Firebase | Wymaga konta Google, vendor lock-in |
| SQLite (via sql.js) | Brak persistence, większy bundle |
| Electron/Tauri | Overkill dla web app, większy download |
| React Native | Brak hot-reload web, złożoność |

---

## Related Decisions

- ADR 002: Q0 Isolation (Inbox Capture)
- ADR 003: Timer Timestamp Delta
- ADR 004: Synchronous Derived State

---

## References

- [Dexie.js Docs](https://dexie.org/)
- [Vite Comparison](https://vitejs.dev/guide/why.html)
- [Tailwind Philosophy](https://tailwindcss.com/docs/utility-first)
