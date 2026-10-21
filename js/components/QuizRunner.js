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

            // Respuestas del estudiante (Quiz 1 y Quiz 2)
            theoryAnswers: {},          // { mc1: 1, ... } (Selección Simple)
            multiSelectAnswers: {},     // { ms1: [0, 2], ... } (Selección Múltiple)
            matchingAnswers: {},        // { m1: { t1: 'd1', t2: 'd2' } } (Términos Pareados)
            trueFalseAnswers: {},       // { tf1: { val: true/false, justification: '...' } }
            codeCompletionAnswers: {},  // { cc1: { BLANK_1: 'IN NUMBER', ... } }
            caseStudyAnswer: '',        // Relato de arquitectura del estudiante
            practiceAnswers: {},        // { p1: 'código...' } (Para Quiz 1 tradicional)

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
            showTeacherUnlockModal: false,
            teacherPasswordInput: '',
            teacherUnlockError: false,

            // Markdown generado
            generatedMarkdown: '',
            downloadFilename: ''
        };
    },
    computed: {
        isQuiz2() {
            return !!(this.quizData.codeCompletionQuestions || this.quizData.caseStudy);
        },
        isRegisterValid() {
            return this.student.name.trim().length >= 2 &&
                this.student.lastname.trim().length >= 2 &&
                this.student.rut.trim().length >= 7;
        },
        theoryAnsweredCount() {
            let count = 0;
            if (this.quizData.multipleChoiceQuestions) {
                count += Object.values(this.theoryAnswers).filter(v => v !== null && v !== undefined).length;
            }
            if (this.quizData.multiSelectQuestions) {
                count += Object.values(this.multiSelectAnswers).filter(arr => Array.isArray(arr) && arr.length > 0).length;
            }
            if (this.quizData.matchingQuestions) {
                this.quizData.matchingQuestions.forEach(m => {
                    const ans = this.matchingAnswers[m.id] || {};
                    const matchedCount = Object.keys(ans).filter(k => !!ans[k]).length;
                    if (matchedCount === m.terms.length) count++;
                });
            }
            if (this.quizData.trueFalseQuestions) {
                count += Object.values(this.trueFalseAnswers).filter(tf => tf && tf.val !== null && tf.val !== undefined).length;
            }
            return count;
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

            // Si es Quiz 2 (Multiformato Fundamentos Unidad 2)
            if (this.isQuiz2) {
                this.downloadFilename = `Evaluacion2_BDY1103_${cleanRut}.md`;
                let md = '';
                md += `# ${this.quizData.title}\n`;
                md += `**Asignatura:** ${this.quizData.sigla} ${this.quizData.courseName}\n`;
                md += `**Tipo de Evaluación:** Formativa de Arquitectura PL/SQL (Unidad 2)\n\n`;
                md += `---\n\n`;

                md += `## 👤 1. Datos del Estudiante\n\n`;
                md += `- **Nombre Completo:** ${s.name} ${s.lastname}\n`;
                md += `- **RUT:** ${s.rut}\n`;
                md += `- **Sección:** ${s.section}\n`;
                md += `- **Fecha y Hora de Inicio:** ${startDate}\n`;
                md += `- **Fecha y Hora de Entrega:** ${endDate}\n`;
                md += `- **Tiempo Total Empleado:** ${durationText}\n\n`;
                md += `---\n\n`;

                // PARTE 1: ALTERNATIVAS
                md += `## 📋 2. Parte 1: Alternativas (Selección Simple)\n\n`;
                this.quizData.multipleChoiceQuestions.forEach(q => {
                    const selectedIdx = this.theoryAnswers[q.id];
                    const selectedText = selectedIdx !== null && selectedIdx !== undefined ? q.options[selectedIdx] : '(Sin responder)';
                    const correctText = q.options[q.correctAnswer];

                    md += `### Pregunta ${q.number}: ${q.question}\n`;
                    md += `- **Tópico:** \`${q.topic}\`\n`;
                    md += `- **Respuesta Seleccionada por el Estudiante:**\n  > ${selectedText}\n`;
                    md += `- **Respuesta Correcta Esperada (Docente/IA):**\n  > ${correctText}\n`;
                    md += `- **Justificación Técnica de Referencia:** ${q.explanation}\n\n`;
                });
                md += `---\n\n`;

                // PARTE 2: SELECCIÓN MÚLTIPLE
                md += `## 📋 3. Parte 2: Preguntas de Selección Múltiple (Checkboxes)\n\n`;
                this.quizData.multiSelectQuestions.forEach(q => {
                    const selectedArr = this.multiSelectAnswers[q.id] || [];
                    const selectedTexts = selectedArr.map(idx => q.options[idx]);
                    const correctTexts = q.correctAnswers.map(idx => q.options[idx]);

                    md += `### Pregunta ${q.number}: ${q.question}\n`;
                    md += `- **Tópico:** \`${q.topic}\`\n`;
                    md += `- **Opciones Seleccionadas por el Estudiante:**\n`;
                    if (selectedTexts.length > 0) {
                        selectedTexts.forEach(t => md += `  - [x] ${t}\n`);
                    } else {
                        md += `  *(Sin responder)*\n`;
                    }
                    md += `- **Opciones Correctas Esperadas (Docente/IA):**\n`;
                    correctTexts.forEach(t => md += `  - [x] ${t}\n`);
                    md += `- **Justificación Técnica:** ${q.explanation}\n\n`;
                });
                md += `---\n\n`;

                // PARTE 3: TÉRMINOS PAREADOS
                md += `## 📋 4. Parte 3: Términos Pareados (Matching de Conceptos)\n\n`;
                this.quizData.matchingQuestions.forEach(m => {
                    md += `### ${m.instruction}\n\n`;
                    md += `| N° | Concepto Técnico | Definición Seleccionada por el Estudiante | Definición Correcta (Referencia) |\n`;
                    md += `|:---:|---|---|---|\n`;
                    m.terms.forEach((t, i) => {
                        const selDefId = (this.matchingAnswers[m.id] || {})[t.id];
                        const selDefObj = m.definitions.find(d => d.id === selDefId);
                        const selDefText = selDefObj ? selDefObj.text : '*(Sin asociar)*';
                        const corrDefId = m.correctMatches[t.id];
                        const corrDefObj = m.definitions.find(d => d.id === corrDefId);
                        const corrDefText = corrDefObj ? corrDefObj.text : '';
                        md += `| ${i + 1} | **${t.name}** | ${selDefText} | ${corrDefText} |\n`;
                    });
                    md += `\n`;
                });
                md += `---\n\n`;

                // PARTE 4: VERDADERO O FALSO CON JUSTIFICACIÓN OBLIGATORIA
                md += `## 📋 5. Parte 4: Verdadero o Falso con Justificación Obligatoria\n\n`;
                this.quizData.trueFalseQuestions.forEach(tf => {
                    const ans = this.trueFalseAnswers[tf.id] || { val: null, justification: '' };
                    const userValText = ans.val === true ? 'VERDADERO' : (ans.val === false ? 'FALSO' : '(Sin seleccionar)');
                    const corrValText = tf.expectedValue === true ? 'VERDADERO' : 'FALSO';

                    md += `### Ítem ${tf.number}: "${tf.statement}"\n`;
                    md += `- **Tópico:** \`${tf.topic}\`\n`;
                    md += `- **Elección del Estudiante:** **${userValText}**\n`;
                    md += `- **Justificación Técnica Redactada por el Estudiante:**\n`;
                    if (ans.justification && ans.justification.trim()) {
                        md += `  > "${ans.justification.trim()}"\n`;
                    } else {
                        md += `  *(El estudiante no ingresó justificación obligatoria)*\n`;
                    }
                    md += `- **Valor Esperado (Docente/IA):** **${corrValText}**\n`;
                    md += `- **Pauta de Justificación Docente para Evaluación:**\n  > ${tf.referenceJustification}\n\n`;
                });
                md += `---\n\n`;

                // PARTE 5: COMPLETAR CÓDIGO (6 EJERCICIOS)
                md += `## 💻 6. Parte 5: Bloques de Código Completados con Pool de Opciones\n\n`;
                this.quizData.codeCompletionQuestions.forEach(cc => {
                    const ans = this.codeCompletionAnswers[cc.id] || {};

                    // Reconstruir el código con las selecciones del alumno
                    let reconstructedCode = cc.codeTemplate;
                    cc.blanks.forEach(b => {
                        const sel = ans[b.id] || `[PENDIENTE: ${b.id}]`;
                        reconstructedCode = reconstructedCode.replace(`[${b.id}]`, sel);
                    });

                    md += `### ${cc.title}\n`;
                    md += `- **Tópico:** \`${cc.topic}\`\n`;
                    md += `- **Enunciado:** ${cc.description}\n\n`;
                    md += `#### Código Ensamblado por el Estudiante:\n\`\`\`sql\n${reconstructedCode}\n\`\`\`\n\n`;
                    md += `#### Tabla de Opciones Seleccionadas vs Pauta Oficial:\n`;
                    md += `| Espacio | Opción Seleccionada por el Estudiante | Opción Correcta Oficial | Estado |\n`;
                    md += `|---|---|---|:---:|\n`;
                    cc.blanks.forEach(b => {
                        const sel = ans[b.id] || '(Sin seleccionar)';
                        const isOk = sel === b.correctOption;
                        md += `| \`${b.id}\` | \`${sel}\` | \`${b.correctOption}\` | ${isOk ? '✅ Coincide' : '❌ Discrepa'} |\n`;
                    });
                    md += `\n`;
                });
                md += `---\n\n`;

                // PARTE 6: CASO DE ARQUITECTURA Y RELATO
                md += `## 🏛️ 7. Parte 6: Caso de Arquitectura y Relato de Solución\n\n`;
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

                // GUÍA Y RÚBRICA PARA EL AGENTE IA
                md += `## 🤖 8. Guía de Evaluación para el Agente Evaluador de Inteligencia Artificial (IA)\n\n`;
                md += `> [!IMPORTANT]\n`;
                md += `> **Instrucciones para el Agente Evaluador:**\n`;
                md += `> Evalúa las respuestas del estudiante utilizando la siguiente escala y criterios oficiales:\n\n`;
                md += this.quizData.aiAgentEvaluationRubric || '';

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

                <!-- STEPPER DE NAVEGACIÓN -->
                <div v-if="currentStep !== 'completed'" class="quiz-stepper">
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

                    <!-- PASOS ESPECÍFICOS PARA QUIZ 2 -->
                    <template v-if="isQuiz2">
                        <button class="quiz-step-btn"
                                :class="{ active: currentStep === 'codeCompletion', completed: codeCompletionAnsweredCount === totalCodeCompletionCount }"
                                :disabled="!startTime"
                                @click="goToStep('codeCompletion')">
                            <i class="ph ph-code"></i>
                            <span>3. Completar Código ({{ codeCompletionAnsweredCount }}/{{ totalCodeCompletionCount }})</span>
                        </button>
                        <button class="quiz-step-btn"
                                :class="{ active: currentStep === 'caseStudy', completed: caseStudyWordCount >= 100 }"
                                :disabled="!startTime"
                                @click="goToStep('caseStudy')">
                            <i class="ph ph-buildings"></i>
                            <span>4. Caso Arquitectura</span>
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
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h2 style="font-size: 1.25rem; font-weight: 700;">Parte Teórica: Fundamentos PL/SQL</h2>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">Responde las preguntas teóricas basadas en las diapositivas de fundamentos.</p>
                        </div>
                        <span class="quiz-tag blue">Respondidas: {{ theoryAnsweredCount }} de {{ totalTheoryQuestionsCount }}</span>
                    </div>

                    <!-- 1. ALTERNATIVAS (SELECCIÓN SIMPLE) -->
                    <template v-if="quizData.multipleChoiceQuestions && quizData.multipleChoiceQuestions.length > 0">
                        <div class="quiz-section-header">
                            <h3><i class="ph ph-radio-button"></i> 1. Preguntas de Selección Simple (Alternativas)</h3>
                            <p>Selecciona una única alternativa correcta para cada pregunta.</p>
                        </div>

                        <div class="quiz-questions-list">
                            <div v-for="q in quizData.multipleChoiceQuestions"
                                 :key="q.id"
                                 class="quiz-question-item">
                                <div class="quiz-question-header">
                                    <div class="quiz-q-num">{{ q.number }}</div>
                                    <div class="quiz-question-text quiz-protected">{{ q.question }}</div>
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
                                        <span class="quiz-option-text quiz-protected">{{ opt }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- 2. SELECCIÓN MÚLTIPLE (CHECKBOXES) -->
                    <template v-if="quizData.multiSelectQuestions && quizData.multiSelectQuestions.length > 0">
                        <div class="quiz-section-header">
                            <h3><i class="ph ph-check-square"></i> 2. Preguntas de Selección Múltiple</h3>
                            <p>Marca todas las opciones que consideres correctas (pueden ser dos o más).</p>
                        </div>

                        <div class="quiz-questions-list">
                            <div v-for="q in quizData.multiSelectQuestions"
                                 :key="q.id"
                                 class="quiz-question-item">
                                <div class="quiz-question-header">
                                    <div class="quiz-q-num">{{ q.number }}</div>
                                    <div class="quiz-question-text quiz-protected">{{ q.question }}</div>
                                </div>
                                <div class="quiz-options-group">
                                    <label v-for="(opt, optIdx) in q.options"
                                           :key="optIdx"
                                           class="quiz-checkbox-label"
                                           :class="{ selected: (multiSelectAnswers[q.id] || []).includes(optIdx) }">
                                        <input type="checkbox"
                                               :checked="(multiSelectAnswers[q.id] || []).includes(optIdx)"
                                               @change="toggleMultiSelect(q.id, optIdx)">
                                        <span class="quiz-option-text quiz-protected">{{ opt }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- 3. TÉRMINOS PAREADOS (MATCHING) -->
                    <template v-if="quizData.matchingQuestions && quizData.matchingQuestions.length > 0">
                        <div class="quiz-section-header">
                            <h3><i class="ph ph-arrows-split"></i> 3. Términos Pareados</h3>
                            <p>Relaciona cada concepto técnico con su definición exacta vista en las diapositivas.</p>
                        </div>

                        <div v-for="m in quizData.matchingQuestions" :key="m.id" style="margin-bottom: 2rem;">
                            <p style="font-weight: 600; margin-bottom: 1rem; color: var(--text-main);">{{ m.instruction }}</p>

                            <div class="quiz-matching-container">
                                <div v-for="term in m.terms" :key="term.id" class="quiz-matching-card">
                                    <div class="quiz-matching-term">
                                        <i class="ph ph-cube"></i>
                                        <span>{{ term.name }}</span>
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
                        <div class="quiz-section-header">
                            <h3><i class="ph ph-chat-circle-dots"></i> 4. Verdadero o Falso con Justificación Obligatoria</h3>
                            <p>Indica si cada afirmación es Verdadera o Falsa y <strong>argumenta obligatoriamente tu respuesta</strong> en el cuadro de texto.</p>
                        </div>

                        <div v-for="tf in quizData.trueFalseQuestions" :key="tf.id" class="quiz-tf-item">
                            <div class="quiz-tf-statement">
                                <strong>{{ tf.number }}.</strong> {{ tf.statement }}
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
                                <label :for="'just-' + tf.id">Justificación técnica obligatoria (argumenta tu respuesta):</label>
                                <textarea :id="'just-' + tf.id"
                                          class="quiz-tf-textarea"
                                          v-model="trueFalseAnswers[tf.id].justification"
                                          @input="saveLocalAttempt"
                                          placeholder="Explica técnicamente por qué es verdadero o falso según lo aprendido en las diapositivas..."></textarea>
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
                     PASO 3 (QUIZ 2): COMPLETAR CÓDIGO CON POOL DE OPCIONES
                     ======================================================== -->
                <div v-if="currentStep === 'codeCompletion'" class="quiz-card fade-in" @contextmenu="handleQuestionContextMenu">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h2 style="font-size: 1.25rem; font-weight: 700;">Parte 3: Completar Código con Pool de Opciones</h2>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">
                                Selecciona la opción técnica correcta en cada menú desplegable incrustado en el código fuente.
                            </p>
                        </div>
                        <span class="quiz-tag purple">Completados: {{ codeCompletionAnsweredCount }} de {{ totalCodeCompletionCount }}</span>
                    </div>

                    <div v-for="cc in quizData.codeCompletionQuestions" :key="cc.id" class="quiz-exercise-item">
                        <div class="quiz-exercise-header">
                            <div>
                                <h3 class="quiz-exercise-title quiz-protected">{{ cc.number }}. {{ cc.title }}</h3>
                            </div>
                            <div class="quiz-exercise-tags">
                                <span class="quiz-tag purple">{{ cc.topic }}</span>
                            </div>
                        </div>

                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">
                            {{ cc.description }}
                        </p>

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
                            <span>Continuar al Caso de Arquitectura</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- ========================================================
                     PASO 4 (QUIZ 2): CASO DE ARQUITECTURA Y RELATO FINAL
                     ======================================================== -->
                <div v-if="currentStep === 'caseStudy'" class="quiz-card fade-in" @contextmenu="handleQuestionContextMenu">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h2 style="font-size: 1.25rem; font-weight: 700;">Parte 4: Caso de Arquitectura y Relato de Solución</h2>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">
                                Analiza la problemática de producción y redacta tu relato de arquitectura técnica integral.
                            </p>
                        </div>
                        <span class="quiz-tag blue">Palabras: {{ caseStudyWordCount }}</span>
                    </div>

                    <div class="quiz-case-container" v-if="quizData.caseStudy">
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
                <div v-if="currentStep === 'completed'" class="quiz-completed-card fade-in">
                    <div class="quiz-completed-icon">
                        <i class="ph-fill ph-check-circle"></i>
                    </div>
                    <h2>¡Evaluación Formativa Finalizada!</h2>
                    <p>
                        Estimado/a <strong>{{ student.name }} {{ student.lastname }}</strong>, tus respuestas y código han sido consolidados y registrados con éxito.
                    </p>
                    <p style="font-size: 0.875rem; color: var(--text-muted); background: #f8fafc; padding: 0.875rem; border-radius: var(--radius); border: 1px solid var(--border);">
                        🔒 <strong>Políticas de Evaluación:</strong> Esta prueba no entrega retroalimentación inmediata en pantalla. Se ha generado tu archivo de entrega Markdown (<code>.md</code>) para la revisión docente y evaluación mediante agente de IA.
                    </p>

                    <div class="quiz-download-box">
                        <p style="font-weight: 600; color: var(--text-main); margin-bottom: 1rem;">
                            Archivo generado: <code>{{ downloadFilename }}</code>
                        </p>
                        <div class="quiz-download-actions">
                            <button class="quiz-btn quiz-btn-primary" @click="downloadMarkdownFile">
                                <i class="ph ph-download-simple"></i> Descargar Archivo .md
                            </button>
                            <button class="quiz-btn quiz-btn-secondary" @click="copyMarkdownToClipboard">
                                <i class="ph ph-copy"></i> Copiar al Portapapeles
                            </button>
                        </div>
                    </div>

                    <!-- Sección de Desbloqueo Docente -->
                    <div v-if="quizData.unlockHash" class="quiz-teacher-unlock-section">
                        <button class="quiz-btn-text" @click="showTeacherUnlockModal = true">
                            <i class="ph ph-lock-key-open"></i> Desbloquear / Reiniciar Intento (Solo Docente)
                        </button>
                    </div>
                </div>

            </template>

            <!-- MODAL DE CONFIRMACIÓN DE ENTREGA -->
            <div v-if="showConfirmSubmitModal" class="quiz-auth-overlay">
                <div class="quiz-auth-card">
                    <div class="quiz-auth-icon" style="background: #fef3c7; color: #d97706;">
                        <i class="ph ph-warning"></i>
                    </div>
                    <h2>¿Confirmas el envío de tu evaluación?</h2>
                    <p>
                        Una vez finalizado, se bloqueará la edición de tus respuestas y se generará automáticamente tu archivo Markdown de entrega.
                    </p>

                    <div style="display: flex; gap: 0.75rem; justify-content: center;">
                        <button class="quiz-btn quiz-btn-secondary" @click="showConfirmSubmitModal = false">
                            Revisar más
                        </button>
                        <button class="quiz-btn quiz-btn-success" @click="finalizeAndExport">
                            Sí, Finalizar y Descargar
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
