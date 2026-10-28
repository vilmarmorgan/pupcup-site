# The /about/ page — "What is Pupcup?"

For Joel, and for Claude. Written 28 Oct 2026.

This file is named `CLAUDE.md` on purpose. Claude Code loads a subdirectory's
`CLAUDE.md` by itself the moment it reads, writes or edits any file in that
subdirectory, so working in `about/` pulls this in with nothing to paste and
nothing to remember. Read it yourself too - it is written for a person.

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

You are working in **GitHub Desktop** for the git side and the **Claude
desktop app** for the building. No terminal needed.

1. GitHub Desktop: **File > Clone Repository**, the **GitHub.com** tab, pick
   `vilmarmorgan/pupcup-site`. Note the **Local Path** it shows you - that is
   the folder you will connect to Claude. Click **Clone**.
2. GitHub Desktop: click **Current Branch** in the repository bar and choose
   **about-page**. Everything you do happens on that branch.
3. Claude desktop app: connect the folder from step 1 ("Add folder").
4. Tell Claude to read this file. It does not load on its own in the desktop
   app the way it does in Claude Code, so say so explicitly the first time.

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

All in GitHub Desktop:

1. The **Changes** tab lists what you touched. **Everything listed should be
   under `about/`.** If anything else is there, stop and tell Vilmar rather
   than committing it.
2. Write a summary in the box at the bottom left, click **Commit to
   about-page**.
3. Click **Push origin** at the top.
4. GitHub Desktop then offers to open a pull request - take it, or go to the
   repo on github.com and open one from `about-page` into `main`.

`main` requires a pull request and one approval, so you cannot publish by
accident even if you try. Vilmar reviews and merges; the page goes live at
that moment and not before.

**You do not add the menu link.** `/about/` joins the site menu by a one-line
change to `nav.js`, which every page loads. That is Vilmar's commit, after
this page is real.

---

## Using Claude for this

**In the Claude desktop app with this folder connected** - your setup - this
file does NOT load by itself. Start the first session by telling Claude:

> Read `about/CLAUDE.md` in this folder and follow it. Then build the page it
> describes, in `about/index.html`. Do not change any file outside `about/`.

After that it has the context for the rest of the session.

**In Claude Code, in a terminal** this file loads on its own as soon as
Claude touches anything in `about/`, and the rules in `.claude/rules/` load
at launch. Nothing to say.

Either way the constraint that matters is the one at the top: nothing
outside `about/` changes.
