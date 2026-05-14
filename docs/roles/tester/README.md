# Rola: Tester / QA Engineer

> **Odpowiedzialność:** Weryfikacja zgodności ze specyfikacją i ADHD UX requirements.

---

## Zakres Odpowiedzialności

### 1. Spec-Driven Testing
> **"Kod jest poprawny, gdy implementuje specyfikację - nie gdy 'działa'"**

- Testowanie wg planów (`TECH_*`, `FEAT_*`, `STRAT_*`)
- Każdy test odnosi się do konkretnego wymagania z planu
- Bug = kod nie zgadza się ze specyfikacją

### 2. Constraint-First Testing
Priorytet testowania (w kolejności):

1. **480px Safety Net** - Layout constraint jest NADRZĘDNY
2. **Mobile-First UI** - Touch targets, thumb zones, scroll behavior
3. **ADHD UX** - Friction reduction, visual persistence, decision support

### 3. ADHD-Aware Testing
Tester musi myśleć jak osoba z executive dysfunction:

| Pytanie | Oczekiwana odpowiedź |
|---------|-------------------|
| Czy ten flow wymaga ode mnie myślenia? | ❌ NIE (ma być "foolproof") |
| Czy to jest "idiotoodporne"? | ✅ TAK |
| Czy użytkownik może "zablokować się" w tym miejscu? | ⚠️ Sprawdź edge cases |

### 4. Verification Reports
- Tworzenie raportów weryfikacji dla zakończonych planów
- Przechowywanie raportów w `reports/`
- Referencja do raportów w `implemented_plans.md`

---

## Key Documents

| Dokument | Cel |
|----------|-----|
| [`strategy.md`](./strategy.md) | Szczegółowa strategia testowania |
| [`reports/`](./reports/) | Raporty weryfikacji (np. TECH_000) |
| [`scenarios/`](./scenarios/) | Scenariusze testowe dla planów |
| [`docs/plans/`](../../plans/) | Plany do weryfikacji |
| [`docs/architecture/adr/ADR_002_mobile_first_constraint.md`](../../architecture/adr/ADR_002_mobile_first_constraint.md) | 480px constraint |
| [`docs/roles/ux_ui/design-system.md`](../ux_ui/design-system.md) | UX wymagania |

---

## Struktura Folderów

```
tester/
├── README.md              # Ten plik
├── strategy.md            # Ogólna strategia QA
├── reports/               # Raporty weryfikacji
│   └── TECH_000_verification_report.md
└── scenarios/             # Scenariusze testowe
    └── .gitkeep
```

---

## Verification Workflow

1. **Otrzymanie planu** (TECH/FEAT)
2. **Przeczytanie spec** - zrozumienie wymagań
3. **Przegląd kodu** - czy kod implementuje spec?
4. **Testy manualne** - czy działa zgodnie z oczekiwaniami?
5. **ADHD UX Check** - czy friction jest minimalny?
6. **480px Check** - czy layout działa na małych ekranach?
7. **Raport** - dokumentacja wyników

---

## Deliverables

- Verification reports w `reports/`
- Test scenarios w `scenarios/`
- Bug reports z referencją do planów
- Sign-off przed release

---

**Zasada:** Testujemy spełnienie specyfikacji, nie "działanie kodu".
