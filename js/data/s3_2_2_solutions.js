// s3_2_2_solutions.js — Solucionario: Explorar, Diagnosticar y Estrategias en MongoDB
// Unidad 3.2 — Sesión 2: Búsquedas y auditoría sobre directorio_talento.perfiles

const s3_2_2_solutions = [
    {
        id: 'e322-mc1',
        answer: 2,
        explanation: '<strong>Correcto.</strong> Por diseño, <code>updateOne()</code> se detiene apenas modifica el primer documento que coincide con el filtro (en nuestro caso, la copia más antigua), dejando las otras 26 copias con los datos viejos.',
        fullSolution: 'Para evitar esta situación en un Playground, debes comentar el <code>insertOne</code> después de ejecutarlo una vez o usar un índice único (<code>unique: true</code>) en la colección.'
    },
    {
        id: 'e322-mc2',
        answer: 1,
        explanation: '<strong>Correcto.</strong> <code>distinct("campo")</code> devuelve la lista sin duplicados de todos los valores presentes en ese campo, lo que permitió descubrir las 3 variantes de <em>Ingeniería en Informática</em> y las 31 variantes en <code>skills</code>.',
        fullSolution: 'Es el equivalente directo de <code>SELECT DISTINCT carrera FROM perfiles</code> en SQL.'
    },
    {
        id: 'e322-mc3',
        answer: 2,
        explanation: '<strong>Correcto.</strong> <code>$in: ["HTML", "Html"]</code> busca documentos que tengan cualquiera de las dos variantes en su arreglo, y <code>/html/i</code> busca el texto ignorando mayúsculas y minúsculas.',
        fullSolution: 'Usar <code>$all: ["HTML", "Html"]</code> exigiría que un mismo documento tuviera ambas palabras al mismo tiempo dentro de su arreglo.'
    },
    {
        id: 'e322-tf1',
        answer: true,
        explanation: '<strong>Verdadero.</strong> Para MongoDB los nombres de campo distinguen mayúsculas y minúsculas: si el documento tiene <code>"Carrera"</code> pero no <code>"carrera"</code>, entonces <code>"carrera"</code> no existe en ese documento y aparece en el resultado.'
    },
    {
        id: 'e322-tf2',
        answer: false,
        explanation: '<strong>Falso.</strong> Es exactamente al revés: <code>$push</code> agrega siempre al final del arreglo (causando que <code>"Node.js"</code> se repitiera 22 veces), mientras que <code>$addToSet</code> solo agrega el valor si aún no existe en el arreglo.'
    },
    {
        id: 'e322-fill1',
        answers: [
            ['countDocuments'],
            ['distinct'],
            ['"skills"', '\'skills\'']
        ],
        explanation: '<code>countDocuments</code> cuenta los documentos que cumplen el filtro y <code>distinct("skills")</code> devuelve la lista de valores únicos del arreglo <code>skills</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.perfiles.<span class="fn">countDocuments</span>({ <span class="str">"seccion"</span>: <span class="str">"004D"</span> });

db.perfiles.<span class="fn">distinct</span>(<span class="str">"skills"</span>);</pre>`
    },
    {
        id: 'e322-fill2',
        answers: [
            ['$exists', '"$exists"'],
            ['false'],
            ['0']
        ],
        explanation: '<code>{ $exists: false }</code> filtra los documentos que carecen del campo indicado, y <code>"_id": 0</code> oculta el identificador en la proyección.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.perfiles.<span class="fn">find</span>(
    { <span class="str">"fecha_registro"</span>: { <span class="kw">$exists</span>: <span class="kw">false</span> } },
    { <span class="str">"alumno"</span>: <span class="num">1</span>, <span class="str">"_id"</span>: <span class="num">0</span> }
);</pre>`
    },
    {
        id: 'e322-err1',
        answer: 2,
        explanation: '<strong>Error en la línea 3 (índice 2):</strong> el método <code>distinct()</code> exige que el nombre del campo vaya <strong>entre comillas</strong> como texto (<code>"carrera"</code>). Si lo escribes sin comillas, JavaScript cree que es una variable.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.perfiles.<span class="fn">countDocuments</span>();
db.perfiles.<span class="fn">distinct</span>(<span class="str">"carrera"</span>);</pre>`
    },
    {
        id: 'e322-err2',
        answer: 3,
        explanation: '<strong>Error en la línea 4 (índice 3):</strong> tanto <code>$all</code> como <code>$in</code> deben recibir un <strong>arreglo entre corchetes</strong>: <code>{ $all: ["JavaScript", "Python"] }</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.perfiles.<span class="fn">find</span>({
    <span class="str">"seccion"</span>: <span class="str">"003D"</span>,
    <span class="str">"skills"</span>: { <span class="kw">$all</span>: [<span class="str">"JavaScript"</span>, <span class="str">"Python"</span>] }
});</pre>`
    },
    {
        id: 'e322-ws1',
        explanation: '<strong>¡Excelente!</strong> Encontraste DISTINCT, EXISTS, COUNT, REGEX y UNIQUE.',
        fullSolution: '<ul><li><strong>DISTINCT:</strong> lista los valores únicos de un campo.</li><li><strong>EXISTS:</strong> filtra documentos según tengan o no un campo.</li><li><strong>COUNT:</strong> <code>countDocuments()</code> cuenta coincidencias.</li><li><strong>REGEX:</strong> búsqueda por patrones como <code>/html/i</code> o <code>/^PRUEBA/</code>.</li><li><strong>UNIQUE:</strong> restricción de índice para impedir duplicados.</li></ul>'
    }
];
