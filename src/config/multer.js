const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp-random-originalname
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const originalName = file.originalname;
    const uniqueFilename = `${timestamp}-${randomString}-${originalName}`;
    cb(null, uniqueFilename);
  }
});

// Filtro para aceptar solo JPEG, PNG y WebP
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no permitido. Solo se aceptan JPEG, PNG y WebP'), false);
  }
};

// Configuración de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB en bytes
  }
});

module.exports = upload;
