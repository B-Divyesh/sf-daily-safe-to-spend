# Today Money — polish 5

Repair commits: `8f3d00d` and `b96bb21`.

This round closes `F-5-1` and rechecks every finding recorded in
`review-1.md` through `review-5.md` and `polish-1.md` through
`polish-4.md`. The production evidence paths below were populated by the
deployment replay. `@claim:<id>` names the literal command registered in
`.factory/claims.json`; each was also run separately from a clean clone.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the job-named H1, manual-budgeter sentence, one-click sample action, result preview, and result-named real action. | `@claim:manual-plan`; `evidence/polish-5-live-home/screenshot-mobile.png`; live `/`. |
| F-1-2 | Kept the separate `today-money-demo` database and temporary sample Plus access. Demo neither reads nor writes real licenses, and Reset/Start for real discard sample state. | `@claim:demo-sandbox`, `@claim:local-plan-storage`; `evidence/polish-5-live-demo/screenshot-mobile.png`; live `/demo` and `/?demo=1`. |
| F-1-3 | Kept the 29-entry claim registry and one observable tagged browser test for every entry. | every literal `.factory/claims.json` command from clean clone; `evidence/polish-5-clean-clone.md`; live `/demo`. |
| F-1-4 | Started service-worker registration immediately on initial load, made activation claim the initial client, and made cache matching tolerate host `Vary` headers. | `@claim:offline-reload`; `evidence/polish-5-local-offline.png`, `evidence/polish-5-live-offline.png`; live `/demo` cold/offline replay. |
| F-1-5 | Kept the visible seeded formula `$1,240 − $390 − $250 ÷ 10 = $60`. | `@claim:daily-calculation`; `evidence/polish-5-live-demo/screenshot-mobile.png`; live `/demo`. |
| F-1-6 | Kept visible cash, bills, protected money, days, and working. | `@claim:visible-assumptions`; live `/demo`. |
| F-1-7 | Kept local-only budget actions and whole-demo request interception. | `@claim:local-data`; live `/privacy` and `/demo`. |
| F-1-8 | Kept isolated real/demo plans across reload, reset, and exit. | `@claim:local-plan-storage`; live `/demo`. |
| F-1-9 | Kept the no-bank boundary and request check. | `@claim:no-bank-connection`; live `/`. |
| F-1-10 | Kept analytics/advertising-free request coverage. | `@claim:no-tracking`; live `/privacy`. |
| F-1-11 | Kept short README audience, calculation, and purchase-check copy with registered evidence. | `@claim:manual-plan`, `@claim:daily-calculation`, `@claim:purchase-check`; `README.md`; live `/`. |
| F-1-12 | Kept account, tracking, third-party, and local-storage claims registered and observed. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-third-party-request`, `@claim:local-plan-storage`; live `/privacy`. |
| F-1-13 | Kept observable spreadsheet and backup downloads plus valid backup import. | `@claim:json-export`, `@claim:csv-export`, `@claim:json-import`; live `/demo`. |
| F-1-14 | Kept formula transparency and paid/due/overdue bill behavior. | `@claim:visible-assumptions`, `@claim:bill-rules`; live `/demo`. |
| F-1-15 | Kept purchase checking non-destructive across a reload. | `@claim:purchase-check-nondestructive`; live `/demo`. |
| F-1-16 | Kept history, backup import/export, installable PWA, and offline coverage. | `@claim:history`, `@claim:json-import`, `@claim:json-export`, `@claim:csv-export`, `@claim:installable-pwa`, `@claim:offline-reload`; live `/demo`. |
| F-1-17 | Kept honest planned US$12 wording and sample-only encrypted backup/restore. | `@claim:price-one-time`, `@claim:encrypted-backup`; live `/terms` and `/demo`. |
| F-1-18 | Kept 390px keyboard, dialog-focus, Escape, and focus-return coverage. | `@claim:keyboard-flow`; `npm run test:e2e`; live `/demo`. |
| F-1-19 | Kept zero clamp, exact shortfall, payday exclusion, and overdue handling. | `@claim:shortfall-clamp`, `@claim:exact-shortfall`, `@claim:payday-and-overdue-rules`; live `/demo`. |
| F-1-20 | Kept the styled real 404 and correct HTTP status. | `@claim:route-accessibility`; `evidence/polish-5-live-404/screenshot-mobile.png`; live `/this-page-is-missing`. |
| F-1-21 | Re-audited every landing and README sentence; none exceeds 22 words. | `.factory/copy-audit.md`; live `/`. |
| F-1-22 | Kept headings that name the task rather than a metaphor. | `.factory/copy-audit.md`; `evidence/polish-5-live-home/screenshot-mobile.png`; live `/`. |
| F-1-23 | Kept “Show my daily amount” for the real-plan action. | `@claim:manual-plan`; live `/`. |
| F-1-24 | Kept “protected money” as the visitor term everywhere. | `.factory/copy-audit.md`; `@claim:visible-assumptions`; live `/demo`. |
| F-1-25 | Kept plain visitor copy and technical detail in maintainer documentation only. | `.factory/copy-audit.md`; `README.md`; live `/privacy`. |
| F-1-26 | Kept addressable `/demo` and `?demo=1`, route title/canonical, and sitemap entry. | `@claim:route-accessibility`, `@claim:demo-sandbox`; live `/demo`. |
| F-1-27 | Kept route-level title, description, canonical, social image, SVG favicon, and touch icon metadata. | `@claim:route-accessibility`; `evidence/polish-5-live-metadata.json`; live `/`, `/demo`, `/privacy`, `/terms`, and 404. |
| F-1-28 | Kept History API route focus and live heading announcement. | `@claim:route-accessibility`; `evidence/polish-5-live-route-focus.json`; live `/privacy` then Back. |
| F-1-29 | Kept shared header, skip link, footer, and legal links on legal routes. | `npm run test:e2e`; `evidence/polish-5-live-accessibility.json`, `evidence/polish-5-live-privacy/screenshot-mobile.png`; live `/privacy`, `/terms`. |
| F-1-30 | Kept the workflow, limits/privacy, and honest planned-backup sections. | `evidence/polish-5-live-home/screenshot-desktop.png`; live `/`. |
| F-1-31 | Kept CSP, permissions policy, referrer policy, nosniff, manifest MIME, and 404 response configuration. | `evidence/polish-5-live-home/headers.txt`, `evidence/polish-5-live-404/headers.txt`; live `/`, `/manifest.webmanifest`, missing route. |
| F-2-1 | Kept “planned” and “purchases are not open yet” alongside US$12. | `@claim:price-one-time`; live `/`. |
| F-2-2 | Kept the core plan and ordinary downloads usable without billing. | `@claim:core-free`; live `/demo` then Start for real. |
| F-2-3 | Kept encrypted restore across fresh contexts. | `@claim:encrypted-backup`; live `/demo`. |
| F-2-4 | Updated the complete copy audit and the verb-first catalog line. | `.factory/copy-audit.md`; `.factory/catalog-description.txt`; live `/`. |
| F-3-1 | Kept real-plan license restore with valid, invalid, failed, and offline-cached fixture cases. Worker now leaves that off-origin request network-only rather than proxying it. | `@claim:license-restore`; recorded fixtures; live `/demo` → Start for real. |
| F-3-2 | Kept the license-only network boundary and local encrypted payload/password checks. | `@claim:encrypted-backup-local-privacy`; live `/privacy`. |
| F-3-3 | Kept merchant terms conditional while the purchase is unavailable. | `@claim:price-one-time`; live `/terms`. |
| F-5-1 | Replaced deferred, interaction-gated worker scheduling with first-load registration. Activation always claims clients; same-origin precached assets use `ignoreVary` so a cold offline reload receives the shell. | `@claim:offline-reload` starts a fresh context directly at `/demo` with no input; `evidence/polish-5-local-offline.png`, `evidence/polish-5-live-offline.png`; live `/demo` cold/offline replay. |

## Verification

- Local: `npm test` (6/6), `npm run lint`, `npm run build`, `npm run test:claims` (19 tests), and `npm run test:e2e` (54 tests) passed.
- Clean clone: `npm ci`, build, and every one of the 29 literal registry commands passed; see `evidence/polish-5-clean-clone.md`.
- Live deployment `a3f661de-9e0b-452e-8933-f900392ebb98`: cold URL checks, Playwright Axe sweep (zero serious/critical), headers, metadata, link crawl, demo isolation, 404, route focus, and no-interaction offline reload all passed. See `evidence/polish-5-live-*.json` and screenshot paths above.
