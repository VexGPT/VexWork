import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (relative) =>
  JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const readText = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');

const project = read('projects/cloud-connectivity/project.json');
const segment = read('workgraphs/segments/cloud-connectivity.json');
const readme = readText('projects/cloud-connectivity/README.md');
const checklist = readText('projects/cloud-connectivity/DEMONSTRATION-CHECKLIST.md');
const simulation = readText('projects/cloud-connectivity/VEXLIFE-SIMULATION-PLAN.md');

const byRef = new Map(segment.items.map((item) => [item.workRef, item]));

test('Cloud Connectivity forms a bounded no-authority Project', () => {
  assert.equal(project.projectRef, 'project.cloud-connectivity');
  assert.deepEqual(project.rootWorkRefs, ['work.cloud-connectivity.outcome']);
  assert.equal(segment.segmentRef, 'segment.cloud-connectivity');
  assert.equal(segment.items.length, 14);

  for (const item of segment.items) {
    assert.equal(item.authorityDisposition, 'NO_AUTHORITY');
    assert.equal(item.effectDisposition, 'NO_EFFECTS');
  }
});

test('operation identity stays distinct from transport attempts', () => {
  assert.match(readme, /OPERATION_IDENTITY != ATTEMPT_IDENTITY/);
  assert.match(simulation, /RETRY != NEW OPERATION/);
  assert.match(simulation, /TIMEOUT != FAILURE OF DOMAIN EFFECT/);
  assert.match(simulation, /TRANSPORT_SUCCESS != DURABLE_COMMIT/);
  assert.match(checklist, /Server commits operation but response is lost/);
});

test('coverage includes offline sync, multi-device, API compatibility and data transfer', () => {
  assert.match(checklist, /Offline sync \+ currentness/);
  assert.match(checklist, /Multi-device convergence/);
  assert.match(checklist, /API versioning \+ backward compatibility/);
  assert.match(checklist, /Data transfer \+ storage/);

  assert.ok(byRef.has('work.cloud-connectivity.offline-sync-currentness'));
  assert.ok(byRef.has('work.cloud-connectivity.multi-device-convergence'));
  assert.ok(byRef.has('work.cloud-connectivity.api-versioning-compatibility'));
  assert.ok(byRef.has('work.cloud-connectivity.data-transfer-integrity'));
});

test('Full Security is consumed rather than duplicated', () => {
  assert.match(readme, /CLOUD_CONNECTIVITY != CLOUD_SECURITY_ONTOLOGY/);
  assert.match(readme, /FULL_SECURITY != DISTRIBUTED_SYSTEMS_CORRECTNESS/);
  assert.ok(byRef.has('work.cloud-connectivity.full-security-integration'));
  assert.match(
    byRef.get('work.cloud-connectivity.full-security-integration').purpose,
    /without duplicating its ontology/,
  );
});

test('provider-neutral cloud precedes AWS realization', () => {
  assert.match(readme, /Provider-neutral first/);
  assert.match(readme, /Identity Provider\s+-> Cognito/);
  assert.match(readme, /API Ingress\s+-> API Gateway/);
  assert.match(readme, /Structured Durable Store-> DynamoDB/);
  assert.match(readme, /Object Store\s+-> S3/);
  assert.match(readme, /Key Management\s+-> KMS/);

  const aws = byRef.get('work.cloud-connectivity.aws-example-realization');
  assert.deepEqual(aws.dependencyRefs, [
    'work.cloud-connectivity.synthetic-cloud',
    'work.cloud-connectivity.full-security-integration',
  ]);
});

test('VexLife-Prod AppSelector is a deliberate product doorway, not DOM state', () => {
  assert.match(readme, /VexLifeWorkspaceBlueprint\.AppSelector/);
  assert.match(readme, /Do not implement this as DOM visibility alone/);
  assert.match(simulation, /Browser/);
  assert.match(simulation, /Full Security/);
  assert.match(simulation, /Cloud Connectivity/);
  assert.ok(byRef.has('work.cloud-connectivity.vexlife-prod-app-selector'));
});

test('scenario plan includes ambiguous outcome, five-device and compatibility pressure', () => {
  assert.match(simulation, /C05 — server commits, response is lost/);
  assert.match(simulation, /C12 — five-device convergence/);
  assert.match(simulation, /C13 — supported old mobile client/);
  assert.match(simulation, /C31 — backend rollout compatibility window/);
  assert.match(simulation, /C32 — provider realization swap/);
});

test('canonical discoverability stays held while shared surfaces are occupied', () => {
  const discoverability = byRef.get('work.cloud-connectivity.discoverability');
  assert.equal(discoverability.state, 'WAITING_RESOURCE');
  assert.match(discoverability.purpose, /do not race PR #253\/#256/);
});

// [VXG RealForever][CLOUD-CONNECTIVITY][PROJECT]
