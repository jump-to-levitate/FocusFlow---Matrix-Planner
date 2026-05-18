# Zasady UX dla ADHD (ADHD-Proof Principles)

> UX Design Principles Specification  
> Document ID: UX-PRINCIPLES-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Principal Product Designer

---

## 1. Dopaminowa Gratyfikacja (Dopamine-Driven Design)

### 1.1 Neurobiologiczne Podstawy

Osoby z ADHD mają zmniejszoną aktywność receptorów dopaminowych w korze przedczołowej (prefrontal cortex). Interfejs musi dostarczać **natychmiastowych, wizualnych nagród** przy każdej interakcji, aby zrekompensować deficyty w systemie nagród.

### 1.2 Implementacja Mechanizmów Dopaminowych

| Mechanizm | Implementacja Techniczna | Efekt Neurobiologiczny |
|-----------|-------------------------|------------------------|
| **Neon Glow** | Laserowe obramowania (`#39FF14`, `#D000FF`, `#00F0FF`) z ostro zdefiniowanymi krawędziami bez rozmycia | Wizualna "nagroda" za interakcję - natychmiastowa satysfakcja |
| **Instant Feedback** | 1-click checkbox z animacją `scale(1.1)` + transition 150ms | Dopaminowy impuls z potwierdzenia akcji |
| **Progress Visualization** | SVG ring w timerze (cyberpunk clock) z neonowym wypełnieniem | Dopamina generowana z postępu - analogicznie do pasków XP w grach |
| **Completion Animation** | Subtle glow pulse przy ukończeniu zadania (keyframe animation) | Achievement feedback - zamknięcie pętli nagrody |

### 1.3 Zakazane Wzorce (Anti-Patterns)

- ❌ **Toast notifications** - pojawiają się i znikają, użytkownik nie wie czy akcja się udała
- ❌ **Delayed feedback** - opóźnienia > 300ms wydają się "zawieszone"
- ❌ **Backdrop blur** - efekt mglisty rozmywa ostrość, redukuje dopaminowy efekt
- ❌ **Subtle micro-interactions** - zbyt subtelne animacje są niezauważalne dla ADHD

---

## 2. Brak Kar za Utratę Passy (Compassion-Based Design)

### 2.1 Problem: Rejection Sensitive Dysphoria (RSD)

Standardowe aplikacje produktywności (Duolingo, Habitica) używają **guilt-tripping**: "Straciłeś 30-dniową passę!". Dla osób z ADHD to **RSD trigger** - Rejection Sensitive Dysphoria (ekstremalna reakcja emocjonalna na postrzeganą porażkę).

### 2.2 FocusFlow Approach: Neutralna Semantyka

| Standardowa App (Trigger) ❌ | FocusFlow (Compassionate) ✅ |
|------------------------------|------------------------------|
| "Straciłeś passę!" | "Resetuj licznik" (neutralnie) |
| "Nie udało się" | "Nowy start" (pozytywnie) |
| Red notification badge | Gentle reminder, bez urgency |
| Public leaderboards | Prywatna historia sukcesów |
| "You failed" | "Session ended" |

### 2.3 Destructive Hatch (Psychologiczne Przyzwolenie)

**Problem:** Osoby z ADHD hoardują myśli - nie potrafią "puścić" zadań, bo czują winę.

**Rozwiązanie:** Przycisk "Odrzuć / Zapomnij" (Destructive Hatch) w Q4 Archiwum:
- **Fizycznie nie zapisuje** zadania do IndexedDB
- Daje **psychologiczne przyzwolenie** na odpoczynek bez wyrzutów
- Nie ma "śladu" - formularz jest czyszczony, modal zamyka się płynnie

### 2.4 Kluczowa Zasada

> **„Compassion over productivity. Progress over perfection."**

Użytkownik nie jest karany za naturalne wahania w produktywności. Brak streaks, brak "missed days", brak porównań z innymi.

---

## 3. Redukcja Obciążenia Pamięci Roboczej (Working Memory Offload)

### 3.1 Neurobiologiczna Podstawa

**Problem ADHD:** Pamięć robocza = 3-4 elementy (vs 7±2 u neurotypowych). Użytkownik nie może "pamiętać" co robił 2 ekrany temu.

### 3.2 Techniki External Memory

| Technika | Implementacja | Cel |
|----------|---------------|-----|
| **Context Preservation** | Modal nie zamyka się między krokami Quizu (snapshot state w useQuizForm) | Użytkownik nie musi pamiętać odpowiedzi z poprzedniego kroku |
| **Visual Persistence** | Q1 zawsze widoczne na pulpicie (nie schowane za tabem) | "Out of sight, out of mind" eliminacja |
| **External Memory** | Subkategorie Q2/Q3/Q4 jako "kontekst wykonawczy" | Użytkownik nie musi pamiętać "co to było" - system to wie |
| **One-Thing-At-A-Time** | Timer = jedno zadanie na ekranie, brak listy rozpraszającej | Redukcja decision paralysis |
| **Symetria Zwierciadlana** | Sub-matryce 2x2 zachowują oś symetrii | Redukcja zmęczenia poznawczego (cognitive load) |
| **Psychologiczny Reset** | Przycisk "Odrzuć / Zapomnij" jako bezpieczny wypis | Uwalnia pamięć roboczą ze spiralę winy |

### 3.3 Izolacja Q0 (Brain Dump)

**Q0 Inbox jest fizycznie izolowany** od Macierzy Q1-Q4. To nie jest "ćwiartka" - to **przytulna poczekalnia** dla niezdefiniowanych myśli.

- Nie pojawia się w głównym flow Q1-Q4
- Nie triggeruje paraliżu decyzyjnego
- Pozwala na **seryjny zrzut** (batch capture) bez kategoryzacji

---

## 4. Zasada One-Thing-At-A-Time

### 4.1 Problem: Rozproszenie Uwagi

Osoby z ADHD są łatwo rozpraszane. Widok z wieloma elementami = brak focusu = paraliż.

### 4.2 Implementacja w TimerScreen

| Zasada | Implementacja | Uzasadnienie |
|--------|---------------|--------------|
| **Single Task Focus** | Tylko jedno zadanie wyświetlane pod zegarem | Brak listy rozpraszającej w tle |
| **No Scroll** | Wszystko mieści się na ekranie bez scrollowania | Scroll = kolejna decyzja (gdzie skończyłem?) |
| **Centered Layout** | Zegar na środku, przyciski pod nim | Thumb-friendly, ergonomic dla kciuka |
| **3-Way Modal** | Po zakończeniu TYLKO 3 opcje, nie 10+ | Decision paralysis eliminacja |

### 4.3 3-Way Strategic Close

Po zakończeniu sesji timera, użytkownik widzi **dokładnie 3 opcje** - żadnych dropdownów, checkboxów, dodatkowych pól:

```
┌─────────────────────────────────────────┐
│         Sesja zakończona!               │
├─────────────────────────────────────────┤
│  [✅ UKOŃCZ ZADANIE]                   │
│  [🔄 JESZCZE JEDNA SESJA]              │
│  [⏸️ WRÓCĘ DO TEGO PÓŹNIEJ]             │
└─────────────────────────────────────────┘
```

**Zero opcji "hidden"** - wszystko widoczne na pierwszy rzut oka.

---

## 5. Hierarchia Wizualna dla ADHD

### 5.1 Neurostymulacja Kolorami

| Quadrant | Kolor | Neurobiologiczny Efekt |
|----------|-------|------------------------|
| **Q1** | Neon Lime `#39FF14` | Najbardziej "gorący" kolor = natychmiastowa uwaga (urgency) |
| **Q2** | Fuchsia `#D000FF` | "Planowanie" - ważne ale nie pilne, uspokajający |
| **Q3** | Orange `#FF8C00` | "Logistyka" - neurostymulacja dla prozy życia |
| **Q4** | Matte Silver `#94A3B8` | "Archiwum" - chłodny kolor = niższy priorytet, nie gasi innych neonów |

### 5.2 Skanowanie Wzrokowe (Visual Scanning)

- **Neon glow na aktywnych** - Q1 zawsze "świeci" (visual persistence)
- **Liczniki w nagłówkach** - "3 zadań" = immediate quantity recognition
- **Kontrast kolorów** - lime na ciemnym tle = maksymalna widoczność
- **Badge Q0 na pulpicie** - fioletowy badge z liczbą niezakwalifikowanych zadań

---

**Document ID:** UX-PRINCIPLES-001  
**Owner:** Principal Product Designer  
**Status:** APPROVED  
**Last Updated:** 2026-05-18
