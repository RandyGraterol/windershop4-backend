/**
 * Seeder de datos iniciales
 * 
 * Este archivo crea los datos iniciales necesarios para el funcionamiento del sistema:
 * - Usuario administrador predefinido
 * - Configuración de WhatsApp por defecto
 * - Productos de ejemplo para la tienda
 * 
 * Se ejecuta automáticamente al iniciar el servidor
 */

const { User, WhatsAppConfig, Product, ProductImage } = require('../models');

/**
 * Función principal de seeding
 * 
 * Crea el usuario admin y la configuración de WhatsApp si no existen
 * Es idempotente: puede ejecutarse múltiples veces sin duplicar datos
 */
async function seedInitialData() {
  try {
    // Crear usuario administrador si no existe
    const [admin, adminCreated] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        password: 'admin123' // El hook beforeCreate lo hasheará automáticamente
      }
    });

    if (adminCreated) {
      console.log('✅ Usuario administrador creado: admin / admin123');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }

    // Crear configuración de WhatsApp por defecto si no existe
    const [whatsappConfig, whatsappCreated] = await WhatsAppConfig.findOrCreate({
      where: { id: 1 },
      defaults: {
        phoneNumber: '+1234567890'
      }
    });

    if (whatsappCreated) {
      console.log('✅ Configuración de WhatsApp creada con número por defecto: +1234567890');
    } else {
      console.log('ℹ️  Configuración de WhatsApp ya existe');
    }

    // Crear productos de ejemplo si no existen
    const productsData = [
      {
        name: 'Camisa Clásica Oxford',
        price: 49.99,
        category: 'Camisas',
        description: 'Camisa elegante de corte clásico, perfecta para ocasiones formales. Confeccionada en algodón de alta calidad con acabados premium.',
        sizes: 'S,M,L,XL',
        colors: 'Blanco,Azul,Negro',
        featured: true,
        images: ['/uploads/placeholder-1.jpg', '/uploads/placeholder-2.jpg']
      },
      {
        name: 'Polo Deportivo Premium',
        price: 39.99,
        category: 'Polos',
        description: 'Polo deportivo de tela transpirable con tecnología de secado rápido. Ideal para actividades casuales y deportivas.',
        sizes: 'M,L,XL',
        colors: 'Negro,Gris,Azul,Verde',
        featured: true,
        images: ['/uploads/placeholder-3.jpg']
      },
      {
        name: 'Camiseta Básica Cotton',
        price: 29.99,
        category: 'Camisetas',
        description: 'Camiseta básica de algodón 100% suave y cómoda. Un esencial para tu guardarropa diario.',
        sizes: 'S,M,L,XL',
        colors: 'Blanco,Negro,Gris',
        featured: false,
        images: ['/uploads/placeholder-4.jpg', '/uploads/placeholder-5.jpg']
      },
      {
        name: 'Camisa Lino Verano',
        price: 59.99,
        category: 'Camisas',
        description: 'Camisa de lino ligera y fresca, perfecta para los días calurosos. Estilo relajado con máxima comodidad.',
        sizes: 'M,L,XL',
        colors: 'Blanco,Beige,Azul Claro',
        featured: true,
        images: ['/uploads/placeholder-6.jpg']
      },
      {
        name: 'Polo Rayas Náutico',
        price: 44.99,
        category: 'Polos',
        description: 'Polo con diseño de rayas náuticas, estilo casual elegante. Confeccionado en algodón piqué de primera calidad.',
        sizes: 'S,M,L',
        colors: 'Azul,Rojo,Verde',
        featured: false,
        images: ['/uploads/placeholder-7.jpg', '/uploads/placeholder-8.jpg']
      },
      {
        name: 'Camiseta Estampada Urban',
        price: 34.99,
        category: 'Camisetas',
        description: 'Camiseta con estampado moderno y urbano. Diseño exclusivo que combina estilo y comodidad.',
        sizes: 'S,M,L,XL',
        colors: 'Negro,Gris,Blanco',
        featured: false,
        images: ['/uploads/placeholder-9.jpg']
      },
      {
        name: 'Camisa Slim Fit Ejecutiva',
        price: 69.99,
        category: 'Camisas',
        description: 'Camisa de corte slim fit para el profesional moderno. Tela antiarrugas con cuello italiano.',
        sizes: 'S,M,L,XL',
        colors: 'Blanco,Azul,Negro,Gris',
        featured: true,
        images: ['/uploads/placeholder-10.jpg', '/uploads/placeholder-11.jpg']
      },
      {
        name: 'Polo Manga Larga Casual',
        price: 54.99,
        category: 'Polos',
        description: 'Polo de manga larga ideal para climas frescos. Combina elegancia casual con funcionalidad.',
        sizes: 'M,L,XL',
        colors: 'Negro,Azul Marino,Gris',
        featured: false,
        images: ['/uploads/placeholder-12.jpg']
      }
    ];

    let productsCreated = 0;
    let productsExisting = 0;

    for (const productData of productsData) {
      const { images, ...productFields } = productData;
      
      const [product, created] = await Product.findOrCreate({
        where: { name: productData.name },
        defaults: productFields
      });

      if (created) {
        // Crear imágenes para el producto
        const imageData = images.map(imagePath => ({
          productId: product.id,
          filename: imagePath.replace('/uploads/', '')
        }));
        
        await ProductImage.bulkCreate(imageData);
        productsCreated++;
      } else {
        productsExisting++;
      }
    }

    if (productsCreated > 0) {
      console.log(`✅ ${productsCreated} productos de ejemplo creados`);
    }
    if (productsExisting > 0) {
      console.log(`ℹ️  ${productsExisting} productos ya existían`);
    }

  } catch (error) {
    console.error('❌ Error al ejecutar seeding de datos iniciales:');
    throw error;
  }
}

module.exports = seedInitialData;
