# Implemented Features Registry

> Single Source of Truth dla zaimplementowanych funkcji FocusFlow 2.0
> Ostatnia aktualizacja: 2026-05-17

---

## [WDROŻONE] Inbox Capture (Q0) & Brain Dump Pipeline

**Status:** ✅ Implemented & Verified  
**Data implementacji:** 2026-05-17

### Funkcjonalności:

- **Seryjny, bezwysiłkowy zrzut myśli** w widoku Brain Dump (czyszczenie RAM-u mózgu)
- **Całkowita izolacja zadań Q0** od głównej Macierzy (`quadrant !== 0`)
- **Snapshot State & Component Re-mount:** Rozwiązanie problemu zamrożonego formularza poprzez wymuszanie nowego montowania komponentu Quizu przy użyciu dynamicznego klucza z timestampem
- **Dual-mode Transaction:** Obsługa reklasyfikacji istniejących zadań in-place (`onClassify`) oraz tworzenia zupełnie nowych rekordów

### Architektura:

```typescript
// Izolacja Q0 w filtrowaniu
const matrixTasks = tasks.filter(t => t.quadrant !== 0);  // Q0 niewidoczne
const inboxTasks = tasks.filter(t => t.quadrant === 0);   // Tylko niezakwalifikowane

// Snapshot state - key-based remount
<QuizModal key={`quiz-${taskId}`} isOpen={isOpen} />
```

---

## [WDROŻONE] Cyberpunk Focus Timer (ADHD-Proof Engine)

**Status:** ✅ Implemented & Verified  
**Data implementacji:** 2026-05-17

### Funkcjonalności:

- **Delta Timestamp Architecture:** Silnik odliczania w globalnym `TimerContext` oparty na różnicy czasu Unix Timestamp, odporny na zamrażanie procesów w tle przez przeglądarki (Background Throttling)
- **7 dedykowanych presetów:** 5/0, 10/0, 15/5, 25/5, 50/10, 90/15 oraz Time Boxing z obsługą przekroczenia północy. Usunięcie trybu "Custom" w celu redukcji paraliżu decyzyjnego
- **PWA Audio Gesture Unlock** – mechanizm odblokowania powiadomień dźwiękowych przy starcie
- **Global State Synchronization:** Przeniesienie kontroli modalu końcowego do globalnego kontekstu czasu (eliminacja Race Conditions)
- **3-Way Strategic Modal:** Trójstopniowy wybór na koniec sesji:
  - **Zielony:** Ukończ zadanie z rzutowaniem typu ID na Number w Dexie
  - **Fioletowy:** Kolejna sesja z zachowaniem zadania
  - **Pomarańczowy:** Bezpieczne odłożenie i przekierowanie na Pulpit

### Architektura:

```typescript
// Delta timestamp - odporność na throttling
const expectedEndTime = Date.now() + durationMs;
const timeLeft = Math.max(0, expectedEndTime - Date.now());

// Globalny stan modalu
interface TimerContextValue {
  showCompletionModal: boolean;
  setShowCompletionModal: (show: boolean) => void;
}
```

---

## [WDROŻONE] Centrum Planowania (Sub-Matrix Q2 Widok 2x2)

**Status:** ✅ Implemented & Verified  
**Data implementacji:** 2026-05-17

### Funkcjonalności:

- **Rozszerzenie schematu bazy danych Dexie** o opcjonalne pole `subcategory?: string | null`
- **Dedykowany pod-ekran** wewnątrz zakładki Macierz przełączany za pomocą wewnętrznej maszyny stanów widoku (`viewMode: 'grid' | 'q2'`)
- **Układ Sub-Matrycy 2x2:** Podział zadań Q2 na 4 fioletowo-zielone ćwiartki:
  - **Rutyny** 🔄 (fiolet #D000FF)
  - **Projekty** 📁 (zieleń #00FF66)
  - **Ogólne Cele** 🎯 (zieleń #00FF66)
  - **Inne** 💼 (fiolet #D000FF)
- **Chirurgiczna precyzja UI:** Wymuszona stała wysokość nagłówków (`h-14`) z pionowym centrowaniem dla idealnej symetrii linii odcinających
- **Typography Safety:** Specjalny dobór rozmiarów fontów i blokada `whitespace-nowrap` w nagłówku, eliminująca nieestetyczne łamanie słowa "PLANOWANIA" na smartfonach
- **Eliminacja kategorii "nieprzypisane"** – puste subkategorie automatycznie wpadają do szuflady "Inne" (`null → 'inne'`)

### Architektura:

```typescript
// Maszyna stanów widoku
const [viewMode, setViewMode] = useState<'grid' | 'q2'>('grid');

// Subkategorie Q2
subcategory: 'rutyna' | 'projekt' | 'ogolny_cel' | 'inne';

// Stała wysokość nagłówka
<div className="h-14 flex items-center justify-between px-3 ...">
```

---

## Zasady prowadzenia rejestru:

1. Każda funkcja MUSI mieć powiązany PLAN_XXX
2. Statusy: `planned` | `in_progress` | `implemented` | `verified`
3. Data implementacji jest wymagana dla statusu `implemented`


