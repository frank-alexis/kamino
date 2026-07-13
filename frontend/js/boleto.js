async function cargarBoleto() {
    // 1. Obtenemos el ID guardado en el pago
    const idBoleto = localStorage.getItem('ultimo_id_boleto');
    
    if (!idBoleto) {
        console.error("No se encontró un ID de boleto en el almacenamiento.");
        return;
    }

    try {
        // 2. Hacemos la consulta al servidor
        const response = await fetch(`/api/boletos/${idBoleto}`);
        
        if (!response.ok) throw new Error("No se pudo obtener el boleto del servidor");

        // 3. AQUÍ DEFINIMOS 'boleto'
        const boleto = await response.json(); 

        // 4. Formateamos la fecha antes de mostrarla
        const fechaRaw = new Date(boleto.fecha_salida);
        const fechaFormateada = fechaRaw.toLocaleDateString('es-PE', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });

        // 5. Inyectamos los datos en el HTML
        document.getElementById('detalle-boleto').innerHTML = `
            <p><strong>Pasajero:</strong> <span>${boleto.nombres} ${boleto.apellido_paterno} ${boleto.apellido_materno}</span></p>
            <p><strong>Ruta:</strong> <span>${boleto.origen} - ${boleto.destino}</span></p>
            <p><strong>Fecha:</strong> <span>${fechaFormateada}</span></p>
            <p><strong>Hora:</strong> <span>${boleto.hora_salida.substring(0, 5)}</span></p>
            <p><strong>Asiento:</strong> <span>${boleto.numero_asiento}</span></p>
            <p><strong>Total Pagado:</strong> <span>S/. ${boleto.monto_pagado}</span></p>
        `;

        const qrContainer = document.getElementById("qrcode");
        if (qrContainer) {
            qrContainer.innerHTML = ""; // Limpiar antes de generar uno nuevo
            new QRCode(qrContainer, {
                text: boleto.codigo_boleto,
                width: 128,
                height: 128
            });
        }
        
    } catch (error) {
        console.error("Error al cargar el boleto:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarBoleto);