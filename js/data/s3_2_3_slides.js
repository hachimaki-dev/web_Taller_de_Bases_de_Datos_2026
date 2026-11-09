// s3_2_3_slides.js — Nuevas Colecciones, Lotes y Operadores de Búsqueda en MongoDB
// Unidad 3.2 — Sesión 3: De SQL Básico (INSERT y SELECT WHERE) a MongoDB con el Portal de Ofertas Laborales

const s3_2_3_slides = [
    // 1
    {
        class: 'title-slide',
        html: `
            <h1>Colecciones, Lotes y Operadores de Búsqueda</h1>
            <p class="subtitle">Unidad 3.2 — Sesión 3: El equivalente al <code>INSERT</code> y <code>SELECT ... WHERE</code> de SQL en MongoDB</p>
            <p class="subtitle">Caso Práctico: Portal de Ofertas Laborales TI</p>
            <div class="alien-separator">👽</div>
        `
    },

    // 2
    {
        html: `
            <h2>Objetivo y Ruta de Hoy</h2>
            <div class="concept-box">
                <strong>Objetivo de la sesión:</strong> Crear nuevas colecciones desde cero, insertar varios documentos de una sola vez y dominar los <strong>operadores de comparación y lógicos</strong> para filtrar datos igual que en un <code>SELECT ... WHERE</code> de SQL.
            </div>
            <div class="analogy-box">
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li><strong>Nuevas colecciones e inserción por lotes:</strong> <code>empresas</code> y <code>ofertas</code> con <code>insertMany()</code>.</li>
                    <li><strong>Comparar números y rangos:</strong> <code>$gt</code>, <code>$gte</code>, <code>$lt</code>, <code>$lte</code> y <code>$ne</code>.</li>
                    <li><strong>Incluir o excluir listas:</strong> <code>$in</code> y <code>$nin</code>.</li>
                    <li><strong>Combinar condiciones (<code>AND</code> y <code>OR</code>):</strong> comas implícitas y el operador <code>$or</code>.</li>
                    <li><strong>🚀 Contenido Extra (al final):</strong> <code>$size</code>, <code>$elemMatch</code> y paginación con <code>.skip()</code>.</li>
                </ol>
            </div>
        `
    },

    // 3
    {
        html: `
            <h2>El Nuevo Escenario: Un Portal de Ofertas Laborales</h2>
            <div class="concept-box">
                En las sesiones anteriores armamos la colección <code>perfiles</code> con los CV del curso. Hoy daremos el siguiente paso en la misma base <code>directorio_talento</code>: crearemos las colecciones de <strong><code>empresas</code></strong> y <strong><code>ofertas</code></strong> laborales.
            </div>
            <table>
                <tr><th>Colección</th><th>¿Qué guarda cada documento?</th><th>Campos principales</th></tr>
                <tr>
                    <td><code>perfiles</code></td>
                    <td>CV de cada estudiante (Sesiones 1 y 2)</td>
                    <td><code>alumno</code>, <code>seccion</code>, <code>skills</code></td>
                </tr>
                <tr>
                    <td><strong><code>empresas</code></strong></td>
                    <td>Datos de cada empresa que ofrece trabajo</td>
                    <td><code>nombre</code>, <code>rubro</code>, <code>empleados</code>, <code>ciudad</code>, <code>creado_por</code></td>
                </tr>
                <tr>
                    <td><strong><code>ofertas</code></strong></td>
                    <td>Avisos de trabajo o práctica con sueldo y cupos</td>
                    <td><code>cargo</code>, <code>empresa</code>, <code>modalidad</code>, <code>sueldo</code>, <code>vacantes</code>, <code>requisitos</code>, <code>activa</code>, <code>creado_por</code></td>
                </tr>
            </table>
            <div class="tip-box">
                <strong>¿Por qué incluimos <code>creado_por</code> con tu nombre?</strong> Así cada estudiante inserta su propio lote de empresas y ofertas sin pisar el trabajo de otras secciones, y al mismo tiempo entre todos armamos un gran portal para consultar.
            </div>
        `
    },

    // 4
    {
        html: `
            <h2>Traductor Rápido: De SQL Básico a MongoDB</h2>
            <div class="concept-box">
                Todo lo que hacías con <code>WHERE</code> en Oracle tiene una traducción directa en MongoDB usando operadores con el signo <strong><code>$</code></strong>:
            </div>
            <table>
                <tr><th>En SQL (Oracle)</th><th>En MongoDB</th><th>Ejemplo en <code>ofertas</code></th></tr>
                <tr><td><code>WHERE modalidad = 'remoto'</code></td><td><code>{ "campo": valor }</code></td><td><code>{ "modalidad": "remoto" }</code></td></tr>
                <tr><td><code>WHERE modalidad != 'presencial'</code></td><td><strong><code>$ne</code></strong> (Not Equal)</td><td><code>{ "modalidad": { $ne: "presencial" } }</code></td></tr>
                <tr><td><code>WHERE sueldo &gt; 1000000</code></td><td><strong><code>$gt</code></strong> / <strong><code>$gte</code></strong> (&gt; / &gt;=)</td><td><code>{ "sueldo": { $gt: 1000000 } }</code></td></tr>
                <tr><td><code>WHERE sueldo &lt;= 800000</code></td><td><strong><code>$lt</code></strong> / <strong><code>$lte</code></strong> (&lt; / &lt;=)</td><td><code>{ "sueldo": { $lte: 800000 } }</code></td></tr>
                <tr><td><code>WHERE sueldo BETWEEN A AND B</code></td><td><code>$gte</code> y <code>$lte</code> juntos</td><td><code>{ "sueldo": { $gte: 800000, $lte: 1500000 } }</code></td></tr>
                <tr><td><code>WHERE comuna IN ('Santiago', 'Ñuñoa')</code></td><td><strong><code>$in</code></strong> / <strong><code>$nin</code></strong></td><td><code>{ "comuna": { $in: ["Santiago", "Ñuñoa"] } }</code></td></tr>
                <tr><td><code>WHERE cond1 AND cond2</code></td><td>Separar con <strong>coma <code>,</code></strong></td><td><code>{ "modalidad": "remoto", "activa": true }</code></td></tr>
                <tr><td><code>WHERE cond1 OR cond2</code></td><td><strong><code>$or: [ {...}, {...} ]</code></strong></td><td><code>{ $or: [ { "modalidad": "remoto" }, { "sueldo": { $gte: 1500000 } } ] }</code></td></tr>
            </table>
        `
    },

    // 5
    {
        html: `
            <h2>1. Insertar Varios Documentos a la Vez: <code>insertMany()</code></h2>
            <div class="concept-box">
                Con <code>insertOne({ ... })</code> guardábamos un documento. Cuando quieres cargar varios registros de una sola vez (y crear la colección si aún no existía), usas <strong><code>insertMany([ ... ])</code></strong> pasándole una <strong>lista entre corchetes <code>[ ]</code></strong>:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Crear o poblar la colección "empresas" con 2 documentos de una vez</span>
db.empresas.<span class="fn">insertMany</span>([
    {
        <span class="str">"nombre"</span>: <span class="str">"Andes Cloud SpA"</span>,
        <span class="str">"rubro"</span>: <span class="str">"Tecnología"</span>,
        <span class="str">"empleados"</span>: <span class="num">120</span>,
        <span class="str">"ciudad"</span>: <span class="str">"Santiago"</span>,
        <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>   <span class="cm">// Pon siempre TU nombre</span>
    },
    {
        <span class="str">"nombre"</span>: <span class="str">"FinTech Austral"</span>,
        <span class="str">"rubro"</span>: <span class="str">"Finanzas"</span>,
        <span class="str">"empleados"</span>: <span class="num">45</span>,
        <span class="str">"ciudad"</span>: <span class="str">"Valparaíso"</span>,
        <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>
    }
]);</pre>
            <div class="warning-box">
                <strong>Regla de sintaxis:</strong> <code>insertOne</code> lleva solo llaves <code>({ ... })</code>. <strong><code>insertMany</code> lleva corchetes afuera y llaves adentro: <code>([ { ... }, { ... } ])</code></strong>. Y recuerda comentarlo con <code>//</code> tras ejecutarlo una vez.
            </div>
        `
    },

    // 6
    {
        html: `
            <h2>Poblar Nuestra Segunda Colección: <code>ofertas</code></h2>
            <div class="concept-box">
                Ahora cargamos un lote de avisos de trabajo en la colección <strong><code>ofertas</code></strong>. Fíjate que incluye números (<code>sueldo</code>, <code>vacantes</code>), booleanos (<code>activa</code>), arreglos (<code>requisitos</code>) y un objeto anidado (<code>ubicacion</code>):
            </div>
            <pre class="compact xs"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">insertMany</span>([
    {
        <span class="str">"cargo"</span>: <span class="str">"Desarrollador Backend Junior"</span>,
        <span class="str">"empresa"</span>: <span class="str">"Andes Cloud SpA"</span>,
        <span class="str">"modalidad"</span>: <span class="str">"remoto"</span>,
        <span class="str">"sueldo"</span>: <span class="num">1200000</span>,
        <span class="str">"vacantes"</span>: <span class="num">3</span>,
        <span class="str">"activa"</span>: <span class="kw">true</span>,
        <span class="str">"requisitos"</span>: [<span class="str">"Node.js"</span>, <span class="str">"MongoDB"</span>, <span class="str">"Git"</span>],
        <span class="str">"ubicacion"</span>: { <span class="str">"ciudad"</span>: <span class="str">"Santiago"</span>, <span class="str">"comuna"</span>: <span class="str">"Providencia"</span> },
        <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>
    },
    {
        <span class="str">"cargo"</span>: <span class="str">"Practicante Base de Datos"</span>,
        <span class="str">"empresa"</span>: <span class="str">"FinTech Austral"</span>,
        <span class="str">"modalidad"</span>: <span class="str">"híbrido"</span>,
        <span class="str">"sueldo"</span>: <span class="num">450000</span>,
        <span class="str">"vacantes"</span>: <span class="num">2</span>,
        <span class="str">"activa"</span>: <span class="kw">true</span>,
        <span class="str">"requisitos"</span>: [<span class="str">"Oracle"</span>, <span class="str">"PL/SQL"</span>],
        <span class="str">"ubicacion"</span>: { <span class="str">"ciudad"</span>: <span class="str">"Valparaíso"</span>, <span class="str">"comuna"</span>: <span class="str">"Viña del Mar"</span> },
        <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>
    },
    {
        <span class="str">"cargo"</span>: <span class="str">"Analista QA Automatizador"</span>,
        <span class="str">"empresa"</span>: <span class="str">"Andes Cloud SpA"</span>,
        <span class="str">"modalidad"</span>: <span class="str">"presencial"</span>,
        <span class="str">"sueldo"</span>: <span class="num">950000</span>,
        <span class="str">"vacantes"</span>: <span class="num">0</span>,
        <span class="str">"activa"</span>: <span class="kw">false</span>,
        <span class="str">"requisitos"</span>: [<span class="str">"Python"</span>, <span class="str">"Selenium"</span>, <span class="str">"Git"</span>],
        <span class="str">"ubicacion"</span>: { <span class="str">"ciudad"</span>: <span class="str">"Santiago"</span>, <span class="str">"comuna"</span>: <span class="str">"Las Condes"</span> },
        <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>
    }
]);</pre>
        `
    },

    // 7
    {
        html: `
            <h2>2. Operadores de Comparación Numérica</h2>
            <div class="concept-box">
                Para comparar números o fechas abrimos un objeto <code>{ $operador: valor }</code> dentro del campo que queremos evaluar:
            </div>
            <table>
                <tr><th>Operador</th><th>Significado</th><th>Traducción mental</th></tr>
                <tr><td><strong><code>$gt</code></strong></td><td><em>Greater Than</em></td><td>Mayor que (<code>&gt;</code>)</td></tr>
                <tr><td><strong><code>$gte</code></strong></td><td><em>Greater Than or Equal</em></td><td>Mayor o igual que (<code>&gt;=</code>)</td></tr>
                <tr><td><strong><code>$lt</code></strong></td><td><em>Less Than</em></td><td>Menor que (<code>&lt;</code>)</td></tr>
                <tr><td><strong><code>$lte</code></strong></td><td><em>Less Than or Equal</em></td><td>Menor o igual que (<code>&lt;=</code>)</td></tr>
                <tr><td><strong><code>$ne</code></strong></td><td><em>Not Equal</em></td><td>Distinto de (<code>!=</code>, sirve para números y textos)</td></tr>
            </table>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Ofertas con sueldo mayor o igual a $1.000.000</span>
db.ofertas.<span class="fn">find</span>({ <span class="str">"sueldo"</span>: { <span class="kw">$gte</span>: <span class="num">1000000</span> } });

<span class="cm">// Ofertas cuya modalidad NO sea "presencial"</span>
db.ofertas.<span class="fn">find</span>({ <span class="str">"modalidad"</span>: { <span class="kw">$ne</span>: <span class="str">"presencial"</span> } });</pre>
        `
    },

    // 8
    {
        html: `
            <h2>Buscar dentro de un Rango (El <code>BETWEEN</code> de MongoDB)</h2>
            <div class="concept-box">
                ¿Cómo buscamos ofertas cuyo sueldo esté <strong>entre $500.000 y $1.200.000</strong>? En MongoDB no existe la palabra <code>BETWEEN</code>: simplemente pones <strong><code>$gte</code> y <code>$lte</code> separados por coma dentro del mismo campo</strong>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// En SQL: WHERE sueldo &gt;= 500000 AND sueldo &lt;= 1200000</span>
db.ofertas.<span class="fn">find</span>({
    <span class="str">"sueldo"</span>: { <span class="kw">$gte</span>: <span class="num">500000</span>, <span class="kw">$lte</span>: <span class="num">1200000</span> }
});

<span class="cm">// Empresas medianas: que tengan más de 20 y menos de 100 empleados</span>
db.empresas.<span class="fn">find</span>({
    <span class="str">"empleados"</span>: { <span class="kw">$gt</span>: <span class="num">20</span>, <span class="kw">$lt</span>: <span class="num">100</span> }
});</pre>
            <div class="analogy-box">
                Piensa que el objeto de adentro le dice al campo <code>"sueldo"</code>: <em>"tienes que cumplir este piso (<code>$gte</code>) y este techo (<code>$lte</code>) al mismo tiempo"</em>.
            </div>
        `
    },

    // 9
    {
        html: `
            <h2>3. Incluir o Excluir de una Lista: <code>$in</code> vs <code>$nin</code></h2>
            <div class="concept-box">
                Ya conoces <strong><code>$in</code></strong> (que el valor esté en una lista). Su hermano opuesto es <strong><code>$nin</code></strong> (<em>Not In</em>: que el valor <strong>no</strong> sea ninguno de los de la lista):
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// 1. $in sobre un campo simple: modalidad que sea "remoto" O "híbrido"</span>
db.ofertas.<span class="fn">find</span>({
    <span class="str">"modalidad"</span>: { <span class="kw">$in</span>: [<span class="str">"remoto"</span>, <span class="str">"híbrido"</span>] }
});

<span class="cm">// 2. $nin sobre un campo simple: empresas que NO sean de "Santiago" ni "Rancagua"</span>
db.empresas.<span class="fn">find</span>({
    <span class="str">"ciudad"</span>: { <span class="kw">$nin</span>: [<span class="str">"Santiago"</span>, <span class="str">"Rancagua"</span>] }
});

<span class="cm">// 3. $nin sobre un arreglo: ofertas que NO pidan ni "Java" ni "PHP" en requisitos</span>
db.ofertas.<span class="fn">find</span>({
    <span class="str">"requisitos"</span>: { <span class="kw">$nin</span>: [<span class="str">"Java"</span>, <span class="str">"PHP"</span>] }
});</pre>
            <div class="tip-box">
                Si quieres evaluar varios valores posibles sobre <strong>el mismo campo</strong> (ej. varias ciudades o varias modalidades), usa siempre <code>$in</code> o <code>$nin</code>: es mucho más corto que escribir un <code>$or</code>.
            </div>
        `
    },

    // 10
    {
        html: `
            <h2>4. Combinar Condiciones: El <code>AND</code> Implícito</h2>
            <div class="concept-box">
                Cuando necesitas que un documento cumpla <strong>varias condiciones a la vez (<code>AND</code>)</strong> en campos distintos, simplemente los escribes en el mismo filtro separados por <strong>coma <code>,</code></strong>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Ofertas que estén activas Y tengan vacantes disponibles (&gt; 0)</span>
<span class="cm">// Y paguen al menos $900.000 Y pidan "Git" dentro de sus requisitos:</span>
db.ofertas.<span class="fn">find</span>({
    <span class="str">"activa"</span>: <span class="kw">true</span>,
    <span class="str">"vacantes"</span>: { <span class="kw">$gt</span>: <span class="num">0</span> },
    <span class="str">"sueldo"</span>: { <span class="kw">$gte</span>: <span class="num">900000</span> },
    <span class="str">"requisitos"</span>: <span class="str">"Git"</span>
});</pre>
            <div class="analogy-box">
                En un filtro de MongoDB, <strong>cada coma entre campos significa <code>AND</code></strong>. Para que una oferta salga en pantalla, debe aprobar los 4 requisitos al mismo tiempo.
            </div>
        `
    },

    // 11
    {
        html: `
            <h2>El Operador Lógico <code>$or</code> (Cuando Cualquiera Sirve)</h2>
            <div class="concept-box">
                ¿Y si quieres buscar ofertas que cumplan una condición en un campo <strong>O</strong> otra condición en un campo distinto? (Por ejemplo: <em>"que sea 100% remoto, <strong>O</strong> que si no es remoto pague al menos $1.400.000"</em>). Para eso usamos <strong><code>$or: [ { cond1 }, { cond2 } ]</code></strong>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// $or recibe un ARREGLO [ ] donde cada elemento es un objeto { } con una condición:</span>
db.ofertas.<span class="fn">find</span>({
    <span class="kw">$or</span>: [
        { <span class="str">"modalidad"</span>: <span class="str">"remoto"</span> },
        { <span class="str">"sueldo"</span>: { <span class="kw">$gte</span>: <span class="num">1400000</span> } }
    ]
});</pre>
            <div class="warning-box">
                <strong>Fíjate bien en los paréntesis de <code>$or</code>:</strong> después de <code>$or:</code> van <strong>corchetes <code>[ ]</code></strong>, y adentro cada condición va encerrada en sus propias <strong>llaves <code>{ }</code></strong> separadas por coma.
            </div>
        `
    },

    // 12
    {
        html: `
            <h2>Combinación Maestra: <code>AND</code> + <code>$or</code> en la Misma Consulta</h2>
            <div class="concept-box">
                En el mundo real casi siempre combinas ambos. Imagina esta búsqueda de un estudiante:<br>
                <em>"Quiero ofertas que estén <strong>activas</strong>, que tengan <strong>vacantes mayores a 0</strong>, Y que además sean <strong>remotas O queden en la comuna de Providencia</strong>"</em>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">find</span>({
    <span class="str">"activa"</span>: <span class="kw">true</span>,                                      <span class="cm">// Condición obligatoria 1 (AND)</span>
    <span class="str">"vacantes"</span>: { <span class="kw">$gt</span>: <span class="num">0</span> },                              <span class="cm">// Condición obligatoria 2 (AND)</span>
    <span class="kw">$or</span>: [                                               <span class="cm">// Y que cumpla al menos UNA de estas dos:</span>
        { <span class="str">"modalidad"</span>: <span class="str">"remoto"</span> },
        { <span class="str">"ubicacion.comuna"</span>: <span class="str">"Providencia"</span> }
    ]
});</pre>
            <div class="tip-box">
                En SQL esto sería: <code>WHERE activa = 1 AND vacantes &gt; 0 AND (modalidad = 'remoto' OR comuna = 'Providencia')</code>.
            </div>
        `
    },

    // 13
    {
        html: `
            <h2>5. <code>findOne()</code> vs <code>find()</code> con Proyección, Orden y Límite</h2>
            <div class="concept-box">
                Dos formas de presentar tus resultados según lo que necesites:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// A) findOne(): devuelve UN SOLO documento (el primero que coincida) como objeto directo</span>
db.empresas.<span class="fn">findOne</span>({ <span class="str">"nombre"</span>: <span class="str">"Andes Cloud SpA"</span> });

<span class="cm">// B) Ranking limpio: Las 5 ofertas activas mejor pagadas (mostrando solo cargo, empresa y sueldo)</span>
db.ofertas.<span class="fn">find</span>(
    { <span class="str">"activa"</span>: <span class="kw">true</span> },                                        <span class="cm">// 1. Filtro</span>
    { <span class="str">"cargo"</span>: <span class="num">1</span>, <span class="str">"empresa"</span>: <span class="num">1</span>, <span class="str">"sueldo"</span>: <span class="num">1</span>, <span class="str">"_id"</span>: <span class="num">0</span> }       <span class="cm">// 2. Proyección</span>
)
.<span class="fn">sort</span>({ <span class="str">"sueldo"</span>: -<span class="num">1</span> })                                        <span class="cm">// 3. De mayor a menor (-1)</span>
.<span class="fn">limit</span>(<span class="num">5</span>);                                                     <span class="cm">// 4. Top 5</span></pre>
            <div class="analogy-box">
                Usa <strong><code>findOne()</code></strong> cuando buscas un registro específico (como una empresa por su nombre o tu propio perfil). Usa <strong><code>find()</code></strong> cuando esperas una lista de resultados.
            </div>
        `
    },

    // 14
    {
        html: `
            <h2>Tu Práctica de Hoy: Poblar y Consultar el Portal</h2>
            <div class="concept-box">
                Con todo lo anterior ya tienes el <strong>100% de lo básico</strong> para completar las misiones obligatorias de hoy.
            </div>
            <div class="analogy-box">
                <strong>📌 En el menú lateral → Tareas → Tarea 3: El Buscador de Ofertas Laborales TI:</strong><br>
                1. Insertarás tu propio lote de <strong>2 empresas</strong> (en <code>empresas</code>) y <strong>4 ofertas laborales</strong> (en <code>ofertas</code>) con <code>insertMany()</code> llevando tu nombre en <code>creado_por</code>.<br>
                2. Resolverás consultas aplicando rangos (<code>$gte</code>, <code>$lte</code>), listas (<code>$in</code>, <code>$nin</code>), combinaciones con <code>$or</code> y rankings ordenados.<br><br>
                <em>💡 ¿Terminaste rápido o quieres aprender trucos más avanzados? Las siguientes 3 diapositivas son de <strong>Contenido Extra</strong> para resolver los desafíos opcionales.</em>
            </div>
        `
    },

    // 15 — EXTRA 1
    {
        html: `
            <h2>🚀 Contenido Extra 1: Filtrar por el Largo de una Lista con <code>$size</code></h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                ¿Cómo encontramos las ofertas que piden <strong>exactamente 2 requisitos</strong> dentro de su arreglo <code>requisitos</code> (ni más, ni menos)?
            </div>
            <div class="concept-box">
                El operador <strong><code>$size: número</code></strong> cuenta cuántos elementos tiene un arreglo y filtra los documentos que coinciden exactamente con esa cantidad:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Ofertas fáciles de postular: que tengan exactamente 2 elementos en "requisitos"</span>
db.ofertas.<span class="fn">find</span>({
    <span class="str">"requisitos"</span>: { <span class="kw">$size</span>: <span class="num">2</span> }
});

<span class="cm">// También sirve en nuestra colección "perfiles": ¿quiénes pusieron exactamente 3 skills?</span>
db.perfiles.<span class="fn">find</span>({
    <span class="str">"skills"</span>: { <span class="kw">$size</span>: <span class="num">3</span> }
});</pre>
            <div class="warning-box">
                Nota: <code>$size</code> solo acepta un número exacto (no se puede combinar directamente con <code>$gt</code> o <code>$lt</code>).
            </div>
        `
    },

    // 16 — EXTRA 2
    {
        html: `
            <h2>🚀 Contenido Extra 2: Arreglos de Objetos con <code>$elemMatch</code></h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                Imagina que un perfil tiene un arreglo de objetos <code>idiomas: [ { idioma: "Inglés", nivel: "Básico" }, { idioma: "Español", nivel: "Avanzado" } ]</code>.
            </div>
            <div class="concept-box">
                Si buscas <code>{ "idiomas.idioma": "Inglés", "idiomas.nivel": "Avanzado" }</code>, ese documento <strong>saldrá por error</strong> (porque tiene <em>"Inglés"</em> en el primer objeto y <em>"Avanzado"</em> en el segundo). Para exigir que ambas condiciones se cumplan <strong>dentro del mismo objeto de la lista</strong>, se usa <strong><code>$elemMatch</code></strong>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Exige que UN MISMO elemento del arreglo tenga idioma "Inglés" Y nivel "Avanzado":</span>
db.perfiles.<span class="fn">find</span>({
    <span class="str">"idiomas"</span>: {
        <span class="kw">$elemMatch</span>: { <span class="str">"idioma"</span>: <span class="str">"Inglés"</span>, <span class="str">"nivel"</span>: <span class="str">"Avanzado"</span> }
    }
});</pre>
        `
    },

    // 17 — EXTRA 3
    {
        html: `
            <h2>🚀 Contenido Extra 3: Paginar Resultados con <code>.skip()</code></h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                Cuando buscas en un portal de empleo real, la página 1 te muestra las ofertas 1 a 5, y al pasar a la "Página 2" te muestra las ofertas 6 a 10. ¿Cómo se salta MongoDB las primeras 5?
            </div>
            <div class="concept-box">
                El método <strong><code>.skip(n)</code></strong> ignora los primeros <code>n</code> resultados del ordenamiento y entrega a partir del siguiente:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Página 1: las primeras 5 ofertas mejor pagadas</span>
db.ofertas.<span class="fn">find</span>({ <span class="str">"activa"</span>: <span class="kw">true</span> }).<span class="fn">sort</span>({ <span class="str">"sueldo"</span>: -<span class="num">1</span> }).<span class="fn">skip</span>(<span class="num">0</span>).<span class="fn">limit</span>(<span class="num">5</span>);

<span class="cm">// Página 2: se salta las 5 primeras y muestra las siguientes 5 (de la 6 a la 10)</span>
db.ofertas.<span class="fn">find</span>({ <span class="str">"activa"</span>: <span class="kw">true</span> }).<span class="fn">sort</span>({ <span class="str">"sueldo"</span>: -<span class="num">1</span> }).<span class="fn">skip</span>(<span class="num">5</span>).<span class="fn">limit</span>(<span class="num">5</span>);</pre>
        `
    },

    // 18
    {
        html: `
            <h2>Resumen: Tu Caja de Herramientas de Hoy</h2>
            <table>
                <tr><th>Lo que quieres hacer</th><th>Instrucción / Operador en MongoDB</th></tr>
                <tr><td>Insertar varios documentos de una vez</td><td><code>db.coleccion.insertMany([ { ... }, { ... } ])</code></td></tr>
                <tr><td>Traer solo 1 documento directo</td><td><code>db.coleccion.findOne({ ... })</code></td></tr>
                <tr><td>Comparar números (<code>&gt;</code>, <code>&gt;=</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>!=</code>)</td><td><code>$gt</code>, <code>$gte</code>, <code>$lt</code>, <code>$lte</code>, <code>$ne</code></td></tr>
                <tr><td>Filtrar un rango (entre A y B)</td><td><code>{ "sueldo": { $gte: 500000, $lte: 1200000 } }</code></td></tr>
                <tr><td>Que esté (o NO esté) en una lista</td><td><code>{ "campo": { $in: [...] } }</code> / <code>{ $nin: [...] }</code></td></tr>
                <tr><td>Cumplir todas las condiciones (<code>AND</code>)</td><td>Separar con comas: <code>{ "activa": true, "modalidad": "remoto" }</code></td></tr>
                <tr><td>Cumplir al menos una condición (<code>OR</code>)</td><td><code>{ $or: [ { "modalidad": "remoto" }, { "sueldo": { $gte: 1500000 } } ] }</code></td></tr>
                <tr><td>🚀 Extra: largo de arreglo / subobjeto / página</td><td><code>$size</code>, <code>$elemMatch</code>, <code>.skip(n)</code></td></tr>
            </table>
            <div class="alien-separator">👽</div>
        `
    }

];

