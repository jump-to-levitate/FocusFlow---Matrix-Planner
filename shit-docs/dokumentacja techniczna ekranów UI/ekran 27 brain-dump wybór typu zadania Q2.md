Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 27 Brain Dump - wybór typu zadania (Q2)** (Strona 10 pliku **PDF**). Ten pop-up jest kluczowym momentem w procesie „wyrzucania myśli z głowy” – dotyczy zadań ważnych, ale niepilnych (II ćwiartka), które są fundamentem długoterminowego rozwoju i dobrostanu.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Overlay Background** | `#000000` (85% Opacity) | `bg-black/85 backdrop-blur-md` |
| **Action Green** | `#39FF14` (Neon Green) | `text-[#39FF14]` / `border-[#39FF14]` |
| **Action Purple** | `#A020F0` (Neon Purple) | `text-[#A020F0]` / `border-[#A020F0]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Pop-up Radius** | 24px | `rounded-[24px]` |

---

## 2. Specyfikacja Ekranu 27 Pop-up Planowania (ID 170:480)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Overlay Container** | `p-6` | `fixed inset-0` | `flex items-center justify-center` |
| **Modal Card** | `px-6 py-10` | `w-full max-w-[390px]` | `flex flex-col gap-8` |
| **Header Section** | `p-0` | `mb-2` | `space-y-2 text-center` |
| **Button Group** | `p-0` | `mt-4` | `flex flex-col gap-4` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Nagłówek: *CZY CHCESZ...*** | 22px | 800 (ExtraBold) | 110% | `#FFFFFF` |
| **Badge *PLANOWANIE*** | 14px | 700 (Bold) | 100% | `#A020F0` (Caps) |
| **Etykieta TAK** | 18px | 800 (ExtraBold) | 100% | `#000000` |
| **Etykieta NIE** | 18px | 800 (ExtraBold) | 100% | `#FFFFFF` |
| **Sub-tekst (Opis)** | 12px | 400 (Regular) | 140% | `#B0B0B0` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Modal Card** | 2px solid `#A020F0` | `0 0 30px rgba(160, 32, 240, 0.4)` | Blask strategii II ćwiartki (Purple) |
| **Przycisk: TAK** | Brak (Fill `#39FF14`) | `0 4px 20px #39FF14` | Pozytywne domknięcie (Dopamina) |
| **Przycisk: NIE** | 2px solid `#A020F0` | `None` (Outline) | Odroczenie (Neutralne) |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Header Pop-upu (Context)

- **Budowa**: Centralny tytuł ***CZY** **CHCESZ** TO **ZAPLANOWA**Ć **TERAZ**?* oraz badge `[ **PLANOWANIE** / WAŻNE ]` w fioletowej ramce.
- **Cel**: Skłonienie użytkownika do natychmiastowego zabezpieczenia czasu na zadanie, które zazwyczaj jest spychane przez *pożary* (Q1/Q3).

### 2. Przycisk *TAK* (Primary Action)

- **Styl**: Pełna pigułka (Pill) Neon Green. Czarny tekst.
- **Logika**: Przekazuje tytuł zadania i typ kategoryzacji do **Ekranu 18 Dodaj Zadanie**. Użytkownik trafia bezpośrednio do pełnego formularza planowania daty i godziny.

### 3. Przycisk *NIE, PÓŹNIEJ* (Secondary Action)

- **Styl**: Pigułka z fioletowym obrysem (Outline). Biały tekst.
- **Logika**: Zadanie jest zapisywane w systemie jako `Quadrant II`, ale z flagą `unscheduled: true`. Trafia do odpowiedniej listy w **Centrum Planowania (06/22)** lub jako posortowana notatka na **Ekranie 05**, czekając na moment *tygodniowego przeglądu*.

---

**Wytyczne dla Lead Developera:**

- **Transition Flow**: Jeśli użytkownik kliknie *TAK*, zastosuj przejście `slide-left` do ekranu 18. Jeśli *NIE* – `fade-out` i powrót do ekranu 01 lub 03 (jeśli są kolejne zadania w kolejce do sortowania).
- **Stan Stanowczy**: Zadanie II ćwiartki jest zbyt ważne, by o nim zapomnieć. Jeśli użytkownik wybierze *NIE*, system powinien wyświetlić krótki toast: *"Zapisano w 'Wielkich Projektach'. Zaplanuj to, gdy poczujesz flow"*.
- **Tab Bar**: Podobnie jak przy innych pop-upach Brain Dump, pasek dolny jest ukryty pod overlayem, a nawigacja jest zablokowana do momentu podjęcia decyzji.

Zakończyliśmy serię pop-upów decyzyjnych Brain Dump (25, 26, 27). Czy chcesz teraz przejść do specyfikacji **Ekranu 18 Dodaj Zadanie** (formularze z **PDF** str. 1-3) czy innego elementu?