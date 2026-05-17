# Technical Specification: Database Schema (Dexie.js)

> Wersja: 1.0  
> Data: Maj 2026  
> Status: ✅ Wdrożone

---

## 1. Wybór Technologii

### 1.1 Dexie.js + IndexedDB

**Dlaczego nie SQLite/PostgreSQL/MySQL?**
- **Offline-first** - aplikacja działa bez internetu
- **Brak backendu** - redukcja złożoności i kosztów
- **Brak kont użytkowników** - eliminacja bariery wejścia
- **Instant load** - dane lokalne, brak latency

### 1.2 Dexie.js Wrapper

```typescript
import Dexie, { type Table } from 'dexie';

class FocusFlowDB extends Dexie {
  tasks!: Table<Task, number>;
  notes!: Table<Note, number>;
  // ... inne tabele

  constructor() {
    super('FocusFlowDB');
    this.version(1).stores({
      tasks: '++id, title, quadrant, subcategory, completed, createdAt',
      notes: '++id, content, taskId, createdAt, updatedAt',
    });
  }
}

export const db = new FocusFlowDB();
```

---

## 2. Schemat Bazy Danych

### 2.1 Tabela: tasks

```typescript
interface Task {
  id?: number;                    // Auto-increment primary key
  title: string;                  // Tytuł zadania (wymagane)
  quadrant: 0 | 1 | 2 | 3 | 4;    // Ćwiartka Eisenhowera
  subcategory?: string | null;    // Podkategoria (opcjonalna)
  completed: boolean;             // Status ukończenia
  createdAt: Date;               // Timestamp utworzenia
}
```

#### 2.1.1 Typowanie Pola `subcategory`

**Historia zmian:**
```typescript
// Wersja 1.0 (initial)
subcategory?: string;            // undefined lub string

// Wersja 1.1 (fix)
subcategory?: string | null;     // undefined, string, lub null
```

**Uzasadnienie union type:**
- Dexie zwraca `null` dla pustych pól (nie `undefined`)
- TypeScript wymaga explicite obsługi `null`
- Zapobiega runtime errors przy filtrowaniu

#### 2.1.2 Indeksowanie

```typescript
this.version(1).stores({
  tasks: '++id, title, quadrant, subcategory, completed, createdAt',
});
```

**Klucze indeksowe:**
- `++id` - auto-increment primary key
- `quadrant` - filtrowanie po ćwiartkach
- `subcategory` - filtrowanie w Centrum Planowania
- `completed` - filtrowanie aktywnych/zakończonych
- `createdAt` - sortowanie chronologiczne

### 2.2 Tabela: notes

```typescript
interface Note {
  id?: number;
  content: string;               // Treść notatki (markdown/rich text)
  taskId?: number | null;         // FK do tasks (opcjonalna relacja)
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 3. Operacje CRUD

### 3.1 Create (Dodawanie Zadania)

```typescript
// Po kwalifikacji w Quizie
const newTask: Task = {
  title: 'Napisać dokumentację',
  quadrant: 2,                    // Q2 - Ważne, Niepilne
  subcategory: 'projekt',         // Subkategoria
  completed: false,
  createdAt: new Date(),
};

const id = await db.tasks.add(newTask);
```

### 3.2 Read (Live Queries)

```typescript
import { useLiveQuery } from 'dexie-react-hooks';

// Wszystkie aktywne zadania (bez Q0)
const tasks = useLiveQuery(
  () => db.tasks
    .where('completed').equals(0)
    .and(t => t.quadrant !== 0)
    .toArray(),
  []
);

// Zadania Q2 dla Centrum Planowania
const q2Tasks = useLiveQuery(
  () => db.tasks
    .where({ quadrant: 2, completed: false })
    .toArray(),
  []
);
```

### 3.3 Update (Ukończenie Zadania)

```typescript
// Typowy case - ukończenie zadania w Timerze
await db.tasks.update(taskId, { 
  completed: true 
});

// Update z walidacją ID
const handleCompleteTask = async (id: number | undefined) => {
  if (!id) return;
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  await db.tasks.update(numericId, { completed: true });
};
```

### 3.4 Delete (Usuwanie)

```typescript
await db.tasks.delete(taskId);
```

---

## 4. Filtrowanie i Grupowanie

### 4.1 Izolacja Q0 (Inbox)

```typescript
// Inbox (Q0) - zadania niezakwalifikowane
const inboxTasks = tasks.filter(t => 
  t.quadrant === 0 && !t.completed
);

// Macierz (Q1-Q4) - wyklucz Q0
const matrixTasks = tasks.filter(t => 
  t.quadrant !== 0 && !t.completed
);
```

### 4.2 Grupowanie po Subkategorii (Centrum Planowania)

```typescript
const groupQ2BySubcategory = (tasks: Task[]) => {
  const groups: Record<string, Task[]> = {
    rutyna: [],
    projekt: [],
    ogolny_cel: [],
    inne: [],
  };
  
  tasks.forEach(task => {
    const sub = task.subcategory;
    // Null/undefined/empty → 'inne'
    const normalizedSub = !sub || sub === '' ? 'inne' : sub;
    
    if (groups[normalizedSub]) {
      groups[normalizedSub].push(task);
    } else {
      groups.inne.push(task);
    }
  });
  
  return groups;
};
```

---

## 5. Brak Konieczności Migracji

### 5.1 Ewolucja Schema bez Breaking Changes

**Zasada:** IndexedDB jest schema-less. Dodanie nowego pola nie wymaga migracji.

**Przykład - Dodanie `subcategory`:**

```typescript
// Stare zadania (bez subcategory)
{ id: 1, title: "Zadanie", quadrant: 2, completed: false }

// Nowe zadania (z subcategory)
{ id: 2, title: "Zadanie", quadrant: 2, subcategory: "projekt", completed: false }

// Oba działają poprawnie - subcategory jest optional
```

### 5.2 Obsługa Starych Danych

```typescript
// W komponentach - defensywne programowanie
const subcategory = task.subcategory || 'inne';

// W filtrowaniu - normalizacja
const normalizedSub = task.subcategory ?? 'inne';
```

### 5.3 Versjonowanie (Przyszłość)

Jeśli konieczna będzie zmiana struktury:

```typescript
// Upgrade schema z migracją danych
this.version(2).stores({
  tasks: '++id, title, quadrant, subcategory, completed, createdAt, priority',
}).upgrade(tx => {
  return tx.table('tasks').toCollection().modify(task => {
    // Migracja: dodanie default priority
    task.priority = task.priority ?? 1;
  });
});
```

---

## 6. Bezpieczeństwo i Walidacja

### 6.1 Walidacja ID (Type Safety)

```typescript
// Problem: Dexie ID może być number lub undefined
// Rozwiązanie: Casting i walidacja

const completeTask = async (rawId: number | string | undefined) => {
  if (!rawId) {
    console.warn('[Matrix] No task ID provided');
    return;
  }
  
  // Normalizacja do number
  const id = typeof rawId === 'string' 
    ? parseInt(rawId, 10) 
    : rawId;
    
  if (isNaN(id)) {
    console.error('[Matrix] Invalid task ID:', rawId);
    return;
  }
  
  await db.tasks.update(id, { completed: true });
};
```

### 6.2 Error Handling

```typescript
const safeQuery = async () => {
  try {
    return await db.tasks.toArray();
  } catch (err) {
    console.error('[Dexie] Query failed:', err);
    return []; // Fallback
  }
};
```

---

## 7. Optymalizacja Wydajności

### 7.1 Live Queries

```typescript
// Efektywne - re-render tylko przy zmianie danych
const tasks = useLiveQuery(() => db.tasks.toArray(), []);

// Niejefektywne - polling
const [tasks, setTasks] = useState([]);
useEffect(() => {
  const interval = setInterval(() => {
    db.tasks.toArray().then(setTasks);
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

### 7.2 Indeksowanie Złożonych Zapytań

```typescript
// Dla częstych zapytań - złożony indeks
this.version(2).stores({
  tasks: '++id, [quadrant+completed], subcategory, createdAt',
});

// Efektywne zapytanie złożone
const activeQ2 = await db.tasks
  .where({ quadrant: 2, completed: 0 })
  .toArray();
```

---

## 8. Kryteria Akceptacji Technicznej

- [x] Dexie.js jako wrapper IndexedDB
- [x] Auto-increment ID (`++id`)
- [x] Pola: title, quadrant, subcategory, completed, createdAt
- [x] Typowanie `subcategory?: string | null`
- [x] Indeksowanie po quadrant, subcategory, completed
- [x] Live queries via `dexie-react-hooks`
- [x] Brak konieczności migracji dla nowych pól (optional)
- [x] Walidacja ID (number vs string vs undefined)
- [x] Error handling z fallback do pustej tablicy
- [x] Obsługa schema-less (stare dane bez nowych pól)

---

## 9. Decyzje Architektoniczne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Dexie.js** | Typowanie TypeScript, proste API |
| **IndexedDB** | Native browser, duży limit (~60MB) |
| **Schema-less** | Ewolucja bez migracji |
| **Live Queries** | Reaktywność bez boilerplate |
| **Union type subcategory** | Obsługa null z Dexie |
