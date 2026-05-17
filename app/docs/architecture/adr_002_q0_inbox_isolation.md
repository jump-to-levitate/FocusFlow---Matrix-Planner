# ADR 002: Izolacja ćwiartki 0 jako globalnego stanu poczekalni (Inbox Capture)

## Status

**Accepted** - Maj 2026

## Kontekst

Użytkownicy z ADHD często doświadczają "paraliżu decyzyjnego" - zjawiska, w którym konieczność natychmiastowego podjęcia decyzji o priorytecie zadania blokuje możliwość jego zapisania. Wynikiem są zapomniane pomysły, niezapisane zobowiązania oraz narastający stres.

Tradycyjne systemy GTD (Getting Things Done) zakładają istnienie "Inbox" - fizycznej lub cyfrowej skrzynki, do której można wrzucić cokolwiek bez natychmiastowej klasyfikacji. W kontekście aplikacji FocusFlow, potrzebna była architektoniczna decyzja o reprezentacji tego stanu w modelu danych Macierzy Eisenhowera.

## Decyzja

Rozszerzamy kontrakt pola `quadrant` o wartość **`0`**, reprezentującą stan poczekalni (Inbox/Q0).

### Zmiany w modelu danych

```typescript
// Przed decyzją
interface Task {
  quadrant: 1 | 2 | 3 | 4;  // Tylko kategoryzowane
}

// Po decyzji
interface Task {
  quadrant: 0 | 1 | 2 | 3 | 4;  // 0 = Inbox, 1-4 = Macierz
}
```

### Konsekwencje architektoniczne

#### 1. Filtrowanie w widokach

**Widok Macierzy (MatrixScreen)**:
- Jawne wykluczenie Q0: `task.quadrant !== 0`.
- Użytkownik widzi tylko zadania, które zostały już skategoryzowane.

**Widok Inbox**:
- Izolacja Q0: `task.quadrant === 0`.
- Dedykowany interfejs zarządzania notatkami w stanie "surowym".

#### 2. Rozwidlenie transakcji w QuizModal

Dwa tryby przepływu danych:

**Tryb A: Reklasyfikacja istniejącej notatki**
```typescript
if (onClassify && classifyTaskId !== undefined && predictedQuadrant !== null) {
  await onClassify(classifyTaskId, predictedQuadrant);
  // Update in-place: quadrant zmienia się z 0 na 1-4
}
```

**Tryb B: Tworzenie nowego zadania**
```typescript
await db.tasks.add({
  title: taskTitle.trim(),
  quadrant: predictedQuadrant,  // Bezpośrednio 1-4 (bez Q0)
  completed: false,
  createdAt: new Date(),
});
```

#### 3. Pre-fill Quiz Integration

Mechanizm przekazywania treści notatki z Inbox do Quizu:
- Użycie `initialTitle` w hooku `useQuizForm`.
- Pominięcie kroku wprowadzania tytułu (`skipTitleStep: true`).
- Wymuszenie full re-mount przez `key={taskId}` (eliminacja "zombie state").

## Konsekwencje

### Pozytywne

1. **Redukcja paraliżu decyzyjnego**: Użytkownik może "zrzucić" myśl w < 3 sekundy.
2. **Jasna separacja obowiązków**: Inbox ≠ Macierz, co odpowiada mentalnym modelom użytkownika.
3. **Elastyczność przepływu**: Notatka może zostać dodana przez różne wejścia (Dashboard, Timer, Inbox).
4. **Kompatybilność wsteczna**: Istniejące zadania z Q1-4 nie wymagają migracji.

### Negatywne

1. **Złożoność filtrowania**: Każdy widok musi jawnie obsługiwać Q0 (brak domyślnego wykluczenia).
2. **Ryzyko data pollution**: Użytkownik może pozostawić zadania w Q0 na długi czas.
3. **Dodatkowy stan UI**: Konieczność zarządzania przejściami Q0 → Q1-4.

## Alternatywy rozważane

### Alternatywa 1: Osobna tabela/collection "Inbox"
- **Wada**: Duplikacja logiki (title, createdAt, completed), konieczność migracji przy klasyfikacji.
- **Decyzja**: Odrzucona ze względu na redundancję.

### Alternatywa 2: Pole `isInbox: boolean`
- **Wada**: Rozproszenie logiki stanu (dwa pola określające to samo), trudniejsze indeksowanie.
- **Decyzja**: Odrzucona na rzecz spójnego enuma.

### Alternatywa 3: Null/undefined jako "nieprzypisane"
- **Wada**: Niejawny stan, trudności w filtrowaniu Dexie (brak indeksu na null).
- **Decyzja**: Odrzucona - jawna wartość `0` jest czytelniejsza.

## Podsumowanie

Decyzja o wprowadzeniu ćwiartki `0` jako Inbox jest fundamentalnym elementem architektury FocusFlow, bezpośrednio odpowiadającym na potrzeby użytkowników z ADHD. Wymaga ona świadomego zarządzania filtrowaniem w każdym widoku, ale zapewnia intuicyjny model mentalny i redukuje paraliż decyzyjny.

## Referencje

- [SPEC AI Development Methodology](../../../docs/spec_methodology.md)
- [Implemented Features: Inbox Capture](../../../docs/implemented_features.md)
- Dexie.js Documentation: Compound Indexes and Filtering
- GTD (Getting Things Done) - David Allen, rozdział "Capture"
