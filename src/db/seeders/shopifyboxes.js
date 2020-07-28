  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('ShopifyBoxes', 
      [
  {
    "shopify_product_id": "4486431866938",
    "shopify_title": "Small Vege - Seasonal Organic Box",
    "shopify_handle": "small-seasonal-vege-box",
    "shopify_variant_id": "31712538263610",
    "shopify_price": 2500,
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    "shopify_product_id": "4486431899706",
    "shopify_title": "Medium Vege - Seasonal Organic Box",
    "shopify_handle": "medium-seasonal-vege-box",
    "shopify_variant_id": "31712536330298",
    "shopify_price": 3500,
    "createdAt": "2020-07-04T11:52:59.777Z",
    "updatedAt": "2020-07-17T04:32:06.636Z"
  },
  {
    "shopify_title": "Large Vege -Seasonal Organic Box",
    "shopify_handle": "copy-of-medium-seasonal-vege-box",
    "shopify_variant_id": "31712535314490",
    "shopify_price": 5000,
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
  

