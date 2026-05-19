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

### PL-02: `02_focus_timer.md` - Focus Timer (Delta Timestamp Engine)

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Data Ukończenia:** 2026-05-19

| Moduł | Opis | Status |
|-------|------|--------|
| `TimerContext` | Globalny singleton z `useReducer`, `useMemo`, `useEffect` | ✅ |
| `timerEngine.ts` | Delta Timestamp Algorithm (Background Throttling proof) | ✅ |
| `timerPresets.ts` | 7 ADHD-proof presets (5-90 min) | ✅ |
| `TimerScreen.tsx` | UI 430px Pro Max, neon UX | ✅ |
| `useTimer()` | Hook do konsumpcji kontekstu | ✅ |

---

### PL-03: `03_centrum_planowania_q2.md` - Centrum Planowania (Sub-Matrix Q2)

**Status:** ✅ IMPLEMENTED & VERIFIED  
**Data implementacji:** 2026-05-19  
**Related Feature:** Centrum Planowania Q2 (Deep Context)

#### Podsumowanie Techniczne:
- ✅ Komponent `Q2Tile.tsx` z atomową architekturą i `useMemo` dla sortowania
- ✅ Ekran `Q2PlanningCenter.tsx` z siatką `grid-cols-2 gap-3` (symetria osiowa 2x2)
- ✅ Silne typowanie `Q2Subcategory` (String Union: 'rutyna' | 'projekt' | 'ogolny_cel' | 'inne')
- ✅ Rozszerzenie schematu Dexie o pole `subcategory?: Q2Subcategory`
- ✅ Synchronizacja IndexedDB pod kątem spójności literałów tekstowych ('rutyna')
- ✅ Stała wysokość nagłówków (`h-14`) - uniform alignment
- ✅ Blokada łamania słów (`whitespace-nowrap`)
- ✅ Normalizacja null → "Inne" (brak pustych kategorii)
- ✅ Quiz bypass dla Q2 (`bypassMode={true}`, `initialQuadrant={2}`)
- ✅ Usunięcie martwego kodu sub-widoków w MatrixScreen

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

## Wdrożone Funkcjonalności (Stan na: Maj 2026)

- [x] PLAN_focus_timer.md (Silnik Delta Timestamp, odporność na throttling, ekran zegara)
- [x] PLAN_centrum_planowania_q2.md (Siatka 2x2, silne typowanie subkategorii, integracja Quiz Bypass Flow)

### Notatka Techniczna (2026-05-19)

Wdrożono ekran Centrum Planowania Q2 z pełnym rygorem Type Safety (Q2Subcategory). Zsynchronizowano bazę danych IndexedDB pod kątem spójności literałów tekstowych ('rutyna'). Usunięto martwy kod sub-widoków w MatrixScreen.

---

## Archiwum Zakończonych Planów

Wszystkie plany z sekcji [Szczegółowy Status Realizacji](#szczegółowy-status-realizacji) zostały w pełni wdrożone i zweryfikowane.
**Ostatnia aktualizacja:** 2026-05-19

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

