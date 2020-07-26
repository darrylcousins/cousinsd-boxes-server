const { gql } = require('@apollo/client');

const ShopifyMutations = {
  productUpdate: gql`
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
};

const ShopifyQueries = {
  getOrder: gql`
    query order($id: ID!) {
      order(id: $id) {
        id
        name
      }
    }
  `,
};

module.exports = {
  ShopifyMutations,
  ShopifyQueries,
};

