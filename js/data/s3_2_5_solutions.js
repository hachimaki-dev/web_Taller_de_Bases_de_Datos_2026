// s3_2_5_solutions.js — Solucionario: Consultas de Resumen y Agrupación en MongoDB (Aggregate)
// Unidad 3.2 — Sesión 5

const s3_2_5_solutions = [
    {
        id: 'e325-mc1',
        answer: 1,
        explanation: '<strong>Correcto.</strong> <code>$match</code> filtra los documentos antes de que pasen a <code>$group</code>, igual que un <code>WHERE</code> antes de un <code>GROUP BY</code>.',
        fullSolution: 'Filtrar al inicio con <code>$match</code> también hace que la consulta sea mucho más rápida porque procesa menos documentos.'
    },
    {
        id: 'e325-mc2',
        answer: 2,
        explanation: '<strong>Correcto.</strong> <code>{ $sum: 1 }</code> suma 1 por cada documento (conteo), mientras que <code>{ $sum: "$vacantes" }</code> suma el número guardado dentro del campo <code>vacantes</code> de cada documento.',
        fullSolution: 'Es la diferencia exacta entre <code>COUNT(*)</code> y <code>SUM(vacantes)</code> en SQL.'
    },
    {
        id: 'e325-mc3',
        answer: 0,
        explanation: '<strong>Correcto.</strong> El acumulador <code>$avg</code> (de <em>average</em>) calcula el promedio numérico del campo indicado con signo dólar (<code>"$sueldo"</code>).',
        fullSolution: 'Recuerda siempre escribir el signo <code>$</code> antes del nombre del campo cuando está a la derecha de los dos puntos.'
    },
    {
        id: 'e325-tf1',
        answer: true,
        explanation: '<strong>Verdadero.</strong> En <code>$group</code> es obligatorio definir la clave <code>_id</code> para indicar por qué campo se agrupará (o <code>_id: null</code> si quieres un único total general).'
    },
    {
        id: 'e325-tf2',
        answer: false,
        explanation: '<strong>Falso.</strong> Si agrupas directo por un arreglo sin poner antes <code>{ $unwind: "$requisitos" }</code>, MongoDB tomará la lista completa como un bloque en vez de contar cada tecnología por separado.'
    },
    {
        id: 'e325-fill1',
        answers: [
            ['$match', '"$match"'],
            ['$group', '"$group"'],
            ['$avg', '"$avg"']
        ],
        explanation: '<code>$match</code> filtra las ofertas activas, <code>$group</code> las agrupa por modalidad y <code>$avg</code> calcula el sueldo promedio.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">aggregate</span>([
    { <span class="kw">$match</span>: { <span class="str">"activa"</span>: <span class="kw">true</span> } },
    {
        <span class="kw">$group</span>: {
            _id: <span class="str">"$modalidad"</span>,
            total_ofertas: { <span class="kw">$sum</span>: <span class="num">1</span> },
            sueldo_promedio: { <span class="kw">$avg</span>: <span class="str">"$sueldo"</span> }
        }
    }
]);</pre>`
    },
    {
        id: 'e325-fill2',
        answers: [
            ['"$empresa"', '\'$empresa\''],
            ['$max', '"$max"'],
            ['$sort', '"$sort"']
        ],
        explanation: 'Agrupamos por <code>"$empresa"</code>, calculamos el máximo con <code>$max</code> y ordenamos descendentemente con <code>$sort</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">aggregate</span>([
    {
        <span class="kw">$group</span>: {
            _id: <span class="str">"$empresa"</span>,
            sueldo_maximo: { <span class="kw">$max</span>: <span class="str">"$sueldo"</span> }
        }
    },
    { <span class="kw">$sort</span>: { <span class="str">"sueldo_maximo"</span>: -<span class="num">1</span> } }
]);</pre>`
    },
    {
        id: 'e325-err1',
        answer: 3,
        explanation: '<strong>Error en la línea 4 (índice 3):</strong> para referirse al valor del campo <code>modalidad</code> debe llevar el signo dólar dentro de las comillas: <code>_id: "$modalidad"</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.ofertas.<span class="fn">aggregate</span>([
    { <span class="kw">$group</span>: {
        _id: <span class="str">"$modalidad"</span>,
        total: { <span class="kw">$sum</span>: <span class="num">1</span> }
    } }
]);</pre>`
    },
    {
        id: 'e325-err2',
        answer: 1,
        explanation: '<strong>Error en la línea 2 (índice 1):</strong> el método <code>aggregate([ ... ])</code> recibe un arreglo de etapas encerrado entre corchetes <code>[ ]</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.ofertas.<span class="fn">aggregate</span>([
    { <span class="kw">$match</span>: { <span class="str">"activa"</span>: <span class="kw">true</span> } },
    { <span class="kw">$group</span>: { _id: <span class="str">"$modalidad"</span>, total: { <span class="kw">$sum</span>: <span class="num">1</span> } } }
]);</pre>`
    },
    {
        id: 'e325-ws1',
        explanation: '<strong>¡Excelente!</strong> Encontraste MATCH, GROUP, AVG, UNWIND y MAX.',
        fullSolution: '<ul><li><strong>MATCH:</strong> <code>$match</code> filtra documentos antes de agrupar.</li><li><strong>GROUP:</strong> <code>$group</code> agrupa por <code>_id</code> y calcula métricas.</li><li><strong>AVG:</strong> <code>$avg</code> calcula el promedio numérico.</li><li><strong>UNWIND:</strong> <code>$unwind</code> desarma un arreglo en elementos individuales.</li><li><strong>MAX:</strong> <code>$max</code> obtiene el valor máximo del grupo.</li></ul>'
    }
];

