# Polish 5 clean-clone claim evidence

Repository state: `b96bb21` (`fix: serve precached shell on initial offline reload`).

Created a separate clone at `/tmp/today-money-polish-5.er3jCW`, then ran:

```sh
npm ci
npm run build
```

The build completed with 13.26 KB gzipped application JavaScript. A script read
each `test` value from `.factory/claims.json` and ran it literally, one command
at a time. All 29 commands exited zero:

`manual-plan`, `daily-calculation`, `visible-assumptions`, `purchase-check`,
`purchase-check-nondestructive`, `bill-rules`, `history`, `json-export`,
`csv-export`, `json-import`, `local-plan-storage`, `demo-sandbox`,
`local-data`, `no-bank-connection`, `no-tracking`, `no-account`,
`no-third-party-request`, `offline-reload`, `installable-pwa`,
`price-one-time`, `core-free`, `license-restore`, `encrypted-backup`,
`encrypted-backup-local-privacy`, `keyboard-flow`, `shortfall-clamp`,
`exact-shortfall`, `payday-and-overdue-rules`, and `route-accessibility`.

The final clean-clone Playwright status was `passed` with no failed tests.
