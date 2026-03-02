const { WhatsAppConfig } = require('../models');

/**
 * Controlador de configuración de WhatsApp
 * 
 * Maneja las operaciones de configuración del número de WhatsApp
 * para contacto con clientes.
 */

/**
 * Obtiene la configuración actual de WhatsApp
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express para manejo de errores
 * 
 * @returns {Object} 200 - { phoneNumber: string }
 * 
 * @example
 * GET /api/whatsapp
 * Response: { "phoneNumber": "+1234567890" }
 */
const get = async (req, res, next) => {
  try {
    // Buscar configuración existente
    let config = await WhatsAppConfig.findOne();

    // Si no existe, crear con número por defecto
    if (!config) {
      config = await WhatsAppConfig.create({
        phoneNumber: '+1234567890'
      });
    }

    // Retornar 200 con el número de teléfono
    return res.status(200).json({
      phoneNumber: config.phoneNumber
    });

  } catch (error) {
    // Pasar errores al middleware de manejo de errores
    next(error);
  }
};

/**
 * Actualiza el número de WhatsApp
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.phoneNumber - Número de WhatsApp (solo dígitos y opcional +)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express para manejo de errores
 * 
 * @returns {Object} 200 - { phoneNumber: string }
 * @returns {Object} 400 - { error: "Número de teléfono inválido" }
 * 
 * @example
 * PUT /api/whatsapp
 * Body: { "phoneNumber": "+5491123456789" }
 * Response: { "phoneNumber": "+5491123456789" }
 */
const update = async (req, res, next) => {
  try {
    // Extraer phoneNumber del body
    const { phoneNumber } = req.body;

    // Buscar configuración existente
    let config = await WhatsAppConfig.findOne();

    // Si no existe, crear nueva con el phoneNumber
    if (!config) {
      config = await WhatsAppConfig.create({
        phoneNumber
      });
    } else {
      // Si existe, actualizar phoneNumber
      config.phoneNumber = phoneNumber;
      await config.save();
    }

    // Retornar 200 con el número actualizado
    return res.status(200).json({
      phoneNumber: config.phoneNumber
    });

  } catch (error) {
    // Pasar errores al middleware de manejo de errores
    next(error);
  }
};

module.exports = {
  get,
  update
};
