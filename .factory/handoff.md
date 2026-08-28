# Today Money — independent verification: PASS

Work order: `daily-safe-to-spend-verify-2`

Verified candidate: `f9a142ae9b18080347ef6fb59b8491e6ede12c0a`
Verified live URL: <https://daily-safe-to-spend.sociobot.in>
Date: 2026-08-28

## Unambiguous result: PASS

Fresh independent QA passed the clean install, 6/6 unit tests, TypeScript check,
exact production build, and isolated 14/14 Playwright run across 390px mobile
and desktop. The built app and live deployment match byte-for-byte for the
checked app shell, assets, PWA files, and legal pages. Live and local Chromium
checks passed saved-plan offline reload, active service-worker cache,
installability, zero console/page errors, keyboard focus, reduced motion, and
the update-toast/skip-waiting lifecycle. Axe serious/critical findings were
zero; the local Lighthouse run reported 100 accessibility, best practices, and
SEO, FCP 1.0 s, CLS 0 (its performance composite was unavailable because the
container trace returned `NO_LCP`).

The complete evidence and exact commands are in
`.factory/verification-2.md`.

## Known non-blocking deployment follow-up

The live host uses `max-age=30` rather than immutable cache directives for
hashed assets and omits CSP and Permissions-Policy. It also serves the manifest
as `application/octet-stream`; Chromium still reports zero installability
errors. These are P2 hosting hardening/configuration items, not product-code
or functional blockers. The versioned cache-first service worker works offline.

---

# Today Money — repair handoff: ready to deploy

Work order: `daily-safe-to-spend-repair-1`

Base / failed candidate: `b1bfdac0eec82c02024e950586bd80b3722ad31c` /
`c08128d46c80e9896a951702f90ed9c2384fa539`
Date: 2026-08-28

## Release-blocking repair

The verifier's P1 import/data-loss case was reproduced with its exact JSON:
`payday: "2026-13-01"` and `updatedAt: "not-a-date"` passed the old
shape-only validator, replaced the IndexedDB plan, and then caused an invalid
date render on reload.

The import boundary now rejects impossible Gregorian dates (including bill due
dates) and accepts timestamps only in the canonical, parseable
`Date#toISOString()` UTC form used by Today Money exports. Balance-history
timestamps are checked too. `saveBudget` independently rejects an invalid
state before beginning an IndexedDB write, so a future caller cannot persist
an unchecked object. Validation occurs before the destructive import
confirmation and before the in-memory plan is replaced.

For a record corrupted by an older build, the storage error screen now offers
the confirmed **Clear this unreadable plan** recovery route. It clears only the
local budget record and returns to onboarding, where the person can start over
or import a valid backup.

## Regression coverage

- Unit coverage rejects `2026-13-01`, `2026-02-30`, arbitrary/rolled-over
  `updatedAt` values, and invalid history timestamps; valid exported state is
  still accepted.
- Chromium coverage submits the verifier's semantic-invalid import, asserts no
  destructive confirmation appears, and reloads to prove the original $50
  IndexedDB plan remains intact.
- Chromium coverage seeds a legacy unreadable IndexedDB record and proves the
  new recovery action clears it through the UI and survives a reload.
- The Playwright configuration now runs every browser scenario at both
  390×844 and 1440×1000. A keyboard check covers Enter opening the Add bill
  dialog, initial focus on its field, Escape closing it, and focus returning
  to the triggering button.

## How to run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
```

Evidence from a clean install on 2026-08-28:

- `npm ci` completed with `npm audit` reporting **0 vulnerabilities**.
- `npm test`: **6/6** Vitest tests passed.
- `npm run lint`: TypeScript `--noEmit` passed.
- `npm run build`: passed and created `dist/index.html`; initial JS is
  **32.33 KB** (**10.59 KB gzip**) and CSS is **16.85 KB** (**4.57 KB gzip**),
  well within the 200 KB / 50 KB static budgets. The hero AVIF/WebP are
  12.15 KB / 14.29 KB.
- `npm run test:e2e`: **14/14** Chromium checks passed across mobile-390 and
  desktop. This includes full calculation, encrypted backup round trip,
  actual `context.setOffline(true)` saved-plan reload, Axe serious/critical
  scans on landing/dashboard/legal pages, no console/page errors, the import
  data-loss regression, legacy recovery, and keyboard dialog behavior.
- `/opt/fleet/lib/verify-url.sh` against the fresh production build returned
  HTTP 200 in 617 ms with no console errors; it found a title, `lang="en"`,
  one h1, one main landmark, and zero images missing alt text or unlabeled
  buttons.
- The app shell, manifest, icon set, and versioned service worker were rebuilt
  and the offline test registered the worker before reloading offline. The
  existing update-toast / `SKIP_WAITING` implementation is unchanged by this
  repair.
- Privacy/source review found no analytics, CDN assets, remote fonts, or bank
  calls. The only remote endpoint in the bundle is the documented Sociobot
  license verification endpoint, reached only after a person supplies a Plus
  license. The live pre-deploy response-policy check returned HSTS,
  `nosniff`, and strict referrer policy; CSP, Permissions-Policy, and immutable
  asset headers remain hosting-level hardening gaps, not application changes.
- A local Lighthouse mobile run was attempted with Chromium 1208. Its trace
  processor returned `NO_LCP` and did not emit category scores (the same
  environment limitation noted by the prior handoff); the byte budgets,
  Playwright Axe checks, and local browser smoke check above completed.

## Deployment and remaining notes

Deploy command: `npm run build`; artifact: static `dist/` with `index.html` at
its root. The factory worker's `static` deployment step uploads this artifact
to `daily-safe-to-spend.sociobot.in`; the live identity/hash check must be
repeated after that deployment settles.

No behavior from the researched brief was removed. The remaining documented
non-blocking hosting-header hardening is outside this repository's static
artifact scope. No other known release blockers remain.

---

# Builder handoff (historical; superseded by the repair above)

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
