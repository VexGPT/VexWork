// Screen Lens frame layout: a screen that is realized as frames divided by seams into regions.
//
// Some products are not one column on a phone. A browser workspace has a header across the top, a
// Browser and a Companion side by side, a seam between them a person can drag or collapse, and an
// overlay layer above it all. When a product's own source authors that composition (VexLife-Prod's
// VexWeb Surface does), its Lens export may carry it as `screens[].layout`:
//
//   layout.kind     FRAME: the screen is a frame of regions divided by seams
//   layout.root     the outermost frame
//   layout.frames   per frame: seams (axis, the span they divide, authored allocation),
//                   regions (bounded by the frame's edges or its own seams), chrome (handles)
//   layout.overlays layers drawn above the frame (transient feedback, modals)
//
// Every ref is a Lens element of the screen, so frames, seams, regions and handles are selectable,
// inspectable and listed in Structure like any element; containment stays in the element tree.
// The layout adds only where things sit. The renderer is chosen from these facts, never from a
// subject name: a screen without a layout keeps the phone realization (VexLife Android).
//
// Pure and effect-free.

export const LAYOUT_KINDS = Object.freeze(['FRAME']);
export const SEAM_AXES = Object.freeze(['VERTICAL', 'HORIZONTAL']);
export const X_EDGES = Object.freeze(['FRAME_START', 'FRAME_END']);
export const Y_EDGES = Object.freeze(['FRAME_TOP', 'FRAME_BOTTOM']);
export const LAYERS = Object.freeze(['CONTENT', 'CHROME', 'TRANSIENT', 'MODAL']);

function fail(message) {
  throw new TypeError(`screen lens layout: ${message}`);
}
const list = (value) => (Array.isArray(value) ? value : []);
const positive = (value, label) => (Number.isInteger(value) && value > 0 ? value : fail(`${label} must be a positive integer`));

/**
 * Validate a screen's layout against its elements. Fails closed: every frame, seam, region,
 * handle and overlay must be an element of the screen with the matching kind and containment, and
 * every region edge must be its frame's own edge or one of its frame's seams on that axis.
 */
export function normalizeScreenLayout(input, { screenRef, elements }) {
  if (input === undefined || input === null) return null;
  if (typeof input !== 'object') fail(`${screenRef} layout must be an object`);
  if (!LAYOUT_KINDS.includes(input.kind)) fail(`${screenRef} layout kind ${input.kind} is unknown`);
  const byRef = new Map(elements.map((element) => [element.ref, element]));
  const element = (ref, label, kinds) => {
    const found = byRef.get(ref);
    if (!found) fail(`${screenRef} ${label} ${ref} is not an element of the screen`);
    if (kinds && !kinds.includes(found.kind)) fail(`${screenRef} ${label} ${ref} is a ${found.kind}, not ${kinds.join(' or ')}`);
    return found;
  };
  const frameRefs = new Set();
  const frames = list(input.frames).map((frame) => {
    element(frame.ref, 'frame', ['FRAME']);
    if (frameRefs.has(frame.ref)) fail(`${screenRef} frame ${frame.ref} repeats`);
    frameRefs.add(frame.ref);
    const seams = list(frame.seams).map((seam) => {
      const own = element(seam.ref, 'seam', ['SEAM']);
      if (own.parentRef !== frame.ref) fail(`seam ${seam.ref} is not inside frame ${frame.ref}`);
      if (!SEAM_AXES.includes(seam.axis)) fail(`seam ${seam.ref} axis ${seam.axis} is unknown`);
      return Object.freeze({
        ref: seam.ref,
        axis: seam.axis,
        between: Object.freeze(list(seam.between).map(String)),
        span: Object.freeze(list(seam.span).map(String)),
        allocation: Object.freeze({ before: positive(seam.allocation?.before, `seam ${seam.ref} allocation before`), after: positive(seam.allocation?.after, `seam ${seam.ref} allocation after`) }),
      });
    });
    const seamAxis = new Map(seams.map((seam) => [seam.ref, seam.axis]));
    const edge = (value, axis, label) => {
      if ((axis === 'VERTICAL' ? X_EDGES : Y_EDGES).includes(value)) return value;
      if (seamAxis.get(value) === axis) return value;
      return fail(`${label} ${value} is neither frame ${frame.ref}'s edge nor one of its ${axis.toLowerCase()} seams`);
    };
    for (const seam of seams) {
      if (seam.between.length !== 2 || seam.span.length !== 2) fail(`seam ${seam.ref} needs two between and two span edges`);
      const across = seam.axis === 'VERTICAL' ? 'HORIZONTAL' : 'VERTICAL';
      seam.between.forEach((value) => edge(value, seam.axis, `seam ${seam.ref} between`));
      seam.span.forEach((value) => edge(value, across, `seam ${seam.ref} span`));
    }
    const regions = list(frame.regions).map((region) => {
      const own = element(region.ref, 'region', ['REGION']);
      if (own.parentRef !== frame.ref) fail(`region ${region.ref} is not inside frame ${frame.ref}`);
      return Object.freeze({
        ref: region.ref,
        start: edge(region.start, 'VERTICAL', `region ${region.ref} start`),
        end: edge(region.end, 'VERTICAL', `region ${region.ref} end`),
        top: edge(region.top, 'HORIZONTAL', `region ${region.ref} top`),
        bottom: edge(region.bottom, 'HORIZONTAL', `region ${region.ref} bottom`),
      });
    });
    if (!regions.length) fail(`frame ${frame.ref} has no region`);
    const chrome = list(frame.chrome).map((entry) => {
      const own = element(entry.ref, 'chrome', null);
      if (own.parentRef !== frame.ref) fail(`chrome ${entry.ref} is not inside frame ${frame.ref}`);
      const seamRef = entry.seamRef ?? null;
      if (seamRef && !seamAxis.has(seamRef)) fail(`chrome ${entry.ref} names seam ${seamRef} outside frame ${frame.ref}`);
      return Object.freeze({ ref: entry.ref, seamRef });
    });
    return Object.freeze({ ref: frame.ref, seams: Object.freeze(seams), regions: Object.freeze(regions), chrome: Object.freeze(chrome) });
  });
  if (!frames.length) fail(`${screenRef} layout has no frame`);
  if (!frameRefs.has(input.root)) fail(`${screenRef} layout root ${input.root} is not one of its frames`);
  const overlays = list(input.overlays).map((ref) => element(ref, 'overlay', null).ref);
  return Object.freeze({
    kind: input.kind,
    symbol: input.symbol ? String(input.symbol) : null,
    source: input.source ? String(input.source) : null,
    root: input.root,
    frames: Object.freeze(frames),
    overlays: Object.freeze(overlays),
  });
}

/**
 * Where each region, seam and handle sits inside its frame, as fractions of the frame (0..1).
 * A seam sits at its authored allocation of the span between its two edges; nested seams resolve
 * through the seams they are bounded by.
 */
export function frameGeometry(frame) {
  const seams = new Map(frame.seams.map((seam) => [seam.ref, seam]));
  const memo = new Map();
  const position = (edge, trail = []) => {
    if (edge === 'FRAME_START' || edge === 'FRAME_TOP') return 0;
    if (edge === 'FRAME_END' || edge === 'FRAME_BOTTOM') return 1;
    if (memo.has(edge)) return memo.get(edge);
    if (trail.includes(edge)) fail(`frame ${frame.ref} seams bound each other in a cycle at ${edge}`);
    const seam = seams.get(edge);
    if (!seam) fail(`frame ${frame.ref} has no seam ${edge}`);
    const [from, to] = seam.between.map((value) => position(value, [...trail, edge]));
    const at = from + ((to - from) * seam.allocation.before) / (seam.allocation.before + seam.allocation.after);
    memo.set(edge, at);
    return at;
  };
  return Object.freeze({
    ref: frame.ref,
    regions: Object.freeze(frame.regions.map((region) => Object.freeze({
      ref: region.ref,
      left: position(region.start),
      right: position(region.end),
      top: position(region.top),
      bottom: position(region.bottom),
    }))),
    seams: Object.freeze(frame.seams.map((seam) => {
      const [from, to] = seam.span.map((value) => position(value));
      return Object.freeze({ ref: seam.ref, axis: seam.axis, at: position(seam.ref), from, to, allocation: seam.allocation });
    })),
    chrome: Object.freeze(frame.chrome.map((entry) => Object.freeze({ ref: entry.ref, seamRef: entry.seamRef, at: entry.seamRef ? position(entry.seamRef) : null }))),
  });
}

/** The frame a ref belongs to as a frame, seam, region or chrome, with its role there. */
export function layoutRole(layout, ref) {
  if (!layout) return null;
  for (const frame of layout.frames) {
    if (frame.ref === ref) return { role: 'FRAME', frame };
    const seam = frame.seams.find((entry) => entry.ref === ref);
    if (seam) return { role: 'SEAM', frame, seam };
    const region = frame.regions.find((entry) => entry.ref === ref);
    if (region) return { role: 'REGION', frame, region };
    const chrome = frame.chrome.find((entry) => entry.ref === ref);
    if (chrome) return { role: 'CHROME', frame, chrome };
  }
  if (layout.overlays.includes(ref)) return { role: 'OVERLAY' };
  return null;
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][FRAMES]
