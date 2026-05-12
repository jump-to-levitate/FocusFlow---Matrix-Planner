Jako Senior UI/UX Engineer przygotowałem pełną specyfikację techniczną dla **Ekranu 04 Timer** (Strona 6 pliku **PDF**). Ten ekran jest krytyczny dla stanu *Flow* użytkownika, dlatego inżynieria wsteczna skupia się na czytelności centralnego licznika i hierarchii przycisków sterujących.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Primary Accent** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Secondary Accent** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface** | `#121212` | `bg-[#121212]` |
| **Timer Stroke** | 8px | `border-[8px]` |

---

## 2. Specyfikacja Ekranu 04 Timer (ID 2:5)

### A. Layout & Grid

| Sekcja | Padding (In) | Margin (Out) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-12 pb-24` | `0 auto` | `space-y-8` |
| **Task Header** | `p-0` | `mb-6` | `space-y-2` |
| **Mode Selector Grid** | `p-0` | `mb-10` | `gap-2` |
| **Central Timer Hub** | `p-10` | `my-auto` | `flex-col items-center` |
| **Stats Footer** | `px-4 py-2` | `mb-4` | `justify-between` |

### B. Typography (Reverse Engineered)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| ***PRACUJESZ NAD:*** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Caps) |
| **Task Pill Name** | 16px | 700 (Bold) | 120% | `#FFFFFF` |
| **Main Clock (16:43)** | 64px | 800 (ExtraBold) | 100% | `#FFFFFF` |
| ***SESJA PRACY*** | 14px | 500 (Medium) | 120% | `#FFFFFF` |
| **Mode Label (Pills)** | 13px | 600 (SemiBold) | 100% | `#FFFFFF` |
| **Stats Label** | 11px | 400 (Regular) | 100% | `#B0B0B0` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Stan |
| --- | --- | --- | --- |
| **Main Timer Ring** | 8px solid `#121212` | `0 0 20px rgba(160, 32, 240, 0.1)` | Idle / Background |
| **Active Mode Pill** | None (Fill) | `0 0 12px #A020F0` | Active |
| **Pause Button** | 2px solid `#A020F0` | `0 4px 15px rgba(160, 32, 240, 0.4)` | Default |
| **Project Note Pill** | 1px solid `#39FF14` | `0 0 8px rgba(57, 255, 20, 0.3)` | Outline style |
| **Progress Dot** | None (Circle) | `0 0 8px #39FF14` | Completed Cycle |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Selektor Trybu (Timer Modes)

- **Główny Segment:** Dwie duże pigułki (25/5 Klasyk, 50/10 Głęboki).
- **Custom Pills:** Rząd 5 małych pigułek (5/0 do 90/15) z fioletowym obrysem.
- **Zachowanie:** Kliknięcie zmienia czas bazowy sesji i resetuje kółko postępu.

### 2. Centralny Hub Focusa (The Circle)

- **Wizualnie:** Duży okrągły kontener z dynamicznym obramowaniem (**SVG** stroke-dasharray) reprezentującym upływ czasu.
- **Wskaźniki:** Pod zegarem znajdują się 4 kropki – puste (szare) lub zapełnione (zielone), wskazujące numer cyklu Pomodoro.

### 3. Panel Akcji (Primary Controls)

- ****PAUZA**:** Fioletowa pigułka o wysokim kontraście.
- **Zakończ sesję:** Tekstowy przycisk (link-style) poniżej pauzy, wyzwalający logikę przedwczesnego zakończenia sesji.

### 4. Pasek Statystyk *Dzisiaj*

- **Lokalizacja:** Umieszczony bezpośrednio nad Tab Barem.
- **Dane:** Pobiera `totalFocusTimeToday` oraz `dopamineStreakCount`.
- **Styl:** Cienka linia oddzielająca (Separator `#**FFFFFF**` opacity 10%).

---

**Wytyczne dla Lead Developera:** Implementacja zegara musi opierać się na `requestAnimationFrame` dla płynnego odliczania milisekund w tle, nawet jeśli UI wyświetla tylko minuty i sekundy. Pigułka *Notatka do projektu* (28) musi przekazywać `taskId` w celu zachowania kontekstu notatki dla konkretnego zadania. Tab Bar na tym ekranie musi mieć aktywną ikonę Zegara (kolor `#**39FF14**`) z neonową kropką indykatora.