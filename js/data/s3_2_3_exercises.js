// s3_2_3_exercises.js — Ejercicios: Nuevas Colecciones, Lotes y Operadores de Búsqueda
// Unidad 3.2 — Sesión 3: insertMany, comparadores ($gt, $gte, $lt, $lte, $ne) y lógicos ($in, $nin, $or)

const s3_2_3_exercises = [
    {
        id: 'e323-mc1',
        type: 'multiple-choice',
        question: '¿Cuál es la diferencia de sintaxis principal entre <code>insertOne()</code> e <code>insertMany()</code> al guardar documentos en la colección <code>ofertas</code>?',
        options: [
            'No hay diferencia: ambos reciben exactamente los mismos paréntesis y llaves.',
            '<code>insertOne</code> recibe un objeto <code>({ ... })</code>, mientras que <code>insertMany</code> exige un <strong>arreglo entre corchetes con objetos adentro</strong>: <code>([ { ... }, { ... } ])</code>.',
            '<code>insertMany</code> solo permite insertar números y textos, pero no arreglos.',
            'Para usar <code>insertMany</code> primero hay que crear la colección con <code>CREATE TABLE</code>.'
        ]
    },
    {
        id: 'e323-mc2',
        type: 'multiple-choice',
        question: 'En SQL escribirías <code>WHERE sueldo BETWEEN 600000 AND 1200000</code>. ¿Cómo se escribe exactamente ese mismo filtro de rango en MongoDB?',
        options: [
            '<code>db.ofertas.find({ "sueldo": { $between: [600000, 1200000] } })</code>',
            '<code>db.ofertas.find({ "sueldo": { $in: [600000, 1200000] } })</code>',
            '<code>db.ofertas.find({ "sueldo": { $gte: 600000, $lte: 1200000 } })</code>',
            '<code>db.ofertas.find({ "sueldo": { $gt: 1200000, $lt: 600000 } })</code>'
        ]
    },
    {
        id: 'e323-mc3',
        type: 'multiple-choice',
        question: 'Quieres ver las ofertas que estén <strong>activas</strong> (<code>"activa": true</code>) y que además sean <strong>remotas O paguen al menos $1.500.000</strong>. ¿Qué operador necesitas combinar junto con <code>"activa": true</code>?',
        options: [
            '<code>$nin</code>, porque permite evaluar campos distintos al mismo tiempo.',
            '<code>$or: [ { "modalidad": "remoto" }, { "sueldo": { $gte: 1500000 } } ]</code>.',
            '<code>$all: [ "remoto", 1500000 ]</code>.',
            '<code>distinct("modalidad")</code>.'
        ]
    },
    {
        id: 'e323-tf1',
        type: 'true-false',
        question: 'En la consulta <code>db.ofertas.find({ "modalidad": { $ne: "presencial" } })</code>, el operador <code>$ne</code> devuelve todas las ofertas cuya modalidad sea distinta de <code>"presencial"</code> (como <code>"remoto"</code> o <code>"híbrido"</code>).'
    },
    {
        id: 'e323-tf2',
        type: 'true-false',
        question: 'El operador <code>$nin: ["Java", "PHP"]</code> sobre el campo <code>requisitos</code> busca las ofertas que exijan obligatoriamente tanto Java como PHP al mismo tiempo.'
    },
    {
        id: 'e323-fill1',
        type: 'fill-code',
        question: 'Completa la consulta para buscar las ofertas activas que tengan <strong>al menos 1 vacante</strong> (<code>&gt;= 1</code>) y cuyo sueldo sea <strong>menor o igual a $1.000.000</strong>:',
        parts: [
            {
                type: 'text',
                content: `use('directorio_talento');

db.ofertas.find({
    "activa": `
            },
            { type: 'blank', index: 0, placeholder: 'booleano', width: 70 },
            {
                type: 'text',
                content: `,
    "vacantes": { `
            },
            { type: 'blank', index: 1, placeholder: 'mayor o igual', width: 80 },
            {
                type: 'text',
                content: `: 1 },
    "sueldo": { `
            },
            { type: 'blank', index: 2, placeholder: 'menor o igual', width: 80 },
            {
                type: 'text',
                content: `: 1000000 }
});`
            }
        ]
    },
    {
        id: 'e323-fill2',
        type: 'fill-code',
        question: 'Completa la consulta para traer las ofertas que sean de modalidad <code>"remoto"</code> <strong>O</strong> que pertenezcan a la empresa <code>"Andes Cloud SpA"</code>:',
        parts: [
            {
                type: 'text',
                content: `use('directorio_talento');

db.ofertas.find({
    `
            },
            { type: 'blank', index: 0, placeholder: 'operador O', width: 70 },
            {
                type: 'text',
                content: `: [
        { "modalidad": "remoto" },
        { `
            },
            { type: 'blank', index: 1, placeholder: '"campo"', width: 100 },
            {
                type: 'text',
                content: `: "Andes Cloud SpA" }
    ]
});`
            }
        ]
    },
    {
        id: 'e323-err1',
        type: 'find-error',
        question: 'Este código intenta insertar 2 empresas al mismo tiempo con <code>insertMany</code>, pero arroja un error porque faltan los corchetes de la lista. ¿En qué línea está el inicio del problema?',
        lines: [
            'use(\'directorio_talento\');',
            'db.empresas.insertMany(',
            '    { "nombre": "Andes Cloud SpA", "ciudad": "Santiago" },',
            '    { "nombre": "FinTech Austral", "ciudad": "Valparaíso" }',
            ');'
        ]
    },
    {
        id: 'e323-err2',
        type: 'find-error',
        question: 'Esta consulta intenta usar <code>$or</code> para buscar ofertas remotas o con sueldo sobre $1.200.000, pero tiene un error de sintaxis en la estructura del operador. ¿Cuál línea está mal escrita?',
        lines: [
            'use(\'directorio_talento\');',
            'db.ofertas.find({',
            '    "activa": true,',
            '    $or: { "modalidad": "remoto", "sueldo": { $gte: 1200000 } }',
            '});'
        ]
    },
    {
        id: 'e323-ws1',
        type: 'word-search',
        question: 'Encuentra los siguientes <strong>5 términos</strong> de inserción por lotes y operadores de búsqueda en MongoDB:',
        gridSize: 10,
        words: ['MANY', 'GTE', 'LTE', 'NIN', 'SKIP'],
        wordPlacements: [
            {
                word: 'MANY',
                cells: [0, 1, 2, 3],
                clue: 'Sufijo de insertMany(), usado para insertar varios documentos en una lista'
            },
            {
                word: 'GTE',
                cells: [18, 28, 38],
                clue: 'Operador ($gte) que significa mayor o igual que (Greater Than or Equal)'
            },
            {
                word: 'LTE',
                cells: [41, 42, 43],
                clue: 'Operador ($lte) que significa menor o igual que (Less Than or Equal)'
            },
            {
                word: 'NIN',
                cells: [65, 75, 85],
                clue: 'Operador ($nin) para excluir valores que NO estén en una lista'
            },
            {
                word: 'SKIP',
                cells: [93, 94, 95, 96],
                clue: 'Método (.skip) para saltar documentos y paginar resultados'
            }
        ],
        grid: [
            {letter:'M'},{letter:'A'},{letter:'N'},{letter:'Y'},{letter:'R'},{letter:'P'},{letter:'L'},{letter:'C'},{letter:'Z'},{letter:'Q'},
            {letter:'X'},{letter:'B'},{letter:'V'},{letter:'H'},{letter:'J'},{letter:'K'},{letter:'M'},{letter:'N'},{letter:'G'},{letter:'W'},
            {letter:'F'},{letter:'D'},{letter:'S'},{letter:'A'},{letter:'Q'},{letter:'W'},{letter:'E'},{letter:'R'},{letter:'T'},{letter:'Y'},
            {letter:'U'},{letter:'I'},{letter:'O'},{letter:'P'},{letter:'L'},{letter:'K'},{letter:'J'},{letter:'H'},{letter:'E'},{letter:'G'},
            {letter:'Z'},{letter:'L'},{letter:'T'},{letter:'E'},{letter:'C'},{letter:'V'},{letter:'B'},{letter:'N'},{letter:'M'},{letter:'Q'},
            {letter:'A'},{letter:'S'},{letter:'D'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'P'},
            {letter:'Q'},{letter:'W'},{letter:'E'},{letter:'R'},{letter:'T'},{letter:'N'},{letter:'Y'},{letter:'U'},{letter:'I'},{letter:'O'},
            {letter:'Z'},{letter:'X'},{letter:'C'},{letter:'V'},{letter:'B'},{letter:'I'},{letter:'M'},{letter:'Q'},{letter:'W'},{letter:'E'},
            {letter:'R'},{letter:'T'},{letter:'Y'},{letter:'U'},{letter:'I'},{letter:'N'},{letter:'O'},{letter:'P'},{letter:'A'},{letter:'S'},
            {letter:'D'},{letter:'F'},{letter:'G'},{letter:'S'},{letter:'K'},{letter:'I'},{letter:'P'},{letter:'H'},{letter:'J'},{letter:'K'}
        ]
    }
];

