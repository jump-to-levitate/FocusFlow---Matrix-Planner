# PLAN_003: User Journey Map - FocusFlow 2.0

> Complete User Journey Map for ADHD Brain Persona  
> Source: WF_User_Journey_Map.md + PDF str. 5-31

---

## Metadane

| Pole | Wartość |
|------|---------|
| **ID** | PLAN_003 |
| **Tytuł** | User Journey Map - FocusFlow 2.0 |
| **Status** | Draft |
| **Data** | 2026-05-14 |
| **Autor** | UX Research & Journey Architect |
| **Dependencies** | PLAN_RISK_002 (ICP ADHD Persona), PLAN_002 (Quiz Logic), design-system.md |
| **Primary ICP** | The ADHD Brain (22-40, executive dysfunction, object permanence issues) |

**Powiązane dokumenty:**
- PDF str. 5-31 - Wizualne referencje ekranów
- `docs/plans/PLAN_RISK_002_icp_persona.md` - ADHD UX Requirements
- `docs/plans/PLAN_002_brain_dump_quiz_logic.md` - Quiz flow logic
- `docs/design-system.md` - Visual design constraints
- `docs/architecture/system_overview.md` - Task model

---

## Success Metric (Co to jest "sukces użytkownika?")

Użytkownik ADHD będzie uważał FocusFlow za wartościowe narzędzie, jeśli:

> **"W ciągu 3 minut od otwarcia apki sklasyfikuje swoje pierwsze zadanie przez Quiz, nie czując paraliżu decyzyjnego, i zobaczy je w Q1 z neonowym przypomnieniem"**

### Key Success Indicators:
- Time from app open to first classified task: **< 3 min**
- Decision clicks: **max 3** (open → type → 2×Quiz answer → save)
- Visual confirmation: **immediate** (neon glow, animation)
- Zero "choice paralysis" moments

---

## Stage 1: Landing / Dashboard (0-30s)
**Screen:** `01 Pulpit` (PDF str. 15)

### What They See:
- **Headline:** "Twój dzisiejszy cel Q1" (Current Q1 Goal)
- **Value Prop:** Aktualny cel krytyczny (Q1) + "Kolejne w kolejce"
- **Quick Capture:** Brain Dump button (immediate access)
- **Navigation:** Bottom bar - Pulpit, Macierz, Wszystko, Brain Dump, Timer

### Visual Elements (str. 15):
- Glassmorphism cards dla zadań Q1
- Neon lime border dla high-priority tasks
- Licznik zadań w Q1 (e.g., "1/5")
- Progress indicator dla dzisiejszego celu

### Friction Points:
- [ ] **Issue:** Za dużo informacji na starcie (overwhelm)
  - **Solution:** Pokaż tylko TOP 1 zadanie Q1, reszta zwinięta
- [ ] **Issue:** User nie wie co zrobić (brak clear CTA)
  - **Solution:** "+ Dodaj pierwsze zadanie" prominent FAB button

### Aha Moment:
User thinks: **"Widzę dokładnie co MUSZĘ zrobić teraz, bez myślenia"** (External executive function kicks in)

### Navigation Options (str. 15 → str. 5, 16, 7):
| Action | Destination | PDF Ref |
|--------|-------------|---------|
| "Wszystko na dzisiaj" | Daily linear view | str. 5 |
| "Macierz" | Eisenhower Matrix 2×2 | str. 16 |
| "Brain Dump" | Quick notes capture | str. 7 |
| "+" FAB | Start Quiz (str. 18) | str. 18 |

---

## Stage 2: Brain Dump / Quiz Initiation (30s - 2min)
**Screen:** `03 Brain Dump Quiz` (PDF str. 18)

### Flow:
1. **Trigger:** User taps "+" or "Brain Dump"
2. **Input:** One-line text field "Co chcesz zrobić?"
3. **Quick Save Options:**
   - "Zapisz w Brain Dump" (just capture, no classification)
   - "Przejdź do Quizu" (classify now)

### Step-by-Step Quiz (str. 18):

#### Q1 (Importance Question):
> **"Czy przybliża Cię to do Twojego głównego celu?"**
- Options: **TAK** (green glow) / **NIE** (gray)
- Subtext: "Pomoże Ci to osiągnąć to, co naprawdę ważne?"

#### Q2 (Urgency Question):
> **"Czy masz na to twardy termin lub deadline?"**
- Options: **TAK** (red glow) / **NIE** (blue)
- Subtext: "Czy ktoś czeka / są konsekwencje po terminie?"

### Friction Points:
- [ ] **Issue:** User zastanawia się nad odpowiedzią (decision paralysis)
  - **Solution:** Binarne TAK/NIE - żadnych skali 1-5, żadnych "może"
- [ ] **Issue:** "A co jeśli nie mam jeszcze deadline?"
  - **Solution:** "NIE" jest OK - system pamięta i przypomni

### Decision Tree (str. 18 + str. 8, 9):

| Q1 (Ważność) | Q2 (Pilność) | Quadrant | Next Screen |
|--------------|--------------|----------|-------------|
| TAK | TAK | **Q1** | Dashboard (str. 15) or Q1 Limit check (str. 19) |
| TAK | NIE | **Q2** | Q2 Planning Center (str. 23) |
| NIE | TAK | **Q3** | Q3 Decision Options (str. 8) |
| NIE | NIE | **Q4** | Q4 Categories (str. 9) |

### Aha Moment:
User thinks: **"Nie musiałem/myśleć do której ćwiartki - aplikacja zrobiła to za mnie!"**

---

## Stage 3: Q1 Overload Protection (if applicable)
**Screen:** `Q1 Overload Popup` (PDF str. 19)

### Trigger:
User sklasyfikował zadanie jako Q1 (Pilne/Ważne), ale Q1 ma już 5 zadań.

### What They See:
- **Alert Title:** "Przeciążenie Systemu"
- **Message:** "Masz już 5 zadań krytycznych. Dodanie kolejnego = burnout."
- **Visual:** Red/orange neon glow + shield icon + progress bar 5/5
- **Options (Reassignment):**
  1. "Zaplanuj w Q2" (przejdź do str. 23)
  2. "Zrób w przerwie (Q3)" (przejdź do str. 8)
  3. "Zapisz w Brain Dump" (str. 7)
  4. "Odrzuć na teraz" (archiwizuj)

### Friction Points:
- [ ] **Issue:** User czuje się "karany" za produktywność
  - **Solution:** Friendly copy "System dba o Ciebie" nie "Błąd: limit osiągnięty"
- [ ] **Issue:** Nie wie gdzie przenieść zadanie
  - **Solution:** Suggestie z wyjaśnieniem każdej opcji

### Aha Moment:
User thinks: **"Aplikacja pilnuje żebym nie przepracował/a się"** (external brake)

---

## Stage 4: Quadrant-Specific Workflows

### 4.1 Q2 - Proza Życia (Growth Zone)
**Screen:** `06 Proza Życia` (PDF str. 23)

**Access:**
- Z Macierzy (str. 16): tap Q2 quadrant
- Z Quizu: automatyczne po klasyfikacji Q2

**What They See:**
- Lista zadań Q2 z subkategoriami:
  - **Rutyny** (habits, daily)
  - **Projekty** (larger goals)
  - **Inne** (misc important)
- Opcja "Zaplanuj blok czasowy" dla każdego zadania

**Info Popups (str. 29-31):**
- "Strategia Q2: Inwestycja w przyszłość"
- "Automatyzacja: Czy to można zautomatyzować?"
- "Delegowanie: Czy ktoś inny może to zrobić?"

### 4.2 Q3 - Pilne ale Nie-Ważne (Admin Zone)
**Screen:** `Q3 Decision Options` (PDF str. 8) → `06 Proza Życia (Q3 view)` (str. 23)

**Access:**
- Z Macierzy: tap Q3 quadrant (str. 16)
- Z Quizu: automatyczne po klasyfikacji Q3

**Decision Options (str. 8):**
1. **"Zrób teraz"** (< 10 minut - quick task)
2. **"Zaplanuj blok"** (scheduled admin block)
3. **"W przerwie"** (between focused work)

**Friction Reduction:**
- ADHD users often get stuck in Q3 (interruptions)
- System suggests "batch processing" of multiple Q3 tasks

### 4.3 Q4 - Nie-Pilne i Nie-Ważne (Archive/Fun)
**Screen:** `Q4 Categories` (PDF str. 9) → `07 Nie Teraz` (str. 24)

**Access:**
- Z Macierzy: tap Q4 quadrant (str. 16)
- Z Quizu: automatyczne po klasyfikacji Q4

**Categories (str. 9):**
- **Optymalizacja** (improvements, tweaks)
- **Side-quest** (side projects)
- **Hobby** (creative pursuits)
- **Rozrywka** (fun, entertainment)

**Psychology:**
- Q4 is NOT trash - it's "not now"
- User can schedule "Q4 time" (guilt-free fun)

---

## Stage 5: Matrix View - Big Picture
**Screen:** `02 Macierz` (PDF str. 16)

### What They See:
- **Grid 2×2:** Eisenhower Matrix visualization
- **Counters:** Liczba zadań w każdej ćwiartce
- **Quick Add:** "+" button in each quadrant
- **Navigation:** Tap any quadrant → detailed view (str. 23, 24)

### Navigation Matrix:

| From | Tap | To | PDF |
|------|-----|----|----|
| Macierz | Q1 quadrant | Pulpit (Q1 tasks) | str. 15 |
| Macierz | Q2 quadrant | Proza Życia | str. 23 |
| Macierz | Q3 quadrant | Q3 Decisions | str. 8 |
| Macierz | Q4 quadrant | Nie Teraz | str. 9, 24 |

### Context Menu (str. 17):
Long-press / tap "..." on any task:
- Edytuj
- Przenieś do innej ćwiartki
- Dodaj notatkę
- Usuń
- **Start Focus Timer** (str. 6)

---

## Stage 6: Focus Timer (Deep Work)
**Screen:** `Timer` (PDF str. 6)

### Access:
- Bottom navigation bar
- Context menu "Start Focus" (str. 17)
- Dashboard "Focus" button

### What They See:
- **Timer:** 25/5 (Pomodoro) lub 50/10 (Deep work)
- **Task Link:** "Focusujesz się na: [Task Name]"
- **Progress:** Streak counter (days in a row)
- **Notes:** Quick capture during session

### ADHD-Specific Features:
- Visual countdown (not just numbers - progress ring)
- "Emergency break" (guilt-free pause)
- Session notes (capture distractions without leaving)

---

## Stage 7: Brain Dump Notes (Capture Everything)
**Screen:** `Notatki Brain Dump` (PDF str. 7)

### Access:
- Bottom navigation
- From Quiz "Zapisz w Brain Dump"
- Floating action button (always accessible)

### What They See:
- **Unsorted notes:** Magazyn wszystkich "wrzutek"
- **Quick add:** Text, Voice, Link
- **Later classification:** "Przejdź do Quizu" dla każdej notatki

### ADHD Psychology:
> "50 ideas/day, 0 execution" problem

Brain Dump allows **immediate capture** without classification pressure. User can brain dump 20 things quickly, then classify later when energy permits.

---

## Stage 8: Today View - Linear Planning
**Screen:** `Wszystko na Dzisiaj` (PDF str. 5)

### Access:
- From Dashboard "Wszystko na dzisiaj"
- Bottom navigation

### What They See:
- **Linear day view:** Tasks in chronological/time-block order
- **Sections:**
  - Pilne/Ważne (Q1) - morning
  - Proza Życia (Q2 blocks) - scheduled
  - Przerwy (Q3 batch) - between
  - Nawyki (Q2 routines)
  - Projekty (Q2 projects)

### Friction Points:
- [ ] **Issue:** Za dużo na jeden dzień (overwhelm)
  - **Solution:** Auto-limit: max 3 Q1 tasks, max 5 Q2 blocks per day
- [ ] **Issue:** User nie wie ile czasu zajmie zadanie
  - **Solution:** Default time estimates ("~25 min") editable

---

## Complete Navigation Map

```
                    [START APP]
                         │
                         ▼
              ┌─────────────────────┐
              │   01 PULPIT         │ ◄─┐
              │   (str. 15)         │   │
              └──────────┬──────────┘   │
                         │              │
         ┌───────────────┼───────────────┘
         │               │
         ▼               ▼
┌───────────────┐ ┌───────────────┐
│ Wszystko na   │ │   02 MACIERZ  │
│ Dzisiaj       │ │   (str. 16)   │
│ (str. 5)      │ └───────┬───────┘
└───────────────┘         │
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────┐      ┌───────────┐      ┌───────────┐
│ Q1 (Fire) │      │ Q2 (Grow) │      │ Q3 (Admin)│
│ Dashboard │      │ Proza     │      │ Q3 Decisions
│ (str. 15) │      │ Życia     │      │ (str. 8)  │
└───────────┘      │ (str. 23) │      └───────────┘
                   └───────────┘            │
        ┌─────────────────┬─────────────────┤
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────┐      ┌───────────┐      ┌───────────┐
│Q1 Limit   │      │ 08 Info   │      │ Q4        │
│Check      │      │ Popups    │      │ Nie Teraz │
│(str. 19)  │      │(str.29-31)│      │ (str. 24) │
└─────┬─────┘      └───────────┘      └───────────┘
      │                                      │
      │                                      ▼
      ▼                              ┌───────────┐
┌───────────┐                        │ Q4        │
│ Overload  │                        │ Categories│
│ Popup     │                        │ (str. 9)  │
│ (str. 19) │                        └───────────┘
└─────┬─────┘
      │
      ├─► Zaplanuj w Q2 ───────────────► (str. 23)
      ├─► Zrób w przerwie (Q3) ───────► (str. 8)
      ├─► Brain Dump ─────────────────► (str. 7)
      └─► Odrzuć ─────────────────────► Archive

[GLOBAL ACCESS - Bottom Nav]
┌────────┬────────┬────────┬────────┬────────┐
│Pulpit  │Macierz │Dzisiaj │Notes   │Timer   │
│(str.15)│(str.16)│(str.5) │(str.7) │(str.6) │
└────────┴────────┴────────┴────────┴────────┘
```

---

## Friction Analysis by Screen

| Screen | Friction Risk | Mitigation | Aha Moment |
|--------|---------------|------------|------------|
| **Pulpit (str. 15)** | Too much info | Show only TOP 1 Q1 | "Widzę co MUSZĘ zrobić" |
| **Quiz (str. 18)** | Decision paralysis | Binary YES/NO only | "Nie muszę myśleć, system wie" |
| **Q1 Limit (str. 19)** | Feels like punishment | Friendly "System dba o Ciebie" | "Ktoś pilnuje mnie" |
| **Macierz (str. 16)** | Where to click? | Clear quadrant labels | "Widzę cały obraz" |
| **Timer (str. 6)** | Anxiety about time | Visual progress, not just numbers | "Mogę skupić się na 25 min" |
| **Brain Dump (str. 7)** | Fear of losing ideas | Instant save, no classification | "Wszystko jest zapisane" |

---

## Time-to-Value Metrics

| Stage | Time | Cumulative | Success Metric |
|-------|------|------------|----------------|
| Open app → See Dashboard | 2s | 2s | "Widzę Q1" |
| Dashboard → Add Task | 1 tap + type | 10s | "Mogę wpisać" |
| Quiz Q1 (Importance) | 1 tap | 15s | "TAK/NIE - easy" |
| Quiz Q2 (Urgency) | 1 tap | 20s | "Gotowe" |
| Q1 Check (if needed) | <1s | 21s | System handles it |
| Save → Visual confirmation | 300ms animation | 21.3s | **AHA! Task is saved** |

**⏱️ TOTAL TIME TO FIRST VALUE:** ~21 seconds (target: < 3 min) ✅

---

## Exit Ramps & Retention Triggers

### Day 0 (First Use):
- Push: "Dodaj swoje pierwsze zadanie" (after 2 min in app)
- Email: "Welcome! Your first task is waiting" (5 min after)

### Day 1:
- Push: "Masz 1 zadanie Q1 na dziś" (morning)
- In-app: "Wczoraj sklasyfikowałeś/aś X zadań - super!"

### Day 7:
- Email: "Twój tydzień z FocusFlow - podsumowanie"
- In-app: Unlock "Streak" badge

### Churn Risk Signals:
- No task added in 48h → "Brain Dump - zapisz cokolwiek" (low pressure)
- Q1 constantly full → Suggest "Q2 planning" workshop
- Timer never used → "Spróbuj 5-minutowego focusu"

---

## Critical Checkpoints (Red Flags)

- 🚩 **Aha Moment > 3 minut** → User will abandon before seeing value
- 🚩 **Quiz abandonment > 30%** → Questions are confusing (simplify)
- 🚩 **Q1 limit triggers anger not appreciation** → Wrong copy tone
- 🚩 **Brain Dump tasks never classified** → Quiz too hard to access later
- 🚩 **Timer never used** → User doesn't trust the system (add "test" mode)

---

## Quick Wins (< 4h implementation)

1. **Add "First Task" helper** - Highlight "+" button with animation for new users
2. **Quiz inline hints** - Add "Psst: TAK = ważne dla Twojego celu" tooltips
3. **Q1 Limit positive framing** - Change "Przeciążenie" to "System chroni Twój focus"
4. **Empty state delight** - When no Q1 tasks, show "Wolność! Czas na Q2 growth"
5. **Timer micro-reward** - Confetti animation after each completed session

---

## Summary Metrics to Track

### Daily:
- ☐ Landing → First task added: ___% (target: > 60%)
- ☐ Quiz completion rate: ___% (target: > 80%)
- ☐ Time to first classified task: ___s (target: < 60s)

### Weekly:
- ☐ Day 1 return rate: ___% (target: > 50% for ADHD)
- ☐ Q1 limit triggered: ___ times (monitor burnout prevention)
- ☐ Timer sessions completed: ___ (engagement indicator)
- ☐ Brain Dump → Quiz conversion: ___% (capture to classification)

### Monthly:
- ☐ Trial → Paid conversion: ___% (target: > 8% for ADHD niche)
- ☐ Churn reason: "Too complex" vs "Not useful" vs "Found alternative"
- ☐ Feature usage: Quiz vs Manual classification ratio

---

## References

| Document | Purpose |
|----------|---------|
| PDF str. 5 | Today View layout |
| PDF str. 6 | Timer screen |
| PDF str. 7 | Brain Dump notes |
| PDF str. 8 | Q3 Decision options |
| PDF str. 9 | Q4 Categories |
| PDF str. 15 | Dashboard (Pulpit) |
| PDF str. 16 | Matrix view |
| PDF str. 17 | Context menu popup |
| PDF str. 18 | Brain Dump Quiz |
| PDF str. 19 | Q1 Overload protection |
| PDF str. 23 | Q2/Q3 Proza Życia |
| PDF str. 24 | Q4 Nie Teraz |
| PDF str. 29-31 | Info popups for Q3 |

---

**Status:** Draft - ready for review  
**Next Steps:** 
- [ ] Review with ADHD persona validation
- [ ] Create wireframes for each screen
- [ ] Define analytics events for tracking
- [ ] Build MVP screens in order: Quiz → Dashboard → Matrix → Timer

