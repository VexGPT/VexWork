#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'

VEXWORK_REPO='VexGPT/VexWork'
VEXWORK_URL='https://github.com/VexGPT/VexWork.git'
VEXWORK_HEAD='08bcfa9baa2eaa6b738f0f53c97017b50d13cbc4'

PRODUCT_REPO='VexGPT/VexLife-Prod'
PRODUCT_URL='https://github.com/VexGPT/VexLife-Prod.git'
PRODUCT_BRANCH='VXG-112026-screen-lens-current-main-recursive-projection-a001'
PRODUCT_HEAD='bbcd7a5cd93517edfd75b556bb31e8484e9af26f'

RETURN_ZIP="$HOME/Downloads/RETURN-VEXLIFE-SCREEN-LENS-CURRENT-MAIN-RECONCILIATION.zip"

GH="$(command -v gh || true)"
GIT='/usr/bin/git'
MKTEMP='/usr/bin/mktemp'
RM='/bin/rm'
ZIP='/usr/bin/zip'
TEE='/usr/bin/tee'
CP='/bin/cp'
NODE="$(command -v node || true)"

[ -n "$GH" ] && [ -x "$GH" ] || { echo "Screen Lens current-main reconciliation: gh CLI is required." >&2; exit 10; }
[ -n "$NODE" ] && [ -x "$NODE" ] || { echo "Screen Lens current-main reconciliation: node is required." >&2; exit 10; }
for executable in "$GIT" "$MKTEMP" "$RM" "$ZIP" "$TEE" "$CP"; do
  [ -x "$executable" ] || { echo "Screen Lens current-main reconciliation: missing executable $executable" >&2; exit 10; }
done
"$GH" auth status >/dev/null

REMOTE_PRODUCT_HEAD="$("$GH" api "repos/$PRODUCT_REPO/git/ref/heads/$PRODUCT_BRANCH" --jq '.object.sha')"
[ "$REMOTE_PRODUCT_HEAD" = "$PRODUCT_HEAD" ] || {
  echo "Screen Lens current-main reconciliation: Product branch moved; expected=$PRODUCT_HEAD observed=$REMOTE_PRODUCT_HEAD" >&2
  exit 11
}

ROOT="$("$MKTEMP" -d "$HOME/Downloads/.vexlife-screen-lens-current-main.XXXXXX")"
cleanup() { "$RM" -rf -- "$ROOT"; }
trap cleanup EXIT HUP INT TERM
OUT="$ROOT/return"
mkdir -p "$OUT"

{
  echo "$CONTINUITY"
  echo "vexwork_sha=$VEXWORK_HEAD"
  echo "product_sha=$PRODUCT_HEAD"
  echo "product_base=a4dd25e472d153b1cef24f7f35132933f3d725d0"
  echo "purpose=current Product main + accepted recursive Screen Lens reconciliation"
  echo "runtime_mutation=none"
} > "$OUT/SOURCE.txt"

echo "Screen Lens current-main reconciliation: proving merged VexWork consumer..."
VW="$ROOT/VexWork"
"$GIT" clone -q --filter=blob:none --no-checkout "$VEXWORK_URL" "$VW"
cd "$VW"
"$GIT" fetch -q origin "$VEXWORK_HEAD"
"$GIT" checkout -q --detach "$VEXWORK_HEAD"
[ "$("$GIT" rev-parse HEAD)" = "$VEXWORK_HEAD" ] || exit 12
echo "vexwork_tree=$("$GIT" rev-parse HEAD^{tree})" >> "$OUT/SOURCE.txt"

set +e
"$NODE" --test   test/vexboard-screen-lens.test.mjs   test/vexboard-screen-lens-realization.test.mjs   test/vexboard-screen-lens-source-expressions.test.mjs   test/vexboard-lens-ui.test.mjs 2>&1 | "$TEE" "$OUT/vexwork-proof.log"
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
  echo "Screen Lens current-main reconciliation: VexWork proof failed; RETURN=$RETURN_ZIP" >&2
  exit "$VW_STATUS"
fi

echo "Screen Lens current-main reconciliation: acquiring exact Product successor..."
VP="$ROOT/VexLife-Prod"
"$GIT" clone -q --filter=blob:none --no-checkout "$PRODUCT_URL" "$VP"
cd "$VP"
"$GIT" fetch -q origin "$PRODUCT_HEAD"
"$GIT" checkout -q --detach "$PRODUCT_HEAD"
[ "$("$GIT" rev-parse HEAD)" = "$PRODUCT_HEAD" ] || exit 13
echo "product_tree=$("$GIT" rev-parse HEAD^{tree})" >> "$OUT/SOURCE.txt"

echo "Screen Lens current-main reconciliation: generating combined Product Lens..."
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
  echo "Screen Lens current-main reconciliation: Product generation failed; RETURN=$RETURN_ZIP" >&2
  exit "$GEN_STATUS"
fi

echo "Screen Lens current-main reconciliation: validating generated Lens through merged VexWork consumer..."
set +e
"$NODE" --input-type=module - "$VW" "$VP/docs/lens/vexlife-prod.screen-lens.json" 2>&1 <<'NODE' | "$TEE" "$OUT/vexwork-product-integration.log"
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [vexworkRoot, lensPath] = process.argv.slice(2);
const Lens = await import(pathToFileURL(path.join(vexworkRoot, 'src/shared/vexboard-screen-lens.mjs')).href);
const Expressions = await import(pathToFileURL(path.join(vexworkRoot, 'src/shared/vexboard-screen-lens-source-expressions.mjs')).href);

const raw = JSON.parse(fs.readFileSync(lensPath, 'utf8'));
const normalized = Lens.normalizeScreenLens(raw);
const screenRef = normalized.entryScreenRef;
const expressions = Expressions.expressionsFor(normalized, screenRef);
if (expressions.length <= 1) throw new Error(`expected rich currentized expressions, observed ${expressions.length}`);
const html = normalized.screens[0]?.view?.html ?? '';
const localized = [...html.matchAll(/<([A-Za-z][A-Za-z0-9-]*)([^>]*\bdata-vex-text="([^"]+)"[^>]*)>([^<]*)<\/\1>/g)];
const unresolved = localized.filter((match) => !match[4].trim() || match[4].trim() === match[3]);
if (unresolved.length) throw new Error(`static Product text unresolved: ${unresolved.map((match) => match[3]).join(', ')}`);
if (!/id="send"[^>]*data-vex-text="workspace\.button\.conversation-send"[^>]*>Send<\/button>/.test(html)) throw new Error('static Product Send text is missing');
if (!/<button[^>]*id="attach"[^>]*>\s*<svg\b/.test(html)) throw new Error('static Product attachment icon is missing');
if (!/<button[^>]*id="voice-input"[^>]*>\s*<svg\b/.test(html)) throw new Error('static Product voice-input icon is missing');
console.log(`normalized_screen=${screenRef}`);
console.log(`elements=${normalized.screens[0].elements.length}`);
console.log(`pathways=${normalized.pathways.length}`);
console.log(`expressions=${expressions.length}`);
NODE
INTEGRATION_STATUS=${PIPESTATUS[0]}
set -e
if [ "$INTEGRATION_STATUS" -ne 0 ]; then
  "$CP" docs/lens/vexlife-prod.screen-lens.json "$OUT/vexlife-prod.screen-lens.json"
  "$GIT" diff -- docs/lens/vexlife-prod.screen-lens.json > "$OUT/lens.diff"
  {
    echo "result=SAFE_FAILURE"
    echo "vexwork_proof=PASS"
    echo "product_generation=PASS"
    echo "vexwork_product_integration=FAIL"
    echo "vexwork_product_integration_exit=$INTEGRATION_STATUS"
    echo "product_proof=NOT_REACHED"
    echo "publication=NOT_REACHED"
  } > "$OUT/RESULT.txt"
  cd "$OUT"; "$ZIP" -q "$RETURN_ZIP" ./*
  echo "Screen Lens current-main reconciliation: generated Product Lens is not consumable by VexWork; RETURN=$RETURN_ZIP" >&2
  exit "$INTEGRATION_STATUS"
fi

echo "Screen Lens current-main reconciliation: running focused current Product proof..."
set +e
./gradlew --no-daemon --max-workers=1 -Dorg.gradle.jvmargs="-Xmx6g -XX:MaxMetaspaceSize=2g" -Pkotlin.compiler.execution.strategy=in-process   jvmTest   --tests vexlife.workspace.VexLifeWorkspaceBlueprintTest   --tests vexlife.web.VexLifeWebP1Test   --tests vexlife.web.VexWebAuthoringTest   --tests vexlife.web.VexLifeWebP1RuntimeArtifactsTest   --tests vexlife.web.VexLifeReleaseAlertsCarrierTest   --tests vexlife.lens.VexLifeProdScreenLensTest   checkVexLifeStrings 2>&1 | "$TEE" "$OUT/product-proof.log"
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
    echo "vexwork_product_integration=PASS"
    echo "product_proof=FAIL"
    echo "product_proof_exit=$PROOF_STATUS"
    echo "publication=NOT_REACHED"
  } > "$OUT/RESULT.txt"
  cd "$OUT"; "$ZIP" -q "$RETURN_ZIP" ./*
  echo "Screen Lens current-main reconciliation: Product proof failed; RETURN=$RETURN_ZIP" >&2
  exit "$PROOF_STATUS"
fi

CHANGED="$("$GIT" status --short)"
[ "$CHANGED" = ' M docs/lens/vexlife-prod.screen-lens.json' ] || {
  echo "Screen Lens current-main reconciliation: unexpected generated paths:" >&2
  echo "$CHANGED" >&2
  exit 14
}

"$GIT" add docs/lens/vexlife-prod.screen-lens.json
"$GIT" -c user.name='VexGPT' -c user.email='noreply@github.com' commit -q   -m '[Screen Lens] Publish current-main recursive projection'   -m 'Generated after reconciling accepted recursive Screen Lens meaning onto current Product main.'   -m '[VXG RealForever]'
NEW_HEAD="$("$GIT" rev-parse HEAD)"

LEASE="$("$GH" api "repos/$PRODUCT_REPO/git/ref/heads/$PRODUCT_BRANCH" --jq '.object.sha')"
[ "$LEASE" = "$PRODUCT_HEAD" ] || {
  echo "Screen Lens current-main reconciliation: Product branch moved before publish; expected=$PRODUCT_HEAD observed=$LEASE" >&2
  exit 15
}
"$GIT" push -q origin "HEAD:$PRODUCT_BRANCH"

{
  echo "result=PASS"
  echo "vexwork_proof=PASS"
  echo "product_generation=PASS"
  echo "vexwork_product_integration=PASS"
  echo "product_proof=PASS"
  echo "published_head=$NEW_HEAD"
} > "$OUT/RESULT.txt"

"$RM" -f -- "$RETURN_ZIP"
cd "$OUT"
"$ZIP" -q "$RETURN_ZIP" ./*

echo "Screen Lens current-main reconciliation: PASS"
echo "published_head=$NEW_HEAD"
echo "RETURN=$RETURN_ZIP"
echo "$CONTINUITY"
