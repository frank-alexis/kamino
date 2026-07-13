document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem('usuario_logueado'));
    const datosCompra = JSON.parse(localStorage.getItem('compra_info')); 
    const asientos = JSON.parse(localStorage.getItem('compra_asientos')); 

    // Validación de seguridad
    if (!usuario || !asientos || !datosCompra) {
        alert("Sesión expirada o datos de compra incompletos.");
        window.location.href = 'index.html';
        return;
    }

    // Mostrar info en pantalla
    document.getElementById('txt-usuario').innerText = `${usuario.nombres} (${usuario.correo})`;
    document.getElementById('txt-asientos').innerText = asientos.join(', ');

    document.getElementById('form-pago').addEventListener('submit', async (e) => {
        e.preventDefault();
        const metodo = document.getElementById('metodo_pago').value;

        try {
            let ultimoIdBoleto = null;

            // Procesar cada asiento individualmente
            for (const id_asiento of asientos) {
                const response = await fetch('http://localhost:3000/api/boletos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_usuario: usuario.id_usuario,
                        id_horario: datosCompra.id_horario,
                        id_asiento: id_asiento,
                        monto_pagado: datosCompra.precio,
                        metodo_pago: metodo
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al registrar un asiento");
                }

                // Capturamos el ID que devuelve el servidor
                const data = await response.json();
                ultimoIdBoleto = data.id_boleto;
            }

            // Guardamos solo el ID para que boleto.html lo consulte después
            localStorage.setItem('ultimo_id_boleto', ultimoIdBoleto);

            // Limpieza
            alert("¡Pago exitoso! Gracias por confiar en Kamino.");
            localStorage.removeItem('compra_asientos');
            localStorage.removeItem('compra_info');

            // Liberar bloqueos de asientos
            await fetch('http://localhost:3000/api/bloquear-asientos/liberar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ id_usuario: usuario.id_usuario })
            });

            // Redirigir al boleto
            window.location.href = 'boleto.html';

        } catch (error) {
            console.error("Error capturado:", error);
            alert(error.message);
            
            if (error.message.includes("ocupado")) {
                window.location.href = 'index.html';
            }
        }
    });
});