/**
 * BIO-SIM ENGINE V3: THE BOND GARDEN
 * Finalized Logic: Bloom Sync, Genetic Vault, and Global Bond
 */

const SPECIES = {
    // --- CLASSIC EARTH SERIES ---
    MANGO: { label: 'Mangifera', leaf: 'lanceolate', color: '#2e7d32', fruit: '#ffc107', angle: 32, growth: 1.1, bifurcation: 2, curvature: 5 },
    BANANA: { label: 'Musa', leaf: 'oblong', color: '#4caf50', fruit: '#ffeb3b', angle: 8, growth: 1.5, bifurcation: 1, curvature: 2 },
    WILLOW: { label: 'Salix', leaf: 'linear', color: '#81c784', fruit: '#e8f5e9', angle: 60, growth: 0.8, bifurcation: 2, curvature: 15 },
    OAK: { label: 'Quercus', leaf: 'oblong', color: '#1b5e20', fruit: '#795548', angle: 45, growth: 0.7, bifurcation: 2, curvature: 2 },
    CHERRY: { label: 'Prunus', leaf: 'lanceolate', color: '#f48fb1', fruit: '#ff1744', angle: 35, growth: 1.2, bifurcation: 2, curvature: 8 },
    PINE: { label: 'Pinus', leaf: 'linear', color: '#1b3022', fruit: '#5d4037', angle: 25, growth: 1.3, bifurcation: 3, curvature: 0 },
    MAPLE: { label: 'Acer', leaf: 'oblong', color: '#e64a19', fruit: '#ffcc80', angle: 40, growth: 1.0, bifurcation: 2, curvature: 4 },
    BAMBOO: { label: 'Bambusoideae', leaf: 'linear', color: '#689f38', fruit: '#dcedc8', angle: 5, growth: 2.0, bifurcation: 1, curvature: 1 },

    // --- EXOTIC & RARE ---
    BAOBAB: { label: 'Adansonia', leaf: 'oblong', color: '#795548', fruit: '#afb42b', angle: 20, growth: 0.5, bifurcation: 4, curvature: -2 },
    WISTERIA: { label: 'Wisteria', leaf: 'linear', color: '#9575cd', fruit: '#e1bee7', angle: 55, growth: 1.1, bifurcation: 2, curvature: 20 },
    DRAGON: { label: 'Dracaena', leaf: 'lanceolate', color: '#388e3c', fruit: '#d32f2f', angle: 15, growth: 0.9, bifurcation: 2, curvature: 5 },
    BANYAN: { label: 'Ficus', leaf: 'oblong', color: '#2e7d32', fruit: '#f06292', angle: 50, growth: 0.6, bifurcation: 5, curvature: 10 },

    // --- XENO & CYBER (TECH) SERIES ---
    ALIEN: { label: 'Xeno-Flora', leaf: 'oblong', color: '#7b1fa2', fruit: '#00e5ff', angle: 45, growth: 1.2, bifurcation: 3, curvature: -10 },
    NEON: { label: 'Cyber-Spire', leaf: 'linear', color: '#00f2ff', fruit: '#ffffff', angle: 90, growth: 1.4, bifurcation: 2, curvature: 0 },
    PLASMA: { label: 'Ion-Root', leaf: 'lanceolate', color: '#ff0055', fruit: '#ffeb3b', angle: 30, growth: 1.2, bifurcation: 3, curvature: -20 },
    VOID: { label: 'Abyssal-Stalk', leaf: 'oblong', color: '#1a1a1a', fruit: '#7b1fa2', angle: 65, growth: 0.8, bifurcation: 2, curvature: 30 },
    CRYSTAL: { label: 'Quartz-Stem', leaf: 'linear', color: '#e0f7fa', fruit: '#b2ebf2', angle: 45, growth: 0.7, bifurcation: 2, curvature: -5 },
    GOLDEN: { label: 'Midas-Touch', leaf: 'lanceolate', color: '#ffd700', fruit: '#ffecb3', angle: 38, growth: 1.0, bifurcation: 2, curvature: 5 },

    // --- GLOW & ROMANCE SERIES ---
    HEART: { label: 'Amora-Leaf', leaf: 'oblong', color: '#ff80ab', fruit: '#ff4081', angle: 42, growth: 1.1, bifurcation: 2, curvature: 12 },
    MIDNIGHT: { label: 'Luna-Flora', leaf: 'linear', color: '#3f51b5', fruit: '#c5cae9', angle: 50, growth: 0.9, bifurcation: 2, curvature: 18 },
    SUNSET: { label: 'Sol-Petal', leaf: 'lanceolate', color: '#ff5722', fruit: '#ff9800', angle: 30, growth: 1.2, bifurcation: 3, curvature: 5 },
    GLITCH: { label: 'Null-Pointer', leaf: 'linear', color: '#00ff41', fruit: '#ff0000', angle: -20, growth: 1.5, bifurcation: 4, curvature: -15 },
    AQUA: { label: 'Triton-Vine', leaf: 'oblong', color: '#00acc1', fruit: '#e0f7fa', angle: 70, growth: 1.0, bifurcation: 2, curvature: 25 },
    MAGMA: { label: 'Core-Sprout', leaf: 'lanceolate', color: '#bf360c', fruit: '#ff3d00', angle: 20, growth: 0.8, bifurcation: 2, curvature: -8 }
};

class BioEngine {
    constructor() {
        this.hearts = [];
        this.canvas = document.getElementById('treeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ui = document.getElementById('ui-root');

        // Setup State with Defaults
        this.state = JSON.parse(localStorage.getItem('BIO_VAULT')) || {
            globalOwner: '',
            targetName: '',
            bondFactor: 1.0,
            trees: [],
            inventory: []
        };

        this.selectedIndex = 0;
        this.view = 'HUD';
        this.pulse = 0;
        this.pendingSeedDNA = null;

        this.init();
        this.initEventListeners();
        this.resize();
        this.loop();
    }

    init() {
        // Fix for existing trees missing new properties
        this.state.trees.forEach(t => {
            if (t.hydrationCount === undefined) t.hydrationCount = 0;
        });

        if (!this.state.globalOwner) {
            this.renderOnboarding();
        } else {
            this.applyTimeLogic();
            this.renderHUD();
        }
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }

    resize() {
        this.canvas.width = window.innerWidth - 350;
        this.canvas.height = window.innerHeight;
    }

    save() { localStorage.setItem('BIO_VAULT', JSON.stringify(this.state)); }

    // --- BIOLOGICAL LOGIC ---

    calculateBond(n1, n2) {
        let hash = 0;
        let combined = (n1 + n2).toLowerCase();
        for (let i = 0; i < combined.length; i++) {
            hash = ((hash << 5) - hash) + combined.charCodeAt(i);
            hash |= 0;
        }
        return 0.7 + (Math.abs(hash) % 80) / 100;
    }

    applyTimeLogic() {
        const now = Date.now();
        this.state.trees.forEach(t => {
            if (t.isDead || t.lastWatered === 0) return;
            const hours = (now - t.lastWatered) / 3600000;
            if (hours > 120) t.isDead = true;
            else if (hours > 48) {
                t.health = Math.max(0, t.health - (hours - 48) * (2 / this.state.bondFactor));
            }
            if (t.health <= 0) t.isDead = true;
        });
        this.save();
    }

    water() {
        const t = this.state.trees[this.selectedIndex];
        if (!t || t.isDead) return;
        const now = Date.now();

        // 24h Cooldown - Comment out for testing
        if (now - t.lastWatered < 86400000) return this.toast("HYDRATION_COOLDOWN");

        t.lastWatered = now;
        t.health = Math.min(100, t.health + 25);
        t.hydrationCount = (t.hydrationCount || 0) + 1;

        // Influence Global Bond (Grows by 0.05 per action)
        this.state.bondFactor = parseFloat((this.state.bondFactor + 0.05).toFixed(2));

        // Bloom Sync Logic (The 5-Step Rule)
        if (t.hydrationCount >= 5) {
            const newFruits = Math.floor(Math.random() * 4) + 1;
            t.fruitCount += newFruits;
            t.hydrationCount = 0;
            this.toast(`BLOOM_EVENT: +${newFruits} FRUITS`);
            this.triggerHeartBurst(t, 40);
        } else {
            this.toast(`PULSE_SENT: ${t.hydrationCount}/5 TO BLOOM`);
            this.triggerHeartBurst(t, 12);
        }

        t.stage += (t.health / 100) * t.dna.growth * this.state.bondFactor;

        this.save();
        this.renderHUD();
    }

    harvest() {
        const t = this.state.trees[this.selectedIndex];
        if (t && t.fruitCount > 0) {
            t.fruitCount--;
            const newSeed = {
                id: Date.now(),
                parent: t.dna.label,
                dna: {
                    ...t.dna,
                    label: t.dna.label + "_Gen" + Math.floor(t.stage),
                    growth: t.dna.growth * (0.98 + Math.random() * 0.04)
                }
            };
            this.state.inventory.push(newSeed);
            this.save();
            this.renderHUD();
            this.toast("FRUIT_VAULTED");
        }
    }

    // --- UI & INTERACTION ---

    renderOnboarding() {
        this.ui.innerHTML = `
            <h1>Bond Garden of.... ${this.state.globalOwner} ${this.state.targetName}</h1>
            <p class="sub">Digital Love? (you matter)</p>
            <div class="input-group">
                <label>Owner's Id</label><input id="oIn" type="text" placeholder="Misha">
            </div>
            <div class="input-group">
                <label>Targeted Person</label><input id="tIn" type="text" placeholder="Victor">
            </div>
            <button onclick="sim.finalizeOnboarding()">LINK_SYSTEM</button>
        `;
    }

    finalizeOnboarding() {
        this.state.globalOwner = document.getElementById('oIn').value || 'ADMIN';
        this.state.targetName = document.getElementById('tIn').value || 'USER';
        this.state.bondFactor = this.calculateBond(this.state.globalOwner, this.state.targetName);
        this.renderArchitect();
    }

    renderArchitect() {
        this.ui.innerHTML = `
            <h1>GENE_ARCHITECT</h1>
            <p class="sub">Initial Bond: x${this.state.bondFactor.toFixed(2)}</p>
            <label>TEMPLATE</label>
            <select id="tSel">
                ${Object.keys(SPECIES).map(k => `<option value="${k}">${SPECIES[k].label}</option>`).join('')}
            </select>
            <label>MOD_BIFURCATION</label>
            <select id="bSel"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option></select>
            <label>TINT</label><input type="color" id="cIn" value="#00ff6a">
            <button onclick="sim.finalizeArchitect()">START_SIMULATION</button>
        `;
    }

    finalizeArchitect() {
        const base = SPECIES[document.getElementById('tSel').value];
        const dna = {
            ...base,
            color: document.getElementById('cIn').value,
            bifurcation: parseInt(document.getElementById('bSel').value)
        };
        this.createNewTree(this.canvas.width / 2, dna);
    }

    renderHUD() {
        if (this.view === 'VAULT') return this.renderVault();
        const t = this.state.trees[this.selectedIndex];
        if (!t) return;

        const count = t.hydrationCount || 0;

        this.ui.innerHTML = `
            <h1>${this.state.globalOwner} & ${this.state.targetName}</h1>
            <p class="sub">System Resonance: x${this.state.bondFactor.toFixed(2)}</p>
            
            <div class="hud-stats">
                GENOME: <span>${t.dna.label}</span><br>
                HEALTH: <span>${t.health.toFixed(0)}%</span><br>
                STAGE: <span>${t.stage.toFixed(2)}</span><br>
                FRUITS: <span>${t.fruitCount}</span>
                
                <div style="margin: 15px 0 5px 0; background: #111; height: 6px; width: 100%; border-radius: 3px; overflow: hidden;">
                    <div style="background: #00ff6a; height: 100%; width: ${(count / 5) * 100}%; transition: width 0.5s ease;"></div>
                </div>
                <div style="font-size: 9px; text-align: right; color: #444;">Bloom Sync: ${count}/5</div>
            </div>

            <button onclick="sim.water()">HYDRATE</button>
            <button onclick="sim.harvest()" ${t.fruitCount === 0 ? 'disabled' : ''}>HARVEST_VAULT</button>
            <button onclick="sim.toggleVault()" style="background:#1a1a1a; color:#00ff6a; margin-top:10px">OPEN_STORAGE (${this.state.inventory.length})</button>
            
            <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                <button onclick="sim.exportGarden()" style="background:#00ff6a; font-size:15px; padding: 8px;">EXPORT</button>
                <button onclick="sim.importGarden()" style="background:#00ff6a; font-size:15px; padding: 8px;">IMPORT</button>
            </div>
        `;
    }

    renderVault() {
        this.ui.innerHTML = `
            <h1>SEED_VAULT</h1>
            <div style="max-height: 400px; overflow-y: auto; margin-top: 10px;">
                ${this.state.inventory.length === 0 ? '<p style="font-size:10px; color:#444">VAULT_EMPTY</p>' :
                this.state.inventory.map((item, i) => `
                        <div style="border:1px solid #222; padding:10px; margin-bottom:10px; background: #050505;">
                            <span style="color:#fff; font-size:11px">${item.dna.label}</span><br>
                            <span style="font-size:9px; color:#666">Parent: ${item.parent}</span>
                            <button onclick="sim.plantFromVault(${i})" style="padding:5px; margin-top:5px; font-size:9px;">PLANT_GENETIC_DATA</button>
                        </div>
                    `).join('')
            }
            </div>
            <button onclick="sim.toggleVault()" style="margin-top:20px; background:#333">BACK_TO_HUD</button>
        `;
    }

    // --- SYSTEM UTILS ---

    toggleVault() { this.view = this.view === 'HUD' ? 'VAULT' : 'HUD'; this.renderHUD(); }

    createNewTree(x, dna) {
        this.state.trees.push({
            x, dna, health: 100, stage: 0.1, lastWatered: 0, hydrationCount: 0, fruitCount: 0, isDead: false
        });
        this.selectedIndex = this.state.trees.length - 1;
        this.save();
        this.renderHUD();
    }

    plantFromVault(seedIndex) {
        this.pendingSeedDNA = this.state.inventory[seedIndex].dna;
        this.state.inventory.splice(seedIndex, 1);
        this.view = 'HUD';
        this.save();
        this.renderHUD();
        this.toast("CLICK_CANVAS_TO_PLANT");
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        let clickedTree = -1;
        this.state.trees.forEach((t, i) => { if (Math.abs(t.x - x) < 50) clickedTree = i; });

        if (this.pendingSeedDNA) {
            if (clickedTree === -1) {
                this.createNewTree(x, this.pendingSeedDNA);
                this.pendingSeedDNA = null;
            } else { this.toast("ZONE_OCCUPIED"); }
        } else if (clickedTree !== -1) {
            this.selectedIndex = clickedTree;
            this.renderHUD();
        }
    }

    exportGarden() {
        const data = btoa(JSON.stringify({ owner: this.state.globalOwner, trees: this.state.trees, bond: this.state.bondFactor }));
        navigator.clipboard.writeText(data);
        this.toast("DATA_VAULTED_TO_CLIPBOARD");
    }

    importGarden() {
        const input = prompt("PASTE_GENETIC_DATA:");
        if (!input) return;
        try {
            const imported = JSON.parse(atob(input));
            imported.trees.forEach(t => {
                if (!this.state.trees.some(existing => Math.abs(existing.x - t.x) < 10)) {
                    t.dna.label += ` (Link)`;
                    this.state.trees.push(t);
                }
            });
            this.state.bondFactor = (this.state.bondFactor + imported.bond) / 2;
            this.save(); this.renderHUD();
            this.toast("SYNC_COMPLETE");
        } catch (e) { this.toast("CORRUPT_DATA"); }
    }

    triggerHeartBurst(t, count) {
        for (let i = 0; i < count; i++) {
            this.hearts.push({
                x: t.x, y: this.canvas.height - 40,
                vx: (Math.random() - 0.5) * 6,
                vy: -Math.random() * 6 - 2,
                opacity: 1, size: Math.random() * 15 + 10
            });
        }
    }

    // --- RENDER ENGINE ---

    drawTree(t, isSelected) {
        this.ctx.save();
        if (t.stage < 1) {
            const glow = Math.sin(this.pulse) * 5 + 10;
            this.ctx.fillStyle = isSelected ? `rgba(0, 255, 106, 0.4)` : `rgba(255, 255, 255, 0.1)`;
            this.ctx.beginPath(); this.ctx.arc(t.x, this.canvas.height - 20, glow, 0, Math.PI * 2); this.ctx.fill();
            this.ctx.fillStyle = "#8bc34a";
            this.ctx.beginPath(); this.ctx.ellipse(t.x, this.canvas.height - 20, 4, 7, Math.sin(this.pulse) * 0.2, 0, Math.PI * 2); this.ctx.fill();
        } else {
            if (isSelected) {
                this.ctx.shadowBlur = 15; this.ctx.shadowColor = "rgba(0,255,106,0.3)";
                this.ctx.strokeStyle = "rgba(0,255,106,0.2)";
                this.ctx.beginPath(); this.ctx.ellipse(t.x, this.canvas.height - 20, 70, 20, 0, 0, Math.PI * 2); this.ctx.stroke();
            }
            this.recursiveBranch(t.x, this.canvas.height - 20, t.stage * 11, 0, t.stage * 1.5, Math.min(Math.floor(t.stage), 8), t.dna, t.isDead, t.fruitCount);
        }
        this.ctx.restore();
    }
    updateArchitectPreview() {
        const base = SPECIES[document.getElementById('tSel').value];
        document.getElementById('leafCol').value = base.color;
    }

    recursiveBranch(x, y, len, ang, wid, dep, dna, dead, fruits) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(ang * Math.PI / 180);
        // Use custom trunk color if available, otherwise use organic depth shading
        const baseTrunk = dna.trunkColor || "#3d2b1f";
        this.ctx.strokeStyle = dead ? "#222" : baseTrunk;
        this.ctx.lineWidth = wid;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath(); this.ctx.moveTo(0, 0);
        this.ctx.quadraticCurveTo(dna.curvature || 0, -len / 2, 0, -len);
        this.ctx.stroke();

        if (dep <= 0) {
            if (!dead) {
                this.ctx.fillStyle = dna.color;
                for (let i = 0; i < 3; i++) {
                    this.ctx.save(); this.ctx.translate(0, -len);
                    this.ctx.rotate((i * 120 + this.pulse * 10) * Math.PI / 180);
                    this.drawLeaf(dna.leaf); this.ctx.restore();
                }
                if (fruits > 0) {
                    this.ctx.fillStyle = dna.fruit;
                    this.ctx.beginPath(); this.ctx.arc(0, -len, 5, 0, Math.PI * 2); this.ctx.fill();
                }
            }
            this.ctx.restore(); return;
        }

        const bCount = dna.bifurcation || 2;
        for (let i = 0; i < bCount; i++) {
            const rot = (i - (bCount - 1) / 2) * dna.angle;
            this.recursiveBranch(0, -len, len * 0.78, rot, wid * 0.7, dep - 1, dna, dead, fruits);
        }
        this.ctx.restore();
    }

    drawLeaf(type) {
        if (type === 'lanceolate') { this.ctx.beginPath(); this.ctx.ellipse(5, 0, 8, 3, 0, 0, Math.PI * 2); this.ctx.fill(); }
        else if (type === 'oblong') { this.ctx.beginPath(); this.ctx.ellipse(7, 0, 10, 8, 0, 0, Math.PI * 2); this.ctx.fill(); }
        else { this.ctx.beginPath(); this.ctx.moveTo(0, 0); this.ctx.lineTo(10, 5); this.ctx.stroke(); }
    }

    loop() {
        this.pulse += 0.02;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "#111";
        this.ctx.beginPath(); this.ctx.moveTo(0, this.canvas.height - 20); this.ctx.lineTo(this.canvas.width, this.canvas.height - 20); this.ctx.stroke();

        this.state.trees.forEach((t, i) => this.drawTree(t, i === this.selectedIndex));

        this.hearts.forEach((h, i) => {
            h.x += h.vx; h.y += h.vy; h.opacity -= 0.01;
            this.ctx.save();
            this.ctx.globalAlpha = h.opacity;
            this.ctx.fillStyle = "#ff4081";
            this.ctx.shadowBlur = 15; this.ctx.shadowColor = "#ff4081";
            this.ctx.font = `${h.size}px Arial`; this.ctx.fillText("❤", h.x, h.y);
            this.ctx.restore();
            if (h.opacity <= 0) this.hearts.splice(i, 1);
        });
        requestAnimationFrame(() => this.loop());
    }
    finalizeArchitect() {
        const base = SPECIES[document.getElementById('tSel').value];
        const dna = {
            ...base,
            // We now take the leaf color and the trunk/accent color from the UI
            color: document.getElementById('leafCol').value,
            trunkColor: document.getElementById('trunkCol').value,
            bifurcation: parseInt(document.getElementById('bSel').value)
        };
        this.createNewTree(this.canvas.width / 2, dna);
    }
    renderArchitect() {
        this.ui.innerHTML = `
        <h1>GENE_ARCHITECT</h1>
        <p class="sub">Customizing specimen for ${this.state.targetName}</p>
        
        <label>GENETIC_TEMPLATE</label>
        <select id="tSel" onchange="sim.updateArchitectPreview()">
            ${Object.keys(SPECIES).map(k => `<option value="${k}">${SPECIES[k].label}</option>`).join('')}
        </select>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top:10px;">
            <div>
                <label>LEAF_TINT</label>
                <input type="color" id="leafCol" value="#00ff6a">
            </div>
            <div>
                <label>TRUNK_TINT</label>
                <input type="color" id="trunkCol" value="#443322">
            </div>
        </div>

        <label>MOD_BIFURCATION</label>
        <select id="bSel">
            <option value="1">1 (Minimal)</option>
            <option value="2" selected>2 (Standard)</option>
            <option value="3">3 (Dense)</option>
        </select>
        
        <button onclick="sim.finalizeArchitect()">START_SIMULATION</button>
    `;
    }

    toast(m) {
        const el = document.getElementById('msg');
        if (el) { el.innerText = `>> ${m}`; setTimeout(() => el.innerText = "", 3000); }
    }
}


const sim = new BioEngine();