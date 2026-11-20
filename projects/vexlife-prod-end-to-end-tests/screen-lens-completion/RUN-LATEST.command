#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'
COMPANION_REPO='VexGPT/VexWork'
ASSET_REF='d8aa0314cdd97b1f93e5ced4bb9f2c8ede697086'
ASSET_PATH='projects/vexlife-prod-end-to-end-tests/screen-lens-completion/packages/P008.zip.b64'
EXPECTED_SHA256='e5295444e55bd419c31a046d296307d9f772d0750669cff47738d831fa9ca91d'
PACKAGE_NAME="VEXLIFE-PROD-PR424-SCREEN-LENS-THEME-ACTIVATION-SOURCEOWNER-20261120-P008--sha256-${EXPECTED_SHA256}.zip"

CURL='/usr/bin/curl'
BASE64='/usr/bin/base64'
SHASUM='/usr/bin/shasum'
CUT='/usr/bin/cut'
MKTEMP='/usr/bin/mktemp'
UNZIP='/usr/bin/unzip'
BASH='/bin/bash'
RM='/bin/rm'

for executable in "$CURL" "$BASE64" "$SHASUM" "$CUT" "$MKTEMP" "$UNZIP" "$BASH" "$RM"; do
  [ -x "$executable" ] || { echo "P008 GitHub runner: missing executable $executable" >&2; exit 10; }
done

ROOT="$("$MKTEMP" -d "$HOME/Downloads/.screen-lens-p007-github.XXXXXX")"
cleanup() { "$RM" -rf -- "$ROOT"; }
trap cleanup EXIT HUP INT TERM

B64="$ROOT/P007.zip.b64"
ZIP="$HOME/Downloads/$PACKAGE_NAME"
RAW="https://raw.githubusercontent.com/$COMPANION_REPO/$ASSET_REF/$ASSET_PATH"

echo "P008 GitHub runner: fetching exact companion package bytes..."
"$CURL" -fsSL "$RAW" -o "$B64"

echo "P008 GitHub runner: reconstructing exact relay ZIP..."
"$BASE64" -D -i "$B64" -o "$ZIP"

OBSERVED="$("$SHASUM" -a 256 "$ZIP" | "$CUT" -d ' ' -f 1)"
[ "$OBSERVED" = "$EXPECTED_SHA256" ] || {
  echo "P008 GitHub runner: package digest mismatch." >&2
  echo "expected=$EXPECTED_SHA256" >&2
  echo "observed=$OBSERVED" >&2
  exit 11
}

RUN_ROOT="$ROOT/run"
mkdir -p "$RUN_ROOT"
"$UNZIP" -q "$ZIP" -d "$RUN_ROOT"
[ -f "$RUN_ROOT/RUN.command" ] || { echo 'P008 GitHub runner: RUN.command missing from package.' >&2; exit 12; }

echo "P008 GitHub runner: verified $EXPECTED_SHA256"
echo "P008 GitHub runner: entering exact Relay package..."
set +e
"$BASH" "$RUN_ROOT/RUN.command"
STATUS=$?
set -e

echo "P008 GitHub runner: relay exit $STATUS"
echo "$CONTINUITY"
exit "$STATUS"
