/** Hanzi Daily module: components/lesson-view.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { inSection, save } from "../services/storage.js";
import { contentModel, selectedLesson } from "../data/lessons.js";

export function renderLearningLevels() {
  const model = contentModel(),
    selected = $("learnLevel").value;
  $("learnLevel").replaceChildren();
  for (const l of model.levels) {
    const o = document.createElement("option");
    o.value = l.id;
    o.textContent = l.title;
    $("learnLevel").append(o);
  }
  if (model.levels.some((l) => l.id === selected))
    $("learnLevel").value = selected;
  renderLearningLessons();
}

export function renderLearningLessons() {
  const selected = $("learnLesson").value;
  $("learnLesson").replaceChildren();
  const allOption = document.createElement("option"); allOption.value = "*"; allOption.textContent = "All Lessons";
  $("learnLesson").append(allOption);
  for (const l of contentModel().lessons.filter(
    (l) => l.level === $("learnLevel").value,
  )) {
    const o = document.createElement("option");
    o.value = l.id;
    o.textContent = l.title;
    $("learnLesson").append(o);
  }
  if ([...$("learnLesson").options].some((o) => o.value === selected))
    $("learnLesson").value = selected;
  loadLearningLesson();
}

export function loadLearningLesson() {
  runtime.learningAll = $("learnLesson").value === "*";
  runtime.learningAt = 0;
  const lesson = selectedLesson();
  runtime.learningWords = runtime.learningAll ? [...runtime.state.words] : lesson
    ? runtime.state.words.filter((w) => inSection(w, lesson.section))
    : [];
  renderLearningWord();
}

export function renderLearningWord() {
  const w = runtime.learningWords[runtime.learningAt];
  const old=document.getElementById('learnIllustration');if(old)old.remove();if(w?.image){const image=document.createElement('img');image.id='learnIllustration';image.src=w.image;image.alt=w.imageAlt||w.meaning;image.width=180;image.height=170;image.loading='lazy';image.onerror=()=>image.remove();$('learnHanzi').before(image);}
  $("learnHanzi").textContent = w?.hanzi || "No content yet";
  $("learnPinyin").textContent = w?.pinyin || "";
  $("learnMeaning").textContent = w?.meaning || "";
  $("learnExample").textContent = w?.example || "";
  $("learnPosition").textContent = runtime.learningWords.length
    ? runtime.learningAt + 1 + " / " + runtime.learningWords.length
    : "0 / 0";
  $("learnPrevious").disabled = !runtime.learningAt;
  $("learnNext").disabled =
    runtime.learningAt >= runtime.learningWords.length - 1;
  $("learnListen").disabled = !w;
  $("learnPractice").disabled = !w;
  if (w) {
    runtime.state.learned = runtime.state.learned || {};
    runtime.state.learned[w.id] = true;
    save();
  }
}
