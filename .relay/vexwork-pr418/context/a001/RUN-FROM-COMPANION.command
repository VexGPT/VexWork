#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd -P)"
EXPECTED="dd7d211fb5cc1e1804dcadf2212c1cae745ea6491480b5843ca89ecbb382a766"
ZIP="$HERE/VEXWORK-PR418-A2-SOURCE-OWNER-BOOTSTRAP-A001--sha256-dd7d211fb5cc1e1804dcadf2212c1cae745ea6491480b5843ca89ecbb382a766.zip"
[ -f "$ZIP" ] || { printf 'Companion bootstrap ZIP missing: %s\n' "$ZIP" >&2; exit 2; }
BYTES="$(/usr/bin/stat -f '%z' "$ZIP")"
[ "$BYTES" = "20579" ] || { printf 'Companion bootstrap size mismatch: expected=20579 observed=%s\n' "$BYTES" >&2; exit 3; }
OBS="$(/usr/bin/shasum -a 256 "$ZIP" | /usr/bin/awk '{print $1}')"
[ "$OBS" = "$EXPECTED" ] || { printf 'Companion bootstrap digest mismatch: expected=%s observed=%s\n' "$EXPECTED" "$OBS" >&2; exit 4; }
TMP="$(/usr/bin/mktemp -d "${TMPDIR:-/tmp}/VEXWORK-PR418-A001-COMPANION.XXXXXX")"
trap '/bin/rm -rf "$TMP"' EXIT HUP INT TERM
/usr/bin/ditto -x -k "$ZIP" "$TMP/extracted"
/bin/bash "$TMP/extracted/bootstrap/FORM-AND-RUN.command" "$TMP/extracted"
