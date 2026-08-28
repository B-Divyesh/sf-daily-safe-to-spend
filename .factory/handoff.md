# Today Money — polish round 3 handoff

Work order: `daily-safe-to-spend-polish-3`

Completed: 2026-08-28

Product commit: `43ae27935d957db5b0759be9559e1835f31538f6`

Live: <https://daily-safe-to-spend.sociobot.in>

## Outcome

All findings from `.factory/review-1.md`, `.factory/review-2.md`, and
`.factory/review-3.md` are resolved. The PWA keeps its blueprint/drafting
identity and static offline deployment class. The complete finding map is
[polish-3.md](polish-3.md).

Round 3 added observable proof for existing-license restoration and the full
encrypted-backup privacy boundary. It also removed current merchant wording
while checkout remains unavailable. A live self-review found that rewritten
404 responses lacked global security headers; that defect was fixed,
redeployed, and verified before handoff.

## What changed

- Added `license-restore` to `.factory/claims.json`. The test submits the
  visible license form and covers a recorded valid response, invalid response,
  network failure, cached verdict, unlocked controls, and offline cached use.
- Added `encrypted-backup-local-privacy`. It covers verify, encrypt, download,
  file selection, and restore while intercepting every request. The sole
  external request contains only the license; the password, file, and budget
  never leave the browser.
- Added recorded verification fixtures in
  `tests/fixtures/license-responses.json`.
- Removed current merchant-of-record wording from the unavailable Plus state.
  Planned price and availability wording now agree across home, planner, and
  legal routes.
- Moved security headers to Static Web Apps `globalHeaders`, covering normal
  pages, the manifest, and rewritten 404 responses.
- Pinned Playwright to the installed Chromium channel for repeatable clean
  worker runs.
- Updated the build marker to `1.3.0-polish-3`, the claim registry, copy audit,
  catalog description, and this evidence package.

The catalog description is 94 characters and starts with a verb:
“Calculate what you can spend today after bills and protected money, without
connecting a bank.”

## Clean-clone verification

Verified from `/tmp/today-money-polish3-release.F2iGZD` at exact product commit
`43ae27935d957db5b0759be9559e1835f31538f6`:

- `npm ci`: passed; 0 audit vulnerabilities.
- `npm test`: 6/6 passed.
- `npm run lint`: passed.
- `npm run build`: passed; static output is in `dist/` with
  `dist/index.html` at its root.
- All 29 commands in `.factory/claims.json`: passed separately.
- `npx playwright test --retries=0`: 54/54 passed at mobile and desktop sizes.
- Axe route sweep: zero serious or critical violations on home, demo, privacy,
  terms, and 404.
- URL verifier: correct title, language, landmarks, image alternatives, named
  controls, and zero normal-route console errors on home and demo.

Detailed output is recorded in
[polish-3-clean-clone.md](evidence/polish-3-clean-clone.md).

## Live verification

The final static artifact was deployed with the work-order deploy command.
The live JavaScript SHA-256 matched the built artifact. Cold sessions then
verified:

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns
  the designed page with HTTP 404.
- `/?demo=1` enters the isolated seeded demo and has demo title/canonical data.
- A real $333 plan remained unchanged after editing/resetting/exiting the demo;
  the demo restored its $1,240 seed and $60 daily amount.
- The installed demo reloaded offline with its banner and sample result.
- Demo → Privacy → Back moved focus to the correct route H1 each time.
- No 390 px horizontal overflow and no normal-route console/page errors.
- Live Axe checks found zero serious or critical violations on every route.
- The production bundle passed valid, invalid, and failed license responses,
  cached access, encrypted restore, and the license-only network boundary.
- Home, manifest, and 404 responses include CSP, Permissions-Policy,
  Referrer-Policy, and `X-Content-Type-Options`; manifest MIME is correct.

Live mobile Lighthouse: performance 100, accessibility 100, best practices
100, SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 20 ms. Local mobile Lighthouse
also scored 100 in all four categories; FCP 0.9 s, LCP 1.4 s, CLS 0, TBT 30 ms.

Built budgets: JavaScript 40.48 KB raw / 13.08 KB gzip; CSS 19.87 KB raw /
5.15 KB gzip; hero AVIF 12.15 KB; no web fonts.

Evidence:

- [Live home](evidence/polish-3-live-home/screenshot-mobile.png)
- [Live isolated demo](evidence/polish-3-live-demo/screenshot-mobile.png)
- [Live restored license](evidence/polish-3-live-license-restored.png)
- [Live styled 404](evidence/polish-3-live-404-mobile.png)
- [Live Lighthouse report](evidence/polish-3-lighthouse-live.json)
- [Live home headers](evidence/polish-3-live-home-headers.txt)
- [Live manifest headers](evidence/polish-3-live-manifest-headers.txt)
- [Live 404 headers](evidence/polish-3-live-404-headers.txt)

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npx playwright test --retries=0
```

Run every `test` value in `.factory/claims.json` separately for the acceptance
claim suite. Serve `dist/` over HTTP to verify service-worker and offline
behavior.

## Known gaps and next steps

None. Purchases are deliberately not open, and the product makes no current
checkout or merchant claim. When checkout is enabled in a future work order,
its billing and merchant assertions will require new registered claim tests.
