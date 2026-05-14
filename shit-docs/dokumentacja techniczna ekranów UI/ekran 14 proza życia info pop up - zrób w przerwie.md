Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 14 Proza życia - info pop-up „zrób w przerwie”** (Strona 31 pliku **PDF**). Ten modal edukacyjny przedstawia strategię „resetu dopaminowego”, wykorzystującą mechaniczne zadania jako formę odpoczynku dla mózgu pomiędzy sesjami głębokiej pracy.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Overlay Background** | `#000000` (70% Opacity) | `bg-black/70 backdrop-blur-md` |
| **Strategy Green** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Surface Card** | `#121212` | `bg-[#121212]` |
| **Card Radius** | 18px | `rounded-[18px]` |

---

## 2. Specyfikacja Ekranu 14 Info Pop-up (ID 154:442)

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
| **Tytuł *Zrób w przerwie*** | 20px | 700 (Bold) | 120% | `#39FF14` |
| **Podtytuł (Sekcja)** | 16px | 600 (SemiBold) | 130% | `#FFFFFF` |
| **Body Text (Akapit)** | 14px | 400 (Regular) | 150% | `#FFFFFF` |
| **Przycisk *Rozumiem*** | 16px | 800 (ExtraBold) | 100% | `#000000` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Pop-up Card** | 2px solid `#39FF14` | `0 0 20px rgba(57, 255, 20, 0.3)` | Zielona ramka strategii |
| **Przycisk: Rozumiem** | Brak (Wypełnienie) | `0 4px 15px #39FF14` | CTA wysokiego priorytetu |
| **Close Icon (X)** | Brak | `None` | Dyskretny element nawigacyjny |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Nagłówek Pop-upu

- **Struktura:** Tytuł strategii (Lewo) + Ikona zamknięcia *X* (Prawo).
- **Interakcja:** Kliknięcie *X* lub przycisku zamknięcia przywraca widoczność **Ekranu 07 Proza życia**.

### 2. Sekcja Treści (Edukacja ADHD)

- **Zasilenie dopaminy:** Wyjaśnienie, że mechaniczne zadania (np. pranie, prosty mail) pozwalają mózgowi odpocząć od głębokiego myślenia.
- **Reset kontekstu:** Sugestia, że zmiana kontekstu jest lekarstwem na znużenie po ciężkiej pracy.
- **Delegowanie:** Stały element skłaniający do refleksji nad tym, czy zadanie musi być wykonane osobiście, czy może zostać zautomatyzowane.

### 3. Przycisk Akcji (CTA)

- **Styl:** Pełna pigułka w kolorze Neon Green z czarnym tekstem.
- **Logika:** Zamknięcie modalu i powrót do widoku źródłowego (07).

---

**Wytyczne dla Lead Developera:**

- **Kontekst tła:** Podobnie jak w poprzednich popupach info, tło ekranu 07 musi być przyciemnione i rozmyte (`backdrop-filter: blur(4px)`).
- **Wyzwalacz:** Pop-up jest aktywowany przez kliknięcie ikony „ⓘ” przy pigułce „Zrób w przerwie” na ekranie **07**.
- **Animacja:** Zalecane użycie `AnimatePresence` (jeśli w React) dla płynnego wejścia i wyjścia modalu.

Czy chcesz, abym przeszedł teraz do inżynierii wstecznej dla **Ekranu 15 Kalendarz - zrobione** (Strona 4 **PDF**)?