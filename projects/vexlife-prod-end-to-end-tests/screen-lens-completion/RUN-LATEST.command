#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'
COMPANION_REPO='VexGPT/VexWork'
ASSET_REF='7a1229d4075e4b9a1f6590dea42594077565b7cc'
ASSET_PATH='projects/vexlife-prod-end-to-end-tests/screen-lens-completion/packages/P007.zip.b64'
EXPECTED_SHA256='50f94dafd4e602535bf62b55c81673c9348b81715359875edbe056e487a20c3e'
PACKAGE_NAME="VEXLIFE-PROD-PR421-SCREEN-LENS-SPIRAL-ADDRESSABILITY-SOURCEOWNER-20261120-P007--sha256-${EXPECTED_SHA256}.zip"

CURL='/usr/bin/curl'
BASE64='/usr/bin/base64'
SHASUM='/usr/bin/shasum'
CUT='/usr/bin/cut'
MKTEMP='/usr/bin/mktemp'
UNZIP='/usr/bin/unzip'
BASH='/bin/bash'
RM='/bin/rm'

for executable in "$CURL" "$BASE64" "$SHASUM" "$CUT" "$MKTEMP" "$UNZIP" "$BASH" "$RM"; do
  [ -x "$executable" ] || { echo "P007 GitHub runner: missing executable $executable" >&2; exit 10; }
done

ROOT="$("$MKTEMP" -d "$HOME/Downloads/.screen-lens-p007-github.XXXXXX")"
cleanup() { "$RM" -rf -- "$ROOT"; }
trap cleanup EXIT HUP INT TERM

B64="$ROOT/P007.zip.b64"
ZIP="$HOME/Downloads/$PACKAGE_NAME"
RAW="https://raw.githubusercontent.com/$COMPANION_REPO/$ASSET_REF/$ASSET_PATH"

echo "P007 GitHub runner: fetching exact companion package bytes..."
"$CURL" -fsSL "$RAW" -o "$B64"

echo "P007 GitHub runner: reconstructing exact relay ZIP..."
"$BASE64" -D -i "$B64" -o "$ZIP"

OBSERVED="$("$SHASUM" -a 256 "$ZIP" | "$CUT" -d ' ' -f 1)"
[ "$OBSERVED" = "$EXPECTED_SHA256" ] || {
  echo "P007 GitHub runner: package digest mismatch." >&2
  echo "expected=$EXPECTED_SHA256" >&2
  echo "observed=$OBSERVED" >&2
  exit 11
}

RUN_ROOT="$ROOT/run"
mkdir -p "$RUN_ROOT"
"$UNZIP" -q "$ZIP" -d "$RUN_ROOT"
[ -f "$RUN_ROOT/RUN.command" ] || { echo 'P007 GitHub runner: RUN.command missing from package.' >&2; exit 12; }

echo "P007 GitHub runner: verified $EXPECTED_SHA256"
echo "P007 GitHub runner: entering exact Relay package..."
"$BASH" "$RUN_ROOT/RUN.command"
STATUS=$?

echo "P007 GitHub runner: relay exit $STATUS"
echo "$CONTINUITY"
exit "$STATUS"
