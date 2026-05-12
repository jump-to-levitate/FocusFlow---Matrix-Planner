Jako Senior UI/UX Engineer przygotowałem inżynierię wsteczną dla **Ekranu 25 Brain Dump - wybór typu zadania (Q3)** (Strona 8 pliku **PDF**). Jest to strategiczny pop-up decyzyjny, który pojawia się po zaklasyfikowaniu zadania jako „Pilne / Nieważne”. Jego celem jest wymuszenie na użytkowniku wyboru konkretnej ścieżki egzekucji, aby uniknąć odkładania drobnych spraw na później.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Overlay Background** | `#000000` (85% Opacity) | `bg-black/85 backdrop-blur-md` |
| **Strategy Green** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Strategy Purple** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Pop-up Radius** | 24px | `rounded-[24px]` |

---

## 2. Specyfikacja Ekranu 25 Pop-up Strategiczny (ID 170:412)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Overlay Container** | `p-6` | `fixed inset-0` | `flex items-center justify-center` |
| **Modal Card** | `px-6 py-10` | `w-full max-w-[390px]` | `flex flex-col gap-8` |
| **Header Section** | `p-0` | `mb-2` | `space-y-2 text-center` |
| **Button Group** | `p-0` | `mt-4` | `flex flex-col gap-4` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Pytanie: *CO Z TYM...*** | 22px | 800 (ExtraBold) | 110% | `#FFFFFF` |
| **Wybrany Typ: *PROZA*** | 14px | 700 (Bold) | 100% | `#39FF14` (Caps) |
| **Etykieta przycisku** | 18px | 800 (ExtraBold) | 100% | `#000000` (na zielonym) / `#FFFFFF` (na fioletowym) |
| **Opis pod przyciskiem** | 12px | 400 (Regular) | 140% | `#B0B0B0` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Modal Card** | 2px solid `#39FF14` | `0 0 30px rgba(57, 255, 20, 0.4)` | Blask strategii III ćwiartki |
| **Przycisk: Zrób teraz** | Brak (Fill `#39FF14`) | `0 4px 20px #39FF14` | Opcja wysokiej dopaminy |
| **Przycisk: Zaplanuj** | 2px solid `#A020F0` | `None` (Outline) | Opcja logistyczna (Purple) |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Header Pop-upu (Context)

- **Budowa**: Centralnie wyrównany tytuł *CO Z **TYM** **ROBIMY**?* oraz mniejszy badge poniżej: `[ **PROZA** Ż**YCIA** ]` w zielonej ramce.
- **Cel**: Natychmiastowe przypomnienie użytkownikowi, że to zadanie jest pilne, ale nie przybliża go do wielkich celów.

### 2. Przycisk *ZROBIE TO TERAZ* (Action A)

- **Styl**: Pełna pigułka (Pill) Neon Green. Czarny tekst.
- **Logika**: Po kliknięciu zadanie jest oznaczane jako `strategy: 'do_now'` i użytkownik wraca na **Ekran 01 Pulpit**, gdzie zadanie pojawia się jako szybka akcja lub trafia do sekcji „Zrób teraz” na **Ekranie 07**.

### 3. Przycisk *ZAPLANUJ BLOK* (Action B)

- **Styl**: Pigułka z fioletowym obrysem (Outline). Biały tekst.
- **Logika**: Przenosi użytkownika bezpośrednio do **Ekranu 18 Dodaj Zadanie** (wariant „Inne”), aby przypisać konkretną godzinę realizacji.

---

**Wytyczne dla Lead Developera:**

- **Animacja Wejścia**: Modal musi pojawić się z efektem `zoom-in` (0.9 → 1.0) przy jednoczesnym płynnym przyciemnieniu tła.
- **Zarządzanie Stanem**: Ten pop-up jest wyzwalany tylko przez funkcję `onClickAddTask` na ekranie 03, jeśli wynik funkcji `processQuiz()` to `Quadrant **III**`.
- **Interakcja**: Kliknięcie poza modalem (w obszar overlay) powinno być zablokowane lub traktowane jako „Anuluj” (powrót do edycji na 03), aby zapobiec przypadkowemu zgubieniu zadania.

Czy przygotować specyfikację dla pozostałych pop-upów decyzyjnych (**26** i **27**) dla pozostałych kwadrantów?