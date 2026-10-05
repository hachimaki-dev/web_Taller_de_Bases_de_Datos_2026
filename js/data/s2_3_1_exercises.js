// s2_3_1_exercises.js — Ejercicios: Paquetes PL/SQL (Packages) — Nivel Introductorio
// Casos prácticos y fundamentales aplicados a Punto Ticket

const s2_3_1_exercises = [
    {
        id: 'e231-mc1',
        type: 'multiple-choice',
        question: '¿Cuál es el orden correcto de compilación al crear un nuevo paquete en Oracle?',
        options: [
            'Primero se compila la <strong>Especificación</strong> (<code>PACKAGE</code>) y luego se compila el <strong>Cuerpo</strong> (<code>PACKAGE BODY</code>).',
            'Primero se compila el Cuerpo y luego la Especificación.',
            'Ambas partes deben compilarse simultáneamente en un solo comando sin separaciones.',
            'El orden no importa, Oracle infiere la estructura automáticamente.'
        ]
    },
    {
        id: 'e231-mc2',
        type: 'multiple-choice',
        question: '¿Cómo se invoca una función o procedimiento que forma parte del paquete <code>pkg_boleteria</code>?',
        options: [
            'Usando la <strong>notación de punto</strong>: <code>pkg_boleteria.nombre_subprograma(parametros)</code>.',
            'Escribiendo solo el nombre del subprograma sin mencionar el paquete.',
            'Ejecutando <code>CALL PACKAGE pkg_boleteria -> subprograma</code>.',
            'Los paquetes no se pueden invocar desde PL/SQL, solo desde triggers.'
        ]
    },
    {
        id: 'e231-mc3',
        type: 'multiple-choice',
        question: 'Si declaramos la variable <code>g_total_vendidas NUMBER := 0;</code> en la cabecera de <code>pkg_boleteria</code>, ¿qué ocurre con su valor entre dos llamadas distintas del mismo usuario?',
        options: [
            '<strong>Mantiene su valor acumulado</strong> en la memoria de la sesión mientras el usuario permanezca conectado.',
            'Se reinicia en 0 inmediatamente apenas termina cada procedimiento.',
            'Se guarda en el disco duro permanentemente como una tabla.',
            'Oracle arroja un error porque las variables de paquete no pueden cambiar de valor.'
        ]
    },
    {
        id: 'e231-tf1',
        type: 'true-false',
        question: 'En la <strong>Especificación</strong> de un paquete (<code>CREATE PACKAGE</code>) se debe incluir el código ejecutable completo (las sentencias <code>BEGIN</code> y <code>END</code>) de cada función y procedimiento.'
    },
    {
        id: 'e231-tf2',
        type: 'true-false',
        question: 'Dentro del cuerpo de un paquete, un procedimiento puede invocar directamente a una función declarada dentro del mismo paquete para reutilizar su lógica.'
    },
    {
        id: 'e231-fill1',
        type: 'fill-code',
        question: 'Completa la <strong>Especificación</strong> del paquete <code>pkg_localidades</code> para declarar una variable de turno y la cabecera de una función de consulta de precio:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE ' },
            { type: 'blank', index: 0, placeholder: 'tipo objeto', width: 90 },
            { type: 'text', content: ' pkg_localidades AS\n    -- Variable de sesión\n    g_consultas ' },
            { type: 'blank', index: 1, placeholder: 'tipo dato', width: 80 },
            { type: 'text', content: ' := 0;\n\n    -- Firma de función para obtener precio\n    FUNCTION obtener_precio(p_localidad_id IN NUMBER) ' },
            { type: 'blank', index: 2, placeholder: 'cláusula retorno', width: 140 },
            { type: 'text', content: ';\nEND pkg_localidades;\n/' }
        ]
    },
    {
        id: 'e231-fill2',
        type: 'fill-code',
        question: 'Completa el encabezado del <strong>Cuerpo (Body)</strong> del paquete <code>pkg_localidades</code>:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE ' },
            { type: 'blank', index: 0, placeholder: 'cuerpo del paquete', width: 140 },
            { type: 'text', content: ' pkg_localidades AS\n\n    FUNCTION obtener_precio(p_localidad_id IN NUMBER) RETURN NUMBER IS\n        v_precio NUMBER;\n    BEGIN\n        SELECT precio INTO v_precio\n        FROM LOCALIDAD_EVENTO\n        WHERE localidad_evento_id = p_localidad_id;\n        RETURN v_precio;\n    END obtener_precio;\n\n' },
            { type: 'blank', index: 1, placeholder: 'cierre de paquete', width: 160 },
            { type: 'text', content: ';\n/' }
        ]
    },
    {
        id: 'e231-err1',
        type: 'find-error',
        question: 'Encuentra la línea que contiene un error de sintaxis en la <strong>Especificación</strong> del paquete (olvido de un elemento fundamental en las firmas):',
        lines: [
            'CREATE OR REPLACE PACKAGE pkg_consulta AS',
            '    g_contador NUMBER := 0;',
            '    FUNCTION obtener_stock(p_id NUMBER) RETURN NUMBER',
            '    PROCEDURE actualizar_stock(p_id NUMBER, p_cant NUMBER);',
            'END pkg_consulta;',
            '/'
        ]
    },
    {
        id: 'e231-err2',
        type: 'find-error',
        question: 'Encuentra la línea con error en este <strong>PACKAGE BODY</strong> (las cabeceras del cuerpo no usan AS/IS antes de la lista de parámetros):',
        lines: [
            'CREATE OR REPLACE PACKAGE BODY pkg_consulta AS',
            '    g_limite NUMBER := 10;',
            '    FUNCTION obtener_stock(p_id NUMBER) RETURN NUMBER AS',
            '        v_res NUMBER;',
            '    BEGIN',
            '        RETURN 100;',
            '    END obtener_stock;',
            '    PROCEDURE AS actualizar_stock(p_id NUMBER, p_cant NUMBER) IS',
            '    BEGIN',
            '        DBMS_OUTPUT.PUT_LINE(\'Stock actualizado\');',
            '    END actualizar_stock;',
            'END pkg_consulta;',
            '/'
        ]
    },
    {
        id: 'e231-ws1',
        type: 'word-search',
        question: 'Encuentra los siguientes <strong>5 términos fundamentales</strong> de la sesión de paquetes:',
        gridSize: 10,
        words: ['PACKAGE', 'BODY', 'SPEC', 'STOCK', 'TURNO'],
        wordPlacements: [
            { word: 'PACKAGE', cells: [0, 1, 2, 3, 4, 5, 6], clue: 'Contenedor que agrupa subprogramas y variables en Oracle' },
            { word: 'BODY', cells: [20, 21, 22, 23], clue: 'Cuerpo del paquete donde se programa la lógica ejecutable' },
            { word: 'SPEC', cells: [40, 41, 42, 43], clue: 'Especificación o lista pública de lo que contiene el paquete' },
            { word: 'STOCK', cells: [60, 61, 62, 63, 64], clue: 'Cantidad de entradas disponibles en una localidad' },
            { word: 'TURNO', cells: [80, 81, 82, 83, 84], clue: 'Período de sesión del cajero donde se acumulan las ventas' }
        ],
        grid: [
            {letter:'P'},{letter:'A'},{letter:'C'},{letter:'K'},{letter:'A'},{letter:'G'},{letter:'E'},{letter:'B'},{letter:'C'},{letter:'D'},
            {letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'M'},{letter:'N'},
            {letter:'B'},{letter:'O'},{letter:'D'},{letter:'Y'},{letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},
            {letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'},{letter:'Z'},{letter:'A'},{letter:'B'},{letter:'C'},{letter:'D'},{letter:'E'},
            {letter:'S'},{letter:'P'},{letter:'E'},{letter:'C'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},
            {letter:'L'},{letter:'M'},{letter:'N'},{letter:'O'},{letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},
            {letter:'S'},{letter:'T'},{letter:'O'},{letter:'C'},{letter:'K'},{letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'},{letter:'Z'},
            {letter:'A'},{letter:'B'},{letter:'C'},{letter:'D'},{letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},
            {letter:'T'},{letter:'U'},{letter:'R'},{letter:'N'},{letter:'O'},{letter:'K'},{letter:'L'},{letter:'M'},{letter:'N'},{letter:'O'},
            {letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},{letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'}
        ]
    },
    {
        id: 'e231-prop1',
        type: 'proposed',
        question: '<strong>Problemática Práctica 1 — Paquete Sencillo: pkg_cliente_simple (Punto Ticket)</strong>',
        content: `<p>El equipo de atención a clientes necesita un paquete básico llamado <code>pkg_cliente_simple</code> para consultar el nombre de un comprador y actualizar su teléfono de contacto.</p>
        <p><strong>Requisitos de la Especificación:</strong></p>
        <ul>
            <li><code>FUNCTION obtener_nombre_completo(p_cliente_id IN NUMBER) RETURN VARCHAR2;</code></li>
            <li><code>PROCEDURE actualizar_telefono(p_cliente_id IN NUMBER, p_nuevo_telefono IN VARCHAR2);</code></li>
        </ul>
        <p><strong>Requisitos del Cuerpo (Body):</strong></p>
        <ol>
            <li>En <code>obtener_nombre_completo</code>: hacer un <code>SELECT nombre || ' ' || apellido INTO ... FROM CLIENTE WHERE cliente_id = p_cliente_id;</code> y retornar ese texto.</li>
            <li>En <code>actualizar_telefono</code>: hacer un <code>UPDATE CLIENTE SET telefono = p_nuevo_telefono WHERE cliente_id = p_cliente_id;</code> e imprimir con <code>DBMS_OUTPUT</code> un mensaje de confirmación.</li>
            <li>Escribir un bloque anónimo de prueba que consulte el nombre del cliente <code>1</code>, actualice su teléfono a <code>'+56911223344'</code> y finalmente aplique <code>ROLLBACK</code> para mantener la tabla limpia.</li>
        </ol>`
    },
    {
        id: 'e231-prop2',
        type: 'proposed',
        question: '<strong>Problemática Práctica 2 — Paquete con Constante y Contador: pkg_precios_simple (Punto Ticket)</strong>',
        content: `<p>En boletería se cobra un recargo de servicio del 10% por compra presencial. Queremos centralizar este cálculo en un paquete llamado <code>pkg_precios_simple</code>.</p>
        <p><strong>Requisitos de la Especificación:</strong></p>
        <ul>
            <li>Constante pública: <code>c_recargo_servicio CONSTANT NUMBER := 0.10;</code> (10% de recargo).</li>
            <li>Variable pública de sesión: <code>g_cotizaciones NUMBER := 0;</code> (contador de consultas del turno).</li>
            <li>Función pública: <code>precio_con_recargo(p_localidad_id IN NUMBER) RETURN NUMBER;</code></li>
            <li>Procedimiento público: <code>ajustar_precio_base(p_localidad_id IN NUMBER, p_nuevo_precio IN NUMBER);</code></li>
        </ul>
        <p><strong>Requisitos del Cuerpo (Body):</strong></p>
        <ol>
            <li>En <code>precio_con_recargo</code>: obtener el <code>precio</code> de <code>LOCALIDAD_EVENTO</code>, multiplicarlo por <code>(1 + c_recargo_servicio)</code>, sumar <code>+1</code> a la variable <code>g_cotizaciones</code> y retornar el precio calculado con <code>ROUND(..., 0)</code>.</li>
            <li>En <code>ajustar_precio_base</code>: actualizar el precio de la localidad en <code>LOCALIDAD_EVENTO</code> con <code>p_nuevo_precio</code>.</li>
            <li>Escribir un bloque anónimo que consulte el precio con recargo de la localidad <code>1</code>, verifique que <code>g_cotizaciones</code> aumentó a <code>1</code>, y aplique <code>ROLLBACK</code>.</li>
        </ol>`
    }
];
