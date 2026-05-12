Jako Senior UI/UX Engineer przeprowadziłem inżynierię wsteczną **Ekranu 09 Raporty** (Strona 14 pliku **PDF**). Jest to ekran analityczny, który wizualizuje postępy użytkownika, wykorzystując wysokokontrastowe wykresy i kafelki statystyczne, aby wzmacniać pętlę dopaminową poprzez widoczny progres.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Primary Green** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Primary Purple** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Card** | `#121212` | `bg-[#121212]` |
| **Bar Background** | `#1A1A1A` | `bg-[#1A1A1A]` |

---

## 2. Specyfikacja Ekranu 09 Raporty (ID 2:10)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-28` | `0 auto` | `space-y-6` |
| **Hero Card (Streak)** | `px-6 py-5` | `mb-2` | `justify-between items-center` |
| **Chart Container** | `px-4 py-6` | `mb-4` | `items-end gap-2` |
| **Stats Grid (2x2)** | `p-0` | `mb-6` | `gap-3` |
| **History Card** | `px-4 py-4` | `mb-4` | `gap-4 items-center` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł *Raporty*** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Streak Number (12)** | 32px | 800 (ExtraBold) | 100% | `#39FF14` |
| **Nagłówek Sekcji** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Caps) |
| **Wartość Statystyk** | 20px | 700 (Bold) | 100% | `#FFFFFF` |
| **Etykieta Kafelka** | 10px | 500 (Medium) | 120% | `#B0B0B0` |
| **Dni Tygodnia (Pn-Nd)** | 10px | 400 (Regular) | 100% | `#B0B0B0` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Hero Card (Streak)** | 2px solid `#39FF14` | `0 0 15px rgba(57, 255, 20, 0.4)` | Priorytet wizualny (Streak) |
| **Bar (Pn-Pt)** | None | `None` | Kolor `#39FF14` (Zrealizowane cele) |
| **Bar (Sb-Nd)** | None | `None` | Kolor `#A020F0` (Weekend/Plany) |
| **Stats Tile** | 1px solid `#1A1A1A` | `None` | Subtelna separacja kafelków |
| **History Card** | 1.5px solid `#39FF14` | `None` | Interaktywny odnośnik do kalendarza |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Karta Hero *Dni skupienia*

- **Budowa:** Wielki numer (`dopamineStreakCount`) + tekst *Dni skupienia pod rząd!* + ikona chevron *>>>*.
- **Cel:** Natychmiastowa informacja o ciągłości pracy. Kliknięcie prowadzi do szczegółów aktywności.

### 2. Wykres Słupkowy Aktywności

- **Struktura:** 7 słupków o dynamicznej wysokości (proporcjonalnej do liczby zadań).
- **Kolorystyka:** Dni robocze (Pn-Pt) na zielono, weekendy (Sb-Nd) na fioletowo.
- **Interakcja:** Kliknięcie w dowolny słupek kieruje do **Ekranu 11 Aktywność dnia** dla wybranej daty.

### 3. Siatka Kwadrantów (Tydzień / Miesiąc)

- **Układ:** Dwie sekcje 2x2. Każdy kafelek zawiera liczbę ukończonych zadań oraz etykietę ćwiartki (np. ***PILNE** I WAŻNE*).
- **Dane:** Pobierane z `completedTasksByQuadrant` dla okresu `week` i `month`.

### 4. Karta Historii

- **Budowa:** Ikona ✓ w zielonym kółku + *Zrealizowane zadania* + opis *Pełny kalendarz wykonanych zadań* + strzałka.
- **Interakcja:** Przycisk (cała karta) kieruje do **Ekranu 15 Kalendarz - zrobione**.

---

**Wytyczne dla Lead Developera:**

- **Renderowanie Wykresu:** Wysokość słupka powinna być obliczana jako `(tasksCount / maxTasksInWeek) * chartHeight`. Słupki powinny mieć zaokrąglone górne krawędzie (`rounded-t-sm`).
- **Synchronizacja Statystyk:** Kafelki muszą automatycznie inkrementować wartości przy każdej akcji *ZROBIONE* wykonanej w systemie, bez konieczności odświeżania ekranu.
- **Tab Bar:** Na tym ekranie ikona Home (Pulpit) jest aktywna (kolor `#**39FF14**`) z neonową kropką indykatora, zgodnie z mapą nawigacji dla ekranu 09.