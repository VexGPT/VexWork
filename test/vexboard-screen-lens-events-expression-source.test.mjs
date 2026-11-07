import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Lens from '../src/shared/vexboard-screen-lens.mjs';
import {
  normalizeScreenLensExpressionFixture,
  resolveScreenLensExpression,
} from '../src/shared/vexboard-screen-lens-expressions.mjs';
import {
  EVENTS_EXPRESSION_SOURCE_FILES,
  compareEventsExpressionFixtureSource,
  eventsExpressionSourceReadPlan,
  projectEventsExpressionSource,
} from '../src/core/vexboard-screen-lens-events-expression-source.mjs';

const lens = Lens.normalizeScreenLens(
  JSON.parse(
    fs.readFileSync(
      new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url),
      'utf8',
    ),
  ),
);
const fixtureSource = JSON.parse(
  fs.readFileSync(
    new URL(
      '../projects/vexboard/examples/vexlife-android-events.screen-lens-expressions.fixture.json',
      import.meta.url,
    ),
    'utf8',
  ),
);
const fixture = normalizeScreenLensExpressionFixture(lens, fixtureSource);
const SOURCE_REVISION =
  'git.commit.vexlife-android.ecbb6987d1da338fa0adf7297456d3f652f04155';

function sourceFiles(overrides = {}) {
  const source = {
    [EVENTS_EXPRESSION_SOURCE_FILES.eventsScreen]: `
      object EventsScreen : AppScreenBlueprint(
        screenKey = "events",
        titleRes = R.string.events_title,
      ) {
        override val content = layout {
          scrollableColumn("body") {
            text(
              id = "empty",
            )
          }
        }
      }

      fun EventsScreenContent(
        runtime: VexRuntime,
        relay: EventsConvergenceRelay,
      ) {
        val displayedEvents =
          presentationEvents ?: attention.events

        VexStableLazyColumn(
          listRef = EventsScreen.content.element.elementId,
          items = displayedEvents,
          itemRef = VexExternalEvent::eventRef,
          contentType = { "events-event-row" },
        ) { event ->
          EventRow(event = event)
        }
      }

      private fun eventsAttentionPreviewRepositories(): AppRepositories {
        val events = RelayEventsRepository()
        val sourceRef = "source.preview.external-information"

        events.accept(
          VexExternalEventSourceSnapshot(
            sourceRef = sourceRef,
            sourceRevision = 1L,
            events = listOf(
              VexExternalEvent(
                eventRef = "event.preview.message.001",
                sourceRef = sourceRef,
                kind = VexExternalEventKind.MESSAGE,
                title = "Preview message",
                detail = "message",
                occurredAtEpochMillis = 1_000L,
              ),
              VexExternalEvent(
                eventRef = "event.preview.call.002",
                sourceRef = sourceRef,
                kind = VexExternalEventKind.CALL,
                title = "Preview call",
                detail = "call",
                occurredAtEpochMillis = 2_000L,
              ),
              VexExternalEvent(
                eventRef = "event.preview.map.003",
                sourceRef = sourceRef,
                kind = VexExternalEventKind.MAP,
                title = "Preview map update",
                detail = "map",
                occurredAtEpochMillis = 3_000L,
              ),
            ),
          ),
        )
        return repositories
      }
    `,
    [EVENTS_EXPRESSION_SOURCE_FILES.eventsRelay]: `
      sealed interface EventsConvergenceListState {
        data object Unobserved : EventsConvergenceListState
        data object Empty : EventsConvergenceListState
        data class Content(
          val events: List<VexExternalEvent>,
        ) : EventsConvergenceListState
      }

      data class EventsConvergenceOutputState(
        val list: EventsConvergenceListState =
          EventsConvergenceListState.Unobserved,
      )

      fun converge(currentFeed: Any?, events: List<VexExternalEvent>) {
        val listState =
          when {
            events.isNotEmpty() ->
              EventsConvergenceListState.Content(
                events = events,
              )

            currentFeed == null ->
              EventsConvergenceListState.Unobserved

            else ->
              EventsConvergenceListState.Empty
          }
      }
    `,
    [EVENTS_EXPRESSION_SOURCE_FILES.stableList]: `
      fun <Item> VexStableLazyColumn(
        items: List<Item>,
        itemRef: (Item) -> String,
        itemContent: (Item) -> Unit,
      ) {
        LazyColumn {
          items(
            items = items,
            key = itemRef,
            itemContent = itemContent,
          )
        }
      }
    `,
    ...overrides,
  };
  return new Map(Object.entries(source));
}

function projection(files = sourceFiles()) {
  return projectEventsExpressionSource({
    lens,
    files,
    sourceRevisionRef: SOURCE_REVISION,
  });
}

function resolve(expressionRef) {
  return resolveScreenLensExpression(lens, fixture, expressionRef);
}

test('Events is a bounded three-file second-consumer source reader', () => {
  assert.deepEqual(
    eventsExpressionSourceReadPlan(),
    Object.values(EVENTS_EXPRESSION_SOURCE_FILES),
  );
  assert.equal(eventsExpressionSourceReadPlan().length, 3);
});

test('Events source reproduces the accepted second-consumer relationship skeleton', () => {
  const compared = compareEventsExpressionFixtureSource({
    fixture,
    projection: projection(),
  });

  assert.equal(compared.state, 'PASS');
  assert.deepEqual(compared.findings, []);
  assert.equal(compared.sourceRelationshipCount, 3);
  assert.equal(compared.representativeExpressionCount, 3);
});

test('Events keeps Unobserved distinct from observed Empty instead of collapsing empty runtime rows', () => {
  const defaults = resolve('expression.events.source-defaults');
  const observedEmpty = resolve('expression.events.observed-empty');

  assert.equal(
    defaults.assignments['relationship.events.population'],
    'population.unobserved',
  );
  assert.equal(
    observedEmpty.assignments['relationship.events.population'],
    'population.empty',
  );
  assert.deepEqual(defaults.surface.runtimeItems, []);
  assert.deepEqual(observedEmpty.surface.runtimeItems, []);
  assert.ok(defaults.surface.elementRefs.includes('element.events.body'));
  assert.deepEqual(defaults.structure.elementRefs, defaults.surface.elementRefs);
});

test('Events Preview preserves eventRef runtime identity under the existing static body coordinate', () => {
  const resolved = resolve('expression.events.preview-populated');

  assert.deepEqual(
    resolved.surface.runtimeItems.map((item) => [
      item.itemRef,
      item.label,
      item.realizationRef,
    ]),
    [
      ['event.preview.message.001', 'Preview message', 'element.events.body'],
      ['event.preview.call.002', 'Preview call', 'element.events.body'],
      ['event.preview.map.003', 'Preview map update', 'element.events.body'],
    ],
  );
  assert.ok(
    resolved.surface.runtimeItems.every(
      (item) => Lens.elementFor(lens, item.itemRef) === null,
    ),
  );
  assert.ok(resolved.surface.elementRefs.includes('element.events.body'));
});

test('Events proves existing expression vocabulary without importing attention Scenario state', () => {
  assert.deepEqual(
    fixture.relationships.map((entry) => entry.kind),
    ['REGISTERED', 'REALIZED_AS', 'POPULATES'],
  );
  assert.deepEqual(
    fixture.expressions.map((entry) => entry.basis),
    ['SOURCE_DEFAULT', 'SOURCE_AXIS', 'SOURCE_AXIS'],
  );
  const structuralMeaning = {
    relationships: fixture.relationships.map((entry) => ({
      relationshipRef: entry.relationshipRef,
      kind: entry.kind,
      subjectRef: entry.subjectRef,
      elementRefs: entry.elementRefs,
      pathwayRefs: entry.pathwayRefs,
      sourceRefs: entry.sourceRefs,
      defaultValueRef: entry.defaultValueRef,
      values: entry.values,
    })),
    expressions: fixture.expressions.map((entry) => ({
      expressionRef: entry.expressionRef,
      basis: entry.basis,
      relationshipRefs: entry.relationshipRefs,
      assignments: entry.assignments,
      sourceRefs: entry.sourceRefs,
      evidenceRefs: entry.evidenceRefs,
    })),
  };
  assert.equal(
    JSON.stringify(structuralMeaning).includes('EventsAttentionLabScenario'),
    false,
  );
  assert.equal(
    JSON.stringify(structuralMeaning).toLowerCase().includes('scenario'),
    false,
    'Scenario may be named in explanatory prose, but it must not enter structural expression meaning',
  );
});

test('Events source projection fails closed on currentness, runtime host, identity, or stable-list drift', () => {
  const defaultDrift = sourceFiles({
    [EVENTS_EXPRESSION_SOURCE_FILES.eventsRelay]:
      sourceFiles().get(EVENTS_EXPRESSION_SOURCE_FILES.eventsRelay)
        .replace(
          'EventsConvergenceListState.Unobserved,',
          'EventsConvergenceListState.Empty,',
        ),
  });
  assert.throws(
    () => projection(defaultDrift),
    /Events source default remains Unobserved/,
  );

  const hostDrift = sourceFiles({
    [EVENTS_EXPRESSION_SOURCE_FILES.eventsScreen]:
      sourceFiles().get(EVENTS_EXPRESSION_SOURCE_FILES.eventsScreen)
        .replace(
          'listRef = EventsScreen.content.element.elementId',
          'listRef = "runtime.events"',
        ),
  });
  assert.throws(
    () => projection(hostDrift),
    /Events stable list uses registered body and eventRef identity/,
  );

  const identityDrift = sourceFiles({
    [EVENTS_EXPRESSION_SOURCE_FILES.eventsScreen]:
      sourceFiles().get(EVENTS_EXPRESSION_SOURCE_FILES.eventsScreen)
        .replace(
          'itemRef = VexExternalEvent::eventRef',
          'itemRef = { event -> event.title }',
        ),
  });
  assert.throws(
    () => projection(identityDrift),
    /Events stable list uses registered body and eventRef identity/,
  );

  const keyDrift = sourceFiles({
    [EVENTS_EXPRESSION_SOURCE_FILES.stableList]:
      sourceFiles().get(EVENTS_EXPRESSION_SOURCE_FILES.stableList)
        .replace('key = itemRef', 'key = { index -> index }'),
  });
  assert.throws(
    () => projection(keyDrift),
    /VexStableLazyColumn uses itemRef as Compose key/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EVENTS][EXPRESSIONS][SOURCE][TEST]
