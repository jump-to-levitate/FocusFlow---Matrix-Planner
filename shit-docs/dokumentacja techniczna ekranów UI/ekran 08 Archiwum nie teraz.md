Jako Senior UI/UX Engineer przygotowałem pełną inżynierię wsteczną oraz specyfikację techniczną dla **Ekranu 08 Archiwum: Nie Teraz** (Strona 24 pliku **PDF**). Ekran ten zarządza zadaniami z IV ćwiartki (Niepilne/Nieważne), służąc jako „poczekalnia” dla dystraktorów i projektów o niskim priorytecie.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Action: Przywróć** | `#39FF14` (Neon Green) | `border-[#39FF14]` / `text-[#39FF14]` |
| **Action: Odrzuć** | `#FF0000` (Red) | `border-[#FF0000]` / `text-[#FF0000]` |
| **Action: Zrobione** | `#4A4A4A` (Dark Gray) | `bg-[#4A4A4A]` / `text-[#FFFFFF]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |

---

## 2. Specyfikacja Ekranu 08 Archiwum: Nie Teraz (ID 2:9)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-32` | `0 auto` | `space-y-6` |
| **Header Section** | `p-0` | `mb-4` | `space-y-1` |
| **Category Sections** | `p-0` | `mb-6` | `space-y-4` |
| **Task Items** | `px-3 py-2` | `w-full` | `space-y-2` |
| **Action Panel (Footer)** | `px-4 py-6` | `fixed bottom-24` | `justify-between gap-2` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Tytuł *NIE TERAZ*** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Licznik dystraktorów** | 13px | 400 (Regular) | 100% | `#B0B0B0` |
| **Nagłówek kategorii** | 12px | 600 (SemiBold) | 100% | `#B0B0B0` (Caps) |
| **Nazwa zadania** | 14px | 500 (Medium) | 130% | `#FFFFFF` |
| **Etykiety przycisków** | 14px | 800 (ExtraBold) | 100% | Zależnie od akcji |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Pigułka Zadania** | 1px solid `#FFFFFF` | `None` | Opacity 20% dla obramowania. |
| **Guzik: Przywróć** | 2px solid `#39FF14` | `0 0 10px #39FF14` | Glow zielony (Neon) |
| **Guzik: Zrobione** | None (Fill `#4A4A4A`) | `None` | Neutralny, wyciszony |
| **Guzik: Odrzuć** | 2px solid `#FF0000` | `0 0 10px #FF0000` | Glow czerwony (Alert) |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Header Archiwum

- **Komponent:** `Flex-col`. Tytuł ***NIE** **TERAZ*** oraz dynamiczny licznik odrzuconych dystraktorów w tym miesiącu.
- **Licznik:** Pobiera wartość `state.rejectedTasksThisMonth`.

### 2. Sekcje Kategorii (Q4 Sub-categories)

- **Kategorie:** Optymalizacja, Side questy, Hobby, Rozrywka.
- **Struktura:** Nagłówek tekstowy (Uppercase) + lista pigułek z zadaniami.
- **Interakcja:** Wybranie zadania z listy aktywuje Panel Akcji na dole ekranu.

### 3. Panel Akcji *Sticky Footer*

- **Przywróć:** Przenosi wybrane zadanie z powrotem do **Ekranu 03** w celu ponownej klasyfikacji.
- **Zrobione:** Oznacza zadanie jako wykonane (akcja pasywna, nie wpływa na główne statystyki Deep Work).
- **Odrzuć:** Trwałe usunięcie zadania. Inkrementuje licznik `rejectedTasksThisMonth` oraz dopisuje zadanie do listy odrzuconych na **Ekranie 11**.

---

**Wytyczne dla Lead Developera:**

- **Zarządzanie stanem:** Ekran musi obsługiwać multi-wybór zadań lub wybór pojedynczy (zgodnie z **PDF** str. 24).
- **Logika Odrzucania:** Akcja *Odrzuć* musi wywoływać natychmiastową animację `fade-out` dla pigułki i asynchronicznie aktualizować globalny licznik dystraktorów.
- **Tab Bar:** Aktywna ikona **Macierz** (pozycja 2) w kolorze fioletowym (`#**A020F0**`) z neonową kropką indykatora pod spodem.