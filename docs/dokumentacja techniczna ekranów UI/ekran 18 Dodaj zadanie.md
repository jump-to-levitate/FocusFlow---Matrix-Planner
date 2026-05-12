Jako Senior UI/UX Engineer przygotowałem kompleksową inżynierię wsteczną dla **Ekranu 18 Dodaj Zadanie** (Strony 1, 2 i 3 pliku **PDF**). Jest to najbardziej rozbudowany formularz w aplikacji, który adaptuje swoje pola w zależności od wybranej kategorii (Rutyna / Projekt / Inne).

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Primary Green** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `bg-[#39FF14]` |
| **Primary Purple** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Input Radius** | 12px | `rounded-[12px]` |

---

## 2. Specyfikacja Ekranu 18 Dodaj Zadanie (ID 2:19)

### A. Layout & Grid (Formularz Adaptacyjny)

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-12` | `0 auto` | `space-y-6` |
| **Header Section** | `p-0` | `mb-4` | `space-y-2` |
| **Input Group** | `p-0` | `mb-2` | `space-y-2` |
| **Segmented Picker** | `p-1` | `w-full` | `flex gap-1` |
| **Date/Time Grid** | `p-0` | `mt-4` | `grid-cols-7 gap-2` |
| **Sticky Footer** | `px-6 py-4` | `fixed bottom-0` | `w-full bg-black/80` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Nagłówek *NOWE WYZWANIE*** | 28px | 800 (ExtraBold) | 110% | `#FFFFFF` (Caps) |
| **Etykieta Pola (Label)** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Caps) |
| **Input Text / Value** | 16px | 400 (Regular) | 140% | `#FFFFFF` |
| **Pigułka Dnia (Aktywna)** | 14px | 700 (Bold) | 100% | `#000000` (na zielonym) |
| **Przycisk ZAPISZ** | 18px | 800 (ExtraBold) | 100% | `#000000` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Input Field** | 1.5px solid `#1A1A1A` | `None` | Stan spoczynku |
| **Aktywna Kategoria** | None (Fill `#A020F0`) | `0 0 12px #A020F0` | Wybrana pigułka kategorii |
| **Przycisk ZAPISZ** | None (Fill `#39FF14`) | `0 4px 20px #39FF14` | Finalizacja (Glow) |
| **Pigułka Dnia** | 1px solid `#39FF14` | `None` | Dostępne terminy (Outline) |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Selektor Kategorii (KATEGORIA)

- **Warianty**: Rutyna (Habit), Wielki Projekt (Project), Inne (Other).
- **Interakcja**: Wybór zmienia zestaw pól poniżej (np. *Wsparcie Logistyczne* pojawia się tylko przy Projektach i Innych).

### 2. Kalendarz Tygodniowy (Day Picker)

- **Budowa**: Rząd 7 pigułek (Pn, Wt, Śr, Cz, Pt, Sb, Nd).
- **Logika**: Wielokrotny wybór (Multiple Select). Wybrane dni wypełniają się kolorem zielonym `#**39FF14**`.

### 3. Moduł Godzin Sesji (Time Selection)

- **Warianty**: *Cały dzień* (Toggle) lub *Wybierz godziny sesji*.
- **Wizualnie**: Lista wybranych godzin (np. *Pn: 15:00*) prezentowana jako małe pigułki z fioletowym tekstem.

### 4. Wsparcie Logistyczne (Logistics Support)

- **Warianty**: *Przerzuć do Pilne i Ważne na dni przed terminem*.
- **Opcje**: Pigułki wyboru czasu wyprzedzenia: *7 dni*, *3 dni*, *2 dni*.
- **Logika**: System automatycznie wygeneruje zadania w I ćwiartce w wybranym interwale przed datą końcową (Deadline).

---

**Wytyczne dla Lead Developera:**

- **Zarządzanie Stanem**: Formularz musi obsługiwać złożony obiekt `DraftTask`. Zmiana kategorii powinna czyścić niekompatybilne pola (np. reset sesji przy zmianie z Rutyny na Projekt).
- **Walidacja**: Przycisk *ZAPISZ* musi być zablokowany (disabled), dopóki pola `title` oraz co najmniej jeden `date` nie zostaną wypełnione. Błąd wpisania godziny powinien kierować do **Ekranu 19**.
- **Tab Bar**: Aktywna ikona **Kalendarz** (pozycja 4) w kolorze fioletowym (`#**A020F0**`) z neonową kropką pod spodem.

Czy specyfikacja ekranu 18 jest dla Ciebie wystarczająca, czy chcesz, abym przeszedł do **Ekranu 19 (Błąd godziny)** lub **Ekranu 24 (Wszystko na dzisiaj)**?