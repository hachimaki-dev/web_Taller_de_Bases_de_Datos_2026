// s3_2_1_solutions.js — Solucionario: Fundamentos NoSQL con MongoDB Atlas
// Unidad 3.2 — Sesión 1: Documentos, Atlas y Operaciones Create & Read
// Caso: Directorio de Talento del Curso

const s3_2_1_solutions = [
    {
        id: 'e321-mc1',
        answer: 1,
        explanation: '<strong>Correcto.</strong> La regla del modelo documental es guardar juntos los datos que se leen juntos. Skills, estudios y experiencia viven dentro del perfil como arreglos y subdocumentos, y cada perfil puede tener campos distintos.',
        fullSolution: 'En Oracle, el mismo CV requeriría varias tablas (persona, estudio, experiencia, skill, persona_skill) y JOINs para volver a armarlo. La velocidad no es la razón: depende del caso de uso.'
    },
    {
        id: 'e321-mc2',
        answer: 2,
        explanation: '<strong>Correcto.</strong> Colección ≈ tabla, documento ≈ fila, campo ≈ columna. La diferencia es que dos documentos de la misma colección pueden tener campos distintos.',
        fullSolution: 'En el directorio, la colección <code>perfiles</code> es la "tabla" y cada perfil de un estudiante es un documento.'
    },
    {
        id: 'e321-mc3',
        answer: 3,
        explanation: '<strong>Correcto.</strong> MongoDB tiene creación implícita: <code>use()</code> selecciona la base y el primer <code>insertOne</code> crea base y colección. Si ya existen, simplemente se usan.',
        fullSolution: 'Por eso hay que respetar mayúsculas y minúsculas en los nombres: <code>Perfiles</code> y <code>perfiles</code> serían dos colecciones distintas.'
    },
    {
        id: 'e321-tf1',
        answer: true,
        explanation: '<strong>Verdadero.</strong> Cuando el campo es un arreglo, filtrar por un valor simple busca si ese valor está <strong>dentro</strong> del arreglo.'
    },
    {
        id: 'e321-tf2',
        answer: false,
        explanation: '<strong>Falso.</strong> <code>deleteMany({})</code> con filtro vacío borra <strong>todos</strong> los perfiles de todo el curso. Para corregir un duplicado: verifica con <code>countDocuments</code> y usa <code>deleteOne</code> con tu nombre exacto.'
    },
    {
        id: 'e321-fill1',
        answers: [
            ['perfiles'],
            ['insertOne', 'insertOne('],
            ['new Date()', 'new Date(),', 'ISODate()']
        ],
        explanation: 'La colección es <code>perfiles</code>, el método para insertar un documento es <code>insertOne</code> y la fecha actual se genera con <code>new Date()</code>.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.perfiles.<span class="fn">insertOne</span>({
    <span class="str">"alumno"</span>: <span class="str">"Camila Rojas Pérez"</span>,
    <span class="str">"skills"</span>: [<span class="str">"Oracle"</span>, <span class="str">"Git"</span>],
    <span class="str">"fecha_registro"</span>: <span class="kw">new</span> <span class="fn">Date</span>()
});</pre>`
    },
    {
        id: 'e321-fill2',
        answers: [
            ['$in', '"$in"'],
            ['0'],
            ['sort', 'sort(']
        ],
        explanation: '<code>$in</code> acepta cualquiera de los valores de la lista, <code>"_id": 0</code> oculta el identificador y <code>.sort({ "alumno": 1 })</code> ordena de la A a la Z.',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.perfiles.<span class="fn">find</span>(
    { <span class="str">"skills"</span>: { <span class="kw">$in</span>: [<span class="str">"Oracle"</span>, <span class="str">"MongoDB"</span>] } },
    { <span class="str">"alumno"</span>: <span class="num">1</span>, <span class="str">"_id"</span>: <span class="num">0</span> }
).<span class="fn">sort</span>({ <span class="str">"alumno"</span>: <span class="num">1</span> });</pre>`
    },
    {
        id: 'e321-err1',
        answer: 2,
        explanation: '<strong>Error en la línea 3 (índice 2):</strong> el filtro está vacío (<code>{ }</code>), por lo que <code>updateOne</code> modifica el <strong>primer documento que encuentre</strong>, que puede ser el de otra persona.',
        fullSolution: `El filtro debe identificar tu documento:<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.perfiles.<span class="fn">updateOne</span>(
    { <span class="str">"alumno"</span>: <span class="str">"Camila Rojas Pérez"</span> },
    { <span class="kw">$addToSet</span>: { <span class="str">"skills"</span>: <span class="str">"Docker"</span> } }
);</pre>`
    },
    {
        id: 'e321-err2',
        answer: 3,
        explanation: '<strong>Error en la línea 4 (índice 3):</strong> el operador <code>$in</code> exige un <strong>arreglo</strong> de valores, no un texto suelto.',
        fullSolution: `Opciones correctas: <code>{ "skills": { $in: ["Oracle"] } }</code> o, más simple, <code>{ "skills": "Oracle" }</code>.<pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);
db.perfiles.<span class="fn">find</span>({
    <span class="str">"disponibilidad.practica"</span>: <span class="kw">true</span>,
    <span class="str">"skills"</span>: <span class="str">"Oracle"</span>
});</pre>`
    },
    {
        id: 'e321-ws1',
        explanation: '<strong>¡Muy bien!</strong> Encontraste ARRAY, ATLAS, FIND, PUSH y JSON.',
        fullSolution: '<ul><li><strong>ARRAY:</strong> lista de valores dentro de un documento.</li><li><strong>ATLAS:</strong> MongoDB como servicio en la nube.</li><li><strong>FIND:</strong> método de consulta.</li><li><strong>PUSH:</strong> <code>$push</code> agrega un elemento a un arreglo.</li><li><strong>JSON:</strong> formato de texto para escribir documentos.</li></ul>'
    }
];
