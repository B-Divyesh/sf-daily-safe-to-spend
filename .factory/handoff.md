# Today Money — polish round 1 handoff

Work order: `daily-safe-to-spend-polish-1`  
Completed: 2026-08-28  
Live: <https://daily-safe-to-spend.sociobot.in>

## Delivered

- Rewrote the first screen for manual budgeters, with “Try it with sample data” and “Show my daily amount” as clear actions.
- Added isolated `/demo` and `?demo=1` entry points. The $1,240 sample uses `today-money-demo`, never `today-money`.
- Added the persistent demo banner, reset, exit, three bills, protected money, formula, history, and purchase check.
- Added `.factory/claims.json` with 26 claims and one tagged browser test for every claim.
- Added real route handling, unique titles and canonical metadata, route focus announcements, Back/Forward focus, and an HTTP 404 page.
- Moved privacy and terms into the shared blueprint shell with complete header and footer navigation.
- Added workflow, limitations, privacy, and exact planned Plus-price sections without changing the drafting-sheet identity.
- Added Open Graph/Twitter metadata, original-art social preview, SVG favicon, and 180px touch icon.
- Added CSP, Permissions-Policy, manifest MIME, immutable hashed-asset caching, and a 404 response override.
- Preserved the earlier strict import validation and unreadable-plan recovery.

Every review item is mapped to its fix and evidence in [.factory/polish-1.md](polish-1.md).

## Verification

From a fresh clone of the committed candidate:

```sh
npm ci
npm test
npm run lint
npm run build
# Every test command in .factory/claims.json was run separately.
npm run test:e2e
```

Results:

- `npm ci`: 0 vulnerabilities.
- `npm test`: 6/6 passed.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/index.html` and all route shells were created.
- Every one of the 26 claim commands: passed from the clean clone.
- `npm run test:e2e`: 46/46 passed across 390×844 and 1440×1000.
- Axe: zero serious or critical findings on landing, demo, privacy, terms, and 404.
- Reduced motion, 200% text, touch layout, dialog focus, and route focus passed.
- Offline: seeded `/demo/` reloaded with `$60.00` after the browser context went offline.
- Privacy: the editable demo flow made only same-origin requests. No analytics, ads, bank, or account request occurred.
- Production JS: 40.37 KB raw / 13.05 KB gzip. CSS: 19.87 KB raw / 5.15 KB gzip.
- Lighthouse mobile, live: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 10 ms.
- `verify-url.sh`, live home and demo: HTTP 200, one H1, one main, `lang=en`, complete alt/button names, zero console errors.
- Live routes: home/demo/privacy/terms return 200; an unknown route returns 404 and renders the designed page.
- Live headers: CSP and Permissions-Policy present; manifest uses `application/manifest+json`; hashed JS uses one-year immutable caching.
- SHA-256: app shell, JS, CSS, service worker, manifest, demo, privacy, terms, and 404 all match `dist/`.

Evidence is in [.factory/evidence](evidence), including cold mobile and desktop screenshots, header captures, hashes, verifier reports, and Lighthouse JSON.

## Deploy

```sh
npm ci && npm test && npm run build
/opt/fleet/lib/deploy-static.sh daily-safe-to-spend dist
```

Azure deployment completed successfully. A cold post-deploy browser check covered demo isolation/reset, `?demo=1`, real-plan separation, route focus, legal routes, HTTP 404, Axe, and offline reload.

## Known gaps

None within the reviewed product scope. No TODOs or deferred findings remain.

The Sociobot product is not enabled for checkout yet, so the interface states that purchases are closed and does not ship a dead buy link. Existing license restore and encrypted-backup behavior remain tested.
