const { gql } = require('@apollo/client');
const { makeExecutableSchema } = require('graphql-tools');

const order = gql`
  type Order {
    id: ID!
    delivered: String!
    shopify_name: String!
    shopify_order_id: BigInt!
    shopify_product_id: BigInt!
    shopify_line_item_id: BigInt!
    shopify_customer_id: BigInt!
    createdAt: String!
    updatedAt: String!
  }

  type OrdersCountAndRows {
    rows: [Order]
    count: Int
  }

  input OrderSearchInput {
    delivered: String!
    offset: Int!
    limit: Int!
    shopify_product_id: BigInt
    shopify_name: String
  }

  extend type Query {
    getOrders: [Order]
  }
`;

module.exports = order;
