const { verifyToken } = require('../config/jwt');

/**
 * Middleware de autenticación JWT
 * 
 * Este middleware verifica que las solicitudes a endpoints protegidos
 * incluyan un token JWT válido en el header Authorization.
 */

/**
 * Middleware que verifica el token JWT en el header Authorization
 * 
 * Extrae el token del header Authorization (formato: "Bearer <token>"),
 * lo verifica usando la función verifyToken de config/jwt.js, y adjunta
 * el payload decodificado a req.user para uso en controladores posteriores.
 * 
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * 
 * @returns {void}
 * 
 * Respuestas de error:
 * - 401: Si no se proporciona token
 * - Pasa error a next() si el token es inválido/expirado (manejado por errorHandler)
 * 
 * @example
 * // Uso en rutas protegidas
 * router.post('/products', verifyToken, productController.create);
 */
const verifyTokenMiddleware = (req, res, next) => {
  try {
    // Extraer el header Authorization
    const authHeader = req.headers.authorization;

    // Verificar que el header existe
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token no proporcionado'
      });
    }

    // Extraer el token del formato "Bearer <token>"
    const parts = authHeader.split(' ');
    
    // Verificar formato correcto
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Token no proporcionado'
      });
    }

    const token = parts[1];

    // Verificar el token usando la función de config/jwt.js
    // Si el token es inválido o expirado, verifyToken lanzará un error
    const decoded = verifyToken(token);

    // Adjuntar el payload decodificado a req.user
    req.user = decoded;

    // Continuar al siguiente middleware/controlador
    next();
  } catch (error) {
    // Pasar el error al middleware de manejo de errores
    // Esto permite que errorHandler maneje JsonWebTokenError y TokenExpiredError
    next(error);
  }
};

module.exports = {
  verifyToken: verifyTokenMiddleware
};
