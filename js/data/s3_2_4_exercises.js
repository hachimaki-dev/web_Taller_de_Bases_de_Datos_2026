// s3_2_4_exercises.js — Ejercicios: Actualizar en Lote, Modificar Listas y Eliminar (CRUD)
// Unidad 3.2 — Sesión 4: updateOne, updateMany, $set, $inc, $unset, $addToSet, $pull, deleteOne, deleteMany

const s3_2_4_exercises = [
    {
        id: 'e324-mc1',
        type: 'multiple-choice',
        question: '¿Cuál es la diferencia entre <code>updateOne(filtro, cambio)</code> y <code>updateMany(filtro, cambio)</code> cuando 5 documentos cumplen el filtro?',
        options: [
            'No hay diferencia: ambos modifican los 5 documentos.',
            '<code>updateOne</code> modifica solo el <strong>primer documento</strong> que encuentra y se detiene, mientras que <code>updateMany</code> modifica <strong>los 5 documentos</strong> que cumplen el filtro.',
            '<code>updateMany</code> solo sirve para borrar campos con <code>$unset</code>.',
            '<code>updateOne</code> arroja un error si hay más de un documento que cumple el filtro.'
        ]
    },
    {
        id: 'e324-mc2',
        type: 'multiple-choice',
        question: 'Se contrató a una persona para el cargo <code>"Desarrollador Backend Junior"</code> y quieres <strong>descontar 1 vacante</strong> del campo numérico <code>vacantes</code> sin tener que mirar cuántas había antes. ¿Qué operador debes usar?',
        options: [
            '<code>{ $set: { "vacantes": -1 } }</code>',
            '<code>{ $pull: { "vacantes": 1 } }</code>',
            '<code>{ $inc: { "vacantes": -1 } }</code>',
            '<code>{ $unset: { "vacantes": 1 } }</code>'
        ]
    },
    {
        id: 'e324-mc3',
        type: 'multiple-choice',
        question: 'En una oferta laboral el arreglo <code>requisitos</code> tiene <code>["Python", "Selenium", "Git"]</code> y quieres <strong>quitar <code>"Selenium"</code></strong> de esa lista conservando los demás. ¿Qué operador usas?',
        options: [
            '<code>{ $pull: { "requisitos": "Selenium" } }</code>',
            '<code>{ $unset: { "requisitos": "Selenium" } }</code>',
            '<code>{ $addToSet: { "requisitos": "Selenium" } }</code>',
            '<code>{ $set: { "requisitos": "Selenium" } }</code>'
        ]
    },
    {
        id: 'e324-tf1',
        type: 'true-false',
        question: 'El operador <code>$unset: { "nota_interna": "" }</code> elimina por completo el campo <code>nota_interna</code> del documento, pero conserva intactos todos los demás campos de ese documento.'
    },
    {
        id: 'e324-tf2',
        type: 'true-false',
        question: 'Si ejecutas <code>{ $set: { "vacantes": -1 } }</code> en vez de <code>{ $inc: { "vacantes": -1 } }</code> sobre una oferta que tenía 3 vacantes, el número de vacantes bajará a 2.'
    },
    {
        id: 'e324-fill1',
        type: 'fill-code',
        question: 'Completa la instrucción para <strong>subir el sueldo en $80.000</strong> a <strong>todas</strong> tus ofertas de modalidad <code>"híbrido"</code>:',
        parts: [
            {
                type: 'text',
                content: `use('directorio_talento');

db.ofertas.`
            },
            { type: 'blank', index: 0, placeholder: 'método varios', width: 120 },
            {
                type: 'text',
                content: `(
    { "creado_por": "Camila Rojas Pérez", "modalidad": "híbrido" },
    { `
            },
            { type: 'blank', index: 1, placeholder: 'operador sumar', width: 70 },
            {
                type: 'text',
                content: `: { "sueldo": `
            },
            { type: 'blank', index: 2, placeholder: 'monto', width: 80 },
            {
                type: 'text',
                content: ` } }
);`
            }
        ]
    },
    {
        id: 'e324-fill2',
        type: 'fill-code',
        question: 'Completa la instrucción para sacar <code>"PHP"</code> del arreglo <code>requisitos</code> y luego eliminar todas tus ofertas donde <code>activa</code> sea <code>false</code>:',
        parts: [
            {
                type: 'text',
                content: `use('directorio_talento');

db.ofertas.updateOne(
    { "creado_por": "Camila Rojas Pérez", "cargo": "Desarrollador Backend Junior" },
    { `
            },
            { type: 'blank', index: 0, placeholder: 'operador sacar', width: 75 },
            {
                type: 'text',
                content: `: { "requisitos": "PHP" } }
);

db.ofertas.`
            },
            { type: 'blank', index: 1, placeholder: 'borrar varios', width: 120 },
            {
                type: 'text',
                content: `({
    "creado_por": "Camila Rojas Pérez",
    "activa": `
            },
            { type: 'blank', index: 2, placeholder: 'booleano', width: 75 },
            {
                type: 'text',
                content: `
});`
            }
        ]
    },
    {
        id: 'e324-err1',
        type: 'find-error',
        question: 'Este código quiere cambiar el estado de la postulación de Diego Morales a <code>"entrevista"</code>, pero olvidó poner el operador de actualización (como <code>$set</code>) en el segundo argumento. ¿En qué línea está el error?',
        lines: [
            'use(\'directorio_talento\');',
            'db.postulaciones.updateOne(',
            '    { "creado_por": "Camila Rojas Pérez", "candidato": "Diego Morales" },',
            '    { "estado": "entrevista" }',
            ');'
        ]
    },
    {
        id: 'e324-err2',
        type: 'find-error',
        question: 'Este estudiante quería borrar únicamente sus propias ofertas inactivas con <code>deleteMany</code>, pero olvidó filtrar por su nombre en <code>creado_por</code>, poniendo en riesgo los datos de todo el curso. ¿En qué línea falta ese filtro?',
        lines: [
            'use(\'directorio_talento\');',
            'db.ofertas.deleteMany(',
            '    { "activa": false }',
            ');'
        ]
    },
    {
        id: 'e324-ws1',
        type: 'word-search',
        question: 'Encuentra los siguientes <strong>5 operadores y conceptos</strong> de actualización y eliminación en MongoDB:',
        gridSize: 10,
        words: ['INC', 'UNSET', 'PULL', 'UPSERT', 'DELETE'],
        wordPlacements: [
            {
                word: 'INC',
                cells: [0, 1, 2],
                clue: 'Operador ($inc) para sumar o restar un valor a un campo numérico'
            },
            {
                word: 'UNSET',
                cells: [10, 11, 12, 13, 14],
                clue: 'Operador ($unset) que elimina por completo un campo de un documento'
            },
            {
                word: 'PULL',
                cells: [29, 39, 49, 59],
                clue: 'Operador ($pull) que saca un elemento específico de un arreglo'
            },
            {
                word: 'UPSERT',
                cells: [61, 62, 63, 64, 65, 66],
                clue: 'Opción ({ upsert: true }) que actualiza si existe o inserta si no existe'
            },
            {
                word: 'DELETE',
                cells: [92, 93, 94, 95, 96, 97],
                clue: 'Prefijo de deleteOne() y deleteMany() para eliminar documentos'
            }
        ],
        grid: [
            {letter:'I'},{letter:'N'},{letter:'C'},{letter:'R'},{letter:'T'},{letter:'Y'},{letter:'M'},{letter:'K'},{letter:'L'},{letter:'Q'},
            {letter:'U'},{letter:'N'},{letter:'S'},{letter:'E'},{letter:'T'},{letter:'P'},{letter:'O'},{letter:'I'},{letter:'U'},{letter:'Y'},
            {letter:'A'},{letter:'S'},{letter:'D'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'P'},
            {letter:'Z'},{letter:'X'},{letter:'C'},{letter:'V'},{letter:'B'},{letter:'N'},{letter:'M'},{letter:'Q'},{letter:'W'},{letter:'U'},
            {letter:'E'},{letter:'R'},{letter:'T'},{letter:'Y'},{letter:'U'},{letter:'I'},{letter:'O'},{letter:'P'},{letter:'A'},{letter:'L'},
            {letter:'S'},{letter:'D'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'Z'},{letter:'L'},
            {letter:'X'},{letter:'U'},{letter:'P'},{letter:'S'},{letter:'E'},{letter:'R'},{letter:'T'},{letter:'C'},{letter:'V'},{letter:'B'},
            {letter:'N'},{letter:'M'},{letter:'Q'},{letter:'W'},{letter:'E'},{letter:'R'},{letter:'T'},{letter:'Y'},{letter:'U'},{letter:'I'},
            {letter:'O'},{letter:'P'},{letter:'A'},{letter:'S'},{letter:'D'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'J'},{letter:'K'},
            {letter:'L'},{letter:'Z'},{letter:'D'},{letter:'E'},{letter:'L'},{letter:'E'},{letter:'T'},{letter:'E'},{letter:'X'},{letter:'C'}
        ]
    }
];

