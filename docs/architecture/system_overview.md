# System Overview - FocusFlow

## Architektura Systemu

### Warstwa Prezentacji
- **React 18** + TypeScript (strict mode, zero `any`)
- Custom store z `useSyncExternalStore`
- Tailwind CSS z neonowymi akcentami (glassmorphism)

### Warstwa Danych
- **IndexedDB** via `idb` wrapper
- Object Stores: `tasks`, `appState`, `files`
- BroadcastChannel dla synchronizacji między zakładkami

### Warstwa Logiki
- Timer State Machine (pure functions, zero React)
- Escalation Engine (Q2 → Q1 auto-przenoszenie)
- Brain Dump Pipeline (6-pytań quiz → klasyfikacja)

## Komponenty Kluczowe

```
AppShell.tsx          - Główny layout z headerem
useTasksStore.ts      - Singleton store z immutable updates
timerMachine.ts       - State machine dla timerów focus
escalationEngine.ts   - Codzienna eskalacja zadań
```

## Przepływ Danych
```
User Action → Store Mutation → IndexedDB → BroadcastChannel → UI Refresh
```