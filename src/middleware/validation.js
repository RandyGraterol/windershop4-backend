const { body, validationResult } = require('express-validator');

/**
 * Middleware de validación para login
 * Valida que username y password estén presentes
 */
const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

/**
 * Middleware de validación para productos
 * Valida nombre (3-100 caracteres) y precio (>= 0)
 */
const validateProduct = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo')
];

/**
 * Middleware de validación para WhatsApp
 * Valida formato de número (solo dígitos y opcional +)
 */
const validateWhatsApp = [
  body('phoneNumber')
    .matches(/^\+?[0-9]+$/)
    .withMessage('El número de teléfono debe contener solo dígitos y opcionalmente un signo + al inicio')
];

/**
 * Middleware que verifica errores de validación
 * Retorna 400 con detalles de errores si hay problemas
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de validación inválidos',
      details: errors.array().map(err => `${err.path}: ${err.msg}`)
    });
  }
  
  next();
};

module.exports = {
  validateLogin,
  validateProduct,
  validateWhatsApp,
  handleValidationErrors
};
