# Today Money

Today Money is a deliberately small, offline safe-to-spend planner for people
who budget manually. Enter the cash available now, the bills due before the
next payday, and money that must stay protected; the app shows a conservative
daily amount and lets you test a purchase against that plan.

It is not a bank-connected budget suite or financial advice. There are no
accounts, analytics, third-party scripts, or cloud storage. Budget data lives
in IndexedDB on the current device and can be exported as JSON or CSV.

Live product: <https://daily-safe-to-spend.sociobot.in>

## Features

- Transparent safe-to-spend calculation with every input visible
- Bills due before payday, paid state, overdue handling, and protected pots
- Non-destructive “Can I buy this?” purchase check
- Balance history plus JSON/CSV ownership exports and imports
- Installable PWA with a precached app shell and tested offline reload
- Optional US$12 one-time Plus license for client-side encrypted backups
- Mobile-first keyboard-accessible interface, privacy and terms pages

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

The development server does not register the service worker, avoiding stale
assets while editing.

## Test and build

```sh
npm test
npm run build
npm run test:e2e
```

`npm run build` is the deploy command. It type-checks, creates the Vite bundle,
and injects built assets into the service worker precache. Static output lands
in `dist/`, with `dist/index.html` at its root.

The Playwright suite uses Chromium and covers the complete calculation flow,
an axe accessibility scan, persistence, and offline reload. Install the pinned
browser if the environment does not already provide it:

```sh
npx playwright install chromium
```

## Calculation

```text
(current cash − unpaid bills due by payday − all protected money)
÷ days before payday
```

The result never displays as a negative allowance. When obligations exceed
cash, the app reports the exact shortfall. Payday itself is excluded as a
spending day, and an overdue unpaid bill stays included until marked paid.

## Deploy

Serve `dist/` as a static site over HTTPS. Configure clean directory routes so
`/privacy/` and `/terms/` resolve to their included `index.html` files. Do not
edit DNS, billing, or infrastructure from this repository; the Param Factory
handles deployment and registers the Sociobot product slug.

## Project records

- [Visual system](.factory/design.md)
- [Build handoff](.factory/handoff.md)
- [Privacy policy](public/privacy/index.html)
- [Terms](public/terms/index.html)

MIT licensed. Generated-asset provenance is recorded in
`.factory/design.md` and `assets/src/drafting-wallet.prompt.json`.
