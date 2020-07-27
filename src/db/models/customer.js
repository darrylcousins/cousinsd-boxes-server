'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    shopify_customer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
  }, {});
  Customer.associate = function(models) {
    // associations can be defined here
    Customer.hasMany(models.Order);
  };
  return Customer;
};

