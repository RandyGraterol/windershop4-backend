const express = require('express');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateProduct, handleValidationErrors } = require('../middleware/validation');
const { getAll, create, update, deleteProduct } = require('../controllers/productController');

/**
 * Router de productos
 * 
 * Define las rutas para gestión de productos (CRUD).
 * Incluye autenticación JWT para operaciones protegidas,
 * validación de entrada y manejo de archivos con Multer.
 */

const router = express.Router();

/**
 * GET /
 * 
 * Obtiene lista de todos los productos con sus imágenes
 * Endpoint público (no requiere autenticación)
 * 
 * Response 200:
 * [
 *   {
 *     "id": number,
 *     "name": "string",
 *     "price": number,
 *     "createdAt": "string",
 *     "images": [
 *       {
 *         "id": number,
 *         "url": "string",
 *         "filename": "string"
 *       }
 *     ]
 *   }
 * ]
 */
router.get('/', getAll);

/**
 * POST /
 * 
 * Crea un nuevo producto con imágenes
 * Endpoint protegido (requiere autenticación JWT)
 * 
 * Headers:
 * - Authorization: Bearer <token>
 * 
 * Request Body (multipart/form-data):
 * - name: string (requerido, 3-100 caracteres)
 * - price: number (requerido, >= 0)
 * - images: File[] (requerido, mínimo 1, máximo 5MB cada uno)
 * 
 * Response 201:
 * {
 *   "id": number,
 *   "name": "string",
 *   "price": number,
 *   "createdAt": "string",
 *   "images": [...]
 * }
 * 
 * Response 400:
 * {
 *   "error": "Datos de validación inválidos",
 *   "details": ["campo: mensaje de error"]
 * }
 * 
 * Response 401:
 * {
 *   "error": "Token no proporcionado" | "Token inválido"
 * }
 */
router.post('/', verifyToken, upload, validateProduct, handleValidationErrors, create);

/**
 * PUT /:id
 * 
 * Actualiza un producto existente
 * Endpoint protegido (requiere autenticación JWT)
 * 
 * Headers:
 * - Authorization: Bearer <token>
 * 
 * Request Body (multipart/form-data):
 * - name: string (opcional, 3-100 caracteres)
 * - price: number (opcional, >= 0)
 * - images: File[] (opcional, nuevas imágenes a agregar)
 * - removeImages: number[] (opcional, IDs de imágenes a eliminar)
 * 
 * Response 200:
 * {
 *   "id": number,
 *   "name": "string",
 *   "price": number,
 *   "updatedAt": "string",
 *   "images": [...]
 * }
 * 
 * Response 400:
 * {
 *   "error": "El producto debe mantener al menos una imagen"
 * }
 * 
 * Response 404:
 * {
 *   "error": "Producto no encontrado"
 * }
 * 
 * Response 401:
 * {
 *   "error": "Token no proporcionado" | "Token inválido"
 * }
 */
router.put('/:id', verifyToken, upload, validateProduct, handleValidationErrors, update);

/**
 * DELETE /:id
 * 
 * Elimina un producto y todas sus imágenes
 * Endpoint protegido (requiere autenticación JWT)
 * 
 * Headers:
 * - Authorization: Bearer <token>
 * 
 * Response 200:
 * {
 *   "message": "Producto eliminado exitosamente"
 * }
 * 
 * Response 404:
 * {
 *   "error": "Producto no encontrado"
 * }
 * 
 * Response 401:
 * {
 *   "error": "Token no proporcionado" | "Token inválido"
 * }
 */
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
