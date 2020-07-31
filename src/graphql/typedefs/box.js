const { gql } = require('@apollo/client');

/*
    orders: [Order]
    */
const box = gql`
  type Box {
    id: ID!
    delivered: String!
    products: [Product!]
    addOnProducts: [Product!]
    shopifyBox: ShopifyBox!
    createdAt: String!
    updatedAt: String!
  }

  input BoxDuplicateInput {
    id: ID!
    delivered: String!
  }

  input BoxInput {
    delivered: String!
    shopify_product_id: BigInt!
    shopify_title: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input BoxUpdateInput {
    id: ID!
    delivered: String
    shopify_product_id: BigInt
    shopify_title: String
    shopify_handle: String
    shopify_variant_id: BigInt
    shopify_price: Int
  }

  input BoxDeliveredSearchInput {
    delivered: String!
    offset: Int!
    limit: Int!
  }

  input BoxDeliveredInput {
    delivered: String!
  }

  input BoxShopifyBoxSearchInput {
    shopify_product_id: BigInt!
    offset: Int!
    limit: Int!
  }

  type BoxCountAndRows {
    rows: [Box]
    count: Int
  }

  extend type Query {
    getBox(input: IdInput!): Box!
    getBoxProducts(input: IdInput!): Box!
    getAllBoxes: [Box]
    getBoxesDeliveredAndCount: [DeliveredAndCount]
    getBoxesByDelivered(input: BoxDeliveredSearchInput): BoxCountAndRows
    getAllBoxesByDelivered(input: BoxDeliveredInput): [Box]
    getBoxesByShopifyBox(input: BoxShopifyBoxSearchInput): BoxCountAndRows
  }

  extend type Mutation {
    createBox(input: BoxInput!): Box
    updateBox(input: BoxUpdateInput!): Box
    deleteBox(input: IdInput!): Int
    duplicateBox(input: BoxDuplicateInput!): Box
  }
`;

module.exports = box;
