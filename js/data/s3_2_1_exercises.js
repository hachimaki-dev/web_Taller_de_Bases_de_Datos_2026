// s3_2_1_exercises.js — Ejercicios: Fundamentos NoSQL con MongoDB Atlas
// Unidad 3.2 — Sesión 1: Documentos, Atlas y Operaciones Create & Read
// Caso: Directorio de Talento del Curso (colección compartida perfiles)

const s3_2_1_exercises = [
    {
        id: 'e321-mc1',
        type: 'multiple-choice',
        question: '¿Por qué el perfil profesional (CV) de una persona encaja bien en un <strong>modelo documental</strong> como MongoDB?',
        options: ['Porque MongoDB siempre es más rápido que Oracle, sin importar el caso.', 'Porque los datos del perfil (skills, estudios, experiencia) se leen juntos y pueden guardarse dentro de <strong>un solo documento</strong>, aunque cada perfil tenga campos distintos.', 'Porque en MongoDB los documentos no necesitan ningún identificador, ni siquiera <code>_id</code>.', 'Porque MongoDB convierte automáticamente el CV en 6 tablas relacionales en segundo plano.']
    },
    {
        id: 'e321-mc2',
        type: 'multiple-choice',
        question: 'En MongoDB, ¿a qué equivale un <strong>documento</strong> si lo comparas con Oracle?',
        options: ['A una tabla completa.', 'A una base de datos.', 'A una <strong>fila</strong> (registro) de una colección, escrita en formato JSON/BSON.', 'A una columna con su tipo de dato.']
    },
    {
        id: 'e321-mc3',
        type: 'multiple-choice',
        question: 'Eres la primera persona del curso en hacer la actividad. Ejecutas <code>use(\'directorio_talento\')</code> y luego un <code>insertOne</code> en <code>perfiles</code>, pero ni la base ni la colección existían. ¿Qué ocurre?',
        options: ['Error: "database not found". Alguien debe crearla antes desde Atlas.', 'Error: hay que ejecutar un <code>CREATE TABLE</code> antes de insertar.', 'MongoDB pide autorización al docente antes de crear la base.', 'No hay error: MongoDB <strong>crea la base y la colección</strong> al insertar el primer documento.']
    },
    {
        id: 'e321-tf1',
        type: 'true-false',
        question: 'La consulta <code>db.perfiles.find({ "skills": "Oracle" })</code> también devuelve los perfiles cuyo arreglo <code>skills</code> contiene "Oracle" junto con otras skills (por ejemplo <code>["Git", "Oracle", "PL/SQL"]</code>).'
    },
    {
        id: 'e321-tf2',
        type: 'true-false',
        question: 'Si quedaste con tu perfil duplicado en la colección compartida, es seguro usar <code>db.perfiles.deleteMany({})</code>, porque solo borra tus documentos.'
    },
    {
        id: 'e321-fill1',
        type: 'fill-code',
        question: 'Completa la instrucción para insertar tu perfil en la colección <code>perfiles</code>, con la fecha de registro como tipo <code>Date</code>:',
        parts: [
            { type: 'text', content: `use('directorio_talento');

db.` },
            { type: 'blank', index: 0, placeholder: 'colección', width: 90 },
            { type: 'text', content: '.' },
            { type: 'blank', index: 1, placeholder: 'método', width: 100 },
            {
                type: 'text',
                content: `({
    "alumno": "Camila Rojas Pérez",
    "skills": ["Oracle", "Git"],
    "fecha_registro": `
            },
            { type: 'blank', index: 2, placeholder: 'fecha actual', width: 110 },
            { type: 'text', content: `
});` }
        ]
    },
    {
        id: 'e321-fill2',
        type: 'fill-code',
        question: 'Completa la consulta para listar a quienes saben Oracle <strong>o</strong> MongoDB, mostrando solo el nombre (sin <code>_id</code>) y ordenado de la A a la Z:',
        parts: [
            {
                type: 'text',
                content: `use('directorio_talento');

db.perfiles.find(
    { "skills": { `
            },
            { type: 'blank', index: 0, placeholder: 'operador', width: 70 },
            { type: 'text', content: `: ["Oracle", "MongoDB"] } },
    { "alumno": 1, "_id": ` },
            { type: 'blank', index: 1, placeholder: '0 o 1', width: 60 },
            { type: 'text', content: ` }
).` },
            { type: 'blank', index: 2, placeholder: 'método orden', width: 90 },
            { type: 'text', content: '({ "alumno": 1 });' }
        ]
    },
    {
        id: 'e321-err1',
        type: 'find-error',
        question: 'Esta actualización agregaría "Docker" a las skills, pero tiene un error peligroso en una colección compartida. ¿En qué línea está?',
        lines: ['use(\'directorio_talento\');', 'db.perfiles.updateOne(', '    { },', '    { $addToSet: { "skills": "Docker" } }', ');']
    },
    {
        id: 'e321-err2',
        type: 'find-error',
        question: 'Esta consulta busca perfiles disponibles para práctica que sepan Oracle, pero una línea tiene un error. ¿Cuál?',
        lines: ['use(\'directorio_talento\');', 'db.perfiles.find({', '    "disponibilidad.practica": true,', '    "skills": { $in: "Oracle" }', '});']
    },
    {
        id: 'e321-ws1',
        type: 'word-search',
        question: 'Encuentra los siguientes <strong>5 términos</strong> de la sesión (horizontales y verticales):',
        gridSize: 10,
        words: ['ARRAY', 'ATLAS', 'FIND', 'PUSH', 'JSON'],
        wordPlacements: [
            {
                word: 'ARRAY',
                cells: [0, 1, 2, 3, 4],
                clue: 'Lista de valores dentro de un documento (por ejemplo, skills)'
            },
            {
                word: 'ATLAS',
                cells: [9, 19, 29, 39, 49],
                clue: 'MongoDB como servicio en la nube'
            },
            {
                word: 'FIND',
                cells: [30, 31, 32, 33],
                clue: 'Método para consultar documentos'
            },
            {
                word: 'PUSH',
                cells: [52, 62, 72, 82],
                clue: 'Operador que agrega un elemento a un arreglo ($push)'
            },
            {
                word: 'JSON',
                cells: [94, 95, 96, 97],
                clue: 'Formato de texto con pares clave:valor que se usa para escribir documentos'
            }
        ],
        grid: [
            {letter:'A'},{letter:'R'},{letter:'R'},{letter:'A'},{letter:'Y'},{letter:'N'},{letter:'Q'},{letter:'D'},{letter:'G'},{letter:'A'},
            {letter:'M'},{letter:'O'},{letter:'C'},{letter:'X'},{letter:'Q'},{letter:'M'},{letter:'H'},{letter:'V'},{letter:'T'},{letter:'T'},
            {letter:'C'},{letter:'N'},{letter:'G'},{letter:'T'},{letter:'E'},{letter:'Q'},{letter:'N'},{letter:'E'},{letter:'C'},{letter:'L'},
            {letter:'F'},{letter:'I'},{letter:'N'},{letter:'D'},{letter:'Y'},{letter:'Z'},{letter:'D'},{letter:'M'},{letter:'Z'},{letter:'A'},
            {letter:'E'},{letter:'M'},{letter:'Q'},{letter:'T'},{letter:'H'},{letter:'E'},{letter:'Z'},{letter:'M'},{letter:'G'},{letter:'S'},
            {letter:'O'},{letter:'K'},{letter:'P'},{letter:'E'},{letter:'V'},{letter:'L'},{letter:'L'},{letter:'C'},{letter:'Y'},{letter:'G'},
            {letter:'X'},{letter:'N'},{letter:'U'},{letter:'G'},{letter:'R'},{letter:'M'},{letter:'V'},{letter:'T'},{letter:'D'},{letter:'G'},
            {letter:'N'},{letter:'C'},{letter:'S'},{letter:'B'},{letter:'M'},{letter:'T'},{letter:'R'},{letter:'Z'},{letter:'K'},{letter:'M'},
            {letter:'N'},{letter:'M'},{letter:'H'},{letter:'W'},{letter:'N'},{letter:'M'},{letter:'H'},{letter:'G'},{letter:'U'},{letter:'D'},
            {letter:'H'},{letter:'V'},{letter:'X'},{letter:'Z'},{letter:'J'},{letter:'S'},{letter:'O'},{letter:'N'},{letter:'Y'},{letter:'X'}
        ]
    }
];
