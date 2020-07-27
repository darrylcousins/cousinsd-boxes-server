'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscriber = sequelize.define('Subscriber', {
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
  }, {});
  Subscriber.associate = function(models) {
    // associations can be defined here
    Subscriber.hasMany(models.Subscription);
    Subscriber.belongsTo(models.Customer);
  };
  return Subscriber;
};
