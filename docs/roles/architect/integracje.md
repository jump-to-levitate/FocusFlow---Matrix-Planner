# Strategia Integracji z Native Browser APIs

> Browser Integration & PWA Specification  
> Document ID: ARCH-INTEGRATIONS-001  
> Status: APPROVED  
> Date: 2026-05-18  
> Owner: Principal Software Architect

---

## 1. Audio Context API (PWA Gesture Unlock)

### 1.1 Problem: Autoplay Policy

**Chrome i Safari blokują odtwarzanie dźwięku bez explicit gesture od użytkownika.**

Dokumentacja Chrome: "Autoplay with sound is allowed if: User has interacted with the domain (click, tap, etc.)"

### 1.2 Rozwiązanie: Explicit Audio Context Unlock

**Lokalizacja:** `TimerScreen.tsx` - przycisk START

```typescript
// ============================================================================
// AUDIO CONTEXT UNLOCK
// Explicit unlock bound to user gesture (START button click)
// ============================================================================

// Global audio context (singleton)
let audioContext: AudioContext | null = null;
let isAudioUnlocked = false;

/**
 * Explicitly unlocks audio context on user gesture
 * Must be called in response to click/touch event
 */
export function unlockAudio(): void {
  if (isAudioUnlocked) return;
  
  // Create AudioContext if not exists
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  // Resume if suspended (required by Autoplay Policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      isAudioUnlocked = true;
      console.log('Audio context unlocked');
    });
  } else {
    isAudioUnlocked = true;
  }
}

// Użycie w TimerScreen:
function TimerScreen() {
  const handleStart = () => {
    unlockAudio(); // Unlock on user gesture
    startTimer(task, duration);
  };
  
  return (
    <button onClick={handleStart}>
      START FOCUS
    </button>
  );
}
```

**Zalety:**
- **Zgodność z policy** - dźwięki działają po kliknięciu START
- **No dependencies** - czysty Web API
- **Singleton pattern** - jeden AudioContext dla całej aplikacji

---

## 2. Web Audio API (Oscillator-based Sounds)

### 2.1 Specyfikacja: Cyberpunk Double-Beep

**Wymagania:**
- Brak zewnętrznych plików MP3/WAV (czysty kod, mniejszy bundle)
- Generowanie w locie (Web Audio API)
- Cyberpunkowy charakter (square wave, high frequency)
- Double-beep (dwukrotny sygnał) dla lepszej audibility

### 2.2 Implementacja: playNotification()

```typescript
// ============================================================================
// WEB AUDIO API - Oscillator-based Notification Sound
// Generates cyberpunk double-beep in real-time
// ============================================================================

/**
 * Plays a cyberpunk-style notification sound
 * Double-beep pattern: high -> higher (attention-grabbing)
 */
export function playNotification(): void {
  if (!audioContext) return;
  if (!isAudioUnlocked) return; // Guard clause
  
  const now = audioContext.currentTime;
  
  // First beep - high pitch (880 Hz = A5)
  playBeep(now, 880, 0.15);
  
  // Second beep - higher pitch (1174 Hz = D6), short delay
  playBeep(now + 0.2, 1174, 0.15);
}

/**
 * Generates a single beep with given frequency and duration
 */
function playBeep(
  startTime: number, 
  frequency: number, 
  duration: number
): void {
  if (!audioContext) return;
  
  // Create oscillator (square wave = cyberpunk character)
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  
  // Gain node (volume envelope)
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.3, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
  
  // Connect graph: oscillator -> gain -> destination
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Schedule playback
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

// Użycie w TimerContext (session complete):
const handleComplete = () => {
  playNotification(); // Cyberpunk double-beep
  dispatch({ type: 'COMPLETE' });
};
```

### 2.3 Charakterystyka Dźwięku

| Parametr | Wartość | Uzasadnienie |
|----------|---------|--------------|
| **Waveform** | `square` | Cyberpunk character, aggressive |
| **First beep** | 880 Hz (A5) | Attention-grabbing but not shrill |
| **Second beep** | 1174 Hz (D6) | Higher = urgency = "session done" |
| **Delay** | 200ms | Pattern recognition (not single beep) |
| **Duration** | 150ms each | Short, punchy |
| **Volume** | 0.3 → exponential decay | Not jarring, fades out |

---

## 3. Service Worker (PWA Offline-First)

### 3.1 Konfiguracja Workbox

**Lokalizacja:** `sw.ts` (TypeScript Service Worker)

```typescript
// ============================================================================
// SERVICE WORKER - PWA Offline-First Configuration
// Uses Workbox for caching strategies
// ============================================================================

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

// Precache assets generated by build (injected by workbox-build)
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// ============================================================================
// CACHING STRATEGIES
// ============================================================================

/**
 * Static assets: Cache First
 * JS/CSS chunks - nie zmieniają się często, cache is king
 */
registerRoute(
  ({ request }) => 
    request.destination === 'script' || 
    request.destination === 'style',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

/**
 * Images: Stale While Revalidate
 * Szybkie ładowanie z cache, ale aktualizacja w tle
 */
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

/**
 * Fonts: Cache First
 * Fonts się nie zmieniają, cache forever
 */
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  })
);

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Skip waiting - activate new SW immediately
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Install - precache static assets
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Activate immediately
});

/**
 * Activate - claim clients
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});
```

### 3.2 Rejestracja SW w Aplikacji

**Lokalizacja:** `main.tsx` lub `index.tsx`

```typescript
// ============================================================================
// SERVICE WORKER REGISTRATION
// ============================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available, prompt user to reload
                console.log('New version available');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}
```

### 3.3 Strategie Cache'owania

| Asset Type | Strategia | Max Age | Uzasadnienie |
|------------|-----------|---------|--------------|
| **JS/CSS** | Cache First | 30 days | Build artifacts, immutable |
| **Fonts** | Cache First | 1 year | Fonts się nie zmieniają |
| **Images** | Stale While Revalidate | 7 days | Balance speed vs freshness |
| **HTML** | Network First | N/A | Always fresh, offline fallback |

---

## 4. PWA Manifest

### 4.1 Web App Manifest (manifest.json)

```json
{
  "name": "FocusFlow - ADHD Task Matrix",
  "short_name": "FocusFlow",
  "description": "ADHD-optimized task management with dopamine-driven design",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#39FF14",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["productivity", "utilities"],
  "screenshots": [
    {
      "src": "/screenshot-1.png",
      "sizes": "430x932",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

### 4.2 Display Mode: Standalone

**Uzasadnienie:** `display: "standalone"`:
- Brak browser chrome = immersive experience
- Wygląda jak natywna aplikacja
- Więcej miejsca na content (430px constraint)
- Address bar nie zabiera przestrzeni

---

## 5. Podsumowanie Integracji

| API | Użycie | Zgodność | Uwagi |
|-----|--------|----------|-------|
| **AudioContext** | Unlock on START button | Chrome, Safari, Firefox | Required by Autoplay Policy |
| **Web Audio API** | Oscillator-based beeps | All modern browsers | No external dependencies |
| **Service Worker** | Cache-first, offline | Chrome, Safari, Firefox | Workbox abstraction |
| **PWA Manifest** | Install prompt, standalone | All modern browsers | Required for A2HS |

---

**Document ID:** ARCH-INTEGRATIONS-001  
**Owner:** Principal Software Architect  
**Status:** APPROVED  
**Last Updated:** 2026-05-18
