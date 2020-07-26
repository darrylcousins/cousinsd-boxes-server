const { gql } = require('@apollo/client');
const { parse, parseValue, print } = require('graphql');
const { Source } = require('graphql');
const client = require('./../config/server/client');
const { getQueryFields, filterFields, UTCDateOnly } = require('../../src/lib');
const { BoxQueries, BoxMutations } = require('../../src/graphql/queries');
const { BoxProductQueries, BoxProductMutations } = require('../../src/graphql/queries');
const models = require('../../src/db/models');
const { setUp, tearDown, createBoxWithProducts } = require('./../config/initdb');

afterAll(() => {
  return models.BoxProduct.destroy({where: {}})
    .then(() => models.Product.destroy({where: {}}))
    .then(() => models.Box.destroy({where: {}}));
});

beforeAll(() => {
  return createBoxWithProducts();
});

test('graphql: sanity check', async () => {
  const result = await client.query({
      query: gql`query { hello }`,
    });
  expect(result.data.hello).toBe('world');
});

/*
test('graphql: get box', async () => {
  const query = BoxQueries.getBox;
  const input = { id: 1 };
  const variables = { input };
  const { data }  = await client.query({ query, variables });
});

test('graphql: get all boxes', async () => {
  const query = BoxQueries.getAllBoxes;
  const fields = getQueryFields(query).getAllBoxes;
  const { data } = await client.query({ query });
  const boxes = data.getAllBoxes;
  const boxFields = filterFields(fields);
  const boxKeys = Object.keys(boxes[0]);
  expect(boxFields.filter(field => boxKeys.indexOf(field) === -1).length).toBe(0);
  const productFields = filterFields(fields.products);
  const productKeys = Object.keys(boxes[0].products[0]);
  expect(productFields.filter(field => productKeys.indexOf(field) === -1).length).toBe(0);
  const addOnProductKeys = Object.keys(boxes[0].addOnProducts[0]);
  expect(productFields.filter(field => addOnProductKeys.indexOf(field) === -1).length).toBe(0);
});

test('graphql: get boxes by shopify box', async () => {
  const query = BoxQueries.getBoxesByShopifyBox;
  const fields = getQueryFields(query).getBoxesByShopifyBox;
  const variables = {
    input: {
      shopify_product_id: 31792460398333,
      offset: 0,
      limit: 10,
    }
  };
  const { data } = await client.query({ query, variables });
  const boxes = data.getBoxesByShopifyBox;
  expect(boxes.count).toBe(1);
  expect(boxes.rows.length).toBe(1);

  const box = boxes.rows[0];
  expect(box.shopify_product_id).toBe(31792460398333);

});

test('graphql: get boxes by delivered date', async () => {
  const query = BoxQueries.getBoxesByDelivered;
  const fields = getQueryFields(query).getBoxesByDelivered;
  const variables = {
    input: {
      delivered: UTCDateOnly(),
      offset: 0,
      limit: 10,
    }
  };
  const { data } = await client.query({ query, variables });
  const boxes = data.getBoxesByDelivered;

  expect(boxes.count).toBe(1);
  expect(boxes.rows.length).toBe(1);

  const box = boxes.rows[0];
  expect(box.products.length).toBe(1);
  expect(box.addOnProducts.length).toBe(1);
  expect(box.shopify_product_id).not.toBe(undefined);
});

test('graphql: get box delivered and count', async () => {
  const query = BoxQueries.getBoxDeliveredAndCount;
  const { data } = await client.query({ query });
  const res = data.getBoxDeliveredAndCount;
  expect(res.length).toBe(1);

  const row = res[0];
  expect(row.count).toBe(1);
  expect(new Date(row.delivered).toString()).toBe(UTCDateOnly().toString());
});

test('graphql: create box and add products', async () => {
  const initialBox = await models.Box.findOne({
    include: models.Product
  });
  
  let mutation = BoxMutations.createBox;
  let input = {
    shopify_product_id: 31792460398333,
    shopify_title: "Large Box",
    shopify_handle: "large-box",
    shopify_variant_id: 31792460398555,
    shopify_price: 3500,
    delivered: new Date(),
  };
  let variables = { input };
  let { data } = await client.mutate({ mutation, variables });
  let box = data.createBox;

  expect(box.shopify_product_id).toBe(input.shopify_product_id);
  expect(box.products.toString()).toBe([].toString());

  const productIds = initialBox.getProducts()
    .map(product => `gid://shopify/Product/${product.shopify_id}`);
  const addOnIds = initialBox.getAddOnProducts()
    .map(product => `gid://shopify/Product/${product.shopify_id}`);

  mutation = BoxProductMutations.addBoxProducts;
  input = {
    boxId: box.id,
    productGids: productIds,
    isAddOn: false,
  };
  variables = { input };
  await client.mutate({ mutation, variables });
  mutation = BoxProductMutations.addBoxProducts;
  input = {
    boxId: box.id,
    productGids: addOnIds,
    isAddOn: true,
  };
  variables = { input };
  await client.mutate({ mutation, variables });

  query = BoxQueries.getBox;
  input = { id: box.id };
  variables = { input };
  let result  = await client.query({ query, variables });
  let gotBox = result.data.getBox;
  expect(parseInt(gotBox.products[0].id)).toBe(initialBox.getProducts()[0].id);
  expect(parseInt(gotBox.addOnProducts[0].id)).toBe(initialBox.getAddOnProducts()[0].id);
});
*/
