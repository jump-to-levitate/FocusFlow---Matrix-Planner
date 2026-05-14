# WF_Job_To_Be_Done

**Cel:** ZidentyfikowaÄ‡ rzeczywiste zadania, ktĂłre uĹĽytkownicy prĂłbujÄ… zrealizowaÄ‡, oraz warunki sukcesu (desired outcomes). Skonstruowane z myĹ›lÄ… o Solo-Deva: szybko, mierzalnie i nastawione na walidacjÄ™ hipotez.

**Jak uĹĽywaÄ‡:** WypeĹ‚nij sekcje dla jednego ICP (Ideal Customer Profile). Zbierz 5â€“10 krĂłtkich wywiadĂłw lub obserwacji produktu, a nastÄ™pnie wpisz je w szablon "Job Snapshot". Skup siÄ™ na kontekĹ›cie, motywacjach i kryteriach sukcesu.

**Zasady:** Lean First, Distribution First, Solo-Dev Empathy, Data-Driven Skepticism â€” kaĹĽdÄ… obserwacjÄ™ traktuj jak hipotezÄ™ do przetestowania.

**Struktura pliku:**

**Summary**
- **Hipoteza problemu:** (1 zdanie)
- **Target ICP:** (kto, profil, stanowisko/funkcja)
- **Top insight:** (najwaĹĽniejsze odkrycie z sesji JTBD)

**JTBD Template (do wypeĹ‚nienia dla kaĹĽdego przypadku)**
- **Context (kiedy):** Opisz sytuacjÄ™, w ktĂłrej uĹĽytkownik dziaĹ‚aĹ‚.
- **Motivation (dlaczego):** Co skĹ‚oniĹ‚o go do szukania rozwiÄ…zania?
- **Desired Outcome (sukces):** Co musi siÄ™ staÄ‡, ĹĽeby uĹĽytkownik powiedziaĹ‚ "to dziaĹ‚a"?
- **Current Solution / Workaround:** Co robi teraz (narzÄ™dzia/manualne kroki)?
- **Barriers / Pain Points:** Co najczÄ™Ĺ›ciej przerywa lub komplikuje pracÄ™?
- **Trigger (co uruchamia potrzebÄ™):** zdarzenie / KPI / deadline itp.
- **WartoĹ›Ä‡ (w liczbach):** czas oszczÄ™dzony, koszty, strata przy bĹ‚Ä™dzie â€” jeĹ›li moĹĽliwe.
- **Confidence (0â€“10):** jak pewne sÄ… dane (opinia vs obserwacja vs telemetry)

**Job Snapshot â€” przykĹ‚ad wpisu**
- **Context:** "Rano, przed pierwszym meetingiem, kiedy muszÄ™ szybko przygotowaÄ‡ raport dla klienta."
- **Motivation:** "Nie chcÄ™ traciÄ‡ czasu na formatowanie, muszÄ™ mieÄ‡ gotowy PDF w 10 minut."
- **Desired Outcome:** "Gotowy raport w 10 min, poprawnie sformatowany, z wykresami z ostatnich 30 dni."
- **Current Solution:** "Eksport CSV -> Excel -> rÄ™czne wykresy -> eksport do PDF."
- **Barriers:** "RÄ™czna praca, bĹ‚Ä™dy w formuĹ‚ach, brak automatyzacji." 
- **Trigger:** "DzieĹ„ raportowy co poniedziaĹ‚ek lub nagĹ‚a proĹ›ba klienta."
- **WartoĹ›Ä‡:** "~2 godziny oszczÄ™dnoĹ›ci na raporcie, 5 raportĂłw/miesiÄ…c -> 10h/mies.")
- **Confidence:** 7

**Syntetyczna Analiza (po zebraniu 5â€“10 snapshotĂłw)**
- **Top 3 Jobs:** wypisz najczÄ™Ĺ›ciej powtarzajÄ…ce siÄ™ zadania (1 linia kaĹĽde).
- **Top 3 Desired Outcomes:** co uĹĽytkownicy uznajÄ… za sukces (mierzalne kryteria).
- **Primary Pain Drivers:** zidentyfikuj 3 gĹ‚Ăłwne przyczyny bĂłlu.
- **Variability:** w jakich sytuacjach job siÄ™ rĂłĹĽni (segmentacja ICP).

**Opportunity Mapping (jak to przekuÄ‡ w MVP)**
- **Core Job-to-be-Done (wybierz 1):** (najlepsza kombinacja palÄ…czoĹ›ci i Ĺ‚atwoĹ›ci rozwiÄ…zania)
- **Minimum success criteria:** co musi robiÄ‡ MVP, ĹĽeby uĹĽytkownik uznaĹ‚ go za wartoĹ›ciowy (3 kryteria).
- **Quick experiments:** 3 krĂłtkie testy do przeprowadzenia (landing page, zapisy, prosty manual concierge, prefill flows).

**Risks [RISKS]**
- **False positives:** uĹĽytkownicy deklarujÄ… potrzebÄ™, ale nie zapĹ‚acÄ….
- **Edge-case fragmentation:** jobs sÄ… mocno specyficzne, trudne do uogĂłlnienia.
- **High manual work:** rozwiÄ…zanie wymaga duĹĽo rÄ™cznej konfiguracji/supportu.

**MVP Scope (konkretnie dla Solo-Deva)**
- **Essential:** 1 core flow realizujÄ…cy Core Job-to-be-Done + 1 integracja (np. import danych) + szybki onboarding.
- **Analytics:** track time-to-first-value i % uĹĽytkownikĂłw, ktĂłrzy osiÄ…gnÄ™li Desired Outcome.
- **Do not build yet:** enterprise features, custom on-prem, heavy role management.

**Metrics to Track**
- **Activation:** % users reaching desired outcome in first session
- **Engagement:** repeat usage per week
- **Monetization:** percent converting to paid after achieving success
- **Efficiency:** manual hours per successful outcome

**Interview Script (krĂłtki, 7 pytaĹ„)**
1. "Opowiedz mi o ostatnim razie, kiedy prĂłbowaĹ‚eĹ› to zrobiÄ‡." (Context)
2. "Co wtedy dokĹ‚adnie robiĹ‚eĹ› krok po kroku?" (Current solution)
3. "Co byĹ‚o najgorsze w tym procesie?" (Pain)
4. "Jak rozpoznasz, ĹĽe to rozwiÄ…zanie zadziaĹ‚aĹ‚o?" (Desired outcome)
5. "Ile czasu/kosztu to zabiera teraz?" (Value)
6. "Co byĹ› zapĹ‚aciĹ‚ za prostsze rozwiÄ…zanie?" (Willingness-to-pay)
7. "Czy prĂłbowaĹ‚eĹ› czegoĹ› innego? Dlaczego to nie zadziaĹ‚aĹ‚o?" (Alternatives)

**Checklista zbierania danych**
- [ ] 5â€“10 wypeĹ‚nionych Job SnapshotĂłw
- [ ] Co najmniej 2 przytoczone metryki wartoĹ›ci (czas/koszt)
- [ ] Zidentyfikowany Core Job-to-be-Done
- [ ] 3 propozycje szybkich eksperymentĂłw

**Next Steps**
- **Sugerowany kolejny workflow:** `WF_MVP_Scoping` â€” zdefiniuj minimalny produkt realizujÄ…cy Core Job.
- **Szybki eksperyment:** Strona docelowa + prosty formularz pre-signup + outreach do 20 potencjalnych uĹĽytkownikĂłw.

**Interaktywne pytanie (do Ciebie)**
- KtĂłry ICP chcesz zbadaÄ‡ najpierw? Podaj krĂłtki opis lub 3 kontakty uĹĽytkownikĂłw â€” mogÄ™ przygotowaÄ‡ skrypt wywiadu i wypeĹ‚niÄ‡ pierwszy zestaw snapshotĂłw.


