// quiz_formativa_3_data.js — Datos de la Evaluación Formativa N° 3
// Unidad 3 (EA3): Fundamentos NoSQL con MongoDB Atlas (Sesiones 1 a 4)
// Taller de Bases de Datos (Sin respuestas ni pauta expuesta en el repositorio)

const quiz_formativa_3_data = {
    id: 'quiz-formativa-3',
    title: 'Evaluación Formativa N° 3: MongoDB Atlas (EA3 — Sesiones 1 a 4)',
    sigla: 'BDY1103',
    courseName: 'Taller de Bases de Datos',
    badge: 'Formativa 3',
    codeLang: 'javascript',
    exportPrefix: 'Evaluacion3_MongoDB_BDY1103',
    evalTypeLabel: 'Formativa EA3: Documentos, Exploración, Operadores y CRUD en MongoDB (Sesiones 1 a 4)',
    theoryHeaderTitle: 'Parte Teórica y Pruebas en Playground: MongoDB (Sesiones 1 a 4)',
    theoryHeaderDesc: 'Conéctate a tu propio cluster en VS Code, crea la base y colecciones del bloque de prueba y responde cada sección.',
    step4ButtonLabel: '4. Diagnóstico Práctico (2)',
    timeNote: 'Puntaje total: 100 pts (Exigencia 60% = 60 pts para nota 4.0) — Sin retroalimentación en pantalla',
    simpleAuth: true,
    disableIntegrityTracking: true,
    hideSolutionsInExport: true,

    instructions: [
        '<strong>Alcance:</strong> Contenidos de la EA3 vistos en las <strong>Sesiones 1, 2, 3 y 4</strong> (Documentos, Exploración y Calidad, Operadores de Búsqueda y CRUD). No incluye Sesión 5 (<code>aggregate</code>).',
        '<strong>Trabajo obligatorio en TU PROPIO CLUSTER:</strong> Para responder las preguntas prácticas debes conectarte en VS Code a <strong>tu propio cluster de MongoDB Atlas</strong> (con tu propia cadena de conexión), creando tu propia base de datos (<code>mi_evaluacion_ea3</code>) y tus propias colecciones con el bloque de prueba incluido más abajo. No uses la base compartida del curso para que nadie altere tus resultados. <strong>No debes adjuntar capturas de pantalla</strong>.',
        '<strong>Puntaje Total (100 puntos):</strong> Parte 1: Alternativas (24 pts) · Parte 2: Selección Múltiple (12 pts) · Parte 3: Términos Pareados (12 pts) · Parte 4: V/F con Justificación (18 pts) · Parte 5: Completar Código (18 pts) · Parte 6: 2 Preguntas Cortas de Diagnóstico (16 pts).',
        '<strong>Entrega:</strong> Al finalizar se descargará un archivo <code>.md</code> con tus respuestas y los puntajes de cada ítem para su revisión docente.'
    ],

    // Bloque semilla para que cada estudiante cree su propia base y colecciones en su propio cluster
    playgroundSetupBlock: {
        title: '🧪 Script Base para TU PROPIO CLUSTER (Preguntas 4, 5, 6, 7, 8, 26 y 27)',
        description: 'Conéctate a tu propio cluster de MongoDB Atlas en VS Code, abre un Playground nuevo, pega este bloque y ejecútalo con Play (▶) para crear tu base "mi_evaluacion_ea3" y tus colecciones "perfiles_curso" y "ofertas_ti".',
        code: `use('mi_evaluacion_ea3');

// Limpieza inicial (puedes volver a correr este bloque si necesitas reiniciar tus datos)
db.perfiles_curso.deleteMany({});
db.ofertas_ti.deleteMany({});

// 1. Crear colección "perfiles_curso" (6 documentos)
db.perfiles_curso.insertMany([
  { "alumno": "Ana Gómez", "seccion": "003D", "carrera": "Ingeniería en Informática", "skills": ["HTML", "CSS", "JavaScript", "Python"] },
  { "alumno": "Luis Soto", "seccion": "003D", "carrera": "Ingenieria en Informatica", "skills": ["Html", "Python"] },
  { "alumno": "Carla Pino", "seccion": "004D", "carrera": "Ingeniería en Informática", "skills": ["Oracle", "PL/SQL", "Git"] },
  { "alumno": "Diego Mora", "seccion": "004D", "Carrera": "Ingeniería en Informática", "skills": ["JavaScript", "Python", "Git"] },
  { "alumno": "Elena Díaz", "carrera": "Ingeniería en Informática", "skills": ["HTML", "CSS"] },
  { "alumno": "Diego Mora", "seccion": "004D", "carrera": "Ingeniería en Informática", "skills": ["JavaScript"] }
]);

// 2. Crear colección "ofertas_ti" (5 documentos)
db.ofertas_ti.insertMany([
  { "codigo": "OF-1", "cargo": "Backend Node", "modalidad": "remoto", "sueldo": 1300000, "vacantes": 2, "activa": true, "requisitos": ["Node.js", "MongoDB", "Git"], "ubicacion": { "ciudad": "Santiago", "comuna": "Providencia" }, "nota_interna": "Revisar CV" },
  { "codigo": "OF-2", "cargo": "Analista Datos", "modalidad": "híbrido", "sueldo": 900000, "vacantes": 1, "activa": true, "requisitos": ["SQL", "Python"], "ubicacion": { "ciudad": "Santiago", "comuna": "Las Condes" } },
  { "codigo": "OF-3", "cargo": "Soporte TI", "modalidad": "presencial", "sueldo": 650000, "vacantes": 3, "activa": true, "requisitos": ["Redes", "Linux"], "ubicacion": { "ciudad": "Valparaíso", "comuna": "Viña del Mar" } },
  { "codigo": "OF-4", "cargo": "QA Junior", "modalidad": "remoto", "sueldo": 850000, "vacantes": 0, "activa": false, "requisitos": ["Python", "Git"], "ubicacion": { "ciudad": "Santiago", "comuna": "Providencia" }, "nota_interna": "Cerrada" },
  { "codigo": "OF-5", "cargo": "DBA Oracle", "modalidad": "híbrido", "sueldo": 1600000, "vacantes": 1, "activa": true, "requisitos": ["Oracle", "PL/SQL", "Git"], "ubicacion": { "ciudad": "Santiago", "comuna": "Santiago" } }
]);`
    },

    // =========================================================================
    // PARTE 1: ALTERNATIVAS (8 PREGUNTAS x 3 PTS = 24 PTS)
    // =========================================================================
    multipleChoiceQuestions: [
        {
            id: 'mc1',
            number: 1,
            points: 3,
            topic: 'Sesión 1: Modelo Documental vs Relacional',
            question: '¿Cuál es el principio central del modelo documental en MongoDB al guardar un perfil profesional (con estudios, experiencia y skills) frente al modelo relacional?',
            options: [
                'a) Repartir los datos en 6 colecciones distintas unidas por claves foráneas para evitar arreglos.',
                'b) Guardar juntos en un solo documento los datos que se leen juntos (usando arreglos y subdocumentos), sin necesidad de reconstruir el perfil con JOINs.',
                'c) Obligar a que todos los documentos de la colección tengan exactamente las mismas columnas y rellenar con NULL los campos faltantes.',
                'd) Almacenar únicamente texto plano sin distinguir tipos de datos numéricos, booleanos ni fechas.'
            ]
        },
        {
            id: 'mc2',
            number: 2,
            points: 3,
            topic: 'Sesión 1: Formato BSON y _id',
            question: '¿Qué ocurre en MongoDB cuando insertas un documento sin especificar el campo `_id`, y por qué se usa `new Date()` en `fecha_registro`?',
            options: [
                'a) MongoDB genera automáticamente un campo `_id` único de tipo `ObjectId`, y `new Date()` guarda un valor de fecha real en formato BSON en lugar de un simple texto.',
                'b) La inserción falla con un error de clave primaria nula hasta que definas una secuencia manual.',
                'c) MongoDB usa el nombre del alumno como `_id` automático y convierte `new Date()` en un número entero.',
                'd) El documento se guarda sin identificador y solo puede consultarse mediante `countDocuments()`.'
            ]
        },
        {
            id: 'mc3',
            number: 3,
            points: 3,
            topic: 'Sesión 1 y 2: Regla de Proyección en find()',
            question: '[Prueba en Playground] Si ejecutas en tu Playground `db.perfiles_curso.find({ "seccion": "003D" }, { "alumno": 1, "carrera": 0 })`, ¿qué resultado obtienes y por qué?',
            playgroundQuery: `use('mi_evaluacion_ea3');\ndb.perfiles_curso.find({ "seccion": "003D" }, { "alumno": 1, "carrera": 0 });`,
            options: [
                'a) Muestra el campo `alumno` y oculta `carrera` para todos los perfiles de la sección 003D.',
                'b) Borra el campo `carrera` de los documentos de la sección 003D.',
                'c) Arroja un error de proyección, porque no se pueden mezclar `1` (mostrar) y `0` (ocultar) en la misma consulta, salvo para ocultar `"_id": 0`.',
                'd) Ordena los resultados por `alumno` de forma ascendente y por `carrera` de forma descendente.'
            ]
        },
        {
            id: 'mc4',
            number: 4,
            points: 3,
            topic: 'Sesión 2: Prueba en Playground — distinct() y $exists',
            question: '[Prueba en Playground] Sobre tu colección `perfiles_curso`, ejecuta `db.perfiles_curso.distinct("carrera")` y luego `db.perfiles_curso.find({ "carrera": { $exists: false } })`. ¿Qué obtienes en ambos casos?',
            playgroundQuery: `use('mi_evaluacion_ea3');\n// Ejecuta una línea a la vez con "Run Selected Lines"\ndb.perfiles_curso.distinct("carrera");\ndb.perfiles_curso.find({ "carrera": { $exists: false } });`,
            options: [
                'a) `distinct` devuelve 6 carreras repetidas y `$exists: false` devuelve 0 documentos.',
                'b) `distinct` arroja error porque hay tildes distintas y `$exists: false` devuelve a `"Elena Díaz"`.',
                'c) `distinct` devuelve 1 sola carrera porque ignora tildes automáticamente y `$exists: false` devuelve 2 documentos.',
                'd) `distinct` devuelve 2 textos distintos (`"Ingenieria en Informatica"` e `"Ingeniería en Informática"`) y `$exists: false` devuelve 1 documento (`"Diego Mora"`, que escribió `"Carrera"` con C mayúscula).'
            ]
        },
        {
            id: 'mc5',
            number: 5,
            points: 3,
            topic: 'Sesión 1 y 2: Prueba en Playground — $in vs $all',
            question: '[Prueba en Playground] En tu colección `perfiles_curso`, compara el resultado de `db.perfiles_curso.countDocuments({ "skills": { $in: ["HTML", "Html"] } })` frente a `db.perfiles_curso.countDocuments({ "skills": { $all: ["JavaScript", "Python"] } })`. ¿Cuántos documentos devuelve cada una y por qué?',
            playgroundQuery: `use('mi_evaluacion_ea3');\n// Ejecuta una línea a la vez con "Run Selected Lines"\ndb.perfiles_curso.countDocuments({ "skills": { $in: ["HTML", "Html"] } });\ndb.perfiles_curso.countDocuments({ "skills": { $all: ["JavaScript", "Python"] } });`,
            options: [
                'a) `$in` devuelve 3 documentos (tienen `"HTML"` O `"Html"`) y `$all` devuelve 2 documentos (Ana Gómez y el primer registro de Diego Mora, que tienen `"JavaScript"` Y `"Python"` a la vez).',
                'b) `$in` devuelve 2 documentos y `$all` devuelve 4 documentos porque `$all` suma todos los que tengan cualquiera de las dos.',
                'c) Ambas consultas devuelven exactamente 3 documentos.',
                'd) `$in` devuelve 1 documento y `$all` devuelve 0 documentos.'
            ]
        },
        {
            id: 'mc6',
            number: 6,
            points: 3,
            topic: 'Sesión 3: Prueba en Playground — Rango ($gte y $lte)',
            question: '[Prueba en Playground] Sobre tu colección `ofertas_ti`, ejecuta: `db.ofertas_ti.find({ "activa": true, "sueldo": { $gte: 900000, $lte: 1500000 } })`. ¿Qué códigos de oferta devuelve?',
            playgroundQuery: `use('mi_evaluacion_ea3');\ndb.ofertas_ti.find({ "activa": true, "sueldo": { $gte: 900000, $lte: 1500000 } });`,
            options: [
                'a) `OF-1`, `OF-2` y `OF-5`.',
                'b) Solo `OF-1` ($1.300.000), porque `$gte` no incluye el valor exacto de 900.000.',
                'c) Únicamente `OF-1` ($1.300.000) y `OF-2` ($900.000).',
                'd) `OF-1`, `OF-2` y `OF-4` ($850.000).'
            ]
        },
        {
            id: 'mc7',
            number: 7,
            points: 3,
            topic: 'Sesión 3: Prueba en Playground — AND implícito + $or',
            question: '[Prueba en Playground] Sobre `ofertas_ti`, ejecuta: `db.ofertas_ti.find({ "vacantes": { $gt: 0 }, $or: [ { "modalidad": "remoto" }, { "ubicacion.comuna": "Las Condes" } ] })`. ¿Qué ofertas cumplen el filtro y por qué no aparece `OF-4`?',
            playgroundQuery: `use('mi_evaluacion_ea3');\ndb.ofertas_ti.find({\n  "vacantes": { $gt: 0 },\n  $or: [\n    { "modalidad": "remoto" },\n    { "ubicacion.comuna": "Las Condes" }\n  ]\n});`,
            options: [
                'a) Cumplen `OF-1`, `OF-2` y `OF-4`, porque `$or` ignora la condición de `vacantes`.',
                'b) Cumplen solo `OF-1` y `OF-2`; `OF-4` no aparece porque aunque es `"remoto"`, tiene `"vacantes": 0` y no cumple la condición obligatoria `"vacantes": { $gt: 0 }`.',
                'c) Cumple solo `OF-1`, porque no se puede consultar un subdocumento como `"ubicacion.comuna"` dentro de un `$or`.',
                'd) No devuelve ningún documento porque falta escribir el operador `$and` explícito.'
            ]
        },
        {
            id: 'mc8',
            number: 8,
            points: 3,
            topic: 'Sesión 4: Prueba en Playground — updateOne() vs updateMany()',
            question: '[Prueba en Playground] En `ofertas_ti` hay 2 ofertas con `"modalidad": "híbrido"` (`OF-2` con $900.000 y `OF-5` con $1.600.000). Si ejecutas `db.ofertas_ti.updateOne({ "modalidad": "híbrido" }, { $inc: { "sueldo": 50000 } })`, ¿qué ocurre?',
            playgroundQuery: `use('mi_evaluacion_ea3');\ndb.ofertas_ti.updateOne({ "modalidad": "híbrido" }, { $inc: { "sueldo": 50000 } });`,
            options: [
                'a) Se suman $50.000 tanto a `OF-2` como a `OF-5` (`modifiedCount: 2`).',
                'b) El sueldo de `OF-2` se reemplaza por el valor `50000`.',
                'c) MongoDB arroja error porque hay más de un documento con modalidad híbrida.',
                'd) MongoDB modifica únicamente la primera oferta híbrida que encuentra (`OF-2`, subiendo de $900.000 a $950.000) y se detiene (`matchedCount: 1`, `modifiedCount: 1`), dejando `OF-5` intacta.'
            ]
        }
    ],

    // =========================================================================
    // PARTE 2: SELECCIÓN MÚLTIPLE (4 PREGUNTAS x 3 PTS = 12 PTS)
    // =========================================================================
    multiSelectQuestions: [
        {
            id: 'ms1',
            number: 9,
            points: 3,
            topic: 'Sesión 1: Playground y Creación de Base / Colecciones',
            question: 'Respecto al trabajo en el Playground de VS Code con MongoDB Atlas, marca TODAS las afirmaciones correctas:',
            options: [
                'a) `use(\'mi_evaluacion_ea3\')` selecciona la base de datos de trabajo; si aún no existe en tu cluster, MongoDB la crea cuando insertas el primer documento.',
                'b) Al presionar el botón Play (▶), el Playground ejecuta todo el archivo y muestra en el panel de resultados únicamente la salida de la última instrucción.',
                'c) Si escribes `Perfiles` con mayúscula y `perfiles` con minúscula, MongoDB los guarda dentro de la misma colección porque ignora las mayúsculas.',
                'd) Para ver el resultado de una consulta específica sin correr todo el archivo, puedes seleccionar esas líneas y usar "Run Selected Lines From Playground".'
            ]
        },
        {
            id: 'ms2',
            number: 10,
            points: 3,
            topic: 'Sesión 2: Diagnóstico y Calidad de Datos',
            question: 'Al auditar una colección como `perfiles_curso`, ¿cuáles de las siguientes afirmaciones sobre exploración y calidad de datos son CORRECTAS?',
            options: [
                'a) `db.perfiles_curso.find({ "seccion": { $exists: false } })` devuelve el documento de `"Elena Díaz"` porque no tiene el campo `seccion`.',
                'b) Que MongoDB tenga esquema flexible significa que las consultas corrigen solas los errores de nombres de campos y tildes.',
                'c) Si un documento tiene el campo escrito como `"Carrera"` (con C mayúscula), aparecerá como faltante al buscar `{ "carrera": { $exists: false } }`.',
                'd) Usar una expresión regular con `/i` (ej. `{ "skills": /html/i }`) permite encontrar el texto sin importar si está escrito en mayúsculas o minúsculas.'
            ]
        },
        {
            id: 'ms3',
            number: 11,
            points: 3,
            topic: 'Sesión 3: Lotes y Operadores de Búsqueda',
            question: 'Sobre `insertMany()` y los operadores de filtrado de la Sesión 3, marca TODAS las opciones correctas:',
            options: [
                'a) `insertMany([ { ... }, { ... } ])` exige recibir un arreglo entre corchetes `[ ]`, donde cada elemento es un documento `{ }`.',
                'b) Escribir varias condiciones separadas por coma dentro del mismo filtro equivale a un `AND` lógico (deben cumplirse todas a la vez).',
                'c) El operador `$nin: ["Redes", "PHP"]` selecciona los documentos cuyo campo NO contenga ninguno de los valores de esa lista.',
                'd) Para buscar un rango numérico entre A y B en MongoDB se utiliza el operador `{ "sueldo": { $between: [A, B] } }`.'
            ]
        },
        {
            id: 'ms4',
            number: 12,
            points: 3,
            topic: 'Sesión 4: Operadores de Actualización y Eliminación',
            question: 'Respecto a la modificación y eliminación de documentos en la Sesión 4, marca TODAS las afirmaciones verdaderas:',
            options: [
                'a) `deleteOne({ "activa": false })` elimina todas las ofertas inactivas que existan en la colección.',
                'b) `$set` cambia el valor de un campo (o crea el campo si no existía en el documento) conservando intactos los demás campos.',
                'c) `$inc` suma cuando recibe un número positivo (ej. `100000`) y resta cuando recibe un número negativo (ej. `-1`).',
                'd) `$unset: { "nota_interna": "" }` elimina por completo la clave `nota_interna` del documento.'
            ]
        }
    ],

    // =========================================================================
    // PARTE 3: TÉRMINOS PAREADOS (6 CONCEPTOS x 2 PTS = 12 PTS)
    // =========================================================================
    matchingQuestions: [
        {
            id: 'm1',
            number: 13,
            points: 12,
            pointsPerTerm: 2,
            instruction: 'Relaciona cada método u operador de MongoDB con su definición exacta (2 puntos por cada asociación correcta = 12 puntos):',
            terms: [
                { id: 't1', name: 'distinct("campo")' },
                { id: 't2', name: '{ $exists: false }' },
                { id: 't3', name: '$ne' },
                { id: 't4', name: '$nin' },
                { id: 't5', name: '$inc' },
                { id: 't6', name: '$unset' }
            ],
            definitions: [
                { id: 'd1', text: 'Filtra documentos donde el valor de un campo es distinto (Not Equal) al valor indicado.' },
                { id: 'd2', text: 'Suma o resta (con signo negativo) una cantidad al valor actual de un campo numérico.' },
                { id: 'd3', text: 'Elimina por completo un campo o clave específica dentro de un documento.' },
                { id: 'd4', text: 'Entrega una lista limpia, sin duplicados, con todos los valores diferentes presentes en un campo.' },
                { id: 'd5', text: 'Filtra documentos cuyo valor no sea ninguno de los elementos incluidos en una lista [ ].' },
                { id: 'd6', text: 'Filtra y devuelve únicamente los documentos donde el campo consultado no está presente.' }
            ]
        }
    ],

    // =========================================================================
    // PARTE 4: VERDADERO O FALSO CON JUSTIFICACIÓN (6 ÍTEMS x 3 PTS = 18 PTS)
    // =========================================================================
    trueFalseQuestions: [
        {
            id: 'tf1',
            number: 14,
            points: 3,
            topic: 'Sesión 1 y 2: Ejecución del Playground y Duplicados',
            statement: 'Si dejas un `db.perfiles_curso.insertOne({ ... })` sin comentar al inicio de tu Playground y presionas el botón Play (▶) 5 veces para probar consultas más abajo, MongoDB detecta que es el mismo alumno y solo lo inserta una vez.'
        },
        {
            id: 'tf2',
            number: 15,
            points: 3,
            topic: 'Sesión 2 y 4: Comportamiento de updateOne ante Duplicados',
            statement: 'Si un estudiante tiene 2 copias repetidas de su perfil en la colección y ejecuta `db.perfiles_curso.updateOne({ "alumno": "Diego Mora" }, { $set: { "seccion": "003D" } })`, MongoDB actualiza automáticamente ambas copias.'
        },
        {
            id: 'tf3',
            number: 16,
            points: 3,
            topic: 'Sesión 1 y 3: Consulta de Subdocumentos',
            statement: 'Para filtrar por un campo que está dentro de un objeto anidado (como `comuna` dentro de `ubicacion`), se debe usar la notación de punto entre comillas: `{ "ubicacion.comuna": "Providencia" }`.'
        },
        {
            id: 'tf4',
            number: 17,
            points: 3,
            topic: 'Sesión 2: Sensibilidad a Mayúsculas y Tildes',
            statement: 'En MongoDB, la consulta exacta `db.perfiles_curso.find({ "carrera": "Ingeniería en Informática" })` encuentra automáticamente también el documento de `"Luis Soto"` donde se escribió `"Ingenieria en Informatica"` sin tildes.'
        },
        {
            id: 'tf5',
            number: 18,
            points: 3,
            topic: 'Sesión 3: Diferencia entre findOne() y find()',
            statement: 'El método `findOne({ "modalidad": "remoto" })` devuelve únicamente el primer documento que coincida con el filtro, mientras que `find({ "modalidad": "remoto" })` devuelve todos los documentos que cumplan la condición.'
        },
        {
            id: 'tf6',
            number: 19,
            points: 3,
            topic: 'Sesión 4: Orden de Parámetros en updateOne / updateMany',
            statement: 'Al actualizar en MongoDB con `updateOne` o `updateMany`, el orden de los parámetros es igual al `UPDATE` de SQL: primero se escribe el objeto con los cambios (`$set`, `$inc`) y en segundo lugar el objeto con el filtro (`WHERE`).'
        }
    ],

    // =========================================================================
    // PARTE 5: COMPLETAR CÓDIGO CON POOL DE OPCIONES (6 EJERCICIOS x 3 PTS = 18 PTS)
    // =========================================================================
    codeCompletionQuestions: [
        // EJERCICIO 1: SESIÓN 1 - INSERTONE
        {
            id: 'cc1',
            number: 20,
            points: 3,
            title: 'Ejercicio 1: Creación de Perfil en el Directorio (insertOne)',
            topic: 'Sesión 1: Documentos e insertOne',
            description: 'Completa el código para seleccionar la base de datos y registrar un perfil con arreglo de skills y fecha en formato BSON.',
            codeTemplate: `[BLANK_1]('mi_evaluacion_ea3');

db.perfiles_curso.[BLANK_2]({
    "alumno": "Camila Rojas Pérez",
    "seccion": "003D",
    "carrera": "Ingeniería en Informática",
    "skills": [BLANK_3],
    "disponibilidad": { "practica": true, "modalidad": "híbrida" },
    "fecha_registro": [BLANK_4]
});`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Instrucción para elegir la base de datos',
                    options: ['connect', 'use', 'database', 'select']
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Método para insertar un único documento',
                    options: ['insertMany', 'insertInto', 'insertOne', 'createOne']
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Arreglo de tecnologías',
                    options: [
                        '{"Oracle", "PL/SQL", "Git"}',
                        '["Oracle", "PL/SQL", "Git"]',
                        '("Oracle", "PL/SQL", "Git")',
                        '"Oracle, PL/SQL, Git"'
                    ]
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Fecha y hora actual en tipo Date BSON',
                    options: ['SYSDATE', 'Date.string()', '"new Date()"', 'new Date()']
                }
            ]
        },

        // EJERCICIO 2: SESIÓN 1 y 2 - FIND CON $ALL, PROYECCIÓN, SORT Y LIMIT
        {
            id: 'cc2',
            number: 21,
            points: 3,
            title: 'Ejercicio 2: Búsqueda en Arreglos con Proyección, Orden y Límite',
            topic: 'Sesión 1 y 2: $all, proyección, sort y limit',
            description: 'Completa la consulta para buscar perfiles que dominen TANTO "JavaScript" COMO "Python" a la vez, mostrando solo alumno y skills (sin _id), ordenados de la A a la Z y limitando a 5 resultados.',
            codeTemplate: `use('mi_evaluacion_ea3');

db.perfiles_curso.find(
    { "skills": { [BLANK_1]: ["JavaScript", "Python"] } },
    { "alumno": 1, "skills": 1, [BLANK_2] }
)
.[BLANK_3]
.[BLANK_4];`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Operador para exigir TODAS las tecnologías de la lista',
                    options: ['$in', '$and', '$all', '$nin']
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Ocultar el identificador en la proyección',
                    options: ['"_id": false', '"_id": 0', '"_id": -1', '"seccion": 0']
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Ordenar por alumno de la A a la Z (ascendente)',
                    options: [
                        'sort({ "alumno": -1 })',
                        'orderBy("alumno", 1)',
                        'sort("alumno")',
                        'sort({ "alumno": 1 })'
                    ]
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Acotar la salida a máximo 5 documentos',
                    options: ['limit(5)', 'top(5)', 'max(5)', 'count(5)']
                }
            ]
        },

        // EJERCICIO 3: SESIÓN 2 - AUDITORÍA CON COUNTDOCUMENTS, DISTINCT Y $EXISTS
        {
            id: 'cc3',
            number: 22,
            points: 3,
            title: 'Ejercicio 3: Auditoría de Calidad en la Colección Perfiles',
            topic: 'Sesión 2: countDocuments, distinct y $exists',
            description: 'Completa las tres consultas de diagnóstico: (1) contar perfiles de la sección 004D, (2) listar los valores únicos de carrera, y (3) encontrar documentos a los que les falta el campo seccion.',
            codeTemplate: `use('mi_evaluacion_ea3');

// 1. Contar cuántos documentos tienen la sección "004D"
db.perfiles_curso.[BLANK_1]({ "seccion": "004D" });

// 2. Ver la lista sin repetidos de valores en el campo "carrera"
db.perfiles_curso.[BLANK_2];

// 3. Encontrar los documentos donde NO existe el campo "seccion"
db.perfiles_curso.find({ "seccion": { [BLANK_3]: [BLANK_4] } });`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Método para contar documentos',
                    options: ['countAll', 'sumDocuments', 'countDocuments', 'length']
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Método y argumento para valores únicos de carrera',
                    options: [
                        'distinct(carrera)',
                        'distinct("carrera")',
                        'unique("carrera")',
                        'findDistinct({ "carrera": 1 })'
                    ]
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Operador para verificar presencia de un campo',
                    options: ['$null', '$missing', '$in', '$exists']
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Valor booleano para indicar que el campo NO está',
                    options: ['true', 'false', '0', 'null']
                }
            ]
        },

        // EJERCICIO 4: SESIÓN 3 - FILTRO AVANZADO CON RANGO, $NIN Y $OR
        {
            id: 'cc4',
            number: 23,
            points: 3,
            title: 'Ejercicio 4: Buscador de Ofertas con Rango, $nin y $or',
            topic: 'Sesión 3: $gte, $lte, $nin y $or',
            description: 'Completa la consulta para buscar ofertas activas, con sueldo entre $800.000 y $1.500.000, que NO pidan "PHP" en requisitos, y que sean remotas O queden en la comuna de Providencia.',
            codeTemplate: `use('mi_evaluacion_ea3');

db.ofertas_ti.find({
    "activa": true,
    "sueldo": { [BLANK_1]: 800000, [BLANK_2]: 1500000 },
    "requisitos": { [BLANK_3]: ["PHP"] },
    [BLANK_4]: [
        { "modalidad": "remoto" },
        { "ubicacion.comuna": "Providencia" }
    ]
});`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Operador mayor o igual que (>= 800000)',
                    options: ['$gt', '$gte', '$lt', '$eq']
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Operador menor o igual que (<= 1500000)',
                    options: ['$lt', '$gte', '$ne', '$lte']
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Operador para excluir valores de una lista',
                    options: ['$in', '$nin', '$all', '$ne']
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Operador lógico para cumplir al menos una de las dos condiciones',
                    options: ['$in', '$any', '$or', '$and']
                }
            ]
        },

        // EJERCICIO 5: SESIÓN 4 - UPDATEMANY, UPDATEONE CON $SET, $INC Y $UNSET
        {
            id: 'cc5',
            number: 24,
            points: 3,
            title: 'Ejercicio 5: Reajuste de Sueldos y Limpieza de Campos ($inc y $unset)',
            topic: 'Sesión 4: updateMany, updateOne, $inc y $unset',
            description: 'Completa las instrucciones para: (1) subir en $100.000 el sueldo de TODAS las ofertas remotas, y (2) descontar 1 vacante y borrar el campo nota_interna en la oferta OF-1.',
            codeTemplate: `use('mi_evaluacion_ea3');

// 1. Subir el sueldo en $100.000 a TODAS las ofertas de modalidad "remoto"
db.ofertas_ti.[BLANK_1](
    { "modalidad": "remoto" },
    { [BLANK_2]: { "sueldo": 100000 } }
);

// 2. Descontar 1 vacante y quitar el campo "nota_interna" en la oferta OF-1
db.ofertas_ti.updateOne(
    { "codigo": "OF-1" },
    {
        $inc: { "vacantes": [BLANK_3] },
        [BLANK_4]: { "nota_interna": "" }
    }
);`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Método para actualizar múltiples documentos que cumplan el filtro',
                    options: ['updateOne', 'updateAll', 'updateMany', 'modifyMany']
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Operador para sumar al valor numérico actual',
                    options: ['$set', '$inc', '$sum', '$add']
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Valor para restar 1 al campo vacantes',
                    options: ['1', '"vacantes - 1"', '0', '-1']
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Operador para eliminar por completo el campo nota_interna',
                    options: ['$delete', '$unset', '$remove', '$drop']
                }
            ]
        },

        // EJERCICIO 6: SESIÓN 4 - UPDATE CON $SET Y ELIMINACIÓN SEGURA CON DELETEONE / DELETEMANY
        {
            id: 'cc6',
            number: 25,
            points: 3,
            title: 'Ejercicio 6: Cambio de Campos ($set) y Eliminación (deleteOne / deleteMany)',
            topic: 'Sesión 4: $set, deleteOne y deleteMany',
            description: 'Completa el código para: (1) agregar el campo "beneficio": true a la oferta OF-2 con $set, (2) borrar 1 documento específico con deleteOne, y (3) borrar todas las ofertas inactivas con 0 vacantes.',
            codeTemplate: `use('mi_evaluacion_ea3');

// 1. Agregar o cambiar el campo "beneficio": true en la oferta OF-2
db.ofertas_ti.updateOne(
    { "codigo": "OF-2" },
    { [BLANK_1]: { "beneficio": true } }
);

// 2. Eliminar únicamente el documento de prueba "PRUEBA - Perfil Temporal"
db.perfiles_curso.[BLANK_2]({
    "alumno": "PRUEBA - Perfil Temporal"
});

// 3. Eliminar TODAS las ofertas que estén inactivas (false) y con 0 vacantes
db.ofertas_ti.[BLANK_3]({
    "activa": [BLANK_4],
    "vacantes": 0
});`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Operador para asignar o crear el campo beneficio',
                    options: ['$inc', '$unset', '$set', '$change']
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Método para borrar un único documento',
                    options: ['removeOne', 'deleteOne', 'dropOne', 'unsetOne']
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Método para borrar todos los documentos que cumplan el filtro',
                    options: ['deleteOne', 'drop', 'deleteAll', 'deleteMany']
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Valor booleano de oferta inactiva',
                    options: ['false', '"false"', '0', 'null']
                }
            ]
        }
    ],

    // =========================================================================
    // PARTE 6: 2 PREGUNTAS CORTAS DE DIAGNÓSTICO (2 x 8 PTS = 16 PTS)
    // =========================================================================
    shortDiagnosticQuestions: [
        {
            id: 'diag1',
            number: 26,
            points: 8,
            title: 'Pregunta Corta 1: Diagnóstico de Duplicados y Limpieza en perfiles_curso',
            topic: 'Sesiones 1, 2 y 4 (8 puntos)',
            scenarioHtml: `
                <div class="concept-box" style="margin-bottom: 1rem;">
                    <strong>Prueba en tu Playground sobre <code>db.perfiles_curso</code>:</strong><br>
                    En tu colección <code>perfiles_curso</code> el alumno <code>"Diego Mora"</code> aparece <strong>2 veces</strong>. Ejecuta en tu Playground:<br>
                    <code>db.perfiles_curso.updateOne({ "alumno": "Diego Mora" }, { $set: { "disponibilidad": "Inmediata" } });</code><br>
                    Luego inspecciona ambos registros con <code>db.perfiles_curso.find({ "alumno": "Diego Mora" });</code>.
                </div>
                <div class="analogy-box" style="margin-bottom: 0.5rem;">
                    <strong>Responde de forma corta y precisa:</strong>
                    <ol style="margin: 0.5rem 0 0 1.25rem; line-height: 1.7;">
                        <li><strong>(4 puntos)</strong> ¿Por qué MongoDB permitió guardar 2 documentos con el mismo nombre <code>"Diego Mora"</code> sin arrojar error, y por qué solo <strong>el primero</strong> de los dos documentos quedó con el campo <code>"disponibilidad": "Inmediata"</code>?</li>
                        <li><strong>(4 puntos)</strong> Escribe la instrucción <code>deleteOne</code> o <code>deleteMany</code> exacta (filtrando con <code>"disponibilidad": { $exists: false }</code> o con <code>$ne</code> sobre <code>_id</code>) para eliminar de <code>perfiles_curso</code> únicamente la copia de <code>"Diego Mora"</code> que quedó sin el campo <code>disponibilidad</code>, sin borrar la copia actualizada ni a los demás alumnos.</li>
                    </ol>
                </div>
            `,
            starterPlaceholder: `1. Explicación (4 pts):
- Se guardaron 2 documentos con el mismo nombre porque...
- Solo el primero quedó con "disponibilidad" porque updateOne...

2. Instrucción para borrar únicamente la copia de Diego Mora sin disponibilidad (4 pts):
db.perfiles_curso.deleteMany({
    ...
});`
        },
        {
            id: 'diag2',
            number: 27,
            points: 8,
            title: 'Pregunta Corta 2: Actualización Múltiple y Eliminación en ofertas_ti',
            topic: 'Sesiones 3 y 4 (8 puntos)',
            scenarioHtml: `
                <div class="concept-box" style="margin-bottom: 1rem;">
                    <strong>Prueba en tu Playground sobre <code>db.ofertas_ti</code>:</strong><br>
                    Sobre los 5 documentos de tu colección <code>db.ofertas_ti</code>, ejecuta en tu Playground las siguientes dos operaciones y registra tanto el código utilizado como el resultado obtenido:
                </div>
                <div class="analogy-box" style="margin-bottom: 0.5rem;">
                    <strong>Escribe las dos instrucciones exactas y el resultado que te dio tu Playground:</strong>
                    <ol style="margin: 0.5rem 0 0 1.25rem; line-height: 1.7;">
                        <li><strong>(4 puntos)</strong> Escribe una instrucción <code>updateOne</code> sobre la oferta <code>"codigo": "OF-1"</code> que en un solo paso: <strong>descuente 1 vacante</strong> (con <code>$inc</code>), cambie <code>"modalidad"</code> a <code>"híbrido"</code> (con <code>$set</code>) y <strong>elimine el campo <code>"nota_interna"</code></strong> (con <code>$unset</code>). Indica con cuántas vacantes quedó <code>OF-1</code>.</li>
                        <li><strong>(4 puntos)</strong> Escribe una instrucción <code>deleteMany</code> sobre <code>db.ofertas_ti</code> que elimine todas las ofertas cuya <code>modalidad</code> NO sea <code>"remoto"</code> (usando <code>$ne</code>) y cuyo <code>sueldo</code> sea menor a <code>1000000</code> (usando <code>$lt</code>). Indica qué códigos de oferta se eliminaron y cuántos documentos quedaron finalmente en <code>db.ofertas_ti</code> al verificar con <code>countDocuments()</code>.</li>
                    </ol>
                </div>
            `,
            starterPlaceholder: `1. Instrucción updateOne sobre OF-1 y vacantes resultantes (4 pts):
db.ofertas_ti.updateOne(
    { "codigo": "OF-1" },
    { ... }
);
- Vacantes resultantes en OF-1: ...

2. Instrucción deleteMany, ofertas eliminadas y total restante (4 pts):
db.ofertas_ti.deleteMany({
    ...
});
- Códigos de ofertas eliminadas: ...
- Total de documentos que quedaron en ofertas_ti: ...`
        }
    ]
};
