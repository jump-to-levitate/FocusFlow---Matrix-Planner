# 01 Strategia Rozwoju Produktu i Kamienie Milowe

> Wersja: 1.0  
> Data: Maj 2026  
> Status: 📋 Strategiczny Plan Egzekucji

---

## 1. Nazwa Dokumentu

**Strategia Rozwoju Produktu i Kamienie Milowe (Product Roadmap)**

---

## 2. Wizja Produktu

FocusFlow to **ADHD-proof productivity system** działający jako lokalna aplikacja PWA (Progressive Web App). Zaprojektowany z myślą o osobach neuroatypowych, eliminuje barierę wejścia poprzez:

- **Zero rejestracji** - brak konieczności zakładania konta
- **Offline-first** - pełna funkcjonalność bez internetu
- **Local-first** - dane zapisane lokalnie w IndexedDB
- **ADHD-friendly UX** - redukcja paraliżu decyzyjnego, dopaminowa nagroda wizualna

---

## 3. Faza 1: Local-First Focus Core (OBECNA)

> **Status:** ✅ Wdrożone (Maj 2026)  
> **Cel:** Podstawowa funkcjonalność produktywnościowa bez zależności zewnętrznych

### 3.1 Zakres Funkcjonalny

| Moduł | Opis | Status |
|-------|------|--------|
| **Inbox Capture (Q0)** | Potok Brain Dump bez barier decyzyjnych | ✅ Wdrożone |
| **Macierz Priorytetów** | Q1-Q4 z izolacją Q0 | ✅ Wdrożone |
| **Inteligentny Quiz** | Klasyfikacja zadań do ćwiartek | ✅ Wdrożone |
| **Centrum Planowania (Q2)** | Sub-matryca 2x2 z podkategoriami | ✅ Wdrożone |
| **Cyberpunk Timer** | 7 presetów, Delta Timestamp, PWA Audio | ✅ Wdrożone |
| **System Notatek** | Linked Notes + Free Notes | 📋 W planach |

### 3.2 Architektura Techniczna

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Baza Danych:** Dexie.js (IndexedDB wrapper) - local-only
- **PWA:** Service Worker, manifest.json, offline-first
- **UX:** Mobile-first (480px constraint), cyberpunk neon design

### 3.3 Kluczowe Decyzje UX (ADHD-Proof)

- **Zero friction entry** - otwórz aplikację, zacznij zrzucać myśli
- **Paraliż decyzyjny eliminowany** - quiz klasyfikuje za użytkownika
- **Visual persistence** - neonowe ćwiartki zawsze widoczne
- **Elastyczne domknięcie** - 3 opcje zakończenia sesji timera

### 3.4 KPI Sukcesu Fazy 1

- [x] Czas do pierwszego zadania < 2 min
- [x] Offline functionality 100%
- [x] Mobile UX bez poziomego scrolla
- [x] 7 timer presets (ADHD-proof, brak "custom")

---

## 4. Faza 2: Multi-Device Sync (PLANOWANA)

> **Status:** 📋 Planowana (Q3 2026)  
> **Cel:** Opcjonalna synchronizacja między urządzeniami bez utraty prywatności

### 4.1 Zakres Funkcjonalny

| Funkcja | Opis | Priorytet |
|---------|------|-----------|
| **CRDT Sync** | Conflict-free Replicated Data Type dla zadań | Wysoki |
| **WebRTC/Cloud** | Synchronizacja peer-to-peer lub opcjonalna chmura | Średni |
| **Backup/Restore** | Eksport/import danych (JSON) | Wysoki |
| **Device Pairing** | Parowanie telefonu z desktop | Średni |

### 4.2 Architektura Techniczna

```
┌─────────────────────────────────────────────────────────────┐
│                     FOCUSFLOW 2.0                          │
│                   (Local-First Core)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │   Telefon    │◄────►│   Desktop    │                   │
│  │  (IndexedDB) │ Sync │  (IndexedDB) │                   │
│  └──────────────┘      └──────────────┘                   │
│         ▲                      ▲                           │
│         └──────────┬───────────┘                           │
│                    ▼                                       │
│            ┌──────────────┐                               │
│            │  Sync Layer  │                               │
│            │  (CRDT/Web)  │                               │
│            └──────────────┘                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Kluczowe Decyzje UX

- **Opt-in sync** - synchronizacja jest opcjonalna, nie wymuszona
- **Privacy-first** - dane mogą być szyfrowane end-to-end
- **Conflict resolution** - CRDT automatycznie rozwiązuje konflikty
- **Offline survival** - sync działa w tle, nie blokuje UI

### 4.4 Kryteria Akceptacji

- [ ] Synchronizacja < 5 sekund przy zmianie
- [ ] Automatyczne rozwiązywanie konfliktów (bez interakcji użytkownika)
- [ ] E2E encryption dla wrażliwych danych
- [ ] Fallback do local-only w przypadku problemów

---

## 5. Faza 3: Dopamine Gamification (WIZJA)

> **Status:** 🔮 Wizja (2027+)  
> **Cel:** System nagród i historii sukcesów jako tarcza anty-prokrastynacyjna

### 5.1 Zakres Funkcjonalny

| Funkcja | Opis | Intencja |
|---------|------|----------|
| **Seria Dni (Streak)** | Licznik consecutive days z completed sessions | "Don't break the chain" |
| **Historia Sukcesów** | Archiwum ukończonych zadań z datami | Tarcza przeciw RSD (Rejection Sensitive Dysphoria) |
| **Bezkarne Resetowanie** | Możliwość zresetowania streak bez winy | ADHD-proof gamification |
| **Visual Rewards** | Animacje, odznaki, cyberpunkowe "level up" | Dopaminowa nagroda |
| **Gentle Reminders** | Miękkie przypomnienia bez guilt-tripping | Compassion over productivity |

### 5.2 Architektura Psychologiczna (ADHD-Proof)

#### 5.2.1 Bezkarne Resetowanie Passy

Standardowe streak apps używają guilt-tripping ("Straciłeś 30-dniową passę!")

**FocusFlow Approach:**
- "Resetuj passę" - bez shame, bez komunikatów o porażce
- "Nowy start" - pozytywne framing
- "Pacjent zero" - akceptacja, że ADHD brain ma swoje dni

#### 5.2.2 Historia Sukcesów jako Tarcza RSD

Rejection Sensitive Dysphoria (RSD) to ekstremalna wrażliwość na odrzucenie u osób z ADHD.

**Solution:**
- Archiwum wszystkich ukończonych zadań
- Visual proof: "Zrobiłeś X zadań w tym miesiącu"
- Counter-act negatywnej samooceny

#### 5.2.3 Dopaminowe Milestones

- Co 10 ukończonych zadań: mała animacja
- Co 50: "cyberpunk badge"
- Sesja 25/5 ukończona: gratulacje, nie guilt

### 5.3 Kryteria Akceptacji

- [ ] Brak shame language w UI
- [ ] Reset streak bez potwierdzenia (1-click)
- [ ] Historia sukcesów zawsze dostępna (visual proof)
- [ ] Animacje < 2 sekundy (nie blokują flow)
- [ ] Opcja wyłączenia gamification dla użytkowników, którzy tego nie chcą

---

## 6. Mapa Czasowa (Timeline)

```
2026-Q2          2026-Q3          2026-Q4          2027+
   │                │                │               │
   ▼                ▼                ▼               ▼
┌──────┐      ┌──────────┐     ┌──────────┐    ┌──────────┐
│ FAZA │      │   FAZA   │     │   FAZA   │    │   FAZA   │
│  1   │──────►    2     │────►│  2 (CD)  │───►│    3     │
│ MVP  │      │ Sync Dev │     │ Sync Rel │    │   Fun    │
└──────┘      └──────────┘     └──────────┘    └──────────┘
   │                │                │               │
   ✅               📋               📋              🔮
(Local-First)  (Multi-Device)  (Stabilization)  (Gamification)
```

---

## 7. Decyzje Strategiczne

| Decyzja | Uzasadnienie |
|---------|--------------|
| **Local-first** | Zero bariery wejścia (brak rejestracji), maksymalna prywatność |
| **Opt-in sync** | Nie wymuszamy zależności zewnętrznych |
| **ADHD-proof gamification** | Compassion over productivity, bez guilt-tripping |
| **CRDT over REST** | Offline-first, conflict resolution bez server-side logic |
| **No AI/ML** | Redukcja complexity, brak zależności od zewnętrznych API |

---

## 8. Powiązane Dokumenty

- `docs/business/goals.md` - Cele biznesowe i User Journey
- `docs/business/glossary.md` - Terminologia projektowa
- `docs/plans/01_strategy/02_pre_mortem_audit.md` - Audyt ryzyka i scenariusze porażki
- `docs/architecture/adr/adr_005_pwa_offline_first.md` - Decyzja architektoniczna PWA
