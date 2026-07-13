const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 1. Primero, servimos archivos estáticos (CSS, JS, imágenes del frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Cargamos tus rutas de API ANTES de manejar el resto
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// 3. Finalmente, si la ruta NO empieza por /api, devolvemos el index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});