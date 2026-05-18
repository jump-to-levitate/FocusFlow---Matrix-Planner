# Rola: Developer (Deweloper) - FocusFlow

> **Odpowiedzialność:** Implementacja specyfikacji zgodnie ze standardami TypeScript (strict mode), unikanie anty-patternów w stanach React (Derived State), czysty kod Tailwind CSS.
> **Zasada:** Kod jest poprawny, gdy implementuje specyfikację - nie gdy "działa".

---

## 1. Standardy Kodu (Coding Standards)

### 1.1 TypeScript - Strict Mode

**Konfiguracja:** `tsconfig.json` z włączonym `strict: true`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Zasady:**
- ❌ **ZAKAZ** `any` - użyj `unknown` + type guards
- ❌ **ZAKAZ** implicit `null` - explicit `| null` w typach
- ✅ **WYMAGANE** return types dla public functions
- ✅ **WYMAGANE** explicit types dla props komponentów

**Przykład - Dobry Kod:**
```typescript
// ✅ EXPLICIT TYPES
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => Promise<void>;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const handleClick = async (): Promise<void> => {
    await onComplete(task.id!);
  };
  
  return (
    <div className="p-4 border border-[#D000FF]">
      <span className="text-white">{task.title}</span>
    </div>
  );
};
```

**Przykład - Zły Kod:**
```typescript
// ❌ IMPLICIT ANY, MISSING TYPES
const TaskCard = ({ task, onComplete }) => {  // any!
  const handleClick = async () => {  // return type?
    await onComplete(task.id);  // id może być undefined!
  };
  
  return (
    <div style={{ padding: '16px', border: '1px solid purple' }}>  // hardcoded!
      <span>{task.title}</span>
    </div>
  );
};
```

### 1.2 Zasada Unikania useEffect na Rzecz Derived State

**Problem:** `useEffect` do obliczeń powoduje **race conditions**, **stale closures**, **necessary re-renders**.

**Rozwiązanie:** **Synchroniczny Derived State** (ADR 004)

| Anty-pattern | Problemy | Rozwiązanie |
|--------------|----------|-------------|
| `useEffect` + `setState` dla obliczeń | Race conditions, extra renders | `useMemo` |
| `useEffect` dla "watchowania" props | Stale closures | Compute inline w render |
| `useEffect` dla derived data | Unnecessary complexity | Selector functions |

**Przykład - ANTY-PATTERN (useEffect):**
```typescript
// ❌ RACE CONDITION, EXTRA RENDER
const [predictedQuadrant, setPredictedQuadrant] = useState<number | null>(null);

useEffect(() => {
  if (importance !== null && urgency !== null) {
    const quadrant = classifyFromScores(importance, urgency);
    setPredictedQuadrant(quadrant);  // Extra render! Race condition!
  }
}, [importance, urgency]);
```

**Przykład - POPRAWNE (useMemo):**
```typescript
// ✅ SYNCHRONICZNY, DETERMINISTYCZNY, BRAK RACE CONDITIONS
const predictedQuadrant = useMemo(() => {
  if (importance === null || urgency === null) return null;
  return classifyFromScores(importance, urgency);
}, [importance, urgency]);
// Natychmiastowo dostępny, bez extra renderów!
```

**Zasada:** Jeśli dane mogą być wyliczone z props/state → **NIE PRzechowuj w state**. Użyj `useMemo` lub compute inline.

### 1.3 Czysty Kod w Komponentach Tailwind CSS

**Zasady Tailwind w FocusFlow:**

| Zasada | Implementacja |
|--------|---------------|
| **Utility-First** | Tylko Tailwind classes, **ZAKAZ** inline styles |
| **Design Tokens** | Kolory z `colors.ts`, spacing z Tailwind scale |
| **480px Constraint** | `max-w-[480px]`, `w-full`, mobile-first |
| **h-14 Headers** | `h-14` (56px) dla uniform alignment |
| **whitespace-nowrap** | Dla nagłówków z krótkimi etykietami |

**Przykład - Dobry Tailwind:**
```tsx
// ✅ TOKENS, CONSTRAINT, CLEAN
<div className="w-full max-w-[480px] mx-auto px-4">
  <div className="h-14 flex items-center justify-between 
                  border border-[#D000FF] 
                  bg-[rgba(208,0,255,0.15)]">
    <span className="text-sm font-bold text-white whitespace-nowrap">
      Centrum
    </span>
    <span className="text-[11px] font-bold text-[#D000FF]/70 whitespace-nowrap">
      Planowania
    </span>
  </div>
</div>
```

**Przykład - Zły Tailwind (Hardcoded):**
```tsx
// ❌ HARDCODED STYLES, NO TOKENS
<div style={{ 
  width: '480px', 
  padding: '16px',
  border: '1px solid purple',  // nie #D000FF!
  backgroundColor: 'rgba(255,0,255,0.1)'  // nie design token!
}}>
  <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
    Centrum Planowania
  </span>
</div>
```

---

## 2. Workflow Implementacji (Zgodny z Sekcją 6.2 Planów)

### 2.1 Trójstopniowy Proces Implementacji

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  KROK 1: ODCZYT PLANU                                               │
│  └── Przeczytaj odpowiedni FEAT_* lub TECH_* plan                  │
│  └── Zwróć szczególną uwagę na sekcję "Kryteria Akceptacji (AC)"  │
│  └── Zidentyfikuj zmiany w schemacie Dexie (jeśli dotyczy)          │
│                          ↓                                          │
│  KROK 2: IMPLEMENTACJA                                              │
│  └── Koduj zgodnie ze specyfikacją                                  │
│  └── UNIKAJ scope creep (nie dodawaj funkcji spoza planu!)         │
│  └── Używaj Derived State (useMemo) zamiast useEffect             │
│  └── Rygorystyczne typowanie unii dla subkategorii:
│      type Q2Subcategory = 'rutyny' | 'projekt' | 'ogolny_cel' | 'inne';
│      type Q3Subcategory = 'zrob_teraz' | 'zaplanuj' | 'w_przerwie' | 'inne';
│      type Q4Subcategory = 'rozrywka' | 'hobby' | 'optymalizacja' | 'side_questy';
│  └── Izolacja logiki do hooka `useQuizForm.ts` - UI tylko renderuje, logika w hooku             │
│  └── 480px Constraint Check (wszystkie komponenty)                  │
│  └── Tailwind tokens (brak hardcoded colors)                        │
│                          ↓                                          │
│  KROK 3: AKTUALIZACJA LOGÓW W ROOT                                  │
│  └── Dodaj wpis do `implemented_features.md` (jeśli nowa funkcja)  │
│  └── Dodaj wpis do `implemented_plans.md` (jeśli nowy plan)        │
│  └── Oznacz AC jako spełnione w planie (checklist)                  │
│                          ↓                                          │
│  PR → Review → Merge                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Szczegółowy Proces Odczytu Planu

**Przed Rozpoczęciem Kodowania - Mandatory Reading:**

1. **Przeczytaj plan** z `docs/plans/02_features/` lub `docs/plans/03_technical/`
2. **Zidentyfikuj AC** (Acceptance Criteria) - GIVEN-WHEN-THEN
3. **Sprawdź ADR** jeśli plan referuje (np. ADR 003 dla timera)
4. **Zweryfikuj schemat** - czy wymagane są zmiany w `dexie.ts`?
5. **Zaplanuj testy** - jak zweryfikujesz każde AC?

**Jeśli Spec Niejednoznaczny:**
- **NIE** koduj "na czuja"
- **NIE** dodawaj własnych interpretacji (scope creep)
- **TAK** zapytaj w PR/Discord o doprecyzowanie
- **TAK** zaproponuj aktualizację spec (jeśli realita ≠ plan)

### 2.3 Unikanie Scope Creep

**Definicja:** Dodawanie funkcjonalności spoza zdefiniowanego planu podczas implementacji.

**Przykład Scope Creep:**
```
Plan: "Implementacja Q2 Sub-Matrix z 4 szufladami"

❌ SCOPE CREEP:
   "Skoro robię Q2, to dodam też eksport do CSV, 
    bo to przydatne... i może drag-and-drop..."

✅ ZGODNE ZE SPECYFIKACJĄ:
   "Implementuję DOKŁADNIE 4 szuflady: Rutyny, Projekty, 
    Cele, Inne. Dla Q2, Q3, Q4. Bez dodatkowych ficzerów."
```

**Konsekwencje Scope Creep:**
- Opóźnienie release'u
- Spadek jakości (mniej przetestowane)
- Tech debt
- Frustracja zespołu

### 2.4 Aktualizacja Logów w Roocie

**Po Zakończeniu Implementacji:**

1. **`implemented_features.md`** - jeśli to nowa funkcjonalność:
```markdown
### Q2 Sub-Matrix (Centrum Planowania)
- **Status:** ✅ Wdrożone (Maj 2026)
- **Opis:** Pod-widok 2x2 z 4 szufladami wykonawczymi
- **AC:** 6/6 spełnionych (link do planu)
```

2. **`implemented_plans.md`** - jeśli to nowy plan:
```markdown
| Plan | Status | Data | Commit |
|------|--------|------|--------|
| FEAT_003_Centrum_Planowania | ✅ 100% UKOŃCZONE | 2026-05-17 | 7bf646b |
```

3. **Oznacz AC w planie** - checklista:
```markdown
## 8. Kryteria Akceptacji (AC)
- [x] AC-1: Sub-Matryca 2x2 z 4 Szufladami
- [x] AC-2: Stała Wysokość Nagłówków (h-14)
... (wszystkie oznaczone jako done)
```

---

## 3. Pre-Commit Checklist

Przed każdym commitem/PR:

```markdown
- [ ] **Plan Review:** Przeczytałem/am odpowiedni plan z `docs/plans/`
- [ ] **AC Coverage:** Wszystkie Acceptance Criteria są implementowane
- [ ] **TypeScript:** Kod przechodzi `tsc --noEmit` (strict mode)
- [ ] **Derived State:** Używam `useMemo` zamiast `useEffect` dla obliczeń
- [ ] **480px Constraint:** Sprawdziłem/am wszystkie komponenty UI
- [ ] **Design Tokens:** Używam kolorów z `colors.ts` (brak hardcoded)
- [ ] **Tailwind:** Brak inline styles, tylko utility classes
- [ ] **Build:** `npm run build` przechodzi bez błędów
- [ ] **Self-Review:** Przeglądnąłem/am własny kod
- [ ] **Log Update:** Zaktualizowałem/am `implemented_features.md` lub `implemented_plans.md`
```

---

## 4. Key Documents

| Dokument | Cel |
|----------|-----|
| [`docs/tech/conventions.md`](../../tech/conventions.md) | Konwencje projektu, naming, structure |
| [`docs/plans/02_features/`](../../plans/02_features/) | Plany funkcjonalności (FEAT_*) |
| [`docs/plans/03_technical/`](../../plans/03_technical/) | Plany techniczne (TECH_*) |
| [`docs/architecture/adr/`](../../architecture/adr/) | Decyzje architektoniczne (ADR_*) |
| [`app/src/db/dexie.ts`](../../../app/src/db/dexie.ts) | Schemat bazy danych |
| [`app/src/constants/colors.ts`](../../../app/src/constants/colors.ts) | Design tokens |
| [`implemented_features.md`](../../../implemented_features.md) | Rejestr funkcjonalności |
| [`implemented_plans.md`](../../../implemented_plans.md) | Rejestr planów |

---

## 5. Anti-Patterns (Czego UNIKAĆ)

| Anti-Pattern | Problem | Rozwiązanie |
|--------------|---------|-------------|
| `useEffect` dla obliczeń | Race conditions | `useMemo` lub inline compute |
| `any` type | Brak type safety | `unknown` + type guards |
| Inline styles | Brak consistency | Tailwind classes |
| Hardcoded colors | Brak design system | `colors.ts` tokens |
| Prop drilling | Skomplikowany code | React Context |
| Mutable state | Bugs, unpredictability | Immutable updates |
| Large components | Low reusability | Split into smaller components |
| No error handling | Silent failures | Try-catch + user feedback |

---

## 6. Code Review Guidelines

**Jako Reviewer Sprawdzam:**

1. ✅ Czy kod implementuje DOKŁADNIE to, co jest w planie?
2. ✅ Czy wszystkie AC są spełnione?
3. ✅ Czy nie ma scope creep?
4. ✅ Czy użyto `useMemo` zamiast `useEffect` dla derived state?
5. ✅ Czy TypeScript jest strict (brak `any`)?
6. ✅ Czy są design tokens (brak hardcoded colors)?
7. ✅ Czy 480px constraint jest zachowany?
8. ✅ Czy `npm run build` przechodzi?
9. ✅ Czy zaktualizowano `implemented_*.md`?

**Feedback powinien być:**
- **Konstruktywny** - sugestie, nie tylko krytyka
- **Oparty na spec** - "Zgodnie z planem..."
- **Konkretny** - wskazanie linii kodu
- **Edukacyjny** - wyjaśnienie DLACZEGO

---

**Zasada:** "Nie piszemy kodu który 'działa'. Piszemy kod który implementuje specyfikację, jest czytelny dla innych deweloperów, i będzie łatwy w utrzymaniu za 6 miesięcy."

