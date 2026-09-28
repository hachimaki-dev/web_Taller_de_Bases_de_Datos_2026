// s2_2_1_slides.js — Triggers: Introducción Guiada Paso a Paso
// Presentación para proyectar en datashow

const s2_2_1_slides = [
    {
        class: 'title-slide',
        html: `
            <h1>Introducción Guiada a Triggers</h1>
            <p class="subtitle">Unidad 2.2 — Sesión 1: Del Problema de Negocio a la Solución Paso a Paso</p>
            <p class="subtitle">Taller de Bases de Datos — Punto Ticket</p>
            <div class="alien-separator">👽</div>
        `
    },
    {
        html: `
            <h2>Nuestra Misión de Hoy</h2>
            <div class="concept-box">
                Hoy no vamos a memorizar sintaxis monstruosa ni decenas de opciones técnicas. 
                Vamos a ponernos en los zapatos del <strong>equipo de ingeniería de datos de Punto Ticket</strong>:
            </div>
            <div class="analogy-box">
                <strong>La Ruta de la Clase:</strong>
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.7;">
                    <li><strong>El Escenario Real:</strong> Entender qué datos tenemos y qué dolor sufre la empresa día a día.</li>
                    <li><strong>El Dilema:</strong> ¿Por qué nuestras herramientas habituales (Constraints y Procedimientos) no alcanzan?</li>
                    <li><strong>Caso 1 Paso a Paso:</strong> Limpiar datos sucios en vuelo con un trigger de solo 4 líneas (<code>BEFORE</code> y <code>:NEW</code>).</li>
                    <li><strong>Caso 2 Paso a Paso:</strong> El "dedazo" en los precios y cómo auditarlo sin tocar la aplicación (<code>AFTER</code> y <code>:OLD</code>).</li>
                    <li><strong>Comprobación:</strong> Ejecutar pruebas DML en vivo y ver la magia en acción.</li>
                </ol>
            </div>
        `
    },
    {
        html: `
            <h2>Acto 1: El Escenario Real en Punto Ticket</h2>
            <div class="concept-box">
                En Punto Ticket, miles de usuarios compran entradas concurrentemente desde múltiples canales:
            </div>
            <table>
                <tr><th>Canal de Entrada</th><th>¿Cómo interactúa con la BD?</th><th>Riesgo</th></tr>
                <tr><td>🌐 <strong>Web / App Móvil</strong></td><td>Frontend que envía datos validados vía API</td><td>Validaciones cosméticas fáciles de saltar</td></tr>
                <tr><td>🏢 <strong>Boletería Presencial</strong></td><td>Sistema POS en recintos (Movistar Arena, etc.)</td><td>Operadores con prisa ingresando datos rápidos</td></tr>
                <tr><td>⚙️ <strong>Scripts de Migración / ETL</strong></td><td>Cargas masivas de clientes desde convenios banco</td><td>Insertan directo en SQL sin pasar por la web</td></tr>
                <tr><td>👨‍💻 <strong>Administradores / DBA</strong></td><td>Ejecutan <code>UPDATE</code> directos en DBeaver o SQL Developer</td><td>Errores humanos directos sobre la base de datos</td></tr>
            </table>
            <div class="tip-box">
                <strong>Pregunta clave para la clase:</strong> Si alguien modifica o inserta datos directamente en la base de datos saltándose la página web... <em>¿quién protege las reglas del negocio?</em>
            </div>
        `
    },
    {
        html: `
            <h2>Dolor #1: El Caos con los Datos del Cliente</h2>
            <div class="concept-box">
                Veamos qué tenemos en la tabla <code>CLIENTE</code> de Punto Ticket:
            </div>
<pre><span class="kw">DESCRIBE</span> CLIENTE;
<span class="cm">-- Columnas: cliente_id, rut, nombre, apellido, email, telefono, fecha_registro</span></pre>
            <div class="warning-box">
                <strong>El Dolor en Producción:</strong>
                Los clientes se registran como quieren:
                <ul>
                    <li><code>JUAN.PEREZ@GMAIL.COM</code> (todo en mayúsculas)</li>
                    <li><code>   pEdRo.Soto@HOTMAIL.com  </code> (espacios y mayúsculas desordenadas)</li>
                    <li><code>mArIa</code> / <code>gonzalez</code> (nombres sin capitalizar)</li>
                </ul>
                <strong>Consecuencia:</strong> Fallan las búsquedas de login, se envían correos duplicados y los reportes de marketing se ven poco profesionales.
            </div>
        `
    },
    {
        html: `
            <h2>Análisis Previo: ¿Cómo intentaríamos resolverlo?</h2>
            <div class="concept-box">
                Antes de programar cualquier cosa, analicemos las herramientas que ya conocemos:
            </div>
            <table>
                <tr><th>Alternativa</th><th>¿Sirve para este problema?</th><th>¿Por qué falla?</th></tr>
                <tr>
                    <td><strong>DEFAULT</strong></td>
                    <td>❌ No</td>
                    <td><code>DEFAULT</code> solo actúa si la columna viene vacía (<code>NULL</code>). Si el usuario envía <code>'JUAN@GMAIL.COM'</code>, DEFAULT no hace nada.</td>
                </tr>
                <tr>
                    <td><strong>CHECK CONSTRAINT</strong></td>
                    <td>❌ No</td>
                    <td>Una constraint <code>CHECK (email = LOWER(email))</code> solo <strong>rechazaría</strong> el registro con un error feo en pantalla. ¡El cliente se frustra y se va sin comprar! Queremos corregirlo automáticamente, no botarlo.</td>
                </tr>
                <tr>
                    <td><strong>Procedimiento Almacenado</strong></td>
                    <td>⚠️ A medias</td>
                    <td>Si creamos <code>sp_registrar_cliente</code>, funciona... <em>siempre y cuando todos lo usen</em>. Pero si un script batch o un admin hace un <code>INSERT INTO CLIENTE</code> directo, se salta el procedimiento por completo.</td>
                </tr>
            </table>
        `
    },
    {
        html: `
            <h2>La Solución Conceptual: El "Guardia Invisible"</h2>
            <div class="concept-box">
                Necesitamos un centinela que <strong>viva pegado a la tabla</strong> y que sea <strong>imposible de evadir</strong>, sin importar si el dato viene de la app, de una API o de una consola SQL.
            </div>
            <div class="analogy-box">
                <strong>¿Qué es un Trigger en palabras sencillas?</strong><br>
                Es un bloque de código PL/SQL que Oracle ejecuta <strong>automáticamente</strong> en respuesta a un evento (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) sobre una tabla.<br><br>
                • Nadie lo llama explícitamente.<br>
                • No existe un <code>EXECUTE mi_trigger</code>.<br>
                • Se despierta solo cuando la tabla es tocada.
            </div>
            <div class="tip-box">
                Para nuestro Dolor #1 queremos que actúe <strong>ANTES (BEFORE)</strong> de que el dato toque el disco duro, para poder interceptar el texto y pasarlo a minúsculas en el aire.
            </div>
        `
    },
    {
        html: `
            <h2>Paso a Paso: Desarmando la Anatomía Mínima</h2>
            <div class="concept-box">
                Un trigger básico se escribe con 5 líneas esenciales:
            </div>
<pre><span class="cm">-- 1. ¿Cómo se llama?</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_cliente_limpiar_datos

<span class="cm">-- 2. ¿Cuándo y ante qué evento se despierta?</span>
<span class="kw">BEFORE INSERT OR UPDATE ON</span> CLIENTE

<span class="cm">-- 3. ¿Afecta a cada registro individualmente?</span>
<span class="kw">FOR EACH ROW</span>

<span class="cm">-- 4. ¿Qué hace cuando se despierta?</span>
<span class="kw">BEGIN</span>
    <span class="cm">-- Aquí va la magia en vuelo</span>
<span class="kw">END</span> trg_cliente_limpiar_datos;
/</pre>
            <div class="tip-box">
                <strong>¿Qué significa <code>FOR EACH ROW</code>?</strong><br>
                Le dice a Oracle: <em>"Si una sentencia inserta 5 clientes de un golpe, ejecútate 5 veces, una por cada persona"</em>. Es obligatorio siempre que queramos examinar o alterar los datos de la fila.
            </div>
        `
    },
    {
        html: `
            <h2>El Concepto Clave: Conociendo a :NEW</h2>
            <div class="concept-box">
                Cuando un registro va volando hacia la base de datos, Oracle lo atrapa momentáneamente en una variable especial llamada <code>:NEW</code> (el nuevo registro).
            </div>
            <div class="analogy-box">
                <strong>La Analogía de la Ficha Médica:</strong><br>
                Imagina que llenas una ficha de papel en la sala de espera y se la pasas a la recepcionista (<code>:NEW</code>).<br>
                Antes de meterla al archivador definitivo (<code>BEFORE</code>), la recepcionista saca un lápiz y <strong>corrige el formato</strong> de tu letra.<br>
                ¡Cuando se archiva, ya está corregida!
            </div>
<pre><span class="cm">-- En triggers BEFORE podemos escribir directamente sobre :NEW usando :=</span>
<span class="kw">:NEW</span>.email  := <span class="fn">LOWER</span>(<span class="fn">TRIM</span>(<span class="kw">:NEW</span>.email));
<span class="kw">:NEW</span>.nombre := <span class="fn">INITCAP</span>(<span class="fn">TRIM</span>(<span class="kw">:NEW</span>.nombre));</pre>
            <div class="tip-box">
                <code>TRIM</code> quita espacios accidentales, <code>LOWER</code> pasa a minúsculas y <code>INITCAP</code> pone la primera letra en mayúscula (ej: <code>'pedro'</code> → <code>'Pedro'</code>).
            </div>
        `
    },
    {
        html: `
            <h2>Trigger #1 Completo: Normalización en Vuelo</h2>
            <div class="concept-box">
                ¡Aquí está nuestro primer trigger de producción para Punto Ticket! Simple, elegante y de enorme valor:
            </div>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> trg_cliente_formato
<span class="kw">BEFORE INSERT OR UPDATE ON</span> CLIENTE
<span class="kw">FOR EACH ROW</span>
<span class="kw">BEGIN</span>
    <span class="cm">-- 1. Asegurar email siempre en minúsculas y sin espacios</span>
    <span class="kw">:NEW</span>.email := <span class="fn">LOWER</span>(<span class="fn">TRIM</span>(<span class="kw">:NEW</span>.email));

    <span class="cm">-- 2. Asegurar nombre y apellido con formato Capital (Juan Pérez)</span>
    <span class="kw">:NEW</span>.nombre   := <span class="fn">INITCAP</span>(<span class="fn">TRIM</span>(<span class="kw">:NEW</span>.nombre));
    <span class="kw">:NEW</span>.apellido := <span class="fn">INITCAP</span>(<span class="fn">TRIM</span>(<span class="kw">:NEW</span>.apellido));
<span class="kw">END</span> trg_cliente_formato;
/</pre>
            <div class="tip-box">
                <strong>¿Notas lo limpio que es?</strong> No hay variables intermedias ni selects complejos. Son solo 4 asignaciones directas.
            </div>
        `
    },
    {
        html: `
            <h2>Prueba en Vivo #1: Comprobando la Magia</h2>
            <p>Hagamos un <code>INSERT</code> con datos completamente desordenados:</p>
<pre><span class="kw">INSERT INTO</span> CLIENTE (rut, nombre, apellido, email, telefono)
<span class="kw">VALUES</span> (
    <span class="str">'19.876.543-2'</span>,
    <span class="str">'   mArIa   '</span>,
    <span class="str">'gOnZaLeZ  '</span>,
    <span class="str">'  MARIA.GONZALEZ@GMAIL.COM  '</span>,
    <span class="str">'+56912345678'</span>
);</pre>
            <p>Ahora consultamos qué quedó realmente guardado en la tabla:</p>
<pre><span class="kw">SELECT</span> nombre, apellido, email <span class="kw">FROM</span> CLIENTE <span class="kw">WHERE</span> rut = <span class="str">'19.876.543-2'</span>;</pre>
            <table>
                <tr><th>NOMBRE</th><th>APELLIDO</th><th>EMAIL</th></tr>
                <tr><td><code>Maria</code></td><td><code>Gonzalez</code></td><td><code>maria.gonzalez@gmail.com</code></td></tr>
            </table>
            <div class="tip-box">
                🎉 <strong>¡Éxito total!</strong> La base de datos se limpió sola. No importó quién ejecutó el INSERT: la regla se cumplió al 100%.
            </div>
        `
    },
    {
        html: `
            <h2>Dolor #2: El "Dedazo" en los Precios</h2>
            <div class="concept-box">
                Pasemos ahora a la tabla <code>LOCALIDAD_EVENTO</code> de Punto Ticket.
            </div>
            <div class="warning-box">
                <strong>Incidente Real en Producción:</strong><br>
                Un analista comercial debía subir el precio de la localidad <em>"Cancha VIP - Bad Bunny"</em> de <strong>$80.000</strong> a <strong>$95.000</strong>.<br>
                En su apuro, digitó en su pantalla:<br>
                <code>UPDATE LOCALIDAD_EVENTO SET precio = 9500 WHERE localidad_evento_id = 10;</code><br><br>
                ¡Se le olvidó un cero! En 15 minutos se vendieron 1.200 entradas a $9.500.<br>
                Pérdida neta: <strong>$102.600.000 CLP</strong>.
            </div>
            <div class="concept-box">
                <strong>La Gerencia exige:</strong><br>
                <em>"Necesitamos una bitácora inalterable. Cada vez que cambie un precio, quiero saber exactamente qué localidad fue, qué precio tenía antes, qué precio tiene ahora y cuándo ocurrió el cambio."</em>
            </div>
        `
    },
    {
        html: `
            <h2>Análisis Previo: ¿Por qué este caso necesita AFTER?</h2>
            <div class="concept-box">
                Comparemos las necesidades del Caso 1 vs Caso 2:
            </div>
            <table>
                <tr><th>Pregunta de Diseño</th><th>Caso 1: Limpieza de Cliente</th><th>Caso 2: Bitácora de Precios</th></tr>
                <tr><td><strong>¿Cuál es el objetivo?</strong></td><td>Modificar el valor antes de que se guarde</td><td>Registrar evidencia de un hecho ya consumado</td></tr>
                <tr><td><strong>¿Qué timing usamos?</strong></td><td><code>BEFORE</code> (para intervenir a tiempo)</td><td><code>AFTER</code> (atestiguar cuando el cambio se aplicó)</td></tr>
                <tr><td><strong>¿Qué datos necesitamos?</strong></td><td>Solo lo que viene llegando (<code>:NEW</code>)</td><td>El precio antiguo (<code>:OLD</code>) y el nuevo (<code>:NEW</code>)</td></tr>
                <tr><td><strong>¿Dónde dejamos el resultado?</strong></td><td>En la misma fila del cliente</td><td>En una tabla secundaria (<code>LOG_CAMBIO_PRECIO</code>)</td></tr>
            </table>
            <div class="tip-box">
                <strong>Regla de Oro:</strong> Si tu objetivo es <strong>auditar o dejar constancia</strong>, usa <code>AFTER</code>. Si tu objetivo es <strong>modificar o validar</strong>, usa <code>BEFORE</code>.
            </div>
        `
    },
    {
        html: `
            <h2>Conociendo a :OLD vs :NEW en un UPDATE</h2>
            <div class="concept-box">
                Cuando una fila existente sufre un <code>UPDATE</code>, Oracle te da acceso simultáneo a dos fotos en el tiempo:
            </div>
            <div class="analogy-box">
                <strong>La Foto del "Antes" y el "Después":</strong><br>
                • <code>:OLD.precio</code> → El valor que estaba en la base de datos antes de que se ejecutara la sentencia.<br>
                • <code>:NEW.precio</code> → El nuevo valor que la sentencia quiere asignar.<br>
            </div>
            <table>
                <tr><th>Expresión</th><th>Valor en nuestro ejemplo del dedazo</th></tr>
                <tr><td><code>:OLD.precio</code></td><td><code>80000</code></td></tr>
                <tr><td><code>:NEW.precio</code></td><td><code>9500</code></td></tr>
                <tr><td><code>:OLD.localidad_evento_id</code></td><td><code>10</code></td></tr>
            </table>
            <div class="tip-box">
                ¡Con estos dos datos podemos insertar exactamente una fila en nuestra tabla de log!
            </div>
        `
    },
    {
        html: `
            <h2>Trigger #2 Completo: Bitácora de Precios</h2>
            <div class="concept-box">
                Veamos cómo implementar la auditoría usando la tabla <code>LOG_CAMBIO_PRECIO</code> ya existente en Punto Ticket:
            </div>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> trg_auditar_precio
<span class="kw">AFTER UPDATE OF</span> precio <span class="kw">ON</span> LOCALIDAD_EVENTO
<span class="kw">FOR EACH ROW</span>
<span class="kw">WHEN</span> (OLD.precio != NEW.precio)  <span class="cm">-- ¡Solo si el precio realmente cambió!</span>
<span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_CAMBIO_PRECIO (
        localidad_evento_id,
        precio_anterior,
        precio_nuevo,
        fecha_cambio
    ) <span class="kw">VALUES</span> (
        <span class="kw">:OLD</span>.localidad_evento_id,  <span class="cm">-- qué localidad fue</span>
        <span class="kw">:OLD</span>.precio,               <span class="cm">-- cuánto costaba antes</span>
        <span class="kw">:NEW</span>.precio,               <span class="cm">-- a cuánto la cambiaron</span>
        SYSTIMESTAMP               <span class="cm">-- fecha y hora exacta</span>
    );
<span class="kw">END</span> trg_auditar_precio;
/</pre>
            <div class="warning-box">
                <strong>Ojo con el detalle en <code>WHEN</code>:</strong><br>
                En la cláusula <code>WHEN (OLD.precio != NEW.precio)</code> <strong>NO</strong> se colocan dos puntos (<code>:</code>). Los dos puntos solo van dentro del bloque <code>BEGIN...END</code>.
            </div>
        `
    },
    {
        html: `
            <h2>Prueba en Vivo #2: Atrapando el Dedazo</h2>
            <p>1. Verificamos el precio actual de la localidad 1:</p>
<pre><span class="kw">SELECT</span> localidad_evento_id, nombre_localidad, precio 
<span class="kw">FROM</span> LOCALIDAD_EVENTO <span class="kw">WHERE</span> localidad_evento_id = <span class="num">1</span>;
<span class="cm">-- Precio actual: $45.000</span></pre>
            <p>2. Un administrador ejecuta una actualización de precio:</p>
<pre><span class="kw">UPDATE</span> LOCALIDAD_EVENTO 
<span class="kw">SET</span> precio = <span class="num">52000</span> 
<span class="kw">WHERE</span> localidad_evento_id = <span class="num">1</span>;</pre>
            <p>3. Consultamos la tabla de auditoría:</p>
<pre><span class="kw">SELECT</span> localidad_evento_id, precio_anterior, precio_nuevo, fecha_cambio, administrador_id 
<span class="kw">FROM</span> LOG_CAMBIO_PRECIO 
<span class="kw">ORDER BY</span> log_precio_id <span class="kw">DESC</span>;</pre>
            <table>
                <tr><th>LOCALIDAD_ID</th><th>PRECIO_ANTERIOR</th><th>PRECIO_NUEVO</th><th>FECHA_CAMBIO</th><th>ADMINISTRADOR_ID</th></tr>
                <tr><td><code>1</code></td><td><code>45000</code></td><td><code>52000</code></td><td><code>28/09/2026 19:45:12</code></td><td><em style="color:#f59e0b;font-weight:700;">NULL</em></td></tr>
            </table>
            <div class="tip-box">
                🎯 ¡Quedó registrado automáticamente sin que el administrador tuviera que hacer nada adicional!
            </div>
        `
    },
    {
        html: `
            <h2>🤔 Un Detalle Crítico: ¿Se dieron cuenta de que administrador_id quedó en NULL?</h2>
            <div class="concept-box">
                Miren con atención el resultado anterior en <code>LOG_CAMBIO_PRECIO</code>: el campo <code>administrador_id</code> quedó en <strong style="color:#f59e0b;">NULL</strong>.<br>
                ¿Por qué ocurrió esto si la columna existe en la tabla de logs?
            </div>
            <table>
                <tr><th>Causa Real</th><th>Explicación en el Mundo Real</th></tr>
                <tr>
                    <td><strong>1. La tabla no lo tiene</strong></td>
                    <td>La tabla <code>LOCALIDAD_EVENTO</code> <strong>no tiene</strong> una columna <code>administrador_id</code>. Por lo tanto, el trigger no puede leerlo desde <code>:NEW</code> ni <code>:OLD</code>. Solo ve las columnas de su propia tabla.</td>
                </tr>
                <tr>
                    <td><strong>2. El Pool de Conexiones</strong></td>
                    <td>En una aplicación web real, el backend se conecta con un único usuario técnico de Oracle (ej: <code>USER = 'PUNTOTICKET_APP'</code>). Oracle <strong>no sabe</strong> qué persona específica hizo login en el navegador.</td>
                </tr>
                <tr>
                    <td><strong>3. Procesos ETL / Batch</strong></td>
                    <td>Si el cambio de precio lo hizo un script automático por la noche o una carga masiva (ETL)... ¡no hay ningún admin humano involucrado! En ese caso, <code>NULL</code> es correcto y valioso: indica <em>"modificación por proceso automático/externo"</em>.</td>
                </tr>
            </table>
            <div class="tip-box">
                🎯 <strong>La Gran Pregunta:</strong> Si un administrador humano sí cambió el precio desde la web... ¿cómo podemos hacer para que la aplicación le <em>"avise"</em> al trigger quién es el admin conectado antes de ejecutar el <code>UPDATE</code>?
            </div>
        `
    },
    {
        html: `
            <h2>🎯 Misión de Investigación: El Puente hacia los Paquetes PL/SQL</h2>
            <div class="analogy-box">
                <strong>¿Cómo resolvemos este misterio?</strong><br>
                Para permitir que una aplicación o un procedimiento le "pase contexto" a un trigger sin alterar las tablas, Oracle utiliza <strong>Paquetes PL/SQL (Packages)</strong> y variables de sesión.
            </div>
            <div class="warning-box">
                <strong>📝 Tarea / Desafío de Investigación para la próxima sesión:</strong>
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li>Investiga qué es un <strong>Package (Paquete)</strong> en Oracle PL/SQL y por qué sus variables globales mantienen su valor durante toda la sesión del usuario.</li>
                    <li>Averigua cómo un procedimiento de backend puede asignar el ID del admin conectado a una variable de paquete (ej: <code>pkg_contexto.g_admin_id := 5;</code>) justo antes de lanzar el <code>UPDATE</code>.</li>
                    <li>¿Cómo leería el trigger esa variable de paquete para que <code>administrador_id</code> ya no quede en <code>NULL</code>?</li>
                </ol>
            </div>
            <div class="tip-box">
                🚀 En la <strong>Sesión 3</strong> implementaremos en código este patrón profesional con <code>pkg_contexto</code>.
            </div>
        `
    },
    {
        html: `
            <h2>Resumen Visual: El Mapa Mental</h2>
            <table>
                <tr><th>Criterio</th><th><code>BEFORE</code></th><th><code>AFTER</code></th></tr>
                <tr><td><strong>Momento</strong></td><td>Antes de que la fila se escriba</td><td>Después de que la fila se escribió</td></tr>
                <tr><td><strong>Propósito Principal</strong></td><td>Limpiar datos, calcular defaults, validar</td><td>Auditoría, bitácora, alertas, réplicas</td></tr>
                <tr><td><strong>¿Puede cambiar :NEW?</strong></td><td><strong style="color:var(--success);">✅ SÍ</strong> (con <code>:NEW.campo := ...</code>)</td><td><strong style="color:var(--danger);">❌ NUNCA</strong> (error ORA-04084)</td></tr>
                <tr><td><strong>Acceso a :OLD y :NEW</strong></td><td>En <code>INSERT</code>: solo <code>:NEW</code><br>En <code>UPDATE</code>: ambos<br>En <code>DELETE</code>: solo <code>:OLD</code></td><td>En <code>INSERT</code>: solo <code>:NEW</code><br>En <code>UPDATE</code>: ambos<br>En <code>DELETE</code>: solo <code>:OLD</code></td></tr>
            </table>
        `
    },
    {
        html: `
            <h2>Las 3 Reglas de Oro del Principiante</h2>
            <div class="warning-box">
                <strong>Memoriza esto para evitar dolores de cabeza:</strong>
                <ol style="margin: 0.5rem 0 0 1.2rem; line-height: 1.8;">
                    <li><strong>Prohibido usar <code>COMMIT</code> o <code>ROLLBACK</code> dentro de un trigger:</strong> Un trigger es un pasajero en el auto del DML. Si intentas hacer COMMIT, Oracle lanzará <code>ORA-04092</code>.</li>
                    <li><strong>No intentes hacer <code>SELECT</code> sobre la misma tabla que disparó el trigger:</strong> Eso genera el temido error <code>ORA-04091: table is mutating</code>. (En la Sesión 3 aprenderemos a resolverlo con Compound Triggers).</li>
                    <li><strong>Mantenlo pequeño y enfocado:</strong> Un buen trigger tiene entre 5 y 15 líneas. Si necesitas 80 líneas de código, pon esa lógica en un procedimiento almacenado.</li>
                </ol>
            </div>
            <div class="alien-separator">👽</div>
            <p style="text-align:center;color:#94a3b8;font-size:0.9em;">¡Ahora vamos a la Guía Práctica para poner a prueba lo aprendido!</p>
        `
    }
];
