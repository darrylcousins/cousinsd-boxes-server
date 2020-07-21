const { gql } = require('@apollo/client');

const PRODUCT_PARTS = gql`
  fragment productParts on Product {
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
  }
`;

const ADDON_PRODUCT_PARTS = gql`
  fragment addOnProductParts on Product {
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
`;

