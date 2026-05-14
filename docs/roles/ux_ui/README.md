# Rola: UX/UI Designer

> **Odpowiedzialność:** Zgodność z PDF (strony 5-31) i ADHD-optimized UX.

---

## Zakres Odpowiedzialności

### 1. PDF Reference Compliance
- Zapewnienie zgodności z `FocusFlow – Matrix Planner.pdf` (str. 5-31)
- Mapowanie każdego ekranu na PDF reference
- Weryfikacja visual hierarchy i layout

### 2. ADHD UX Principles

#### 2.1 Minimal Friction (Tarcie Minimalne)
- Maksymalnie **3 kliknięcia** do celu
- Brak formularzy wieloetapowych
- Natychmiastowy feedback

#### 2.2 Visual Persistence
- Q1 zawsze widoczne i "świecące"
- Neon lime dla high-priority
- Mobile-first: telefon w kieszeni = always visible

#### 2.3 Decision Support
- Smart Quiz jako domyślny flow
- Binarne decyzje (Tak/Nie), nie skale 1-5
- System "myśli" za użytkownika

### 3. 480px Constraint Enforcement
- **ZASADA KRYTYCZNA:** Wszystkie projekty w 480px
- Touch targets min 44×44px
- Thumb-first design (dolna nawigacja)

### 4. Design System Maintenance
- Utrzymywanie `design-system.md`
- Neon Glassmorphism palette
- Spójność komponentów

---

## Key Documents

| Dokument | Cel |
|----------|-----|
| [`design-system.md`](./design-system.md) | SSOT dla designu, 480px constraint, kolory |
| [`docs/plans/01_strategy/STRAT_001_user_journey.md`](../../plans/01_strategy/STRAT_001_user_journey.md) | User Journey Map (PDF mapping) |
| [`docs/plans/01_strategy/STRAT_002_adhd_persona.md`](../../plans/01_strategy/STRAT_002_adhd_persona.md) | Wymagania ADHD UX |
| [`docs/architecture/adr/ADR_002_mobile_first_constraint.md`](../../architecture/adr/ADR_002_mobile_first_constraint.md) | 480px jako constraint |
| [`src/constants/colors.ts`](../../../app/src/constants/colors.ts) | Design tokens |

---

## Anti-Patterns Checklist (Czego UNIKAĆ)

| Anty-wzorzec | Konsekwencja dla ADHD |
|--------------|----------------------|
| Długie listy (20+ zadań) | Overwhelm freeze ❌ |
| Małe przyciski (<44px) | Frustracja, missed clicks ❌ |
| Za dużo opcji (5+ choices) | Decision paralysis ❌ |
| Skomplikowane formularze | Abandonment ❌ |
| Modal hell (nested modals) | Lost context, panic ❌ |
| Time-based deadlines | Time blindness anxiety ❌ |

---

## PDF Reference Mapping

| Screen | PDF Strona | Key Elements |
|--------|------------|--------------|
| Pulpit (Dashboard) | str. 15 | Q1 headline, neon glow, quick add |
| Macierz (Matrix) | str. 16 | 2×2 grid, quadrant colors, counters |
| Brain Dump Quiz | str. 18 | 2 pytania, binarne tak/nie |
| Q1 Overload | str. 19 | Shield icon, progress 5/5, reassign options |

---

## Deliverables

- Wireframes z PDF reference
- UX Review dla każdego planu (TECH/FEAT)
- Design specs dla komponentów
- Animacje i micro-interactions

---

**Zasada:** "Dla ADHD brain - mniej myślenia, więcej robienia."
