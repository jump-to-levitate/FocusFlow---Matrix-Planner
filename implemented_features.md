# Implemented Features - FocusFlow

## Core Features

### Matrix Eisenhowera
- Podział zadań na 4 ćwiartki (Q1-Q4)
- Hard-limit 5 zadań w Q1
- Auto-eskalacja Q2 → Q1

### Timer Focus (7 trybów)
- Pomodoro `25/5`
- Flow `5/0`
- Sprint `10/5`
- Deep Work `15/5`, `35/5`, `50/10`, `90/15`

### Brain Dump
- 6-pytań quiz
- Automatyczna klasyfikacja
- Modal z opcjami strategicznymi

## Technical Features

### Store & Events
- useSyncExternalStore
- BroadcastChannel sync
- emitTaskUpdated po notify()

### IndexedDB
- tasks, appState, files stores
- clearTasks/clearAppState utilities

### PWA
- Service Worker
- Offline functionality
- Wake Lock API