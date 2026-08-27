# Independent verification — FAIL

Verified on 2026-08-27 against candidate commit
`c08128d46c80e9896a951702f90ed9c2384fa539`.

- Local candidate: production output from that clean checkout.
- Live URL: <https://daily-safe-to-spend.sociobot.in>.
- Result: **FAIL — do not release**. The import path can overwrite a valid
  local plan with semantically invalid JSON and then make the application
  unrecoverable through its own UI.

## Release blocker

### P1 — malformed import replaces the user's plan and locks the app

`isBudgetState` accepts date-shaped strings without checking that they are
calendar dates, and accepts arbitrary `updatedAt` text. The following file
passes validation and presents the normal destructive-import confirmation:

```json
{
  "version": 1,
  "balance": 10,
  "payday": "2026-13-01",
  "currency": "USD",
  "bills": [],
  "envelopes": [],
  "history": [],
  "updatedAt": "not-a-date"
}
```

Fresh Chromium reproduction:

1. Create a normal plan (for example, cash `50` and the default payday).
2. Import the JSON above and accept “Replace the plan on this device…”.
3. Reload the page.

Observed result: the original plan has already been overwritten in IndexedDB;
reload shows only **“Your saved plan could not be opened.”**, with
**“Invalid time value”** and a “Try again” button. There is no in-app reset,
export, or recovery path. This fails the required invalid-input/recovery
behavior and is particularly serious for a local-first budgeting product.

The deployed assets are exact SHA-256 matches for this candidate, so the live
deployment contains the same defect.

## Checks that passed

### Clean checkout and build

- `npm ci`: completed; npm audit reported 0 vulnerabilities.
- `npm test`: 4/4 Vitest tests passed.
- `npm run build`: passed (includes `tsc --noEmit`); created `dist/`.
- `npm run test:e2e`: 4/4 Playwright tests passed.
- No separate lint script is defined in `package.json`.
- Built payload: JS 31,190 bytes / 10,249 gzip; CSS 16,702 bytes / 4,544
  gzip; AVIF hero 12,146 bytes; WebP hero 14,286 bytes. Initial JS is well
  within the 200 KB budget and CSS within the 50 KB budget.

### Independent browser exercise

- Chromium desktop (1440×1000) and mobile (390×844): normal plan with
  `$1,000` cash, `$300` bill, `$200` protected money and a 10-day payday
  displayed `$50.00/day`; a `$501` purchase correctly said it crossed the
  line by `$1.00`.
- Boundary behavior: a $100 bill after payday left `$100.00/day`; a $100
  overdue unpaid bill reduced it to `$90.00/day` and was labelled
  “Overdue — included”. Zero/negative purchase input recovers to the prompt;
  shortfall state displayed `$0.00` and the exact shortfall.
- Native required/minimum validation prevented empty and non-positive bill or
  protected-pot amounts. A syntactically invalid JSON import produced the
  readable error toast and did not replace the plan. The semantic-date import
  case above is the exception and blocker.
- Keyboard: visible 3px focus treatment observed; dialogs focus their first
  control and Escape returns focus to “Add bill”. Reduced motion changes the
  result animation duration to `0.01ms`.
- Axe (Playwright) found zero serious/critical violations on onboarding and a
  populated dashboard at both viewports; existing end-to-end coverage also
  passed privacy and terms pages. The document has a title, `lang`, one h1,
  and one main landmark. No console or page errors occurred in normal flows.

### PWA, privacy, and live deployment

- Live HTML, `sw.js`, `manifest.webmanifest`, JS and CSS were hash-identical
  to the fresh candidate build. The deployed app is therefore not a stale or
  different revision.
- Live mobile Chromium registered `https://daily-safe-to-spend.sociobot.in/sw.js`
  with the expected scope, then reloaded the saved `$50.00` plan while the
  browser context was offline.
- Update behavior was exercised against a temporary test origin serving the
  unmodified production app and a changed worker: it showed “A fresh drawing
  is ready. Update now”; the shipped worker handles `SKIP_WAITING`.
- Normal live and local flows made no outbound requests. Source/build review
  found no analytics, CDN scripts, remote fonts, or bank endpoints. The only
  possible third-party request is the documented Sociobot license verification
  endpoint after a user supplies a Plus license.
- Live headers include HSTS, `nosniff`, referrer policy, and short
  revalidation. They do **not** include CSP or Permissions-Policy; this is a
  hardening gap, not the release verdict. Hashed JS/CSS are also served with
  `cache-control: public, must-revalidate, max-age=30` rather than long-lived
  immutable caching, which misses the stated PWA cache policy but does not
  prevent the verified service-worker offline path.

## Required fix and retest

Reject impossible calendar dates and invalid ISO timestamps before *any*
destructive import/persist, and retain the existing plan until validation has
fully succeeded. Provide a usable recovery/reset route if persisted data still
cannot render. Add regression tests for invalid calendar dates and timestamps,
then rerun the full suite, production build, offline reload, and this import
reproduction.
