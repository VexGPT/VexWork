import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { verifySemanticFingerprint } from '../src/core/semantic.mjs';
import {
  VEXLIFE_PROD_ARCHITECTURE_PROJECTOR_REF,
  projectVexLifeProdArchitecture,
} from '../src/core/vexboard-vexlife-prod-architecture-projector.mjs';

const read = (relative) =>
  JSON.parse(
    fs.readFileSync(
      new URL(`../${relative}`, import.meta.url),
      'utf8',
    ),
  );

const fixture =
  read(
    'test/fixtures/vexlife-prod/heretic-runtime-availability-eb183125.architecture.json',
  );

const sourceRevisionRef =
  'github.commit.vexlife-prod.eb1831258ab9cf736e523f85a754d0381b3ec897';

test('VexLife-Prod runtime availability projection is read-only and preserves exact source identities', () => {
  const first =
    projectVexLifeProdArchitecture({
      architecture: fixture,
      sourceRevisionRef,
      boardRef: 'board.vexlife-prod.heretic-runtime-availability',
    });
  const second =
    projectVexLifeProdArchitecture({
      architecture: fixture,
      sourceRevisionRef,
      boardRef: 'board.vexlife-prod.heretic-runtime-availability',
    });

  assert.deepEqual(first, second);
  assert.equal(first.projectorRef, VEXLIFE_PROD_ARCHITECTURE_PROJECTOR_REF);
  assert.deepEqual(first.effects, {
    sourceMutationPerformed: false,
    externalEffectsPerformed: false,
  });
  assert.equal(verifySemanticFingerprint(first.graph), true);
  assert.equal(verifySemanticFingerprint(first.projection), true);
  assert.equal(first.graph.sourceRefs.includes(sourceRevisionRef), true);

  const family =
    first.graph.nodes.find(
      (node) =>
        node.nodeRef ===
        'family.vexlife-prod.heretic-runtime-availability',
    );
  assert.equal(family.kind, 'REFERENCE');
  assert.match(family.label, /^Family · Heretic runtime availability$/);
  assert.equal(family.sourceRefs.includes(sourceRevisionRef), true);

  const control =
    first.graph.nodes.find(
      (node) =>
        node.nodeRef ===
        'control.vexlife-prod.heretic-runtime-availability.ensure-available',
    );
  assert.equal(control.kind, 'CONTROL');
  assert.match(control.label, /^Control · Ensure available$/);
});

test('VexLife-Prod adapter preserves the branch semantics without inventing missing relationships', () => {
  const projected =
    projectVexLifeProdArchitecture({
      architecture: fixture,
      sourceRevisionRef,
      boardRef: 'board.vexlife-prod.heretic-runtime-availability',
    });

  const relation = (suffix) =>
    projected.graph.relationships.find(
      (entry) =>
        entry.relationshipRef ===
        `relationship.vexlife-prod.heretic-runtime-availability.${suffix}`,
    );

  assert.equal(
    relation('family.admits.borrowed-qualified').kind,
    'TRANSITION',
  );
  assert.match(
    relation('family.admits.borrowed-qualified').labelOrNull,
    /^ADMITS_WITHOUT_PRODUCT_EFFECT · /,
  );

  assert.equal(
    relation('family.requests.ensure-product-owned').kind,
    'FLOW',
  );
  assert.match(
    relation('family.requests.ensure-product-owned').labelOrNull,
    /^REQUESTS_IF_ACQUISITION_ALLOWED · /,
  );

  assert.equal(
    relation('family.requests.observe-product-owned').kind,
    'FLOW',
  );
  assert.match(
    relation('family.requests.observe-product-owned').labelOrNull,
    /^REQUESTS_IF_OBSERVATION_ONLY · /,
  );

  assert.equal(
    relation('setup.delegates-to.product-runtime-owner').kind,
    'REFERENCE',
  );

  assert.equal(
    projected.graph.relationships.length,
    fixture.relationships.length,
  );
  assert.deepEqual(
    new Set(projected.graph.relationships.map((entry) => entry.relationshipRef)),
    new Set(fixture.relationships.map((entry) => entry.relationshipRef)),
  );
});

test('VexLife-Prod adapter fails closed on unsupported source meaning instead of guessing', () => {
  const unknownRole = structuredClone(fixture);
  unknownRole.nodes[0].role = 'PROCESS_STAGE';

  assert.throws(
    () =>
      projectVexLifeProdArchitecture({
        architecture: unknownRole,
        sourceRevisionRef,
        boardRef: 'board.vexlife-prod.heretic-runtime-availability',
      }),
    /unsupported VexLife-Prod architecture role/,
  );

  const unknownRelationship = structuredClone(fixture);
  unknownRelationship.relationships[0].relationshipClass =
    'MAGIC_CONVERGENCE';

  assert.throws(
    () =>
      projectVexLifeProdArchitecture({
        architecture: unknownRelationship,
        sourceRevisionRef,
        boardRef: 'board.vexlife-prod.heretic-runtime-availability',
      }),
    /unsupported VexLife-Prod architecture relationshipClass/,
  );

  const effectful = structuredClone(fixture);
  effectful.externalEffectsPerformed = true;

  assert.throws(
    () =>
      projectVexLifeProdArchitecture({
        architecture: effectful,
        sourceRevisionRef,
        boardRef: 'board.vexlife-prod.heretic-runtime-availability',
      }),
    /must remain effect-free/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][VEXLIFE-PROD][ARCHITECTURE-PROJECTOR-TEST]
