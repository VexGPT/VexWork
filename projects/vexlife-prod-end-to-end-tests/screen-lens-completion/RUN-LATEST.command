#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'
COMPANION_REPO='VexGPT/VexWork'
ASSET_REF='12af61a9b676d30ee839abcd68846a4f331e5b97'
ASSET_PATH='projects/vexlife-prod-end-to-end-tests/screen-lens-completion/packages/P009.zip.b64'
EXPECTED_SHA256='cb8bab7a9f24fcb7395887a1d0a872d88826c515463009a6cc2c75bbb1503301'
PACKAGE_NAME="VEXWORK-PR345-SCREEN-LENS-THEME-ACTIVATION-SOURCEOWNER-20261120-P009--sha256-${EXPECTED_SHA256}.zip"

CURL='/usr/bin/curl'
BASE64='/usr/bin/base64'
SHASUM='/usr/bin/shasum'
CUT='/usr/bin/cut'
MKTEMP='/usr/bin/mktemp'
UNZIP='/usr/bin/unzip'
BASH='/bin/bash'
RM='/bin/rm'

for executable in "$CURL" "$BASE64" "$SHASUM" "$CUT" "$MKTEMP" "$UNZIP" "$BASH" "$RM"; do
  [ -x "$executable" ] || { echo "P009 GitHub runner: missing executable $executable" >&2; exit 10; }
done

ROOT="$("$MKTEMP" -d "$HOME/Downloads/.screen-lens-p007-github.XXXXXX")"
cleanup() { "$RM" -rf -- "$ROOT"; }
trap cleanup EXIT HUP INT TERM

B64="$ROOT/P007.zip.b64"
ZIP="$HOME/Downloads/$PACKAGE_NAME"
RAW="https://raw.githubusercontent.com/$COMPANION_REPO/$ASSET_REF/$ASSET_PATH"

echo "P009 GitHub runner: fetching exact companion package bytes..."
"$CURL" -fsSL "$RAW" -o "$B64"

echo "P009 GitHub runner: reconstructing exact relay ZIP..."
"$BASE64" -D -i "$B64" -o "$ZIP"

OBSERVED="$("$SHASUM" -a 256 "$ZIP" | "$CUT" -d ' ' -f 1)"
[ "$OBSERVED" = "$EXPECTED_SHA256" ] || {
  echo "P009 GitHub runner: package digest mismatch." >&2
  echo "expected=$EXPECTED_SHA256" >&2
  echo "observed=$OBSERVED" >&2
  exit 11
}

RUN_ROOT="$ROOT/run"
mkdir -p "$RUN_ROOT"
"$UNZIP" -q "$ZIP" -d "$RUN_ROOT"
[ -f "$RUN_ROOT/RUN.command" ] || { echo 'P009 GitHub runner: RUN.command missing from package.' >&2; exit 12; }

echo "P009 GitHub runner: verified $EXPECTED_SHA256"
echo "P009 GitHub runner: entering exact Relay package..."
set +e
"$BASH" "$RUN_ROOT/RUN.command"
STATUS=$?
set -e

echo "P009 GitHub runner: relay exit $STATUS"
echo "$CONTINUITY"
exit "$STATUS"
