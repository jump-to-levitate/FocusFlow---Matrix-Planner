Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 19 Błąd wpisywania godziny** (Strona 20 pliku **PDF**). Jest to modalny pop-up typu „Soft Block”, który chroni spójność harmonogramu użytkownika, zapobiegając nakładaniu się sesji czasowych lub wprowadzaniu błędnych formatów.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Overlay Background** | `#000000` (75% Opacity) | `bg-black/75 backdrop-blur-sm` |
| **Warning Yellow** | `#FFD700` (Gold/Yellow) | `text-[#FFD700]` / `border-[#FFD700]` |
| **Action Purple** | `#A020F0` (Neon Purple) | `bg-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Pop-up Radius** | 20px | `rounded-[20px]` |

---

## 2. Specyfikacja Ekranu 19 Błąd wpisywania godziny (ID 179:500)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Overlay Container** | `p-6` | `fixed inset-0` | `flex items-center justify-center` |
| **Pop-up Card** | `px-6 py-8` | `w-full max-w-[360px]` | `flex flex-col gap-5` |
| **Icon Container** | `p-0` | `mx-auto mb-2` | `None` |
| **Text Section** | `p-0` | `text-center` | `space-y-2` |
| **Action Area** | `p-0` | `mt-4` | `w-full` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł *COŚ POSZŁO...*** | 20px | 800 (ExtraBold) | 110% | `#FFD700` |
| **Body Text (Błąd)** | 14px | 400 (Regular) | 150% | `#FFFFFF` |
| **Szczegół błędu** | 12px | 500 (Medium) | 140% | `#B0B0B0` |
| **Przycisk *POPRAW*** | 16px | 800 (ExtraBold) | 100% | `#FFFFFF` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Pop-up Card** | 2px solid `#FFD700` | `0 0 20px rgba(255, 215, 0, 0.3)` | Ostrzeżenie logiczne (Yellow Glow) |
| **Przycisk: Popraw** | Brak (Wypełnienie `#A020F0`) | `0 4px 15px rgba(160, 32, 240, 0.4)` | Powrót do edycji (Purple) |
| **Icon Shadow** | Brak | `0 0 10px #FFD700` | Podświetlenie symbolu ostrzegawczego |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Ikona Ostrzeżenia (Warning Glyph)

- **Budowa**: Żółty trójkąt równoboczny z zaokrąglonymi rogami i czarnym wykrzyknikiem *!* wewnątrz.
- **Symbolika**: Wskazuje na błąd walidacji danych (nakładające się godziny).

### 2. Komunikat o Konflikcie Czasowym

- **Nagłówek**: *COŚ **POSZ**ŁO **NIE** **TAK**...*.
- **Treść**: "Godziny sesji nachodzą na siebie lub format jest niepoprawny. Sprawdź, czy nie zaplanowałeś dwóch rzeczy w tym samym czasie*.

### 3. Przycisk Akcji *POPRAW"

- **Styl**: Szeroka pigułka (Pill) w kolorze fioletowym (`#**A020F0**`).
- **Interakcja**: Zamyka modal i przywraca fokus na pole wprowadzania czasu na **Ekranie 18**.

---

**Wytyczne dla Lead Developera:**

- **Trigger walidacji**: Pop-up musi zostać wywołany, jeśli funkcja `validateTimeSlot()` zwróci `overlap: true` lub `format: invalid` podczas kliknięcia *ZAPISZ* na ekranie 18.
- **User Flow**: Po zamknięciu modalu (kliknięcie *POPRAW* lub tła), aplikacja powinna automatycznie podświetlić na czerwono kolidujące pigułki czasu na Ekranie 18.
- **Z-Index**: Pop-up musi znajdować się nad Tab Barem, aby uniemożliwić ucieczkę z formularza bez poprawienia błędu krytycznego dla kalendarza.

Czy chcesz, abym teraz przygotował specyfikację dla **Ekranu 20 Do zrobienia dzisiaj** (Strona 21 **PDF**)?