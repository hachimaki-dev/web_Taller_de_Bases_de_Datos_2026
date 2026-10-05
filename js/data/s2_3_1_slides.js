// s2_3_1_slides.js — Paquetes PL/SQL (Packages): Introducción y Fundamentos
// Nivel iniciación: caso práctico simple con 1 función, 1 procedimiento y 1 variable de paquete

const s2_3_1_slides = [
    // 1. Portada
    {
        class: 'title-slide',
        html: `
            <h1>Paquetes en PL/SQL: Fundamentos</h1>
            <p class="subtitle">Unidad 2.3 — Sesión 1: Introducción Guiada al Trabajo con Packages</p>
            <p class="subtitle">Taller de Bases de Datos — Punto Ticket</p>
            <div class="alien-separator">👽</div>
        `
    },

    // 2. El Escenario en Boletería
    {
        html: `
            <h2>El Escenario: Turno de Boletería en Punto Ticket</h2>
            <div class="concept-box">
                Imagina que estás a cargo de la boletería física en el Movistar Arena. Un cliente se acerca a tu ventanilla para comprar entradas para un concierto.
            </div>
            <div class="analogy-box">
                <strong>En tu puesto de trabajo necesitas resolver 3 cosas:</strong>
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li><strong>Consultar:</strong> Mirar en el sistema cuántas entradas quedan disponibles en una localidad.</li>
                    <li><strong>Vender:</strong> Si hay cupo, descontar las entradas vendidas del stock.</li>
                    <li><strong>Cuadrar caja:</strong> Saber cuántas entradas has vendido tú en total durante tu turno.</li>
                </ol>
            </div>
        `
    },

    // 3. El Problema de los Objetos Sueltos
    {
        html: `
            <h2>El Problema: ¿Cómo lo programaríamos normalmente?</h2>
            <div class="concept-box">
                Hasta ahora, para resolver esto crearíamos objetos independientes en la base de datos:
            </div>
            <ul>
                <li>Una función suelta: <code>fn_consultar_stock(p_localidad_id)</code></li>
                <li>Un procedimiento suelto: <code>sp_vender_entradas(p_localidad_id, p_cantidad)</code></li>
                <li>¿Y el contador de ventas del turno? Las variables locales de un procedimiento <strong>se borran</strong> apenas termina el bloque. Tendríamos que inventar tablas auxiliares solo para recordar un número.</li>
            </ul>
            <div class="warning-box">
                Tener funciones y procedimientos sueltos por todo el esquema genera desorden: nadie sabe qué función trabaja con qué procedimiento, ni comparten datos entre sí.
            </div>
        `
    },

    // 4. La Solución: ¿Qué es un Paquete?
    {
        html: `
            <h2>La Solución: ¿Qué es un Paquete (Package)?</h2>
            <div class="concept-box">
                Un <strong>paquete</strong> es como una <strong>carpeta organizada</strong> en la base de datos que reúne programas y variables que trabajan juntos para un mismo objetivo.
            </div>
            <div class="analogy-box">
                <strong>La metáfora del restaurante:</strong>
                <ul>
                    <li><strong>La Especificación (Spec):</strong> Es la <strong>carta del menú</strong>. El cliente la lee y ve qué platos puede pedir (nombres y precios), pero no dice cómo se cocinan.</li>
                    <li><strong>El Cuerpo (Body):</strong> Es la <strong>cocina</strong>. Adentro están los cocineros, las recetas y los ingredientes preparando los platos pedidos.</li>
                </ul>
            </div>
        `
    },

    // 5. Las Dos Partes Obligatorias
    {
        html: `
            <h2>Las Dos Partes de un Paquete</h2>
            <div class="concept-box">
                En Oracle, todo paquete se construye en dos archivos o comandos separados:
            </div>
            <table>
                <tr><th>Parte</th><th>Comando SQL</th><th>Propósito</th></tr>
                <tr>
                    <td><strong>1. Especificación</strong> (Specification)</td>
                    <td><code>CREATE OR REPLACE PACKAGE</code></td>
                    <td>Declara la lista pública de lo que el paquete ofrece (variables, funciones y procedimientos). <strong>Solo las cabeceras</strong>.</td>
                </tr>
                <tr>
                    <td><strong>2. Cuerpo</strong> (Body)</td>
                    <td><code>CREATE OR REPLACE PACKAGE BODY</code></td>
                    <td>Contiene el código PL/SQL real (el <code>BEGIN ... END</code>) de cada función y procedimiento.</td>
                </tr>
            </table>
            <div class="tip-box">
                <strong>Regla de oro:</strong> Primero se compila siempre la <strong>Especificación</strong>, y después se compila el <strong>Cuerpo</strong>.
            </div>
        `
    },

    // 6. El Plano de Nuestro Paquete: pkg_boleteria
    {
        html: `
            <h2>Nuestro Paquete de Hoy: pkg_boleteria</h2>
            <div class="concept-box">
                Vamos a resolver el trabajo del cajero con un paquete pequeño, limpio y directo:
            </div>
            <table>
                <tr><th>Elemento</th><th>Tipo</th><th>¿Qué hace?</th></tr>
                <tr>
                    <td><code>g_total_vendidas</code></td>
                    <td>Variable (NUMBER)</td>
                    <td>Lleva la cuenta de entradas que el cajero ha vendido en su turno.</td>
                </tr>
                <tr>
                    <td><code>consultar_stock</code></td>
                    <td>Función</td>
                    <td>Recibe el ID de una localidad y devuelve cuántas entradas quedan.</td>
                </tr>
                <tr>
                    <td><code>vender_entradas</code></td>
                    <td>Procedimiento</td>
                    <td>Valida el stock, descuenta las entradas vendidas y suma al contador del turno.</td>
                </tr>
            </table>
            <div class="tip-box">
                Solo interactuamos con una tabla: <code>LOCALIDAD_EVENTO</code> (columnas <code>localidad_evento_id</code>, <code>precio</code>, <code>stock_disponible</code>).
            </div>
        `
    },

    // 7. Paso 1: La Especificación
    {
        html: `
            <h2>Paso 1: Crear la Especificación</h2>
            <div class="concept-box">
                La especificación es corta: solo declara la variable y las cabeceras terminadas en punto y coma.
            </div>
<pre><span class="kw">CREATE OR REPLACE PACKAGE</span> pkg_boleteria <span class="kw">AS</span>
    <span class="cm">-- 1. Variable de paquete (guarda el total del turno del cajero)</span>
    g_total_vendidas <span class="kw">NUMBER</span> := <span class="num">0</span>;

    <span class="cm">-- 2. Firma de la función para consultar stock</span>
    <span class="kw">FUNCTION</span> consultar_stock(p_localidad_id <span class="kw">IN NUMBER</span>) 
    <span class="kw">RETURN NUMBER</span>;

    <span class="cm">-- 3. Firma del procedimiento para vender entradas</span>
    <span class="kw">PROCEDURE</span> vender_entradas(
        p_localidad_id <span class="kw">IN NUMBER</span>,
        p_cantidad     <span class="kw">IN NUMBER</span>
    );
<span class="kw">END</span> pkg_boleteria;
/</pre>
            <div class="tip-box">
                Fíjate que <strong>no hay bloques BEGIN ni código de consultas</strong> aquí. Solo la lista de lo que existe.
            </div>
        `
    },

    // 8. Paso 2: El Cuerpo - Estructura General
    {
        html: `
            <h2>Paso 2: La Estructura del Cuerpo (PACKAGE BODY)</h2>
            <div class="concept-box">
                El cuerpo usa <code>CREATE OR REPLACE PACKAGE BODY</code> y debe programar exactamente lo que prometió la especificación:
            </div>
<pre><span class="kw">CREATE OR REPLACE PACKAGE BODY</span> pkg_boleteria <span class="kw">AS</span>

    <span class="cm">-- Aquí programamos la función consultar_stock...</span>
    <span class="kw">FUNCTION</span> consultar_stock(...) <span class="kw">RETURN NUMBER IS</span>
    <span class="kw">BEGIN</span>
        ...
    <span class="kw">END</span> consultar_stock;

    <span class="cm">-- Aquí programamos el procedimiento vender_entradas...</span>
    <span class="kw">PROCEDURE</span> vender_entradas(...) <span class="kw">IS</span>
    <span class="kw">BEGIN</span>
        ...
    <span class="kw">END</span> vender_entradas;

<span class="kw">END</span> pkg_boleteria;
/</pre>
        `
    },

    // 9. Paso 3: Programar la Función consultar_stock
    {
        html: `
            <h2>Paso 3: Programar la Función consultar_stock</h2>
            <div class="concept-box">
                Dentro del cuerpo, la función consulta la tabla <code>LOCALIDAD_EVENTO</code> y retorna el stock disponible:
            </div>
<pre><span class="cm">    -- Dentro de PKG_BOLETERIA BODY:</span>
    <span class="kw">FUNCTION</span> consultar_stock(p_localidad_id <span class="kw">IN NUMBER</span>) 
    <span class="kw">RETURN NUMBER IS</span>
        v_stock <span class="kw">NUMBER</span>;
    <span class="kw">BEGIN</span>
        <span class="kw">SELECT</span> stock_disponible <span class="kw">INTO</span> v_stock
        <span class="kw">FROM</span> LOCALIDAD_EVENTO
        <span class="kw">WHERE</span> localidad_evento_id = p_localidad_id;

        <span class="kw">RETURN</span> v_stock;
    <span class="kw">EXCEPTION</span>
        <span class="kw">WHEN NO_DATA_FOUND THEN</span>
            <span class="kw">RETURN</span> <span class="num">0</span>; <span class="cm">-- Si no existe la localidad, retorna 0</span>
    <span class="kw">END</span> consultar_stock;</pre>
            <div class="tip-box">
                Es una función PL/SQL idéntica a las que ya conoces, pero ahora vive protegida dentro del paquete.
            </div>
        `
    },

    // 10. Paso 4: Programar el Procedimiento vender_entradas
    {
        html: `
            <h2>Paso 4: Programar el Procedimiento vender_entradas</h2>
            <div class="concept-box">
                El procedimiento utiliza la función anterior, descuenta el stock y suma a la variable del paquete:
            </div>
<pre><span class="cm">    -- Dentro de PKG_BOLETERIA BODY:</span>
    <span class="kw">PROCEDURE</span> vender_entradas(
        p_localidad_id <span class="kw">IN NUMBER</span>,
        p_cantidad     <span class="kw">IN NUMBER</span>
    ) <span class="kw">IS</span>
        v_disponible <span class="kw">NUMBER</span>;
    <span class="kw">BEGIN</span>
        <span class="cm">-- 1. Reutilizamos la función del mismo paquete</span>
        v_disponible := consultar_stock(p_localidad_id);

        <span class="cm">-- 2. Validamos si hay suficiente stock</span>
        <span class="kw">IF</span> v_disponible &lt; p_cantidad <span class="kw">THEN</span>
            <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20001</span>, <span class="str">'Stock insuficiente para la venta.'</span>);
        <span class="kw">END IF</span>;

        <span class="cm">-- 3. Descontamos el stock en la tabla</span>
        <span class="kw">UPDATE</span> LOCALIDAD_EVENTO
        <span class="kw">SET</span> stock_disponible = stock_disponible - p_cantidad
        <span class="kw">WHERE</span> localidad_evento_id = p_localidad_id;

        <span class="cm">-- 4. Acumulamos en la variable de paquete de la sesión</span>
        g_total_vendidas := g_total_vendidas + p_cantidad;
    <span class="kw">END</span> vender_entradas;</pre>
        `
    },

    // 11. La Variable de Paquete
    {
        html: `
            <h2>¿Por qué la variable g_total_vendidas es especial?</h2>
            <div class="concept-box">
                En un procedimiento normal, las variables mueren al llegar al <code>END;</code>. En un paquete es diferente:
            </div>
            <div class="analogy-box">
                <strong>Persistencia por Sesión:</strong>
                <ul>
                    <li><code>g_total_vendidas</code> se mantiene en la memoria del usuario durante toda su conexión.</li>
                    <li>Si el cajero vende 2 entradas en la mañana y 3 en la tarde, la variable recordará que van <strong>5</strong>.</li>
                    <li>No tuvimos que crear ninguna tabla en disco ni hacer <code>INSERT</code> de logs para llevar esa cuenta simple.</li>
                    <li>Cada cajero tiene su propio contador independiente sin mezclarse con otros.</li>
                </ul>
            </div>
        `
    },

    // 12. Poniendo a Prueba el Paquete
    {
        html: `
            <h2>Probando el Paquete en Vivo (Bloque de Prueba)</h2>
            <div class="concept-box">
                Para usar los objetos de un paquete usamos la <strong>notación de punto</strong>: <code>nombre_paquete.objeto</code>:
            </div>
<pre><span class="kw">DECLARE</span>
    v_stock_inicial <span class="kw">NUMBER</span>;
    v_stock_final   <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="cm">-- 1. Consultamos stock de la localidad 1 (Cancha General)</span>
    v_stock_inicial := pkg_boleteria.consultar_stock(<span class="num">1</span>);
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Stock inicial: '</span> || v_stock_inicial);

    <span class="cm">-- 2. Realizamos una venta de 2 entradas</span>
    pkg_boleteria.vender_entradas(<span class="num">1</span>, <span class="num">2</span>);

    <span class="cm">-- 3. Verificamos el stock actualizado</span>
    v_stock_final := pkg_boleteria.consultar_stock(<span class="num">1</span>);
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Stock luego de vender 2: '</span> || v_stock_final);

    <span class="cm">-- 4. Verificamos la variable del turno del cajero</span>
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Total vendidas en este turno: '</span> || 
        pkg_boleteria.g_total_vendidas);

    <span class="kw">ROLLBACK</span>; <span class="cm">-- Dejamos la tabla intacta tras la prueba</span>
<span class="kw">END</span>;
/</pre>
        `
    },

    // 13. Uso desde SQL
    {
        html: `
            <h2>¿Podemos usar la función del paquete en un SELECT?</h2>
            <div class="concept-box">
                <strong>¡Sí!</strong> Como <code>consultar_stock</code> es una función que solo lee datos y no hace INSERT ni UPDATE, podemos usarla en cualquier consulta SQL:
            </div>
<pre><span class="cm">-- Consultar el stock actual de todas las localidades de un evento:</span>
<span class="kw">SELECT</span> 
    nombre_localidad,
    precio,
    pkg_boleteria.consultar_stock(localidad_evento_id) <span class="kw">AS</span> cupos_disponibles
<span class="kw">FROM</span> LOCALIDAD_EVENTO
<span class="kw">WHERE</span> evento_id = <span class="num">1</span>;</pre>
            <div class="tip-box">
                La función calcula o consulta el dato y se comporta igual que cualquier función nativa de Oracle (como <code>ROUND</code> o <code>NVL</code>).
            </div>
        `
    },

    // 14. Resumen
    {
        html: `
            <h2>Resumen de la Sesión</h2>
            <div class="concept-box">
                Las 4 ideas clave que debes recordar de un paquete:
            </div>
            <ul>
                <li>📦 <strong>Es un contenedor:</strong> Agrupa funciones, procedimientos y variables que resuelven una misma necesidad de negocio.</li>
                <li>📋 <strong>Tiene dos partes:</strong> La <strong>Especificación</strong> (declara qué hay disponible) y el <strong>Cuerpo</strong> (contiene el código que lo ejecuta).</li>
                <li>🔗 <strong>Reutilización interna:</strong> Los procedimientos del paquete pueden llamar a las funciones del mismo paquete fácilmente.</li>
                <li>🧠 <strong>Memoria de sesión:</strong> Las variables del paquete guardan su valor mientras el usuario esté conectado.</li>
            </ul>
            <div class="tip-box">
                Pasa a la pestaña <strong>Guía Práctica</strong> para realizar tus primeros ejercicios con paquetes.
            </div>
        `
    }
];
