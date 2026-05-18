# Wymagania Biznesowe FocusFlow 2.0

> Business Requirements Specification  
> Document ID: BUS-GOALS-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Principal Business Analyst

---

## 1. Cele Produktu (Product Goals)

### 1.1 Cel Główny

**Zbudowanie bezobsługowego (frictionless), lokalnego systemu zarządzania zadaniami, kompensującego deficyty funkcji wykonawczych (executive dysfunction) i eliminującego paraliż decyzyjny u osób neuroatypowych.**

### 1.2 Wskaźniki KPI

| KPI ID | Wskaźnik | Target | Metoda Pomiaru |
|--------|----------|--------|----------------|
| KPI-001 | Time to First Task | < 10s | Od otwarcia aplikacji do rejestracji pierwszego zadania w IndexedDB |
| KPI-002 | Offline Availability | 100% | Core Features dostępne bez połączenia sieciowego |
| KPI-003 | Zero Loading Screens | 0 | Brak ekranów ładowania i splash screenów |
| KPI-004 | Zero Authentication | 0 | Brak ekranów logowania, rejestracji, OAuth |

---

## 2. Historie Użytkownika (User Stories)

### US-001: Brain Dump (Poczekalnia Q0)

**Format:** Jako [Rola] / Chcę [Funkcja] / Aby [Wartość]

> **Jako** Użytkownik Neuroatypowy  
> **Chcę** natychmiast zapisać każdą myśl w dedykowanej Poczekalni Q0 bez wymogu jej kategoryzacji  
> **Aby** opróżnić pamięć roboczą i uniknąć barier wejścia

**Kryteria Akceptacji:**
- GIVEN użytkownik otwiera aplikację WHEN wyświetla się Q0 THEN widzi puste pole tekstowe bez pytań o kategorię
- GIVEN użytkownik wpisuje tekst WHEN klika Enter THEN zadanie zapisuje się z flagą `quadrant: 0`
- GIVEN 20 myśli w głowie WHEN użytkownik używa Q0 THEN redukuje kognitywne obciążenie do 1 myśli (aktualna)

### US-002: Focus Timer (Szybkie Sesje Skupienia)

> **Jako** Użytkownik (Knowledge Worker)  
> **Chcę** uruchamiać sesje skupienia za pomocą jednego z 7 sztywnych presetów czasowych  
> **Aby** wyeliminować paraliż wyboru i barierę rozpoczęcia pracy

**Kryteria Akceptacji:**
- GIVEN użytkownik wybiera Timer WHEN wyświetla się grid 7 presetów THEN każdy preset jest 1-kliknięciowy
- GIVEN wybrany preset WHEN timer startuje THEN nie pyta o nazwę zadania ani cel sesji
- GIVEN 5-minutowy preset (Quick 5) WHEN timer kończy się THEN użytkownik może kontynuować lub zakończyć

### US-003: Hub Logistyki Q3 (Segmentacja Zadań Administracyjnych)

> **Jako** Użytkownik  
> **Chcę** segmentować zadania administracyjne w Q3 na operacje natychmiastowe, w przerwie i bloki planowane  
> **Aby** uniknąć przeciążenia szumem codziennym

**Kryteria Akceptacji:**
- GIVEN zadanie w Q3 WHEN wyświetla się modal subkategorii THEN dostępne są: Zrób teraz, Zaplanuj blok, W przerwie
- GIVEN zadanie oznaczone "Zrób teraz" (<10 min) WHEN użytkownik ma 5 minut wolnych THEN może je wykonać natychmiast
- GIVEN zadanie oznaczone "Zaplanuj blok" (30 min) WHEN użytkownik planuje dzień THEN widzi je w kalendarzu bloków

### US-004: Archiwum Q4 & Destructive Hatch (Odrzucanie Myśli)

> **Jako** Użytkownik  
> **Chcę** kategoryzować dystraktory oraz mieć fizyczną możliwość bezpowrotnego odrzucenia myśli (Odrzuć/Zapomnij)  
> **Aby** uzyskać psychologiczne odciążenie i zredukować stres poznawczy

**Kryteria Akceptacji:**
- GIVEN zadanie w trakcie klasyfikacji Q4 WHEN użytkownik klika "Odrzuć/Zapomnij" THEN zadanie nie jest zapisywane w IndexedDB
- GIVEN odrzucona myśl WHEN operacja się kończy THEN formularz jest czyszczony i modal zamykany
- GIVEN użytkownik prokrastynuje (TikTok, gry) WHEN dodaje to do Q4 jako "Rozrywka" THEN system nie ocenia - to "zaplanowana przerwa"

---

## 3. Przypadki Użycia (Use Cases)

### UC-001: Przechwytywanie i Klasyfikacja Zadania (Inbox Capture & Quiz Flow)

**Aktor Główny:** Użytkownik

**Warunki Wstępne:**
- Użytkownik posiada otwartą aplikację w widoku Q0
- IndexedDB jest dostępna i zainicjalizowana

**Scenariusz Główny (Happy Path):**
1. Użytkownik wprowadza tekst zadania w polu Input Q0
2. System zapisuje rekord w bazie Dexie z flagą `quadrant: 0` (Poczekalnia)
3. Użytkownik inicjuje Smart Quiz (klikając "Kwalifikuj" na zadaniu)
4. System zadaje 2 binarne pytania (Ważność/Pilność)
5. System wylicza ćwiartkę docelową (1/2/3/4) na podstawie odpowiedzi
6. System prosi o doprecyzowanie subkategorii (dla Q2/Q3/Q4)
7. System aktualizuje zadanie w IndexedDB z nowym `quadrant` i `subcategory`
8. System zamyka kreator i odświeża widok

**Scenariusz Alternatywny (Bypass Flow):**
- W kroku 3, IF przekazano `initialQuadrant` jako argument THEN system pomija krok 4 (pytania binarne)
- System przechodzi bezpośrednio do przypisania subkategorii dla przekazanej ćwiartki

**Warunki Końcowe:**
- Zadanie jest zapisane w trwałej strukturze IndexedDB
- Zadanie ma przypisaną ćwiartkę (1-4) i subkategorię
- UI odzwierciedla nową lokalizację zadania

### UC-002: Obsługa Mechanizmu Przeciążenia i Destrukcji (Destructive Hatch)

**Aktor Główny:** Użytkownik

**Warunki Wstępne:**
- Zadanie jest w trakcie klasyfikacji w kroku subkategorii Q4
- Modal Quiz jest otwarty

**Scenariusz Główny (Destructive Action):**
1. Użytkownik klika przycisk "Odrzuć / Zapomnij" (styling: neon chrome, kolor destrukcyjny)
2. System przerywa transakcję zapisu do IndexedDB
3. System czyści pamięć podręczną formularza quizu (reset stanu)
4. System zamyka modal bez tworzenia wpisu w bazie danych
5. System nie wyświetla żadnego potwierdzenia (silent discard - redukcja tarcia)

**Scenariusz Alternatywny (Awans do Q2):**
- W kroku 1, IF użytkownik klika "Awansuj do Q2" THEN system zmienia kierunek klasyfikacji
- System przenosi zadanie do workflow Q2 (Centrum Planowania)
- System prosi o doprecyzowanie subkategorii Q2 (Teraz/Ten tydzień/Później)

**Warunki Końcowe:**
- Dla Destructive: Zadanie nie istnieje w systemie (brak śladu w IndexedDB)
- Dla Awansu: Zadanie jest zapisane w Q2 z odpowiednią subkategorią

---

## 4. Ograniczenia Biznesowe (Business Constraints)

### Constraint-001: Zero Friction Authentication (Zakaz Logowania)

**Definicja:** Całkowity zakaz implementacji systemów logowania, OAuth i rejestracji kont.

**Uzasadnienie:** Każde tarcie (formularz logowania, ekran OAuth, potwierdzenie email) oznacza natychmiastowy odpływ użytkowników z ADHD. Paraliż decyzyjny przy barierze wejścia = utrata użytkownika.

**Konsekwencje Techniczne:**
- Dane przypisane do urządzenia (IndexedDB), nie do konta użytkownika
- Brak synchronizacji między urządzeniami (celowo)
- Brak backupu chmurowego (eksport JSON jako rozwiązanie TBD)

### Constraint-002: Local-First Data Isolation

**Definicja:** Brak serwera centralnego i zewnętrznej bazy danych. Dane przechowywane są wyłącznie na urządzeniu użytkownika.

**Uzasadnienie:** Maksymalna prywatność i zerowe opóźnienie sieciowe. Osoby neuroatypowe są wrażliwe na "lag" i niepewność połączenia.

**Konsekwencje Techniczne:**
- IndexedDB jako jedyna warstwa persistence
- Dexie.js jako wrapper z obsługą transakcji
- Limit quota przeglądarki (50MB-2GB w zależności od vendor)

### Constraint-003: Mobile-First Constraint (AppShell Safety Net)

**Definicja:** Sztywne ograniczenie szerokości ramy interfejsu do 480px. Brak widoków dedykowanych dla ekranów desktopowych w fazie MVP.

**Uzasadnienie:** Optymalizacja pod kciuk (touch), eliminacja "szukania myszką". Ograniczenie zakresu = szybsza iteracja = lepsze dopasowanie do głównego use case (telefon w ręku).

**Konsekwencje Techniczne:**
- Tailwind CSS z `max-w-[480px]`
- PWA (Progressive Web App) zamiast native app
- Brak responsive breakpoints dla tablet/desktop

---

## 5. Reguły Walidacji (Business Rules)

| Rule ID | Reguła | Uzasadnienie |
|---------|--------|--------------|
| BR-001 | Tytuł zadania nie może być pusty | Unikalność i identyfikowalność wpisu |
| BR-002 | Quadrant musi być liczbą 0-4 | 0=Poczekalnia, 1=Q1, 2=Q2, 3=Q3, 4=Q4 |
| BR-003 | Subkategoria wymagana dla Q2/Q3/Q4 | Doprecyzowanie kontekstu wykonania |
| BR-004 | Timer może działać bez przypisanego zadania | Redukcja barier - użytkownik nie musi planować przed działaniem |
| BR-005 | Destructive Hatch nie tworzy audyt logu | Psychologiczna „guilt-free zone” - brak śladu po odrzuceniu |

---

## 6. Słownik Domenowy (Glossary References)

Szczegółowy słownik terminów znajduje się w: [`docs/business/glossary.md`](./glossary.md)

| Termin | Definicja | Kontekst |
|--------|-----------|----------|
| Brain Dump | Natychmiastowy zapis myśli bez kategoryzacji | Q0 - Inbox |
| Destructive Hatch | Mechanizm bezpowrotnego odrzucania zadań | Q4 - Archiwum |
| Executive Dysfunction | Deficyty funkcji wykonawczych | ADHD, ASD |
| Frictionless | Bezobsługowy, bez tarcia | UX Design |
| Quick 5 | 5-minutowy preset timera | Timer Focus |

---

**Document ID:** BUS-GOALS-001  
**Owner:** Principal Business Analyst  
**Status:** APPROVED  
**Version:** 2.0 (SDD Compliant)
