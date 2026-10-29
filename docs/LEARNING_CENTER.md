# Learning Center — Phase 1

The catalog uses `foundation` lessons from the generated content source. Current content contains Lessons 1–5; add the remaining lessons later without changing UI components. All Lessons includes the full saved collection, including additional pronunciation content and personal words.

Edit `content/lessons/*.json` and `content/vocabulary/vocabulary.json`, then run `npm run build:content`. See HOW_TO_ADD_LESSONS.md. Keep existing IDs. Future foundation lessons are discovered automatically; filenames do not determine lesson numbering.

`dist/js/learning/model.js` provides pure lesson selection, activity eligibility and viewed-progress calculations. `center.js` connects the catalog to existing Learn, Review and game settings. Selection is session state only. The existing local storage key, backup format and review schedules are unchanged. Viewed progress is not mastery or activity completion.

Multiple Choice requires four distinct meanings. Matching requires three distinct pairs under the existing game rules. Activities launch into their own existing configuration screens; changing a section there explicitly changes the selection. Initials & Finals and Readings remain independent until later phases supply lesson-linked content.

Local verification: `npm run check`, `node tests/learning.test.cjs`, `npm test`. Visual layout, touch/keyboard interaction and device audio require manual browser review. No browser automation is used.

Later phases add shared question evaluation/history, validated sentence exercises, advanced activities and mastery/SRS without duplicating vocabulary. No placeholder activities or invented Lessons 6–7 are included.

## Phases 2, 3 and 4

All 15 activity entries are available from each lesson's **All 15 activities** menu. The engines reuse vocabulary references; they do not maintain separate word lists. Picture activities are disabled where no suitable illustration exists. Homophones such as 他/她 are excluded from audio-to-hanzi questions and ambiguous pinyin matching. Multiple Choice needs four distinct, non-equivalent meanings in the selected pool. Distractors prefer the same category and never borrow words from another lesson.

- Phase 2: Multiple Choice, the existing Memorama with three additional representation pairs and 6/8/10/12 pairs where available, Listening, Word Bank, Fill in the Blanks, and bidirectional Translation. Typed translation accepts explicitly defined alternatives; Chinese answers may use character arrangement.
- Phase 3: Dictation (hanzi, tone-marked pinyin, character arrangement), Speaking with optional browser recognition and manual reflection, local Picture Vocabulary, five short readings in the existing Interactive Reader, and five interactive scenarios. Reader alignment, visibility, dictionary, audio and comprehension are reused. Twenty authored sentences provide four examples per lesson. Sentence examples are labeled as independent examples, not fabricated conversations. Speaking transcriptions are approximate text comparisons; **tones are not graded**. Reflection results are excluded from objective accuracy.
- Phase 4: Roleplay with explicit success/recovery branches, Mistake Review, 30/60/90-second or untimed challenges, and Personalized Practice mixing recognition, listening, translation, writing and reading. Personalized practice ranks existing due dates and error history, then interleaves skills. Full mastery estimation, XP, achievements and the expanded skill-specific SRS remain Phase 5.

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
