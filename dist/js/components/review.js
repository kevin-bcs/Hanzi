/** Hanzi Daily module: components/review.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { save } from "../services/storage.js";
import { day } from "../utils.js";
import { group } from "./content-selectors.js";
import { todayCount, updateStats } from "./progress-view.js";

export function chooseDue() {
  let pool = group("studyFilter")
    .filter((w) => (w.due || 0) <= Date.now())
    .sort((a, b) => (a.due || 0) - (b.due || 0));
  let next = pool.find((w) => !runtime.skipped.has(w.id));
  if (!next && pool.length) {
    runtime.skipped.clear();
    next = pool[0];
  }
  return next || null;
}

export function renderCard() {
  runtime.current = chooseDue();
  runtime.shown = false;
  $("flashHint").textContent = "Think of the meaning, then tap to reveal";
  updateStats();
  $("flashAnswer").classList.add("hidden");
  $("rateControls").classList.add("hidden");
  $("showControls").classList.remove("hidden");
  $("studyFeedback").textContent = "";
  if (!runtime.current) {
    $("flashHanzi").textContent = "完成";
    $("flashPinyin").textContent = "";
    $("flashMeaning").textContent = group("studyFilter").length
      ? "All caught up"
      : "No words in this section yet";
    $("flashExample").textContent = "Choose another section or add vocabulary.";
    $("studysection").textContent = "Session complete";
    $("flashAnswer").classList.remove("hidden");
    $("showControls").classList.add("hidden");
    $("speakCard").disabled = true;
    return;
  }
  $("speakCard").disabled = false;
  $("studysection").textContent = runtime.current.section || "My words";
  $("flashHanzi").textContent = runtime.current.hanzi;
  $("flashPinyin").textContent = runtime.current.pinyin;
  $("flashMeaning").textContent = runtime.current.meaning;
  $("flashExample").textContent = runtime.current.example || "";
  document.querySelectorAll("[data-rate]").forEach((b) => {
    const kind = b.dataset.rate;
    const days =
      kind === "good"
        ? Math.max(1, (runtime.current.interval || 0) * 2)
        : Math.max(3, (runtime.current.interval || 0) * 3);
    b.textContent =
      kind === "again"
        ? "Again · 1 min"
        : (kind === "good" ? "Got it" : "Easy") + " · " + days + " days";
  });
}

export function revealCard() {
  if (!runtime.current) return;
  runtime.shown = true;
  $("flashAnswer").classList.remove("hidden");
  $("showControls").classList.add("hidden");
  $("rateControls").classList.remove("hidden");
  $("flashHint").textContent = "How well did you remember it?";
}

export function rate(v) {
  if (!runtime.current || !runtime.shown) return;
  if (v === "again") runtime.current.errors = (runtime.current.errors || 0) + 1;
  let interval =
    v === "again"
      ? 0
      : v === "good"
        ? Math.max(1, (runtime.current.interval || 0) * 2)
        : Math.max(3, (runtime.current.interval || 0) * 3);
  runtime.current.interval = interval;
  runtime.current.due =
    Date.now() + (v === "again" ? 60000 : interval * 86400000);
  runtime.state.days[day()] = todayCount() + 1;
  save();
  renderCard();
}
