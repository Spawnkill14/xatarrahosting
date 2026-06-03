// manage.js - Versió Unificada amb Sockets
const urlParams = new URLSearchParams(window.location.search);
const currentServer = urlParams.get('server'); 
const isInstalling = urlParams.get('installing') === 'true'; 

if (!currentServer) {
    alert("No s'ha especificat cap servidor.");
    window.location.href = "../dashboard.html";
} else {
    document.getElementById('server-title').innerText = currentServer;
}

const terminal = document.getElementById('terminal');

// --- INICIAR LA CONSOLA IMMEDIATAMENT ---
// Tant si instal·la com si no, ens connectem al "tub" de dades (Socket)
iniciarConsolaReal();

function iniciarConsolaReal() {
    // Si ja hi ha una connexió oberta, la tanquem
    if (window.socketActiu) window.socketActiu.disconnect();

    const socket = io("https://api.xatarrahosting.cat");
    window.socketActiu = socket;

    socket.emit('join-console', currentServer);

    // --- EL TRUC: Forçar un missatge de consola ---
    setTimeout(() => {
        if (window.socketActiu) {
            window.socketActiu.emit('send-command', { 
                subdomain: currentServer, 
                command: 'list' 
            });
        }
    }, 1500);

    // --- MISSATGE DE CÀRREGA ---
    const loaderId = 'loading-indicator';
    const oldLoader = document.getElementById(loaderId);
    if (oldLoader) oldLoader.remove(); 

    const divLoading = document.createElement('div');
    divLoading.id = loaderId;
    divLoading.innerHTML = "<i>⏳ Iniciant connexió i esperant els logs del servidor...</i>";
    divLoading.style.color = "#f39c12"; 
    divLoading.style.paddingBottom = "10px";
    terminal.appendChild(divLoading);
    
    let esperantPrimerLog = true;

    if (isInstalling) {
        writeLog("[SISTEMA] Connectat al flux d'instal·lació en viu...", "#f1c40f");
    }

    socket.on('console-output', (data) => {
        // ESBORREM EL TEXT DE CÀRREGA AL REBRE EL PRIMER LOG
        if (esperantPrimerLog) {
            const loader = document.getElementById(loaderId);
            if (loader) loader.remove();
            esperantPrimerLog = false;
        }

        const net = data.replace(/\x1B\[[0-9;]*[mK]/g, ""); 
        
        const div = document.createElement('div');
        div.textContent = net;
        
        if (net.toLowerCase().includes("error") || net.toLowerCase().includes("⚠️")) {
            div.style.color = "#ff4d4d";
        }

        terminal.appendChild(div);
        terminal.scrollTop = terminal.scrollHeight;

        if (net.includes("INSTAL·LACIÓ FINALITZADA")) {
            writeLog("\n--- EL SERVIDOR S'ESTÀ ENGEGANT... ---", "#00d2ff");
        }
    });

    socket.on('disconnect', () => {
        writeLog("[SISTEMA] Connexió amb el servidor perduda.", "#ff4d4d");
    });
}

// --- ENVIAR COMANDES ---
// Funció per enviar la comanda
function sendCommand() {
    const inputElement = document.getElementById('console-input');
    if (!inputElement) return;

    const command = inputElement.value.trim();

    if (command !== "" && window.socketActiu) {
        // --- LA CLAVE ESTÁ AQUÍ ---
        // Esto hace que lo que acabas de escribir aparezca en el recuadro verde
        if (typeof writeLog === "function") {
            writeLog("> " + command, "#abb2bf"); // El color gris clarito queda muy pro
        }

        // Enviamos al backend para que Proxmox lo ejecute
        window.socketActiu.emit('send-command', { 
            subdomain: currentServer, 
            command: command 
        });

        inputElement.value = ""; 
    }
}

// ACTIVAR TECLA ENTER:
// Busquem l'input i li diem que si premem "Enter" (tecla 13), cridi a sendCommand
document.getElementById('console-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendCommand();
    }
});

// --- CONTROL D'ENERGIA (START/STOP) ---
async function controlServer(action) {
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnAturar = document.getElementById('btn-aturar');

    // Bloquegem botons temporalment
    [btnIniciar, btnReiniciar, btnAturar].forEach(btn => { if(btn) btn.disabled = true; });
    
    writeLog(`[Sistema] Executant ${action}...`, "#f1c40f");

    try {
        const response = await fetch(`https://api.xatarrahosting.cat/api/power/${currentServer}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: action })
        });

        const data = await response.json();
        writeLog(`[Proxmox] ${data.message}`, data.success ? "#36ce75" : "#ff4d4d");

        // --- NOU: AUTORECONNEXIÓ SENSE F5 ---
        if (data.success && (action === 'start' || action === 'restart')) {
            setTimeout(() => {
                writeLog("[SISTEMA] Reconnectant a la consola en viu...", "#f39c12");
                iniciarConsolaReal(); 
            }, 2000);
        }

    } catch (err) {
        writeLog(`[Error] No s'ha pogut connectar amb l'API.`, "#ff4d4d");
    } finally {
        setTimeout(() => {
            [btnIniciar, btnReiniciar, btnAturar].forEach(btn => { if(btn) btn.disabled = false; });
        }, 3000);
    }
}

function writeLog(text, color = "#fff") {
    const div = document.createElement('div');
    div.style.color = color;
    div.innerText = text;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}

async function openFileManager() {
    const user = localStorage.getItem('github_user');
    
    // Si el fitxer està a /opt/xatarra-api/files.php, la URL és /files.php
    // Fem servir URLSearchParams per seguretat amb els caràcters especials
    const params = new URLSearchParams({
        server: currentServer,
        user: user
    });

    try {
        const response = await fetch(`https://api.xatarrahosting.cat/php/files.php?server=${currentServer}&user=${user}`);
        const data = await response.json();

        if (data.success) {
            console.log("Llista de fitxers:", data.files);
            // Aquí cridaríem a una funció per dibuixar la llista a la pantalla
            renderizarFitxers(data.files);
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) {
        console.error("Error en la petició PHP:", err);
    }
}