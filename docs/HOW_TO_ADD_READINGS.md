# Añadir lecturas

## Flujo rápido
1. Copia `content/readings/templates/reading-template.json` a una carpeta de nivel (beginner, elementary, intermediate o advanced).
2. Cambia `id`, título inglés, título chino y descripción. La categoría debe existir en `categories.json`.
3. Declara los participantes con ID único y nombre visible.
4. Escribe las intervenciones en orden: `order` consecutivo desde 1, `speaker` existente y `id` único.
5. Conserva exactamente el texto chino en `text`, incluidos los signos. La concatenación de `units[].hanzi` debe reconstruirlo.
6. En cada palabra, escribe pinyin con marcas tonales y espacios entre sílabas; `gloss` es el significado contextual de la palabra completa. No traduzcas artificialmente cada carácter.
7. `alignment` vincula cada carácter con su sílaba. Erhua como 哪儿/nǎr se puede mantener en una sola unidad de alineación. No elimines 儿 para forzar la longitud.
8. Representa la puntuación con `kind: "punctuation"`, pinyin y glosa vacíos, alineación vacía. Las partículas tienen pinyin y glosa funcional; los nombres propios también son palabras con pinyin.
9. Agrega entre 3 y 5 preguntas, o elimina `questions` si no hay evaluación. `answer` es el índice correcto desde cero; `evidence` contiene IDs de intervenciones que justifican la respuesta. Incluye una explicación.
10. Ejecuta `npm run build:content`. Los errores indican archivo y campo; si hay errores no se reemplaza el catálogo anterior.
11. Ejecuta `npm run check` y `npm test`. Después abre `npm start` y comprueba la lectura manualmente.

No edites `dist/content/readings.json`: es un artefacto generado. No registres archivos manualmente en JavaScript ni HTML. El script descubre recursivamente todos los JSON de contenido, excepto categories.json y templates.

## Ejemplo de una unidad
```json
{"hanzi":"你好","pinyin":"nǐ hǎo","gloss":"hello","kind":"word","alignment":[{"hanzi":"你","pinyin":"nǐ"},{"hanzi":"好","pinyin":"hǎo"}]}
```
La plantilla es un ejemplo COMPLETO, ejecutable y validado, con participantes, cuatro intervenciones y tres preguntas. Para otro ejemplo completo de nivel intermedio, consulta `intermediate/university-project.json`.

## Audio
El lector usa la voz mandarín del dispositivo y pronuncia solo hanzi. La velocidad y la calidad varían por navegador. La reproducción completa avanza con el evento de fin de cada intervención; no promete sincronización palabra por palabra. Pausa/reanudación se ofrecen mediante las capacidades de SpeechSynthesis y deben comprobarse en el dispositivo. Si no hay voz, la lectura sigue accesible con un aviso. Se cancelan sesiones anteriores al navegar o cambiar de reproducción.
El campo opcional audio está reservado como referencia validada de contenido; esta versión del reproductor usa síntesis, no grabaciones externas. No declares archivos inexistentes como si fueran grabaciones disponibles.

## Progreso y ayudas
Se almacena dentro de `state.readings`, incluido en los respaldos existentes. Abrir una lectura registra visita; solo el botón explícito marca finalización. Se conserva posición, modo, preferencias de visibilidad, ayudas y último resultado. En Challenge revelar ayudas o consultar detalles incrementa el contador; las ayudas no cambian retroactivamente una respuesta de comprensión.

## Revisión humana
La validación comprueba estructura y consistencia, no puede certificar la corrección semántica de una traducción o la precisión fonética de una voz. Revisa contenido y audio antes de distribuir nuevas lecturas. Categorías sin conversaciones iniciales aparecen en el filtro y muestran un estado vacío.
