// tarea_3_2_3_data.js — Tarea 3: El Buscador de Ofertas Laborales TI
// Unidad 3.2 — Sesión 3: Poblar nuevas colecciones con insertMany y consultar con operadores de comparación y lógicos.

const tarea_3_2_3_data = {
    id: 'tarea-3-2-3',
    title: 'Tarea 3: El Buscador de Ofertas Laborales TI',
    subtitle: 'MongoDB Atlas — crear colecciones, insertar por lotes y dominar operadores de búsqueda',
    sessionId: '3-2-3',
    sessionLabel: 'Presentación de la Sesión 3.2.3',

    doText: 'Poblar las colecciones <code>empresas</code> y <code>ofertas</code> con tu propio lote de documentos usando <code>insertMany()</code> y resolver búsquedas combinando operadores numéricos (<code>$gt</code>, <code>$gte</code>, <code>$lt</code>, <code>$lte</code>, <code>$ne</code>) y lógicos (<code>$in</code>, <code>$nin</code>, <code>$or</code>).',
    deliverText: 'Un <strong>PPT con capturas de pantalla</strong> de cada misión (mostrando tu instrucción ejecutada y su resultado), enviado por mensaje en <strong>AVA</strong> al docente <strong>Carlos Orellana</strong>, con copia al correo.',
    meta: [
        { icon: 'ph-user', label: 'Individual' },
        { icon: 'ph-clock', label: '40 minutos de práctica' },
        { icon: 'ph-database', label: 'Colecciones: empresas y ofertas' },
        { icon: 'ph-seal-warning', label: 'Evidencia de clase' }
    ],

    help: 'Revisa la presentación de la Sesión 3.2.3: ahí tienes el traductor de SQL a MongoDB y ejemplos de cada operador. Para los desafíos opcionales, mira las últimas 3 diapositivas de Contenido Extra.',

    connection: {
        user: 'user_bd_cv_todas_las_secciones',
        host: 'sandboxprofecarlos.msifp5s.mongodb.net',
        uri: 'mongodb+srv://user_bd_cv_todas_las_secciones:<db_password>@sandboxprofecarlos.msifp5s.mongodb.net/',
        database: 'directorio_talento',
        collection: 'empresas y ofertas',
        note: 'Usa la misma conexión a directorio_talento. Recuerda no mostrar tu contraseña en ninguna captura.'
    },

    firstNote: 'Importante: cada documento que insertes debe llevar el campo "creado_por" con TU nombre completo. Así identificarás tus registros sin confundirlos con los de otras secciones. Apenas ejecutes un insertMany, coméntalo con // para no duplicar.',

    missions: [
        {
            id: 'm1', title: 'Registra 2 empresas con insertMany()',
            what: 'En la colección <code>empresas</code> de <code>directorio_talento</code>, inserta de una sola vez <strong>2 empresas</strong> inventadas por ti usando <code>insertMany([ ... ])</code>. Cada empresa debe tener: <code>nombre</code>, <code>rubro</code>, <code>empleados</code> (número), <code>ciudad</code> y <code>creado_por</code> (tu nombre completo). Luego comprueba tus 2 empresas con <code>find({ "creado_por": "Tu Nombre" })</code>.',
            evidence: 'Tu insertMany ejecutado y la consulta find mostrando tus 2 empresas creadas.'
        },
        {
            id: 'm2', title: 'Publica 4 ofertas laborales con insertMany()',
            what: 'En la colección <code>ofertas</code>, inserta de una vez <strong>4 ofertas laborales variadas</strong> usando <code>insertMany([ ... ])</code>. Cada oferta debe incluir: <code>cargo</code>, <code>empresa</code>, <code>modalidad</code> (usa <code>"remoto"</code>, <code>"híbrido"</code> y <code>"presencial"</code>), <code>sueldo</code> (varía entre $450.000 y $1.800.000), <code>vacantes</code> (pon al menos una con <code>0</code> y otras con <code>2</code> o más), <code>activa</code> (<code>true</code> o <code>false</code>), <code>requisitos</code> (arreglo de tecnologías), <code>ubicacion</code> (objeto con <code>ciudad</code> y <code>comuna</code>) y <code>creado_por</code> (tu nombre).',
            evidence: 'Tu insertMany y la comprobación con find({ "creado_por": "Tu Nombre" }).'
        },
        {
            id: 'm3', title: 'Filtra por sueldo y rango (el BETWEEN de Mongo)',
            what: 'Escribe dos consultas sobre <code>ofertas</code>: <strong>(a)</strong> ofertas con <code>sueldo</code> mayor o igual (<code>$gte</code>) a <code>1000000</code>, y <strong>(b)</strong> ofertas cuyo <code>sueldo</code> esté en el rango entre <code>500000</code> y <code>1200000</code> (combinando <code>$gte</code> y <code>$lte</code> en el mismo campo).',
            evidence: 'Tus dos consultas de comparación numérica y sus resultados.'
        },
        {
            id: 'm4', title: 'Incluye y excluye con $in, $nin y $ne',
            what: 'Escribe dos consultas sobre <code>ofertas</code>: <strong>(a)</strong> ofertas cuya <code>modalidad</code> sea distinta de <code>"presencial"</code> (usando <code>$ne</code>) y que pidan en <code>requisitos</code> alguna tecnología de una lista de 2 opciones (usando <code>$in</code>), y <strong>(b)</strong> ofertas que <strong>no</strong> pidan en <code>requisitos</code> un par de tecnologías que tú elijas (usando <code>$nin</code>).',
            evidence: 'Tus dos consultas con $ne, $in y $nin y los documentos devueltos.'
        },
        {
            id: 'm5', title: 'Combina condiciones obligatorias (AND) con alternativas ($or)',
            what: 'Escribe una consulta sobre <code>ofertas</code> que busque avisos que estén <strong>activos</strong> (<code>"activa": true</code>), tengan <strong>vacantes mayores a 0</strong> (<code>$gt: 0</code>), y que además cumplan <strong>al menos una</strong> de estas dos condiciones con <code>$or</code>: que su <code>modalidad</code> sea <code>"remoto"</code> <strong>O</strong> que su <code>sueldo</code> sea mayor o igual a <code>1300000</code>.',
            evidence: 'Tu consulta combinando AND implícito con $or y su resultado.'
        },
        {
            id: 'm6', title: 'Arma el Ranking Top 5 de Ofertas Activas',
            what: 'Consulta las ofertas con <code>"activa": true</code> mostrando únicamente <code>cargo</code>, <code>empresa</code>, <code>modalidad</code> y <code>sueldo</code> (ocultando <code>_id</code>), ordenadas por <code>sueldo</code> de mayor a menor (<code>-1</code>) y limitando el resultado a 5 documentos.',
            evidence: 'Tu consulta con proyección, sort y limit, y la lista limpia del Top 5.'
        }
    ],

    extras: [
        { id: 'x1', title: 'Cantidad exacta de requisitos ($size)', what: 'Usa el operador <code>$size</code> para encontrar todas las ofertas de la colección que pidan exactamente <strong>2</strong> o <strong>3</strong> requisitos en su arreglo.' },
        { id: 'x2', title: 'Búsqueda precisa en subdocumentos ($elemMatch)', what: 'En la colección <code>perfiles</code> o en una oferta a la que le agregues un arreglo de objetos (como <code>idiomas</code>), usa <code>$elemMatch</code> para buscar que dos campos coincidan dentro del mismo elemento del arreglo.' },
        { id: 'x3', title: 'Segunda página del portal (.skip)', what: 'Construye la consulta para ver la "Página 2" del ranking de ofertas (saltando las primeras 5 con <code>.skip(5)</code> y mostrando las siguientes 5 con <code>.limit(5)</code>).' }
    ],
    extrasNote: 'Si realizas alguno de estos desafíos usando el Contenido Extra del final de las diapositivas, agrégalo al cierre de tu PPT.',

    rules: [
        'Incluye siempre el campo "creado_por" con tu nombre completo en cada empresa y oferta que insertes.',
        'Apenas ejecutes tu insertMany() una vez, coméntalo con // para no llenar la colección con copias repetidas al presionar Play.',
        'Hoy solo insertamos nuestros propios registros y hacemos consultas de lectura (find, findOne, countDocuments).',
        'Verifica que tu contraseña no aparezca en ninguna captura.'
    ],

    delivery: {
        steps: [
            'Crea un PPT con tu nombre y sección en la portada.',
            'Agrega una diapositiva por misión mostrando tu código en el Playground y el resultado obtenido.',
            'Si resolviste desafíos extra ($size, $elemMatch o .skip), súmalos al final.',
            'Envía tu PPT por mensaje en AVA al docente Carlos Orellana, con copia a su correo.'
        ],
        checks: [
            { id: 'd1', label: 'Inserté mis empresas y ofertas con mi nombre en "creado_por" y comenté el insertMany' },
            { id: 'd2', label: 'Mi PPT tiene las capturas de las 6 misiones (y extras si hice)' },
            { id: 'd3', label: 'Envié el PPT por AVA al docente Carlos Orellana con copia al correo' }
        ]
    }
};

