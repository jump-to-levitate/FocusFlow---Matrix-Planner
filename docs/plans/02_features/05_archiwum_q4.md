# 05 Archiwum – Szuflada "Nie teraz" (Kwadrant 4)

> Wersja: 1.0  
> Data: Maj 2026  
> Status: 📋 Planowane (Upcoming)

---

## 1. Nazwa Funkcji

**Archiwum – Szuflada "Nie teraz" (Q4 Sub-Matrix)**

---

## 2. Opis Funkcjonalny

**Kwadrant 4 (Niepilne, Nieważne)** - zadania, które nie są ani pilne, ani ważne dla głównych celów. Miejsce dla "time wasters", ale też hobbystycznych side-questów, które warto zachować bez zaśmiecania głównego widoku.

**Filozofia:** Nie wszystko co "nieważne" musi być wyrzucone - niektóre rzeczy są po prostu "nie teraz".

---

## 3. Kategorie w Q4

### 3.1 Podkategorie (Subkategorie Q4)

| Podkategoria | Wartość | Opis | Przykłady |
|--------------|---------|------|-----------|
| **Rozrywka** | `rozrywka` | Czysta rozrywka, streaming, gry | Netflix, gry, social media scroll |
| **Hobby** | `hobby` | Pasje niezwiązane z celami | Modelarstwo, fotografia, kolekcje |
| **Side-questy** | `side_questy` | Ciekawe pomysły na "kiedyś" | Projekty poboczne, eksperymenty |
| **Optymalizacja** | `optymalizacja` | Prace nad systemem > pracą w systemie | "Zoptymalizować workflow", "Przeczytać Getting Real" |

### 3.2 Opcja Specjalna: Odrzuć/Zapomnij

```
┌─────────────────────────────────────────────────┐
│  Czy to naprawdę warto robić? 🤔               │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Rozrywka]  [Hobby]  [Side-questy]           │
│  [Optymalizacja]                               │
│                                                 │
│  ─── LUB ───                                   │
│                                                 │
│  [🗑️ ODRZUĆ / ZAPOMNIJ]                       │
│  Całkowicie usuń zadanie (brak archiwizacji)  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Odrzuć/Zapomnij:**
- Nie przypisuje żadnej podkategorii
- Oznacza zadanie jako `deleted: true` lub fizycznie usuwa z Dexie
- Nie pojawia się w żadnym widoku (nawet Archiwum)
- **Intencja:** "To był zły pomysł, nie chcę tego nawet widzieć"

---

## 4. Model Danych

### 4.1 Rozszerzenie Schema

```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 1 | 2 | 3 | 4;
  subcategory?: 'rutyna' | 'projekt' | 'ogolny_cel' | 'inne' | null;  // Dla Q2
  
  // NOWE: Podkategorie dla Q4
  q4Category?: 'rozrywka' | 'hobby' | 'side_questy' | 'optymalizacja' | null;
  
  // NOWE: Opcja odrzucenia (soft delete)
  deleted?: boolean;  // Domyślnie false
  deletedAt?: Date;   // Timestamp odrzucenia
  
  completed: boolean;
  createdAt: Date;
}
```

### 4.2 Filtrowanie Archiwum

```typescript
// Archiwum Q4 - tylko nieodrzucone, nieukończone
const archiveTasks = tasks.filter(t => 
  t.quadrant === 4 && 
  !t.completed && 
  !t.deleted  // ❌ Wyklucz odrzucone
);

// Odrzucone (do permanentnego wyczyszczenia)
const deletedTasks = tasks.filter(t => t.deleted === true);
```

---

## 5. Widok Archiwum (Sub-panel Q4)

### 5.1 Układ

```
┌─────────────────────────────────────────────────────────┐
│  [← Powrót]   Archiwum "Nie teraz" (Q4)  [+ Dodaj]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎮 ROZRYWKA (Time Wasters)                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • Obejrzeć nowy serial Netflixa        [Odtwórz]│   │
│  │ • Przejść next level w grze          [Odtwórz]│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🎯 HOBBY (Pasje bez presji)                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • Poskładać model samolotu                      │   │
│  │ • Wyjechać na weekend fotograficzny             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  💡 SIDE-QUESTY (Pomysły na "kiedyś")                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • Nauczyć się Rusta "dla sportu"                │   │
│  │ • Zrobić stronę dla lokalnego schroniska        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ⚙️ OPTYMALIZACJA (Meta-prace)                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ • Przeczytać "Getting Real" Basecamp            │   │
│  │ • Przetestować nową aplikację do notatek        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Logika Grupowania

```typescript
const groupQ4ByCategory = (tasks: Task[]) => {
  const groups: Record<string, Task[]> = {
    rozrywka: [],
    hobby: [],
    side_questy: [],
    optymalizacja: [],
    nieprzypisane: [],
  };
  
  tasks.forEach(task => {
    const cat = task.q4Category || 'nieprzypisane';
    groups[cat].push(task);
  });
  
  return groups;
};
```

---

## 6. Flow Użytkownika

### 6.1 Dodawanie Zadania Q4

```
Quiz / Macierz
    ↓
Przypisanie do Q4 (Niepilne, Nieważne)
    ↓
Wybór kategorii (lub Odrzuć):
  • Rozrywka 🎮
  • Hobby 🎯  
  • Side-questy 💡
  • Optymalizacja ⚙️
  • 🗑️ ODRZUĆ (brak kategorii, soft delete)
    ↓
Zapis do Dexie z q4Category lub deleted=true
    ↓
Wyświetlenie w Archiwum (lub ukrycie jeśli odrzucone)
```

### 6.2 Akcje w Archiwum

| Akcja | Opis |
|-------|------|
| **Przenieś do Q2** | "Jednak ważne" - awansuj do Centrum Planowania |
| **Przenieś do Q3** | "Jednak pilne" - awansuj do Hubu Logistyki |
| **Odtwórz** (Rozrywka) | Szybkie ukończenie bez śledzenia czasu |
| **Odrzuć** | Przenieś do kosza (soft delete) |
| **Edytuj kategorię** | Zmiana pudełka w Archiwum |

---

## 7. Decyzje UX (ADHD-Proof)

| Decyzja | Uzasadnienie |
|---------|--------------|
| **4 kategorie + Odrzuć** | Jasna taksonomia "time wasters" |
| **Side-questy** | Akceptacja, że nie wszystko musi być "produktywne" |
| **Optymalizacja jako Q4** | Meta-prace często są prokrastynacją w przebraniu |
| **Soft delete (Odrzuć)** | Możliwość cofnięcia + psychologiczne "pozwolenie na zapomnienie" |
| **Brak timera dla Q4** | Rozrywka/hobby nie powinny być "śledzone" |
| **Możliwość awansu (Q2/Q3)** | Zadania mogą zmienić wagę w czasie |

---

## 8. Kryteria Akceptacji (Do implementacji)

- [ ] Pole `q4Category` w schemacie Dexie
- [ ] Pola `deleted` i `deletedAt` dla soft delete
- [ ] Modal wyboru kategorii Q4 z opcją "Odrzuć"
- [ ] Sub-panel "Archiwum" z widokiem 4-kolumnowym
- [ ] Grupowanie zadań Q4 po q4Category
- [ ] Przyciski awansu do Q2 i Q3
- [ ] Opcja szybkiego ukończenia (bez timeru) dla Rozrywki
- [ ] Kosz (widok odrzuconych) z możliwością przywrócenia

---

## 9. Powiązane Dokumenty

- `04_hub_logistyki_q3.md` - Analogiczna struktura sub-panelu
- `docs/plans/03_technical/04_design_system_tokens.md` - Design System (kolory szarości dla Q4)
- `adr_002_q0_isolation.md` - Zasady izolacji ćwiartek
