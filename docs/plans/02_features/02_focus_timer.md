# 02 Cyberpunkowy Globalny Timer Focus (7 ADHD-Proof Presets)

> Wersja: 2.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Nazwa Funkcji

**Cyberpunkowy Globalny Timer Focus (7 ADHD-Proof Presets)**

---

## 2. Opis Funkcjonalny

**Globalny silnik odliczania** z blokadą Background Throttling (kalkulacja Unix Timestamp Delta). Timer działa jako singleton w globalnym `TimerContext`, zapewniając spójność stanu między komponentami i eliminując race conditions przy re-renderach.

---

## 3. Tryby Pracy (7 Sztywnych Presetów)

| Tryb | Czas Focus | Przerwa | Przeznaczenie |
|------|-----------|---------|---------------|
| **Quick 5** | 5 min | 0 min | Szybki burst, "pierwszy krok" |
| **Quick 10** | 10 min | 0 min | Krótka sesja bez przerwy |
| **Standard 15/5** | 15 min | 5 min | Klasyczny Pomodoro (skrócony) |
| **Standard 25/5** | 25 min | 5 min | Klasyczny Pomodoro |
| **Deep 50/10** | 50 min | 10 min | Głęboka praca |
| **Deep 90/15** | 90 min | 15 min | Flow state, blok czasowy |
| **Time Boxing** | 1-240 min | 0 min | Dowolny czas (custom) |

### 2.1 Pogromca Paraliżu Decyzyjnego (Quick 5)

Preset **5/0** (5 minut, 0 przerwy) - zaprojektowany jako "pierwszy krok" dla osób z ADHD cierpiących na paraliż decyzyjny. Brak konieczności wybierania czasu niestandardowego.

### 2.2 Time Boxing Mode

- Slider od 1 minuty do 4 godzin (240 min)
- Brak automatycznej przerwy
- Idealny dla spotkań i time-blockingu
- Obsługa przekroczenia północy (timery nocne)

---

## 4. UX Flow

### 4.1 Dropdown Wyboru Zadania (Live z Dexie)

Dropdown z zadaniami pobieranymi w czasie rzeczywistym z IndexedDB (Dexie.js), filtrowane tylko do nieukończonych zadań z Q1 i Q2.

```
┌─────────────────────────────────────┐
│  ▼ Wybierz zadanie do skupienia...  │
├─────────────────────────────────────┤
│  🔥 Pilne & Ważne (Q1)              │
│    • Naprawić bug w produkcji       │
│    • Odpowiedzieć na maila VIP      │
│                                     │
│  📅 Centrum Planowania (Q2)         │
│    • Zaplanować sprint              │
│    • Research nowego narzędzia      │
│                                     │
│  [✓] Bez zadania (wolny focus)      │
└─────────────────────────────────────┘
```

**Filtrowanie w kodzie:**
```typescript
// Tylko aktywne zadania z Q1 i Q2
const timerTasks = useLiveQuery(
  () => db.tasks
    .where('completed').equals(0)
    .and(t => t.quadrant === 1 || t.quadrant === 2)
    .toArray(),
  []
);
```

### 4.2 Stany Interfejsu i Wizualizacje

#### Stan: Running (Aktywny)

```
┌─────────────────────────────────────┐
│                                     │
│         ╭───────────╮               │
│        ╱   24:32    ╲              │  ← Neonowy zielony (#39FF14)
│       │   ▶ RUNNING  │              │  ← Pulsujący cień
│        ╲_____________╱               │
│                                     │
│    [⏸ Pause]  [⏹ Stop]           │
│                                     │
│    Aktualne zadanie:                │
│    ┌─────────────────────────┐      │
│    │ 🔥 Napisać raport Q1   │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

**Style CSS:**
```css
color: #39FF14;
box-shadow: 0 0 20px rgba(57,255,20,0.6), 0 0 50px rgba(57,255,20,0.15);
text-shadow: 0 0 10px rgba(57,255,20,0.8);
```

#### Stan: Paused (Wstrzymany)

```
┌─────────────────────────────────────┐
│                                     │
│         ╭───────────╮               │
│        ╱   24:32    ╲              │  ← Przyciemniony fiolet (#D000FF)
│       │   ⏸ PAUSED   │              │  ← Statyczny cień
│        ╲_____________╱               │
│                                     │
│    [▶ Resume]  [⏹ Stop]            │
│                                     │
│    ⚠️  Timer jest wstrzymany         │
│                                     │
└─────────────────────────────────────┘
```

**Style CSS:**
```css
color: #D000FF;
opacity: 0.7;
box-shadow: 0 0 10px rgba(208,0,255,0.3);
```

#### Stan: Break (Przerwa)

- Automatyczne przejście po zakończeniu focus time
- Dźwięk powiadomienia (beep 440Hz)
- Odblokowanie przycisku "Skip Break"

---

## 5. Architektura Silnika Czasu (Unix Delta Timestamp)

### 5.1 Problem: Background Throttling

Przeglądarki throttle'ują `setInterval` gdy tab jest w tle. Rozwiązanie: **Unix Timestamp Delta**.

### 5.2 Algorytm Delta

```typescript
// Inicjalizacja
const expectedEndTime = Date.now() + (durationMinutes * 60 * 1000);

// Update co sekundę (nawet w tle)
const updateTimer = () => {
  const now = Date.now();
  const remaining = Math.max(0, expectedEndTime - now);
  setTimeLeft(remaining);
  
  if (remaining === 0) {
    completeTimer();
  }
};

// Działa nawet przy throttlingu - Date.now() jest zawsze aktualny
```

### 5.3 Globalny TimerContext

```typescript
interface TimerContextValue {
  timeLeft: number;
  timerState: 'idle' | 'running' | 'paused' | 'break';
  activeTaskId: number | null;
  showCompletionModal: boolean;
  
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  setShowCompletionModal: (show: boolean) => void;
}
```

### 5.4 Zalety

- **Odporność na throttling**: Nawet jeśli interval jest throttle'owany do 1s, delta jest prawidłowa
- **Dokładność**: Błąd maksymalny = 1 sekunda
- **Efektywność**: Brak konieczności ciągłego dekrementowania
- **Globalny stan**: Singleton timer, brak race conditions przy re-renderze

---

## 6. Trójstopniowy Modal Decyzyjny (3-Way Strategic Modal)

### 6.1 Globalna Synchronizacja Stanu

Modal zakończenia sesji jest kontrolowany przez **globalny stan** w `TimerContext`, co eliminuje race conditions przy re-renderach komponentów:

```typescript
// TimerContext.tsx - globalny stan (nie lokalny!)
const [showCompletionModal, setShowCompletionModal] = useState(false);

// TimerScreen.tsx - użycie globalnego stanu
const { showCompletionModal, setShowCompletionModal } = useTimer();

// Wyświetlenie przy timeLeft === 0
useEffect(() => {
  if (timeLeft === 0 && prevTimeLeftRef.current > 0) {
    setShowCompletionModal(true);  // Globalny trigger
  }
}, [timeLeft]);
```

### 6.2 Opcje Modalu (3-Way Choice)

```
┌─────────────────────────────────────────┐
│     Sesja zakończona! 🎉               │
├─────────────────────────────────────────┤
│                                         │
│  [✅ ZADANIE UKOŃCZONE]                │
│  Zaznacz jako done, wyczyść timer      │
│                                         │
│  [🔄 JESZCZE JEDNA SESJA]              │
│  Zachowaj zadanie, resetuj timer       │
│                                         │
│  [⏸️ WRÓCĘ DO TEGO PÓŹNIEJ]            │
│  Zatrzymaj timer, wróć na pulpit       │
│                                         │
└─────────────────────────────────────────┘
```

### 6.3 Opcja Zielona: Ukończ Zadanie (Safe ID Casting)

```typescript
const handleCompleteTask = async () => {
  if (activeTaskId) {
    // Bezpieczne rzutowanie ID na Number (Dexie wymaga number, nie string)
    const numericId = typeof activeTaskId === 'string' 
      ? parseInt(activeTaskId, 10) 
      : activeTaskId;
      
    try {
      await db.tasks.update(numericId, { completed: true });
      setActiveTaskId(null);  // Wyczyść z timera
      console.log('[Timer] Task completed:', numericId);
    } catch (err) {
      console.error('[Timer] Failed to complete task:', err);
    }
  }
  
  setShowCompletionModal(false);
  stopTimer();
};
```

### 6.4 Opcja Fioletowa: Jeszcze Jedna Sesja

```typescript
const handleAnotherSession = () => {
  setShowCompletionModal(false);
  // NIE zatrzymuj timera
  // NIE czyść activeTaskId - zadanie pozostaje wybrane
  // Użytkownik może natychmiast wybrać nowy preset czasowy
  // i pracować nad tym samym zadaniem dalej
};
```

### 6.5 Opcja Pomarańczowa: Odłóż na Pulpit

```typescript
const handleReturnLater = () => {
  setShowCompletionModal(false);
  stopTimer();
  // NIE oznaczaj zadania jako completed
  // Zadanie pozostaje w aktywnych (quadrant bez zmian)
  navigate('/');  // Przekierowanie na Dashboard
};
```

### 6.6 UX Decyzje (Elastyczność ADHD)

| Opcja | Kolor | Intencja | Rezultat |
|-------|-------|----------|----------|
| **Ukończ** | 🟢 Zielony | Sukces, zamknięcie | Task → completed, timer czysty |
| **Kolejna sesja** | 🟣 Fiolet | Kontynuacja flow | Timer reset, task preserved |
| **Odłóż** | 🟠 Pomarańcz | Przerwa, delegacja | Timer stop, task aktywny, nawigacja |

---

## 7. PWA Audio Gesture Unlock

### 7.1 Problem: Autoplay Policy w Przeglądarkach

Przeglądarki mobilne (Chrome, Safari) blokują **AudioContext** do momentu interakcji użytkownika (gesture). Audio nie zadziała automatycznie przy timeLeft === 0.

### 7.2 Rozwiązanie: Odblokowanie przy STARCIE Timera

```typescript
const TimerScreen = () => {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  
  const unlockAudio = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        setAudioUnlocked(true);
        console.log('[Audio] Context unlocked by user gesture');
      });
    } else {
      setAudioUnlocked(true);
    }
  };
  
  return (
    <>
      {/* Przycisk START odblokowuje audio */}
      <button 
        onClick={() => {
          unlockAudio();  // 🔓 Odblokowanie przy starcie!
          startTimer(selectedPreset);
        }}
        className="cyberpunk-button"
      >
        START
      </button>
      
      {/* Opcjonalny indykator dla użytkownika */}
      {!audioUnlocked && (
        <span className="text-xs text-white/50">
          Kliknij START dla powiadomień dźwiękowych
        </span>
      )}
    </>
  );
};
```

### 7.3 Dźwięki Systemowe (Web Audio API)

| Zdarzenie | Częstotliwość | Czas | Typ |
|-----------|--------------|------|-----|
| **Timer Complete** | 440 Hz (A4) | 500 ms | sine |
| **Break Start** | 523 Hz (C5) | 300 ms | sine |
| **Pause** | 330 Hz (E4) | 200 ms | sine |
| **Timer Start** | 392 Hz (G4) | 150 ms | sine |
| **Task Complete** | 880 Hz (A5) | 400 ms | sine |

### 7.4 Implementacja Oscylatora

```typescript
const playNotification = (
  frequency = 440, 
  duration = 500, 
  type: OscillatorType = 'sine'
): void => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  
  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Envelope (ADSR simplified)
  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);  // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.00001, now + duration / 1000);  // Decay
  
  oscillator.start(now);
  oscillator.stop(now + duration / 1000);
};

// Cyberpunk double-beep dla timer complete
const playTimerComplete = () => {
  playNotification(440, 200);  // A4
  setTimeout(() => playNotification(880, 300), 150);  // A5 (oktawa wyżej)
};
```

---

## 8. Cyberpunk UI Details

### 8.1 Zegar SVG (Progress Ring)

```tsx
<svg viewBox="0 0 100 100" className="w-64 h-64">
  {/* Tło pierścienia */}
  <circle 
    cx="50" cy="50" r="45" 
    stroke="#1a1a2e" 
    strokeWidth="8" 
    fill="none" 
  />
  
  {/* Postęp - neon glow */}
  <circle 
    cx="50" cy="50" r="45" 
    stroke={isRunning ? '#39FF14' : '#D000FF'}
    strokeWidth="8" 
    fill="none"
    strokeDasharray={circumference}
    strokeDashoffset={offset}
    strokeLinecap="round"
    style={{ 
      filter: `drop-shadow(0 0 10px ${isRunning ? '#39FF14' : '#D000FF'})`,
      transition: 'stroke-dashoffset 1s linear'
    }}
  />
  
  {/* Tekst czasu */}
  <text x="50" y="55" textAnchor="middle" className="fill-white font-mono text-2xl">
    {formatTime(timeLeft)}
  </text>
</svg>
```

### 8.2 Grid Presetów (3x3 Layout)

```
┌─────────────────────────────────────┐
│  [⚡ 5m]  [⚡ 10m]  [15/5]          │
│  [25/5]   [50/10]  [90/15]          │
│       [⏱ TIME BOX]                  │
└─────────────────────────────────────┘
```

**Zasady layoutu:**
- Quick presets (5m, 10m) z ikoną ⚡ (Pogromca Paraliżu)
- Standardowe Pomodoro w środku
- Time Boxing na środku dolnego rzędu (dominujący)

---

## 9. Kryteria Akceptacji (AC)

### Format: GIVEN [kontekst] WHEN [akcja] THEN [oczekiwany rezultat]

**AC-1: Odporność na Background Throttling**
> GIVEN użytkownik minimalizuje kartę przeglądarki lub przełącza się na inną aplikację WHEN odliczanie timera trwa w tle THEN silnik oparty na architekturze Unix Delta Timestamp (`expectedEndTime - Date.now()`) gwarantuje zachowanie precyzji czasu bez opóźnień wynikających z throttlingu `setInterval` przez przeglądarkę (błąd maksymalny ≤ 1 sekunda).

**AC-2: Globalny Singleton TimerContext**
> GIVEN komponent TimerScreen jest odmontowywany i montowany ponownie (np. nawigacja do Macierzy i powrót) WHEN użytkownik obserwuje wyświetlany czas THEN `timeLeft` pozostaje spójny i ciągły, ponieważ stan timera jest przechowywany w globalnym `TimerContext` (poza cyklem życia komponentu), eliminując race conditions przy re-renderach.

**AC-3: 3-Way Strategic Modal z Globalną Synchronizacją**
> GIVEN timer osiągnie `timeLeft === 0` (zakończenie sesji) WHEN komponent TimerScreen wykryje ten stan w `useEffect` THEN globalny stan `showCompletionModal` w `TimerContext` zmienia się na `true` i modal z 3 opcjami ("Ukończ"/"Kolejna sesja"/"Odłóż") pojawia się natychmiast, niezależnie od tego, który komponent jest aktualnie renderowany.

**AC-4: Safe ID Casting przy Zapisie Ukończenia**
> GIVEN użytkownik klika "Ukończ Zadanie" w modalu zakończenia WHEN system wykonuje operację aktualizacji w Dexie THEN ID zadania jest bezpiecznie rzutowane na typ `number` (Dexie wymaga number, nie string) poprzez: `const numericId = typeof activeTaskId === 'string' ? parseInt(activeTaskId, 10) : activeTaskId`, zabezpieczając przed błędami TypeScript runtime.

**AC-5: PWA Audio Gesture Unlock**
> GIVEN przeglądarka blokuje AudioContext zgodnie z Autoplay Policy (brak uprzedniej interakcji użytkownika) WHEN użytkownik klika przycisk "START" timera THEN funkcja `unlockAudio()` inicjalizuje `AudioContext` i wywołuje `ctx.resume()`, odblokowując możliwość odtwarzania dźwięków Web Audio API przy zakończeniu timera.

**AC-6: Eliminacja Paraliżu Decyzyjnego (7 Presets)**
> GIVEN użytkownik znajduje się na ekranie timera WHEN wyświetla się grid presetów THEN system prezentuje dokładnie 7 predefiniowanych opcji czasowych (5/0, 10/0, 15/5, 25/5, 50/10, 90/15, Time Boxing) bez możliwości wprowadzenia "custom" czasu, eliminując paraliż decyzyjny związany z wyborem czasu trwania sesji.

---

## 10. Checklist Implementacyjna

- [x] 7 sztywnych presetów (5/0, 10/0, 15/5, 25/5, 50/10, 90/15, Time Boxing)
- [x] Unix Delta Timestamp (odporność na Background Throttling)
- [x] Globalny TimerContext (singleton, brak race conditions)
- [x] Dropdown zadań live z Dexie (Q1 + Q2, nieukończone)
- [x] 3-Way Strategic Modal z globalną synchronizacją stanu
- [x] Safe ID casting przy zapisie ukończenia (string → number)
- [x] PWA Audio Gesture Unlock (przy kliknięciu START)
- [x] Web Audio API (oscillator, 6 dźwięków systemowych)
- [x] SVG progress ring z neon glow
- [x] Elastyczne domknięcie sesji (3 opcje UX)

---

## 10. Decyzje Architektoniczne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Unix Delta Timestamp** | Odporność na background throttling |
| **Global TimerContext** | Singleton timer, brak race conditions przy re-renderze |
| **7 sztywnych presetów** | Redukcja paraliżu decyzyjnego (brak "Custom") |
| **Audio Gesture Unlock** | Zgodność z autoplay policy przeglądarek |
| **Web Audio API** | Brak zależności od zewnętrznych plików dźwiękowych |
| **Safe ID casting** | Dexie wymaga number, TypeScript może mieć string |
