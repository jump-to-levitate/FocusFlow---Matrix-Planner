# Product Backlog - FocusFlow 2.0

> Agile Product Backlog Specification  
> Document ID: PO-BACKLOG-001  
> Status: ACTIVE  
> Date: 2026-05-18  
> Owner: Product Owner

---

## 1. Struktura Epiców i User Stories

---

### EPIC-01: Smart Inbox Capture (Q0)

**Cel:** Umożliwienie natychmiastowego zrzutu myśli bez wymogu kategoryzacji.

**Jako** użytkownik przytłoczony 20+ otwartymi kartami i myślami  
**Chcę** natychmiast zapisać każdą myśl w dedykowanej Poczekalni Q0  
**Aby** opróżnić pamięć roboczą i uniknąć barier wejścia.

**Kryteria Akceptacji (AC):**
- AC-01: GIVEN użytkownik otwiera aplikację WHEN wyświetla się Q0 THEN widzi puste pole tekstowe bez pytań o kategorię
- AC-02: GIVEN użytkownik wpisuje tekst WHEN klika Enter THEN zadanie zapisuje się z flagą `quadrant: 0` w IndexedDB
- AC-03: GIVEN zadanie w Q0 WHEN użytkownik inicjuje Smart Quiz THEN system wyświetla 2 binarne pytania (Ważność/Pilność)
- AC-04: GIVEN odpowiedzi w Quizie WHEN system klasyfikuje THEN wylicza ćwiartkę docelową (1/2/3/4)

---

### EPIC-02: Cyberpunk Focus Timer

**Cel:** Silnik timera odporny na throttling z 7 sztywnymi presetami.

**Jako** osoba z time blindness i executive dysfunction  
**Chcę** uruchamiać sesje skupienia jednym kliknięciem bez konfiguracji  
**Aby** wyeliminować paraliż wyboru i barierę rozpoczęcia pracy.

**Kryteria Akceptacji (AC):**
- AC-01: GIVEN użytkownik wybiera Timer WHEN wyświetla się grid 7 presetów THEN każdy jest 1-kliknięciowy (Quick 5, 10, 15, 25/5, 50/10, 90/15, 120/20)
- AC-02: GIVEN wybrany preset WHEN timer startuje THEN nie pyta o nazwę zadania ani cel sesji
- AC-03: GIVEN timer działa w tle WHEN przeglądarka jest zminimalizowana THEN Unix Delta Timestamp zapewnia precyzję ±1s
- AC-04: GIVEN koniec sesji WHEN timer kończy się THEN wyświetla 3-Way Modal (Ukończ/Kolejna sesja/Wróć później)

**Specyfikacja Techniczna:**
- Silnik: Unix Delta Timestamp (ADR-005)
- Architektura: Global TimerContext (singleton)
- Audio: PWA Audio Gesture Unlock (Web Audio API)

---

### EPIC-03: Centrum Planowania (Q2)

**Cel:** Sub-matryca 2x2 dla zadań "ważnych, niepilnych" z fioletowo-zieloną kolorystyką.

**Jako** osoba z "cemetery of good intentions" (zamrażarka ważnych zadań)  
**Chcę** kontekstu wykonawczego dla zadań ważnych/niepilnych  
**Aby** wiedzieć CZY to rutyna na autopilocie, CZY projekt wymagający planowania.

**Kryteria Akceptacji (AC):**
- AC-01: GIVEN zadanie klasyfikowane jako Q2 WHEN wyświetla się sub-matryca THEN widoczne są 4 szuflady: Rutyny (🔄), Projekty (📁), Ogólne Cele (🎯), Inne (💼)
- AC-02: GIVEN sub-matryca Q2 WHEN użytkownik wybiera szufladę THEN zadanie zapisuje się z odpowiednią subkategorią w Dexie.js
- AC-03: GIVEN dodawanie z pod-widoku Q2 WHEN przekazano `initialQuadrant=2` THEN system pomija pytania binarne (Quiz bypass)
- AC-04: GIVEN layout Q2 WHEN renderowana jest sub-matryca THEN używa identycznego layoutu 2x2 jak główna Macierz

**Kolorystyka:**
- Główny: Fiolet (#8B5CF6) / Zielony (#10B981)
- Nagłówki: Uniform h-14

---

### EPIC-04: Hub Logistyki (Q3)

**Cel:** Sub-matryca pomarańczowo-cyjanowa z bezpośrednim zapisem do bazy (direct database saving).

**Jako** osoba przytłoczona "prozą życia" (drobiazgi, obowiązki)  
**Chcę** segmentować zadania administracyjne na operacje natychmiastowe, w przerwie i bloki planowane  
**Aby** uniknąć przeciążenia szumem codziennym.

**Kryteria Akceptacji (AC):**
- AC-01: GIVEN zadanie w Q3 WHEN wyświetla się modal subkategorii THEN dostępne są: 🚀 Zrób teraz (<10min), 📁 Zaplanuj blok, 🔄 W przerwie, 💼 Inne
- AC-02: GIVEN zadanie oznaczone "Zrób teraz" WHEN użytkownik ma 5 minut wolnych THEN może je wykonać natychmiast bez planowania
- AC-03: GIVEN bypass quizu (`initialQuadrant=3`) WHEN dodawanie z pod-widoku THEN pominięcie pytań, bezpośrednie przekazanie podkategorii do Dexie.js (Race Condition Fix)
- AC-04: GIVEN grupowanie w Q3 WHEN zadania są wyświetlane THEN grupowane według kontekstu czasowego (teraz/blok/przerwa)

**Kolorystyka:**
- Pomarańcz (#FF8C00) / Cyjan (#00E5FF) - neurostymulacja

---

### EPIC-05: Archiwum "Nie Teraz" (Q4)

**Cel:** Izolacja szumu mentalnego z motywem Matte Silver i przyciskiem "Odrzuć / Zapomnij" (Destructive Hatch).

**Jako** osoba z 50 pomysłami/dzień, 0 egzekucji  
**Chcę** kategoryzować dystraktory oraz mieć fizyczną możliwość bezpowrotnego odrzucenia myśli  
**Aby** uzyskać psychologiczne odciążenie i zredukować stres poznawczy.

**Kryteria Akceptacji (AC):**
- AC-01: GIVEN zadanie w trakcie klasyfikacji Q4 WHEN wyświetla się sub-matryca THEN widoczne są 4 szuflady: 🎮 Rozrywka, 🎨 Hobby, ⚙️ Optymalizacja, 🗺️ Side-questy
- AC-02: GIVEN użytkownik prokrastynuje (TikTok, gry) WHEN dodaje to do Q4 jako "Rozrywka" THEN system nie ocenia - to "zaplanowana przerwa", nie "prokrastynacja"
- AC-03: GIVEN użytkownik klika "Odrzuć / Zapomnij" (Destructive Hatch) WHEN przycisk jest aktywowany THEN zadanie nie jest zapisywane w IndexedDB (psychologiczne przyzwolenie)
- AC-04: GIVEN odrzucona myśl WHEN operacja się kończy THEN formularz jest czyszczony i modal zamykany bez śladu w bazie
- AC-05: GIVEN ręczna zmiana ćwiartki WHEN użytkownik override'uje predykcję THEN może przypisać zadanie do innej ćwiartki na ekranie potwierdzenia

**Kolorystyka:**
- Matte Silver (#9CA3AF) - wybalansowana jasność niegasząca innych neonów

---

### EPIC-06: Zaawansowana Maszyna Stanów Quizu

**Cel:** Flow: Tytuł -> Pytania -> Confirm -> Manual Override z obsługą wszystkich ćwiartek.

**Jako** użytkownik z executive dysfunction  
**Chcę** aby system prowadził mnie krok-po-kroku przez klasyfikację  
**Aby** uniknąć paraliżu decyzyjnego przy wyborze ćwiartki.

**Kryteria Akceptacji (AC):**
- AC-01: GIVEN użytkownik wprowadza zadanie WHEN pierwszy krok Quizu THEN wyświetla się pole tytułu (opcjonalnie z prefill z Q0)
- AC-02: GIVEN wprowadzony tytuł WHEN drugi krok THEN 2 binarne pytania (Czy to ważne? / Czy to pilne?)
- AC-03: GIVEN odpowiedzi binarne WHEN trzeci krok THEN ekran potwierdzenia z predykcją ćwiartki i przyciskiem Manual Override
- AC-04: GIVEN predykcja Q2/Q3/Q4 WHEN czwarty krok THEN wybór subkategorii w sub-matrycy 2x2
- AC-05: GIVEN bypass dla Q2/Q3/Q4 WHEN `initialQuadrant` jest przekazany THEN pominięcie pytań binarnych, bezpośredni skok do subkategorii

**Flow State Machine:**
```
[Input: Title] -> [Questions: Important/Urgent] -> [Confirm: Quadrant + Override] -> [Subcategory: Q2/Q3/Q4] -> [Save to Dexie.js]
```

---

## 2. Mapowanie Epiców na Moduły

| Epic ID | Nazwa | Główny Plan | Quadrant | Status |
|---------|-------|-------------|----------|--------|
| EPIC-01 | Smart Inbox Capture | PLAN_inbox_capture.md | Q0 | ✅ Implemented |
| EPIC-02 | Cyberpunk Focus Timer | PLAN_focus_timer.md | Q1 (Timer) | ✅ Implemented |
| EPIC-03 | Centrum Planowania | PLAN_centrum_planowania_q2.md | Q2 | ✅ Implemented |
| EPIC-04 | Hub Logistyki | PLAN_hub_logistyki_q3.md | Q3 | ✅ Implemented |
| EPIC-05 | Archiwum Nie Teraz | PLAN_archiwum_q4.md | Q4 | ✅ Implemented |
| EPIC-06 | Maszyna Stanów Quizu | PLAN_smart_quiz.md | All | ✅ Implemented |

---

## 3. Acceptance Criteria Format

Wszystkie AC w backlogu używają formatu **GIVEN-WHEN-THEN**:
- **GIVEN** - Stan początkowy/warunki wstępne
- **WHEN** - Akcja użytkownika lub zdarzenie systemowe
- **THEN** - Oczekiwany rezultat/warunek końcowy

---

**Document ID:** PO-BACKLOG-001  
**Owner:** Product Owner  
**Status:** ACTIVE  
**Last Updated:** 2026-05-18
