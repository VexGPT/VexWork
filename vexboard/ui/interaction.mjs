export const PRIMARY_DRAG_THRESHOLD_PX = 4;

export const INTERACTION_PLANES = Object.freeze({
  CANVAS: 'CANVAS',
  OBJECT: 'OBJECT',
  OVERLAY: 'OVERLAY',
  CHROME: 'CHROME',
});

const INTERACTION_PLANE_VALUES = new Set(Object.values(INTERACTION_PLANES));

export function interactionPlaneForTarget(target) {
  const owner = target?.closest?.('[data-vexboard-plane]');
  const value = owner?.dataset?.vexboardPlane ?? owner?.getAttribute?.('data-vexboard-plane') ?? null;
  return INTERACTION_PLANE_VALUES.has(value) ? value : INTERACTION_PLANES.CANVAS;
}

export function shouldStartCanvasPan({
  tool,
  targetPlane = null,
  targetIsShape = null,
  button = 0,
}) {
  if (button !== 0) return false;
  const plane = targetPlane ?? (targetIsShape === true ? INTERACTION_PLANES.OBJECT : INTERACTION_PLANES.CANVAS);
  if (plane === INTERACTION_PLANES.CHROME || plane === INTERACTION_PLANES.OVERLAY) return false;
  return tool === 'PAN' || (tool === 'SELECT' && plane === INTERACTION_PLANES.CANVAS);
}

export function shouldStartObjectMove({
  tool,
  editable,
  locked,
  targetPlane = INTERACTION_PLANES.OBJECT,
  button = 0,
}) {
  return button === 0
    && tool === 'SELECT'
    && editable === true
    && locked !== true
    && targetPlane === INTERACTION_PLANES.OBJECT;
}

export function dragExceededThreshold(start, current, threshold = PRIMARY_DRAG_THRESHOLD_PX) {
  const dx = Number(current.x) - Number(start.x);
  const dy = Number(current.y) - Number(start.y);
  return Math.hypot(dx, dy) >= threshold;
}

export function pointerGestureFromMovement(start, current, threshold = PRIMARY_DRAG_THRESHOLD_PX) {
  return dragExceededThreshold(start, current, threshold) ? 'DRAG' : 'CLICK';
}

export function cameraFromPointerDrag(origin, start, current) {
  return Object.freeze({
    x: Number(origin.x) + Number(current.x) - Number(start.x),
    y: Number(origin.y) + Number(current.y) - Number(start.y),
    zoom: Number(origin.zoom),
  });
}

export function objectPositionFromPointerDrag(origin, start, current, zoom = 1) {
  const scale = Number(zoom);
  if (!Number.isFinite(scale) || scale <= 0) throw new TypeError('zoom must be positive');
  return Object.freeze({
    x: Number(origin.x) + (Number(current.x) - Number(start.x)) / scale,
    y: Number(origin.y) + (Number(current.y) - Number(start.y)) / scale,
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][INTERACTION]
