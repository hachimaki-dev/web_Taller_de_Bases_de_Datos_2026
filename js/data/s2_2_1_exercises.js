// s2_2_1_exercises.js — Ejercicios: Triggers — Introducción Guiada

const s2_2_1_exercises = [
    {
        id: 'e221-mc1',
        type: 'multiple-choice',
        question: '¿Por qué un procedimiento almacenado no siempre es suficiente para garantizar una regla estricta de negocio (como normalizar correos o auditar cambios de precio)?',
        options: [
            'Porque los procedimientos almacenados no pueden conectarse con tablas en Oracle',
            'Porque un usuario o script con permisos puede hacer un <code>INSERT</code> o <code>UPDATE</code> directo sin llamar al procedimiento, evadiendo la lógica',
            'Porque los procedimientos solo admiten consultas <code>SELECT</code> y no operaciones DML',
            'Porque los procedimientos se ejecutan demasiado rápido para bases de datos transaccionales'
        ]
    },
    {
        id: 'e221-mc2',
        type: 'multiple-choice',
        question: 'En el caso de limpiar el correo del cliente para que siempre quede en minúsculas (<code>:NEW.email := LOWER(:NEW.email);</code>), ¿por qué es obligatorio usar <code>BEFORE</code> y no <code>AFTER</code>?',
        options: [
            'Porque en los triggers <code>AFTER</code> los datos ya se escribieron en la tabla y Oracle prohíbe modificar <code>:NEW</code> (error ORA-04084)',
            'Porque los triggers <code>BEFORE</code> son los únicos que admiten sentencias en lenguaje PL/SQL',
            'Porque los triggers <code>AFTER</code> solo pueden usarse con eventos <code>DELETE</code>',
            'Porque si se usa <code>AFTER</code> el correo se borra automáticamente de la base de datos'
        ]
    },
    {
        id: 'e221-mc3',
        type: 'multiple-choice',
        question: 'Cuando un analista ejecuta <code>UPDATE LOCALIDAD_EVENTO SET precio = 9500 WHERE localidad_evento_id = 10;</code> sobre una fila cuyo precio era 80000, ¿qué valores contienen <code>:OLD.precio</code> y <code>:NEW.precio</code>?',
        options: [
            '<code>:OLD.precio = 9500</code> y <code>:NEW.precio = 80000</code>',
            '<code>:OLD.precio = NULL</code> y <code>:NEW.precio = 9500</code>',
            '<code>:OLD.precio = 80000</code> y <code>:NEW.precio = 9500</code>',
            'Ambos pseudo-registros quedan en <code>NULL</code> hasta que se haga <code>COMMIT</code>'
        ]
    },
    {
        id: 'e221-mc4',
        type: 'multiple-choice',
        question: 'En el trigger <code>trg_auditar_precio</code>, ¿por qué la columna <code>administrador_id</code> de <code>LOG_CAMBIO_PRECIO</code> queda con valor <code>NULL</code> tras registrar la modificación?',
        options: [
            'Porque la tabla <code>LOCALIDAD_EVENTO</code> no tiene una columna <code>administrador_id</code>, por lo que el trigger no tiene acceso a ese dato mediante <code>:NEW</code> ni <code>:OLD</code>',
            'Porque Oracle prohíbe almacenar claves foráneas dentro de cualquier trigger',
            'Porque ocurrió un error en tiempo de ejecución al intentar conectarse con la tabla ADMINISTRADOR',
            'Porque los triggers solo pueden insertar datos de tipo texto y fechas'
        ]
    },
    {
        id: 'e221-tf1',
        type: 'true-false',
        question: 'Una restricción de tabla (CHECK CONSTRAINT) puede transformar automáticamente un texto a minúsculas o capitalizar un nombre antes de guardarlo en disco.'
    },
    {
        id: 'e221-tf2',
        type: 'true-false',
        question: 'Durante la ejecución de un trigger que responde a un <code>INSERT</code>, el pseudo-registro <code>:OLD</code> contiene el valor <code>NULL</code> para todas sus columnas porque no existía un registro previo.'
    },
    {
        id: 'e221-fill1',
        type: 'fill-code',
        question: 'Completa el trigger que normaliza en vuelo los datos de un cliente (email a minúsculas y nombre capitalizado):',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE TRIGGER trg_cliente_formato\n' },
            { type: 'blank', index: 0, placeholder: 'timing + eventos + tabla', width: 290 },
            { type: 'text', content: '\nFOR EACH ROW\nBEGIN\n    ' },
            { type: 'blank', index: 1, placeholder: 'asignación a :NEW.email', width: 280 },
            { type: 'text', content: ';\n    :NEW.nombre := INITCAP(TRIM(:NEW.nombre));\nEND trg_cliente_formato;' }
        ]
    },
    {
        id: 'e221-fill2',
        type: 'fill-code',
        question: 'Completa el trigger de bitácora que registra en <code>LOG_CAMBIO_PRECIO</code> cada vez que el precio de una localidad cambia:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE TRIGGER trg_auditar_precio\n' },
            { type: 'blank', index: 0, placeholder: 'timing + evento + columna + tabla', width: 330 },
            { type: 'text', content: '\nFOR EACH ROW\nWHEN (OLD.precio != NEW.precio)\nBEGIN\n    INSERT INTO LOG_CAMBIO_PRECIO (\n        localidad_evento_id, precio_anterior, precio_nuevo, fecha_cambio\n    ) VALUES (\n        :OLD.localidad_evento_id,\n        ' },
            { type: 'blank', index: 1, placeholder: 'pseudo-registro valor previo', width: 140 },
            { type: 'text', content: ',\n        :NEW.precio,\n        SYSTIMESTAMP\n    );\nEND trg_auditar_precio;' }
        ]
    },
    {
        id: 'e221-err1',
        type: 'find-error',
        question: 'Un desarrollador junior intentó crear un trigger para forzar el estado \'ACTIVA\' en las reservas, pero Oracle rechaza la compilación con un error ORA-04084. Identifica la línea incorrecta:',
        lines: [
            'CREATE OR REPLACE TRIGGER trg_forzar_reserva',
            'AFTER INSERT ON RESERVA_TEMPORAL',
            'FOR EACH ROW',
            'BEGIN',
            '    :NEW.estado := \'ACTIVA\';',
            'END trg_forzar_reserva;'
        ]
    },
    {
        id: 'e221-err2',
        type: 'find-error',
        question: 'Este trigger tiene un error de sintaxis al evaluar la condición de disparo. Identifica en qué línea está el error:',
        lines: [
            'CREATE OR REPLACE TRIGGER trg_cambio_precio',
            'AFTER UPDATE OF precio ON LOCALIDAD_EVENTO',
            'FOR EACH ROW',
            'WHEN (:OLD.precio != :NEW.precio)',
            'BEGIN',
            '    INSERT INTO LOG_CAMBIO_PRECIO (',
            '        localidad_evento_id, precio_anterior, precio_nuevo',
            '    ) VALUES (',
            '        :OLD.localidad_evento_id, :OLD.precio, :NEW.precio',
            '    );',
            'END trg_cambio_precio;'
        ]
    },
    {
        id: 'e221-cw1',
        type: 'crossword',
        question: 'Resuelve el crucigrama con los <strong>6 conceptos esenciales</strong> aprendidos en la introducción a triggers:',
        acrossClues: [
            { number: 1, clue: 'Bloque PL/SQL automático que despierta ante un evento DML (en inglés)', answer: 'TRIGGER', row: 0, col: 0, direction: 'across' },
            { number: 3, clue: 'Timing que ejecuta el trigger DESPUÉS de aplicar el cambio (en inglés)', answer: 'AFTER', row: 2, col: 2, direction: 'across' },
            { number: 5, clue: 'Pseudo-registro que contiene los datos que HABÍA antes del cambio', answer: 'OLD', row: 4, col: 0, direction: 'across' }
        ],
        downClues: [
            { number: 2, clue: 'Timing que ejecuta el trigger ANTES de que el dato toque el disco', answer: 'BEFORE', row: 0, col: 0, direction: 'down' },
            { number: 4, clue: 'Acción de registrar quién, cuándo y qué cambió para trazabilidad', answer: 'AUDITORIA', row: 0, col: 4, direction: 'down' },
            { number: 6, clue: 'Pseudo-registro con los valores NUEVOS que se van a grabar', answer: 'NEW', row: 2, col: 6, direction: 'down' }
        ]
    },
    {
        id: 'e221-prop1',
        type: 'proposed',
        question: '<strong>Ejercicio Propuesto 1 — Limpieza de Teléfono en CLIENTE (Punto Ticket)</strong>',
        content: `<p>En la tabla <code>CLIENTE</code>, los operadores de boletería ingresan números de teléfono con formatos dispares como <code>" 9 1234 5678 "</code> o <code>"+56 9 12345678"</code>.</p>
        <p>Crea un trigger llamado <code>trg_cliente_limpiar_telefono</code> que:</p>
        <ol>
            <li>Se ejecute <code>BEFORE INSERT OR UPDATE OF telefono ON CLIENTE FOR EACH ROW</code>.</li>
            <li>Si <code>:NEW.telefono IS NOT NULL</code>, elimine todos los espacios en blanco usando <code>REPLACE(:NEW.telefono, ' ', '')</code>.</li>
            <li>Si el número no comienza con <code>'+56'</code>, concatene el prefijo de país <code>'+56' || :NEW.telefono</code>.</li>
        </ol>
        <p><strong>Pruébalo:</strong> Inserta un cliente con teléfono <code>' 987654321 '</code> y haz un <code>SELECT telefono FROM CLIENTE</code> para verificar que quedó como <code>'+56987654321'</code>.</p>`
    },
    {
        id: 'e221-prop2',
        type: 'proposed',
        question: '<strong>Ejercicio Propuesto 2 — Bitácora de Variación de Stock (Punto Ticket)</strong>',
        content: `<p>Para evitar pérdidas de inventario por errores de digitación, la gerencia de operaciones necesita auditar cualquier reducción o aumento de <code>stock_disponible</code> en <code>LOCALIDAD_EVENTO</code>.</p>
        <p><strong>Paso 1:</strong> Crea una tabla simple de bitácora:</p>
<pre>CREATE TABLE LOG_STOCK_LOCALIDAD (
    log_stock_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    localidad_id     NUMBER NOT NULL,
    stock_anterior   NUMBER NOT NULL,
    stock_nuevo      NUMBER NOT NULL,
    diferencia       NUMBER NOT NULL,
    fecha_registro   TIMESTAMP DEFAULT SYSTIMESTAMP
);</pre>
        <p><strong>Paso 2:</strong> Crea un trigger <code>trg_auditar_stock</code> que:</p>
        <ol>
            <li>Se dispare <code>AFTER UPDATE OF stock_disponible ON LOCALIDAD_EVENTO FOR EACH ROW</code>.</li>
            <li>Use <code>WHEN (OLD.stock_disponible != NEW.stock_disponible)</code>.</li>
            <li>Inserte en <code>LOG_STOCK_LOCALIDAD</code> calculando la diferencia (<code>:NEW.stock_disponible - :OLD.stock_disponible</code>).</li>
        </ol>
        <p>Prueba actualizando el stock de una localidad y revisa los datos en <code>LOG_STOCK_LOCALIDAD</code>.</p>`
    }
];
