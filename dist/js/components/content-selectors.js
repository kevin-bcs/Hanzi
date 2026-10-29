/** Hanzi Daily module: components/content-selectors.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { inSection } from "../services/storage.js";
import { contentModel, sections } from "../data/lessons.js";
import { updateStats } from "./progress-view.js";
import { updateCardOptions } from "../games/memory.js";
import { renderLearningLevels } from "./lesson-view.js";

export function fillSelect(el, all = true, chosen = "All sections") {
  el.replaceChildren();
  if (all) {
    let o = document.createElement("option");
    o.value = "*";
    o.textContent = "All sections";
    el.append(o);
  }
  for (const s of sections()) {
    let o = document.createElement("option");
    o.value = s;
    o.textContent = s;
    el.append(o);
  }
  if ([...el.options].some((o) => o.textContent === chosen))
    el.value = [...el.options].find((o) => o.textContent === chosen).value;
}

export function fillGameSections() {
  const ordered = sections().sort(
    (a, b) =>
      Number(!a.startsWith("Lesson ")) - Number(!b.startsWith("Lesson ")) ||
      a.localeCompare(b),
  );
  for (const type of ["memory", "quiz", "tone"]) {
    const select = $(type + "Section"),
      old = select.value;
    select.replaceChildren();
    if (["memory", "quiz", "tone", "initials"].includes(type)) {
      const o = document.createElement("option");
      o.value = "*";
      o.textContent = "All vocabulary";
      select.append(o);
    }
    for (const section of ordered) {
      const o = document.createElement("option");
      o.value = section;
      o.textContent = section;
      select.append(o);
    }
    select.value = ordered.includes(old)
      ? old
      : ["tone", "initials"].includes(type)
        ? "*"
        : ordered[0] || "";
    if (!["tone", "initials"].includes(type)) renderLessonButtons(type);
  }
}

export function renderLessonButtons(type) {
  const picker = $(type + "Lessons");
  picker.replaceChildren();
  for (const section of sections().filter((s) => s.startsWith("Lesson "))) {
    const b = document.createElement("button");
    b.className =
      "lesson-choice" +
      ($(type + "Section").value === section ? " selected" : "");
    b.setAttribute(
      "aria-pressed",
      String($(type + "Section").value === section),
    );
    const title = document.createElement("strong");
    title.textContent = section.split(" · ")[0];
    const count = document.createElement("small");
    count.textContent =
      runtime.state.words.filter((w) => inSection(w, section)).length +
      " words";
    b.append(title, count);
    b.onclick = () => {
      $(type + "Section").value = section;
      renderLessonButtons(type);
      if (type === "memory") updateCardOptions();
    };
    picker.append(b);
  }
}

export function currentFilter(which) {
  return $(which).value;
}

export function group(which) {
  let f = currentFilter(which);
  return runtime.state.words.filter((w) => inSection(w, f));
}

export function refreshContent() {
  contentModel();
  fillSelect($("studyFilter"));
  fillSelect($("wordFilter"));
  fillGameSections();
  renderLearningLevels();
  updateStats();
}

export const unsafeKeys = new Set(["__proto__", "constructor", "prototype"]);
