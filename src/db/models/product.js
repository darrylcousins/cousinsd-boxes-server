'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    shopify_title: {
      type: DataTypes.STRING,
    },
    shopify_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shopify_handle: {
      type: DataTypes.STRING,
    },
    shopify_variant_id: {
      type: DataTypes.BIGINT,
    },
    shopify_price: {
      type: DataTypes.INTEGER,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: '0',
    },
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    //Product.belongsToMany(models.Box, { through: models.BoxProduct, unique: false });
    Product.belongsToMany(models.Box, { through: 'BoxProduct', unique: false });
    //Product.hasMany(models.BoxProduct);
  };
  Product.prototype.getShopifyGid = function() {
    return`gid://shopify/Product/${this.shopify_id}`;
  };
  Product.prototype.getIsAddOn = function() {
    if (this.BoxProduct) return this.BoxProduct.isAddOn;
    return null;
  };
  return Product;
};
