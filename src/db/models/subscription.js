'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    current_cart: {
      type: DataTypes.JSONB,
    },
    last_cart: {
      type: DataTypes.JSONB,
    },
    startedAt: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  }, {});
  Subscription.associate = function(models) {
    // associations can be defined here
    Subscription.belongsTo(models.Subscriber);
    Subscription.belongsTo(models.SubscriptionType);
    Subscription.hasMany(models.Order);
  };
  return Subscription;
};
