// QuizRunner.js — Componente interactivo para Evaluaciones Formativas con Soporte Multiformato
// Plataforma Docente — Taller de Bases de Datos
// Soporta tanto evaluaciones prácticas tradicionales (Quiz 1) como evaluaciones de arquitectura
// multiformato (Quiz 2: Alternativas, Selección Múltiple, Términos Pareados, V/F con Justificación,
// Completar Código con Pool de Opciones y Caso de Arquitectura con Relato).

const QuizRunner = {
    props: {
        quizData: { type: Object, required: true }
    },
    data() {
        return {
            // Control de Acceso (Contraseña Encriptada con SHA-256)
            isAuthorized: false,
            passwordInput: '',
            authError: false,
            authErrorMessage: '',

            // Pasos del Quiz: 'register' | 'theory' | 'codeCompletion' | 'caseStudy' | 'practice' | 'completed'
            currentStep: 'register',

            // Datos del Estudiante
            student: {
                name: '',
                lastname: '',
                rut: '',
                section: '005V'
            },

            // Respuestas del estudiante (Quiz 1, Quiz 2 y Quiz 3)
            theoryAnswers: {},              // { mc1: 1, ... } (Selección Simple)
            multiSelectAnswers: {},         // { ms1: [0, 2], ... } (Selección Múltiple)
            matchingAnswers: {},            // { m1: { t1: 'd1', t2: 'd2' } } (Términos Pareados)
            trueFalseAnswers: {},           // { tf1: { val: true/false, justification: '...' } }
            codeCompletionAnswers: {},      // { cc1: { BLANK_1: 'IN NUMBER', ... } }
            caseStudyAnswer: '',            // Relato de arquitectura del estudiante (Quiz 2)
            shortDiagnosticAnswers: {},     // { diag1: '...', diag2: '...' } (Quiz 3)
            practiceAnswers: {},            // { p1: 'código...' } (Para Quiz 1 tradicional)

            // Tiempos y Auditoría
            startTime: null,
            endTime: null,
            integrityEvents: [],
            tabSwitchCount: 0,

            // Notificaciones / Toast
            toastMessage: '',
            showToastFlag: false,
            toastTimeout: null,

            // Modales
            showConfirmSubmitModal: false,
            showConfirmResetModal: false,
            showTeacherUnlockModal: false,
            teacherPasswordInput: '',
            teacherUnlockError: false,

            // Markdown generado y previsualización
            generatedMarkdown: '',
            downloadFilename: '',
            showMarkdownPreview: false
        };
    },
    computed: {
        isQuiz2() {
            return !!(this.quizData.codeCompletionQuestions || this.quizData.caseStudy || this.quizData.shortDiagnosticQuestions);
        },
        isRegisterValid() {
            return this.student.name.trim().length >= 2 &&
                this.student.lastname.trim().length >= 2 &&
                this.student.rut.trim().length >= 7;
        },
        mcAnsweredCount() {
            if (!this.quizData.multipleChoiceQuestions) return 0;
            return Object.values(this.theoryAnswers).filter(v => v !== null && v !== undefined).length;
        },
        msAnsweredCount() {
            if (!this.quizData.multiSelectQuestions) return 0;
            return Object.values(this.multiSelectAnswers).filter(arr => Array.isArray(arr) && arr.length > 0).length;
        },
        matchingAnsweredCount() {
            if (!this.quizData.matchingQuestions) return 0;
            let c = 0;
            this.quizData.matchingQuestions.forEach(m => {
                const ans = this.matchingAnswers[m.id] || {};
                const matchedCount = Object.keys(ans).filter(k => !!ans[k]).length;
                if (matchedCount === m.terms.length) c++;
            });
            return c;
        },
        tfAnsweredCount() {
            if (!this.quizData.trueFalseQuestions) return 0;
            return Object.values(this.trueFalseAnswers).filter(tf =>
                tf && tf.val !== null && tf.val !== undefined && tf.justification && tf.justification.trim().length >= 5
            ).length;
        },
        theoryAnsweredCount() {
            return this.mcAnsweredCount + this.msAnsweredCount + this.matchingAnsweredCount + this.tfAnsweredCount;
        },
        totalTheoryQuestionsCount() {
            let total = 0;
            if (this.quizData.multipleChoiceQuestions) total += this.quizData.multipleChoiceQuestions.length;
            if (this.quizData.multiSelectQuestions) total += this.quizData.multiSelectQuestions.length;
            if (this.quizData.matchingQuestions) total += this.quizData.matchingQuestions.length;
            if (this.quizData.trueFalseQuestions) total += this.quizData.trueFalseQuestions.length;
            return total;
        },
        codeCompletionAnsweredCount() {
            if (!this.quizData.codeCompletionQuestions) return 0;
            let answeredExercises = 0;
            this.quizData.codeCompletionQuestions.forEach(cc => {
                const ans = this.codeCompletionAnswers[cc.id] || {};
                const allFilled = cc.blanks.every(b => ans[b.id] && ans[b.id].trim().length > 0);
                if (allFilled) answeredExercises++;
            });
            return answeredExercises;
        },
        totalCodeCompletionCount() {
            return this.quizData.codeCompletionQuestions ? this.quizData.codeCompletionQuestions.length : 0;
        },
        practiceAnsweredCount() {
            return Object.values(this.practiceAnswers).filter(code => code && code.trim().length > 20).length;
        },
        totalExercisesCount() {
            return this.quizData.practicalExercises ? this.quizData.practicalExercises.length : 0;
        },
        caseStudyWordCount() {
            if (!this.caseStudyAnswer || !this.caseStudyAnswer.trim()) return 0;
            return this.caseStudyAnswer.trim().split(/\s+/).filter(w => w.length > 0).length;
        },
        shortDiagnosticAnsweredCount() {
            if (!this.quizData.shortDiagnosticQuestions) return 0;
            return this.quizData.shortDiagnosticQuestions.filter(q => {
                const txt = this.shortDiagnosticAnswers[q.id];
                return txt && txt.trim().length >= 15;
            }).length;
        },
        totalShortDiagnosticCount() {
            return this.quizData.shortDiagnosticQuestions ? this.quizData.shortDiagnosticQuestions.length : 0;
        },
        isStep4Completed() {
            if (this.quizData.shortDiagnosticQuestions) {
                return this.shortDiagnosticAnsweredCount === this.totalShortDiagnosticCount;
            }
            return this.caseStudyWordCount >= 100;
        },
        overallTotalCount() {
            if (this.isQuiz2) {
                const step4Total = this.quizData.shortDiagnosticQuestions ? this.totalShortDiagnosticCount : (this.quizData.caseStudy ? 1 : 0);
                return this.totalTheoryQuestionsCount + this.totalCodeCompletionCount + step4Total;
            }
            return this.totalTheoryQuestionsCount + this.totalExercisesCount;
        },
        overallAnsweredCount() {
            if (this.isQuiz2) {
                const step4Ans = this.quizData.shortDiagnosticQuestions ? this.shortDiagnosticAnsweredCount : (this.caseStudyWordCount >= 100 ? 1 : 0);
                return this.theoryAnsweredCount + this.codeCompletionAnsweredCount + step4Ans;
            }
            return this.theoryAnsweredCount + this.practiceAnsweredCount;
        },
        overallProgressPercent() {
            if (!this.overallTotalCount) return 0;
            return Math.min(100, Math.round((this.overallAnsweredCount / this.overallTotalCount) * 100));
        },
        unansweredSummary() {
            const pending = [];
            if (this.quizData.multipleChoiceQuestions) {
                this.quizData.multipleChoiceQuestions.forEach(q => {
                    if (this.theoryAnswers[q.id] === null || this.theoryAnswers[q.id] === undefined) {
                        pending.push({ step: 'theory', sectionId: 'qsec-mc', label: `Pregunta ${q.number} (Alternativas)` });
                    }
                });
            }
            if (this.quizData.multiSelectQuestions) {
                this.quizData.multiSelectQuestions.forEach(q => {
                    const arr = this.multiSelectAnswers[q.id] || [];
                    if (arr.length === 0) {
                        pending.push({ step: 'theory', sectionId: 'qsec-ms', label: `Pregunta ${q.number} (Selección Múltiple)` });
                    }
                });
            }
            if (this.quizData.matchingQuestions) {
                this.quizData.matchingQuestions.forEach(m => {
                    const ans = this.matchingAnswers[m.id] || {};
                    const missingTerms = m.terms.filter(t => !ans[t.id]).length;
                    if (missingTerms > 0) {
                        pending.push({ step: 'theory', sectionId: 'qsec-match', label: `Pregunta ${m.number} (Términos Pareados: faltan ${missingTerms})` });
                    }
                });
            }
            if (this.quizData.trueFalseQuestions) {
                this.quizData.trueFalseQuestions.forEach(tf => {
                    const ans = this.trueFalseAnswers[tf.id] || {};
                    if (ans.val === null || ans.val === undefined) {
                        pending.push({ step: 'theory', sectionId: 'qsec-tf', label: `Ítem ${tf.number} (V/F: sin seleccionar ni justificar)` });
                    } else if (!ans.justification || ans.justification.trim().length < 5) {
                        pending.push({ step: 'theory', sectionId: 'qsec-tf', label: `Ítem ${tf.number} (V/F: falta justificación obligatoria)` });
                    }
                });
            }
            if (this.quizData.codeCompletionQuestions) {
                this.quizData.codeCompletionQuestions.forEach(cc => {
                    const ans = this.codeCompletionAnswers[cc.id] || {};
                    const missingBlanks = cc.blanks.filter(b => !ans[b.id] || !ans[b.id].trim()).length;
                    if (missingBlanks > 0) {
                        pending.push({ step: 'codeCompletion', sectionId: null, label: `Ejercicio ${cc.number} (Completar Código: faltan ${missingBlanks} espacios)` });
                    }
                });
            }
            if (this.quizData.shortDiagnosticQuestions) {
                this.quizData.shortDiagnosticQuestions.forEach(sd => {
                    const txt = this.shortDiagnosticAnswers[sd.id] || '';
                    if (txt.trim().length < 15) {
                        pending.push({ step: 'caseStudy', sectionId: null, label: `Pregunta ${sd.number} (Diagnóstico Práctico)` });
                    }
                });
            } else if (this.quizData.caseStudy) {
                if (this.caseStudyWordCount < 100) {
                    pending.push({ step: 'caseStudy', sectionId: null, label: `Caso de Arquitectura (mínimo recomendado no alcanzado)` });
                }
            }
            return pending;
        },
        formattedDuration() {
            if (!this.startTime || !this.endTime) return 'No determinado';
            const diffMs = new Date(this.endTime) - new Date(this.startTime);
            const diffMins = Math.floor(diffMs / 60000);
            const diffSecs = Math.floor((diffMs % 60000) / 1000);
            return `${diffMins} min ${diffSecs} seg`;
        }
    },
    async mounted() {
        // Acceso directo si simpleAuth está activo o no hay hash de contraseña
        if (this.quizData.simpleAuth || !this.quizData.accessHash) {
            this.isAuthorized = true;
        } else {
            const sessionAuth = sessionStorage.getItem(`quiz_auth_${this.quizData.id}`);
            if (sessionAuth === 'true') {
                this.isAuthorized = true;
            }
        }

        // Inicializar estructuras de respuestas
        if (this.quizData.multipleChoiceQuestions) {
            this.quizData.multipleChoiceQuestions.forEach(q => {
                if (this.theoryAnswers[q.id] === undefined) this.theoryAnswers[q.id] = null;
            });
        }

        if (this.quizData.multiSelectQuestions) {
            this.quizData.multiSelectQuestions.forEach(q => {
                if (!this.multiSelectAnswers[q.id]) this.multiSelectAnswers[q.id] = [];
            });
        }

        if (this.quizData.matchingQuestions) {
            this.quizData.matchingQuestions.forEach(m => {
                if (!this.matchingAnswers[m.id]) this.matchingAnswers[m.id] = {};
                m.terms.forEach(t => {
                    if (!this.matchingAnswers[m.id][t.id]) this.matchingAnswers[m.id][t.id] = '';
                });
            });
        }

        if (this.quizData.trueFalseQuestions) {
            this.quizData.trueFalseQuestions.forEach(tf => {
                if (!this.trueFalseAnswers[tf.id]) {
                    this.trueFalseAnswers[tf.id] = { val: null, justification: '' };
                }
            });
        }

        if (this.quizData.codeCompletionQuestions) {
            this.quizData.codeCompletionQuestions.forEach(cc => {
                if (!this.codeCompletionAnswers[cc.id]) this.codeCompletionAnswers[cc.id] = {};
                cc.blanks.forEach(b => {
                    if (this.codeCompletionAnswers[cc.id][b.id] === undefined) {
                        this.codeCompletionAnswers[cc.id][b.id] = '';
                    }
                });
            });
        }

        if (this.quizData.shortDiagnosticQuestions) {
            this.quizData.shortDiagnosticQuestions.forEach(sd => {
                if (this.shortDiagnosticAnswers[sd.id] === undefined) {
                    this.shortDiagnosticAnswers[sd.id] = '';
                }
            });
        }

        if (this.quizData.practicalExercises) {
            this.quizData.practicalExercises.forEach(p => {
                if (this.practiceAnswers[p.id] === undefined) this.practiceAnswers[p.id] = '';
            });
        }

        // Cargar intento previo de localStorage si existe
        this.loadLocalAttempt();

        // Listeners de integridad (solo si no están deshabilitados)
        if (!this.quizData.disableIntegrityTracking) {
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            window.addEventListener('blur', this.handleWindowBlur);
            document.addEventListener('keydown', this.handleGlobalKeyDown);
        }
    },
    beforeUnmount() {
        if (!this.quizData.disableIntegrityTracking) {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            window.removeEventListener('blur', this.handleWindowBlur);
            document.removeEventListener('keydown', this.handleGlobalKeyDown);
        }
    },
    methods: {
        // Auxiliar para separar código en texto y selects interactivos
        splitCodeTemplate(exercise) {
            const regex = /\[(BLANK_\d+)\]/g;
            const parts = [];
            let lastIndex = 0;
            let match;
            while ((match = regex.exec(exercise.codeTemplate)) !== null) {
                if (match.index > lastIndex) {
                    parts.push({
                        type: 'text',
                        content: exercise.codeTemplate.substring(lastIndex, match.index)
                    });
                }
                const blankId = match[1];
                const blankObj = exercise.blanks.find(b => b.id === blankId);
                parts.push({
                    type: 'blank',
                    blankId: blankId,
                    blankObj: blankObj
                });
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < exercise.codeTemplate.length) {
                parts.push({
                    type: 'text',
                    content: exercise.codeTemplate.substring(lastIndex)
                });
            }
            return parts;
        },

        // Manejador de selección múltiple (checkboxes)
        toggleMultiSelect(questionId, optionIndex) {
            if (!this.multiSelectAnswers[questionId]) {
                this.multiSelectAnswers[questionId] = [];
            }
            const arr = this.multiSelectAnswers[questionId];
            const idx = arr.indexOf(optionIndex);
            if (idx === -1) {
                arr.push(optionIndex);
            } else {
                arr.splice(idx, 1);
            }
            this.saveLocalAttempt();
        },

        // Manejador de Verdadero o Falso
        setTrueFalse(tfId, value) {
            if (!this.trueFalseAnswers[tfId]) {
                this.trueFalseAnswers[tfId] = { val: null, justification: '' };
            }
            this.trueFalseAnswers[tfId].val = value;
            this.saveLocalAttempt();
        },

        // Función SHA-256
        async sha256(message) {
            const msgBuffer = new TextEncoder().encode(message.trim());
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        },

        // Verificación de contraseña de acceso (para Quiz 1)
        async verifyAccessPassword() {
            if (!this.passwordInput.trim()) {
                this.authError = true;
                this.authErrorMessage = 'Por favor ingresa la contraseña de acceso.';
                return;
            }
            try {
                const inputHash = await this.sha256(this.passwordInput);
                if (inputHash === this.quizData.accessHash) {
                    this.isAuthorized = true;
                    this.authError = false;
                    sessionStorage.setItem(`quiz_auth_${this.quizData.id}`, 'true');
                    this.showToast('Acceso concedido a la evaluación.');
                } else {
                    this.authError = true;
                    this.authErrorMessage = 'Contraseña incorrecta. Consulta al docente de la asignatura.';
                }
            } catch (err) {
                console.error('Error calculando hash:', err);
                this.authError = true;
                this.authErrorMessage = 'Error de seguridad en el navegador.';
            }
        },

        // Comenzar evaluación
        startQuiz() {
            if (!this.isRegisterValid) return;
            this.startTime = new Date().toISOString();
            this.currentStep = 'theory';
            this.saveLocalAttempt();
            this.showToast('Evaluación iniciada. Éxito en tu desarrollo.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Integridad y Detección de Foco
        handleVisibilityChange() {
            if (this.currentStep === 'completed' || !this.isAuthorized || this.currentStep === 'register') return;
            if (document.hidden) {
                this.registerIntegrityEvent('Cambio de pestaña / navegador minimizado');
            }
        },

        handleWindowBlur() {
            if (this.currentStep === 'completed' || !this.isAuthorized || this.currentStep === 'register') return;
            this.registerIntegrityEvent('Pérdida de foco de la ventana activa');
        },

        registerIntegrityEvent(reason) {
            this.tabSwitchCount++;
            const now = new Date();
            const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            this.integrityEvents.push({
                time: timeStr,
                step: this.currentStep,
                reason: reason
            });
            this.saveLocalAttempt();
            if (!this.quizData.disableIntegrityTracking) {
                this.showToast(`⚠️ Alerta de integridad: salida de pestaña detectada (${timeStr})`);
            }
        },

        handleQuestionContextMenu(e) {
            if (this.quizData.disableIntegrityTracking) return;
            e.preventDefault();
            this.showToast('Menú contextual desactivado por políticas de integridad del examen.');
        },

        handleGlobalKeyDown(e) {
            if (this.currentStep === 'completed' || this.quizData.disableIntegrityTracking) return;

            if (e.key === 'F12') {
                e.preventDefault();
                this.showToast('Inspección de elementos no permitida durante la evaluación.');
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                this.showToast('Inspección de elementos no permitida.');
                return;
            }
        },

        // Navegación entre pasos
        goToStep(step) {
            this.currentStep = step;
            this.saveLocalAttempt();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Copiar bloque de Playground al portapapeles
        copyPlaygroundSetup() {
            if (!this.quizData.playgroundSetupBlock || !this.quizData.playgroundSetupBlock.code) return;
            navigator.clipboard.writeText(this.quizData.playgroundSetupBlock.code).then(() => {
                this.showToast('Código copiado. Pégalo en tu Playground de VS Code.');
            }).catch(() => {
                this.showToast('Selecciona el código y cópialo con Ctrl+C / Cmd+C.');
            });
        },

        // Copiar consulta individual de una pregunta para probar en el Playground
        copyQueryText(queryText) {
            if (!queryText) return;
            navigator.clipboard.writeText(queryText).then(() => {
                this.showToast('Consulta copiada para tu Playground.');
            }).catch(() => {
                this.showToast('No se pudo copiar automáticamente.');
            });
        },

        // Formatear texto con backticks (`código`) y badge de [Prueba en Playground]
        formatInlineCode(text) {
            if (!text) return '';
            const escaped = String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            return escaped
                .replace(/\[Prueba en Playground\]/g, '<span class="quiz-playground-badge"><i class="ph-fill ph-terminal-window"></i> Prueba en Playground</span>')
                .replace(/`([^`]+)`/g, '<code class="quiz-inline-code">$1</code>');
        },

        // Estado de un ítem Verdadero/Falso: 'complete' | 'partial' | 'empty'
        getTfStatus(tfId) {
            const ans = this.trueFalseAnswers[tfId];
            if (!ans || (ans.val === null || ans.val === undefined)) return 'empty';
            if (!ans.justification || ans.justification.trim().length < 5) return 'partial';
            return 'complete';
        },

        // Estado de un ejercicio de completar código
        isExerciseCompleted(cc) {
            const ans = this.codeCompletionAnswers[cc.id] || {};
            return cc.blanks.every(b => ans[b.id] && ans[b.id].trim().length > 0);
        },

        // Desplazamiento suave a una sub-sección dentro de Teoría
        scrollToSection(sectionId) {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },

        // Saltar desde el modal de ítems pendientes hacia el paso/sección correspondiente
        jumpToPendingItem(item) {
            this.showConfirmSubmitModal = false;
            this.currentStep = item.step;
            this.saveLocalAttempt();
            this.$nextTick(() => {
                if (item.sectionId) {
                    this.scrollToSection(item.sectionId);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        },

        // Volver a editar respuestas (para evaluaciones formativas con simpleAuth)
        reopenForEditing() {
            this.currentStep = 'theory';
            this.saveLocalAttempt();
            this.showToast('Modo de edición reabierto. Recuerda volver a exportar tu .md al terminar.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Reiniciar intento desde cero (con confirmación)
        confirmResetAttempt() {
            localStorage.removeItem(`quiz_attempt_${this.quizData.id}`);
            if (this.quizData.multipleChoiceQuestions) {
                this.quizData.multipleChoiceQuestions.forEach(q => { this.theoryAnswers[q.id] = null; });
            }
            if (this.quizData.multiSelectQuestions) {
                this.quizData.multiSelectQuestions.forEach(q => { this.multiSelectAnswers[q.id] = []; });
            }
            if (this.quizData.matchingQuestions) {
                this.quizData.matchingQuestions.forEach(m => {
                    this.matchingAnswers[m.id] = {};
                    m.terms.forEach(t => { this.matchingAnswers[m.id][t.id] = ''; });
                });
            }
            if (this.quizData.trueFalseQuestions) {
                this.quizData.trueFalseQuestions.forEach(tf => {
                    this.trueFalseAnswers[tf.id] = { val: null, justification: '' };
                });
            }
            if (this.quizData.codeCompletionQuestions) {
                this.quizData.codeCompletionQuestions.forEach(cc => {
                    this.codeCompletionAnswers[cc.id] = {};
                    cc.blanks.forEach(b => { this.codeCompletionAnswers[cc.id][b.id] = ''; });
                });
            }
            if (this.quizData.shortDiagnosticQuestions) {
                this.quizData.shortDiagnosticQuestions.forEach(sd => { this.shortDiagnosticAnswers[sd.id] = ''; });
            }
            this.caseStudyAnswer = '';
            this.startTime = null;
            this.endTime = null;
            this.tabSwitchCount = 0;
            this.integrityEvents = [];
            this.generatedMarkdown = '';
            this.showMarkdownPreview = false;
            this.showConfirmResetModal = false;
            this.currentStep = 'register';
            this.showToast('Intento reiniciado en blanco.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Guardado y carga local (localStorage)
        saveLocalAttempt() {
            const data = {
                student: this.student,
                theoryAnswers: this.theoryAnswers,
                multiSelectAnswers: this.multiSelectAnswers,
                matchingAnswers: this.matchingAnswers,
                trueFalseAnswers: this.trueFalseAnswers,
                codeCompletionAnswers: this.codeCompletionAnswers,
                caseStudyAnswer: this.caseStudyAnswer,
                shortDiagnosticAnswers: this.shortDiagnosticAnswers,
                practiceAnswers: this.practiceAnswers,
                startTime: this.startTime,
                endTime: this.endTime,
                tabSwitchCount: this.tabSwitchCount,
                integrityEvents: this.integrityEvents,
                currentStep: this.currentStep
            };
            localStorage.setItem(`quiz_attempt_${this.quizData.id}`, JSON.stringify(data));
        },

        loadLocalAttempt() {
            try {
                const saved = localStorage.getItem(`quiz_attempt_${this.quizData.id}`);
                if (!saved) return;
                const parsed = JSON.parse(saved);
                if (parsed.student) this.student = parsed.student;
                if (parsed.theoryAnswers) this.theoryAnswers = parsed.theoryAnswers;
                if (parsed.multiSelectAnswers) this.multiSelectAnswers = parsed.multiSelectAnswers;
                if (parsed.matchingAnswers) this.matchingAnswers = parsed.matchingAnswers;
                if (parsed.trueFalseAnswers) this.trueFalseAnswers = parsed.trueFalseAnswers;
                if (parsed.codeCompletionAnswers) this.codeCompletionAnswers = parsed.codeCompletionAnswers;
                if (parsed.caseStudyAnswer !== undefined) this.caseStudyAnswer = parsed.caseStudyAnswer;
                if (parsed.shortDiagnosticAnswers) this.shortDiagnosticAnswers = parsed.shortDiagnosticAnswers;
                if (parsed.practiceAnswers) this.practiceAnswers = parsed.practiceAnswers;
                if (parsed.startTime) this.startTime = parsed.startTime;
                if (parsed.endTime) this.endTime = parsed.endTime;
                if (parsed.tabSwitchCount) this.tabSwitchCount = parsed.tabSwitchCount;
                if (parsed.integrityEvents) this.integrityEvents = parsed.integrityEvents;
                if (parsed.currentStep) this.currentStep = parsed.currentStep;

                if (this.currentStep === 'completed') {
                    this.generateMarkdownReport();
                }
            } catch (err) {
                console.error('Error cargando intento local:', err);
            }
        },

        promptSubmit() {
            this.showConfirmSubmitModal = true;
        },

        finalizeAndExport() {
            this.showConfirmSubmitModal = false;
            this.endTime = new Date().toISOString();
            this.currentStep = 'completed';

            this.generateMarkdownReport();
            this.saveLocalAttempt();

            // Descargar automáticamente el archivo .md
            this.downloadMarkdownFile();
            this.showToast('¡Evaluación finalizada y archivo Markdown generado!');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Generar contenido Markdown (.md)
        generateMarkdownReport() {
            const s = this.student;
            const startDate = this.startTime ? new Date(this.startTime).toLocaleString('es-CL') : 'No registrado';
            const endDate = this.endTime ? new Date(this.endTime).toLocaleString('es-CL') : new Date().toLocaleString('es-CL');

            let durationText = 'No determinado';
            if (this.startTime && this.endTime) {
                const diffMs = new Date(this.endTime) - new Date(this.startTime);
                const diffMins = Math.floor(diffMs / 60000);
                const diffSecs = Math.floor((diffMs % 60000) / 1000);
                durationText = `${diffMins} min ${diffSecs} seg`;
            }

            const cleanRut = (s.rut || 'sin_rut').replace(/[^a-zA-Z0-9]/g, '');

            // Si es Quiz Multiformato (Quiz 2 o Quiz 3)
            if (this.isQuiz2) {
                const prefix = this.quizData.exportPrefix || 'Evaluacion2_BDY1103';
                const codeLang = this.quizData.codeLang || 'sql';
                const evalType = this.quizData.evalTypeLabel || 'Formativa de Arquitectura PL/SQL (Unidad 2)';
                this.downloadFilename = `${prefix}_${cleanRut}.md`;
                let md = '';
                md += `# ${this.quizData.title}\n`;
                md += `**Asignatura:** ${this.quizData.sigla} ${this.quizData.courseName}\n`;
                md += `**Tipo de Evaluación:** ${evalType}\n`;
                md += `**Puntaje Total:** 100 Puntos (Exigencia 60% = 60 pts para nota 4.0)\n\n`;
                md += `---\n\n`;

                md += `## 👤 1. Datos del Estudiante\n\n`;
                md += `- **Nombre Completo:** ${s.name} ${s.lastname}\n`;
                md += `- **RUT:** ${s.rut}\n`;
                md += `- **Sección:** ${s.section}\n`;
                md += `- **Fecha y Hora de Inicio:** ${startDate}\n`;
                md += `- **Fecha y Hora de Entrega:** ${endDate}\n`;
                md += `- **Tiempo Total Empleado:** ${durationText}\n\n`;
                md += `---\n\n`;

                const hideSolutions = !!this.quizData.hideSolutionsInExport;

                // PARTE 1: ALTERNATIVAS
                md += `## 📋 2. Parte 1: Alternativas — Selección Simple (24 Puntos | 3 pts c/u)\n\n`;
                this.quizData.multipleChoiceQuestions.forEach(q => {
                    const selectedIdx = this.theoryAnswers[q.id];
                    const selectedText = selectedIdx !== null && selectedIdx !== undefined ? q.options[selectedIdx] : '(Sin responder)';
                    const pts = q.points || 3;

                    md += `### Pregunta ${q.number} (${pts} pts): ${q.question}\n`;
                    md += `- **Tópico:** \`${q.topic}\`\n`;
                    md += `- **Puntaje Máximo del Ítem:** ${pts} puntos\n`;
                    md += `- **Respuesta Seleccionada por el Estudiante:**\n  > ${selectedText}\n`;
                    if (!hideSolutions && q.correctAnswer !== undefined) {
                        const correctText = q.options[q.correctAnswer];
                        md += `- **Respuesta Correcta Esperada (Docente/IA):**\n  > ${correctText}\n`;
                        md += `- **Justificación Técnica de Referencia:** ${q.explanation}\n`;
                    }
                    md += `\n`;
                });
                md += `---\n\n`;

                // PARTE 2: SELECCIÓN MÚLTIPLE
                md += `## 📋 3. Parte 2: Selección Múltiple — Checkboxes (12 Puntos | 3 pts c/u)\n\n`;
                this.quizData.multiSelectQuestions.forEach(q => {
                    const selectedArr = this.multiSelectAnswers[q.id] || [];
                    const selectedTexts = selectedArr.map(idx => q.options[idx]);
                    const pts = q.points || 3;

                    md += `### Pregunta ${q.number} (${pts} pts): ${q.question}\n`;
                    md += `- **Tópico:** \`${q.topic}\`\n`;
                    md += `- **Puntaje Máximo del Ítem:** ${pts} puntos\n`;
                    md += `- **Opciones Seleccionadas por el Estudiante:**\n`;
                    if (selectedTexts.length > 0) {
                        selectedTexts.forEach(t => md += `  - [x] ${t}\n`);
                    } else {
                        md += `  *(Sin responder)*\n`;
                    }
                    if (!hideSolutions && q.correctAnswers) {
                        const correctTexts = q.correctAnswers.map(idx => q.options[idx]);
                        md += `- **Opciones Correctas Esperadas (Docente/IA):**\n`;
                        correctTexts.forEach(t => md += `  - [x] ${t}\n`);
                        md += `- **Justificación Técnica:** ${q.explanation}\n`;
                    }
                    md += `\n`;
                });
                md += `---\n\n`;

                // PARTE 3: TÉRMINOS PAREADOS
                md += `## 📋 4. Parte 3: Términos Pareados — Matching (12 Puntos | 2 pts c/u)\n\n`;
                this.quizData.matchingQuestions.forEach(m => {
                    md += `### ${m.instruction}\n\n`;
                    if (hideSolutions) {
                        md += `| N° | Concepto Técnico | Puntaje | Definición Seleccionada por el Estudiante |\n`;
                        md += `|:---:|---|:---:|---|\n`;
                        m.terms.forEach((t, i) => {
                            const selDefId = (this.matchingAnswers[m.id] || {})[t.id];
                            const selDefObj = m.definitions.find(d => d.id === selDefId);
                            const selDefText = selDefObj ? selDefObj.text : '*(Sin asociar)*';
                            md += `| ${i + 1} | **${t.name}** | 2 pts | ${selDefText} |\n`;
                        });
                    } else {
                        md += `| N° | Concepto Técnico | Puntaje | Definición Seleccionada por el Estudiante | Definición Correcta (Referencia) |\n`;
                        md += `|:---:|---|:---:|---|---|\n`;
                        m.terms.forEach((t, i) => {
                            const selDefId = (this.matchingAnswers[m.id] || {})[t.id];
                            const selDefObj = m.definitions.find(d => d.id === selDefId);
                            const selDefText = selDefObj ? selDefObj.text : '*(Sin asociar)*';
                            const corrDefId = m.correctMatches ? m.correctMatches[t.id] : '';
                            const corrDefObj = m.definitions.find(d => d.id === corrDefId);
                            const corrDefText = corrDefObj ? corrDefObj.text : '';
                            md += `| ${i + 1} | **${t.name}** | 2 pts | ${selDefText} | ${corrDefText} |\n`;
                        });
                    }
                    md += `\n`;
                });
                md += `---\n\n`;

                // PARTE 4: VERDADERO O FALSO CON JUSTIFICACIÓN OBLIGATORIA
                md += `## 📋 5. Parte 4: Verdadero o Falso con Justificación Obligatoria (18 Puntos | 3 pts c/u: 1 pto V/F + 2 pts justificación)\n\n`;
                this.quizData.trueFalseQuestions.forEach(tf => {
                    const ans = this.trueFalseAnswers[tf.id] || { val: null, justification: '' };
                    const userValText = ans.val === true ? 'VERDADERO' : (ans.val === false ? 'FALSO' : '(Sin seleccionar)');
                    const pts = tf.points || 3;

                    md += `### Ítem ${tf.number} (${pts} pts): "${tf.statement}"\n`;
                    md += `- **Tópico:** \`${tf.topic}\`\n`;
                    md += `- **Puntaje Máximo del Ítem:** ${pts} puntos (1 pto elección V/F + 2 pts justificación)\n`;
                    md += `- **Elección del Estudiante:** **${userValText}**\n`;
                    md += `- **Justificación Técnica Redactada por el Estudiante:**\n`;
                    if (ans.justification && ans.justification.trim()) {
                        md += `  > "${ans.justification.trim()}"\n`;
                    } else {
                        md += `  *(El estudiante no ingresó justificación obligatoria)*\n`;
                    }
                    if (!hideSolutions && tf.expectedValue !== undefined) {
                        const corrValText = tf.expectedValue === true ? 'VERDADERO' : 'FALSO';
                        md += `- **Valor Esperado (Docente/IA):** **${corrValText}**\n`;
                        md += `- **Pauta de Justificación Docente para Evaluación:**\n  > ${tf.referenceJustification}\n`;
                    }
                    md += `\n`;
                });
                md += `---\n\n`;

                // PARTE 5: COMPLETAR CÓDIGO (6 EJERCICIOS)
                md += `## 💻 6. Parte 5: Bloques de Código Completados con Pool de Opciones (18 Puntos | 3 pts c/u)\n\n`;
                this.quizData.codeCompletionQuestions.forEach(cc => {
                    const ans = this.codeCompletionAnswers[cc.id] || {};
                    const pts = cc.points || 3;

                    // Reconstruir el código con las selecciones del alumno
                    let reconstructedCode = cc.codeTemplate;
                    cc.blanks.forEach(b => {
                        const sel = ans[b.id] || `[PENDIENTE: ${b.id}]`;
                        reconstructedCode = reconstructedCode.replace(`[${b.id}]`, sel);
                    });

                    md += `### ${cc.title} (${pts} pts)\n`;
                    md += `- **Tópico:** \`${cc.topic}\`\n`;
                    md += `- **Puntaje Máximo del Ejercicio:** ${pts} puntos\n`;
                    md += `- **Enunciado:** ${cc.description}\n\n`;
                    md += `#### Código Ensamblado por el Estudiante:\n\`\`\`${codeLang}\n${reconstructedCode}\n\`\`\`\n\n`;
                    if (hideSolutions) {
                        md += `#### Opciones Seleccionadas por Espacio:\n`;
                        md += `| Espacio | Etiqueta | Opción Seleccionada por el Estudiante |\n`;
                        md += `|---|---|---|\n`;
                        cc.blanks.forEach(b => {
                            const sel = ans[b.id] || '(Sin seleccionar)';
                            md += `| \`${b.id}\` | ${b.label} | \`${sel}\` |\n`;
                        });
                    } else {
                        md += `#### Tabla de Opciones Seleccionadas vs Pauta Oficial:\n`;
                        md += `| Espacio | Opción Seleccionada por el Estudiante | Opción Correcta Oficial | Estado |\n`;
                        md += `|---|---|---|:---:|\n`;
                        cc.blanks.forEach(b => {
                            const sel = ans[b.id] || '(Sin seleccionar)';
                            const isOk = sel === b.correctOption;
                            md += `| \`${b.id}\` | \`${sel}\` | \`${b.correctOption}\` | ${isOk ? '✅ Coincide' : '❌ Discrepa'} |\n`;
                        });
                    }
                    md += `\n`;
                });
                md += `---\n\n`;

                // PARTE 6: PREGUNTAS CORTAS DE DIAGNÓSTICO (QUIZ 3) O CASO DE ARQUITECTURA (QUIZ 2)
                if (this.quizData.shortDiagnosticQuestions && this.quizData.shortDiagnosticQuestions.length > 0) {
                    md += `## 🧪 7. Parte 6: Preguntas Cortas de Diagnóstico y Resolución en Playground (16 Puntos | 8 pts c/u)\n\n`;
                    this.quizData.shortDiagnosticQuestions.forEach(sd => {
                        const userAns = (this.shortDiagnosticAnswers[sd.id] || '').trim();
                        const pts = sd.points || 8;
                        md += `### Pregunta ${sd.number} (${pts} pts): ${sd.title}\n`;
                        md += `- **Tópico:** \`${sd.topic}\`\n`;
                        md += `- **Puntaje Máximo del Ítem:** ${pts} puntos\n\n`;
                        md += `#### Respuesta Redactada por el Estudiante:\n`;
                        if (userAns) {
                            md += `\`\`\`${codeLang}\n${userAns}\n\`\`\`\n\n`;
                        } else {
                            md += `*(El estudiante no ingresó respuesta para esta pregunta)*\n\n`;
                        }
                        if (!hideSolutions && sd.referenceAnswer) {
                            md += `#### Pauta de Solución Esperada (Docente/IA):\n`;
                            md += `\`\`\`${codeLang}\n${sd.referenceAnswer}\n\`\`\`\n\n`;
                        }
                    });
                    md += `---\n\n`;
                } else if (this.quizData.caseStudy) {
                    md += `## 🏛️ 7. Parte 6: Caso de Arquitectura y Relato de Solución (16 Puntos)\n\n`;
                    const c = this.quizData.caseStudy;
                    md += `### ${c.title}\n`;
                    md += `**Subtítulo:** ${c.subtitle}\n\n`;
                    md += `#### Relato Técnico Redactado por el Estudiante:\n\n`;
                    if (this.caseStudyAnswer && this.caseStudyAnswer.trim()) {
                        md += `\`\`\`text\n${this.caseStudyAnswer.trim()}\n\`\`\`\n\n`;
                        md += `- **Métricas del Relato:** ${this.caseStudyWordCount} palabras escritas.\n\n`;
                    } else {
                        md += `*(No se redactó relato para el caso práctico de arquitectura)*\n\n`;
                    }
                    md += `---\n\n`;
                }

                // GUÍA Y RÚBRICA PARA EL AGENTE IA (Solo si no está oculta)
                if (!hideSolutions && this.quizData.aiAgentEvaluationRubric) {
                    md += `## 🤖 8. Guía de Evaluación para el Agente Evaluador de Inteligencia Artificial (IA)\n\n`;
                    md += `> [!IMPORTANT]\n`;
                    md += `> **Instrucciones para el Agente Evaluador:**\n`;
                    md += `> Evalúa las respuestas del estudiante utilizando la siguiente escala y criterios oficiales:\n\n`;
                    md += this.quizData.aiAgentEvaluationRubric;
                }

                this.generatedMarkdown = md;
                return;
            }

            // Si es Quiz 1 Tradicional (Evaluación Formativa N° 1)
            this.downloadFilename = `Quiz1_BDY1103_${cleanRut}.md`;
            let md = '';
            md += `# Evaluación Formativa N° 1: Bloques PL/SQL\n`;
            md += `**Asignatura:** ${this.quizData.sigla} ${this.quizData.courseName}\n\n`;
            md += `## Datos del Estudiante\n`;
            md += `- **Nombre:** ${s.name} ${s.lastname}\n`;
            md += `- **RUT:** ${s.rut}\n`;
            md += `- **Sección:** ${s.section}\n`;
            md += `- **Inicio:** ${startDate} | **Entrega:** ${endDate}\n\n`;

            md += `## Preguntas Teóricas\n`;
            this.quizData.multipleChoiceQuestions.forEach(q => {
                const selectedIdx = this.theoryAnswers[q.id];
                const selectedText = selectedIdx !== null && selectedIdx !== undefined ? q.options[selectedIdx] : '(Sin responder)';
                md += `### ${q.number}. ${q.question}\n`;
                md += `- **Respuesta del alumno:** ${selectedText}\n\n`;
            });

            if (this.quizData.practicalExercises) {
                md += `## Ejercicios Prácticos PL/SQL\n`;
                this.quizData.practicalExercises.forEach(p => {
                    const code = (this.practiceAnswers[p.id] || '').trim();
                    md += `### ${p.title}\n`;
                    md += `\`\`\`sql\n${code || '*(Sin código)*'}\n\`\`\`\n\n`;
                });
            }

            this.generatedMarkdown = md;
        },

        downloadMarkdownFile() {
            if (!this.generatedMarkdown) {
                this.generateMarkdownReport();
            }
            const blob = new Blob([this.generatedMarkdown], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.downloadFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast(`Archivo ${this.downloadFilename} descargado.`);
        },

        copyMarkdownToClipboard() {
            if (!this.generatedMarkdown) {
                this.generateMarkdownReport();
            }
            navigator.clipboard.writeText(this.generatedMarkdown).then(() => {
                this.showToast('Contenido Markdown copiado al portapapeles.');
            }).catch(err => {
                console.error('Error al copiar:', err);
                this.showToast('No se pudo copiar automáticamente.');
            });
        },

        async verifyTeacherUnlock() {
            if (!this.teacherPasswordInput.trim()) return;
            try {
                const inputHash = await this.sha256(this.teacherPasswordInput);
                if (inputHash === this.quizData.unlockHash) {
                    localStorage.removeItem(`quiz_attempt_${this.quizData.id}`);
                    this.currentStep = 'register';
                    this.startTime = null;
                    this.endTime = null;
                    this.tabSwitchCount = 0;
                    this.integrityEvents = [];
                    this.showTeacherUnlockModal = false;
                    this.teacherPasswordInput = '';
                    this.teacherUnlockError = false;
                    this.showToast('Intento reiniciado por autorización docente.');
                } else {
                    this.teacherUnlockError = true;
                }
            } catch (err) {
                console.error('Error en desbloqueo:', err);
            }
        },

        showToast(msg) {
            this.toastMessage = msg;
            this.showToastFlag = true;
            if (this.toastTimeout) clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => {
                this.showToastFlag = false;
            }, 3500);
        }
    },
    template: `
        <div class="fade-in" style="position: relative;">

            <!-- MODAL DE AUTENTICACIÓN CON CONTRASEÑA (SOLO QUIZ 1) -->
            <div v-if="!isAuthorized && !quizData.simpleAuth" class="quiz-auth-overlay">
                <div class="quiz-auth-card">
                    <div class="quiz-auth-icon">
                        <i class="ph ph-lock-key"></i>
                    </div>
                    <h2>{{ quizData.title }}</h2>
                    <p>Esta evaluación requiere clave de acceso entregada por el docente en la sala de clases.</p>

                    <form class="quiz-auth-form" @submit.prevent="verifyAccessPassword">
                        <div class="quiz-input-group">
                            <label for="quiz-pass">Contraseña de Acceso</label>
                            <input id="quiz-pass"
                                   type="password"
                                   v-model="passwordInput"
                                   placeholder="Ingresa la clave..."
                                   autocomplete="off"
                                   autofocus>
                        </div>

                        <div v-if="authError" class="quiz-auth-error">
                            <i class="ph ph-warning-circle"></i>
                            <span>{{ authErrorMessage }}</span>
                        </div>

                        <button type="submit" class="quiz-btn quiz-btn-primary" style="width: 100%; margin-top: 0.5rem;">
                            <i class="ph ph-sign-in"></i> Ingresar a la Evaluación
                        </button>
                    </form>
                </div>
            </div>

            <!-- CONTENIDO DE LA EVALUACIÓN (CUANDO ESTÁ AUTORIZADO) -->
            <template v-if="isAuthorized">

                <!-- Header Banner -->
                <div class="quiz-header-banner">
                    <div class="quiz-header-info">
                        <h1>
                            <span>{{ quizData.title }}</span>
                            <span class="badge" style="background: #ede9fe; color: #6d28d9; font-size: 0.75rem;">{{ quizData.sigla }}</span>
                        </h1>
                        <p>{{ quizData.courseName }} — {{ quizData.timeNote || 'Evaluación Formativa' }}</p>
                    </div>
                    <div class="quiz-meta-badges">
                        <div v-if="!quizData.disableIntegrityTracking" class="quiz-badge-integrity" :class="{ warning: tabSwitchCount > 0 }">
                            <i class="ph" :class="tabSwitchCount > 0 ? 'ph-warning' : 'ph-shield-check'"></i>
                            <span>{{ tabSwitchCount === 0 ? '🛡️ Integridad activa' : '⚠️ Salidas de foco: ' + tabSwitchCount }}</span>
                        </div>
                        <div v-else class="quiz-badge-integrity" style="background: #f0fdf4; color: #16a34a; border-color: #bbf7d0;">
                            <i class="ph ph-check-circle"></i>
                            <span>Modalidad Formativa</span>
                        </div>
                    </div>
                </div>

                <!-- STEPPER DE NAVEGACIÓN + BARRA DE PROGRESO STICKY -->
                <div v-if="currentStep !== 'completed'" class="quiz-sticky-nav">
                    <div class="quiz-stepper" style="margin-bottom: 0;">
                        <button class="quiz-step-btn"
                                :class="{ active: currentStep === 'register' }"
                                :disabled="currentStep !== 'register'"
                                @click="goToStep('register')">
                            <i class="ph ph-user"></i>
                            <span>1. Registro</span>
                        </button>
                        <button class="quiz-step-btn"
                                :class="{ active: currentStep === 'theory', completed: theoryAnsweredCount === totalTheoryQuestionsCount }"
                                :disabled="!startTime"
                                @click="goToStep('theory')">
                            <i class="ph ph-list-numbers"></i>
                            <span>2. Teoría ({{ theoryAnsweredCount }}/{{ totalTheoryQuestionsCount }})</span>
                        </button>

                        <!-- PASOS ESPECÍFICOS PARA QUIZ 2 / QUIZ 3 -->
                        <template v-if="isQuiz2">
                            <button class="quiz-step-btn"
                                    :class="{ active: currentStep === 'codeCompletion', completed: codeCompletionAnsweredCount === totalCodeCompletionCount }"
                                    :disabled="!startTime"
                                    @click="goToStep('codeCompletion')">
                                <i class="ph ph-code"></i>
                                <span>3. Completar Código ({{ codeCompletionAnsweredCount }}/{{ totalCodeCompletionCount }})</span>
                            </button>
                            <button class="quiz-step-btn"
                                    :class="{ active: currentStep === 'caseStudy', completed: isStep4Completed }"
                                    :disabled="!startTime"
                                    @click="goToStep('caseStudy')">
                                <i class="ph ph-buildings"></i>
                                <span>{{ quizData.step4ButtonLabel || '4. Caso Arquitectura' }}</span>
                            </button>
                        </template>

                        <!-- PASO PRÁCTICO PARA QUIZ 1 -->
                        <template v-else>
                            <button class="quiz-step-btn"
                                    :class="{ active: currentStep === 'practice', completed: practiceAnsweredCount === totalExercisesCount }"
                                    :disabled="!startTime"
                                    @click="goToStep('practice')">
                                <i class="ph ph-code"></i>
                                <span>3. Práctica PL/SQL ({{ practiceAnsweredCount }}/{{ totalExercisesCount }})</span>
                            </button>
                        </template>
                    </div>

                    <!-- Barra de Progreso Global -->
                    <div v-if="startTime" class="quiz-global-progress-bar">
                        <div class="quiz-global-progress-info">
                            <span><i class="ph-fill ph-check-circle" style="color: #16a34a;"></i> Progreso total: <strong>{{ overallAnsweredCount }} de {{ overallTotalCount }}</strong> ítems completados ({{ overallProgressPercent }}%)</span>
                            <span class="quiz-autosave-pill"><i class="ph ph-cloud-check"></i> Guardado automático en navegador</span>
                        </div>
                        <div class="quiz-progress-track">
                            <div class="quiz-progress-fill" :style="{ width: overallProgressPercent + '%' }"></div>
                        </div>
                    </div>
                </div>

                <!-- ========================================================
                     PASO 1: REGISTRO E IDENTIFICACIÓN
                     ======================================================== -->
                <div v-if="currentStep === 'register'" class="quiz-card fade-in">
                    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-identification-card" style="color: var(--primary);"></i> Identificación del Estudiante
                    </h2>
                    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
                        Ingresa tus datos oficiales para vincular tu archivo de entrega Markdown (.md).
                    </p>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
                        <div class="quiz-input-group">
                            <label for="st-name">Nombres *</label>
                            <input id="st-name" type="text" v-model="student.name" placeholder="Ej. Carlos">
                        </div>
                        <div class="quiz-input-group">
                            <label for="st-lastname">Apellidos *</label>
                            <input id="st-lastname" type="text" v-model="student.lastname" placeholder="Ej. Valenzuela">
                        </div>
                        <div class="quiz-input-group">
                            <label for="st-rut">RUT *</label>
                            <input id="st-rut" type="text" v-model="student.rut" placeholder="Ej. 19.876.543-2">
                        </div>
                        <div class="quiz-input-group">
                            <label for="st-section">Sección *</label>
                            <select id="st-section" v-model="student.section">
                                <option value="005V">005V (Vespertino)</option>
                                <option value="003D">003D</option>
                                <option value="004D">004D</option>
                                <option value="Otro">Otra sección</option>
                            </select>
                        </div>
                    </div>

                    <div class="quiz-req-box" style="margin-bottom: 2rem;">
                        <h4>📌 Instrucciones Generales</h4>
                        <ul>
                            <li v-for="(inst, i) in quizData.instructions" :key="i" v-html="inst"></li>
                        </ul>
                    </div>

                    <div style="display: flex; justify-content: flex-end;">
                        <button class="quiz-btn quiz-btn-primary" :disabled="!isRegisterValid" @click="startQuiz">
                            <span>Comenzar Evaluación</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- ========================================================
                     PASO 2: TEORÍA (MULTIFORMATO)
                     ======================================================== -->
                <div v-if="currentStep === 'theory'" class="quiz-card fade-in" @contextmenu="handleQuestionContextMenu">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h2 style="font-size: 1.25rem; font-weight: 700;">{{ quizData.theoryHeaderTitle || 'Parte Teórica: Fundamentos PL/SQL' }}</h2>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">{{ quizData.theoryHeaderDesc || 'Responde las preguntas teóricas basadas en las diapositivas de fundamentos.' }}</p>
                        </div>
                        <span class="quiz-tag blue">Completadas: {{ theoryAnsweredCount }} de {{ totalTheoryQuestionsCount }}</span>
                    </div>

                    <!-- Sub-navegación rápida dentro de Teoría (cuando es multiformato) -->
                    <div v-if="isQuiz2" class="quiz-subnav-pills">
                        <button type="button" class="quiz-subnav-pill" @click="scrollToSection('qsec-mc')">
                            <i class="ph ph-radio-button"></i>
                            <span>1. Alternativas ({{ mcAnsweredCount }}/{{ quizData.multipleChoiceQuestions ? quizData.multipleChoiceQuestions.length : 0 }})</span>
                        </button>
                        <button type="button" class="quiz-subnav-pill" @click="scrollToSection('qsec-ms')">
                            <i class="ph ph-check-square"></i>
                            <span>2. Selección Múltiple ({{ msAnsweredCount }}/{{ quizData.multiSelectQuestions ? quizData.multiSelectQuestions.length : 0 }})</span>
                        </button>
                        <button type="button" class="quiz-subnav-pill" @click="scrollToSection('qsec-match')">
                            <i class="ph ph-arrows-split"></i>
                            <span>3. Términos Pareados ({{ matchingAnsweredCount }}/{{ quizData.matchingQuestions ? quizData.matchingQuestions.length : 0 }})</span>
                        </button>
                        <button type="button" class="quiz-subnav-pill" @click="scrollToSection('qsec-tf')">
                            <i class="ph ph-chat-circle-dots"></i>
                            <span>4. V / F Justificados ({{ tfAnsweredCount }}/{{ quizData.trueFalseQuestions ? quizData.trueFalseQuestions.length : 0 }})</span>
                        </button>
                    </div>

                    <!-- BLOQUE DE PRUEBA PARA PLAYGROUND (SI EXISTE) -->
                    <div v-if="quizData.playgroundSetupBlock" style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 4px solid #2563eb; border-radius: var(--radius); padding: 1.25rem; margin-bottom: 1.75rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                            <strong style="color: var(--text-main); font-size: 0.95rem;">{{ quizData.playgroundSetupBlock.title }}</strong>
                            <button type="button" class="quiz-btn quiz-btn-primary" style="padding: 0.45rem 0.95rem; font-size: 0.8rem;" @click="copyPlaygroundSetup">
                                <i class="ph ph-copy"></i> Copiar script base al Playground
                            </button>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">{{ quizData.playgroundSetupBlock.description }}</p>
                        <pre style="background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 8px; font-size: 0.8rem; line-height: 1.5; overflow-x: auto; user-select: text !important; -webkit-user-select: text !important; margin: 0;">{{ quizData.playgroundSetupBlock.code }}</pre>
                    </div>

                    <!-- 1. ALTERNATIVAS (SELECCIÓN SIMPLE) -->
                    <template v-if="quizData.multipleChoiceQuestions && quizData.multipleChoiceQuestions.length > 0">
                        <div id="qsec-mc" class="quiz-section-header">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                                <h3><i class="ph ph-radio-button"></i> 1. Preguntas de Selección Simple (Alternativas)</h3>
                                <span class="quiz-tag blue" style="font-weight: 700;">{{ quizData.multipleChoiceQuestions.length * 3 }} Puntos (3 pts c/u)</span>
                            </div>
                            <p>Selecciona una única alternativa correcta para cada pregunta.</p>
                        </div>

                        <div class="quiz-questions-list">
                            <div v-for="q in quizData.multipleChoiceQuestions"
                                 :key="q.id"
                                 class="quiz-question-item"
                                 :class="{ 'item-answered': theoryAnswers[q.id] !== null && theoryAnswers[q.id] !== undefined }">
                                <div class="quiz-question-header" style="justify-content: space-between;">
                                    <div style="display: flex; align-items: flex-start; gap: 0.875rem; flex: 1;">
                                        <div class="quiz-q-num">{{ q.number }}</div>
                                        <div style="flex: 1;">
                                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
                                                <span v-if="q.topic" class="quiz-topic-chip">{{ q.topic }}</span>
                                                <button v-if="q.playgroundQuery"
                                                        type="button"
                                                        class="quiz-copy-query-btn"
                                                        @click="copyQueryText(q.playgroundQuery)">
                                                    <i class="ph ph-copy"></i> Copiar consulta para Playground
                                                </button>
                                            </div>
                                            <div class="quiz-question-text quiz-protected" v-html="formatInlineCode(q.question)"></div>
                                        </div>
                                    </div>
                                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; flex-shrink: 0;">
                                        <span class="quiz-tag purple" style="font-weight: 700;">{{ q.points || 3 }} pts</span>
                                        <span v-if="theoryAnswers[q.id] !== null && theoryAnswers[q.id] !== undefined" class="quiz-status-pill ok">
                                            <i class="ph-fill ph-check-circle"></i> Respondida
                                        </span>
                                    </div>
                                </div>
                                <div class="quiz-options-group">
                                    <label v-for="(opt, optIdx) in q.options"
                                           :key="optIdx"
                                           class="quiz-option-label"
                                           :class="{ selected: theoryAnswers[q.id] === optIdx }">
                                        <input type="radio"
                                               :name="'q-' + q.id"
                                               :value="optIdx"
                                               v-model="theoryAnswers[q.id]"
                                               @change="saveLocalAttempt">
                                        <span class="quiz-option-text quiz-protected" v-html="formatInlineCode(opt)"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- 2. SELECCIÓN MÚLTIPLE (CHECKBOXES) -->
                    <template v-if="quizData.multiSelectQuestions && quizData.multiSelectQuestions.length > 0">
                        <div id="qsec-ms" class="quiz-section-header">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                                <h3><i class="ph ph-check-square"></i> 2. Preguntas de Selección Múltiple</h3>
                                <span class="quiz-tag blue" style="font-weight: 700;">{{ quizData.multiSelectQuestions.length * 3 }} Puntos (3 pts c/u)</span>
                            </div>
                            <p>Marca todas las opciones que consideres correctas (pueden ser dos o más).</p>
                        </div>

                        <div class="quiz-questions-list">
                            <div v-for="q in quizData.multiSelectQuestions"
                                 :key="q.id"
                                 class="quiz-question-item"
                                 :class="{ 'item-answered': (multiSelectAnswers[q.id] || []).length > 0 }">
                                <div class="quiz-question-header" style="justify-content: space-between;">
                                    <div style="display: flex; align-items: flex-start; gap: 0.875rem; flex: 1;">
                                        <div class="quiz-q-num">{{ q.number }}</div>
                                        <div style="flex: 1;">
                                            <div v-if="q.topic" style="margin-bottom: 0.35rem;">
                                                <span class="quiz-topic-chip">{{ q.topic }}</span>
                                            </div>
                                            <div class="quiz-question-text quiz-protected" v-html="formatInlineCode(q.question)"></div>
                                        </div>
                                    </div>
                                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; flex-shrink: 0;">
                                        <span class="quiz-tag purple" style="font-weight: 700;">{{ q.points || 3 }} pts</span>
                                        <span v-if="(multiSelectAnswers[q.id] || []).length > 0" class="quiz-status-pill ok">
                                            <i class="ph-fill ph-check-circle"></i> {{ (multiSelectAnswers[q.id] || []).length }} marcadas
                                        </span>
                                    </div>
                                </div>
                                <div class="quiz-options-group">
                                    <label v-for="(opt, optIdx) in q.options"
                                           :key="optIdx"
                                           class="quiz-checkbox-label"
                                           :class="{ selected: (multiSelectAnswers[q.id] || []).includes(optIdx) }">
                                        <input type="checkbox"
                                               :checked="(multiSelectAnswers[q.id] || []).includes(optIdx)"
                                               @change="toggleMultiSelect(q.id, optIdx)">
                                        <span class="quiz-option-text quiz-protected" v-html="formatInlineCode(opt)"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- 3. TÉRMINOS PAREADOS (MATCHING) -->
                    <template v-if="quizData.matchingQuestions && quizData.matchingQuestions.length > 0">
                        <div id="qsec-match" class="quiz-section-header">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                                <h3><i class="ph ph-arrows-split"></i> 3. Términos Pareados</h3>
                                <span class="quiz-tag blue" style="font-weight: 700;">12 Puntos (2 pts c/u)</span>
                            </div>
                            <p>Relaciona cada concepto técnico con su definición exacta vista en las diapositivas.</p>
                        </div>

                        <div v-for="m in quizData.matchingQuestions" :key="m.id" style="margin-bottom: 2rem;">
                            <p style="font-weight: 600; margin-bottom: 1rem; color: var(--text-main);">{{ m.instruction }}</p>

                            <div class="quiz-matching-container">
                                <div v-for="term in m.terms" :key="term.id" class="quiz-matching-card"
                                     :class="{ 'item-answered': matchingAnswers[m.id] && matchingAnswers[m.id][term.id] }">
                                    <div class="quiz-matching-term" style="justify-content: space-between;">
                                        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                                            <i class="ph ph-cube"></i>
                                            <code>{{ term.name }}</code>
                                        </span>
                                        <span class="quiz-tag purple" style="font-size: 0.7rem;">2 pts</span>
                                    </div>
                                    <div>
                                        <select class="quiz-matching-select"
                                                :class="{ selected: matchingAnswers[m.id] && matchingAnswers[m.id][term.id] }"
                                                v-model="matchingAnswers[m.id][term.id]"
                                                @change="saveLocalAttempt">
                                            <option value="" disabled selected>-- Selecciona la definición correspondiente --</option>
                                            <option v-for="def in m.definitions" :key="def.id" :value="def.id">
                                                {{ def.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- 4. VERDADERO O FALSO CON JUSTIFICACIÓN OBLIGATORIA -->
                    <template v-if="quizData.trueFalseQuestions && quizData.trueFalseQuestions.length > 0">
                        <div id="qsec-tf" class="quiz-section-header">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                                <h3><i class="ph ph-chat-circle-dots"></i> 4. Verdadero o Falso con Justificación Obligatoria</h3>
                                <span class="quiz-tag blue" style="font-weight: 700;">{{ quizData.trueFalseQuestions.length * 3 }} Puntos (3 pts c/u: 1 pto V/F + 2 pts justif.)</span>
                            </div>
                            <p>Indica si cada afirmación es Verdadera o Falsa y <strong>argumenta obligatoriamente tu respuesta</strong> en el cuadro de texto.</p>
                        </div>

                        <div v-for="tf in quizData.trueFalseQuestions" :key="tf.id" class="quiz-tf-item"
                             :class="{ 'item-answered': getTfStatus(tf.id) === 'complete', 'item-partial': getTfStatus(tf.id) === 'partial' }">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem;">
                                <div style="flex: 1;">
                                    <div v-if="tf.topic" style="margin-bottom: 0.35rem;">
                                        <span class="quiz-topic-chip">{{ tf.topic }}</span>
                                    </div>
                                    <div class="quiz-tf-statement" style="margin-bottom: 0;">
                                        <strong>{{ tf.number }}.</strong> <span v-html="formatInlineCode(tf.statement)"></span>
                                    </div>
                                </div>
                                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; flex-shrink: 0;">
                                    <span class="quiz-tag purple" style="font-weight: 700;">{{ tf.points || 3 }} pts (1 + 2)</span>
                                    <span v-if="getTfStatus(tf.id) === 'complete'" class="quiz-status-pill ok">
                                        <i class="ph-fill ph-check-circle"></i> Completa
                                    </span>
                                    <span v-else-if="getTfStatus(tf.id) === 'partial'" class="quiz-status-pill warn">
                                        <i class="ph-fill ph-warning"></i> Falta justificar
                                    </span>
                                </div>
                            </div>

                            <div class="quiz-tf-buttons">
                                <button type="button"
                                        class="quiz-tf-btn"
                                        :class="{ 'active-v': trueFalseAnswers[tf.id] && trueFalseAnswers[tf.id].val === true }"
                                        @click="setTrueFalse(tf.id, true)">
                                    <i class="ph ph-check"></i> Verdadero
                                </button>
                                <button type="button"
                                        class="quiz-tf-btn"
                                        :class="{ 'active-f': trueFalseAnswers[tf.id] && trueFalseAnswers[tf.id].val === false }"
                                        @click="setTrueFalse(tf.id, false)">
                                    <i class="ph ph-x"></i> Falso
                                </button>
                            </div>

                            <div class="quiz-tf-justification-box">
                                <label :for="'just-' + tf.id">Justificación técnica obligatoria (2 puntos):</label>
                                <textarea :id="'just-' + tf.id"
                                          class="quiz-tf-textarea"
                                          v-model="trueFalseAnswers[tf.id].justification"
                                          @input="saveLocalAttempt"
                                          placeholder="Explica de forma breve y precisa por qué es verdadero o falso..."></textarea>
                            </div>
                        </div>
                    </template>

                    <div class="quiz-actions-bar">
                        <button class="quiz-btn quiz-btn-secondary" @click="goToStep('register')">
                            <i class="ph ph-arrow-left"></i> Modificar Datos
                        </button>
                        <button v-if="isQuiz2" class="quiz-btn quiz-btn-primary" @click="goToStep('codeCompletion')">
                            <span>Continuar a Completar Código</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                        <button v-else class="quiz-btn quiz-btn-primary" @click="goToStep('practice')">
                            <span>Continuar a Ejercicios Prácticos</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- ========================================================
                     PASO 3 (QUIZ 2 / 3): COMPLETAR CÓDIGO CON POOL DE OPCIONES
                     ======================================================== -->
                <div v-if="currentStep === 'codeCompletion'" class="quiz-card fade-in" @contextmenu="handleQuestionContextMenu">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h2 style="font-size: 1.25rem; font-weight: 700;">Parte 5: Completar Código con Pool de Opciones (18 Puntos — 3 pts c/u)</h2>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">
                                Selecciona la opción técnica correcta en cada menú desplegable incrustado en el código fuente (0.75 pts por cada espacio).
                            </p>
                        </div>
                        <span class="quiz-tag purple">Completados: {{ codeCompletionAnsweredCount }} de {{ totalCodeCompletionCount }}</span>
                    </div>

                    <div v-for="cc in quizData.codeCompletionQuestions" :key="cc.id" class="quiz-exercise-item"
                         :class="{ 'item-answered': isExerciseCompleted(cc) }">
                        <div class="quiz-exercise-header">
                            <div>
                                <h3 class="quiz-exercise-title quiz-protected">{{ cc.number }}. {{ cc.title }}</h3>
                            </div>
                            <div class="quiz-exercise-tags" style="align-items: center;">
                                <span v-if="isExerciseCompleted(cc)" class="quiz-status-pill ok">
                                    <i class="ph-fill ph-check-circle"></i> 4/4 Completados
                                </span>
                                <span class="quiz-tag blue" style="font-weight: 700;">{{ cc.points || 3 }} pts</span>
                                <span class="quiz-tag purple">{{ cc.topic }}</span>
                            </div>
                        </div>

                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;" v-html="formatInlineCode(cc.description)"></p>

                        <!-- Editor de Código con Selects incrustados en línea -->
                        <div class="quiz-code-editor-box">
                            <pre class="quiz-code-fillable"><template v-for="(seg, sIdx) in splitCodeTemplate(cc)" :key="sIdx"><span v-if="seg.type === 'text'" class="code-text">{{ seg.content }}</span><select v-else-if="seg.type === 'blank'"
            class="quiz-code-select"
            :class="{ selected: codeCompletionAnswers[cc.id] && codeCompletionAnswers[cc.id][seg.blankId] }"
            v-model="codeCompletionAnswers[cc.id][seg.blankId]"
            @change="saveLocalAttempt">
        <option value="" disabled selected>[ Seleccionar opción ]</option>
        <option v-for="(opt, optI) in seg.blankObj.options" :key="optI" :value="opt">{{ opt }}</option>
    </select></template></pre>
                        </div>

                    </div>

                    <div class="quiz-actions-bar">
                        <button class="quiz-btn quiz-btn-secondary" @click="goToStep('theory')">
                            <i class="ph ph-arrow-left"></i> Volver a Preguntas Teóricas
                        </button>
                        <button class="quiz-btn quiz-btn-primary" @click="goToStep('caseStudy')">
                            <span>{{ quizData.shortDiagnosticQuestions ? 'Continuar a Diagnóstico Práctico' : 'Continuar al Caso de Arquitectura' }}</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- ========================================================
                     PASO 4 (QUIZ 2 / 3): DIAGNÓSTICO PRÁCTICO O CASO DE ARQUITECTURA
                     ======================================================== -->
                <div v-if="currentStep === 'caseStudy'" class="quiz-card fade-in" @contextmenu="handleQuestionContextMenu">

                    <!-- MODO QUIZ 3: 2 PREGUNTAS CORTAS DE DIAGNÓSTICO (8 PTS C/U = 16 PTS) -->
                    <template v-if="quizData.shortDiagnosticQuestions && quizData.shortDiagnosticQuestions.length > 0">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                            <div>
                                <h2 style="font-size: 1.25rem; font-weight: 700;">Parte 6: Diagnóstico Práctico y Resolución en Playground (16 Puntos — 8 pts c/u)</h2>
                                <p style="color: var(--text-muted); font-size: 0.875rem;">
                                    Prueba las instrucciones en tu propio cluster desde el Playground de VS Code y escribe las respuestas solicitadas.
                                </p>
                            </div>
                            <span class="quiz-tag blue">Respondidas: {{ shortDiagnosticAnsweredCount }} de {{ totalShortDiagnosticCount }}</span>
                        </div>

                        <!-- Bloque de prueba en Playground para consulta rápida -->
                        <div v-if="quizData.playgroundSetupBlock" style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 4px solid #2563eb; border-radius: var(--radius); padding: 1.25rem; margin-bottom: 1.75rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                                <strong style="color: var(--text-main); font-size: 0.95rem;">{{ quizData.playgroundSetupBlock.title }}</strong>
                                <button type="button" class="quiz-btn quiz-btn-primary" style="padding: 0.45rem 0.95rem; font-size: 0.8rem;" @click="copyPlaygroundSetup">
                                    <i class="ph ph-copy"></i> Copiar script base al Playground
                                </button>
                            </div>
                            <pre style="background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 8px; font-size: 0.8rem; line-height: 1.5; overflow-x: auto; user-select: text !important; -webkit-user-select: text !important; margin: 0;">{{ quizData.playgroundSetupBlock.code }}</pre>
                        </div>

                        <div v-for="sd in quizData.shortDiagnosticQuestions" :key="sd.id" class="quiz-exercise-item"
                             :class="{ 'item-answered': shortDiagnosticAnswers[sd.id] && shortDiagnosticAnswers[sd.id].trim().length >= 15 }">
                            <div class="quiz-exercise-header">
                                <div>
                                    <h3 class="quiz-exercise-title quiz-protected">{{ sd.number }}. {{ sd.title }}</h3>
                                </div>
                                <div class="quiz-exercise-tags" style="align-items: center;">
                                    <span v-if="shortDiagnosticAnswers[sd.id] && shortDiagnosticAnswers[sd.id].trim().length >= 15" class="quiz-status-pill ok">
                                        <i class="ph-fill ph-check-circle"></i> Respondida
                                    </span>
                                    <span class="quiz-tag blue" style="font-weight: 700;">{{ sd.points || 8 }} Puntos</span>
                                    <span class="quiz-tag purple">{{ sd.topic }}</span>
                                </div>
                            </div>

                            <div class="quiz-exercise-desc" v-html="sd.scenarioHtml"></div>

                            <div class="quiz-code-container">
                                <div class="quiz-code-header">
                                    <span><i class="ph ph-terminal-window"></i> Respuesta y Código MongoDB ({{ sd.points || 8 }} puntos)</span>
                                    <div class="quiz-code-status" :class="{ ready: shortDiagnosticAnswers[sd.id] && shortDiagnosticAnswers[sd.id].trim().length >= 15 }">
                                        <i class="ph" :class="shortDiagnosticAnswers[sd.id] && shortDiagnosticAnswers[sd.id].trim().length >= 15 ? 'ph-check-circle' : 'ph-circle'"></i>
                                        <span>{{ shortDiagnosticAnswers[sd.id] && shortDiagnosticAnswers[sd.id].trim().length >= 15 ? 'Respuesta ingresada' : 'Pendiente' }}</span>
                                    </div>
                                </div>
                                <textarea class="quiz-code-textarea"
                                          style="min-height: 210px;"
                                          v-model="shortDiagnosticAnswers[sd.id]"
                                          :placeholder="sd.starterPlaceholder"
                                          @input="saveLocalAttempt"
                                          spellcheck="false"></textarea>
                            </div>
                        </div>
                    </template>

                    <!-- MODO QUIZ 2: CASO DE ARQUITECTURA ÚNICO -->
                    <template v-else-if="quizData.caseStudy">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                            <div>
                                <h2 style="font-size: 1.25rem; font-weight: 700;">Parte 4: Caso de Arquitectura y Relato de Solución (16 Puntos)</h2>
                                <p style="color: var(--text-muted); font-size: 0.875rem;">
                                    Analiza la problemática de producción y redacta tu relato de arquitectura técnica integral.
                                </p>
                            </div>
                            <span class="quiz-tag blue">Palabras: {{ caseStudyWordCount }}</span>
                        </div>

                        <div class="quiz-case-container">
                            <div v-html="quizData.caseStudy.scenario"></div>

                            <div style="margin-top: 1.5rem;">
                                <label style="display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">
                                    ✍️ Redacta aquí tu relato de solución técnica:
                                </label>
                                <textarea class="quiz-case-textarea"
                                          v-model="caseStudyAnswer"
                                          :placeholder="quizData.caseStudy.starterPlaceholder"
                                          @input="saveLocalAttempt"></textarea>

                                <div class="quiz-case-stats">
                                    <span>Recomendado: 250 a 450 palabras</span>
                                    <span :style="{ color: caseStudyWordCount >= 200 ? '#16a34a' : '#d97706', fontWeight: 600 }">
                                        {{ caseStudyWordCount }} palabras escritas
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="quiz-actions-bar">
                        <button class="quiz-btn quiz-btn-secondary" @click="goToStep('codeCompletion')">
                            <i class="ph ph-arrow-left"></i> Volver a Completar Código
                        </button>
                        <button class="quiz-btn quiz-btn-success" @click="promptSubmit">
                            <i class="ph ph-check-circle"></i> Finalizar y Generar Entrega (.md)
                        </button>
                    </div>
                </div>

                <!-- ========================================================
                     PASO 3 (QUIZ 1): PRÁCTICA TRADICIONAL
                     ======================================================== -->
                <div v-if="currentStep === 'practice' && !isQuiz2" class="quiz-card fade-in" @contextmenu="handleQuestionContextMenu">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h2 style="font-size: 1.25rem; font-weight: 700;">Parte 2: Bloques PL/SQL Prácticos</h2>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">
                                Desarrolla cada bloque en VS Code / SQL Developer sobre el esquema <code>clon_punto_ticket.sql</code> y pega tu código a continuación.
                            </p>
                        </div>
                        <span class="quiz-tag purple">Completados: {{ practiceAnsweredCount }} de {{ totalExercisesCount }}</span>
                    </div>

                    <div v-for="p in quizData.practicalExercises"
                         :key="p.id"
                         class="quiz-exercise-item">
                        <div class="quiz-exercise-header">
                            <div>
                                <h3 class="quiz-exercise-title quiz-protected">{{ p.title }}</h3>
                            </div>
                            <div class="quiz-exercise-tags">
                                <span class="quiz-tag purple">{{ p.concept }}</span>
                                <span class="quiz-tag blue"><i class="ph ph-table"></i> {{ p.targetTable }}</span>
                            </div>
                        </div>

                        <div class="quiz-exercise-desc quiz-protected" v-html="p.description"></div>

                        <div class="quiz-req-box quiz-protected">
                            <h4>Requerimientos Técnicos y de Excepciones:</h4>
                            <ul>
                                <li v-for="(req, rIdx) in p.requirements" :key="rIdx" v-html="req"></li>
                            </ul>
                        </div>

                        <div class="quiz-code-container">
                            <div class="quiz-code-header">
                                <span><i class="ph ph-file-code"></i> Bloque Anónimo PL/SQL</span>
                                <div class="quiz-code-status" :class="{ ready: practiceAnswers[p.id] && practiceAnswers[p.id].trim().length > 20 }">
                                    <i class="ph" :class="practiceAnswers[p.id] && practiceAnswers[p.id].trim().length > 20 ? 'ph-check-circle' : 'ph-circle'"></i>
                                    <span>{{ practiceAnswers[p.id] && practiceAnswers[p.id].trim().length > 20 ? 'Código pegado' : 'Pendiente de pegar' }}</span>
                                </div>
                            </div>
                            <textarea class="quiz-code-textarea"
                                      v-model="practiceAnswers[p.id]"
                                      :placeholder="p.starterPlaceholder"
                                      @input="saveLocalAttempt"
                                      spellcheck="false"></textarea>
                        </div>
                    </div>

                    <div class="quiz-actions-bar">
                        <button class="quiz-btn quiz-btn-secondary" @click="goToStep('theory')">
                            <i class="ph ph-arrow-left"></i> Volver a Preguntas Teóricas
                        </button>
                        <button class="quiz-btn quiz-btn-success" @click="promptSubmit">
                            <i class="ph ph-check-circle"></i> Finalizar y Generar Entrega (.md)
                        </button>
                    </div>
                </div>

                <!-- ========================================================
                     PASO 5: PANTALLA DE FINALIZACIÓN Y ENTREGA (.MD)
                     SIN FEEDBACK DE BUENO/MALO NI NOTAS EN PANTALLA
                     ======================================================== -->
                <div v-if="currentStep === 'completed'" class="quiz-completed-card fade-in" style="max-width: 780px;">
                    <div class="quiz-completed-icon">
                        <i class="ph-fill ph-check-circle"></i>
                    </div>
                    <h2>¡Evaluación Formativa Finalizada!</h2>
                    <p style="margin-bottom: 1.25rem;">
                        Estimado/a <strong>{{ student.name }} {{ student.lastname }}</strong>, tu archivo de entrega ha sido generado con éxito.
                    </p>

                    <!-- Resumen de Entrega -->
                    <div class="quiz-summary-grid">
                        <div class="quiz-summary-stat">
                            <span>Estudiante</span>
                            <strong>{{ student.name }} {{ student.lastname }}</strong>
                        </div>
                        <div class="quiz-summary-stat">
                            <span>RUT / Sección</span>
                            <strong>{{ student.rut }} · {{ student.section }}</strong>
                        </div>
                        <div class="quiz-summary-stat">
                            <span>Tiempo Empleado</span>
                            <strong>{{ formattedDuration }}</strong>
                        </div>
                        <div class="quiz-summary-stat">
                            <span>Ítems Completados</span>
                            <strong>{{ overallAnsweredCount }} / {{ overallTotalCount }} ({{ overallProgressPercent }}%)</strong>
                        </div>
                    </div>

                    <div class="quiz-download-box">
                        <p style="font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem; font-size: 1rem;">
                            📄 Archivo de entrega: <code>{{ downloadFilename }}</code>
                        </p>
                        <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 1.25rem;">
                            Envía este archivo <code>.md</code> a tu docente según las instrucciones de la clase.
                        </p>
                        <div class="quiz-download-actions">
                            <button class="quiz-btn quiz-btn-primary" @click="downloadMarkdownFile">
                                <i class="ph ph-download-simple"></i> Descargar Archivo .md
                            </button>
                            <button class="quiz-btn quiz-btn-secondary" @click="copyMarkdownToClipboard">
                                <i class="ph ph-copy"></i> Copiar .md al Portapapeles
                            </button>
                            <button class="quiz-btn quiz-btn-secondary" @click="showMarkdownPreview = !showMarkdownPreview">
                                <i class="ph" :class="showMarkdownPreview ? 'ph-eye-slash' : 'ph-eye'"></i>
                                <span>{{ showMarkdownPreview ? 'Ocultar Vista Previa' : 'Ver Vista Previa del .md' }}</span>
                            </button>
                        </div>

                        <!-- Vista previa del archivo Markdown exportado -->
                        <div v-if="showMarkdownPreview" class="quiz-md-preview-box">
                            <div class="quiz-md-preview-header">
                                <span>Vista previa de <code>{{ downloadFilename }}</code></span>
                                <button type="button" class="quiz-copy-query-btn" @click="copyMarkdownToClipboard">
                                    <i class="ph ph-copy"></i> Copiar todo
                                </button>
                            </div>
                            <pre class="quiz-md-preview-content">{{ generatedMarkdown }}</pre>
                        </div>
                    </div>

                    <!-- Opciones de Edición / Reinicio en Modalidad Formativa -->
                    <div v-if="quizData.simpleAuth" style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border);">
                        <button type="button" class="quiz-btn quiz-btn-secondary" style="font-size: 0.85rem; padding: 0.55rem 1rem;" @click="reopenForEditing">
                            <i class="ph ph-pencil-simple"></i> Volver a Editar mis Respuestas
                        </button>
                        <button type="button" class="quiz-btn-text" style="color: #dc2626;" @click="showConfirmResetModal = true">
                            <i class="ph ph-trash"></i> Reiniciar Intento en Blanco
                        </button>
                    </div>

                    <!-- Sección de Desbloqueo Docente -->
                    <div v-if="quizData.unlockHash" class="quiz-teacher-unlock-section">
                        <button class="quiz-btn-text" @click="showTeacherUnlockModal = true">
                            <i class="ph ph-lock-key-open"></i> Desbloquear / Reiniciar Intento (Solo Docente)
                        </button>
                    </div>
                </div>

            </template>

            <!-- MODAL DE CONFIRMACIÓN DE ENTREGA CON DETECCIÓN DE PENDIENTES -->
            <div v-if="showConfirmSubmitModal" class="quiz-auth-overlay">
                <div class="quiz-auth-card" style="max-width: 520px;">
                    <div class="quiz-auth-icon" :style="unansweredSummary.length === 0 ? 'background: #dcfce7; color: #16a34a;' : 'background: #fef3c7; color: #d97706;'">
                        <i class="ph" :class="unansweredSummary.length === 0 ? 'ph-check-circle' : 'ph-warning'"></i>
                    </div>
                    <h2>¿Confirmas la generación de tu entrega (.md)?</h2>

                    <div v-if="unansweredSummary.length === 0" style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 0.875rem 1rem; border-radius: var(--radius); font-size: 0.875rem; margin: 1rem 0; text-align: left;">
                        <strong>✅ ¡Todo completo!</strong> Has respondido los <strong>{{ overallTotalCount }} ítems</strong> de la evaluación.
                    </div>

                    <div v-else style="background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 0.875rem 1rem; border-radius: var(--radius); font-size: 0.85rem; margin: 1rem 0; text-align: left;">
                        <strong>⚠️ Atención: Tienes {{ unansweredSummary.length }} ítem(s) sin completar:</strong>
                        <p style="font-size: 0.8rem; color: #b45309; margin: 0.25rem 0 0.5rem 0;">Haz clic en cualquiera para ir a completarlo antes de entregar:</p>
                        <div class="quiz-pending-list">
                            <button v-for="(item, idx) in unansweredSummary"
                                    :key="idx"
                                    type="button"
                                    class="quiz-pending-item-btn"
                                    @click="jumpToPendingItem(item)">
                                <span>{{ item.label }}</span>
                                <i class="ph ph-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <p style="margin-bottom: 1.25rem; font-size: 0.85rem;">
                        Se descargará automáticamente tu archivo <code>.md</code> con tus respuestas registradas.
                    </p>

                    <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                        <button class="quiz-btn quiz-btn-secondary" @click="showConfirmSubmitModal = false">
                            Seguir Revisando
                        </button>
                        <button class="quiz-btn quiz-btn-success" @click="finalizeAndExport">
                            <i class="ph ph-download-simple"></i> Finalizar y Descargar .md
                        </button>
                    </div>
                </div>
            </div>

            <!-- MODAL DE CONFIRMACIÓN PARA REINICIAR EN BLANCO -->
            <div v-if="showConfirmResetModal" class="quiz-auth-overlay">
                <div class="quiz-auth-card">
                    <div class="quiz-auth-icon" style="background: #fef2f2; color: #dc2626;">
                        <i class="ph ph-trash"></i>
                    </div>
                    <h2>¿Reiniciar evaluación en blanco?</h2>
                    <p>
                        Se borrarán todas las respuestas guardadas en este navegador para comenzar un intento nuevo desde cero.
                    </p>
                    <div style="display: flex; gap: 0.75rem; justify-content: center;">
                        <button class="quiz-btn quiz-btn-secondary" @click="showConfirmResetModal = false">
                            Cancelar
                        </button>
                        <button class="quiz-btn quiz-btn-primary" style="background: #dc2626;" @click="confirmResetAttempt">
                            Sí, Borrar y Reiniciar
                        </button>
                    </div>
                </div>
            </div>

            <!-- MODAL DE DESBLOQUEO DOCENTE -->
            <div v-if="showTeacherUnlockModal" class="quiz-auth-overlay">
                <div class="quiz-auth-card">
                    <div class="quiz-auth-icon" style="background: #ede9fe; color: #7c3aed;">
                        <i class="ph ph-shield-check"></i>
                    </div>
                    <h2>Desbloqueo Docente</h2>
                    <p>Ingresa la contraseña de docente para autorizar un nuevo intento a este estudiante.</p>

                    <form class="quiz-auth-form" @submit.prevent="verifyTeacherUnlock">
                        <div class="quiz-input-group">
                            <label for="teacher-pass">Contraseña Docente</label>
                            <input id="teacher-pass"
                                   type="password"
                                   v-model="teacherPasswordInput"
                                   placeholder="Ingresa clave docente..."
                                   autocomplete="off"
                                   autofocus>
                        </div>

                        <div v-if="teacherUnlockError" class="quiz-auth-error">
                            <i class="ph ph-warning-circle"></i>
                            <span>Contraseña docente incorrecta.</span>
                        </div>

                        <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                            <button type="button" class="quiz-btn quiz-btn-secondary" style="flex: 1;" @click="showTeacherUnlockModal = false">
                                Cancelar
                            </button>
                            <button type="submit" class="quiz-btn quiz-btn-primary" style="flex: 1;">
                                Reiniciar Intento
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- TOAST FLOTANTE -->
            <div v-if="showToastFlag" class="quiz-toast">
                <i class="ph ph-info" style="font-size: 1.25rem; color: #60a5fa;"></i>
                <span>{{ toastMessage }}</span>
            </div>

        </div>
    `
};
