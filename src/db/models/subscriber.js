'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscriber = sequelize.define('Subscriber', {
    shopify_customer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
  }, {});
  Subscriber.associate = function(models) {
    // associations can be defined here
    Subscriber.hasMany(models.Order);
    Subscriber.hasMany(models.Subscription);
  };
  return Subscriber;
};
