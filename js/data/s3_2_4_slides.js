// s3_2_4_slides.js — Actualizar en Lote, Modificar Listas y Eliminar Documentos (CRUD Completo)
// Unidad 3.2 — Sesión 4: El equivalente al UPDATE y DELETE de SQL en MongoDB

const s3_2_4_slides = [
    // 1
    {
        class: 'title-slide',
        html: `
            <h1>Actualizar, Transformar y Eliminar (CRUD)</h1>
            <p class="subtitle">Unidad 3.2 — Sesión 4: El equivalente al <code>UPDATE</code> y <code>DELETE</code> de SQL en MongoDB</p>
            <p class="subtitle">Caso Práctico: Gestión en Vivo de Ofertas y Postulaciones</p>
            <div class="alien-separator">👽</div>
        `
    },

    // 2
    {
        html: `
            <h2>Objetivo y Ruta de Hoy</h2>
            <div class="concept-box">
                <strong>Objetivo de la sesión:</strong> Modificar documentos individuales o en lote (cambiando valores, sumando/restando números y editando listas) y eliminar registros por condición de forma segura.
            </div>
            <div class="analogy-box">
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li><strong>Nueva colección <code>postulaciones</code>:</strong> preparar nuestros datos de prueba.</li>
                    <li><strong><code>updateOne()</code> vs <code>updateMany()</code>:</strong> cuándo modificar uno y cuándo modificar varios.</li>
                    <li><strong>Operadores de campos:</strong> <code>$set</code> (cambiar), <code>$inc</code> (sumar/restar) y <code>$unset</code> (quitar campo).</li>
                    <li><strong>Operadores de listas:</strong> <code>$addToSet</code>, <code>$push</code> y <code>$pull</code> (sacar de la lista).</li>
                    <li><strong>Eliminar con filtros:</strong> <code>deleteOne()</code> y <code>deleteMany()</code>.</li>
                    <li><strong>🚀 Contenido Extra (al final):</strong> <code>$rename</code>, <code>$each</code> y <code>upsert: true</code>.</li>
                </ol>
            </div>
        `
    },

    // 3
    {
        html: `
            <h2>Traductor Rápido: De <code>UPDATE</code> y <code>DELETE</code> en SQL a MongoDB</h2>
            <div class="concept-box">
                En SQL usas <code>UPDATE tabla SET ... WHERE ...</code> y <code>DELETE FROM tabla WHERE ...</code>. En MongoDB el orden se invierte: <strong>primero va el filtro (<code>WHERE</code>) y después el cambio (<code>SET</code>)</strong>:
            </div>
            <table>
                <tr><th>En SQL (Oracle)</th><th>En MongoDB</th><th>Para qué sirve</th></tr>
                <tr><td><code>UPDATE ... WHERE id = 1</code></td><td><strong><code>updateOne( { filtro }, { cambio } )</code></strong></td><td>Modifica solo el <strong>primer</strong> documento que cumpla el filtro</td></tr>
                <tr><td><code>UPDATE ... WHERE modalidad = 'remoto'</code></td><td><strong><code>updateMany( { filtro }, { cambio } )</code></strong></td><td>Modifica <strong>todos</strong> los documentos que cumplan el filtro</td></tr>
                <tr><td><code>SET activa = 0, modalidad = 'híbrido'</code></td><td><strong><code>{ $set: { "activa": false } }</code></strong></td><td>Cambia el valor de un campo (o lo crea si no existía)</td></tr>
                <tr><td><code>SET sueldo = sueldo + 100000</code></td><td><strong><code>{ $inc: { "sueldo": 100000 } }</code></strong></td><td>Suma (o resta con <code>-</code>) a un número existente</td></tr>
                <tr><td><code>ALTER TABLE DROP COLUMN ...</code></td><td><strong><code>{ $unset: { "campo": "" } }</code></strong></td><td>Borra un campo específico dentro del documento</td></tr>
                <tr><td><em>(No existe en una celda SQL)</em></td><td><strong><code>$addToSet</code> / <code>$push</code> / <code>$pull</code></strong></td><td>Agrega o quita elementos dentro de un arreglo</td></tr>
                <tr><td><code>DELETE FROM ... WHERE ...</code></td><td><strong><code>deleteOne(filtro)</code> / <code>deleteMany(filtro)</code></strong></td><td>Elimina 1 documento o todos los que cumplan el filtro</td></tr>
            </table>
        `
    },

    // 4
    {
        html: `
            <h2>1. Preparar el Terreno: La Colección <code>postulaciones</code></h2>
            <div class="concept-box">
                Además de las <code>ofertas</code> que creaste en la sesión anterior, hoy registraremos <strong>3 postulaciones</strong> en una nueva colección llamada <strong><code>postulaciones</code></strong> para practicar cambios de estado, puntajes y limpieza:
            </div>
            <pre class="compact xs"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

db.postulaciones.<span class="fn">insertMany</span>([
    {
        <span class="str">"candidato"</span>: <span class="str">"Diego Morales"</span>,
        <span class="str">"cargo_postulado"</span>: <span class="str">"Desarrollador Backend Junior"</span>,
        <span class="str">"estado"</span>: <span class="str">"en_revision"</span>,
        <span class="str">"puntaje_tecnico"</span>: <span class="num">75</span>,
        <span class="str">"etapas_completadas"</span>: [<span class="str">"CV"</span>, <span class="str">"Filtro curricular"</span>],
        <span class="str">"nota_interna"</span>: <span class="str">"Revisar portafolio pendiente"</span>,
        <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>   <span class="cm">// Pon siempre TU nombre</span>
    },
    {
        <span class="str">"candidato"</span>: <span class="str">"Valentina Soto"</span>,
        <span class="str">"cargo_postulado"</span>: <span class="str">"Practicante Base de Datos"</span>,
        <span class="str">"estado"</span>: <span class="str">"en_revision"</span>,
        <span class="str">"puntaje_tecnico"</span>: <span class="num">85</span>,
        <span class="str">"etapas_completadas"</span>: [<span class="str">"CV"</span>, <span class="str">"Test SQL"</span>],
        <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>
    },
    {
        <span class="str">"candidato"</span>: <span class="str">"PRUEBA - Postulante Fantasma"</span>,
        <span class="str">"cargo_postulado"</span>: <span class="str">"Analista QA Automatizador"</span>,
        <span class="str">"estado"</span>: <span class="str">"descartado"</span>,
        <span class="str">"puntaje_tecnico"</span>: <span class="num">20</span>,
        <span class="str">"etapas_completadas"</span>: [<span class="str">"CV"</span>],
        <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>
    }
]);</pre>
        `
    },

    // 5
    {
        html: `
            <h2>La Regla de Seguridad: Filtrar por <code>creado_por</code></h2>
            <div class="warning-box">
                Como varias secciones trabajan en la misma base de datos, cada vez que ejecutes un <code>updateOne</code>, <code>updateMany</code>, <code>deleteOne</code> o <code>deleteMany</code>, <strong>tu filtro debe incluir siempre <code>"creado_por": "Tu Nombre"</code></strong> acompañado de la condición que quieres aplicar.
            </div>
            <pre><span class="cm">// ✅ CORRECTO: modifica solo TUS ofertas remotas</span>
db.ofertas.<span class="fn">updateMany</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"modalidad"</span>: <span class="str">"remoto"</span> },  <span class="cm">// 1. Filtro (AND)</span>
    { <span class="kw">$set</span>: { <span class="str">"activa"</span>: <span class="kw">true</span> } }                                     <span class="cm">// 2. Cambio</span>
);

<span class="err">// ❌ PROHIBIDO: sin "creado_por" modificarías también las ofertas de tus compañeros</span>
<span class="err">db.ofertas.updateMany({ "modalidad": "remoto" }, { $set: { "activa": true } });</span></pre>
        `
    },

    // 6
    {
        html: `
            <h2>2. <code>updateOne()</code> vs <code>updateMany()</code> con <code>$set</code></h2>
            <div class="concept-box">
                El operador <strong><code>$set</code></strong> cambia el valor de uno o varios campos (y si el campo no existía, lo agrega al documento) sin borrar el resto de la información:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// A) updateOne: cambiar el estado de UNA postulación específica y agregarle fecha de entrevista</span>
db.postulaciones.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"candidato"</span>: <span class="str">"Valentina Soto"</span> },
    { <span class="kw">$set</span>: { <span class="str">"estado"</span>: <span class="str">"entrevista"</span>, <span class="str">"modalidad_entrevista"</span>: <span class="str">"online"</span> } }
);

<span class="cm">// B) updateMany: agregar el campo "beneficio_colacion": true a TODAS tus ofertas activas</span>
db.ofertas.<span class="fn">updateMany</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"activa"</span>: <span class="kw">true</span> },
    { <span class="kw">$set</span>: { <span class="str">"beneficio_colacion"</span>: <span class="kw">true</span> } }
);</pre>
            <div class="analogy-box">
                Fíjate en la respuesta del Playground: te dirá <code>matchedCount</code> (cuántos documentos encontró el filtro) y <code>modifiedCount</code> (cuántos cambiaron realmente).
            </div>
        `
    },

    // 7
    {
        html: `
            <h2>3. Sumar y Restar en Vivo con <code>$inc</code></h2>
            <div class="concept-box">
                En SQL hacías <code>SET sueldo = sueldo + 100000</code> o <code>SET vacantes = vacantes - 1</code>. En MongoDB no necesitas saber cuánto valía antes el número: usas <strong><code>$inc</code></strong> (<em>increment</em>) con un número positivo para sumar o negativo para restar:
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// 1. SUMAR (+): Subir el sueldo en $100.000 a todas tus ofertas de modalidad "remoto"</span>
db.ofertas.<span class="fn">updateMany</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"modalidad"</span>: <span class="str">"remoto"</span> },
    { <span class="kw">$inc</span>: { <span class="str">"sueldo"</span>: <span class="num">100000</span> } }
);

<span class="cm">// 2. RESTAR (-): Se contrató a una persona en "Desarrollador Backend Junior", descontamos 1 vacante</span>
db.ofertas.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"cargo"</span>: <span class="str">"Desarrollador Backend Junior"</span> },
    { <span class="kw">$inc</span>: { <span class="str">"vacantes"</span>: -<span class="num">1</span> } }
);

<span class="cm">// 3. Subir 10 puntos al puntaje_tecnico de Diego Morales</span>
db.postulaciones.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"candidato"</span>: <span class="str">"Diego Morales"</span> },
    { <span class="kw">$inc</span>: { <span class="str">"puntaje_tecnico"</span>: <span class="num">10</span> } }
);</pre>
        `
    },

    // 8
    {
        html: `
            <h2>Quitar un Campo que Ya No Sirve con <code>$unset</code></h2>
            <div class="concept-box">
                Si un documento quedó con un campo temporal o mal puesto (como <code>"nota_interna"</code> en la postulación de Diego) y quieres <strong>eliminar ese campo completo del documento</strong>, usas <strong><code>$unset</code></strong>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Eliminar el campo "nota_interna" del documento de Diego Morales:</span>
db.postulaciones.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"candidato"</span>: <span class="str">"Diego Morales"</span> },
    { <span class="kw">$unset</span>: { <span class="str">"nota_interna"</span>: <span class="str">""</span> } }
);</pre>
            <div class="tip-box">
                En <code>$unset: { "nombre_campo": "" }</code> no importa qué pongas después de los dos puntos (se suele poner <code>""</code> o <code>1</code>): MongoDB simplemente desaparece esa clave del documento.
            </div>
        `
    },

    // 9
    {
        html: `
            <h2>4. Modificar Listas: <code>$addToSet</code>, <code>$push</code> y <code>$pull</code></h2>
            <div class="concept-box">
                Cuando un campo es un arreglo (como <code>requisitos</code> en una oferta o <code>etapas_completadas</code> en una postulación), no uses <code>$set</code> (porque borrarías toda la lista anterior). Usa los 3 operadores de arreglos:
            </div>
            <table>
                <tr><th>Operador</th><th>¿Qué hace sobre el arreglo?</th><th>¿Cuándo usarlo?</th></tr>
                <tr>
                    <td><strong><code>$addToSet</code></strong></td>
                    <td>Agrega el elemento <strong>solo si NO estaba</strong> en la lista</td>
                    <td>Para listas sin repetidos (skills, requisitos, etapas)</td>
                </tr>
                <tr>
                    <td><strong><code>$push</code></strong></td>
                    <td>Agrega el elemento al final <strong>siempre</strong> (aunque ya exista)</td>
                    <td>Para historiales o bitácoras donde sí puede repetirse</td>
                </tr>
                <tr>
                    <td><strong><code>$pull</code></strong></td>
                    <td><strong>Saca y elimina</strong> todas las apariciones de ese valor en la lista</td>
                    <td>Para quitar un requisito o limpiar valores repetidos</td>
                </tr>
            </table>
        `
    },

    // 10
    {
        html: `
            <h2>Ejemplos en Vivo con Arreglos (<code>$addToSet</code> y <code>$pull</code>)</h2>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// 1. Agregar la etapa "Entrevista Técnica" a Valentina Soto (sin riesgo de duplicar)</span>
db.postulaciones.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"candidato"</span>: <span class="str">"Valentina Soto"</span> },
    { <span class="kw">$addToSet</span>: { <span class="str">"etapas_completadas"</span>: <span class="str">"Entrevista Técnica"</span> } }
);

<span class="cm">// 2. Agregar "Docker" a los requisitos de tu oferta de Desarrollador Backend Junior</span>
db.ofertas.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"cargo"</span>: <span class="str">"Desarrollador Backend Junior"</span> },
    { <span class="kw">$addToSet</span>: { <span class="str">"requisitos"</span>: <span class="str">"Docker"</span> } }
);

<span class="cm">// 3. Ya no se pide "Selenium" en la oferta de Analista QA: lo sacamos de la lista con $pull</span>
db.ofertas.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"cargo"</span>: <span class="str">"Analista QA Automatizador"</span> },
    { <span class="kw">$pull</span>: { <span class="str">"requisitos"</span>: <span class="str">"Selenium"</span> } }
);</pre>
            <div class="analogy-box">
                Recuerda de la Sesión 2: si alguien metió 22 veces <code>"Node.js"</code> con <code>$push</code>, un solo <code>$pull: { "skills": "Node.js" }</code> saca las 22 copias de un viaje.
            </div>
        `
    },

    // 11
    {
        html: `
            <h2>5. Eliminar Documentos: <code>deleteOne()</code> y <code>deleteMany()</code></h2>
            <div class="concept-box">
                Igual que al actualizar, para borrar documentos usamos un filtro que identifique exactamente nuestros registros:
                <br>• <strong><code>deleteOne(filtro)</code></strong> borra como máximo <strong>1 documento</strong>.
                <br>• <strong><code>deleteMany(filtro)</code></strong> borra <strong>todos los documentos</strong> que coincidan con el filtro.
            </div>
            <pre class="compact"><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// 1. deleteOne: eliminar la postulación de prueba que creamos al inicio</span>
db.postulaciones.<span class="fn">deleteOne</span>({
    <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>,
    <span class="str">"candidato"</span>: <span class="str">"PRUEBA - Postulante Fantasma"</span>
});

<span class="cm">// 2. deleteMany: eliminar todas TUS ofertas que estén inactivas (activa: false) Y sin vacantes (0)</span>
db.ofertas.<span class="fn">deleteMany</span>({
    <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>,
    <span class="str">"activa"</span>: <span class="kw">false</span>,
    <span class="str">"vacantes"</span>: <span class="num">0</span>
});</pre>
            <div class="warning-box">
                <strong>Truco profesional:</strong> Antes de correr un <code>deleteMany(filtro)</code>, prueba ese mismo filtro dentro de un <code>find(filtro)</code> o <code>countDocuments(filtro)</code> para estar 100% seguro de qué documentos se van a borrar.
            </div>
        `
    },

    // 12
    {
        html: `
            <h2>Tu Práctica de Hoy: Gestión en Vivo del Portal</h2>
            <div class="concept-box">
                Con esto ya manejas el ciclo <strong>CRUD completo</strong> (Create, Read, Update y Delete) en MongoDB.
            </div>
            <div class="analogy-box">
                <strong>📌 En el menú lateral → Tareas → Tarea 4: Gestión en Vivo de Ofertas y Postulaciones:</strong><br>
                1. Crearás tus 3 registros en <code>postulaciones</code>.<br>
                2. Actualizarás campos con <code>$set</code>, reajustarás sueldos y vacantes con <code>$inc</code> y limpiarás campos con <code>$unset</code>.<br>
                3. Modificarás arreglos con <code>$addToSet</code> y <code>$pull</code>, y eliminarás registros caducados con <code>deleteOne</code> y <code>deleteMany</code>.<br><br>
                <em>💡 ¿Quieres conocer 3 herramientas extra muy usadas en el trabajo real? Revisa las siguientes diapositivas de <strong>Contenido Extra</strong>.</em>
            </div>
        `
    },

    // 13 — EXTRA 1
    {
        html: `
            <h2>🚀 Contenido Extra 1: Corregir el Nombre de un Campo con <code>$rename</code></h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                ¿Recuerdas en la Sesión 2 cuando alguien escribió <code>"Carrera"</code> con mayúscula o <code>"fecha-registro"</code> con guion? ¿Cómo se corrige el nombre del campo sin perder el dato que tiene adentro?
            </div>
            <div class="concept-box">
                El operador <strong><code>$rename: { "nombre_viejo": "nombre_nuevo" }</code></strong> mueve el valor a la clave nueva y borra la clave vieja en un solo paso:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Cambiar el nombre del campo "cargo_postulado" a simplemente "cargo" en tus postulaciones:</span>
db.postulaciones.<span class="fn">updateMany</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span> },
    { <span class="kw">$rename</span>: { <span class="str">"cargo_postulado"</span>: <span class="str">"cargo"</span> } }
);</pre>
        `
    },

    // 14 — EXTRA 2
    {
        html: `
            <h2>🚀 Contenido Extra 2: Agregar Varios Elementos a la Vez con <code>$each</code></h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                ¿Qué pasa si quieres agregar <strong>3 requisitos nuevos</strong> a una oferta en una sola instrucción, sin tener que ejecutar 3 veces <code>$addToSet</code>?
            </div>
            <div class="concept-box">
                Si combinas <code>$addToSet</code> (o <code>$push</code>) con el modificador <strong><code>$each: [ ... ]</code></strong>, MongoDB recorre tu lista e inserta cada elemento por separado:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Agregar 3 tecnologías de una sola vez al arreglo "requisitos" sin duplicar ninguna:</span>
db.ofertas.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"cargo"</span>: <span class="str">"Practicante Base de Datos"</span> },
    {
        <span class="kw">$addToSet</span>: {
            <span class="str">"requisitos"</span>: { <span class="kw">$each</span>: [<span class="str">"MongoDB"</span>, <span class="str">"Git"</span>, <span class="str">"Excel"</span>] }
        }
    }
);</pre>
        `
    },

    // 15 — EXTRA 3
    {
        html: `
            <h2>🚀 Contenido Extra 3: Actualizar o Crear con <code>{ upsert: true }</code></h2>
            <div class="tip-box">
                <strong>Para ir más allá (Opcional — Desafío Extra):</strong><br>
                ¿Cómo podemos decirle a MongoDB: <em>"Busca esta oferta y actualízala; pero si todavía no existe, créala de inmediato sin duplicarla nunca"</em>?
            </div>
            <div class="concept-box">
                Agregando un <strong>tercer parámetro <code>{ upsert: true }</code></strong> (mezcla de <em>update</em> + <em>insert</em>) al final de <code>updateOne</code>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'directorio_talento'</span>);

<span class="cm">// Si la oferta de "Arquitecto Cloud" tuya no existe, la crea; si ya existe, solo actualiza el sueldo:</span>
db.ofertas.<span class="fn">updateOne</span>(
    { <span class="str">"creado_por"</span>: <span class="str">"Camila Rojas Pérez"</span>, <span class="str">"cargo"</span>: <span class="str">"Arquitecto Cloud"</span> },   <span class="cm">// 1. Filtro</span>
    { <span class="kw">$set</span>: { <span class="str">"empresa"</span>: <span class="str">"Andes Cloud SpA"</span>, <span class="str">"modalidad"</span>: <span class="str">"remoto"</span>, <span class="str">"sueldo"</span>: <span class="num">2200000</span>, <span class="str">"activa"</span>: <span class="kw">true</span> } }, <span class="cm">// 2. Cambio</span>
    { upsert: <span class="kw">true</span> }                                                      <span class="cm">// 3. Opción upsert</span>
);</pre>
            <div class="analogy-box">
                Si presionas Play 10 veces sobre un <code>updateOne</code> con <code>{ upsert: true }</code>, la primera vez lo crea y las otras 9 veces actualiza ese mismo documento sin crear copias repetidas.
            </div>
        `
    },

    // 16
    {
        html: `
            <h2>Resumen: Tu Mapa de Modificación y Eliminación</h2>
            <table>
                <tr><th>Lo que quieres lograr</th><th>Cómo se escribe en MongoDB</th></tr>
                <tr><td>Modificar 1 documento vs todos los que coincidan</td><td><code>updateOne(filtro, cambio)</code> / <code>updateMany(filtro, cambio)</code></td></tr>
                <tr><td>Cambiar el valor de un campo o agregar uno nuevo</td><td><code>{ $set: { "estado": "contratado" } }</code></td></tr>
                <tr><td>Sumar o restar a un campo numérico</td><td><code>{ $inc: { "sueldo": 100000, "vacantes": -1 } }</code></td></tr>
                <tr><td>Eliminar un campo de un documento</td><td><code>{ $unset: { "nota_interna": "" } }</code></td></tr>
                <tr><td>Agregar un valor a un arreglo sin repetir</td><td><code>{ $addToSet: { "requisitos": "Docker" } }</code></td></tr>
                <tr><td>Sacar un valor de un arreglo</td><td><code>{ $pull: { "requisitos": "Selenium" } }</code></td></tr>
                <tr><td>Borrar 1 documento vs borrar varios por condición</td><td><code>deleteOne(filtro)</code> / <code>deleteMany(filtro)</code></td></tr>
                <tr><td>🚀 Extra: renombrar / agregar varios / crear si no está</td><td><code>$rename</code>, <code>$each</code>, <code>{ upsert: true }</code></td></tr>
            </table>
            <div class="alien-separator">👽</div>
        `
    }

];

