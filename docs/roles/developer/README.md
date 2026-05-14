# Rola: Developer (Deweloper)

> **Odpowiedzialność:** Czystość kodu, zgodność z konwencjami i realizacja planów technicznych.

---

## Zakres Odpowiedzialności

### 1. Code Quality
- Pisanie czystego, czytelnego kodu TypeScript/React
- Stosowanie się do konwencji z `docs/tech/conventions.md`
- Self-review przed PR

### 2. Spec-Driven Development (SDD)
- **Wymagane:** Przeczytanie odpowiedniego planu przed kodowaniem
- Implementacja zgodnie ze specyfikacją (nie "na czuja")
- Jeśli spec nie pasuje do rzeczywistości - aktualizacja spec (nie obejście!)

### 3. 480px Constraint (ADR_002)
- **MANDATORY:** Sprawdzenie `docs/architecture/adr/ADR_002_mobile_first_constraint.md` przed każdą zmianą UI
- Wszystkie komponenty muszą działać w ramach 480px
- Testowanie na różnych rozmiarach ekranu (320px - 480px)

### 4. Colors & Design System
- **ZAKAZ:** Hardkodowania kolorów w komponentach
- **WYMAGANE:** Używanie `src/constants/colors.ts` lub Tailwind classes
- Zgodność z Neon Glassmorphism palette

---

## Key Documents

| Dokument | Cel |
|----------|-----|
| [`standards.md`](./standards.md) | Szczegółowe standardy kodowania |
| [`docs/tech/conventions.md`](../../tech/conventions.md) | Konwencje projektu, 480px constraint |
| [`docs/architecture/adr/ADR_002_mobile_first_constraint.md`](../../architecture/adr/ADR_002_mobile_first_constraint.md) | Wymagane czytanie przed UI |
| [`src/constants/colors.ts`](../../../app/src/constants/colors.ts) | Design tokens |
| [`docs/plans/03_technical/`](../../plans/03_technical/) | Plany do implementacji |

---

## Pre-Commit Checklist

```markdown
- [ ] Przeczytałem/am odpowiedni plan z `docs/plans/`
- [ ] Kod jest zgodny z `conventions.md`
- [ ] Sprawdziłem/am ADR_002 (480px) przed zmianami UI
- [ ] Używam kolorów z `colors.ts` (brak hardcoded colors)
- [ ] Testy przechodzą (jeśli dotyczy)
- [ ] Self-review kodu wykonane
```

---

## Workflow

1. **Czytaj:** Przeczytaj plan (`TECH_*` lub `FEAT_*`)
2. **Pytaj:** Jeśli coś jest niejasne - pytaj w PR/Discord
3. **Koduj:** Implementuj zgodnie ze spec
4. **Testuj:** Sprawdź 480px constraint, kolory, interakcje
5. **PR:** Stwórz PR z referencją do planu

---

**Zasada:** Kod jest poprawny, gdy implementuje specyfikację - nie gdy "działa".
