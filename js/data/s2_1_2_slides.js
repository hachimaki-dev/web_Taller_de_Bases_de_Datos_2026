// s2_1_2_slides.js — Procedimientos y Funciones: Casos Prácticos con Punto Ticket
// Presentación para proyectar en datashow

const s2_1_2_slides = [
    {
        class: 'title-slide',
        html: `
            <h1>Procedimientos y Funciones: Casos Prácticos</h1>
            <p class="subtitle">Unidad 2.1 — Sesión 2</p>
            <p class="subtitle">Taller de Bases de Datos</p>
            <div class="alien-separator">👽</div>
        `
    },
    {
        html: `
            <h2>Recap: Procedimiento vs Función</h2>
            <table>
                <tr><th></th><th>Procedimiento</th><th>Función</th></tr>
                <tr><td><strong>Retorna valor</strong></td><td>No (usa parámetros <code>OUT</code>)</td><td>Sí, con <code>RETURN</code></td></tr>
                <tr><td><strong>Uso en SELECT</strong></td><td>No</td><td>Sí (sin DML)</td></tr>
                <tr><td><strong>Parámetros</strong></td><td><code>IN</code>, <code>OUT</code>, <code>IN OUT</code></td><td><code>IN</code> (principalmente)</td></tr>
                <tr><td><strong>Propósito típico</strong></td><td>Ejecutar acciones (DML)</td><td>Calcular y retornar un resultado</td></tr>
                <tr><td><strong>Invocación</strong></td><td><code>EXECUTE</code> o bloque PL/SQL</td><td>Asignación a variable o SQL</td></tr>
            </table>
            <div class="tip-box">
                <strong>Regla práctica:</strong> Si necesitas <strong>hacer algo</strong> → procedimiento. Si necesitas <strong>calcular algo</strong> → función.
            </div>
        `
    },
    {
        html: `
            <h2>Caso 1: Procedimiento de Compra de Entrada</h2>
            <div class="concept-box">
                Procedimiento con parámetro <code>OUT</code> que crea una reserva temporal, descuenta el stock y devuelve el ID generado.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> reservar_entrada(
    p_cliente_id    <span class="kw">IN</span>  <span class="kw">NUMBER</span>,
    p_localidad_id  <span class="kw">IN</span>  <span class="kw">NUMBER</span>,
    p_reserva_id    <span class="kw">OUT</span> <span class="kw">NUMBER</span>
) <span class="kw">AS</span>
    v_stock <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="cm">-- Verificar stock</span>
    <span class="kw">SELECT</span> stock_disponible <span class="kw">INTO</span> v_stock
    <span class="kw">FROM</span> LOCALIDAD_EVENTO
    <span class="kw">WHERE</span> localidad_evento_id = p_localidad_id;

    <span class="kw">IF</span> v_stock &lt;= <span class="num">0</span> <span class="kw">THEN</span>
        <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20001</span>, <span class="str">'Sin stock disponible'</span>);
    <span class="kw">END IF</span>;

    <span class="cm">-- Crear reserva temporal</span>
    <span class="kw">INSERT INTO</span> RESERVA_TEMPORAL (
        cliente_id, localidad_evento_id,
        fecha_expiracion, estado
    ) <span class="kw">VALUES</span> (
        p_cliente_id, p_localidad_id,
        SYSTIMESTAMP + <span class="kw">INTERVAL</span> <span class="str">'15'</span> <span class="kw">MINUTE</span>, <span class="str">'ACTIVA'</span>
    ) <span class="kw">RETURNING</span> reserva_id <span class="kw">INTO</span> p_reserva_id;

    <span class="cm">-- Descontar stock</span>
    <span class="kw">UPDATE</span> LOCALIDAD_EVENTO
    <span class="kw">SET</span> stock_disponible = stock_disponible - <span class="num">1</span>
    <span class="kw">WHERE</span> localidad_evento_id = p_localidad_id;
<span class="kw">END</span> reservar_entrada;</pre>
        `
    },
    {
        html: `
            <h2>Caso 2: Función de Disponibilidad Total</h2>
            <div class="concept-box">
                Función que recibe un <code>evento_id</code> y retorna la suma total de <code>stock_disponible</code> de todas sus localidades. Como no hace DML, puede usarse en un <code>SELECT</code>.
            </div>
<pre><span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">stock_total_evento</span>(
    p_evento_id <span class="kw">IN</span> <span class="kw">NUMBER</span>
) <span class="kw">RETURN NUMBER</span>
<span class="kw">AS</span>
    v_total <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> <span class="fn">NVL</span>(<span class="fn">SUM</span>(stock_disponible), <span class="num">0</span>)
    <span class="kw">INTO</span> v_total
    <span class="kw">FROM</span> LOCALIDAD_EVENTO
    <span class="kw">WHERE</span> evento_id = p_evento_id;

    <span class="kw">RETURN</span> v_total;
<span class="kw">END</span> stock_total_evento;</pre>
            <p><strong>Uso en un SELECT:</strong></p>
<pre><span class="kw">SELECT</span> nombre,
       estado,
       <span class="fn">stock_total_evento</span>(evento_id) <span class="kw">AS</span> entradas_disponibles
<span class="kw">FROM</span> EVENTO
<span class="kw">WHERE</span> estado = <span class="str">'VENTA'</span>;</pre>
        `
    },
    {
        html: `
            <h2>Parámetros IN OUT en Acción</h2>
            <div class="concept-box">
                Un parámetro <code>IN OUT</code> entra con un valor y el procedimiento puede modificarlo. El cambio se refleja en la variable del programa invocante.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> aplicar_descuento_convenio(
    p_monto       <span class="kw">IN OUT</span> <span class="kw">NUMBER</span>,
    p_convenio_id <span class="kw">IN</span>     <span class="kw">NUMBER</span>
) <span class="kw">AS</span>
    v_porcentaje <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> descuento_porcentaje <span class="kw">INTO</span> v_porcentaje
    <span class="kw">FROM</span> CONVENIO_BANCO
    <span class="kw">WHERE</span> convenio_banco_id = p_convenio_id
      <span class="kw">AND</span> activo = <span class="str">'S'</span>;

    <span class="cm">-- Modificamos directamente el parámetro IN OUT</span>
    p_monto := <span class="fn">ROUND</span>(p_monto - (p_monto * v_porcentaje / <span class="num">100</span>), <span class="num">2</span>);
<span class="kw">EXCEPTION</span>
    <span class="kw">WHEN</span> NO_DATA_FOUND <span class="kw">THEN</span>
        <span class="cm">-- Convenio inactivo o inexistente: monto queda igual</span>
        <span class="kw">NULL</span>;
<span class="kw">END</span> aplicar_descuento_convenio;</pre>
            <div class="analogy-box">
                <strong>Analogía:</strong> Es como llevar tu auto al mecánico (IN OUT): el auto entra con un problema, el mecánico lo repara, y el mismo auto sale arreglado. No te devuelven un auto nuevo, sino el tuyo modificado.
            </div>
        `
    },
    {
        html: `
            <h2>Procedimientos con Cursores</h2>
            <div class="concept-box">
                Un procedimiento puede declarar y usar cursores internamente para recorrer conjuntos de datos y aplicar lógica de negocio fila por fila.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> ajustar_precios_evento(
    p_evento_id   <span class="kw">IN</span> <span class="kw">NUMBER</span>,
    p_porcentaje  <span class="kw">IN</span> <span class="kw">NUMBER</span>
) <span class="kw">AS</span>
    <span class="kw">CURSOR</span> c_localidades <span class="kw">IS</span>
        <span class="kw">SELECT</span> localidad_evento_id, nombre_localidad, precio
        <span class="kw">FROM</span> LOCALIDAD_EVENTO
        <span class="kw">WHERE</span> evento_id = p_evento_id
        <span class="kw">FOR UPDATE OF</span> precio;

    v_nuevo_precio <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="kw">FOR</span> loc <span class="kw">IN</span> c_localidades <span class="kw">LOOP</span>
        v_nuevo_precio := <span class="fn">ROUND</span>(loc.precio * (<span class="num">1</span> + p_porcentaje / <span class="num">100</span>));

        <span class="kw">UPDATE</span> LOCALIDAD_EVENTO
        <span class="kw">SET</span> precio = v_nuevo_precio
        <span class="kw">WHERE CURRENT OF</span> c_localidades;

        DBMS_OUTPUT.PUT_LINE(
            loc.nombre_localidad || <span class="str">': $'</span> || loc.precio ||
            <span class="str">' → $'</span> || v_nuevo_precio
        );
    <span class="kw">END LOOP</span>;
<span class="kw">END</span> ajustar_precios_evento;</pre>
        `
    },
    {
        html: `
            <h2>DROP vs CREATE OR REPLACE</h2>
            <table>
                <tr><th></th><th>DROP + CREATE</th><th>CREATE OR REPLACE</th></tr>
                <tr><td><strong>¿Elimina el objeto?</strong></td><td>Sí, completamente</td><td>No, solo reemplaza el código</td></tr>
                <tr><td><strong>¿Pierde privilegios?</strong></td><td>Sí (GRANT se pierden)</td><td>No, se conservan</td></tr>
                <tr><td><strong>¿Invalida dependencias?</strong></td><td>Sí, todos los objetos que dependen</td><td>Solo si la firma cambia</td></tr>
                <tr><td><strong>¿Cuándo usar?</strong></td><td>Cuando quieres eliminar definitivamente</td><td>Para desarrollo y actualizaciones</td></tr>
            </table>
<pre><span class="cm">-- DROP explícito (cuidado: se pierden GRANTs)</span>
<span class="kw">DROP PROCEDURE</span> registrar_cliente;

<span class="cm">-- Verificar si existe antes de hacer DROP</span>
<span class="kw">SELECT</span> object_name, object_type, status
<span class="kw">FROM</span> USER_OBJECTS
<span class="kw">WHERE</span> object_type <span class="kw">IN</span> (<span class="str">'PROCEDURE'</span>, <span class="str">'FUNCTION'</span>);</pre>
            <div class="warning-box">
                <strong>Regla de oro:</strong> En desarrollo, usa siempre <code>CREATE OR REPLACE</code>. Reserva <code>DROP</code> para cuando realmente quieras eliminar un objeto del esquema.
            </div>
        `
    },
    {
        html: `
            <h2>Validaciones y Reglas de Negocio</h2>
            <div class="concept-box">
                Los procedimientos son ideales para encapsular <strong>reglas de negocio complejas</strong> con múltiples validaciones antes de ejecutar una operación.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> procesar_pago(
    p_reserva_id    <span class="kw">IN</span>  <span class="kw">NUMBER</span>,
    p_metodo_pago   <span class="kw">IN</span>  <span class="kw">VARCHAR2</span>,
    p_transaccion_id <span class="kw">OUT</span> <span class="kw">NUMBER</span>
) <span class="kw">AS</span>
    v_estado_reserva <span class="kw">VARCHAR2</span>(<span class="num">20</span>);
    v_monto          <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="cm">-- Validación 1: ¿La reserva está activa?</span>
    <span class="kw">SELECT</span> estado <span class="kw">INTO</span> v_estado_reserva
    <span class="kw">FROM</span> RESERVA_TEMPORAL
    <span class="kw">WHERE</span> reserva_id = p_reserva_id;

    <span class="kw">IF</span> v_estado_reserva != <span class="str">'ACTIVA'</span> <span class="kw">THEN</span>
        <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20010</span>,
            <span class="str">'Reserva no activa. Estado actual: '</span> || v_estado_reserva);
    <span class="kw">END IF</span>;

    <span class="cm">-- Validación 2: Obtener monto desde localidad</span>
    <span class="kw">SELECT</span> le.precio <span class="kw">INTO</span> v_monto
    <span class="kw">FROM</span> RESERVA_TEMPORAL rt
    <span class="kw">JOIN</span> LOCALIDAD_EVENTO le <span class="kw">ON</span> le.localidad_evento_id = rt.localidad_evento_id
    <span class="kw">WHERE</span> rt.reserva_id = p_reserva_id;

    <span class="cm">-- Registrar transacción</span>
    <span class="kw">INSERT INTO</span> TRANSACCION_PAGO (
        reserva_id, monto_bruto, descuento, monto_final,
        metodo_pago, estado
    ) <span class="kw">VALUES</span> (
        p_reserva_id, v_monto, <span class="num">0</span>, v_monto,
        p_metodo_pago, <span class="str">'APROBADO'</span>
    ) <span class="kw">RETURNING</span> transaccion_id <span class="kw">INTO</span> p_transaccion_id;
<span class="kw">EXCEPTION</span>
    <span class="kw">WHEN</span> NO_DATA_FOUND <span class="kw">THEN</span>
        <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20011</span>, <span class="str">'Reserva no encontrada'</span>);
<span class="kw">END</span> procesar_pago;</pre>
        `
    },
    {
        html: `
            <h2>Composición: Funciones dentro de Procedimientos</h2>
            <div class="concept-box">
                Un procedimiento puede invocar funciones para calcular valores intermedios, creando código más modular y reutilizable.
            </div>
<pre><span class="cm">-- Función auxiliar: calcula monto con descuento</span>
<span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">calcular_monto_con_descuento</span>(
    p_monto_bruto <span class="kw">IN</span> <span class="kw">NUMBER</span>,
    p_convenio_id <span class="kw">IN</span> <span class="kw">NUMBER</span>
) <span class="kw">RETURN NUMBER</span>
<span class="kw">AS</span>
    v_porcentaje <span class="kw">NUMBER</span> := <span class="num">0</span>;
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> descuento_porcentaje <span class="kw">INTO</span> v_porcentaje
    <span class="kw">FROM</span> CONVENIO_BANCO
    <span class="kw">WHERE</span> convenio_banco_id = p_convenio_id <span class="kw">AND</span> activo = <span class="str">'S'</span>;
    <span class="kw">RETURN</span> <span class="fn">ROUND</span>(p_monto_bruto * (<span class="num">1</span> - v_porcentaje/<span class="num">100</span>), <span class="num">2</span>);
<span class="kw">EXCEPTION</span>
    <span class="kw">WHEN</span> NO_DATA_FOUND <span class="kw">THEN</span> <span class="kw">RETURN</span> p_monto_bruto;
<span class="kw">END;</span></pre>
<pre><span class="cm">-- Procedimiento que usa la función</span>
<span class="kw">CREATE OR REPLACE PROCEDURE</span> registrar_pago_con_convenio(
    p_reserva_id  <span class="kw">IN</span> <span class="kw">NUMBER</span>,
    p_convenio_id <span class="kw">IN</span> <span class="kw">NUMBER</span>,
    p_metodo      <span class="kw">IN</span> <span class="kw">VARCHAR2</span>
) <span class="kw">AS</span>
    v_precio      <span class="kw">NUMBER</span>;
    v_monto_final <span class="kw">NUMBER</span>;
    v_descuento   <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> le.precio <span class="kw">INTO</span> v_precio
    <span class="kw">FROM</span> RESERVA_TEMPORAL rt
    <span class="kw">JOIN</span> LOCALIDAD_EVENTO le <span class="kw">ON</span> le.localidad_evento_id = rt.localidad_evento_id
    <span class="kw">WHERE</span> rt.reserva_id = p_reserva_id;

    <span class="cm">-- Usa la función para calcular</span>
    v_monto_final := <span class="fn">calcular_monto_con_descuento</span>(v_precio, p_convenio_id);
    v_descuento   := v_precio - v_monto_final;

    <span class="kw">INSERT INTO</span> TRANSACCION_PAGO (
        reserva_id, convenio_banco_id,
        monto_bruto, descuento, monto_final,
        metodo_pago, estado
    ) <span class="kw">VALUES</span> (
        p_reserva_id, p_convenio_id,
        v_precio, v_descuento, v_monto_final,
        p_metodo, <span class="str">'APROBADO'</span>
    );
<span class="kw">END</span> registrar_pago_con_convenio;</pre>
        `
    },
    {
        html: `
            <h2>Resumen — Sesión 2</h2>
            <table>
                <tr><th>Concepto</th><th>Qué recordar</th></tr>
                <tr><td>Parámetro OUT</td><td>El procedimiento asigna un valor que queda disponible al invocante</td></tr>
                <tr><td>Parámetro IN OUT</td><td>Entra con valor, se modifica internamente, el cambio se refleja afuera</td></tr>
                <tr><td>Funciones en SELECT</td><td>Solo si no hacen DML (INSERT, UPDATE, DELETE, COMMIT)</td></tr>
                <tr><td>Cursor en Proc</td><td>Se declara en la sección AS/IS del procedimiento</td></tr>
                <tr><td>CREATE OR REPLACE</td><td>Preferir sobre DROP + CREATE para no perder privilegios</td></tr>
                <tr><td>RETURNING INTO</td><td>Captura el ID generado por un INSERT con columna IDENTITY</td></tr>
                <tr><td>Composición</td><td>Funciones dentro de procedimientos = código modular y reutilizable</td></tr>
            </table>
            <div class="alien-separator">👽</div>
            <p style="text-align:center;color:#94a3b8;font-size:0.85em;">Siguiente: Guía práctica con ejercicios y desafíos</p>
        `
    }
];
