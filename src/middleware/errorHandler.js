/**
 * Middleware centralizado de manejo de errores
 * Captura todas las excepciones y las transforma en respuestas HTTP apropiadas
 * 
 * Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5
 */

const errorHandler = (err, req, res, next) => {
  // Log del error para debugging
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Errores de validación de express-validator
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Datos de validación inválidos',
      details: err.errors
    });
  }

  // Errores de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Error de validación de base de datos',
      details: err.errors.map(e => e.message)
    });
  }

  // Errores de JWT - Token inválido
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  // Errores de JWT - Token expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado'
    });
  }

  // Errores de Multer (upload de archivos)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Archivo excede el tamaño máximo de 5MB'
      });
    }
    return res.status(400).json({
      error: 'Error al subir archivo'
    });
  }

  // Error de conexión a base de datos
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Servicio temporalmente no disponible'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message
  });
};

module.exports = errorHandler;
