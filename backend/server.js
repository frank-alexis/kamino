const express = require('express');
const cors = require('cors');
const path = require('path'); // Asegúrate de importar path
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());


// --- CONFIGURACIÓN PARA EL FRONTEND ---
app.use(express.static(path.join(__dirname, '../frontend')));

// Cambia app.get('*', ...) por esto:
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});