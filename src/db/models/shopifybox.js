'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShopifyBox = sequelize.define('ShopifyBox', {
    shopify_product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
  }, {});
  ShopifyBox.associate = function(models) {
    // associations can be defined here
    ShopifyBox.hasMany(models.Box);
    ShopifyBox.hasMany(models.SubscriptionType);
    ShopifyBox.hasMany(models.Order);
  };
  return ShopifyBox;
};

