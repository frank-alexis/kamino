document.addEventListener("DOMContentLoaded", () => {
    const selectOrigen = document.getElementById('search-origen');
    const selectDestino = document.getElementById('search-destino');
    const searchFecha = document.getElementById('search-fecha');
    const buscadorForm = document.getElementById('buscador-form');
    const contenedorResultados = document.getElementById('contenedor-resultados');
    const resultadosTitulo = document.getElementById('resultados-titulo');

    let todasLasCiudades = [];

    // Cargar ciudades
    async function cargarCiudadesBuscador() {
        try {
            const response = await fetch('/api/rutas');
            const rutas = await response.json();
            const setCiudades = new Set();
            rutas.forEach(r => { setCiudades.add(r.origen); setCiudades.add(r.destino); });
            todasLasCiudades = Array.from(setCiudades);
            
            renderizarSelects();
        } catch (error) { console.error("Error:", error); }
    }

    // Función para que el usuario no selecione dos ciudades iguales
    function renderizarSelects() {
        const selO = selectOrigen.value;
        const selD = selectDestino.value;

        // Limpiar
        selectOrigen.innerHTML = '<option value="" disabled selected>¿Desde dónde viajas?</option>';
        selectDestino.innerHTML = '<option value="" disabled selected>¿A dónde vas?</option>';

        // Dibujar Origen
        todasLasCiudades.forEach(ciudad => {
            if (ciudad !== selD) {
                selectOrigen.innerHTML += `<option value="${ciudad}" ${selO === ciudad ? 'selected' : ''}>${ciudad}</option>`;
            }
        });

        // Dibujar Destino
        todasLasCiudades.forEach(ciudad => {
            if (ciudad !== selO) {
                selectDestino.innerHTML += `<option value="${ciudad}" ${selD === ciudad ? 'selected' : ''}>${ciudad}</option>`;
            }
        });
    }

    // Eventos para redibujar al cambiar
    selectOrigen.addEventListener('change', renderizarSelects);
    selectDestino.addEventListener('change', renderizarSelects);

    // Inicializar
    cargarCiudadesBuscador();


    // Configuramos la fecha mínima en el calendario para que no seleccionen días pasados
    if (searchFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        searchFecha.min = hoy;
    }


    //EVENTO DE BÚSQUEDA

    if (buscadorForm) {
        buscadorForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const origen = selectOrigen.value;
            const destino = selectDestino.value;
            const fecha = searchFecha.value;

            contenedorResultados.innerHTML = `<p style="text-align: center; color: #6b7280;">Buscando viajes disponibles...</p>`;

            try {
                const url = `/api/buscar-viajes?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}&fecha=${fecha}`;
                const response = await fetch(url);
                const viajes = await response.json();

                if (!response.ok) {
                    contenedorResultados.innerHTML = `<p style="text-align: center; color: red;">Error al procesar la búsqueda.</p>`;
                    return;
                }

                resultadosTitulo.innerText = `Resultados para: ${origen} ➔ ${destino}`;

                // Si no hay viajes programados que coincidan
                if (viajes.length === 0) {
                    contenedorResultados.innerHTML = `
                        <div style="text-align: center; padding: 20px; background: #fff; border-radius: 8px;">
                            <p style="color: #6b7280; font-size: 16px;">No se encontraron viajes programados para esta fecha.</p>
                            <p style="color: #1e3a8a; font-size: 14px; margin-top: 5px;">Intenta seleccionando otro día o destino.</p>
                        </div>`;
                    return;
                }

                // Si hay viajes, los dibujamos dinámicamente
                contenedorResultados.innerHTML = '';
                viajes.forEach(viaje => {
                    const card = document.createElement('div');
                    card.className = 'viaje-card';
                    card.innerHTML = `
                        <div class="viaje-info">
                            <h3>${viaje.hora_salida.substring(0, 5)} hrs</h3>
                            <p><strong>Ruta:</strong> ${viaje.origen} a ${viaje.destino}</p>
                            <p><strong>Bus:</strong> Placa ${viaje.placa} (${viaje.modelo || 'Estándar'})</p>
                            <p style="color: #4b5563; font-size: 13px; margin-top: 5px;">📍 Capacidad total: ${viaje.capacidad} asientos</p>
                        </div>
                        <div class="viaje-precio">
                            <span class="precio-tag">S/. ${viaje.precio}</span>
                            <button class="btn-comprar" onclick="seleccionarViaje(${viaje.id_horario})">Seleccionar Asientos</button>
                        </div>
                    `;
                    contenedorResultados.appendChild(card);
                });

            } catch (error) {
                console.error("Error en la petición de búsqueda:", error);
                contenedorResultados.innerHTML = `<p style="text-align: center; color: red;">Error al conectar con el servidor.</p>`;
            }
        });
    }
});


function seleccionarViaje(idHorario) {
    window.location.href = `asientos.html?id_horario=${idHorario}`;
}