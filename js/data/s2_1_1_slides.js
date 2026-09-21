// s2_1_1_slides.js — Procedimientos Almacenados y Funciones: Fundamentos
// Presentación para proyectar en datashow

const s2_1_1_slides = [
    {
        class: 'title-slide',
        html: `
            <h1>Procedimientos Almacenados y Funciones</h1>
            <p class="subtitle">Unidad 2.1 — Sesión 1: Fundamentos</p>
            <p class="subtitle">Taller de Bases de Datos</p>
            <div class="alien-separator">👽</div>
        `
    },
    {
        html: `
            <h2>¿Qué es un Procedimiento Almacenado?</h2>
            <div class="concept-box">
                <strong>Definición técnica:</strong> Un procedimiento almacenado (<code>PROCEDURE</code>) es un bloque PL/SQL con nombre que se almacena en el diccionario de datos de Oracle. Se compila una sola vez y puede ejecutarse múltiples veces sin recompilación. Puede recibir <strong>parámetros de entrada y salida</strong>, pero <strong>no retorna un valor</strong> directamente.
            </div>
            <div class="analogy-box">
                <strong>Para entenderlo mejor:</strong> Imagina que tienes una receta de cocina guardada en un libro. Cada vez que quieres preparar el plato, no necesitas inventar la receta de nuevo: solo abres el libro, sigues los pasos, y listo. Un procedimiento almacenado es esa receta guardada en la base de datos: la escribes una vez y la ejecutas cuantas veces necesites.
            </div>
        `
    },
    {
        html: `
            <h2>Sintaxis: CREATE PROCEDURE</h2>
            <div class="concept-box">
                La estructura básica incluye: nombre, parámetros opcionales, y el cuerpo del bloque PL/SQL entre <code>IS/AS</code> y <code>END</code>.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> registrar_cliente(
    <span class="cm">-- Parámetros de entrada</span>
    p_rut       <span class="kw">IN</span> <span class="kw">VARCHAR2</span>,
    p_nombre    <span class="kw">IN</span> <span class="kw">VARCHAR2</span>,
    p_apellido  <span class="kw">IN</span> <span class="kw">VARCHAR2</span>,
    p_email     <span class="kw">IN</span> <span class="kw">VARCHAR2</span>
) <span class="kw">AS</span>
<span class="kw">BEGIN</span>
    <span class="cm">-- Insertar el nuevo cliente en la tabla</span>
    <span class="kw">INSERT INTO</span> CLIENTE (rut, nombre, apellido, email)
    <span class="kw">VALUES</span> (p_rut, p_nombre, p_apellido, p_email);

    <span class="kw">COMMIT</span>;
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Cliente registrado: '</span> || p_nombre || <span class="str">' '</span> || p_apellido);
<span class="kw">END</span> registrar_cliente;</pre>
            <div class="tip-box">
                <strong>Consejo:</strong> Usa <code>CREATE OR REPLACE</code> para poder modificar el procedimiento sin necesidad de eliminarlo primero con <code>DROP</code>.
            </div>
        `
    },
    {
        html: `
            <h2>Parámetros IN — Entrada de Solo Lectura</h2>
            <div class="concept-box">
                Un parámetro <code>IN</code> es el modo <strong>por defecto</strong>. Funciona como una <strong>constante dentro del procedimiento</strong>: puedes leer su valor, pero <strong>no puedes modificarlo</strong>. Si no escribes el modo, Oracle asume <code>IN</code>.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> mostrar_evento(
    p_evento_id  <span class="kw">IN</span> <span class="kw">NUMBER</span>   <span class="cm">-- IN explícito</span>
    <span class="cm">-- también válido: p_evento_id NUMBER  (IN es el default)</span>
) <span class="kw">AS</span>
    v_nombre <span class="kw">VARCHAR2</span>(<span class="num">200</span>);
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> nombre <span class="kw">INTO</span> v_nombre
    <span class="kw">FROM</span> EVENTO
    <span class="kw">WHERE</span> evento_id = p_evento_id;  <span class="cm">-- ✅ Leer: permitido</span>

    <span class="cm">-- p_evento_id := 99;  ❌ Modificar: ERROR de compilación</span>
    <span class="cm">-- PLS-00363: expression cannot be used as an assignment target</span>

    DBMS_OUTPUT.PUT_LINE(<span class="str">'Evento: '</span> || v_nombre);
<span class="kw">END</span> mostrar_evento;</pre>
            <div class="analogy-box">
                <strong>Analogía:</strong> El parámetro <code>IN</code> es como el número de una mesa en un restaurante: el mozo lo recibe, lo usa para saber a dónde llevar el plato, pero <strong>no puede cambiar el número de la mesa</strong>.
            </div>
        `
    },
    {
        html: `
            <h2>Parámetros OUT — Valores de Salida</h2>
            <div class="concept-box">
                Un parámetro <code>OUT</code> permite que el procedimiento <strong>envíe un valor de vuelta</strong> al programa que lo llamó. Dentro del procedimiento, el parámetro <strong>comienza en <code>NULL</code></strong> (ignora cualquier valor previo). El procedimiento le asigna un valor, y al terminar, ese valor queda disponible para el invocante.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> obtener_datos_cliente(
    p_cliente_id  <span class="kw">IN</span>  <span class="kw">NUMBER</span>,     <span class="cm">-- entra con valor</span>
    p_nombre      <span class="kw">OUT</span> <span class="kw">VARCHAR2</span>,  <span class="cm">-- sale con valor</span>
    p_email       <span class="kw">OUT</span> <span class="kw">VARCHAR2</span>   <span class="cm">-- sale con valor</span>
) <span class="kw">AS</span>
<span class="kw">BEGIN</span>
    <span class="cm">-- Aquí p_nombre y p_email son NULL (no heredan nada)</span>
    <span class="kw">SELECT</span> nombre || <span class="str">' '</span> || apellido, email
    <span class="kw">INTO</span> p_nombre, p_email        <span class="cm">-- les asignamos valor</span>
    <span class="kw">FROM</span> CLIENTE
    <span class="kw">WHERE</span> cliente_id = p_cliente_id;
<span class="kw">END</span> obtener_datos_cliente;</pre>
            <p><strong>¿Cómo se usa?</strong> El invocante declara variables y las pasa al procedimiento:</p>
<pre><span class="kw">DECLARE</span>
    v_nombre <span class="kw">VARCHAR2</span>(<span class="num">160</span>);
    v_email  <span class="kw">VARCHAR2</span>(<span class="num">150</span>);
<span class="kw">BEGIN</span>
    <span class="cm">-- Antes: v_nombre = NULL, v_email = NULL</span>
    obtener_datos_cliente(<span class="num">1</span>, v_nombre, v_email);
    <span class="cm">-- Después: v_nombre = 'Valentina Soto', v_email = 'vsoto@mail.com'</span>
    DBMS_OUTPUT.PUT_LINE(v_nombre || <span class="str">' - '</span> || v_email);
<span class="kw">END;</span></pre>
        `
    },
    {
        html: `
            <h2>Parámetros IN OUT — Bidireccional</h2>
            <div class="concept-box">
                Un parámetro <code>IN OUT</code> combina ambos modos: <strong>entra con un valor</strong> (que el procedimiento puede leer) y <strong>sale modificado</strong>. Es la única forma en que un parámetro hereda el valor del invocante y también puede cambiarlo.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> aplicar_descuento(
    p_monto       <span class="kw">IN OUT</span> <span class="kw">NUMBER</span>,  <span class="cm">-- entra con valor, sale modificado</span>
    p_convenio_id <span class="kw">IN</span>     <span class="kw">NUMBER</span>
) <span class="kw">AS</span>
    v_porcentaje <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> descuento_porcentaje <span class="kw">INTO</span> v_porcentaje
    <span class="kw">FROM</span> CONVENIO_BANCO
    <span class="kw">WHERE</span> convenio_banco_id = p_convenio_id <span class="kw">AND</span> activo = <span class="str">'S'</span>;

    DBMS_OUTPUT.PUT_LINE(<span class="str">'Monto original: $'</span> || p_monto);  <span class="cm">-- ✅ Leer</span>
    p_monto := <span class="fn">ROUND</span>(p_monto * (<span class="num">1</span> - v_porcentaje/<span class="num">100</span>), <span class="num">2</span>);   <span class="cm">-- ✅ Modificar</span>
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Monto con dcto: $'</span> || p_monto);
<span class="kw">END</span> aplicar_descuento;</pre>
            <p><strong>¿Cómo se usa?</strong></p>
<pre><span class="kw">DECLARE</span>
    v_monto <span class="kw">NUMBER</span> := <span class="num">50000</span>;  <span class="cm">-- entra con 50000</span>
<span class="kw">BEGIN</span>
    aplicar_descuento(v_monto, <span class="num">1</span>);
    <span class="cm">-- Ahora v_monto = 45000 (si el convenio tenía 10% de descuento)</span>
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Monto final: $'</span> || v_monto);
<span class="kw">END;</span></pre>
            <div class="analogy-box">
                <strong>Analogía:</strong> Es como llevar tu auto al mecánico (<code>IN OUT</code>): el auto entra con un problema, el mecánico lo repara, y el <strong>mismo auto</strong> sale arreglado. No te devuelven un auto nuevo, sino el tuyo modificado.
            </div>
        `
    },
    {
        html: `
            <h2>Resumen de Parámetros</h2>
            <table>
                <tr><th>Modo</th><th>¿Lee valor?</th><th>¿Modifica valor?</th><th>Valor inicial dentro</th><th>Ejemplo de uso</th></tr>
                <tr><td><code>IN</code></td><td>✅ Sí</td><td>❌ No</td><td>El valor que pasó el invocante</td><td>Filtros, IDs, datos de entrada</td></tr>
                <tr><td><code>OUT</code></td><td>❌ No (es NULL)</td><td>✅ Sí</td><td><code>NULL</code></td><td>Devolver un ID generado, un nombre calculado</td></tr>
                <tr><td><code>IN OUT</code></td><td>✅ Sí</td><td>✅ Sí</td><td>El valor que pasó el invocante</td><td>Transformar un monto, formatear un texto</td></tr>
            </table>
            <div class="warning-box">
                <strong>Errores comunes con parámetros:</strong>
                <ul>
                    <li>Pasar un <strong>literal</strong> a un <code>OUT</code> o <code>IN OUT</code> → <strong>Error</strong>. Deben ser <strong>variables</strong>.</li>
                    <li>Ejemplo: <code>obtener_datos_cliente(1, 'Juan', 'j@m.com')</code> → ❌ Error, <code>'Juan'</code> es literal.</li>
                    <li>Correcto: <code>obtener_datos_cliente(1, v_nombre, v_email)</code> → ✅</li>
                </ul>
            </div>
        `
    },
    {
        html: `
            <h2>¿Qué es una Función?</h2>
            <div class="concept-box">
                <strong>Definición técnica:</strong> Una función (<code>FUNCTION</code>) es un bloque PL/SQL con nombre que <strong>siempre retorna exactamente un valor</strong> mediante la cláusula <code>RETURN</code>. Se almacena en el diccionario de datos y puede usarse dentro de sentencias SQL (como en un <code>SELECT</code>) siempre que no realice operaciones DML.
            </div>
            <div class="analogy-box">
                <strong>Para entenderlo mejor:</strong> Si un procedimiento es como una <strong>receta de cocina</strong> (haces algo: preparas, cocinas, sirves), una función es como una <strong>calculadora</strong>: le das números, aprietas un botón, y <strong>siempre te devuelve un resultado</strong>. No cocina, no sirve platos — solo calcula y responde.
            </div>
        `
    },
    {
        html: `
            <h2>Sintaxis: CREATE FUNCTION + RETURN</h2>
            <div class="concept-box">
                Una función declara su tipo de retorno en la firma con <code>RETURN tipo_dato</code> y <strong>debe incluir al menos una sentencia</strong> <code>RETURN valor;</code> en el cuerpo. Si la función termina sin ejecutar un <code>RETURN</code>, Oracle lanza el error <code>ORA-06503</code>.
            </div>
<pre><span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">calcular_descuento</span>(
    p_monto_bruto  <span class="kw">IN</span> <span class="kw">NUMBER</span>,
    p_convenio_id  <span class="kw">IN</span> <span class="kw">NUMBER</span>
) <span class="kw">RETURN NUMBER</span>     <span class="cm">-- ← Declara el tipo de retorno</span>
<span class="kw">AS</span>
    v_porcentaje <span class="kw">NUMBER</span>;
    v_descuento  <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> descuento_porcentaje
    <span class="kw">INTO</span> v_porcentaje
    <span class="kw">FROM</span> CONVENIO_BANCO
    <span class="kw">WHERE</span> convenio_banco_id = p_convenio_id
      <span class="kw">AND</span> activo = <span class="str">'S'</span>;

    v_descuento := <span class="fn">ROUND</span>(p_monto_bruto * v_porcentaje / <span class="num">100</span>, <span class="num">2</span>);
    <span class="kw">RETURN</span> v_descuento;     <span class="cm">-- ← Devuelve el resultado</span>
<span class="kw">END</span> calcular_descuento;</pre>
        `
    },
    {
        html: `
            <h2>Pregunta del estudiante: ¿Las funciones pueden tener OUT?</h2>
            <div class="concept-box">
                <strong>Respuesta corta:</strong> Técnicamente sí, Oracle lo permite. Pero <strong>NO deberías hacerlo</strong>. Veamos por qué:
            </div>
<pre><span class="cm">-- ⚠️ Esto COMPILA, pero es una MALA PRÁCTICA</span>
<span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">info_cliente</span>(
    p_id     <span class="kw">IN</span>  <span class="kw">NUMBER</span>,
    p_email  <span class="kw">OUT</span> <span class="kw">VARCHAR2</span>   <span class="cm">-- ← OUT en función</span>
) <span class="kw">RETURN VARCHAR2 AS</span>
    v_nombre <span class="kw">VARCHAR2</span>(<span class="num">80</span>);
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> nombre, email <span class="kw">INTO</span> v_nombre, p_email
    <span class="kw">FROM</span> CLIENTE <span class="kw">WHERE</span> cliente_id = p_id;
    <span class="kw">RETURN</span> v_nombre;
<span class="kw">END;</span></pre>
            <div class="warning-box">
                <strong>¿Por qué NO hacerlo?</strong>
                <ul>
                    <li>❌ <strong>No se puede usar en SELECT</strong>: <code>SELECT info_cliente(1, ???) FROM DUAL</code> — ¿dónde va el OUT?</li>
                    <li>❌ <strong>Pierdes la ventaja principal</strong> de ser función (usarla en SQL)</li>
                    <li>❌ <strong>Confunde</strong>: si necesitas devolver varios valores, eso ya es trabajo de un procedimiento</li>
                </ul>
            </div>
            <div class="tip-box">
                <strong>Regla clara:</strong> Las funciones reciben datos con <code>IN</code> y devuelven <strong>UN resultado</strong> con <code>RETURN</code>. Si necesitas devolver múltiples valores → usa un <strong>procedimiento con parámetros OUT</strong>.
            </div>
        `
    },
    {
        html: `
            <h2>Cómo Usar una Función</h2>
            <p>A diferencia de un procedimiento, una función <strong>retorna un valor</strong>. Esto significa que se usa de forma diferente:</p>
            <p><strong>Forma 1: Asignar a una variable en PL/SQL</strong></p>
<pre><span class="kw">DECLARE</span>
    v_descuento <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="cm">-- La función retorna un valor → lo guardamos en una variable</span>
    v_descuento := <span class="fn">calcular_descuento</span>(<span class="num">50000</span>, <span class="num">1</span>);
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Descuento: $'</span> || v_descuento);
<span class="kw">END;</span></pre>
            <p><strong>Forma 2: Directamente en DBMS_OUTPUT (sin variable intermedia)</strong></p>
<pre><span class="kw">BEGIN</span>
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Descuento: $'</span> || <span class="fn">calcular_descuento</span>(<span class="num">50000</span>, <span class="num">1</span>));
<span class="kw">END;</span></pre>
            <p><strong>Forma 3: Dentro de un SELECT (¡lo más poderoso!)</strong></p>
<pre><span class="cm">-- Esto NO se puede hacer con un procedimiento</span>
<span class="kw">SELECT</span> nombre_localidad,
       precio,
       <span class="fn">calcular_descuento</span>(precio, <span class="num">1</span>) <span class="kw">AS</span> descuento,
       precio - <span class="fn">calcular_descuento</span>(precio, <span class="num">1</span>) <span class="kw">AS</span> precio_final
<span class="kw">FROM</span> LOCALIDAD_EVENTO
<span class="kw">WHERE</span> evento_id = <span class="num">1</span>;</pre>
            <div class="tip-box">
                La Forma 3 es la <strong>ventaja exclusiva</strong> de las funciones: integrarse directamente en consultas SQL como si fueran columnas calculadas.
            </div>
        `
    },
    {
        html: `
            <h2>🤔 La Gran Pregunta: ¿RETURN o OUT?</h2>
            <div class="concept-box">
                "Si un procedimiento con <code>OUT</code> también puede devolver valores... ¿para qué existen las funciones?" — Buena pregunta. Veamos el <strong>mismo problema</strong> resuelto de las dos formas:
            </div>
            <p><strong>Problema:</strong> Dado un <code>evento_id</code>, necesito obtener el total de entradas disponibles.</p>
            <table>
                <tr><th></th><th>Con FUNCTION + RETURN</th><th>Con PROCEDURE + OUT</th></tr>
                <tr>
                    <td><strong>Código</strong></td>
                    <td><pre style="font-size:0.7em;margin:0"><span class="kw">CREATE OR REPLACE FUNCTION</span>
  <span class="fn">stock_evento</span>(p_id <span class="kw">NUMBER</span>)
  <span class="kw">RETURN NUMBER AS</span>
  v_t <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
  <span class="kw">SELECT</span> <span class="fn">NVL</span>(<span class="fn">SUM</span>(stock_disponible),<span class="num">0</span>)
  <span class="kw">INTO</span> v_t <span class="kw">FROM</span> LOCALIDAD_EVENTO
  <span class="kw">WHERE</span> evento_id = p_id;
  <span class="kw">RETURN</span> v_t;
<span class="kw">END;</span></pre></td>
                    <td><pre style="font-size:0.7em;margin:0"><span class="kw">CREATE OR REPLACE PROCEDURE</span>
  stock_evento_proc(
    p_id  <span class="kw">IN</span>  <span class="kw">NUMBER</span>,
    p_out <span class="kw">OUT NUMBER</span>)
<span class="kw">AS BEGIN</span>
  <span class="kw">SELECT</span> <span class="fn">NVL</span>(<span class="fn">SUM</span>(stock_disponible),<span class="num">0</span>)
  <span class="kw">INTO</span> p_out <span class="kw">FROM</span> LOCALIDAD_EVENTO
  <span class="kw">WHERE</span> evento_id = p_id;
<span class="kw">END;</span></pre></td>
                </tr>
                <tr>
                    <td><strong>Uso en SQL</strong></td>
                    <td>✅ <code>SELECT nombre, <span class="fn">stock_evento</span>(evento_id) FROM EVENTO;</code></td>
                    <td>❌ <strong>No se puede usar en SELECT</strong></td>
                </tr>
                <tr>
                    <td><strong>Uso en PL/SQL</strong></td>
                    <td><code>v_stock := <span class="fn">stock_evento</span>(1);</code> <em>(1 línea)</em></td>
                    <td><code>stock_evento_proc(1, v_stock);</code> <em>(1 línea)</em></td>
                </tr>
                <tr>
                    <td><strong>¿Múltiples valores?</strong></td>
                    <td>No, solo 1</td>
                    <td>Sí, tantos como parámetros OUT</td>
                </tr>
            </table>
        `
    },
    {
        html: `
            <h2>Entonces... ¿Cuándo uso cada uno?</h2>
            <div class="concept-box">
                <strong>Regla práctica para decidir:</strong>
            </div>
            <table>
                <tr><th>Usa FUNCTION cuando...</th><th>Usa PROCEDURE cuando...</th></tr>
                <tr><td>Necesitas <strong>un solo resultado</strong> calculado</td><td>Necesitas <strong>ejecutar una acción</strong> (INSERT, UPDATE, DELETE)</td></tr>
                <tr><td>Quieres usarlo <strong>dentro de un SELECT</strong></td><td>Necesitas <strong>devolver múltiples valores</strong> (varios OUT)</td></tr>
                <tr><td>Es una <strong>consulta o cálculo puro</strong> sin modificar datos</td><td>El objetivo principal es un <strong>efecto secundario</strong> en la BD</td></tr>
                <tr><td>Ejemplo: <em>"¿cuántas entradas quedan?"</em></td><td>Ejemplo: <em>"registra este cliente y dame su ID"</em></td></tr>
            </table>
            <div class="analogy-box">
                <strong>La analogía definitiva:</strong>
                <ul>
                    <li>🧮 <strong>Función</strong> = <strong>Calculadora</strong>: le das datos, te devuelve UN resultado. Puedes usarla en cualquier parte.</li>
                    <li>🔧 <strong>Procedimiento</strong> = <strong>Mecánico</strong>: le das instrucciones, él hace el trabajo (modifica cosas). Si necesitas saber qué hizo, te lo dice por OUT.</li>
                </ul>
            </div>
            <div class="warning-box">
                <strong>Error conceptual frecuente:</strong> "Como la función puede hacer lo mismo que un procedimiento, siempre uso funciones." — <strong>Falso.</strong> Si tu función hace INSERT/UPDATE, ya no puedes usarla en SELECT (ORA-14551). Pierdes su principal ventaja.
            </div>
        `
    },
    {
        html: `
            <h2>Excepciones dentro de Procedimientos y Funciones</h2>
            <div class="concept-box">
                Los procedimientos y funciones pueden incluir su propio bloque <code>EXCEPTION</code> para capturar errores y manejarlos internamente, en lugar de propagarlos al programa invocante.
            </div>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> buscar_cliente_por_rut(
    p_rut     <span class="kw">IN</span>  <span class="kw">VARCHAR2</span>,
    p_nombre  <span class="kw">OUT</span> <span class="kw">VARCHAR2</span>
) <span class="kw">AS</span>
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> nombre || <span class="str">' '</span> || apellido
    <span class="kw">INTO</span> p_nombre
    <span class="kw">FROM</span> CLIENTE
    <span class="kw">WHERE</span> rut = p_rut;

<span class="kw">EXCEPTION</span>
    <span class="kw">WHEN</span> NO_DATA_FOUND <span class="kw">THEN</span>
        p_nombre := <span class="str">'No encontrado'</span>;
    <span class="kw">WHEN</span> TOO_MANY_ROWS <span class="kw">THEN</span>
        <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20001</span>, <span class="str">'RUT duplicado en tabla CLIENTE: '</span> || p_rut);
<span class="kw">END</span> buscar_cliente_por_rut;</pre>
            <div class="warning-box">
                <strong>Importante:</strong> <code>RAISE_APPLICATION_ERROR</code> usa códigos entre <code>-20000</code> y <code>-20999</code>. Cualquier valor fuera de ese rango genera un error de Oracle.
            </div>
        `
    },
    {
        html: `
            <h2>Buenas Prácticas</h2>
            <div class="tip-box">
                <strong>Naming conventions:</strong>
                <ul>
                    <li>Prefijo <code>p_</code> para parámetros: <code>p_cliente_id</code>, <code>p_monto</code></li>
                    <li>Prefijo <code>v_</code> para variables locales: <code>v_total</code>, <code>v_nombre</code></li>
                    <li>Nombres descriptivos en español o inglés, pero <strong>consistentes</strong></li>
                </ul>
            </div>
            <div class="warning-box">
                <strong>Errores comunes que evitar:</strong>
                <ul>
                    <li>Olvidar el <code>RETURN</code> en una función → error <code>ORA-06503</code></li>
                    <li>Olvidar el <code>RETURN</code> en una rama <code>EXCEPTION</code> de una función → mismo error</li>
                    <li>Usar <code>IN OUT</code> cuando solo necesitas <code>IN</code> → complica la llamada innecesariamente</li>
                    <li>No manejar excepciones → el error se propaga sin contexto al invocante</li>
                    <li>Hacer DML en una función y luego intentar usarla en SELECT → <code>ORA-14551</code></li>
                </ul>
            </div>
        `
    },
    {
        html: `
            <h2>🎯 Desafío 1: El gerente de Punto Ticket necesita...</h2>
            <div class="analogy-box">
                <strong>Historia de usuario:</strong> <em>"Como gerente de Punto Ticket, necesito poder ver rápidamente en mis reportes SQL cuántas entradas quedan disponibles para cada evento. Esta información aparece en varias consultas diferentes que ya tenemos."</em>
            </div>
            <div class="concept-box">
                <strong>Analicemos juntos — Paso 1: ¿Qué creamos?</strong>
                <ul>
                    <li>🤔 ¿Necesita <strong>hacer algo</strong> en la BD (INSERT/UPDATE)? → <strong>No</strong>, solo consultar.</li>
                    <li>🤔 ¿Necesita <strong>un valor</strong> o <strong>varios</strong>? → <strong>Uno solo</strong>: la cantidad de entradas.</li>
                    <li>🤔 ¿Necesita usarlo <strong>dentro de SELECT</strong>? → <strong>Sí</strong>, en reportes SQL.</li>
                </ul>
            </div>
            <div class="tip-box">
                ✅ <strong>Conclusión: Necesitamos una FUNCIÓN.</strong> Retorna un solo valor calculado y debe poder usarse dentro de consultas SQL.
            </div>
            <p style="text-align:center;color:#94a3b8;font-size:0.9em;margin-top:1rem;">👉 En la siguiente slide la construimos paso a paso...</p>
        `
    },
    {
        html: `
            <h2>🎯 Desafío 1: Resolución paso a paso</h2>
            <p><strong>Paso 1 — La firma:</strong> ¿Qué recibe y qué retorna?</p>
<pre><span class="kw">CREATE OR REPLACE FUNCTION</span> <span class="fn">stock_total_evento</span>(
    p_evento_id <span class="kw">IN NUMBER</span>    <span class="cm">-- Recibe: el ID del evento</span>
) <span class="kw">RETURN NUMBER</span>             <span class="cm">-- Retorna: un número (total de stock)</span></pre>
            <p><strong>Paso 2 — La lógica:</strong> Sumar el stock de todas las localidades del evento.</p>
<pre><span class="kw">AS</span>
    v_total <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> <span class="fn">NVL</span>(<span class="fn">SUM</span>(stock_disponible), <span class="num">0</span>)  <span class="cm">-- NVL por si no hay localidades</span>
    <span class="kw">INTO</span> v_total
    <span class="kw">FROM</span> LOCALIDAD_EVENTO
    <span class="kw">WHERE</span> evento_id = p_evento_id;

    <span class="kw">RETURN</span> v_total;                       <span class="cm">-- ¡No olvidar el RETURN!</span>
<span class="kw">END</span> stock_total_evento;</pre>
            <p><strong>Paso 3 — Usarla:</strong> El reporte SQL que pidió el gerente.</p>
<pre><span class="cm">-- Ahora el gerente tiene su reporte con una sola línea</span>
<span class="kw">SELECT</span> nombre, estado,
       <span class="fn">stock_total_evento</span>(evento_id) <span class="kw">AS</span> entradas_disponibles
<span class="kw">FROM</span> EVENTO
<span class="kw">WHERE</span> estado = <span class="str">'VENTA'</span>;</pre>
            <div class="tip-box">
                <strong>¿Por qué funcionó como función?</strong> Porque no modifica datos (solo consulta), retorna un solo valor, y se integra perfectamente en el SELECT.
            </div>
        `
    },
    {
        html: `
            <h2>🎯 Desafío 2: El equipo de soporte necesita...</h2>
            <div class="analogy-box">
                <strong>Historia de usuario:</strong> <em>"Como agente de soporte, necesito poder cancelar una reserva expirada con un solo comando. El sistema debe cambiar el estado de la reserva a 'CANCELADA', devolver la entrada al stock de la localidad, y decirme el nombre del cliente afectado para contactarlo."</em>
            </div>
            <div class="concept-box">
                <strong>Analicemos juntos — Paso 1: ¿Qué creamos?</strong>
                <ul>
                    <li>🤔 ¿Necesita <strong>hacer algo</strong> en la BD? → <strong>Sí</strong>: UPDATE en 2 tablas.</li>
                    <li>🤔 ¿Necesita <strong>devolver un valor</strong>? → <strong>Sí</strong>: el nombre del cliente afectado.</li>
                    <li>🤔 ¿Se usará <strong>dentro de un SELECT</strong>? → <strong>No</strong>, se ejecuta como acción manual.</li>
                    <li>🤔 ¿Podría ser función? → <strong>No</strong>: hace DML (UPDATE), así que no serviría en SQL.</li>
                </ul>
            </div>
            <div class="tip-box">
                ✅ <strong>Conclusión: Necesitamos un PROCEDIMIENTO con parámetro OUT.</strong> Ejecuta acciones (UPDATE) y devuelve un dato al invocante.
            </div>
            <p style="text-align:center;color:#94a3b8;font-size:0.9em;margin-top:1rem;">👉 En la siguiente slide lo construimos paso a paso...</p>
        `
    },
    {
        html: `
            <h2>🎯 Desafío 2: Resolución paso a paso</h2>
            <p><strong>Paso 1 — La firma:</strong> IN para la reserva, OUT para el nombre del cliente.</p>
<pre><span class="kw">CREATE OR REPLACE PROCEDURE</span> cancelar_reserva_expirada(
    p_reserva_id     <span class="kw">IN</span>  <span class="kw">NUMBER</span>,    <span class="cm">-- ¿Cuál reserva?</span>
    p_nombre_cliente <span class="kw">OUT</span> <span class="kw">VARCHAR2</span>  <span class="cm">-- ¿A quién contactar?</span>
) <span class="kw">AS</span>
    v_localidad_id <span class="kw">NUMBER</span>;</pre>
            <p><strong>Paso 2 — Obtener datos</strong> antes de modificar (el nombre del cliente y la localidad).</p>
<pre><span class="kw">BEGIN</span>
    <span class="kw">SELECT</span> c.nombre || <span class="str">' '</span> || c.apellido, rt.localidad_evento_id
    <span class="kw">INTO</span> p_nombre_cliente, v_localidad_id
    <span class="kw">FROM</span> RESERVA_TEMPORAL rt
    <span class="kw">JOIN</span> CLIENTE c <span class="kw">ON</span> c.cliente_id = rt.cliente_id
    <span class="kw">WHERE</span> rt.reserva_id = p_reserva_id;</pre>
            <p><strong>Paso 3 — Ejecutar las acciones</strong> (UPDATE en ambas tablas).</p>
<pre>    <span class="cm">-- Acción 1: Cancelar la reserva</span>
    <span class="kw">UPDATE</span> RESERVA_TEMPORAL <span class="kw">SET</span> estado = <span class="str">'CANCELADA'</span>
    <span class="kw">WHERE</span> reserva_id = p_reserva_id;

    <span class="cm">-- Acción 2: Devolver stock</span>
    <span class="kw">UPDATE</span> LOCALIDAD_EVENTO <span class="kw">SET</span> stock_disponible = stock_disponible + <span class="num">1</span>
    <span class="kw">WHERE</span> localidad_evento_id = v_localidad_id;
<span class="kw">EXCEPTION</span>
    <span class="kw">WHEN</span> NO_DATA_FOUND <span class="kw">THEN</span>
        <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20005</span>, <span class="str">'Reserva no encontrada'</span>);
<span class="kw">END</span> cancelar_reserva_expirada;</pre>
            <div class="tip-box">
                <strong>¿Por qué procedimiento y no función?</strong> Porque (1) modifica datos con UPDATE, (2) no necesitamos usarlo en SELECT, y (3) el valor que devuelve (nombre del cliente) sale por el parámetro OUT.
            </div>
        `
    },
    {
        html: `
            <h2>Resumen</h2>
            <table>
                <tr><th>Concepto</th><th>Qué recordar</th></tr>
                <tr><td>PROCEDURE</td><td>Bloque con nombre que ejecuta acciones; no retorna valor directamente</td></tr>
                <tr><td>FUNCTION</td><td>Bloque con nombre que siempre retorna un valor con <code>RETURN</code></td></tr>
                <tr><td>IN</td><td>Solo lectura (default). No se puede modificar dentro del proc/func</td></tr>
                <tr><td>OUT</td><td>Salida. Comienza en NULL. El proc/func le asigna un valor</td></tr>
                <tr><td>IN OUT</td><td>Bidireccional. Entra con valor, puede modificarse y el cambio se refleja afuera</td></tr>
                <tr><td>¿OUT en función?</td><td>Técnicamente posible, pero NO hacerlo: pierdes el uso en SELECT</td></tr>
                <tr><td>¿RETURN o OUT?</td><td>Función si calculas 1 valor y/o usas en SQL. Procedimiento si haces DML o devuelves múltiples valores</td></tr>
                <tr><td>CREATE OR REPLACE</td><td>Crea o reemplaza sin necesidad de DROP previo</td></tr>
            </table>
            <div class="alien-separator">👽</div>
            <p style="text-align:center;color:#94a3b8;font-size:0.85em;">Siguiente: Casos prácticos avanzados con Punto Ticket</p>
        `
    }
];
