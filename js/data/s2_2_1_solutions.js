// s2_2_1_solutions.js — Solucionario: Triggers — Introducción Guiada

const s2_2_1_solutions = [
    {
        id: 'e221-mc1',
        answer: 1, // Opción B
        explanation: '<strong>Correcto.</strong> Un procedimiento almacenado solo se ejecuta si alguien lo invoca explícitamente (ej: <code>EXECUTE sp_registrar_cliente(...)</code>). Si un usuario con permisos, un script batch o un microservicio ejecuta un <code>INSERT</code> directo en SQL, se salta por completo el procedimiento. Un trigger, en cambio, vive pegado a la tabla y se ejecuta <strong>siempre y sin excepciones</strong> ante cualquier evento DML.',
        fullSolution: 'Por eso los triggers se usan para reglas inquebrantables de negocio y auditoría: garantizan que la regla se cumpla sin importar el canal por donde entren los datos.'
    },
    {
        id: 'e221-mc2',
        answer: 0, // Opción A
        explanation: '<strong>Correcto.</strong> Solo en triggers con timing <code>BEFORE ... FOR EACH ROW</code> es posible modificar los valores de <code>:NEW</code> (usando <code>:NEW.campo := ...</code>) porque el registro todavía está "en vuelo" antes de escribirse en disco. En un trigger <code>AFTER</code> la fila ya fue escrita en el bloque de datos y Oracle lanza el error <code>ORA-04084: cannot change NEW values for this trigger type</code>.',
        fullSolution: 'Regla nemotécnica: Si vas a alterar o calcular datos que se van a guardar en la misma fila, usa <strong>BEFORE</strong>. Si vas a registrar lo que pasó en otra tabla (auditoría), usa <strong>AFTER</strong>.'
    },
    {
        id: 'e221-mc3',
        answer: 2, // Opción C
        explanation: '<strong>Correcto.</strong> En una sentencia <code>UPDATE</code>, <code>:OLD</code> contiene la imagen de los datos tal como estaban en la tabla antes de ejecutarse la modificación (en este caso el precio antiguo $80.000), mientras que <code>:NEW</code> contiene el nuevo valor que la sentencia intenta grabar ($9.500).',
        fullSolution: 'Esto permite comparar fácilmente si el dato cambió mediante <code>WHEN (OLD.columna != NEW.columna)</code> y registrar ambos valores en una tabla de auditoría.'
    },
    {
        id: 'e221-mc4',
        answer: 0, // Opción A
        explanation: '<strong>Correcto.</strong> El trigger se dispara sobre la tabla <code>LOCALIDAD_EVENTO</code>, la cual únicamente contiene columnas propias de la localidad (precio, stock, nombre, etc.). No tiene ninguna columna <code>administrador_id</code>. Por ello, el trigger no tiene de dónde extraer el identificador del usuario de la aplicación web y el campo queda en <code>NULL</code> por omisión.',
        fullSolution: 'Este dilema se resuelve en arquitecturas profesionales mediante <strong>Paquetes PL/SQL</strong> y variables de contexto (<code>SYS_CONTEXT</code>), donde la aplicación asigna el ID a una variable de sesión en memoria antes del UPDATE para que el trigger pueda leerla. Además, en procesos automáticos o ETL por lotes, que quede en <code>NULL</code> es correcto porque no hubo un administrador humano involucrado.'
    },
    {
        id: 'e221-tf1',
        answer: false,
        explanation: '<strong>Falso.</strong> Una restricción <code>CHECK</code> es puramente pasiva: solo evalúa una condición booleana. Si es verdadera, permite el guardado; si es falsa, <strong>aborta la transacción</strong> lanzando un error <code>ORA-02290</code>. Un CHECK <strong>jamás puede modificar</strong> o transformar el valor en vuelo. Para transformar datos automáticamente (como pasar a minúsculas o capitalizar), se requiere un trigger <code>BEFORE INSERT OR UPDATE</code>.',
        fullSolution: 'Transformación de datos en vuelo = Trigger BEFORE. Validación con rechazo estricto = CHECK Constraint o Trigger con RAISE_APPLICATION_ERROR.'
    },
    {
        id: 'e221-tf2',
        answer: true,
        explanation: '<strong>Verdadero.</strong> Cuando se inserta un registro nuevo (<code>INSERT</code>), no existe ningún dato previo en la base de datos para esa fila. Por lo tanto, <code>:OLD</code> es <code>NULL</code> para todas sus columnas. De manera simétrica, en un <code>DELETE</code>, el pseudo-registro <code>:NEW</code> es <code>NULL</code> porque la fila dejará de existir.',
        fullSolution: '• INSERT: :OLD es NULL, :NEW tiene los datos entrantes.<br>• UPDATE: :OLD tiene los datos previos, :NEW tiene los datos modificados.<br>• DELETE: :OLD tiene los datos que se van a borrar, :NEW es NULL.'
    },
    {
        id: 'e221-fill1',
        answers: ['BEFORE INSERT OR UPDATE ON CLIENTE', ':NEW.email := LOWER(TRIM(:NEW.email))'],
        explanation: 'Usamos <code>BEFORE INSERT OR UPDATE ON CLIENTE</code> porque queremos interceptar tanto altas de nuevos clientes como modificaciones de datos existentes. Dentro del cuerpo, asignamos a <code>:NEW.email</code> la versión en minúsculas y sin espacios.',
        fullSolution: '<pre>CREATE OR REPLACE TRIGGER trg_cliente_formato\nBEFORE INSERT OR UPDATE ON CLIENTE\nFOR EACH ROW\nBEGIN\n    :NEW.email := LOWER(TRIM(:NEW.email));\n    :NEW.nombre := INITCAP(TRIM(:NEW.nombre));\nEND trg_cliente_formato;\n/</pre>'
    },
    {
        id: 'e221-fill2',
        answers: ['AFTER UPDATE OF precio ON LOCALIDAD_EVENTO', ':OLD.precio'],
        explanation: 'El timing debe ser <code>AFTER UPDATE OF precio ON LOCALIDAD_EVENTO</code> para auditar únicamente cuando la columna <code>precio</code> sufra una modificación. Para registrar cuánto costaba antes, guardamos <code>:OLD.precio</code>.',
        fullSolution: '<pre>CREATE OR REPLACE TRIGGER trg_auditar_precio\nAFTER UPDATE OF precio ON LOCALIDAD_EVENTO\nFOR EACH ROW\nWHEN (OLD.precio != NEW.precio)\nBEGIN\n    INSERT INTO LOG_CAMBIO_PRECIO (\n        localidad_evento_id, precio_anterior, precio_nuevo, fecha_cambio\n    ) VALUES (\n        :OLD.localidad_evento_id,\n        :OLD.precio,\n        :NEW.precio,\n        SYSTIMESTAMP\n    );\nEND trg_auditar_precio;\n/</pre>'
    },
    {
        id: 'e221-err1',
        answer: 1, // Línea 2 (índice 1): AFTER INSERT ON RESERVA_TEMPORAL
        explanation: '<strong>Error en la línea 2:</strong> El trigger fue declarado como <code>AFTER INSERT</code>, pero en la línea 5 intenta hacer <code>:NEW.estado := \'ACTIVA\';</code>. En Oracle, modificar <code>:NEW</code> solo es válido en triggers <strong>BEFORE</strong>. Al usar AFTER, se produce el error <code>ORA-04084: cannot change NEW values for this trigger type</code>.',
        fullSolution: 'La corrección es cambiar <code>AFTER</code> por <code>BEFORE</code>:<pre>CREATE OR REPLACE TRIGGER trg_forzar_reserva\nBEFORE INSERT ON RESERVA_TEMPORAL  -- ← BEFORE, para poder modificar :NEW\nFOR EACH ROW\nBEGIN\n    :NEW.estado := \'ACTIVA\';\nEND trg_forzar_reserva;\n/</pre>'
    },
    {
        id: 'e221-err2',
        answer: 3, // Línea 4 (índice 3): WHEN (:OLD.precio != :NEW.precio)
        explanation: '<strong>Error en la línea 4:</strong> Dentro de la cláusula <code>WHEN</code> los pseudo-registros se escriben <strong>sin dos puntos</strong>: <code>WHEN (OLD.precio != NEW.precio)</code>. Si incluyes los dos puntos (<code>:OLD</code> o <code>:NEW</code>) dentro de WHEN, Oracle genera un error de compilación.',
        fullSolution: 'Regla de sintaxis fundamental en Oracle:<br>• En la cláusula <code>WHEN</code>: escribir <code>OLD.campo</code> y <code>NEW.campo</code> (sin dos puntos).<br>• En el bloque <code>BEGIN...END</code>: escribir <code>:OLD.campo</code> y <code>:NEW.campo</code> (con dos puntos obligatorios).'
    },
    {
        id: 'e221-cw1',
        explanation: '<strong>¡Crucigrama completado con éxito!</strong> Has dominado los términos fundamentales de los triggers en Oracle PL/SQL.',
        fullSolution: `
            <h4>Términos del Crucigrama:</h4>
            <table>
                <tr><th>Término</th><th>Dirección</th><th>Definición en Oracle PL/SQL</th></tr>
                <tr><td><strong>TRIGGER</strong></td><td>→ Horizontal 1</td><td>Bloque PL/SQL con nombre que se dispara automáticamente ante un evento DML.</td></tr>
                <tr><td><strong>BEFORE</strong></td><td>↓ Vertical 2</td><td>Timing que se ejecuta antes de aplicar el cambio, permitiendo modificar :NEW o validar.</td></tr>
                <tr><td><strong>AFTER</strong></td><td>→ Horizontal 3</td><td>Timing que se ejecuta después de que el cambio se grabó, ideal para auditoría y logs.</td></tr>
                <tr><td><strong>AUDITORIA</strong></td><td>↓ Vertical 4</td><td>Práctica de registrar quién, cuándo y qué valores cambiaron en el sistema.</td></tr>
                <tr><td><strong>OLD</strong></td><td>→ Horizontal 5</td><td>Pseudo-registro que contiene los valores anteriores al cambio en UPDATE o DELETE.</td></tr>
                <tr><td><strong>NEW</strong></td><td>↓ Vertical 6</td><td>Pseudo-registro que contiene los nuevos valores a guardar en INSERT o UPDATE.</td></tr>
            </table>
        `
    },
    {
        id: 'e221-prop1',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>-- Trigger para estandarizar teléfonos de clientes\nCREATE OR REPLACE TRIGGER trg_cliente_limpiar_telefono\nBEFORE INSERT OR UPDATE OF telefono ON CLIENTE\nFOR EACH ROW\nBEGIN\n    IF :NEW.telefono IS NOT NULL THEN\n        -- 1. Eliminar todos los espacios\n        :NEW.telefono := REPLACE(:NEW.telefono, \' \', \'\');\n        \n        -- 2. Asegurar prefijo de país si no viene incluido\n        IF NOT (:NEW.telefono LIKE \'+56%\') THEN\n            :NEW.telefono := \'+56\' || :NEW.telefono;\n        END IF;\n    END IF;\nEND trg_cliente_limpiar_telefono;\n/\n\n-- Prueba en SQL Developer:\nBEGIN\n    INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono)\n    VALUES (\'20.111.222-3\', \'Camila\', \'Rojas\', \'camila@ticket.cl\', \' 9 8765 4321 \');\n    \n    -- Consultar\n    FOR r IN (SELECT telefono FROM CLIENTE WHERE rut = \'20.111.222-3\') LOOP\n        DBMS_OUTPUT.PUT_LINE(\'Teléfono normalizado: \' || r.telefono);\n    END LOOP;\n    \n    ROLLBACK;\nEND;\n/</pre>'
    },
    {
        id: 'e221-prop2',
        explanation: 'Este ejercicio se resuelve en Oracle SQL Developer.',
        fullSolution: '<pre>-- 1. Crear la tabla de bitácora\nCREATE TABLE LOG_STOCK_LOCALIDAD (\n    log_stock_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    localidad_id     NUMBER NOT NULL,\n    stock_anterior   NUMBER NOT NULL,\n    stock_nuevo      NUMBER NOT NULL,\n    diferencia       NUMBER NOT NULL,\n    fecha_registro   TIMESTAMP DEFAULT SYSTIMESTAMP\n);\n\n-- 2. Crear el trigger de auditoría\nCREATE OR REPLACE TRIGGER trg_auditar_stock\nAFTER UPDATE OF stock_disponible ON LOCALIDAD_EVENTO\nFOR EACH ROW\nWHEN (OLD.stock_disponible != NEW.stock_disponible)\nBEGIN\n    INSERT INTO LOG_STOCK_LOCALIDAD (\n        localidad_id, stock_anterior, stock_nuevo, diferencia\n    ) VALUES (\n        :OLD.localidad_evento_id,\n        :OLD.stock_disponible,\n        :NEW.stock_disponible,\n        :NEW.stock_disponible - :OLD.stock_disponible\n    );\nEND trg_auditar_stock;\n/\n\n-- 3. Prueba en SQL Developer:\nBEGIN\n    -- Modificar stock de una localidad\n    UPDATE LOCALIDAD_EVENTO\n    SET stock_disponible = stock_disponible - 10\n    WHERE localidad_evento_id = 1;\n    \n    -- Ver el log\n    FOR r IN (SELECT * FROM LOG_STOCK_LOCALIDAD ORDER BY log_stock_id DESC FETCH FIRST 1 ROWS ONLY) LOOP\n        DBMS_OUTPUT.PUT_LINE(\'Stock previo: \' || r.stock_anterior || \n                             \' | Stock nuevo: \' || r.stock_nuevo || \n                             \' | Variación: \' || r.diferencia);\n    END LOOP;\n    \n    ROLLBACK;\nEND;\n/</pre>'
    }
];
