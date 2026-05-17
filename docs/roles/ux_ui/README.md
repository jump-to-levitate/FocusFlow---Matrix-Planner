# Rola: UX/UI Designer - FocusFlow

> **Odpowiedzialność:** Projektowanie ADHD-optimized UX eliminującego paraliż decyzyjny, redukcję obciążenia pamięci roboczej i dopaminową gratyfikację.
> **Kluczowe Wyzwanie:** Dla ADHD brain - mniej myślenia, więcej robienia.

---

## 1. Zasady UX dla ADHD (ADHD UX Principles)

### 1.1 Dopaminowa Gratyfikacja (Dopamine-Driven Design)

**Neurobiologia:** Osoby z ADHD mają zmniejszoną aktywność receptorów dopaminowych w korze przedczołowej. Interfejs musi dostarczać **natychmiastowych, wizualnych nagród**.

| Mechanizm | Implementacja | Neurobiologiczny Efekt |
|-----------|---------------|------------------------|
| **Neon Glow** | Laserowe obramowania (#39FF14, #D000FF) | Wizualna "nagroda" za interakcję |
| **Szybkie Ukończenie** | 1-click checkbox z animacją scale(1.1) | Instant gratification |
| **Progress Visualization** | SVG ring w timerze (cyberpunk clock) | Dopamina z postępu |
| **Completion Animation** | Subtle glow pulse przy ukończeniu zadania | Achievement feedback |

**Zakazane:** Długie opóźnienia, brak feedbacku, "toast notifications" ukrywające się same (nie wiadomo czy akcja się udała).

### 1.2 Brak Kar za Utratę Passy (Compassion-Based Design)

**Problem:** Standardowe streak apps (Duolingo, Habitica) używają guilt-tripping: "Straciłeś 30-dniową passę!" → **RSD trigger** (Rejection Sensitive Dysphoria).

**FocusFlow Approach:**

| Standardowa App | FocusFlow (Compassionate) |
|-----------------|---------------------------|
| "Straciłeś passę!" ❌ | "Resetuj passę" (neutralnie) ✅ |
| "Nie udało się" ❌ | "Nowy start" (pozytywnie) ✅ |
| Red notification badge ❌ | Gentle reminder, bez urgency ✅ |
| Public leaderboards ❌ | Prywatna historia sukcesów ✅ |

**Kluczowa Zasada:** „Compassion over productivity. Progress over perfection."

### 1.3 Redukcja Obciążenia Pamięci Roboczej (Working Memory Offload)

**Problem ADHD:** Pamięć robocza = 3-4 elementy (vs 7±2 u neurotypowych). Użytkownik nie może "pamiętać" co robił 2 ekrany temu.

**Rozwiązania:**

| Technika | Implementacja |
|----------|---------------|
| **Context Preservation** | Modal nie zamyka się między krokami Quizu (snapshot state) |
| **Visual Persistence** | Q1 zawsze widoczne na pulpicie (nie schowane za tabem) |
| **External Memory** | Subkategorie Q2 jako "kontekst wykonawczy" (nie trzeba pamiętać "co to było") |
| **One-Thing-At-A-Time** | Timer = jedno zadanie na ekranie, brak listy rozpraszającej |

### 1.4 Zasada "One-Thing-At-A-Time" w Timerze

**Problem:** Osoby z ADHD są łatwo rozpraszane. Widok z wieloma elementami = brak focusu.

**Implementacja TimerScreen:**
- **Single task focus** - tylko jedno zadanie wyświetlane pod zegarem
- **No scroll** - wszystko mieści się na ekranie bez scrollowania
- **Centered layout** - zegar na środku, przyciski pod nim (thumb-friendly)
- **3-Way Modal** - po zakończeniu TYLKO 3 opcje, nie 10+ decyzji

---

## 2. Przepływy Użytkownika (User Flows)

### 2.1 Architektura Przepływu Zadań (Task Pipeline Lifecycle)

Pełna ścieżka od chaosu mentalnego do egzekucji:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      USER FLOW ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   BRAIN DUMP          MACRO QUALIFY           MICRO CONTEXT          EXECUTE │
│                                                                             │
│  ┌─────────┐         ┌─────────────┐         ┌─────────────┐      ┌────────┐  │
│  │   Q0    │         │    QUIZ     │         │   SUB-MAT   │      │ TIMER  │  │
│  │ Inbox   │────────►│  (2 Qs)     │────────►│  Q2/Q3/Q4   │─────►│ FOCUS  │  │
│  │ Capture │         │  Derived    │         │  Sub-Q      │      │ Engine │  │
│  └─────────┘         │  State      │         └─────────────┘      └────────┘  │
│       │              └─────────────┘              │                           │
│       │                                           │                           │
│       ▼                                           ▼                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        3-WAY STRATEGIC CLOSE                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │   ✅ DONE    │  │  🔄 AGAIN    │  │  ⏸️ LATER    │                 │   │
│  │  │  Complete    │  │  Continue    │  │  Pause       │                 │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Szczegółowy Flow: Q0 Brain Dump (Seryjny Zrzut)

**Intencja:** Użytkownik ma 50 pomysłów w głowie. Musi je "wylać" bez decydowania gdzie dać.

```
1. Otwórz aplikację (2 sekundy, offline-first)
         ↓
2. Ekran Q0 automatycznie focusuje textarea
   (kursor miga, gotowy do wpisywania)
         ↓
3. Użytkownik wpisuje: "Zadzwonić do dentysty"
         ↓
4. ENTER lub klik "Dodaj" → zapis do Q0
   (brak pytań, brak decyzji, instant feedback)
         ↓
5. Zadanie pojawia się na liście Q0, textarea czyszczone
   (pozostajemy w Q0 - seryjny zrzut)
         ↓
6. [Opcjonalnie] Dodaj kolejną myśl lub przejdź do kwalifikacji
```

**ADHD Insight:** Po kroku 4 użytkownik doświadcza **dopaminowej nagrody** ("uporządkowałem chaos").

### 2.3 Szczegółowy Flow: Dwustopniowy Quiz (Intra-Quadrant Branching)

**Intencja:** Automatyczna klasyfikacja bez paraliżu decyzyjnego.

```
ETAP 1: KWALIFIKACJA MAKRO (2 Pytania)
┌─────────────────────────────────────────┐
│  "Zadzwonić do dentysty"                │
│                                         │
│  1. Czy przybliża Cię to do celu?      │
│     [ TAK ]  [ NIE ]                    │
│                                         │
│  2. Czy masz twardy termin?            │
│     [ TAK ]  [ NIE ]                    │
│                                         │
│  [← Wstecz]        [Dalej →]           │
└─────────────────────────────────────────┘
         ↓
   Synchroniczny Derived State (useMemo)
   predictedQuadrant = calculate(odp1, odp2)
         ↓
ETAP 2: KWALIFIKACJA MIKRO (Conditional)
┌─────────────────────────────────────────┐
│  Wykryto: Q2 (Ważne, Niepilne)          │
│                                         │
│  Wybierz kontekst wykonawczy:           │
│                                         │
│  ┌──────────┐  ┌──────────┐             │
│  │ 🔄 RUTYNY│  │ 📁PROJEKT│             │
│  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐             │
│  │ 🎯 CELE  │  │ 💼 INNE  │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  [← Wstecz]        [Zapisz →]           │
└─────────────────────────────────────────┘
         ↓
   Zapis do Dexie z quadrant=2, subcategory='rutyna'
```

**Flow Decyzyjny:**
- Q1 (Crunch) → Natychmiastowy zapis (brak subkategorii)
- Q2 (Planowanie) → Sub-matryca 2x2 (4 opcje)
- Q3 (Logistyka) → Hub z 3 szufladami (Teraz/Blok/Przerwa)
- Q4 (Archiwum) → 4 szuflady + opcja "Zapomnij"

### 2.4 Szczegółowy Flow: Focus Engine (Timer)

**Intencja:** Deep work bez rozpraszania. Tylko jedno zadanie, tylko zegar.

```
┌─────────────────────────────────────────────────────────────────┐
│                         FOCUS MODE                              │
│                                                                 │
│                      ╭─────────────╮                            │
│                     ╱   24:32       ╲                            │
│                    │   ▶ RUNNING    │                            │
│                     ╲_______________╱                            │
│                          │                                      │
│                   Neon Green Glow                               │
│                    (pulsating)                                  │
│                                                                 │
│              [⏸ Pause]  [⏹ Stop]                              │
│                                                                 │
│         ┌─────────────────────────────┐                         │
│         │ 🔥 Naprawić bug w produkcji │   ← Aktualne zadanie   │
│         └─────────────────────────────┘                         │
│                                                                 │
│    [Brak innych elementów - one-thing-at-a-time]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Timer Complete → 3-Way Modal:
┌─────────────────────────────────────────────────────────────────┐
│                    Sesja zakończona! 🎉                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    [✅ UKOŃCZ ZADANIE]                                         │
│    Zaznacz jako done, wyczyść timer                           │
│                                                                 │
│    [🔄 JESZCZE JEDNA SESJA]                                    │
│    Zachowaj zadanie, resetuj timer                            │
│                                                                 │
│    [⏸️ WRÓCĘ DO TEGO PÓŹNIEJ]                                  │
│    Zatrzymaj timer, wróć na pulpit                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Specyfikacja Makiet (Design Tokens)

### 3.1 Układ Siatki (Grid System)

#### Grid Core (Główna Macierz Q1-Q4)

```
┌─────────────────────────────────────────┐
│              480px width                │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┬─────────────┐         │
│  │      │      │             │ 240px   │
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
```
Desktop: grid grid-cols-2 gap-4
Mobile:  grid grid-cols-1 gap-3
```

#### Sub-Matrix 2x2 (Centrum Planowania Q2)

Identyczny layout jak główna Macierz (znajomy wzorzec):

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

### 3.2 Rygorystyczne Reguły Wysokości (Header h-14)

**Zasada:** Wszystkie nagłówki w sub-matrycy mają **identyczną, sztywną wysokość**.

| Element | Klasa Tailwind | Wartość | Uzasadnienie |
|---------|----------------|---------|--------------|
| **Header Height** | `h-14` | 56px | Uniform alignment |
| **Vertical Center** | `items-center` | - | Wyrównanie ikony i tekstu |
| **Horizontal Spread** | `justify-between` | - | Tytuł vs licznik |

**Implementacja:**
```tsx
<div className="h-14 flex items-center justify-between px-3 border-b border-[#D000FF] bg-[rgba(208,0,255,0.15)]">
  <div className="flex items-center gap-2">
    <span className="text-xl">🔄</span>
    <h3 className="text-xs font-bold uppercase">Rutyny</h3>
  </div>
  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#D000FF]/20">
    {count}
  </span>
</div>
```

### 3.3 Paleta Kolorów Neonowych (Laser Glow)

**Cyberpunk Neon Palette:**

| Token | HEX | Zastosowanie | Glow Effect |
|-------|-----|--------------|-------------|
| `--neon-lime` | #39FF14 | Q1 (Urgent/Important), timer running | `0 0 20px rgba(57,255,20,0.6)` |
| `--neon-fuchsia` | #D000FF | Q2, Q3 headers, paused state | `0 0 30px rgba(208,0,255,0.7)` |
| `--neon-cyan` | #00F0FF | Q4, accents | `0 0 15px rgba(0,240,255,0.5)` |
| `--neon-green` | #00FF66 | Projekty, success states | `0 0 25px rgba(0,255,102,0.6)` |
| `--bg-dark` | #0a0a0f | Background | - |
| `--bg-card` | rgba(255,255,255,0.05) | Card backgrounds | - |

**Laser Border (Sharp Glow):**
```css
/* Ostry, laserowy neon (nie mgliste rozmycie) */
border: 1px solid #D000FF;
box-shadow: 
  0 0 30px rgba(208,0,255,0.7),    /* outer glow */
  0 0 60px rgba(208,0,255,0.2),    /* extended glow */
  inset 0 0 20px rgba(208,0,255,0.1); /* inner subtle glow */
```

**Usunięte efekty "mgliste":**
- ❌ `backdrop-blur` (rozmywa ostrość)
- ❌ `shadow-2xl` z szerokim rozmyciem
- ❌ Multiple overlapping shadows bez celu

### 3.4 Skanowanie Wzrokowe (Visual Scanning)

**Hierarchia Wizualna dla ADHD:**

1. **Q1 (Fire/Lime)** - Najbardziej "gorący" kolor = natychmiastowa uwaga
2. **Q2 (Fuchsia)** - "Planowanie" - ważne ale nie pilne
3. **Q3 (Fuchsia-muted)** - "Logistyka" - codzienne
4. **Q4 (Cyan-muted)** - "Archiwum" - chłodny kolor = niższy priorytet

**Techniki Skanowania:**
- **Neon glow na aktywnych** - Q1 zawsze "świeci" (visual persistence)
- **Liczniki w nagłówkach** - "3 zadań" = immediate quantity recognition
- **Kontrast kolorów** - lime na ciemnym tle = maksymalna widoczność
- **Badge Q0 na pulpicie** - fioletowy badge z liczbą niezakwalifikowanych zadań

---

## 4. Key Documents & Deliverables

### 4.1 Kluczowe Dokumenty

| Dokument | Cel |
|----------|-----|
| [`design-system.md`](./design-system.md) | SSOT dla design tokens, 480px constraint |
| [`docs/plans/02_features/03_centrum_planowania_q2.md`](../../plans/02_features/03_centrum_planowania_q2.md) | Specyfikacja sub-matrycy |
| [`docs/architecture/adr/adr_005_pwa_offline_first.md`](../../architecture/adr/adr_005_pwa_offline_first.md) | UX offline-first |
| [`app/src/constants/colors.ts`](../../../app/src/constants/colors.ts) | Design tokens (code) |

### 4.2 Deliverables

- **Wireframes** - ASCII diagrams w planach funkcjonalności
- **UX Review** - Dla każdego PR (czy spełnia ADHD principles?)
- **Design Specs** - Tokeny, spacing, typography
- **Micro-interactions** - Animacje hover, transitions

### 4.3 Anti-Patterns Checklist (Czego UNIKAĆ)

| Anty-wzorzec | Konsekwencja dla ADHD | FocusFlow Solution |
|--------------|----------------------|-------------------|
| Długie listy (20+ zadań) | Overwhelm freeze | Paginacja / Max 5-7 widocznych |
| Małe przyciski (<44px) | Frustracja, missed clicks | Touch targets min 44×44px |
| Za dużo opcji (5+ choices) | Decision paralysis | Max 3-4 opcje, binarne decyzje |
| Skomplikowane formularze | Abandonment | 1 pole + Smart Quiz |
| Modal hell (nested modals) | Lost context, panic | Inline editing, step-by-step |
| Time-based deadlines | Time blindness anxiety | Duration estimates ("5 min") |
| Brak instant feedback | "Czy to zadziałało?" | Visual feedback na każdej akcji |

---

## 5. Workflow UX/UI Designera

```
1. REQUIREMENTS
   └── Czytanie planu funkcjonalności (FEAT_*)
                    ↓
2. ADHD ANALYSIS
   └── Czy ten flow wymaga myślenia? (Musi być "foolproof")
   └── Czy jest frictionless? (Max 3 kliknięcia)
   └── Czy zapewnia visual persistence?
                    ↓
3. WIREFRAMING
   └── ASCII diagram w specyfikacji
   └── Mobile-first (480px constraint)
                    ↓
4. DESIGN SYSTEM
   └── Wybór tokenów (kolory, spacing)
   └── H-14 headers, whitespace-nowrap
                    ↓
5. REVIEW
   └── UX Review PR (zgodność z ADHD principles)
   └── 480px Constraint Check
                    ↓
6. HANDOFF
   └── Design specs dla deweloperów
   └── Animacje i micro-interactions
```

---

**Zasada:** "Dla ADHD brain - mniej myślenia, więcej robienia. Design jest poprawny, gdy użytkownik nie musi się zastanawiać 'co teraz?'"

