const express = require('express');
const router = express.Router();
const MascotaController = require('../controllers/mascota.controller');

// CRUD de Mascotas
router.get('/', MascotaController.listar);
router.get('/:id', MascotaController.obtenerPorId);
router.post('/', MascotaController.crear);
router.put('/:id', MascotaController.actualizar);
router.delete('/:id', MascotaController.eliminar);

module.exports = router;
