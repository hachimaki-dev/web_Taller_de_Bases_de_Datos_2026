// s3_2_4_solutions.js — Solucionario: Actualizar en Lote, Modificar Listas y Eliminar (CRUD)
// Unidad 3.2 — Sesión 4

const s3_2_4_solutions = [
    {
        id: 'e324-mc1',
        answer: 1,
        explanation: '<strong>Correcto.</strong> <code>updateOne</code> siempre afecta como máximo a 1 documento, mientras que <code>updateMany</code> aplica el cambio a todos los documentos que cumplan el filtro.',
        fullSolution: 'Ambos métodos devuelven un resumen con <code>matchedCount</code> (encontrados) y <code>modifiedCount</code> (modificados).'
    },
    {
        id: 'e324-mc2',
        answer: 2,
        explanation: '<strong>Correcto.</strong> <code>$inc</code> suma o resta al valor numérico actual: con <code>-1</code> resta 1 a las vacantes que hubiera.',
        fullSolution: 'Si usaras <code>{ $set: { "vacantes": -1 } }</code>, estarías reemplazando el número de vacantes por el valor literal <code>-1</code>.'
    },
    {
        id: 'e324-mc3',
        answer: 0,
        explanation: '<strong>Correcto.</strong> <code>$pull</code> busca el valor indicado dentro del arreglo y lo extrae (eliminando todas sus apariciones) sin tocar los demás elementos de la lista.',
        fullSolution: 'Si usaras <code>$unset</code> sobre <code>"requisitos"</code>, borrarías el arreglo completo con todas las tecnologías.'
    },
    {
        id: 'e324-tf1',
        answer: true,
        explanation: '<strong>Verdadero.</strong> <code>$unset</code> solo borra la clave indicada del documento.'
    },
    {
        id: 'e324-tf2',
        answer: false,
        explanation: '<strong>Falso.</strong> <code>$set</code> reemplaza el valor por completo: dejaría <code>vacantes</code> valiendo literalmente <code>-1</code> en lugar de restarle 1 a 3. Para restar debes usar <code>$inc</code>.'
    },
    {
        id: 'e324-fill1',
        answers: [
            ['updateMany'],
            ['$inc', '"$inc"'],
            ['80000']
        ],
        explanation: '<code>updateMany</code> aplica el cambio a todas tus ofertas híbridas y <code>$inc: { "sueldo": 80000 }</code> suma $80.000 al sueldo de cada una.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">updateMany</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"modalidad"</span>: <span class="str">"híbrido"</span> },
    { <span class="kw">$inc</span>: { <span class="str">"sueldo"</span>: <span class="num">80000</span> } }
);</pre>`
    },
    {
        id: 'e324-fill2',
        answers: [
            ['$pull', '"$pull"'],
            ['deleteMany'],
            ['false']
        ],
        explanation: '<code>$pull</code> retira <code>"PHP"</code> del arreglo <code>requisitos</code> y <code>deleteMany</code> elimina todas tus ofertas donde <code>"activa": false</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"cargo"</span>: <span class="str">"Desarrollador Backend Junior"</span> },
    { <span class="kw">$pull</span>: { <span class="str">"requisitos"</span>: <span class="str">"PHP"</span> } }
);

db.ofertas.<span class="fn">deleteMany</span>({
    <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>,
    <span class="str">"activa"</span>: <span class="kw">false</span>
});</pre>`
    },
    {
        id: 'e324-err1',
        answer: 3,
        explanation: '<strong>Error en la línea 4 (índice 3):</strong> en <code>updateOne</code> y <code>updateMany</code> es obligatorio usar un operador de actualización con signo dólar, como <code>{ $set: { "estado": "entrevista" } }</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.postulaciones.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"candidato"</span>: <span class="str">"Diego Morales"</span> },
    { <span class="kw">$set</span>: { <span class="str">"estado"</span>: <span class="str">"entrevista"</span> } }
);</pre>`
    },
    {
        id: 'e324-err2',
        answer: 2,
        explanation: '<strong>Error en la línea 3 (índice 2):</strong> el filtro debe incluir siempre tu nombre en <code>"creado_por"</code>: <code>{ "creado_por": "Tu Nombre", "activa": false }</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.ofertas.<span class="fn">deleteMany</span>({
    <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>,
    <span class="str">"activa"</span>: <span class="kw">false</span>
});</pre>`
    },
    {
        id: 'e324-ws1',
        explanation: '<strong>¡Excelente!</strong> Encontraste INC, UNSET, PULL, UPSERT y DELETE.',
        fullSolution: '<ul><li><strong>INC:</strong> <code>$inc</code> suma o resta valores numéricos.</li><li><strong>UNSET:</strong> <code>$unset</code> elimina un campo de un documento.</li><li><strong>PULL:</strong> <code>$pull</code> saca un elemento de un arreglo.</li><li><strong>UPSERT:</strong> <code>{ upsert: true }</code> actualiza si existe o inserta si no existe.</li><li><strong>DELETE:</strong> <code>deleteOne</code> / <code>deleteMany</code> eliminan documentos según un filtro.</li></ul>'
    }
];

