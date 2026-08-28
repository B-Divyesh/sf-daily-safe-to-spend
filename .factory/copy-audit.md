# Today Money copy audit

Audited 2026-08-28 from the rendered landing page and `README.md` after polish round 3.

Counting rule: whitespace-separated words count once. Hyphenated terms, prices, URLs, paths, and inline-code values each count as one word. Punctuation and decorative arrows do not count. The inventory includes directives, headings, labels, actions, prose, and sentence-like list items. No item exceeds 22 words or contains a banned marketing term.

## Rendered landing page: first screen

| Visible text | Words | Result |
| --- | ---: | --- |
| DAILY AMOUNT AFTER BILLS AND PROTECTED MONEY | 7 | Pass; terminology fixed |
| See what you can spend today | 6 | Pass |
| For manual budgeters who need a daily amount without connecting a bank. | 12 | Pass |
| Try it with sample data | 5 | Pass |
| See a $1,240 plan with bills and protected money. | 9 | Pass |
| Works offline after your first visit | 6 | Registered claim |
| No bank connection or account | 5 | Registered claims |
| Core plan is free; Plus is planned at $12 once | 10 | Registered claims |
| STARTING MEASUREMENTS / 01 | 3 | Pass |
| Enter your starting cash and payday | 6 | Pass |
| Use current accounts and cash. | 5 | Pass |
| Subtract any card balance you must clear. | 7 | Pass |
| Spendable cash right now | 4 | Pass |
| Do not include your upcoming pay. | 6 | Pass |
| Next payday | 2 | Pass |
| Currency | 1 | Pass |
| Show my daily amount | 4 | Pass |
| This is a planning aid, not financial advice. | 8 | Pass |
| Your entries never leave this device. | 6 | Registered claim |

## Rendered landing page: supporting sections and footer

| Visible text | Words | Result |
| --- | ---: | --- |
| WORKFLOW / 02 | 2 | Pass |
| How the daily amount works | 5 | Pass |
| Enter cash and payday. | 4 | Pass |
| Start with money you can spend now. | 7 | Pass |
| Add bills and protected money. | 5 | Pass |
| Mark what must stay outside daily spending. | 7 | Pass |
| Check today’s amount. | 3 | Pass |
| See the formula or test a purchase. | 7 | Pass |
| BOUNDARIES / 03 | 2 | Pass |
| What Today Money does not do | 6 | Pass |
| It does not connect to banks, predict income, or give financial advice. | 12 | Registered bank claim; clear limits |
| Your budget stays in this browser. | 6 | Registered claim |
| No analytics or advertising tools receive it. | 7 | Registered claim |
| OPTIONAL BACKUP / 04 | 3 | Pass |
| Move an encrypted backup between devices | 6 | Registered claim |
| The planned Today Money Plus price is US$12 once. | 9 | Registered claim |
| It adds password-protected backup and restore. | 6 | Registered claim |
| The daily plan and ordinary exports stay free. | 8 | Registered claim |
| Purchases are not open yet. | 5 | Price claim evidence |
| See a daily amount after bills and protected money. | 9 | Pass |
| Built by Param Factory | 4 | Attribution |
| Original generated illustration | 3 | Provenance disclosure |

Short brand, navigation, and footer labels are also inventoried: “Today Money” (2), “DAILY SPENDING PLAN” (3), “Demo” (1), “Privacy” (1), “Terms” (1), “Install app” (2), and “Build 1.3.0-polish-3” (2). All pass.

## README sentences and list items

| Text | Words | Result |
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
| MIT licensed. | 2 | License fact |
| Original generated-asset provenance is recorded in `.factory/design.md`. | 7 | Repository fact |

README headings contain 1–4 words and the code commands contain 2–4 tokens. The calculation expression is a formula, not prose; its terms match the terminology table.

## Terminology

| Concept | Use everywhere | Allowed concrete examples | Do not use as the concept name |
| --- | --- | --- | --- |
| Result | daily amount | amount per day | spending line, allowance |
| Reserved funds | protected money | emergency savings | protected pot, savings pot, envelope |
| Intended person | manual budgeter | — | user persona, finance optimizer |
| Stored data | plan | — | workspace, account |
| Portable file | backup file | encrypted backup | JSON in visitor introductions |
| Table download | spreadsheet file | — | CSV in visitor introductions |

Repository search confirms “savings pot” no longer appears in product or README copy. `Envelope` remains an internal TypeScript model name only.
