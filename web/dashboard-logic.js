// dashboard-logic.js - Lògica del dashboard per a gestió de servidors Minecraft

// 1. CONFIGURACIÓ DE VERSIONS (CANVIAT: Ara és un objecte per software)
const softwareVersions = {
    "vanilla": ["1.20.4", "1.20.1", "1.19.5", "1.18.2", "1.16.5", "1.12.2", "1.8.8", "1.7.10"],
    "paper": ["1.20.4", "1.20.1", "1.19.5", "1.19.4", "1.18.2", "1.16.5"],
    "forge":["1.20.4", "1.20.1", "1.19.5", "1.16.5", "1.12.2"]
};

// VALIDACIÓ SUBDOMINI (Tal qual la tenies)
async function validarSubdomini(input) {
    const valor = input.value.trim();
    const errorDiv = document.getElementById('subdomain-error');
    const statusSpan = document.getElementById('subdomain-status');
    const regex = /^[a-zA-Z0-9-]*$/; 
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (statusSpan) statusSpan.style.display = 'none';
    
    if (valor.length === 0) return;
    
    if (valor.length > 30) {
        if (errorDiv) {
            errorDiv.textContent = "❌ Massa llarg! (màx 30 caràcters)";
            errorDiv.style.display = 'block';
        }
        input.style.borderColor = '#e74c3c';
        return;
    }
    
    if (!regex.test(valor)) {
        if (errorDiv) {
            errorDiv.textContent = "❌ Només lletres, números i guionets permesos";
            errorDiv.style.display = 'block';
        }
        input.style.borderColor = '#e74c3c';
        return;
    }
    
    if (valor.startsWith('-') || valor.endsWith('-')) {
        if (errorDiv) {
            errorDiv.textContent = "❌ No pot començar ni acabar per guionet";
            errorDiv.style.display = 'block';
        }
        input.style.borderColor = '#e74c3c';
        return;
    }
    
    try {
        const resposta = await fetch(`https://api.xatarrahosting.cat/api/check-subdomain/${valor}`);
        const data = await resposta.json();
        
        if (data.exists) {
            if (errorDiv) {
                errorDiv.textContent = "❌ Aquest subdomini ja està en ús";
                errorDiv.style.display = 'block';
            }
            input.style.borderColor = '#e74c3c';
        } else {
            if (statusSpan) statusSpan.style.display = 'inline';
            input.style.borderColor = '#36ce75';
        }
    } catch (err) {
        console.error("Error verificant subdomini:", err);
        input.style.borderColor = '#444';
    }
}

// ACTUALITZAR VERSIONS (Millorat per ser dinàmic)
function actualitzarVersions() {
    const swSelector = document.getElementById('mc-software');
    const verSelector = document.getElementById('mc-version');
    if (!verSelector || !swSelector) return;

    const softwareTriat = swSelector.value.toLowerCase();
    const llista = softwareVersions[softwareTriat] || softwareVersions["paper"];

    verSelector.innerHTML = "";
    llista.forEach(v => {
        let opt = document.createElement('option');
        opt.value = v; opt.innerHTML = v;
        verSelector.appendChild(opt);
    });
}

// 2. LLISTAR SERVIDORS (Tal qual el tenies)
async function carregarServidorsDelUsuari() {
    const usuari = localStorage.getItem('github_user');
    if (!usuari) return;

    try {
        const resposta = await fetch(`https://api.xatarrahosting.cat/api/my-servers/${usuari}`);
        const servidors = await resposta.json();
        const llistaDiv = document.getElementById('llista-servers');
        const btnCrear = document.getElementById('btn-crear-servidor');
        const serverCount = document.getElementById('servidor-count');
        
        if (!llistaDiv) return;
        if (serverCount) serverCount.textContent = servidors.length;

        if (btnCrear) {
            if (servidors.length >= 1) {
                btnCrear.disabled = true;
                btnCrear.style.opacity = '0.5';
                btnCrear.style.cursor = 'not-allowed';
                btnCrear.innerHTML = '❌ LÍMIT ASSOLIT (1 servidor)';
                btnCrear.style.background = '#666';
            } else {
                btnCrear.disabled = false;
                btnCrear.style.opacity = '1';
                btnCrear.style.cursor = 'pointer';
                btnCrear.innerHTML = 'CREAR SERVIDOR';
                btnCrear.style.background = 'linear-gradient(45deg, #7d5fff, #b33771)';
            }
        }

        if (servidors.length > 0) {
            llistaDiv.innerHTML = "";
            servidors.forEach(srv => {
                llistaDiv.innerHTML += `
                    <div class="server-card" style="border: 1px solid #444; padding: 15px; margin-bottom: 10px; border-radius: 10px; background: #111;">
                        <h3 style="color: #a855f7; margin: 0;">🎮 ${srv.subdomain}.xatarrahosting.cat</h3>
                        <p style="font-size: 0.9em; color: #ccc;"><strong>Node:</strong> ${srv.node_ip} | <strong>RAM:</strong> ${srv.ram}MB | <strong>Plan:</strong> Gratuït</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 10px;">
                            <span style="color: #36ce75; font-weight: bold; font-size: 0.9rem; display: flex; align-items: center; gap: 5px;">
                                <span style="font-size: 1.2rem;">●</span> Actiu
                            </span>
                            <div style="display: flex; gap: 8px;">
                                <button onclick="window.location.href='/minecraft/manage.html?server=${srv.subdomain}'" 
                                        class="manage-btn" 
                                        style="background: #00d2ff; color: #090b10; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 800; font-size: 0.85rem;">
                                    Gestionar
                                </button>
                                <button onclick="confirmarBorrat('${srv.subdomain}')" 
                                        style="background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.3); padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>`;
            });
        } else {
            llistaDiv.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; background: rgba(125,95,255,0.05); border-radius: 12px; border: 2px dashed #7d5fff;">
                    <p style="font-size: 1.2rem; margin: 0 0 10px 0;">🎮 Comença la teva aventura</p>
                    <p style="color: #aaa; margin: 0;">Encara no tens cap servidor. Crea el teu primer servidor Minecraft gratuit!</p>
                    <button onclick="document.getElementById('setup-minecraft').style.display='block'" 
                            style="margin-top: 15px; background: linear-gradient(45deg, #7d5fff, #b33771); color: white; border: none; padding: 10px 30px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        ➕ CREAR SERVIDOR
                    </button>
                </div>`;
            const fab = document.getElementById('fab-crear');
            if (fab) fab.style.display = 'block';
        }
    } catch (error) { 
        console.error("Error carregant servidors:", error);
    }
}

// 3. INICI (Tal qual el tenies)
document.addEventListener("DOMContentLoaded", () => {
    actualitzarVersions();
    carregarServidorsDelUsuari();
    const params = new URLSearchParams(window.location.search);
    if (params.get('setup') === 'minecraft') {
        const overlay = document.getElementById('setup-minecraft');
        if (overlay) overlay.style.display = 'block';
    }
    
    // Escoltem quan l'usuari canvia el software per actualitzar versions
    const swSelector = document.getElementById('mc-software');
    if(swSelector) {
        swSelector.addEventListener('change', actualitzarVersions);
    }
});

// 4. CREACIÓ (Tal qual el tenies)
async function enviarCreacio(event) {
    if (event) event.preventDefault();
    const subdominiInput = document.getElementById('mc-subdomain');
    const btn = document.getElementById('btn-crear-servidor');
    const subdomini = subdominiInput ? subdominiInput.value.trim() : "";

    if (!subdomini) { alert("❌ Introdueix un subdomini"); return; }
    
    if (btn) {
        btn.disabled = true;
        btn.innerText = "⏳ Creant LXC al Proxmox...";
    }

    const dades = {
        username: localStorage.getItem('github_user'),
        type: 'minecraft',
        subdomain: subdomini,
        version: document.getElementById('mc-version')?.value || "1.20.1",
        software: document.getElementById('mc-software')?.value || "paper"
    };

    try {
       const res = await fetch('https://api.xatarrahosting.cat/api/create-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dades)
    });

       const data = await res.json();
        if (data.success) {
            alert("✅ SERVIDOR CREAT CORRECTAMENT!");
            window.location.href = `/minecraft/manage.html?server=${subdomini}&installing=true`;
        } else { 
            alert("❌ Error: " + data.message);
            if (btn) { btn.disabled = false; btn.innerText = "CREAR SERVIDOR"; }
        }
    } catch (err) { 
        alert("❌ Error de connexió amb el Master (.150)"); 
        if (btn) { btn.disabled = false; btn.innerText = "CREAR SERVIDOR"; }
    }
}

// 5. BORRAT (Tal qual el tenies)
async function confirmarBorrat(subdomain) {
    if (!confirm(`Vols eliminar ${subdomain}?`)) return;
    try {
        const res = await fetch(`https://api.xatarrahosting.cat/api/delete-server/${subdomain}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            alert("✅ Servidor eliminat correctament!");
            location.reload();
        } else {
            alert("❌ Error: " + data.message);
        }
    } catch (err) { 
        alert("❌ Error al borrar el servidor"); 
    }
}

// 6. CONTROL (Tal qual el tenies)
async function controlServer(action) {
    const currentServer = new URLSearchParams(window.location.search).get('server');
    if (!currentServer) return;

    const btnIniciar = document.getElementById('btn-iniciar');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnDetenir = document.getElementById('btn-detenir');

    if (btnIniciar) btnIniciar.disabled = true;
    if (btnReiniciar) btnReiniciar.disabled = true;
    if (btnDetenir) btnDetenir.disabled = true;
    
    if (typeof writeLog === "function") writeLog(`[Sistema] Executant ${action}...`);

    try {
        const response = await fetch(`https://api.xatarrahosting.cat/api/power/${currentServer}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: action })
        });

        const data = await response.json();
        if (data.success) {
            if (typeof writeLog === "function") writeLog(`[Proxmox] ${data.message}`, "#0f0");
        } else {
            if (typeof writeLog === "function") writeLog(`[Error] ${data.message}`, "#f00");
        }
    } catch (err) {
        if (typeof writeLog === "function") writeLog(`[Error] No s'ha pogut connectar amb l'API.`, "#f00");
    } finally {
        setTimeout(() => {
            if (btnIniciar) btnIniciar.disabled = false;
            if (btnReiniciar) btnReiniciar.disabled = false;
            if (btnDetenir) btnDetenir.disabled = false;
            if (typeof writeLog === "function") writeLog("[Sistema] Botons reactivats.");
        }, 5000);
    }
}