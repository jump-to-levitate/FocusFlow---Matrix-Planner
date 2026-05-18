# ADR 003: Timer Delta Timestamp Architecture

> Status: ✅ Accepted  
> Data: Maj 2026  
> Autor: FocusFlow Team

---

## Context

Timer Pomodoro w aplikacji webowej napotyka znany problem: **Background Throttling**.

### Problem: Throttling w Przeglądarkach

Przeglądarki (Chrome, Safari, Firefox) throttle'ują `setInterval`/`setTimeout` gdy tab jest:
- W tle (inactive)
- Zminimalizowany
- Zakryty innym oknem

**Standardowe zachowanie:**
- Aktywny tab: interval co 1ms
- Inactive tab: interval co 1000ms (lub więcej)

### Przykład Błędu

```typescript
// ❌ Tradycyjna dekrementacja (zawodna)
const [timeLeft, setTimeLeft] = useState(25 * 60 * 1000);  // 25 min

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft(prev => prev - 1000);  // Odejmij 1s
  }, 1000);
  return () => clearInterval(interval);
}, []);

// Scenariusz: Użytkownik przełącza tab na 30 sekund
// Real time: 30s
// Interval wywołany: 2 razy (throttled do ~15s)
// timeLeft: 25:00 - 2s = 24:58 ❌ (błąd 28 sekund!)
```

---

## Decision

Zastosuj **Delta Timestamp Architecture** zamiast dekrementacji.

### Algorytm

```
Inicjalizacja:
  expectedEndTime = Date.now() + durationMs
  
W każdym update (nawet throttled):
  timeLeft = max(0, expectedEndTime - Date.now())
```

### Implementacja

```typescript
interface TimerState {
  mode: 'idle' | 'running' | 'paused' | 'break';
  timeLeft: number;
  expectedEndTime: number | null;  // Unix timestamp
}

const startTimer = (durationMinutes: number) => {
  const durationMs = durationMinutes * 60 * 1000;
  
  setTimerState({
    mode: 'running',
    timeLeft: durationMs,
    expectedEndTime: Date.now() + durationMs,  // Kluczowe!
  });
};

// Update loop
useEffect(() => {
  if (timerState !== 'running') return;
  
  const interval = setInterval(() => {
    if (!expectedEndTime) return;
    
    // ZAWSZE aktualne - Date.now() nie jest throttle'owany!
    const remaining = Math.max(0, expectedEndTime - Date.now());
    setTimeLeft(remaining);
    
    if (remaining === 0) {
      completeTimer();
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, [timerState, expectedEndTime]);
```

---

## Consequences

### Positive

1. **Dokładność** - błąd maksymalny: 1 sekunda (częstotliwość intervalu)
2. **Odporność** - działa nawet przy heavy throttlingu
3. **Efektywność** - brak konieczności częstych update'ów
4. **Wakeup recovery** - poprawia się po system sleep
5. **Brak driftu** - nie kumuluje błędów

### Negative

1. **Zależność od system clock** - jeśli użytkownik zmieni czas systemowy
2. **Złożoność mentalna** - trudniejszy do zrozumienia niż prosta dekrementacja
3. **Testowanie** - wymaga mockowania `Date.now()`

### Mitigations

- Użycie `performance.now()` dla monotonic timestamp (jeśli potrzeba)
- Handling `visibilitychange` dla natychmiastowej korekty

---

## Analysis: Dlaczego To Działa

### Date.now() vs setInterval

| Mechanizm | Throttling? | Dokładność |
|-----------|-------------|------------|
| `setInterval` | ✅ Tak (do 1000ms) | Zawodna |
| `Date.now()` | ❌ Nie | Zawsze aktualna |

`Date.now()` zwraca czas systemowy, który jest **zawsze aktualny** niezależnie od throttlingu. Różnica `expectedEndTime - Date.now()` jest więc prawidłowa nawet jeśli interval był throttle'owany.

### Scenariusz: Throttling co 5s

```
Czas rzeczywisty:  00:00  →  00:05  →  00:10
Interval wywołany:   tak   →   tak    →   tak
Date.now():      100000  →  105000  →  110000
expectedEndTime: 1250000 (stała, ustawiona na start)

timeLeft = 1250000 - Date.now():
  00:00: 1150000 ms (19:10) ✅ dokładnie
  00:05: 1100000 ms (18:10) ✅ dokładnie
  00:10: 1050000 ms (17:10) ✅ dokładnie
```

Błąd: **0 sekund** (idealnie)

---

## Alternatives Considered

| Rozwiązanie | Dlaczego odrzucono |
|-------------|-------------------|
| Web Workers | Złożoność, niepotrzebne dla tego use case |
| requestAnimationFrame | Działa tylko gdy tab widoczny |
| Service Worker | Overkill, niepotrzebna persistencja |
| WebSocket sync | Wymaga backendu, zależność sieciowa |
| Native app (Electron) | Zbyt ciężki, web wystarczający |

---

## Implementation Details

### Pause/Resume

```typescript
const pauseTimer = () => {
  if (!expectedEndTime) return;
  
  // Zapisz pozostały czas
  const remaining = expectedEndTime - Date.now();
  setPausedTimeLeft(remaining);
  setMode('paused');
};

const resumeTimer = () => {
  if (!pausedTimeLeft) return;
  
  // Przelicz expectedEndTime od teraz
  setExpectedEndTime(Date.now() + pausedTimeLeft);
  setMode('running');
};
```

### Visibility Change Handler

```typescript
// Korekta po powrocie do aplikacji
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && mode === 'running') {
    const remaining = Math.max(0, expectedEndTime - Date.now());
    setTimeLeft(remaining);
  }
});
```

---

## Testing Strategy

```typescript
// Mock Date.now() dla testów
const mockNow = 1000000;
jest.spyOn(Date, 'now').mockReturnValue(mockNow);

// Test throttling
startTimer(25);  // expectedEndTime = 1000000 + 25*60*1000 = 2500000

// Symulacja throttlingu (brak update'ów przez 30s)
jest.spyOn(Date, 'now').mockReturnValue(1030000);

// Update powinien pokazać prawidłowy czas
const remaining = expectedEndTime - Date.now();
expect(remaining).toBe(1470000);  // 24:30 ✅
```

---

## Success Metrics

- Błąd timera po 25 min: < 1 sekunda
- Dokładność przy throttlingu: 100%
- Recovery po system sleep: < 2 sekundy

---

## Related Decisions

- ADR 001: Initial Stack (React + Dexie)
- ADR 004: Synchronous Derived State (timer state management)

---

## References

- [Chrome Background Throttling](https://developer.chrome.com/blog/timer-throttling-in-chrome-88/)
- [Date.now() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)
