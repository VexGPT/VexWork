#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard, projectWorkGraph } from '../src/core/work-board.mjs';

const args = process.argv.slice(2);
const value = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? null : args[index + 1] ?? null;
};

const projectPath = value('--project');
const graphPath = value('--graph');
const format = value('--format');
const viewPath = value('--view');
const repositoryRefOrNull = value('--repository');
if (!graphPath || !['board', 'graph', 'parking-lot'].includes(format)) {
  console.error('Usage: npm run work:status -- --graph <workgraph.json> --format board|graph|parking-lot [--project <project.json>] [--view <board.view.json>] [--repository <repo.ref>]');
  process.exit(2);
}
if (['board', 'graph'].includes(format) && !projectPath) throw new Error(`${format} format requires --project`);
if (format === 'board' && !viewPath) throw new Error('board format requires --view');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolveSource = (relative) => {
  const resolved = path.resolve(ROOT, relative);
  const rel = path.relative(ROOT, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error(`source path escapes VexWork root: ${relative}`);
  return resolved;
};
const read = (relative) => JSON.parse(fs.readFileSync(resolveSource(relative), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read(graphPath), registry);

let output;
if (format === 'parking-lot') {
  output = projectParkingLot({ graph, registry, repositoryRefOrNull });
} else {
  const project = createProject(read(projectPath));
  if (format === 'board') {
    output = projectWorkBoard({ project, graph, view: createBoardView(read(viewPath), registry), registry });
  } else {
    output = projectWorkGraph({ project, graph });
  }
}
console.log(JSON.stringify(output, null, 2));
