'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubscriptionType = sequelize.define('SubscriptionType', {
    duration: {
      type: DataTypes.INTEGER, // days
    },
    frequency: {
      type: DataTypes.INTEGER, // days
    },
  }, {});
  SubscriptionType.associate = function(models) {
    // associations can be defined here
    SubscriptionType.hasMany(models.Subscription);
    SubscriptionType.belongsToMany(models.Box, { through: 'BoxSubscriptionTypes' });
    SubscriptionType.belongsTo(models.ShopifyBox);
  };
  return SubscriptionType;
};

