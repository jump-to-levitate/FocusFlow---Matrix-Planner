# FocusFlow – Briefing Zespołu AI: Sprint 03

**Identyfikator Sprintu:** S03 [cite: FocusFlow-Roadmapa-MVP.md]
**Faza:** Macierz Eisenhowera, Listy Wirtualne i Context Menu [cite: FocusFlow-Roadmapa-MVP.md]
**Data wydania dyrektyw:** 18.05.2026 [cite: FocusFlow-Sprint-[03]-Backlog.md]

---

## 1. Product Owner & Business Strategist
**Priorytet:** Redukcja szumu informacyjnego i przejrzystość priorytetów [cite: AI_TEAM-Plan_działania.md].

* **Dyrektywa:** Pilnuj, aby widok Macierzy (02) nie stał się przeładowaną listą – każda ćwiartka ma być "oddechem" dla użytkownika, a nie kolejnym stresorem [cite: AI_TEAM-Plan_działania.md, FocusFlow-Sprint-[03]-Backlog.md].
* **Decyzja:** Wszystkie widoki listowe muszą być "płaskie" i minimalistyczne. Użytkownik ma widzieć tylko to, co jest istotne w danym kontekście (np. tylko dzisiejsze zadania) [cite: AI_TEAM-Plan_działania.md, FocusFlow-Roadmapa-MVP.md].
* **KPI:** Czas przejścia między widokami przez hash-router musi być niezauważalny (< 100ms) [cite: FocusFlow-Roadmapa-MVP.md].

---

## 2. UX Designer (Specjalista ADHD)
**Priorytet:** Spójność gestów i wizualna redukcja kroków do akcji [cite: AI_TEAM.md, AI_TEAM-Plan_działania.md].

* **Zadanie:** Zaprojektuj i nadzoruj wdrożenie komponentów `TaskCard` i `ContextMenu` [cite: FocusFlow-Sprint-[03]-Backlog.md].
* **Wymagania UX:**
    * **Long-press:** Standard 500ms dla wywołania menu na każdym elemencie listy [cite: FocusFlow-Roadmapa-MVP.md].
    * **Macierz (02):** Układ 2x2 z wyraźnymi etykietami osi (Pilne/Ważne). Każda ćwiartka musi zawierać przycisk CTA prowadzący do pełnego huba danej kategorii [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[03]-Backlog.md].
* **Animacja:** Akcja "Zrobione" w menu musi wyzwalać natychmiastowy feedback wizualny (slide-out-left) przed usunięciem elementu z DOM [cite: FocusFlow-Roadmapa-MVP.md, AI_TEAM.md].

---

## 3. IT Architect & Data Modeler
**Priorytet:** Efektywność selektorów i brak redundancji stanu [cite: FocusFlow-Roadmapa-MVP.md, AI_TEAM.md].

* **Zadanie:** Rozbuduj plik `src/store/selectors.ts` o zaawansowane filtry dla widoków wirtualnych [cite: FocusFlow-Sprint-[03]-Backlog.md].
* **Logika Danych:**
    * **selectAllForToday:** Opracuj selektor agregujący zadania Q1, Q3 (z odpowiednią strategią) oraz nawyki na dany dzień tygodnia [cite: FocusFlow-Roadmapa-MVP.md].
    * **Stateless Views:** Zabroń używania lokalnego `useState` do przechowywania list zadań na nowych ekranach; dane muszą płynąć bezpośrednio z `useTasksStore` przez selektory [cite: FocusFlow-Roadmapa-MVP.md].
* **Nawigacja:** Zaimplementuj mapowanie hash-routera w `AppShell.tsx` dla wszystkich 12 planowanych widoków listowych [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[03]-Backlog.md].

---

## 4. Lead Developer (Implementation Engine)
**Priorytet:** Budowa uniwersalnych komponentów i integracja nawigacji [cite: AI_TEAM.md, AI_TEAM-Plan_działania.md].

* **Zadanie:** Stwórz uniwersalny komponent `TaskCard.tsx` obsługujący warianty `pill`, `card` i `matrix` [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[03]-Backlog.md].
* **Implementacja:**
    * Zintegruj `ContextMenu.tsx` (Ekran 29) jako globalny portal lub modal obsługujący 5 kluczowych akcji [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[03]-Backlog.md].
    * Wdróż ekrany specjalistyczne (Nawyki, Wielkie Projekty, Archiwum) jako lekkie komponenty wykorzystujące wspólny `TaskCard` [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[03]-Backlog.md].
* **Technologia:** Wykorzystaj `window.location.hash` do zarządzania nawigacją między widokami, zapewniając wsparcie dla przycisku "wstecz" w przeglądarce [cite: FocusFlow-Roadmapa-MVP.md].

---

## 5. QA & Logic Auditor
**Priorytet:** Weryfikacja spójności filtrów i reaktywności nawigacji [cite: AI_TEAM.md, AI_TEAM-Plan_działania.md].

* **Zadanie:** Przeprowadź audyt "Cross-Screen Reactivity" [cite: FocusFlow-Roadmapa-MVP.md].
* **Scenariusze testowe:**
    * **Test Hash-Router:** Czy ręczna zmiana adresu na `#today` lub `#macierz` ładuje poprawny komponent? [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[03]-Backlog.md]
    * **Test Selektorów:** Czy zadanie dodane jako Q3 ze strategią 'Zrob teraz' pojawia się poprawnie w widoku 'Wszystko na dzisiaj'? [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[03]-Backlog.md]
* **Audyt Kodowy:** Upewnij się, że żaden z 12 nowych ekranów listowych nie przekracza limitu 100 linii kodu [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[03]-Backlog.md].

---
*Briefing zatwierdzony przez Managera Projektu.* [cite: FocusFlow-Roadmapa-MVP-v1.2.md]