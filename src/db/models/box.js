'use strict';
module.exports = (sequelize, DataTypes) => {
  const Box = sequelize.define('Box', {
    shopify_handle: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    shopify_title: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    shopify_variant_id: {
      type: DataTypes.BIGINT,
      unique: 'compositeIndex',
    },
    shopify_price: {
      type: DataTypes.INTEGER,
    },
    delivered: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      unique: 'compositeIndex',
    },
  }, {});
  Box.associate = function(models) {
    // associations can be defined here
    //Box.belongsToMany(models.Subscription, { through: 'BoxSubscription', targetKey: 'shopify_product_id' });
    Box.hasMany(models.Order);
    Box.hasMany(models.BoxProduct);
    Box.belongsToMany(models.Product, { through: models.BoxProduct });
    Box.belongsTo(models.ShopifyBox);
  };
  return Box;
};
