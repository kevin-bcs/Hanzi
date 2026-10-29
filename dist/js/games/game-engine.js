/** Shared lifecycle only. Epoch guards and timer cleanup prevent stale callbacks from scoring another round. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { save } from "../services/storage.js";
import {
  go,
  openGameMenu,
  showGameHome,
  startGame,
} from "../navigation/router.js";
import { escapeHTML } from "../utils.js";
import { startMemory } from "./memory.js";

export function stopTimers() {
  clearInterval(runtime.gameTimer);
  clearTimeout(runtime.gameDelay);
  runtime.gameTimer = null;
  runtime.gameDelay = null;
}

export function recordResult(game, data) {
  runtime.state.results = Array.isArray(runtime.state.results)
    ? runtime.state.results
    : [];
  runtime.state.results.push({ game, date: new Date().toISOString(), ...data });
  runtime.state.results = runtime.state.results.slice(-200);
  save();
}

export function gameTop(title, extra = "") {
  return (
    '<div class="gamebar"><div><b>' +
    title +
    '</b> <span class="small">' +
    extra +
    '</span><div class="small">' +
    escapeHTML(
      runtime.activeGame === "initials"
        ? runtime.soundRound?.mode || runtime.soundMode
        : $(runtime.activeGame + "Section").value === "*"
          ? "All vocabulary"
          : $(runtime.activeGame + "Section").value,
    ) +
    '</div></div><div><button class="btn" id="restartGame">Restart</button>' +
    (runtime.activeGame === "memory"
      ? '<button class="btn" id="newMemory">Restart all</button>'
      : "") +
    ' <button class="btn" id="backGames">Game settings</button> <button class="btn" id="gameHome">All games</button> <button class="btn" id="backLesson">Back to lesson</button></div></div>'
  );
}

export function setupBack() {
  $("backLesson").onclick = () => go("learn");
  $("backGames").onclick = () => openGameMenu(runtime.activeGame, runtime.learningMatching);
  $("gameHome").onclick = showGameHome;
  $("restartGame").onclick = () =>
    runtime.activeGame === "memory"
      ? startMemory(true)
      : startGame(runtime.activeGame);
  if ($("newMemory")) $("newMemory").onclick = () => startMemory(false);
}

export function markError(w) {
  w.errors = (w.errors || 0) + 1;
  w.due = Math.min(w.due || 0, Date.now() + 60000);
  save();
}
