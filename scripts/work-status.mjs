#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard, projectWorkGraph } from '../src/core/work-board.mjs';

const args = process.argv.slice(2);
const value = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? null : args[index + 1] ?? null;
};

const projectPath = value('--project');
const graphPath = value('--graph');
const format = value('--format');
const viewPath = value('--view');
if (!projectPath || !graphPath || !['board', 'graph'].includes(format)) {
  console.error('Usage: npm run work:status -- --project <project.json> --graph <workgraph.json> --format board|graph [--view <board.view.json>]');
  process.exit(2);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolveSource = (relative) => {
  const resolved = path.resolve(ROOT, relative);
  const rel = path.relative(ROOT, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error(`source path escapes VexWork root: ${relative}`);
  return resolved;
};
const read = (relative) => JSON.parse(fs.readFileSync(resolveSource(relative), 'utf8'));
const registry = read('blueprint/work-registry.json');
const project = createProject(read(projectPath));
const graph = createWorkgraph(read(graphPath), registry);

let output;
if (format === 'board') {
  if (!viewPath) throw new Error('board format requires --view');
  output = projectWorkBoard({ project, graph, view: createBoardView(read(viewPath), registry), registry });
} else {
  output = projectWorkGraph({ project, graph });
}
console.log(JSON.stringify(output, null, 2));
