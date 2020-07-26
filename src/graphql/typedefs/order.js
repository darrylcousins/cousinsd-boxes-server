const { gql } = require('@apollo/client');
const { makeExecutableSchema } = require('graphql-tools');

const order = gql`
  type Order {
    id: ID!
    delivered: String!
    shopify_title: String!
    shopify_order_id: BigInt!
    shopify_line_item_id: BigInt!
    shopify_product_id: BigInt!
    shopify_customer_id: BigInt
    createdAt: String!
    updatedAt: String!
  }

  type OrdersCountAndRows {
    rows: [Order]
    count: Int
  }

  input OrderSearchInput {
    delivered: String
    offset: Int
    limit: Int
    shopify_product_id: BigInt
    shopify_title: String
  }

  type OrdersDeliveredAndCount {
    count: Int!
    delivered: String!
  }

  extend type Query {
    getOrders(input: OrderSearchInput!): OrdersCountAndRows
    getOrdersDeliveredAndCount: [OrdersDeliveredAndCount]
  }
`;

module.exports = order;
