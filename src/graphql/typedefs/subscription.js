const { gql } = require("apollo-server-koa");

const subscription = gql`
  type Subscription {
    id: ID!
    uid: UUID!
    frequency: String!
    current_cart: JSON!
    last_cart: JSON!
    shopify_product_id: BigInt!
    shopify_customer_id: BigInt!
    shopify_box_title: String!
    subscriber: Subscriber
    createdAt: String!
    updatedAt: String!
    orders: [Order]
  }

  input SubscriptionInput {
    id: ID
    uid: UUID!
    frequency: String!
    current_cart: JSON!
    last_cart: JSON!
    shopify_product_id: BigInt!
    shopify_customer_id: BigInt!
  }

  input SubscriptionUpdateInput {
    uid: UUID!
    current_cart: JSON!
    frequency: String!
    last_cart: JSON
    shopify_product_id: BigInt
  }

  input SubscriptionUUIDInput{
    uid: UUID!
  }

  input SubscriptionFilterInput {
    SubscriberUUID: UUID
  }

  extend type Query {
    getSubscription(input: SubscriptionUUIDInput!): Subscription
    getSubscriptions(input: SubscriptionFilterInput!): [Subscription]
  }

  extend type Mutation {
    createSubscription(input: SubscriptionInput!): Subscription
    updateSubscription(input: SubscriptionUpdateInput!): Subscription
    deleteSubscription(input: SubscriptionUUIDInput!): UUID
  }
`;

module.exports = subscription;


