#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'
PRODUCT_REPO='VexGPT/VexLife-Prod'
PRODUCT_URL='https://github.com/VexGPT/VexLife-Prod.git'
PRODUCT_BRANCH='VXG-112026-vexlife-prod-main-static-view-a001'
EXPECTED_HEAD='31b8a0b005270b06f9a17e0d84510216d3fd057a'
RETURN_ZIP="$HOME/Downloads/RETURN-VEXLIFE-SCREEN-LENS-MAIN-RICH-PROJECTION.zip"

GH="$(command -v gh || true)"
GIT='/usr/bin/git'
MKTEMP='/usr/bin/mktemp'
RM='/bin/rm'
ZIP='/usr/bin/zip'
TEE='/usr/bin/tee'
CP='/bin/cp'

[ -n "$GH" ] && [ -x "$GH" ] || { echo "Screen Lens rich projection: gh CLI is required." >&2; exit 10; }
for executable in "$GIT" "$MKTEMP" "$RM" "$ZIP" "$TEE" "$CP"; do
  [ -x "$executable" ] || { echo "Screen Lens rich projection: missing executable $executable" >&2; exit 10; }
done
"$GH" auth status >/dev/null

REMOTE_HEAD="$("$GH" api "repos/$PRODUCT_REPO/git/ref/heads/$PRODUCT_BRANCH" --jq '.object.sha')"
[ "$REMOTE_HEAD" = "$EXPECTED_HEAD" ] || {
  echo "Screen Lens rich projection: branch moved; expected=$EXPECTED_HEAD observed=$REMOTE_HEAD" >&2
  exit 11
}

ROOT="$("$MKTEMP" -d "$HOME/Downloads/.vexlife-screen-lens-rich.XXXXXX")"
cleanup() { "$RM" -rf -- "$ROOT"; }
trap cleanup EXIT HUP INT TERM

REPO="$ROOT/VexLife-Prod"
OUT="$ROOT/return"
mkdir -p "$OUT"

echo "Screen Lens rich projection: acquiring exact Product source $EXPECTED_HEAD..."
"$GIT" clone -q --filter=blob:none --no-checkout "$PRODUCT_URL" "$REPO"
cd "$REPO"
"$GIT" fetch -q origin "$EXPECTED_HEAD"
"$GIT" checkout -q --detach "$EXPECTED_HEAD"

ACTUAL="$("$GIT" rev-parse HEAD)"
[ "$ACTUAL" = "$EXPECTED_HEAD" ] || exit 12

{
  echo "$CONTINUITY"
  echo "product_sha=$EXPECTED_HEAD"
  echo "tree=$("$GIT" rev-parse HEAD^{tree})"
  echo "purpose=current Main expression/traversal/color-mode projection"
  echo "runtime_mutation=none"
} > "$OUT/SOURCE.txt"

echo "Screen Lens rich projection: generating exact Product Lens..."
set +e
./gradlew --no-daemon --max-workers=1 -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=2g" -Pkotlin.compiler.execution.strategy=in-process generateVexLifeProdScreenLens 2>&1 | "$TEE" "$OUT/generate.log"
GEN_STATUS=${PIPESTATUS[0]}
set -e
if [ "$GEN_STATUS" -ne 0 ]; then
  echo "result=SAFE_FAILURE" > "$OUT/RESULT.txt"
  echo "generation=FAIL" >> "$OUT/RESULT.txt"
  echo "generation_exit=$GEN_STATUS" >> "$OUT/RESULT.txt"
  cd "$OUT"; "$ZIP" -q "$RETURN_ZIP" ./*
  echo "Screen Lens rich projection: generation failed; RETURN=$RETURN_ZIP" >&2
  exit "$GEN_STATUS"
fi

echo "Screen Lens rich projection: running focused exporter proof..."
set +e
./gradlew --no-daemon --max-workers=1 -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=2g" -Pkotlin.compiler.execution.strategy=in-process jvmTest --tests vexlife.lens.VexLifeProdScreenLensTest checkVexLifeStrings 2>&1 | "$TEE" "$OUT/proof.log"
PROOF_STATUS=${PIPESTATUS[0]}
set -e

"$CP" docs/lens/vexlife-prod.screen-lens.json "$OUT/vexlife-prod.screen-lens.json"
"$GIT" diff -- docs/lens/vexlife-prod.screen-lens.json > "$OUT/lens.diff"
"$GIT" status --short > "$OUT/git-status-before-publish.txt"

if [ "$PROOF_STATUS" -ne 0 ]; then
  echo "result=SAFE_FAILURE" > "$OUT/RESULT.txt"
  echo "generation=PASS" >> "$OUT/RESULT.txt"
  echo "focused_exporter_proof=FAIL" >> "$OUT/RESULT.txt"
  echo "proof_exit=$PROOF_STATUS" >> "$OUT/RESULT.txt"
  cd "$OUT"; "$ZIP" -q "$RETURN_ZIP" ./*
  echo "Screen Lens rich projection: proof failed; RETURN=$RETURN_ZIP" >&2
  exit "$PROOF_STATUS"
fi

CHANGED="$("$GIT" status --short)"
[ "$CHANGED" = ' M docs/lens/vexlife-prod.screen-lens.json' ] || {
  echo "Screen Lens rich projection: unexpected generated paths:" >&2
  echo "$CHANGED" >&2
  exit 13
}

"$GIT" add docs/lens/vexlife-prod.screen-lens.json
"$GIT" -c user.name='VexGPT' -c user.email='noreply@github.com' commit -q   -m '[Screen Lens] Publish current Main traversal projection'   -m 'Generated and focused-proved from exact current Product source; runtime behavior remains unchanged.'   -m '[VXG RealForever]'
NEW_HEAD="$("$GIT" rev-parse HEAD)"

LEASE="$("$GH" api "repos/$PRODUCT_REPO/git/ref/heads/$PRODUCT_BRANCH" --jq '.object.sha')"
[ "$LEASE" = "$EXPECTED_HEAD" ] || {
  echo "Screen Lens rich projection: branch moved before publish; expected=$EXPECTED_HEAD observed=$LEASE" >&2
  exit 14
}
"$GIT" push -q origin "HEAD:$PRODUCT_BRANCH"

{
  echo "result=PASS"
  echo "generation=PASS"
  echo "focused_exporter_proof=PASS"
  echo "published_head=$NEW_HEAD"
} > "$OUT/RESULT.txt"

"$RM" -f -- "$RETURN_ZIP"
cd "$OUT"
"$ZIP" -q "$RETURN_ZIP" ./*

echo "Screen Lens rich projection: PASS"
echo "published_head=$NEW_HEAD"
echo "RETURN=$RETURN_ZIP"
echo "$CONTINUITY"
