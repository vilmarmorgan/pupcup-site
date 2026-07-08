# Video compression (automated)

Videos added to `images/` are automatically compressed for the web by a GitHub
Action — no local tools needed.

## How to use it

1. Drop a video into `images/` (e.g. `images/placeholder-steal-1.MP4`).
2. Commit and push to `main`.
3. The **Compress videos** Action runs, compresses the file in place, and
   commits the smaller version back. GitHub Pages then redeploys automatically.

That's it. You don't run anything yourself.

## What "balanced" means

- H.264, capped at 1080p, CRF 26, web fast-start enabled.
- Typical result: a 14 MB export drops to ~5 MB with no visible quality loss.
- Files that are already efficient are left essentially unchanged.

## Safety / guard

Each file is compressed **only once**. `.github/video-compress-manifest.txt`
records a hash of every file the Action has produced; files already listed are
skipped. This prevents repeated re-encoding (quality loss) and stops the
auto-commit from re-triggering the workflow (the commit is also tagged
`[skip ci]`).

Re-uploading a *new* raw version of a file (different content = different hash)
will be compressed again, as expected.

## One-time GitHub setup required

For the Action's auto-commit to push, enable write access:
**Repo → Settings → Actions → General → Workflow permissions →
"Read and write permissions" → Save.**

## Running manually (optional)

```bash
bash scripts/compress-videos.sh          # scans images/
bash scripts/compress-videos.sh some/dir # scan a different folder
CRF=23 bash scripts/compress-videos.sh   # higher quality (larger files)
```
Requires `ffmpeg` installed locally.
