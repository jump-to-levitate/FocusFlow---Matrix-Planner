Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 29: Context Menu (Panel Akcji)**. Zgodnie ze specyfikacją techniczną, ekran ten nie jest osobnym widokiem pełnoekranowym, lecz **nakładką (overlay)** wywoływaną przez długie przytrzymanie (long press ≥500ms) zadania na listach.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px (Overlay) | `fixed inset-0 w-full h-full` |
| **Overlay BG** | `#000000` (80% Opacity) | `bg-black/80 backdrop-blur-sm` |
| **Action Pill Radius** | 50px | `rounded-full` |
| **Zrobione Green** | `#39FF14` | `text-[#39FF14]` / `border-[#39FF14]` |
| **Usuń Red** | `#FF0000` | `text-[#FF0000]` / `border-[#FF0000]` |
| **Standard Purple** | `#A020F0` | `text-[#A020F0]` / `border-[#A020F0]` |

---

## 2. Specyfikacja Ekranu 29 Context Menu (ID 190:500)

### A. Layout & Grid (Komponent Pływający)

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Overlay** | `p-6` | `0` | `flex flex-col justify-center` |
| **Action Group** | `px-4 py-6` | `w-full max-w-[340px] mx-auto` | `space-y-4` |
| **Action Pill** | `px-8 py-4` | `w-full` | `flex justify-center items-center` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Etykieta Akcji** | 18px | 800 (ExtraBold) | 100% | Biały (domyślnie) |
| **Akcja *ZROBIONE*** | 18px | 800 (ExtraBold) | 100% | `#39FF14` |
| **Akcja *USUŃ*** | 18px | 800 (ExtraBold) | 100% | `#FF0000` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Pigułka Akcji** | 2px solid `variable` | `0 0 12px var(--glow)` | Kolor zgodny z typem akcji |
| **Stan Active** | 2px solid `#FFFFFF` | `0 0 20px rgba(255, 255, 255, 0.5)` | Podświetlenie przy kliknięciu |
| **Tło Overlay** | None | `None` | `backdrop-filter: blur(4px)` |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Pigułka *START FOCUS* (Tylko dla Q1/Q2)

- **Styl**: Zielony obrys i glow.
- **Interakcja**: Przenosi bezpośrednio do **Ekranu 04 (Timer)** z wybranym zadaniem.

### 2. Pigułka *ZROBIONE* (Success Action)

- **Styl**: Pełny neonowy zielony obrys.
- **Logika**: Wyzwala animację `fade-out` karty zadania pod spodem, inkrementuje liczniki w Raportach i przenosi zadanie do **Ekranu 11 (Aktywność dnia)**.

### 3. Pigułki *EDYTUJ* / *PRZENIEŚ DO...* / *NOTATKA*

- **Styl**: Fioletowy obrys (Standard Purple).
- **Funkcja**: *NOTATKA* otwiera **Ekran 28**, *EDYTUJ* wraca do **Ekranu 03 (Brain Dump Form)**.

### 4. Pigułka *USUŃ* (Danger Action)

- **Styl**: Czerwony obrys i delikatny czerwony glow.
- **Logika**: Trwałe usunięcie z repozytorium bez naliczania statystyk.

---

## 4. Wytyczne dla Lead Developera

- **Filtrowanie Akcji**: System musi dynamicznie ukrywać przycisk `**START** **FOCUS**` dla zadań z ćwiartek **III** i IV (Q3/Q4 nie kwalifikują się do Deep Work).
- **Optimistic UI**: Po kliknięciu `**ZROBIONE**` lub `**USU**Ń`, menu musi zamknąć się natychmiast, a karta zadania na liście źródłowej powinna zniknąć z animacją trwającą ok. 220ms.
- **Zamykanie**: Kliknięcie w dowolny punkt tła (overlay) musi zamykać menu bez wykonywania akcji.
- **Haptic Feedback**: Każda pozycja w menu powinna stawiać delikatny opór wibracyjny (haptic click) przy naciśnięciu.

Specyfikacja ta domyka logikę interakcji dla wszystkich list zadań w systemie FocusFlow. Czy przygotować teraz specyfikację dla **Ekranu 24 (Wszystko na dzisiaj)**, który agreguje te wszystkie stany?