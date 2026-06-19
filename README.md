# ing.pl cookie consent — Playwright

Przykład testu który pokrywa przepływ zgody na cookies na stronie banku `ing.pl`:

1. Wejście na stronę
2. Klik **Dostosuj**
3. Włączenie cookies **analitycznych**
4. Klik **Zaakceptuj wybrane**
5. Weryfikacja, że zgoda zapisała się w przeglądarce (`context.cookies()`)

## Struktura

```
ing-test/
├── .github/workflows/playwright.yml  # Pipeline CI/CD (matrix: 3 przeglądarki)
├── ing-POM/CookiePolicyPage.ts        # Page Object (wszystkie selektory bannera)
├── ing-test/
│   ├── cookies.spec.ts                # Test (kroki + asercje)
│   └── fixtures/ing-mock.html         # Mock bannera cookies (używany na CI)
├── playwright.config.ts               # Konfiguracja + matryca przeglądarek
├── tsconfig.json
└── package.json
```

## Uruchomienie lokalne

> Wymagania wstępne: [Node.js](https://nodejs.org/) w wersji 22 lub nowszej.

```bash
git clone https://github.com/DominiKrzywon/ing-test.git
cd ing-test
npm install
npx playwright install
npx playwright test
```

## Obsługa captchy / blokady Imperva

ING.pl chroni stronę przez Captche, która blokuje ruch z adresów IP datacenter (np. GitHub Actions).
Aby testy działały na CI/CD bez prób obchodzenia zabezpieczeń, requesty do `ing.pl` są przechwytywane i zastępowane lokalnym fixture'm (`ing-test/fixtures/ing-mock.html`). Mock odwzorowuje baner cookies z identycznymi selektorami, dzięki czemu Page Object i asercje działają tak samo jak na prawdziwej stronie.

Lokalnie (bez zmiennej `CI`) test trafia na prawdziwy `ing.pl`.

## CI (GitHub Actions)

Workflow `.github/workflows/playwright.yml` uruchamia test równolegle w
`chromium`, `firefox` i `webkit` (matrix). Wynik (HTML report) ląduje jako
artifact osobno dla każdej przeglądarki.
