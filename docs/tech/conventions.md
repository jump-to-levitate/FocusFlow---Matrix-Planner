# Konwencje Techniczne FocusFlow 2.0

> Zasady kodowania obowiązujące w całym projekcie

## ZASADA KRYTYCZNA: Mobile-First Only

**Aplikacja jest WYŁĄCZNIE Mobile-First.**

### AppShell

- Stała maksymalna szerokość: `max-w-[480px]`
- Wycentrowanie: `mx-auto`
- Pełna wysokość: `min-h-screen`
- Padding boczny: `px-4`

```tsx
// app/src/components/AppShell.tsx
<div className="max-w-[480px] mx-auto min-h-screen px-4">
  {children}
</div>
```

## Zakaz Twardego Kodowania Kolorów

**NIE WOLNO** używać wartości kolorów bezpośrednio w komponentach.

### Dozwolone źródła kolorów:

1. `src/constants/colors.ts` - aplikacyjna paleta
2. `tailwind.config.js` - custom theme colors
3. Klasy Tailwind np. `bg-blue-500`, `text-gray-900`

### Przykład ZAKAZANEGO kodu:

```tsx
// ❌ ZAKAZANE
<button className="bg-[#FF6B6B] text-white">
```

### Przykład POPRAWNEGO kodu:

```tsx
// ✅ POPRAWNE
import { COLORS } from '@/constants/colors';
<button className={COLORS.primary.button}>

// lub
<button className="bg-accent-500 text-white">
```

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

