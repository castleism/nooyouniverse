import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const NooLog = require("../src/noo-log.js");
const catalog = require("../src/approved-missions.js");
const fixtures = resolve(dirname(fileURLToPath(import.meta.url)), "fixtures");

function draft(overrides) {
  return Object.assign(
    {
      missionId: "mission-07",
      observedAt: "2026-09-20T09:00:00.000Z",
      variable: "Whether a quieter evening felt different",
      context: {
        sleepWindow: "Usual bedtime window",
        workload: "Light",
        environment: "Same room",
        timingNotes: "Evening",
        other: "",
      },
      expectation: "Expected to notice a difference. Expectation only.",
      outcome: "Nothing noticeable happened.",
      outcomeKind: "null",
      pattern: "first",
      uncertainty: "high",
      notes: "",
    },
    overrides
  );
}

test("empty store has no observations and is not a fixture dump", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  assert.deepEqual(store.list(), []);
});

test("create, persist across a new store instance, edit, search, delete", () => {
  const adapter = NooLog.memoryAdapter("");
  const first = NooLog.createStore(catalog, adapter);
  const created = first.create(draft({ missionId: "mission-06", variable: "Desk noise vs usual" }));
  assert.equal(created.ok, true);
  assert.equal(created.value.kind, "observation");
  assert.equal(created.value.notAMeasurement, true);
  assert.equal(created.value.missionTitle, "Confounders Are Stowaways");

  const relaunched = NooLog.createStore(catalog, adapter);
  assert.equal(relaunched.list().length, 1);
  assert.equal(relaunched.list()[0].id, created.value.id);

  const edited = relaunched.update(created.value.id, {
    outcome: "Still nothing noticeable — kept as a null result.",
    outcomeKind: "null",
    uncertainty: "medium",
    pattern: "repeated",
  });
  assert.equal(edited.ok, true);
  assert.equal(edited.value.outcomeKind, "null");
  assert.ok(edited.value.updatedAt >= created.value.updatedAt);

  const hits = relaunched.search("desk noise");
  assert.equal(hits.length, 1);
  assert.equal(relaunched.search("caffeine window").length, 0);

  const removed = relaunched.remove(created.value.id);
  assert.equal(removed.ok, true);
  assert.equal(relaunched.list().length, 0);
});

test("rejects unknown missions instead of inventing canon", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  const result = store.create(draft({ missionId: "mission-99" }));
  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /not an approved mission/);
});

test("rejects measurement/clinical fields", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  const result = store.create(
    draft({
      heartRate: 64,
      measurements: { glucose: 5.2 },
    })
  );
  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /measurement\/clinical/);
});

test("null outcomes stay first-class and do not become efficacy claims", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  const result = store.create(draft({ outcome: "", outcomeKind: "null" }));
  assert.equal(result.ok, true);
  assert.equal(result.value.outcomeKind, "null");
  assert.match(result.value.outcome, /Nothing noticeable happened/i);
});

test("validated export/import: fixture merge, replace, and rejects", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  const valid = JSON.parse(readFileSync(resolve(fixtures, "valid-export.json"), "utf8"));
  const merged = store.importDocument(valid, "merge");
  assert.equal(merged.ok, true);
  assert.equal(store.list().length, 1);
  assert.equal(store.list()[0].id, "fixture-obs-001");

  const second = store.create(draft({ missionId: "mission-11", variable: "Sleep window noted before a stack claim" }));
  assert.equal(second.ok, true);
  assert.equal(store.list().length, 2);

  const replaced = store.importDocument(valid, "replace");
  assert.equal(replaced.ok, true);
  assert.equal(store.list().length, 1);

  const measurement = JSON.parse(readFileSync(resolve(fixtures, "invalid-measurement.json"), "utf8"));
  const badMeasure = store.importDocument(measurement, "merge");
  assert.equal(badMeasure.ok, false);
  assert.equal(store.list().length, 1);

  const unknown = JSON.parse(readFileSync(resolve(fixtures, "invalid-unknown-mission.json"), "utf8"));
  const badMission = store.importDocument(unknown, "merge");
  assert.equal(badMission.ok, false);
  assert.equal(store.list().length, 1);
});

test("export envelope labels the file as observations, not measurements", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  store.create(draft());
  const exported = store.exportDocument();
  assert.equal(exported.ok, true);
  const doc = exported.value;
  assert.equal(doc.format, "noo-private-observation-log");
  assert.equal(doc.kind, "private-observation-log");
  assert.ok(doc.not.includes("measurement-export"));
  assert.ok(doc.not.includes("clinical-claim"));
  assert.equal(doc.observations[0].kind, "observation");
});

test("edits keep an append-only correction history", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  const created = store.create(draft({ outcome: "First note.", outcomeKind: "noticed" }));
  const edited = store.update(created.value.id, {
    outcome: "Corrected note. Still not a measurement.",
    outcomeKind: "null",
    uncertainty: "medium",
  });
  assert.equal(edited.ok, true);
  assert.equal(edited.value.corrections.length, 1);
  assert.equal(edited.value.corrections[0].outcome, "First note.");
  assert.equal(edited.value.corrections[0].outcomeKind, "noticed");
  assert.equal(edited.value.outcomeKind, "null");
});

test("stayedComparable is stored as context, not a measurement", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  const created = store.create(
    draft({
      context: {
        sleepWindow: "Usual window",
        workload: "Light",
        environment: "Same room",
        timingNotes: "Evening",
        stayedComparable: "Same desk, same evening hour",
        other: "",
      },
    })
  );
  assert.equal(created.ok, true);
  assert.equal(created.value.context.stayedComparable, "Same desk, same evening hour");
  assert.equal(store.search("same desk").length, 1);
});

test("search can filter by mission and outcome kind", () => {
  const store = NooLog.createStore(catalog, NooLog.memoryAdapter(""));
  store.create(draft({ missionId: "mission-07", outcomeKind: "null", variable: "Lamp vs overhead" }));
  store.create(draft({ missionId: "mission-11", outcomeKind: "noticed", variable: "Sleep window noted first", outcome: "Noted the window." }));
  assert.equal(store.search("", { missionId: "mission-07" }).length, 1);
  assert.equal(store.search("", { outcomeKind: "null" }).length, 1);
  assert.equal(store.search("lamp", { missionId: "mission-11" }).length, 0);
});

test("inspect recovers from corrupt storage without inventing notes", () => {
  const adapter = NooLog.memoryAdapter("{not json");
  const store = NooLog.createStore(catalog, adapter);
  const inspected = store.inspect();
  assert.equal(inspected.ok, false);
  assert.match(inspected.errors.join(" "), /not valid JSON/);
  const discarded = store.discardUnreadable();
  assert.equal(discarded.ok, true);
  assert.deepEqual(store.list(), []);
});

test("wipe clears observations and 21+ ack is separate", () => {
  const memory = {};
  const storage = {
    getItem: (k) => memory[k] || null,
    setItem: (k, v) => {
      memory[k] = v;
    },
    removeItem: (k) => {
      delete memory[k];
    },
  };
  const store = NooLog.createStore(catalog, NooLog.localStorageAdapter(NooLog.STORAGE_KEY, storage));
  store.create(draft());
  assert.equal(store.list().length, 1);
  NooLog.writeAck(storage);
  assert.ok(NooLog.readAck(storage));
  store.clear();
  assert.deepEqual(store.list(), []);
  assert.ok(NooLog.readAck(storage), "ack is not observation data");
  NooLog.clearAck(storage);
  assert.equal(NooLog.readAck(storage), null);
});
