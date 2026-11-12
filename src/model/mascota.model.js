const { pool } = require('../config/database');

class MascotaModel {
  static async obtenerTodas() {
    const query = 'SELECT * FROM mascotas ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async obtenerPorId(id) {
    const query = 'SELECT * FROM mascotas WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async buscarPorChip(chip) {
    const query = 'SELECT * FROM mascotas WHERE chip = $1';
    const result = await pool.query(query, [chip]);
    return result.rows[0];
  }

  static async crear({ chip, nombre, especie, raza, edad, peso, telefono_dueno, hospitalizado }) {
    const query = `
      INSERT INTO mascotas (chip, nombre, especie, raza, edad, peso, telefono_dueno, hospitalizado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      chip,
      nombre,
      especie,
      raza,
      edad,
      peso,
      telefono_dueno,
      hospitalizado !== undefined ? hospitalizado : false,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async actualizar(id, { chip, nombre, especie, raza, edad, peso, telefono_dueno, hospitalizado }) {
    const query = `
      UPDATE mascotas
      SET chip = COALESCE($1, chip),
          nombre = COALESCE($2, nombre),
          especie = COALESCE($3, especie),
          raza = COALESCE($4, raza),
          edad = COALESCE($5, edad),
          peso = COALESCE($6, peso),
          telefono_dueno = COALESCE($7, telefono_dueno),
          hospitalizado = COALESCE($8, hospitalizado)
      WHERE id = $9
      RETURNING *
    `;
    const values = [chip, nombre, especie, raza, edad, peso, hospitalizado, id];
    // Nota: $1 a $8 corresponden a las columnas, $9 al id
    const finalValues = [chip, nombre, especie, raza, edad, peso, telefono_dueno, hospitalizado, id];
    const result = await pool.query(query, finalValues);
    return result.rows[0];
  }

  static async eliminar(id) {
    const query = 'DELETE FROM mascotas WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = MascotaModel;
