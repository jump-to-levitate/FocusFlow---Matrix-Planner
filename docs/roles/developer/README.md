# Rola: Developer (Deweloper) - FocusFlow 2.0

> **Odpowiedzialność:** Implementacja specyfikacji technicznych z zachowaniem maksymalnej wydajności interfejsu (zero latency) i spójności architektury offline-first.
> **Zasada:** Kod jest poprawny, gdy implementuje specyfikację - nie gdy "działa".

---

## 1. Odpowiedzialność Roli

Developer w FocusFlow odpowiada za:

- **Zero Latency UI** - Implementacja bez blokujących operacji, instant feedback
- **Type Safety** - TypeScript strict mode, zero `any`, explicit return types
- **Architecture Compliance** - Local-first, offline-first, 430px constraint
- **No Scope Creep** - Strict adherence do specyfikacji PLAN_*
- **Clean Code** - Isolated logic w hookach, komponenty jako czyste szablony

---

## 2. Mapa Standardów i Konwencji (Single Source of Truth)

| Dokument | Zawartość | Link |
|----------|-----------|------|
| **Standardy Kodu** | TypeScript strict, unie stringów subkategorii, useMemo vs useEffect | [standardy_kodu.md](./standardy_kodu.md) |
| **Konwencje Projektowe** | 430px constraint, design tokens, h-14 headers, Tailwind standards | [konwencje_projektowe.md](./konwencje_projektowe.md) |
| **Workflow Implementacji** | 3-krokowy proces AI, No Scope Creep, Husky pre-commit | [workflow_implementacji.md](./workflow_implementacji.md) |
| **UX/UI Specs** | Design tokens, viewport constraints | [../ux_ui/](../ux_ui/) |
| **Architecture Specs** | Dexie schema, TimerContext patterns | [../architect/](../architect/) |

---

## 3. Pre-Commit Checklist

### 3.1 Checklist Przed Commitem

```markdown
## Pre-Commit Checklist

- [ ] Lint passing: `npm run lint` (zero warnings)
- [ ] TypeScript strict: `tsc --noEmit` (zero errors)
- [ ] Build passing: `npm run build` (production ready)
- [ ] 430px constraint verified (max-w-[430px] mx-auto)
- [ ] SSOT colors verified (z `src/constants/colors.ts`)
- [ ] Hooki mają explicit return types
- [ ] Brak `any` w kodzie
- [ ] useMemo zamiast useEffect dla derived state
- [ ] Logi zaktualizowane (implemented_plans.md, implemented_features.md)
```

### 3.2 Husky Automation

Husky automatycznie uruchamia przy każdym commitcie:
1. `npm run lint` (ESLint)
2. `tsc --noEmit` (TypeScript strict check)
3. `npm run build` (Production build verification)

---

## 4. Quick Reference

### 4.1 Viewport (430px Pro Max Standard)

```tsx
// ✅ Wymagany pattern dla wszystkich ekranów
<div className="max-w-[430px] mx-auto min-h-screen">
  {/* App content */}
</div>
```

### 4.2 Kolory (SSOT)

```tsx
import { COLORS } from '@/constants/colors';

// ✅ Wymagane - nigdy nie hardkoduj HEX w JSX
<div style={{ color: COLORS.neon.lime }}>
```

### 4.3 Stan Pochodny (useMemo)

```tsx
// ✅ Wymagane - synchroniczne wyliczenie
const predictedQuadrant = useMemo(() => {
  if (importance === null || urgency === null) return null;
  return classifyFromScores(importance, urgency);
}, [importance, urgency]);
```

### 4.4 Typowanie Subkategorii

```typescript
// ✅ Wymagane - string unions z exhaustiveness checking
type Q2Subcategory = 'rutyny' | 'projekt' | 'ogolny_cel' | 'inne';
type Q3Subcategory = 'zrob_teraz' | 'zaplanuj' | 'w_przerwie' | 'inne';
type Q4Subcategory = 'rozrywka' | 'hobby' | 'optymalizacja' | 'side_questy';

**Viewport:** 430px Pro Max Standard
