'use strict';
const { Product } = require('./product');
const { Box } = require('./box');
/* https://sequelize.org/master/manual/advanced-many-to-many.html#many-to-many-to-many-relationships-and-beyond */
module.exports = (sequelize, DataTypes) => {
  const BoxProduct = sequelize.define('BoxProduct', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    isAddOn: {
      type: DataTypes.BOOLEAN,
      defaultValue: '0',
    },
    BoxId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "BoxId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      references: {
          model: "Boxes",
          key: "id"
      },
      unique: 'compositeIndex',
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ProductId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      references: {
          model: "Products",
          key: "id"
      },
      unique: "compositeIndex",
    }
  }, {});
  BoxProduct.associate = function(models) {
    // associations can be defined here
    //BoxProduct.hasMany(models.Box, { foreignKey: 'BoxId', targetKey: 'id', as: 'Box' });
    //BoxProduct.hasMany(models.Product, { foreignKey: 'ProductId', targetKey: 'id', as: 'Product' });
  };
  return BoxProduct;
};

