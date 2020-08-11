const fs = require('fs');

const LABELKEYS = [
  'Delivery Date', 
  'Including', 
  'Add on items', 
  'Removed items', 
  'Subscription',
  'Add on product to',
  'ShopID',
];

/* helpers */
const arrayAdd = (arr, value) => {
  if (!arr.includes(value)) arr.push(value);
  return arr;
};

const getTotalPrice = (items) => {
  let price = 0;
  items.forEach((el) => {
    price += el.quantity * el.price;
  });
  return price;
};

const getQuantities = (items, addons) => {
  let quantities = [];
  items.forEach((el) => {
    if (addons.indexOf(el.handle) > -1) {
      quantities.push({
        handle: el.handle,
        quantity: el.quantity,
        variant_id: el.shopify_variant_id
      });
    }
  });
  return quantities;
};

const savePayload = (payload) => {
  fs.appendFile('order.json', JSON.stringify(payload, null, 2), function (err) {
    if (err) console.log('Error saving json to file');
    console.log('Saved!');
  });
};

const toHandle = (title) => title.replace(/ /g, '-').toLowerCase();

const numberedStringToHandle = (str) => {
  // e.g. 'Baby Kale (2)' => 'baby-kale' 
  str = str.trim();
  const match = str.match(/\(\d+\)$/);
  if (match) {
    str = str.slice(0, match.index).trim();
  }
  return str.replace(/ /g, '-').toLowerCase();
};

/* deal with a list of strings say: 'Baby Kale (2)' => baby-kale' */
const listOfToArray = (arr) => arr.split(',')
  .map((el) =>  numberedStringToHandle(el))
  .filter((el) => el !== '')
  .map((el) => toHandle(el));

module.exports = {
  LABELKEYS,
  toHandle,
  numberedStringToHandle,
  listOfToArray,
  arrayAdd,
  getTotalPrice,
  getQuantities
};

