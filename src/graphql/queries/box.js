const { gql } = require('@apollo/client');
//const { FRAGMENT_PRODUCT_ARRAY } = require('./product');

const ProductParts = `
  id
  isAddOn
  shopify_title
  shopify_handle
  shopify_id
  shopify_variant_id
  shopify_price
  available
`;

const BoxParts = `
  id
  shopify_title
  shopify_handle
  shopify_variant_id
  shopify_product_id
  shopify_price
  delivered
  products {
    ${ProductParts}
  }
  addOnProducts {
    ${ProductParts}
  }
`;

// two fragments are identical but wouldn't work on a single definition
const BoxQueries = {
  getAllBoxes: gql`
    query {
      getAllBoxes {
        ${BoxParts}
      }
    }
  `,
  getBoxesByShopifyBox: gql`
    query getBoxesByShopifyBox($input: BoxShopifyBoxSearchInput!) {
      # input: shopify_product_id, offset, limit
      getBoxesByShopifyBox(input: $input) {
        count
        rows {
          ${BoxParts}
        }
      }
    }
  `,
  getBoxesByDelivered: gql`
    query getBoxesByDelivered($input: BoxDeliveredSearchInput!) {
      # input: delivered, offset, limit
      getBoxesByDelivered(input: $input) {
        count
        rows {
          ${BoxParts}
        }
      }
    }
  `,
  getBoxDeliveredAndCount: gql`
    query {
      getBoxDeliveredAndCount {
        delivered
        count
      }
    }
  `,
}

const BoxMutations = {
  createBox: gql`
    mutation createBox($input: BoxInput!) {
      # input: delivered, shopify_title, shopify_handle, shopify_variant_id, shopify_product_id, shopify_price
      createBox(input: $input) {
        ${BoxParts}
      }
    }
  `,
}

module.exports = {
  BoxQueries,
  BoxMutations,
};
