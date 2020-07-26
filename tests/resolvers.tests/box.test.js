const { Op } = require("sequelize");
const { BoxQueries } = require('../../src/graphql/queries');
const BoxResolvers = require('../../src/graphql/resolvers/box');
const BoxProductResolvers = require('../../src/graphql/resolvers/boxproduct');
const { mockResolveInfo, UTCDateOnly } = require('../../src/lib');
const models = require('../../src/db/models');
const { createBox } = require('./../config/initdb');

afterAll(() => {
  return models.sequelize.drop();
});

beforeAll(() => {
  return models.sequelize.sync()
    .then(() => createBox());
});


test('resolvers: getAllBoxes', async () => {
  const query = BoxQueries.getAllBoxes;
  const info = mockResolveInfo(query);
  const data = await BoxResolvers.Query.getAllBoxes(null, {}, { models }, info);
  const box = data[0];
  expect(box.Products.length).toBe(2);
  expect(box.ShopifyBox.shopify_product_id).not.toBe(undefined);

  const products = await BoxResolvers.Box.products(box);
  const addOnProducts = await BoxResolvers.Box.addOnProducts(box);
  const shopify_product_id = await BoxResolvers.Box.shopify_product_id(box);
  expect(products.length).toBe(1);
  expect(addOnProducts.length).toBe(1);
  expect(shopify_product_id).not.toBe(undefined);
});

test('resolvers: getBoxesByShopifyBox', async () => {
  const query = BoxQueries.getBoxesByShopifyBox;
  const info = mockResolveInfo(query);
  const input = {
    offset: 0,
    limit: 10,
    shopify_product_id: 31792460398333,
  }
  const data = await BoxResolvers.Query.getBoxesByShopifyBox(null, { input }, { models }, info);

  expect(parseInt(data.count)).toBe(1);
  expect(data.rows.length).toBe(1);

  const box = data.rows[0];
  const shopify_product_id = await BoxResolvers.Box.shopify_product_id(box);
  expect(parseInt(shopify_product_id)).toBe(31792460398333);
});

test('resolvers: getBoxesByDelivered', async () => {
  const query = BoxQueries.getBoxesByDelivered;
  const info = mockResolveInfo(query);
  const input = {
    offset: 0,
    limit: 10,
    delivered: UTCDateOnly(),
  }
  const data = await BoxResolvers.Query.getBoxesByDelivered(null, { input }, { models }, info);

  expect(data.count).toBe(1);
  expect(data.rows.length).toBe(1);

  const box = data.rows[0];
  const products = await BoxResolvers.Box.products(box);
  const addOnProducts = await BoxResolvers.Box.addOnProducts(box);
  const shopify_product_id = await BoxResolvers.Box.shopify_product_id(box);
  expect(products.length).toBe(1);
  expect(addOnProducts.length).toBe(1);
  expect(shopify_product_id).not.toBe(undefined);
});

test('resolvers: getBoxDeliveredAndCount', async () => {
  const data = await BoxResolvers.Query.getBoxDeliveredAndCount(null, {}, { models });
  expect(data.length).toBe(1);

  const row = data[0];
  expect(parseInt(row.count)).toBe(1);
  expect(new Date(row.delivered).toString()).toBe(UTCDateOnly().toString());
});

test('resolvers: createBox and add products', async () => {
  const input = {
    shopify_product_id: 31792460398333,
    shopify_title: "Large Box",
    shopify_handle: "large-box",
    shopify_variant_id: 31792460398555,
    shopify_price: 3500,
    delivered: new Date(),
  };
  let box = await BoxResolvers.Mutation.createBox(null, { input }, { models });

  box = await models.Box.findOne(
    {
      where: { id: box.id },
      include: [models.Product, models.ShopifyBox]
    }
  );
  expect(box.Products.length).toBe(0);

  const initialBox = await models.Box.findOne({
    where: { id: 1 },
    attributes: ['id'],
    include: {
      model: models.Product,
      attributes: ['shopify_id'],
      through: { attributes: ['isAddOn']},
    }
  });
  const productIds = initialBox.Products
    .filter(product => !product.BoxProduct.isAddOn)
    .map(product => `gid://shopify/Product/${product.shopify_id}`);
  const addOnIds = initialBox.Products
    .filter(product => product.BoxProduct.isAddOn)
    .map(product => `gid://shopify/Product/${product.shopify_id}`);

  await BoxProductResolvers.Mutation.addBoxProducts(null, {
    input: {
      productGids: productIds,
      boxId: box.id,
      isAddOn: false,
    }
  });
  await BoxProductResolvers.Mutation.addBoxProducts(null, {
    input: {
      productGids: addOnIds,
      boxId: box.id,
      isAddOn: true,
    }
  });

});
