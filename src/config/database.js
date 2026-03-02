/**
 * Configuración de Sequelize para SQLite
 * 
 * Este archivo configura la conexión a la base de datos SQLite
 * con opciones apropiadas de logging y pool de conexiones.
 */

module.exports = {
  // Dialect de la base de datos
  dialect: 'sqlite',
  
  // Ruta del archivo de base de datos SQLite
  // Usa DATABASE_PATH del entorno o './database.sqlite' por defecto
  storage: process.env.DATABASE_PATH || './database.sqlite',
  
  // Configuración de logging
  // En desarrollo: muestra queries SQL en consola
  // En producción: desactiva logging para mejor rendimiento
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Configuración del pool de conexiones
  // SQLite es single-threaded, por lo que usamos configuración conservadora
  pool: {
    max: 5,        // Máximo de conexiones en el pool
    min: 0,        // Mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo (ms) para obtener conexión antes de error
    idle: 10000    // Tiempo máximo (ms) que una conexión puede estar inactiva antes de ser liberada
  },
  
  // Opciones adicionales de Sequelize
  define: {
    // Usar timestamps por defecto (createdAt, updatedAt)
    timestamps: true,
    
    // Usar snake_case para nombres de tablas generados automáticamente
    underscored: false,
    
    // No pluralizar nombres de tablas automáticamente
    freezeTableName: false
  }
}
