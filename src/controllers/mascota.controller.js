const MascotaModel = require('../model/mascota.model');
const { validarDatosMascota } = require('../helpers/validador');

class MascotaController {
  // GET /api/mascotas -> Lista todas las mascotas (200)
  static async listar(req, res) {
    try {
      const mascotas = await MascotaModel.obtenerTodas();
      return res.status(200).json(mascotas);
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Error interno del servidor' });
    }
  }

  // GET /api/mascotas/:id -> Muestra una mascota (200) o 404 si no existe
  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const mascota = await MascotaModel.obtenerPorId(id);

      if (!mascota) {
        return res.status(404).json({ message: `Mascota con ID ${id} no encontrada.` });
      }

      return res.status(200).json(mascota);
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Error interno del servidor' });
    }
  }

  // POST /api/mascotas -> Registra una mascota (201)
  static async crear(req, res) {
    try {
      const errores = validarDatosMascota(req.body, false);
      if (errores.length > 0) {
        return res.status(400).json({ message: errores.join(' | ') });
      }

      const { chip, nombre, especie, raza, edad, peso, telefono_dueno, hospitalizado } = req.body;

      // Verificar si ya existe una mascota con ese chip (409 Conflict)
      const mascotaExistente = await MascotaModel.buscarPorChip(chip.trim());
      if (mascotaExistente) {
        return res.status(409).json({
          message: `Conflicto: ya existe una mascota registrada con el chip '${chip}'.`
        });
      }

      const nuevaMascota = await MascotaModel.crear({
        chip: chip.trim(),
        nombre: nombre.trim(),
        especie: especie.trim(),
        raza: raza.trim(),
        edad: parseInt(edad, 10),
        peso: Number(peso),
        telefono_dueno: telefono_dueno.trim(),
        hospitalizado: hospitalizado === true,
      });

      return res.status(201).json(nuevaMascota);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'El chip ya se encuentra registrado.' });
      }
      return res.status(500).json({ message: error.message || 'Error interno del servidor' });
    }
  }

  // PUT /api/mascotas/:id -> Edita una mascota (200)
  static async actualizar(req, res) {
    try {
      const { id } = req.params;

      const mascotaActual = await MascotaModel.obtenerPorId(id);
      if (!mascotaActual) {
        return res.status(404).json({ message: `Mascota con ID ${id} no encontrada.` });
      }

      const datosValidar = {
        ...req.body,
        especie: req.body.especie || mascotaActual.especie,
      };
      const errores = validarDatosMascota(datosValidar, true);
      if (errores.length > 0) {
        return res.status(400).json({ message: errores.join(' | ') });
      }

      const { chip, nombre, especie, raza, edad, peso, telefono_dueno, hospitalizado } = req.body;

      const mascotaActualizada = await MascotaModel.actualizar(id, {
        chip: chip !== undefined ? chip.trim() : null,
        nombre: nombre !== undefined ? nombre.trim() : null,
        especie: especie !== undefined ? especie.trim() : null,
        raza: raza !== undefined ? raza.trim() : null,
        edad: edad !== undefined ? parseInt(edad, 10) : null,
        peso: peso !== undefined ? Number(peso) : null,
        telefono_dueno: telefono_dueno !== undefined ? telefono_dueno.trim() : null,
        hospitalizado: hospitalizado !== undefined ? hospitalizado : null,
      });

      return res.status(200).json(mascotaActualizada);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'El chip ya se encuentra registrado.' });
      }
      return res.status(500).json({ message: error.message || 'Error interno del servidor' });
    }
  }

  // DELETE /api/mascotas/:id -> Elimina una mascota (204)
  static async eliminar(req, res) {
    try {
      const { id } = req.params;

      const mascota = await MascotaModel.obtenerPorId(id);
      if (!mascota) {
        return res.status(404).json({ message: `Mascota con ID ${id} no encontrada.` });
      }

      await MascotaModel.eliminar(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Error interno del servidor' });
    }
  }
}

module.exports = MascotaController;
