const { gql } = require('@apollo/client');

const shopify_box = gql`
  type ShopifyBox {
    id: ID!
    shopify_product_id: BigInt!
    shopify_product_gid: String!
    shopify_title: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
    boxes: [Box]
    subscriptionTypes: [SubscriptionType]
  }
`;

module.exports = shopify_box;
