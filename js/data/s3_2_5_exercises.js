// s3_2_5_exercises.js — Ejercicios: Consultas de Resumen y Agrupación en MongoDB (Aggregate)
// Unidad 3.2 — Sesión 5: aggregate, $match, $group, $sum, $avg, $min, $max, $sort

const s3_2_5_exercises = [
    {
        id: 'e325-mc1',
        type: 'multiple-choice',
        question: 'En un pipeline de <code>db.ofertas.aggregate([ ... ])</code>, ¿cuál es el rol de la etapa <code>$match</code> y dónde conviene ubicarla?',
        options: [
            'Sirve para ordenar los documentos de mayor a menor y siempre va al final.',
            'Equivale al <code>WHERE</code> de SQL: filtra qué documentos entran al cálculo y conviene ponerla <strong>al principio</strong> antes de agrupar con <code>$group</code>.',
            'Sirve para borrar documentos que tengan campos vacíos.',
            'Es obligatoria para crear una colección nueva en la base de datos.'
        ]
    },
    {
        id: 'e325-mc2',
        type: 'multiple-choice',
        question: 'Dentro de una etapa <code>$group</code>, ¿cuál es la diferencia entre escribir <code>{ $sum: 1 }</code> y escribir <code>{ $sum: "$vacantes" }</code>?',
        options: [
            'Son exactamente iguales: ambos cuentan cuántos documentos hay en el grupo.',
            '<code>{ $sum: 1 }</code> suma solo el primer documento, mientras que <code>{ $sum: "$vacantes" }</code> cuenta cuántos campos existen.',
            '<code>{ $sum: 1 }</code> cuenta <strong>cuántos documentos</strong> hay en el grupo (<code>COUNT(*)</code>), mientras que <code>{ $sum: "$vacantes" }</code> <strong>suma los valores numéricos</strong> guardados en el campo <code>vacantes</code> (<code>SUM(vacantes)</code>).',
            '<code>{ $sum: "$vacantes" }</code> calcula el promedio de vacantes.'
        ]
    },
    {
        id: 'e325-mc3',
        type: 'multiple-choice',
        question: '¿Qué acumulador usarías dentro de <code>$group</code> para obtener el <strong>sueldo promedio</strong> de las ofertas de cada modalidad?',
        options: [
            '<code>{ $avg: "$sueldo" }</code>',
            '<code>{ $sum: "$sueldo" }</code>',
            '<code>{ $max: "$sueldo" }</code>',
            '<code>{ $mean: "sueldo" }</code>'
        ]
    },
    {
        id: 'e325-tf1',
        type: 'true-false',
        question: 'Dentro de <code>$group</code>, el campo obligatorio que define por qué criterio se formarán los grupos siempre se escribe como <code>_id</code> (por ejemplo: <code>_id: "$modalidad"</code>).'
    },
    {
        id: 'e325-tf2',
        type: 'true-false',
        question: 'Si quieres contar cuántas veces aparece cada tecnología dentro del arreglo <code>requisitos</code>, basta con hacer <code>$group</code> directo sin usar antes <code>$unwind</code>.'
    },
    {
        id: 'e325-fill1',
        type: 'fill-code',
        question: 'Completa la agregación para filtrar solo las ofertas activas y agruparlas por <code>modalidad</code>, contando cuántas ofertas hay y calculando su sueldo promedio:',
        parts: [
            {
                type: 'text',
                content: `use('directorio_talento');

db.ofertas.aggregate([
    { `
            },
            { type: 'blank', index: 0, placeholder: 'etapa filtro', width: 90 },
            {
                type: 'text',
                content: `: { "activa": true } },
    {
        `
            },
            { type: 'blank', index: 1, placeholder: 'etapa agrupar', width: 90 },
            {
                type: 'text',
                content: `: {
            _id: "$modalidad",
            total_ofertas: { $sum: 1 },
            sueldo_promedio: { `
            },
            { type: 'blank', index: 2, placeholder: 'promedio', width: 75 },
            {
                type: 'text',
                content: `: "$sueldo" }
        }
    }
]);`
            }
        ]
    },
    {
        id: 'e325-fill2',
        type: 'fill-code',
        question: 'Completa la agregación sobre <code>ofertas</code> para agrupar por <code>empresa</code>, obteniendo el sueldo máximo de cada una y ordenando de mayor a menor:',
        parts: [
            {
                type: 'text',
                content: `use('directorio_talento');

db.ofertas.aggregate([
    {
        $group: {
            _id: `
            },
            { type: 'blank', index: 0, placeholder: '"$campo"', width: 100 },
            {
                type: 'text',
                content: `,
            sueldo_maximo: { `
            },
            { type: 'blank', index: 1, placeholder: 'máximo', width: 75 },
            {
                type: 'text',
                content: `: "$sueldo" }
        }
    },
    { `
            },
            { type: 'blank', index: 2, placeholder: 'etapa orden', width: 80 },
            {
                type: 'text',
                content: `: { "sueldo_maximo": -1 } }
]);`
            }
        ]
    },
    {
        id: 'e325-err1',
        type: 'find-error',
        question: 'Esta agregación quiere agrupar por <code>modalidad</code>, pero en vez de agrupar por los valores del campo (<code>"remoto"</code>, <code>"híbrido"</code>), mete todos los documentos en un solo grupo llamado literalmente <code>"modalidad"</code> porque le faltó el signo dólar <code>$</code>. ¿En qué línea está el error?',
        lines: [
            'use(\'directorio_talento\');',
            'db.ofertas.aggregate([',
            '    { $group: {',
            '        _id: "modalidad",',
            '        total: { $sum: 1 }',
            '    } }',
            ']);'
        ]
    },
    {
        id: 'e325-err2',
        type: 'find-error',
        question: 'Este código intenta ejecutar un pipeline de 2 etapas con <code>aggregate</code>, pero olvidó envolver las etapas dentro de un arreglo con corchetes <code>[ ]</code>. ¿En qué línea comienza el problema?',
        lines: [
            'use(\'directorio_talento\');',
            'db.ofertas.aggregate(',
            '    { $match: { "activa": true } },',
            '    { $group: { _id: "$modalidad", total: { $sum: 1 } } }',
            ');'
        ]
    },
    {
        id: 'e325-ws1',
        type: 'word-search',
        question: 'Encuentra los siguientes <strong>5 términos</strong> del pipeline de agregación en MongoDB:',
        gridSize: 10,
        words: ['MATCH', 'GROUP', 'AVG', 'UNWIND', 'MAX'],
        wordPlacements: [
            {
                word: 'MATCH',
                cells: [0, 1, 2, 3, 4],
                clue: 'Etapa ($match) que filtra documentos igual que el WHERE de SQL'
            },
            {
                word: 'GROUP',
                cells: [12, 22, 32, 42, 52],
                clue: 'Etapa ($group) que agrupa documentos y calcula totales o promedios'
            },
            {
                word: 'AVG',
                cells: [35, 36, 37],
                clue: 'Acumulador ($avg) para calcular el promedio numérico de un grupo'
            },
            {
                word: 'UNWIND',
                cells: [61, 62, 63, 64, 65, 66],
                clue: 'Etapa extra ($unwind) que desenrolla un arreglo para agrupar sus elementos'
            },
            {
                word: 'MAX',
                cells: [94, 95, 96],
                clue: 'Acumulador ($max) que devuelve el valor más alto de cada grupo'
            }
        ],
        grid: [
            {letter:'M'},{letter:'A'},{letter:'T'},{letter:'C'},{letter:'H'},{letter:'P'},{letter:'L'},{letter:'K'},{letter:'J'},{letter:'H'},
            {letter:'Q'},{letter:'W'},{letter:'G'},{letter:'E'},{letter:'R'},{letter:'T'},{letter:'Y'},{letter:'U'},{letter:'I'},{letter:'O'},
            {letter:'A'},{letter:'S'},{letter:'R'},{letter:'D'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'J'},{letter:'K'},{letter:'L'},
            {letter:'Z'},{letter:'X'},{letter:'O'},{letter:'C'},{letter:'V'},{letter:'A'},{letter:'V'},{letter:'G'},{letter:'B'},{letter:'N'},
            {letter:'M'},{letter:'Q'},{letter:'U'},{letter:'W'},{letter:'E'},{letter:'R'},{letter:'T'},{letter:'Y'},{letter:'U'},{letter:'I'},
            {letter:'O'},{letter:'P'},{letter:'P'},{letter:'A'},{letter:'S'},{letter:'D'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'J'},
            {letter:'K'},{letter:'U'},{letter:'N'},{letter:'W'},{letter:'I'},{letter:'N'},{letter:'D'},{letter:'L'},{letter:'Z'},{letter:'X'},
            {letter:'C'},{letter:'V'},{letter:'B'},{letter:'N'},{letter:'M'},{letter:'Q'},{letter:'W'},{letter:'E'},{letter:'R'},{letter:'T'},
            {letter:'Y'},{letter:'U'},{letter:'I'},{letter:'O'},{letter:'P'},{letter:'A'},{letter:'S'},{letter:'D'},{letter:'F'},{letter:'G'},
            {letter:'H'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'M'},{letter:'A'},{letter:'X'},{letter:'Z'},{letter:'X'},{letter:'C'}
        ]
    }
];

