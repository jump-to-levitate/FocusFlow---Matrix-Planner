# Focus Timer (7 ADHD-Proof Presets)

## 1. Cel

**Globalny silnik odliczania** z blokadą Background Throttling dla osób z ADHD. Umożliwia głęboką pracę bez rozpraszania poprzez 7 predefiniowanych presetów czasowych eliminujących paraliż decyzyjny przy wyborze czasu.

## 2. Zakres

**Wchodzi w zakres:**
- 7 predefiniowanych presetów czasowych (Quick 5, Quick 10, Standard 15/5, Standard 25/5, Deep 50/10, Deep 90/15, Time Boxing)
- Globalny TimerContext singleton
- Dropdown zadań z Dexie.js (Q1, Q2)
- UI cyberpunkowe z neonami

**Nie wchodzi w zakres:**
- Dźwięki/alerty systemowe (silent mode)
- Synchronizacja czasów między urządzeniami
- Statystyki produktywności historyczne

## 3. Wymagania funkcjonalne

- Użytkownik może wybrać jeden z 7 presetów lub niestandardowy czas (1-240 min)
- Timer działa jako singleton w TimerContext - dostępny z każdego ekranu
- Background Throttling block - timer oparty na Unix Timestamp Delta
- Przypisanie zadania do timera (opcjonalne) - wybór z dropdown
- Automatyczne przejście do przerwy po zakończeniu focus

## 4. Wymagania niefunkcjonalne

- **Wydajność:** Background Throttling block - kalkulacja Unix Timestamp Delta, update co 1s bez driftu
- **Bezpieczeństwo:** Dane lokalne w IndexedDB (Dexie.js), brak sync z serwerem
- **UX:** One-Thing-At-A-Time - tylko jeden timer na ekranie, brak listy rozpraszającej podczas focus

## 5. Kontekst techniczny

### Komponenty
- `TimerContext.tsx` - globalny singleton state dla timera
- `TimerScreen.tsx` - główny widok timera
- `TimerDisplay.tsx` - wyświetlanie odliczania
- `PresetSelector.tsx` - wybór presetów 7/10/15/25/50/90/Custom

### API (TimerContext)
```typescript
interface TimerContextType {
  isRunning: boolean;
  mode: 'focus' | 'break';
  minutes: number;
  seconds: number;
  progress: number; // 0-100%
  selectedTask: Task | null;
  startTimer: (minutes: number, task?: Task) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
}
```

### Dane (Dexie.js)
```typescript
// Timer nie zapisuje historii - tylko bieżący stan w Context
// Opcjonalne przypisanie zadania przez selectedTask
const tasks = await db.tasks
  .where('quadrant')
  .anyOf([1, 2])
  .and(t => !t.completed)
  .toArray();
```

## 6. Kroki implementacji

1. Utworzenie TimerContext singleton z useContext/useReducer
2. Implementacja Unix Timestamp Delta dla Background Throttling block
3. Dodanie PresetSelector z 7 opcjami + custom slider
4. Implementacja TimerScreen z cyberpunkowym UI
5. Integracja dropdown zadań z Dexie (Q1, Q2 only)
6. Dodanie progress bar i animacji neonowych
7. Testy: drift timera, pause/resume, task assignment

## 7. Kryteria akceptacji

**AC-1: Quick 5 - Pogromca Paraliżu Decyzyjnego**
> GIVEN użytkownik z ADHD cierpi na paraliż decyzyjny WHEN wybiera preset "Quick 5" THEN timer startuje natychmiast (5 min, 0 przerwa) bez konieczności wybierania czasu niestandardowego.

**AC-2: Background Throttling Block**
> GIVEN timer jest uruchomiony w tle (tab nieaktywny) WHEN upływa 5 minut w rzeczywistym czasie THEN timer pokazuje dokładnie 5 minut upłyniętych (zabezpieczenie przed background throttling przez kalkulację Unix Timestamp Delta).

**AC-3: Timer Singleton**
> GIVEN timer jest uruchomiony na ekranie TimerScreen WHEN użytkownik nawiguje do MatrixScreen lub Dashboard THEN timer kontynuuje odliczanie, a przycisk "Timer" w nawigacji pokazuje aktywny stan (neon pulse).

**AC-4: Time Boxing Mode**
> GIVEN użytkownik potrzebuje niestandardowego czasu (np. 45 min na spotkanie) WHEN wybiera "Time Boxing" i ustawia slider na 45 min THEN timer konfiguruje się na 45 min bez automatycznej przerwy (idealne dla time-blockingu).

## 8. Testy

### Unit
- Test kalkulacji Unix Timestamp Delta (brak driftu przy background)
- Test TimerContext state management (start/pause/resume/stop)
- Test PresetSelector - poprawne mapowanie presetów na minuty

### Integracyjne
- **Test E2E Timer Flow:** Start 25min preset, minimize browser, wait 1min real time, reopen - verify timer shows 24min remaining
- **Test Task Assignment:** Wybór zadania z dropdown, start timera, weryfikacja że selectedTask jest przypisane
- **Test Quick 5 UX:** Kliknięcie Quick 5 -> immediate start bez dodatkowych pytań
