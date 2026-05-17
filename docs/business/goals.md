# Cele Biznesowe FocusFlow 2.0

> Single Source of Truth dla zakresu funkcjonalnego i architektury UX

## Cel Biznesowy i Psychologiczny

FocusFlow 2.0 jest zaprojektowany jako **ADHD-proof productivity system**, który eliminuje barierę wejścia (friction) poprzez:

- **Redukcję oporu poznawczego** - brak konieczności podejmowania decyzji przy wprowadzaniu danych
- **Natychmiastową nagrodę (dopaminową)** - neonowy, cyberpunkowy interfejs zapewniający wizualną satysfakcję
- **Offline-first** - brak zależności od internetu eliminuje lęk przed utratą danych
- **Brak kont i logowania** - redukcja bariery wejścia do absolutnego minimum

---

## Uproszczony Zakres v2.0

FocusFlow 2.0 to **uproszczona wersja** skupiająca się na 4 core funkcjach.

---

## 1. Macierz Priorytetów (Q1-Q4)

**Opis**: Dwuwymiarowa macierz Eisenhowera z podziałem na kwadranty.

### Kwadranty:

| Kwadrant | Nazwa | Definicja |
|----------|-------|-----------|
| Q1 | Pilne & Ważne | Kryzysy, deadline'y |
| Q2 | Nie-pilne & Ważne | Planowanie, rozwój |
| Q3 | Pilne & Nie-ważne | Przerwy, niektóre spotkania |
| Q4 | Nie-pilne & Nie-ważne | Time wasters |

### Podkategorie (Q2, Q3, Q4):

- Q2: `health`, `growth`, `relationships`, `finance`, `career`
- Q3: `admin`, `breaks`
- Q4: `entertainment`, `distractions`

Q1 ma **wyłączność na podkategorie** - pozostałe kwadranty mogą je dzielić.

---

## 2. Inteligentny Quiz

**Opis**: Krótki quiz mapujący odpowiedzi użytkownika na rekomendacje kwadrantów.

### Flow:

1. 5-8 pytań w stylu: "Masz 30 minut wolnego - co robisz?"
2. Algorytm przypisuje użytkownika do dominującego kwadrantu
3. Rekomendacje zadań z odpowiedniego kwadrantu

---

## 3. System Notatek

**Opis**: Dwa typy notatek z pełnym CRUD.

### Typy:

| Typ | Opis | Relacja |
|-----|------|---------|
| Free Notes | Wolne notatki bez przypisania | Brak |
| Linked Notes | Notatki przypisane do zadań | `taskId` FK |

### Funkcje:

- Tworzenie/edycja/usuwanie
- Rich text (opcjonalnie markdown)
- Timestamp created/updated

---

## 4. Focus Timer

**Opis**: Miniaturowy timer Pomodoro wbudowany w UI.

### Funkcje:

- Czas: 25 min (focus), 5 min (short break), 15 min (long break)
- Powiadomienia audio
- Integracja z zadaniami (opcjonalnie)

---

## Out of Scope (v2.0)

Funkcje **celowo wykluczone** z wersji 2.0:

- AI/LLM integracja
- Sync z chmurą
- Wieloużytkownikowość
- Zaawansowane raporty/statystyki
- Integracje zewnętrzne (kalendarze)

---

## KPI Sukcesu

- Czas do pierwszego zadania < 2 min
- Offline functionality 100%
- Mobile UX bez poziomego scrolla

---

## Kompletny User Journey (Flow Użytkownika)

### Krok 1: Frictionless Dump (Brain Dump / Q0 Inbox Capture)

Użytkownik otwiera aplikację i natychmiast trafia do **Inboxu (Ćwiartka 0)** - przestrzeni bez decyzji.

- **Akcja**: Szybki zrzut myśli, idei, zadań bez kategoryzacji
- **Mechanizm**: Izolacja Q0 - zadania tu trafiają nie pojawiają się w głównej Macierzy (Q1-Q4)
- **UX**: Tekstarea z placeholderem "Co teraz masz w głowie?"
- **Psychologia**: Eliminuje **paraliż decyzyjny** - użytkownik nie musi podejmować decyzji przy wprowadzaniu

---

### Krok 2: Kwalifikacja w Quizie (Task Classification)

Zadania z Q0 przechodzą przez **Inteligentny Quiz**, który mapuje odpowiedzi na ćwiartki.

- **Akcja**: 3 pytania o ważność i pilność (9 kombinacji odpowiedzi)
- **Algorytm**: `classifyFromScores()` determinuje ćwiartkę (Q1-Q4)
- **Flow**:
  1. Tytuł zadania
  2. Pytania kwalifikacyjne (automatyczny advance po odpowiedzi)
  3. Dla Q2: wybór podkategorii (Rutyny, Projekty, Ogólne Cele, Inne)
  4. Ekran potwierdzenia z możliwością ręcznej zmiany ćwiartki
- **Psychologia**: Zewnętrzalizacja decyzji - algorytm decyduje, nie użytkownik

---

### Krok 3: Filtrowanie w Centrum Planowania (Q2 Sub-Matrix)

Zadania zakwalifikowane do Q2 (Ważne, Niepilne) trafiają do **Centrum Planowania** - dedykowanego sub-widoku 2x2.

- **Layout**: Grid 2x2 z podziałem na:
  - **Rutyny** (🔄) - Nawyki i systemy wspierające funkcjonowanie
  - **Projekty** (📁) - Konkretne prace wymagające planowania
  - **Ogólne Cele** (🎯) - Kierunki bez rozplanowanych działań
  - **Inne** (💼) - Pozostałe zadania i niezakategoryzowane
- **Kolorystyka**: Śródtymowy fiolet (#D000FF) i zieleń (#00FF66) - dopaminowa kolorystyka cyberpunkowa
- **UX**: Sztywna wysokość nagłówków (h-14), precyzyjna typografia unikająca łamania słów
- **Psychologia**: **ADHD-friendly** - wizualna jasność, brak przeciążenia informacyjnego

---

### Krok 4: Skupienie w Timerze (Focus Mode)

Użytkownik wybiera zadanie i przechodzi do **Cyberpunkowego Timera** z 7 trybami pracy.

- **Tryby**:
  - Quick: 5/0, 10/0 (brak przerw)
  - Standard: 15/5, 25/5, 50/10 (Pomodoro z przerwami)
  - Deep: 90/15 (głęboka praca)
  - Time Boxing: dowolny czas (do 4h)
- **Stany wizualne**:
  - **Running**: Neonowy zielony (#39FF14), pulsujący cień, cyfrowy wyświetlacz
  - **Paused**: Przyciemniony fiolet (#D000FF), zatrzymana animacja
- **Integracja**: Dropdown z zadaniami Q1 (Pilne & Ważne) i Q2 (Centrum Planowania)

---

### Krok 5: Elastyczne Domknięcie Sesji (Completion Modal)

Po zakończeniu timera użytkownik widzi **3-kierunkowy modal** decyzyjny.

- **Opcja 1: "Zadanie ukończone"**
  - Oznacza zadanie jako completed: true
  - Czyści aktywne zadanie z timera
  - Powrót do timera
  
- **Opcja 2: "Jeszcze jedna sesja"**
  - Zachowuje wybrane zadanie
  - Resetuje timer bez zamykania modalu
  - Umożliwia ciągłą pracę nad tym samym zadaniem

- **Opcja 3: "Wrócę do tego później"**
  - Nie oznacza zadania jako ukończonego
  - Zatrzymuje timer
  - Nawigacja do dashboardu

- **Psychologia**: **Elastyczność** - brak przymusu, użytkownik ma kontrolę nad flow

---

## Architektura Psychologiczna (ADHD UX Principles)

### 1. Redukcja Oporu Poznawczego
- Brak decyzji przy wprowadzaniu (Q0 Inbox)
- Automatyczna klasyfikacja (Quiz)
- Sugerowane podkategorie dla Q2

### 2. Dopaminowa Nagroda Wizualna
- Neonowe kolory cyberpunkowe (#D000FF, #39FF14, #FF8C00)
- Animacje i przejścia (hover:scale, glow effects)
- Natychmiastowa wizualna informacja zwrotna

### 3. Kontekstowa Jakość
- Timer pokazuje tylko aktywne zadanie (brak rozpraszaczy)
- Macierz grupuje zadania wizualnie
- Centrum Planowania izoluje Q2 od chaosu Q1

### 4. Elastyczność i Kontrola
- Możliwość ręcznej zmiany ćwiartki w quizie
- 3 opcje zakończenia sesji (brak przymusu)
- Pause/Resume w dowolnym momencie

