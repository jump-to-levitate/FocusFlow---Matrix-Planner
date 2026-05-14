# FocusFlow – Progressive Web App (PWA) & Mobile UX

## 1. Architektura PWA
Aplikacja została zaprojektowana jako Progressive Web App, co pozwala na jej instalację na urządzeniach mobilnych (iOS, Android) oraz desktopach, oferując doświadczenie zbliżone do aplikacji natywnej.

### Konfiguracja Techniczna
- **Vite PWA Plugin:** Zarządza generowaniem Service Workera i manifestu.
- **Tryb Wyświetlania:** `standalone` (brak pasków przeglądarki).
- **Orientacja:** Wymuszony `portrait` (pionowa), zoptymalizowana pod smartfony.
- **Theme Color:** `#0f172a` (spójny z tłem aplikacji dla płynnego przejścia UI).

## 2. Optymalizacje Mobile-First (Touch-Friendly)

### Interakcje Dotykowe
- **Target Size:** Wszystkie elementy interaktywne (przyciski, linki, pigułki) mają minimalny rozmiar **44x44px**, zgodnie z wytycznymi Apple i Google dotyczącymi dostępności.
- **Brak Hover:** Logika UI nie polega na stanach `hover` (niedostępnych na dotyk). Wykorzystywany jest `active state` oraz long-press.
- **Long Press (Sekcja 5 Specyfikacji):** Kluczowy mechanizm wywoływania Context Menu (≥500ms).
- **Gest Powrotu:** Obsługa natywnych gestów przeglądarki/systemu.

### Wydajność i UX
- **Overscroll Behavior:** Zablokowano "pull-to-refresh" (`overscroll-behavior-y: contain`), aby uniknąć przypadkowego odświeżania podczas przewijania list zadań.
- **Fast Click:** Usunięto 300ms opóźnienie kliknięcia (`touch-action: manipulation`).
- **Pamięć Lokalna:** Wykorzystanie IndexedDB zapewnia działanie offline i błyskawiczny dostęp do danych bez oczekiwania na sieć.

## 3. Instalacja
Użytkownik może dodać aplikację do ekranu głównego poprzez opcję "Dodaj do ekranu głównego" (Chrome/Android) lub "Do ekranu początkowego" (Safari/iOS).
