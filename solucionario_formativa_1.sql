/* ==============================================================================
   TALLER DE BASES DE DATOS (BDY1103) - EVALUACIÓN FORMATIVA N° 1: BLOQUES PL/SQL
   SOLUCIONARIO EJECUTABLE DOCENTE - ORACLE DATABASE 19c
   Base de Datos: clon_punto_ticket.sql
   ==============================================================================
   INSTRUCCIONES DE USO:
   1. Conectarse al usuario con el esquema clon_punto_ticket cargado.
   2. Ejecutar 'SET SERVEROUTPUT ON;' en su hoja de trabajo.
   3. Cada bloque puede ejecutarse de manera independiente seleccionándolo
      y presionando F5 / Ctrl+Enter en SQL Developer o VS Code.
   ============================================================================== */

SET SERVEROUTPUT ON SIZE UNLIMITED;

PROMPT ==============================================================================
PROMPT INICIANDO EJECUCIÓN DE PRUEBAS - SOLUCIONARIO FORMATIVA 1
PROMPT ==============================================================================


/* ==============================================================================
   EJERCICIO 1: BLOQUE CON RECORD Y MANEJO DE EXCEPCIONES (TABLA RECINTO)
   Versión Canónica: RECORD personalizado con tipos anclados (%TYPE)
   CASO 1: Éxito con ID existente (recinto_id = 1, Movistar Arena)
   ============================================================================== */
PROMPT 
PROMPT >>> EJECUTANDO EJERCICIO 1 [CASO DE ÉXITO: RECINTO ID = 1]...

DECLARE
    -- 1. Declaración del tipo RECORD personalizado
    TYPE r_recinto_info IS RECORD (
        nombre          RECINTO.nombre%TYPE,
        direccion       RECINTO.direccion%TYPE,
        ciudad          RECINTO.ciudad%TYPE,
        capacidad_total RECINTO.capacidad_total%TYPE
    );

    -- 2. Declaración de la variable basada en el tipo RECORD
    v_recinto r_recinto_info;

    -- 3. Variable de entrada: ID existente en la base de datos
    p_recinto_id RECINTO.recinto_id%TYPE := 1;

BEGIN
    -- 4. Consulta directa cargando los datos en la estructura del RECORD
    SELECT nombre, direccion, ciudad, capacidad_total
    INTO v_recinto
    FROM RECINTO
    WHERE recinto_id = p_recinto_id;

    -- 5. Impresión de resultados formateados
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('DATOS DEL RECINTO [ID: ' || p_recinto_id || ']');
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Nombre Recinto : ' || v_recinto.nombre);
    DBMS_OUTPUT.PUT_LINE('Dirección      : ' || v_recinto.direccion);
    DBMS_OUTPUT.PUT_LINE('Ciudad         : ' || v_recinto.ciudad);
    DBMS_OUTPUT.PUT_LINE('Capacidad Total: ' || TO_CHAR(v_recinto.capacidad_total, 'FM999,999') || ' personas');
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR [NO_DATA_FOUND]: El recinto ID ' || p_recinto_id || ' no existe en la base de datos.');
    WHEN TOO_MANY_ROWS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR [TOO_MANY_ROWS]: La consulta retornó más de un recinto para el ID ' || p_recinto_id || '.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR INESPERADO: [' || SQLCODE || '] - ' || SQLERRM);
END;
/


/* ==============================================================================
   EJERCICIO 1 (TEST EXCEPCIÓN): ID INEXISTENTE (recinto_id = 999)
   Debe disparar y capturar limpiamente NO_DATA_FOUND.
   ============================================================================== */
PROMPT 
PROMPT >>> EJECUTANDO EJERCICIO 1 [CASO DE EXCEPCIÓN: RECINTO ID = 999]...

DECLARE
    TYPE r_recinto_info IS RECORD (
        nombre          RECINTO.nombre%TYPE,
        direccion       RECINTO.direccion%TYPE,
        ciudad          RECINTO.ciudad%TYPE,
        capacidad_total RECINTO.capacidad_total%TYPE
    );
    v_recinto r_recinto_info;
    p_recinto_id RECINTO.recinto_id%TYPE := 999; -- ID que no existe
BEGIN
    SELECT nombre, direccion, ciudad, capacidad_total
    INTO v_recinto
    FROM RECINTO
    WHERE recinto_id = p_recinto_id;

    DBMS_OUTPUT.PUT_LINE('Recinto: ' || v_recinto.nombre);

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
        DBMS_OUTPUT.PUT_LINE('ALERTA CONTROLADA: El recinto ID ' || p_recinto_id || ' no existe en la BD (NO_DATA_FOUND capturado con éxito).');
        DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
    WHEN TOO_MANY_ROWS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: Múltiples filas retornadas.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR INESPERADO: [' || SQLCODE || '] - ' || SQLERRM);
END;
/


/* ==============================================================================
   EJERCICIO 1 (VARIANTE ESTUDIANTIL): Uso de RECINTO%ROWTYPE
   NOTA DOCENTE: Considerado 100% válido y con puntaje completo.
   ============================================================================== */
PROMPT 
PROMPT >>> EJECUTANDO EJERCICIO 1 [VARIANTE CON %ROWTYPE - 100% VÁLIDA]...

DECLARE
    -- En lugar de definir campos individuales, se vincula al registro completo de la tabla
    v_recinto RECINTO%ROWTYPE;
    p_recinto_id RECINTO.recinto_id%TYPE := 2; -- Estadio Nacional
BEGIN
    SELECT *
    INTO v_recinto
    FROM RECINTO
    WHERE recinto_id = p_recinto_id;

    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('[%ROWTYPE] Recinto: ' || v_recinto.nombre || ' | Capacidad: ' || v_recinto.capacidad_total);
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: Recinto inexistente.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: [' || SQLCODE || '] - ' || SQLERRM);
END;
/


/* ==============================================================================
   EJERCICIO 2 [OPCIONAL / BONIFICACIÓN]: VARRAY Y MANEJO DE EXCEPCIONES
   NOTA DOCENTE: Este ejercicio fue eliminado de la pauta obligatoria.
   Si un estudiante lo entrega, se califica como bonificación (décimas extra).
   ============================================================================== */
PROMPT 
PROMPT >>> EJECUTANDO EJERCICIO 2 [VARRAY - OPCIONAL / BONUS DOCENTE]...

DECLARE
    -- 1. Declaración del tipo VARRAY de capacidad 4
    TYPE t_bancos_varray IS VARRAY(4) OF CONVENIO_BANCO.banco%TYPE;
    v_bancos t_bancos_varray;

BEGIN
    -- 2. Carga masiva con BULK COLLECT limitando a un máximo de 4
    SELECT banco
    BULK COLLECT INTO v_bancos
    FROM (
        SELECT DISTINCT banco
        FROM CONVENIO_BANCO
        WHERE activo = 'S'
        ORDER BY banco ASC
    )
    WHERE ROWNUM <= 4;

    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('BANCOS CON CONVENIO ACTIVO REGISTRADOS EN VARRAY(4)');
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');

    -- 3. Bucle FOR seguro usando el método .COUNT
    FOR i IN 1..v_bancos.COUNT LOOP
        DBMS_OUTPUT.PUT_LINE('Convenio Banco #' || i || ': ' || v_bancos(i));
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('Total elementos cargados: ' || v_bancos.COUNT || ' de ' || v_bancos.LIMIT);
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');

EXCEPTION
    WHEN SUBSCRIPT_BEYOND_COUNT THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: Índice fuera del rango actual de la colección.');
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: No se encontraron registros de convenios.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR INESPERADO: [' || SQLCODE || '] - ' || SQLERRM);
END;
/


/* ==============================================================================
   EJERCICIO 3: CURSOR EXPLÍCITO Y CIERRE SEGURO EN EXCEPCIONES
   Tablas: TICKET, TRANSACCION_PAGO, RESERVA_TEMPORAL, CLIENTE
   Demuestra control manual OPEN/FETCH/CLOSE y liberación segura de memoria.
   ============================================================================== */
PROMPT 
PROMPT >>> EJECUTANDO EJERCICIO 3 [CURSOR EXPLÍCITO Y CIERRE SEGURO]...

DECLARE
    -- 1. Declaración del cursor explícito con JOIN relacional
    CURSOR c_tickets_emitidos IS
        SELECT t.codigo_ticket,
               c.nombre || ' ' || c.apellido AS nombre_cliente,
               t.precio_pagado,
               tp.metodo_pago
        FROM TICKET t
        JOIN TRANSACCION_PAGO tp ON t.transaccion_id = tp.transaccion_id
        JOIN RESERVA_TEMPORAL rt ON t.reserva_id = rt.reserva_id
        JOIN CLIENTE c          ON rt.cliente_id = c.cliente_id
        WHERE t.estado = 'EMITIDO'
        ORDER BY t.ticket_id ASC;

    -- 2. Variable de registro tipada según el cursor
    v_ticket c_tickets_emitidos%ROWTYPE;

    -- Acumuladores de resumen
    v_contador        NUMBER := 0;
    v_total_recaudado NUMBER(12,2) := 0;

BEGIN
    -- 3. Apertura explícita
    OPEN c_tickets_emitidos;

    DBMS_OUTPUT.PUT_LINE('================================================================================');
    DBMS_OUTPUT.PUT_LINE('               REPORTE AUDITADO DE TICKETS EMITIDOS (PUNTOTICKET)');
    DBMS_OUTPUT.PUT_LINE('================================================================================');

    -- 4. Bucle clásico con FETCH y control de término %NOTFOUND
    LOOP
        FETCH c_tickets_emitidos INTO v_ticket;
        EXIT WHEN c_tickets_emitidos%NOTFOUND;

        v_contador := v_contador + 1;
        v_total_recaudado := v_total_recaudado + v_ticket.precio_pagado;

        DBMS_OUTPUT.PUT_LINE(
            '[' || LPAD(v_contador, 2, '0') || '] ' ||
            'Código: '  || RPAD(v_ticket.codigo_ticket, 22) || ' | ' ||
            'Cliente: ' || RPAD(v_ticket.nombre_cliente, 20) || ' | ' ||
            'Pago: '    || RPAD(v_ticket.metodo_pago, 16) || ' | ' ||
            'Monto: $'  || TO_CHAR(v_ticket.precio_pagado, 'FM999,999')
        );
    END LOOP;

    -- 5. Cierre explícito
    CLOSE c_tickets_emitidos;

    DBMS_OUTPUT.PUT_LINE('================================================================================');
    DBMS_OUTPUT.PUT_LINE('Total Tickets Procesados : ' || v_contador);
    DBMS_OUTPUT.PUT_LINE('Recaudación Total        : $' || TO_CHAR(v_total_recaudado, 'FM999,999'));
    DBMS_OUTPUT.PUT_LINE('================================================================================');

EXCEPTION
    WHEN CURSOR_ALREADY_OPEN THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: El cursor ya se encontraba abierto.');
        IF c_tickets_emitidos%ISOPEN THEN
            CLOSE c_tickets_emitidos;
        END IF;

    WHEN INVALID_CURSOR THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: Operación inválida sobre el cursor.');
        IF c_tickets_emitidos%ISOPEN THEN
            CLOSE c_tickets_emitidos;
        END IF;

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR CRÍTICO: [' || SQLCODE || '] - ' || SQLERRM);
        -- Requerimiento docente clave: Verificación defensiva de liberación de cursor
        IF c_tickets_emitidos%ISOPEN THEN
            CLOSE c_tickets_emitidos;
            DBMS_OUTPUT.PUT_LINE('Notificación: El cursor c_tickets_emitidos fue cerrado de forma segura.');
        END IF;
END;
/


/* ==============================================================================
   EJERCICIO 4: CURSOR CON PARÁMETRO Y EXCEPCIÓN DEFINIDA POR EL USUARIO
   Tablas: EVENTO, PRODUCTORA
   CASO 1: Éxito con productora que posee eventos (ID = 1, Bizarro)
   ============================================================================== */
PROMPT 
PROMPT >>> EJECUTANDO EJERCICIO 4 [CASO DE ÉXITO: PRODUCTORA ID = 1 (CON EVENTOS)]...

DECLARE
    -- 1. Declaración de la excepción de usuario
    e_sin_eventos_vigentes EXCEPTION;

    -- 2. Declaración del cursor explícito con parámetro formal
    CURSOR c_eventos_productora (p_productora_id NUMBER) IS
        SELECT e.nombre AS nombre_evento,
               e.fecha_evento,
               e.estado
        FROM EVENTO e
        WHERE e.productora_id = p_productora_id
        ORDER BY e.fecha_evento ASC;

    -- 3. Parámetro de prueba: Productora ID = 1 (Bizarro Live Entertainment)
    v_productora_id     PRODUCTORA.productora_id%TYPE := 1;
    v_nombre_productora PRODUCTORA.nombre_fantasia%TYPE;
    v_contador_eventos  NUMBER := 0;

BEGIN
    -- Consulta opcional para mostrar la razón social
    BEGIN
        SELECT nombre_fantasia
        INTO v_nombre_productora
        FROM PRODUCTORA
        WHERE productora_id = v_productora_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_nombre_productora := 'Productora Desconocida';
    END;

    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('CARTELERA DE EVENTOS - ' || UPPER(v_nombre_productora));
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');

    -- 4. Bucle FOR con el cursor parametrizado
    FOR r_evento IN c_eventos_productora(v_productora_id) LOOP
        v_contador_eventos := v_contador_eventos + 1;

        DBMS_OUTPUT.PUT_LINE(
            '[' || v_contador_eventos || '] Evento: ' || RPAD(r_evento.nombre_evento, 38) ||
            ' | Fecha: ' || TO_CHAR(r_evento.fecha_evento, 'DD/MM/YYYY HH24:MI') ||
            ' | Estado: ' || r_evento.estado
        );
    END LOOP;

    -- 5. Disparo de la excepción de negocio si no hay eventos
    IF v_contador_eventos = 0 THEN
        RAISE e_sin_eventos_vigentes;
    END IF;

    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Total eventos vigentes: ' || v_contador_eventos);
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');

EXCEPTION
    WHEN e_sin_eventos_vigentes THEN
        DBMS_OUTPUT.PUT_LINE('ALERTA: La productora no registra eventos vigentes en cartelera.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR INESPERADO: [' || SQLCODE || '] - ' || SQLERRM);
END;
/


/* ==============================================================================
   EJERCICIO 4 (TEST EXCEPCIÓN): Productora sin eventos o inexistente (ID = 999)
   Debe lanzar y atrapar e_sin_eventos_vigentes.
   ============================================================================== */
PROMPT 
PROMPT >>> EJECUTANDO EJERCICIO 4 [CASO DE EXCEPCIÓN: PRODUCTORA ID = 999 (SIN EVENTOS)]...

DECLARE
    e_sin_eventos_vigentes EXCEPTION;

    CURSOR c_eventos_productora (p_productora_id NUMBER) IS
        SELECT e.nombre AS nombre_evento,
               e.fecha_evento,
               e.estado
        FROM EVENTO e
        WHERE e.productora_id = p_productora_id
        ORDER BY e.fecha_evento ASC;

    v_productora_id    PRODUCTORA.productora_id%TYPE := 999; -- Sin eventos
    v_contador_eventos NUMBER := 0;

BEGIN
    FOR r_evento IN c_eventos_productora(v_productora_id) LOOP
        v_contador_eventos := v_contador_eventos + 1;
        DBMS_OUTPUT.PUT_LINE('Evento: ' || r_evento.nombre_evento);
    END LOOP;

    -- Al ser 0, se dispara la excepción personalizada
    IF v_contador_eventos = 0 THEN
        RAISE e_sin_eventos_vigentes;
    END IF;

EXCEPTION
    WHEN e_sin_eventos_vigentes THEN
        DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');
        DBMS_OUTPUT.PUT_LINE('ALERTA: La productora no registra eventos vigentes en cartelera.');
        DBMS_OUTPUT.PUT_LINE('(Excepción de usuario e_sin_eventos_vigentes capturada correctamente)');
        DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: [' || SQLCODE || '] - ' || SQLERRM);
END;
/

PROMPT 
PROMPT ==============================================================================
PROMPT FIN DE EJECUCIÓN - TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO
PROMPT ==============================================================================
