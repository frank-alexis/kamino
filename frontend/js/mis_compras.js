document.addEventListener("DOMContentLoaded", () => {
    cargarMisCompras();

    // Delegación de eventos para los botones generados dinámicamente
    const contenedor = document.getElementById('lista-compras');
    if (contenedor) {
        contenedor.addEventListener('click', (e) => {
            // Si el botón o un icono dentro del botón fue clickeado
            const btn = e.target.closest('.btn-ver-detalle');
            if (btn) {
                const idBoleto = btn.getAttribute('data-id');
                verBoleto(idBoleto);
            }
        });
    }
});

async function cargarMisCompras() {
    const contenedor = document.getElementById('lista-compras');
    
    if (!contenedor) return;

    const usuarioData = localStorage.getItem('usuario_logueado');
    if (!usuarioData) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioData);

    try {
        // Petición a tu API (usando ruta relativa como acordamos)
        const res = await fetch(`/api/mis-boletos/${usuario.id_usuario}`);
        
        if (!res.ok) throw new Error("Error al obtener los boletos");

        const boletos = await res.json();

        if (!boletos || boletos.length === 0) {
            contenedor.innerHTML = "<p>No tienes compras realizadas.</p>";
            return;
        }

        // Generamos el HTML de las tarjetas
        contenedor.innerHTML = boletos.map(b => `
            <div class="card-boleto">
                <div class="info">
                    <h3>${b.origen} → ${b.destino}</h3>
                    <p>Fecha: ${new Date(b.fecha_salida).toLocaleDateString()} | ${b.hora_salida.substring(0,5)}</p>
                    <p>Asiento: ${b.numero_asiento} | Código: <strong>${b.codigo_boleto}</strong></p>
                </div>
                <button class="btn-ver-detalle" data-id="${b.id_boleto}">Ver Detalles</button>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error al cargar:", error);
        contenedor.innerHTML = "<p>Error al cargar tus compras. Por favor intenta más tarde.</p>";
    }
}

// Función que se ejecutará al hacer clic en cualquier botón
function verBoleto(idBoleto) {
    console.log("Abriendo detalles del boleto:", idBoleto);
    // Aquí puedes redirigir o abrir un modal
    // window.location.href = `detalle_boleto.html?id=${idBoleto}`;
    alert("Función para ver el boleto ID: " + idBoleto);
}