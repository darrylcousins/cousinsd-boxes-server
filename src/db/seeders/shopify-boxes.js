  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('ShopifyBoxes', 
      [
  {
    // small
    "id": "1",
    "shopify_product_id": "4486431866938",
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    // medium
    "id": "2",
    "shopify_product_id": "4486431899706",
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    // large
    "id": "3",
    "shopify_product_id": "4486431703098",
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
]
      , {});
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('ShopifyBoxes', null, {});
    }
  };
  

