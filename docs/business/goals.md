# Cele Biznesowe FocusFlow 2.0

> Single Source of Truth dla zakresu funkcjonalnego

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

