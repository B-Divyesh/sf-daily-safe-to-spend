# Today Money — independent verification 2

**Verdict: PASS** — candidate `f9a142ae9b18080347ef6fb59b8491e6ede12c0a` is a working, local-first offline PWA for the researched manual-budgeting job. The live deployment at <https://daily-safe-to-spend.sociobot.in> is byte-identical to the candidate build for the checked app shell, JS, CSS, service worker, manifest, legal pages, and offline page.

Verified on 2026-08-28 from a clean, clean-worktree checkout at the candidate SHA. This report supersedes neither the historical report nor the repair handoff; it is a fresh independent result.

## Release checks

| Check | Result / evidence |
| --- | --- |
| Install | `npm ci` completed; `npm audit --omit=dev --audit-level=high` reported 0 vulnerabilities. |
| Unit calculations and import validation | `npm test`: 6/6 Vitest tests passed. Covers ordinary calculation, shortfall clamp, expired/today payday, and impossible date/timestamp imports. |
| Type/lint | `npm run lint` (`tsc --noEmit`) passed. |
| Exact production build | `npm run build` passed and generated `dist/` plus `sw.js` precache. |
| Browser integration | Fresh isolated `npm run test:e2e`: 14/14 passed in 48.0 s, at 390×844 and 1440×1000. It covers plan setup, bills/protected money, purchase decision, persistence, malformed-import preservation, legacy-storage recovery, keyboard dialog behavior, encrypted backup/restore, legal pages, offline reload, console/page errors, and Axe. |
| Core job, boundaries, recovery | The normal $1,000 / 10-day / $300 bill / $200 protected case produced $50/day. The checked suite independently exercises $0 daily with exact shortfall, payday-today/expired one-day behavior, paid/excluded and overdue/included bill logic, semantic-invalid JSON rejection without replacement, and recovery from an unreadable IndexedDB plan. |
| Manual visual/responsive review | Fresh screenshots at 390×844 and 1440×1000 show the product-specific drafting-sheet layout stacks intentionally on mobile; no overlap or clipped fixed UI was observed. The first input received keyboard focus with a visible `solid 3px rgb(59, 120, 162)` ring. Native dialog Enter/Escape/focus return passed in both viewports. |
| Accessibility | The built-in Playwright Axe scans reported zero serious/critical findings for landing, dashboard, privacy, and terms at both sizes. Local Lighthouse accessibility, best-practices, and SEO scores were each 100. HTML has `lang=en`, title, one h1 and main; the page has a skip link, labels, landmark structure, alt text, and reduced-motion CSS. |
| Reduced motion | Browser emulation reported transition and animation duration `1e-05s` under `prefers-reduced-motion: reduce`; no looping animation was found. |
| PWA/offline | Local and live Chromium probes found an active controller and the versioned `today-money-assets/index-D5C3HvO_.js` cache. A saved dashboard reloaded while the browser context was offline. Chromium `Page.getInstallabilityErrors` returned `[]` locally and live. In a separate copy of the exact `dist/`, a controlled `sw.js` revision caused the in-app “A fresh drawing is ready” toast; clicking Update now activated the controller with no errors. |
| Privacy and outbound traffic | Static source/build scan found no analytics, ads, CDN fonts/scripts, bank requests, or budget-data network path. The sole remote application endpoint is the documented Sociobot license API, reached only after a person supplies a license. Budget state is IndexedDB; license/verdict only are localStorage. `/privacy/` and `/terms/` exist and match the build. |
| Browser errors | The repository E2E run and separate local/live PWA probes recorded zero console errors and page errors. |
| Deployment identity | SHA-256 equality was confirmed between `dist/` and live for `index.html`, `assets/index-D5C3HvO_.js`, `assets/style-j_XJmQHt.css`, `sw.js`, `manifest.webmanifest`, `offline.html`, `privacy/index.html`, and `terms/index.html`. Live JS is 32,333 bytes, matching the build. |
| Size budget | Initial JS is 32.33 KB (10.59 KB gzip), CSS 16.85 KB (4.57 KB gzip), and hero AVIF/WebP 12.15/14.29 KB. There are no shipped web-font files. All are within the stated static budgets. |

## Performance measurement

Lighthouse 12.8.2 against the exact local production build recorded accessibility 100, best practices 100, SEO 100, FCP 1.0 s, and CLS 0. Its performance category was not emitted because this container's Chromium trace processor returned `LanternError: NO_LCP`; this is a measurement-environment limitation, not a failed audit. The byte-budget and browser smoke evidence above passed.

## Live response-policy evidence

The live URL returned HTTP 200 with HSTS (`max-age=10886400; includeSubDomains; preload`), `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`. Live Chromium reported no manifest/installability errors even though the host serves the manifest as `application/octet-stream`.

## Findings

No P0 or P1 defects found.

### P2 — deployment caching and defense-in-depth headers

The live host serves the hashed JS/CSS, service worker, and app shell with `Cache-Control: public, must-revalidate, max-age=30`, rather than long-lived `immutable` caching for content-hashed assets. It also does not send `Content-Security-Policy` or `Permissions-Policy`. The service worker's versioned, cache-first precache makes the app work offline and mitigates repeat-visit caching, so this is not a functional release blocker; it remains hosting configuration work outside this static repository. Serving `manifest.webmanifest` as `application/manifest+json` rather than `application/octet-stream` is also recommended for broader tooling compatibility, although current Chromium installability passes.

### P3 — performance composite unavailable in this container

The local Lighthouse trace processor produced `NO_LCP`, so no composite performance score was available. FCP/CLS, accessibility, best practices, SEO, bundle budgets, and browser smoke tests passed. Re-run Lighthouse in the factory deployment browser when a trace processor that emits LCP is available.

## How to reproduce

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
```

Serve `dist/` over HTTPS, then use a Chromium context to register the service worker, reload once to acquire its controller, set the context offline, and reload the saved dashboard. Compare the live app-shell and hashed-asset SHA-256 values against `dist/` to confirm deployment identity.
