
# FocusFlow – Backlog Sprintu 04: Execution & Automation

**Identyfikator Sprintu:** **S04**

**Nazwa:** Narzędzia Egzekucji: Timer, Eskalacja i Raporty

**Status:** **ZALICZONE** (Data zamknięcia: 12.05.2026)

---

## 1. Cele Sprintu

### Cel Biznesowy

Przejście od planowania do działania. Wdrożenie narzędzi wspierających głębokie skupienie (Deep Work) oraz automatyzacja zarządzania terminami, aby odciążyć pamięć operacyjną użytkownika z **ADHD**. Budowa pętli dopaminowej poprzez system *Streak*.

### Cel Techniczny

Implementacja precyzyjnego silnika czasu (Timer Machine) odpornego na działanie w tle, wdrożenie algorytmu automatycznej eskalacji kwadrantów oraz wizualizacja danych statystycznych za pomocą **SVG**.

---

## 2. Zakres Prac (User Stories & Tasks)

### 2.1. Silnik Skupienia (Focus Timer)

- **Zadanie 4.1:** Implementacja `logic/timerMachine.ts` – bezstanowy silnik obsługujący cykle Pomodoro (25/5, 50/10).
- **Zadanie 4.2:** Budowa Ekranu 04 (Timer) – interfejs z progresywnym kołem **SVG** i obsługą Page Visibility **API** (liczenie czasu w tle).
- **Zadanie 4.3:** Integracja *Start Focus* z karty Hero na Pulpicie – automatyczne wiązanie sesji z konkretnym zadaniem.

### 2.2. Automatyzacja i Motywacja

- **Zadanie 4.4:** Implementacja `escalationEngine.ts` – algorytm automatycznie przenoszący zadania z Q2 do Q1 na X dni przed terminem.
- **Zadanie 4.5:** Budowa `streakEngine.ts` – system liczenia dni z rzędu z ukończoną sesją pracy (Dopamine Streak).

### 2.3. Analityka i Edycja Zaawansowana

- **Zadanie 4.6:** Budowa Ekranu 09 (Raporty) – wizualizacja czasu skupienia i ukończonych zadań za pomocą wykresów słupkowych **SVG**.
- **Zadanie 4.7:** Implementacja Ekranu 18 (Dodaj Zadanie - Manual) – formularz dla zaawansowanych użytkowników z pełną edycją parametrów eskalacji i nawyków.

---

## 3. Inwentarz Plików (Artifacts)

| Plik | Status | Odpowiedzialny Agent |
| --- | --- | --- |
| `src/logic/timerMachine.ts` | Utworzony | IT Architect |
| `src/logic/escalationEngine.ts` | Utworzony | IT Architect |
| `src/logic/streakEngine.ts` | Utworzony | IT Architect |
| `src/components/TimerCircle.tsx` | Utworzony | UX Designer |
| `src/pages/Timer.tsx` | Utworzony | Lead Developer / UX |
| `src/pages/Raporty.tsx` | Utworzony | Lead Developer |
| `src/pages/DodajZadanie.tsx` | Utworzony | Lead Developer |
| `src/store/useTasksStore.ts` | Rozszerzony (focusSessions, currentSession, escalation cycle, dopamineStreakCount) | IT Architect |
| `src/components/AppShell.tsx` | Rozszerzony (#timer, #raporty, #dodaj-zadanie) | Lead Developer |
| `src/pages/Pulpit.tsx` | Rozszerzony (real streak z store) | Lead Developer |

---

## 4. Ograniczenia i Założenia Techniczne

- **Precyzja Czasu:** Timer musi bazować na różnicy znaczników czasu (`Date.now()`), a nie na prostym `setInterval`, aby uniknąć dryfu.
- **Persistence:** Aktywna sesja timera musi być zapisywana w `appState`, aby przetrwać przypadkowe odświeżenie strony.
- **Escalation Trigger:** Silnik eskalacji powinien uruchamiać się przy każdej inicjalizacji aplikacji oraz cyklicznie co 60 minut.

---

## 5. Definition of Done (DoD) dla Sprintu 04

- [x] Timer poprawnie odlicza czas w tle (bazuje na `Date.now()` + `visibilitychange`, brak dryfu setInterval).
- [x] Zadanie zaplanowane na *jutro* z eskalacją 2-dniową trafia automatycznie do Q1 po starcie aplikacji (`escalationEngine.runEscalation` wywoływane przy init + co 60 min).
- [x] Zakończenie sesji focus zwiększa licznik `sessionsCount` powiązanego zadania w **IDB** (`useTasksStore.addFocusSession`).
- [x] Ekran raportów wyświetla poprawne sumy minut pracy z ostatnich 7 dni (`streakEngine.sumFocusMinutesByDay` + SVG bar chart).

---

*Dokument przygotowany przez Managera Projektu.*