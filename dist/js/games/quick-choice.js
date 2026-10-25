/** Hanzi Daily module: games/quick-choice.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { escapeHTML, norm, shuffle } from "../utils.js";
import { save } from "../services/storage.js";
import { group } from "../components/content-selectors.js";
import { say } from "../services/audio.js";
import {
  gameTop,
  markError,
  recordResult,
  setupBack,
  stopTimers,
} from "./game-engine.js";

export function startQuiz() {
  stopTimers();
  runtime.gameEpoch++;
  runtime.quizList = shuffle(
    group("quizSection").filter(
      (w) =>
        $("quizDifficulty").value !== "long" ||
        Array.from(w.hanzi.split("/")[0].trim()).length >= 3,
    ),
  );
  runtime.quizList = runtime.quizList.slice(
    0,
    Math.min(Number($("quizCount").value), runtime.quizList.length),
  );
  runtime.quizAt = 0;
  runtime.quizScore = 0;
  runtime.quizStarted = Date.now();
  showQuiz();
}

export function showQuiz() {
  stopTimers();
  if (!runtime.quizList.length) {
    $("gameArea").innerHTML =
      gameTop("Quick choice") +
      "<p>No words match these settings. Choose another lesson or difficulty.</p>";
    setupBack();
    return;
  }
  if (runtime.quizAt >= runtime.quizList.length) {
    const seconds = Math.round((Date.now() - runtime.quizStarted) / 1000);
    recordResult("quiz", {
      correct: runtime.quizScore,
      wrong: runtime.quizList.length - runtime.quizScore,
      seconds,
    });
    $("gameArea").innerHTML =
      gameTop("Round complete") +
      '<div class="empty"><h2>' +
      runtime.quizScore +
      " / " +
      runtime.quizList.length +
      " correct</h2><p>" +
      (runtime.quizList.length - runtime.quizScore) +
      " wrong · " +
      Math.round((100 * runtime.quizScore) / runtime.quizList.length) +
      "% accuracy · " +
      seconds +
      ' seconds</p><button class="primary" id="againQuiz">Play again</button></div>';
    setupBack();
    $("againQuiz").onclick = () => startQuiz();
    return;
  }
  const w = runtime.quizList[runtime.quizAt],
    opts = shuffle([
      w,
      ...shuffle([
        ...new Map(
          group("quizSection")
            .filter((x) => x.id !== w.id && norm(x.meaning) !== norm(w.meaning))
            .map((x) => [norm(x.meaning), x]),
        ).values(),
      ]).slice(0, 3),
    ]),
    epoch = runtime.gameEpoch;
  let answered = false;
  $("gameArea").innerHTML =
    gameTop(
      "Quick choice",
      "Question " + (runtime.quizAt + 1) + " of " + runtime.quizList.length,
    ) +
    '<p id="quizClock" class="notice"></p><div class="quizword">' +
    escapeHTML(w.hanzi) +
    "</div>" +
    ($("quizPinyin").checked
      ? '<p class="gamefeedback pinyin">' + escapeHTML(w.pinyin) + "</p>"
      : "") +
    '<div class="gamefeedback"><button id="quizListen">Listen</button></div><div id="quizopts" class="quizopts"></div><p id="qfeedback" class="gamefeedback" role="status"></p>';
  setupBack();
  $("quizListen").onclick = () => say(w.hanzi);
  function answer(x) {
    if (answered || epoch !== runtime.gameEpoch) return;
    answered = true;
    stopTimers();
    const correct = x?.id === w.id;
    if (correct) {
      runtime.quizScore++;
      runtime.state.games.quiz = (runtime.state.games.quiz || 0) + 1;
      save();
    } else markError(w);
    for (const b of $("quizopts").children) {
      b.disabled = true;
      if (b.textContent === w.meaning) b.classList.add("correct");
      else if (b.textContent === x?.meaning) b.classList.add("wrong");
    }
    $("qfeedback").textContent =
      (correct ? "Correct! " : x ? "Answer: " : "Time expired. Answer: ") +
      w.meaning +
      " · " +
      w.pinyin;
    runtime.gameDelay = setTimeout(() => {
      if (epoch === runtime.gameEpoch && runtime.activeGame === "quiz") {
        runtime.quizAt++;
        showQuiz();
      }
    }, 1200);
  }
  for (const x of opts) {
    const b = document.createElement("button");
    b.textContent = x.meaning;
    b.onclick = () => answer(x);
    $("quizopts").append(b);
  }
  const limit = Number($("quizTime").value);
  if (limit) {
    const deadline = Date.now() + limit * 1000;
    $("quizClock").textContent = limit + "s remaining";
    runtime.gameTimer = setInterval(() => {
      if (epoch !== runtime.gameEpoch) return;
      const left = Math.max(0, deadline - Date.now());
      $("quizClock").textContent = (left / 1000).toFixed(1) + "s remaining";
      if (!left) answer(null);
    }, 50);
  } else $("quizClock").textContent = "No time limit";
}
