/** Shared device Mandarin audio. Speech synthesis quality and autoplay depend on the browser; keep manual replay available. */
import { runtime } from "../state/app-state.js";
import { $ } from "../config/constants.js";

export function audioMessage(message) {
  $("audioStatus").textContent = message;
  $("audioStatus").classList.toggle("hidden", !message);
}

export function chineseVoice() {
  return (
    window.speechSynthesis
      ?.getVoices()
      .find((v) => /^zh[-_](CN|Hans)/i.test(v.lang)) ||
    window.speechSynthesis?.getVoices().find((v) => /^zh/i.test(v.lang))
  );
}

export function say(text) {
  if (!("speechSynthesis" in window) || !chineseVoice()) {
    audioMessage(
      "No Chinese voice is available. Enable a Mandarin voice in your device’s text-to-speech settings, then reload. You can still practice with text.",
    );
    return false;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.split("/")[0].trim());
  u.voice = chineseVoice();
  u.lang = u.voice.lang;
  u.rate = 0.82;
  u.onerror = (e) => {
    if (!["canceled", "interrupted"].includes(e.error))
      audioMessage(
        "Audio could not play. Check your device’s sound and Mandarin voice settings.",
      );
  };
  audioMessage("");
  speechSynthesis.speak(u);
  return true;
}

export function playLearningWord() {
  const w = runtime.learningWords[runtime.learningAt];
  if (!w) return;
  if (w.audio) {
    if (window.lessonAudio) window.lessonAudio.pause();
    window.lessonAudio = new Audio(w.audio);
    window.lessonAudio
      .play()
      .catch(() =>
        audioMessage(
          "Recorded audio could not play. Use the device voice button.",
        ),
      );
  } else say(w.hanzi);
}
