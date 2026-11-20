#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  deriveProjectRegistry,
  deriveProjectSourceBundle,
} from '../src/core/project-registry.mjs';
import {
  createBoardView,
  isDefaultWorkBoardView,
} from '../src/core/work-board.mjs';
import {
  composeWorkgraph,
  createWorkgraphComposition,
} from '../src/core/workgraph-composition.mjs';
import { createProject } from '../src/core/workgraph.mjs';

const THIS_FILE = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = path.resolve(path.dirname(THIS_FILE), '..');

function readJson(root, relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
}

function relativeFiles(root, directory, suffix) {
  const absolute = path.join(root, directory);
  return fs.readdirSync(absolute, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(suffix))
    .map((entry) => `${directory}/${entry.name}`)
    .sort();
}

export function discoverProjectDefinitionPaths(root = DEFAULT_ROOT) {
  const projectsRoot = path.join(root, 'projects');
  return fs.readdirSync(projectsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `projects/${entry.name}/project.json`)
    .filter((relative) => fs.existsSync(path.join(root, relative)))
    .sort();
}

export function composeCurrentWorkgraph(root = DEFAULT_ROOT) {
  const workRegistry = readJson(root, 'blueprint/work-registry.json');
  const composition = createWorkgraphComposition(readJson(root, 'workgraphs/composition.json'));
  const segments = relativeFiles(root, 'workgraphs/segments', '.json').map((relative) => readJson(root, relative));
  return {
    workRegistry,
    graph: composeWorkgraph({ composition, segments, registry: workRegistry }).graph,
  };
}

export function buildProjectRegistrySource(root = DEFAULT_ROOT) {
  const currentRegistry = readJson(root, 'blueprint/project-registry.json');
  const { workRegistry, graph } = composeCurrentWorkgraph(root);
  const definitionPaths = discoverProjectDefinitionPaths(root);

  const bundles = definitionPaths.map((definitionPath) => {
    const directory = path.posix.dirname(definitionPath);
    const boardViewPath = `${directory}/board.view.json`;
    const agencyPolicyPath = `${directory}/agency.policy.json`;
    const projectSource = readJson(root, definitionPath);
    const project = createProject(projectSource);

    let explicitBoardViewSourceOrNull = null;
    let boardViewPathOrNull = null;
    if (fs.existsSync(path.join(root, boardViewPath))) {
      const explicit = createBoardView(readJson(root, boardViewPath), workRegistry);
      if (explicit.projectRef !== project.projectRef) {
        throw new TypeError(`project/view identity mismatch for ${definitionPath}`);
      }
      if (!isDefaultWorkBoardView({ project, view: explicit, registry: workRegistry })) {
        explicitBoardViewSourceOrNull = explicit;
        boardViewPathOrNull = boardViewPath;
      }
    }

    return deriveProjectSourceBundle({
      projectSource,
      explicitBoardViewSourceOrNull,
      definitionPath,
      boardViewPathOrNull,
      agencyPolicyPathOrNull: fs.existsSync(path.join(root, agencyPolicyPath)) ? agencyPolicyPath : null,
      graph,
      workgraphPath: 'workgraphs/public.json',
      workRegistry,
    });
  });

  const sourceProjectRefs = new Set(bundles.map((bundle) => bundle.project.projectRef));
  const compatibilityOrderProjectRefs = currentRegistry.projects
    .map((entry) => entry.projectRef)
    .filter((projectRef) => sourceProjectRefs.has(projectRef));

  return deriveProjectRegistry({
    registryRef: currentRegistry.registryRef,
    // v1 encoded membership count as registryVersion. Preserve that projection
    // mechanically while membership itself moves to validated source census.
    // Do not use this integer as a currentness or identity predicate.
    registryVersion: bundles.length,
    purpose: currentRegistry.purpose,
    sourceBundles: bundles,
    compatibilityOrderProjectRefs,
  });
}

export function projectRegistryBytes(root = DEFAULT_ROOT) {
  return JSON.stringify(buildProjectRegistrySource(root), null, 2) + '\n';
}

function main() {
  const root = DEFAULT_ROOT;
  const output = path.join(root, 'blueprint', 'project-registry.json');
  const expected = projectRegistryBytes(root);

  if (process.argv.includes('--print')) {
    process.stdout.write(expected);
    return;
  }

  if (process.argv.includes('--check')) {
    const current = fs.existsSync(output) ? fs.readFileSync(output, 'utf8') : '';
    if (current !== expected) {
      const currentRegistry = current ? JSON.parse(current) : { projects: [] };
      const expectedRegistry = JSON.parse(expected);
      const currentRefs = new Set((currentRegistry.projects ?? []).map((entry) => entry.projectRef));
      const expectedRefs = new Set(expectedRegistry.projects.map((entry) => entry.projectRef));
      const missing = [...expectedRefs].filter((ref) => !currentRefs.has(ref)).sort();
      const orphan = [...currentRefs].filter((ref) => !expectedRefs.has(ref)).sort();
      console.error(`blueprint/project-registry.json is stale; missing=${JSON.stringify(missing)} orphan=${JSON.stringify(orphan)}`);
      process.exitCode = 1;
      return;
    }
    console.log('Project Registry = current from validated Project source');
    return;
  }

  fs.writeFileSync(output, expected, 'utf8');
  console.log('wrote blueprint/project-registry.json from validated Project source');
}

if (process.argv[1] && path.resolve(process.argv[1]) === THIS_FILE) main();

// [VXG RealForever][VEXWORK][PROJECT-REGISTRY][SOURCE-CENSUS]
