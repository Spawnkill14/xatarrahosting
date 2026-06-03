// auth.js - Módulo de autenticación para XatarraHosting
// Maneja el login/logout con GitHub y la gestión de sesiones

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user');

    // Si hay un usuario en la URL, guardarlo en localStorage
    if (user) {
        localStorage.setItem('github_user', user);
        // HEM TRETT EL REPLACESTATE D'AQUÍ PERQUÈ NO ENS BORRI EL ?SETUP=...
    }
    // Actualizar la interfaz de usuario según el estado de sesión
    actualitzarUI();
});

// Función para contratar un plan
function contractarPla(nomPla) {
    // Obtener el usuario del localStorage
    const user = localStorage.getItem('github_user');
    if (user) {
        // Redirigir al dashboard con el usuario y el plan seleccionado
        window.location.href = `dashboard.html?user=${user}&setup=${nomPla.toLowerCase()}`;
    } else {
        // Si no hay usuario, mostrar alerta y redirigir al inicio
        alert("Primer has d'iniciar sessió!");
        window.location.href = "index.html";
    }
}

// Función para actualizar la interfaz de usuario según el estado de sesión
function actualitzarUI() {
    // Obtener el usuario del localStorage
    const user = localStorage.getItem('github_user');
    // Elementos del DOM
    const btnLogin = document.getElementById('btn-login');
    const sessionPanel = document.getElementById('session-panel');
    const displayUser = document.getElementById('display-user');

    // Si hay usuario logueado
    if (user) {
        // Ocultar botón de login
        if (btnLogin) btnLogin.style.display = 'none';
        // Mostrar panel de sesión
        if (sessionPanel) {
            sessionPanel.style.display = 'inline-block';
            // Mostrar nombre de usuario
            if (displayUser) displayUser.innerText = user;
        }
    } else {
        // Si no hay usuario, mostrar botón de login y ocultar panel
        if (btnLogin) btnLogin.style.display = 'inline-block';
        if (sessionPanel) sessionPanel.style.display = 'none';
    }
}

// Función para cerrar sesión
function logout() {
    // Eliminar usuario del localStorage
    localStorage.removeItem('github_user');
    // Si tenies algun altre item com 'session_start', també el traiem aquí
    // localStorage.clear(); // Opcional: esborra-ho tot per seguretat
    // Redirigir al inicio
    window.location.href = "index.html"; // Millor que reload, et torna a l'inici
}

// Función para ir al dashboard
function anarAlDashboard() {
    // Obtener usuario del localStorage
    const user = localStorage.getItem('github_user');
    if (user) {
        // Redirigir al dashboard con el usuario
        window.location.href = `dashboard.html?user=${user}`;
    } else {
        // Si no hay usuario, mostrar alerta
        alert("Per contractar un pla, primer has d'iniciar sessió amb GitHub.");
    }
}
// Vericiar que el usuario tiene acceso a la ruta actual (dashboard o manage)
async function verificarProteccioRuta() {
    const user = localStorage.getItem('github_user');
    const params = new URLSearchParams(window.location.search);
    const server = params.get('server');
    const path = window.location.pathname;

    // 1. DEFINIM QUINES RUTES SÓN PROTEGIDES
    // Només redirigirem si l'usuari intenta entrar a aquestes pàgines sense login
    const rutesProtegides = ["dashboard.html", "manage.html", "configuracio.html"];
    
    // Comprovem si la pàgina actual és una de les protegides
    const esRutaProtegida = rutesProtegides.some(ruta => path.includes(ruta));

    // 2. LÒGICA DE REDIRECCIÓ
    if (esRutaProtegida && !user) {
        console.warn("⚠️ Accés denegat: Aquesta ruta requereix login.");
        // Si estem en una subcarpeta (com /v2/manage.html), fem servir el path correcte al login
        window.location.href = path.includes("/v2/") ? "../login.html" : "login.html";
        return;
    }

    // 3. VERIFICACIÓ DE PROPIETAT (Només si estem a manage.html i hi ha usuari)
    if (path.includes("manage.html") && server && user) {
        try {
            const response = await fetch(`https://api.xatarrahosting.cat/api/verify-owner?user=${user}&subdomain=${server}`);
            const data = await response.json();

            if (!data.isOwner) {
                alert("❌ No tens permís per gestionar aquest servidor.");
                window.location.href = "dashboard.html";
            }
        } catch (err) {
            console.error("Error verificant la propietat:", err);
        }
    }
}

// Executem la verificació immediatament quan es carrega el fitxer
verificarProteccioRuta();
