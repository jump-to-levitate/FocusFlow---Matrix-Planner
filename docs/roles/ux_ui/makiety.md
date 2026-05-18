# Specyfikacja Makiet i Tokenów Wizualnych

> Mockup & Design Tokens Specification  
> Document ID: UX-MOCKUPS-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Principal Product Designer

---

## 1. Układ Siatki (Grid System)

### 1.1 Grid Core - Główna Macierz Q1-Q4 (430px Pro Max Standard)

**Krytyczna Zasada:** Wszystkie odniesienia do szerokości viewportu są zsynchronizowane z `design-system.md` i wynoszą sztywne **430px** (Pro Max Standard).

```
┌─────────────────────────────────────────┐
│              430px width                │  ← max-w-[430px] (Pro Max Standard)
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┬─────────────┐         │
│  │      │      │             │ 215px   │  ← h-[215px] dla symmetry
│  │  Q1  │  Q2  │    (flex)   │ height  │
│  │ 🔥   │ 📅   │             │         │
│  │      │      │             │         │
│  ├──────┴──────┼─────────────┤         │
│  │      │      │             │         │
│  │  Q3  │  Q4  │    (flex)   │         │
│  │ ⚙️   │ 📦   │             │         │
│  │      │      │             │         │
│  └─────────────┴─────────────┘         │
│                                         │
│       Mobile: Stack (1 column)           │
│                                         │
└─────────────────────────────────────────┘
```

**Klasy Tailwind:**
```css
/* Desktop */
max-w-[430px] mx-auto  /* iPhone 14/15 Pro Max */
grid grid-cols-2 gap-3  /* 12px gap */
p-3  /* 12px padding */

/* Mobile */
grid grid-cols-1 gap-2  /* 8px gap */
```

### 1.2 Sub-Matrix 2x2 (Centrum Planowania Q2)

Identyczny layout jak główna Macierz (znajomy wzorzec, mniejsza skala):

```
┌─────────────────────────────────────────┐
│     Centrum Planowania (Q2)             │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┬─────────────┐         │
│  │  RUTYNY 🔄  │ PROJEKTY 📁│         │
│  │  (purple)   │  (green)   │         │
│  ├─────────────┼─────────────┤         │
│  │ OGÓLNE CELE│   INNE 💼   │         │
│  │  (green)   │  (purple)   │         │
│  └─────────────┴─────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

**Symetria Zwierciadlana:**
- Q2 sub-matryca jest **fizycznym zwierciadłem** głównej Macierzy 2x2
- To redukuje zmęczenie poznawcze (cognitive load) - znajomy wzorzec

### 1.3 Sub-Matrix 2x2 (Hub Logistyki Q3)

```
┌─────────────────────────────────────────┐
│        Hub Logistyki (Q3)               │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┬─────────────┐         │
│  │ ZRÓB TERAZ │ ZAPLANUJ    │         │
│  │   🚀      │   📁       │         │
│  │ (orange)   │ (orange)   │         │
│  ├─────────────┼─────────────┤         │
│  │ W PRZERWIE │   INNE      │         │
│  │   🔄      │   💼       │         │
│  │  (cyan)    │  (cyan)     │         │
│  └─────────────┴─────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

**Kolorystyka Q3:** Pomarańcz (#FF8C00) / Cyjan (#00E5FF) - neurostymulacja dla prozy życia

### 1.4 Sub-Matrix 2x2 (Archiwum Q4)

```
┌─────────────────────────────────────────┐
│     Archiwum "Nie Teraz" (Q4)           │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┬─────────────┐         │
│  │ ROZRYWKA  │   HOBBY     │         │
│  │   🎮      │   🎨       │         │
│  │(silver)   │ (silver)   │         │
│  ├─────────────┼─────────────┤         │
│  │OPTMALIZACJA│ SIDE-QUEST │         │
│  │   ⚙️      │   🗺️       │         │
│  │(silver)   │ (silver)   │         │
│  └─────────────┴─────────────┘         │
│                                         │
│  [⚠️ ODRZUĆ / ZAPOMNIJ]                 │  ← Destructive Hatch
│                                         │
└─────────────────────────────────────────┘
```

**Kolorystyka Q4:** Matte Silver (#94A3B8) - wybalansowana jasność niegasząca innych neonów

---

## 2. Chirurgiczna Precyzja Wysokości (Header h-14)

### 2.1 Sztywna Wysokość Nagłówków

**Zasada:** Wszystkie nagłówki w sub-matrycy mają **identyczną, sztywną wysokość**.

| Element | Klasa Tailwind | Wartość | Uzasadnienie |
|---------|----------------|---------|--------------|
| **Header Height** | `h-14` | 56px | Uniform alignment |
| **Vertical Center** | `items-center` | - | Wyrównanie ikony i tekstu |
| **Horizontal Spread** | `justify-between` | - | Tytuł vs licznik |
| **Text Overflow** | `whitespace-nowrap` | - | Zapobieganie łamaniu słów |
| **Leading** | `leading-none` | 0 | Precyzyjne centrowanie tekstu |

### 2.2 Implementacja Nagłówka Sub-Matrycy

```tsx
<div className="h-14 flex items-center justify-between px-3 border-b border-[#D000FF] bg-[rgba(208,0,255,0.15)]">
  <div className="flex items-center gap-2">
    <span className="text-xl">🔄</span>
    <h3 className="text-xs font-bold uppercase whitespace-nowrap leading-none">Rutyny</h3>
  </div>
  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#D000FF]/20">
    {count}
  </span>
</div>
```

### 2.3 Uniform Alignment - Diagram

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🔄 Rutyny                    [12]  │ │  ← h-14 = 56px
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ 📁 Projekty                    [5]   │ │  ← h-14 = 56px
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ 🎯 Cele                        [3]   │ │  ← h-14 = 56px
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ 💼 Inne                        [8]   │ │  ← h-14 = 56px
│  └───────────────────────────────────────┘ │
│                                             │
│  Wszystkie nagłówki IDENTYCZNEJ wysokości │
│  Uniform alignment zapobiega "skakaniu"   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 3. Paleta Neonowa (Laser Glow Aesthetic)

### 3.1 Tokeny Kolorów

| Token | HEX | Zastosowanie | Glow Effect |
|-------|-----|--------------|-------------|
| `--neon-lime` | `#39FF14` | Q1 (Urgent/Important), timer running | `0 0 20px rgba(57,255,20,0.6)` |
| `--neon-fuchsia` | `#D000FF` | Q2 headers, paused state | `0 0 30px rgba(208,0,255,0.7)` |
| `--neon-orange` | `#FF8C00` | Q3 headers, logistyka | `0 0 25px rgba(255,140,0,0.6)` |
| `--neon-cyan` | `#00E5FF` | Q3 accents, Q4 highlights | `0 0 15px rgba(0,229,255,0.5)` |
| `--neon-silver` | `#94A3B8` | Q4 headers, archiwum | `0 0 15px rgba(148,163,184,0.35)` |
| `--bg-dark` | `#0a0a0f` | Background | - |
| `--bg-card` | `rgba(255,255,255,0.05)` | Card backgrounds | - |

### 3.2 Laser Border (Sharp Glow)

**Krytyczna Zasada:** Ostre, laserowe krawędzie (nie mgliste rozmycie):

```css
/* Ostry, laserowy neon (nie mgliste rozmycie) */
border: 1px solid #D000FF;
box-shadow: 
  0 0 30px rgba(208,0,255,0.7),    /* outer glow - intensywny */
  0 0 60px rgba(208,0,255,0.2),    /* extended glow - subtelny */
  inset 0 0 20px rgba(208,0,255,0.1); /* inner subtle glow */
```

### 3.3 Usunięte Efekty "Mgliste"

- ❌ `backdrop-blur` (rozmywa ostrość)
- ❌ `shadow-2xl` z szerokim rozmyciem
- ❌ Multiple overlapping shadows bez celu
- ❌ Gradient backgrounds (zbyt "soft")
- ❌ Glassmorphism (niewidoczne dla ADHD)

### 3.4 Hierarchia Wizualna

```
┌─────────────────────────────────────────────────────────┐
│                    HIERARCHIA NEONÓW                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   🔥 Q1  ────────  #39FF14 (Lime)                       │
│         │                                               │
│         │  Najbardziej "gorący" - natychmiastowa uwaga  │
│         │                                               │
│   📅 Q2  ────────  #D000FF (Fuchsia)                    │
│         │                                               │
│         │  Planowanie - ważne ale nie pilne              │
│         │                                               │
│   ⚙️ Q3  ────────  #FF8C00 (Orange)                     │
│         │                                               │
│         │  Logistyka - neurostymulacja dla prozy        │
│         │                                               │
│   📦 Q4  ────────  #94A3B8 (Silver)                   │
│         │                                               │
│         │  Chłodny kolor = niższy priorytet            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Viewport Constraint (430px Pro Max Standard)

### 4.1 Synchronizacja z design-system.md

| Dokument | Viewport | Uzasadnienie |
|----------|----------|--------------|
| `makiety.md` (niniejszy) | **430px** | Pro Max Standard |
| `design-system.md` | **430px** | SSOT dla viewport |
| `readme.md` | **430px** | Referencja do SSOT |

**Historia zmiany:**
- Stara wartość: 480px (stary standard z design v1)
- Nowa wartość: 430px (Pro Max Standard, iPhone 14/15 Pro Max)

### 4.2 Tailwind Implementation

```tsx
// Kontener główny aplikacji
<div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0f]">
  {/* Cała aplikacja mieści się w 430px */}
</div>
```

### 4.3 Thumb Zone (Ergonomia)

```
┌─────────────────────────────────────────┐
│            430px WIDTH                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │    REACHABLE ZONE (kciuk)      │   │
│  │    ┌─────────────────────┐     │   │
│  │    │                     │     │   │
│  │    │   PRIMARY ACTIONS   │     │   │
│  │    │   (dolne 2/3 ekranu)│     │   │
│  │    │                     │     │   │
│  │    └─────────────────────┘     │   │
│  │                                 │   │
│  │    Secondary content...        │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Zasada:** Primary actions (Start Timer, Save Task) muszą być w **dolnej 2/3 ekranu**.

---

## 5. Mapowanie Tokenów na Komponenty

| Komponent | Primary Token | Secondary Token | Glow |
|-----------|---------------|-----------------|------|
| **Q1 Card** | `--neon-lime` | - | `0 0 20px rgba(57,255,20,0.6)` |
| **Q2 Header** | `--neon-fuchsia` | - | `0 0 30px rgba(208,0,255,0.7)` |
| **Q3 Header** | `--neon-orange` | `--neon-cyan` | `0 0 25px rgba(255,140,0,0.6)` |
| **Q4 Header** | `--neon-silver` | - | `0 0 15px rgba(148,163,184,0.35)` |
| **Timer Running** | `--neon-lime` | - | `0 0 30px rgba(57,255,20,0.8)` |
| **Timer Paused** | `--neon-fuchsia` | - | `0 0 20px rgba(208,0,255,0.5)` |
| **Destructive Hatch** | `--neon-fuchsia` | Red | Pulse animation |

---

**Document ID:** UX-MOCKUPS-001  
**Owner:** Principal Product Designer  
**Status:** APPROVED  
**Last Updated:** 2026-05-18  
**Viewport:** 430px Pro Max Standard
