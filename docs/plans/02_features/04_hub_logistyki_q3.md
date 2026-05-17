# 04 Hub Logistyki – Zarządzanie Prozą Życia (Kwadrant 3)

> Wersja: 1.0  
> Data: Maj 2026  
> Status: 📋 Planowane (Upcoming)

---

## 1. Nazwa Funkcji

**Hub Logistyki – Zarządzanie Prozą Życia (Q3 Sub-Matrix)**

---

## 2. Opis Funkcjonalny

**Kwadrant 3 (Pilne, Nieważne)** - zadania logistyczne, przerwy, prace administracyjne, które są pilne ale nie przyczyniają się bezpośrednio do celów. System poprosi o kontekst wykonania na podstawie **czasu i energii** użytkownika, optymalizując egzekucję.

---

## 3. Kontekst Wykonania (Execution Context)

### 3.1 Wybór w Quizie / Macierzy

Po przydzieleniu zadania do Q3, system wyświetla modal wyboru kontekstu:

```
┌─────────────────────────────────────────┐
│     Gdzie i jak wykonać? 🤔            │
├─────────────────────────────────────────┤
│                                         │
│  [⚡ ZRÓB TERAZ]                        │
│  "Zajmie mniej niż 10min? Działaj!"   │
│  → Value: zrob_teraz                    │
│                                         │
│  [📅 ZAPLANUJ BLOK]                     │
│  "Zbierz drobiazgi w jeden sprint      │
│   logistyczny"                         │
│  → Value: zaplanuj_blok                 │
│                                         │
│  [☕ W PRZERWIE]                        │
│  "Użyj tego jako mechanicznego         │
│   resetu dla mózgu"                     │
│  → Value: w_przerwie                    │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Opcje Kontekstu

| Opcja | Wartość | Opis | Kiedy używać |
|-------|---------|------|--------------|
| **Zrób teraz** | `zrob_teraz` | Szybkie zadania <10min, które można odhaczyć natychmiast | Kiedy masz 5-10 minut przerwy między spotkaniami |
| **Zaplanuj blok** | `zaplanuj_blok` | Grupowanie drobnych zadań Q3 w jeden czasowy blok | Prace administracyjne, maile, dokumentacja |
| **W przerwie** | `w_przerwie` | Zadania jako "reset mózgu" między głęboką pracą | Scrollowanie, drobne zakupy, spacer |

---

## 4. Model Danych

### 4.1 Rozszerzenie Schema

```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 1 | 2 | 3 | 4;
  subcategory?: 'rutyna' | 'projekt' | 'ogolny_cel' | 'inne' | null;
  
  // NOWE: Kontekst wykonania dla Q3
  executionContext?: 'zrob_teraz' | 'zaplanuj_blok' | 'w_przerwie' | null;
  
  completed: boolean;
  createdAt: Date;
}
```

### 4.2 Normalizacja

```typescript
// Zadania Q3 bez kontekstu domyślnie trafiają do "Zaplanuj blok"
const normalizedContext = task.executionContext ?? 'zaplanuj_blok';
```

---

## 5. Widok Hub Logistyki (Sub-panel Q3)

### 5.1 Układ

Widok zoptymalizowany pod **szybką egzekucję** - pionowa lista lub mikro-sprinty:

```
┌─────────────────────────────────────────────────────────┐
│  [← Powrót]   Hub Logistyki (Q3)    [+ Dodaj]          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ⚡ ZRÓB TERAZ (< 10 min)                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☑️ Zapłacić rachunek                    [Start] │   │
│  │ ☑️ Odpowiedzieć na krótkiego maila      [Start] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📅 ZAPLANOWANE BLOKI                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🕐 14:00 - Blok Administracyjny (30min)        │   │
│  │    • Wykazać delegację                         │   │
│  │    • Zaktualizować timesheet                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ☆ W PRZERWIE (Reset Mózgu)                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☑️ Przewertować LinkedIn             [5 min]   │   │
│  │ ☑️ Kupić kawę na spacerze            [10 min]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Logika Grupowania

```typescript
const groupQ3ByContext = (tasks: Task[]) => {
  return {
    zrob_teraz: tasks.filter(t => t.executionContext === 'zrob_teraz'),
    zaplanuj_blok: tasks.filter(t => t.executionContext === 'zaplanuj_blok'),
    w_przerwie: tasks.filter(t => t.executionContext === 'w_przerwie'),
    nieprzypisane: tasks.filter(t => !t.executionContext),
  };
};
```

---

## 6. Flow Użytkownika

### 6.1 Dodawanie Zadania Q3

```
Quiz / Macierz
    ↓
Przypisanie do Q3 (Pilne, Nieważne)
    ↓
Modal kontekstu wykonania:
  • Zrób teraz (quick win)
  • Zaplanuj blok (batch processing)
  • W przerwie (brain reset)
    ↓
Zapis do Dexie z executionContext
    ↓
Wyświetlenie w odpowiedniej sekcji Hubu Logistyki
```

### 6.2 Egzekucja

1. **Zrób teraz** → Szybkie ukończenie, bez timeru (checkbox)
2. **Zaplanuj blok** → Timer w trybie "Time Boxing", grupowe ukończenie
3. **W przerwie** → Nie śledzone formalnie, przypomnienie kontekstowe

---

## 7. Decyzje UX (ADHD-Proof)

| Decyzja | Uzasadnienie |
|---------|--------------|
| **3 konteksty wykonania** | Eliminacja paraliżu "kiedy to zrobić" |
| **Zrób teraz <10min** | Quick wins dla dopaminy |
| **Batch processing (bloki)** | Efektywność kontekstowa - podobne zadania razem |
| **Reset mózgu** | Akceptacja "bezproduktywnych" przerów jako potrzeba |
| **Pionowa lista** | Szybki przegląd, brak przewijania w poziomie |

---

## 8. Kryteria Akceptacji (Do implementacji)

- [ ] Pole `executionContext` w schemacie Dexie
- [ ] Modal wyboru kontekstu przy tworzeniu/edycji Q3
- [ ] Sub-panel "Hub Logistyki" z widokiem 3-sekcyjnym
- [ ] Grupowanie zadań Q3 po executionContext
- [ ] Szybkie ukończenie dla "Zrób teraz" (bez timeru)
- [ ] Integracja z Time Boxing dla "Zaplanuj blok"
- [ ] Liczniki zadań w każdej sekcji

---

## 9. Powiązane Dokumenty

- `03_centrum_planowania_q2.md` - Analogiczna struktura sub-panelu
- `docs/plans/03_technical/04_design_system_tokens.md` - Design System
- `adr_002_q0_isolation.md` - Zasady izolacji ćwiartek
