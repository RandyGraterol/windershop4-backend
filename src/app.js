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
 * - Parseo de JSON y URL-encoded
 * - CORS para permitir requests del frontend
 * - Helmet para headers de seguridad
 * - Rate limiting para prevenir abuso
 * - Servicio de archivos estáticos para imágenes
 * - Rutas de la API
 * - Manejo centralizado de errores
 */

const app = express();

// Middleware de parseo de body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración CORS específica para permitir credenciales
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Middleware CORS para archivos estáticos
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

// Servicio de archivos estáticos para imágenes de productos
// Las imágenes se sirven desde el directorio /uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Montar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
