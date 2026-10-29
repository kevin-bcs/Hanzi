# Learning Center — Phase 1

The catalog uses `foundation` lessons from the generated content source. Current content contains Lessons 1–5; add the remaining lessons later without changing UI components. All Lessons includes the full saved collection, including additional pronunciation content and personal words.

Edit `content/lessons/*.json` and `content/vocabulary/vocabulary.json`, then run `npm run build:content`. See HOW_TO_ADD_LESSONS.md. Keep existing IDs. Future foundation lessons are discovered automatically; filenames do not determine lesson numbering.

`dist/js/learning/model.js` provides pure lesson selection, activity eligibility and viewed-progress calculations. `center.js` connects the catalog to existing Learn, Review and game settings. Selection is session state only. The existing local storage key, backup format and review schedules are unchanged. Viewed progress is not mastery or activity completion.

Multiple Choice requires four distinct meanings. Matching requires three distinct pairs under the existing game rules. Activities launch into their own existing configuration screens; changing a section there explicitly changes the selection. Initials & Finals and Readings remain independent until later phases supply lesson-linked content.

Local verification: `npm run check`, `node tests/learning.test.cjs`, `npm test`. Visual layout, touch/keyboard interaction and device audio require manual browser review. No browser automation is used.

Later phases add shared question evaluation/history, validated sentence exercises, advanced activities and mastery/SRS without duplicating vocabulary. No placeholder activities or invented Lessons 6–7 are included.
