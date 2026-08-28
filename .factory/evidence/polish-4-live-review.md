# Polish 4 live cold review

Verified 2026-08-28 at <https://daily-safe-to-spend.sociobot.in> after Static
Web Apps deployment `79cb4cae-9371-4009-b915-71c56fa12b7d` of repair commit
`6c25b5be4243e5fb75cdd4fb9822f3e286412b39`.

A fresh 390 px Chromium context opened
`/?demo=1&license=must-not-store-live`. The URL was reduced to `/?demo=1`.
The demo banner and `SAMPLE PLUS MODE` appeared; there was no license form;
both real `sb_license:daily-safe-to-spend` keys were `null`. Reset demo and
Start for real kept both keys `null`; no request left the product origin.

The same cold sweep confirmed:

- `/`, `/demo`, `/privacy`, and `/terms` return 200 with correct titles, one
  H1, one main landmark, image alt text, and no browser errors. Their
  `verify-url.sh` reports are in the `polish-4-live-*` evidence directories.
- Demo → Privacy moved focus to `Your money stays yours` and set
  `Privacy — Today Money`.
- `/this-page-is-missing` returned 404 and rendered `This page does not exist`.
- Playwright Axe found zero serious or critical violations on home, demo,
  Privacy, Terms, and the 404 page.
- Live home, manifest, and 404 headers include CSP, Permissions-Policy,
  Referrer-Policy, nosniff, and the manifest response is
  `application/manifest+json`.
