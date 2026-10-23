import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  OPERATING_DOMAIN_PROJECTION_SCHEMA,
  createOperatingDomain,
  projectOperatingDomain,
} from '../src/core/operating-domain.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');
const source = read('projects/vexwork-operational-console/vexsite-operating-domain.json');
const commerceSource = read('projects/vexwork-operational-console/commerce-operating-domain.json');

function create(value = source) {
  return createOperatingDomain(value, { repositoryRegistry, processRegistry });
}

test('VexSite patient zero composes accepted domain owners without becoming authority', () => {
  const domain = create();
  const projection = projectOperatingDomain(domain);

  assert.equal(domain.domainRef, 'domain.vextreme.vexsite.localization');
  assert.deepEqual(domain.repositoryRefs, ['repo.vextreme', 'repo.vexwork']);
  assert.equal(domain.effects, false);
  assert.equal(domain.executionAuthority, 'NONE');

  assert.equal(projection.schemaVersion, OPERATING_DOMAIN_PROJECTION_SCHEMA);
  assert.deepEqual(projection.summary, {
    capabilityCount: 2,
    populationCount: 1,
    lensCount: 1,
    processCount: 1,
    attentionQueueCount: 0,
  });
  assert.equal(projection.effects, false);
  assert.equal(projection.executionAuthority, 'NONE');

  const population = projection.populations[0];
  assert.equal(population.populationRef, 'population.vextreme.vexsite.pages');
  assert.equal(population.ownerRepositoryRef, 'repo.vextreme');

  const lens = projection.lenses[0];
  assert.equal(lens.lensRef, 'lens.vextreme.vexsite.localization');
  assert.equal(lens.populationRef, population.populationRef);
  assert.equal(lens.ownerRepositoryRef, 'repo.vexwork');

  const process = projection.processes[0];
  assert.equal(process.processRef, 'process.vexwork.promote-derived-concern');
  assert.equal(process.ownerRepositoryRef, 'repo.vexwork');

  assert.deepEqual(projection.attentionQueues, []);
});

test('semantic fingerprint is stable across input ordering differences', () => {
  const left = create();
  const reordered = structuredClone(source);
  reordered.repositoryRefs.reverse();
  reordered.capabilities.reverse();
  reordered.capabilities[0].sourceRefs.reverse();
  reordered.sourceRefs.reverse();

  const right = create(reordered);

  assert.equal(left.semanticFingerprint, right.semanticFingerprint);
  assert.deepEqual(left, right);
});

test('binding owner must be a known repository and included in domain repositories', () => {
  const unknown = structuredClone(source);
  unknown.capabilities[0].ownerRepositoryRef = 'repo.not-registered';
  assert.throws(() => create(unknown), /unknown repositoryRef repo\.not-registered/);

  const omitted = structuredClone(source);
  omitted.repositoryRefs = ['repo.vextreme'];
  assert.throws(() => create(omitted), /binding owner repo\.vexwork must be included in repositoryRefs/);
});

test('Lens cannot point to a population the domain did not bind', () => {
  const value = structuredClone(source);
  value.lenses[0].populationRef = 'population.vextreme.some-other-pages';
  assert.throws(
    () => create(value),
    /lens lens\.vextreme\.vexsite\.localization references unbound population population\.vextreme\.some-other-pages/,
  );
});

test('Process binding must agree with Process Map ownership', () => {
  const value = structuredClone(source);
  value.processes[0].ownerRepositoryRef = 'repo.vextreme';
  assert.throws(() => create(value), /process owner mismatch for process\.vexwork\.promote-derived-concern/);
});

test('duplicate binding identities fail closed', () => {
  const value = structuredClone(source);
  value.capabilities.push(structuredClone(value.capabilities[0]));
  assert.throws(() => create(value), /capability refs must be unique/);
});

test('unknown authority-shaped fields cannot silently enter a domain binding', () => {
  const value = structuredClone(source);
  value.capabilities[0].executionAuthority = 'WRITE_SOURCE';
  assert.throws(() => create(value), /capability binding has unexpected fields/);
});

test('domain root also rejects hidden authority fields', () => {
  const value = structuredClone(source);
  value.executionAuthority = 'WRITE_SOURCE';
  assert.throws(() => create(value), /operating domain has unexpected fields/);
});

test('stored semantic fingerprint is verified rather than silently rewritten', () => {
  const current = create();
  const tampered = structuredClone(current);
  tampered.label = 'Tampered label';
  assert.throws(() => create(tampered), /operating domain semanticFingerprint mismatch/);
});


test('Commerce reuses the Operating Domain contract without schema evolution', () => {
  const domain = createOperatingDomain(commerceSource, { repositoryRegistry, processRegistry });
  const projection = projectOperatingDomain(domain);

  assert.equal(domain.domainRef, 'domain.vexwork.operational-console.commerce');
  assert.deepEqual(domain.repositoryRefs, ['repo.vexcommerce-storefront-reference', 'repo.vexwork']);
  assert.deepEqual(projection.summary, {
    capabilityCount: 3,
    populationCount: 1,
    lensCount: 4,
    processCount: 1,
    attentionQueueCount: 1,
  });
  assert.equal(projection.populations[0].populationRef, 'population.vexcommerce.reference.items');
  assert.deepEqual(projection.lenses.map((lens) => lens.lensRef), [
    'lens.vexwork.commerce.catalog-completeness',
    'lens.vexwork.commerce.fulfillment-attention',
    'lens.vexwork.commerce.inventory-integrity',
    'lens.vexwork.commerce.listing-readiness',
  ]);
  assert.equal(projection.processes[0].processRef, 'process.vexcommerce.manage-reference-storefront-item');
  assert.equal(projection.attentionQueues[0].queueRef, 'queue.vexwork.operational-console.commerce.fulfillment');
  assert.equal(projection.effects, false);
  assert.equal(projection.executionAuthority, 'NONE');
});

// [VXG RealForever][VEXWORK][OPERATING-DOMAIN]
