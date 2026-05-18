# Implemented Features Registry

> Single Source of Truth dla zaimplementowanych funkcji FocusFlow 2.0  
> Struktura: Feature ↔ Plan (1:1) + AC Coverage  
> Ostatnia aktualizacja: 2026-05-18

---

## Mapowanie Feature → Plan

| Feature | Powiązany Plan | Status | Data | AC Status |
|---------|----------------|--------|------|-----------|
| Inbox Capture (Q0) | [`01_inbox_capture.md`](docs/plans/02_features/01_inbox_capture.md) | ✅ VERIFIED | 2026-05-17 | 6/6 ✅ |
| Cyberpunk Focus Timer | [`02_focus_timer.md`](docs/plans/02_features/02_focus_timer.md) | ✅ VERIFIED | 2026-05-17 | 6/6 ✅ |
| Centrum Planowania Q2 | [`03_centrum_planowania_q2.md`](docs/plans/02_features/03_centrum_planowania_q2.md) | ✅ VERIFIED | 2026-05-17 | 6/6 ✅ |
| Hub Logistyki Q3 | [`04_hub_logistyki_q3.md`](docs/plans/02_features/04_hub_logistyki_q3.md) | ✅ VERIFIED | 2026-05-18 | 3/3 ✅ |
| Archiwum Q4 | [`05_archiwum_q4.md`](docs/plans/02_features/05_archiwum_q4.md) | ✅ VERIFIED | 2026-05-18 | 3/3 ✅ |

---

## [WDROŻONE] FE-01: Inbox Capture (Q0) & Brain Dump Pipeline

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Powiązany Plan:** [`docs/plans/02_features/01_inbox_capture.md`](docs/plans/02_features/01_inbox_capture.md)  
**Data implementacji:** 2026-05-17  
**Commit:** `7bf646b`

### Opis Funkcjonalny
Seryjny, bezwysiłkowy zrzut myśli w widoku Brain Dump (czyszczenie RAM-u mózgu) z całkowitą izolacją zadań Q0 od głównej Macierzy Q1-Q4.

### Kluczowe Elementy Implementacji

| Element | Implementacja | AC |
|---------|---------------|-----|
| Izolacja Q0 | `tasks.filter(t => t.quadrant !== 0)` | AC-1 ✅ |
| Snapshot State | `key={`quiz-${taskId}`}` | AC-3 ✅ |
| Dual-mode Transaction | `onClassify` vs `submitTask` | AC-5 ✅ |
| Seryjny Brain Dump | Pozostanie w Q0 po dodaniu | AC-2 ✅ |

### Kryteria Akceptacji (AC) - Szczegóły

```markdown
AC-1: Izolacja Q0 od Macierzy Głównej
> GIVEN zadanie zapisane z `quadrant: 0` WHEN system renderuje główną Macierz
> THEN zadanie Q0 nie pojawia się w żadnej z 4 ćwiartek macierzy
✅ STATUS: PASS (Weryfikacja: Zadania Q0 niewidoczne w Q1-Q4)

AC-2: Seryjny Brain Dump bez Barier Decyzyjnych
> GIVEN użytkownik na ekranie Inbox WHEN wpisuje tekst i naciska Enter
> THEN zadanie zapisuje się do Q0 bez konieczności odpowiadania na pytania
✅ STATUS: PASS (Weryfikacja: Max 2 kliknięcia do dodania)

AC-3: Snapshot State przy Reklasyfikacji
> GIVEN klik "Kwalifikuj" dla zadania z Q0 WHEN QuizModal otwiera się
> THEN pole tytułu jest automatycznie prefill'owane
✅ STATUS: PASS (Weryfikacja: Tytuł prefill'owany w Quizie)

AC-4: Key-Based Remount eliminujący Zombie State
> GIVEN otwarcie QuizModal dla zadania X, zamknięcie, otwarcie dla Y
> THEN komponent wykonuje pełny unmount/remount
✅ STATUS: PASS (Weryfikacja: Brak pamięci stanu między zadaniami)

AC-5: Dual-Mode Transaction
> GIVEN QuizModal w kontekście istniejącego zadania WHEN zatwierdzenie
> THEN system wywołuje `db.tasks.update()` zamiast `db.tasks.add()`
✅ STATUS: PASS (Weryfikacja: update vs add w zależności od kontekstu)

AC-6: Propagacja po Kwalifikacji
> GIVEN zadanie z Q0 zakwalifikowane do ćwiartki X WHEN zapis sukcesem
> THEN zadanie znika z Q0 i pojawia się w odpowiedniej ćwiartce
✅ STATUS: PASS (Weryfikacja: Zadanie znika z Q0, pojawia się w Q1-Q4)
```

---

## [WDROŻONE] FE-02: Cyberpunk Focus Timer (ADHD-Proof Engine)

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Powiązany Plan:** [`docs/plans/02_features/02_focus_timer.md`](docs/plans/02_features/02_focus_timer.md)  
**Data implementacji:** 2026-05-17  
**Commit:** `7bf646b`

### Opis Funkcjonalny
Globalny silnik odliczania z architekturą Unix Delta Timestamp, odporny na Background Throttling, z 7 presetami ADHD-Proof (brak opcji "Custom").

### Kluczowe Elementy Implementacji

| Element | Implementacja | AC |
|---------|---------------|-----|
| Delta Timestamp | `expectedEndTime - Date.now()` | AC-1 ✅ |
| Global TimerContext | Singleton React Context | AC-2 ✅ |
| 3-Way Modal | `showCompletionModal` w Context | AC-3 ✅ |
| Safe ID Casting | `typeof id === 'string' ? parseInt(id, 10) : id` | AC-4 ✅ |
| Audio Unlock | `AudioContext.resume()` przy START | AC-5 ✅ |
| 7 Presets | Brak "Custom" - 5/0, 10/0, 15/5, 25/5, 50/10, 90/15, Time Boxing | AC-6 ✅ |

### Kryteria Akceptacji (AC) - Szczegóły

```markdown
AC-1: Odporność na Background Throttling
> GIVEN użytkownik minimalizuje kartę WHEN odliczanie trwa w tle
> THEN silnik Delta Timestamp gwarantuje precyzję czasu (błąd ≤ 1s)
✅ STATUS: PASS (Weryfikacja: Delta Timestamp, błąd ≤ 1s przy 5min w tle)

AC-2: Globalny Singleton TimerContext
> GIVEN odmontowanie i ponowne zamontowanie TimerScreen
> THEN timeLeft pozostaje spójny (stan poza cyklem życia komponentu)
✅ STATUS: PASS (Weryfikacja: Spójność przy re-renderach)

AC-3: 3-Way Strategic Modal z Globalną Synchronizacją
> GIVEN timer osiągnie timeLeft === 0 WHEN TimerScreen wykryje stan
> THEN globalny stan showCompletionModal zmienia się na true
✅ STATUS: PASS (Weryfikacja: Modal pojawia się przy timeLeft === 0)

AC-4: Safe ID Casting przy Zapisie Ukończenia
> GIVEN klik "Ukończ Zadanie" WHEN operacja aktualizacji w Dexie
> THEN ID jest bezpiecznie rzutowane na number (Dexie wymaga number)
✅ STATUS: PASS (Weryfikacja: typeof id === 'string' ? parseInt(id, 10) : id)

AC-5: PWA Audio Gesture Unlock
> GIVEN blokada AudioContext zgodnie z Autoplay Policy
> WHEN użytkownik klika START THEN AudioContext.resume() odblokowuje audio
✅ STATUS: PASS (Weryfikacja: AudioContext.resume() przy kliknięciu START)

AC-6: Eliminacja Paraliżu Decyzyjnego (7 Presets)
> GIVEN użytkownik na ekranie timera WHEN wyświetla się grid presetów
> THEN system prezentuje dokładnie 7 predefiniowanych opcji bez "Custom"
✅ STATUS: PASS (Weryfikacja: Brak opcji "Custom" w UI)
```

---

## [WDROŻONE] FE-03: Centrum Planowania (Sub-Matrix Q2 2x2)

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Powiązany Plan:** [`docs/plans/02_features/03_centrum_planowania_q2.md`](docs/plans/02_features/03_centrum_planowania_q2.md)  
**Data implementacji:** 2026-05-17  
**Commit:** `7bf646b`

### Opis Funkcjonalny
Dedykowany pod-ekran wewnątrz zakładki Macierz z sub-matrycą 2x2 dla zadań Q2, podział na 4 kategorie wykonawcze z chirurgiczną precyzją UI.

### Kluczowe Elementy Implementacji

| Element | Implementacja | AC |
|---------|---------------|-----|
| Sub-matryca 2x2 | 4 szuflady: Rutyny, Projekty, Cele, Inne | AC-1 ✅ |
| Uniform h-14 | `h-14` (56px) we wszystkich nagłówkach | AC-2 ✅ |
| whitespace-nowrap | Blokada łamania słów w nagłówkach | AC-3 ✅ |
| Null → Inne | `!sub || sub === '' ? 'inne' : sub` | AC-4 ✅ |
| viewMode | `useState<'grid' | 'q2'>('grid')` | AC-5 ✅ |
| Quiz Bypass | `initialQuadrant={2}` | AC-6 ✅ |

### Kryteria Akceptacji (AC) - Szczegóły

```markdown
AC-1: Sub-Matryca 2x2 z 4 Szufladami Wykonawczymi
> GIVEN nawigacja do Centrum Planowania (Q2) WHEN render sub-matrycy
> THEN wyświetlane są 4 kategorie: Rutyny, Projekty, Cele, Inne
✅ STATUS: PASS (Weryfikacja: Wszystkie 4 szuflady widoczne i funkcjonalne)

AC-2: Stała Wysokość Nagłówków (h-14) i Uniform Alignment
> GIVEN render nagłówków 4 boxów WHEN przeglądanie interfejsu
> THEN wszystkie nagłówki mają identyczną wysokość h-14 (56px)
✅ STATUS: PASS (Weryfikacja: 56px uniform we wszystkich 4 boxach)

AC-3: Blokada Łamania Słów Kluczowych (whitespace-nowrap)
> GIVEN etykieta "Centrum Planowania" na ekranie 480px WHEN render
> THEN whitespace-nowrap wymusza niełamanie słów
✅ STATUS: PASS (Weryfikacja: Brak efektu "PLANO-WANIA")

AC-4: Normalizacja Null/Undefined → "Inne"
> GIVEN zadanie bez subkategorii (null/undefined/"") WHEN grupowanie
> THEN zadanie automatycznie trafia do "Inne" bez awarii UI
✅ STATUS: PASS (Weryfikacja: Fallback działa, brak crashu, licznik widoczny)

AC-5: Maszyna Stanów Widoku (viewMode Switching)
> GIVEN główna Macierz (viewMode='grid') i klik "Otwórz Centrum Planowania"
> WHEN akcja zainicjowana THEN płynne przejście na sub-matrycę Q2
✅ STATUS: PASS (Weryfikacja: Płynne przejście grid ↔ q2)

AC-6: Quiz Bypass (initialQuadrant=2) przy Dodawaniu z Q2
> GIVEN użytkownik w Centrum Planowania i klik "+ Dodaj"
> WHEN QuizModal otwiera się THEN pominięcie pytań kwalifikacyjnych
✅ STATUS: PASS (Weryfikacja: Quiz przechodzi bezpośrednio do wyboru subkategorii)
```

---

## [WDROŻONE] FE-05: Archiwum Q4 (Sub-Matrix)

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Powiązany Plan:** [`docs/plans/02_features/05_archiwum_q4.md`](docs/plans/02_features/05_archiwum_q4.md)  
**Data implementacji:** 2026-05-18

### Opis Funkcjonalny
Izolacja szumu kognitywnego i dystraktorów (ćwiartka Q4: Nieważne, Niepilne) w układzie siatki 2x2. Kolorystyka: "Neon Chrome / Matte Silver" (#9CA3AF).

### Kluczowe Elementy Implementacji

| Element | Implementacja | AC |
|---------|---------------|-----|
| Sub-Matryca 2x2 | `viewMode: 'q4'` + 4 kafelki | AC-3 ✅ |
| Podkategorie | Rozrywka, Hobby, Optymalizacja, Side-questy | AC-2 ✅ |
| Destructive Hatch | Przycisk "Odrzuć / Zapomnij" | AC-1 ✅ |
| Manual Override | `manualQuadrant ?? bypass ?? computed` | AC-2 ✅ |
| Bypass Quizu | `openQuiz(4)` | AC-3 ✅ |
| Kolorystyka | `#9CA3AF` (Cool Steel) | AC-2 ✅ |

---

## Podsumowanie Statusu (Summary)

| Feature | Plan | AC | Status | Data |
|---------|------|----|--------|------|
| Inbox Capture (Q0) | `01_inbox_capture.md` | 6/6 ✅ | VERIFIED | 2026-05-17 |
| Cyberpunk Focus Timer | `02_focus_timer.md` | 6/6 ✅ | VERIFIED | 2026-05-17 |
| Centrum Planowania Q2 | `03_centrum_planowania_q2.md` | 6/6 ✅ | VERIFIED | 2026-05-17 |
| Hub Logistyki Q3 | `04_hub_logistyki_q3.md` | 3/3 ✅ | VERIFIED | 2026-05-18 |
| Archiwum Q4 | `05_archiwum_q4.md` | 3/3 ✅ | VERIFIED | 2026-05-18 |
| **TOTAL** | 5 planów | **24/24** | **100%** | - |

---

## Zasady Prowadzenia Rejestru (Registry Rules)

1. **1:1 Mapping** - Każda funkcja MUSI mieć dokładnie 1 powiązany plan
2. **AC Coverage** - Wszystkie Acceptance Criteria muszą być weryfikowalne (PASS/FAIL)
3. **Traceability** - Każdy commit musi być linkowalny do planu
4. **Data Requirement** - Data implementacji jest wymagana dla statusu VERIFIED
5. **No Orphans** - Brak funkcji bez planu, brak planów bez funkcji

**Złota Zasada:** Struktura Plików (w `docs/`) ≡ Struktura Logów (w root) ≡ Struktura Implementacji (w `app/`)


