# Today Money — adversarial first-read review 3

**Verdict: FAIL**

Reviewed 2026-08-28 against the live site at
<https://daily-safe-to-spend.sociobot.in> and repository commit
`93bff872fd7e65c450ed99d9b05b09898750e1b9`.

The cold landing, one-click demo, core calculation, local sandbox, offline
behavior, routes, accessibility baseline, and all 27 registered claim commands
pass. This is still not a zero-finding product. The live planner makes two
current promises that are absent from `.factory/claims.json`, and its
merchant-of-record wording conflicts with the stated unavailable purchase.

## Findings

### Blocking

#### F-3-1 — License restoration is a current but unlisted product claim

- **Exact quote / location:** live `/demo`, unlicensed Plus section: “Existing
  license holders can restore access below.” The action is “Verify license”.
- **Evidence:** `.factory/claims.json` has no license-verification or
  access-restoration entry. `@claim:encrypted-backup` does not use the form or
  verification endpoint; `unlockFixture()` writes a valid verdict directly to
  localStorage. `@claim:core-free` explicitly rejects billing traffic.
- **Why a visitor is misled:** purchases are closed, so this is the only stated
  route to the paid feature. No registered sandbox test proves that the visible
  route accepts a valid existing license, rejects an invalid one, fails safely,
  or unlocks the promised controls.
- **Concrete fix:** add a `license-restore` claim. In a fresh `/demo`, intercept
  the Sociobot verification endpoint with recorded valid, invalid, and network
  failure responses. Submit the visible form and assert the request, result
  message, cached verdict, unlocked controls, and offline cached-license state.
  Do not bypass the form by writing a verdict in the test.

#### F-3-2 — The encrypted-backup privacy promise is unlisted and untested

- **Exact quote / location:** licensed Plus section: “We never receive the file
  or password.” Privacy route: “It sends the license, not your budget.”
- **Evidence:** `@claim:encrypted-backup` confirms encrypted contents and a
  cross-context restore, but it does not intercept network traffic.
  `@claim:local-data` intercepts ordinary add/check/export actions, but never
  enters the licensed backup flow or submits the license form.
- **Why a visitor is misled:** these are explicit privacy boundaries around a
  password, backup file, and budget. The registered tests do not observe the
  flows where those values exist, so they cannot support the promise.
- **Concrete fix:** add an `encrypted-backup-local-privacy` claim. From a fresh
  licensed demo fixture, intercept the complete license, encrypt, download,
  choose-file, and restore flow. Assert that no request contains the password,
  file, or budget; assert that the sole allowed verification request contains
  only the license; retain the existing plaintext-absence assertions.

### Minor

#### F-3-3 — Current merchant wording conflicts with closed purchases

- **Exact quote / location:** live unlicensed Plus section: “Sociobot/Dodo is
  the merchant of record.” The same section says “Purchases are not open yet.”
  `/terms` instead says “When available, Sociobot/Dodo will handle payments and
  refunds as merchant of record.”
- **Why a visitor is misled:** the planner presents a current commercial
  relationship for a transaction it says cannot be made, then uses future
  wording elsewhere. The sentence is also absent from the claim registry.
- **Concrete fix:** remove the current-tense dashboard sentence until checkout
  exists. When purchases open, register and test the checkout/merchant path,
  then use the same wording in the planner and Terms.

## Cold first screen

Fresh Chromium contexts at 390×844 and 1440×1000 were opened without stored
site data. Before scrolling, all three required answers were clear:

- **What it does:** calculates what can be spent today after bills and
  protected money.
- **For whom:** manual budgeters who do not connect a bank.
- **First click:** **Try it with sample data**.

The answer comes from “See what you can spend today”, “For manual budgeters who
need a daily amount without connecting a bank”, and “Try it with sample data”.
All three plain facts are also visible at 390 px. There was no horizontal
overflow or console/page error. Evidence: [mobile](evidence/review-3-live-home-mobile.png)
and [desktop](evidence/review-3-live-home-desktop.png).

## Copy audit

Counts use whitespace-separated words. Hyphenated terms, prices, URLs, paths,
and inline-code values each count as one word. Punctuation and decorative
arrows do not count. No landing or README item exceeds 22 words, uses a banned
marketing adjective, or introduces inconsistent visitor terminology. The
unlisted claims in F-3-1–F-3-3 occur in the planner/legal UI, outside the two
surfaces requested for this copy inventory.

### Live landing sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For manual budgeters who need a daily amount without connecting a bank. | 12 | Pass |
| See a $1,240 plan with bills and protected money. | 9 | Pass |
| Works offline after your first visit. | 6 | Registered claim |
| No bank connection or account. | 5 | Registered claims |
| Core plan is free; Plus is planned at $12 once. | 10 | Registered claims |
| Use current accounts and cash. | 5 | Pass |
| Subtract any card balance you must clear. | 7 | Pass |
| Do not include your upcoming pay. | 6 | Pass |
| This is a planning aid, not financial advice. | 8 | Pass |
| Your entries never leave this device. | 6 | Registered claim |
| Enter cash and payday. | 4 | Pass |
| Start with money you can spend now. | 7 | Pass |
| Add bills and protected money. | 5 | Pass |
| Mark what must stay outside daily spending. | 7 | Pass |
| Check today’s amount. | 3 | Pass |
| See the formula or test a purchase. | 7 | Pass |
| It does not connect to banks, predict income, or give financial advice. | 12 | Registered bank claim; clear limits |
| Your budget stays in this browser. | 6 | Registered claim |
| No analytics or advertising tools receive it. | 7 | Registered claim |
| The planned Today Money Plus price is US$12 once. | 9 | Registered claim |
| It adds password-protected backup and restore. | 6 | Registered claim |
| The daily plan and ordinary exports stay free. | 8 | Registered claim |
| Purchases are not open yet. | 5 | Covered by price test |
| See a daily amount after bills and protected money. | 9 | Pass |

### Landing headings, labels, actions, and fragments

| Text | Words | Result |
| --- | ---: | --- |
| Today Money | 2 | Product name |
| DAILY SPENDING PLAN | 3 | Clear descriptor |
| Demo | 1 | Clear navigation |
| Privacy | 1 | Clear navigation |
| Install app | 2 | Result-naming verb |
| DAILY AMOUNT AFTER BILLS AND PROTECTED MONEY | 7 | Consistent term |
| See what you can spend today | 6 | Clear H1 |
| Try it with sample data | 5 | Result-naming first action |
| STARTING MEASUREMENTS / 01 | 3 | Decorative coordinate |
| Enter your starting cash and payday | 6 | Clear heading |
| Spendable cash right now | 4 | Clear label |
| Next payday | 2 | Clear label |
| Currency | 1 | Clear label |
| Show my daily amount | 4 | Result-naming verb |
| WORKFLOW / 02 | 2 | Decorative coordinate |
| How the daily amount works | 5 | Clear heading |
| BOUNDARIES / 03 | 2 | Decorative coordinate |
| What Today Money does not do | 6 | Clear heading |
| OPTIONAL BACKUP / 04 | 3 | Decorative coordinate |
| Move an encrypted backup between devices | 6 | Clear heading |
| Terms | 1 | Clear navigation |
| Built by Param Factory | 4 | Attribution |
| Build 1.2.0-polish-2 | 2 | Build identifier |
| Original generated illustration | 3 | Provenance disclosure |

### README sentences and list items

| Sentence | Words | Result |
| --- | ---: | --- |
| Today Money is a daily spending planner for manual budgeters. | 10 | Registered claim |
| It works without a bank connection or account. | 8 | Registered claims |
| Enter cash, bills, and protected money. | 6 | Pass |
| See a daily amount until payday. | 6 | Registered claim |
| Check a purchase before you make it. | 7 | Registered claim |
| Try the isolated sample plan: `https://daily-safe-to-spend.sociobot.in/demo`. | 6 | Registered demo claim |
| Shows every number used in the daily amount. | 8 | Registered claim |
| Includes unpaid and overdue bills through payday. | 7 | Registered claim |
| Keeps paid bills outside the amount. | 6 | Registered claim |
| Checks a purchase without changing the plan. | 7 | Registered claim |
| Records balance changes in this browser. | 6 | Registered claim |
| Downloads a spreadsheet or backup file. | 6 | Registered claims |
| Imports a valid backup file. | 5 | Registered claim |
| Works offline after the first visit. | 6 | Registered claim |
| The core planner and ordinary exports are free. | 8 | Registered claim |
| The planned Plus price is US$12 once. | 7 | Registered claim |
| Plus adds password-protected backup and restore across devices. | 8 | Registered claim |
| Today Money does not connect to banks or give financial advice. | 10 | Registered bank claim; disclaimer |
| Budget data stays in this browser. | 6 | Registered claim |
| Use Node.js 20 or newer. | 5 | Maintainer directive |
| Open `http://localhost:5173`. | 2 | Maintainer directive |
| Open `http://localhost:5173/demo` for sample data. | 5 | Maintainer directive |
| The claim registry is `.factory/claims.json`. | 5 | Repository fact |
| Each claim names its browser test. | 6 | Repository fact |
| The production build is in `dist/`. | 6 | Build fact |
| Its root contains `index.html` and static-host configuration. | 7 | Build fact |
| The daily amount never goes below zero. | 7 | Registered claim |
| A shortfall shows the exact missing amount. | 7 | Registered claim |
| Payday is not a spending day. | 6 | Registered claim |
| An overdue unpaid bill stays included until you mark it paid. | 11 | Registered claim |
| The real plan uses the `today-money` browser database. | 8 | Registered storage claim |
| The demo uses `today-money-demo` and never reads the real plan. | 10 | Registered claims |
| Serve `dist/` as a static site over HTTPS. | 8 | Maintainer directive |
| The Param Factory manages deployment, DNS, and billing registration. | 9 | Operational statement |
| Read the live Privacy and Terms pages. | 7 | Maintainer directive |
| MIT licensed. | 2 | Verified by `LICENSE` |
| Original generated-asset provenance is recorded in `.factory/design.md`. | 7 | Repository fact |

### README headings

| Heading | Words | Result |
| --- | ---: | --- |
| Today Money | 2 | Product name |
| What it does | 3 | Clear in context |
| Run it | 2 | Clear maintainer heading |
| Test and build | 3 | Clear maintainer heading |
| Calculation | 1 | Clear maintainer heading |
| Data and deployment | 3 | Clear maintainer heading |

README commands and its calculation formula are not prose. Visitor copy
consistently uses **daily amount**, **protected money**, **manual budgeter**,
**plan**, **backup file**, and **spreadsheet**.

## Demo and sandbox

The one-click demo requirement passes. The landing action opens `/demo` and the
first 390 px screen immediately shows the working product, `$60.00` per day for
ten days, and the persistent “Demo — sample data, nothing is saved” banner.
The sample contains $1,240 cash, a $300 rent share, a $90 overdue electric
bill, a paid $50 phone bill, and $250 emergency savings. Evidence:
[demo](evidence/review-3-live-demo-mobile.png).

In a fresh live context, I created a real $333 plan, changed demo cash to $999,
reset it to $1,240, changed it again, and selected Start for real. The $333 real
plan remained intact. Re-entering demo restored $1,240. Code uses the separate
`today-money` and `today-money-demo` IndexedDB names. After service-worker
activation, `/demo` reloaded offline with the banner and `$60.00`; observed
traffic stayed on the product origin.

## Registered claim results

Every command in `.factory/claims.json` was run separately from fresh clone
`/tmp/today-money-review3.3u9OgL` at `93bff87`. Every listed tag occurs exactly
once in `tests/claims.spec.ts`.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `manual-plan` | PASS | Audience sentence and seeded demo |
| `daily-calculation` | PASS | $1,240 produces $60/day |
| `visible-assumptions` | PASS | Cash, bills, protected money, days, formula |
| `purchase-check` | PASS | $75 decision shown |
| `purchase-check-nondestructive` | PASS | Amount unchanged through reload |
| `bill-rules` | PASS | Due, paid, overdue states exercised |
| `history` | PASS | Both balance entries shown |
| `json-export` | PASS | Downloaded JSON contents validated |
| `csv-export` | PASS | Header and records validated |
| `json-import` | PASS | Imported plan survives reload |
| `local-plan-storage` | PASS | Real/demo database separation |
| `demo-sandbox` | PASS | Reset, exit, and re-entry exercised |
| `local-data` | PASS | Ordinary editable demo traffic intercepted |
| `no-bank-connection` | PASS | Full ordinary flow rejects bank traffic |
| `no-tracking` | PASS | Full ordinary flow rejects tracking traffic |
| `no-account` | PASS | Workflow completes without account UI |
| `no-third-party-request` | PASS | Normal flow remains same-origin |
| `offline-reload` | PASS | Seeded demo reloads offline |
| `installable-pwa` | PASS | Manifest and active worker validated |
| `price-one-time` | PASS | Planned price and closed purchase state |
| `core-free` | PASS | Unlicensed workflow and both downloads |
| `encrypted-backup` | PASS | Cross-context encrypted restore |
| `keyboard-flow` | PASS | Tab, Enter, Escape, and focus return |
| `shortfall-clamp` | PASS | Daily amount clamps at $0 |
| `exact-shortfall` | PASS | Exact $240 shortfall shown |
| `payday-and-overdue-rules` | PASS | One-day and overdue behavior |
| `route-accessibility` | PASS | Titles, route focus, Back, and 404 |

The clean clone also passed `npm test` (6/6), `npm run lint`, `npm run build`,
and `npm run test:e2e` (50/50). The build emits 40.48 KB JS (13.08 KB gzip)
and 19.87 KB CSS (5.15 KB gzip). F-3-1 and F-3-2 remain untested claims even
though every currently listed command passes.

## Earlier finding verification

Every earlier review finding was checked again against live behavior and the
current source/tests.

| Earlier ID | Review 3 result |
| --- | --- |
| F-1-1 | Fixed live/code: first screen names job, audience, demo action, and real result action. |
| F-1-2 | Fixed live/code: seeded demo, banner, reset, exit, and separate database work. |
| F-1-3 | Fixed for its original scope: registry now has 27 tagged claims and every command passes; new omissions are F-3-1/F-3-2. |
| F-1-4 | Fixed live/code: seeded demo reloads offline. |
| F-1-5 | Fixed live/code: visible sample arithmetic produces $60. |
| F-1-6 | Fixed live/code: every calculation input and formula is visible. |
| F-1-7 | Fixed for ordinary budget flow: request interception is registered; licensed privacy gap is F-3-2. |
| F-1-8 | Fixed live/code: real and demo plans use separate databases. |
| F-1-9 | Fixed live/code: no bank integration or request exists. |
| F-1-10 | Fixed live/code: no analytics or advertising traffic exists. |
| F-1-11 | Fixed: README workflow claims are short and registered. |
| F-1-12 | Fixed for the original account/tracking/storage claims. |
| F-1-13 | Fixed: downloaded JSON and CSV contents are tested. |
| F-1-14 | Fixed: assumptions and bill states are visible and tested. |
| F-1-15 | Fixed: purchase check leaves the plan unchanged through reload. |
| F-1-16 | Fixed: history, import, exports, installability, and offline reload pass. |
| F-1-17 | Fixed for price and encrypted create/restore; the distinct privacy boundary is F-3-2. |
| F-1-18 | Fixed: 390 px keyboard flow and dialog focus pass. |
| F-1-19 | Fixed: clamp, shortfall, payday, paid, and overdue rules pass. |
| F-1-20 | Fixed live/code: missing route is designed and returns HTTP 404. |
| F-1-21 | Fixed: no README sentence exceeds 22 words. |
| F-1-22 | Fixed: current headings name their task out of context. |
| F-1-23 | Fixed: “Show my daily amount” names the result. |
| F-1-24 | Fixed live/code: visitor copy uses protected money; no “savings pot” remains. |
| F-1-25 | Fixed: technical vocabulary is confined to maintainer/action context. |
| F-1-26 | Fixed live/code: `/demo` has its own title, canonical, and sitemap entry. |
| F-1-27 | Fixed live/code: route metadata, social image, favicon, and touch icon exist. |
| F-1-28 | Fixed live/code: navigation and Back/Forward focus and announce the H1. |
| F-1-29 | Fixed live/code: all routes share header, skip link, nav, and footer. |
| F-1-30 | Fixed live/code: workflow, limitations, and paid-tier sections exist. |
| F-1-31 | Fixed live: CSP, Permissions-Policy, manifest MIME, and immutable asset caching are present. |
| F-2-1 | Fixed live/code: first-screen price explicitly says “planned”. |
| F-2-2 | Fixed: `core-free` exercises an unlicensed plan and ordinary downloads. |
| F-2-3 | Fixed: encrypted restore crosses two fresh contexts and verifies records. |
| F-2-4 | Fixed: the current landing/README copy inventory is complete and correctly counted. |

The older verification defect for destructive invalid-date import remains
fixed in validation and browser regression coverage. The older response-header
and manifest MIME gaps remain fixed live.

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` return 200. A missing route returns
  404 with “This page does not exist” and a working home action.
- Each route has one H1, one main, `lang="en"`, a route-specific title and
  description, canonical URL, OG/Twitter image data, SVG favicon, 180 px touch
  icon, shared header/footer, and skip link. Sitemap and robots list the four
  real routes.
- Live Privacy navigation focuses and announces “Your money stays yours”. Back
  focuses “Your demo daily amount”; Forward refocuses Privacy.
- Every discovered internal link returned 200. The two `mailto:` links are
  intentional. There were no root/demo console or page errors.
- Live Axe scans found zero serious or critical issues on home, demo, Privacy,
  Terms, and 404 at 390 px. The 50-case suite also covers reduced motion, 200%
  text, keyboard dialogs, and focus return.
- The navy drafting grid, cream paper sheet, measured wallet illustration,
  condensed display type, monospaced working copy, and ruled layout are a
  distinct product identity rather than a generic SaaS template.

## Missed leverage

No AI feature is justified. The core job is deterministic arithmetic; bank
sync is an explicit non-goal. The brief-implied leverage already exists through
spreadsheet export, backup export/import, and encrypted cross-device transfer.
No provider key is embedded. The remaining gaps are verification and wording
for existing paid-feature paths, not a missing AI, import/export, or sync
feature.

## What would make this perfect

Register and exercise the visible license-restoration path, register the
file/password privacy boundary with whole-flow network interception, and remove
the current merchant-of-record sentence until checkout exists. Then repeat the
full live and clean-clone review. Nothing else observed in this round remains
to change.
