import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  createCameraAnimator,
  easeCameraProgress,
  interpolateCamera,
} from '../vexboard/ui/camera-animation.mjs';

function frameHarness() {
  let nextId = 1;
  const callbacks = new Map();
  const cancelled = [];
  return {
    cancelled,
    requestFrame(callback) {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    },
    cancelFrame(id) {
      cancelled.push(id);
      callbacks.delete(id);
    },
    next() {
      const entry = callbacks.entries().next();
      if (entry.done) return null;
      const [id, callback] = entry.value;
      callbacks.delete(id);
      return { id, callback };
    },
    pendingCount() {
      return callbacks.size;
    },
  };
}

function cameraNormalizer(input) {
  const camera = {
    x: Number(input.x),
    y: Number(input.y),
    zoom: Math.max(0.2, Math.min(3, Number(input.zoom))),
  };
  if (!Object.values(camera).every(Number.isFinite)) throw new Error('invalid camera');
  return camera;
}

test('camera interpolation is bounded, deterministic view math', () => {
  const from = { x: 0, y: 20, zoom: 1 };
  const to = { x: 100, y: -20, zoom: 2 };
  assert.deepEqual(interpolateCamera(from, to, -1), from);
  assert.deepEqual(interpolateCamera(from, to, 0.5), { x: 50, y: 0, zoom: 1.5 });
  assert.deepEqual(interpolateCamera(from, to, 2), to);
  assert.equal(easeCameraProgress(0), 0);
  assert.equal(easeCameraProgress(0.5), 0.875);
  assert.equal(easeCameraProgress(1), 1);
  assert.throws(() => interpolateCamera(null, to, 0.5), /fromCamera must be an object/);
  assert.throws(() => interpolateCamera([], to, 0.5), /fromCamera must be an object/);
  assert.throws(() => interpolateCamera(from, { ...to, zoom: 0 }, 0.5), /zoom must be positive/);
  assert.throws(() => easeCameraProgress(Number.NaN), /progress must be finite/);
});

test('camera animator eases toward the target and completes at exact normalized camera state', () => {
  const frames = frameHarness();
  let camera = { x: 0, y: 0, zoom: 1 };
  const animator = createCameraAnimator({
    normalizeCamera: cameraNormalizer,
    readCamera: () => camera,
    writeCamera: (next) => { camera = next; },
    requestFrame: frames.requestFrame,
    cancelFrame: frames.cancelFrame,
    now: () => 100,
    durationMs: 100,
  });

  assert.equal(animator.animateTo({ x: 100, y: 40, zoom: 2 }), true);
  assert.equal(animator.isAnimating(), true);
  const first = frames.next();
  first.callback(150);
  assert.deepEqual(camera, { x: 87.5, y: 35, zoom: 1.875 });
  assert.equal(frames.pendingCount(), 1);
  const second = frames.next();
  second.callback(200);
  assert.deepEqual(camera, { x: 100, y: 40, zoom: 2 });
  assert.equal(animator.isAnimating(), false);
});

test('manual camera input interrupts an in-flight focus without stale frame overwrite', () => {
  const frames = frameHarness();
  let camera = { x: 0, y: 0, zoom: 1 };
  const animator = createCameraAnimator({
    normalizeCamera: cameraNormalizer,
    readCamera: () => camera,
    writeCamera: (next) => { camera = next; },
    requestFrame: frames.requestFrame,
    cancelFrame: frames.cancelFrame,
    now: () => 0,
    durationMs: 100,
  });

  animator.animateTo({ x: 100, y: 100, zoom: 2 });
  const first = frames.next();
  first.callback(25);
  const stale = frames.next();
  assert.ok(camera.x > 0 && camera.x < 100);

  animator.jumpTo({ x: -20, y: 30, zoom: 0.5 });
  assert.deepEqual(camera, { x: -20, y: 30, zoom: 0.5 });
  assert.deepEqual(frames.cancelled, [stale.id]);
  assert.equal(animator.isAnimating(), false);

  stale.callback(100);
  assert.deepEqual(camera, { x: -20, y: 30, zoom: 0.5 });
});

test('reduced motion, zero duration, and no-op targets preserve meaning without animation', () => {
  for (const options of [
    { durationMs: 100, prefersReducedMotion: () => true },
    { durationMs: 0, prefersReducedMotion: () => false },
  ]) {
    const frames = frameHarness();
    let camera = { x: 0, y: 0, zoom: 1 };
    const animator = createCameraAnimator({
      normalizeCamera: cameraNormalizer,
      readCamera: () => camera,
      writeCamera: (next) => { camera = next; },
      requestFrame: frames.requestFrame,
      cancelFrame: frames.cancelFrame,
      now: () => 0,
      ...options,
    });
    assert.equal(animator.animateTo({ x: 40, y: 50, zoom: 1.5 }), false);
    assert.deepEqual(camera, { x: 40, y: 50, zoom: 1.5 });
    assert.equal(frames.pendingCount(), 0);
  }

  const frames = frameHarness();
  let camera = { x: 1, y: 2, zoom: 1 };
  const animator = createCameraAnimator({
    normalizeCamera: cameraNormalizer,
    readCamera: () => camera,
    writeCamera: (next) => { camera = next; },
    requestFrame: frames.requestFrame,
    cancelFrame: frames.cancelFrame,
    now: () => 0,
  });
  assert.equal(animator.animateTo({ ...camera }), false);
  assert.equal(frames.pendingCount(), 0);
  assert.throws(() => createCameraAnimator({
    normalizeCamera: cameraNormalizer,
    readCamera: () => camera,
    writeCamera: () => {},
    requestFrame: frames.requestFrame,
    cancelFrame: frames.cancelFrame,
    now: () => 0,
    durationMs: -1,
  }), /durationMs must be non-negative/);
});

test('VexBoard UI animates semantic focus, honors reduced motion, and cancels on manual input', async () => {
  const page = await readFile(new URL('../vexboard/index.html', import.meta.url), 'utf8');
  assert.match(page, /import \{ createCameraAnimator \} from '\.\/ui\/camera-animation\.mjs';/);
  assert.match(page, /prefersReducedMotion:\(\)=>Boolean\(reducedMotion\?\.matches\)/);
  assert.match(page, /function focusSelected\(\{animate=false\}=\{\}\)/);
  assert.match(page, /cameraAnimator\.animateTo\(targetCamera\)/);
  assert.equal((page.match(/focusSelected\(\{animate:true\}\)/g) || []).length, 3);
  assert.match(page, /view\.onpointerdown=\(e\)=>\{cameraAnimator\.cancel\(\);/);
  assert.match(page, /s\.onpointerdown=\(e\)=>\{cameraAnimator\.cancel\(\);/);
  assert.match(page, /function fitBoard\(\).*cameraAnimator\.jumpTo/s);
  assert.match(page, /function zoomBy\(.*cameraAnimator\.jumpTo/s);
  const journeyLine = page.split('\n').find((line) => line.startsWith('function applyJourney('));
  assert.ok(journeyLine);
  assert.doesNotMatch(journeyLine, /cameraAnimator\.jumpTo/);
});
