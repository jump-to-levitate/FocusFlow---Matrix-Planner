Jako Senior UI/UX Engineer przeprowadziłem inżynierię wsteczną **Ekranu 07 Proza życia** (Strona 23 pliku **PDF**). Ekran ten obsługuje zadania z **III** ćwiartki (Pilne/Nieważne), kładąc nacisk na szybką egzekucję poprzez trzy dedykowane strategie logistyczne.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Strategy: Od razu** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Strategy: W przerwie** | `#FFA500` (Orange) | `text-[#FFA500]` / `border-[#FFA500]` |
| **Strategy: Blok** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |

---

## 2. Specyfikacja Ekranu 07 Proza życia (ID 2:8)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-28` | `0 auto` | `space-y-6` |
| **Header Section** | `p-0` | `mb-4` | `space-y-1` |
| **Task Sections** | `p-0` | `mb-6` | `space-y-4` (między sekcjami) |
| **Task List** | `p-0` | `mt-2` | `space-y-3` (między pigułkami) |
| **Info Panel (Footer)** | `px-4 py-6` | `fixed bottom-24` | `gap-3` (Flex-wrap) |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł *PROZA ŻYCIA*** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Licznik zadań** | 13px | 400 (Regular) | 100% | `#B0B0B0` |
| **Nagłówek sekcji** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Caps) |
| **Nazwa zadania** | 14px | 500 (Medium) | 130% | `#FFFFFF` |
| **Etykieta ZROBIONE** | 11px | 800 (ExtraBold) | 100% | `#000000` |
| **Info Pill Text** | 13px | 600 (SemiBold) | 100% | `#FFFFFF` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Task Pill** | 1px solid `#FFFFFF` | `None` | Opacity 20% dla obramowania. |
| **Przycisk: Od razu** | None (Fill `#39FF14`) | `0 0 10px #39FF14` | Strategia 1: Natychmiastowe |
| **Przycisk: Przerwa** | None (Fill `#FFA500`) | `0 0 10px #FFA500` | Strategia 2: Dopamina |
| **Przycisk: Blok** | None (Fill `#A020F0`) | `0 0 10px #A020F0` | Strategia 3: Logistyka |
| **Info Panel Box** | 1.5px solid `#A020F0` | `None` | Kontener dla edukacji UX |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Przycisk Powrotu *< Macierz*

- **Styl:** Pigułka fioletowa (Outline), wyrównana do lewej.
- **Cel:** Powrót do **Ekranu 02**.

### 2. Pigułka Zadania III Ćwiartki

- **Budowa:** Tytuł zadania (Left) + Przycisk *ZROBIONE* (Right).
- **Warianty kolorystyczne:** Kolor przycisku *ZROBIONE* zależy od sekcji (strategii), w której znajduje się zadanie.
- **Interakcja:** Kliknięcie *ZROBIONE* wyzwala animację `fade-out` i inkrementuje statystyki dnia.

### 3. Panel *Jak zrealizować?* (Info Hub)

- **Budowa:** Kontener z fioletowym obrysem zawierający trzy mniejsze pigułki: *Zaplanuj blok*, *Zrób teraz*, *Zrób w przerwie*.
- **Ikona *ⓘ*:** Każda pigułka posiada ikonę informacji, która po kliknięciu otwiera odpowiedni pop-up edukacyjny (Ekrany 12, 13, 14).

---

**Wytyczne dla Lead Developera:**

- **Zarządzanie listą:** Sekcje muszą być renderowane dynamicznie na podstawie pola `task.strategy`. Jeśli sekcja *Inne* jest pusta, wyświetl pustą ramkę (drop zone).
- **Context Menu:** Long Press na zadaniu musi udostępniać pełną listę akcji, w tym *EDYTUJ* (powrót do 03) i ***USU**Ń*.
- **Tab Bar:** Aktywna ikona **Macierz** (pozycja 2) w kolorze `#**A020F0**` z neonową kropką indykatora.