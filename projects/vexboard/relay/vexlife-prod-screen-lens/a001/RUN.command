#!/bin/bash
set -euo pipefail

REPOSITORY='VexGPT/VexWork'
SOURCE_COMMIT='d78ce4309f13489f027aa16d373dcc135ecb7697'
FORM_PATH='projects/vexboard/relay/vexlife-prod-screen-lens/a001/FORM-AND-RUN.mjs'
REQUEST_PATH='projects/vexboard/relay/vexlife-prod-screen-lens/a001/REQUEST.json'
FORM_BLOB='93a57e59a0a23a79c08078101b6833ea13b22f33'
REQUEST_BLOB='355dcfd70b838e4110690a6268f4889e70cb6df4'

resolve_exec() {
  local candidate
  for candidate in "$@"; do
    if [ -x "$candidate" ] && [ -f "$candidate" ]; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 1
}

GH_BIN="$(resolve_exec /opt/homebrew/bin/gh /usr/local/bin/gh)" || { printf '%s\n' 'Screen Lens Relay: GitHub CLI unavailable.' >&2; exit 10; }
GIT_BIN="$(resolve_exec /usr/bin/git /opt/homebrew/bin/git /usr/local/bin/git)" || { printf '%s\n' 'Screen Lens Relay: Git unavailable.' >&2; exit 11; }
NODE_BIN="$(resolve_exec /opt/homebrew/bin/node /usr/local/bin/node /usr/bin/node)" || { printf '%s\n' 'Screen Lens Relay: Node unavailable.' >&2; exit 12; }
MKTEMP_BIN="$(resolve_exec /usr/bin/mktemp)" || { printf '%s\n' 'Screen Lens Relay: mktemp unavailable.' >&2; exit 13; }
RM_BIN="$(resolve_exec /bin/rm /usr/bin/rm)" || { printf '%s\n' 'Screen Lens Relay: rm unavailable.' >&2; exit 14; }

"$GH_BIN" auth status --hostname github.com >/dev/null 2>&1 || {
  printf '%s\n' 'Screen Lens Relay: GitHub authentication unavailable.' >&2
  exit 20
}

ROOT="$("$MKTEMP_BIN" -d "$HOME/Downloads/.vexwork-screen-lens-relay.XXXXXX")"
cleanup() {
  case "$ROOT" in
    "$HOME/Downloads"/.vexwork-screen-lens-relay.*) "$RM_BIN" -rf -- "$ROOT" ;;
  esac
}
trap cleanup EXIT HUP INT TERM

FORM="$ROOT/FORM-AND-RUN.mjs"
REQUEST="$ROOT/REQUEST.json"

printf '%s\n' 'Screen Lens Relay: acquiring exact companion source...'
"$GH_BIN" api -H 'Accept: application/vnd.github.raw+json' "/repos/$REPOSITORY/contents/$FORM_PATH?ref=$SOURCE_COMMIT" > "$FORM"
"$GH_BIN" api -H 'Accept: application/vnd.github.raw+json' "/repos/$REPOSITORY/contents/$REQUEST_PATH?ref=$SOURCE_COMMIT" > "$REQUEST"

OBSERVED_FORM="$("$GIT_BIN" hash-object "$FORM")"
OBSERVED_REQUEST="$("$GIT_BIN" hash-object "$REQUEST")"
[ "$OBSERVED_FORM" = "$FORM_BLOB" ] || { printf 'Screen Lens Relay: FORM blob mismatch: %s\n' "$OBSERVED_FORM" >&2; exit 21; }
[ "$OBSERVED_REQUEST" = "$REQUEST_BLOB" ] || { printf 'Screen Lens Relay: REQUEST blob mismatch: %s\n' "$OBSERVED_REQUEST" >&2; exit 22; }

printf '%s\n' 'Screen Lens Relay: companion source verified.'
"$NODE_BIN" --check "$FORM"
printf '%s\n' 'Screen Lens Relay: formation source parses.'
"$NODE_BIN" "$FORM"
