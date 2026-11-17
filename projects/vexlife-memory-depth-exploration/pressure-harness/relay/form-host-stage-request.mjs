#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(here, 'STAGE-CATALOG.json'), 'utf8'));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key?.startsWith('--')) throw new Error('arguments must be --key value');
    const name = key.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) { out[name] = next; i += 1; }
    else out[name] = true;
  }
  return out;
}

function required(args, key) {
  if (!args[key]) throw new Error('--' + key + ' is required');
  return args[key];
}

const args = parseArgs(process.argv.slice(2));
const mode = required(args, 'mode');
const bindingPath = path.resolve(required(args, 'binding'));
const outputPath = path.resolve(required(args, 'output'));
const binding = JSON.parse(fs.readFileSync(bindingPath, 'utf8'));
const selected = catalog.modes[mode];
if (!selected) throw new Error('unknown mode: ' + mode);
if (selected.routeClass !== 'HOST_SEMANTIC_MODEL_RUNTIME') {
  throw new Error('mode does not require host semantic model runtime: ' + mode);
}
const scenario = binding.scenario;
const request = {
  schemaVersion: 'vexwork.continuity-pressure-host-effect-request/v1',
  continuity: '[VXG RealForever]',
  requestRef: 'request.continuity-pressure.' + crypto.randomUUID(),
  experimentRef: binding.experimentRef,
  harnessRef: catalog.harnessRef,
  mode,
  stageSequence: selected.sequence,
  currentRelayContractRef: catalog.currentRelayContractRef,
  effectClass: 'HOST_SEMANTIC_MODEL_RUNTIME',
  selectedAdapter: 'adapter.vexlocalbridge.direct-host-effect',
  target: {
    repository: binding.repository.nameWithOwner,
    head: binding.repository.expectedHead,
    tree: binding.repository.expectedTree ?? null,
    branch: binding.repository.branch,
  },
  scenario,
  adapter: binding.adapter,
  execution: binding.execution,
  privacy: {
    syntheticOnly: true,
    canonicalVictorHomeMutationAllowed: false,
    rawReasoningPersistenceAllowed: false,
    scratchHomePolicy: 'DELETE_AFTER_BUNDLE',
  },
  resultContract: {
    schemaVersion: 'vexlife.continuity-pressure-result/v1',
    oneExperimentZipRequired: true,
    outerReturnMustRetainOrSourceBindExperimentZip: true,
  },
  note: 'This descriptor does not grant authority or form the host package. Operations must bind current authority and use the current accepted direct-host-effect carrier.',
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(request, null, 2) + '\n');
process.stdout.write(JSON.stringify({ state: 'PASS', output: outputPath, requestRef: request.requestRef }, null, 2) + '\n');
