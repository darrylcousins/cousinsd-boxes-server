'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    shopify_title: {
      type: DataTypes.STRING,
    },
    shopify_order_id: {
      type: DataTypes.BIGINT,
    },
    shopify_line_item_id: {
      type: DataTypes.BIGINT,
    },
  }, {});
  Order.associate = function(models) {
    Order.belongsTo(models.Box),
    Order.belongsTo(models.Customer);
  };
  return Order;
};

