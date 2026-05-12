Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 20 Do zrobienia dzisiaj** (Strona 21 pliku **PDF**). Jest to widok operacyjny, który agreguje wszystkie zadania zaplanowane na bieżący dzień, pochodzące z modułów planowania (Nawyki, Projekty, Inne), umożliwiając ich szybki podgląd i egzekucję.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Today Green** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Planning Purple** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Pill Radius** | 50px | `rounded-full` |

---

## 2. Specyfikacja Ekranu 20 Do zrobienia dzisiaj (ID 2:11)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Back Navigation** | `p-0` | `mb-2` | `None` |
| **Header Section** | `p-0` | `mb-6` | `space-y-1` |
| **Task List** | `p-0` | `mt-4` | `flex flex-col gap-3` |
| **Empty State Area** | `px-10` | `my-auto` | `text-center space-y-4` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Przycisk Powrotu** | 14px | 600 (SemiBold) | 100% | `#A020F0` |
| **Tytuł *DO ZROBIENIA...*** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Licznik zadań** | 14px | 400 (Regular) | 100% | `#B0B0B0` |
| **Nazwa Zadania (Pill)** | 14px | 600 (SemiBold) | 120% | `#FFFFFF` |
| **Tag Kategorii** | 10px | 700 (Bold) | 100% | `#39FF14` (Caps) |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Task Pill** | 1.5px solid `#39FF14` | `0 0 10px rgba(57, 255, 20, 0.2)` | Zielony obrys (akcja na dzisiaj) |
| **Back Button Pill** | 1px solid `#A020F0` | `None` | Fioletowy obrys (moduł planowania) |
| **Active Task Glow** | 2px solid `#39FF14` | `0 0 15px #39FF14` | Stan po wybraniu / Focus |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Przycisk Powrotu *< Centrum planowania*

- **Wizualnie**: Mała pigułka z fioletowym obrysem i strzałką w lewo.
- **Interakcja**: Powrót do **Ekranu 06 Centrum Planowania**.

### 2. Nagłówek Listy

- **Struktura**: Tytuł *DO **ZROBIENIA** **DZISIAJ*** + dynamiczna liczba zadań (np. *Masz 6 zaplanowanych kroków*).

### 3. Pigułka Zadania na Dzisiaj (Today Task Pill)

- **Budowa**: Tag Kategorii (np. `[**PROJEKT**]`) -> Nazwa Zadania -> Ikona akcji (np. *▶* lub Checkbox).
- **Logika**: Wyświetla zadania, dla których `scheduledDate === today`.
- **Interakcja**:
- Kliknięcie *▶* przenosi do **Ekranu 04 Timer**.
- Kliknięcie w nazwę zadania otwiera podgląd w **Ekranie 22** lub **28** (jeśli to projekt).

### 4. Pusty Stan (Empty State)

- **Wizualnie**: Centralnie umieszczony tekst: "Twój dzisiejszy plan jest czysty. Może warto coś zaplanować?* + przycisk ***PRZEJD**Ź DO **KALENDARZA**".

---

**Wytyczne dla Lead Developera:**

- **Filtracja**: Widok jest wirtualną agregacją. Musi zbierać dane z `state.tasks` (Quadrant II/**III**) oraz `state.habits`.
- **Sortowanie**: Najpierw zadania z przypisaną konkretną godziną (chronologicznie), następnie zadania typu *Cały dzień*.
- **Tab Bar**: Aktywna ikona **Pulpit** (Home) w kolorze `#**39FF14**` z neonowym indykatorem pod spodem, mimo że jest to sub-ekran Centrum Planowania (zgodnie z nawigacją logiczną).

Czy chcesz, abym teraz przygotował specyfikację dla kolejnego sub-ekranu planowania – **Ekranu 21 Nawyki** (Strona 28 **PDF**)?