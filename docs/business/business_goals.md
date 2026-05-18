# Cele Biznesowe FocusFlow 2.0

> Strategiczna specyfikacja produktu  
> Status: APPROVED  
> Data: 2026-05-18

---

## 1. Wizja Produktywności

### 1.1 Problem do Rozwiązania

**Paraliż decyzyjny** i **bariery wykonawcze** to codzienne doświadczenia osób neuroatypowych (ADHD, ASD, przewlekłe zmęczenie). Klasyczne narzędzia produktywności (Notion, Todoist, Trello) przytłaczają:

- Zbyt wiele opcji konfiguracji → **paraliż wyboru**
- Wymóg kategoryzacji przy wprowadzaniu → **bariera wejścia**
- Synchronizacja chmurowa → **opóźnienia, logowanie, friction**
- Przeciążenie funkcjami → **rozpraszanie, prokrastynacja**

### 1.2 Misja FocusFlow

> Stworzenie **bezstresowego, minimalistycznego** narzędzia, które **eliminuje paraliż decyzyjny** zamiast dodawać kolejną warstwę zarządzania.

**Kluczowe różnice:**

| Tradycyjne narzędzie | FocusFlow 2.0 |
|---------------------|---------------|
| "Jak zorganizować?" | "Po prostu wrzuć - posortujemy później" |
| 20 kroków setupu | Zero konfiguracji, działa offline |
| Logowanie OAuth | Brak konta = Brak barier wejścia |
| Infinite customization | 7 sztywnych presetów (ADHD-proof) |
| Cloud-first | Local-first, offline-first |

---

## 2. User Stories

### 2.1 Persona: Osoba z ADHD w fazie "Rozpraszania"

> **Jako** osoba z 15 otwartymi kartami w przeglądarce i głową pełną myśli  
> **Chcę** szybko "zrzucić" wszystkie myśli bez kategoryzacji  
> **By** opróżnić pamięć roboczą i skupić się na jednej rzeczy  

**Scenariusz - Poczekalnia Q0 (Brain Dump):**

```
[Stan początkowy] Użytkownik czuje przytłoczenie, 20+ "rzeczy do zrobienia" w głowie
        ↓
[Akcja] Otwiera Inbox (Q0) - widzi puste pole tekstowe
        ↓
[Interakcja] Wpisuje: "Zadzwonić do dentysty" + Enter
[System] Zadanie ląduje w Q0 bez pytania "pilne/ważne?"
        ↓
[Interakcja] Wpisuje: "Kupić mleko" + Enter
[Interakcja] Wpisuje: "Napisać raport Q1" + Enter
        ↓
[Stan końcowy] 3 zadania w Q0, użytkownik uspokojony, wraca do pracy
        ↓
[Później] W trakcie pracy: klika "Kwalifikuj" → Quiz AI sortuje zadania
```

**Wartość:** Redukcja **kognitywnego obciążenia** z 20 myśli → 1 myśl (aktualna).

### 2.2 Persona: Freelancer w fazie "Głębokiej Pracy"

> **Jako** freelancer próbujący skończyć projekt  
> **Chcę** 50 minut nieprzerwanego skupienia z szybkim startem  
> **By** wejść w stan flow bez konfigurowania timeru przez 5 minut  

**Scenariusz - Timer Focus (Quick 5):**

```
[Stan początkowy] Użytkownik wie, że powinien pracować, ale "nie ma siły zaczynać"
        ↓
[Akcja] Otwiera Timer → widzi grid 7 presetów (Quick 5, Quick 10, 25/5...)
        ↓
[Interakcja] Klika "Quick 5" (5 minut, 0 przerwa)
[System] Timer startuje natychmiast, bez pytań "nad czym pracujesz?"
        ↓
[Efekt] 5 minut później - użytkownik ma "pierwszy krok" za sobą, często kontynuuje
```

**Wartość:** Eliminacja **barier wykonawczych** przez "pogromcę prokrastynacji" (Quick 5).

### 2.3 Persona: Manager w fazie "Logistyki Dnia"

> **Jako** osoba z 30 mailami i 5 spotkaniami w kalendarzu  
> **Chcę** szybko rozdzielić zadania na "zrobię teraz" vs "zaplanuję blok"  
> **By** nie tracić 2h na mailach, które mogą poczekać  

**Scenariusz - Q3 Hub Logistyki:**

```
[Stan początkowy] 15 nieprzeczytanych maili, użytkownik czuje presję
        ↓
[Akcja] Przegląda maile, dodaje do Q3 z kontekstem:
        • "Odpowiedzieć na prośbę X" → Zrób teraz (<10 min)
        • "Przeglądnąć sprawozdanie" → Zaplanuj blok (30 min)
        • "Przeczytać newsletter" → W przerwie (czytanie przy kawie)
        ↓
[Efekt] Użytkownik ma plan: 3 quick wins teraz, reszta zaplanowana
```

**Wartość:** **Batch processing** i kontekstowa klasyfikacja redukuje chaos.

### 2.4 Persona: Osoba w fazie "Wypalenia"

> **Jako** osoba wypalona, która "powinna" pracować, ale nie ma siły  
> **Chcę** dać sobie pozwolenie na odpoczynek bez wyrzutów sumienia  
> **By** nie czuć winy przy scrollowaniu TikToka  

**Scenariusz - Q4 Archiwum (Guilt-Free Zone):**

```
[Stan początkowy] Użytkownik "prokrastynuje" (TikTok, gry), czuje winę
        ↓
[Akcja] Dodaje do Q4: "Przewertować TikToka 30 min"
[Interakcja] Wybiera kategorię: "Rozrywka" (nie "Side-quest")
        ↓
[Efekt] System NIE ocenia - to "zaplanowana przerwa", nie "prokrastynacja"
        ↓
[Opcjonalnie] Po 30 min: "Odrzuć" lub "Awansuj do Q2" jeśli coś ważnego wyszło
```

**Wartość:** **Akceptacja nieproduktywności** jako element zdrowego dnia.

---

## 3. Ograniczenia Biznesowe (Constraints)

### 3.1 Zero Friction przy Pierwszym Uruchomieniu

| Wymaganie | Uzasadnienie |
|-----------|--------------|
| **Brak rejestracji** | Każdy formularz logowania to 20% drop-off dla osób z ADHD |
| **Brak połączenia sieciowego** | Offline-first eliminuje lęk "a co jak zginie internet?" |
| **Brak onboardingu** | Tutorial = prokrastynacja, użytkownik ucieka przed zobaczeniem UI |
| **Brak konfiguracji** | Zero pytań "jak chcesz używać?" przy pierwszym otwarciu |

### 3.2 Single Device (Celowo)

**Decyzja strategiczna:** Wersja MVP nie synchronizuje danych między urządzeniami.

**Uzasadnienie:**
- Synchronizacja = serwery = koszty = wymóg logowania
- Osoby z ADHD często mają "jedno główne urządzenie" (telefon zawsze przy sobie)
- Eksport/import JSON jako rozwiązanie backupowe (TBD)

### 3.3 Mobile-Only Design

| Ograniczenie | Cel |
|--------------|-----|
| Szerokość 480px | Optymalizacja pod kciuk, eliminacja "szukania myszką" |
| PWA (nie native app) | Brak review w App Store, natychmiastowe aktualizacje |
| Brak desktop view | Ograniczenie zakresu, focus na głównym use case |

### 3.4 Granularność Planów (SDD)

Każda funkcja to **jeden mały plan** (nie master plan):
- PLAN_inbox_capture.md - tylko Q0
- PLAN_focus_timer.md - tylko Timer
- PLAN_centrum_planowania_q2.md - tylko Q2

Cel: **Możliwość iteracji** - można wdrożyć Q0-Q4 niezależnie.

---

## 4. Metryki Sukcesu (KPIs)

### 4.1 UX Metrics

| Metryka | Target | Jak mierzyć |
|---------|--------|-------------|
| Time to First Task | < 10 sekund | Od otwarcia app do dodania pierwszego zadania |
| Brain Dump Completion Rate | > 80% | % użytkowników dodających ≥3 zadania w Q0 |
| Timer Activation | > 60% | % sesji z włączonym timerem |
| Decision Fatigue Score | < 2 kliknięć | Średnia liczba kliknięć do dodania zadania |

### 4.2 Technical Metrics

| Metryka | Target | Uzasadnienie |
|---------|--------|--------------|
| Time to Interactive | < 2s | Vite build optimization |
| IDB Write Latency | < 50ms | Dexie.js transakcje |
| Timer Drift | < 1s | Unix Delta Timestamp (ADR-002) |

---

## 5. Roadmap (Post-MVP)

### Phase 2 (v1.1.0) - Export/Backup
- JSON export wszystkich zadań
- Import/restore z pliku

### Phase 3 (v1.2.0) - Statystyki
- Dashboard: "Ile zadań dziś ukończono"
- Heatmap produktywności (tylko jeśli nie triggeruje FOMO)

### Phase 4 (v2.0.0) - ???
**Brak roadmapy** - priorytetem jest stabilność MVP, nie feature creep.

---

**Document ID:** BUS-GOALS-001  
**Owner:** Technical Product Manager  
**Status:** APPROVED
