Jako Senior UI/UX Engineer przygotowałem pełną inżynierię wsteczną **Ekranu 01 Pulpit** (Strona 15 pliku **PDF**). Specyfikacja została zoptymalizowana pod kątem wdrożenia w Tailwind **CSS** przy zachowaniu proporcji dla wysokości 932px (iPhone 14/15 Pro Max).

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Neon Green** | `#39FF14` | `text-[#39FF14]` / `border-[#39FF14]` |
| **Neon Purple** | `#A020F0` | `text-[#A020F0]` / `border-[#A020F0]` |
| **Card Surface** | `#121212` | `bg-[#121212]` |
| **Border Radius** | Cards: 18px / Pills: 50px | <br>`rounded-[18px]` / `rounded-full`

 |

---

## 2. Specyfikacja Ekranu 01 Pulpit (ID 2:2)

### A. Layout & Grid

| Sekcja | Padding (In) | Margin (Out) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-4 pt-8 pb-20` | `0 auto` | <br>`space-y-6`

 |
| **Hero Card** | `p-5` | `mb-6` | `space-y-4` |
| **Quick Note Area** | `p-0` | `mt-8` | `gap-3` |
| **Tab Bar** | `px-6 py-4` | `fixed bottom-0` | <br>`flex justify-between`

 |

### B. Typography (Reverse Engineered)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Logo FocusFlow** | 24px | 700 (Bold) | 120% | <br>`#FFFFFF`

 |
| **Data (Header)** | 14px | 400 (Regular) | 140% | <br>`#B0B0B0`

 |
| **Task Title (Hero)** | 28px | 700 (Bold) | 110% | <br>`#FFFFFF`

 |
| **Button Text** | 16px | 800 (ExtraBold) | 100% | <br>`#000000`

 |
| **Section Header** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Uppercase) |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Opacity |
| --- | --- | --- | --- |
| **Hero Card (Q1)** | 2px solid `#39FF14` | `0 0 15px rgba(57, 255, 20, 0.4)` | 100%

 |
| **Start Focus BTN** | None (Fill) | `0 4px 20px rgba(57, 255, 20, 0.6)` | 100%

 |
| **Quick Note Input** | 1px solid `#A020F0` | `inner-glow: 0 0 8px rgba(160, 32, 240, 0.2)` | 100%

 |
| **Tab Bar Dot** | None (Circle) | `0 0 10px #39FF14` | 100%

 |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Karta Hero *Twój cel na teraz*

- **Struktura:** Container (Relative) -> Label (Absolute top-left) -> Task Title -> Action Button.
- **Interakcja:** Przycisk ***START** **FOCUS*** posiada stan `active:scale-95` i wyzwala nawigację do ekranu 04.

### 2. Pigułka Zadania (Queue Pill)

- **Wymiary:** Height: 48px, Width: Full.
- **Styl:** Border 1px `#**39FF14**`, Background: Transparent.
- **Content:** Ikona ołówka (prawy margines), tekst wyrównany do lewej.

### 3. Moduł Szybkiej Notatki

- **Input:** `textarea` z zaokrągleniem 18px, placeholder: *Wyrzuć myśl z głowy...*.

- **Action:** Przycisk *Zapisz* (Pill-shape, background `#**A020F0**`) wyrównany do prawej krawędzi.

### 4. Tab Bar (Bottom Navigation)

- **Ikony:** 5 slotów, rozmiar 24x24px.

- **Active State:** Neon Green (`#**39FF14**`) z kropką `indicator` pod ikoną.

- **Blur Effect:** Tło Tab Baru z efektem `backdrop-blur-md` (80% opacity black).

---

**Wytyczne dla Lead Developera:** Implementacja powinna opierać się na `Flexbox` dla głównego kontenera. Sekcja *Kolejne w kolejce* musi dynamicznie mapować tablicę `tasks` (index 1-2). Całość musi być responsywna w ramach kontenera `max-w-[430px]` dla zachowania proporcji z Figmy.