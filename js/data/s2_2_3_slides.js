// s2_2_3_slides.js — Triggers: Casos Prácticos y Compound Triggers con Punto Ticket
// Presentación para proyectar en datashow

const s2_2_3_slides = [
    {
        class: 'title-slide',
        html: `
            <h1>Triggers: Casos Prácticos y Mutating Tables</h1>
            <p class="subtitle">Unidad 2.2 — Sesión 3</p>
            <p class="subtitle">Taller de Bases de Datos — Punto Ticket</p>
            <div class="alien-separator">👽</div>
        `
    },
    {
        html: `
            <h2>Recap: Conceptos Clave de Triggers</h2>
            <table>
                <tr><th></th><th>BEFORE</th><th>AFTER</th></tr>
                <tr><td><strong>Propósito</strong></td><td>Validar, calcular, asignar defaults</td><td>Auditoría, logs, sincronización</td></tr>
                <tr><td><strong>Modifica :NEW</strong></td><td>✅ Sí</td><td>❌ No</td></tr>
                <tr><td><strong>Cancela operación</strong></td><td>✅ Antes de que ocurra</td><td>✅ Pero se revierte</td></tr>
            </table>
            <table>
                <tr><th></th><th>FOR EACH ROW</th><th>Statement-level</th></tr>
                <tr><td><strong>Accede a :OLD/:NEW</strong></td><td>✅ Sí</td><td>❌ No</td></tr>
                <tr><td><strong>Se ejecuta</strong></td><td>N veces (una por fila)</td><td>1 vez por sentencia</td></tr>
            </table>
            <div class="tip-box">
                <strong>Hoy:</strong> Triggers avanzados aplicados al modelo de negocio de Punto Ticket, incluyendo <strong>COMPOUND TRIGGER</strong> para resolver el problema de mutating tables.
            </div>
        `
    },
    {
        html: `
            <h2>Caso 1: Auditoría de Anulación de Tickets</h2>
            <div class="concept-box">
                Trigger <code>AFTER UPDATE</code> que registra automáticamente en <code>LOG_ANULACIONES</code> cada vez que un ticket cambia su estado a <code>'ANULADO'</code>. La tabla de log ya existe en el esquema.
            </div>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> trg_log_anulacion_ticket
<span class="kw">AFTER UPDATE OF</span> estado <span class="kw">ON</span> TICKET
<span class="kw">FOR EACH ROW</span>
<span class="kw">WHEN</span> (NEW.estado = 'ANULADO' AND OLD.estado != 'ANULADO')
<span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_ANULACIONES (
        ticket_id,
        transaccion_id,
        reserva_id,
        motivo
    ) <span class="kw">VALUES</span> (
        <span class="kw">:OLD</span>.ticket_id,
        <span class="kw">:OLD</span>.transaccion_id,
        <span class="kw">:OLD</span>.reserva_id,
        <span class="str">'Anulación automática registrada por trigger'</span>
    );
<span class="kw">END</span> trg_log_anulacion_ticket;</pre>
            <div class="tip-box">
                <strong>¿Por qué usar WHEN?</strong> La condición <code>NEW.estado = 'ANULADO' AND OLD.estado != 'ANULADO'</code> asegura que el trigger solo se dispare cuando el ticket <em>se convierte</em> en anulado, no en cualquier UPDATE del estado.
            </div>
        `
    },
    {
        html: `
            <h2>Caso 2: Auto-Agotar Evento cuando Stock llega a 0</h2>
            <div class="concept-box">
                Cuando el stock de una localidad baja a 0, verificamos si <strong>todas</strong> las localidades del evento están agotadas. Si es así, cambiamos el estado del evento a <code>'AGOTADO'</code> automáticamente.
            </div>
            <div class="warning-box">
                <strong>⚠️ Problema:</strong> Si hacemos esto en un trigger <code>FOR EACH ROW</code> sobre <code>LOCALIDAD_EVENTO</code>, necesitamos consultar la misma tabla para saber si las <em>otras</em> localidades también están agotadas → <strong>mutating table (ORA-04091)</strong>.
            </div>
            <div class="concept-box">
                <strong>Solución: COMPOUND TRIGGER</strong> — Un tipo especial de trigger que permite ejecutar código en <strong>diferentes momentos</strong> de la misma sentencia, compartiendo variables entre ellos.
            </div>
<pre><span class="cm">-- Estructura de un COMPOUND TRIGGER</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> nombre
<span class="kw">FOR</span> evento <span class="kw">ON</span> tabla
<span class="kw">COMPOUND TRIGGER</span>
    <span class="cm">-- Variables compartidas (visibles en todas las secciones)</span>
    v_variable <span class="kw">NUMBER</span>;

    <span class="kw">BEFORE STATEMENT IS BEGIN</span> ... <span class="kw">END BEFORE STATEMENT</span>;
    <span class="kw">BEFORE EACH ROW IS BEGIN</span> ... <span class="kw">END BEFORE EACH ROW</span>;
    <span class="kw">AFTER EACH ROW IS BEGIN</span> ... <span class="kw">END AFTER EACH ROW</span>;
    <span class="kw">AFTER STATEMENT IS BEGIN</span> ... <span class="kw">END AFTER STATEMENT</span>;
<span class="kw">END</span> nombre;</pre>
        `
    },
    {
        html: `
            <h2>Caso 2: Resolución con COMPOUND TRIGGER</h2>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> trg_auto_agotar_evento
<span class="kw">FOR UPDATE OF</span> stock_disponible <span class="kw">ON</span> LOCALIDAD_EVENTO
<span class="kw">COMPOUND TRIGGER</span>
    <span class="cm">-- Colección para guardar los evento_id afectados</span>
    <span class="kw">TYPE</span> t_ids <span class="kw">IS TABLE OF NUMBER</span>;
    v_eventos t_ids := t_ids();

<span class="kw">AFTER EACH ROW IS</span>
<span class="kw">BEGIN</span>
    <span class="cm">-- Guardar el evento_id cuando el stock llega a 0</span>
    <span class="kw">IF :NEW</span>.stock_disponible = <span class="num">0</span> <span class="kw">THEN</span>
        v_eventos.EXTEND;
        v_eventos(v_eventos.COUNT) := <span class="kw">:NEW</span>.evento_id;
    <span class="kw">END IF</span>;
<span class="kw">END AFTER EACH ROW</span>;

<span class="kw">AFTER STATEMENT IS</span>
<span class="kw">BEGIN</span>
    <span class="cm">-- Ahora SÍ podemos consultar LOCALIDAD_EVENTO (ya no está mutating)</span>
    <span class="kw">FOR</span> i <span class="kw">IN</span> <span class="num">1</span>..v_eventos.COUNT <span class="kw">LOOP</span>
        <span class="kw">UPDATE</span> EVENTO
        <span class="kw">SET</span> estado = <span class="str">'AGOTADO'</span>
        <span class="kw">WHERE</span> evento_id = v_eventos(i)
          <span class="kw">AND</span> estado = <span class="str">'VENTA'</span>
          <span class="kw">AND NOT EXISTS</span> (
              <span class="kw">SELECT</span> <span class="num">1</span> <span class="kw">FROM</span> LOCALIDAD_EVENTO
              <span class="kw">WHERE</span> evento_id = v_eventos(i)
                <span class="kw">AND</span> stock_disponible > <span class="num">0</span>
          );
    <span class="kw">END LOOP</span>;
<span class="kw">END AFTER STATEMENT</span>;

<span class="kw">END</span> trg_auto_agotar_evento;</pre>
            <div class="tip-box">
                <strong>¿Por qué funciona?</strong> En la sección <code>AFTER EACH ROW</code> solo guardamos los IDs (sin consultar la tabla). En <code>AFTER STATEMENT</code>, la tabla ya no está mutando y podemos consultarla libremente.
            </div>
        `
    },
    {
        html: `
            <h2>Caso 3: Historial de Estados de Reserva</h2>
            <div class="concept-box">
                Cada vez que una reserva cambia de estado, registramos el cambio en una tabla de historial. Esto es valioso para trazabilidad y análisis de comportamiento de clientes.
            </div>
<pre><span class="cm">-- Primero, crear la tabla de log</span>
<span class="kw">CREATE TABLE</span> LOG_ESTADO_RESERVA (
    log_estado_id    <span class="kw">NUMBER GENERATED ALWAYS AS IDENTITY</span>,
    reserva_id       <span class="kw">NUMBER NOT NULL</span>,
    estado_anterior  <span class="kw">VARCHAR2</span>(<span class="num">20</span>),
    estado_nuevo     <span class="kw">VARCHAR2</span>(<span class="num">20</span>) <span class="kw">NOT NULL</span>,
    fecha_cambio     <span class="kw">TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL</span>,

    <span class="kw">CONSTRAINT</span> pk_log_estado_reserva
        <span class="kw">PRIMARY KEY</span> (log_estado_id),
    <span class="kw">CONSTRAINT</span> fk_log_estado_reserva
        <span class="kw">FOREIGN KEY</span> (reserva_id)
        <span class="kw">REFERENCES</span> RESERVA_TEMPORAL (reserva_id)
);</pre>
<pre><span class="cm">-- Luego, el trigger</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_historial_estado_reserva
<span class="kw">AFTER UPDATE OF</span> estado <span class="kw">ON</span> RESERVA_TEMPORAL
<span class="kw">FOR EACH ROW</span>
<span class="kw">WHEN</span> (OLD.estado != NEW.estado)
<span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_ESTADO_RESERVA (
        reserva_id, estado_anterior, estado_nuevo
    ) <span class="kw">VALUES</span> (
        <span class="kw">:OLD</span>.reserva_id,
        <span class="kw">:OLD</span>.estado,
        <span class="kw">:NEW</span>.estado
    );
<span class="kw">END</span> trg_historial_estado_reserva;</pre>
        `
    },
    {
        html: `
            <h2>Caso 4: Proteger Eventos Finalizados</h2>
            <div class="concept-box">
                Un evento con estado <code>'REALIZADO'</code> o <code>'CANCELADO'</code> no debería poder modificarse ni eliminarse. Este trigger actúa como un <strong>guardia</strong> que impide esas operaciones.
            </div>
<pre><span class="kw">CREATE OR REPLACE TRIGGER</span> trg_proteger_evento_final
<span class="kw">BEFORE UPDATE OR DELETE ON</span> EVENTO
<span class="kw">FOR EACH ROW</span>
<span class="kw">BEGIN</span>
    <span class="kw">IF :OLD</span>.estado <span class="kw">IN</span> (<span class="str">'REALIZADO'</span>, <span class="str">'CANCELADO'</span>) <span class="kw">THEN</span>
        <span class="err">RAISE_APPLICATION_ERROR</span>(<span class="num">-20060</span>,
            <span class="str">'Operación denegada: el evento "'</span> || <span class="kw">:OLD</span>.nombre ||
            <span class="str">'" tiene estado '</span> || <span class="kw">:OLD</span>.estado ||
            <span class="str">' y no puede ser modificado ni eliminado.'</span>);
    <span class="kw">END IF</span>;
<span class="kw">END</span> trg_proteger_evento_final;</pre>
            <p><strong>Prueba:</strong></p>
<pre><span class="cm">-- Intentar modificar un evento cancelado → debe fallar</span>
<span class="kw">BEGIN</span>
    <span class="kw">UPDATE</span> EVENTO <span class="kw">SET</span> nombre = <span class="str">'Test'</span>
    <span class="kw">WHERE</span> evento_id = <span class="num">1</span> <span class="kw">AND</span> estado = <span class="str">'CANCELADO'</span>;
<span class="kw">EXCEPTION</span>
    <span class="kw">WHEN</span> OTHERS <span class="kw">THEN</span>
        DBMS_OUTPUT.PUT_LINE(<span class="str">'✅ Protección activa: '</span> || SQLERRM);
<span class="kw">END;</span></pre>
            <div class="analogy-box">
                <strong>Analogía:</strong> Es como un candado en un expediente archivado. Una vez que el caso está cerrado (REALIZADO/CANCELADO), nadie puede modificar el expediente sin autorización especial.
            </div>
        `
    },
    {
        html: `
            <h2>Caso 5: Auditoría Completa de Precios</h2>
            <div class="concept-box">
                Versión mejorada del trigger de auditoría de precios que incluye el <code>administrador_id</code> del usuario Oracle que ejecutó el cambio. Usa un <strong>paquete auxiliar</strong> para pasar contexto al trigger.
            </div>
<pre><span class="cm">-- Paquete para almacenar contexto de sesión</span>
<span class="kw">CREATE OR REPLACE PACKAGE</span> pkg_contexto <span class="kw">AS</span>
    g_admin_id <span class="kw">NUMBER</span> := <span class="kw">NULL</span>;
<span class="kw">END</span> pkg_contexto;
/

<span class="cm">-- Trigger mejorado con contexto</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_audit_precio_completo
<span class="kw">AFTER UPDATE OF</span> precio <span class="kw">ON</span> LOCALIDAD_EVENTO
<span class="kw">FOR EACH ROW</span>
<span class="kw">WHEN</span> (OLD.precio != NEW.precio)
<span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_CAMBIO_PRECIO (
        localidad_evento_id,
        precio_anterior,
        precio_nuevo,
        administrador_id
    ) <span class="kw">VALUES</span> (
        <span class="kw">:OLD</span>.localidad_evento_id,
        <span class="kw">:OLD</span>.precio,
        <span class="kw">:NEW</span>.precio,
        pkg_contexto.g_admin_id    <span class="cm">-- ← del paquete</span>
    );
<span class="kw">END</span> trg_audit_precio_completo;</pre>
<pre><span class="cm">-- Uso: el procedimiento establece el contexto antes</span>
<span class="kw">BEGIN</span>
    pkg_contexto.g_admin_id := <span class="num">1</span>;  <span class="cm">-- Admin que ejecuta</span>
    <span class="kw">UPDATE</span> LOCALIDAD_EVENTO
    <span class="kw">SET</span> precio = <span class="num">35000</span>
    <span class="kw">WHERE</span> localidad_evento_id = <span class="num">1</span>;
    <span class="kw">ROLLBACK</span>;
<span class="kw">END;</span></pre>
        `
    },
    {
        html: `
            <h2>Trigger + Procedimiento: División de Responsabilidades</h2>
            <div class="concept-box">
                Un patrón muy usado es combinar triggers con procedimientos: el trigger <strong>detecta</strong> el evento y el procedimiento <strong>ejecuta</strong> la lógica compleja. Esto mantiene el trigger corto y la lógica mantenible.
            </div>
<pre><span class="cm">-- Procedimiento con la lógica pesada</span>
<span class="kw">CREATE OR REPLACE PROCEDURE</span> registrar_cambio_precio(
    p_localidad_id  <span class="kw">IN NUMBER</span>,
    p_precio_ant    <span class="kw">IN NUMBER</span>,
    p_precio_nuevo  <span class="kw">IN NUMBER</span>
) <span class="kw">AS</span>
<span class="kw">BEGIN</span>
    <span class="kw">INSERT INTO</span> LOG_CAMBIO_PRECIO (
        localidad_evento_id, precio_anterior,
        precio_nuevo, administrador_id
    ) <span class="kw">VALUES</span> (
        p_localidad_id, p_precio_ant,
        p_precio_nuevo, pkg_contexto.g_admin_id
    );
<span class="kw">END</span> registrar_cambio_precio;</pre>
<pre><span class="cm">-- Trigger delgado que invoca al procedimiento</span>
<span class="kw">CREATE OR REPLACE TRIGGER</span> trg_precio_delgado
<span class="kw">AFTER UPDATE OF</span> precio <span class="kw">ON</span> LOCALIDAD_EVENTO
<span class="kw">FOR EACH ROW</span>
<span class="kw">WHEN</span> (OLD.precio != NEW.precio)
<span class="kw">BEGIN</span>
    <span class="cm">-- El trigger solo detecta y delega</span>
    registrar_cambio_precio(
        <span class="kw">:OLD</span>.localidad_evento_id,
        <span class="kw">:OLD</span>.precio,
        <span class="kw">:NEW</span>.precio
    );
<span class="kw">END</span> trg_precio_delgado;</pre>
            <div class="tip-box">
                <strong>Ventaja:</strong> Si la lógica de registro cambia, modificas solo el procedimiento. El trigger queda intacto. Además, el procedimiento puede reutilizarse desde otros contextos.
            </div>
        `
    },
    {
        html: `
            <h2>Consultar Triggers del Esquema</h2>
            <div class="concept-box">
                Oracle almacena la información de todos los triggers en vistas del diccionario de datos. Puedes consultarlas para conocer qué triggers existen, su estado, y su código fuente.
            </div>
<pre><span class="cm">-- Ver todos los triggers de mi esquema</span>
<span class="kw">SELECT</span> trigger_name, table_name,
       triggering_event, trigger_type, status
<span class="kw">FROM</span> USER_TRIGGERS
<span class="kw">ORDER BY</span> table_name, trigger_name;

<span class="cm">-- Ver el código fuente de un trigger específico</span>
<span class="kw">SELECT</span> trigger_body
<span class="kw">FROM</span> USER_TRIGGERS
<span class="kw">WHERE</span> trigger_name = <span class="str">'TRG_LOG_CAMBIO_PRECIO'</span>;

<span class="cm">-- Triggers agrupados por tabla</span>
<span class="kw">SELECT</span> table_name,
       <span class="fn">COUNT</span>(*) <span class="kw">AS</span> total_triggers,
       <span class="fn">SUM</span>(<span class="kw">CASE WHEN</span> status = <span class="str">'ENABLED'</span> <span class="kw">THEN</span> <span class="num">1</span> <span class="kw">ELSE</span> <span class="num">0</span> <span class="kw">END</span>) <span class="kw">AS</span> activos,
       <span class="fn">SUM</span>(<span class="kw">CASE WHEN</span> status = <span class="str">'DISABLED'</span> <span class="kw">THEN</span> <span class="num">1</span> <span class="kw">ELSE</span> <span class="num">0</span> <span class="kw">END</span>) <span class="kw">AS</span> desactivados
<span class="kw">FROM</span> USER_TRIGGERS
<span class="kw">GROUP BY</span> table_name;</pre>
        `
    },
    {
        html: `
            <h2>Errores Comunes y Cómo Resolverlos</h2>
            <table>
                <tr><th>Error</th><th>Causa</th><th>Solución</th></tr>
                <tr>
                    <td><code>ORA-04091</code></td>
                    <td>Mutating table: consultar la tabla que disparó el trigger</td>
                    <td>Usar COMPOUND TRIGGER o consultar otra tabla</td>
                </tr>
                <tr>
                    <td><code>ORA-04092</code></td>
                    <td>COMMIT/ROLLBACK dentro del trigger</td>
                    <td>Eliminar COMMIT/ROLLBACK del cuerpo del trigger</td>
                </tr>
                <tr>
                    <td><code>ORA-04084</code></td>
                    <td>Asignar a :NEW en trigger AFTER</td>
                    <td>Cambiar a BEFORE si necesitas modificar :NEW</td>
                </tr>
                <tr>
                    <td><code>ORA-04082</code></td>
                    <td>Usar :NEW en trigger DELETE o :OLD en INSERT</td>
                    <td>Verificar qué pseudo-registros aplican a cada evento</td>
                </tr>
                <tr>
                    <td>Compilación</td>
                    <td>Usar <code>:OLD</code> en la cláusula WHEN</td>
                    <td>Dentro de WHEN se usa <code>OLD</code> (sin dos puntos)</td>
                </tr>
            </table>
            <div class="warning-box">
                <strong>Depuración de triggers:</strong> Si el trigger compila pero no parece dispararse, verifica:
                <ul>
                    <li>¿Está habilitado? → <code>SELECT status FROM USER_TRIGGERS WHERE trigger_name = '...'</code></li>
                    <li>¿La condición WHEN es correcta? → Puede estar filtrando todas las filas</li>
                    <li>¿El evento coincide? → <code>UPDATE OF columna</code> podría no coincidir con el UPDATE real</li>
                </ul>
            </div>
        `
    },
    {
        html: `
            <h2>Resumen — Sesión 3</h2>
            <table>
                <tr><th>Concepto</th><th>Qué recordar</th></tr>
                <tr><td>Auditoría con triggers</td><td>Usar AFTER + FOR EACH ROW para registrar cambios en tablas de log</td></tr>
                <tr><td>COMPOUND TRIGGER</td><td>Resuelve mutating tables: código en diferentes fases de la sentencia</td></tr>
                <tr><td>WHEN (condición)</td><td>Filtro adicional sin ":" (OLD.col, NEW.col). Evita disparos innecesarios</td></tr>
                <tr><td>Protección de datos</td><td>BEFORE + RAISE_APPLICATION_ERROR para impedir operaciones no deseadas</td></tr>
                <tr><td>Contexto con paquetes</td><td>Usar variables de paquete para pasar info adicional al trigger</td></tr>
                <tr><td>Trigger + Procedimiento</td><td>Trigger delgado detecta; procedimiento ejecuta la lógica compleja</td></tr>
                <tr><td>USER_TRIGGERS</td><td>Vista del diccionario de datos para consultar triggers existentes</td></tr>
                <tr><td>DISABLE / ENABLE</td><td>Desactivar triggers para cargas masivas; reactivar después</td></tr>
            </table>
            <div class="alien-separator">👽</div>
            <p style="text-align:center;color:#94a3b8;font-size:0.85em;">¡Felicitaciones! Has completado el ciclo completo de Triggers en Oracle PL/SQL.</p>
        `
    }
];
