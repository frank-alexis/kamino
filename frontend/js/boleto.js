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

        const boleto = await response.json(); 

   
        const fechaRaw = boleto.fecha_salida ? boleto.fecha_salida.split('T')[0] : 'Fecha no disponible';

        // 4. Inyectamos los datos en el HTML
        const detalleContainer = document.getElementById('detalle-boleto');
        if (detalleContainer) {
            detalleContainer.innerHTML = `
                <p><strong>Pasajero:</strong> <span>${boleto.nombres} ${boleto.apellido_paterno} ${boleto.apellido_materno}</span></p>
                <p><strong>Ruta:</strong> <span>${boleto.origen} - ${boleto.destino}</span></p>
                <p><strong>Fecha:</strong> <span>${fechaRaw}</span></p>
                <p><strong>Hora:</strong> <span>${boleto.hora_salida.substring(0, 5)}</span></p>
                <p><strong>Asiento:</strong> <span>${boleto.numero_asiento}</span></p>
                <p><strong>Total Pagado:</strong> <span>S/. ${parseFloat(boleto.monto_pagado).toFixed(2)}</span></p>
            `;
        }

        const qrContainer = document.getElementById("qrcode");
        if (qrContainer) {
            qrContainer.innerHTML = ""; 
            new QRCode(qrContainer, {
                text: boleto.codigo_boleto,
                width: 128,
                height: 128
            });
        }
        
    } catch (error) {
        console.error("Error al cargar el boleto:", error);
        const detalleContainer = document.getElementById('detalle-boleto');
        if (detalleContainer) {
            detalleContainer.innerHTML = "<p>Error al cargar los detalles del boleto.</p>";
        }
    }
}

document.addEventListener("DOMContentLoaded", cargarBoleto);