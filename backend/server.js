const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/db');

const app = express();
//Puerto node.js
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

//Cargar rutas de API
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);


app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});