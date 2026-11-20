// recuperativa_u1_data.js — Evaluación Recuperativa Unidad 1 (Solo Estudiante: 2 de 6 problemas + Defensa Línea por Línea)

const recuperativa_u1_data = {
    id: 'eval-recup-u1',
    type: 'recuperativa',
    badge: 'Recuperativa Unidad 1',
    title: 'Evaluación Recuperativa — Unidad 1: Oracle PL/SQL',
    subtitle: 'Elige 2 de 6 problemas sobre Punto Ticket (clon_punto_ticket.sql), implementa 2 bloques anónimos y defiéndelos línea por línea.',
    maxSelection: 2,
    weights: [
        {
            title: 'Código Funcional (2 Bloques)',
            percentage: '10%',
            type: 'Individual',
            timing: '5 pts por bloque (10 pts total)',
            icon: 'ph-code',
            color: '#2563eb',
            bgColor: '#eff6ff',
            desc: 'Compilación y ejecución limpia de tus 2 bloques PL/SQL sobre clon_punto_ticket.sql, integrando las 4 estructuras y dejando la BD intacta con ROLLBACK.'
        },
        {
            title: 'Defensa Oral — Bloque 1',
            percentage: '45%',
            type: 'Individual',
            timing: '45 pts · Recorrido línea por línea',
            icon: 'ph-microphone-stage',
            color: '#7c3aed',
            bgColor: '#f5f3ff',
            desc: 'Explicación oral línea por línea del primer bloque elegido: qué hace cada declaración, cursor, ciclo y excepción, más verificación de autoría en vivo.'
        },
        {
            title: 'Defensa Oral — Bloque 2',
            percentage: '45%',
            type: 'Individual',
            timing: '45 pts · Recorrido línea por línea',
            icon: 'ph-chats-circle',
            color: '#0d9488',
            bgColor: '#f0fdfa',
            desc: 'Explicación oral línea por línea del segundo bloque elegido, justificando decisiones técnicas y respondiendo escenarios contrafactuales sobre tu código.'
        }
    ],
    rules: [
        {
            icon: 'ph-list-checks',
            title: 'Elige 2 de 6 Problemas',
            text: 'Revisa los 6 problemas propuestos en el catálogo y marca exactamente 2 para construir 2 bloques anónimos PL/SQL independientes.'
        },
        {
            icon: 'ph-stack',
            title: '4 Contenidos Obligatorios en Cada Bloque',
            text: 'Cada bloque debe integrar RECORD, VARRAY, Cursores Explícitos y Manejo de Excepciones aplicados sobre la base de datos Punto Ticket.'
        },
        {
            icon: 'ph-arrow-counter-clockwise',
            title: 'Integridad de la Base de Datos (ROLLBACK)',
            text: 'Todo bloque que realice operaciones DML (INSERT, UPDATE o DELETE) debe ejecutar ROLLBACK al final y dentro de sus manejadores EXCEPTION.'
        },
        {
            icon: 'ph-shield-warning',
            title: 'Regla de Autoría (Defensa Línea por Línea)',
            text: 'Durante la defensa solo podrás mirar tu archivo .sql en SQL Developer (sin apuntes ni asistentes). Toda línea escrita que no puedas explicar con precisión será calificada con 0 puntos en esa dimensión.'
        }
    ],
    problems: [
        {
            id: 1,
            code: 'P1',
            title: 'Auditoría de Transacciones por Método de Pago',
            icon: 'ph-credit-card',
            color: '#2563eb',
            tables: ['TRANSACCION_PAGO', 'RESERVA_TEMPORAL', 'CLIENTE', 'CONVENIO_BANCO'],
            summary: 'Audita los pagos registrados en Punto Ticket agrupándolos por método de pago, acumulando recaudación aprobada y controlando rechazos o métodos sin movimientos.',
            requirements: [
                {
                    label: 'VARRAY',
                    text: 'Declara un <code>VARRAY(4)</code> con los métodos de pago: <code>\'TARJETA_CREDITO\'</code>, <code>\'TARJETA_DEBITO\'</code>, <code>\'WEBPAY\'</code> y <code>\'TRANSFERENCIA\'</code>.'
                },
                {
                    label: 'RECORD',
                    text: 'Declara un tipo <code>RECORD</code> personalizado que almacene: nombre completo del cliente, nombre del banco del convenio (o <code>\'Sin convenio\'</code>), <code>monto_bruto</code>, <code>descuento</code>, <code>monto_final</code> y <code>estado</code> del pago.'
                },
                {
                    label: 'Cursor Explícito',
                    text: 'Crea un cursor explícito parametrizado por <code>p_metodo_pago</code> con <code>JOIN</code> entre <code>TRANSACCION_PAGO</code>, <code>RESERVA_TEMPORAL</code>, <code>CLIENTE</code> y <code>LEFT JOIN</code> con <code>CONVENIO_BANCO</code>. Recórrelo para cada elemento del <code>VARRAY</code> acumulando el total recaudado en pagos aprobados y mostrando <code>%ROWCOUNT</code>.'
                },
                {
                    label: 'Excepciones',
                    text: 'Declara y lanza la excepción personalizada <code>e_pago_rechazado</code> cuando <code>estado = \'RECHAZADO\'</code> (manejada dentro de un sub-bloque para informar sin detener el recorrido). Si un método no registra filas (<code>%ROWCOUNT = 0</code>, ej. <code>\'TRANSFERENCIA\'</code>), dispara <code>e_sin_movimientos</code>. Incluye <code>WHEN OTHERS</code> con <code>SQLCODE</code> y <code>SQLERRM</code>.'
                }
            ],
            starterTemplate: `-- Problema 1: Auditoria de Transacciones por Metodo de Pago
SET SERVEROUTPUT ON;

DECLARE
    -- 1. VARRAY(4) de metodos de pago

    -- 2. RECORD personalizado de transaccion

    -- 3. Cursor explicito parametrizado (p_metodo_pago VARCHAR2)

    -- 4. Variables auxiliares y excepciones personalizadas

BEGIN
    -- Recorre v_metodos y procesa cada pago con sub-bloques EXCEPTION
    NULL;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('[ERROR] ' || SQLCODE || ' - ' || SQLERRM);
END;
/`
        },
        {
            id: 2,
            code: 'P2',
            title: 'Campaña de Ajuste Dinámico de Precios por Stock',
            icon: 'ph-tag',
            color: '#7c3aed',
            tables: ['EVENTO', 'RECINTO', 'LOCALIDAD_EVENTO', 'LOG_CAMBIO_PRECIO'],
            summary: 'Simula una campaña masiva de rebaja y alza de precios según stock disponible usando cursores anidados, bloqueo FOR UPDATE, auditoría en log y reversión final.',
            requirements: [
                {
                    label: 'VARRAY',
                    text: 'Declara un <code>VARRAY(3)</code> con los estados de evento: <code>\'VENTA\'</code>, <code>\'PROGRAMADO\'</code> y <code>\'CANCELADO\'</code>.'
                },
                {
                    label: 'RECORD',
                    text: 'Declara un <code>RECORD</code> personalizado con <code>evento_id</code>, nombre del evento, nombre del recinto y <code>estado</code> usando <code>%TYPE</code>.'
                },
                {
                    label: 'Cursores Anidados + FOR UPDATE',
                    text: 'Cursor externo parametrizado <code>c_eventos(p_estado)</code> manejado con <code>OPEN / FETCH / EXIT WHEN / CLOSE</code> cargando en el <code>RECORD</code>. Cursor interno parametrizado <code>c_localidades(p_evento_id)</code> con <code>FOR UPDATE</code> sobre <code>LOCALIDAD_EVENTO</code>: en eventos <code>\'VENTA\'</code>, si <code>stock_disponible > 5000</code> rebaja 10% y si <code>stock_disponible < 3000</code> sube 5% usando <code>WHERE CURRENT OF</code>, registrando el cambio en <code>LOG_CAMBIO_PRECIO</code> (<code>administrador_id = 1</code>).'
                },
                {
                    label: 'Excepciones y Transacción',
                    text: 'Si el evento no está en estado <code>\'VENTA\'</code>, dispara <code>e_evento_no_habilitado</code> en un sub-bloque para omitirlo y continuar. Si <code>stock_disponible <= 0</code>, detén con <code>RAISE_APPLICATION_ERROR</code> en rango válido (<code>-20000</code> a <code>-20999</code>). Ejecuta <code>ROLLBACK;</code> al final y en <code>EXCEPTION</code>.'
                }
            ],
            starterTemplate: `-- Problema 2: Campana de Ajuste Dinamico de Precios por Stock
SET SERVEROUTPUT ON;

DECLARE
    -- 1. VARRAY(3) de estados de evento

    -- 2. RECORD personalizado de evento + recinto

    -- 3. Cursor externo c_eventos(p_estado VARCHAR2) y cursor interno c_localidades(p_evento_id NUMBER) FOR UPDATE

    -- 4. Variables auxiliares y excepcion personalizada

BEGIN
    -- Recorre estados, eventos y localidades aplicando WHERE CURRENT OF + LOG_CAMBIO_PRECIO
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('[ERROR] ' || SQLCODE || ' - ' || SQLERRM);
END;
/`
        },
        {
            id: 3,
            code: 'P3',
            title: 'Historial de Tickets por Cliente y Validación de Unicidad',
            icon: 'ph-ticket',
            color: '#0891b2',
            tables: ['CLIENTE', 'RESERVA_TEMPORAL', 'TRANSACCION_PAGO', 'TICKET'],
            summary: 'Emite el historial de tickets comprados para un listado de apellidos inicializado dinámicamente con .EXTEND y verifica el control de unicidad con DUP_VAL_ON_INDEX.',
            requirements: [
                {
                    label: 'VARRAY con .EXTEND',
                    text: 'Declara un <code>VARRAY(4)</code> inicializado vacío y poblado dinámicamente con <code>.EXTEND</code> conteniendo los apellidos: <code>\'Soto\'</code>, <code>\'Morales\'</code>, <code>\'Castillo\'</code> y <code>\'Rojas\'</code>.'
                },
                {
                    label: 'RECORD',
                    text: 'Declara un <code>RECORD</code> personalizado con <code>rut</code>, <code>nombre</code>, <code>apellido</code>, <code>codigo_ticket</code>, <code>precio_pagado</code> y <code>estado</code> del ticket.'
                },
                {
                    label: 'Cursor Explícito',
                    text: 'Declara un cursor explícito parametrizado por <code>p_apellido</code> uniendo <code>CLIENTE</code>, <code>RESERVA_TEMPORAL</code>, <code>TRANSACCION_PAGO</code> y <code>TICKET</code>, mostrando los tickets del cliente y el total encontrado mediante <code>%ROWCOUNT</code>.'
                },
                {
                    label: 'Excepciones',
                    text: 'Si un apellido no tiene tickets emitidos (<code>%ROWCOUNT = 0</code>), dispara <code>e_sin_tickets</code> dentro de un sub-bloque para informarlo y continuar. Al final del bloque, intenta insertar un cliente con el RUT duplicado <code>\'19.456.789-1\'</code> y captura <code>DUP_VAL_ON_INDEX</code> asegurando <code>ROLLBACK;</code>.'
                }
            ],
            starterTemplate: `-- Problema 3: Historial de Tickets por Cliente y Validacion de Unicidad
SET SERVEROUTPUT ON;

DECLARE
    -- 1. VARRAY(4) inicializado vacio para poblar con .EXTEND

    -- 2. RECORD personalizado de ticket

    -- 3. Cursor explicito parametrizado c_tickets(p_apellido VARCHAR2)

    -- 4. Excepcion personalizada e_sin_tickets

BEGIN
    -- Poblar VARRAY con .EXTEND, recorrer tickets y ejecutar prueba DUP_VAL_ON_INDEX
    ROLLBACK;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('[UNICIDAD] RUT duplicado detectado.');
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('[ERROR] ' || SQLCODE || ' - ' || SQLERRM);
END;
/`
        },
        {
            id: 4,
            code: 'P4',
            title: 'Auditoría de Capacidad de Recintos e Integridad Referencial',
            icon: 'ph-buildings',
            color: '#059669',
            tables: ['RECINTO', 'SECTOR_RECINTO', 'ASIENTO'],
            summary: 'Contrasta la capacidad total de cada recinto frente a la suma de sus sectores, cuenta asientos numerados y valida integridad referencial con PRAGMA EXCEPTION_INIT.',
            requirements: [
                {
                    label: 'VARRAY',
                    text: 'Declara un <code>VARRAY(3)</code> con los nombres de recintos: <code>\'Movistar Arena\'</code>, <code>\'Estadio Nacional\'</code> y <code>\'Arena Puerto Montt\'</code>.'
                },
                {
                    label: 'RECORD',
                    text: 'Declara un <code>RECORD</code> personalizado con <code>recinto_id</code>, <code>nombre_recinto</code>, <code>ciudad</code>, <code>capacidad_total</code> y <code>suma_sectores</code>.'
                },
                {
                    label: 'Cursor Parametrizado',
                    text: 'Para cada recinto del <code>VARRAY</code>, carga sus datos en el <code>RECORD</code> y recorre sus sectores con un cursor parametrizado <code>c_sectores(p_recinto_id)</code> mostrando nombre, <code>capacidad_maxima</code>, si es numerado y la cantidad de asientos registrados en <code>ASIENTO</code>, acumulando <code>suma_sectores</code>.'
                },
                {
                    label: 'Excepciones + PRAGMA',
                    text: 'Si un sector tiene <code>es_numerado = \'N\'</code>, dispara <code>e_sector_general</code> en un sub-bloque para emitir una alerta informativa sin detener el bucle. Al final intenta eliminar <code>\'Movistar Arena\'</code> de <code>RECINTO</code> y captura <code>ORA-02292</code> mediante <code>PRAGMA EXCEPTION_INIT</code>. Incluye <code>NO_DATA_FOUND</code>, <code>WHEN OTHERS</code> y <code>ROLLBACK;</code>.'
                }
            ],
            starterTemplate: `-- Problema 4: Auditoria de Capacidad de Recintos e Integridad Referencial
SET SERVEROUTPUT ON;

DECLARE
    -- 1. VARRAY(3) de recintos

    -- 2. RECORD de resumen de recinto

    -- 3. Cursor parametrizado c_sectores(p_recinto_id NUMBER)

    -- 4. Excepciones personalizadas y PRAGMA EXCEPTION_INIT(..., -2292)

BEGIN
    -- Auditar cada recinto, recorrer sectores y ejecutar DELETE controlado sobre Movistar Arena
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('[ERROR] ' || SQLCODE || ' - ' || SQLERRM);
END;
/`
        },
        {
            id: 5,
            code: 'P5',
            title: 'Evaluación de Convenios Bancarios por Productora',
            icon: 'ph-bank',
            color: '#d97706',
            tables: ['PRODUCTORA', 'EVENTO', 'CONVENIO_EVENTO', 'CONVENIO_BANCO'],
            summary: 'Recorre productoras con cursores anidados para auditar convenios bancarios activos por evento, alertando descuentos altos y capturando productoras inexistentes.',
            requirements: [
                {
                    label: 'VARRAY',
                    text: 'Declara un <code>VARRAY(4)</code> con los nombres de fantasía: <code>\'Bizarro Live Entertainment\'</code>, <code>\'Lotus\'</code>, <code>\'DG Medios\'</code> y <code>\'Productora Demo\'</code> (inexistente).'
                },
                {
                    label: 'RECORD',
                    text: 'Declara un <code>RECORD</code> personalizado con <code>productora</code>, <code>evento</code>, <code>banco</code>, <code>descuento_porcentaje</code> y <code>fecha_termino</code>.'
                },
                {
                    label: 'Cursores Anidados',
                    text: 'Valida primero que la productora exista obteniendo su <code>productora_id</code> con <code>SELECT ... INTO</code> en un sub-bloque. Luego recorre sus eventos con <code>c_eventos(p_productora_id)</code> y sus convenios activos con <code>c_convenios(p_evento_id)</code> cargando cada convenio en el <code>RECORD</code>.'
                },
                {
                    label: 'Excepciones',
                    text: 'Si <code>descuento_porcentaje >= 20</code>, dispara <code>e_descuento_alto</code> en un sub-bloque para emitir advertencia de gerencia sin cortar el informe. Captura <code>NO_DATA_FOUND</code> (para <code>\'Productora Demo\'</code>), <code>TOO_MANY_ROWS</code> y <code>WHEN OTHERS</code>.'
                }
            ],
            starterTemplate: `-- Problema 5: Evaluacion de Convenios Bancarios por Productora
SET SERVEROUTPUT ON;

DECLARE
    -- 1. VARRAY(4) de nombres de fantasia de productoras

    -- 2. RECORD personalizado de convenio por evento

    -- 3. Cursores anidados c_eventos(p_productora_id NUMBER) y c_convenios(p_evento_id NUMBER)

    -- 4. Variables auxiliares y excepcion e_descuento_alto

BEGIN
    -- Validar productora con SELECT INTO, recorrer eventos y convenios con sub-bloques EXCEPTION
    NULL;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('[ERROR] ' || SQLCODE || ' - ' || SQLERRM);
END;
/`
        },
        {
            id: 6,
            code: 'P6',
            title: 'Control y Auditoría Simulada de Reservas Temporales',
            icon: 'ph-clock-countdown',
            color: '#dc2626',
            tables: ['RESERVA_TEMPORAL', 'CLIENTE', 'LOCALIDAD_EVENTO', 'LOG_ANULACIONES'],
            summary: 'Revisa reservas temporales por estado con FOR UPDATE OF, protege reservas ya convertidas mediante excepciones y audita cierres simulados en LOG_ANULACIONES.',
            requirements: [
                {
                    label: 'VARRAY',
                    text: 'Declara un <code>VARRAY(4)</code> con los estados de reserva: <code>\'CONVERTIDA\'</code>, <code>\'CANCELADA\'</code>, <code>\'ACTIVA\'</code> y <code>\'EXPIRADA\'</code>.'
                },
                {
                    label: 'RECORD',
                    text: 'Declara un <code>RECORD</code> personalizado con <code>reserva_id</code>, nombre completo del cliente, <code>nombre_localidad</code>, <code>estado</code> y <code>fecha_expiracion</code>.'
                },
                {
                    label: 'Cursor con FOR UPDATE',
                    text: 'Declara un cursor explícito parametrizado <code>c_reservas(p_estado)</code> con <code>FOR UPDATE OF rt.estado</code> sobre <code>RESERVA_TEMPORAL</code> (con <code>JOIN</code> a <code>CLIENTE</code> y <code>LOCALIDAD_EVENTO</code>). Si la reserva está <code>\'CANCELADA\'</code>, actualízala simuladamente a <code>\'EXPIRADA\'</code> con <code>WHERE CURRENT OF</code> e inserta trazabilidad en <code>LOG_ANULACIONES</code> (<code>administrador_id = 1</code>, <code>reserva_id</code> y <code>motivo</code>).'
                },
                {
                    label: 'Excepciones y Transacción',
                    text: 'Si la reserva está en estado <code>\'CONVERTIDA\'</code>, dispara <code>e_reserva_protegida</code> en un sub-bloque (no se puede modificar una reserva convertida) y continúa. Valida que el motivo no esté vacío con <code>RAISE_APPLICATION_ERROR</code> (rango válido <code>-20000..-20999</code>). Ejecuta siempre <code>ROLLBACK;</code>.'
                }
            ],
            starterTemplate: `-- Problema 6: Control y Auditoria Simulada de Reservas Temporales
SET SERVEROUTPUT ON;

DECLARE
    -- 1. VARRAY(4) de estados de reserva

    -- 2. RECORD personalizado de reserva

    -- 3. Cursor parametrizado c_reservas(p_estado VARCHAR2) con FOR UPDATE OF rt.estado

    -- 4. Motivo de auditoria y excepcion e_reserva_protegida

BEGIN
    -- Validar motivo, recorrer reservas por estado, actualizar CANCELADA -> EXPIRADA y registrar en LOG_ANULACIONES
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('[ERROR] ' || SQLCODE || ' - ' || SQLERRM);
END;
/`
        }
    ],
    rubricCode: [
        { level: 'Logrado', pts: '5 pts', desc: 'Compila y ejecuta sin errores en clon_punto_ticket.sql, integra los 4 contenidos solicitados, muestra salida coherente y deja la BD intacta con ROLLBACK.' },
        { level: 'Parcial', pts: '3 pts', desc: 'Compila y ejecuta, pero omite 1 requerimiento secundario o presenta un detalle menor en la salida o validación.' },
        { level: 'Insuficiente', pts: '1 pt', desc: 'Presenta errores importantes de lógica o cumple solo parcialmente la estructura solicitada.' },
        { level: 'No Logrado', pts: '0 pts', desc: 'No entrega bloque o el código no compila.' }
    ],
    rubricOral: [
        {
            dim: '1. RECORD y VARRAY línea por línea',
            maxPts: '10 pts',
            logrado: '10 pts: Explica con precisión cómo declaró, inicializó y accedió al RECORD (campos, %TYPE) y al VARRAY (límite, constructor/.EXTEND, .COUNT).',
            mediano: '7 pts: Explica correctamente ambos, pero presenta una imprecisión menor de terminología o requiere 1 pista.',
            desarrollo: '3 pts: Confunde el rol de RECORD y VARRAY o explica de forma superficial sin precisar sus líneas.',
            nologrado: '0 pts: No sabe explicar sus declaraciones o incluyó código que no comprende.'
        },
        {
            dim: '2. Cursores y Bucles línea por línea',
            maxPts: '12 pts',
            logrado: '12 pts: Explica con claridad la consulta, parámetros, ciclo de vida (OPEN/FETCH/EXIT/CLOSE o FOR LOOP), FOR UPDATE/WHERE CURRENT OF y atributos (%NOTFOUND, %ROWCOUNT).',
            mediano: '8 pts: Explica el funcionamiento general del cursor, pero duda en algún atributo, parámetro o cláusula de bloqueo.',
            desarrollo: '4 pts: Lee el código literalmente sin explicar qué hace Oracle internamente en cada iteración.',
            nologrado: '0 pts: Desconoce cómo opera el cursor o no identifica qué filas recorre.'
        },
        {
            dim: '3. Manejo de Excepciones y Transacción',
            maxPts: '13 pts',
            logrado: '13 pts: Justifica el flujo exacto ante cada error (predefinida, personalizada/RAISE, PRAGMA o RAISE_APPLICATION_ERROR), el porqué del sub-bloque, WHEN OTHERS y el ROLLBACK.',
            mediano: '9 pts: Explica qué captura cada WHEN, pero duda en propagación, orden o alcance del bloque EXCEPTION.',
            desarrollo: '4 pts: Menciona las excepciones por nombre sin explicar cuándo se disparan ni cómo afectan el flujo.',
            nologrado: '0 pts: No comprende cómo ni cuándo se ejecutan sus excepciones.'
        },
        {
            dim: '4. Prueba de Autoría / "¿Qué pasa si...?" en vivo',
            maxPts: '10 pts',
            logrado: '10 pts: Responde con solvencia una modificación hipotética o pregunta contrafactual sobre su propio bloque.',
            mediano: '7 pts: Responde la idea principal con una orientación puntual del docente.',
            desarrollo: '3 pts: Respuesta vaga o por descarte sin fundamento técnico en Oracle PL/SQL.',
            nologrado: '0 pts: No logra responder ni explicar las consecuencias de modificar su propio código.'
        }
    ],
    defenseChecklist: [
        'Probé ambos bloques en Oracle SQL Developer sobre clon_punto_ticket.sql con SET SERVEROUTPUT ON.',
        'Ambos bloques compilan y ejecutan sin errores no controlados.',
        'Verifiqué que los bloques con DML ejecutan ROLLBACK y no dejaron cambios permanentes en las tablas.',
        'Cada bloque integra claramente RECORD, VARRAY, Cursor Explícito y Manejo de Excepciones.',
        'Puedo señalar cualquier línea de mis 2 bloques y explicar con mis palabras qué hace Oracle al ejecutarla.',
        'Puedo explicar qué pasaría si quito una cláusula clave (ej. FOR UPDATE, .EXTEND, CLOSE o el sub-bloque EXCEPTION).'
    ]
};

