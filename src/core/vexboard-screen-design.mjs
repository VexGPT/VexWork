export const VEXBOARD_SCREEN_DESIGN_SCHEMA = 'vexboard.screen-design/poc-v1';
export const SCREEN_DESIGN_AUTHORITY_STATES = Object.freeze([
  'REVERSE_ADOPTED_CANDIDATE',
  'VEXBOARD_DESIGN_DRAFT',
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

export const SCREEN_DESIGN_COMPONENT_TEMPLATES = Object.freeze([
  'component.screen',
  'component.surface',
  'component.column',
  'component.text',
  'component.button',
  'component.icon-button',
  'component.tab',
  'component.fab',
  'component.modal-bottom-sheet',
]);

export const SCREEN_DESIGN_HORIZONTAL_ANCHORS = Object.freeze(['START', 'CENTER', 'END']);
export const SCREEN_DESIGN_VERTICAL_ANCHORS = Object.freeze(['TOP', 'CENTER', 'BOTTOM']);

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

export function screenDesignAnchorRule(designInput, anchorRef) {
  const design = normalizeScreenDesign(designInput);
  const rule = design.anchorRules?.find((entry) => entry.anchorRef === anchorRef);
  if (!rule) throw new TypeError(`unknown screen design anchor rule ${anchorRef}`);
  return Object.freeze(structuredClone(rule));
}

export function screenDesignLayoutRule(designInput, layoutRef) {
  const design = normalizeScreenDesign(designInput);
  const rule = design.layoutRules?.find((entry) => entry.layoutRef === layoutRef);
  if (!rule) throw new TypeError(`unknown screen design layout rule ${layoutRef}`);
  return Object.freeze(structuredClone(rule));
}

export function screenDesignSemanticElement(designInput, semanticRef) {
  const design = normalizeScreenDesign(designInput);
  const element = design.semanticElements?.find((entry) => entry.semanticRef === semanticRef);
  if (!element) throw new TypeError(`unknown screen design semantic element ${semanticRef}`);
  return Object.freeze(structuredClone(element));
}

export function screenDesignVisualDimension(designInput, tokenRef) {
  const design = normalizeScreenDesign(designInput);
  const value = design.visualTokens?.dimensions?.[tokenRef];
  if (value === undefined || value === null) {
    throw new TypeError(`unknown screen design visual dimension ${tokenRef}`);
  }
  return Number(value);
}

export function screenDesignComponentAssignment(designInput, semanticRef) {
  const design = normalizeScreenDesign(designInput);
  const assignment = design.componentAssignments?.find((entry) => entry.semanticRef === semanticRef);
  if (!assignment) throw new TypeError(`unknown screen design component assignment ${semanticRef}`);
  return Object.freeze(structuredClone(assignment));
}

export function screenDesignMetric(designInput, metricRef) {
  const design = normalizeScreenDesign(designInput);
  const metric = design.metrics?.[metricRef];
  if (!metric) throw new TypeError(`unknown screen design metric ${metricRef}`);
  return Object.freeze(structuredClone(metric));
}

function normalizeMarginSpec(spec, label, metrics) {
  if (!spec) return spec;
  if (
    typeof spec === 'object' &&
    !Array.isArray(spec) &&
    Object.keys(spec).length === 1 &&
    typeof spec.metricRef === 'string'
  ) {
    assert(metrics && Object.hasOwn(metrics, spec.metricRef),
      `${label}.metricRef missing metric ${spec.metricRef}`);
    return spec;
  }
  normalizeBoundedMetric(spec, label);
  return spec;
}

function resolveMarginSpec(design, spec, label) {
  if (!spec) return undefined;
  if (typeof spec.metricRef === 'string') {
    const metric = design.metrics?.[spec.metricRef];
    assert(metric, `${label}.metricRef missing metric ${spec.metricRef}`);
    return metric;
  }
  return spec;
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

export function resolveScreenDesignConstraintBox({
  designInput,
  parentBoundsDp,
  constraintInput,
}) {
  const design = normalizeScreenDesign(designInput);
  if (!constraintInput || typeof constraintInput !== 'object') {
    throw new TypeError('constraintInput required');
  }
  const horizontal = {
    ...constraintInput.horizontal,
    startMargin: resolveMarginSpec(design, constraintInput.horizontal?.startMargin, 'horizontal.startMargin'),
    endMargin: resolveMarginSpec(design, constraintInput.horizontal?.endMargin, 'horizontal.endMargin'),
  };
  const vertical = {
    ...constraintInput.vertical,
    startMargin: resolveMarginSpec(design, constraintInput.vertical?.startMargin, 'vertical.startMargin'),
    endMargin: resolveMarginSpec(design, constraintInput.vertical?.endMargin, 'vertical.endMargin'),
  };
  return resolveScreenDesignBox({
    parentBoundsDp,
    horizontal,
    vertical,
  });
}

export function resolveScreenDesignAnchorBox({
  designInput,
  anchorRuleInput,
  parentBoundsDp,
  widthDp,
  heightDp,
}) {
  const design = normalizeScreenDesign(designInput);
  if (!anchorRuleInput || typeof anchorRuleInput !== 'object') {
    throw new TypeError('anchorRuleInput required');
  }
  positive(widthDp, 'anchor widthDp');
  positive(heightDp, 'anchor heightDp');
  const horizontalInsetDp = anchorRuleInput.horizontalInsetMetricRefOrNull
    ? resolveBoundedResponsiveMetric(
        screenDesignMetric(design, anchorRuleInput.horizontalInsetMetricRefOrNull),
        parentBoundsDp.width,
      )
    : 0;
  const verticalInsetDp = anchorRuleInput.verticalInsetMetricRefOrNull
    ? resolveBoundedResponsiveMetric(
        screenDesignMetric(design, anchorRuleInput.verticalInsetMetricRefOrNull),
        parentBoundsDp.height,
      )
    : 0;

  let x;
  if (anchorRuleInput.horizontalAnchor === 'START') x = parentBoundsDp.x + horizontalInsetDp;
  else if (anchorRuleInput.horizontalAnchor === 'CENTER') x = parentBoundsDp.x + ((parentBoundsDp.width - widthDp) / 2);
  else x = parentBoundsDp.x + parentBoundsDp.width - horizontalInsetDp - widthDp;

  let y;
  if (anchorRuleInput.verticalAnchor === 'TOP') y = parentBoundsDp.y + verticalInsetDp;
  else if (anchorRuleInput.verticalAnchor === 'CENTER') y = parentBoundsDp.y + ((parentBoundsDp.height - heightDp) / 2);
  else y = parentBoundsDp.y + parentBoundsDp.height - verticalInsetDp - heightDp;

  assert(x >= parentBoundsDp.x - 1e-9 && y >= parentBoundsDp.y - 1e-9,
    'anchored design box starts outside parent bounds');
  assert(x + widthDp <= parentBoundsDp.x + parentBoundsDp.width + 1e-9,
    'anchored design box exceeds parent width');
  assert(y + heightDp <= parentBoundsDp.y + parentBoundsDp.height + 1e-9,
    'anchored design box exceeds parent height');

  return Object.freeze({ x, y, width: widthDp, height: heightDp });
}

export function screenDesignViewportProfile(designInput, profileRefOrNull = null) {
  const design = normalizeScreenDesign(designInput);
  const profileRef = profileRefOrNull ?? design.referenceViewport.profileRef;
  if (Array.isArray(design.viewportProfiles)) {
    const profile = design.viewportProfiles.find((entry) => entry.profileRef === profileRef);
    if (!profile) throw new TypeError(`unknown screen design viewport profile ${profileRef}`);
    return Object.freeze(structuredClone(profile));
  }
  if (profileRef !== design.referenceViewport.profileRef) {
    throw new TypeError(`unknown screen design viewport profile ${profileRef}`);
  }
  return Object.freeze({
    profileRef: design.referenceViewport.profileRef,
    label: 'Reference viewport',
    widthDp: design.referenceViewport.widthDp,
    heightDp: design.referenceViewport.heightDp,
    fontScale: 1,
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
  if (input.viewportProfiles !== undefined) {
    assert(Array.isArray(input.viewportProfiles), 'screen design viewportProfiles must be an array');
    const profileRefs = new Set();
    for (const [index, profile] of input.viewportProfiles.entries()) {
      const label = `screen design viewportProfiles[${index}]`;
      assert(typeof profile?.profileRef === 'string' && profile.profileRef, `${label}.profileRef required`);
      assert(!profileRefs.has(profile.profileRef), `duplicate screen design viewport profileRef ${profile.profileRef}`);
      profileRefs.add(profile.profileRef);
      assert(typeof profile.label === 'string' && profile.label, `${label}.label required`);
      positive(profile.widthDp, `${label}.widthDp`);
      positive(profile.heightDp, `${label}.heightDp`);
      positive(profile.fontScale ?? 1, `${label}.fontScale`);
    }
    const referenceProfile = input.viewportProfiles.find(
      (profile) => profile.profileRef === input.referenceViewport.profileRef,
    );
    assert(referenceProfile, 'screen design referenceViewport profileRef missing from viewportProfiles');
    assert(referenceProfile.widthDp === input.referenceViewport.widthDp,
      'screen design referenceViewport width does not match viewport profile');
    assert(referenceProfile.heightDp === input.referenceViewport.heightDp,
      'screen design referenceViewport height does not match viewport profile');
  }
  assert(Array.isArray(input.constraints), 'screen design constraints must be an array');
  if (input.layoutRules !== undefined) {
    assert(Array.isArray(input.layoutRules), 'screen design layoutRules must be an array');
  }
  if (input.anchorRules !== undefined) {
    assert(Array.isArray(input.anchorRules), 'screen design anchorRules must be an array');
  }
  if (input.anchorRules !== undefined) {
    const anchorRefs = new Set();
    for (const [index, rule] of input.anchorRules.entries()) {
      const label = `screen design anchorRules[${index}]`;
      assert(typeof rule?.anchorRef === 'string' && rule.anchorRef, `${label}.anchorRef required`);
      assert(!anchorRefs.has(rule.anchorRef), `duplicate screen design anchorRef ${rule.anchorRef}`);
      anchorRefs.add(rule.anchorRef);
      assert(typeof rule.semanticRef === 'string' && rule.semanticRef, `${label}.semanticRef required`);
      assert(typeof rule.parentSemanticRef === 'string' && rule.parentSemanticRef,
        `${label}.parentSemanticRef required`);
      assert(SCREEN_DESIGN_HORIZONTAL_ANCHORS.includes(rule.horizontalAnchor),
        `${label}.horizontalAnchor unsupported`);
      assert(SCREEN_DESIGN_VERTICAL_ANCHORS.includes(rule.verticalAnchor),
        `${label}.verticalAnchor unsupported`);
      for (const [field, metricRef] of [
        ['horizontalInsetMetricRefOrNull', rule.horizontalInsetMetricRefOrNull],
        ['verticalInsetMetricRefOrNull', rule.verticalInsetMetricRefOrNull],
      ]) {
        if (metricRef === null) continue;
        assert(typeof metricRef === 'string' && metricRef, `${label}.${field} invalid`);
        assert(input.metrics && Object.hasOwn(input.metrics, metricRef),
          `${label}.${field} missing metric ${metricRef}`);
      }
    }
  }

  if (input.semanticElements !== undefined) {
    const semanticRefs = new Set();
    for (const [index, element] of input.semanticElements.entries()) {
      const label = `screen design semanticElements[${index}]`;
      assert(typeof element?.semanticRef === 'string' && element.semanticRef,
        `${label}.semanticRef required`);
      assert(!semanticRefs.has(element.semanticRef),
        `duplicate screen design semantic element ${element.semanticRef}`);
      semanticRefs.add(element.semanticRef);
      assert(typeof element.parentSemanticRef === 'string' && element.parentSemanticRef,
        `${label}.parentSemanticRef required`);
      assert(element.kind === 'TEXT', `${label}.kind unsupported`);
      assert(element.identityState === 'VEXBOARD_PROPOSED',
        `${label}.identityState unsupported`);
      assert(typeof element.label === 'string' && element.label,
        `${label}.label required`);
      assert(Number.isInteger(element.referenceLineCount) && element.referenceLineCount > 0,
        `${label}.referenceLineCount must be a positive integer`);
      if (element.sourceRefs !== undefined) {
        assert(Array.isArray(element.sourceRefs), `${label}.sourceRefs must be an array`);
        for (const sourceRef of element.sourceRefs) {
          assert(typeof sourceRef === 'string' && sourceRef, `${label}.sourceRef required`);
        }
      }
    }
  }

  if (input.componentAssignments !== undefined) {
    assert(Array.isArray(input.componentAssignments),
      'screen design componentAssignments must be an array');
  }
  if (input.semanticElements !== undefined) {
    assert(Array.isArray(input.semanticElements),
      'screen design semanticElements must be an array');
  }
  if (input.visualTokens !== undefined) {
    assert(input.visualTokens && typeof input.visualTokens === 'object' && !Array.isArray(input.visualTokens),
      'screen design visualTokens must be one object');
    const colors = input.visualTokens.colors ?? {};
    assert(colors && typeof colors === 'object' && !Array.isArray(colors),
      'screen design visualTokens.colors must be one object');
    for (const [tokenRef, value] of Object.entries(colors)) {
      assert(typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value),
        `screen design visual color ${tokenRef} must be #RRGGBB`);
    }
    const shapes = input.visualTokens.shapes ?? {};
    assert(shapes && typeof shapes === 'object' && !Array.isArray(shapes),
      'screen design visualTokens.shapes must be one object');
    for (const [tokenRef, value] of Object.entries(shapes)) {
      if (value === 'FULL') continue;
      positive(value, `screen design visual shape ${tokenRef}`);
    }
    const dimensions = input.visualTokens.dimensions ?? {};
    assert(dimensions && typeof dimensions === 'object' && !Array.isArray(dimensions),
      'screen design visualTokens.dimensions must be one object');
    for (const [tokenRef, value] of Object.entries(dimensions)) {
      positive(value, `screen design visual dimension ${tokenRef}`);
    }
    const typography = input.visualTokens.typography ?? {};
    assert(typography && typeof typography === 'object' && !Array.isArray(typography),
      'screen design visualTokens.typography must be one object');
    for (const [tokenRef, value] of Object.entries(typography)) {
      assert(value && typeof value === 'object' && !Array.isArray(value),
        `screen design visual typography ${tokenRef} must be one object`);
      assert(typeof value.fontFamily === 'string' && value.fontFamily,
        `screen design visual typography ${tokenRef}.fontFamily required`);
      positive(value.fontWeight, `screen design visual typography ${tokenRef}.fontWeight`);
      positive(value.fontSizeSp, `screen design visual typography ${tokenRef}.fontSizeSp`);
      if (value.lineHeightSp !== undefined) positive(value.lineHeightSp,
        `screen design visual typography ${tokenRef}.lineHeightSp`);
      if (value.letterSpacingSp !== undefined) finite(value.letterSpacingSp,
        `screen design visual typography ${tokenRef}.letterSpacingSp`);
    }
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
      normalizeMarginSpec(constraint.horizontal.startMargin, `${label}.horizontal.startMargin`, input.metrics);
      normalizeMarginSpec(constraint.horizontal.endMargin, `${label}.horizontal.endMargin`, input.metrics);
    }
    if (constraint.vertical) {
      normalizeSizeSpec(constraint.vertical.size, `${label}.vertical.size`);
      unitInterval(constraint.vertical.bias ?? 0, `${label}.vertical.bias`);
      normalizeMarginSpec(constraint.vertical.startMargin, `${label}.vertical.startMargin`, input.metrics);
      normalizeMarginSpec(constraint.vertical.endMargin, `${label}.vertical.endMargin`, input.metrics);
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

  if (input.componentAssignments !== undefined) {
    const assignmentRefs = new Set();
    const semanticRefs = new Set();
    for (const [index, assignment] of input.componentAssignments.entries()) {
      const label = `screen design componentAssignments[${index}]`;
      assert(typeof assignment?.assignmentRef === 'string' && assignment.assignmentRef,
        `${label}.assignmentRef required`);
      assert(!assignmentRefs.has(assignment.assignmentRef),
        `duplicate screen design component assignmentRef ${assignment.assignmentRef}`);
      assignmentRefs.add(assignment.assignmentRef);
      assert(typeof assignment.semanticRef === 'string' && assignment.semanticRef,
        `${label}.semanticRef required`);
      assert(!semanticRefs.has(assignment.semanticRef),
        `duplicate screen design component semanticRef ${assignment.semanticRef}`);
      semanticRefs.add(assignment.semanticRef);
      assert(SCREEN_DESIGN_COMPONENT_TEMPLATES.includes(assignment.templateRef),
        `${label}.templateRef unsupported`);
      assert(typeof assignment.styleRef === 'string' && assignment.styleRef,
        `${label}.styleRef required`);
      if (assignment.selectedStyleRefOrNull !== null) {
        assert(typeof assignment.selectedStyleRefOrNull === 'string' && assignment.selectedStyleRefOrNull,
          `${label}.selectedStyleRefOrNull invalid`);
      }
      if (assignment.iconRefOrNull !== null) {
        assert(typeof assignment.iconRefOrNull === 'string' && assignment.iconRefOrNull,
          `${label}.iconRefOrNull invalid`);
      }
      if (assignment.typographyRefOrNull !== undefined && assignment.typographyRefOrNull !== null) {
        assert(typeof assignment.typographyRefOrNull === 'string' && assignment.typographyRefOrNull,
          `${label}.typographyRefOrNull invalid`);
        assert(
          input.visualTokens?.typography &&
          Object.hasOwn(input.visualTokens.typography, assignment.typographyRefOrNull),
          `${label}.typographyRefOrNull missing typography ${assignment.typographyRefOrNull}`,
        );
      }
      if (assignment.colorRefOrNull !== undefined && assignment.colorRefOrNull !== null) {
        assert(typeof assignment.colorRefOrNull === 'string' && assignment.colorRefOrNull,
          `${label}.colorRefOrNull invalid`);
        assert(
          input.visualTokens?.colors &&
          Object.hasOwn(input.visualTokens.colors, assignment.colorRefOrNull),
          `${label}.colorRefOrNull missing color ${assignment.colorRefOrNull}`,
        );
      }
    }
  }

  if (input.layoutRules !== undefined) {
    const layoutRefs = new Set();
    for (const [index, rule] of input.layoutRules.entries()) {
      const label = `screen design layoutRules[${index}]`;
      assert(typeof rule?.layoutRef === 'string' && rule.layoutRef, `${label}.layoutRef required`);
      assert(!layoutRefs.has(rule.layoutRef), `duplicate screen design layoutRef ${rule.layoutRef}`);
      layoutRefs.add(rule.layoutRef);
      assert(typeof rule.semanticRef === 'string' && rule.semanticRef, `${label}.semanticRef required`);
      assert(SCREEN_DESIGN_LAYOUT_MODES.includes(rule.mode), `${label}.mode unsupported`);
      if (rule.childSemanticRefs !== undefined) {
        assert(Array.isArray(rule.childSemanticRefs), `${label}.childSemanticRefs must be an array`);
        const children = new Set();
        for (const [childIndex, childRef] of rule.childSemanticRefs.entries()) {
          assert(typeof childRef === 'string' && childRef,
            `${label}.childSemanticRefs[${childIndex}] required`);
          assert(!children.has(childRef),
            `${label}.childSemanticRefs duplicate ${childRef}`);
          children.add(childRef);
        }
      }
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
