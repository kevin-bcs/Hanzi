import {stopPracticeSession} from '../learning/activities.js';
import {renderLearningCenter} from '../learning/center.js';
import {showReadings,invalidateReadingsView} from '../readings/controller.js';
import {stopReadings} from '../readings/audio.js';
/** Hanzi Daily module: navigation/router.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { renderLessonButtons } from "../components/content-selectors.js";
import { renderCard } from "../components/review.js";
import { stopTimers } from "../games/game-engine.js";
import { startMemory, updateCardOptions } from "../games/memory.js";
import { startQuiz } from "../games/quick-choice.js";
import { startTone } from "../games/tone-drill.js";
import { renderRows } from "../components/vocabulary-view.js";
import { showSoundModes, startInitials } from "../games/initials-finals.js";
import { renderLearningLevels } from "../components/lesson-view.js";
import { renderProgress } from "../components/progress-view.js";

export function go(tab) {
  stopPracticeSession();
  if(tab!=="readings")invalidateReadingsView();
  stopReadings();
  if(tab === "readings") showReadings();
  stopTimers();
  runtime.gameEpoch++;
  runtime.activeGame = "";
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  document
    .querySelectorAll("main>section")
    .forEach((s) => s.classList.toggle("hidden", s.id !== tab));
  document
    .querySelectorAll("[data-tab]")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  if (tab === "learning") renderLearningCenter();
  if (tab === "progress") renderProgress();
  if (tab === "learn") renderLearningLevels();
  if (tab === "study") renderCard();
  if (tab === "words") renderRows();
  if (tab === "games") showGameHome();
}

export function resetGames() {
  if (runtime.activeGame) startGame(runtime.activeGame);
}

export function hideGameMenus() {
  for (const type of ["memory", "quiz", "tone", "initials"])
    $(type + "Menu").classList.add("hidden");
}

export function stopGame() {
  stopTimers();
  runtime.gameEpoch++;
  runtime.activeGame = "";
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (window.lessonAudio) window.lessonAudio.pause();
  $("gameArea").classList.add("hidden");
}

export function showGameHome() {
  stopGame();
  hideGameMenus();
  $("gameModes").classList.remove("hidden");
}

export function openGameMenu(type, fromLearning = false) {
  if(type === "memory") runtime.learningMatching = fromLearning;
  if (type === "initials") {
    showSoundModes();
    return;
  }
  stopGame();
  if (type === "memory") updateCardOptions();
  hideGameMenus();
  $("gameModes").classList.add("hidden");
  $(type + "Menu").classList.remove("hidden");
  if (!["tone", "initials"].includes(type)) renderLessonButtons(type);
}

export function startGame(type) {
  stopGame();
  hideGameMenus();
  runtime.activeGame = type;
  $("gameModes").classList.add("hidden");
  $("gameArea").classList.remove("hidden");
  if (type === "memory") startMemory(false);
  else if (type === "quiz") startQuiz();
  else if (type === "initials") startInitials();
  else {
    runtime.toneMode = $("toneMenuLength").value;
    startTone();
  }
}
