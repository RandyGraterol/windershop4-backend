/**
 * Punto de entrada del servidor
 * 
 * Este archivo:
 * - Carga las variables de entorno
 * - Importa la aplicación Express configurada
 * - Sincroniza la base de datos con Sequelize
 * - Ejecuta el seeding de datos iniciales
 * - Inicia el servidor HTTP
 * - Maneja errores de inicialización
 */

require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const seedInitialData = require('./src/seeders/initialData');

// Obtener puerto de variable de entorno o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

/**
 * Función asíncrona para iniciar el servidor
 * 
 * Pasos:
 * 1. Sincronizar esquema de base de datos
 * 2. Ejecutar seeding de datos iniciales
 * 3. Iniciar servidor HTTP
 * 4. Manejar errores de inicialización
 */
async function startServer() {
  try {
    // Sincronizar base de datos
    console.log('Sincronizando base de datos...');
    await sequelize.sync();
    console.log('Base de datos sincronizada correctamente');

    // Ejecutar seeding de datos iniciales
    console.log('Ejecutando seeding de datos iniciales...');
    await seedInitialData();
    console.log('Datos iniciales cargados correctamente');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor iniciado exitosamente`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n✅ El servidor está listo para recibir peticiones\n`);
    });
  } catch (error) {
    // Manejar errores de inicialización
    console.error('❌ Error al iniciar el servidor:');
    console.error(error);
    process.exit(1);
  }
}

// Llamar a la función de inicio
startServer();
