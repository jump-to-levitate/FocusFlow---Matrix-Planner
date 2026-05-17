# Rola: Product Owner (PO) - FocusFlow

> **Misja:** Ochrona zasobów kognitywnych osób neuroatypowych poprzez minimalistyczny, frictionless UX eliminujący paraliż decyzyjny.
> **Odpowiedzialność:** Wizja produktu, roadmapa strategiczna, zarządzanie backlogiem i priorytetyzacja MoSCoW.

---

## 1. Wizja Produktu (Product Vision)

### 1.1 Misja Strategiczna

FocusFlow to **ADHD-proof productivity system**, którego fundamentalnym celem jest **ochrona zasobów kognitywnych osób neuroatypowych** (ADHD/ASD/executive dysfunction).

**Zamiast** narzucać kolejną strukturę organizacji, **FocusFlow eliminuje bariery**:
- ❌ Brak rejestracji (zero barrier entry)
- ❌ Brak decyzji przy dodawaniu zadań (Q0 Brain Dump)
- ❌ Brak wybierania "custom" czasu (7 presets only)
- ❌ Brak shame/guilt (3-way compassionate close)

### 1.2 Kluczowe Filozofie UX

| Filozofia | Implementacja | ADHD Impact |
|-----------|---------------|-------------|
| **Frictionless UX** | Max 3 kliknięcia do celu | Redukcja oporu poznawczego |
| **Zero Registration** | Local-first, IndexedDB | Eliminacja paraliżu przed startem |
| **Decision Support** | Smart Quiz (2 pytania binarne) | System "myśli" za użytkownika |
| **Visual Persistence** | Neon Q1 zawsze widoczne | "Out of sight, out of mind" eliminacja |
| **Compassionate UX** | Brak kar za utratę passy | Ochrona przed RSD (Rejection Sensitive Dysphoria) |

### 1.3 Unique Value Proposition

> "Gdy Twój mózg nie współpracuje, FocusFlow podejmuje decyzje za Ciebie."

**Dla kogo:** Osoby z executive dysfunction (ADHD, burnout, ASD)  
**Co robi:** External Executive Function - klasyfikacja, priorytetyzacja, przypomnienia  
**Jak inaczej:** Local-first (dane nigdy nie opuszczają urządzenia), offline-first, zero rejestracji

---

## 2. Backlog Produktu (Epic / Stories)

### 2.1 Struktura Modułowa

Backlog podzielony na 6 głównych modułów odpowiadających architekturze Deep Context Sub-Matrix:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRODUCT BACKLOG STRUCTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  EPIC 1: Q0 - Brain Dump & Inbox Capture                           │
│  ├── Story 1.1: Seryjny zrzut myśli bez barier decyzyjnych         │
│  ├── Story 1.2: Izolacja Q0 od głównej Macierzy                    │
│  └── Story 1.3: Pre-fill Quiz dla zadań z Q0                       │
│                                                                     │
│  EPIC 2: Core Matrix (Q1-Q4)                                       │
│  ├── Story 2.1: Macierz Eisenhowera 2x2 z neonowymi ćwiartkami      │
│  ├── Story 2.2: Smart Quiz z 2 pytaniami binarnymi                 │
│  └── Story 2.3: Twardy limit Q1 (max 5 zadań) - overload protection│
│                                                                     │
│  EPIC 3: Q2 - Centrum Planowania (Sub-Matrix)                      │
│  ├── Story 3.1: Sub-matryca 2x2 (Rutyny, Projekty, Cele, Inne)     │
│  ├── Story 3.2: Schema extension: subcategory field (Dexie)        │
│  └── Story 3.3: Quiz bypass dla Q2 (initialQuadrant=2)             │
│                                                                     │
│  EPIC 4: Q3 - Hub Logistyki (Proza Życia)                          │
│  ├── Story 4.1: Intra-quadrant branching dla Q3                    │
│  ├── Story 4.2: 3 szuflady: Zrób teraz / Zaplanuj blok / W przerwie│
│  └── Story 4.3: Seryjny interfejs egzekucji (quick actions)        │
│                                                                     │
│  EPIC 5: Q4 - Archiwum & Noise Isolation                           │
│  ├── Story 5.1: 4 szuflady szumu (Rozrywka, Hobby, Side-questy)    │
│  └── Story 5.2: Mechanizm "Zapomnij" (destructive, nie zapisuje)   │
│                                                                     │
│  EPIC 6: Focus Engine (Timer)                                      │
│  ├── Story 6.1: Unix Delta Timestamp (throttling-proof)          │
│  ├── Story 6.2: 7 ADHD-proof presets (brak custom)                 │
│  ├── Story 6.3: Global TimerContext (singleton)                    │
│  ├── Story 6.4: 3-Way Strategic Modal (Complete/Continue/Return)   │
│  └── Story 6.5: PWA Audio Gesture Unlock                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Szczegółowy Opis Epiców

#### EPIC 1: Q0 - Brain Dump & Inbox Capture

**Jako** osoba z ADHD  
**Chcę** błyskawicznie "wylać" myśli z głowy bez decydowania gdzie je dać  
**Aby** oczyścić pamięć roboczą i zapobiec zapomnieniu pomysłów

**Kryteria Akceptacji:**
- Dodanie zadania do Q0 w max 2 kliknięcia
- Brak konieczności odpowiadania na pytania przy dodawaniu
- Q0 fizycznie izolowane od Macierzy głównej (nie widać w Q1-Q4)
- Seryjny zrzut - pozostanie w Q0 po dodaniu

#### EPIC 2: Core Matrix (Q1-Q4)

**Jako** użytkownik z executive dysfunction  
**Chcę** żeby system powiedział mi "gdzie to dać"  
**Aby** uniknąć paraliżu decyzyjnego przy 4 ćwiartkach

**Kryteria Akceptacji:**
- Smart Quiz z 2 pytaniami binarnymi (Tak/Nie)
- Natychmiastowa klasyfikacja (synchroniczny derived state)
- Q1 Limit - twardy stopień przy 5 zadaniach (overload protection)
- Visual persistence - Q1 zawsze widoczne na pulpicie

#### EPIC 3: Q2 - Centrum Planowania

**Jako** osoba z "cemetery of good intentions" (zamrażarka ważnych zadań)  
**Chcę** kontekstu wykonawczego dla zadań "ważnych, niepilnych"  
**Aby** wiedzieć CZY to rutyna na autopilocie, CZY projekt wymagający planowania

**Kryteria Akceptacji:**
- 4 szuflady: Rutyny (🔄), Projekty (📁), Ogólne Cele (🎯), Inne (💼)
- Sub-matryca 2x2 z identycznym layoutem jak główna Macierz
- Uniform h-14 headers (sztywna wysokość)
- Quiz bypass dla Q2 (pominięcie pytań kwalifikacyjnych)

#### EPIC 4: Q3 - Hub Logistyki

**Jako** osoba przytłoczona "prozą życia" (drobiazgi, obowiązki)  
**Chcę** jednoznacznej klasyfikacji czasowej: teraz/blok/przerwa  
**Aby** przestać się zastanawiać "kiedy to zrobić?"

**Kryteria Akceptacji:**
- 3 szuflady: "Zrób teraz" (<10min), "Zaplanuj blok", "W przerwie"
- Intra-quadrant branching - drugi stopień Quizu dla Q3
- Seryjny interfejs (quick actions: done/block/break)
- Grupowanie zadań według kontekstu czasowego

#### EPIC 5: Q4 - Archiwum

**Jako** osoba z 50 pomysłami/dzień, 0 egzekucji  
**Chcę** świadomie "odpuścić" myśli bez poczucia winy  
**Aby** ochronić przestrzeń mentalną przed szumem

**Kryteria Akceptacji:**
- 4 szuflady: Rozrywka, Hobby, Side-questy, Optymalizacja
- Mechanizm "Zapomnij" - nie zapisuje do bazy (psychologiczne przyzwolenie)
- Izolacja szumu - Q4 nie pojawia się w głównym workflow

#### EPIC 6: Focus Engine (Timer)

**Jako** osoba z time blindness i background throttling  
**Chcę** timera który "nie gubi" czasu gdy karta jest w tle  
**Aby** móc skupić się na pracy bez pilnowania zegara

**Kryteria Akceptacji:**
- Unix Delta Timestamp (odporność na throttling)
- 7 presets (brak opcji "custom" - eliminacja paraliżu)
- Global TimerContext (singleton, brak race conditions)
- 3-Way Modal: Ukończ / Kolejna sesja / Wróć później
- PWA Audio Gesture Unlock (Web Audio API)

---

## 3. Priorytetyzacja (MoSCoW Matrix)

### 3.1 Matryca Priorytetów

| Priorytet | Moduł | Uzasadnienie ADHD/Biznesowe |
|-----------|-------|----------------------------|
| **MUST HAVE** | Local-First Offline | **Paraliż przed rejestracją** - jeśli użytkownik musi założyć konto, 70% porzuca przed pierwszym użyciem |
| **MUST HAVE** | Q0 Brain Dump | **Pamięć robocza** - 50 pomysłów/dzień, muszą gdzieś trafić natychmiast |
| **MUST HAVE** | Smart Quiz | **Paraliż decyzyjny** - ręczny wybór ćwiartki = freeze/shutdown |
| **MUST HAVE** | Q2 Sub-Matrix | **Cemetery of good intentions** - bez kontekstu wykonawczego Q2 to "black hole" |
| **SHOULD HAVE** | Q3 Hub Logistyki | **Proza życia** - drobiazgi "zalewają" użytkownika |
| **SHOULD HAVE** | Timer 7 Presets | **Time blindness** - ale nie krytyczne dla core workflow |
| **COULD HAVE** | Q4 Archiwum | **Noise isolation** - komfort psychologiczny, nie funkcjonalność krytyczna |
| **WON'T HAVE** | Multi-User / Backend | **Faza 2** - celowo poza MVP, aby zachować local-first simplicity |
| **WON'T HAVE** | AI/ML Suggestions | **Complexity** - dodatkowa zależność, potential privacy concerns |

### 3.2 Szczegółowe Uzasadnienie "Must-Have: Local-First Offline"

**Problem:** Użytkownicy ADHD doświadczają "paraliżu przed rozpoczęciem" - im więcej kroków do startu, tym większa szansa, że nigdy nie zaczną.

**Standardowy flow aplikacji:**
```
Otwórz app → "Zarejestruj się" → Email → Potwierdź email → Utwórz hasło → 
Zaakceptuj ToS → Konfiguracja profilu → ... → ZAPOMNIJ O APLIKACJI
```

**FocusFlow Approach:**
```
Otwórz app → ZACZNIJ ZRZUCAĆ MYŚLI (2 sekundy)
```

**Konsekwencje:**
- **Zero kosztów serwerowych** - brak backendu, hostingu, maintenance
- **Maksymalna prywatność** - dane nigdy nie opuszczają urządzenia
- **Niezniszczalność** - aplikacja działa nawet gdy nasza infrastruktura padnie
- **Natychmiastowy dostęp** - offline-first = działa w metro, samolocie, górach

### 3.3 Uzasadnienie "Won't Have: Multi-User / Backend"

**Intencja:** Celowo ograniczamy zakres MVP do local-first, aby:
1. **Wyeliminować barierę rejestracji** (największy drop-off dla ADHD)
2. **Zachować maksymalną prywatność** (dane osobiste = local-only)
3. **Zredukować complexity** (brak auth, backend API, server maintenance)
4. **Zapewnić niezawodność** (brak single point of failure)

**Faza 2 (Post-MVP):** CRDT Multi-Device Sync - opcjonalna, opt-in, bez konieczności kont.

---

## 4. Key Documents & Deliverables

### 4.1 Kluczowe Dokumenty (SSOT)

| Dokument | Cel | Częstotliwość Aktualizacji |
|----------|-----|---------------------------|
| [`docs/plans/master_implementation_plan.md`](../../plans/master_implementation_plan.md) | Architektoniczna mapa drogowa | Co kwartał |
| [`docs/plans/01_strategy/01_mvp_roadmap.md`](../../plans/01_strategy/01_mvp_roadmap.md) | Fazy 1A-1D, timeline | Co sprint |
| [`docs/business/adhd_persona.md`](../../business/adhd_persona.md) | ICP, psychologia użytkownika | Co kwartał |
| [`implemented_plans.md`](../../../implemented_plans.md) | Rejestr ukończonych modułów | Real-time |
| [`implemented_features.md`](../../../implemented_features.md) | Lista funkcjonalności | Real-time |

### 4.2 Deliverables Cykliczne

**Co Sprint/Tydzień:**
- Aktualizacja `01_mvp_roadmap.md` (status modułów)
- Definicja nowych User Stories (z AC w formacie GIVEN-WHEN-THEN)
- Priorytetyzacja backlogu (MoSCoW review)

**Przed Każdym Release:**
- Go/No-Go decyzja na podstawie raportów QA
- Verification Report review (`docs/roles/tester/reports/`)
- ADHD UX Audit (czy friction jest minimalny?)

---

## 5. Workflow Product Ownera

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PRODUCT OWNER WORKFLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. VISION                                                          │
│     └── Aktualizacja misji i ICP (adhd_persona.md)                 │
│                         ↓                                           │
│  2. ROADMAP                                                         │
│     └── Master Plan (master_implementation_plan.md)                │
│     └── MVP Roadmap (01_mvp_roadmap.md)                            │
│                         ↓                                           │
│  3. BACKLOG                                                         │
│     └── Epic breakdown (Q0, Core, Q2, Q3, Q4, Timer)               │
│     └── MoSCoW prioritization                                      │
│     └── Story definition (z AC)                                    │
│                         ↓                                           │
│  4. SPRINT                                                          │
│     └── Sprint Planning z zespołem                                 │
│     └── Definicja Definition of Done                               │
│                         ↓                                           │
│  5. REVIEW                                                          │
│     └── Acceptance Testing (czy spełnia AC?)                       │
│     └── UX Review (czy spełnia ADHD principles?)                  │
│     └── 480px Constraint Check                                     │
│                         ↓                                           │
│  6. RELEASE                                                         │
│     └── Go/No-Go Decision                                          │
│     └── Release Notes                                              │
│     └── Post-mortem (lessons learned)                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. ADHD-Focused Success Metrics

| Metryka | Target | Mierzalność |
|---------|--------|-------------|
| **Time to First Task** | < 2 sekundy | Analytics: open → first interaction |
| **Brain Dump Completion** | 80% użytkowników dodaje ≥3 zadania w pierwszej sesji | Funnel analysis |
| **Quiz Adoption** | 70% zadań dodawanych przez Quiz (nie manualnie) | DB metrics |
| **Q2 Utilization** | 60% zadań Q2 ma przypisaną subkategorię | DB metrics |
| **Timer Sessions/User** | 3+ sesje tygodniowo | Analytics |
| **Task Completion Rate** | 40% (branżowa średnia: 20%) | DB metrics |
| **Retention (7-day)** | > 30% | Analytics |

---

**Zasada:** "Nie budujemy kolejnego todo app. Budujemy external executive function dla mózgów, które nie potrafią same zarządzać priorytetami."

