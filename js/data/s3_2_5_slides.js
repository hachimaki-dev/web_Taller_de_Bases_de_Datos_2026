// s3_2_5_slides.js — Consultas de Resumen y Agrupación en MongoDB (Aggregate)
// Unidad 3.2 — Sesión 5: El equivalente a GROUP BY, COUNT, SUM, AVG, MIN y MAX de SQL en MongoDB

const s3_2_5_slides = [
    // 1
    {
        class: 'title-slide',
        html: `
            <h1>Consultas de Resumen y Agrupación</h1>
            <p class="subtitle">Unidad 3.2 — Sesión 5: El equivalente a <code>GROUP BY</code>, <code>COUNT</code>, <code>SUM</code> y <code>AVG</code> con <code>aggregate()</code></p>
            <p class="subtitle">Caso Práctico: Estadísticas del Portal de Ofertas Laborales</p>
            <div class="alien-separator">👽</div>
        `
    },

    // 2
    {
        html: `
            <h2>Objetivo y Ruta de Hoy</h2>
            <div class="concept-box">
                <strong>Objetivo de la sesión:</strong> Responder preguntas de resumen y estadísticas sobre nuestras colecciones (totales, promedios, mínimos y máximos por grupo) usando el método <strong><code>aggregate()</code></strong>.
            </div>
            <div class="analogy-box">
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li><strong>¿Cuándo <code>find()</code> se queda corto?:</strong> preguntas de resumen tipo <code>GROUP BY</code>.</li>
                    <li><strong>La idea de Pipeline (tubería):</strong> <code>db.coleccion.aggregate([ ... ])</code>.</li>
                    <li><strong>Etapa 1 (<code>$match</code>):</strong> filtrar antes de calcular (el <code>WHERE</code>).</li>
                    <li><strong>Etapa 2 (<code>$group</code>):</strong> agrupar y calcular con <code>$sum</code>, <code>$avg</code>, <code>$min</code> y <code>$max</code>.</li>
                    <li><strong>Etapa 3 (<code>$sort</code> y <code>$limit</code>):</strong> ordenar el reporte final.</li>
                    <li><strong>🚀 Contenido Extra (al final):</strong> <code>$unwind</code> (agrupar arreglos), <code>$project</code> y <code>$lookup</code>.</li>
                </ol>
            </div>
        `
    },

    // 3
    {
        html: `
            <h2>El Problema: Preguntas que <code>find()</code> No Puede Responder</h2>
            <div class="concept-box">
                Hasta ahora usamos <code>find()</code> para traer documentos tal como están guardados. Pero ¿qué pasa cuando nos piden un <strong>resumen estadístico</strong> del portal de empleos?
            </div>
            <div class="analogy-box">
                <strong>Preguntas típicas de reporte (que en SQL hacías con <code>GROUP BY</code>):</strong><br>
                • <em>"¿Cuántas ofertas laborales hay en cada modalidad (remoto, híbrido, presencial)?"</em><br>
                • <em>"¿Cuál es el sueldo promedio, el sueldo mínimo y el sueldo máximo por modalidad?"</em><br>
                • <em>"¿Cuántas vacantes totales suma cada empresa en el portal?"</em>
            </div>
            <div class="tip-box">
                En vez de usar tres <code>countDocuments()</code> por separado o sacar cuentas con calculadora, MongoDB tiene una herramienta dedicada a esto: <strong><code>db.coleccion.aggregate([ ... ])</code></strong>.
            </div>
        `
    },

    // 4
    {
        html: `
            <h2>Traductor Rápido: De <code>GROUP BY</code> en SQL a <code>aggregate()</code></h2>
            <div class="concept-box">
                Mira cómo se traduce directamente una consulta de agrupación de Oracle a MongoDB:
            </div>
            <table>
                <tr><th>En SQL (Oracle)</th><th>En MongoDB (<code>aggregate</code>)</th><th>Qué hace</th></tr>
                <tr><td><code>WHERE activa = 1</code></td><td><strong><code>{ $match: { "activa": true } }</code></strong></td><td>Filtra los documentos antes de agrupar</td></tr>
                <tr><td><code>GROUP BY modalidad</code></td><td><strong><code>{ $group: { _id: "$modalidad", ... } }</code></strong></td><td>Define por qué campo se van a formar los grupos</td></tr>
                <tr><td><code>COUNT(*)</code></td><td><strong><code>{ $sum: 1 }</code></strong> (dentro de <code>$group</code>)</td><td>Suma <code>1</code> por cada documento del grupo</td></tr>
                <tr><td><code>SUM(vacantes)</code></td><td><strong><code>{ $sum: "$vacantes" }</code></strong></td><td>Suma los valores del campo numérico <code>vacantes</code></td></tr>
                <tr><td><code>AVG(sueldo)</code></td><td><strong><code>{ $avg: "$sueldo" }</code></strong></td><td>Calcula el promedio del campo <code>sueldo</code></td></tr>
                <tr><td><code>MIN(sueldo)</code> / <code>MAX(sueldo)</code></td><td><strong><code>{ $min: "$sueldo" }</code></strong> / <strong><code>{ $max: "$sueldo" }</code></strong></td><td>Obtiene el valor más bajo o más alto del grupo</td></tr>
                <tr><td><code>ORDER BY total DESC</code></td><td><strong><code>{ $sort: { "total": -1 } }</code></strong></td><td>Ordena el resultado final del reporte</td></tr>
            </table>
        `
    },

    // 5
    {
        html: `
            <h2>¿Cómo Funciona <code>aggregate([ ... ])</code>? La Idea de Tubería</h2>
            <div class="concept-box">
                <code>aggregate([ etapa1, etapa2, etapa3 ])</code> recibe una <strong>lista de etapas en orden</strong>. Los documentos entran a la primera etapa, y el resultado que sale pasa inmediatamente a la siguiente:
            </div>
            <pre>Colección ofertas (todos los documentos)
   │
   ▼  Etapa 1: { $match: { "activa": true } }         ──► Pasan solo las ofertas activas
   │
   ▼  Etapa 2: { $group: { _id: "$modalidad", ... } } ──► Se agrupan en 3 filas (remoto, híbrido, presencial)
   │
   ▼  Etapa 3: { $sort: { "sueldo_promedio": -1 } }   ──► Se ordenan de mayor a menor sueldo</pre>
            <div class="analogy-box">
                Piensa en una línea de ensamblaje: primero <strong>seleccionas</strong> las piezas buenas (<code>$match</code>), luego las <strong>agrupas en cajas y las pesas</strong> (<code>$group</code>), y al final <strong>ordenas las cajas</strong> (<code>$sort</code>).
            </div>
        `
    },

    // 6
    {
        html: `
            <h2>1. Contar Documentos por Grupo: <code>$group</code> + <code>{ $sum: 1 }</code></h2>
            <div class="concept-box">
                Pregunta: <strong>¿Cuántas ofertas laborales hay registradas por cada modalidad?</strong><br>
                En SQL sería: <code>SELECT modalidad, COUNT(*) AS total_ofertas FROM ofertas GROUP BY modalidad;</code>
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">aggregate</span>([
    {
        <span class="kw">$group</span>: {
            _id: <span class="str">"$modalidad"</span>,                <span class="cm">// Campo por el cual agrupamos (¡con signo $ y comillas!)</span>
            total_ofertas: { <span class="kw">$sum</span>: <span class="num">1</span> }        <span class="cm">// Por cada oferta del grupo, suma 1 al contador</span>
        }
    }
]);</pre>
            <div class="warning-box">
                <strong>Dos reglas de oro en <code>$group</code>:</strong><br>
                1. El campo por el que agrupas siempre se llama obligatoriamente <strong><code>_id</code></strong>.<br>
                2. Cuando te refieres al valor de un campo a la derecha de los dos puntos, lleva el signo dólar adentro de las comillas: <strong><code>"$modalidad"</code></strong>.
            </div>
        `
    },

    // 7
    {
        html: `
            <h2>2. Sumar y Promediar Números: <code>$sum</code> y <code>$avg</code></h2>
            <div class="concept-box">
                Pregunta: <strong>Por cada modalidad, ¿cuántas ofertas hay, cuántas vacantes suman en total y cuál es el sueldo promedio?</strong>
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">aggregate</span>([
    {
        <span class="kw">$group</span>: {
            _id: <span class="str">"$modalidad"</span>,
            cantidad_ofertas: { <span class="kw">$sum</span>: <span class="num">1</span> },           <span class="cm">// COUNT(*): suma 1 por documento</span>
            total_vacantes:   { <span class="kw">$sum</span>: <span class="str">"$vacantes"</span> },  <span class="cm">// SUM(vacantes): suma el valor del campo</span>
            sueldo_promedio:  { <span class="kw">$avg</span>: <span class="str">"$sueldo"</span> }     <span class="cm">// AVG(sueldo): calcula el promedio</span>
        }
    }
]);</pre>
            <div class="analogy-box">
                Fíjate en la diferencia de <code>$sum</code>:<br>
                • <strong><code>{ $sum: 1 }</code></strong> cuenta cuántos documentos hay (de uno en uno).<br>
                • <strong><code>{ $sum: "$vacantes" }</code></strong> suma el número que viene guardado adentro del campo <code>vacantes</code>.
            </div>
        `
    },

    // 8
    {
        html: `
            <h2>3. Mínimo y Máximo por Grupo: <code>$min</code> y <code>$max</code></h2>
            <div class="concept-box">
                También podemos pedir en el mismo reporte el sueldo más bajo (<strong><code>$min</code></strong>) y el sueldo más alto (<strong><code>$max</code></strong>) que ofrece cada empresa:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">aggregate</span>([
    {
        <span class="kw">$group</span>: {
            _id: <span class="str">"$empresa"</span>,                         <span class="cm">// Agrupamos por nombre de empresa</span>
            ofertas_publicadas: { <span class="kw">$sum</span>: <span class="num">1</span> },
            sueldo_minimo:      { <span class="kw">$min</span>: <span class="str">"$sueldo"</span> },  <span class="cm">// MIN(sueldo)</span>
            sueldo_maximo:      { <span class="kw">$max</span>: <span class="str">"$sueldo"</span> }   <span class="cm">// MAX(sueldo)</span>
        }
    }
]);</pre>
            <div class="tip-box">
                ¿Y si quieres sacar el promedio, mínimo y máximo de <strong>toda la colección sin separar en grupos</strong>? Simplemente pones <strong><code>_id: null</code></strong> dentro de <code>$group</code>.
            </div>
        `
    },

    // 9
    {
        html: `
            <h2>4. El Pipeline Completo: <code>$match</code> + <code>$group</code> + <code>$sort</code></h2>
            <div class="concept-box">
                Ahora unimos las 3 etapas básicas en una sola consulta:<br>
                <em>"Considerando <strong>únicamente las ofertas activas</strong> (<code>$match</code>), calcula cuántas ofertas y qué sueldo promedio tiene cada modalidad (<code>$group</code>), y ordénalas de mayor a menor sueldo promedio (<code>$sort</code>)"</em>:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">aggregate</span>([
    <span class="cm">// Etapa 1: Filtrar solo las ofertas activas (usa los mismos operadores que find)</span>
    { <span class="kw">$match</span>: { <span class="str">"activa"</span>: <span class="kw">true</span> } },

    <span class="cm">// Etapa 2: Agrupar por modalidad y calcular totales y promedio</span>
    {
        <span class="kw">$group</span>: {
            _id: <span class="str">"$modalidad"</span>,
            total_activas:   { <span class="kw">$sum</span>: <span class="num">1</span> },
            sueldo_promedio: { <span class="kw">$avg</span>: <span class="str">"$sueldo"</span> }
        }
    },

    <span class="cm">// Etapa 3: Ordenar usando el nombre del campo que acabamos de crear en $group</span>
    { <span class="kw">$sort</span>: { <span class="str">"sueldo_promedio"</span>: -<span class="num">1</span> } }
]);</pre>
        `
    },

    // 10
    {
        html: `
            <h2>También Funciona en <code>perfiles</code> y <code>postulaciones</code></h2>
            <div class="concept-box">
                Puedes aplicar exactamente el mismo patrón sobre cualquiera de las colecciones que hemos creado en la unidad:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// A) En "postulaciones": ¿Cuántos candidatos hay en cada estado y cuál es su puntaje promedio?</span>
db.postulaciones.<span class="fn">aggregate</span>([
    {
        <span class="kw">$group</span>: {
            _id: <span class="str">"$estado"</span>,
            cantidad_candidatos: { <span class="kw">$sum</span>: <span class="num">1</span> },
            puntaje_promedio:    { <span class="kw">$avg</span>: <span class="str">"$puntaje_tecnico"</span> }
        }
    },
    { <span class="kw">$sort</span>: { <span class="str">"cantidad_candidatos"</span>: -<span class="num">1</span> } }
]);

<span class="cm">// B) En "perfiles": ¿Cuántos perfiles hay registrados por cada sección?</span>
db.perfiles.<span class="fn">aggregate</span>([
    { <span class="kw">$group</span>: { _id: <span class="str">"$seccion"</span>, total_alumnos: { <span class="kw">$sum</span>: <span class="num">1</span> } } },
    { <span class="kw">$sort</span>: { <span class="str">"total_alumnos"</span>: -<span class="num">1</span> } }
]);</pre>
        `
    },

    // 11
    {
        html: `
            <h2>Tu Práctica de Hoy: Reportes del Portal</h2>
            <div class="concept-box">
                Con <code>$match</code>, <code>$group</code> (<code>$sum</code>, <code>$avg</code>, <code>$min</code>, <code>$max</code>) y <code>$sort</code> ya dominas todo el bloque básico de reportería en MongoDB.
            </div>
            <div class="analogy-box">
                <strong>📌 En el menú lateral → Tareas → Tarea 5: Reportes y Estadísticas del Portal de Empleo:</strong><br>
                Construirás tus propios reportes agrupados sobre <code>ofertas</code>, <code>empresas</code> y <code>postulaciones</code>.<br><br>
                <em>💡 ¿Quieres descubrir cómo agrupar elementos que están adentro de un arreglo (como saber cuál es la tecnología más pedida en <code>requisitos</code>) o cómo cruzar dos colecciones? Mira las siguientes 3 diapositivas de <strong>Contenido Extra</strong>.</em>
            </div>
        `
    },

    // 12 — EXTRA 1
    {
        html: `
            <h2>🚀 Contenido Extra 1: Desarmar Arreglos con <code>$unwind</code></h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                ¿Cómo sabemos <strong>cuál es el Top 5 de tecnologías más pedidas</strong> dentro del arreglo <code>requisitos</code> de las ofertas (o en <code>skills</code> de los perfiles)?
            </div>
            <div class="concept-box">
                Si agrupas directamente por un arreglo, MongoDB agrupa la lista entera. Primero debes poner la etapa <strong><code>{ $unwind: "$requisitos" }</code></strong>, que "desenrolla" el arreglo para que cada tecnología quede individual y luego se pueda contar con <code>$group</code>:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Top 5 de tecnologías más solicitadas en las ofertas laborales:</span>
db.ofertas.<span class="fn">aggregate</span>([
    { <span class="kw">$unwind</span>: <span class="str">"$requisitos"</span> },                              <span class="cm">// 1. Separa cada elemento del arreglo</span>
    { <span class="kw">$group</span>: { _id: <span class="str">"$requisitos"</span>, veces_pedida: { <span class="kw">$sum</span>: <span class="num">1</span> } } }, <span class="cm">// 2. Cuenta cada tecnología</span>
    { <span class="kw">$sort</span>: { <span class="str">"veces_pedida"</span>: -<span class="num">1</span> } },                       <span class="cm">// 3. De la más pedida a la menos</span>
    { <span class="kw">$limit</span>: <span class="num">5</span> }                                            <span class="cm">// 4. Solo el Top 5</span>
]);</pre>
        `
    },

    // 13 — EXTRA 2
    {
        html: `
            <h2>🚀 Contenido Extra 2: Presentación Limpia con <code>$project</code> y <code>$round</code></h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                A veces <code>$avg</code> devuelve muchos decimales (ej. <code>933333.3333333</code>) y el nombre <code>_id</code> en el reporte no se ve tan claro. ¿Cómo le damos formato final?
            </div>
            <div class="concept-box">
                Agregando al final una etapa <strong><code>$project</code></strong> (que funciona igual que la proyección de <code>find</code>, pero además permite renombrar campos y redondear con <code>$round</code>):
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">aggregate</span>([
    { <span class="kw">$group</span>: { _id: <span class="str">"$modalidad"</span>, total: { <span class="kw">$sum</span>: <span class="num">1</span> }, promedio: { <span class="kw">$avg</span>: <span class="str">"$sueldo"</span> } } },
    {
        <span class="kw">$project</span>: {
            _id: <span class="num">0</span>,                                       <span class="cm">// Ocultamos _id</span>
            modalidad: <span class="str">"$_id"</span>,                             <span class="cm">// Mostramos el valor de _id como "modalidad"</span>
            total_ofertas: <span class="str">"$total"</span>,
            sueldo_promedio: { <span class="kw">$round</span>: [<span class="str">"$promedio"</span>, <span class="num">0</span>] }  <span class="cm">// Redondeado con 0 decimales</span>
        }
    }
]);</pre>
        `
    },

    // 14 — EXTRA 3
    {
        html: `
            <h2>🚀 Contenido Extra 3: Cruzar Dos Colecciones con <code>$lookup</code> (El <code>JOIN</code>)</h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                En las <code>ofertas</code> guardamos el nombre de la <code>empresa</code>, pero el <code>rubro</code> y la cantidad de <code>empleados</code> están en la colección <code>empresas</code>. ¿Se pueden unir las dos colecciones en una consulta?
            </div>
            <div class="concept-box">
                Sí: la etapa <strong><code>$lookup</code></strong> hace el equivalente a un <code>LEFT JOIN</code> trayendo los documentos coincidentes de otra colección dentro de un arreglo:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.ofertas.<span class="fn">aggregate</span>([
    { <span class="kw">$match</span>: { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span> } },
    {
        <span class="kw">$lookup</span>: {
            from: <span class="str">"empresas"</span>,          <span class="cm">// Colección con la que queremos cruzar</span>
            localField: <span class="str">"empresa"</span>,     <span class="cm">// Campo en "ofertas"</span>
            foreignField: <span class="str">"nombre"</span>,    <span class="cm">// Campo equivalente en "empresas"</span>
            as: <span class="str">"datos_empresa"</span>        <span class="cm">// Nombre del nuevo campo donde vendrá la información</span>
        }
    }
]);</pre>
        `
    },

    // 15
    {
        html: `
            <h2>Resumen: Etapas y Acumuladores de <code>aggregate()</code></h2>
            <table>
                <tr><th>Etapa o Acumulador</th><th>Equivalente en SQL</th><th>Cómo se escribe</th></tr>
                <tr><td><strong><code>$match</code></strong></td><td><code>WHERE</code></td><td><code>{ $match: { "activa": true } }</code></td></tr>
                <tr><td><strong><code>$group</code></strong></td><td><code>GROUP BY</code></td><td><code>{ $group: { _id: "$modalidad", ... } }</code></td></tr>
                <tr><td><strong><code>{ $sum: 1 }</code></strong></td><td><code>COUNT(*)</code></td><td>Cuenta cuántos documentos hay en cada grupo</td></tr>
                <tr><td><strong><code>{ $sum: "$campo" }</code></strong></td><td><code>SUM(campo)</code></td><td>Suma los valores numéricos de ese campo</td></tr>
                <tr><td><strong><code>{ $avg: "$campo" }</code></strong></td><td><code>AVG(campo)</code></td><td>Calcula el promedio del campo en cada grupo</td></tr>
                <tr><td><strong><code>$min</code> / <code>$max</code></strong></td><td><code>MIN()</code> / <code>MAX()</code></td><td><code>{ $min: "$sueldo" }</code> / <code>{ $max: "$sueldo" }</code></td></tr>
                <tr><td><strong><code>$sort</code> / <code>$limit</code></strong></td><td><code>ORDER BY</code> / <code>FETCH FIRST</code></td><td><code>{ $sort: { "total": -1 } }, { $limit: 5 }</code></td></tr>
                <tr><td>🚀 Extra: <strong><code>$unwind</code> / <code>$lookup</code></strong></td><td>Desarmar lista / <code>LEFT JOIN</code></td><td><code>{ $unwind: "$requisitos" }</code></td></tr>
            </table>
            <div class="alien-separator">👽</div>
        `
    }

];

