# Fuente editable de lecturas
Edita únicamente los JSON bajo readings. Ejecuta npm run build:content para regenerar dist/content/readings.json. Consulta docs/HOW_TO_ADD_READINGS.md. El vocabulario general sigue en dist/js/data/vocabulary.js: no se ha creado una copia duplicada.

Learning Center activities use authored sentences and branching scenarios in `content/exercises/`. Run `npm run build:content` to validate and regenerate all catalogs. See `docs/LEARNING_CENTER.md` for the exercise schema and examples. Vocabulary remains a single source in `content/vocabulary/vocabulary.json`.
