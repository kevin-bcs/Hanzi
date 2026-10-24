# Initials & Finals implementation notes

Scope: only the former Initials & Tones activity was replaced. Existing vocabulary, lessons and other game mechanics remain unchanged.

Inventory: 23 written onset categories (21 consonant initials plus orthographic y/w); 36 commonly taught finals. ui/iu/un denote uei/iou/uen; ü-family spellings after j/q/x/y are explicitly mapped through example data, not inferred by slicing letters. Special apical realizations of i in zi/ci/si/zhi/chi/shi/ri are not treated as the high-front i final.

Examples are explicit hanzi/pinyin pairs. Speech uses the existing Mandarin device voice and speaks the example character, never a Latin letter string. These are synthetic syllable examples, not recordings of isolated consonants. Tone variation chooses among the listed valid examples; it does not manufacture syllables or character readings. Expert is disabled pending validated recordings. No audio assets are claimed or invented.

The request refers to a phonetic reference document, but no separate identifiable full inventory was provided. This release uses a conventional teaching inventory; matching a specific classroom chart remains pending if it uses different categories (for example ê or special i variants).

Reference tables used to cross-check syllable combinations and spelling conventions:
- https://studycli.org/pinyin-chart/
- https://pinyin.info/rules/initials_finals.html

Distractors: Beginner prioritizes distant categories; Intermediate combines one close confusable with shared articulation classes; Advanced uses the curated three nearest categories. Expert is intentionally unavailable with unvalidated TTS.

Results use sounds-initials / sounds-finals, separately from legacy initials and Tone Drill. Legacy records are retained. Coverage counts guide future selection; rounds cycle through all eligible sounds before repeating. Missed-sound practice restricts targets to actual misses but keeps four options from the full modality inventory.

Checks: node --check dist/app.js; node tests/regression.cjs. No cloud-browser testing performed for this update. Real audio and mobile rendering must be checked by the user.
