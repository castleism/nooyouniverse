/**
 * Noo YouNiverse — private observation log.
 *
 * Observations are first-person notes linked to approved missions.
 * They are not medical measurements, sensor readings, diagnoses, or claims.
 */
(function (root, factory) {
  var api = factory();
  root.NooLog = api;
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var FORMAT = "noo-private-observation-log";
  var VERSION = 1;
  var STORAGE_KEY = "noo.observationLog.v1";
  var ACK_KEY = "noo.observationLog.ack.v1";
  var KIND = "private-observation-log";
  var MAX_CORRECTIONS = 40;

  var OUTCOME_KINDS = ["noticed", "null", "inconclusive"];
  var PATTERNS = ["first", "repeated", "did_not_repeat", "unknown"];
  var UNCERTAINTIES = ["low", "medium", "high", "unknown"];

  /**
   * Fields that would turn this store into a measurement/clinical record.
   * Import rejects payloads that include any of these at the document or entry level.
   */
  var FORBIDDEN_KEYS = [
    "measurements",
    "measurement",
    "vitals",
    "vitalSigns",
    "heartRate",
    "bloodPressure",
    "spo2",
    "glucose",
    "diagnosis",
    "diagnoses",
    "medication",
    "medications",
    "dose",
    "dosage",
    "prescription",
    "sensor",
    "sensors",
    "sensorReadings",
    "labResult",
    "labResults",
    "clinicalClaim",
    "treatmentPlan",
  ];

  function nowIso() {
    return new Date().toISOString();
  }

  function newId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "obs-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function trim(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function missionIndex(catalog) {
    var map = Object.create(null);
    var list = catalog && catalog.missions ? catalog.missions : [];
    for (var i = 0; i < list.length; i++) {
      map[list[i].id] = list[i];
    }
    return map;
  }

  function collectForbidden(obj, found, prefix) {
    if (!isPlainObject(obj) && !Array.isArray(obj)) return;
    if (Array.isArray(obj)) {
      for (var a = 0; a < obj.length; a++) collectForbidden(obj[a], found, prefix + "[" + a + "]");
      return;
    }
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var path = prefix ? prefix + "." + key : key;
      if (FORBIDDEN_KEYS.indexOf(key) !== -1) found.push(path);
      collectForbidden(obj[key], found, path);
    }
  }

  function normalizeContext(input) {
    var src = isPlainObject(input) ? input : {};
    return {
      sleepWindow: trim(src.sleepWindow),
      workload: trim(src.workload),
      environment: trim(src.environment),
      timingNotes: trim(src.timingNotes),
      stayedComparable: trim(src.stayedComparable),
      other: trim(src.other),
    };
  }

  function snapshotNote(row) {
    return {
      recordedAt: trim(row.updatedAt) || trim(row.createdAt) || nowIso(),
      missionId: trim(row.missionId),
      observedAt: trim(row.observedAt),
      variable: trim(row.variable),
      context: normalizeContext(row.context),
      expectation: trim(row.expectation),
      outcome: trim(row.outcome),
      outcomeKind: trim(row.outcomeKind),
      pattern: trim(row.pattern),
      uncertainty: trim(row.uncertainty),
      notes: trim(row.notes),
    };
  }

  function normalizeCorrections(raw) {
    if (!Array.isArray(raw)) return [];
    var out = [];
    for (var i = 0; i < raw.length && out.length < MAX_CORRECTIONS; i++) {
      if (!isPlainObject(raw[i])) continue;
      out.push(snapshotNote(raw[i]));
    }
    return out;
  }

  function comparablePayload(row) {
    return JSON.stringify({
      missionId: row.missionId,
      observedAt: row.observedAt,
      variable: row.variable,
      context: normalizeContext(row.context),
      expectation: trim(row.expectation),
      outcome: trim(row.outcome),
      outcomeKind: row.outcomeKind,
      pattern: row.pattern,
      uncertainty: row.uncertainty,
      notes: trim(row.notes),
    });
  }

  function validateObservation(raw, catalog, options) {
    var opts = options || {};
    var errors = [];
    if (!isPlainObject(raw)) {
      return { ok: false, errors: ["observation must be an object"] };
    }
    var forbidden = [];
    collectForbidden(raw, forbidden, "");
    if (forbidden.length) {
      errors.push(
        "observation contains measurement/clinical fields that this log will not store: " +
          forbidden.join(", ")
      );
    }
    var missionId = trim(raw.missionId);
    var missions = missionIndex(catalog);
    if (!missionId) errors.push("missionId is required");
    else if (!missions[missionId]) {
      errors.push(
        "missionId '" +
          missionId +
          "' is not an approved mission in this repository catalog"
      );
    }
    var variable = trim(raw.variable);
    if (!variable) errors.push("variable (what you chose to observe) is required");
    if (variable.length > 240) errors.push("variable must be 240 characters or fewer");

    var outcomeKind = trim(raw.outcomeKind);
    if (OUTCOME_KINDS.indexOf(outcomeKind) === -1) {
      errors.push("outcomeKind must be noticed, null, or inconclusive");
    }
    var pattern = trim(raw.pattern);
    if (PATTERNS.indexOf(pattern) === -1) {
      errors.push("pattern must be first, repeated, did_not_repeat, or unknown");
    }
    var uncertainty = trim(raw.uncertainty);
    if (UNCERTAINTIES.indexOf(uncertainty) === -1) {
      errors.push("uncertainty must be low, medium, high, or unknown");
    }

    var outcome = trim(raw.outcome);
    if (outcomeKind === "null" && !outcome) {
      outcome = "Nothing noticeable happened.";
    }
    if (!outcome) errors.push("outcome is required (use a null result if nothing noticeable happened)");
    if (outcome.length > 4000) errors.push("outcome must be 4000 characters or fewer");

    var observedAt = trim(raw.observedAt);
    if (!observedAt) errors.push("observedAt is required");
    else if (Number.isNaN(Date.parse(observedAt))) errors.push("observedAt must be an ISO date-time");

    var expectation = trim(raw.expectation);
    if (expectation.length > 2000) errors.push("expectation must be 2000 characters or fewer");

    if (opts.requireId && !trim(raw.id)) errors.push("id is required");

    if (errors.length) return { ok: false, errors: errors };

    var mission = missions[missionId];
    return {
      ok: true,
      errors: [],
      value: {
        id: trim(raw.id) || newId(),
        missionId: missionId,
        missionNumber: mission.number,
        missionTitle: mission.title,
        createdAt: trim(raw.createdAt) || nowIso(),
        updatedAt: trim(raw.updatedAt) || nowIso(),
        observedAt: new Date(observedAt).toISOString(),
        variable: variable,
        context: normalizeContext(raw.context),
        expectation: expectation,
        outcome: outcome,
        outcomeKind: outcomeKind,
        pattern: pattern,
        uncertainty: uncertainty,
        notes: trim(raw.notes),
        corrections: normalizeCorrections(raw.corrections),
        kind: "observation",
        notAMeasurement: true,
      },
    };
  }

  function documentEnvelope(observations, extra) {
    extra = extra || {};
    return {
      format: FORMAT,
      version: VERSION,
      kind: KIND,
      not: [
        "medical-record",
        "measurement-export",
        "clinical-claim",
        "sensor-log",
        "released-product",
      ],
      disclaimer:
        "Private first-person observations linked to approved Noo YouNiverse missions. Educational only. Not medical advice, diagnosis, treatment, or measurement data.",
      exportedAt: extra.exportedAt || nowIso(),
      count: observations.length,
      observations: observations,
    };
  }

  function validateDocument(raw, catalog) {
    var errors = [];
    if (!isPlainObject(raw)) {
      return { ok: false, errors: ["export must be a JSON object"] };
    }
    var forbidden = [];
    collectForbidden(raw, forbidden, "");
    if (forbidden.length) {
      errors.push(
        "document contains measurement/clinical fields that this log will not import: " +
          forbidden.join(", ")
      );
    }
    if (raw.format !== FORMAT) {
      errors.push("format must be '" + FORMAT + "'");
    }
    if (raw.version !== VERSION) {
      errors.push("unsupported version (this milestone accepts version " + VERSION + " only)");
    }
    if (raw.kind && raw.kind !== KIND) {
      errors.push("kind must be '" + KIND + "'");
    }
    if (!Array.isArray(raw.observations)) {
      errors.push("observations must be an array");
      return { ok: false, errors: errors };
    }

    var values = [];
    for (var i = 0; i < raw.observations.length; i++) {
      var checked = validateObservation(raw.observations[i], catalog, { requireId: true });
      if (!checked.ok) {
        errors.push("observations[" + i + "]: " + checked.errors.join("; "));
      } else {
        values.push(checked.value);
      }
    }
    if (errors.length) return { ok: false, errors: errors };
    return { ok: true, errors: [], value: documentEnvelope(values, { exportedAt: raw.exportedAt }) };
  }

  function memoryAdapter(seed) {
    var text = seed || "";
    return {
      read: function () {
        return text;
      },
      write: function (next) {
        text = next;
      },
    };
  }

  function localStorageAdapter(key, storage) {
    var k = key || STORAGE_KEY;
    return {
      read: function () {
        if (!storage) return "";
        return storage.getItem(k) || "";
      },
      write: function (next) {
        if (!storage) return;
        storage.setItem(k, next);
      },
    };
  }

  function readAck(storage) {
    if (!storage) return null;
    var raw = storage.getItem(ACK_KEY);
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      if (
        isPlainObject(parsed) &&
        parsed.version === 1 &&
        parsed.adultsOnly === true &&
        parsed.notMedicalAdvice === true &&
        parsed.observationsAreNotMeasurements === true
      ) {
        return parsed;
      }
    } catch (err) {
      return null;
    }
    return null;
  }

  function writeAck(storage, extra) {
    extra = extra || {};
    var payload = {
      version: 1,
      adultsOnly: true,
      notMedicalAdvice: true,
      observationsAreNotMeasurements: true,
      acceptedAt: extra.acceptedAt || nowIso(),
    };
    if (storage) storage.setItem(ACK_KEY, JSON.stringify(payload));
    return payload;
  }

  function clearAck(storage) {
    if (storage) storage.removeItem(ACK_KEY);
  }

  function inspectStored(catalog, persist) {
    var raw = persist.read();
    if (!raw) {
      return { ok: true, empty: true, raw: "", observations: [], errors: [] };
    }
    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return {
        ok: false,
        empty: false,
        raw: raw,
        observations: [],
        errors: ["stored observation log is not valid JSON"],
      };
    }
    var checked = validateDocument(parsed, catalog);
    if (!checked.ok) {
      return { ok: false, empty: false, raw: raw, observations: [], errors: checked.errors };
    }
    return {
      ok: true,
      empty: checked.value.observations.length === 0,
      raw: raw,
      observations: checked.value.observations,
      errors: [],
    };
  }

  function createStore(catalog, adapter) {
    if (!catalog || !Array.isArray(catalog.missions)) {
      throw new Error("approved mission catalog is required");
    }
    var persist = adapter || memoryAdapter("");

    function inspect() {
      return inspectStored(catalog, persist);
    }

    function loadAll() {
      var inspected = inspect();
      if (!inspected.ok) {
        throw new Error("stored observation log failed validation: " + inspected.errors.join("; "));
      }
      return inspected.observations;
    }

    function saveAll(list) {
      persist.write(JSON.stringify(documentEnvelope(list)));
    }

    function list() {
      return loadAll().slice().sort(function (a, b) {
        return a.observedAt < b.observedAt ? 1 : a.observedAt > b.observedAt ? -1 : 0;
      });
    }

    function get(id) {
      var rows = loadAll();
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id === id) return rows[i];
      }
      return null;
    }

    function create(input) {
      var checked = validateObservation(input, catalog);
      if (!checked.ok) return checked;
      var inspected = inspect();
      if (!inspected.ok) {
        return { ok: false, errors: inspected.errors };
      }
      var rows = inspected.observations;
      var stamp = nowIso();
      var row = Object.assign({}, checked.value, {
        createdAt: stamp,
        updatedAt: stamp,
        corrections: [],
      });
      rows.push(row);
      saveAll(rows);
      return { ok: true, errors: [], value: row };
    }

    function update(id, input) {
      var inspected = inspect();
      if (!inspected.ok) return { ok: false, errors: inspected.errors };
      var rows = inspected.observations;
      var idx = -1;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id === id) idx = i;
      }
      if (idx === -1) return { ok: false, errors: ["observation not found"] };
      var previous = rows[idx];
      var merged = Object.assign({}, previous, input, {
        id: id,
        createdAt: previous.createdAt,
        corrections: previous.corrections,
      });
      var checked = validateObservation(merged, catalog, { requireId: true });
      if (!checked.ok) return checked;
      var corrections = normalizeCorrections(previous.corrections);
      if (comparablePayload(previous) !== comparablePayload(checked.value)) {
        corrections = [snapshotNote(previous)].concat(corrections).slice(0, MAX_CORRECTIONS);
      }
      var row = Object.assign({}, checked.value, {
        id: id,
        createdAt: previous.createdAt,
        updatedAt: nowIso(),
        corrections: corrections,
      });
      rows[idx] = row;
      saveAll(rows);
      return { ok: true, errors: [], value: row };
    }

    function remove(id) {
      var inspected = inspect();
      if (!inspected.ok) return { ok: false, errors: inspected.errors };
      var rows = inspected.observations;
      var next = rows.filter(function (row) {
        return row.id !== id;
      });
      if (next.length === rows.length) return { ok: false, errors: ["observation not found"] };
      saveAll(next);
      return { ok: true, errors: [], value: { id: id } };
    }

    function matchesFilters(row, filters) {
      var f = filters || {};
      if (f.missionId && row.missionId !== f.missionId) return false;
      if (f.outcomeKind && row.outcomeKind !== f.outcomeKind) return false;
      return true;
    }

    function search(query, filters) {
      var q = trim(query).toLowerCase();
      var rows = list().filter(function (row) {
        return matchesFilters(row, filters);
      });
      if (!q) return rows;
      return rows.filter(function (row) {
        var correctionText = (row.corrections || [])
          .map(function (c) {
            return [c.variable, c.outcome, c.expectation, c.notes].join(" ");
          })
          .join("\n");
        var hay = [
          row.variable,
          row.outcome,
          row.expectation,
          row.notes,
          row.missionTitle,
          row.missionId,
          String(row.missionNumber),
          row.outcomeKind,
          row.uncertainty,
          row.context.sleepWindow,
          row.context.workload,
          row.context.environment,
          row.context.timingNotes,
          row.context.stayedComparable,
          row.context.other,
          correctionText,
        ]
          .join("\n")
          .toLowerCase();
        return hay.indexOf(q) !== -1;
      });
    }

    function exportDocument() {
      var inspected = inspect();
      if (!inspected.ok) {
        return { ok: false, errors: inspected.errors, raw: inspected.raw };
      }
      return { ok: true, errors: [], value: documentEnvelope(list()), raw: inspected.raw };
    }

    function importDocument(raw, mode) {
      var checked = validateDocument(raw, catalog);
      if (!checked.ok) return checked;
      var incoming = checked.value.observations;
      var inspected = inspect();
      if (!inspected.ok && mode !== "replace") {
        return {
          ok: false,
          errors: ["local store is unreadable; export the raw copy, then import with replace"].concat(
            inspected.errors
          ),
        };
      }
      var next;
      if (mode === "replace") {
        next = incoming;
      } else {
        var map = Object.create(null);
        var existing = inspected.ok ? inspected.observations : [];
        for (var i = 0; i < existing.length; i++) map[existing[i].id] = existing[i];
        for (var j = 0; j < incoming.length; j++) map[incoming[j].id] = incoming[j];
        next = Object.keys(map).map(function (k) {
          return map[k];
        });
      }
      saveAll(next);
      return { ok: true, errors: [], value: documentEnvelope(next) };
    }

    function clear() {
      saveAll([]);
    }

    function discardUnreadable() {
      saveAll([]);
      return { ok: true, errors: [], value: documentEnvelope([]) };
    }

    return {
      list: list,
      get: get,
      create: create,
      update: update,
      remove: remove,
      search: search,
      exportDocument: exportDocument,
      importDocument: importDocument,
      clear: clear,
      inspect: inspect,
      discardUnreadable: discardUnreadable,
    };
  }

  return {
    FORMAT: FORMAT,
    VERSION: VERSION,
    STORAGE_KEY: STORAGE_KEY,
    ACK_KEY: ACK_KEY,
    KIND: KIND,
    OUTCOME_KINDS: OUTCOME_KINDS,
    PATTERNS: PATTERNS,
    UNCERTAINTIES: UNCERTAINTIES,
    FORBIDDEN_KEYS: FORBIDDEN_KEYS,
    validateObservation: validateObservation,
    validateDocument: validateDocument,
    documentEnvelope: documentEnvelope,
    memoryAdapter: memoryAdapter,
    localStorageAdapter: localStorageAdapter,
    createStore: createStore,
    missionIndex: missionIndex,
    readAck: readAck,
    writeAck: writeAck,
    clearAck: clearAck,
    snapshotNote: snapshotNote,
  };
});
