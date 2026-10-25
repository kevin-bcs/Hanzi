# dist/js/app.js
Composition root. Imports feature contracts and binds UI events only after module initialization.
 * Initialization order is intentionally retained to preserve saved-data migration and event behavior.

# dist/js/components/content-selectors.js
Hanzi Daily module: components/content-selectors.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/components/lesson-view.js
Hanzi Daily module: components/lesson-view.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/components/progress-view.js
Hanzi Daily module: components/progress-view.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/components/review.js
Hanzi Daily module: components/review.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/components/vocabulary-view.js
Hanzi Daily module: components/vocabulary-view.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/config/constants.js
Hanzi Daily module: config/constants.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/data/lessons.js
Hanzi Daily module: data/lessons.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/data/phonetics.js
Curated syllables, not free initial/final concatenations. y/w are orthographic categories; see PHONETICS.md.

# dist/js/data/vocabulary.js
Hanzi Daily module: data/vocabulary.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/games/game-engine.js
Shared lifecycle only. Epoch guards and timer cleanup prevent stale callbacks from scoring another round.

# dist/js/games/initials-finals.js
Hanzi Daily module: games/initials-finals.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/games/memory.js
Local multiplayer: a correct pair keeps the turn; misses/timeouts pass it. Same-selection restart must preserve word IDs.

# dist/js/games/quick-choice.js
Hanzi Daily module: games/quick-choice.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/games/tone-drill.js
Hanzi Daily module: games/tone-drill.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/navigation/router.js
Hanzi Daily module: navigation/router.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.

# dist/js/services/audio.js
Shared device Mandarin audio. Speech synthesis quality and autoplay depend on the browser; keep manual replay available.

# dist/js/services/lesson-import.js
Validate first, transform second, persist atomically. IDs must never silently overwrite another meaning.

# dist/js/services/storage.js
Persistence contract: keep hanzi-daily-v1 and all backup fields compatible. Restoration is explicit and snapshot-protected.

# dist/js/state/app-state.js
Shared mutable application/session bindings. No persistence happens here.
 * Bootstrap initializes these in the original order; services own storage writes.
 * Game fields retain their existing names for compatibility during this behavior-preserving refactor.

# dist/js/utils.js
Hanzi Daily module: utils.js. Public exports are consumed through explicit imports; mutable session state lives in app-state.js.
