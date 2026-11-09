// tarea_3_2_5_data.js — Tarea 5: Reportes y Estadísticas del Portal de Empleo (Aggregate)
// Unidad 3.2 — Sesión 5: Consultas de agrupación y resumen con aggregate ($match, $group, $sum, $avg, $min, $max, $sort).

const tarea_3_2_5_data = {
    id: 'tarea-3-2-5',
    title: 'Tarea 5: Reportes y Estadísticas del Portal de Empleo',
    subtitle: 'MongoDB Atlas — consultas de resumen y agrupación con aggregate()',
    sessionId: '3-2-5',
    sessionLabel: 'Presentación de la Sesión 3.2.5',

    doText: 'Construir reportes estadísticos sobre las colecciones del portal (<code>ofertas</code>, <code>empresas</code>, <code>postulaciones</code> y <code>perfiles</code>) utilizando <code>aggregate([ ... ])</code> con las etapas <code>$match</code>, <code>$group</code> (<code>$sum</code>, <code>$avg</code>, <code>$min</code>, <code>$max</code>) y <code>$sort</code>.',
    deliverText: 'Un <strong>PPT con capturas de pantalla</strong> de cada misión (mostrando tu pipeline de agregación ejecutado y el resumen resultante), enviado por mensaje en <strong>AVA</strong> al docente <strong>Carlos Orellana</strong>, con copia al correo.',
    meta: [
        { icon: 'ph-user', label: 'Individual' },
        { icon: 'ph-clock', label: '40 minutos de práctica' },
        { icon: 'ph-chart-bar', label: 'Solo lectura y reportes (aggregate)' },
        { icon: 'ph-seal-warning', label: 'Evidencia de clase' }
    ],

    help: 'Revisa la presentación de la Sesión 3.2.5 para ver la traducción paso a paso desde el GROUP BY de SQL a aggregate(). Para los desafíos opcionales ($unwind, $project y $lookup), revisa las últimas 3 diapositivas de Contenido Extra.',

    connection: {
        user: 'user_bd_cv_todas_las_secciones',
        host: 'sandboxprofecarlos.msifp5s.mongodb.net',
        uri: 'mongodb+srv://user_bd_cv_todas_las_secciones:<db_password>@sandboxprofecarlos.msifp5s.mongodb.net/',
        database: 'directorio_talento',
        collection: 'ofertas, empresas, postulaciones y perfiles',
        note: 'Recuerda no mostrar tu contraseña en ninguna captura.'
    },

    firstNote: 'En esta sesión todas las consultas son de lectura y análisis con aggregate(): puedes ejecutarlas tanto sobre toda la colección del curso como filtrando primero tus registros con $match.',

    missions: [
        {
            id: 'm1', title: 'Contar ofertas por modalidad ($group + $sum: 1)',
            what: 'En la colección <code>ofertas</code>, usa <code>aggregate()</code> con una etapa <code>$group</code> para contar <strong>cuántas ofertas existen en cada <code>modalidad</code></strong> (<code>"remoto"</code>, <code>"híbrido"</code>, <code>"presencial"</code>).',
            evidence: 'Tu consulta aggregate y el resultado mostrando el total de ofertas por modalidad.'
        },
        {
            id: 'm2', title: 'Total de vacantes y sueldo promedio por modalidad ($sum y $avg)',
            what: 'Amplía tu agrupación por <code>modalidad</code> en <code>ofertas</code> para mostrar en un mismo reporte: <strong>(a)</strong> cantidad de ofertas (<code>{ $sum: 1 }</code>), <strong>(b)</strong> suma total de <code>vacantes</code> (<code>{ $sum: "$vacantes" }</code>) y <strong>(c)</strong> sueldo promedio (<code>{ $avg: "$sueldo" }</code>).',
            evidence: 'Tu consulta con los 3 acumuladores y el resultado en pantalla.'
        },
        {
            id: 'm3', title: 'Sueldo mínimo y máximo por empresa ($min y $max)',
            what: 'En la colección <code>ofertas</code>, agrupa por el campo <code>"$empresa"</code> y calcula cuántas ofertas publicó cada empresa, cuál es su <strong>sueldo mínimo</strong> (<code>$min</code>) y cuál es su <strong>sueldo máximo</strong> (<code>$max</code>).',
            evidence: 'Tu consulta agrupando por empresa con $min y $max y su resultado.'
        },
        {
            id: 'm4', title: 'Pipeline completo: filtrar activas ($match) + agrupar ($group) + ordenar ($sort)',
            what: 'Construye un pipeline de 3 etapas sobre <code>ofertas</code>: <strong>1)</strong> filtra solo las ofertas con <code>"activa": true</code> usando <code>$match</code>, <strong>2)</strong> agrupa por <code>"$modalidad"</code> calculando el sueldo promedio, y <strong>3)</strong> ordena los grupos de mayor a menor sueldo promedio usando <code>$sort</code>.',
            evidence: 'Tu pipeline con las 3 etapas ($match, $group y $sort) y el reporte ordenado.'
        },
        {
            id: 'm5', title: 'Resumen de postulaciones por estado',
            what: 'En la colección <code>postulaciones</code>, usa <code>aggregate()</code> para agrupar por <code>"$estado"</code>, mostrando cuántos candidatos hay en cada estado (<code>{ $sum: 1 }</code>) y cuál es el promedio de su <code>puntaje_tecnico</code> (<code>{ $avg: "$puntaje_tecnico" }</code>).',
            evidence: 'Tu consulta sobre postulaciones y el resumen por estado.'
        },
        {
            id: 'm6', title: 'Estadística general de empresas por ciudad',
            what: 'En la colección <code>empresas</code>, agrupa por <code>"$ciudad"</code> para mostrar cuántas empresas hay registradas en cada ciudad y cuántos <code>empleados</code> suman en total (<code>{ $sum: "$empleados" }</code>), ordenando de mayor a menor cantidad de empresas.',
            evidence: 'Tu consulta sobre empresas y el ranking por ciudad.'
        }
    ],

    extras: [
        { id: 'x1', title: 'Top 5 de requisitos más pedidos ($unwind)', what: 'Usa <code>{ $unwind: "$requisitos" }</code> seguido de <code>$group</code>, <code>$sort</code> y <code>$limit: 5</code> en <code>ofertas</code> para descubrir cuáles son las 5 tecnologías más solicitadas del portal.' },
        { id: 'x2', title: 'Reporte limpio sin decimales ($project + $round)', what: 'Agrega una etapa <code>$project</code> al final de tu reporte de sueldos promedios para ocultar <code>_id</code> y redondear el promedio a 0 decimales con <code>$round</code>.' },
        { id: 'x3', title: 'Cruzar ofertas con los datos de su empresa ($lookup)', what: 'Usa una etapa <code>$lookup</code> desde <code>ofertas</code> hacia <code>empresas</code> (uniendo <code>localField: "empresa"</code> con <code>foreignField: "nombre"</code>) para ver en un mismo resultado la oferta junto con el rubro y número de empleados de la empresa.' }
    ],
    extrasNote: 'Si realizas alguno de estos desafíos extra, suma su captura al final de tu PPT.',

    rules: [
        'Recuerda escribir siempre el signo $ antes del nombre del campo cuando va a la derecha de los dos puntos (ej: _id: "$modalidad", { $avg: "$sueldo" }).',
        'No modifiques ni elimines documentos durante esta sesión.',
        'Revisa que tu contraseña no aparezca en ninguna captura.'
    ],

    delivery: {
        steps: [
            'Crea un PPT con tu nombre y sección en la portada.',
            'Agrega una diapositiva por misión con tu código de aggregate() y el resultado obtenido.',
            'Si resolviste desafíos extra ($unwind, $project o $lookup), agrégalos al final.',
            'Envía tu PPT por mensaje en AVA al docente Carlos Orellana, con copia a su correo.'
        ],
        checks: [
            { id: 'd1', label: 'Completé las 6 misiones de reportes con aggregate()' },
            { id: 'd2', label: 'Ninguna captura muestra mi contraseña' },
            { id: 'd3', label: 'Envié el PPT por AVA al docente Carlos Orellana con copia al correo' }
        ]
    }
};

