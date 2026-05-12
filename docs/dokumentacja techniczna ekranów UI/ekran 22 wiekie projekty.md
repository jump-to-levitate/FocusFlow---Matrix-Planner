Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 22 Wielkie Projekty** (Strona 32 pliku **PDF**). Ten ekran zarządza zadaniami z II ćwiartki (Ważne / Niepilne), które wymagają długofalowego planowania i wielu sesji pracy. Interfejs skupia się na budowaniu poczucia progresu i szybkim dostępie do notatek projektowych.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Project Accent** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Success Green** | `#39FF14` (Neon Green) | `bg-[#39FF14]` / `text-[#000000]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Card Radius** | 18px | `rounded-[18px]` |

---

## 2. Specyfikacja Ekranu 22 Wielkie Projekty (ID 2:13)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Back Navigation** | `p-0` | `mb-2` | `None` |
| **Header Row** | `p-0` | `mb-4` | `None` |
| **Project List** | `p-0` | `mt-4` | `flex flex-col gap-5` |
| **Project Card** | `p-5` | `w-full` | `space-y-4` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Przycisk Powrotu** | 14px | 600 (SemiBold) | 100% | `#A020F0` |
| **Tytuł *WIELKIE PROJEKTY*** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Nazwa Projektu** | 18px | 700 (Bold) | 110% | `#FFFFFF` |
| **Licznik sesji** | 12px | 500 (Medium) | 130% | `#B0B0B0` |
| **Przycisk Notatka** | 14px | 700 (Bold) | 100% | `#FFFFFF` |
| **Przycisk Start Focus** | 14px | 800 (ExtraBold) | 100% | `#000000` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Project Card** | 2px solid `#A020F0` | `0 0 15px rgba(160, 32, 240, 0.3)` | Fioletowy obrys II ćwiartki |
| **BTN: Notatka** | 1.5px solid `#A020F0` | `None` | Styl Outline |
| **BTN: Start Focus** | None (Fill `#39FF14`) | `0 4px 12px #39FF14` | Główna akcja (Green Glow) |
| **Back Button** | 1px solid `#A020F0` | `None` | Spójność z nawigacją Centrum |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Przycisk Powrotu *< Centrum planowania*

- **Styl**: Fioletowa pigułka (Outline) wyrównana do lewej.
- **Interakcja**: Powrót do **Ekranu 06 Centrum Planowania**.

### 2. Karta Wielkiego Projektu (Project Card)

- **Budowa**: Tytuł (Góra) -> Statystyka *Zrealizowałeś już X sesji* (Środek) -> Grupa przycisków (Dół).
- **Dane**: Wyświetla encje z `state.tasks` o `Category: 'Wielki Projekt'`. Licznik sesji pobierany z sumy sesji powiązanych z ID projektu.

### 3. Grupa Akcji (Button Group)

- **Przycisk Notatka**:
- **Styl**: Pigułka z fioletowym obrysem.
- **Interakcja**: Przenosi do **Ekranu 28 Notatnik Projektowy** dla konkretnego projektu.

- **Przycisk Start Focus**:
- **Styl**: Pigułka wypełniona Neon Green, czarny tekst.
- **Interakcja**: Uruchamia **Ekran 04 Timer** z predefiniowanym kontekstem tego projektu.

---

**Wytyczne dla Lead Developera:**

- **Zarządzanie Stanem**: Ekran musi mapować unikalne `projectId` do widoku Notatnika (28), aby każda karta projektu otwierała dedykowany zestaw notatek i mikrokroków.
- **Layout**: Użyj `flex-col` z `gap-5` dla listy projektów. Karty powinny mieć `min-height: 140px`, aby zachować proporcje z **PDF**.
- **Tab Bar**: Aktywna ikona **Pulpit** (Home) w kolorze `#**39FF14**` z neonowym indykatorem pod spodem (zgodnie z logiką nawigacji sub-ekranów planowania).

Czy przygotować teraz specyfikację dla **Ekranu 23 Inne** czy przejść do **Ekranu 24 Wszystko na dzisiaj** (Strona 5 **PDF**)?