const { gql } = require('@apollo/client');

/*
    orders: [Order]
    shopify_box: [ShopifyBox]
    */
const box = gql`
  type Box {
    id: ID!
    delivered: String!
    shopify_title: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
    createdAt: String!
    updatedAt: String!
    products: [Product]
  }

  type BoxDate {
    delivered: String
    count: Int
  }

  input BoxInput {
    delivered: String
    shopify_title: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input BoxUpdateInput {
    id: ID!
    delivered: String
    shopify_title: String
    shopify_handle: String
    shopify_variant_id: BigInt
    shopify_price: Int
  }

  input BoxSearchInput {
    delivered: String
  }

  input BoxIdInput {
    id: ID!
  }

  input BoxShopifyIdInput {
    shopify_id: BigInt!
  }

  extend type Query {
    getBoxDates: [BoxDate]
    getBox(input: BoxIdInput!): Box
    getAllBoxes: [Box]
    getBoxes(input: BoxSearchInput!): [Box]
    getCurrentBoxes(input: BoxSearchInput!): [Box]
    getBoxProducts(input: BoxIdInput!): Box
    getBoxesByShopifyId(input: BoxShopifyIdInput!): [Box]
  }

  extend type Mutation {
    createBox(input: BoxInput!): Box
    updateBox(input: BoxUpdateInput!): Box
    deleteBox(input: BoxIdInput!): Int
  }
`;

module.exports = box;

