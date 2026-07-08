# Pupcup Videos

Drop your gameplay clips into the matching folder below, then commit & push.
GitHub automatically compresses them and they appear on the site — no code editing per video.

## Where videos go

```
rules/<dog>/   clips of that dog's rule in action.
               Opening that rule card on the site shows these in "See It In Action."

  frida-puplo/      Don't touch your head (hair & glasses OK)
  pupstein/         Bark before answering any questions
  pupquiao/         Use only your snout to point
  lady-puppa/       Growl when playing a card
  k-pup/            Don't show your teeth
  rupup/            Don't say "I"
  queen-elizapup/   You're safe (exempt from all rules)

steal/     clips of steal cards being played (shown on any steal card)
block/     clips of block cards being played (shown on any block card)
general/   general game-night clips (used as extra fallback)
```

## How it works

- Drop clips into the right folder, commit, and push. That's it.
- File names don't matter — name them whatever you like.
- Each card shows up to 3 clips. If a folder has 3+ clips, 3 are picked at
  random each visit (so it feels fresh). If a rule has fewer than 3, the empty
  spots are filled with clips from other rules.
- `.mp4` and `.mov` both work; the compressor standardizes them for the web.
- Keep your original high-quality masters somewhere OFF the repo — the copies
  in here get compressed (smaller, slightly lossy) for fast loading.

**Do not edit `manifest.js` by hand — it is generated automatically by the
compression Action every time videos change.**
