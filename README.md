# 🧠 FocusFlow

> **Inteligentna Macierz Eisenhowera zintegrowana z 7-trybowym Timerem Focus (Pomodoro, Deep Work, Flow).**

Aplikacja PWA dla osób z ADHD i ambitnych planistów, którzy chcą sprowadzić chaos zadań do czterech jasnych ćwiartek — i pracować w skupieniu z timerem dopasowanym do każdego trybu pracy.

---

## 🎯 Dlaczego FocusFlow?

**FocusFlow to coś więcej niż kolejna lista to-do.** To osobisty asystent produktywności, którego głównym celem jest maksymalne ułatwienie priorytetyzowania codziennych wyzwań.

Wiele osób wpada w **pułapkę „pilności"** — gasząc pożary całymi dniami zapominają o tym, co faktycznie ważne. Strategiczne cele długoterminowe (Q2 — *ważne, niepilne*) lądują na dole listy i nigdy nie są realizowane. FocusFlow rozwiązuje ten problem na czterech poziomach:

### 🧭 Dynamiczna Macierz Eisenhowera
Intuicyjny podział na cztery kwadranty (Q1–Q4) pozwala na **błyskawiczną ocenę**, co wymaga natychmiastowej uwagi, a co jest strategicznym celem długoterminowym. Quiz Brain Dump (6 pytań) podpowiada klasyfikację, gdy sam nie jesteś pewien — a hard-limit 5 zadań w Q1 zapobiega rozproszeniu skupienia.

### ⚡ System Auto-Eskalacji
Aplikacja samodzielnie pilnuje hierarchii zadań — **jeśli zbyt długo zwlekasz z ważnym celem (Q2), system automatycznie „eskaluje" go do priorytetu Q1**, wymuszając skupienie. Eskalacja działa w tle co godzinę i przy każdym uruchomieniu aplikacji, więc nawet 3-dniowa przerwa nie zaburza hierarchii.

### 🔥 7-Trybowy Silnik Focus
Po ustaleniu priorytetów system **dobiera odpowiedni tryb pracy** — Pomodoro `25/5` dla zadań standardowych, Deep Work `50/10` i `90/15` dla głębokiej koncentracji, Flow `5/0` dla krótkich szarż, Szybki Focus `10/5`/`15/5`/`35/5` dla pośrednich. Przechodzisz od planowania do egzekucji bez zbędnych rozpraszaczy — z Wake Lock blokującym wygaszanie ekranu i licznikiem opartym o `Date.now()`, który nie zatrzymuje się przy ukrytej zakładce.

### 📡 Architektura Offline-First
Dzięki **IndexedDB i technologii PWA** Twoje centrum dowodzenia jest zawsze pod ręką — niezależnie od dostępu do sieci. Cała baza zadań, sesji focus i statystyk żyje lokalnie w przeglądarce, aplikacja instaluje się jak natywna (z manifestem PWA i Service Workerem), a `BroadcastChannel` synchronizuje zmiany między zakładkami w czasie rzeczywistym.

---

## ✨ Główne funkcje

### 🎯 Macierz Eisenhowera z hard-limitem Q1
Klasyfikuj zadania w czterech ćwiartkach (pilne/ważne). Q1 ma **twardy limit 5 zadań** — przy przepełnieniu uruchamia się modal *Overload* z trzema strategiami wyjścia.

### ⏱️ 7-trybowy Timer Focus
Pomodoro `25/5`, Flow `5/0`, sprint `10/5`, koncentracja `15/5`, deep work `35/5`, hiper-focus `50/10`, ultra-deep `90/15`. State machine niezależny od React, matematyka oparta o `Date.now()` — zegar **nie zatrzymuje się przy ukrytej zakładce**. Wake Lock API trzyma ekran aktywny podczas sesji.

### 🚀 Automatyczna eskalacja Q2 → Q1
Zadania z `autoEscalate: true` są codziennie sprawdzane — gdy do deadline'u zostaje ≤ `escalateDaysBefore` dni, task migruje do Q1 z pełnym persistem do IDB. Eskalacja działa nawet po **3 dniach przerwy** w użytkowaniu (catch-up przy starcie).

### 🔄 Reaktywny Store z Event Bus
Globalny store oparty o `useSyncExternalStore` z immutable updates. Mutacje broadcastują przez `window.dispatchEvent` **i** `BroadcastChannel('FocusFlowSync')` → synchronizacja między zakładkami w czasie rzeczywistym.

### 📊 Analityka i raporty tygodniowe w SVG
Streak dni z rzędu (z `streakEngine`), tygodniowe minuty focus, ukończone zadania per ćwiartka, **autorski wykres słupkowy w czystym SVG** (7 dni / miesiąc, toggle), heatmap miesięczny z intensity dla zrobionych (zielony) i planowanych (fioletowy).

### 🧠 Brain Dump → Q1–Q4
6-pytaniowy quiz (3 ważność, 3 pilność) automatycznie klasyfikuje wrzucone zadanie. Modale strategiczne Q2/Q3/Q4 wymuszają decyzję *zanim* task wpadnie do bazy. Notatki z Brain Dump można później sklasyfikować i przesunąć do Macierzy.

### 🎨 Premium Aesthetic
Dark mode z neonowymi akcentami (Q1 red, Q2 green, Q3 orange, Q4 slate), glassmorphism header (`backdrop-blur-md`), subtelny glow `15px @ 13% alpha`, animacje `slide-in-from-bottom` na każdym ekranie.

---

## 🛠️ Tech Stack

| Warstwa | Technologia |
|---|---|
| 🎨 UI | **React 18** + TypeScript (strict, zero `any`) |
| ⚡ Build | **Vite 5** + `vite-plugin-pwa` |
| 💅 Style | **Tailwind CSS** 3 + `tailwindcss-animate` |
| 💾 Storage | **IndexedDB** via `idb` (3 object stores: `tasks`, `appState`, `files`) |
| 🔔 Sync | `BroadcastChannel` + `CustomEvent` bus |
| 📱 PWA | Service Worker (Workbox), manifest, Wake Lock API |
| 🧪 State | `useSyncExternalStore` + immutable singleton |

---

## 🚀 Instalacja

```bash
# 1. Klon repozytorium
git clone <repo-url>
cd FocusFlow-Repo/app

# 2. Instalacja zależności
npm install

# 3. Tryb deweloperski (Vite HMR)
npm run dev
# → http://localhost:5173

# 4. Build produkcyjny + service worker
npm run build

# 5. Podgląd builda lokalnie
npm run preview
```

---

## 📂 Struktura projektu

```
app/src/
├── pages/              # Ekrany: Pulpit, Macierz, FocusSession, BrainDump,
│                       #         Raporty, Kalendarz, Notatnik, Onboarding...
├── components/         # TaskCard, ContextMenu, ResourceModal, braindump/
├── store/              # useTasksStore (singleton), events.ts (bus), seed.ts
├── logic/              # timerMachine, escalationEngine, streakEngine,
│                       # processQuiz, brainDumpPipeline
├── constants/colors.ts # Paleta + GLOW + QUADRANT_CLASSES
├── db.ts               # IndexedDB wrapper (idb)
└── types.ts            # Task, FocusSession, AppStateShape, MicroStep, Resource
```

---

## 🧭 Routing (hash-based)

| Hash | Ekran |
|---|---|
| `#pulpit` | Pulpit z hero-task i mini-macierzą |
| `#macierz` | Pełna Macierz Eisenhowera 2×2 |
| `#timer?taskId=…&mode=25/5` | Sesja Focus |
| `#braindump` | Brain Dump quiz |
| `#today` | Wszystko na dziś (4 sekcje) |
| `#centrum-planowania` | Hub z 6 pigułkami |
| `#raporty` | Streak + minuty + per-Q + SVG chart |
| `#kalendarz` | Heatmap miesięczny |
| `#nawyki` / `#projekty` / `#inne` / `#proza` / `#archiwum` | Listy filtrowane |

---

## 🧪 Architektura kluczowych mechanizmów

### Event Bus
```ts
emitTaskUpdated();                  // window + BroadcastChannel
subscribeTaskUpdated(handler);      // jeden Set, jeden unsubscribe
```

### Timer State Machine (pure functions, zero React)
```ts
createTimer(mode);                  // → TimerState
tick(state, now);                   // → { remainingMs, isPhaseEnd }
pause(state, now) / resume(state, now);
advancePhase(state, now);           // work ↔ break + completedCycles++
```

### Eskalacja
```ts
runEscalation(tasks, today);        // → Task[] (zmienione na Q1)
// W storze: setInterval(applyEscalation, 60 * 60 * 1000)
```

---

## 📜 Skrypty

| Skrypt | Działanie |
|---|---|
| `npm run dev` | Vite dev server z HMR |
| `npm run build` | `tsc && vite build` — TypeScript + bundle + PWA |
| `npm run preview` | Lokalny podgląd produkcyjnego builda |
| `npm run lint` | ESLint (strict, max-warnings 0) |

---

## 🎯 Roadmap

Pełna mapa drogowa MVP znajduje się w `docs/ai_team/FocusFlow-Roadmapa-MVP.md` — od Sprint 1 (fundament + persystencja) przez Sprint 4 (timer + engines) po Sprint 5 (UI overhaul + PWA).

---

🤖 *Built with [Claude Code](https://claude.com/claude-code)*
