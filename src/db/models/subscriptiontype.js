'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubscriptionType = sequelize.define('SubscriptionType', {
    title: {
      type: DataTypes.STRING, // legible title of type 'Weekly' etc
    },
    description: {
      type: DataTypes.TEXT, // days
    },
    duration: {
      type: DataTypes.INTEGER, // days
    },
    frequency: {
      type: DataTypes.INTEGER, // days
    },
    discount: {
      type: DataTypes.INTEGER, // percent
    },
  }, {});
  SubscriptionType.associate = function(models) {
    // associations can be defined here
    SubscriptionType.hasMany(models.Subscription);
    SubscriptionType.belongsTo(models.ShopifyBox);
  };
  return SubscriptionType;
};

