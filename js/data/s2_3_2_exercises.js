// s2_3_2_exercises.js — Ejercicios: Paquetes PL/SQL (Packages)
// Casos prácticos aplicados al modelo de Punto Ticket

const s2_3_2_exercises = [
    {
        id: 'e232-mc1',
        type: 'multiple-choice',
        question: '¿Cuál es la diferencia fundamental entre la <strong>Especificación (Specification)</strong> y el <strong>Cuerpo (Body)</strong> de un paquete en Oracle PL/SQL?',
        options: [
            'La especificación define la interfaz pública (el qué) sin código ejecutable, mientras que el cuerpo contiene la implementación concreta (el cómo) y los objetos privados.',
            'La especificación se ejecuta en el servidor y el cuerpo se ejecuta en la máquina cliente.',
            'La especificación solo puede contener procedimientos y el cuerpo solo puede contener funciones.',
            'No hay diferencia técnica; separar ambas partes es opcional y solo se hace por estética.'
        ]
    },
    {
        id: 'e232-mc2',
        type: 'multiple-choice',
        question: '¿Dónde residen y cuánto tiempo persisten las <strong>variables públicas o privadas</strong> declaradas en un paquete PL/SQL?',
        options: [
            'En la memoria PGA del usuario, manteniendo su valor durante toda la sesión activa de la base de datos hasta que el usuario se desconecte.',
            'En el disco duro permanentemente como si fueran columnas de una tabla relacional.',
            'Se destruyen inmediatamente apenas termina de ejecutarse el procedimiento o función que las leyó.',
            'En la memoria compartida SGA y su valor es visible e idéntico para todos los usuarios del sistema.'
        ]
    },
    {
        id: 'e232-mc3',
        type: 'multiple-choice',
        question: 'Si en un sistema en producción necesitas optimizar una consulta dentro del <code>PACKAGE BODY</code> sin modificar las cabeceras declaradas en el <code>PACKAGE</code>, ¿qué ocurre con los procedimientos, vistas o aplicaciones que consumen el paquete?',
        options: [
            'Permanecen válidos (<strong>no se invalidan</strong>), permitiendo actualizaciones en caliente sin romper dependencias ni requerir recompilación masiva.',
            'Todos los objetos dependientes pasan automáticamente al estado INVALID y detienen el servicio.',
            'Oracle arroja el error ORA-04091 de tabla mutante de manera preventiva.',
            'Deben eliminarse con DROP y recrearse desde cero para poder reconocer los cambios.'
        ]
    },
    {
        id: 'e232-tf1',
        type: 'true-false',
        question: 'Un procedimiento auxiliar implementado exclusivamente en el <code>PACKAGE BODY</code> (que no fue declarado en la especificación) puede ser invocado directamente desde un bloque anónimo externo usando la notación <code>nombre_paquete.procedimiento</code>.'
    },
    {
        id: 'e232-tf2',
        type: 'true-false',
        question: 'La <strong>sobrecarga (overloading)</strong> permite que dentro de un mismo paquete existan dos subprogramas con el mismo nombre siempre que sus parámetros difieran en número o tipo, pero Oracle no permite sobrecargar funciones cuya única diferencia sea el tipo de dato del <code>RETURN</code>.'
    },
    {
        id: 'e232-fill1',
        type: 'fill-code',
        question: 'Completa la <strong>Especificación</strong> del paquete <code>pkg_gestion_eventos</code> para declarar una constante de comisión y la firma del procedimiento para cancelar eventos:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE ' },
            { type: 'blank', index: 0, placeholder: 'tipo objeto', width: 100 },
            { type: 'text', content: ' pkg_gestion_eventos AS\n    -- Constante pública de comisión (12%)\n    c_comision ' },
            { type: 'blank', index: 1, placeholder: 'cláusula constante', width: 160 },
            { type: 'text', content: ' := 0.12;\n\n    -- Firma pública de cancelación\n    PROCEDURE cancelar_evento(p_evento_id IN NUMBER);\n' },
            { type: 'blank', index: 2, placeholder: 'cierre paquete', width: 180 },
            { type: 'text', content: ';\n/' }
        ]
    },
    {
        id: 'e232-fill2',
        type: 'fill-code',
        question: 'Completa el <strong>PACKAGE BODY</strong> asegurando que compile el cuerpo y ejecute el bloque de inicialización para la variable de sesión:',
        parts: [
            { type: 'text', content: 'CREATE OR REPLACE ' },
            { type: 'blank', index: 0, placeholder: 'cuerpo del paquete', width: 140 },
            { type: 'text', content: ' pkg_gestion_eventos AS\n\n    PROCEDURE cancelar_evento(p_evento_id IN NUMBER) IS\n    BEGIN\n        UPDATE EVENTO SET estado = \'CANCELADO\' WHERE evento_id = p_evento_id;\n    END cancelar_evento;\n\n' },
            { type: 'blank', index: 1, placeholder: 'inicio bloque inicialización', width: 80 },
            { type: 'text', content: '\n    -- Inicialización de auditoría de sesión\n    DBMS_OUTPUT.PUT_LINE(\'Paquete pkg_gestion_eventos inicializado en la sesión.\');\nEND pkg_gestion_eventos;\n/' }
        ]
    },
    {
        id: 'e232-err1',
        type: 'find-error',
        question: 'Encuentra la línea que provoca el error de compilación <code>PLS-00323: subprogram declared in package specification does not match body</code> por discrepancia en la firma:',
        lines: [
            '-- ESPECIFICACIÓN:',
            'CREATE OR REPLACE PACKAGE pkg_tickets AS',
            '    PROCEDURE emitir(p_reserva_id NUMBER, p_admin_id NUMBER);',
            'END pkg_tickets;',
            '/',
            '-- CUERPO:',
            'CREATE OR REPLACE PACKAGE BODY pkg_tickets AS',
            '    PROCEDURE emitir(p_reserva_id NUMBER) IS',
            '    BEGIN',
            '        DBMS_OUTPUT.PUT_LINE(\'Emitiendo reserva: \' || p_reserva_id);',
            '    END emitir;',
            'END pkg_tickets;',
            '/'
        ]
    },
    {
        id: 'e232-err2',
        type: 'find-error',
        question: 'Encuentra la línea con error conceptual y de sintaxis en la <strong>Especificación</strong> del paquete (las especificaciones no admiten código ejecutable):',
        lines: [
            'CREATE OR REPLACE PACKAGE pkg_liquidaciones AS',
            '    c_iva CONSTANT NUMBER := 0.19;',
            '    g_recaudacion_total NUMBER;',
            '    FUNCTION calcular_iva(p_monto NUMBER) RETURN NUMBER;',
            '    BEGIN',
            '        DBMS_OUTPUT.PUT_LINE(\'Iniciando paquete...\');',
            '    END;',
            'END pkg_liquidaciones;',
            '/'
        ]
    },
    {
        id: 'e232-ws1',
        type: 'word-search',
        question: 'Encuentra los siguientes <strong>5 términos clave</strong> de la arquitectura de Paquetes en Oracle PL/SQL:',
        gridSize: 10,
        words: ['PACKAGE', 'BODY', 'SPEC', 'OVERLOAD', 'SESSION'],
        wordPlacements: [
            { word: 'PACKAGE', cells: [0, 1, 2, 3, 4, 5, 6], clue: 'Objeto de esquema que agrupa lógicamente componentes PL/SQL' },
            { word: 'BODY', cells: [20, 21, 22, 23], clue: 'Cuerpo del paquete donde se programa el código ejecutable y objetos privados' },
            { word: 'SPEC', cells: [40, 41, 42, 43], clue: 'Abreviación común de la Especificación o interfaz pública del paquete' },
            { word: 'OVERLOAD', cells: [60, 61, 62, 63, 64, 65, 66, 67], clue: 'Sobrecarga: múltiples subprogramas con el mismo nombre y distinta firma' },
            { word: 'SESSION', cells: [80, 81, 82, 83, 84, 85, 86], clue: 'Ámbito de persistencia temporal (PGA) de las variables del paquete' }
        ],
        grid: [
            {letter:'P'},{letter:'A'},{letter:'C'},{letter:'K'},{letter:'A'},{letter:'G'},{letter:'E'},{letter:'B'},{letter:'C'},{letter:'D'},
            {letter:'E'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},{letter:'L'},{letter:'M'},{letter:'N'},
            {letter:'B'},{letter:'O'},{letter:'D'},{letter:'Y'},{letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},
            {letter:'V'},{letter:'W'},{letter:'X'},{letter:'Y'},{letter:'Z'},{letter:'A'},{letter:'B'},{letter:'C'},{letter:'D'},{letter:'E'},
            {letter:'S'},{letter:'P'},{letter:'E'},{letter:'C'},{letter:'F'},{letter:'G'},{letter:'H'},{letter:'I'},{letter:'J'},{letter:'K'},
            {letter:'L'},{letter:'M'},{letter:'N'},{letter:'O'},{letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'},{letter:'U'},
            {letter:'O'},{letter:'V'},{letter:'E'},{letter:'R'},{letter:'L'},{letter:'O'},{letter:'A'},{letter:'D'},{letter:'V'},{letter:'W'},
            {letter:'X'},{letter:'Y'},{letter:'Z'},{letter:'A'},{letter:'B'},{letter:'C'},{letter:'D'},{letter:'E'},{letter:'F'},{letter:'G'},
            {letter:'S'},{letter:'E'},{letter:'S'},{letter:'S'},{letter:'I'},{letter:'O'},{letter:'N'},{letter:'H'},{letter:'I'},{letter:'J'},
            {letter:'K'},{letter:'L'},{letter:'M'},{letter:'N'},{letter:'O'},{letter:'P'},{letter:'Q'},{letter:'R'},{letter:'S'},{letter:'T'}
        ]
    },
    {
        id: 'e232-prop1',
        type: 'proposed',
        question: '<strong>Problemática Práctica 1 — Paquete: pkg_gestion_eventos (Punto Ticket)</strong>',
        content: `<p>El equipo de operaciones de Punto Ticket necesita centralizar la administración de precios y auditorías en un único paquete modular llamado <code>pkg_gestion_eventos</code>.</p>
        <p><strong>Requisitos de la Especificación:</strong></p>
        <ul>
            <li>Constante pública: <code>c_comision_servicio CONSTANT NUMBER := 0.12;</code> (12% de recargo por servicio).</li>
            <li>Función pública: <code>obtener_recaudacion(p_evento_id NUMBER) RETURN NUMBER;</code> que calcule el monto total recaudado sumando el <code>precio_pagado</code> de todos los tickets emitidos para ese evento. Si no hay tickets, debe retornar <code>0</code>.</li>
            <li>Procedimiento público: <code>actualizar_precio_localidad(p_localidad_id NUMBER, p_nuevo_precio NUMBER, p_admin_id NUMBER);</code></li>
        </ul>
        <p><strong>Requisitos del Cuerpo (Body):</strong></p>
        <ol>
            <li>Implementar un <strong>subprograma privado</strong> llamado <code>validar_evento_activo(p_evento_id NUMBER)</code> que verifique si el evento está en estado <code>'VENTA'</code> o <code>'PROGRAMADO'</code>. Si está <code>'CANCELADO'</code> o <code>'REALIZADO'</code>, debe lanzar <code>RAISE_APPLICATION_ERROR(-20040, 'El evento no admite cambios de precio.');</code></li>
            <li>En <code>actualizar_precio_localidad</code>:
                <ul>
                    <li>Invocar el procedimiento privado de validación.</li>
                    <li>Verificar que <code>p_nuevo_precio &gt; 0</code>.</li>
                    <li>Obtener el precio actual de la localidad en <code>LOCALIDAD_EVENTO</code>.</li>
                    <li>Actualizar el precio en <code>LOCALIDAD_EVENTO</code>.</li>
                    <li>Insertar un registro de auditoría en la tabla <code>LOG_CAMBIO_PRECIO</code> (con localidad_evento_id, precio_anterior, precio_nuevo, fecha_cambio y administrador_id).</li>
                </ul>
            </li>
            <li>Escribir un bloque anónimo de prueba que modifique un precio, consulte la recaudación y finalmente ejecute <code>ROLLBACK</code> para dejar intacta la base de datos.</li>
        </ol>`
    },
    {
        id: 'e232-prop2',
        type: 'proposed',
        question: '<strong>Problemática Práctica 2 — Paquete con Estado de Sesión: pkg_postventa_ticket (Punto Ticket)</strong>',
        content: `<p>El departamento de Servicio al Cliente necesita un paquete para gestionar devoluciones y anulaciones de entradas, llevando la cuenta del dinero devuelto por cada operador durante su turno de trabajo.</p>
        <p><strong>Requisitos de la Especificación:</strong></p>
        <ul>
            <li>Variable pública de sesión: <code>g_monto_anulado_sesion NUMBER := 0;</code> para acumular los montos devueltos en la conexión actual.</li>
            <li>Excepción pública: <code>e_ticket_no_anulable EXCEPTION;</code></li>
            <li>Procedimiento público: <code>anular_ticket(p_ticket_id NUMBER, p_motivo VARCHAR2, p_admin_id NUMBER);</code></li>
            <li>Función pública: <code>obtener_total_anulado_sesion RETURN NUMBER;</code> que retorne el valor acumulado en <code>g_monto_anulado_sesion</code>.</li>
        </ul>
        <p><strong>Requisitos del Cuerpo (Body):</strong></p>
        <ol>
            <li>En <code>anular_ticket</code>:
                <ul>
                    <li>Consultar el estado del ticket y su <code>precio_pagado</code>. Si el estado no es <code>'EMITIDO'</code>, disparar la excepción <code>e_ticket_no_anulable</code> con mensaje claro.</li>
                    <li>Cambiar el estado del ticket a <code>'ANULADO'</code>.</li>
                    <li>Sumar el <code>precio_pagado</code> a la variable global de sesión <code>g_monto_anulado_sesion</code>.</li>
                    <li>Insertar el registro en <code>LOG_ANULACIONES</code>.</li>
                    <li>Recuperar el stock sumando <code>+1</code> al <code>stock_disponible</code> de la localidad asociada en <code>LOCALIDAD_EVENTO</code> (haciendo JOIN a través de <code>RESERVA_TEMPORAL</code>).</li>
                </ul>
            </li>
            <li>Incluir un <strong>bloque de inicialización</strong> al final del body que imprima con <code>DBMS_OUTPUT</code>: <em>"[SESIÓN] Turno de postventa iniciado con $0 anulados."</em></li>
            <li>Escribir un bloque anónimo que anule 2 tickets de prueba, verifique que <code>obtener_total_anulado_sesion</code> refleje la suma de ambos reembolsos, y aplique <code>ROLLBACK</code>.</li>
        </ol>`
    }
];
