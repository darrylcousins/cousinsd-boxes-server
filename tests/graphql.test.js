const { gql } = require('@apollo/client');
const client = require('./config/server/client');

test('get product', async () => {
  const result = await client.query({
      query: gql`query { hello }`,
    });
  expect(result.data.hello).toBe('world');
});

test('get all boxes', async () => {
  const { data } = await client.query({
    query: gql`query {
        getAllBoxes {
          shopify_title
          shopify_handle
          products {
            shopify_title
            shopify_handle
          }
        }
      }`,
    });
  console.log(JSON.stringify(data, null, 2));
});
