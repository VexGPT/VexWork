import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PRIMARY_DRAG_THRESHOLD_PX,
  cameraFromPointerDrag,
  dragExceededThreshold,
  shouldStartCanvasPan,
} from '../vexboard/ui/interaction.mjs';

test('Select mode pans only from empty canvas while Pan mode always admits primary drag', () => {
  assert.equal(shouldStartCanvasPan({ tool: 'SELECT', targetIsShape: false }), true);
  assert.equal(shouldStartCanvasPan({ tool: 'SELECT', targetIsShape: true }), false);
  assert.equal(shouldStartCanvasPan({ tool: 'PAN', targetIsShape: true }), true);
  assert.equal(shouldStartCanvasPan({ tool: 'PAN', targetIsShape: false, button: 1 }), false);
});

test('drag threshold separates an ordinary click from camera traversal', () => {
  assert.equal(PRIMARY_DRAG_THRESHOLD_PX, 4);
  assert.equal(dragExceededThreshold({ x: 10, y: 10 }, { x: 12, y: 12 }), false);
  assert.equal(dragExceededThreshold({ x: 10, y: 10 }, { x: 14, y: 10 }), true);
});

test('camera drag preserves zoom and moves only viewport coordinates', () => {
  assert.deepEqual(cameraFromPointerDrag(
    { x: 40, y: 60, zoom: 0.75 },
    { x: 100, y: 100 },
    { x: 130, y: 85 },
  ), { x: 70, y: 45, zoom: 0.75 });
});
