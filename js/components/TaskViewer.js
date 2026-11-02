// TaskViewer.js — Página de Tarea (qué hacer, qué entregar, misiones con progreso)
// Plataforma Docente — Taller de Bases de Datos
// Guarda el avance de cada estudiante en localStorage (clave: task_<id>).

const TaskViewer = {
    props: {
        taskData: { type: Object, required: true }
    },
    emits: ['open-session'],
    data() {
        return {
            done: {},
            copied: false
        };
    },
    created() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) this.done = JSON.parse(saved);
        } catch (e) {
            this.done = {};
        }
    },
    computed: {
        storageKey() {
            return `task_${this.taskData.id}`;
        },
        missionsDone() {
            return this.taskData.missions.filter(m => this.done[m.id]).length;
        },
        extrasDone() {
            return this.taskData.extras.filter(x => this.done[x.id]).length;
        },
        percent() {
            return Math.round((this.missionsDone / this.taskData.missions.length) * 100);
        }
    },
    methods: {
        toggle(id) {
            this.done[id] = !this.done[id];
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.done));
            } catch (e) { /* almacenamiento no disponible */ }
        },
        resetProgress() {
            if (!confirm('¿Borrar tu avance de esta tarea en este navegador?')) return;
            this.done = {};
            try { localStorage.removeItem(this.storageKey); } catch (e) { /* noop */ }
        },
        copyUri() {
            const text = this.taskData.connection.uri;
            const finish = () => {
                this.copied = true;
                setTimeout(() => { this.copied = false; }, 2000);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(finish).catch(() => {});
            }
        }
    },
    template: `
    <div class="task fade-in">
        <header class="task-header">
            <span class="task-tag"><i class="ph-fill ph-push-pin"></i> Tarea</span>
            <h1>{{ taskData.title }}</h1>
            <p class="task-subtitle">{{ taskData.subtitle }}</p>
            <div class="task-meta">
                <span v-for="m in taskData.meta" :key="m.label"><i :class="['ph', m.icon]"></i> {{ m.label }}</span>
            </div>
        </header>

        <section class="task-goal">
            <div class="task-goal-card do">
                <h2><i class="ph-fill ph-target"></i> Qué debes hacer</h2>
                <p v-html="taskData.doText"></p>
            </div>
            <div class="task-goal-card deliver">
                <h2><i class="ph-fill ph-paper-plane-tilt"></i> Qué debes entregar</h2>
                <p v-html="taskData.deliverText"></p>
            </div>
        </section>

        <section class="task-help">
            <i class="ph-fill ph-presentation-chart"></i>
            <p>{{ taskData.help }}</p>
            <button class="task-btn" @click="$emit('open-session', taskData.sessionId)">
                <i class="ph ph-arrow-square-out"></i> Abrir {{ taskData.sessionLabel }}
            </button>
        </section>

        <section class="task-card">
            <h2><i class="ph ph-plugs-connected"></i> Datos de conexión</h2>
            <dl class="task-conn">
                <div><dt>Usuario</dt><dd><code>{{ taskData.connection.user }}</code></dd></div>
                <div><dt>Clave</dt><dd>La entrega el docente por mensaje</dd></div>
                <div><dt>Base de datos</dt><dd><code>{{ taskData.connection.database }}</code></dd></div>
                <div><dt>Colección</dt><dd><code>{{ taskData.connection.collection }}</code></dd></div>
            </dl>
            <div class="task-uri">
                <code>{{ taskData.connection.uri }}</code>
                <button class="task-btn ghost" @click="copyUri">
                    <i :class="['ph', copied ? 'ph-check' : 'ph-copy']"></i> {{ copied ? 'Copiado' : 'Copiar' }}
                </button>
            </div>
            <p class="task-note">{{ taskData.connection.note }}</p>
            <p class="task-note warn"><i class="ph-fill ph-info"></i> {{ taskData.firstNote }}</p>
        </section>

        <section class="task-card">
            <div class="task-progress-head">
                <h2><i class="ph ph-list-checks"></i> Misiones</h2>
                <span class="task-progress-label">{{ missionsDone }} de {{ taskData.missions.length }}</span>
            </div>
            <div class="task-bar"><div class="task-bar-fill" :style="{ width: percent + '%' }"></div></div>

            <ol class="task-missions">
                <li v-for="(m, i) in taskData.missions" :key="m.id" :class="{ done: done[m.id] }">
                    <label class="task-check">
                        <input type="checkbox" :checked="!!done[m.id]" @change="toggle(m.id)">
                        <span class="task-box"><i class="ph-bold ph-check"></i></span>
                    </label>
                    <div class="task-mission-body">
                        <h3><span class="task-num">{{ i + 1 }}</span> {{ m.title }}</h3>
                        <p v-html="m.what"></p>
                        <p class="task-evidence"><i class="ph ph-camera"></i> <strong>Captura:</strong> {{ m.evidence }}</p>
                    </div>
                </li>
            </ol>
        </section>

        <section class="task-card extras">
            <div class="task-progress-head">
                <h2><i class="ph ph-rocket-launch"></i> Desafíos extra <small>(opcionales)</small></h2>
                <span class="task-progress-label">{{ extrasDone }} de {{ taskData.extras.length }}</span>
            </div>
            <p class="task-note">Para quien quiera profundizar.</p>
            <ul class="task-extras">
                <li v-for="x in taskData.extras" :key="x.id" :class="{ done: done[x.id] }">
                    <label class="task-check">
                        <input type="checkbox" :checked="!!done[x.id]" @change="toggle(x.id)">
                        <span class="task-box"><i class="ph-bold ph-check"></i></span>
                    </label>
                    <div>
                        <strong>{{ x.title }}:</strong> <span v-html="x.what"></span>
                    </div>
                </li>
            </ul>
            <p class="task-note">{{ taskData.extrasNote }}</p>
        </section>

        <section class="task-card danger">
            <h2><i class="ph-fill ph-warning"></i> Reglas del directorio compartido</h2>
            <ul>
                <li v-for="r in taskData.rules" :key="r">{{ r }}</li>
            </ul>
        </section>

        <section class="task-card">
            <h2><i class="ph ph-paper-plane-tilt"></i> Cómo entregar</h2>
            <ol class="task-steps">
                <li v-for="s in taskData.delivery.steps" :key="s">{{ s }}</li>
            </ol>
            <div class="task-final">
                <label v-for="c in taskData.delivery.checks" :key="c.id" class="task-final-item" :class="{ done: done[c.id] }">
                    <input type="checkbox" :checked="!!done[c.id]" @change="toggle(c.id)">
                    <span class="task-box"><i class="ph-bold ph-check"></i></span>
                    <span>{{ c.label }}</span>
                </label>
            </div>
        </section>

        <p class="task-footer">
            <button class="task-reset" @click="resetProgress"><i class="ph ph-arrow-counter-clockwise"></i> Reiniciar mi avance</button>
            <span>Tu avance se guarda solo en este navegador.</span>
        </p>
    </div>
    `
};
