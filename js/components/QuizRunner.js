// QuizRunner.js — Componente interactivo para Evaluaciones Formativas con Mecanismos Anticopia
// Plataforma Docente — Taller de Bases de Datos

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

            // Pasos del Quiz: 'register' | 'theory' | 'practice' | 'completed'
            currentStep: 'register',

            // Datos del Estudiante
            student: {
                name: '',
                lastname: '',
                rut: '',
                section: '005V'
            },

            // Respuestas del estudiante
            theoryAnswers: {},    // { q1: 0, q2: 2, ... }
            practiceAnswers: {},  // { p1: '', p2: '', ... }

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
        isRegisterValid() {
            return this.student.name.trim().length >= 2 &&
                this.student.lastname.trim().length >= 2 &&
                this.student.rut.trim().length >= 7;
        },
        theoryAnsweredCount() {
            return Object.values(this.theoryAnswers).filter(v => v !== null && v !== undefined).length;
        },
        practiceAnsweredCount() {
            return Object.values(this.practiceAnswers).filter(code => code && code.trim().length > 20).length;
        },
        totalQuestionsCount() {
            return this.quizData.multipleChoiceQuestions.length;
        },
        totalExercisesCount() {
            return this.quizData.practicalExercises.length;
        }
    },
    async mounted() {
        // Verificar si la sesión ya fue autorizada previamente en esta pestaña
        const sessionAuth = sessionStorage.getItem(`quiz_auth_${this.quizData.id}`);
        if (sessionAuth === 'true') {
            this.isAuthorized = true;
        }

        // Inicializar respuestas teóricas y prácticas
        this.quizData.multipleChoiceQuestions.forEach(q => {
            if (this.theoryAnswers[q.id] === undefined) {
                this.theoryAnswers[q.id] = null;
            }
        });
        this.quizData.practicalExercises.forEach(p => {
            if (this.practiceAnswers[p.id] === undefined) {
                this.practiceAnswers[p.id] = '';
            }
        });

        // Verificar si ya existe un intento guardado o completado en localStorage
        this.loadLocalAttempt();

        // Configurar listeners de integridad (visibilidad y desenfoque)
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        window.addEventListener('blur', this.handleWindowBlur);
        document.addEventListener('keydown', this.handleGlobalKeyDown);
    },
    beforeUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('blur', this.handleWindowBlur);
        document.removeEventListener('keydown', this.handleGlobalKeyDown);
    },
    methods: {
        // Función auxiliar para calcular SHA-256 usando Web Crypto API
        async sha256(message) {
            const msgBuffer = new TextEncoder().encode(message.trim());
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        },

        // Validar contraseña de acceso (Carlos94)
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
                this.authErrorMessage = 'Error de seguridad en el navegador. Intente en otro navegador.';
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

        // Mecanismos de Integridad y Detección de Foco
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
            this.showToast(`⚠️ Alerta de integridad: salida de pestaña detectada (${timeStr})`);
        },

        // Bloqueo de atajos de copia y F12 sobre los enunciados
        handleQuestionContextMenu(e) {
            e.preventDefault();
            this.showToast('Menú contextual desactivado por políticas de integridad del examen.');
        },

        handleGlobalKeyDown(e) {
            if (this.currentStep === 'completed') return;

            // Bloquear F12
            if (e.key === 'F12') {
                e.preventDefault();
                this.showToast('Inspección de elementos no permitida durante la evaluación.');
                return;
            }

            // Bloquear Ctrl+Shift+I / Cmd+Option+I
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
                this.showToast('Inspección de elementos no permitida.');
                return;
            }

            // Bloquear Ctrl+C en áreas protegidas si el foco no es un textarea
            const target = e.target;
            const isTextarea = target.tagName === 'TEXTAREA' || target.tagName === 'INPUT';
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C') && !isTextarea) {
                e.preventDefault();
                this.showToast('Copia de enunciados protegida por integridad académica.');
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

        // Prompt de confirmación de envío
        promptSubmit() {
            this.showConfirmSubmitModal = true;
        },

        // Finalizar y generar exportación Markdown (.md)
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

            // Calcular tiempo transcurrido
            let durationText = 'No determinado';
            if (this.startTime && this.endTime) {
                const diffMs = new Date(this.endTime) - new Date(this.startTime);
                const diffMins = Math.floor(diffMs / 60000);
                const diffSecs = Math.floor((diffMs % 60000) / 1000);
                durationText = `${diffMins} min ${diffSecs} seg`;
            }

            // Calcular puntaje teórico automáticamente (12 preguntas)
            let theoryScore = 0;
            this.quizData.multipleChoiceQuestions.forEach(q => {
                if (this.theoryAnswers[q.id] === q.correctAnswer) {
                    theoryScore++;
                }
            });

            let md = '';
            md += `# Evaluación Formativa N° 1: Bloques PL/SQL\n`;
            md += `**Asignatura:** ${this.quizData.sigla} ${this.quizData.courseName}\n`;
            md += `**Docente:** Revisión y Calificación en Clase\n\n`;
            md += `---\n\n`;

            md += `## 👤 Datos del Estudiante\n\n`;
            md += `- **Nombre Completo:** ${s.name} ${s.lastname}\n`;
            md += `- **RUT:** ${s.rut}\n`;
            md += `- **Sección:** ${s.section}\n`;
            md += `- **Fecha y Hora de Inicio:** ${startDate}\n`;
            md += `- **Fecha y Hora de Entrega:** ${endDate}\n`;
            md += `- **Tiempo Total Empleado:** ${durationText}\n\n`;

            md += `---\n\n`;
            md += `## 🛡️ Registro de Integridad y Auditoría\n\n`;
            md += `- **Total de salidas de pestaña / cambios de foco:** ${this.tabSwitchCount} veces\n`;
            if (this.integrityEvents.length > 0) {
                md += `\n### Detalle de eventos registrados:\n`;
                this.integrityEvents.forEach((ev, idx) => {
                    md += `${idx + 1}. [${ev.time}] Fase: *${ev.step}* — ${ev.reason}\n`;
                });
            } else {
                md += `- *No se registraron pérdidas de foco durante la sesión.*\n`;
            }
            md += `\n---\n\n`;

            md += `## 📋 Parte 1: Preguntas Teóricas (Selección Múltiple)\n\n`;
            md += `> **Puntaje Automático Calculado:** ${theoryScore} / ${this.totalQuestionsCount} puntos\n\n`;

            this.quizData.multipleChoiceQuestions.forEach(q => {
                const selectedIdx = this.theoryAnswers[q.id];
                const selectedText = selectedIdx !== null && selectedIdx !== undefined ? q.options[selectedIdx] : '(Sin responder)';
                const correctText = q.options[q.correctAnswer];
                const isCorrect = selectedIdx === q.correctAnswer;

                md += `### ${q.number}. ${q.question}\n`;
                md += `- **Respuesta del alumno:** ${selectedText}\n`;
                md += `- **Respuesta correcta:** ${correctText}\n`;
                md += `- **Calificación:** ${isCorrect ? '✅ CORRECTA (+1 pto)' : '❌ INCORRECTA (0 pts)'}\n\n`;
            });

            md += `---\n\n`;
            md += `## 💻 Parte 2: Bloques PL/SQL Prácticos\n\n`;

            this.quizData.practicalExercises.forEach(p => {
                const code = (this.practiceAnswers[p.id] || '').trim();
                md += `### ${p.title}\n`;
                md += `**Concepto:** ${p.concept} | **Tabla:** \`${p.targetTable}\`\n\n`;
                md += `#### Enunciado:\n`;
                md += `${p.description.replace(/<br>/g, '\n').replace(/<strong>/g, '**').replace(/<\/strong>/g, '**').replace(/<code>/g, '`').replace(/<\/code>/g, '`')}\n\n`;
                md += `#### Código Fuente Desarrollado por el Estudiante:\n\n`;
                if (code) {
                    md += `\`\`\`sql\n${code}\n\`\`\`\n\n`;
                } else {
                    md += `*(No se adjuntó código para este ejercicio)*\n\n`;
                }
                md += `---\n\n`;
            });

            md += `## 📝 Pauta de Calificación y Rúbrica Docente\n\n`;
            md += `| Ítem / Criterio | Puntaje Máximo | Puntaje Obtenido | Observaciones del Docente |\n`;
            md += `|---|:---:|:---:|---|\n`;
            md += `| **Parte 1:** Selección Múltiple (12 preguntas) | 12 pts | ${theoryScore} pts | Corrección automática |\n`;
            md += `| **Ejercicio 1:** Bloque RECORD + Excepciones | 5 pts | [   ] pts | |\n`;
            md += `| **Ejercicio 2:** Bloque VARRAY + Excepciones | 5 pts | [   ] pts | |\n`;
            md += `| **Ejercicio 3:** Bloque CURSOR Explícito + Cierre Seguro | 5 pts | [   ] pts | |\n`;
            md += `| **Ejercicio 4:** Bloque CURSOR con Parám. + Excep. Usuario | 5 pts | [   ] pts | |\n`;
            md += `| **TOTAL EVALUACIÓN FORMATIVA N° 1** | **32 pts** | **[   ] pts** | **Nota Final:** [    ] |\n\n`;
            md += `*Escala recomendada: 1.0 a 7.0 al 60% de exigencia (19 pts = 4.0).*\n`;

            this.generatedMarkdown = md;
            const cleanRut = (s.rut || 'sin_rut').replace(/[^a-zA-Z0-9]/g, '');
            this.downloadFilename = `Quiz1_BDY1103_${cleanRut}.md`;
        },

        // Descargar archivo .md
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

        // Copiar Markdown al portapapeles
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

        // Desbloqueo docente (clave docente2026)
        async verifyTeacherUnlock() {
            if (!this.teacherPasswordInput.trim()) return;
            try {
                const inputHash = await this.sha256(this.teacherPasswordInput);
                if (inputHash === this.quizData.unlockHash) {
                    // Resetear intento
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

        // Toast de aviso
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

            <!-- MODAL DE AUTENTICACIÓN CON CONTRASEÑA ENCRIPTADA -->
            <div v-if="!isAuthorized" class="quiz-auth-overlay">
                <div class="quiz-auth-card">
                    <div class="quiz-auth-icon">
                        <i class="ph ph-lock-key"></i>
                    </div>
                    <h2>Evaluación Formativa N° 1</h2>
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
                        <p>{{ quizData.courseName }} — Formato Formativo Presencial con Bloques PL/SQL</p>
                    </div>
                    <div class="quiz-meta-badges">
                        <div class="quiz-badge-integrity" :class="{ warning: tabSwitchCount > 0 }">
                            <i class="ph" :class="tabSwitchCount > 0 ? 'ph-warning' : 'ph-shield-check'"></i>
                            <span>{{ tabSwitchCount === 0 ? '🛡️ Integridad activa' : '⚠️ Salidas de foco: ' + tabSwitchCount }}</span>
                        </div>
                    </div>
                </div>

                <!-- Stepper de navegación (solo si no está completado) -->
                <div v-if="currentStep !== 'completed'" class="quiz-stepper">
                    <button class="quiz-step-btn"
                            :class="{ active: currentStep === 'register' }"
                            :disabled="currentStep !== 'register'"
                            @click="goToStep('register')">
                        <i class="ph ph-user"></i>
                        <span>1. Registro</span>
                    </button>
                    <button class="quiz-step-btn"
                            :class="{ active: currentStep === 'theory', completed: theoryAnsweredCount === totalQuestionsCount }"
                            :disabled="!startTime"
                            @click="goToStep('theory')">
                        <i class="ph ph-list-numbers"></i>
                        <span>2. Teoría ({{ theoryAnsweredCount }}/{{ totalQuestionsCount }})</span>
                    </button>
                    <button class="quiz-step-btn"
                            :class="{ active: currentStep === 'practice', completed: practiceAnsweredCount === totalExercisesCount }"
                            :disabled="!startTime"
                            @click="goToStep('practice')">
                        <i class="ph ph-code"></i>
                        <span>3. Práctica PL/SQL ({{ practiceAnsweredCount }}/{{ totalExercisesCount }})</span>
                    </button>
                </div>

                <!-- PASO 1: REGISTRO E INSTRUCCIONES -->
                <div v-if="currentStep === 'register'" class="quiz-card fade-in">
                    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="ph ph-identification-card" style="color: var(--primary);"></i> Identificación del Estudiante
                    </h2>
                    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
                        Ingresa tus datos oficiales para vincular tu archivo de entrega Markdown.
                    </p>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
                        <div class="quiz-input-group">
                            <label for="st-name">Nombres *</label>
                            <input id="st-name" type="text" v-model="student.name" placeholder="Ej. Juan">
                        </div>
                        <div class="quiz-input-group">
                            <label for="st-lastname">Apellidos *</label>
                            <input id="st-lastname" type="text" v-model="student.lastname" placeholder="Ej. Pérez">
                        </div>
                        <div class="quiz-input-group">
                            <label for="st-rut">RUT *</label>
                            <input id="st-rut" type="text" v-model="student.rut" placeholder="Ej. 19.123.456-7">
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

                <!-- PASO 2: PARTE 1 — PREGUNTAS TEÓRICAS -->
                <div v-if="currentStep === 'theory'" class="quiz-card fade-in" @contextmenu="handleQuestionContextMenu">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <h2 style="font-size: 1.25rem; font-weight: 700;">Parte 1: Preguntas de Selección Múltiple</h2>
                            <p style="color: var(--text-muted); font-size: 0.875rem;">Responde las 12 preguntas conceptuales sobre PL/SQL.</p>
                        </div>
                        <span class="quiz-tag blue">Respondidas: {{ theoryAnsweredCount }} de {{ totalQuestionsCount }}</span>
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

                    <div class="quiz-actions-bar">
                        <button class="quiz-btn quiz-btn-secondary" @click="goToStep('register')">
                            <i class="ph ph-arrow-left"></i> Modificar Datos
                        </button>
                        <button class="quiz-btn quiz-btn-primary" @click="goToStep('practice')">
                            <span>Continuar a Ejercicios Prácticos</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>

                <!-- PASO 3: PARTE 2 — EJERCICIOS PRÁCTICOS PL/SQL -->
                <div v-if="currentStep === 'practice'" class="quiz-card fade-in" @contextmenu="handleQuestionContextMenu">
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

                <!-- PASO 4: PANTALLA DE FINALIZACIÓN Y ENTREGA (SIN MOSTRAR NOTAS NI RESPUESTAS) -->
                <div v-if="currentStep === 'completed'" class="quiz-completed-card fade-in">
                    <div class="quiz-completed-icon">
                        <i class="ph-fill ph-check-circle"></i>
                    </div>
                    <h2>¡Evaluación Formativa Finalizada!</h2>
                    <p>
                        Estimado/a <strong>{{ student.name }} {{ student.lastname }}</strong>, tus respuestas teóricas y bloques PL/SQL han sido consolidados y registrados con éxito.
                    </p>
                    <p style="font-size: 0.875rem; color: var(--text-muted); background: #f8fafc; padding: 0.875rem; border-radius: var(--radius); border: 1px solid var(--border);">
                        🔒 <strong>Políticas de Calificación:</strong> Por disposición docente, los resultados y retroalimentación serán entregados tras la revisión del archivo de entrega.
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
                    <div class="quiz-teacher-unlock-section">
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
                        Una vez finalizado, se bloqueará la edición de tus respuestas y se generará tu archivo Markdown de entrega.
                    </p>

                    <div v-if="theoryAnsweredCount < totalQuestionsCount || practiceAnsweredCount < totalExercisesCount"
                         style="background: #fffbeb; border: 1px solid #fde68a; padding: 0.75rem; border-radius: var(--radius); font-size: 0.8125rem; color: #b45309; margin-bottom: 1.25rem; text-align: left;">
                        <strong>Atención:</strong> Aún tienes preguntas o ejercicios sin completar:
                        <ul style="margin-left: 1.25rem; margin-top: 0.25rem;">
                            <li v-if="theoryAnsweredCount < totalQuestionsCount">Preguntas teóricas respondidas: {{ theoryAnsweredCount }} / {{ totalQuestionsCount }}</li>
                            <li v-if="practiceAnsweredCount < totalExercisesCount">Bloques PL/SQL pegados: {{ practiceAnsweredCount }} / {{ totalExercisesCount }}</li>
                        </ul>
                    </div>

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
