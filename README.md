# Today Money

Today Money is a daily spending planner for manual budgeters. It works without a bank connection or account.

Enter cash, bills, and protected money. See a daily amount until payday. Check a purchase before you make it.

Try the isolated sample plan: <https://daily-safe-to-spend.sociobot.in/demo>

## What it does

- Shows every number used in the daily amount.
- Includes unpaid and overdue bills through payday.
- Keeps paid bills outside the amount.
- Checks a purchase without changing the plan.
- Records balance changes in this browser.
- Downloads a spreadsheet or backup file.
- Imports a valid backup file.
- Works offline after the first visit.

The core planner is free. The planned Plus price is US$12 once. Plus adds password-protected backup and restore.

Today Money does not connect to banks or give financial advice. Budget data stays in this browser.

## Run it

Use Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open <http://localhost:5173>. Open <http://localhost:5173/demo> for sample data.

## Test and build

```sh
npm test
npm run lint
npm run build
npm run test:claims
npm run test:e2e
```

The claim registry is [.factory/claims.json](.factory/claims.json). Each claim names its browser test.

The production build is in `dist/`. Its root contains `index.html` and static-host configuration.

## Calculation

```text
(current cash − unpaid bills due by payday − all protected money)
÷ days before payday
```

The daily amount never goes below zero. A shortfall shows the exact missing amount.

Payday is not a spending day. An overdue unpaid bill stays included until you mark it paid.

## Data and deployment

The real plan uses the `today-money` browser database. The demo uses `today-money-demo` and never reads the real plan.

Serve `dist/` as a static site over HTTPS. The Param Factory manages deployment, DNS, and billing registration.

Read the live [Privacy](https://daily-safe-to-spend.sociobot.in/privacy) and [Terms](https://daily-safe-to-spend.sociobot.in/terms) pages.

MIT licensed. Original generated-asset provenance is recorded in [.factory/design.md](.factory/design.md).
