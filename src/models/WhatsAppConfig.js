const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WhatsAppConfig = sequelize.define('WhatsAppConfig', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\+?[0-9]+$/
      }
    }
  }, {
    timestamps: true
  });

  return WhatsAppConfig;
};
