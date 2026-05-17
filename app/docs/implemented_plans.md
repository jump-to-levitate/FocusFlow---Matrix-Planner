# Implemented Plans - FocusFlow

> Szczegółowy plan wdrożenia funkcjonalności w metodyce Kamieni Milowych.
> Data ostatniej aktualizacji: Maj 2026

---

## Kamień Milowy: Inbox Capture (Q0) Architecture

### Status: ✅ 100% Completed

### Zakres
Wdrożenie architektury przechwytywania myśli w izolowanej ćwiartce "Inbox" (Q0), umożliwiającej późniejszą klasyfikację bez paraliżu decyzyjnego.

### Szczegóły techniczne wdrożenia

#### 1. Rozszerzenie modelu danych
```typescript
// Kontrakt pola quadrant
quadrant: 0 | 1 | 2 | 3 | 4

// 0 = Inbox (Q0) - stan poczekalni
// 1-4 = Kategoryzowane w Macierzy Eisenhowera
```

#### 2. Bezpieczne filtry w MatrixScreen
- **Problem**: Standardowe zapytania Dexie `.where('completed').equals(0)` nie działają z booleanami.
- **Rozwiązanie**: Bulletproof JS filtering:
  ```typescript
  const allTasks = useLiveQuery(() => db.tasks.toArray()) ?? [];
  const matrixTasks = allTasks.filter(t => !t.completed && t.quadrant >= 1 && t.quadrant <= 4);
  const inboxTasks = allTasks.filter(t => !t.completed && t.quadrant === 0);
  ```

#### 3. Rozwidlenie transakcji w QuizModal
- **Tryb A - Reklasyfikacja**: `onClassify(taskId, quadrant)` → Update in-place.
- **Tryb B - Nowe zadanie**: `db.tasks.add({ title, quadrant, completed: false })` → Insert.
- **Mechanizm decyzyjny**: Sprawdzenie `if (onClassify && classifyTaskId !== undefined)`.

#### 4. Key Re-mount Pattern
```typescript
// Wymuszenie pełnego resetu stanu quizu przy przekazywaniu notatki
<QuizModal
  key={selectedTaskId}  // Full re-mount
  initialTitle={taskTitle}
  classifyTaskId={selectedTaskId}
  onClassify={handleClassify}
/>
```

### Acceptance Criteria - Spełnione
- [x] Notatki dodane przez `/dump` mają `quadrant: 0`.
- [x] Widok `/inbox` wyświetla tylko notatki z Q0.
- [x] Widok `/matrix` wyklucza notatki z Q0.
- [x] Quiz prawidłowo klasyfikuje notatki z Q0 do Q1-Q4.
- [x] Mechanizm Pre-fill działa bez "zombie state".

---

## Kamień Milowy: Focus Timer Infrastructure & UI

### Status: ✅ 100% Completed

### Zakres
Wdrożenie kompletnego systemu timera z obsługą tła, PWA audio, cyberpunkowym UI oraz integracją z bazą zadań.

### Szczegóły techniczne wdrożenia

#### 1. Delta Timestamp Engine (Background Throttling Resistant)
- **Problem**: `setInterval` jest throttle'owany przez przeglądarki w tle/zablokowanych kartach.
- **Rozwiązanie**: Przechowywanie `expectedEndTime` (Unix timestamp) i kalkulacja delty:
  ```typescript
  const newTimeLeft = Math.max(0, Math.ceil((expectedEndTime - Date.now()) / 1000));
  ```
- **Zalety**: Odporność na usypianie kart, zmiany zakładek, zablokowany ekran mobilny.

#### 2. PWA Audio Unlock
- **Problem**: AudioContext wymaga interakcji użytkownika przed odtworzeniem dźwięku.
- **Rozwiązanie**: Unlock przy każdym `startTimer`, `resumeTimer`, `startTimeBox`:
  ```typescript
  const unlockAudioContext = () => {
    const AC = getAudioContext();
    if (AC && ctx.state === 'suspended') ctx.resume();
    // Subtelny beep 0.001s jako "unlock gesture"
  };
  ```

#### 3. TimerContext Architecture
```typescript
interface TimerContextValue {
  mode: TimerMode | null;           // Aktualny preset
  timerState: 'idle' | 'running' | 'paused' | 'break';
  timeLeft: number;                  // Sekundy pozostałe
  activeTaskId: number | null;       // Powiązane zadanie z Dexie
  startTimer: (mode: TimerMode) => void;
  startTimeBox: (targetTime: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  setActiveTask: (taskId: number | null) => void;
}
```

#### 4. Task Integration (Dropdown)
- Live query do Dexie: `useLiveQuery(() => db.tasks.toArray())`.
- Filtrowanie: `!task.completed && task.quadrant !== 0`.
- Sortowanie: `sort((a, b) => a.quadrant - b.quadrant)`.
- Kolory ćwiartek w UI: Q1 `#00FF66`, Q2 `#D000FF`, Q3 `#FF8C00`, Q4 `#9CA3AF`.

#### 5. Completion Modal (3-Way Choice)
- **Trigger**: `useEffect` nasłuchujący `timeLeft === 0`.
- **Stany**:
  - Zakończ zadanie → `db.tasks.update(activeTaskId, { completed: true })`.
  - Kolejna sesja → Zamknięcie modala, zachowanie `activeTaskId`.
  - Wróć później → `navigate('/')`, zachowanie zadania nieukończonego.

### Acceptance Criteria - Spełnione
- [x] Timer działa poprawnie przy zablokowanym ekranie mobilnym.
- [x] Dźwięk alarmu odtwarza się niezależnie od kontekstu uruchomienia.
- [x] Dropdown zadań pobiera live data z Dexie.
- [x] Modal pojawia się automatycznie przy osiągnięciu 00:00.
- [x] Tryb Time Boxing prawidłowo liczy czas do targetowej godziny.
- [x] Styl cyberpunkowy (neon glow, stany kolorystyczne) zaimplementowany.

---

## Podsumowanie Architektury

### Stack Technologiczny
| Warstwa | Technologia |
|---------|-------------|
| UI | React 18 + Tailwind CSS |
| State | React Context + useReducer (Timer) |
| Database | Dexie.js (IndexedDB Wrapper) |
| Routing | React Router v6 |
| Icons | Lucide React |

### Wzorce Architektoniczne
- **Repository Pattern**: `db.tasks.*` - abstrakcja warstwy danych.
- **Provider Pattern**: `TimerProvider` - globalny stan timera.
- **Container/Presentational**: `MatrixScreen` (logic) + `QuadrantCard` (presentational).
- **Snapshot State**: Przekazywanie initial state do quizu.

### Metryki Jakościowe (Maj 2026)
- **Test Coverage**: Brak automatycznych testów (planowane w Fazie 2).
- **Type Safety**: 100% TypeScript coverage, brak `any`.
- **Build Status**: ✅ Pass (`npm run build` - 0 errors).
- **Lighthouse**: TBD (planowane audyty PWA).
