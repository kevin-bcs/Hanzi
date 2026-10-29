import {recordPracticeAttempt,recordPracticeSession} from '../learning/history.js';
/** Local multiplayer: a correct pair keeps the turn; misses/timeouts pass it. Same-selection restart must preserve word IDs. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { norm, shuffle } from "../utils.js";
import { save } from "../services/storage.js";
import { group } from "../components/content-selectors.js";
import { say } from "../services/audio.js";
import { gameTop, recordResult, setupBack, stopTimers, markError } from "./game-engine.js";

export function memoryPool() {
  const format = $("memoryFormat")?.value || "combined";
  const words = [...new Map(group("memorySection").map(w=>[norm(w.pinyin)+"|"+norm(w.meaning),w])).values()];
  if(format === "combined") return words;
  const left=w=>norm(format === "pinyin-english" ? w.pinyin : w.hanzi);
  const right=w=>norm(format === "hanzi-pinyin" ? w.pinyin : w.meaning);
  // Exclude ambiguous representations, e.g. 他/她 → tā, instead of grading a guess as wrong.
  return words.filter(w=>words.filter(x=>left(x)===left(w)).length===1 && words.filter(x=>right(x)===right(w)).length===1);
}

export function updateCardOptions() {
  const max = Math.min(100, memoryPool().length * 2),
    selected = Number($("pairCount").value);
  $("pairCount").replaceChildren();
  for (let cards = 6; cards <= max; cards += 2) {
    if(runtime.learningMatching && ![6,8,10,12].includes(cards/2)) continue;
    const o = document.createElement("option");
    o.value = cards / 2;
    o.textContent = cards + " cards · " + cards / 2 + " pairs";
    $("pairCount").append(o);
  }
  $("pairCount").value = String(Math.max(3, Math.min(selected || 6, max / 2)));
  if(runtime.learningMatching){const allowed=[...$("pairCount").options].map(o=>o.value);if(!allowed.includes($("pairCount").value))$("pairCount").value=allowed[0]||"";}
  $("memoryStart").disabled = max < (runtime.learningMatching ? 12 : 6);
}

export function startMemory(same = false) {
  stopTimers();
  runtime.gameEpoch++;
  let list =
    same && runtime.gameState
      ? runtime.gameState.selection
      : [...shuffle(memoryPool())].slice(0, Number($("pairCount").value));
  if (list.length < 3) {
    $("gameArea").innerHTML =
      gameTop("Memorama") +
      "<p>At least three distinct pairs are required.</p>";
    setupBack();
    return;
  }
  const names = $("memoryPlayers")
    .value.split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 12);
  const players = (names.length ? names : ["Player 1"]).map((name) => ({
    name,
    score: 0,
  }));
  const format = same && runtime.gameState ? runtime.gameState.format : ($("memoryFormat")?.value || "combined");
  let deck = shuffle(
    list.flatMap((w, i) => [
      { id: i, side: "zh", text: format === "pinyin-english" ? w.pinyin : w.hanzi, word: w },
      { id: i, side: "en", text: format === "hanzi-pinyin" ? w.pinyin : format === "combined" ? w.pinyin + " — " + w.meaning : w.meaning, word: w },
    ]),
  );
  runtime.gameState = {
    sessionId: crypto.randomUUID(),
    selection: list,
    format,
    players,
    turn: 0,
    deck,
    open: [],
    matches: new Set(),
    tries: 0,
    pairs: list.length,
    finished: false,
  };
  $("gameArea").innerHTML =
    gameTop("Memorama", {combined:"Hanzi ↔ Pinyin + English", "hanzi-english":"Hanzi ↔ English", "hanzi-pinyin":"Hanzi ↔ Pinyin", "pinyin-english":"Pinyin ↔ English"}[format]) +
    '<div id="memoryScores" class="notice"></div><p class="gamefeedback">Attempts: <b id="tries">0</b> · Pairs found: <b id="pairsFound">0</b> / ' +
    list.length +
    ' · <span id="turnClock"></span></p><div class="board" id="board"></div><div class="gamefeedback" id="gameFeedback" role="status"></div>';
  setupBack();
  drawBoard();
  memoryTurn();
}

export function memoryTurn() {
  stopTimers();
  if (runtime.gameState.finished) return;
  runtime.gameState.open = [];
  drawBoard();
  $("memoryScores").textContent =
    "Active: " +
    runtime.gameState.players[runtime.gameState.turn].name +
    " | " +
    runtime.gameState.players.map((p) => p.name + ": " + p.score).join(" · ");
  $("memoryScores").style.borderLeft =
    "6px solid " +
    ["#28594c", "#bd7136", "#6c54a1"][runtime.gameState.turn % 3];
  if ($("memoryTimer").checked) {
    const deadline = Date.now() + 5000,
      epoch = runtime.gameEpoch;
    $("turnClock").textContent = "5.0s";
    runtime.gameTimer = setInterval(() => {
      if (epoch !== runtime.gameEpoch) return;
      const remaining = Math.max(0, deadline - Date.now());
      $("turnClock").textContent = (remaining / 1000).toFixed(1) + "s";
      if (!remaining) {
        stopTimers();
        runtime.gameState.turn =
          (runtime.gameState.turn + 1) % runtime.gameState.players.length;
        memoryTurn();
      }
    }, 50);
  } else $("turnClock").textContent = "No time limit";
}

export function drawBoard() {
  const board = $("board");
  board.replaceChildren();
  runtime.gameState.deck.forEach((c, i) => {
    let b = document.createElement("button");
    b.className =
      "tile " +
      (runtime.gameState.matches.has(c.id)
        ? "match"
        : runtime.gameState.open.includes(i)
          ? "open"
          : "");
    b.setAttribute(
      "aria-label",
      runtime.gameState.matches.has(c.id)
        ? c.text
        : runtime.gameState.open.includes(i)
          ? c.text
          : "Hidden card",
    );
    if (
      runtime.gameState.matches.has(c.id) ||
      runtime.gameState.open.includes(i)
    ) {
      if (c.side === "en" && runtime.gameState.format === "combined") {
        const pinyin = document.createElement("span");
        pinyin.className = "card-pinyin";
        pinyin.textContent = c.word.pinyin;
        const meaning = document.createElement("span");
        meaning.className = "card-meaning";
        meaning.textContent = c.word.meaning;
        b.append(pinyin, meaning);
      } else {
        b.textContent = c.text;
        b.setAttribute("lang", "zh-CN");
      }
      b.classList.add(c.side);
    } else {
      b.innerHTML = '<span class="tilemark">字</span>';
    }
    b.onclick = () => flip(i);
    board.append(b);
  });
}

export function flip(i) {
  const g = runtime.gameState;
  if (
    g.finished ||
    g.open.includes(i) ||
    g.matches.has(g.deck[i].id) ||
    g.open.length >= 2
  )
    return;
  g.open.push(i);
  drawBoard();
  if (g.open.length !== 2) return;
  g.tries++;
  $("tries").textContent = g.tries;
  const [a, b] = g.open.map((i) => g.deck[i]);
  if (a.id === b.id) {
    stopTimers();
    g.matches.add(a.id);
    g.players[g.turn].score++;
    recordPracticeAttempt(runtime.state,{id:"matching:"+a.word.id,type:"matching",wordIds:[a.word.id]},true,{lesson:$("memorySection").value==="*"?"*":"section:"+$("memorySection").value});
    $("pairsFound").textContent = g.matches.size;
    runtime.state.games.memory = (runtime.state.games.memory || 0) + 1;
    save();
    say(a.word.hanzi);
    g.open = [];
    drawBoard();
    if (g.matches.size === g.pairs) {
      g.finished = true;
      recordPracticeSession(runtime.state,{id:g.sessionId,activity:"matching",lesson:$("memorySection").value==="*"?"*":"section:"+$("memorySection").value,date:new Date().toISOString(),correct:g.pairs,wrong:g.tries-g.pairs,completed:true});
      recordResult("memory", {
        correct: g.pairs,
        wrong: g.tries - g.pairs,
        players: g.players,
      });
      $("memoryScores").textContent = g.players
        .map((p) => p.name + ": " + p.score)
        .join(" · ");
      $("gameFeedback").textContent =
        "Complete! " +
        g.tries +
        " attempts. Winner(s): " +
        g.players
          .filter((p) => p.score === Math.max(...g.players.map((x) => x.score)))
          .map((p) => p.name)
          .join(", ");
      $("turnClock").textContent = "Finished";
    } else memoryTurn();
  } else {
    for(const word of [a.word,b.word])recordPracticeAttempt(runtime.state,{id:'matching:'+word.id,type:'matching',wordIds:[word.id]},false,{lesson:$("memorySection").value==='*'?'*':'section:'+$("memorySection").value});
    markError(a.word);markError(b.word);
    const epoch = runtime.gameEpoch;
    runtime.gameDelay = setTimeout(() => {
      if (epoch !== runtime.gameEpoch || g !== runtime.gameState) return;
      stopTimers();
      g.turn = (g.turn + 1) % g.players.length;
      memoryTurn();
    }, 650);
  }
}
