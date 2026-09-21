// s2_1_2_exercises.js — Ejercicios: Procedimientos y Funciones — Casos Prácticos con Punto Ticket

const s2_1_2_exercises = [
    {
        id: 'e212-mc1',
        type: 'multiple-choice',
        question: 'En un procedimiento con parámetro <code>OUT</code>, ¿cuál es el valor inicial del parámetro al entrar al cuerpo del procedimiento?',
        options: [
            'El valor que tenía la variable antes de la llamada',
            '<code>NULL</code> — el parámetro <code>OUT</code> no hereda el valor del invocante',
            '<code>0</code> para NUMBER y cadena vacía para VARCHAR2',
            'Oracle lanza un error si el parámetro OUT no se inicializa antes de la llamada'
        ]
    },
    {
        id: 'e212-mc2',
        type: 'multiple-choice',
        question: '¿Cuál es la principal ventaja de usar <code>CREATE OR REPLACE</code> en lugar de <code>DROP</code> + <code>CREATE</code>?',
        options: [
            'Ejecuta más rápido porque no necesita recompilar',
            'Conserva los <strong>privilegios (GRANTs)</strong> otorgados sobre el objeto',
            'Permite crear el objeto en un esquema diferente',
            'Genera automáticamente un backup del código anterior'
        ]
    },
    {
        id: 'e212-mc3',
        type: 'multiple-choice',
        question: 'En el siguiente código, ¿qué imprime <code>DBMS_OUTPUT.PUT_LINE</code>?<br><pre>DECLARE\n    v_stock NUMBER;\nBEGIN\n    v_stock := stock_total_evento(1);\n    DBMS_OUTPUT.PUT_LINE(v_stock);\nEND;</pre>Suponiendo que la función <code>stock_total_evento</code> suma el <code>stock_disponible</code> de todas las localidades del evento 1.',
        options: [
            'El <code>evento_id</code> del evento consultado',
            'La suma total del stock disponible de todas las localidades del evento 1',
            'El número de localidades del evento 1',
            'Un error porque las funciones no pueden llamarse desde bloques anónimos'
        ]
    },
    {
        id: 'e212-tf1',
        type: 'true-false',
        question: 'Un procedimiento almacenado puede usar <code>RETURN;</code> (sin valor) para terminar su ejecución anticipadamente antes de llegar al <code>END</code>.'
    },
    {
        id: 'e212-tf2',
        type: 'true-false',
        question: 'Una función que contiene una sentencia <code>INSERT INTO</code> puede ser utilizada dentro de una consulta <code>SELECT</code> sin que Oracle genere un error.'
    },
    {
        id: 'e212-fill1',
        type: 'fill-code',
        question: 'Completa el procedimiento que obtiene el nombre y email de un cliente usando parámetros <code>OUT</code>:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE PROCEDURE obtener_cliente(\n    p_cliente_id  IN  NUMBER,\n    p_nombre      ' },
            { type: 'blank', index: 0, placeholder: 'modo param', width: 60 },
            { type: 'text', content: ' VARCHAR2,\n    p_email       OUT VARCHAR2\n) AS\nBEGIN\n    SELECT nombre || \' \' || apellido, email\n    ' },
            { type: 'blank', index: 1, placeholder: 'cláusula destino', width: 180 },
            { type: 'text', content: '\n    FROM CLIENTE\n    WHERE cliente_id = p_cliente_id;\nEND obtener_cliente;' }
        ]
    },
    {
        id: 'e212-fill2',
        type: 'fill-code',
        question: 'Completa la función que retorna el nombre del recinto donde se realiza un evento:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE FUNCTION recinto_de_evento(\n    p_evento_id IN NUMBER\n) ' },
            { type: 'blank', index: 0, placeholder: 'retorno', width: 170 },
            { type: 'text', content: '\nAS\n    v_recinto VARCHAR2(150);\nBEGIN\n    SELECT r.nombre INTO v_recinto\n    FROM EVENTO e\n    JOIN RECINTO r ON r.recinto_id = e.recinto_id\n    WHERE e.evento_id = p_evento_id;\n    ' },
            { type: 'blank', index: 1, placeholder: 'sentencia retorno', width: 160 },
            { type: 'text', content: ';\nEND recinto_de_evento;' }
        ]
    },
    {
        id: 'e212-err1',
        type: 'find-error',
        question: 'Identifica la línea con el error en este procedimiento:',
        lines: [
            'CREATE OR REPLACE PROCEDURE cancelar_reserva(',
            '    p_reserva_id IN NUMBER',
            ') AS',
            'BEGIN',
            '    UPDATE RESERVA_TEMPORAL',
            '    SET estado = \'CANCELADA\'',
            '    WHERE reserva_id = p_reserva_id;',
            '    COMMIT;',
            '    DBMS_OUTPUT.PUT_LINE(\'Reserva cancelada\');',
            'END;'
        ]
    },
    {
        id: 'e212-err2',
        type: 'find-error',
        question: 'Identifica la línea con el error en esta función:',
        lines: [
            'CREATE OR REPLACE FUNCTION precio_promedio_evento(',
            '    p_evento_id IN NUMBER',
            ') RETURN NUMBER',
            'AS',
            '    v_promedio NUMBER;',
            'BEGIN',
            '    SELECT AVG(precio)',
            '    INTO v_promedio',
            '    FROM LOCALIDAD_EVENTO',
            '    WHERE evento_id = p_evento_id;',
            '    RETURN v_promedio;',
            'EXCEPTION',
            '    WHEN NO_DATA_FOUND THEN',
            '        DBMS_OUTPUT.PUT_LINE(\'Evento sin localidades\');',
            'END precio_promedio_evento;'
        ]
    },
    {
        id: 'e212-ws1',
        type: 'word-search',
        question: 'Encuentra los <strong>6 términos clave</strong> sobre procedimientos y funciones avanzados en la sopa de letras:',
        gridSize: 10,
        words: ['PROCEDURE', 'FUNCTION', 'RETURN', 'REPLACE', 'EXECUTE', 'COMMIT'],
        wordPlacements: [
            { word: 'PROCEDURE', cells: [0, 1, 2, 3, 4, 5, 6, 7, 8], clue: 'Bloque PL/SQL con nombre que ejecuta acciones sin retornar valor' },
            { word: 'FUNCTION', cells: [10, 11, 12, 13, 14, 15, 16, 17], clue: 'Bloque PL/SQL con nombre que siempre retorna un valor' },
            { word: 'RETURN', cells: [30, 31, 32, 33, 34, 35], clue: 'Sentencia obligatoria en una función para devolver el resultado' },
            { word: 'REPLACE', cells: [50, 51, 52, 53, 54, 55, 56], clue: 'Cláusula para actualizar un objeto sin perder privilegios' },
            { word: 'EXECUTE', cells: [70, 71, 72, 73, 74, 75, 76], clue: 'Comando de SQL*Plus para invocar un procedimiento' },
            { word: 'COMMIT', cells: [90, 91, 92, 93, 94, 95], clue: 'Confirma permanentemente los cambios en la base de datos' }
        ],
        grid: [
            {letter:'P'},{letter:'R'},{letter:'O'},{letter:'C'},{letter:'E'},{letter:'D'},{letter:'U'},{letter:'R'},{letter:'E'},{letter:'A'},
            {letter:'F'},{letter:'U'},{letter:'N'},{letter:'C'},{letter:'T'},{letter:'I'},{letter:'O'},{letter:'N'},{letter:'B'},{letter:'C'},
            {letter:'D'},{letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'M'},
            {letter:'R'},{letter:'E'},{letter:'T'},{letter:'U'},{letter:'R'},{letter:'N'},{letter:'O'},{letter:'P'},{letter:'Q'},{letter:'R'},
            {letter:'S'},{letter:'T'},{letter:'U'},{letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'},{letter:'Z'},{letter:'A'},{letter:'B'},
            {letter:'R'},{letter:'E'},{letter:'P'},{letter:'L'},{letter:'A'},{letter:'C'},{letter:'E'},{letter:'D'},{letter:'F'},{letter:'G'},
            {letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'M'},{letter:'N'},{letter:'O'},{letter:'P'},{letter:'Q'},
            {letter:'E'},{letter:'X'},{letter:'E'},{letter:'C'},{letter:'U'},{letter:'T'},{letter:'E'},{letter:'R'},{letter:'S'},{letter:'T'},
            {letter:'U'},{letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'},{letter:'Z'},{letter:'A'},{letter:'B'},{letter:'C'},{letter:'D'},
            {letter:'C'},{letter:'O'},{letter:'M'},{letter:'M'},{letter:'I'},{letter:'T'},{letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'}
        ]
    },
    {
        id: 'e212-prop1',
        type: 'proposed',
        question: '<strong>Ejercicio propuesto 1 — Procedimiento: Anular Ticket Completo (Punto Ticket)</strong>',
        content: `<p>Crea un procedimiento llamado <code>anular_ticket</code> que reciba:</p>
        <ul>
            <li><code>p_ticket_id</code> (<code>IN NUMBER</code>)</li>
            <li><code>p_motivo</code> (<code>IN VARCHAR2</code>)</li>
            <li><code>p_admin_id</code> (<code>IN NUMBER</code>)</li>
        </ul>
        <p>El procedimiento debe:</p>
        <ol>
            <li>Verificar que el ticket exista y tenga estado <code>'EMITIDO'</code>. Si no, lanzar <code>RAISE_APPLICATION_ERROR(-20030, 'Ticket no anulable')</code>.</li>
            <li>Cambiar el estado del ticket a <code>'ANULADO'</code>.</li>
            <li>Registrar la anulación en <code>LOG_ANULACIONES</code> con el ticket_id, transaccion_id, reserva_id, administrador_id y motivo.</li>
            <li>Recuperar el stock en <code>LOCALIDAD_EVENTO</code> sumando 1 al <code>stock_disponible</code> de la localidad correspondiente.</li>
            <li>Usar <code>ROLLBACK</code> al final para mantener la BD intacta.</li>
        </ol>
        <p><strong>Pista:</strong> Necesitarás hacer JOINs a través de <code>RESERVA_TEMPORAL</code> para llegar a la <code>localidad_evento_id</code>.</p>`
    },
    {
        id: 'e212-prop2',
        type: 'proposed',
        question: '<strong>Ejercicio propuesto 2 — Función: Reporte de Recaudación por Evento (Punto Ticket)</strong>',
        content: `<p>Crea una función llamada <code>recaudacion_evento</code> que reciba <code>p_evento_id</code> (<code>IN NUMBER</code>) y retorne el monto total recaudado (<code>NUMBER</code>).</p>
        <p>La función debe:</p>
        <ol>
            <li>Sumar el <code>precio_pagado</code> de todos los tickets asociados al evento (pasando por <code>RESERVA_TEMPORAL</code> → <code>LOCALIDAD_EVENTO</code>).</li>
            <li>Si no hay tickets, retornar <code>0</code> (usar <code>NVL</code>).</li>
        </ol>
        <p>Luego, escribe una consulta SQL que use la función:</p>
        <pre>SELECT nombre, estado,
       recaudacion_evento(evento_id) AS total_recaudado
FROM EVENTO
ORDER BY total_recaudado DESC;</pre>
        <p><strong>Desafío extra:</strong> Crea una segunda función <code>porcentaje_ocupacion</code> que reciba un <code>evento_id</code> y retorne el porcentaje de entradas vendidas vs la capacidad total del recinto. Úsala junto a <code>recaudacion_evento</code> en el mismo SELECT.</p>`
    }
];
