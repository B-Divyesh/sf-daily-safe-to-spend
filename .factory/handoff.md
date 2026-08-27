# Today Money — independent verification handoff: **FAIL**

Verification work order: `daily-safe-to-spend-verify-1`
Verified candidate: `c08128d46c80e9896a951702f90ed9c2384fa539`
Verified live URL: <https://daily-safe-to-spend.sociobot.in>
Date: 2026-08-27

**Do not release this candidate.** A semantically invalid but date-shaped JSON
import is accepted, replaces the existing IndexedDB plan, and makes a reload
land on “Your saved plan could not be opened. Invalid time value” with no
in-product recovery path. See [the independent verification report](verification.md)
for the exact file, reproduction, passing checks, live hash evidence, and
required retest.

The live HTML, service worker, manifest, JS, and CSS are hash-identical to the
fresh production build of this candidate, so this is not a deployment-only
failure. `npm ci`, `npm test` (4/4), `npm run build`, and `npm run test:e2e`
(4/4) passed; normal desktop/mobile, axe, keyboard, reduced-motion, PWA
offline reload, and service-worker-update-toast checks also passed. The P1
invalid-import/data-loss defect controls this FAIL verdict.

---

# Builder handoff (superseded by independent verification above)

Work order: `daily-safe-to-spend-build-1`
Completed: 2026-08-27

## What was built

- A complete manual safe-to-spend workflow: current spendable cash, payday,
  unpaid/paid/overdue bills, protected pots, and a conservative daily amount.
- A transparent formula and a non-destructive planned-purchase check that
  distinguishes “fits the protected plan” from “fits today’s pace.”
- IndexedDB persistence, balance history, JSON import/export, CSV export, and
  specific confirmation before destructive changes.
- A US$12 one-time Today Money Plus unlock using the Sociobot checkout and
  verify contract, including return-token capture, daily verdict caching,
  offline optimistic unlock, pasted-license restore, and AES-256-GCM encrypted
  backup/restore with PBKDF2 (250,000 iterations). Core export remains free.
- Installable offline PWA assets: 192/512/maskable icons, versioned precache,
  cache-first static assets, network-first navigation/API behavior, offline
  fallback, update toast, and a first-install lifecycle that does not reload
  the user’s page.
- Responsive blueprint-drafting visual system, hand-authored SVG iconography,
  and an original generated wallet/compass hero in AVIF and WebP. Full prompt
  and provenance are in `.factory/design.md` and `assets/src/`.
- First-class onboarding, empty lists, invalid import/storage errors, expired
  payday warning, shortfall state, offline/online state, and keyboard-accessible
  native dialogs.
- Static `/privacy/` and `/terms/` pages, README, MIT license, robots, sitemap,
  and no analytics, runtime CDN, remote font, or bank integration.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

The exact deploy build command is `npm run build`. Output is `dist/`, and
`dist/index.html` is at that root. Serve `dist/` over HTTPS.

## Verification

- `npm test`: 4/4 calculation and import-validation unit tests passed.
- `npm run test:e2e`: 4/4 Chromium tests passed at 390×844, covering the full
  plan flow, purchase decision, IndexedDB persistence, actual offline reload,
  landing/legal accessibility, no console/page errors, and an encrypted Plus
  backup round trip.
- Axe via Playwright: zero serious or critical issues on onboarding, populated
  planner, privacy, and terms screens.
- `npm audit`: zero vulnerabilities.
- Production sizes: 31.19 KB JS (10.25 KB gzip), 16.70 KB CSS (4.54 KB gzip),
  12.15 KB AVIF hero, 14.29 KB WebP hero; no font payload.
- Lighthouse 13 mobile run: accessibility 100, best practices 100, SEO 100,
  FCP 0.9 s, Speed Index 0.9 s, CLS 0. A separate Chromium PerformanceObserver
  smoke measurement recorded the H1 LCP at 120 ms on an unthrottled local run.
- Visual review completed at 390×844 and 1440×1000. Touch controls are at least
  44 px, focus styling is visible, one H1 and one main landmark are present,
  and reduced-motion replaces transitions/animations with instant states.

## Known gaps and release notes

- The factory still needs to register `daily-safe-to-spend` with the Sociobot
  billing API before live checkout can complete. No product ID is hardcoded.
- Lighthouse’s local Chromium 145 trace processor returned `NO_LCP`, so it did
  not emit a composite performance score even though its FCP/Speed Index/CLS
  audits completed and an independent PerformanceObserver captured LCP. All
  shipped byte budgets are far below their limits; rerun Lighthouse in the
  deployment browser to record the composite score.
- Single currency per plan is intentional v1 scope. There is no cloud sync or
  password recovery; losing an encrypted-backup password is permanent.

## Suggested next steps

1. Register the product slug and confirm checkout/return URL in staging with
   Sociobot’s test card, then switch the factory base URL at release if needed.
2. Run the deployed URL through the factory `verify-url.sh` and Lighthouse in
   its standard deployment image.
3. Pilot with manual budgeters and measure weekly balance updates and purchase
   prediction accuracy, matching the brief’s success measure.
