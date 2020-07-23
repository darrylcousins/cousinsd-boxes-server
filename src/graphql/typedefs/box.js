const { gql } = require('@apollo/client');

/*
    orders: [Order]
    */
const box = gql`
  type Box {
    id: ID!
    delivered: String!
    shopify_title: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_product_id: BigInt!
    shopify_product_gid: String!
    shopify_price: Int!
    createdAt: String!
    updatedAt: String!
    products: [Product]
    addOnProducts: [Product]
  }

  input BoxIdInput {
    id: ID!
  }

  input BoxInput {
    delivered: String
    shopify_title: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_product_id: BigInt!
    shopify_price: Int!
  }

  input BoxUpdateInput {
    id: ID!
    delivered: String
    shopify_title: String
    shopify_handle: String
    shopify_variant_id: BigInt
    shopify_product_id: BigInt!
    shopify_price: Int
  }

  input BoxDeliveredSearchInput {
    delivered: String!
    offset: Int!
    limit: Int!
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
    getAllBoxes: [Box]
    getBoxDeliveredAndCount: [DeliveredAndCount]
    getBoxesByDelivered(input: BoxDeliveredSearchInput): BoxCountAndRows
    getBoxesByShopifyBox(input: BoxShopifyBoxSearchInput): BoxCountAndRows
  }

  extend type Mutation {
    createBox(input: BoxInput!): Box
    updateBox(input: BoxUpdateInput!): Box
    deleteBox(input: BoxIdInput!): Int
  }
`;

module.exports = box;

