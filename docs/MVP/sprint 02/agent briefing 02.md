
---

## 3. IT Architect & Data Modeler
**Priorytet:** Logika potoku decyzyjnego i persystencja liczników [cite: AI_TEAM.md, FocusFlow-Roadmapa-MVP.md].

* **Zadanie:** Opracuj moduł `logic/brainDumpPipeline.ts`, który będzie pełnił rolę kontrolera między quizem a bazą danych [cite: FocusFlow-Roadmapa-MVP.md].
* **Model Danych:**
    * Zapewnij, że pole `strategy` (dla Q3) oraz flagi `isRejected` (dla Q4) są poprawnie mapowane w encji `Task` [cite: FocusFlow-Roadmapa-MVP.md, FokusFlow-Specyfikacja-Techniczna.md].
    * Wdróż automatyczne przeliczanie `quadrant_I_Count` i jego zapis w `appState` po każdej mutacji [cite: FocusFlow-Roadmapa-MVP.md].
* **Logika:** Zdefiniuj warunek wyzwalający `OverloadModal` wewnątrz pipeline'u [cite: FocusFlow-Roadmapa-MVP.md, ekran 10 ekran błędu.md].

---

## 4. Lead Developer (Implementation Engine)
**Priorytet:** Dekompozycja komponentów i budowa siatki notatek [cite: AI_TEAM.md, FocusFlow-Roadmapa-MVP.md].

* **Zadanie:** Zoptymalizuj `BrainDump.tsx` poprzez ekstrakcję logiki modali do osobnych komponentów w `src/components/modals/` [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[02]-Backlog.md].
* **Implementacja:**
    * Wdróż Ekran 05 (Notatki) jako dwukolumnowy `Masonry Grid` z kartami o różnej wysokości [cite: ekran 05 notatki Brain-Dump.md, FocusFlow-Roadmapa-MVP.md].
    * Zaimplementuj funkcję szybkiego zapisu notatki (`addNote`), która natychmiast czyści input i przekierowuje użytkownika do widoku notatek [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[02]-Backlog.md].
* **Stylistyka:** Zastosuj rygorystyczne Design Tokens dla kart notatek: zielony obrys dla `unsorted` i fioletowy dla `sorted` [cite: ekran 05 notatki Brain-Dump.md].

---

## 5. QA & Logic Auditor
**Priorytet:** Weryfikacja walidacji quizu i akcji archiwizacji [cite: AI_TEAM.md, FocusFlow-Roadmapa-MVP.md].

* **Zadanie:** Przeprowadź testy szczelności potoku decyzyjnego [cite: FocusFlow-Roadmapa-MVP.md].
* **Scenariusze:**
    * Sprawdź, czy przycisk zapisu jest zablokowany, dopóki `isComplete` nie wyniesie true (6 odpowiedzi) [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Sprint-[02]-Backlog.md].
    * Zweryfikuj, czy akcja "Odrzuć" w modalu Q4 nie tworzy zadania w widoku Pulpitu, ale poprawnie inkrementuje licznik odrzuconych zadań [cite: FocusFlow-Roadmapa-MVP.md, ekran 26 brain-dump wybór typu zadania Q4.md].
* **Audyt wizualny:** Potwierdź, że modale poprawnie przesłaniają Tab Bar, blokując nawigację do czasu podjęcia decyzji [cite: ekran 10 ekran błędu.md, ekran 27 brain-dump wybór typu zadania Q2.md].

---
*Briefing zatwierdzony przez Managera Projektu.* [cite: FocusFlow-Roadmapa-MVP-v1.2.md]