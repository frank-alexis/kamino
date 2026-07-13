document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem('usuario_logueado'));
    const container = document.getElementById('auth-container');

    if (usuario) {
        // Usuario logueado: mostramos "Mis Compras" y el menú de usuario
        container.innerHTML = `
            <a href="mis_compras.html">Mis Compras</a>
            <div class="user-menu">
                <span class="user-name">👤 ${usuario.nombres} ▾</span>
                <div class="dropdown-content">
                    <button id="btn-logout">Cerrar Sesión</button>
                </div>
            </div>
        `;

        document.getElementById('btn-logout').addEventListener('click', () => {
            localStorage.removeItem('usuario_logueado');
            window.location.href = 'index.html'; // Redirigir al home después de cerrar sesión
        });
    } else {
        // Usuario NO logueado: mostramos solo el botón de Iniciar Sesión
        container.innerHTML = `
            <a href="login.html" class="btn-login">Iniciar Sesión</a>
        `;
    }
});