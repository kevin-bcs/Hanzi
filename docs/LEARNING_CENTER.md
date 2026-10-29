# Learning Center — Phase 1

The catalog uses `foundation` lessons from the generated content source. Current content contains Lessons 1–5; add the remaining lessons later without changing UI components. All Lessons includes the full saved collection, including additional pronunciation content and personal words.

Edit `content/lessons/*.json` and `content/vocabulary/vocabulary.json`, then run `npm run build:content`. See HOW_TO_ADD_LESSONS.md. Keep existing IDs. Future foundation lessons are discovered automatically; filenames do not determine lesson numbering.

`dist/js/learning/model.js` provides pure lesson selection, activity eligibility and viewed-progress calculations. `center.js` connects the catalog to existing Learn, Review and game settings. Selection is session state only. The existing local storage key, backup format and review schedules are unchanged. Viewed progress remains distinct from the mastery and activity completion added in Phase 5.

Multiple Choice requires four distinct meanings. Matching requires three distinct pairs under the existing game rules. Activities launch into their own existing configuration screens; changing a section there explicitly changes the selection. Initials & Finals and Readings remain independent until later phases supply lesson-linked content.

Local verification: `npm run check`, `node tests/learning.test.cjs`, `npm test`. Visual layout, touch/keyboard interaction and device audio require manual browser review. No browser automation is used.

Later phases add shared question evaluation/history, validated sentence exercises, advanced activities and mastery/SRS without duplicating vocabulary. No placeholder activities or invented Lessons 6–7 are included.

## Phases 2, 3 and 4

All 15 activity entries are available from each lesson's **All 15 activities** menu. The engines reuse vocabulary references; they do not maintain separate word lists. Picture activities are disabled where no suitable illustration exists. Homophones such as 他/她 are excluded from audio-to-hanzi questions and ambiguous pinyin matching. Multiple Choice needs four distinct, non-equivalent meanings in the selected pool. Distractors prefer the same category and never borrow words from another lesson.

- Phase 2: Multiple Choice, the existing Memorama with three additional representation pairs and 6/8/10/12 pairs where available, Listening, Word Bank, Fill in the Blanks, and bidirectional Translation. Typed translation accepts explicitly defined alternatives; Chinese answers may use character arrangement.
- Phase 3: Dictation (hanzi, tone-marked pinyin, character arrangement), Speaking with optional browser recognition and manual reflection, local Picture Vocabulary, five short readings in the existing Interactive Reader, and five interactive scenarios. Reader alignment, visibility, dictionary, audio and comprehension are reused. Twenty authored sentences provide four examples per lesson. Sentence examples are labeled as independent examples, not fabricated conversations. Speaking transcriptions are approximate text comparisons; **tones are not graded**. Reflection results are excluded from objective accuracy.
- Phase 4: Roleplay with explicit success/recovery branches, Mistake Review, 30/60/90-second or untimed challenges, and Personalized Practice mixing recognition, listening, translation, writing and reading. Personalized practice ranks existing due dates and error history, then interleaves skills. Phase 5 below adds mastery estimation, XP, achievements and the expanded skill-specific SRS.

### Editable content

`content/exercises/sentences.json` contains authored sentences: `id`, stable `lesson` ID, ordered vocabulary `tokens`, exact Chinese `text` including punctuation, natural `english`, explicit `accepted` translations, zero-based `blank` index and an educational `explanation`. Tokens must all belong to that lesson. The same sentence source powers builders, blanks, reading alignment and scenarios; Chinese is not assembled from random words.

Example:

```json
{
  "id": "first-pen",
  "lesson": "section:Lesson 1 · First words",
  "tokens": ["v2", "v6", "v11"],
  "text": "她买笔。",
  "english": "She buys a pen.",
  "accepted": ["She buys a pen.", "She buys pens."],
  "blank": 1,
  "explanation": "买 means buy; 卖 means sell. Keep the subject before the verb."
}
```

`content/exercises/scenarios.json` has `id`, `lesson`, `title`, English `context`, `start`, and `nodes`. Each decision node has an `id`, `speaker`, target `sentence` ID, English `prompt`, and `options`. Each option references an existing `sentence`, a boolean `correct`, and a `next` node ID (or `null` to finish). Exactly one option is correct. Recovery nodes contain a `sentence`, `explanation` and `next`; they do not score the learner again. Cycles, unreachable nodes and references to other lessons are rejected. The current scenarios cover school, meeting friends, a study café, a classroom and shopping/dates; expand the files for additional situations.

Run `npm run build:content`. `scripts/build-exercises.js` validates everything with `learning/content-validator.js` and generates `dist/js/data/generated-exercises.js`, including aligned reader objects. Never edit generated files manually. No additional component registration is needed for a future lesson with appropriate sentence/scenario data.

### Persistence and lifecycle

`state.practice` is an additive version-1 schema under the **existing** local storage key, containing bounded per-question `items`, activity `settings` and up to 200 `sessions`. Attempts include correct/incorrect/assisted counts, word references, activity, selection and dates. Previously existing `word.errors` can seed review; no legacy progress is erased. Wrong answers wait one minute; a successful correction waits one day. A session has no repeated question IDs; explicit repeats begin new sessions. Timed questions pause their clock during audio and feedback. Missing audio never becomes an incorrect answer. Recognition and speech are canceled when navigating away.

Progress exports/restores include the additive data automatically. The existing recovery snapshots remain unchanged. Browser/device speech support, microphone permission and visual/touch behavior need manual verification; no cloud browser tests are used.

### Local checks

`npm run check` validates syntax and module references. `npm test` includes existing regression coverage and `tests/activities.test.cjs` for lesson isolation, question answers, content branches, reader structure, homophone exclusions, tone-sensitive input, mixed adaptive skills and progress cooldowns. `tests/modules.test.cjs` initializes native ES modules using a local DOM double, not a browser.

## Phase 5 — Motivation and skill-based SRS

`dist/js/learning/srs.js` stores the additive `state.learning` version-1 schema under the unchanged `hanzi-daily-v1` key. It contains lifetime XP, per-word/per-skill records, up to 400 daily ledgers, a lifetime streak counter, achievements and lesson/activity completions. Existing words, identifiers, practice history, local review dates and backups are not replaced. Before a saved collection first adopts the schema, the app keeps `hanzi-daily-v1-before-learning-v1`. There is no retroactive XP or invented mastery from old aggregate counts. Malformed new-schema backups are rejected before an atomic restore.

### Scheduling

Recognition, listening, hanzi writing and contextual comprehension have separate records. Tone-marked pinyin dictation is listening evidence; arranging supplied characters is recognition rather than independent writing. Speech transcripts and self-ratings do not provide objective phonetic or mastery evidence.

An unassisted review that is due advances one stage: **1, 3, 7, 14, 30, 60, 90 days**, capped at 90. An incorrect answer resets the stage and returns in one minute. Only one credit per word/skill/calendar day advances the schedule. An immediate correction after a failure cannot earn XP or mastery; it moves a due item to tomorrow without advancing its stage. Early correct repeats do not push a future scheduled review farther away. Hinted responses and speaking reflections leave objective schedules unchanged.

The old self-rated flashcard schedule remains operational and separate. Its future recognition date is respected when a word first gains a recognition record. Personalized Practice combines the existing due/error history with skill due dates, prioritizes overdue and near-due reviews, and interleaves question types.

### Mastery and progress

Each skill estimate combines credited success count (five for full evidence), accuracy, spacing over at least seven days and overdue decay. A failed stage immediately reduces its estimate. Word mastery averages recognition/listening/writing, with unseen skills contributing zero. A mastered label requires at least two secure skills, a total of at least 70%, spaced evidence and no unresolved failure in a practiced core skill. Context scores appear separately and never imply knowledge of a whole word on their own. These are local learning estimates, not proficiency certification.

Lesson learning progress averages vocabulary mastery and completion of currently available activities. The UI shows both components and viewed words separately. An activity counts as completed only after a completed round with at least three responses. Opening or abandoning an activity does not count; a shorter partial result remains in history. All Lessons has its own activity completion scope.

### XP, streaks and achievements

A due, correct, unassisted answer can earn up to **8 XP per question**, divided across its word references, with a **120 XP daily cap**. The same word/skill cannot earn XP twice on the same day, even through a different game. Wrong answers, skipped items, early repeats, hints, speaking reflections and self-rated flashcards award no XP. Existing Quick Choice and Memorama share this evidence path. Initials & Finals and Tone Drill keep their independent scoring; they do not establish whole-word mastery.

Daily practice opens a five-question adaptive session. Active attempts and reflections count different practiced words toward a five-word goal; at least three different words qualify a streak day. Simply opening lessons/readings does not qualify. The local device calendar defines days; streak comparisons use calendar dates, and a separate counter preserves streaks beyond the rolling daily ledger. Achievements recognize the first scheduled correct answer, a daily five-word goal, a three-day streak, practice across three core skills and a first mastered word. No extra XP is awarded for repeatedly completing easy rounds.

## Phase 6 — UI, accessibility and performance

`dist/css/learning.css` owns Learning Center components using the existing color/font tokens. The home and Progress dashboards show XP, streak, daily goal, due skills and achievements. Lesson cards provide three clear actions rather than repeated game menus. Mobile navigation scrolls horizontally, controls retain touch sizes, inputs avoid tiny mobile text, wide progress tables have an accessible scroll region, and reduced-motion preferences disable transitions. A skip link, current-page navigation state, managed headings, language annotations and live feedback improve keyboard/screen-reader use.

Availability checks reuse shared pools rather than constructing fifteen complete sessions per menu. Images remain local and lazy-loaded. No frameworks, external fonts, backend, account system or remote sync were introduced.

Local verification adds `tests/srs.test.cjs`: intervals, lapses/decay, daily credit limits, XP caps, assisted exclusions, multi-skill evidence, streak rollover, lesson completion, legacy preservation, backup validation and UI asset contracts. Native module tests cover dashboard integration and the daily-practice entry point. Visual layout, real touch/keyboard behavior, microphone and device speech remain for manual verification.
