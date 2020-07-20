const { gql } = require('@apollo/client');

const shopify_box = gql`
  type ShopifyBox {
    id: ID!
    shopify_product_id: BigInt!
  }
`;

module.exports = shopify_box;
