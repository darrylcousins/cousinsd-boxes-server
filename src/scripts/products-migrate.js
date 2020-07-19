'use-strict'
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const db = require('../models');

/* this is a migration file from older database
 * collect all products and orders and write to file
 * as a seeder file
 */

(async function(){
  const Product = db['Product'];
  const products = await Product.findAll({order: ['title']});

  const allProducts = products.map(el => {
    const json = el.toJSON();
    delete json.ShopId;
    delete json.id;
    return json;
  });

  const template = `
  'use strict';
  module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Products', ${JSON.stringify(allProducts, null, 2)}, {});
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Products', null, {});
    }
  };
  `;

  const target = path.join(__dirname, '/../seeders/products.js');
  fs.writeFile(target, template, (err) => {
    if (err) {
      console.log("An error occured while writing products to file.");
      return console.log(err);
    }
    console.log("Products seeder file has been saved.");
  });
})();
