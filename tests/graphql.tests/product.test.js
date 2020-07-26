const { gql } = require('@apollo/client');
const { parse, parseValue, print } = require('graphql');
const { Source } = require('graphql');
const client = require('./../config/server/client');
const { getQueryFields, filterFields, UTCDateOnly } = require('../../src/lib');
const { ProductQueries, ProductMutations } = require('../../src/graphql/queries');
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

test('graphql: get all products', async () => {

  return true;
  /*
  const query = ProductQueries.getAllProducts;
  const fields = getQueryFields(query).getAllProducts;
  console.log(fields);
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
  */
});

