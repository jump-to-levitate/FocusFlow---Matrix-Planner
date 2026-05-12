Jako Senior UI/UX Engineer przeprowadziłem inżynierię wsteczną **Ekranu 12 Proza życia - info pop-up „zaplanuj blok”** (Strona 29 pliku **PDF**). Jest to modalny ekran edukacyjny, który dostarcza użytkownikowi strategii radzenia sobie z zadaniami z **III** ćwiartki (Proza życia), minimalizując obciążenie poznawcze poprzez technikę „Sprintu Logistycznego”.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Overlay Background** | `#000000` (70% Opacity) | `bg-black/70 backdrop-blur-md` |
| **Strategy Green** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Surface Card** | `#121212` | `bg-[#121212]` |
| **Card Radius** | 18px | `rounded-[18px]` |
| **Close Icon Color** | `#B0B0B0` (Dark Gray) | `text-[#B0B0B0]` |

---

## 2. Specyfikacja Ekranu 12 Info Pop-up (ID 154:273)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Overlay Container** | `p-6` | `fixed inset-0` | `flex items-center justify-center` |
| **Pop-up Card** | `px-6 py-8` | `w-full max-w-[380px]` | `flex flex-col gap-5` |
| **Header Row** | `p-0` | `mb-2` | `justify-between items-center` |
| **Content Area** | `p-0` | `mb-6` | `space-y-4` |
| **Action Row** | `p-0` | `mt-4` | `w-full` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł *Zaplanuj blok →*** | 20px | 700 (Bold) | 120% | `#39FF14` |
| **Podtytuł (Sekcja)** | 16px | 600 (SemiBold) | 130% | `#FFFFFF` |
| **Body Text (Akapit)** | 14px | 400 (Regular) | 150% | `#FFFFFF` |
| **Przycisk *Rozumiem*** | 16px | 800 (ExtraBold) | 100% | `#000000` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Pop-up Card** | 2px solid `#39FF14` | `0 0 20px rgba(57, 255, 20, 0.3)` | Zielona ramka strategii |
| **Przycisk: Rozumiem** | Brak (Fill `#39FF14`) | `0 4px 15px #39FF14` | CTA wysokiego priorytetu |
| **Close Icon (X)** | Brak | `None` | Dyskretny element nawigacyjny |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Nagłówek Pop-upu

- **Struktura:** Tytuł strategii (Lewo) + Ikona zamknięcia *X* (Prawo).
- **Interakcja:** Kliknięcie *X* zamyka modal i przywraca pełną widoczność **Ekranu 07**.

### 2. Sekcja Treści (Edukacja ADHD)

- **Opis Strategii:** Wyjaśnienie *Sprintu Logistycznego* jako sposobu na ochronę pamięci operacyjnej.
- **Masz trudności?:** Sekcja wspierająca z sugestią połączenia się z kimś (tzw. *body doubling*) lub wejścia na kanał Focus.
- **Delegowanie:** Pytanie skłaniające do refleksji nad automatyzacją zadania.

### 3. Przycisk Akcji (CTA)

- **Styl:** Pełna pigułka w kolorze Neon Green z czarnym tekstem.
- **Logika:** Zamknięcie pop-upu i powrót do widoku **07 Proza życia**.

---

**Wytyczne dla Lead Developera:**

- **Efekt tła:** Tło pod pop-upem musi być zamrożonym stanem ekranu 07 z nałożonym rozmyciem `backdrop-filter: blur(4px)`.
- **Interakcja:** Modal powinien być zamykany również poprzez kliknięcie w obszar `backdrop` poza kartą.
- **Animacja:** Wejście modalu powinno odbywać się za pomocą `scale-in` (0.95 → 1.0) z jednoczesnym rozjaśnianiem tła (Fade-in).

Czy przygotować specyfikację dla pozostałych pop-upów info (**13** i **14**) na tej samej zasadzie?