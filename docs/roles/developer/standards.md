# Role: Developer (Full-Stack)

> Developer guidelines and responsibilities for FocusFlow 2.0  
> Methodology: SDD (Spec Driven Development)

---

## Metadane

| Pole | Wartość |
|------|---------|
| **Rola** | Developer (Full-Stack) |
| **Odpowiedzialność** | Implementacja planów SDD, kod React/TS, Dexie.js |
| **Zgłasza do** | Tech Lead / Architect |
| **Metodologia** | SDD (Spec Driven Development) |

---

## Core Responsibilities (Główne Odpowiedzialności)

### 1. Spec-Driven Development

> **"No code without spec"** - Każda zmiana kodu MUSI być poprzedzona zatwierdzonym planem.

**Workflow:**
```
1. Przeczytaj PLAN_XXX.md w całości
2. Zrozum Acceptance Criteria
3. Zaimplementuj zgodnie ze specyfikacją
4. Przetestuj vs PLAN (nie "czy działa", ale "czy zgadza się z planem")
5. Zgłoś do UX Review (`/WF UX`)
6. Zaktualizuj implemented_plans.md
```

### 2. Pre-Implementation Checklist

Przed rozpoczęciem kodowania:

- [ ] Przeczytano PLAN_XXX w całości
- [ ] Zrozumiano Acceptance Criteria
- [ ] Sprawdzono ADR_002 (480px constraint) - **MANDATORY**
- [ ] Sprawdzono `docs/tech/conventions.md` - **SSOT for 480px & colors**
- [ ] Weryfikacja `src/constants/colors.ts` - **SSOT for Neon Glassmorphism**
- [ ] Zidentyfikowano zależności od innych planów
- [ ] Przygotowano test data (fixtures)

---

## Critical Constraints (Krytyczne Ograniczenia)

### ADR_002: 480px Mobile-First Constraint

> **MUST VERIFY BEFORE EVERY UI CHANGE**

#### Requirement
```tsx
// ALL screens MUST use this pattern:
<div className="max-w-[480px] mx-auto min-h-screen px-4">
  {/* content */}
</div>
```

#### Verification Steps

1. **Open DevTools** (F12)
2. **Enable Device Toolbar** (Ctrl+Shift+M)
3. **Test 3 widths:**
   - 375px (iPhone SE) - should fill width
   - 480px (max-width) - should fill width
   - 768px+ (tablet) - should be **centered 480px box**
4. **Check for horizontal scrollbars** - NONE allowed
5. **Verify all content fits** within 448px (480px - 32px padding)

#### Forbidden Patterns

```tsx
// ❌ NEVER DO THIS
<div className="w-screen">          /* Uses viewport width */
<div className="w-[600px]">         /* Exceeds 480px limit */
<div className="min-w-[500px]">    /* Forces expansion */
<img className="w-[600px]">         /* Image overflows */
```

### Conventions: Colors (SSOT)

**Primary Source:** `src/constants/colors.ts`

```tsx
// ✅ CORRECT - use colors.ts
import { COLORS, Q1_COLOR, Q2_COLOR } from '@/constants/colors';

<div className={COLORS.quadrant.q1.card}>
<span style={{ color: Q1_COLOR }}>
```

**Secondary Source:** `tailwind.config.js`

```tsx
// ✅ ACCEPTABLE - tailwind custom colors
<div className="bg-neon-lime text-white">
```

**Fallback:** Standard Tailwind

```tsx
// ✅ ACCEPTABLE - standard tailwind
<div className="bg-slate-700 text-white">
```

**❌ FORBIDDEN:** Hard-coded hex values

```tsx
// ❌ NEVER DO THIS
<div className="bg-[#39FF14]">     /* Hard-coded color */
<div style={{ backgroundColor: '#A855F7' }}>  /* Inline style hex */
```

---

## Code Standards

### File Structure

```
/app/src
  /components        # Reusable UI components (AppShell, BottomNav)
  /features          # Domain components (Matrix, Quiz, Timer)
  /screens           # Page-level components (MatrixScreen, DashboardScreen)
  /hooks             # Custom React hooks
  /db                # Dexie.js schema and operations
  /constants         # colors.ts, config.ts
  /types             # TypeScript interfaces
  /utils             # Helper functions
```

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `QuadrantCard.tsx`, `TaskList.tsx` |
| Hooks | camelCase + use | `useTasks.ts`, `useQuiz.ts` |
| Types | PascalCase | `Task`, `TaskInput`, `QuadrantNumber` |
| Constants | UPPER_SNAKE | `Q1_LIMIT`, `COLORS` |
| Utils | camelCase | `formatDate.ts`, `classifyTask.ts` |

### TypeScript Standards

```tsx
// ✅ STRICT TYPING - no 'any'
interface Task {
  id: string;
  title: string;
  quadrant: 1 | 2 | 3 | 4;
  completed: boolean;
}

// ✅ EXPLICIT RETURN TYPES
export const classifyTask = (importance: Answer, urgency: Answer): QuadrantNumber => {
  // implementation
};

// ❌ AVOID 'any'
const task: any = fetchTask();  /* FORBIDDEN */
```

### Import Aliases

```tsx
// ✅ USE @/ ALIASES
import { AppShell } from '@/components/AppShell';
import { COLORS } from '@/constants/colors';
import type { Task } from '@/types/task';

// ❌ AVOID RELATIVE PATHS
import { AppShell } from '../../../components/AppShell';  /* AVOID */
```

---

## Component Patterns

### Screen Component Template

```tsx
// app/src/screens/MatrixScreen.tsx
import { AppShell } from '@/components/AppShell';
import { BottomNav } from '@/components/BottomNav';
import { QuadrantCard } from '@/components/QuadrantCard';

export const MatrixScreen = () => {
  return (
    <AppShell>
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-h1 text-white">Macierz</h1>
      </header>

      {/* Content */}
      <div className="grid grid-cols-2 gap-3">
        {/* Quadrant cards... */}
      </div>

      {/* BottomNav is rendered by parent (App.tsx) */}
    </AppShell>
  );
};
```

### Reusable Component Template

```tsx
// app/src/components/QuadrantCard.tsx
import { ReactNode } from 'react';
import { QuadrantNumber } from '@/types/task';

interface QuadrantCardProps {
  quadrant: QuadrantNumber;
  title: string;
  color: 'lime' | 'purple' | 'cyan' | 'slate';
  children?: ReactNode;
}

export const QuadrantCard = ({ quadrant, title, color, children }: QuadrantCardProps) => {
  return (
    <div className={`quadrant-card quadrant-${color}`}>
      <h3>Q{quadrant} - {title}</h3>
      {children}
    </div>
  );
};
```

---

## Testing Requirements

### Pre-Commit Checklist

```markdown
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] 480px constraint verified (3 viewports)
- [ ] No hard-coded colors (verified with grep)
- [ ] No 'any' types
- [ ] Imports use @/ aliases
- [ ] Component has basic smoke test
```

### Manual Testing Protocol

Every UI change requires:

1. **Chrome DevTools Mobile Test**
   - Width: 375px, 480px, 768px
   - Touch simulation enabled
   - No horizontal scroll

2. **Visual Regression**
   - Screenshot before/after
   - Compare with PDF reference

3. **UX Friction Test**
   - Count clicks to complete action
   - Target: ≤ 3 clicks for main flows

---

## Documentation Responsibilities

### Code Comments

```tsx
// ✅ EXPLAIN 'WHY', NOT 'WHAT'
// ADHD UX: Smaller viewport reduces cognitive overwhelm
const MAX_WIDTH = 480;

// ❌ AVOID OBVIOUS COMMENTS
// Set max width to 480  /* REDUNDANT */
```

### Plan References

```tsx
// @see FEAT_001 Brain-Dump Quiz Logic
// @see ADR_002 480px Mobile-First Constraint
export const useQuiz = () => {
  // implementation
};
```

---

## Collaboration Guidelines

### With UX/UI Designer

- **Before:** Review PDF references together
- **During:** Share screenshots early and often
- **After:** `/WF UX` review before marking done

### With QA/Tester

- **Before:** Explain edge cases and test data needs
- **During:** Address bug reports with plan references
- **After:** Verify acceptance criteria together

### With Product Owner

- **Before:** Clarify acceptance criteria
- **During:** Flag scope creep vs plan
- **After:** Demo vs acceptance criteria

---

## Key References (Must Read)

### Required Reading (Before First Commit)

| Document | Why Required |
|----------|--------------|
| `docs/tech/conventions.md` | SSOT for 480px and colors |
| `src/constants/colors.ts` | Actual color values to use |
| `ADR_002_mobile_first_constraint.md` | 480px rationale and verification |
| `TECH_001_matrix_ui_shell.md` | Current implementation plan |
| `glossary.md` | Terminology consistency |

### Quick Reference Links

```markdown
## Quick Links for Daily Use

- [Conventions (SSOT)](../../tech/conventions.md)
- [Colors (SSOT)](../../app/src/constants/colors.ts)
- [ADR_002 (480px)](../../architecture/adr/ADR_002_mobile_first_constraint.md)
- [Glossary](../../business/glossary.md)
- [Testing Strategy](tester/strategy.md)
```

---

## Common Pitfalls (Jak Nie Robić)

### 1. "I'll just make it responsive..."

❌ **WRONG:** Adding breakpoints for tablet/desktop  
✅ **RIGHT:** 480px only, centered on larger screens

### 2. "This color looks nice..."

❌ **WRONG:** Using `#FF6B6B` because it "looks right"  
✅ **RIGHT:** Using `COLORS.quadrant.q1.border` from colors.ts

### 3. "It's just a quick fix..."

❌ **WRONG:** Coding without reviewing PLAN  
✅ **RIGHT:** Read PLAN → Understand → Code → Test vs PLAN

### 4. "It works on my machine..."

❌ **WRONG:** Testing only on desktop  
✅ **RIGHT:** DevTools Mobile 375px/480px/768px mandatory

---

## Escalation Path

### When to Ask for Help

- [ ] Unclear acceptance criteria in PLAN
- [ ] Conflict between PLAN and ADR
- [ ] Technical blocker not covered in spec
- [ ] UX Review flagged critical issues

### How to Escalate

1. **Slack/Chat:** Quick questions, clarifications
2. **PR Comments:** Technical discussions
3. **Sync Meeting:** Complex conflicts, architectural concerns

---

## Success Metrics for Developers

| Metric | Target | Why |
|--------|--------|-----|
| Plan compliance | 100% | Code matches spec |
| UX Review first-pass | >80% | Minimal rework |
| 480px violations | 0 | ADR_002 compliance |
| Hard-coded colors | 0 | SSOT compliance |
| 'any' types | 0 | Type safety |

---

## Onboarding Checklist (New Developers)

- [ ] Read `docs/tech/conventions.md`
- [ ] Study `src/constants/colors.ts`
- [ ] Review `ADR_002_mobile_first_constraint.md`
- [ ] Complete `TECH_001_matrix_ui_shell.md` walkthrough
- [ ] Run first `/WF UX` review
- [ ] First commit with mentor review

---

**Version:** 1.0  
**Last Updated:** 2026-05-14  
**Maintained By:** Tech Lead & Senior Architect

