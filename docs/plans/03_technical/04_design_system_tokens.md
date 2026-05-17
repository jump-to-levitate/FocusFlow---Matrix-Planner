# Technical Specification: Design System Tokens (Cyberpunk/Neon)

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Filozofia Design Systemu

FocusFlow 2.0 wykorzystuje **Cyberpunk Neon Aesthetic** - stylistykę inspirowaną interfajsami sci-fi z lat 80-90, charakteryzującą się:

- **Ostrymi, laserowymi krawędziami** (brak rozmycia, blur, mgły)
- **Wysokim kontrastem** (neonowe kolory na ciemnym tle)
- **Dopaminową paletą** (fiolety, zielenie, pomarańcze)
- **Precyzyjnymi proporcjami** (sztywne wysokości, rygorystyczne wyrównanie)

---

## 2. Paleta Kolorów (Color Tokens)

### 2.1 Kolory Ćwiartek (Quadrant Colors)

| Token | Ćwiartka | Nazwa | HEX | RGB | Użycie |
|-------|----------|-------|-----|-----|--------|
| `--q1-green` | Q1 | Neon Green | `#00FF66` | `0, 255, 102` | Pilne & Ważne (Kryzysy) |
| `--q2-purple` | Q2 | Neon Purple | `#D000FF` | `208, 0, 255` | Ważne, Niepilne (Planowanie) |
| `--q3-orange` | Q3 | Cyber Orange | `#FF8C00` | `255, 140, 0` | Pilne, Nieważne (Przerwy) |
| `--q4-slate` | Q4 | Matrix Gray | `#9CA3AF` | `156, 163, 175` | Nieużywane (Archiwum) |

### 2.2 Sub-Matryca Q2 (Centrum Planowania)

W pod-widoku Q2 stosujemy **dual-tone** - na przemian fiolet i zieleń:

```
┌─────────────────┬─────────────────┐
│   RUTYNY 🔄    │  PROJEKTY 📁   │
│  #D000FF       │   #00FF66      │
├─────────────────┼─────────────────┤
│ OGÓLNE CELE 🎯 │    INNE 💼     │
│   #00FF66      │  #D000FF       │
└─────────────────┴─────────────────┘
```

### 2.3 Tło i Powierzchnie

| Token | HEX | Opacity | Użycie |
|-------|-----|---------|--------|
| `--bg-dark` | `#0a0a0f` | 100% | Główne tło aplikacji |
| `--bg-card` | `#14141f` | 100% | Tło kart i sekcji |
| `--bg-hover` | `#1f1f2e` | 100% | Hover state |
| `--bg-purple-10` | `#D000FF` | 10% | Fioletowe tło ćwiartki |
| `--bg-green-8` | `#39FF14` | 8% | Zielone tło ćwiartki |

---

## 3. System Cieni (Shadow Tokens)

### 3.1 Zasada: Laserowe, Nie Mgliste

❌ **Antywzorzec (REJECTED):**
```css
box-shadow: 0 0 25px rgba(208,0,255,0.3), 
            inset 0 0 30px rgba(208,0,255,0.2);
/* Za dużo rozmycia, efekt "mgły" */
```

✅ **Wzorzec (APPROVED):**
```css
box-shadow: 0 0 30px rgba(208,0,255,0.7), 
            0 0 60px rgba(208,0,255,0.2);
/* Ostry, laserowy efekt */
```

### 3.2 Tokeny Cieni (Tailwind)

| Token | Klasa Tailwind | Opis |
|-------|----------------|------|
| `--shadow-purple-lg` | `shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)]` | Główny cień Q2 |
| `--shadow-green-md` | `shadow-[0_0_20px_rgba(57,255,20,0.6),0_0_50px_rgba(57,255,20,0.15)]` | Główny cień Q1 |
| `--shadow-orange-sm` | `shadow-[0_0_15px_rgba(255,140,0,0.5)]` | Cień Q3 |
| `--shadow-text-purple` | `text-shadow: 0 0 10px rgba(208,0,255,0.8)` | Blask tekstu |

### 3.3 Implementacja w Komponentach

```tsx
// QuadrantCard.tsx - główna Macierz
<div className="
  border border-[#D000FF] 
  shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)]
  bg-[rgba(208,0,255,0.10)]
">

// Centrum Planowania Q2 - sub-boxes
const getBoxClasses = (isPurple: boolean) => ({
  shadow: isPurple 
    ? 'shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)]'
    : 'shadow-[0_0_20px_rgba(57,255,20,0.6),0_0_50px_rgba(57,255,20,0.15)]'
});
```

---

## 4. System Obramowań (Border Tokens)

### 4.1 Tokeny Obramowań

| Token | Klasa Tailwind | Opis |
|-------|----------------|------|
| `--border-purple` | `border-[#D000FF]` | Obramowanie Q2 |
| `--border-green` | `border-[#39FF14]` | Obramowanie Q1 |
| `--border-white-10` | `border-white/10` | Subtelne obramowanie |
| `--border-opacity-40` | `border-opacity-40` | Przezroczystość |

### 4.2 Hierarchia Obramowań

```tsx
// Nagłówek boxa w Q2
<div className="
  h-14 
  flex items-center justify-between 
  px-3 
  border-b border-[#D000FF] 
  bg-[rgba(208,0,255,0.15)]
">

// Fiszka zadania
<div style={{
  border: `1px solid ${isPurple ? 'rgba(208,0,255,0.2)' : 'rgba(57,255,20,0.2)'}`,
}}>
```

---

## 5. Rygorystyczne Wyrównanie (Strict Alignment)

### 5.1 Problem: Asymetria UI

Brak stałych wysokości nagłówków powoduje:
- Łamanie symetrii w gridach 2x2
- Niejednolite linie odcinające
- Chaotyczne wizualne hierarchy

### 5.2 Rozwiązanie: Stała Wysokość h-14

```tsx
// Wzorzec: Wszystkie nagłówki w Q2 sub-matrix
<div className="h-14 flex items-center justify-between px-3 ...">
  <div className="flex items-center gap-2">
    <span className="text-xl">{icon}</span>
    <h3 className="...">{label}</h3>
  </div>
  <span className="px-2.5 py-1 rounded-full ...">{count}</span>
</div>
```

### 5.3 Specyfikacja Typografii dla H-14

| Etykieta | Linie | Font Size | Line Height | Klasa |
|----------|-------|-----------|-------------|-------|
| RUTYNY | 1 | `text-xs` | default | `font-black uppercase` |
| PROJEKTY | 1 | `text-xs` | default | `font-black uppercase` |
| OGÓLNE CELE | 2 | `text-[11px]` | `leading-none` | `font-black uppercase` + `<br />` |
| INNE | 1 | `text-xs` | default | `font-black uppercase` |

### 5.4 Klucz: `leading-none` dla Dwuliniowych Etykiet

```tsx
// OGÓLNE CELE - wymaga kompaktowej typografii
<h3 className="text-[11px] sm:text-xs font-black tracking-wider uppercase leading-none">
  OGÓLNE<br />CELE
</h3>
```

**Dlaczego `leading-none`?**
- Eliminuje domyślny line-height (zazwyczaj 1.5em)
- Zmniejsza odstęp między "OGÓLNE" a "CELE"
- Mieści się w h-14 bez rozpychania

---

## 6. Unifikacja Wysokości i Whitespace

### 6.1 Blokada Łamania Słów

```tsx
// Nagłówek "Centrum Planowania" w Q2 sub-screen
<span className="text-sm sm:text-base font-black tracking-widest uppercase whitespace-nowrap">
  Centrum
</span>
<span className="text-[11px] sm:text-xs font-black ... whitespace-nowrap">
  Planowania
</span>
```

**`whitespace-nowrap`** zapobiega łamaniu "PLANOWANIA" na "PLANO-WANIA" na wąskich ekranach.

### 6.2 Grid Layout dla Nagłówka

```tsx
// Q2 Navigation Bar - 3 Column Grid Layout
<div className="grid grid-cols-3 items-center w-full gap-2 mb-6 px-2">
  {/* Lewa: Back Button */}
  <div className="flex justify-start">...</div>
  
  {/* Środek: Title (2-liniowy, wyśrodkowany) */}
  <div className="flex flex-col items-center justify-center">...</div>
  
  {/* Prawa: Add Button */}
  <div className="flex justify-end">...</div>
</div>
```

---

## 7. Tokeny Interakcji (Interaction Tokens)

### 7.1 Hover States

| Element | Idle | Hover | Klasy |
|---------|------|-------|-------|
| Quadrant Card | scale(1) | scale(1.02) | `transition-all duration-200 hover:scale-[1.02]` |
| Complete Button | opacity 0.3 | opacity 1, color #00FF66 | `transition-all duration-200 hover:scale-110` |
| Task Item | bg rgba(255,255,255,0.05) | bg rgba(255,255,255,0.08) | `transition-all duration-300` |

### 7.2 Animacje

```css
/* Fade-in dla nowych zadań */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

---

## 8. Checklist Implementacji

- [x] Tokeny kolorów Q1-Q4 zdefiniowane (#00FF66, #D000FF, #FF8C00, #9CA3AF)
- [x] Sub-matryca Q2 z dual-tone (fiolet/zieleń)
- [x] Laserowe cienie (brak mgły, ostre krawędzie)
- [x] Stała wysokość nagłówków (h-14) z `items-center`
- [x] Kompaktowa typografia dla dwuliniowych etykiet (leading-none)
- [x] Whitespace-nowrap w nagłówkach głównych
- [x] Grid 3-kolumnowy dla nawigacji Q2
- [x] Hover:scale efekty na kartach i przyciskach
- [x] Animacje fade-in dla zadań

---

## 9. Przykłady Użycia

### 9.1 QuadrantCard (Główna Macierz)

```tsx
<div className="
  rounded-xl 
  border border-[#D000FF] 
  backdrop-blur-sm 
  shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)]
  bg-[rgba(208,0,255,0.10)]
  transition-all duration-200 hover:scale-[1.02]
">
```

### 9.2 Sub-Box w Centrum Planowania

```tsx
<div className="
  rounded-xl 
  border border-[#D000FF] 
  backdrop-blur-sm 
  shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)]
  bg-[rgba(208,0,255,0.10)]
  overflow-hidden flex flex-col h-full
  transition-all duration-200 hover:scale-[1.02]
">
  {/* Header h-14 */}
  <div className="h-14 flex items-center justify-between px-3 border-b border-[#D000FF] bg-[rgba(208,0,255,0.15)]">
```

---

## 10. References

- [Tailwind CSS Arbitrary Values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
- [Cyberpunk UI Design](https://www.nngroup.com/articles/cyberpunk-ux/)
- [Neon Glow Effects](https://css-tricks.com/how-to-create-neon-glow-with-css/)
