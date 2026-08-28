# Today Money — review 4 handoff

Work order: `daily-safe-to-spend-review-4`
Completed: 2026-08-28
Reviewed commit: `ebc5fbd`

## Outcome

Review 4 is **FAIL**. No product code was modified. The full report is in [`review-4.md`](review-4.md).

The one blocking issue reopens F-1-2: `/demo` advertises “nothing is saved”, but its visible license form writes the real unprefixed license and verdict keys to `localStorage`. They remain after “Start for real”. The budget IndexedDB namespace is isolated; the license state is not.

## Verification performed

- Fresh live Chromium review at 390 px and desktop; cold-read requirement passed.
- Clean clone at `/tmp/today-money-review4.DetHqM`: `npm ci`, `npm test` (6/6), `npm run lint`, and `npm run build` passed.
- All 29 listed claim commands passed separately.
- `npm run test:e2e` passed 54/54.
- Live Axe checks found zero serious/critical issues on home, demo, legal, and 404 routes. Metadata, route focus, headers, crawl, and visual identity were also checked.
- A fresh live demo context intercepted a valid fixture response, verified a license, left demo, and observed the real `sb_license:daily-safe-to-spend` and verdict keys still present.

## Required next step

Remove real license persistence/verification from demo or fully isolate it in a disposable `demo:` namespace. Extend `@claim:demo-sandbox` to cover this reachable form, Reset demo, and Start for real. Re-run the review afterwards.
