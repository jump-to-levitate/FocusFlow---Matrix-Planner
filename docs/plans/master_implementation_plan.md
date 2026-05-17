# GŁÓWNY PLAN IMPLEMENTACJI (MASTER IMPLEMENTATION PLAN)

> Wersja: 1.0  
> Data: Maj 2026  
> Status: Architektoniczna Mapa Drogowa

---

## 1. Wstęp i Filozofia Systemu

FocusFlow to **minimalistyczny, local-first, cyberpunkowy planer** oparty na matrycy Eisenhowera, zaprojektowany specjalnie pod kątem redukcji paraliżu decyzyjnego i barier wykonawczych u osób neuroatypowych (ADHD/ASD).

### 1.1 Misja Produktu

Zastąpić **chaos mentalny** spowodowany executive dysfunction strukturą, która:
- **Myśli za użytkownika** (auto-klasyfikacja przez Smart Quiz)
- **Wymusza granice** (twardy limit Q1, mikro-kategoryzacja Q2/Q3/Q4)
- **Działa natychmiast** (offline-first, zero rejestracji)
- **Nie karze** (compassion-based UX, bez guilt-tripping)

### 1.2 Kluczowa Zasada Architektoniczna

**Dwustopniowa, Głęboka Kategoryzacja Zadań (Deep Context Sub-Matrix):**

Standardowe matryce Eisenhowera kończą się na 4 ćwiartkach. FocusFlow wprowadza **drugi stopień klasyfikacji** - mikro-kontekst wykonawczy wewnątrz ćwiartek 2, 3 i 4.

**Dlaczego to działa dla ADHD:**
- Ćwiartka Q2 (Ważne, Niepilne) to "czarna dziura" - zadania tam trafiają, ale nigdy nie są wykonywane
- Subkategoryzacja (Rutyny/Projekty/Cele) daje **natychmiatowy kontekst egzekucji**
- Zamiast "zrobić kiedyś" → "to jest rutyna na autopilocie" lub "to wymaga bloku deep work"

---

## 2. Architektura Przepływu Zadań (Task Pipeline Lifecycle)

Pełna ścieżka życia zadania w systemie - od chaosu mentalnego do dopaminowego domknięcia:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    TASK PIPELINE LIFECYCLE                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  CHAOS ───────► STRUKTURA ───────► KONTEKST ───────► EGZEKUCJA ─────► DOMKNIĘCIE│
│                                                                                 │
│  ┌─────────┐   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐  │
│  │ KROK 0  │   │  KROK 1  │    │  KROK 2  │    │  KROK 3  │    │   KROK 4   │  │
│  │ Brain   │──►│ Macro    │───►│ Micro    │───►│ Focus    │───►│ 3-Way      │  │
│  │ Dump    │   │ Qualify  │    │ Context  │    │ Engine   │    │ Close      │  │
│  │ (Q0)    │   │ (Quiz)   │    │ (Sub-Q)  │    │ (Timer)  │    │            │  │
│  └─────────┘   └──────────┘    └──────────┘    └──────────┘    └────────────┘  │
│       │              │               │               │               │           │
│       ▼              ▼               ▼               ▼               ▼           │
│  ┌─────────┐   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐  │
│  │Zero     │   │Derived   │    │Rutyny    │    │Cyberpunk │    │Odrzuć      │  │
│  │Friction │   │State     │    │Projekty  │    │Timer     │    │Kontynuuj   │  │
│  │Capture  │   │Sync      │    │Teraz     │    │Delta     │    │Ukończ      │  │
│  │         │   │Calculate │    │Blok      │    │Timestamp │    │            │  │
│  └─────────┘   └──────────┘    └──────────┘    └──────────┘    └────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.1 Krok 0: Brain Dump (Poczekalnia Q0)

**Intencja:** Bezwysiłkowy zrzut myśli bez nadawania priorytetów. Czyszczenie pamięci podręcznej mózgu.

**Problem ADHD:** 50 pomysłów/dzień, 0 egzekucji. Pamięć robocza przepełniona.

**Rozwiązanie:**
- **Q0 jako izolowany inbox** - fizycznie oddzielony od macierzy głównej
- **Brak klasyfikacji przy dodawaniu** - tylko tytuł, enter, done
- **Visual dump** - wszystko "wylewa się" z głowy na ekran

**Implementacja:**
- Dedykowany ekran Q0 z textarea + lista
- Nie ma tu Smart Quiz - to celowo
- Przycisk "Przejdź do Quizu" - klasyfikacja jest **opcjonalnym kolejnym krokiem**, nie wymogiem

---

### 2.2 Krok 1: Kwalifikacja Makro (The Quiz)

**Intencja:** Maszyna stanów formularza pre-fill oblicza przynależność do jednej z 4 głównych ćwiartek Macierzy Core.

**Problem ADHD:** Paraliż decyzyjny przy ręcznym wybieraniu ćwiartki ("Gdzie to dać?")

**Rozwiązanie:**
- **2 pytania binarne** (Tak/Nie) zamiast skali 1-5:
  1. "Czy przybliża Cię to do celu?" (Ważność)
  2. "Czy masz twardy termin?" (Pilność)
- **Synchroniczny Derived State** - `predictedQuadrant` wyliczany natychmiastowo przez `useMemo`
- **Brak race conditions** - stan nie przeskakuje, nie ma "ghost UI"

**Logika Klasyfikacji:**
```
Ważne + Pilne     = Q1 (Crunch)
Ważne + Niepilne  = Q2 (Deep Planning)
Nieważne + Pilne  = Q3 (Life Admin)
Nieważne + Niepilne = Q4 (Noise)
```

**Implementacja Techniczna:**
- `useQuizForm.ts` - custom hook z maszyną stanów
- `QuizStep = 'title' | 'quiz' | 'subcategory' | 'review'`
- ADR 004: Synchronous Derived State for Form State Machines

---

### 2.3 Krok 2: Kwalifikacja Mikro (Deep Context)

**Intencja:** Jeśli zadanie trafia do Q2, Q3 lub Q4, system uruchamia **drugi stopień pytań** (Intra-Quadrant Branching), przypisując je do specyficznych szuflad wykonawczych.

**Problem ADHD:** Q2 to "cemetery of good intentions" - zadania tam trafiają i giną.

**Rozwiązanie - Trzy Strefy Mikro-Kontekstu:**

#### **Q2: Centrum Planowania (The Planning Center)**
| Szuflada | Ikona | Kontekst Wykonawczy |
|----------|-------|---------------------|
| **Rutyny** | 🔄 | Autopilot - nawyki powtarzalne bez decyzji |
| **Projekty** | 📁 | Deep work blocks - złożone cele wieloetapowe |
| **Ogólne Cele** | 🎯 | Future consideration - kierunki bez planu |
| **Inne** | 💼 | Misc - reszta planistyczna |

#### **Q3: Hub Logistyki (Life Admin - Proza Życia)**
| Szuflada | Kryterium | Intencja |
|----------|-----------|----------|
| **Zrób teraz** | < 10 minut | Natychmiastowa egzekucja bez planowania |
| **Zaplanuj blok** | Sprint zbiorczy | "Sobota 10:00 - Proza życia" |
| **W przerwie** | Low energy | Mechaniczny reset mózgu (pranie, naczynia) |

#### **Q4: Archiwum (Noise Isolation)**
| Szuflada | Typ Szumu |
|----------|-----------|
| **Rozrywka** | Świadomy downtime (Netflix, gry) |
| **Hobby** | Passion projects bez deadline'u |
| **Side-questy** | "Kiedyś może" - pomysły na przyszłość |
| **Optymalizacja** | Productivity porn (procrastination disguised) |
| **🗑️ Zapomnij** | Mechanizm destrukcyjny - usuń bez zapisu |

**Implementacja Techniczna:**
- Rozszerzenie schematu Dexie: `subcategory?: string`
- Conditional rendering w `QuizModal` - step `'subcategory'` pojawia się tylko gdy `quadrant > 1`
- Dedykowane komponenty: `Q2SubcategoryScreen`, `Q3HubScreen`, `Q4ArchiveScreen`

---

### 2.4 Krok 3: Egzekucja (Focus Engine)

**Intencja:** Praca z zadaniem przy użyciu cyberpunkowego Timera opartego na architekturze **Unix Delta Timestamp** (odpornego na usypianie kart).

**Problem ADHD:** Background throttling - przeglądarka usypia JS gdy karta jest w tle. Timer "gubi" czas.

**Rozwiązanie:**
- **Delta Timestamp Architecture** - zapis `startTime` (Unix timestamp) + obliczanie `timeLeft = duration - (now - startTime)` przy każdym wake-up
- **7 dopaminowych presetów** - 5, 10, 15, 25, 45, 60, 90 minut
- **Brak opcji "Custom"** - eliminacja paraliżu wyboru czasu trwania
- **Global Timer State** - React Context dostępny z każdego ekranu

**Presety Timerów (ADHD-Proof):**
| Preset | Use Case | Dopaminowy Triger |
|--------|----------|-------------------|
| 5 min | Quick win, startup | "Tylko 5 minut" |
| 10 min | Micro-task | "Prawie instant" |
| 15 min | Short focus | "Jedna pomodoro" |
| 25 min | Standard focus | "Jedna pomodoro" |
| 45 min | Deep work | "Blok czasowy" |
| 60 min | Extended focus | "Godzina mocy" |
| 90 min | Flow state | "Deep work session" |

**Implementacja Techniczna:**
- `TimerContext.tsx` - global state: `timeLeft`, `timerState`, `activeTaskId`
- `Unix delta calculation` - `Date.now()` comparison on every tick/wake-up
- ADR 003: Timer Delta Timestamp Architecture

---

### 2.5 Krok 4: Dopaminowe Domknięcie (3-Way Close)

**Intencja:** Bezkarne zakończenie sesji bez poczucia winy lub przymusu.

**Problem ADHD:** All-or-nothing thinking - "nie skończyłem = porażka"

**Rozwiązanie - Trzy Opcje Zakończenia:**

| Opcja | Akcja | Psychologiczna Intencja |
|-------|-------|-------------------------|
| **🔙 Wróć Później** | Zatrzymaj timer, nie kompletuj zadania | "Przerwa jest OK" |
| **🔄 Jeszcze Jedna** | Zresetuj timer, zachowaj to samo zadanie | "Flow continuation" |
| **✅ Ukończ Zadanie** | Oznacz jako zrobione, wyczyść `activeTaskId` | "Achievement unlocked" |

**Implementacja Techniczna:**
- `CompletionModal` - globalny modal w `App.tsx`
- Type-safe ID handling: `await db.tasks.update(activeTaskId as number, {...})`
- Dexie.js transaction safety

---

## 3. Status Wdrożenia Modułów (Stan na Maj 2026)

### [100% WDROŻONE] Moduł A: Podstawa Systemu i Baza Danych

| Komponent | Opis | ADR |
|-----------|------|-----|
| **Dexie.js Schema** | IndexedDB wrapper, local-only | ADR 001 |
| **Q0 Isolation** | Fizyczna separacja Inbox od Matrix | ADR 002 |
| **Task Interface** | `id, title, quadrant, subcategory?, completed, ...` | - |
| **Offline-First** | Service Worker, cache-first | ADR 005 |

**Dowód Wdrożenia:**
- `app/src/db/dexie.ts` - pełna definicja schematu
- Q0 działa jako osobny ekran (`MatrixScreen` z `viewMode = 'q2' | 'main'`)

---

### [100% WDROŻONE] Moduł B: Cyberpunk Focus Timer

| Komponent | Opis | Status |
|-----------|------|--------|
| **Delta Engine** | Unix timestamp-based, throttling-proof | ✅ |
| **7 Presets** | 5/10/15/25/45/60/90 min, brak "Custom" | ✅ |
| **Global Context** | TimerProvider wrapujący całą aplikację | ✅ |
| **Cyberpunk UI** | SVG progress clock, neon glow, glitch text | ✅ |
| **PWA Audio** | Web Audio API, gesture unlock, Sound FX | ✅ |
| **3-Way Modal** | CompletionModal z trzema opcjami | ✅ |

**Dowód Wdrożenia:**
- `app/src/context/TimerContext.tsx` - global state
- `app/src/screens/TimerScreen.tsx` - cyberpunk UI
- `app/src/types/timer.ts` - 7 presetów zablokowanych

---

### [100% WDROŻONE] Moduł C: Centrum Planowania (Sub-Matrix Q2)

| Komponent | Opis | Szczegóły |
|-----------|------|-----------|
| **Schema Extension** | Pole `subcategory?: string` w Dexie | ✅ |
| **Sub-Screen 2x2** | Grid: Rutyny, Projekty, Cele, Inne | ✅ |
| **Design System** | `h-14` headers, `whitespace-nowrap`, laser borders | ✅ |
| **Task Grouping** | Grupowanie zadań Q2 według `subcategory` | ✅ |
| **Navigation** | Przycisk "Planuj" w karcie Q2 otwiera sub-view | ✅ |

**Dowód Wdrożenia:**
- `app/src/screens/MatrixScreen.tsx` - `renderQ2SubScreen()`
- `subcategoryConfig` - konfiguracja 4 szuflad
- Sztywne tokeny UI: `h-14`, `whitespace-nowrap`

---

### [W TRAKCIE / PLANOWANE] Moduł D: Hub Logistyki (Sub-Matrix Q3 - Proza Życia)

**Zakres:** Drugi stopień kwalifikacji dla zadań pilnych/nieważnych na podstawie energii i czasu.

**Trzy Szuflady Wykonawcze:**
1. ***Zrób teraz*** - Zadania < 10 min, natychmiastowa egzekucja
2. ***Zaplanuj blok*** - Sprint logistyczny (np. "Sobota 10:00")
3. ***W przerwie*** - Low-energy tasks jako "brain reset"

**Interfejs:**
- Uproszczony, seryjny layout listy
- Quick-actions: "Zrobione", "Do bloku", "W przerwie"
- Grupowanie według kontekstu czasowego

**Status Implementacji:**
- [x] Schemat bazy gotowy (`subcategory` wspiera Q3)
- [ ] UI komponent `Q3HubScreen`
- [ ] Intra-quadrant branching w Quizie
- [ ] Dedykowany widok w MatrixScreen

**Pliki Do Utworzenia:**
- `app/src/components/Q3HubScreen.tsx`
- Update `useQuizForm.ts` - logika branching dla Q3

---

### [PLANOWANE] Moduł E: Archiwum "Nie Teraz" (Sub-Matrix Q4)

**Zakres:** Izolacja szumu mentalnego + mechanizm psychologicznego "puszczania"

**Cztery Szuflady Szumu:**
1. **Rozrywka** - Świadomy downtime
2. **Hobby** - Passion projects
3. **Side-questy** - "Kiedyś może"
4. **Optymalizacja** - Procrastination disguised as productivity

**Mechanizm Destrukcyjny "Odrzuć / Zapomnij":**
- Specjalna opcja w Quizie Q4
- **Nie zapisuje** zadania do bazy danych
- Daje psychologiczne przyzwolenie na odpuszczenie
- ADHD Insight: "Out of sight, out of mind" - jeśli nie zapiszemy, przestaje istnieć

**Status Implementacji:**
- [ ] UI komponent `Q4ArchiveScreen`
- [ ] Opcja "Zapomnij" w QuizModal
- [ ] Dedykowany widok archiwum

**Pliki Do Utworzenia:**
- `app/src/components/Q4ArchiveScreen.tsx`
- Update `QuizModal.tsx` - destructive action "Zapomnij"

---

## 4. Przyszłe Fazy Strategiczne (Poza MVP)

### 4.1 Faza 2: Multi-Device Cross-Sync

**Cel:** Bezpieczna, opcjonalna synchronizacja danych między urządzeniami bez konieczności tworzenia tradycyjnych kont.

**Technologia:**
- **CRDT (Conflict-free Replicated Data Types)** - automatyczne rozwiązywanie konfliktów
- **WebSync / WebRTC** - peer-to-peer lub opcjonalna chmura
- **E2E Encryption** - dane szyfrowane end-to-end
- **Opt-in** - użytkownik musi świadomie włączyć sync

**Kryteria:**
- Synchronizacja < 5 sekund
- Brak utraty danych przy konfliktach
- Zero-knowledge (my nie widzimy danych użytkownika)

---

### 4.2 Faza 3: ADHD-Proof Gamification

**Cel:** Wizualna historia sukcesów bez mechanizmów karania za utratę passy.

**Problemy Standardowych Systemów Gamification:**
- Streak apps: "Straciłeś 30-dniową passę!" → shame, RSD trigger
- Leaderboards: Porównywanie z innymi → anxiety
- Punishment: Utrata progressu → demotywacja

**FocusFlow Approach - Compassion-Based:**

| Mechanizm | Implementacja | Intencja |
|-----------|---------------|----------|
| **Historia Sukcesów** | Archiwum wszystkich ukończonych zadań z datami | Visual proof przeciw RSD |
| **Gentle Streak** | Licznik consecutive days, ale... | Motywacja bez pressure |
| **Bezkarne Resetowanie** | 1-click reset, bez komunikatów o porażce | "Nowy start", nie shame |
| **Dopaminowe Milestones** | Co 10 zadań: mała animacja | Nagroda, nie punishment |
| **Pacjent Zero** | Akceptacja, że ADHD brain ma swoje dni | Self-compassion |

**Kluczowa Zasada:**
> "Compassion over productivity. Progress over perfection."

---

## 5. Powiązane Dokumenty

| Dokument | Opis |
|----------|------|
| `docs/plans/01_strategy/01_mvp_roadmap.md` | Szczegółowy roadmap z fazami 1A-1D |
| `docs/architecture/adr/adr_003_timer_delta.md` | Architektura timera Delta Timestamp |
| `docs/architecture/adr/adr_004_sync_derived_state.md` | Synchroniczny Derived State |
| `docs/architecture/adr/adr_005_pwa_offline_first.md` | Decyzja PWA offline-first |
| `docs/plans/02_features/03_centrum_planowania_q2.md` | Specyfikacja Centrum Planowania |
| `docs/business/adhd_persona.md` | Profil użytkownika ADHD |

---

**Last Updated:** Maj 2026  
**Next Review:** Po wdrożeniu Modułu D (Hub Logistyki Q3)
