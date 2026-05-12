# FocusFlow – Briefing Zespołu AI: Sprint 01

**Identyfikator Sprintu:** **S01**

**Faza:** Foundation: Reactive Store + Quiz Engine

**Data wydania dyrektyw:** 11.05.**2026**

---

## 1. Product Owner & Business Strategist

**Priorytet:** Utrzymanie *jasnych brzegów decyzyjnych*.

- **Dyrektywa:** Bezwzględnie odrzucaj wszelkie próby wprowadzenia stanów pośrednich w quizie (np. *może*, *pomiń*).
- **Decyzja:** Silnik klasyfikacji musi opierać się na twardej logice binarnej (**TAK**/**NIE**), aby zredukować paraliż decyzyjny u użytkownika z **ADHD**.
- ****KPI**:** Monitorowanie poprawności implementacji modułu `seed.ts` – użytkownik musi wystartować z gotowym zestawem danych, aby uniknąć lęku przed *pustą kartką*.

---

## 2. UX Designer (Specjalista ADHD)

**Priorytet:** Reaktywność pigułki klasyfikacyjnej i minimalizm interakcji.

- **Zadanie:** Zaprojektuj feedback wizualny dla pigułki *Trafia do...* na Ekranie 03.
- **Wymagania:**
- Pigułka musi zmieniać kolor i tekst natychmiast po udzieleniu pierwszej odpowiedzi (Partial State).
- Zastosuj rygorystyczną paletę barw: Q1 (#**39FF14**), Q2 (#**A020F0**), Q3 (#**FB923C**), Q4 (#**64748B**).

- **Interakcja:** Wypracuj mechanizm auto-advance – system musi automatycznie przewijać do kolejnego pytania po kliknięciu odpowiedzi.

---

## 3. IT Architect & Data Modeler

**Priorytet:** Implementacja wzorca *Single Source of Truth*.

- **Zadanie:** Zaprojektuj architekturę Event-Bus w pliku `store/events.ts`.
- **Model Danych:**
- Zdefiniuj ścisły typ `BinaryAnswer = '**TAK**' | '**NIE**'`.
- Opracuj strukturę hooka `useTasksStore.ts`, który zunifikuje dostęp do IndexedDB i subskrypcję zdarzeń.

- **Logika:** Opracuj funkcję `processQuiz(answers)`, która wylicza kwadrant na podstawie sumy punktów (Score $\ge$ 2 dla każdej osi).

---

## 4. Lead Developer (Implementation Engine)

**Priorytet:** Kodowanie reaktywnego store'a i refaktoryzacja widoków.

- **Zadanie:** Przekuj architekturę w działający kod TypeScript bez użycia typu `any`.
- **Implementacja:**
- Wdróż hook `useTasksStore` i podepnij go pod `Pulpit.tsx` oraz `BrainDump.tsx`.
- Zrefaktoruj Ekran 03 tak, aby usuwał lokalną logikę klasyfikacji na rzecz globalnego modułu `processQuiz.ts`.

- **Stylistyka:** Stosuj Tailwind **CSS** z neonowymi efektami `glow` dla aktywnych przycisków quizu.

---

## 5. QA & Logic Auditor

**Priorytet:** Weryfikacja reaktywności i szczelności silnika.

- **Zadanie:** Przeprowadź audyt *Testu reaktywności*.
- **Scenariusze:**
- Sprawdź, czy dodanie zadania w Brain Dump powoduje natychmiastowe pojawienie się karty Hero na Pulpicie bez odświeżania.
- Zweryfikuj, czy pigułka wynikowa poprawnie mapuje Kwadrant I przy kombinacji 2xTAK (Ważność) i 2xTAK (Pilność).

- **Audyt techniczny:** Upewnij się, że żaden plik poza `db/index.ts` nie wywołuje bezpośrednio funkcji `openDB()`.

---

*Briefing zatwierdzony przez Managera Projektu.*