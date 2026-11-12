require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { initDatabase } = require('./config/database');
const mascotaRoutes = require('./routes/mascota.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas de la API
app.use('/api/mascotas', mascotaRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;