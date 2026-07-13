const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. MIDDLEWARES CLAVE
app.use(cors()); // Permite que tu Frontend se comunique con el Backend desde carpetas distintas
app.use(express.json()); //Permite que Node.js entienda los datos JSON que envía el Fetch

// 2. IMPORTAR RUTAS
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); // Todas tus rutas empezarán con http://localhost:3000/api

// 3. LEVANTAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor de Node.js corriendo en el puerto ${PORT}`);
});