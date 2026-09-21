// s2_1_1_exercises.js — Ejercicios: Procedimientos Almacenados y Funciones — Fundamentos

const s2_1_1_exercises = [
    {
        id: 'e211-mc1',
        type: 'multiple-choice',
        question: '¿Cuál es la diferencia fundamental entre un procedimiento almacenado y una función en Oracle PL/SQL?',
        options: [
            'El procedimiento se compila y la función no',
            'La función <strong>siempre retorna un valor</strong> con <code>RETURN</code>; el procedimiento no retorna valor directamente',
            'El procedimiento puede recibir parámetros y la función no',
            'La función solo puede usarse en bloques anónimos, no en sentencias SQL'
        ]
    },
    {
        id: 'e211-mc2',
        type: 'multiple-choice',
        question: '¿Qué modo de parámetro permite que el procedimiento <strong>asigne un valor</strong> que el programa invocante pueda leer después de la llamada?',
        options: [
            '<code>IN</code> — el valor entra al procedimiento',
            '<code>OUT</code> — el procedimiento asigna un valor de salida',
            '<code>INOUT</code> — el valor se comparte bidireccionalmente',
            '<code>RETURN</code> — el procedimiento devuelve el valor'
        ]
    },
    {
        id: 'e211-mc3',
        type: 'multiple-choice',
        question: 'Si quieres usar una función dentro de una sentencia <code>SELECT</code>, ¿qué restricción debe cumplir?',
        options: [
            'Debe tener al menos un parámetro <code>OUT</code>',
            'No debe realizar operaciones DML (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) dentro de su cuerpo',
            'Debe ser declarada con <code>CREATE PROCEDURE</code> en lugar de <code>CREATE FUNCTION</code>',
            'Debe retornar siempre un valor de tipo <code>VARCHAR2</code>'
        ]
    },
    {
        id: 'e211-tf1',
        type: 'true-false',
        question: 'Un procedimiento almacenado puede utilizar la cláusula <code>RETURN</code> para devolver un valor al programa que lo invocó, igual que una función.'
    },
    {
        id: 'e211-tf2',
        type: 'true-false',
        question: 'Si no se especifica el modo de un parámetro al declararlo (es decir, no se escribe <code>IN</code>, <code>OUT</code> ni <code>IN OUT</code>), Oracle lo considera automáticamente como <code>IN</code>.'
    },
    {
        id: 'e211-fill1',
        type: 'fill-code',
        question: 'Completa la creación de un procedimiento que recibe un <code>evento_id</code> y un nombre de estado, y actualiza el estado del evento en la tabla <code>EVENTO</code>:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE ' },
            { type: 'blank', index: 0, placeholder: 'tipo bloque', width: 130 },
            { type: 'text', content: ' cambiar_estado_evento(\n    p_evento_id  IN NUMBER,\n    p_estado     IN VARCHAR2\n) AS\nBEGIN\n    UPDATE EVENTO\n    SET estado = p_estado\n    WHERE evento_id = ' },
            { type: 'blank', index: 1, placeholder: 'parámetro', width: 130 },
            { type: 'text', content: ';\n    COMMIT;\nEND cambiar_estado_evento;' }
        ]
    },
    {
        id: 'e211-fill2',
        type: 'fill-code',
        question: 'Completa la creación de una función que recibe un <code>cliente_id</code> y retorna la cantidad total de tickets emitidos para ese cliente:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE FUNCTION contar_tickets_cliente(\n    p_cliente_id IN NUMBER\n) ' },
            { type: 'blank', index: 0, placeholder: 'cláusula retorno', width: 150 },
            { type: 'text', content: '\nAS\n    v_total NUMBER;\nBEGIN\n    SELECT COUNT(*)\n    INTO v_total\n    FROM TICKET t\n    JOIN RESERVA_TEMPORAL rt ON rt.reserva_id = t.reserva_id\n    WHERE rt.cliente_id = p_cliente_id;\n    ' },
            { type: 'blank', index: 1, placeholder: 'sentencia retorno', width: 150 },
            { type: 'text', content: ';\nEND contar_tickets_cliente;' }
        ]
    },
    {
        id: 'e211-err1',
        type: 'find-error',
        question: 'Identifica la línea con el error en este procedimiento almacenado:',
        lines: [
            'CREATE OR REPLACE PROCEDURE desactivar_convenio(',
            '    p_convenio_id IN NUMBER',
            ') AS',
            'BEGIN',
            '    UPDATE CONVENIO_BANCO',
            '    SET activo = \'N\'',
            '    WHERE convenio_banco_id = p_convenio_id;',
            '    COMMIT;',
            '    RETURN \'Convenio desactivado\';',
            'END desactivar_convenio;'
        ]
    },
    {
        id: 'e211-err2',
        type: 'find-error',
        question: 'Identifica la línea con el error en esta función:',
        lines: [
            'CREATE OR REPLACE FUNCTION obtener_nombre_evento(',
            '    p_evento_id IN NUMBER',
            ') RETURN VARCHAR2',
            'AS',
            '    v_nombre VARCHAR2(200);',
            'BEGIN',
            '    SELECT nombre',
            '    INTO v_nombre',
            '    FROM EVENTO',
            '    WHERE evento_id = p_evento_id;',
            'END obtener_nombre_evento;'
        ]
    },
    {
        id: 'e211-cw1',
        type: 'crossword',
        question: 'Resuelve el crucigrama con <strong>6 términos clave</strong> sobre procedimientos y funciones en Oracle PL/SQL:',
        acrossClues: [
            { number: 1, clue: 'Bloque PL/SQL con nombre que ejecuta acciones sin retornar valor directamente (en inglés)', answer: 'PROCEDURE', row: 0, col: 0, direction: 'across' },
            { number: 3, clue: 'Modo de parámetro que permite que el procedimiento asigne un valor de salida (en inglés)', answer: 'OUT', row: 2, col: 3, direction: 'across' },
            { number: 5, clue: 'Cláusula para crear o reemplazar un bloque sin hacer DROP primero (en inglés)', answer: 'REPLACE', row: 4, col: 0, direction: 'across' }
        ],
        downClues: [
            { number: 2, clue: 'Bloque PL/SQL con nombre que siempre devuelve un valor (en inglés)', answer: 'FUNCTION', row: 0, col: 3, direction: 'down' },
            { number: 4, clue: 'Sentencia que devuelve el valor calculado dentro de una función (en inglés)', answer: 'RETURN', row: 1, col: 6, direction: 'down' },
            { number: 6, clue: 'Comando para invocar un procedimiento desde SQL*Plus (en inglés)', answer: 'EXECUTE', row: 2, col: 0, direction: 'down' }
        ]
    },
    {
        id: 'e211-prop1',
        type: 'proposed',
        question: '<strong>Ejercicio propuesto 1 — Procedimiento: Crear Reserva Temporal (Punto Ticket)</strong>',
        content: `<p>Crea un procedimiento almacenado llamado <code>crear_reserva_temporal</code> que reciba los siguientes parámetros:</p>
        <ul>
            <li><code>p_cliente_id</code> (<code>IN NUMBER</code>)</li>
            <li><code>p_localidad_evento_id</code> (<code>IN NUMBER</code>)</li>
            <li><code>p_reserva_id</code> (<code>OUT NUMBER</code>) — ID de la reserva generada</li>
        </ul>
        <p>El procedimiento debe:</p>
        <ol>
            <li>Verificar que el <code>stock_disponible</code> de la localidad sea mayor a 0. Si no hay stock, lanzar <code>RAISE_APPLICATION_ERROR(-20001, 'Sin stock disponible')</code>.</li>
            <li>Insertar un registro en <code>RESERVA_TEMPORAL</code> con estado <code>'ACTIVA'</code> y <code>fecha_expiracion</code> = <code>SYSTIMESTAMP + INTERVAL '15' MINUTE</code>.</li>
            <li>Descontar 1 unidad del <code>stock_disponible</code> en <code>LOCALIDAD_EVENTO</code>.</li>
            <li>Asignar el ID generado al parámetro <code>p_reserva_id</code>.</li>
            <li>Hacer <code>ROLLBACK</code> al final (para no alterar los datos de prueba).</li>
        </ol>`
    },
    {
        id: 'e211-prop2',
        type: 'proposed',
        question: '<strong>Ejercicio propuesto 2 — Función: Calcular Monto Final con Descuento (Punto Ticket)</strong>',
        content: `<p>Crea una función llamada <code>calcular_monto_final</code> que reciba:</p>
        <ul>
            <li><code>p_monto_bruto</code> (<code>IN NUMBER</code>) — monto original</li>
            <li><code>p_convenio_id</code> (<code>IN NUMBER</code>) — ID del convenio bancario</li>
        </ul>
        <p>La función debe:</p>
        <ol>
            <li>Buscar el <code>descuento_porcentaje</code> del convenio en <code>CONVENIO_BANCO</code> (solo si está activo).</li>
            <li>Calcular el descuento: <code>monto_bruto * porcentaje / 100</code>.</li>
            <li>Retornar el monto final: <code>monto_bruto - descuento</code>, redondeado a 2 decimales.</li>
            <li>Si el convenio no existe o no está activo, capturar <code>NO_DATA_FOUND</code> y retornar el monto bruto sin descuento.</li>
        </ol>
        <p>Luego, escribe un bloque anónimo que invoque la función con un monto de <code>75000</code> y el convenio <code>1</code>, e imprima el resultado con <code>DBMS_OUTPUT.PUT_LINE</code>.</p>`
    }
];
