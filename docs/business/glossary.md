# FocusFlow 2.0 - Project Glossary

> Single Source of Truth (SSOT) dla terminologii projektowej  
> Język: Polski (UI) / Angielski (kod, komentarze)

---

## Metadane

| Pole | Wartość |
|------|---------|
| **Dokument** | Project Glossary |
| **Wersja** | 1.0 |
| **Status** | Active |
| **Data** | 2026-05-14 |
| **Metodologia** | SDD (Spec Driven Development) |

---

## 1. Macierz Eisenhowera (Eisenhower Matrix)

> System priorytetyzacji zadań oparty na dwóch wymiarach: **Pilność** (Urgency) i **Ważność** (Importance).  
> Ref: PDF str. 16, 18

---

### 1.1 Q1 - Pilne i Ważne (Do First / Emergency)

| Atrybut | Wartość |
|---------|---------|
| **Nazwa PL** | "Zrób teraz" / "Kryzys" |
| **Nazwa EN** | Do First / Emergency / Firefighting |
| **Kolor** | Neon Lime Green (`#39FF14`) |
| **Charakterystyka** | Zadania wymagające natychmiastowej akcji, z twardymi deadline'ami i wysokim wpływem na cele |
| **Limit** | **Maksymalnie 5 zadań** (hard limit - mechanizm przeciążenia) |
| **Strategia** | Zrób natychmiast lub zaplanuj konkretny blok czasowy |
| **Ikona** | `Flame` (Lucide) - ogień, pilność |
| **Ref** | PDF str. 15 (Dashboard), str. 19 (Overload protection) |

**UX Note (ADHD):** Q1 musi być zawsze widoczne (visual persistence). "Out of sight = out of mind" - jeśli użytkownik nie widzi zadania Q1, zapomina o nim.

---

### 1.2 Q2 - Ważne i Nie-Pilne (Schedule / Growth)

| Atrybut | Wartość |
|---------|---------|
| **Nazwa PL** | "Zaplanuj" / "Proza Życia" / "Strefa Wzrostu" |
| **Nazwa EN** | Schedule / Growth Zone / Important |
| **Kolor** | Neon Purple (`#A855F7`) |
| **Charakterystyka** | Zadania budujące długoterminową wartość: nawyki, projekty, rozwój |
| **Subkategorie** | Rutyna, Projekt, Inne |
| **Strategia** | Zaplanuj konkretny blok czasowy w kalendarzu |
| **Ikona** | `TrendingUp` (Lucide) - wzrost |
| **Ref** | PDF str. 10 (Growth), str. 23 (Proza Życia) |

**Subkategorie Q2:**
- **Rutyna** (Routine): Codzienne nawyki, powtarzalne czynności
- **Projekt** (Project): Większe cele wymagające wielu kroków
- **Inne** (Other): Ważne zadania niepasujące do powyższych

---

### 1.3 Q3 - Pilne i Nie-Ważne (Delegate / Admin)

| Atrybut | Wartość |
|---------|---------|
| **Nazwa PL** | "Deleguj" / "Proza Życia" / "Administracja" |
| **Nazwa EN** | Delegate / Admin / Interruptions |
| **Kolor** | Neon Cyan (`#00F0FF`) |
| **Charakterystyka** | Przerwania, maile, spotkania - pilne dla kogoś innego, nie dla Twoich celów |
| **Subkategorie** | Od razu (<10 min), W przerwie, Zaplanuj blok |
| **Strategia** | Deleguj, automatyzuj lub batch-process w dedykowanym bloku |
| **Ikona** | `AlertCircle` (Lucide) - alert, przerwanie |
| **Ref** | PDF str. 8 (Decyzje Q3), str. 23 (Proza Życia) |

**Subkategorie Q3 (Decyzje):**
- **Od razu** (Do Now): Jeśli zajmuje < 10 minut - zrób natychmiast
- **W przerwie** (On Break): Między głęboką pracą, podczas "przerw"
- **Zaplanuj blok** (Schedule Block): Większe zadania administracyjne - grupuj je

**Info Pop-ups:** PDF str. 29-31 (edukacja o delegowaniu, automatyzacji)

---

### 1.4 Q4 - Nie-Pilne i Nie-Ważne (Delete / Later)

| Atrybut | Wartość |
|---------|---------|
| **Nazwa PL** | "Nie teraz" / "Archiwum" / "Eliminuj" |
| **Nazwa EN** | Delete / Later / Waste / Archive |
| **Kolor** | Slate Gray (`#64748B`) |
| **Charakterystyka** | Dystraktory, rozrywka, side-questy - nie przyczyniają się do celów |
| **Subkategorie** | Optymalizacja, Side-quest, Hobby, Rozrywka |
| **Strategia** | Eliminuj, ogranicz czas lub planuj "guilt-free time" |
| **Ikona** | `Coffee` (Lucide) - przerwa, relaks |
| **Ref** | PDF str. 9 (Decyzje Q4), str. 24 (Nie Teraz) |

**Subkategorie Q4:**
- **Optymalizacja** (Optimization): Ulepszenia, refaktoring (gdy nie ma nic pilniejszego)
- **Side-quest** (Side Quest): Ciekawe projekty poboczne
- **Hobby** (Hobby): Twórcze zainteresowania
- **Rozrywka** (Entertainment): Fun, gry, social media

---

## 2. Procesy i Funkcje (Processes & Features)

---

### 2.1 Brain Dump

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Proces szybkiego "wyrzucania" myśli, pomysłów i zadań z głowy do systemu, bez natychmiastowej klasyfikacji |
| **Cel** | Zapobieganie "50 ideas/day, 0 execution" - capture everything before you forget |
| **Input** | Text, voice memo, link, quick note |
| **Output** | Nieposortowana lista w "Notatki Brain Dump" |
| **Next Step** | Późniejsza klasyfikacja przez Smart Quiz (batch processing) |
| **UX Principle** | **Zero friction** - 1 kliknięcie, 1 pole, auto-save |
| **Ref** | PDF str. 7 (Notatki Brain Dump), str. 18 (Quiz start) |

**ADHD Context:** 
- Object permanence hack - "jeśli nie zapiszę, zniknie z głowy"
- Reduces cognitive load - nie trzeba myśleć "do której ćwiartki" w momencie capture

---

### 2.2 Smart Quiz

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Algorytm 2-pytaniowy klasyfikujący zadania do ćwiartek Eisenhowera (Q1-Q4) |
| **Pytania** | 1. "Czy przybliża Cię to do celu?" (Ważność) 2. "Czy masz twardy termin?" (Pilność) |
| **Odpowiedzi** | Binarna: TAK / NIE (żadnych skali 1-5) |
| **Algorytm** | ```TAK+TAK=Q1, TAK+NIE=Q2, NIE+TAK=Q3, NIE+NIE=Q4``` |
| **UX Principle** | **Decision Support** - system myśli za użytkownika, eliminuje paraliż decyzyjny |
| **Ref** | PDF str. 18 (Quiz flow), TECH_00$1 (Quiz Logic) |

**Flow:**
1. User wpisuje tytuł zadania
2. Odpowiada na Pytanie 1 (binarnie)
3. Odpowiada na Pytanie 2 (binarnie)
4. System klasyfikuje do Q1/Q2/Q3/Q4
5. **Q1 Check** - jeśli wynik=Q1, sprawdź limit 5 zadań

---

### 2.3 Deep Focus Session

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Technika pracy skupionej w blokach czasowych z przerwami (Pomodoro lub Deep Work) |
| **Warianty** | **25/5** (25 min pracy, 5 min przerwy) lub **50/10** (50 min, 10 min) |
| **Cel** | ADHD-friendly timeboxing - "tylko 25 min, dam radę" |
| **Link do zadania** | Każda sesja może być powiązana z konkretnym zadaniem z Macierzy |
| **Features** | Countdown timer, progress ring, session notes (capture distractions), streak counter |
| **UX Principle** | **Time blindness compensation** - wizualny zegar, nie abstrakcyjny czas |
| **Ref** | PDF str. 6 (Timer) |

---

### 2.4 Session Streak

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Licznik dni skupienia pod rząd (consecutive days with completed focus sessions) |
| **Cel** | Gamification - budowanie nawyku regularnej pracy skupionej |
| **Mechanizm** | +1 za każdy dzień z minimum 1 ukończoną sesją Focus |
| **Reset** | Brak sesji przez 24h = reset do 0 (nie ma "pause") |
| **Visual** | Flame icon + liczba dni, gradient progress bar |
| **Motivation** | ADHD brains respond to immediate visual feedback and "don't break the chain" |
| **Ref** | PDF str. 6 (Timer - "seria dni") |

---

### 2.5 Q1 Overload Protection

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Mechanizm ochronny blokujący dodanie 6. zadania do Q1 (hard limit 5) |
| **Trigger** | Smart Quiz sugeruje Q1, ale Q1 ma już 5 aktywnych zadań |
| **Ekran** | "Przeciążenie Systemu" (str. 19) |
| **Copy** | "Masz już 5 zadań krytycznych. Dodanie kolejnego = burnout." |
| **Opcje reasignacji** | Zaplanuj w Q2 / Zrób w przerwie (Q3) / Brain Dump / Odrzuć |
| **Psychology** | External brake - system "mówi NIE" zamiast użytkownika, zapobiega overwhelm |
| **Ref** | PDF str. 19 (Overload popup), TECH_00$1 |

---

### 2.6 Context Menu (Pop-up Opcji)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Menu kontekstowe dostępne dla każdego zadania (long-press lub "...") |
| **Akcje** | Edytuj, Przenieś do innej ćwiartki, Dodaj notatkę, Usuń, **Start Focus Timer** |
| **Trigger** | Long-press na zadaniu / Tap "MoreVertical" icon |
| **UX Principle** | Quick actions bez opuszczania current view |
| **Ref** | PDF str. 17 (Pop-up opcji) |

---

## 3. Standardy Techniczne (Technical Standards)

---

### 3.1 SDD (Spec Driven Development)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Metodologia wytwarzania oprogramowania, w której każda zmiana kodu jest poprzedzona zatwierdzonym planem w `/docs/plans/` |
| **Zasada** | "No code without spec" - kod jest implementacją dokumentacji, nie odwrotnie |
| **Workflow** | 1. PLAN → 2. Review → 3. Approve → 4. Implement → 5. Test vs PLAN |
| **Benefit** | Single Source of Truth, redukcja tech debt, jasne acceptance criteria |
| **Files** | `TECH_00$1.md`, `TECH_00$1.md`, etc. |
| **Ref** | `.kilocode/workflows/*.md` |

---

### 3.2 AppShell (480px Safety Net)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Komponent root layoutu wymuszający sztywny limit szerokości 480px dla wszystkich widoków |
| **Implementacja** | `max-width: 480px; margin: 0 auto;` na głównym kontenerze |
| **Cel** | Mobile-First constraint - aplikacja jest ZAWSZE zoptymalizowana pod mobile |
| **Behavior** | Mobile: 100% width + padding / Desktop: centered 480px box |
| **Safety Net** | Zapobiega "rozlania" się layoutu na desktopie, wymusza mobile UX |
| **Code** | `app/src/App.tsx` - `<AppShell>` component |
| **Ref** | `docs/design-system.md` (Constraints), `docs/tech/conventions.md` |

---

### 3.3 Neon Glassmorphism

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Styl wizualny oparty na przezroczystych, rozmazanych warstwach (glass) z neonowymi akcentami |
| **Elementy** | `backdrop-filter: blur()`, `bg-white/[alpha]`, neon borders + glows |
| **Kolory neonów** | Q1 Lime (`#39FF14`), Q2 Purple (`#A855F7`), Q3 Cyan (`#00F0FF`), Text White |
| **Tło** | Głęboka czerń / slate (`#0F172A`) dla kontrastu |
| **Efekty** | Box-shadow glows, gradient text, glass panels |
| **UX Purpose** | High contrast dla ADHD (visual persistence), "świecące" priorytety |
| **Ref** | `docs/design-system.md` (Visual Effects), PDF całość |

**CSS Example:**
```css
.glass-panel {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
}

.neon-border-q1 {
  border-color: rgba(57, 255, 20, 0.5);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}
```

---

### 3.4 Thumb-First Design

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Zasada projektowania interfejsów, w której primary actions są umieszczane w strefie łatwego zasięgu kciuka (dolna 1/3 ekranu) |
| **Green Zone** (Thumb Easy): Bottom nav, FAB buttons, primary CTAs |
| **Yellow Zone** (Thumb Stretch): Content, forms |
| **Red Zone** (Requires grip change): Top bar, secondary actions |
| **Touch Target** | Minimum 44×44px (Apple HIG / Material Design) |
| **Ref** | `docs/design-system.md` (Constraints) |

---

### 3.5 Object Permanence (ADHD Concept)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Psychologiczna koncepcja zastosowana w UX: "Jeśli nie widzę zadania, przestaje istnieć w mojej głowie" |
| **ADHD Problem** | Brak naturalnej pamięci o zadaniach "poza polem widzenia" |
| **UX Solution** | Visual persistence - Q1 tasks zawsze widoczne, neonowe przypomnienia, mobile-first (zawsze w kieszeni) |
| **Implementacja** | Sticky Q1 widget, neon borders, always-visible counters |
| **Ref** | `docs/plans/STRAT_002_icp_persona.md` (ADHD persona) |

---

### 3.6 External Executive Function

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Kluczowa value proposition dla ADHD: system który "myśli" i "pilnuje" za użytkownika, kompensując słabe executive function |
| **Components** | Smart Quiz (decides for you), Q1 Limit (says NO for you), Visual Persistence (remembers for you) |
| **Metaphor** | "Mózg na zewnątrz" - gdy Twój mózg nie współpracuje, FocusFlow podejmuje decyzje za Ciebie |
| **Ref** | `docs/plans/STRAT_002_icp_persona.md` (ICP definition) |

---

## 4. Terminologia Techniczno-Produktowa (Neuroatypowa)

Terminy specyficzne dla FocusFlow, zaprojektowane z myślą o osobach neuroatypowych (ADHD).

---

### 4.1 Brain Dump (Seryjny Zrzut Myśli)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Proces błyskawicznego "opróżniania głowy" bez konieczności natychmiastowej kategoryzacji |
| **Problem ADHD** | "50 ideas/day, 0 execution" - pomysły znikają z głowy jeśli nie zostaną zapisane |
| **Rozwiązanie** | Izolowana przestrzeń Q0 (Inbox) - zadania tu trafiają nie pojawiają się w głównej Macierzy |
| **Mechanizm** | Zero friction: 1 kliknięcie, 1 pole, auto-save, brak decyzji |
| **UX Principle** | "Zrzuć teraz, sklasyfikuj później" - eliminuje paraliż decyzyjny przy wprowadzaniu |

---

### 4.2 Q0 State (Ćwiartka Zero / Inbox)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Stan "niezakwalifikowany" dla zadań oczekujących na klasyfikację |
| **Wartość quadrant** | `quadrant: 0` w bazie danych |
| **Izolacja** | Zadania Q0 **nie pojawiają się** w głównej Macierzy (Q1-Q4) |
| **Licznik Q0** | Badge na pulpicie pokazujący liczbę "myśli w kolejce" |
| **Flow** | Q0 → Quiz → Q1/Q2/Q3/Q4 (po kwalifikacji) |

---

### 4.3 ADHD-proof UX

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Zasady projektowania interfejsów eliminujących bariery poznawcze typowe dla ADHD |
| **Redukcja oporu poznawczego** | Brak decyzji przy wprowadzaniu (Q0), automatyczna klasyfikacja (Quiz) |
| **Visual persistence** | Neonowe ćwiartki zawsze widoczne - "out of sight = out of mind" |
| **Dopaminowa nagroda** | Cyberpunkowe kolory (#D000FF, #00FF66), animacje, natychmiastowa informacja zwrotna |
| **Elastyczność** | 3 opcje zakończenia sesji (bez przymasu), pause/resume w dowolnym momencie |
| **Brak guilt-tripping** | Bezkarne resetowanie passy, brak shame language |

---

### 4.4 Matrix Core (Rdzeń Macierzy)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Centralna funkcjonalność FocusFlow - dwuwymiarowa macierz Eisenhowera (Q1-Q4) |
| **Komponenty** | QuadrantCards (4 karty), sub-matryca Q2 (2x2), nawigacja viewMode |
| **Maszyna stanów widoku** | `viewMode: 'grid' | 'q2'` - przełączanie między główną Macierzą a Centrum Planowania |
| **Izolacja Q0** | Brain Dump nie zanieczyszcza widoku produktywności |
| **Subkategorie** | Q2: Rutyny, Projekty, Ogólne Cele, Inne |

---

### 4.5 Background Throttling

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Mechanizm przeglądarek polegający na spowalnianiu/zatrzymywaniu JavaScriptu w nieaktywnych kartach |
| **Problem** | Standardowy `setInterval` przestaje działać poprawnie gdy tab jest w tle |
| **Skutki dla timera** | Timer "zamraża się" - po powrocie do karty pokazuje nieprawidłowy czas |
| **Rozwiązanie** | Delta Timestamp Architecture - kalkulacja na podstawie `Date.now()` |
| **Impact** | FocusFlow timer działa poprawnie nawet przy zamkniętej/zminimalizowanej przeglądarce |

---

### 4.6 Delta Timestamp (Architektura Czasu)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Algorytm odliczania oparty na różnicy między obecnym czasem Unix a zaplanowanym końcem |
| **Algorytm** | `timeLeft = max(0, expectedEndTime - Date.now())` |
| **Zalety** | Odporność na throttling, działa po uśpieniu laptopa, nie wymaga Web Workera |
| **Dokładność** | ~1 sekunda (wystarczająca dla Pomodoro) |
| **Implementacja** | `TimerContext.tsx` - globalny singleton dla całej aplikacji |

---

### 4.7 3-Way Completion (Trójstopniowe Domknięcie)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Modal z 3 opcjami zakończenia sesji timera - elastyczne domknięcie bez przymusu |
| **Opcja 1: Zielona** | "Zadanie ukończone" - oznacza jako completed, czyści timer |
| **Opcja 2: Fioletowa** | "Jeszcze jedna sesja" - zachowuje zadanie, resetuj timer, kontynuuj flow |
| **Opcja 3: Pomarańczowa** | "Wrócę do tego później" - nie oznaczaj, zatrzymaj timer, nawiguj do dashboardu |
| **Psychologia** | Brak "failure mode" - każda opcja jest OK, użytkownik ma kontrolę |
| **Global state** | `showCompletionModal` w TimerContext - przetrwa re-render |

---

### 4.8 Snapshot State (Mechanizm Re-mount)

| Atrybut | Wartość |
|---------|---------|
| **Definicja** | Technika wymuszająca pełne odświeżenie komponentu poprzez zmianę klucza React |
| **Problem** | QuizModal zachowywał stary stan przy ponownym otwarciu ("zamrożony formularz") |
| **Rozwiązanie** | Dynamiczny klucz: `key={`quiz-${taskId}-${timestamp}`}` |
| **Skutek** | Unmount/remount = czysty stan, brak "zombie danych" |
| **Użycie** | Reklasyfikacja zadań z Q0, resetowanie quizu |

---

## 5. Skróty i Akronimy (Abbreviations)

| Skrót | Pełna nazwa | Znaczenie |
|-------|-------------|-----------|
| **Q1** | Quadrant 1 | Pilne i Ważne (Do First) |
| **Q2** | Quadrant 2 | Ważne, Nie-Pilne (Schedule) |
| **Q3** | Quadrant 3 | Pilne, Nie-Ważne (Delegate) |
| **Q4** | Quadrant 4 | Nie-Pilne, Nie-Ważne (Delete) |
| **ICP** | Ideal Customer Profile | Główna persona docelowa (ADHD Brain) |
| **SDD** | Spec Driven Development | Metodologia developmentu |
| **UX** | User Experience | Doświadczenie użytkownika |
| **UI** | User Interface | Interfejs użytkownika |
| **SSOT** | Single Source of Truth | Jedno źródło prawdy (dokumentacja) |
| **FAB** | Floating Action Button | Pływający przycisk akcji |
| **CTA** | Call To Action | Wezwanie do działania |
| **RSD** | Rejection Sensitive Dysphoria | Wrażliwość na odrzucenie (ADHD trait) |

---

## 5. Konwencje Nazewnictwa (Naming Conventions)

### 5.1 Komponenty React
- **PascalCase**: `QuizContainer.tsx`, `TaskCard.tsx`
- **Sufixy**: `*Screen` (page), `*Card` (item), `*Button` (action), `*Step` (quiz/wizard)

### 5.2 Funkcje i Hooki
- **camelCase**: `useQuiz`, `classifyTask`, `checkQ1Limit`
- **Prefixy**: `use*` (hook), `handle*` (event handler), `get*` / `fetch*` (data)

### 5.3 Typy TypeScript
- **PascalCase**: `QuizState`, `TaskInput`, `QuadrantNumber`
- **Interfejsy**: `I` prefix opcjonalny (np. `ITask`), preferowane bez prefixu

### 5.4 Stałe
- **UPPER_SNAKE_CASE**: `Q1_LIMIT`, `COLORS`, `STROKE_WIDTH`

### 5.5 Pliki CSS/Tailwind
- **kebab-case**: `glass-card`, `neon-border-q1`
- **BEM-like**: `quiz-step--active`, `task-card--q1`

---

## 6. Mapowanie PL ↔ EN (UI ↔ Code)

| Polski (UI) | Angielski (Kod) | Context |
|-------------|-----------------|---------|
| Pulpit | Dashboard | Main screen |
| Macierz | Matrix | Eisenhower grid |
| Proza Życia | Life Admin / Q2 Zone | Quadrant 2 view |
| Nie Teraz | Later / Archive | Quadrant 4 view |
| Zrób teraz | Do First | Q1 action |
| Zaplanuj | Schedule | Q2 action |
| Deleguj | Delegate | Q3 action |
| Odrzuć | Delete / Discard | Q4 action |
| Brain Dump | Brain Dump | Quick capture |
| Przeciążenie | Overload | Q1 limit warning |
| Streak | Streak | Consecutive days |
| Sesja | Session | Focus timer block |
| Ćwiartka | Quadrant | Q1-Q4 container |

---

## 7. Redakcja i Wersjonowanie

| Data | Wersja | Autor | Zmiany |
|------|--------|-------|--------|
| 2026-05-14 | 1.0 | Product Owner | Initial glossary creation |

**Proces aktualizacji:**
1. Nowe pojęcie → Dodaj do Glossary PRZED użyciem w planie
2. Review przez UX Lead + Tech Lead
3. Update wszystkich istniejących dokumentów jeśli terminologia się zmienia
4. Wersjonowanie semantic: major.minor (major = breaking changes)

---

**Note dla Developerów:**
> Jeśli natrafisz na termin niezdefiniowany w tym słowniku:
> 1. Dodaj go do Glossary
> 2. Użyj w kodzie/komunikacji
> 3. Nie zakładaj "wszyscy wiedzą co to znaczy"

**Note dla PM/UX:**
> Spójność terminologii = mniej bugów w UX. Gdy użytkownik widzi "Zrób teraz" w UI i czyta o "Do First" w dokumentacji, wie że to to samo.

