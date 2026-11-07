import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Lens from '../src/shared/vexboard-screen-lens.mjs';
import {
  normalizeScreenLensExpressionFixture,
} from '../src/shared/vexboard-screen-lens-expressions.mjs';
import {
  VEXSTREAM_EXPRESSION_SOURCE_FILES,
  compareVexStreamExpressionFixtureSource,
  projectVexStreamExpressionSource,
  vexStreamExpressionSourceReadPlan,
} from '../src/core/vexboard-screen-lens-vexstream-expression-source.mjs';

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
      '../projects/vexboard/examples/vexlife-android-vexstream.screen-lens-expressions.fixture.json',
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
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.musicScreen]: `
      object VexStreamMusicScreen : AppScreenBlueprint(
        screenKey = "vexstream-music",
        titleRes = R.string.vexstream_music_title,
      ) {
        val SongsPanel = scrollableColumnRef("body.library.songs")
        val AlbumsPanel = scrollableColumnRef("body.library.albums")
        val LibraryContent = swappableRef(
          id = "body.library",
          defaultChild = SongsPanel,
        )
        val FullPlayerSheet = modalBottomSheetRef(id = "body.player.sheet")
        val FullPlayerContent = swappableRef(
          id = "body.player.sheet.content",
          defaultChild = FullPlayerNowPlayingPanel,
        )
        val FullPlayerNowPlayingPanel = columnRef("body.player.sheet.content.now-playing")
        val ConnectionMenuSheet = modalBottomSheetRef(id = "body.connection.menu")
        val SongsTab = buttonRef(
          id = "body.library-tabs.songs",
          intent = swapTo(
            container = LibraryContent,
            child = SongsPanel,
          ),
        )
        val AlbumsTab = buttonRef(
          id = "body.library-tabs.albums",
          intent = swapTo(
            container = LibraryContent,
            child = AlbumsPanel,
          ),
        )
        val OpenFullPlayer = buttonRef(
          id = "body.player.open",
          intent = swapTo(
            container = FullPlayerContent,
            child = FullPlayerNowPlayingPanel,
          ).then(
            open(FullPlayerSheet),
          ),
        )
        val ManageConnection = buttonRef(
          id = "body.connection.manage",
          intent = open(ConnectionMenuSheet),
        )
      }

      internal fun vexStreamPreviewState(): VexStreamMusicState {
        val streamed = VexStreamTrack(
          trackRef = VexStreamTrackRef("preview.streamed"),
          title = "VexStream Mobile",
        )
        val downloaded = VexStreamTrack(
          trackRef = VexStreamTrackRef("preview.downloaded"),
          title = "Take It With You",
        )
        return VexStreamMusicState(
          tracks = listOf(streamed, downloaded),
        )
      }
    `,
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.librarySurface]: `
      val selected = runtime.presentation.selected(VexStreamMusicScreen.LibraryContent)

      if (state.connectionState !is VexStreamConnectionState.Paired) {
        VexStreamConnectionSetup(
          state = state,
          runtime = runtime,
        )
      }

      when (val displayState = playbackDisplayState) {
        is VexStreamPlaybackDisplayState.Unknown,
        is VexStreamPlaybackDisplayState.Inactive -> Unit

        is VexStreamPlaybackDisplayState.Transitioning -> {
          VexStreamMiniPlayer(controller, playbackExperience, runtime)
        }

        is VexStreamPlaybackDisplayState.Active -> {
          VexStreamMiniPlayer(controller, playbackExperience, runtime)
        }
      }

      if (
        runtime.presentation.isOpen(
          VexStreamMusicScreen.FullPlayerSheet,
        ) && playbackExperience != null
      ) {
        VexStreamFullPlayerSheet(state, controller, playbackExperience, runtime)
      }

      if (runtime.presentation.isOpen(VexStreamMusicScreen.ConnectionMenuSheet)) {
        VexStreamConnectionMenuSheet(state, runtime, offlineCopyConnection)
      }
    `,
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.libraryPresentation]: `
      VexStableLazyColumn(
        listRef = VexStreamMusicScreen.SongsPanel.elementId,
        items = tracks,
        itemRef = {
          it.track.trackRef.value
        },
        contentType = { "vexstream-track-row" },
      )
    `,
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.connectionPresentation]: `
      when (connection) {
        VexStreamConnectionState.NotPaired -> {
          VexButton(
            element = VexStreamMusicScreen.FindNearby,
            handler = runtime,
          )
        }
        is VexStreamConnectionState.Paired -> Unit
      }
    `,
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.musicState]: `
      sealed interface VexStreamConnectionState {
        data object NotPaired : VexStreamConnectionState
        data class Paired(val displayName: String) : VexStreamConnectionState
      }
      data class VexStreamMusicState(
        val connectionState: VexStreamConnectionState = VexStreamConnectionState.NotPaired,
        val tracks: List<VexStreamTrackState> = emptyList(),
      )
    `,
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.playbackDisplay]: `
      internal sealed interface VexStreamPlaybackDisplayState {
        data class Unknown(val value: Int = 0) : VexStreamPlaybackDisplayState
        data class Inactive(val value: Int = 0) : VexStreamPlaybackDisplayState
        data class Transitioning(val value: Int = 0) : VexStreamPlaybackDisplayState
        data class Active(val value: Int = 0) : VexStreamPlaybackDisplayState
      }
    `,
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.playerPresentation]: `
      internal fun VexStreamMiniPlayer(
        controller: Any?,
        playbackExperience: Any,
        runtime: Any,
      ) {
        VexContainer(
          element = VexStreamMusicScreen.PlayerSection,
        ) {
          Row(
            modifier = Modifier
              .vex(
                VexStreamMusicScreen.OpenFullPlayer,
              )
              .clickable {
                runtime.activate(
                  VexStreamMusicScreen.OpenFullPlayer,
                )
              },
          ) {}
          VexIconButton(
            element = VexStreamMusicScreen.PreviousTrack,
            handler = handler,
          )
          VexIconButton(
            element = VexStreamMusicScreen.TogglePlayback,
            handler = handler,
          )
          VexIconButton(
            element = VexStreamMusicScreen.NextTrack,
            handler = handler,
          )
          VexIconButton(
            element = VexStreamMusicScreen.ShuffleQueue,
            handler = handler,
          )
        }
      }

      internal fun VexStreamFullPlayerSheet(
        state: Any,
        controller: Any?,
        playbackExperience: Any,
        runtime: Any,
      ) {
        val selected =
          runtime.presentation.selected(
            VexStreamMusicScreen.FullPlayerContent,
          )
        VexModalBottomSheet(
          element = VexStreamMusicScreen.FullPlayerSheet,
        ) {
          VexColumn(
            element =
              VexStreamMusicScreen
                .FullPlayerNowPlayingPanel,
          ) {
            VexIconButton(
              element =
                VexStreamMusicScreen
                  .CloseFullPlayer,
              handler = handler,
            )
          }
        }
      }
    `,
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.stableList]: `
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
  return projectVexStreamExpressionSource({
    lens,
    files,
    sourceRevisionRef: SOURCE_REVISION,
  });
}

test('the VexStream source reader is an exact bounded patient-zero read plan', () => {
  assert.deepEqual(
    vexStreamExpressionSourceReadPlan(),
    Object.values(VEXSTREAM_EXPRESSION_SOURCE_FILES),
  );
  assert.equal(vexStreamExpressionSourceReadPlan().length, 8);
  assert.ok(
    vexStreamExpressionSourceReadPlan().every(
      (path) => path.includes('vexstream') || path.endsWith('VexStableLazyList.kt'),
    ),
  );
});

test('Android source reproduces the source-owned relationship skeleton of the accepted fixture', () => {
  const projected = projection();
  const compared = compareVexStreamExpressionFixtureSource({
    fixture,
    projection: projected,
  });

  assert.equal(compared.state, 'PASS');
  assert.deepEqual(compared.findings, []);
  assert.equal(compared.sourceRelationshipCount, 8);
  assert.deepEqual(compared.externalRelationshipRefs, [
    'relationship.vexstream.songs.evidence',
  ]);
  assert.equal(compared.expressionCount, 7);
});

test('connection owns its setup condition while library selection owns always-participating library containers', () => {
  const projected = projection();
  const connection = projected.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.connection.state',
  );
  const paired = connection.values.find((entry) => entry.valueRef === 'connection.paired');
  assert.deepEqual(paired.elementRefs, []);

  const library = projected.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.library.selection',
  );
  assert.deepEqual(library.elementRefs, [
    'element.vexstream-music.body.library',
  ]);
});

test('source projection preserves feature-owned repeated runtime identity rather than minting Lens elements', () => {
  const projected = projection();
  const population = projected.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.songs.population',
  );
  const preview = population.values.find((entry) => entry.valueRef === 'population.preview');

  assert.deepEqual(
    preview.runtimeItems.map((item) => [item.itemRef, item.label, item.realizationRef]),
    [
      ['preview.streamed', 'VexStream Mobile', 'element.vexstream-music.body.library.songs'],
      ['preview.downloaded', 'Take It With You', 'element.vexstream-music.body.library.songs'],
    ],
  );
  assert.ok(preview.runtimeItems.every((item) => Lens.elementFor(lens, item.itemRef) === null));
});

test('representative expression choice and external evidence remain VexWork projection policy, not Android source output', () => {
  const candidateSource = structuredClone(fixtureSource);
  candidateSource.expressions.pop();
  const evidence = candidateSource.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.songs.evidence',
  );
  evidence.summary = 'Changed human explanation; source-owned relationship projection is unchanged.';
  evidence.evidenceRefs = ['evidence.external.example'];

  const candidate = normalizeScreenLensExpressionFixture(lens, candidateSource);
  const compared = compareVexStreamExpressionFixtureSource({
    fixture: candidate,
    projection: projection(),
  });

  assert.equal(compared.state, 'PASS');
  assert.equal(compared.expressionCount, 6);
  assert.deepEqual(compared.externalRelationshipRefs, [
    'relationship.vexstream.songs.evidence',
  ]);
});

test('source projection fails closed when the library default or repeated-item identity contract drifts', () => {
  const defaultDrift = sourceFiles({
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.musicScreen]:
      sourceFiles().get(VEXSTREAM_EXPRESSION_SOURCE_FILES.musicScreen)
        .replace('defaultChild = SongsPanel', 'defaultChild = AlbumsPanel'),
  });
  assert.throws(
    () => projection(defaultDrift),
    /LibraryContent defaultChild must remain SongsPanel/,
  );

  const listDrift = sourceFiles({
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.stableList]:
      sourceFiles().get(VEXSTREAM_EXPRESSION_SOURCE_FILES.stableList)
        .replace('key = itemRef', 'key = { index -> index }'),
  });
  assert.throws(
    () => projection(listDrift),
    /VexStableLazyColumn uses itemRef as Compose key/,
  );

  const miniPlayerDrift = sourceFiles({
    [VEXSTREAM_EXPRESSION_SOURCE_FILES.playerPresentation]:
      sourceFiles().get(VEXSTREAM_EXPRESSION_SOURCE_FILES.playerPresentation)
        .replace(
          'element = VexStreamMusicScreen.TogglePlayback',
          'element = VexStreamMusicScreen.SeekPlayback',
        ),
  });
  assert.throws(
    () => projection(miniPlayerDrift),
    /Mini Player renders TogglePlayback/,
  );
});

test('the source comparison catches the prior hand-authored Paired/library-container drift', () => {
  const staleSource = structuredClone(fixtureSource);
  const connection = staleSource.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.connection.state',
  );
  const paired = connection.values.find((entry) => entry.valueRef === 'connection.paired');
  paired.elementRefs = [
    'element.vexstream-music.body.library',
  ];
  const library = staleSource.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.library.selection',
  );
  delete library.elementRefs;

  const stale = normalizeScreenLensExpressionFixture(lens, staleSource);
  const compared = compareVexStreamExpressionFixtureSource({
    fixture: stale,
    projection: projection(),
  });

  assert.equal(compared.state, 'STALE');
  assert.deepEqual(compared.findings, [
    'relationship.vexstream.connection.state differs from Android source projection',
    'relationship.vexstream.library.selection differs from Android source projection',
  ]);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EXPRESSIONS][SOURCE][TEST]
