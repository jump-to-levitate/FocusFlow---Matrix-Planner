# FocusFlow – Backlog Sprintu 02: Brain Dump Pipeline & Strategic Modals

**Identyfikator Sprintu:** S02 [cite: FocusFlow-Roadmapa-MVP.md]
**Nazwa:** Proces Decyzyjny: Pipeline, Overload i Modale Strategiczne [cite: FocusFlow-Roadmapa-MVP.md]
**Status:** ZALICZONE (Data zamknięcia: 11.05.2026) [cite: FocusFlow-Roadmapa-MVP-v1.2.md]

---

## 1. Cele Sprintu

### Cel Biznesowy
Domknięcie pełnego procesu "oczyszczania głowy" – od wpisania surowej myśli do jej strategicznego zaklasyfikowania lub odrzucenia [cite: FocusFlow-Roadmapa-MVP.md]. Wdrożenie mechanizmu ochrony przed paraliżem decyzyjnym (System Overload) poprzez twardy limit 5 zadań w I ćwiartce [cite: FocusFlow-Roadmapa-MVP.md, FokusFlow-Specyfikacja-Techniczna.md].

### Cel Techniczny
Implementacja potoku decyzyjnego (Pipeline) łączącego wynik quizu z odpowiednimi akcjami zapisu oraz ekstrakcja komponentów modalnych w celu odchudzenia głównego widoku Brain Dump [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Roadmapa-MVP-v1.2.md].

---

## 2. Zakres Prac (User Stories & Tasks)

### 2.1. Pipeline Klasyfikacji i Walidacja
* **Zadanie 2.1:** Implementacja maszyny stanów quizu – blokada przycisku "DODAJ ZADANIE" do momentu udzielenia wszystkich 6 odpowiedzi [cite: FocusFlow-Roadmapa-MVP.md].
* **Zadanie 2.2:** Utworzenie modułu `logic/brainDumpPipeline.ts` – logika kierująca zadania do zapisu lub do odpowiednich pop-upów strategicznych [cite: FocusFlow-Roadmapa-MVP.md].
* **Zadanie 2.3:** Integracja licznika `quadrant_I_Count` – automatyczna weryfikacja dostępności miejsca w I ćwiartce przed zapisem [cite: FokusFlow-Specyfikacja-Techniczna.md, FocusFlow-Roadmapa-MVP.md].

### 2.2. Modale Strategiczne i Alert System
* **Zadanie 2.4:** Implementacja `OverloadModal` (Ekran 10) – alert blokujący dodanie 6. zadania do Q1 [cite: ekran 10 ekran błędu.md, FocusFlow-Roadmapa-MVP.md].
* **Zadanie 2.5:** Budowa pop-upów strategicznych:
    - **Modal Q2 (Ekran 27):** Wybór planowania ważnych spraw [cite: ekran 27 brain-dump Q2.md].
    - **Modal Q3 (Ekran 25):** Wybór strategii egzekucji dla prozy życia [cite: ekran 25 brain-dump Q3.md].
    - **Modal Q4 (Ekran 26):** Opcja odrzucenia/archiwizacji dystraktorów [cite: ekran 26 brain-dump Q4.md].

### 2.3. Magazyn Myśli (Brain Dump Notes)
* **Zadanie 2.6:** Implementacja funkcji "Dodaj notatkę" – szybki zapis myśli bez kategoryzacji jako `unsorted note` [cite: FocusFlow-Roadmapa-MVP.md, ekran 05 notatki Brain-Dump.md].
* **Zadanie 2.7:** Budowa Ekranu 05 (Notatki) – dwukolumnowa siatka prezentująca historię wpisów z podziałem na posortowane i nieposortowane [cite: ekran 05 notatki Brain-Dump.md, FocusFlow-Roadmapa-MVP.md].

---

## 3. Inwentarz Plików (Artifacts)

| Plik | Status | Odpowiedzialny Agent |
| :--- | :--- | :--- |
| `src/logic/brainDumpPipeline.ts` | Utworzony | IT Architect [cite: FocusFlow-Roadmapa-MVP.md] |
| `src/components/modals/OverloadModal.tsx` | Utworzony | UX Designer [cite: FocusFlow-Roadmapa-MVP-v1.2.md] |
| `src/components/modals/ModalQ3.tsx` | Utworzony | Lead Developer [cite: FocusFlow-Roadmapa-MVP-v1.2.md] |
| `src/pages/Notatki.tsx` | Utworzony | Lead Developer [cite: FocusFlow-Roadmapa-MVP-v1.2.md] |
| `src/pages/BrainDump.tsx` | Zrefaktoryzowany | Lead Developer [cite: FocusFlow-Roadmapa-MVP-v1.2.md] |

---

## 4. Ograniczenia i Założenia Techniczne
* **Rozmiar Komponentu:** Plik `BrainDump.tsx` musi zostać odchudzony do poziomu poniżej 150 linii kodu poprzez ekstrakcję logiki i modali [cite: FocusFlow-Roadmapa-MVP.md].
* **Interakcja Overlay:** Wszystkie modale muszą obsługiwać zamknięcie po kliknięciu w tło (overlay) bez zapisywania danych w IDB [cite: FocusFlow-Roadmapa-MVP.md].
* **Persystencja Licznika:** Wartość `quadrant_I_Count` musi być trwale zapisywana w `appState` przy każdej zmianie w bazie zadań [cite: FocusFlow-Roadmapa-MVP.md].

---

## 5. Definition of Done (DoD) dla Sprintu 02
- [x] Przycisk "DODAJ ZADANIE" aktywuje się wyłącznie po udzieleniu 6 odpowiedzi w quizie [cite: FocusFlow-Roadmapa-MVP.md].
- [x] Próba dodania 6. zadania do Q1 wywołuje czerwony pop-up Overload [cite: FocusFlow-Roadmapa-MVP.md, ekran 10 ekran błędu.md].
- [x] Wybranie opcji "Odrzuć" w modalu Q4 poprawnie inkrementuje licznik `rejectedTasksThisMonth` w bazie danych [cite: FocusFlow-Roadmapa-MVP.md, ekran 26 brain-dump wybór typu zadania Q4.md].
- [x] Nowe notatki tworzone przez przycisk "Dodaj notatkę" są natychmiast widoczne na Ekranie 05 w kolorze zielonym (Unsorted) [cite: ekran 05 notatki Brain-Dump.md].

---
*Dokument zatwierdzony przez Managera Projektu.* [cite: FocusFlow-Roadmapa-MVP-v1.2.md]