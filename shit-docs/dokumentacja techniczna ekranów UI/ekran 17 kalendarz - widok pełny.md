Jako Senior UI/UX Engineer przygotowałem pełną inżynierię wsteczną oraz specyfikację techniczną dla **Ekranu 17 Kalendarz - widok pełny** (Strona 4 pliku **PDF**). Jest to najbardziej złożony widok analityczny systemu, który łączy dane historyczne (zielona heatmapa) z planami (fioletowa heatmapa) w jednej, zintegrowanej siatce.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Done Accent** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `bg-[#39FF14]` |
| **Plan Accent** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `bg-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Grid Gap** | 2px | `gap-[2px]` |

---

## 2. Specyfikacja Ekranu 17 Kalendarz - widok pełny (ID 179:317)

### A. Layout & Grid (Zintegrowany)

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Navigation Back** | `p-0` | `mb-4` | `flex items-center` |
| **Dual Stats Hero** | `px-4 py-5` | `mb-6` | `grid grid-cols-2 gap-4` |
| **Full Calendar Grid** | `p-0` | `mb-6` | `grid-cols-7 gap-[2px]` |
| **Legend Footer** | `px-4 py-4` | `fixed bottom-24` | `flex flex-col gap-3` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Przycisk *< Pulpit*** | 14px | 600 (SemiBold) | 100% | `#39FF14` |
| **Nagłówek Miesiąca** | 20px | 700 (Bold) | 100% | `#FFFFFF` |
| **Duża Statystyka** | 28px | 800 (ExtraBold) | 100% | Green/Purple |
| **Etykieta Statystyk** | 10px | 600 (SemiBold) | 120% | `#B0B0B0` (Caps) |
| **Dzień Tygodnia** | 11px | 600 (SemiBold) | 100% | `#B0B0B0` |
| **Data w komórce** | 13px | 700 (Bold) | 100% | `#FFFFFF` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Dual Hero Card** | 1px solid `#1A1A1A` | `None` | Dyskretna separacja statystyk |
| **Komórka *Mixed*** | `None` | `None` | Podział tła (Linear Gradient) |
| **Aktywny Dzień** | 2px solid `#FFFFFF` | `0 0 10px #FFFFFF` | Biały obrys (High Focus) |
| **Glow Legendy** | `None` | `0 0 8px [Color]` | Subtelny blask przy próbkach koloru |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Header Nawigacji *Full Access*

- **Struktura**: Przycisk powrotu do Pulpitu (01) po lewej, centralny selektor miesiąca (np. ***MAJ** **2026***).
- **Interakcja**: Powrót do **01 Pulpit** z zachowaniem stanu scrolla.

### 2. Karta Podwójnych Statystyk (Dual Stats Hero)

- **Budowa**: Dwie sekcje przedzielone pionową linią (Opacity 10%).
- **Lewa (Green)**: ***ZREALIZOWANE**: **157***.
- **Prawa (Purple)**: ***ZAPLANOWANE**: 42*.

- **Logika**: Agreguje dane historyczne i przyszłe dla całego widocznego miesiąca.

### 3. Zintegrowana Komórka Kalendarza (Hybrid Cell)

To najbardziej zaawansowany komponent UI w FocusFlow. Obsługuje 3 stany wizualne:

1. **Stan Historyczny (Green)**: Nasycenie zielenią zależne od `doneCount`.
2. **Stan Planowany (Purple)**: Nasycenie fioletem zależne od `plannedCount` (dotyczy dni przyszłych).
3. **Stan Mieszany (Hybrid)**: Dzień, który ma już zrealizowane zadania (np. rano) i ma zaplanowane kolejne (np. wieczorem).
- **Wizualnie**: Tło komórki dzielone diagonalnie (`linear-gradient(135deg, #**39FF14** 50%, #**A020F0** 50%)`) lub kropka indykatora planu na tle historycznej zieleni.

### 4. Legenda Heatmapy

- **Lokalizacja**: Na dole, nad Tab Barem.
- **Struktura**: Dwa rzędy próbek kolorystycznych (skala 1-4) z etykietami *Zrobione* i *Zaplanowane*.

---

**Wytyczne dla Lead Developera:**

- **Zarządzanie Stanem**: Ekran musi subskrybować dwa oddzielne strumienie danych: `TaskHistory` i `TaskFuture`.
- **Diagonalna Renderacja**: Dla dni *mieszanych* (np. dzisiaj) użyj **CSS**: `background: linear-gradient(135deg, var(--green-level) 50%, var(--purple-level) 50%)`.
- **Interakcja**: Każde kliknięcie w dzień otwiera **Ekran 11 Aktywność dnia** z filtrem na dany ID daty.
- **Tab Bar**: Aktywna ikona **Kalendarz** (pozycja 4) w kolorze fioletowym (`#**A020F0**`) z neonowym indykatorem pod spodem.

Czy chcesz, abym teraz opracował specyfikację dla **Ekranu 18 Dodaj Zadanie** (Strony 1, 2, 3 **PDF**), który zawiera formularze dla różnych kategorii?