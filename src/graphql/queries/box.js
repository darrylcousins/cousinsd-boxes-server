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
  shopify_price
  delivered
  createdAt
`;

// two fragments are identical but wouldn't work on a single definition
const BoxQueries = {
  getAllBoxes: gql`
    query {
      getAllBoxes {
        ${BoxParts}
        products {
          ${ProductParts}
        }
        addOnProducts {
          ${ProductParts}
        }
      }
    }
  `,
}

module.exports = {
  BoxQueries,
};
