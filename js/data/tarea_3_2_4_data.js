// tarea_3_2_4_data.js — Tarea 4: Gestión en Vivo de Ofertas y Postulaciones (CRUD Completo)
// Unidad 3.2 — Sesión 4: updateOne, updateMany, $set, $inc, $unset, $addToSet, $pull, deleteOne y deleteMany.

const tarea_3_2_4_data = {
    id: 'tarea-3-2-4',
    title: 'Tarea 4: Gestión en Vivo de Ofertas y Postulaciones',
    subtitle: 'MongoDB Atlas — actualizar en lote, modificar arreglos y eliminar con filtros seguros',
    sessionId: '3-2-4',
    sessionLabel: 'Presentación de la Sesión 3.2.4',

    doText: 'Crear tus registros en la colección <code>postulaciones</code> y practicar operaciones de actualización (<code>updateOne</code>, <code>updateMany</code> con <code>$set</code>, <code>$inc</code>, <code>$unset</code>, <code>$addToSet</code> y <code>$pull</code>) y eliminación segura (<code>deleteOne</code> y <code>deleteMany</code>) sobre tus propios documentos.',
    deliverText: 'Un <strong>PPT con capturas de pantalla</strong> de cada misión (mostrando la instrucción ejecutada y el documento antes/después), enviado por mensaje en <strong>AVA</strong> al docente <strong>Carlos Orellana</strong>, con copia al correo.',
    meta: [
        { icon: 'ph-user', label: 'Individual' },
        { icon: 'ph-clock', label: '40 minutos de práctica' },
        { icon: 'ph-arrows-clockwise', label: 'CRUD Completo (Update & Delete)' },
        { icon: 'ph-seal-warning', label: 'Siempre filtra por tu "creado_por"' }
    ],

    help: 'Revisa la presentación de la Sesión 3.2.4: ahí están los ejemplos exactos de $set, $inc, $unset, $addToSet, $pull y deleteMany. Para los desafíos opcionales, revisa las 3 diapositivas finales de Contenido Extra.',

    connection: {
        user: 'user_bd_cv_todas_las_secciones',
        host: 'sandboxprofecarlos.msifp5s.mongodb.net',
        uri: 'mongodb+srv://user_bd_cv_todas_las_secciones:<db_password>@sandboxprofecarlos.msifp5s.mongodb.net/',
        database: 'directorio_talento',
        collection: 'ofertas y postulaciones',
        note: 'Recuerda no mostrar tu contraseña en las capturas de pantalla.'
    },

    firstNote: 'Regla fundamental: en todo updateOne, updateMany, deleteOne o deleteMany, tu filtro DEBE llevar siempre "creado_por": "Tu Nombre Completo". Así solo modificas o eliminas tus propios registros.',

    missions: [
        {
            id: 'm1', title: 'Crea tus 3 postulaciones con insertMany()',
            what: 'En la colección <code>postulaciones</code>, inserta <strong>3 documentos</strong> usando <code>insertMany([ ... ])</code> (2 postulaciones reales y 1 de prueba llamada <code>"PRUEBA - ..."</code>). Cada una debe tener: <code>candidato</code>, <code>cargo_postulado</code>, <code>estado</code> (<code>"en_revision"</code> o <code>"descartado"</code>), <code>puntaje_tecnico</code> (número), <code>etapas_completadas</code> (arreglo), <code>nota_interna</code> (texto en al menos una) y <code>creado_por</code> (tu nombre completo). Comenta el <code>insertMany</code> luego de ejecutarlo.',
            evidence: 'Tu insertMany y la consulta find({ "creado_por": "Tu Nombre" }) mostrando tus 3 postulaciones.'
        },
        {
            id: 'm2', title: 'Actualiza estados con updateOne() y updateMany() ($set)',
            what: 'Realiza dos actualizaciones con <code>$set</code> filtrando siempre por tu <code>creado_por</code>: <strong>(a)</strong> con <code>updateOne</code>, cambia el <code>estado</code> de uno de tus candidatos a <code>"entrevista"</code> y agrégale el campo <code>"modalidad_entrevista": "online"</code>; <strong>(b)</strong> con <code>updateMany</code>, agrega el campo <code>"beneficio_colacion": true</code> a todas tus ofertas en <code>ofertas</code> que tengan <code>"activa": true</code>.',
            evidence: 'Tus dos instrucciones (updateOne y updateMany) y una consulta find que compruebe los cambios.'
        },
        {
            id: 'm3', title: 'Suma y resta valores numéricos con $inc',
            what: 'Aplica dos ajustes numéricos con <code>$inc</code> sobre tus registros: <strong>(a)</strong> sube el <code>sueldo</code> en <code>+100000</code> a todas tus ofertas de modalidad <code>"remoto"</code> (con <code>updateMany</code>), y <strong>(b)</strong> descuenta <code>-1</code> al campo <code>vacantes</code> de una de tus ofertas (con <code>updateOne</code>) simulando una contratación.',
            evidence: 'Tus instrucciones con $inc y la comprobación de los nuevos montos de sueldo y vacantes.'
        },
        {
            id: 'm4', title: 'Elimina un campo temporal con $unset',
            what: 'Usa <code>updateOne</code> con el operador <code>$unset</code> para borrar por completo el campo <code>nota_interna</code> de la postulación donde lo habías incluido, verificando que el resto del documento sigue intacto.',
            evidence: 'Tu instrucción con $unset y el documento resultante ya sin el campo nota_interna.'
        },
        {
            id: 'm5', title: 'Agrega y quita elementos en arreglos ($addToSet y $pull)',
            what: 'Modifica listas en tus documentos: <strong>(a)</strong> usa <code>$addToSet</code> para agregar una nueva etapa (como <code>"Entrevista Técnica"</code>) a <code>etapas_completadas</code> de un candidato (o una tecnología nueva a <code>requisitos</code> de una oferta), y <strong>(b)</strong> usa <code>$pull</code> para quitar un requisito específico de una de tus ofertas.',
            evidence: 'Tus instrucciones con $addToSet y $pull y cómo quedaron los arreglos después del cambio.'
        },
        {
            id: 'm6', title: 'Eliminación controlada con deleteOne() y deleteMany()',
            what: 'Limpia tus registros obsoletos filtrando siempre por tu <code>creado_por</code>: <strong>(a)</strong> usa <code>deleteOne</code> para borrar tu postulación <code>"PRUEBA - ..."</code>, y <strong>(b)</strong> usa <code>deleteMany</code> para eliminar tus ofertas que estén inactivas (<code>"activa": false</code>) y sin vacantes (<code>"vacantes": 0</code>).',
            evidence: 'Tus instrucciones deleteOne y deleteMany y una consulta find que demuestre que tus demás registros siguen ahí.'
        }
    ],

    extras: [
        { id: 'x1', title: 'Renombrar un campo en lote ($rename)', what: 'Usa <code>updateMany</code> con <code>$rename</code> sobre tus documentos en <code>postulaciones</code> para cambiar el nombre del campo <code>"cargo_postulado"</code> a <code>"cargo"</code> sin perder su valor.' },
        { id: 'x2', title: 'Agregar múltiples requisitos de una vez ($each)', what: 'Combina <code>$addToSet</code> con <code>$each: [ ... ]</code> para agregar 3 tecnologías nuevas en un solo paso al arreglo <code>requisitos</code> de una de tus ofertas.' },
        { id: 'x3', title: 'Crear o actualizar sin duplicar ({ upsert: true })', what: 'Ejecuta un <code>updateOne</code> con tercer parámetro <code>{ upsert: true }</code> para una oferta nueva tuya (ej. <code>"Arquitecto Cloud"</code>) y comprueba que aunque lo ejecutes 2 veces solo se crea 1 documento.' }
    ],
    extrasNote: 'Si realizas alguno de estos desafíos extra, incluye su captura al final de tu PPT.',

    rules: [
        'Toda instrucción updateOne, updateMany, deleteOne o deleteMany DEBE incluir "creado_por": "Tu Nombre Completo" en su filtro.',
        'Prohibido ejecutar updateMany({}, ...) o deleteMany({}) con el filtro vacío.',
        'Antes de ejecutar un deleteMany, prueba el mismo filtro con find() para verificar qué documentos afectará.',
        'No muestres tu contraseña en las capturas.'
    ],

    delivery: {
        steps: [
            'Crea un PPT con tu nombre y sección en la portada.',
            'Agrega una diapositiva por misión con la captura de tu código ejecutado y la comprobación del resultado.',
            'Si resolviste desafíos extra ($rename, $each o upsert), agrégalos al final.',
            'Envía tu PPT por mensaje en AVA al docente Carlos Orellana, con copia a su correo.'
        ],
        checks: [
            { id: 'd1', label: 'Verifiqué que todos mis updates y deletes filtraran por mi nombre en "creado_por"' },
            { id: 'd2', label: 'Mi PPT incluye las capturas de las 6 misiones' },
            { id: 'd3', label: 'Envié el PPT por AVA al docente Carlos Orellana con copia al correo' }
        ]
    }
};

