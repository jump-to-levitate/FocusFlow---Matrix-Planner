# 01 Strategia Rozwoju Produktu i Kamienie Milowe

> Wersja: 1.0  
> Data: Maj 2026  
> Status: 📋 Strategiczny Plan Egzekucji

---

## 1. Nazwa Dokumentu

**Strategia Rozwoju Produktu i Kamienie Milowe (Product Roadmap)**

---

## 2. Wizja Produktu

FocusFlow to **ADHD-proof productivity system** działający jako lokalna aplikacja PWA (Progressive Web App). Zaprojektowany z myślą o osobach neuroatypowych, eliminuje barierę wejścia poprzez:

- **Zero rejestracji** - brak konieczności zakładania konta
- **Offline-first** - pełna funkcjonalność bez internetu
- **Local-first** - dane zapisane lokalnie w IndexedDB
- **ADHD-friendly UX** - redukcja paraliżu decyzyjnego, dopaminowa nagroda wizualna

---

## 3. Faza 1: Local-First Focus Core (OBECNA)

> **Status:** ✅ Wdrożone (Maj 2026)  
> **Cel:** Podstawowa funkcjonalność produktywnościowa bez zależności zewnętrznych

### 3.1 Architektura "Deep Context Sub-Matrix" (Dwustopniowa Kwalifikacja ADHD-Proof)

FocusFlow implementuje unikalny system **dwustopniowej klasyfikacji zadań** - od makro-ćwiartki Eisenhowera do mikro-kontekstu wykonawczego. Architektura eliminuje paraliż decyzyjny poprzez płynny, wieloetapowy przepływ kwalifikacji.

---

#### **Faza 1A: Kwalifikacja Makro (Q0 → Matrix Core)** ✅ WDROŻONE

**Opis:** Implementacja potoku Inbox Capture (Q0) jako bezwysiłkowego zrzutu myśli, eliminującego barierę przed rozpoczęciem.

**Kluczowe Elementy:**
- **Inbox Capture (Q0)** - Potok Brain Dump bez barier decyzyjnych
- **Macierz Priorytetów Q1-Q4** - Główna struktura Eisenhowera z izolacją Q0
- **Inteligentny Quiz** - Mechanizm synchronicznego stanu pochodnego (Derived State) natychmiastowo wyliczający ćwiartkę na podstawie 2 pytań binarnych
- **Eliminacja Race Conditions** - Stan `predictedQuadrant` obliczany synchronicznie w maszynie stanów formularza, nie asynchronicznie w komponencie

**Rezultat:** Użytkownik dodaje zadanie w max 3 kliknięciach, bez konieczności manualnego wyboru ćwiartki.

---

#### **Faza 1B: Mikrokategoryzacja Q2 ("Centrum Planowania")** ✅ WDROŻONE

**Opis:** Rozszerzenie schematu bazy danych i UI o drugi stopień klasyfikacji dla zadań "Niepilne, Ważne" (Q2) - strefy strategicznego planowania.

**Kluczowe Elementy:**
- **Rozszerzenie Schematu Dexie:** Pole `subcategory?: string` w tabeli `tasks`
- **Dedykowany Pod-Ekran:** Sub-matryca 2x2 w układzie kart planistycznych
- **Cztery Szuflady Wykonawcze:**
  | Szuflada | Przeznaczenie | Kontekst |
  |----------|---------------|----------|
  | **Rutyny** | Nawyki, systemy, procesy powtarzalne | Autopilot execution |
  | **Projekty** | Złożone cele wieloetapowe | Deep work blocks |
  | **Ogólne Cele** | Kierunki bez konkretnego planu | Future consideration |
  | **Inne** | Reszta niepilotowych spraw | Misc planning |

- **Restrykcyjne Reguły Design System:**
  - Sztywna wysokość nagłówków: `h-14` (56px) dla jednolitości wizualnej
  - Blokada łamania słów kluczowych: `whitespace-nowrap`
  - Jednolite obramowanie laserowe (glow) dla wszystkich kart Q2

**Rezultat:** Q2 przestaje być "czarną dziurą" zadań - każde zadanie ma przypisany kontekst wykonawczy.

---

#### **Faza 1C: Mikrokategoryzacja Q3 ("Hub Logistyki - Proza Życia")** 🔄 W TRAKCIE / PLANOWANE

**Opis:** Drugi stopień Quizu dla zadań "Pilne, Nieważne" (Q3) - strefy operacyjnych obowiązków życia codziennego.

**Kluczowe Elementy:**
- **Intra-Quadrant Branching:** Po zakwalifikowaniu zadania do Q3, Quiz natychmiast pyta o kontekst czasowo-energetyczny
- **Trzy Kategorie Egzekucyjne:**
  1. ***Zrób teraz*** - Zadania poniżej 10 minut, wymagające natychmiastowego działania bez planowania
  2. ***Zaplanuj blok*** - Zbiorczy sprint logistyczny (np. "Sobota 10:00 - Proza życia")
  3. ***W przerwie*** - Mechaniczne zadania wymagające małego nakładu kognitywnego, służące jako "reset mózgu" (np. pranie, mycie naczyń)

- **Dedykowany Interfejs "Huba Logistyki":**
  - Uproszczony layout sprzyjający szybkiej, seryjnej egzekucji
  - Grupowanie według kontekstu czasowego
  - Quick-actions: "Zrobione", "Przenieś do sprintu", "Zrób w przerwie"

**ADHD Problem:** Q3 często "zalewa" użytkownika - drobne obowiązki rozproszone w czasie tworzą ciągły stan "muszę coś zrobić" bez konkretnego planu.

**Solution:** Jednoznaczna klasyfikacja czasowa eliminuje decyzję "kiedy to zrobić?" - system mówi: "TERAZ" lub "SOBOTA 10:00" lub "W PRZERWIE OD PRACY".

---

#### **Faza 1D: Mikrokategoryzacja Q4 ("Archiwum - Nie Teraz")** 📋 PLANOWANE

**Opis:** System ochrony przestrzeni mentalnej poprzez inteligentną izolację szumu (zadań niepilnych i nieważnych).

**Kluczowe Elementy:**
- **Drugi Stopień Quizu dla Q4:** Podział szumu na cztery szuflady:
  1. ***Rozrywka*** - Gry, social media, Netflix (świadomy downtime)
  2. ***Hobby*** - Zainteresowania, projekty poboczne (passion projects)
  3. ***Side-questy*** - Pomysły na przyszłość, "kiedyś może"
  4. ***Optymalizacja*** - Research narzędzi, produktywność porn (procrastination disguised)

- **Mechanizm Destrukcyjny "Odrzuć / Zapomnij":**
  - Specjalna opcja w Quizie Q4: "Po prostu zapomnij"
  - Umożliwia natychmiastowe porzucenie myśli **bez zapisywania jej w bazie danych**
  - Daje psychologiczne przyzwolenie na odpuszczenie
  - **ADHD Insight:** "Out of sight, out of mind" - jeśli nie zapiszemy, przestaje istnieć

**Rezultat:** Q4 przestaje być "graveyardem" niezrealizowanych pomysłów - staje się świadomym wyborem "nie teraz" lub "nigdy".

---

### 3.2 Podsumowanie Zakresu Funkcjonalnego Fazy 1

| Moduł | Opis | Status |
|-------|------|--------|
| **Inbox Capture (Q0)** | Potok Brain Dump bez barier decyzyjnych | ✅ Wdrożone |
| **Kwalifikacja Makro (Q1-Q4)** | Quiz + synchroniczny derived state | ✅ Wdrożone |
| **Centrum Planowania (Q2)** | Sub-matryca 2x2 z mikro-kategoriami | ✅ Wdrożone |
| **Hub Logistyki (Q3)** | Intra-quadrant branching + kontekst czasowy | 🔄 W trakcie |
| **Archiwum Q4** | System izolacji szumu + "Zapomnij" | 📋 W planach |
| **Cyberpunk Timer** | 7 presetów, Delta Timestamp, PWA Audio | ✅ Wdrożone |
| **System Notatek** | Linked Notes + Free Notes | 📋 W planach |

### 3.3 Architektura Techniczna

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Baza Danych:** Dexie.js (IndexedDB wrapper) - local-only
- **PWA:** Service Worker, manifest.json, offline-first
- **UX:** Mobile-first (480px constraint), cyberpunk neon design

### 3.4 Implementacja Techniczna Przepływu Pytań (Intra-Quadrant Branching)

System "Deep Context Sub-Matrix" wymaga zaawansowanej maszyny stanów w komponencie `QuizModal`, umożliwiającej płynne przejście od kwalifikacji makro do mikro bez zamykania modalu.

#### Architektura Stanów Quizu

```typescript
type QuizStep = 
  | 'title'      // Wprowadzenie tytułu zadania
  | 'quiz'       // 2 pytania binarne (Ważność + Pilność)
  | 'subcategory' // Drugi stopień - wybór mikro-kontekstu
  | 'review';    // Podsumowanie przed zapisem
```

#### Flow Kwalifikacji Dwustopniowej

```
┌──────────────┐     ┌──────────────┐     ┌───────────────────┐
│   STEP 1     │     │   STEP 2     │     │     STEP 3        │
│   'title'    │────►│   'quiz'     │────►│  'subcategory'    │
│              │     │              │     │  (conditional)    │
│ Wpisz tytuł  │     │ Odpowiedz na │     │                   │
│ zadania      │     │ 2 pytania    │     │ IF quadrant > 1:  │
│              │     │ binarne      │     │  - Pokaż ekran    │
│              │     │              │     │    dedykowany dla │
│              │     │              │     │    Q2/Q3/Q4       │
│              │     │              │     │  - Nie zamykaj    │
│              │     │              │     │    modalu!        │
└──────────────┘     └──────────────┘     └───────────────────┘
                           │                       │
                           ▼                       ▼
                    ┌──────────────┐      ┌──────────────┐
                    │  Synchroniczny│      │  Wybór       │
                    │  Derived State│      │  subcategory │
                    │               │      │  (string)    │
                    │  predictedQuadrant  │              │
                    │  = calculate()│      │  - Q2: Rutyny│
                    │               │      │  - Q3: Teraz │
                    │  Wyliczanie   │      │  - Q4: Hobby │
                    │  natychmiastowe│     │              │
                    │  (brak async) │      └──────┬───────┘
                    └──────────────┘             │
                                                 ▼
                                          ┌──────────────┐
                                          │   STEP 4     │
                                          │  'review'    │
                                          │              │
                                          │  Podgląd     │
                                          │  finalny     │
                                          │              │
                                          └──────┬───────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │  ZAPIS LUB   │
                                          │ REKALSYFI-   │
                                          │ KACJA        │
                                          │              │
                                          │ db.tasks.add │
                                          │     lub      │
                                          │ db.tasks.update
                                          └──────────────┘
```

#### Kluczowe Mechanizmy Implementacyjne

**1. Synchroniczny Derived State (ADR 004)**

```typescript
// W useQuizForm.ts - stan pochodny wyliczany natychmiastowo
const predictedQuadrant = useMemo(() => {
  if (answers.importance === null || answers.urgency === null) return null;
  return classifyFromScores(answers.importance, answers.urgency);
}, [answers.importance, answers.urgency]);
```

Zalety:
- Brak `useEffect` + `setState` = brak race conditions
- Modal reaguje natychmiast na zmianę odpowiedzi
- UI nie "przeskakuje" - płynna aktualizacja

**2. Conditional Rendering Sub-Step**

```typescript
// W QuizModal.tsx
{step === 'subcategory' && predictedQuadrant !== null && predictedQuadrant > 1 && (
  <SubcategoryScreen 
    quadrant={predictedQuadrant} 
    onSelect={handleSubcategorySelect}
  />
)}
```

**3. SubcategoryScreen - Komponent Dedykowany**

Każda ćwiartka z podkategoriami ma własny layout:

- **Q2Screen:** Grid 2x2 z 4 kartami planistycznymi (Rutyny, Projekty, Ogólne Cele, Inne)
- **Q3Screen (Hub Logistyki):** List view z quick-actions, grupowanie czasowe
- **Q4Screen (Archiwum):** 4 kategorie + przycisk "Zapomnij" (destructive action)

**4. Guardrails - Ochrona Przed Błędami**

```typescript
// Nie pozwól przejść do 'subcategory' jeśli quadrant <= 1 (Q0 lub Q1)
const canProceedToSubcategory = 
  predictedQuadrant !== null && 
  predictedQuadrant > 1 &&
  step === 'quiz';
```

#### Integracja z Dexie.js

Po wyborze subkategorii, obiekt zadania zawiera:

```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 0 | 1 | 2 | 3 | 4;  // Makro-kwalifikacja
  subcategory?: string;           // Mikro-kwalifikacja (Q2/Q3/Q4)
  // ... pozostałe pola
}

// Przykładowy zapis
await db.tasks.add({
  title: "Wymiana żarówki",
  quadrant: 3,
  subcategory: "Zrób teraz",  // Hub Logistyki - kontekst "teraz"
  completed: false,
});
```

#### UX Decyzje Krytyczne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Nie zamykamy modalu** między krokami | Utrzymanie kontekstu, redukcja cognitive load |
| **Animacja przejścia** | Slide/fade między 'quiz' → 'subcategory' - płynność wizualna |
| **Przycisk "Wstecz"** | Możliwość cofnięcia do poprzedniego kroku bez utraty danych |
| **Progress indicator** | Wizualny wskaźnik: "Krok 2 z 3" - orientacja w procesie |

---

### 3.5 Kluczowe Decyzje UX (ADHD-Proof)

- **Zero friction entry** - otwórz aplikację, zacznij zrzucać myśli
- **Paraliż decyzyjny eliminowany** - quiz klasyfikuje za użytkownika
- **Visual persistence** - neonowe ćwiartki zawsze widoczne
- **Elastyczne domknięcie** - 3 opcje zakończenia sesji timera

### 3.6 KPI Sukcesu Fazy 1

- [x] Czas do pierwszego zadania < 2 min
- [x] Offline functionality 100%
- [x] Mobile UX bez poziomego scrolla
- [x] 7 timer presets (ADHD-proof, brak "custom")

---

## 4. Faza 2: Multi-Device Sync (PLANOWANA)

> **Status:** 📋 Planowana (Q3 2026)  
> **Cel:** Opcjonalna synchronizacja między urządzeniami bez utraty prywatności

### 4.1 Zakres Funkcjonalny

| Funkcja | Opis | Priorytet |
|---------|------|-----------|
| **CRDT Sync** | Conflict-free Replicated Data Type dla zadań | Wysoki |
| **WebRTC/Cloud** | Synchronizacja peer-to-peer lub opcjonalna chmura | Średni |
| **Backup/Restore** | Eksport/import danych (JSON) | Wysoki |
| **Device Pairing** | Parowanie telefonu z desktop | Średni |

### 4.2 Architektura Techniczna

```
┌─────────────────────────────────────────────────────────────┐
│                     FOCUSFLOW 2.0                          │
│                   (Local-First Core)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │   Telefon    │◄────►│   Desktop    │                   │
│  │  (IndexedDB) │ Sync │  (IndexedDB) │                   │
│  └──────────────┘      └──────────────┘                   │
│         ▲                      ▲                           │
│         └──────────┬───────────┘                           │
│                    ▼                                       │
│            ┌──────────────┐                               │
│            │  Sync Layer  │                               │
│            │  (CRDT/Web)  │                               │
│            └──────────────┘                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Kluczowe Decyzje UX

- **Opt-in sync** - synchronizacja jest opcjonalna, nie wymuszona
- **Privacy-first** - dane mogą być szyfrowane end-to-end
- **Conflict resolution** - CRDT automatycznie rozwiązuje konflikty
- **Offline survival** - sync działa w tle, nie blokuje UI

### 4.4 Kryteria Akceptacji

- [ ] Synchronizacja < 5 sekund przy zmianie
- [ ] Automatyczne rozwiązywanie konfliktów (bez interakcji użytkownika)
- [ ] E2E encryption dla wrażliwych danych
- [ ] Fallback do local-only w przypadku problemów

---

## 5. Faza 3: Dopamine Gamification (WIZJA)

> **Status:** 🔮 Wizja (2027+)  
> **Cel:** System nagród i historii sukcesów jako tarcza anty-prokrastynacyjna

### 5.1 Zakres Funkcjonalny

| Funkcja | Opis | Intencja |
|---------|------|----------|
| **Seria Dni (Streak)** | Licznik consecutive days z completed sessions | "Don't break the chain" |
| **Historia Sukcesów** | Archiwum ukończonych zadań z datami | Tarcza przeciw RSD (Rejection Sensitive Dysphoria) |
| **Bezkarne Resetowanie** | Możliwość zresetowania streak bez winy | ADHD-proof gamification |
| **Visual Rewards** | Animacje, odznaki, cyberpunkowe "level up" | Dopaminowa nagroda |
| **Gentle Reminders** | Miękkie przypomnienia bez guilt-tripping | Compassion over productivity |

### 5.2 Architektura Psychologiczna (ADHD-Proof)

#### 5.2.1 Bezkarne Resetowanie Passy

Standardowe streak apps używają guilt-tripping ("Straciłeś 30-dniową passę!")

**FocusFlow Approach:**
- "Resetuj passę" - bez shame, bez komunikatów o porażce
- "Nowy start" - pozytywne framing
- "Pacjent zero" - akceptacja, że ADHD brain ma swoje dni

#### 5.2.2 Historia Sukcesów jako Tarcza RSD

Rejection Sensitive Dysphoria (RSD) to ekstremalna wrażliwość na odrzucenie u osób z ADHD.

**Solution:**
- Archiwum wszystkich ukończonych zadań
- Visual proof: "Zrobiłeś X zadań w tym miesiącu"
- Counter-act negatywnej samooceny

#### 5.2.3 Dopaminowe Milestones

- Co 10 ukończonych zadań: mała animacja
- Co 50: "cyberpunk badge"
- Sesja 25/5 ukończona: gratulacje, nie guilt

### 5.3 Kryteria Akceptacji

- [ ] Brak shame language w UI
- [ ] Reset streak bez potwierdzenia (1-click)
- [ ] Historia sukcesów zawsze dostępna (visual proof)
- [ ] Animacje < 2 sekundy (nie blokują flow)
- [ ] Opcja wyłączenia gamification dla użytkowników, którzy tego nie chcą

---

## 6. Mapa Czasowa (Timeline)

```
2026-Q2          2026-Q3          2026-Q4          2027+
   │                │                │               │
   ▼                ▼                ▼               ▼
┌──────┐      ┌──────────┐     ┌──────────┐    ┌──────────┐
│ FAZA │      │   FAZA   │     │   FAZA   │    │   FAZA   │
│  1   │──────►    2     │────►│  2 (CD)  │───►│    3     │
│ MVP  │      │ Sync Dev │     │ Sync Rel │    │   Fun    │
└──────┘      └──────────┘     └──────────┘    └──────────┘
   │                │                │               │
   ✅               📋               📋              🔮
(Local-First)  (Multi-Device)  (Stabilization)  (Gamification)
```

---

## 7. Decyzje Strategiczne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Local-first** | Zero bariery wejścia (brak rejestracji), maksymalna prywatność |
| **Opt-in sync** | Nie wymuszamy zależności zewnętrznych |
| **ADHD-proof gamification** | Compassion over productivity, bez guilt-tripping |
| **CRDT over REST** | Offline-first, conflict resolution bez server-side logic |
| **No AI/ML** | Redukcja complexity, brak zależności od zewnętrznych API |

---

## 8. Powiązane Dokumenty

- `docs/business/goals.md` - Cele biznesowe i User Journey
- `docs/business/glossary.md` - Terminologia projektowa
- `docs/plans/01_strategy/02_pre_mortem_audit.md` - Audyt ryzyka i scenariusze porażki
- `docs/architecture/adr/adr_005_pwa_offline_first.md` - Decyzja architektoniczna PWA
