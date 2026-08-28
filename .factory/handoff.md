# Today Money — polish round 2 handoff

Work order: `daily-safe-to-spend-polish-2`
Completed: 2026-08-28
Base reviewed: `6f03787b9bc728f0cf1135671659399f3b48ca0c`
Repair commits: `b4ff6bf`, `58effe6` (plus this handoff commit)
Live: <https://daily-safe-to-spend.sociobot.in>

## Outcome

All review-1 and review-2 findings are closed. The release keeps the original
blueprint/drafting visual identity and the static local-first PWA deployment
class. The first screen names the job and audience, offers a safe one-click
demo, and honestly labels Plus as planned while purchases remain closed.

The demo is available at `/demo` and `/?demo=1`. It seeds a $1,240 plan with
three bills and $250 protected money, shows $60/day, uses only the separate
`today-money-demo` IndexedDB database, and supplies Reset demo and Start for
real controls. The real plan remains in `today-money`.

Detailed finding-to-evidence mapping: [polish-2.md](polish-2.md).

## Exact verification evidence

- Fresh clone: `/tmp/today-money-clean.HfvqBQ` from the committed repair.
  `npm ci` completed with 0 audited vulnerabilities; `npm test` passed 6/6;
  `npm run lint` passed; `npm run build` passed.
- Fresh-clone full browser suite: `npm run test:e2e` passed **50/50** cases
  across 390px and desktop. It includes demo isolation, ordinary exports,
  cross-context encrypted restore, privacy traffic, keyboard, reduced motion,
  200% text, offline reload, route focus, and Axe checks.
- All 27 commands listed in `.factory/claims.json` passed separately from that
  clean clone: `manual-plan`, `daily-calculation`, `visible-assumptions`,
  `purchase-check`, `purchase-check-nondestructive`, `bill-rules`, `history`,
  `json-export`, `csv-export`, `json-import`, `local-plan-storage`,
  `demo-sandbox`, `local-data`, `no-bank-connection`, `no-tracking`,
  `no-account`, `no-third-party-request`, `offline-reload`, `installable-pwa`,
  `price-one-time`, `core-free`, `encrypted-backup`, `keyboard-flow`,
  `shortfall-clamp`, `exact-shortfall`, `payday-and-overdue-rules`, and
  `route-accessibility`.
- Production build: JS 40.48 KB (13.08 KB gzip); CSS 19.87 KB (5.15 KB gzip).
  Both are inside the PWA budgets.
- Local Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.4 s, CLS 0. Report:
  [polish-2-lighthouse-local.json](evidence/polish-2-lighthouse-local.json).
- Live cold checks: root and demo each returned 200 without console/page errors,
  had `lang=en`, one H1, main, image alt text, and labelled buttons. Live Axe
  had zero serious/critical issues on `/`, `/demo`, `/privacy`, `/terms`, and
  the designed 404. The 404 URL correctly returns HTTP 404 (the browser's
  expected failed-resource message is not a product-route console error).
- Live headers include CSP, Permissions-Policy, HSTS, Referrer-Policy, and
  `X-Content-Type-Options`; `/manifest.webmanifest` returns
  `application/manifest+json`. The live app uses `index-Bomgx2UG.js`, matching
  the verified clean build.

## Evidence and operation

- Screenshots and basic live/local reports:
  [evidence/polish-2-live-home](evidence/polish-2-live-home),
  [evidence/polish-2-live-demo](evidence/polish-2-live-demo),
  [polish-2-live-home-mobile.png](evidence/polish-2-live-home-mobile.png), and
  [polish-2-live-demo-mobile.png](evidence/polish-2-live-demo-mobile.png).
- Run locally: `npm ci && npm test && npm run lint && npm run build && npm run test:e2e`.
- Run an individual promise check with its command in `.factory/claims.json`.
- Deploy by pushing `main`; the static work-order deployment serves `dist/`.

## Known gaps

None. No infrastructure, DNS, or billing configuration was changed.
