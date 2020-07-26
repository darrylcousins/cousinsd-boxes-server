const { Op } = require("sequelize");
const models = require('../../db/models');

const productDelete = (webhook) => {
  const payload = webhook.payload; // the product.shopify_id
  console.log('Received Delete Product:', payload);
  const product = models.Product.destroy(
    { where: { shopify_id: parseInt(payload.id) } }
  ).then((value) => console.log('deleted product', value))
    .catch((error) => console.log('got error', error)
  );
};

module.exports = productDelete;

