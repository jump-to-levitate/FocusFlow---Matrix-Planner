Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 03 Brain Dump** (Strona 18 pliku **PDF**). Specyfikacja koncentruje się na dynamicznej naturze tego widoku, który łączy funkcje formularza z silnikiem decyzyjnym quizu.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Active Green** | `#39FF14` | `text-[#39FF14]` / `border-[#39FF14]` |
| **Interactive Purple** | `#A020F0` | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Radius** | Cards/Inputs: 18px / Pills: 50px | `rounded-[18px]` / `rounded-full` |

---

## 2. Specyfikacja Ekranu 03 Brain Dump (ID 2:4)

### A. Layout & Grid

| Sekcja | Padding (In) | Margin (Out) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-8` |
| **Header Row** | `p-0` | `mb-6` | `justify-between items-center` |
| **Input Section** | `p-0` | `mb-10` | `space-y-3` |
| **Quiz Classifier** | `px-4 py-6` | `bg-[#121212]` | `space-y-6` |
| **Action Group** | `p-0` | `mt-auto` | `space-y-4` |

### B. Typography (Reverse Engineered)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Screen Title** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Field Label** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Uppercase) |
| **Input Text / Placeholder** | 16px | 400 (Regular) | 140% | `#FFFFFF` / `#4A4A4A` |
| **Question Text (Quiz)** | 16px | 500 (Medium) | 130% | `#FFFFFF` |
| **Dynamic Result Label** | 14px | 700 (Bold) | 100% | `#39FF14` |
| **CTA Button Text** | 18px | 800 (ExtraBold) | 100% | `#000000` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Przeznaczenie |
| --- | --- | --- | --- |
| **Main Input Field** | 2px solid `#A020F0` | `0 0 10px rgba(160, 32, 240, 0.3)` | Stan aktywny (Focus) |
| **Result Pill** | 1px solid `#39FF14` | `None` (Subtelny Stroke) | Wynik kategoryzacji |
| **Main CTA (DODAJ)** | None (Fill) | `0 4px 25px rgba(57, 255, 20, 0.7)` | Maksymalny priorytet wizualny |
| **Toggle Active** | 1px solid `#A020F0` | `inner-glow: 0 0 5px #A020F0` | Stan wybrany (TAK/NIE) |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Nav-Pill *→ Twoje notatki*

- **Wizualnie:** Fioletowy wypełniony przycisk w prawym górnym rogu.
- **Funkcja:** Szybkie przejście do ekranu 05 (notatki Brain Dump).

### 2. Formularz Klasyfikatora (Quiz Toggle)

- **Budowa:** Label -> Toggle Group (**TAK**/**NIE**) -> Slider Control -> Question.
- **Interakcja:** Kliknięcie strzałki *►* pod toggle'em przełącza pytania wewnątrz danej kategorii (Ważność/Pilność).
- **Stan:** Dynamiczna zmiana treści pytania bez przeładowywania sekcji.

### 3. Pigułka Informacyjna (Dynamic Result)

- **Wizualnie:** Pigułka z zielonym obrysem i ikoną ołówka po prawej stronie.
- **Logika:** Tekst `→ Trafia do: [**WYNIK**]` generowany w czasie rzeczywistym na podstawie sumy punktów z quizu (Score >= 2).

### 4. Główny Przycisk *DODAJ ZADANIE*

- **Styl:** Pełne wypełnienie Neon Green, czarny tekst, bardzo mocny Glow.
- **Zachowanie:** Inicjuje routing do popupów kategoryzacji (25, 26, 27) lub bezpośrednio na Pulpit (01).

---

**Wytyczne dla Lead Developera:** Implementacja ekranu 03 wymaga zaawansowanego zarządzania stanem (`state management`). Każda odpowiedź w sekcji Quizu (**TAK**/**NIE**) musi natychmiast przeliczać funkcję `processQuiz()`, aby aktualizować tekst w pigułce wynikowej przed kliknięciem finalnego **CTA**. Pamiętaj o obsłudze **Edge Case**: jeśli użytkownik spróbuje wyjść z nieukończonym quizem, zapisz tytuł jako notatkę `unsorted` na ekranie 05.