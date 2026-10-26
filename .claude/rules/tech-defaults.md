# Tech Defaults — Pupcup site

## Stack
- Single self-contained HTML file (`index.html`) with all CSS and JS inline
- No build step, no bundler, no package manager
- Vanilla JS, no frameworks or libraries
- Font: Space Grotesk (loaded via Google Fonts `<link>`)

## Architecture

### Infinite Canvas
- Virtual cell recycling with `translate3d` positioning
- Drag/touch panning with velocity tracking and momentum physics
- `Map`-based DOM pool keyed by `"col,row"`

### Card Deduplication
- Modular coloring: `color = pmod(row, 5) * 8 + pmod(col, 8)` -> 0..39
- 40 color slots; all 37 items (28 cards + 6 photos + 3 videos) fit with room to grow
- Duplicates are >=8 columns and >=5 rows apart
- Combined pool (cards + media) shuffled per page load, indexed by color
- Mathematically guaranteed zero duplicates within any 5x8 neighborhood

### Grid Media Sampling
- All playing cards are always shown — every dog guaranteed visible
- Each page load randomly samples 6 photos and 3 videos from the class's full set
- Keeps grid fresh across visits while ensuring card owners always find their dogs

### Image Tiers
Each tier organized by class subfolder (e.g. `cards-web/founding/`, `cards-web/2026/`):
- `cards/<class>/` — Full-res PNGs (826x1125) for print. NEVER served to browsers.
- `cards-hd/<class>/` — 2x JPEGs (826x1125, quality 85) for overlay display.
- `cards-web/<class>/` — 1x JPEGs (413x563) for grid thumbnails.

Numbering is independent per class. Classes grow by adding images to the subfolder and a corresponding entry to `CARD_DATA`.

### Overlay
- Full-screen two-panel layout (50/50 split)
- Left panel: HD card image, dog name, class label, owner, boop button (95% opacity background)
- Right panel: rule-related media scroll OR marketing wireframes (steal/block cards)
- HD images loaded on demand (not preloaded)
- Super boop animation can overflow from left panel onto right panel

### Boop System
- localStorage persistence with daily limit tracking
- `DAILY_BOOP_LIMIT` currently set to `Infinity` (no limit active)
- Three randomized CSS animations (Paw Burst, Bone Rain, Tail Wag Ripple)
- Super Boop easter egg: 10 rapid clicks within 2.5s triggers 200% grander animation

### Card Classes
- "Founding Class" — original 28 dogs from the first print run
- "Class of 2026" — placeholder for custom dogs
- Future classes follow the same pattern: subfolder in each image tier + key in `CARD_DATA`

### Entrance Animation
- Staggered fade-in over 1-3 seconds with randomized sequence per refresh

## Data Structures
- `CARD_DATA` — object keyed by class name, each containing card/photo/video items
- `RULE_MEDIA` — per-rule tagged media for cross-referencing photos/videos to rule cards
- `CLASS_LABELS` — maps class keys to display names
- Each card item: `type, dogName, ownerName, cardType (rule/steal/block), image, imageHD`

## Protected Files — NEVER modify without explicit permission
- `index.html`
- `TGC-API-REFERENCE.md`
- Everything in `notion-docs/`
- Everything in `cards/`, `cards-hd/`, `cards-web/`
