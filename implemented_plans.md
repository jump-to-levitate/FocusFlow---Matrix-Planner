# Implemented Plans Registry

> Rejestr zakończonych planów implementacyjnych  
> Struktura: Plan (1) → Implementacja (1) → Weryfikacja (AC)  
> Ostatnia aktualizacja: 2026-05-17

---

## Mapowanie Plan → Implementacja

| Plik Planu | Nazwa Planu | Status | Data | Commit |
|------------|-------------|--------|------|--------|
| [`docs/plans/02_features/01_inbox_capture.md`](docs/plans/02_features/01_inbox_capture.md) | Inbox Capture (Q0) & Brain Dump | ✅ 100% UKOŃCZONE | 2026-05-17 | 7bf646b |
| [`docs/plans/02_features/02_focus_timer.md`](docs/plans/02_features/02_focus_timer.md) | Cyberpunk Focus Timer (7 ADHD-Proof Presets) | ✅ 100% UKOŃCZONE | 2026-05-17 | 7bf646b |
| [`docs/plans/02_features/03_centrum_planowania_q2.md`](docs/plans/02_features/03_centrum_planowania_q2.md) | Centrum Planowania (Sub-Matrix Q2) | ✅ 100% UKOŃCZONE | 2026-05-17 | 7bf646b |

---

## Szczegółowy Status Realizacji

### PL-01: `01_inbox_capture.md` - Inbox Capture (Q0) & Brain Dump

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Data implementacji:** 2026-05-17  
**Related Feature:** Inbox Capture (Q0) Pipeline

#### Podsumowanie Techniczne:
- ✅ Izolacja ćwiartki Q0 (Inbox) od głównej Macierzy Q1-Q4 (`quadrant !== 0`)
- ✅ Mechanizm Snapshot State z key-based component re-mount (`key={`quiz-${taskId}`}`)
- ✅ Dual-mode Transaction (reklasyfikacja in-place + tworzenie nowych zadań)
- ✅ Seryjny Brain Dump bez barier decyzyjnych

#### Kryteria Akceptacji (AC) - Status:

| AC | Opis | Status | Weryfikacja |
|----|------|--------|-------------|
| AC-1 | Izolacja Q0 od Macierzy Głównej | ✅ PASS | Zadania Q0 niewidoczne w Q1-Q4 |
| AC-2 | Seryjny Brain Dump bez Barier Decyzyjnych | ✅ PASS | Max 2 kliknięcia do dodania |
| AC-3 | Snapshot State przy Reklasyfikacji | ✅ PASS | Tytuł prefill'owany w Quizie |
| AC-4 | Key-Based Remount eliminujący Zombie State | ✅ PASS | Brak pamięci stanu między zadaniami |
| AC-5 | Dual-Mode Transaction | ✅ PASS | `update` vs `add` w zależności od kontekstu |
| AC-6 | Propagacja po Kwalifikacji | ✅ PASS | Zadanie znika z Q0, pojawia się w Q1-Q4 |

---

### PL-02: `02_focus_timer.md` - Cyberpunk Focus Timer

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Data implementacji:** 2026-05-17  
**Related Feature:** Cyberpunk Focus Timer Engine

#### Podsumowanie Techniczne:
- ✅ Globalny TimerContext z architekturą Unix Delta Timestamp (ADR 003)
- ✅ Odporność na Background Throttling (`Date.now()` delta)
- ✅ 7 presetów czasowych (5/0, 10/0, 15/5, 25/5, 50/10, 90/15, Time Boxing)
- ✅ Brak opcji "Custom" - eliminacja paraliżu decyzyjnego
- ✅ Globalny 3-Way Strategic Modal (Complete/Continue/Return)
- ✅ Safe ID casting (string → number) dla Dexie
- ✅ PWA Audio Gesture Unlock (Web Audio API)

#### Kryteria Akceptacji (AC) - Status:

| AC | Opis | Status | Weryfikacja |
|----|------|--------|-------------|
| AC-1 | Odporność na Background Throttling | ✅ PASS | Delta Timestamp, błąd ≤ 1s |
| AC-2 | Globalny Singleton TimerContext | ✅ PASS | Spójność przy re-renderach |
| AC-3 | 3-Way Strategic Modal z Globalną Synchronizacją | ✅ PASS | Modal pojawia się przy timeLeft === 0 |
| AC-4 | Safe ID Casting przy Zapisie Ukończenia | ✅ PASS | `typeof id === 'string' ? parseInt(id, 10) : id` |
| AC-5 | PWA Audio Gesture Unlock | ✅ PASS | AudioContext.resume() przy START |
| AC-6 | Eliminacja Paraliżu Decyzyjnego (7 Presets) | ✅ PASS | Brak opcji "Custom" |

---

### PL-03: `03_centrum_planowania_q2.md` - Centrum Planowania (Sub-Matrix Q2)

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Data implementacji:** 2026-05-17  
**Related Feature:** Centrum Planowania Q2 (Deep Context)

#### Podsumowanie Techniczne:
- ✅ Maszyna stanów widoku (`viewMode: 'grid' | 'q2'`)
- ✅ Sub-matryca 2x2 z 4 kategoriami: Rutyny, Projekty, Ogólne Cele, Inne
- ✅ Rozszerzenie schematu Dexie o pole `subcategory?: string`
- ✅ Stała wysokość nagłówków (`h-14`) - uniform alignment
- ✅ Blokada łamania słów (`whitespace-nowrap`)
- ✅ Normalizacja null → "Inne" (brak pustych kategorii)
- ✅ Quiz bypass dla Q2 (`initialQuadrant={2}`)

#### Kryteria Akceptacji (AC) - Status:

| AC | Opis | Status | Weryfikacja |
|----|------|--------|-------------|
| AC-1 | Sub-Matryca 2x2 z 4 Szufladami | ✅ PASS | Rutyny, Projekty, Cele, Inne widoczne |
| AC-2 | Stała Wysokość Nagłówków (h-14) | ✅ PASS | 56px uniform we wszystkich 4 boxach |
| AC-3 | Blokada Łamania Słów Kluczowych | ✅ PASS | `whitespace-nowrap` działa |
| AC-4 | Normalizacja Null/Undefined → "Inne" | ✅ PASS | Fallback działa, brak crashu |
| AC-5 | Maszyna Stanów Widoku (viewMode) | ✅ PASS | Płynne przejście grid ↔ q2 |
| AC-6 | Quiz Bypass (initialQuadrant=2) | ✅ PASS | Pominięcie pytań kwalifikacyjnych |

---

## Plany w Trakcie / Oczekujące

| Plik Planu | Nazwa Planu | Status | Estymacja |
|------------|-------------|--------|-----------|
| `docs/plans/02_features/04_hub_logistyki_q3.md` | Hub Logistyki (Q3 - Proza Życia) | 🔄 W TRAKCIE | Q3 2026 |
| `docs/plans/02_features/05_archiwum_q4.md` | Archiwum (Q4 - Nie Teraz) | 📋 PLANOWANE | Q3 2026 |
| `docs/plans/03_technical/04_design_system_tokens.md` | Design System Tokens | 📋 PLANOWANE | Q2 2026 |
| `docs/plans/03_technical/05_pwa_assets_audio.md` | PWA Assets & Audio Engine | ✅ CZĘŚCIOWO | - |

---

## Legenda

| Symbol | Status | Opis |
|--------|--------|------|
| ✅ | UKOŃCZONE | Plan zaimplementowany, wszystkie AC spełnione |
| 🔄 | W TRAKCIE | Implementacja w toku |
| 📋 | PLANOWANE | Plan zatwierdzony, oczekuje na start |
| ⏸️ | ZAWIESZONE | Tymczasowo wstrzymane |

---

**Zasada:** Każdy plan MUSI mieć dokładnie 1:1 mapowanie na implementację i weryfikację AC.

