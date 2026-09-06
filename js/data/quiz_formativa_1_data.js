// quiz_formativa_1_data.js — Datos de la Evaluación Formativa N° 1
// BDY1103 Taller de Base de datos

const quiz_formativa_1_data = {
    id: 'quiz-formativa-1',
    title: 'Evaluación Formativa N° 1: Bloques PL/SQL',
    sigla: 'BDY1103',
    courseName: 'Taller de Base de datos',
    badge: 'Formativa 1',
    timeNote: 'Sin límite de tiempo',
    // Hash SHA-256 de la clave de acceso de los alumnos: "Carlos94"
    accessHash: 'b216c97b80ae7c66cdfbc66e7eaf1ecaa773ec1043e6760607d095e26d4810db',
    // Hash SHA-256 de la clave de desbloqueo docente: "docente2026"
    unlockHash: '849018898d5676cde9c6723b4604bd196d65e33c25304ec6e71fd7cc56af9a98',

    instructions: [
        'La evaluación consta de 2 partes: 12 preguntas teóricas de selección múltiple y 4 ejercicios prácticos de desarrollo PL/SQL.',
        'Los bloques anónimos deben ser desarrollados y probados en su entorno de trabajo (VS Code con extensión Oracle SQL Developer o SQL Developer instalado en las máquinas de laboratorio).',
        'Una vez probado su código, pegue cada bloque PL/SQL en la casilla correspondiente en esta plataforma.',
        'La plataforma cuenta con mecanismos de integridad y auditoría: evite salir de la pestaña o minimizar el navegador mientras responde.',
        'Al finalizar, se generará y descargará un archivo Markdown (.md) con todas sus respuestas, el cual deberá enviar al docente para su revisión y calificación.'
    ],

    // Parte 1: 12 Preguntas de Selección Múltiple (del documento original)
    multipleChoiceQuestions: [
        {
            id: 'q1',
            number: 1,
            question: '¿Cuál de las siguientes afirmaciones es correcta sobre un RECORD en PL/SQL?',
            options: [
                'a) Un RECORD puede contener solo tipos de datos numéricos.',
                'b) Un RECORD es una colección de valores escalables.',
                'c) Un RECORD puede contener múltiples tipos de datos.',
                'd) Un RECORD es un tipo de cursor en PL/SQL.'
            ],
            correctAnswer: 2 // c
        },
        {
            id: 'q2',
            number: 2,
            question: '¿Cuál de las siguientes afirmaciones es verdadera sobre un VARRAY en PL/SQL?',
            options: [
                'a) Un VARRAY puede contener tipos de datos heterogéneos.',
                'b) Un VARRAY tiene un tamaño máximo que se define al momento de su declaración.',
                'c) Un VARRAY no permite acceso a sus elementos mediante índices.',
                'd) Un VARRAY puede contener registros de múltiples tablas.'
            ],
            correctAnswer: 1 // b
        },
        {
            id: 'q3',
            number: 3,
            question: '¿Cuál es el orden correcto de las secciones en un bloque PL/SQL?',
            options: [
                'a) BEGIN, DECLARE, EXCEPTION, END',
                'b) DECLARE, EXCEPTION, BEGIN, END',
                'c) DECLARE, BEGIN, EXCEPTION, END',
                'd) BEGIN, DECLARE, END, EXCEPTION'
            ],
            correctAnswer: 2 // c
        },
        {
            id: 'q4',
            number: 4,
            question: '¿Cuál de las siguientes es una forma válida de construir un loop en PL/SQL?',
            options: [
                'a) WHILE-END LOOP',
                'b) REPEAT-UNTIL',
                'c) FOR-LOOP',
                'd) SWITCH-END SWITCH'
            ],
            correctAnswer: 2 // c
        },
        {
            id: 'q5',
            number: 5,
            question: '¿Cuál de las siguientes es una excepción predefinida en Oracle PL/SQL?',
            options: [
                'a) VALUE_TOO_LARGE',
                'b) DUP_VAL_ON_INDEX',
                'c) INVALID_NUMBER',
                'd) TODAS LAS ANTERIORES'
            ],
            correctAnswer: 3 // d
        },
        {
            id: 'q6',
            number: 6,
            question: '¿Cuál de las siguientes afirmaciones es verdadera sobre las excepciones definidas por el usuario?',
            options: [
                'a) Las excepciones definidas por el usuario no pueden ser declaradas dentro de un bloque PL/SQL.',
                'b) Las excepciones definidas por el usuario no necesitan ser manejadas explícitamente.',
                'c) Las excepciones definidas por el usuario deben ser declaradas y lanzadas explícitamente.',
                'd) Las excepciones definidas por el usuario son manejadas automáticamente por Oracle.'
            ],
            correctAnswer: 2 // c
        },
        {
            id: 'q7',
            number: 7,
            question: '¿Cuál es la principal diferencia entre un procedimiento y una función almacenada en PL/SQL?',
            options: [
                'a) Un procedimiento puede ser llamado desde una sentencia SQL.',
                'b) Una función siempre retorna un valor, mientras que un procedimiento no necesariamente.',
                'c) Un procedimiento debe ser compilado, mientras que una función no.',
                'd) Un procedimiento puede contener transacciones, mientras que una función no.'
            ],
            correctAnswer: 1 // b
        },
        {
            id: 'q8',
            number: 8,
            question: '¿Cuál de las siguientes afirmaciones es verdadera sobre los packages en PL/SQL?',
            options: [
                'a) Un package no puede contener funciones.',
                'b) Un package puede agrupar procedimientos, funciones y otros elementos relacionados.',
                'c) Un package se compila cada vez que se ejecuta.',
                'd) Un package no puede tener variables globales.'
            ],
            correctAnswer: 1 // b
        },
        {
            id: 'q9',
            number: 9,
            question: '¿Qué es un trigger en PL/SQL?',
            options: [
                'a) Un bloque de código que se ejecuta en un momento específico en respuesta a un evento de base de datos.',
                'b) Un procedimiento almacenado que se ejecuta manualmente.',
                'c) Una función que se llama dentro de una sentencia SQL.',
                'd) Un paquete que agrupa varias funciones y procedimientos.'
            ],
            correctAnswer: 0 // a
        },
        {
            id: 'q10',
            number: 10,
            question: '¿En cuál de los siguientes casos sería más adecuado usar un procedimiento almacenado?',
            options: [
                'a) Para calcular el total de una factura en una sentencia SQL.',
                'b) Para realizar una serie de operaciones de inserción y actualización en múltiples tablas.',
                'c) Para obtener el nombre completo de un cliente basado en su ID.',
                'd) Para validar el formato de una dirección de correo electrónico.'
            ],
            correctAnswer: 1 // b
        },
        {
            id: 'q11',
            number: 11,
            question: '¿En cuál de los siguientes casos sería más adecuado usar una función almacenada?',
            options: [
                'a) Para actualizar el salario de todos los empleados en un departamento.',
                'b) Para obtener el precio con descuento de un producto en una sentencia SELECT.',
                'c) Para realizar una auditoría de todas las operaciones DML en una tabla.',
                'd) Para enviar una notificación por correo electrónico al completar una transacción.'
            ],
            correctAnswer: 1 // b
        },
        {
            id: 'q12',
            number: 12,
            question: '¿En cuál de los siguientes casos sería más adecuado usar un trigger?',
            options: [
                'a) Para enviar un correo electrónico cuando se inserta un nuevo registro en la tabla de clientes.',
                'b) Para calcular el precio total de un pedido.',
                'c) Para crear una vista que combine datos de varias tablas.',
                'd) Para listar todos los empleados de un departamento específico.'
            ],
            correctAnswer: 0 // a
        }
    ],

    // Parte 2: 4 Ejercicios Prácticos Inéditos sobre clon_punto_ticket.sql
    practicalExercises: [
        {
            id: 'p1',
            number: 1,
            title: 'Ejercicio 1: Bloque con RECORD y Manejo de Excepciones',
            concept: 'RECORD + EXCEPTION',
            targetTable: 'RECINTO',
            description: `Construya un bloque PL/SQL anónimo que declare un tipo <code>RECORD</code> personalizado (por ejemplo, <code>r_recinto_info</code>) para almacenar los datos descriptivos de un recinto: <strong>nombre</strong>, <strong>dirección</strong>, <strong>ciudad</strong> y <strong>capacidad total</strong>.<br><br>
El bloque debe recibir o definir una variable con el identificador del recinto (<code>p_recinto_id</code>, por ejemplo valor <code>1</code> para probar éxito y valor <code>999</code> para probar error), consultar la información mediante <code>SELECT INTO</code> almacenándola directamente en el registro, e imprimir cada campo con <code>DBMS_OUTPUT.PUT_LINE</code>.`,
            requirements: [
                'Declarar un TYPE ... IS RECORD con los tipos de datos anclados (%TYPE) a las columnas de la tabla RECINTO.',
                'Realizar el SELECT INTO cargando los valores en la variable de tipo RECORD.',
                'Mostrar los datos en consola de forma clara.',
                '<strong>Control de Excepciones:</strong> Manejar obligatoriamente <code>NO_DATA_FOUND</code> (mostrar mensaje si el recinto no existe), <code>TOO_MANY_ROWS</code> y <code>WHEN OTHERS</code> con <code>SQLCODE</code> y <code>SQLERRM</code>.'
            ],
            starterPlaceholder: `-- Desarrolle en VS Code / SQL Developer y pegue su bloque completo aquí
DECLARE
    -- 1. Declarar tipo RECORD y variable

    -- 2. Variables de entrada
BEGIN
    -- 3. SELECT INTO hacia el RECORD

    -- 4. DBMS_OUTPUT.PUT_LINE

EXCEPTION
    -- 5. Manejo de excepciones (NO_DATA_FOUND, TOO_MANY_ROWS, WHEN OTHERS)

END;
/`
        },
        {
            id: 'p2',
            number: 2,
            title: 'Ejercicio 2: Bloque con VARRAY y Manejo de Excepciones',
            concept: 'VARRAY + EXCEPTION',
            targetTable: 'CONVENIO_BANCO',
            description: `Construya un bloque PL/SQL anónimo que declare un tipo <code>VARRAY(4)</code> de cadenas (<code>VARCHAR2(100)</code> o anclado a <code>CONVENIO_BANCO.banco%TYPE</code>) para almacenar los nombres de los bancos asociados a convenios comerciales activos (<code>WHERE activo = 'S'</code>).<br><br>
El bloque debe inicializar la colección, cargar hasta 4 nombres de bancos desde la tabla <code>CONVENIO_BANCO</code> (usando <code>BULK COLLECT INTO</code> con <code>WHERE ROWNUM <= 4</code> o asignación iterativa con <code>.EXTEND</code>), y finalmente recorrer el VARRAY mediante un ciclo <code>FOR</code> imprimiendo cada banco: <code>Convenio Banco #[i]: [nombre_banco]</code>.`,
            requirements: [
                'Declarar el TYPE ... IS VARRAY(4) OF ... y la variable correspondiente.',
                'Cargar los bancos con convenio activo en el VARRAY.',
                'Recorrer el VARRAY usando un bucle FOR con <code>1..variable.COUNT</code> e imprimir cada elemento.',
                '<strong>Control de Excepciones:</strong> Manejar <code>SUBSCRIPT_BEYOND_COUNT</code> o <code>NO_DATA_FOUND</code> en caso de error de acceso/datos, y la cláusula <code>WHEN OTHERS</code> con código y mensaje de error.'
            ],
            starterPlaceholder: `-- Desarrolle en VS Code / SQL Developer y pegue su bloque completo aquí
DECLARE
    -- 1. Declaración de tipo VARRAY(4) y variable

BEGIN
    -- 2. Poblar el VARRAY con convenios activos

    -- 3. Bucle FOR para recorrer y mostrar

EXCEPTION
    -- 4. Manejo de excepciones

END;
/`
        },
        {
            id: 'p3',
            number: 3,
            title: 'Ejercicio 3: Bloque con CURSOR Explícito y Cierre Seguro en Excepciones',
            concept: 'CURSOR EXPLÍCITO + EXCEPTION',
            targetTable: 'TICKET, TRANSACCION_PAGO, CLIENTE',
            description: `Construya un bloque PL/SQL anónimo que declare un cursor explícito denominado <code>c_tickets_emitidos</code> para consultar los tickets registrados en estado <code>'EMITIDO'</code>.<br><br>
La consulta del cursor debe relacionar las tablas <code>TICKET t</code>, <code>TRANSACCION_PAGO tp</code> y <code>CLIENTE c</code> (mediante <code>RESERVA_TEMPORAL rt</code> o la relación directa correspondiente), recuperando: <strong>código del ticket</strong>, <strong>nombre completo del cliente</strong> (<code>c.nombre || ' ' || c.apellido</code>), <strong>precio pagado</strong> y <strong>método de pago</strong>.<br><br>
El bloque debe recorrer el cursor mostrando los datos formateados de cada ticket.`,
            requirements: [
                'Declarar explícitamente el cursor en la sección DECLARE con su JOIN correspondiente.',
                'Recorrer el cursor utilizando bucle (ya sea OPEN/FETCH/CLOSE o FOR ... IN c_tickets_emitidos LOOP).',
                'Mostrar los datos en consola con DBMS_OUTPUT.PUT_LINE.',
                '<strong>Control de Excepciones y Cierre Seguro:</strong> Manejar <code>CURSOR_ALREADY_OPEN</code>, <code>INVALID_CURSOR</code> y <code>WHEN OTHERS</code>. En la sección de excepciones, debe verificar si el cursor quedó abierto (<code>IF c_tickets_emitidos%ISOPEN THEN CLOSE c_tickets_emitidos; END IF;</code>) para garantizar la liberación de memoria.'
            ],
            starterPlaceholder: `-- Desarrolle en VS Code / SQL Developer y pegue su bloque completo aquí
DECLARE
    -- 1. Declaración del cursor explícito c_tickets_emitidos

BEGIN
    -- 2. Apertura y recorrido del cursor

EXCEPTION
    -- 3. Manejo de excepciones y cierre seguro del cursor
    WHEN OTHERS THEN
        IF c_tickets_emitidos%ISOPEN THEN
            CLOSE c_tickets_emitidos;
        END IF;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLCODE || ' - ' || SQLERRM);
END;
/`
        },
        {
            id: 'p4',
            number: 4,
            title: 'Ejercicio 4: Bloque con CURSOR con Parámetro y Excepción Definida por el Usuario',
            concept: 'CURSOR CON PARÁMETRO + EXCEPCIÓN PERSONALIZADA (USER-DEFINED)',
            targetTable: 'EVENTO, PRODUCTORA',
            description: `Construya un bloque PL/SQL anónimo que declare un cursor explícito con parámetro denominado <code>c_eventos_productora(p_productora_id NUMBER)</code> para consultar la cartelera de eventos organizados por una productora específica. El cursor debe recuperar: <strong>nombre del evento</strong>, <strong>fecha_evento</strong> y <strong>estado</strong>.<br><br>
El bloque debe declarar una <strong>excepción definida por el usuario</strong> (por ejemplo: <code>e_sin_eventos_vigentes EXCEPTION;</code>). Al ejecutar el bloque para una productora dada (probar con una productora sin eventos o con ID inexistente):<br>
- Si la productora no registra eventos en la base de datos (contador de eventos = 0 o cursor no recupera filas), el bloque debe lanzar explícitamente la excepción personalizada mediante <code>RAISE e_sin_eventos_vigentes;</code><br>
- En caso de existir eventos, debe recorrer el cursor e imprimir el resumen de la cartelera.`,
            requirements: [
                'Declarar el cursor explícito con parámetro p_productora_id en la sección DECLARE.',
                'Declarar una excepción propia del usuario en DECLARE (ej. e_sin_eventos_vigentes EXCEPTION).',
                'Evaluar la condición de negocio y disparar la excepción con RAISE.',
                '<strong>Control de Excepciones:</strong> Capturar en la sección EXCEPTION el manejador <code>WHEN e_sin_eventos_vigentes THEN</code> mostrando el mensaje de alerta de negocio: <code>ALERTA: La productora no registra eventos vigentes en cartelera.</code>',
                'Incluir el manejador <code>WHEN OTHERS</code> con código y mensaje de error del sistema.'
            ],
            starterPlaceholder: `-- Desarrolle en VS Code / SQL Developer y pegue su bloque completo aquí
DECLARE
    -- 1. Excepción definida por el usuario
    e_sin_eventos_vigentes EXCEPTION;

    -- 2. Cursor con parámetro

    -- 3. Variables auxiliares (contador, etc.)
BEGIN
    -- 4. Abrir cursor con parámetro y verificar si existen filas

    -- 5. Disparar RAISE si no hay eventos

    -- 6. Recorrer e imprimir si existen

EXCEPTION
    WHEN e_sin_eventos_vigentes THEN
        DBMS_OUTPUT.PUT_LINE('ALERTA: La productora no registra eventos vigentes en cartelera.');

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLCODE || ' - ' || SQLERRM);
END;
/`
        }
    ]
};
