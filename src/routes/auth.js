const express = require('express');
const { validateLogin, handleValidationErrors } = require('../middleware/validation');
const { login } = require('../controllers/authController');

/**
 * Router de autenticación
 * 
 * Define las rutas para autenticación de administradores.
 * Incluye validación de entrada y manejo de errores.
 */

const router = express.Router();

/**
 * POST /login
 * 
 * Autentica un usuario administrador y retorna un token JWT
 * 
 * Request Body:
 * - username: string (requerido)
 * - password: string (requerido)
 * 
 * Response 200:
 * {
 *   "token": "string",
 *   "user": {
 *     "id": number,
 *     "username": "string"
 *   }
 * }
 * 
 * Response 401:
 * {
 *   "error": "Credenciales inválidas"
 * }
 * 
 * Response 400:
 * {
 *   "error": "Datos de validación inválidos",
 *   "details": ["campo: mensaje de error"]
 * }
 */
router.post('/login', validateLogin, handleValidationErrors, login);

module.exports = router;
