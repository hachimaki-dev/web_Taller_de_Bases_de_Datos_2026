// s2_3_2_slides.js — Paquetes PL/SQL (Packages): Casos Avanzados y Arquitectura
// Progresión pedagógica basada en problemas reales (Punto Ticket)

const s2_3_2_slides = [
    // 1. Portada
    {
        class: 'title-slide',
        html: `
            <h1>Paquetes en PL/SQL: Casos Avanzados</h1>
            <p class="subtitle">Unidad 2.3 — Sesión 2: Arquitectura Empresarial y Gestión de Dependencias</p>
            <p class="subtitle">Taller de Bases de Datos — Punto Ticket</p>
            <div class="alien-separator">👽</div>
        `
    },

    // 2. El Escenario Real
    {
        html: `
            <h2>El Escenario: Venta Masiva en Punto Ticket</h2>
            <div class="concept-box">
                En el lanzamiento de entradas para un concierto masivo en el Estadio Nacional, miles de usuarios intentan comprar al mismo tiempo a través de tres canales distintos:
            </div>
            <table>
                <tr><th>Canal</th><th>Rol en el Negocio</th><th>Riesgo Operativo</th></tr>
                <tr><td>🌐 <strong>Web / App Móvil</strong></td><td>Venta masiva concurrente de clientes</td><td>Alta concurrencia y lentitud por I/O</td></tr>
                <tr><td>🏢 <strong>Boletería Física</strong></td><td>Cajeros en el recinto emitiendo tickets en vivo</td><td>Control de cuadratura y arqueo por turno</td></tr>
                <tr><td>🏦 <strong>Convenios Banco</strong></td><td>Validación de descuentos comerciales en línea</td><td>Reglas de negocio cambiantes a última hora</td></tr>
            </table>
            <div class="warning-box">
                Cada canal debe ejecutar la misma secuencia: consultar precio con descuento, reservar cupo por 15 minutos, generar un código anti-fraude y emitir el ticket.
            </div>
        `
    },

    // 3. El Problema con Objetos Sueltos
    {
        html: `
            <h2>El Problema: Por qué fallan los procedimientos sueltos</h2>
            <div class="concept-box">
                Si implementamos esta lógica con procedimientos y funciones independientes en la base de datos:
            </div>
            <ul>
                <li>🚨 <strong>Brecha de Seguridad:</strong> La función que genera el código alfanumérico del ticket queda expuesta en el esquema. Si tiene permiso <code>EXECUTE</code>, cualquier app o usuario puede invocarla y fabricar entradas válidas sin pagar.</li>
                <li>💥 <strong>Efecto Dominó (Invalidación):</strong> Si el DBA ajusta el procedimiento de descuento a las 11:59 AM, Oracle marca en estado <code>INVALID</code> a todas las vistas y procedimientos dependientes, botando la venta web en pleno lanzamiento.</li>
                <li>🌀 <strong>Dispersión de Reglas:</strong> Si el tiempo de reserva cambia de 15 a 10 minutos, hay que rastrear y modificar múltiples scripts sueltos.</li>
            </ul>
        `
    },

    // 4. El Análisis
    {
        html: `
            <h2>El Análisis: La Necesidad de una "Caja Negra"</h2>
            <div class="concept-box">
                Para resolver estos problemas de seguridad y disponibilidad, la arquitectura debe cumplir tres requisitos:
            </div>
            <table>
                <tr><th>Requisito</th><th>¿Por qué es crítico?</th><th>Objetivo</th></tr>
                <tr>
                    <td><strong>Ocultamiento (Privacidad)</strong></td>
                    <td>La generación de códigos de entrada no debe ser accesible desde fuera.</td>
                    <td>Impedir la falsificación de tickets.</td>
                </tr>
                <tr>
                    <td><strong>Interfaz Pública Estable</strong></td>
                    <td>La web solo debe pedir: <em>calcular precio</em>, <em>reservar</em> y <em>pagar</em>.</td>
                    <td>Desacoplar el frontend de la base de datos.</td>
                </tr>
                <tr>
                    <td><strong>Cero Caída de Servicio</strong></td>
                    <td>Cambiar la lógica interna sin romper las llamadas activas.</td>
                    <td>Evitar la invalidación masiva en producción.</td>
                </tr>
            </table>
        `
    },

    // 5. La Solución Conceptual
    {
        html: `
            <h2>La Solución: Paquetes en Oracle (Packages)</h2>
            <div class="concept-box">
                Un paquete (<code>PACKAGE</code>) es un objeto compuesto que agrupa lógicamente constantes, variables, tipos, excepciones, procedimientos y funciones relacionados.
            </div>
            <div class="analogy-box">
                <strong>Estructura en dos partes separadas:</strong>
                <ul>
                    <li><strong>Especificación (Spec):</strong> La fachada pública. Actúa como el control remoto o la ventanilla de atención: solo muestra los botones que el mundo exterior puede accionar.</li>
                    <li><strong>Cuerpo (Body):</strong> La maquinaria sellada. Contiene el código ejecutable y las funciones privadas que nadie desde el exterior puede ver ni ejecutar.</li>
                </ul>
            </div>
        `
    },

    // 6. El Plano de Arquitectura
    {
        html: `
            <h2>El Plano: Componentes de pkg_venta_entradas</h2>
            <div class="concept-box">
                Antes de escribir código, definimos los elementos que integrará el paquete:
            </div>
            <table>
                <tr><th>Elemento</th><th>Tipo</th><th>Visibilidad</th><th>Propósito</th></tr>
                <tr><td><code>c_tiempo_reserva_min</code></td><td>Constante</td><td>Pública</td><td>Tiempo oficial de reserva (15 min).</td></tr>
                <tr><td><code>e_sin_stock</code></td><td>Excepción</td><td>Pública</td><td>Alerta de localidad agotada.</td></tr>
                <tr><td><code>g_tickets_emitidos</code></td><td>Variable</td><td>Pública</td><td>Contador de tickets vendidos en la sesión.</td></tr>
                <tr><td><code>calcular_total</code></td><td>Función</td><td>Pública</td><td>Calcula precio con convenio de banco.</td></tr>
                <tr><td><code>iniciar_reserva</code></td><td>Procedimiento</td><td>Pública</td><td>Bloquea stock en RESERVA_TEMPORAL.</td></tr>
                <tr><td><code>generar_codigo_ticket</code></td><td>Función</td><td><strong>Privada</strong></td><td>Genera hash anti-fraude (solo en el Body).</td></tr>
                <tr><td><code>confirmar_compra</code></td><td>Procedimiento</td><td>Pública</td><td>Crea el ticket usando la función privada.</td></tr>
            </table>
        `
    },

    // 7. Paso 1: La Especificación
    {
        html: `
            <h2>Paso 1: La Especificación (El Contrato Público)</h2>
            <div class="concept-box">
                Declaramos la interfaz con las constantes, excepciones y firmas visibles:
            </div>
<pre><span class="kw">CREATE OR REPLACE PACKAGE</span> pkg_venta_entradas <span class="kw">AS</span>
    <span class="cm">-- Constante y excepción públicas</span>
    c_tiempo_reserva_min <span class="kw">CONSTANT NUMBER</span> := <span class="num">15</span>;
    e_sin_stock          <span class="kw">EXCEPTION</span>;

    <span class="cm">-- Variable de sesión (auditoría por cajero)</span>
    g_tickets_emitidos   <span class="kw">NUMBER</span> := <span class="num">0</span>;

    <span class="cm">-- Firmas de servicios públicos</span>
    <span class="kw">FUNCTION</span> calcular_total(
        p_localidad_id <span class="kw">IN NUMBER</span>,
        p_convenio_id  <span class="kw">IN NUMBER DEFAULT NULL</span>
    ) <span class="kw">RETURN NUMBER</span>;

    <span class="kw">PROCEDURE</span> iniciar_reserva(
        p_cliente_id   <span class="kw">IN NUMBER</span>,
        p_localidad_id <span class="kw">IN NUMBER</span>,
        p_reserva_id   <span class="kw">OUT NUMBER</span>
    );

    <span class="kw">PROCEDURE</span> confirmar_compra(p_reserva_id <span class="kw">IN NUMBER</span>);
<span class="kw">END</span> pkg_venta_entradas;
/</pre>
        `
    },

    // 8. Regla Estricta de la Especificación
    {
        html: `
            <h2>Regla Estricta: Qué NO puede ir en la Especificación</h2>
            <div class="warning-box">
                La especificación <strong>solo contiene declaraciones terminadas en punto y coma</strong>. No contiene bloques ejecutables.
            </div>
            <table>
                <tr><th>Elemento</th><th>¿Permitido en Spec?</th><th>Razón</th></tr>
                <tr><td>Constantes y tipos</td><td>✅ Sí</td><td>Necesarios para que los clientes conozcan los parámetros.</td></tr>
                <tr><td>Firmas de funciones/procedimientos</td><td>✅ Sí</td><td>Define el contrato de llamada (nombre y argumentos).</td></tr>
                <tr><td>Bloques <code>BEGIN ... END</code></td><td>❌ NO</td><td>El código ejecutable pertenece exclusivamente al BODY.</td></tr>
                <tr><td>Sentencias <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code></td><td>❌ NO</td><td>Provoca error de compilación inmediato.</td></tr>
            </table>
        `
    },

    // 9. Paso 2: La Función Privada de Seguridad
    {
        html: `
            <h2>Paso 2: La Maquinaria Privada (Función Oculta)</h2>
            <div class="concept-box">
                En el <code>PACKAGE BODY</code> programamos la función <code>generar_codigo_ticket</code>. Al <strong>no declararla en la Spec</strong>, queda totalmente protegida:
            </div>
<pre><span class="kw">CREATE OR REPLACE PACKAGE BODY</span> pkg_venta_entradas <span class="kw">AS</span>

    <span class="cm">-- OBJETO PRIVADO: Solo invocable desde dentro de este BODY</span>
    <span class="kw">FUNCTION</span> generar_codigo_ticket(p_reserva_id <span class="kw">NUMBER</span>) 
    <span class="kw">RETURN VARCHAR2 IS</span>
    <span class="kw">BEGIN</span>
        <span class="cm">-- Genera código criptográfico con timestamp y reserva</span>
        <span class="kw">RETURN</span> <span class="str">'TKT-'</span> || p_reserva_id || <span class="str">'-'</span> || 
               TO_CHAR(SYSTIMESTAMP, <span class="str">'HH24MISSFF3'</span>);
    <span class="kw">END</span> generar_codigo_ticket;

    <span class="cm">-- (Aquí siguen las funciones y procedimientos públicos...)</span>
<span class="kw">END</span> pkg_venta_entradas;
/</pre>
        `
    },

    // 10. Prueba de Fuego: Error PLS-00302
    {
        html: `
            <h2>Prueba de Seguridad: Intentar invocar el objeto privado</h2>
            <div class="concept-box">
                ¿Qué sucede si un programador o un atacante intenta llamar a la función privada desde un bloque exterior?
            </div>
<pre><span class="kw">BEGIN</span>
    <span class="cm">-- Intento directo de llamar al generador de códigos:</span>
    DBMS_OUTPUT.PUT_LINE(pkg_venta_entradas.generar_codigo_ticket(<span class="num">100</span>));
<span class="kw">END</span>;
/</pre>
            <div class="warning-box">
                <strong>Respuesta del compilador de Oracle:</strong><br>
                <code>ORA-06550: línea 2, columna 26:</code><br>
                <code>PLS-00302: component 'GENERAR_CODIGO_TICKET' must be declared</code>
            </div>
            <div class="tip-box">
                Para el mundo exterior, la función no existe. La integridad del sistema queda blindada contra ejecuciones no autorizadas.
            </div>
        `
    },

    // 11. Paso 3: Motor de Precios
    {
        html: `
            <h2>Paso 3: Implementar la Función Pública calcular_total</h2>
            <div class="concept-box">
                Implementamos el cálculo de precios consultando <code>LOCALIDAD_EVENTO</code> y los descuentos de <code>CONVENIO_BANCO</code>:
            </div>
<pre><span class="cm">    -- Dentro del BODY de pkg_venta_entradas:</span>
    <span class="kw">FUNCTION</span> calcular_total(
        p_localidad_id <span class="kw">IN NUMBER</span>,
        p_convenio_id  <span class="kw">IN NUMBER DEFAULT NULL</span>
    ) <span class="kw">RETURN NUMBER IS</span>
        v_precio    <span class="kw">NUMBER</span>;
        v_descuento <span class="kw">NUMBER</span> := <span class="num">0</span>;
    <span class="kw">BEGIN</span>
        <span class="kw">SELECT</span> precio <span class="kw">INTO</span> v_precio
        <span class="kw">FROM</span> LOCALIDAD_EVENTO
        <span class="kw">WHERE</span> localidad_evento_id = p_localidad_id;

        <span class="kw">IF</span> p_convenio_id <span class="kw">IS NOT NULL THEN</span>
            <span class="kw">SELECT</span> NVL(descuento_porcentaje, <span class="num">0</span>) <span class="kw">INTO</span> v_descuento
            <span class="kw">FROM</span> CONVENIO_BANCO
            <span class="kw">WHERE</span> convenio_banco_id = p_convenio_id <span class="kw">AND</span> activo = <span class="str">'S'</span>;
        <span class="kw">END IF</span>;

        <span class="kw">RETURN ROUND</span>(v_precio * (<span class="num">1</span> - (v_descuento / <span class="num">100</span>)));
    <span class="kw">END</span> calcular_total;</pre>
        `
    },

    // 12. Uso en SQL
    {
        html: `
            <h2>Uso Directo en SQL: Consultas de Cartelera</h2>
            <div class="concept-box">
                Como la función <code>calcular_total</code> no realiza operaciones DML (INSERT, UPDATE), puede ser utilizada directamente dentro de consultas <code>SELECT</code>:
            </div>
<pre><span class="cm">-- Cartelera web: comparar precio lista vs precio con convenio banco</span>
<span class="kw">SELECT</span> 
    nombre_localidad,
    precio <span class="kw">AS</span> precio_lista,
    pkg_venta_entradas.calcular_total(localidad_evento_id, <span class="num">1</span>) <span class="kw">AS</span> precio_banco_chile,
    pkg_venta_entradas.calcular_total(localidad_evento_id, <span class="num">2</span>) <span class="kw">AS</span> precio_banco_estado
<span class="kw">FROM</span> LOCALIDAD_EVENTO
<span class="kw">WHERE</span> evento_id = <span class="num">1</span>;</pre>
            <div class="tip-box">
                La lógica de cálculo de convenios queda centralizada en el paquete. Si la fórmula cambia, se actualiza en un solo lugar sin modificar reportes ni consultas SQL externas.
            </div>
        `
    },

    // 13. Paso 4: Reserva Temporal
    {
        html: `
            <h2>Paso 4: Bloqueo de Stock con iniciar_reserva</h2>
            <div class="concept-box">
                El procedimiento valida el stock disponible y crea la reserva temporal usando la constante del paquete:
            </div>
<pre><span class="cm">    -- Dentro del BODY de pkg_venta_entradas:</span>
    <span class="kw">PROCEDURE</span> iniciar_reserva(
        p_cliente_id   <span class="kw">IN NUMBER</span>,
        p_localidad_id <span class="kw">IN NUMBER</span>,
        p_reserva_id   <span class="kw">OUT NUMBER</span>
    ) <span class="kw">IS</span>
        v_stock <span class="kw">NUMBER</span>;
    <span class="kw">BEGIN</span>
        <span class="kw">SELECT</span> stock_disponible <span class="kw">INTO</span> v_stock
        <span class="kw">FROM</span> LOCALIDAD_EVENTO
        <span class="kw">WHERE</span> localidad_evento_id = p_localidad_id;

        <span class="kw">IF</span> v_stock &lt;= <span class="num">0</span> <span class="kw">THEN</span>
            <span class="kw">RAISE</span> e_sin_stock; <span class="cm">-- Dispara excepción declarada en la Spec</span>
        <span class="kw">END IF</span>;

        <span class="kw">INSERT INTO</span> RESERVA_TEMPORAL (
            cliente_id, localidad_evento_id, fecha_expiracion, estado
        ) <span class="kw">VALUES</span> (
            p_cliente_id, p_localidad_id,
            SYSTIMESTAMP + NUMTODSINTERVAL(c_tiempo_reserva_min, <span class="str">'MINUTE'</span>),
            <span class="str">'ACTIVA'</span>
        ) <span class="kw">RETURNING</span> reserva_id <span class="kw">INTO</span> p_reserva_id;
    <span class="kw">END</span> iniciar_reserva;</pre>
        `
    },

    // 14. Paso 5: Emisión del Ticket
    {
        html: `
            <h2>Paso 5: Emisión Conectando la Función Privada</h2>
            <div class="concept-box">
                <code>confirmar_compra</code> conecta la reserva con el código generado por la función privada y actualiza el contador de sesión:
            </div>
<pre><span class="cm">    -- Dentro del BODY de pkg_venta_entradas:</span>
    <span class="kw">PROCEDURE</span> confirmar_compra(p_reserva_id <span class="kw">IN NUMBER</span>) <span class="kw">IS</span>
        v_codigo    <span class="kw">VARCHAR2</span>(<span class="num">50</span>);
        v_localidad <span class="kw">NUMBER</span>;
        v_precio    <span class="kw">NUMBER</span>;
    <span class="kw">BEGIN</span>
        <span class="cm">-- 1. Invoca a la función privada interna</span>
        v_codigo := generar_codigo_ticket(p_reserva_id);

        <span class="cm">-- 2. Obtiene datos y actualiza la reserva</span>
        <span class="kw">SELECT</span> localidad_evento_id <span class="kw">INTO</span> v_localidad
        <span class="kw">FROM</span> RESERVA_TEMPORAL <span class="kw">WHERE</span> reserva_id = p_reserva_id;

        <span class="kw">SELECT</span> precio <span class="kw">INTO</span> v_precio
        <span class="kw">FROM</span> LOCALIDAD_EVENTO <span class="kw">WHERE</span> localidad_evento_id = v_localidad;

        <span class="kw">UPDATE</span> RESERVA_TEMPORAL <span class="kw">SET</span> estado = <span class="str">'CONVERTIDA'</span> 
        <span class="kw">WHERE</span> reserva_id = p_reserva_id;

        <span class="cm">-- 3. Emite el ticket e incrementa el contador de sesión</span>
        <span class="kw">INSERT INTO</span> TICKET (transaccion_id, reserva_id, codigo_ticket, precio_pagado, estado)
        <span class="kw">VALUES</span> (<span class="num">1</span>, p_reserva_id, v_codigo, v_precio, <span class="str">'EMITIDO'</span>);

        g_tickets_emitidos := g_tickets_emitidos + <span class="num">1</span>;
    <span class="kw">END</span> confirmar_compra;</pre>
        `
    },

    // 15. Paso 6: Memoria de Sesión y Bloque de Inicialización
    {
        html: `
            <h2>Paso 6: Estado de Sesión y Bloque de Inicialización</h2>
            <div class="concept-box">
                Las variables de paquete persisten en la memoria PGA durante toda la conexión del usuario. Al final del <code>PACKAGE BODY</code> agregamos un bloque de inicialización:
            </div>
<pre><span class="kw">CREATE OR REPLACE PACKAGE BODY</span> pkg_venta_entradas <span class="kw">AS</span>
    <span class="cm">-- (Implementación de subprogramas...)</span>

<span class="kw">BEGIN</span>
    <span class="cm">-- Se ejecuta AUTOMÁTICAMENTE una sola vez al inicio de la sesión</span>
    g_tickets_emitidos := <span class="num">0</span>;
    DBMS_OUTPUT.PUT_LINE(<span class="str">'[SESIÓN] Turno iniciado. Contador en 0.'</span>);

<span class="kw">EXCEPTION</span>
    <span class="kw">WHEN OTHERS THEN</span>
        DBMS_OUTPUT.PUT_LINE(<span class="str">'Error al inicializar paquete: '</span> || SQLERRM);
<span class="kw">END</span> pkg_venta_entradas;
/</pre>
            <div class="tip-box">
                Permite inicializar contadores, validar permisos de usuario o cargar parámetros en memoria sin intervención manual.
            </div>
        `
    },

    // 16. Aislamiento de Memoria entre Sesiones
    {
        html: `
            <h2>Aislamiento de Estado: Cajero A vs Cajero B</h2>
            <div class="concept-box">
                Cada usuario conectado a la base de datos posee su propia instancia de memoria PGA:
            </div>
            <table>
                <tr><th>Momento</th><th>Sesión 1 (Cajero Juan)</th><th>Sesión 2 (Cajera María)</th></tr>
                <tr><td>10:00 AM</td><td>Se conecta → <code>g_tickets_emitidos = 0</code></td><td>No conectada aún</td></tr>
                <tr><td>10:15 AM</td><td>Emite 4 tickets → <code>g_tickets_emitidos = 4</code></td><td>Se conecta → <code>g_tickets_emitidos = 0</code></td></tr>
                <tr><td>10:30 AM</td><td><code>g_tickets_emitidos = 4</code></td><td>Emite 2 tickets → <code>g_tickets_emitidos = 2</code></td></tr>
                <tr><td>11:00 AM</td><td>Se desconecta (memoria PGA liberada)</td><td>Sigue en 2 tickets</td></tr>
            </table>
            <div class="tip-box">
                Las variables de paquete mantienen estado privado por sesión, sin interferencias entre usuarios simultáneos.
            </div>
        `
    },

    // 17. Puesta en Marcha: Flujo Completo
    {
        html: `
            <h2>Puesta en Marcha: Simulación de Compra en Vivo</h2>
            <div class="concept-box">
                Probamos la integración completa del paquete mediante un bloque anónimo:
            </div>
<pre><span class="kw">DECLARE</span>
    v_total      <span class="kw">NUMBER</span>;
    v_reserva_id <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="cm">-- 1. Consultar precio con convenio Banco de Chile (ID 1)</span>
    v_total := pkg_venta_entradas.calcular_total(<span class="num">1</span>, <span class="num">1</span>);
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Total con descuento: $'</span> || v_total);

    <span class="cm">-- 2. Iniciar reserva de cliente Diego Morales (ID 2)</span>
    pkg_venta_entradas.iniciar_reserva(<span class="num">2</span>, <span class="num">1</span>, v_reserva_id);
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Reserva generada #'</span> || v_reserva_id);

    <span class="cm">-- 3. Confirmar compra (invoca función privada interna)</span>
    pkg_venta_entradas.confirmar_compra(v_reserva_id);

    <span class="cm">-- 4. Verificar contador de sesión</span>
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Tickets en este turno: '</span> || 
        pkg_venta_entradas.g_tickets_emitidos);

    <span class="kw">ROLLBACK</span>; <span class="cm">-- Limpieza de prueba</span>
<span class="kw">END</span>;
/</pre>
        `
    },

    // 18. Sobrecarga (Overloading)
    {
        html: `
            <h2>Requerimiento Extra: Sobrecarga (Overloading)</h2>
            <div class="concept-box">
                El canal web necesita cancelar reservas expiradas automáticamente solo por ID, mientras que la boletería necesita cancelar indicando un motivo explícito:
            </div>
<pre><span class="kw">CREATE OR REPLACE PACKAGE</span> pkg_venta_entradas <span class="kw">AS</span>
    <span class="cm">-- Sobrecarga 1: Cancelación automática por sistema</span>
    <span class="kw">PROCEDURE</span> cancelar_reserva(p_reserva_id <span class="kw">IN NUMBER</span>);

    <span class="cm">-- Sobrecarga 2: Cancelación manual con motivo de auditoría</span>
    <span class="kw">PROCEDURE</span> cancelar_reserva(
        p_reserva_id <span class="kw">IN NUMBER</span>,
        p_motivo     <span class="kw">IN VARCHAR2</span>
    );
<span class="kw">END</span> pkg_venta_entradas;
/</pre>
            <div class="warning-box">
                <strong>Regla de Oracle:</strong> La sobrecarga exige que los parámetros difieran en número o tipo de datos. No es válido sobrecargar funciones cuya única diferencia sea el tipo de dato retornado (<code>RETURN</code>).
            </div>
        `
    },

    // 19. Crisis en Producción
    {
        html: `
            <h2>La Prueba de Fuego: Cambio de Reglas en Producción</h2>
            <div class="concept-box">
                A 10 minutos de abrir la venta general, el banco patrocinador modifica su porcentaje comercial y exige redondeo especial en los precios:
            </div>
            <table>
                <tr><th>Escenario</th><th>Con Procedimientos Sueltos</th><th>Con Packages (Spec + Body)</th></tr>
                <tr>
                    <td><strong>Modificación</strong></td>
                    <td>Recompilar <code>sp_calcular_precio</code></td>
                    <td>Modificar solo el <code>PACKAGE BODY</code></td>
                </tr>
                <tr>
                    <td><strong>Impacto en Dependencias</strong></td>
                    <td>Todas las vistas, triggers y APIs clientes pasan a estado <code>INVALID</code>.</td>
                    <td>La <code>SPEC</code> permanece intacta → <strong>¡Cero objetos invalidados!</strong></td>
                </tr>
                <tr>
                    <td><strong>Resultado en Producción</strong></td>
                    <td>Error ORA-04068 y caída de la venta web.</td>
                    <td>Cambio en caliente sin interrumpir el servicio.</td>
                </tr>
            </table>
        `
    },

    // 20. Verificación en el Diccionario de Datos
    {
        html: `
            <h2>Comprobación de Dependencias en USER_OBJECTS</h2>
            <div class="concept-box">
                Al recompilar únicamente el cuerpo del paquete, verificamos que la especificación y los programas clientes mantienen su validez:
            </div>
<pre><span class="kw">SELECT</span> object_name, object_type, status
<span class="kw">FROM</span> user_objects
<span class="kw">WHERE</span> object_name = <span class="str">'PKG_VENTA_ENTRADAS'</span>;

<span class="cm">-- RESULTADO:</span>
<span class="cm">-- OBJECT_NAME         OBJECT_TYPE     STATUS</span>
<span class="cm">-- ------------------  --------------  -------</span>
<span class="cm">-- PKG_VENTA_ENTRADAS  PACKAGE         VALID   &lt;-- La Spec no cambió</span>
<span class="cm">-- PKG_VENTA_ENTRADAS  PACKAGE BODY    VALID   &lt;-- Se actualizó en caliente</span></pre>
            <div class="tip-box">
                Esta independencia de compilación es el motivo por el cual los estándares de desarrollo empresarial exigen empaquetar todo el código PL/SQL en producción.
            </div>
        `
    },

    // 21. Errores Comunes de Compilación
    {
        html: `
            <h2>Diagnóstico de Errores Frecuentes</h2>
            <table>
                <tr><th>Código Oracle</th><th>Causa Técnica</th><th>Corrección</th></tr>
                <tr>
                    <td><code>PLS-00302</code><br><em>component must be declared</em></td>
                    <td>Se intenta invocar un objeto privado que no está en la Spec.</td>
                    <td>Si debe ser público, agregar la firma a la Spec. Si es privado, invocarlo solo desde el Body.</td>
                </tr>
                <tr>
                    <td><code>PLS-00323</code><br><em>subprogram declared in spec not matched in body</em></td>
                    <td>Discrepancia entre la firma de la Spec y del Body (diferente orden, tipo o nombre de parámetro).</td>
                    <td>Asegurar que la cabecera en el Body sea una copia textual de la declaración en la Spec.</td>
                </tr>
                <tr>
                    <td><code>ORA-06508</code><br><em>could not find program unit</em></td>
                    <td>Se compiló la Spec pero no existe o no compiló el <code>PACKAGE BODY</code>.</td>
                    <td>Compilar el script del <code>CREATE OR REPLACE PACKAGE BODY</code>.</td>
                </tr>
            </table>
        `
    },

    // 22. Checklist de Diseño
    {
        html: `
            <h2>Checklist Profesional de Diseño de Paquetes</h2>
            <div class="concept-box">
                Criterios de ingeniería para crear paquetes en bases de datos empresariales:
            </div>
            <ul>
                <li>🎯 <strong>Alta Cohesión:</strong> Agrupar objetos que pertenezcan al mismo proceso de negocio (ventas, postventa, auditoría). Evitar paquetes utilitarios genéricos sin foco.</li>
                <li>🔒 <strong>Mínima Superficie Pública:</strong> Exponer en la Spec solo lo indispensable. Todo algoritmo auxiliar debe permanecer privado en el Body.</li>
                <li>⚡ <strong>Centralización de Constantes:</strong> Definir tiempos de expiración, tasas de IVA y porcentajes en constantes de paquete para eliminar números mágicos.</li>
                <li>🛡️ <strong>Uso Responsable de Memoria PGA:</strong> Las variables de paquete viven durante toda la sesión del usuario. No almacenar colecciones masivas de registros en memoria.</li>
            </ul>
            <div class="tip-box">
                Continúa en la pestaña <strong>Guía Práctica</strong> para resolver los ejercicios interactivos y las dos problemáticas de aplicación real: <code>pkg_gestion_eventos</code> y <code>pkg_postventa_ticket</code>.
            </div>
        `
    }
];
