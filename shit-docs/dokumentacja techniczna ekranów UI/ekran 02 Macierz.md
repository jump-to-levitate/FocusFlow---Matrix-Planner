Jako Senior UI/UX Engineer przygotowałem pełną inżynierię wsteczną dla **Ekranu 02 Macierz Eisenhowera** (Strony 16 i 17 pliku **PDF**). Specyfikacja uwzględnia strukturę kwadrantów 2x2 oraz stan interaktywny (Context Menu) przy zachowaniu proporcji wysokości 932px.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Q1/Q3 Border** | `#39FF14` (Neon Green) | `border-[#39FF14]` |
| **Q2 Border** | `#A020F0` (Neon Purple) | `border-[#A020F0]` |
| **Grid Lines** | `#FFFFFF` (Opacity 20%) | `bg-white/20` |
| **Overlay** | `#000000` (Opacity 80%) | `bg-black/80` |

---

## 2. Specyfikacja Ekranu 02 Macierz Eisenhowera (ID 2:3)

### A. Layout & Grid (Układ 2x2)

| Sekcja | Padding (In) | Margin (Out) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-4 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Matrix Grid** | `p-0` | `mt-4` | `gap-3` (między ćwiartkami) |
| **Quadrant Card** | `p-3` | `min-h-[320px]` | `space-y-3` |
| **Task Pill** | `px-3 py-2` | `w-full` | `justify-between` |

### B. Typography (Reverse Engineered)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł *Macierz...*** | 24px

 | 700 (Bold) | 120% | `#FFFFFF` |
| **Etykiety Osi (Pilne/Ważne)** | 10px | 800 (ExtraBold) | 100% | `#FFFFFF` (Uppercase) |
| **Nagłówek Ćwiartki** | 14px | 700 (Bold) | 110% | `#FFFFFF` |
| **Nazwa Zadania (Pill)** | 12px | 500 (Medium) | 130% | `#FFFFFF` |
| **Etykieta Przycisku Q** | 11px | 800 (ExtraBold) | 100% | `#000000` (w pigułce) |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Opacity |
| --- | --- | --- | --- |
| **Ćwiartka I & III** | 2px solid `#39FF14` | `0 0 10px rgba(57, 255, 20, 0.2)` | 100% |
| **Ćwiartka II** | 2px solid `#A020F0` | `0 0 10px rgba(160, 32, 240, 0.2)` | 100% |
| **Task Pill** | 1px solid `#FFFFFF` | `None` | 20% (Border) |
| **Context Menu BTN** | None (Fill) | `0 0 15px #39FF14` (tylko Start Focus) | 100% |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Karta Ćwiartki (Quadrant Card)

- **Struktura:** Container -> Header -> Task List (max 5 widocznych) -> Dynamic **CTA** Button.

- **Logika wizualna:** Każda ćwiartka ma przypisany stały kolor obramowania (Green dla I/**III**/IV, Purple dla II).

- ****CTA** Button:** Pigułka umieszczona na dole karty z wypełnieniem kolorystycznym ćwiartki (np. zielona dla Q1 z napisem *→ **START** **FOCUS***).

### 2. Pigułka Zadania w Macierzy

- **Wymiary:** Wysokość adaptacyjna, szerokość dopasowana do kontenera ćwiartki.
- **Elementy:** Tekst zadania (zawijany) + ikona checkboxa (opcjonalnie) lub strzałki.
- **Interakcja:** `Long Press` wyzwala stan z **PDF** strona 17.

### 3. Stan Context Menu (PDF strona 17)

- **Overlay:** Pełnoekranowy `bg-black/80` z efektem `backdrop-blur-sm`.
- **Focus State:** Wybrane zadanie zostaje wyciągnięte *nad* overlay (zwiększony z-index).
- **Panel Akcji:** 6 przycisków w układzie pionowym lub gridzie:
- ****START** **FOCUS**:** Neon Green fill, Black text.
- ****ZROBIONE** / **EDYTUJ** / **PRZENIE**Ś / **NOTATKA** / **USU**Ń:** Outline style (biały/szary).

### 4. Etykiety Osi (Axis Labels)

- **Pionowa (WAŻNE):** Tekst obrócony o -90 stopni, umieszczony po lewej stronie siatki.
- **Pozioma (**PILNE**):** Tekst wyśrodkowany nad siatką ćwiartek.

---

**Wytyczne dla Lead Developera:** Głównym wyzwaniem jest implementacja **siatki 2x2**, która musi być elastyczna (`flex-1`), aby wypełnić dostępną przestrzeń między nagłówkiem a Tab Barem. Pamiętaj o wdrożeniu logiki `Long Press` (obsługa zdarzenia dotykowego trwającego >500ms), która musi wycentrować taska i nałożyć menu akcji bez przeładowania widoku. Animacja otwarcia menu: `fade-in` dla tła oraz `scale-up (0.9 -> 1.0)` dla panelu przycisków.