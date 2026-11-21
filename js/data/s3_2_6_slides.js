// s3_2_6_slides.js — Guía en Simple: Evaluación Parcial N° 3 (MongoDB Atlas)
// Diseño de lectura en 5 segundos por diapositiva + Preguntas orientadoras para la clase de hoy

const s3_2_6_slides = [
    // 1 — PORTADA
    {
        class: 'title-slide',
        html: `
            <div style="font-size: 1.15em;">
                <span style="background: #ede9fe; color: #6d28d9; font-weight: 800; padding: 0.35rem 1rem; border-radius: 999px; font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.05em;">
                    Hito Evaluativo Final · EA3
                </span>
                <h1 style="font-size: 2.6em; margin-top: 0.6em; margin-bottom: 0.3em;">Evaluación Parcial N° 3</h1>
                <p class="subtitle" style="font-size: 1.35em; color: #334155; font-weight: 600;">
                    Diseño e Implementación NoSQL en MongoDB Atlas
                </p>
                <p class="subtitle" style="font-size: 1.05em; margin-top: 0.8em;">
                    👥 Equipos de máximo <strong>3 integrantes</strong> &nbsp;·&nbsp; 🍃 <strong>1 Colección completa + CRUD</strong>
                </p>
                <div class="alien-separator">👽</div>
            </div>
        `
    },

    // 2 — PONDERACIONES (30% / 10% / 60%)
    {
        html: `
            <h2 style="font-size: 1.85em; margin-bottom: 0.6em;">¿Cómo se Calcula tu Nota de la Evaluación 3?</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 0.5rem;">
                <div style="background: #eff6ff; border: 2px solid #93c5fd; border-radius: 16px; padding: 1.5rem; text-align: center;">
                    <div style="font-size: 3em; font-weight: 900; color: #1d4ed8; line-height: 1;">30%</div>
                    <div style="font-size: 1.25em; font-weight: 800; color: #1e293b; margin: 0.5rem 0 0.25rem;">Quiz Formativo</div>
                    <span style="background: #dbeafe; color: #1e40af; font-weight: 700; font-size: 0.8em; padding: 0.2rem 0.65rem; border-radius: 999px;">Individual · Ya rendido ✅</span>
                    <p style="font-size: 0.9em; color: #475569; margin-top: 0.75rem; margin-bottom: 0;">
                        El quiz práctico que ya resolvieron en la plataforma.
                    </p>
                </div>

                <div style="background: #ecfdf5; border: 2px solid #6ee7b7; border-radius: 16px; padding: 1.5rem; text-align: center;">
                    <div style="font-size: 3em; font-weight: 900; color: #047857; line-height: 1;">10%</div>
                    <div style="font-size: 1.25em; font-weight: 800; color: #1e293b; margin: 0.5rem 0 0.25rem;">Informe Escrito</div>
                    <span style="background: #d1fae5; color: #065f46; font-weight: 700; font-size: 0.8em; padding: 0.2rem 0.65rem; border-radius: 999px;">En Equipo (máx. 3) 📄</span>
                    <p style="font-size: 0.9em; color: #475569; margin-top: 0.75rem; margin-bottom: 0;">
                        Documento corto con su caso, modelo y pruebas CRUD.
                    </p>
                </div>

                <div style="background: #f5f3ff; border: 3px solid #8b5cf6; border-radius: 16px; padding: 1.5rem; text-align: center; box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.2);">
                    <div style="font-size: 3em; font-weight: 900; color: #6d28d9; line-height: 1;">60%</div>
                    <div style="font-size: 1.25em; font-weight: 800; color: #1e293b; margin: 0.5rem 0 0.25rem;">Defensa Oral</div>
                    <span style="background: #ede9fe; color: #5b21b6; font-weight: 700; font-size: 0.8em; padding: 0.2rem 0.65rem; border-radius: 999px;">Nota Individual 🎤</span>
                    <p style="font-size: 0.9em; color: #475569; margin-top: 0.75rem; margin-bottom: 0;">
                        Presentación ejecutiva y preguntas del docente a cada integrante.
                    </p>
                </div>
            </div>
        `
    },

    // 3 — LA IDEA EN 5 SEGUNDOS
    {
        html: `
            <h2 style="font-size: 1.85em; margin-bottom: 0.5em;">¿Qué Tienen que Hacer? (En Simple)</h2>
            <div class="concept-box" style="font-size: 1.25em; padding: 1.25rem 1.5rem; font-weight: 600;">
                Elegir un <strong>caso de negocio</strong>, diseñar <strong>1 colección bien completa</strong> en su propio cluster de <strong>MongoDB Atlas</strong> y demostrar cómo la manejan con <strong>CRUD</strong>.
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.25rem; font-size: 1.05em;">
                <div class="analogy-box" style="margin: 0;">
                    <strong>1️⃣ El Caso (Tema Libre)</strong><br>
                    Pueden continuar el negocio de la Eval 1 y 2 o elegir uno nuevo (clínica, tienda, eventos, gimnasio, etc.).
                </div>
                <div class="tip-box" style="margin: 0;">
                    <strong>2️⃣ La Colección</strong><br>
                    Basta con <strong>1 sola colección bien diseñada</strong> que aproveche arreglos <code>[ ]</code> y subdocumentos <code>{ }</code>.
                </div>
                <div class="concept-box" style="margin: 0;">
                    <strong>3️⃣ El CRUD en Vivo</strong><br>
                    Crear, buscar con filtros, actualizar y eliminar documentos reales desde su Playground.
                </div>
            </div>
        `
    },

    // 4 — QUÉ LLEVA EL INFORME (10%)
    {
        html: `
            <h2 style="font-size: 1.8em; margin-bottom: 0.5em;">📄 El Informe (Vale 10% · En Equipo)</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; font-size: 1.05em;">
                <div style="background: #f8fafc; border-left: 5px solid #2563eb; padding: 0.9rem 1.1rem; border-radius: 8px;">
                    <strong>1. Introducción</strong><br>
                    De qué trata su negocio, qué problema resuelven y qué tecnologías usan (MongoDB Atlas + VS Code).
                </div>
                <div style="background: #f8fafc; border-left: 5px solid #0284c7; padding: 0.9rem 1.1rem; border-radius: 8px;">
                    <strong>2. Relacional vs No Relacional</strong><br>
                    Diferencias, ventajas/desventajas y cuándo conviene SQL (Oracle) vs NoSQL (MongoDB).
                </div>
                <div style="background: #f8fafc; border-left: 5px solid #16a34a; padding: 0.9rem 1.1rem; border-radius: 8px;">
                    <strong>3. Su Modelo Documental</strong><br>
                    Por qué eligieron modelo documental y la estructura detallada de su colección y sus campos.
                </div>
                <div style="background: #f8fafc; border-left: 5px solid #d97706; padding: 0.9rem 1.1rem; border-radius: 8px;">
                    <strong>4. Operaciones CRUD (Con Pruebas)</strong><br>
                    Código y capturas de sus <code>insert</code>, <code>find</code>, <code>update</code> y <code>delete</code> aplicados al negocio.
                </div>
                <div style="background: #f8fafc; border-left: 5px solid #7c3aed; padding: 0.9rem 1.1rem; border-radius: 8px;">
                    <strong>5. Conclusión</strong><br>
                    Cómo esta colección aporta valor al negocio y qué mejoras harían a futuro.
                </div>
                <div style="background: #f8fafc; border-left: 5px solid #475569; padding: 0.9rem 1.1rem; border-radius: 8px;">
                    <strong>6. Anexos</strong><br>
                    El script <code>.mongodb.js</code> completo utilizado y el esquema/diagrama de su documento.
                </div>
            </div>
        `
    },

    // 5 — QUÉ SE EVALÚA EN LA PRESENTACIÓN / DEFENSA (60%)
    {
        html: `
            <h2 style="font-size: 1.8em; margin-bottom: 0.5em;">🎤 La Presentación y Defensa (Vale 60% · Individual)</h2>
            <div class="warning-box" style="font-size: 1.05em; margin-bottom: 1rem;">
                <strong>¡Aquí está el 60% de la nota!</strong> Exponen en equipo, pero cada estudiante es evaluado <strong>individualmente</strong> en estos 5 puntos:
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 1.08em;">
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 0.7rem 1.1rem; border-radius: 8px;">
                    🟣 <strong>1. El Problema y los Datos:</strong> Explicar en simple el negocio y qué información necesitan guardar y consultar.
                </div>
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 0.7rem 1.1rem; border-radius: 8px;">
                    🟣 <strong>2. SQL vs NoSQL (20% rúbrica):</strong> Explicar por qué en su caso conviene guardar un documento en vez de varias tablas con <code>JOIN</code>.
                </div>
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 0.7rem 1.1rem; border-radius: 8px;">
                    🟣 <strong>3. Justificar su Documento (20% rúbrica):</strong> Mostrar su JSON y explicar por qué usaron esos arreglos y subdocumentos.
                </div>
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 0.7rem 1.1rem; border-radius: 8px;">
                    🟣 <strong>4. Explicar su CRUD (20% rúbrica):</strong> Demostrar y explicar las consultas de inserción, búsqueda, actualización y borrado.
                </div>
            </div>
        `
    },

    // 6 — CÓMO HACER UNA BUENA PRESENTACIÓN
    {
        html: `
            <h2 style="font-size: 1.85em; margin-bottom: 0.6em;">Consejos para una Defensa de Nota 7.0</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; font-size: 1.1em;">
                <div class="warning-box" style="margin: 0; padding: 1.25rem;">
                    <strong style="font-size: 1.15em;">❌ Lo que NO deben hacer:</strong>
                    <ul style="margin-top: 0.75rem; line-height: 1.8;">
                        <li>Diapositivas llenas de texto copiado del informe.</li>
                        <li>Capturas de pantalla gigantes con letra ilegible.</li>
                        <li>"Yo solo hice el informe, mi compañero hizo el código".</li>
                        <li>Un documento plano de 3 campos sin arreglos ni objetos.</li>
                    </ul>
                </div>
                <div class="tip-box" style="margin: 0; padding: 1.25rem;">
                    <strong style="font-size: 1.15em;">✅ Lo que SÍ esperamos ver:</strong>
                    <ul style="margin-top: 0.75rem; line-height: 1.8;">
                        <li>Pocas palabras por slide: ideas visuales y directas.</li>
                        <li>El documento JSON en grande mostrando su estructura.</li>
                        <li>Código CRUD limpio y enfocado en casos reales del negocio.</li>
                        <li><strong>Todos los integrantes</strong> saben explicar cualquier consulta.</li>
                    </ul>
                </div>
            </div>
        `
    },

    // 7 — QUÉ ES "1 COLECCIÓN BIEN COMPLETA"
    {
        html: `
            <h2 style="font-size: 1.8em; margin-bottom: 0.4em;">¿Cómo se Ve "1 Colección Bien Completa"?</h2>
            <div class="concept-box" style="font-size: 1.05em; margin-bottom: 0.75rem;">
                Basta con <strong>1 colección</strong>, pero cada documento debe aprovechar la riqueza de MongoDB: <strong>campos simples + arreglos <code>[ ]</code> + subdocumentos <code>{ }</code></strong>.
            </div>
            <pre style="font-size: 0.85em; line-height: 1.55; margin: 0;">{
  <span class="str">"codigo_ficha"</span>: <span class="str">"ORD-101"</span>,                         <span class="cm">// Texto / identificador de negocio</span>
  <span class="str">"estado"</span>: <span class="str">"en_proceso"</span>,                            <span class="cm">// Estado que cambiarán con $set</span>
  <span class="str">"monto_total"</span>: <span class="num">45000</span>,                              <span class="cm">// Número que podrán ajustar con $inc</span>
  <span class="str">"activo"</span>: <span class="kw">true</span>,                                    <span class="cm">// Booleano para filtrar</span>
  <span class="str">"cliente"</span>: { <span class="str">"nombre"</span>: <span class="str">"Ana Paz"</span>, <span class="str">"comuna"</span>: <span class="str">"Ñuñoa"</span> }, <span class="cm">// 👈 SUBDOCUMENTO { }</span>
  <span class="str">"etiquetas"</span>: [<span class="str">"urgente"</span>, <span class="str">"convenio"</span>, <span class="str">"web"</span>],       <span class="cm">// 👈 ARREGLO DE TEXTOS [ ]</span>
  <span class="str">"items"</span>: [                                         <span class="cm">// 👈 ARREGLO DE SUBDOCUMENTOS [ { } ]</span>
    { <span class="str">"servicio"</span>: <span class="str">"Consulta General"</span>, <span class="str">"costo"</span>: <span class="num">25000</span> },
    { <span class="str">"servicio"</span>: <span class="str">"Examen Laboratorio"</span>, <span class="str">"costo"</span>: <span class="num">20000</span> }
  ],
  <span class="str">"fecha_creacion"</span>: <span class="kw">new</span> <span class="fn">Date</span>()                       <span class="cm">// Fecha real BSON</span>
}</pre>
        `
    },

    // 8 — CHECKLIST DEL CRUD QUE DEBEN DEMOSTRAR
    {
        html: `
            <h2 style="font-size: 1.8em; margin-bottom: 0.5em;">¿Qué Operaciones CRUD Deben Mostrar?</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 1.05em;">
                <div style="background: #eff6ff; border: 2px solid #93c5fd; border-radius: 12px; padding: 1.1rem;">
                    <strong style="color: #1d4ed8; font-size: 1.15em;">➕ 1. CREATE (Crear)</strong>
                    <ul style="margin-top: 0.5rem; margin-bottom: 0;">
                        <li><code>insertOne({ ... })</code> para registrar 1 ficha nueva.</li>
                        <li><code>insertMany([ ... ])</code> para cargar un lote inicial de datos (ej. 8 a 10 documentos variados).</li>
                    </ul>
                </div>

                <div style="background: #ecfdf5; border: 2px solid #6ee7b7; border-radius: 12px; padding: 1.1rem;">
                    <strong style="color: #047857; font-size: 1.15em;">🔍 2. READ (Consultar)</strong>
                    <ul style="margin-top: 0.5rem; margin-bottom: 0;">
                        <li><code>find()</code> con rangos (<code>$gte</code>, <code>$lte</code>), listas (<code>$in</code>, <code>$all</code>, <code>$nin</code>), subdocumentos y <code>$or</code>.</li>
                        <li>Proyección (ocultando <code>_id: 0</code>), <code>sort()</code>, <code>limit()</code> y <code>distinct()</code>.</li>
                    </ul>
                </div>

                <div style="background: #fef3c7; border: 2px solid #fcd34d; border-radius: 12px; padding: 1.1rem;">
                    <strong style="color: #b45309; font-size: 1.15em;">✏️ 3. UPDATE (Actualizar)</strong>
                    <ul style="margin-top: 0.5rem; margin-bottom: 0;">
                        <li><code>updateOne()</code> y <code>updateMany()</code>.</li>
                        <li>Cambiar estados con <code>$set</code>, sumar/restar montos o cupos con <code>$inc</code> y limpiar campos con <code>$unset</code>.</li>
                    </ul>
                </div>

                <div style="background: #fee2e2; border: 2px solid #fca5a5; border-radius: 12px; padding: 1.1rem;">
                    <strong style="color: #b91c1c; font-size: 1.15em;">🗑️ 4. DELETE (Eliminar)</strong>
                    <ul style="margin-top: 0.5rem; margin-bottom: 0;">
                        <li><code>deleteOne()</code> para borrar un registro puntual.</li>
                        <li><code>deleteMany()</code> con condiciones de negocio seguras (ej. registros cancelados o de prueba).</li>
                    </ul>
                </div>
            </div>
        `
    },

    // 9 — PREGUNTAS ORIENTADORAS PARA TRABAJAR HOY (PARTE 1: EL CASO)
    {
        html: `
            <h2 style="font-size: 1.75em; margin-bottom: 0.4em;">🛠️ Trabajo en Clase Hoy — Parte 1: Elegir su Caso</h2>
            <div class="analogy-box" style="font-size: 1.08em; margin-bottom: 0.85rem;">
                <strong>Reúnanse ahora en su equipo (máx. 3) y respondan estas 4 preguntas orientadoras:</strong>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.7rem; font-size: 1.08em;">
                <div style="background: #ffffff; border: 2px solid #cbd5e1; border-left: 6px solid #2563eb; padding: 0.75rem 1.1rem; border-radius: 8px;">
                    <strong>❓ 1. ¿Qué negocio vamos a trabajar?</strong><br>
                    <span style="color: #475569; font-size: 0.92em;">¿Adaptamos el caso de las Evaluaciones 1 y 2 (ej. eventos/tickets) o elegimos uno nuevo (clínica, veterinaria, e-commerce, arriendo de canchas, taller mecánico)?</span>
                </div>
                <div style="background: #ffffff; border: 2px solid #cbd5e1; border-left: 6px solid #2563eb; padding: 0.75rem 1.1rem; border-radius: 8px;">
                    <strong>❓ 2. ¿Cuál es la "ficha principal" que ese negocio consulta todo el día?</strong><br>
                    <span style="color: #475569; font-size: 0.92em;">Ej: En una clínica es la <em>ficha de atención</em>; en eventos es el <em>evento con sus localidades</em>; en un taller es la <em>orden de trabajo</em>.</span>
                </div>
                <div style="background: #ffffff; border: 2px solid #cbd5e1; border-left: 6px solid #2563eb; padding: 0.75rem 1.1rem; border-radius: 8px;">
                    <strong>❓ 3. ¿Por qué esa ficha sería incómoda de armar en tablas SQL?</strong><br>
                    <span style="color: #475569; font-size: 0.92em;">¿Cuántas tablas y <code>JOIN</code> necesitarían en Oracle para ver esa misma ficha completa? (¡Esa respuesta les sirve directo para el informe y la defensa!).</span>
                </div>
            </div>
        `
    },

    // 10 — PREGUNTAS ORIENTADORAS PARA TRABAJAR HOY (PARTE 2: LA COLECCIÓN)
    {
        html: `
            <h2 style="font-size: 1.75em; margin-bottom: 0.4em;">🛠️ Trabajo en Clase Hoy — Parte 2: Diseñar su Documento</h2>
            <div class="concept-box" style="font-size: 1.05em; margin-bottom: 0.85rem;">
                <strong>Ahora aterricen la estructura exacta de su colección respondiendo estas 5 preguntas:</strong>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 1.02em;">
                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; padding: 0.8rem 1rem; border-radius: 8px;">
                    <strong>1. Nombre de Base y Colección:</strong><br>
                    ¿Cómo se llamará la BD y la colección en su cluster? (Ej: <code>clinica_db</code> → <code>atenciones</code>).
                </div>
                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; padding: 0.8rem 1rem; border-radius: 8px;">
                    <strong>2. Campos Simples (4 o 5):</strong><br>
                    ¿Qué textos, números (precio/stock/cupos), booleanos (<code>activo</code>) y fechas (<code>new Date()</code>) tendrá?
                </div>
                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; padding: 0.8rem 1rem; border-radius: 8px;">
                    <strong>3. ¿Qué irá en un SUBDOCUMENTO <code>{ }</code>?</strong><br>
                    Ej: datos del cliente/responsable, ubicación (<code>ciudad</code>, <code>comuna</code>) o resumen de pago.
                </div>
                <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; padding: 0.8rem 1rem; border-radius: 8px;">
                    <strong>4. ¿Qué irá en un ARREGLO <code>[ ]</code>?</strong><br>
                    Ej: lista de etiquetas/categorías <code>["..."]</code> y/o lista de ítems/servicios <code>[ { ... } ]</code>.
                </div>
                <div style="grid-column: 1 / -1; background: #ecfdf5; border: 1.5px solid #6ee7b7; padding: 0.8rem 1rem; border-radius: 8px;">
                    <strong>5. ¿Qué cambios reales sufrirá este documento en el negocio (para el CRUD)?</strong><br>
                    ¿Qué campo numérico subirán o restarán con <code>$inc</code>? ¿Qué estado cambiarán con <code>$set</code>? ¿Qué campo temporal borrarán con <code>$unset</code>?
                </div>
            </div>
        `
    },

    // 11 — META DE HOY ANTES DE TERMINAR LA CLASE
    {
        html: `
            <h2 style="font-size: 1.85em; margin-bottom: 0.4em;">🎯 Meta de Hoy Antes de Salir de Clases</h2>
            <div class="tip-box" style="font-size: 1.15em; font-weight: 600; margin-bottom: 0.9rem;">
                Cada equipo debe dejar definida la <strong>estructura final de su colección</strong> y probar su primer <code>insertOne()</code> en su propio Playground de VS Code:
            </div>
            <pre style="font-size: 0.82em; line-height: 1.5; margin: 0;"><span class="kw">use</span>(<span class="str">'nombre_de_su_proyecto'</span>);

db.nombre_coleccion.<span class="fn">insertOne</span>({
    <span class="str">"codigo"</span>: <span class="str">"..."</span>,
    <span class="str">"titulo_o_nombre"</span>: <span class="str">"..."</span>,
    <span class="str">"estado"</span>: <span class="str">"activo"</span>,
    <span class="str">"monto_o_cupos"</span>: <span class="num">100</span>,
    <span class="str">"vigente"</span>: <span class="kw">true</span>,
    <span class="str">"detalle_objeto"</span>: { <span class="str">"campo1"</span>: <span class="str">"..."</span>, <span class="str">"campo2"</span>: <span class="str">"..."</span> },
    <span class="str">"lista_etiquetas"</span>: [<span class="str">"..."</span>, <span class="str">"..."</span>],
    <span class="str">"fecha_registro"</span>: <span class="kw">new</span> <span class="fn">Date</span>()
});</pre>
            <div class="analogy-box" style="font-size: 1.05em; margin-top: 0.9rem; margin-bottom: 0;">
                🙋‍♂️ <strong>Cuando tengan su estructura lista en el Playground, llamen al profe para validarla y quedan listos para armar su CRUD e informe.</strong>
            </div>
        `
    }
];
