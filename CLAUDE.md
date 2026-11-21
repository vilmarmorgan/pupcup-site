# pupcup-site

> **This file is published at playpupcup.com/CLAUDE.md.** GitHub Pages serves
> `main` from the repo root, so every tracked file here is downloadable at the
> domain. Confirmed live on 20 Nov 2026, and again on 21 Nov by reading it
> back from the domain.
>
> So nothing goes in this file that you would not print on the site itself.
> Keep out: other repo names, domain bindings, local paths, what gates
> `main`, the names of vault records, and - this one is easy to miss -
> **the names of people**. A collaborator's name, what they are working on
> and which branch they are on is not infrastructure, and it was published
> here for a month before anybody noticed. Refer to roles, never to people.
> The audit that set this rule is in the vault; it is deliberately not named
> here, because naming a document whose subject is where the weak points are
> is itself a thing worth not publishing.

The live **playpupcup.com**. Static, deployed by GitHub Pages from `main` at
the repo root. The `CNAME` file is what binds the domain; do not remove it.

## What this repo is, and what it is not

This repo was forked out of an older one in July 2026 and is the one that kept
going. If you find yourself reading a repo with a 28-card PNG set and no
`bone-lick.js`, you are in the wrong one.

The history behind that split, and the domain binding it left behind, is in
the vault record for this site. It is deliberately not written here: this file
is published at the domain, so anything in it is public.

## Work in progress: the /about/ page

`about/` ("What is Pupcup?") is being built on its own branch.

- **Nothing outside `about/` changes in that work.** The site is live and
  Pages serves `main` from the repo root, so a merge is a publish.
- `about/CLAUDE.md` is the brief. It loads by itself once anything in that
  folder is touched; read it before building there.
- Branch, push, open a PR. The protection rules are in the repo settings.
- The menu link for a new page is a one-line change to `nav.js`, and is the
  owner's to make separately, once the page is real.

## Where the records live

Code here; everything else in the vault, under this site's own record. The
vault index lists the related records - the game, the customiser, the Game
Crafter reference. Do not duplicate that material here. It was already
harvested once out of the old repo's docs, and a second copy is how the two
drift.

## Rules

`.claude/rules/` carries the conventions, moved here from the older repo on
26 Oct 2026 because this repo had none:

- `design-system.md` — the CSS variables. Verified still accurate:
  `--card-w: 280px` and `--card-h: 381px` match `index.html` exactly.
- `tech-defaults.md` — one self-contained HTML file, no build step, no
  bundler, vanilla JS.
- `workflow.md` — branching and commits.

Those rules were written when the file was called `pupcup-home.html`. The
filename references have been repointed at `index.html`; nothing else in them
was changed.

## When you ask the owner to check this live

**Name the version to expect, and where it shows on screen.** Every push,
every "reload and look at it". Without it there is no way to tell a stale
browser from a real bug, and that has cost a whole round trip more than once.
The rule is in the HQ AGENTS.md and applies to every app, not only
the ones that happen to have a build number already.

**This site has no version on screen.** There is no build number anywhere
in `index.html`, so after a deploy there is nothing to name and nothing to
check against. Worth adding before the next change anybody has to
verify by looking.
