#!/usr/bin/env bash
#
# compress-videos.sh — Compress site videos in place with balanced web settings.
#
# Runs in CI (see .github/workflows/compress-videos.yml) but is safe to run
# locally too. Each video is compressed only ONCE: a manifest records the hash
# of every file it has already produced, so already-compressed files are skipped
# on later runs. This prevents both re-encoding quality loss and CI loops.
#
# Usage:
#   bash scripts/compress-videos.sh [VIDEO_DIR]
#     VIDEO_DIR  directory to scan (default: images)
#
# Env:
#   MANIFEST   path to the hash manifest (default: .github/video-compress-manifest.txt)
#   CRF        x264 quality, lower = higher quality/larger (default: 26 = balanced)

set -euo pipefail

VIDEO_DIR="${1:-images}"
MANIFEST="${MANIFEST:-.github/video-compress-manifest.txt}"
CRF="${CRF:-26}"

mkdir -p "$(dirname "$MANIFEST")"
touch "$MANIFEST"

sha() { sha256sum "$1" | awk '{print $1}'; }

processed=0
skipped=0

# Collect the full file list FIRST, before any processing. Modifying folders
# mid-loop (deleting a .mov, creating a .mp4) would otherwise disturb find's
# in-progress scan and abort the run.
VIDEO_FILES=()
while IFS= read -r -d '' _vf; do
  VIDEO_FILES+=("$_vf")
done < <(find "$VIDEO_DIR" -type f \
          \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.m4v' -o -iname '*.webm' \) \
          -print0)

for f in "${VIDEO_FILES[@]}"; do
  h="$(sha "$f")"

  # Already produced by a previous run? Skip — prevents re-compression.
  if grep -q "^${h}  " "$MANIFEST" 2>/dev/null; then
    skipped=$((skipped + 1))
    continue
  fi

  tmp="$(mktemp --suffix=.mp4)"
  echo "Compressing: $f"

  # Normalize output to .mp4 for browser compatibility (esp. .mov/.MOV, which
  # Chrome and Firefox often refuse to play). Files already .mp4 keep their path.
  ext_lower="$(printf '%s' "${f##*.}" | tr '[:upper:]' '[:lower:]')"
  if [ "$ext_lower" = "mp4" ]; then
    target="$f"
  else
    target="${f%.*}.mp4"
  fi

  if ffmpeg -y -loglevel error -i "$f" \
      -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
      -c:v libx264 -preset medium -crf "$CRF" -pix_fmt yuv420p \
      -c:a aac -b:a 128k -movflags +faststart \
      "$tmp"; then

    orig_size=$(stat -c%s "$f")
    new_size=$(stat -c%s "$tmp")

    if [ "$target" != "$f" ]; then
      # Container change (e.g. .mov -> .mp4): always adopt the mp4 and drop the original.
      mv "$tmp" "$target"
      rm -f "$f"
      echo "  ${f##*/} -> ${target##*/}  ($((orig_size / 1024))KB -> $((new_size / 1024))KB)"
    elif [ "$new_size" -lt "$orig_size" ]; then
      # Same extension (.mp4): only replace if actually smaller.
      mv "$tmp" "$f"
      echo "  $((orig_size / 1024))KB -> $((new_size / 1024))KB"
    else
      rm -f "$tmp"
      echo "  already optimal, left unchanged"
    fi

    # Record the hash of the file as it now stands on disk.
    printf '%s  %s\n' "$(sha "$target")" "$target" >> "$MANIFEST"
    processed=$((processed + 1))
  else
    rm -f "$tmp"
    echo "  ERROR: ffmpeg failed on $f (skipping)" >&2
  fi
done

echo "Done. Compressed/updated: $processed, skipped (already done): $skipped"

# Regenerate the video manifest the site reads (lists clips per folder).
if command -v python3 >/dev/null 2>&1; then
  python3 "$(dirname "$0")/gen-video-manifest.py" images/videos || \
    echo "WARN: manifest generation failed" >&2
fi
