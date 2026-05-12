Jako Senior UI/UX Engineer przeprowadziłem inżynierię wsteczną **Ekranu 15 Kalendarz - zrobione** (Strona 4 pliku **PDF**). Ten widok typu *heatmap* jest kluczowy dla wizualizacji długoterminowej skuteczności użytkownika, wykorzystując progresywne nasycenie zieleni do reprezentowania intensywności ukończonych zadań.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Primary Accent** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `bg-[#39FF14]` |
| **Today Indicator** | `#A020F0` (Neon Purple) | `border-[#A020F0]` |
| **Heatmap Level 1** | `#1A331A` (dimGreen) | `bg-[#1A331A]` |
| **Heatmap Level 4** | `#39FF14` (neonGreen) | `bg-[#39FF14]` |

---

## 2. Specyfikacja Ekranu 15 Kalendarz - zrobione (ID 179:317)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Month Navigation** | `p-0` | `mb-4` | `justify-between items-center` |
| **Hero Card (Stats)** | `px-4 py-5` | `mb-6` | `items-center gap-4` |
| **Calendar Grid** | `p-0` | `mb-6` | `grid-cols-7 gap-1` |
| **Footer Stats** | `px-4 py-4` | `fixed bottom-24` | `flex justify-between` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Nawigacja Miesiąca** | 18px | 700 (Bold) | 100% | `#FFFFFF` |
| **Hero Number (157)** | 32px | 800 (ExtraBold) | 100% | `#39FF14` |
| **Dzień Tygodnia** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Caps) |
| **Dzień Miesiąca (Grid)** | 14px | 700 (Bold) | 100% | `#FFFFFF` / `#000000` (Contrast) |
| **Licznik pod Dniem** | 10px | 500 (Medium) | 100% | `#B0B0B0` / `#000000` |
| **Statystyki (Footer)** | 11px | 400 (Regular) | 120% | `#B0B0B0` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Hero Card** | 2px solid `#39FF14` | `0 0 15px rgba(57, 255, 20, 0.3)` | Podświetlenie statystyk miesiąca |
| **Dzisiejszy Dzień (9)** | 2px solid `#A020F0` | `None` | Fioletowy obrys dla daty `today` |
| **Heatmap Cell** | 1px solid `#121212` | `None` | Separacja dni w siatce |
| **Gradient Legend** | `None` | `None` | 5-stopniowa skala nasycenia zieleni |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Header Nawigacyjny Miesiąca

- **Struktura**: Pigułka powrotu *< Raporty* (lewa) + Selektor *‹ Maj **2026** ›* (centrum).
- **Interakcja**: Kliknięcie strzałek zmienia zakres dat i odświeża `HeatmapData`.

### 2. Karta Hero *Zadań ukończonych*

- **Wizualnie**: Zielony obrys, ikona ✓, duży licznik *157*.
- **Logika**: Sumuje wszystkie zadania z `isDone: true` dla bieżącego miesiąca z kwadrantów I, II i **III**.

### 3. Siatka Kalendarza (Heatmap Grid)

- **Struktura**: 7 kolumn (Pn-Nd). Dni z poprzedniego/następnego miesiąca są wygaszone (ciemnoszare).
- **Algorytm Koloru**: Kolor tła komórki zmienia się progresywnie:
- **0 zadań**: `#**121212**` (Surface).
- **1-3 zadania**: `dimGreen`.
- **4-7 zadań**: `mediumGreen`.
- **8-11 zadań**: `brightGreen`.
- **12+ zadań**: `neonGreen`.

- **Licznik**: Mała liczba pod dniem (np. *6*, *11*, *14*) wskazuje dokładną ilość zadań zrealizowanych tego dnia.

### 4. Panel Statystyk Zbiorczych

- **Elementy**: *Najlepszy 8 maja* (z liczbą zadań 14), *Średnio 8 zadań/dzień*, *Aktywnych 9 z 9 dni*.
- **Interakcja**: Kliknięcie w dowolny dzień w siatce przenosi do **Ekranu 11 Aktywność dnia**.

---

**Wytyczne dla Lead Developera:**

- **Kontrast Tekstu**: Implementacja logiki zmiany koloru tekstu daty na czarny (`#**000000**`) przy najciemniejszych (najbardziej nasyconych) odcieniach zieleni, aby zachować czytelność.
- **Dane**: Widok musi asynchronicznie pobierać dane za pomocą endpointu `**GET** /reports/heatmap?month=**2026**-05`.
- **Tab Bar**: Aktywna ikona **Kalendarz** (pozycja 4) w kolorze fioletowym (`#**A020F0**`) z neonowym indykatorem pod spodem.