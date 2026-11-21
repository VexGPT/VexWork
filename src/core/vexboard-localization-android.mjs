// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][ANDROID]
//
// Android patient-zero adapter.
//
// It consumes the same generated Screen Lens element records already produced from Android source,
// plus the exact Android string-resource source catalog. No second Kotlin element parser is introduced.

import { parseStringResources } from './vexboard-screen-lens-android-adapter.mjs';
import { createLocalizationInventory } from '../shared/vexboard-localization-inventory.mjs';

export const ANDROID_LOCALIZATION_PRODUCER = Object.freeze({
  ref: 'producer.vexboard.localization.android-screen-lens',
  version: 'vexlife-android-localization/2',
});

export const ANDROID_DEFAULT_STRINGS_PATH = 'app/src/main/res/values/strings.xml';

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

export function androidSourceStrings(stringsXml, { sourcePath = ANDROID_DEFAULT_STRINGS_PATH } = {}) {
  return [...parseStringResources(stringsXml).entries()]
    .map(([sourceKey, sourceValue]) => ({
      sourceStringRef: `android:R.string.${sourceKey}`,
      sourceKey,
      sourceValue,
      sourcePath,
    }))
    .sort((a, b) => a.sourceStringRef.localeCompare(b.sourceStringRef));
}

function occurrence({ subjectRef, surfaceRef, screenRef, sourcePath, element, sourceByRef }) {
  const binding = sourceBinding(element.labelRes);
  if (!binding) return null;
  const source = sourceByRef.get(binding.sourceStringRef);
  if (!source) {
    throw new TypeError(`android localization: ${element.ref} references missing ${binding.sourceStringRef}`);
  }
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
    sourceValue: source.sourceValue,
    sourcePath,
  };
}

export function androidLocalizationOccurrences({ subjectRef, lens, sourceStrings }) {
  const sourceByRef = new Map(sourceStrings.map((row) => [row.sourceStringRef, row]));
  const rows = [];
  for (const chrome of lens.chrome ?? []) {
    for (const element of chrome.elements ?? []) {
      const row = occurrence({
        subjectRef,
        surfaceRef: chrome.chromeRef,
        screenRef: null,
        sourcePath: chrome.source ?? null,
        element,
        sourceByRef,
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
        sourceByRef,
      });
      if (row) rows.push(row);
    }
  }
  return rows;
}

export function projectAndroidLocalizationInventoryFromSourceStrings({
  subjectRef = 'subject.vexlife-android',
  lens,
  sourceStrings,
  sourceLocale = 'en',
  buildRef = null,
}) {
  if (!lens?.sourceSnapshot?.repositoryRef || !lens?.sourceSnapshot?.commit) {
    throw new TypeError('android localization: Screen Lens sourceSnapshot is required');
  }
  if (!Array.isArray(sourceStrings) || !sourceStrings.length) {
    throw new TypeError('android localization: source string catalog is required');
  }
  return createLocalizationInventory({
    inventoryRef: `localization.${subjectRef.replace(/^subject\./, '')}`,
    subjectRef,
    sourceSnapshot: lens.sourceSnapshot,
    sourceLocale,
    buildRef,
    producer: ANDROID_LOCALIZATION_PRODUCER,
    sourceStrings,
    occurrences: androidLocalizationOccurrences({ subjectRef, lens, sourceStrings }),
  });
}

export function projectAndroidLocalizationInventory({
  subjectRef = 'subject.vexlife-android',
  lens,
  stringsXml,
  sourceLocale = 'en',
  buildRef = null,
  stringsPath = ANDROID_DEFAULT_STRINGS_PATH,
}) {
  if (typeof stringsXml !== 'string') {
    throw new TypeError('android localization: exact strings.xml source is required');
  }
  return projectAndroidLocalizationInventoryFromSourceStrings({
    subjectRef,
    lens,
    sourceStrings: androidSourceStrings(stringsXml, { sourcePath: stringsPath }),
    sourceLocale,
    buildRef,
  });
}
