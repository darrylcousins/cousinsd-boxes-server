  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Boxes', 
      [
  {
    "ShopifyBoxId": "1",
    "delivered": "2020-08-01T00:00:00.000Z",
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    "ShopifyBoxId": "2",
    "delivered": "2020-08-01T00:00:00.000Z",
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    "ShopifyBoxId": "3",
    "delivered": "2020-08-01T00:00:00.000Z",
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
]
      , {});
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Boxes', null, {});
    }
  };
  
