import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  normalizeScreenLens,
  pathwayForElement,
} from '../src/shared/vexboard-screen-lens.mjs';

const source = () => ({
  schemaVersion: 'vexboard.screen-lens/v1',
  lensRef: 'lens.relationship-projection.fixture',
  title: 'Relationship projection fixture',
  entryScreenRef: 'screen.relationship-projection',
  entryElementRef: 'element.relationship-projection.timeline',
  chrome: [],
  screens: [{
    screenRef: 'screen.relationship-projection',
    label: 'Relationship projection',
    placement: 'PRIMARY',
    mapped: 'MAPPED',
    elements: [{
      ref: 'element.relationship-projection.timeline',
      kind: 'STACK',
      label: 'Timeline',
      pathwayRef: 'pathway.relationship-projection.history',
    }],
  }],
  pathways: [{
    pathwayRef: 'pathway.relationship-projection.history',
    label: 'Project one historical relationship',
    disposition: 'RELATIONSHIP_PROJECTION',
    summary: 'Existing relationship truth is projected read-only without minting a Family or Partner.',
    returns: 'one bounded outward projection',
    returnRef: 'relationship-projection.history.projection',
    nodes: [
      {
        ref: 'relationship-projection.history.binding',
        face: 'DEPTH',
        role: 'REALIZATION',
        label: 'Immutable relationship binding',
      },
      {
        ref: 'relationship-projection.history.store',
        face: 'DEPTH',
        role: 'STORE',
        label: 'Current outside custody',
      },
      {
        ref: 'relationship-projection.history.observation',
        face: 'DEPTH',
        role: 'OBSERVATION',
        label: 'Current read-only observation',
      },
      {
        ref: 'relationship-projection.history.projection',
        face: 'BEHAVIOR',
        role: 'PROJECTION',
        label: 'Human-facing relationship projection',
      },
    ],
    edges: [
      {
        from: 'relationship-projection.history.binding',
        to: 'relationship-projection.history.store',
        kind: 'DATA',
        label: 'addresses',
      },
      {
        from: 'relationship-projection.history.store',
        to: 'relationship-projection.history.observation',
        kind: 'RETURN',
        label: 're-observed',
      },
      {
        from: 'relationship-projection.history.observation',
        to: 'relationship-projection.history.projection',
        kind: 'RETURN',
        label: 'project',
      },
    ],
  }],
  annotations: [],
});

test('read-only relationship projection keeps existing owners visible without inventing Family or Partner semantics', () => {
  const lens = normalizeScreenLens(source());
  const pathway = pathwayForElement(lens, 'element.relationship-projection.timeline');

  assert.equal(pathway.disposition, 'RELATIONSHIP_PROJECTION');
  assert.equal(pathway.returnRef, 'relationship-projection.history.projection');
  assert.deepEqual(
    pathway.nodes.map((node) => node.role),
    ['REALIZATION', 'STORE', 'OBSERVATION', 'PROJECTION'],
  );
});

test('relationship projection fails closed when it claims Family or Partner roles', () => {
  for (const role of ['CONTROL', 'STATE', 'ACT', 'EFFECT', 'PARTNER', 'SOURCE', 'SIGNAL', 'CONNECTION']) {
    const input = source();
    input.pathways[0].nodes.push({
      ref: `relationship-projection.history.forbidden-${role.toLowerCase()}`,
      face: role === 'CONTROL' || role === 'STATE' || role === 'ACT' || role === 'EFFECT'
        ? 'BEHAVIOR'
        : 'DEPTH',
      role,
      label: `Forbidden ${role}`,
    });
    assert.throws(
      () => normalizeScreenLens(input),
      /RELATIONSHIP_PROJECTION may not claim Family or Partner roles/,
      role,
    );
  }
});

test('the Lens reader names relationship projections without a Product-specific rendering branch', () => {
  const html = fs.readFileSync(new URL('../vexboard/lens.html', import.meta.url), 'utf8');
  assert.match(html, /RELATIONSHIP_PROJECTION:\s*'Relationship projection'/);
  assert.match(html, /Lens\.PATHWAY_DISPOSITIONS\[pathway\.disposition\]/);
});

test('relationship projection has exactly one explicit outward Projection return', () => {
  const missingProjection = source();
  missingProjection.pathways[0].nodes.find(
    (node) => node.ref === 'relationship-projection.history.projection',
  ).role = 'OBSERVATION';
  assert.throws(
    () => normalizeScreenLens(missingProjection),
    /RELATIONSHIP_PROJECTION needs exactly one PROJECTION node/,
  );

  const wrongReturn = source();
  wrongReturn.pathways[0].returnRef = 'relationship-projection.history.observation';
  assert.throws(
    () => normalizeScreenLens(wrongReturn),
    /RELATIONSHIP_PROJECTION returnRef must name its PROJECTION node/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][RELATIONSHIP-PROJECTION]
