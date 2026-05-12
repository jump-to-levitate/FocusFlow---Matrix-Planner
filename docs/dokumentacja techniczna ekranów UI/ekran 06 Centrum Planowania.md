Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 06 Centrum Planowania** (Strona 22 pliku **PDF**). Ekran ten pełni rolę głównego hubu nawigacyjnego w architekturze *Hub & Spoke*, kierując użytkownika do szczegółowych modułów planowania.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Background** | `#000000` | `bg-black` |
| **Primary Green** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Primary Purple** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Hub Pill Radius** | 50px | `rounded-full` |

---

## 2. Specyfikacja Ekranu 06 Centrum Planowania (ID 2:7)

### A. Layout & Grid (Hub & Spoke)

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Main Container** | `px-6 pt-10 pb-24` | `0 auto` | `space-y-6` |
| **Navigation Back** | `p-0` | `mb-4` | `None` |
| **Hub List** | `p-0` | `mt-8` | `flex flex-col gap-4` |
| **Hub Item (Pill)** | `px-8 py-5` | `w-full` | `justify-between items-center` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Back Button Text** | 14px | 600 (SemiBold) | 100% | `#A020F0` |
| **Tytuł Hubu** | 24px | 700 (Bold) | 120% | `#FFFFFF` |
| **Etykieta Hub Pill** | 16px | 800 (ExtraBold) | 100% | `#FFFFFF` |
| **Chevron / Icon** | 20px | N/A | 100% | `#FFFFFF` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Stan / Przeznaczenie |
| --- | --- | --- | --- |
| **Back Pill** | 1px solid `#A020F0` | `None` | Nawigacja powrotna do Macierzy |
| **Pill: Dzisiaj** | 2px solid `#39FF14` | `0 0 15px rgba(57, 255, 20, 0.5)` | Priorytet (Green Glow) |
| **Pills: Pozostałe** | 2px solid `#A020F0` | `0 0 12px rgba(160, 32, 240, 0.4)` | Standard (Purple Glow) |
| **Hub Surface** | None (Fill) | `0 4px 10px rgba(0, 0, 0, 0.5)` | Spójność z ciemnym tłem |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Przycisk Powrotu *< Macierz*

- **Struktura:** Pigułka o małej wysokości (ok. 36px), wyrównana do lewej krawędzi.
- **Interakcja:** Kieruje bezpośrednio do **02 Macierz Eisenhowera**.

### 2. Karta Hubu (Hub Spoke Pill)

- **Budowa:** Ikona (L) -> Tekst (Center-Left) -> Chevron/Strzałka (R).
- **Wariant Green (Do zrobienia dzisiaj):** Jedyna pigułka w kolorze neonowej zieleni z silnym efektem glow, co podkreśla jej natychmiastową ważność.
- **Warianty Purple (Reszta):** Pozostałe cztery pigułki (Kalendarz, Nawyki, Wielkie Projekty, Inne) mają fioletowy obrys i glow.

### 3. Ikony Systemowe (Custom Glyphs)

- **Lista:** Dla *Do zrobienia dzisiaj*.
- **Kalendarz:** Dla sekcji kalendarza.
- **Pętla (Loop):** Dla sekcji Nawyków.
- **Rakieta:** Dla *Wielkich Projektów*.
- **Trzy kropki:** Dla sekcji *Inne*.

---

**Wytyczne dla Lead Developera:**

- **Nawigacja:** Ekran 06 to klasyczny `Dispatcher`. Każda pigułka musi posiadać czysty `handler` kierujący do odpowiedniego sub-ekranu (20-23).
- **Layout:** Użyj `Flexbox` z `gap-4` dla listy hubu, aby zachować równe odstępy między pigułkami niezależnie od wielkości ekranu.
- **Tab Bar:** Aktywna ikona **Pulpit** (Home) w kolorze `#**39FF14**` z neonowym indykatorem pod spodem, mimo że logicznie jesteśmy w Centrum Planowania (zgodnie ze specyfikacją).