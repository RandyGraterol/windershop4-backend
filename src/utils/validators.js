/**
 * Validadores personalizados para el backend de e-commerce
 * Valida requisitos 2.6 y 2.7
 */

/**
 * Verifica que el mimetype sea un formato de imagen válido
 * Formatos aceptados: image/jpeg, image/png, image/webp
 * 
 * @param {string} mimetype - El tipo MIME del archivo
 * @returns {boolean} true si es un formato válido, false si no
 */
const isValidImageFormat = (mimetype) => {
  const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
  return validFormats.includes(mimetype);
};

/**
 * Verifica que el tamaño del archivo no exceda el máximo permitido
 * 
 * @param {number} size - Tamaño del archivo en bytes
 * @param {number} maxSize - Tamaño máximo permitido en bytes (default: 5MB)
 * @returns {boolean} true si el tamaño es válido, false si excede el máximo
 */
const isValidFileSize = (size, maxSize = 5 * 1024 * 1024) => {
  return size <= maxSize;
};

module.exports = {
  isValidImageFormat,
  isValidFileSize
};
