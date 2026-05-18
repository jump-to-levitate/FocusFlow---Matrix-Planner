📘 Spec Driven Development – instrukcja pracy projektowej ## Założenia metody Spec Driven Development (**SDD**) to podejście, w którym:

specyfikacja (plan) poprzedza implementację,

każda funkcjonalność ma jawny, wersjonowany opis,

implementacja jest deterministycznie generowana lub wspierana przez AI,

repozytorium stanowi źródło prawdy (single source of truth).

Celem jest:

skalowalność pracy,

powtarzalność procesu,

audytowalność decyzji,

możliwość delegowania pracy do agentów AI.

## Struktura repozytorium

Każdy projekt musi posiadać następującą strukturę:

/docs   /architecture   /business   /tech   /plans   /roles     /product_owner     /ux_ui     /architect     /developer     /tester implemented_features.md implemented_plans.md **README**.md ## Dokumentacja – katalog /docs 3.1 Architektura (/docs/architecture) Zawiera:

opis systemu (wysokopoziomowy),

diagramy (C4, **UML** lub opis tekstowy),

decyzje architektoniczne (**ADR** – Architecture Decision Records).

Minimalny plik:

system_overview.md adr_001.md adr_002.md 3.2 Wymagania biznesowe (/docs/business) Zawiera:

cele produktu,

user stories,

przypadki użycia,

ograniczenia biznesowe.

3.3 Stos technologiczny (/docs/tech) Zawiera:

stack (np. React, Node, PostgreSQL),

uzasadnienie wyborów,

ograniczenia technologiczne,

konwencje projektowe.

3.4 Plany (/docs/plans) Najważniejszy katalog w **SDD**.

Każdy plik = jedna mała funkcjonalność.

Format:

PLAN_<nazwa_funkcjonalnosci>.md Przykład:

PLAN_user_registration.md ## Struktura planu (obowiązkowa) Każdy plan musi zawierać:

# Nazwa funkcjonalności ## 1. Cel Opis biznesowy funkcjonalności. ## 2. Zakres Co wchodzi / nie wchodzi w zakres. ## 3. Wymagania funkcjonalne - ... - ... ## 4. Wymagania niefunkcjonalne - wydajność - bezpieczeństwo - UX ## 5. Kontekst techniczny - komponenty - API - dane ## 6. Kroki implementacji 1. ... 2. ... 3. ... ## 7. Kryteria akceptacji - ... - ... ## 8. Testy - unit - integracyjne

## Rejestry projektu (pliki główne) 5.1 implemented_plans.md Lista wszystkich planów:

- [ ] PLAN_user_registration.md - [x] PLAN_login.md
5.2 implemented_features.md
Opis zaimplementowanych funkcjonalności:

## User Registration - status: DONE - plan: PLAN_user_registration.md - opis: użytkownik może założyć konto

## Workflow pracy z AI Każdy student musi skonfigurować agenta AI (np. Kilocode, Codex, Windsurf) z dwoma głównymi workflow:

6.1 Workflow: plan Wejście:

opis funkcjonalności

Wyjście:

kompletny plik /docs/plans/PLAN_*.md

Wymagania:

zgodność ze strukturą planu,

granularność: mała funkcjonalność,

jednoznaczność (brak nieprecyzyjnych zapisów).

6.2 Workflow: implement Wejście:

plik planu

Wyjście:

kod + testy + aktualizacja dokumentacji

Wymagania:

implementacja zgodna z planem,

brak rozszerzania zakresu,

aktualizacja:

implemented_plans.md

implemented_features.md

## Role projektowe (obowiązkowe)

Każdy projekt musi zawierać dokumentację dla ról:

Product Owner (/docs/roles/product_owner) wizja produktu

backlog

priorytety

UX/UI (/docs/roles/ux_ui) makiety

przepływy użytkownika

zasady UX

Architect (/docs/roles/architect) decyzje techniczne

modele systemu

integracje

Developer (/docs/roles/developer) standardy kodu

konwencje

workflow implementacji

Tester (/docs/roles/tester) strategia testów

scenariusze testowe

przypadki edge-case

## Proces pracy (krok po kroku)

Zdefiniuj wymaganie (Product Owner)

Stwórz plan (plan)

Zatwierdź plan (review)

Uruchom implementację (implement)

Dodaj testy

Zaktualizuj dokumentację

Commit + PR

## Zasady krytyczne

Nie implementujemy bez planu

Plan = kontrakt

Jedna funkcjonalność = jeden plan

Repozytorium musi być samodokumentujące się

AI nie zastępuje myślenia – tylko egzekwuje plan

## Kryteria zaliczenia

Projekt zostanie oceniony na podstawie:

jakości dokumentacji,

spójności planów i implementacji,

poprawności workflow AI,

granularności funkcjonalności,

kompletności repozytorium.

## Najczęstsze błędy

zbyt duże plany,

brak kryteriów akceptacji,

implementacja „na skróty”,

brak aktualizacji dokumentacji,

niespójność między planem a kodem.