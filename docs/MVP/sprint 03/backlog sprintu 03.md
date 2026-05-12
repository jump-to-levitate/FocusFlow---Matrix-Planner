# FocusFlow – Backlog Sprintu 03: Macierz i Widoki Kontekstowe

**Identyfikator Sprintu:** S03 [cite: FocusFlow-Roadmapa-MVP.md]
**Nazwa:** Macierz Eisenhowera, Listy Wirtualne i Context Menu [cite: FocusFlow-Roadmapa-MVP.md]
**Status:** ZALICZONE (Data zamknięcia: 18.05.2026) [cite: FocusFlow-Roadmapa-MVP-v1.2.md]

---

## 1. Cele Sprintu

### Cel Biznesowy
Umożliwienie użytkownikowi przeglądania zadań w różnych kontekstach (czasowym, priorytetowym, tematycznym) przy zachowaniu zerowej redundancji danych [cite: FocusFlow-Roadmapa-MVP.md]. Wdrożenie intuicyjnej obsługi zadań przez menu kontekstowe (Long-press) wywołujące natychmiastowe akcje egzekucyjne [cite: FocusFlow-Roadmapa-MVP.md].

### Cel Techniczny
Implementacja wydajnych selektorów danych (Selectors) dla widoków wirtualnych oraz pełna unifikacja komponentów interfejsu (`TaskCard`, `ContextMenu`) działających na wspólnym store [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Roadmapa-MVP-v1.2.md].

---

## 2. Zakres Prac (User Stories & Tasks)

### 2.1. Centralne Komponenty Interakcyjne
* **Zadanie 3.1:** Budowa uniwersalnego komponentu `TaskCard` – obsługa wariantów `pill`, `card` i `matrix` z wbudowaną obsługą gestu Long-press (500ms) [cite: FocusFlow-Roadmapa-MVP.md].
* **Zadanie 3.2:** Implementacja Ekranu 29 (Context Menu) – modularny pop-up akcji (Zrobione, Start Focus, Edytuj, Notatka, Usuń) [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Roadmapa-MVP-v1.2.md].

### 2.2. Nawigacja i Widoki Główne
* **Zadanie 3.3:** Implementacja Ekranu 02 (Macierz Eisenhowera) – siatka 2x2 wyświetlająca zadania przefiltrowane per kwadrant z pigułkami nawigacyjnymi do hubów [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Roadmapa-MVP-v1.2.md].
* **Zadanie 3.4:** Rozbudowa `AppShell.tsx` o tymczasowy mechanizm `hash-router`, obsługujący przełączanie między 12 nowymi widokami listowymi [cite: FocusFlow-Roadmapa-MVP.md].

### 2.3. Widoki Wirtualne i Filtrowanie
* **Zadanie 3.5:** Implementacja Ekranu 24 (Wszystko na dzisiaj) – zaawansowany selektor agregujący Priorytety (Q1), Prozę Życia (Q3), Nawyki i zadania zaplanowane na dzień bieżący [cite: FocusFlow-Roadmapa-MVP.md].
* **Zadanie 3.6:** Budowa Ekranów list specjalistycznych: Nawyki, Wielkie Projekty, Proza Życia (Q3) oraz Archiwum (Q4) [cite: FocusFlow-Roadmapa-MVP.md].

---

## 3. Inwentarz Plików (Artifacts)

| Plik | Status | Odpowiedzialny Agent |
| :--- | :--- | :--- |
| `src/components/TaskCard.tsx` | Utworzony | UX Designer / Lead Dev [cite: FocusFlow-Roadmapa-MVP.md] |
| `src/components/ContextMenu.tsx` | Utworzony | UX Designer [cite: FocusFlow-Roadmapa-MVP.md] |
| `src/pages/Macierz.tsx` | Utworzony | Lead Developer [cite: FocusFlow-Roadmapa-MVP.md] |
| `src/pages/WszystkoNaDzis.tsx` | Utworzony | IT Architect [cite: FocusFlow-Roadmapa-MVP.md] |
| `src/store/selectors.ts` | Rozszerzony | IT Architect [cite: FocusFlow-Roadmapa-MVP.md] |

---

## 4. Ograniczenia i Założenia Techniczne
* **Wydajność:** Każdy ekran listowy musi mieć mniej niż 100 linii kodu, delegując całą logikę filtrowania do centralnego pliku `selectors.ts` [cite: FocusFlow-Roadmapa-MVP.md].
* **Reaktywność:** Zmiana statusu zadania w menu kontekstowym musi zostać odzwierciedlona we wszystkich otwartych widokach w czasie rzeczywistym [cite: FocusFlow-Roadmapa-MVP.md].
* **Animacje:** Wymagane zastosowanie animacji `slide-out-left` (200ms) przy oznaczaniu zadania jako ukończone [cite: FocusFlow-Roadmapa-MVP.md].

---

## 5. Definition of Done (DoD) dla Sprintu 03
- [x] Hash router poprawnie przełącza widoki po zmianie `window.location.hash` [cite: FocusFlow-Roadmapa-MVP.md].
- [x] Macierz 2x2 wyświetla poprawne zadania dla każdego kwadrantu na bazie IDB [cite: FocusFlow-Roadmapa-MVP.md].
- [x] Widok "Wszystko na dzisiaj" poprawnie agreguje zadania z różnych kategorii zgodnie z selektorem [cite: FocusFlow-Roadmapa-MVP.md].
- [x] Long-press na karcie zadania wywołuje menu z 5 poprawnie otypowanymi akcjami [cite: FocusFlow-Roadmapa-MVP.md].

---
*Dokument zatwierdzony przez Managera Projektu.* [cite: FocusFlow-Roadmapa-MVP-v1.2.md]