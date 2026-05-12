# Tech Stack - FocusFlow

## Frontend

| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| React | 18 | UI Library |
| TypeScript | 5.x | Typowanie statyczne |
| Vite | 5 | Build tool + HMR |
| Tailwind CSS | 3 | Styling |

## Persistence

| Technologia | Wersja | Zastosowanie |
|-------------|--------|--------------|
| IndexedDB | Browser API | Główna baza danych |
| idb | 8.x | Wrapper dla IndexedDB |

## PWA Features

| Technologia | Zastosowanie |
|-------------|--------------|
| vite-plugin-pwa | Service Worker + manifest |
| Wake Lock API | Blokowanie wygaszania ekranu |
| BroadcastChannel | Synchronizacja zakładek |

## Architektura

```
app/src/
├── pages/       # Ekran (hash routing)
├── components/  # Reusable UI
├── store/       # Global state
├── logic/       # Pure functions
├── constants/   # Config
└── db.ts        # IndexedDB wrapper
```