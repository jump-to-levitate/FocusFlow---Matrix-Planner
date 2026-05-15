# FocusFlow 2.0 - Design System

> Single Source of Truth for UI/UX Layer  
> Mobile-First | Neon Glassmorphism | ADHD-Optimized

---

## Metadane

| Pole | Wartość |
|------|---------|
| **Tytuł** | FocusFlow 2.0 Design System |
| **Wersja** | 1.3 |
| **Status** | COMPLETED & STABILIZED |
| **Ostatnia aktualizacja** | 2026-05-15 |
| **Autor** | Senior UI/UX Designer & Frontend Architect |
| **Przegląd** | PLAN_RISK_002 (ADHD ICP validation) |

**Powiązane dokumenty:**
- `docs/tech/conventions.md` - Kodowanie i struktura
- `docs/tech/icons.md` - Ikonografia (Lucide)
- `app/src/constants/colors.ts` - Design Tokens
- `app/tailwind.config.js` - Konfiguracja Tailwind
- `app/src/index.css` - Globalne style

---

## 1. Ograniczenia Fundamentalne (Constraints)

### 1.1 Pro Max Standard (430px Device Frame)

**ZASADA KRYTYCZNA:** Aplikacja jest **WYŁĄCZNIE** Mobile-First z twardym limitem szerokości 430px (iPhone 15 Pro Max / Pixel 8 Pro).

```css
/* AppShell - Pro Max Standard */
.app-shell {
  width: 100%;
  max-width: 430px;        /* TWARDY LIMIT - Pro Max */
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-left: 24px;      /* px-6 = bezpieczna strefa */
  padding-right: 24px;
  background: var(--color-bg); /* #05070A */
}

/* Desktop: fixed device mockup */
@media (min-width: 480px) {
  .app-shell {
    width: 430px;
    height: 932px;           /* Fixed Pro Max height */
    overflow: hidden;
    border-radius: 3.5rem;
    border: 5px solid rgba(255, 255, 255, 0.08);
  }
}

/* Scale fallback for small viewports */
@media (min-width: 480px) and (max-height: 960px) {
  .app-shell {
    transform: scale(calc((100vh - 24px) / 932));
    transform-origin: top center;
  }
}
```

**Zachowanie na różnych urządzeniach:**

| Urządzenie | Szerokość viewportu | Zachowanie AppShell |
|------------|---------------------|---------------------|
| Mobile S | 320px | 100% szerokości, padding 24px |
| Mobile M | 375px | 100% szerokości, padding 24px |
| Mobile L | 414px | 100% szerokości, padding 24px |
| Desktop (≥480px) | 430px | Sztywna ramka 430×932px, wycentrowana |
| Desktop (h<960px) | 430px | `transform: scale()` — proporcjonalne pomniejszenie |

**Dlaczego 430px?**
- Standard flagshipów 2024-2026 (iPhone 15 Pro Max, Pixel 8 Pro)
- Optymalne dla obsługi jedną ręką (thumb zone)
- Wymusza skupienie na core functionality
- ADHD-friendly: mniej clutter = mniej overwhelm
- Wystarczająco duże dla premium desktop mockupu

---

### 1.2 Thumb-First Design

**Definicja:** Wszystkie interakcje primary muszą być dostępne kciukiem bez zmiany uchwytu telefonu.

**Thumb Zone Map:**

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │  ← GÓRA (Secondary actions)
│  │    Logo / Back / Menu       │   │     - Settings
│  └─────────────────────────────┘   │     - Profile
│                                     │     - Info
│  ┌─────────────────────────────┐   │
│  │                             │   │  ← ŚRODEK (Content)
│  │    Scrollable Content       │   │     - Task lists
│  │    (zostaw wolne miejsce    │   │     - Matrix grid
│  │     dla przejrzystości)     │   │     - Quiz
│  │                             │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │  ← DÓŁ (Primary actions)
│  │  [  Primary CTA  ]          │   │     - Add task
│  │  [  Navigation  ]          │   │     - Start timer
│  └─────────────────────────────┘   │     - Save
└─────────────────────────────────────┘
          [Bottom Nav Bar]           ← Nawigacja sticky
```

**Zasady umiejscawiania:**

| Strefa | Elementy | Dostępność |
|--------|----------|------------|
| **Green Zone** (dolna 1/3) | Primary CTA, Bottom Nav, FAB | Kciuk bez wysiłku |
| **Yellow Zone** (środkowa 1/3) | Content, Forms, Lists | Kciuk z lekkim wysiłkiem |
| **Red Zone** (górna 1/3) | Secondary actions, Settings | Wymaga zmiany uchwytu |

**Touch Targets (Apple HIG / Material Design):**

```css
/* Minimalny rozmiar celu dotykowego */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* Rekomendowany dla primary actions */
.touch-target-primary {
  min-width: 48px;
  min-height: 48px;
}

/* Padding dla clickable areas */
.clickable {
  padding: 12px;  /* 44px total dla elementu 20px */
}
```

**Bottom Navigation (Thumb Zone):**

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 430px;
  margin: 0 auto;
  padding: 16px 24px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  
  /* Glassmorphism */
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 2. Paleta Kolorów (Neon Glassmorphism)

### 2.1 Filozofia Kolorystyczna

**Estetyka:** Neon Glassmorphism
- Ciemne, głębokie tło (dark base)
- Przezroczyste, rozmazane warstwy (glass)
- Neonowe akcenty (glowing borders)
- Wysoki kontrast dla ADHD (visual persistence)

### 2.2 Tła (Backgrounds)

| Token | HEX | HSL | Użycie |
|-------|-----|-----|--------|
| **bg-primary** | `#05070A` | Rich Black | Główne tło aplikacji (var(--color-bg)) |
| **bg-elevated** | `#0C1018` | - | Karty, modale (var(--color-bg-elevated)) |
| **bg-outer** | `#020204` | Near Black | Desktop wrapper (.app-outer) |
| **bg-overlay** | `rgba(15,23,42,0.85)` | - | Overlay, modale |

**Gradienty tła (opcjonalne):**
```css
.bg-gradient-dark {
  background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
}
```

### 2.3 Kolory Kwadrantów (Quadrant Accents)

> ZASADA: Każdy kwadrant ma przypisany neonowy kolor - wizualna persystencja dla ADHD.

#### Q1 - Pilne i Ważne (EMERGENCY)
| Token | HEX | HSL | Efekt |
|-------|-----|-----|-------|
| **q1-primary** | `#39FF14` | `hsl(109, 100%, 54%)` | Neon Lime Green |
| **q1-glow** | `rgba(57,255,20,0.6)` | - | Box-shadow glow (20px) |
| **q1-glow-outer** | `rgba(57,255,20,0.15)` | - | Outer glow (50px) |
| **q1-light** | `rgba(57,255,20,0.08)` | - | Tło kart |

**CSS (actual from QuadrantCard.tsx):**
```css
.q1-accent {
  color: #39FF14;
  border-color: #39FF14;
  box-shadow: 0 0 20px rgba(57,255,20,0.6), 0 0 50px rgba(57,255,20,0.15);
}
```

#### Q2 - Nie-pilne i Ważne (GROWTH)
| Token | HEX | HSL | Efekt |
|-------|-----|-----|-------|
| **q2-primary** | `#D000FF` | `hsl(288, 100%, 50%)` | Neon Purple (Intensified) |
| **q2-glow** | `rgba(208,0,255,0.7)` | - | Box-shadow glow (30px) |
| **q2-glow-outer** | `rgba(208,0,255,0.2)` | - | Outer glow (60px) |
| **q2-light** | `rgba(208,0,255,0.10)` | - | Tło kart |

**CSS (actual from QuadrantCard.tsx):**
```css
.q2-accent {
  color: #D000FF;
  border-color: #D000FF;
  box-shadow: 0 0 30px rgba(208,0,255,0.7), 0 0 60px rgba(208,0,255,0.2);
}
```

#### Q3 - Pilne i Nie-ważne (ADMIN)
| Token | HEX | HSL | Efekt |
|-------|-----|-----|-------|
| **q3-primary** | `#FF8C00` | `hsl(33, 100%, 50%)` | Neon Orange |
| **q3-glow** | `rgba(255,140,0,0.6)` | - | Box-shadow glow (20px) |
| **q3-glow-outer** | `rgba(255,140,0,0.15)` | - | Outer glow (50px) |
| **q3-light** | `rgba(255,140,0,0.08)` | - | Tło kart |

**CSS (actual from QuadrantCard.tsx):**
```css
.q3-accent {
  color: #FF8C00;
  border-color: #FF8C00;
  box-shadow: 0 0 20px rgba(255,140,0,0.6), 0 0 50px rgba(255,140,0,0.15);
}
```

#### Q4 - Nie-pilne i Nie-ważne (WASTE)
| Token | HEX | HSL | Efekt |
|-------|-----|-----|-------|
| **q4-primary** | `#64748B` | `hsl(215, 20%, 46%)` | Slate Gray |
| **q4-glow** | `rgba(100,116,139,0.3)` | - | Box-shadow glow |
| **q4-light** | `rgba(100,116,139,0.15)` | - | Tło kart |

**CSS:**
```css
.q4-accent {
  color: #94A3B8;
  border-color: rgba(100, 116, 139, 0.5);
  box-shadow: 0 0 20px rgba(100, 116, 139, 0.3);
}
```

### 2.4 Kolory Tekstu

| Token | HEX | Opacity | Użycie |
|-------|-----|---------|--------|
| **text-primary** | `#FFFFFF` | 100% | Nagłówki, CTA |
| **text-secondary** | `#FFFFFF` | 70% | Body text |
| **text-tertiary** | `#FFFFFF` | 50% | Captions, hints |
| **text-disabled** | `#FFFFFF` | 30% | Disabled state |

### 2.5 Kolory Systemowe (Statusy)

| Token | HEX | Użycie |
|-------|-----|--------|
| **success** | `#39FF14` | Zrobione, sukces |
| **danger** | `#FF4757` | Błąd, usuwanie |
| **warning** | `#FFA502` | Ostrzeżenie, limit |
| **info** | `#00F0FF` | Informacja |

---

## 3. Typografia

### 3.1 Font Family

**Primary Font:** Inter
- Nowoczesny, czytelny, neutralny
- Świetny dla UI (liczby, przyciski)
- Wsparcie dla tabular numbers (liczniki)

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}
```

**Fallback:** System UI font stack

### 3.2 Skala Typograficzna

| Element | Rozmiar | Waga | Line Height | Użycie |
|---------|---------|------|-------------|--------|
| **H1** | 1.5rem (24px) | 700 (Bold) | 1.2 | Tytuł ekranu |
| **H2** | 1.25rem (20px) | 600 (Semi) | 1.3 | Sekcje |
| **H3** | 1.125rem (18px) | 600 (Semi) | 1.4 | Podsekcje |
| **Body** | 1rem (16px) | 400 (Regular) | 1.5 | Tekst główny |
| **Body Small** | 0.875rem (14px) | 400 | 1.5 | Opisy |
| **Caption** | 0.75rem (12px) | 500 (Medium) | 1.4 | Etykiety, badże |
| **Button** | 0.875rem (14px) | 600 | 1 | Przyciski |
| **Nav** | 0.75rem (12px) | 500 | 1 | Bottom nav labels |

**W rem (root 16px):**
```css
.text-h1 { font-size: 1.5rem; font-weight: 700; line-height: 1.2; }
.text-h2 { font-size: 1.25rem; font-weight: 600; line-height: 1.3; }
.text-h3 { font-size: 1.125rem; font-weight: 600; line-height: 1.4; }
.text-body { font-size: 1rem; font-weight: 400; line-height: 1.5; }
.text-small { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }
.text-caption { font-size: 0.75rem; font-weight: 500; line-height: 1.4; }
```

### 3.3 Hierarchia Wizualna

**ADHD UX Consideration:** Nagłówki muszą być natychmiast rozróżnialne.

```
┌─────────────────────────────────────┐
│                                     │
│  FOCUSFLOW                  [Menu]  │  ← Caption (12px) + ikona
│                                     │
│  ┌─────────────────────────────┐  │
│  │ DZISIEJSZY CEL Q1           │  │  ← H2 (20px) + neon accent
│  │                             │  │
│  │ Wykończ raport do 15:00    │  │  ← Body (16px)
│  │ Zaplanuj spotkanie z zespołem│ │
│  │                             │  │
│  └─────────────────────────────┘  │
│                                     │
│  Macierz Eisenhowera          [>]   │  ← H3 (18px)
│                                     │
│  [Q1]  [Q2]                         │  ← Caption (12px) labels
│  [Q3]  [Q4]                         │
│                                     │
└─────────────────────────────────────┘
```

---

## 4. Visual Effects (Glassmorphism)

### 4.1 Filozofia Glassmorphism

**Efekt:** Przezroczyste, rozmazane warstwy na ciemnym tle, przypominające szkło (frosted glass).

**Zastosowanie:**
- Karty zadań (cards)
- Modale, popovery
- Bottom navigation
- Input fields

### 4.2 Specyfikacja CSS

#### Glass Panel (Standard)

```css
.glass-panel {
  /* Tło */
  background-color: rgba(255, 255, 255, 0.08);
  
  /* Rozmycie (backdrop-filter) */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Safari */
  
  /* Obramowanie */
  border: 1px solid rgba(255, 255, 255, 0.15);
  
  /* Zaokrąglenie */
  border-radius: 0.75rem; /* 12px */
  
  /* Cień dla głębi */
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

#### Glass Card (Lighter)

```css
.glass-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem; /* 8px */
}
```

#### Glass Input

```css
.glass-input {
  background-color: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  
  /* Focus state */
  &:focus {
    border-color: rgba(0, 240, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(0, 240, 255, 0.2);
    outline: none;
  }
}
```

### 4.3 Neon Borders (Glowing Effect)

#### Q1 Emergency Glow

```css
.neon-border-q1 {
  border: 1px solid rgba(57, 255, 20, 0.5);
  box-shadow: 
    0 0 10px rgba(57, 255, 20, 0.3),
    0 0 20px rgba(57, 255, 20, 0.2),
    inset 0 0 10px rgba(57, 255, 20, 0.05);
}
```

#### Q2 Growth Glow

```css
.neon-border-q2 {
  border: 1px solid rgba(168, 85, 247, 0.5);
  box-shadow: 
    0 0 10px rgba(168, 85, 247, 0.3),
    0 0 20px rgba(168, 85, 247, 0.2),
    inset 0 0 10px rgba(168, 85, 247, 0.05);
}
```

#### Q3 Admin Glow

```css
.neon-border-q3 {
  border: 1px solid rgba(0, 240, 255, 0.5);
  box-shadow: 
    0 0 10px rgba(0, 240, 255, 0.3),
    0 0 20px rgba(0, 240, 255, 0.2),
    inset 0 0 10px rgba(0, 240, 255, 0.05);
}
```

### 4.4 Gradient Accents

**Gradientowe teksty (headlines):**

```css
.text-gradient-neon {
  background: linear-gradient(90deg, #39FF14, #00F0FF, #A855F7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-cyan {
  background: linear-gradient(90deg, #00F0FF, #00D4FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 5. Ikonografia

### 5.1 Biblioteka: Lucide React

**Wybór:** Lucide React (zamiast FontAwesome, Heroicons)
- Styl: Line icons (cienkie linie)
- Spójność: Wszystkie ikony z tego samego zestawu
- Lekkość: Tree-shakeable, minimalny bundle
- Dostępność: Wbudowane atrybuty ARIA

### 5.2 Styl Ikon

| Właściwość | Wartość |
|------------|---------|
| **Typ** | Line icons (outline) |
| **Stroke Width** | 1.5px (ZASADA KRYTYCZNA) |
| **Rozmiar domyślny** | 24px |
| **Rozmiar small** | 20px |
| **Rozmiar large** | 32px |
| **Rozmiar XL** | 48px |

**ZAKAZANE:**
- ❌ Mieszanie Lucide z innymi bibliotekami
- ❌ Solid fill icons (nie pasują do glassmorphism)
- ❌ Różne stroke-width w tym samym UI

### 5.3 Mapowanie Funkcji → Ikony

| Funkcja | Ikona Lucide | Strona PDF |
|---------|--------------|------------|
| Pulpit | `Home` | 15 |
| Macierz | `LayoutGrid` | 16 |
| Brain Dump | `Brain` | 7 |
| Timer | `Timer` | 6 |
| Kalendarz | `CalendarDays` | 5 |
| Opcje | `MoreVertical` | 17 |
| Q1 (Pilne) | `Flame` | 19 |
| Q2 (Ważne) | `TrendingUp` | 10 |
| Zrobione | `CheckCircle2` | 24 |
| Usuń | `Trash2` | 24 |
| Dodaj | `Plus` | - |
| Edytuj | `Pencil` | 17 |
| Powrót | `ChevronLeft` | - |
| Zamknij | `X` | - |

### 5.4 Kolorystyka Ikon

Ikony przejmują kolory z palety kwadrantów:

```tsx
// Q1 task icon
<Flame size={24} strokeWidth={1.5} className="text-q1" />

// Q2 task icon
<TrendingUp size={24} strokeWidth={1.5} className="text-q2" />

// Success action
<CheckCircle2 size={20} strokeWidth={1.5} className="text-status-success" />

// Danger action
<Trash2 size={20} strokeWidth={1.5} className="text-status-danger" />
```

---

## 6. Zasady Interakcji (Micro-interactions)

### 6.1 Gesty Mobile

**Swipe Gestures:**

```
┌─────────────────────────────────────┐
│  [← Swipe]  Task Name  [Swipe →]   │
│                                     │
│  Left swipe: Complete (✓)           │
│  Right swipe: Delete (🗑)           │
└─────────────────────────────────────┘
```

| Gest | Akcja | Feedback |
|------|-------|----------|
| **Swipe Left** | Oznacz jako zrobione | Zielone tło + check icon |
| **Swipe Right** | Usuń / Archiwizuj | Czerwone tło + trash icon |
| **Long Press** | Menu kontekstowe | Haptic + scale effect |
| **Pull Down** | Refresh / Sync | Spinner + haptic |
| **Tap** | Select / Open | Immediate visual feedback |

### 6.2 Czasy Animacji

| Typ interakcji | Czas | Easing |
|----------------|------|--------|
| **Instant feedback** | 0ms | - |
| **Micro (button press)** | 150ms | ease-out |
| **Standard (transitions)** | 200ms | ease-in-out |
| **Emphasis (page transitions)** | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |

**CSS:**
```css
/* Button press */
.btn:active {
  transform: scale(0.98);
  transition: transform 150ms ease-out;
}

/* Standard transition */
.card {
  transition: all 200ms ease-in-out;
}

/* Page enter */
.page-enter {
  animation: slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 6.3 Animacje (ADHD-Friendly)

#### Fade In

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
```

#### Slide Up

```css
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}
```

#### Scale In (modals)

```css
@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
```

#### Bounce Subtle (attention)

```css
@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce {
  animation: bounceSubtle 0.5s ease-in-out;
}
```

#### Pulse Glow (active state)

```css
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(0, 240, 255, 0.5); }
}

.animate-pulse-glow {
  animation: pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 6.4 Feedback Hapticzny (Vibration)

**Web Vibration API:**

```typescript
// Success feedback
navigator.vibrate?.(50);  // 50ms tick

// Error/Delete
navigator.vibrate?.([30, 50, 30]);  // Pattern: short, pause, short

// Long press confirmation
navigator.vibrate?.(100);  // 100ms sustained
```

### 6.5 Loading States

**Skeleton Loading (preferowane nad spinner):**

```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Spinner (tylko dla długich operacji >1s):**

```tsx
<Loader2 size={24} className="animate-spin text-neon-cyan" />
```

---

## 7. Komponenty Podstawowe

### 7.1 Button Variants

#### Primary Button

```tsx
<button className="
  px-4 py-2.5 
  bg-neon-cyan 
  text-slate-900 
  font-semibold 
  rounded-lg
  transition-all duration-200
  hover:bg-neon-cyan/80
  hover:shadow-neon-cyan
  active:scale-[0.98]
">
  Primary Action
</button>
```

#### Secondary Button (Glass)

```tsx
<button className="
  px-4 py-2.5 
  bg-white/[0.1] 
  text-white 
  font-medium 
  rounded-lg
  border border-white/[0.2]
  transition-all duration-200
  hover:bg-white/[0.15]
  active:scale-[0.98]
">
  Secondary
</button>
```

#### Ghost Button

```tsx
<button className="
  px-4 py-2.5 
  text-white/70 
  font-medium 
  rounded-lg
  transition-all duration-200
  hover:text-white
  hover:bg-white/[0.08]
">
  Ghost
</button>
```

### 7.2 Card Variants

#### Task Card (Quadrant-specific)

```tsx
// Q1 Card
<div className="
  glass-card
  border-l-4 border-l-q1
  bg-gradient-to-r from-q1/10 to-transparent
">
  <div className="p-4">
    <h3 className="text-body font-medium text-white">Task name</h3>
    <p className="text-small text-white/50 mt-1">Due: Today</p>
  </div>
</div>
```

### 7.3 Input Field

```tsx
<input 
  type="text"
  placeholder="Dodaj zadanie..."
  className="
    w-full
    glass-input
    text-white
    placeholder-white/40
  "
/>
```

---

## 8. Responsywność (Mobile-Only)

### 8.1 Breakpoints

**ZASADA:** Mobile-first = domyślny styl jest mobile, `md:` dla desktop enhancements.

```css
/* Mobile (default) */
.class { /* mobile styles */ }

/* Tablet and up (rarely used) */
@media (min-width: 768px) {
  .class { /* tablet/desktop tweaks */ }
}
```

**Ale dla FocusFlow:**
- **NIE** używamy breakpointów do zmiany layoutu
- **430px to TWARDY LIMIT** (Pro Max Standard) - aplikacja nigdy nie rozciąga się szerzej
- Desktop = sztywna ramka 430×932px, `transform: scale()` na małych ekranach

### 8.2 Safe Areas (Notched Phones)

```css
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.app-shell {
  padding-top: max(24px, env(safe-area-inset-top));
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}
```

---

## 9. Dostępność (Accessibility)

### 9.1 Kontrast

| Element | Wymagany kontrast | Rzeczywisty |
|---------|-------------------|-------------|
| Text primary (#FFF) na bg (#0F172A) | 4.5:1 | 16.8:1 ✅ |
| Neon text (#39FF14) na bg | 3:1 | 12.4:1 ✅ |
| Secondary text (70%) | 4.5:1 | 11.2:1 ✅ |

### 9.2 Focus Indicators

```css
*:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: rgba(0, 240, 255, 0.5);
  ring-offset: 2px;
  ring-offset-color: #0F172A;
}
```

### 9.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Checklist Implementacji

Przed wdrożeniem komponentu, sprawdź:

### Visual
- [ ] Czy użyto kolorów z `colors.ts` (brak twardych HEX)?
- [ ] Czy zastosowano `strokeWidth={1.5}` dla ikon?
- [ ] Czy glassmorphism ma `backdrop-blur` i `bg-white/[0.08]`?
- [ ] Czy Q1-Q4 mają odpowiednie neonowe akcenty?

### Layout
- [ ] Czy komponent jest wewnątrz `.app-shell` (480px)?
- [ ] Czy touch targets są min. 44×44px?
- [ ] Czy primary actions są w dolnej 1/3 ekranu?

### Interakcje
- [ ] Czy animacje trwają max 300ms?
- [ ] Czy jest `active:scale-[0.98]` dla przycisków?
- [ ] Czy jest haptic feedback dla critical actions?
- [ ] Czy loading states są skeleton (nie spinner)?

### ADHD UX
- [ ] Czy flow ma max 3 kliknięcia?
- [ ] Czy kluczowe info jest zawsze widoczne?
- [ ] Czy są clear CTA (wiadomo co robić)?
- [ ] Czy nie ma decision paralysis (max 3-4 opcje)?

---

## Historia Wersji

| Data | Wersja | Zmiany |
|------|--------|--------|
| 2026-05-15 | 1.3 | Pro Max Specification Freeze — 430×932px, Q2=#D000FF, Q3=#FF8C00, px-6, actual glow values |
| 2026-05-14 | 1.0 | Initial Design System definition |

---

**Next Steps:**
- [ ] Create Figma design library z tymi tokenami
- [ ] Storybook dla komponentów
- [ ] `/WF UX` workflow integration

