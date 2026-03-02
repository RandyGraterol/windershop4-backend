const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    sizes: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    colors: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

  // Relación hasMany con ProductImage se configurará en models/index.js
  Product.associate = (models) => {
    Product.hasMany(models.ProductImage, {
      foreignKey: 'productId',
      as: 'images',
      onDelete: 'CASCADE'
    });
  };

  return Product;
};
