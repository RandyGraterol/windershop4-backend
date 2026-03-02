/**
 * Controlador de productos
 * 
 * Maneja las operaciones CRUD de productos:
 * - getAll: Listar todos los productos con sus imágenes
 * - create: Crear nuevo producto con imágenes
 * - update: Actualizar producto existente
 * - delete: Eliminar producto y sus imágenes
 */

const { Product, ProductImage } = require('../models');
const { deleteMultipleFiles } = require('../utils/fileManager');

/**
 * Obtener todos los productos
 * 
 * Retorna lista de productos con sus imágenes asociadas,
 * ordenados por fecha de creación descendente.
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * @returns {Promise<void>}
 * 
 * Requisitos: 3.1, 3.2, 3.3, 3.5
 */
const getAll = async (req, res, next) => {
  try {
    // Buscar todos los productos con sus imágenes
    const products = await Product.findAll({
      include: [
        {
          model: ProductImage,
          as: 'images'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Convertir IDs a string para consistencia con frontend
    const productsWithStringIds = products.map(product => {
      const productData = product.toJSON();
      return {
        ...productData,
        id: productData.id.toString()
      };
    });

    // Retornar array de productos (vacío si no hay productos)
    res.status(200).json(productsWithStringIds);
  } catch (error) {
    // Pasar error al middleware de manejo de errores
    next(error);
  }
};

/**
 * Crear nuevo producto
 * 
 * Crea un producto con nombre, precio e imágenes.
 * Valida que existan todos los campos requeridos.
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * @returns {Promise<void>}
 * 
 * Requisitos: 2.1, 2.2, 2.4, 2.5
 */
const create = async (req, res, next) => {
  try {
    // Extraer datos del request
    const { name, price, category, description, sizes, colors, featured } = req.body;
    const files = req.files || [];

    // Validar que existan name, price y al menos una imagen
    if (!name || !price || files.length === 0) {
      return res.status(400).json({
        error: 'Datos incompletos',
        details: [
          !name && 'El nombre es requerido',
          !price && 'El precio es requerido',
          files.length === 0 && 'Se requiere al menos una imagen'
        ].filter(Boolean)
      });
    }

    // Crear producto en base de datos
    const product = await Product.create({
      name,
      price,
      category: category || '',
      description: description || '',
      sizes: sizes || '',
      colors: colors || '',
      featured: featured !== undefined ? featured : false
    });

    // Preparar datos de imágenes para bulkCreate
    const imageData = files.map(file => ({
      productId: product.id,
      filename: file.filename
    }));

    // Guardar imágenes en base de datos
    await ProductImage.bulkCreate(imageData);

    // Buscar producto creado con imágenes incluidas
    const productWithImages = await Product.findByPk(product.id, {
      include: [
        {
          model: ProductImage,
          as: 'images'
        }
      ]
    });

    // Convertir ID a string para consistencia con frontend
    const productData = productWithImages.toJSON();
    const productWithStringId = {
      ...productData,
      id: productData.id.toString()
    };

    // Retornar producto creado con código 201
    res.status(201).json(productWithStringId);
  } catch (error) {
    // Pasar error al middleware de manejo de errores
    next(error);
  }
};

/**
 * Actualizar producto existente
 * 
 * Actualiza nombre, precio y/o imágenes de un producto.
 * Permite agregar nuevas imágenes y eliminar imágenes existentes.
 * Valida que el producto mantenga al menos una imagen.
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * @returns {Promise<void>}
 * 
 * Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */
const update = async (req, res, next) => {
  try {
    // Extraer id de los parámetros
    const { id } = req.params;
    
    // Extraer datos del request body
    const { name, price, category, description, sizes, colors, featured, removeImages } = req.body;
    
    // Extraer archivos nuevos si existen
    const files = req.files || [];

    // Buscar producto con sus imágenes
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductImage,
          as: 'images'
        }
      ]
    });

    // Si no existe, retornar 404
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    // Actualizar campos si se proporcionan
    if (name !== undefined) {
      product.name = name;
    }
    if (price !== undefined) {
      product.price = price;
    }
    if (category !== undefined) {
      product.category = category;
    }
    if (description !== undefined) {
      product.description = description;
    }
    if (sizes !== undefined) {
      product.sizes = sizes;
    }
    if (colors !== undefined) {
      product.colors = colors;
    }
    if (featured !== undefined) {
      product.featured = featured;
    }
    await product.save();

    // Detectar intención de reemplazo automático de imágenes
    // Si se suben nuevas imágenes Y el producto ya tiene imágenes Y no se especificó removeImages
    const shouldAutoReplace = files.length > 0 
      && product.images.length > 0 
      && (!removeImages || removeImages.length === 0);

    if (shouldAutoReplace) {
      // Obtener todos los filenames de las imágenes actuales
      const oldFilenames = product.images.map(img => img.filename);
      
      // Eliminar archivos físicos del disco
      await deleteMultipleFiles(oldFilenames);
      
      // Eliminar registros de imágenes de la base de datos
      await ProductImage.destroy({
        where: {
          productId: product.id
        }
      });
    }

    // Procesar eliminación de imágenes si se especifican
    if (removeImages && removeImages.length > 0) {
      // Parsear removeImages si viene como string
      const imageIdsToRemove = Array.isArray(removeImages) 
        ? removeImages 
        : JSON.parse(removeImages);

      // Validar que no se eliminen todas las imágenes
      const currentImageCount = product.images.length;
      const newImagesCount = files.length;
      const imagesToRemoveCount = imageIdsToRemove.length;
      const finalImageCount = currentImageCount - imagesToRemoveCount + newImagesCount;

      if (finalImageCount < 1) {
        return res.status(400).json({
          error: 'El producto debe mantener al menos una imagen'
        });
      }

      // Obtener las imágenes a eliminar
      const imagesToDelete = product.images.filter(img => 
        imageIdsToRemove.includes(img.id)
      );

      // Eliminar archivos físicos
      const filenames = imagesToDelete.map(img => img.filename);
      await deleteMultipleFiles(filenames);

      // Eliminar imágenes de la base de datos
      await ProductImage.destroy({
        where: {
          id: imageIdsToRemove
        }
      });
    }

    // Agregar nuevas imágenes si se proporcionan
    if (files.length > 0) {
      const imageData = files.map(file => ({
        productId: product.id,
        filename: file.filename
      }));

      await ProductImage.bulkCreate(imageData);
    }

    // Buscar producto actualizado con imágenes
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: ProductImage,
          as: 'images'
        }
      ]
    });

    // Convertir ID a string para consistencia con frontend
    const productData = updatedProduct.toJSON();
    const productWithStringId = {
      ...productData,
      id: productData.id.toString()
    };

    // Retornar producto actualizado con código 200
    res.status(200).json(productWithStringId);
  } catch (error) {
    // Pasar error al middleware de manejo de errores
    next(error);
  }
};

/**
 * Eliminar producto
 * 
 * Elimina un producto y todas sus imágenes asociadas.
 * Elimina los archivos físicos de las imágenes del disco.
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * @returns {Promise<void>}
 * 
 * Requisitos: 5.1, 5.2, 5.3, 5.4
 */
const deleteProduct = async (req, res, next) => {
  try {
    // Extraer id de los parámetros
    const { id } = req.params;

    // Buscar producto con sus imágenes
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductImage,
          as: 'images'
        }
      ]
    });

    // Si no existe, retornar 404
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      });
    }

    // Obtener filenames de todas las imágenes
    const filenames = product.images.map(img => img.filename);

    // Eliminar archivos físicos
    await deleteMultipleFiles(filenames);

    // Eliminar producto (cascade eliminará imágenes de BD)
    await product.destroy();

    // Retornar confirmación de eliminación exitosa
    res.status(200).json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    // Pasar error al middleware de manejo de errores
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  update,
  deleteProduct
};
