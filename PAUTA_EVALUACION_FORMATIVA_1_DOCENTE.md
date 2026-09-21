# PAUTA DE EVALUACIÓN Y SOLUCIONARIO DOCENTE
## Evaluación Formativa N° 1: Bloques PL/SQL
**Asignatura:** Taller de Bases de Datos (BDY1103)  
**Motor de Base de Datos:** Oracle Database 19c  
**Base de Datos Base:** `clon_punto_ticket.sql`  
**Escala de Calificación:** Escala Chilena (1.0 a 7.0 con 60% de exigencia)  
**Script SQL de Pruebas:** [`solucionario_formativa_1.sql`](file:///Users/hachimaki/Desktop/2026%202%20semestre/Taller%20de%20bases%20de%20datos/plataforma-docente/solucionario_formativa_1.sql)  
**Destinatario:** Docente / Equipo Académico  
**Versión:** 2.0 — Actualizada con escala chilena y política de ejercicio opcional

---

## 1. Lineamientos de Evaluación y Escala de Notas (Chile: 1.0 - 7.0)

### 1.1 Política Oficial sobre Ejercicios Prácticos
> [!IMPORTANT]
> **Ajuste Curricular — Ejercicio 2 (VARRAY):**  
> El **Ejercicio 2 (VARRAY)** fue retirado de la instrucción obligatoria. Por lo tanto:
> - **Estudiantes que NO suban el Ejercicio 2:** No reciben descuento ni penalización. Su nota se calcula sobre los **3 ejercicios obligatorios (Ej. 1, Ej. 3 y Ej. 4) + 12 preguntas teóricas**, con una base de 100 puntos totales.
> - **Estudiantes que SÍ suban el Ejercicio 2:** Se califica de forma formativa y se les otorga una **bonificación directa de hasta +0.5 décimas adicionales en su nota final** (o hasta +10 puntos de bonificación en su puntaje bruto, respetando el tope máximo de nota 7.0).

---

### 1.2 Estructura de Puntajes Oficial (Base 100 Puntos)

| Sección de la Evaluación | Ítem | Cantidad / Tipo | Puntaje Unitario | Subtotal |
| :--- | :--- | :--- | :---: | :---: |
| **Parte 1: Teoría** | Preguntas de Selección Múltiple | 12 preguntas conceptuales | 2 pts c/u | **24 pts** |
| **Parte 2: Práctica** | **Ejercicio 1:** RECORD y Excepciones (`RECINTO`) | 1 bloque anónimo | 25 pts | **25 pts** |
| **Parte 2: Práctica** | **Ejercicio 3:** Cursor Explícito + Cierre Seguro (`TICKET`) | 1 bloque anónimo | 25 pts | **25 pts** |
| **Parte 2: Práctica** | **Ejercicio 4:** Cursor Parametrizado + Excepción Usuario | 1 bloque anónimo | 26 pts | **26 pts** |
| **TOTAL OFICIAL** | *(Sin considerar Ejercicio 2)* | | | **100 pts** |
| **BONIFICACIÓN** | **Ejercicio 2:** VARRAY Colecciones (`CONVENIO_BANCO`) | 1 bloque anónimo | Opcional | **+0.5 décimas** (o +10 pts bonus) |

---

### 1.3 Fórmula de Conversión a Nota Chilena (60% de Exigencia)

Para un puntaje máximo $P_{max} = 100$ puntos y un umbral de aprobación al 60% ($P_{apr} = 60$ puntos para nota 4.0):

$$
\text{Nota} = 
\begin{cases} 
1.0 + 3.0 \times \left(\dfrac{P}{60}\right) = 1.0 + 0.05 \times P & \text{si } P < 60 \\
4.0 + 3.0 \times \left(\dfrac{P - 60}{40}\right) = 4.0 + 0.075 \times (P - 60) & \text{si } P \ge 60 
\end{cases}
$$

#### Tabla de Conversión Rápida de Puntaje a Nota

| Puntaje | Nota | Estado | Puntaje | Nota | Estado |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **0 – 9** | **1.0 – 1.4** | Reprobado | **60** | **4.0** | **Aprobado (Umbral 60%)** |
| **10 – 19** | **1.5 – 1.9** | Reprobado | **65** | **4.4** | Aprobado |
| **20 – 29** | **2.0 – 2.4** | Reprobado | **70** | **4.8** | Aprobado |
| **30 – 39** | **2.5 – 2.9** | Reprobado | **75** | **5.1** | Aprobado |
| **40 – 49** | **3.0 – 3.4** | Reprobado | **80** | **5.5** | Aprobado |
| **50 – 54** | **3.5 – 3.7** | Reprobado | **85** | **5.9** | Aprobado |
| **55 – 59** | **3.8 – 3.9** | Reprobado | **90** | **6.3** | Aprobado |
| | | | **95** | **6.6** | Aprobado |
| | | | **100** | **7.0** | **Sobresaliente (Máximo)** |

---

## 2. Ficha Técnica y Verificación de Integridad con `clon_punto_ticket.sql`

Se auditó de forma rigurosa el esquema y datos sembrados en `clon_punto_ticket.sql`, garantizando que todos los requerimientos son **100% resolubles**:

| Ejercicio | Conceptos PL/SQL | Tablas en `clon_punto_ticket.sql` | Columnas y Relaciones | Casos de Prueba en la BD |
| :--- | :--- | :--- | :--- | :--- |
| **Ejercicio 1** | `RECORD` + `SELECT INTO` + Excepciones estándar | `RECINTO` | `recinto_id` (PK), `nombre`, `direccion`, `ciudad`, `capacidad_total` | **Éxito:** `recinto_id = 1` ('Movistar Arena')<br>**Excepción:** `recinto_id = 999` (`NO_DATA_FOUND`) |
| **Ejercicio 2** *(Opcional)* | `VARRAY(4)` + Colecciones + Excepciones de índice | `CONVENIO_BANCO` | `convenio_banco_id` (PK), `banco`, `activo` | **Éxito:** Exactamente 4 convenios con `activo = 'S'` (Banco de Chile, BancoEstado, Bci, Santander). |
| **Ejercicio 3** | Cursor explícito con JOIN relacional + Cierre seguro | `TICKET`, `TRANSACCION_PAGO`, `RESERVA_TEMPORAL`, `CLIENTE` | `TICKET.transaccion_id` $\to$ `TRANSACCION_PAGO`<br>`TICKET.reserva_id` $\to$ `RESERVA_TEMPORAL`<br>`RESERVA_TEMPORAL.cliente_id` $\to$ `CLIENTE` | **Éxito:** 4 tickets emitidos en estado `'EMITIDO'` ($443.145 total recaudado).<br>**Excepción:** `IF %ISOPEN THEN CLOSE`. |
| **Ejercicio 4** | Cursor con Parámetro + Excepción de Usuario (`RAISE`) | `EVENTO`, `PRODUCTORA` | `EVENTO.productora_id` $\to$ `PRODUCTORA.productora_id`<br>`EVENTO.nombre`, `fecha_evento`, `estado` | **Éxito:** Productora 1 ('Bizarro Live', 1 evento) o Productora 2 ('Lotus', 1 evento).<br>**Excepción:** Productora 999 sin eventos $\to$ `RAISE e_sin_eventos_vigentes`. |

---

## 3. Parte 1: Solucionario de Selección Múltiple (12 Preguntas Teóricas)

**Puntaje total de la sección:** 24 puntos (2 puntos por respuesta correcta).

---

### Pregunta 1
**Enunciado:** ¿Cuál de las siguientes afirmaciones es correcta sobre un RECORD en PL/SQL?  
- a) Un RECORD puede contener solo tipos de datos numéricos.  
- b) Un RECORD es una colección de valores escalables.  
- c) Un RECORD puede contener múltiples tipos de datos.  
- d) Un RECORD es un tipo de cursor en PL/SQL.  

- **Clave Correcta:** **c**
- **Justificación Técnica:** En Oracle PL/SQL, un `RECORD` es una estructura de datos compuesta y heterogénea. Permite agrupar campos individuales que pueden tener distintos tipos de datos (`VARCHAR2`, `NUMBER`, `DATE`, `%TYPE`, `%ROWTYPE`).
- **Análisis de Distractores:**  
  - *a:* Soporta cualquier tipo escalar o compuesto, no solo numéricos.  
  - *b:* No es una colección homogénea.  
  - *d:* Un record es una variable de memoria para datos, no un cursor.
- **Feedback para el Alumno:** *"Un RECORD es como una fila de tabla o un struct: su fortaleza radica en agrupar campos de tipos de datos totalmente heterogéneos bajo un solo nombre."*

---

### Pregunta 2
**Enunciado:** ¿Cuál de las siguientes afirmaciones es verdadera sobre un VARRAY en PL/SQL?  
- a) Un VARRAY puede contener tipos de datos heterogéneos.  
- b) Un VARRAY tiene un tamaño máximo que se define al momento de su declaración.  
- c) Un VARRAY no permite acceso a sus elementos mediante índices.  
- d) Un VARRAY puede contener registros de múltiples tablas.  

- **Clave Correcta:** **b**
- **Justificación Técnica:** Por definición, un `VARRAY` (*Variable-Size Array*) es una colección unidimensional homogénea cuyo límite superior máximo se declara de forma inmutable: `TYPE t_arr IS VARRAY(n) OF tipo;`.
- **Análisis de Distractores:**  
  - *a:* Las colecciones en PL/SQL son homogéneas (mismo tipo de dato en todos sus elementos).  
  - *c:* Se indexa numéricamente comenzando desde 1 (`arr(1)`).  
  - *d:* Almacena elementos de un único tipo base.
- **Feedback para el Alumno:** *"El rasgo distintivo de un VARRAY es su cota superior fija: nace con un tamaño máximo que no puede rebasarse en tiempo de ejecución."*

---

### Pregunta 3
**Enunciado:** ¿Cuál es el orden correcto de las secciones en un bloque PL/SQL?  
- a) BEGIN, DECLARE, EXCEPTION, END  
- b) DECLARE, EXCEPTION, BEGIN, END  
- c) DECLARE, BEGIN, EXCEPTION, END  
- d) BEGIN, DECLARE, END, EXCEPTION  

- **Clave Correcta:** **c**
- **Justificación Técnica:** La gramática oficial de PL/SQL exige secuencialidad: `DECLARE` (declarativa, opcional) $\to$ `BEGIN` (ejecutable, obligatoria) $\to$ `EXCEPTION` (manejadores de error, opcional) $\to$ `END;` (cierre obligatorio).
- **Análisis de Distractores:** Cualquier otra disposición genera el error de compilación `PLS-00103`.
- **Feedback para el Alumno:** *"Estructura estándar de PL/SQL: Declaras tus variables (`DECLARE`), ejecutas tus instrucciones (`BEGIN`), capturas anomalías (`EXCEPTION`) y terminas (`END;`)."*

---

### Pregunta 4
**Enunciado:** ¿Cuál de las siguientes es una forma válida de construir un loop en PL/SQL?  
- a) WHILE-END LOOP  
- b) REPEAT-UNTIL  
- c) FOR-LOOP  
- d) SWITCH-END SWITCH  

- **Clave Correcta:** **c**
- **Justificación Técnica:** PL/SQL soporta bucle básico (`LOOP`), condicional (`WHILE condicion LOOP ... END LOOP;`) y de conteo/cursor (`FOR i IN ... LOOP ... END LOOP;`). `FOR-LOOP` es la única opción canónica de la lista.
- **Análisis de Distractores:**  
  - *a:* Falta la palabra clave `LOOP` tras la condición (`WHILE cond LOOP`).  
  - *b y d:* Estructuras inexistentes en PL/SQL (se utiliza `CASE` en lugar de `SWITCH`).
- **Feedback para el Alumno:** *"En PL/SQL los bucles válidos son LOOP simple, WHILE-LOOP y FOR-LOOP. No existen estructuras REPEAT-UNTIL ni SWITCH."*

---

### Pregunta 5
**Enunciado:** ¿Cuál de las siguientes es una excepción predefinida en Oracle PL/SQL?  
- a) VALUE_TOO_LARGE  
- b) DUP_VAL_ON_INDEX  
- c) INVALID_NUMBER  
- d) TODAS LAS ANTERIORES  

- **Clave Correcta:** **d** *(Según pauta del instrumento)*
- **Nota Docente:** En el paquete `STANDARD` de Oracle las excepciones con nombre son `DUP_VAL_ON_INDEX` (ORA-00001), `INVALID_NUMBER` (ORA-01722) y `VALUE_ERROR` (ORA-06502). El error de truncamiento se suele denominar coloquialmente "value too large", por lo que la opción **d** es la respuesta curricular esperada.
- **Feedback para el Alumno:** *"Oracle incluye decenas de excepciones predefinidas que se disparan automáticamente ante colisiones de claves únicas, errores numéricos o desbordamientos."*

---

### Pregunta 6
**Enunciado:** ¿Cuál de las siguientes afirmaciones es verdadera sobre las excepciones definidas por el usuario?  
- a) Las excepciones definidas por el usuario no pueden ser declaradas dentro de un bloque PL/SQL.  
- b) Las excepciones definidas por el usuario no necesitan ser manejadas explícitamente.  
- c) Las excepciones definidas por el usuario deben ser declaradas y lanzadas explícitamente.  
- d) Las excepciones definidas por el usuario son manejadas automáticamente por Oracle.  

- **Clave Correcta:** **c**
- **Justificación Técnica:** Al modelar reglas de negocio propias del desarrollador, Oracle desconoce cuándo ocurren. El programador debe declararlas en `DECLARE`, dispararlas mediante `RAISE mi_excepcion;` y capturarlas en la sección `EXCEPTION`.
- **Feedback para el Alumno:** *"Las excepciones de usuario representan reglas de tu propio negocio: debes declararlas en DECLARE, dispararlas tú mismo con RAISE y atraparlas en EXCEPTION."*

---

### Pregunta 7
**Enunciado:** ¿Cuál es la principal diferencia entre un procedimiento y una función almacenada en PL/SQL?  
- a) Un procedimiento puede ser llamado desde una sentencia SQL.  
- b) Una función siempre retorna un valor, mientras que un procedimiento no necesariamente.  
- c) Un procedimiento debe ser compilado, mientras que una función no.  
- d) Un procedimiento puede contener transacciones, mientras que una función no.  

- **Clave Correcta:** **b**
- **Justificación Técnica:** Una función (`FUNCTION`) contiene obligatoriamente la cláusula `RETURN tipo` y debe devolver un valor escalar o compuesto mediante `RETURN valor;`. Un procedimiento ejecuta tareas o transacciones y no posee tipo de retorno formal.
- **Feedback para el Alumno:** *"Una función SIEMPRE retorna un valor (y puede usarse en consultas SELECT). Un procedimiento ejecuta acciones o transacciones y no retorna un valor por cabecera."*

---

### Pregunta 8
**Enunciado:** ¿Cuál de las siguientes afirmaciones es verdadera sobre los packages en PL/SQL?  
- a) Un package no puede contener funciones.  
- b) Un package puede agrupar procedimientos, funciones y otros elementos relacionados.  
- c) Un package se compila cada vez que se ejecuta.  
- d) Un package no puede tener variables globales.  

- **Clave Correcta:** **b**
- **Justificación Técnica:** Un `PACKAGE` es un contenedor que encapsula tipos, variables, cursores, funciones y procedimientos relacionados, separando la especificación (pública) del cuerpo (privado).
- **Feedback para el Alumno:** *"Los paquetes permiten organizar, modularizar y encapsular la lógica de negocio, compartiendo variables de sesión y optimizando la compilación en memoria."*

---

### Pregunta 9
**Enunciado:** ¿Qué es un trigger en PL/SQL?  
- a) Un bloque de código que se ejecuta en un momento específico en respuesta a un evento de base de datos.  
- b) Un procedimiento almacenado que se ejecuta manualmente.  
- c) Una función que se llama dentro de una sentencia SQL.  
- d) Un paquete que agrupa varias funciones y procedimientos.  

- **Clave Correcta:** **a**
- **Justificación Técnica:** Un trigger es un subprograma reactivo que se dispara automáticamente ante un evento desencadenante en la base de datos (eventos DML como `INSERT`, `UPDATE`, `DELETE`, o eventos del sistema/DDL).
- **Feedback para el Alumno:** *"Un trigger nunca se invoca manualmente: permanece latente hasta que ocurre el evento para el cual fue programado en una tabla o esquema."*

---

### Pregunta 10
**Enunciado:** ¿En cuál de los siguientes casos sería más adecuado usar un procedimiento almacenado?  
- a) Para calcular el total de una factura en una sentencia SQL.  
- b) Para realizar una serie de operaciones de inserción y actualización en múltiples tablas.  
- c) Para obtener el nombre completo de un cliente basado en su ID.  
- d) Para validar el formato de una dirección de correo electrónico.  

- **Clave Correcta:** **b**
- **Justificación Técnica:** Las operaciones transaccionales complejas que alteran el estado de múltiples tablas mediante operaciones DML combinadas con commits/rollbacks son el propósito central de un `PROCEDURE`.
- **Feedback para el Alumno:** *"Usa procedimientos para procesos transaccionales de negocio con múltiples INSERTs y UPDATEs. Usa funciones cuando necesites calcular un valor puntual."*

---

### Pregunta 11
**Enunciado:** ¿En cuál de los siguientes casos sería más adecuado usar una función almacenada?  
- a) Para actualizar el salario de todos los empleados en un departamento.  
- b) Para obtener el precio con descuento de un producto en una sentencia SELECT.  
- c) Para realizar una auditoría de todas las operaciones DML en una tabla.  
- d) Para enviar una notificación por correo electrónico al completar una transacción.  

- **Clave Correcta:** **b**
- **Justificación Técnica:** Una función de cálculo que no modifique tablas (libre de efectos secundarios) puede invocarse directamente dentro de la cláusula `SELECT` para enriquecer la consulta fila por fila.
- **Feedback para el Alumno:** *"Las funciones son perfectas para calcular valores derivados (como descuentos o montos con IVA) y consumirlos directamente desde sentencias SQL."*

---

### Pregunta 12
**Enunciado:** ¿En cuál de los siguientes casos sería más adecuado usar un trigger?  
- a) Para enviar un correo electrónico cuando se inserta un nuevo registro en la tabla de clientes.  
- b) Para calcular el precio total de un pedido.  
- c) Para crear una vista que combine datos de varias tablas.  
- d) Para listar todos los empleados de un departamento específico.  

- **Clave Correcta:** **a**
- **Justificación Técnica:** Garantiza que la acción reactiva ocurra obligatoriamente siempre que ingrese un nuevo cliente (`AFTER INSERT ON CLIENTE`), sin importar la aplicación o cliente SQL utilizado.
- **Feedback para el Alumno:** *"Usa triggers para automatizar respuestas inmediatas a inserciones o modificaciones, garantizando auditoría o alertas obligatorias."*

---

## 4. Parte 2: Solucionario y Rúbricas de Ejercicios Prácticos

---

### Ejercicio Práctico 1: Bloque con RECORD y Manejo de Excepciones (25 Puntos)

#### A. Criterio de Aceptación y Validación Docente
> [!TIP]
> **Decisión Docente:** Tanto el uso de un `TYPE ... IS RECORD` con campos anclados por `%TYPE`, como el uso directo de `RECINTO%ROWTYPE`, se consideran **100% VÁLIDOS CON PUNTAJE COMPLETO (25/25 pts)**, siempre que la consulta, la impresión de campos y los bloques de excepciones funcionen correctamente.

#### B. Solución Canónica (RECORD personalizado)
```sql
SET SERVEROUTPUT ON;

DECLARE
    -- 1. Declaración de tipo RECORD con tipos anclados a la tabla RECINTO
    TYPE r_recinto_info IS RECORD (
        nombre          RECINTO.nombre%TYPE,
        direccion       RECINTO.direccion%TYPE,
        ciudad          RECINTO.ciudad%TYPE,
        capacidad_total RECINTO.capacidad_total%TYPE
    );

    v_recinto r_recinto_info;
    p_recinto_id RECINTO.recinto_id%TYPE := 1; -- Cambiar a 999 para probar NO_DATA_FOUND

BEGIN
    -- 2. SELECT INTO hacia la variable de tipo RECORD
    SELECT nombre, direccion, ciudad, capacidad_total
    INTO v_recinto
    FROM RECINTO
    WHERE recinto_id = p_recinto_id;

    -- 3. Salida formateada
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('DATOS DEL RECINTO [ID: ' || p_recinto_id || ']');
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Nombre Recinto : ' || v_recinto.nombre);
    DBMS_OUTPUT.PUT_LINE('Dirección      : ' || v_recinto.direccion);
    DBMS_OUTPUT.PUT_LINE('Ciudad         : ' || v_recinto.ciudad);
    DBMS_OUTPUT.PUT_LINE('Capacidad Total: ' || TO_CHAR(v_recinto.capacidad_total, 'FM999,999') || ' personas');
    DBMS_OUTPUT.PUT_LINE('----------------------------------------------------');

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR [NO_DATA_FOUND]: El recinto ID ' || p_recinto_id || ' no existe en el sistema.');
    WHEN TOO_MANY_ROWS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR [TOO_MANY_ROWS]: Múltiples filas obtenidas para el ID ' || p_recinto_id || '.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR INESPERADO: [' || SQLCODE || '] - ' || SQLERRM);
END;
/
```

#### C. Solución Alternativa con `%ROWTYPE` (100% de Puntaje)
```sql
DECLARE
    v_recinto RECINTO%ROWTYPE;
    p_recinto_id RECINTO.recinto_id%TYPE := 1;
BEGIN
    SELECT * INTO v_recinto FROM RECINTO WHERE recinto_id = p_recinto_id;
    DBMS_OUTPUT.PUT_LINE('Recinto: ' || v_recinto.nombre || ' | Capacidad: ' || v_recinto.capacidad_total);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: Recinto inexistente.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: ' || SQLCODE || ' - ' || SQLERRM);
END;
/
```

#### D. Rúbrica de Corrección — Ejercicio 1 (25 Puntos)
- **Declaración del RECORD o %ROWTYPE (7 pts):** Define correctamente la estructura de registro y su variable.
- **Operación SELECT INTO (6 pts):** Consulta de forma correcta cargando en la variable de registro.
- **Despliegue por Consola (4 pts):** Muestra los datos solicitados de forma legible.
- **Manejo de NO_DATA_FOUND (5 pts):** Captura el caso cuando el recinto no existe (`ID 999`) con mensaje claro.
- **Manejo de TOO_MANY_ROWS y WHEN OTHERS (3 pts):** Incluye manejadores defensivos con `SQLCODE`/`SQLERRM`.

---

### Ejercicio Práctico 2 [OPCIONAL / BONUS]: VARRAY y Excepciones

> [!NOTE]
> **Estado:** **EJERCICIO ELIMINADO DE LA EVALUACIÓN OBLIGATORIA.**  
> Si el alumno no lo entrega, **no se descuentan puntos**. Si lo entrega resuelto, se asigna una **bonificación de hasta +0.5 décimas directas en su nota final**.

#### Solución Canónica (para revisión del bonus)
```sql
DECLARE
    TYPE t_bancos_varray IS VARRAY(4) OF CONVENIO_BANCO.banco%TYPE;
    v_bancos t_bancos_varray;
BEGIN
    SELECT banco
    BULK COLLECT INTO v_bancos
    FROM (
        SELECT DISTINCT banco FROM CONVENIO_BANCO WHERE activo = 'S' ORDER BY banco ASC
    )
    WHERE ROWNUM <= 4;

    FOR i IN 1..v_bancos.COUNT LOOP
        DBMS_OUTPUT.PUT_LINE('Convenio Banco #' || i || ': ' || v_bancos(i));
    END LOOP;
EXCEPTION
    WHEN SUBSCRIPT_BEYOND_COUNT THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: Índice fuera del conteo actual.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: [' || SQLCODE || '] - ' || SQLERRM);
END;
/
```

---

### Ejercicio Práctico 3: Cursor Explícito y Cierre Seguro (25 Puntos)

#### A. Solución Canónica (Ciclo Explícito con Cierre Defensivo)
```sql
SET SERVEROUTPUT ON;

DECLARE
    -- 1. Cursor explícito con JOIN relacional
    CURSOR c_tickets_emitidos IS
        SELECT t.codigo_ticket,
               c.nombre || ' ' || c.apellido AS nombre_cliente,
               t.precio_pagado,
               tp.metodo_pago
        FROM TICKET t
        JOIN TRANSACCION_PAGO tp ON t.transaccion_id = tp.transaccion_id
        JOIN RESERVA_TEMPORAL rt ON t.reserva_id = rt.reserva_id
        JOIN CLIENTE c          ON rt.cliente_id = c.cliente_id
        WHERE t.estado = 'EMITIDO'
        ORDER BY t.ticket_id ASC;

    v_ticket          c_tickets_emitidos%ROWTYPE;
    v_contador        NUMBER := 0;
    v_total_recaudado NUMBER(12,2) := 0;

BEGIN
    -- 2. Apertura formal
    OPEN c_tickets_emitidos;

    DBMS_OUTPUT.PUT_LINE('================================================================================');
    DBMS_OUTPUT.PUT_LINE('               REPORTE AUDITADO DE TICKETS EMITIDOS (PUNTOTICKET)');
    DBMS_OUTPUT.PUT_LINE('================================================================================');

    -- 3. Bucle FETCH y verificación %NOTFOUND
    LOOP
        FETCH c_tickets_emitidos INTO v_ticket;
        EXIT WHEN c_tickets_emitidos%NOTFOUND;

        v_contador := v_contador + 1;
        v_total_recaudado := v_total_recaudado + v_ticket.precio_pagado;

        DBMS_OUTPUT.PUT_LINE(
            '[' || LPAD(v_contador, 2, '0') || '] ' ||
            'Código: '  || RPAD(v_ticket.codigo_ticket, 22) || ' | ' ||
            'Cliente: ' || RPAD(v_ticket.nombre_cliente, 20) || ' | ' ||
            'Pago: '    || RPAD(v_ticket.metodo_pago, 16) || ' | ' ||
            'Monto: $'  || TO_CHAR(v_ticket.precio_pagado, 'FM999,999')
        );
    END LOOP;

    -- 4. Cierre formal
    CLOSE c_tickets_emitidos;

    DBMS_OUTPUT.PUT_LINE('================================================================================');
    DBMS_OUTPUT.PUT_LINE('Total Tickets Procesados : ' || v_contador);
    DBMS_OUTPUT.PUT_LINE('Recaudación Total        : $' || TO_CHAR(v_total_recaudado, 'FM999,999'));
    DBMS_OUTPUT.PUT_LINE('================================================================================');

EXCEPTION
    WHEN CURSOR_ALREADY_OPEN THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: El cursor ya se encontraba abierto.');
        IF c_tickets_emitidos%ISOPEN THEN CLOSE c_tickets_emitidos; END IF;

    WHEN INVALID_CURSOR THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: Operación inválida sobre el cursor.');
        IF c_tickets_emitidos%ISOPEN THEN CLOSE c_tickets_emitidos; END IF;

    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR CRÍTICO: [' || SQLCODE || '] - ' || SQLERRM);
        -- Requerimiento clave de la pauta: Liberación segura de recursos
        IF c_tickets_emitidos%ISOPEN THEN
            CLOSE c_tickets_emitidos;
            DBMS_OUTPUT.PUT_LINE('Notificación: El cursor c_tickets_emitidos fue cerrado de forma segura.');
        END IF;
END;
/
```

#### B. Rúbrica de Corrección — Ejercicio 3 (25 Puntos)
- **Declaración del Cursor y JOIN Relacional (9 pts):** Relaciona adecuadamente `TICKET`, `TRANSACCION_PAGO`, `RESERVA_TEMPORAL` y `CLIENTE` con filtro `estado = 'EMITIDO'`.
- **Estructura del Bucle e Iteración (6 pts):** Maneja el ciclo (`OPEN/FETCH/CLOSE` o `FOR IN`) controlando la condición de salida.
- **Despliegue de Datos Formateados (4 pts):** Muestra código de ticket, cliente, método de pago y monto.
- **Cierre Seguro en Sección EXCEPTION (4 pts):** Implementa `IF c_tickets_emitidos%ISOPEN THEN CLOSE c_tickets_emitidos; END IF;`.
- **Manejo de Excepciones del Cursor (2 pts):** Contempla excepciones de cursor y `WHEN OTHERS`.

---

### Ejercicio Práctico 4: Cursor Parametrizado y Excepción de Usuario (26 Puntos)

#### A. Solución Canónica (Cursor con Parámetro y Disparo con RAISE)
```sql
SET SERVEROUTPUT ON;

DECLARE
    -- 1. Declaración de la excepción de usuario
    e_sin_eventos_vigentes EXCEPTION;

    -- 2. Declaración del cursor con parámetro formal
    CURSOR c_eventos_productora (p_productora_id NUMBER) IS
        SELECT e.nombre AS nombre_evento,
               e.fecha_evento,
               e.estado
        FROM EVENTO e
        WHERE e.productora_id = p_productora_id
        ORDER BY e.fecha_evento ASC;

    -- Parámetros de prueba:
    -- Valor 1 (Bizarro) o 2 (Lotus) -> CASO DE ÉXITO (con eventos)
    -- Valor 999                    -> CASO DE EXCEPCIÓN (sin eventos)
    v_productora_id     PRODUCTORA.productora_id%TYPE := 1;
    v_nombre_productora PRODUCTORA.nombre_fantasia%TYPE;
    v_contador_eventos  NUMBER := 0;

BEGIN
    BEGIN
        SELECT nombre_fantasia INTO v_nombre_productora
        FROM PRODUCTORA WHERE productora_id = v_productora_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN v_nombre_productora := 'Productora Desconocida';
    END;

    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('CARTELERA DE EVENTOS - ' || UPPER(v_nombre_productora));
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');

    -- 3. Recorrido pasando el parámetro al cursor
    FOR r_evento IN c_eventos_productora(v_productora_id) LOOP
        v_contador_eventos := v_contador_eventos + 1;
        DBMS_OUTPUT.PUT_LINE(
            '[' || v_contador_eventos || '] Evento: ' || RPAD(r_evento.nombre_evento, 38) ||
            ' | Fecha: ' || TO_CHAR(r_evento.fecha_evento, 'DD/MM/YYYY HH24:MI') ||
            ' | Estado: ' || r_evento.estado
        );
    END LOOP;

    -- 4. Disparo explícito de la excepción de regla de negocio
    IF v_contador_eventos = 0 THEN
        RAISE e_sin_eventos_vigentes;
    END IF;

    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');
    DBMS_OUTPUT.PUT_LINE('Total eventos vigentes: ' || v_contador_eventos);
    DBMS_OUTPUT.PUT_LINE('--------------------------------------------------------------------------------');

EXCEPTION
    -- 5. Manejo de la excepción de usuario
    WHEN e_sin_eventos_vigentes THEN
        DBMS_OUTPUT.PUT_LINE('ALERTA: La productora no registra eventos vigentes en cartelera.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR INESPERADO: [' || SQLCODE || '] - ' || SQLERRM);
END;
/
```

#### B. Rúbrica de Corrección — Ejercicio 4 (26 Puntos)
- **Declaración del Cursor Parametrizado (8 pts):** Declara `CURSOR c_eventos_productora(p_id NUMBER)` con filtro `WHERE productora_id = p_id`.
- **Declaración de Excepción de Usuario (4 pts):** Declara `e_sin_eventos_vigentes EXCEPTION;` en la sección `DECLARE`.
- **Condición de Disparo con RAISE (7 pts):** Evalúa la ausencia de filas (contador = 0 o `%NOTFOUND`) y dispara `RAISE e_sin_eventos_vigentes;`.
- **Manejador WHEN e_sin_eventos_vigentes THEN (5 pts):** Atrapa la excepción mostrando el mensaje de alerta exacto.
- **Manejador WHEN OTHERS (2 pts):** Maneja errores imprevistos con `SQLCODE` y `SQLERRM`.

---

## 5. Hoja de Verificación Rápida para Laboratorio (Menos de 1 Minuto por Alumno)

| Ejercicio | Parámetro a Modificar | Valor Caso ÉXITO | Salida Esperada en Pantalla | Valor Caso ERROR | Salida Esperada de Excepción |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **Ej. 1: RECORD** | `p_recinto_id` | `1` | Nombre: *Movistar Arena*<br>Capacidad: *15.000* | `999` | *"ERROR: El recinto ID 999 no existe..."* |
| **Ej. 3: CURSOR** | *(Ejecución directa)* | N/A | 4 tickets listados:<br>Valentina, Diego, Antonia, Sebastián<br>Total: *$443.145* | N/A | Verificar visualmente en código:<br>`IF c_tickets_emitidos%ISOPEN THEN CLOSE...` |
| **Ej. 4: PARÁMETRO** | `v_productora_id` | `1` o `2` | Muestra evento:<br>ID 1: *Bad Bunny*<br>ID 2: *Lollapalooza* | `999` | *"ALERTA: La productora no registra eventos vigentes en cartelera."* |

---

## 6. Archivo SQL de Pruebas Adjunto
Para correr las pruebas completas de forma automatizada en SQL Developer, ejecute el script:  
[`solucionario_formativa_1.sql`](file:///Users/hachimaki/Desktop/2026%202%20semestre/Taller%20de%20bases%20de%20datos/plataforma-docente/solucionario_formativa_1.sql)
