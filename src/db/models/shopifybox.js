'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShopifyBox = sequelize.define('ShopifyBox', {
    shopify_product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
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
  }, {});
  ShopifyBox.associate = function(models) {
    // associations can be defined here
    ShopifyBox.hasMany(models.Box);
    ShopifyBox.hasMany(models.SubscriptionType);
  };
  ShopifyBox.prototype.getShopifyGid = function() {
    return`gid://shopify/Product/${this.shopify_product_id}`;
  };
  return ShopifyBox;
};

