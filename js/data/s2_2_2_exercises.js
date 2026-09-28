// s2_2_2_exercises.js — Ejercicios: Triggers — Fundamentos y Clasificación

const s2_2_2_exercises = [
    {
        id: 'e222-mc1',
        type: 'multiple-choice',
        question: '¿Cuál es la diferencia fundamental entre un trigger y un procedimiento almacenado?',
        options: [
            'El trigger se compila y el procedimiento no',
            'El trigger se ejecuta <strong>automáticamente</strong> ante un evento DML; el procedimiento se invoca manualmente',
            'El procedimiento puede acceder a tablas y el trigger no',
            'El trigger solo funciona con sentencias SELECT'
        ]
    },
    {
        id: 'e222-mc2',
        type: 'multiple-choice',
        question: '¿En qué tipo de trigger puedes <strong>modificar</strong> los valores de <code>:NEW</code> antes de que se graben en la tabla?',
        options: [
            '<code>AFTER ... FOR EACH ROW</code>',
            '<code>BEFORE ... FOR EACH ROW</code>',
            'En cualquier trigger que tenga <code>FOR EACH ROW</code>',
            'En triggers statement-level (sin <code>FOR EACH ROW</code>)'
        ]
    },
    {
        id: 'e222-mc3',
        type: 'multiple-choice',
        question: '¿Qué error genera Oracle si un trigger <code>FOR EACH ROW</code> intenta hacer un <code>SELECT</code> sobre la misma tabla que lo disparó?',
        options: [
            '<code>ORA-06503: Function returned without value</code>',
            '<code>ORA-04091: table is mutating</code>',
            '<code>ORA-14551: cannot perform a DML operation inside a query</code>',
            '<code>ORA-04084: cannot change NEW values for this trigger type</code>'
        ]
    },
    {
        id: 'e222-tf1',
        type: 'true-false',
        question: 'Dentro de la cláusula <code>WHEN</code> de un trigger, se deben usar <code>:OLD</code> y <code>:NEW</code> con los dos puntos, igual que en el cuerpo del trigger.'
    },
    {
        id: 'e222-tf2',
        type: 'true-false',
        question: 'Un trigger puede incluir una sentencia <code>COMMIT</code> dentro de su cuerpo para confirmar los cambios que realiza.'
    },
    {
        id: 'e222-fill1',
        type: 'fill-code',
        question: 'Completa la creación de un trigger que registre en <code>LOG_CAMBIO_PRECIO</code> cada vez que se modifique el precio de una localidad:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE TRIGGER trg_log_precio\n' },
            { type: 'blank', index: 0, placeholder: 'timing + evento', width: 250 },
            { type: 'text', content: ' ON LOCALIDAD_EVENTO\nFOR EACH ROW\nWHEN (OLD.precio != NEW.precio)\nBEGIN\n    INSERT INTO LOG_CAMBIO_PRECIO (\n        localidad_evento_id, precio_anterior, precio_nuevo\n    ) VALUES (\n        ' },
            { type: 'blank', index: 1, placeholder: 'pseudo-registro.columna', width: 220 },
            { type: 'text', content: ',\n        :OLD.precio,\n        :NEW.precio\n    );\nEND trg_log_precio;' }
        ]
    },
    {
        id: 'e222-fill2',
        type: 'fill-code',
        question: 'Completa el trigger que impide crear una reserva cuando no hay stock disponible:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE TRIGGER trg_validar_stock\nBEFORE INSERT ON RESERVA_TEMPORAL\nFOR EACH ROW\nDECLARE\n    v_stock NUMBER;\nBEGIN\n    SELECT stock_disponible INTO v_stock\n    FROM LOCALIDAD_EVENTO\n    WHERE localidad_evento_id = :NEW.localidad_evento_id;\n\n    IF v_stock <= 0 THEN\n        ' },
            { type: 'blank', index: 0, placeholder: 'sentencia de error', width: 300 },
            { type: 'text', content: ';\n    END IF;\n' },
            { type: 'blank', index: 1, placeholder: 'bloque final', width: 120 },
            { type: 'text', content: ' trg_validar_stock;' }
        ]
    },
    {
        id: 'e222-err1',
        type: 'find-error',
        question: 'Identifica la línea con el error en este trigger:',
        lines: [
            'CREATE OR REPLACE TRIGGER trg_audit_evento',
            'AFTER UPDATE ON EVENTO',
            'FOR EACH ROW',
            'WHEN (:OLD.estado != :NEW.estado)',
            'BEGIN',
            '    DBMS_OUTPUT.PUT_LINE(',
            '        \'Estado cambió: \' || :OLD.estado || \' → \' || :NEW.estado',
            '    );',
            'END trg_audit_evento;'
        ]
    },
    {
        id: 'e222-err2',
        type: 'find-error',
        question: 'Identifica la línea con el error en este trigger:',
        lines: [
            'CREATE OR REPLACE TRIGGER trg_forzar_estado',
            'AFTER INSERT ON RESERVA_TEMPORAL',
            'FOR EACH ROW',
            'BEGIN',
            '    :NEW.estado := \'ACTIVA\';',
            'END trg_forzar_estado;'
        ]
    },
    {
        id: 'e222-cw1',
        type: 'crossword',
        question: 'Resuelve el crucigrama con <strong>6 términos clave</strong> sobre triggers en Oracle PL/SQL:',
        acrossClues: [
            { number: 1, clue: 'Bloque PL/SQL que se ejecuta automáticamente ante un evento DML (en inglés)', answer: 'TRIGGER', row: 0, col: 0, direction: 'across' },
            { number: 3, clue: 'Timing que ejecuta el trigger DESPUÉS del cambio (en inglés)', answer: 'AFTER', row: 2, col: 2, direction: 'across' },
            { number: 5, clue: 'Pseudo-registro que contiene los valores ANTERIORES al cambio', answer: 'OLD', row: 4, col: 0, direction: 'across' }
        ],
        downClues: [
            { number: 2, clue: 'Timing que ejecuta el trigger ANTES del cambio (en inglés)', answer: 'BEFORE', row: 0, col: 0, direction: 'down' },
            { number: 4, clue: 'Error que ocurre al consultar la misma tabla que disparó el trigger (en inglés)', answer: 'MUTATING', row: 0, col: 3, direction: 'down' },
            { number: 6, clue: 'Pseudo-registro que contiene los valores NUEVOS del cambio', answer: 'NEW', row: 2, col: 6, direction: 'down' }
        ]
    },
    {
        id: 'e222-prop1',
        type: 'proposed',
        question: '<strong>Ejercicio propuesto 1 — Trigger AFTER: Registrar Historial de Estado de Reservas (Punto Ticket)</strong>',
        content: `<p>La tabla <code>RESERVA_TEMPORAL</code> tiene un campo <code>estado</code> que puede cambiar entre <code>'ACTIVA'</code>, <code>'EXPIRADA'</code>, <code>'CONVERTIDA'</code> y <code>'CANCELADA'</code>.</p>
        <p>Crea una nueva tabla llamada <code>LOG_ESTADO_RESERVA</code> con las columnas:</p>
        <ul>
            <li><code>log_estado_id</code> — <code>NUMBER GENERATED ALWAYS AS IDENTITY</code> (PK)</li>
            <li><code>reserva_id</code> — <code>NUMBER NOT NULL</code></li>
            <li><code>estado_anterior</code> — <code>VARCHAR2(20)</code></li>
            <li><code>estado_nuevo</code> — <code>VARCHAR2(20) NOT NULL</code></li>
            <li><code>fecha_cambio</code> — <code>TIMESTAMP DEFAULT SYSTIMESTAMP</code></li>
        </ul>
        <p>Luego crea un trigger llamado <code>trg_log_estado_reserva</code> que registre en esta tabla cada vez que el estado de una reserva cambie.</p>
        <p><strong>Requisitos:</strong></p>
        <ol>
            <li>El trigger debe ser <code>AFTER UPDATE OF estado ON RESERVA_TEMPORAL</code>.</li>
            <li>Debe dispararse solo <code>FOR EACH ROW</code>.</li>
            <li>Debe usar la cláusula <code>WHEN</code> para dispararse solo si el estado realmente cambió.</li>
            <li>Usa <code>ROLLBACK</code> al final del bloque de prueba para no alterar los datos.</li>
        </ol>`
    },
    {
        id: 'e222-prop2',
        type: 'proposed',
        question: '<strong>Ejercicio propuesto 2 — Trigger BEFORE: Impedir Modificaciones en Eventos Finalizados (Punto Ticket)</strong>',
        content: `<p>Crea un trigger llamado <code>trg_proteger_evento_finalizado</code> que impida cualquier <code>UPDATE</code> o <code>DELETE</code> sobre un evento cuyo estado sea <code>'REALIZADO'</code> o <code>'CANCELADO'</code>.</p>
        <p><strong>Requisitos:</strong></p>
        <ol>
            <li>El trigger debe ser <code>BEFORE UPDATE OR DELETE ON EVENTO</code>.</li>
            <li>Debe dispararse <code>FOR EACH ROW</code>.</li>
            <li>Si el estado del evento es <code>'REALIZADO'</code> o <code>'CANCELADO'</code>, lanzar <code>RAISE_APPLICATION_ERROR(-20060, 'No se puede modificar un evento finalizado')</code>.</li>
            <li>Pruébalo intentando actualizar un evento con estado <code>'REALIZADO'</code> y verifica que Oracle rechace la operación.</li>
        </ol>
        <p><strong>Pista:</strong> Usa <code>:OLD.estado</code> para verificar el estado actual del evento antes del cambio.</p>`
    }
];
