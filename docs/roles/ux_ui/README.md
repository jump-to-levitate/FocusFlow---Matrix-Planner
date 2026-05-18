# Rola: UX/UI Designer - FocusFlow

> **Odpowiedzialność:** Projektowanie ADHD-optimized UX eliminującego paraliż decyzyjny, redukcję obciążenia pamięci roboczej i dopaminową gratyfikację.
> **Kluczowe Wyzwanie:** Dla ADHD brain - mniej myślenia, więcej robienia.

---

## Spis Treści (SSOT Architecture)

Dokumentacja UX/UI jest podzielona na moduły SDD:

| Dokument | Zawartość | Link |
|----------|-----------|------|
| **Zasady UX** | Głęboka teoria psychologiczna, dopamina, RSD, working memory | [zasady_ux.md](./zasady_ux.md) |
| **Przepływy** | User flows, reversed classification, task pipeline | [przeplywy_uzytkownika.md](./przeplywy_uzytkownika.md) |
| **Makiety** | Grid system, design tokens, laser glow palette (430px) | [makiety.md](./makiety.md) |
| **Design System** | SSOT dla tokenów, komponentów, wytycznych | [design-system.md](./design-system.md) |
| **Audyty UX** | Log przeglądów, statusy modułów, kryteria akceptacji | [reviews/ux_review_log.md](./reviews/ux_review_log.md) |

---

## Podsumowanie Odpowiedzialności

Projektant UX/UI w FocusFlow odpowiada za:

- **ADHD-Optimized Design** - Elimination decision paralysis przez frictionless UX
- **Visual Hierarchy** - Neurostymulacja kolorem (neon glow), ostrość bez mgły
- **Cognitive Load Reduction** - One-thing-at-a-time, working memory offload
- **Compassionate UX** - Brak kar, RSD-safe interactions, guilt-free design
- **Viewport Compliance** - Strict 430px Pro Max Standard, thumb-friendly layouts
- **Review Process** - Formalne audyty UX przed każdym merge

---

## Anti-Patterns Checklist (Czego UNIKAĆ)

| Anty-wzorzec | Konsekwencja dla ADHD | FocusFlow Solution |
|--------------|----------------------|-------------------|
| **Długie listy** (20+ zadań) | Overwhelm freeze | Paginacja / Max 5-7 widocznych |
| **Małe przyciski** (<44px) | Frustracja, missed clicks | Touch targets min 44×44px |
| **Za dużo opcji** (5+ choices) | Decision paralysis | Max 3-4 opcje, binarne decyzje |
| **Skomplikowane formularze** | Abandonment | 1 pole + Smart Quiz |
| **Modal hell** (nested modals) | Lost context, panic | Inline editing, step-by-step |
| **Time-based deadlines** | Time blindness anxiety | Duration estimates ("5 min") |
| **Brak instant feedback** | "Czy to zadziałało?" | Visual feedback na każdej akcji |
| **Backdrop blur** | Rozmywa ostrość | Laser glow bez mgły |
| **Streaks / Passa** | RSD trigger | Neutralny "Reset" |

---

## Workflow UX/UI Designera

```
1. REQUIREMENTS
   └── Czytanie planu funkcjonalności (PLAN_*.md)
                    ↓
2. ADHD ANALYSIS
   └── Czy ten flow wymaga myślenia? (Musi być "foolproof")
   └── Czy jest frictionless? (Max 3 kliknięcia)
   └── Czy zapewnia visual persistence?
                    ↓
3. WIREFRAMING
   └── ASCII diagram w [makiety.md](./makiety.md)
   └── Mobile-first (430px Pro Max Standard)
                    ↓
4. DESIGN SYSTEM
   └── Wybór tokenów z [design-system.md](./design-system.md)
   └── H-14 headers, whitespace-nowrap, leading-none
                    ↓
5. REVIEW
   └── UX Review PR per [reviews/ux_review_log.md](./reviews/ux_review_log.md)
   └── 430px Constraint Check
                    ↓
6. HANDOFF
   └── Design specs dla deweloperów
   └── Animacje i micro-interactions
```

---

## Powiązane Role i Linki

| Rola | Odpowiedzialność | Link |
|------|------------------|------|
| **Product Owner** | Wizja, Backlog, Priorytety | [../product_owner/readme.md](../product_owner/readme.md) |
| **Architect** | ADRs, System Design | [../architect/readme.md](../architect/readme.md) |
| **Developer** | Implementacja, Code Standards | [../developer/readme.md](../developer/readme.md) |

---

**Zasada:** „Dla ADHD brain - mniej myślenia, więcej robienia. Design jest poprawny, gdy użytkownik nie musi się zastanawiać 'co teraz?'"

**Document ID:** UX-README-001  
**Owner:** Principal Product Designer  
**Status:** ACTIVE  
**Last Updated:** 2026-05-18  
**Viewport:** 430px Pro Max Standard
