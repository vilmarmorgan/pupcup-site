# pupcup-site

The live **playpupcup.com**. Static, deployed by GitHub Pages from `main` at
the repo root. The `CNAME` file is what binds the domain; do not remove it.

## What this repo is, and what it is not

This repo was forked out of `vilmarmorgan/Pupcup-home` in July 2026 and is the
one that kept going. Pupcup-home is **not** serving anything — its GitHub
Pages is off because the repo is private — but it still contains a `CNAME`
reading `playpupcup.com`, and an older 28-card PNG set. If you find yourself
reading Pupcup-home, you are in the wrong repo.

Verified 26 Oct 2026: Pages reports "Your site is live at
http://playpupcup.com/" for this repo, and every asset the live page loads
(`bone-lick.js`, `nav.js`, `og-image`, `apple-touch-icon`, `favicon.svg`,
`kickstarter/`) exists here and in neither case in Pupcup-home.

## Work in progress: the /about/ page

Joel is building `about/` ("What is Pupcup?") on the `about-page` branch.

- **Nothing outside `about/` changes in that work.** The site is live and
  Pages serves `main` from the repo root, so a merge is a publish.
- `about/CLAUDE.md` is the brief. It loads by itself once anything in that
  folder is touched; read it before building there.
- `main` requires a pull request and one approval. Branch, push, open a PR.
- The menu link for a new page is a one-line change to `nav.js` and is
  Vilmar's, separately, after the page is real.

## Where the records live

Code here; everything else in the vault at `~/vilmartian/vault`:

- `03-Projects/pupcup-site/` — this site's record, backlog and specs
- `03-Projects/pupcup/` — the game itself, and its decision log
- `03-Projects/pupcup-vip/` — the VIP customiser, a separate repo
- `06-Knowledge/gamecrafter-api-reference.md` — The Game Crafter API

Do not duplicate that material here. It was already harvested once out of
Pupcup-home's `notion-docs/`, and a second copy is how the two drift.

## Rules

`.claude/rules/` carries the conventions, moved here from Pupcup-home on
26 Oct 2026 because this repo had none:

- `design-system.md` — the CSS variables. Verified still accurate:
  `--card-w: 280px` and `--card-h: 381px` match `index.html` exactly.
- `tech-defaults.md` — one self-contained HTML file, no build step, no
  bundler, vanilla JS.
- `workflow.md` — branching and commits.

Those rules were written when the file was called `pupcup-home.html`. The
filename references have been repointed at `index.html`; nothing else in them
was changed.
