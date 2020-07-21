const { gql } = require('@apollo/client');
//const { FRAGMENT_PRODUCT_ARRAY } = require('./product');


const FUCK = gql`
  query {
    getAllBoxes {
      id
      shopify_title
      shopify_handle
      shopify_variant_id
      shopify_price
      delivered
      products {
        id
        isAddOn
        shopify_title
        shopify_handle
        shopify_id
        shopify_variant_id
        shopify_price
        available
      }
      addOnProducts {
        id
        isAddOn
        shopify_title
        shopify_handle
        shopify_id
        shopify_variant_id
        shopify_price
        available
      }
    }
  }
`;

const PRODUCT_BITS = gql`
  fragment productBits on Product {
    id
  }
`;

const GET_ALL_BOXES = gql`
    query {
      getAllBoxes {
        id
        products {
          ...productBits
        }
        addOnProducts {
          id
        }
      }
    }
    ${PRODUCT_BITS}
`;

module.exports = {
  GET_ALL_BOXES
};
