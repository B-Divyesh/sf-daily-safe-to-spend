# Today Money — polish 5 handoff

Work order: `daily-safe-to-spend-polish-5`
Deployment: <https://daily-safe-to-spend.sociobot.in>
SWA deployment: `a3f661de-9e0b-452e-8933-f900392ebb98`

## Outcome

Closed the last adversarial finding, `F-5-1`. The service worker now registers
on initial page load, claims initial clients on activation, and serves
precached same-origin assets despite host `Vary` headers. A fresh browser can
open `/demo`, make no pointer or keyboard input, go offline, reload, and see
the seeded `$60.00` plan.

The repair is in `8f3d00d` and `b96bb21`; evidence and documentation are in
`fe8e1c7` and `26d4c07`. All commits are pushed to `origin/main`.

## Verification

- Local: `npm test` passed 6/6; `npm run lint` and `npm run build` passed.
  Production JavaScript is 13.26 KB gzip.
- Browser suite: `npm run test:claims` passed 19 Playwright tests (29 claim
  tags); `npm run test:e2e` passed 54 mobile/desktop browser and Axe tests.
- Clean clone: at `/tmp/today-money-polish-5.er3jCW`, `npm ci`, build, and all
  29 literal commands from `.factory/claims.json` passed. Details:
  `evidence/polish-5-clean-clone.md`.
- Local Lighthouse mobile `/demo`: performance 100, accessibility 100, best
  practices 100, SEO 100; LCP 1.2 s and CLS 0. See
  `evidence/polish-5-lighthouse-local.json`.
- Local first-visit offline replay: no pointer/keyboard input, active
  controller, `$60.00`, and no console errors. Screenshot:
  `evidence/polish-5-local-offline.png`.
- Live cold checks passed for `/`, `/demo`, `/privacy`, `/terms`, and the real
  404. `verify-url.sh` evidence is under `evidence/polish-5-live-*`.
- Live Playwright Axe scan found zero serious or critical violations on all
  five routes. Metadata, link crawl, route focus/announcement, demo isolation,
  headers, and the no-input offline replay are recorded in
  `evidence/polish-5-live-accessibility.json`,
  `evidence/polish-5-live-metadata.json`,
  `evidence/polish-5-live-link-crawl.json`,
  `evidence/polish-5-live-route-focus.json`,
  `evidence/polish-5-live-demo-isolation.json`, and
  `evidence/polish-5-live-offline.png`.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:claims
npm run test:e2e
```

Deploy the built `dist/` directory with the factory static deployment work
order. No product gaps are known.
