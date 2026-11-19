// Experience Relationship Graph — post-map interruption / race derivation.
//
// Starts only from ordinary routes. Graph topology generates the *question*; exact source decides
// the expected behavior:
//
//   Family law decides it       -> EXPECTED_FROM_LAW (provable by executing act())
//   realization source decides  -> answered only by bound source-review evidence whose file blobs
//                                  still match the graph's source; otherwise UNKNOWN / STALE
//   nothing decides it yet      -> UNKNOWN (never a guessed assertion)
//
// Consideration labels are analysis metadata, not Product semantics.
//
// Pure: no file system, network or clock.

import { graphIndex } from './experience-graph.mjs';

export const EXPERIENCE_PERTURBATION_SCHEMA = 'vexwork.experience-graph.perturbation/v1';
export const PERTURBATION_EVIDENCE_SCHEMA = 'vexwork.experience-graph.perturbation-evidence/v1';

export const PERTURBATION_CLASSES = Object.freeze([
  'REENTRY', 'INTERRUPT', 'SIBLING_CONTROL', 'STALE_OBSERVATION', 'CAPTURE_RACE', 'TEARDOWN', 'ORDERING', 'RETRY_IDEMPOTENCY',
]);

export const ANSWER_STATES = Object.freeze(['EXPECTED_FROM_LAW', 'ANSWERED_BY_EVIDENCE', 'STALE_EVIDENCE', 'UNKNOWN']);

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const short = (ref) => ref.split('.').slice(1).join('.') || ref;

function lawOutcome(index, stateRef, controlRef) {
  const offers = index.edges.get(`edge:OFFERS:${stateRef}:${controlRef}`);
  if (!offers) return { kind: 'REJECT', effects: [], admitted: [], guarded: false };
  const rows = (index.outgoing.get(controlRef) ?? []).filter((edge) => edge.whenState === stateRef);
  return {
    kind: rows.some((edge) => edge.kind === 'ADMITS_STATE') ? 'ADMIT' : 'STAY',
    effects: [...new Set(rows.filter((edge) => edge.kind === 'REQUESTS_EFFECT').map((edge) => edge.to))].sort(compare),
    admitted: [...new Set(rows.filter((edge) => edge.kind === 'ADMITS_STATE').map((edge) => edge.to))].sort(compare),
    guarded: offers.guards.length > 0,
  };
}

function realizers(index, effectRef, family) {
  return new Set((index.outgoing.get(effectRef) ?? []).filter((edge) => edge.kind === 'REALIZED_BY' && (!edge.family || edge.family === family)).map((edge) => edge.to));
}

// In-flight windows: a lawful Control requests an Effect, and the Family then sits in some State
// (the admitted one, or the current one for STAY) until outside truth is observed.
function inFlightWindows(graph, index) {
  const windows = [];
  for (const edge of graph.edges) {
    if (edge.kind !== 'REQUESTS_EFFECT') continue;
    const admit = (index.outgoing.get(edge.from) ?? []).find((row) => row.kind === 'ADMITS_STATE' && row.whenState === edge.whenState && row.ref.split(':').at(-1) === edge.ref.split(':').at(-1));
    windows.push({
      family: edge.family,
      origin: edge.whenState,
      control: edge.from,
      effect: edge.to,
      window: admit ? admit.to : edge.whenState,
      windowForm: admit ? 'ADMITTED_TRANSIENT_STATE' : 'UNCHANGED_STATE_EFFECT_ACTIVE',
      guards: edge.guards,
    });
  }
  return windows;
}

function evidenceFor(evidence, perturbationRef, sourceFiles) {
  const row = evidence?.answers?.find((entry) => entry.perturbationRef === perturbationRef);
  if (!row) return null;
  const blobs = new Map(sourceFiles.map((file) => [file.path, file.blobSha1]));
  const current = row.sourceFiles.every((file) => blobs.get(file.path) === file.blobSha1);
  return { ...row, current };
}

function answered(question, evidence, sourceFiles) {
  const bound = evidenceFor(evidence, question.perturbationRef, sourceFiles);
  if (!bound) return question;
  return {
    ...question,
    answerState: bound.current ? 'ANSWERED_BY_EVIDENCE' : 'STALE_EVIDENCE',
    expected: bound.current ? bound.answer : question.expected,
    evidence: { method: bound.method, sourceRefs: bound.sourceRefs, current: bound.current, note: bound.note },
  };
}

export function derivePerturbations(graph, { evidence = null } = {}) {
  const index = graphIndex(graph);
  const questions = [];
  const seen = new Set();
  const push = (question) => {
    if (seen.has(question.perturbationRef)) return;
    seen.add(question.perturbationRef);
    questions.push(answered(question, evidence, graph.source.files));
  };

  const axisFamilies = new Set(graph.nodes.filter((node) => node.role === 'FAMILY' && node.detail.stateShape === 'AXES').map((node) => node.ref));
  for (const window of inFlightWindows(graph, index)) {
    const family = window.family;
    // Axis-State Families carry in-flight work as busy axes (handled below), not as State identity.
    if (axisFamilies.has(family)) continue;
    const controls = graph.nodes.filter((node) => node.role === 'CONTROL' && node.family === family);
    const base = `${short(window.origin)}+${short(window.control)}`;

    // REENTRY: the same Control again while its Effect is in flight.
    const again = lawOutcome(index, window.window, window.control);
    push({
      perturbationRef: `perturbation:REENTRY:${family}:${base}`,
      consideration: 'REENTRY',
      family,
      baseRoute: `route:${window.origin}:${index.nodes.get(window.control).detail.symbol}`,
      activeEffect: window.effect,
      inFlightState: window.window,
      perturbing: window.control,
      question: `${short(window.control)} again while ${short(window.effect)} is in flight (Family at ${short(window.window)})`,
      answerState: again.kind === 'REJECT' ? 'EXPECTED_FROM_LAW' : 'UNKNOWN',
      expected: again.kind === 'REJECT'
        ? `act() rejects ${short(window.control)} in ${short(window.window)}: no admitted State, no Effect`
        : `act() admits ${again.kind}${again.effects.length ? ` + ${again.effects.map(short).join(', ')}` : ''}; whether the realization fences a second ${short(window.effect)} is not stated by Family law`,
      proofClass: again.kind === 'REJECT' ? 'A' : 'B',
    });

    // INTERRUPT / SIBLING_CONTROL: any other Control the in-flight State still offers or refuses.
    const activeOwners = realizers(index, window.effect, family);
    for (const control of controls) {
      if (control.ref === window.control) continue;
      const outcome = lawOutcome(index, window.window, control.ref);
      // In an unchanged State a refused Control is exactly the ordinary negative case; only a
      // transient (admitted) State or a still-lawful Control adds timing meaning.
      if (window.windowForm === 'UNCHANGED_STATE_EFFECT_ACTIVE' && outcome.kind === 'REJECT') continue;
      const sharesRealization = outcome.effects.some((effect) => [...realizers(index, effect, family)].some((owner) => activeOwners.has(owner)));
      const consideration = outcome.kind !== 'REJECT' && sharesRealization ? 'INTERRUPT' : 'SIBLING_CONTROL';
      // Two lawful Controls in one unchanged State form one concurrency question, not two.
      const pair = [short(window.control), short(control.ref)].sort(compare).join('+');
      const symmetric = window.windowForm === 'UNCHANGED_STATE_EFFECT_ACTIVE' && outcome.kind !== 'REJECT';
      push({
        perturbationRef: symmetric
          ? `perturbation:${consideration}:${family}:${short(window.window)}:concurrent:${pair}`
          : `perturbation:${consideration}:${family}:${base}:${short(control.ref)}`,
        consideration,
        family,
        baseRoute: `route:${window.origin}:${index.nodes.get(window.control).detail.symbol}`,
        activeEffect: window.effect,
        inFlightState: window.window,
        perturbing: control.ref,
        question: `${short(control.ref)} while ${short(window.effect)} is in flight (Family at ${short(window.window)})`,
        answerState: outcome.kind === 'REJECT' ? 'EXPECTED_FROM_LAW' : 'UNKNOWN',
        expected: outcome.kind === 'REJECT'
          ? `act() rejects ${short(control.ref)} in ${short(window.window)}: effect-free`
          : `act() ${outcome.kind}${outcome.admitted.length ? ` -> ${outcome.admitted.map(short).join(', ')}` : ''}${outcome.effects.length ? ` + ${outcome.effects.map(short).join(', ')}` : ''}; what happens to the in-flight ${short(window.effect)} is owned by its realization`,
        proofClass: outcome.kind === 'REJECT' ? 'A' : 'B',
      });
    }

    // STALE_OBSERVATION: an observation that does not read current State, whose successor differs
    // from a newer State another Control admits during this window.
    const newer = controls
      .map((control) => ({ control, outcome: lawOutcome(index, window.window, control.ref) }))
      .filter(({ outcome }) => outcome.kind === 'ADMIT');
    if (!newer.length) continue;
    // Only observations the in-flight Effect's own realization returns can arrive late from it.
    const returnedByActive = new Set(graph.edges
      .filter((edge) => edge.kind === 'RETURNS_TO' && edge.family === family && activeOwners.has(edge.from))
      .map((edge) => edge.to));
    const observations = graph.nodes.filter((node) => node.role === 'OBSERVATION' && node.family === family
      && node.detail.takesCurrentState === false && returnedByActive.has(node.ref));
    for (const observation of observations) {
      const successors = (index.outgoing.get(observation.ref) ?? []).filter((edge) => edge.kind === 'OBSERVES_AS').map((edge) => edge.to);
      for (const { control, outcome } of newer) {
        for (const later of outcome.admitted) {
          for (const successor of successors) {
            if (successor === later || successor === window.window) continue;
            push({
              perturbationRef: `perturbation:STALE_OBSERVATION:${family}:${short(window.window)}:${short(control.ref)}:${short(observation.ref)}:${short(successor)}`,
              consideration: 'STALE_OBSERVATION',
              family,
              baseRoute: `route:${window.origin}:${index.nodes.get(window.control).detail.symbol}`,
              activeEffect: window.effect,
              inFlightState: window.window,
              perturbing: control.ref,
              lateObservation: observation.ref,
              lateSuccessor: successor,
              newerState: later,
              question: `${short(control.ref)} admits ${short(later)}; can a late ${short(observation.ref)} -> ${short(successor)} from the earlier ${short(window.effect)} overwrite it?`,
              answerState: 'UNKNOWN',
              expected: `${short(observation.ref)} does not read current State, so Family law cannot fence it; the realization owner must`,
              proofClass: 'C',
              realizationSites: [...realizers(index, window.effect, family)].sort(compare),
            });
          }
        }
      }
    }
  }

  // Axis-State busy guards: a Control whose law requires a running-work axis to be false.
  for (const edge of graph.edges.filter((row) => row.kind === 'OFFERS' && row.guards.length)) {
    const axes = new Set();
    for (const guard of edge.guards) for (const match of guard.matchAll(/!currentState\.(any\w*Running|downloading|switching)\b/g)) axes.add(match[1]);
    for (const axis of [...axes].sort(compare)) {
      push({
        perturbationRef: `perturbation:SIBLING_CONTROL:${edge.family}:${short(edge.to)}:while:${axis}`,
        consideration: 'SIBLING_CONTROL',
        family: edge.family,
        baseRoute: null,
        activeEffect: null,
        inFlightState: `${edge.from}{${axis}=true}`,
        perturbing: edge.to,
        question: `${short(edge.to)} while ${axis} is true`,
        answerState: 'EXPECTED_FROM_LAW',
        expected: `act() requires !${axis}; ${short(edge.to)} is rejected effect-free while ${axis} is true`,
        proofClass: 'A',
      });
    }
  }

  // CAPTURE_RACE: mutable current truth changes while an accepted turn that captured it is in flight.
  for (const edge of graph.edges.filter((row) => row.kind === 'CAPTURED_AT_SEND')) {
    const capture = index.nodes.get(edge.to);
    const law = capture.detail.captureLaw ?? '';
    const stated = /later .*next Send|stays exact/i.test(law);
    const structural = `${capture.ref} is a val of an immutable data class built once per accepted Send (structural capture); whether a later turn stage re-reads ${edge.from} directly is not yet in the graph`;
    push({
      perturbationRef: `perturbation:CAPTURE_RACE:${edge.to}:${edge.from}`,
      consideration: 'CAPTURE_RACE',
      family: null,
      baseRoute: null,
      activeEffect: null,
      inFlightState: 'DirectCompanionTurn:accepted-turn-in-flight',
      perturbing: edge.from,
      question: `${edge.from} changes after Send captured ${capture.label} but before the turn completes`,
      answerState: stated ? 'EXPECTED_FROM_LAW' : 'UNKNOWN',
      expected: stated ? `source capture law: "${law}"` : structural,
      proofClass: 'B',
      evidenceRef: capture.sourceRef,
    });
  }

  // RETRY_IDEMPOTENCY: the accepted Send carries an idempotency identity.
  for (const node of graph.nodes.filter((row) => row.role === 'CAPTURE' && row.detail.role === 'IDEMPOTENCY_IDENTITY')) {
    push({
      perturbationRef: `perturbation:RETRY_IDEMPOTENCY:${node.ref}`,
      consideration: 'RETRY_IDEMPOTENCY',
      family: null,
      baseRoute: null,
      activeEffect: null,
      inFlightState: 'DirectCompanionTurn:accepted-turn',
      perturbing: node.ref,
      question: 'transport retries the same Send with the same idempotencyKey',
      answerState: 'UNKNOWN',
      expected: 'DirectCompanionTurn owns duplicate recovery; the graph does not yet carry its recovery law',
      proofClass: 'B',
      evidenceRef: node.sourceRef,
    });
  }

  questions.sort((a, b) => compare(a.perturbationRef, b.perturbationRef));
  const counts = Object.fromEntries(PERTURBATION_CLASSES.map((name) => [name, questions.filter((row) => row.consideration === name).length]));
  return Object.freeze({
    schemaVersion: EXPERIENCE_PERTURBATION_SCHEMA,
    graphFingerprint: graph.fingerprint,
    counts,
    answers: Object.fromEntries(ANSWER_STATES.map((name) => [name, questions.filter((row) => row.answerState === name).length])),
    notGenerated: {
      TEARDOWN: 'no owner-lifetime coordinate is present in the extracted graph',
      ORDERING: 'no source-authored overlap policy (Earliest / Latest / Queued) is attached to a VexLife-Prod relationship',
    },
    questions: Object.freeze(questions),
  });
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][PERTURBATION]
