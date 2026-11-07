import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (relative) =>
  JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const readText = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');

const project = read('projects/vex-cgm-labs/project.json');
const segment = read('workgraphs/segments/vex-cgm-labs.json');
const readme = readText('projects/vex-cgm-labs/README.md');
const dataModel = readText('projects/vex-cgm-labs/DATA-MODEL-PRESSURE.md');
const lab = readText('projects/vex-cgm-labs/LAB-SIMULATION-PLAN.md');
const trace = readText('projects/vex-cgm-labs/DESIGN-TRACE-PRACTICUM.md');
const charter = readText('projects/vex-cgm-labs/POC-ARCHITECTURE-CHARTER.md');

const byRef = new Map(segment.items.map((item) => [item.workRef, item]));

test('VexCgmLabs forms a bounded no-authority Project', () => {
  assert.equal(project.projectRef, 'project.vex-cgm-labs');
  assert.deepEqual(project.rootWorkRefs, ['work.vex-cgm-labs.outcome']);
  assert.equal(segment.segmentRef, 'segment.vex-cgm-labs');
  assert.equal(segment.items.length, 13);

  for (const item of segment.items) {
    assert.equal(item.authorityDisposition, 'NO_AUTHORITY');
    assert.equal(item.effectDisposition, 'NO_EFFECTS');
  }
});

test('CGM domain stays distinct from transport, cloud and security', () => {
  assert.match(readme, /CGM_DOMAIN != BLE_TRANSPORT/);
  assert.match(readme, /CGM_DOMAIN != CLOUD_SYNC/);
  assert.match(readme, /CGM_DOMAIN != SECURITY_AUTHORITY/);
  assert.match(readme, /ACQUISITION_CONTINUITY != OBSERVATION_CONTINUITY/);
});

test('data model separates sequence, time, provenance and gap classes', () => {
  assert.match(dataModel, /SEQUENCE != TIMESTAMP/);
  assert.match(dataModel, /CAPTURED_AT != OBSERVED_AT/);
  assert.match(dataModel, /LIVE/);
  assert.match(dataModel, /BACKFILL/);
  assert.match(dataModel, /Recoverable transport gap/);
  assert.match(dataModel, /Acquisition gap/);
  assert.match(dataModel, /Retention-expired gap/);
  assert.match(dataModel, /Unknown gap/);
  assert.match(dataModel, /DETECTABLE_GAP != RECOVERABLE_GAP/);
});

test('Partner Connection Signal seam stays distinct from CGM semantic ownership', () => {
  assert.match(readme, /VexPartner<Partner>/);
  assert.match(readme, /Connection<Partner, Signal>/);
  assert.doesNotMatch(readme, /CgmDeviceFamily\.Signal/);
  assert.match(charter, /CONNECTION STATE != SIGNAL/);
  assert.match(charter, /SIGNAL != FAMILY STATE/);
  assert.match(charter, /SIGNAL RECEIVED != STATE CHANGED/);
  assert.match(dataModel, /Connection<Signal>/);
});

test('Lab pressures G01-G30 over one transport-neutral model', () => {
  for (let n = 1; n <= 30; n += 1) {
    const ref = `G${String(n).padStart(2, '0')}`;
    assert.match(lab, new RegExp(ref));
  }
  assert.match(lab, /TRANSPORT_CHANGED/);
  assert.match(lab, /CGM_SEMANTIC_RESULT_UNCHANGED/);
  assert.match(lab, /CURRENT_LIVE_MEASUREMENT/);
  assert.match(lab, /COMPLETE_HISTORY/);
});

test('Local HTTP comes before BLE while preserving one Signal seam', () => {
  const wifi = byRef.get('work.vex-cgm-labs.wifi-realization');
  const reader = byRef.get('work.vex-cgm-labs.android-reader-seam');
  const ble = byRef.get('work.vex-cgm-labs.ble-realization');

  assert.equal(wifi.state, 'DECOMPOSED');
  assert.equal(reader.priorityClass, 'IMMEDIATE');
  assert.equal(ble.state, 'WAITING_DEPENDENCIES');
  assert.ok(ble.dependencyRefs.includes(wifi.workRef));
  assert.ok(ble.dependencyRefs.includes(reader.workRef));
  assert.ok(ble.dependencyRefs.includes('work.vex-cgm-labs.continuity-reconciliation'));
});

test('Design Trace maps practicum requirements to patterns, source and verification', () => {
  assert.match(trace, /REQ-CGM-CONTINUITY-001/);
  assert.match(trace, /pattern\.cgm\.acquisition-observation-separation/);
  assert.match(trace, /actual source owner/);
  assert.match(trace, /verification source/);
  assert.match(trace, /VEX_REQUIREMENT_REF != REQUIREMENT AUTHORITY/);
  assert.match(trace, /VEXBOARD != TRACEABILITY AUTHORITY/);
  assert.ok(byRef.has('work.vex-cgm-labs.design-trace-practicum'));
});

test('Cloud and Full Security are later integrations rather than CGM owners', () => {
  const cloud = byRef.get('work.vex-cgm-labs.cloud-connectivity-integration');
  const security = byRef.get('work.vex-cgm-labs.full-security-integration');

  assert.equal(cloud.state, 'WAITING_DEPENDENCIES');
  assert.equal(security.state, 'WAITING_DEPENDENCIES');
  assert.ok(cloud.sourceRefs.includes('github.pull.vexwork.257'));
  assert.ok(security.sourceRefs.includes('github.pull.vexwork.256'));
});


test('Partner foundation survives execution ordering and Room restart pressure without ownership collapse', () => {
  const model = byRef.get('work.vex-cgm-labs.data-model-foundation');

  assert.match(charter, /VexPartner<Partner>[\s\S]*Source<Partner>[\s\S]*Conversion<Input, Partner, Signal>[\s\S]*Receiver<Partner, Signal, exact Observation>/);
  assert.match(charter, /suspend Receiver\.receive/);
  assert.match(charter, /CgmPartner\.Connection\.BleDecoder[\s\S]*CgmPartner\.Connection\.HttpDecoder/);
  assert.match(charter, /BLE_SIGNAL_MEANING == HTTP_SIGNAL_MEANING/);
  assert.match(charter, /Connection\.Id[\s\S]*!= VexExecution RelationshipId/);
  assert.match(charter, /inbound Partner receipt\/admission[\s\S]*private runtime RelationshipId[\s\S]*Queued/);
  assert.match(charter, /Store -> Family observation[\s\S]*VexExecution\.observe/);
  assert.match(charter, /Begin\(Queued · Effect\.RequestPumpDelivery\)/);
  assert.match(charter, /RoomCgmStore[\s\S]*cgm_partner_observation/);
  assert.match(charter, /ENTITY_RESTORED != PARTNER_SIGNAL_RECEIVED/);
  assert.match(charter, /PROCESS_RESTART != NEW_SOURCE_HISTORY/);
  assert.match(charter, /generated Room v6 schema JSON/);
  assert.match(model.purpose, /Room-backed CgmStore persistence/i);
  assert.match(model.purpose, /Connection\.Conversion<Input -> Signal\(s\)>/i);
  assert.match(model.purpose, /BLE-like ByteArray/i);
  assert.match(model.purpose, /HTTP-like response/i);
  assert.match(model.purpose, /Gradle\/KSP\/schema\/migration\/instrumentation proof/i);
  assert.ok(model.sourceRefs.includes('github.pull.vexlife-android.219'));
});

test('Partner VexBoard Depth keeps queued runtime coordination distinct from durable provenance', () => {
  const projection = byRef.get('work.vex-cgm-labs.vexboard-design-trace-projection');
  const lab = byRef.get('work.vex-cgm-labs.lab-experience');

  assert.match(charter, /queued inbound VexExecution/i);
  assert.match(charter, /six source-proven PARTNER_CIRCUIT controls[\s\S]*zero held controls/i);
  assert.match(charter, /twelve[\s\S]*Behavior\/Depth layouts[\s\S]*zero detected collisions/i);
  assert.equal(projection.state, 'WAITING_DEPENDENCIES');
  assert.ok(projection.sourceRefs.includes('github.pull.vexwork.276'));
  assert.ok(projection.sourceRefs.includes('github.pull.vexlife-android.219'));
  assert.match(projection.purpose, /queued inbound VexExecution/);
  assert.match(projection.purpose, /six PARTNER_CIRCUIT pathways/);
  assert.match(projection.purpose, /concrete Conversion/);
  assert.match(projection.purpose, /Partner Source/);
  assert.match(lab.purpose, /Room-backed CgmStore/);
  assert.match(lab.purpose, /queued Connection admission/i);
  assert.match(lab.purpose, /BLE-like and HTTP-like provider controls/);
});

test('accepted VexBoard Partner projector is durable source while draft Android stays held', () => {
  const projection = byRef.get('work.vex-cgm-labs.vexboard-design-trace-projection');
  const accepted = 'git.commit.vexwork.e24af6945eb8560c63070b2e32bb43913c042fba';

  assert.ok(project.sourceRefs.includes(accepted));
  assert.ok(segment.sourceRefs.includes(accepted));
  assert.ok(projection.sourceRefs.includes(accepted));
  assert.match(projection.purpose, /accepted VexBoard Partner projector/);
  assert.equal(projection.state, 'WAITING_DEPENDENCIES');
  assert.match(projection.purpose, /Android #219 receives repository proof\/acceptance/);
  assert.match(charter, /VexBoard PR #276 is now merged as accepted projector infrastructure/);
  assert.match(charter, /does not repin the Lens to draft Android #219/);
});

// [VXG RealForever][VEX-CGM-LABS][PROJECT]

test('architecture charter preserves the external-signal causal sequence while keeping superseded hypotheses held', () => {
  assert.match(charter, /VEXCGMLABS PARTNER ARCHITECTURE STABILITY POINT/);
  assert.match(charter, /VexSignal\.Of<Meaning>\s+= HELD/);
  assert.match(charter, /VexEntity\.Of<Meaning>\s+= HELD/);
  assert.match(charter, /EntityForm<Domain, Entity>\s+= HELD/);
  assert.match(charter, /CGM[\s\S]*CONNECTED PEN[\s\S]*INSULIN PUMP/);
  assert.match(charter, /PRODUCTION_ORDER != DELIVERY_ORDER/);
  assert.match(charter, /SIGNAL_OBSERVED != SIGNAL_ADMITTED/);
  assert.match(charter, /SIGNAL_ADMITTED != DURABLE_COMMIT/);
  assert.match(charter, /LATEST_OBSERVED != CONTINUITY_FRONTIER/);
  assert.match(charter, /ENTITY_RESTORED != DEVICE_SIGNAL_RECEIVED/);
  assert.match(charter, /displayStateFor\(State\)/);
  assert.match(charter, /semantic boundary duality/);
});

test('durable continuity work reuses existing Work instead of inventing a duplicate task', () => {
  const model = byRef.get('work.vex-cgm-labs.data-model-foundation');
  const continuity = byRef.get('work.vex-cgm-labs.continuity-reconciliation');

  assert.equal(model.state, 'RUNNING');
  assert.match(model.label, /Partner \/ Signal \/ Store \/ Family circuit/i);
  assert.match(continuity.label, /Signal continuity and integrity/i);
  assert.doesNotMatch(model.purpose, /VexSignal\.Of<.*is accepted/i);
  assert.match(model.purpose, /connected-pen/i);
  assert.match(model.purpose, /insulin pump/i);
  assert.match(model.purpose, /file-backed close\/reopen reconstruction/i);
  assert.ok(model.sourceRefs.includes('projects/vex-cgm-labs/POC-ARCHITECTURE-CHARTER.md'));
  assert.ok(continuity.sourceRefs.includes('projects/vex-cgm-labs/POC-ARCHITECTURE-CHARTER.md'));
});

test('project source map includes the Partner architecture charter without granting effects', () => {
  assert.ok(project.sourceRefs.includes('projects/vex-cgm-labs/POC-ARCHITECTURE-CHARTER.md'));
  for (const item of segment.items) {
    assert.equal(item.authorityDisposition, 'NO_AUTHORITY');
    assert.equal(item.effectDisposition, 'NO_EFFECTS');
  }
});
