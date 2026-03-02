const bcrypt = require('bcrypt');
const { generateToken } = require('../config/jwt');
const { User } = require('../models');

/**
 * Controlador de autenticación
 * 
 * Maneja las operaciones de autenticación de administradores,
 * incluyendo login y generación de tokens JWT.
 */

/**
 * Autentica un usuario administrador y genera un token JWT
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.username - Nombre de usuario
 * @param {string} req.body.password - Contraseña
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express para manejo de errores
 * 
 * @returns {Object} 200 - { token, user: { id, username } }
 * @returns {Object} 401 - { error: "Credenciales inválidas" }
 * 
 * @example
 * POST /api/auth/login
 * Body: { "username": "admin", "password": "password123" }
 * Response: { "token": "eyJhbGc...", "user": { "id": 1, "username": "admin" } }
 */
const login = async (req, res, next) => {
  try {
    // Extraer username y password del body
    const { username, password } = req.body;

    // Buscar usuario por username
    const user = await User.findOne({ where: { username } });

    // Si no existe el usuario, retornar 401
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Comparar password con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Si password incorrecto, retornar 401
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Si credenciales válidas, generar token JWT
    const token = generateToken({
      userId: user.id,
      username: user.username
    });

    // Retornar 200 con token y datos del usuario
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    // Pasar errores al middleware de manejo de errores
    next(error);
  }
};

module.exports = {
  login
};
