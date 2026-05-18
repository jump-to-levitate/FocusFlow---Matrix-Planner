# Archiwum Q4

## 1. Cel

**Akceptacja Nieproduktywności** - Q4 staje się miejscem bez wyrzutów sumienia dla aktywności, które NIE przyczyniają się do celów. System pomaga sklasyfikować "time wasters" w 4 kategoriach, dając użytkownikowi świadomość jak spędza czas bez oceniania.

## 2. Zakres

**Wchodzi w zakres:**
- Sub-matryca 2×2 dla Q4 z 4 kategoriami
- System subkategorii w Dexie.js
- Bypass quizu dla Q4 (initialQuadrant=4)
- Destructive Hatch (przycisk "Odrzuć")
- Neon Chrome / Matte Silver (#9CA3AF)

**Nie wchodzi w zakres:**
- Timer dla zadań Q4 (rozrywka nie jest śledzona)
- Soft delete recovery (kosz)
- Integracja z serwisami streamingowymi

## 3. Wymagania funkcjonalne

- Zadania Q4 mogą być klasyfikowane w 4 kategoriach: rozrywka, hobby, side_questy, optymalizacja
- Użytkownik może dodać zadanie bezpośrednio z widoku Q4 (bypass quizu)
- Destructive Hatch - przycisk "Odrzuć" nie zapisuje zadania w bazie
- Sub-matryca wyświetla zadania pogrupowane według kategorii
- Możliwość awansu zadania do Q2 (ważne) lub Q3 (pilne)

## 4. Wymagania niefunkcjonalne

- **Wydajność:** Grupowanie zadań w czasie rzeczywistym (useLiveQuery), bez lagów
- **Bezpieczeństwo:** Dane lokalne, brak synchronizacji z serwerem
- **UX:** Matte Silver kolorystyka dla kontrastu z Q1-Q3, bez wyrzutów sumienia

## 5. Kontekst techniczny

### Komponenty
- `MatrixScreen.tsx` - widok główny z sub-matrycą Q4
- `QuizModal.tsx` - modal z krokiem subkategorii dla Q4
- `useQuizForm.ts` - hook obsługujący bypass i subkategorie

### API (Dexie.js)
```typescript
interface Task {
  id?: number;
  title: string;
  quadrant: 4;
  subcategory: 'rozrywka' | 'hobby' | 'side_questy' | 'optymalizacja' | null;
  completed: boolean;
  createdAt: Date;
}
```

### Dane (grupowanie)
```typescript
const groupQ4ByCategory = (tasks: Task[]) => {
  const q4 = tasks?.filter(t => t.quadrant === 4 && !t.completed) || [];
  return {
    rozrywka: q4.filter(t => t.subcategory === 'rozrywka'),
    hobby: q4.filter(t => t.subcategory === 'hobby'),
    side_questy: q4.filter(t => t.subcategory === 'side_questy'),
    optymalizacja: q4.filter(t => !t.subcategory || t.subcategory === 'optymalizacja'),
  };
};
```

## 6. Kroki implementacji

1. Rozszerzenie schematu Task o subkategorie dla Q4
2. Dodanie kroku subkategorii Q4 w maszynie stanów Quizu
3. Implementacja przycisku Destructive Hatch ("Odrzuć")
4. Implementacja widoku sub-matrycy 2×2 z Matte Silver
5. Dodanie bypass dla Q4
6. Implementacja grupowania reaktywnego przez useLiveQuery

## 7. Kryteria akceptacji

**AC-1: Destructive Hatch (Odrzuć)**
> GIVEN użytkownik przydziela zadanie do Q4 i przechodzi do kroku subkategorii WHEN klika przycisk "Odrzuć" THEN modal natychmiast się zamyka, formularz jest resetowany, a zadanie NIE zostaje zapisane w bazie IndexedDB.

**AC-2: Manual Override**
> GIVEN użytkownik znajduje się na ekranie potwierdzenia (confirm) WHEN klika kafelki ręcznej zmiany ćwiartki (Q1-Q4) THEN stan manualQuadrant nadpisuje wyliczenia algorytmu i zadanie trafia do wskazanej ćwiartki.

**AC-3: Quiz Bypass dla Q4**
> GIVEN użytkownik znajduje się w sub-widoku Archiwum WHEN klika przycisk "+ Dodaj" THEN system pomija slajdy quizu i przechodzi bezpośrednio do wyboru subkategorii z parametrem initialQuadrant: 4.

## 8. Testy

### Unit
- Test grupowania zadań Q4 według subkategorii
- Test maszyny stanów quizu (bypass dla Q4)
- Test Destructive Hatch (brak zapisu przy odrzuceniu)

### Integracyjne
- **Test E2E Sub-Matrix Q4:** Dodanie zadania do każdej kategorii Q4, weryfikacja grupowania
- **Test Bypass Flow Q4:** Kliknięcie "+" w Q4, pominięcie quizu, wybór subkategorii, zapis
- **Test Awansu Q4→Q2:** Przeniesienie zadania z Archiwum do Centrum Planowania, weryfikacja zmiany quadrant

**AC-1: Destructive Hatch (Odrzuć)**
> GIVEN użytkownik przydziela zadanie do Q4 i przechodzi do kroku subkategorii WHEN klika przycisk "Odrzuć" THEN modal natychmiast się zamyka, formularz jest resetowany, a zadanie NIE zostaje zapisane w bazie IndexedDB.

**AC-2: Manual Override**
> GIVEN użytkownik znajduje się na ekranie potwierdzenia (confirm) WHEN klika kafelki ręcznej zmiany ćwiartki (Q1-Q4) THEN stan manualQuadrant nadpisuje wyliczenia algorytmu i zadanie trafia do wskazanej ćwiartki.

**AC-3: Quiz Bypass dla Q4**
> GIVEN użytkownik znajduje się w sub-widoku Archiwum WHEN klika przycisk "+ Dodaj" THEN system pomija slajdy quizu i przechodzi bezpośrednio do wyboru subkategorii z parametrem initialQuadrant: 4.

## 8. Testy

### Unit
- Test grupowania zadań Q4 według subkategorii
- Test maszyny stanów quizu (bypass dla Q4)
- Test Destructive Hatch (brak zapisu przy odrzuceniu)

### Integracyjne
- **Test E2E Sub-Matrix Q4:** Dodanie zadania do każdej kategorii Q4, weryfikacja grupowania
- **Test Bypass Flow Q4:** Kliknięcie "+" w Q4, pominięcie quizu, wybór subkategorii, zapis
- **Test Awansu Q4→Q2:** Przeniesienie zadania z Archiwum do Centrum Planowania, weryfikacja zmiany quadrant
