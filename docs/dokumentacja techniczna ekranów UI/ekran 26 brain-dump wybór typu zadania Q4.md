Jako Senior UI/UX Engineer przygotowałem techniczną inżynierię wsteczną dla **Ekranu 26 Brain Dump - wybór typu zadania (Q4)** (Strona 9 pliku **PDF**). Ten pop-up jest „bezpiecznikiem” systemu – obsługuje zadania, które quiz zaklasyfikował jako niepilne i nieważne (IV ćwiartka), pomagając użytkownikowi w eliminacji dystraktorów lub segregacji pasywnych zainteresowań.

---

## 1. Fundamenty Systemu (Design Tokens)

| Token | Wartość | Klasa Tailwind (proponowana) |
| --- | --- | --- |
| **Canvas Size** | 430px x 932px | `w-[430px] h-[932px]` |
| **Overlay Background** | `#000000` (85% Opacity) | `bg-black/85 backdrop-blur-md` |
| **Archive Gray** | `#B0B0B0` (Light Gray) | `text-[#B0B0B0]` / `border-[#B0B0B0]` |
| **Danger Red** | `#FF0000` (Neon Red) | `text-[#FF0000]` / `border-[#FF0000]` |
| **Surface Dark** | `#121212` | `bg-[#121212]` |
| **Pop-up Radius** | 24px | `rounded-[24px]` |

---

## 2. Specyfikacja Ekranu 26 Pop-up Archiwizacji (ID 170:450)

### A. Layout & Grid

| Sekcja | Padding (Wewn.) | Margin (Zewn.) | Gap |
| --- | --- | --- | --- |
| **Overlay Container** | `p-6` | `fixed inset-0` | `flex items-center justify-center` |
| **Modal Card** | `px-6 py-10` | `w-full max-w-[390px]` | `flex flex-col gap-6` |
| **Header Group** | `p-0` | `mb-2` | `space-y-2 text-center` |
| **Action Stack** | `p-0` | `mt-2` | `flex flex-col gap-4` |

### B. Typography (Inżynieria Wsteczna)

| Element | Font-Size | Weight | Line-Height | Color |
| --- | --- | --- | --- | --- |
| **Główny Nagłówek** | 22px | 800 (ExtraBold) | 110% | `#FFFFFF` |
| **Badge *ARCHIWUM*** | 14px | 700 (Bold) | 100% | `#B0B0B0` (Caps) |
| **Etykieta Przycisku** | 18px | 800 (ExtraBold) | 100% | Biały / Czarny (kontrast) |
| **Sub-tekst (Opis)** | 11px | 400 (Regular) | 140% | `#B0B0B0` |

### C. Effects & Shaders

| Komponent | Border | Shadow / Glow | Logika wizualna |
| --- | --- | --- | --- |
| **Modal Card** | 2px solid `#FF0000` | `0 0 30px rgba(255, 0, 0, 0.3)` | Sygnał *Niski priorytet/Zagrożenie* |
| **Pigułki: Hobby/Fun** | 2px solid `#A020F0` | `None` | Kategorie pasywne (Outline) |
| **Przycisk: Odrzuć** | None (Fill `#FF0000`) | `0 4px 20px #FF0000` | Akcja eliminacji (Glow) |

---

## 3. Dekompozycja Atomowa Komponentów

### 1. Header Pop-upu (Context)

- **Budowa**: Tytuł *CO Z **TYM** **ROBIMY**?* oraz szary badge `[ **ARCHIWUM** / **NIE** **TERAZ** ]`.
- **Cel**: Uświadomienie użytkownikowi, że zadanie nie jest warte natychmiastowej uwagi (tzw. *Guilt-free decluttering*).

### 2. Przyciski Kategorii Pasywnych (Hobby / Rozrywka)

- **Styl**: Fioletowy obrys (Outline), biały tekst.
- **Logika**: Zadanie otrzymuje tag `category: 'hobby'` lub `category: 'fun'` i trafia na **Ekran 08 Archiwum** do odpowiedniej sekcji.

### 3. Przycisk *ODRZUĆ / ZAPOMNIJ* (Action)

- **Styl**: Pełna pigułka w kolorze Neon Red z białym lub czarnym tekstem (zależnie od finalnej czytelności w **PDF**).
- **Logika**: Zadanie jest trwale usuwane z bieżącej listy. System inkrementuje `rejectedTasksThisMonth` i wyświetla krótkie potwierdzenie (toast) o „oczyszczeniu głowy”.

---

**Wytyczne dla Lead Developera:**

- **Zarządzanie Stanem**: Pop-up jest wyzwalany, gdy `processQuiz()` na ekranie 03 zwróci `Quadrant IV`.
- **User Flow**: Wybranie dowolnej opcji musi kończyć proces Brain Dump i przekierowywać użytkownika na **Ekran 01 Pulpit** lub z powrotem na **03** (jeśli w kolejce są inne notatki do posortowania).
- **Micro-interaction**: Przycisk *Odrzuć* powinien mieć silniejszą wibrację (Haptic Feedback) niż pozostałe, aby fizycznie podkreślić akt usunięcia dystraktora.

Czy przygotować teraz ostatni pop-up z tej serii – **Ekran 27 (II ćwiartka)**?