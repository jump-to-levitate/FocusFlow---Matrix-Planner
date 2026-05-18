# Stos Technologiczny FocusFlow 2.0

> Technical Stack Specification & Rationale  
> Status: FROZEN (v1.0.0)  
> Data: 2026-05-18

---

## 1. Core Stack

| Warstwa | Technologia | Wersja | Rationale |
|---------|-------------|--------|-----------|
| **Framework** | React | 18.x | Concurrent features, Suspense, Strict Mode |
| **Build Tool** | Vite | 5.x | HMR <100ms, ESM native, tree-shaking |
| **Language** | TypeScript | 5.x | Strict Mode, discriminated unions, type safety |
| **Database** | Dexie.js | 3.2.4 | IndexedDB wrapper, reaktywne zapytania |
| **Styling** | Tailwind CSS | 3.x | Utility-first, purge, dark mode support |
| **Icons** | Lucide React | Latest | Lightweight, consistent, accessible |

---

## 2. Uzasadnienie Wyborów

### 2.1 React 18 + Vite (Frontend)

**Dlaczego nie Create React App?**
```
CRA:          30s+ do startu dev server
Vite:         <500ms do startu dev server
Różnica:      60x szybszy feedback loop
```

**Kluczowe korzyści:**
- ⚡ **Instant HMR** - Zmiana w kodzie widoczna natychmiast (krytyczne dla ADHD - brak czekania)
- 📦 **ESM Native** - Bez bundlingu w dev, bezsource map lagów
- 🌲 **Tree Shaking** - Produkcja: ~50KB vs ~200KB (CRA)

### 2.2 TypeScript Strict Mode

**Konfiguracja:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Wartość dla projektu:**
- 🛡️ **Runtime safety** - Kompilacja wyłapuje 90% bugów przed deploymentem
- 📝 **Self-documenting** - Typy są dokumentacją (przykład: `quadrant: 0 | 1 | 2 | 3 | 4`)
- 🔍 **Refactoring confidence** - Rename symbol bez obawy o silent failures

### 2.3 Dexie.js (IndexedDB Wrapper)

**Dlaczego nie LocalStorage?**
| Cecha | LocalStorage | Dexie.js / IndexedDB |
|-------|--------------|---------------------|
| Limit | 5MB | 50MB-2GB (przeglądarka) |
| Async | ❌ Synchroniczny (blokuje UI) | ✅ Asynchroniczny |
| Struktury | String only | Obiekty, indeksy, klucze |
| Zapytania | Brak | `where()`, `filter()`, `sort()` |
| Transakcje | Brak | ✅ ACID transactions |

**Kluczowe cechy Dexie.js:**
```typescript
// Reaktywne zapytania - UI aktualizuje się automatycznie
const tasks = useLiveQuery(() => 
  db.tasks.where('quadrant').equals(2).toArray()
, []);

// Transakcyjność - atomowe operacje
await db.transaction('rw', db.tasks, async () => {
  await db.tasks.add(newTask);
  await db.tasks.update(oldId, { completed: true });
});
```

### 2.4 Tailwind CSS (Utility-First)

**Dlaczego nie CSS Modules/Sass?**

| Problem | Tailwind Solution |
|---------|-------------------|
| Naming fatigue | `className="flex gap-2 p-4"` - bez myślenia o nazwach |
| Inconsistent spacing | `space-y-4` zawsze = 16px (1rem) |
| Dead CSS | Purge automatycznie usuwa nieużywane klasy |
| Dark mode | `dark:bg-gray-800` - 1 klasa zamiast 20 linii CSS |

**Przykład redukcji kodu:**
```css
/* Tradycyjne CSS - 20 linii */
.task-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: rgba(208, 0, 255, 0.05);
  border: 1px solid #D000FF;
  box-shadow: 0 0 20px rgba(208, 0, 255, 0.3);
}
```
```jsx
// Tailwind - 1 linia
<div className="flex items-center justify-between p-4 bg-[rgba(208,0,255,0.05)] border border-[#D000FF] shadow-[0_0_20px_rgba(208,0,255,0.3)]">
```

### 2.5 Lucide React (Icons)

**Dlaczego nie FontAwesome/Material Icons?**
- 🎯 **Tree-shakeable** - Importujesz tylko używane ikony (`import { Brain } from 'lucide-react'`)
- 🎨 **Consistent design** - Wszystkie ikony mają ten sam stroke width i grid
- ♿ **Accessible** - Wbudowane atrybuty ARIA

---

## 3. Ograniczenia Technologiczne

### 3.1 IndexedDB Quota Limits

| Przeglądarka | Limit | Zmiana |
|--------------|-------|--------|
| Chrome (desktop) | ~80MB | Użytkownik może zwiększyć |
| Chrome (mobile) | ~20MB | Hard limit |
| Safari | ~1GB | Najsłuszniejsze |
| Firefox | ~2GB | Największe |

**Mitigacja:**
- Limit zadań: ~10 000 (średnio 10KB per task z historią)
- Eksport JSON jako backup przed osiągnięciem limitu
- Brak historii wersji (tylko ostatni stan)

### 3.2 Brak Synchronizacji Chmurowej (v1.0.0)

**Ograniczenie celowe:**
```
Wersja 1.0.0: Single device, local only
Wersja 2.0.0: Export/Import JSON (manual sync)
Wersja 3.0.0+: P2P sync (WebRTC) - bez serwerów, bez logowania
```

**Uzasadnienie:** Synchronizacja chmurowa wymaga:
- Serwerów (koszty, maintenance)
- Autentykacji (logowanie = friction dla ADHD)
- Privacy policy / GDPR (złożoność prawna)

### 3.3 Mobile-Only (480px)

**Ograniczenie celowe:**
- Brak responsywności desktopowej (zbyt złożone)
- Brak tabletu/iPad optymalizacji (zbyt mały rynek)
- Focus na **jeden, sprawdzony use case**: telefon w ręku

---

## 4. Konwencje Projektowe

### 4.1 Separacja Logiki od Widoku

**Zasada:** Każdy ekran ma dedykowany **Custom Hook** izolujący logikę biznesową.

```typescript
// ❌ ANTY-WZORZEC: Logika w komponencie
const MatrixScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  // 200+ linii logiki + JSX w jednym pliku
};

// ✅ WZORZEC: Separacja hook / komponent
const useMatrixTasks = () => {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []);
  const groupedTasks = useMemo(() => groupByQuadrant(tasks), [tasks]);
  return { tasks: groupedTasks };
};

const MatrixScreen = () => {
  const { tasks } = useMatrixTasks(); // Czysty komponent UI
  return <div>...</div>;
};
```

### 4.2 Konwencje Nazewnicze (SDD Strict)

| Element | Konwencja | Przykład |
|---------|-----------|----------|
| **Plany** | `PLAN_<feature>.md` | `PLAN_inbox_capture.md` |
| **Komponenty** | PascalCase | `QuizModal.tsx`, `MatrixScreen.tsx` |
| **Hooki** | camelCase, prefix `use` | `useQuizForm.ts`, `useTimer.ts` |
| **Typy** | PascalCase, suffix `Type` | `TaskType`, `QuadrantNumber` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_Q1_TASKS = 5` |
| **Style** | kebab-case w Tailwind | `bg-purple-500`, `shadow-[0_0_20px_rgba(208,0,255,0.3)]` |

### 4.3 Funkcyjne Komponenty React

**Zakazane:**
```typescript
// ❌ Class components
class TimerComponent extends React.Component { }

// ❌ Default exports (utrudnia refaktoring)
export default function QuizModal() { }
```

**Wymagane:**
```typescript
// ✅ Named exports
export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  // Funkcyjny komponent z typowaniem props
};

// ✅ Custom hooks zamiast lifecycle methods
const useTimer = () => {
  useEffect(() => {
    // setup
    return () => {
      // cleanup (zamiast componentWillUnmount)
    };
  }, []);
};
```

### 4.4 Dokumentacja SDD

**Rygorystyczna struktura planów:**
```markdown
# PLAN_<nazwa>.md

## 1. Cel
## 2. Zakres
## 3. Wymagania funkcjonalne
## 4. Wymagania niefunkcjonalne
## 5. Kontekst techniczny
### Komponenty
### API
### Dane
## 6. Kroki implementacji
## 7. Kryteria akceptacji (GIVEN-WHEN-THEN)
## 8. Testy
### Unit
### Integracyjne
```

---

## 5. Development Workflow

### 5.1 Zalecane VS Code Extensions

- **ESLint** - Wymuszanie konwencji kodu
- **Prettier** - Automatyczne formatowanie
- **Tailwind CSS IntelliSense** - Autouzupełnianie klas
- **TypeScript Hero** - Organizacja importów
- **Error Lens** - Inline error highlighting (krytyczne dla ADHD)

### 5.2 Git Hooks (Husky)

```bash
# pre-commit
npm run lint       # ESLint check
npm run type-check # tsc --noEmit
npm run format     # Prettier write
```

### 5.3 Build & Deploy

```bash
# Development
npm run dev        # Vite dev server

# Production
npm run build      # Production bundle
npm run preview    # Preview production build locally
```

---

## 6. Rejected Technologies

| Technologia | Powód Odrzucenia |
|-------------|------------------|
| **Next.js** | SSR niepotrzebny dla offline PWA, overkill |
| **Redux** | Złożoność, Context + Hooks wystarczają |
| **Firebase** | Wymaga sieci, autentykacja = friction |
| **SQLite (via WASM)** | Overkill, Dexie.js prostsze |
| **Sass/SCSS** | Tailwind wystarcza, brak naming fatigue |
| **Styled Components** | Runtime overhead, Tailwind szybszy |

---

**Document ID:** TECH-STACK-001  
**Owner:** Lead Developer  
**Status:** FROZEN (changes require ADR)
