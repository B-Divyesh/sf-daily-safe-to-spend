# Today Money — visual thesis

## Direction: the calm drafting sheet

Today Money should feel like a trustworthy working drawing, not a banking
dashboard. A deep navy blueprint field, measured grid, registration marks and
cream paper annotations make every number feel accounted for. The one answer
that matters — today's safe amount — is circled like the resolved dimension on
an architect's plan. Decoration is explanatory: it shows cash being measured
against bills and protected money.

The treatment is deliberately single-mode. Drafting blue is the product's
workspace and the cream "paper" areas are its reading surfaces. A second dark
theme would weaken the physical blueprint metaphor; the background is always
painted explicitly.

## Tokens

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Blueprint | `--blue-950` | `#071D35` | page background |
| Blueprint surface | `--blue-900` | `#0B2948` | grouped working areas |
| Blueprint line | `--blue-600` | `#2B6D99` | grid and rules |
| Chalk | `--paper` | `#F4EFD8` | primary text / paper panels |
| Ink | `--ink` | `#10263A` | text on paper |
| Note | `--yellow` | `#FFD166` | primary action and key answer |
| Safe | `--mint` | `#86D6B5` | amount remaining / confirmed fit |
| Warning | `--orange` | `#FFAB70` | approaching limits |
| Danger | `--red` | `#FF8B8B` | shortfall and destructive affordance |
| Muted | `--chalk-muted` | `#B8C9D7` | supporting text on blue |

Primary text combinations are checked at 4.5:1 or higher. Statuses always have
an icon or plain-language label in addition to color.

## Type and numbers

- Headings and large figures: **Arial Narrow**, `Roboto Condensed` fallback,
  then the local system sans stack. Condensed capitals evoke drawing labels
  without a downloaded font.
- Body and forms: **IBM Plex Mono** when locally installed, then `ui-monospace`,
  `SFMono-Regular`, `Consolas`, monospace. The monospaced rhythm makes dates
  and arithmetic easy to audit.
- Scale: 12 / 14 / 16 / 20 / 32 / fluid 56 px. Body is never below 16 px.
  Monetary figures use tabular numerals.

No web fonts are shipped: system families are faster, private, and keep the
initial asset budget focused on the application.

## Layout and spacing

An 8 px base unit with a 4 px half-step. The desktop workspace is a two-column
drawing table: the result and assumptions stay visually anchored while the
editable schedule occupies the wider column. At 760 px, everything becomes a
single reading sequence and secondary drafting ornaments disappear. Controls
are at least 44 px high with 8 px between neighboring targets. Text measures
stay below 72 characters.

Cards are used only for independent bill/envelope records. Major sections are
separated by whitespace, ruled headings, and blueprint coordinates rather
than nested generic cards.

## Interaction grammar

- Add actions "pin" a new row onto the plan with a short upward reveal.
- Editing happens in a modal drawing detail sheet and returns focus to origin.
- Destructive changes name the record and require confirmation.
- The daily figure updates immediately and flashes a brief chalk underline;
  its formula remains visible beside it.
- Offline, update, saved, error and license states appear as compact blueprint
  stamps with live-region announcements.

## Motion policy

Only transform and opacity animate, 160–240 ms with a restrained ease-out.
The answer underline draws once after a meaningful recalculation; records
enter from their logical row position. Nothing loops. Under
`prefers-reduced-motion: reduce`, transitions and animated underlines become
instant state changes while layer, scale and contrast preserve hierarchy.

## Original asset plan and provenance

### Hero: `drafting-wallet`

- Use case: stylized-concept, supporting illustration at the top/result panel.
- Subject: top-down architect's blueprint of a small open wallet whose cash is
  measured by a drafting compass; three simple bill markers sit safely behind
  a ruled boundary.
- World/materials: cyan technical pencil and white chalk on worn navy drafting
  paper, tiny pinholes, fold shadows, ruler ticks, hand-drawn construction
  circles.
- Light/lens: flat scanner-like top light, top-down orthographic composition.
- Palette words: midnight blueprint, cyan line, cream chalk, safety yellow,
  restrained mint.
- Negative list: no words, no numbers, no currency symbols, no logos, no
  brands, no hands or people, no photoreal banking UI, no gradients, no
  watermark, no illegible pseudo-text.
- Final prompt: "Use case: stylized-concept. Asset type: PWA hero supporting
  illustration. A top-down architect's blueprint drawing of a small open
  wallet, its available cash represented by clean blank slips measured with a
  drafting compass, with three simple obligation markers secured behind a
  ruled boundary. Cyan technical pencil and cream chalk on worn midnight navy
  drafting paper, faint construction circles, ruler ticks, pinholes and subtle
  fold shadows. Flat scanner-like top light, orthographic composition, generous
  breathing room, calm and precise. Palette of midnight blueprint, cyan lines,
  cream chalk, one restrained safety-yellow accent and subtle mint. No text,
  no numbers, no currency symbols, no logos, no brands, no people, no banking
  UI, no gradients, no watermark, no pseudo-text."
- Generator: Azure OpenAI factory image deployment via
  `/opt/fleet/lib/gen-image.sh`.
- License/provenance: generated originally for Today Money on 2026-08-27;
  project-owned output, no third-party source material.

Icons (ruler mark, wallet, bill, shield, check) are original inline SVG paths
authored for the interface. The PWA app icons are generated from the same
hand-made compass/coin mark and palette.

