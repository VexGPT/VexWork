#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'

VEXWORK_REPO='VexGPT/VexWork'
VEXWORK_URL='https://github.com/VexGPT/VexWork.git'
VEXWORK_HEAD='a8b2e49f0f40d03a0595842383fc5240a488ee21'

PRODUCT_REPO='VexGPT/VexLife-Prod'
PRODUCT_URL='https://github.com/VexGPT/VexLife-Prod.git'
PRODUCT_BRANCH='VXG-112026-vexlife-prod-main-static-view-a001'
PRODUCT_HEAD='70c64d8f0b3381432b7e409da93f150ef957ac85'

RETURN_ZIP="$HOME/Downloads/RETURN-VEXLIFE-SCREEN-LENS-DYNAMIC-CONSEQUENCES.zip"

GH="$(command -v gh || true)"
GIT='/usr/bin/git'
MKTEMP='/usr/bin/mktemp'
RM='/bin/rm'
ZIP='/usr/bin/zip'
TEE='/usr/bin/tee'
CP='/bin/cp'
NODE="$(command -v node || true)"

[ -n "$GH" ] && [ -x "$GH" ] || { echo "Screen Lens dynamic consequences: gh CLI is required." >&2; exit 10; }
[ -n "$NODE" ] && [ -x "$NODE" ] || { echo "Screen Lens dynamic consequences: node is required." >&2; exit 10; }
for executable in "$GIT" "$MKTEMP" "$RM" "$ZIP" "$TEE" "$CP"; do
  [ -x "$executable" ] || { echo "Screen Lens dynamic consequences: missing executable $executable" >&2; exit 10; }
done
"$GH" auth status >/dev/null

REMOTE_PRODUCT_HEAD="$("$GH" api "repos/$PRODUCT_REPO/git/ref/heads/$PRODUCT_BRANCH" --jq '.object.sha')"
[ "$REMOTE_PRODUCT_HEAD" = "$PRODUCT_HEAD" ] || {
  echo "Screen Lens dynamic consequences: Product branch moved; expected=$PRODUCT_HEAD observed=$REMOTE_PRODUCT_HEAD" >&2
  exit 11
}

ROOT="$("$MKTEMP" -d "$HOME/Downloads/.vexlife-screen-lens-dynamic.XXXXXX")"
cleanup() { "$RM" -rf -- "$ROOT"; }
trap cleanup EXIT HUP INT TERM

OUT="$ROOT/return"
mkdir -p "$OUT"

{
  echo "$CONTINUITY"
  echo "vexwork_sha=$VEXWORK_HEAD"
  echo "product_sha=$PRODUCT_HEAD"
  echo "purpose=generic nested state -> manifestation consequence projection"
  echo "runtime_mutation=none"
} > "$OUT/SOURCE.txt"

echo "Screen Lens dynamic consequences: acquiring exact VexWork source..."
VW="$ROOT/VexWork"
"$GIT" clone -q --filter=blob:none --no-checkout "$VEXWORK_URL" "$VW"
cd "$VW"
"$GIT" fetch -q origin "$VEXWORK_HEAD"
"$GIT" checkout -q --detach "$VEXWORK_HEAD"
[ "$("$GIT" rev-parse HEAD)" = "$VEXWORK_HEAD" ] || exit 12
echo "vexwork_tree=$("$GIT" rev-parse HEAD^{tree})" >> "$OUT/SOURCE.txt"

echo "Screen Lens dynamic consequences: proving generic Lens semantics..."
set +e
"$NODE" --test \
  test/vexboard-screen-lens-realization.test.mjs \
  test/vexboard-screen-lens-source-expressions.test.mjs \
  test/vexboard-lens-ui.test.mjs 2>&1 | "$TEE" "$OUT/vexwork-proof.log"
VW_STATUS=${PIPESTATUS[0]}
set -e
if [ "$VW_STATUS" -ne 0 ]; then
  {
    echo "result=SAFE_FAILURE"
    echo "vexwork_proof=FAIL"
    echo "vexwork_exit=$VW_STATUS"
    echo "product_generation=NOT_REACHED"
    echo "product_proof=NOT_REACHED"
    echo "publication=NOT_REACHED"
  } > "$OUT/RESULT.txt"
  cd "$OUT"; "$ZIP" -q "$RETURN_ZIP" ./*
  echo "Screen Lens dynamic consequences: VexWork proof failed; RETURN=$RETURN_ZIP" >&2
  exit "$VW_STATUS"
fi

echo "Screen Lens dynamic consequences: acquiring exact Product source..."
VP="$ROOT/VexLife-Prod"
"$GIT" clone -q --filter=blob:none --no-checkout "$PRODUCT_URL" "$VP"
cd "$VP"
"$GIT" fetch -q origin "$PRODUCT_HEAD"
"$GIT" checkout -q --detach "$PRODUCT_HEAD"
[ "$("$GIT" rev-parse HEAD)" = "$PRODUCT_HEAD" ] || exit 13
echo "product_tree=$("$GIT" rev-parse HEAD^{tree})" >> "$OUT/SOURCE.txt"

echo "Screen Lens dynamic consequences: generating exact Product Lens..."
set +e
./gradlew --no-daemon --max-workers=1 -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=2g" -Pkotlin.compiler.execution.strategy=in-process generateVexLifeProdScreenLens 2>&1 | "$TEE" "$OUT/product-generate.log"
GEN_STATUS=${PIPESTATUS[0]}
set -e
if [ "$GEN_STATUS" -ne 0 ]; then
  {
    echo "result=SAFE_FAILURE"
    echo "vexwork_proof=PASS"
    echo "product_generation=FAIL"
    echo "product_generation_exit=$GEN_STATUS"
    echo "product_proof=NOT_REACHED"
    echo "publication=NOT_REACHED"
  } > "$OUT/RESULT.txt"
  cd "$OUT"; "$ZIP" -q "$RETURN_ZIP" ./*
  echo "Screen Lens dynamic consequences: Product generation failed; RETURN=$RETURN_ZIP" >&2
  exit "$GEN_STATUS"
fi

echo "Screen Lens dynamic consequences: running focused Product/Lens proof..."
set +e
./gradlew --no-daemon --max-workers=1 -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=2g" -Pkotlin.compiler.execution.strategy=in-process \
  jvmTest \
  --tests vexlife.workspace.VexLifeWorkspaceBlueprintTest \
  --tests vexlife.web.VexLifeWebP1Test \
  --tests vexlife.web.VexWebAuthoringTest \
  --tests vexlife.web.VexLifeWebP1RuntimeArtifactsTest \
  --tests vexlife.web.VexLifeReleaseAlertsCarrierTest \
  --tests vexlife.lens.VexLifeProdScreenLensTest \
  checkVexLifeStrings 2>&1 | "$TEE" "$OUT/product-proof.log"
PROOF_STATUS=${PIPESTATUS[0]}
set -e

"$CP" docs/lens/vexlife-prod.screen-lens.json "$OUT/vexlife-prod.screen-lens.json"
"$GIT" diff -- docs/lens/vexlife-prod.screen-lens.json > "$OUT/lens.diff"
"$GIT" status --short > "$OUT/product-git-status-before-publish.txt"

if [ "$PROOF_STATUS" -ne 0 ]; then
  {
    echo "result=SAFE_FAILURE"
    echo "vexwork_proof=PASS"
    echo "product_generation=PASS"
    echo "product_proof=FAIL"
    echo "product_proof_exit=$PROOF_STATUS"
    echo "publication=NOT_REACHED"
  } > "$OUT/RESULT.txt"
  cd "$OUT"; "$ZIP" -q "$RETURN_ZIP" ./*
  echo "Screen Lens dynamic consequences: Product proof failed; RETURN=$RETURN_ZIP" >&2
  exit "$PROOF_STATUS"
fi

CHANGED="$("$GIT" status --short)"
[ "$CHANGED" = ' M docs/lens/vexlife-prod.screen-lens.json' ] || {
  echo "Screen Lens dynamic consequences: unexpected Product generated paths:" >&2
  echo "$CHANGED" >&2
  exit 14
}

"$GIT" add docs/lens/vexlife-prod.screen-lens.json
"$GIT" -c user.name='VexGPT' -c user.email='noreply@github.com' commit -q \
  -m '[Screen Lens] Publish dynamic presentation consequences' \
  -m 'Generated after generic nested-state semantics and Product OPEN/CLOSED consequence bindings both passed.' \
  -m '[VXG RealForever]'
NEW_HEAD="$("$GIT" rev-parse HEAD)"

LEASE="$("$GH" api "repos/$PRODUCT_REPO/git/ref/heads/$PRODUCT_BRANCH" --jq '.object.sha')"
[ "$LEASE" = "$PRODUCT_HEAD" ] || {
  echo "Screen Lens dynamic consequences: Product branch moved before publish; expected=$PRODUCT_HEAD observed=$LEASE" >&2
  exit 15
}
"$GIT" push -q origin "HEAD:$PRODUCT_BRANCH"

{
  echo "result=PASS"
  echo "vexwork_proof=PASS"
  echo "product_generation=PASS"
  echo "product_proof=PASS"
  echo "published_head=$NEW_HEAD"
} > "$OUT/RESULT.txt"

"$RM" -f -- "$RETURN_ZIP"
cd "$OUT"
"$ZIP" -q "$RETURN_ZIP" ./*

echo "Screen Lens dynamic consequences: PASS"
echo "published_head=$NEW_HEAD"
echo "RETURN=$RETURN_ZIP"
echo "$CONTINUITY"
