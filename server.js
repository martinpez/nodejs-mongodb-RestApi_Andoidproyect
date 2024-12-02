const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// Inicializa la app y configura middlewares
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});






// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar con MongoDB', err));

// Rutas
app.use('/api/users', require('./routes/userRoutes'));

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
