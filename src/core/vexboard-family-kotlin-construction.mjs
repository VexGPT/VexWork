export const VEXBOARD_FAMILY_KOTLIN_SCHEMA =
  'vexboard.family-kotlin/poc-v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const KOTLIN_ID = /^[A-Za-z_][A-Za-z0-9_]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function kotlinId(value, label) {
  assert(typeof value === 'string' && KOTLIN_ID.test(value), `${label} must be one Kotlin identifier`);
  return value;
}

function normalizeField(input, label) {
  assert(input && typeof input === 'object' && !Array.isArray(input), `${label} must be one object`);
  return Object.freeze({
    name: kotlinId(input.name, `${label}.name`),
    type: kotlinId(input.type, `${label}.type`),
  });
}

function normalizeResource(input, label) {
  assert(input && typeof input === 'object' && !Array.isArray(input), `${label} must be one object`);
  return Object.freeze({
    resourceRef: stableRef(input.resourceRef, `${label}.resourceRef`),
    name: kotlinId(input.name, `${label}.name`),
    valueField: normalizeField(input.valueField, `${label}.valueField`),
  });
}

function normalizeControl(input, label, resourcesByRef) {
  assert(input && typeof input === 'object' && !Array.isArray(input), `${label} must be one object`);
  const controlRef = stableRef(input.controlRef, `${label}.controlRef`);
  const resourceIdRefOrNull = input.resourceIdRefOrNull === null
    ? null
    : stableRef(input.resourceIdRefOrNull, `${label}.resourceIdRefOrNull`);
  if (resourceIdRefOrNull !== null) {
    assert(resourcesByRef.has(resourceIdRefOrNull),
      `${label}.resourceIdRefOrNull must reference a resource in the same Family`);
  }
  assert(Array.isArray(input.payloadFields), `${label}.payloadFields must be an array`);
  return Object.freeze({
    controlRef,
    name: kotlinId(input.name, `${label}.name`),
    resourceIdRefOrNull,
    payloadFields: Object.freeze(input.payloadFields.map(
      (field, index) => normalizeField(field, `${label}.payloadFields[${index}]`),
    )),
  });
}

function normalizeFamily(input, label) {
  assert(input && typeof input === 'object' && !Array.isArray(input), `${label} must be one object`);
  assert(['SEALED', 'ENUM'].includes(input.controlForm), `${label}.controlForm unsupported`);
  assert(Array.isArray(input.states) && input.states.length, `${label}.states must be a non-empty array`);
  assert(Array.isArray(input.resources), `${label}.resources must be an array`);
  assert(Array.isArray(input.controls) && input.controls.length, `${label}.controls must be a non-empty array`);

  const resources = input.resources.map(
    (resource, index) => normalizeResource(resource, `${label}.resources[${index}]`),
  );
  const resourcesByRef = new Map(resources.map((resource) => [resource.resourceRef, resource]));
  assert(resourcesByRef.size === resources.length, `${label}.resourceRef must be unique`);

  const controls = input.controls.map(
    (control, index) => normalizeControl(control, `${label}.controls[${index}]`, resourcesByRef),
  );
  assert(new Set(controls.map((control) => control.controlRef)).size === controls.length,
    `${label}.controlRef must be unique`);
  if (input.controlForm === 'ENUM') {
    assert(resources.length === 0, `${label} enum Control cannot declare ResourceId types`);
    assert(controls.every((control) =>
      control.resourceIdRefOrNull === null && control.payloadFields.length === 0),
    `${label} enum Control entries cannot carry payload/resource fields`);
  }

  return Object.freeze({
    familyRef: stableRef(input.familyRef, `${label}.familyRef`),
    familyName: kotlinId(input.familyName, `${label}.familyName`),
    controlForm: input.controlForm,
    states: Object.freeze(input.states.map(
      (state, index) => kotlinId(state, `${label}.states[${index}]`),
    )),
    resources: Object.freeze(resources),
    controls: Object.freeze(controls),
  });
}

export function normalizeFamilyKotlinModel(input) {
  assert(input && typeof input === 'object' && !Array.isArray(input),
    'family Kotlin model must be one object');
  assert(input.schemaVersion === VEXBOARD_FAMILY_KOTLIN_SCHEMA,
    'family Kotlin schema mismatch');
  assert(Array.isArray(input.families) && input.families.length,
    'family Kotlin families must be a non-empty array');
  assert(Array.isArray(input.sourceRefs), 'family Kotlin sourceRefs must be an array');

  const families = input.families.map(
    (family, index) => normalizeFamily(family, `family Kotlin families[${index}]`),
  );
  assert(new Set(families.map((family) => family.familyRef)).size === families.length,
    'family Kotlin familyRef must be unique');

  const sourceRefs = input.sourceRefs.map(
    (sourceRef, index) => stableRef(sourceRef, `family Kotlin sourceRefs[${index}]`),
  );

  return Object.freeze({
    schemaVersion: VEXBOARD_FAMILY_KOTLIN_SCHEMA,
    modelRef: stableRef(input.modelRef, 'family Kotlin modelRef'),
    targetSourceRefOrNull: input.targetSourceRefOrNull === null
      ? null
      : stableRef(input.targetSourceRefOrNull, 'family Kotlin targetSourceRefOrNull'),
    testSourceRef: stableRef(input.testSourceRef, 'family Kotlin testSourceRef'),
    families: Object.freeze(families),
    sourceRefs: Object.freeze(sourceRefs),
  });
}

function resourceFor(family, resourceRef) {
  return family.resources.find((resource) => resource.resourceRef === resourceRef) ?? null;
}

function renderState(family) {
  const lines = [
    '    sealed interface State :',
    `        VexFamily.State<${family.familyName}> {`,
  ];
  for (const state of family.states) {
    lines.push(`        data object ${state} : State`);
  }
  lines.push('    }');
  return lines.join('\n');
}

function renderResources(family) {
  if (!family.resources.length) return '';
  return family.resources.map((resource) => [
    `    data class ${resource.name}(`,
    `        val ${resource.valueField.name}: ${resource.valueField.type},`,
    '    ) :',
    `        VexFamily.ResourceId<${family.familyName}>`,
  ].join('\n')).join('\n\n');
}

function renderControl(family, control) {
  if (family.controlForm === 'ENUM') return control.name;

  const resource = control.resourceIdRefOrNull
    ? resourceFor(family, control.resourceIdRefOrNull)
    : null;
  const fields = [
    ...(resource
      ? [{ name: 'resourceId', type: resource.name, override: true }]
      : []),
    ...control.payloadFields.map((field) => ({ ...field, override: false })),
  ];

  if (!fields.length) {
    return [
      `        data object ${control.name} :`,
      '            Control',
    ].join('\n');
  }

  const lines = [`        data class ${control.name}(`];
  for (const field of fields) {
    lines.push(
      `            ${field.override ? 'override ' : ''}val ${field.name}: ${field.type},`,
    );
  }
  lines.push('        ) :', '            Control');
  if (resource) {
    lines[lines.length - 1] += ',';
    lines.push(
      '            VexFamily.Control.Resource<',
      `                ${family.familyName},`,
      `                ${resource.name}`,
      '            >',
    );
  }
  return lines.join('\n');
}

function renderControls(family) {
  if (family.controlForm === 'ENUM') {
    return [
      '    enum class Control :',
      `        VexFamily.Control<${family.familyName}> {`,
      ...family.controls.map((control, index) =>
        `        ${control.name}${index === family.controls.length - 1 ? ',' : ','}`),
      '    }',
    ].join('\n');
  }

  return [
    '    sealed interface Control :',
    `        VexFamily.Control<${family.familyName}> {`,
    family.controls.map((control) => renderControl(family, control)).join('\n\n'),
    '    }',
  ].join('\n');
}

function renderAct(family) {
  const stateBranches = family.states.map((state) => {
    const controlBranches = family.controls.map((control) => {
      const matcher = family.controlForm === 'ENUM'
        ? `Control.${control.name}`
        : control.payloadFields.length || control.resourceIdRefOrNull
          ? `is Control.${control.name}`
          : `Control.${control.name}`;
      return [
        `                    ${matcher} ->`,
        '                        stay()',
      ].join('\n');
    }).join('\n\n');
    return [
      `            State.${state} ->`,
      '                when (control) {',
      controlBranches,
      '                }',
    ].join('\n');
  }).join('\n\n');

  return [
    '    override fun act(',
    '        currentState: State,',
    '        control: Control,',
    '    ): VexFamily.Act<State>? =',
    '        when (currentState) {',
    stateBranches,
    '        }',
  ].join('\n');
}

function renderFamily(family) {
  return [
    `private class ${family.familyName}(`,
    '    initialState: State,',
    '    executionRoot: VexExecutionRoot,',
    ') :',
    '    VexFamily<',
    `        ${family.familyName},`,
    `        ${family.familyName}.State,`,
    `        ${family.familyName}.Control`,
    '    >(',
    '        initialState = initialState,',
    '        executionRoot = executionRoot,',
    '        logger = VexLogger.Sink.None,',
    '    ) {',
    renderState(family),
    renderResources(family),
    renderControls(family),
    renderAct(family),
    '}',
  ].filter((line) => line !== '').join('\n\n');
}

function renderExactTypeFixtures(model) {
  const lines = [];
  for (const family of model.families) {
    if (family.controlForm !== 'SEALED') continue;
    for (const control of family.controls) {
      if (!control.resourceIdRefOrNull) continue;
      const resource = resourceFor(family, control.resourceIdRefOrNull);
      lines.push([
        `private fun require${resource.name}(`,
        `    control: ${family.familyName}.Control.${control.name},`,
        `): ${family.familyName}.${resource.name} =`,
        '    control.resourceId',
      ].join('\n'));
    }
  }
  return lines.join('\n\n');
}

function renderRelationshipExamples(model) {
  const resourceFamily = model.families.find((family) =>
    family.controlForm === 'SEALED' &&
    family.controls.some((control) => control.resourceIdRefOrNull));
  const enumFamily = model.families.find((family) =>
    family.controlForm === 'ENUM' && family.controls.length >= 2);

  const parts = [];
  if (resourceFamily) {
    const control = resourceFamily.controls.find((entry) => entry.resourceIdRefOrNull);
    const resource = resourceFor(resourceFamily, control.resourceIdRefOrNull);
    const payload = control.payloadFields[0] ?? null;
    const payloadArgA = payload ? `, ${payload.name} = 10` : '';
    const payloadArgB = payload ? `, ${payload.name} = 99` : '';
    parts.push([
      '// Same typed ResourceId + unrelated payload change => same relationship identity.',
      `val resourceA = ${resourceFamily.familyName}.${resource.name}("same")`,
      `val first = ${resourceFamily.familyName}.Control.${control.name}(resourceId = resourceA${payloadArgA})`,
      `val second = ${resourceFamily.familyName}.Control.${control.name}(resourceId = resourceA.copy()${payloadArgB})`,
      'assertEquals(family.relationshipId(first), family.relationshipId(second))',
      '',
      '// Different typed ResourceId => different relationship identity.',
      `val resourceB = ${resourceFamily.familyName}.${resource.name}("other")`,
      `assertFalse(family.relationshipId(first) == family.relationshipId(`,
      `    ${resourceFamily.familyName}.Control.${control.name}(resourceId = resourceB${payloadArgA}),`,
      '))',
    ].join('\n'));
  }
  if (enumFamily) {
    const [first, second] = enumFamily.controls;
    parts.push([
      '// Enum entries remain distinct default Control identities.',
      `assertFalse(`,
      `    enumFamily.relationshipId(${enumFamily.familyName}.Control.${first.name}) ==`,
      `        enumFamily.relationshipId(${enumFamily.familyName}.Control.${second.name}),`,
      ')',
    ].join('\n'));
  }
  return parts.join('\n\n');
}

export function compileFamilyKotlin(modelInput) {
  const model = normalizeFamilyKotlinModel(modelInput);
  const familySource = model.families.map(renderFamily).join('\n\n\n');
  const testSource = [
    renderExactTypeFixtures(model),
    renderRelationshipExamples(model),
  ].filter(Boolean).join('\n\n\n');

  return Object.freeze({
    schemaVersion: 'vexboard.family-kotlin-construction-plan/poc-v1',
    modelRef: model.modelRef,
    targetSourceRefOrNull: model.targetSourceRefOrNull,
    testSourceRef: model.testSourceRef,
    familySource,
    testSource,
    externalEffectsPerformed: false,
    sourceRefs: model.sourceRefs,
  });
}

export function rebindControlResource(
  modelInput,
  {
    familyRef,
    controlRef,
    resourceIdRefOrNull,
  },
) {
  const model = normalizeFamilyKotlinModel(modelInput);
  const next = structuredClone(model);
  const family = next.families.find((entry) => entry.familyRef === familyRef);
  assert(family, `unknown Family ${familyRef}`);
  assert(family.controlForm === 'SEALED', `Family ${familyRef} has no resource-bearing Control form`);
  const control = family.controls.find((entry) => entry.controlRef === controlRef);
  assert(control, `unknown Control ${controlRef}`);
  if (resourceIdRefOrNull !== null) {
    assert(family.resources.some((entry) => entry.resourceRef === resourceIdRefOrNull),
      `resource ${resourceIdRefOrNull} does not belong to Family ${familyRef}`);
  }
  control.resourceIdRefOrNull = resourceIdRefOrNull;
  return normalizeFamilyKotlinModel(next);
}

// [VXG RealForever][VEXWORK][VEXBOARD][FAMILY-KOTLIN-CONSTRUCTION]
