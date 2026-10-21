// quiz_formativa_2_data.js — Datos de la Evaluación Formativa N° 2
// Unidad 2: Fundamentos de Procedimientos, Funciones, Triggers y Paquetes en Oracle PL/SQL
// Taller de Bases de Datos — Punto Ticket

const quiz_formativa_2_data = {
    id: 'quiz-formativa-2',
    title: 'Evaluación Formativa N° 2: Fundamentos de Arquitectura PL/SQL',
    sigla: 'BDY1103',
    courseName: 'Taller de Bases de Datos',
    badge: 'Formativa 2',
    timeNote: 'Sin límite de tiempo — Evaluación sin retroalimentación inmediata',
    simpleAuth: true, // No requiere contraseña de acceso
    disableIntegrityTracking: true, // Modo enfocado en el desarrollo

    instructions: [
        'Esta evaluación formativa mide tu comprensión profunda de los <strong>fundamentos de la Unidad 2</strong>: Procedimientos Almacenados, Funciones, Triggers y Paquetes (Packages).',
        'La evaluación consta de 5 secciones: Alternativas, Selección Múltiple, Términos Pareados, Verdadero/Falso con Justificación Obligatoria, 6 Ejercicios de Completar Código con pool de opciones, y un Caso Práctico de Arquitectura al final.',
        '<strong>Política de Calificación:</strong> La plataforma <strong>no mostrará puntajes ni corrección en pantalla</strong> durante ni al finalizar el test.',
        'Al concluir, se descargará un archivo Markdown (<code>.md</code>) con todas tus respuestas y justificaciones para ser evaluado posteriormente por el docente y un agente de Inteligencia Artificial con rúbrica estricta.'
    ],

    // =========================================================================
    // PARTE 1: ALTERNATIVAS (SELECCIÓN SIMPLE - 1 RESPUESTA CORRECTA)
    // =========================================================================
    multipleChoiceQuestions: [
        {
            id: 'mc1',
            number: 1,
            topic: 'Procedimientos vs Funciones',
            question: '¿Cuál es la diferencia fundamental en la invocación de una FUNCTION frente a un PROCEDURE en Oracle PL/SQL?',
            options: [
                'a) Un PROCEDURE siempre retorna exactamente un valor escalar, mientras que una FUNCTION retorna un conjunto de registros.',
                'b) Una FUNCTION siempre retorna exactamente un valor con RETURN y puede usarse directamente dentro de una sentencia SELECT (si no realiza DML), mientras que un PROCEDURE ejecuta acciones y no retorna un valor directamente.',
                'c) Un PROCEDURE se compila en el diccionario de datos cada vez que se ejecuta, mientras que una FUNCTION solo se compila una vez.',
                'd) Una FUNCTION no puede recibir parámetros de tipo IN, a diferencia de los procedimientos que admiten cualquier modo.'
            ],
            correctAnswer: 1, // b
            explanation: 'Una FUNCTION siempre retorna exactamente un valor mediante RETURN y puede integrarse en consultas SQL si no hace DML. Un PROCEDURE ejecuta acciones en la BD y no retorna un valor directamente (slide s2_1_1).'
        },
        {
            id: 'mc2',
            number: 2,
            topic: 'Modos de Parámetros',
            question: 'Si un procedimiento tiene un parámetro definido como OUT, ¿qué ocurre con el valor de esa variable al ingresar al cuerpo del procedimiento?',
            options: [
                'a) Conserva el valor que tenía en el bloque que lo invocó.',
                'b) Produce un error de compilación si el invocante no le asignó un valor inicial.',
                'c) Comienza siempre en NULL dentro del procedimiento, ignorando cualquier valor previo del invocante.',
                'd) Se convierte automáticamente en una constante de solo lectura.'
            ],
            correctAnswer: 2, // c
            explanation: 'Dentro del procedimiento, un parámetro OUT comienza siempre en NULL, sin heredar ningún valor previo del invocante (slide s2_1_1).'
        },
        {
            id: 'mc3',
            number: 3,
            topic: 'Modos de Parámetros',
            question: '¿Qué error de compilación ocurre si intentas ejecutar la asignación `p_id := 10;` dentro de un procedimiento donde `p_id` fue declarado como `p_id IN NUMBER`?',
            options: [
                'a) ORA-01403: No data found.',
                'b) PLS-00363: expression cannot be used as an assignment target, porque los parámetros IN actúan como constantes de solo lectura.',
                'c) ORA-06503: Function returned without value.',
                'd) Ninguno, en Oracle 21c los parámetros IN pueden reasignarse dinámicamente.'
            ],
            correctAnswer: 1, // b
            explanation: 'Los parámetros IN son de solo lectura y funcionan como constantes. Modificarlos genera PLS-00363 (slide s2_1_1).'
        },
        {
            id: 'mc4',
            number: 4,
            topic: 'Triggers: Timings',
            question: 'En la arquitectura de Triggers de Oracle, ¿en qué caso es estrictamente OBLIGATORIO utilizar el timing BEFORE en lugar de AFTER?',
            options: [
                'a) Cuando se necesita insertar una fila de auditoría en una tabla secundaria como LOG_CAMBIO_PRECIO.',
                'b) Cuando se requiere modificar o limpiar los valores del pseudo-registro :NEW antes de que la fila se escriba definitivamente en disco.',
                'c) Cuando se requiere que el trigger se ejecute únicamente al finalizar la transacción completa con COMMIT.',
                'd) Cuando se desea evitar el error ORA-04091 de tablas mutantes en sentencias DELETE.'
            ],
            correctAnswer: 1, // b
            explanation: 'Solo en triggers BEFORE es válido modificar :NEW (ej. :NEW.email := LOWER(:NEW.email)). En AFTER, intentar modificar :NEW produce el error ORA-04084 (slides s2_2_1 y s2_2_2).'
        },
        {
            id: 'mc5',
            number: 5,
            topic: 'Triggers: Pseudo-registros',
            question: 'Durante la ejecución de una sentencia DELETE sobre una tabla con un trigger FOR EACH ROW, ¿cuál es el estado de los pseudo-registros :OLD y :NEW?',
            options: [
                'a) :OLD contiene los datos de la fila que se está eliminando y :NEW es NULL.',
                'b) :OLD es NULL y :NEW contiene los datos que se acaban de borrar.',
                'c) Ambos contienen los datos de la fila eliminada para permitir la recuperación.',
                'd) Ambos son NULL porque la fila ya no existe en el catálogo.'
            ],
            correctAnswer: 0, // a
            explanation: 'En DELETE, :OLD contiene los valores de la fila que se elimina y :NEW es NULL porque no habrá fila resultante (slide s2_2_2).'
        },
        {
            id: 'mc6',
            number: 6,
            topic: 'Triggers: Cláusula WHEN',
            question: '¿Cuál es la sintaxis correcta al hacer referencia a los campos de la fila dentro de la cláusula WHEN de un trigger FOR EACH ROW?',
            options: [
                'a) WHEN (:OLD.precio != :NEW.precio)',
                'b) WHEN (OLD.precio != NEW.precio) — sin dos puntos (:)',
                'c) WHEN {OLD.precio <> NEW.precio}',
                'd) WHEN (NEW.precio IS NOT NULL AND :OLD.precio IS NOT NULL)'
            ],
            correctAnswer: 1, // b
            explanation: 'Dentro de la cláusula WHEN se usan OLD y NEW sin los dos puntos. Poner dos puntos dentro de WHEN produce error de compilación (slide s2_2_2).'
        },
        {
            id: 'mc7',
            number: 7,
            topic: 'Paquetes (Packages): Arquitectura',
            question: '¿Por qué un paquete PL/SQL se compone obligatoriamente de Especificación (Package Specification) y Cuerpo (Package Body), y en qué orden deben compilarse?',
            options: [
                'a) Primero el Cuerpo con toda la lógica y luego la Especificación para verificar los tipos de datos.',
                'b) Se pueden compilar en cualquier orden indistintamente mediante un solo comando.',
                'c) Primero la Especificación (declara la interfaz pública) y luego el Cuerpo (implementa el código); si cambia el cuerpo, no se requiere recompilar los programas clientes.',
                'd) La Especificación solo es obligatoria si el paquete contiene triggers asociados.'
            ],
            correctAnswer: 2, // c
            explanation: 'Primero se compila la Especificación (interfaz pública). Luego el Cuerpo (código PL/SQL ejecutable). Esto permite modificar la implementación interna sin invalidar los objetos clientes (slide s2_3_1).'
        },
        {
            id: 'mc8',
            number: 8,
            topic: 'Paquetes: Variables de Sesión',
            question: '¿Dónde reside y cuánto dura el valor almacenado en una variable pública declarada en la Especificación de un paquete (como `g_total_vendidas NUMBER := 0;`)?',
            options: [
                'a) Se guarda en una tabla del diccionario de datos y persiste permanentemente para todos los usuarios.',
                'b) Se destruye apenas finaliza el procedimiento o bloque que la modificó.',
                'c) Reside en la memoria de la sesión (PGA) del usuario conectado y mantiene su valor durante toda su conexión.',
                'd) Solo existe mientras se ejecute la transacción activa, reseteándose con cada COMMIT o ROLLBACK.'
            ],
            correctAnswer: 2, // c
            explanation: 'Las variables de paquete persisten en la memoria PGA de la sesión del usuario durante toda su conexión, manteniendo su estado entre diferentes llamadas sin usar tablas (slide s2_3_1).'
        }
    ],

    // =========================================================================
    // PARTE 2: SELECCIÓN MÚLTIPLE (CHECKBOXES - VARIAS RESPUESTAS CORRECTAS)
    // =========================================================================
    multiSelectQuestions: [
        {
            id: 'ms1',
            number: 9,
            topic: 'Buenas Prácticas en Funciones PL/SQL',
            question: '¿Cuáles de las siguientes afirmaciones sobre las funciones (FUNCTION) en Oracle PL/SQL son CORRECTAS? (Selecciona todas las que apliquen)',
            options: [
                'a) Si una función incluye sentencias DML (INSERT/UPDATE/DELETE), no podrá ser ejecutada dentro de una consulta SELECT simple (error ORA-14551).',
                'b) Si el flujo de ejecución de una función alcanza el END sin toparse con una sentencia RETURN, Oracle arroja en tiempo de ejecución el error ORA-06503.',
                'c) Aunque Oracle permite compilar funciones con parámetros OUT, se considera una mala práctica porque inhabilita su uso directo en sentencias SELECT.',
                'd) Las funciones almacenadas son idénticas a los triggers ya que ambas se disparan automáticamente ante un cambio en la base de datos.'
            ],
            correctAnswers: [0, 1, 2], // a, b, c
            explanation: 'a, b y c son directas de la diapositiva s2_1_1. La d es falsa porque las funciones requieren invocación explícita.'
        },
        {
            id: 'ms2',
            number: 10,
            topic: 'Limitaciones de Constraints y Procedimientos vs Triggers',
            question: 'En la problemática de Punto Ticket (slide s2_2_1), ¿por qué mecanismos tradicionales como DEFAULT, CHECK CONSTRAINTS o Procedimientos Almacenados NO fueron suficientes por sí solos frente a un Trigger? (Selecciona todas las que apliquen)',
            options: [
                'a) La cláusula DEFAULT solo actúa si la columna viene vacía (NULL); si el usuario envía un texto con mayúsculas y espacios desordenados, DEFAULT no hace nada.',
                'b) Una CHECK CONSTRAINT se limita a rechazar la fila con un mensaje de error y botar la compra, en lugar de corregir o normalizar el dato automáticamente en el aire.',
                'c) Un procedimiento almacenado funciona bien solo si todos lo usan, pero puede ser evadido por completo si un administrador o script batch ejecuta un INSERT directo en la base de datos.',
                'd) Los triggers consumen más memoria RAM que las tablas temporales y por eso Oracle los desactiva automáticamente en horarios punta.'
            ],
            correctAnswers: [0, 1, 2], // a, b, c
            explanation: 'DEFAULT solo actúa en NULL, CHECK solo rechaza pero no limpia, y los procedimientos pueden ser saltados por scripts/DBA directos. Por eso se requiere un Trigger como "guardia invisible" (slide s2_2_1).'
        },
        {
            id: 'ms3',
            number: 11,
            topic: 'Triggers Statement-Level vs Row-Level',
            question: 'Respecto a la diferencia entre triggers a nivel de fila (FOR EACH ROW) y a nivel de sentencia (Statement-Level), selecciona las afirmaciones VERDADERAS:',
            options: [
                'a) Un trigger Statement-Level (sin FOR EACH ROW) se ejecuta una única vez por instrucción DML, sin importar si la sentencia afectó 0, 1 o 10.000 filas.',
                'b) Solo los triggers FOR EACH ROW tienen acceso a los pseudo-registros :OLD y :NEW.',
                'c) Un trigger Statement-Level puede modificar los valores de :NEW para cada una de las filas actualizadas masivamente.',
                'd) Si un UPDATE actualiza 50 localidades, un trigger AFTER UPDATE ... FOR EACH ROW se ejecutará exactamente 50 veces.'
            ],
            correctAnswers: [0, 1, 3], // a, b, d
            explanation: 'Los triggers Statement-Level no tienen :OLD ni :NEW (la opción c es falsa). a, b y d son correctas (slide s2_2_2).'
        },
        {
            id: 'ms4',
            number: 12,
            topic: 'Ventajas y Características de los Packages',
            question: '¿Cuáles de los siguientes beneficios arquitectónicos se obtienen al agrupar funciones y procedimientos en un Package (Paquete)?',
            options: [
                'a) Organización y encapsulamiento: agrupa objetos lógicamente relacionados en un único contenedor ordenado.',
                'b) Reutilización interna: un procedimiento dentro del cuerpo puede invocar directamente funciones del mismo paquete sin prefijos adicionales.',
                'c) Estado persistente de sesión: permite almacenar variables compartidas que mantienen su valor mientras dure la conexión del cliente.',
                'd) Desaparición del bloque BEGIN...END en los procedimientos del cuerpo.'
            ],
            correctAnswers: [0, 1, 2], // a, b, c
            explanation: 'a, b y c son los pilares fundamentales expuestos en las slides s2_3_1. La d es falsa (los procedimientos del cuerpo sí requieren BEGIN...END).'
        }
    ],

    // =========================================================================
    // PARTE 3: TÉRMINOS PAREADOS (MATCHING)
    // =========================================================================
    matchingQuestions: [
        {
            id: 'm1',
            number: 13,
            instruction: 'Asocia cada concepto o pseudo-variable técnica de PL/SQL con su definición o regla exacta vista en las diapositivas:',
            terms: [
                { id: 't1', name: 'Parámetro IN OUT' },
                { id: 't2', name: 'Pseudo-registro :OLD' },
                { id: 't3', name: 'Timing BEFORE' },
                { id: 't4', name: 'Timing AFTER' },
                { id: 't5', name: 'Especificación del Paquete' },
                { id: 't6', name: 'RAISE_APPLICATION_ERROR' }
            ],
            definitions: [
                { id: 'd1', text: 'Permite leer el valor entrante del invocante y a la vez devolverlo modificado al finalizar la ejecución.' },
                { id: 'd2', text: 'Contiene la fotografía del registro antes de la modificación; en sentencias INSERT su valor es NULL.' },
                { id: 'd3', text: 'Momento de disparo ideal para interceptar, validar o normalizar valores en :NEW antes de tocar el disco.' },
                { id: 'd4', text: 'Momento de disparo ideal para auditorías y bitácoras de cambios ya consumados en tablas secundarias.' },
                { id: 'd5', text: 'Actúa como la "carta del menú": declara públicamente los nombres de variables, funciones y procedimientos disponibles.' },
                { id: 'd6', text: 'Procedimiento de Oracle para emitir excepciones personalizadas con códigos numéricos obligatorios entre -20000 y -20999.' }
            ],
            // Solución de referencia: t1->d1, t2->d2, t3->d3, t4->d4, t5->d5, t6->d6
            correctMatches: {
                t1: 'd1',
                t2: 'd2',
                t3: 'd3',
                t4: 'd4',
                t5: 'd5',
                t6: 'd6'
            }
        }
    ],

    // =========================================================================
    // PARTE 4: VERDADERO O FALSO CON JUSTIFICACIÓN OBLIGATORIA
    // =========================================================================
    trueFalseQuestions: [
        {
            id: 'tf1',
            number: 14,
            topic: 'Parámetros OUT en Procedimientos',
            statement: 'Al invocar un procedimiento que tiene un parámetro OUT, es perfectamente válido pasar un literal directo como argumento, por ejemplo: `obtener_datos_cliente(1, \'Juan\', \'j@mail.com\');`.',
            expectedValue: false, // Falso
            referenceJustification: 'Es FALSO. Un parámetro OUT (o IN OUT) requiere obligatoriamente una variable del invocante para almacenar el valor retornado. Pasar un literal directo produce un error de compilación.'
        },
        {
            id: 'tf2',
            number: 15,
            topic: 'DML en Funciones invocadas desde SQL',
            statement: 'Una función PL/SQL que ejecuta una instrucción `UPDATE` o `INSERT` dentro de su cuerpo puede ser invocada sin problemas dentro de una cláusula `SELECT ... FROM ...;`.',
            expectedValue: false, // Falso
            referenceJustification: 'Es FALSO. Si una función llamada desde una sentencia SELECT realiza operaciones DML en la base de datos, Oracle aborta con el error ORA-14551 (cannot perform a DML operation inside a query).'
        },
        {
            id: 'tf3',
            number: 16,
            topic: 'Modificación de :NEW en Triggers AFTER',
            statement: 'En un trigger `AFTER UPDATE ... FOR EACH ROW`, el desarrollador puede escribir la instrucción `:NEW.precio := 50000;` para forzar un precio mínimo antes de que se grabe la fila.',
            expectedValue: false, // Falso
            referenceJustification: 'Es FALSO. En los triggers AFTER los datos ya fueron aplicados a la tabla. Intentar modificar :NEW arroja el error ORA-04084 (cannot change NEW values for this trigger type). Solo se permite en triggers BEFORE.'
        },
        {
            id: 'tf4',
            number: 17,
            topic: 'Orden de Compilación en Paquetes',
            statement: 'En la arquitectura de paquetes de Oracle, siempre es obligatorio compilar primero la Especificación (`CREATE PACKAGE`) y posteriormente compilar el Cuerpo (`CREATE PACKAGE BODY`).',
            expectedValue: true, // Verdadero
            referenceJustification: 'Es VERDADERO. La especificación define la interfaz pública y los tipos. El cuerpo depende directamente de ella; compilar el cuerpo antes de la especificación generará error de objeto no existente.'
        },
        {
            id: 'tf5',
            number: 18,
            topic: 'Invocación Explícita de Triggers',
            statement: 'Los triggers pueden ser invocados manualmente desde un bloque anónimo usando la sintaxis `EXECUTE nombre_trigger;` cuando el administrador requiera forzar su ejecución.',
            expectedValue: false, // Falso
            referenceJustification: 'Es FALSO. Un trigger nunca se invoca manualmente ni existe la sentencia EXECUTE para él. Se dispara única y automáticamente cuando ocurre el evento DML configurado en la tabla.'
        },
        {
            id: 'tf6',
            number: 19,
            topic: 'Persistencia de Variables de Paquete',
            statement: 'Si el usuario A modifica una variable pública de paquete (por ejemplo `pkg_boleteria.g_total_vendidas := 10;`), el usuario B conectado en otra sesión diferente verá inmediatamente el valor 10 reflejado en su pantalla.',
            expectedValue: false, // Falso
            referenceJustification: 'Es FALSO. Las variables de paquete tienen alcance de sesión (viven en la memoria PGA de cada conexión individual). Cada usuario tiene su propia instancia independiente de las variables del paquete.'
        }
    ],

    // =========================================================================
    // PARTE 5: COMPLETAR CÓDIGO CON POOL DE OPCIONES (6 EJERCICIOS DESAFIANTES)
    // =========================================================================
    codeCompletionQuestions: [
        // EJERCICIO 1: FUNCIÓN
        {
            id: 'cc1',
            number: 20,
            title: 'Ejercicio 1: Función para Cálculo de Descuento con Excepciones',
            topic: 'Funciones PL/SQL (s2_1_1)',
            description: 'Completa la siguiente función almacenada que calcula el monto de descuento según el convenio bancario de un cliente. Selecciona la opción correcta en cada menú desplegable.',
            codeTemplate: `CREATE OR REPLACE FUNCTION calcular_descuento(
    p_monto_bruto [BLANK_1],
    p_convenio_id IN NUMBER
) [BLANK_2]
AS
    v_porcentaje NUMBER;
    v_descuento  NUMBER;
BEGIN
    SELECT descuento_porcentaje
    [BLANK_3] v_porcentaje
    FROM CONVENIO_BANCO
    WHERE convenio_banco_id = p_convenio_id
      AND activo = 'S';

    v_descuento := ROUND(p_monto_bruto * v_porcentaje / 100, 2);
    [BLANK_4];
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        [BLANK_5];
END calcular_descuento;`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Modo del parámetro de entrada',
                    correctOption: 'IN NUMBER',
                    options: [
                        'IN NUMBER',
                        'OUT NUMBER',
                        'IN OUT NUMBER',
                        'RETURNS NUMBER'
                    ]
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Declaración de retorno en la firma',
                    correctOption: 'RETURN NUMBER',
                    options: [
                        'RETURN NUMBER',
                        'RETURNS NUMBER',
                        'RETURN NUMBER;',
                        'OUT NUMBER'
                    ]
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Cláusula para almacenar el resultado del SELECT',
                    correctOption: 'INTO',
                    options: [
                        'INTO',
                        ':=',
                        'ASSIGN TO',
                        'OUT'
                    ]
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Sentencia de retorno en el flujo principal',
                    correctOption: 'RETURN v_descuento',
                    options: [
                        'RETURN v_descuento',
                        'p_monto_bruto := v_descuento',
                        'RETURN',
                        'OUTPUT(v_descuento)'
                    ]
                },
                {
                    id: 'BLANK_5',
                    label: 'Espacio [5] - Retorno en caso de excepción NO_DATA_FOUND',
                    correctOption: 'RETURN 0',
                    options: [
                        'RETURN 0',
                        'v_descuento := 0',
                        'ROLLBACK',
                        'RAISE_APPLICATION_ERROR(-21000, \'Error\')'
                    ]
                }
            ]
        },

        // EJERCICIO 2: PROCEDIMIENTO CON PARÁMETROS IN, OUT E IN OUT
        {
            id: 'cc2',
            number: 21,
            title: 'Ejercicio 2: Procedimiento para Ajuste Tarifario con Parámetros Mixtos',
            topic: 'Procedimientos Almacenados (s2_1_1)',
            description: 'Completa el procedimiento que ajusta el precio de una localidad, actualiza el valor mediante un parámetro bidireccional y retorna el nombre de la localidad y las filas modificadas.',
            codeTemplate: `CREATE OR REPLACE PROCEDURE ajustar_tarifa_localidad(
    p_localidad_id    IN     NUMBER,
    p_precio_ajustado [BLANK_1],
    p_nombre_localidad [BLANK_2]
) [BLANK_3]
    v_nombre VARCHAR2(100);
BEGIN
    SELECT nombre_localidad
    INTO v_nombre
    FROM LOCALIDAD_EVENTO
    WHERE localidad_evento_id = p_localidad_id;

    -- Aplicamos el nuevo precio calculado externamente
    UPDATE LOCALIDAD_EVENTO
    SET precio = p_precio_ajustado
    WHERE localidad_evento_id = p_localidad_id;

    -- Devolvemos el nombre al invocante
    [BLANK_4] := v_nombre;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        [BLANK_5](-20002, 'Localidad no encontrada');
END ajustar_tarifa_localidad;`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Modo del parámetro de precio (entra con valor y sale confirmado)',
                    correctOption: 'IN OUT NUMBER',
                    options: [
                        'IN OUT NUMBER',
                        'OUT NUMBER',
                        'IN NUMBER',
                        'RETURN NUMBER'
                    ]
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Modo del parámetro para devolver el nombre al invocante',
                    correctOption: 'OUT VARCHAR2',
                    options: [
                        'OUT VARCHAR2',
                        'IN VARCHAR2',
                        'RETURN VARCHAR2',
                        'IN OUT VARCHAR2'
                    ]
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Palabra clave entre la firma y las variables locales',
                    correctOption: 'AS',
                    options: [
                        'AS',
                        'DECLARE',
                        'BEGIN',
                        'RETURNS'
                    ]
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Asignación del valor de salida',
                    correctOption: 'p_nombre_localidad',
                    options: [
                        'p_nombre_localidad',
                        ':p_nombre_localidad',
                        'RETURN',
                        'p_localidad_id'
                    ]
                },
                {
                    id: 'BLANK_5',
                    label: 'Espacio [5] - Invocación para disparar error con código de usuario',
                    correctOption: 'RAISE_APPLICATION_ERROR',
                    options: [
                        'RAISE_APPLICATION_ERROR',
                        'RAISE EXCEPTION',
                        'THROW ERROR',
                        'DBMS_OUTPUT.PUT_LINE'
                    ]
                }
            ]
        },

        // EJERCICIO 3: TRIGGER BEFORE ROW-LEVEL PARA NORMALIZACIÓN EN VUELO
        {
            id: 'cc3',
            number: 22,
            title: 'Ejercicio 3: Trigger BEFORE para Normalización y Limpieza en Vuelo',
            topic: 'Triggers BEFORE y :NEW (s2_2_1)',
            description: 'Completa el trigger centinela sobre la tabla CLIENTE que interrumpe la inserción o actualización para sanitizar y formatear automáticamente nombres, apellidos y correos electrónicos.',
            codeTemplate: `CREATE OR REPLACE TRIGGER trg_cliente_limpiar_datos
[BLANK_1] ON CLIENTE
[BLANK_2]
BEGIN
    -- 1. Forzar email en minúsculas y sin espacios accidentales
    [BLANK_3] := LOWER(TRIM(:NEW.email));

    -- 2. Asegurar que nombre y apellido inicien con mayúscula
    :NEW.nombre   := [BLANK_4](TRIM(:NEW.nombre));
    :NEW.apellido := [BLANK_4](TRIM(:NEW.apellido));
END trg_cliente_limpiar_datos;`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Timing y eventos del trigger',
                    correctOption: 'BEFORE INSERT OR UPDATE',
                    options: [
                        'BEFORE INSERT OR UPDATE',
                        'AFTER INSERT OR UPDATE',
                        'INSTEAD OF INSERT',
                        'BEFORE DELETE'
                    ]
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Cláusula para indicar ejecución por cada fila afectada',
                    correctOption: 'FOR EACH ROW',
                    options: [
                        'FOR EACH ROW',
                        'FOR EACH STATEMENT',
                        'FOR ALL ROWS',
                        'WHEN (NEW.email IS NOT NULL)'
                    ]
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Destino de la asignación en el pseudo-registro nuevo',
                    correctOption: ':NEW.email',
                    options: [
                        ':NEW.email',
                        ':OLD.email',
                        'NEW.email',
                        'CLIENTE.email'
                    ]
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Función SQL para convertir a formato tipo Nombre Propio',
                    correctOption: 'INITCAP',
                    options: [
                        'INITCAP',
                        'UPPER',
                        'CAPITALIZE',
                        'SUBSTR'
                    ]
                }
            ]
        },

        // EJERCICIO 4: TRIGGER AFTER CON UPDATE OF, CLÁUSULA WHEN Y BITÁCORA
        {
            id: 'cc4',
            number: 23,
            title: 'Ejercicio 4: Trigger AFTER para Bitácora de Auditoría con Cláusula WHEN',
            topic: 'Triggers AFTER, UPDATE OF y WHEN (s2_2_2)',
            description: 'Completa el trigger de auditoría sobre LOCALIDAD_EVENTO que se dispara únicamente cuando cambia la columna precio y el nuevo valor es efectivamente distinto al anterior.',
            codeTemplate: `CREATE OR REPLACE TRIGGER trg_auditoria_precio
[BLANK_1] ON LOCALIDAD_EVENTO
FOR EACH ROW
WHEN ([BLANK_2])
BEGIN
    -- Insertar en la tabla bitácora los precios anterior y nuevo
    INSERT INTO LOG_CAMBIO_PRECIO (
        localidad_evento_id,
        precio_anterior,
        precio_nuevo,
        fecha_cambio
    ) VALUES (
        :OLD.localidad_evento_id,
        [BLANK_3],
        [BLANK_4],
        SYSTIMESTAMP
    );
END trg_auditoria_precio;`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Timing y cláusula para acotar a la columna precio',
                    correctOption: 'AFTER UPDATE OF precio',
                    options: [
                        'AFTER UPDATE OF precio',
                        'BEFORE UPDATE OF precio',
                        'AFTER UPDATE ON precio',
                        'AFTER INSERT OR DELETE OF precio'
                    ]
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Condición en la cláusula WHEN (atención a la sintaxis sin dos puntos)',
                    correctOption: 'OLD.precio != NEW.precio',
                    options: [
                        'OLD.precio != NEW.precio',
                        ':OLD.precio != :NEW.precio',
                        'NEW.precio IS MODIFIED',
                        ':OLD.precio IS NOT NULL'
                    ]
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Referencia al precio antes del cambio en el cuerpo',
                    correctOption: ':OLD.precio',
                    options: [
                        ':OLD.precio',
                        'OLD.precio',
                        ':NEW.precio',
                        'precio_anterior'
                    ]
                },
                {
                    id: 'BLANK_4',
                    label: 'Espacio [4] - Referencia al precio después del cambio en el cuerpo',
                    correctOption: ':NEW.precio',
                    options: [
                        ':NEW.precio',
                        'NEW.precio',
                        ':OLD.precio',
                        'precio_nuevo'
                    ]
                }
            ]
        },

        // EJERCICIO 5: PAQUETES - ESPECIFICACIÓN (PACKAGE SPECIFICATION)
        {
            id: 'cc5',
            number: 24,
            title: 'Ejercicio 5: Especificación de Paquete (Package Specification)',
            topic: 'Paquetes PL/SQL - Spec (s2_3_1)',
            description: 'Completa la especificación del paquete pkg_boleteria que declara la variable pública del turno del cajero, la firma de la función de stock y la firma del procedimiento de venta.',
            codeTemplate: `[BLANK_1] pkg_boleteria AS
    -- 1. Variable de paquete (memoria de sesión para el cajero)
    [BLANK_2] NUMBER := 0;

    -- 2. Firma pública de la función para consultar stock
    FUNCTION consultar_stock(p_localidad_id IN NUMBER)
    [BLANK_3];

    -- 3. Firma pública del procedimiento para vender entradas
    PROCEDURE vender_entradas(
        p_localidad_id IN NUMBER,
        p_cantidad     IN NUMBER
    );
END pkg_boleteria;`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Sentencia DDL para la especificación',
                    correctOption: 'CREATE OR REPLACE PACKAGE',
                    options: [
                        'CREATE OR REPLACE PACKAGE',
                        'CREATE OR REPLACE PACKAGE BODY',
                        'CREATE OR REPLACE SPECIFICATION',
                        'DECLARE PACKAGE'
                    ]
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Identificador de la variable de paquete de sesión',
                    correctOption: 'g_total_vendidas',
                    options: [
                        'g_total_vendidas',
                        'v_total_vendidas',
                        ':g_total_vendidas',
                        'VARIABLE g_total_vendidas'
                    ]
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Cláusula de tipo de retorno en la especificación',
                    correctOption: 'RETURN NUMBER',
                    options: [
                        'RETURN NUMBER',
                        'RETURNS NUMBER',
                        'RETURN NUMBER IS BEGIN NULL; END',
                        'OUT NUMBER'
                    ]
                }
            ]
        },

        // EJERCICIO 6: PAQUETES - CUERPO (PACKAGE BODY) Y REUTILIZACIÓN
        {
            id: 'cc6',
            number: 25,
            title: 'Ejercicio 6: Cuerpo del Paquete (Package Body) con Reutilización Interna',
            topic: 'Paquetes PL/SQL - Body (s2_3_1)',
            description: 'Completa el cuerpo del paquete pkg_boleteria donde el procedimiento vender_entradas invoca la función del mismo paquete, valida el stock y acumula en la variable del turno.',
            codeTemplate: `CREATE OR REPLACE [BLANK_1] pkg_boleteria AS

    FUNCTION consultar_stock(p_localidad_id IN NUMBER) RETURN NUMBER IS
        v_stock NUMBER;
    BEGIN
        SELECT stock_disponible INTO v_stock
        FROM LOCALIDAD_EVENTO
        WHERE localidad_evento_id = p_localidad_id;
        RETURN v_stock;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 0;
    END consultar_stock;

    PROCEDURE vender_entradas(
        p_localidad_id IN NUMBER,
        p_cantidad     IN NUMBER
    ) IS
        v_disponible NUMBER;
    BEGIN
        -- 1. Reutilización interna de la función del paquete sin prefijo
        v_disponible := [BLANK_2](p_localidad_id);

        -- 2. Validación de disponibilidad
        IF v_disponible < p_cantidad THEN
            RAISE_APPLICATION_ERROR(-20001, 'Stock insuficiente para la venta.');
        END IF;

        -- 3. Descontar stock en la tabla
        UPDATE LOCALIDAD_EVENTO
        SET stock_disponible = stock_disponible - p_cantidad
        WHERE localidad_evento_id = p_localidad_id;

        -- 4. Acumular en la variable persistente de sesión
        [BLANK_3] := [BLANK_3] + p_cantidad;
    END vender_entradas;

END pkg_boleteria;`,
            blanks: [
                {
                    id: 'BLANK_1',
                    label: 'Espacio [1] - Sentencia DDL para la implementación del cuerpo',
                    correctOption: 'PACKAGE BODY',
                    options: [
                        'PACKAGE BODY',
                        'PACKAGE',
                        'BODY PACKAGE',
                        'PACKAGE IMPLEMENTATION'
                    ]
                },
                {
                    id: 'BLANK_2',
                    label: 'Espacio [2] - Llamada interna a la función dentro del cuerpo',
                    correctOption: 'consultar_stock',
                    options: [
                        'consultar_stock',
                        'EXECUTE consultar_stock',
                        'CALL pkg_boleteria.consultar_stock',
                        'SELECT consultar_stock FROM DUAL'
                    ]
                },
                {
                    id: 'BLANK_3',
                    label: 'Espacio [3] - Variable de paquete acumuladora de la sesión',
                    correctOption: 'g_total_vendidas',
                    options: [
                        'g_total_vendidas',
                        'v_disponible',
                        ':g_total_vendidas',
                        'stock_disponible'
                    ]
                }
            ]
        }
    ],

    // =========================================================================
    // PARTE 6: CASO DE ARQUITECTURA INTEGRAL Y RELATO TÉCNICO DEL ESTUDIANTE
    // =========================================================================
    caseStudy: {
        id: 'case1',
        number: 26,
        title: 'Caso Final de Arquitectura: "Operación Estadio Lleno en Punto Ticket"',
        subtitle: 'Diseño e Integración de Funciones, Procedimientos, Triggers y Paquetes',
        scenario: `
            <div class="analogy-box" style="margin-bottom: 1.5rem;">
                <strong>🚨 El Escenario de Negocio:</strong><br>
                Punto Ticket está a punto de lanzar la venta de 60.000 entradas para el concierto de una banda internacional en el Estadio Nacional.
                En la última venta masiva, la plataforma sufrió graves incidentes técnicos y de negocio:
                <ol style="margin-top: 0.5rem; margin-left: 1.25rem; line-height: 1.7;">
                    <li><strong>Datos corruptos en clientes:</strong> Miles de personas se registraron a las apuradas desde aplicaciones móviles escribiendo correos con espacios y mayúsculas desordenadas (ej. <code>"  CARLOS.G@GMAIL.COM "</code>), lo que provocó que nunca les llegaran sus e-tickets.</li>
                    <li><strong>Error humano en precios ("el dedazo"):</strong> Un analista comercial modificó manualmente en SQL Developer el precio de la localidad VIP pero se equivocó en un cero, y nadie se enteró hasta que ya se habían vendido cientos de entradas baratas sin dejar rastro de quién o cuándo se cambió el dato.</li>
                    <li><strong>Consultas pesadas en reportes:</strong> El área comercial ejecutaba a cada minuto consultas complejas con <code>SUM()</code> y <code>JOIN</code> para ver cuántas entradas quedaban en cada localidad, congestionando la base de datos de producción.</li>
                    <li><strong>Descuadre en turnos de boletería física:</strong> Los cajeros de las boleterías del recinto no tenían una forma liviana y rápida de consultar su total vendido durante su turno sin escribir en tablas transaccionales.</li>
                    <li><strong>Falla en cancelación de reservas:</strong> Al expirar una reserva temporal, se marcaba como 'CANCELADA', pero se olvidaba devolver el cupo al stock de la localidad, perdiendo ventas reales.</li>
                </ol>
            </div>
            <div class="concept-box" style="margin-bottom: 1.5rem;">
                <strong>🎯 Tu Misión como Ingeniero/a de Bases de Datos Senior:</strong><br>
                Redacta a continuación un <strong>relato técnico y estructurado</strong> (mínimo 250 - 350 palabras) explicando cómo resolverías estos dolores utilizando <strong>exclusivamente los fundamentos aprendidos en la Unidad 2</strong>:
                <ul style="margin-top: 0.5rem; margin-left: 1.25rem; line-height: 1.7;">
                    <li><strong>1. Funciones:</strong> ¿Qué función(es) crearías, qué parámetros recibirían, qué retornarían y cómo se aprovecharían dentro de sentencias <code>SELECT</code> de reportes sin violar la restricción DML (evitando <code>ORA-14551</code>)?</li>
                    <li><strong>2. Procedimientos Almacenados:</strong> ¿Qué procedimiento(s) diseñarías (por ejemplo para cancelar reservas o procesar compras), qué modos de parámetros usarías (<code>IN</code>, <code>OUT</code>, <code>IN OUT</code>) y qué excepciones controlarías con <code>RAISE_APPLICATION_ERROR</code> (-20000 a -20999)?</li>
                    <li><strong>3. Triggers:</strong> ¿Qué triggers implementarías sobre las tablas <code>CLIENTE</code> y <code>LOCALIDAD_EVENTO</code>? Especifica con precisión su timing (<code>BEFORE</code> o <code>AFTER</code>), su nivel (<code>FOR EACH ROW</code> o Statement-Level), el uso de los pseudo-registros <code>:NEW</code> / <code>:OLD</code>, y cuándo aplicarías la cláusula <code>WHEN</code> o <code>UPDATE OF</code>.</li>
                    <li><strong>4. Paquetes (Packages):</strong> ¿Cómo empaquetarías la lógica de boletería (especificación y cuerpo) y cómo resolverías el contador del turno del cajero utilizando variables de paquete con persistencia a nivel de sesión (PGA)?</li>
                </ul>
            </div>
        `,
        starterPlaceholder: `Escribe aquí tu relato de arquitectura técnica...

Ejemplo de estructura recomendada para tu relato:

1. ESTRATEGIA DE TRIGGERS (GUARDIA INVISIBLE):
- Para el dolor de datos de clientes: Usaría un trigger BEFORE INSERT OR UPDATE ON CLIENTE FOR EACH ROW porque...
- Para el dolor del "dedazo" de precios: Implementaría un trigger AFTER UPDATE OF precio ON LOCALIDAD_EVENTO FOR EACH ROW WHEN (OLD.precio != NEW.precio) para...

2. ESTRATEGIA DE FUNCIONES PARA REPORTES:
- Para las consultas comerciales livianas: Diseñaría la función...

3. ESTRATEGIA DE PROCEDIMIENTOS ALMACENADOS:
- Para la cancelación segura de reservas: Construiría el procedimiento... con parámetros IN y OUT...

4. ESTRATEGIA DE PAQUETE (PACKAGE) Y TURNO DE CAJERO:
- Empaquetaría la solución en pkg_boleteria separando la Especificación del Cuerpo porque...
- Para el contador del turno usaría la variable g_total_vendidas ya que...`
    },

    // =========================================================================
    // INSTRUCCIONES DE EVALUACIÓN PARA EL AGENTE IA (INCLUIDAS EN EL MARKDOWN)
    // =========================================================================
    aiAgentEvaluationRubric: `
### RÚBRICA Y GUÍA PARA EL AGENTE EVALUADOR DE IA:
- **Puntaje Total Máximo:** 100 Puntos (Escala Chilena 1.0 a 7.0 al 60% de exigencia, 60 pts = 4.0).
- **Desglose de Puntajes:**
  1. **Parte 1 (Alternativas):** 8 preguntas x 3 pts = 24 pts.
  2. **Parte 2 (Selección Múltiple):** 4 preguntas x 3 pts = 12 pts (puntaje parcial si marca un subconjunto correcto sin marcar distractores).
  3. **Parte 3 (Términos Pareados):** 6 términos x 2 pts = 12 pts.
  4. **Parte 4 (Verdadero / Falso con Justificación):** 6 ítems x 3 pts = 18 pts (1 pto identificar V/F + 2 pts calidad técnica de la justificación).
  5. **Parte 5 (Completar Código):** 6 ejercicios x 3 pts = 18 pts.
  6. **Parte 6 (Caso de Arquitectura y Relato):** 1 relato = 16 pts evaluando coherencia entre Triggers (BEFORE/AFTER, :NEW/:OLD), Funciones en SELECT, Procedimientos con IN/OUT/IN OUT, y Paquetes con variables de sesión.
- **Fórmula de Calificación:**
  - Si Puntaje < 60: Nota = 1.0 + 3.0 * (Puntaje / 60)
  - Si Puntaje >= 60: Nota = 4.0 + 3.0 * ((Puntaje - 60) / 40)
`
};
