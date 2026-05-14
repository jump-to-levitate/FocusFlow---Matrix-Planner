Jako Senior UI/UX Engineer przygotowałem pełną inżynierię wsteczną oraz specyfikację techniczną dla **Ekranu 10 Ekran błędu** (Strona 19 pliku **PDF**). Ten ekran to modalny pop-up typu „Hard Block”, który przerywa proces dodawania zadania, gdy użytkownik próbuje przekroczyć limit 5 zadań w I ćwiartce, co ma na celu zapobieganie paraliżowi decyzyjnemu u osób z **ADHD**.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Overlay Background** | `#000000` (70% Opacity) | `bg-black/70 backdrop-blur-sm` |
| **Alert Red** | `#FF0000` | `text-[#FF0000]` / `border-[#FF0000]` |
| **Interactive Purple** | `#A020F0` | `bg-[#A020F0]` / `border-[#A020F0]` |
| **Success Green** | `#39FF14` | `border-[#39FF14]` / `text-[#39FF14]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |

---

## 2. Specyfikacja Ekranu 10 Ekran błędu (ID 165:556)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Overlay Container** | `p-6` | `fixed inset-0` | `flex items-center justify-center` |
| **Pop-up Card** | `px-6 py-8` | `w-full max-w-[380px]` | `flex-col gap-6` |
| **Indicator Group** | `p-0` | `my-4` | `gap-2 justify-center` |
| **Button Stack** | `p-0` | `mt-4` | `flex-col gap-3` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł *PRZECIĄŻENIE...*** | 22px | 800 (ExtraBold) | 110% | `#FF0000` |
| **Body Text (Opis)** | 14px | 400 (Regular) | 150% | `#FFFFFF` |
| **Status Label (5/5)** | 12px | 700 (Bold) | 100% | `#FF0000` |
| **Pigułka *PEŁNA*** | 10px | 800 (ExtraBold) | 100% | `#FFFFFF` |
| **Button Label** | 14px | 700 (Bold) | 100% | Zróżnicowany (HEX) |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Pop-up Card** | 2px solid `#FF0000` | `0 0 25px rgba(255, 0, 0, 0.4)` | Stan krytyczny (Alert) |
| **Przycisk: Ponownie** | Brak (Wypełnienie) | `0 4px 15px #A020F0` | Akcja fioletowa (Główna) |
| **Przycisk: Zaplanuj** | 1.5px solid `#39FF14` | `None` | Sugestia Green Outline |
| **Przycisk: Notatki** | 1.5px solid `#A020F0` | `None` | Opcja Purple Outline |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Ikona Alertu (Error Indicator)

- **Budowa**: Czerwone kółko z centralnym symbolem *!*.
- **Umiejscowienie**: Wyśrodkowane nad tytułem.

### 2. Wskaźnik Obciążenia (Load Status)

- **Wizualizacja**: Rząd 6 kropek. Pierwsze 5 jest wypełnionych intensywną czerwienią, 6. kropka jest pusta lub pulsuje.
- **Etykieta**: ***PILNE** I WAŻNE: 5/5 **ZADANIA*** umieszczona bezpośrednio nad wizualizacją.
- **Badge**: Mała czarna pigułka z napisem *PEŁNA* obok licznika.

### 3. Panel Akcji Naprawczych

- **Przypisz ponownie**: Fioletowa pigułka (filled). Zamyka popup i resetuje quiz na ekranie 03.
- **Przenieś do: Zaplanuj (II)**: Pigułka z zielonym obrysem. Kieruje do **Ekranu 27** (kategoryzacja II ćwiartki).
- **Dodaj do notatek Brain Dump**: Pigułka z fioletowym obrysem. Zapisuje tytuł zadania na **Ekranie 05** i przerywa proces.

---

**Wytyczne dla Lead Developera:**

- **Warunek wyzwolenia**: Pop-up musi zostać wyświetlony, jeśli `quadrant_I_Count >= 5` w momencie próby zatwierdzenia zadania jako *Pilne i Ważne*.
- **UI Context**: Pod modalami musi być widoczny zamrożony i przyciemniony stan **Ekranu 03 Brain Dump**.
- **Z-Index**: Pop-up i jego overlay muszą przesłaniać Tab Bar, blokując nawigację do czasu podjęcia jednej z trzech decyzji naprawczych.

Czy przygotować teraz specyfikację dla **Ekranu 11 Aktywność dnia**?