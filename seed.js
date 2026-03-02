/**
 * Script independiente para ejecutar el seeding de datos iniciales
 * 
 * Uso:
 *   npm run seed        - Ejecuta el seeding sin resetear la BD
 *   npm run seed:fresh  - Elimina la BD y ejecuta el seeding desde cero
 */

const { sequelize } = require('./src/models');
const seedInitialData = require('./src/seeders/initialData');

async function runSeed() {
  try {
    console.log('🌱 Iniciando seeding de datos...\n');
    
    // Sincronizar base de datos
    await sequelize.sync({ force: false });
    
    // Ejecutar seeder
    await seedInitialData();
    
    console.log('\n✅ Seeding completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el seeding:', error);
    process.exit(1);
  }
}

runSeed();
