# Lecciones y vocabulario desde código
1. Edita `content/vocabulary/vocabulary.json`. Cada palabra tiene un ID estable, hanzi, pinyin, english, category y example. No cambies el ID para corregir una traducción.
2. Copia `content/lessons/lesson-template.json` con otro nombre, por ejemplo `lesson-15.json`. Cambia id, title y level (foundation o extra). words contiene los IDs del vocabulario, sin duplicados.
3. Para añadir ejemplos, edita example en la palabra. Es texto visible: incluye pinyin/traducción si tu ejemplo lo necesita.
4. Para ilustraciones, coloca un SVG o WebP propio/licenciado en `dist/assets/images/vocabulary/`. Añade image (ruta relativa desde dist) e imageAlt (descripción accesible) a la palabra.
5. Ejecuta `npm run build:lessons`. El proceso valida IDs, referencias y archivos de imagen y genera `dist/js/data/generated-content.js`. No edites ese archivo a mano.
6. Para eliminar una lección del catálogo, elimina su JSON y vuelve a generar. No borres los registros del vocabulario que deban seguir disponibles en repasos u otras lecciones. La eliminación del catálogo no destruye el progreso guardado.
7. Ejecuta `npm run check`, inicia con `npm start` y publica el contenido de dist por el flujo del proyecto.

Ejemplo completo de lección:
```json
{"id":"greetings","title":"Greetings","level":"foundation","words":["v0"]}
```
Ejemplo de palabra (usar ID nuevo; añadir a la lista JSON existente):
```json
{"id":"hello-example","hanzi":"你好","pinyin":"nǐ hǎo","english":"hello","category":"expression","example":"你好！ — Hello!"}
```

Compatibilidad: los IDs v0… originales se mantienen. El contenido guardado y las ediciones personales anteriores se conservan; el catálogo de lecciones se obtiene del código. Los nuevos recursos e imágenes se incorporan al generar y publicar. Las ediciones de texto que un alumno ya tenga guardadas no se sobrescriben silenciosamente. El respaldo/restauración del progreso sigue en Vocabulary.

Optional `acceptedEnglish` is an array of explicitly reviewed English equivalents for typed translation, for example `["dad", "father"]`. It does not replace the displayed `english` gloss. The lesson builder validates this field and reuses it in Learning Center; do not put acceptable answers in UI components.
