#!/usr/bin/env node
import fs from 'node:fs';

import { validateRepositoryRegistry, assertKnownRepositoryRefs } from '../src/core/repository-graph.mjs';
import { assertKnownProcessRefs, projectProcessMap, validateProcessRegistry } from '../src/core/process-map.mjs';
import { createProject, createWorkgraph, projectWorkRefs, validateRegistry } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard, projectWorkGraph } from '../src/core/work-board.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const read = (path) => JSON.parse(fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

const workRegistry = read('blueprint/work-registry.json');
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');
const projectSource = read('projects/vexwork-foundation/project.json');
const graphSource = read('projects/vexwork-foundation/workgraph.json');
const viewSource = read('projects/vexwork-foundation/board.view.json');

const workRegistryValidation = validateRegistry(workRegistry);
if (!workRegistryValidation.ok) throw new Error(workRegistryValidation.errors.join('\n'));
const repositoryValidation = validateRepositoryRegistry(repositoryRegistry);
if (!repositoryValidation.ok) throw new Error(repositoryValidation.errors.join('\n'));
const processValidation = validateProcessRegistry(processRegistry, repositoryRegistry);
if (!processValidation.ok) throw new Error(processValidation.errors.join('\n'));

const project = createProject(projectSource);
const graph = createWorkgraph(graphSource, workRegistry);
const view = createBoardView(viewSource, workRegistry);
assertKnownRepositoryRefs(project.repositoryRefs, repositoryRegistry);
for (const item of graph.items) {
  assertKnownRepositoryRefs(item.repositoryRefs, repositoryRegistry);
  if (item.formationProcessRefOrNull) assertKnownProcessRefs([item.formationProcessRefOrNull], processRegistry);
  assertKnownProcessRefs(item.nextProcessRefs, processRegistry);
}
const projectRefs = projectWorkRefs(project, graph);
const board = projectWorkBoard({ project, graph, view, registry: workRegistry });
const graphProjection = projectWorkGraph({ project, graph });
const parkingLot = projectParkingLot({ graph, registry: workRegistry });
const processMap = projectProcessMap(processRegistry);

for (const value of [project, graph, view, board, graphProjection, parkingLot, processMap]) {
  if (!verifySemanticFingerprint(value)) throw new Error('semantic fingerprint self-check failed');
}

console.log(JSON.stringify({
  schemaVersion: 'vexwork.foundation-check/v1',
  state: 'PASS',
  workRegistry: 'PASS',
  repositoryRegistry: 'PASS',
  processRegistry: 'PASS',
  project: project.projectRef,
  workgraph: graph.graphRef,
  globalWorkItemCount: graph.items.length,
  projectWorkItemCount: projectRefs.length,
  boardCardCount: board.lanes.reduce((sum, lane) => sum + lane.cards.length, 0),
  parkingLotItemCount: parkingLot.items.length,
  graphEdgeCount: graphProjection.edges.length,
  processCount: processMap.processes.length,
  providerIsCanonicalWorkState: false,
  workBoardIsCanonicalWorkState: false,
  parkingLotIsProject: false
}, null, 2));
