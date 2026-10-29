import assert from 'node:assert/strict';
import test from 'node:test';

import {
  compileFamilyKotlin,
  normalizeFamilyKotlinModel,
  rebindControlResource,
} from '../src/core/vexboard-family-kotlin-construction.mjs';

const model = {
  schemaVersion: 'vexboard.family-kotlin/poc-v1',
  modelRef: 'model.vexlife.family.typed-identity.patient-zero',
  targetSourceRefOrNull: null,
  testSourceRef:
    'repo.vexlife-android:architecture/behavior/src/test/kotlin/com/vextreme/vexlife/android/behavior/VexFamilyHighConfidenceTest.kt',
  families: [
    {
      familyRef: 'family.resource-identity',
      familyName: 'ResourceIdentityFamily',
      controlForm: 'SEALED',
      states: ['Idle'],
      resources: [
        {
          resourceRef: 'resource.track-id',
          name: 'TrackId',
          valueField: { name: 'value', type: 'String' },
        },
        {
          resourceRef: 'resource.account-id',
          name: 'AccountId',
          valueField: { name: 'value', type: 'String' },
        },
      ],
      controls: [
        {
          controlRef: 'control.play',
          name: 'Play',
          resourceIdRefOrNull: 'resource.track-id',
          payloadFields: [{ name: 'position', type: 'Int' }],
        },
        {
          controlRef: 'control.search',
          name: 'Search',
          resourceIdRefOrNull: null,
          payloadFields: [{ name: 'query', type: 'String' }],
        },
      ],
    },
    {
      familyRef: 'family.enum-control',
      familyName: 'EnumControlFamily',
      controlForm: 'ENUM',
      states: ['Idle'],
      resources: [],
      controls: [
        {
          controlRef: 'control.enum.play',
          name: 'Play',
          resourceIdRefOrNull: null,
          payloadFields: [],
        },
        {
          controlRef: 'control.enum.pause',
          name: 'Pause',
          resourceIdRefOrNull: null,
          payloadFields: [],
        },
      ],
    },
  ],
  sourceRefs: [
    'github.pull.vexlife-android.193',
    'github.commit.vexlife-android.a05b67876d951d513633d04de4acf702e5ed834b',
  ],
};

test('Family Kotlin construction preserves exact resource type in implementation and test language', () => {
  const normalized = normalizeFamilyKotlinModel(model);
  const plan = compileFamilyKotlin(normalized);

  assert.match(
    plan.familySource,
    /VexFamily\.Control\.Resource<[\s\S]*ResourceIdentityFamily,[\s\S]*TrackId/,
  );
  assert.match(plan.familySource, /override val resourceId: TrackId/);
  assert.match(plan.familySource, /override fun act\(/);
  assert.match(plan.familySource, /State\.Idle[\s\S]*is Control\.Play[\s\S]*stay\(\)/);
  assert.match(
    plan.testSource,
    /control: ResourceIdentityFamily\.Control\.Play,[\s\S]*ResourceIdentityFamily\.TrackId/,
  );
  assert.match(plan.testSource, /position = 10/);
  assert.match(plan.testSource, /position = 99/);
  assert.match(plan.testSource, /EnumControlFamily\.Control\.Play/);
  assert.match(plan.testSource, /EnumControlFamily\.Control\.Pause/);
  assert.equal(plan.externalEffectsPerformed, false);
});

test('rebinding the VexBoard language changes implementation and mapped test Kotlin together', () => {
  const rebound = rebindControlResource(model, {
    familyRef: 'family.resource-identity',
    controlRef: 'control.play',
    resourceIdRefOrNull: 'resource.account-id',
  });
  const plan = compileFamilyKotlin(rebound);

  assert.match(plan.familySource, /override val resourceId: AccountId/);
  assert.match(
    plan.familySource,
    /VexFamily\.Control\.Resource<[\s\S]*ResourceIdentityFamily,[\s\S]*AccountId/,
  );
  assert.match(
    plan.testSource,
    /control: ResourceIdentityFamily\.Control\.Play,[\s\S]*ResourceIdentityFamily\.AccountId/,
  );
  assert.doesNotMatch(
    plan.testSource,
    /control: ResourceIdentityFamily\.Control\.Play,[\s\S]*ResourceIdentityFamily\.TrackId/,
  );
});

test('resource binding fails closed outside the owning Family', () => {
  assert.throws(
    () => rebindControlResource(model, {
      familyRef: 'family.resource-identity',
      controlRef: 'control.play',
      resourceIdRefOrNull: 'resource.not-in-family',
    }),
    /does not belong to Family/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][FAMILY-KOTLIN-CONSTRUCTION-PROOF]
