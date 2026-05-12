# FocusFlow – Backlog Sprintu 05: Visual Overhaul & PWA

**Identyfikator Sprintu:** S05 [cite: FocusFlow-Roadmapa-MVP.md]
**Nazwa:** Finalizacja: Visual Overhaul, Kalendarz i Technologia PWA [cite: FocusFlow-Roadmapa-MVP.md]
**Status:** ZAPLANOWANE / WDROŻENIE KOŃCOWE [cite: FocusFlow-Roadmapa-MVP-v1.2.md]

---

## 1. Cele Sprintu

### Cel Biznesowy
Dostarczenie produktu o wysokim standardzie wizualnym ("Premium Feel"), który jest w pełni funkcjonalny w trybie offline i gotowy do instalacji na urządzeniach mobilnych [cite: FocusFlow-Roadmapa-MVP.md]. Zapewnienie użytkownikowi narzędzi do długofalowego planowania (Kalendarz) oraz zarządzania złożonymi projektami (Notatnik Projektowy) [cite: FocusFlow-Roadmapa-MVP.md].

### Cel Techniczny
Masowa aplikacja standardów UI V2 do całego ekosystemu 33 ekranów, wdrożenie Service Workera dla wsparcia PWA oraz optymalizacja wydajności (Lighthouse score >= 90) [cite: FocusFlow-Roadmapa-MVP-v1.2.md, FocusFlow-Roadmapa-MVP.md].

---

## 2. Zakres Prac (User Stories & Tasks)

### 2.1. Visual Overhaul & Style Guide V2
* **Zadanie 5.1:** Mass UI Update – aplikacja wytycznych `UI_STYLE_GUIDE.md` (Neon Glow, obrysy kwadrantów, czcionka Comfortaa) do wszystkich komponentów [cite: FocusFlow-Roadmapa-MVP-v1.2.md, FocusFlow-Roadmapa-MVP.md].
* **Zadanie 5.2:** Implementacja płynnych animacji przejść (`transition-all`) oraz efektów `slide-out` dla akcji ukończenia zadań na każdym ekranie [cite: FocusFlow-Roadmapa-MVP.md].

### 2.2. Moduły Planowania i Projektów
* **Zadanie 5.3:** Budowa Ekranów 16/17 (Kalendarz) – widok miesięczny z heatmapą aktywności (zrobione/zielone, planowane/fioletowe) [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Roadmapa-MVP-v1.2.md].
* **Zadanie 5.4:** Implementacja Ekranu 28 (Notatnik Projektowy) – dedykowany widok dla "Wielkich Projektów" z obsługą mikro-kroków i zasobów [cite: FocusFlow-Roadmapa-MVP.md].
* **Zadanie 5.5:** Budowa Ekranu 06 (Centrum Planowania) – centralny hub nawigacyjny typu "Hub & Spoke" [cite: FocusFlow-Roadmapa-MVP.md].

### 2.3. Mobile & Sync (PWA)
* **Zadanie 5.6:** Konfiguracja `vite-plugin-pwa` – manifest, ikony (192/512) oraz Service Worker z trybem `offline-first` [cite: FocusFlow-Roadmapa-MVP.md, FocusFlow-Roadmapa-MVP-v1.2.md].
* **Zadanie 5.7:** Wdrożenie Ekranu Onboardingu – 3-slajdowy samouczek dla nowych użytkowników z zapamiętywaniem stanu w `localStorage` [cite: FocusFlow-Roadmapa-MVP.md].
* **Zadanie 5.8:** Implementacja `BroadcastChannel` – synchronizacja danych między otwartymi zakładkami przeglądarki w czasie rzeczywistym [cite: FocusFlow-Roadmapa-MVP.md].

---

## 3. Inwentarz Plików (Artifacts)

| Plik | Status | Odpowiedzialny Agent |
| :--- | :--- | :--- |
| `src/pages/Kalendarz.tsx` | Nowy | Lead Developer / UX [cite: FocusFlow-Roadmapa-MVP.md] |
| `src/pages/Notatnik.tsx` | Nowy | IT Architect / Lead Dev [cite: FocusFlow-Roadmapa-MVP.md] |
| `src/pages/Onboarding.tsx` | Nowy | UX Designer [cite: FocusFlow-Roadmapa-MVP.md] |
| `vite.config.ts` (PWA) | Edytowany | IT Architect [cite: FocusFlow-Roadmapa-MVP.md] |
| `src/store/events.ts` (Sync) | Edytowany | IT Architect [cite: FocusFlow-Roadmapa-MVP.md] |

---

## 4. Ograniczenia i Założenia Techniczne
* **Design Consistency:** Każdy ekran musi być wizualnie zgodny z "Pulpitem V2" – zakaz używania kolorów spoza zdefiniowanej palety neonowej [cite: FocusFlow-Roadmapa-MVP-v1.2.md].
* **Offline Readiness:** Aplikacja musi poprawnie renderować dane z IndexedDB nawet przy całkowitym braku dostępu do sieci [cite: FocusFlow-Roadmapa-MVP.md].
* **Performance:** Finalny build nie może przekraczać 500 KB (vendor bundle), aby zapewnić szybkie ładowanie na urządzeniach mobilnych [cite: FocusFlow-Roadmapa-MVP.md].

---

## 5. Definition of Done (DoD) dla Sprintu 05
- [ ] Wynik audytu Lighthouse PWA wynosi >= 90 [cite: FocusFlow-Roadmapa-MVP.md].
- [ ] Aplikacja pomyślnie instaluje się na urządzeniu mobilnym (Add to Home Screen) [cite: FocusFlow-Roadmapa-MVP.md].
- [ ] Heatmapa w kalendarzu poprawnie wizualizuje intensywność pracy z ostatnich 30 dni [cite: FocusFlow-Roadmapa-MVP.md].
- [ ] Zmiana statusu zadania w jednej zakładce jest widoczna w drugiej bez odświeżania strony [cite: FocusFlow-Roadmapa-MVP.md].

---
*Dokument zatwierdzony przez Managera Projektu.* [cite: FocusFlow-Roadmapa-MVP-v1.2.md]