// app.js — Aplicación Vue principal
const { createApp, ref, computed } = Vue;

// Mapa de archivos de datos a variables globales
const dataMap = {
    s1_2_1_slides: () => s1_2_1_slides,
    s1_2_1_exercises: () => s1_2_1_exercises,
    s1_2_1_solutions: () => s1_2_1_solutions,
    s1_2_2_slides: () => s1_2_2_slides,
    s1_2_2_exercises: () => s1_2_2_exercises,
    s1_2_2_solutions: () => s1_2_2_solutions,
    s1_3_1_slides: () => s1_3_1_slides,
    s1_3_1_exercises: () => s1_3_1_exercises,
    s1_3_1_solutions: () => s1_3_1_solutions,
    s1_3_2_slides: () => s1_3_2_slides,
    s1_3_2_exercises: () => s1_3_2_exercises,
    s1_3_2_solutions: () => s1_3_2_solutions,
    s1_4_1_slides: () => s1_4_1_slides,
    s1_4_1_exercises: () => s1_4_1_exercises,
    s1_4_1_solutions: () => s1_4_1_solutions,
    s1_4_2_slides: () => s1_4_2_slides,
    s1_4_2_exercises: () => s1_4_2_exercises,
    s1_4_2_solutions: () => s1_4_2_solutions,
    s2_1_1_slides: () => s2_1_1_slides,
    s2_1_1_exercises: () => s2_1_1_exercises,
    s2_1_1_solutions: () => s2_1_1_solutions,
    s2_1_2_slides: () => s2_1_2_slides,
    s2_1_2_exercises: () => s2_1_2_exercises,
    s2_1_2_solutions: () => s2_1_2_solutions,
    actividad_prep_eval1_data: () => actividad_prep_eval1_data,
    quiz_formativa_1_data: () => quiz_formativa_1_data
};

const App = {
    components: {
        'slide-viewer': SlideViewer,
        'exercise-runner': ExerciseRunner,
        'evaluation-viewer': EvaluationViewer,
        'workshop-runner': WorkshopRunner,
        'quiz-runner': QuizRunner
    },
    setup() {
        const course = ref(courseStructure);
        const view = ref('home'); // 'home' | 'session' | 'evaluation' | 'activity' | 'quiz'
        const session = ref(null);
        const currentEval = ref(null);
        const currentActivity = ref(null);
        const currentQuiz = ref(null);
        const tab = ref('slides');
        const sidebarOpen = ref(false);

        const currentSlides = computed(() => {
            if (!session.value) return null;
            const fn = dataMap[session.value.slidesFile];
            return fn ? fn() : null;
        });

        const currentExercises = computed(() => {
            if (!session.value) return null;
            const fn = dataMap[session.value.exercisesFile];
            return fn ? fn() : null;
        });

        const currentSolutions = computed(() => {
            if (!session.value) return null;
            const fn = dataMap[session.value.solutionsFile];
            return fn ? fn() : null;
        });

        function goHome() {
            view.value = 'home';
            session.value = null;
            currentEval.value = null;
            currentActivity.value = null;
            currentQuiz.value = null;
            sidebarOpen.value = false;
        }

        function openSession(s) {
            session.value = s;
            currentEval.value = null;
            currentActivity.value = null;
            currentQuiz.value = null;
            view.value = 'session';
            tab.value = 'slides';
            sidebarOpen.value = false;
        }

        function openEvaluation(ev) {
            currentEval.value = ev.id === 'eval-1' ? evaluacion_1_data : null;
            session.value = null;
            currentActivity.value = null;
            currentQuiz.value = null;
            view.value = 'evaluation';
            sidebarOpen.value = false;
        }

        function openActivity(act) {
            const fn = dataMap[act.dataFile];
            currentActivity.value = fn ? fn() : null;
            session.value = null;
            currentEval.value = null;
            currentQuiz.value = null;
            view.value = 'activity';
            sidebarOpen.value = false;
        }

        function openQuiz(qz) {
            const fn = dataMap[qz.dataFile];
            currentQuiz.value = fn ? fn() : null;
            session.value = null;
            currentEval.value = null;
            currentActivity.value = null;
            view.value = 'quiz';
            sidebarOpen.value = false;
        }

        function getModuleTitle(sessionId) {
            for (const mod of course.value.modules) {
                if (mod.sessions.find(s => s.id === sessionId)) return mod.title;
            }
            return '';
        }

        return {
            course, view, session, currentEval, currentActivity, currentQuiz, tab, sidebarOpen,
            currentSlides, currentExercises, currentSolutions,
            goHome, openSession, openEvaluation, openActivity, openQuiz, getModuleTitle
        };
    }
};

createApp(App).mount('#app');
