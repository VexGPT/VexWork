export const VEXBOARD_SCREEN_DESIGN_SCHEMA = 'vexboard.screen-design/poc-v1';
export const SCREEN_DESIGN_AUTHORITY_STATES = Object.freeze([
  'REVERSE_ADOPTED_CANDIDATE',
  'VEXBOARD_DESIGN_AUTHORITY',
]);

export const SCREEN_DESIGN_SIZE_MODES = Object.freeze([
  'FILL',
  'FRACTION',
  'FIXED_REFERENCE',
  'CONTENT_REFERENCE',
]);

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function finite(value, label) {
  assert(typeof value === 'number' && Number.isFinite(value), `${label} must be finite`);
  return value;
}

function positive(value, label) {
  finite(value, label);
  assert(value > 0, `${label} must be positive`);
  return value;
}

function unitInterval(value, label) {
  finite(value, label);
  assert(value >= 0 && value <= 1, `${label} must be between 0 and 1`);
  return value;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function boundedResponsiveMetric({
  referenceDp,
  referenceExtentDp,
  minDp = referenceDp,
  maxDp = referenceDp,
}) {
  positive(referenceDp, 'referenceDp');
  positive(referenceExtentDp, 'referenceExtentDp');
  positive(minDp, 'minDp');
  positive(maxDp, 'maxDp');
  assert(minDp <= maxDp, 'bounded metric minDp must be <= maxDp');
  return Object.freeze({
    preferredPercent: referenceDp / referenceExtentDp,
    minDp,
    maxDp,
    referenceDp,
  });
}

export function resolveBoundedResponsiveMetric(metric, actualExtentDp) {
  positive(actualExtentDp, 'actualExtentDp');
  unitInterval(metric?.preferredPercent, 'metric.preferredPercent');
  positive(metric?.minDp, 'metric.minDp');
  positive(metric?.maxDp, 'metric.maxDp');
  assert(metric.minDp <= metric.maxDp, 'metric minDp must be <= maxDp');
  return clamp(actualExtentDp * metric.preferredPercent, metric.minDp, metric.maxDp);
}

function normalizeSizeSpec(spec, label) {
  assert(spec && SCREEN_DESIGN_SIZE_MODES.includes(spec.mode), `${label}.mode unsupported`);
  if (spec.mode === 'FRACTION') {
    unitInterval(spec.fraction, `${label}.fraction`);
    assert(spec.fraction > 0, `${label}.fraction must be positive`);
  }
  if (spec.mode === 'FIXED_REFERENCE' || spec.mode === 'CONTENT_REFERENCE') {
    positive(spec.referenceDp, `${label}.referenceDp`);
  }
  if (spec.minDp !== undefined) positive(spec.minDp, `${label}.minDp`);
  if (spec.maxDp !== undefined) positive(spec.maxDp, `${label}.maxDp`);
  if (spec.minDp !== undefined && spec.maxDp !== undefined) {
    assert(spec.minDp <= spec.maxDp, `${label}.minDp must be <= maxDp`);
  }
  return spec;
}

function resolveSize(specInput, innerExtentDp, label) {
  const spec = normalizeSizeSpec(specInput, label);
  let size;
  if (spec.mode === 'FILL') size = innerExtentDp;
  else if (spec.mode === 'FRACTION') size = innerExtentDp * spec.fraction;
  else size = spec.referenceDp;
  if (spec.minDp !== undefined) size = Math.max(size, spec.minDp);
  if (spec.maxDp !== undefined) size = Math.min(size, spec.maxDp);
  assert(size > 0, `${label} resolved size must be positive`);
  assert(size <= innerExtentDp + 1e-9, `${label} resolved size exceeds admitted inner extent`);
  return size;
}

function resolveAxis({
  parentStartDp,
  parentExtentDp,
  startMargin,
  endMargin,
  size,
  bias = 0,
}, label) {
  finite(parentStartDp, `${label}.parentStartDp`);
  positive(parentExtentDp, `${label}.parentExtentDp`);
  unitInterval(bias, `${label}.bias`);

  const startDp = startMargin
    ? resolveBoundedResponsiveMetric(startMargin, parentExtentDp)
    : 0;
  const endDp = endMargin
    ? resolveBoundedResponsiveMetric(endMargin, parentExtentDp)
    : 0;
  const innerExtentDp = parentExtentDp - startDp - endDp;
  assert(innerExtentDp > 0, `${label} margins exhaust parent extent`);

  const sizeDp = resolveSize(size, innerExtentDp, `${label}.size`);
  const slackDp = innerExtentDp - sizeDp;

  return Object.freeze({
    startDp: parentStartDp + startDp + (slackDp * bias),
    sizeDp,
    resolvedStartMarginDp: startDp,
    resolvedEndMarginDp: endDp,
    bias,
  });
}

export function resolveScreenDesignBox({
  parentBoundsDp,
  horizontal,
  vertical,
}) {
  assert(parentBoundsDp && typeof parentBoundsDp === 'object', 'parentBoundsDp required');
  const x = resolveAxis({
    parentStartDp: finite(parentBoundsDp.x, 'parentBoundsDp.x'),
    parentExtentDp: positive(parentBoundsDp.width, 'parentBoundsDp.width'),
    ...horizontal,
  }, 'horizontal');
  const y = resolveAxis({
    parentStartDp: finite(parentBoundsDp.y, 'parentBoundsDp.y'),
    parentExtentDp: positive(parentBoundsDp.height, 'parentBoundsDp.height'),
    ...vertical,
  }, 'vertical');

  return Object.freeze({
    x: x.startDp,
    y: y.startDp,
    width: x.sizeDp,
    height: y.sizeDp,
  });
}

export function normalizeScreenDesign(input) {
  assert(input?.schemaVersion === VEXBOARD_SCREEN_DESIGN_SCHEMA, 'screen design schema mismatch');
  assert(typeof input.designRef === 'string' && input.designRef, 'screen design designRef required');
  assert(SCREEN_DESIGN_AUTHORITY_STATES.includes(input.authorityState), 'screen design authorityState unsupported');
  assert(input.referenceViewport && typeof input.referenceViewport === 'object', 'screen design referenceViewport required');
  positive(input.referenceViewport.widthDp, 'referenceViewport.widthDp');
  positive(input.referenceViewport.heightDp, 'referenceViewport.heightDp');
  assert(Array.isArray(input.constraints), 'screen design constraints must be an array');

  const occurrences = new Set();
  for (const [index, constraint] of input.constraints.entries()) {
    const label = `screen design constraints[${index}]`;
    assert(typeof constraint?.occurrenceRef === 'string' && constraint.occurrenceRef, `${label}.occurrenceRef required`);
    assert(typeof constraint?.semanticRef === 'string' && constraint.semanticRef, `${label}.semanticRef required`);
    assert(!occurrences.has(constraint.occurrenceRef), `duplicate screen design occurrenceRef ${constraint.occurrenceRef}`);
    occurrences.add(constraint.occurrenceRef);
    if (constraint.parentOccurrenceRefOrNull !== null) {
      assert(typeof constraint.parentOccurrenceRefOrNull === 'string' && constraint.parentOccurrenceRefOrNull,
        `${label}.parentOccurrenceRefOrNull invalid`);
    }
    if (constraint.horizontal) {
      normalizeSizeSpec(constraint.horizontal.size, `${label}.horizontal.size`);
      unitInterval(constraint.horizontal.bias ?? 0, `${label}.horizontal.bias`);
    }
    if (constraint.vertical) {
      normalizeSizeSpec(constraint.vertical.size, `${label}.vertical.size`);
      unitInterval(constraint.vertical.bias ?? 0, `${label}.vertical.bias`);
    }
  }

  return input;
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-DESIGN][POC]
