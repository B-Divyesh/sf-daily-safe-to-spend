# Today Money — adversarial first-read review 4

**Verdict: FAIL**

Reviewed 2026-08-28 against live `https://daily-safe-to-spend.sociobot.in` and a clean clone of commit `ebc5fbd`. Product code was not changed.

## Cold first screen

Fresh Chromium contexts at 390 × 844 and 1440 × 1000 loaded without console or page errors. Before scrolling, the answer was clear:

- **What it does:** calculates a daily amount after bills and protected money.
- **For whom:** manual budgeters who do not connect a bank.
- **First click:** “Try it with sample data”; it says it will open a `$1,240` plan with bills and protected money.

The 390 px first screen contains the H1, audience sentence, primary action, result preview, and three short facts. It passes the cold-read requirement.

## Findings

### Blocking

#### F-1-2 (reopened) — Demo mode writes a real license to storage

- **Location / exact quote:** live `/demo` banner, “Demo — sample data, nothing is saved”; the same screen contains “Have a license? Paste it here”. `src/main.ts:482-484` calls `storeLicense()` from this demo form. `src/license.ts:1-2,27-29,60` stores the value under the real, unprefixed `sb_license:daily-safe-to-spend` keys.
- **Reproduction:** in a fresh live 390 px context, intercepted the verification endpoint with a valid fixture, entered `review-isolation-license` on `/demo`, then chose “Start for real”. Before verification both real keys were `null`. Afterwards, and still after leaving demo, they were `sb_license:daily-safe-to-spend=review-isolation-license` and a verified verdict. This is not the `today-money-demo` IndexedDB namespace.
- **Why this blocks:** the one-click demo promises that nothing is saved, but a control exposed in the demo persists a real product entitlement and its credential. The previous F-1-2 required all demo state to be isolated and discarded. Its plan-data portion is fixed; this reachable state is not. The existing `@claim:demo-sandbox` test only covers budget IndexedDB (`tests/claims.spec.ts:116-139`), so it misses this path.
- **Concrete fix:** do not render real license verification in demo, or put all demo license/verdict values in a `demo:` namespace and clear them on Reset and Start for real. Use a canned sample Plus state in demo; do not send a visitor's license while trying sample data. Extend `@claim:demo-sandbox` to exercise the visible demo license/Plus path and assert that real license keys remain absent after Reset and Start for real, and that no non-sample request leaves demo.

## Copy audit

Words use the repository's stated whitespace rule: a hyphenated term, URL, price, or inline-code value counts as one word. Every landing and README sentence is listed below. No sentence exceeds 22 words. No banned marketing adjective or jargon appears in visitor copy. The one finding above concerns the truth of demo copy, not its reading level.

### Landing sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For manual budgeters who need a daily amount without connecting a bank. | 12 | Clear; audience claim registered. |
| See a $1,240 plan with bills and protected money. | 9 | Clear; demo result named. |
| Works offline after your first visit | 6 | Registered. |
| No bank connection or account | 5 | Registered. |
| Core plan is free; Plus is planned at $12 once | 10 | Registered. |
| Use current accounts and cash. | 5 | Clear. |
| Subtract any card balance you must clear. | 7 | Clear. |
| Do not include your upcoming pay. | 6 | Clear. |
| This is a planning aid, not financial advice. | 8 | Clear limitation. |
| Your entries never leave this device. | 6 | Registered. |
| Enter cash and payday. | 4 | Clear. |
| Start with money you can spend now. | 7 | Clear. |
| Add bills and protected money. | 5 | Clear. |
| Mark what must stay outside daily spending. | 7 | Clear. |
| Check today’s amount. | 3 | Clear. |
| See the formula or test a purchase. | 7 | Clear. |
| It does not connect to banks, predict income, or give financial advice. | 12 | Clear limitation. |
| Your budget stays in this browser. | 6 | Registered. |
| No analytics or advertising tools receive it. | 7 | Registered. |
| The planned Today Money Plus price is US$12 once. | 9 | Registered. |
| It adds password-protected backup and restore. | 6 | Registered. |
| The daily plan and ordinary exports stay free. | 8 | Registered. |
| Purchases are not open yet. | 5 | Matches unavailable state. |
| See a daily amount after bills and protected money. | 9 | Clear footer line. |

Landing headings, labels, and actions are also short and intelligible: “Daily amount after bills and protected money” (7), “See what you can spend today” (6), “Try it with sample data” (5), “Enter your starting cash and payday” (6), “Show my daily amount” (4), “How the daily amount works” (5), “What Today Money does not do” (6), and “Move an encrypted backup between devices” (6). The two visible buttons name results or actions; no generic Submit/Continue control is present. “Starting measurements / 01”, “Workflow / 02”, “Boundaries / 03”, and “Optional backup / 04” are decorative coordinates, with a plain heading immediately following each.

### README sentences and list items

| Sentence | Words | Result |
| --- | ---: | --- |
| Today Money is a daily spending planner for manual budgeters. | 10 | Registered. |
| It works without a bank connection or account. | 8 | Registered. |
| Enter cash, bills, and protected money. | 6 | Clear. |
| See a daily amount until payday. | 6 | Registered. |
| Check a purchase before you make it. | 7 | Registered. |
| Try the isolated sample plan: `https://daily-safe-to-spend.sociobot.in/demo`. | 6 | Demo claim registered. |
| Shows every number used in the daily amount. | 8 | Registered. |
| Includes unpaid and overdue bills through payday. | 7 | Registered. |
| Keeps paid bills outside the amount. | 6 | Registered. |
| Checks a purchase without changing the plan. | 7 | Registered. |
| Records balance changes in this browser. | 6 | Registered. |
| Downloads a spreadsheet or backup file. | 6 | Registered. |
| Imports a valid backup file. | 5 | Registered. |
| Works offline after the first visit. | 6 | Registered. |
| The core planner and ordinary exports are free. | 8 | Registered. |
| The planned Plus price is US$12 once. | 7 | Registered. |
| Plus adds password-protected backup and restore across devices. | 8 | Registered. |
| Today Money does not connect to banks or give financial advice. | 10 | Clear limitation. |
| Budget data stays in this browser. | 6 | Registered. |
| Use Node.js 20 or newer. | 5 | Maintainer directive. |
| Open `http://localhost:5173`. | 2 | Maintainer directive. |
| Open `http://localhost:5173/demo` for sample data. | 5 | Maintainer directive. |
| The claim registry is `.factory/claims.json`. | 5 | Repository fact. |
| Each claim names its browser test. | 6 | Repository fact. |
| The production build is in `dist/`. | 6 | Build fact. |
| Its root contains `index.html` and static-host configuration. | 7 | Build fact. |
| The daily amount never goes below zero. | 7 | Registered. |
| A shortfall shows the exact missing amount. | 7 | Registered. |
| Payday is not a spending day. | 6 | Registered. |
| An overdue unpaid bill stays included until you mark it paid. | 11 | Registered. |
| The real plan uses the `today-money` browser database. | 8 | Registered. |
| The demo uses `today-money-demo` and never reads the real plan. | 10 | Registered, but incomplete for license state: F-1-2. |
| Serve `dist/` as a static site over HTTPS. | 8 | Maintainer directive. |
| The Param Factory manages deployment, DNS, and billing registration. | 9 | Operational statement. |
| Read the live Privacy and Terms pages. | 7 | Maintainer directive. |
| MIT licensed. | 2 | License fact. |
| Original generated-asset provenance is recorded in `.factory/design.md`. | 7 | Repository fact. |

`protected money`, `daily amount`, `manual budgeter`, `plan`, `backup file`, and `spreadsheet` are used consistently. No copy rewrite is required beyond making the demo banner truthful by applying F-1-2's fix.

## Demo and sandbox

“Try it with sample data” is one click from the hero. `/demo` immediately shows a realistic `$1,240` plan, `$390` in due/overdue bills, `$250` protected money, a `$60.00` daily amount, purchase check, and the persistent demo banner. Reset restores the sample budget; real budget data remains separate. Offline reload, browser storage, export, and normal privacy flows passed their clean-clone tests. The license path described in F-1-2 means the complete demo does not meet the sandbox contract.

## Claims and verification

From clean clone `/tmp/today-money-review4.DetHqM`:

- `npm ci`, `npm test` (6/6), `npm run lint`, and `npm run build` passed.
- Every one of the 29 literal commands in `.factory/claims.json` passed when run separately: `manual-plan`, `daily-calculation`, `visible-assumptions`, `purchase-check`, `purchase-check-nondestructive`, `bill-rules`, `history`, `json-export`, `csv-export`, `json-import`, `local-plan-storage`, `demo-sandbox`, `local-data`, `no-bank-connection`, `no-tracking`, `no-account`, `no-third-party-request`, `offline-reload`, `installable-pwa`, `price-one-time`, `core-free`, `license-restore`, `encrypted-backup`, `encrypted-backup-local-privacy`, `keyboard-flow`, `shortfall-clamp`, `exact-shortfall`, `payday-and-overdue-rules`, and `route-accessibility`.
- `npm run test:e2e` passed 54/54 (mobile and desktop); its final Playwright status was `passed` with no failed tests.
- Live mobile Axe checks found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and a missing route.

All ordinary landing and README claim-like statements map to an entry in the registry. F-1-2 identifies a claim-test coverage gap rather than a failing registered command: `demo-sandbox` does not execute every state-changing control presented in demo.

## Earlier finding verification

| Earlier finding(s) | Confirmed current state |
| --- | --- |
| F-1-1 | Fixed: cold mobile and desktop screens name the job, audience, sample action, and result. |
| F-1-2 | **Reopened:** plan namespace is isolated, but demo license state persists to the real namespace. |
| F-1-3 | Fixed: registry has 29 entries and each command passed separately. |
| F-1-4 | Fixed: `offline-reload` passed from fresh demo data. |
| F-1-5 | Fixed: `daily-calculation` asserts the seeded `$60.00` result. |
| F-1-6 | Fixed: `visible-assumptions` exposes each formula input. |
| F-1-7 | Fixed: `local-data` intercepts the editable demo flow. |
| F-1-8 | Fixed: `local-plan-storage` proves real/demo plan separation. |
| F-1-9 | Fixed: `no-bank-connection` passed. |
| F-1-10 | Fixed: `no-tracking` passed. |
| F-1-11 | Fixed: audience, calculation, and purchase statements are registered. |
| F-1-12 | Fixed: account, tracking, third-party, and storage statements are registered. |
| F-1-13 | Fixed: JSON and CSV contents are tested after download. |
| F-1-14 | Fixed: visible inputs and due/paid/overdue bill rules are tested. |
| F-1-15 | Fixed: purchase checking survives reload without plan changes. |
| F-1-16 | Fixed: history, import, export, PWA, and offline claims have tests. |
| F-1-17 | Fixed: planned price and encrypted backup are tested. |
| F-1-18 | Fixed: mobile keyboard flow is tested. |
| F-1-19 | Fixed: clamp, exact shortfall, payday, and overdue boundaries are tested. |
| F-1-20 | Fixed: live unknown route returns HTTP 404 with the designed “This page does not exist” view. |
| F-1-21 | Fixed: this audit confirms no landing/README sentence exceeds 22 words. |
| F-1-22 | Fixed: headings name the task in plain words. |
| F-1-23 | Fixed: the real-data action is “Show my daily amount”. |
| F-1-24 | Fixed: visitor copy uses “protected money” consistently. |
| F-1-25 | Fixed: visitor copy uses plain storage/export terms. |
| F-1-26 | Fixed: demo has a distinct route, title, canonical, and sitemap entry. |
| F-1-27 | Fixed: each route exposes canonical/social data and product-owned icons. |
| F-1-28 | Fixed: the route test confirms route-heading focus on Back/Forward. |
| F-1-29 | Fixed: legal routes use the shared header and footer. |
| F-1-30 | Fixed: landing has a three-step workflow, limits/privacy, and planned-price section. |
| F-1-31 | Fixed: live manifest MIME and security/static routes behave correctly; headers and real 404 are present. |
| F-2-1 | Fixed: first-screen price says “planned” and purchase is unavailable. |
| F-2-2 | Fixed: `core-free` proves the free workflow and ordinary downloads. |
| F-2-3 | Fixed: `encrypted-backup` restores data in a fresh context. |
| F-2-4 | Fixed: repository audit inventories landing and README copy. |
| F-3-1 | Fixed: `license-restore` covers valid, invalid, failed, and cached states. |
| F-3-2 | Fixed: `encrypted-backup-local-privacy` covers license-only transmission. |
| F-3-3 | Fixed: merchant wording remains conditional while purchase is closed. |

## Structure, links, and visual identity

The home title is `Today Money — see what you can spend today`; demo, legal, and 404 routes have their prescribed route titles, one H1, descriptions, canonical URLs, Open Graph/Twitter data, SVG favicon, and touch icon. Back and forward focus the route H1 in the registered route test. The route crawl found 200 responses for product links and assets; `mailto:` links were explicit. The missing page itself correctly returns 404, including its internal skip anchor. The application uses a distinct blueprint/drafting-sheet system rather than a generic SaaS template, consistent with `.factory/design.md`.

No AI feature is expected by the brief: manual local calculation, exports, imports, and encrypted backup are the valuable implied functions and are present. No raw provider key or Azure runtime endpoint appears in product code.

## What would make this perfect

Make every reachable demo control as disposable as the sample budget. In particular, remove or sandbox the real license verifier, prove it with the expanded claim test, then re-run this review with a fresh browser context. Only then would the banner “nothing is saved” be accurate across the whole demo experience.
