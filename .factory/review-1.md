# Today Money — adversarial first-read review 1

**Verdict: FAIL**

Reviewed 2026-08-28 against live https://daily-safe-to-spend.sociobot.in and repository commit 8a3b2d5845ff07c73c45483de9e977169f6dc050.

The calculation interface has a distinct blueprint/drafting visual identity, but the first visit is not safely tryable. The required demo, claim registry, and designed 404 do not exist. Therefore this cannot pass.

## Cold read

Fresh Chromium contexts at 390×844 and 1440×1000 showed the same first screen. I could infer that it calculates money available per day after bills. I could not identify the audience: it never says this is for manual budgeters who do not want bank sync. I could not safely identify the first action: the only action asks for personal cash and payday.

The failing text is “Set aside every bill and protected pot first. Today Money divides only what is truly left until payday.” It explains an operation, not who needs it. The only real-data button is “Make my plan”, which does not name the result.

## Findings

### Blocking

#### F-1-1 — The first screen does not name the audience or a safe first action

- **Location / quote:** live /, “Set aside every bill and protected pot first. Today Money divides only what is truly left until payday.”; button “Make my plan”.
- **Why:** a cold visitor cannot tell that the product is for manual budgeters without bank sync, and must enter personal data before seeing the result.
- **Fix:** under the H1 add: “For manual budgeters who need a daily amount without connecting a bank.” Add the first primary action “Try it with sample data” with “See a $1,240 plan with bills and protected savings.” Rename the real-data action “Show my daily amount”.

#### F-1-2 — Required demo sandbox is absent; /demo reads real data

- **Location / evidence:** / has no “Try it with sample data” action. Fresh /demo renders the normal onboarding form. After creating a real $123 plan at /, visiting /demo rendered “YOUR SPENDING LINE” and $12.30. There was no “Demo — sample data, nothing is saved” banner, “Reset demo”, or “Start for real”.
- **Why:** the product is not one-click tryable. The nominal demo URL reads real storage, so it is not an isolated sandbox and cannot demonstrate offline or privacy safely.
- **Fix:** implement /demo and ?demo=1 with realistic cash, three bills, protected savings, and a visible purchase check. Use a separate demo: IndexedDB namespace. Show the required banner, Reset demo, and Start for real. Add .factory/demo.md and tests proving reset, disposal, namespace isolation, and seeded-demo offline reload.

#### F-1-3 — The required claims registry and tagged claim tests are absent

- **Location / evidence:** .factory/claims.json does not exist; repository search found no @claim: tag. There were therefore no listed claim commands to run from a clean clone.
- **Why:** none of the visitor promises is bound to an observable demo test.
- **Fix:** add claims.json and one @claim:<id> test per claim below, all starting from /demo. Delete any promise that cannot be proven there.

#### F-1-4 — Unlisted claim: offline operation

- **Quote / location:** landing fact, “Works offline”.
- **Why:** no claims entry or demo-mode network-offline test exists.
- **Fix:** add offline-reload and reload seeded /demo after context.setOffline(true).

#### F-1-5 — Unlisted claim: core calculation

- **Quote / location:** landing lede, “Set aside every bill and protected pot first. Today Money divides only what is truly left until payday.”
- **Why:** the primary visitor result is not in claims.json.
- **Fix:** add daily-calculation; assert the demo amount from visible cash, bills, protected money, and days.

#### F-1-6 — Unlisted claim: visible assumptions

- **Quote / location:** landing fact, “Every assumption stays visible”.
- **Why:** there is no test specifying which assumptions remain visible.
- **Fix:** remove it or add visible-assumptions asserting cash, bills, protected money, days, and formula in demo.

#### F-1-7 — Unlisted privacy claim

- **Quote / location:** landing fine print, “Your entries never leave this device.”
- **Why:** no whole-demo request interception proves it.
- **Fix:** add local-data; intercept create/edit/export requests and assert no budget data leaves the browser.

#### F-1-8 — Unlisted local-storage claim

- **Quote / location:** landing footer, “Your plan stays in this browser.”
- **Why:** no claim proves persistence and demo/real separation.
- **Fix:** add local-plan-storage; prove a real reload and that demo cannot read real data.

#### F-1-9 — Unlisted integration claim

- **Quote / location:** landing footer, “No bank connection.”
- **Why:** no registry entry or full-flow network assertion supports it.
- **Fix:** add no-bank-connection; assert only same-origin, documented requests through demo.

#### F-1-10 — Unlisted tracking claim

- **Quote / location:** landing footer, “No tracking.”
- **Why:** no whole-demo request assertion supports it.
- **Fix:** add no-tracking and assert no analytics, advertising, or tracking requests.

#### F-1-11 — Unlisted core-workflow claims in README

- **Quote / location:** README opening, “Today Money is a deliberately small, offline safe-to-spend planner for people who budget manually.” and “Enter the cash available now, the bills due before the next payday, and money that must stay protected; the app shows a conservative daily amount and lets you test a purchase against that plan.”
- **Why:** audience, calculation, and purchase-check promises are unregistered.
- **Fix:** add manual-plan, daily-calculation, and purchase-check tests from seeded demo.

#### F-1-12 — Unlisted privacy / architecture claim in README

- **Quote / location:** README, “There are no accounts, analytics, third-party scripts, or cloud storage.”
- **Why:** four externally meaningful promises have no tests.
- **Fix:** register separate no-account, no-tracking, no-third-party-request, and local-storage tests, or remove the sentence.

#### F-1-13 — Unlisted export / storage claim

- **Quote / location:** README, “Budget data lives in IndexedDB on the current device and can be exported as JSON or CSV.”
- **Why:** persistence and downloadable formats are unregistered.
- **Fix:** add local-plan-storage, json-export, and csv-export tests that validate observable file contents.

#### F-1-14 — Unlisted bill-rule and transparency claims

- **Quote / location:** README features, “Transparent safe-to-spend calculation with every input visible” and “Bills due before payday, paid state, overdue handling, and protected pots”.
- **Why:** these promises lack tests.
- **Fix:** add visible-assumptions and bill-rules tests covering due, paid, and overdue bills in demo.

#### F-1-15 — Unlisted non-destructive purchase claim

- **Quote / location:** README feature, “Non-destructive ‘Can I buy this?’ purchase check”.
- **Why:** no test proves checking a purchase leaves the plan unchanged.
- **Fix:** add purchase-check-nondestructive and compare the demo plan before and after a check.

#### F-1-16 — Unlisted PWA, history, import, and export claims

- **Quote / location:** README features, “Balance history plus JSON/CSV ownership exports and imports” and “Installable PWA with a precached app shell and tested offline reload”.
- **Why:** each is an observable promise without a registry test.
- **Fix:** add history, json-import, json-export, csv-export, installable-pwa, and offline-reload entries and tests from demo.

#### F-1-17 — Unlisted price / encryption claim

- **Quote / location:** README feature, “Optional US$12 one-time Plus license for client-side encrypted backups”.
- **Why:** price, billing model, encryption boundary, and backup outcome are unregistered.
- **Fix:** remove it until available, or add price/checkout and encrypted-backup tests using an isolated licensed demo fixture.

#### F-1-18 — Unlisted accessibility claim

- **Quote / location:** README feature, “Mobile-first keyboard-accessible interface, privacy and terms pages”.
- **Why:** this is a promise without a tagged test.
- **Fix:** add keyboard-flow, proving Tab, Enter, Escape, and focus return at 390px from demo.

#### F-1-19 — Unlisted calculation-boundary claims

- **Quote / location:** README Calculation: “The result never displays as a negative allowance.” “When obligations exceed cash, the app reports the exact shortfall.” “Payday itself is excluded as a spending day, and an overdue unpaid bill stays included until marked paid.”
- **Why:** these are concrete rules without claim entries.
- **Fix:** add shortfall-clamp, exact-shortfall, and payday-and-overdue-rules tests using demo fixtures.

#### F-1-20 — Unknown URL silently renders onboarding instead of a designed 404

- **Location / evidence:** live /this-route-does-not-exist returns HTTP 200 and the ordinary onboarding H1 “WHAT CAN YOU SAFELY SPEND TODAY?”.
- **Why:** a bad link is presented as a fresh budget form. This is broken routing.
- **Fix:** ship a styled 404 with “This page does not exist” and a home link; apply navigation fallback only to recognised routes.

### Non-blocking (still prevents PASS)

#### F-1-21 — README sentence exceeds the 22-word hard cap

- **Quote / location:** README opening (34 words), “Enter the cash available now, the bills due before the next payday, and money that must stay protected; the app shows a conservative daily amount and lets you test a purchase against that plan.”
- **Why:** it combines multiple steps and outcomes.
- **Fix:** “Enter cash, bills, and protected money. See a daily amount until payday. Check a purchase before you make it.”

#### F-1-22 — Landing headings are generic or metaphorical

- **Quote / location:** “A SMALL PLAN FOR ONE BIG QUESTION” and “Draw your spending line”.
- **Why:** neither names the task plainly in a heading list; “draw” conflicts with a form.
- **Fix:** use “Daily amount after bills and savings” and “Enter your starting cash and payday”.

#### F-1-23 — The real-data button does not name its result

- **Quote / location:** “Make my plan”.
- **Why:** it does not tell a visitor it reveals a daily amount.
- **Fix:** “Show my daily amount”.

#### F-1-24 — Protected-money terminology is inconsistent

- **Quote / location:** landing “protected pot”; README “money that must stay protected” and “protected pots”; product UI “protected money”; code model “envelopes”.
- **Why:** the visitor must infer whether these are the same category.
- **Fix:** use “protected money” everywhere in user copy; keep envelope internal only.

#### F-1-25 — README mixes visitor copy with unexplained technical jargon

- **Quote / location:** “IndexedDB”, “JSON or CSV”, “Installable PWA with a precached app shell”, “client-side encrypted backups”, and “axe accessibility scan”.
- **Why:** a product introduction switches to implementation language without definitions.
- **Fix:** say “stored in this browser”, “downloadable spreadsheet or backup file”, and “works without a connection after first use”; move tool names to a maintainer section.

#### F-1-26 — /demo has the wrong title and is missing from sitemap

- **Location / evidence:** live /demo title is “Today Money — your safe-to-spend plan”, not “Demo — Today Money”; sitemap lists only /, /privacy/, and /terms/.
- **Why:** the demo is neither addressable as its own product place nor discoverable.
- **Fix:** implement the route, use title “Demo — Today Money”, set its canonical URL, and list it in sitemap.xml.

#### F-1-27 — Required canonical, social metadata, and favicon variants are absent

- **Location / evidence:** index.html has no canonical link, Open Graph fields, Twitter-card fields, SVG favicon, or 180px apple-touch icon. It points apple touch to the 192px PNG. Legal pages also lack canonical/social metadata.
- **Why:** routes lack canonical identities and shared links have no product-owned preview.
- **Fix:** add per-route canonical, OG, and Twitter metadata and a 1200×630 blueprint-art preview; provide SVG favicon and 180px apple-touch icon.

#### F-1-28 — Route changes do not focus or announce the new headline

- **Location / evidence:** after clicking Privacy, document.activeElement was body; Privacy H1 has no tabindex and no live-region announcement. Browser Back restored the cash input rather than a route heading.
- **Why:** screen-reader and keyboard visitors receive no reliable page-change cue.
- **Fix:** add tabindex=-1 to route H1s, focus it on navigation, and update an aria-live=polite route announcement; test Back and Forward.

#### F-1-29 — Header/footer are not consistent on legal routes

- **Location / evidence:** / has skip link and wordmark; /privacy/ and /terms/ only have “← Today Money”. Legal footers omit the product one-liner, both legal links, “Built by Param Factory”, and build/version id.
- **Why:** legal routes appear to be another site and lose expected navigation.
- **Fix:** share header, skip link, nav, and footer across every route.

#### F-1-30 — Landing lacks required workflow, limitation, and paid-tier sections

- **Location / evidence:** landing ends after setup and footer. It has no three-step “How it works”, clear “What it does not do”, or Plus section with the README’s US$12 price and unlock.
- **Why:** visitors cannot assess the workflow or paid feature before entering data.
- **Fix:** add a three-step walkthrough from the demo, a plain limitations/privacy section, and an exact Plus price/unlock section.

#### F-1-31 — Earlier deployment hardening finding remains open

- **Location / evidence:** verification-2 recorded missing CSP, Permissions-Policy, immutable caching, and manifest MIME. Fresh live headers still serve manifest.webmanifest as application/octet-stream. No staticwebapp.config.json exists.
- **Why:** this historical P2 has not actually been resolved.
- **Fix:** add static-host configuration for matching CSP, Permissions-Policy, content types, and cache policy; recheck live headers.

## Copy audit

Word counts treat a hyphenated word and visible number as one word. This covers every prose sentence on the cold landing and README. Labels, headings, buttons, feature fragments, and code follow separately.

### Live landing prose

| Text | Words | Audit |
| --- | ---: | --- |
| Set aside every bill and protected pot first. | 8 | Claim F-1-5; term F-1-24 |
| Today Money divides only what is truly left until payday. | 10 | Claim F-1-5 |
| Use money you can actually spend: current accounts and cash, minus any card balance you must clear. | 17 | Clear; remove “actually” |
| Do not include your upcoming pay. | 6 | Clear |
| This is a planning aid, not financial advice. | 8 | Clear disclaimer |
| Your entries never leave this device. | 6 | Claim F-1-7 |
| Your plan stays in this browser. | 7 | Claim F-1-8 |
| No bank connection. | 3 | Claim F-1-9 |
| No tracking. | 2 | Claim F-1-10 |

### README prose

| Text | Words | Audit |
| --- | ---: | --- |
| Today Money is a deliberately small, offline safe-to-spend planner for people who budget manually. | 14 | Claim F-1-11; “deliberately small” marketing |
| Enter the cash available now, the bills due before the next payday, and money that must stay protected; the app shows a conservative daily amount and lets you test a purchase against that plan. | 34 | Over 22: F-1-21; claim F-1-11 |
| It is not a bank-connected budget suite or financial advice. | 10 | Clear limitation |
| There are no accounts, analytics, third-party scripts, or cloud storage. | 9 | Claim F-1-12 |
| Budget data lives in IndexedDB on the current device and can be exported as JSON or CSV. | 16 | Claim F-1-13; jargon F-1-25 |
| Requires Node.js 20 or newer. | 5 | Maintainer instruction |
| The development server does not register the service worker, avoiding stale assets while editing. | 12 | Implementation claim/jargon |
| npm run build is the deploy command. | 5 | Maintainer instruction |
| It type-checks, creates the Vite bundle, and injects built assets into the service worker precache. | 15 | Tool jargon |
| Static output lands in dist/, with dist/index.html at its root. | 10 | Maintainer instruction |
| The Playwright suite uses Chromium and covers the complete calculation flow, an axe accessibility scan, persistence, and offline reload. | 16 | Tool jargon |
| Install the pinned browser if the environment does not already provide it. | 12 | Maintainer instruction |
| The result never displays as a negative allowance. | 8 | Claim F-1-19 |
| When obligations exceed cash, the app reports the exact shortfall. | 10 | Claim F-1-19 |
| Payday itself is excluded as a spending day, and an overdue unpaid bill stays included until marked paid. | 16 | Claim F-1-19 |
| Serve dist/ as a static site over HTTPS. | 8 | Maintainer instruction |
| Configure clean directory routes so /privacy/ and /terms/ resolve to their included index.html files. | 13 | Maintainer instruction |
| Do not edit DNS, billing, or infrastructure from this repository; the Param Factory handles deployment and registers the Sociobot product slug. | 20 | Maintainer instruction; two ideas |
| MIT licensed. | 2 | Clear |
| Generated-asset provenance is recorded in .factory/design.md and assets/src/drafting-wallet.prompt.json. | 7 | Maintainer instruction |

### Labels, headings, buttons, and feature fragments

| Text | Words | Audit |
| --- | ---: | --- |
| A small plan for one big question | 7 | Generic heading: F-1-22 |
| What can you safely spend today? | 6 | Clear H1 |
| Works offline | 2 | Claim F-1-4 |
| No bank login | 3 | Align with “No bank connection” |
| Every assumption stays visible | 4 | Claim F-1-6 |
| Starting measurements / 01 | 2 | Decorative, not useful heading |
| Draw your spending line | 4 | Metaphorical heading: F-1-22 |
| Make my plan | 3 | Result unnamed: F-1-23 |
| Transparent safe-to-spend calculation with every input visible | 7 | Claim F-1-14 |
| Bills due before payday, paid state, overdue handling, and protected pots | 10 | Claim F-1-14 |
| Non-destructive “Can I buy this?” purchase check | 6 | Claim F-1-15; jargon |
| Balance history plus JSON/CSV ownership exports and imports | 8 | Claim F-1-16; jargon |
| Installable PWA with a precached app shell and tested offline reload | 10 | Claim F-1-16; jargon |
| Optional US$12 one-time Plus license for client-side encrypted backups | 9 | Claim F-1-17; jargon |
| Mobile-first keyboard-accessible interface, privacy and terms pages | 7 | Claim F-1-18; jargon |

Use one vocabulary: **daily amount** (not spending line / allowance / safe-to-spend plan), **protected money** (not protected pot / envelopes), and **manual budgeter**.

## Checks run

- Live fresh-context Chromium at 390×844 and 1440×1000: zero console/page errors; visual identity is distinct, not generic SaaS.
- Demo probe: /demo plus real-plan-to-/demo storage isolation check; failed as F-1-2.
- Route crawl: /, /demo, /privacy/, /terms/, robots, sitemap, and manifest returned 200; mailto links were valid. Unknown route fails as F-1-20. /favicon.ico is 404 but not linked.
- Metadata: title, lang, one H1, main, and landing description exist. Gaps are F-1-26 through F-1-31.
- npm ci completed with 0 vulnerabilities. npm test passed 6/6. npm run build passed. npm run test:e2e completed the configured 14 browser cases across mobile and desktop. These generic tests are not claim tests.
- History: no earlier review-* or polish-* files exist. The prior verification P1 invalid-calendar import finding is fixed live: invalid JSON showed “That file is not a valid Today Money plan.”, opened no confirmation, and a $50 plan survived reload. The old header/manifest P2 remains open as F-1-31.

## What would make this perfect

Put a realistic, isolated sample plan at the first click; show exactly how cash, bills, and protected money produce the daily amount. Prove every remaining promise through that demo, simplify to stable terms, then finish 404, metadata, route skeleton, and hosting hardening before repeating this full cold review.

