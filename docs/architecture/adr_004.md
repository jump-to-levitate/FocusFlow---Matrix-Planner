# ADR 002: Quadrant 0 (Q0) Isolation as Inbox

> Status: ✅ Accepted  
> Data: Maj 2026  
> Autor: FocusFlow Team

---

## Context

ADHD charakteryzuje się **paraliżem decyzyjnym** przy wprowadzaniu nowych zadań. Użytkownik często:

1. Ma 5-10 myśli do zapisania
2. Nie chce podejmować decyzji o pilności/ważności dla każdej
3. Odłoży zapisywanie, jeśli wymaga kategoryzacji
4. Traci pomysły, bo "nie ma czasu teraz na organizowanie"

Tradycyjne GTD ma "Inbox" - ale jest to zwykle jedna lista bez struktury.

---

## Decision

Wprowadzamy **Ćwiartkę 0 (Q0)** jako izolowaną przestrzeń Brain Dump.

### Zasady Q0

1. **Zero decyzji** przy wprowadzaniu - tylko tytuł
2. **Izolacja wizualna** - nie pojawia się w głównej Macierzy (Q1-Q4)
3. **Kwalifikacja później** - zadania z Q0 przechodzą przez Quiz
4. **Seryjny capture** - możliwość szybkiego dodawania wielu zadań

### Model Danych

```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 0 | 1 | 2 | 3 | 4;  // Q0 = Inbox
  subcategory?: string | null;     // null dla Q0
  completed: boolean;
  createdAt: Date;
}
```

### Izolacja w UI

```typescript
// Macierz Q1-Q4 - wyklucza Q0
const matrixTasks = tasks.filter(t => 
  !t.completed && t.quadrant !== 0  // ❌ Q0 niewidoczne
);

// Inbox (Q0) - osobny widok
const inboxTasks = tasks.filter(t => 
  !t.completed && t.quadrant === 0  // ✅ Tylko niezakwalifikowane
);
```

---

## Consequences

### Positive

1. **Redukcja oporu** - użytkownik może dumpować bez kategoryzacji
2. **ADHD-friendly** - dopamina z szybkiego "zrzutu" myśli
3. **Jasna separacja** - Inbox vs Actionable tasks
4. **Batch processing** - kwalifikacja wielu zadań na raz

### Negative

1. **Dodatkowy widok** - użytkownik musi przełączać między Inbox a Macierzą
2. **Risk hoarding** - Q0 może stać się "czarną dziurą" jeśli nie kwalifikować
3. **Złożoność UI** - dodatkowa nawigacja

### Mitigations

- Badge z liczbą zadań w Q0 (zachęta do kwalifikacji)
- Przycisk "Kwalifikuj wszystkie" w Inboxie
- Notyfikacja przy >10 zadaniach w Q0

---

## Flow Użytkownika

```
┌─────────────────────────────────────────────────────────┐
│  1. BRAIN DUMP (Q0)                                     │
│     "Co teraz mam w głowie?"                           │
│     • Kupić mleko                                       │
│     • Projekt X research                                │
│     • Zadzwonić do dentysty                            │
│     • Pomysł na nowy feature                           │
│     ↓                                                   │
│  2. KWALIFIKACJA (Quiz)                                │
│     Zadanie: "Kupić mleko"                             │
│     Pytania: Pilność? Ważność?                         │
│     ↓                                                   │
│  3. ALGORYTM → Ćwiartka                                 │
│     Kupić mleko → Q3 (Pilne, Nieważne)                 │
│     Projekt X → Q2 (Ważne, Niepilne) + subkategoria    │
│     ↓                                                   │
│  4. MACIERZ (Q1-Q4)                                     │
│     Zadania widoczne w odpowiednich ćwiartkach         │
└─────────────────────────────────────────────────────────┘
```

---

## Alternatives Considered

| Rozwiązanie | Dlaczego odrzucono |
|-------------|-------------------|
| Wszystkie zadania do Q1 domyślnie | Chaos w Q1, utrata priorytetów |
| Popup przy dodawaniu "Wybierz ćwiartkę" | Zbyt wiele decyzji, friction |
| Auto-klasyfikacja AI | Złożoność, brak controli użytkownika |
| Tylko 4 ćwiartki bez Q0 | Paraliż decyzyjny przy wprowadzaniu |

---

## Implementation Details

### Snapshot State Mechanism

```typescript
// Quiz resetuje się przy każdym otwarciu (key-based remount)
<QuizModal 
  key={`quiz-${selectedTaskId}`}  // Wymusza re-mount
  isOpen={isQuizOpen}
  taskId={selectedTaskId}
/>
```

### Filtrowanie w Dexie

```typescript
// Index dla quadrant
this.version(1).stores({
  tasks: '++id, title, quadrant, subcategory, completed, createdAt',
});

// Query - Inbox tylko
const inbox = await db.tasks
  .where({ quadrant: 0, completed: false })
  .toArray();
```

---

## Success Metrics

- Czas od otwarcia app do pierwszego zapisu: < 5s
- Liczba zadań w Q0: średnio < 7 (nie hoarding)
- Konwersja Q0 → zakwalifikowane: > 80% w ciągu 24h

---

## Related Decisions

- ADR 001: Initial Stack (Dexie.js umożliwia Q0)
- ADR 004: Synchronous Derived State (Quiz do kwalifikacji)

---

## References

- [Getting Things Done - David Allen](https://gettingthingsdone.com/)
- [ADHD Executive Function](https://www.additudemag.com/executive-function-deficit-adhd/)
