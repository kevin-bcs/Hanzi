/** Hanzi Daily module: games/tone-drill.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { save } from "../services/storage.js";
import { group } from "../components/content-selectors.js";
import { say } from "../services/audio.js";
import { gameTop, markError, recordResult, setupBack } from "./game-engine.js";

export const toneMarks = {
  ā: 1,
  ē: 1,
  ī: 1,
  ō: 1,
  ū: 1,
  ǖ: 1,
  á: 2,
  é: 2,
  í: 2,
  ó: 2,
  ú: 2,
  ǘ: 2,
  ǎ: 3,
  ě: 3,
  ǐ: 3,
  ǒ: 3,
  ǔ: 3,
  ǚ: 3,
  à: 4,
  è: 4,
  ì: 4,
  ò: 4,
  ù: 4,
  ǜ: 4,
};

export function markedTone(s) {
  for (const c of s.toLowerCase()) if (toneMarks[c]) return toneMarks[c];
  return 5;
}

export function syllables(w) {
  const text = w.pinyin.split("/")[0].trim();
  return text.split(/\s+/);
}

export function startTone() {
  runtime.toneScore = 0;
  runtime.toneTotal = 0;
  runtime.toneRounds = 0;
  nextTone();
}

export function nextTone() {
  if (runtime.toneRounds >= 10) {
    recordResult("tone", {
      correct: runtime.toneScore,
      wrong: runtime.toneTotal - runtime.toneScore,
    });
    $("gameArea").innerHTML =
      gameTop("Tone drill — Results") +
      '<div class="empty"><h2>' +
      runtime.toneScore +
      " / " +
      runtime.toneTotal +
      " correct</h2><p>10 words completed.</p></div>";
    setupBack();
    return;
  }
  runtime.toneRounds++;
  const pool = group("toneSection")
    .filter(
      (w) =>
        syllables(w).length === Array.from(w.hanzi.split("/")[0].trim()).length,
    )
    .filter(
      (w) =>
        runtime.toneMode === "any" ||
        (runtime.toneMode === "3"
          ? syllables(w).length >= 3
          : syllables(w).length === +runtime.toneMode),
    );
  $("gameArea").innerHTML =
    gameTop("Mandarin tone drill") +
    '<div class="toolbar"><label>Word length<select id="toneLength"><option value="any">Any length</option><option value="1">One syllable</option><option value="2">Two syllables</option><option value="3">Multiple syllables</option></select></label><button id="toneRestart">Start over</button></div><p class="tone-guide">Listen, choose a syllable, then identify its tone. Audio uses your browser’s Chinese voice. Answers follow the displayed pinyin; connected speech may change tones.</p><div id="toneScore" class="notice"></div><div class="gamefeedback"><button class="primary" id="tonePlay">Play word</button> <button id="toneHint">Hint</button></div><div id="tonePinyin" class="pinyin gamefeedback"></div><div id="syllables" class="syllables"></div><div id="toneButtons" class="tonebuttons"></div><p id="toneFeedback" class="gamefeedback" role="status"></p><div class="exercise-footer"><button id="toneNext">Next word</button></div>';
  setupBack();
  $("toneLength").value = runtime.toneMode;
  $("toneLength").onchange = () => {
    runtime.toneMode = $("toneLength").value;
    $("toneMenuLength").value = runtime.toneMode;
    nextTone();
  };
  $("toneRestart").onclick = startTone;
  $("toneNext").onclick = nextTone;
  $("toneScore").textContent =
    "Correct: " +
    runtime.toneScore +
    " · Wrong: " +
    (runtime.toneTotal - runtime.toneScore) +
    " · Score: " +
    (runtime.toneTotal
      ? Math.round((100 * runtime.toneScore) / runtime.toneTotal)
      : 0) +
    "%";
  if (!pool.length) {
    $("toneFeedback").textContent =
      "No suitable words. Choose another section or length. Custom tone words need spaces between pinyin syllables.";
    $("tonePlay").disabled = true;
    $("toneHint").disabled = true;
    return;
  }
  runtime.toneWord = pool[Math.floor(Math.random() * pool.length)];
  let parts = syllables(runtime.toneWord),
    target = 0,
    played = false,
    answered = new Set();
  function buttons() {
    document
      .querySelectorAll("[data-tone]")
      .forEach((b) => (b.disabled = !played || answered.has(target)));
  }
  parts.forEach((s, i) => {
    let b = document.createElement("button");
    b.textContent = "Syllable " + (i + 1);
    b.className = "syllable" + (i === 0 ? " selected" : "");
    b.onclick = () => {
      target = i;
      document
        .querySelectorAll(".syllable")
        .forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      say(runtime.toneWord.hanzi.split("/")[0]);
      buttons();
    };
    $("syllables").append(b);
  });
  ["→ First", "↗ Second", "↘↗ Third", "↘ Fourth", "· Neutral"].forEach(
    (label, i) => {
      let b = document.createElement("button");
      b.textContent = label + " tone";
      b.dataset.tone = i + 1;
      b.disabled = true;
      b.onclick = () => {
        if (!played || answered.has(target)) return;
        answered.add(target);
        runtime.toneTotal++;
        let correct = markedTone(parts[target]) === i + 1;
        if (correct) {
          runtime.toneScore++;
          runtime.state.games.tone = (runtime.state.games.tone || 0) + 1;
          save();
        } else markError(runtime.toneWord);
        $("toneFeedback").textContent =
          (correct ? "Correct! " : "Answer: ") +
          parts[target] +
          " · tone " +
          markedTone(parts[target]);
        $("toneScore").textContent =
          "Correct: " +
          runtime.toneScore +
          " · Wrong: " +
          (runtime.toneTotal - runtime.toneScore) +
          " · Score: " +
          Math.round((100 * runtime.toneScore) / runtime.toneTotal) +
          "%";
        buttons();
      };
      $("toneButtons").append(b);
    },
  );
  $("tonePlay").onclick = () => {
    played = say(runtime.toneWord.hanzi.split("/")[0]);
    if (!played)
      $("toneFeedback").textContent =
        "Audio unavailable. Use Hint to practice from pinyin.";
    buttons();
  };
  $("toneHint").onclick = () => {
    $("tonePinyin").textContent = runtime.toneWord.pinyin;
    played = true;
    buttons();
  };
  $("tonePlay").onclick();
}
