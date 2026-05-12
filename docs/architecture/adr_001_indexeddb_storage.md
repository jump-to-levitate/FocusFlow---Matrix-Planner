# ADR-001: Wybór IndexedDB jako warstwy persistencji

## Status
Zaakceptowane

## Kontekst
Potrzeba trwałego przechowywania danych aplikacji działającej offline-first. Wymagania:
- Przechowywanie zadań, sesji focus i statystyk
- Offline-first działanie
- Synchronizacja między zakładkami

## Decyzja
Wybrano **IndexedDB** z biblioteką `idb` jako warstwę persistencji.

## Alternatywy

| Opcja | Zalety | Wady |
|-------|--------|------|
| LocalStorage | Proste API | 5MB limit, brak zapytań |
| IndexedDB (native) | Bez limitu, transakcje | Skomplikowane API |
| Dexie.js | Łatwiejsze API | Zewnętrzna zależność |
| **idb** | **TypeScript, proste API, lekka** | **Mniej funkcji niż Dexie** |

## Konsekwencje
- Użycie `idb` wrapper dla uproszczenia API
- 3 object stores: `tasks`, `appState`, `files`
- Offline-first z pełną funkcjonalnością offline