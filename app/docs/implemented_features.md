# Implemented Features - FocusFlow

> Dokumentacja funkcjonalności wdrożonych w aplikacji FocusFlow - Matrix Planner dla ADHD.
> Data ostatniej aktualizacji: Maj 2026

---

## Moduł Brain Dump & Inbox Capture (Q0)

### Cel Biznesowy
Eliminacja paraliżu decyzyjnego u użytkowników z ADHD poprzez zapewnienie "bezpiecznej przestrzeni" na natychmiastowy zrzut myśli bez konieczności natychmiastowej kategoryzacji.

### Funkcjonalności

#### 1. Cichy, seryjny zapis myśli (Silent Serial Capture)
- **Problem użytkownika**: Konieczność natychmiastowego przypisywania priorytetów blokuje zapisywanie pomysłów.
- **Rozwiązanie**: Dedykowany widok "Zrzut" (`/dump`) umożliwiający błyskawiczne wpisanie tekstu i zapis przez Enter.
- **Stan UI**: Notatka zostaje dodana do kolekcji z pole `quadrant: 0` (Inbox).
- **Feedback**: Subtelna animacja potwierdzenia zapisu bez przerywania flow użytkownika.

#### 2. Widok masowego zrzutu vs. zarządzania notatkami
- **Widok zrzutu (`/dump`)**:
  - Tekstarea z placeholderem inspirowanym GTD.
  - Zapisywanie wielu notatek w jednej sesji.
  - Archiwizacja notatek (przycisk "Zarchiwizuj wszystko").
  
- **Widok Inbox (`/inbox`)**:
  - Lista notatek z ćwiartki 0 (Q0).
  - Każda notatka posiada przycisk "Rozpocznij Quiz".
  - Masowa selekcja i operacje grupowe (archiwizacja, usuwanie).

#### 3. Pre-fill Quiz Integration (Snapshot State + Key Re-mount)
- **Mechanizm**: Przekazywanie treści notatki do Quizu klasyfikacyjnego.
- **Implementacja**:
  - Użycie `initialTitle` w hooku `useQuizForm`.
  - Automatyczne pominięcie kroku "Tytuł" w quizie (`skipTitleStep: true`).
  - Mechanizm `key={taskId}` w komponencie `QuizModal` wymuszający full re-mount i reset stanu.

---

## Moduł Cyberpunk Focus Timer

### Cel Biznesowy
Stworzenie immersyjnego środowiska skupienia z motywacją wizualną i wsparciem dla specyficznych wzorców pracy użytkowników z ADHD.

### Funkcjonalności

#### 1. Integracja z bazą danych Dexie (Live Dropdown)
- **Pobieranie zadań**: Subskrypcja `useLiveQuery(() => db.tasks.toArray())`.
- **Filtrowanie w JS**: `!task.completed && task.quadrant !== 0` (wykluczenie Inbox i ukończonych).
- **Sortowanie**: Według ćwiartek rosnąco (Q1 → Q2 → Q3 → Q4).
- **UI**: Dropdown z kolorowymi wskaźnikami ćwiartek, wybór "Brak konkretnego zadania".

#### 2. Siedem specjalistycznych presetów dla ADHD
| Preset | Czas pracy | Przerwa | Przeznaczenie |
|--------|-----------|---------|---------------|
| **Pogromca Paraliżu** | 5 min | 0 min | Przełamanie oporu przed rozpoczęciem |
| **Szybki Sprint** | 10 min | 0 min | Krótkie, intensywne burst-y energii |
| **Lekkie** | 15 min | 5 min | Wprowadzenie do techniki Pomodoro |
| **Klasyczne** | 25 min | 5 min | Standardowa sesja Pomodoro |
| **Intensywne Flow** | 50 min | 10 min | Głęboka praca (deep work) |
| **Głębokie Wejście** | 90 min | 15 min | Maksymalna koncentracja na złożonych zadaniach |
| **Time Boxing** | Target time | 0 min | Deadline-driven praca do konkretnej godziny |

#### 3. Trójstopniowy modal decyzyjny na koniec sesji
**Problem**: Użytkownicy z ADHD często czują "poczucie winy" za nieukończenie zadania w wyznaczonym czasie.

**Rozwiązanie**: Modal z trzema wyraźnymi opcjami intencji:

1. **"Tak, ukończ zadanie"** (Neonowa Zieleń)
   - Oznacza zadanie jako ukończone w Dexie (`completed: true`).
   - Czyści wybrane zadanie z timera (`setActiveTask(null)`).
   - Resetuje stan timera.

2. **"Chcę odbyć kolejną sesję"** (Żywy Fiolet)
   - Zamknięcie modala bez zmiany stanu.
   - Zachowanie wybranego zadania (`activeTaskId` pozostaje).
   - Możliwość natychmiastowego wyboru kolejnego presetu.

3. **"Nie, jeszcze do tego wrócę"** (Ognisty Pomarańcz)
   - Zamknięcie modala bez oznaczania zadania jako ukończonego.
   - Przekierowanie na Pulpit (`navigate('/')`).
   - Zachowanie zadania w oryginalnej ćwiartce do późniejszej kontynuacji.

#### 4. Cyberpunkowy interfejs wizualny

**SVG Progress Ring (Wireframe Neon)**:
- Tło pierścienia: `#2D003B` (głęboki fiolet).
- Postęp: `#00FF66` (neonowa zieleń) z subtelnym glow.
- Tryb pauzy: Przyciemniony pierścień (`opacity: 0.3`), tekst `#7A0099`.

**Stany kolorystyczne tekstu zegara**:
- `RUNNING`: Neon zielony `#00FF66` + drop-shadow glow.
- `PAUSED`: Przyciemniony fiolet `#7A0099`.
- `IDLE`: Biały/transparentny `white/70`.

**Podświetlenia przycisków (Hover Glow)**:
- Aktywny preset: `box-shadow: 0 0 20px ${color}60, 0 0 40px ${color}30, inset 0 0 15px ${color}10`.
- Przycisk START: Fioletowy z domyślnym glow.
- Przycisk PAUZA: Przejście do przyciemnionego fioletu.
- Przycisk WZNÓW: Zielony border + intensywne glow.

---

## Roadmap - Pozostałe funkcjonalności

### Faza 2 (Planowana)
- [ ] Statystyki czasu pracy (Heatmap dniowy).
- [ ] Eksport danych do CSV/JSON.
- [ ] Tryb "Zen" (ukrycie wszystkich elementów UI poza zegarem).

### Faza 3 (Planowana)
- [ ] Powiadomienia PWA (Web Push).
- [ ] Synchronizacja z chmurą (opcjonalnie).
- [ ] Tryb współpracy (buddy system) dla accountability.
