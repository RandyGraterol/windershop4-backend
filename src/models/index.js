/**
 * Inicialización de Sequelize y modelos
 * 
 * Este archivo:
 * - Carga la configuración de base de datos
 * - Inicializa la instancia de Sequelize
 * - Importa y registra todos los modelos
 * - Establece las relaciones entre modelos
 * - Exporta la instancia de sequelize y todos los modelos
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Crear instancia de Sequelize con la configuración
const sequelize = new Sequelize(config);

// Objeto para almacenar todos los modelos
const db = {};

// Importar modelos
db.User = require('./User')(sequelize);
db.Product = require('./Product')(sequelize);
db.ProductImage = require('./ProductImage')(sequelize);
db.WhatsAppConfig = require('./WhatsAppConfig')(sequelize);

// Establecer relaciones entre modelos
// Llamar al método associate de cada modelo si existe
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Exportar instancia de sequelize, clase Sequelize y modelos
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
