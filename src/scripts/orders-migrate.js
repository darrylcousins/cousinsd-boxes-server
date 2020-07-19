'use-strict'
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const db = require('../db/models');

/* this is a migration file from older database
 * collect all orders and orders and write to file
 * as a seeder file
 */

(async function(){
  const Order = db['Order'];
  const orders = await Order.findAll({order: ['shopify_order_id']});

  const allOrders = orders.map(el => {
    el.delivered = new Date(Date.parse('Aug 01 2020'));
    const json = el.toJSON();
    delete json.ShopId;
    delete json.id;
    return json;
  });


  const template = `
  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Orders', ${JSON.stringify(allOrders, null, 2)}, {});
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Orders', null, {});
    }
  };
  `;

  const target = path.join(__dirname, '/../db/seeders/orders.js');
  fs.writeFile(target, template, (err) => {
    if (err) {
      console.log("An error occured while writing orders to file.");
      return console.log(err);
    }
    console.log("Orders seeder file has been saved.");
  });
})();
