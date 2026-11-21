#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd -P)"
EXPECTED="e3ead12883b14a7bb6a4a5c860971ed2472f71dc3a86647a608033dfddd3ec12"
ZIP="$HERE/VEXWORK-PR418-A2-SOURCE-OWNER-BOOTSTRAP-A003--sha256-e3ead12883b14a7bb6a4a5c860971ed2472f71dc3a86647a608033dfddd3ec12.zip"
[ -f "$ZIP" ] || { printf 'Companion bootstrap ZIP missing: %s\n' "$ZIP" >&2; exit 2; }
BYTES="$(/usr/bin/stat -f '%z' "$ZIP")"
[ "$BYTES" = "21032" ] || { printf 'Companion bootstrap size mismatch: expected=21032 observed=%s\n' "$BYTES" >&2; exit 3; }
OBS="$(/usr/bin/shasum -a 256 "$ZIP" | /usr/bin/awk '{print $1}')"
[ "$OBS" = "$EXPECTED" ] || { printf 'Companion bootstrap digest mismatch: expected=%s observed=%s\n' "$EXPECTED" "$OBS" >&2; exit 4; }
TMP="$(/usr/bin/mktemp -d "${TMPDIR:-/tmp}/VEXWORK-PR418-A003-COMPANION.XXXXXX")"
trap '/bin/rm -rf "$TMP"' EXIT HUP INT TERM
/usr/bin/ditto -x -k "$ZIP" "$TMP/extracted"
/bin/bash "$TMP/extracted/bootstrap/FORM-AND-RUN.command" "$TMP/extracted"
