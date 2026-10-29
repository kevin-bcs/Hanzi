# Hanzi Daily — arquitectura modular

Base: 9ecae39e039ab604562deb7b8b5bf9fcf8b70aa1. Solo revisión; no desplegado.

## Ejecutar en Windows o Linux
Instala Node.js 20 o superior. No hay dependencias de ejecución ni instalación de paquetes.

    npm start

Abre http://localhost:8000. Alternativa: `py -m http.server 8000 --directory dist` en Windows, o `python3 -m http.server 8000 --directory dist`.
No abras index.html mediante file://: usa un servidor para los módulos ES.

## Comprobar

    npm run check
    npm test

Las pruebas cubren lógica y enlace real de módulos ES en Node, con DOM/audio simulados. No se usó navegador de la nube. Quedan para revisión manual: diseño móvil/escritorio, reproducción real y políticas de autoplay del dispositivo.

## Organización
- dist/index.html: estructura sin estilos ni lógica incrustados.
- dist/css/main.css: estilos originales, en el mismo orden.
- dist/js/app.js: composición, inicialización y eventos.
- config: constantes y clave de almacenamiento.
- data: vocabulario, lecciones y fonética.
- services: audio, persistencia e importación JSON.
- components: vistas de lección, progreso, vocabulario y repaso.
- games: motor compartido y un módulo por juego.
- navigation: rutas y ciclo de vida.
- state: estado mutable explícito compartido; conserva los campos de sesión originales.
- tests: regresiones y comprobación del grafo de módulos.

Los módulos importan sus contratos de forma explícita. Las dependencias circulares de navegación/vistas se resuelven mediante funciones; la inicialización se mantiene en la raíz de composición. No se introdujeron frameworks ni backend. Separar aún más los controladores y las vistas es una ampliación futura, no necesaria para ejecutar esta versión.

El almacenamiento conserva hanzi-daily-v1, respaldos y snapshots. Los datos siguen siendo locales. Audio por síntesis del dispositivo; Expert sigue deshabilitado. Véase PHONETICS.md.

## Revisión manual
Home → Learn → lección → Play. Completar cada juego, verificar ambos reinicios del memorama y turnos; importar la plantilla y un JSON inválido; exportar/restaurar cambios y eliminaciones; comprobar móvil, audio y replays.

## Despliegue futuro
Solo tras aprobación: servir dist como sitio estático. No hay compilación. Mantener las rutas relativas y MIME JavaScript. Esta entrega no modifica la página publicada.

## Readings 3.0
Seis conversaciones y trece categorías; lector modular, modos Guided/Practice/Challenge y comprensión. Fuente editable: content/readings. Regenerar: `npm run build:content` (también se ejecuta antes de npm start). Documentación: docs/HOW_TO_ADD_READINGS.md. No se ha desplegado ni sincronizado esta entrega con GitHub.

## Gestión de lecciones
Editar content/lessons y content/vocabulary. Ejecutar npm run build:content. Guía: docs/HOW_TO_ADD_LESSONS.md. Ya no se importan lecciones JSON desde la interfaz; los respaldos de progreso continúan en Vocabulary.
