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

export const SCREEN_DESIGN_LAYOUT_MODES = Object.freeze([
  'FREE',
  'ROW',
  'COLUMN',
  'STACK',
  'SCROLL_ROW',
  'SCROLL_COLUMN',
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

function normalizeBoundedMetric(metric, label) {
  unitInterval(metric?.preferredPercent, `${label}.preferredPercent`);
  positive(metric?.minDp, `${label}.minDp`);
  positive(metric?.maxDp, `${label}.maxDp`);
  positive(metric?.referenceDp, `${label}.referenceDp`);
  assert(metric.minDp <= metric.maxDp, `${label}.minDp must be <= maxDp`);
  return metric;
}

export function resolveBoundedResponsiveMetric(metric, actualExtentDp) {
  positive(actualExtentDp, 'actualExtentDp');
  normalizeBoundedMetric(metric, 'metric');
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
  assert(typeof input.referenceViewport.profileRef === 'string' && input.referenceViewport.profileRef,
    'referenceViewport.profileRef required');
  positive(input.referenceViewport.widthDp, 'referenceViewport.widthDp');
  positive(input.referenceViewport.heightDp, 'referenceViewport.heightDp');
  assert(Array.isArray(input.constraints), 'screen design constraints must be an array');
  if (input.layoutRules !== undefined) {
    assert(Array.isArray(input.layoutRules), 'screen design layoutRules must be an array');
  }
  if (input.sourceRefs !== undefined) {
    assert(Array.isArray(input.sourceRefs), 'screen design sourceRefs must be an array');
    for (const [index, sourceRef] of input.sourceRefs.entries()) {
      assert(typeof sourceRef === 'string' && sourceRef, `screen design sourceRefs[${index}] required`);
    }
  }
  if (input.metrics !== undefined) {
    assert(input.metrics && typeof input.metrics === 'object' && !Array.isArray(input.metrics),
      'screen design metrics must be one object');
    for (const [key, metric] of Object.entries(input.metrics)) {
      normalizeBoundedMetric(metric, `screen design metrics.${key}`);
    }
  }
  if (input.intrinsicSizes !== undefined) {
    assert(input.intrinsicSizes && typeof input.intrinsicSizes === 'object' && !Array.isArray(input.intrinsicSizes),
      'screen design intrinsicSizes must be one object');
    for (const [semanticRef, size] of Object.entries(input.intrinsicSizes)) {
      assert(semanticRef, 'screen design intrinsicSizes key required');
      assert(size && typeof size === 'object' && !Array.isArray(size),
        `screen design intrinsicSizes.${semanticRef} must be one object`);
      positive(size.widthDp, `screen design intrinsicSizes.${semanticRef}.widthDp`);
      positive(size.heightDp, `screen design intrinsicSizes.${semanticRef}.heightDp`);
    }
  }

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

  const byOccurrenceRef = new Map(
    input.constraints.map((constraint) => [constraint.occurrenceRef, constraint]),
  );
  for (const constraint of input.constraints) {
    if (
      constraint.parentOccurrenceRefOrNull !== null &&
      !byOccurrenceRef.has(constraint.parentOccurrenceRefOrNull)
    ) {
      throw new TypeError(
        `screen design occurrence ${constraint.occurrenceRef} parent missing: ${constraint.parentOccurrenceRefOrNull}`,
      );
    }
    if (constraint.parentOccurrenceRefOrNull === constraint.occurrenceRef) {
      throw new TypeError(`screen design occurrence ${constraint.occurrenceRef} cannot parent itself`);
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visitOccurrence(occurrenceRef) {
    if (visiting.has(occurrenceRef)) {
      throw new TypeError(`screen design containment cycle detected at ${occurrenceRef}`);
    }
    if (visited.has(occurrenceRef)) return;
    visiting.add(occurrenceRef);
    const parentRef = byOccurrenceRef.get(occurrenceRef)?.parentOccurrenceRefOrNull ?? null;
    if (parentRef) visitOccurrence(parentRef);
    visiting.delete(occurrenceRef);
    visited.add(occurrenceRef);
  }
  for (const occurrenceRef of byOccurrenceRef.keys()) visitOccurrence(occurrenceRef);

  if (input.layoutRules !== undefined) {
    const layoutRefs = new Set();
    for (const [index, rule] of input.layoutRules.entries()) {
      const label = `screen design layoutRules[${index}]`;
      assert(typeof rule?.layoutRef === 'string' && rule.layoutRef, `${label}.layoutRef required`);
      assert(!layoutRefs.has(rule.layoutRef), `duplicate screen design layoutRef ${rule.layoutRef}`);
      layoutRefs.add(rule.layoutRef);
      assert(typeof rule.semanticRef === 'string' && rule.semanticRef, `${label}.semanticRef required`);
      assert(SCREEN_DESIGN_LAYOUT_MODES.includes(rule.mode), `${label}.mode unsupported`);
      if (rule.gapMetricRefOrNull !== null) {
        assert(typeof rule.gapMetricRefOrNull === 'string' && rule.gapMetricRefOrNull,
          `${label}.gapMetricRefOrNull invalid`);
        assert(input.metrics && Object.hasOwn(input.metrics, rule.gapMetricRefOrNull),
          `${label}.gapMetricRefOrNull missing metric ${rule.gapMetricRefOrNull}`);
      }
    }
  }

  return structuredClone(input);
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-DESIGN][POC]
