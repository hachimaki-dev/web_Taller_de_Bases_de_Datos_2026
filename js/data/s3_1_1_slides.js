// s3_1_1_slides.js — Bases de Datos NoSQL y MongoDB
// Unidad 3.1 — Sesión 1: De Relacional a Documental: JSON, Atlas y Operaciones Create & Read
// Caso de Negocio: FlashEat (Delivery & Fast Food)

const s3_1_1_slides = [
    // 1. Portada
    {
        class: 'title-slide',
        html: `
            <h1>Bases de Datos NoSQL con MongoDB</h1>
            <p class="subtitle">Unidad 3.1 — Sesión 1: Del Modelo Relacional a Documentos (Create & Read)</p>
            <p class="subtitle">Taller de Bases de Datos — Caso Real: FlashEat Delivery</p>
            <div class="alien-separator">👽</div>
        `
    },

    // 2. La Ruta de la Clase
    {
        html: `
            <h2>La Ruta de Hoy</h2>
            <div class="concept-box">
                Hoy dejamos de lado las tablas rígidas de Oracle y aprendemos a pensar en <strong>documentos</strong>:
            </div>
            <div class="analogy-box">
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li><strong>El Dolor en la Cocina:</strong> Por qué una comanda de delivery no cabe bien en tablas SQL.</li>
                    <li><strong>El Lenguaje Universal:</strong> Qué es JSON y por qué MongoDB lo guarda como BSON.</li>
                    <li><strong>El Entorno:</strong> Conectar MongoDB Atlas en la nube con VS Code y Playgrounds.</li>
                    <li><strong>Manos al Código:</strong> Crear la base de datos de FlashEat e insertar y consultar pedidos en vivo.</li>
                </ol>
            </div>
        `
    },

    // 3. El Punto de Partida: La Comanda de la Cocina
    {
        html: `
            <h2>El Escenario: Una Comanda en la Cocina</h2>
            <div class="concept-box">
                Cuando pides comida por la app de <strong>FlashEat</strong>, en la cocina del restaurante se imprime un papel térmico:
            </div>
            <div class="analogy-box">
                <strong>🧾 Comanda de Pedido #1042</strong><br>
                • <strong>Cliente:</strong> Diego Morales (+569 8765 4321)<br>
                • <strong>Dirección:</strong> Av. Providencia 1450, Depto 402, Providencia<br>
                • <strong>Plato 1:</strong> Hamburguesa Smash (sin cebolla, extra cheddar)<br>
                • <strong>Plato 2:</strong> Pizza Familiar (masa delgada, borde de queso)<br>
                • <strong>Total:</strong> $22.490 | <strong>Pago:</strong> Débito
            </div>
            <div class="tip-box">
                El cocinero y el repartidor leen <strong>un solo papel continuo</strong>. Todo lo que necesitan saber está en ese documento.
            </div>
        `
    },

    // 4. El Dolor #1 en SQL: El Cementerio de Columnas Vacías
    {
        html: `
            <h2>El Dolor #1 en SQL: El Cementerio de NULLs</h2>
            <div class="concept-box">
                ¿Cómo guardarías en una sola tabla SQL los ítems de un restaurante que vende sushi, pizzas y hamburguesas?
            </div>
            <div class="warning-box">
                <strong>Si intentas meter todo en una tabla <code>PRODUCTO</code>:</strong><br>
                Terminas con columnas como: <code>tipo_masa</code>, <code>borde_queso</code>, <code>cortes_sushi</code>, <code>palitos_chinos</code>, <code>tipo_pan</code>, <code>punto_carne</code>...<br><br>
                <strong>El Resultado:</strong> El 90% de las filas tendrán celdas llenas de <code>NULL</code> porque una hamburguesa no tiene "cortes de sushi" ni una pizza tiene "punto de cocción".
            </div>
        `
    },

    // 5. El Dolor #2 en SQL: La Pesadilla de los 5 JOINs
    {
        html: `
            <h2>El Dolor #2 en SQL: La Pesadilla de los 5 JOINs</h2>
            <div class="concept-box">
                Para evitar los <code>NULL</code>, en SQL normalizamos y dividimos la información en 5 tablas:
            </div>
            <pre><span class="cm">-- En Oracle, para armar la pantalla del pedido en la app móvil:</span>
<span class="kw">SELECT</span> * 
<span class="kw">FROM</span> PEDIDO p
<span class="kw">JOIN</span> CLIENTE c <span class="kw">ON</span> p.cliente_id = c.cliente_id
<span class="kw">JOIN</span> DIRECCION d <span class="kw">ON</span> p.direccion_id = d.direccion_id
<span class="kw">JOIN</span> DETALLE_PEDIDO dp <span class="kw">ON</span> p.pedido_id = dp.pedido_id
<span class="kw">JOIN</span> PRODUCTO prod <span class="kw">ON</span> dp.producto_id = prod.producto_id;</pre>
            <div class="warning-box">
                Si un viernes por la noche hay <strong>20.000 repartidores</strong> abriendo la app al mismo tiempo, el motor SQL se ahoga calculando miles de JOINs por segundo.
            </div>
        `
    },

    // 6. La Solución Mental: El Enfoque Documental
    {
        html: `
            <h2>La Solución: ¿Y si guardamos la comanda entera?</h2>
            <div class="concept-box">
                En vez de desarmar la comanda en 5 tablas para luego reconstruirla con 5 JOINs... <strong>¿por qué no guardamos el pedido completo en un solo archivo tal como existe en la vida real?</strong>
            </div>
            <div class="analogy-box">
                <strong>Eso es el Modelo Documental:</strong><br>
                Los datos que se consultan juntos, <strong>se guardan juntos</strong>.<br>
                • 1 pedido = 1 documento autocontenido.<br>
                • Se lee del disco duro en <strong>1 sola operación rápida</strong> sin cruzar tablas.
            </div>
        `
    },

    // 7. Conoce a JSON
    {
        html: `
            <h2>La Comanda hecha Código: Formato JSON</h2>
            <div class="concept-box">
                <strong>JSON</strong> (<em>JavaScript Object Notation</em>) es el formato de texto estándar que usan las aplicaciones web y móviles para intercambiar información.
            </div>
            <pre><span class="cm">// La comanda de FlashEat representada en JSON limpio:</span>
{
  <span class="str">"restaurante"</span>: <span class="str">"Burger King"</span>,
  <span class="str">"total"</span>: <span class="num">15990</span>,
  <span class="str">"entregado"</span>: <span class="kw">false</span>,
  <span class="str">"items"</span>: [<span class="str">"Whopper Doble"</span>, <span class="str">"Papas Medianas"</span>],
  <span class="str">"cliente"</span>: {
    <span class="str">"nombre"</span>: <span class="str">"Diego Morales"</span>,
    <span class="str">"telefono"</span>: <span class="str">"+56987654321"</span>
  }
}</pre>
        `
    },

    // 8. Anatomía de un JSON: Las 3 Reglas de Oro
    {
        html: `
            <h2>Anatomía de un JSON: Las 3 Reglas de Oro</h2>
            <div class="concept-box">
                Cualquier estructura JSON se compone de 3 elementos elementales:
            </div>
            <ul style="margin: 0.75rem 0 0 1.2rem; line-height: 2;">
                <li><strong>1. Llaves <code>{ }</code>:</strong> Delimitan un <strong>Objeto</strong> con pares <code>"clave": valor</code>.</li>
                <li><strong>2. Corchetes <code>[ ]</code>:</strong> Delimitan una <strong>Lista / Array</strong> de valores ordenados.</li>
                <li><strong>3. Las Claves van con Comillas:</strong> En JSON estricto, los nombres de campo siempre van entre comillas dobles (<code>"total"</code>, no <code>total</code>).</li>
            </ul>
            <div class="tip-box">
                Soporta tipos básicos: texto (<code>string</code>), números (<code>number</code>), booleanos (<code>true/false</code>), listas (<code>array</code>) y sub-objetos anidados.
            </div>
        `
    },

    // 9. El Secreto de MongoDB: BSON
    {
        html: `
            <h2>El Secreto de MongoDB: ¿Por qué BSON?</h2>
            <div class="concept-box">
                Los humanos escribimos y leemos <strong>JSON</strong> (texto plano). Pero en el disco duro, MongoDB guarda los datos en <strong>BSON</strong> (<em>Binary JSON</em>).
            </div>
            <div class="analogy-box">
                <strong>¿Por qué en formato binario?</strong><br>
                • <strong>Velocidad pura:</strong> BSON anota al inicio cuántos bytes pesa cada campo. El motor puede "saltarse" datos que no le interesan sin leer letra por letra.<br>
                • <strong>Compresión:</strong> Ocupa menos espacio y viaja más rápido por la red.
            </div>
        `
    },

    // 10. Los Superpoderes de BSON: Tipos Extendidos
    {
        html: `
            <h2>Los Superpoderes de BSON: Tipos que JSON no tiene</h2>
            <div class="concept-box">
                JSON estándar tiene un gran problema: no tiene tipo de dato para <strong>fechas</strong> ni para <strong>identificadores de registro</strong>. BSON lo resuelve:
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 0.75rem; font-size: 0.95rem;">
                <tr style="background: #f1f5f9;">
                    <th style="padding: 0.5rem; border: 1px solid #cbd5e1;">Tipo BSON</th>
                    <th style="padding: 0.5rem; border: 1px solid #cbd5e1;">¿Para qué sirve en FlashEat?</th>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold;"><code>Date</code></td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Guarda la fecha y hora exacta del pedido en 64 bits con zona horaria.</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold;"><code>ObjectId</code></td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Clave primaria única autogenerada de 12 bytes para el campo <code>_id</code>.</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold;"><code>Decimal128</code></td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Valores monetarios exactos para no perder ni $1 por redondeos de coma flotante.</td>
                </tr>
            </table>
        `
    },

    // 11. ¿Qué es realmente NoSQL?
    {
        html: `
            <h2>¿Qué significa realmente NoSQL?</h2>
            <div class="concept-box">
                <strong>NoSQL</strong> significa <em>"Not Only SQL"</em> (No solo SQL).
            </div>
            <div class="analogy-box">
                No es que SQL esté "obsoleto" ni que NoSQL venga a destruirlo. Son herramientas distintas para problemas distintos:<br><br>
                • <strong>Relacional (Oracle):</strong> Excelente para consistencia estricta, contabilidad y datos con esquema fijo.<br>
                • <strong>NoSQL Documental (MongoDB):</strong> Excelente para catálogos dinámicos, lectura masiva a alta velocidad y estructuras flexibles.
            </div>
        `
    },

    // 12. Las 4 Familias NoSQL
    {
        html: `
            <h2>Las 4 Familias NoSQL en la Industria</h2>
            <div class="concept-box">
                Existen 4 formas de almacenar datos sin tablas relacionales:
            </div>
            <ul style="margin: 0.75rem 0 0 1.2rem; line-height: 1.8;">
                <li><strong>1. Documentos (MongoDB):</strong> Documentos JSON/BSON autocontenidos. La más versátil del mercado.</li>
                <li><strong>2. Clave-Valor (Redis):</strong> Pares ultra-rápidos en memoria RAM (&lt; 1 ms) para carritos y sesiones.</li>
                <li><strong>3. Columnar (Cassandra):</strong> Optimizada para escribir millones de métricas por segundo sin bloquearse.</li>
                <li><strong>4. Grafos (Neo4j):</strong> Para redes de amigos y rutas de despacho interconectadas.</li>
            </ul>
        `
    },

    // 13. ¿Cuándo usar Relacional vs NoSQL?
    {
        html: `
            <h2>La Regla Práctica: ¿Cuál elijo en mi proyecto?</h2>
            <div class="concept-box">
                Una comparación directa para tomar decisiones de arquitectura:
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 0.75rem; font-size: 0.9rem;">
                <tr style="background: #ede9fe;">
                    <th style="padding: 0.5rem; border: 1px solid #cbd5e1;">Situación de Negocio</th>
                    <th style="padding: 0.5rem; border: 1px solid #cbd5e1;">Base de Datos Recomendada</th>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Transferencias de dinero bancarias, balances contables</td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold; color: #1e3a8a;">Relacional (Oracle / PostgreSQL)</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Pedidos de delivery con opciones dinámicas y sin JOINs</td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold; color: #047857;">Documental (MongoDB)</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Catálogo de productos donde cada ítem tiene atributos distintos</td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold; color: #047857;">Documental (MongoDB)</td>
                </tr>
            </table>
        `
    },

    // 14. Diccionario de Supervivencia: De Oracle a MongoDB
    {
        html: `
            <h2>Diccionario de Supervivencia: De Oracle a MongoDB</h2>
            <div class="concept-box">
                Traduce al instante lo que ya aprendiste en Oracle:
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 0.75rem; font-size: 0.95rem;">
                <tr style="background: #f8fafc;">
                    <th style="padding: 0.5rem; border: 1px solid #cbd5e1;">En Oracle (Relacional)</th>
                    <th style="padding: 0.5rem; border: 1px solid #cbd5e1;">En MongoDB (Documental)</th>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Base de Datos (Schema)</td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold;">Database</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Tabla (Table)</td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold;">Colección (Collection)</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Fila / Registro (Row)</td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold;">Documento (Document)</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Columna (Column)</td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold;">Campo (Field)</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1;">Clave Primaria (PK)</td>
                    <td style="padding: 0.5rem; border: 1px solid #cbd5e1; font-weight: bold;">Campo clave <code>_id</code></td>
                </tr>
            </table>
        `
    },

    // 15. La Nube: MongoDB Atlas
    {
        html: `
            <h2>La Nube: MongoDB Atlas en 3 Puntos Clave</h2>
            <div class="concept-box">
                En este semestre no instalaremos servidores en tu computador. Usaremos <strong>MongoDB Atlas</strong>, la base de datos oficial en la nube:
            </div>
            <div class="analogy-box">
                • <strong>Es una Base de Datos como Servicio (DBaaS):</strong> MongoDB gestiona el hardware, las copias de seguridad y los servidores en la nube.<br>
                • <strong>Cluster Gratuito (M0 Sandbox):</strong> Disponemos de 512 MB de almacenamiento sin costo para nuestras prácticas.<br>
                • <strong>Accesible desde cualquier lugar:</strong> Te conectas desde la universidad o desde tu casa con la misma cuenta.
            </div>
        `
    },

    // 16. Tu Llave de Acceso: El Connection String
    {
        html: `
            <h2>Tu Llave: El Connection String URI</h2>
            <div class="concept-box">
                Para que cualquier programa hable con tu base de datos en Atlas, necesita una sola línea de conexión:
            </div>
            <pre><span class="kw">mongodb+srv://</span><span class="str">profesor_docente</span>:<span class="num">MiClave2026</span><span class="kw">@</span><span class="fn">cluster-flasheat.abcde.mongodb.net</span>/<span class="str">flasheat_db</span></pre>
            <div class="warning-box">
                <strong>Ojo con el Firewall en Atlas:</strong><br>
                En el panel web de Atlas, ve a <em>Network Access</em> y asegúrate de permitir tu IP (o <code>0.0.0.0/0</code> para el laboratorio). Si no lo haces, Atlas rechazará tu conexión silenciosamente.
            </div>
        `
    },

    // 17. Tu Taller: VS Code + Playgrounds
    {
        html: `
            <h2>Tu Entorno: VS Code + Playgrounds (.mongodb.js)</h2>
            <div class="concept-box">
                Trabajaremos directamente en Visual Studio Code con la extensión oficial <strong>MongoDB for VS Code</strong>.
            </div>
            <div class="tip-box">
                <strong>¿Cómo funciona un Playground?</strong><br>
                1. Creas un archivo con extensión <code>.mongodb.js</code> (ej: <code>clase1.mongodb.js</code>).<br>
                2. Escribes tus instrucciones JavaScript de MongoDB.<br>
                3. Presionas el botón <strong>Play verde</strong> arriba a la derecha (o <code>Ctrl+Alt+S</code> / <code>Cmd+Alt+S</code>).<br>
                4. El resultado aparece de inmediato en una pestaña interactiva al lado.
            </div>
        `
    },

    // 18. Paso 1: Seleccionar la Base de Datos
    {
        html: `
            <h2>Paso 1: Seleccionar la BD (Creación Implícita)</h2>
            <div class="concept-box">
                En MongoDB <strong>no existe <code>CREATE DATABASE</code> ni <code>CREATE TABLE</code></strong>.
            </div>
            <pre><span class="cm">// En la primera línea de tu playground:</span>
<span class="kw">use</span>(<span class="str">'flasheat_db'</span>);</pre>
            <div class="analogy-box">
                <strong>La regla de la creación implícita:</strong><br>
                Si la base de datos o la colección no existen, MongoDB no arroja error. Las crea automáticamente en memoria y las guarda en disco en el instante exacto en que insertas el primer documento.
            </div>
        `
    },

    // 19. Paso 2: El Primer Pedido con insertOne()
    {
        html: `
            <h2>Paso 2: Tu Primer Pedido con <code>insertOne()</code></h2>
            <div class="concept-box">
                Para guardar un documento usamos <code>db.nombre_coleccion.insertOne(objeto)</code>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

db.pedidos.<span class="fn">insertOne</span>({
    <span class="str">"restaurante"</span>: <span class="str">"Burger King Providencia"</span>,
    <span class="str">"total"</span>: <span class="num">14990</span>,
    <span class="str">"estado"</span>: <span class="str">"preparando"</span>,
    <span class="str">"fecha_pedido"</span>: <span class="kw">new</span> <span class="fn">Date</span>(),                 <span class="cm">// Fecha y hora actual</span>
    <span class="str">"items"</span>: [<span class="str">"Whopper Doble"</span>, <span class="str">"Papas Medianas"</span>], <span class="cm">// Array de platos</span>
    <span class="str">"direccion_entrega"</span>: {                      <span class="cm">// Subdocumento anidado</span>
        <span class="str">"calle"</span>: <span class="str">"Av. Providencia 1450"</span>,
        <span class="str">"comuna"</span>: <span class="str">"Providencia"</span>
    }
});</pre>
        `
    },

    // 20. El Campo Misterioso: _id y ObjectId
    {
        html: `
            <h2>El Campo Misterioso: ¿De dónde salió el <code>_id</code>?</h2>
            <div class="concept-box">
                Si ejecutas el código anterior, verás que MongoDB guardó esto en la base de datos:
            </div>
            <pre>{
  <span class="str">"_id"</span>: <span class="fn">ObjectId</span>(<span class="str">"652cf3a9f1b2c3d4e5f6a7b8"</span>),
  <span class="str">"restaurante"</span>: <span class="str">"Burger King Providencia"</span>,
  ...
}</pre>
            <div class="tip-box">
                <strong>Todo documento necesita una clave primaria:</strong><br>
                Si tú no le pasas un campo <code>_id</code>, MongoDB genera automáticamente un <strong><code>ObjectId</code></strong> de 12 bytes. Los primeros 4 bytes contienen la fecha y hora exacta del segundo en que se creó el pedido.
            </div>
        `
    },

    // 21. Paso 3: Carga Rápida con insertMany()
    {
        html: `
            <h2>Paso 3: Carga Rápida con <code>insertMany()</code></h2>
            <div class="concept-box">
                Si tienes varios pedidos listos, enviarlos uno a uno satura la red. Usamos <code>insertMany([ ... ])</code> con un <strong>array de objetos</strong>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

db.pedidos.<span class="fn">insertMany</span>([
    {
        <span class="str">"restaurante"</span>: <span class="str">"Sushi Roll Las Condes"</span>,
        <span class="str">"total"</span>: <span class="num">24990</span>,
        <span class="str">"estado"</span>: <span class="str">"en_camino"</span>
    },
    {
        <span class="str">"restaurante"</span>: <span class="str">"Pizzeria Napoli"</span>,
        <span class="str">"total"</span>: <span class="num">18500</span>,
        <span class="str">"estado"</span>: <span class="str">"preparando"</span>
    }
]);</pre>
            <div class="warning-box">
                <strong>Ojo con la sintaxis:</strong> <code>insertMany</code> exige corchetes <code>[ ]</code> porque recibe una lista.
            </div>
        `
    },

    // 22. Paso 4: Consultar con find() y findOne()
    {
        html: `
            <h2>Paso 4: Consultar con <code>find()</code> y <code>findOne()</code></h2>
            <div class="concept-box">
                El equivalente al <code>SELECT</code> de SQL:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

<span class="cm">// 1. Traer TODOS los pedidos de la colección (SELECT * FROM pedidos)</span>
db.pedidos.<span class="fn">find</span>();

<span class="cm">// 2. Traer el PRIMER pedido que esté en camino</span>
db.pedidos.<span class="fn">findOne</span>({ <span class="str">"estado"</span>: <span class="str">"en_camino"</span> });

<span class="cm">// 3. Traer todos los pedidos de un restaurante específico</span>
db.pedidos.<span class="fn">find</span>({ <span class="str">"restaurante"</span>: <span class="str">"Pizzeria Napoli"</span> });</pre>
            <div class="tip-box">
                <code>find()</code> devuelve un cursor con la lista de documentos. <code>findOne()</code> devuelve un único objeto directo.
            </div>
        `
    },

    // 23. Paso 5: Filtrar en Subdocumentos (Notación de Punto)
    {
        html: `
            <h2>Paso 5: Filtrar en Subdocumentos (Notación de Punto)</h2>
            <div class="concept-box">
                ¿Cómo buscamos pedidos con entrega en la comuna de <strong>Providencia</strong> si la comuna está dentro de <code>direccion_entrega</code>?
            </div>
            <pre><span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

<span class="cm">// Usamos la ruta con punto entre comillas:</span>
db.pedidos.<span class="fn">find</span>({
    <span class="str">"direccion_entrega.comuna"</span>: <span class="str">"Providencia"</span>
});</pre>
            <div class="warning-box">
                <strong>REGLA ESTRICTA:</strong> Siempre que uses punto en el nombre de un campo (<code>"padre.hijo"</code>), <strong>debes poner comillas obligatoriamente</strong>. Si las omites, el código arroja error de sintaxis en JavaScript.
            </div>
        `
    },

    // 24. Paso 6: Comparar Números ($gt, $gte, $lt)
    {
        html: `
            <h2>Paso 6: Comparar Números ($gt, $gte, $lt)</h2>
            <div class="concept-box">
                En SQL escribíamos <code>WHERE total &gt;= 20000</code>. En MongoDB los operadores llevan el signo dólar <code>$</code>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

<span class="cm">// Buscar pedidos con total MAYOR O IGUAL ($gte) a $20.000</span>
db.pedidos.<span class="fn">find</span>({
    <span class="str">"total"</span>: { <span class="kw">$gte</span>: <span class="num">20000</span> }
});</pre>
            <div class="analogy-box">
                • <code>$gt</code>: <em>Greater Than</em> (&gt; mayor que)<br>
                • <code>$gte</code>: <em>Greater Than or Equal</em> (&gt;= mayor o igual)<br>
                • <code>$lt</code>: <em>Less Than</em> (&lt; menor que)<br>
                • <code>$lte</code>: <em>Less Than or Equal</em> (&lt;= menor o igual)
            </div>
        `
    },

    // 25. Paso 7: Buscar en Listas con $in
    {
        html: `
            <h2>Paso 7: Buscar en Listas con el Operador <code>$in</code></h2>
            <div class="concept-box">
                ¿Cómo traemos los pedidos que están <code>"preparando"</code> O <code>"en_camino"</code>? En SQL usarías <code>WHERE estado IN (...)</code>.
            </div>
            <pre><span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

<span class="cm">// El operador $in recibe un array de opciones válidas:</span>
db.pedidos.<span class="fn">find</span>({
    <span class="str">"estado"</span>: { <span class="kw">$in</span>: [<span class="str">"preparando"</span>, <span class="str">"en_camino"</span>] }
});</pre>
            <div class="tip-box">
                Esto permite que la pantalla de monitoreo de cocina vea toda la carga de trabajo activa en una sola consulta limpia.
            </div>
        `
    },

    // 26. Paso 8: Proyecciones, Sort y Limit
    {
        html: `
            <h2>Paso 8: Proyecciones, Ordenamiento y Límites</h2>
            <div class="concept-box">
                Queremos ver solo el restaurante y el total de los <strong>3 pedidos más caros</strong>:
            </div>
            <pre><span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

db.pedidos.<span class="fn">find</span>(
    { },                                                <span class="cm">// 1. Filtro (todos)</span>
    { <span class="str">"restaurante"</span>: <span class="num">1</span>, <span class="str">"total"</span>: <span class="num">1</span>, <span class="str">"_id"</span>: <span class="num">0</span> }        <span class="cm">// 2. Proyección (1 = mostrar, 0 = ocultar)</span>
)
.<span class="fn">sort</span>({ <span class="str">"total"</span>: <span class="num">-1</span> })                                <span class="cm">// -1: Descendente (más caro primero)</span>
.<span class="fn">limit</span>(<span class="num">3</span>);                                           <span class="cm">// Solo los 3 primeros</span></pre>
            <div class="tip-box">
                El <code>_id</code> siempre se muestra por defecto. La única forma de sacarlo de la pantalla es poner <code>"_id": 0</code>.
            </div>
        `
    },

    // 27. Resumen y Misión Cumplida
    {
        html: `
            <h2>Resumen: Misión Cumplida</h2>
            <div class="concept-box">
                Hoy dominaste los cimientos de la tecnología que mueve las apps modernas:
            </div>
            <ul style="margin: 0.75rem 0 0 1.2rem; line-height: 2;">
                <li>🧾 <strong>Mentalidad Documental:</strong> Los datos de un pedido viven juntos en un solo bloque JSON/BSON.</li>
                <li>☁️ <strong>Atlas en la Nube:</strong> Conectado a VS Code con tu Connection String.</li>
                <li>⚡ <strong>CREATE:</strong> <code>insertOne()</code> e <code>insertMany()</code> con creación implícita de tablas.</li>
                <li>🔍 <strong>READ:</strong> Filtros exactos, notación de punto (<code>"direccion.comuna"</code>), operadores (<code>$gte</code>, <code>$in</code>) y ordenamiento.</li>
            </ul>
            <div class="alien-separator">👽</div>
        `
    }
];
