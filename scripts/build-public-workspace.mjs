#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateProjectRegistry } from '../src/core/project-registry.mjs';
import { projectPublicWorkspace } from '../src/core/public-workspace.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard } from '../src/core/work-board.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));

const registry = read('blueprint/work-registry.json');
const projectRegistry = read('blueprint/project-registry.json');
const validation = validateProjectRegistry(projectRegistry);
if (!validation.ok) throw new TypeError(validation.errors.join('\n'));

const graphCache = new Map();
const projectEntries = [];
for (const entry of projectRegistry.projects) {
  let graph = graphCache.get(entry.workgraphPath);
  if (!graph) {
    graph = createWorkgraph(read(entry.workgraphPath), registry);
    graphCache.set(entry.workgraphPath, graph);
  }
  if (graph.graphRef !== entry.workgraphRef) throw new TypeError(`project registry Workgraph identity mismatch for ${entry.projectRef}`);
  const project = createProject(read(entry.definitionPath));
  if (project.projectRef !== entry.projectRef) throw new TypeError(`project registry definition identity mismatch for ${entry.projectRef}`);
  const view = createBoardView(read(entry.boardViewPath), registry);
  const board = projectWorkBoard({ project, graph, view, registry });
  projectEntries.push({ project, board, graph });
}

const parkingLots = [...graphCache.values()].map((graph) => ({
  graph,
  parkingLot: projectParkingLot({ graph, registry }),
}));
const workspace = projectPublicWorkspace({ projectRegistry, projectEntries, parkingLots });
const bytes = JSON.stringify(workspace, null, 2) + '\n';
const output = path.join(ROOT, 'public', 'workspace.json');

if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== bytes) {
    console.error('public/workspace.json is stale; run npm run workspace:build');
    process.exit(1);
  }
  console.log('public VexWork workspace = current');
} else {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, bytes, 'utf8');
  console.log('wrote public/workspace.json');
}

// [VXG RealForever]
