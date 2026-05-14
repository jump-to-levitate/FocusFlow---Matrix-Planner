Jako Senior UI/UX Engineer przygotowałem pełną inżynierię wsteczną oraz specyfikację techniczną dla **Ekranu 05 notatki Brain Dump** (Strona 7 pliku **PDF**). Ten ekran pełni rolę tymczasowego magazynu dla myśli, które wymagają późniejszej kategoryzacji, dlatego projekt kładzie nacisk na przejrzystość i szybkie skanowanie wzrokowe listy.

---

### 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Unsorted Border** | `#39FF14` (Neon Green) | `border-[#39FF14]` |
| **Sorted Border** | `#A020F0` (Neon Purple) | `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Card Radius** | 12px | `rounded-[12px]` |

---

### 2. Specyfikacja Ekranu 05 notatki Brain Dump (ID 2:6)

#### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-5 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Header Row** | `p-0` | `mb-4` | `justify-between items-end` |
| **Quick Input Box** | `px-4 py-3` | `mb-6` | `None` |
| **Notes Grid** | `p-0` | `mt-2` | `grid-cols-2 gap-3` |
| **Footer Action** | `p-0` | `fixed bottom-28` | `w-full px-5` |

#### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł Ekranu** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Licznik (Nieposortowane)** | 14px | 400 (Regular) | 100% | `#B0B0B0` |
| **Input Placeholder** | 16px | 400 (Regular) | 140% | `#4A4A4A` |
| **Treść Notatki (Card)** | 12px | 500 (Medium) | 130% | `#FFFFFF` |
| **Etykieta przycisku** | 16px | 800 (ExtraBold) | 100% | `#000000` |

#### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika Wizualna |
| --- | --- | --- | --- |
| **Karta Notatki (Unsorted)** | 1.5px solid `#39FF14` | `None` | Stan domyślny po wpisie |
| **Karta Notatki (Sorted)** | 1.5px solid `#A020F0` | `None` | Po przejściu przez quiz (03) |
| **Input Glow** | 1px solid `#A020F0` | `0 0 8px rgba(160, 32, 240, 0.2)` | Aktywne pole wprowadzania |
| **Sort Button BTN** | None (Fill `#39FF14`) | `0 4px 20px rgba(57, 255, 20, 0.5)` | Główny CTA ekranu |

---

### 3. Dekompozycja Atomowa Komponentów

#### 1. Nagłówek z Licznikiem

- **Komponent:** `Flex-row`. Tytuł po lewej, licznik *Nieposortowane: 12* wyrównany do prawej, w mniejszym stopniu pisma.

#### 2. Pole Szybkiego Wpisu (Quick Add)

- **Struktura:** Prostokątny `input` z radius 12px. Placeholder: *Co Ci chodzi po głowie?...*.
- **Interakcja:** Naciśnięcie `Enter` tworzy nową encję `BrainDumpNote` z parametrem `type: 'unsorted'`.

#### 3. Siatka Notatek (Masonry-like Grid)

- **Układ:** Dwie kolumny. Notatki mają stałą szerokość, ale zmienną wysokość (auto-height) zależną od długości tekstu.
- **Karta Notatki:** Zawiera wyłącznie tekst. Dłuższe notatki są ucinane po 4 liniach (ellipsis).
- **Context Menu:** Przy długim przyciśnięciu (Long Press) dostępne są akcje: **Edytuj**, **Notatka** (dodatkowa głębia), **Usuń**.

#### 4. Przycisk *Sortuj zadanie*

- **Działanie:** Przycisk typu *sticky* (pozycjonowany nad Tab Barem).
- **Logika:** Wybranie (kliknięcie) notatki z listy, a następnie tego przycisku, przenosi użytkownika do **Ekranu 03 Brain Dump - formularz** z pre-filled tytułem zadania.

---

**Wytyczne dla Lead Developera:**

- **State Management:** Ekran musi nasłuchiwać zmian w tablicy `brainDumpNotes`. Każde dodanie notatki przez szybki input powinno wyzwalać animację `layout transition` (przesunięcie pozostałych kart).
- **Kolorystyka:** Kolor ramki notatki (`#**39FF14**` vs `#**A020F0**`) musi być mapowany bezpośrednio z pola `type` w modelu danych `BrainDumpNote`.
- **Tab Bar:** Ikona Mózgu (Brain Dump) musi być aktywna (kolor `#**39FF14**`) z neonową kropką pod spodem.