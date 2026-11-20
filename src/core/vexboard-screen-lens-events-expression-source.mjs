import {
  elementFor,
  screenFor,
} from '../shared/vexboard-screen-lens.mjs';
import {
  compact,
  matchClose,
  splitArgs,
} from './vexboard-screen-lens-android-adapter.mjs';

export const EVENTS_EXPRESSION_SOURCE_SCHEMA =
  'vexboard.screen-lens-events-expression-source/v1';

export const EVENTS_EXPRESSION_SOURCE_FILES = Object.freeze({
  eventsScreen:
    'app/src/main/kotlin/com/vextreme/vexlife/android/screens/primary/events/EventsScreen.kt',
  eventsRelay:
    'app/src/main/kotlin/com/vextreme/vexlife/android/screens/primary/events/EventsConvergenceRelay.kt',
  stableList:
    'architecture/elements/src/main/kotlin/com/vextreme/vexlife/android/elements/VexStableLazyList.kt',
});

const SOURCE_REFS = Object.freeze({
  eventsScreen: 'app:screens/primary/events/EventsScreen.kt',
  eventsRelay: 'app:screens/primary/events/EventsConvergenceRelay.kt',
  stableList: 'arch:elements/src/main/kotlin/com/vextreme/vexlife/android/elements/VexStableLazyList.kt',
});

const SCREEN_REF = 'screen.events';

function fail(message) {
  throw new TypeError(`events expression source: ${message}`);
}

function requiredFile(files, path) {
  if (!(files instanceof Map)) fail('files must be a Map of repository path -> source text');
  const value = files.get(path);
  if (typeof value !== 'string') fail(`missing source ${path}`);
  return value;
}

function requirePattern(text, pattern, label) {
  if (!pattern.test(text)) fail(`source shape not proven: ${label}`);
}

function functionBody(text, functionName) {
  const match = new RegExp(`\\bfun\\s+${functionName}\\s*\\(`).exec(text);
  if (!match) fail(`source shape not proven: fun ${functionName}(...)`);
  const paramsOpen = text.indexOf('(', match.index + match[0].length - 1);
  const paramsClose = matchClose(text, paramsOpen);
  const bodyOpen = text.indexOf('{', paramsClose);
  if (bodyOpen < 0) fail(`source shape not proven: fun ${functionName} body`);
  return text.slice(bodyOpen + 1, matchClose(text, bodyOpen));
}

function namedArg(args, name) {
  return args.find((arg) => arg.name === name)?.value ?? null;
}

function stringLiteral(value) {
  const match = /^"([^"]+)"$/.exec(compact(value));
  return match?.[1] ?? null;
}

function requireElement(lens, ref) {
  const element = elementFor(lens, ref);
  if (!element) fail(`Lens coordinate missing: ${ref}`);
  return element;
}

function parsePreviewEvents(text) {
  const body = functionBody(text, 'eventsAttentionPreviewRepositories');
  const events = [];
  for (const match of body.matchAll(/VexExternalEvent\s*\(/g)) {
    const open = body.indexOf('(', match.index + match[0].length - 1);
    const args = splitArgs(body.slice(open + 1, matchClose(body, open)));
    const itemRef = stringLiteral(namedArg(args, 'eventRef') ?? '');
    const label = stringLiteral(namedArg(args, 'title') ?? '');
    if (itemRef?.startsWith('event.preview.') && label) events.push({ itemRef, label });
  }
  if (events.length !== 3) {
    fail(`Events attention preview must retain exactly three source-authored events, found ${events.length}`);
  }
  if (new Set(events.map((event) => event.itemRef)).size !== events.length) {
    fail('Events attention preview event refs must remain unique');
  }
  return events;
}

function relationship(value) {
  return {
    relationshipRef: value.relationshipRef,
    kind: value.kind,
    subjectRef: value.subjectRef,
    elementRefs: value.elementRefs ?? [],
    pathwayRefs: value.pathwayRefs ?? [],
    sourceRefs: value.sourceRefs ?? [],
    defaultValueRef: value.defaultValueRef ?? null,
    values: value.values ?? [],
  };
}

function value(valueRef, { elementRefs = [], pathwayRefs = [], runtimeItems = [], sourceRefs = [] } = {}) {
  return { valueRef, elementRefs, pathwayRefs, runtimeItems, sourceRefs };
}

function structuralRuntimeItem(item) {
  return {
    itemRef: item.itemRef,
    label: item.label ?? null,
    realizationRef: item.realizationRef,
    sourceRefs: item.sourceRefs ?? [],
  };
}

function structuralValue(entry) {
  return {
    valueRef: entry.valueRef,
    elementRefs: entry.elementRefs ?? [],
    pathwayRefs: entry.pathwayRefs ?? [],
    runtimeItems: (entry.runtimeItems ?? []).map(structuralRuntimeItem),
    sourceRefs: entry.sourceRefs ?? [],
  };
}

function sourceOwnedRelationshipShape(entry) {
  return {
    relationshipRef: entry.relationshipRef,
    kind: entry.kind,
    subjectRef: entry.subjectRef,
    elementRefs: entry.elementRefs ?? [],
    pathwayRefs: entry.pathwayRefs ?? [],
    sourceRefs: entry.sourceRefs ?? [],
    defaultValueRef: entry.defaultValueRef ?? null,
    values: (entry.values ?? []).map(structuralValue),
  };
}

export function eventsExpressionSourceReadPlan() {
  return Object.freeze(Object.values(EVENTS_EXPRESSION_SOURCE_FILES));
}

export function projectEventsExpressionSource({ lens, files, sourceRevisionRef }) {
  if (!lens || typeof lens !== 'object') fail('normalized Screen Lens is required');
  const screen = screenFor(lens, SCREEN_REF);
  if (screen.symbol !== 'EventsScreen') fail(`${SCREEN_REF} is not EventsScreen`);
  if (typeof sourceRevisionRef !== 'string' ||
      !/^git\.commit\.vexlife-android\.[0-9a-f]{40}$/.test(sourceRevisionRef)) {
    fail('sourceRevisionRef must be an exact VexLife-Android commit ref');
  }

  const eventsScreen = requiredFile(files, EVENTS_EXPRESSION_SOURCE_FILES.eventsScreen);
  const eventsRelay = requiredFile(files, EVENTS_EXPRESSION_SOURCE_FILES.eventsRelay);
  const stableList = requiredFile(files, EVENTS_EXPRESSION_SOURCE_FILES.stableList);

  requirePattern(
    eventsScreen,
    /object\s+EventsScreen\s*:\s*AppScreenBlueprint\([\s\S]*?screenKey\s*=\s*"events"/,
    'EventsScreen screenKey',
  );
  requirePattern(
    eventsScreen,
    /override\s+val\s+content\s*=\s*layout\s*\{[\s\S]*?scrollableColumn\(\s*"body"\s*\)/,
    'EventsScreen registered body',
  );

  const content = functionBody(eventsScreen, 'EventsScreenContent');
  requirePattern(
    content,
    /VexStableLazyColumn\s*\([\s\S]*?listRef\s*=\s*EventsScreen\.content\.element\.elementId[\s\S]*?items\s*=\s*displayedEvents[\s\S]*?itemRef\s*=\s*VexExternalEvent::eventRef/,
    'Events stable list uses registered body and eventRef identity',
  );
  requirePattern(
    stableList,
    /items\s*\([\s\S]*?items\s*=\s*items[\s\S]*?key\s*=\s*itemRef/,
    'VexStableLazyColumn uses itemRef as Compose key',
  );

  requirePattern(
    eventsRelay,
    /data\s+object\s+Unobserved\s*:\s*EventsConvergenceListState/,
    'Events Unobserved list state',
  );
  requirePattern(
    eventsRelay,
    /data\s+object\s+Empty\s*:\s*EventsConvergenceListState/,
    'Events Empty list state',
  );
  requirePattern(
    eventsRelay,
    /data\s+class\s+Content\s*\([\s\S]*?events\s*:\s*List<VexExternalEvent>/,
    'Events Content list state',
  );
  requirePattern(
    eventsRelay,
    /val\s+list\s*:\s*EventsConvergenceListState\s*=\s*EventsConvergenceListState\.Unobserved/,
    'Events source default remains Unobserved',
  );
  requirePattern(
    eventsRelay,
    /events\.isNotEmpty\(\)\s*->[\s\S]*?EventsConvergenceListState\.Content[\s\S]*?currentFeed\s*==\s*null\s*->[\s\S]*?EventsConvergenceListState\.Unobserved[\s\S]*?else\s*->[\s\S]*?EventsConvergenceListState\.Empty/,
    'Events convergence preserves Content / Unobserved / Empty distinction',
  );

  const body = requireElement(lens, 'element.events.body');
  const previewEvents = parsePreviewEvents(eventsScreen);

  const relationships = [
    relationship({
      relationshipRef: 'relationship.events.screen.registered',
      kind: 'REGISTERED',
      subjectRef: SCREEN_REF,
      elementRefs: [body.ref],
      sourceRefs: [SOURCE_REFS.eventsScreen],
    }),
    relationship({
      relationshipRef: 'relationship.events.repeated-realization',
      kind: 'REALIZED_AS',
      subjectRef: body.ref,
      elementRefs: [body.ref],
      sourceRefs: [SOURCE_REFS.eventsScreen, SOURCE_REFS.stableList],
    }),
    relationship({
      relationshipRef: 'relationship.events.population',
      kind: 'POPULATES',
      subjectRef: body.ref,
      sourceRefs: [SOURCE_REFS.eventsScreen, SOURCE_REFS.eventsRelay],
      defaultValueRef: 'population.unobserved',
      values: [
        value('population.unobserved'),
        value('population.empty'),
        value('population.preview', {
          runtimeItems: previewEvents.map((event) => ({
            itemRef: event.itemRef,
            label: event.label,
            realizationRef: body.ref,
            sourceRefs: [SOURCE_REFS.eventsScreen],
          })),
        }),
      ],
    }),
  ];

  return Object.freeze({
    schemaVersion: EVENTS_EXPRESSION_SOURCE_SCHEMA,
    screenRef: SCREEN_REF,
    sourceRevisionRef,
    relationships: Object.freeze(relationships),
    externalRelationshipRefs: Object.freeze([]),
  });
}

export function compareEventsExpressionFixtureSource({ fixture, projection }) {
  if (!fixture || !Array.isArray(fixture.relationships) || !Array.isArray(fixture.expressions)) {
    fail('normalized expression fixture is required');
  }
  if (!projection || projection.schemaVersion !== EVENTS_EXPRESSION_SOURCE_SCHEMA) {
    fail(`projection schemaVersion must be ${EVENTS_EXPRESSION_SOURCE_SCHEMA}`);
  }

  const findings = [];
  if (fixture.screenRef !== projection.screenRef) {
    findings.push(`screenRef ${fixture.screenRef} != ${projection.screenRef}`);
  }
  if (fixture.sourceRevisionRef !== projection.sourceRevisionRef) {
    findings.push(`sourceRevisionRef ${fixture.sourceRevisionRef} != ${projection.sourceRevisionRef}`);
  }

  const fixtureByRef = new Map(fixture.relationships.map((entry) => [entry.relationshipRef, entry]));
  const projectedRefs = new Set(projection.relationships.map((entry) => entry.relationshipRef));
  for (const projected of projection.relationships) {
    const authored = fixtureByRef.get(projected.relationshipRef);
    if (!authored) {
      findings.push(`fixture missing source-derived relationship ${projected.relationshipRef}`);
      continue;
    }
    if (JSON.stringify(sourceOwnedRelationshipShape(authored)) !==
        JSON.stringify(sourceOwnedRelationshipShape(projected))) {
      findings.push(`${projected.relationshipRef} differs from Android source projection`);
    }
  }
  for (const entry of fixture.relationships) {
    if (!projectedRefs.has(entry.relationshipRef)) {
      findings.push(`${entry.relationshipRef} has no Android source owner in this projector`);
    }
  }

  const sourceValueRefs = new Map(
    projection.relationships.map((entry) => [
      entry.relationshipRef,
      new Set((entry.values ?? []).map((value) => value.valueRef)),
    ]),
  );
  for (const expression of fixture.expressions) {
    for (const relationshipRef of expression.relationshipRefs) {
      if (!projectedRefs.has(relationshipRef)) {
        findings.push(`${expression.expressionRef} uses unowned relationship ${relationshipRef}`);
      }
    }
    for (const [relationshipRef, valueRef] of Object.entries(expression.assignments)) {
      const values = sourceValueRefs.get(relationshipRef);
      if (values && !values.has(valueRef)) {
        findings.push(`${expression.expressionRef} assigns ${relationshipRef}=${valueRef}, not source-derived`);
      }
    }
  }

  return Object.freeze({
    state: findings.length ? 'STALE' : 'PASS',
    findings: Object.freeze(findings),
    sourceRelationshipCount: projection.relationships.length,
    representativeExpressionCount: fixture.expressions.length,
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EVENTS][EXPRESSIONS][SOURCE]
