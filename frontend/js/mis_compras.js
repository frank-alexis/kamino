async function cargarMisCompras() {
    const contenedor = document.getElementById('lista-compras');
    
    // Verifica si el contenedor realmente existe antes de continuar
    if (!contenedor) {
        console.error("El elemento 'lista-compras' no fue encontrado en el HTML.");
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario_logueado'));
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/mis-boletos/${usuario.id_usuario}`);
        const boletos = await res.json();

        if (boletos.length === 0) {
            contenedor.innerHTML = "<p>No tienes compras realizadas.</p>";
            return;
        }

        contenedor.innerHTML = boletos.map(b => `
            <div class="card-boleto">
                <div class="info">
                    <h3>${b.origen} → ${b.destino}</h3>
                    <p>Fecha: ${new Date(b.fecha_salida).toLocaleDateString()} | ${b.hora_salida.substring(0,5)}</p>
                    <p>Asiento: ${b.numero_asiento} | Código: <strong>${b.codigo_boleto}</strong></p>
                </div>
                <button onclick="verBoleto(${b.id_boleto})">Ver Detalles</button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = "<p>Error al cargar tus compras.</p>";
    }
}

document.addEventListener("DOMContentLoaded", cargarMisCompras);