// s2_3_2_solutions.js — Solucionario: Paquetes PL/SQL (Packages)
// Explicaciones completas y soluciones ejecutables para Punto Ticket

const s2_3_2_solutions = [
    {
        id: 'e232-mc1',
        answer: 0,
        explanation: '<strong>Correcto.</strong> La especificación (<code>PACKAGE</code>) actúa como un contrato o interfaz pública que describe los subprogramas, tipos y constantes disponibles. El cuerpo (<code>PACKAGE BODY</code>) contiene la lógica ejecutable y puede incluir funciones y variables privadas que no son visibles desde el exterior.',
        fullSolution: 'Esta separación estricta entre el contrato (interfaz) y la implementación es el pilar de la modularidad y el encapsulamiento en Oracle Database.'
    },
    {
        id: 'e232-mc2',
        answer: 0,
        explanation: '<strong>Correcto.</strong> El estado de un paquete se almacena en la PGA (<em>Program Global Area</em>) de cada sesión de usuario. Las variables mantienen su valor durante múltiples ejecuciones mientras la sesión permanezca abierta, y son totalmente privadas e independientes entre distintos usuarios conectados.',
        fullSolution: 'Al desconectarse de la base de datos o ejecutar <code>DBMS_SESSION.RESET_PACKAGE</code>, la memoria de las variables del paquete se reinicializa.'
    },
    {
        id: 'e232-mc3',
        answer: 0,
        explanation: '<strong>Correcto.</strong> Esta es una de las mayores ventajas arquitectónicas de los paquetes: los objetos dependientes (como procedimientos, triggers o aplicaciones) dependen de la <strong>especificación</strong>, no del cuerpo. Si modificas y recompilas el <code>PACKAGE BODY</code>, ningún objeto dependiente pasa al estado <code>INVALID</code>.',
        fullSolution: 'En contraste, si usaras procedimientos independientes sueltos, modificar uno causaría una reacción en cadena invalidando todos los objetos dependientes en el esquema.'
    },
    {
        id: 'e232-tf1',
        answer: false,
        explanation: '<strong>Falso.</strong> Todo elemento (variable, función o procedimiento) que se defina únicamente en el <code>PACKAGE BODY</code> y no esté listado en la especificación es estrictamente <strong>privado</strong>. Si intentas llamarlo desde fuera, Oracle lanzará el error de compilación <code>PLS-00302: component must be declared</code>.'
    },
    {
        id: 'e232-tf2',
        answer: true,
        explanation: '<strong>Verdadero.</strong> La sobrecarga exige que Oracle pueda resolver a qué subprograma llamar en base a los argumentos pasados (número o tipos de datos). Dos funciones con los mismos argumentos pero distinto tipo de retorno no pueden distinguirse al momento de la invocación, por lo que Oracle rechaza esa compilación.'
    },
    {
        id: 'e232-fill1',
        answers: [
            ['PACKAGE', 'PACKAGE AS'],
            ['CONSTANT NUMBER', 'CONSTANT'],
            ['END pkg_gestion_eventos', 'END', 'END;']
        ],
        explanation: 'La especificación se inicia con <code>PACKAGE</code>, la constante se define con <code>CONSTANT NUMBER</code> y se cierra con <code>END pkg_gestion_eventos</code> (o simplemente <code>END</code>).',
        fullSolution: '<pre>CREATE OR REPLACE PACKAGE pkg_gestion_eventos AS\n    -- Constante pública de comisión (12%)\n    c_comision CONSTANT NUMBER := 0.12;\n\n    -- Firma pública de cancelación\n    PROCEDURE cancelar_evento(p_evento_id IN NUMBER);\nEND pkg_gestion_eventos;\n/</pre>'
    },
    {
        id: 'e232-fill2',
        answers: [
            ['PACKAGE BODY', 'BODY'],
            ['BEGIN']
        ],
        explanation: 'El cuerpo se declara con <code>CREATE OR REPLACE PACKAGE BODY</code> y el bloque de inicialización opcional que se ejecuta al inicio de la sesión comienza con <code>BEGIN</code> al final del cuerpo.',
        fullSolution: '<pre>CREATE OR REPLACE PACKAGE BODY pkg_gestion_eventos AS\n\n    PROCEDURE cancelar_evento(p_evento_id IN NUMBER) IS\n    BEGIN\n        UPDATE EVENTO SET estado = \'CANCELADO\' WHERE evento_id = p_evento_id;\n    END cancelar_evento;\n\nBEGIN\n    -- Inicialización de auditoría de sesión\n    DBMS_OUTPUT.PUT_LINE(\'Paquete pkg_gestion_eventos inicializado en la sesión.\');\nEND pkg_gestion_eventos;\n/</pre>'
    },
    {
        id: 'e232-err1',
        answer: 7, // Línea índice 7: PROCEDURE emitir(p_reserva_id NUMBER) IS
        explanation: '<strong>Error en la línea 8 (índice 7):</strong> La especificación declaró <code>PROCEDURE emitir(p_reserva_id NUMBER, p_admin_id NUMBER);</code> con dos parámetros, pero en el cuerpo se definió solo con uno (<code>p_reserva_id NUMBER</code>). Ambas firmas deben coincidir con exactitud.',
        fullSolution: 'Para solucionarlo, la cabecera en el BODY debe incluir el segundo parámetro:<pre>PROCEDURE emitir(\n    p_reserva_id NUMBER,\n    p_admin_id   NUMBER\n) IS\nBEGIN\n    DBMS_OUTPUT.PUT_LINE(\'Emitiendo reserva: \' || p_reserva_id);\nEND emitir;</pre>'
    },
    {
        id: 'e232-err2',
        answer: 4, // Línea índice 4: BEGIN
        explanation: '<strong>Error conceptual en la línea 5 (índice 4):</strong> La especificación de un paquete (<code>PACKAGE</code>) solo admite declaraciones (firmas, tipos, variables, excepciones). <strong>No puede contener bloques ejecutables <code>BEGIN ... END</code></strong>. El código de inicialización y las implementaciones corresponden exclusivamente al <code>PACKAGE BODY</code>.',
        fullSolution: 'En la especificación únicamente se declaran los componentes públicos:<pre>CREATE OR REPLACE PACKAGE pkg_liquidaciones AS\n    c_iva CONSTANT NUMBER := 0.19;\n    g_recaudacion_total NUMBER;\n    FUNCTION calcular_iva(p_monto NUMBER) RETURN NUMBER;\nEND pkg_liquidaciones;\n/</pre>'
    },
    {
        id: 'e232-ws1',
        explanation: '<strong>¡Sopa de letras completada con éxito!</strong> Has reforzado los 5 pilares arquitectónicos de los Paquetes PL/SQL.',
        fullSolution: `
            <h4>Términos Clave de Paquetes en Oracle:</h4>
            <table>
                <tr><th>Término</th><th>Orientación</th><th>Definición Arquitectónica</th></tr>
                <tr><td><strong>PACKAGE</strong></td><td>Fila 1 (Horizontal)</td><td>Estructura modular del esquema que encapsula objetos relacionados.</td></tr>
                <tr><td><strong>BODY</strong></td><td>Fila 3 (Horizontal)</td><td>Cuerpo que contiene la lógica interna de subprogramas y elementos privados.</td></tr>
                <tr><td><strong>SPEC</strong></td><td>Fila 5 (Horizontal)</td><td>Especificación: interfaz pública que actúa como contrato del paquete.</td></tr>
                <tr><td><strong>OVERLOAD</strong></td><td>Fila 7 (Horizontal)</td><td>Sobrecarga de subprogramas con el mismo nombre y diferentes firmas.</td></tr>
                <tr><td><strong>SESSION</strong></td><td>Fila 9 (Horizontal)</td><td>Ámbito de persistencia en memoria PGA de las variables del paquete.</td></tr>
            </table>
        `
    },
    {
        id: 'e232-prop1',
        explanation: 'Este ejercicio implementa un paquete completo para la administración de eventos en Punto Ticket, demostrando el uso de subprogramas privados y auditoría.',
        fullSolution: `<pre>-- ============================================================
-- 1. ESPECIFICACIÓN DEL PAQUETE
-- ============================================================
CREATE OR REPLACE PACKAGE pkg_gestion_eventos AS
    -- Constante pública de comisión por servicio (12%)
    c_comision_servicio CONSTANT NUMBER := 0.12;

    -- Función pública: total recaudado por evento
    FUNCTION obtener_recaudacion(p_evento_id IN NUMBER) RETURN NUMBER;

    -- Procedimiento público: actualizar precio de localidad
    PROCEDURE actualizar_precio_localidad(
        p_localidad_id IN NUMBER,
        p_nuevo_precio IN NUMBER,
        p_admin_id     IN NUMBER
    );
END pkg_gestion_eventos;
/

-- ============================================================
-- 2. CUERPO DEL PAQUETE (PACKAGE BODY)
-- ============================================================
CREATE OR REPLACE PACKAGE BODY pkg_gestion_eventos AS

    -- SUBPROGRAMA PRIVADO: No visible fuera del paquete
    PROCEDURE validar_evento_activo(p_evento_id IN NUMBER) IS
        v_estado VARCHAR2(20);
    BEGIN
        SELECT estado INTO v_estado
        FROM EVENTO
        WHERE evento_id = p_evento_id;

        IF v_estado IN ('CANCELADO', 'REALIZADO') THEN
            RAISE_APPLICATION_ERROR(-20040, 
                'Operación rechazada: El evento se encuentra ' || v_estado);
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20041, 'Evento no encontrado: ' || p_evento_id);
    END validar_evento_activo;

    -- IMPLEMENTACIÓN: Función de recaudación
    FUNCTION obtener_recaudacion(p_evento_id IN NUMBER) RETURN NUMBER IS
        v_total NUMBER;
    BEGIN
        SELECT NVL(SUM(t.precio_pagado), 0)
        INTO v_total
        FROM TICKET t
        JOIN RESERVA_TEMPORAL rt ON rt.reserva_id = t.reserva_id
        JOIN LOCALIDAD_EVENTO le ON le.localidad_evento_id = rt.localidad_evento_id
        WHERE le.evento_id = p_evento_id
          AND t.estado != 'ANULADO';

        RETURN v_total;
    END obtener_recaudacion;

    -- IMPLEMENTACIÓN: Procedimiento de actualización de precio
    PROCEDURE actualizar_precio_localidad(
        p_localidad_id IN NUMBER,
        p_nuevo_precio IN NUMBER,
        p_admin_id     IN NUMBER
    ) IS
        v_evento_id       NUMBER;
        v_precio_anterior NUMBER;
    BEGIN
        IF p_nuevo_precio &lt;= 0 THEN
            RAISE_APPLICATION_ERROR(-20042, 'El precio debe ser estrictamente mayor a 0');
        END IF;

        -- Obtener datos actuales de la localidad
        SELECT evento_id, precio
        INTO v_evento_id, v_precio_anterior
        FROM LOCALIDAD_EVENTO
        WHERE localidad_evento_id = p_localidad_id;

        -- Llamar a la función privada para validar el estado del evento
        validar_evento_activo(v_evento_id);

        -- Actualizar precio en LOCALIDAD_EVENTO
        UPDATE LOCALIDAD_EVENTO
        SET precio = p_nuevo_precio
        WHERE localidad_evento_id = p_localidad_id;

        -- Registrar cambio en la tabla de auditoría LOG_CAMBIO_PRECIO
        INSERT INTO LOG_CAMBIO_PRECIO (
            localidad_evento_id,
            precio_anterior,
            precio_nuevo,
            administrador_id
        ) VALUES (
            p_localidad_id,
            v_precio_anterior,
            p_nuevo_precio,
            p_admin_id
        );

        DBMS_OUTPUT.PUT_LINE('Precio de localidad #' || p_localidad_id || 
            ' actualizado de $' || v_precio_anterior || ' a $' || p_nuevo_precio);
    END actualizar_precio_localidad;

END pkg_gestion_eventos;
/

-- ============================================================
-- 3. BLOQUE ANÓNIMO DE PRUEBA
-- ============================================================
DECLARE
    v_rec NUMBER;
BEGIN
    -- Prueba de función de recaudación
    v_rec := pkg_gestion_eventos.obtener_recaudacion(1);
    DBMS_OUTPUT.PUT_LINE('Recaudación actual evento 1: $' || v_rec);

    -- Prueba de actualización de precio
    pkg_gestion_eventos.actualizar_precio_localidad(
        p_localidad_id =&gt; 1,
        p_nuevo_precio =&gt; 55000,
        p_admin_id     =&gt; 1
    );

    ROLLBACK; -- Mantiene la base de datos intacta
    DBMS_OUTPUT.PUT_LINE('Prueba ejecutada con ROLLBACK exitoso.');
END;
/</pre>`
    },
    {
        id: 'e232-prop2',
        explanation: 'Este ejercicio demuestra el uso de variables globales de sesión en un paquete para auditar montos acumulados por usuario en Punto Ticket.',
        fullSolution: `<pre>-- ============================================================
-- 1. ESPECIFICACIÓN DEL PAQUETE
-- ============================================================
CREATE OR REPLACE PACKAGE pkg_postventa_ticket AS
    -- Variable de sesión: Acumula el dinero devuelto en la sesión activa
    g_monto_anulado_sesion NUMBER := 0;

    -- Excepción pública
    e_ticket_no_anulable EXCEPTION;

    -- Procedimiento para anular un ticket
    PROCEDURE anular_ticket(
        p_ticket_id IN NUMBER,
        p_motivo    IN VARCHAR2,
        p_admin_id  IN NUMBER
    );

    -- Función para consultar el total acumulado en la sesión
    FUNCTION obtener_total_anulado_sesion RETURN NUMBER;
END pkg_postventa_ticket;
/

-- ============================================================
-- 2. CUERPO DEL PAQUETE (PACKAGE BODY)
-- ============================================================
CREATE OR REPLACE PACKAGE BODY pkg_postventa_ticket AS

    -- IMPLEMENTACIÓN: Anulación de ticket
    PROCEDURE anular_ticket(
        p_ticket_id IN NUMBER,
        p_motivo    IN VARCHAR2,
        p_admin_id  IN NUMBER
    ) IS
        v_estado         VARCHAR2(20);
        v_precio_pagado  NUMBER(12,2);
        v_transaccion_id NUMBER;
        v_reserva_id     NUMBER;
        v_localidad_id   NUMBER;
    BEGIN
        -- Consultar estado y monto del ticket
        SELECT estado, precio_pagado, transaccion_id, reserva_id
        INTO v_estado, v_precio_pagado, v_transaccion_id, v_reserva_id
        FROM TICKET
        WHERE ticket_id = p_ticket_id;

        IF v_estado != 'EMITIDO' THEN
            RAISE e_ticket_no_anulable;
        END IF;

        -- 1. Actualizar estado del ticket
        UPDATE TICKET
        SET estado = 'ANULADO'
        WHERE ticket_id = p_ticket_id;

        -- 2. Acumular en variable de sesión
        g_monto_anulado_sesion := g_monto_anulado_sesion + v_precio_pagado;

        -- 3. Registrar en LOG_ANULACIONES
        INSERT INTO LOG_ANULACIONES (
            ticket_id,
            transaccion_id,
            reserva_id,
            motivo,
            administrador_id
        ) VALUES (
            p_ticket_id,
            v_transaccion_id,
            v_reserva_id,
            p_motivo,
            p_admin_id
        );

        -- 4. Reponer stock en LOCALIDAD_EVENTO
        SELECT localidad_evento_id INTO v_localidad_id
        FROM RESERVA_TEMPORAL
        WHERE reserva_id = v_reserva_id;

        UPDATE LOCALIDAD_EVENTO
        SET stock_disponible = stock_disponible + 1
        WHERE localidad_evento_id = v_localidad_id;

        DBMS_OUTPUT.PUT_LINE('Ticket #' || p_ticket_id || ' anulado. Reembolso: $' || v_precio_pagado);

    EXCEPTION
        WHEN e_ticket_no_anulable THEN
            RAISE_APPLICATION_ERROR(-20050, 
                'No se puede anular el ticket #' || p_ticket_id || ' porque está ' || v_estado);
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20051, 'Ticket #' || p_ticket_id || ' inexistente.');
    END anular_ticket;

    -- IMPLEMENTACIÓN: Consulta del acumulador de sesión
    FUNCTION obtener_total_anulado_sesion RETURN NUMBER IS
    BEGIN
        RETURN g_monto_anulado_sesion;
    END obtener_total_anulado_sesion;

-- 3. BLOQUE DE INICIALIZACIÓN (Se ejecuta 1 sola vez por sesión)
BEGIN
    g_monto_anulado_sesion := 0;
    DBMS_OUTPUT.PUT_LINE('[SESIÓN] Turno de postventa iniciado con $0 anulados.');
END pkg_postventa_ticket;
/

-- ============================================================
-- 4. BLOQUE ANÓNIMO DE PRUEBA
-- ============================================================
DECLARE
    v_total_devuelto NUMBER;
BEGIN
    -- Anular ticket de prueba 1
    pkg_postventa_ticket.anular_ticket(
        p_ticket_id =&gt; 1,
        p_motivo    =&gt; 'Devolución solicitada por cliente antes de 48 hrs',
        p_admin_id  =&gt; 1
    );

    -- Consultar acumulador de sesión
    v_total_devuelto := pkg_postventa_ticket.obtener_total_anulado_sesion();
    DBMS_OUTPUT.PUT_LINE('Monto acumulado devuelto en este turno: $' || v_total_devuelto);

    ROLLBACK; -- Mantiene la base de datos intacta
    DBMS_OUTPUT.PUT_LINE('Prueba finalizada con ROLLBACK.');
END;
/</pre>`
    }
];
