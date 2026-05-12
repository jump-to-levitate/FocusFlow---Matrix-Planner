Jako Senior UI/UX Engineer przeprowadziłem inżynierię wsteczną **Ekranu 24 Wszystko na dzisiaj** (Strona 5 pliku **PDF**). Jest to strategiczny widok agregujący, który stanowi „centrum dowodzenia” na dany dzień. W przeciwieństwie do ekranu 20, ten widok kładzie większy nacisk na wizualną hierarchię między Deep Workiem a zadaniami administracyjnymi.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Priority Green** | `#39FF14` (Deep Work) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Admin Purple** | `#A020F0` (Proza życia) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Time Marker** | `#B0B0B0` | `text-[#B0B0B0]` |

---

## 2. Specyfikacja Ekranu 24 Wszystko na dzisiaj (ID 2:15)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-8` |
| **Header Section** | `p-0` | `mb-2` | `flex flex-col gap-1` |
| **Timeline Group** | `p-0` | `mb-6` | `relative space-y-4 pl-6 border-l-[1px] border-zinc-800` |
| **Task Entry** | `px-4 py-3` | `w-full` | `flex justify-between items-center` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł *DZISIAJ*** | 32px | 800 (ExtraBold) | 100% | `#FFFFFF` |
| **Data pod tytułem** | 14px | 500 (Medium) | 100% | `#B0B0B0` |
| **Etykieta Czasu** | 12px | 700 (Bold) | 100% | `#FFFFFF` |
| **Nazwa Zadania** | 15px | 600 (SemiBold) | 120% | `#FFFFFF` |
| **Badge Kategorii** | 9px | 800 (ExtraBold) | 100% | Zależny od Q (Caps) |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Deep Work Pill** | 1.5px solid `#39FF14` | `0 0 12px rgba(57, 255, 20, 0.2)` | Zadania z I i II ćwiartki |
| **Proza Życia Pill** | 1.5px solid `#A020F0` | `None` | Zadania z III ćwiartki |
| **Time Dot** | None (Fill `#39FF14`) | `0 0 8px #39FF14` | Wskaźnik na osi czasu dla obecnej godziny |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Dynamiczny Header *Dzisiaj*

- **Budowa**: Wielki napis *DZISIAJ* (All Caps) + dynamiczna data (np. *Poniedziałek, 11 maja*).
- **Licznik**: Mała pigułka obok tytułu wyświetlająca `[X zadań]`, gdzie X to suma zaplanowanych sesji na dziś.

### 2. Oś Czasu (Agenda Timeline)

- **Wizualnie**: Pionowa linia po lewej stronie ekranu. Zadania są do niej „przypięte” za pomocą kropek indykatorów.
- **Grupowanie**:
- **Rano**: Sesje Deep Work (Q1/Q2).
- **Bloki logistyczne**: Grupowanie zadań Prozy Życia (Q3) w jeden interwał czasowy.

### 3. Karta Zadania (Agenda Task Card)

- **Struktura**: Godzina (Lewo) -> Nazwa Zadania (Centrum) -> Status/Timer (Prawo).
- **Interakcja**:
- Kliknięcie w zadanie typu Deep Work otwiera **Ekran 04 Timer**.
- Kliknięcie w zadanie typu Proza Życia otwiera szybki checklist (Ekran 07).

### 4. Przycisk *DODAJ COŚ* (Quick Add)

- **Wizualnie**: Pływający przycisk (**FAB**) lub ostatni element listy z przerywanym obrysem (Dashed Border).
- **Interakcja**: Skrót do **Ekranu 03 Brain Dump**.

---

**Wytyczne dla Lead Developera:**

- **Logika Agregacji**: Ten widok musi łączyć `state.tasks` (wszystkie kwadranty z dzisiejszą datą) oraz `state.habits` (jeśli ich częstotliwość wypada dzisiaj).
- **Auto-Scroll**: Przy otwarciu ekranu, lista powinna automatycznie przewinąć się do najbliższego nadchodzącego zadania na osi czasu.
- **Tab Bar**: Aktywna ikona **Pulpit** (Home) w kolorze `#**39FF14**` z neonową kropką pod spodem.

Czy chcesz teraz opracować specyfikację dla **Ekranu 28 Notatnik Projektowy** (Strona 34 **PDF**), który jest bezpośrednio powiązany z Wielkimi Projektami?