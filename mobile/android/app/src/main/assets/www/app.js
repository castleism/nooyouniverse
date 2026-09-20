(function () {
  "use strict";

  var catalog = globalThis.NOO_APPROVED_MISSIONS;
  var NooLog = globalThis.NooLog;
  if (!catalog || !NooLog) {
    document.body.innerHTML = "<p style='padding:24px'>Mission catalog or log library failed to load.</p>";
    return;
  }

  var storage = null;
  try {
    storage = window.localStorage;
  } catch (err) {
    storage = null;
  }

  var store = NooLog.createStore(catalog, NooLog.localStorageAdapter(NooLog.STORAGE_KEY, storage));
  var state = {
    tab: "missions",
    selectedMissionId: "",
    editingId: "",
    query: "",
    status: "",
    statusKind: "",
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setStatus(kind, text) {
    state.status = text;
    state.statusKind = kind;
  }

  function showTab(name) {
    state.tab = name;
    document.querySelectorAll(".panel").forEach(function (panel) {
      panel.classList.toggle("active", panel.getAttribute("data-panel") === name);
    });
    document.querySelectorAll(".tabs button").forEach(function (btn) {
      btn.setAttribute("aria-selected", btn.getAttribute("data-tab") === name ? "true" : "false");
    });
    render();
  }

  function missionById(id) {
    return catalog.missions.find(function (m) {
      return m.id === id;
    });
  }

  function datetimeLocal(iso) {
    if (!iso) {
      var n = new Date();
      n.setMinutes(n.getMinutes() - n.getTimezoneOffset());
      return n.toISOString().slice(0, 16);
    }
    var d = new Date(iso);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  function renderMissions() {
    var cards = catalog.missions
      .map(function (m) {
        return (
          '<button type="button" class="card" data-open-mission="' +
          escapeHtml(m.id) +
          '">' +
          '<div class="num">MISSION ' +
          String(m.number).padStart(2, "0") +
          "</div>" +
          "<h2>" +
          escapeHtml(m.title) +
          "</h2>" +
          '<p>' +
          escapeHtml(m.prompt || "Use this approved mission as context for one ordinary, non-medical observation.") +
          "</p>" +
          '<span class="basis">' +
          escapeHtml(m.sourceBasis) +
          "</span>" +
          "</button>"
        );
      })
      .join("");
    $("panel-missions").innerHTML =
      "<p class='help'>Approved missions from this repository's Mission Log. The catalog does not add unpublished or invented entries.</p>" +
      cards;
  }

  function renderLog() {
    var editing = state.editingId ? store.get(state.editingId) : null;
    var selected = state.selectedMissionId || (editing && editing.missionId) || "";
    var mission = missionById(selected);
    var options = catalog.missions
      .map(function (m) {
        return (
          '<option value="' +
          escapeHtml(m.id) +
          '"' +
          (m.id === selected ? " selected" : "") +
          ">Mission " +
          String(m.number).padStart(2, "0") +
          " — " +
          escapeHtml(m.title) +
          "</option>"
        );
      })
      .join("");
    var ctx = (editing && editing.context) || {};
    $("panel-log").innerHTML =
      "<p class='help'>One ordinary variable at a time. Context and uncertainty stay visible. A null result is a valid entry. This form never stores vitals, doses, diagnoses, or sensor readings.</p>" +
      (mission
        ? "<div class='card'><div class='num'>LINKED MISSION</div><h3>" +
          escapeHtml(mission.title) +
          "</h3><p>" +
          escapeHtml(mission.prompt) +
          "</p><span class='basis'>" +
          escapeHtml(mission.sourceBasis) +
          "</span></div>"
        : "") +
      '<form id="obsForm">' +
      "<label for='missionId'>Approved mission</label>" +
      "<select id='missionId' name='missionId' required><option value=''>Select a published mission</option>" +
      options +
      "</select>" +
      "<label for='observedAt'>When you observed it</label>" +
      "<input id='observedAt' name='observedAt' type='datetime-local' required value='" +
      escapeHtml(datetimeLocal(editing && editing.observedAt)) +
      "'>" +
      "<label for='variable'>What one thing you chose to observe</label>" +
      "<input id='variable' name='variable' maxlength='240' required value='" +
      escapeHtml(editing ? editing.variable : "") +
      "'>" +
      "<p class='help'>Ordinary routine or context — not a medicine, dose, diagnosis, or lab value.</p>" +
      "<label for='sleepWindow'>Sleep-window context (note, not a measurement)</label>" +
      "<input id='sleepWindow' name='sleepWindow' value='" +
      escapeHtml(ctx.sleepWindow || "") +
      "'>" +
      "<label for='workload'>Workload context</label>" +
      "<input id='workload' name='workload' value='" +
      escapeHtml(ctx.workload || "") +
      "'>" +
      "<label for='environment'>Environment</label>" +
      "<input id='environment' name='environment' value='" +
      escapeHtml(ctx.environment || "") +
      "'>" +
      "<label for='timingNotes'>Timing notes</label>" +
      "<input id='timingNotes' name='timingNotes' value='" +
      escapeHtml(ctx.timingNotes || "") +
      "'>" +
      "<label for='otherContext'>Anything unusual</label>" +
      "<input id='otherContext' name='otherContext' value='" +
      escapeHtml(ctx.other || "") +
      "'>" +
      "<label for='expectation'>What you expected beforehand</label>" +
      "<textarea id='expectation' name='expectation'>" +
      escapeHtml(editing ? editing.expectation : "") +
      "</textarea>" +
      "<label for='outcomeKind'>What happened</label>" +
      "<select id='outcomeKind' name='outcomeKind' required>" +
      option("noticed", "I noticed something", editing && editing.outcomeKind) +
      option("null", "Nothing noticeable happened (null result)", editing && editing.outcomeKind) +
      option("inconclusive", "Inconclusive / too mixed to say", editing && editing.outcomeKind) +
      "</select>" +
      "<label for='outcome'>Outcome notes</label>" +
      "<textarea id='outcome' name='outcome'>" +
      escapeHtml(editing ? editing.outcome : "") +
      "</textarea>" +
      "<label for='pattern'>Did the pattern repeat?</label>" +
      "<select id='pattern' name='pattern' required>" +
      option("first", "First look", editing && editing.pattern) +
      option("repeated", "Seemed to repeat", editing && editing.pattern) +
      option("did_not_repeat", "Did not repeat", editing && editing.pattern) +
      option("unknown", "Unknown", editing && editing.pattern) +
      "</select>" +
      "<label for='uncertainty'>Your stated uncertainty</label>" +
      "<select id='uncertainty' name='uncertainty' required>" +
      option("unknown", "Unknown / not rated", editing && editing.uncertainty) +
      option("high", "High — easy to over-read", editing && editing.uncertainty) +
      option("medium", "Medium", editing && editing.uncertainty) +
      option("low", "Low — still not a scientific verdict", editing && editing.uncertainty) +
      "</select>" +
      "<p class='help'>Uncertainty is your label. The app does not compute confidence, effects, or medical meaning.</p>" +
      "<label for='notes'>Optional notes</label>" +
      "<textarea id='notes' name='notes'>" +
      escapeHtml(editing ? editing.notes : "") +
      "</textarea>" +
      "<div class='actions'>" +
      "<button class='btn btn-amber' type='submit'>" +
      (editing ? "Save changes" : "Save observation") +
      "</button>" +
      (editing ? "<button class='btn btn-ghost' type='button' id='cancelEdit'>Cancel edit</button>" : "") +
      "</div>" +
      "<p class='status " +
      escapeHtml(state.statusKind) +
      "' role='status'>" +
      escapeHtml(state.status) +
      "</p>" +
      "</form>";
  }

  function option(value, label, current) {
    return (
      "<option value='" +
      value +
      "'" +
      (current === value ? " selected" : "") +
      ">" +
      label +
      "</option>"
    );
  }

  function renderHistory() {
    var rows = store.search(state.query);
    var cards = rows
      .map(function (row) {
        return (
          "<button type='button' class='card' data-edit-id='" +
          escapeHtml(row.id) +
          "'>" +
          "<div class='num'>MISSION " +
          String(row.missionNumber).padStart(2, "0") +
          "</div>" +
          "<h3>" +
          escapeHtml(row.variable) +
          "</h3>" +
          "<p>" +
          escapeHtml(row.outcome) +
          "</p>" +
          "<div class='row'>" +
          "<span class='badge " +
          escapeHtml(row.outcomeKind) +
          "'>" +
          escapeHtml(row.outcomeKind) +
          "</span>" +
          "<span class='badge " +
          escapeHtml(row.uncertainty) +
          "'>uncertainty: " +
          escapeHtml(row.uncertainty) +
          "</span>" +
          "<span class='badge'>" +
          escapeHtml(new Date(row.observedAt).toLocaleString()) +
          "</span>" +
          "</div>" +
          "</button>"
        );
      })
      .join("");
    $("panel-history").innerHTML =
      "<label for='historySearch'>Search history</label>" +
      "<input class='search' id='historySearch' value='" +
      escapeHtml(state.query) +
      "' placeholder='mission, variable, null, context…'>" +
      (rows.length
        ? cards +
          "<div class='actions'><button type='button' class='btn btn-danger' id='deleteCurrent' " +
          (state.editingId ? "" : "disabled") +
          ">Delete opened entry</button></div>"
        : state.query
          ? "<p class='empty'>No observations match that search. Nothing was invented to fill the gap.</p>"
          : "<p class='empty'>No observations yet. The app starts empty — fixtures live only in tests.</p>");
  }

  function renderTransfer() {
    var exported = JSON.stringify(store.exportDocument(), null, 2);
    $("panel-transfer").innerHTML =
      "<p class='help'>Validated JSON only. Import rejects unknown missions and any measurement/clinical fields. If a later APK is signed with a different debug key, export here and import there instead of overwriting device data.</p>" +
      "<label for='exportBox'>Current export</label>" +
      "<textarea class='mono' id='exportBox' readonly>" +
      escapeHtml(exported) +
      "</textarea>" +
      "<div class='actions'>" +
      "<button type='button' class='btn btn-amber' id='downloadExport'>Download JSON</button>" +
      "<button type='button' class='btn btn-ghost' id='copyExport'>Copy</button>" +
      "</div>" +
      "<label for='importBox'>Import JSON</label>" +
      "<textarea class='mono' id='importBox' placeholder='Paste a noo-private-observation-log export'></textarea>" +
      "<label for='importFile'>Or choose a file</label>" +
      "<input id='importFile' type='file' accept='application/json,.json'>" +
      "<label for='importMode'>Import mode</label>" +
      "<select id='importMode'><option value='merge'>Merge by id (keep others)</option><option value='replace'>Replace all local observations</option></select>" +
      "<div class='actions'><button type='button' class='btn btn-amber' id='runImport'>Import</button></div>" +
      "<p class='status " +
      escapeHtml(state.statusKind) +
      "' role='status'>" +
      escapeHtml(state.status) +
      "</p>";
  }

  function render() {
    if (state.tab === "missions") renderMissions();
    if (state.tab === "log") renderLog();
    if (state.tab === "history") renderHistory();
    if (state.tab === "transfer") renderTransfer();
  }

  function readForm() {
    return {
      missionId: $("missionId").value,
      observedAt: $("observedAt").value ? new Date($("observedAt").value).toISOString() : "",
      variable: $("variable").value,
      context: {
        sleepWindow: $("sleepWindow").value,
        workload: $("workload").value,
        environment: $("environment").value,
        timingNotes: $("timingNotes").value,
        other: $("otherContext").value,
      },
      expectation: $("expectation").value,
      outcome: $("outcome").value,
      outcomeKind: $("outcomeKind").value,
      pattern: $("pattern").value,
      uncertainty: $("uncertainty").value,
      notes: $("notes").value,
    };
  }

  function downloadText(filename, text) {
    if (globalThis.NooBridge && typeof globalThis.NooBridge.saveText === "function") {
      globalThis.NooBridge.saveText(filename, text);
      return;
    }
    var blob = new Blob([text], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  document.body.addEventListener("click", function (event) {
    var tab = event.target.closest("[data-tab]");
    if (tab) {
      state.status = "";
      showTab(tab.getAttribute("data-tab"));
      return;
    }
    var openMission = event.target.closest("[data-open-mission]");
    if (openMission) {
      state.selectedMissionId = openMission.getAttribute("data-open-mission");
      state.editingId = "";
      state.status = "";
      showTab("log");
      return;
    }
    var edit = event.target.closest("[data-edit-id]");
    if (edit) {
      state.editingId = edit.getAttribute("data-edit-id");
      var row = store.get(state.editingId);
      state.selectedMissionId = row ? row.missionId : "";
      state.status = "";
      showTab("log");
      return;
    }
    if (event.target.id === "cancelEdit") {
      state.editingId = "";
      state.status = "";
      render();
      return;
    }
    if (event.target.id === "deleteCurrent" && state.editingId) {
      if (window.confirm("Delete this observation from this device?")) {
        store.remove(state.editingId);
        state.editingId = "";
        setStatus("ok", "Deleted from this device.");
        render();
      }
      return;
    }
    if (event.target.id === "downloadExport") {
      downloadText("noo-observation-log.json", $("exportBox").value);
      setStatus("ok", "Export prepared. Keep it private — it is your notes.");
      renderTransfer();
      return;
    }
    if (event.target.id === "copyExport") {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText($("exportBox").value);
      }
      $("exportBox").select();
      setStatus("ok", "Export copied or selected.");
      renderTransfer();
      return;
    }
    if (event.target.id === "runImport") {
      var rawText = $("importBox").value;
      var mode = $("importMode").value;
      var parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (err) {
        setStatus("err", "Import is not valid JSON.");
        renderTransfer();
        return;
      }
      var result = store.importDocument(parsed, mode);
      if (!result.ok) {
        setStatus("err", result.errors.join(" "));
      } else {
        setStatus("ok", "Imported " + result.value.count + " observation(s).");
      }
      renderTransfer();
    }
  });

  document.body.addEventListener("submit", function (event) {
    if (event.target.id !== "obsForm") return;
    event.preventDefault();
    var payload = readForm();
    var result = state.editingId ? store.update(state.editingId, payload) : store.create(payload);
    if (!result.ok) {
      setStatus("err", result.errors.join(" "));
      renderLog();
      return;
    }
    state.editingId = result.value.id;
    setStatus("ok", "Saved on this device. Reload the app and it will still be here.");
    renderLog();
  });

  document.body.addEventListener("input", function (event) {
    if (event.target.id === "historySearch") {
      state.query = event.target.value;
      renderHistory();
      var box = $("historySearch");
      if (box) {
        box.focus();
        box.setSelectionRange(box.value.length, box.value.length);
      }
    }
  });

  document.body.addEventListener("change", function (event) {
    if (event.target.id === "importFile" && event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function () {
        $("importBox").value = String(reader.result || "");
      };
      reader.readAsText(event.target.files[0]);
    }
    if (event.target.id === "missionId") {
      state.selectedMissionId = event.target.value;
      renderLog();
    }
  });

  render();
})();
