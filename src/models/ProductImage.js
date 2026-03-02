const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductImage = sequelize.define('ProductImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `/uploads/${this.filename}`;
      }
    }
  }, {
    timestamps: true
  });

  // Relación belongsTo con Product se configurará en models/index.js
  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: 'productId'
    });
  };

  return ProductImage;
};
