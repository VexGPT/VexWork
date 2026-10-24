export const BOARD_SOURCE_CATALOG_SCHEMA = 'vexboard.board-source-catalog/v1';
export const BOARD_SOURCE_RESOLUTION_SCHEMA = 'vexboard.board-source-resolution/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function compareCanonicalText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function exactKeys(value, keys, label) {
  assert(isObject(value), `${label} must be one object`);
  const actual = Object.keys(value).sort(compareCanonicalText);
  const expected = [...keys].sort(compareCanonicalText);
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${label} schema drift`);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const accepted = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(accepted).size === accepted.length, `${label} must be unique`);
  return accepted.sort(compareCanonicalText);
}

function relativeJsonLocation(value, label) {
  assert(typeof value === 'string' && value.startsWith('./') && value.endsWith('.json'),
    `${label} must be one relative JSON location`);
  const parts = value.slice(2).split('/');
  assert(parts.length > 0 && parts.every((part) => part && part !== '.' && part !== '..'),
    `${label} must stay inside its source root`);
  assert(!value.includes('\\') && !value.includes('?') && !value.includes('#') && !value.includes('%'),
    `${label} must be a plain relative JSON location`);
  return value;
}

function normalizeEntry(input) {
  exactKeys(input, ['boardRef', 'location', 'sourceRefs'], 'board source entry');
  const boardRef = stableRef(input.boardRef, 'board source entry.boardRef');
  return {
    boardRef,
    location: relativeJsonLocation(input.location, `board source ${boardRef}.location`),
    sourceRefs: Object.freeze(refs(input.sourceRefs, `board source ${boardRef}.sourceRefs`)),
  };
}

export function normalizeBoardSourceCatalog(input) {
  exactKeys(input, ['schemaVersion', 'catalogRef', 'entries', 'sourceRefs'], 'BoardSourceCatalog');
  assert(input.schemaVersion === BOARD_SOURCE_CATALOG_SCHEMA, 'BoardSourceCatalog schema mismatch');
  const catalogRef = stableRef(input.catalogRef, 'BoardSourceCatalog.catalogRef');
  assert(Array.isArray(input.entries), 'BoardSourceCatalog.entries must be an array');
  const entries = input.entries.map(normalizeEntry)
    .sort((left, right) => compareCanonicalText(left.boardRef, right.boardRef));
  assert(new Set(entries.map((entry) => entry.boardRef)).size === entries.length,
    `BoardSourceCatalog ${catalogRef} boardRef must be unique`);
  return Object.freeze({
    schemaVersion: BOARD_SOURCE_CATALOG_SCHEMA,
    catalogRef,
    entries: Object.freeze(entries.map((entry) => Object.freeze(entry))),
    sourceRefs: Object.freeze(refs(input.sourceRefs, `BoardSourceCatalog ${catalogRef}.sourceRefs`)),
  });
}

export function catalogFromBoardUrlMap({ catalogRef, urls, sourceRefs = [] }) {
  assert(isObject(urls), 'board URL map must be one object');
  return normalizeBoardSourceCatalog({
    schemaVersion: BOARD_SOURCE_CATALOG_SCHEMA,
    catalogRef,
    entries: Object.entries(urls).map(([boardRef, location]) => ({
      boardRef,
      location,
      sourceRefs: [],
    })),
    sourceRefs,
  });
}

export function resolveBoardSource(boardRefInput, catalogInputs) {
  const boardRef = stableRef(boardRefInput, 'boardRef');
  assert(Array.isArray(catalogInputs), 'board source catalogs must be an array');
  const catalogs = catalogInputs.map(normalizeBoardSourceCatalog);
  assert(new Set(catalogs.map((catalog) => catalog.catalogRef)).size === catalogs.length,
    'board source catalogRef must be unique');

  const matches = [];
  for (const catalog of catalogs) {
    const entry = catalog.entries.find((candidate) => candidate.boardRef === boardRef);
    if (entry) matches.push({ catalog, entry });
  }
  assert(matches.length <= 1,
    `ambiguous board source ${boardRef}: ${matches.map(({ catalog }) => catalog.catalogRef).sort().join(', ')}`);
  if (matches.length === 0) return null;

  const { catalog, entry } = matches[0];
  return Object.freeze({
    schemaVersion: BOARD_SOURCE_RESOLUTION_SCHEMA,
    boardRef,
    catalogRef: catalog.catalogRef,
    location: entry.location,
    sourceRefs: Object.freeze(refs([
      ...catalog.sourceRefs,
      ...entry.sourceRefs,
    ], `board source resolution ${boardRef}.sourceRefs`)),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SOURCE-RESOLVER]
