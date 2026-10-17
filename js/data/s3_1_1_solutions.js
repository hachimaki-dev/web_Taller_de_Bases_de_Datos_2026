// s3_1_1_solutions.js — Solucionario: Bases de Datos NoSQL y MongoDB
// Unidad 3.1 — Sesión 1: JSON/BSON, Atlas y Operaciones Create & Read
// Explicaciones directas y código ejecutable para FlashEat

const s3_1_1_solutions = [
    // 1. Multiple Choice 1
    {
        id: 'e311-mc1',
        answer: 0,
        explanation: '<strong>Correcto.</strong> MongoDB utiliza <strong>BSON</strong> porque expande los tipos básicos de JSON con tipos esenciales como <code>Date</code> (marcas temporales precisas) y <code>ObjectId</code> (identificadores únicos globales), además de permitir recorridos a alta velocidad gracias a que incluye la longitud en bytes de cada campo.',
        fullSolution: 'El formato BSON es una especificación binaria abierta (bsonspec.org) que permite serializar documentos de manera eficiente en disco y en la red, superando las limitaciones del texto plano JSON en motores de bases de datos.'
    },

    // 2. Multiple Choice 2
    {
        id: 'e311-mc2',
        answer: 0,
        explanation: '<strong>Correcto.</strong> En MongoDB una <strong>Colección (Collection)</strong> agrupa documentos de forma análoga a una tabla, y un <strong>Documento (Document)</strong> representa una entidad individual autocontenida de manera equivalente a una fila o tupla.',
        fullSolution: 'A diferencia de una tabla relacional, los documentos dentro de una misma colección no están forzados a compartir obligatoriamente la misma estructura de columnas, lo que otorga flexibilidad para datos polimórficos.'
    },

    // 3. Multiple Choice 3
    {
        id: 'e311-mc3',
        answer: 0,
        explanation: '<strong>Correcto.</strong> Al utilizar la <strong>Notación de Punto</strong> (<em>Dot Notation</em>) para descender a campos de subdocumentos embebidos (como <code>"direccion_entrega.comuna"</code>), es un requisito sintáctico ineludible en MongoDB rodear la clave con comillas dobles o simples.',
        fullSolution: 'Si omites las comillas (ej. <code>{ direccion_entrega.comuna: "Providencia" }</code>), el intérprete de JavaScript del Playground intentará evaluar <code>direccion_entrega</code> como una variable no definida en memoria, causando un <code>ReferenceError</code>.'
    },

    // 4. True / False 1
    {
        id: 'e311-tf1',
        answer: false,
        explanation: '<strong>Falso.</strong> MongoDB opera con <strong>creación implícita y dinámica</strong>. No requiere ningún comando DDL previo tipo <code>CREATE TABLE</code> ni definición previa de columnas. Tanto la base de datos como la colección se crean automáticamente en el instante en que se inserta el primer documento.'
    },

    // 5. True / False 2
    {
        id: 'e311-tf2',
        answer: true,
        explanation: '<strong>Verdadero.</strong> Por diseño de MongoDB, el campo clave <code>_id</code> siempre forma parte del resultado de cualquier consulta, incluso si especificas inclusiones explícitas de otros campos. Para que no aparezca, debes indicar expresamente <code>_id: 0</code> en el documento de proyección.'
    },

    // 6. Fill Code 1
    {
        id: 'e311-fill1',
        answers: [
            ['pedidos'],
            ['insertOne', 'insertOne('],
            ['new Date()', 'new Date(),', 'ISODate()']
        ],
        explanation: 'La colección se invoca como <code>db.pedidos</code>, el método de inserción individual es <code>insertOne</code>, y las marcas de tiempo en MongoDB se generan nativamente con el constructor de JavaScript <code>new Date()</code>.',
        fullSolution: `<pre>use('flasheat_db');

db.pedidos.insertOne({
    "restaurante": "Burger King Providencia",
    "total": 14990,
    "fecha_pedido": new Date(),
    "estado": "preparando"
});</pre>`
    },

    // 7. Fill Code 2
    {
        id: 'e311-fill2',
        answers: [
            ['$gte', '"$gte"'],
            ['sort', 'sort('],
            ['-1', '-1}']
        ],
        explanation: 'El operador de comparación mayor o igual es <code>$gte</code> (greater than or equal), el ordenamiento se aplica con el método <code>.sort()</code>, y el valor <code>-1</code> indica orden descendente (de mayor a menor).',
        fullSolution: `<pre>use('flasheat_db');

db.pedidos.find({
    "total": { $gte: 20000 }
}).sort({ "total": -1 });</pre>`
    },

    // 8. Find Error 1
    {
        id: 'e311-err1',
        answer: 2, // Línea 3 (índice 2): direccion_entrega.comuna sin comillas
        explanation: '<strong>Error en la línea 3 (índice 2):</strong> Toda clave que utilice notación de punto para acceder a campos anidados debe ir obligatoriamente entre comillas (<code>"direccion_entrega.comuna": "Las Condes"</code>).',
        fullSolution: `La consulta corregida debe llevar comillas en la clave anidada:
<pre>use('flasheat_db');
db.pedidos.find({
    "direccion_entrega.comuna": "Las Condes",
    "estado": "en_camino"
});</pre>`
    },

    // 9. Find Error 2
    {
        id: 'e311-err2',
        answer: 3, // Línea 4 (índice 3): mezcla de 1 y 0 en proyección
        explanation: '<strong>Error en la línea 4 (índice 3):</strong> MongoDB prohíbe terminantemente combinar inclusión (<code>1</code>) y exclusión (<code>0</code>) en un mismo objeto de proyección. La única excepción permitida es excluir <code>_id: 0</code> mientras se incluyen otros campos.',
        fullSolution: `Si deseas incluir solo restaurante y total, no debes mencionar metodo_pago con 0 (ya queda excluido automáticamente al indicar los que sí quieres):
<pre>use('flasheat_db');
db.pedidos.find(
    { estado: "entregado" },
    { restaurante: 1, total: 1, _id: 0 }
).limit(5);</pre>`
    },

    // 10. Word Search
    {
        id: 'e311-ws1',
        explanation: '<strong>¡Excelente trabajo!</strong> Has localizado los 5 conceptos cardinales del ecosistema NoSQL con MongoDB: DOCUMENT, BSON, ATLAS, FIELD y FIND.',
        fullSolution: '<ul><li><strong>DOCUMENT:</strong> Unidad atómica de datos en MongoDB.</li><li><strong>BSON:</strong> Serialización binaria de alta velocidad con tipos extendidos.</li><li><strong>ATLAS:</strong> Plataforma DBaaS multi-cloud totalmente administrada.</li><li><strong>FIELD:</strong> Par clave-valor dentro de un documento.</li><li><strong>FIND:</strong> Operación central para lectura de documentos.</li></ul>'
    },

    // 11. Proposed 1
    {
        id: 'e311-prop1',
        explanation: 'Solución completa con código ejecutable para el Playground de VS Code (<code>taller_flasheat_insert.mongodb.js</code>):',
        fullSolution: `<pre><span class="cm">// 1. Seleccionar la base de datos</span>
<span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

<span class="cm">// 2. Inserción individual de un restaurante en la colección 'restaurantes'</span>
db.restaurantes.<span class="fn">insertOne</span>({
    <span class="str">"nombre"</span>: <span class="str">"Otaku Sushi Delivery"</span>,
    <span class="str">"especialidad"</span>: <span class="str">"Sushi &amp; Nikkei"</span>,
    <span class="str">"abierto"</span>: <span class="kw">true</span>,
    <span class="str">"comunas_cobertura"</span>: [<span class="str">"Santiago Centro"</span>, <span class="str">"Providencia"</span>, <span class="str">"Ñuñoa"</span>],
    <span class="str">"contacto"</span>: {
        <span class="str">"telefono"</span>: <span class="str">"+56933445566"</span>,
        <span class="str">"email"</span>: <span class="str">"contacto@otakusushi.cl"</span>
    }
});

<span class="cm">// 3. Inserción masiva de 3 pedidos en la colección 'pedidos'</span>
db.pedidos.<span class="fn">insertMany</span>([
    {
        <span class="str">"restaurante"</span>: <span class="str">"Otaku Sushi Delivery"</span>,
        <span class="str">"total"</span>: <span class="num">12900</span>,
        <span class="str">"estado"</span>: <span class="str">"preparando"</span>,
        <span class="str">"metodo_pago"</span>: <span class="str">"debito"</span>,
        <span class="str">"fecha_pedido"</span>: <span class="kw">new</span> <span class="fn">Date</span>(),
        <span class="str">"items"</span>: [<span class="str">"Roll Tempura 10 cortes"</span>, <span class="str">"Bebida 1.5L"</span>],
        <span class="str">"direccion_entrega"</span>: {
            <span class="str">"calle"</span>: <span class="str">"San Diego 450"</span>,
            <span class="str">"comuna"</span>: <span class="str">"Santiago Centro"</span>
        }
    },
    {
        <span class="str">"restaurante"</span>: <span class="str">"Burger King Providencia"</span>,
        <span class="str">"total"</span>: <span class="num">28500</span>,
        <span class="str">"estado"</span>: <span class="str">"en_camino"</span>,
        <span class="str">"metodo_pago"</span>: <span class="str">"credito"</span>,
        <span class="str">"fecha_pedido"</span>: <span class="kw">new</span> <span class="fn">Date</span>(),
        <span class="str">"items"</span>: [<span class="str">"Mega Whopper Triple"</span>, <span class="str">"Papas Grandes"</span>, <span class="str">"Aros de Cebolla"</span>],
        <span class="str">"direccion_entrega"</span>: {
            <span class="str">"calle"</span>: <span class="str">"Los Leones 120"</span>,
            <span class="str">"comuna"</span>: <span class="str">"Providencia"</span>
        }
    },
    {
        <span class="str">"restaurante"</span>: <span class="str">"Pizzeria Napoli"</span>,
        <span class="str">"total"</span>: <span class="num">8400</span>,
        <span class="str">"estado"</span>: <span class="str">"entregado"</span>,
        <span class="str">"metodo_pago"</span>: <span class="str">"efectivo"</span>,
        <span class="str">"fecha_pedido"</span>: <span class="kw">new</span> <span class="fn">Date</span>(),
        <span class="str">"items"</span>: [<span class="str">"Pizza Individual Pepperoni"</span>],
        <span class="str">"direccion_entrega"</span>: {
            <span class="str">"calle"</span>: <span class="str">"Irarrazaval 2300"</span>,
            <span class="str">"comuna"</span>: <span class="str">"Ñuñoa"</span>
        }
    }
]);</pre>`
    },

    // 12. Proposed 2
    {
        id: 'e311-prop2',
        explanation: 'Solución completa con código ejecutable para el Playground de consultas (<code>taller_flasheat_queries.mongodb.js</code>):',
        fullSolution: `<pre><span class="kw">use</span>(<span class="str">'flasheat_db'</span>);

<span class="cm">// 1. Consulta de Monitoreo Activo: Destino Providencia y estado en camino</span>
db.pedidos.<span class="fn">find</span>({
    <span class="str">"direccion_entrega.comuna"</span>: <span class="str">"Providencia"</span>,
    <span class="str">"estado"</span>: <span class="str">"en_camino"</span>
});

<span class="cm">// 2. Top 2 Ventas Premium superiores a $15.000 (sin _id y ordenado de mayor a menor)</span>
db.pedidos.<span class="fn">find</span>(
    { <span class="str">"total"</span>: { <span class="kw">$gt</span>: <span class="num">15000</span> } },
    { <span class="str">"restaurante"</span>: <span class="num">1</span>, <span class="str">"total"</span>: <span class="num">1</span>, <span class="str">"_id"</span>: <span class="num">0</span> }
)
.<span class="fn">sort</span>({ <span class="str">"total"</span>: <span class="num">-1</span> })
.<span class="fn">limit</span>(<span class="num">2</span>);

<span class="cm">// 3. Filtro Multiestado con $in (preparando o en camino)</span>
db.pedidos.<span class="fn">find</span>({
    <span class="str">"estado"</span>: { <span class="kw">$in</span>: [<span class="str">"preparando"</span>, <span class="str">"en_camino"</span>] }
});</pre>`
    }
];
