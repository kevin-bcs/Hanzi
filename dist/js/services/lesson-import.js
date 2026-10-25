/** Validate first, transform second, persist atomically. IDs must never silently overwrite another meaning. */
import { runtime } from "../state/app-state.js";
import { KEY } from "../config/constants.js";
import { memberships } from "./storage.js";
import { markedTone, syllables } from "../games/tone-drill.js";
import { contentModel } from "../data/lessons.js";
import { refreshContent, unsafeKeys } from "../components/content-selectors.js";

export function validateLessonFile(d) {
  const errors = [],
    duplicates = [],
    items = [],
    levels = [],
    lessons = [];
  const model = contentModel();
  if (
    !d ||
    !Array.isArray(d.levels) ||
    !Array.isArray(d.lessons) ||
    !Array.isArray(d.items) ||
    d.items.length > 5000
  )
    return {
      errors: [
        "Expected levels, lessons and items arrays; maximum 5,000 items.",
      ],
      duplicates,
      items,
      levels,
      lessons,
    };
  const lv = new Map(model.levels.map((x) => [x.id, x])),
    ls = new Map(model.lessons.map((x) => [x.id, x]));
  for (const [i, l] of d.levels.entries()) {
    if (
      typeof l?.id !== "string" ||
      !l.id.trim() ||
      unsafeKeys.has(l.id) ||
      typeof l.title !== "string" ||
      !l.title.trim()
    ) {
      errors.push("Level " + (i + 1) + ": id and title required");
      continue;
    }
    if (lv.has(l.id)) {
      if (lv.get(l.id).title !== l.title)
        errors.push("Level " + l.id + ": conflicting title");
    } else {
      const clean = { id: l.id, title: l.title };
      lv.set(l.id, clean);
      levels.push(clean);
    }
  }
  for (const [i, l] of d.lessons.entries()) {
    if (
      typeof l?.id !== "string" ||
      !l.id.trim() ||
      typeof l.title !== "string" ||
      !lv.has(l.level)
    ) {
      errors.push("Lesson " + (i + 1) + ": id, title and valid level required");
      continue;
    }
    if (ls.has(l.id)) {
      if (ls.get(l.id).level !== l.level || ls.get(l.id).title !== l.title)
        errors.push("Lesson " + l.id + ": conflicting definition");
    } else {
      const clean = {
        id: l.id,
        title: l.title,
        level: l.level,
        section: l.title + " [" + l.id + "]",
      };
      ls.set(l.id, clean);
      lessons.push(clean);
    }
  }
  const ids = new Set();
  for (const [i, input] of d.items.entries()) {
    const w = {
      ...input,
      level: input?.level ?? input?.nivel,
      lesson: input?.lesson ?? input?.leccion,
      meaning: input?.meaning ?? input?.traduccion,
      tones: input?.tones ?? input?.tonos,
      type: input?.type ?? input?.tipo,
      category: input?.category ?? input?.categoria,
      difficulty: input?.difficulty ?? input?.dificultad,
    };
    const row = "Record " + (i + 1) + ": ";
    let bad = false;
    const fail = (m) => {
      errors.push(row + m);
      bad = true;
    };
    for (const k of ["id", "hanzi", "pinyin", "meaning", "level", "lesson"])
      if (typeof w[k] !== "string" || !w[k].trim() || w[k].length > 1000)
        fail(k + " must be a nonempty string");
    if (!ls.has(w.lesson) || ls.get(w.lesson)?.level !== w.level)
      fail("lesson/level reference is invalid");
    if (w.type && !["word", "phrase", "palabra", "frase"].includes(w.type))
      fail("type must be word or phrase");
    const parts = typeof w.pinyin === "string" ? syllables(w) : [];
    if (
      w.tones !== undefined &&
      (!Array.isArray(w.tones) ||
        w.tones.length !== parts.length ||
        w.tones.some(
          (t, j) =>
            !Number.isInteger(t) ||
            t < 1 ||
            t > 5 ||
            t !== markedTone(parts[j]),
        ))
    )
      fail("tones must match marked pinyin (1–5), one per syllable");
    if (
      w.audio !== undefined &&
      (typeof w.audio !== "string" || !/^(https:\/\/|\/(?!\/))/.test(w.audio))
    )
      fail("audio must be an HTTPS URL or a root-relative path");
    if (
      w.difficulty !== undefined &&
      (!Number.isInteger(w.difficulty) || w.difficulty < 1 || w.difficulty > 5)
    )
      fail("difficulty must be 1–5");
    if (ids.has(w.id)) fail("duplicate ID within file");
    ids.add(w.id);
    if (bad) continue;
    const old = runtime.state.words.find((x) => x.id === w.id);
    if (old) {
      if (
        old.hanzi !== w.hanzi ||
        old.pinyin !== w.pinyin ||
        old.meaning !== w.meaning
      )
        fail(
          "existing ID has different content; use a new ID or edit explicitly",
        );
      else duplicates.push(w.id);
      continue;
    }
    const same = runtime.state.words.find(
      (x) =>
        x.hanzi === w.hanzi && x.pinyin === w.pinyin && x.meaning === w.meaning,
    );
    items.push({
      id: w.id,
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      meaning: w.meaning,
      section: ls.get(w.lesson)?.section,
      category: w.category || "imported",
      type: ["phrase", "frase"].includes(w.type) ? "phrase" : "word",
      difficulty: w.difficulty || 1,
      audio: w.audio || "",
      example: typeof w.example === "string" ? w.example : "",
      due: 0,
      interval: 0,
      errors: 0,
      existingId: same?.id,
    });
    if (same) duplicates.push(w.id + " shares vocabulary with " + same.id);
  }
  return { errors, duplicates, items, levels, lessons };
}

export function applyLessonFile(report) {
  if (report.errors.length)
    throw Error("Fix all validation errors before import");
  const next = JSON.parse(JSON.stringify(runtime.state));
  next.levels.push(...report.levels);
  next.lessons.push(...report.lessons);
  for (const item of report.items) {
    const { existingId, ...w } = item;
    if (existingId) {
      const old = next.words.find((x) => x.id === existingId);
      old.sections = [...new Set([...memberships(old), w.section])];
    } else next.words.push(w);
  }
  if (runtime.storageBlocked) throw Error("Saving is paused");
  localStorage.setItem(KEY + "-before-content", JSON.stringify(runtime.state));
  localStorage.setItem(KEY, JSON.stringify(next));
  runtime.state = next;
  refreshContent();
  return report.items.length;
}
