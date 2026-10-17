// s3_1_1_exercises.js — Ejercicios: Bases de Datos NoSQL y MongoDB
// Unidad 3.1 — Sesión 1: JSON/BSON, Atlas y Operaciones Create & Read
// Caso Práctico de la Industria: FlashEat (Delivery & Fast Food)

const s3_1_1_exercises = [
    // 1. Multiple Choice 1: JSON vs BSON
    {
        id: 'e311-mc1',
        type: 'multiple-choice',
        question: '¿Por qué MongoDB almacena internamente los datos en formato <strong>BSON</strong> en lugar de texto plano JSON?',
        options: [
            'Porque <strong>BSON añade tipos de datos avanzados</strong> (como <code>Date</code>, <code>ObjectId</code> y <code>Decimal128</code>) y optimiza la lectura en disco al codificar la longitud de los campos.',
            'Porque JSON no permite almacenar arrays ni objetos anidados en bases de datos.',
            'Porque BSON encripta de forma obligatoria los archivos para que nadie pueda consultarlos sin clave de administrador.',
            'Porque el formato BSON convierte automáticamente los documentos a tablas relacionales de Oracle en segundo plano.'
        ]
    },

    // 2. Multiple Choice 2: Mapeo Relacional -> NoSQL
    {
        id: 'e311-mc2',
        type: 'multiple-choice',
        question: 'En el modelo documental de MongoDB, ¿cuáles son los conceptos equivalentes directos de una <strong>Tabla</strong> y una <strong>Fila</strong> del modelo relacional SQL?',
        options: [
            '<strong>Colección (Collection)</strong> y <strong>Documento (Document)</strong>.',
            'Base de Datos (Database) y Campo (Field).',
            'Cursor (Cursor) e Índice (Index).',
            'Documento (Document) y Array (Array).'
        ]
    },

    // 3. Multiple Choice 3: Notación de Punto
    {
        id: 'e311-mc3',
        type: 'multiple-choice',
        question: 'En FlashEat, para buscar pedidos cuya entrega sea en la comuna de <code>"Providencia"</code> dentro del objeto anidado <code>direccion_entrega: { comuna: "Providencia" }</code>, ¿cuál es la sintaxis correcta del filtro?',
        options: [
            '<code>{ "direccion_entrega.comuna": "Providencia" }</code> (las comillas en la clave son estrictamente obligatorias al usar notación de punto).',
            '<code>{ direccion_entrega.comuna: "Providencia" }</code> (sin comillas en el nombre de la propiedad).',
            '<code>{ "direccion_entrega": "Providencia" }</code> (MongoDB adivina automáticamente el campo interno).',
            '<code>{ direccion_entrega -&gt; comuna: "Providencia" }</code>.'
        ]
    },

    // 4. True / False 1: Creación Implícita
    {
        id: 'e311-tf1',
        type: 'true-false',
        question: 'En MongoDB es estrictamente obligatorio ejecutar una sentencia <code>CREATE TABLE</code> o definir un esquema previo con sus columnas antes de poder guardar el primer documento con <code>insertOne()</code>.'
    },

    // 5. True / False 2: Comportamiento del _id en proyecciones
    {
        id: 'e311-tf2',
        type: 'true-false',
        question: 'En una consulta con proyección como <code>db.pedidos.find({}, { total: 1, restaurante: 1 })</code>, el campo identificador <code>_id</code> se incluye automáticamente en los resultados a menos que se excluya explícitamente con <code>_id: 0</code>.'
    },

    // 6. Fill Code 1: Inserción individual
    {
        id: 'e311-fill1',
        type: 'fill-code',
        question: 'Completa la instrucción de JavaScript en Playground para insertar un nuevo pedido en la colección <code>pedidos</code> con fecha actual BSON y estado inicial:',
        parts: [
            { type: 'text', content: 'use(\'flasheat_db\');\n\ndb.' },
            { type: 'blank', index: 0, placeholder: 'colección', width: 90 },
            { type: 'text', content: '.' },
            { type: 'blank', index: 1, placeholder: 'método inserción', width: 110 },
            { type: 'text', content: '({\n    "restaurante": "Burger King Providencia",\n    "total": 14990,\n    "fecha_pedido": ' },
            { type: 'blank', index: 2, placeholder: 'tipo fecha', width: 120 },
            { type: 'text', content: ',\n    "estado": "preparando"\n});' }
        ]
    },

    // 7. Fill Code 2: Filtro con Operador y Ordenamiento
    {
        id: 'e311-fill2',
        type: 'fill-code',
        question: 'Completa la consulta para obtener pedidos con <code>total</code> mayor o igual a <code>20000</code> ordenados de mayor a menor precio:',
        parts: [
            { type: 'text', content: 'use(\'flasheat_db\');\n\ndb.pedidos.find({\n    "total": { ' },
            { type: 'blank', index: 0, placeholder: 'operador >=', width: 80 },
            { type: 'text', content: ': 20000 }\n}).' },
            { type: 'blank', index: 1, placeholder: 'método sort', width: 70 },
            { type: 'text', content: '({ "total": ' },
            { type: 'blank', index: 2, placeholder: 'orden desc', width: 60 },
            { type: 'text', content: ' });' }
        ]
    },

    // 8. Find Error 1: Notación de Punto sin Comillas
    {
        id: 'e311-err1',
        type: 'find-error',
        question: 'Encuentra la línea que contiene un error de sintaxis en este filtro de consulta de MongoDB Playground:',
        lines: [
            'use(\'flasheat_db\');',
            'db.pedidos.find({',
            '    direccion_entrega.comuna: "Las Condes",',
            '    estado: "en_camino"',
            '});'
        ]
    },

    // 9. Find Error 2: Mezcla ilegal en Proyección
    {
        id: 'e311-err2',
        type: 'find-error',
        question: 'Encuentra la línea con error en esta consulta con proyección (MongoDB no permite combinar inclusión <code>1</code> y exclusión <code>0</code> para campos comunes):',
        lines: [
            'use(\'flasheat_db\');',
            'db.pedidos.find(',
            '    { estado: "entregado" },',
            '    { restaurante: 1, total: 1, metodo_pago: 0 }',
            ').limit(5);'
        ]
    },

    // 10. Word Search: Términos Fundamentales
    {
        id: 'e311-ws1',
        type: 'word-search',
        question: 'Encuentra los siguientes <strong>5 términos fundamentales</strong> de la sesión de NoSQL y MongoDB:',
        gridSize: 10,
        words: ['DOCUMENT', 'BSON', 'ATLAS', 'FIELD', 'FIND'],
        wordPlacements: [
            { word: 'DOCUMENT', cells: [0, 1, 2, 3, 4, 5, 6, 7], clue: 'Unidad básica de registro en MongoDB (formato JSON/BSON)' },
            { word: 'BSON', cells: [20, 21, 22, 23], clue: 'Formato binario de almacenamiento interno que usa MongoDB' },
            { word: 'ATLAS', cells: [40, 41, 42, 43, 44], clue: 'Servicio de base de datos en la nube gestionado por MongoDB' },
            { word: 'FIELD', cells: [60, 61, 62, 63, 64], clue: 'Campo o atributo clave-valor dentro de un documento' },
            { word: 'FIND', cells: [80, 81, 82, 83], clue: 'Método principal para consultar y filtrar documentos en colecciones' }
        ],
        grid: [
            {letter:'D'},{letter:'O'},{letter:'C'},{letter:'U'},{letter:'M'},{letter:'E'},{letter:'N'},{letter:'T'},{letter:'A'},{letter:'B'},
            {letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'M'},{letter:'N'},
            {letter:'B'},{letter:'S'},{letter:'O'},{letter:'N'},{letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},
            {letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'},{letter:'Z'},{letter:'A'},{letter:'B'},{letter:'C'},{letter:'D'},{letter:'E'},
            {letter:'A'},{letter:'T'},{letter:'L'},{letter:'A'},{letter:'S'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},
            {letter:'L'},{letter:'M'},{letter:'N'},{letter:'O'},{letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},
            {letter:'F'},{letter:'I'},{letter:'E'},{letter:'L'},{letter:'D'},{letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'},{letter:'Z'},
            {letter:'A'},{letter:'B'},{letter:'C'},{letter:'D'},{letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},
            {letter:'F'},{letter:'I'},{letter:'N'},{letter:'D'},{letter:'O'},{letter:'K'},{letter:'L'},{letter:'M'},{letter:'N'},{letter:'O'},
            {letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},{letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'}
        ]
    },

    // 11. Proposed 1: Creación e Inserción de Catálogo y Pedidos
    {
        id: 'e311-prop1',
        type: 'proposed',
        question: '<strong>Problemática Práctica 1 — Creación e Inserción en FlashEat (Playground VS Code)</strong>',
        content: `<p>El equipo de ingeniería de <strong>FlashEat</strong> necesita iniciar una nueva base de datos para registrar locales gastronómicos y pedidos en despacho en la Región Metropolitana.</p>
        <p><strong>Requisitos a implementar en un Playground (<code>taller_flasheat_insert.mongodb.js</code>):</strong></p>
        <ol>
            <li>Seleccionar la base de datos <code>flasheat_db</code> con la instrucción <code>use('flasheat_db');</code>.</li>
            <li><strong>Inserción individual (<code>insertOne</code>):</strong> Crear una colección llamada <code>restaurantes</code> e insertar un local de sushi con:
                <ul>
                    <li><code>nombre</code>: "Otaku Sushi Delivery"</li>
                    <li><code>especialidad</code>: "Sushi & Nikkei"</li>
                    <li><code>abierto</code>: true</li>
                    <li><code>comunas_cobertura</code>: Array con <code>["Santiago Centro", "Providencia", "Ñuñoa"]</code></li>
                    <li><code>contacto</code>: Subdocumento con <code>telefono</code> y <code>email</code>.</li>
                </ul>
            </li>
            <li><strong>Inserción masiva (<code>insertMany</code>):</strong> En la colección <code>pedidos</code>, registrar en una sola sentencia 3 pedidos de prueba con:
                <ul>
                    <li>Pedido 1: Total 12.900, estado "preparando", comuna "Santiago Centro", método de pago "debito", fecha actual con <code>new Date()</code>.</li>
                    <li>Pedido 2: Total 28.500, estado "en_camino", comuna "Providencia", método de pago "credito", con 3 ítems en su array de productos.</li>
                    <li>Pedido 3: Total 8.400, estado "entregado", comuna "Ñuñoa", método de pago "efectivo".</li>
                </ul>
            </li>
        </ol>`
    },

    // 12. Proposed 2: Consultas Operacionales y Filtros de Despacho
    {
        id: 'e311-prop2',
        type: 'proposed',
        question: '<strong>Problemática Práctica 2 — Consultas de Despacho y Filtros Analíticos (FlashEat)</strong>',
        content: `<p>La central de monitoreo de repartidores de <strong>FlashEat</strong> requiere consultar el estado de la operación en tiempo real sin saturar la red con datos innecesarios.</p>
        <p><strong>Requisitos de consulta en <code>taller_flasheat_queries.mongodb.js</code>:</strong></p>
        <ol>
            <li><strong>Consulta de Monitoreo Activo:</strong> Obtener todos los pedidos que actualmente tengan como destino la comuna de <code>"Providencia"</code> (usando notación de punto) y cuyo <code>estado</code> sea <code>"en_camino"</code>.</li>
            <li><strong>Top Ventas Premium:</strong> Encontrar los 2 pedidos de mayor valor cuyo total sea estrictamente mayor a <code>15000</code> (usando <code>$gt</code>), aplicando:
                <ul>
                    <li>Proyección: mostrar únicamente los campos <code>restaurante</code> y <code>total</code> (ocultando explícitamente el <code>_id</code>).</li>
                    <li>Ordenamiento: descendente por el campo <code>total</code>.</li>
                    <li>Límite: limitar el resultado a 2 documentos.</li>
                </ul>
            </li>
            <li><strong>Filtro Multiestado con <code>$in</code>:</strong> Listar los pedidos que se encuentren en estado de preparación o en camino (<code>$in: ["preparando", "en_camino"]</code>) para calcular la carga pendiente de cocina.</li>
        </ol>`
    }
];
