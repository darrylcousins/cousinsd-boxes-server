const { gql } = require('@apollo/client');

const product = gql`
  type Product {
    id: ID!
    shopify_title: String!
    shopify_id: BigInt!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
    shopify_gid: String!
    available: Boolean!
    createdAt: String!
    updatedAt: String!
    boxes: [Box]
    isAddOn: Boolean
  }

  input ProductInput {
    title: String!
    available: Boolean
    shopify_id: BigInt!
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
  }

  input ProductUpdateInput {
    id: ID!
    shopify_title: String
    shopify_id: BigInt
    shopify_handle: String!
    shopify_variant_id: BigInt!
    shopify_price: Int!
    available: Boolean
  }

  input ProductAvailableInput {
    id: ID!
    available: Boolean!
  }

  extend type Query {
    getProduct(input: IdInput!): Product
    getProducts(input: IdsInput!): [Product]
    getAllProducts: [Product]
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(input: ProductUpdateInput!): Product
    deleteProduct(input: IdInput!): Int
    toggleProductAvailable(input: ProductAvailableInput!): Product
  }
`;

module.exports = product;

