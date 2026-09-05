// WorkshopRunner.js — Taller preparatorio interactivo para Evaluación 1
// Plataforma Docente — Taller de Bases de Datos

const WorkshopRunner = {
    props: {
        workshopData: { type: Object, required: true }
    },
    data() {
        return {
            currentSection: 0,
            showExample: [false, false, false, false, false],
            expandedPlsql: [true, true, true, true, true, true, true],
            expandedSummary: [false, false, false, false],
            mermaidSvg: '',
            mermaidRenderCount: 0,

            // UI & UX state
            lastSavedTime: null,
            savePulse: false,
            copiedMd: false,
            copiedMermaid: false,
            showResetModal: false,
            showCheatSheet: false,
            toastMessage: '',
            showToastFlag: false,

            // Section 1: Team & Context
            team: {
                projectName: '',
                members: [{ name: '', lastname: '' }],
                sector: '',
                businessDesc: '',
                problemDesc: '',
                objectiveDesc: ''
            },

            // Section 2: Entities & Attributes
            entities: [],

            // Section 3: Rules & Narratives
            rules: [],
            narratives: [],

            // Section 4: PL/SQL Component Plan
            plsql: {
                record: { name: '', fields: '', justification: '' },
                varray: { name: '', purpose: '', justification: '' },
                cursor: { masterQuery: '', params: '', flow: '' },
                exPredefined: [],
                exCustom: { name: '', code: '-20001', condition: '' },
                // Theory-only sections (research)
                procFunc: { understanding: '' },
                packages: { understanding: '' },
                triggers: { understanding: '' }
            }
        };
    },
    computed: {
        entityNames() {
            return this.entities.filter(e => e.name.trim()).map(e => e.name.trim().toUpperCase());
        },
        mermaidCode() {
            if (this.entities.length === 0) return '';
            let code = 'erDiagram\n';
            const validEntities = this.entities.filter(e => e.name.trim());
            validEntities.forEach(ent => {
                const name = ent.name.trim().toUpperCase().replace(/\s+/g, '_');
                code += `    ${name} {\n`;
                ent.attributes.filter(a => a.name.trim()).forEach(attr => {
                    const type = (attr.type || 'VARCHAR2').replace(/[^A-Za-z0-9_]/g, '');
                    const constraint = attr.pk ? 'PK' : attr.fk ? 'FK' : '';
                    code += `        ${type} ${attr.name.trim().toLowerCase()}${constraint ? ' "' + constraint + '"' : ''}\n`;
                });
                code += `    }\n`;
            });
            // Relationships from FKs
            validEntities.forEach(ent => {
                const eName = ent.name.trim().toUpperCase().replace(/\s+/g, '_');
                ent.attributes.filter(a => a.fk && a.fkRef).forEach(attr => {
                    const ref = attr.fkRef.trim().toUpperCase().replace(/\s+/g, '_');
                    if (validEntities.some(e => e.name.trim().toUpperCase().replace(/\s+/g, '_') === ref)) {
                        code += `    ${ref} ||--o{ ${eName} : ""\n`;
                    }
                });
            });
            return code;
        },
        sectionProgress() {
            const progress = [];
            // Section 1
            const s1 = [this.team.projectName, this.team.businessDesc, this.team.problemDesc, this.team.objectiveDesc];
            const s1f = s1.filter(v => v.trim().length > 0).length;
            const s1m = this.team.members.filter(m => m.name.trim()).length;
            progress.push(Math.round(((s1f + Math.min(s1m, 1)) / 5) * 100));

            // Section 2
            const entFilled = this.entities.filter(e => e.name.trim() && e.attributes.some(a => a.name.trim())).length;
            progress.push(this.entities.length === 0 ? 0 : Math.round((entFilled / Math.max(this.entities.length, 1)) * 100));

            // Section 3
            const rFilled = this.rules.filter(r => r.description.trim()).length;
            const nFilled = this.narratives.filter(n => n.action.trim()).length;
            const s3Total = Math.max(this.rules.length + this.narratives.length, 1);
            progress.push(Math.round(((rFilled + nFilled) / s3Total) * 100));

            // Section 4
            const s4Fields = [
                this.plsql.record.name, this.plsql.record.fields, this.plsql.record.justification,
                this.plsql.varray.name, this.plsql.varray.purpose,
                this.plsql.cursor.masterQuery, this.plsql.cursor.flow,
                this.plsql.exCustom.name, this.plsql.exCustom.condition,
                this.plsql.procFunc.understanding,
                this.plsql.packages.understanding,
                this.plsql.triggers.understanding
            ];
            const s4f = s4Fields.filter(v => v && v.trim().length > 0).length;
            progress.push(Math.round((s4f / s4Fields.length) * 100));

            return progress;
        },
        totalProgress() {
            const sum = this.sectionProgress.reduce((a, b) => a + b, 0);
            return Math.round(sum / this.sectionProgress.length);
        },
        lastSavedFormatted() {
            if (!this.lastSavedTime) return 'Guardado local activo';
            const d = new Date(this.lastSavedTime);
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            return `Guardado automático: ${hh}:${mm}:${ss}`;
        },
        checklistItems() {
            const items = [];

            // 1. Contexto y Equipo
            const hasProjectName = this.team.projectName && this.team.projectName.trim().length > 0;
            const validMembers = this.team.members.filter(m => m.name.trim() || m.lastname.trim());
            const hasContext = this.team.businessDesc.trim().length > 5 && this.team.problemDesc.trim().length > 5;
            let s1Status = 'missing';
            let s1Msg = 'Falta ingresar el nombre del proyecto e integrantes.';
            if (hasProjectName && validMembers.length >= 1 && hasContext) {
                s1Status = 'ok';
                s1Msg = `${this.team.projectName} (${validMembers.length} integrante${validMembers.length > 1 ? 's' : ''} registrado${validMembers.length > 1 ? 's' : ''})`;
            } else if (hasProjectName || validMembers.length > 0 || hasContext) {
                s1Status = 'warning';
                s1Msg = 'Contexto incompleto: completa integrantes y descripción del negocio.';
            }
            items.push({
                id: 'sec-1',
                title: '1. Contexto y Equipo',
                status: s1Status,
                message: s1Msg,
                sectionIndex: 0
            });

            // 2. Modelo de Datos
            const validEntities = this.entities.filter(e => e.name.trim().length > 0);
            const withPk = validEntities.filter(e => e.attributes.some(a => a.pk && a.name.trim().length > 0));
            let s2Status = 'missing';
            let s2Msg = 'No hay entidades definidas aún.';
            if (validEntities.length >= 3 && withPk.length >= 2) {
                s2Status = 'ok';
                s2Msg = `${validEntities.length} entidades modeladas con claves primarias asignadas.`;
            } else if (validEntities.length > 0) {
                s2Status = 'warning';
                s2Msg = `${validEntities.length} entidad(es). Recomendado: al menos 3-4 con clave primaria (PK).`;
            }
            items.push({
                id: 'sec-2',
                title: '2. Modelo de Datos y Diagrama ER',
                status: s2Status,
                message: s2Msg,
                sectionIndex: 1
            });

            // 3. Reglas y Narrativas
            const validRules = this.rules.filter(r => r.description.trim().length > 4);
            const validNarratives = this.narratives.filter(n => n.action.trim().length > 2 && n.benefit.trim().length > 2);
            let s3Status = 'missing';
            let s3Msg = 'Faltan reglas de negocio y narrativas de usuario.';
            if (validRules.length >= 2 && validNarratives.length >= 2) {
                s3Status = 'ok';
                s3Msg = `${validRules.length} reglas y ${validNarratives.length} narrativas con componentes asociados.`;
            } else if (validRules.length > 0 || validNarratives.length > 0) {
                s3Status = 'warning';
                s3Msg = 'En progreso: se recomiendan al menos 2 reglas y 2 narrativas completas.';
            }
            items.push({
                id: 'sec-3',
                title: '3. Reglas de Negocio y Narrativas',
                status: s3Status,
                message: s3Msg,
                sectionIndex: 2
            });

            // 4. Plan de Componentes PL/SQL (Obligatorios)
            const p = this.plsql;
            const hasRecord = p.record.name.trim().length > 0 && p.record.justification.trim().length > 0;
            const hasVarray = p.varray.name.trim().length > 0 && p.varray.purpose.trim().length > 0;
            const hasCursor = p.cursor.masterQuery.trim().length > 0;
            const hasExceptions = p.exPredefined.length > 0 || (p.exCustom.name.trim().length > 0 && p.exCustom.condition.trim().length > 0);
            const completedCount = [hasRecord, hasVarray, hasCursor, hasExceptions].filter(Boolean).length;
            let s4Status = 'missing';
            let s4Msg = 'Falta planificar los componentes PL/SQL obligatorios.';
            if (completedCount === 4) {
                s4Status = 'ok';
                s4Msg = 'RECORD, VARRAY, Cursor y Excepciones definidos y justificados.';
            } else if (completedCount > 0) {
                s4Status = 'warning';
                s4Msg = `${completedCount}/4 componentes listos. Revisa RECORD, VARRAY, Cursor o Excepciones.`;
            }
            items.push({
                id: 'sec-4',
                title: '4. Componentes PL/SQL (Obligatorios)',
                status: s4Status,
                message: s4Msg,
                sectionIndex: 3
            });

            // 5. Investigación Teórica
            const hasProc = p.procFunc.understanding.trim().length > 10;
            const hasPack = p.packages.understanding.trim().length > 10;
            const hasTrig = p.triggers.understanding.trim().length > 10;
            const theoryCount = [hasProc, hasPack, hasTrig].filter(Boolean).length;
            let s5Status = 'missing';
            let s5Msg = 'Pendiente: anotaciones de investigación teórica.';
            if (theoryCount === 3) {
                s5Status = 'ok';
                s5Msg = 'Investigación sobre Procedimientos, Packages y Triggers documentada.';
            } else if (theoryCount > 0) {
                s5Status = 'warning';
                s5Msg = `${theoryCount}/3 temas investigados. Completa Procedimientos, Packages o Triggers.`;
            }
            items.push({
                id: 'sec-5',
                title: '5. Investigación Teórica (Procedimientos, Packages, Triggers)',
                status: s5Status,
                message: s5Msg,
                sectionIndex: 3
            });

            return items;
        }
    },
    watch: {
        team: { handler() { this.saveToStorage(); }, deep: true },
        entities: { handler() { this.saveToStorage(); this.debouncedRenderMermaid(); }, deep: true },
        rules: { handler() { this.saveToStorage(); }, deep: true },
        narratives: { handler() { this.saveToStorage(); }, deep: true },
        plsql: { handler() { this.saveToStorage(); }, deep: true }
    },
    created() {
        this.loadFromStorage();
    },
    mounted() {
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
        }
        this.$nextTick(() => this.debouncedRenderMermaid());
    },
    methods: {
        // ---- NAVIGATION ----
        goToSection(idx) {
            this.currentSection = idx;
            this.scrollToTop();
            if (idx === 1 || idx === 4) this.$nextTick(() => this.debouncedRenderMermaid());
        },
        nextSection() {
            if (this.currentSection < 4) this.goToSection(this.currentSection + 1);
        },
        prevSection() {
            if (this.currentSection > 0) this.goToSection(this.currentSection - 1);
        },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        toggleExample(idx) {
            this.showExample[idx] = !this.showExample[idx];
            this.showExample = [...this.showExample]; // force reactivity
        },
        togglePlsql(idx) {
            this.expandedPlsql[idx] = !this.expandedPlsql[idx];
            this.expandedPlsql = [...this.expandedPlsql];
        },
        toggleSummary(idx) {
            this.expandedSummary[idx] = !this.expandedSummary[idx];
            this.expandedSummary = [...this.expandedSummary];
        },

        // ---- MEMBERS ----
        addMember() { this.team.members.push({ name: '', lastname: '' }); },
        removeMember(idx) {
            if (this.team.members.length > 1) this.team.members.splice(idx, 1);
        },

        // ---- ENTITIES ----
        addEntity() {
            this.entities.push({
                id: 'ent_' + Date.now(),
                name: '',
                description: '',
                expanded: true,
                attributes: [{ name: '', type: 'NUMBER', pk: true, fk: false, fkRef: '', notNull: true, unique: false }]
            });
        },
        removeEntity(idx) { this.entities.splice(idx, 1); },
        toggleEntity(idx) { this.entities[idx].expanded = !this.entities[idx].expanded; },
        addAttribute(entIdx) {
            this.entities[entIdx].attributes.push({ name: '', type: 'VARCHAR2', pk: false, fk: false, fkRef: '', notNull: false, unique: false });
        },
        removeAttribute(entIdx, attrIdx) {
            if (this.entities[entIdx].attributes.length > 1) {
                this.entities[entIdx].attributes.splice(attrIdx, 1);
            }
        },
        toggleConstraint(entIdx, attrIdx, field) {
            const attr = this.entities[entIdx].attributes[attrIdx];
            attr[field] = !attr[field];
            if (field === 'pk' && attr.pk) { attr.notNull = true; attr.fk = false; attr.fkRef = ''; }
            if (field === 'fk' && !attr.fk) { attr.fkRef = ''; }
        },

        // ---- RULES ----
        addRule() {
            const num = this.rules.length + 1;
            this.rules.push({
                id: 'rn_' + Date.now(),
                code: 'RN-' + String(num).padStart(3, '0'),
                category: '',
                description: '',
                violation: ''
            });
        },
        removeRule(idx) { this.rules.splice(idx, 1); },
        setRuleCategory(idx, cat) {
            this.rules[idx].category = this.rules[idx].category === cat ? '' : cat;
        },

        // ---- NARRATIVES ----
        addNarrative() {
            this.narratives.push({
                id: 'nar_' + Date.now(),
                role: '',
                action: '',
                benefit: '',
                components: []
            });
        },
        removeNarrative(idx) { this.narratives.splice(idx, 1); },
        toggleNarrativeComponent(narIdx, comp) {
            const comps = this.narratives[narIdx].components;
            const idx = comps.indexOf(comp);
            if (idx >= 0) comps.splice(idx, 1);
            else comps.push(comp);
        },

        // ---- PL/SQL ----
        togglePredefinedException(name) {
            const idx = this.plsql.exPredefined.indexOf(name);
            if (idx >= 0) this.plsql.exPredefined.splice(idx, 1);
            else this.plsql.exPredefined.push(name);
        },

        // ---- MERMAID ----
        debouncedRenderMermaid() {
            clearTimeout(this._mermaidTimer);
            this._mermaidTimer = setTimeout(() => this.renderMermaid(), 600);
        },
        async renderMermaid() {
            const code = this.mermaidCode;
            if (!code || typeof mermaid === 'undefined') {
                this.mermaidSvg = '';
                return;
            }
            try {
                this.mermaidRenderCount++;
                const id = 'er-ws-' + this.mermaidRenderCount;
                const { svg } = await mermaid.render(id, code);
                this.mermaidSvg = svg;
            } catch (e) {
                this.mermaidSvg = '<p style="color:var(--danger);font-size:0.85rem;padding:1rem;">⚠️ Error generando diagrama. Verifica que los nombres de tablas no contengan espacios ni caracteres especiales.</p>';
            }
        },

        // ---- PERSISTENCE ----
        saveToStorage() {
            try {
                const data = {
                    team: JSON.parse(JSON.stringify(this.team)),
                    entities: JSON.parse(JSON.stringify(this.entities)),
                    rules: JSON.parse(JSON.stringify(this.rules)),
                    narratives: JSON.parse(JSON.stringify(this.narratives)),
                    plsql: JSON.parse(JSON.stringify(this.plsql)),
                    currentSection: this.currentSection
                };
                localStorage.setItem('workshop_prep_eval1', JSON.stringify(data));
                this.lastSavedTime = new Date();
                this.savePulse = true;
                clearTimeout(this._pulseTimer);
                this._pulseTimer = setTimeout(() => { this.savePulse = false; }, 800);
            } catch (e) {}
        },
        loadFromStorage() {
            try {
                const saved = localStorage.getItem('workshop_prep_eval1');
                if (!saved) return;
                const data = JSON.parse(saved);
                if (data.team) this.team = { ...this.team, ...data.team };
                if (data.entities) this.entities = data.entities;
                if (data.rules) this.rules = data.rules;
                if (data.narratives) this.narratives = data.narratives;
                if (data.plsql) this.plsql = { ...this.plsql, ...data.plsql };
                if (typeof data.currentSection === 'number') this.currentSection = data.currentSection;
                this.lastSavedTime = new Date();
            } catch (e) {}
        },

        // ---- EXPORT & CLIPBOARD ----
        generateMarkdown() {
            const t = this.team;
            const date = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
            let md = '';

            // Header
            md += `# Entregable Taller Preparatorio — Evaluación 1\n\n`;
            md += `**Proyecto:** ${t.projectName || '(sin definir)'}\n`;
            md += `**Rubro:** ${t.sector || '(sin definir)'}\n`;
            md += `**Fecha:** ${date}\n\n`;
            md += `## Integrantes\n\n`;
            const validMembers = t.members.filter(m => m.name.trim() || m.lastname.trim());
            if (validMembers.length > 0) {
                validMembers.forEach((m, i) => {
                    md += `${i + 1}. ${m.name} ${m.lastname}\n`;
                });
            } else {
                md += `*(Sin integrantes registrados)*\n`;
            }
            md += `\n---\n\n`;

            // Section 1: Context
            md += `## 1. Contexto del Negocio\n\n`;
            md += `### Descripción del Negocio\n${t.businessDesc || '(pendiente)'}\n\n`;
            md += `### Problema que Resuelve\n${t.problemDesc || '(pendiente)'}\n\n`;
            md += `### Objetivo del Sistema\n${t.objectiveDesc || '(pendiente)'}\n\n`;
            md += `---\n\n`;

            // Section 2: Entities
            md += `## 2. Modelo de Datos\n\n`;
            if (this.entities.length > 0) {
                md += `### Entidades y Atributos\n\n`;
                this.entities.filter(e => e.name.trim()).forEach(ent => {
                    md += `#### ${ent.name.toUpperCase()}\n`;
                    if (ent.description) md += `> ${ent.description}\n\n`;
                    md += `| Atributo | Tipo | PK | FK → | NOT NULL | UNIQUE |\n`;
                    md += `|----------|------|----|------|----------|--------|\n`;
                    ent.attributes.filter(a => a.name.trim()).forEach(a => {
                        md += `| ${a.name} | ${a.type} | ${a.pk ? '✓' : ''} | ${a.fk ? a.fkRef : ''} | ${a.notNull ? '✓' : ''} | ${a.unique ? '✓' : ''} |\n`;
                    });
                    md += `\n`;
                });

                md += `### Diagrama Entidad-Relación (Mermaid)\n\n`;
                md += '```mermaid\n' + this.mermaidCode + '```\n\n';
            } else {
                md += `*(Sin entidades definidas)*\n\n`;
            }
            md += `---\n\n`;

            // Section 3: Rules & Narratives
            md += `## 3. Reglas de Negocio\n\n`;
            if (this.rules.length > 0) {
                md += `| Código | Categoría | Descripción | Consecuencia si se viola |\n`;
                md += `|--------|-----------|-------------|-------------------------|\n`;
                this.rules.forEach(r => {
                    md += `| ${r.code} | ${r.category || '-'} | ${r.description || '-'} | ${r.violation || '-'} |\n`;
                });
                md += `\n`;
            } else {
                md += `*(Sin reglas definidas)*\n\n`;
            }
            md += `### Narrativas de Usuario\n\n`;
            if (this.narratives.length > 0) {
                md += `| # | Narrativa | Componentes PL/SQL |\n`;
                md += `|---|-----------|-------------------|\n`;
                this.narratives.forEach((n, i) => {
                    const story = `Como **${n.role || '?'}**, necesito **${n.action || '?'}**, para **${n.benefit || '?'}**`;
                    md += `| ${i + 1} | ${story} | ${n.components.join(', ') || '-'} |\n`;
                });
                md += `\n`;
            } else {
                md += `*(Sin narrativas definidas)*\n\n`;
            }
            md += `---\n\n`;

            // Section 4: PL/SQL Plan
            md += `## 4. Plan de Componentes PL/SQL\n\n`;
            const p = this.plsql;

            md += `### RECORD\n`;
            md += `- **Nombre:** ${p.record.name || '(pendiente)'}\n`;
            md += `- **Campos:** ${p.record.fields || '(pendiente)'}\n`;
            md += `- **Justificación:** ${p.record.justification || '(pendiente)'}\n\n`;

            md += `### VARRAY\n`;
            md += `- **Nombre:** ${p.varray.name || '(pendiente)'}\n`;
            md += `- **Propósito:** ${p.varray.purpose || '(pendiente)'}\n`;
            md += `- **Justificación:** ${p.varray.justification || '(pendiente)'}\n\n`;

            md += `### Cursor Explícito + Ciclos Anidados\n`;
            md += `- **Consulta maestro-detalle:** ${p.cursor.masterQuery || '(pendiente)'}\n`;
            md += `- **Parámetros del cursor:** ${p.cursor.params || '(pendiente)'}\n`;
            md += `- **Flujo del ciclo:** ${p.cursor.flow || '(pendiente)'}\n\n`;

            md += `### Excepciones\n`;
            md += `- **Predefinidas a manejar:** ${p.exPredefined.length > 0 ? p.exPredefined.join(', ') : '(pendiente)'}\n`;
            md += `- **Excepción personalizada:** ${p.exCustom.name || '(pendiente)'} (código: ${p.exCustom.code})\n`;
            md += `- **Condición de disparo:** ${p.exCustom.condition || '(pendiente)'}\n\n`;

            md += `### Procedimientos y Funciones (Investigación Teórica)\n`;
            md += `${p.procFunc.understanding || '(pendiente)'}\n\n`;

            md += `### Packages (Investigación Teórica)\n`;
            md += `${p.packages.understanding || '(pendiente)'}\n\n`;

            md += `### Triggers (Investigación Teórica)\n`;
            md += `${p.triggers.understanding || '(pendiente)'}\n\n`;

            return md;
        },
        exportToMarkdown() {
            const md = this.generateMarkdown();
            const t = this.team;
            const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = (t.projectName || 'proyecto').replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_').toLowerCase();
            a.download = `entregable_${filename}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast('✓ Entregable .md descargado exitosamente');
        },
        async copyMarkdownToClipboard() {
            const md = this.generateMarkdown();
            try {
                await navigator.clipboard.writeText(md);
                this.copiedMd = true;
                this.showToast('📋 Markdown copiado al portapapeles');
                setTimeout(() => { this.copiedMd = false; }, 3000);
            } catch (e) {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = md;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                this.copiedMd = true;
                this.showToast('📋 Markdown copiado al portapapeles');
                setTimeout(() => { this.copiedMd = false; }, 3000);
            }
        },
        async copyMermaidCode() {
            const code = this.mermaidCode;
            if (!code) {
                this.showToast('⚠️ No hay código de diagrama para copiar');
                return;
            }
            try {
                await navigator.clipboard.writeText(code);
                this.copiedMermaid = true;
                this.showToast('📊 Código Mermaid copiado al portapapeles');
                setTimeout(() => { this.copiedMermaid = false; }, 3000);
            } catch (e) {
                this.showToast('⚠️ No se pudo acceder al portapapeles');
            }
        },

        // ---- RESET & TOAST ----
        confirmReset() {
            this.showResetModal = true;
        },
        executeReset() {
            try {
                localStorage.removeItem('workshop_prep_eval1');
            } catch (e) {}
            this.team = {
                projectName: '',
                members: [{ name: '', lastname: '' }],
                sector: '',
                businessDesc: '',
                problemDesc: '',
                objectiveDesc: ''
            };
            this.entities = [];
            this.rules = [];
            this.narratives = [];
            this.plsql = {
                record: { name: '', fields: '', justification: '' },
                varray: { name: '', purpose: '', justification: '' },
                cursor: { masterQuery: '', params: '', flow: '' },
                exPredefined: [],
                exCustom: { name: '', code: '-20001', condition: '' },
                procFunc: { understanding: '' },
                packages: { understanding: '' },
                triggers: { understanding: '' }
            };
            this.currentSection = 0;
            this.showResetModal = false;
            this.mermaidSvg = '';
            this.showToast('🗑️ Taller reiniciado desde cero');
            this.scrollToTop();
        },
        showToast(msg) {
            this.toastMessage = msg;
            this.showToastFlag = true;
            clearTimeout(this._toastTimer);
            this._toastTimer = setTimeout(() => {
                this.showToastFlag = false;
            }, 3200);
        },

        // ---- HELPERS ----
        progressLabel(pct) {
            if (pct >= 80) return 'complete';
            if (pct > 0) return 'partial';
            return 'empty';
        },
        progressText(pct) {
            if (pct >= 80) return 'Completo';
            if (pct > 0) return pct + '%';
            return 'Vacío';
        },
        catChipClass(rule, cat) {
            return rule.category === cat ? 'ws-cat-chip active-' + cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : 'ws-cat-chip';
        }
    },
    template: `
    <div class="workshop-runner fade-in">

        <!-- HERO -->
        <div class="ws-hero">
            <div class="ws-hero-content">
                <h1><i class="ph ph-hammer"></i> {{ workshopData.title }}</h1>
                <p>{{ workshopData.subtitle }}</p>
                <div class="ws-hero-badges">
                    <span class="ws-time-badge">
                        <i class="ph ph-timer"></i> {{ workshopData.totalTime }}
                    </span>
                    <span class="ws-save-badge" :class="{ 'pulse-active': savePulse }">
                        <span class="ws-save-dot"></span> {{ lastSavedFormatted }}
                    </span>
                </div>
            </div>
        </div>

        <!-- STEPPER -->
        <div class="ws-stepper">
            <template v-for="(sec, idx) in workshopData.sections" :key="'step-'+idx">
                <div class="ws-step"
                     :class="{ active: currentSection === idx, completed: sectionProgress[idx] >= 80 && currentSection !== idx }"
                     @click="goToSection(idx)">
                    <div class="ws-step-circle">
                        <i v-if="sectionProgress[idx] >= 80 && currentSection !== idx" class="ph ph-check"></i>
                        <span v-else>{{ idx + 1 }}</span>
                    </div>
                    <span class="ws-step-label">{{ sec.title }}</span>
                </div>
                <div v-if="idx < workshopData.sections.length - 1"
                     class="ws-step-line"
                     :class="{ completed: sectionProgress[idx] >= 80 }"></div>
            </template>
        </div>

        <!-- ================================================================
             SECTION 1: TEAM & CONTEXT
             ================================================================ -->
        <div v-if="currentSection === 0" class="ws-section">
            <div class="ws-section-header">
                <div class="ws-section-number" :style="{ background: workshopData.sections[0].color }">1</div>
                <h2>{{ workshopData.sections[0].title }}</h2>
                <span class="ws-section-time"><i class="ph ph-timer"></i> {{ workshopData.sections[0].time }}</span>
            </div>

            <div class="ws-example-toggle" @click="toggleExample(0)">
                <i class="ph" :class="showExample[0] ? 'ph-eye-slash' : 'ph-eye'"></i>
                {{ showExample[0] ? 'Ocultar' : 'Ver' }} ejemplo de referencia (Punto Ticket)
            </div>
            <div v-if="showExample[0]" class="ws-example-box">
                <h4><i class="ph ph-lightbulb"></i> Ejemplo de Referencia — Punto Ticket</h4>
                <p class="example-label">Proyecto</p>
                <p><strong>{{ workshopData.examples.context.projectName }}</strong> ({{ workshopData.examples.context.sector }})</p>
                <p class="example-label" style="margin-top:0.6rem;">Descripción del Negocio</p>
                <p>{{ workshopData.examples.context.businessDesc }}</p>
                <p class="example-label" style="margin-top:0.6rem;">Problema que Resuelve</p>
                <p>{{ workshopData.examples.context.problemDesc }}</p>
                <p class="example-label" style="margin-top:0.6rem;">Objetivo del Sistema</p>
                <p>{{ workshopData.examples.context.objectiveDesc }}</p>
            </div>

            <div class="ws-card">
                <h3><i class="ph ph-users"></i> Datos del Equipo</h3>
                <div class="ws-field">
                    <label>Nombre del Proyecto / Negocio</label>
                    <input class="ws-input" v-model="team.projectName" placeholder="Ej: Sistema de Gestión de Clínica Veterinaria">
                    <span class="ws-field-hint">Escriban el nombre comercial o institucional de la solución que están diseñando.</span>
                </div>
                <div class="ws-field">
                    <label>Integrantes del Grupo</label>
                    <div v-for="(m, mi) in team.members" :key="'m-'+mi" class="ws-member-row">
                        <span class="ws-member-num">{{ mi + 1 }}</span>
                        <input class="ws-input" v-model="m.name" placeholder="Nombre (Ej: Camila)">
                        <input class="ws-input" v-model="m.lastname" placeholder="Apellido (Ej: Soto)">
                        <button v-if="team.members.length > 1" class="ws-btn ws-btn-danger" @click="removeMember(mi)" title="Eliminar integrante">
                            <i class="ph ph-x"></i>
                        </button>
                    </div>
                    <button class="ws-btn ws-btn-ghost" @click="addMember" style="margin-top:0.5rem;">
                        <i class="ph ph-plus"></i> Agregar integrante
                    </button>
                </div>
                <div class="ws-field">
                    <label>Rubro o Sector Industrial</label>
                    <select class="ws-select" v-model="team.sector">
                        <option value="">— Selecciona el rubro del proyecto —</option>
                        <option v-for="s in workshopData.sectorOptions" :key="s" :value="s">{{ s }}</option>
                    </select>
                </div>
            </div>

            <div class="ws-card">
                <h3><i class="ph ph-note-pencil"></i> Contexto del Negocio</h3>
                <div class="ws-tip">
                    <i class="ph ph-info"></i>
                    <div>
                        <strong>Consejo docente:</strong> Elijan un negocio con el que se sientan cómodos (restaurante, arriendo de canchas, logística, etc.). Piensen en un sistema que requiera al menos 4 o 5 entidades para justificar el uso de cursores y colecciones en PL/SQL.
                    </div>
                </div>
                <div class="ws-field">
                    <label>Descripción del Negocio <small class="ws-required">— ¿A qué se dedica y quiénes interactúan con él?</small></label>
                    <textarea class="ws-textarea" v-model="team.businessDesc" placeholder="Expliquen en 2 a 4 líneas qué servicios o productos ofrece este negocio, quiénes son sus clientes y cómo opera..."></textarea>
                    <span class="ws-field-hint">Ejemplo: Empresa dedicada al arriendo de canchas de fútbol con reservas en línea, pagos por adelantado y asignación de árbitros.</span>
                </div>
                <div class="ws-field">
                    <label>Problema que Resuelve <small class="ws-required">— ¿Qué dolores o fallas existen hoy sin el sistema?</small></label>
                    <textarea class="ws-textarea" v-model="team.problemDesc" placeholder="¿Qué fallas manuales, pérdidas de dinero o retrasos ocurren si no cuentan con una base de datos automatizada?"></textarea>
                    <span class="ws-field-hint">Ejemplo: Cruce de reservas de canchas en el mismo horario, falta de control en el cobro de garantías y cálculo manual erróneo de comisiones.</span>
                </div>
                <div class="ws-field">
                    <label>Objetivo del Sistema <small class="ws-required">— ¿Qué automatizará tu solución en PL/SQL?</small></label>
                    <textarea class="ws-textarea" v-model="team.objectiveDesc" placeholder="¿Qué procesos críticos ejecutará la base de datos de manera confiable?"></textarea>
                    <span class="ws-field-hint">Ejemplo: Automatizar la validación de disponibilidad, emitir liquidaciones semanales y sancionar reservas no pagadas a tiempo mediante bloques PL/SQL.</span>
                </div>
            </div>

            <div class="ws-nav">
                <div></div>
                <button class="ws-btn ws-btn-primary" @click="nextSection">
                    Siguiente: Entidades y Modelo <i class="ph ph-arrow-right"></i>
                </button>
            </div>
        </div>

        <!-- ================================================================
             SECTION 2: ENTITIES & MODEL
             ================================================================ -->
        <div v-if="currentSection === 1" class="ws-section">
            <div class="ws-section-header">
                <div class="ws-section-number" :style="{ background: workshopData.sections[1].color }">2</div>
                <h2>{{ workshopData.sections[1].title }}</h2>
                <span class="ws-section-time"><i class="ph ph-timer"></i> {{ workshopData.sections[1].time }}</span>
            </div>

            <div class="ws-example-toggle" @click="toggleExample(1)">
                <i class="ph" :class="showExample[1] ? 'ph-eye-slash' : 'ph-eye'"></i>
                {{ showExample[1] ? 'Ocultar' : 'Ver' }} modelo de referencia (Punto Ticket)
            </div>
            <div v-if="showExample[1]" class="ws-example-box">
                <h4><i class="ph ph-lightbulb"></i> Modelo de Datos — Punto Ticket</h4>
                <p style="margin-bottom:0.5rem;">Punto Ticket tiene <strong>{{ workshopData.examples.entities.length }} entidades principales</strong> modeladas para soportar la venta de tickets:</p>
                <table class="ws-example-table">
                    <thead><tr><th>Entidad</th><th>Descripción</th><th>Atributos</th></tr></thead>
                    <tbody>
                        <tr v-for="ent in workshopData.examples.entities" :key="'ex-ent-'+ent.name">
                            <td><code>{{ ent.name }}</code></td>
                            <td>{{ ent.description }}</td>
                            <td>{{ ent.attributes.length }} atributos</td>
                        </tr>
                    </tbody>
                </table>
                <p class="example-label" style="margin-top:0.85rem;">Ejemplo de atributos — Entidad CLIENTE</p>
                <table class="ws-example-table">
                    <thead><tr><th>Atributo</th><th>Tipo</th><th>PK</th><th>FK</th><th>NOT NULL</th><th>UNIQUE</th></tr></thead>
                    <tbody>
                        <tr v-for="a in workshopData.examples.entities[0].attributes" :key="'ex-a-'+a.name">
                            <td><code>{{ a.name }}</code></td>
                            <td>{{ a.type }}</td>
                            <td>{{ a.pk ? '✓' : '' }}</td>
                            <td>{{ a.fk ? a.fkRef : '' }}</td>
                            <td>{{ a.notNull ? '✓' : '' }}</td>
                            <td>{{ a.unique ? '✓' : '' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="ws-tip">
                <i class="ph ph-info"></i>
                <div>
                    <strong>Recomendación pedagógica:</strong> Modelen al menos <strong>3 o 4 entidades</strong> relacionadas (ej: <code>CLIENTE</code>, <code>RESERVA</code>, <code>CANCHA</code>, <code>PAGO</code>). El diagrama ER se genera automáticamente en vivo abajo a medida que agregas entidades y seleccionas claves foráneas (FK).
                </div>
            </div>

            <!-- Constraint legend -->
            <div class="ws-constraint-legend">
                <span class="legend-title"><i class="ph ph-tag"></i> Guía rápida de restricciones:</span>
                <span class="legend-chip legend-pk" title="Primary Key: Clave primaria que identifica de forma única a cada registro"><i class="ph ph-key"></i> <strong>PK</strong>: Clave Primaria</span>
                <span class="legend-chip legend-fk" title="Foreign Key: Clave foránea que vincula este atributo con la PK de otra tabla"><i class="ph ph-link"></i> <strong>FK</strong>: Clave Foránea</span>
                <span class="legend-chip legend-nn" title="NOT NULL: Este campo es obligatorio y no puede quedar vacío"><i class="ph ph-asterisk"></i> <strong>NN</strong>: NOT NULL</span>
                <span class="legend-chip legend-uq" title="UNIQUE: Restricción que prohíbe valores duplicados en esta columna"><i class="ph ph-fingerprint"></i> <strong>UQ</strong>: Único</span>
            </div>

            <!-- Entity builder -->
            <div v-for="(ent, ei) in entities" :key="ent.id" class="ws-entity-card">
                <div class="ws-entity-header" @click="toggleEntity(ei)">
                    <div class="ws-entity-icon"><i class="ph ph-table"></i></div>
                    <input class="ws-input ws-entity-title-input" v-model="ent.name" placeholder="NOMBRE_TABLA (Ej: CLIENTE)" @click.stop style="text-transform:uppercase;">
                    <input class="ws-input ws-entity-desc-input" v-model="ent.description" placeholder="Descripción breve..." @click.stop>
                    <button class="ws-btn ws-btn-danger" @click.stop="removeEntity(ei)" title="Eliminar tabla completa">
                        <i class="ph ph-trash"></i>
                    </button>
                    <i class="ph" :class="ent.expanded ? 'ph-caret-up' : 'ph-caret-down'" style="color:var(--text-muted);"></i>
                </div>
                <div v-if="ent.expanded" class="ws-entity-body">
                    <div class="ws-attr-header-row">
                        <span class="ws-col-name">Nombre de Columna</span>
                        <span class="ws-col-type">Tipo de Dato</span>
                        <span class="ws-col-constraints">Restricciones (Clic para activar)</span>
                        <span class="ws-col-action"></span>
                    </div>
                    <div v-for="(attr, ai) in ent.attributes" :key="'attr-'+ei+'-'+ai" class="ws-attr-row">
                        <input class="ws-input ws-attr-name-input" type="text" v-model="attr.name" placeholder="nombre_columna" style="text-transform:lowercase;">
                        <select class="ws-select ws-attr-type-select" v-model="attr.type">
                            <option v-for="tp in workshopData.typeOptions" :key="tp" :value="tp">{{ tp }}</option>
                        </select>
                        <div class="ws-constraint-chips">
                            <span class="ws-chip" :class="{ 'active-pk': attr.pk }" @click="toggleConstraint(ei, ai, 'pk')" title="Primary Key: Clave Primaria única">PK</span>
                            <span class="ws-chip" :class="{ 'active-fk': attr.fk }" @click="toggleConstraint(ei, ai, 'fk')" title="Foreign Key: Clave Foránea referencial">FK</span>
                            <span class="ws-chip" :class="{ 'active-nn': attr.notNull }" @click="toggleConstraint(ei, ai, 'notNull')" title="NOT NULL: Campo obligatorio">NN</span>
                            <span class="ws-chip" :class="{ 'active-uq': attr.unique }" @click="toggleConstraint(ei, ai, 'unique')" title="UNIQUE: Sin valores duplicados">UQ</span>
                        </div>
                        <select v-if="attr.fk" class="ws-select ws-fk-ref" v-model="attr.fkRef" title="Selecciona la tabla a la que apunta esta clave foránea">
                            <option value="">→ Apunta a tabla...</option>
                            <option v-for="en in entityNames" :key="en" :value="en">{{ en }}</option>
                        </select>
                        <button class="ws-btn ws-btn-danger" @click="removeAttribute(ei, ai)" title="Eliminar atributo" v-if="ent.attributes.length > 1">
                            <i class="ph ph-x"></i>
                        </button>
                    </div>
                    <button class="ws-btn ws-btn-ghost ws-btn-add-attr" @click="addAttribute(ei)">
                        <i class="ph ph-plus"></i> Agregar atributo a {{ ent.name ? ent.name.toUpperCase() : 'esta entidad' }}
                    </button>
                </div>
            </div>

            <button class="ws-btn ws-btn-add" @click="addEntity">
                <i class="ph ph-plus-circle"></i> Agregar Nueva Entidad / Tabla
            </button>

            <!-- Mermaid ER Preview -->
            <div class="ws-mermaid-container" v-if="entities.length > 0">
                <div class="ws-mermaid-header">
                    <h4><i class="ph ph-graph"></i> Diagrama Entidad-Relación (Generado en tiempo real)</h4>
                    <button class="ws-btn ws-btn-sm ws-btn-copy-mini" @click="copyMermaidCode" title="Copiar código Mermaid al portapapeles">
                        <i class="ph" :class="copiedMermaid ? 'ph-check' : 'ph-code'"></i>
                        {{ copiedMermaid ? '¡Código Copiado!' : 'Copiar código Mermaid' }}
                    </button>
                </div>
                <div v-if="mermaidSvg" v-html="mermaidSvg" class="ws-mermaid-svg-wrapper"></div>
                <div v-else class="ws-mermaid-placeholder">
                    <i class="ph ph-circle-notch"></i> Escriban los nombres de tablas y columnas para visualizar el diagrama...
                </div>
            </div>

            <div class="ws-nav">
                <button class="ws-btn ws-btn-ghost" @click="prevSection">
                    <i class="ph ph-arrow-left"></i> Anterior
                </button>
                <button class="ws-btn ws-btn-primary" @click="nextSection">
                    Siguiente: Reglas y Narrativas <i class="ph ph-arrow-right"></i>
                </button>
            </div>
        </div>

        <!-- ================================================================
             SECTION 3: RULES & NARRATIVES
             ================================================================ -->
        <div v-if="currentSection === 2" class="ws-section">
            <div class="ws-section-header">
                <div class="ws-section-number" :style="{ background: workshopData.sections[2].color }">3</div>
                <h2>{{ workshopData.sections[2].title }}</h2>
                <span class="ws-section-time"><i class="ph ph-timer"></i> {{ workshopData.sections[2].time }}</span>
            </div>

            <div class="ws-example-toggle" @click="toggleExample(2)">
                <i class="ph" :class="showExample[2] ? 'ph-eye-slash' : 'ph-eye'"></i>
                {{ showExample[2] ? 'Ocultar' : 'Ver' }} reglas y narrativas de Punto Ticket
            </div>
            <div v-if="showExample[2]" class="ws-example-box">
                <h4><i class="ph ph-lightbulb"></i> Reglas y Narrativas — Punto Ticket</h4>
                <p class="example-label">Reglas de Negocio</p>
                <table class="ws-example-table">
                    <thead><tr><th>Código</th><th>Categoría</th><th>Descripción</th></tr></thead>
                    <tbody>
                        <tr v-for="r in workshopData.examples.rules.slice(0, 4)" :key="'ex-r-'+r.code">
                            <td><code>{{ r.code }}</code></td>
                            <td><span class="ws-cat-badge">{{ r.category }}</span></td>
                            <td>{{ r.description }}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="example-label" style="margin-top:0.85rem;">Narrativas de Usuario</p>
                <table class="ws-example-table">
                    <thead><tr><th>Narrativa</th><th>Componentes PL/SQL</th></tr></thead>
                    <tbody>
                        <tr v-for="n in workshopData.examples.narratives.slice(0, 3)" :key="'ex-n-'+n.role">
                            <td>Como <strong>{{ n.role }}</strong>, necesito <strong>{{ n.action }}</strong>, para <strong>{{ n.benefit }}</strong></td>
                            <td><span class="ws-comp-badge" v-for="c in n.components" :key="c">{{ c }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Rules -->
            <div class="ws-card">
                <h3><i class="ph ph-shield-check"></i> Reglas de Negocio</h3>
                <div class="ws-tip">
                    <i class="ph ph-info"></i>
                    <div>
                        <strong>¿Qué es una regla de negocio?</strong> Es una condición, restricción o cálculo ineludible. Por ejemplo: <em>"No se permite reservar sin abonar el 50%"</em> o <em>"El descuento VIP es de 15% para clientes con más de 5 visitas"</em>.
                    </div>
                </div>

                <div v-for="(rule, ri) in rules" :key="rule.id" class="ws-rule-card">
                    <div class="ws-rule-header">
                        <span class="ws-rule-code">{{ rule.code }}</span>
                        <div class="ws-category-chips">
                            <span v-for="cat in ['Validación','Cálculo','Restricción','Automatización','Auditoría']" :key="cat"
                                  :class="catChipClass(rule, cat)"
                                  @click="setRuleCategory(ri, cat)">{{ cat }}</span>
                        </div>
                        <button class="ws-btn ws-btn-danger" @click="removeRule(ri)" style="margin-left:auto;" title="Eliminar regla">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                    <div class="ws-field" style="margin-bottom:0.6rem;">
                        <label>Enunciado de la Regla</label>
                        <input class="ws-input" v-model="rule.description" placeholder="Describe la regla de negocio con claridad... Ej: Ningún socio con deuda morosa puede solicitar préstamos.">
                    </div>
                    <div class="ws-field" style="margin-bottom:0;">
                        <label>Consecuencia técnica si se infringe</label>
                        <input class="ws-input" v-model="rule.violation" placeholder="¿Qué acción toma el sistema? Ej: Se lanza excepción de negocio -20002 y se cancela la transacción.">
                    </div>
                </div>

                <button class="ws-btn ws-btn-add" @click="addRule">
                    <i class="ph ph-plus-circle"></i> Agregar Regla de Negocio
                </button>
            </div>

            <div class="ws-divider"></div>

            <!-- Narratives -->
            <div class="ws-card">
                <h3><i class="ph ph-chat-text"></i> Narrativas de Usuario y Mapeo Técnico</h3>
                <div class="ws-tip">
                    <i class="ph ph-info"></i>
                    <div>
                        <strong>Andamiaje para la defensa:</strong> La narrativa conecta la necesidad humana con tu solución técnica en Oracle. Selecciona abajo qué componente(s) PL/SQL darán vida a cada requerimiento.
                    </div>
                </div>

                <div v-for="(nar, ni) in narratives" :key="nar.id" class="ws-narrative-card">
                    <div class="ws-narrative-structure">
                        <span class="ws-nar-label">Como</span>
                        <select class="ws-select ws-nar-select" v-model="nar.role">
                            <option value="">— Rol de usuario —</option>
                            <option v-for="r in workshopData.roleOptions" :key="r" :value="r">{{ r }}</option>
                        </select>
                        <span class="ws-nar-label">, necesito</span>
                        <input class="ws-input ws-nar-input" v-model="nar.action" placeholder="realizar una acción (ej: liquidar las ventas del día)">
                        <span class="ws-nar-label">, para</span>
                        <input class="ws-input ws-nar-input" v-model="nar.benefit" placeholder="lograr un objetivo (ej: conciliar caja y pagar a proveedores)">
                        <button class="ws-btn ws-btn-danger" @click="removeNarrative(ni)" title="Eliminar narrativa">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                    <div class="ws-narrative-components">
                        <label><i class="ph ph-cpu"></i> ¿Qué componentes PL/SQL resolverán esta narrativa? (Haz clic para seleccionar):</label>
                        <div class="ws-component-chips">
                            <span v-for="comp in ['Cursor','RECORD','VARRAY','Excepción','Procedimiento','Función','Package','Trigger']"
                                  :key="comp"
                                  class="ws-comp-chip"
                                  :class="{ active: nar.components.includes(comp) }"
                                  @click="toggleNarrativeComponent(ni, comp)">{{ comp }}</span>
                        </div>
                    </div>
                </div>

                <button class="ws-btn ws-btn-add" @click="addNarrative">
                    <i class="ph ph-plus-circle"></i> Agregar Narrativa de Usuario
                </button>
            </div>

            <div class="ws-nav">
                <button class="ws-btn ws-btn-ghost" @click="prevSection">
                    <i class="ph ph-arrow-left"></i> Anterior
                </button>
                <button class="ws-btn ws-btn-primary" @click="nextSection">
                    Siguiente: Plan PL/SQL <i class="ph ph-arrow-right"></i>
                </button>
            </div>
        </div>

        <!-- ================================================================
             SECTION 4: PL/SQL COMPONENT PLAN
             ================================================================ -->
        <div v-if="currentSection === 3" class="ws-section">
            <div class="ws-section-header">
                <div class="ws-section-number" :style="{ background: workshopData.sections[3].color }">4</div>
                <h2>{{ workshopData.sections[3].title }}</h2>
                <span class="ws-section-time"><i class="ph ph-timer"></i> {{ workshopData.sections[3].time }}</span>
            </div>

            <div class="ws-example-toggle" @click="toggleExample(3)">
                <i class="ph" :class="showExample[3] ? 'ph-eye-slash' : 'ph-eye'"></i>
                {{ showExample[3] ? 'Ocultar' : 'Ver' }} planificación de componentes (Punto Ticket)
            </div>
            <div v-if="showExample[3]" class="ws-example-box">
                <h4><i class="ph ph-lightbulb"></i> Plan de Componentes — Punto Ticket</h4>
                <p class="example-label">RECORD</p>
                <p><code>{{ workshopData.examples.components.record.name }}</code>: {{ workshopData.examples.components.record.justification }}</p>
                <p class="example-label" style="margin-top:0.6rem;">VARRAY</p>
                <p><code>{{ workshopData.examples.components.varray.name }}</code>: {{ workshopData.examples.components.varray.purpose }}</p>
                <p class="example-label" style="margin-top:0.6rem;">Cursor Maestro-Detalle</p>
                <p>{{ workshopData.examples.components.cursor.masterQuery }}</p>
                <p class="example-label" style="margin-top:0.6rem;">Excepciones</p>
                <p>Predefinidas: {{ workshopData.examples.components.exceptions.predefined.join(', ') }}</p>
                <p>Personalizada: <code>{{ workshopData.examples.components.exceptions.custom.name }}</code> ({{ workshopData.examples.components.exceptions.custom.code }}): {{ workshopData.examples.components.exceptions.custom.condition }}</p>
                <p class="example-label" style="margin-top:0.6rem;">Investigación Teórica</p>
                <p><strong>Procedimientos y Funciones:</strong> {{ workshopData.examples.components.procedure.description }}</p>
                <p><strong>Packages:</strong> {{ workshopData.examples.components.package.justification }}</p>
                <p><strong>Triggers:</strong> {{ workshopData.examples.components.trigger.description }}</p>
            </div>

            <div class="ws-tip">
                <i class="ph ph-info"></i>
                <div>
                    <strong>Requisito clave de la Evaluación 1:</strong> Los componentes <strong>RECORD, VARRAY, Cursor explícito y Excepciones</strong> deben ser diseñados e implementados en código. Los temas de <strong>Procedimientos, Packages y Triggers</strong> corresponden a investigación teórica argumentada.
                </div>
            </div>

            <!-- CHEATSHEET ACCORDION -->
            <div class="ws-cheatsheet-card">
                <div class="ws-cheatsheet-header" @click="showCheatSheet = !showCheatSheet">
                    <div class="ws-cheatsheet-title">
                        <i class="ph ph-books"></i>
                        <span>Chuleta de Sintaxis Rápida Oracle PL/SQL</span>
                        <span class="ws-cheatsheet-tag">Ayuda de memoria</span>
                    </div>
                    <i class="ph" :class="showCheatSheet ? 'ph-caret-up' : 'ph-caret-down'"></i>
                </div>
                <div v-if="showCheatSheet" class="ws-cheatsheet-body">
                    <div class="ws-cheatsheet-grid">
                        <div class="ws-cheat-item">
                            <h5><i class="ph ph-brackets-curly"></i> RECORD (Estructura personalizada)</h5>
                            <pre><code>-- 1. Definir tipo en DECLARE
TYPE t_reserva_info IS RECORD (
    id_reserva   NUMBER,
    nom_cliente  VARCHAR2(100),
    monto_total  NUMBER(10,2)
);
-- 2. Declarar la variable
r_reserva t_reserva_info;</code></pre>
                        </div>
                        <div class="ws-cheat-item">
                            <h5><i class="ph ph-list-numbers"></i> VARRAY (Arreglo en memoria)</h5>
                            <pre><code>-- 1. Declarar tipo colección fija
TYPE t_estados IS VARRAY(5) OF VARCHAR2(20);
-- 2. Instanciar con constructor
v_estados t_estados := t_estados('PENDIENTE', 'PAGADO', 'ANULADO');</code></pre>
                        </div>
                        <div class="ws-cheat-item">
                            <h5><i class="ph ph-cursor-click"></i> CURSOR con FOR LOOP</h5>
                            <pre><code>CURSOR c_clientes IS 
    SELECT rut, nombre FROM cliente;

FOR r_cli IN c_clientes LOOP
    DBMS_OUTPUT.PUT_LINE(r_cli.rut || ': ' || r_cli.nombre);
END LOOP;</code></pre>
                        </div>
                        <div class="ws-cheat-item">
                            <h5><i class="ph ph-warning"></i> Excepción Personalizada</h5>
                            <pre><code>-- Lanzamiento con código y mensaje
IF v_saldo &lt; v_monto THEN
    RAISE_APPLICATION_ERROR(-20001, 'Saldo insuficiente para completar la reserva.');
END IF;</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RECORD -->
            <div class="ws-plsql-card">
                <div class="ws-plsql-header" @click="togglePlsql(0)">
                    <div class="ws-plsql-icon" style="background:#eff6ff;color:#3b82f6;"><i class="ph ph-brackets-curly"></i></div>
                    <h4>1. RECORD (Estructura de Datos Compuesta)</h4>
                    <span class="ws-plsql-badge practice">Diseño Obligatorio</span>
                    <i class="ph" :class="expandedPlsql[0] ? 'ph-caret-up' : 'ph-caret-down'" style="color:var(--text-muted);margin-left:auto;"></i>
                </div>
                <div v-if="expandedPlsql[0]" class="ws-plsql-body">
                    <div class="ws-hint">Un RECORD empaqueta múltiples campos heterogéneos bajo un solo identificador. Permite transportar filas completas o subconjuntos de datos sin declarar variables individuales sueltas.</div>
                    <div class="ws-field">
                        <label>Nombre de la variable RECORD</label>
                        <input class="ws-input" v-model="plsql.record.name" placeholder="r_resumen_pedido" style="font-family:'Courier New',monospace;">
                    </div>
                    <div class="ws-field">
                        <label>Campos agrupados en el RECORD <small class="ws-required">— Nombre y tipo de cada campo</small></label>
                        <textarea class="ws-textarea" v-model="plsql.record.fields" placeholder="Ej: id_pedido NUMBER, rut_cliente VARCHAR2(12), total_pagar NUMBER(10,2), estado VARCHAR2(20)"></textarea>
                    </div>
                    <div class="ws-field">
                        <label>Justificación técnica <small class="ws-required">— ¿Por qué usar RECORD aquí?</small></label>
                        <textarea class="ws-textarea" v-model="plsql.record.justification" placeholder="Expliquen por qué esta agrupación mejora la mantenibilidad, legibilidad y el paso de parámetros en su solución..."></textarea>
                    </div>
                </div>
            </div>

            <!-- VARRAY -->
            <div class="ws-plsql-card">
                <div class="ws-plsql-header" @click="togglePlsql(1)">
                    <div class="ws-plsql-icon" style="background:#ecfdf5;color:#10b981;"><i class="ph ph-list-numbers"></i></div>
                    <h4>2. VARRAY (Colección de Tamaño Acotado)</h4>
                    <span class="ws-plsql-badge practice">Diseño Obligatorio</span>
                    <i class="ph" :class="expandedPlsql[1] ? 'ph-caret-up' : 'ph-caret-down'" style="color:var(--text-muted);margin-left:auto;"></i>
                </div>
                <div v-if="expandedPlsql[1]" class="ws-plsql-body">
                    <div class="ws-hint">Un VARRAY es una colección indexada de longitud máxima fija que vive en memoria RAM. Es óptimo para listas cortas, conocidas y estables (días, estados, rangos de descuento).</div>
                    <div class="ws-field">
                        <label>Nombre de la variable VARRAY</label>
                        <input class="ws-input" v-model="plsql.varray.name" placeholder="v_estados_orden" style="font-family:'Courier New',monospace;">
                    </div>
                    <div class="ws-field">
                        <label>Propósito y valores que contendrá</label>
                        <textarea class="ws-textarea" v-model="plsql.varray.purpose" placeholder="Ej: Almacena los 4 estados posibles de una reserva ('PENDIENTE', 'CONFIRMADA', 'PAGADA', 'ANULADA') para validar transiciones sin consultar disco..."></textarea>
                    </div>
                    <div class="ws-field">
                        <label>Justificación técnica <small class="ws-required">— ¿Por qué VARRAY y no una tabla relacional o Nested Table?</small></label>
                        <textarea class="ws-textarea" v-model="plsql.varray.justification" placeholder="Justifiquen por qué la cantidad de elementos es predecible y fija..."></textarea>
                    </div>
                </div>
            </div>

            <!-- CURSOR -->
            <div class="ws-plsql-card">
                <div class="ws-plsql-header" @click="togglePlsql(2)">
                    <div class="ws-plsql-icon" style="background:#fef3c7;color:#d97706;"><i class="ph ph-cursor-click"></i></div>
                    <h4>3. Cursor Explícito con Ciclos Anidados (Maestro - Detalle)</h4>
                    <span class="ws-plsql-badge practice">Diseño Obligatorio</span>
                    <i class="ph" :class="expandedPlsql[2] ? 'ph-caret-up' : 'ph-caret-down'" style="color:var(--text-muted);margin-left:auto;"></i>
                </div>
                <div v-if="expandedPlsql[2]" class="ws-plsql-body">
                    <div class="ws-hint">Un cursor maestro-detalle procesa una tabla padre (ej: CLIENTE) y por cada fila abre un cursor hijo parametrizado (ej: DETALLE_COMPRAS del cliente) para calcular subtotales y aplicar lógica de negocio.</div>
                    <div class="ws-field">
                        <label>Consulta Maestro y Detalle <small class="ws-required">— ¿Cuáles son las tablas y qué busca cada cursor?</small></label>
                        <textarea class="ws-textarea" v-model="plsql.cursor.masterQuery" placeholder="Ej: Maestro = Selecciona clientes con compras en el mes actual. Detalle = Selecciona los items comprados por cada cliente (recibiendo id_cliente como parámetro)."></textarea>
                    </div>
                    <div class="ws-field">
                        <label>Parámetros que recibe el Cursor Detalle</label>
                        <input class="ws-input" v-model="plsql.cursor.params" placeholder="Ej: p_cliente_id NUMBER, p_mes NUMBER">
                    </div>
                    <div class="ws-field">
                        <label>Flujo del Ciclo Anidado <small class="ws-required">— Lógica paso a paso</small></label>
                        <textarea class="ws-textarea" v-model="plsql.cursor.flow" style="min-height:90px;" placeholder="1. Abrir cursor maestro de clientes&#10;2. Por cada cliente, inicializar acumulador en 0&#10;3. Abrir cursor detalle con id_cliente&#10;4. Calcular total y registrar en tabla de auditoría o liquidación..."></textarea>
                    </div>
                </div>
            </div>

            <!-- EXCEPTIONS -->
            <div class="ws-plsql-card">
                <div class="ws-plsql-header" @click="togglePlsql(3)">
                    <div class="ws-plsql-icon" style="background:#fef2f2;color:#ef4444;"><i class="ph ph-warning"></i></div>
                    <h4>4. Manejo Robusto de Excepciones</h4>
                    <span class="ws-plsql-badge practice">Diseño Obligatorio</span>
                    <i class="ph" :class="expandedPlsql[3] ? 'ph-caret-up' : 'ph-caret-down'" style="color:var(--text-muted);margin-left:auto;"></i>
                </div>
                <div v-if="expandedPlsql[3]" class="ws-plsql-body">
                    <div class="ws-hint">El manejo de excepciones garantiza que ante cualquier fallo imprevisto o violación de reglas, la base de datos proteja la consistencia de datos sin caer en estados inconsistentes.</div>
                    <div class="ws-field">
                        <label>Excepciones Predefinidas de Oracle que van a capturar</label>
                        <div class="ws-checkbox-grid">
                            <div v-for="ex in workshopData.predefinedExceptions" :key="ex.name"
                                 class="ws-checkbox-item"
                                 :class="{ checked: plsql.exPredefined.includes(ex.name) }"
                                 @click="togglePredefinedException(ex.name)">
                                <i class="ws-check-icon ph" :class="plsql.exPredefined.includes(ex.name) ? 'ph-check-square' : 'ph-square'"></i>
                                <code>{{ ex.name }}</code>
                            </div>
                        </div>
                    </div>
                    <div class="ws-divider"></div>
                    <div class="ws-field">
                        <label>Nombre de su Excepción Personalizada de Negocio</label>
                        <input class="ws-input" v-model="plsql.exCustom.name" placeholder="e_cupo_agotado" style="font-family:'Courier New',monospace;">
                    </div>
                    <div class="ws-field-inline">
                        <div class="ws-field">
                            <label>Código Oracle (Rango -20000 a -20999)</label>
                            <input class="ws-input" v-model="plsql.exCustom.code" placeholder="-20001" style="font-family:'Courier New',monospace;max-width:140px;">
                        </div>
                    </div>
                    <div class="ws-field">
                        <label>Condición de disparo <small class="ws-required">— ¿Cuándo se lanza y qué mensaje se entrega?</small></label>
                        <textarea class="ws-textarea" v-model="plsql.exCustom.condition" placeholder="Ej: Se lanza cuando un usuario intenta reservar pero el cupo disponible de la cancha es 0. Se dispara RAISE_APPLICATION_ERROR(-20001, 'Horario agotado')."></textarea>
                    </div>
                </div>
            </div>

            <!-- PROC/FUNC — THEORY -->
            <div class="ws-plsql-card">
                <div class="ws-plsql-header" @click="togglePlsql(4)">
                    <div class="ws-plsql-icon" style="background:#e0e7ff;color:#4f46e5;"><i class="ph ph-function"></i></div>
                    <h4>5. Procedimientos y Funciones Almacenadas</h4>
                    <span class="ws-plsql-badge theory">Investigación Teórica</span>
                    <i class="ph" :class="expandedPlsql[4] ? 'ph-caret-up' : 'ph-caret-down'" style="color:var(--text-muted);margin-left:auto;"></i>
                </div>
                <div v-if="expandedPlsql[4]" class="ws-plsql-body">
                    <div class="ws-hint">Para la evaluación deben investigar y argumentar: diferencias conceptuales entre FUNCTION y PROCEDURE, modos de parámetros (IN, OUT, IN OUT), y qué procedimiento/función crearía su equipo en el proyecto.</div>
                    <div class="ws-field">
                        <label>Notas de Investigación y Propuesta de Aplicación</label>
                        <textarea class="ws-textarea" v-model="plsql.procFunc.understanding" style="min-height:120px;"
                            placeholder="• ¿Qué diferencia a un procedimiento de una función en Oracle?&#10;• ¿Para qué sirve el modo IN, OUT e IN OUT?&#10;• En nuestro proyecto: crearíamos un PROCEDURE llamado sp_liquidar_mes(...) y una FUNCTION llamada fn_calcular_descuento(...) que retorna NUMBER."></textarea>
                    </div>
                </div>
            </div>

            <!-- PACKAGES — THEORY -->
            <div class="ws-plsql-card">
                <div class="ws-plsql-header" @click="togglePlsql(5)">
                    <div class="ws-plsql-icon" style="background:#fce7f3;color:#db2777;"><i class="ph ph-package"></i></div>
                    <h4>6. Packages (Paquetes PL/SQL)</h4>
                    <span class="ws-plsql-badge theory">Investigación Teórica</span>
                    <i class="ph" :class="expandedPlsql[5] ? 'ph-caret-up' : 'ph-caret-down'" style="color:var(--text-muted);margin-left:auto;"></i>
                </div>
                <div v-if="expandedPlsql[5]" class="ws-plsql-body">
                    <div class="ws-hint">Investiguen el principio de encapsulamiento: separación entre Especificación (interfaz pública) y Body (implementación privada), y ventajas de rendimiento y modularidad.</div>
                    <div class="ws-field">
                        <label>Notas de Investigación y Propuesta de Package</label>
                        <textarea class="ws-textarea" v-model="plsql.packages.understanding" style="min-height:120px;"
                            placeholder="• ¿Qué ventajas ofrece empaquetar código en Oracle?&#10;• ¿Qué elementos se declaran en el Specification vs el Body?&#10;• En nuestro proyecto: diseñaríamos el package pkg_gestion_reservas para agrupar todas las operaciones de reservas y pagos."></textarea>
                    </div>
                </div>
            </div>

            <!-- TRIGGERS — THEORY -->
            <div class="ws-plsql-card">
                <div class="ws-plsql-header" @click="togglePlsql(6)">
                    <div class="ws-plsql-icon" style="background:#fef9c3;color:#ca8a04;"><i class="ph ph-lightning"></i></div>
                    <h4>7. Triggers (Disparadores de Base de Datos)</h4>
                    <span class="ws-plsql-badge theory">Investigación Teórica</span>
                    <i class="ph" :class="expandedPlsql[6] ? 'ph-caret-up' : 'ph-caret-down'" style="color:var(--text-muted);margin-left:auto;"></i>
                </div>
                <div v-if="expandedPlsql[6]" class="ws-plsql-body">
                    <div class="ws-hint">Investiguen el ciclo de vida de los triggers: eventos DML (INSERT, UPDATE, DELETE), tiempos (BEFORE, AFTER), nivel de fila (FOR EACH ROW) y los pseudo-registros :NEW y :OLD.</div>
                    <div class="ws-field">
                        <label>Notas de Investigación y Propuesta de Trigger</label>
                        <textarea class="ws-textarea" v-model="plsql.triggers.understanding" style="min-height:120px;"
                            placeholder="• ¿Cuándo conviene usar BEFORE vs AFTER?&#10;• ¿Qué contienen :NEW y :OLD al actualizar un registro?&#10;• En nuestro proyecto: un trigger BEFORE UPDATE ON reserva FOR EACH ROW que impida modificar el estado si ya está cancelada."></textarea>
                    </div>
                </div>
            </div>

            <div class="ws-nav">
                <button class="ws-btn ws-btn-ghost" @click="prevSection">
                    <i class="ph ph-arrow-left"></i> Anterior
                </button>
                <button class="ws-btn ws-btn-primary" @click="nextSection">
                    Siguiente: Resumen y Exportar <i class="ph ph-arrow-right"></i>
                </button>
            </div>
        </div>

        <!-- ================================================================
             SECTION 5: SUMMARY & EXPORT
             ================================================================ -->
        <div v-if="currentSection === 4" class="ws-section">
            <div class="ws-section-header">
                <div class="ws-section-number" :style="{ background: workshopData.sections[4].color }">5</div>
                <h2>{{ workshopData.sections[4].title }}</h2>
                <span class="ws-section-time"><i class="ph ph-timer"></i> {{ workshopData.sections[4].time }}</span>
            </div>

            <!-- GLOBAL PROGRESS CARD -->
            <div class="ws-card">
                <div class="ws-progress-overview">
                    <div>
                        <h3><i class="ph ph-chart-bar"></i> Progreso General: {{ totalProgress }}%</h3>
                        <p class="ws-progress-subtitle">{{ totalProgress >= 80 ? '¡Excelente avance! Su proyecto está listo para exportar.' : 'Aún tienen secciones con datos pendientes de completar.' }}</p>
                    </div>
                    <span class="ws-progress-badge" :class="totalProgress >= 80 ? 'complete' : 'in-progress'">
                        {{ totalProgress >= 80 ? 'Listo para entrega' : 'En progreso' }}
                    </span>
                </div>
                <div class="ws-progress-bar-container">
                    <div class="ws-progress-bar-fill" :style="{ width: totalProgress + '%', background: totalProgress >= 80 ? 'var(--success)' : 'var(--warning)' }"></div>
                </div>

                <!-- SUMMARY ACCORDIONS -->
                <div class="ws-summary-section" v-for="(sec, si) in workshopData.sections.slice(0, 4)" :key="'sum-'+si">
                    <div class="ws-summary-header" @click="toggleSummary(si)">
                        <h4>
                            <i class="ph" :class="sec.icon"></i>
                            {{ sec.title }}
                        </h4>
                        <div class="ws-summary-header-right">
                            <span class="ws-progress-pill" :class="progressLabel(sectionProgress[si])">
                                {{ progressText(sectionProgress[si]) }}
                            </span>
                            <i class="ph" :class="expandedSummary[si] ? 'ph-caret-up' : 'ph-caret-down'"></i>
                        </div>
                    </div>
                    <div v-if="expandedSummary[si]" class="ws-summary-body">
                        <!-- Section 1 summary -->
                        <template v-if="si === 0">
                            <p><strong>Proyecto:</strong> {{ team.projectName || '—' }}</p>
                            <p><strong>Integrantes:</strong> {{ team.members.filter(m => m.name).map(m => m.name + ' ' + m.lastname).join(', ') || '—' }}</p>
                            <p><strong>Rubro:</strong> {{ team.sector || '—' }}</p>
                            <p><strong>Objetivo:</strong> {{ team.objectiveDesc || '—' }}</p>
                        </template>
                        <!-- Section 2 summary -->
                        <template v-if="si === 1">
                            <p><strong>Entidades definidas:</strong> {{ entities.filter(e => e.name.trim()).length }}</p>
                            <p v-if="entities.length > 0"><strong>Tablas:</strong> {{ entityNames.join(', ') }}</p>
                        </template>
                        <!-- Section 3 summary -->
                        <template v-if="si === 2">
                            <p><strong>Reglas de negocio:</strong> {{ rules.filter(r => r.description.trim()).length }} registradas</p>
                            <p><strong>Narrativas:</strong> {{ narratives.filter(n => n.action.trim()).length }} mapeadas</p>
                        </template>
                        <!-- Section 4 summary -->
                        <template v-if="si === 3">
                            <p><strong>RECORD:</strong> {{ plsql.record.name || 'pendiente' }}</p>
                            <p><strong>VARRAY:</strong> {{ plsql.varray.name || 'pendiente' }}</p>
                            <p><strong>Cursor maestro:</strong> {{ plsql.cursor.masterQuery ? 'Definido' : 'pendiente' }}</p>
                            <p><strong>Excepción personalizada:</strong> {{ plsql.exCustom.name || 'pendiente' }}</p>
                        </template>
                    </div>
                </div>
            </div>

            <!-- CHECKLIST SEMAFORO CARD -->
            <div class="ws-card ws-checklist-card">
                <h3><i class="ph ph-clipboard-text"></i> Checklist de Completitud de Entregables</h3>
                <p class="ws-checklist-desc">Semáforo pedagógico para verificar que no falte nada crucial antes de exportar el archivo:</p>
                
                <div class="ws-checklist-list">
                    <div v-for="item in checklistItems" :key="item.id" class="ws-checklist-item" :class="'status-' + item.status">
                        <div class="ws-checklist-icon">
                            <i v-if="item.status === 'ok'" class="ph ph-check-circle"></i>
                            <i v-else-if="item.status === 'warning'" class="ph ph-warning-circle"></i>
                            <i v-else class="ph ph-x-circle"></i>
                        </div>
                        <div class="ws-checklist-content">
                            <div class="ws-checklist-header-line">
                                <strong>{{ item.title }}</strong>
                                <span class="ws-checklist-badge" :class="'badge-' + item.status">
                                    {{ item.status === 'ok' ? 'Completado' : item.status === 'warning' ? 'En progreso' : 'Pendiente' }}
                                </span>
                            </div>
                            <p>{{ item.message }}</p>
                        </div>
                        <button v-if="item.status !== 'ok'" class="ws-btn ws-btn-sm ws-btn-ghost ws-checklist-btn" @click="goToSection(item.sectionIndex)">
                            Completar <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mermaid preview in summary -->
            <div v-if="mermaidSvg" class="ws-mermaid-container" style="margin-bottom:1.5rem;">
                <div class="ws-mermaid-header">
                    <h4><i class="ph ph-graph"></i> Diagrama ER del Proyecto</h4>
                    <button class="ws-btn ws-btn-sm ws-btn-copy-mini" @click="copyMermaidCode" title="Copiar código Mermaid">
                        <i class="ph" :class="copiedMermaid ? 'ph-check' : 'ph-code'"></i>
                        {{ copiedMermaid ? '¡Copiado!' : 'Copiar Mermaid' }}
                    </button>
                </div>
                <div v-html="mermaidSvg" class="ws-mermaid-svg-wrapper"></div>
            </div>

            <!-- EXPORT AREA -->
            <div class="ws-export-area">
                <div class="ws-export-icon"><i class="ph ph-file-md"></i></div>
                <h3>Exportar Entregable Final</h3>
                <p>Descarguen el archivo Markdown (<strong>.md</strong>) estructurado o copien todo el contenido directamente al portapapeles para su informe, presentación o consulta asistida por IA.</p>
                <div class="ws-export-buttons">
                    <button class="ws-btn-export" @click="exportToMarkdown">
                        <i class="ph ph-download-simple"></i> Descargar Entregable (.md)
                    </button>
                    <button class="ws-btn-export-secondary" @click="copyMarkdownToClipboard">
                        <i class="ph" :class="copiedMd ? 'ph-check' : 'ph-copy'"></i>
                        {{ copiedMd ? '¡Copiado al portapapeles!' : 'Copiar Markdown al portapapeles' }}
                    </button>
                </div>
            </div>

            <div class="ws-nav">
                <button class="ws-btn ws-btn-ghost" @click="prevSection">
                    <i class="ph ph-arrow-left"></i> Anterior
                </button>
                <div></div>
            </div>

            <!-- RESET LINK -->
            <div class="ws-reset-area">
                <button class="ws-btn-reset-link" @click="confirmReset">
                    <i class="ph ph-arrow-counter-clockwise"></i> Reiniciar borrador de este taller
                </button>
            </div>
        </div>

        <!-- FLOATING BOTTOM NAV BAR -->
        <div class="ws-floating-nav">
            <div class="ws-float-step-info">
                <span class="ws-float-pill">Paso {{ currentSection + 1 }} de 5</span>
                <span class="ws-float-title">{{ workshopData.sections[currentSection].title }}</span>
            </div>
            <div class="ws-float-actions">
                <button v-if="currentSection > 0" class="ws-btn ws-btn-ghost ws-btn-sm" @click="prevSection">
                    <i class="ph ph-arrow-left"></i> Anterior
                </button>
                <button v-if="currentSection < 4" class="ws-btn ws-btn-primary ws-btn-sm" @click="nextSection">
                    Siguiente <i class="ph ph-arrow-right"></i>
                </button>
                <button class="ws-btn ws-btn-ghost ws-btn-sm ws-btn-icon" @click="scrollToTop" title="Subir arriba">
                    <i class="ph ph-arrow-up"></i>
                </button>
            </div>
        </div>

        <!-- TOAST NOTIFICATION -->
        <transition name="ws-toast">
            <div v-if="showToastFlag" class="ws-toast">
                <i class="ph ph-check-circle"></i> {{ toastMessage }}
            </div>
        </transition>

        <!-- RESET CONFIRMATION MODAL -->
        <div v-if="showResetModal" class="ws-modal-overlay" @click.self="showResetModal = false">
            <div class="ws-modal">
                <div class="ws-modal-header">
                    <i class="ph ph-warning-octagon"></i>
                    <h4>¿Reiniciar todo el borrador?</h4>
                </div>
                <p>Esta acción borrará todos los datos ingresados (equipo, entidades, reglas y componentes) almacenados en este navegador. Utilízala únicamente si deseas comenzar un nuevo proyecto desde cero.</p>
                <div class="ws-modal-actions">
                    <button class="ws-btn ws-btn-ghost" @click="showResetModal = false">Cancelar</button>
                    <button class="ws-btn ws-btn-danger-solid" @click="executeReset">Sí, reiniciar borrador</button>
                </div>
            </div>
        </div>

    </div>
    `
};
