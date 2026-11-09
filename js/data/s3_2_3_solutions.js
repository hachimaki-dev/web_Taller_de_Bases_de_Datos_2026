// s3_2_3_solutions.js — Solucionario: Nuevas Colecciones, Lotes y Operadores de Búsqueda
// Unidad 3.2 — Sesión 3

const s3_2_3_solutions = [
    {
        id: 'e323-mc1',
        answer: 1,
        explanation: '<strong>Correcto.</strong> <code>insertMany([ { ... }, { ... } ])</code> recibe una lista (arreglo entre corchetes <code>[ ]</code>) donde cada elemento es un documento entre llaves <code>{ }</code>.',
        fullSolution: 'Si olvidas los corchetes <code>[ ]</code> en <code>insertMany</code>, MongoDB lanzará un error indicando que el argumento debe ser un arreglo de documentos.'
    },
    {
        id: 'e323-mc2',
        answer: 2,
        explanation: '<strong>Correcto.</strong> En MongoDB los rangos se arman combinando el piso (<code>$gte: 600000</code>) y el techo (<code>$lte: 1200000</code>) separados por coma dentro del mismo objeto del campo.',
        fullSolution: 'No existe un operador llamado <code>$between</code> en las consultas de <code>find()</code>.'
    },
    {
        id: 'e323-mc3',
        answer: 1,
        explanation: '<strong>Correcto.</strong> Cuando las opciones del "O" evalúan campos distintos (<code>modalidad</code> o <code>sueldo</code>), usamos <code>$or: [ { cond1 }, { cond2 } ]</code> combinado con <code>"activa": true</code>.',
        fullSolution: `<pre>db.ofertas.<span class="fn">find</span>({
    <span class="str">"activa"</span>: <span class="kw">true</span>,
    <span class="kw">$or</span>: [
        { <span class="str">"modalidad"</span>: <span class="str">"remoto"</span> },
        { <span class="str">"sueldo"</span>: { <span class="kw">$gte</span>: <span class="num">1500000</span> } }
    ]
});</pre>`
    },
    {
        id: 'e323-tf1',
        answer: true,
        explanation: '<strong>Verdadero.</strong> <code>$ne</code> significa <em>Not Equal</em> (distinto de), el equivalente al <code>!=</code> o <code>&lt;&gt;</code> de SQL.'
    },
    {
        id: 'e323-tf2',
        answer: false,
        explanation: '<strong>Falso.</strong> <code>$nin</code> significa <em>Not In</em> (no está en la lista): devuelve las ofertas que <strong>no</strong> tengan ni Java ni PHP dentro de sus requisitos. Para exigir ambas se usaría <code>$all</code>.'
    },
    {
        id: 'e323-fill1',
        answers: [
            ['true'],
            ['$gte', '"$gte"'],
            ['$lte', '"$lte"']
        ],
        explanation: '<code>$gte</code> filtra valores mayores o iguales a 1, y <code>$lte</code> filtra valores menores o iguales a 1.000.000. Al separarlos por comas se evalúan todos con un <code>AND</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">find</span>({
    <span class="str">"activa"</span>: <span class="kw">true</span>,
    <span class="str">"vacantes"</span>: { <span class="kw">$gte</span>: <span class="num">1</span> },
    <span class="str">"sueldo"</span>: { <span class="kw">$lte</span>: <span class="num">1000000</span> }
});</pre>`
    },
    {
        id: 'e323-fill2',
        answers: [
            ['$or', '"$or"'],
            ['"empresa"', '\'empresa\'']
        ],
        explanation: 'El operador <code>$or</code> recibe un arreglo <code>[ ... ]</code> con los objetos de cada condición alternativa.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">find</span>({
    <span class="kw">$or</span>: [
        { <span class="str">"modalidad"</span>: <span class="str">"remoto"</span> },
        { <span class="str">"empresa"</span>: <span class="str">"Andes Cloud SpA"</span> }
    ]
});</pre>`
    },
    {
        id: 'e323-err1',
        answer: 1,
        explanation: '<strong>Error en la línea 2 (índice 1):</strong> <code>insertMany</code> debe abrir con paréntesis y corchete <code>insertMany([</code> y cerrar con <code>]);</code> porque recibe un arreglo de objetos.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.empresas.<span class="fn">insertMany</span>([
    { <span class="str">"nombre"</span>: <span class="str">"Andes Cloud SpA"</span>, <span class="str">"ciudad"</span>: <span class="str">"Santiago"</span> },
    { <span class="str">"nombre"</span>: <span class="str">"FinTech Austral"</span>, <span class="str">"ciudad"</span>: <span class="str">"Valparaíso"</span> }
]);</pre>`
    },
    {
        id: 'e323-err2',
        answer: 3,
        explanation: '<strong>Error en la línea 4 (índice 3):</strong> <code>$or</code> exige un <strong>arreglo entre corchetes <code>[ ]</code></strong> donde cada condición vaya en su propio objeto <code>{ }</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.ofertas.<span class="fn">find</span>({
    <span class="str">"activa"</span>: <span class="kw">true</span>,
    <span class="kw">$or</span>: [
        { <span class="str">"modalidad"</span>: <span class="str">"remoto"</span> },
        { <span class="str">"sueldo"</span>: { <span class="kw">$gte</span>: <span class="num">1200000</span> } }
    ]
});</pre>`
    },
    {
        id: 'e323-ws1',
        explanation: '<strong>¡Muy bien!</strong> Encontraste MANY, GTE, LTE, NIN y SKIP.',
        fullSolution: '<ul><li><strong>MANY:</strong> <code>insertMany([...])</code> inserta múltiples documentos a la vez.</li><li><strong>GTE / LTE:</strong> <code>$gte</code> (&gt;=) y <code>$lte</code> (&lt;=) para comparaciones y rangos.</li><li><strong>NIN:</strong> <code>$nin</code> excluye los documentos cuyo valor esté en la lista.</li><li><strong>SKIP:</strong> <code>.skip(n)</code> salta los primeros <code>n</code> documentos para paginar.</li></ul>'
    }
];

