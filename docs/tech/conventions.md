# Konwencje Techniczne FocusFlow 2.0

> **SINGLE SOURCE OF TRUTH (SSOT) dla ograniczeń technicznych i konwencji kodowania**

---

## ZASADA KRYTYCZNA: Mobile-First Only (480px Safety Net)

**Aplikacja jest WYŁĄCZNIE Mobile-First.**

> **UWAGA:** Niniejszy dokument jest JEDYNYM źródłem prawdy (SSOT) dla ograniczenia 480px. Każda zmiana UI MUSI być zgodna z ADR_002.

### AppShell - 480px Safety Net

| Property | Value | Rationale |
|----------|-------|-----------|
| **Max Width** | `max-w-[480px]` | Hard limit dla mobile-first |
| **Centering** | `mx-auto` | Wycentrowanie na desktopie |
| **Min Height** | `min-h-screen` | Full viewport coverage |
| **Padding X** | `px-4` (16px) | Safe zone dla contentu |

```tsx
// app/src/components/AppShell.tsx - MANDATORY pattern
<div className="max-w-[480px] mx-auto min-h-screen px-4">
  {children}
</div>
```

### Why 480px for ADHD?

- **Focus Constraint** - Mniejszy viewport = mniej dystrakcji wizualnych
- **Thumb Reachability** - Wszystko w zasięgu kciuka (thumb-first design)
- **Object Permanence** - Content zawsze widoczny, nie "ginie" poza viewport
- **Cognitive Load** - Redukcja overwhelm przez limitowanie pola widzenia

---

## Zakaz Twardego Kodowania Kolorów (SSOT)

**NIE WOLNO** używać wartości kolorów bezpośrednio w komponentach.

### Dozwolone źródła kolorów (SSOT):

| Źródło | Ścieżka | Użycie |
|--------|---------|--------|
| **Primary** | `src/constants/colors.ts` | Neon Glassmorphism palette, Q1-Q4 colors |
| **Secondary** | `tailwind.config.js` | Custom theme extensions |
| **Fallback** | Tailwind classes | `bg-slate-900`, `text-white`, etc. |

### Przykład ZAKAZANEGO kodu:

```tsx
// ❌ ZAKAZANE
<button className="bg-[#FF6B6B] text-white">
```

### Przykład POPRAWNEGO kodu:

```tsx
// ✅ POPRAWNE - użycie colors.ts (PRIMARY SSOT)
import { COLORS } from '@/constants/colors';
<button className={COLORS.primary.button}>

// ✅ POPRAWNE - użycie tailwind.config (SECONDARY)
<button className="bg-neon-lime text-white">

// ✅ POPRAWNE - standardowe Tailwind (FALLBACK)
<button className="bg-slate-700 text-white">
```

> **ZASADA:** Zawsze preferuj `src/constants/colors.ts` dla kolorów brand/Neon Glassmorphism.

## Struktura Plików

```
/app/src
  /components        - Reużywalne komponenty UI
  /features          - Komponenty domenowe (Matrix, Quiz, Notes, Timer)
  /constants         - Stałe aplikacji (kolory, config)
  /hooks             - Custom React hooks
  /db                - Dexie.js schema i operacje
  /types             - TypeScript type definitions
  /utils             - Funkcje pomocnicze
```

## Nazewnictwo

- Komponenty: PascalCase (`TaskCard.tsx`)
- Hooki: camelCase z prefixem `use` (`useTasks.ts`)
- Typy: PascalCase z suffixem gdy potrzeba (`Task`, `TaskInput`)
- Stałe: UPPER_SNAKE_CASE w `constants/`
- Funkcje pomocnicze: camelCase (`formatDate.ts`)

## Style CSS

- **Mobile-first**: domyślny styl = mobile, `md:` = tablet/desktop
- **Glassmorphism**: `backdrop-blur`, `bg-opacity`, `border-white/20`
- **Neon accents**: kolory z palety neon (cyan, magenta, lime)

