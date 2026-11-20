#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'
PRODUCT_REPO='VexGPT/VexLife-Prod'
PRODUCT_BRANCH='VXG-112026-vexlife-prod-main-static-view-a001'
EXPECTED_HEAD='83ce4fac4061de73f8bf25f405e2840b1cd09171'
EXPECTED_SOURCE_SHA='83ce4fac4061de73f8bf25f405e2840b1cd09171'
RETURN_ZIP="$HOME/Downloads/RETURN-VEXLIFE-SCREEN-LENS-MAIN-STATIC-VIEW-PREVIEW.zip"

GH="$(command -v gh || true)"
GIT='/usr/bin/git'
UNZIP='/usr/bin/unzip'
MKTEMP='/usr/bin/mktemp'
RM='/bin/rm'
CP='/bin/cp'
GREP='/usr/bin/grep'

[ -n "$GH" ] && [ -x "$GH" ] || { echo "Screen Lens publish: gh CLI is required." >&2; exit 10; }
for executable in "$GIT" "$UNZIP" "$MKTEMP" "$RM" "$CP" "$GREP"; do
  [ -x "$executable" ] || { echo "Screen Lens publish: missing executable $executable" >&2; exit 10; }
done
[ -f "$RETURN_ZIP" ] || { echo "Screen Lens publish: missing $RETURN_ZIP" >&2; exit 11; }

"$GH" auth status >/dev/null

ROOT="$("$MKTEMP" -d "$HOME/Downloads/.vexlife-screen-lens-publish.XXXXXX")"
cleanup() { "$RM" -rf -- "$ROOT"; }
trap cleanup EXIT HUP INT TERM

"$UNZIP" -q "$RETURN_ZIP" -d "$ROOT/return"
RESULT="$ROOT/return/RESULT.txt"
SOURCE="$ROOT/return/SOURCE.txt"
LENS="$ROOT/return/vexlife-prod.screen-lens.json"

[ -f "$RESULT" ] && [ -f "$SOURCE" ] && [ -f "$LENS" ] || {
  echo "Screen Lens publish: RETURN is incomplete." >&2
  exit 12
}
"$GREP" -Fx 'result=PASS' "$RESULT" >/dev/null
"$GREP" -Fx 'generation=PASS' "$RESULT" >/dev/null
"$GREP" -Fx 'focused_exporter_proof=PASS' "$RESULT" >/dev/null
"$GREP" -Fx "product_sha=$EXPECTED_SOURCE_SHA" "$SOURCE" >/dev/null

REMOTE_HEAD="$("$GH" api "repos/$PRODUCT_REPO/git/ref/heads/$PRODUCT_BRANCH" --jq '.object.sha')"
[ "$REMOTE_HEAD" = "$EXPECTED_HEAD" ] || {
  echo "Screen Lens publish: branch moved; expected=$EXPECTED_HEAD observed=$REMOTE_HEAD" >&2
  exit 13
}

REPO="$ROOT/VexLife-Prod"
"$GH" repo clone "$PRODUCT_REPO" "$REPO" -- --quiet --branch "$PRODUCT_BRANCH" --single-branch
cd "$REPO"
[ "$("$GIT" rev-parse HEAD)" = "$EXPECTED_HEAD" ] || exit 14

"$CP" "$LENS" docs/lens/vexlife-prod.screen-lens.json

"$GIT" diff --check
CHANGED="$("$GIT" status --short)"
[ "$CHANGED" = ' M docs/lens/vexlife-prod.screen-lens.json' ] || {
  echo "Screen Lens publish: unexpected changed paths:" >&2
  echo "$CHANGED" >&2
  exit 15
}

"$GIT" add docs/lens/vexlife-prod.screen-lens.json
"$GIT" -c user.name='VexGPT' -c user.email='noreply@github.com' commit -q -m '[Screen Lens] Publish current Main static-view projection' -m 'Generated and focused-proved from exact #432 source; Product runtime remains unchanged.' -m '[VXG RealForever]'
NEW_HEAD="$("$GIT" rev-parse HEAD)"
"$GIT" push -q origin "HEAD:$PRODUCT_BRANCH"

echo "Screen Lens publish: PASS"
echo "published_head=$NEW_HEAD"
echo "$CONTINUITY"
