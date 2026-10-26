# Workflow — Pupcup site

## Branching
- `main` only for now

## Commits
- Freeform commit messages
- NEVER commit secrets, credentials, or .env files

## Deploy
- [TODO: hosting not yet decided]

## Definition of Done
- Changes tested in browser (desktop + mobile viewport)
- No console errors
- Images load correctly across all three tiers
- Overlay opens/closes cleanly
- Boop animations fire correctly

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
