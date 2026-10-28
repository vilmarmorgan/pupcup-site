# Workflow — Pupcup site

## This repo is the live site

`playpupcup.com` is served by GitHub Pages from `main` at the repo root, and
the `CNAME` file is what binds the domain. **Anything that lands on `main` is
public immediately.** There is no staging branch and no build step between a
merge and the live site.

That is the single most important thing on this page. An earlier version of
this file said "`main` only for now" and, under Deploy, "hosting not yet
decided" — both written before the fork settled, both wrong by 26 Oct 2026,
and together they read as an instruction to commit straight to the live site.

## Branching

- **Never commit to `main` directly.** Branch, push the branch, open a pull
  request, and let Vilmar merge it.
- One branch per piece of work, named for the work: `what-is-pupcup`,
  `fix-mobile-nav`.
- A pull request is how a change gets looked at before the world sees it. It
  is not ceremony here; it is the only gate there is.

## Adding a new page

A new page lives in its own folder with its own `index.html`:

    /what-is-pupcup/index.html   ->   playpupcup.com/what-is-pupcup/

Adding a folder cannot affect any existing page. The existing pages are
`index.html` (the cards), `howtoplay/`, `instructions/` and `kickstarter/`;
none of them is touched by a new directory appearing beside them.

**The one exception, and it matters:** `nav.js` at the repo root is the single
source of truth for the site menu. Linking a new page into the menu means
editing that shared file, which every page loads. Build the page first; the
menu line is a separate, reviewed change.

Asset paths are root-relative (`/favicon.svg`, `/nav.js`), so they work from
any folder depth. Copy the `<head>` of `howtoplay/index.html` as the starting
point rather than inventing one — it carries the icons, the Jost font link and
the Open Graph tags.

## Commits

- Freeform commit messages
- NEVER commit secrets, credentials, or .env files

## Definition of Done

- Changes tested in browser (desktop + mobile viewport)
- No console errors
- Images load correctly across all three tiers
- Overlay opens/closes cleanly
- Boop animations fire correctly
- Links to and from the new page resolve, including from a sub-path

## Adding New Cards

1. Export card art to all three tiers:
   - `cards/<class>/card-XX.png` (826x1125 full-res)
   - `cards-hd/<class>/card-XX.jpg` (826x1125 JPEG q85)
   - `cards-web/<class>/card-XX.jpg` (413x563 JPEG)
2. Add entry to `CARD_DATA` in `index.html`
3. If new class: add subfolder in each tier + key in `CARD_DATA` + entry in `CLASS_LABELS`

## Related Projects

- **pupcup-vip** (github.com/vilmarmorgan/pupcup-vip) — VIP portal at vip.playpupcup.com (separate repo)
- **TGC-API-REFERENCE.md** — The Game Crafter API reference kept in this repo for context
