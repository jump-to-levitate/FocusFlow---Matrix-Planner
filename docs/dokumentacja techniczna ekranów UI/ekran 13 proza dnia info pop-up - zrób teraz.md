Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 13 Proza życia - info pop-up „zrób teraz”** (Strona 30 pliku **PDF**). Ten modal edukacyjny wspiera użytkownika w natychmiastowej egzekucji drobnych zadań (zasada 10 minut), co zapobiega kumulacji mikro-stresorów w systemie poznawczym.

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

## 2. Specyfikacja Ekranu 13 Info Pop-up (ID 154:351)

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
| **Tytuł *Zrób teraz*** | 20px | 700 (Bold) | 120% | `#39FF14` |
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

- **Struktura:** Tytuł strategii *Zrób teraz* (Lewo) + Ikona zamknięcia *X* (Prawo).
- **Interakcja:** Kliknięcie *X* zamyka modal i wraca do widoku **07 Proza życia**.

### 2. Sekcja Treści (Edukacja ADHD)

- **Zasada 10 minut:** Wyjaśnienie, że jeśli zadanie zajmuje mniej niż 10 min, należy je wykonać natychmiast, aby uciszyć „hałas w głowie”.
- **Uciszanie impulsów:** Wskazówka dotycząca odpalenia muzyki i ustawienia timera, aby uciszyć zadanie działaniem.
- **Delegowanie:** Powielona sekcja skłaniająca do refleksji nad automatyzacją lub zleceniem zadania.

### 3. Przycisk Akcji (CTA)

- **Styl:** Pełna pigułka (Pill) w kolorze Neon Green z czarnym tekstem.
- **Logika:** Zamknięcie pop-upu i powrót do **07 Proza życia**.

---

**Wytyczne dla Lead Developera:**

- **Stan tła:** Podobnie jak w Ekranie 12, tło musi być przyciemnione (`bg-black/70`) z efektem rozmycia tła (Blur), przy zachowaniu widoczności listy zadań ekranu 07.
- **Dostępność:** Przycisk *Rozumiem* powinien automatycznie otrzymywać `focus` po otwarciu modalu.
- **Wyzwalacz:** Pop-up jest wywoływany przez kliknięcie ikony „ⓘ” przy pigułce „Zrób teraz” na ekranie **07**.

Czy przygotować specyfikację dla ostatniego pop-upu z tej serii – **Ekranu 14** (zrób w przerwie)?