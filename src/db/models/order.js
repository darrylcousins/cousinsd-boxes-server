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
    // associations can be defined here
    Order.belongsTo(models.Box),
    Order.belongsTo(models.Subscriber);
    Order.belongsTo(models.ShopifyBox); // XXX if no subscription
    Order.belongsTo(models.Subscription,
      {
        foreignKey: { allowNull: true },
        onDelete: 'SET NULL',
      }
    );
  };
  return Order;
};

