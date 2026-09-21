/* ============================================================================
   EXPANSIÓN DE DATOS: PUNTO TICKET (CLON ORACLE)
   ============================================================================
   Archivo: expansion_punto_ticket.sql
   Propósito:
     Expandir el volumen y la variedad de registros de la base de datos
     de Punto Ticket (clon_punto_ticket.sql) para enriquecer las pruebas,
     consultas, procedimientos almacenados y funciones de la Unidad 2.1:
       - stock_total_evento(p_evento_id)
       - calcular_descuento / aplicar_descuento_convenio
       - reservar_entrada(p_cliente_id, p_localidad_id, p_reserva_id)
       - cancelar_reserva_expirada(p_reserva_id, p_nombre_cliente)
       - procesar_pago(p_reserva_id, p_metodo_pago, p_transaccion_id)
       - anular_ticket(p_ticket_id, p_motivo, p_admin_id)
       - recaudacion_evento(p_evento_id)
       - ajustar_precios_evento(p_evento_id, p_porcentaje)

   Reglas de Integridad Garantizadas:
     - Todos los IDs foráneos se resuelven mediante subconsultas basadas
       en claves candidatas / nombres únicos (compatibilidad total con IDENTITY).
     - Cumplimiento estricto de todas las restricciones CHECK:
         * monto_final = monto_bruto - descuento
         * fecha_expiracion > fecha_reserva
         * fecha_termino >= fecha_inicio
         * fecha_apertura < fecha_evento
         * precio_anterior <> precio_nuevo
         * estados válidos en EVENTO, RESERVA, PAGO, TICKET, CONVENIO
     - Cero colisiones con los datos base de clon_punto_ticket.sql.
   ============================================================================ */


/* ============================================================
   1. PRODUCTORAS ADICIONALES (3 nuevas)
   ============================================================ */

INSERT INTO PRODUCTORA
    (razon_social, nombre_fantasia, rut, email, telefono)
VALUES
    (
        'Street Media Entretenimiento SpA',
        'Street Media',
        '79.456.789-0',
        'contacto@streetmedia.cl',
        '+56994567890'
    );

INSERT INTO PRODUCTORA
    (razon_social, nombre_fantasia, rut, email, telefono)
VALUES
    (
        'Fauna Producciones Culturales SpA',
        'Fauna Prod',
        '80.567.890-1',
        'hola@faunaprod.cl',
        '+56995678901'
    );

INSERT INTO PRODUCTORA
    (razon_social, nombre_fantasia, rut, email, telefono)
VALUES
    (
        'Swing Management y Espectáculos SpA',
        'Swing Management',
        '81.678.901-2',
        'info@swingmanagement.cl',
        '+56996789012'
    );


/* ============================================================
   2. ADMINISTRADORES ADICIONALES (2 nuevos)
   ============================================================ */

INSERT INTO ADMINISTRADOR
    (nombre, apellido, email, password_hash, activo)
VALUES
    (
        'Ignacio',
        'Valenzuela',
        'ignacio.valenzuela@puntoticket-demo.cl',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'S'
    );

INSERT INTO ADMINISTRADOR
    (nombre, apellido, email, password_hash, activo)
VALUES
    (
        'Paula',
        'Navarro',
        'paula.navarro@puntoticket-demo.cl',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'S'
    );


/* ============================================================
   3. CLIENTES ADICIONALES (15 nuevos con RUTs y correos válidos)
   ============================================================ */

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('15.789.012-6', 'Carlos', 'Aránguiz', 'carlos.aranguiz@gmail.com', '+56981234501', TIMESTAMP '2026-01-15 10:20:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('18.890.123-7', 'Marcela', 'Contreras', 'marcela.contreras@outlook.com', '+56981234502', TIMESTAMP '2026-01-18 11:35:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('19.901.234-8', 'Rodrigo', 'Muñoz', 'rodrigo.munoz@yahoo.cl', '+56981234503', TIMESTAMP '2026-02-01 09:12:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('20.012.345-9', 'Javiera', 'Silva', 'javiera.silva@gmail.com', '+56981234504', TIMESTAMP '2026-02-14 16:40:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('17.123.456-0', 'Felipe', 'Herrera', 'felipe.herrera@hotmail.com', '+56981234505', TIMESTAMP '2026-02-20 14:05:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('16.234.567-K', 'Constanza', 'Lagos', 'constanza.lagos@gmail.com', '+56981234506', TIMESTAMP '2026-03-02 18:25:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('21.345.678-1', 'Matías', 'Sepúlveda', 'matias.sepulveda@gmail.com', '+56981234507', TIMESTAMP '2026-03-10 12:00:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('18.456.789-2', 'Francisca', 'Reyes', 'francisca.reyes@uc.cl', '+56981234508', TIMESTAMP '2026-03-15 15:50:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('19.567.890-3', 'Gonzalo', 'Bravo', 'gonzalo.bravo@gmail.com', '+56981234509', TIMESTAMP '2026-04-01 11:10:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('20.678.901-4', 'Daniela', 'Araya', 'daniela.araya@gmail.com', '+56981234510', TIMESTAMP '2026-04-12 17:30:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('17.789.012-5', 'Tomás', 'Espinoza', 'tomas.espinoza@duocuc.cl', '+56981234511', TIMESTAMP '2026-04-20 13:45:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('16.890.123-6', 'Bárbara', 'Vidal', 'barbara.vidal@gmail.com', '+56981234512', TIMESTAMP '2026-05-05 19:15:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('15.901.234-7', 'Esteban', 'Paredes', 'esteban.paredes@gmail.com', '+56981234513', TIMESTAMP '2026-05-18 08:30:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('21.012.345-8', 'Nicole', 'Henríquez', 'nicole.henriquez@gmail.com', '+56981234514', TIMESTAMP '2026-06-01 14:22:00');

INSERT INTO CLIENTE (rut, nombre, apellido, email, telefono, fecha_registro)
VALUES ('19.123.456-9', 'Lucas', 'Cárdenas', 'lucas.cardenas@gmail.com', '+56981234515', TIMESTAMP '2026-06-15 16:00:00');


/* ============================================================
   4. RECINTOS ADICIONALES (4 nuevos de gran relevancia)
   ============================================================ */

INSERT INTO RECINTO (nombre, direccion, comuna, ciudad, capacidad_total)
VALUES ('Teatro Caupolicán', 'San Diego 850', 'Santiago', 'Santiago', 4500);

INSERT INTO RECINTO (nombre, direccion, comuna, ciudad, capacidad_total)
VALUES ('Quinta Vergara', 'Prolongación Errázuriz s/n', 'Viña del Mar', 'Viña del Mar', 15000);

INSERT INTO RECINTO (nombre, direccion, comuna, ciudad, capacidad_total)
VALUES ('Gran Arena Monticello', 'Panamericana Sur Km 57', 'Mostazal', 'San Francisco de Mostazal', 4000);

INSERT INTO RECINTO (nombre, direccion, comuna, ciudad, capacidad_total)
VALUES ('Estadio Monumental', 'Marathon 5300', 'Macul', 'Santiago', 44000);


/* ============================================================
   5. SECTORES DE RECINTOS ADICIONALES
   ============================================================ */

-- Teatro Caupolicán
INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán'), 'Palco', 500, 'S');

INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán'), 'Cancha', 2500, 'N');

INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán'), 'Galería', 1500, 'N');

-- Quinta Vergara
INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara'), 'Palco Preferencial', 1200, 'S');

INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara'), 'Platea Golden', 3800, 'S');

INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara'), 'Galería General', 10000, 'N');

-- Gran Arena Monticello
INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello'), 'Platea Baja Diamante', 1500, 'S');

INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello'), 'Platea Alta', 2500, 'S');

-- Estadio Monumental
INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental'), 'Rapa Nui', 4000, 'S');

INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental'), 'Océano', 10000, 'S');

INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental'), 'Cancha Vip', 12000, 'N');

INSERT INTO SECTOR_RECINTO (recinto_id, nombre, capacidad_maxima, es_numerado)
VALUES ((SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental'), 'Arica General', 18000, 'N');


/* ============================================================
   6. ASIENTOS ADICIONALES (Para sectores numerados)
   ============================================================ */

-- Teatro Caupolicán: Palco (Fila A: 1-10, Fila B: 1-10)
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'A', 1);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'A', 2);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'A', 3);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'A', 4);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'A', 5);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'B', 1);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'B', 2);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'B', 3);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'B', 4);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')), 'B', 5);

-- Quinta Vergara: Palco Preferencial (Fila A: 1-5, Fila B: 1-5)
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')), 'A', 1);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')), 'A', 2);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')), 'A', 3);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')), 'B', 1);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')), 'B', 2);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')), 'B', 3);

-- Gran Arena Monticello: Platea Baja Diamante (Fila A: 1-5, Fila B: 1-5)
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja Diamante' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello')), 'A', 1);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja Diamante' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello')), 'A', 2);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja Diamante' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello')), 'A', 3);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja Diamante' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello')), 'B', 1);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja Diamante' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello')), 'B', 2);

-- Estadio Monumental: Rapa Nui (Fila A: 1-5, Fila B: 1-5)
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Rapa Nui' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental')), 'A', 1);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Rapa Nui' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental')), 'A', 2);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Rapa Nui' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental')), 'A', 3);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Rapa Nui' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental')), 'B', 1);
INSERT INTO ASIENTO (sector_id, fila, numero) VALUES ((SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Rapa Nui' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental')), 'B', 2);


/* ============================================================
   7. EVENTOS ADICIONALES (7 nuevos en diversos estados)
   ============================================================ */

-- Evento 4: Iron Maiden (VENTA - masivo Estadio Nacional)
INSERT INTO EVENTO (productora_id, recinto_id, nombre, descripcion, fecha_evento, fecha_apertura, estado)
VALUES (
    (SELECT productora_id FROM PRODUCTORA WHERE nombre_fantasia = 'DG Medios'),
    (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Nacional'),
    'Iron Maiden - The Future Past Tour',
    'Gira mundial legendaria del sexteto británico en el Estadio Nacional.',
    TO_DATE('2026-11-27 20:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-08-01 12:00', 'YYYY-MM-DD HH24:MI'),
    'VENTA'
);

-- Evento 5: Duki (AGOTADO - ideal para probar stock_total_evento = 0 y excepciones)
INSERT INTO EVENTO (productora_id, recinto_id, nombre, descripcion, fecha_evento, fecha_apertura, estado)
VALUES (
    (SELECT productora_id FROM PRODUCTORA WHERE nombre_fantasia = 'Bizarro Live Entertainment'),
    (SELECT recinto_id FROM RECINTO WHERE nombre = 'Movistar Arena'),
    'Duki - A.D.A. Tour Chile',
    'Concierto del referente urbano argentino con entradas totalmente agotadas.',
    TO_DATE('2026-10-18 21:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-07-15 10:00', 'YYYY-MM-DD HH24:MI'),
    'AGOTADO'
);

-- Evento 6: Festival Fauna Primavera 2026 (VENTA - Quinta Vergara)
INSERT INTO EVENTO (productora_id, recinto_id, nombre, descripcion, fecha_evento, fecha_apertura, estado)
VALUES (
    (SELECT productora_id FROM PRODUCTORA WHERE nombre_fantasia = 'Fauna Prod'),
    (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara'),
    'Festival Fauna Primavera 2026',
    'Festival de música alternativa e indie en la Ciudad Jardín.',
    TO_DATE('2026-12-12 14:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-09-01 11:00', 'YYYY-MM-DD HH24:MI'),
    'VENTA'
);

-- Evento 7: Mon Laferte (VENTA - Gran Arena Monticello)
INSERT INTO EVENTO (productora_id, recinto_id, nombre, descripcion, fecha_evento, fecha_apertura, estado)
VALUES (
    (SELECT productora_id FROM PRODUCTORA WHERE nombre_fantasia = 'Swing Management'),
    (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello'),
    'Mon Laferte - Autopoiética Tour',
    'Presentación íntima y teatral de la cantautora nacional en Monticello.',
    TO_DATE('2026-11-08 21:30', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-08-15 12:00', 'YYYY-MM-DD HH24:MI'),
    'VENTA'
);

-- Evento 8: Los Bunkers (VENTA - Teatro Caupolicán)
INSERT INTO EVENTO (productora_id, recinto_id, nombre, descripcion, fecha_evento, fecha_apertura, estado)
VALUES (
    (SELECT productora_id FROM PRODUCTORA WHERE nombre_fantasia = 'Lotus'),
    (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán'),
    'Los Bunkers - Gira Acústica',
    'Concierto acústico de la banda penquista repasando sus mayores éxitos.',
    TO_DATE('2026-10-30 20:30', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-08-10 10:00', 'YYYY-MM-DD HH24:MI'),
    'VENTA'
);

-- Evento 9: Roger Waters (REALIZADO - evento histórico pasado para reportes de recaudación)
INSERT INTO EVENTO (productora_id, recinto_id, nombre, descripcion, fecha_evento, fecha_apertura, estado)
VALUES (
    (SELECT productora_id FROM PRODUCTORA WHERE nombre_fantasia = 'DG Medios'),
    (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental'),
    'Roger Waters - This Is Not a Drill',
    'Concierto conceptual histórico de despedida en el Estadio Monumental.',
    TO_DATE('2025-11-25 21:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2025-05-10 11:00', 'YYYY-MM-DD HH24:MI'),
    'REALIZADO'
);

-- Evento 10: André Rieu (CANCELADO - para probar procedimientos de anulación y auditoría)
INSERT INTO EVENTO (productora_id, recinto_id, nombre, descripcion, fecha_evento, fecha_apertura, estado)
VALUES (
    (SELECT productora_id FROM PRODUCTORA WHERE nombre_fantasia = 'Bizarro Live Entertainment'),
    (SELECT recinto_id FROM RECINTO WHERE nombre = 'Movistar Arena'),
    'André Rieu y su Johann Strauss Orchestra',
    'Concierto de vals y música clásica suspendido por fuerza mayor.',
    TO_DATE('2026-10-05 20:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-06-01 12:00', 'YYYY-MM-DD HH24:MI'),
    'CANCELADO'
);


/* ============================================================
   8. LOCALIDADES DE EVENTOS ADICIONALES
   ============================================================ */

-- Iron Maiden (Estadio Nacional)
INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Iron Maiden - The Future Past Tour'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Cancha' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Nacional')),
    'Cancha General',
    69000,
    14500
);

INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Iron Maiden - The Future Past Tour'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Tribuna Andes' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Nacional')),
    'Tribuna Andes Numerada',
    115000,
    8200
);

-- Duki (Movistar Arena - AGOTADO: stock = 0)
INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Duki - A.D.A. Tour Chile'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Movistar Arena')),
    'Platea Baja Vip',
    85000,
    0
);

INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Duki - A.D.A. Tour Chile'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Cancha General' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Movistar Arena')),
    'Cancha de Pie',
    49000,
    0
);

-- Festival Fauna Primavera (Quinta Vergara)
INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Festival Fauna Primavera 2026'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')),
    'Palco Vip Experiencia',
    145000,
    1150
);

INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Festival Fauna Primavera 2026'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Golden' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')),
    'Platea Golden',
    95000,
    3400
);

INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Festival Fauna Primavera 2026'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Galería General' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara')),
    'Galería Festival',
    55000,
    8900
);

-- Mon Laferte (Gran Arena Monticello)
INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Mon Laferte - Autopoiética Tour'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja Diamante' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello')),
    'Platea Diamante',
    120000,
    1450
);

INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Mon Laferte - Autopoiética Tour'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Alta' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello')),
    'Platea Alta Central',
    65000,
    2400
);

-- Los Bunkers (Teatro Caupolicán)
INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Los Bunkers - Gira Acústica'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')),
    'Palco Acústico',
    75000,
    480
);

INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Los Bunkers - Gira Acústica'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Cancha' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')),
    'Cancha de Pie',
    42000,
    2350
);

INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Los Bunkers - Gira Acústica'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Galería' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán')),
    'Galería General',
    28000,
    1400
);

-- Roger Waters (Estadio Monumental - REALIZADO)
INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Roger Waters - This Is Not a Drill'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Rapa Nui' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental')),
    'Rapa Nui Vip',
    220000,
    0
);

INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Roger Waters - This Is Not a Drill'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Cancha Vip' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental')),
    'Cancha Frontal',
    110000,
    0
);

-- André Rieu (Movistar Arena - CANCELADO)
INSERT INTO LOCALIDAD_EVENTO (evento_id, sector_id, nombre_localidad, precio, stock_disponible)
VALUES (
    (SELECT evento_id FROM EVENTO WHERE nombre = 'André Rieu y su Johann Strauss Orchestra'),
    (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Movistar Arena')),
    'Platea Baja Preferencial',
    130000,
    4900
);


/* ============================================================
   9. CONVENIOS BANCARIOS ADICIONALES (4 nuevos)
   ============================================================ */

INSERT INTO CONVENIO_BANCO (banco, nombre_convenio, descuento_porcentaje, activo)
VALUES ('Banco Falabella', 'CMR Puntos y Descuento Musical', 15.00, 'S');

INSERT INTO CONVENIO_BANCO (banco, nombre_convenio, descuento_porcentaje, activo)
VALUES ('Scotiabank', 'Beneficio Scotia Club Live', 20.00, 'S');

INSERT INTO CONVENIO_BANCO (banco, nombre_convenio, descuento_porcentaje, activo)
VALUES ('Tenpo', 'Cashback y Descuento Tenpo Fans', 25.00, 'S');

-- Convenio INACTIVO: Fundamental para probar control de excepciones (NO_DATA_FOUND)
INSERT INTO CONVENIO_BANCO (banco, nombre_convenio, descuento_porcentaje, activo)
VALUES ('Itaú', 'Beneficio Tarjetas Itaú Convenio Antiguo', 18.00, 'N');


/* ============================================================
   10. CONVENIOS POR EVENTO ADICIONALES
   ============================================================ */

-- Falabella en Los Bunkers
INSERT INTO CONVENIO_EVENTO (convenio_banco_id, evento_id, fecha_inicio, fecha_termino)
VALUES (
    (SELECT convenio_banco_id FROM CONVENIO_BANCO WHERE banco = 'Banco Falabella' AND nombre_convenio = 'CMR Puntos y Descuento Musical'),
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Los Bunkers - Gira Acústica'),
    TO_DATE('2026-08-10', 'YYYY-MM-DD'),
    TO_DATE('2026-10-30', 'YYYY-MM-DD')
);

-- Scotiabank en Iron Maiden
INSERT INTO CONVENIO_EVENTO (convenio_banco_id, evento_id, fecha_inicio, fecha_termino)
VALUES (
    (SELECT convenio_banco_id FROM CONVENIO_BANCO WHERE banco = 'Scotiabank' AND nombre_convenio = 'Beneficio Scotia Club Live'),
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Iron Maiden - The Future Past Tour'),
    TO_DATE('2026-08-01', 'YYYY-MM-DD'),
    TO_DATE('2026-11-27', 'YYYY-MM-DD')
);

-- Tenpo en Fauna Primavera
INSERT INTO CONVENIO_EVENTO (convenio_banco_id, evento_id, fecha_inicio, fecha_termino)
VALUES (
    (SELECT convenio_banco_id FROM CONVENIO_BANCO WHERE banco = 'Tenpo' AND nombre_convenio = 'Cashback y Descuento Tenpo Fans'),
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Festival Fauna Primavera 2026'),
    TO_DATE('2026-09-01', 'YYYY-MM-DD'),
    TO_DATE('2026-12-12', 'YYYY-MM-DD')
);

-- Banco de Chile en Mon Laferte
INSERT INTO CONVENIO_EVENTO (convenio_banco_id, evento_id, fecha_inicio, fecha_termino)
VALUES (
    (SELECT convenio_banco_id FROM CONVENIO_BANCO WHERE banco = 'Banco de Chile' AND nombre_convenio = 'Descuento Clientes Banco de Chile'),
    (SELECT evento_id FROM EVENTO WHERE nombre = 'Mon Laferte - Autopoiética Tour'),
    TO_DATE('2026-08-15', 'YYYY-MM-DD'),
    TO_DATE('2026-11-08', 'YYYY-MM-DD')
);


/* ============================================================
   11. RESERVAS TEMPORALES ADICIONALES (15 nuevas en diversos estados)
   ============================================================ */

-- Reservas ACTIVAS (Vigentes: expiración en el futuro, listas para procesar_pago o pruebas)
INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'carlos.aranguiz@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Tribuna Andes Numerada' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Iron Maiden - The Future Past Tour')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 3 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Tribuna Andes' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Nacional'))),
    SYSTIMESTAMP,
    SYSTIMESTAMP + INTERVAL '2' HOUR,
    'ACTIVA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'marcela.contreras@outlook.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Cancha General' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Iron Maiden - The Future Past Tour')),
    NULL,
    SYSTIMESTAMP,
    SYSTIMESTAMP + INTERVAL '2' HOUR,
    'ACTIVA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'rodrigo.munoz@yahoo.cl'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Palco Acústico' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Los Bunkers - Gira Acústica')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 1 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán'))),
    SYSTIMESTAMP,
    SYSTIMESTAMP + INTERVAL '1' HOUR,
    'ACTIVA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'javiera.silva@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Galería Festival' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Festival Fauna Primavera 2026')),
    NULL,
    SYSTIMESTAMP,
    SYSTIMESTAMP + INTERVAL '3' HOUR,
    'ACTIVA'
);

-- Reservas EXPIRADAS (Para ejecutar y probar cancelar_reserva_expirada)
INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'felipe.herrera@hotmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Cancha de Pie' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Los Bunkers - Gira Acústica')),
    NULL,
    TIMESTAMP '2026-08-15 10:00:00',
    TIMESTAMP '2026-08-15 10:15:00',
    'EXPIRADA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'constanza.lagos@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Platea Diamante' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Mon Laferte - Autopoiética Tour')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 1 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja Diamante' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello'))),
    TIMESTAMP '2026-08-16 11:30:00',
    TIMESTAMP '2026-08-16 11:45:00',
    'EXPIRADA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'matias.sepulveda@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Tribuna Andes Numerada' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Iron Maiden - The Future Past Tour')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 4 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Tribuna Andes' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Nacional'))),
    TIMESTAMP '2026-08-17 14:00:00',
    TIMESTAMP '2026-08-17 14:15:00',
    'EXPIRADA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'francisca.reyes@uc.cl'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Platea Golden' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Festival Fauna Primavera 2026')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 1 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara'))),
    TIMESTAMP '2026-08-18 16:20:00',
    TIMESTAMP '2026-08-18 16:35:00',
    'EXPIRADA'
);

-- Reservas CONVERTIDAS (Generaron pago y tickets)
INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'gonzalo.bravo@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Tribuna Andes Numerada' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Iron Maiden - The Future Past Tour')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 5 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Tribuna Andes' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Nacional'))),
    TIMESTAMP '2026-08-11 12:00:00',
    TIMESTAMP '2026-08-11 12:15:00',
    'CONVERTIDA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'daniela.araya@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Palco Acústico' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Los Bunkers - Gira Acústica')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 2 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Teatro Caupolicán'))),
    TIMESTAMP '2026-08-11 14:00:00',
    TIMESTAMP '2026-08-11 14:15:00',
    'CONVERTIDA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'tomas.espinoza@duocuc.cl'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Platea Diamante' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Mon Laferte - Autopoiética Tour')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 2 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Platea Baja Diamante' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Gran Arena Monticello'))),
    TIMESTAMP '2026-08-12 15:30:00',
    TIMESTAMP '2026-08-12 15:45:00',
    'CONVERTIDA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'barbara.vidal@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Palco Vip Experiencia' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Festival Fauna Primavera 2026')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 2 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Palco Preferencial' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Quinta Vergara'))),
    TIMESTAMP '2026-08-12 17:00:00',
    TIMESTAMP '2026-08-12 17:15:00',
    'CONVERTIDA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'esteban.paredes@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Rapa Nui Vip' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Roger Waters - This Is Not a Drill')),
    (SELECT asiento_id FROM ASIENTO WHERE fila = 'A' AND numero = 1 AND sector_id = (SELECT sector_id FROM SECTOR_RECINTO WHERE nombre = 'Rapa Nui' AND recinto_id = (SELECT recinto_id FROM RECINTO WHERE nombre = 'Estadio Monumental'))),
    TIMESTAMP '2025-05-15 10:00:00',
    TIMESTAMP '2025-05-15 10:15:00',
    'CONVERTIDA'
);

-- Reservas CANCELADAS
INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'nicole.henriquez@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Cancha General' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Iron Maiden - The Future Past Tour')),
    NULL,
    TIMESTAMP '2026-08-13 18:00:00',
    TIMESTAMP '2026-08-13 18:15:00',
    'CANCELADA'
);

INSERT INTO RESERVA_TEMPORAL (cliente_id, localidad_evento_id, asiento_id, fecha_reserva, fecha_expiracion, estado)
VALUES (
    (SELECT cliente_id FROM CLIENTE WHERE email = 'lucas.cardenas@gmail.com'),
    (SELECT localidad_evento_id FROM LOCALIDAD_EVENTO WHERE nombre_localidad = 'Galería General' AND evento_id = (SELECT evento_id FROM EVENTO WHERE nombre = 'Los Bunkers - Gira Acústica')),
    NULL,
    TIMESTAMP '2026-08-14 19:00:00',
    TIMESTAMP '2026-08-14 19:15:00',
    'CANCELADA'
);


/* ============================================================
   12. TRANSACCIONES DE PAGO ADICIONALES (8 nuevas)
   Restricción validada: monto_final = monto_bruto - descuento
   ============================================================ */

-- Pago 6: Gonzalo Bravo - Iron Maiden con Scotiabank (20% dcto de $115.000 = $23.000 -> final $92.000)
INSERT INTO TRANSACCION_PAGO (
    reserva_id, convenio_banco_id, fecha_transaccion,
    monto_bruto, descuento, monto_final, metodo_pago, codigo_autorizacion, estado
) VALUES (
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'gonzalo.bravo@gmail.com' AND R.estado = 'CONVERTIDA'),
    (SELECT convenio_banco_id FROM CONVENIO_BANCO WHERE banco = 'Scotiabank' AND nombre_convenio = 'Beneficio Scotia Club Live'),
    TIMESTAMP '2026-08-11 12:05:00',
    115000, 23000, 92000,
    'TARJETA_CREDITO', 'AUTH-CL-000005', 'APROBADO'
);

-- Pago 7: Daniela Araya - Los Bunkers con Falabella (15% dcto de $75.000 = $11.250 -> final $63.750)
INSERT INTO TRANSACCION_PAGO (
    reserva_id, convenio_banco_id, fecha_transaccion,
    monto_bruto, descuento, monto_final, metodo_pago, codigo_autorizacion, estado
) VALUES (
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'daniela.araya@gmail.com' AND R.estado = 'CONVERTIDA'),
    (SELECT convenio_banco_id FROM CONVENIO_BANCO WHERE banco = 'Banco Falabella' AND nombre_convenio = 'CMR Puntos y Descuento Musical'),
    TIMESTAMP '2026-08-11 14:05:00',
    75000, 11250, 63750,
    'TARJETA_CREDITO', 'AUTH-CL-000006', 'APROBADO'
);

-- Pago 8: Tomás Espinoza - Mon Laferte con Banco de Chile (20% dcto de $120.000 = $24.000 -> final $96.000)
INSERT INTO TRANSACCION_PAGO (
    reserva_id, convenio_banco_id, fecha_transaccion,
    monto_bruto, descuento, monto_final, metodo_pago, codigo_autorizacion, estado
) VALUES (
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'tomas.espinoza@duocuc.cl' AND R.estado = 'CONVERTIDA'),
    (SELECT convenio_banco_id FROM CONVENIO_BANCO WHERE banco = 'Banco de Chile' AND nombre_convenio = 'Descuento Clientes Banco de Chile'),
    TIMESTAMP '2026-08-12 15:35:00',
    120000, 24000, 96000,
    'WEBPAY', 'AUTH-CL-000007', 'APROBADO'
);

-- Pago 9: Bárbara Vidal - Fauna Primavera con Tenpo (25% dcto de $145.000 = $36.250 -> final $108.750)
INSERT INTO TRANSACCION_PAGO (
    reserva_id, convenio_banco_id, fecha_transaccion,
    monto_bruto, descuento, monto_final, metodo_pago, codigo_autorizacion, estado
) VALUES (
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'barbara.vidal@gmail.com' AND R.estado = 'CONVERTIDA'),
    (SELECT convenio_banco_id FROM CONVENIO_BANCO WHERE banco = 'Tenpo' AND nombre_convenio = 'Cashback y Descuento Tenpo Fans'),
    TIMESTAMP '2026-08-12 17:05:00',
    145000, 36250, 108750,
    'TARJETA_DEBITO', 'AUTH-CL-000008', 'APROBADO'
);

-- Pago 10: Esteban Paredes - Roger Waters sin convenio (monto final = $220.000)
INSERT INTO TRANSACCION_PAGO (
    reserva_id, convenio_banco_id, fecha_transaccion,
    monto_bruto, descuento, monto_final, metodo_pago, codigo_autorizacion, estado
) VALUES (
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'esteban.paredes@gmail.com' AND R.estado = 'CONVERTIDA'),
    NULL,
    TIMESTAMP '2025-05-15 10:05:00',
    220000, 0, 220000,
    'TRANSFERENCIA', 'AUTH-CL-000009', 'APROBADO'
);

-- Pago 11: Pago RECHAZADO (Nicole Henríquez - Iron Maiden)
INSERT INTO TRANSACCION_PAGO (
    reserva_id, convenio_banco_id, fecha_transaccion,
    monto_bruto, descuento, monto_final, metodo_pago, codigo_autorizacion, estado
) VALUES (
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'nicole.henriquez@gmail.com' AND R.estado = 'CANCELADA'),
    NULL,
    TIMESTAMP '2026-08-13 18:05:00',
    69000, 0, 69000,
    'TARJETA_CREDITO', NULL, 'RECHAZADO'
);

-- Pago 12: Pago RECHAZADO (Lucas Cárdenas - Los Bunkers)
INSERT INTO TRANSACCION_PAGO (
    reserva_id, convenio_banco_id, fecha_transaccion,
    monto_bruto, descuento, monto_final, metodo_pago, codigo_autorizacion, estado
) VALUES (
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'lucas.cardenas@gmail.com' AND R.estado = 'CANCELADA'),
    NULL,
    TIMESTAMP '2026-08-14 19:05:00',
    28000, 0, 28000,
    'WEBPAY', NULL, 'RECHAZADO'
);

-- Pago 13: Pago PENDIENTE (Marcela Contreras - Cancha Iron Maiden en proceso)
INSERT INTO TRANSACCION_PAGO (
    reserva_id, convenio_banco_id, fecha_transaccion,
    monto_bruto, descuento, monto_final, metodo_pago, codigo_autorizacion, estado
) VALUES (
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'marcela.contreras@outlook.com' AND R.estado = 'ACTIVA'),
    NULL,
    SYSTIMESTAMP,
    69000, 0, 69000,
    'WEBPAY', 'AUTH-CL-000010', 'PENDIENTE'
);


/* ============================================================
   13. TICKETS EMITIDOS ADICIONALES (6 nuevos en diversos estados)
   Listos para probar anular_ticket y reportes de recaudación
   ============================================================ */

-- Ticket 5: Gonzalo Bravo (EMITIDO - listo para ser anulado o consultado)
INSERT INTO TICKET (transaccion_id, reserva_id, codigo_ticket, fecha_emision, precio_pagado, estado)
VALUES (
    (SELECT P.transaccion_id FROM TRANSACCION_PAGO P JOIN RESERVA_TEMPORAL R ON R.reserva_id = P.reserva_id JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'gonzalo.bravo@gmail.com' AND P.estado = 'APROBADO'),
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'gonzalo.bravo@gmail.com' AND R.estado = 'CONVERTIDA'),
    'TKT-IM-2026-000001',
    TIMESTAMP '2026-08-11 12:06:00',
    92000,
    'EMITIDO'
);

-- Ticket 6: Daniela Araya (EMITIDO)
INSERT INTO TICKET (transaccion_id, reserva_id, codigo_ticket, fecha_emision, precio_pagado, estado)
VALUES (
    (SELECT P.transaccion_id FROM TRANSACCION_PAGO P JOIN RESERVA_TEMPORAL R ON R.reserva_id = P.reserva_id JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'daniela.araya@gmail.com' AND P.estado = 'APROBADO'),
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'daniela.araya@gmail.com' AND R.estado = 'CONVERTIDA'),
    'TKT-BUNK-2026-000001',
    TIMESTAMP '2026-08-11 14:06:00',
    63750,
    'EMITIDO'
);

-- Ticket 7: Tomás Espinoza (EMITIDO)
INSERT INTO TICKET (transaccion_id, reserva_id, codigo_ticket, fecha_emision, precio_pagado, estado)
VALUES (
    (SELECT P.transaccion_id FROM TRANSACCION_PAGO P JOIN RESERVA_TEMPORAL R ON R.reserva_id = P.reserva_id JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'tomas.espinoza@duocuc.cl' AND P.estado = 'APROBADO'),
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'tomas.espinoza@duocuc.cl' AND R.estado = 'CONVERTIDA'),
    'TKT-MON-2026-000001',
    TIMESTAMP '2026-08-12 15:36:00',
    96000,
    'EMITIDO'
);

-- Ticket 8: Bárbara Vidal (EMITIDO)
INSERT INTO TICKET (transaccion_id, reserva_id, codigo_ticket, fecha_emision, precio_pagado, estado)
VALUES (
    (SELECT P.transaccion_id FROM TRANSACCION_PAGO P JOIN RESERVA_TEMPORAL R ON R.reserva_id = P.reserva_id JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'barbara.vidal@gmail.com' AND P.estado = 'APROBADO'),
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'barbara.vidal@gmail.com' AND R.estado = 'CONVERTIDA'),
    'TKT-FAU-2026-000001',
    TIMESTAMP '2026-08-12 17:06:00',
    108750,
    'EMITIDO'
);

-- Ticket 9: Esteban Paredes (USADO - de Roger Waters en 2025, ideal para probar que no se puede anular un ticket USADO)
INSERT INTO TICKET (transaccion_id, reserva_id, codigo_ticket, fecha_emision, precio_pagado, estado)
VALUES (
    (SELECT P.transaccion_id FROM TRANSACCION_PAGO P JOIN RESERVA_TEMPORAL R ON R.reserva_id = P.reserva_id JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'esteban.paredes@gmail.com' AND P.estado = 'APROBADO'),
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'esteban.paredes@gmail.com' AND R.estado = 'CONVERTIDA'),
    'TKT-RW-2025-000001',
    TIMESTAMP '2025-05-15 10:06:00',
    220000,
    'USADO'
);


/* ============================================================
   14. AUDITORÍA: LOG_CAMBIO_PRECIO ADICIONALES
   Para validar procedimientos de ajuste con cursores
   ============================================================ */

INSERT INTO LOG_CAMBIO_PRECIO (localidad_evento_id, precio_anterior, precio_nuevo, fecha_cambio, administrador_id)
VALUES (
    (SELECT LE.localidad_evento_id FROM LOCALIDAD_EVENTO LE JOIN EVENTO E ON E.evento_id = LE.evento_id WHERE E.nombre = 'Iron Maiden - The Future Past Tour' AND LE.nombre_localidad = 'Cancha General'),
    59000,
    69000,
    TIMESTAMP '2026-08-05 09:00:00',
    (SELECT administrador_id FROM ADMINISTRADOR WHERE email = 'ignacio.valenzuela@puntoticket-demo.cl')
);

INSERT INTO LOG_CAMBIO_PRECIO (localidad_evento_id, precio_anterior, precio_nuevo, fecha_cambio, administrador_id)
VALUES (
    (SELECT LE.localidad_evento_id FROM LOCALIDAD_EVENTO LE JOIN EVENTO E ON E.evento_id = LE.evento_id WHERE E.nombre = 'Los Bunkers - Gira Acústica' AND LE.nombre_localidad = 'Cancha de Pie'),
    38000,
    42000,
    TIMESTAMP '2026-08-08 11:15:00',
    (SELECT administrador_id FROM ADMINISTRADOR WHERE email = 'paula.navarro@puntoticket-demo.cl')
);

INSERT INTO LOG_CAMBIO_PRECIO (localidad_evento_id, precio_anterior, precio_nuevo, fecha_cambio, administrador_id)
VALUES (
    (SELECT LE.localidad_evento_id FROM LOCALIDAD_EVENTO LE JOIN EVENTO E ON E.evento_id = LE.evento_id WHERE E.nombre = 'Festival Fauna Primavera 2026' AND LE.nombre_localidad = 'Galería Festival'),
    45000,
    55000,
    TIMESTAMP '2026-08-25 15:30:00',
    (SELECT administrador_id FROM ADMINISTRADOR WHERE email = 'camila.fuentes@puntoticket-demo.cl')
);


/* ============================================================
   15. AUDITORÍA: LOG_ANULACIONES ADICIONALES
   ============================================================ */

INSERT INTO LOG_ANULACIONES (ticket_id, transaccion_id, reserva_id, administrador_id, motivo, fecha_anulacion)
VALUES (
    NULL,
    (SELECT P.transaccion_id FROM TRANSACCION_PAGO P JOIN RESERVA_TEMPORAL R ON R.reserva_id = P.reserva_id JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'nicole.henriquez@gmail.com' AND P.estado = 'RECHAZADO'),
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'nicole.henriquez@gmail.com' AND R.estado = 'CANCELADA'),
    (SELECT administrador_id FROM ADMINISTRADOR WHERE email = 'ignacio.valenzuela@puntoticket-demo.cl'),
    'Fallo de fondos insuficientes en tarjeta bancaria durante la compra.',
    TIMESTAMP '2026-08-13 18:06:00'
);

INSERT INTO LOG_ANULACIONES (ticket_id, transaccion_id, reserva_id, administrador_id, motivo, fecha_anulacion)
VALUES (
    NULL,
    (SELECT P.transaccion_id FROM TRANSACCION_PAGO P JOIN RESERVA_TEMPORAL R ON R.reserva_id = P.reserva_id JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'lucas.cardenas@gmail.com' AND P.estado = 'RECHAZADO'),
    (SELECT R.reserva_id FROM RESERVA_TEMPORAL R JOIN CLIENTE C ON C.cliente_id = R.cliente_id WHERE C.email = 'lucas.cardenas@gmail.com' AND R.estado = 'CANCELADA'),
    (SELECT administrador_id FROM ADMINISTRADOR WHERE email = 'paula.navarro@puntoticket-demo.cl'),
    'Timeout en pasarela Webpay al procesar la transacción.',
    TIMESTAMP '2026-08-14 19:06:00'
);


/* ============================================================
   CONFIRMACIÓN PERMANENTE
   ============================================================ */

COMMIT;


/* ============================================================================
   GUÍA DE PRUEBAS: CÓMO TESTEAR LAS FUNCIONES Y PROCEDIMIENTOS DE CLASE
   ============================================================================

   -- 1. Probar stock_total_evento (Función):
   SELECT evento_id, nombre, estado, stock_total_evento(evento_id) AS stock_total
   FROM EVENTO
   ORDER BY stock_total DESC;
   -- Nota: Verás eventos con mucho stock (Iron Maiden, Fauna), y eventos en 0 (Duki).

   -- 2. Probar recaudacion_evento (Función Ejercicio Propuesto 2):
   SELECT evento_id, nombre, estado, recaudacion_evento(evento_id) AS total_recaudado
   FROM EVENTO
   ORDER BY total_recaudado DESC;

   -- 3. Probar cancelar_reserva_expirada (Procedimiento con OUT):
   DECLARE
       v_reserva_id NUMBER;
       v_cliente    VARCHAR2(160);
   BEGIN
       -- Tomamos una de las reservas expiradas agregadas:
       SELECT reserva_id INTO v_reserva_id
       FROM RESERVA_TEMPORAL
       WHERE estado = 'EXPIRADA' AND ROWNUM = 1;

       cancelar_reserva_expirada(v_reserva_id, v_cliente);
       DBMS_OUTPUT.PUT_LINE('Reserva ' || v_reserva_id || ' cancelada. Cliente a contactar: ' || v_cliente);
       ROLLBACK; -- Para no alterar los datos permanentes
   END;
   /

   -- 4. Probar anular_ticket (Procedimiento Ejercicio Propuesto 1):
   DECLARE
       v_tkt_id NUMBER;
       v_adm_id NUMBER;
   BEGIN
       SELECT ticket_id INTO v_tkt_id FROM TICKET WHERE codigo_ticket = 'TKT-IM-2026-000001';
       SELECT administrador_id INTO v_adm_id FROM ADMINISTRADOR WHERE email = 'ignacio.valenzuela@puntoticket-demo.cl';

       anular_ticket(v_tkt_id, 'Solicitud de anulación por retracto del cliente', v_adm_id);
       DBMS_OUTPUT.PUT_LINE('Ticket ' || v_tkt_id || ' anulado exitosamente.');
       ROLLBACK;
   END;
   /

   -- 5. Probar aplicar_descuento_convenio (Procedimiento con IN OUT):
   DECLARE
       v_monto NUMBER := 100000;
       v_id_convenio NUMBER;
   BEGIN
       -- Convenio activo (Tenpo 25%):
       SELECT convenio_banco_id INTO v_id_convenio FROM CONVENIO_BANCO WHERE banco = 'Tenpo';
       aplicar_descuento_convenio(v_monto, v_id_convenio);
       DBMS_OUTPUT.PUT_LINE('Monto con Tenpo: $' || v_monto); -- Debería ser 75000

       -- Convenio inactivo (Itaú - activo = 'N'):
       SELECT convenio_banco_id INTO v_id_convenio FROM CONVENIO_BANCO WHERE banco = 'Itaú';
       aplicar_descuento_convenio(v_monto, v_id_convenio);
       DBMS_OUTPUT.PUT_LINE('Monto con convenio inactivo: $' || v_monto); -- Queda igual por NO_DATA_FOUND
   END;
   /
   ============================================================================ */
