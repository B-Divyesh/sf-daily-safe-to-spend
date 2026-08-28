# Today Money — polish 4 handoff

Work order: `daily-safe-to-spend-polish-4`
Repair commit: `6c25b5be4243e5fb75cdd4fb9822f3e286412b39`
Deployment: <https://daily-safe-to-spend.sociobot.in>
Static Web Apps deployment: `79cb4cae-9371-4009-b915-71c56fa12b7d`

## Outcome

Pass. The reopened demo isolation defect is fixed. Demo Plus access is now an
in-memory sample state: it renders no real license form, strips a `license`
query value from `/demo` and `?demo=1`, makes no billing request, and never
reads or writes real license keys. Reset demo and Start for real discard the
sample state. The real planner still offers recorded-fixture-tested license
restoration after a visitor deliberately starts a real plan.

The repair also corrected the sample backup controls’ contrast on cream paper.
The product remains the original blueprint drafting-sheet PWA; no visual-system
or deployment-class substitution was made.

## Verification

- Local current checkout: `npm test` passed 6/6; `npm run lint` passed;
  `npm run build` passed; `npm run test:claims` passed 19 browser tests carrying
  all 29 claim tags; `npm run test:e2e` passed 54/54 across mobile and desktop.
- Fresh clone `/tmp/today-money-polish4.Avb7rR/repo` at the repair commit:
  `npm ci`, unit tests, lint, build, every literal `.factory/claims.json`
  command separately, and the 54-case browser suite all passed. Exact evidence:
  [`polish-4-clean-clone.md`](evidence/polish-4-clean-clone.md).
- Local `verify-url.sh` checks passed for home, demo, Privacy, and Terms;
  screenshots and browser reports are under `evidence/polish-4-local-*`.
- Local mobile Lighthouse retry recorded Performance 100, Accessibility 100,
  Best Practices 100, and SEO 100; LCP was 1.5 s and CLS 0. See
  [`polish-4-lighthouse-local-retry.json`](evidence/polish-4-lighthouse-local-retry.json).
- Cold live `verify-url.sh` checks passed on home, demo, Privacy, and Terms
  with no browser errors. Live 404 returned HTTP 404. Cold live Playwright Axe
  found zero serious/critical issues on home, demo, Privacy, Terms, and 404.
  The direct `?demo=1&license=…` replay confirmed no license form, no real
  keys, no cross-origin request, and correct Reset/Start-for-real disposal.
  See [`polish-4-live-review.md`](evidence/polish-4-live-review.md).

## How to run

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:claims
npm run test:e2e
```

Open `/demo` or `/?demo=1` for sample data. The real planner uses the separate
`today-money` database. Serve `dist/` as a static HTTPS site; the factory owns
deployment, DNS, and billing registration.

## Known gaps

None.
