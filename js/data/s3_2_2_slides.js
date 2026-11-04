// s3_2_2_slides.js — Explorar y Auditar una Colección Real en MongoDB
// Unidad 3.2 — Sesión 2: Enfoque inductivo basado en escenarios, preguntas y cápsulas de curiosidad

const s3_2_2_slides = [
    // 1
    {
        class: 'title-slide',
        html: `
            <h1>Explorar y Auditar una Colección Real</h1>
            <p class="subtitle">Unidad 3.2 — Sesión 2: ¿Qué hay realmente dentro de nuestro Directorio de Talento?</p>
            <p class="subtitle">Búsquedas, diagnóstico de problemas reales y acuerdos de calidad</p>
            <div class="alien-separator">👽</div>
        `
    },

    // 2
    {
        html: `
            <h2>Ayer Subimos Nuestros Perfiles… ¿Qué Habrá Quedado Guardado?</h2>
            <div class="concept-box">
                En la clase anterior cada estudiante se conectó a <code>directorio_talento</code> para guardar su perfil en la colección <code>perfiles</code>. Hoy partimos con una pregunta clave: <strong>¿podemos confiar a ciegas en los datos que entran a una base de datos?</strong>
            </div>
            <div class="analogy-box">
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li><strong>Hacer preguntas a la colección:</strong> cómo contar, ver valores únicos y filtrar sin llenarnos de texto.</li>
                    <li><strong>Descubrir qué salió mal y por qué:</strong> analizar las anomalías reales que quedaron en nuestros datos.</li>
                    <li><strong>Responder las dudas de "cómo se evita o arregla":</strong> adelantos prácticos para los más curiosos.</li>
                    <li><strong>Tu turno (30 min):</strong> investigar la colección y dejar tus capturas como evidencia.</li>
                </ol>
            </div>
        `
    },

    // 3
    {
        html: `
            <h2>Si Participaron 17 Estudiantes… ¿Habrá 17 Documentos?</h2>
            <div class="concept-box">
                Cuando abres una colección que no conoces, antes de leer documento por documento quieres responder algo básico: <strong>¿cuántos registros hay en total y cuántos cumplen cierta condición?</strong>
            </div>
            <div class="analogy-box">
                <strong>¿Cómo se pregunta eso y para qué sirve?</strong><br>
                Usamos <code>db.coleccion.countDocuments(filtro)</code>. Sirve para dimensionar la colección al instante y comprobar si cuadran los totales sin descargar todos los documentos a tu pantalla.
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// ¿Cuántos documentos hay en total en la colección?</span>
db.perfiles.<span class="fn">countDocuments</span>();                        <span class="cm">// Devuelve: 71 (!)</span>

<span class="cm">// ¿Cuántos son de cada sección?</span>
db.perfiles.<span class="fn">countDocuments</span>({ <span class="str">"seccion"</span>: <span class="str">"003D"</span> });   <span class="cm">// Devuelve: 29</span>
db.perfiles.<span class="fn">countDocuments</span>({ <span class="str">"seccion"</span>: <span class="str">"004D"</span> });   <span class="cm">// Devuelve: 36</span></pre>
            <div class="warning-box">
                <strong>Dos cosas no cuadran:</strong> esperábamos 17 documentos y hay <strong>71</strong>. Y además <code>29 + 36 = 65</code>… ¿qué pasó con los otros <strong>6 documentos</strong>?
            </div>
        `
    },

    // 4
    {
        html: `
            <h2>¿De Quiénes Son Esos 71 Documentos? ¿Cómo Vemos la Lista sin Repetidos?</h2>
            <div class="concept-box">
                Si ejecutamos <code>find({})</code> vamos a ver 71 bloques largos y muchos nombres repetidos. Lo que necesitamos preguntar es: <strong>¿qué valores distintos existen realmente dentro de un campo?</strong>
            </div>
            <div class="analogy-box">
                <strong>El recurso: <code>db.coleccion.distinct("campo")</code></strong><br>
                Recorre toda la colección y te entrega una lista limpia, sin duplicados, con todos los valores diferentes que encontró en ese campo.
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// ¿Qué secciones distintas se registraron?</span>
db.perfiles.<span class="fn">distinct</span>(<span class="str">"seccion"</span>);   <span class="cm">// Devuelve: [ "003D", "004D" ]</span>

<span class="cm">// ¿Cuántos nombres distintos de alumnos hay en los 71 documentos?</span>
db.perfiles.<span class="fn">distinct</span>(<span class="str">"alumno"</span>);    <span class="cm">// Devuelve una lista de solo 21 nombres</span></pre>
            <div class="tip-box">
                En <code>distinct("campo")</code> el nombre del campo siempre debe ir <strong>entre comillas</strong>.
            </div>
        `
    },

    // 5
    {
        html: `
            <h2>¿Por Qué una Misma Persona Aparece 27 Veces en la Colección?</h2>
            <div class="concept-box">
                Si hay 71 documentos pero solo 21 nombres distintos, alguien se guardó muchas veces. Podemos preguntarle a MongoDB cuántas veces aparece un nombre específico:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Contar cuántas veces está repetido un mismo estudiante:</span>
db.perfiles.<span class="fn">countDocuments</span>({ <span class="str">"alumno"</span>: <span class="str">"Nombre del Estudiante"</span> });
<span class="cm">// En un caso devuelve 27, y en otro caso devuelve 17.</span></pre>
            <div class="warning-box">
                <strong>¿Por qué sucedió esto?</strong><br>
                En los Playgrounds de VS Code, el botón <strong>Play ▶</strong> ejecuta <strong>todo el archivo desde la línea 1</strong>. Si dejas tu <code>insertOne()</code> sin comentar arriba mientras pruebas consultas abajo, cada clic en Play vuelve a insertar otra copia tuya con un <code>_id</code> nuevo.
            </div>
        `
    },

    // 6
    {
        html: `
            <h2>🙋‍♂️ Duda Rápida: "¿Y Cómo Hacemos para que Sea Único y No Se Pueda Repetir?"</h2>
            <div class="tip-box">
                <strong>No es el foco de la práctica de hoy (lo aplicaremos en la próxima sesión), pero si te dio curiosidad cómo se resuelve esto de raíz:</strong>
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// 1. ¿Cómo bloquear duplicados? Creando un índice único en la colección:</span>
db.perfiles_curados.<span class="fn">createIndex</span>({ <span class="str">"alumno"</span>: <span class="num">1</span> }, { unique: <span class="kw">true</span> });
<span class="cm">// Con esto, el segundo insertOne con el mismo nombre da error E11000 y no pasa.</span>

<span class="cm">// 2. ¿Y cómo ver el ranking de repetidos sin probar nombre por nombre? (Agregación):</span>
db.perfiles.<span class="fn">aggregate</span>([
    { <span class="kw">$group</span>: { _id: <span class="str">"$alumno"</span>, copias: { <span class="kw">$sum</span>: <span class="num">1</span> } } },
    { <span class="kw">$sort</span>: { copias: -<span class="num">1</span> } }
]);</pre>
            <div class="analogy-box">
                Además, en tu día a día en el Playground: apenas ejecutes tu <code>insertOne()</code> una vez, <strong>coméntalo con <code>//</code></strong> o selecciona solo la consulta que quieres correr (<em>Run Selected Lines</em>).
            </div>
        `
    },

    // 7
    {
        html: `
            <h2>¿Qué Sucede si Tienes 27 Copias y Ejecutas <code>updateOne()</code>?</h2>
            <div class="concept-box">
                Ponte en este caso: tienes 27 copias de tu perfil sin darte cuenta, y ejecutas <code>updateOne({ "alumno": "..." }, ...)</code> para agregar tus proyectos e idiomas. <strong>¿Se actualizan las 27 copias o solo una?</strong>
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Miremos qué campos tiene cada una de las copias de esa persona:</span>
db.perfiles.<span class="fn">find</span>(
    { <span class="str">"alumno"</span>: <span class="str">"Nombre del Estudiante"</span> },
    { <span class="str">"skills"</span>: <span class="num">1</span>, <span class="str">"proyectos"</span>: <span class="num">1</span>, <span class="str">"idiomas"</span>: <span class="num">1</span>, <span class="str">"fecha_registro"</span>: <span class="num">1</span> }
);</pre>
            <div class="analogy-box">
                <strong>Lo que ocurrió en nuestra base de datos:</strong><br>
                <code>updateOne()</code> busca de arriba hacia abajo, modifica <strong>únicamente la primera copia que encuentra</strong> (la más antigua) y se detiene. Las otras 26 copias más nuevas quedaron incompletas con los datos viejos.
            </div>
        `
    },

    // 8
    {
        html: `
            <h2>🙋‍♂️ Duda Rápida: "¿Y Cómo Se Borran las 26 Copias Malas sin Borrar la Buena?"</h2>
            <div class="tip-box">
                <strong>Adelanto de la próxima clase (NO lo ejecutes hoy para no alterar la colección):</strong>
            </div>
            <div class="concept-box">
                Aunque las 27 copias tengan el mismo <code>alumno</code>, cada una tiene un <strong><code>_id</code> único distinto</strong>. Primero buscas el <code>_id</code> de la copia que sí tiene <code>proyectos</code>, y luego borras todas las demás usando el operador <strong><code>$ne</code></strong> (<em>Not Equal</em> / distinto de):
            </div>
            <pre><span class="cm">// Paso 1: Encontrar el _id de la única copia que sí tiene "proyectos"</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"alumno"</span>: <span class="str">"Nombre..."</span>, <span class="str">"proyectos"</span>: { <span class="kw">$exists</span>: <span class="kw">true</span> } });

<span class="cm">// Paso 2 (próxima clase): Borrar todas las copias de esa persona MENOS ese _id</span>
db.perfiles.<span class="fn">deleteMany</span>({
    <span class="str">"alumno"</span>: <span class="str">"Nombre..."</span>,
    <span class="str">"_id"</span>: { <span class="kw">$ne</span>: <span class="fn">ObjectId</span>(<span class="str">"6ae931fd...el_id_de_la_copia_buena"</span>) }
});</pre>
        `
    },

    // 9
    {
        html: `
            <h2>¿Cómo Miramos Solo los Datos que Nos Interesan sin Saturar la Pantalla?</h2>
            <div class="concept-box">
                Cuando un documento tiene muchos campos o la colección tiene decenas de registros, traer todo con <code>find({})</code> hace difícil leer el resultado. ¿Cómo pedimos <strong>solo ciertas columnas, ordenadas y en una cantidad acotada</strong>?
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Ver solo los últimos 5 registros (mostrando únicamente alumno, sección y fecha)</span>
db.perfiles.<span class="fn">find</span>(
    {},                                                          <span class="cm">// 1. Filtro (todos)</span>
    { <span class="str">"alumno"</span>: <span class="num">1</span>, <span class="str">"seccion"</span>: <span class="num">1</span>, <span class="str">"fecha_registro"</span>: <span class="num">1</span>, <span class="str">"_id"</span>: <span class="num">0</span> } <span class="cm">// 2. Qué campos mostrar (1) u ocultar (0)</span>
)
.<span class="fn">sort</span>({ <span class="str">"fecha_registro"</span>: -<span class="num">1</span> })                                  <span class="cm">// 3. Orden: -1 descendente, 1 ascendente</span>
.<span class="fn">limit</span>(<span class="num">5</span>);                                                       <span class="cm">// 4. Mostrar máximo 5 resultados</span></pre>
            <div class="tip-box">
                Combinar <strong>proyección + <code>sort()</code> + <code>limit()</code></strong> es la forma habitual de inspeccionar colecciones grandes sin llenar la pantalla.
            </div>
        `
    },

    // 10
    {
        html: `
            <h2>¿Qué Pasa si Cada Persona Escribe la Misma Carrera a su Manera?</h2>
            <div class="concept-box">
                Todos en la sala estudian la misma carrera. Entonces, si buscamos <code>db.perfiles.find({ "carrera": "Ingeniería en Informática" })</code>, ¿deberían aparecer todos?
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Veamos cómo escribieron realmente el campo "carrera":</span>
db.perfiles.<span class="fn">distinct</span>(<span class="str">"carrera"</span>);

<span class="cm">// Resultado en nuestra colección:</span>
<span class="cm">// [</span>
<span class="cm">//   "Ingenieria en Informatica",    --&gt; 26 documentos (sin tildes)</span>
<span class="cm">//   "Ingeniería en Informática",    --&gt; 37 documentos (con tildes y mayúsculas)</span>
<span class="cm">//   "Ingeniería en informática"     --&gt; 1 documento  (informática con minúscula)</span>
<span class="cm">// ]</span></pre>
            <div class="warning-box">
                <strong>¿Por qué importa?</strong> En MongoDB la búsqueda por igualdad es <strong>estrictamente exacta</strong>. Una tilde o una mayúscula distinta hace que para el motor sean textos diferentes, dejando a 27 documentos fuera del resultado.
            </div>
        `
    },

    // 11
    {
        html: `
            <h2>¿Ocurrió lo Mismo con las Tecnologías dentro de <code>skills</code>?</h2>
            <div class="concept-box">
                Si un reclutador quiere ver todas las habilidades técnicas del curso y ejecuta <code>db.perfiles.distinct("skills")</code>, recibe <strong>31 tecnologías distintas</strong>. Mira lo que hay adentro:
            </div>
            <table>
                <tr><th>Forma 1 en la colección</th><th>Forma 2 en la colección</th><th>Qué pasa al buscar solo la Forma 1</th></tr>
                <tr><td><code>"HTML"</code> (28 perfiles)</td><td><code>"Html"</code> (20 perfiles)</td><td>Pierdes 20 perfiles que sí saben HTML</td></tr>
                <tr><td><code>"CSS"</code> (28 perfiles)</td><td><code>"Css"</code> (18 perfiles)</td><td>Pierdes 18 perfiles que sí saben CSS</td></tr>
                <tr><td><code>"Oracle"</code> / <code>"Oracle SQL"</code></td><td><code>"Oracle sql"</code> / <code>"Oracle PL/SQL"</code></td><td>4 nombres distintos para la misma base</td></tr>
            </table>
            <div class="analogy-box">
                Esto nos lleva a una pregunta práctica: <strong>mientras los datos estén así, ¿cómo hacemos una consulta que rescate todas las variantes a la vez?</strong>
            </div>
        `
    },

    // 12
    {
        html: `
            <h2>¿Cómo Buscamos Varias Variantes a la Vez? (<code>$in</code> vs <code>$all</code>)</h2>
            <div class="concept-box">
                Cuando quieres buscar en un arreglo, hay dos preguntas muy distintas que puedes hacer:
                <br>• <em>"¿Quién tiene <strong>alguna</strong> de estas opciones?"</em> (sirve para unir variantes como <code>"HTML"</code> y <code>"Html"</code>).
                <br>• <em>"¿Quién domina <strong>todas</strong> estas tecnologías al mismo tiempo?"</em>
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// $in: que tenga AL MENOS UNA de la lista (une los 28 de "HTML" + los 20 de "Html" = 48)</span>
db.perfiles.<span class="fn">find</span>({
    <span class="str">"skills"</span>: { <span class="kw">$in</span>: [<span class="str">"HTML"</span>, <span class="str">"Html"</span>] }
});

<span class="cm">// $all: que tenga TODAS las de la lista en su mismo perfil (JavaScript Y ADEMÁS Python)</span>
db.perfiles.<span class="fn">find</span>({
    <span class="str">"skills"</span>: { <span class="kw">$all</span>: [<span class="str">"JavaScript"</span>, <span class="str">"Python"</span>] }
});</pre>
            <div class="tip-box">
                Piensa en <strong><code>$in</code> como un O</strong> (cualquiera sirve) y en <strong><code>$all</code> como un Y</strong> (deben estar todas). Ambos llevan siempre corchetes <code>[ ... ]</code>.
            </div>
        `
    },

    // 13
    {
        html: `
            <h2>🙋‍♂️ Duda Rápida: "Profe, ¿y si Alguien Escribió <code>htML</code> o <code>pyTHON</code>? ¿Cómo Sería?"</h2>
            <div class="concept-box">
                No tienes que adivinar las 16 combinaciones posibles de mayúsculas y minúsculas. En MongoDB puedes usar <strong>expresiones regulares con <code>/texto/i</code></strong> (la <strong><code>i</code></strong> significa <em>insensitive</em>: ignora mayúsculas y minúsculas), incluso <strong>adentro de <code>$in</code> y de <code>$all</code></strong>:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// 1. Buscar "html" sin importar si escribieron HTML, Html, htML o html (48 docs):</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"skills"</span>: /html/i });

<span class="cm">// 2. Buscar quienes sepan JavaScript Y Python aunque hayan escrito "pyTHON" o "javascript":</span>
db.perfiles.<span class="fn">find</span>({
    <span class="str">"skills"</span>: { <span class="kw">$all</span>: [ /^javascript$/i, /^python$/i ] }
});

<span class="cm">// 3. Y con ^ al inicio buscas textos que EMPIECEN con algo (ej: los 9 "PRUEBA - ..."):</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"alumno"</span>: /^PRUEBA/ });</pre>
            <div class="tip-box">
                <strong>¿Qué significan <code>^</code> y <code>$</code> en <code>/^python$/i</code>?</strong> Que coincida con la palabra completa de principio (<code>^</code>) a fin (<code>$</code>), ignorando mayúsculas (<code>i</code>).
            </div>
        `
    },

    // 14
    {
        html: `
            <h2>🙋‍♂️ Duda Rápida: "¿Y si el Problema No Son las Mayúsculas, sino las Tildes?"</h2>
            <div class="tip-box">
                <strong>Para los curiosos (no es obligatorio para la tarea, pero te servirá saberlo):</strong><br>
                La bandera <code>/i</code> ignora mayúsculas, pero <code>"Informática"</code> con tilde e <code>"Informatica"</code> sin tilde siguen siendo letras distintas. ¿Cómo se resuelve?
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Opción A (con expresión regular): poner [aá] o [ií] donde pueda faltar la tilde</span>
db.perfiles.<span class="fn">find</span>({
    <span class="str">"carrera"</span>: /ingenier[ií]a en inform[aá]tica/i
});   <span class="cm">// ¡Encuentra las 3 variantes (los 64 documentos)!</span>

<span class="cm">// Opción B (función avanzada de MongoDB): Collation en español con nivel 1</span>
<span class="cm">// Nivel 1 (strength: 1) le dice al motor: "ignora tanto mayúsculas como tildes"</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"carrera"</span>: <span class="str">"ingenieria en informatica"</span> })
           .<span class="fn">collation</span>({ locale: <span class="str">"es"</span>, strength: <span class="num">1</span> });</pre>
        `
    },

    // 15
    {
        html: `
            <h2>Volvamos al Misterio Inicial: ¿Cómo Encontramos a Quienes les Falta un Campo?</h2>
            <div class="concept-box">
                Al principio vimos que de los 71 documentos solo 65 tenían <code>seccion</code> y solo 64 tenían <code>carrera</code>. <strong>¿Cómo le pedimos a MongoDB que nos muestre justo los documentos donde un campo no está?</strong>
            </div>
            <div class="analogy-box">
                <strong>El recurso: <code>{ "campo": { $exists: booleano } }</code></strong><br>
                • <code>{ $exists: false }</code> devuelve los documentos que <strong>no tienen</strong> ese campo.<br>
                • <code>{ $exists: true }</code> devuelve los documentos que <strong>sí tienen</strong> ese campo.
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// ¿Cuáles son los 6 documentos que no tienen sección?</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"seccion"</span>: { <span class="kw">$exists</span>: <span class="kw">false</span> } });

<span class="cm">// ¿Hay algún documento que ni siquiera tenga el campo "alumno"?</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"alumno"</span>: { <span class="kw">$exists</span>: <span class="kw">false</span> } });</pre>
        `
    },

    // 16
    {
        html: `
            <h2>¿Qué Descubrimos al Buscar los Campos que Faltan?</h2>
            <div class="concept-box">
                Al ejecutar esas consultas con <code>$exists</code> en nuestra colección aparecen dos hallazgos muy interesantes:
            </div>
            <div class="warning-box">
                1. Hay <strong>1 documento completamente vacío</strong> (solo tiene <code>_id</code>; alguien ejecutó <code>insertOne({})</code>).<br>
                2. Varios compañeros sí pusieron su carrera o su fecha, pero <strong>cambiaron el nombre del campo</strong>: uno escribió <code>"Carrera"</code> con mayúscula, otro <code>"fecha-registro"</code> con guion y otro <code>"fecha registro"</code> con espacio.
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Comprobar quién escribió el nombre del campo distinto al resto:</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"Carrera"</span>: { <span class="kw">$exists</span>: <span class="kw">true</span> } });
db.perfiles.<span class="fn">find</span>({ <span class="str">"fecha-registro"</span>: { <span class="kw">$exists</span>: <span class="kw">true</span> } });
db.perfiles.<span class="fn">find</span>({ <span class="str">"fecha registro"</span>: { <span class="kw">$exists</span>: <span class="kw">true</span> } });</pre>
        `
    },

    // 17
    {
        html: `
            <h2>¿Qué Pasa Cuando Cada Uno Inventa su Propia Estructura?</h2>
            <div class="concept-box">
                Imagina que ahora queremos listar el GitHub o la disponibilidad de práctica de todo el curso. Al revisar los documentos reales, mira cómo lo guardó cada persona:
            </div>
            <pre class="compact"><span class="cm">// 5 formas distintas en que guardaron el mismo enlace de GitHub:</span>
<span class="str">"links"</span>: { <span class="str">"github"</span>: <span class="str">"https://github.com/..."</span> }   <span class="cm">// Objeto con clave en minúscula</span>
<span class="str">"links"</span>: { <span class="str">"GitHub"</span>: <span class="str">"https://github.com/..."</span> }   <span class="cm">// Objeto con clave en mayúscula</span>
<span class="str">"links"</span>: [ <span class="str">"https://github.com/..."</span> ]             <span class="cm">// Arreglo en vez de objeto</span>
<span class="str">"github"</span>: <span class="str">"github.com/..."</span>                        <span class="cm">// Suelto en la raíz del documento</span>
<span class="str">"Github: "</span>: <span class="str">"github.com/..."</span>                      <span class="cm">// Con dos puntos y espacio en el nombre</span>

<span class="cm">// Y en disponibilidad unos pusieron texto y otros pusieron un objeto:</span>
<span class="str">"disponibilidad"</span>: <span class="str">"Inmediata"</span>
<span class="str">"disponibilidad"</span>: { <span class="str">"practica"</span>: <span class="kw">true</span>, <span class="str">"modalidad"</span>: <span class="str">"híbrida"</span> }</pre>
            <div class="analogy-box">
                <strong>La gran lección:</strong> Que una base documental tenga <em>esquema flexible</em> significa que te deja guardar sin pedir permiso, pero <strong>si el equipo no acuerda una estructura común, después no hay cómo consultar esos datos de forma limpia</strong>.
            </div>
        `
    },

    // 18
    {
        html: `
            <h2>🙋‍♂️ Duda Rápida: "¿No Se Puede Obligar a MongoDB a Exigir los Campos como en SQL?"</h2>
            <div class="tip-box">
                <strong>Cultura general (no es el foco de hoy, pero es una duda muy válida):</strong><br>
                ¡Sí se puede! Aunque por defecto MongoDB no exige estructura, puedes configurar una regla llamada <strong><code>$jsonSchema</code></strong> en la colección para que rechace cualquier documento incompleto o con tipos equivocados:
            </div>
            <pre class="compact"><span class="cm">// Ejemplo de cómo se protege una colección en proyectos reales:</span>
db.<span class="fn">createCollection</span>(<span class="str">"perfiles_curados"</span>, {
    validator: {
        <span class="kw">$jsonSchema</span>: {
            bsonType: <span class="str">"object"</span>,
            required: [<span class="str">"alumno"</span>, <span class="str">"seccion"</span>, <span class="str">"carrera"</span>, <span class="str">"skills"</span>, <span class="str">"fecha_registro"</span>],
            properties: {
                seccion: { enum: [<span class="str">"003D"</span>, <span class="str">"004D"</span>] },
                skills:  { bsonType: <span class="str">"array"</span> }
            }
        }
    }
});</pre>
        `
    },

    // 19
    {
        html: `
            <h2>¿Por Qué un Perfil Tiene <code>"Node.js"</code> Repetido 22 Veces Seguidas?</h2>
            <div class="concept-box">
                Al mirar el arreglo <code>skills</code> de uno de los documentos de la colección, encontramos esto:
            </div>
            <pre><span class="str">"skills"</span>: [
  <span class="str">"HTML"</span>, <span class="str">"CSS"</span>, <span class="str">"JavaScript"</span>,
  <span class="str">"Node.js"</span>, <span class="str">"Node.js"</span>, <span class="str">"Node.js"</span>, <span class="str">"Node.js"</span>, <span class="str">"Node.js"</span>, <span class="str">"Node.js"</span> <span class="cm">// ... repetido 22 veces</span>
]</pre>
            <div class="analogy-box">
                <strong>¿Qué pasó aquí y cómo se evita?</strong><br>
                Quiso agregar una skill usando <strong><code>$push</code></strong> y presionó Play 22 veces.<br>
                • <strong><code>$push</code></strong> agrega el valor al final del arreglo siempre, aunque ya esté repetido.<br>
                • <strong><code>$addToSet</code></strong> comprueba primero si el valor ya existe en el arreglo; si ya está, no hace nada.
            </div>
        `
    },

    // 20
    {
        html: `
            <h2>🙋‍♂️ Duda Rápida: "¿Y Cómo Se Limpia Ese Arreglo que Ya Tiene 22 Veces <code>Node.js</code>?"</h2>
            <div class="tip-box">
                <strong>Adelanto de la próxima clase (tampoco lo ejecutes hoy):</strong><br>
                Para sacar un valor repetido de un arreglo existe el operador inverso a <code>$push</code>, llamado <strong><code>$pull</code></strong> (elimina todas las apariciones de ese valor en el arreglo), o bien puedes reescribir la lista limpia con <code>$set</code>:
            </div>
            <pre class="compact"><span class="cm">// Paso 1 (próxima clase): $pull saca TODAS las repeticiones de "Node.js" del arreglo</span>
db.perfiles.<span class="fn">updateOne</span>(
    { <span class="str">"alumno"</span>: <span class="str">"Nombre..."</span> },
    { <span class="kw">$pull</span>: { <span class="str">"skills"</span>: <span class="str">"Node.js"</span> } }
);

<span class="cm">// Paso 2: $addToSet lo vuelve a agregar una única vez y sin riesgo de duplicar</span>
db.perfiles.<span class="fn">updateOne</span>(
    { <span class="str">"alumno"</span>: <span class="str">"Nombre..."</span> },
    { <span class="kw">$addToSet</span>: { <span class="str">"skills"</span>: <span class="str">"Node.js"</span> } }
);</pre>
        `
    },

    // 21
    {
        html: `
            <h2>Entonces, ¿Qué Acuerdos Tomaremos para la Próxima Clase?</h2>
            <div class="concept-box">
                Cuando en la siguiente sesión limpiemos y creemos la colección curada, todos seguiremos esta misma plantilla para que ninguna consulta deje gente afuera:
            </div>
            <table>
                <tr><th>Nombre exacto del campo</th><th>Qué tipo de dato debe ser</th><th>Ejemplo acordado</th></tr>
                <tr><td><code>alumno</code></td><td>Texto (Nombre y Dos Apellidos)</td><td><code>"Camila Andrea Rojas Pérez"</code></td></tr>
                <tr><td><code>seccion</code></td><td>Texto en mayúscula</td><td><code>"003D"</code> o <code>"004D"</code></td></tr>
                <tr><td><code>carrera</code></td><td>Texto con tildes exactas</td><td><code>"Ingeniería en Informática"</code></td></tr>
                <tr><td><code>skills</code></td><td>Arreglo de textos (usando <code>$addToSet</code>)</td><td><code>["HTML", "CSS", "JavaScript", "Oracle"]</code></td></tr>
                <tr><td><code>estudios</code></td><td>Arreglo de objetos <code>{ institucion, titulo }</code></td><td><code>[{ "institucion": "Duoc UC", "titulo": "..." }]</code></td></tr>
                <tr><td><code>disponibilidad</code></td><td>Objeto <code>{ practica, modalidad }</code></td><td><code>{ "practica": true, "modalidad": "híbrida" }</code></td></tr>
                <tr><td><code>fecha_registro</code></td><td>Fecha BSON</td><td><code>new Date()</code></td></tr>
            </table>
        `
    },

    // 22
    {
        html: `
            <h2>Antes de Pasar a la Práctica: ¿Por Qué Hoy Solo Consultamos?</h2>
            <div class="warning-box">
                <strong>En los próximos 30 minutos vas a investigar la colección <code>perfiles</code>, pero hoy nadie debe modificar, insertar ni borrar documentos ahí.</strong><br>
                Si alguien borra los duplicados o corrige los errores ahora, el resto de tus compañeros ya no podrá encontrarlos cuando ejecute sus consultas.
            </div>
            <div class="tip-box">
                <strong>¿Quieres ensayar actualizaciones o borrados hoy mismo?</strong><br>
                Conéctate con tu propio <em>connection string</em> a <strong>tu cluster personal de Atlas</strong> y prueba ahí con total libertad. La limpieza oficial la haremos en la próxima clase.
            </div>
        `
    },

    // 23
    {
        html: `
            <h2>Tu Práctica de Hoy (30 Minutos): Investigar el Directorio</h2>
            <div class="concept-box">
                Abre en el menú lateral: <strong>📌 Tareas → Tarea 2: Detective de Datos en el Directorio</strong>.
            </div>
            <div class="analogy-box">
                <strong>¿Qué debes hacer y entregar?</strong><br>
                1. Resolver en tu Playground las preguntas de exploración sobre los 71 documentos de <code>perfiles</code>.<br>
                2. Pegar en un <strong>PPT simple las capturas de pantalla</strong> donde se vean tus consultas ejecutadas, los resultados y las 3 reglas que propones.<br>
                3. Enviarlo por mensaje en <strong>AVA</strong> al docente <strong>Carlos Orellana</strong> con copia al correo.
            </div>
        `
    },

    // 24
    {
        html: `
            <h2>Resumen: ¿Qué Herramienta Uso Según lo que Quiero Saber?</h2>
            <table>
                <tr><th>La pregunta que quieres responder</th><th>Cómo se la preguntas a MongoDB</th></tr>
                <tr><td>¿Cuántos documentos hay o cuántos cumplen algo?</td><td><code>db.perfiles.countDocuments({ ... })</code></td></tr>
                <tr><td>¿Qué valores distintos existen sin repetir?</td><td><code>db.perfiles.distinct("campo")</code></td></tr>
                <tr><td>¿Cómo veo solo algunos campos, ordenados y pocos?</td><td><code>find({}, { campo: 1, _id: 0 }).sort({ campo: -1 }).limit(5)</code></td></tr>
                <tr><td>¿Quién tiene alguna de estas opciones en su lista?</td><td><code>{ "skills": { $in: ["HTML", "Html"] } }</code></td></tr>
                <tr><td>¿Quién tiene todas estas opciones a la vez?</td><td><code>{ "skills": { $all: ["JavaScript", "Python"] } }</code></td></tr>
                <tr><td>¿Cómo busco ignorando mayúsculas o dentro de <code>$all</code>?</td><td><code>{ "skills": /html/i }</code> o <code>{ $all: [ /^js$/i, /^python$/i ] }</code></td></tr>
                <tr><td>¿A qué documentos les falta (o sí tienen) un campo?</td><td><code>{ "campo": { $exists: false } }</code> / <code>true</code></td></tr>
            </table>
            <div class="alien-separator">👽</div>
        `
    }

];
