# Feature Specification: Inbox Capture (Q0 Brain Dump)

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Cel Funkcjonalny

Inbox Capture (Ćwiartka 0) to **przestrzeń bez decyzji** - izolowana strefa do szybkiego zrzutu myśli bez konieczności natychmiastowej klasyfikacji. Eliminuje paraliż decyzyjny przy wprowadzaniu danych.

---

## 2. Architektura Q0 (Izolacja)

### 2.1 Model Danych

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

### 2.2 Izolacja Wizualna

- Zadania z `quadrant: 0` **nie pojawiają się** w głównej Macierzy (Q1-Q4)
- Q0 ma dedykowany widok "Inbox" - osobna zakładka nawigacji
- Po zakwalifikowaniu (Quiz), zadanie zmienia `quadrant` na 1-4

### 2.3 Filtrowanie w JS

```typescript
// Macierz Q1-Q4: wyklucza Q0
const tasks = safeTasks.filter(t => !t.completed && t.quadrant !== 0);

// Inbox (Q0): tylko niezakwalifikowane
const inboxTasks = safeTasks.filter(t => !t.completed && t.quadrant === 0);
```

---

## 3. Mechanizm Seryjnego Zrzutu (Batch Capture)

### 3.1 Flow Użytkownika

1. **Wejście do Inboxu** → automatyczne focus na textarea
2. **Wpis myśli** → tekst bez struktury (np. "Zadzwonić do dentysty, kupić mleko, projekt X")
3. **Enter lub przycisk** → zapis do Q0
4. **Pozostanie w Inboxie** → możliwość seryjnego dodawania
5. **Przycisk "Kwalifikuj"** → przejście do Quizu dla zadań z Q0

### 3.2 UX Decyzje

- **Brak walidacji tytułu** - użytkownik może wpisać cokolwiek
- **Autosave** - draft zapisywany w localStorage
- **Szybkie usuwanie** - swipe lub przycisk X bez potwierdzenia

---

## 4. Snapshot State Mechanism (Quiz Integration)

### 4.1 Problem: Stale State przy Re-mount

Gdy użytkownik otwiera Quiz dla zadania z Q0, komponent `QuizModal` musi:
1. Zresetować swój stan maszyny stanów
2. Wyczyścić poprzednie odpowiedzi
3. Rozpocząć od kroku 'title'

### 4.2 Rozwiązanie: Key-based Remount

```tsx
// MatrixScreen.tsx
<QuizModal 
  key={`quiz-${selectedTaskId}`}  // Wymusza re-mount
  isOpen={isQuizOpen}
  taskId={selectedTaskId}
  initialMode="classify"
/>
```

Zmiana `key` wymusza pełny unmount/remount komponentu, co gwarantuje czysty stan.

### 4.3 Hook: useQuizForm

```typescript
const useQuizForm = (options?: QuizOptions) => {
  // Reset przy mount
  useEffect(() => {
    resetQuiz();
  }, []);
  
  const resetQuiz = () => {
    setCurrentStep('title');
    setImportanceAnswers([null, null, null]);
    setUrgencyAnswers([null, null, null]);
    setSubcategory(null);
  };
};
```

---

## 5. Interfejs Użytkownika

### 5.1 Inbox Screen Layout

```
┌─────────────────────────────────────┐
│  🧠 Inbox (Q0)              [?]    │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Co teraz masz w głowie?    │   │
│  │                             │   │
│  │  [____________________]     │   │
│  └─────────────────────────────┘   │
│                                     │
│  [    + Dodaj do Inbox    ]         │
│                                     │
├─────────────────────────────────────┤
│  📋 Zadania do kwalifikacji:        │
│                                     │
│  • Zadzwonić do dentysty      [×]  │
│  • Projekt X - research       [×]  │
│  • Kupić mleko                [×]  │
│                                     │
│  [   🔮 Kwalifikuj Zadania   ]      │
│                                     │
└─────────────────────────────────────┘
```

### 5.2 Stany Puste

- **Brak zadań**: "Inbox jest pusty. Dodaj pierwszą myśl!"
- **Samooczyszczenie**: Po zakwalifikowaniu wszystkich zadań, przycisk "Kwalifikuj" jest disabled

---

## 6. Integracja z Quizem

### 6.1 Flow Kwalifikacji

```
Inbox (lista zadań Q0)
    ↓
Kliknięcie "Kwalifikuj" lub ikona edycji
    ↓
QuizModal z prefill tytułem
    ↓
Quiz (3 pytania + subkategoria dla Q2)
    ↓
Ekran potwierdzenia (ćwiartka, podkategoria)
    ↓
Zapis: update db.tasks set quadrant=X, subcategory=Y
    ↓
Zadanie znika z Inboxu, pojawia się w Macierzy
```

### 6.2 Bulk Classification (Future)

- Możliwość zaznaczenia wielu zadań
- Jedno przejście Quizu dla wszystkich
- Wspólna ćwiartka/podkategoria

---

## 7. Decyzje UX (ADHD-Proof)

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Brak decyzji przy wprowadzaniu** | Redukcja oporu poznawczego |
| **Izolacja Q0** | Uniknięcie clutteru w głównej Macierzy |
| **Seryjny zrzut** | dopamina z szybkiego dodawania |
| **Key-based remount** | Czysty stan, brak confusion |
| **Swipe to delete** | Szybkie usuwanie bez potwierdzenia |

---

## 8. Kryteria Akceptacji

- [x] Zadania Q0 nie pojawiają się w Macierzy Q1-Q4
- [x] Inbox ma dedykowany widok z textarea
- [x] Quiz resetuje stan przy każdym otwarciu (remount)
- [x] Po kwalifikacji zadanie znika z Inboxu
- [x] Obsługa seryjnego dodawania (pozostanie w Inboxie)
- [x] Autosave draftu w localStorage
