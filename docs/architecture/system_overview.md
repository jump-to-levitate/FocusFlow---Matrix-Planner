# System Overview - FocusFlow 2.0

> Single Source of Truth dla architektury systemu

# 📘 FocusFlow 2.0 – System Overview

## 1. Wizja Produktu

FocusFlow 2.0 to inteligentny system zarządzania zadaniami oparty na **Macierzy Eisenhowera**, zaprojektowany w paradygmacie **Mobile-First**. Aplikacja ma na celu eliminację paraliżu decyzyjnego poprzez automatyczne klasyfikowanie zadań (Quiz), ochronę przed przeciążeniem (limit Q1) oraz zintegrowany system skupienia (Timer).

## 2. Architektura Funkcjonalna (Wybrane Ekrany)

### A. Dashboard i Widok Dnia

- **Pulpit (Str. 15):** Centralny punkt kontrolny. Wyświetla aktualny cel (Q1), sekcję „Kolejne w kolejce” oraz szybki dostęp do raportów i notatki Brain Dump .

- **Wszystko na dzisiaj (Str. 5):** Linearny widok planu dnia podzielony na priorytety (Pilne i Ważne vs. Proza Życia) oraz pozostałe aktywności (Nawyki, Projekty) .

### B. Inteligentna Macierz i Zarządzanie Zadaniami

- **Macierz Eisenhowera (Str. 16):** Interaktywny widok 2x2. Pozwala na szybki podgląd liczby zadań w każdej ćwiartce i nawigację do szczegółowych centrów planowania .

- **Pop-up Opcji (Str. 17):** Menu kontekstowe zadania umożliwiające: edycję, przenoszenie, dodanie notatki, usunięcie lub natychmiastowe uruchomienie sesji Focus .

- **Limit Przeciążenia (Str. 19):** Systemowa blokada uniemożliwiająca dodanie więcej niż **5 zadań** do I ćwiartki (Pilne i Ważne). Wymusza priorytetyzację lub oddelegowanie zadań do Brain Dump .

### C. System Wprowadzania i Klasyfikacji (Smart Quiz)

- **Brain Dump Quiz (Str. 18):** Proces dodawania zadania przez odpowiedź na dwa pytania: „Czy przybliża Cię to do celu?” (Ważność) oraz „Czy masz twardy termin?” (Pilność) .

- **Strategia dla **III** Ćwiartki (Str. 8, 23):** Zadania trafiające do „Prozy Życia” są klasyfikowane według strategii wykonania: „Zrób teraz” (<10 min), „W przerwie” lub „Zaplanuj blok” .

- **Strategia dla IV Ćwiartki (Str. 9, 24):** Zadania niepilne i nieważne są dzielone na subkategorie: Optymalizacja, Side-quest, Hobby lub Rozrywka .

- **Info Pop-ups (Str. 29-31):** Edukacyjne nakładki wyjaśniające użytkownikowi, jak skutecznie zarządzać zadaniami z **III** ćwiartki (delegowanie, automatyzacja, sprinty logistyczne) .

### D. Focus i Notatki

- **Timer Focus (Str. 6):** Zintegrowany licznik sesji pracy (np. 25/5 lub 50/10) z licznikiem serii dni skupienia i możliwością dodawania notatek w trakcie sesji .

- **Notatki Brain Dump (Str. 7):** Magazyn nieposortowanych myśli i „wrzutek”, które nie stały się jeszcze zadaniami .

## 3. Kluczowe Zasady Techniczne (Constraints)

- **Mobile-First Design:** Interfejs zablokowany na szerokości **480px**, zoptymalizowany pod kątem obsługi kciukiem (dolne menu nawigacyjne).
- **Estetyka:** Neon Glassmorphism (ciemne tło, świecące obramowania kwadrantów, wysoki kontrast).

- **Single Source of Truth:** Każda zmiana w kodzie musi być poprzedzona planem w `/docs/plans/`.

---

## Model Danych - Technical implementation details

### Główna encja: Task

```typescript
interface Task {
  id: string;              // UUID v4
  title: string;           // Max 100 chars
  description?: string;    // Opcjonalne
  quadrant: 1 | 2 | 3 | 4; // Q1-Q4
  subcategory?: Subcategory; // Tylko Q2, Q3, Q4
  completed: boolean;      // Default: false
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;          // Opcjonalne
  priority: 1 | 2 | 3;     // 1=high, 2=medium, 3=low
}

type Subcategory =
  // Q2 (Strona 10, 22): Strefa wzrostu
  | 'routine' | 'project' | 'other' // [cite: 233-235]
  
  // Q3 (Strona 8, 23): Strategie "Prozy Życia" 
  | 'do_now'       // Zrób teraz (<10 min) [cite: 212, 574]
  | 'planned_block' // Zaplanuj blok [cite: 214, 581]
  | 'on_break'     // W przerwie [cite: 216, 577]
  
  // Q4 (Strona 9, 24): Kategorie "Nie teraz"
  | 'entertainment' | 'side_quest' | 'hobby' | 'optimization'; // [cite: 224-227, 591-601]
```

### Encja: Note

```typescript
interface Note {
  id: string;          // UUID v4
  content: string;     // Rich text / markdown
  taskId?: string;     // FK do Task (opcjonalne)
  createdAt: Date;
  updatedAt: Date;
}
```

### Encja: QuizResult

```typescript
interface QuizResult {
  id: string;
  answers: Answer[];   // Historia odpowiedzi
  dominantQuadrant: 1 | 2 | 3 | 4;
  createdAt: Date;
}

interface Answer {
  questionId: string;
  choiceId: string;
  timestamp: Date;
}
```

---

## Relacje

```
Task 1--* Note (opcjonalna, linked notes)
Task *--1 Quadrant (enum constraint)
Quadrant 1--* Subcategory (Q2/Q3/Q4 only)
```

---

## IndexedDB Schema (Dexie.js)

```typescript
// db/schema.ts
const db = new Dexie('FocusFlowDB');

db.version(1).stores({
  tasks: '++id, quadrant, subcategory, completed, createdAt',
  notes: '++id, taskId, createdAt',
  quizResults: '++id, dominantQuadrant, createdAt'
});
```

### Indeksy:

| Tabela | Indeks | Cel |
|--------|--------|-----|
| tasks | `quadrant` | Filtrowanie macierzy |
| tasks | `subcategory` | Filtrowanie kategorii |
| tasks | `completed` | Filtrowanie statusu |
| notes | `taskId` | Join z taskami |

---

## Warstwy Architektury

```
┌─────────────────────────────────────┐
│  UI Layer (React Components)         │
├─────────────────────────────────────┤
│  Feature Layer (Matrix, Quiz, etc.)  │
├─────────────────────────────────────┤
│  Data Layer (Dexie.js + Hooks)      │
├─────────────────────────────────────┤
│  Storage (IndexedDB)                │
└─────────────────────────────────────┘
```

---

## Constraints & Walidacja

### Task:

- `title`: required, min 1, max 100 chars
- `quadrant`: required, enum 1-4
- `subcategory`: opcjonalne, ale jeśli podane - musi pasować do quadrant
- Q1 Capacity Limit: Ćwiartka I (Pilne i Ważne) posiada twardy limit 5 aktywnych zadań. Próba dodania szóstego zadania musi wyzwolić walidację "Przeciążenie Systemu"
  
---

### Walidacja subcategory:

```typescript
const SUBCATEGORIES_BY_QUADRANT = {
  1: [], // Q1 has no subcategories
  2: ['health', 'growth', 'relationships', 'finance', 'career'],
  3: ['admin', 'breaks'],
  4: ['entertainment', 'distractions']
} as const;
```

