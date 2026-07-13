document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');

    // Intercambio visual entre Login y Registro
    if(showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    if(showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }

    // MANEJO DEL LOGIN

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const correo = loginForm.querySelector('input[type="email"]').value;
            const contrasena = loginForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, contrasena })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.error);
                    return;
                }

                // Guardamos los datos de sesión sincronizados
                localStorage.setItem('user_id', data.usuario.id_usuario);
                localStorage.setItem('user_name', data.usuario.nombres);
                localStorage.setItem('user_rol', data.usuario.rol);
                
                // Formato agrupado para que asientos.js lo lea perfectamente
                localStorage.setItem('usuario_logueado', JSON.stringify(data.usuario));

                // EVALUACIÓN DE REDIRECCIÓN INTELIGENTE
                if (data.usuario.rol === 'admin') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    // Si venía de seleccionar asientos, regresa a terminar el pago
                    const idHorarioTemp = localStorage.getItem('compra_id_horario');
                    if (idHorarioTemp && idHorarioTemp !== "null") {
                        window.location.href = `asientos.html?id_horario=${idHorarioTemp}`;
                    } else {
                        window.location.href = 'index.html';
                    }
                }

            } catch (error) {
                console.error("Error al conectar:", error);
                alert("No se pudo conectar con el servidor.");
            }
        });
    }

    // MANEJO DEL REGISTRO 

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);
            const datosUsuario = Object.fromEntries(formData.entries());

            try {
                
                const response = await fetch('http://localhost:3000/api/auth/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosUsuario)
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.error || "Error en el registro.");
                    return;
                }

                alert("¡Cuenta creada de manera exitosa! Iniciando sesión automáticamente...");

                localStorage.setItem('user_id', data.usuario.id_usuario);
                localStorage.setItem('user_name', data.usuario.nombres);
                localStorage.setItem('user_rol', data.usuario.rol);
                localStorage.setItem('usuario_logueado', JSON.stringify(data.usuario));

                // ¿Tenía una compra iniciada? Lo devolvemos al bus de inmediato
                const idHorarioTemp = localStorage.getItem('compra_id_horario');
                if (idHorarioTemp && idHorarioTemp !== "null") {
                    window.location.href = `asientos.html?id_horario=${idHorarioTemp}`;
                } else {
                    window.location.href = 'index.html';
                }

            } catch (error) {
                console.error("Error al registrar:", error);
                alert("Error al conectar con el servidor.");
            }
        });
    }
});