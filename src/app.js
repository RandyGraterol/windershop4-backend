const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar middleware de manejo de errores
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const whatsappRoutes = require('./routes/whatsapp');

/**
 * Configuración principal de la aplicación Express
 * 
 * Este archivo configura todos los middleware necesarios para el backend:
 * - Soporte para proxy reverso (producción)
 * - Parseo de JSON y URL-encoded
 * - CORS para permitir requests del frontend
 * - Servicio de archivos estáticos para imágenes
 * - Rutas de la API
 * - Manejo centralizado de errores
 * 
 * Entornos soportados:
 * - Local: http://localhost:3000
 * - Producción: https://rifaslsv.com/backendwinder/
 */

const app = express();

// ==========================================
// Configuración de Proxy (Producción)
// ==========================================
// Detectar si estamos detrás de un proxy
const BASE_PATH = process.env.BASE_PATH || '';
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy - necesario para obtener la IP real del cliente detrás del proxy
if (isProduction) {
  app.set('trust proxy', 1);
}

// ==========================================
// Middleware de Parseo
// ==========================================
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// ==========================================
// Configuración CORS
// ==========================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:8080',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !isProduction) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// ==========================================
// Archivos Estáticos (Uploads)
// ==========================================
// Middleware CORS para archivos estáticos
const uploadsPath = `${BASE_PATH}/uploads`;

app.use(uploadsPath, (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 año
  next();
});

// Servir archivos estáticos
app.use(uploadsPath, express.static(path.join(__dirname, '../uploads')));

// ==========================================
// Rutas de la API
// ==========================================
const apiPath = `${BASE_PATH}/api`;

app.use(`${apiPath}/auth`, authRoutes);
app.use(`${apiPath}/products`, productRoutes);
app.use(`${apiPath}/whatsapp`, whatsappRoutes);

// ==========================================
// Health Check
// ==========================================
app.get(`${BASE_PATH}/health`, (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    basePath: BASE_PATH || '/',
    proxy: isProduction ? 'enabled' : 'disabled'
  });
});

// Ruta raíz para verificar que el servidor está funcionando
app.get(BASE_PATH || '/', (req, res) => {
  res.json({
    message: 'Windershop4 API',
    version: '1.0.0',
    endpoints: {
      health: `${BASE_PATH}/health`,
      api: `${apiPath}`,
      uploads: `${uploadsPath}`
    }
  });
});

// ==========================================
// Manejo de Errores
// ==========================================
app.use(errorHandler);

module.exports = app;
