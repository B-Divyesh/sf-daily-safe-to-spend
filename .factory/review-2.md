# Today Money — adversarial first-read review 2

**Verdict: FAIL**

Reviewed 2026-08-28 against the live site at
<https://daily-safe-to-spend.sociobot.in> and repository commit
`6f03787b9bc728f0cf1135671659399f3b48ca0c`.

The product is clear and genuinely tryable now. The live demo, offline path,
privacy boundary, routes, metadata, and registered claim tests work. It still
cannot pass a zero-finding review: an earlier terminology finding is only
partly fixed, the first screen states a future paid tier as if it is available,
and the claim registry does not cover the free-core or restore promises.

## Cold first screen

Fresh Chromium contexts were used at 390×844 and 1440×1000. Before scrolling:

- **What it does:** calculates what can be spent today after bills and
  protected money.
- **For whom:** manual budgeters who do not connect a bank.
- **First click:** **Try it with sample data**.

The answer comes directly from “See what you can spend today”, “For manual
budgeters who need a daily amount without connecting a bank”, and “Try it with
sample data”. This part passes at both sizes. There is no horizontal overflow
and no cold-load console or page error. Evidence: [mobile home](evidence/review-2-live-home-mobile.png)
and [desktop home](evidence/review-2-live-home-desktop.png).

## Findings

### Blocking

#### F-1-24 — Protected-money terminology is still inconsistent

- **Exact quote / location:** live landing eyebrow, “DAILY AMOUNT AFTER BILLS
  AND SAVINGS”; empty protected-money state in `src/main.ts`, “Add an emergency
  buffer or savings pot you do not want counted as spendable.” Elsewhere the
  concept is “protected money”.
- **Why this blocks:** review 1 required one visitor term and polish 1 claimed
  that visitor copy had been standardized. A first-time visitor still has to
  decide whether “savings”, a “savings pot”, and “protected money” are the same
  input. The earlier finding is half-fixed, so it remains blocking under its
  original ID.
- **Concrete fix:** change the eyebrow to “DAILY AMOUNT AFTER BILLS AND
  PROTECTED MONEY”. Rewrite the empty state as “Add emergency savings or other
  money you do not want counted as spendable.” Keep “protected money” as the
  control and section term.

### Minor

#### F-2-1 — The first screen presents the unavailable Plus price as current

- **Exact quote / location:** first-screen fact, “Core plan is free; Plus costs
  $12 once.” Lower on the same landing page: “The planned Today Money Plus
  price is US$12 once” and “Purchases are not open yet.”
- **Why:** in a 30-second phone read, the first statement says the tier exists
  at a current price. The correction is below the fold. This is inconsistent
  and less honest than the registered claim, which carefully says “planned”.
- **Concrete fix:** use “Core plan is free; Plus is planned at $12 once” in the
  first-screen fact and assert that exact wording in `@claim:price-one-time`.

#### F-2-2 — “The core planner is free” is an unlisted claim

- **Exact quote / location:** landing, “Core plan is free” and “The daily plan
  and ordinary exports stay free”; README, “The core planner is free.”
- **Why:** `.factory/claims.json` registers the planned Plus price, but it does
  not register the free-core promise. The price test does not exercise an
  unlicensed visitor completing the core workflow and both ordinary exports
  without a paywall or billing request.
- **Concrete fix:** add a `core-free` claim and tagged demo test that creates or
  edits a plan, checks a purchase, downloads both ordinary files, and confirms
  no license, paywall, or billing request occurs.

#### F-2-3 — Backup restore and cross-device portability are unlisted claims

- **Exact quote / location:** landing heading, “Move an encrypted backup
  between devices”; landing and README, “Plus adds password-protected backup
  and restore.”
- **Why:** `encrypted-backup` promises only local backup creation. Its tagged
  claim test downloads an encrypted payload but never restores it or moves it
  to a fresh browser context. An untagged general test restores in the same
  context, which does not register or prove the stronger live wording.
- **Concrete fix:** expand the registered claim to backup and restore. Extend
  its tagged test to create the encrypted file in one clean context, import it
  with the password in a second clean context, and assert the restored balance,
  bills, and protected money.

#### F-2-4 — The repository copy audit is incomplete and miscounts words

- **Exact quote / location:** `.factory/copy-audit.md` says the audience
  sentence has 11 words; it has 12. It says “Use Node.js 20 or newer” has 6;
  it has 5. It says the overdue-bill sentence has 10; it has 11. The audit also
  omits README sentences such as “Try the isolated sample plan”, both “Open”
  instructions, and “Read the live Privacy and Terms pages.”
- **Why:** polish 1 cites this file as proof of complete copy review. The stated
  inventory is not complete, so it cannot support a zero-finding handoff.
- **Concrete fix:** regenerate the audit from rendered landing text and README,
  document the counting rule, and include directives as well as prose.

## Copy audit

Counts treat a visible URL, price, or hyphenated expression as one word. The
tables include every landing/README sentence or sentence-like list item.

### Live landing sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For manual budgeters who need a daily amount without connecting a bank. | 12 | Pass |
| See a $1,240 plan with bills and protected money. | 9 | Pass |
| Works offline after your first visit. | 6 | Registered claim |
| No bank connection or account. | 5 | Registered claims |
| Core plan is free; Plus costs $12 once. | 8 | F-2-1, F-2-2 |
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
| It does not connect to banks, predict income, or give financial advice. | 12 | Bank claim registered; limits are clear |
| Your budget stays in this browser. | 6 | Registered claim |
| No analytics or advertising tools receive it. | 7 | Registered claim |
| The planned Today Money Plus price is US$12 once. | 9 | Registered claim |
| It adds password-protected backup and restore. | 6 | F-2-3 |
| The daily plan and ordinary exports stay free. | 8 | F-2-2 |
| Purchases are not open yet. | 5 | Exercised by price claim test |
| See a daily amount after bills and protected money. | 9 | Pass |

No landing sentence exceeds 22 words or contains a banned marketing adjective.

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
| The core planner is free. | 5 | F-2-2 |
| The planned Plus price is US$12 once. | 7 | Registered claim |
| Plus adds password-protected backup and restore. | 6 | F-2-3 |
| Today Money does not connect to banks or give financial advice. | 10 | Bank claim registered; disclaimer is clear |
| Budget data stays in this browser. | 6 | Registered claim |
| Use Node.js 20 or newer. | 5 | Clear maintainer instruction |
| Open `http://localhost:5173`. | 2 | Clear maintainer instruction |
| Open `http://localhost:5173/demo` for sample data. | 5 | Clear maintainer instruction |
| The claim registry is [.factory/claims.json]. | 5 | Verified repository reference |
| Each claim names its browser test. | 6 | Verified repository reference |
| The production build is in `dist/`. | 6 | Verified by build |
| Its root contains `index.html` and static-host configuration. | 7 | Verified by build |
| The daily amount never goes below zero. | 7 | Registered claim |
| A shortfall shows the exact missing amount. | 7 | Registered claim |
| Payday is not a spending day. | 6 | Registered claim |
| An overdue unpaid bill stays included until you mark it paid. | 11 | Registered claim |
| The real plan uses the `today-money` browser database. | 8 | Registered claim |
| The demo uses `today-money-demo` and never reads the real plan. | 10 | Registered claims |
| Serve `dist/` as a static site over HTTPS. | 8 | Clear maintainer instruction |
| The Param Factory manages deployment, DNS, and billing registration. | 9 | Operational statement |
| Read the live Privacy and Terms pages. | 7 | Clear maintainer instruction |
| MIT licensed. | 2 | Verified by `LICENSE` |
| Original generated-asset provenance is recorded in `.factory/design.md`. | 7 | Verified repository reference |

No README sentence exceeds 22 words or contains a banned marketing adjective.
The technical terms are confined to maintainer sections. No visitor-facing
heading is meaningless out of context. Landing actions pass the result-verb
check: “Install app”, “Try it with sample data”, and “Show my daily amount”.
The one terminology failure is F-1-24.

## Demo and sandbox

The one-click path passes. `/demo` immediately shows a realistic $1,240 plan,
three bills (including paid and overdue examples), $250 protected money, and a
$60 daily amount. The persistent banner contains “Demo — sample data, nothing
is saved”, **Reset demo**, and **Start for real**. Evidence: [mobile demo](evidence/review-2-live-demo-mobile.png).

In a fresh live context I created a real $333 plan, changed demo cash to $999,
reset it to $1,240, changed it again, and selected Start for real. The real
$333 plan remained intact. Re-entering demo restored $1,240. IndexedDB exposed
separate `today-money` and `today-money-demo` databases. After service-worker
activation, the demo reloaded offline with the banner and $60 result. The
editable demo flow made no cross-origin request.

## Claim results

All commands from `.factory/claims.json` were run separately from a clean local
clone of `6f03787`. All 26 passed:

| Claim IDs | Result |
| --- | --- |
| `manual-plan`, `daily-calculation`, `visible-assumptions` | PASS |
| `purchase-check`, `purchase-check-nondestructive`, `bill-rules` | PASS |
| `history`, `json-export`, `csv-export`, `json-import` | PASS |
| `local-plan-storage`, `demo-sandbox`, `local-data` | PASS |
| `no-bank-connection`, `no-tracking`, `no-account`, `no-third-party-request` | PASS |
| `offline-reload`, `installable-pwa` | PASS |
| `price-one-time`, `encrypted-backup` | PASS for the narrower registered claims; see F-2-1–F-2-3 |
| `keyboard-flow`, `shortfall-clamp`, `exact-shortfall` | PASS |
| `payday-and-overdue-rules`, `route-accessibility` | PASS |

The clean clone also passed `npm test` (6/6), `npm run lint`, and `npm run
build`. `npm run test:e2e` completed 46 configured cases across both viewports;
one Chromium process crashed before a mobile history case and Playwright's
configured retry passed it. Each individually required claim command passed.
Built JS is 40,374 bytes (12,959 gzip), below the static budget.

The live app shell, hashed JS/CSS, service worker, manifest, offline page,
legal route shells, and 404 are SHA-256 identical to the clean build.

## Earlier finding verification

Each review-1 finding was checked against both live behavior and current code.

| Earlier ID | Result in review 2 |
| --- | --- |
| F-1-1 | Confirmed fixed: first screen names the job, audience, sample action, and real action. |
| F-1-2 | Confirmed fixed: seeded `/demo`, banner, reset, exit, and separate databases work live. |
| F-1-3 | Confirmed fixed: 26 registered claims have tagged tests; every listed command passed. |
| F-1-4 | Confirmed fixed: live seeded demo reloads offline. |
| F-1-5 | Confirmed fixed: $1,240 minus $390 and $250 over 10 days yields $60. |
| F-1-6 | Confirmed fixed: the working exposes cash, bills, protected money, and days. |
| F-1-7 | Confirmed fixed: no budget request left the origin during the demo flow. |
| F-1-8 | Confirmed fixed: real and demo plans persisted in separate databases. |
| F-1-9 | Confirmed fixed: no bank request or connection appears in code or live traffic. |
| F-1-10 | Confirmed fixed: no analytics/advertising request appears in code or live traffic. |
| F-1-11 | Confirmed fixed: README core-workflow sentences are short and registered. |
| F-1-12 | Confirmed fixed: privacy/account/service assertions are split and registered. |
| F-1-13 | Confirmed fixed: spreadsheet and backup downloads contain the sample records. |
| F-1-14 | Confirmed fixed: assumptions and bill rules are visible and tested. |
| F-1-15 | Confirmed fixed: a purchase check does not change the plan or reloaded amount. |
| F-1-16 | Confirmed fixed: history, import, exports, installability, and offline reload pass. |
| F-1-17 | Confirmed for the original price/encrypted-creation scope; new restore overclaim is F-2-3. |
| F-1-18 | Confirmed fixed: 390px keyboard flow, dialog focus, Escape, and return focus pass. |
| F-1-19 | Confirmed fixed: zero clamp, exact $240 shortfall, payday, paid, and overdue rules pass. |
| F-1-20 | Confirmed fixed: unknown route returns HTTP 404 with the designed page and home action. |
| F-1-21 | Confirmed fixed: no current README sentence exceeds 22 words. |
| F-1-22 | Confirmed fixed: current task headings make sense independently. |
| F-1-23 | Confirmed fixed: real-data action is “Show my daily amount”. |
| F-1-24 | **BLOCKING: half-fixed; “savings” and “savings pot” remain.** |
| F-1-25 | Confirmed fixed for README visitor copy; file-format jargon is in maintainer/actions context. |
| F-1-26 | Confirmed fixed: `/demo` has its own title, canonical, and sitemap entry. |
| F-1-27 | Confirmed fixed: every checked route has canonical/OG/Twitter data and product icons. |
| F-1-28 | Confirmed fixed live: Privacy and Back focus and announce the destination H1. |
| F-1-29 | Confirmed fixed: all checked routes share header, skip link, nav, and full footer. |
| F-1-30 | Confirmed fixed: workflow, boundaries/privacy, and exact paid-tier sections exist. |
| F-1-31 | Confirmed fixed live: CSP, Permissions-Policy, manifest MIME, and immutable asset caching are present. |

The older verification P1 for destructive invalid-date import remains fixed in
code and regression tests. Its deployment-header P2 is fixed live. The older
Lighthouse-environment P3 has later recorded live performance evidence and is
not a product defect.

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` return 200; the tested missing route
  returns 404. Every route has one H1, one main, shared header/footer, route
  title, description, canonical, OG image, SVG favicon, and touch icon.
- Live in-app Privacy navigation moved focus to “Your money stays yours” and
  announced the route. Browser Back restored and focused “Your demo daily
  amount”.
- All discovered internal links returned 200; the missing-route recovery link
  returned home; the two `mailto:` links are intentional.
- Automated Axe checks found no serious or critical issue on home, demo,
  privacy, terms, or 404 at 390 px. Reduced motion and 200% text are covered by
  the passing browser suite.
- The drafting-sheet palette, measured grid, technical illustration, condensed
  headings, and ruled layout are recognizably product-specific rather than a
  generic SaaS template.

## Missed leverage

No additional AI feature is justified. The job is deterministic arithmetic,
and bank sync is an explicit non-goal. The obvious local-first leverage already
exists: spreadsheet/backup export, backup import, and optional encrypted
transfer. The remaining gap is proof of the advertised encrypted restore, not
a need for decorative AI or another integration.

## What would make this perfect

Use “protected money” consistently, state the unavailable paid tier as planned
on the first screen, and bind the free-core and encrypted restore promises to
tagged claim tests. Regenerate the complete copy audit after those changes.
Then repeat this full live and clean-clone review; only a zero-finding result
should pass.
