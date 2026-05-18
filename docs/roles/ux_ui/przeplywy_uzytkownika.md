# Przepływy Użytkownika (User Flows)

> User Flow Specification  
> Document ID: UX-FLOWS-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Principal Product Designer

---

## 1. Odwrócony Potok Klasyfikacji (Reversed Classification Pipeline)

### 1.1 Architektura Flow

Zaimplementowany przepływ **zmniejszający** obciążenie decyzyjne (zamiast tradycyjnego: ćwiartka → zadanie):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              REVERSED CLASSIFICATION PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   STEP 1              STEP 2                   STEP 3              STEP 4   │
│                                                                             │
│  ┌─────────┐         ┌─────────────┐         ┌─────────────┐      ┌────────┐  │
│  │  TITLE  │────────►│    QUIZ     │────────►│   CONFIRM   │─────►│ SUB-CAT│  │
│  │ (Q0)    │         │  (2 Qs)     │         │ (Macro Q)   │      │(Micro) │  │
│  │         │         │  Derived    │         │  Manual     │      │ Q2/Q3/ │  │
│  │         │         │  State      │         │  Override   │      │   Q4   │  │
│  └─────────┘         └─────────────┘         └─────────────┘      └────────┘  │
│                                                                             │
│   Brain Dump      Macro Qualification      Visual Confirm         Deep Context│
│   (No Decisions)  (Algorithmic)            (Override Option)        (Sub-Matrix)│
└─────────────────────────────────────────────────────────────────────────────┘
```

**Kluczowe założenie:** Użytkownik nie wybiera ćwiartki - ona jest **wyliczona** przez algorytm na podstawie odpowiedzi na 2 pytania binarne.

### 1.2 Szczegółowy Flow

| Krok | Interakcja | Stan Systemu | Output |
|------|------------|--------------|--------|
| **STEP 1** | Użytkownik wpisuje tytuł zadania | `currentStep: 'title'` | Dane wejściowe dla kwalifikacji |
| **STEP 2** | Odpowiada na 2 pytania binarne | `importanceAnswer`, `urgencyAnswer` | Binary input (0/1) |
| **STEP 3** | System wylicza predykcję | `useMemo: predictedQuadrant` | Quadrant 1/2/3/4 |
| **STEP 4** | Ekran potwierdzenia + override | `currentStep: 'confirm'` | Final quadrant + manual override option |
| **STEP 5** | Sub-kategoryzacja (dla Q2/Q3/Q4) | `currentStep: 'subcategory'` | Deep context classification |

---

## 2. Cykl Życia Zadań (Task Pipeline Lifecycle)

### 2.1 Pełna Ścieżka: Od Chaosu do Egzekucji

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

### 2.2 Stany Zadania (State Machine)

```
[CREATED in Q0] → [QUALIFYING via Quiz] → [ASSIGNED to Q1/Q2/Q3/Q4] → [ACTIVE in Timer] → [COMPLETED | ARCHIVED]
       │
       └── [DISCARDED via Destructive Hatch (Q4 only)]
```

---

## 3. Szczegółowe Scenariusze

### 3.1 Seryjny Zrzut Myśli (Brain Dump)

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

**Technicznie:**
- Q0 ma własny route (`/q0`) lub jest domyślnym ekranem
- Zadania w Q0 mają flagę `quadrant: 0`
- Szybki zapis do IndexedDB bez walidacji

---

### 3.2 Dwustopniowy Quiz (Intra-Quadrant Branching)

**Intencja:** Automatyczna klasyfikacja bez paraliżu decyzyjnego.

#### ETAP 1: KWALIFIKACJA MAKRO (2 Pytania Binarne)

```
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
```

**Derived State (useMemo):**
```typescript
const predictedQuadrant = calculate(
  importanceAnswer,  // Q1/Q2 = Yes, Q3/Q4 = No
  urgencyAnswer        // Q1/Q3 = Yes, Q2/Q4 = No
);
// Q1 = Important + Urgent
// Q2 = Important + Not Urgent  
// Q3 = Not Important + Urgent
// Q4 = Not Important + Not Urgent
```

#### ETAP 2: KWALIFIKACJA MIKRO (Conditional)

```
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
```

**Zapis do Dexie:**
```typescript
db.tasks.add({
  title: "Zadzwonić do dentysty",
  quadrant: 2,  // Q2
  subcategory: "rutyna",  // Micro-context
  createdAt: Date.now()
});
```

#### Flow Decyzyjny per Quadrant:

| Quadrant | Flow | Subkategorie |
|----------|------|--------------|
| **Q1** | Natychmiastowy zapis (brak subkategorii) | N/A - Crunch Mode |
| **Q2** | Sub-matryca 2x2 (4 opcje) | Rutyny, Projekty, Cele, Inne |
| **Q3** | Hub z 4 szufladami | Zrób teraz, Zaplanuj blok, W przerwie, Inne |
| **Q4** | 4 szuflady + Destructive Hatch | Rozrywka, Hobby, Optymalizacja, Side-questy |

---

### 3.3 Mechanizm Focus Engine (Timer)

**Intencja:** Deep work bez rozpraszania. Tylko jedno zadanie, tylko zegar.

#### Ekran Focus Mode:

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
```

**Zasady konstrukcyjne:**
- **Single task focus** - tylko jedno zadanie wyświetlane pod zegarem
- **No scroll** - wszystko mieści się na ekranie bez scrollowania
- **Centered layout** - zegar na środku, przyciski pod nim (thumb-friendly)
- **Neon Green Glow** - Q1 urgency = zielony neon jako sygnał "pilne"

#### 3-Way Strategic Close (Po Zakończeniu Sesji):

```
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

**Compassion-Based Design:**
- Brak kar za "nie dokończenie"
- Neutralne opcje: "Wrócę później" zamiast "Porażka"
- Szybki restart: "Jeszcze jedna sesja" bez konfiguracji

---

## 4. Mapowanie Przepływów na Quadrants

| Quadrant | Główny Flow | Sub-Flow | Primary Entry Point |
|----------|-------------|----------|---------------------|
| **Q0** | Brain Dump | Seryjny zrzut | `/` lub `/q0` |
| **Q1** | Focus Timer | Deep Work | TimerScreen |
| **Q2** | Centrum Planowania | 2x2 Sub-Matrix | `/q2/rutyny`, `/q2/projekty` |
| **Q3** | Hub Logistyki | 2x2 Sub-Matrix | `/q3/teraz`, `/q3/blok`, `/q3/przerwa` |
| **Q4** | Archiwum | Destructive Hatch | `/q4/rozywka`, `/q4/hobby` |

---

## 5. Bypass Quizu (Quiz Bypass)

### 5.1 Szybkie Dodawanie z Pod-Widoków

Dla użytkowników dodających zadań bezpośrednio z pod-widoków Q2/Q3/Q4:

```typescript
// Quiz bypass - pominięcie pytań binarnych
<AddTaskButton 
  initialQuadrant={2}  // lub 3, 4
  initialSubcategory="rutyna"  // pre-selected
/>
```

**Flow:**
```
[Q2 Sub-view] → [Add Task] → [Skip Quiz] → [Confirm & Save] → [Back to Q2]
```

**Race Condition Fix:**
Bezpośrednie przekazanie `subcategory` do Dexie.js zamiast async state update:
```typescript
await db.tasks.add({
  quadrant: initialQuadrant,
  subcategory: initialSubcategory,  // Pre-selected, no async gap
  title: taskTitle
});
```

---

**Document ID:** UX-FLOWS-001  
**Owner:** Principal Product Designer  
**Status:** APPROVED  
**Last Updated:** 2026-05-18
