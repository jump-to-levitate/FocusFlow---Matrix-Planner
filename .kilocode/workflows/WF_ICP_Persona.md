## WF_ICP_Persona â€” Definiowanie Idealnego Klienta (ICP) i Jego ProblemĂłw

**Cel:** DostarczyÄ‡ powtarzalnÄ… procedurÄ™ definiowania Ideal Customer Profile (ICP) oraz mapowania kluczowych problemĂłw i ich priorytetyzacji, tak aby Soloâ€‘Dev mĂłgĹ‚ szybko przejĹ›Ä‡ do badaĹ„, eksperymentĂłw i GTM.

### WejĹ›cia (What you need)
- KrĂłtki opis produktu / 1â€‘liner wartoĹ›ci
- Etap produktu (Idea / MVP / PMF)
- WstÄ™pne hipotezy o kliencie (branĹĽa, rola, wielkoĹ›Ä‡ firmy)
- (opcjonalnie) Wyniki `WF_Competitor_Audit` lub `WF_Job_To_Be_Done`

### WyjĹ›cia (Deliverables)
- SkrĂłcony profil ICP (1â€‘stronicowa karta)
- Lista 5â€“8 problemĂłw (opis + metryka wartoĹ›ci)
- Priorytetyzacja problemĂłw (Impact Ă— Ease / Confidence)
- Sugerowane nastÄ™pne eksperymenty (interview script, landing page, outreach)

### Procedura â€” krok po kroku

1) SformuĹ‚uj wstÄ™pny ICP (3 zdania)
	- BranĹĽa / segment (np. SaaS dla HR)
	- Rola decyzyjna (np. Head of People / Operations Manager)
	- WielkoĹ›Ä‡ organizacji i budĹĽet decyzyjny

2) Zbierz JTBD i konkretny kontekst (uĹĽyj `WF_Job_To_Be_Done`)
	- PrzeprowadĹş 5â€“10 krĂłtkich wywiadĂłw lub obserwacji (Job Snapshot)
	- Dla kaĹĽdego wpisu zbierz: Context, Motivation, Desired Outcome, Current Solution, Barriers, Trigger, WartoĹ›Ä‡ (liczby), Confidence

3) Mapuj i agreguj bĂłle (Pain Mapping)
	- Zgrupuj obserwacje tematycznie (onboarding, integracje, czas, koszty)
	- Dla kaĹĽdego bĂłlu okreĹ›l: kto go odczuwa, kiedy wystÄ™puje, jak czÄ™sto, jaka jest bezpoĹ›rednia wartoĹ›Ä‡ do odzyskania

4) Kwantyfikuj wartoĹ›Ä‡ (Value Hypotheses)
	- Przypisz metryki: czas oszczÄ™dzony, koszt unikniÄ™ty, wzrost konwersji itp.
	- Szacuj skalÄ™ (per user / per company / miesiÄ™cznie)

5) OceĹ„ Confidence i Ease
	- Confidence (0â€“10): jak dobre sÄ… dane (1 = opinia, 10 = telemetry / transakcje)
	- Ease (0â€“10): jak Ĺ‚atwo Soloâ€‘Dev zbuduje rozwiÄ…zanie (1 = skomplikowane, 10 = prosty feature/noâ€‘code)

6) Priorytetyzacja problemĂłw
	- UĹĽyj prostego wzoru: Priority = Impact Ă— Confidence Ă— Ease (lub RICE/ICE zamiennie)
	- Wybierz 1 Core Problem do natychmiastowego testu (najwyĹĽszy Priority przy wysokiej Ease)

7) Wynik: zbuduj kartÄ™ ICP i Problem Matrix
	- ICP card (1 akapit + persona bullets: pain, trigger, decision criteria, KPIs)
	- Problem Matrix (lista problemĂłw z Impact/Confidence/Ease i proponowanym eksperymentem)

### Szablony i Artefakty (quick copy)

- ICP Card (1 akapit)
  - Kto: [branĹĽa, rola, wielkoĹ›Ä‡]
  - Co: [gĹ‚Ăłwny job / cel]
  - BĂłl: [najwaĹĽniejszy problem]
  - Decision Criteria: [co sprawia, ĹĽe kupiÄ…?]

- Problem Row (dla kaĹĽdego problemu)
  - Problem: krĂłtki opis
  - Trigger: kiedy siÄ™ pojawia
  - Value: metriki (czas, koszt, %)
  - Current Solution: jak to robiÄ… teraz
  - Impact (1â€“10), Confidence (1â€“10), Ease (1â€“10), Priority = IĂ—CĂ—E
  - Suggested experiment: (landing page / interview / concierge MVP)

### Interview Script (7 pytaĹ„, z `WF_Job_To_Be_Done`)
1. Opowiedz o ostatnim razie, kiedy prĂłbowaĹ‚eĹ› [zadanie].
2. Co dokĹ‚adnie robiĹ‚eĹ› krok po kroku? (Current solution)
3. Co w tym procesie jest najbardziej frustrujÄ…ce? (Pain)
4. Jak rozpoznasz, ĹĽe problem zostaĹ‚ rozwiÄ…zany? (Desired outcome)
5. Ile czasu/kosztu to zabiera teraz? (Value)
6. Co byĹ› zapĹ‚aciĹ‚ za prostsze rozwiÄ…zanie? (Willingnessâ€‘toâ€‘pay)
7. Czy prĂłbowaĹ‚eĹ› juĹĽ czegoĹ› innego? Dlaczego to nie zadziaĹ‚aĹ‚o? (Alternatives)

### Szybkie eksperymenty (priorytetowane)
- Landing page + preâ€‘signup (test komunikacji i willingness to pay)
- 5â€‘10 rozmĂłw z targetem (potwierdzenie value metrics)
- Concierge / manual flow dla 3 klientĂłw (sprawdzenie willingness to pay)
- Small paid ad test (kieruj na jeden use case, mierz CTR â†’ signup)

### Integracja z innymi workflowami
- Po zdefiniowaniu ICP: uruchom `WF_Job_To_Be_Done` (jeĹ›li nie zrobione)
- JeĹ›li masz listÄ™ konkurentĂłw: uĹĽyj `WF_Competitor_Audit` by znaleĹşÄ‡ luki
- Gdy ICP i problemy sÄ… potwierdzone: przejdĹş do `WF_GTM_Strategy` (messaging + kanaĹ‚y)

### Checklista koĹ„cowa
- [ ] 1â€‘stronicowa karta ICP
- [ ] 5â€“10 Job SnapshotĂłw
- [ ] Problem Matrix z priorytetami
- [ ] 3 propozycje szybkich eksperymentĂłw
- [ ] Zapisany next step (GTM / MVP / Outreach)

---

### Instrukcja dla AgentĂłw (do wklejenia w system prompt):
> Gdy wywoĹ‚ujesz `WF_ICP_Persona`, poproĹ› o: 1) 1â€‘liner produktu, 2) etap (Idea/MVP/PMF), 3) wstÄ™pny opis ICP. NastÄ™pnie wygeneruj ICP Card, zbiĂłr 5â€“10 Job SnapshotĂłw (lub skrypt wywiadu) oraz Problem Matrix z zaproponowanymi eksperymentami. Priorytetyzuj wedĹ‚ug ImpactĂ—ConfidenceĂ—Ease.

