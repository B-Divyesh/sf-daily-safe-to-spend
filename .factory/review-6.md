# Today Money — adversarial first-read review 6

**Verdict: PASS**

Reviewed 2026-08-28 against the live site and clean clone
70d662ae52edb9dbc833bbe310d3ff388f701c10. This was a full re-review. There
are zero blocking or minor findings.

## Cold read

Fresh Chromium contexts at 390×844 and 1440×1000, before scrolling, had no
console or page errors.

- **Does:** calculates a daily amount after bills and protected money.
- **For:** “For manual budgeters who need a daily amount without connecting a bank.”
- **First click:** “Try it with sample data”; it says “See a $1,240 plan with bills and protected money.”

The first mobile screen also shows “Works offline after your first visit”, “No
bank connection or account”, and “Core plan is free; Plus is planned at $12
once”. The job, person, and safe action are clear at both sizes.

## Copy audit

Counts are whitespace-separated visible words; a URL, price, and hyphenated
term count as one. No sentence exceeds 22 words. No banned marketing term,
unexplained visitor-facing jargon, inconsistent core term, unclear heading, or
non-result-naming action was found. Claim-like text maps to claims.json.

### Landing sentences

| Text | Words | Status |
| --- | ---: | --- |
| For manual budgeters who need a daily amount without connecting a bank. | 12 | manual-plan |
| See a $1,240 plan with bills and protected money. | 9 | clear demo result |
| Works offline after your first visit. | 6 | offline-reload |
| No bank connection or account. | 5 | no-bank-connection, no-account |
| Core plan is free; Plus is planned at $12 once. | 10 | core-free, price-one-time |
| Use current accounts and cash. | 5 | clear instruction |
| Subtract any card balance you must clear. | 7 | clear instruction |
| Do not include your upcoming pay. | 6 | clear instruction |
| This is a planning aid, not financial advice. | 8 | limitation |
| Your entries never leave this device. | 6 | local-data |
| Enter cash and payday. | 4 | clear step |
| Start with money you can spend now. | 7 | clear step |
| Add bills and protected money. | 5 | clear step |
| Mark what must stay outside daily spending. | 7 | clear step |
| Check today’s amount. | 3 | clear step |
| See the formula or test a purchase. | 7 | registered |
| It does not connect to banks, predict income, or give financial advice. | 12 | boundary |
| Your budget stays in this browser. | 6 | local-plan-storage |
| No analytics or advertising tools receive it. | 7 | no-tracking |
| The planned Today Money Plus price is US$12 once. | 9 | price-one-time |
| It adds password-protected backup and restore. | 6 | encrypted-backup |
| The daily plan and ordinary exports stay free. | 8 | core-free |
| Purchases are not open yet. | 5 | price-one-time |
| See a daily amount after bills and protected money. | 9 | clear footer line |

The headings “Daily amount after bills and protected money”, “See what you can
spend today”, “Enter your starting cash and payday”, “How the daily amount
works”, “What Today Money does not do”, and “Move an encrypted backup between
devices” are clear out of context. “Try it with sample data”, “Show my daily
amount”, and “Install app” name their results.

### README sentences and list items

| Text | Words | Status |
| --- | ---: | --- |
| Today Money is a daily spending planner for manual budgeters. | 10 | manual-plan |
| It works without a bank connection or account. | 8 | registered |
| Enter cash, bills, and protected money. | 6 | clear instruction |
| See a daily amount until payday. | 6 | daily-calculation |
| Check a purchase before you make it. | 7 | purchase-check |
| Try the isolated sample plan: URL. | 6 | clear demo entry |
| Shows every number used in the daily amount. | 8 | visible-assumptions |
| Includes unpaid and overdue bills through payday. | 7 | bill-rules |
| Keeps paid bills outside the amount. | 6 | bill-rules |
| Checks a purchase without changing the plan. | 7 | purchase-check-nondestructive |
| Records balance changes in this browser. | 6 | history |
| Downloads a spreadsheet or backup file. | 6 | registered |
| Imports a valid backup file. | 5 | json-import |
| Works offline after the first visit. | 6 | offline-reload |
| The core planner and ordinary exports are free. | 8 | core-free |
| The planned Plus price is US$12 once. | 7 | price-one-time |
| Plus adds password-protected backup and restore across devices. | 8 | encrypted-backup |
| Today Money does not connect to banks or give financial advice. | 10 | boundary |
| Budget data stays in this browser. | 6 | local-plan-storage |
| Use Node.js 20 or newer. | 5 | maintainer instruction |
| Open localhost. | 2 | maintainer instruction |
| Open localhost/demo for sample data. | 5 | maintainer instruction |
| The claim registry is .factory/claims.json. | 5 | repository fact |
| Each claim names its browser test. | 6 | repository fact |
| The production build is in dist/. | 6 | repository fact |
| Its root contains index.html and static-host configuration. | 7 | repository fact |
| The daily amount never goes below zero. | 7 | shortfall-clamp |
| A shortfall shows the exact missing amount. | 7 | exact-shortfall |
| Payday is not a spending day. | 6 | registered |
| An overdue unpaid bill stays included until you mark it paid. | 11 | registered |
| The real plan uses the today-money browser database. | 8 | storage documentation |
| The demo uses today-money-demo and never reads the real plan or license. | 12 | registered |
| Serve dist/ as a static site over HTTPS. | 8 | maintainer instruction |
| The Param Factory manages deployment, DNS, and billing registration. | 9 | operational fact |
| Read the live Privacy and Terms pages. | 7 | maintainer instruction |
| MIT licensed. | 2 | license fact |
| Original generated-asset provenance is recorded in .factory/design.md. | 7 | repository fact |

“URL”, “localhost”, and “localhost/demo” represent their literal one-token
values. The detailed repository inventory agrees in .factory/copy-audit.md.

## Demo, privacy, and offline sandbox

The first click opens /demo directly into $1,240.00 cash, three bills
(including paid and overdue examples), $250.00 protected money, and $60.00 per
day. The persistent banner says “Demo — sample data, nothing is saved” and has
**Reset demo** and **Start for real**.

In a fresh live context, changing sample cash to $999 changed the amount to
$35.90; accepting Reset demo restored $60.00. The context contained only
today-money-demo. Demo requests were only to the product origin. A cold,
untouched /demo received a service-worker controller and, after going offline,
reloaded HTTP 200 with the banner and $60.00, without console error. Code
confirms demo and real IndexedDB namespaces are distinct and demo Plus is
in-memory; it rejects license storage and verification.

## Claims and tests

From a fresh clone, npm ci, npm test (6/6), npm run lint, and npm run build
passed. Application JS is 13.26 KB gzip. Every literal registry command passed
separately (29/29): manual-plan, daily-calculation, visible-assumptions,
purchase-check, purchase-check-nondestructive, bill-rules, history, json-export,
csv-export, json-import, local-plan-storage, demo-sandbox, local-data,
no-bank-connection, no-tracking, no-account, no-third-party-request,
offline-reload, installable-pwa, price-one-time, core-free, license-restore,
encrypted-backup, encrypted-backup-local-privacy, keyboard-flow,
shortfall-clamp, exact-shortfall, payday-and-overdue-rules, and
route-accessibility.

npm run test:e2e passed 54/54. Re-reading live landing and README found no
unlisted claim-like sentence; the financial-advice language is a limitation.

## Structure, accessibility, and links

Live /, /demo, /privacy, /terms, and a missing path have route-specific titles,
one H1, one main, description, canonical, Open Graph/Twitter metadata, favicon,
and touch icon. The missing route returns HTTP 404 with “This page does not
exist”. Every real internal destination in the route crawl returned 200; the
two contact links are explicit mailto links. Privacy navigation and browser
Back focus and announce the new H1.

At 390px, Axe reported zero serious or critical violations on all five routes.
The drafting-sheet palette, measured rules, paper panels, and wallet/compass
illustration match .factory/design.md and are distinct from a generic SaaS
template.

## Earlier finding verification

Every review, polish record, and prior handoff was read. Live behavior and code
confirm each prior finding is fixed:

| Earlier ID | Current confirmation |
| --- | --- |
| F-1-1 | Job, audience, sample action, preview, and real action are above the fold. |
| F-1-2 | Seeded, bannered, resettable demo uses separate storage and sample-only Plus. |
| F-1-3 | 29 observable registered claim commands exist and pass. |
| F-1-4 | Cold no-input demo reload works offline. |
| F-1-5 | Visible $1,240 − $390 − $250 over 10 days equals $60. |
| F-1-6 | Formula inputs and working are visible. |
| F-1-7 | Demo budget flow is same-origin and local. |
| F-1-8 | Real and demo plans use distinct databases. |
| F-1-9 | No bank connection/request exists. |
| F-1-10 | No analytics or advertising request exists. |
| F-1-11 | README workflow copy is plain and registered. |
| F-1-12 | Account, tracking, third-party, and storage claims are registered. |
| F-1-13 | Backup/spreadsheet export and import are observable. |
| F-1-14 | Assumptions and bill rules are shown and tested. |
| F-1-15 | Purchase checks are non-destructive. |
| F-1-16 | History, import/export, PWA, and offline behavior have coverage. |
| F-1-17 | Planned price and encrypted backup/restore are covered. |
| F-1-18 | 390px keyboard and dialog flow pass. |
| F-1-19 | Clamp, shortfall, payday, and overdue rules pass. |
| F-1-20 | Styled missing route is a real 404. |
| F-1-21 | README has no sentence over 22 words. |
| F-1-22 | Headings name the task plainly. |
| F-1-23 | “Show my daily amount” names the result. |
| F-1-24 | Visitor copy uses “protected money” consistently. |
| F-1-25 | Visitor copy is plain; technical detail is maintainer-facing. |
| F-1-26 | Demo has route, title, canonical, and sitemap entry. |
| F-1-27 | Metadata, icons, and preview are present. |
| F-1-28 | Navigation and Back focus/announce H1s. |
| F-1-29 | Legal routes share header, skip link, footer, and legal links. |
| F-1-30 | Workflow, boundaries, and honest planned tier are present. |
| F-1-31 | Security/static headers, MIME, caching, and 404 configuration are live. |
| F-2-1 | First-screen price is explicitly planned. |
| F-2-2 | Free planning/downloads work without billing. |
| F-2-3 | Encrypted restore works in a fresh context. |
| F-2-4 | The copy audit is complete with a stated count rule. |
| F-3-1 | Real-plan license restoration has valid, invalid, failure, and cached cases. |
| F-3-2 | License-only traffic and local password/file handling are tested. |
| F-3-3 | Merchant language is conditional while purchase is unavailable. |
| F-1-2 (review 4 reopen) | Demo neither reads, writes, nor verifies a real license. |
| F-5-1 | Immediate worker registration proves the first-visit offline wording. |

## Missed leverage

No further feature is implied by the brief. Visible assumptions, purchase check,
import/export, encrypted backup, and offline use are present. Bank sync is
explicitly excluded. AI would add cost and a privacy boundary to deterministic
arithmetic; no decorative AI or embedded provider key was found.

## What would make this perfect

Keep the cold-demo, no-input offline, storage-isolation, and literal
claim-command checks in the release process. No product change is required.

