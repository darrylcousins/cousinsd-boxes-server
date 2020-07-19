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
  }, {});
  BoxProduct.associate = function(models) {
    // associations can be defined here
    BoxProduct.belongsTo(models.Box);
    BoxProduct.belongsTo(models.Product);
  };
  return BoxProduct;
};

