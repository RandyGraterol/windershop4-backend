const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { validateWhatsApp, handleValidationErrors } = require('../middleware/validation');
const { get, update } = require('../controllers/whatsappController');

/**
 * Router de configuración de WhatsApp
 * 
 * Define las rutas para gestionar la configuración del número de WhatsApp
 * de contacto con clientes.
 */

const router = express.Router();

/**
 * GET /
 * 
 * Obtiene la configuración actual de WhatsApp (público)
 * 
 * Response 200:
 * {
 *   "phoneNumber": "string"
 * }
 * 
 * @example
 * GET /api/whatsapp
 * Response: { "phoneNumber": "+1234567890" }
 */
router.get('/', get);

/**
 * PUT /
 * 
 * Actualiza el número de WhatsApp (protegido - requiere autenticación)
 * 
 * Request Headers:
 * - Authorization: Bearer <token>
 * 
 * Request Body:
 * - phoneNumber: string (requerido, solo dígitos y opcional +)
 * 
 * Response 200:
 * {
 *   "phoneNumber": "string"
 * }
 * 
 * Response 400:
 * {
 *   "error": "Datos de validación inválidos",
 *   "details": ["phoneNumber: mensaje de error"]
 * }
 * 
 * Response 401:
 * {
 *   "error": "Token no proporcionado" | "Token inválido" | "Token expirado"
 * }
 * 
 * @example
 * PUT /api/whatsapp
 * Headers: { "Authorization": "Bearer eyJhbGc..." }
 * Body: { "phoneNumber": "+5491123456789" }
 * Response: { "phoneNumber": "+5491123456789" }
 */
router.put('/', verifyToken, validateWhatsApp, handleValidationErrors, update);

module.exports = router;
