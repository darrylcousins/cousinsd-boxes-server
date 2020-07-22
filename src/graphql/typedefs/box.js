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
    addOnProducts: [Product]
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
    delivered: String!
    offset: Int!
    limit: Int!
  }

  extend type Query {
    getAllBoxes: [Box]
    getSelectedBoxes(input: BoxSearchInput): [Box]
  }
`;

module.exports = box;

