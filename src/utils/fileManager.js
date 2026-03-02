const fs = require('fs/promises');
const path = require('path');

/**
 * Elimina un archivo del directorio uploads/
 * @param {string} filename - Nombre del archivo a eliminar
 * @returns {Promise<void>}
 */
const deleteFile = async (filename) => {
  try {
    const filePath = path.join('uploads', filename);
    await fs.unlink(filePath);
  } catch (error) {
    // Maneja errores silenciosamente (no lanza error si archivo no existe)
    // Solo registra el error para debugging si es necesario
    if (error.code !== 'ENOENT') {
      console.error(`Error al eliminar archivo ${filename}:`, error.message);
    }
  }
};

/**
 * Elimina múltiples archivos del directorio uploads/
 * @param {string[]} filenames - Array de nombres de archivos a eliminar
 * @returns {Promise<void>}
 */
const deleteMultipleFiles = async (filenames) => {
  await Promise.all(filenames.map(filename => deleteFile(filename)));
};

module.exports = {
  deleteFile,
  deleteMultipleFiles
};
