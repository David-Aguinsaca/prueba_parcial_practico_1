
const validarDatosMascota = (datos, esActualizacion = false) => {
  const errores = [];
  const { chip, nombre, especie, raza, edad, peso, telefono_dueno, hospitalizado } = datos;

  //  Campos obligatorios en creación
  if (!esActualizacion) {
    if (!chip || !chip.trim()) {
      errores.push('El chip es obligatorio.');
    }
    if (!nombre || !nombre.trim()) {
      errores.push('El nombre es obligatorio.');
    }
    if (!especie || !especie.trim()) {
      errores.push('La especie es obligatoria.');
    }
    if (!raza || !raza.trim()) {
      errores.push('La raza es obligatoria.');
    }
    if (!edad || isNaN(Number(edad))) {
      errores.push('La edad es obligatoria y debe ser un número entero.');
    }
    if (!peso || isNaN(Number(peso))) {
      errores.push('El peso es obligatorio y debe ser un número.');
    }
    if (!telefono_dueno || !telefono_dueno.trim()) {
      errores.push('El teléfono del dueño es obligatorio.');
    }
  }

  return errores;
};

module.exports = {
  validarDatosMascota,
};
