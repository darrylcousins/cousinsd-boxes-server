const { gql } = require('@apollo/client');
const { parse, parseValue, print } = require('graphql');
const { Source } = require('graphql');
const client = require('./../config/server/client');
const { getQueryFields, filterFields, UTCDateOnly } = require('../../src/lib');
const { BoxQueries, BoxMutations } = require('../../src/graphql/queries');
const models = require('../../src/db/models');

test('graphql: sanity check', async () => {
  const result = await client.query({
      query: gql`query { hello }`,
    });
  expect(result.data.hello).toBe('world');
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

test('graphql: create box', async () => {
  const mutation = BoxMutations.createBox;
  const input = {
    shopify_product_id: 31792460398333,
    shopify_title: "Large Box",
    shopify_handle: "large-box",
    shopify_variant_id: 31792460398555,
    shopify_price: 3500,
    delivered: new Date(),
  };
  const variables = { input };
  const { data } = await client.mutate({ mutation, variables });
  const box = data.createBox;

  expect(box.shopify_product_id).toBe(input.shopify_product_id);
  expect(box.products.toString()).toBe([].toString());

  await models.Box.findOne({ where: { id: box.id } })
    .then(res => res.destroy());

});
