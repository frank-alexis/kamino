const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000; // Render usa el puerto 10000 internamente

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// Esto es lo que falta para que no de error al arrancar
pool.connect()
  .then(() => console.log('Conectado a la base de datos con éxito'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Servidor de Node.js corriendo en el puerto ${PORT}`);
});