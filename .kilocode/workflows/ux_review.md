# WF_UX_REVIEW - UX/UI Compliance Audit Workflow

> Workflow dla komendy `/WF UX` - audyt zgodności implementacji z dokumentacją wizualną

---

## Cel

Przeprowadzenie audytu zaimplementowanego komponentu/ekranu pod kątem zgodności z:
- Dokumentacją wizualną z PDF (FocusFlow – Matrix Planner.pdf)
- Zasadami Mobile-First (480px constraint)
- Konwencjami technicznymi z `docs/tech/conventions.md`
- Dostępnością UX dla użytkowników ADHD (Primary ICP)

---

## Baza Wiedzy (Reference)

### Główne Widoki (Strony PDF)

| Komponent | Strona PDF | Kluczowe Elementy |
|-----------|------------|-------------------|
| **Pulpit (Dashboard)** | Str. 15 | Aktualny cel Q1, "Kolejne w kolejce", dostęp do raportów, Brain Dump |
| **Macierz Eisenhowera** | Str. 16 | Grid 2x2, liczniki zadań w ćwiartkach, nawigacja do centrów planowania |
| **Wszystko na dzisiaj** | Str. 5 | Linearny widok dnia, priorytety (Pilne/Ważne vs Proza Życia), Nawyki, Projekty |

### Interakcje i Pop-upy

| Komponent | Strona PDF | Kluczowe Elementy |
|-----------|------------|-------------------|
| **Pop-up Opcji** | Str. 17 | Menu kontekstowe: edycja, przenoszenie, dodaj notatkę, usuń, Focus Timer |
| **Limit Przeciążenia Q1** | Str. 19 | Blokada przy 5+ zadaniach w Q1, komunikat "Przeciążenie Systemu" |
| **Info Pop-ups Q3** | Str. 29-31 | Edukacyjne nakładki: delegowanie, automatyzacja, sprinty logistyczne |

### Procesy (User Flows)

| Proces | Strony PDF | Kluczowe Kroki |
|--------|------------|----------------|
| **Brain Dump Quiz** | Str. 18 | 2 pytania: "Czy przybliża do celu?" + "Czy masz twardy termin?" |
| **Decyzje Q3** | Str. 8, 23 | Strategie: "Zrób teraz" (<10min), "Zaplanuj blok", "W przerwie" |
| **Decyzje Q4** | Str. 9, 24 | Subkategorie: Optymalizacja, Side-quest, Hobby, Rozrywka |

### Narzędzia

| Narzędzie | Strona PDF | Kluczowe Funkcje |
|-----------|------------|------------------|
| **Timer Focus** | Str. 6 | 25/5 lub 50/10, licznik serii dni, notatki w trakcie sesji |
| **Notatki Brain Dump** | Str. 7 | Magazyn nieposortowanych myśli, wolne notatki + przypisane do zadań |

### Dodatkowe Ekrany

| Ekran | Strona PDF | Opis |
|-------|------------|------|
| Centrum Planowania Q3 (Proza Życia) | Str. 8, 23 | Widok szczegółowy ćwiartki III z zadaniami |
| Centrum Planowania Q4 (Nie teraz) | Str. 9, 24 | Widok szczegółowy ćwiartki IV z kategoriami |
| Ekran błędu | Str. 10 | Obsługa błędów, friendly messaging |

---

## Proces Audytu (Step-by-Step)

### Krok 1: Identyfikacja Komponentu

**Zapytaj użytkownika:**
> "Który ekran/komponent sprawdzamy?"
> 
> Dostępne opcje:
> - Pulpit (Dashboard) - str. 15 PDF
> - Macierz Eisenhowera - str. 16 PDF
> - Wszystko na dzisiaj - str. 5 PDF
> - Pop-up Opcji - str. 17 PDF
> - Limit Przeciążenia Q1 - str. 19 PDF
> - Brain Dump Quiz - str. 18 PDF
> - Timer Focus - str. 6 PDF
> - Notatki Brain Dump - str. 7 PDF
> - [Inny - podaj nazwę]

### Krok 2: Lokalizacja Kodu

1. Znajdź implementację komponentu w `/app/src`
2. Sprawdź strukturę plików:
   - Komponent React (`.tsx`)
   - Styles (Tailwind classes)
   - Props/State interface

### Krok 3: Analiza Wizualna vs PDF

Porównaj implementację z dokumentacją PDF:

#### Checklista Wizualna:

- [ ] **Layout** - czy struktura zgadza się ze schematem na PDF?
- [ ] **Kolory** - czy użyto `colors.ts` (zabronione twarde kolory!)
- [ ] **Typography** - czy rozmiary fontów są zgodne z PDF?
- [ ] **Spacing** - marginesy, paddingi, gap'y zgodne z designem?
- [ ] **Borders/Shadows** - czy glassmorphism zgodny z Neon estetyką?
- [ ] **Icons** - czy ikony pasują do kontekstu (Lucide)?

### Krok 4: Mobile-First Audit

#### Sprawdź zgodność z `docs/tech/conventions.md`:

**Critical Constraints:**
- [ ] `max-w-[480px]` na głównym containerze
- [ ] Wycentrowanie `mx-auto`
- [ ] `px-4` padding boczny
- [ ] Thumb-driven navigation (dolne menu)

**Thumb Zone Check:**
- [ ] Primary actions w dolnej 1/3 ekranu (easy thumb reach)
- [ ] Secondary actions w górnej 1/3 (OK to stretch)
- [ ] Przyciski min. 44px × 44px (Apple HIG / Material Design)
- [ ] Gesty swipe-friendly (marginy chroniące przed przypadkowymi akcjami)

### Krok 5: ADHD UX Check

**Specyficzne dla ADHD (z `PLAN_RISK_002`):**

- [ ] **Minimal friction** - czy interakcja wymaga minimalnych kliknięć?
- [ ] **Visual persistence** - czy kluczowe info jest zawsze widoczne?
- [ ] **Clear CTA** - czy użytkownik wie CO robić TERAZ?
- [ ] **Reduced cognitive load** - czy ekran jest przejrzysty (nie przeładowany)?
- [ ] **Immediate feedback** - czy akcje dają instant visual response?
- [ ] **No decision paralysis** - czy opcje są ograniczone (max 3-4)?

### Krok 6: Logic Flow Check

**Nawigacja i Przejścia:**

- [ ] Czy przejścia między ekranami są zgodne z mapą flow z PDF?
- [ ] Czy back navigation działa intuicyjnie?
- [ ] Czy stan ekranu (np. filtry) persistuje się poprawnie?
- [ ] Czy edge cases (pusta lista, błąd) są obsłużone?

### Krok 7: Kod Review

**Zgodność z konwencjami:**

- [ ] Brak twardych kolorów - wszystko z `src/constants/colors.ts`
- [ ] Mobile-first media queries (`md:` dla desktop, nie odwrotnie)
- [ ] Glassmorphism: `backdrop-blur`, `bg-opacity`, `border-white/20`
- [ ] Neon accents używane zgodnie z paletą
- [ ] Typescript - proper typing dla propsów i state

---

## Generowanie Raportu

### Output: `docs/roles/ux_ui/reviews/UX_REVIEW_[nazwa_komponentu].md`

#### Struktura Raportu:

```markdown
# UX Review: [Nazwa Komponentu]

> Data audytu: YYYY-MM-DD
> Przeprowadził: UX/UI Designer
> Status: [ ] Pass | [ ] Needs Fix | [ ] Blocker

## 1. Visual Match vs PDF (Str. X)

| Element | PDF | Implementacja | Status | Uwagi |
|---------|-----|---------------|--------|-------|
| Layout grid | 2x2 matrix | Flex/Grid? | ✅/❌ | |
| Kolory Q1 | #FF4757 | colors.ts? | ✅/❌ | |
| Typography | 24px bold | text-2xl? | ✅/❌ | |
| Spacing | 16px gap | gap-4? | ✅/❌ | |

## 2. Mobile-First Compliance

### Constraints Check:
- [ ] max-w-[480px]: ✅/❌ (wartość: ___)
- [ ] mx-auto: ✅/❌
- [ ] px-4: ✅/❌

### Thumb Zone Analysis:
- [ ] Primary actions w thumb zone (dolna 1/3): ✅/❌
- [ ] Touch targets ≥44px: ✅/❌
- [ ] Bottom navigation: ✅/❌

## 3. ADHD UX Check

| Kryterium | Status | Uwagi |
|-----------|--------|-------|
| Minimal friction (<3 clicks do celu) | ✅/❌ | |
| Visual persistence (zawsze widać zadania) | ✅/❌ | |
| Clear CTA (wiadomo co robić) | ✅/❌ | |
| Reduced cognitive load (nie przeładowany) | ✅/❌ | |
| Immediate feedback (visual response) | ✅/❌ | |
| Max 3-4 options (no paralysis) | ✅/❌ | |

## 4. Logic Flow Check

| Flow | Status | Uwagi |
|------|--------|-------|
| Navigation matches PDF | ✅/❌ | |
| Back navigation works | ✅/❌ | |
| State persistence | ✅/❌ | |
| Edge cases handled | ✅/❌ | |

## 5. Code Compliance

| Konwencja | Status | Uwagi |
|-----------|--------|-------|
| No hardcoded colors | ✅/❌ | |
| Mobile-first CSS | ✅/❌ | |
| Glassmorphism correct | ✅/❌ | |
| TypeScript proper | ✅/❌ | |

## 6. Korekty do Wprowadzenia

### P0 (Blocker - musi być naprawione):
1. [ ] _____________
2. [ ] _____________

### P1 (High Priority):
1. [ ] _____________
2. [ ] _____________

### P2 (Nice to have):
1. [ ] _____________
2. [ ] _____________

## 7. Podsumowanie

**Verdict:** [ ] Pass | [ ] Needs Fix | [ ] Blocker

**Key Issues:**
- 

**Recommended Actions:**
- 

---

**Reviewed against:**
- PDF: `shit-docs/FocusFlow – Matrix Planner.pdf` (Str. X)
- Conventions: `docs/tech/conventions.md`
- ICP: `docs/plans/PLAN_RISK_002_icp_persona.md` (ADHD Brain)
```

---

## Użycie Workflow

### Wywołanie:
```
/WF UX
```

### Co robi agent:
1. Pyta: "Który komponent sprawdzamy?"
2. Analizuje kod w `/app/src`
3. Porównuje z PDF reference
4. Sprawdza konwencje (480px, colors.ts)
5. Audytuje ADHD UX
6. Generuje raport w `docs/roles/ux_ui/reviews/`

### Expected Time:
- Simple component: 10-15 min
- Complex screen: 20-30 min
- Full app audit: 1-2h

---

## Checklist dla Agenta

Przed wygenerowaniem raportu, upewnij się że:
- [ ] Przeczytałeś odpowiednią stronę PDF
- [ ] Znalazłeś kod komponentu w `/app/src`
- [ ] Sprawdziłeś `max-w-[480px]` constraint
- [ ] Zweryfikowałeś użycie `colors.ts` (brak twardych kolorów)
- [ ] Przeanalizowałeś thumb zones
- [ ] Sprawdziłeś ADHD UX kryteria
- [ ] Wypełniłeś wszystkie sekcje raportu

---

## Powiązane Dokumenty

| Dokument | Cel |
|----------|-----|
| `docs/tech/conventions.md` | Mobile-first, 480px, colors.ts |
| `docs/plans/PLAN_RISK_002_icp_persona.md` | ADHD UX requirements |
| `docs/architecture/system_overview.md` | Struktura komponentów |
| `shit-docs/FocusFlow – Matrix Planner.pdf` | Source of visual truth |

---

## Historia Wersji

| Data | Wersja | Zmiany |
|------|--------|--------|
| 2026-05-10| 1.0 | Initial workflow definition |

