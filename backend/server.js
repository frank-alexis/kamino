const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // IMPORTAMOS DESDE EL ARCHIVO QUE CORREGIMOS

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});