// s2_2_3_exercises.js — Ejercicios: Triggers — Casos Prácticos y Compound Triggers con Punto Ticket

const s2_2_3_exercises = [
    {
        id: 'e223-mc1',
        type: 'multiple-choice',
        question: '¿Cuál es la principal ventaja de usar un <code>COMPOUND TRIGGER</code> en lugar de un trigger <code>FOR EACH ROW</code> convencional?',
        options: [
            'Compila más rápido porque Oracle lo optimiza automáticamente',
            'Permite ejecutar código en <strong>diferentes fases</strong> (row-level y statement-level) compartiendo variables, resolviendo el problema de mutating tables',
            'Puede dispararse ante eventos DDL como <code>CREATE TABLE</code>',
            'Permite usar <code>COMMIT</code> dentro del trigger sin generar errores'
        ]
    },
    {
        id: 'e223-mc2',
        type: 'multiple-choice',
        question: 'Si necesitas registrar en un log quién anuló un ticket y cuándo, ¿qué tipo de trigger es más apropiado?',
        options: [
            '<code>BEFORE UPDATE ... FOR EACH ROW</code> — para modificar :NEW antes de grabar',
            '<code>AFTER UPDATE ... FOR EACH ROW</code> — para registrar el cambio después de que ocurrió',
            '<code>BEFORE DELETE ... FOR EACH ROW</code> — para capturar la fila antes de que se elimine',
            '<code>AFTER INSERT ... FOR EACH ROW</code> — para registrar la nueva fila insertada'
        ]
    },
    {
        id: 'e223-mc3',
        type: 'multiple-choice',
        question: 'Un trigger <code>BEFORE UPDATE OR DELETE ON EVENTO</code> usa <code>:OLD.estado</code> para verificar si el evento está finalizado. ¿Qué predicados se pueden usar dentro del cuerpo para saber si fue un UPDATE o un DELETE?',
        options: [
            '<code>:OLD.UPDATING</code> y <code>:OLD.DELETING</code>',
            '<code>INSERTING</code>, <code>UPDATING</code> y <code>DELETING</code>',
            '<code>DML_TYPE = \'UPDATE\'</code> y <code>DML_TYPE = \'DELETE\'</code>',
            'No se puede distinguir dentro del trigger qué evento lo disparó'
        ]
    },
    {
        id: 'e223-tf1',
        type: 'true-false',
        question: 'Un <code>COMPOUND TRIGGER</code> puede tener secciones <code>BEFORE EACH ROW</code> y <code>AFTER STATEMENT</code> en el mismo trigger, compartiendo variables declaradas en la sección de declaraciones.'
    },
    {
        id: 'e223-tf2',
        type: 'true-false',
        question: 'Un trigger <code>FOR EACH ROW</code> puede consultar sin problemas una tabla diferente a la que disparó el trigger, usando <code>SELECT ... INTO</code>.'
    },
    {
        id: 'e223-fill1',
        type: 'fill-code',
        question: 'Completa el trigger que impide modificar o eliminar eventos finalizados:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE TRIGGER trg_proteger_evento\n' },
            { type: 'blank', index: 0, placeholder: 'timing + eventos', width: 260 },
            { type: 'text', content: ' ON EVENTO\nFOR EACH ROW\nBEGIN\n    IF :OLD.estado IN (\'REALIZADO\', \'CANCELADO\') THEN\n        ' },
            { type: 'blank', index: 1, placeholder: 'sentencia de error', width: 340 },
            { type: 'text', content: ';\n    END IF;\nEND trg_proteger_evento;' }
        ]
    },
    {
        id: 'e223-fill2',
        type: 'fill-code',
        question: 'Completa el trigger que registra en <code>LOG_ANULACIONES</code> cuando un ticket se anula:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE TRIGGER trg_log_anulacion\nAFTER UPDATE OF estado ON TICKET\nFOR EACH ROW\n' },
            { type: 'blank', index: 0, placeholder: 'cláusula de condición', width: 320 },
            { type: 'text', content: '\nBEGIN\n    INSERT INTO LOG_ANULACIONES (\n        ticket_id, transaccion_id, reserva_id, motivo\n    ) VALUES (\n        ' },
            { type: 'blank', index: 1, placeholder: 'pseudo-registro.columna', width: 170 },
            { type: 'text', content: ',\n        :OLD.transaccion_id,\n        :OLD.reserva_id,\n        \'Anulación registrada por trigger\'\n    );\nEND trg_log_anulacion;' }
        ]
    },
    {
        id: 'e223-err1',
        type: 'find-error',
        question: 'Identifica la línea con el error en este trigger:',
        lines: [
            'CREATE OR REPLACE TRIGGER trg_stock_cero',
            'AFTER UPDATE OF stock_disponible ON LOCALIDAD_EVENTO',
            'FOR EACH ROW',
            'DECLARE',
            '    v_stock_total NUMBER;',
            'BEGIN',
            '    SELECT SUM(stock_disponible) INTO v_stock_total',
            '    FROM LOCALIDAD_EVENTO',
            '    WHERE evento_id = :NEW.evento_id;',
            'END trg_stock_cero;'
        ]
    },
    {
        id: 'e223-err2',
        type: 'find-error',
        question: 'Identifica la línea con el error en este trigger:',
        lines: [
            'CREATE OR REPLACE TRIGGER trg_audit_reserva',
            'AFTER INSERT ON RESERVA_TEMPORAL',
            'FOR EACH ROW',
            'BEGIN',
            '    INSERT INTO LOG_ESTADO_RESERVA (',
            '        reserva_id, estado_anterior, estado_nuevo',
            '    ) VALUES (',
            '        :NEW.reserva_id, :OLD.estado, :NEW.estado',
            '    );',
            '    COMMIT;',
            'END trg_audit_reserva;'
        ]
    },
    {
        id: 'e223-ws1',
        type: 'word-search',
        question: 'Encuentra los <strong>6 términos clave</strong> sobre triggers avanzados en la sopa de letras:',
        gridSize: 10,
        words: ['COMPOUND', 'MUTATING', 'TRIGGER', 'BEFORE', 'AFTER', 'WHEN'],
        wordPlacements: [
            { word: 'COMPOUND', cells: [0, 1, 2, 3, 4, 5, 6, 7], clue: 'Tipo de trigger que combina diferentes fases en uno solo' },
            { word: 'MUTATING', cells: [10, 11, 12, 13, 14, 15, 16, 17], clue: 'Error que ocurre al consultar la tabla que disparó el trigger' },
            { word: 'TRIGGER', cells: [30, 31, 32, 33, 34, 35, 36], clue: 'Bloque PL/SQL que se ejecuta automáticamente ante un evento DML' },
            { word: 'BEFORE', cells: [50, 51, 52, 53, 54, 55], clue: 'Timing que ejecuta el trigger antes del cambio' },
            { word: 'AFTER', cells: [70, 71, 72, 73, 74], clue: 'Timing que ejecuta el trigger después del cambio' },
            { word: 'WHEN', cells: [90, 91, 92, 93], clue: 'Cláusula que agrega una condición extra para disparar el trigger' }
        ],
        grid: [
            {letter:'C'},{letter:'O'},{letter:'M'},{letter:'P'},{letter:'O'},{letter:'U'},{letter:'N'},{letter:'D'},{letter:'X'},{letter:'Y'},
            {letter:'M'},{letter:'U'},{letter:'T'},{letter:'A'},{letter:'T'},{letter:'I'},{letter:'N'},{letter:'G'},{letter:'Z'},{letter:'A'},
            {letter:'B'},{letter:'C'},{letter:'D'},{letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},
            {letter:'T'},{letter:'R'},{letter:'I'},{letter:'G'},{letter:'G'},{letter:'E'},{letter:'R'},{letter:'L'},{letter:'M'},{letter:'N'},
            {letter:'O'},{letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},{letter:'V'},{letter:'W'},{letter:'X'},
            {letter:'B'},{letter:'E'},{letter:'F'},{letter:'O'},{letter:'R'},{letter:'E'},{letter:'Y'},{letter:'Z'},{letter:'A'},{letter:'B'},
            {letter:'C'},{letter:'D'},{letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},{letter:'L'},
            {letter:'A'},{letter:'F'},{letter:'T'},{letter:'E'},{letter:'R'},{letter:'M'},{letter:'N'},{letter:'O'},{letter:'P'},{letter:'Q'},
            {letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},{letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'},{letter:'Z'},{letter:'A'},
            {letter:'W'},{letter:'H'},{letter:'E'},{letter:'N'},{letter:'B'},{letter:'C'},{letter:'D'},{letter:'E'},{letter:'F'},{letter:'G'}
        ]
    },
    {
        id: 'e223-prop1',
        type: 'proposed',
        question: '<strong>Ejercicio propuesto 1 — COMPOUND TRIGGER: Auto-Agotar Evento (Punto Ticket)</strong>',
        content: `<p>Crea un <code>COMPOUND TRIGGER</code> llamado <code>trg_auto_agotar_evento</code> que:</p>
        <ol>
            <li>Se dispare <code>FOR UPDATE OF stock_disponible ON LOCALIDAD_EVENTO</code>.</li>
            <li>En la sección <code>AFTER EACH ROW</code>: si el nuevo <code>stock_disponible</code> es 0, guarde el <code>evento_id</code> en una colección.</li>
            <li>En la sección <code>AFTER STATEMENT</code>: para cada evento guardado, verifique si <strong>todas</strong> sus localidades tienen stock 0. Si es así, cambie el estado del evento a <code>'AGOTADO'</code> (solo si estaba en <code>'VENTA'</code>).</li>
        </ol>
        <p><strong>Pruébalo:</strong></p>
        <ol>
            <li>Ejecuta <code>UPDATE LOCALIDAD_EVENTO SET stock_disponible = 0 WHERE evento_id = 1;</code></li>
            <li>Verifica con <code>SELECT estado FROM EVENTO WHERE evento_id = 1;</code> que el estado cambió a <code>'AGOTADO'</code>.</li>
            <li>Haz <code>ROLLBACK</code> para restaurar los datos.</li>
        </ol>
        <p><strong>Pista:</strong> Usa <code>TYPE t_ids IS TABLE OF NUMBER;</code> para la colección y <code>NOT EXISTS</code> para verificar que no haya localidades con stock > 0.</p>`
    },
    {
        id: 'e223-prop2',
        type: 'proposed',
        question: '<strong>Ejercicio propuesto 2 — Trigger Múltiple: Auditoría Completa de Reservas (Punto Ticket)</strong>',
        content: `<p>Crea un trigger llamado <code>trg_auditoria_completa_reserva</code> que se dispare ante <code>INSERT OR UPDATE OR DELETE</code> en <code>RESERVA_TEMPORAL</code> y registre <strong>todas las operaciones</strong> en la tabla <code>LOG_ESTADO_RESERVA</code>.</p>
        <p><strong>Requisitos:</strong></p>
        <ol>
            <li>El trigger debe ser <code>AFTER INSERT OR UPDATE OF estado OR DELETE ON RESERVA_TEMPORAL FOR EACH ROW</code>.</li>
            <li>Usa los predicados <code>INSERTING</code>, <code>UPDATING</code> y <code>DELETING</code> para distinguir el evento.</li>
            <li>Para <code>INSERT</code>: registrar <code>estado_anterior = NULL</code> y <code>estado_nuevo = :NEW.estado</code>.</li>
            <li>Para <code>UPDATE</code>: registrar <code>estado_anterior = :OLD.estado</code> y <code>estado_nuevo = :NEW.estado</code> (solo si cambió).</li>
            <li>Para <code>DELETE</code>: registrar <code>estado_anterior = :OLD.estado</code> y <code>estado_nuevo = 'ELIMINADA'</code>.</li>
        </ol>
        <p>Prueba insertando, actualizando y eliminando reservas, y verifica los registros en <code>LOG_ESTADO_RESERVA</code>. Haz <code>ROLLBACK</code> al final.</p>`
    }
];
