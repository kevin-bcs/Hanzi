/** Hanzi Daily module: components/vocabulary-view.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { norm } from "../utils.js";
import { inSection, memberships, save } from "../services/storage.js";
import { fillGameSections, fillSelect } from "./content-selectors.js";
import { updateStats } from "./progress-view.js";

export function renderRows() {
  let q = norm($("search").value),
    f = $("wordFilter").value;
  $("wordRows").replaceChildren();
  let filtered = runtime.state.words.filter(
    (w) =>
      inSection(w, f) &&
      norm([w.hanzi, w.pinyin, w.meaning, w.category].join(" ")).includes(q),
  );
  for (const w of filtered) {
    let tr = document.createElement("tr");
    for (const k of ["hanzi", "pinyin", "meaning", "section"]) {
      let td = document.createElement("td");
      td.textContent =
        k === "section" ? memberships(w).join(" / ") : w[k] || "";
      tr.append(td);
    }
    let status = document.createElement("td");
    status.textContent =
      w.errors || 0 ? "Review soon · " + w.errors + " misses" : "In practice";
    tr.append(status);
    let action = document.createElement("td"),
      edit = document.createElement("button"),
      del = document.createElement("button");
    edit.className = "btn";
    edit.textContent = "Edit";
    edit.onclick = () => editWord(w);
    del.className = "btn";
    del.textContent = "Delete";
    del.onclick = () => {
      if (confirm("Delete " + w.hanzi + "?")) {
        runtime.state.deleted = [
          ...new Set([...runtime.state.deleted, w.hanzi]),
        ];
        runtime.state.words = runtime.state.words.filter((x) => x.id !== w.id);
        save();
        fillSelect($("studyFilter"));
        fillGameSections();
        fillSelect($("wordFilter"));
        renderRows();
        updateStats();
      }
    };
    action.append(edit, del);
    tr.append(action);
    $("wordRows").append(tr);
  }
  if (!filtered.length) {
    let tr = document.createElement("tr"),
      td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = "No words found.";
    tr.append(td);
    $("wordRows").append(tr);
  }
}

export function editWord(w) {
  let h = prompt("Chinese characters", w.hanzi);
  if (h === null) return;
  let p = prompt("Pinyin", w.pinyin);
  if (p === null) return;
  let m = prompt("Meaning", w.meaning);
  if (m === null) return;
  let s = prompt("Lesson or section", w.section || "My words");
  if (s === null) return;
  if (!h.trim() || !p.trim() || !m.trim() || !s.trim()) {
    alert("Characters, pinyin, meaning and section cannot be empty.");
    return;
  }
  if (runtime.state.words.some((x) => x.id !== w.id && x.hanzi === h.trim())) {
    alert("This word already exists. Edit its existing entry.");
    return;
  }
  if (w.hanzi !== h.trim()) runtime.state.deleted.push(w.hanzi);
  w.hanzi = h.trim();
  w.pinyin = p.trim();
  w.meaning = m.trim();
  w.section = s.trim();
  w.sections = [...new Set([...memberships(w), w.section])];
  save();
  fillSelect($("studyFilter"));
  fillGameSections();
  fillSelect($("wordFilter"));
  renderRows();
  updateStats();
}
