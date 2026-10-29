/** Composition root. Imports feature contracts and binds UI events only after module initialization.
 * Initialization order is intentionally retained to preserve saved-data migration and event behavior. */
import { runtime } from "./state/app-state.js";
import { $, KEY } from "./config/constants.js";
import {
  exportBackup,
  importData,
  inSection,
  memberships,
  mergeStarter,
  restoreBackup,
  save,
  validateBackup,
} from "./services/storage.js";
import {
  fillGameSections,
  fillSelect,
  renderLessonButtons,
} from "./components/content-selectors.js";
import { updateStats } from "./components/progress-view.js";
import { rate, renderCard, revealCard } from "./components/review.js";
import { playLearningWord, say } from "./services/audio.js";
import {
  go,
  openGameMenu,
  showGameHome,
  startGame,
} from "./navigation/router.js";
import { updateCardOptions } from "./games/memory.js";
import { renderRows } from "./components/vocabulary-view.js";
import { configureSounds, showSoundModes } from "./games/initials-finals.js";
import { contentModel, selectedLesson } from "./data/lessons.js";
import {
  loadLearningLesson,
  renderLearningLessons,
  renderLearningLevels,
  renderLearningWord,
} from "./components/lesson-view.js";

runtime.storageBlocked = false;
runtime.state = { words: [], days: {}, games: {}, results: [], version: 4 };
try {
  const rawSaved = localStorage.getItem(KEY);
  if (rawSaved) {
    const old = JSON.parse(rawSaved);
    if (!old || !Array.isArray(old.words)) throw Error("Invalid stored data");
    if (!localStorage.getItem(KEY + "-before-v4"))
      localStorage.setItem(KEY + "-before-v4", rawSaved);
    runtime.state = {
      ...runtime.state,
      ...old,
      days: old.days || {},
      games: old.games || {},
    };
  }
} catch {
  runtime.storageBlocked = true;
  $("storageWarning").textContent =
    "Stored data could not be read or backed up. Automatic saving is paused to protect it. Export your data before continuing.";
  $("storageWarning").classList.remove("hidden");
}
runtime.state.deleted = Array.isArray(runtime.state.deleted)
  ? runtime.state.deleted
  : [];
runtime.state.words = runtime.state.words.filter(
  (w) =>
    w &&
    typeof w.hanzi === "string" &&
    typeof w.pinyin === "string" &&
    typeof w.meaning === "string",
);
mergeStarter();
runtime.seenIds = new Set();
for (const w of runtime.state.words) {
  if (!w.id || runtime.seenIds.has(w.id)) w.id = crypto.randomUUID();
  runtime.seenIds.add(w.id);
  for (const k of ["due", "interval", "errors"])
    if (!Number.isFinite(w[k]) || w[k] < 0) w[k] = 0;
}
save();
fillSelect($("studyFilter"));
fillGameSections();
fillSelect($("wordFilter"));
runtime.skipped = new Set();
runtime.current = null;
runtime.shown = false;
$("showAnswer").onclick = revealCard;
$("flash").onclick = revealCard;
$("flash").onkeydown = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    revealCard();
  }
};
$("skipCard").onclick = () => {
  if (runtime.current) {
    runtime.skipped.add(runtime.current.id);
    renderCard();
  }
};
document
  .querySelectorAll("[data-rate]")
  .forEach((b) => (b.onclick = () => rate(b.dataset.rate)));
$("studyFilter").onchange = () => {
  runtime.skipped.clear();
  renderCard();
};
$("speakCard").onclick = () => runtime.current && say(runtime.current.hanzi);
document
  .querySelectorAll("[data-tab]")
  .forEach((b) => (b.onclick = () => go(b.dataset.tab)));
document
  .querySelectorAll("[data-game]")
  .forEach((b) => (b.onclick = () => openGameMenu(b.dataset.game)));
for (const type of ["memory", "quiz"])
  $(type + "Section").onchange = () => renderLessonButtons(type);
for (const type of ["memory", "quiz", "tone", "initials"]) {
  $(type + "Start").onclick = () => startGame(type);
  $(type + "Home").onclick = showGameHome;
}
document.getElementById("extra").onclick = () => {
  // handled through play tab
  go("games");
};
document
  .querySelectorAll("[data-goto]")
  .forEach((b) => (b.onclick = () => go(b.dataset.goto)));
runtime.activeGame = "";
runtime.gameState = null;
runtime.gameTimer = null;
runtime.gameDelay = null;
runtime.gameEpoch = 0;
runtime.quizList = [];
runtime.quizAt = 0;
runtime.quizScore = 0;
runtime.quizStarted = 0;
runtime.toneWord = null;
runtime.toneScore = 0;
runtime.toneTotal = 0;
runtime.toneMode = "any";
runtime.toneRounds = 0;
$("search").oninput = renderRows;
$("wordFilter").onchange = renderRows;
$("export").onclick = exportBackup;
$("importBtn").onclick = () => $("import").click();
$("import").onchange = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2000000) throw Error();
    importData(JSON.parse(await file.text()));
    fillSelect($("studyFilter"));
    fillGameSections();
    fillSelect($("wordFilter"));
    renderRows();
    updateStats();
    alert(
      "Backup merged. Vocabulary, review schedules and game scores preserved.",
    );
  } catch {
    alert(
      "Could not import this backup. Choose a valid Hanzi Daily JSON file.",
    );
  } finally {
    e.target.value = "";
  }
};
setInterval(() => {
  if (!$("study").classList.contains("hidden") && !runtime.current)
    renderCard();
}, 15000);
$("today").textContent = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "short",
  day: "numeric",
}).format(new Date());
renderCard();
updateStats();
runtime.soundMode = "initials";
runtime.soundRound = null;
runtime.learningWords = [];
runtime.learningAt = 0;

$("learnLevel").onchange = renderLearningLessons;
$("learnLesson").onchange = loadLearningLesson;
$("learnPrevious").onclick = () => {
  runtime.learningAt--;
  renderLearningWord();
};
$("learnNext").onclick = () => {
  runtime.learningAt++;
  renderLearningWord();
};
$("learnListen").onclick = playLearningWord;
$("learnVoice").onclick = () =>
  runtime.learningWords[runtime.learningAt] &&
  say(runtime.learningWords[runtime.learningAt].hanzi);
$("learnPractice").onclick = () => {
  const lesson = selectedLesson();
  const practiceSection = runtime.learningAll ? "*" : lesson?.section;
  go("games");
  for (const type of ["memory", "quiz", "tone"])
    $(type + "Section").value = practiceSection;
  renderLessonButtons("memory");
  renderLessonButtons("quiz");
};
$("import").onchange = async (e) => {
  try {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2000000) throw Error("File too large");
    const d = JSON.parse(await f.text());
    validateBackup(d);
    if (
      !confirm(
        "Restore this backup? It replaces this browser’s current collection and progress with the backup, including edits and deletions. A recovery copy of the current data will be kept.",
      )
    )
      return;
    restoreBackup(d);
    alert("Backup restored, including edits, deletions and progress.");
  } catch (err) {
    alert("Backup not restored: " + err.message);
  } finally {
    e.target.value = "";
  }
};
$("recoverData").onclick = () => {
  const raw =
    localStorage.getItem(KEY + "-before-restore") ||
    localStorage.getItem(KEY + "-before-v4");
  if (!raw) {
    alert("No recovery snapshot is available");
    return;
  }
  if (confirm("Restore the recovery snapshot?"))
    try {
      restoreBackup(JSON.parse(raw));
    } catch (e) {
      alert(e.message);
    }
};
$("memorySection").onchange = () => {
  renderLessonButtons("memory");
  updateCardOptions();
};
contentModel();
renderLearningLevels();
updateCardOptions();
go("home");
$("chooseInitials").onclick = () => configureSounds("initials");
$("chooseFinals").onclick = () => configureSounds("finals");
$("soundModeBack").onclick = showSoundModes;

$("memoryFormat").onchange = updateCardOptions;
