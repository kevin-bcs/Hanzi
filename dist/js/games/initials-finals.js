/** Hanzi Daily module: games/initials-finals.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { save } from "../services/storage.js";
import { say } from "../services/audio.js";
import { shuffle } from "../utils.js";
import { gameTop, recordResult, setupBack } from "./game-engine.js";
import { hideGameMenus, stopGame } from "../navigation/router.js";
import { phoneticBank } from "../data/phonetics.js";

export const soundSettings = {
  initials: { difficulty: "intermediate", count: 10, variation: true },
  finals: { difficulty: "intermediate", count: 10, variation: true },
};

export function showSoundModes() {
  stopGame();
  hideGameMenus();
  $("gameModes").classList.add("hidden");
  $("initialsMenu").classList.remove("hidden");
  $("soundModes").classList.remove("hidden");
  $("soundConfig").classList.add("hidden");
}

export function configureSounds(mode) {
  runtime.soundMode = mode;
  $("soundModes").classList.add("hidden");
  $("soundConfig").classList.remove("hidden");
  $("soundConfigTitle").textContent =
    mode === "initials" ? "Initials configuration" : "Finals configuration";
  const settings = soundSettings[mode];
  $("soundDifficulty").value = settings.difficulty;
  $("soundCount").value = String(settings.count);
  $("soundVariation").checked = settings.variation;
  $("soundInventory").textContent = phoneticBank[mode]
    .map((x) => x.id)
    .join(" · ");
}

export function soundOptions(target, mode, difficulty) {
  const bank = phoneticBank[mode],
    rest = bank.filter((x) => x.id !== target.id),
    near = target.near
      .map((id) => bank.find((x) => x.id === id))
      .filter(Boolean);
  let candidates;
  if (difficulty === "advanced")
    candidates = [...shuffle(near), ...shuffle(rest)];
  else if (difficulty === "intermediate")
    candidates = [
      ...shuffle(near).slice(0, 1),
      ...shuffle(rest.filter((x) => x.kind === target.kind)),
      ...shuffle(rest),
    ];
  else
    candidates = [
      ...shuffle(
        rest.filter(
          (x) => !target.near.includes(x.id) && x.kind !== target.kind,
        ),
      ),
      ...shuffle(rest),
    ];
  const ids = [target.id];
  for (const candidate of candidates)
    if (!ids.includes(candidate.id) && ids.length < 4) ids.push(candidate.id);
  return shuffle(ids);
}

export function startInitials(onlyMissed = false) {
  const settings = {
    difficulty: $("soundDifficulty").value,
    count: Number($("soundCount").value),
    variation: $("soundVariation").checked,
  };
  if (settings.difficulty === "expert") {
    alert(
      "Expert needs validated recordings. Use Advanced with the device voice for now.",
    );
    return;
  }
  soundSettings[runtime.soundMode] = settings;
  const last = runtime.soundRound;
  let bank = phoneticBank[runtime.soundMode];
  if (onlyMissed && last)
    bank = bank.filter((x) => last.performance[x.id]?.wrong > 0);
  if (!bank.length) {
    alert("No missed sounds to practice.");
    return;
  }
  runtime.state.soundCoverage = runtime.state.soundCoverage || {};
  const coverage = runtime.state.soundCoverage[runtime.soundMode] || {},
    queue = [];
  let cycle = 0;
  while (queue.length < settings.count) {
    let batch = shuffle(bank).sort(
      (a, b) => (coverage[a.id] || 0) - (coverage[b.id] || 0),
    );
    if (cycle++) batch = shuffle(bank);
    if (
      queue.length &&
      batch.length > 1 &&
      batch[0].id === queue.at(-1).target.id
    )
      [batch[0], batch[1]] = [batch[1], batch[0]];
    for (const target of batch) {
      if (queue.length >= settings.count) break;
      queue.push({
        target,
        example: settings.variation
          ? shuffle(target.examples)[0]
          : target.examples[0],
        options: soundOptions(target, runtime.soundMode, settings.difficulty),
      });
    }
  }
  runtime.soundRound = {
    mode: runtime.soundMode,
    settings,
    queue,
    at: 0,
    correct: 0,
    wrong: 0,
    started: Date.now(),
    performance: {},
    saved: false,
  };
  showSoundQuestion();
}

export function showSoundQuestion() {
  const r = runtime.soundRound;
  if (r.at >= r.queue.length) {
    finishSounds();
    return;
  }
  const q = r.queue[r.at],
    epoch = runtime.gameEpoch,
    at = r.at;
  let answered = false,
    heard = false;
  $("gameArea").innerHTML =
    gameTop(
      "Initials & Finals — Pinyin Sound Challenge",
      r.at + 1 + " / " + r.queue.length + " · " + r.settings.difficulty,
    ) +
    '<progress style="width:100%" value="' +
    r.at +
    '" max="' +
    r.queue.length +
    '"></progress><h2 class="gamefeedback">Listen carefully. Which ' +
    (r.mode === "initials" ? "initial" : "final") +
    ' did you hear?</h2><div class="gamefeedback"><button id="soundReplay" class="primary">Replay audio</button></div><p class="small">You hear a complete syllable. Identify only its ' +
    (r.mode === "initials" ? "onset spelling" : "final") +
    '. Tone is not scored.</p><div class="quizopts" id="soundAnswers"></div><p id="soundStatus" role="status" class="notice"></p><div id="soundExplanation"></div><button id="soundNext" disabled>Next exercise</button>';
  setupBack();
  const current = () =>
    runtime.activeGame === "initials" &&
    epoch === runtime.gameEpoch &&
    r === runtime.soundRound &&
    r.at === at;
  const listen = () => {
    if (!current()) return;
    heard = say(q.example.hanzi);
    for (const b of $("soundAnswers").children) b.disabled = answered || !heard;
    $("soundStatus").textContent = heard
      ? "Listen, then choose one of four sounds."
      : "No Mandarin voice is available. Enable a Mandarin voice, then press Replay. This question is not scored until audio can be requested.";
  };
  for (const id of q.options) {
    const b = document.createElement("button");
    b.textContent = id;
    b.style.fontSize = "28px";
    b.disabled = true;
    b.onclick = () => {
      if (!current() || answered || !heard) return;
      answered = true;
      for (const x of $("soundAnswers").children) {
        x.disabled = true;
        if (x.textContent === q.target.id) x.classList.add("correct");
        else if (x === b) x.classList.add("wrong");
      }
      const correct = id === q.target.id;
      r[correct ? "correct" : "wrong"]++;
      const perf =
        r.performance[q.target.id] ||
        (r.performance[q.target.id] = { correct: 0, wrong: 0 });
      perf[correct ? "correct" : "wrong"]++;
      runtime.state.soundCoverage[r.mode] =
        runtime.state.soundCoverage[r.mode] || {};
      runtime.state.soundCoverage[r.mode][q.target.id] =
        (runtime.state.soundCoverage[r.mode][q.target.id] || 0) + 1;
      save();
      $("soundStatus").textContent =
        (correct ? "Correct! " : "Correct answer: " + q.target.id + ". ") +
        q.example.hanzi +
        " · " +
        q.example.pinyin;
      const desc = document.createElement("p");
      desc.textContent = q.target.articulation;
      $("soundExplanation").append(desc);
      if (!correct) {
        const other = phoneticBank[r.mode].find((x) => x.id === id);
        const compare = document.createElement("p");
        compare.textContent = "Compare " + id + ": " + other.articulation;
        $("soundExplanation").append(compare);
      }
      $("soundNext").disabled = false;
    };
    $("soundAnswers").append(b);
  }
  $("soundReplay").onclick = listen;
  $("soundNext").onclick = () => {
    if (!current() || !answered) return;
    r.at++;
    showSoundQuestion();
  };
  listen();
}

export function finishSounds() {
  const r = runtime.soundRound,
    seconds = Math.round((Date.now() - r.started) / 1000);
  if (!r.saved) {
    recordResult("sounds-" + r.mode, {
      correct: r.correct,
      wrong: r.wrong,
      seconds,
      performance: r.performance,
      difficulty: r.settings.difficulty,
    });
    r.saved = true;
  }
  $("gameArea").innerHTML =
    gameTop("Pinyin Sound Challenge — Results", r.mode) +
    '<div class="notice">' +
    r.queue.length +
    " questions · " +
    r.correct +
    " correct · " +
    r.wrong +
    " incorrect · " +
    Math.round((100 * r.correct) / r.queue.length) +
    "% · " +
    seconds +
    ' seconds</div><h2>Performance by sound</h2><div id="soundResults"></div><p id="soundMisses"></p><div class="toolbar"><button id="soundAgain" class="primary">Repeat this session</button><button id="soundMissed">Practice missed sounds</button></div>';
  setupBack();
  for (const [id, p] of Object.entries(r.performance)) {
    const row = document.createElement("p");
    row.textContent =
      id + ": " + p.correct + " correct / " + p.wrong + " wrong";
    $("soundResults").append(row);
  }
  const missed = Object.entries(r.performance)
    .filter(([, p]) => p.wrong)
    .sort((a, b) => b[1].wrong - a[1].wrong);
  $("soundMisses").textContent =
    "Most missed: " +
    (missed.map(([id, p]) => id + " (" + p.wrong + ")").join(", ") || "None");
  $("soundMissed").disabled = !missed.length;
  $("soundMissed").onclick = () => {
    runtime.gameEpoch++;
    startInitials(true);
  };
  $("soundAgain").onclick = () => {
    runtime.gameEpoch++;
    r.at = 0;
    r.correct = 0;
    r.wrong = 0;
    r.started = Date.now();
    r.performance = {};
    r.saved = false;
    showSoundQuestion();
  };
}
