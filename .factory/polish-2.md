# Today Money — polish round 2

Completed 2026-08-28 for review commit `b5a2a005cf14b62a49ff2b3f2f6f10190080163e`.

The repaired build is live at <https://daily-safe-to-spend.sociobot.in>. Cold-load evidence is in [evidence/polish-2-live-home](evidence/polish-2-live-home) and [evidence/polish-2-live-demo](evidence/polish-2-live-demo). Each `claims.json` command was run separately from a fresh clone; all 27 passed. The clean clone also passed `npm test`, `npm run lint`, `npm run build`, and all 50 configured Playwright cases.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen now names the job, manual-budgeter audience, sample action, preview, and real result action. | `@claim:manual-plan`; [home mobile screenshot](evidence/polish-2-live-home-mobile.png); live `/`. |
| F-1-2 | Added isolated `/demo` and `?demo=1`, seeded records, persistent banner, reset, exit, and separate IndexedDB namespace. | `@claim:demo-sandbox`, `@claim:local-plan-storage`, `@claim:offline-reload`; [demo mobile screenshot](evidence/polish-2-live-demo-mobile.png); live `/demo` and `/?demo=1`. |
| F-1-3 | Added the 26-entry claim registry with a tagged observable browser test for every claim. | `.factory/claims.json`; all listed clean-clone commands passed. |
| F-1-4 | Seeded demo reloads after service-worker activation while offline. | `@claim:offline-reload`; live `/demo`. |
| F-1-5 | The sample calculates $60/day from $1,240 cash, $390 unpaid bills, $250 protected money, and ten days. | `@claim:daily-calculation`; live `/demo`. |
| F-1-6 | The dashboard exposes the formula, cash, bills, protected money, and days. | `@claim:visible-assumptions`; live `/demo`. |
| F-1-7 | Full editable demo traffic is intercepted and stays same-origin. | `@claim:local-data`; live `/privacy`. |
| F-1-8 | Real and demo plans persist independently in `today-money` and `today-money-demo`. | `@claim:local-plan-storage`; live `/demo`. |
| F-1-9 | The planner has no bank integration or bank request. | `@claim:no-bank-connection`; live `/`. |
| F-1-10 | The planner contains no analytics or advertising traffic. | `@claim:no-tracking`; live `/privacy`. |
| F-1-11 | README workflow copy is short, plain, and covered by audience, calculation, and purchase tests. | `@claim:manual-plan`, `@claim:daily-calculation`, `@claim:purchase-check`; README. |
| F-1-12 | Account, tracking, third-party-service, and local-storage promises are separated and tested. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-third-party-request`, `@claim:local-plan-storage`; live `/privacy`. |
| F-1-13 | Backup and spreadsheet downloads are verified by their actual downloaded contents. | `@claim:json-export`, `@claim:csv-export`; live `/demo`. |
| F-1-14 | Visible inputs and due/paid/overdue rules are both shown and tested. | `@claim:visible-assumptions`, `@claim:bill-rules`; live `/demo`. |
| F-1-15 | Purchase checking leaves the plan unchanged through reload. | `@claim:purchase-check-nondestructive`; live `/demo`. |
| F-1-16 | History, import, exports, installability, and offline reload have individual claim coverage. | `@claim:history`, `@claim:json-import`, `@claim:json-export`, `@claim:csv-export`, `@claim:installable-pwa`, `@claim:offline-reload`. |
| F-1-17 | The planned one-time price is stated as unavailable; the licensed fixture proves encrypted backup and restore across fresh contexts. | `@claim:price-one-time`, `@claim:encrypted-backup`; live `/terms`. |
| F-1-18 | Mobile keyboard flow covers focus, Enter, Escape, initial dialog focus, and focus return. | `@claim:keyboard-flow`; 390px clean-clone browser suite. |
| F-1-19 | Clamp, exact shortfall, payday, paid, and overdue boundaries are asserted from the seeded demo. | `@claim:shortfall-clamp`, `@claim:exact-shortfall`, `@claim:payday-and-overdue-rules`; live `/demo`. |
| F-1-20 | Unknown paths render a designed page-not-found view and return HTTP 404. | `@claim:route-accessibility`; live `/this-route-does-not-exist` returns 404. |
| F-1-21 | README sentences were split to the 22-word maximum and audited. | `.factory/copy-audit.md`; README. |
| F-1-22 | Headings now name the daily-budget task and form action plainly. | [home mobile screenshot](evidence/polish-2-live-home-mobile.png); live `/`. |
| F-1-23 | The real-data action is now “Show my daily amount.” | `tests/app.spec.ts` plan workflow; live `/`. |
| F-1-24 | Visitor copy uses “protected money”; the eyebrow and empty state no longer call it a savings pot. | `@claim:visible-assumptions`; `.factory/copy-audit.md`; live `/demo`. |
| F-1-25 | Visitor introductions use plain “spreadsheet” and “backup file”; implementation details stay in maintainer sections. | `.factory/copy-audit.md`; README. |
| F-1-26 | Demo has its own address, title, canonical URL, and sitemap entry. | `@claim:route-accessibility`; live `/demo`; live `/sitemap.xml`. |
| F-1-27 | Every route supplies canonical, social metadata, product preview, favicon, and touch icon. | `@claim:route-accessibility`; live `/`, `/privacy`, and `/terms`. |
| F-1-28 | Route changes focus and announce the destination H1; Back and Forward restore route focus. | `@claim:route-accessibility`; live `/privacy`. |
| F-1-29 | Legal routes use the shared header, skip link, navigation, and footer. | `tests/app.spec.ts` accessible-route sweep; live `/privacy` and `/terms`. |
| F-1-30 | Landing contains the three-step workflow, limits/privacy, and honest Plus availability section. | [home desktop screenshot](evidence/polish-2-live-home-desktop.png); live `/`. |
| F-1-31 | Static configuration supplies CSP, Permissions-Policy, manifest MIME, immutable hashed assets, and the real 404 response. | live headers; live `/manifest.webmanifest`; live `/this-route-does-not-exist`. |
| F-2-1 | The first-screen price fact says “Plus is planned at $12 once,” matching the unavailable state. | `@claim:price-one-time`; [home mobile screenshot](evidence/polish-2-live-home-mobile.png); live `/`. |
| F-2-2 | Registered `core-free`; its test edits an unlicensed plan, checks a purchase, downloads JSON and CSV, and rejects billing requests. | `@claim:core-free`; live `/demo`. |
| F-2-3 | Expanded `encrypted-backup` to create data in one licensed demo context and restore it in a second fresh context. | `@claim:encrypted-backup`; live `/demo`. |
| F-2-4 | Rebuilt the copy audit with its word-count rule, all landing/README sentences and directives, and terminology table. | `.factory/copy-audit.md`; README; live `/`. |

## Live re-check

Cold live Chromium checks found no root/demo console or page errors. Both routes have one H1, a main landmark, `lang="en"`, labelled buttons, and image alt text; their titles are respectively `Today Money — see what you can spend today` and `Demo — Today Money`. Axe found zero serious or critical violations at `/`, `/demo`, `/privacy`, `/terms`, and the styled 404. The expected HTTP 404 itself appears as a browser network message when its URL is loaded; the normal product routes have no console errors.
