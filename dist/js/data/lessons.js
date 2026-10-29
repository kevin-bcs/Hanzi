import {contentLessons} from "./vocabulary.js";
/** Hanzi Daily module: data/lessons.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { memberships } from "../services/storage.js";

export function sections() {
  return [...new Set(runtime.state.words.flatMap(memberships))].sort();
}

export function contentModel() {
  if (!Array.isArray(runtime.state.levels))
    runtime.state.levels = [
      { id: "foundation", title: "Foundations" },
      { id: "extra", title: "Additional practice" },
    ];
  if (!Array.isArray(runtime.state.lessons)) runtime.state.lessons = [];
  for (const section of sections())
    if (!runtime.state.lessons.some((l) => l.section === section))
      runtime.state.lessons.push({
        id: "section:" + section,
        level: section.startsWith("Lesson ") ? "foundation" : "extra",
        title: section,
        section,
      });
  const custom = runtime.state.lessons.filter(l=>!l.id.startsWith("section:"));
  return { levels: runtime.state.levels, lessons: [...contentLessons, ...custom.filter(l=>!contentLessons.some(c=>c.id===l.id))] };
}

export function selectedLesson() {
  return contentModel().lessons.find((l) => l.id === $("learnLesson").value);
}
