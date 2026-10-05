// s2_3_1_solutions.js — Solucionario: Paquetes PL/SQL (Packages) — Nivel Introductorio
// Explicaciones directas y soluciones ejecutables para Punto Ticket

const s2_3_1_solutions = [
    {
        id: 'e231-mc1',
        answer: 0,
        explanation: '<strong>Correcto.</strong> En Oracle es obligatorio compilar primero la <strong>Especificación</strong> (<code>PACKAGE</code>), ya que define la interfaz pública. El <strong>Cuerpo</strong> (<code>PACKAGE BODY</code>) depende de la especificación para poder compilarse.',
        fullSolution: 'Si intentas compilar el cuerpo antes de que exista la especificación, Oracle arrojará el error <code>PLS-00304: cannot compile body without its specification</code>.'
    },
    {
        id: 'e231-mc2',
        answer: 0,
        explanation: '<strong>Correcto.</strong> Para invocar cualquier objeto público de un paquete se utiliza la <strong>notación de punto</strong>: <code>nombre_paquete.objeto</code> (por ejemplo: <code>pkg_boleteria.consultar_stock(1)</code>).',
        fullSolution: 'Esto permite que puedan existir funciones con el mismo nombre en paquetes diferentes sin que se produzca una colisión de nombres.'
    },
    {
        id: 'e231-mc3',
        answer: 0,
        explanation: '<strong>Correcto.</strong> Las variables de paquete residen en la memoria PGA de la conexión. Conservan su valor durante toda la sesión del usuario hasta que este cierre su conexión.',
        fullSolution: 'Esta persistencia permite usar variables de paquete para llevar contadores de turno, almacenar identificadores de usuario o parámetros de configuración.'
    },
    {
        id: 'e231-tf1',
        answer: false,
        explanation: '<strong>Falso.</strong> La especificación de un paquete <strong>solo declara cabeceras y firmas</strong> terminadas en punto y coma. No lleva bloques <code>BEGIN ... END</code> ni sentencias DML. El código ejecutable pertenece exclusivamente al <code>PACKAGE BODY</code>.'
    },
    {
        id: 'e231-tf2',
        answer: true,
        explanation: '<strong>Verdadero.</strong> Los subprogramas dentro del mismo paquete pueden llamarse entre sí directamente por su nombre, sin necesidad de anteponer el nombre del paquete, facilitando la reutilización interna.'
    },
    {
        id: 'e231-fill1',
        answers: [
            ['PACKAGE', 'PACKAGE AS'],
            ['NUMBER', 'NUMBER := 0', 'NUMBER :='],
            ['RETURN NUMBER', 'RETURN NUMBER;']
        ],
        explanation: 'La especificación se inicia con <code>PACKAGE</code>, la variable se define como tipo <code>NUMBER</code> y la función declara su retorno con <code>RETURN NUMBER</code>.',
        fullSolution: '<pre>CREATE OR REPLACE PACKAGE pkg_localidades AS\n    g_consultas NUMBER := 0;\n    FUNCTION obtener_precio(p_localidad_id IN NUMBER) RETURN NUMBER;\nEND pkg_localidades;\n/</pre>'
    },
    {
        id: 'e231-fill2',
        answers: [
            ['PACKAGE BODY', 'BODY'],
            ['END pkg_localidades', 'END', 'END;']
        ],
        explanation: 'El cuerpo se crea con <code>PACKAGE BODY</code> y finaliza cerrando con <code>END pkg_localidades;</code>.',
        fullSolution: '<pre>CREATE OR REPLACE PACKAGE BODY pkg_localidades AS\n    FUNCTION obtener_precio(p_localidad_id IN NUMBER) RETURN NUMBER IS\n        v_precio NUMBER;\n    BEGIN\n        SELECT precio INTO v_precio\n        FROM LOCALIDAD_EVENTO\n        WHERE localidad_evento_id = p_localidad_id;\n        RETURN v_precio;\n    END obtener_precio;\nEND pkg_localidades;\n/</pre>'
    },
    {
        id: 'e231-err1',
        answer: 2, // Línea 3 (índice 2): falta ';' al final de RETURN NUMBER
        explanation: '<strong>Error en la línea 3 (índice 2):</strong> Toda firma de función o procedimiento en la especificación debe finalizar obligatoriamente con punto y coma (<code>RETURN NUMBER;</code>).',
        fullSolution: 'La firma correcta en la especificación debe incluir el punto y coma:<pre>FUNCTION obtener_stock(p_id NUMBER) RETURN NUMBER;</pre>'
    },
    {
        id: 'e231-err2',
        answer: 7, // Línea 8 (índice 7): PROCEDURE AS actualizar_stock
        explanation: '<strong>Error en la línea 8 (índice 7):</strong> La palabra reservada <code>AS</code> o <code>IS</code> se coloca <strong>después</strong> de la lista de parámetros, nunca antes del nombre del procedimiento.',
        fullSolution: 'La cabecera correcta es:<pre>PROCEDURE actualizar_stock(p_id NUMBER, p_cant NUMBER) IS\nBEGIN\n    DBMS_OUTPUT.PUT_LINE(\'Stock actualizado\');\nEND actualizar_stock;</pre>'
    },
    {
        id: 'e231-ws1',
        explanation: '<strong>¡Sopa de letras completada!</strong> Has reforzado los conceptos clave de la sesión.',
        fullSolution: `
            <h4>Términos de la Sopa de Letras:</h4>
            <table>
                <tr><th>Término</th><th>Orientación</th><th>Significado</th></tr>
                <tr><td><strong>PACKAGE</strong></td><td>Fila 1</td><td>Objeto contenedor de subprogramas en Oracle.</td></tr>
                <tr><td><strong>BODY</strong></td><td>Fila 3</td><td>Cuerpo que contiene el código ejecutable.</td></tr>
                <tr><td><strong>SPEC</strong></td><td>Fila 5</td><td>Especificación o interfaz pública del paquete.</td></tr>
                <tr><td><strong>STOCK</strong></td><td>Fila 7</td><td>Cantidad de entradas disponibles en LOCALIDAD_EVENTO.</td></tr>
                <tr><td><strong>TURNO</strong></td><td>Fila 9</td><td>Período de conexión del operador donde persisten las variables.</td></tr>
            </table>
        `
    },
    {
        id: 'e231-prop1',
        explanation: 'Paquete elemental que encapsula una consulta de texto y una actualización simple sobre la tabla CLIENTE.',
        fullSolution: `<pre>-- 1. ESPECIFICACIÓN
CREATE OR REPLACE PACKAGE pkg_cliente_simple AS
    FUNCTION obtener_nombre_completo(p_cliente_id IN NUMBER) RETURN VARCHAR2;
    PROCEDURE actualizar_telefono(p_cliente_id IN NUMBER, p_nuevo_telefono IN VARCHAR2);
END pkg_cliente_simple;
/

-- 2. CUERPO
CREATE OR REPLACE PACKAGE BODY pkg_cliente_simple AS

    FUNCTION obtener_nombre_completo(p_cliente_id IN NUMBER) RETURN VARCHAR2 IS
        v_nombre VARCHAR2(160);
    BEGIN
        SELECT nombre || ' ' || apellido INTO v_nombre
        FROM CLIENTE
        WHERE cliente_id = p_cliente_id;

        RETURN v_nombre;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'Cliente no encontrado';
    END obtener_nombre_completo;

    PROCEDURE actualizar_telefono(p_cliente_id IN NUMBER, p_nuevo_telefono IN VARCHAR2) IS
    BEGIN
        UPDATE CLIENTE
        SET telefono = p_nuevo_telefono
        WHERE cliente_id = p_cliente_id;

        DBMS_OUTPUT.PUT_LINE('Teléfono actualizado para cliente #' || p_cliente_id);
    END actualizar_telefono;

END pkg_cliente_simple;
/

-- 3. BLOQUE DE PRUEBA
DECLARE
    v_cliente VARCHAR2(160);
BEGIN
    v_cliente := pkg_cliente_simple.obtener_nombre_completo(1);
    DBMS_OUTPUT.PUT_LINE('Cliente 1: ' || v_cliente);

    pkg_cliente_simple.actualizar_telefono(1, '+56911223344');

    ROLLBACK; -- Mantiene la base de datos limpia
END;
/</pre>`
    },
    {
        id: 'e231-prop2',
        explanation: 'Paquete que utiliza una constante pública y una variable de sesión para calcular recargos de boletería.',
        fullSolution: `<pre>-- 1. ESPECIFICACIÓN
CREATE OR REPLACE PACKAGE pkg_precios_simple AS
    c_recargo_servicio CONSTANT NUMBER := 0.10;
    g_cotizaciones     NUMBER := 0;

    FUNCTION precio_con_recargo(p_localidad_id IN NUMBER) RETURN NUMBER;
    PROCEDURE ajustar_precio_base(p_localidad_id IN NUMBER, p_nuevo_precio IN NUMBER);
END pkg_precios_simple;
/

-- 2. CUERPO
CREATE OR REPLACE PACKAGE BODY pkg_precios_simple AS

    FUNCTION precio_con_recargo(p_localidad_id IN NUMBER) RETURN NUMBER IS
        v_precio NUMBER;
    BEGIN
        SELECT precio INTO v_precio
        FROM LOCALIDAD_EVENTO
        WHERE localidad_evento_id = p_localidad_id;

        -- Incrementa el contador de la sesión
        g_cotizaciones := g_cotizaciones + 1;

        RETURN ROUND(v_precio * (1 + c_recargo_servicio), 0);
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 0;
    END precio_con_recargo;

    PROCEDURE ajustar_precio_base(p_localidad_id IN NUMBER, p_nuevo_precio IN NUMBER) IS
    BEGIN
        UPDATE LOCALIDAD_EVENTO
        SET precio = p_nuevo_precio
        WHERE localidad_evento_id = p_localidad_id;

        DBMS_OUTPUT.PUT_LINE('Precio base actualizado a $' || p_nuevo_precio);
    END ajustar_precio_base;

END pkg_precios_simple;
/

-- 3. BLOQUE DE PRUEBA
DECLARE
    v_precio_final NUMBER;
BEGIN
    v_precio_final := pkg_precios_simple.precio_con_recargo(1);
    DBMS_OUTPUT.PUT_LINE('Precio con 10% recargo: $' || v_precio_final);
    DBMS_OUTPUT.PUT_LINE('Cotizaciones en esta sesión: ' || pkg_precios_simple.g_cotizaciones);

    ROLLBACK; -- Mantiene la base de datos limpia
END;
/</pre>`
    }
];
