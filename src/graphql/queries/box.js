const { gql } = require('@apollo/client');

const GET_ALL_BOXES = gql`query {
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
}`;

module.exports = {
  GET_ALL_BOXES
};
