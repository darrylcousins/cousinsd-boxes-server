const { gql } = require('@apollo/client');
const { parse, parseValue, print } = require('graphql');
const { Source } = require('graphql');
const client = require('./../config/server/client');
const { getQueryFields, filterFields } = require('../../src/lib');
const { BoxQueries } = require('../../src/graphql/queries');

test('hello', async () => {
  const result = await client.query({
      query: gql`query { hello }`,
    });
  expect(result.data.hello).toBe('world');
});

test('get all boxes', async () => {
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

/*
test('get selected boxes', async () => {
  const query = BoxQueries.getAllBoxes;
  const fields = getQueryFields(query).getSelectedBoxes;
  const variables = {
    input: {
      delivered: new Date(),
      offset: 0,
      limit: 10,
    }
  };
  const { data } = await client.query({ query, variables });
  const boxes = data.getAllBoxes;
});
*/

