// s3_2_2_exercises.js — Ejercicios: Explorar, Diagnosticar y Estrategias en MongoDB
// Unidad 3.2 — Sesión 2: Búsquedas y auditoría sobre directorio_talento.perfiles

const s3_2_2_exercises = [
    {
        id: 'e322-mc1',
        type: 'multiple-choice',
        question: 'Un estudiante presionó el botón <strong>Play ▶</strong> del Playground 27 veces sin comentar su <code>insertOne</code>, creando 27 copias de su perfil. Luego ejecutó <code>updateOne({ "alumno": "..." }, { $set: { ... } })</code>. ¿Qué ocurrió en la colección?',
        options: ['Se actualizaron automáticamente las 27 copias porque todas tienen el mismo nombre de alumno.', 'MongoDB arrojó error y no actualizó ninguna copia por existir duplicados.', '<code>updateOne</code> modificó <strong>únicamente la primera copia que encontró</strong> y dejó las otras 26 copias desactualizadas.', '<code>updateOne</code> borró las 26 copias repetidas y dejó solo una.']
    },
    {
        id: 'e322-mc2',
        type: 'multiple-choice',
        question: '¿Para qué sirve ejecutar <code>db.perfiles.distinct("carrera")</code> al auditar nuestra colección?',
        options: ['Para borrar automáticamente las carreras que estén mal escritas.', 'Para obtener un arreglo con los <strong>valores únicos</strong> del campo <code>carrera</code> y descubrir si escribieron la misma carrera de distintas formas (con o sin tildes/mayúsculas).', 'Para contar cuántos estudiantes no tienen el campo <code>carrera</code>.', 'Para ordenar los 71 documentos alfabéticamente por carrera.']
    },
    {
        id: 'e322-mc3',
        type: 'multiple-choice',
        question: 'En la colección hay 28 documentos con <code>"HTML"</code> y 20 documentos con <code>"Html"</code> dentro de <code>skills</code>. ¿Cuál de estas consultas encuentra los <strong>48 documentos</strong> sin dejar a nadie afuera?',
        options: ['<code>db.perfiles.find({ "skills": "HTML" })</code>', '<code>db.perfiles.find({ "skills": { $all: ["HTML", "Html"] } })</code>', '<code>db.perfiles.find({ "skills": { $in: ["HTML", "Html"] } })</code> (o usando expresión regular <code>{ "skills": /html/i }</code>).', '<code>db.perfiles.find({ "skills": { $exists: true } })</code>']
    },
    {
        id: 'e322-tf1',
        type: 'true-false',
        question: 'La consulta <code>db.perfiles.find({ "carrera": { $exists: false } })</code> devuelve todos los documentos que no tienen el campo <code>carrera</code> en minúscula, incluyendo aquel donde el estudiante escribió <code>"Carrera"</code> con C mayúscula.'
    },
    {
        id: 'e322-tf2',
        type: 'true-false',
        question: 'El operador <code>$push</code> verifica automáticamente si una skill ya existe en el arreglo para no repetirla, mientras que <code>$addToSet</code> agrega el valor aunque quede repetido 22 veces.'
    },
    {
        id: 'e322-fill1',
        type: 'fill-code',
        question: 'Completa el código para contar cuántos documentos son de la sección <code>"004D"</code> y luego listar todas las skills únicas registradas en la colección:',
        parts: [
            { type: 'text', content: `use('directorio_talento');

db.perfiles.` },
            { type: 'blank', index: 0, placeholder: 'método contar', width: 140 },
            { type: 'text', content: `({ "seccion": "004D" });

db.perfiles.` },
            { type: 'blank', index: 1, placeholder: 'método únicos', width: 100 },
            { type: 'text', content: '(' },
            { type: 'blank', index: 2, placeholder: '"campo"', width: 90 },
            { type: 'text', content: ');' }
        ]
    },
    {
        id: 'e322-fill2',
        type: 'fill-code',
        question: 'Completa la consulta para encontrar los documentos donde <strong>no existe</strong> el campo <code>fecha_registro</code>, mostrando solo el campo <code>alumno</code> (y ocultando <code>_id</code>):',
        parts: [
            {
                type: 'text',
                content: `use('directorio_talento');

db.perfiles.find(
    { "fecha_registro": { `
            },
            { type: 'blank', index: 0, placeholder: 'operador', width: 90 },
            { type: 'text', content: ': ' },
            { type: 'blank', index: 1, placeholder: 'booleano', width: 70 },
            { type: 'text', content: ` } },
    { "alumno": 1, "_id": ` },
            { type: 'blank', index: 2, placeholder: '0 o 1', width: 60 },
            { type: 'text', content: ` }
);` }
        ]
    },
    {
        id: 'e322-err1',
        type: 'find-error',
        question: 'Este script intenta ver las carreras únicas de la colección, pero arroja <code>ReferenceError: carrera is not defined</code>. ¿En qué línea está el error?',
        lines: ['use(\'directorio_talento\');', 'db.perfiles.countDocuments();', 'db.perfiles.distinct(carrera);']
    },
    {
        id: 'e322-err2',
        type: 'find-error',
        question: 'Esta consulta busca perfiles que tengan tanto JavaScript como Python en <code>skills</code>, pero una línea tiene un error de sintaxis en el operador. ¿Cuál es?',
        lines: ['use(\'directorio_talento\');', 'db.perfiles.find({', '    "seccion": "003D",', '    "skills": { $all: "JavaScript", "Python" }', '});']
    },
    {
        id: 'e322-ws1',
        type: 'word-search',
        question: 'Encuentra los siguientes <strong>5 conceptos clave</strong> de exploración y calidad de datos en MongoDB:',
        gridSize: 10,
        words: ['DISTINCT', 'EXISTS', 'COUNT', 'REGEX', 'UNIQUE'],
        wordPlacements: [
            {
                word: 'DISTINCT',
                cells: [0, 1, 2, 3, 4, 5, 6, 7],
                clue: 'Método que devuelve los valores únicos sin repetir de un campo'
            },
            {
                word: 'EXISTS',
                cells: [19, 29, 39, 49, 59, 69],
                clue: 'Operador ($exists) para detectar si un campo está presente o falta en un documento'
            },
            {
                word: 'COUNT',
                cells: [31, 32, 33, 34, 35],
                clue: 'Prefijo de countDocuments(), usado para contar registros que cumplen un filtro'
            },
            {
                word: 'REGEX',
                cells: [50, 60, 70, 80, 90],
                clue: 'Expresión regular (/patron/i) para buscar texto ignorando mayúsculas o por prefijo'
            },
            {
                word: 'UNIQUE',
                cells: [92, 93, 94, 95, 96, 97],
                clue: 'Opción del índice (unique: true) que impide insertar dos documentos con el mismo valor'
            }
        ],
        grid: [
            {letter:'D'},{letter:'I'},{letter:'S'},{letter:'T'},{letter:'I'},{letter:'N'},{letter:'C'},{letter:'T'},{letter:'Y'},{letter:'M'},
            {letter:'O'},{letter:'V'},{letter:'V'},{letter:'G'},{letter:'J'},{letter:'G'},{letter:'G'},{letter:'F'},{letter:'H'},{letter:'E'},
            {letter:'Y'},{letter:'L'},{letter:'J'},{letter:'W'},{letter:'W'},{letter:'Y'},{letter:'K'},{letter:'O'},{letter:'K'},{letter:'X'},
            {letter:'A'},{letter:'C'},{letter:'O'},{letter:'U'},{letter:'N'},{letter:'T'},{letter:'G'},{letter:'G'},{letter:'A'},{letter:'I'},
            {letter:'B'},{letter:'P'},{letter:'W'},{letter:'M'},{letter:'J'},{letter:'A'},{letter:'F'},{letter:'L'},{letter:'V'},{letter:'S'},
            {letter:'R'},{letter:'G'},{letter:'O'},{letter:'V'},{letter:'G'},{letter:'G'},{letter:'G'},{letter:'M'},{letter:'M'},{letter:'T'},
            {letter:'E'},{letter:'O'},{letter:'O'},{letter:'F'},{letter:'K'},{letter:'W'},{letter:'J'},{letter:'Y'},{letter:'O'},{letter:'S'},
            {letter:'G'},{letter:'M'},{letter:'O'},{letter:'L'},{letter:'H'},{letter:'A'},{letter:'P'},{letter:'Y'},{letter:'J'},{letter:'V'},
            {letter:'E'},{letter:'W'},{letter:'G'},{letter:'B'},{letter:'L'},{letter:'W'},{letter:'B'},{letter:'G'},{letter:'V'},{letter:'F'},
            {letter:'X'},{letter:'M'},{letter:'U'},{letter:'N'},{letter:'I'},{letter:'Q'},{letter:'U'},{letter:'E'},{letter:'K'},{letter:'P'}
        ]
    }
];
