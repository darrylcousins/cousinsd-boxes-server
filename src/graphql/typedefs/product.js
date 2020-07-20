const { gql } = require('@apollo/client');

const product = gql`
  type Product {
    id: ID!
    shopify_title: String!
    shopify_id: BigInt!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
    available: Boolean!
    createdAt: String!
    updatedAt: String!
    boxes: [Box]
  }

  input ProductInput {
    title: String!
    available: Boolean
    shopify_id: BigInt!
    shopify_gid: String!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input ProductUpdateInput {
    id: ID!
    title: String
    available: Boolean
    shopify_id: BigInt
    shopify_gid: String
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input ProductIdInput{
    id: ID!
  }

  input ProductAvailableInput {
    id: ID!
    available: Boolean!
  }

  extend type Query {
    getProduct(input: ProductIdInput!): Product
    getProducts: [Product]
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(input: ProductUpdateInput!): Product
    deleteProduct(input: ProductIdInput!): Int
    toggleProductAvailable(input: ProductAvailableInput!): Product
  }
`;

module.exports = product;

