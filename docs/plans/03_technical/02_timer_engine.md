# Technical Specification: Timer Engine (Delta Timestamp)

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Problem: Background Throttling

### 1.1 Zjawisko

Przeglądarki (szczególnie Chrome i Safari) **throttle'ują** `setInterval` i `setTimeout` gdy tab jest:
- W tle (inactive tab)
- Zminimalizowany
- Zakryty innym oknem

**Standardowe throttling:**
- Aktywny tab: co 1ms (dokładny)
- Inactive tab: co 1000ms (1 sekunda)

### 1.2 Konsekwencje dla Dekrementacji

```typescript
// ❌ BŁĘDNA implementacja - podatna na throttling
const [timeLeft, setTimeLeft] = useState(25 * 60 * 1000);

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft(prev => prev - 1000);  // Odejmujemy 1s
  }, 1000);
  return () => clearInterval(interval);
}, []);

// Przy throttlingu:
// Real time: 00:00:10 (10 sekund)
// Interval wywołany: 2 razy (co 5s zamiast co 1s)
// timeLeft: 25:00 - 2s = 24:58 ❌ (błąd 8 sekund!)
```

---

## 2. Rozwiązanie: Delta Unix Timestamp

### 2.1 Algorytm Matematyczny

Zamiast dekrementować pamięć RAM, **porównujemy zegar systemowy:**

```
expectedEndTime = Date.now() + durationMs

W każdym update:
  timeLeft = max(0, expectedEndTime - Date.now())
```

### 2.2 Implementacja

```typescript
interface TimerState {
  mode: 'idle' | 'running' | 'paused' | 'break';
  timeLeft: number;              // ms
  expectedEndTime: number | null;  // Unix timestamp
  activePreset: TimerPreset | null;
}

// Inicjalizacja timera
const startTimer = (durationMinutes: number) => {
  const durationMs = durationMinutes * 60 * 1000;
  const expectedEnd = Date.now() + durationMs;
  
  setTimerState({
    mode: 'running',
    timeLeft: durationMs,
    expectedEndTime: expectedEnd,
    activePreset: selectedPreset,
  });
};

// Update loop (setInterval)
const updateTimer = () => {
  if (!expectedEndTime) return;
  
  const now = Date.now();
  const remaining = Math.max(0, expectedEndTime - now);
  
  setTimeLeft(remaining);
  
  if (remaining === 0) {
    completeTimer();
  }
};
```

### 2.3 Odporność na Throttling

```
Scenariusz: Throttling co 5s przy timerze 25 min

Czas rzeczywisty:  00:00  →  00:05  →  00:10  →  00:15
Interval wywołany:   tak   →   tak    →   tak    →   tak
Date.now():      100000  →  105000  →  110000  →  115000
expectedEndTime: 1250000 (stała)

timeLeft = 1250000 - Date.now():
  00:00: 1150000 ms (19:10) ✅
  00:05: 1100000 ms (18:10) ✅
  00:10: 1050000 ms (17:10) ✅

Błąd maksymalny: 1 sekunda (częstotliwość intervalu)
```

---

## 3. Architektura Stanu

### 3.1 TimerContext (Global State)

```typescript
interface TimerContextValue {
  // Stan
  timeLeft: number;
  timerState: 'idle' | 'running' | 'paused' | 'break';
  activeTaskId: number | null;
  showCompletionModal: boolean;
  
  // Akcje
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  setActiveTask: (taskId: number | null) => void;
  setShowCompletionModal: (show: boolean) => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);
```

### 3.2 Interwał Globalny

```typescript
export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [expectedEndTime, setExpectedEndTime] = useState<number | null>(null);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  
  // Globalny interval - działa niezależnie od komponentów
  useEffect(() => {
    if (timerState !== 'running') return;
    
    const interval = setInterval(() => {
      if (!expectedEndTime) return;
      
      const remaining = Math.max(0, expectedEndTime - Date.now());
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        setTimerState('idle');
        setShowCompletionModal(true);
      }
    }, 1000);  // Update co sekundę (wystarczające dla UI)
    
    return () => clearInterval(interval);
  }, [timerState, expectedEndTime]);
  
  return (
    <TimerContext.Provider value={{ timeLeft, timerState, ... }}>
      {children}
    </TimerContext.Provider>
  );
};
```

---

## 4. Stany Timera i Przejścia

### 4.1 Diagram Stanów

```
                    ┌─────────────┐
         ┌─────────►│    IDLE     │◄────────┐
         │          │  (gotowy)   │         │
         │          └──────┬──────┘         │
         │                 │ startTimer()   │
         │                 ▼                │
         │          ┌─────────────┐         │
         │     ┌────┤   RUNNING   ├────┐    │
         │     │    │  (odlicza)  │    │    │
         │     │    └──────┬──────┘    │    │
 pauseTimer() │           │           │ completeTimer()
         │     │    resumeTimer()     │    │
         │     ▼                 ▼    │    │
         │  ┌─────────┐      ┌─────────┐   │
         └──┤  PAUSED │◄────►│  BREAK  │   │
            │(wstrzym)│      │(przerwa)│   │
            └─────────┘      └────┬────┘   │
                                  │        │
                                  └────────┘
```

### 4.2 Implementacja Przejść

```typescript
const pauseTimer = () => {
  if (timerState !== 'running' || !expectedEndTime) return;
  
  // Zapisz pozostały czas
  const remaining = expectedEndTime - Date.now();
  setPausedTimeLeft(remaining);
  setTimerState('paused');
};

const resumeTimer = () => {
  if (timerState !== 'paused') return;
  
  // Przelicz expectedEndTime od teraz
  const newEndTime = Date.now() + pausedTimeLeft;
  setExpectedEndTime(newEndTime);
  setTimerState('running');
};
```

---

## 5. Time Boxing Mode (Custom Duration)

### 5.1 Slider Input

```typescript
const TimeBoxingInput = () => {
  const [minutes, setMinutes] = useState(25);
  
  return (
    <div>
      <input
        type="range"
        min="1"
        max="240"  // 4 godziny
        value={minutes}
        onChange={(e) => setMinutes(parseInt(e.target.value))}
      />
      <span>{Math.floor(minutes / 60)}h {minutes % 60}m</span>
      <button onClick={() => startTimer(minutes)}>
        Start Time Box
      </button>
    </div>
  );
};
```

### 5.2 Matematyka Time Boxingu

```typescript
const startTimeBoxing = (minutes: number) => {
  // Walidacja zakresu
  const clampedMinutes = Math.max(1, Math.min(240, minutes));
  const durationMs = clampedMinutes * 60 * 1000;
  
  setExpectedEndTime(Date.now() + durationMs);
  setTimerState('running');
};
```

---

## 6. Dokładność i Błędy

### 6.1 Błąd Maksymalny

| Scenariusz | Błąd |
|------------|------|
| Tab aktywny | < 1000ms (co 1s) |
| Tab w tle | < 1000ms (delta timestamp) |
| System sleep | Odzyskuje po wake |

### 6.2 Korekta Po Wake

```typescript
// Przy wznowieniu aplikacji (visibilitychange)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && timerState === 'running') {
    // Natychmiastowa korekta
    const remaining = Math.max(0, expectedEndTime - Date.now());
    setTimeLeft(remaining);
  }
});
```

---

## 7. Powiadomienia Audio (Web Audio API)

### 7.1 Generator Dźwięku

```typescript
const playNotification = (frequency = 440, duration = 500, type: 'sine' | 'square' = 'sine') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Konfiguracja dźwięku
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  // Połączenie
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Fade out
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration / 1000);
  
  // Start/Stop
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
};
```

### 7.2 Mapa Dźwięków

| Zdarzenie | Częstotliwość | Typ | Czas |
|-----------|--------------|-----|------|
| Timer Complete | 440 Hz (A4) | sine | 500 ms |
| Break Start | 523 Hz (C5) | sine | 300 ms |
| Pause | 330 Hz (E4) | sine | 200 ms |
| Timer Start | 392 Hz (G4) | sine | 150 ms |

---

## 8. Kryteria Akceptacji

- [x] Delta timestamp (zamiast dekrementacji)
- [x] Odporność na background throttling
- [x] Globalny TimerContext (uniknięcie race conditions)
- [x] 7 presetów czasowych (5/0, 10/0, 15/5, 25/5, 50/10, 90/15, Time Boxing)
- [x] Stany: idle, running, paused, break
- [x] Korekta po system wake (visibilitychange)
- [x] Web Audio API (brak zewnętrznych plików)
- [x] Dokładność ±1 sekunda

---

## 9. Decyzje Inżynieryjne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Delta timestamp** | Odporność na throttling |
| **Unix time** | Monotonic, niezależny od system clock |
| **Global context** | Singleton timer, brak konfliktów |
| **1s interval** | Wystarczające dla UI (1000ms granularity) |
| **Web Audio API** | Brak HTTP requests, instant |
| **visibilitychange** | Korekta po wake from sleep |
