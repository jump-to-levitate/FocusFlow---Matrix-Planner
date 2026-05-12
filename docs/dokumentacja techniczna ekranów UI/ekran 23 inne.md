Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 23 Inne** (Strona 33 pliku **PDF**). Ekran ten służy do zarządzania zadaniami, które nie kwalifikują się jako nawyki ani duże projekty, ale wymagają monitorowania i realizacji. Jest to dopełnienie modułu planowania w systemie „Hub & Spoke”.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Other Accent** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Pill Radius** | 50px | `rounded-full` |
| **Secondary Text** | `#B0B0B0` | `text-[#B0B0B0]` |

---

## 2. Specyfikacja Ekranu 23 Inne (ID 2:14)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Back Navigation** | `p-0` | `mb-2` | `None` |
| **Header Row** | `p-0` | `mb-6` | `space-y-1` |
| **Task List** | `p-0` | `mt-4` | `flex flex-col gap-3` |
| **Task Card (Pill)** | `px-6 py-4` | `w-full` | `justify-between items-center` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Przycisk Powrotu** | 14px | 600 (SemiBold) | 100% | `#A020F0` |
| **Tytuł *INNE*** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Licznik zadań** | 14px | 400 (Regular) | 100% | `#B0B0B0` |
| **Nazwa Zadania** | 16px | 600 (SemiBold) | 120% | `#FFFFFF` |
| **Etykieta przycisku** | 12px | 800 (ExtraBold) | 100% | `#000000` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Task Pill** | 1.5px solid `#A020F0` | `0 0 10px rgba(160, 32, 240, 0.2)` | Fioletowy obrys modułu planowania |
| **Back Button** | 1px solid `#A020F0` | `None` | Spójność z nawigacją Centrum |
| **CTA: START FOCUS** | None (Fill `#39FF14`) | `0 4px 12px #39FF14` | Akcja egzekucji (Neon Green) |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Przycisk Powrotu *< Centrum planowania*

- **Styl**: Fioletowa pigułka (Outline) wyrównana do lewej.
- **Interakcja**: Powrót do **Ekranu 06 Centrum Planowania**.

### 2. Karta Zadania *Inne* (Other Task Pill)

- **Budowa**: Nazwa zadania (Left) -> Przycisk ***START** **FOCUS*** (Right).
- **Dane**: Filtruje i wyświetla encje z `state.tasks`, które posiadają parametr `Category: 'Other'`.
- **Stan**: Jeśli zadanie ma przypisany konkretny `scheduledTime`, godzina wyświetla się małym drukiem pod nazwą zadania.

### 3. Przycisk *START FOCUS*

- **Styl**: Mała pigułka wypełniona neonową zielenią (`#**39FF14**`), tekst czarny, mocny Bold.
- **Logika**: Inicjuje routing do **Ekranu 04 Timer** z przekazaniem kontekstu wybranego zadania.

---

**Wytyczne dla Lead Developera:**

- **Zarządzanie Stanem**: Zadania w tym widoku są wyświetlane w porządku chronologicznym według `scheduledTime`. Zadania bez przypisanej godziny trafiają na koniec listy.
- **Pusty Stan**: Jeśli kategoria *Inne* nie zawiera zadań, wyświetl centralnie tekst: *"Brak innych zadań na liście. Użyj Brain Dump, aby coś dodać"*.
- **Tab Bar**: Aktywna ikona **Pulpit** (Home) w kolorze `#**39FF14**` z neonową kropką indykatora, zgodnie z hierarchią sub-ekranów planowania.

Czy chcesz teraz przygotować specyfikację dla **Ekranu 24 Wszystko na dzisiaj** (Strona 5 **PDF**), który jest widokiem wirtualnym agregującym priorytety?