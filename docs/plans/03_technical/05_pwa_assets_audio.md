# Technical Specification: PWA Assets & Audio Engine

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Architektura PWA (Progressive Web App)

### 1.1 Cel

FocusFlow działa jako **Offline-First PWA**, zapewniając:
- Działanie bez połączenia internetowego
- Instalację na urządzeniach mobilnych (Add to Home Screen)
- Natywne powiadomienia dźwiękowe
- Szybkie ładowanie (cache-first strategy)

### 1.2 Manifest PWA

```json
{
  "name": "FocusFlow - ADHD Matrix Planner",
  "short_name": "FocusFlow",
  "description": "Cyberpunk productivity system for ADHD minds",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#D000FF",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 1.3 Service Worker (Vite PWA)

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ]
};
```

---

## 2. Silnik Audio (Web Audio API)

### 2.1 Problem: Audio Context Autoplay Policy

Przeglądarki (szczególnie mobilne) blokują **AudioContext** do momentu interakcji użytkownika:
- Chrome: wymaga gesture (click/touch)
- Safari: wymaga gesture + user activation
- Firefox: mniej restrykcyjny, ale nadal ograniczony

### 2.2 Rozwiązanie: Gesture Unlock

```typescript
// AudioContext jest tworzony, ale wymaga "unlock"
let audioContext: AudioContext | null = null;
let isAudioUnlocked = false;

const unlockAudio = () => {
  if (isAudioUnlocked) return;
  
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      isAudioUnlocked = true;
      console.log('[Audio] Context unlocked by user gesture');
    });
  } else {
    isAudioUnlocked = true;
  }
};

// Przypnij do interakcji użytkownika
const handleStartTimer = () => {
  unlockAudio();  // Odblokuj przy starcie timera
  startTimer();
};
```

### 2.3 PWA Audio Gesture Unlock w Timerze

```tsx
// TimerScreen.tsx
const TimerScreen = () => {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  
  const unlockAudio = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => setAudioUnlocked(true));
    } else {
      setAudioUnlocked(true);
    }
  };
  
  return (
    <>
      {/* Przycisk START odblokowuje audio */}
      <button 
        onClick={() => {
          unlockAudio();
          startTimer();
        }}
      >
        START
      </button>
      
      {/* Indykator odblokowania audio (opcjonalny) */}
      {!audioUnlocked && (
        <span className="text-xs text-white/50">
          Kliknij START dla dźwięków
        </span>
      )}
    </>
  );
};
```

---

## 3. Generator Dźwięków (Web Audio API)

### 3.1 Oscillator-based Synthesis

```typescript
const playNotification = (
  frequency = 440,     // Hz (A4 = 440Hz)
  duration = 500,    // ms
  type: OscillatorType = 'sine'
): void => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  
  const ctx = new AudioContextClass();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Konfiguracja oscylatora
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  // Połączenie: osc -> gain -> destination
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Envelope (attack, decay, sustain, release)
  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);  // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.00001, now + duration / 1000);  // Decay/Release
  
  // Start/Stop
  oscillator.start(now);
  oscillator.stop(now + duration / 1000);
};
```

### 3.2 Mapa Dźwięków Systemowych

| Zdarzenie | Częstotliwość | Typ | Czas (ms) | Znaczenie |
|-----------|--------------|-----|-----------|-----------|
| **Timer Complete** | 440 Hz (A4) | sine | 500 | Sesja zakończona |
| **Break Start** | 523 Hz (C5) | sine | 300 | Rozpoczęcie przerwy |
| **Pause** | 330 Hz (E4) | sine | 200 | Wstrzymanie timera |
| **Timer Start** | 392 Hz (G4) | sine | 150 | Start odliczania |
| **Task Complete** | 880 Hz (A5) | sine | 400 | Zadanie ukończone |
| **Error** | 150 Hz | sawtooth | 300 | Błąd operacji |

### 3.3 Cyberpunk Beep (Timer Complete)

```typescript
const playTimerComplete = () => {
  // Dwutonowa sekwencja (cyberpunk style)
  playNotification(440, 200, 'sine');  // A4
  setTimeout(() => playNotification(880, 300, 'sine'), 150);  // A5 (oktawa wyżej)
};
```

---

## 4. Konfiguracja Dźwięków Końca Sesji

### 4.1 Triggering przy Timer Complete

```typescript
// TimerContext.tsx
useEffect(() => {
  if (timeLeft === 0 && prevTimeLeftRef.current > 0) {
    // Timer zakończony
    playTimerComplete();
    setShowCompletionModal(true);
  }
  prevTimeLeftRef.current = timeLeft;
}, [timeLeft]);
```

### 4.2 Integracja z Modal Completion

```tsx
// Wywołanie dźwięku przy otwarciu modala
useEffect(() => {
  if (showCompletionModal) {
    playNotification(440, 500, 'sine');
  }
}, [showCompletionModal]);
```

---

## 5. Offline-First Strategy

### 5.1 Cache Strategy (Cache-First)

```typescript
// Service Worker - precache
workbox.precaching.precacheAndRoute([
  { url: '/', revision: '1.0.0' },
  { url: '/index.html', revision: '1.0.0' },
  { url: '/app.js', revision: '1.0.0' },
  { url: '/app.css', revision: '1.0.0' }
]);

// Runtime cache dla danych
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60 // 1 dzień
      })
    ]
  })
);
```

### 5.2 IndexedDB jako Primary Storage

```typescript
// Dexie.js - offline-first database
const db = new Dexie('FocusFlowDB');
db.version(1).stores({
  tasks: '++id, title, quadrant, subcategory, completed, createdAt',
  notes: '++id, content, taskId, createdAt, updatedAt'
});

// Wszystkie operacje offline
const addTask = async (task: Task) => {
  return await db.tasks.add(task);  // Lokalnie, instant
};
```

---

## 6. PWA Installation

### 6.1 Add to Home Screen (A2HS)

```typescript
// Prompt dla instalacji (opcjonalny)
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Pokaż custom button
  showInstallButton();
});

const installPWA = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    console.log('PWA installed');
  }
  deferredPrompt = null;
};
```

### 6.2 Standalone Mode Detection

```typescript
const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Dostosowanie UI dla standalone
if (isStandalone()) {
  // Ukryj pasek adresu, zwiększ padding top
  document.body.classList.add('pwa-standalone');
}
```

---

## 7. Checklist PWA & Audio

- [x] Manifest.json z icons i theme_color
- [x] Service Worker (Vite PWA plugin)
- [x] Cache-first strategy dla statyków
- [x] AudioContext unlock przez user gesture
- [x] Oscillator-based sound synthesis
- [x] Mapa dźwięków systemowych (440Hz, 523Hz, 330Hz, etc.)
- [x] Timer complete trigger
- [x] Offline-first IndexedDB (Dexie.js)
- [x] Standalone mode detection
- [x] Add to Home Screen support

---

## 8. Testowanie PWA

### 8.1 Chrome DevTools

1. **Application > Manifest** - weryfikacja manifest.json
2. **Application > Service Workers** - weryfikacja SW
3. **Lighthouse > PWA** - audyt wyniku PWA
4. **Network > Offline** - test działania offline

### 8.2 Testy Audio

```typescript
// Unit test dla audio
it('should unlock audio on user gesture', () => {
  const mockContext = {
    state: 'suspended',
    resume: jest.fn().mockResolvedValue(undefined)
  };
  window.AudioContext = jest.fn(() => mockContext);
  
  unlockAudio();
  
  expect(mockContext.resume).toHaveBeenCalled();
});
```

---

## 9. References

- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [PWA Guidelines](https://web.dev/pwa-checklist/)
- [AudioContext Autoplay](https://developer.chrome.com/blog/autoplay/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
