const { Pool } = require('pg');
require('dotenv').config(); 

// Configuramos el Pool de conexiones
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Mensaje en consola para verificar si conectó a Postgres
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error crítico al conectar a PostgreSQL:', err.stack);
    } else {
        console.log('Conexión exitosa a PostgreSQL. Hora del servidor BD:', res.rows[0].now);
    }
});

module.exports = pool;