
// FUNCIONES GLOBALES (Nivel superior)
function showSection(sectionId) {
    // 1. Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // 2. Mostrar la seleccionada
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
    }

    if (sectionId === 'usuarios') {
        cargarUsuarios();
    }

    // 3. SI LA SECCIÓN ES VENTAS, CARGAMOS LOS DATOS
    if (sectionId === 'ventas') {
        cargarVentas();
    }
}

async function cargarUsuarios() {
    const tbody = document.getElementById('usuarios-table-body');
    if (!tbody) return;
    try {
        const response = await fetch('/api/admin/usuarios');
        const data = await response.json();
        
        tbody.innerHTML = '';
        data.usuarios.forEach(u => {
            const row = `<tr>
                <td style="padding: 12px;">${u.id_usuario}</td>
                <td style="padding: 12px;">${u.nombres} ${u.apellido_paterno}</td>
                <td style="padding: 12px;">${u.correo}</td>
                <td style="padding: 12px;">${u.rol}</td>
                <td style="padding: 12px;"><span class="estado-${u.estado}">${u.estado}</span></td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

// Función de filtro para la tabla de usuarios
function filtrarUsuarios() {
    const filtro = document.getElementById('buscador-usuarios').value.toLowerCase();
    const filas = document.querySelectorAll("#usuarios-table-body tr");
    
    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(filtro) ? "" : "none";
    });
}

//filtrar buses
function filtrarBuses() {
    const input = document.getElementById('buscador-buses');
    const filtro = input.value.toLowerCase(); 
    const tabla = document.getElementById('buses-table-body');
    const filas = tabla.getElementsByTagName('tr');

    // Recorremos cada fila de la tabla
    for (let i = 0; i < filas.length; i++) {
        const textoFila = filas[i].textContent.toLowerCase();
        
        // Si el texto de la fila contiene lo que escribimos, la mostramos
        if (textoFila.includes(filtro)) {
            filas[i].style.display = "";
        } else {
            filas[i].style.display = "none";
        }
    }
}

//filtrar rutas
function filtrarRutas() {
    const input = document.getElementById('buscador-rutas');
    const filtro = input.value.toLowerCase();
    const tabla = document.getElementById('rutas-table-body'); 
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const textoFila = filas[i].textContent.toLowerCase();
        
        if (textoFila.includes(filtro)) {
            filas[i].style.display = "";
        } else {
            filas[i].style.display = "none";
        }
    }
}

//filtrar cronograma
function filtrarViajes() {
    const inputTexto = document.getElementById('buscador-viajes').value.toLowerCase();
    const fechaSeleccionada = document.getElementById('filtro-fecha').value; 
    const tabla = document.getElementById('horarios-table-body');
    const filas = tabla.getElementsByTagName('tr');

    for (let i = 0; i < filas.length; i++) {
        const textoFila = filas[i].textContent.toLowerCase();

        const coincideTexto = textoFila.includes(inputTexto);
        const coincideFecha = fechaSeleccionada === "" || textoFila.includes(fechaSeleccionada);

        if (coincideTexto && coincideFecha) {
            filas[i].style.display = "";
        } else {
            filas[i].style.display = "none";
        }
    }
}



// ACCIONES PARA BUSES 
// Abrir el modal con los datos actuales
function editarBus(id, placa, marca, modelo, capacidad) { 
    document.getElementById('edit-modal').style.display = 'block';
    document.getElementById('edit-id-bus').value = id;
    document.getElementById('edit-placa').value = placa;
    document.getElementById('edit-marca').value = marca;
    document.getElementById('edit-modelo').value = modelo;
    document.getElementById('edit-capacidad').value = capacidad;
}

// Enviar los cambios al backend
async function guardarEdicionBus() {
    // Capturamos el ID y todos los valores nuevos del modal
    const id = document.getElementById('edit-id-bus').value;
    const datosActualizados = {
        placa: document.getElementById('edit-placa').value,
        marca: document.getElementById('edit-marca').value,
        modelo: document.getElementById('edit-modelo').value,
        capacidad: document.getElementById('edit-capacidad').value
    };

    try {
        // Enviamos todos los datos al backend
        const response = await fetch(`/api/buses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        // Manejamos la respuesta
        if (response.ok) {
            alert("¡Bus actualizado exitosamente!");
            document.getElementById('edit-modal').style.display = 'none';
            cargarBuses(); 
        } else {
            const errorData = await response.json();
            alert("Error al actualizar: " + (errorData.error || "Intente nuevamente"));
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("Hubo un error de conexión con el servidor.");
    }
}

async function eliminarBus(id) {
    if (confirm("¿Estás seguro de eliminar este bus?")) {
        try {
            const response = await fetch(`/api/buses/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert("Bus eliminado correctamente.");
                cargarBuses();
            }
        } catch (error) { console.error("Error:", error); }
    }
}

// ACCIONES PARA RUTAS 
function editarRuta(id, origen, destino, precio) {
    document.getElementById('edit-ruta-modal').style.display = 'block';
    document.getElementById('edit-id-ruta').value = id;
    document.getElementById('edit-origen').value = origen;
    document.getElementById('edit-destino').value = destino;
    document.getElementById('edit-duracion').value = duracion;
    document.getElementById('edit-precio').value = precio;
}

async function guardarEdicionRuta() {
    const id = document.getElementById('edit-id-ruta').value;
    const data = {
        origen: document.getElementById('edit-origen').value,
        destino: document.getElementById('edit-destino').value,
        duracion: document.getElementById('edit-duracion').value,
        precio: document.getElementById('edit-precio').value
    };

    try {
        const response = await fetch(`/api/rutas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Ruta actualizada");
            document.getElementById('edit-ruta-modal').style.display = 'none';
            cargarTablaRutas(); 
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function eliminarRuta(id) {
    if (confirm("¿Eliminar esta ruta?")) {
        try {
            const response = await fetch(`/api/rutas/${id}`, { method: 'DELETE' });
            if (response.ok) { cargarTablaRutas(); }
        } catch (error) { console.error("Error:", error); }
    }
}

// ACCIONES PARA VIAJES

function editarViaje(id, idRuta, idBus, fecha, hora) {
    document.getElementById('edit-viaje-modal').style.display = 'block';

    // Rellenar campos ocultos y inputs
    document.getElementById('edit-id-viaje').value = id;
    document.getElementById('edit-fecha').value = fecha;
    document.getElementById('edit-hora').value = hora;

    // SELECCIONAR AUTOMÁTICAMENTE EN LOS SELECTS
    document.getElementById('edit-select-ruta').value = idRuta;
    document.getElementById('edit-select-bus').value = idBus;
}
async function guardarEdicionViaje() {
    const id = document.getElementById('edit-id-viaje').value;
    const data = {
        id_ruta: document.getElementById('edit-select-ruta').value,
        id_bus: document.getElementById('edit-select-bus').value,
        fecha_salida: document.getElementById('edit-fecha').value,
        hora_salida: document.getElementById('edit-hora').value
    };

    try {
        const response = await fetch(`/api/viajes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Viaje actualizado");
            document.getElementById('edit-viaje-modal').style.display = 'none';
            await cargarTablaHorarios(); 
        } else {
            const err = await response.json();
            alert("Error: " + err.message);
        }
    } catch (err) {
        console.error("Error al guardar:", err);
    }
}

//eliminar viaje
async function eliminarViaje(id) {
    if (confirm("¿Cancelar este viaje programado?")) {
        try {
            const response = await fetch(`/api/viajes/${id}`, { method: 'DELETE' });
            if (response.ok) { cargarTablaHorarios(); }
        } catch (error) { console.error("Error:", error); }
    }
}

//FUNCIONES DE CARGA
async function cargarBuses() {
    const busesTableBody = document.getElementById('buses-table-body');
    if (!busesTableBody) return;
    try {
        const response = await fetch('/api/buses');
        const buses = await response.json();
        busesTableBody.innerHTML = '';
        buses.forEach((bus, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${bus.placa}</strong></td>
                <td>${bus.marca}</td>
                <td>${bus.modelo}</td>
                <td>${bus.capacidad} asientos</td>
                <td><span class="estado-${bus.estado}">${bus.estado}</span></td>
                <td>
                    <button class="btn-action edit" onclick="editarBus(${bus.id_bus}, '${bus.placa}', '${bus.marca}', '${bus.modelo}', ${bus.capacidad})"><i class="fas fa-edit"></i></button>
                    <button class="btn-action delete" onclick="eliminarBus(${bus.id_bus})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            busesTableBody.appendChild(fila);
        });
    } catch (error) { console.error("Error:", error); }
}

async function cargarTablaRutas() {
    const rutasTableBody = document.getElementById('rutas-table-body');
    if (!rutasTableBody) return;
    try {
        const response = await fetch('/api/rutas');
        const rutas = await response.json();
        rutasTableBody.innerHTML = '';
        rutas.forEach((r, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${r.origen}</td>
                <td>${r.destino}</td>
                <td>${r.duracion}</td>
                <td><strong>S/. ${r.precio}</strong></td>
                <td><span class="estado-activo">Activo</span></td>
                <td>
                    <button class="btn-action edit" onclick="editarRuta(${r.id_ruta}, '${r.origen}', '${r.destino}', '${r.duracion}', ${r.precio})"><i class="fas fa-edit"></i></button>
                    <button class="btn-action delete" onclick="eliminarRuta(${r.id_ruta})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            rutasTableBody.appendChild(fila);
        });
    } catch (error) { console.error("Error:", error); }
}

async function cargarTablaHorarios() {
    const horariosTableBody = document.getElementById('horarios-table-body');
    if (!horariosTableBody) return;
    try {
        const response = await fetch('/api/viajes');
        const horarios = await response.json();
        horariosTableBody.innerHTML = '';
        horarios.forEach((h, index) => { 
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td> 
                <td><strong>${h.origen} ➔ ${h.destino}</strong></td>
                <td>${h.placa}</td>
                <td>${h.fecha_salida}</td>
                <td>${h.hora_salida}</td>
                <td><span class="estado-${h.estado}">${h.estado}</span></td>
                <td>
                    <button class="btn-action edit" onclick="editarViaje(${h.id_horario}, ${h.id_ruta}, ${h.id_bus}, '${h.fecha_salida}', '${h.hora_salida}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" onclick="eliminarViaje(${h.id_horario})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            horariosTableBody.appendChild(fila);
        });
    } catch (error) { console.error("Error:", error); }
}

async function cargarSelectsViaje() {
    try {
        const [resRutas, resBuses] = await Promise.all([
            fetch('/api/rutas'), 
            fetch('/api/buses')
        ]);
        const rutas = await resRutas.json();
        const buses = await resBuses.json();

        // Lista de selects a llenar (tanto del formulario principal como del modal)
        const selectsRuta = [document.getElementById('select-ruta'), document.getElementById('edit-select-ruta')];
        const selectsBus = [document.getElementById('select-bus'), document.getElementById('edit-select-bus')];

        // Llenar rutas
        selectsRuta.forEach(select => {
            if (select) {
                select.innerHTML = '<option value="" disabled selected>Selecciona una ruta</option>';
                rutas.forEach(r => {
                    select.innerHTML += `<option value="${r.id_ruta}">${r.origen} ➔ ${r.destino} (S/. ${r.precio})</option>`;
                });
            }
        });

        // Llenar buses
        selectsBus.forEach(select => {
            if (select) {
                select.innerHTML = '<option value="" disabled selected>Selecciona un bus</option>';
                buses.forEach(b => {
                    select.innerHTML += `<option value="${b.id_bus}">${b.placa} - ${b.marca}</option>`;
                });
            }
        });
    } catch (error) { console.error("Error cargando selects:", error); }
}

//fecha minima
function configurarFechaMinima() {
    const hoy = new Date();
    const fechaLocal = new Date(hoy.getTime() - (hoy.getTimezoneOffset() * 60000))
                            .toISOString()
                            .split('T')[0];

    // Seleccionamos solo los inputs que NO sean de filtrado
    // Usamos :not(.filtro-busqueda) para ignorar los buscadores
    const inputsFecha = document.querySelectorAll('input[type="date"]:not(.filtro-busqueda)');
    
    inputsFecha.forEach(input => {
        input.setAttribute('min', fechaLocal);
    });

    const inputsDateTime = document.querySelectorAll('input[type="datetime-local"]:not(.filtro-busqueda)');
    inputsDateTime.forEach(input => {
        input.setAttribute('min', fechaLocal + "T00:00");
    });
}

// Función para cargar los datos al activar la sección
async function cargarVentas() {
    try {
        const res = await fetch('/api/ventas');
        const ventas = await res.json();
        const tbody = document.getElementById('body-ventas');
        
        tbody.innerHTML = ventas.map(v => {
            // Extraemos la fecha limpia desde el origen
            const fechaLimpia = v.fecha_salida ? v.fecha_salida.split('T')[0] : '';
            
            return `
            <tr data-fecha="${fechaLimpia}">
                <td>${v.codigo_boleto}</td>
                <td>${v.nombres} ${v.apellido_paterno}</td>
                <td>${v.origen} - ${v.destino}</td>
                <td>${fechaLimpia}</td> 
                <td>${parseFloat(v.monto_pagado).toFixed(2)}</td>
            </tr>
        `}).join('');

        recalcularTotalVisible(); 
    } catch (err) {
        console.error("Error al cargar ventas:", err);
    }
}

// 1. Nueva función para sumar solo las filas visibles
function recalcularTotalVisible() {
    const filas = document.querySelectorAll("#body-ventas tr");
    let total = 0;

    filas.forEach(fila => {
        if (fila.style.display !== 'none' && !fila.classList.contains('fila-total')) {
            // Buscamos la celda del monto (la 5ta celda, índice 4)
            const montoTexto = fila.cells[4].innerText;
            total += parseFloat(montoTexto) || 0;
        }
    });

    // Actualizamos o creamos la fila del total
    let filaTotal = document.querySelector('.fila-total');
    if (!filaTotal) {
        filaTotal = document.createElement('tr');
        filaTotal.className = 'fila-total';
        document.getElementById('body-ventas').appendChild(filaTotal);
    }
    
    filaTotal.innerHTML = `<td colspan="4" style="text-align:right"><strong>TOTAL RECAUDADO:</strong></td>
                           <td><strong>S/. ${total.toFixed(2)}</strong></td>`;
}

function filtrarVentas() {
    const inputBusqueda = document.getElementById("buscador-ventas").value.toLowerCase();
    const fechaSeleccionada = document.getElementById("filtro-fecha-inicio").value; // Este valor ya es "YYYY-MM-DD"
    const filas = document.querySelectorAll("#body-ventas tr:not(.fila-total)");
    
    filas.forEach(fila => {
        // Obtenemos la fecha directa del atributo data-fecha
        const fechaFila = fila.getAttribute('data-fecha');
        
        const textoFila = fila.textContent.toLowerCase();
        
        const coincideTexto = textoFila.includes(inputBusqueda);
        const coincideFecha = (fechaSeleccionada === "" || fechaFila === fechaSeleccionada);
        
        fila.style.display = (coincideTexto && coincideFecha) ? "" : "none";
    });

    recalcularTotalVisible();
}
function limpiarFiltros() {
    document.getElementById("buscador-ventas").value = "";
    document.getElementById("filtro-fecha-inicio").value = "";
        
    
    const filas = document.querySelectorAll("#body-ventas tr");
    filas.forEach(f => f.style.display = "");
    
    recalcularTotalVisible();
}


// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
    // 1. SEGURIDAD
    const userId = localStorage.getItem('user_id');
    const userRol = localStorage.getItem('user_rol');
    if (!userId || userRol !== 'admin') {
        alert("Acceso denegado.");
        window.location.href = '../login.html';
        return;
    }

    const adminNameElement = document.getElementById('admin-name');
    if (adminNameElement) adminNameElement.textContent = `Bienvenido, ${localStorage.getItem('user_name')}`;

    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '../login.html';
    });

    // FORMULARIOS
    document.getElementById('bus-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.target));
        await fetch('/api/buses', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(datos)});
        cargarBuses();
    });

    document.getElementById('ruta-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.target));
        await fetch('/api/rutas', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(datos)});
        cargarTablaRutas();
        cargarSelectsViaje();
    });

    document.getElementById('viaje-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.target));
        await fetch('/api/viajes', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(datos)});
        cargarTablaHorarios();
    });

    // CARGA INICIAL
    cargarBuses();
    cargarTablaRutas();
    cargarTablaHorarios();
    cargarSelectsViaje();
    configurarFechaMinima();
});