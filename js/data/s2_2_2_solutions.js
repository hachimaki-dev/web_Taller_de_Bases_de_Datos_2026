// s2_2_2_solutions.js — Solucionario: Triggers — Fundamentos y Clasificación

const s2_2_2_solutions = [
    {
        id: 'e222-mc1',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> Un trigger se ejecuta automáticamente cuando ocurre un evento DML (INSERT, UPDATE, DELETE) sobre la tabla asociada. Nadie lo invoca manualmente. Un procedimiento, en cambio, debe ser llamado explícitamente con <code>EXECUTE</code> o desde un bloque PL/SQL.',
        fullSolution: 'Los triggers son ideales para reglas que deben cumplirse <strong>siempre</strong>, sin importar quién o qué modifica los datos: auditoría, validaciones de integridad, sincronización automática.'
    },
    {
        id: 'e222-mc2',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> Solo en triggers <code>BEFORE ... FOR EACH ROW</code> puedes asignar valores a <code>:NEW</code> antes de que Oracle los grabe en la tabla. En triggers <code>AFTER</code>, los datos ya están grabados y no se pueden modificar.',
        fullSolution: 'Si intentas asignar a <code>:NEW</code> en un trigger <code>AFTER</code>, Oracle lanza el error <code>ORA-04084: cannot change NEW values for this trigger type</code>.'
    },
    {
        id: 'e222-mc3',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> El error <code>ORA-04091: table is mutating, trigger/function may not see it</code> ocurre cuando un trigger row-level intenta leer o modificar la misma tabla que disparó el trigger.',
        fullSolution: 'Para evitarlo, puedes usar un trigger compuesto (COMPOUND TRIGGER), mover la consulta a una tabla diferente, o usar un trigger statement-level.'
    },
    {
        id: 'e222-tf1',
        answer: false,
        explanation: '<strong>Falso.</strong> Dentro de la cláusula <code>WHEN</code>, se usan <code>OLD</code> y <code>NEW</code> <strong>sin los dos puntos</strong>. Por ejemplo: <code>WHEN (OLD.precio != NEW.precio)</code>. Los dos puntos (<code>:OLD</code>, <code>:NEW</code>) solo se usan dentro del cuerpo del trigger (<code>BEGIN...END</code>).'
    },
    {
        id: 'e222-tf2',
        answer: false,
        explanation: '<strong>Falso.</strong> Un trigger <strong>no puede</strong> contener <code>COMMIT</code> ni <code>ROLLBACK</code>. El trigger forma parte de la transacción del DML que lo disparó. Si intentas hacer <code>COMMIT</code> dentro de un trigger, Oracle lanza el error <code>ORA-04092: cannot COMMIT in a trigger</code>.'
    },
    {
        id: 'e222-fill1',
        answers: ['AFTER UPDATE OF precio', ':OLD.localidad_evento_id'],
        explanation: 'El timing es <code>AFTER UPDATE OF precio</code> porque queremos registrar el cambio después de que ocurrió, y solo cuando se modifica la columna <code>precio</code>. El pseudo-registro <code>:OLD.localidad_evento_id</code> identifica la localidad cuyo precio cambió.',
        fullSolution: '<pre>CREATE OR REPLACE TRIGGER trg_log_precio\nAFTER UPDATE OF precio ON LOCALIDAD_EVENTO\nFOR EACH ROW\nWHEN (OLD.precio != NEW.precio)\nBEGIN\n    INSERT INTO LOG_CAMBIO_PRECIO (\n        localidad_evento_id, precio_anterior, precio_nuevo\n    ) VALUES (\n        :OLD.localidad_evento_id,\n        :OLD.precio,\n        :NEW.precio\n    );\nEND trg_log_precio;</pre>'
    },
    {
        id: 'e222-fill2',
        answers: ["RAISE_APPLICATION_ERROR(-20050, 'Sin stock disponible')", 'END'],
        explanation: 'Cuando el stock es 0 o menor, usamos <code>RAISE_APPLICATION_ERROR</code> para impedir el INSERT lanzando un error personalizado. El trigger termina con <code>END</code> seguido del nombre del trigger.',
        fullSolution: '<pre>CREATE OR REPLACE TRIGGER trg_validar_stock\nBEFORE INSERT ON RESERVA_TEMPORAL\nFOR EACH ROW\nDECLARE\n    v_stock NUMBER;\nBEGIN\n    SELECT stock_disponible INTO v_stock\n    FROM LOCALIDAD_EVENTO\n    WHERE localidad_evento_id = :NEW.localidad_evento_id;\n\n    IF v_stock <= 0 THEN\n        RAISE_APPLICATION_ERROR(-20050, \'Sin stock disponible\');\n    END IF;\nEND trg_validar_stock;</pre>'
    },
    {
        id: 'e222-err1',
        answer: 3, // Línea 4 (índice 3): WHEN (:OLD.estado != :NEW.estado)
        explanation: '<strong>Error en la línea 4:</strong> Dentro de la cláusula <code>WHEN</code>, los pseudo-registros se usan <strong>sin los dos puntos</strong>. Debe ser <code>WHEN (OLD.estado != NEW.estado)</code>, no <code>WHEN (:OLD.estado != :NEW.estado)</code>.',
        fullSolution: 'La corrección es:<pre>WHEN (OLD.estado != NEW.estado)</pre>Dentro del cuerpo (<code>BEGIN...END</code>) sí se usan con dos puntos: <code>:OLD.estado</code> y <code>:NEW.estado</code>.'
    },
    {
        id: 'e222-err2',
        answer: 4, // Línea 5 (índice 4): :NEW.estado := 'ACTIVA';
        explanation: '<strong>Error en la línea 5:</strong> No se puede asignar a <code>:NEW</code> en un trigger <code>AFTER</code>. El trigger está definido como <code>AFTER INSERT</code>, pero intenta modificar <code>:NEW.estado</code>. Esto genera el error <code>ORA-04084: cannot change NEW values for this trigger type</code>.',
        fullSolution: 'Para modificar <code>:NEW</code>, el trigger debe ser <code>BEFORE INSERT</code>:<pre>CREATE OR REPLACE TRIGGER trg_forzar_estado\nBEFORE INSERT ON RESERVA_TEMPORAL  -- ← BEFORE, no AFTER\nFOR EACH ROW\nBEGIN\n    :NEW.estado := \'ACTIVA\';\nEND trg_forzar_estado;</pre>'
    },
    {
        id: 'e222-cw1',
        explanation: '<strong>¡Crucigrama completado!</strong> Has identificado los conceptos fundamentales de triggers en Oracle PL/SQL.',
        fullSolution: `
            <h4>Términos del Crucigrama:</h4>
            <table>
                <tr><th>Término</th><th>Dirección</th><th>Definición en Oracle PL/SQL</th></tr>
                <tr><td><strong>TRIGGER</strong></td><td>→ Horizontal 1</td><td>Bloque PL/SQL que se ejecuta automáticamente ante un evento DML.</td></tr>
                <tr><td><strong>BEFORE</strong></td><td>↓ Vertical 2</td><td>Timing que ejecuta el trigger antes de que el cambio se aplique.</td></tr>
                <tr><td><strong>AFTER</strong></td><td>→ Horizontal 3</td><td>Timing que ejecuta el trigger después de que el cambio se aplicó.</td></tr>
                <tr><td><strong>MUTATING</strong></td><td>↓ Vertical 4</td><td>Error que ocurre al consultar la misma tabla que disparó el trigger.</td></tr>
                <tr><td><strong>OLD</strong></td><td>→ Horizontal 5</td><td>Pseudo-registro con los valores anteriores al cambio.</td></tr>
                <tr><td><strong>NEW</strong></td><td>↓ Vertical 6</td><td>Pseudo-registro con los valores nuevos del cambio.</td></tr>
            </table>
        `
    },
    {
        id: 'e222-prop1',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>-- 1. Crear la tabla de log\nCREATE TABLE LOG_ESTADO_RESERVA (\n    log_estado_id    NUMBER GENERATED ALWAYS AS IDENTITY,\n    reserva_id       NUMBER NOT NULL,\n    estado_anterior  VARCHAR2(20),\n    estado_nuevo     VARCHAR2(20) NOT NULL,\n    fecha_cambio     TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,\n\n    CONSTRAINT pk_log_estado_reserva\n        PRIMARY KEY (log_estado_id),\n\n    CONSTRAINT fk_log_estado_reserva\n        FOREIGN KEY (reserva_id)\n        REFERENCES RESERVA_TEMPORAL (reserva_id)\n);\n\n-- 2. Crear el trigger\nCREATE OR REPLACE TRIGGER trg_log_estado_reserva\nAFTER UPDATE OF estado ON RESERVA_TEMPORAL\nFOR EACH ROW\nWHEN (OLD.estado != NEW.estado)\nBEGIN\n    INSERT INTO LOG_ESTADO_RESERVA (\n        reserva_id, estado_anterior, estado_nuevo\n    ) VALUES (\n        :OLD.reserva_id,\n        :OLD.estado,\n        :NEW.estado\n    );\nEND trg_log_estado_reserva;\n/\n\n-- 3. Bloque de prueba\nBEGIN\n    UPDATE RESERVA_TEMPORAL\n    SET estado = \'CANCELADA\'\n    WHERE reserva_id = 1;\n\n    -- Verificar el log\n    FOR r IN (\n        SELECT * FROM LOG_ESTADO_RESERVA\n        ORDER BY fecha_cambio DESC\n        FETCH FIRST 5 ROWS ONLY\n    ) LOOP\n        DBMS_OUTPUT.PUT_LINE(\n            \'Reserva \' || r.reserva_id ||\n            \': \' || r.estado_anterior ||\n            \' → \' || r.estado_nuevo\n        );\n    END LOOP;\n\n    ROLLBACK;\nEND;\n/</pre>'
    },
    {
        id: 'e222-prop2',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>-- 1. Crear el trigger\nCREATE OR REPLACE TRIGGER trg_proteger_evento_finalizado\nBEFORE UPDATE OR DELETE ON EVENTO\nFOR EACH ROW\nBEGIN\n    IF :OLD.estado IN (\'REALIZADO\', \'CANCELADO\') THEN\n        RAISE_APPLICATION_ERROR(-20060,\n            \'No se puede modificar un evento finalizado. \' ||\n            \'Estado actual: \' || :OLD.estado);\n    END IF;\nEND trg_proteger_evento_finalizado;\n/\n\n-- 2. Prueba: intentar modificar un evento realizado\nBEGIN\n    -- Primero, poner un evento en estado REALIZADO\n    UPDATE EVENTO\n    SET estado = \'REALIZADO\'\n    WHERE evento_id = 1;\n\n    -- Intentar modificar → debe fallar\n    BEGIN\n        UPDATE EVENTO\n        SET nombre = \'Nuevo nombre\'\n        WHERE evento_id = 1;\n    EXCEPTION\n        WHEN OTHERS THEN\n            DBMS_OUTPUT.PUT_LINE(\'Error esperado: \' || SQLERRM);\n    END;\n\n    ROLLBACK;\nEND;\n/</pre>'
    }
];
