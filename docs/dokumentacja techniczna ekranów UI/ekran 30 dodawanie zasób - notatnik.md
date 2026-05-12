Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 30: Pop-up dodawania zasobów** (Strona 25 pliku **PDF**). Ten modalny widok umożliwia rozszerzenie projektu o materiały zewnętrzne (linki lub pliki), zasilając tablicę `Resource[]` w modelu danych zadania.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Overlay Background** | `#000000` (85% Opacity) | `bg-black/85 backdrop-blur-md` |
| **Active Purple** | `#A020F0` | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Input Radius** | 18px | `rounded-[18px]` |

---

## 2. Specyfikacja Ekranu 30 Pop-up Zasobów (ID 180:550)

### A. Layout & Grid (Modal Overlay)

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Modal Container** | `px-6 py-10` | `fixed inset-0` | `flex flex-col gap-6` |
| **Form Section** | `p-0` | `mt-4` | `space-y-6` |
| **Input Group** | `p-0` | `0` | `space-y-2` |
| **Action Button** | `py-5` | `w-full mt-auto` | `rounded-full` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Nagłówek Modala** | 22px | 800 (ExtraBold) | 110% | `#FFFFFF` |
| **Etykieta Pola (Label)** | 12px | 600 (SemiBold) | 100% | <br>`#B0B0B0` (Caps)

 |
| **Input Placeholder** | 16px | 400 (Regular) | 140% | <br>`#4A4A4A`

 |
| **Przycisk Załącz Plik** | 14px | 700 (Bold) | 100% | <br>`#A020F0`

 |
| **CTA: DODAJ DO PROJEKTU** | 18px | 800 (ExtraBold) | 100% | <br>`#000000`

 |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Input Fields** | 1px solid `#333333` | `None` (State: Default) | Czysty formularz |
| **Input Active** | 2px solid `#A020F0` | `0 0 10px rgba(160, 32, 240, 0.3)` | Stan Focus |
| **Main CTA** | None (Fill `#A020F0`) | `0 4px 20px rgba(160, 32, 240, 0.6)` | Maksymalny priorytet |
| **Przycisk Zamknij (X)** | Brak | `None` | Przezroczysty z ikoną `#FFFFFF`

 |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Pola Wprowadzania Danych (Inputs)

- **Nazwa zasobu**: Pole tekstowe z placeholderem „np. Inspiracje UI”.

- **Link (**URL**)**: Pole tekstowe z placeholderem „[https://...”.](https://...”.)

- **Walidacja**: System powinien sprawdzać poprawność formatu **URL** przed aktywacją przycisku zapisu.

### 2. Przycisk „ZAŁĄCZ PLIK Z SYSTEMU”

- **Styl**: Transparentny przycisk z fioletowym obrysem (Dashed) lub samym tekstem.

- **Funkcja**: Otwiera natywny selektor plików systemu operacyjnego (iOS/Android).

### 3. Przycisk Akcji „DODAJ DO PROJEKTU”

- **Logika**: Po kliknięciu tworzy obiekt `Resource` (typ: link lub file).
- **Efekt**: Emituje zdarzenie `TaskUpdated`, zamyka pop-up i wraca do **Ekranu 28**.

---

## 4. Wytyczne dla Lead Developera

- **User Flow**: Pop-up jest wyzwalany wyłącznie z sekcji „**ZASOBY**” na **Ekranie 28**.
- **Instant Update**: Zastosuj mechanizm „No-Refresh Append” – nowa pigułka zasobu musi pojawić się na liście pod spodem (na Ekranie 28) natychmiast po zamknięciu modala, z animacją `scale-in`.
- **Zarządzanie Błędami**: Jeśli użytkownik nie wprowadzi ani linku, ani nie załączy pliku, przycisk `**DODAJ** DO **PROJEKTU**` powinien pozostać w stanie `disabled` (półprzezroczysty, bez glow).
- **Anulowanie**: Kliknięcie w `X` lub tło (overlay) powinno wywołać `Maps('Screen28')` bez zapisywania zmian.

Czy przygotować teraz specyfikację dla **Ekranu 04 (Timer)**, aby opisać interakcje podczas aktywnej sesji pracy nad zadaniem?