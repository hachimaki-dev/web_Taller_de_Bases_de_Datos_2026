// actividad_prep_eval1_data.js — Datos y ejemplos Punto Ticket para el taller preparatorio

const actividad_prep_eval1_data = {
    id: 'act-prep-1',
    title: 'Taller: Diseña tu Proyecto PL/SQL',
    subtitle: 'Genera los entregables clave para la Evaluación 1 — paso a paso',
    totalTime: '60 min efectivos',

    sections: [
        { number: 1, title: 'Datos del Equipo y Contexto', time: '8 min', icon: 'ph-buildings', color: '#f59e0b' },
        { number: 2, title: 'Entidades y Modelo de Datos', time: '12 min', icon: 'ph-table', color: '#3b82f6' },
        { number: 3, title: 'Reglas de Negocio y Narrativas', time: '12 min', icon: 'ph-list-checks', color: '#10b981' },
        { number: 4, title: 'Plan de Componentes PL/SQL', time: '13 min', icon: 'ph-code', color: '#8b5cf6' },
        { number: 5, title: 'Resumen y Exportar', time: '5 min', icon: 'ph-download-simple', color: '#ef4444' }
    ],

    sectorOptions: [
        'Salud', 'Educación', 'Comercio / Retail', 'Restaurantes / Gastronomía',
        'Logística / Transporte', 'Deportes', 'Entretenimiento', 'Hotelería / Turismo',
        'Servicios Financieros', 'Tecnología', 'Agricultura', 'Otro'
    ],

    typeOptions: ['NUMBER', 'VARCHAR2', 'DATE', 'TIMESTAMP', 'CHAR(1)', 'CLOB', 'NUMBER(12,2)'],

    roleOptions: ['Administrador', 'Cliente', 'Operador', 'Vendedor', 'Sistema', 'Auditor', 'Otro'],

    predefinedExceptions: [
        { name: 'NO_DATA_FOUND', desc: 'SELECT INTO no encontró filas' },
        { name: 'TOO_MANY_ROWS', desc: 'SELECT INTO encontró más de una fila' },
        { name: 'DUP_VAL_ON_INDEX', desc: 'Violación de UNIQUE o PK' },
        { name: 'VALUE_ERROR', desc: 'Error de conversión o tamaño' },
        { name: 'ZERO_DIVIDE', desc: 'División por cero' },
        { name: 'INVALID_CURSOR', desc: 'Operación ilegal sobre un cursor' }
    ],

    // ================= EJEMPLOS PUNTO TICKET =================

    examples: {
        context: {
            projectName: 'Sistema Punto Ticket',
            sector: 'Entretenimiento',
            businessDesc: 'Plataforma web que permite la venta y gestión de entradas para eventos en vivo (conciertos, teatro, festivales y deportes). Los clientes pueden reservar temporalmente, pagar con distintos medios y obtener tickets digitales con código único.',
            problemDesc: 'La gestión manual de entradas genera sobreventa de localidades, errores en el cálculo de descuentos por convenios bancarios, falta de trazabilidad en las transacciones y ausencia de auditoría ante cambios de precios o anulaciones de tickets.',
            objectiveDesc: 'Desarrollar un sistema en Oracle PL/SQL que automatice el ciclo completo de venta: reserva temporal → validación de stock → pago con descuentos → emisión de ticket, con control de stock en tiempo real, gestión de convenios bancarios, manejo robusto de excepciones y auditoría completa mediante triggers.'
        },

        entities: [
            {
                name: 'CLIENTE',
                description: 'Persona que compra entradas',
                attributes: [
                    { name: 'cliente_id', type: 'NUMBER', pk: true, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'rut', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: true },
                    { name: 'nombre', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'email', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: true },
                    { name: 'fecha_registro', type: 'TIMESTAMP', pk: false, fk: false, fkRef: '', notNull: true, unique: false }
                ]
            },
            {
                name: 'EVENTO',
                description: 'Espectáculo programado en un recinto',
                attributes: [
                    { name: 'evento_id', type: 'NUMBER', pk: true, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'productora_id', type: 'NUMBER', pk: false, fk: true, fkRef: 'PRODUCTORA', notNull: true, unique: false },
                    { name: 'recinto_id', type: 'NUMBER', pk: false, fk: true, fkRef: 'RECINTO', notNull: true, unique: false },
                    { name: 'nombre', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'fecha_evento', type: 'DATE', pk: false, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'estado', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: false }
                ]
            },
            {
                name: 'LOCALIDAD_EVENTO',
                description: 'Sector con precio y stock para un evento',
                attributes: [
                    { name: 'localidad_evento_id', type: 'NUMBER', pk: true, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'evento_id', type: 'NUMBER', pk: false, fk: true, fkRef: 'EVENTO', notNull: true, unique: false },
                    { name: 'nombre_localidad', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'precio', type: 'NUMBER(12,2)', pk: false, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'stock_disponible', type: 'NUMBER', pk: false, fk: false, fkRef: '', notNull: true, unique: false }
                ]
            },
            {
                name: 'RESERVA_TEMPORAL',
                description: 'Bloqueo temporal de un cupo antes del pago',
                attributes: [
                    { name: 'reserva_id', type: 'NUMBER', pk: true, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'cliente_id', type: 'NUMBER', pk: false, fk: true, fkRef: 'CLIENTE', notNull: true, unique: false },
                    { name: 'localidad_evento_id', type: 'NUMBER', pk: false, fk: true, fkRef: 'LOCALIDAD_EVENTO', notNull: true, unique: false },
                    { name: 'estado', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: false }
                ]
            },
            {
                name: 'TICKET',
                description: 'Entrada emitida tras el pago aprobado',
                attributes: [
                    { name: 'ticket_id', type: 'NUMBER', pk: true, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'transaccion_id', type: 'NUMBER', pk: false, fk: true, fkRef: 'TRANSACCION_PAGO', notNull: true, unique: true },
                    { name: 'codigo_ticket', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: true },
                    { name: 'precio_pagado', type: 'NUMBER(12,2)', pk: false, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'estado', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: true, unique: false }
                ]
            },
            {
                name: 'LOG_CAMBIO_PRECIO',
                description: 'Registro de auditoría para cambios de precio',
                attributes: [
                    { name: 'log_precio_id', type: 'NUMBER', pk: true, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'localidad_evento_id', type: 'NUMBER', pk: false, fk: true, fkRef: 'LOCALIDAD_EVENTO', notNull: true, unique: false },
                    { name: 'precio_anterior', type: 'NUMBER(12,2)', pk: false, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'precio_nuevo', type: 'NUMBER(12,2)', pk: false, fk: false, fkRef: '', notNull: true, unique: false },
                    { name: 'fecha_cambio', type: 'TIMESTAMP', pk: false, fk: false, fkRef: '', notNull: true, unique: false }
                ]
            }
        ],

        rules: [
            { code: 'RN-001', category: 'Restricción', description: 'El stock_disponible de una localidad no puede ser negativo.', violation: 'Se rechaza la compra y se lanza RAISE_APPLICATION_ERROR(-20001, \'Stock agotado\').' },
            { code: 'RN-002', category: 'Cálculo', description: 'El monto_final de una transacción debe ser igual a monto_bruto menos el descuento del convenio.', violation: 'Constraint CHECK impide guardar valores inconsistentes.' },
            { code: 'RN-003', category: 'Validación', description: 'El email del cliente debe contener el carácter \'@\' y tener más de 1 carácter antes de él.', violation: 'Constraint CHECK + excepción en procedimiento de registro.' },
            { code: 'RN-004', category: 'Automatización', description: 'Al confirmar el pago de una reserva, esta cambia automáticamente a estado CONVERTIDA y se emite un ticket con código único.', violation: 'La transacción queda en estado PENDIENTE si falla algún paso.' },
            { code: 'RN-005', category: 'Auditoría', description: 'Todo cambio de precio en LOCALIDAD_EVENTO debe registrarse en LOG_CAMBIO_PRECIO con precio anterior, precio nuevo y timestamp.', violation: 'Trigger AFTER UPDATE garantiza el registro; sin el trigger no hay trazabilidad.' },
            { code: 'RN-006', category: 'Restricción', description: 'Un evento no puede tener fecha_apertura de venta posterior o igual a la fecha del evento.', violation: 'Constraint CHECK rechaza el INSERT/UPDATE.' }
        ],

        narratives: [
            { role: 'Cliente', action: 'reservar temporalmente una entrada para un evento', benefit: 'asegurar mi lugar mientras completo el proceso de pago', components: ['Procedimiento', 'Excepción'] },
            { role: 'Administrador', action: 'ver un reporte de ventas agrupado por evento y localidad', benefit: 'tomar decisiones sobre precios y disponibilidad', components: ['Cursor', 'RECORD'] },
            { role: 'Sistema', action: 'registrar automáticamente cada cambio de precio', benefit: 'mantener un historial auditable de modificaciones', components: ['Trigger'] },
            { role: 'Administrador', action: 'aplicar descuentos de convenios bancarios a las compras', benefit: 'honrar los acuerdos comerciales con bancos', components: ['Función', 'Package'] },
            { role: 'Administrador', action: 'anular un ticket ya emitido', benefit: 'gestionar devoluciones y dejar registro del motivo', components: ['Procedimiento', 'Trigger', 'Excepción'] }
        ],

        components: {
            record: {
                name: 'r_venta_info',
                fields: 'ticket_id NUMBER, codigo_ticket VARCHAR2(50), nombre_evento VARCHAR2(200), nombre_localidad VARCHAR2(100), nombre_cliente VARCHAR2(160), precio_pagado NUMBER(12,2)',
                justification: 'Agrupa en una sola estructura todos los datos que se necesitan para generar un comprobante de venta, evitando declarar 6 variables escalares sueltas y mejorando la legibilidad del código.'
            },
            varray: {
                name: 'v_metodos_pago_validos',
                purpose: 'Almacenar en memoria los métodos de pago permitidos (TARJETA_CREDITO, TARJETA_DEBITO, TRANSFERENCIA, WEBPAY) para validar rápidamente sin consultar la BD en cada transacción.',
                justification: 'Evita múltiples consultas a la BD para validar métodos de pago. Al ser una lista fija y corta, VARRAY es ideal porque su tamaño máximo es conocido.'
            },
            cursor: {
                masterQuery: 'Cursor maestro: recorre cada EVENTO. Cursor detalle (con parámetro p_evento_id): recorre las LOCALIDAD_EVENTO de ese evento, acumulando tickets vendidos y monto recaudado.',
                params: 'c_localidades(p_evento_id NUMBER) — recibe el ID del evento para filtrar las localidades.',
                flow: '1. Abrir cursor maestro de eventos en estado VENTA.\n2. Por cada evento, abrir cursor detalle con p_evento_id.\n3. Acumular total_tickets y total_recaudado por localidad.\n4. Reiniciar acumuladores al cambiar de evento.\n5. Imprimir subtotales por evento y gran total al final.'
            },
            exceptions: {
                predefined: ['NO_DATA_FOUND', 'DUP_VAL_ON_INDEX', 'VALUE_ERROR'],
                custom: {
                    name: 'e_stock_agotado',
                    code: '-20001',
                    condition: 'Cuando un cliente intenta reservar una entrada pero stock_disponible = 0 en la localidad solicitada.'
                }
            },
            procedure: {
                name: 'sp_procesar_compra',
                params: 'p_reserva_id IN NUMBER, p_metodo_pago IN VARCHAR2, p_convenio_id IN NUMBER DEFAULT NULL, p_resultado OUT VARCHAR2',
                description: 'Valida la reserva (activa y no expirada), verifica stock, calcula descuento si hay convenio, inserta TRANSACCION_PAGO, emite TICKET, actualiza stock y estado de reserva. En caso de error, hace ROLLBACK y retorna el mensaje.'
            },
            function: {
                name: 'fn_calcular_descuento',
                params: 'p_monto_bruto NUMBER, p_convenio_id NUMBER',
                returns: 'NUMBER — el monto del descuento calculado',
                description: 'Busca el porcentaje de descuento del convenio, verifica que esté activo, y retorna monto_bruto * (porcentaje / 100). Si el convenio no existe o está inactivo, retorna 0.'
            },
            package: {
                name: 'pkg_punto_ticket',
                contents: '• fn_calcular_descuento — Calcula descuento por convenio\n• sp_procesar_compra — Procesa la compra completa\n• sp_anular_ticket — Anula un ticket y registra motivo\n• fn_obtener_stock — Retorna stock disponible de una localidad',
                justification: 'Agrupa toda la lógica de negocio de venta de tickets en un solo módulo. La especificación (PACKAGE) expone la interfaz pública; el cuerpo (BODY) oculta la implementación. Facilita el mantenimiento y evita conflictos de nombres.'
            },
            trigger: {
                table: 'LOCALIDAD_EVENTO',
                timing: 'AFTER',
                event: 'UPDATE OF precio',
                description: 'Registra en LOG_CAMBIO_PRECIO el precio anterior (:OLD.precio), el precio nuevo (:NEW.precio) y la fecha actual (SYSTIMESTAMP) cada vez que se modifica el precio de una localidad.',
                usesNewOld: 'Sí. :OLD.precio contiene el valor antes del UPDATE (precio anterior). :NEW.precio contiene el valor después del UPDATE (precio nuevo). :NEW.localidad_evento_id identifica qué localidad cambió.'
            }
        }
    }
};
