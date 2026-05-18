# Inbox Capture (Q0 State) & Brain Dump

## 1. Cel

Funkcjonalność **seryjnego zrzucania myśli bez barier decyzyjnych**. Umożliwia użytkownikom błyskawiczne "opróżnienie głowy" bez konieczności natychmiastowej kategoryzacji zadań. Chroni pamięć roboczą osób neuroatypowych (ADHD/ASD) poprzez izolację niezakwalifikowanych zadań w stanie Q0.

## 2. Zakres

**Wchodzi w zakres:**
- Dedykowany widok Inbox (Q0) z textarea do seryjnego wprowadzania
- Automatyczny zapis do IndexedDB bez kategoryzacji
- Licznik Q0 na Dashboardzie (badge)
- Integracja z Quizem (pre-fill tytułem)

**Nie wchodzi w zakres:**
- Algorytm klasyfikacji (osobny plan)
- Podkategorie (dotyczą Q2/Q3/Q4)
- Edycja zadań poza przekwalifikowaniem

## 3. Wymagania funkcjonalne

- Użytkownik może wprowadzić tekst w textarea i zapisać bez kategoryzacji (Q0)
- Zadania Q0 nie pojawiają się w głównej Macierzy (Q1-Q4)
- Licznik Q0 na Dashboardzie pokazuje liczbę niezakwalifikowanych zadań
- Przycisk "Kwalifikuj" otwiera Quiz z pre-fill tytułem
- Po zakwalifikowaniu zadanie zmienia quadrant na 1-4 i znika z Inboxu

## 4. Wymagania niefunkcjonalne

- **Wydajność:** Zapis do IndexedDB < 50ms, licznik aktualizuje się natychmiast (useLiveQuery)
- **Bezpieczeństwo:** Dane przechowywane lokalnie (offline-first), brak wysyłki na serwer
- **UX:** Zero pytań przy brain dump, seryjne dodawanie bez reloadu, autofocus na textarea

## 5. Kontekst techniczny

### Komponenty
- `BrainDumpScreen.tsx` - główny widok Inbox
- `DashboardScreen.tsx` - wyświetlanie licznika Q0
- `QuizModal.tsx` - kwalifikacja z pre-fill

### API (Dexie.js)
```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 0 | 1 | 2 | 3 | 4;  // Q0 = Inbox
  subcategory?: string | null;
  completed: boolean;
  createdAt: Date;
}
```

### Dane (filtrowanie)
```typescript
// Macierz Q1-Q4: wyklucza Q0
const matrixTasks = safeTasks.filter(t => !t.completed && t.quadrant !== 0);

// Inbox (Q0): tylko niezakwalifikowane
const inboxTasks = safeTasks.filter(t => !t.completed && t.quadrant === 0);

// Licznik na pulpicie
const q0Count = tasks.filter(t => t.quadrant === 0 && !t.completed).length;
```

## 6. Kroki implementacji

1. Utworzenie interfejsu Task z polem `quadrant: 0 | 1 | 2 | 3 | 4`
2. Implementacja widoku BrainDumpScreen z textarea i listą
3. Dodanie licznika Q0 do DashboardScreen
4. Integracja z QuizModal (pre-fill tytułem z Q0)
5. Filtrowanie zadań Q0 z głównej Macierzy
6. Testy: seryjny dump, izolacja Q0, badge counter

## 7. Kryteria akceptacji

**AC-1: Seryjny Brain Dump**
> GIVEN użytkownik znajduje się w widoku Inbox WHEN wpisuje tekst i naciska Enter THEN zadanie zapisuje się do Q0 bez kategoryzacji, a textarea czyści się automatycznie.

**AC-2: Izolacja Q0**
> GIVEN zadanie zapisane w Q0 (quadrant: 0) WHEN użytkownik przechodzi do głównej Macierzy THEN zadanie NIE jest widoczne w żadnej ćwiartce (Q1-Q4).

**AC-3: Pre-fill Quiz**
> GIVEN zadanie w Q0 z tytułem "Zadzwonić do dentysty" WHEN użytkownik klika "Kwalifikuj" THEN QuizModal otwiera się z pre-filled tytułem, gotowym do klasyfikacji.

## 8. Testy

### Unit
- Test filtrowania Q0 z głównej Macierzy
- Test licznika badge (zliczanie tylko niezakończonych Q0)
- Test pre-fill tytułu w QuizModal

### Integracyjne
- **Test E2E Brain Dump:** Dodanie 3 zadań seryjnie, weryfikacja izolacji Q0
- **Test Pre-fill Integration:** Stworzenie zadania w Q0, kwalifikacja, weryfikacja przeniesienia do docelowej ćwiartki
