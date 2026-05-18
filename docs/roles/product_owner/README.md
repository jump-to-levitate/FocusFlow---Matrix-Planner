# Rola: Product Owner (PO) - FocusFlow 2.0

> **Misja:** Ochrona zasobów kognitywnych osób neuroatypowych (ADHD/ASD) poprzez minimalistyczny, frictionless UX eliminujący paraliż decyzyjny.
> **Odpowiedzialność:** Wizja produktu, roadmapa strategiczna, zarządzanie backlogiem i priorytetyzacja MoSCoW.

---

## 1. Wizja Produktu (Product Vision)

### 1.1 Misja Strategiczna

FocusFlow to **ADHD-proof productivity system**, którego fundamentalnym celem jest **ochrona zasobów kognitywnych osób neuroatypowych** (ADHD/ASD/executive dysfunction).

**Zamiast** narzucać kolejną strukturę organizacji, **FocusFlow eliminuje bariery**:
- ❌ Brak rejestracji (zero barrier entry)
- ❌ Brak decyzji przy dodawaniu zadań (Q0 Brain Dump)
- ❌ Brak wybierania "custom" czasu (7 presets only)
- ❌ Brak shame/guilt (3-way compassionate close)

### 1.2 Kluczowe Filozofie UX

| Filozofia | Implementacja | ADHD Impact |
|-----------|---------------|-------------|
| **Frictionless UX** | Max 3 kliknięcia do celu | Redukcja oporu poznawczego |
| **Zero Registration** | Local-first, IndexedDB | Eliminacja paraliżu przed startem |
| **Decision Support** | Smart Quiz (2 pytania binarne) | System "myśli" za użytkownika |
| **Visual Persistence** | Neon Q1 zawsze widoczne | "Out of sight, out of mind" eliminacja |
| **Compassionate UX** | Brak kar za utratę passy | Ochrona przed RSD (Rejection Sensitive Dysphoria) |

### 1.3 Unique Value Proposition

**Dla osób z ADHD, ASD i executive dysfunction**, FocusFlow jest jedynym narzędziem produktywności, które **nie wymaga żadnej konfiguracji** i **działa offline** - eliminując paraliż decyzyjny zamiast go nasilać.

---

## 2. Priorytety Produktu (MoSCoW Integration)

### 2.1 Klasyfikacja Must-Have (MVP)

| Funkcja | Uzasadnienie Inżynieryjne | ADR Referencja |
|---------|---------------------------|----------------|
| **Sub-matryca Q2 (Centrum Planowania)** | **Must-Have**: Zadania "ważne, niepilne" (Q2) to najczęstszy element "cemetery of good intentions" - zamrażarka zamierzeń. Bez kontekstu wykonawczego użytkownik nigdy nie wraca do tych zadań. Sub-matryca 2x2 z fioletowo-zieloną kolorystyką wymusza decyzję: CZY to rutyna na autopilocie (zielony), CZY projekt wymagający planowania (fioletowy). | ADR-004 |
| **Sub-matryca Q3 (Hub Logistyki)** | **Must-Have**: "Proza życia" (admin, płatności, drobiazgi) stanowią 60% zadań codziennych. Segmentacja na "Zrób teraz" (<10 min), "Zaplanuj blok" (30 min), "W przerwie" (nie wymagające focusu) redukuje przytłoczenie szumem logistycznym. Direct database saving eliminuje race conditions. | ADR-004 |
| **Sub-matryca Q4 (Archiwum)** | **Must-Have**: Izolacja dystraktorów jest krytyczna dla osób z ADHD. Bez fizycznego przycisku "Odrzuć / Zapomnij" (Destructive Hatch) użytkownik nigdy nie "puszcza" myśli - hoarding mentalny prowadzi do przytłoczenia. Mechanizm ten daje psychologiczne przyzwolenie na odpoczynek bez wyrzutów. | ADR-004 |
| **Mechanizm Destructive Hatch** | **Must-Have**: Bez możliwości permanentnego usunięcia zadania użytkownik z ADHD nie uzyska psychologicznego "zamknięcia". Guilt-free zone jest fundamentem compassionate UX. | ADR-005 |

### 2.2 Klasyfikacja Should-Have (Post-MVP)

| Funkcja | Uzasadnienie | Timeline |
|---------|--------------|----------|
| JSON Export/Import | Backup danych przy przekraczaniu quota IndexedDB | v1.1.0 |
| Heatmap Produktów | Statystyki (tylko jeśli nie triggeruje FOMO) | v1.2.0 |

### 2.3 Klasyfikacja Won't-Have (Odrzucone)

| Funkcja | Powód Odrzucenia |
|---------|------------------|
| Cloud Sync/Synchronizacja | Wymaga serwerów, autentykacji = friction dla ADHD |
| Desktop View (powyżej 430px) | Single responsibility: mobile-only dla lepszego UX |
| Custom Timer Presets | 7 sztywnych presetów eliminuje paraliż wyboru |

---

## 3. Ograniczenia i Standardy Operacyjne

### 3.1 Sztywne Ograniczenie Viewportu (430px Pro Max Standard)

**Standard:** `max-w-[430px]` (iPhone 14/15 Pro Max width)

**Uzasadnienie Inżynieryjne:**
- **Pro Max Standard** to najszerszy popularny iPhone - optymalizacja pod najtrudniejszy przypadek zapewnia responsywność na wszystkich urządzeniach
- **Kciuk (Thumb Zone)** - wszystkie interakcje primary muszą być w reachable zone (dolne 2/3 ekranu)
- **Eliminacja "szukania myszką"** - brak hover states, wszystko tap/click

**Weryfikacja:**
```css
/* Tailwind constraint */
max-w-[430px] /* iPhone 14/15 Pro Max */
```

Szczegóły w: [`docs/tech/conventions.md`](../tech/conventions.md)

### 3.2 Granularność Planów (SDD Strict)

**Zasada:** Jeden Epic = Jeden Plan = Jeden Quadrant

| Epic | Plan | Scope |
|------|------|-------|
| EPIC-01 | PLAN_inbox_capture.md | Tylko Q0 Brain Dump |
| EPIC-02 | PLAN_focus_timer.md | Tylko Timer |
| EPIC-03 | PLAN_centrum_planowania_q2.md | Tylko Q2 Sub-matryca |
| EPIC-04 | PLAN_hub_logistyki_q3.md | Tylko Q3 Sub-matryca |
| EPIC-05 | PLAN_archiwum_q4.md | Tylko Q4 Archiwum + Destructive Hatch |
| EPIC-06 | PLAN_smart_quiz.md | Tylko Maszyna Stanów Quizu |

**Cel:** Możliwość iteracyjnego wdrażania - każdy Epic może być zaimplementowany niezależnie.

---

## 4. Rejestr i Linki (SSOT Artifact Mapping)

### 4.1 Składowe Dokumentacji Roli PO

| Dokument | Cel | Lokalizacja |
|----------|-----|-------------|
| **Wizja i Priorytety** | Niniejszy plik - strategiczny hub roli | [readme.md](./readme.md) |
| **Oficjalny Backlog** | User Stories, Epics, Acceptance Criteria | [backlog.md](./backlog.md) |
| **Wymagania Biznesowe** | Cele produktu, Przypadki użycia, Ograniczenia | [docs/business/business_goals.md](../../business/business_goals.md) |

### 4.2 Linki Zewnętrzne

| Kategoria | Dokument | Opis |
|-----------|----------|------|
| **Architektura** | [system_overview.md](../../architecture/system_overview.md) | High-level system architecture |
| **ADRs** | [adr_001.md](../../architecture/adr_001.md) - [adr_007.md](../../architecture/adr_007.md) | Architecture Decision Records |
| **Plans** | [implemented_plans.md](../../../../implemented_plans.md) | Registry of all PLAN_*.md files |
| **Features** | [implemented_features.md](../../../../implemented_features.md) | Feature implementation status |

### 4.3 Powiązane Role

| Rola | Odpowiedzialność | Link |
|------|------------------|------|
| **Architect** | Decyzje techniczne, ADRs | [../architect/readme.md](../architect/readme.md) |
| **Developer** | Implementacja, Code Standards | [../developer/readme.md](../developer/readme.md) |
| **UX/UI** | Design System, Accessibility | [../ux_ui/readme.md](../ux_ui/readme.md) |

---

## 5. Proces Zarządzania Backlogiem

### 5.1 Cykl Życia User Story

```
[Backlog] -> [Sprint Ready] -> [In Progress] -> [Review] -> [Done]
    ↓
[Rejected] (przyczyna dokumentowana)
```

### 5.2 Definicja "Done" (DoD)

- [ ] Kod zaimplementowany zgodnie z AC
- [ ] Unit testy przechodzą (>80% coverage)
- [ ] Integracyjne testy E2E przechodzą
- [ ] Code review zatwierdzone
- [ ] Dokumentacja zaktualizowana
- [ ] QA sign-off

---

**Document ID:** PO-README-001  
**Owner:** Product Owner  
**Status:** ACTIVE  
**Last Updated:** 2026-05-18  
**Version:** 2.0 (Modular SDD Architecture)

