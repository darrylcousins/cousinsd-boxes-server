  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('SubscriptionTypes', 
      [
  {
    "title": "Weekly",
    "description": "Your box delivered and invoiced weekly.",
    "discount": 0,
    "duration": 0,
    "frequency": 7,
    "ShopifyBoxId": 2,
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
]
      , {});
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('SubscriptionTypes', null, {});
    }
  };
  

