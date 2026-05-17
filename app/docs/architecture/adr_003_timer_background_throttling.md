# ADR 003: Silnik czasu oparty na Delta Timestamp oraz trójstopniowa logika domykania sesji

## Status

**Accepted** - Maj 2026

## Kontekst

Aplikacje PWA (Progressive Web Apps) napotykają fundamentalny problem przy implementacji timerów: systemy operacyjne (iOS, Android, desktop) agresywnie throttle'ują lub całkowicie zatrzymują `setInterval`/`setTimeout` w kartach działających w tle lub przy zablokowanym ekranie. Standardowa implementacja:

```typescript
// ANTYWZORZEC - Nieodporny na background throttling
setInterval(() => {
  setTimeLeft(prev => prev - 1);  // Przestaje działać w tle!
}, 1000);
```

W przypadku aplikacji FocusFlow, gdzie użytkownik może:
- Zablokować ekran telefonu podczas pracy,
- Przejść do innej zakładki przeglądarki,
- Zminimalizować okno aplikacji,

niezawodność pomiaru czasu jest krytyczna. Brak notyfikacji o zakończeniu sesji prowadzi do frustracji i utraty zaufania do narzędzia.

## Decyzja

### Część 1: Architektura Delta Timestamp

Porzucenie dekrementacji zmiennej w RAM na rzecz **przechowywania `expectedEndTime` (Unix timestamp)** i kalkulacji delty w czasie rzeczywistym.

```typescript
interface TimerState {
  timeLeft: number;           // Cache dla UI (sekundy)
  expectedEndTime: number;    // Źródło prawdy (timestamp ms)
  timerState: 'idle' | 'running' | 'paused' | 'break';
}

// Mechanizm obliczeniowy
const updateTimeLeft = () => {
  if (!expectedEndTime) return;
  const newTimeLeft = Math.max(0, Math.ceil((expectedEndTime - Date.now()) / 1000));
  setTimeLeft(newTimeLeft);
  
  if (newTimeLeft === 0) {
    handleTimerComplete();
  }
};

// Interval odświeża UI, ale źródłem prawdy jest timestamp
setInterval(updateTimeLeft, 1000);
```

**Zalety architektury:**
- Odporność na usypianie kart (po wybudzeniu delta jest natychmiast kalkulowana).
- Odporność na zmiany zakładek (timestamp nie zmienia się).
- Kompatybilność z zablokowanym ekranem mobilnym (liczenie oparte na systemowym RTC).

### Część 2: Trójstopniowa logika domykania sesji

Implementacja modalu decyzyjnego na koniec sesji, adresującego **poczucie winy** i **utrzymanie pędu (momentum)** użytkowników z ADHD.

#### Stan emocjonalny użytkownika
Po zakończeniu timera użytkownik może znajdować się w jednym z trzech stanów:
1. **Zadanie ukończone** → Satysfakcja, chęć oznaczenia sukcesu.
2. **Zadanie w toku** → Pęd pracy, chęć kontynuacji bez przerywania flow.
3. **Przerwa/przerwanie** → Poczucie niedosytu, konieczność przerwania na teraz.

#### Architektura trzech wyborów

```typescript
// Handler 1: Zakończ zadanie (Zieleń)
const handleCompleteTask = async () => {
  if (activeTaskId) {
    await db.tasks.update(activeTaskId, { completed: true });
  }
  setShowCompletionModal(false);
  stopTimer();
  setActiveTask(null);  // Czyszczenie wybranego zadania
};

// Handler 2: Kolejna sesja (Fiolet)
const handleAnotherSession = () => {
  setShowCompletionModal(false);
  // Celowe: brak stopTimer() i brak czyszczenia activeTaskId
  // Użytkownik zostaje z zadaniem, może wybrać kolejny preset
};

// Handler 3: Wróć później (Pomarańcz)
const handleReturnLater = () => {
  setShowCompletionModal(false);
  stopTimer();
  navigate('/');  // Powrót na Pulpit
  // Zadanie pozostaje nieukończone w swojej ćwiartce
};
```

**Psychologiczne uzasadnienie:**
- **Eliminacja winy**: Opcja "Kolejna sesja" daje pozwolenie na kontynuację bez poczucia "porażki".
- **Utrzymanie momentum**: Brak resetu zadania pozwala na natychmiastowy start kolejnej sesji.
- **Elastyczność kontekstu**: Opcja "Wróć później" szanuje rzeczywistość (przerwy, spotkania).

## Konsekwencje

### Pozytywne

1. **Niezawodność czasowa**: Timer działa poprawnie niezależnie od stanu aplikacji (foreground/background).
2. **Precyzyjne alarmy**: Dźwięk powiadomienia odtwarza się nawet po długiej nieobecności.
3. **Redukcja stresu**: Trójstopniowy wybór eliminuje "czarno-białe" myślenie o produktywności.
4. **PWA Compliance**: Architektura zgodna z ograniczeniami mobilnych przeglądarek.

### Negatywne

1. **Złożoność kodu**: Wymaga zarządzania `expectedEndTime` w kontekście React.
2. **Pauza vs. Resume**: Konieczność recalkulacji timestamp przy wznawianiu:
   ```typescript
   const resumeTimer = () => {
     setExpectedEndTime(Date.now() + timeLeft * 1000);
     setTimerState('running');
   };
   ```
3. **Midnight boundary**: Dodatkowa logika obsługi zmiany daty (przewinięcie timestampu o 24h dla Time Boxing).

### Neutralne

1. **Zależność od RTC**: Wymaga zaufanego do systemowego zegara urządzenia.
2. **Battery impact**: Minimalny - interval 1s jest akceptowalny dla większości urządzeń.

## Implementacja techniczna

### TimerContext.tsx - Kluczowe fragmenty

```typescript
// Audio Context Unlock (PWA requirement)
const unlockAudioContext = () => {
  const AC = getAudioContext();
  if (AC) {
    const ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    // Subtelny beep jako "user gesture unlock"
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.01;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.001);
  }
};

// Delta calculation (odporność na throttling)
useEffect(() => {
  if (timerState === 'running' || timerState === 'break') {
    intervalRef.current = window.setInterval(() => {
      if (expectedEndTime) {
        const newTimeLeft = Math.max(0, Math.ceil((expectedEndTime - Date.now()) / 1000));
        setTimeLeft(newTimeLeft);
        if (newTimeLeft === 0) {
          handleTimerComplete();
        }
      }
    }, 1000);
  }
  return () => clearInterval(intervalRef.current);
}, [timerState, expectedEndTime]);

// Time Boxing - Midnight boundary handling
const startTimeBox = (targetTimeStr: string) => {
  const [hours, minutes] = targetTimeStr.split(':').map(Number);
  const now = new Date();
  let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  let targetTimestamp = target.getTime();
  
  if (targetTimestamp < Date.now()) {
    targetTimestamp += 24 * 60 * 60 * 1000;  // Next day
  }
  
  const secondsLeft = Math.ceil((targetTimestamp - Date.now()) / 1000);
  setMode('timebox');
  setTimeLeft(secondsLeft);
  setExpectedEndTime(targetTimestamp);
  setTimerState('running');
};
```

### TimerScreen.tsx - Trigger modalu

```typescript
// Nasłuchiwanie na zakończenie czasu
useEffect(() => {
  if (timeLeft === 0 && prevTimeLeftRef.current > 0 && 
      (timerState === 'running' || timerState === 'break')) {
    setShowCompletionModal(true);
  }
  prevTimeLeftRef.current = timeLeft;
}, [timeLeft, timerState]);
```

## Alternatywy rozważane

### Alternatywa 1: Service Worker + Background Sync
- **Wada**: Złożoność, problemy z iOS Safari (brak pełnego wsparcia SW), over-engineering dla timera.
- **Decyzja**: Odrzucona na rzecz prostoty Delta Timestamp.

### Alternatywa 2: Web Workers dla interval
- **Wada**: Web Workers nie są odporne na systemowe throttling (OS-level), dodatkowy narzut komunikacji.
- **Decyzja**: Odrzucona.

### Alternatywa 3: RequestAnimationFrame
- **Wada**: CAŁKOWICIE zatrzymuje się w tle, nie nadaje się do timerów.
- **Decyzja**: Odrzucona.

## Podsumowanie

Architektura Delta Timestamp w połączeniu z trójstopniową logiką domykania sesji stanowi fundament niezawodności i użyteczności modułu Focus Timer. Rozwiązanie jest:
- **Technicznie solidne**: Odporność na throttling, precyzyjne pomiary.
- **Psychologicznie świadome**: Eliminacja winy, wsparcie dla ADHD.
- **PWA-compliant**: Działa na wszystkich platformach w ramach ograniczeń przeglądarek.

## Referencje

- [SPEC AI Development Methodology](../../../docs/spec_methodology.md)
- [Implemented Features: Cyberpunk Focus Timer](../../../docs/implemented_features.md)
- [TimerContext.tsx](../../../src/context/TimerContext.tsx)
- [TimerScreen.tsx](../../../src/screens/TimerScreen.tsx)
- [MDN: Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [W3C: Web Audio API - AudioContext State](https://www.w3.org/TR/webaudio/#dom-baseaudiocontext-state)
