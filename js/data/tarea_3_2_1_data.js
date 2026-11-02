// tarea_3_2_1_data.js — Tarea: Tu Perfil en el Directorio de Talento
// Unidad 3.2 — Sesión 1. Solo dice QUÉ lograr y QUÉ entregar; el CÓMO está en la presentación.

const tarea_3_2_1_data = {
    id: 'tarea-3-2-1',
    title: 'Tarea: Tu Perfil en el Directorio de Talento',
    subtitle: 'MongoDB Atlas — trabajo individual',
    sessionId: '3-2-1',
    sessionLabel: 'Presentación de la Sesión 3.2.1',

    doText: 'Crear tu perfil profesional como un documento en MongoDB Atlas y usar el directorio compartido para <strong>crear, buscar, actualizar y eliminar</strong> datos.',
    deliverText: 'Un <strong>PPT con una captura por misión</strong> (evidencia de que lo hiciste tú), enviado por mensaje en <strong>AVA</strong> al docente <strong>Carlos Orellana</strong>, con copia al correo.',
    meta: [
        { icon: 'ph-user', label: 'Individual' },
        { icon: 'ph-clock', label: '40 minutos de clase' },
        { icon: 'ph-calendar-x', label: 'Sin fecha de entrega' },
        { icon: 'ph-seal-warning', label: 'Sin nota' }
    ],

    help: 'Todos los contenidos que necesitas para lograr cada misión están en la presentación de la sesión. Revísala y vuelve aquí.',

    connection: {
        user: 'user_bd_cv_todas_las_secciones',
        host: 'sandboxprofecarlos.msifp5s.mongodb.net',
        uri: 'mongodb+srv://user_bd_cv_todas_las_secciones:<db_password>@sandboxprofecarlos.msifp5s.mongodb.net/',
        database: 'directorio_talento',
        collection: 'perfiles',
        note: 'La clave te la entrega el docente por mensaje. No la publiques ni la dejes visible en tus capturas.'
    },

    firstNote: 'Si eres de los primeros en llegar, puede que la base de datos y la colección aún no existan: te toca crearlas a ti. Si ya existen, úsalas con exactamente los mismos nombres.',

    missions: [
        {
            id: 'm1', title: 'Conéctate',
            what: 'Conéctate al cluster desde VS Code y abre un Playground de trabajo.',
            evidence: 'Panel de MongoDB con la conexión activa y tu Playground abierto.'
        },
        {
            id: 'm2', title: 'Explora el terreno',
            what: 'Averigua cuántos perfiles hay actualmente en la colección <code>perfiles</code> de la base <code>directorio_talento</code>.',
            evidence: 'Tu instrucción y su resultado.'
        },
        {
            id: 'm3', title: 'Crea tu perfil',
            what: 'Guarda <strong>un solo documento</strong> con tu perfil, que incluya: <code>alumno</code>, <code>seccion</code>, <code>carrera</code>, <code>skills</code> (mínimo 3), <code>estudios</code> (al menos 1) y <code>fecha_registro</code> con la fecha actual. Usa tus datos reales.',
            evidence: 'Tu instrucción y el resultado que muestra el Playground.'
        },
        {
            id: 'm4', title: 'Busca tu perfil',
            what: 'Encuentra tu propio documento y muéstralo completo.',
            evidence: 'Tu consulta y el documento devuelto.'
        },
        {
            id: 'm5', title: 'Busca talento',
            what: 'Encuentra a los compañeros que sepan <strong>al menos una</strong> de dos skills que tú elijas.',
            evidence: 'Tu consulta y sus resultados.'
        },
        {
            id: 'm6', title: 'Arma una lista de talento',
            what: 'Muestra solo <code>alumno</code>, <code>seccion</code> y <code>skills</code> (sin el identificador interno), ordenados de la A a la Z, con un máximo de 10 resultados.',
            evidence: 'Tu consulta y la lista resultante.'
        },
        {
            id: 'm7', title: 'Actualiza tu perfil',
            what: 'Agrega una skill nueva <strong>sin reemplazar</strong> las que ya tienes, y agrega un campo que antes no existía en tu documento (por ejemplo, <code>disponibilidad</code> o <code>links</code>).',
            evidence: 'Tu perfil antes y después de actualizarlo, y las instrucciones usadas.'
        },
        {
            id: 'm8', title: 'Crea un documento de prueba',
            what: 'Guarda un segundo documento de prueba, con <code>alumno</code> igual a <code>"PRUEBA - Tu Nombre Completo"</code>, para practicar la eliminación sin afectar a nadie.',
            evidence: 'Tu instrucción y la comprobación de que el documento de prueba existe.'
        },
        {
            id: 'm9', title: 'Elimina tu documento de prueba',
            what: 'Elimina <strong>solo</strong> ese documento de prueba y comprueba que ya no existe y que tu perfil real sigue en la colección.',
            evidence: 'Tu instrucción de eliminación y las dos comprobaciones.'
        }
    ],

    extras: [
        { id: 'x1', title: 'Portafolio', what: 'Agrega a tu perfil un proyecto con <code>nombre</code>, <code>descripcion</code>, <code>tecnologias</code> y <code>url</code>.' },
        { id: 'x2', title: 'Más talento', what: 'Agrega a tu perfil <code>certificaciones</code> o <code>idiomas</code>, como lista de objetos.' },
        { id: 'x3', title: 'Práctica disponible', what: 'Encuentra perfiles disponibles para práctica que sepan una skill de tu elección.' },
        { id: 'x4', title: 'Dominio total', what: 'Encuentra compañeros que sepan <strong>todas</strong> las skills de una lista que tú definas.' },
        { id: 'x5', title: 'Cuántos tienen GitHub', what: 'Cuenta cuántos perfiles del directorio tienen un enlace a GitHub.' },
        { id: 'x6', title: 'Tu propia pregunta', what: 'Inventa una pregunta de negocio sobre el directorio (por ejemplo, "¿quién tiene experiencia laboral?") y resuélvela con una consulta.' }
    ],
    extrasNote: 'Cada desafío extra se evidencia con una captura (consulta y resultado), en diapositivas adicionales del mismo PPT.',

    rules: [
        'Todo el curso usa el mismo usuario y la misma colección: puedes borrar o modificar datos de otros por error.',
        'Solo modifica o elimina documentos que sean tuyos.',
        'En toda modificación o eliminación, el filtro debe identificar solo tu documento.',
        'Nunca borres ni modifiques "todo": evita filtros vacíos y no elimines la colección.',
        'No subas RUT, teléfono, dirección ni fecha de nacimiento.'
    ],

    delivery: {
        steps: [
            'Crea un PPT con una portada (tu nombre y sección).',
            'Agrega una diapositiva por misión, con el número y nombre de la misión como título y la captura correspondiente.',
            'Si hiciste desafíos extra, agrega una diapositiva por cada uno.',
            'Revisa que ninguna captura muestre tu clave.',
            'Envía el PPT por mensaje en AVA al docente Carlos Orellana, con copia al correo.'
        ],
        checks: [
            { id: 'd1', label: 'Mi PPT tiene una captura por cada misión' },
            { id: 'd2', label: 'Ninguna captura muestra mi clave' },
            { id: 'd3', label: 'Envié el PPT por AVA al docente Carlos Orellana, con copia al correo' }
        ]
    }
};

