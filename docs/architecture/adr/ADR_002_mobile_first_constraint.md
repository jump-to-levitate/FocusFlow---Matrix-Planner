# ADR_002: Mobile-First 480px Constraint

> Architectural Decision Record: Hard 480px width limit for ADHD-optimized UX  
> Status: Accepted  
> Date: 2026-05-14

---

## Context (Kontekst)

FocusFlow 2.0 is designed for users with ADHD (our primary ICP - "The ADHD Brain" persona). A core challenge for this demographic is **executive dysfunction** and **susceptibility to distraction**.

### Problem Statement

Standard responsive web apps adapt to any screen width. On desktop, this results in:
- Wide layouts with lots of visual elements
- Information overload
- Eye movement fatigue scanning wide areas
- Reduced "object permanence" - content outside viewport is "forgotten"

For ADHD users, this creates **cognitive overwhelm** and reduces the app's effectiveness as an "external executive function" tool.

### Decision Drivers

| Driver | Priority | Rationale |
|--------|----------|-----------|
| **ADHD UX** | Critical | Reduce distraction, limit visual field, enforce focus |
| **Thumb-First** | High | Mobile-first = everything in thumb reach |
| **Cognitive Load** | High | Smaller viewport = less overwhelm |
| **Consistency** | Medium | Unified experience across all devices |

---

## Decision (Decyzja)

We will enforce a **hard 480px maximum width constraint** on ALL views, regardless of device.

### Implementation Pattern

```tsx
// AppShell.tsx - Applied to ALL screens
<div className="max-w-[480px] mx-auto min-h-screen px-4">
  {children}
</div>
```

### Behavior by Viewport

| Device | Viewport | Behavior |
|--------|----------|----------|
| Mobile S | 320px | Full width + padding (constraint not yet active) |
| Mobile M | 375px | Full width + padding |
| Mobile L | 414px | Full width + padding |
| Mobile XL | 480px | **Max width reached** - full container |
| Tablet | 768px+ | **Centered 480px box** with dark margins |
| Desktop | 1024px+ | **Centered 480px box** |
| Desktop XL | 1440px+ | **Centered 480px box** |

### Visual Representation

```
Mobile (375px):          Desktop (1440px):
┌──────────────┐         ┌─────────────────────────────────────────────┐
│              │         │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│  AppShell    │         │░                                         ░│
│  max-w-480   │         │░      ┌───────────────────────────┐       ░│
│  (100%)      │         │░      │                           │       ░│
│              │         │░      │     AppShell              │       ░│
│              │         │░      │     max-w-[480px]         │       ░│
│              │         │░      │     (centered)            │       ░│
│              │         │░      │                           │       ░│
│              │         │░      └───────────────────────────┘       ░│
│              │         │░                                         ░│
└──────────────┘         └─────────────────────────────────────────────┘
    375px wide                   480px centered on 1440px
```

---

## Consequences (Konsekwencje)

### Positive (Pozytywne)

1. **ADHD-Optimized Focus Zone**
   - Limited visual field reduces distraction
   - Everything visible at once (no horizontal scanning)
   - "Out of sight = out of mind" problem solved

2. **Thumb-First Design Enforced**
   - All interactions naturally in thumb reach
   - No need to stretch or reposition grip

3. **Simplified Design Decisions**
   - No complex responsive breakpoints
   - Single-column layout always
   - Predictable component sizing

4. **Development Velocity**
   - One layout to design and test
   - Reduced CSS complexity
   - Faster implementation

5. **Cross-Device Consistency**
   - Same experience on phone, tablet, desktop
   - No "desktop has more features" problem

### Negative (Negatywne)

1. **Desktop User Expectations**
   - Desktop users may expect full-width utilization
   - **Mitigation:** Dark, non-distracting margins; "mobile-first productivity" branding

2. **Content Density Limitations**
   - Less information visible at once
   - **Mitigation:** Progressive disclosure, collapsible sections, scrollable areas

3. **External Tooling Constraints**
   - Some third-party components may assume full-width
   - **Mitigation:** Wrap all external components in 480px containers

### Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Users complain about "wasted space" on desktop | Medium | Low | Clear ADHD-focused value proposition; show time-to-value |
| Complex tables/lists don't fit | Low | Medium | Horizontal scroll within container; card-based layouts |
| Stakeholder resistance | Low | High | User testing data; ADHD persona validation |

---

## Compliance (Zgodność)

### Mandatory Compliance Points

All UI changes MUST verify:

1. **Root container has `max-w-[480px]`**
   ```tsx
   // REQUIRED pattern
   <div className="max-w-[480px] mx-auto ...">
   ```

2. **No component exceeds container width**
   - Use `w-full` (100% of 480px)
   - Never use `vw` units
   - Never use fixed widths > 480px

3. **Test on 3 viewports**
   - 375px (iPhone SE)
   - 480px (max-width)
   - 768px+ (centered behavior)

### Verification Checklist (Pre-Commit)

```markdown
- [ ] AppShell implements max-w-[480px]
- [ ] No horizontal scrollbars present
- [ ] Tested on 375px, 480px, and 768px+ viewports
- [ ] All images respect container boundaries
- [ ] No fixed-width elements > 448px (480px - 2×16px padding)
```

---

## References (Odniesienia)

### Related Documents

| Document | Purpose |
|----------|---------|
| `docs/tech/conventions.md` | SSOT for 480px implementation details |
| `docs/plans/PLAN_RISK_002_icp_persona.md` | ADHD persona validation |
| `docs/design-system.md` | Visual design system |
| `docs/plans/PLAN_001_matrix_ui_shell.md` | Implementation plan |

### Technical Implementation

```tsx
// app/src/components/AppShell.tsx
export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* 480px Safety Net - HARD REQUIREMENT */}
      <div className="mx-auto w-full max-w-[480px] min-h-screen px-4 py-6">
        {children}
      </div>
    </div>
  );
};
```

### CSS Utilities (Tailwind)

```css
/* Required utilities in tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      maxWidth: {
        'app': '480px', /* Primary constraint */
      },
    },
  },
};
```

---

## Decision Validation

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Layout consistency | 100% | All screens ≤480px |
| ADHD user satisfaction | >80% | Post-session surveys |
| Development time | -20% | vs full responsive |
| Bug reports (layout) | <5% | vs previous version |

### Review Trigger

This ADR should be reviewed if:
- User testing shows strong negative feedback on 480px limit
- New features absolutely require >480px width
- Business requirements fundamentally change (new ICP)

---

## Notes (Notatki)

### Why 480px specifically?

- **iPhone 14 Pro Max**: 430px logical width
- **Samsung S23 Ultra**: 384px logical width  
- **480px**: Covers largest phones + comfortable margin
- **Psychological**: "Less than 500px" feels intentionally constrained

### Why not fluid?

Fluid layouts encourage adding "just one more thing" for larger screens. Hard constraint forces disciplined, focused design - aligning with ADHD UX principles.

---

**Status:** ✅ Accepted  
**Decision By:** Senior Architect & Product Owner  
**Date:** 2026-05-14  
**Review Date:** 2026-06-14 (or upon user feedback)

