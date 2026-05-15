# Konwencje Techniczne FocusFlow 2.0

> **SINGLE SOURCE OF TRUTH (SSOT) dla ograniczeń technicznych i konwencji kodowania**

---

## ZASADA KRYTYCZNA: Mobile-First Only (Pro Max Standard 430px)

**Aplikacja jest WYŁĄCZNIE Mobile-First.**

> **UWAGA:** Niniejszy dokument jest JEDYNYM źródłem prawdy (SSOT) dla ograniczenia 430px. Każda zmiana UI MUSI być zgodna z ADR_002.

### AppShell - Pro Max Standard (430×932px)

| Property | Value | Rationale |
|----------|-------|-----------|
| **Width (desktop)** | `430px` | Sztywna szerokość Pro Max |
| **Height (desktop)** | `932px` | Sztywna wysokość Pro Max |
| **Max Width (mobile)** | `max-w-[430px]` | Hard limit dla mobile-first |
| **Centering** | `mx-auto` | Wycentrowanie na desktopie |
| **Min Height (mobile)** | `min-h-screen` | Full viewport coverage |
| **Padding X** | `px-6` (24px) | Safe zone dla contentu |
| **Scale fallback** | `transform: scale()` | Przy viewport < 960px wysokości |
| **Overflow** | `overflow: hidden` | Nic nie wychodzi poza zaokrąglone rogi |

```tsx
// app/src/App.tsx - MANDATORY pattern (v1.3)
<div className="app-outer">
  <div className="app-shell relative">
    {/* Dynamic Island - absolute, not in flow */}
    <div className="hidden min-[480px]:flex absolute top-0 inset-x-0 z-10 justify-center pt-3">
      <div className="w-[150px] h-[36px] bg-black rounded-full" />
    </div>
    <main className="flex-1 overflow-y-auto scrollbar-hide min-[480px]:pt-14">
      {/* Screen content */}
    </main>
    <BottomNav />
  </div>
</div>
```

### Wymogi dla każdego nowego ekranu

Każdy nowy ekran MUSI:
- Używać `flex flex-col h-full` jako root container
- Wypełniać 100% wysokości ramki (flex-1 lub h-full)
- **NIE** używać `min-h-screen` wewnątrz AppShell
- **NIE** używać jednostek `vh` dla wymiarów ramki
- Używać `gap-6` lub `gap-8` do rytmu pionowego (nie `justify-between`)

### Why 430px for ADHD?

- **Focus Constraint** - Mniejszy viewport = mniej dystrakcji wizualnych
- **Thumb Reachability** - Wszystko w zasięgu kciuka (thumb-first design)
- **Object Permanence** - Content zawsze widoczny, nie "ginie" poza viewport
- **Cognitive Load** - Redukcja overwhelm przez limitowanie pola widzenia
- **Pro Max Standard** - Odpowiada flagshipom 2024-2026 (iPhone 15 Pro Max, Pixel 8 Pro)

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

- **Mobile-first**: domyślny styl = mobile, `min-[480px]:` = desktop device frame
- **Pro Max constraint**: 430×932px, `px-6`, `overflow: hidden`
- **Scale fallback**: `transform: scale()` przy viewport < 960px
- **Glassmorphism**: `backdrop-blur`, `bg-opacity`, `border-white/20`
- **Neon accents**: Q1=#39FF14, Q2=#D000FF, Q3=#FF8C00, Q4=#64748B
- **Dynamic Island**: absolute positioning, `<main>` uses `pt-14` safe area
- **Screen layout**: `flex flex-col h-full gap-6` (no `justify-between`)

