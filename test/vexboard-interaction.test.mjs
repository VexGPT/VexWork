import assert from 'node:assert/strict';
import test from 'node:test';

import {
  INTERACTION_PLANES,
  PRIMARY_DRAG_THRESHOLD_PX,
  cameraFromPointerDrag,
  dragExceededThreshold,
  interactionPlaneForTarget,
  objectPositionFromPointerDrag,
  pointerGestureFromMovement,
  shouldStartCanvasPan,
  shouldStartObjectMove,
} from '../vexboard/ui/interaction.mjs';

test('interaction planes keep canvas navigation separate from object, overlay and chrome input', () => {
  assert.equal(shouldStartCanvasPan({ tool: 'SELECT', targetPlane: INTERACTION_PLANES.CANVAS }), true);
  assert.equal(shouldStartCanvasPan({ tool: 'SELECT', targetPlane: INTERACTION_PLANES.OBJECT }), false);
  assert.equal(shouldStartCanvasPan({ tool: 'SELECT', targetPlane: INTERACTION_PLANES.CHROME }), false);
  assert.equal(shouldStartCanvasPan({ tool: 'SELECT', targetPlane: INTERACTION_PLANES.OVERLAY }), false);

  assert.equal(shouldStartCanvasPan({ tool: 'PAN', targetPlane: INTERACTION_PLANES.CANVAS }), true);
  assert.equal(shouldStartCanvasPan({ tool: 'PAN', targetPlane: INTERACTION_PLANES.OBJECT }), true);
  assert.equal(shouldStartCanvasPan({ tool: 'PAN', targetPlane: INTERACTION_PLANES.CHROME }), false);
  assert.equal(shouldStartCanvasPan({ tool: 'PAN', targetPlane: INTERACTION_PLANES.OVERLAY }), false);
  assert.equal(shouldStartCanvasPan({ tool: 'PAN', targetPlane: INTERACTION_PLANES.CANVAS, button: 1 }), false);

  // Keep the original proving-call shape compatible while the browser migrates to explicit planes.
  assert.equal(shouldStartCanvasPan({ tool: 'SELECT', targetIsShape: false }), true);
  assert.equal(shouldStartCanvasPan({ tool: 'SELECT', targetIsShape: true }), false);
});

test('DOM interaction-plane lookup defaults only unmarked board surface to canvas', () => {
  const chromeTarget = {
    closest(selector) {
      assert.equal(selector, '[data-vexboard-plane]');
      return { dataset: { vexboardPlane: INTERACTION_PLANES.CHROME } };
    },
  };
  const objectTarget = {
    closest() {
      return { dataset: { vexboardPlane: INTERACTION_PLANES.OBJECT } };
    },
  };
  const unmarkedTarget = { closest: () => null };
  const malformedTarget = {
    closest: () => ({ dataset: { vexboardPlane: 'MYSTERY' } }),
  };

  assert.equal(interactionPlaneForTarget(chromeTarget), INTERACTION_PLANES.CHROME);
  assert.equal(interactionPlaneForTarget(objectTarget), INTERACTION_PLANES.OBJECT);
  assert.equal(interactionPlaneForTarget(unmarkedTarget), INTERACTION_PLANES.CANVAS);
  assert.equal(interactionPlaneForTarget(malformedTarget), INTERACTION_PLANES.CANVAS);
  assert.equal(interactionPlaneForTarget(null), INTERACTION_PLANES.CANVAS);
});

test('drag threshold keeps pointer intent pending until movement is materially a drag', () => {
  assert.equal(PRIMARY_DRAG_THRESHOLD_PX, 4);
  assert.equal(dragExceededThreshold({ x: 10, y: 10 }, { x: 12, y: 12 }), false);
  assert.equal(pointerGestureFromMovement({ x: 10, y: 10 }, { x: 12, y: 12 }), 'CLICK');
  assert.equal(dragExceededThreshold({ x: 10, y: 10 }, { x: 14, y: 10 }), true);
  assert.equal(pointerGestureFromMovement({ x: 10, y: 10 }, { x: 14, y: 10 }), 'DRAG');
});

test('object movement is admitted only for an editable unlocked object in Select mode', () => {
  const base = {
    tool: 'SELECT',
    editable: true,
    locked: false,
    targetPlane: INTERACTION_PLANES.OBJECT,
  };
  assert.equal(shouldStartObjectMove(base), true);
  assert.equal(shouldStartObjectMove({ ...base, tool: 'PAN' }), false);
  assert.equal(shouldStartObjectMove({ ...base, editable: false }), false);
  assert.equal(shouldStartObjectMove({ ...base, locked: true }), false);
  assert.equal(shouldStartObjectMove({ ...base, targetPlane: INTERACTION_PLANES.CHROME }), false);
  assert.equal(shouldStartObjectMove({ ...base, button: 2 }), false);
});

test('camera drag preserves zoom and moves only viewport coordinates', () => {
  assert.deepEqual(cameraFromPointerDrag(
    { x: 40, y: 60, zoom: 0.75 },
    { x: 100, y: 100 },
    { x: 130, y: 85 },
  ), { x: 70, y: 45, zoom: 0.75 });
});

test('object drag resolves board coordinates through the camera zoom', () => {
  assert.deepEqual(objectPositionFromPointerDrag(
    { x: 200, y: 80 },
    { x: 100, y: 100 },
    { x: 130, y: 85 },
    0.5,
  ), { x: 260, y: 50 });

  assert.throws(
    () => objectPositionFromPointerDrag({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }, 0),
    /zoom must be positive/,
  );
});
