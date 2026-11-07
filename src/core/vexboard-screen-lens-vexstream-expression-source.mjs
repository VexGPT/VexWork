import {
  elementFor,
  pathwayFor,
  screenFor,
} from '../shared/vexboard-screen-lens.mjs';
import {
  compact,
  matchClose,
  splitArgs,
} from './vexboard-screen-lens-android-adapter.mjs';

export const VEXSTREAM_EXPRESSION_SOURCE_SCHEMA =
  'vexboard.screen-lens-vexstream-expression-source/v1';

export const VEXSTREAM_EXPRESSION_SOURCE_FILES = Object.freeze({
  musicScreen:
    'app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/vexstream/VexStreamMusicScreen.kt',
  librarySurface:
    'app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/vexstream/VexStreamLibrarySurface.kt',
  libraryPresentation:
    'app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/vexstream/VexStreamLibraryPresentation.kt',
  connectionPresentation:
    'app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/vexstream/VexStreamConnectionPresentation.kt',
  musicState:
    'app/src/main/kotlin/com/vextreme/vexlife/android/data/vexstream/VexStreamMusicState.kt',
  playbackDisplay:
    'app/src/main/kotlin/com/vextreme/vexlife/android/vexstream/playback/VexStreamPlaybackDisplayState.kt',
  stableList:
    'architecture/elements/src/main/kotlin/com/vextreme/vexlife/android/elements/VexStableLazyList.kt',
});

const SOURCE_REFS = Object.freeze({
  musicScreen: 'app:screens/shared/vexstream/VexStreamMusicScreen.kt',
  librarySurface: 'app:screens/shared/vexstream/VexStreamLibrarySurface.kt',
  libraryPresentation: 'app:screens/shared/vexstream/VexStreamLibraryPresentation.kt',
  connectionPresentation: 'app:screens/shared/vexstream/VexStreamConnectionPresentation.kt',
  musicState: 'app:data/vexstream/VexStreamMusicState.kt',
  playbackDisplay: 'app:vexstream/playback/VexStreamPlaybackDisplayState.kt',
  stableList: 'arch:elements/src/main/kotlin/com/vextreme/vexlife/android/elements/VexStableLazyList.kt',
});

const SCREEN_REF = 'screen.vexstream-music';
const EXTERNAL_RELATIONSHIP_REFS = Object.freeze([
  'relationship.vexstream.songs.evidence',
]);

function fail(message) {
  throw new TypeError(`vexstream expression source: ${message}`);
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

function callArgsForVal(text, valName, callee) {
  const pattern = new RegExp(`\\bval\\s+${valName}\\s*=\\s*${callee}\\s*\\(`);
  const match = pattern.exec(text);
  if (!match) fail(`source shape not proven: val ${valName} = ${callee}(...)`);
  const open = text.indexOf('(', match.index + match[0].length - 1);
  return splitArgs(text.slice(open + 1, matchClose(text, open)));
}

function namedArg(args, name) {
  return args.find((arg) => arg.name === name)?.value ?? null;
}

function requireElement(lens, ref, symbol = null) {
  const element = elementFor(lens, ref);
  if (!element) fail(`Lens coordinate missing: ${ref}`);
  if (symbol && element.symbol !== symbol) {
    fail(`Lens coordinate ${ref} is ${element.symbol ?? 'unsymbolized'}, expected ${symbol}`);
  }
  return element;
}

function requireElementBySymbol(lens, symbol) {
  const screen = screenFor(lens, SCREEN_REF);
  const matches = screen.elements.filter((element) => element.symbol === symbol);
  if (matches.length !== 1) fail(`Lens symbol ${symbol} resolves ${matches.length} elements`);
  return matches[0];
}

function requireElementPathway(lens, symbol) {
  const element = requireElementBySymbol(lens, symbol);
  if (!element.pathwayRef || !pathwayFor(lens, element.pathwayRef)) {
    fail(`Lens element ${symbol} has no projected pathway`);
  }
  return element.pathwayRef;
}

function requireRefPathway(lens, ref) {
  const element = requireElement(lens, ref);
  if (!element.pathwayRef || !pathwayFor(lens, element.pathwayRef)) {
    fail(`Lens element ${ref} has no projected pathway`);
  }
  return element.pathwayRef;
}

function parsePreviewTracks(text) {
  const start = text.indexOf('internal fun vexStreamPreviewState()');
  if (start < 0) fail('source shape not proven: vexStreamPreviewState()');
  const open = text.indexOf('{', start);
  const body = text.slice(open + 1, matchClose(text, open));
  const tracks = [];
  for (const match of body.matchAll(/val\s+(\w+)\s*=\s*VexStreamTrack\s*\(/g)) {
    const argsOpen = body.indexOf('(', match.index + match[0].length - 1);
    const args = splitArgs(body.slice(argsOpen + 1, matchClose(body, argsOpen)));
    const trackRefRaw = namedArg(args, 'trackRef');
    const titleRaw = namedArg(args, 'title');
    const trackRef = /VexStreamTrackRef\(\s*"([^"]+)"\s*\)/.exec(trackRefRaw ?? '')?.[1] ?? null;
    const title = /^"([^"]+)"$/.exec(titleRaw ?? '')?.[1] ?? null;
    if (trackRef?.startsWith('preview.')) tracks.push({ itemRef: trackRef, label: title });
  }
  if (tracks.length !== 2 || tracks.some((track) => !track.label)) {
    fail('preview relationship requires exactly two labeled preview VexStreamTrack values');
  }
  if (new Set(tracks.map((track) => track.itemRef)).size !== tracks.length) {
    fail('preview track refs must remain unique');
  }
  return tracks;
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

export function vexStreamExpressionSourceReadPlan() {
  return Object.freeze(Object.values(VEXSTREAM_EXPRESSION_SOURCE_FILES));
}

export function projectVexStreamExpressionSource({ lens, files, sourceRevisionRef }) {
  if (!lens || typeof lens !== 'object') fail('normalized Screen Lens is required');
  const screen = screenFor(lens, SCREEN_REF);
  if (screen.symbol !== 'VexStreamMusicScreen') {
    fail(`${SCREEN_REF} is not VexStreamMusicScreen`);
  }
  if (typeof sourceRevisionRef !== 'string' ||
      !/^git\.commit\.vexlife-android\.[0-9a-f]{40}$/.test(sourceRevisionRef)) {
    fail('sourceRevisionRef must be an exact VexLife-Android commit ref');
  }

  const musicScreen = requiredFile(files, VEXSTREAM_EXPRESSION_SOURCE_FILES.musicScreen);
  const librarySurface = requiredFile(files, VEXSTREAM_EXPRESSION_SOURCE_FILES.librarySurface);
  const libraryPresentation = requiredFile(files, VEXSTREAM_EXPRESSION_SOURCE_FILES.libraryPresentation);
  const connectionPresentation = requiredFile(files, VEXSTREAM_EXPRESSION_SOURCE_FILES.connectionPresentation);
  const musicState = requiredFile(files, VEXSTREAM_EXPRESSION_SOURCE_FILES.musicState);
  const playbackDisplay = requiredFile(files, VEXSTREAM_EXPRESSION_SOURCE_FILES.playbackDisplay);
  const stableList = requiredFile(files, VEXSTREAM_EXPRESSION_SOURCE_FILES.stableList);

  requirePattern(
    musicScreen,
    /object\s+VexStreamMusicScreen\s*:\s*AppScreenBlueprint\([\s\S]*?screenKey\s*=\s*"vexstream-music"/,
    'VexStreamMusicScreen screenKey',
  );

  const libraryArgs = callArgsForVal(musicScreen, 'LibraryContent', 'swappableRef');
  if (compact(namedArg(libraryArgs, 'defaultChild')) !== 'SongsPanel') {
    fail('LibraryContent defaultChild must remain SongsPanel');
  }
  for (const [tab, child] of [['SongsTab', 'SongsPanel'], ['AlbumsTab', 'AlbumsPanel']]) {
    const args = callArgsForVal(musicScreen, tab, 'buttonRef');
    const intent = compact(namedArg(args, 'intent'));
    const expected = compact(`swapTo(container = LibraryContent, child = ${child})`);
    if (intent !== expected) fail(`${tab} must select ${child} through LibraryContent`);
  }

  requirePattern(
    musicState,
    /val\s+connectionState\s*:\s*VexStreamConnectionState\s*=\s*VexStreamConnectionState\.NotPaired/,
    'VexStreamMusicState connection default',
  );
  requirePattern(musicState, /data\s+object\s+NotPaired\s*:\s*VexStreamConnectionState/, 'NotPaired connection value');
  requirePattern(musicState, /data\s+class\s+Paired\s*\(/, 'Paired connection value');
  requirePattern(
    librarySurface,
    /if\s*\(\s*state\.connectionState\s*!is\s*VexStreamConnectionState\.Paired\s*\)\s*\{[\s\S]*?VexStreamConnectionSetup\s*\(/,
    'connection setup is conditioned on not Paired',
  );
  requirePattern(
    connectionPresentation,
    /VexStreamConnectionState\.NotPaired\s*->[\s\S]*?VexStreamMusicScreen\.FindNearby/,
    'NotPaired presents FindNearby',
  );
  requirePattern(
    connectionPresentation,
    /is\s+VexStreamConnectionState\.Paired\s*->\s*Unit/,
    'Paired connection setup contributes no setup surface',
  );

  requirePattern(
    libraryPresentation,
    /VexStableLazyColumn\s*\([\s\S]*?listRef\s*=\s*VexStreamMusicScreen\.SongsPanel\.elementId[\s\S]*?items\s*=\s*tracks[\s\S]*?itemRef\s*=\s*\{[\s\S]*?it\.track\.trackRef\.value/,
    'Songs uses VexStableLazyColumn with feature-owned trackRef',
  );
  requirePattern(
    stableList,
    /items\s*\([\s\S]*?items\s*=\s*items[\s\S]*?key\s*=\s*itemRef/,
    'VexStableLazyColumn uses itemRef as Compose key',
  );
  requirePattern(musicState, /val\s+tracks\s*:\s*List<VexStreamTrackState>\s*=\s*emptyList\(\)/, 'tracks default empty');

  requirePattern(playbackDisplay, /data\s+class\s+Inactive\b/, 'Playback Inactive display state');
  requirePattern(playbackDisplay, /data\s+class\s+Transitioning\b/, 'Playback Transitioning display state');
  requirePattern(playbackDisplay, /data\s+class\s+Active\b/, 'Playback Active display state');
  requirePattern(
    librarySurface,
    /VexStreamPlaybackDisplayState\.Unknown,[\s\S]*?VexStreamPlaybackDisplayState\.Inactive\s*->\s*Unit/,
    'Unknown/Inactive omit mini player',
  );
  requirePattern(
    librarySurface,
    /VexStreamPlaybackDisplayState\.Transitioning\s*->[\s\S]*?VexStreamMiniPlayer\s*\(/,
    'Transitioning presents mini player',
  );
  requirePattern(
    librarySurface,
    /VexStreamPlaybackDisplayState\.Active\s*->[\s\S]*?VexStreamMiniPlayer\s*\(/,
    'Active presents mini player',
  );

  const openFullPlayerIntent = compact(namedArg(callArgsForVal(musicScreen, 'OpenFullPlayer', 'buttonRef'), 'intent'));
  if (!/swapTo\(container = FullPlayerContent, child = FullPlayerNowPlayingPanel\)\.then\(open\(FullPlayerSheet\)\)/.test(openFullPlayerIntent)) {
    fail('OpenFullPlayer must select now-playing then open FullPlayerSheet');
  }
  requirePattern(
    librarySurface,
    /runtime\.presentation\.isOpen\(\s*VexStreamMusicScreen\.FullPlayerSheet\s*\)[\s\S]*?VexStreamFullPlayerSheet\s*\(/,
    'FullPlayerSheet presentation gate',
  );

  const manageConnectionIntent = compact(namedArg(callArgsForVal(musicScreen, 'ManageConnection', 'buttonRef'), 'intent'));
  if (manageConnectionIntent !== 'open(ConnectionMenuSheet)') {
    fail('ManageConnection must open ConnectionMenuSheet');
  }
  requirePattern(
    librarySurface,
    /runtime\.presentation\.isOpen\(VexStreamMusicScreen\.ConnectionMenuSheet\)[\s\S]*?VexStreamConnectionMenuSheet\s*\(/,
    'ConnectionMenuSheet presentation gate',
  );

  const previewTracks = parsePreviewTracks(musicScreen);
  const songsPanel = requireElementBySymbol(lens, 'VexStreamMusicScreen.SongsPanel');
  const albumsPanel = requireElementBySymbol(lens, 'VexStreamMusicScreen.AlbumsPanel');
  const songsTab = requireElementBySymbol(lens, 'VexStreamMusicScreen.SongsTab');
  const albumsTab = requireElementBySymbol(lens, 'VexStreamMusicScreen.AlbumsTab');
  const connection = requireElementBySymbol(lens, 'VexStreamMusicScreen.ConnectionSection');
  const findNearby = requireElementBySymbol(lens, 'VexStreamMusicScreen.FindNearby');
  const library = requireElementBySymbol(lens, 'VexStreamMusicScreen.LibraryContent');
  const player = requireElementBySymbol(lens, 'VexStreamMusicScreen.PlayerSection');
  const fullPlayerSheet = requireElementBySymbol(lens, 'VexStreamMusicScreen.FullPlayerSheet');
  const connectionMenu = requireElementBySymbol(lens, 'VexStreamMusicScreen.ConnectionMenuSheet');

  const relationships = [
    relationship({
      relationshipRef: 'relationship.vexstream.screen.registered',
      kind: 'REGISTERED',
      subjectRef: SCREEN_REF,
      elementRefs: [requireElement(lens, 'element.vexstream-music.body').ref],
      sourceRefs: [SOURCE_REFS.musicScreen],
    }),
    relationship({
      relationshipRef: 'relationship.vexstream.connection.state',
      kind: 'CONDITIONED_BY',
      subjectRef: connection.ref,
      sourceRefs: [SOURCE_REFS.musicState, SOURCE_REFS.connectionPresentation, SOURCE_REFS.librarySurface],
      defaultValueRef: 'connection.not-paired',
      values: [
        value('connection.not-paired', {
          elementRefs: [
            connection.ref,
            requireElement(lens, 'element.vexstream-music.body.connection.intro').ref,
            findNearby.ref,
          ],
          pathwayRefs: [requireElementPathway(lens, 'VexStreamMusicScreen.FindNearby')],
        }),
        value('connection.paired'),
      ],
    }),
    relationship({
      relationshipRef: 'relationship.vexstream.library.selection',
      kind: 'SELECTS',
      subjectRef: library.ref,
      elementRefs: [
        requireElement(lens, 'element.vexstream-music.body.library-tabs').ref,
        library.ref,
      ],
      sourceRefs: [SOURCE_REFS.musicScreen, SOURCE_REFS.librarySurface],
      defaultValueRef: 'library.songs',
      values: [
        value('library.songs', {
          elementRefs: [songsTab.ref, songsPanel.ref],
          pathwayRefs: [requireElementPathway(lens, 'VexStreamMusicScreen.SongsTab')],
        }),
        value('library.albums', {
          elementRefs: [albumsTab.ref, albumsPanel.ref],
          pathwayRefs: [requireElementPathway(lens, 'VexStreamMusicScreen.AlbumsTab')],
        }),
      ],
    }),
    relationship({
      relationshipRef: 'relationship.vexstream.songs.repeated-realization',
      kind: 'REALIZED_AS',
      subjectRef: songsPanel.ref,
      elementRefs: [songsPanel.ref],
      sourceRefs: [SOURCE_REFS.libraryPresentation, SOURCE_REFS.stableList],
    }),
    relationship({
      relationshipRef: 'relationship.vexstream.songs.population',
      kind: 'POPULATES',
      subjectRef: songsPanel.ref,
      sourceRefs: [SOURCE_REFS.libraryPresentation, SOURCE_REFS.musicScreen],
      defaultValueRef: 'population.empty',
      values: [
        value('population.empty'),
        value('population.preview', {
          runtimeItems: previewTracks.map((track) => ({
            itemRef: track.itemRef,
            label: track.label,
            realizationRef: songsPanel.ref,
            sourceRefs: [SOURCE_REFS.musicScreen],
          })),
        }),
      ],
    }),
    relationship({
      relationshipRef: 'relationship.vexstream.player.display',
      kind: 'CONDITIONED_BY',
      subjectRef: player.ref,
      sourceRefs: [SOURCE_REFS.librarySurface, SOURCE_REFS.playbackDisplay],
      defaultValueRef: 'player.inactive',
      values: [
        value('player.inactive'),
        value('player.active', {
          elementRefs: [
            player.ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.OpenFullPlayer').ref,
            requireElement(lens, 'element.vexstream-music.body.player.controls').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.PreviousTrack').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.TogglePlayback').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.NextTrack').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.ShuffleQueue').ref,
          ],
          pathwayRefs: [requireElementPathway(lens, 'VexStreamMusicScreen.TogglePlayback')],
        }),
      ],
    }),
    relationship({
      relationshipRef: 'relationship.vexstream.full-player.presentation',
      kind: 'PRESENTS',
      subjectRef: fullPlayerSheet.ref,
      sourceRefs: [SOURCE_REFS.musicScreen, SOURCE_REFS.librarySurface],
      defaultValueRef: 'full-player.closed',
      values: [
        value('full-player.closed'),
        value('full-player.open', {
          elementRefs: [
            fullPlayerSheet.ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.FullPlayerContent').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.FullPlayerNowPlayingPanel').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.CloseFullPlayer').ref,
          ],
          pathwayRefs: [
            requireElementPathway(lens, 'VexStreamMusicScreen.OpenFullPlayer'),
            requireElementPathway(lens, 'VexStreamMusicScreen.CloseFullPlayer'),
          ],
        }),
      ],
    }),
    relationship({
      relationshipRef: 'relationship.vexstream.connection-menu.presentation',
      kind: 'PRESENTS',
      subjectRef: connectionMenu.ref,
      sourceRefs: [SOURCE_REFS.musicScreen, SOURCE_REFS.librarySurface, SOURCE_REFS.connectionPresentation],
      defaultValueRef: 'connection-menu.closed',
      values: [
        value('connection-menu.closed'),
        value('connection-menu.open', {
          elementRefs: [
            connectionMenu.ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.RefreshCatalog').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.Reconnect').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.DownloadAllMissingSongs').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.RemoveAllDownloadedSongs').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.RequestForgetPaired').ref,
            requireElementBySymbol(lens, 'VexStreamMusicScreen.CloseConnectionMenu').ref,
          ],
          pathwayRefs: [
            requireElementPathway(lens, 'VexStreamMusicScreen.RefreshCatalog'),
            requireElementPathway(lens, 'VexStreamMusicScreen.Reconnect'),
            requireElementPathway(lens, 'VexStreamMusicScreen.RequestForgetPaired'),
            requireElementPathway(lens, 'VexStreamMusicScreen.CloseConnectionMenu'),
          ],
        }),
      ],
    }),
  ];

  return Object.freeze({
    schemaVersion: VEXSTREAM_EXPRESSION_SOURCE_SCHEMA,
    screenRef: SCREEN_REF,
    sourceRevisionRef,
    relationships: Object.freeze(relationships),
    externalRelationshipRefs: EXTERNAL_RELATIONSHIP_REFS,
  });
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

export function sourceOwnedRelationshipShape(entry) {
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

export function compareVexStreamExpressionFixtureSource({ fixture, projection }) {
  if (!fixture || !Array.isArray(fixture.relationships) || !Array.isArray(fixture.expressions)) {
    fail('normalized expression fixture is required');
  }
  if (!projection || projection.schemaVersion !== VEXSTREAM_EXPRESSION_SOURCE_SCHEMA) {
    fail(`projection schemaVersion must be ${VEXSTREAM_EXPRESSION_SOURCE_SCHEMA}`);
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
    const left = JSON.stringify(sourceOwnedRelationshipShape(authored));
    const right = JSON.stringify(sourceOwnedRelationshipShape(projected));
    if (left !== right) findings.push(`${projected.relationshipRef} differs from Android source projection`);
  }
  for (const entry of fixture.relationships) {
    if (!projectedRefs.has(entry.relationshipRef) &&
        !projection.externalRelationshipRefs.includes(entry.relationshipRef)) {
      findings.push(`${entry.relationshipRef} has no source or external-evidence owner in this projector`);
    }
  }

  const sourceValueRefs = new Map();
  for (const relationship of projection.relationships) {
    sourceValueRefs.set(
      relationship.relationshipRef,
      new Set((relationship.values ?? []).map((entry) => entry.valueRef)),
    );
  }
  for (const expression of fixture.expressions) {
    for (const relationshipRef of expression.relationshipRefs) {
      if (!projectedRefs.has(relationshipRef) &&
          !projection.externalRelationshipRefs.includes(relationshipRef)) {
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
    externalRelationshipRefs: projection.externalRelationshipRefs,
    expressionCount: fixture.expressions.length,
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EXPRESSIONS][SOURCE]
