#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
EXPECTED="5e3197fd427e3cb912c45cf4fa868d34bb4cf807814aa8dbf7883ce3a6c7e1ff"
B64="$HERE/VEXWORK-PR403-LOCALIZATION-A1-RELAY-BOOTSTRAP-A001-R2--sha256-5e3197fd427e3cb912c45cf4fa868d34bb4cf807814aa8dbf7883ce3a6c7e1ff.zip.b64"
[ -f "$B64" ] || { printf 'Companion bootstrap payload missing: %s\n' "$B64" >&2; exit 2; }
TMP="$(/usr/bin/mktemp -d "${TMPDIR:-/tmp}/VEXWORK-PR403-COMPANION.XXXXXX")"
trap '/bin/rm -rf "$TMP"' EXIT HUP INT TERM
ZIP="$TMP/VEXWORK-PR403-LOCALIZATION-A1-RELAY-BOOTSTRAP-A001-R2--sha256-5e3197fd427e3cb912c45cf4fa868d34bb4cf807814aa8dbf7883ce3a6c7e1ff.zip"
/usr/bin/base64 -D < "$B64" > "$ZIP"
OBS="$(/usr/bin/shasum -a 256 "$ZIP" | /usr/bin/awk '{print $1}')"
[ "$OBS" = "$EXPECTED" ] || { printf 'Companion bootstrap digest mismatch: expected=%s observed=%s\n' "$EXPECTED" "$OBS" >&2; exit 3; }
/usr/bin/ditto -x -k "$ZIP" "$TMP/extracted"
/bin/bash "$TMP/extracted/bootstrap/FORM-AND-RUN.command" "$TMP/extracted"
