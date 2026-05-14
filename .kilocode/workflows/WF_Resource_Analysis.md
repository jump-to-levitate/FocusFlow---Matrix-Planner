```markdown
# WF_Resource_Analysis

**Cel:** PrzeprowadziÄ‡ audyt zasobĂłw niezbÄ™dnych do realizacji produktu SaaS: czas (osoboâ€‘dni), budĹĽet (koszty bezpoĹ›rednie i poĹ›rednie) oraz zewnÄ™trzne integracje wymagane do uruchomienia MVP i skalowania.

### **1. Preflight (wejĹ›ciowe zaĹ‚oĹĽenia)**

- **KrĂłtki opis produktu / 1â€‘liner:**
- **Stage:** (Idea / MVP / Scaling)
- **Horyzont planowania:** (30 / 90 / 180 dni)
- **GĹ‚Ăłwny cel audytu:** (np. oszacowaÄ‡ minimalny budĹĽet MVP, zidentyfikowaÄ‡ krytyczne integracje)

### **2. Audyt Czasu (Time Audit)**

Podziel zadania na kategorie i oszacuj w osoboâ€‘dniach:

- **Core development:** rdzeĹ„ produktu, backend, API, frontend.
- **Integracje:** implementacja zewnÄ™trznych API i utrzymanie.
- **DevOps / Infra:** CI/CD, hosting, monitoring.
- **Design & UX:** prototypy, testy uĹĽytecznoĹ›ci.
- **QA:** testy manualne/automatyczne.
- **Growth & Ops:** landing page, onboarding, marketing podstawowy.
- **Support & Ops:** przygotowanie materiaĹ‚Ăłw wsparcia.

Dla kaĹĽdej kategorii: minimalne (MVP), optymalne (PMF) i bufor ryzyka (20â€“30%).

### **3. Audyt BudĹĽetu (Budget Audit)**

Rozbij koszty na staĹ‚e i zmienne oraz jednorazowe:

- **Jednorazowe koszty:** prototypy, licencje narzÄ™dziowe, konsultacje prawne.
- **MiesiÄ™czne koszty:** hosting, baza danych, narzÄ™dzia monitoringowe, pĹ‚atne integracje.
- **Koszty pracy:** wynagrodzenia / stawki kontraktorĂłw (przelicz na osoboâ€‘dni).
- **Marketing / Customer Acquisition:** testowy budĹĽet na kanaĹ‚y (pierwsze 3 miesiÄ…ce).

Zsumuj: minimalny budĹĽet MVP (pierwsze 3 miesiÄ…ce) i budĹĽet rozszerzony (6â€“12 miesiÄ™cy).

### **4. Integracje ZewnÄ™trzne (External Integrations)**

Lista integracji oceniona wg krytycznoĹ›ci i trudnoĹ›ci implementacji:

- **Kategoryzacja:** Krytyczne / Opcjonalne / Niceâ€‘toâ€‘have.
- **PrzykĹ‚ady:** pĹ‚atnoĹ›ci (Stripe/PayPal), auth (Auth0/OKTA), CRM (HubSpot/Pipedrive), marketplace (Shopify), storage (S3), email (SendGrid), analytics (GA/Amplitude), webhooks/queue (Rabbit/Kafka).
- **Dla kaĹĽdej integracji:** wymagane scope API, koszty licencyjne, szacowany czas implementacji, punkty ryzyka (rate limits, compliance).

### **5. Macierz PriorytetĂłw (Prioritization Matrix)**

UĹĽyj prostego arkusza: funkcja/integra â†’ wartoĹ›Ä‡ biznesowa (1â€“5) Ă— trudnoĹ›Ä‡ (1â€“5) â†’ priorytet.

WyrĂłĹĽnij elementy krytyczne do MVP vs. elementy moĹĽliwe do dodania po uruchomieniu.

### **6. Estymacje i Alokacja ZasobĂłw**

- Przydziel role (np. 0.5 FTE dev, 0.2 FTE designer) i odpowiadajÄ…ce im osoboâ€‘dni.
- OkreĹ›l minimalny zespĂłĹ‚ do uruchomienia MVP i listÄ™ zadaĹ„ z termami.
- Dodaj bufor (20â€“30%) na nieprzewidziane prace i integracyjne opĂłĹşnienia.

### **7. Ryzyka i Mitigacje**

- ID ryzyka (np. opĂłĹşnienia integracji pĹ‚atnoĹ›ci) â†’ wpĹ‚yw â†’ prawdopodobieĹ„stwo â†’ plan mitigacji.
- Przygotuj alternatywy (backup integrations, manual workarounds) dla krytycznych punktĂłw.

### **8. Plan Finansowy KrĂłtkoterminowy**

- Punkty progowe (runway): ile miesiÄ™cy dziaĹ‚ania przy minimalnym burn rate.
- Breakâ€‘even target: ile pĹ‚atnych uĹĽytkownikĂłw / ARPA potrzebne do pokrycia kosztĂłw.

### **9. Checklista WdroĹĽeniowa (MVPâ€‘Ready)**

- Krytyczne integracje zaimplementowane i przetestowane.
- Automatyczny onboarding i tracking kluczowych eventĂłw.
- Podstawowy monitoring (uptime, error reporting) i kopie zapasowe.
- Mechanizm pĹ‚atnoĹ›ci i prosty billing.
- Dokumentacja operacyjna dla dziaĹ‚aĹ„ supportu.

### **10. Output / Deliverables**

Po wykonaniu audytu dostarcz:

- Arkusz z osoboâ€‘dniami i budĹĽetem (CSV/Google Sheet).
- Lista integracji z ocenÄ… krytycznoĹ›ci i estymacjami czasu/kosztĂłw.
- Macierz priorytetĂłw.
- KrĂłtki plan dziaĹ‚ania (30/90/180 dni) z przypisanymi wĹ‚aĹ›cicielami.

---

### **Instrukcja dla AgentĂłw (do wklejenia w system prompt):**

> Przy uruchomieniu `WF_Resource_Analysis` poproĹ› uĹĽytkownika o: 1) 1â€‘liner produktu, 2) etap produktu (Idea/MVP/Scaling), 3) dostÄ™pne zasoby (liczba devĂłw, budĹĽet miesiÄ™czny), 4) lista planowanych integracji. NastÄ™pnie wygeneruj: skrĂłcony audyt czasu (osoboâ€‘dni) dla MVP, minimalny budĹĽet 3â€‘miesiÄ™czny, listÄ™ krytycznych integracji z estymacjami i macierz priorytetĂłw. ZaĹ‚Ä…cz link do arkusza z estymacjami.


