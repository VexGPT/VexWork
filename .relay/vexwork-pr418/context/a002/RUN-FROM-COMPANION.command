#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd -P)"
EXPECTED="25c05dd8ef9c9bcdd3c468e862d960378111a95f71b98b72162ea7f3f3be31b9"
ZIP="$HERE/VEXWORK-PR418-A2-SOURCE-OWNER-BOOTSTRAP-A002--sha256-25c05dd8ef9c9bcdd3c468e862d960378111a95f71b98b72162ea7f3f3be31b9.zip"
[ -f "$ZIP" ] || { printf 'Companion bootstrap ZIP missing: %s\n' "$ZIP" >&2; exit 2; }
BYTES="$(/usr/bin/stat -f '%z' "$ZIP")"
[ "$BYTES" = "20925" ] || { printf 'Companion bootstrap size mismatch: expected=20925 observed=%s\n' "$BYTES" >&2; exit 3; }
OBS="$(/usr/bin/shasum -a 256 "$ZIP" | /usr/bin/awk '{print $1}')"
[ "$OBS" = "$EXPECTED" ] || { printf 'Companion bootstrap digest mismatch: expected=%s observed=%s\n' "$EXPECTED" "$OBS" >&2; exit 4; }
TMP="$(/usr/bin/mktemp -d "${TMPDIR:-/tmp}/VEXWORK-PR418-A002-COMPANION.XXXXXX")"
trap '/bin/rm -rf "$TMP"' EXIT HUP INT TERM
/usr/bin/ditto -x -k "$ZIP" "$TMP/extracted"
/bin/bash "$TMP/extracted/bootstrap/FORM-AND-RUN.command" "$TMP/extracted"
