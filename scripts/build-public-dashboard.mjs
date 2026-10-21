#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { projectPublicWorkDashboard } from '../src/core/public-dashboard.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard } from '../src/core/work-board.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));

const registry = read('blueprint/work-registry.json');
const project = createProject(read('projects/vexwork-foundation/project.json'));
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const view = createBoardView(read('projects/vexwork-foundation/board.view.json'), registry);
const board = projectWorkBoard({ project, graph, view, registry });
const parkingLot = projectParkingLot({ graph, registry });
const dashboard = projectPublicWorkDashboard({ project, board, parkingLot });
const bytes = JSON.stringify(dashboard, null, 2) + '\n';
const output = path.join(ROOT, 'public', 'work-dashboard.json');

if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== bytes) {
    console.error('public/work-dashboard.json is stale; run npm run dashboard:build');
    process.exit(1);
  }
  console.log('public work dashboard = current');
} else {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, bytes, 'utf8');
  console.log('wrote public/work-dashboard.json');
}
