// stats.js - Módulo para estadísticas en tiempo real y gráficos
// Maneja la visualización de CPU, RAM, disco, logs y gráficos en tiempo real

// 1. VARIABLES GLOBALS
// Variables globales para el gráfico y logs
let cpuChart; 
let lastLog = "";

// 2. INICIALITZACIÓ DEL GRÀFIC
// Inicialización del gráfico de CPU y disco al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('cpuChart').getContext('2d');
    
    window.cpuChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Ús de CPU (%)',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Ús de Disc (%)',
                    data: [],
                    borderColor: '#e67e22', // Taronja Tron
                    backgroundColor: 'rgba(230, 126, 34, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: {
                    type: 'linear',
                    min: 0,
                    max: 100,
                    suggestedMin: 0,
                    suggestedMax: 100,
                    beginAtZero: true,
                    ticks: { stepSize: 20 }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // Iniciem el bucle de dades
    setInterval(refreshStats, 2000);
});

// 3. FUNCIÓ PER AFEGIR LOGS
// Función para agregar entradas de log al contenedor
function addLog(message) {
    const logContainer = document.querySelector('.log-container') || document.getElementById('log-section');
    if (logContainer) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.prepend(logEntry);

        if (logContainer.childNodes.length > 10) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }
}

// 4. FUNCIÓ PRINCIPAL ACTUALITZADA
// Función principal para refrescar las estadísticas en tiempo real
async function refreshStats() {
    try {
        const res = await fetch('https://api.xatarrahosting.cat/api/stats-realtime');
        const data = await res.json();

        // Actualitzem els textos de les cards
        document.getElementById('cpu-val').innerText = data.cpu_percent + '%';
        document.getElementById('ram-val').innerText = `${data.mem_used} / ${data.mem_total} MB`;
        document.getElementById('lxc-val').innerText = data.lxcs_running;
        
        // Actualitzem el valor del Disc que sortia buit
        // Actualitzem el valor del Disc amb seguretat
	const diskElem = document.getElementById('disk-usage');
	if (diskElem) {
    	// Si la dada no existeix (undefined), posem un 0 per defecte
    	const discValor = data.disk_usage_percent || 0;
    	diskElem.innerText = discValor + '%';
	}
	
	// Al gràfic, fem el mateix
	if (window.cpuChart) {
    	const discValor = data.disk_usage_percent || 0;
   
    
   	window.cpuChart.data.datasets[1].data.push(discValor); 
    
	}

        // Estat ONLINE
        const statusTag = document.getElementById('status');
        if (statusTag) {
            statusTag.innerText = "ONLINE";
            statusTag.className = "status-tag online";
        }

        // Actualitzem el Gràfic amb CPU i DISC
        if (window.cpuChart) {
            const ara = new Date().toLocaleTimeString([], { hour12: false });
            
            window.cpuChart.data.labels.push(ara);
            window.cpuChart.data.datasets[0].data.push(data.cpu_percent); // CPU
            window.cpuChart.data.datasets[1].data.push(data.disk_usage_percent); // DISC

            // Manté el gràfic amb 15 punts de dades
            if (window.cpuChart.data.labels.length > 15) {
                window.cpuChart.data.labels.shift();
                window.cpuChart.data.datasets[0].data.shift();
                window.cpuChart.data.datasets[1].data.shift();
            }
            window.cpuChart.update('none');
        }

        // Filtre de logs
        if (data.log_event && data.log_event !== lastLog) {
            if (!data.log_event.includes("python3")) {
                addLog(data.log_event);
                lastLog = data.log_event;
            }
        }

    } catch (error) {
        console.error("Error en refreshStats:", error);
        const statusTag = document.getElementById('status');
        if (statusTag) {
            statusTag.innerText = "OFFLINE";
            statusTag.className = "status-tag offline";
        }
    }
}
