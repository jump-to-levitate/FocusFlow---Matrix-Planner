# 01 Potok Inbox Capture (Q0 State) & Brain Dump

> Wersja: 2.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Nazwa Funkcji

**Potok Inbox Capture (Q0 State) & Brain Dump**

---

## 2. Opis Funkcjonalny

Funkcjonalność **seryjnego zrzucania myśli bez barier decyzyjnych**. Umożliwia użytkownikom błyskawiczne "opróżnienie głowy" bez konieczności natychmiastowej kategoryzacji zadań. Licznik Q0 na pulpicie informuje o oczekujących pozycjach do kwalifikacji.

---

## 3. Architektura Q0 (Izolacja Stanu)

### 3.1 Model Danych

```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 0 | 1 | 2 | 3 | 4;  // Q0 = Inbox (niezakwalifikowane)
  subcategory?: string | null;     // null dla Q0
  completed: boolean;
  createdAt: Date;
}
```

### 3.2 Izolacja Wizualna

- Zadania z `quadrant: 0` **nie pojawiają się** w głównej Macierzy (Q1-Q4)
- Q0 ma dedykowany widok "Inbox" - osobna zakładka nawigacji
- Licznik Q0 na pulpicie: badge z liczbą niezakwalifikowanych zadań
- Po zakwalifikowaniu (Quiz), zadanie zmienia `quadrant` na 1-4

### 3.3 Filtrowanie w JS

```typescript
// Macierz Q1-Q4: wyklucza Q0
const matrixTasks = safeTasks.filter(t => !t.completed && t.quadrant !== 0);

// Inbox (Q0): tylko niezakwalifikowane
const inboxTasks = safeTasks.filter(t => !t.completed && t.quadrant === 0);

// Licznik na pulpicie
const q0Count = tasks.filter(t => t.quadrant === 0 && !t.completed).length;
```

---

## 4. UX Flow

### 4.1 Flow Seryjnego Zrzutu (Brain Dump)

1. **Wejście do Inboxu** → automatyczne focus na textarea
2. **Wpis myśli** → tekst bez struktury (np. "Zadzwonić do dentysty, kupić mleko, projekt X")
3. **Enter lub przycisk** → zapis do Q0 (brak kategoryzacji!)
4. **Pozostanie w Inboxie** → możliwość seryjnego dodawania kolejnych myśli
5. **Licznik Q0** → badge na pulpicie pokazuje liczbę "myśli w kolejce"

### 4.2 Wejście do Quizu z Pre-fill

```
Inbox (lista zadań Q0)
    ↓
Kliknięcie "Kwalifikuj" lub ikona edycji
    ↓
QuizModal z prefill tytułem zadania
    ↓
Quiz (3 pytania o ważność/pilność)
    ↓
Ekran potwierdzenia (ćwiartka, opcjonalnie podkategoria dla Q2)
    ↓
Zapis: update db.tasks set quadrant=X, subcategory=Y
    ↓
Zadanie znika z Inboxu, pojawia się w Macierzy
```

### 4.3 Rozwidlenie Zapisu (Dual-mode Transaction)

```typescript
const handleSubmit = async () => {
  // Mode 1: Reklasyfikacja istniejącego zadania
  if (onClassify && classifyTaskId !== undefined) {
    onClassify(classifyTaskId, predictedQuadrant);
    quiz.resetQuiz();
    onClose();
    return;
  }
  
  // Mode 2: Tworzenie nowego zadania
  const ok = await quiz.submitTask();
  if (ok) onClose();
};
```

---

## 5. Snapshot State Mechanism

### 5.1 Problem: Zamrożony Formularz (Stale State)

Gdy użytkownik otwiera Quiz dla zadania z Q0, komponent `QuizModal` musi:
1. Zresetować swój stan maszyny stanów
2. Wyczyścić poprzednie odpowiedzi (importance/urgency)
3. Rozpocząć od kroku 'title' z prefill tytułem zadania

### 5.2 Rozwiązanie: Key-based Remount

```tsx
// MatrixScreen.tsx - wymuszony re-mount przez dynamiczny klucz
<QuizModal 
  key={`quiz-${selectedTaskId}`}  // Wymusza unmount/remount
  isOpen={isQuizOpen}
  taskId={selectedTaskId}
  initialMode="classify"
/>
```

**Dlaczego to działa:**
- Zmiana `key` w React wymusza pełny unmount/remount komponentu
- Stany wewnętrzne hooka `useQuizForm` są resetowane do initial values
- Brak "zombie stanu" z poprzednich sesji quizu

### 5.3 Implementacja Hooka useQuizForm

```typescript
const useQuizForm = (options?: QuizOptions) => {
  // Reset przy każdym mount (nowym otwarciu Quizu)
  useEffect(() => {
    resetQuiz();
  }, []);
  
  const resetQuiz = () => {
    setCurrentStep('title');
    setTaskTitle('');
    setImportanceAnswers([null, null, null]);
    setUrgencyAnswers([null, null, null]);
    setSubcategory(null);
    setManualQuadrant(null);
  };
  
  // Pre-fill dla reklasyfikacji
  useEffect(() => {
    if (options?.taskId && options?.taskTitle) {
      setTaskTitle(options.taskTitle);
    }
  }, [options?.taskId]);
};
```

---

## 6. Interfejs Użytkownika

### 6.1 Inbox Screen Layout

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

### 6.2 Licznik Q0 na Pulpicie

```tsx
// Dashboard / Header
<div className="relative">
  <InboxIcon />
  {q0Count > 0 && (
    <span className="absolute -top-1 -right-1 bg-[#D000FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {q0Count}
    </span>
  )}
</div>
```

### 6.3 Stany Puste i Edge Cases

- **Brak zadań**: "Inbox jest pusty. Dodaj pierwszą myśl! 🧠"
- **Samooczyszczenie**: Po zakwalifikowaniu wszystkich zadań, przycisk "Kwalifikuj" jest disabled
- **Autosave draftu**: Zapisywany w localStorage przy zmianie textarea

---

## 7. Decyzje UX (ADHD-Proof)

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Brak decyzji przy wprowadzaniu** | Redukcja oporu poznawczego - "po prostu zrzuć" |
| **Licznik Q0 na pulpicie** | Visual reminder o oczekujących zadaniach |
| **Izolacja Q0** | Uniknięcie clutteru w głównej Macierzy (Q1-Q4) |
| **Seryjny zrzut** | Dopamina z szybkiego dodawania - "czysta głowa" |
| **Key-based remount** | Czysty stan, brak confusion przy ponownym otwarciu Quizu |
| **Dual-mode transaction** | Elastyczność - reklasyfikacja lub nowe zadanie |

---

## 8. Kryteria Akceptacji (AC)

### Format: GIVEN [kontekst] WHEN [akcja] THEN [oczekiwany rezultat]

**AC-1: Izolacja Q0 od Macierzy Głównej**
> GIVEN zadanie zapisane z `quadrant: 0` (Q0) w bazie Dexie WHEN system renderuje główną Macierz Q1-Q4 THEN zadanie Q0 nie pojawia się w żadnej z 4 ćwiartek macierzy (fizyczna izolacja wizualna).

**AC-2: Seryjny Brain Dump bez Barier Decyzyjnych**
> GIVEN użytkownik znajduje się na ekranie Inbox (Q0) WHEN wpisuje tekst myśli w textarea i naciska Enter lub przycisk "Dodaj" THEN zadanie zapisuje się do bazy z `quadrant: 0` bez konieczności odpowiadania na pytania kwalifikacyjne (Quiz) i użytkownik pozostaje w Inboxie gotowy do dodania kolejnej myśli.

**AC-3: Snapshot State przy Reklasyfikacji**
> GIVEN użytkownik klika "Kwalifikuj" dla istniejącego zadania z Inboxu WHEN QuizModal otwiera się w trybie reklasyfikacji THEN pole tytułu zadania jest automatycznie prefill'owane tekstem oryginalnego zadania (snapshot state) i maszyna stanów quizu startuje od kroku 'quiz' (pomijając 'title').

**AC-4: Key-Based Remount eliminujący Zombie State**
> GIVEN użytkownik otworzył i zamknął QuizModal dla zadania X WHEN otwiera QuizModal dla zadania Y (innego ID) THEN komponent wykonuje pełny unmount/remount (dzięki dynamicznemu `key={`quiz-${taskId}`}`), wszystkie stany wewnętrzne (odpowiedzi importance/urgency) są zresetowane i nie występuje "zombie state" z poprzedniej sesji.

**AC-5: Dual-Mode Transaction (Reklasyfikacja vs Nowe Zadanie)**
> GIVEN QuizModal otwarty w kontekście istniejącego zadania (classifyTaskId !== undefined) WHEN użytkownik zatwierdza quiz THEN system wywołuje `db.tasks.update(classifyTaskId, {quadrant, subcategory})` (rekalasyfikacja in-place) zamiast `db.tasks.add()` (tworzenie nowego).

**AC-6: Propagacja po Kwalifikacji**
> GIVEN zadanie z Inboxu (Q0) zostało zakwalifikowane przez Quiz do ćwiartki X WHEN operacja zapisu do Dexie zakończy się sukcesem THEN zadanie natychmiast znika z listy Inboxu (Q0) i pojawia się w odpowiedniej ćwiartce Macierzy głównej (Q1-Q4) z uwzględnieniem subkategorii (dla Q2/Q3/Q4).

---

## 9. Checklist Implementacyjna

- [x] Zadania Q0 nie pojawiają się w Macierzy Q1-Q4 (izolacja)
- [x] Inbox ma dedykowany widok z textarea i focus-on-mount
- [x] Quiz resetuje stan przy każdym otwarciu (key-based remount)
- [x] Snapshot State - prefill tytułu przy reklasyfikacji
- [x] Po kwalifikacji zadanie znika z Inboxu, pojawia się w Macierzy
- [x] Obsługa seryjnego dodawania (pozostanie w Inboxie po zapisie)
- [x] Licznik Q0 na pulpicie (badge z liczbą niezakwalifikowanych)
- [x] Dual-mode: reklasyfikacja in-place + tworzenie nowych zadań
- [x] Autosave draftu w localStorage
