// s2_1_1_solutions.js — Solucionario: Procedimientos Almacenados y Funciones — Fundamentos

const s2_1_1_solutions = [
    {
        id: 'e211-mc1',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> La función siempre debe incluir la cláusula <code>RETURN tipo_dato</code> en su firma y al menos una sentencia <code>RETURN valor;</code> en el cuerpo. El procedimiento ejecuta acciones pero no retorna un valor directamente (usa parámetros <code>OUT</code> si necesita devolver datos).',
        fullSolution: 'Otras diferencias clave: las funciones pueden usarse dentro de sentencias SQL (si no hacen DML), mientras que los procedimientos se invocan con <code>EXECUTE</code> o desde bloques PL/SQL.'
    },
    {
        id: 'e211-mc2',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> El modo <code>OUT</code> permite que el procedimiento asigne un valor al parámetro, y el programa que invocó el procedimiento puede leer ese valor después de la llamada.',
        fullSolution: 'El parámetro <code>OUT</code> llega sin valor inicial (es <code>NULL</code> al entrar). El procedimiento le asigna un valor que queda disponible para el invocante. El modo <code>IN OUT</code> es similar pero el parámetro entra con un valor que puede ser leído y luego modificado.'
    },
    {
        id: 'e211-mc3',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> Para que Oracle permita usar una función dentro de una sentencia SQL (<code>SELECT</code>, <code>WHERE</code>, etc.), la función no debe contener operaciones DML (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) ni <code>COMMIT</code>/<code>ROLLBACK</code>.',
        fullSolution: 'Si la función modifica datos, Oracle lanza el error <code>ORA-14551: cannot perform a DML operation inside a query</code>. La función debe ser una transformación pura: recibe datos, calcula y retorna un resultado.'
    },
    {
        id: 'e211-tf1',
        answer: false,
        explanation: '<strong>Falso.</strong> Un procedimiento puede usar <code>RETURN;</code> (sin valor) para terminar su ejecución anticipadamente, pero <strong>no puede retornar un valor</strong>. Solo las funciones usan <code>RETURN valor;</code> para devolver un resultado.'
    },
    {
        id: 'e211-tf2',
        answer: true,
        explanation: '<strong>Verdadero.</strong> En Oracle PL/SQL, si no se especifica el modo del parámetro, se asume <code>IN</code> por defecto. Es decir, <code>p_id NUMBER</code> es equivalente a <code>p_id IN NUMBER</code>.'
    },
    {
        id: 'e211-fill1',
        answers: ['PROCEDURE', 'p_evento_id'],
        explanation: 'Se usa <code>PROCEDURE</code> porque el objetivo es ejecutar una acción (UPDATE), y el parámetro <code>p_evento_id</code> se usa en el WHERE para identificar el evento a actualizar.',
        fullSolution: '<pre>CREATE OR REPLACE PROCEDURE cambiar_estado_evento(\n    p_evento_id  IN NUMBER,\n    p_estado     IN VARCHAR2\n) AS\nBEGIN\n    UPDATE EVENTO\n    SET estado = p_estado\n    WHERE evento_id = p_evento_id;\n    COMMIT;\nEND cambiar_estado_evento;</pre>'
    },
    {
        id: 'e211-fill2',
        answers: ['RETURN NUMBER', 'RETURN v_total'],
        explanation: 'La firma declara <code>RETURN NUMBER</code> para indicar el tipo de retorno, y al final del cuerpo se usa <code>RETURN v_total;</code> para devolver el valor calculado.',
        fullSolution: '<pre>CREATE OR REPLACE FUNCTION contar_tickets_cliente(\n    p_cliente_id IN NUMBER\n) RETURN NUMBER\nAS\n    v_total NUMBER;\nBEGIN\n    SELECT COUNT(*)\n    INTO v_total\n    FROM TICKET t\n    JOIN RESERVA_TEMPORAL rt ON rt.reserva_id = t.reserva_id\n    WHERE rt.cliente_id = p_cliente_id;\n    RETURN v_total;\nEND contar_tickets_cliente;</pre>'
    },
    {
        id: 'e211-err1',
        answer: 8, // Línea 9 (índice 8): RETURN 'Convenio desactivado';
        explanation: '<strong>Error en la línea 9:</strong> Un procedimiento (<code>PROCEDURE</code>) no puede usar <code>RETURN</code> con un valor. Solo las funciones retornan valores. En un procedimiento, <code>RETURN;</code> (sin valor) termina la ejecución, pero <code>RETURN \'texto\';</code> genera un error de compilación.',
        fullSolution: 'Para mostrar un mensaje desde un procedimiento, usa <code>DBMS_OUTPUT.PUT_LINE</code> en lugar de <code>RETURN</code>:<pre>    DBMS_OUTPUT.PUT_LINE(\'Convenio desactivado\');</pre>'
    },
    {
        id: 'e211-err2',
        answer: 10, // Línea 11 (índice 10): END sin RETURN
        explanation: '<strong>Error en la línea 11:</strong> La función termina sin ejecutar una sentencia <code>RETURN v_nombre;</code>. Toda función en PL/SQL <strong>debe retornar un valor</strong> antes de llegar al <code>END</code>. Sin el <code>RETURN</code>, Oracle lanza el error <code>ORA-06503: PL/SQL: Function returned without value</code>.',
        fullSolution: 'Se debe agregar <code>RETURN v_nombre;</code> antes del <code>END</code>:<pre>    ...\n    WHERE evento_id = p_evento_id;\n    RETURN v_nombre;\nEND obtener_nombre_evento;</pre>'
    },
    {
        id: 'e211-cw1',
        explanation: '<strong>¡Crucigrama completado!</strong> Has identificado los conceptos fundamentales de procedimientos y funciones.',
        fullSolution: `
            <h4>Términos del Crucigrama:</h4>
            <table>
                <tr><th>Término</th><th>Dirección</th><th>Definición en Oracle PL/SQL</th></tr>
                <tr><td><strong>PROCEDURE</strong></td><td>→ Horizontal 1</td><td>Bloque con nombre que ejecuta acciones sin retornar valor.</td></tr>
                <tr><td><strong>FUNCTION</strong></td><td>↓ Vertical 2</td><td>Bloque con nombre que siempre retorna un valor con RETURN.</td></tr>
                <tr><td><strong>OUT</strong></td><td>→ Horizontal 3</td><td>Modo de parámetro para valores de salida.</td></tr>
                <tr><td><strong>RETURN</strong></td><td>↓ Vertical 4</td><td>Sentencia que devuelve el resultado de una función.</td></tr>
                <tr><td><strong>REPLACE</strong></td><td>→ Horizontal 5</td><td>Cláusula para reemplazar un bloque existente sin DROP.</td></tr>
                <tr><td><strong>EXECUTE</strong></td><td>↓ Vertical 6</td><td>Comando para invocar un procedimiento desde SQL*Plus.</td></tr>
            </table>
        `
    },
    {
        id: 'e211-prop1',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>CREATE OR REPLACE PROCEDURE crear_reserva_temporal(\n    p_cliente_id          IN  NUMBER,\n    p_localidad_evento_id IN  NUMBER,\n    p_reserva_id          OUT NUMBER\n) AS\n    v_stock NUMBER;\nBEGIN\n    -- 1. Verificar stock disponible\n    SELECT stock_disponible\n    INTO v_stock\n    FROM LOCALIDAD_EVENTO\n    WHERE localidad_evento_id = p_localidad_evento_id;\n\n    IF v_stock <= 0 THEN\n        RAISE_APPLICATION_ERROR(-20001, \'Sin stock disponible\');\n    END IF;\n\n    -- 2. Insertar reserva temporal\n    INSERT INTO RESERVA_TEMPORAL (\n        cliente_id, localidad_evento_id,\n        fecha_expiracion, estado\n    ) VALUES (\n        p_cliente_id, p_localidad_evento_id,\n        SYSTIMESTAMP + INTERVAL \'15\' MINUTE, \'ACTIVA\'\n    ) RETURNING reserva_id INTO p_reserva_id;\n\n    -- 3. Descontar stock\n    UPDATE LOCALIDAD_EVENTO\n    SET stock_disponible = stock_disponible - 1\n    WHERE localidad_evento_id = p_localidad_evento_id;\n\n    -- 4. Rollback para pruebas\n    ROLLBACK;\n    DBMS_OUTPUT.PUT_LINE(\'Reserva simulada con ID: \' || p_reserva_id);\n\nEXCEPTION\n    WHEN NO_DATA_FOUND THEN\n        RAISE_APPLICATION_ERROR(-20002, \'Localidad no encontrada\');\nEND crear_reserva_temporal;\n/</pre>'
    },
    {
        id: 'e211-prop2',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>-- 1. Crear la función\nCREATE OR REPLACE FUNCTION calcular_monto_final(\n    p_monto_bruto  IN NUMBER,\n    p_convenio_id  IN NUMBER\n) RETURN NUMBER\nAS\n    v_porcentaje NUMBER;\n    v_descuento  NUMBER;\nBEGIN\n    SELECT descuento_porcentaje\n    INTO v_porcentaje\n    FROM CONVENIO_BANCO\n    WHERE convenio_banco_id = p_convenio_id\n      AND activo = \'S\';\n\n    v_descuento := ROUND(p_monto_bruto * v_porcentaje / 100, 2);\n    RETURN p_monto_bruto - v_descuento;\n\nEXCEPTION\n    WHEN NO_DATA_FOUND THEN\n        -- Convenio no existe o inactivo: sin descuento\n        RETURN p_monto_bruto;\nEND calcular_monto_final;\n/\n\n-- 2. Bloque de prueba\nDECLARE\n    v_resultado NUMBER;\nBEGIN\n    v_resultado := calcular_monto_final(75000, 1);\n    DBMS_OUTPUT.PUT_LINE(\'Monto final: $\' || v_resultado);\nEND;\n/</pre>'
    }
];
