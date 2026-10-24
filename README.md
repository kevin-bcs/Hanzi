# Hanzi Daily — Proyecto editable

## Ejecutar localmente
Desde la carpeta del proyecto ejecuta:

    python -m http.server 8000 --directory dist

Abre http://localhost:8000 en tu navegador. En Windows también puedes usar `py` en lugar de `python`.

## Archivos
- dist/index.html: estructura y estilos CSS.
- dist/app.js: vocabulario, navegación, juegos, audio y guardado.
- tests/regression.cjs: pruebas de lógica con Node.js.
- .openai/hosting.json: configuración del sitio de origen; no es necesaria para ejecutar localmente.

## Pruebas
Con Node.js instalado, desde la raíz:

    node --check dist/app.js
    node tests/regression.cjs

## Publicar en Vercel
Importa el repositorio como sitio estático (Other), sin comando de compilación y con directorio de salida `dist`.

## Límites actuales
Esta versión guarda el avance en localStorage. No incluye registro de usuarios, base de datos ni sincronización. El audio depende de las voces mandarinas del dispositivo. El progreso personal del navegador no está incluido: expórtalo desde Vocabulary > Export backup antes de cambiar de dominio.

Este repositorio contiene el código recuperado del repositorio del sitio, sin credenciales ni la carpeta interna .git. Exportado desde el proyecto original de Sites.
