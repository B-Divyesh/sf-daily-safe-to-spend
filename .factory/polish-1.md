# Today Money — polish round 1

Completed 2026-08-28 from review commit `e3dcc371e51943f061b82b2fd00a8f68c758f932`.

Evidence images: [cold mobile home](evidence/live-cold-home-mobile.png), [cold mobile demo](evidence/live-cold-demo-mobile.png), [desktop demo](evidence/live-cold-demo-desktop.png), and [mobile 404](evidence/live-404-mobile.png). Live response headers are in [live-headers.txt](evidence/live-headers.txt); build/live hashes are in [live-hashes.txt](evidence/live-hashes.txt).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the H1 and audience sentence. Added the first-screen sample action and result preview. Renamed the setup action. | `@claim:manual-plan`; cold mobile home screenshot; live `/`. |
| F-1-2 | Added `/demo` and `?demo=1`, a $1,240 sample with three bills and protected money, a persistent banner, reset, exit, and separate `today-money-demo` storage. | `@claim:demo-sandbox`, `@claim:local-plan-storage`, `@claim:offline-reload`; mobile and desktop demo screenshots; live `/demo/` and `/?demo=1`. |
| F-1-3 | Added a 26-entry claim registry and one tagged browser test for every entry. | `.factory/claims.json`; all 26 listed commands passed from a clean clone. |
| F-1-4 | Registered and tested offline reload after service-worker activation. | `@claim:offline-reload`; live offline reload passed at `/demo/`. |
| F-1-5 | Registered the calculation and asserted the seeded arithmetic. | `@claim:daily-calculation`; live demo shows `$60.00`. |
| F-1-6 | Kept assumptions visible and asserted cash, bills, protected money, days, and formula. | `@claim:visible-assumptions`; live `/demo/`. |
| F-1-7 | Registered the local-data promise and intercepted the complete editable demo flow. | `@claim:local-data`; only same-origin requests observed. |
| F-1-8 | Proved persistence and real/demo namespace separation. | `@claim:local-plan-storage`; `today-money` and `today-money-demo`. |
| F-1-9 | Registered the no-bank promise and rejected bank requests through the full flow. | `@claim:no-bank-connection`; live `/`. |
| F-1-10 | Registered the no-tracking promise and rejected analytics and advertising requests. | `@claim:no-tracking`; live `/privacy/`. |
| F-1-11 | Rewrote the README opening in three short sentences and registered the audience, calculation, and purchase check. | `@claim:manual-plan`, `@claim:daily-calculation`, `@claim:purchase-check`. |
| F-1-12 | Replaced the compound architecture sentence with plain claims and registered account, tracking, third-party, and local-storage behavior. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-third-party-request`, `@claim:local-plan-storage`. |
| F-1-13 | Replaced introductory jargon and validated both downloaded file contents. | `@claim:json-export`, `@claim:csv-export`, `@claim:local-plan-storage`. |
| F-1-14 | Standardized transparency and bill-rule copy and covered due, paid, and overdue samples. | `@claim:visible-assumptions`, `@claim:bill-rules`. |
| F-1-15 | Compared the plan before and after a purchase check and after reload. | `@claim:purchase-check-nondestructive`. |
| F-1-16 | Tested history, import, both exports, manifest installation data, and offline reload. | `@claim:history`, `@claim:json-import`, `@claim:json-export`, `@claim:csv-export`, `@claim:installable-pwa`, `@claim:offline-reload`. |
| F-1-17 | Registered the planned US$12 one-time price and tested encrypted output with an isolated cached-license fixture. The unavailable checkout is stated honestly and no dead link ships. | `@claim:price-one-time`, `@claim:encrypted-backup`; live Plus section. |
| F-1-18 | Added a 390px keyboard claim covering Tab, Enter, Escape, initial focus, and focus return. | `@claim:keyboard-flow`; 46-case browser suite. |
| F-1-19 | Added explicit zero clamp, exact shortfall, payday, paid, and overdue rule tests. | `@claim:shortfall-clamp`, `@claim:exact-shortfall`, `@claim:payday-and-overdue-rules`. |
| F-1-20 | Removed catch-all navigation fallback, generated a blueprint 404, and configured a 404 response override. | `@claim:route-accessibility`; live `/this-route-does-not-exist` returns HTTP 404; 404 screenshot. |
| F-1-21 | Split the 34-word README sentence into three sentences of seven words or fewer. | `.factory/copy-audit.md`; README. |
| F-1-22 | Replaced both generic headings with task language. | Cold mobile home screenshot; live `/`. |
| F-1-23 | Renamed “Make my plan” to “Show my daily amount”. | Existing end-to-end setup test; live `/`. |
| F-1-24 | Standardized visitor copy on “protected money”; `Envelope` remains internal only. | Repository copy search; copy-audit terminology table. |
| F-1-25 | Moved technical terms into maintainer sections and uses “spreadsheet” or “backup file” in visitor copy. | README; `.factory/copy-audit.md`. |
| F-1-26 | Added the real demo route, `Demo — Today Money`, canonical `/demo/`, and sitemap entry. | `@claim:route-accessibility`; live `/demo/`; sitemap crawl. |
| F-1-27 | Added per-route canonical/social metadata, a 1200×630 original-art preview, SVG favicon, and 180px touch icon. | Live DOM metadata check; `public/social-preview.png`, `public/favicon.svg`, `public/icons/apple-touch-icon.png`. |
| F-1-28 | Added History API navigation, focused route H1s, a polite announcement, and Back/Forward restoration. | `@claim:route-accessibility` tests Privacy, Back, and Forward focus. |
| F-1-29 | Routed legal pages through the shared header, skip link, nav, footer, one-liner, legal links, factory credit, and build id. | Axe route sweep; live `/privacy/` and `/terms/`. |
| F-1-30 | Added a three-step workflow, boundaries/privacy section, and exact Plus price and feature section. | Cold mobile home screenshot; `@claim:price-one-time`; live `/`. |
| F-1-31 | Added CSP, Permissions-Policy, MIME, immutable hashed-asset caching, and real 404 configuration. Excluded host-only files from precache so Azure installs the worker. | `live-headers.txt`; manifest is `application/manifest+json`; hashed JS is immutable; live offline test passed. |

## Earlier review and verification findings

No earlier `review-*` or `polish-*` file existed. The historical invalid-calendar import defect remains fixed by `isBudgetState`, and the browser regression still passes. The historical header, MIME, and caching findings are closed by F-1-31 above.

## Final checks

- Clean clone: 6/6 unit tests, type-check, production build, all 26 claim commands, and 46/46 browser tests passed.
- Axe: zero serious or critical findings on home, demo, privacy, terms, and 404 locally and live.
- Lighthouse live mobile: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 10 ms.
- Production: 40.37 KB JS (13.05 KB gzip), 19.87 KB CSS (5.15 KB gzip).
- Deployment: live files match `dist/` by SHA-256, including the app shell, JS, CSS, worker, manifest, route shells, and 404.

All findings in review 1 and the earlier verification reports are resolved.
