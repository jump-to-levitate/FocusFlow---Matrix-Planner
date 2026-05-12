Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 21 Nawyki** (Strona 28 pliku **PDF**). Ten widok zarządza rutynami użytkownika (tzw. „pętlami”), kładąc nacisk na wizualizację passy (streak) oraz łatwe uruchomienie sesji skupienia dla powtarzalnych zadań.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Habit Streak** | `#39FF14` (Neon Green) | `text-[#39FF14]` |
| **Action Purple** | `#A020F0` (Neon Purple) | `border-[#A020F0]` / `text-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Pill Radius** | 50px | `rounded-full` |

---

## 2. Specyfikacja Ekranu 21 Nawyki (ID 2:12)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Back Navigation** | `p-0` | `mb-2` | `None` |
| **Header Row** | `p-0` | `mb-6` | `space-y-1` |
| **Habit List** | `p-0` | `mt-4` | `flex flex-col gap-4` |
| **Habit Card (Pill)** | `px-6 py-4` | `w-full` | `justify-between items-center` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Przycisk Powrotu** | 14px | 600 (SemiBold) | 100% | `#A020F0` |
| **Tytuł *TWOJE NAWYKI*** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Licznik pętli** | 14px | 400 (Regular) | 100% | `#B0B0B0` |
| **Nazwa Nawyku** | 16px | 600 (SemiBold) | 120% | `#FFFFFF` |
| **Streak (np. 12 dni)** | 12px | 700 (Bold) | 100% | `#39FF14` |
| **CTA: START FOCUS** | 12px | 800 (ExtraBold) | 100% | `#000000` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Habit Pill** | 1.5px solid `#A020F0` | `0 0 10px rgba(160, 32, 240, 0.2)` | Fioletowy obrys modułu planowania |
| **Back Button** | 1px solid `#A020F0` | `None` | Spójność z nawigacją Centrum |
| **Start Focus BTN** | None (Fill `#39FF14`) | `0 4px 12px #39FF14` | Akcja wyzwalająca (Green Glow) |
| **Streak Icon** | None | `0 0 8px #39FF14` | Ikona ognia/pętli z blaskiem |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Przycisk Powrotu *< Centrum planowania*

- **Styl**: Fioletowa pigułka (Outline) wyrównana do lewej.
- **Interakcja**: Powrót do **Ekranu 06 Centrum Planowania**.

### 2. Karta Nawyku (Habit Loop Pill)

- **Budowa**: Nazwa Nawyku (Left) -> Statystyka Streaku (Center) -> Przycisk ***START** **FOCUS*** (Right).
- **Dane**: Wyświetla encje z `state.tasks` o `Category: 'Habit'`.
- **Streak**: Licznik dni pod rząd pobierany z `task.streakCount`.

### 3. Przycisk *START FOCUS*

- **Styl**: Mała zielona pigułka wewnątrz karty nawyku, czarny tekst.
- **Logika**: Natychmiastowe uruchomienie **Ekranu 04 Timer** dla wybranego nawyku.

---

**Wytyczne dla Lead Developera:**

- **Logika Listy**: Wyświetlaj tylko aktywne nawyki (`isDone: false` dla dzisiejszej instancji lub zadania cykliczne).
- **Animacja Progresu**: Przy kliknięciu ***START** **FOCUS*** pigułka powinna wykonać mikro-skalowanie (`scale-95`), a następnie przejść do Timera z przekazaniem parametru `habitId`.
- **Tab Bar**: Aktywna ikona **Pulpit** (Home) w kolorze `#**39FF14**` z neonową kropką pod spodem (zgodnie z logiką sub-ekranów Centrum Planowania).

Czy przygotować teraz specyfikację dla **Ekranu 22 Wielkie Projekty** (Strona 32 **PDF**), który zawiera unikalny moduł notatnika projektowego?