#!/usr/bin/env node
import fs from 'node:fs';

import { validateProjectRegistry, projectProjectRegistry } from '../src/core/project-registry.mjs';
import { validateRepositoryRegistry, assertKnownRepositoryRefs } from '../src/core/repository-graph.mjs';
import { assertKnownProcessRefs, projectProcessMap, validateProcessRegistry } from '../src/core/process-map.mjs';
import { createProject, createWorkgraph, projectWorkRefs, validateRegistry } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard, projectWorkGraph } from '../src/core/work-board.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const read = (path) => JSON.parse(fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

const workRegistry = read('blueprint/work-registry.json');
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');
const projectRegistry = read('blueprint/project-registry.json');

const workRegistryValidation = validateRegistry(workRegistry);
if (!workRegistryValidation.ok) throw new Error(workRegistryValidation.errors.join('\n'));
const repositoryValidation = validateRepositoryRegistry(repositoryRegistry);
if (!repositoryValidation.ok) throw new Error(repositoryValidation.errors.join('\n'));
const processValidation = validateProcessRegistry(processRegistry, repositoryRegistry);
if (!processValidation.ok) throw new Error(processValidation.errors.join('\n'));
const projectRegistryValidation = validateProjectRegistry(projectRegistry);
if (!projectRegistryValidation.ok) throw new Error(projectRegistryValidation.errors.join('\n'));

const graphSources = new Map();
const projectChecks = [];

for (const entry of projectRegistry.projects) {
  const project = createProject(read(entry.definitionPath));
  if (project.projectRef !== entry.projectRef) {
    throw new Error(`Project Registry identity mismatch for ${entry.projectRef}`);
  }

  let graph = graphSources.get(entry.workgraphRef);
  if (!graph) {
    const graphPath = entry.workgraphRef === 'workgraph.vexwork.foundation'
      ? 'workgraphs/public.json'
      : null;
    if (!graphPath) throw new Error(`no source path registered for Workgraph ${entry.workgraphRef}`);
    graph = createWorkgraph(read(graphPath), workRegistry);
    if (graph.graphRef !== entry.workgraphRef) {
      throw new Error(`Workgraph identity mismatch for ${entry.workgraphRef}`);
    }
    graphSources.set(entry.workgraphRef, graph);
    for (const item of graph.items) {
      assertKnownRepositoryRefs(item.repositoryRefs, repositoryRegistry);
      if (item.formationProcessRefOrNull) assertKnownProcessRefs([item.formationProcessRefOrNull], processRegistry);
      assertKnownProcessRefs(item.nextProcessRefs, processRegistry);
    }
  }

  assertKnownRepositoryRefs(project.repositoryRefs, repositoryRegistry);
  const view = createBoardView(read(entry.boardViewPath), workRegistry);
  if (view.projectRef !== project.projectRef) {
    throw new Error(`Board/Project identity mismatch for ${entry.projectRef}`);
  }

  const projectRefs = projectWorkRefs(project, graph);
  const board = projectWorkBoard({ project, graph, view, registry: workRegistry });
  const graphProjection = projectWorkGraph({ project, graph });

  for (const value of [project, graph, view, board, graphProjection]) {
    if (!verifySemanticFingerprint(value)) throw new Error('semantic fingerprint self-check failed');
  }

  projectChecks.push({
    projectRef: project.projectRef,
    workgraphRef: graph.graphRef,
    workItemCount: projectRefs.length,
    boardCardCount: board.lanes.reduce((sum, lane) => sum + lane.cards.length, 0),
    agencyPolicyPathOrNull: entry.agencyPolicyPathOrNull,
  });
}

const projectMap = projectProjectRegistry(projectRegistry);
const processMap = projectProcessMap(processRegistry);
const graphs = [...graphSources.values()];
const globalItems = graphs.reduce((sum, graph) => sum + graph.items.length, 0);
const parkingLotItems = graphs.reduce((sum, graph) => sum + projectParkingLot({ graph, registry: workRegistry }).items.length, 0);

for (const value of [projectMap, processMap]) {
  if (!verifySemanticFingerprint(value)) throw new Error('semantic fingerprint self-check failed');
}

console.log(JSON.stringify({
  schemaVersion: 'vexwork.foundation-check/v2',
  state: 'PASS',
  workRegistry: 'PASS',
  repositoryRegistry: 'PASS',
  processRegistry: 'PASS',
  projectRegistry: 'PASS',
  projectCount: projectRegistry.projects.length,
  workgraphCount: graphSources.size,
  globalWorkItemCount: globalItems,
  parkingLotItemCount: parkingLotItems,
  processCount: processMap.processes.length,
  projects: projectChecks,
}, null, 2));
