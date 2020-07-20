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

  type OrderDate {
    delivered: String!
    count: Int!
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

  input OrderDuplicateInput {
    delivered: String!
    shopify_product_id: BigInt!
    shopify_customer_id: BigInt!
  }

  input OrderIdInput {
    id: ID!
  }

  input OrderShopifyUpdateInput {
    shopify_order_id: BigInt!
    shopify_name: String!
  }

  extend type Query {
    getOrderDates: [OrderDate]
    getOrder(input: OrderIdInput!): Order
    getOrders(input: OrderSearchInput!): OrdersCountAndRows
    checkOrderDuplicate(input: OrderDuplicateInput!): Order
  }

  extend type Mutation {
    updateOrderName(input: OrderShopifyUpdateInput!): Order
  }
`;

module.exports = order;
