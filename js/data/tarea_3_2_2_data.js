// tarea_3_2_2_data.js — Tarea 2: Detective de Datos en el Directorio
// Unidad 3.2 — Sesión 2: Exploración, diagnóstico de errores y estrategias (30 min, solo lectura).

const tarea_3_2_2_data = {
    id: 'tarea-3-2-2',
    title: 'Tarea 2: Detective de Datos en el Directorio',
    subtitle: 'MongoDB Atlas — explorar con preguntas, descubrir errores reales y acordar soluciones',
    sessionId: '3-2-2',
    sessionLabel: 'Presentación de la Sesión 3.2.2',

    doText: 'Hacerle preguntas a la colección compartida <code>perfiles</code> mediante consultas para <strong>descubrir y demostrar qué problemas reales quedaron en los datos</strong>, y proponer 3 acuerdos para que no se repitan. <strong>Hoy solo consultamos: no modifiques ni borres nada.</strong>',
    deliverText: 'Un <strong>PPT simple con capturas de pantalla</strong> donde se vean tus consultas ejecutadas, sus resultados y tus hallazgos, enviado por mensaje en <strong>AVA</strong> al docente <strong>Carlos Orellana</strong>, con copia al correo.',
    meta: [
        { icon: 'ph-user', label: 'Individual' },
        { icon: 'ph-clock', label: '30 minutos de práctica' },
        { icon: 'ph-magnifying-glass', label: 'Solo lectura (no borrar ni editar)' },
        { icon: 'ph-seal-warning', label: 'Sin nota (evidencia de trabajo)' }
    ],

    help: 'En la presentación de la Sesión 3.2.2 analizamos cada uno de estos casos y cómo preguntárselos a MongoDB. Revísala si tienes dudas.',

    connection: {
        user: 'user_bd_cv_todas_las_secciones',
        host: 'sandboxprofecarlos.msifp5s.mongodb.net',
        uri: 'mongodb+srv://user_bd_cv_todas_las_secciones:<db_password>@sandboxprofecarlos.msifp5s.mongodb.net/',
        database: 'directorio_talento',
        collection: 'perfiles',
        note: 'Usa la misma conexión de la clase anterior. Recuerda no mostrar tu clave en las capturas.'
    },

    firstNote: 'Importante: hoy solo hacemos consultas de lectura para que todos tus compañeros encuentren los mismos 71 documentos. Si quieres probar borrados o ediciones por tu cuenta, hazlo en tu propio cluster personal.',

    missions: [
        {
            id: 'm1', title: '¿Cuántos documentos hay realmente y de quiénes son?',
            what: 'Pregunta a la base de datos cuántos documentos existen en total en <code>perfiles</code>, cuántos pertenecen a cada sección (<code>003D</code> y <code>004D</code>) y cuál es la lista sin repeticiones de los nombres (<code>alumno</code>) registrados.',
            evidence: 'Tus consultas ejecutadas y los totales/listas devueltos en el Playground.'
        },
        {
            id: 'm2', title: '¿Quiénes quedaron repetidos o dejaron documentos de prueba?',
            what: 'Demuestra con una consulta cuántas veces se repitió alguno de los perfiles duplicados, y escribe otra consulta que encuentre todos los documentos cuyo nombre comience con <code>"PRUEBA"</code>.',
            evidence: 'Las dos consultas y sus resultados demostrando las copias repetidas y los registros de prueba.'
        },
        {
            id: 'm3', title: '¿Qué pasa cuando escribimos distinto la misma carrera o skill?',
            what: 'Obtén la lista de valores únicos de <code>carrera</code> o de <code>skills</code> para evidenciar que se escribió lo mismo de distintas maneras, y luego arma una consulta que logre traer juntas todas las variantes de una misma tecnología (como HTML o CSS).',
            evidence: 'La lista de valores únicos y el resultado de tu consulta que rescata todas las variantes.'
        },
        {
            id: 'm4', title: '¿A qué documentos les faltan datos o tienen nombres de campo distintos?',
            what: 'Pregunta a MongoDB qué documentos no tienen alguno de los campos básicos (como <code>alumno</code>, <code>seccion</code>, <code>carrera</code> o <code>fecha_registro</code>) o encuentra aquellos donde el nombre del campo se escribió diferente (como <code>Carrera</code>, <code>fecha-registro</code> o <code>"fecha registro"</code>).',
            evidence: 'Tus consultas y los documentos incompletos o mal nombrados que aparecieron.'
        },
        {
            id: 'm5', title: '¿Dónde se guardaron estructuras distintas o valores repetidos en exceso?',
            what: 'Muestra con una consulta cómo distintos perfiles guardaron de forma diferente campos como <code>disponibilidad</code>, <code>links</code>/<code>github</code> o <code>estudios</code>, o bien muestra el perfil donde una misma skill se agregó más de 20 veces seguidas.',
            evidence: 'Tu consulta y el resultado en pantalla donde se observe claramente la diferencia o repetición.'
        },
        {
            id: 'm6', title: '¿Qué deberíamos hacer para no volver a cometer estos errores?',
            what: 'En la última diapositiva de tu PPT, escribe con tus palabras <strong>3 acuerdos o medidas concretas</strong> que aplicarías antes de crear la colección limpia en la próxima clase para evitar que esto se repita.',
            evidence: 'Diapositiva final en tu PPT con tus 3 propuestas.'
        }
    ],

    extras: [
        { id: 'x1', title: '¿Cuál es el documento fantasma?', what: 'Encuentra el <code>_id</code> exacto del único documento de toda la colección que quedó completamente vacío (sin <code>alumno</code>, sin <code>seccion</code> y sin <code>skills</code>).' },
        { id: 'x2', title: '¿Cuál de las 27 copias es la que sí se actualizó?', what: 'En el perfil que tiene 27 copias, solo 1 de ellas recibió la actualización con <code>proyectos</code> e <code>idiomas</code>. Encuéntrala con una consulta.' },
        { id: 'x3', title: '¿Quiénes dominan dos tecnologías a la vez?', what: 'Encuentra los perfiles que tengan simultáneamente <code>"JavaScript"</code> y <code>"Python"</code> en su arreglo de <code>skills</code>, mostrando solo nombre, sección y skills.' }
    ],
    extrasNote: 'Si resuelves alguno de estos desafíos opcionales, suma su captura al final de tu PPT.',

    rules: [
        'Hoy trabajamos únicamente con consultas de lectura sobre directorio_talento.perfiles.',
        'No ejecutes insertOne, updateOne, updateMany, deleteOne, deleteMany ni drop en la colección compartida.',
        'Si quieres probar modificaciones o eliminaciones hoy mismo, conéctate a tu propio cluster personal de Atlas.',
        'Revisa que tus capturas no muestren tu contraseña.'
    ],

    delivery: {
        steps: [
            'Crea un PPT simple con tu nombre y sección en la portada.',
            'Agrega tus capturas de pantalla mostrando las consultas que ejecutaste y lo que encontraste en cada pregunta.',
            'Incluye la diapositiva final con tus 3 propuestas para que la colección de la próxima clase quede impecable.',
            'Envía el PPT por mensaje en AVA al docente Carlos Orellana, con copia a su correo.'
        ],
        checks: [
            { id: 'd1', label: 'Mi PPT incluye las capturas de mis consultas y hallazgos' },
            { id: 'd2', label: 'Incluí la diapositiva con mis 3 propuestas para evitar estos errores' },
            { id: 'd3', label: 'Envié el PPT por AVA al docente Carlos Orellana con copia al correo' }
        ]
    }
};
