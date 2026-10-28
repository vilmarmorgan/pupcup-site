# Design System — Pupcup site

## Status: In Progress

## CSS Variables (defined in `:root`)
- `--card-w: 280px` (mobile: 156px)
- `--card-h: 381px` (mobile: 212px)
- `--gap: 60px` (mobile: 10px)
- `--bg: #1e2028` — page background (dark grey with blue tint)
- `--surface: #1a1a1e` — dark surface
- `--accent: #f5c542` — gold/yellow accent (buttons, highlights, class labels)
- `--text: #f0ece4` — light text on dark
- `--text-muted: #9a9a9e` — secondary text

## Typography
- Primary font: `Jost` (weights: 400, 500, 600, 700), loaded from Google Fonts
- Fallback: `system-ui, sans-serif`

  Corrected 28 Oct 2026. This said `Space Grotesk`, which no page on the site
  uses: `index.html`, `howtoplay/index.html` and `kickstarter/index.html` all
  load `family=Jost` and set `font-family: 'Jost'`. The line came over from
  Pupcup-home with the rest of these files and was never rechecked. Anyone
  following it would have built a page in the wrong typeface.

## Key Sizes
- Card border-radius: 12px (grid), 14px (overlay)
- Overlay card max-width: 494px
- Close button: 66px circle (mobile: 54px)
- Boop button: pill shape, border-radius 999px

## Overlay Panel Colors
- Left panel: `rgba(26, 26, 30, 0.95)` (95% opacity dark)
- Right panel: `#141417` (solid dark)

## Badge Colors
- Steal: `#e74c3c` (red)
- Block: `#3498db` (blue)
- Rule: `#9b59b6` (purple)
- Photo: `#2ecc71` (green)
- Video: `#e67e22` (orange)

## Mobile Breakpoint
- `@media (max-width: 600px)` — smaller cards, stacked overlay panels

## Design Rules
- [TODO: brand guidelines not yet formalized]
- [TODO: favicon not yet created]
- [TODO: OG image not yet created]
