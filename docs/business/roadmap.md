# FocusFlow 2.0 - Product Roadmap

> High-Level Implementation Plan (SDD Methodology)  
> Mobile-First 480px Strategy

---

## Metadane

| Pole | Wartość |
|------|---------|
| **Dokument** | Product Roadmap |
| **Wersja** | 1.0 |
| **Status** | Active |
| **Data** | 2026-05-14 |
| **Metodologia** | SDD (Spec Driven Development) |
| **Strategy** | Mobile-First 480px |

---

## Executive Summary

### Wizja Produktu

FocusFlow 2.0 to **Mobile-First productivity app** zaprojektowany dla osób z ADHD, wykorzystujący **Eisenhower Matrix** i **Smart Quiz** do klasyfikacji zadań bez paraliżu decyzyjnego.

### Kluczowa Różnica

> "Nie musisz decydować do której ćwiartki - odpowiedz na 2 pytania, a FocusFlow zrobi to za Ciebie"

### Strategia Wdrożenia

**"Mobile-First 480px"** - każda funkcja jest najpierw projektowana i implementowana pod mobile, z twardym limitem 480px szerokości.

---

## Faza 1: Fundamenty i Szkielet (The Shell)

> **Cel:** Działający AppShell, nawigacja i pusty widok Macierzy

---

### 1.1 Scope

Zbudowanie szkieletu aplikacji który "trzyma" wszystko razem - bez tego nie ma produktu.

### 1.2 Key Deliverables

| ID | Deliverable | Opis | PDF Ref |
|----|-------------|------|---------|
| S-01 | **AppShell Component** | Root layout z `max-w-[480px]`, centrowanie, mobile-first | Wszystkie strony |
| S-02 | **Bottom Navigation** | 5-item nav: Pulpit, Macierz, Dzisiaj, Notes, Timer | str. 5-31 (bottom bar) |
| S-03 | **Empty Matrix View** | Grid 2×2 z placeholderami, bez danych | str. 16 |
| S-04 | **Global Styles** | Tailwind config, glassmorphism, neon colors | `src/constants/colors.ts` + `docs/tech/conventions.md` |
| S-05 | **Routing Setup** | React Router z 480px constraint | - |
| S-06 | **Initial ADRs & Roles setup** | ADR_002 (480px constraint), developer.md, tester/strategy | ADR_002 |

### 1.3 Plany SDD

| Plan | Tytuł | Status | Priority |
|------|-------|--------|----------|
| PLAN_000 | Repository Setup | ✅ Done | P0 |
| **PLAN_001** | **Matrix UI Shell** | 📝 Draft | **P0** |

### 1.4 PDF Reference Mapping

| Element | PDF Strona | Uwagi |
|---------|------------|-------|
| Bottom Nav Layout | str. 15, 16, 5, 6, 7 | 5 ikon, Pulpit jako active |
| Macierz 2×2 Grid | str. 16 | Empty state - "Dodaj pierwsze zadanie" |
| Neon Glassmorphism | wszystkie | Ciemne tło + neonowe akcenty |
| AppShell 480px | wszystkie | Mobile-first constraint |

### 1.5 Definicja Sukcesu (Definition of Success)

✅ **Faza 1 ukończona gdy:**

1. Aplikacja otwiera się na telefonie z wycentrowanym 480px layoutem
2. Bottom navigation działa (5 ekranów, routing)
3. Macierz wyświetla się jako grid 2×2 (nawet bez danych)
4. Wszystkie kolory i style zgodne z `src/constants/colors.ts` oraz `docs/tech/conventions.md`
5. UX Review (`/WF UX`) przeszedł dla AppShell
6. Brak poziomych scrollbarów na żadnym urządzeniu

### 1.6 Estimated Effort

- **Czas:** 2-3 dni (1 developer)
- **Zależności:** Brak (fundamenty)
- **Risks:** Niskie - czyste setup

---

## Faza 2: Silnik Danych i Zarządzanie Zadaniami (The Brain)

> **Cel:** Dodawanie zadań, obsługa IndexedDB (Dexie.js), widok 4 ćwiartek z danymi

---

### 2.1 Scope

Implementacja "mózgu" aplikacji - tam gdzie dzieje się magia klasyfikacji zadań.

### 2.2 Key Deliverables

| ID | Deliverable | Opis | PDF Ref |
|----|-------------|------|---------|
| B-01 | **Brain Dump Quiz** | 2-pytaniowy quiz klasyfikujący do Q1-Q4 | str. 18 |
| B-02 | **Q1 Overload Protection** | Blokada 6. zadania + reasignacja | str. 19 |
| B-03 | **IndexedDB Layer** | Dexie.js, Task model, CRUD | ADR_001 |
| B-04 | **Matrix z Danymi** | 4 ćwiartki z rzeczywistymi zadaniami | str. 16 |
| B-05 | **Dashboard (Pulpit)** | Widok Q1 + quick add | str. 15 |
| B-06 | **Task CRUD** | Create, Read, Update, Delete tasks | system_overview.md |

### 2.3 Plany SDD

| Plan | Tytuł | Status | Priority |
|------|-------|--------|----------|
| **PLAN_002** | **Brain-Dump Quiz Logic** | 📝 Draft | **P0** |
| **PLAN_003** | **Task CRUD & Data Layer** | 📝 Draft | **P0** |

### 2.4 PDF Reference Mapping

| Element | PDF Strona | Uwagi |
|---------|------------|-------|
| Brain Dump Quiz Flow | str. 18 | 2 pytania: Ważność + Pilność |
| Q1 Overload Popup | str. 19 | "Przeciążenie Systemu" + opcje |
| Macierz z Zadaniami | str. 16 | Liczniki, kolory ćwiartek |
| Pulpit / Dashboard | str. 15 | Aktualny cel Q1, licznik |
| Today View | str. 5 | Linearny plan dnia |

### 2.5 Definicja Sukcesu (Definition of Success)

✅ **Faza 2 ukończona gdy:**

1. User może dodać zadanie przez Quiz w < 3 minuty
2. Zadanie poprawnie klasyfikuje się do Q1/Q2/Q3/Q4
3. Q1 limit (5 zadań) działa - blokada + opcje reasignacji
4. Macierz wyświetla zadania w odpowiednich ćwiartkach
5. Dashboard pokazuje aktualny cel Q1
6. IndexedDB persistuje dane (reload = dane zostają)
7. Export/Import JSON działa (backup)
8. UX Review przeszedł dla Quiz i Overload flow

### 2.6 Estimated Effort

- **Czas:** 5-7 dni (1-2 developerów)
- **Zależności:** Faza 1 (AppShell)
- **Risks:** 
  - Medium: Algorytm klasyfikacji (edge cases)
  - Medium: Dexie.js + React integration

---

## Faza 3: Skupienie i Efektywność (The Flow)

> **Cel:** Implementacja Focus Timer, Notatek Brain Dump i logiki "Prozy Życia" (Q3)

---

### 3.1 Scope

Funkcje które pomagają w **execution** - nie tylko planowaniu, ale robieniu.

### 3.2 Key Deliverables

| ID | Deliverable | Opis | PDF Ref |
|----|-------------|------|---------|
| F-01 | **Focus Timer** | Pomodoro 25/5 lub Deep Work 50/10 | str. 6 |
| F-02 | **Session Streak** | Licznik dni skupienia pod rząd | str. 6 |
| F-03 | **Brain Dump Notes** | Quick capture bez klasyfikacji | str. 7 |
| F-04 | **Q3 "Proza Życia"** | Decision flow: Od razu / W przerwie / Blok | str. 8, 23 |
| F-05 | **Q4 Categories** | Side-quest, Hobby, Rozrywka, Optymalizacja | str. 9, 24 |
| F-06 | **Q2 Subkategorie** | Rutyna, Projekt, Inne | str. 10, 23 |

### 3.3 Plany SDD (Draft)

| Plan | Tytuł | Status | Priority |
|------|-------|--------|----------|
| PLAN_004 | Focus Timer & Streaks | 📝 Draft | P1 |
| PLAN_005 | Brain Dump Notes | 📝 Draft | P1 |
| PLAN_006 | Q3/Q4 Subcategories | 📝 Draft | P1 |

### 3.4 PDF Reference Mapping

| Element | PDF Strona | Uwagi |
|---------|------------|-------|
| Timer 25/5, 50/10 | str. 6 | Progress ring, session notes |
| Streak Counter | str. 6 | Flame icon, dni pod rząd |
| Brain Dump Notes | str. 7 | Nieposortowana lista, quick add |
| Q3 Decisions | str. 8 | "Od razu" / "W przerwie" / "Zaplanuj blok" |
| Q4 Categories | str. 9 | Side-quest, Hobby, Rozrywka |
| Q2 Planning | str. 23, 10 | Rutyna, Projekt, Inne |
| Info Popups Q3 | str. 29-31 | Edukacja o delegowaniu |

### 3.5 Definicja Sukcesu (Definition of Success)

✅ **Faza 3 ukończona gdy:**

1. User może rozpocząć sesję Focus w 1 kliknięcie
2. Timer odlicza 25 minut z wizualnym progress ringiem
3. Po ukończeniu sesji - streak +1, notatki z sesji zapisane
4. Brain Dump pozwala szybko zapisać myśl bez klasyfikacji
5. Q3 zadania pokazują opcje decyzyjne (Od razu / W przerwie / Blok)
6. Q4 pokazuje kategorie (Side-quest, Hobby, etc.)
7. Q2 pozwala oznaczyć subkategorię (Rutyna/Projekt/Inne)

### 3.6 Estimated Effort

- **Czas:** 4-6 dni (1-2 developerów)
- **Zależności:** Faza 2 (Task CRUD, IndexedDB)
- **Risks:**
  - Low: Timer logic (standard)
  - Medium: Audio notifications (browser constraints)

---

## Faza 4: Analiza i Retrospekcja (The Mirror)

> **Cel:** Raporty, statystyki ukończonych zadań, optymalizacja UX

---

### 4.1 Scope

Funkcje które pokazują **progress** i pomagają w **continuous improvement**.

### 4.2 Key Deliverables

| ID | Deliverable | Opis | PDF Ref |
|----|-------------|------|---------|
| M-01 | **Completion Stats** | Ukończone zadania per ćwiartka | - |
| M-02 | **Weekly Report** | Podsumowanie tygodnia (Q1-Q4 breakdown) | - |
| M-03 | **Streak Analytics** | Długość serii, patterny | str. 6 |
| M-04 | **Time Tracking** | Czas spędzony w focus sessions | - |
| M-05 | **UX Optimization** | Polishing, animations, haptics | `docs/tech/conventions.md` + `design-system.md` |
| M-06 | **Accessibility Audit** | ARIA, screen readers, contrast | - |
| M-07 | **Demo-ready Presentation Mode** | Skrypt wypełniający IndexedDB testowymi danymi, streakami i notatkami dla profesjonalnej prezentacji | - |

### 4.3 Plany SDD (Draft)

| Plan | Tytuł | Status | Priority |
|------|-------|--------|----------|
| PLAN_007 | Analytics & Reports | 📝 Draft | P2 |
| PLAN_008 | UX Polish & A11y | 📝 Draft | P2 |

### 4.4 Definicja Sukcesu (Definition of Success)

✅ **Faza 4 ukończona gdy:**

1. User widzi statystyki ukończonych zadań (per ćwiartka)
2. Weekly report pokazuje productivity trends
3. Streak analytics pokazują patterny (np. "najlepsze dni: wtorek, środa")
4. Time tracking pokazuje łączny czas w focus
5. UX jest "polished" - wszystkie animacje działają płynnie
6. Accessibility audit przeszedł (WCAG 2.1 AA)
7. Lighthouse score > 90 (Performance, Accessibility, Best Practices)

### 4.5 Estimated Effort

- **Czas:** 3-5 dni (1 developer)
- **Zależności:** Faza 2-3 (data to analyze)
- **Risks:** Low - mainly data aggregation

---

## Summary Timeline

```
Week 1          Week 2          Week 3          Week 4
  │               │               │               │
  ▼               ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  FAZA 1 │──▶│  FAZA 2 │──▶│  FAZA 3 │──▶│  FAZA 4 │
│  SHELL  │   │  BRAIN  │   │  FLOW   │   │  MIRROR │
│ 2-3 dni │   │ 5-7 dni │   │ 4-6 dni │   │ 3-5 dni │
└─────────┘   └─────────┘   └─────────┘   └─────────┘
     │              │              │              │
     │              │              │              ▼
     │              │              │         🚀 MVP
     │              │              │         READY
     │              │              │
     └──────────────┴──────────────┘
              Łącznie: 14-21 dni
              (2-3 tygodnie dla 1-2 dev)
```

---

## Priority Matrix

| Faza | Priority | Impact | Effort | Risk | MOSCOW |
|------|----------|--------|--------|------|--------|
| Faza 1: Shell | P0 | High | Low | Low | **M**ust have |
| Faza 2: Brain | P0 | High | High | Medium | **M**ust have |
| Faza 3: Flow | P1 | Medium | Medium | Low | **S**hould have |
| Faza 4: Mirror | P2 | Medium | Low | Low | **C**ould have |

---

## Next Step: PLAN_001_matrix_ui_shell

### Rekomendacja: Rozpocznij od PLAN_001

**Dlaczego PLAN_001 jako pierwszy:**

1. **Zero Dependencies** - nie potrzebuje innych planów
2. **Foundation** - wszystko inne stoi na AppShell
3. **Immediate Visual** - od razu widać postęp (motywacja!)
4. **Risk Mitigation** - jeśli 480px constraint się nie uda, wiemy od razu
5. **Quick Win** - 2-3 dni i mamy działający szkielet

### Struktura Proponowanego PLAN_001:

```
PLAN_001_matrix_ui_shell.md
├── 1. Executive Summary
├── 2. AppShell Specification (480px constraint)
├── 3. Bottom Navigation Component
│   ├── 5 items: Pulpit, Macierz, Dzisiaj, Notes, Timer
│   ├── Active states (neon glow)
│   └── Routing (React Router)
├── 4. Empty Matrix View
│   ├── Grid 2×2 layout
│   ├── Quadrant placeholders
│   ├── "Dodaj pierwsze zadanie" CTA
│   └── PDF references: str. 16
├── 5. Global Styles Integration
│   ├── Tailwind config
│   ├── Glassmorphism utilities
│   └── Neon color tokens
├── 6. Acceptance Criteria
│   ├── 480px constraint verified
│   ├── Bottom nav works on mobile
│   ├── Matrix displays correctly
│   └── UX Review passed
└── 7. Implementation Checklist
```

### Szacowany Timeline dla PLAN_001:

| Dzień | Zadanie | Output |
|-------|---------|--------|
| D1 | AppShell + Tailwind | `App.tsx` z 480px constraint |
| D2 | Bottom Nav + Routing | 5 ekranów, routing działa |
| D3 | Empty Matrix + UX Review | Grid 2×2, `/WF UX` pass |

**Gotowy do rozpoczęcia?** 

Mogę teraz wygenerować szczegółowy `PLAN_001_matrix_ui_shell.md` z pełnymi specyfikacjami, kodem TypeScript, i acceptance criteria.

---

## Appendix: Reference Documents

| Dokument | Rola w Roadmap |
|----------|----------------|
| `PLAN_000_repository_setup.md` | ✅ Done - fundamenty repo |
| `PLAN_002_brain_dump_quiz_logic.md` | Faza 2 - Brain Dump Quiz |
| `PLAN_003_user_journey_map.md` | Wsparcie dla wszystkich faz |
| `design-system.md` | Wizualne fundamenty (wszystkie fazy) |
| `docs/tech/conventions.md` | SSOT dla 480px constraint i colors (wszystkie fazy) |
| `src/constants/colors.ts` | Paleta Neon Glassmorphism (wszystkie fazy) |
| `glossary.md` | Terminologia (wszystkie fazy) |
| `system_overview.md` | Architektura (Faza 2+) |
| `ADR_001_choice_of_storage.md` | IndexedDB (Faza 2) |
| `tester/strategy.md` | QA framework (wszystkie fazy) |
| `developer.md` | Konwencje kodowania, ADR_002 reference (wszystkie fazy) |

---

**Status:** Roadmap v1.0 gotowy do zatwierdzenia  
**Next Action:** Utworzenie PLAN_001_matrix_ui_shell.md

