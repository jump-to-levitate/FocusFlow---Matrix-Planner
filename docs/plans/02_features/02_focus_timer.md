# Feature Specification: Focus Timer (Cyberpunk Timer)

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Cel Funkcjonalny

Minaturowy timer Pomodoro wbudowany w UI, zaprojektowany jako **dopaminowy focus tool** z cyberpunkową stylistyką. Wspiera 7 trybów pracy - od szybkich 5-minutowych burstów do głębokiej pracy 90-minutowej.

---

## 2. Tryby Pracy (7 Presets)

| Tryb | Czas Focus | Przerwa | Przeznaczenie |
|------|-----------|---------|---------------|
| **Quick 5** | 5 min | 0 min | Szybki burst, "pierwszy krok" |
| **Quick 10** | 10 min | 0 min | Krótka sesja bez przerwy |
| **Standard 15/5** | 15 min | 5 min | Klasyczny Pomodoro (skrócony) |
| **Standard 25/5** | 25 min | 5 min | Klasyczny Pomodoro |
| **Deep 50/10** | 50 min | 10 min | Głęboka praca |
| **Deep 90/15** | 90 min | 15 min | Flow state, blok czasowy |
| **Time Boxing** | 1-240 min | 0 min | Dowolny czas (custom) |

### 2.1 Time Boxing Mode

- Slider od 1 minuty do 4 godzin (240 min)
- Brak automatycznej przerwy
- Idealny dla spotkań i time-blockingu

---

## 3. Stany Interfejsu i Wizualizacje

### 3.1 Stan: Running (Aktywny)

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

### 3.2 Stan: Paused (Wstrzymany)

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

### 3.3 Stan: Break (Przerwa)

- Automatyczne przejście po zakończeniu focus time
- Dźwięk powiadomienia (beep 440Hz)
- Odblokowanie przycisku "Skip Break"

---

## 4. Matematyka Timera (Delta Timestamp)

### 4.1 Problem: Background Throttling

Przeglądarki throttle'ują `setInterval` gdy tab jest w tle. Rozwiązanie: **Unix Timestamp Delta**.

### 4.2 Algorytm

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

### 4.3 Zalety

- **Odporność na throttling**: Nawet jeśli interval jest throttle'owany do 1s, delta jest prawidłowa
- **Dokładność**: Błąd maksymalny = 1 sekunda
- **Efektywność**: Brak konieczności ciągłego dekrementowania

---

## 5. Modal Zakończenia Sesji (3-kierunkowy)

### 5.1 Flow Modalu

```
Timer osiągnął 00:00
    ↓
Wyświetlenie CompletionModal
    ↓
Użytkownik wybiera jedną z 3 opcji:
```

### 5.2 Opcje Modalu

#### Opcja 1: Zadanie ukończone ✅
```typescript
const handleCompleteTask = async () => {
  if (activeTaskId) {
    await db.tasks.update(activeTaskId, { completed: true });
    setActiveTaskId(null);  // Czyszczenie z timera
  }
  setShowCompletionModal(false);
  stopTimer();
};
```

#### Opcja 2: Jeszcze jedna sesja 🔄
```typescript
const handleAnotherSession = () => {
  setShowCompletionModal(false);
  // NIE zatrzymuj timera
  // NIE czyść activeTaskId
  // Użytkownik może wybrać nowy preset
};
```

#### Opcja 3: Wrócę do tego później ⏸️
```typescript
const handleReturnLater = () => {
  setShowCompletionModal(false);
  stopTimer();
  // NIE oznaczaj jako completed
  // Zadanie pozostaje w aktywnych
  navigate('/');
};
```

### 5.3 UX Decyzje

- **Globalny stan modalu**: `showCompletionModal` w TimerContext (zamiast lokalnego stanu)
- **Race condition fix**: Stan w context zapobiega resetowaniu przy re-renderze
- **Elastyczność**: Użytkownik ma kontrolę nad domknięciem sesji

---

## 6. Integracja z Zadaniami

### 6.1 Dropdown Wyboru Zadania

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

### 6.2 Filtrowanie Zadań

```typescript
// Tylko aktywne zadania z Q1 i Q2
const timerTasks = tasks.filter(t => 
  !t.completed && 
  (t.quadrant === 1 || t.quadrant === 2)
);
```

### 6.3 Widok Zadania w Timerze

- Wyświetlane pod zegarem
- Kolorowe oznaczenie ćwiartki (Q1 = czerwony, Q2 = fiolet)
- Przycisk "Zmień zadanie" bez przerywania timera

---

## 7. Powiadomienia Audio

### 7.1 Sygnały Dźwiękowe

| Zdarzenie | Częstotliwość | Czas |
|-----------|--------------|------|
| Timer complete | 440 Hz (A4) | 500 ms |
| Break start | 523 Hz (C5) | 300 ms |
| Pause | 330 Hz (E4) | 200 ms |

### 7.2 Implementacja

```typescript
const playNotification = (frequency = 440, duration = 500) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration / 1000);
  osc.stop(ctx.currentTime + duration / 1000);
};
```

---

## 8. Cyberpunk UI Details

### 8.1 Zegar SVG (Progress Ring)

```tsx
<svg viewBox="0 0 100 100">
  {/* Tło */}
  <circle cx="50" cy="50" r="45" stroke="#1a1a2e" strokeWidth="8" fill="none" />
  
  {/* Postęp - neon */}
  <circle 
    cx="50" cy="50" r="45" 
    stroke={isRunning ? '#39FF14' : '#D000FF'}
    strokeWidth="8" 
    fill="none"
    strokeDasharray={circumference}
    strokeDashoffset={offset}
    strokeLinecap="round"
    style={{ filter: `drop-shadow(0 0 10px ${glowColor})` }}
  />
</svg>
```

### 8.2 Preset Buttons Grid

```
┌─────────────────────────────────────┐
│  [5m]  [10m]  [15/5]                │
│  [25/5] [50/10] [90/15]             │
│       [⏱ Time Box]                  │
└─────────────────────────────────────┘
```

**3x3 Grid z Time Boxing na środku dolnego rzędu**

---

## 9. Kryteria Akceptacji

- [x] 7 presetów czasowych (5/0, 10/0, 15/5, 25/5, 50/10, 90/15, Time Boxing)
- [x] Delta timestamp (odporność na throttling)
- [x] Stany wizualne: Running (zielony), Paused (fiolet), Break (pomarańcz)
- [x] 3-kierunkowy modal zakończenia
- [x] Integracja z zadaniami Q1 i Q2
- [x] Powiadomienia audio (Web Audio API)
- [x] SVG progress ring z neon glow
- [x] Globalny stan modalu (TimerContext)

---

## 10. Decyzje Architektoniczne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Delta timestamp** | Odporność na background throttling |
| **Unix time** | Brak konieczności synchronizacji |
| **Global modal state** | Uniknięcie race conditions przy re-renderze |
| **Web Audio API** | Brak zależności od zewnętrznych plików |
| **SVG ring** | Płynna animacja, kontrola glow |
