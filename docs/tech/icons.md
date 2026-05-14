# Standard Ikon - FocusFlow 2.0

> Single Source of Truth dla ikonografii w projekcie FocusFlow 2.0
> Biblioteka bazowa: [Lucide React](https://lucide.dev/)

---

## 1. Wybór Biblioteki

### Lucide React

**Dlaczego Lucide?**
- **Lekkość** - minimalistyczne, cienkie linie pasujące do estetyki Neon Glassmorphism
- **Spójność** - wszystkie ikony mają tą samą stylistykę (stroke-based)
- **Dostępność** - wbudowane atrybuty ARIA
- **Rozmiar** - tree-shakeable, importuj tylko używane ikony
- **React Native ready** - możliwość migracji na mobile native w przyszłości

**Alternatywy odrzucone:**
- FontAwesome (zbyt "ciężkie", solid fill nie pasuje do glassmorphism)
- Heroicons (OK, ale Lucide ma lepszy coverage)
- Material Icons (zbyt "Google'owe", nie pasuje do neon aesthetic)
- Custom icons (kosztowne, trudne w utrzymaniu dla solo-dev)

---

## 2. Mapowanie Ikon (PDF → Lucide)

### Nawigacja Główna (Bottom Tab Bar)

| Funkcja | PDF Strona | Ikona Lucide | Nazwa Importu | Użycie |
|---------|------------|--------------|---------------|--------|
| **Pulpit (Dashboard)** | Str. 15 | `Home` | `Home` | Główny ekran, aktualny cel Q1 |
| **Macierz** | Str. 16 | `LayoutGrid` | `LayoutGrid` | Widok 2x2 Eisenhower Matrix |
| **Wszystko na dzisiaj** | Str. 5 | `CalendarDays` | `CalendarDays` | Linearny plan dnia |
| **Brain Dump** | Str. 7 | `Brain` | `Brain` | Szybki capture pomysłów |
| **Timer** | Str. 6 | `Timer` | `Timer` | Focus Timer / Pomodoro |

### Nawigacja Sekundarna (Top Bar / Floating)

| Funkcja | PDF Strona | Ikona Lucide | Nazwa Importu | Użycie |
|---------|------------|--------------|---------------|--------|
| **Menu / Opcje** | Str. 17 | `MoreVertical` | `MoreVertical` | Menu kontekstowe, 3-dot |
| **Ustawienia** | Str. 19 | `Settings` | `Settings` | Settings gear icon |
| **Profil / Konto** | Str. 15 | `User` | `User` | User profile / avatar placeholder |
| **Powrót** | Global | `ChevronLeft` | `ChevronLeft` | Back navigation |
| **Zamknij** | Global | `X` | `X` | Close modal/popover |

### Akcje na Zadaniach (Context Menu)

| Akcja | PDF Strona | Ikona Lucide | Nazwa Importu | Użycie |
|-------|------------|--------------|---------------|--------|
| **Edytuj** | Str. 17 | `Pencil` | `Pencil` | Edit task details |
| **Usuń / Odrzuć** | Str. 24 | `Trash2` | `Trash2` | Delete / Discard task |
| **Przywróć** | Str. 24 | `RotateCcw` | `RotateCcw` | Restore from archive |
| **Przenieś** | Str. 17 | `ArrowRightLeft` | `ArrowRightLeft` | Move to different quadrant |
| **Dodaj notatkę** | Str. 17 | `StickyNote` | `StickyNote` | Add linked note |
| **Uruchom Timer** | Str. 17 | `Play` | `Play` | Start focus session |
| **Zrobione** | Str. 24 | `CheckCircle2` | `CheckCircle2` | Mark complete |
| **Archiwizuj** | Str. 8 | `Archive` | `Archive` | Move to Q4 / Archive |
| **Przypnij** | Str. 15 | `Pin` | `Pin` | Pin to dashboard |

### Quiz & Klasyfikacja (Smart Quiz)

| Funkcja | PDF Strona | Ikona Lucide | Nazwa Importu | Użycie |
|---------|------------|--------------|---------------|--------|
| **Ważność (Important)** | Str. 18 | `Target` | `Target` | "Przybliża do celu?" |
| **Pilność (Urgent)** | Str. 18 | `AlarmClock` | `AlarmClock` | "Masz twardy termin?" |
| **Cel / Goal** | Str. 18 | `Flag` | `Flag` | Long-term goal indicator |
| **Decyzja Tak** | Str. 18 | `Check` | `Check` | Yes / Confirm |
| **Decyzja Nie** | Str. 18 | `X` | `X` | No / Reject |
| **Niepewność** | Str. 18 | `HelpCircle` | `HelpCircle` | "Nie wiem" option |

### Ćwiartki (Quadrant Indicators)

| Ćwiartka | PDF Strona | Ikona Lucide | Nazwa Importu | Użycie |
|----------|------------|--------------|---------------|--------|
| **Q1 (Pilne/Ważne)** | Str. 19 | `Flame` | `Flame` | Fire / Emergency |
| **Q2 (Ważne)** | Str. 10 | `TrendingUp` | `TrendingUp` | Growth / Investment |
| **Q3 (Pilne)** | Str. 8 | `AlertCircle` | `AlertCircle` | Admin / Interruptions |
| **Q4 (Nie-ważne)** | Str. 9 | `Coffee` | `Coffee` | Waste / Breaks |
| **Limit Q1** | Str. 19 | `ShieldAlert` | `ShieldAlert` | Overload protection |

### Subkategorie Q2 (Growth Zone)

| Subkategoria | Ikona Lucide | Nazwa Importu | Użycie |
|--------------|--------------|---------------|--------|
| **Routine** | `Repeat` | `Repeat` | Daily habits |
| **Project** | `FolderKanban` | `FolderKanban` | Project tasks |
| **Other** | `MoreHorizontal` | `MoreHorizontal` | Uncategorized |

### Subkategorie Q3 (Proza Życia)

| Subkategoria | Ikona Lucide | Nazwa Importu | Użycie |
|--------------|--------------|---------------|--------|
| **Do Now** | `Zap` | `Zap` | Quick <10min |
| **Planned Block** | `CalendarClock` | `CalendarClock` | Scheduled block |
| **On Break** | `PauseCircle` | `PauseCircle` | During breaks |

### Subkategorie Q4 (Nie teraz)

| Subkategoria | Ikona Lucide | Nazwa Importu | Użycie |
|--------------|--------------|---------------|--------|
| **Entertainment** | `Gamepad2` | `Gamepad2` | Fun / Games |
| **Side Quest** | `Compass` | `Compass` | Side projects |
| **Hobby** | `Palette` | `Palette` | Creative hobbies |
| **Optimization** | `Wrench` | `Wrench` | Improvements |

### Notatki (Notes System)

| Funkcja | PDF Strona | Ikona Lucide | Nazwa Importu | Użycie |
|---------|------------|--------------|---------------|--------|
| **Nowa notatka** | Str. 7 | `Plus` | `Plus` | Add new note |
| **Notatka tekstowa** | Str. 7 | `Type` | `Type` | Text note |
| **Notatka głosowa** | Str. 7 | `Mic` | `Mic` | Voice memo |
| **Link / URL** | Str. 7 | `Link` | `Link` | Attach link |
| **Załącznik** | Str. 7 | `Paperclip` | `Paperclip` | File attachment |
| **Wyszukaj** | Str. 7 | `Search` | `Search` | Search notes |
| **Tag** | Str. 7 | `Tag` | `Tag` | Note tagging |

### System & Informacyjne

| Funkcja | Ikona Lucide | Nazwa Importu | Użycie |
|---------|--------------|---------------|--------|
| **Info / Pomoc** | `Info` | `Info` | Information tooltip |
| **Ostrzeżenie** | `AlertTriangle` | `AlertTriangle` | Warning / Limit |
| **Sukces** | `CheckCircle` | `CheckCircle` | Success feedback |
| **Błąd** | `XCircle` | `XCircle` | Error state |
| **Ładowanie** | `Loader2` | `Loader2` | Loading spinner |
| **Offline** | `WifiOff` | `WifiOff` | Offline indicator |
| **Bateria / Energia** | `Battery` | `Battery` | Focus energy metaphor |
| **Zapisz** | `Save` | `Save` | Save action |
| **Eksport** | `Download` | `Download` | Export data |
| **Import** | `Upload` | `Upload` | Import data |
| **Kopiuj** | `Copy` | `Copy` | Copy to clipboard |
| **Udostępnij** | `Share2` | `Share2` | Share (future feature) |

---

## 3. Zasady Użycia

### 3.1 Stroke Width (Grubość Linii)

**ZASADA KRYTYCZNA:** Wszystkie ikony MUSZĄ używać `strokeWidth={1.5}`

```tsx
// ✅ POPRAWNE
import { Home } from 'lucide-react';
<Home size={24} strokeWidth={1.5} />

// ❌ ZAKAZANE - inna grubość
<Home size={24} strokeWidth={2} />    // Za grube
<Home size={24} strokeWidth={1} />    // Za cienkie
<Home size={24} />                     // Domyślna (2) - NIE DOzwolona!
```

**Dlaczego 1.5?**
- 1.0 - zbyt cienkie, trudne do zobaczenia na ciemnym tle
- 2.0 (domyślne) - zbyt "ciężkie", kłóci się z glassmorphism
- 1.5 - optymalne, lekkie, eleganckie, spójne z neon aesthetic

### 3.2 Rozmiary Ikon

| Rozmiar | Wartość | Użycie |
|---------|---------|--------|
| **XS** | 16px (size={16}) | Inline text, badges |
| **S** | 20px (size={20}) | Buttons, inputs |
| **M** | 24px (size={24}) | **Domyślny**, navigation, cards |
| **L** | 32px (size={32}) | Empty states, hero icons |
| **XL** | 48px (size={48}) | Feature highlights |

```tsx
// Standardowe użycie
<LayoutGrid size={24} strokeWidth={1.5} />

// Mniejsze w buttonie
<Plus size={20} strokeWidth={1.5} />

// Większe w empty state
<Brain size={48} strokeWidth={1.5} className="text-neon-cyan" />
```

### 3.3 Kolorystyka

**ZASADA:** Ikony przejmują kolory z `colors.ts` - NIE używamy twardych kolorów!

```tsx
// ✅ POPRAWNE - z colors.ts
import { COLORS } from '@/constants/colors';
import { Flame } from 'lucide-react';

<Flame 
  size={24} 
  strokeWidth={1.5} 
  style={{ color: COLORS.quadrants.q1.base }}  // #39FF14
/>

// Lub przez Tailwind utility
<Flame className="text-q1" size={24} strokeWidth={1.5} />
```

#### Mapowanie Kolorów Ikony → Quadrant

| Kontekst | Kolor Ikony | Token colors.ts |
|----------|-------------|-----------------|
| **Q1 Task** | Neon Lime Green | `COLORS.quadrants.q1.base` / `text-q1` |
| **Q2 Task** | Neon Purple | `COLORS.quadrants.q2.base` / `text-q2` |
| **Q3 Task** | Neon Cyan | `COLORS.quadrants.q3.base` / `text-q3` |
| **Q4 Task** | Slate Gray | `COLORS.quadrants.q4.base` / `text-q4` |
| **Success** | Lime | `COLORS.brand.tertiary` / `text-neon-lime` |
| **Danger** | Red | `COLORS.brand.danger` / `text-red-500` |
| **Warning** | Orange | `COLORS.status.warning` |
| **Info** | Cyan | `COLORS.brand.primary` / `text-neon-cyan` |
| **Neutral** | White/70% | `COLORS.text.secondary` / `text-white/70` |
| **Disabled** | White/40% | `COLORS.text.tertiary` / `text-white/40` |

### 3.4 Accessibility

**Wymagane atrybuty ARIA:**

```tsx
// Ikona dekoracyjna (nie klikalna)
<Home 
  size={24} 
  strokeWidth={1.5} 
  aria-hidden="true"  // Ukryj przed screen reader
/>

// Ikona interaktywna (button)
<button aria-label="Powrót do pulpitu">
  <Home size={24} strokeWidth={1.5} aria-hidden="true" />
</button>

// Ikona z etykietą tekstową
<div className="flex items-center gap-2">
  <Brain size={20} strokeWidth={1.5} aria-hidden="true" />
  <span>Brain Dump</span>
</div>
```

---

## 4. Helper Component (Rekomendowane)

### IconWrapper

Aby ułatwić spójne użycie, utwórz wrapper component:

```tsx
// components/Icon.tsx
import { LucideIcon } from 'lucide-react';
import { COLORS } from '@/constants/colors';

interface IconProps {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: keyof typeof COLORS.quadrants | keyof typeof COLORS.status | string;
  className?: string;
}

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

export function Icon({ 
  icon: LucideIcon, 
  size = 'md', 
  color,
  className 
}: IconProps) {
  return (
    <LucideIcon 
      size={sizeMap[size]} 
      strokeWidth={1.5}
      className={className}
      style={color ? { color } : undefined}
    />
  );
}

// Użycie:
import { LayoutGrid, Flame } from 'lucide-react';

<Icon icon={LayoutGrid} size="md" color={COLORS.quadrants.q1.base} />
<Icon icon={Flame} size="lg" color={COLORS.quadrants.q1.base} />
```

---

## 5. Anty-wzorce (Czego NIE ROBIĆ)

### ❌ Mieszanie bibliotek

```tsx
// ZAKAZANE - mieszanie Lucide z innymi
import { Home } from 'lucide-react';
import { FaBeer } from 'react-icons/fa';  // ❌ INNA BIBLIOTEKA!

<div>
  <Home size={24} strokeWidth={1.5} />
  <FaBeer />  {/* ❌ Nie pasuje stylistycznie! */}
</div>
```

### ❌ Różne strokeWidth w tym samym UI

```tsx
// ZAKAZANE - niespójne grubości
<div className="flex gap-2">
  <Home size={24} strokeWidth={1.5} />      {/* ✅ */}
  <Settings size={24} strokeWidth={2} />    {/* ❌ */}
  <User size={24} strokeWidth={1} />        {/* ❌ */}
</div>
```

### ❌ Twardokodowane kolory

```tsx
// ZAKAZANE - kolory poza colors.ts
<Flame size={24} strokeWidth={1.5} color="#FF0000" />  {/* ❌ */}
<Flame size={24} strokeWidth={1.5} className="text-red-500" />  {/* ❌ użyj text-q1 */}
```

### ❌ Zbyt duże ikony w gęstym UI

```tsx
// ZAKAZANE - za duże na liście zadań
<div className="task-item">
  <CheckCircle2 size={48} strokeWidth={1.5} />  {/* ❌ */}
  <span>Task name</span>
</div>

// POPRAWNE
<div className="task-item">
  <CheckCircle2 size={20} strokeWidth={1.5} />  {/* ✅ */}
  <span>Task name</span>
</div>
```

---

## 6. Szybka Referencja (Quick Cheat Sheet)

### Najczęściej używane importy:

```tsx
import {
  // Navigation
  Home,
  LayoutGrid,
  CalendarDays,
  Brain,
  Timer,
  ChevronLeft,
  
  // Actions
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  MoreVertical,
  
  // Quadrants
  Flame,
  TrendingUp,
  AlertCircle,
  Coffee,
  
  // System
  Settings,
  Info,
  Search,
} from 'lucide-react';
```

### Mapowanie Feature → Icon (One-liner):

```tsx
const ICONS = {
  dashboard: Home,
  matrix: LayoutGrid,
  today: CalendarDays,
  brainDump: Brain,
  timer: Timer,
  q1: Flame,
  q2: TrendingUp,
  q3: AlertCircle,
  q4: Coffee,
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  complete: CheckCircle2,
  menu: MoreVertical,
} as const;
```

---

## 7. Integracja z `/WF UX` Workflow

Podczas audytu UX (`/WF UX`), sprawdzaj:

- [ ] Czy wszystkie ikony są z Lucide?
- [ ] Czy wszystkie mają `strokeWidth={1.5}`?
- [ ] Czy kolory pochodzą z `colors.ts`?
- [ ] Czy rozmiary są zgodne z tabelą (XS/S/M/L/XL)?
- [ ] Czy atrybuty ARIA są poprawne?

---

## Historia Wersji

| Data | Wersja | Zmiany |
|------|--------|--------|
| 2026-05-14 | 1.0 | Initial icon standardization |

---

**Powiązane dokumenty:**
- `docs/tech/conventions.md` - Ogólne konwencje (kolory)
- `docs/tech/stack.md` - Stack technologiczny (Lucide)
- `docs/plans/PLAN_000_repository_setup.md` - Instalacja Lucide

