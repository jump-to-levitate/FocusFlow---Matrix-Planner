# FocusFlow – Briefing Zespołu AI: Sprint 05

**Identyfikator Sprintu:** S05
**Faza:** Finalizacja: Visual Overhaul, Kalendarz i Technologia PWA
**Data wydania dyrektyw:** 01.06.2026

---

## 1. Product Owner & Business Strategist
**Priorytet:** Budowa wizerunku produktu "Premium" oraz zapewnienie retencji użytkownika.

* **Dyrektywa:** Każdy z 33 ekranów musi emanować spójnością i wysoką jakością wykonania. FokusFlow musi przestać wyglądać jak narzędzie deweloperskie, a zacząć jak produkt komercyjny.
* **Decyzja:** Wprowadzamy pełną obsługę PWA, aby umożliwić użytkownikom dostęp do planera bezpośrednio z pulpitu telefonu, bez konieczności otwierania przeglądarki.
* **KPI:** Wynik Lighthouse PWA na poziomie >= 90 oraz 100% pozytywnych testów synchronizacji międzyzakładkowej.

---

## 2. UX Designer (Specjalista ADHD)
**Priorytet:** Spójność estetyczna V2 i eliminacja tarcia przy pierwszym kontakcie.

* **Zadanie:** Nadzoruj masową aktualizację interfejsu (Visual Overhaul) oraz zaprojektuj onboarding.
* **Wymagania UX:**
    * **Heatmapa (17):** Intensywność kolorów w kalendarzu musi być intuicyjna – zielony (ukończone) i fioletowy (zaplanowane) z gradacją opacity 0.1-1.0.
    * **Style Guide V2:** Pilnuj neonowego blasku (glow) oraz czcionki Comfortaa na każdym elemencie UI.
    * **Onboarding:** 3 proste slajdy tłumaczące filozofię "Brain Dump" i "Macierzy", eliminujące lęk przed nowym narzędziem.

---

## 3. IT Architect & Data Modeler
**Priorytet:** Niezawodność offline i synchronizacja stanów w czasie rzeczywistym.

* **Zadanie:** Skonfiguruj środowisko PWA oraz wdróż mechanizm `BroadcastChannel`.
* **Logika Danych:**
    * **Synchronizacja:** Każda mutacja w IDB musi być rozgłaszana przez `BroadcastChannel`, aby inne otwarte zakładki mogły natychmiast odświeżyć widok bez refreshu.
    * **Notatnik Projektowy:** Opracuj strukturę zapisu mikro-kroków i zasobów (linki/pliki jako Bloby w IDB) dla Wielkich Projektów.
    * **PWA:** Przygotuj manifest i Service Workera wspierającego agresywne cachowanie zasobów.

---

## 4. Lead Developer (Implementation Engine)
**Priorytet:** Implementacja widoków zaawansowanych i optymalizacja wydajności.

* **Zadanie:** Zbuduj ekrany Kalendarza, Notatnika Projektowego oraz Onboardingu.
* **Implementacja:**
    * Wdróż masowe zmiany stylów CSS w całym projekcie (transition-all, neon borders).
    * Zintegrować `vite-plugin-pwa` z procesem budowania aplikacji.
    * Zaimplementuj "Centrum Planowania" jako centralny hub nawigacyjny w układzie Hub & Spoke.
* **Technologia:** Utrzymaj rozmiar paczki vendor bundle poniżej 500 KB poprzez code-splitting (React.lazy).

---

## 5. QA & Logic Auditor
**Priorytet:** Audyt standardów PWA i weryfikacja spójności wizualnej.

* **Zadanie:** Przeprowadź finałowy audyt techniczny produktu przed wydaniem wersji MVP.
* **Scenariusze testowe:**
    * **Test Offline:** Wyłącz dostęp do internetu w DevTools. Czy aplikacja nadal ładuje wszystkie widoki i pozwala na dodawanie zadań?
    * **Test Heatmapy:** Dodaj 10 zadań w jednym dniu i 1 w drugim. Czy intensywność koloru w kalendarzu poprawnie odzwierciedla tę różnicę?
    * **Test Lighthouse:** Uruchom audyt Lighthouse. Czy parametry PWA i Accessibility są powyżej 90?
    * **Test Sync:** Otwórz dwie zakładki. Oznacz zadanie jako zrobione w pierwszej. Czy w drugiej zniknęło natychmiastowo?

---
*Briefing zatwierdzony przez Managera Projektu.*