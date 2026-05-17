# 03 Centrum Planowania – Głęboki Kontekst Kwadrantu 2

> Wersja: 2.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Nazwa Funkcji

**Centrum Planowania – Głęboki Kontekst Kwadrantu 2 (Q2 Sub-Matrix)**

---

## 2. Opis Funkcjonalny

Dedykowany **pod-ekran wewnątrz zakładki Macierz**, przełączany za pomocą wewnętrznej maszyny stanów widoku (`viewMode: 'grid' | 'q2'`). Zapewnia głęboki kontekst dla zadań **Ważnych, Niepilnych (Q2)** z podziałem na 4 subkategorie, bez przeciążenia informacyjnego głównej Macierzy.

---

## 3. Maszyna Stanów Widoku (viewMode)

### 3.1 Przełączanie Widoków wewnątrz Macierzy

```typescript
// MatrixScreen.tsx - lokalna maszyna stanów widoku
const [viewMode, setViewMode] = useState<'grid' | 'q2'>('grid');

// Renderowanie warunkowe
return (
  <>
    {viewMode === 'grid' && <MainMatrixGrid />}
    {viewMode === 'q2' && <CentrumPlanowaniaSubView />}
  </>
);
```

### 3.2 Flow Nawigacji

```
Główna Macierz (Grid 2x2)
    ↓
Hover nad Q2 → przycisk "Otwórz Centrum Planowania ↗"
    ↓
Kliknięcie → setViewMode('q2')
    ↓
Centrum Planowania (Pod-widok Q2 z sub-matrycą 2x2)
    ↓
Przycisk "← Powrót do Macierzy" → setViewMode('grid')
```

### 3.3 Header w Trybie Q2

```tsx
<div className="grid grid-cols-3 items-center w-full gap-2 mb-6 px-2">
  {/* Lewa: Powrót do głównej Macierzy */}
  <div className="flex justify-start">
    <button onClick={() => setViewMode('grid')}>
      ← Powrót do Macierzy
    </button>
  </div>
  
  {/* Środek: Tytuł 2-liniowy z neon glow */}
  <div className="flex flex-col items-center">
    <span className="text-sm sm:text-base font-black tracking-widest text-[#D000FF]">
      Centrum
    </span>
    <span className="text-[11px] sm:text-xs font-black text-[#D000FF]">
      Planowania
    </span>
    <span className="text-[10px] text-[#D000FF]/70">(Q2)</span>
  </div>
  
  {/* Prawa: Dodaj nowe zadanie Q2 */}
  <div className="flex justify-end">
    <button onClick={() => openQuiz(2)}>+ Dodaj</button>
  </div>
</div>
```

---

## 4. Architektura Sub-Matrycy 2x2

### 4.1 Layout Grid

```
┌─────────────────────────────────────────────────────────┐
│  [← Powrót]   Centrum Planowania (Q2)   [+ Dodaj]      │
├─────────────────────────────────────────────────────────┤
│                    ┌─────────────┬─────────────┐         │
│                    │  RUTYNY 🔄  │ PROJEKTY 📁│         │
│  GÓRA (Rząd 1)    │  (purple)   │  (green)   │         │
│                    ├─────────────┼─────────────┤         │
│  DÓŁ (Rząd 2)     │ OGÓLNE CELE│   INNE 💼   │         │
│                    │  (green)   │  (purple)   │         │
│                    └─────────────┴─────────────┘         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Alokacja Kolorów (Dual-Tone)

| Ćwiartka | Subkategoria | Kolor | Kod HEX | Uzasadnienie |
|----------|--------------|-------|---------|--------------|
| Lewa-Góra | Rutyny | Fioletowy | #D000FF | Spójność z Q2 w głównej Macierzy |
| Prawa-Góra | Projekty | Zielony | #00FF66 | Kontrast, energia (aktywne działanie) |
| Lewa-Dół | Ogólne Cele | Zielony | #00FF66 | Kontrast z fioletem |
| Prawa-Dół | Inne | Fioletowy | #D000FF | Zamknięcie kompozycji |

---

## 3. Subkategorie Q2

### 3.1 Model Danych

```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 1 | 2 | 3 | 4;
  subcategory: 'rutyna' | 'projekt' | 'ogolny_cel' | 'inne' | null;
  completed: boolean;
}
```

### 3.2 Definicje Subkategorii

| Subkategoria | Ikona | Opis | Przykłady |
|--------------|-------|------|-----------|
| **rutyna** | 🔄 | Nawyki i systemy wspierające funkcjonowanie | Medytacja, ćwiczenia, review tygodniowy |
| **projekt** | 📁 | Konkretne prace wymagające planowania | Napisać ebook, zbudować stronę, research |
| **ogolny_cel** | 🎯 | Kierunki bez rozplanowanych działań | „Być zdrowszym", „Rozwinąć biznes" |
| **inne** | 💼 | Pozostałe zadania i niezakategoryzowane | Zadania z null/undefined subcategory |

### 3.3 Normalizacja (Null → Inne)

```typescript
// Zadania bez przypisanej subkategorii trafiają do "Inne"
const normalizedSub = !sub || sub === '' ? 'inne' : sub;
```

---

## 5. Ścisłe Reguły UI z Design Systemu

### 5.1 Chirurgiczna Precyzja: Stała Wysokość Nagłówków (h-14)

Wszystkie 4 nagłówki sub-matrycy mają **identyczną, sztywną wysokość**:

```tsx
{/* Box Header - Fixed height h-14 for uniform alignment */}
<div className="h-14 flex items-center justify-between px-3 border-b border-[#D000FF] bg-[rgba(208,0,255,0.15)]">
  <div className="flex items-center gap-2">
    <span className="text-xl">{icon}</span>
    <h3 className="...">{label}</h3>
  </div>
  <span className="px-2.5 py-1 rounded-full text-xs font-bold">
    {count}
  </span>
</div>
```

**Kluczowe klasy:**
- `h-14` (56px) - stała wysokość wszystkich nagłówków
- `items-center` - pionowe wyśrodkowanie zawartości
- `justify-between` - rozmieszczenie tytułu i licznika

### 5.2 Zapobieganie Łamaniu Słów (Typography Safety)

**Problem:** Słowo "PLANOWANIA" łamało się na małych ekranach jako "PLANO-WANIA", niszcząc estetykę nagłówka.

**Rozwiązanie:** Klasa `whitespace-nowrap` wymuszająca niełamanie:

```tsx
// Tytuł główny "Centrum Planowania" - brak łamania
<span className="text-sm sm:text-base font-black tracking-widest uppercase whitespace-nowrap">
  Centrum
</span>
<span className="text-[11px] sm:text-xs font-black tracking-wider uppercase whitespace-nowrap">
  Planowania
</span>
```

### 5.3 Kompaktowa Typografia dla Dwuliniowych Etykiet

Tekst "OGÓLNE CELE" wymaga specjalnego traktowania:

```tsx
// Dla "OGÓLNE CELE" - kompaktowa typografia mieszcząca się w h-14
<h3 className="text-[11px] sm:text-xs font-black tracking-wider uppercase leading-none">
  OGÓLNE<br />CELE
</h3>
```

**Kluczowe właściwości:**
- `text-[11px]` - mniejsza czcionka niż standardowa (text-xs = 12px)
- `leading-none` - eliminuje domyślny line-height (zazwyczaj 1.5em)
- `<br />` - wymuszony podział linii w kontrolowanym miejscu

### 5.4 Porównanie Nagłówków (Uniform h-14)

| Subkategoria | Linie | Font Size | Line Height | Wynik |
|--------------|-------|-----------|-------------|-------|
| Rutyny 🔄 | 1 | text-xs | default | ✅ h-14 |
| Projekty 📁 | 1 | text-xs | default | ✅ h-14 |
| Ogólne Cele 🎯 | 2 | text-[11px] | leading-none | ✅ h-14 |
| Inne 💼 | 1 | text-xs | default | ✅ h-14 |

---

## 5. Stylistyka Cyberpunkowa

### 5.1 Ostrze vs Mgła (Harmonizacja z Główną Macierzą)

**Główna Macierz Q2 (QuadrantCard):**
```css
border: border-[#D000FF];
shadow: shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)];
bg: bg-[rgba(208,0,255,0.10)];
```

**Centrum Planowania (Sub-boxes):**
```typescript
const getBoxClasses = (isPurple: boolean) => {
  if (isPurple) {
    return {
      border: 'border-[#D000FF]',
      shadow: 'shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)]',
      bg: 'bg-[rgba(208,0,255,0.10)]',
      headerBg: 'bg-[rgba(208,0,255,0.15)]',
    };
  }
  // Zielony styl jak Q1...
};
```

**Usunięte efekty "mgliste":**
- ❌ `box-shadow: 0 0 25px + inset 0 0 30px` (rozlane poświaty)
- ❌ `shadow-2xl` i szerokie rozmycia
- ✅ Ostry, laserowy neon

### 5.2 Fiszki Zadań

```tsx
<div
  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group"
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${isPurple ? 'rgba(208,0,255,0.2)' : 'rgba(57,255,20,0.2)'}`,
  }}
>
  <button
    onClick={() => completeTask(task.id)}
    className="shrink-0 transition-all duration-200 hover:scale-110"
    style={{ color: 'rgba(255, 255, 255, 0.3)' }}
    onMouseEnter={(e) => (e.currentTarget.style.color = '#00FF66')}
    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)')}
  >
    <CheckCircle2 size={20} />
  </button>
  <span className="flex-1 text-sm text-white/90 leading-tight font-medium">
    {task.title}
  </span>
</div>
```

**Interakcje:**
- `hover:scale-110` na przycisku ukończenia
- Zmiana koloru na zielony (#00FF66) przy hover
- Brak backdrop-blur (ostrość)

---

## 6. Nawigacja i Flow

### 6.1 Przejście z Głównej Macierzy

```
Główna Macierz (Grid 2x2)
    ↓
Hover nad Q2 → pojawia się przycisk "Centrum Planowania ↗"
    ↓
Kliknięcie → setViewMode('q2')
    ↓
Q2 Sub-Matrix (2x2 z 4 subkategoriami)
```

### 6.2 Header w Q2 Sub-Matrix

```tsx
<div className="grid grid-cols-3 items-center w-full gap-2 mb-6 px-2">
  {/* Lewa: Powrót */}
  <div className="flex justify-start">
    <button onClick={() => setViewMode('grid')}>
      ← Powrót do Macierzy
    </button>
  </div>
  
  {/* Środek: Tytuł 2-liniowy */}
  <div className="flex flex-col items-center">
    <span className="text-sm sm:text-base font-black tracking-widest text-[#D000FF]">
      Centrum
    </span>
    <span className="text-[11px] sm:text-xs font-black text-[#D000FF]">
      Planowania
    </span>
    <span className="text-[10px] text-[#D000FF]/70">(Q2)</span>
  </div>
  
  {/* Prawa: Dodaj */}
  <div className="flex justify-end">
    <button onClick={() => openQuiz(2)}>+ Dodaj</button>
  </div>
</div>
```

---

## 7. Integracja z Quizem

### 7.1 Flow Dodawania Zadania

```
Centrum Planowania (Q2)
    ↓
Kliknięcie "+ Dodaj"
    ↓
QuizModal z initialQuadrant=2
    ↓
Ekran 1: Tytuł zadania
    ↓
Ekran 2: Pytania kwalifikacyjne (bypass - już wiemy, że Q2)
    ↓
Ekran 3: Wybór subkategorii (Rutyny/Projekty/Cele/Inne)
    ↓
Ekran 4: Potwierdzenie
    ↓
Zapis do Dexie z quadrant=2 i subcategory=X
    ↓
Automatyczny powrót do Centrum Planowania
```

### 7.2 Synchroniczny Derived State

```typescript
// Hook useQuizForm - eliminacja race condition
const predictedQuadrant = bypass ?? manualQuadrant ?? classifyFromScores(importanceAnswers, urgencyAnswers);

// Bypass = 2 (znamy ćwiartkę z góry)
// Manual override = możliwość zmiany przez użytkownika
// Auto-classify = fallback jeśli brak bypass
```

---

## 8. Kryteria Akceptacji

- [x] Layout 2x2 (Rutyny, Projekty, Cele, Inne)
- [x] Fioletowo-zielona kolorystyka cyberpunkowa
- [x] Identyczne style obramowań jak główna Macierz
- [x] Stała wysokość nagłówków (h-14) we wszystkich 4 boxach
- [x] Kompaktowa typografia dla "OGÓLNE CELE" (brak łamania słów)
- [x] Normalizacja null/undefined subcategory → "Inne"
- [x] Przycisk powrotu do głównej Macierzy
- [x] Przycisk "+ Dodaj" otwierający Quiz z prefill Q2
- [x] Fiszki zadań z animacją hover i szybkim ukończeniem
- [x] Liczniki zadań w nagłówkach

---

## 9. Decyzje UX (ADHD-Proof)

| Decyzja | Uzasadnienie |
|---------|--------------|
| **2x2 grid** | Znajomy wzorzec z głównej Macierzy |
| **Sztywna h-14** | Wizualna symetria, przewidywalność |
| **leading-none** | Kompaktowość, brak "rozpychania" |
| **Fiolet/Zieleń** | Dopaminowa paleta cyberpunkowa |
| **Ostre cienie** | Laserowa precyzja, brak "mgły" |
| **Null → Inne** | Brak pustych kategorii, 100% pokrycia |
