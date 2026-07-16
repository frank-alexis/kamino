const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 1. Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Cargar rutas de API
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);


app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});