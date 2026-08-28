# Today Money — review 5 handoff

Work order: `daily-safe-to-spend-review-5`

## Outcome

Review only; no product code was changed. The result is **FAIL** because the
landing and README say offline use works after the first visit, while a fresh
no-interaction visit has no registered service worker and cannot reload offline.
See `F-5-1` in [review-5.md](review-5.md).

## Verification

- Fresh clone: `npm ci`, `npm test` (6/6), `npm run lint`, `npm run build`, and
  every one of the 29 literal claim commands from `.factory/claims.json`
  passed.
- Live cold 390px and desktop checks confirmed the first-read path, demo
  sample, reset, real/demo isolation, same-origin demo flow, metadata,
  headers, routes, links, 404, focus restoration, and zero serious/critical
  Axe findings.
- The interacted-with offline path passed. The no-interaction live path failed:
  no registration/controller after first load, then
  `net::ERR_INTERNET_DISCONNECTED` on reload.

## Next step

Register the service worker on first load and add a claim test that reloads a
fresh `/demo` offline without pointer or keyboard interaction. Re-run the full
review after deployment.
