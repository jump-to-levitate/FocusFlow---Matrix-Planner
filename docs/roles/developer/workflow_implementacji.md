# Workflow Implementacji (Implementation Process)

> Developer Implementation Workflow  
> Document ID: DEV-WORKFLOW-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Senior Frontend Architect

---

## 1. Trójstopniowy Proces Pracy z AI

### 1.1 Krok 1: Read Spec (Przeczytaj Specyfikację)

**Obowiązek:** Deweloper/Agent AI MUSI przeczytać plik `PLAN_*.md` PRZED napisaniem jakiejkolwiek linii kodu.

**Szczególna uwaga na:**
- Sekcja **Acceptance Criteria (AC)** - definicja "done"
- Sekcja **Technical Requirements** - constraints i wymagania
- Sekcja **UI/UX Specification** - design tokens, 430px constraint
- Sekcja **Data Model** - schema, relacje, indeksy

```
FLOW:
1. Otwórz docs/plans/PLAN_<feature>.md
2. Przeczytaj cały dokument (nie skimuj!)
3. Zidentyfikuj Acceptance Criteria
4. Sprawdź zależności od innych planów
5. Oceń złożoność implementacji
         ↓
[Gotowy do implementacji]
```

### 1.2 Krok 2: Code & No Scope Creep (Koduj Bez Scope Creep)

**Zasada:** Implementacja WYŁĄCZNIE zakresu zdefiniowanego w kontrakcie planu.

**Zakazane:**
- ❌ Dodawanie "fajnych funkcji" nie wymienionych w planie
- ❌ Refaktoryzacja niezwiązanych modułów
- ❌ Zmiana API bez aktualizacji planu
- ❌ Optymalizacje przedwczesne (premature optimization)

**Wymagane:**
- ✅ Izolacja logiki biznesowej do custom hooks (`useQuizForm.ts`, `useTimer.ts`)
- ✅ Komponenty UI jako "czyste szablony" (pure templates)
- ✅ Strict adherence do 430px viewport constraint
- ✅ Kolory wyłącznie z `src/constants/colors.ts`

**Szablon Hooka:**
```typescript
// useFeatureX.ts - izolacja logiki
export interface UseFeatureXReturn {
  // State
  data: SomeType | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  doSomething: (arg: ArgType) => Promise<void>;
  reset: () => void;
}

export function useFeatureX(): UseFeatureXReturn {
  // Implementation...
}
```

**Szablon Komponentu:**
```tsx
// FeatureXScreen.tsx - czysty szablon
export function FeatureXScreen() {
  const feature = useFeatureX();
  
  return (
    <div className="max-w-[430px] mx-auto">
      {/* UI only - zero logiki */}
    </div>
  );
}
```

### 1.3 Krok 3: Log Update (Aktualizacja Rejestrów)

**NATYCHMIAST po zakończeniu prac programistycznych:**

#### 3.1 Aktualizacja `implemented_plans.md`

```markdown
## Q4 2024

- [x] [PLAN_archiwum_q4.md](../plans/02_features/PLAN_archiwum_q4.md)
  - Status: COMPLETED
  - Impl Date: 2026-05-18
  - Key Features: Q4 Archiwum, Destructive Hatch, 2x2 Sub-Matrix
```

#### 3.2 Aktualizacja `implemented_features.md`

```markdown
## Feature: Q4 Archiwum z Mechanizmem Destructive Hatch

**Plan Reference:** PLAN_archiwum_q4.md  
**Status:** ✅ COMPLETED  
**Impl Date:** 2026-05-18

**Technical Summary:**
- Implemented 2x2 sub-matrix for Q4 with h-14 headers
- Destructive Hatch "Zapomnij" button in QuizModal.tsx
- Matte Silver color theme (#94A3B8) for Q4
- Direct argument passing for race condition prevention
```

---

## 2. Rejestr Pre-Commit i Husky

### 2.1 Konfiguracja Husky

**Plik:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 1. ESLint - sprawdzenie kodu
npm run lint || {
  echo "❌ ESLint failed"
  exit 1
}

# 2. TypeScript - sprawdzenie typów
tsc --noEmit || {
  echo "❌ TypeScript type check failed"
  exit 1
}

# 3. Build - weryfikacja produkcyjna
npm run build || {
  echo "❌ Build failed"
  exit 1
}

echo "✅ All checks passed!"
```

### 2.2 Skrypty NPM

**Plik:** `package.json`

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx --max-warnings=0",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "build": "tsc && vite build",
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

### 2.3 Konfiguracja ESLint

**Plik:** `.eslintrc.json`

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react-hooks"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react-hooks/recommended"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## 3. Pull Request Checklist

### 3.1 Przed Wysłaniem PR

```markdown
## Pre-PR Checklist

- [ ] Przeczytano PLAN_*.md w całości
- [ ] Zaimplementowano zgodnie z Acceptance Criteria
- [ ] Kod przeszedł `npm run lint` (zero warnings)
- [ ] Kod przeszedł `tsc --noEmit` (zero errors)
- [ ] Build produkcyjny działa (`npm run build`)
- [ ] Wszystkie viewporty to 430px (sprawdzone w makiety.md)
- [ ] Kolory pobrane z `src/constants/colors.ts`
- [ ] Hooki mają explicit return types
- [ ] Brak `any` w kodzie
- [ ] useMemo zamiast useEffect dla derived state
- [ ] Aktualizowano `implemented_plans.md`
- [ ] Aktualizowano `implemented_features.md`
```

### 3.2 Szablon PR

```markdown
## Implementacja: [Nazwa Funkcjonalności]

**Plan Reference:** PLAN_xxx.md

### Co zostało zaimplementowane:
- [Feature 1]
- [Feature 2]
- [Feature 3]

### Kluczowe decyzje techniczne:
- [Uzasadnienie wyboru X zamiast Y]
- [Pattern użyty do rozwiązania problemu Z]

### Pliki zmodyfikowane:
- `src/components/...`
- `src/hooks/...`

### Checklist:
- [x] Lint passing
- [x] TypeScript strict
- [x] Build passing
- [x] 430px constraint verified
- [x] SSOT colors verified
```

---

## 4. Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SDD IMPLEMENTATION WORKFLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   STEP 1: READ SPEC                                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Otwórz docs/plans/PLAN_*.md                                    │   │
│   │  • Przeczytaj Acceptance Criteria                                │   │
│   │  • Zidentyfikuj technical requirements                           │   │
│   │  • Sprawdź UI/UX spec (430px constraint)                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              ↓                                              │
│   STEP 2: CODE & NO SCOPE CREEP                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Izolacja logiki do custom hooks                                 │   │
│   │  • Komponenty jako czyste szablony                                 │   │
│   │  • Strict 430px viewport                                          │   │
│   │  • Kolory z src/constants/colors.ts                               │   │
│   │  • Zakaz dodawania "fajnych ficzerów" poza planem                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              ↓                                              │
│   STEP 3: PRE-COMMIT CHECKS                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  🔍 Husky automatycznie uruchamia:                                │   │
│   │     1. npm run lint      (ESLint)                                 │   │
│   │     2. tsc --noEmit      (TypeScript)                             │   │
│   │     3. npm run build     (Production build)                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              ↓                                              │
│   STEP 4: LOG UPDATE                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Aktualizacja implemented_plans.md                              │   │
│   │  • Aktualizacja implemented_features.md                           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              ↓                                              │
│   STEP 5: PULL REQUEST                                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Użyj szablonu PR                                                │   │
│   │  • Code review przez Tech Lead / Architect                        │   │
│   │  • Merge po approval                                              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Zasady "No Scope Creep"

### 5.1 Definicja Scope Creep

> Dodawanie funkcjonalności nieprzewidzianych w oryginalnym planie podczas implementacji.

### 5.2 Przykłady Scope Creep w FocusFlow

| ❌ Scope Creep | ✅ Właściwe Postępowanie |
|---------------|--------------------------|
| "Dodam animację przy dodawaniu zadania - będzie ładniej" | Animacje wymagają osobnego PLAN_animations.md |
| "Zmienię kolory na bardziej pastelowy" | Kolory są SSOT - zmiana wymaga UX Review i ADR |
| "Zrobię eksport do CSV" | Eksport = nowa funkcjonalność = nowy PLAN_ |
| "Refaktoryzacja starego kodu w tym samym PR" | Refaktoryzacja = osobny PLAN_refactor.md |

### 5.3 Co Zrobić Gdy Pojawi Się Pomysł

```
Masz genialny pomysł podczas implementacji?
         ↓
Czy pomysł jest w PLAN_*.md?
         ↓
    NIE → Zapisz do backlogu (TODO.md lub issue)
       ↓
       Kontynuuj implementację planu
         ↓
   PO MERGE → Utwórz nowy PLAN_ dla pomysłu
```

---

**Document ID:** DEV-WORKFLOW-001  
**Owner:** Senior Frontend Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-18
