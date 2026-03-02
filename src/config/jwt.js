const jwt = require('jsonwebtoken');

/**
 * Configuración de JWT para autenticación
 * 
 * Este módulo proporciona funciones para generar y verificar tokens JWT
 * utilizados en la autenticación de administradores.
 */

// Obtener configuración desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Genera un token JWT con el payload proporcionado
 * 
 * @param {Object} payload - Datos a incluir en el token (ej: { userId, username })
 * @returns {string} Token JWT firmado
 * 
 * @example
 * const token = generateToken({ userId: 1, username: 'admin' });
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verifica y decodifica un token JWT
 * 
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado del token
 * @throws {JsonWebTokenError} Si el token es inválido
 * @throws {TokenExpiredError} Si el token ha expirado
 * 
 * @example
 * try {
 *   const decoded = verifyToken(token);
 *   console.log(decoded.userId);
 * } catch (error) {
 *   console.error('Token inválido:', error.message);
 * }
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Re-lanzar el error para que sea manejado por el middleware de errores
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
