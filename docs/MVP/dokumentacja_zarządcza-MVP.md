# FocusFlow – Strategiczna Roadmapa Projektu (Master View)

**Wersja:** 2.0 (Executive Summary)

**Status:** Aktywna faza wdrożeniowa (Sprint 01-02 zakończone)

**Technologia:** Vite + React + TypeScript + IndexedDB

---

## 1. Wizja i Cele Strategiczne

FocusFlow to specjalistyczny planer macierzowy zaprojektowany dla użytkowników z **ADHD**. Celem projektu jest redukcja paraliżu decyzyjnego poprzez wymuszony wybór binarny (**TAK**/**NIE**) oraz systemową blokadę przeładowania poznawczego (System Overload).

### Kluczowe Wskaźniki Sukcesu (KPI):

- **Zero Ambiguity:** Każde zadanie musi przejść przez binarny silnik klasyfikacji.
- **Cognitive Load Safety:** Maksymalnie 5 zadań w ćwiartce *Pilne i Ważne*.
- **Real-time Reactivity:** Synchronizacja stanów między wszystkimi widokami w czasie < 200ms.

---

## 2. Model Zarządzania Agentami (Agentic Workflow)

Projekt realizowany jest w modelu **Manager-Agent**. Jako Manager zarządzam wyspecjalizowanym zespołem AI, delegując zadania operacyjne zgodnie z ich kompetencjami:

- **Architect:** Odpowiada za czystość danych w IndexedDB i logikę selektorów.
- **UX Designer:** Czuwa nad **ADHD**-friendly UI i neonową estetyką V2.
- **Lead Developer:** Implementuje komponenty i logikę systemową.
- **QA Auditor:** Przeprowadza testy akceptacyjne i weryfikuje logikę binarną.

---

## 3. Harmonogram Sprintów (High-Level)

| Sprint | Nazwa Fazy | Kluczowy Cel Biznesowy | Status |
| --- | --- | --- | --- |
| **S1** | **Foundation** | Budowa *Mózgu* aplikacji i reaktywnego store'a. | ZALICZONE |
| **S2** | **Decision Engine** | Pełny flow od Brain Dump do klasyfikacji i blokad Overload. | ZALICZONE |
| **S3** | **Context Views** | Wdrożenie Macierzy Eisenhowera i widoków wirtualnych (dziennych). | W TOKU |
| **S4** | **Execution Tools** | Implementacja Timera Pomodoro i automatycznej eskalacji zadań. | ZAPLANOWANE |
| **S5** | **Product Polish** | Finalny szlif wizualny V2, tryb offline (PWA) i onboarding. | ZAPLANOWANE |

---

## 4. Architektura Systemu i Dane

Aplikacja opiera się na architekturze **Offline-First**. Wszystkie dane przechowywane są lokalnie u użytkownika:

- **Single Source of Truth:** IndexedDB obsługiwana przez centralny hook `useTasksStore`.
- **Event-Bus:** System zdarzeń `TaskUpdated` zapewniający natychmiastowe odświeżanie interfejsu bez przeładowania strony.
- **Virtual Views:** Dynamiczne filtrowanie bazy danych zamiast tworzenia osobnych magazynów dla list (np. widok *Na dzisiaj*).

---

## 5. Definition of Done (DoD) i Jakość

Każdy element projektu uznaje się za ukończony (Done) tylko przy spełnieniu poniższych kryteriów:

- **TypeScript Strictness:** Brak typu `any` w kodzie.
- **UI Fidelity:** **100**% zgodność z Design Tokens (px, hex, glow) zdefiniowanymi w dokumentacji ekranów.
- **QA Validation:** Zaliczenie wszystkich scenariuszy testowych w raporcie sprintu.
- **Build Integrity:** Pomyślne przejście procesu kompilacji `npm run build`.

---

## 6. Analiza Ryzyk Zarządczych

| Ryzyko | Wpływ | Strategia Mitygacji |
| --- | --- | --- |
| Przeładowanie danymi w IDB | Średnie | Implementacja selektorów z memoizacją. |
| Niespójność UI między ekranami | Wysokie | Zastosowanie centralnego `UI_STYLE_GUIDE.md` i masowy overhaul w S5. |
| Porzucenie procesu przez usera | Wysokie | Skrócenie quizu (karuzela) i auto-advance po odpowiedzi. |

---

**Zatwierdzono do realizacji:** *Project Manager / Product Owner* *Data: 11.05.**2026***