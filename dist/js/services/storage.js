/** Persistence contract: keep hanzi-daily-v1 and all backup fields compatible. Restoration is explicit and snapshot-protected. */
import { runtime } from "../state/app-state.js";
import { $, KEY } from "../config/constants.js";
import { starter } from "../data/vocabulary.js";
import { renderCard } from "../components/review.js";
import { renderRows } from "../components/vocabulary-view.js";
import { contentModel } from "../data/lessons.js";
import { refreshContent, unsafeKeys } from "../components/content-selectors.js";

export function save() {
  if (runtime.storageBlocked) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify(runtime.state));
    return true;
  } catch {
    if ($("storageWarning")) $("storageWarning").classList.remove("hidden");
    return false;
  }
}

export function memberships(w) {
  return [
    ...new Set([
      w.section || "My words",
      ...(Array.isArray(w.sections)
        ? w.sections.filter((x) => typeof x === "string")
        : []),
    ]),
  ];
}

export function inSection(w, f) {
  return f === "*" || memberships(w).includes(f);
}

export function mergeStarter() {
  for (const w of starter) {
    if (runtime.state.deleted.includes(w.hanzi)) continue;
    const same=runtime.state.words.find(x=>x.id===w.id);
    if(same){same.sections=[...new Set([...memberships(same),...w.sections])];same.image=w.image;same.imageAlt=w.imageAlt;if(same.meaning===w.meaning)same.acceptedEnglish=w.acceptedEnglish||[];continue;}
    let found = runtime.state.words.find((x) => x.hanzi === w.hanzi);
    if (found) {
      found.sections = [...new Set([...memberships(found), w.section])];
      for (const k of ["category", "meaning", "pinyin"])
        if (!found[k]) found[k] = w[k];
      found.errors = found.errors || 0;
    } else runtime.state.words.push({ ...w, sections: [...w.sections] });
  }
  runtime.state.version = 3;
  save();
}

export function exportBackup() {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(runtime.state, null, 2)], {
      type: "application/json",
    }),
  );
  a.download = "hanzi-daily-backup.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function importData(d) {
  if (
    !d ||
    !Array.isArray(d.words) ||
    d.words.length > 5000 ||
    !d.words.every(
      (w) =>
        w &&
        ["hanzi", "pinyin", "meaning"].every(
          (k) => typeof w[k] === "string" && w[k].trim() && w[k].length <= 500,
        ) &&
        (!w.sections || Array.isArray(w.sections)),
    )
  )
    throw Error("Invalid backup");
  const numeric = (x) => (Number.isFinite(x) && x >= 0 ? x : 0);
  const next = JSON.parse(JSON.stringify(runtime.state));
  for (const w of d.words) {
    let existing = next.words.find((x) => x.hanzi === w.hanzi);
    const clean = {
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      meaning: w.meaning,
      section: typeof w.section === "string" ? w.section : "Imported",
      sections: memberships(w),
      example: typeof w.example === "string" ? w.example : "",
      category: typeof w.category === "string" ? w.category : "custom",
      due: numeric(w.due),
      interval: numeric(w.interval),
      errors: numeric(w.errors),
    };
    if (existing) {
      existing.sections = [
        ...new Set([...memberships(existing), ...memberships(clean)]),
      ];
      if (clean.due > numeric(existing.due)) {
        existing.due = clean.due;
        existing.interval = clean.interval;
      }
      existing.errors = Math.max(numeric(existing.errors), clean.errors);
    } else next.words.push({ ...clean, id: crypto.randomUUID() });
    next.deleted = next.deleted.filter((h) => h !== w.hanzi);
  }
  for (const field of ["days", "games"])
    if (d[field] && typeof d[field] === "object" && !Array.isArray(d[field]))
      for (const [k, v] of Object.entries(d[field])) {
        if (["__proto__", "constructor", "prototype"].includes(k)) continue;
        next[field][k] = Math.max(numeric(next[field][k]), numeric(v));
      }
  runtime.state = next;
  save();
}

export function validateBackup(d) {
  if (!d || !Array.isArray(d.words) || d.words.length > 10000)
    throw Error("Backup must contain a words array (maximum 10,000).");
  const ids = new Set();
  for (const [i, w] of d.words.entries()) {
    for (const k of ["id", "hanzi", "pinyin", "meaning"])
      if (typeof w?.[k] !== "string" || !w[k].trim() || w[k].length > 1000)
        throw Error("Word " + (i + 1) + ": invalid " + k);
    if (ids.has(w.id)) throw Error("Word " + (i + 1) + ": duplicate ID");
    ids.add(w.id);
    if (w.sections && !Array.isArray(w.sections))
      throw Error("Word " + (i + 1) + ": invalid sections");
    for (const k of ["due", "interval", "errors"])
      if (w[k] !== undefined && (!Number.isFinite(w[k]) || w[k] < 0))
        throw Error("Word " + (i + 1) + ": invalid " + k);
  }
  if (
    d.deleted !== undefined &&
    (!Array.isArray(d.deleted) || d.deleted.some((x) => typeof x !== "string"))
  )
    throw Error("Invalid deletion list");
  for (const k of ["levels", "lessons", "results"])
    if (d[k] !== undefined && !Array.isArray(d[k])) throw Error("Invalid " + k);
  for (const k of ["days", "games", "learned"])
    if (
      d[k] !== undefined &&
      (!d[k] ||
        typeof d[k] !== "object" ||
        Array.isArray(d[k]) ||
        Object.keys(d[k]).some((x) => unsafeKeys.has(x)))
    )
      throw Error("Invalid " + k);
  for (const [i, w] of d.words.entries()) {
    if (w.section !== undefined && typeof w.section !== "string")
      throw Error("Word " + (i + 1) + ": invalid section");
    if (w.sections && w.sections.some((x) => typeof x !== "string"))
      throw Error("Invalid section membership");
  }
  if (
    d.levels &&
    d.levels.some(
      (x) => !x || typeof x.id !== "string" || typeof x.title !== "string",
    )
  )
    throw Error("Invalid levels");
  if (
    d.lessons &&
    d.lessons.some(
      (x) =>
        !x ||
        typeof x.id !== "string" ||
        typeof x.title !== "string" ||
        typeof x.section !== "string" ||
        typeof x.level !== "string",
    )
  )
    throw Error("Invalid lessons");
  if (
    d.results &&
    d.results.some(
      (x) => !x || typeof x.game !== "string" || typeof x.date !== "string",
    )
  )
    throw Error("Invalid results");
  for (const k of ["days", "games"])
    if (d[k] && Object.values(d[k]).some((x) => !Number.isFinite(x) || x < 0))
      throw Error("Invalid " + k + " counts");
  return JSON.parse(JSON.stringify(d));
}

export function restoreBackup(data) {
  const d = validateBackup(data);
  if (runtime.storageBlocked)
    throw Error("Saving is paused. Recover your stored data first.");
  const before = localStorage.getItem(KEY);
  if (before) localStorage.setItem(KEY + "-before-restore", before);
  const candidate = {
    words: [],
    days: {},
    games: {},
    deleted: [],
    results: [],
    ...d,
    version: 4,
  };
  localStorage.setItem(KEY, JSON.stringify(candidate));
  runtime.state = candidate;
  contentModel();
  refreshContent();
  renderRows();
  renderCard();
}
