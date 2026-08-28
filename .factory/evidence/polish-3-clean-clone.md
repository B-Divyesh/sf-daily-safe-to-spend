# Polish round 3 verification evidence

Verified 2026-08-28 from clean clone
`/tmp/today-money-polish3-release.F2iGZD` at product commit
`43ae27935d957db5b0759be9559e1835f31538f6`.

- `npm ci`: passed with 0 audit vulnerabilities.
- `npm test`: 6/6 unit tests passed.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/index.html` exists.
- Every command in `.factory/claims.json` ran separately: 29/29 passed.
- `npx playwright test --retries=0`: 54/54 passed across 390 px and desktop projects.
- Built JavaScript: 40.48 KB raw / 13.08 KB gzip.
- Built CSS: 19.87 KB raw / 5.15 KB gzip.
- Hero AVIF: 12.15 KB. No web fonts are shipped.

The separately passed claim IDs were `manual-plan`, `daily-calculation`,
`visible-assumptions`, `purchase-check`, `purchase-check-nondestructive`,
`bill-rules`, `history`, `json-export`, `csv-export`, `json-import`,
`local-plan-storage`, `demo-sandbox`, `local-data`, `no-bank-connection`,
`no-tracking`, `no-account`, `no-third-party-request`, `offline-reload`,
`installable-pwa`, `price-one-time`, `core-free`, `license-restore`,
`encrypted-backup`, `encrypted-backup-local-privacy`, `keyboard-flow`,
`shortfall-clamp`, `exact-shortfall`, `payday-and-overdue-rules`, and
`route-accessibility`.

The local URL verifier found the expected titles, `lang="en"`, one H1 and one
main landmark, complete image alternatives and button names, and zero console
errors on `/` and `/demo`. The Playwright Axe route sweep found zero serious or
critical violations on home, demo, privacy, terms, and 404.

Local mobile Lighthouse scored 100 performance, 100 accessibility, 100 best
practices, and 100 SEO. FCP was 0.9 s, LCP 1.4 s, CLS 0, and TBT 30 ms.

After deployment, live mobile Lighthouse again scored 100 in every category.
FCP was 0.9 s, LCP 1.1 s, CLS 0, and TBT 20 ms. The production JavaScript hash
matched the deployed `dist` artifact.
