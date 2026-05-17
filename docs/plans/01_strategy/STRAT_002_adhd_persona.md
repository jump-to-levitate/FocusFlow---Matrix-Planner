# STRAT_002: ICP & Persona Definition - FocusFlow 2.0

> Wygenerowano przez workflow: WF_ICP_Persona.md  
> Data: 2026-05-10  
> Status: [ ] Draft | [ ] Validated | [ ] Action Required  
> Dependencies: STRAT_003 (Pre-Mortem Audit & Risk Analysis)

---

## 1. Executive Summary

**Produkt:** FocusFlow 2.0 - Mobile-first Matrix Planner z Inteligentnym Quizem i Systemem Anti-Burnout

**Etap:** Idea → MVP (przed implementacją TECH_001)

**Cel:** Zdefiniować Ideal Customer Profile (ICP) oraz persona dla produktu, aby skierować development i GTM na właściwą niszę.

---

## 2. ICP Card (Ideal Customer Profile)

### Kto

**Primary ICP: "The ADHD Brain" 🧠**

**Profile Demograficzny:**
- **Branża:** Tech / SaaS / Freelance / Knowledge Work / Students
- **Rola:** Developer, Designer, Writer, Student, Freelancer, Knowledge Worker
- **Wielkość:** 1 osoba (indywidualny użytkownik)
- **Wiek:** 22-40 lat
- **Lokalizacja:** Global (anglojęzyczny), głównie US/EU/UK
- **Przychód:** $0-$80k rocznie (students to mid-career)

**Psychografika:**
- Samoidentyfikacja ADHD lub executive dysfunction (zdiagnozowane lub samodiagnoza)
- "Out of sight, out of mind" - jeśli nie widzi zadania, przestaje istnieć
- Impulsywny brain dump - 50 pomysłów dziennie, brak systemu przetwarzania
- Paraliż decyzyjny przy wielu opcjach (choice paralysis)
- Rejection Sensitive Dysphoria - unikanie "niepowodzeń" przez prokrastynację
- Hyperfocus vs total distraction - brak middle ground

**Current Tools:**
- Notion (too complex, unused), Todoist (overwhelming list), Apple Notes (chaos), Paper (lost)
- Pattern: Skacze między toolami co 2-3 miesiące (żaden nie "trzyma")

### Co (Główny Job-to-be-Done)

> "Chcę external executive function - systemu który myśli ZA MNIE, gdy mój mózg nie współpracuje, abym nie zapominał ważnych rzeczy i mógł zacząć bez paraliżu."

**Core Jobs (ADHD-specific):**
1. **Capture everything NOW** - Szybki brain dump zanim pomysł zniknie z głowy
2. **External decision making** - System klasyfikuje ZA MNIE (Smart Quiz = nie myśl, kliknij)
3. **Visual persistence** - Widzę swoje zadania (mobile, zawsze przy sobie)
4. **Enforced boundaries** - System mówi "NIE" zamiast mnie (Q1 Limit = external brake)
5. **Start without thinking** - Clear "co TERAZ" bez decision fatigue

### Ból (Najważniejszy Problem)

**Emotional Pain (ADHD-specific):**
> "Znowu zapomniałem/am o ważnej rzeczy. Czuję się beznadziejny/a - dlaczego inni potrafią, a ja nie? Ten chaos w głowie nie daje żyć."

- Shame / guilt cycle - "powinienem/am umieć to ogarnąć"
- Rejection Sensitive Dysphoria - unikanie zadań przez strach przed "porażką"
- Overwhelm freeze - za dużo opcji = shutdown (executive dysfunction)

**Functional Pain (ADHD-specific):** 
- **Object permanence issues** - "Jeśli nie widzę zadania, przestaje istnieć" → zapominanie o deadlines
- **50 pomysłów dziennie, 0 zrobionych** - brain dump bez przetworzenia
- **Decision paralysis** - 20 minut na decydowanie "co robić" → wybieram scrollowanie
- **Hyperfocus gone wrong** - 4h na zadanie które miało zająć 20 min
- **Time blindness** - "miałem 2h wieczorem" → nagle jest północ
- **The pileup** - Q1 (pilne) wybucha bo zapominałem o nich przez 2 tygodnie

**Quantified Pain:**
- 50-100 "open loops" w głowie (mental load)
- 30-60 minut dziennie "startup cost" (przed rozpoczęciem czegokolwiek)
- 3-5 "forgotten deadlines" miesięcznie (crisis mode)
- $0 zarobionych na side projectach (brak consistent execution)
- 2-4x higher stress level niż neurotypical peers

### Decision Criteria (Co sprawia, że kupią?)

| Criteria | Weight | FocusFlow Match | ADHD Context |
|----------|--------|-----------------|--------------|
| Szybkość decyzji (minimal friction) | 10/10 | ✅ Smart Quiz - 2 pytania = klasyfikacja | CRITICAL: Reduces decision paralysis |
| External executive function | 10/10 | ✅ Q1 Limit, Smart Quiz = "mózg na zewnątrz" | CORE VALUE PROP |
| Visual persistence (mobile) | 9/10 | ✅ 480px, always in pocket | "Out of sight, out of mind" solution |
| Anti-overwhelm guardrails | 9/10 | ✅ Q1 Limit 5 - "system mówi NIE" | Prevents freeze/shutdown |
| Capture speed (brain dump) | 9/10 | ✅ Fast capture + Smart Quiz later | 50 ideas/day problem |
| Brak konfiguracji (opinionated) | 8/10 | ✅ No complex setup | Can't handle "build your system" |
| Cena ( <$15/mo ) | 7/10 | ✅ Affordable | Students/junior devs price sensitive |

---

## 3. Secondary Personas (By Priority)

### Persona 2: "The Indie Hacker" 💻

**Profile:**
- Solo founder, developer, freelancer
- Tech-savvy, używa wielu narzędzi (Notion, Todoist, etc.)
- Szuka "systemu" ale ma ADHD-like problemy z consistency

**Key Pain:** "Mam wrażenie że ciągle gaszę pożary (Q1) zamiast budować (Q2). Moja todo lista rośnie, a ja nie widzę postępu."

**Value Prop Match:** Q1 Limit + Q2 visibility = sustainable progress on long-term goals.
**Differentiator vs ADHD:** Indie Hacker CHCE systemu, ADHD Brain POTRZEBUJE systemu (external executive function).

---

### Persona 3: "The Recovering Hustler" 🩹

**Profile:**
- Były "hustle culture" evangelista, przeszedł/a burnout
- Szuka narzędzi "sustainable productivity" nie "max output"
- High willingness-to-pay dla anti-burnout features

**Key Pain:** "Poprzednie narzędzia kazały mi robić WIĘCEJ. Ja potrzebuję narzędzia które każe mi robić MNIEJ, ale LEPIEJ."

**Value Prop Match:** Q1 Limit jako "hard boundary" dla ochrony zdrowia mentalnego.

---

### Persona 4: "The Side Project Stacker" 🚀

**Profile:**
- 9-5 job + side project(s)
- Ograniczony czas wieczorami/weekendami
- Potrzebuje "laser focus" na krótkich blokach czasu

**Key Pain:** "Mam 2h wieczorem. Tracę 30 min na decydowanie CO robić. Zostaje 90 min faktycznej pracy."

**Value Prop Match:** Timer Focus + Q2 prioritization = maximum ROI z ograniczonego czasu.

---

## 4. Job Snapshots (JTBD Analysis)

### Job Snapshot 1: Morning "Startup Cost" (ADHD)

**Context:** Poniedziałek, 8:30 AM, laptop otwarty, ale nie mogę się zacząć
**Motivation:** "Muszę jakoś przez to przebrnąć, ale nie wiem od czego zacząć i już chcę to zamknąć"
**Current Solution:** Scrolluję Twitter/Reddit "dopóki nie ogarnę" (prokrastynacja) → panic mode
**Pain Points (ADHD-specific):**
- Executive dysfunction - "widzę zadania, ale nie mogę się ruszyć"
- 15+ tabs otwartych, wszystkie "pilne", żaden nie zaczęty
- Decision paralysis - za dużo opcji = freeze/shutdown
**Desired Outcome:** Nie myślę, po prostu KLIKNAM w "co TERAZ" i zaczynam (external initiation)
**Time/Cost:** 30-60 minut "startup cost" dziennie (przed jakąkolwiek produktywnością)
**Willingness-to-pay:** $10-15/mo za "brain that works when mine doesn't"
**Confidence:** 9/10 (well-documented ADHD executive dysfunction pattern)

---

### Job Snapshot 2: Impulsive "Yes" (ADHD)

**Context:** Slack/email z nowym requestem w środku dnia
**Motivation:** "Ktoś prosi = muszę zrobić TERAZ (chociaż nie mam czasu)"
**Current Solution:** Impulsywnie "tak" → dodaję do listy → natychmiast zapominam → deadline panic
**Pain Points (ADHD-specific):**
- Rejection Sensitive Dysphoria - trudność w mówieniu "nie"
- Impulsywność - "tak" jest łatwiejsze niż myślenie
- Object permanence - dodane zadanie znika z głowy
- "The pileup" - za 2 tygodnie wybucha kryzys bo zapomniałem
**Desired Outcome:** System mówi "NIE" za mnie (Q1 Limit full) LUB szybki brain dump + auto-classification
**Time/Cost:** 3-5 "forgotten deadlines" miesięcznie → crisis mode → shame spiral
**Willingness-to-pay:** $15/mo za "system który chroni mnie przed mną samym"
**Confidence:** 9/10 (ADHD Rejection Sensitivity + impulsivity = chronic overcommitment)

---

### Job Snapshot 3: Shame Spiral Sunday (ADHD)

**Context:** Niedziela wieczór, nadchodzi poniedziałek
**Motivation:** "Znowu nic nie zrobiłem/am. Czuję się beznadziejny/a. Dlaczego inni potrafią a ja nie?"
**Current Solution:** Unikanie myślenia o tym / doomscrolling / "jutro będzie inaczej"
**Pain Points (ADHD-specific):**
- Shame cycle - "znowu zawiodłem/am samego/siebie"
- "All or nothing" thinking - albo perfect week, albo total failure
- No external validation - praca Q2 (ważna niepilna) nie daje immediate feedback
- Time blindness - "co ja robiłem/am cały tydzień?"
**Desired Outcome:** Zobaczyć że JEDNA rzecz z Q2 została zrobiona (proof of progress)
**Time/Cost:** Emocjonalny koszt: 2-4h shame spiral, obniżony nastrój na cały wieczór
**Willingness-to-pay:** $12-15/mo za "proof I'm not a failure"
**Confidence:** 8/10 (ADHD shame cycle well-documented)

---

### Job Snapshot 4: Executive Dysfunction Shutdown (ADHD)

**Context:** Środa, 15+ tabs otwartych, 3 "pilne" zadania, nie mogę się ruszyć
**Motivation:** "Mój mózg nie działa. Nie potrafię nawet zacząć. Czuję się sparaliżowany/a."
**Current Solution:** Shutdown / scroll / avoid / shame nap → późniejszy crisis mode
**Pain Points (ADHD-specific):**
- Executive dysfunction freeze - ciało działa, mózg nie
- Task inertia - "nie mogę się przełączyć" z scrollowania na robienie
- Overwhelm paralysis - za dużo inputów = zero outputów
- Time blindness - "jeszcze chwila" → 4h później → panic
**Desired Outcome:** System który mówi "Zrób TYLKO TO. Reszta poczeka." (simplification)
**Time/Cost:** 1-2 shutdowns tygodniowo × 2-4h nieproduktywności + shame aftermath
**Willingness-to-pay:** $20/mo dla "system który działa gdy mój mózg nie"
**Confidence:** 9/10 (core ADHD executive dysfunction symptom)

---

### Job Snapshot 5: Shower Thoughts & Random Ideas (ADHD)

**Context:** Pod prysznicem, w tramwaju, przed snem - pomysł na projekt/zadanie
**Motivation:** "Muszę to zapisać ZANIM zniknie, bo za 5 minut będzie po nim ślad"
**Current Solution:** Notes app → zapomnij o istnieniu notesa → zapomnij o pomyśle
**Pain Points (ADHD-specific):**
- Working memory deficit - pomysł trwa 30 sekund, potem znika
- Object permanence - "nie widzę = nie istnieje" (nawet jak zapisałem)
- "The graveyard" - setki notesów, zero execution
- Idea overload - 50 pomysłów dziennie, wybór który realizować = paraliż
**Desired Outcome:** 3-sekundowy capture → Smart Quiz później DECYDUJE czy warto robić
**Time/Cost:** 50-100 "lost ideas" tygodniowo + mental load "muszę to zapamiętać"
**Willingness-to-pay:** $8-12/mo za "system który pamięta za mnie i wybiera co robić"
**Confidence:** 10/10 (core ADHD working memory issue)

---

## 5. Problem Matrix (Pain Prioritization - ADHD Focused)

| # | Problem | Trigger | Impact (I) | Confidence (C) | Ease (E) | Priority (I×C×E) | Experiment |
|---|---------|---------|------------|----------------|----------|------------------|------------|
| 1 | **Executive dysfunction freeze** - nie mogę się zacząć, shutdown | Opening laptop, too many options | 10 | 9 | 8 | **720** | Landing page: "Start without thinking" |
| 2 | **Decision paralysis** - 20+ min na "co robić" → scrollowanie | Morning, any planning moment | 9 | 10 | 8 | **720** | Concierge: Manual Smart Quiz dla ADHD users |
| 3 | **Object permanence** - zapominam o zadaniach których nie widzę | Po dodaniu do listy, zmiana kontekstu | 9 | 10 | 9 | **810** | Landing page: "Never forget again" + mobile-first |
| 4 | **Working memory overflow** - 50 pomysłów/dzień, wszystkie giną | Shower, commute, random moments | 8 | 9 | 9 | **648** | Interview: "How many ideas do you lose daily?" |
| 5 | **Impulsive overcommitment** - "tak" teraz, crisis później | New request, RSD trigger | 9 | 8 | 7 | **504** | Interview: "How often do you say yes and regret?" |
| 6 | **Shame spiral** - "znowu nic nie zrobiłem" | End of week, failed deadlines | 8 | 8 | 6 | **384** | Landing page: "Proof of progress" feature test |
| 7 | **Time blindness** - "jeszcze chwila" → 4h później | Any transition moment | 7 | 7 | 6 | **294** | Timer integration research |

**Top 3 Problems for MVP (ADHD):**
1. **Object permanence** (Priority: 810) → Core feature: Mobile-first visual persistence + Q2 visibility
2. **Executive dysfunction freeze** (Priority: 720) → Core feature: "Start Now" button (clear single task)
3. **Decision paralysis** (Priority: 720) → Core feature: Smart Quiz (external decision maker)

---

## 6. Suggested Experiments (Prioritized - ADHD Focused)

### Experiment 1: Reddit r/ADHD Landing Page (P0)

**Goal:** Test ADHD-specific messaging "Mózg na zewnątrz" / "External Executive Function"

**Setup:**
- 2 varianty landing page (Carrd):
  - **A:** "Task app that thinks FOR you" (external EF promise)
  - **B:** "Finally, a planner that works WITH your ADHD brain" (community validation)
- Headline options:
  - "Stop Decision Paralysis. Start Doing."
  - "Your Brain When Your Brain Isn't Working"
  - "50 Ideas/Day. 0 Forgotten. We Choose What Matters."
- Email capture dla early access
- Fake door pricing: $0 (free beta) / $8 / $15

**Success Metric:** >15% email conversion (ADHD community high engagement), >30 emails w 1 tygodniu
**Distribution:** Post na r/ADHD, r/ADHD_programmers, r/productivity z linkiem
**Cost:** $0
**Time:** 2-3 dni

---

### Experiment 2: r/ADHD Community Interviews (P0)

**Goal:** Validate ADHD-specific Job Snapshots (executive dysfunction, object permanence, RSD)

**Method:**
- Post: "Building a task app for ADHD brains. 15-min chat about how you manage tasks?"
- 5-8 rozmów z r/ADHD members
- Script ADHD-focused (sekcja 7 poniżej)

**Success Metric:** 4/5 potwierdzają "executive dysfunction" jako chronic blocker, 3/5 "object permanence issues"
**Cost:** $0
**Time:** 1 tydzień

---

### Experiment 3: Concierge Smart Quiz for ADHD (P1)

**Goal:** Test if external decision-making (Smart Quiz) reduces ADHD decision paralysis

**Method:**
- Znajdź 3-5 ADHD users z "brain dump chaos" (z r/ADHD)
- Manualnie przeprowadź 2-question quiz na ich liście zadań
- Zwroty:
  - "Czy to ułatwiło Ci decyzję co robić?" (decision ease)
  - "Czy chciałbyś/aś żeby app robiła to za Ciebie zawsze?" (value validation)
  - "Ile czasu zaoszczędziłoby Ci to rano?" (quantified value)

**Success Metric:** 4/5 "yes, easier decision", 3/5 "would pay for this"
**Cost:** 5-10h manual work
**Time:** 1 tydzień

---

### Experiment 4: Object Permanence Test (P1)

**Goal:** Validate mobile-first visual persistence value for ADHD

**Method:**
- Landing page variant C: "Your tasks, always visible. Never forgotten."
- Explain: "Phone = visual reminder. Out of sight ≠ out of mind."
- Ask: "How many tasks did you forget this month because they were 'out of sight'?"

**Success Metric:** >60% respondents: "5+ forgotten tasks/month"
**Cost:** $0 (part of landing page)
**Time:** 1 dzień (additional landing page variant)

---

## 7. Interview Script (Ready-to-Use)

### Script: "ADHD Task Management Deep Dive" (15-20 min)

**Intro:** 
"Dziękuję za czas. Buduję narzędzie dla osób z ADHD/executive dysfunction. Nie sprzedaję nic - chcę zrozumieć jak Twój mózg współpracuje (lub nie) z zadaniami. Wszystko anonimowe."

**Questions (ADHD-focused):**

1. **Context:** "Opowiedz o ostatnim razie kiedy miałeś/aś 'ten moment' - chciałeś/aś zacząć ale nie mogłeś/aś się ruszyć?"
   - *Listen for:* Executive dysfunction, task initiation issues, freeze/shutdown

2. **Object Permanence:** "Czy zdarza Ci się zapomnieć o zadaniach które zapisałeś/aś, bo ich nie widzisz? Jak często?"
   - *Listen for:* "Out of sight out of mind", forgotten deadlines, visual dependency

3. **Decision Paralysis:** "Ile czasu potrafisz spędzić na 'decydowaniu co robić' zamiast robić?"
   - *Listen for:* Quantified time waste (30min? 1h?), scroll avoidance, choice paralysis

4. **Working Memory:** "Jak często tracisz pomysły które przyszły Ci do głowy w dziwnym momencie (np. pod prysznicem)?"
   - *Listen for:* 50 ideas/day, capture failure, "graveyard" of notes

5. **RSD & Overcommitment:** "Jak często mówisz 'tak' na prośby, a potem tego żałujesz? Jak to się kończy?"
   - *Listen for:* Rejection Sensitivity, impulsive yes, crisis pileup

6. **Desired Outcome:** "Jak wyglądałaby 'idealna' app dla Twojego ADHD mózgu? Co by robiła ZA CIEBIE?"
   - *Listen for:* External executive function, auto-decisions, boundaries, visual persistence

7. **Willingness-to-pay:** "Wyobraź sobie app która myśli za Ciebie - klasyfikuje, wybiera, mówi 'nie' za Ciebie. Ile byłoby to warte miesięcznie?"
   - *Listen for:* $0 (doesn't believe it works), $10-20 (external EF value), $25+ (desperation pricing)

8. **Current Failures:** "Jakie apki próbowałeś/aś i dlaczego przestałeś/aś ich używać po 2-3 miesiącach?"
   - *Listen for:* Notion (too complex), Todoist (overwhelming), no tool "sticks"

**Outro:**
"Dziękuję. Jeśli będę miał/a MVP w przyszłym miesiącu - chcesz być testerem/a beta?"
- Jeśli TAK: +1 do validation (ADHD users willing to test = strong signal)

---

## 8. Next Steps & Integration

### Immediate Actions (This Week - ADHD Focused)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 1 | Join r/ADHD, r/ADHD_programmers - lurk & understand language/pain points | Product Owner | 1h |
| 2 | Post "Research: How do you manage tasks with ADHD brain?" na r/ADHD | Product Owner | 30 min |
| 3 | Set up Carrd landing page (3 variants: A, B, C) z ADHD-focused copy | Product Owner | 4-5h |
| 4 | Schedule 5 interviews z r/ADHD responders (DM) | Product Owner | 2h |
| 5 | Przygotować Concierge Smart Quiz script dla ADHD users | Product Owner | 1h |
| 6 | Review this ICP with STRAT_003 findings + ADHD angle | Architect + PO | 1h |

### Go/No-Go Decision Gate

**✅ DECISION MADE: Primary ICP = ADHD Brain**

**Przed TECH_001 (Core Data Layer) - wymagane:**
- [ ] ≥5 validated interviews z r/ADHD community (potwierdzają executive dysfunction pain)
- [ ] Landing page z ≥20 emails OR ≥10% conversion (ADHD-focused messaging)
- [ ] Concierge test: Manual Smart Quiz dla 3-5 ADHD users (validation of auto-classification value)

### Integration with Other Workflows

| Workflow | When to Use | Output Here |
|----------|-------------|-------------|
| WF_Job_To_Be_Done | Post-interviews | Deeper Job Snapshots |
| WF_Competitor_Audit | Next | Differentiation strategy |
| WF_GTM_Strategy | After ICP validation | Messaging + Channels |
| WF_Kill_The_Idea | Done | Risk awareness |

---

## 9. Critical UX Requirements (dla /WF UX)

> Soczewka przez którą agent AI ocenia aplikację podczas audytu UX  
> Każdy komponent MUSI spełniać poniższe kryteria dla ADHD Brain

### 9.1 Minimal Friction (Tarcie Minimalne)

**Zasada:** Każda akcja musi zajmować maksymalnie **3 kliknięcia**.

| Akcja | Maksymalne Kroki | Dlaczego? |
|-------|------------------|-----------|
| Dodaj zadanie | 1 klik (Brain Dump) + 1 klik (Smart Quiz Yes/No) | ADHD nie ma cierpliwości do formularzy |
| Sklasyfikuj zadanie | 2 kliknięcia w Quiz (2 pytania) | Manualna klasyfikacja = decision paralysis |
| Zacznij timer | 1 klik (Start Focus) | Im mniej kroków, tym większa szansa na akcję |
| Oznacz jako zrobione | 1 klik (checkbox) | Immediate gratification |

**Checklista /WF UX:**
- [ ] Czy główny CTA jest widoczny bez scrollowania?
- [ ] Czy flow nie wymaga "zastanawiania się"?
- [ ] Czy są tylko 1-2 opcje, nie 5+?

### 9.2 Visual Persistence (Wizualna Persystencja)

**Zasada:** Kluczowe zadania (Q1) muszą być **zawsze widoczne** i "świecić".

**Implementacja:**
- Q1 tasks: neon lime green border + glow effect (nigdy nie gasną)
- Mobile-first: app zawsze w kieszeni = zawsze widoczny
- Badge / licznik zadań Q1 na głównym ekranie (object permanence hack)
- "Current Focus" widget: sticky, nie scrolluje się z widoku

**ADHD Problem:** "Out of sight, out of mind" - jeśli nie widzę zadania, przestaje istnieć.

**Checklista /WF UX:**
- [ ] Czy Q1 są zawsze widoczne na dashboardzie?
- [ ] Czy użyto neon colors dla high-priority tasks?
- [ ] Czy są "sticky" elements które nie znikają przy scrollu?

### 9.3 Decision Support (Wsparcie Decyzyjne)

**Zasada:** Quiz musi **"myśleć" za użytkownika**, zdejmując ciężar klasyfikacji.

**Implementacja (z PDF str. 18):**
```
Pytanie 1: "Czy przybliża Cię to do celu?" (Ważność)
  → Tak = Q1 lub Q2
  → Nie = Q3 lub Q4

Pytanie 2: "Czy masz twardy termin?" (Pilność)
  → Tak + Ważne = Q1
  → Nie + Ważne = Q2
  → Tak + Nie-ważne = Q3
  → Nie + Nie-ważne = Q4
```

**ADHD Problem:** Decision paralysis przy 4 ćwiartkach - za dużo opcji = freeze.

**Checklista /WF UX:**
- [ ] Czy Quiz jest domyślnym sposobem dodawania zadań?
- [ ] Czy pytania są binarne (Tak/Nie), nie skala 1-5?
- [ ] Czy wynik Quiz jest tymczasowy (można edytować później)?

### 9.4 Overload Protection (Ochrona Przed Przeciążeniem)

**Zasada:** Twardy limit **5 zadań w Q1** jako mechanizm obronny przed stresem.

**Implementacja (z PDF str. 19):**
- Przy próbie dodania 6. zadania do Q1 → blokada
- Komunikat: "Przeciążenie Systemu" (nie "błąd", nie "limit")
- Sugestia: przenieś do Q2 (Zaplanuj) lub Brain Dump
- Visual indicator: progress bar 1-5/5 (czerwony przy 4+)

**ADHD Problem:** Q1 wybucha (pileup) → crisis mode → shutdown → shame.

**Checklista /WF UX:**
- [ ] Czy przy 5 zadaniach Q1 pojawia się blokada?
- [ ] Czy komunikat jest friendly, nie "error"?
- [ ] Czy są sugerowane alternatywy (Q2, Brain Dump)?

---

## 10. Anty-wzorce (Czego UNIKAĆ)

> Lista zakazanych wzorów UI/UX dla ADHD Brain  
> Podczas /WF UX - sprawdź czy któryś występuje!

| Anty-wzorzec | Dlaczego szkodliwy? | Co zamiast? |
|--------------|---------------------|-------------|
| **Długie listy** (20+ zadań) | Overwhelm freeze | Paginacja / Max 5-7 widocznych |
| **Małe przyciski** (<44px) | Frustracja, missed clicks | Touch targets min 44×44px |
| **Niejasne komunikaty** | Confusion, RSD trigger | Clear, friendly copy ("Nie teraz" zamiast "Odrzuć") |
| **Skomplikowane formularze** | Abandonment | 1 pole + Smart Quiz (auto-klasyfikacja) |
| **Za dużo opcji** (5+ choices) | Decision paralysis | Max 3-4 opcje, binarne decisions |
| **Brak instant feedback** | "Czy to zadziałało?" | Visual feedback na każdej akcji |
| **Scroll-only navigation** | Utracone konteksty | Sticky headers + bottom nav |
| **Modal hell** (nested modals) | Lost context, panic | Inline editing, bottom sheets |
| **"Type to search" bez hints** | Blank mind syndrome | Pre-populated suggestions |
| **Time-based deadlines** | Time blindness anxiety | Duration estimates ("5 min") |

**Checklista /WF UX (Anti-patterns):**
- [ ] Czy są jakieś listy >10 elementów bez paginacji?
- [ ] Czy przyciski są <44px?
- [ ] Czy użytkownik musi "pamiętać" co robić (brak clear CTA)?
- [ ] Czy są nested modals (modal w modalu)?

---

## 11. Summary

**✅ DECISION MADE: Primary ICP = "The ADHD Brain" 🧠**

**Primary Profile:** ADHD / Executive Dysfunction (22-40, tech/knowledge work, $0-80k, US/EU/UK)
- Samoidentyfikacja lub diagnoza ADHD
- "Out of sight, out of mind" - object permanence issues
- 50 ideas/day, 0 execution
- Paraliż decyzyjny, time blindness, shame cycle

**Core Problem:** Missing **external executive function** - potrzebuje systemu który THINKS za niego/a (Smart Quiz), BOUNDARIES (Q1 Limit), i PERSISTENCE (mobile visual)

**Value Prop:** "Mózg na zewnątrz" - gdy Twój mózg nie współpracuje, FocusFlow podejmuje decyzje za Ciebie.

**Top 3 Experiments (ADHD-focused):**
1. **Reddit r/ADHD landing page:** "Finally, a task app that thinks FOR you" + email capture
2. **5 interviews** z r/ADHD community (validated ADHD-specific pains)
3. **Concierge Smart Quiz** - manual classification test dla 5 ADHD users

**Key Insight:** FocusFlow nie sprzedaje "matrix" - sprzedaje **"external executive function"** dla mózgów które nie potrafią same zarządzać priorytetami (ADHD, burnout, executive dysfunction).

**Product Implications:**
- Smart Quiz = MUST HAVE (reduces decision paralysis)
- Q1 Limit = MUST HAVE (external brake, prevents overwhelm)
- Brain Dump = MUST HAVE (capture before forget)
- Mobile-first = MUST HAVE (visual persistence, always accessible)
- Timer = NICE TO HAVE (focus support)
- Desktop version = LATER (mobile is primary for this persona)

**Pricing Hypothesis:** $10-15/mo (ADHD community pays premium for tools that "work with their brain")

---

**Last Updated:** 2026-05-14
**Next Review:** After 5 interviews OR landing page results

