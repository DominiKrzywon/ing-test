# ing.pl cookie consent — Playwright example

Samodzielny przykład testu E2E (oddzielony od projektu sportsbook). Pokrywa
przepływ zgody na cookies na `ing.pl`:

1. Wejście na stronę
2. Klik **Dostosuj**
3. Włączenie cookies **analitycznych**
4. Klik **Zaakceptuj wybrane**
5. Weryfikacja, że zgoda zapisała się w przeglądarce (`context.cookies()`)

## Struktura

```
ing-qa/
├── ing-POM/CookiePolicyPage.ts  # Page Object (wszystkie selektory bannera)
├── ing-test/cookies.spec.ts     # Test (kroki + asercje)
├── playwright.config.ts         # Konfiguracja + matryca przeglądarek
└── package.json
```

## Uruchomienie lokalne

```bash
cd ing-qa
npm install
npx playwright install
npx playwright test
```

## CI (GitHub Actions)

Workflow `.github/workflows/ing-cookies.yml` uruchamia test równolegle w
`chromium`, `firefox` i `webkit` (matrix). Wynik (HTML report) ląduje jako
artifact osobno dla każdej przeglądarki.
