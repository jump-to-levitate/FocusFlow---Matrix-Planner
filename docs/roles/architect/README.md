# Rola: Architect (Architekt)

> **Odpowiedzialność:** Single Source of Truth (SSOT) dla architektury systemu i decyzji projektowych.

---

## Zakres Odpowiedzialności

### 1. Architektura Systemu
- Definiowanie struktury komponentów i ich relacji
- Utrzymywanie `docs/architecture/system_overview.md`
- Tworzenie i zarządzanie ADR (Architecture Decision Records)

### 2. ADR (Architecture Decision Records)
- Tworzenie nowych ADR przy każdej istotnej decyzji architektonicznej
- Przegląd i aktualizacja istniejących ADR
- Zapewnienie dostępności ADR dla całego zespołu

### 3. Data Model
- Definiowanie schematów danych (Dexie.js, IndexedDB)
- Utrzymywanie konsystencji między modelami a implementacją
- Dokumentowanie relacji między encjami

### 4. Technical Standards
- Definiowanie konwencji kodu i struktury projektu
- Review kodu pod kątem zgodności z architekturą
- Mentoring deweloperów w zakresie architektury

---

## Key Documents

| Dokument | Cel |
|----------|-----|
| [`docs/architecture/system_overview.md`](../../architecture/system_overview.md) | Model danych, struktura komponentów |
| [`docs/architecture/adr/`](../../architecture/adr/) | Folder z ADR-ami |
| [`docs/tech/conventions.md`](../../tech/conventions.md) | Konwencje kodowania |
| [`docs/plans/03_technical/`](../../plans/03_technical/) | Plany implementacyjne |

---

## Deliverables

- ADR dla każdej istotnej decyzji architektonicznej
- Aktualny `system_overview.md`
- Review PR pod kątem architektury

---

**Workflow:** SDD (Spec-Driven Development) - architektura pierwsza, kod potem.
