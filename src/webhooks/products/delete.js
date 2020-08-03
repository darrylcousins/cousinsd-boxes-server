const { Op } = require("sequelize");
const models = require('../../db/models');

const productDelete = async (webhook) => {
  const payload = webhook.payload; // the product.shopify_id
  console.log('Received Delete Product:', payload);

  const product = await models.Product.findOne({
    where: { shopify_id: payload.id}
  });
  if (product) {
    models.Product.destroy(
      { where: { shopify_id: parseInt(payload.id) } }
    ).then((value) => console.log('deleted product', value))
      .catch((error) => console.log('got error', error)
    );
  };
  const shopifyBox = await models.ShopifyBox.findOne({
    where: { shopify_product_id: payload.id}
  });
  if (shopifyBox) {
    models.ShopifyBox.destroy(
      { where: { shopify_product_id: parseInt(payload.id) } }
    ).then((value) => console.log('deleted shopify box', value))
      .catch((error) => console.log('got error', error)
    );
  };
};

module.exports = productDelete;

