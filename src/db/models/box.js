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
    //Box.hasMany(models.BoxProduct);
    //Box.belongsToMany(models.Product, { through: models.BoxProduct, unique: false });
    Box.belongsToMany(models.Product, { through: 'BoxProduct', unique: false });
    Box.belongsTo(models.ShopifyBox);
  };
  Box.prototype.getProducts = function() {
    if (!this.Products) return [];
    return this.Products.filter(product => !product.BoxProduct.isAddOn);
  };
  Box.prototype.getAddOnProducts = function() {
    if (!this.Products) return [];
    return this.Products.filter(product => product.BoxProduct.isAddOn);
  };
  Box.prototype.getShopifyId = function() {
    return this.ShopifyBox.shopify_product_id;
  };
  Box.prototype.getShopifyGid = function() {
    return`gid://shopify/Product/${this.getShopifyId()}`;
  };
  return Box;
};
