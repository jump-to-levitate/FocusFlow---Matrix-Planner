Jako Senior UI/UX Engineer przeprowadziłem inżynierię wsteczną **Ekranu 11 Aktywność dnia** (Strona 13 pliku **PDF**). Jest to szczegółowy widok logów użytkownika, który agreguje zrealizowane i zaplanowane działania z podziałem na cztery kwadranty Eisenhowera dla konkretnej daty.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Accent Green** | `#39FF14` (Q1 & Q2) | `text-[#39FF14]` / `bg-[#39FF14]` |
| **Accent Purple** | `#A020F0` (Q3) | `text-[#A020F0]` / `bg-[#A020F0]` |
| **Accent Gray** | `#4A4A4A` (Q4) | `text-[#4A4A4A]` / `bg-[#4A4A4A]` |
| **Surface Card** | `#121212` | `bg-[#121212]` |

---

## 2. Specyfikacja Ekranu 11 Aktywność dnia (ID 145:188)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Navigation Header** | `p-0` | `mb-4` | `flex gap-3` |
| **Hero Stats Card** | `px-5 py-4` | `mb-6` | `items-center justify-between` |
| **Quadrant Section** | `p-0` | `mb-8` | `space-y-4` |
| **Task Row** | `py-2` | `w-full` | `flex justify-between items-start` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Data (Tytuł)** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Hero Number (14)** | 32px | 800 (ExtraBold) | 100% | `#39FF14` |
| **Nagłówek Sekcji** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Caps) |
| **Tytuł Kwadrantu** | 14px | 700 (Bold) | 110% | `#FFFFFF` |
| **Nazwa Zadania** | 12px | 500 (Medium) | 130% | `#FFFFFF` |
| **Godzina Realizacji** | 11px | 400 (Regular) | 100% | `#B0B0B0` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Hero Card (14)** | 1.5px solid `#39FF14` | `0 0 10px rgba(57, 255, 20, 0.3)` | Podsumowanie sukcesu dnia |
| **Karta Kwadrantu** | `border-l-4` | `None` | Kolor paska akcentu zależy od kwadrantu |
| **Task Separator** | `border-b-[0.5px]` | `None` | Kolor `#FFFFFF` (Opacity 10%) |
| **Nav Button** | 1px solid `#39FF14` | `None` | Zielony obrys dla przycisków powrotu |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Header Nawigacyjny

- **Przyciski:** Dwie pigułki z zielonym obrysem: *< Raporty* oraz *< Kalendarz*.
- **Tytuł:** Dynamiczny tekst wyświetlający dzień tygodnia i datę (np. *Czwartek, 8 maja*).

### 2. Karta Podsumowania (Hero Card)

- **Budowa:** Ikona ✓ w zielonym okręgu + Duża liczba (*14*) + tekst *Zadania ukończone*.
- **Dane:** Reprezentuje sumę wszystkich ukończonych zadań (`isDone: true`) ze wszystkich kwadrantów dla danej daty.

### 3. Listy Kwadrantów (Categorized Tasks)

- **Struktura karty:** Pionowy pasek akcentu po lewej stronie + Tytuł kwadrantu + Licznik zadań.
- **Mapowanie Kolorów:**
- **Pilne i Ważne (I):** Zielony pasek, 5 zadań.
- **Ważne, niepilne (II):** Zielony pasek, 5 zadań.
- **Pilne, nieważne (**III**):** Fioletowy pasek, 3 zadania.
- **Niepilne, nieważne (IV):** Szary pasek, sekcja *Zrobione* vs *Odrzucone*.

### 4. Wiersz Zadania (Task Row)

- **Elementy:** Tekst zadania (z prefixem *v* dla wykonanych) + Godzina (np. *08:15*) po prawej stronie.
- **Stan:** Zadania odrzucone w IV kwadrancie nie posiadają godzin, lecz są wylistowane w podsekcji *Odrzucone*.

---

**Wytyczne dla Lead Developera:**

- **Filtrowanie Danych:** Widok musi filtrować globalną tablicę `tasks` po polu `completedAt` lub `scheduledDate` dopasowanym do ID dnia wybranego z Kalendarza lub Raportów.
- **Renderowanie Warunkowe:** Sekcja IV kwadrantu musi obsługiwać podział na `isDone: true` oraz `isRejected: true` (zadania z popupu 26 lub przycisku *Odrzuć* na ekranie 08).
- **Tab Bar:** Pasek dolny pozostaje widoczny, lecz żadna ikona nie jest podświetlona jako *aktywna* (widok sub-level), chyba że wejście nastąpiło bezpośrednio z kalendarza.