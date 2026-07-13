document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idHorario = urlParams.get('id_horario');

    if (!idHorario) {
        alert("Acceso inválido. Redirigiendo a la página de inicio.");
        window.location.href = 'index.html';
        return;
    }

    const infoViaje = document.getElementById('info-viaje');
    const asientosContenedor = document.getElementById('asientos-contenedor');
    const asientosTexto = document.getElementById('asientos-texto');
    const totalTexto = document.getElementById('total-texto');
    const btnProcesar = document.getElementById('btn-procesar');

    let precioPasaje = 0;
    let asientosSeleccionados = [];

    try {
        //Traer los detalles del viaje y los asientos ocupados desde el Backend
        const [resDetalles, resOcupados] = await Promise.all([
            fetch(`/api/horarios/${idHorario}/detalles`),
            fetch(`/api/horarios/${idHorario}/asientos-ocupados`)
        ]);

        const detalles = await resDetalles.json();
        const asientosOcupados = await resOcupados.json(); 

        precioPasaje = parseFloat(detalles.precio);
        infoViaje.innerHTML = `<strong>Ruta:</strong> ${detalles.origen} ➔ ${detalles.destino} | <strong>Precio por Asiento:</strong> S/. ${precioPasaje.toFixed(2)}`;

        // Generar la cuadrícula de asientos
        asientosContenedor.innerHTML = '';
        for (let i = 1; i <= detalles.capacidad; i++) {
            const botonAsiento = document.createElement('button');
            botonAsiento.innerText = i;
            botonAsiento.className = 'asiento-btn';

            // Si el número de asiento está en el array de ocupados, lo bloqueamos en rojo
            if (asientosOcupados.includes(i)) {
                botonAsiento.classList.add('ocupado-btn');
                botonAsiento.disabled = true;
            } else {
                // Si está libre, lo ponemos en verde y escuchamos el clic
                botonAsiento.classList.add('disponible-btn');
                botonAsiento.addEventListener('click', () => toggleAsiento(i, botonAsiento));
            }

            asientosContenedor.appendChild(botonAsiento);
        }

    } catch (error) {
        console.error("Error al cargar el mapa de asientos:", error);
        infoViaje.innerText = "Error al conectar con el servidor.";
    }

    // Función para seleccionar / deseleccionar asientos
    function toggleAsiento(numero, boton) {
        if (asientosSeleccionados.includes(numero)) {
            // Si ya estaba seleccionado, lo quitamos
            asientosSeleccionados = asientosSeleccionados.filter(n => n !== numero);
            boton.classList.remove('seleccionado-btn');
            boton.classList.add('disponible-btn');
        } else {
            // Si no estaba, lo agregamos
            asientosSeleccionados.push(numero);
            boton.classList.remove('disponible-btn');
            boton.classList.add('seleccionado-btn');
        }

        // Actualizar el bloque de resumen inferior
        if (asientosSeleccionados.length > 0) {
            asientosTexto.innerText = asientosSeleccionados.sort((a,b)=>a-b).join(', ');
            btnProcesar.disabled = false;
        } else {
            asientosTexto.innerText = "Ninguno";
            btnProcesar.disabled = true;
        }

        const total = asientosSeleccionados.length * precioPasaje;
        totalTexto.innerText = `S/. ${total.toFixed(2)}`;
    }

    btnProcesar.addEventListener('click',async () => {
        // Guardamos temporalmente el horario y los asientos elegidos en la caché del navegador
        localStorage.setItem('compra_id_horario', idHorario);
        localStorage.setItem('compra_asientos', JSON.stringify(asientosSeleccionados));

        const infoParaPago = {
            id_horario: idHorario,
            precio: precioPasaje // Usas la variable que ya tienes calculada arriba
        };

        localStorage.setItem('compra_info', JSON.stringify(infoParaPago));
        localStorage.setItem('compra_asientos', JSON.stringify(asientosSeleccionados));

        if (asientosSeleccionados.length === 0) {
            alert("Por favor selecciona al menos un asiento.");
            return;
        }
        // Validamos si hay una sesión activa de cliente
        const usuario = localStorage.getItem('usuario_logueado');

        if (!usuario) {
            alert("Inicia sesión para continuar.");
            window.location.href = 'login.html';
        } else {
            // 1. Llamamos al API de bloqueo antes de navegar
            try {
                const response = await fetch('/api/bloquear-asientos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_horario: idHorario,
                        id_asientos: asientosSeleccionados,
                        id_usuario: JSON.parse(usuario).id_usuario
                    })
                });

                if (response.ok) {
                    // 2. Si el bloqueo fue exitoso, vamos al pago
                    window.location.href = 'pago.html';
                } else {
                    alert("Los asientos ya no están disponibles. Por favor, selecciona otros.");
                    location.reload(); // Recargamos para ver el estado real
                }
            } catch (err) {
                alert("Error de conexión al reservar los asientos.");
            }
        }
    });
});