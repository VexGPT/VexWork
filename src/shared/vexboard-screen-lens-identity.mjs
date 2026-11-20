// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][IDENTITY]
//
// Portable Screen Lens identity formation.
//
// This is deliberately smaller than a universal naming scheme:
// - source-owned stable refs remain source-owned;
// - presentation containment remains parentRef;
// - only derived child refs and runtime-instance refs need a shared mechanical law.
//
// The runtime-instance encoding matches the accepted Android VexStreamPresentationRefs shape:
// stable base ref + ".dynamic.utf8hex." + UTF-8 hex of stable instance parts joined by NUL.
// A producer may implement the same law in Kotlin, JavaScript, Swift, Rust, etc.

export const SCREEN_LENS_IDENTITY_KINDS = Object.freeze({
  DERIVED_CHILD: 'DERIVED_CHILD',
  RUNTIME_INSTANCE: 'RUNTIME_INSTANCE',
});

export const SCREEN_LENS_INSTANCE_ENCODING = 'UTF8_HEX_NUL_PARTS';

export const SCREEN_LENS_INSTANCE_CONTINUITY = Object.freeze({
  STABLE_INSTANCE: 'STABLE_INSTANCE',
  CURRENT_OCCURRENCE: 'CURRENT_OCCURRENCE',
});

function fail(message) {
  throw new TypeError(`screen lens identity: ${message}`);
}

function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a non-empty string`);
  return value;
}

function optionalText(value, label) {
  if (value === undefined || value === null) return null;
  return text(value, label);
}

function instanceContinuity(value, label) {
  const continuity = text(value, label);
  if (!Object.values(SCREEN_LENS_INSTANCE_CONTINUITY).includes(continuity)) {
    fail(`${label} ${continuity} is unknown`);
  }
  return continuity;
}

export function normalizeLensIdentityPath(value) {
  const normalized = text(value, 'local path')
    .trim()
    .replaceAll('/', '.')
    .replace(/\s+/g, '-')
    .replace(/^\.+|\.+$/g, '');
  if (!normalized) fail('local path must not normalize to blank');
  return normalized;
}

export function appendLensIdentityPath(parentRef, childPath) {
  return text(parentRef, 'parent ref') + '.' + normalizeLensIdentityPath(childPath);
}

export function utf8Hex(value) {
  const source = text(value, 'identity part');
  return [...new TextEncoder().encode(source)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function dynamicLensInstanceRef(baseRef, parts) {
  const root = text(baseRef, 'dynamic identity base ref');
  if (!Array.isArray(parts) || !parts.length) fail('dynamic identity parts must be a non-empty array');
  const values = parts.map((part, index) => text(part, `dynamic identity part ${index}`));
  return root + '.dynamic.utf8hex.' + utf8Hex(values.join('\u0000'));
}

export function normalizeInstanceIdentityContract(input, label = 'instance identity') {
  if (input === undefined || input === null) return null;
  if (!input || typeof input !== 'object') fail(`${label} must be an object`);
  if (input.kind !== SCREEN_LENS_IDENTITY_KINDS.RUNTIME_INSTANCE) {
    fail(`${label} kind ${input.kind} must be RUNTIME_INSTANCE`);
  }
  const baseRef = text(input.baseRef, `${label} baseRef`);
  const partSources = (input.partSources || []).map((part, index) =>
    text(part, `${label} partSources[${index}]`),
  );
  if (!partSources.length) fail(`${label} partSources must be non-empty`);
  const encoding = optionalText(input.encoding, `${label} encoding`) ?? SCREEN_LENS_INSTANCE_ENCODING;
  if (encoding !== SCREEN_LENS_INSTANCE_ENCODING) {
    fail(`${label} encoding ${encoding} is unknown`);
  }
  const continuity = instanceContinuity(input.continuity, `${label} continuity`);
  return Object.freeze({
    kind: input.kind,
    baseRef,
    partSources: Object.freeze(partSources),
    encoding,
    continuity,
  });
}

export function normalizeElementIdentity(input, { ref, parentRef }) {
  if (input === undefined || input === null) return null;
  if (!input || typeof input !== 'object') fail(`${ref} identity must be an object`);
  if (!Object.values(SCREEN_LENS_IDENTITY_KINDS).includes(input.kind)) {
    fail(`${ref} identity kind ${input.kind} is unknown`);
  }

  if (input.kind === SCREEN_LENS_IDENTITY_KINDS.DERIVED_CHILD) {
    if (!parentRef) fail(`${ref} derived child identity requires parentRef`);
    const localPath = normalizeLensIdentityPath(input.localPath);
    const expected = appendLensIdentityPath(parentRef, localPath);
    if (expected !== ref) fail(`${ref} does not match derived child identity ${expected}`);
    return Object.freeze({
      kind: input.kind,
      localPath,
    });
  }

  const baseRef = text(input.baseRef, `${ref} identity baseRef`);
  const instanceParts = (input.instanceParts || []).map((part, index) =>
    text(part, `${ref} identity instanceParts[${index}]`),
  );
  const encoding = optionalText(input.encoding, `${ref} identity encoding`) ?? SCREEN_LENS_INSTANCE_ENCODING;
  if (encoding !== SCREEN_LENS_INSTANCE_ENCODING) {
    fail(`${ref} identity encoding ${encoding} is unknown`);
  }
  const expected = dynamicLensInstanceRef(baseRef, instanceParts);
  if (expected !== ref) fail(`${ref} does not match runtime instance identity ${expected}`);
  const continuity = instanceContinuity(input.continuity, `${ref} identity continuity`);
  return Object.freeze({
    kind: input.kind,
    baseRef,
    instanceParts: Object.freeze(instanceParts),
    encoding,
    continuity,
  });
}
