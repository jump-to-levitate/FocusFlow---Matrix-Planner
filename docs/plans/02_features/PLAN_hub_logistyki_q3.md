# Hub Logistyki Q3

## 1. Cel

**Tactical Support System** dla zadań delegowalnych (Q3). Przekształca Q3 z "worka na niechciane zadania" w uporządkowany system operacyjny z 3 kontekstami wykonawczymi (Zrób teraz, Zaplanuj blok, W przerwie), eliminując paraliż decyzyjny przy wypychaniu zadań na zewnątrz.

## 2. Zakres

**Wchodzi w zakres:**
- System 3 kontekstów wykonania dla Q3
- Pole executionContext w schemacie Dexie
- Sub-panel Hub Logistyki z widokiem 3-sekcyjnym
- Bypass quizu dla Q3
- Grupowanie zadań po executionContext

**Nie wchodzi w zakres:**
- Automatyczne delegowanie przez API
- Automatyzacje za pomocą skryptów
- Integracja z kalendarzem zewnętrznym

## 3. Wymagania funkcjonalne

- Zadania Q3 mogą być klasyfikowane w 3 kontekstach: zrob_teraz, zaplanuj_blok, w_przerwie
- Użytkownik może dodać zadanie bezpośrednio z widoku Q3 (bypass quizu)
- Sub-panel wyświetla zadania pogrupowane według kontekstu wykonania
- Quick wins (<10min) dla dopaminy bez konieczności planowania

## 4. Wymagania niefunkcjonalne

- **Wydajność:** Grupowanie zadań w czasie rzeczywistym (useLiveQuery), bez lagów
- **Bezpieczeństwo:** Dane lokalne, brak synchronizacji z serwerem
- **UX:** Pionowa lista dla szybkiego przeglądu, brak przewijania w poziomie

## 5. Kontekst techniczny

### Komponenty
- `MatrixScreen.tsx` - widok główny z sub-panelem Q3
- `QuizModal.tsx` - modal z wyborem executionContext dla Q3
- `useQuizForm.ts` - hook obsługujący bypass i executionContext

### API (Dexie.js)
```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 3;
  subcategory?: 'rutyna' | 'projekt' | 'ogolny_cel' | 'inne' | null;
  executionContext?: 'zrob_teraz' | 'zaplanuj_blok' | 'w_przerwie' | null;
  completed: boolean;
  createdAt: Date;
}
```

### Dane (grupowanie)
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

## 6. Kroki implementacji

1. Rozszerzenie schematu Task o pole executionContext dla Q3
2. Dodanie kroku executionContext w maszynie stanów Quizu dla Q3
3. Implementacja widoku sub-panelu Q3 z 3 sekcjami
4. Dodanie bypass dla Q3
5. Implementacja grupowania reaktywnego przez useLiveQuery
6. Integracja z Time Boxing dla "Zaplanuj blok"

## 7. Kryteria akceptacji

**AC-1: Quiz Bypass dla Q3**
> GIVEN użytkownik znajduje się w sub-widoku Huba Logistyki WHEN klika przycisk "+ Dodaj" THEN system pomija slajdy quizu testowego i przechodzi bezpośrednio do wyboru executionContext z parametrem initialQuadrant: 3.

**AC-2: Race Condition Fix**
> GIVEN użytkownik wybiera executionContext w quizie WHEN system zapisuje zadanie THEN wybrana wartość jest przekazywana bezpośrednio jako argument do submitTaskWithSubcategory, eliminując asynchroniczny wyścig stanów Reacta.

**AC-3: Sub-panel Hub Logistyki**
> GIVEN użytkownik przegląda Macierz Eisenhowera WHEN klika przycisk "Hub Logistyki ↗" w ćwiartce Q3 THEN wyświetla się sub-panel z widokiem 3-sekcyjnym (Zrób teraz, Zaplanuj blok, W przerwie) z cyberpunkową kolorystyką pomarańcz/cyjan.

## 8. Testy

### Unit
- Test grupowania zadań Q3 według executionContext
- Test maszyny stanów quizu (bypass dla Q3)
- Test normalizacji executionContext (domyślna wartość)

### Integracyjne
- **Test E2E Hub Logistyki:** Dodanie zadania do każdego kontekstu, weryfikacja grupowania
- **Test Bypass Flow Q3:** Kliknięcie "+" w Q3, pominięcie quizu, wybór executionContext, zapis
- **Test Quick Win:** Zadanie <10min w sekcji Zrób teraz, natychmiastowe oznaczenie jako done
