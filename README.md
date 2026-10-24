# Hanzi Daily

Plataforma de aprendizaje de chino mandarín. Código de la versión publicada en Sites: `f1a7a86e22be656a4327ef1f94a22dd327e3e646`.

## Ejecutar y editar
Requiere Python 3 para servir los archivos; no requiere instalar paquetes.
```bash
python -m http.server 8000 --directory dist
```
Abre http://localhost:8000. En Windows puedes usar `py` en lugar de `python`.

## Funciones
- Home → Learn: niveles, lecciones, vocabulario y frases.
- Memorama: hanzi ↔ pinyin + inglés, 6–100 tarjetas según contenido, multijugador local, turnos opcionales de 5 segundos. Restart conserva las palabras; Restart all genera otra selección.
- Quick choice: pinyin opcional, dificultad por longitud, tiempo configurable y resultados.
- Tone Drill: audio automático, evaluación por sílaba y resultados.
- Initials & Finals: banco independiente de 23 categorías iniciales y 36 finales, cuatro opciones, dificultad progresiva, explicaciones articulatorias, resultados por sonido y práctica de errores.
- Content tools: importación JSON validada, confirmación, niveles y lecciones dinámicos.
- Progress y exportación/restauración de copias completas con ediciones y eliminaciones.

## Archivos
- `dist/index.html`: interfaz y estilos.
- `dist/app.js`: datos y lógica de aplicación.
- `dist/lesson-template.json`: plantilla para importar contenido.
- `tests/regression.cjs`: pruebas de lógica sin navegador.
- `PHONETICS.md`: inventario, audio, referencias y límites del juego fonético.
- `.openai/hosting.json`: metadatos del sitio original; no necesario para servir localmente.

## Pruebas
Requiere Node.js moderno:
```bash
node --check dist/app.js
node tests/regression.cjs
```
Cubren conservación del vocabulario, respaldos, importación atómica, reinicios, turnos, temporizadores, respuestas duplicadas, resultados y banco fonético. No sustituyen la comprobación manual de audio e interfaz.

## Importación de contenido
Desde Content tools descarga la plantilla, edítala y selecciona el JSON. Revisa los resultados y confirma.
Formato: `levels`, `lessons`, `items`. Los registros incluyen `id`, `level`, `lesson`, `hanzi`, `pinyin`, `meaning`; admiten `tones`, `type`, `category`, `difficulty`, `audio`. Se aceptan los alias españoles implementados en el validador. Separa las sílabas del pinyin con espacios. No se sobrescriben silenciosamente IDs existentes.

## Almacenamiento y audio
Todo el progreso y contenido importado se guarda en el navegador; no hay cuentas ni sincronización. Content tools no es un administrador seguro.
Exporta el respaldo antes de cambiar de dominio. Restaurar reemplaza la colección y progreso con el archivo, conservando una instantánea previa recuperable.
La pronunciación usa la voz mandarín disponible en el dispositivo; no hay garantía de precisión fonética. Expert permanece deshabilitado hasta disponer de grabaciones validadas. Véase PHONETICS.md.

## Vercel (opcional, aún no conectado)
Importa este repositorio como `Other`, sin comando de compilación, con directorio de salida `dist`. La publicación en Vercel no agrega cuentas ni base de datos.

## Seguridad
No subas contraseñas, tokens, archivos .env ni respaldos personales a este repositorio público.
