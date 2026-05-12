Oto wygenerowany plik **FocusFlow-Sprint-[01]-Backlog.md**. Dokument ten został przygotowany tak, aby stanowił operacyjne rozszerzenie Twojej nowej Dokumentacji Zarządczej, skupiając się na fundamentach technicznych i logice binarnej.

---

# FocusFlow – Backlog Sprintu 01: Foundation & Logic Engine

**Identyfikator Sprintu:** **S01**

**Nazwa:** Fundamenty: Reaktywny Store i Silnik Quizu

**Status:** **ZALICZONE** (Data zamknięcia: 11.05.**2026**)

---

## 1. Cele Sprintu

### Cel Biznesowy

Zapewnienie użytkownikowi poczucia spójności danych – każda myśl zapisana w systemie musi być natychmiast dostępna na każdym ekranie aplikacji bez potrzeby odświeżania strony. Wprowadzenie pierwszego etapu redukcji paraliżu decyzyjnego poprzez reaktywną pigułkę klasyfikacyjną.

### Cel Techniczny

Wycofanie rozproszonej logiki dostępu do bazy danych na rzecz centralnego modelu *Single Source of Truth* (SoT). Implementacja wzorca Event-Bus dla zapewnienia reaktywności między komponentami.

---

## 2. Zakres Prac (User Stories & Tasks)

### 2.1. Infrastruktura Danych i Reaktywność

- **Zadanie 1.1:** Utworzenie modułu `store/events.ts` – implementacja globalnego emitera zdarzeń `TaskUpdated`.
- **Zadanie 1.2:** Implementacja hooka `useTasksStore` – centralizacja operacji na IndexedDB (**CRUD**) połączona z automatyczną subskrypcją zdarzeń.
- **Zadanie 1.3:** Budowa selektorów danych (`selectors.ts`) do dynamicznego filtrowania zadań na potrzeby widoków wirtualnych.

### 2.2. Silnik Decyzyjny (Mózg Aplikacji)

- **Zadanie 1.4:** Ekstrakcja logiki `processQuiz` do niezależnego modułu TS – wdrożenie reguły *Większość (2 z 3)* dla osi Ważności i Pilności.
- **Zadanie 1.5:** Refaktoryzacja Ekranu 03 (Brain Dump) – pigułka *Trafia do...* musi aktualizować się w czasie rzeczywistym po każdej odpowiedzi w quizie.

### 2.3. Środowisko Deweloperskie

- **Zadanie 1.6:** Implementacja modułu `seed.ts` – automatyczne wstrzykiwanie 8 zadań testowych (po 2 na kwadrant) w trybie deweloperskim.

---

## 3. Inwentarz Plików (Artifacts)

| Plik | Status | Odpowiedzialny Agent |
| --- | --- | --- |
| `src/store/events.ts` | Utworzony | IT Architect |
| `src/store/useTasksStore.ts` | Utworzony | Lead Developer |
| `src/logic/processQuiz.ts` | Utworzony | IT Architect |
| `src/pages/BrainDump.tsx` | Zaktualizowany | UX Designer / Lead Dev |
| `src/pages/Pulpit.tsx` | Zaktualizowany | Lead Developer |

---

## 4. Ograniczenia i Założenia Techniczne

- **Brak lokalnego stanu:** Żaden widok nie może przechowywać kopii listy zadań w `useState`; dane pobierane są wyłącznie przez selektory ze store'a.
- **Binarne Wyjście:** Silnik quizu musi zwracać `Quadrant | null` – brak stanów pośrednich.
- **Kolorystyka:** Rygorystyczne przestrzeganie kodów **HEX** dla kwadrantów (Q1: `#**39FF14**`, Q2: `#**A020F0**`) w pigułce wynikowej.

---

## 5. Definition of Done (DoD) dla Sprintu 01

- [x] Aplikacja kompiluje się bez błędów TypeScript (Strict Mode).
- [x] Po dodaniu zadania na Ekranie 03, karta Hero na Pulpicie aktualizuje się natychmiast.
- [x] Pigułka klasyfikacyjna poprawnie rozpoznaje wszystkie 4 kwadranty na podstawie testowych kombinacji **TAK**/**NIE**.
- [x] Dane fixture'owe (8 zadań) są poprawnie ładowane przy pierwszym uruchomieniu w środowisku **DEV**.

---

*Dokument zatwierdzony przez Managera Projektu.*