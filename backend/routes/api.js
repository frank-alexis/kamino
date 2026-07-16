const express = require('express');
const router = express.Router();
const pool = require('../config/db'); 

// ===   RUTAS DE AUTENTICACIÓN (CLIENTES) ===

//REGISTRO DE USUARIO 
router.post('/auth/registro', async (req, res) => { 
    const { 
        tipo_documento, 
        numero_documento, 
        nombres, 
        apellido_paterno, 
        apellido_materno, 
        telefono, 
        correo, 
        contrasena 
    } = req.body;

    try {
        const query = `
            INSERT INTO usuario (tipo_documento, numero_documento, nombres, apellido_paterno, apellido_materno, telefono, correo, contrasena, rol, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'cliente', 'activo') 
            RETURNING id_usuario, nombres, correo, rol
        `; 
        
        const values = [tipo_documento, numero_documento, nombres, apellido_paterno, apellido_materno, telefono, correo, contrasena];
        const result = await pool.query(query, values);
        
        res.status(201).json({ mensaje: "Usuario registrado con éxito", usuario: result.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { 
            return res.status(400).json({ error: "El correo electrónico o número de documento ya están registrados." });
        }
        res.status(500).json({ error: "Error interno en el servidor." });
    }
});

// INICIO DE SESIÓN (LOGIN - Sincronizado el formato de respuesta con el frontend)
router.post('/auth/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const query = `SELECT id_usuario, nombres, correo, rol, contrasena FROM usuario WHERE correo = $1 AND estado = 'activo'`;
        const result = await pool.query(query, [correo]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "El correo electrónico no existe o el usuario está inactivo." });
        }

        const usuario = result.rows[0];

        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({ error: "Contraseña incorrecta." });
        }

        res.json({
            mensaje: "Autenticación exitosa",
            usuario: {
                id_usuario: usuario.id_usuario,
                nombres: usuario.nombres,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno en el servidor." });
    }
});

// LISTAR USUARIOS (Solo para administradores)
router.get('/admin/usuarios', async (req, res) => {
    try {
        const query = `
            SELECT id_usuario, tipo_documento, numero_documento, nombres, 
                   apellido_paterno, apellido_materno, telefono, correo, rol, estado 
            FROM usuario
            ORDER BY id_usuario DESC
        `;
        
        const result = await pool.query(query);
        
        res.json({
            mensaje: "Lista de usuarios obtenida",
            usuarios: result.rows
        });
        
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: "Error al recuperar la lista de usuarios." });
    }
});

//  OBTENER TODOS LOS BUSES 
router.get('/buses', async (req, res) => {
    try {
        const query = `SELECT id_bus, placa, marca, modelo, capacidad, estado FROM bus ORDER BY id_bus DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener buses:", err);
        res.status(500).json({ error: "Error al obtener la lista de buses." });
    }
});


// REGISTRAR UN NUEVO BUS 
router.post('/buses', async (req, res) => {
    const { placa, marca, modelo, capacidad } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insertamos el bus
        const busQuery = `
            INSERT INTO bus (placa, marca, modelo, capacidad, estado)
            VALUES ($1, $2, $3, $4, 'activo')
            RETURNING id_bus
        `;
        const result = await client.query(busQuery, [placa, marca, modelo, capacidad]);
        const id_bus = result.rows[0].id_bus;

        // 2. Generamos automáticamente los asientos (de 1 hasta la capacidad)
        for (let i = 1; i <= capacidad; i++) {
            await client.query(
                'INSERT INTO asiento (id_bus, numero_asiento, estado) VALUES ($1, $2, $3)',
                [id_bus, i, 'disponible']
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ mensaje: "Bus y asientos creados con éxito", id_bus });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error al registrar bus y asientos:", err);
        res.status(500).json({ error: "Error interno al crear el bus." });
    } finally {
        client.release();
    }
});



// OBTENER TODAS LAS RUTAS 
router.get('/rutas', async (req, res) => {
    try {
        const result = await pool.query(`SELECT id_ruta, origen, destino, precio_base AS precio FROM ruta ORDER BY id_ruta DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener rutas:", err);
        res.status(500).json({ error: "Error al obtener la lista de rutas." });
    }
});

// REGISTRAR UNA NUEVA RUTA 
router.post('/rutas', async (req, res) => {
    const { origen, destino, precio } = req.body;
    try {
        const query = `
            INSERT INTO ruta (origen, destino, duracion, precio_base) 
            VALUES ($1, $2, '04:00:00', $3) 
            RETURNING id_ruta, origen, destino, precio_base AS precio
        `;
        const result = await pool.query(query, [origen, destino, precio]);
        res.status(201).json({ mensaje: "Ruta creada con éxito", ruta: result.rows[0] });
    } catch (err) {
        console.error("Error al registrar ruta:", err);
        res.status(500).json({ error: "Error interno al crear la ruta." });
    }
});

// PROGRAMAR UN NUEVO VIAJE 
router.post('/viajes', async (req, res) => {
    const { id_ruta, id_bus, fecha_salida } = req.body; 

    const fechaProgramada = new Date(fecha_salida);
    const ahora = new Date(); 

    if (fechaProgramada < ahora) {
        return res.status(400).json({ 
            error: "No es posible programar un viaje en una fecha u hora pasada." 
        });
    }

    try {
        const [fecha, hora] = fecha_salida.split('T');

        const query = `
            INSERT INTO horario (id_ruta, id_bus, fecha_salida, hora_salida, estado) 
            VALUES ($1, $2, $3, $4, 'disponible') 
            RETURNING id_horario, id_ruta, id_bus, fecha_salida, hora_salida, estado
        `;
        const values = [id_ruta, id_bus, fecha, hora];
        const result = await pool.query(query, values);

        res.status(201).json({ mensaje: "Viaje programado con éxito", viaje: result.rows[0] });
    } catch (err) {
        console.error("Error al programar horario:", err);
        res.status(500).json({ error: "Error interno al programar el horario en la base de datos." });
    }
});

// OBTENER TODOS LOS HORARIOS PROGRAMADOS
router.get('/viajes', async (req, res) => {
    try {
        const query = `
            SELECT 
                h.id_horario,
                r.origen,
                r.destino,
                b.placa,
                b.marca,
                b.capacidad,
                to_char(h.fecha_salida, 'YYYY-MM-DD') as fecha_salida,
                h.hora_salida,
                h.estado
            FROM horario h
            INNER JOIN ruta r ON h.id_ruta = r.id_ruta
            INNER JOIN bus b ON h.id_bus = b.id_bus
            ORDER BY h.fecha_salida ASC, h.hora_salida ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener horarios:", err);
        res.status(500).json({ error: "Error al obtener el cronograma de viajes." });
    }
});


// BUSCAR VIAJES DISPONIBLES PARA LOS CLIENTES 
router.get('/buscar-viajes', async (req, res) => {
    const { origen, destino, fecha } = req.query; 

    if (!origen || !destino || !fecha) {
        return res.status(400).json({ error: "Faltan parámetros de búsqueda (origen, destino, fecha)." });
    }

    try {
        const query = `
            SELECT 
                h.id_horario,
                r.origen,
                r.destino,
                r.precio_base AS precio,
                b.placa,
                b.modelo,
                b.capacidad,
                to_char(h.fecha_salida, 'YYYY-MM-DD') as fecha_salida,
                h.hora_salida,
                h.estado
            FROM horario h
            INNER JOIN ruta r ON h.id_ruta = r.id_ruta
            INNER JOIN bus b ON h.id_bus = b.id_bus
            WHERE r.origen = $1 
              AND r.destino = $2 
              AND h.fecha_salida = $3
              AND h.estado = 'disponible'
            ORDER BY h.hora_salida ASC
        `;
        
        const result = await pool.query(query, [origen, destino, fecha]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al buscar viajes:", err);
        res.status(500).json({ error: "Error interno del servidor al procesar la búsqueda." });
    }
});


// OBTENER ASIENTOS OCUPADOS DE UN HORARIO ESPECÍFICO
router.get('/horarios/:id/asientos-ocupados', async (req, res) => {
    const id_horario = req.params.id;
    try {
        const query = `
            SELECT a.numero_asiento 
            FROM asiento a
            WHERE a.id_asiento IN (
                SELECT id_asiento FROM boleto WHERE id_horario = $1 AND estado_boleto != 'cancelado'
                UNION
                SELECT id_asiento FROM bloqueo_asiento WHERE id_horario = $1 AND fecha_expiracion > NOW()
            )
        `;
        const result = await pool.query(query, [id_horario]);
        const ocupados = result.rows.map(row => row.numero_asiento);
        res.json(ocupados);
    } catch (err) {
        console.error("Error en asientos-ocupados:", err); // Es bueno dejar el error en consola
        res.status(500).json({ error: "Error al verificar ocupación." });
    }
});

// BLOQUEAR ASIENTOS TEMPORALMENTE (5 MINUTOS)
router.post('/bloquear-asientos', async (req, res) => {
    const { id_horario, id_asientos, id_usuario } = req.body;

    try {
        await pool.query('BEGIN');

        for (const numero_asiento of id_asientos) {
            // 1. Verificamos si alguien YA bloqueó o compró este asiento
            const checkQuery = `
                SELECT id_asiento FROM asiento a
                WHERE a.numero_asiento = $1 AND a.id_bus = (SELECT id_bus FROM horario WHERE id_horario = $2)
                AND a.id_asiento NOT IN (
                    SELECT id_asiento FROM boleto WHERE id_horario = $2 AND estado_boleto != 'cancelado'
                    UNION
                    SELECT id_asiento FROM bloqueo_asiento WHERE id_horario = $2 AND fecha_expiracion > NOW()
                )
            `;
            const check = await pool.query(checkQuery, [numero_asiento, id_horario]);

            if (check.rows.length === 0) {
                throw new Error(`El asiento ${numero_asiento} ya no está disponible.`);
            }

            // 2. Si está libre, insertamos el bloqueo
            await pool.query(
                'INSERT INTO bloqueo_asiento (id_horario, id_asiento, usuario_id) VALUES ($1, $2, $3)',
                [id_horario, check.rows[0].id_asiento, id_usuario]
            );
        }

        await pool.query('COMMIT');
        res.status(200).json({ mensaje: "Asientos bloqueados" });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    }
});

router.post('/bloquear-asientos/liberar', async (req, res) => {
    const { id_usuario } = req.body;
    try {
        await pool.query('DELETE FROM bloqueo_asiento WHERE usuario_id = $1', [id_usuario]);
        res.status(200).json({ mensaje: "Asientos liberados." });
    } catch (err) {
        res.status(500).json({ error: "Error al liberar." });
    }
});

// OBTENER DETALLES SIMPLES DE UN HORARIO
router.get('/horarios/:id/detalles', async (req, res) => {
    try {
        const query = `
            SELECT r.origen, r.destino, r.precio_base AS precio, b.capacidad
            FROM horario h
            INNER JOIN ruta r ON h.id_ruta = r.id_ruta
            INNER JOIN bus b ON h.id_bus = b.id_bus
            WHERE h.id_horario = $1
        `;
        const result = await pool.query(query, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "No se encontró el horario." });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor." });
    }
});


// 1. ELIMINAR BUS
router.delete('/buses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM bus WHERE id_bus = $1', [id]);
        res.json({ mensaje: "Bus eliminado con éxito" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No se puede eliminar porque el bus tiene viajes asociados." });
    }
});

// 2. ELIMINAR RUTA
router.delete('/rutas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ruta WHERE id_ruta = $1', [id]);
        res.json({ mensaje: "Ruta eliminada con éxito" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al eliminar la ruta." });
    }
});

// 3. ELIMINAR VIAJE (HORARIO)
router.delete('/viajes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM horario WHERE id_horario = $1', [id]);
        res.json({ mensaje: "Viaje cancelado con éxito" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al cancelar el viaje." });
    }
});

// EDITAR UN BUS
router.put('/buses/:id', async (req, res) => {
    const { id } = req.params;
    const { placa, marca, modelo, capacidad } = req.body; 

    try {
        const query = `
            UPDATE bus 
            SET placa = $1, marca = $2, modelo = $3, capacidad = $4 
            WHERE id_bus = $5
            RETURNING id_bus, placa, marca, modelo, capacidad
        `;
        const values = [placa, marca, modelo, capacidad, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Bus no encontrado" });
        }

        res.json({ mensaje: "Bus actualizado con éxito", bus: result.rows[0] });
    } catch (err) {
        console.error("Error al actualizar bus:", err);
        res.status(500).json({ error: "Error interno al actualizar el bus." });
    }
});

// EDITAR UNA RUTA
router.put('/rutas/:id', async (req, res) => {
    const { id } = req.params;
    const { origen, destino, precio } = req.body;

    try {
        const query = `
            UPDATE ruta 
            SET origen = $1, destino = $2, precio_base = $3 
            WHERE id_ruta = $4
            RETURNING id_ruta, origen, destino, precio_base AS precio
        `;
        const result = await pool.query(query, [origen, destino, precio, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ruta no encontrada" });
        }

        res.json({ mensaje: "Ruta actualizada con éxito", ruta: result.rows[0] });
    } catch (err) {
        console.error("Error al actualizar ruta:", err);
        res.status(500).json({ error: "Error interno al actualizar la ruta." });
    }
});

// EDITAR UN VIAJE
router.put('/viajes/:id', async (req, res) => {
    const { id } = req.params;
    const { id_ruta, id_bus, fecha_salida, hora_salida } = req.body;

    try {
        const sql = `
            UPDATE horario 
            SET id_ruta = $1, id_bus = $2, fecha_salida = $3, hora_salida = $4 
            WHERE id_horario = $5`;
        await pool.query(sql, [id_ruta, id_bus, fecha_salida, hora_salida, id]);
        
        res.json({ mensaje: "Viaje actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar viaje:", err);
        res.status(500).json({ error: "Error al actualizar el viaje" });
    }
});

// REGISTRAR VENTA DE BOLETO
router.post('/boletos', async (req, res) => {
    const { id_usuario, id_horario, id_asiento, monto_pagado, metodo_pago } = req.body;
    const client = await pool.connect(); 

    try {
        await client.query('BEGIN');

        // 1. DEFINIMOS LA CONSULTA DE VALIDACIÓN AQUÍ ADENTRO
        const queryBusqueda = `
            SELECT a.id_asiento 
            FROM asiento a
            JOIN horario h ON a.id_bus = h.id_bus
            WHERE h.id_horario = $1 AND a.numero_asiento = $2
            AND a.id_asiento NOT IN (
                SELECT id_asiento FROM boleto WHERE id_horario = $1 AND estado_boleto != 'cancelado'
                UNION
                SELECT id_asiento FROM bloqueo_asiento 
                WHERE id_horario = $1 
                AND fecha_expiracion > NOW() 
                AND usuario_id != $3
            )
        `;

        // 2. EJECUTAMOS LA VALIDACIÓN
        const resAsiento = await client.query(queryBusqueda, [id_horario, id_asiento, id_usuario]);

        if (resAsiento.rows.length === 0) {
            throw new Error("¡Lo sentimos! El asiento acaba de ser ocupado por otro usuario.");
        }

        const id_asiento_real = resAsiento.rows[0].id_asiento;

        // 3. INSERTAMOS EL BOLETO (Usamos RETURNING para obtener el ID recién creado)
        const insertQuery = `
            INSERT INTO boleto (id_usuario, id_horario, id_asiento, monto_pagado, metodo_pago, estado_boleto, fecha_compra)
            VALUES ($1, $2, $3, $4, $5, 'emitido', NOW())
            RETURNING id_boleto;
        `;
        const resInsert = await client.query(insertQuery, [id_usuario, id_horario, id_asiento_real, monto_pagado, metodo_pago]);
        const nuevoId = resInsert.rows[0].id_boleto;

        // 4. GENERAMOS EL CÓDIGO PROFESIONAL (BOL-20260712-0001)
        const fechaHoy = new Date().toISOString().slice(0, 10).replace(/-/g, ''); 
        const idFormateado = String(nuevoId).padStart(4, '0');
        const codigo_boleto = `BOL-${fechaHoy}-${idFormateado}`;

        // 5. ACTUALIZAMOS CON EL CÓDIGO FINAL
        await client.query("UPDATE boleto SET codigo_boleto = $1 WHERE id_boleto = $2", [codigo_boleto, nuevoId]);

        await client.query('COMMIT');
        
        res.status(201).json({ mensaje: "Boleto comprado con éxito", codigo: codigo_boleto, id_boleto: nuevoId });
        
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error al procesar la venta:", err);
        res.status(500).json({ error: err.message || "Error al procesar la compra." });
    } finally {
        client.release();
    }
});


router.get('/boletos/:id', async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT 
            b.codigo_boleto,
            u.nombres, u.apellido_paterno, u.apellido_materno,
            r.origen, r.destino,
            h.fecha_salida, h.hora_salida,
            a.numero_asiento,
            b.monto_pagado
        FROM boleto b
        JOIN usuario u ON b.id_usuario = u.id_usuario
        JOIN horario h ON b.id_horario = h.id_horario
        JOIN ruta r ON h.id_ruta = r.id_ruta
        JOIN asiento a ON b.id_asiento = a.id_asiento
        WHERE b.id_boleto = $1;
    `;
    
    try {
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Boleto no encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener el boleto" });
    }
});

router.get('/mis-boletos/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    const query = `
        SELECT 
            b.id_boleto, b.codigo_boleto, b.fecha_compra, b.monto_pagado, b.estado_boleto,
            r.origen, r.destino,
            h.fecha_salida, h.hora_salida,
            a.numero_asiento
        FROM boleto b
        JOIN horario h ON b.id_horario = h.id_horario
        JOIN ruta r ON h.id_ruta = r.id_ruta
        JOIN asiento a ON b.id_asiento = a.id_asiento
        WHERE b.id_usuario = $1
        ORDER BY b.fecha_compra DESC;
    `;
    try {
        const result = await pool.query(query, [id_usuario]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al cargar historial" });
    }
});


router.get('/ventas', async (req, res) => {
    try {
        const query = `
            SELECT b.codigo_boleto, u.nombres, u.apellido_paterno, 
                   r.origen, r.destino, h.fecha_salida, b.monto_pagado
            FROM boleto b
            JOIN usuario u ON b.id_usuario = u.id_usuario
            JOIN horario h ON b.id_horario = h.id_horario
            JOIN ruta r ON h.id_ruta = r.id_ruta
            ORDER BY b.fecha_compra DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error en servidor:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
module.exports = router; 