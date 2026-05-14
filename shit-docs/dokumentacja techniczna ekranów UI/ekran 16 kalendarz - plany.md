Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 16 Kalendarz - plany** (Strona 27 pliku **PDF**). Ten ekran jest lustrzanym odbiciem ekranu 15, ale zamiast historii (zielony), koncentruje się na przyszłości (fioletowy), wizualizując obciążenie zadaniami zaplanowanymi w kalendarzu.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Primary Accent** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Heatmap Level 1** | `#2D1244` (dimPurple) | `bg-[#2D1244]` |
| **Heatmap Level 4** | `#A020F0` (neonPurple) | `bg-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |

---

## 2. Specyfikacja Ekranu 16 Kalendarz - plany (ID 179:450)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Header Section** | `p-0` | `mb-4` | `justify-between items-center` |
| **Hero Card (Future)** | `px-5 py-4` | `mb-6` | `items-center gap-4` |
| **Calendar Grid** | `p-0` | `mb-6` | `grid-cols-7 gap-1` |
| **Footer Info** | `px-4 py-4` | `fixed bottom-24` | `flex flex-col gap-2` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Przycisk Powrotu** | 14px | 600 (SemiBold) | 100% | `#A020F0` |
| **Tytuł *PLANY*** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Licznik Planów (42)** | 32px | 800 (ExtraBold) | 100% | `#A020F0` |
| **Dni Tygodnia (Header)** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Caps) |
| **Data w komórce** | 14px | 700 (Bold) | 100% | `#FFFFFF` / Contrast |
| **Statystyki pod Gridem** | 12px | 400 (Regular) | 130% | `#B0B0B0` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Hero Card (Future)** | 2px solid `#A020F0` | `0 0 15px rgba(160, 32, 240, 0.3)` | Fokus na nadchodzące zadania |
| **Dzień Dzisiejszy** | 2px solid `#39FF14` | `None` | Zielony obrys (obecność) |
| **Heatmap Cell** | 1px solid `#121212` | `None` | Separacja w fioletowej siatce |
| **Legend Gradient** | `None` | `None` | Skala fioletu: od cienia do neonu |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Header Nawigacyjny

- **Struktura**: Przycisk *< Centrum planowania* (lewa) + Selektor Miesiąca (centrum).
- **Interakcja**: Powrót do **Ekranu 06 Centrum Planowania**.

### 2. Karta Hero *Zaplanowanych*

- **Wizualnie**: Fioletowy obrys, ikona kalendarza (pusta), duży licznik zaplanowanych sesji w tym miesiącu.
- **Logika**: Sumuje wszystkie zadania z `isDone: false` oraz przypisaną `scheduledDate` w wybranym miesiącu.

### 3. Fioletowa Heatmapa (Future Heatmap)

- **Budowa**: Komórki Gridu. Intensywność fioletu (`#**A020F0**`) reprezentuje sumaryczny czas sesji lub liczbę zadań przypisanych do danej daty.
- **Dni wolne**: Jeśli dzień nie posiada zaplanowanych zadań, tło komórki to `bg-[#**121212**]`.
- **Dzień dzisiejszy**: Wyróżniony zielonym obrysem (`#**39FF14**`), co pozwala użytkownikowi szybko zorientować się w osi czasu.

### 4. Sekcja *Twoje najcięższe dni*

- **Opis**: Tekstowy wykaz dat z największym obciążeniem (np. *Środa, 20 maja - 6 sesji*).
- **Interakcja**: Kliknięcie w dowolną datę otwiera **Ekran 11 Aktywność dnia** (widok planów na dany dzień).

---

**Wytyczne dla Lead Developera:**

- **Mechanika Wyboru**: Kliknięcie w dzień, który nie ma jeszcze zadań, powinno otwierać **Ekran 18 Dodaj Zadanie** z pre-definiowaną datą.
- **Fioletowa Skala**: Zdefiniuj 4 poziomy `opacity` dla fioletu (25%, 50%, 75%, **100**%) na podstawie obciążenia, aby uniknąć konieczności definiowania 4 osobnych kodów **HEX**.
- **Tab Bar**: Aktywna ikona **Kalendarz** (pozycja 4) w kolorze fioletowym (`#**A020F0**`) z neonowym indykatorem pod spodem.

Czy przygotować specyfikację dla **Ekranu 17 Kalendarz - widok pełny** (Strona 4 **PDF**)?