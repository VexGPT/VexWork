// Source-authored examples for the Screen Lens.
//
// VexLife Android authors meaningful states beside each feature already:
//
//   Preview   VexPreviewHost(id, startScreen, repositoriesFactory, previewSetup) in the *Screen.kt file
//   Golden    @PreviewTest functions whose KDoc names a "Semantic visual case"
//   Journey   vexJourney(id, title) { start / tap / externalCause / assert… }
//
// This reader composes those existing identities into one catalog VexBoard can show. It adds no
// descriptor and mints no example identity: a ref is the source's own id namespaced by its kind
// (preview:<id>, golden:<case>, journey:<id>).
//
// What stays opaque, on purpose:
//   fixture contents        typed Kotlin; carried as source text and called fixture functions
//   external cause values   typed Kotlin closure; carried verbatim
//
// Render configurations (theme, device, font scale) are orthogonal to the semantic example and are
// listed beside it, never multiplied into separate examples.
//
// Pure: inputs are keyed collections of repo-relative path -> text, a path listing and resolver callbacks.

import { matchClose, splitArgs, kdocBefore, compact } from './vexboard-kotlin-source.mjs';
import { parseKotlinBlock, semanticRootsOf } from './vexboard-android-realization.mjs';

export const EXAMPLES_READER_VERSION = 'vexlife-android-examples/1';
export const EXAMPLE_KINDS = Object.freeze({
  PREVIEW: 'Android Studio Preview authored beside the Screen; seeds initial presentation state and fixture data.',
  GOLDEN: 'Screenshot-test case; an accepted reference render may exist at the pinned commit.',
  JOURNEY: 'Executable semantic walk; a transition, not a single checkpoint state.',
});

const named = (args, name) => args.find((arg) => arg.name === name)?.value ?? null;
const unquote = (value) => (/^"([^"$]*)"$/.exec(value ?? '')?.[1] ?? null);
const humanize = (value) => String(value).replace(/Preview$|Golden$/, '').replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_.]+/g, ' ').trim();

function functionsWithAnnotations(text) {
  const out = [];
  for (const match of text.matchAll(/((?:@[\w.]+(?:\((?:[^()]|\([^()]*\))*\))?\s*)+)(?:(?:internal|private|public)\s+)*fun\s+(\w+)\s*\(\s*\)\s*(?::\s*[\w.<>?]+\s*)?\{/g)) {
    const open = match.index + match[0].length - 1;
    let close;
    try { close = matchClose(text, open); } catch { continue; }
    const annotations = [...match[1].matchAll(/@([\w.]+)(\((?:[^()]|\([^()]*\))*\))?/g)].map((entry) => ({ name: entry[1], args: entry[2] ? splitArgs(entry[2].slice(1, -1)) : [] }));
    out.push({ name: match[2], annotations, body: text.slice(open + 1, close), start: match.index, doc: kdocBefore(text, match.index) });
  }
  return out;
}

// Multi-preview annotation classes: `@Preview(name = …) … annotation class X` -> X: [names].
export function previewConfigurations(files) {
  const configs = new Map();
  for (const [, text] of files) {
    for (const match of text.matchAll(/((?:@Preview\((?:[^()]|\([^()]*\))*\)\s*)+)(?:internal\s+|public\s+)?annotation\s+class\s+(\w+)/g)) {
      configs.set(match[2], [...match[1].matchAll(/@Preview\(((?:[^()]|\([^()]*\))*)\)/g)].map((entry) => unquote(named(splitArgs(entry[1]), 'name')) ?? 'Preview'));
    }
  }
  return configs;
}

// Non-composable functions defined in the read sources: candidates for shared fixture provenance.
function functionDefinitions(files) {
  const defs = new Map();
  for (const [path, text] of files) {
    if (!path.endsWith('.kt')) continue;
    for (const match of text.matchAll(/(@Composable\s+(?:@\w+\s+)*)?(?:(?:internal|private|public)\s+)*fun\s+(?:[\w.<>]+\.)?([a-z]\w*)\s*\(/g)) {
      if (match[1]) continue;
      if (!defs.has(match[2])) defs.set(match[2], path);
    }
  }
  return defs;
}

function calledFunctions(text, defs) {
  const names = new Set();
  // Top-level calls and function references only; member calls (`.push(`) are not fixture provenance.
  for (const match of String(text).matchAll(/(?:::([a-z]\w*))|(?<![.\w])([a-z]\w*)\s*\(/g)) {
    const name = match[1] ?? match[2];
    if (defs.has(name) && !/^(remember|listOf|mapOf|setOf|require|check|error|apply|also|let|run|copy|empty)$/.test(name)) names.add(name);
  }
  return [...names].sort();
}

function setupSteps(lambdaText, resolveRef) {
  const steps = [];
  for (const node of parseKotlinBlock(lambdaText)) {
    if (node.type !== 'CALL') continue;
    if (node.name === 'open' || node.name === 'close') {
      const expr = node.args[0]?.value ?? null;
      steps.push({ op: node.name.toUpperCase(), target: expr, targetRef: resolveRef(expr ?? '') ?? null });
    } else if (node.name === 'selectChild') {
      const container = named(node.args, 'container') ?? node.args[0]?.value ?? null;
      const child = named(node.args, 'child') ?? node.args[1]?.value ?? null;
      steps.push({ op: 'SELECT', target: `${container} -> ${child}`, containerRef: resolveRef(container ?? '') ?? null, targetRef: resolveRef(child ?? '') ?? null });
    } else {
      steps.push({ op: 'OTHER', target: node.text, targetRef: null });
    }
  }
  return steps;
}

function journeySteps(nodes, resolveRef, rawText) {
  const steps = [];
  for (const node of nodes) {
    if (node.type !== 'CALL') continue;
    const first = node.args[0]?.value ?? null;
    switch (node.name) {
      case 'start': case 'tap': case 'submit': case 'dismiss': case 'assertVisible': case 'expectVisible':
        steps.push({ op: node.name, target: first, targetRef: resolveRef(first ?? '') ?? null });
        break;
      case 'enterText': case 'type':
        steps.push({ op: node.name, target: named(node.args, 'field') ?? first, targetRef: resolveRef(named(node.args, 'field') ?? first ?? '') ?? null, value: named(node.args, 'value') ?? node.args[1]?.value ?? null });
        break;
      case 'tapElementById': case 'assertVisibleById': {
        const behaves = named(node.args, 'behavesLike');
        steps.push({ op: node.name, target: named(node.args, 'elementId') ?? first, targetRef: null, behavesLikeRef: behaves ? resolveRef(behaves) : null, runtimeIdentity: true });
        break;
      }
      case 'back':
        steps.push({ op: 'back', target: null, targetRef: null });
        break;
      case 'externalCause': {
        const open = node.text.indexOf('{', node.text.indexOf(')'));
        const code = open >= 0 ? compact(node.text.slice(open + 1, matchClose(node.text, open))) : null;
        steps.push({ op: 'externalCause', target: unquote(named(node.args, 'causeRef')) ?? named(node.args, 'causeRef'), repository: named(node.args, 'repository'), code, targetRef: null });
        break;
      }
      default:
        break;
    }
  }
  return steps;
}

export function readSourceExamples({ files, listing = [], roots, resolveRef, screenRefFor, toSource, composables, primitives, knownRefs, isPreviewSource, isGoldenSource, isJourneySource, referencePrefix }) {
  const examples = [];
  const held = [];
  const configs = previewConfigurations(files);
  const defs = functionDefinitions(files);
  const add = (example) => {
    if (examples.some((existing) => existing.ref === example.ref)) {
      held.push({ ref: example.ref, source: example.source, reason: `duplicate ${example.kind.toLowerCase()} id; the source id must be unique to be addressable` });
      return;
    }
    examples.push(example);
  };

  for (const [path, text] of [...files.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (!path.endsWith('.kt')) continue;
    if (isPreviewSource(path) && /VexPreviewHost\(|Vex\w+ScreenPreview\(/.test(text)) {
      for (const fn of functionsWithAnnotations(text)) {
        const configAnnotation = fn.annotations.find((annotation) => configs.has(annotation.name));
        if (!configAnnotation && !fn.annotations.some((annotation) => annotation.name === 'Preview')) continue;
        const nodes = parseKotlinBlock(fn.body).filter((node) => node.type === 'CALL');
        const host = nodes.find((node) => node.name === 'VexPreviewHost');
        const shortcut = nodes.find((node) => /^Vex\w+ScreenPreview$/.test(node.name));
        if (!host && !shortcut) continue;
        let id;
        let startScreen;
        let fixture = null;
        let setup = [];
        let renders = null;
        if (host) {
          id = unquote(named(host.args, 'id'));
          startScreen = named(host.args, 'startScreen');
          const factory = named(host.args, 'repositoriesFactory');
          if (factory) fixture = { expression: factory, functions: calledFunctions(factory, defs) };
          const setupArg = named(host.args, 'previewSetup');
          if (setupArg && /^\{/.test(setupArg)) setup = setupSteps(setupArg.slice(1, -1), resolveRef);
          renders = host.lambda?.find((node) => node.type === 'CALL')?.name ?? null;
        } else {
          startScreen = shortcut.args[0]?.value ?? null;
          id = null;
          renders = shortcut.name;
        }
        const subjectRef = screenRefFor(startScreen ?? '');
        if (!id) {
          held.push({ ref: `preview:${fn.name}`, source: toSource(path, fn.name), reason: host ? 'preview id is not a literal' : `${shortcut.name} derives its id inside the shared host; the Screen file does not name it` });
          id = `${fn.name}`;
        }
        add({
          ref: `preview:${id}`,
          kind: 'PREVIEW',
          id,
          label: humanize(fn.name),
          symbol: fn.name,
          source: toSource(path, fn.name),
          summary: fn.doc,
          subjectRef,
          subjectHeld: subjectRef ? null : `start screen ${startScreen ?? '(none)'} is not a projected screen`,
          renders,
          rendered: renders ? [renders] : [],
          fixture,
          setup,
          configurations: configAnnotation ? configs.get(configAnnotation.name) : fn.annotations.filter((annotation) => annotation.name === 'Preview').map((annotation) => unquote(named(annotation.args, 'name')) ?? 'Preview'),
          evidence: [],
          steps: [],
          screens: subjectRef ? [subjectRef] : [],
        });
      }
    }
    if (isGoldenSource(path) && text.includes('@PreviewTest')) {
      const fileKt = `${path.split('/').pop().replace(/\.kt$/, '')}Kt`;
      const packagePath = (/^package\s+([\w.]+)/m.exec(text)?.[1] ?? '').replace(/\./g, '/');
      for (const fn of functionsWithAnnotations(text)) {
        if (!fn.annotations.some((annotation) => annotation.name === 'PreviewTest')) continue;
        const caseRef = /Semantic visual case:\s*([\w.-]+)/.exec(fn.doc ?? '')?.[1] ?? null;
        const previewName = unquote(named(fn.annotations.find((annotation) => annotation.name === 'Preview')?.args ?? [], 'name'));
        const roots = semanticRootsOf({ body: fn.body, path, symbol: fn.name, composables, primitives, resolveRef, toSource, knownRefs });
        const subjectRef = roots.known[0] ?? null;
        const evidence = listing
          .filter((entry) => entry.startsWith(`${referencePrefix}${packagePath}/${fileKt}/${fn.name}_`) && entry.endsWith('.png'))
          .map((entry) => ({ kind: 'GOLDEN_REFERENCE', path: entry, configuration: previewName, meaning: 'Accepted reference render recorded by the screenshot test at this commit (expected, not an observed device run).' }));
        const ref = `golden:${caseRef ?? fn.name}`;
        if (!caseRef) held.push({ ref, source: toSource(path, fn.name), reason: 'golden has no "Semantic visual case:" identity in its KDoc; the function name stands in' });
        add({
          ref,
          kind: 'GOLDEN',
          id: caseRef ?? fn.name,
          label: previewName ?? humanize(fn.name),
          symbol: fn.name,
          source: toSource(path, fn.name),
          summary: fn.doc?.replace(/^Semantic visual case:\s*[\w.-]+\s*/, '') || null,
          subjectRef,
          subjectHeld: subjectRef ? null : roots.foreign.length
            ? `renders a semantic root no production coordinate shares (${roots.foreign.join(', ')}); evidence cannot attach to the production subject`
            : `renders ${roots.rendered.slice(0, 3).join(' → ') || '(nothing readable)'} without a stable semantic root; evidence cannot attach to a projected subject`,
          // The seam an example renders: the first production composable that itself realizes presentation
          // (calls a Vex primitive or a lazy list), not a theme or test wrapper around it.
          renders: roots.rendered.find((symbol) => (composables.get(symbol) ?? []).some((def) => !isGoldenSource(def.path) && /\bVex[A-Z]\w*\(|\bLazyColumn\(/.test(def.body))) ?? roots.rendered[0] ?? null,
          rendered: roots.rendered,
          fixture: { expression: null, functions: calledFunctions(fn.body, defs) },
          setup: [],
          configurations: previewName ? [previewName] : [],
          evidence,
          steps: [],
          screens: subjectRef ? [subjectRef.replace(/^element\.([^.]+).*$/, 'screen.$1')] : [],
        });
      }
    }
    if (isJourneySource(path) && /\bvexJourney\(/.test(text)) {
      // vexJourney declarations sit inside objects as `val x = vexJourney(...) { … }`.
      for (const match of text.matchAll(/\bvexJourney\(/g)) {
        const open = match.index + match[0].length - 1;
        const close = matchClose(text, open);
        const args = splitArgs(text.slice(open + 1, close));
        const lambdaOpen = /^\s*\{/.test(text.slice(close + 1)) ? text.indexOf('{', close) : -1;
        if (lambdaOpen < 0) continue;
        const lambdaClose = matchClose(text, lambdaOpen);
        const id = unquote(named(args, 'id')) ?? unquote(args.find((arg) => !arg.name)?.value);
        const title = unquote(named(args, 'title')) ?? null;
        const holder = /val\s+(\w+)\s*=\s*$/.exec(text.slice(Math.max(0, match.index - 120), match.index))?.[1] ?? null;
        if (!id) { held.push({ ref: `journey:${holder ?? match.index}`, source: toSource(path, holder ?? 'vexJourney'), reason: 'journey id is not a literal' }); continue; }
        const steps = journeySteps(parseKotlinBlock(text.slice(lambdaOpen + 1, lambdaClose)), resolveRef);
        const screens = [...new Set(steps.flatMap((step) => [step.targetRef, step.behavesLikeRef]).filter(Boolean).map((ref) => (ref.startsWith('screen.') ? ref : ref.replace(/^element\.([^.]+).*$/, 'screen.$1'))).filter((ref) => ref !== 'screen.shell'))];
        add({
          ref: `journey:${id}`,
          kind: 'JOURNEY',
          id,
          label: title ?? humanize(id),
          symbol: holder,
          source: toSource(path, holder ?? `vexJourney(${id})`),
          summary: null,
          subjectRef: steps.find((step) => step.op === 'start')?.targetRef ?? screens[0] ?? null,
          subjectHeld: null,
          renders: null,
          rendered: [],
          fixture: null,
          setup: [],
          configurations: [],
          evidence: [],
          steps,
          screens,
        });
      }
    }
  }

  // Examples that call the same fixture function describe the same authored state family.
  for (const example of examples) {
    const mine = new Set(example.fixture?.functions ?? []);
    example.related = examples.filter((other) => other !== example && mine.size && (other.fixture?.functions ?? []).some((fn) => mine.has(fn))).map((other) => ({ ref: other.ref, via: (other.fixture.functions).filter((fn) => mine.has(fn)) }));
  }
  return { examples, held };
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][SOURCE-AUTHORED-EXAMPLES]