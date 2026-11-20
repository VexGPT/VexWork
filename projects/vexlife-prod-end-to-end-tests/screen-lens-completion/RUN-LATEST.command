#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'
PRODUCT_REPO='https://github.com/VexGPT/VexLife-Prod.git'
PRODUCT_SHA='83ce4fac4061de73f8bf25f405e2840b1cd09171'
RETURN_ZIP="$HOME/Downloads/RETURN-VEXLIFE-SCREEN-LENS-MAIN-STATIC-VIEW-PREVIEW.zip"

GIT='/usr/bin/git'
MKTEMP='/usr/bin/mktemp'
RM='/bin/rm'
ZIP='/usr/bin/zip'
TEE='/usr/bin/tee'

for executable in "$GIT" "$MKTEMP" "$RM" "$ZIP" "$TEE"; do
  [ -x "$executable" ] || { echo "Screen Lens preview: missing executable $executable" >&2; exit 10; }
done

ROOT="$("$MKTEMP" -d "$HOME/Downloads/.vexlife-screen-lens-static-view.XXXXXX")"
cleanup() { "$RM" -rf -- "$ROOT"; }
trap cleanup EXIT HUP INT TERM

REPO="$ROOT/VexLife-Prod"
OUT="$ROOT/return"
mkdir -p "$OUT"

echo "Screen Lens preview: acquiring exact Product source $PRODUCT_SHA..."
"$GIT" clone -q --filter=blob:none --no-checkout "$PRODUCT_REPO" "$REPO"
cd "$REPO"
"$GIT" fetch -q origin "$PRODUCT_SHA"
"$GIT" checkout -q --detach "$PRODUCT_SHA"

ACTUAL="$("$GIT" rev-parse HEAD)"
[ "$ACTUAL" = "$PRODUCT_SHA" ] || {
  echo "Screen Lens preview: source mismatch expected=$PRODUCT_SHA actual=$ACTUAL" >&2
  exit 11
}

{
  echo "$CONTINUITY"
  echo "product_sha=$PRODUCT_SHA"
  echo "tree=$("$GIT" rev-parse HEAD^{tree})"
  echo "purpose=current Main Product-owned STATIC_HTML_CSS Screen Lens preview"
  echo "runtime_mutation=none"
  echo "publication=none"
} > "$OUT/SOURCE.txt"

echo "Screen Lens preview: generating exact Product Lens..."
set +e
./gradlew --no-daemon --max-workers=1 -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=2g" -Pkotlin.compiler.execution.strategy=in-process generateVexLifeProdScreenLens 2>&1 | "$TEE" "$OUT/generate.log"
GEN_STATUS=${PIPESTATUS[0]}
set -e
[ "$GEN_STATUS" -eq 0 ] || {
  echo "generation_status=$GEN_STATUS" > "$OUT/RESULT.txt"
  cd "$OUT"
  "$ZIP" -q "$RETURN_ZIP" ./*
  echo "Screen Lens preview: generation failed; return retained at $RETURN_ZIP" >&2
  exit "$GEN_STATUS"
}

echo "Screen Lens preview: running focused exporter proof..."
set +e
./gradlew --no-daemon --max-workers=1 -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=2g" -Pkotlin.compiler.execution.strategy=in-process jvmTest --tests vexlife.lens.VexLifeProdScreenLensTest checkVexLifeStrings 2>&1 | "$TEE" "$OUT/proof.log"
PROOF_STATUS=${PIPESTATUS[0]}
set -e

cp docs/lens/vexlife-prod.screen-lens.json "$OUT/vexlife-prod.screen-lens.json"
"$GIT" diff -- docs/lens/vexlife-prod.screen-lens.json > "$OUT/lens.diff"
"$GIT" status --short > "$OUT/git-status.txt"

if [ "$PROOF_STATUS" -eq 0 ]; then
  {
    echo "result=PASS"
    echo "generation=PASS"
    echo "focused_exporter_proof=PASS"
  } > "$OUT/RESULT.txt"
else
  {
    echo "result=SAFE_FAILURE"
    echo "generation=PASS"
    echo "focused_exporter_proof=FAIL"
    echo "proof_exit=$PROOF_STATUS"
  } > "$OUT/RESULT.txt"
fi

"$RM" -f -- "$RETURN_ZIP"
cd "$OUT"
"$ZIP" -q "$RETURN_ZIP" ./*

echo "Screen Lens preview: RETURN"
echo "$RETURN_ZIP"
echo "$CONTINUITY"
exit "$PROOF_STATUS"
