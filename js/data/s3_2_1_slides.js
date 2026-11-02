// s3_2_1_slides.js — Fundamentos de Bases de Datos NoSQL con MongoDB Atlas
// Unidad 3.2 — Sesión 1: Documentos, Atlas y Operaciones Create & Read
// Caso: Directorio de Talento del Curso (perfiles / CV en una colección compartida)

const s3_2_1_slides = [
    // 1
    {
        class: 'title-slide',
        html: `
            <h1>Fundamentos de Bases de Datos NoSQL</h1>
            <p class="subtitle">Unidad 3.2 — Sesión 1: Documentos con MongoDB Atlas</p>
            <p class="subtitle">Caso: Directorio de Talento del Curso</p>
            <div class="alien-separator">👽</div>
        `
    },

    // 2
    {
        html: `
            <h2>La Ruta de Hoy</h2>
            <div class="concept-box">
                Hoy vas a conocer una forma distinta de guardar datos, y la vas a usar de inmediato con tu propio perfil profesional.
            </div>
            <div class="analogy-box">
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li><strong>El problema:</strong> por qué un CV incomoda a un modelo de tablas.</li>
                    <li><strong>La idea:</strong> guardar a cada persona como un documento.</li>
                    <li><strong>El entorno:</strong> MongoDB Atlas conectado a VS Code.</li>
                    <li><strong>La práctica:</strong> subir tu perfil al directorio compartido y consultar a tus compañeros.</li>
                    <li><strong>La evidencia:</strong> capturas de tu trabajo en un PPT.</li>
                </ol>
            </div>
        `
    },

    // 3
    {
        html: `
            <h2>El Escenario: Un Directorio de Talento</h2>
            <div class="concept-box">
                El curso arma un <strong>directorio de talento</strong>: cada estudiante sube su perfil para que se pueda buscar, por ejemplo, <em>"¿quién sabe Oracle y está disponible para práctica?"</em>
            </div>
            <div class="analogy-box">
                <strong>🧑‍💻 Perfil de Camila Rojas</strong><br>
                • <strong>Carrera:</strong> Ingeniería en Informática<br>
                • <strong>Skills:</strong> Oracle, PL/SQL, Git<br>
                • <strong>Estudios:</strong> 1 carrera en curso<br>
                • <strong>Experiencia:</strong> Ayudante de laboratorio (2025)<br>
                • <strong>Link:</strong> su GitHub
            </div>
            <div class="tip-box">
                Todo eso es <strong>un solo CV</strong>. Piensa cómo lo guardarías en Oracle.
            </div>
        `
    },

    // 4
    {
        html: `
            <h2>El Dolor #1 en SQL: Un CV en 6 Tablas</h2>
            <div class="concept-box">
                Con normalización, un perfil se reparte en varias tablas relacionadas por claves foráneas:
            </div>
            <pre>PERSONA(id_persona, nombre, carrera, seccion)
ESTUDIO(id_estudio, id_persona, institucion, titulo)
EXPERIENCIA(id_experiencia, id_persona, empresa, cargo)
SKILL(id_skill, nombre)
PERSONA_SKILL(id_persona, id_skill)
PROYECTO(id_proyecto, id_persona, nombre, url)</pre>
            <div class="warning-box">
                6 tablas y 5 claves foráneas, solo para guardar <strong>una ficha de una persona</strong>.
            </div>
        `
    },

    // 5
    {
        html: `
            <h2>El Dolor #2 en SQL: Volver a Armar el CV</h2>
            <div class="concept-box">
                Para mostrar el perfil de Camila, hay que juntar de nuevo todas las piezas con JOINs:
            </div>
            <pre><span class="cm">-- Armar UN perfil en Oracle</span>
<span class="kw">SELECT</span> p.nombre, e.titulo, x.cargo, s.nombre
<span class="kw">FROM</span> persona p
<span class="kw">JOIN</span> estudio e          <span class="kw">ON</span> e.id_persona = p.id_persona
<span class="kw">LEFT</span> <span class="kw">JOIN</span> experiencia x <span class="kw">ON</span> x.id_persona = p.id_persona
<span class="kw">JOIN</span> persona_skill ps   <span class="kw">ON</span> ps.id_persona = p.id_persona
<span class="kw">JOIN</span> skill s            <span class="kw">ON</span> s.id_skill = ps.id_skill
<span class="kw">WHERE</span> p.id_persona = 1;</pre>
            <div class="warning-box">
                El resultado vuelve en <strong>filas repetidas</strong> (una por cada combinación de skill y experiencia). Y si un compañero tiene GitHub o certificaciones y otro no, necesitas más columnas con <code>NULL</code> o más tablas.
            </div>
        `
    },

    // 6
    {
        html: `
            <h2>La Solución: Una Persona = Un Documento</h2>
            <div class="concept-box">
                En el modelo documental, el perfil completo se guarda <strong>junto</strong>, tal como se lee:
            </div>
            <pre class="compact">{
  <span class="str">"alumno"</span>: <span class="str">"Camila Rojas Pérez"</span>,
  <span class="str">"seccion"</span>: <span class="str">"001D"</span>,
  <span class="str">"carrera"</span>: <span class="str">"Ingeniería en Informática"</span>,
  <span class="str">"skills"</span>: [<span class="str">"Oracle"</span>, <span class="str">"PL/SQL"</span>, <span class="str">"Git"</span>],
  <span class="str">"estudios"</span>: [
    { <span class="str">"institucion"</span>: <span class="str">"Instituto Profesional"</span>, <span class="str">"titulo"</span>: <span class="str">"Ingeniería en Informática"</span> }
  ],
  <span class="str">"experiencia"</span>: [
    { <span class="str">"empresa"</span>: <span class="str">"Laboratorio TI"</span>, <span class="str">"cargo"</span>: <span class="str">"Ayudante de laboratorio"</span>, <span class="str">"anio"</span>: <span class="num">2025</span> }
  ],
  <span class="str">"links"</span>: { <span class="str">"github"</span>: <span class="str">"github.com/camila-rojas"</span> }
}</pre>
        `
    },

    // 7
    {
        html: `
            <h2>La Idea Central del Modelo Documental</h2>
            <div class="concept-box">
                <strong>Guarda juntos los datos que se leen juntos.</strong> Las listas (skills, estudios, experiencia) viven <em>dentro</em> del documento, como arreglos y subdocumentos.
            </div>
            <div class="analogy-box">
                <strong>Oracle:</strong> tu CV está desarmado en 6 cajones y cada vez que lo necesitas lo vuelves a armar con JOIN.<br><br>
                <strong>MongoDB:</strong> tu CV está guardado como una carpeta completa, lista para leer de una sola vez.
            </div>
            <div class="tip-box">
                Un documento puede tener campos que otro no tiene. No hay que modificar ninguna tabla para agregar un campo nuevo.
            </div>
        `
    },

    // 8
    {
        html: `
            <h2>¿Qué es NoSQL?</h2>
            <div class="concept-box">
                <strong>NoSQL</strong> significa <em>Not Only SQL</em>: bases de datos no relacionales, que no obligan a definir tablas con columnas fijas antes de guardar datos. Hay varias familias:
            </div>
            <table>
                <tr><th>Familia</th><th>Ejemplo</th><th>Se usa para</th></tr>
                <tr><td><strong>Documental</strong></td><td>MongoDB</td><td>Perfiles, catálogos, publicaciones</td></tr>
                <tr><td>Clave-valor</td><td>Redis</td><td>Sesiones, caché</td></tr>
                <tr><td>Columnar</td><td>Cassandra</td><td>Volúmenes masivos de datos</td></tr>
                <tr><td>Grafos</td><td>Neo4j</td><td>Redes de relaciones, recomendaciones</td></tr>
            </table>
            <div class="analogy-box">
                NoSQL no reemplaza a Oracle: es <strong>otra herramienta en la caja</strong>. Hoy usamos la documental.
            </div>
        `
    },

    // 9
    {
        html: `
            <h2>¿Cuándo Usar Cada Una?</h2>
            <table>
                <tr><th style="width:50%">Conviene documental (MongoDB)</th><th>Conviene relacional (Oracle)</th></tr>
                <tr>
                    <td>Datos que se leen como un bloque (perfiles, catálogos, publicaciones)</td>
                    <td>Muchas relaciones cruzadas (ventas, inventario, reservas)</td>
                </tr>
                <tr>
                    <td>Registros con campos distintos entre sí</td>
                    <td>Transacciones críticas (pagos)</td>
                </tr>
                <tr>
                    <td>Estructura que cambia seguido</td>
                    <td>Integridad estricta (FK, CHECK, restricciones)</td>
                </tr>
                <tr>
                    <td>Listas dentro de un registro</td>
                    <td>Reportes con JOINs complejos</td>
                </tr>
            </table>
            <div class="tip-box">
                Elegir NoSQL no es "ser más moderno": se elige según <strong>cómo se usan los datos</strong>. Un perfil profesional encaja bien en documentos; un sistema de pagos, mejor en Oracle.
            </div>
        `
    },

    // 10
    {
        html: `
            <h2>Diccionario: De Oracle a MongoDB</h2>
            <div class="concept-box">
                Traduce lo que ya sabes de Oracle:
            </div>
            <table>
                <tr><th>Oracle (relacional)</th><th>MongoDB (documental)</th><th>En nuestro caso</th></tr>
                <tr><td>Base de datos / esquema</td><td><strong>Database</strong></td><td><code>directorio_talento</code></td></tr>
                <tr><td>Tabla</td><td><strong>Colección</strong></td><td><code>perfiles</code></td></tr>
                <tr><td>Fila</td><td><strong>Documento</strong></td><td>El perfil de una persona</td></tr>
                <tr><td>Columna</td><td><strong>Campo</strong></td><td><code>alumno</code>, <code>skills</code></td></tr>
                <tr><td>Clave primaria</td><td><code>_id</code></td><td>Lo crea MongoDB</td></tr>
                <tr><td>INSERT / SELECT</td><td><code>insertOne</code> / <code>find</code></td><td></td></tr>
            </table>
        `
    },

    // 11
    {
        html: `
            <h2>El Lenguaje del Documento: JSON</h2>
            <div class="concept-box">
                Un documento es un conjunto de pares <code>"clave": valor</code> escritos en formato <strong>JSON</strong>. Solo hay 6 tipos de valor:
            </div>
            <table>
                <tr><th>Tipo</th><th>Ejemplo en un perfil</th></tr>
                <tr><td>Texto</td><td><code>"carrera": "Ingeniería en Informática"</code></td></tr>
                <tr><td>Número</td><td><code>"anio": 2025</code></td></tr>
                <tr><td>Booleano</td><td><code>"practica": true</code></td></tr>
                <tr><td>Arreglo (lista)</td><td><code>"skills": ["Oracle", "Git"]</code></td></tr>
                <tr><td>Objeto (subdocumento)</td><td><code>"links": { "github": "..." }</code></td></tr>
                <tr><td>Nulo</td><td><code>"certificaciones": null</code></td></tr>
            </table>
            <div class="analogy-box">
                <strong>Objeto</strong> = una ficha con campos. <strong>Arreglo</strong> = una lista dentro de la ficha.
            </div>
        `
    },

    // 12
    {
        html: `
            <h2>BSON y el Campo <code>_id</code></h2>
            <div class="concept-box">
                MongoDB guarda los documentos en <strong>BSON</strong>: un JSON en formato binario que agrega tipos útiles como <code>Date</code> y <code>ObjectId</code>.
            </div>
            <pre><span class="str">"fecha_registro"</span>: <span class="kw">new</span> <span class="fn">Date</span>()    <span class="cm">// tipo Date, no es un simple texto</span>
<span class="str">"_id"</span>: <span class="fn">ObjectId</span>(<span class="str">"652cf3a9f1b2c3d4e5f6a7b8"</span>)   <span class="cm">// lo genera MongoDB</span></pre>
            <div class="tip-box">
                Si no entregas un <code>_id</code>, MongoDB crea uno automáticamente (<code>ObjectId</code>). Es el equivalente a la clave primaria, y <strong>lo tienes que dejar tal cual</strong>.
            </div>
        `
    },

    // 13
    {
        html: `
            <h2>La Nube: MongoDB Atlas</h2>
            <div class="concept-box">
                <strong>Atlas</strong> es MongoDB como servicio en la nube: no instalas nada en tu computador, el servidor ya está funcionando.
            </div>
            <pre>Cluster              sandboxprofecarlos
  └─ Base de datos   directorio_talento
       └─ Colección  perfiles
            └─ Documento   { alumno: "...", skills: [...] }</pre>
            <div class="analogy-box">
                Edificio → piso → archivador → carpeta. Hoy <strong>todo el curso entra al mismo edificio</strong> y trabaja en el mismo archivador.
            </div>
        `
    },

    // 14
    {
        html: `
            <h2>Tu Llave de Acceso: El Connection String</h2>
            <div class="concept-box">
                Una sola línea le dice a VS Code a qué cluster conectarse y con qué usuario:
            </div>
            <pre><span class="kw">mongodb+srv://</span><span class="str">user_bd_cv_todas_las_secciones</span>:<span class="err">&lt;db_password&gt;</span><span class="kw">@</span><span class="fn">sandboxprofecarlos.msifp5s.mongodb.net</span>/</pre>
            <div class="warning-box">
                • La clave <strong>no está publicada</strong>: el docente te la entrega por mensaje.<br>
                • Reemplaza <code>&lt;db_password&gt;</code> <strong>completo, incluidos los símbolos &lt; y &gt;</strong>.<br>
                • Nunca subas esta línea con la clave a GitHub ni la dejes visible en tus capturas.
            </div>
        `
    },

    // 15
    {
        html: `
            <h2>Conectar desde VS Code</h2>
            <div class="concept-box">
                Usamos la extensión oficial <strong>MongoDB for VS Code</strong>.
            </div>
            <div class="analogy-box">
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li>Abre el panel de MongoDB (ícono de la hoja verde en la barra lateral).</li>
                    <li>Presiona <strong>Add Connection</strong> y elige <strong>Connect with Connection String</strong>.</li>
                    <li>Pega el connection string con tu clave ya completada.</li>
                    <li>Presiona <strong>Connect</strong>. El cluster aparece en el árbol del panel.</li>
                </ol>
            </div>
            <div class="tip-box">
                Si no conecta: revisa que no queden los símbolos <code>&lt; &gt;</code> y que la clave esté bien copiada.
            </div>
        `
    },

    // 16
    {
        html: `
            <h2>Tu Cuaderno de Trabajo: el Playground</h2>
            <div class="concept-box">
                Un <strong>Playground</strong> es un archivo <code>.mongodb.js</code> donde escribes JavaScript de MongoDB y lo ejecutas con el botón <strong>Play ▶</strong>.
            </div>
            <pre><span class="cm">// Primera línea de todo playground: elegir la base de datos</span>
<span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Pregunta: ¿cuántos perfiles hay hasta ahora?</span>
db.perfiles.<span class="fn">countDocuments</span>();</pre>
            <div class="tip-box">
                El Playground muestra solo el resultado de <strong>la última instrucción</strong>. Para ver cada consulta por separado, comenta las demás con <code>//</code> o selecciona las líneas y usa <em>Run Selected Lines From Playground</em>.
            </div>
        `
    },

    // 17
    {
        html: `
            <h2>Aviso: Todos Trabajan en la Misma Colección</h2>
            <div class="warning-box">
                Todo el curso usa el <strong>mismo usuario</strong> y la <strong>misma colección</strong> (<code>perfiles</code>). Es intencional: es el directorio de todos. Pero tiene un riesgo real: cualquier persona podría <strong>borrar o modificar documentos de otros por error</strong>.
            </div>
            <div class="analogy-box">
                <strong>Reglas del directorio:</strong><br>
                1. Solo modificas o borras <strong>tu</strong> documento.<br>
                2. En todo <code>update</code> o <code>delete</code>, el filtro lleva siempre tu <code>alumno</code>.<br>
                3. <strong>Prohibido:</strong> <code>deleteMany({})</code>, <code>updateMany({})</code>, <code>drop()</code>.<br>
                4. No subas RUT, teléfono, dirección ni fecha de nacimiento.
            </div>
        `
    },

    // 18
    {
        html: `
            <h2>Si Eres de los Primeros en Llegar</h2>
            <div class="concept-box">
                Es posible que la base <code>directorio_talento</code> y la colección <code>perfiles</code> <strong>todavía no existan</strong>. No es un error.
            </div>
            <div class="analogy-box">
                • <strong>Eres el primero:</strong> te toca crearlas. El <code>use()</code> selecciona la base y tu primer <code>insertOne</code> crea base y colección.<br>
                • <strong>Ya existen:</strong> solo úsalas, con exactamente los mismos nombres.
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// 0 = eres el primero  |  mayor que 0 = ya existe</span>
db.perfiles.<span class="fn">countDocuments</span>();</pre>
            <div class="warning-box">
                Respeta mayúsculas y minúsculas: <code>Perfiles</code> y <code>perfiles</code> son colecciones distintas.
            </div>
        `
    },

    // 19
    {
        html: `
            <h2>Diseña tu Documento</h2>
            <div class="concept-box">
                Tu perfil debe tener estos campos mínimos:
            </div>
            <table>
                <tr><th>Campo</th><th>Tipo</th><th>Obligatorio</th></tr>
                <tr><td><code>alumno</code></td><td>Texto (nombre completo)</td><td>Sí</td></tr>
                <tr><td><code>seccion</code></td><td>Texto</td><td>Sí</td></tr>
                <tr><td><code>carrera</code></td><td>Texto</td><td>Sí</td></tr>
                <tr><td><code>skills</code></td><td>Arreglo de textos (mínimo 3)</td><td>Sí</td></tr>
                <tr><td><code>estudios</code></td><td>Arreglo de subdocumentos</td><td>Sí (1)</td></tr>
                <tr><td><code>experiencia</code></td><td>Arreglo de subdocumentos</td><td>Opcional</td></tr>
                <tr><td><code>fecha_registro</code></td><td>Date</td><td>Sí</td></tr>
            </table>
        `
    },

    // 20
    {
        html: `
            <h2>Campos Opcionales: Modo Portafolio</h2>
            <div class="concept-box">
                Si quieres un perfil más completo, agrega solo los que apliquen a ti:
            </div>
            <table>
                <tr><th>Campo</th><th>Forma</th></tr>
                <tr><td><code>proyectos</code></td><td>Arreglo de <code>{ nombre, descripcion, tecnologias: [...], url }</code></td></tr>
                <tr><td><code>certificaciones</code></td><td>Arreglo de <code>{ nombre, entidad, anio }</code></td></tr>
                <tr><td><code>idiomas</code></td><td>Arreglo de <code>{ idioma, nivel }</code></td></tr>
                <tr><td><code>links</code></td><td>Objeto <code>{ github, linkedin, portafolio }</code></td></tr>
                <tr><td><code>disponibilidad</code></td><td>Objeto <code>{ practica: true, modalidad: "híbrida" }</code></td></tr>
            </table>
            <div class="tip-box">
                No todos los perfiles tendrán los mismos campos, y está bien: eso en Oracle sería una tabla con muchos <code>NULL</code>. Usa solo enlaces públicos.
            </div>
        `
    },

    // 21
    {
        html: `
            <h2>Crear tu Perfil con <code>insertOne()</code></h2>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);   <span class="cm">// si no existe, se crea al insertar</span>

db.perfiles.<span class="fn">insertOne</span>({
    <span class="str">"alumno"</span>: <span class="str">"Camila Rojas Pérez"</span>,          <span class="cm">// TU nombre completo</span>
    <span class="str">"seccion"</span>: <span class="str">"001D"</span>,                       <span class="cm">// TU sección</span>
    <span class="str">"carrera"</span>: <span class="str">"Ingeniería en Informática"</span>,
    <span class="str">"skills"</span>: [<span class="str">"Oracle"</span>, <span class="str">"PL/SQL"</span>, <span class="str">"Git"</span>],   <span class="cm">// Arreglo de textos</span>
    <span class="str">"estudios"</span>: [                            <span class="cm">// Arreglo de subdocumentos</span>
        { <span class="str">"institucion"</span>: <span class="str">"Instituto Profesional"</span>, <span class="str">"titulo"</span>: <span class="str">"Ingeniería en Informática"</span> }
    ],
    <span class="str">"experiencia"</span>: [],                       <span class="cm">// Arreglo vacío es válido</span>
    <span class="str">"fecha_registro"</span>: <span class="kw">new</span> <span class="fn">Date</span>()             <span class="cm">// Fecha y hora actual (BSON)</span>
});</pre>
            <div class="warning-box">
                Usa <strong>tus datos</strong>, no copies el ejemplo. Y ejecútalo <strong>una sola vez</strong>: si lo repites, se crea un perfil duplicado.
            </div>
        `
    },

    // 22
    {
        html: `
            <h2>Leer: <code>find()</code> y <code>countDocuments()</code></h2>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Tu perfil (filtro por igualdad)</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"alumno"</span>: <span class="str">"Camila Rojas Pérez"</span> });

<span class="cm">// Todos los perfiles de tu sección</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"seccion"</span>: <span class="str">"001D"</span> });

<span class="cm">// Cuántos perfiles hay en el directorio</span>
db.perfiles.<span class="fn">countDocuments</span>();

<span class="cm">// Todo el directorio (filtro vacío)</span>
db.perfiles.<span class="fn">find</span>({});</pre>
            <div class="tip-box">
                Recuerda: se muestra solo la <strong>última</strong> instrucción. Ejecuta una a la vez.
            </div>
        `
    },

    // 23
    {
        html: `
            <h2>Buscar Talento Dentro de los Arreglos</h2>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Quiénes saben Oracle (busca dentro del arreglo skills)</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"skills"</span>: <span class="str">"Oracle"</span> });

<span class="cm">// Quiénes saben Oracle O MongoDB</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"skills"</span>: { <span class="kw">$in</span>: [<span class="str">"Oracle"</span>, <span class="str">"MongoDB"</span>] } });

<span class="cm">// Quiénes saben Oracle Y Git (las dos)</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"skills"</span>: { <span class="kw">$all</span>: [<span class="str">"Oracle"</span>, <span class="str">"Git"</span>] } });

<span class="cm">// Quiénes tienen GitHub (el campo existe)</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"links.github"</span>: { <span class="kw">$exists</span>: <span class="kw">true</span> } });</pre>
            <div class="analogy-box">
                <code>$in</code> = <strong>alguna</strong> de la lista. <code>$all</code> = <strong>todas</strong> las de la lista. Con subdocumentos se usa punto y comillas: <code>"links.github"</code>.
            </div>
        `
    },

    // 24
    {
        html: `
            <h2>Una Lista de Talento: Proyección, Orden y Límite</h2>
            <div class="concept-box">
                Queremos ver solo nombre, sección y skills de quienes saben Oracle, ordenados de la A a la Z:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.perfiles.<span class="fn">find</span>(
    { <span class="str">"skills"</span>: <span class="str">"Oracle"</span> },                                  <span class="cm">// 1. Filtro</span>
    { <span class="str">"alumno"</span>: <span class="num">1</span>, <span class="str">"seccion"</span>: <span class="num">1</span>, <span class="str">"skills"</span>: <span class="num">1</span>, <span class="str">"_id"</span>: <span class="num">0</span> }     <span class="cm">// 2. Proyección (1 = mostrar, 0 = ocultar)</span>
)
.<span class="fn">sort</span>({ <span class="str">"alumno"</span>: <span class="num">1</span> })                                       <span class="cm">// 3. Orden (1 = A→Z, -1 = Z→A)</span>
.<span class="fn">limit</span>(<span class="num">10</span>);                                                  <span class="cm">// 4. Máximo 10 resultados</span></pre>
            <div class="tip-box">
                No se pueden mezclar <code>1</code> y <code>0</code> en la proyección. La única excepción es <code>"_id": 0</code>.
            </div>
        `
    },

    // 25
    {
        html: `
            <h2>Actualizar tu Perfil con <code>updateOne()</code></h2>
            <div class="concept-box">
                Para agregar o cambiar algo en un documento sin reescribirlo completo se usa <code>updateOne(filtro, cambio)</code>:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Agregar una skill nueva al arreglo (sin duplicarla)</span>
db.perfiles.<span class="fn">updateOne</span>(
    { <span class="str">"alumno"</span>: <span class="str">"Camila Rojas Pérez"</span> },        <span class="cm">// FILTRO: siempre TU nombre</span>
    { <span class="kw">$addToSet</span>: { <span class="str">"skills"</span>: <span class="str">"Docker"</span> } }      <span class="cm">// CAMBIO: agrega si no existe</span>
);

<span class="cm">// Agregar un campo nuevo (o cambiar uno existente)</span>
db.perfiles.<span class="fn">updateOne</span>(
    { <span class="str">"alumno"</span>: <span class="str">"Camila Rojas Pérez"</span> },
    { <span class="kw">$set</span>: { <span class="str">"disponibilidad"</span>: { <span class="str">"practica"</span>: <span class="kw">true</span>, <span class="str">"modalidad"</span>: <span class="str">"híbrida"</span> } } }
);</pre>
            <div class="warning-box">
                Sin filtro propio (<code>{}</code>), el cambio caería en el documento de otra persona. <code>$push</code> agrega al arreglo aunque el valor ya exista; <code>$addToSet</code> lo evita.
            </div>
        `
    },

    // 26
    {
        html: `
            <h2>Eliminar con <code>deleteOne()</code>: Practica con un Documento de Prueba</h2>
            <div class="concept-box">
                <code>deleteOne(filtro)</code> elimina <strong>un</strong> documento. Para practicar sin riesgo, crea un documento de prueba con un nombre único y elimina solo ese:
            </div>
            <pre class="compact xs"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// 1. Documento de prueba (nombre único: "PRUEBA - " + tu nombre)</span>
db.perfiles.<span class="fn">insertOne</span>({
    <span class="str">"alumno"</span>: <span class="str">"PRUEBA - Camila Rojas Pérez"</span>,
    <span class="str">"seccion"</span>: <span class="str">"001D"</span>,
    <span class="str">"skills"</span>: [<span class="str">"borrar"</span>],
    <span class="str">"fecha_registro"</span>: <span class="kw">new</span> <span class="fn">Date</span>()
});

<span class="cm">// 2. Comprobar que existe</span>
db.perfiles.<span class="fn">find</span>({ <span class="str">"alumno"</span>: <span class="str">"PRUEBA - Camila Rojas Pérez"</span> });

<span class="cm">// 3. Eliminar SOLO ese documento</span>
db.perfiles.<span class="fn">deleteOne</span>({ <span class="str">"alumno"</span>: <span class="str">"PRUEBA - Camila Rojas Pérez"</span> });</pre>
            <pre><span class="err">// NUNCA: esto borra a TODO el curso
db.perfiles.deleteMany({});
db.perfiles.drop();</span></pre>
            <div class="tip-box">
                Si duplicaste tu perfil por error, verifica con <code>countDocuments({ "alumno": "..." })</code> y usa <code>deleteOne</code> con tu nombre exacto.
            </div>
        `
    },

    // 27
    {
        html: `
            <h2>Tu Tarea Está en el Menú</h2>
            <div class="concept-box">
                Todo lo que viste en esta presentación es lo que necesitas para hacerla. Las instrucciones <strong>no están aquí</strong>: están en una página aparte.
            </div>
            <div class="analogy-box">
                <strong>📌 Dónde encontrarla:</strong><br>
                En el menú lateral, sección <strong>Tareas</strong> → <em>Tarea: Tu Perfil en el Directorio de Talento</em>.<br><br>
                Ahí vas a ver <strong>qué debes hacer</strong> y <strong>qué debes entregar</strong>, con tus misiones y una casilla para marcar tu avance.
            </div>
            <div class="warning-box">
                Recuerda: es el mismo directorio para todo el curso. Modifica o elimina solo tu documento.
            </div>
        `
    },

    // 28
    {
        html: `
            <h2>Resumen</h2>
            <div class="concept-box">
                Lo que llevas de hoy:
            </div>
            <ul style="margin: 0.75rem 0 0 1.2rem; line-height: 2;">
                <li>📄 <strong>Documento:</strong> los datos que se leen juntos se guardan juntos (arreglos y subdocumentos).</li>
                <li>🔀 <strong>NoSQL no reemplaza a SQL:</strong> se elige según cómo se usan los datos.</li>
                <li>☁️ <strong>Atlas + VS Code:</strong> cluster en la nube, connection string y Playground.</li>
                <li>✍️ <strong>Crear:</strong> <code>insertOne</code>, con base y colección creadas al insertar.</li>
                <li>🔍 <strong>Leer:</strong> <code>find</code>, <code>$in</code>, <code>$all</code>, <code>$exists</code>, proyección y <code>sort</code>.</li>
                <li>🔄 <strong>Actualizar y eliminar:</strong> <code>updateOne</code> con <code>$set</code> y <code>$addToSet</code>, y <code>deleteOne</code>.</li>
                <li>⚠️ <strong>Cuidado:</strong> en una colección compartida, el filtro siempre lleva tu nombre.</li>
            </ul>
            <div class="alien-separator">👽</div>
        `
    }

];
