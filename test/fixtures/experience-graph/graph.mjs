// Compiles the synthetic fixtures into one Experience Relationship Graph for downstream tests.

import { readFamilyLaw } from '../../../src/core/experience-graph-kotlin-family.mjs';
import { readLensSurface, readRealizationSites, readSendBoundary, readUntypedControlLiterals } from '../../../src/core/experience-graph-product-wiring.mjs';
import { compileExperienceGraph } from '../../../src/core/experience-graph.mjs';
import { COMMIT, FAMILY_SOURCES, LENS, SEND_SOURCES, WIRING_FILES } from './fixtures.mjs';

export function fixtureLaws() {
  return FAMILY_SOURCES.map(readFamilyLaw);
}

export function fixtureGraph({ commit = COMMIT, families = fixtureLaws(), lens = LENS, send = SEND_SOURCES, localization = null, stringIdentity = null } = {}) {
  const files = [...WIRING_FILES, ...FAMILY_SOURCES];
  return compileExperienceGraph({
    source: {
      repository: 'VexGPT/VexLife-Prod',
      commit,
      files: [
        { path: 'src/commonMain/kotlin/vexlife/web/VexLifeWebRuntimeArtifacts.kt', blobSha1: 'a'.repeat(40) },
        { path: 'a.kt', blobSha1: '1'.repeat(40) },
      ],
    },
    families,
    surface: readLensSurface(lens),
    realization: readRealizationSites({ families, files }),
    sendBoundary: readSendBoundary(send),
    untypedLiterals: readUntypedControlLiterals({ families, files }),
    localization,
    stringIdentity,
    extractor: { modules: [{ path: 'x.mjs', blobSha1: '0'.repeat(40) }] },
  });
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][TEST-GRAPH]
