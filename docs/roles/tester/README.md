# Rola: Tester / QA Engineer - FocusFlow 2.0

> **Odpowiedzialność:** Weryfikacja zgodności ze specyfikacją (GIVEN-WHEN-THEN), testowanie ADHD UX requirements, identyfikacja edge cases w local-first środowisku.
> **Zasada:** Kod jest poprawny, gdy implementuje specyfikację - nie gdy "działa".

---

## 1. Odpowiedzialność Roli

Tester/QA Engineer w FocusFlow odpowiada za:

- **Spec-Driven Testing** - Testy projektowane bezpośrednio z PLAN_*.md, AC jako Definition of Done
- **Constraint-First** - Priorytetowe testowanie 430px constraint przed funkcjonalnościami
- **ADHD UX Heuristics** - Weryfikacja friction reduction, visual stability, decision clarity
- **Edge Case Identification** - Graniczne scenariusze użytkowania (null/undefined, race conditions)
- **Traceability** - Powiązanie każdego testu z konkretnym AC

---

## 2. Mapa Artefaktów Testowych (Single Source of Truth)

| Dokument | Zawartość | Link |
|----------|-----------|------|
| **Strategia Testowania** | Spec-Driven Testing, Constraint-First, ADHD UX Heuristics, 430px Safety Net | [strategia_testow.md](./strategia_testow.md) |
| **Scenariusze Testowe** | GIVEN-WHEN-THEN: Background Throttling, Quiz Bypass, UI Symmetry (h-14, whitespace-nowrap) | [scenariusze_testow.md](./scenarios/scenariusze_testow.md) |
| **Edge Cases** | Normalizacja null/undefined, Spam-testing, Q1 Anti-Burnout, Viewport edge cases | [przypadki_edge_case.md](./scenarios/przypadki_edge_case.md) |
| **Raporty** | TECH_000 verification, feature test reports | [reports/](./reports/) |
| **UX/UI Specs** | Design tokens, viewport constraints | [../ux_ui/](../ux_ui/) |
| **Architecture Specs** | Dexie schema, TimerContext patterns | [../architect/](../architect/) |

---

## 3. Checklist Walidacji Deweloperskiej (Pre-Commit)

### 3.1 P0 - CRITICAL (Must Pass)

```markdown
- [ ] 430px Constraint: `max-w-[430px] mx-auto` na wszystkich ekranach
- [ ] Brak horizontal scroll na viewport 430px
- [ ] Touch targets ≥44×44px (Apple HIG compliance)
- [ ] TypeScript `tsc --noEmit` zero errors (strict mode)
- [ ] Build `npm run build` success (production ready)
- [ ] Core flows działają: Task CRUD, Timer, Quiz
```

### 3.2 P1 - HIGH (Should Pass)

```markdown
- [ ] AC-by-AC verification dla aktywnego planu
- [ ] Friction Test ≤3 kliknięcia dla primary flows
- [ ] Visual Stability: brak "skakania" layoutu przy interakcjach
- [ ] Decision Clarity: etykiety, kontekst, warningi przy destructive actions
- [ ] h-14 headers: wszystkie nagłówki sub-matryc 56px
- [ ] whitespace-nowrap: etykiety tekstowe nie łamią się
```

### 3.3 P2 - MEDIUM (Nice to Have)

```markdown
- [ ] Edge cases: empty states, max length, null/undefined handling
- [ ] Performance: <100ms render, <50ms HMR
- [ ] Cross-browser: Safari, Firefox
- [ ] PWA offline functionality
```

---

## 4. Quick Reference

### 4.1 Viewport (430px Pro Max Standard)

```tsx
// ✅ Wymagany pattern dla wszystkich ekranów
<div className="max-w-[430px] mx-auto min-h-screen">
  {/* App content */}
</div>
```

### 4.2 Test Environment

| Device | Width | Height | Priority |
|--------|-------|--------|----------|
| iPhone 14/15 Pro Max | **430px** | 932px | **P0 - CRITICAL** |
| iPhone SE | 375px | 667px | P1 - HIGH |
| Desktop Chrome | 430px frame | - | P0 - CRITICAL |

### 4.3 GIVEN-WHEN-THEN Format

```
GIVEN: <Stan początkowy>
WHEN: <Akcja użytkownika>
THEN: <Rezultat weryfikowalny>
```

---

## 5. Workflow Testera (SDD)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TESTER WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. READ PLAN → Przeczytaj PLAN_*.md (focus na AC)                │
│  2. CONSTRAINT-FIRST → Sprawdź 430px, TypeScript, Build             │
│  3. AC-BY-AC → Execute test cases, collect evidence                 │
│  4. ADHD UX → Friction test, visual stability, decision clarity     │
│  5. EDGE CASES → Null/undefined, spam-testing, limits               │
│  6. DOCUMENT → Update traceability matrix, create reports           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Kluczowe Definicje

| Termin | Definicja |
|--------|-----------|
| **430px Safety Net** | Twardy limit szerokości layoutu wymuszający Mobile-First UX (Pro Max Standard) |
| **Constraint-First Testing** | Priorytetowe testowanie ograniczeń (constraints) nad features |
| **Friction Test** | Weryfikacja liczby kroków wymaganych do wykonania akcji (target: ≤3) |
| **Spec-Driven Testing** | Testy projektowane bezpośrednio z PLAN_*.md, AC jako Definition of Done |
| **AC (Acceptance Criteria)** | Kryteria akceptacji - definicja "done" dla funkcjonalności |

---

**Document ID:** TEST-README-002  
**Owner:** QA Lead / Senior Frontend Architect  
**Status:** ACTIVE  
**Last Updated:** 2026-05-19  
**Viewport:** 430px Pro Max Standard

