  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Boxes', 
      [
  {
    "shopify_title": "Small Vege - Seasonal Organic Box",
    "shopify_handle": "small-seasonal-vege-box",
    "shopify_variant_id": "31712538263610",
    "shopify_price": 2500,
    "ShopifyBoxId": "1",
    "delivered": "2020-08-01T00:00:00.000Z",
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    "shopify_title": "Medium Vege - Seasonal Organic Box",
    "shopify_handle": "medium-seasonal-vege-box",
    "shopify_variant_id": "31712536330298",
    "shopify_price": 3500,
    "ShopifyBoxId": "2",
    "delivered": "2020-08-01T00:00:00.000Z",
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    "shopify_title": "Large Vege -Seasonal Organic Box",
    "shopify_handle": "copy-of-medium-seasonal-vege-box",
    "shopify_variant_id": "31712535314490",
    "shopify_price": 5000,
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
  
