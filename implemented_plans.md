- [x] PLAN_inbox_capture.md
- [x] PLAN_focus_timer.md
- [x] PLAN_centrum_planowania_q2.md
- [x] PLAN_hub_logistyki_q3.md
- [x] PLAN_archiwum_q4.md
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

### PL-04: `04_hub_logistyki_q3.md` - Hub Logistyki (Sub-Matrix Q3)

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Data implementacji:** 2026-05-18  
**Related Feature:** Hub Logistyki Q3 (Logistics & Life Admin)

#### Podsumowanie Techniczne:
- ✅ Maszyna stanów widoku (`viewMode: 'grid' | 'q3'`)
- ✅ Sub-matryca 2x2 z 4 kategoriami: Zrób teraz, Zaplanuj, W przerwie, Inne
- ✅ Cyberpunkowa kolorystyka pomarańcz (#FF8C00) i cyjan (#00E5FF)
- ✅ Bypass quizu dla Q3 (`initialQuadrant={3}`)
- ✅ Naprawa race condition przy zapisie podkategorii (`submitTaskWithSubcategory`)

#### Kryteria Akceptacji (AC) - Status:

| AC | Opis | Status | Weryfikacja |
|----|------|--------|-------------|
| AC-1 | Bypass Quiz dla Q3 | ✅ PASS | Pominięcie quizu, przejście bezpośrednio do subkategorii |
| AC-2 | Race Condition Fix | ✅ PASS | Bezpośrednie przekazanie podkategorii do funkcji zapisu |
| AC-3 | Sub-panel Hub Logistyki | ✅ PASS | Widok 3-sekcyjny z cyberpunkową kolorystyką |

---

### PL-05: `05_archiwum_q4.md` - Archiwum (Sub-Matrix Q4)

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Data implementacji:** 2026-05-18  
**Related Feature:** Archiwum Q4 (Cognitive Noise & Distractions)

#### Podsumowanie Techniczne:
- ✅ Maszyna stanów widoku (`viewMode: 'grid' | 'q4'`)
- ✅ Sub-matryca 2x2 z 4 kategoriami: Rozrywka, Hobby, Optymalizacja, Side-questy
- ✅ Kolorystyka "Neon Chrome / Matte Silver" (#9CA3AF) - wybalansowana jasność
- ✅ Destructive Hatch ("Odrzuć / Zapomnij") - psychologiczne prawo do skasowania
- ✅ Bypass quizu dla Q4 (`initialQuadrant={4}`)
- ✅ Manual override priorytet nad algorytmem (`manualQuadrant ?? bypass ?? computed`)

#### Kryteria Akceptacji (AC) - Status:

| AC | Opis | Status | Weryfikacja |
|----|------|--------|-------------|
| AC-1 | Destructive Hatch | ✅ PASS | Zadanie nie zostaje zapisane, modal zamyka się natychmiast |
| AC-2 | Manual Override | ✅ PASS | Ręczny wybór nadpisuje wyliczenia algorytmu |
| AC-3 | Bypass Quiz dla Q4 | ✅ PASS | Pominięcie quizu, przejście bezpośrednio do subkategorii |

---

## Plany w Trakcie / Oczekujące

| Plik Planu | Nazwa Planu | Status | Estymacja |
|------------|-------------|--------|-----------|
| `docs/plans/03_technical/04_design_system_tokens.md` | Design System Tokens | 📋 PLANOWANE | Q2 2026 |
| `docs/plans/03_technical/05_pwa_assets_audio.md` | PWA Assets & Audio Engine | ✅ CZĘŚCIOWO | - |

---

## Archiwum Zakończonych Planów

Wszystkie plany z sekcji [Szczegółowy Status Realizacji](#szczegółowy-status-realizacji) zostały w pełni wdrożone i zweryfikowane.
**Ostatnia aktualizacja:** 2026-05-18

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

