// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][ANDROID]
//
// Android patient-zero adapter.
//
// It consumes the same generated Screen Lens element records already produced from Android source.
// No second Kotlin element parser is introduced here.

import { createLocalizationInventory } from '../shared/vexboard-localization-inventory.mjs';

export const ANDROID_LOCALIZATION_PRODUCER = Object.freeze({
  ref: 'producer.vexboard.localization.android-screen-lens',
  version: 'vexlife-android-localization/1',
});

function sourceBinding(labelRes) {
  const match = /^R\.string\.(\w+)$/.exec(labelRes ?? '');
  if (!match) return null;
  return {
    sourceStringRef: `android:R.string.${match[1]}`,
    sourceKey: match[1],
  };
}

function bindingRole(element) {
  return element.kind === 'TEXT' ? 'TEXT' : 'LABEL';
}

function occurrence({ subjectRef, surfaceRef, screenRef, sourcePath, element }) {
  const binding = sourceBinding(element.labelRes);
  if (!binding) return null;
  const subject = subjectRef.replace(/^subject\./, '');
  const role = bindingRole(element).toLowerCase();
  return {
    occurrenceRef: `occurrence.localization.${subject}.${element.ref}.${role}`,
    surfaceRef,
    screenRef,
    elementRef: element.ref,
    parentElementRef: element.parentRef ?? null,
    elementKind: element.kind,
    bindingRole: bindingRole(element),
    textRole: element.textRole ?? null,
    ...binding,
    sourceValue: element.label,
    sourcePath,
  };
}

export function androidLocalizationOccurrences({ subjectRef, lens }) {
  const rows = [];
  for (const chrome of lens.chrome ?? []) {
    for (const element of chrome.elements ?? []) {
      const row = occurrence({
        subjectRef,
        surfaceRef: chrome.chromeRef,
        screenRef: null,
        sourcePath: chrome.source ?? null,
        element,
      });
      if (row) rows.push(row);
    }
  }
  for (const screen of lens.screens ?? []) {
    for (const element of screen.elements ?? []) {
      const row = occurrence({
        subjectRef,
        surfaceRef: screen.screenRef,
        screenRef: screen.screenRef,
        sourcePath: screen.source ?? null,
        element,
      });
      if (row) rows.push(row);
    }
  }
  return rows;
}

export function projectAndroidLocalizationInventory({
  subjectRef = 'subject.vexlife-android',
  lens,
  sourceLocale = 'en',
  buildRef = null,
}) {
  if (!lens?.sourceSnapshot?.repositoryRef || !lens?.sourceSnapshot?.commit) {
    throw new TypeError('android localization: Screen Lens sourceSnapshot is required');
  }
  return createLocalizationInventory({
    inventoryRef: `localization.${subjectRef.replace(/^subject\./, '')}`,
    subjectRef,
    sourceSnapshot: lens.sourceSnapshot,
    sourceLocale,
    buildRef,
    producer: ANDROID_LOCALIZATION_PRODUCER,
    occurrences: androidLocalizationOccurrences({ subjectRef, lens }),
  });
}
