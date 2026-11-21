#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
EXPECTED="b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c"
ZIP="$HERE/VEXWORK-PR403-LOCALIZATION-A1-RELAY-BOOTSTRAP-A002--sha256-$EXPECTED.zip"
[ -f "$ZIP" ] || { printf 'Companion bootstrap ZIP missing: %s\n' "$ZIP" >&2; exit 2; }
BYTES="$(/usr/bin/stat -f '%z' "$ZIP")"
[ "$BYTES" = "7306" ] || { printf 'Companion bootstrap size mismatch: expected=7306 observed=%s\n' "$BYTES" >&2; exit 3; }
OBS="$(/usr/bin/shasum -a 256 "$ZIP" | /usr/bin/awk '{print $1}')"
[ "$OBS" = "$EXPECTED" ] || { printf 'Companion bootstrap digest mismatch: expected=%s observed=%s\n' "$EXPECTED" "$OBS" >&2; exit 4; }
TMP="$(/usr/bin/mktemp -d "${TMPDIR:-/tmp}/VEXWORK-PR403-A002.XXXXXX")"
trap '/bin/rm -rf "$TMP"' EXIT HUP INT TERM
/usr/bin/ditto -x -k "$ZIP" "$TMP/extracted"
/bin/bash "$TMP/extracted/bootstrap/FORM-AND-RUN.command" "$TMP/extracted"
