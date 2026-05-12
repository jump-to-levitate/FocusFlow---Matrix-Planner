# PLAN: UI Rollback & Logic Merge

## Cel
Przywrócenie estetyki mobile-first (v5173) przy zachowaniu logiki reaktywnego store'a (v517).

## Zakres
- Refaktoryzacja AppShell.tsx
- Refaktoryzacja Macierz.tsx
- Modyfikacja index.css
- Blokada szerokości kontenera na max-w-[480px]

## Kroki Implementacji

### 1. Ustalenie stałych szerokości
- Kontener: max-w-[480px] mx-auto
- Padding: redukcja do 12px
- Gap: 8px dla małych ekranów

### 2. Redukcja paddingów/gapów
- AppShell: usunięcie szerokich paddingów
- Macierz: kompaktowy układ kart

### 3. Weryfikacja subskrypcji emitTaskUpdated
- Zapewnienie emitTaskUpdated() po notify()
- Test Timer start bez odświeżania

## Kryteria Akceptacji
1. Layout wygląda identycznie jak w pierwotnym prototypie (mobile-first)
2. Timer startuje bez odświeżania
3. Reaktywność store działa poprawnie
4. Aplikacja wyśrodkowana na desktopie z formatem telefonu