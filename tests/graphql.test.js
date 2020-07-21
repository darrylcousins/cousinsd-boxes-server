const { gql } = require('@apollo/client');
const client = require('./config/server/client');
const { getQueryFields, filterFields } = require('../src/lib');
const {
  GET_ALL_BOXES,
} = require('../src/graphql/queries');

test('hello', async () => {
  const result = await client.query({
      query: gql`query { hello }`,
    });
  expect(result.data.hello).toBe('world');
});

test('get all boxes', async () => {
  debugger;
  const { data } = await client.query({
    query: GET_ALL_BOXES
  });
  const fields = getQueryFields(GET_ALL_BOXES);
  //console.log(data);
  /*
  const boxes = data.getAllBoxes;
  const fields = getQueryFields(GET_ALL_BOXES);

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
