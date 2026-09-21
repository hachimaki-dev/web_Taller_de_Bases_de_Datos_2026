// s2_1_2_solutions.js — Solucionario: Procedimientos y Funciones — Casos Prácticos con Punto Ticket

const s2_1_2_solutions = [
    {
        id: 'e212-mc1',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> Cuando se invoca un procedimiento con un parámetro <code>OUT</code>, el valor previo de la variable del invocante se ignora. Dentro del procedimiento, el parámetro <code>OUT</code> comienza como <code>NULL</code> hasta que se le asigne un valor explícitamente.',
        fullSolution: 'Esto contrasta con <code>IN OUT</code>, donde el parámetro sí hereda el valor de la variable del invocante. Si necesitas leer el valor de entrada y también modificarlo, usa <code>IN OUT</code>.'
    },
    {
        id: 'e212-mc2',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> <code>CREATE OR REPLACE</code> reemplaza el código del objeto pero conserva todos los privilegios (<code>GRANT</code>) otorgados previamente. Con <code>DROP</code> + <code>CREATE</code>, los privilegios se pierden y deben reasignarse manualmente.',
        fullSolution: 'Además, <code>DROP</code> invalida todos los objetos que dependan del procedimiento o función eliminada, forzando su recompilación.'
    },
    {
        id: 'e212-mc3',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> La función <code>stock_total_evento</code> retorna la suma del <code>stock_disponible</code> de todas las localidades del evento. El resultado se asigna a <code>v_stock</code> y se imprime.',
        fullSolution: 'Las funciones pueden llamarse desde bloques anónimos asignando su resultado a una variable con <code>:=</code>. También podrían usarse directamente en <code>DBMS_OUTPUT.PUT_LINE(stock_total_evento(1))</code>.'
    },
    {
        id: 'e212-tf1',
        answer: true,
        explanation: '<strong>Verdadero.</strong> Un procedimiento puede usar <code>RETURN;</code> (sin valor) para salir anticipadamente. Esto es útil en validaciones: si una condición no se cumple, se termina la ejecución antes de llegar al <code>END</code>. La diferencia con las funciones es que en los procedimientos el <code>RETURN</code> no lleva ningún valor asociado.'
    },
    {
        id: 'e212-tf2',
        answer: false,
        explanation: '<strong>Falso.</strong> Oracle no permite usar funciones que contengan operaciones DML (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) dentro de sentencias <code>SELECT</code>. Al intentarlo se genera el error <code>ORA-14551: cannot perform a DML operation inside a query</code>.'
    },
    {
        id: 'e212-fill1',
        answers: ['OUT', 'INTO p_nombre, p_email'],
        explanation: 'El parámetro <code>p_nombre</code> necesita modo <code>OUT</code> para devolver el valor al invocante. La cláusula <code>INTO p_nombre, p_email</code> asigna los resultados del SELECT a los parámetros de salida.',
        fullSolution: '<pre>CREATE OR REPLACE PROCEDURE obtener_cliente(\n    p_cliente_id  IN  NUMBER,\n    p_nombre      OUT VARCHAR2,\n    p_email       OUT VARCHAR2\n) AS\nBEGIN\n    SELECT nombre || \' \' || apellido, email\n    INTO p_nombre, p_email\n    FROM CLIENTE\n    WHERE cliente_id = p_cliente_id;\nEND obtener_cliente;</pre>'
    },
    {
        id: 'e212-fill2',
        answers: ['RETURN VARCHAR2', 'RETURN v_recinto'],
        explanation: 'La firma declara <code>RETURN VARCHAR2</code> porque la función devuelve un nombre de recinto (texto), y en el cuerpo se usa <code>RETURN v_recinto;</code> para devolver el valor.',
        fullSolution: '<pre>CREATE OR REPLACE FUNCTION recinto_de_evento(\n    p_evento_id IN NUMBER\n) RETURN VARCHAR2\nAS\n    v_recinto VARCHAR2(150);\nBEGIN\n    SELECT r.nombre INTO v_recinto\n    FROM EVENTO e\n    JOIN RECINTO r ON r.recinto_id = e.recinto_id\n    WHERE e.evento_id = p_evento_id;\n    RETURN v_recinto;\nEND recinto_de_evento;</pre>'
    },
    {
        id: 'e212-err1',
        answer: 9, // Línea 10 (índice 9): END; sin nombre del proc
        explanation: '<strong>Truco:</strong> Este procedimiento <strong>no tiene errores de sintaxis</strong>. El <code>END;</code> sin nombre del procedimiento es válido en Oracle PL/SQL, aunque por buena práctica se recomienda <code>END cancelar_reserva;</code>. Si seleccionaste esta línea, observa que Oracle acepta tanto <code>END;</code> como <code>END nombre_procedimiento;</code>.',
        fullSolution: 'El procedimiento es correcto. Oracle permite cerrar con <code>END;</code> o <code>END nombre_procedimiento;</code>. La versión con nombre es recomendada por legibilidad, especialmente en procedimientos largos.'
    },
    {
        id: 'e212-err2',
        answer: 13, // Línea 14 (índice 13): no tiene RETURN en EXCEPTION
        explanation: '<strong>Error en la línea 14:</strong> En el bloque <code>EXCEPTION</code> de una función, cada rama <strong>debe incluir una sentencia <code>RETURN</code></strong>. Si se captura <code>NO_DATA_FOUND</code>, la función termina sin retornar un valor, lo que genera <code>ORA-06503: PL/SQL: Function returned without value</code>.',
        fullSolution: 'La corrección es agregar un RETURN en la rama de excepción:<pre>EXCEPTION\n    WHEN NO_DATA_FOUND THEN\n        RETURN 0;</pre>'
    },
    {
        id: 'e212-ws1',
        explanation: '<strong>¡Sopa de letras completada!</strong> Has identificado los términos clave de procedimientos y funciones.',
        fullSolution: `
            <h4>Términos de la Sopa de Letras:</h4>
            <table>
                <tr><th>Término</th><th>Orientación</th><th>Definición en Oracle PL/SQL</th></tr>
                <tr><td><strong>PROCEDURE</strong></td><td>Fila 1</td><td>Bloque con nombre para ejecutar acciones; no retorna valor directamente.</td></tr>
                <tr><td><strong>FUNCTION</strong></td><td>Fila 2</td><td>Bloque con nombre que siempre retorna un valor con RETURN.</td></tr>
                <tr><td><strong>RETURN</strong></td><td>Fila 4</td><td>Sentencia obligatoria en funciones para devolver el resultado calculado.</td></tr>
                <tr><td><strong>REPLACE</strong></td><td>Fila 6</td><td>Cláusula para actualizar un objeto existente sin perder privilegios.</td></tr>
                <tr><td><strong>EXECUTE</strong></td><td>Fila 8</td><td>Comando de SQL*Plus para invocar un procedimiento almacenado.</td></tr>
                <tr><td><strong>COMMIT</strong></td><td>Fila 10</td><td>Confirma permanentemente los cambios realizados en la transacción.</td></tr>
            </table>
        `
    },
    {
        id: 'e212-prop1',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>CREATE OR REPLACE PROCEDURE anular_ticket(\n    p_ticket_id  IN NUMBER,\n    p_motivo     IN VARCHAR2,\n    p_admin_id   IN NUMBER\n) AS\n    v_estado         VARCHAR2(20);\n    v_transaccion_id NUMBER;\n    v_reserva_id     NUMBER;\n    v_localidad_id   NUMBER;\nBEGIN\n    -- 1. Verificar que el ticket existe y está emitido\n    SELECT estado, transaccion_id, reserva_id\n    INTO v_estado, v_transaccion_id, v_reserva_id\n    FROM TICKET\n    WHERE ticket_id = p_ticket_id;\n\n    IF v_estado != \'EMITIDO\' THEN\n        RAISE_APPLICATION_ERROR(-20030,\n            \'Ticket no anulable. Estado actual: \' || v_estado);\n    END IF;\n\n    -- 2. Cambiar estado del ticket\n    UPDATE TICKET\n    SET estado = \'ANULADO\'\n    WHERE ticket_id = p_ticket_id;\n\n    -- 3. Registrar en LOG_ANULACIONES\n    INSERT INTO LOG_ANULACIONES (\n        ticket_id, transaccion_id, reserva_id,\n        administrador_id, motivo\n    ) VALUES (\n        p_ticket_id, v_transaccion_id, v_reserva_id,\n        p_admin_id, p_motivo\n    );\n\n    -- 4. Recuperar stock\n    SELECT localidad_evento_id INTO v_localidad_id\n    FROM RESERVA_TEMPORAL\n    WHERE reserva_id = v_reserva_id;\n\n    UPDATE LOCALIDAD_EVENTO\n    SET stock_disponible = stock_disponible + 1\n    WHERE localidad_evento_id = v_localidad_id;\n\n    -- 5. Rollback para mantener BD intacta\n    ROLLBACK;\n    DBMS_OUTPUT.PUT_LINE(\'Anulación simulada del ticket #\' || p_ticket_id);\n\nEXCEPTION\n    WHEN NO_DATA_FOUND THEN\n        RAISE_APPLICATION_ERROR(-20031, \'Ticket no encontrado: \' || p_ticket_id);\nEND anular_ticket;\n/</pre>'
    },
    {
        id: 'e212-prop2',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>-- 1. Función de recaudación\nCREATE OR REPLACE FUNCTION recaudacion_evento(\n    p_evento_id IN NUMBER\n) RETURN NUMBER\nAS\n    v_total NUMBER;\nBEGIN\n    SELECT NVL(SUM(t.precio_pagado), 0)\n    INTO v_total\n    FROM TICKET t\n    JOIN RESERVA_TEMPORAL rt ON rt.reserva_id = t.reserva_id\n    JOIN LOCALIDAD_EVENTO le ON le.localidad_evento_id = rt.localidad_evento_id\n    WHERE le.evento_id = p_evento_id\n      AND t.estado != \'ANULADO\';\n\n    RETURN v_total;\nEND recaudacion_evento;\n/\n\n-- 2. Consulta SQL usando la función\nSELECT nombre, estado,\n       recaudacion_evento(evento_id) AS total_recaudado\nFROM EVENTO\nORDER BY total_recaudado DESC;\n\n-- 3. Desafío extra: Porcentaje de ocupación\nCREATE OR REPLACE FUNCTION porcentaje_ocupacion(\n    p_evento_id IN NUMBER\n) RETURN NUMBER\nAS\n    v_capacidad   NUMBER;\n    v_vendidos    NUMBER;\nBEGIN\n    -- Capacidad total del recinto\n    SELECT r.capacidad_total INTO v_capacidad\n    FROM EVENTO e\n    JOIN RECINTO r ON r.recinto_id = e.recinto_id\n    WHERE e.evento_id = p_evento_id;\n\n    -- Tickets vendidos (no anulados)\n    SELECT COUNT(*) INTO v_vendidos\n    FROM TICKET t\n    JOIN RESERVA_TEMPORAL rt ON rt.reserva_id = t.reserva_id\n    JOIN LOCALIDAD_EVENTO le ON le.localidad_evento_id = rt.localidad_evento_id\n    WHERE le.evento_id = p_evento_id\n      AND t.estado != \'ANULADO\';\n\n    IF v_capacidad = 0 THEN\n        RETURN 0;\n    END IF;\n\n    RETURN ROUND(v_vendidos * 100 / v_capacidad, 2);\nEXCEPTION\n    WHEN NO_DATA_FOUND THEN\n        RETURN 0;\nEND porcentaje_ocupacion;\n/\n\n-- Consulta combinada\nSELECT nombre, estado,\n       recaudacion_evento(evento_id) AS recaudacion,\n       porcentaje_ocupacion(evento_id) || \'%\' AS ocupacion\nFROM EVENTO\nORDER BY recaudacion DESC;</pre>'
    }
];
