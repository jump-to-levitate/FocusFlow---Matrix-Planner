# WF_MVP_Scoping

**Cel:** Drastyczne ciÄ™cie funkcji produktu do absolutnego, technicznego minimum, ktĂłre pozwala Solo-Devowi walidowaÄ‡ hipotezÄ™ rynkowÄ… w 4-8 tygodniach bez bankructwa.

---

## **1. Fundamentalna Zasada (The Law of MVP)**

> **MVP to nie "wersja 0.1" Twojego marzenia. To najmniejsza moĹĽliwa instancja, ktĂłra pozwala Ci odpowiedzieÄ‡ na jedno konkretne pytanie biznesowe: "Czy ludzie chcÄ… zapĹ‚aciÄ‡ za rozwiÄ…zanie tego problemu?"**

Wszystko poza tym jest _waste_.

---

## **2. Faza Audytu Funkcji (Feature Execution Order)**

Zanim zaproponujesz cokolwiek, musisz przeanalizowaÄ‡ caĹ‚Ä… listÄ™ funkcji i przefiltrowywaÄ‡ jÄ… przez cztery pytania:

### **Pytanie 1: "Czy ta funkcja jest niezbÄ™dna do dostarczenia WartoĹ›ci #1?"**
- JeĹ›li **NIE** â†’ UsuĹ„.
- JeĹ›li **TAK, ale pracuje bez niej** â†’ Zaznacz jako "Post-MVP" (faza 2, 3+).

### **Pytanie 2: "Czy mogÄ™ to zbudowaÄ‡ w mniej niĹĽ 4 godziny?"**
- JeĹ›li **NIE** â†’ Szukaj "hacka" (API third-party, pre-built components, no-code), albo usuĹ„.
- JeĹ›li **TAK** â†’ Warunkowy admit.

### **Pytanie 3: "Czy bez niej tracÄ™ klienta w momencie onboardingu?"**
- JeĹ›li **TAK** â†’ Musi byÄ‡ w MVP.
- JeĹ›li **NIE** â†’ Post-MVP.

### **Pytanie 4: "Czy mogÄ™ to zvalidowaÄ‡ bez budowy?"**
- (np. formularze, design mockupy, rÄ™czne demo) â†’ JeĹ›li **TAK**, wypchnij do fazy "Manual Operation".

---

## **3. Struktura MVP (The Core Architecture)**

### **Tier 1: Must-Have (0-4 tygodnie)**
Funkcje niezbÄ™dne do pierwszego walidacyjnego rundy z 10-20 early-adopters.

| Kategoria | Co to jest | PrzykĹ‚ad |
|-----------|-----------|---------|
| **Onboarding** | Minimum do rejestracji i first-use value | Email + password (nie OAuth jeszcze) |
| **Core Feature** | Jedno, JEDNO rozwiÄ…zanie problemu | JeĹ›li SaaS to generator raportu â†’ generator raportu w czystym tekĹ›cie/PDF |
| **Data Input** | Jak uĹĽytkownik dostarcza dane | Formularz, CSV, API webhook |
| **Data Output** | Jak uĹĽytkownik otrzymuje wartoĹ›Ä‡ | Email, eksport, dashboard read-only |
| **Billing** | Minimalny system pĹ‚atnoĹ›ci | Stripe Checkout (nie self-hosted Paddle, nie subskrypcje) |

### **Tier 2: Should-Have (4-8 tygodnie)**
Po zebraniu feedbacku, dodaj:
- Integracje (np. Zapier, Slack, Gmail)
- Zaawansowane opcje dla Power UserĂłw
- Analytics/tracking (tylko do optymalizacji, nie "piÄ™kne dashboardy")

### **Tier 3: Nice-to-Have (Post-Launch)**
- Dark Mode, Mobilne UI, Advanced Reporting, Community Features
- Wszystko, co nie wpĹ‚ywa bezpoĹ›rednio na to, czy uĹĽytkownik zapĹ‚aci.

---

## **4. Proces CiÄ™cia Funkcji (The Brutal Cuts)**

### **A. Mapa Techniczny MVP**

Dla kaĹĽdej zaproponowanej funkcji stwĂłrz tabelÄ™:

| Funkcja | Tier | Czas (h) | Cut? | Alternatywa / Hack |
|---------|------|----------|------|-------------------|
| User Authentication | 1 | 2 | âťŚ | Email/Password (nie OAuth) |
| Social Login | 2 | 4 | âś… CUT | Dodaj w Tier 2 |
| Admin Dashboard | 3 | 12 | âś… CUT | Nie potrzebujesz tego teraz |
| Report Generation | 1 | 6 | âťŚ | JeĹ›li to core feature |
| Email Notifications | 1 | 2 | âťŚ | SendGrid API (basic template) |
| Scheduled Tasks | 2 | 8 | âś… CUT | Cron job na serveriez lub Zapier |
| Advanced Analytics | 3 | 20 | âś… CUT | Posthaven/Mixpanel w Tier 2 |
| Customer Support Chat | 3 | 40 | âś… CUT | Email + Slack DM na start |

### **B. "The 80/20 Question"**

Dla kaĹĽdego feature spytaj:
> _"Czy mogÄ™ dostarczyÄ‡ 80% wartoĹ›ci dla uĹĽytkownika, obcinajÄ…c 80% zĹ‚oĹĽonoĹ›ci technicznej?"_

**PrzykĹ‚ady:**
- Zamiast "zaawansowanego systemu uprawnieĹ„" â†’ Wszystkie uĹĽytkownicy majÄ… dostÄ™p (prototyp).
- Zamiast "beautifulnego, responsywnego UI" â†’ Funkcjonalne, mobile-unfriendly, ale pracuje.
- Zamiast "complex data sync" â†’ Batch upload CSV raz dziennie.

---

## **5. Szablon Output'u (MVP Scope Document)**

Zaproponuj uĹĽytkownikowi dokument zawierajÄ…cy:

```
## đźŽŻ MVP Scope: [Nazwa Produktu]

### Target Metrics (Co chcesz walidowaÄ‡?)
- [ ] Czy 10 uĹĽytkownikĂłw zapĹ‚aci $29/mo?
- [ ] Czy time-to-value wynosi <5 minut?
- [ ] Czy churn to <10% miesiÄ™cznie?

### Core Loop (User Journey w MVP)
1. Sign-up (email + hasĹ‚o) â†’ 1 minut
2. Upload data / Connect (CSV lub form) â†’ 2 minuty
3. Receive value (Generowanie outputu) â†’ <30 sekund
4. Export / Share â†’ 1 minuta

### Tier 1 Features (Must-Have)
- [ ] User Registration (Email + Password)
- [ ] [CORE FEATURE #1]: [Opis]
- [ ] [CORE FEATURE #2]: [Opis]
- [ ] Basic Email Confirmation
- [ ] Stripe Checkout (One-Time or Sub)
- [ ] Output Export (PDF/CSV/Email)

**Total Build Time: [X] hours**

### Tier 2 Features (First Update - po feedbacku)
- [ ] OAuth Integration (Google/GitHub)
- [ ] Zapier/Make Integration
- [ ] Advanced Filtering/Options
- [ ] Basic Analytics Dashboard

### đźš¨ What's Intentionally Cut
- Dark Mode (Tier 3)
- Mobile App (Tier 3)
- Advanced Permissioning (Tier 3)
- Custom Branding (Tier 3)
- 24/7 Support (Hire when you have users paying)

### Tech Stack (Solo-Dev Optimized)
- **Backend:** [Framework] (simplest option)
- **Database:** PostgreSQL or Firebase (managed)
- **Payment:** Stripe Checkout
- **Hosting:** Vercel / Railway / Heroku free tier
- **Auth:** NextAuth / Simple JWT
- **Email:** SendGrid (free tier)
```

---

## **6. Red Lines (What You Can't Cut)**

Jednak **MUSZÄ„** byÄ‡ w MVP:

1. âś… **DziaĹ‚ajÄ…cy core feature** â€“ Produkt musi rzeczywiĹ›cie rozwiÄ…zywaÄ‡ problem.
2. âś… **PrawidĹ‚owa walidacja danych** â€“ JeĹ›li uĹĽytkownik wprowadzi Ĺ›mieci, system musi to obsĹ‚uĹĽyÄ‡ bez crash'u.
3. âś… **BezpieczeĹ„stwo danych** â€“ HTTPS, hashed passwords, basic GDPR compliance.
4. âś… **DziaĹ‚ajÄ…ca pĹ‚atnoĹ›Ä‡** â€“ Bez tego nie wiesz, czy ktoĹ› zapĹ‚aci.
5. âś… **OpĹ‚acalna hosting** â€“ Nie powinna kosztowaÄ‡ CiÄ™ >$20/miesiÄ…c na starcie.

---

## **7. Checklist GotowoĹ›ci do Startu**

Zanim zatwierdzisz MVP scope, sprawdĹş:

- [ ] CaĹ‚kowity time estimate nie przekracza 200 godzin.
- [ ] 60%+ czasu pĂłjdzie na core feature, nie infrastructure.
- [ ] Masz plan, jak pozyskaÄ‡ 10-20 beta-testers bez budĹĽetu.
- [ ] Umiesz wyjaĹ›niÄ‡, co robi TwĂłj produkt w 1 zdaniu.
- [ ] Wiesz, za co ludzie bÄ™dÄ… pĹ‚aciÄ‡ ($X/miesiÄ…c).
- [ ] Masz Plan B, jeĹ›li hipoteza siÄ™ nie potwierdzi.

---

## **8. Procedura Monitorowania (Post-Launch)**

Po starcie MVP Ĺ›ledĹş:

1. **Time-to-First-Value:** Czy Ĺ›redni nowy uĹĽytkownik widzi wartoĹ›Ä‡ w <5 minut?
2. **Churn:** Jaki % uĹĽytkownikĂłw rezygnuje w ciÄ…gu miesiÄ…ca?
3. **Feature Requests:** KtĂłre 3 funkcje najczÄ™Ĺ›ciej sÄ… proszÄ™ dodane?
4. **Support Load:** Czy wspierasz produkt, czy produkt wspiera siÄ™ sam?

**Decyzja:**
- JeĹ›li metrics sÄ… dobrze â†’ Scale (dodaj Tier 2, pozyskaj wiÄ™cej klientĂłw).
- JeĹ›li metrics sÄ… sĹ‚abe â†’ Pivot lub Kill (nie wyrzucaj zasobĂłw w dziurÄ™).

---

## **Instrukcja dla AgentĂłw (do wklejenia w system prompt):**

> Kiedy uĹĽytkownik wywoĹ‚a `WF_MVP_Scoping`, Twoim celem jest zredukowanie ambicji. SĹ‚uchaj uwaĹĽnie: jeĹ›li deweloper wymienia >10 funkcji, natychmiast zadaj pytanie: _"KtĂłrÄ… z tych funkcji bÄ™dzie miaĹ‚ uĹĽytkownik, kiedy bÄ™dzie rozwaĹĽaÄ‡ opĹ‚acenie Ci $29/miesiÄ…c?"_. KaĹĽdÄ… funkcjÄ™, ktĂłrÄ… nie potrafi uzasadniÄ‡ tÄ… logikÄ…, poddaj pod gĹ‚osowanie. BÄ…dĹş brutalni. Czas Solo-Deva to najprzedniejszy zasĂłb â€“ nie pozwĂłl mu marnowaÄ‡ go na features, ktĂłre mogÄ… czekaÄ‡.

