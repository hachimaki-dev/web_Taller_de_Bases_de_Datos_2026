// course-structure.js — Estructura del curso
// Para agregar una nueva sesión, copiar un bloque de sessions y crear los archivos de datos correspondientes.

const courseStructure = {
    courseName: 'Taller de Bases de Datos',
    modules: [
        {
            id: '1-2',
            title: '1.2 Cursores y Ciclos Anidados',
            sessions: [
                {
                    id: '1-2-1',
                    title: 'Sesión 1: Cursores Complejos',
                    slidesFile: 's1_2_1_slides',
                    exercisesFile: 's1_2_1_exercises',
                    solutionsFile: 's1_2_1_solutions'
                },
                {
                    id: '1-2-2',
                    title: 'Sesión 2: Ciclos Anidados',
                    slidesFile: 's1_2_2_slides',
                    exercisesFile: 's1_2_2_exercises',
                    solutionsFile: 's1_2_2_solutions'
                }
            ]
        },
        {
            id: '1-3',
            title: '1.3 Excepciones',
            sessions: [
                {
                    id: '1-3-1',
                    title: 'Sesión 1: Excepciones Predefinidas',
                    slidesFile: 's1_3_1_slides',
                    exercisesFile: 's1_3_1_exercises',
                    solutionsFile: 's1_3_1_solutions'
                },
                {
                    id: '1-3-2',
                    title: 'Sesión 2: Excepciones Definidas por el Usuario',
                    slidesFile: 's1_3_2_slides',
                    exercisesFile: 's1_3_2_exercises',
                    solutionsFile: 's1_3_2_solutions'
                }
            ]
        },
        {
            id: '1-4',
            title: '1.4 Evaluaciones Prácticas',
            sessions: [
                {
                    id: '1-4-1',
                    title: 'Sesión 1: Evaluación Proc, Func y Packages',
                    slidesFile: 's1_4_1_slides',
                    exercisesFile: 's1_4_1_exercises',
                    solutionsFile: 's1_4_1_solutions'
                },
                {
                    id: '1-4-2',
                    title: 'Sesión 2: Evaluación Triggers',
                    slidesFile: 's1_4_2_slides',
                    exercisesFile: 's1_4_2_exercises',
                    solutionsFile: 's1_4_2_solutions'
                }
            ]
        },
        {
            id: '2-1',
            title: '2.1 Procedimientos Almacenados y Funciones',
            sessions: [
                {
                    id: '2-1-1',
                    title: 'Sesión 1: Fundamentos de Proc y Func',
                    slidesFile: 's2_1_1_slides',
                    exercisesFile: 's2_1_1_exercises',
                    solutionsFile: 's2_1_1_solutions'
                },
                {
                    id: '2-1-2',
                    title: 'Sesión 2: Casos Prácticos con Punto Ticket',
                    slidesFile: 's2_1_2_slides',
                    exercisesFile: 's2_1_2_exercises',
                    solutionsFile: 's2_1_2_solutions'
                }
            ]
        },
        {
            id: '2-2',
            title: '2.2 Triggers',
            sessions: [
                {
                    id: '2-2-1',
                    title: 'Sesión 1: Introducción Guiada a Triggers',
                    slidesFile: 's2_2_1_slides',
                    exercisesFile: 's2_2_1_exercises',
                    solutionsFile: 's2_2_1_solutions'
                },
                {
                    id: '2-2-2',
                    title: 'Sesión 2: Fundamentos y Tipos de Triggers',
                    slidesFile: 's2_2_2_slides',
                    exercisesFile: 's2_2_2_exercises',
                    solutionsFile: 's2_2_2_solutions'
                },
                {
                    id: '2-2-3',
                    title: 'Sesión 3: Casos Prácticos y Mutating Tables',
                    slidesFile: 's2_2_3_slides',
                    exercisesFile: 's2_2_3_exercises',
                    solutionsFile: 's2_2_3_solutions'
                }
            ]
        },
        {
            id: '2-3',
            title: '2.3 Paquetes (Packages)',
            sessions: [
                {
                    id: '2-3-1',
                    title: 'Sesión 1: Fundamentos de Paquetes',
                    slidesFile: 's2_3_1_slides',
                    exercisesFile: 's2_3_1_exercises',
                    solutionsFile: 's2_3_1_solutions'
                },
                {
                    id: '2-3-2',
                    title: 'Sesión 2: Casos Avanzados y Arquitectura',
                    slidesFile: 's2_3_2_slides',
                    exercisesFile: 's2_3_2_exercises',
                    solutionsFile: 's2_3_2_solutions'
                }
            ]
        },
        {
            id: '3-2',
            title: '3.2 Fundamentos NoSQL con MongoDB Atlas',
            sessions: [
                {
                    id: '3-2-1',
                    taskId: 'tarea-3-2-1',
                    title: 'Sesión 1: Documentos y Directorio de Talento',
                    slidesFile: 's3_2_1_slides',
                    exercisesFile: 's3_2_1_exercises',
                    solutionsFile: 's3_2_1_solutions'
                },
                {
                    id: '3-2-2',
                    taskId: 'tarea-3-2-2',
                    title: 'Sesión 2: Explorar, Diagnosticar y Estrategias de Calidad',
                    slidesFile: 's3_2_2_slides',
                    exercisesFile: 's3_2_2_exercises',
                    solutionsFile: 's3_2_2_solutions'
                },
                {
                    id: '3-2-3',
                    taskId: 'tarea-3-2-3',
                    title: 'Sesión 3: Colecciones, Lotes y Operadores de Búsqueda',
                    slidesFile: 's3_2_3_slides',
                    exercisesFile: 's3_2_3_exercises',
                    solutionsFile: 's3_2_3_solutions'
                },
                {
                    id: '3-2-4',
                    taskId: 'tarea-3-2-4',
                    title: 'Sesión 4: Actualizar, Transformar y Eliminar (CRUD)',
                    slidesFile: 's3_2_4_slides',
                    exercisesFile: 's3_2_4_exercises',
                    solutionsFile: 's3_2_4_solutions'
                },
                {
                    id: '3-2-5',
                    taskId: 'tarea-3-2-5',
                    title: 'Sesión 5: Consultas de Resumen y Agrupación (Aggregate)',
                    slidesFile: 's3_2_5_slides',
                    exercisesFile: 's3_2_5_exercises',
                    solutionsFile: 's3_2_5_solutions'
                }
            ]
        }
    ],
    evaluations: [
        {
            id: 'eval-1',
            title: 'Evaluación 1: Proyecto Integral PL/SQL',
            badge: 'Hito 1',
            desc: 'Quizzes Previos (30%) + Informe Grupal (10%) + Defensa Oral (60%)'
        }
    ],
    quizzes: [
        {
            id: 'quiz-formativa-1',
            title: 'Evaluación Formativa N° 1: Bloques PL/SQL',
            badge: 'Formativa 1',
            desc: '12 preguntas teóricas + 4 bloques PL/SQL prácticos',
            dataFile: 'quiz_formativa_1_data'
        },
        {
            id: 'quiz-formativa-2',
            title: 'Evaluación Formativa N° 2: Fundamentos PL/SQL (Unidad 2)',
            badge: 'Formativa 2',
            desc: 'Funciones, Procedimientos, Triggers, Paquetes, 6 códigos a completar y Caso de Arquitectura',
            dataFile: 'quiz_formativa_2_data'
        }
    ],
    tasks: [
        {
            id: 'tarea-3-2-1',
            title: 'Tarea 1: Tu Perfil en el Directorio de Talento',
            badge: 'Tarea 1',
            desc: 'MongoDB Atlas: crea, busca, actualiza y elimina datos con tu perfil profesional. Individual, sin nota.',
            dataFile: 'tarea_3_2_1_data'
        },
        {
            id: 'tarea-3-2-2',
            title: 'Tarea 2: Detective de Datos en el Directorio',
            badge: 'Tarea 2',
            desc: 'MongoDB Atlas: explora los 71 documentos reales, detecta los 5 tipos de errores con consultas y propón estrategias (30 min).',
            dataFile: 'tarea_3_2_2_data'
        },
        {
            id: 'tarea-3-2-3',
            title: 'Tarea 3: El Buscador de Ofertas Laborales TI',
            badge: 'Tarea 3',
            desc: 'MongoDB Atlas: crea las colecciones empresas y ofertas con insertMany() y filtra combinando operadores ($gt, $lte, $ne, $in, $nin, $or).',
            dataFile: 'tarea_3_2_3_data'
        },
        {
            id: 'tarea-3-2-4',
            title: 'Tarea 4: Gestión en Vivo de Ofertas y Postulaciones',
            badge: 'Tarea 4',
            desc: 'MongoDB Atlas: actualiza documentos individuales y en lote ($set, $inc, $unset, $addToSet, $pull) y elimina registros ($deleteOne/Many).',
            dataFile: 'tarea_3_2_4_data'
        },
        {
            id: 'tarea-3-2-5',
            title: 'Tarea 5: Reportes y Estadísticas del Portal de Empleo',
            badge: 'Tarea 5',
            desc: 'MongoDB Atlas: construye reportes de resumen y agrupación con aggregate() ($match, $group, $sum, $avg, $min, $max y $sort).',
            dataFile: 'tarea_3_2_5_data'
        }
    ],
    activities: [
        {
            id: 'act-prep-1',
            title: 'Taller: Diseña tu Proyecto PL/SQL',
            desc: 'Actividad guiada para generar entregables de la Evaluación 1',
            dataFile: 'actividad_prep_eval1_data'
        }
    ]
};

