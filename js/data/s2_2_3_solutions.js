// s2_2_3_solutions.js — Solucionario: Triggers — Casos Prácticos y Compound Triggers con Punto Ticket

const s2_2_3_solutions = [
    {
        id: 'e223-mc1',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> El <code>COMPOUND TRIGGER</code> permite definir código en diferentes fases de ejecución (<code>BEFORE STATEMENT</code>, <code>BEFORE EACH ROW</code>, <code>AFTER EACH ROW</code>, <code>AFTER STATEMENT</code>) dentro de un solo trigger. Las variables declaradas en la cabecera son compartidas entre todas las secciones.',
        fullSolution: 'Esto resuelve el problema de mutating tables: en la sección <code>AFTER EACH ROW</code> guardas datos en una colección (sin consultar la tabla), y en <code>AFTER STATEMENT</code> procesas esos datos cuando la tabla ya no está mutando.'
    },
    {
        id: 'e223-mc2',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> Para auditoría (registrar lo que pasó), usamos <code>AFTER UPDATE ... FOR EACH ROW</code>. El trigger se dispara después del cambio, cuando ya tenemos los valores finales. Usamos <code>:OLD</code> para los datos previos y <code>:NEW</code> para los datos nuevos.',
        fullSolution: 'Un trigger <code>BEFORE</code> sería apropiado si quisiéramos modificar o validar datos antes de que se graben, no para registrar auditoría.'
    },
    {
        id: 'e223-mc3',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> Oracle provee los predicados booleanos <code>INSERTING</code>, <code>UPDATING</code> y <code>DELETING</code> dentro del cuerpo del trigger. Retornan <code>TRUE</code> o <code>FALSE</code> según qué evento disparó el trigger.',
        fullSolution: 'También se puede usar <code>UPDATING(\'columna\')</code> para verificar si una columna específica está siendo modificada. Ejemplo: <code>IF UPDATING(\'estado\') THEN ...</code>.'
    },
    {
        id: 'e223-tf1',
        answer: true,
        explanation: '<strong>Verdadero.</strong> Un <code>COMPOUND TRIGGER</code> puede tener hasta 4 secciones: <code>BEFORE STATEMENT</code>, <code>BEFORE EACH ROW</code>, <code>AFTER EACH ROW</code> y <code>AFTER STATEMENT</code>. Las variables declaradas en la cabecera son visibles en todas las secciones, permitiendo compartir datos entre fases.'
    },
    {
        id: 'e223-tf2',
        answer: true,
        explanation: '<strong>Verdadero.</strong> El error de mutating table (<code>ORA-04091</code>) solo ocurre cuando el trigger intenta consultar o modificar <strong>la misma tabla</strong> que lo disparó. Consultar una tabla diferente es perfectamente válido y es una práctica común. Por ejemplo, un trigger en <code>RESERVA_TEMPORAL</code> puede consultar <code>LOCALIDAD_EVENTO</code> sin problemas.'
    },
    {
        id: 'e223-fill1',
        answers: ['BEFORE UPDATE OR DELETE', "RAISE_APPLICATION_ERROR(-20060, 'No se puede modificar un evento finalizado')"],
        explanation: 'Usamos <code>BEFORE UPDATE OR DELETE</code> porque queremos interceptar la operación <em>antes</em> de que ocurra y cancelarla si el evento está finalizado. La sentencia <code>RAISE_APPLICATION_ERROR</code> lanza un error personalizado que cancela la operación.',
        fullSolution: '<pre>CREATE OR REPLACE TRIGGER trg_proteger_evento\nBEFORE UPDATE OR DELETE ON EVENTO\nFOR EACH ROW\nBEGIN\n    IF :OLD.estado IN (\'REALIZADO\', \'CANCELADO\') THEN\n        RAISE_APPLICATION_ERROR(-20060,\n            \'No se puede modificar un evento finalizado\');\n    END IF;\nEND trg_proteger_evento;</pre>'
    },
    {
        id: 'e223-fill2',
        answers: ["WHEN (NEW.estado = 'ANULADO' AND OLD.estado != 'ANULADO')", ':OLD.ticket_id'],
        explanation: 'La cláusula <code>WHEN</code> asegura que el trigger solo se dispare cuando el ticket <em>se convierte</em> en anulado (no en cualquier cambio de estado). Usamos <code>:OLD.ticket_id</code> para identificar el ticket en el log.',
        fullSolution: '<pre>CREATE OR REPLACE TRIGGER trg_log_anulacion\nAFTER UPDATE OF estado ON TICKET\nFOR EACH ROW\nWHEN (NEW.estado = \'ANULADO\' AND OLD.estado != \'ANULADO\')\nBEGIN\n    INSERT INTO LOG_ANULACIONES (\n        ticket_id, transaccion_id, reserva_id, motivo\n    ) VALUES (\n        :OLD.ticket_id,\n        :OLD.transaccion_id,\n        :OLD.reserva_id,\n        \'Anulación registrada por trigger\'\n    );\nEND trg_log_anulacion;</pre>'
    },
    {
        id: 'e223-err1',
        answer: 7, // Línea 8 (índice 7): FROM LOCALIDAD_EVENTO — mutating table
        explanation: '<strong>Error en las líneas 7-8:</strong> El trigger hace un <code>SELECT</code> sobre <code>LOCALIDAD_EVENTO</code>, que es <strong>la misma tabla</strong> que disparó el trigger. Esto genera el error <code>ORA-04091: table is mutating, trigger/function may not see it</code>.',
        fullSolution: 'Para resolver esto, usa un <code>COMPOUND TRIGGER</code>: guarda el <code>evento_id</code> en la sección <code>AFTER EACH ROW</code> y haz el <code>SELECT</code> en la sección <code>AFTER STATEMENT</code>, cuando la tabla ya no está mutando.'
    },
    {
        id: 'e223-err2',
        answer: 9, // Línea 10 (índice 9): COMMIT;
        explanation: '<strong>Error en la línea 10:</strong> Un trigger <strong>no puede</strong> contener <code>COMMIT</code>. El trigger es parte de la transacción del DML que lo disparó. Intentar hacer <code>COMMIT</code> genera el error <code>ORA-04092: cannot COMMIT in a trigger</code>.',
        fullSolution: 'La solución es simplemente eliminar la línea <code>COMMIT;</code>. El INSERT en <code>LOG_ESTADO_RESERVA</code> se confirmará cuando la transacción principal haga COMMIT. Además, nota que <code>:OLD.estado</code> es <code>NULL</code> en un INSERT, lo cual es correcto para el <code>estado_anterior</code>.'
    },
    {
        id: 'e223-ws1',
        explanation: '<strong>¡Sopa de letras completada!</strong> Has identificado los términos clave de triggers avanzados en Oracle PL/SQL.',
        fullSolution: `
            <h4>Términos de la Sopa de Letras:</h4>
            <table>
                <tr><th>Término</th><th>Orientación</th><th>Definición en Oracle PL/SQL</th></tr>
                <tr><td><strong>COMPOUND</strong></td><td>Fila 1</td><td>Tipo de trigger que combina múltiples fases en uno solo.</td></tr>
                <tr><td><strong>MUTATING</strong></td><td>Fila 2</td><td>Error al consultar la tabla que disparó el trigger row-level.</td></tr>
                <tr><td><strong>TRIGGER</strong></td><td>Fila 4</td><td>Bloque PL/SQL que se ejecuta automáticamente ante un evento DML.</td></tr>
                <tr><td><strong>BEFORE</strong></td><td>Fila 6</td><td>Timing que ejecuta el trigger antes de que el cambio se aplique.</td></tr>
                <tr><td><strong>AFTER</strong></td><td>Fila 8</td><td>Timing que ejecuta el trigger después de que el cambio se aplicó.</td></tr>
                <tr><td><strong>WHEN</strong></td><td>Fila 10</td><td>Cláusula que agrega una condición extra para disparar el trigger.</td></tr>
            </table>
        `
    },
    {
        id: 'e223-prop1',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>CREATE OR REPLACE TRIGGER trg_auto_agotar_evento\nFOR UPDATE OF stock_disponible ON LOCALIDAD_EVENTO\nCOMPOUND TRIGGER\n    -- Colección para guardar evento_id afectados\n    TYPE t_ids IS TABLE OF NUMBER;\n    v_eventos t_ids := t_ids();\n\nAFTER EACH ROW IS\nBEGIN\n    -- Si el stock llega a 0, guardamos el evento_id\n    IF :NEW.stock_disponible = 0 THEN\n        v_eventos.EXTEND;\n        v_eventos(v_eventos.COUNT) := :NEW.evento_id;\n    END IF;\nEND AFTER EACH ROW;\n\nAFTER STATEMENT IS\nBEGIN\n    -- Ya no hay mutating: podemos consultar LOCALIDAD_EVENTO\n    FOR i IN 1..v_eventos.COUNT LOOP\n        UPDATE EVENTO\n        SET estado = \'AGOTADO\'\n        WHERE evento_id = v_eventos(i)\n          AND estado = \'VENTA\'\n          AND NOT EXISTS (\n              SELECT 1 FROM LOCALIDAD_EVENTO\n              WHERE evento_id = v_eventos(i)\n                AND stock_disponible > 0\n          );\n\n        IF SQL%ROWCOUNT > 0 THEN\n            DBMS_OUTPUT.PUT_LINE(\n                \'Evento \' || v_eventos(i) || \' → AGOTADO\');\n        END IF;\n    END LOOP;\nEND AFTER STATEMENT;\n\nEND trg_auto_agotar_evento;\n/\n\n-- Prueba\nBEGIN\n    -- Agotar todas las localidades del evento 1\n    UPDATE LOCALIDAD_EVENTO\n    SET stock_disponible = 0\n    WHERE evento_id = 1;\n\n    -- Verificar\n    FOR r IN (\n        SELECT nombre, estado FROM EVENTO WHERE evento_id = 1\n    ) LOOP\n        DBMS_OUTPUT.PUT_LINE(r.nombre || \': \' || r.estado);\n    END LOOP;\n\n    ROLLBACK;\nEND;\n/</pre>'
    },
    {
        id: 'e223-prop2',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>-- Asegurarse de que la tabla LOG_ESTADO_RESERVA existe\n\nCREATE OR REPLACE TRIGGER trg_auditoria_completa_reserva\nAFTER INSERT OR UPDATE OF estado OR DELETE ON RESERVA_TEMPORAL\nFOR EACH ROW\nBEGIN\n    IF INSERTING THEN\n        INSERT INTO LOG_ESTADO_RESERVA (\n            reserva_id, estado_anterior, estado_nuevo\n        ) VALUES (\n            :NEW.reserva_id,\n            NULL,           -- No había estado anterior\n            :NEW.estado\n        );\n    ELSIF UPDATING THEN\n        IF :OLD.estado != :NEW.estado THEN\n            INSERT INTO LOG_ESTADO_RESERVA (\n                reserva_id, estado_anterior, estado_nuevo\n            ) VALUES (\n                :OLD.reserva_id,\n                :OLD.estado,\n                :NEW.estado\n            );\n        END IF;\n    ELSIF DELETING THEN\n        INSERT INTO LOG_ESTADO_RESERVA (\n            reserva_id, estado_anterior, estado_nuevo\n        ) VALUES (\n            :OLD.reserva_id,\n            :OLD.estado,\n            \'ELIMINADA\'\n        );\n    END IF;\nEND trg_auditoria_completa_reserva;\n/\n\n-- Prueba completa\nDECLARE\n    v_reserva_id NUMBER;\nBEGIN\n    -- 1. INSERT: crear una reserva\n    INSERT INTO RESERVA_TEMPORAL (\n        cliente_id, localidad_evento_id,\n        fecha_expiracion, estado\n    ) VALUES (\n        1, 1,\n        SYSTIMESTAMP + INTERVAL \'15\' MINUTE, \'ACTIVA\'\n    ) RETURNING reserva_id INTO v_reserva_id;\n\n    -- 2. UPDATE: cambiar estado\n    UPDATE RESERVA_TEMPORAL\n    SET estado = \'CONVERTIDA\'\n    WHERE reserva_id = v_reserva_id;\n\n    -- 3. Verificar el log\n    DBMS_OUTPUT.PUT_LINE(\'=== Log de Auditoría ===\');\n    FOR r IN (\n        SELECT reserva_id, estado_anterior, estado_nuevo, fecha_cambio\n        FROM LOG_ESTADO_RESERVA\n        ORDER BY fecha_cambio DESC\n        FETCH FIRST 5 ROWS ONLY\n    ) LOOP\n        DBMS_OUTPUT.PUT_LINE(\n            \'Reserva \' || r.reserva_id ||\n            \': \' || NVL(r.estado_anterior, \'(nueva)\') ||\n            \' → \' || r.estado_nuevo ||\n            \' [\' || TO_CHAR(r.fecha_cambio, \'HH24:MI:SS\') || \']\'\n        );\n    END LOOP;\n\n    ROLLBACK;\nEND;\n/</pre>'
    }
];
