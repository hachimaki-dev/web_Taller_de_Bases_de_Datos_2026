// s2_2_2_slides.js — Triggers: Fundamentos y Tipos de Triggers
// Presentación para proyectar en datashow

const s2_2_2_slides = [
    {
        class: 'title-slide',
        html: `
            <h1>Triggers: Fundamentos y Clasificación</h1>
            <p class="subtitle">Unidad 2.2 — Sesión 2: Tipos, Timings y Eventos</p>
            <p class="subtitle">Taller de Bases de Datos</p>
            <div class="alien-separator">👽</div>
        `
    },
    {
        html: `
            <h2>¿Qué es un Trigger?</h2>
            <div class="concept-box">
                <strong>Definición técnica:</strong> Un trigger (disparador) es un bloque PL/SQL con nombre que se ejecuta <strong>automáticamente</strong> cuando ocurre un evento DML (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) sobre una tabla. A diferencia de un procedimiento, <strong>nadie lo invoca manualmente</strong>: Oracle lo dispara cuando se cumple la condición definida.
            </div>
            <div class="analogy-box">
                <strong>Para entenderlo mejor:</strong> Imagina la alarma de una tienda. Nadie la activa manualmente: se dispara sola cuando alguien cruza la puerta sin pagar. Un trigger funciona igual: tú defines <strong>cuándo</strong> debe dispararse (al insertar, al modificar) y <strong>qué debe hacer</strong>, y Oracle se encarga de ejecutarlo cada vez que ocurra ese evento.
            </div>
        `
    },
    {
        html: `
            <h2>¿Para qué sirven los Triggers?</h2>
            <div class="concept-box">
                Los triggers tienen usos muy específicos y valiosos en un modelo de negocio. No son para cualquier cosa — son para lógica que <strong>siempre debe ejecutarse</strong>, sin importar quién o qué modifica los datos.
            </div>
            <table>
                <tr><th>Caso de uso</th><th>Ejemplo en Punto Ticket</th></tr>
                <tr><td><strong>Auditoría</strong></td><td>Registrar quién cambió el precio de una localidad y cuándo</td></tr>
                <tr><td><strong>Validaciones complejas</strong></td><td>Impedir que se creen reservas si el stock es 0</td></tr>
                <tr><td><strong>Derivación automática</strong></td><td>Cambiar estado del evento a 'AGOTADO' cuando se agota el stock</td></tr>
                <tr><td><strong>Sincronización</strong></td><td>Registrar en un log cada anulación de ticket</td></tr>
                <tr><td><strong>Integridad de negocio</strong></td><td>Impedir modificaciones en eventos ya realizados</td></tr>
            </table>
            <div class="warning-box">
                <strong>Cuidado:</strong> Un trigger <strong>NO</strong> reemplaza la lógica de un procedimiento. Los triggers son para reglas que deben cumplirse <strong>siempre</strong>, sin importar si los datos se modifican desde un procedimiento, una aplicación, o directamente desde SQL*Plus.
            </div>
        `
    },
    {
        html: `
            <h2>Sintaxis: CREATE TRIGGER</h2>
            <div class="concept-box">
                Un trigger se define con 4 partes clave: <strong>cuándo</strong> se dispara (timing), <strong>ante qué evento</strong> (INSERT/UPDATE/DELETE), <strong>sobre qué tabla</strong>, y si actúa <strong>por cada fila</strong> o una sola vez por sentencia.
            </div>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> nombre_trigger
<span class="cm">-- 1. ¿CUÁNDO? (timing)</span>
<span class="kw">BEFORE</span> | <span class="kw">AFTER</span>
<span class="cm">-- 2. ¿ANTE QUÉ EVENTO?</span>
<span class="kw">INSERT</span> | <span class="kw">UPDATE</span> [<span class="kw">OF</span> columna] | <span class="kw">DELETE</span>
<span class="cm">-- 3. ¿SOBRE QUÉ TABLA?</span>
<span class="kw">ON</span> nombre_tabla
<span class="cm">-- 4. ¿POR CADA FILA o una vez?</span>
[<span class="kw">FOR EACH ROW</span>]
[<span class="kw">WHEN</span> (condición)]
<span class="cm">-- 5. CUERPO del trigger</span>
<span class="kw">BEGIN</span>
    <span class="cm">-- Lógica PL/SQL aquí</span>
<span class="kw">END</span> nombre_trigger;</pre>
            <div class="tip-box">
                <strong>Consejo:</strong> Usa <code>CREATE OR REPLACE</code> para poder modificar el trigger sin necesidad de eliminarlo primero con <code>DROP TRIGGER</code>.
            </div>
        `
    },
    {
        html: `
            <h2>BEFORE vs AFTER — ¿Cuándo se dispara?</h2>
            <div class="concept-box">
                El <strong>timing</strong> define si el trigger se ejecuta <strong>antes</strong> o <strong>después</strong> de que Oracle aplique el cambio en la tabla.
            </div>
            <table>
                <tr><th></th><th>BEFORE</th><th>AFTER</th></tr>
                <tr><td><strong>¿Cuándo se ejecuta?</strong></td><td>Antes de que el cambio se aplique</td><td>Después de que el cambio se aplicó</td></tr>
                <tr><td><strong>¿Puede modificar :NEW?</strong></td><td>✅ Sí — puede cambiar los valores antes de que se graben</td><td>❌ No — los datos ya están en la tabla</td></tr>
                <tr><td><strong>¿Puede cancelar la operación?</strong></td><td>✅ Sí — con <code>RAISE_APPLICATION_ERROR</code></td><td>✅ Sí — pero el cambio ya ocurrió (se revierte)</td></tr>
                <tr><td><strong>Uso típico</strong></td><td>Validaciones, cálculos previos, asignar valores default</td><td>Auditoría, sincronización, registrar logs</td></tr>
            </table>
            <div class="analogy-box">
                <strong>Analogía:</strong> <code>BEFORE</code> es como el <strong>guardia de seguridad</strong> en la entrada de un concierto: revisa tu ticket <em>antes</em> de dejarte pasar. <code>AFTER</code> es como la <strong>cámara de vigilancia</strong> que graba <em>después</em> de que entraste.
            </div>
        `
    },
    {
        html: `
            <h2>FOR EACH ROW vs Statement-Level</h2>
            <div class="concept-box">
                Un trigger puede ejecutarse <strong>una vez por cada fila</strong> afectada (<code>FOR EACH ROW</code>) o <strong>una sola vez por sentencia</strong> (sin <code>FOR EACH ROW</code>), sin importar cuántas filas cambien.
            </div>
            <table>
                <tr><th></th><th>FOR EACH ROW (Row-level)</th><th>Sin FOR EACH ROW (Statement-level)</th></tr>
                <tr><td><strong>Se ejecuta</strong></td><td>Una vez <strong>por cada fila</strong> afectada</td><td>Una sola vez <strong>por sentencia</strong></td></tr>
                <tr><td><strong>Acceso a :OLD / :NEW</strong></td><td>✅ Sí</td><td>❌ No — no hay "fila actual"</td></tr>
                <tr><td><strong>Ejemplo</strong></td><td><code>UPDATE LOCALIDAD_EVENTO SET precio = precio * 1.1</code> → se dispara N veces (una por cada localidad)</td><td>La misma sentencia → se dispara 1 sola vez</td></tr>
                <tr><td><strong>Uso típico</strong></td><td>Auditar cada fila, validar cada registro</td><td>Registrar que "alguien ejecutó un UPDATE en la tabla"</td></tr>
            </table>
<pre><span class="cm">-- Row-level: se ejecuta por CADA fila del UPDATE</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_ejemplo_row
<span class="kw">AFTER UPDATE ON</span> LOCALIDAD_EVENTO
<span class="kw">FOR EACH ROW</span>    <span class="cm">-- ← una vez por fila</span>
<span class="kw">BEGIN</span>
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Fila modificada: '</span> || <span class="kw">:OLD</span>.localidad_evento_id);
<span class="kw">END</span>;

<span class="cm">-- Statement-level: se ejecuta UNA sola vez</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_ejemplo_stmt
<span class="kw">AFTER UPDATE ON</span> LOCALIDAD_EVENTO
<span class="cm">-- Sin FOR EACH ROW</span>
<span class="kw">BEGIN</span>
    DBMS_OUTPUT.PUT_LINE(<span class="str">'Se ejecutó un UPDATE en LOCALIDAD_EVENTO'</span>);
<span class="kw">END</span>;</pre>
        `
    },
    {
        html: `
            <h2>:OLD y :NEW — Los Valores de la Fila</h2>
            <div class="concept-box">
                En triggers <code>FOR EACH ROW</code>, Oracle te da acceso a dos pseudo-registros:<br>
                • <code>:OLD</code> — el valor <strong>antes</strong> del cambio (el dato que está/estaba en la tabla)<br>
                • <code>:NEW</code> — el valor <strong>después</strong> del cambio (el dato que se va a grabar)
            </div>
            <table>
                <tr><th>Evento</th><th>:OLD</th><th>:NEW</th></tr>
                <tr><td><code>INSERT</code></td><td><code>NULL</code> (no existía fila antes)</td><td>✅ Los valores que se están insertando</td></tr>
                <tr><td><code>UPDATE</code></td><td>✅ Valores anteriores al cambio</td><td>✅ Valores nuevos después del cambio</td></tr>
                <tr><td><code>DELETE</code></td><td>✅ Valores de la fila que se elimina</td><td><code>NULL</code> (la fila dejará de existir)</td></tr>
            </table>
<pre><span class="cm">-- Ejemplo: Registrar cambio de precio en LOCALIDAD_EVENTO</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_log_precio
<span class="kw">AFTER UPDATE OF</span> precio <span class="kw">ON</span> LOCALIDAD_EVENTO
<span class="kw">FOR EACH ROW</span>
<span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_CAMBIO_PRECIO (
        localidad_evento_id, precio_anterior, precio_nuevo
    ) <span class="kw">VALUES</span> (
        <span class="kw">:OLD</span>.localidad_evento_id,   <span class="cm">-- ID de la localidad</span>
        <span class="kw">:OLD</span>.precio,                 <span class="cm">-- precio ANTES del cambio</span>
        <span class="kw">:NEW</span>.precio                  <span class="cm">-- precio DESPUÉS del cambio</span>
    );
<span class="kw">END</span> trg_log_precio;</pre>
            <div class="tip-box">
                <strong>Regla mnemotécnica:</strong> <code>:OLD</code> = lo que <em>había</em>. <code>:NEW</code> = lo que <em>habrá</em>.
            </div>
        `
    },
    {
        html: `
            <h2>Modificar :NEW en Triggers BEFORE</h2>
            <div class="concept-box">
                En un trigger <code>BEFORE</code>, puedes <strong>modificar los valores de :NEW</strong> antes de que Oracle los grabe en la tabla. Esto es útil para asignar valores por defecto, calcular campos derivados, o forzar formatos.
            </div>
<pre><span class="cm">-- Ejemplo: Forzar el estado 'ACTIVA' en toda nueva reserva</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_reserva_estado_default
<span class="kw">BEFORE INSERT ON</span> RESERVA_TEMPORAL
<span class="kw">FOR EACH ROW</span>
<span class="kw">BEGIN</span>
    <span class="cm">-- Sin importar qué valor pusieron, forzamos 'ACTIVA'</span>
    <span class="kw">:NEW</span>.estado := <span class="str">'ACTIVA'</span>;
    <span class="cm">-- Calculamos la fecha de expiración si no la pusieron</span>
    <span class="kw">IF :NEW</span>.fecha_expiracion <span class="kw">IS NULL THEN</span>
        <span class="kw">:NEW</span>.fecha_expiracion := SYSTIMESTAMP + <span class="kw">INTERVAL</span> <span class="str">'15'</span> <span class="kw">MINUTE</span>;
    <span class="kw">END IF</span>;
<span class="kw">END</span> trg_reserva_estado_default;</pre>
            <div class="warning-box">
                <strong>Importante:</strong> Solo puedes modificar <code>:NEW</code> en triggers <code>BEFORE</code>. En un trigger <code>AFTER</code>, intentar asignar a <code>:NEW</code> genera el error <code>ORA-04084: cannot change NEW values for this trigger type</code>.
            </div>
        `
    },
    {
        html: `
            <h2>UPDATE OF columna — Disparar solo cuando cambia una columna específica</h2>
            <div class="concept-box">
                Puedes hacer que un trigger se dispare <strong>solo cuando se modifica una columna específica</strong>, usando <code>UPDATE OF nombre_columna</code>. Esto evita disparos innecesarios cuando se modifican otras columnas de la misma tabla.
            </div>
<pre><span class="cm">-- Solo se dispara cuando cambia la columna 'precio'</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_log_precio
<span class="kw">AFTER UPDATE OF</span> precio <span class="kw">ON</span> LOCALIDAD_EVENTO   <span class="cm">-- ← solo la columna precio</span>
<span class="kw">FOR EACH ROW</span>
<span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_CAMBIO_PRECIO (
        localidad_evento_id, precio_anterior, precio_nuevo
    ) <span class="kw">VALUES</span> (
        <span class="kw">:OLD</span>.localidad_evento_id,
        <span class="kw">:OLD</span>.precio,
        <span class="kw">:NEW</span>.precio
    );
<span class="kw">END</span> trg_log_precio;</pre>
            <div class="tip-box">
                <strong>¿Sin el OF?</strong> Si escribes solo <code>AFTER UPDATE ON LOCALIDAD_EVENTO</code>, el trigger se dispara con <strong>cualquier UPDATE</strong> a la tabla, aunque no toque la columna <code>precio</code>.
            </div>
        `
    },
    {
        html: `
            <h2>Cláusula WHEN — Condición extra para disparar</h2>
            <div class="concept-box">
                La cláusula <code>WHEN</code> agrega una condición adicional que se evalúa <strong>fila por fila</strong>. Si la condición es falsa, el trigger no se ejecuta para esa fila. Dentro del <code>WHEN</code>, se usan <code>OLD</code> y <code>NEW</code> <strong>sin los dos puntos</strong>.
            </div>
<pre><span class="cm">-- Solo registra en el log si el precio realmente cambió</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_log_precio_cambio
<span class="kw">AFTER UPDATE OF</span> precio <span class="kw">ON</span> LOCALIDAD_EVENTO
<span class="kw">FOR EACH ROW</span>
<span class="kw">WHEN</span> (OLD.precio != NEW.precio)    <span class="cm">-- ← sin ":" en WHEN</span>
<span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_CAMBIO_PRECIO (
        localidad_evento_id, precio_anterior, precio_nuevo
    ) <span class="kw">VALUES</span> (
        <span class="kw">:OLD</span>.localidad_evento_id,  <span class="cm">-- ← con ":" en el cuerpo</span>
        <span class="kw">:OLD</span>.precio,
        <span class="kw">:NEW</span>.precio
    );
<span class="kw">END</span> trg_log_precio_cambio;</pre>
            <div class="warning-box">
                <strong>Error frecuente:</strong> Usar <code>:OLD</code> y <code>:NEW</code> (con dos puntos) dentro de la cláusula <code>WHEN</code> genera un error de compilación. Dentro de <code>WHEN</code> se usan <strong>sin dos puntos</strong>: <code>OLD.precio</code>. Dentro del <code>BEGIN...END</code> se usan <strong>con dos puntos</strong>: <code>:OLD.precio</code>.
            </div>
        `
    },
    {
        html: `
            <h2>Triggers con Múltiples Eventos</h2>
            <div class="concept-box">
                Un mismo trigger puede responder a <strong>múltiples eventos</strong> combinando <code>INSERT</code>, <code>UPDATE</code> y <code>DELETE</code> con <code>OR</code>. Dentro del cuerpo, puedes identificar cuál evento lo disparó con los predicados <code>INSERTING</code>, <code>UPDATING</code> y <code>DELETING</code>.
            </div>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> trg_auditoria_reservas
<span class="kw">AFTER INSERT OR UPDATE OR DELETE ON</span> RESERVA_TEMPORAL
<span class="kw">FOR EACH ROW</span>
<span class="kw">BEGIN</span>
    <span class="kw">IF</span> INSERTING <span class="kw">THEN</span>
        DBMS_OUTPUT.PUT_LINE(
            <span class="str">'Nueva reserva: '</span> || <span class="kw">:NEW</span>.reserva_id ||
            <span class="str">' - Cliente: '</span> || <span class="kw">:NEW</span>.cliente_id
        );
    <span class="kw">ELSIF</span> UPDATING <span class="kw">THEN</span>
        DBMS_OUTPUT.PUT_LINE(
            <span class="str">'Reserva '</span> || <span class="kw">:OLD</span>.reserva_id ||
            <span class="str">' cambió estado: '</span> || <span class="kw">:OLD</span>.estado ||
            <span class="str">' → '</span> || <span class="kw">:NEW</span>.estado
        );
    <span class="kw">ELSIF</span> DELETING <span class="kw">THEN</span>
        DBMS_OUTPUT.PUT_LINE(
            <span class="str">'Reserva eliminada: '</span> || <span class="kw">:OLD</span>.reserva_id
        );
    <span class="kw">END IF</span>;
<span class="kw">END</span> trg_auditoria_reservas;</pre>
            <div class="tip-box">
                <strong>Predicados útiles:</strong> <code>INSERTING</code>, <code>UPDATING</code>, <code>DELETING</code> retornan <code>TRUE</code> o <code>FALSE</code>. También puedes usar <code>UPDATING('nombre_columna')</code> para verificar si una columna específica está siendo modificada.
            </div>
        `
    },
    {
        html: `
            <h2>⚠️ Mutating Tables — El Error Más Temido</h2>
            <div class="concept-box">
                El error <code>ORA-04091: table is mutating, trigger may not see it</code> ocurre cuando un trigger <code>FOR EACH ROW</code> intenta hacer un <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code> o <code>DELETE</code> sobre <strong>la misma tabla</strong> que disparó el trigger.
            </div>
<pre><span class="cm">-- ❌ ESTO FALLA con ORA-04091</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_mutating_ejemplo
<span class="kw">AFTER UPDATE OF</span> stock_disponible <span class="kw">ON</span> LOCALIDAD_EVENTO
<span class="kw">FOR EACH ROW</span>
<span class="kw">DECLARE</span>
    v_total <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="cm">-- Intentar leer LOCALIDAD_EVENTO dentro del trigger → ERROR</span>
    <span class="kw">SELECT SUM</span>(stock_disponible) <span class="kw">INTO</span> v_total
    <span class="kw">FROM</span> LOCALIDAD_EVENTO                <span class="cm">-- ← ¡MISMA tabla!</span>
    <span class="kw">WHERE</span> evento_id = <span class="kw">:NEW</span>.evento_id;
<span class="kw">END</span>;</pre>
            <div class="analogy-box">
                <strong>Analogía:</strong> Es como intentar contar las piezas de un puzzle <strong>mientras alguien está moviendo las piezas</strong>. Oracle no puede garantizar datos consistentes porque la tabla está "en movimiento" (mutating).
            </div>
            <div class="tip-box">
                <strong>¿Cómo evitarlo?</strong>
                <ul>
                    <li>✅ Usar un <strong>trigger compuesto</strong> (COMPOUND TRIGGER) — lo veremos en la Sesión 3</li>
                    <li>✅ Mover la consulta a una <strong>tabla diferente</strong></li>
                    <li>✅ Usar un trigger <strong>statement-level</strong> (sin FOR EACH ROW) que no accede a :OLD/:NEW</li>
                </ul>
            </div>
        `
    },
    {
        html: `
            <h2>Habilitar, Deshabilitar y Eliminar Triggers</h2>
            <div class="concept-box">
                A veces necesitas desactivar un trigger temporalmente (por ejemplo, para una carga masiva de datos) sin eliminarlo.
            </div>
<pre><span class="cm">-- Deshabilitar un trigger específico</span>
<span class="kw">ALTER TRIGGER</span> trg_log_precio <span class="kw">DISABLE</span>;

<span class="cm">-- Habilitar un trigger específico</span>
<span class="kw">ALTER TRIGGER</span> trg_log_precio <span class="kw">ENABLE</span>;

<span class="cm">-- Deshabilitar TODOS los triggers de una tabla</span>
<span class="kw">ALTER TABLE</span> LOCALIDAD_EVENTO <span class="kw">DISABLE ALL TRIGGERS</span>;

<span class="cm">-- Habilitar TODOS los triggers de una tabla</span>
<span class="kw">ALTER TABLE</span> LOCALIDAD_EVENTO <span class="kw">ENABLE ALL TRIGGERS</span>;

<span class="cm">-- Eliminar un trigger definitivamente</span>
<span class="kw">DROP TRIGGER</span> trg_log_precio;

<span class="cm">-- Consultar triggers existentes</span>
<span class="kw">SELECT</span> trigger_name, table_name, status, triggering_event
<span class="kw">FROM</span> USER_TRIGGERS
<span class="kw">ORDER BY</span> table_name;</pre>
            <div class="warning-box">
                <strong>Buena práctica:</strong> Antes de una carga masiva de datos, deshabilita los triggers con <code>DISABLE ALL TRIGGERS</code> y rehabilítalos después con <code>ENABLE ALL TRIGGERS</code>. Esto mejora significativamente el rendimiento de la carga.
            </div>
        `
    },
    {
        html: `
            <h2>Buenas Prácticas con Triggers</h2>
            <div class="tip-box">
                <strong>Naming conventions:</strong>
                <ul>
                    <li>Prefijo <code>trg_</code> para triggers: <code>trg_log_precio</code>, <code>trg_validar_stock</code></li>
                    <li>Nombre descriptivo: <code>trg_</code> + acción + tabla → <code>trg_audit_reserva</code></li>
                    <li>Ser consistente en todo el esquema</li>
                </ul>
            </div>
            <div class="warning-box">
                <strong>Errores y antipatrones a evitar:</strong>
                <ul>
                    <li>❌ <strong>COMMIT/ROLLBACK dentro del trigger</strong> → error <code>ORA-04092</code>. El trigger es parte de la transacción del DML que lo disparó.</li>
                    <li>❌ <strong>Lógica de negocio compleja</strong> en triggers → difícil de mantener y depurar. Usa procedimientos.</li>
                    <li>❌ <strong>Consultar la tabla que disparó el trigger</strong> (row-level) → <code>ORA-04091</code> mutating table.</li>
                    <li>❌ <strong>Cadenas de triggers</strong> → un trigger que modifica otra tabla que tiene otro trigger, que modifica otra tabla... Evítalo.</li>
                    <li>❌ <strong>Modificar :NEW en trigger AFTER</strong> → error <code>ORA-04084</code>.</li>
                </ul>
            </div>
            <div class="tip-box">
                <strong>Regla de oro:</strong> Un trigger debe ser <strong>corto, simple y predecible</strong>. Si necesitas más de 20 líneas de lógica, probablemente deberías estar usando un procedimiento almacenado que el trigger invoque.
            </div>
        `
    },
    {
        html: `
            <h2>Resumen de Tipos de Trigger</h2>
            <table>
                <tr><th>Timing</th><th>Nivel</th><th>Acceso :OLD/:NEW</th><th>¿Modifica :NEW?</th><th>Uso típico</th></tr>
                <tr><td><code>BEFORE</code></td><td>Row</td><td>✅ Sí</td><td>✅ Sí</td><td>Validar, calcular, asignar defaults</td></tr>
                <tr><td><code>AFTER</code></td><td>Row</td><td>✅ Sí</td><td>❌ No</td><td>Auditoría, logs, sincronización</td></tr>
                <tr><td><code>BEFORE</code></td><td>Statement</td><td>❌ No</td><td>❌ No</td><td>Validar permisos a nivel de sentencia</td></tr>
                <tr><td><code>AFTER</code></td><td>Statement</td><td>❌ No</td><td>❌ No</td><td>Resumen post-operación</td></tr>
            </table>
            <div class="concept-box">
                <strong>Orden de ejecución cuando hay múltiples triggers:</strong>
                <ol>
                    <li>BEFORE statement-level</li>
                    <li>Por cada fila: BEFORE row-level → cambio real → AFTER row-level</li>
                    <li>AFTER statement-level</li>
                </ol>
            </div>
        `
    },
    {
        html: `
            <h2>🎯 Desafío 1: El gerente quiere auditoría de precios</h2>
            <div class="analogy-box">
                <strong>Historia de usuario:</strong> <em>"Como gerente de Punto Ticket, necesito que cada vez que alguien modifique el precio de una localidad, se registre automáticamente el precio anterior, el nuevo, y cuándo ocurrió el cambio. Sin importar quién lo haga ni desde dónde."</em>
            </div>
            <div class="concept-box">
                <strong>Analicemos juntos — ¿Qué tipo de trigger?</strong>
                <ul>
                    <li>🤔 ¿Cuándo debe dispararse? → <strong>Después</strong> del UPDATE (queremos registrar lo que <em>ya</em> cambió).</li>
                    <li>🤔 ¿Qué evento? → <strong>UPDATE</strong> de la columna <code>precio</code> en <code>LOCALIDAD_EVENTO</code>.</li>
                    <li>🤔 ¿Por cada fila o una vez? → <strong>Por cada fila</strong>, porque necesitamos :OLD y :NEW.</li>
                    <li>🤔 ¿Necesitamos la tabla <code>LOG_CAMBIO_PRECIO</code>? → ✅ Sí, ya existe en el esquema.</li>
                </ul>
            </div>
            <div class="tip-box">
                ✅ <strong>Conclusión: Trigger AFTER UPDATE OF precio ... FOR EACH ROW</strong>
            </div>
            <p style="text-align:center;color:#94a3b8;font-size:0.9em;margin-top:1rem;">👉 En la siguiente slide lo construimos...</p>
        `
    },
    {
        html: `
            <h2>🎯 Desafío 1: Resolución paso a paso</h2>
            <p><strong>Paso 1 — La firma:</strong> AFTER UPDATE OF precio, FOR EACH ROW</p>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> trg_log_cambio_precio
<span class="kw">AFTER UPDATE OF</span> precio <span class="kw">ON</span> LOCALIDAD_EVENTO
<span class="kw">FOR EACH ROW</span>
<span class="kw">WHEN</span> (OLD.precio != NEW.precio)   <span class="cm">-- solo si realmente cambió</span></pre>
            <p><strong>Paso 2 — El cuerpo:</strong> Insertar en la tabla de log.</p>
<pre><span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_CAMBIO_PRECIO (
        localidad_evento_id,
        precio_anterior,
        precio_nuevo
    ) <span class="kw">VALUES</span> (
        <span class="kw">:OLD</span>.localidad_evento_id,
        <span class="kw">:OLD</span>.precio,
        <span class="kw">:NEW</span>.precio
    );
<span class="kw">END</span> trg_log_cambio_precio;</pre>
            <p><strong>Paso 3 — Probarlo:</strong></p>
<pre><span class="cm">-- Esto dispara el trigger automáticamente</span>
<span class="kw">UPDATE</span> LOCALIDAD_EVENTO
<span class="kw">SET</span> precio = precio * <span class="num">1.15</span>
<span class="kw">WHERE</span> localidad_evento_id = <span class="num">1</span>;

<span class="cm">-- Verificar el log</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> LOG_CAMBIO_PRECIO;
<span class="kw">ROLLBACK</span>;</pre>
            <div class="tip-box">
                <strong>¿Por qué AFTER y no BEFORE?</strong> Porque el propósito es <strong>auditar</strong> (registrar lo que pasó), no validar ni modificar. La auditoría se hace <em>después</em> del hecho.
            </div>
        `
    },
    {
        html: `
            <h2>🎯 Desafío 2: Validar stock antes de reservar</h2>
            <div class="analogy-box">
                <strong>Historia de usuario:</strong> <em>"Como sistema de Punto Ticket, necesito que sea imposible crear una reserva temporal si la localidad ya no tiene stock disponible. Esta regla debe cumplirse siempre, sin importar si la reserva se crea desde un procedimiento, una aplicación, o directamente con un INSERT."</em>
            </div>
            <div class="concept-box">
                <strong>Analicemos juntos — ¿Qué tipo de trigger?</strong>
                <ul>
                    <li>🤔 ¿Cuándo? → <strong>Antes</strong> del INSERT (queremos <em>impedir</em> la operación).</li>
                    <li>🤔 ¿Qué evento? → <strong>INSERT</strong> en <code>RESERVA_TEMPORAL</code>.</li>
                    <li>🤔 ¿Por cada fila? → <strong>Sí</strong>, necesitamos saber qué localidad se está reservando (:NEW).</li>
                    <li>🤔 ¿Consulta a LOCALIDAD_EVENTO? → ✅ Es otra tabla, no hay mutating.</li>
                </ul>
            </div>
            <div class="tip-box">
                ✅ <strong>Conclusión: Trigger BEFORE INSERT ... FOR EACH ROW</strong>
            </div>
            <p style="text-align:center;color:#94a3b8;font-size:0.9em;margin-top:1rem;">👉 En la siguiente slide lo construimos...</p>
        `
    },
    {
        html: `
            <h2>🎯 Desafío 2: Resolución paso a paso</h2>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> trg_validar_stock_reserva
<span class="kw">BEFORE INSERT ON</span> RESERVA_TEMPORAL
<span class="kw">FOR EACH ROW</span>
<span class="kw">DECLARE</span>
    v_stock <span class="kw">NUMBER</span>;
<span class="kw">BEGIN</span>
    <span class="cm">-- Consultar stock de la localidad (otra tabla → sin mutating)</span>
    <span class="kw">SELECT</span> stock_disponible <span class="kw">INTO</span> v_stock
    <span class="kw">FROM</span> LOCALIDAD_EVENTO
    <span class="kw">WHERE</span> localidad_evento_id = <span class="kw">:NEW</span>.localidad_evento_id;

    <span class="cm">-- Si no hay stock, impedir el INSERT</span>
    <span class="kw">IF</span> v_stock &lt;= <span class="num">0</span> <span class="kw">THEN</span>
        <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20050</span>,
            <span class="str">'Sin stock disponible para la localidad '</span> ||
            <span class="kw">:NEW</span>.localidad_evento_id);
    <span class="kw">END IF</span>;
<span class="kw">EXCEPTION</span>
    <span class="kw">WHEN</span> NO_DATA_FOUND <span class="kw">THEN</span>
        <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20051</span>,
            <span class="str">'Localidad no encontrada: '</span> ||
            <span class="kw">:NEW</span>.localidad_evento_id);
<span class="kw">END</span> trg_validar_stock_reserva;</pre>
            <div class="warning-box">
                <strong>Nota:</strong> Consultar <code>LOCALIDAD_EVENTO</code> desde un trigger en <code>RESERVA_TEMPORAL</code> es válido porque son <strong>tablas diferentes</strong>. El error de mutating solo ocurre al consultar <strong>la misma tabla</strong> que disparó el trigger.
            </div>
            <div class="tip-box">
                <strong>¿Por qué BEFORE y no AFTER?</strong> Porque queremos <strong>impedir</strong> el INSERT antes de que ocurra. Si usamos AFTER, la fila ya se habría insertado (aunque luego se revertiría con el error).
            </div>
        `
    },
    {
        html: `
            <h2>Resumen — Sesión 2</h2>
            <table>
                <tr><th>Concepto</th><th>Qué recordar</th></tr>
                <tr><td>TRIGGER</td><td>Bloque PL/SQL que se ejecuta <strong>automáticamente</strong> ante un evento DML</td></tr>
                <tr><td>BEFORE / AFTER</td><td>BEFORE para validar/modificar antes del cambio; AFTER para auditar/registrar después</td></tr>
                <tr><td>FOR EACH ROW</td><td>Se ejecuta una vez por cada fila afectada; permite acceder a :OLD y :NEW</td></tr>
                <tr><td>Statement-level</td><td>Se ejecuta una sola vez por sentencia; no accede a :OLD/:NEW</td></tr>
                <tr><td>:OLD / :NEW</td><td>Valores antes y después del cambio. Con ":" en el cuerpo, sin ":" en WHEN</td></tr>
                <tr><td>WHEN</td><td>Condición extra para filtrar qué filas disparan el trigger</td></tr>
                <tr><td>UPDATE OF col</td><td>Dispara el trigger solo cuando cambia una columna específica</td></tr>
                <tr><td>Mutating Table</td><td>No puedes consultar/modificar la misma tabla en un trigger row-level</td></tr>
                <tr><td>COMMIT en trigger</td><td>❌ Prohibido — el trigger es parte de la transacción del DML</td></tr>
            </table>
            <div class="alien-separator">👽</div>
            <p style="text-align:center;color:#94a3b8;font-size:0.85em;">Siguiente: Sesión 3 — Casos avanzados y Mutating Tables</p>
        `
    }
];
