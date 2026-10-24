const CAMERA_KEYS = Object.freeze(['x', 'y', 'zoom']);

function finiteNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${label} must be finite`);
  return number;
}

function cameraValue(input, label) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error(`${label} must be an object`);
  }
  const camera = {
    x: finiteNumber(input.x, `${label}.x`),
    y: finiteNumber(input.y, `${label}.y`),
    zoom: finiteNumber(input.zoom, `${label}.zoom`),
  };
  if (camera.zoom <= 0) throw new Error(`${label}.zoom must be positive`);
  return camera;
}

function progressValue(input) {
  const progress = finiteNumber(input, 'progress');
  return Math.max(0, Math.min(1, progress));
}

function requiredFunction(value, label) {
  if (typeof value !== 'function') throw new Error(`${label} must be a function`);
  return value;
}

function sameCamera(left, right) {
  return CAMERA_KEYS.every((key) => left[key] === right[key]);
}

export function easeCameraProgress(input) {
  const progress = progressValue(input);
  return 1 - ((1 - progress) ** 3);
}

export function interpolateCamera(fromInput, toInput, progressInput) {
  const from = cameraValue(fromInput, 'fromCamera');
  const to = cameraValue(toInput, 'toCamera');
  const progress = progressValue(progressInput);
  return {
    x: from.x + ((to.x - from.x) * progress),
    y: from.y + ((to.y - from.y) * progress),
    zoom: from.zoom + ((to.zoom - from.zoom) * progress),
  };
}

export function createCameraAnimator({
  normalizeCamera,
  readCamera,
  writeCamera,
  requestFrame,
  cancelFrame,
  now,
  prefersReducedMotion = () => false,
  durationMs = 280,
} = {}) {
  const normalize = requiredFunction(normalizeCamera, 'normalizeCamera');
  const read = requiredFunction(readCamera, 'readCamera');
  const write = requiredFunction(writeCamera, 'writeCamera');
  const request = requiredFunction(requestFrame, 'requestFrame');
  const cancelFrameById = requiredFunction(cancelFrame, 'cancelFrame');
  const readNow = requiredFunction(now, 'now');
  const reducedMotion = requiredFunction(prefersReducedMotion, 'prefersReducedMotion');
  const duration = finiteNumber(durationMs, 'durationMs');
  if (duration < 0) throw new Error('durationMs must be non-negative');

  let activeFrameId = null;
  let generation = 0;

  function cancel() {
    generation += 1;
    if (activeFrameId !== null) cancelFrameById(activeFrameId);
    activeFrameId = null;
  }

  function apply(camera) {
    write(normalize(camera));
  }

  function jumpTo(targetInput) {
    const target = normalize(targetInput);
    cancel();
    apply(target);
    return false;
  }

  function animateTo(targetInput) {
    const target = normalize(targetInput);
    const origin = normalize(read());
    cancel();

    if (duration === 0 || reducedMotion() || sameCamera(origin, target)) {
      apply(target);
      return false;
    }

    const startedAt = finiteNumber(readNow(), 'now()');
    const animationGeneration = generation;

    const tick = (timestampInput) => {
      if (animationGeneration !== generation) return;
      const timestamp = finiteNumber(timestampInput, 'animation timestamp');
      const progress = progressValue((timestamp - startedAt) / duration);
      apply(interpolateCamera(origin, target, easeCameraProgress(progress)));
      if (progress < 1) activeFrameId = request(tick);
      else activeFrameId = null;
    };

    activeFrameId = request(tick);
    return true;
  }

  function scheduleTo(targetFactory) {
    const readTarget = requiredFunction(targetFactory, 'targetFactory');
    cancel();
    const scheduledGeneration = generation;
    activeFrameId = request(() => {
      if (scheduledGeneration !== generation) return;
      activeFrameId = null;
      animateTo(readTarget());
    });
    return true;
  }

  return Object.freeze({
    animateTo,
    scheduleTo,
    jumpTo,
    cancel,
    isAnimating: () => activeFrameId !== null,
  });
}
