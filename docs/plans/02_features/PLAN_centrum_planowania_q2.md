# Centrum Planowania Q2 (2×2 Sub-Matrix)

## 1. Cel

**Deep Context System** dla zadań planistycznych (Q2). Zamiast "czarnej dziury" gdzie zadania znikają, użytkownik klasyfikuje je w 4 kontekstach wykonawczych, eliminując paraliż decyzyjny poprzez wizualną segregację.jnego głównej Macierzy.

---

## 2. Zakres

**Wchodzi w zakres:**
- Sub-matryca 2×2 dla Q2 z 4 kategoriami
- System subkategorii w Dexie.js
- Bypass quizu dla Q2 (initialQuadrant=2)
- Neonowe palety fiolet (#D000FF) i zielony (#00FF66)

**Nie wchodzi w zakres:**
- Edycja istniejących zadań (tylko klasyfikacja przy dodawaniu)
- Archiwowanie ukończonych zadań (osobny moduł)

## 3. Wymagania funkcjonalne

- Zadania Q2 mogą być klasyfikowane w 4 subkategoriach: rutyny, projekt, ogolny_cel, inne
- Użytkownik może dodać zadanie bezpośrednio z widoku Q2 (bypass quizu)
- Sub-matryca wyświetla zadania pogrupowane według subkategorii
- Po ukończeniu zadania znika ono automatycznie z sub-matrycy

## 4. Wymagania niefunkcjonalne

- **Wydajność:** Grupowanie zadań w czasie rzeczywistym (useLiveQuery), bez lagów
- **Bezpieczeństwo:** Dane lokalne, brak synchronizacji z serwerem
- **UX:** Symetria osiowa 2×2 (sztywne h-14 dla nagłówków), bypass redukujący friction

## 5. Kontekst techniczny

### Komponenty
- `MatrixScreen.tsx` - widok główny z sub-matrycą Q2
- `QuizModal.tsx` - modal z krokiem subkategorii dla Q2
- `useQuizForm.ts` - hook obsługujący bypass i subkategorie

### API (Dexie.js)
```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 2;
  subcategory: 'rutyny' | 'projekt' | 'ogolny_cel' | 'inne' | null;
  completed: boolean;
  createdAt: Date;
}
```

### Dane (grupowanie)
```typescript
const groupedTasks = useMemo(() => {
  const q2 = tasks?.filter(t => t.quadrant === 2 && !t.completed) || [];
  return {
    rutyny: q2.filter(t => t.subcategory === 'rutyny'),
    projekt: q2.filter(t => t.subcategory === 'projekt'),
    ogolny_cel: q2.filter(t => t.subcategory === 'ogolny_cel'),
    inne: q2.filter(t => !t.subcategory || t.subcategory === 'inne'),
  };
}, [tasks]);
```

## 6. Kroki implementacji

1. Rozszerzenie schematu Task o pole subcategory
2. Dodanie kroku subkategorii w maszynie stanów Quizu
3. Implementacja widoku sub-matrycy 2×2 z h-14 symetrią
4. Dodanie bypass dla Q2 (pominięcie quizu)
5. Implementacja grupowania reaktywnego przez useLiveQuery
6. Dodanie microcopy edukacyjnych pod kafelkami

## 7. Kryteria akceptacji

**AC-1: Sub-Matrix 2×2 dla Q2**
> GIVEN zadanie zostało zakwalifikowane do ćwiartki Q2 WHEN użytkownik znajduje się na ekranie sub-matrycy Q2 THEN system prezentuje 4 kafelki (Rutyny, Projekty, Cele, Inne) w układzie siatki 2×2 z symetrycznymi wymiarami.

**AC-2: Bypass Quizu dla Q2**
> GIVEN użytkownik znajduje się w widoku Q2 WHEN klika przycisk "+ Dodaj" THEN QuizModal otwiera się w trybie bypass pomijając krok 'quiz' i przechodząc bezpośrednio do ekranu 'confirm'.

**AC-3: Zapis z Subkategorią**
> GIVEN użytkownik na ekranie subkategorii Q2 WHEN wybiera opcję i zatwierdza THEN zadanie zapisywane jest do Dexie z polami quadrant: 2 i wybraną subcategory.

## 8. Testy

### Unit
- Test grupowania zadań według subkategorii
- Test maszyny stanów quizu (bypass dla Q2)
- Test reaktywności useLiveQuery przy zmianie subcategory

### Integracyjne
- **Test E2E Sub-Matrix:** Dodanie zadania do każdej subkategorii, weryfikacja grupowania
- **Test Bypass Flow:** Kliknięcie "+" w Q2, pominięcie quizu, wybór subkategorii, zapis
- **Test Symetrii UI:** Weryfikacja h-14 dla wszystkich 4 nagłówków w sub-matrycy
