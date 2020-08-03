const { Op } = require("sequelize");
const models = require('../../db/models');

const productCreate = (webhook) => {
  const payload = webhook.payload;
  console.log('Received Create Product:', payload.title, payload.product_type);

  if (payload.product_type === 'Box Produce') {
    const input = {
      shopify_title: payload.title,
      shopify_id: parseInt(payload.id),
      shopify_handle: payload.handle,
      shopify_variant_id: payload.variants[0].id,
      shopify_price: parseInt(parseFloat(payload.variants[0].price) * 100),
      available: true,
    };

    console.log(input);
    const product = models.Product.create(input)
      .then((value) => console.log('created product', value.shopify_title))
      .catch((error) => console.log('got error', error)
    );
  };
  if (payload.product_type === 'Container Box') {
    const input = {
      shopify_title: payload.title,
      shopify_product_id: parseInt(payload.id),
      shopify_handle: payload.handle,
      shopify_variant_id: payload.variants[0].id,
      shopify_price: parseInt(parseFloat(payload.variants[0].price) * 100),
    };

    console.log(input);
    const product = models.ShopifyBox.create(input)
      .then((value) => console.log('created shopify box', value.shopify_title))
      .catch((error) => console.log('got error', error)
    );
  }
};

module.exports = productCreate;
