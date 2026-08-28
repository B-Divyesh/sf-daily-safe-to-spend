# Today Money — polish 4

Repair commit: `6c25b5be4243e5fb75cdd4fb9822f3e286412b39`
Deployment: <https://daily-safe-to-spend.sociobot.in> (SWA deployment
`79cb4cae-9371-4009-b915-71c56fa12b7d`)

Every historical finding was rechecked. The reopened demo-entitlement path is
now isolated; no finding remains open.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the plain job, manual-budgeter audience, sample action, result preview, and result-named real action. | `@claim:manual-plan`; `evidence/polish-4-live-home/screenshot-mobile.png`; live `/`. |
| F-1-2 | Replaced demo license restoration with an in-memory sample Plus state; direct demo license query values are stripped and never stored or verified. Reset and exit preserve no demo entitlement. | `@claim:demo-sandbox`; `evidence/polish-4-live-demo/direct-demo-license-mobile.png`; live `/?demo=1`. |
| F-1-3 | Kept the 29-entry registry with exactly one tagged observable test per entry. | `evidence/polish-4-clean-clone.md`; `.factory/claims.json`; live `/demo`. |
| F-1-4 | Kept seeded service-worker offline reload coverage. | `@claim:offline-reload`; clean-clone evidence; live `/demo`. |
| F-1-5 | Kept the visible $1,240 − $390 − $250 / 10 = $60 sample calculation. | `@claim:daily-calculation`; `evidence/polish-4-live-demo/screenshot-mobile.png`; live `/demo`. |
| F-1-6 | Kept visible cash, bills, protected money, days, and formula. | `@claim:visible-assumptions`; live `/demo`. |
| F-1-7 | Rechecked local-only demo actions, including sample backup. | `@claim:local-data`, `@claim:demo-sandbox`; live `/privacy`. |
| F-1-8 | Rechecked real/demo IndexedDB separation and added entitlement-key isolation. | `@claim:local-plan-storage`, `@claim:demo-sandbox`; live `/?demo=1`. |
| F-1-9 | Rechecked the no-bank boundary. | `@claim:no-bank-connection`; live `/`. |
| F-1-10 | Rechecked no analytics or advertising traffic. | `@claim:no-tracking`; live `/privacy`. |
| F-1-11 | Kept short README workflow copy with audience, calculation, and purchase claims. | `@claim:manual-plan`, `@claim:daily-calculation`, `@claim:purchase-check`; `README.md`. |
| F-1-12 | Rechecked account, tracking, third-party, and local-storage boundaries. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-third-party-request`, `@claim:local-plan-storage`; live `/privacy`. |
| F-1-13 | Rechecked downloaded spreadsheet and backup contents. | `@claim:json-export`, `@claim:csv-export`; live `/demo`. |
| F-1-14 | Rechecked formula visibility and due, paid, and overdue bill rules. | `@claim:visible-assumptions`, `@claim:bill-rules`; live `/demo`. |
| F-1-15 | Rechecked purchase checking leaves the plan unchanged through reload. | `@claim:purchase-check-nondestructive`; live `/demo`. |
| F-1-16 | Rechecked history, import, exports, PWA manifest, and offline reload. | `@claim:history`, `@claim:json-import`, `@claim:installable-pwa`, `@claim:offline-reload`; live `/demo`. |
| F-1-17 | Kept planned-price wording and exercised encrypted backup/restore with sample-only demo Plus access. | `@claim:price-one-time`, `@claim:encrypted-backup`; live `/terms`. |
| F-1-18 | Rechecked mobile keyboard and dialog focus flow. | `@claim:keyboard-flow`; clean-clone 390 px browser run; live `/demo`. |
| F-1-19 | Rechecked zero clamp, exact shortfall, payday, paid, and overdue rules. | `@claim:shortfall-clamp`, `@claim:exact-shortfall`, `@claim:payday-and-overdue-rules`; live `/demo`. |
| F-1-20 | Rechecked designed drafting-sheet 404 and real 404 status. | `@claim:route-accessibility`; `evidence/polish-4-live-404/mobile.png`; live `/this-page-is-missing`. |
| F-1-21 | Retained complete short-sentence README audit. | `.factory/copy-audit.md`; clean-clone copy check; live `/`. |
| F-1-22 | Retained task-named landing headings. | `evidence/polish-4-live-home/screenshot-mobile.png`; live `/`. |
| F-1-23 | Retained “Show my daily amount” as the real-data action. | Browser setup flow; live `/`. |
| F-1-24 | Retained “protected money” as the visitor term. | `.factory/copy-audit.md`; `@claim:visible-assumptions`; live `/demo`. |
| F-1-25 | Kept plain visitor storage/export words and maintainer-only technical detail. | `.factory/copy-audit.md`; `README.md`; live `/privacy`. |
| F-1-26 | Rechecked `/demo`, `?demo=1`, title, canonical, and sitemap route. | `@claim:route-accessibility`, `@claim:demo-sandbox`; live `/demo`. |
| F-1-27 | Rechecked route titles, descriptions, canonical/social metadata, and project icons. | `@claim:route-accessibility`; `evidence/polish-4-live-home/verify.json`; live `/`. |
| F-1-28 | Rechecked History API route focus and announcement. | `@claim:route-accessibility`; `evidence/polish-4-live-review.md`; live `/privacy`. |
| F-1-29 | Rechecked shared header, skip link, footer, and legal links on legal routes. | Axe route sweep; `evidence/polish-4-live-privacy/screenshot-mobile.png`; live `/privacy`. |
| F-1-30 | Retained workflow, boundaries, and honest planned-price sections. | `evidence/polish-4-live-home/screenshot-desktop.png`; live `/`. |
| F-1-31 | Rechecked production CSP, Permissions-Policy, MIME, cache route, and 404 override. | `evidence/polish-4-live-home/headers.txt`, `manifest-headers.txt`, `evidence/polish-4-live-404/headers.txt`; live `/manifest.webmanifest`. |
| F-2-1 | Retained planned, not current, $12 wording above the fold. | `@claim:price-one-time`; live `/`. |
| F-2-2 | Rechecked free editing, purchase check, and ordinary exports without billing. | `@claim:core-free`; live `/demo` then Start for real. |
| F-2-3 | Rechecked encrypted backup restore in a fresh context. | `@claim:encrypted-backup`; clean-clone evidence; live `/demo`. |
| F-2-4 | Updated the audit for round 4 copy and the verb-first catalog line. | `.factory/copy-audit.md`; `.factory/catalog-description.txt`; live `/`. |
| F-3-1 | Rechecked visible real-plan license restore for valid, invalid, failed, and cached responses; it starts from the demo and requires Start for real. | `@claim:license-restore`; recorded fixtures; live `/demo`. |
| F-3-2 | Rechecked that verification transmits only a license while passwords, files, and budget data remain local. | `@claim:encrypted-backup-local-privacy`; clean-clone evidence; live `/privacy`. |
| F-3-3 | Retained conditional merchant wording while purchases remain closed. | `@claim:price-one-time`; live `/terms`. |

## Verification

- Local: `npm test` 6/6, `npm run lint`, `npm run build`, all claim tests,
  and `npm run test:e2e` 54/54 passed.
- Clean clone: every literal registry command passed separately; see
  `evidence/polish-4-clean-clone.md`.
- Lighthouse mobile local retry: performance 100, accessibility 100, best
  practices 100, SEO 100; LCP 1.5 s and CLS 0. See
  `evidence/polish-4-lighthouse-local-retry.json`.
- Live: cold `verify-url.sh` checks, Axe sweep, demo-isolation replay, and
  route/404 checks are recorded in `evidence/polish-4-live-review.md`.
