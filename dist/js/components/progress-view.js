import {renderLearningDashboard,renderLearningDetails} from '../learning/dashboard.js';
/** Hanzi Daily module: components/progress-view.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";
import { day } from "../utils.js";

export function todayCount() {
  return runtime.state.days[day()] || 0;
}

export function updateStats() {
  renderLearningDashboard($("homeLearning"),runtime.state);
  $("wordCount").textContent = runtime.state.words.length;
  $("dueCount").textContent = runtime.state.words.filter(
    (w) => (w.due || 0) <= Date.now(),
  ).length;
  $("reviewCount").textContent = todayCount();
  $("dailyGoal").textContent =
    Math.min(todayCount(), 10) + " / 10 daily reviews";
  $("dailyBar").style.width = Math.min(todayCount() * 10, 100) + "%";
}

export function renderProgress() {
  renderLearningDetails($("learningProgress"),runtime.state);
  const seen = Object.keys(runtime.state.learned || {}).length;
  $("progressSummary").textContent =
    seen +
    " words viewed · " +
    todayCount() +
    " reviews today · data saved only in this browser.";
  $("progressRows").replaceChildren();
  for (const r of (runtime.state.results || []).slice().reverse()) {
    const p = document.createElement("p");
    p.textContent =
      new Date(r.date).toLocaleString() +
      " · " +
      r.game +
      " · " +
      (r.correct || 0) +
      " correct / " +
      (r.wrong || 0) +
      " wrong" +
      (r.assisted ? " · " + r.assisted + " with hints" : "");
    $("progressRows").append(p);
  }
}
