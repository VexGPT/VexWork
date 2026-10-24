export const PRIMARY_DRAG_THRESHOLD_PX = 4;

export function shouldStartCanvasPan({ tool, targetIsShape, button = 0 }) {
  if (button !== 0) return false;
  return tool === 'PAN' || (tool === 'SELECT' && !targetIsShape);
}

export function dragExceededThreshold(start, current, threshold = PRIMARY_DRAG_THRESHOLD_PX) {
  const dx = Number(current.x) - Number(start.x);
  const dy = Number(current.y) - Number(start.y);
  return Math.hypot(dx, dy) >= threshold;
}

export function cameraFromPointerDrag(origin, start, current) {
  return Object.freeze({
    x: Number(origin.x) + Number(current.x) - Number(start.x),
    y: Number(origin.y) + Number(current.y) - Number(start.y),
    zoom: Number(origin.zoom),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][INTERACTION]
