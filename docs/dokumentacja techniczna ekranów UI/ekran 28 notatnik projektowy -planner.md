Jako Senior UI/UX Engineer przygotowałem pełną inżynierię wsteczną dla **Ekranu 28: Notatnik Projektowy / Planer** (Strona 26 pliku **PDF**). Ekran ten stanowi centrum operacyjne dla konkretnego zadania, łącząc zarządzanie mikro-krokami, zasobami zewnętrznymi oraz notatkami merytorycznymi.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Accent Purple** | `#A020F0` | `text-[#A020F0]` / `border-[#A020F0]` |
| **Accent Green** | `#39FF14` | `text-[#39FF14]` / `border-[#39FF14]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Checkbox Radius** | 4px | `rounded-sm` |

---

## 2. Specyfikacja Ekranu 28 Notatnik Projektowy (ID 180:500)

### A. Layout & Grid (Hierarchia Treści)

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-8` |
| **Header Section** | `p-0` | `mb-2` | `flex flex-col gap-1` |
| **MicroSteps List** | `p-0` | `mt-4` | `flex flex-col gap-3` |
| **Note Area** | `p-4` | `rounded-[18px]` | `min-h-[120px]` |
| **Resources Row** | `p-0` | `mt-2` | `flex flex-wrap gap-2` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Back Link (< Wróć)** | 14px | 600 (SemiBold) | 100% | `#B0B0B0` |
| **Tytuł Projektu** | 28px | 800 (ExtraBold) | 110% | `#FFFFFF` |
| **Badge Meta (Data/Typ)** | 12px | 700 (Bold) | 100% | `#A020F0` (Caps) |
| **Section Label** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Uppercase) |
| **MicroStep Text** | 15px | 400 (Regular) | 140% | `#FFFFFF` |
| **Note Placeholder** | 14px | 400 (Regular) | 150% | `#4A4A4A` |

### C. Effects & Shaders (Interaktywność)

| Komponent | Border | Shadow / Glow | Stan / Przeznaczenie |
| --- | --- | --- | --- |
| **Checkbox (Checked)** | 2px solid `#39FF14` | `inner-glow: #39FF14` | Krok ukończony

 |
| **Checkbox (Empty)** | 2px solid `#A020F0` | `None` | Krok do zrobienia

 |
| **Note Container** | 1px solid `#333333` | `None` | Powierzchnia edycyjna

 |
| **Resource Pill** | 1px solid `#A020F0` | `0 0 8px rgba(160, 32, 240, 0.2)` | Aktywny link/plik

 |
| **Add Pill (+ Dodaj)** | 1px dashed `#B0B0B0` | `None` | Trigger pop-upu 30

 |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Nagłówek Kontekstowy

- **Struktura**: Przycisk powrotu -> Tytuł zadania -> Linia meta (Kwadrant / Kategoria / Termin) .

- **Logika**: Meta-dane są dynamicznie zaciągane z encji `Task`.

### 2. Moduł MicroSteps (Checklista)

- **Komponent**: Pasek postępu (opcjonalnie) + Lista wierszy.
- **Wiersz**: Checkbox (L) + Tekst (Center) .

- **Interakcja**: Kliknięcie w dowolnym miejscu wiersza przełącza stan `isDone` danego mikro-kroku.

### 3. Edytor Notatki (Rich Text Lite)

- **Budowa**: Kontener z etykietą *NOTATKA*.

- **Funkcja**: Automatyczny zapis (auto-save) treści do pola `noteContent` przy każdym `onBlur` lub po 2 sekundach bezczynności.

### 4. Grid Zasobów (Resources)

- **Komponenty**: Pigułki z ikoną typu (Link/Plik) + nazwa + pigułka *+ Dodaj*.

- **Logika**: Pigułka *+ Dodaj* otwiera **Ekran 30**. Nowe zasoby są renderowane natychmiastowo po potwierdzeniu w pop-upie.

---

## 4. Wytyczne dla Lead Developera

- **Zarządzanie Stanem**: Ekran 28 musi subskrybować event `TaskUpdated`. Zmiana checkboxa tutaj musi odzwierciedlać się na **Ekranie 04 (Timer)**, jeśli sesja jest aktywna.

- **Nawigacja *Odpal Timer***: Zgodnie ze specyfikacją techniczną, w tym widoku powinien znajdować się przycisk `▶ **ODPAL** **TIMER**`, który przenosi użytkownika do **Ekranu 04** z zachowaniem kontekstu notatki.
- **Optymalizacja UI**: Sekcja zasobów powinna obsługiwać horyzontalny scroll (`overflow-x-auto`), jeśli liczba pigułek przekroczy szerokość ekranu.
- **Haptic Feedback**: Każde odznaczenie checkboxa (`isDone: true`) powinno wyzwalać krótką wibrację typu *light success*.

Czy przygotować teraz specyfikację dla **Ekranu 30 (Dodaj Zasób)**, który jest bezpośrednio powiązany z tym widokiem?