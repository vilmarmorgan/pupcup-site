# Brief — the /about/ page ("What is Pupcup?")

For Joel. Written 28 Oct 2026. If you are using Claude to build this, point
it at this file first; it is the whole context in one place.

---

## The one rule

**Nothing outside `about/` changes in this work.** Not `index.html`, not
`howtoplay/`, not `nav.js`, not `CNAME`. The site is live at playpupcup.com
and is served by GitHub Pages from `main` at the repo root, so a merge is a
publish. Your folder cannot affect any existing page; a file outside it can.

If something genuinely needs to change outside `about/`, stop and ask Vilmar
rather than including it. That is not bureaucracy - it is the only thing
keeping "I added a page" from becoming "I changed the site."

## What the page is

A **what is Pupcup** page, not a how-to. Somebody has seen the box, or heard
the name, and wants to know what this actually is.

Three things, in this order:

1. **The box** - what it looks like, what you are handed.
2. **What's inside** - the contents.
3. **The idea** - the general concept. The feel of the game, not its rules.

Then it sends people on:

- **the homepage, `/`** - every card in the deck
- **how to play, `/howtoplay/`** - the video, the rules, the FAQ

Game mechanics belong on `/howtoplay/`, not here. If you find yourself
explaining a turn, you have drifted.

## Getting set up

    git clone git@github.com:vilmarmorgan/pupcup-site.git
    cd pupcup-site
    git checkout about-page

`about/index.html` is already there: the head block, the design-system
variables, the shared menu wired up, three empty sections and the two links.
It is a shell, not a draft. Replace the placeholder `.slot` boxes and the
commented-out prose; keep the structure.

## Previewing it - do not open the file directly

    python3 -m http.server 8000

then open **http://localhost:8000/about/**.

Opening `about/index.html` straight off disk looks like it works and is lying
to you: every root-relative path (`/nav.js`, `/favicon.svg`, `/images/...`)
resolves against your filesystem root and silently 404s. The burger will open
an **empty** menu and nothing will tell you why. This already cost a round
trip once.

## Conventions

Full detail in `.claude/rules/`. The short version:

- **One self-contained HTML file.** All CSS and JS inline, in the page.
- **No build step, no bundler, no package manager, no frameworks.** Vanilla
  JS only. If you want a library, the answer is almost certainly no.
- **Font is Jost**, loaded from Google Fonts. The rules files said Space
  Grotesk until 28 Oct 2026 - that was wrong and is corrected. No page on the
  site has ever used it.
- **The colour variables are the design system.** They are already in
  `about/index.html`:

      --bg #1e2028   --surface #1a1a1e   --accent #f5c542
      --text #f0ece4 --text-muted #9a9a9e

  Verified 28 Oct against `index.html`. Use them. If the page needs a colour
  the system does not have, say so rather than inventing one locally - one
  page quietly forking the palette is how a site stops matching itself.
- **Images**: the full-res PNGs in `cards/` are for print and are NEVER
  served to a browser. Anything new you add for this page goes in `about/`.

## Done means

- Reads correctly on a phone and on a desktop, tested at both widths
- No console errors
- Every link resolves, including from a sub-path
- Images load
- Works with the menu open and closed
- Nothing outside `about/` appears in `git status`

That last one is worth running before you commit:

    git status --short

Anything listed that is not under `about/` should not be in the commit.

## Handing it back

Commit on `about-page`, push, and open a pull request against `main`.

    git add about/
    git commit -m "Build the What is Pupcup page"
    git push

`main` requires a pull request and one approval, so you cannot publish by
accident even if you try. Vilmar reviews and merges; the page goes live at
that moment and not before.

**You do not add the menu link.** `/about/` joins the site menu by a one-line
change to `nav.js`, which every page loads. That is Vilmar's commit, after
this page is real.

---

## If you are starting a Claude session, paste this

> I am building a new page for playpupcup.com, a static site with no build
> step. I am working in the `about/` folder of the pupcup-site repo on the
> `about-page` branch, and I must not change any file outside that folder.
>
> Read `about/BRIEF.md` first, then `.claude/rules/tech-defaults.md`,
> `.claude/rules/design-system.md` and `.claude/rules/workflow.md`. Read
> `howtoplay/index.html` to see how a page on this site is put together.
>
> The page is "What is Pupcup?" - the box, what is inside, and the concept,
> linking out to `/` for the cards and `/howtoplay/` for the mechanics. The
> shell is already in `about/index.html`; fill it in, keep its structure, and
> keep everything inline in that one file.
>
> Before telling me something works, serve the site root with
> `python3 -m http.server 8000` and check `http://localhost:8000/about/` -
> opening the file directly breaks every root-relative path and hides it.
>
> Run `git status --short` before any commit and tell me if anything outside
> `about/` is listed.
