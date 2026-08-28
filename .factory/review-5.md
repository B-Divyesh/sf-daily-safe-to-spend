# Today Money — adversarial first-read review 5

**Verdict: FAIL**

Reviewed 2026-08-28 against the live site at
<https://daily-safe-to-spend.sociobot.in> and repository commit
`d1aa714f80003ac964119a42928d1e69175c83e8`.

One blocking claim failure remains. Everything else checked in this round is
recorded below so that the repair can be verified from a clean state.

## Cold read

Fresh Chromium contexts at 390×844 and 1440×1000 showed the same useful first
screen, before scrolling.

- **What it does:** calculates what a person can spend today after bills and
  protected money.
- **For whom:** “For manual budgeters who need a daily amount without
  connecting a bank.”
- **What to click first:** “Try it with sample data”; the adjacent copy says
  “See a $1,240 plan with bills and protected money.”

The H1, “See what you can spend today”, is six words and names the job. The
first-screen facts name offline use, no bank/account, and the free/planned
price. There was no console error or horizontal overflow in either context.

## Findings

### Blocking

#### F-5-1 — The live offline promise is false after a first visit with no interaction

- **Quote / location:** landing fact, “Works offline after your first visit”; README,
  “Works offline after the first visit.”
- **Evidence:** in a fresh 390px browser context, a cold `/demo` visit left
  `navigator.serviceWorker.getRegistration()` and `navigator.serviceWorker.controller`
  both false. Switching the context offline and reloading then failed with
  `net::ERR_INTERNET_DISCONNECTED`. The code in `src/main.ts` deliberately
  calls `scheduleServiceWorker()`, which only registers after `pointerdown`,
  `keydown`, or a 30-second timer.
- **Why this fails first use:** a visitor can read the promise, load the demo,
  lose their connection, and be unable to reload it. The current
  `@claim:offline-reload` test presses Tab before waiting for the worker, so it
  verifies an interacted-with visit rather than the stated “first visit”.
- **Concrete fix:** register the service worker during the first page load, or
  change the promise to state the real prerequisite. Add a replacement
  `@claim:offline-reload` test that starts from a fresh context, loads `/demo`,
  performs no pointer or keyboard interaction, sets the context offline, and
  reloads to the seeded `$60.00` plan. The deployed copy must not retain “after
  the first visit” until that test passes.

## Demo and sandbox checks

The one-click demo itself is otherwise strong. Clicking “Try it with sample
data” opened `/demo` directly to “Your demo daily amount”, `$60.00`, three
realistic bills, protected money, the persistent “Demo — sample data, nothing
is saved” banner, Reset demo, and Start for real.

I changed the demo balance to `$999`, reset it, and observed the seeded
`$1,240.00` again. I then started a real `$333.00` plan, returned to Demo, and
observed the untouched `$1,240.00` sample. Leaving demo and returning to the
real planner preserved `$333.00`. A whole-flow request observer saw no
off-origin request while entering demo, editing, exporting, resetting, and
leaving it. The interacted-with offline path also works: after a Tab key starts
the worker, an offline reload returns the banner and `$60.00`. That last
qualification is the reason F-5-1 remains blocking.

## Claims

I read `.factory/claims.json` and, from a fresh clone in this sandbox, ran
`npm ci`, `npm test`, `npm run lint`, `npm run build`, then every literal
`test` command in the registry. Unit tests (6), type checking, build, and all
29 registry commands passed. The commands cover these entries:

`manual-plan`, `daily-calculation`, `visible-assumptions`, `purchase-check`,
`purchase-check-nondestructive`, `bill-rules`, `history`, `json-export`,
`csv-export`, `json-import`, `local-plan-storage`, `demo-sandbox`,
`local-data`, `no-bank-connection`, `no-tracking`, `no-account`,
`no-third-party-request`, `offline-reload`, `installable-pwa`,
`price-one-time`, `core-free`, `license-restore`, `encrypted-backup`,
`encrypted-backup-local-privacy`, `keyboard-flow`, `shortfall-clamp`,
`exact-shortfall`, `payday-and-overdue-rules`, and `route-accessibility`.

The registry command for `offline-reload` passes, but its extra Tab interaction
does not prove the landing and README wording. F-5-1 is therefore a claim
coverage and live-behaviour failure, not a clean-clone command failure.

Re-reading the live landing and README found no other unlisted verifiable
promise. Calculation, privacy, storage, export/import, price, encryption,
account, tracking, bank, and offline language all map to registry entries.
The financial-advice wording is a limitation/disclaimer, not a promise of an
observable product outcome.

## Copy audit

Counts use whitespace-separated visible words; hyphenated terms and prices
count as one. The following is the complete landing-sentence inventory. No
entry exceeds 22 words or contains a banned marketing adjective.

| Landing text | Words | Result |
| --- | ---: | --- |
| For manual budgeters who need a daily amount without connecting a bank. | 12 | Clear; `manual-plan` |
| See a $1,240 plan with bills and protected money. | 9 | Clear demo result |
| Works offline after your first visit. | 6 | F-5-1 |
| No bank connection or account. | 5 | Plain fact |
| Core plan is free; Plus is planned at $12 once. | 10 | Plain price |
| Use current accounts and cash. | 5 | Clear |
| Subtract any card balance you must clear. | 7 | Clear |
| Do not include your upcoming pay. | 6 | Clear |
| This is a planning aid, not financial advice. | 8 | Clear limitation |
| Your entries never leave this device. | 6 | `local-data` |
| Enter cash and payday. | 4 | Clear step |
| Start with money you can spend now. | 7 | Clear step |
| Add bills and protected money. | 5 | Clear step |
| Mark what must stay outside daily spending. | 7 | Clear step |
| Check today’s amount. | 3 | Clear step |
| See the formula or test a purchase. | 7 | Clear step |
| It does not connect to banks, predict income, or give financial advice. | 12 | Clear boundary |
| Your budget stays in this browser. | 6 | `local-plan-storage` |
| No analytics or advertising tools receive it. | 7 | `no-tracking` |
| The planned Today Money Plus price is US$12 once. | 9 | `price-one-time` |
| It adds password-protected backup and restore. | 6 | `encrypted-backup` |
| The daily plan and ordinary exports stay free. | 8 | `core-free` |
| Purchases are not open yet. | 5 | Clear availability |
| See a daily amount after bills and protected money. | 9 | Clear footer line |

Landing headings and actions are also clear out of context: “Daily amount
after bills and protected money” (7), “See what you can spend today” (6),
“Enter your starting cash and payday” (6), “How the daily amount works” (5),
“What Today Money does not do” (6), and “Move an encrypted backup between
devices” (6). “Try it with sample data” names the result, while “Show my daily
amount”, “Export JSON”, “Export CSV”, “Reset demo”, and “Start for real” are
plain result-naming actions. The terminology remains consistent: **daily
amount**, **protected money**, **manual budgeter**, **plan**, **backup file**,
and **spreadsheet file**. No copy finding other than F-5-1 resulted.

The complete README sentence/list-item inventory follows.

| README text | Words | Result |
| --- | ---: | --- |
| Today Money is a daily spending planner for manual budgeters. | 10 | `manual-plan` |
| It works without a bank connection or account. | 8 | Registered |
| Enter cash, bills, and protected money. | 6 | Clear |
| See a daily amount until payday. | 6 | `daily-calculation` |
| Check a purchase before you make it. | 7 | `purchase-check` |
| Try the isolated sample plan: URL. | 6 | Clear demo entry |
| Shows every number used in the daily amount. | 8 | `visible-assumptions` |
| Includes unpaid and overdue bills through payday. | 7 | `bill-rules` |
| Keeps paid bills outside the amount. | 6 | `bill-rules` |
| Checks a purchase without changing the plan. | 7 | Registered |
| Records balance changes in this browser. | 6 | `history` |
| Downloads a spreadsheet or backup file. | 6 | Registered |
| Imports a valid backup file. | 5 | `json-import` |
| Works offline after the first visit. | 6 | F-5-1 |
| The core planner and ordinary exports are free. | 8 | `core-free` |
| The planned Plus price is US$12 once. | 7 | `price-one-time` |
| Plus adds password-protected backup and restore across devices. | 8 | `encrypted-backup` |
| Today Money does not connect to banks or give financial advice. | 10 | Clear boundary |
| Budget data stays in this browser. | 6 | `local-plan-storage` |
| Use Node.js 20 or newer. | 5 | Maintainer instruction |
| Open localhost. | 2 | Maintainer instruction |
| Open localhost/demo for sample data. | 5 | Maintainer instruction |
| The claim registry is `.factory/claims.json`. | 5 | Repository fact |
| Each claim names its browser test. | 6 | Repository fact |
| The production build is in `dist/`. | 6 | Repository fact |
| Its root contains `index.html` and static-host configuration. | 7 | Repository fact |
| The daily amount never goes below zero. | 7 | `shortfall-clamp` |
| A shortfall shows the exact missing amount. | 7 | `exact-shortfall` |
| Payday is not a spending day. | 6 | Registered |
| An overdue unpaid bill stays included until you mark it paid. | 11 | Registered |
| The real plan uses the `today-money` browser database. | 8 | Storage documentation |
| The demo uses `today-money-demo` and never reads the real plan or license. | 12 | `demo-sandbox` |
| Serve `dist/` as a static site over HTTPS. | 8 | Maintainer instruction |
| The Param Factory manages deployment, DNS, and billing registration. | 9 | Operational fact |
| Read the live Privacy and Terms pages. | 7 | Maintainer instruction |
| MIT licensed. | 2 | License fact |
| Original generated-asset provenance is recorded in `.factory/design.md`. | 7 | Repository fact |

“URL”, “localhost”, and “localhost/demo” above stand for the literal rendered
URL values; each counts as one visible token. The README technical terms occur
in its maintainer/data section, rather than as visitor-facing marketing.

## Structure, accessibility, and live crawl

The live route sweep found the required title pattern, one H1, description,
canonical, shared OG image, favicon declarations, shared header/footer, and no
serious or critical Axe violation on `/`, `/demo`, `/privacy`, `/terms`, or the
404 route. `/this-page-is-missing` returned an actual HTTP 404 and rendered
“This page does not exist” with a home action. All internal links crawled from
those routes returned 200; the two contact links are explicit `mailto:` links.

Privacy navigation moved focus to its H1 and announced “Your money stays yours
page loaded”; browser Back restored the demo H1 and its announcement. The
sitemap lists all four public routes. Home, manifest, and 404 responses expose
the configured CSP, permissions policy, referrer policy, and nosniff header.
The production build reports 13.36 KB gzipped application JavaScript.

The drafting-sheet identity is distinct and matches `.factory/design.md`:
navy measured grid, cream drafting text, yellow measurement/action accents,
and the project-owned compass/wallet illustration. It is not a generic SaaS
hero or card grid.

## Earlier findings rechecked

Every earlier review, polish record, and handoff was read. The following table
confirms the live and code result for each prior finding; the only reopened
item is the new F-5-1, not a regression of a prior id.

| Earlier id | Confirmed current state |
| --- | --- |
| F-1-1 | Clear audience, job, sample action, and result preview are live. |
| F-1-2 | `/demo` is seeded, bannered, resettable, and uses the separate demo database. |
| F-1-3 | 29-entry registry and tagged browser coverage exist. |
| F-1-4 | Reopened separately as F-5-1: the wording is not true before worker registration. |
| F-1-5 | Sample visibly computes `$1,240 − $390 − $250` over 10 days as `$60`. |
| F-1-6 | Cash, bills, protected money, days, and formula are visible. |
| F-1-7 | Whole demo flow stayed same-origin; budget never left the browser. |
| F-1-8 | `$333` real plan and `$1,240` demo remained isolated in the live replay. |
| F-1-9 | No bank connection is stated and covered by intercepted demo flow. |
| F-1-10 | No analytics/advertising request appeared in the whole-flow observer. |
| F-1-11 | README now plainly names the audience, calculation, and purchase check. |
| F-1-12 | Account, tracking, third-party, and local-storage claims have tagged coverage. |
| F-1-13 | JSON/CSV export and valid JSON import have observable claim coverage. |
| F-1-14 | Paid, due, and overdue bill rules and formula are observable in demo. |
| F-1-15 | Purchase check is claimed and tested as non-destructive. |
| F-1-16 | History, import/export, PWA, and offline have coverage; offline wording remains F-5-1. |
| F-1-17 | Planned US$12 price and encrypted sample backup/restore are tested. |
| F-1-18 | 390px keyboard and dialog-focus test passes. |
| F-1-19 | Clamp, exact shortfall, payday, and overdue boundaries have tagged tests. |
| F-1-20 | Styled 404 returns HTTP 404 with a return action. |
| F-1-21 | README inventory has no sentence over 22 words. |
| F-1-22 | Task-named landing headings replaced generic/metaphorical headings. |
| F-1-23 | “Show my daily amount” names the real-plan result. |
| F-1-24 | Visitor copy consistently uses “protected money”. |
| F-1-25 | Visitor copy stays plain; technical terms are limited to maintainer documentation. |
| F-1-26 | Demo has its own title/canonical and appears in the sitemap. |
| F-1-27 | Canonical, OG/Twitter image, SVG favicon, and touch icon are present. |
| F-1-28 | Route changes and Back focus/announce the new H1. |
| F-1-29 | Header, skip link, and complete footer are shared by legal routes. |
| F-1-30 | Workflow, boundaries, and planned paid tier are present on landing. |
| F-1-31 | Live home, manifest, and 404 carry the expected headers and MIME type. |
| F-2-1 | Price is consistently labelled planned; purchases are explicitly closed. |
| F-2-2 | Free core/edit/export workflow has a passing no-billing claim test. |
| F-2-3 | Encrypted backup restores in a separate fresh context. |
| F-2-4 | Copy audit is complete and correctly uses the stated counting rule. |
| F-3-1 | Real-plan license restoration has recorded valid/invalid/failure/cached coverage. |
| F-3-2 | License-only request boundary and local encrypted backup are covered. |
| F-3-3 | Merchant wording is conditional on unavailable future purchases. |
| F-1-2 (review 4 reopen) | Demo no longer reads, writes, or accepts a real license. |

## Missed leverage

No additional feature is expected from the brief. Manual input, visible
assumptions, purchase checking, imports/exports, optional encrypted backup,
and offline use cover the stated job. An AI feature would add cost and a
privacy boundary to a transparent local calculation without improving the core
answer, so its absence is correct. No provider key or decorative AI feature
was found.

## What would make this perfect

Register the offline worker on the first load and prove a no-interaction fresh
demo reload works offline. Once the claim and its test agree, re-run this full
checklist; no other finding from this round remains.
