const upload = require('../config/multer');

// Exportar configuración de Multer para array de imágenes
// Permite hasta 10 imágenes por request con el campo 'images'
module.exports = upload.array('images', 10);
