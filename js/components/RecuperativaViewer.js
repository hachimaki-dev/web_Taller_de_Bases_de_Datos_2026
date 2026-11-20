// RecuperativaViewer.js — Componente interactivo para Evaluación Recuperativa (2 de 6 problemas + Espacio de Resolución + Defensa Línea por Línea)

const RecuperativaViewer = {
    props: {
        evalData: { type: Object, required: true }
    },
    data() {
        return {
            currentTab: 'problemas', // 'instrucciones' | 'problemas' | 'resolucion' | 'rubrica'
            selectedIds: [],         // máximo 2 IDs de problemas elegidos
            activeDraftId: null,     // ID del problema activo en "Mi Espacio de Resolución"
            drafts: {},              // { [problemId]: 'codigo PL/SQL...' }
            prepChecks: {},          // { [idx]: boolean }
            copiedId: null,
            warningMsg: ''
        };
    },
    computed: {
        selectedProblems() {
            return this.evalData.problems.filter(p => this.selectedIds.includes(p.id));
        },
        activeProblem() {
            if (this.selectedProblems.length === 0) return null;
            return this.selectedProblems.find(p => p.id === this.activeDraftId) || this.selectedProblems[0];
        },
        prepProgress() {
            const total = this.evalData.defenseChecklist.length;
            if (!total) return 0;
            const done = Object.values(this.prepChecks).filter(Boolean).length;
            return Math.round((done / total) * 100);
        }
    },
    created() {
        this.loadState();
    },
    methods: {
        storageKey(suffix) {
            return `recup_${this.evalData.id}_${suffix}`;
        },
        loadState() {
            try {
                const savedSel = localStorage.getItem(this.storageKey('selected'));
                if (savedSel) this.selectedIds = JSON.parse(savedSel);
                const savedDrafts = localStorage.getItem(this.storageKey('drafts'));
                if (savedDrafts) this.drafts = JSON.parse(savedDrafts);
                const savedChecks = localStorage.getItem(this.storageKey('checks'));
                if (savedChecks) this.prepChecks = JSON.parse(savedChecks);
            } catch (e) {}

            // Inicializar plantillas base si no hay borrador
            this.evalData.problems.forEach(p => {
                if (this.drafts[p.id] === undefined) {
                    this.drafts[p.id] = p.starterTemplate || '';
                }
            });
            if (this.selectedIds.length > 0) {
                this.activeDraftId = this.selectedIds[0];
            }
        },
        saveState() {
            try {
                localStorage.setItem(this.storageKey('selected'), JSON.stringify(this.selectedIds));
                localStorage.setItem(this.storageKey('drafts'), JSON.stringify(this.drafts));
                localStorage.setItem(this.storageKey('checks'), JSON.stringify(this.prepChecks));
            } catch (e) {}
        },
        isSelected(id) {
            return this.selectedIds.includes(id);
        },
        toggleSelect(id) {
            this.warningMsg = '';
            if (this.isSelected(id)) {
                this.selectedIds = this.selectedIds.filter(x => x !== id);
                if (this.activeDraftId === id) {
                    this.activeDraftId = this.selectedIds[0] || null;
                }
            } else {
                if (this.selectedIds.length >= this.evalData.maxSelection) {
                    this.warningMsg = `Ya seleccionaste ${this.evalData.maxSelection} problemas. Desmarca uno primero si deseas cambiar tu elección.`;
                    return;
                }
                this.selectedIds.push(id);
                this.selectedIds.sort((a, b) => a - b);
                if (!this.activeDraftId) this.activeDraftId = id;
            }
            this.saveState();
        },
        goToWorkspace(problemId) {
            if (problemId) this.activeDraftId = problemId;
            else if (this.selectedProblems.length > 0) this.activeDraftId = this.selectedProblems[0].id;
            this.currentTab = 'resolucion';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        handleTabKey(event, problemId) {
            const el = event.target;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const val = this.drafts[problemId] || '';
            this.drafts[problemId] = val.substring(0, start) + '    ' + val.substring(end);
            this.$nextTick(() => {
                el.selectionStart = el.selectionEnd = start + 4;
            });
            this.saveState();
        },
        resetDraft(problem) {
            if (confirm(`¿Restaurar la plantilla inicial para el Problema ${problem.id}? Se perderá el borrador actual de este bloque.`)) {
                this.drafts[problem.id] = problem.starterTemplate || '';
                this.saveState();
            }
        },
        copyCode(problemId) {
            const text = this.drafts[problemId] || '';
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.copiedId = problemId;
                    setTimeout(() => { this.copiedId = null; }, 2000);
                });
            }
        },
        downloadSingleSql(problem) {
            const content = this.drafts[problem.id] || '';
            this.triggerDownload(`bloque_problema_${problem.id}.sql`, content);
        },
        downloadBothSql() {
            if (this.selectedProblems.length === 0) return;
            const header = `/* ============================================================\n   EVALUACION RECUPERATIVA UNIDAD 1 - TALLER DE BASES DE DATOS\n   Problemas seleccionados: ${this.selectedProblems.map(p => 'P' + p.id).join(' y ')}\n   ============================================================ */\n\n`;
            const body = this.selectedProblems.map((p, idx) => {
                return `/* --- BLOQUE ${idx + 1}: PROBLEMA ${p.id} - ${p.title} --- */\n${this.drafts[p.id] || ''}\n`;
            }).join('\n\n');
            this.triggerDownload('recuperativa_u1_mis_2_bloques.sql', header + body);
        },
        triggerDownload(filename, content) {
            const blob = new Blob([content], { type: 'text/sql;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        togglePrepCheck(idx) {
            this.prepChecks[idx] = !this.prepChecks[idx];
            this.saveState();
        }
    },
    template: `
    <div class="evaluation-viewer recup-viewer fade-in">
        <!-- Hero Header -->
        <div class="eval-hero recup-hero">
            <div class="eval-badge" style="background: rgba(251, 191, 36, 0.2); color: #fde68a; border: 1px solid rgba(251, 191, 36, 0.35);">
                <i class="ph ph-exam"></i> {{ evalData.badge }}
            </div>
            <h1 class="eval-title">{{ evalData.title }}</h1>
            <p class="eval-subtitle">{{ evalData.subtitle }}</p>

            <!-- Cards de Ponderación -->
            <div class="eval-weights-grid">
                <div v-for="w in evalData.weights" :key="w.title" class="eval-weight-card" :style="{ borderTopColor: w.color }">
                    <div class="weight-icon" :style="{ background: w.bgColor, color: w.color }">
                        <i class="ph" :class="w.icon"></i>
                    </div>
                    <div class="weight-main">
                        <span class="weight-pct" :style="{ color: w.color }">{{ w.percentage }}</span>
                        <h3 class="weight-title">{{ w.title }}</h3>
                        <span class="weight-type type-indiv">
                            <i class="ph ph-user"></i> {{ w.type }}
                        </span>
                    </div>
                    <p class="weight-desc">{{ w.desc }}</p>
                    <div class="weight-timing"><i class="ph ph-clock"></i> {{ w.timing }}</div>
                </div>
            </div>
        </div>

        <!-- Barra de estado de selección -->
        <div class="recup-selection-bar">
            <div class="recup-sel-info">
                <span class="recup-sel-pill" :class="{ ready: selectedIds.length === evalData.maxSelection }">
                    <i class="ph" :class="selectedIds.length === evalData.maxSelection ? 'ph-check-circle' : 'ph-hand-pointing'"></i>
                    Problemas elegidos: <strong>{{ selectedIds.length }} / {{ evalData.maxSelection }}</strong>
                </span>
                <span v-if="selectedProblems.length > 0" class="recup-sel-names">
                    <span v-for="p in selectedProblems" :key="'chip-'+p.id" class="recup-chip" :style="{ borderColor: p.color, color: p.color }">
                        {{ p.code }}: {{ p.title }}
                    </span>
                </span>
                <span v-else class="recup-sel-hint">Selecciona 2 problemas del catálogo para habilitar tu espacio de resolución.</span>
            </div>
            <button v-if="selectedProblems.length > 0" class="check-btn recup-go-btn" @click="goToWorkspace()">
                <i class="ph ph-code"></i> Ir a Resolver ({{ selectedProblems.length }})
            </button>
        </div>

        <!-- Pestañas -->
        <div class="tabs eval-tabs">
            <button class="tab" :class="{ active: currentTab === 'problemas' }" @click="currentTab = 'problemas'">
                <i class="ph ph-squares-four"></i> 6 Problemas (Elige 2)
            </button>
            <button class="tab" :class="{ active: currentTab === 'resolucion' }" @click="currentTab = 'resolucion'">
                <i class="ph ph-terminal-window"></i> Mi Espacio de Resolución
                <span v-if="selectedIds.length > 0" class="recup-tab-count">{{ selectedIds.length }}</span>
            </button>
            <button class="tab" :class="{ active: currentTab === 'instrucciones' }" @click="currentTab = 'instrucciones'">
                <i class="ph ph-book-open"></i> Reglas e Instrucciones
            </button>
            <button class="tab" :class="{ active: currentTab === 'rubrica' }" @click="currentTab = 'rubrica'">
                <i class="ph ph-scales"></i> Rúbrica (10% / 90%)
            </button>
        </div>

        <!-- TAB 1: CATÁLOGO DE 6 PROBLEMAS -->
        <div v-if="currentTab === 'problemas'" class="eval-panel fade-in">
            <div v-if="warningMsg" class="recup-alert-warning">
                <i class="ph ph-warning-circle"></i>
                <span>{{ warningMsg }}</span>
                <button @click="warningMsg = ''"><i class="ph ph-x"></i></button>
            </div>

            <div class="recup-problems-list">
                <div v-for="p in evalData.problems" :key="p.id"
                     class="recup-problem-card"
                     :class="{ selected: isSelected(p.id) }"
                     :style="isSelected(p.id) ? { borderColor: p.color } : {}">
                    <div class="recup-problem-header">
                        <div class="recup-problem-title-wrap">
                            <span class="recup-p-badge" :style="{ background: p.color }">
                                <i class="ph" :class="p.icon"></i> Problema {{ p.id }}
                            </span>
                            <h3>{{ p.title }}</h3>
                        </div>
                        <button class="recup-select-btn"
                                :class="{ active: isSelected(p.id) }"
                                :style="isSelected(p.id) ? { background: p.color, borderColor: p.color } : {}"
                                @click="toggleSelect(p.id)">
                            <i class="ph" :class="isSelected(p.id) ? 'ph-check-circle' : 'ph-plus-circle'"></i>
                            {{ isSelected(p.id) ? 'Seleccionado' : 'Elegir este problema' }}
                        </button>
                    </div>

                    <p class="recup-problem-summary">{{ p.summary }}</p>

                    <div class="recup-tables-row">
                        <span class="recup-tables-label"><i class="ph ph-database"></i> Tablas Punto Ticket:</span>
                        <code v-for="t in p.tables" :key="t" class="recup-table-tag">{{ t }}</code>
                    </div>

                    <div class="recup-reqs-grid">
                        <div v-for="req in p.requirements" :key="req.label" class="recup-req-item">
                            <span class="recup-req-label">{{ req.label }}</span>
                            <p v-html="req.text"></p>
                        </div>
                    </div>

                    <div v-if="isSelected(p.id)" class="recup-card-footer">
                        <span class="recup-selected-note"><i class="ph ph-check"></i> Incluido en tus 2 bloques a entregar y defender.</span>
                        <button class="recup-open-editor-link" @click="goToWorkspace(p.id)">
                            Abrir en Mi Espacio de Resolución <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 2: ESPACIO DE RESOLUCIÓN -->
        <div v-if="currentTab === 'resolucion'" class="eval-panel fade-in">
            <div v-if="selectedProblems.length === 0" class="eval-card recup-empty-state">
                <i class="ph ph-hand-pointing"></i>
                <h3>Aún no has elegido tus 2 problemas</h3>
                <p>Ve a la pestaña <strong>6 Problemas (Elige 2)</strong> y selecciona los 2 casos que vas a resolver y defender línea por línea.</p>
                <button class="check-btn" @click="currentTab = 'problemas'">
                    <i class="ph ph-squares-four"></i> Ver los 6 Problemas
                </button>
            </div>

            <template v-else>
                <div v-if="selectedProblems.length < evalData.maxSelection" class="recup-alert-info">
                    <i class="ph ph-info"></i>
                    <span>Has elegido <strong>1 de 2</strong> problemas. Recuerda volver al catálogo para seleccionar tu segundo bloque obligatorio.</span>
                </div>

                <!-- Selector entre los 2 bloques elegidos -->
                <div class="recup-workspace-bar">
                    <div class="recup-block-switcher">
                        <button v-for="(p, idx) in selectedProblems" :key="'sw-'+p.id"
                                class="recup-block-btn"
                                :class="{ active: activeProblem && activeProblem.id === p.id }"
                                :style="activeProblem && activeProblem.id === p.id ? { borderColor: p.color, color: p.color } : {}"
                                @click="activeDraftId = p.id">
                            <span class="recup-block-num" :style="{ background: p.color }">Bloque {{ idx + 1 }}</span>
                            <span>{{ p.code }}: {{ p.title }}</span>
                        </button>
                    </div>
                    <button class="recup-download-all-btn" @click="downloadBothSql()">
                        <i class="ph ph-download-simple"></i> Descargar mis {{ selectedProblems.length }} bloques (.sql)
                    </button>
                </div>

                <!-- Editor + requisitos del problema activo -->
                <div v-if="activeProblem" class="eval-card recup-editor-card">
                    <div class="recup-editor-header">
                        <div>
                            <span class="recup-p-badge" :style="{ background: activeProblem.color }">
                                <i class="ph" :class="activeProblem.icon"></i> Problema {{ activeProblem.id }}
                            </span>
                            <h3 style="margin-top: 0.5rem;">{{ activeProblem.title }}</h3>
                        </div>
                        <div class="recup-editor-actions">
                            <button class="recup-action-btn" @click="copyCode(activeProblem.id)">
                                <i class="ph" :class="copiedId === activeProblem.id ? 'ph-check' : 'ph-copy'"></i>
                                {{ copiedId === activeProblem.id ? '¡Copiado!' : 'Copiar SQL' }}
                            </button>
                            <button class="recup-action-btn" @click="downloadSingleSql(activeProblem)">
                                <i class="ph ph-file-sql"></i> Descargar .sql
                            </button>
                            <button class="recup-action-btn danger" @click="resetDraft(activeProblem)">
                                <i class="ph ph-arrow-counter-clockwise"></i> Reiniciar
                            </button>
                        </div>
                    </div>

                    <details class="recup-reqs-collapse" open>
                        <summary><i class="ph ph-list-bullets"></i> Ver requisitos de este problema (Tablas: {{ activeProblem.tables.join(', ') }})</summary>
                        <div class="recup-reqs-grid" style="margin-top: 0.75rem;">
                            <div v-for="req in activeProblem.requirements" :key="'ws-'+req.label" class="recup-req-item">
                                <span class="recup-req-label">{{ req.label }}</span>
                                <p v-html="req.text"></p>
                            </div>
                        </div>
                    </details>

                    <div class="recup-textarea-wrap">
                        <div class="recup-textarea-bar">
                            <span><i class="ph ph-code"></i> Borrador Oracle PL/SQL (se guarda automáticamente en este navegador)</span>
                            <span>Cópialo y pruébalo en SQL Developer sobre <code>clon_punto_ticket.sql</code></span>
                        </div>
                        <textarea class="recup-code-editor"
                                  v-model="drafts[activeProblem.id]"
                                  @input="saveState()"
                                  @keydown.tab.prevent="handleTabKey($event, activeProblem.id)"
                                  spellcheck="false"
                                  placeholder="Escribe aquí tu bloque anónimo PL/SQL..."></textarea>
                    </div>
                </div>

                <!-- Checklist previo a pasar a defender -->
                <div class="eval-card" style="margin-top: 1.5rem;">
                    <div class="checklist-header">
                        <div>
                            <h3><i class="ph ph-microphone-stage"></i> Checklist Antes de Pasar a tu Defensa Oral</h3>
                            <p>Verifica estos puntos antes de acercarte al escritorio del docente:</p>
                        </div>
                        <div class="checklist-progress-box">
                            <span class="progress-num">{{ prepProgress }}%</span>
                            <span class="progress-lbl">Preparación</span>
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" :style="{ width: prepProgress + '%' }"></div>
                            </div>
                        </div>
                    </div>
                    <div class="recup-checklist">
                        <div v-for="(item, idx) in evalData.defenseChecklist" :key="'chk-'+idx"
                             class="report-item"
                             :class="{ completed: !!prepChecks[idx] }"
                             @click="togglePrepCheck(idx)"
                             style="cursor: pointer;">
                            <div class="item-check">
                                <i class="ph" :class="prepChecks[idx] ? 'ph-check-square-fill' : 'ph-square'"></i>
                            </div>
                            <div class="item-content">
                                <p style="color: var(--text-main); font-size: 0.875rem;">{{ item }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- TAB 3: REGLAS E INSTRUCCIONES -->
        <div v-if="currentTab === 'instrucciones'" class="eval-panel fade-in">
            <div class="eval-card">
                <h3><i class="ph ph-book-open"></i> Dinámica de la Evaluación Recuperativa</h3>
                <p style="margin-bottom: 1.25rem; color: var(--text-muted);">
                    Esta evaluación verifica tu dominio práctico y conceptual de la <strong>Unidad 1 (Oracle PL/SQL)</strong> sobre la base de datos <code>clon_punto_ticket.sql</code>.
                </p>

                <div class="recup-rules-grid">
                    <div v-for="r in evalData.rules" :key="r.title" class="recup-rule-box">
                        <i class="ph" :class="r.icon"></i>
                        <h4>{{ r.title }}</h4>
                        <p>{{ r.text }}</p>
                    </div>
                </div>

                <div class="recup-warning-banner">
                    <i class="ph-fill ph-warning-octagon"></i>
                    <div>
                        <strong>Cláusula de Autoría (Anti-copia):</strong>
                        <p>El peso principal de la evaluación está en tu <strong>defensa oral línea por línea (90%)</strong>. Si entregas código que compila pero no logras explicar con precisión qué hace una declaración, cursor, ciclo o excepción de tu propio script, esa dimensión se evaluará con <strong>0 puntos</strong>.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 4: RÚBRICA -->
        <div v-if="currentTab === 'rubrica'" class="eval-panel fade-in">
            <div class="eval-card">
                <h3><i class="ph ph-code"></i> Parte A: Código Funcional por Bloque (5 pts × 2 bloques = 10 pts · 10%)</h3>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">Se aplica por separado a cada uno de los 2 bloques elegidos.</p>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Nivel</th>
                                <th>Puntaje por Bloque</th>
                                <th>Criterio de Logro</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in evalData.rubricCode" :key="row.level">
                                <td><strong>{{ row.level }}</strong></td>
                                <td><span class="badge-pct pct-blue">{{ row.pts }}</span></td>
                                <td>{{ row.desc }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="eval-card" style="margin-top: 1.5rem;">
                <h3><i class="ph ph-microphone-stage"></i> Parte B: Defensa Oral Línea por Línea (45 pts × 2 bloques = 90 pts · 90%)</h3>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">
                    Al acercarte al docente, explicarás ambos bloques línea por línea. Cada bloque se evalúa en 4 dimensiones (máximo 45 pts por bloque).
                </p>
                <div class="table-responsive">
                    <table class="recup-rubric-table">
                        <thead>
                            <tr>
                                <th>Dimensión</th>
                                <th>Logrado (100%)</th>
                                <th>Medianamente Logrado</th>
                                <th>En Desarrollo</th>
                                <th>No Logrado (0%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in evalData.rubricOral" :key="row.dim">
                                <td><strong>{{ row.dim }}</strong><br><span class="badge-pct pct-purple" style="margin-top: 0.25rem; display: inline-block;">{{ row.maxPts }}</span></td>
                                <td>{{ row.logrado }}</td>
                                <td>{{ row.mediano }}</td>
                                <td>{{ row.desarrollo }}</td>
                                <td>{{ row.nologrado }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="tip-box" style="margin-top: 1.25rem;">
                    <strong><i class="ph ph-calculator"></i> Escala de Calificación:</strong>
                    Puntaje total máximo <strong>100 puntos</strong> (Bloque 1: 50 pts + Bloque 2: 50 pts). Escala chilena de <strong>1,0 a 7,0</strong> con <strong>60% de exigencia</strong> (60 puntos = nota 4,0).
                </div>
            </div>
        </div>
    </div>
    `
};

