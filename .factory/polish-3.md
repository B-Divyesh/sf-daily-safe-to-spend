# Today Money — polish round 3

Completed 2026-08-28 for review commit
`5b36d17bd02ec4b5d3ef9d8234325088135d4fc6`.

The repaired product build is `43ae27935d957db5b0759be9559e1835f31538f6`
and is live at <https://daily-safe-to-spend.sociobot.in>. Every finding from
reviews 1–3 is mapped below. Review 2 repeated F-1-24; that row includes the
final correction and evidence.

Shared evidence: [clean-clone results](evidence/polish-3-clean-clone.md),
[mobile home](evidence/polish-3-live-home/screenshot-mobile.png),
[mobile demo](evidence/polish-3-live-demo/screenshot-mobile.png),
[restored license](evidence/polish-3-live-license-restored.png),
[styled 404](evidence/polish-3-live-404-mobile.png), and
[live Lighthouse](evidence/polish-3-lighthouse-live.json).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The first screen names the job and manual-budgeter audience, then offers the sample plan before real-data entry. The real action says “Show my daily amount”. | `@claim:manual-plan`; [mobile home](evidence/polish-3-live-home/screenshot-mobile.png); live `/`. |
| F-1-2 | `/demo` and `?demo=1` seed a realistic plan in `today-money-demo`, never read `today-money`, and show the persistent demo/reset/exit banner. | `@claim:demo-sandbox`, `@claim:local-plan-storage`, `@claim:offline-reload`; [mobile demo](evidence/polish-3-live-demo/screenshot-mobile.png); live `/demo`. |
| F-1-3 | Added the required registry and one observable tagged browser test per claim. | `.factory/claims.json`; all 29 listed commands passed separately in the clean clone. |
| F-1-4 | The installed demo reloads with its seed and banner after the browser goes offline. | `@claim:offline-reload`; live `/demo`. |
| F-1-5 | The demo derives $60/day from $1,240 cash, $390 unpaid bills, $250 protected money, and ten days. | `@claim:daily-calculation`; live `/demo`. |
| F-1-6 | The result exposes cash, unpaid bills, protected money, days, and the formula. | `@claim:visible-assumptions`; live `/demo`. |
| F-1-7 | The editable demo flow is monitored end to end and budget data remains local. | `@claim:local-data`; live `/privacy`. |
| F-1-8 | Real and demo plans persist in separate IndexedDB databases and remain isolated through reload/reset/exit. | `@claim:local-plan-storage`, `@claim:demo-sandbox`; live `/demo`. |
| F-1-9 | There is no bank connection and the flow makes no bank request. | `@claim:no-bank-connection`; live `/`. |
| F-1-10 | No analytics or advertising request occurs during the full demo flow. | `@claim:no-tracking`; live `/privacy`. |
| F-1-11 | README workflow promises are short and backed by audience, calculation, and purchase checks. | `@claim:manual-plan`, `@claim:daily-calculation`, `@claim:purchase-check`; `README.md`. |
| F-1-12 | Account, tracking, third-party request, and local-storage boundaries are separate tested claims. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-third-party-request`, `@claim:local-plan-storage`. |
| F-1-13 | Spreadsheet and backup downloads are checked by parsing their real downloaded contents. | `@claim:json-export`, `@claim:csv-export`; live `/demo`. |
| F-1-14 | Visible inputs and due/paid/overdue bill rules are shown and tested. | `@claim:visible-assumptions`, `@claim:bill-rules`; live `/demo`. |
| F-1-15 | A purchase check leaves the stored plan unchanged through reload. | `@claim:purchase-check-nondestructive`; live `/demo`. |
| F-1-16 | History, import, JSON/CSV export, installability, and offline reload each have claim coverage. | `@claim:history`, `@claim:json-import`, `@claim:json-export`, `@claim:csv-export`, `@claim:installable-pwa`, `@claim:offline-reload`. |
| F-1-17 | Plus is explicitly planned and unavailable; encrypted backup and restore are exercised with a licensed fixture. | `@claim:price-one-time`, `@claim:encrypted-backup`; live `/terms`. |
| F-1-18 | The 390 px keyboard flow covers Tab, Enter, Escape, dialog focus, and focus return. | `@claim:keyboard-flow`; clean-clone mobile browser project. |
| F-1-19 | Zero clamp, exact shortfall, payday exclusion, paid bills, and overdue bills are asserted. | `@claim:shortfall-clamp`, `@claim:exact-shortfall`, `@claim:payday-and-overdue-rules`. |
| F-1-20 | Unknown paths render the product-specific drafting-style 404 and return HTTP 404. | `@claim:route-accessibility`; [404](evidence/polish-3-live-404-mobile.png); live `/this-route-does-not-exist`. |
| F-1-21 | Long README prose was split into short single-purpose sentences. | `.factory/copy-audit.md`; no audited sentence exceeds 22 words. |
| F-1-22 | Task headings now say “Daily amount after bills and protected money” and “Enter your starting cash and payday”. | [mobile home](evidence/polish-3-live-home/screenshot-mobile.png); live `/`. |
| F-1-23 | The real-data action names its result: “Show my daily amount”. | Plan workflow browser test; live `/`. |
| F-1-24 | All visitor copy now uses “protected money”; the remaining “savings” and “savings pot” variants were removed. | `@claim:visible-assumptions`; `.factory/copy-audit.md`; live `/demo`. |
| F-1-25 | Visitor copy uses “this browser”, “spreadsheet”, and “backup file”; technical terms remain only in maintainer instructions. | `.factory/copy-audit.md`; `README.md`. |
| F-1-26 | Demo has a real URL, its own title/canonical, and a sitemap entry. | `@claim:route-accessibility`; live `/demo` and `/sitemap.xml`. |
| F-1-27 | Routes provide canonical, Open Graph/Twitter metadata, a product-owned 1200×630 preview, SVG favicon, and 180 px touch icon. | `@claim:route-accessibility`; cold route metadata check; live `/`. |
| F-1-28 | History navigation focuses and announces the route H1, including Back and Forward. | `@claim:route-accessibility`; live Demo → Privacy → Back check. |
| F-1-29 | Legal routes share the skip link, header, navigation, main landmark, and complete footer. | Accessible-route browser sweep; live `/privacy` and `/terms`. |
| F-1-30 | Landing now includes the three-step workflow, clear limitations/privacy, and honest planned Plus section. | [desktop home](evidence/polish-3-live-home/screenshot-desktop.png); live `/`. |
| F-1-31 | Static configuration supplies global CSP, Permissions-Policy, Referrer-Policy, nosniff, manifest MIME, immutable asset caching, and a real 404. | [home headers](evidence/polish-3-live-home-headers.txt), [manifest headers](evidence/polish-3-live-manifest-headers.txt), [404 headers](evidence/polish-3-live-404-headers.txt). |
| F-2-1 | The first-screen fact and Plus section consistently say the $12 one-time tier is planned and purchases are closed. | `@claim:price-one-time`; [mobile home](evidence/polish-3-live-home/screenshot-mobile.png); live `/`. |
| F-2-2 | The free-core claim edits the plan, checks a purchase, downloads JSON and CSV, and rejects billing traffic. | `@claim:core-free`; live `/demo`. |
| F-2-3 | Encrypted backup creates data in one licensed context and restores it in a second fresh context. | `@claim:encrypted-backup`; [restored license](evidence/polish-3-live-license-restored.png). |
| F-2-4 | The copy audit includes its counting rule, every landing/README sentence and fragment, terminology table, and prohibited-word check. | `.factory/copy-audit.md`; no open flags. |
| F-3-1 | Added the missing restoration claim. Its test submits the visible form for valid, invalid, and failed-network fixtures, then proves cached offline access and unlocked controls. | `@claim:license-restore`; recorded fixture `tests/fixtures/license-responses.json`; [restored license](evidence/polish-3-live-license-restored.png); live `/demo`. |
| F-3-2 | Added a whole-flow privacy claim around license verification, encryption, download, file selection, and restore. It permits only one license-only verification request and rejects password, file, or budget leakage. | `@claim:encrypted-backup-local-privacy`; live production-bundle replay; live `/privacy`. |
| F-3-3 | Removed the current merchant-of-record sentence while purchases are unavailable. The remaining copy consistently uses future/planned wording. | `@claim:price-one-time`; cold live `/demo` and `/terms` copy check. |

## Final live self-review

Cold Chromium sessions rechecked `/`, `/demo`, `/?demo=1`, `/privacy`,
`/terms`, and the styled 404. The route sweep found correct titles, canonical
URLs, focus restoration, no mobile overflow, no console errors on normal
routes, and zero serious or critical Axe violations. Demo reset, real/demo
isolation, demo exit, offline reload, valid/invalid/failed license responses,
cached offline access, encrypted restore, and the licensed network boundary
all passed against the deployed production bundle.

The first live pass exposed security headers missing from the rewritten 404.
Headers were moved to `globalHeaders`, the product was rebuilt and redeployed,
and home, manifest, and 404 responses were rechecked. No finding remains open.
