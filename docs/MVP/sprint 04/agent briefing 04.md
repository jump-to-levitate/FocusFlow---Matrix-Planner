# FocusFlow – Briefing Zespołu AI: Sprint 04

**Identyfikator Sprintu:** **S04** [cite: FocusFlow-Roadmapa-**MVP**.md] **Faza:** Execution & Automation [cite: FocusFlow-Roadmapa-**MVP**-v1.2.md] **Data wydania dyrektyw:** 25.05.**2026**

---

## 1. Product Owner & Business Strategist

**Priorytet:** Budowa pętli dopaminowej i bezpieczna automatyzacja priorytetów. [cite: FocusFlow-Roadmapa-**MVP**.md, AI_TEAM-Plan_działania.md]

- **Dyrektywa:** Timer musi wspierać użytkownika, a nie go karać. Implementacja *forgiving timer* – nie zatrzymuj odliczania przy krótkich przełączeniach zakładek. [cite: FocusFlow-Roadmapa-**MVP**.md, AI_TEAM-Plan_działania.md]
- **Decyzja:** Wprowadzamy system *Streak* (seria dni), który jest widoczny na ekranie raportów jako główny czynnik motywacyjny. [cite: FocusFlow-Roadmapa-**MVP**.md, FokusFlow-Specyfikacja-Techniczna.md]
- ****KPI**:** Skuteczność automatycznej eskalacji – użytkownik musi czuć, że system *pilnuje jego pleców*, przesuwając zadania Q2 do Q1 przed deadlinem. [cite: FocusFlow-Roadmapa-**MVP**.md]

---

## 2. UX Designer (Specjalista ADHD)

**Priorytet:** Wizualizacja postępu i przejrzystość formularzy zaawansowanych. [cite: AI_TEAM.md, FocusFlow-Sprint-[04]-Backlog.md]

- **Zadanie:** Zaprojektuj interfejsy dla Ekranu 04 (Timer) oraz Ekranu 09 (Raporty). [cite: FocusFlow-Roadmapa-**MVP**.md, FocusFlow-Sprint-[04]-Backlog.md]
- **Wymagania UX:**
    * **Timer (04):** Centralne koło progresu **SVG**. Kolorystyka musi pulsować subtelnie w rytmie pracy (fiolet → zielony). [cite: FocusFlow-Roadmapa-**MVP**.md]
    * **Raporty (09):** Minimalistyczne wykresy słupkowe **SVG**. Unikaj ciężkich bibliotek wykresów – postaw na czysty kod. [cite: FocusFlow-Roadmapa-**MVP**.md, FocusFlow-Roadmapa-**MVP**-v1.2.md]
    * **Dodaj Zadanie (18):** Przejrzysty formularz z wyraźną walidacją godziny (Format GG:MM). [cite: FocusFlow-Roadmapa-**MVP**.md, FokusFlow-Specyfikacja-Techniczna.md]

---

## 3. IT Architect & Data Modeler

**Priorytet:** Precyzja algorytmów czasu i logiki eskalacji. [cite: AI_TEAM.md, FocusFlow-Sprint-[04]-Backlog.md]

- **Zadanie:** Opracuj silniki logiczne `timerMachine.ts`, `escalationEngine.ts` oraz `streakEngine.ts`. [cite: FocusFlow-Roadmapa-**MVP**.md, FocusFlow-Sprint-[04]-Backlog.md]
- **Logika Danych:**
    * **Timer:** Musi być odporny na uśpienie przeglądarki (bazuj na `Date.now()`). [cite: FocusFlow-Roadmapa-**MVP**.md]
    * **Eskalacja:** Algorytm uruchamiany przy starcie aplikacji. Jeśli `daysUntil(deadline) <= escalateDaysBefore`, zmień quadrant na 'I'. [cite: FocusFlow-Roadmapa-**MVP**.md]
    * **Persystencja:** Aktywna sesja (`currentFocusSession`) musi być zapisywana w **IDB**, aby przetrwać odświeżenie strony. [cite: FocusFlow-Roadmapa-**MVP**.md]

---

## 4. Lead Developer (Implementation Engine)

**Priorytet:** Implementacja narzędzi egzekucji i integracja z widokiem Pulpitu. [cite: AI_TEAM.md, FocusFlow-Sprint-[04]-Backlog.md]

- **Zadanie:** Zbuduj strony Timer, Raporty oraz zaawansowany formularz Dodaj Zadanie. [cite: FocusFlow-Roadmapa-**MVP**.md, FocusFlow-Sprint-[04]-Backlog.md]
- **Implementacja:**
    * Połącz przycisk ***START** **FOCUS*** na Pulpicie z inicjalizacją sesji w `useTasksStore`. [cite: FocusFlow-Roadmapa-**MVP**.md]
    * Wdróż obsługę Wake Lock **API** (jeśli dostępne), aby ekran nie wygasł podczas pracy z Timerem. [cite: FocusFlow-Roadmapa-**MVP**.md]
    * Zaimplementuj walidację czasu na ekranie 18 – błąd formatu musi wyzwalać komunikat ostrzegawczy (Ekran 19). [cite: FocusFlow-Roadmapa-**MVP**.md, FokusFlow-Specyfikacja-Techniczna.md]

---

## 5. QA & Logic Auditor

**Priorytet:** Testy skrajnych przypadków eskalacji i stabilności timera. [cite: AI_TEAM.md, FocusFlow-Sprint-[04]-Backlog.md]

- **Zadanie:** Przeprowadź audyt *Systemu Egzekucji*. [cite: FocusFlow-Sprint-[04]-Backlog.md]
- **Scenariusze testowe:**
    * **Test Eskalacji:** Ustaw datę systemową wstecz, aby wymusić automatyczne przesunięcie zadania Q2 do Q1. Czy system zareagował przy starcie? [cite: FocusFlow-Roadmapa-**MVP**.md]
    * **Test Timera:** Czy po 30 minutach w tle timer nadal wskazuje poprawny pozostały czas (tolerancja +/- 2s)? [cite: FocusFlow-Roadmapa-**MVP**.md]
    * **Test Walidacji:** Wpisz *99:99* w polu godziny. Czy system zablokował zapis i wyświetlił błąd? [cite: FocusFlow-Roadmapa-**MVP**.md, FokusFlow-Specyfikacja-Techniczna.md]

--- *Briefing zatwierdzony przez Managera Projektu.* [cite: FocusFlow-Roadmapa-**MVP**-v1.2.md]