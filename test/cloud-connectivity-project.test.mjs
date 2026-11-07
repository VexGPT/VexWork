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
const serviceArchitecture = readText('projects/cloud-connectivity/VEXSERVICE-CONNECTIVITY-AND-AUTOMATION.md');
const lab = readText('projects/cloud-connectivity/CLOUD-CONNECTIVITY-LAB.md');

const byRef = new Map(segment.items.map((item) => [item.workRef, item]));

test('Cloud Connectivity forms a bounded no-authority Project', () => {
  assert.equal(project.projectRef, 'project.cloud-connectivity');
  assert.deepEqual(project.rootWorkRefs, ['work.cloud-connectivity.outcome']);
  assert.equal(segment.segmentRef, 'segment.cloud-connectivity');
  assert.equal(segment.items.length, 18);

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
  assert.match(simulation, /C33 — periodic VexLogger bulk upload/);
  assert.match(simulation, /C35 — global announcements poll/);
  assert.match(simulation, /C36 — simultaneous service and operation isolation/);
  assert.match(simulation, /C37 — contract workbench composes only admitted protocol shapes/);
});

test('canonical discoverability stays held while shared surfaces are occupied', () => {
  const discoverability = byRef.get('work.cloud-connectivity.discoverability');
  assert.equal(discoverability.state, 'WAITING_RESOURCE');
  assert.match(discoverability.purpose, /do not race PR #253\/#256/);
});


test('stable VexFamily grammar is the Cloud Connectivity semantic baseline', () => {
  assert.match(serviceArchitecture, /VexFamily\.act\(\.\.\.\) -> admit\(State, Begin\)/);
  assert.match(serviceArchitecture, /ADMITTED_STATE = FAMILY SEMANTIC TRUTH/);
  assert.match(serviceArchitecture, /Cloud Connectivity does \*\*not\*\* use the parallel chained relationship-builder form/);
});

test('network, service and operation scopes remain independently true', () => {
  assert.match(serviceArchitecture, /DEVICE_NETWORK != SERVICE_CONNECTIVITY/);
  assert.match(serviceArchitecture, /SERVICE_CONNECTIVITY != OPERATION_OUTCOME/);
  assert.match(serviceArchitecture, /ONE_OPERATION_FAILURE != SHARED_NETWORK_FAILURE/);
  assert.ok(byRef.has('work.cloud-connectivity.network-service-connectivity-relays'));
  assert.ok(byRef.has('work.cloud-connectivity.vexservice-candidate-foundation'));
});

test('VexService remains a candidate graduated component rather than a super-owner', () => {
  assert.match(serviceArchitecture, /VexService != VexFamily/);
  assert.match(serviceArchitecture, /VexService != VexExecution/);
  assert.match(serviceArchitecture, /VexService != VexLogger/);
  assert.match(serviceArchitecture, /VexService != universal API client/);
  assert.match(serviceArchitecture, /If removing the candidate VexService abstraction loses no required correctness\/reuse/);
});

test('background automation reuses semantic Controls only when semantics exist', () => {
  assert.match(serviceArchitecture, /TIMER_FIRED != CONTROL/);
  assert.match(serviceArchitecture, /periodic policy says due/);
  assert.match(serviceArchitecture, /same Family Control/);
  assert.match(serviceArchitecture, /Pure infrastructure work may remain/);
  assert.ok(byRef.has('work.cloud-connectivity.background-service-automation'));
});

test('logger upload and announcements preserve source ownership', () => {
  assert.match(serviceArchitecture, /VEXLOGGER != LOG_SYNC/);
  assert.match(serviceArchitecture, /ANNOUNCEMENT_EXISTS != NOTIFICATION_SHOULD_FIRE/);
  assert.match(serviceArchitecture, /AnnouncementFamily\.observe/);
});

test('attempt occurrence does not automatically mint another durable identity', () => {
  assert.match(simulation, /active Job \+ VexLogger chronology first/);
  assert.match(serviceArchitecture, /ATTEMPT_OBSERVABILITY != AUTOMATIC ATTEMPT_ID/);
});


test('Cloud Connectivity Lab projects accepted contract truth rather than inventing protocol', () => {
  assert.match(lab, /LAB UI != CONTRACT OWNER/);
  assert.match(lab, /SESSION DRAFT != CONTRACT EVOLUTION/);
  assert.match(lab, /ENUM != FREE TEXT/);
  assert.match(lab, /Prefer an existing standard contract representation/);
  assert.match(lab, /OpenAPI \/ JSON Schema/);
  assert.ok(byRef.has('work.cloud-connectivity.contract-workbench-lab'));
});

test('Lab covers minimum-to-maximum valid composition and outward validation', () => {
  assert.match(lab, /Minimum valid/);
  assert.match(lab, /richer expression admitted by the current contract|richest expression admitted by the current contract/);
  assert.match(lab, /Lawful error forms/);
  assert.match(lab, /Delivery \/ outward scope/);
  assert.match(lab, /SCHEMA_VALID/);
  assert.match(lab, /VALID_TARGET_SHAPE != AUTHORIZED_SEND/);
});

test('synthetic cloud consumes the Lab doorway rather than bypassing contract composition', () => {
  const synthetic = byRef.get('work.cloud-connectivity.synthetic-cloud');
  assert.ok(synthetic.dependencyRefs.includes('work.cloud-connectivity.contract-workbench-lab'));
  assert.match(lab, /Synthetic API ingress \/ server/);
  assert.match(lab, /VexBoard bounded architecture descent/);
});

// [VXG RealForever][CLOUD-CONNECTIVITY][PROJECT]
